import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  Table,
  message,
  Divider,
  Modal,
  Tabs,
  Tag,
  Popconfirm,
} from 'antd';

import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { createShiftLog, deleteShiftLog, getAllShiftLogs, getShiftsBySecurityId } from '@/services/logshift.service';
import { getLocationsOfSecurity } from '@/services/securityLocationAllocation.service';
import { getAllSecurities } from '@/services/security-managment.service';
import Security from '@/types/jk/security';
import Location from '@/types/jk/location';
import type { TabsProps } from 'antd';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

const { Option } = Select;
const { TabPane } = Tabs;

export default function SecurityShiftLogManager() {
  const [form] = Form.useForm();
  const [securities, setSecurities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedSecurity, setSelectedSecurity] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSecurity, setFilterSecurity] = useState(null);

  const { notifySuccess, notifyError, contextHolder } = useNotification();

  useEffect(() => {
    loadSecurities();
    loadAllShifts();
  }, []);

  const loadSecurities = async () => {
    setLoading(true);
    try {
      const { data } = await getAllSecurities();
      setSecurities(data);
    } catch {
      notifyError('ERROR', 'Failed to load securities');
    }finally {
      setLoading(false);
    }
  };

  const loadLocations = async (securityId: any) => {
    setLoading(true);
    try {
      const { data } = await getLocationsOfSecurity(securityId);
      setLocations(data);
    } catch {
      notifyError('ERROR', 'Failed to load locations');
    }finally {
      setLoading(false);
    }
  };

  const loadAllShifts = async () => {
    try {
      setLoading(true);
      const { data } = await getAllShiftLogs();
      setShifts(data);
    } catch {
      notifyError('ERROR', 'Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const loadShiftsBySecurity = async (securityId: any) => {
    try {
      setLoading(true);
      const { data } = await getShiftsBySecurityId(securityId);
      setShifts(data);
    } catch {
      notifyError('ERROR', 'Failed to filter shifts');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySelect = (value: any) => {
    setSelectedSecurity(value);
    loadLocations(value);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        shift_date: values.shift_date.format('YYYY-MM-DD'),
        start_time: values.start_time.format('HH:mm'),
        end_time: values.end_time.format('HH:mm'),
      };
      await createShiftLog(payload);
      notifySuccess('SUCCESS', 'Shift logged');
      form.resetFields();
      setLocations([]);
      setSelectedSecurity(null);
      loadAllShifts();
    } catch {
      message.error('Failed to log shift');
    }finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    setLoading(true);
    try {
      await deleteShiftLog(id);
      notifySuccess('SUCCESS', 'Shift deleted successfully');
      loadAllShifts();
    } catch {
      notifyError('ERROR', 'Delete failed');
    }finally{
      setLoading(false);
    }
  };

  console.log(shifts);
  const columns = [
    { title: 'Security Name', dataIndex: ['security', 'securityName'],},
    { title: 'Location', dataIndex:[ 'location' ,'locationName'] },
    { title: 'Date', dataIndex: 'shift_date' },
    { title: 'Start', dataIndex: 'start_time' },
    { title: 'End', dataIndex: 'end_time' },
    { title: 'Hours', dataIndex: 'total_hours' },
    {
      title: 'Pay',
      dataIndex: 'security_total_pay_for_shift',
      render: (val: any) => <Tag color="blue">Rs. {val}</Tag>,
    },
    {
      title: 'Actions',
      render: (_:any, record:any) => (
        <Popconfirm title="Delete shift?" onConfirm={() => handleDelete(record.id)}>
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  
const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Add Shift Log',
    children: ( <Card title="Add Shift Log"  className="shadow-lg">
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item label="Select Security" name="security_id" rules={[{ required: true }]}>            
          <Select placeholder="Select security" onChange={handleSecuritySelect} showSearch>
            {securities.map((sec:Security) => (
              <Option value={sec.securityId} key={sec.securityId}>
                {sec.securityName} ({sec.securityId})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Allocated Location" name="location_id" rules={[{ required: true }]}>            
          <Select placeholder="Select location">
            {locations.map((loc: Location) => (
              <Option value={loc.locationId} key={loc.locationId}>
                {loc.locationName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Date" name="shift_date" rules={[{ required: true }]}>            
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Start Time" name="start_time" rules={[{ required: true }]}>            
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>

        <Form.Item label="End Time" name="end_time" rules={[{ required: true }]}>            
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log Shift
          </Button>
        </Form.Item>
      </Form>
    </Card>),
  },
  {
    key: '2',
    label: 'View Shifts',
    children: (
      <Card title="Manage Shifts"  className="shadow-lg">
        <Tabs defaultActiveKey="1">
          <TabPane tab="All Shifts" key="1">
            <Table
              columns={columns}
              dataSource={shifts}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          <TabPane tab="Filter by Security" key="2">
            <Select
              placeholder="Select security to filter"
              className="w-full mb-2"
              onChange={(val) => {
                setFilterSecurity(val);
                loadShiftsBySecurity(val);
              }}
            >
              {securities.map((sec: Security) => (
                <Option value={sec.securityId} key={sec.securityId}>
                  {sec.securityName} ({sec.securityId})
                </Option>
              ))}
            </Select>

            <Table
              columns={columns}
              dataSource={shifts}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    ),
  },
];

  return (
    <div className="p-4">
       {contextHolder}
      {loading && <Loader/>}
      <Tabs defaultActiveKey="1" items={items}  />;
    </div>
  );
}

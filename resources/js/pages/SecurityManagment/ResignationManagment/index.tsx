import { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Table, Typography, Divider } from 'antd';
import dayjs from 'dayjs';
import { getAsset, resignSecurity } from '@/services/security-managment.service';
import Security from '@/types/jk/security';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

const { TextArea } = Input;
const { Text } = Typography;

const columnsAssets = [
  {
    title: 'Name',
    dataIndex: ['inventory_item', 'inventory_type', 'name'],
    key: 'name',
  },
  {
    title: 'Size',
    key: 'size',
    render: (item: any) =>
      item.inventory_item.inventory_type.track_size ? item.inventory_item.size : 'N/A',
  },
  {
    title: 'Condition',
    dataIndex: ['inventory_item', 'condition'],
    key: 'condition',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
];

interface Props {
  security: Security;
  onCancel: () => void;
}

export default function SecurityTerminationForm({
  security,
  onCancel,
}: Props) {
  const [form] = Form.useForm();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasReturnedAllAssets, setHasReturnedAllAssets] = useState(false);
  const { notifySuccess, notifyError, contextHolder } = useNotification();
  useEffect(() => {
    if (security?.securityId) {
      fetchAssets();
      
      // Set initial form values if security is already resigned
      if (security?.securityIsResigned) {
        form.setFieldsValue({
          resignationEffectiveDate: security.resignationEffectiveDate ? dayjs(security.resignationEffectiveDate) : null,
          resignationReason: security.resignationReason,
          resignationAdditionalInfo: security.resignationAdditionalInfo,
        });
        setHasReturnedAllAssets(security.hasReturnedAllAssets || false);
      }
    }
  }, [security]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await getAsset(security.securityId);
      const data = res?.data?.data || [];
      setAssets(data);
      setHasReturnedAllAssets(data.length === 0);
    } catch (err) {
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async(values: any) => {
    const payload = {
      ...values,
      hasReturnedAllAssets,
      securityIsResigned: true,
      securityStatus: hasReturnedAllAssets ? 500 : 400,
      resignationEffectiveDate: values.resignationEffectiveDate.format('YYYY-MM-DD')
    };
     setLoading(true);
    try {
      await resignSecurity(security.securityId, payload);
      notifySuccess('SUCCESS', 'Succesfullt Terminated Security');
      setTimeout(()=>{
        onCancel()
      },2000)
      
    } catch (error) {
      console.error('Error saving security:', error);
      notifyError('ERROR', 'Something Went Wrong , Please Try Again Later!');
   
    }finally{
       setLoading(false);
    }
  };

  return (
    <div>
       {loading && <Loader/>}
      {contextHolder}
      <Title type="danger" level={3}>Terminating {security.securityName}: ({security.securityId})</Title>
      <Divider orientation="left">Assigned Assets</Divider>
      {loading ? (
        <Text>Loading assets...</Text>
      ) : assets.length === 0 ? (
        <Text type="success">No assets assigned. All assets returned.</Text>
      ) : (
        <Table dataSource={assets} columns={columnsAssets} rowKey="id" pagination={false} />
      )}

      <Divider orientation="left">Resignation Details</Divider>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="resignationEffectiveDate"
          label="Resignation Effective Date"
          rules={[{ required: true, message: 'Please select the date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current < dayjs().endOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="resignationReason"
          label="Resignation Reason"
          rules={[{ required: true, message: 'Please provide a reason' }]}
        >
          <Input placeholder="Reason for resignation" />
        </Form.Item>

        <Form.Item name="resignationAdditionalInfo" label="Additional Information">
          <TextArea rows={3} placeholder="Optional notes" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
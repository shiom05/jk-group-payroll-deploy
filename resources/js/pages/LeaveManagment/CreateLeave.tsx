import { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Select, Input, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

const { TextArea } = Input;

const leaveReasons: { [key: string]: string[] } = {
  Annual: ['Vacation', 'Travel', 'Rest'],
  Casual: ['Family Matter', 'Personal Errand'],
  Sick: ['Fever', 'Medical Appointment', 'Flu'],
};

const CreateLeave = ({ onClose }: { onClose: () => void }) => {
  const [securities, setSecurities] = useState<any[]>([]);
  const [leaveType, setLeaveType] = useState('Annual');
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError, contextHolder } = useNotification();

  useEffect(() => {
    const fetchSecurities = async () => { 
      try { 
        setLoading(true)
        const response = await axios.get('/api/securities');
        setSecurities(response.data);
      } catch (error) {
        console.error('Error fetching securities:', error);
        notifyError('ERROR', 'Failed to fetch employees');
      }finally{
        setLoading(false)
      }
    };
    fetchSecurities();
  }, []);

  const handleSubmit = async (values: any) => {
    const leaveBody = {
      security_id: values.securityId,
      leave_type: leaveType,
      reason: values.reason,
      description: values.description,
      start_date: dayjs(values.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(values.endDate).format('YYYY-MM-DD'),
    };

    try {
      setLoading(true)
      await axios.post('api/security-leaves', leaveBody);
      notifySuccess('SUCCESS', 'Leave created successfully');
      onClose();
    } catch (error) {
      console.error('Failed to create leave:', error);
       notifyError('ERROR', 'Failed to create leave');
    }finally{
       setLoading(false)
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      {contextHolder}
      {loading && <Loader/>}
      <h2 className="mb-4 text-xl font-bold text-gray-700">Create Leave</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          leaveType: 'Annual',
        }}
      >
        <Form.Item label="Employee" name="securityId" rules={[{ required: true, message: 'Please select an employee' }]}>
          <Select placeholder="Select Employee">
            {securities.map((user: any) => (
              <Select.Option key={user.securityId} value={user.securityId}>
                {user.securityName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Leave Type" name="leaveType" initialValue="Annual">
          <Select
            value={leaveType}
            onChange={(value) => {
              setLeaveType(value);
              form.setFieldsValue({ reason: undefined });
            }}
          >
            {['Annual', 'Casual', 'Sick'].map(type => (
              <Select.Option key={type} value={type}>{type}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Reason" name="reason" rules={[{ required: true, message: 'Please select a reason' }]}>
          <Select placeholder="Select Reason">
            {leaveReasons[leaveType].map(reason => (
              <Select.Option key={reason} value={reason}>
                {reason}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item
            label="Start Date"
            name="startDate"
            className="w-full"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            className="w-full"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateLeave;

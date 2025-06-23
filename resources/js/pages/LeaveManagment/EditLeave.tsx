import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, DatePicker, Card, Space, message } from 'antd';
import dayjs from 'dayjs';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

const { Option } = Select;
const { TextArea } = Input;

const leaveReasons: { [key: string]: string[] } = {
  Annual: ['Vacation', 'Travel', 'Rest'],
  Casual: ['Family Matter', 'Personal Errand'],
  Sick: ['Fever', 'Medical Appointment', 'Flu'],
};

const EditLeave = ({ leave, onClose, onUpdate }: { leave: any; onClose: () => void, onUpdate: () => void }) => {
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState<string>(leave?.leaveType);

  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError, contextHolder } = useNotification();
  
   console.log(leave)
  useEffect(() => {
    form.setFieldsValue({
      ...leave,
      start_date: dayjs(leave.start_date),
      end_date: dayjs(leave.end_date),
    });
  }, [leave, form]);

  const handleSubmit = async (values: any) => {
    const { security,updated_at,created_at,leave_id, ...rest} = leave;
    try {
       setLoading(true)
      await axios.put(`/api/security-leaves/${leave_id}`, {
        ...rest,
        ...values,
        //  dayjs(values.start_date).format('YYYY-MM-DD')
         start_date: values.start_date.format('YYYY-MM-DD'),
         end_date: values.end_date.format('YYYY-MM-DD'),
      });
      message.success('');
      notifySuccess('SUCCESS', 'Leave updated successfully');
      setTimeout(() => {
        onUpdate();
      },  1000);
    } catch (error) {
      notifyError('ERROR', 'Failed to update leave');
      console.error('Failed to update leave:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Edit Leave" className="mb-6 shadow-md">
       {contextHolder}
      {loading && <Loader/>}
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="leave_type" label="Leave Type" rules={[{ required: true }]}>
          <Select onChange={(value) => setSelectedType(value)}>
            {Object.keys(leaveReasons).map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
          <Select placeholder="Select Reason">
            {leaveReasons[selectedType || leave.leaveType]?.map((reason) => (
              <Option key={reason} value={reason}>
                {reason}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} />
        </Form.Item>

        <Space size="middle" style={{ display: 'flex' }}>
          <Form.Item name="start_date" label="Start Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="end_date" label="End Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Space>

        <div className="flex justify-end gap-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default EditLeave;

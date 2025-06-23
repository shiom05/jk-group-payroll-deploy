import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form, Input, Button, Select, DatePicker, Card, Typography, Alert, Spin, Row, Col, Space, InputNumber
} from 'antd';
import dayjs from 'dayjs';
import {
  fetchSecurities,
  fetchBlackMark,
  createBlackMark,
  updateBlackMark,
  SecurityBlackMark
} from '@/services/blackmark.service';
import Security from '@/types/jk/security';
import useNotification from '@/hooks/useNotification';

const { Title } = Typography;
const { Option } = Select;

interface BlackMarkFormProps{
    idEditing: boolean,
    BlackMark?: SecurityBlackMark | null,
    onCancel: ()=> void,
    security: Security

}

const BlackMarkForm = ({idEditing, BlackMark, onCancel, security}:BlackMarkFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('pending');
  const { notifySuccess, notifyError, contextHolder } = useNotification();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (idEditing && BlackMark) {
          setLoading(true);
        //   const blackMark = await fetchBlackMark(BlackMark?.id);
          form.setFieldsValue({
            ...BlackMark,
            incident_date: dayjs(BlackMark.incident_date),
            fine_effective_date: BlackMark.fine_effective_date ? dayjs(BlackMark.fine_effective_date) : null,
          });
          setStatus(BlackMark.status);
        }
      } catch (err) {
        console.error(err);
        notifyError('ERROR', 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [BlackMark?.id, form]);

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        security_id: security.securityId,
        incident_date: values.incident_date.format('YYYY-MM-DD'),
        fine_effective_date: values.fine_effective_date?.format('YYYY-MM-DD'),
      };

      console.log(payload)
      if (idEditing && BlackMark?.id) {
        await updateBlackMark(BlackMark?.id, payload);
      } else {
        await createBlackMark(payload);
      }

      notifySuccess('SUCCESS', 'Black mark saved successfully');
      setTimeout(() => {
        onCancel();
      }, 1000);
    } catch (err: any) {
      notifyError('ERROR', err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    'Theft',
    'Vacate a Point',
    'Alcohol/Drug',
    'Leave end date not return',
    'Other'
  ];

  return (
    <Card  style={{ maxWidth: 900, margin: 'auto' }} className='mt-20!'>
      <Title level={4}>{idEditing ? 'Edit Black Mark' : 'Add Black Mark'}</Title>
        {contextHolder}
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Row gutter={16}>
            {/* <Col span={12}>
              <Form.Item
                name="security_id"
                label="Security"
                rules={[{ required: true, message: 'Please select a security' }]}
              >
                <Select placeholder="Select security">
                  {securities.map((sec: Security) => (
                    <Option key={sec.securityId} value={sec.securityId}>{sec.securityName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> */}

            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select placeholder="Select type">
                  {typeOptions.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="incident_description"
                label="Incident Description"
                rules={[{ required: true, message: 'Description is required' }]}
              >
                <Input.TextArea rows={3} placeholder="Describe the incident..." />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="incident_date"
                label="Incident Date"
                rules={[{ required: true, message: 'Incident date is required' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="status"  label="Status" initialValue="pending">
                <Select disabled={!idEditing} onChange={(val) => setStatus(val)}>
                  <Option value="pending">Pending</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>

            {status === 'completed' && (
              <>
                <Col span={24}>
                  <Form.Item
                    name="inquiry_details"
                    label="Inquiry Details"
                    rules={[{ required: true, message: 'Inquiry details are required' }]}
                  >
                    <Input.TextArea rows={3} placeholder="Enter inquiry details..." />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="fine_amount"
                    label="Fine Amount"
                    rules={[{ required: true, message: 'Fine amount is required' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      prefix="Rs."
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="fine_effective_date"
                    label="Fine Effective Date"
                    rules={[{ required: true, message: 'Effective date is required' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </>
            )}

            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => onCancel()}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Card>
  );
};

export default BlackMarkForm;

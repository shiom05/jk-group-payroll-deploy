// src/components/SecurityCompensation.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Form, Input, InputNumber, DatePicker, message, Popconfirm, Typography } from 'antd';
import { 
  getCompensations, 
  createCompensation, 
  updateCompensation, 
  deleteCompensation,
  getCurrentMonthCompensations,
  SecurityCompensation
} from '@/services/compensation.service';
import dayjs from 'dayjs';
import Security from '@/types/jk/security';
import { PlusCircleFilled, EditOutlined } from '@ant-design/icons';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

interface CompensationSecurityProps {
  security: Security;
}

const CompensationSecurity = ({ security }: CompensationSecurityProps) => {
  const [compensations, setCompensations] = useState<SecurityCompensation[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingCompensation, setEditingCompensation] = useState<SecurityCompensation | null>(null);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError, contextHolder } = useNotification();

  useEffect(() => {
    loadCompensations();
  }, [security]);

  const loadCompensations = async () => {
    try {
      const data = security 
        ? await getCurrentMonthCompensations(security.securityId,  dayjs(new Date()).format('YYYY-MM-DD'))
        : await getCompensations();
      setCompensations(data);
    } catch (error) {
      message.error('Failed to load compensations');
    }
  };

  const showDrawer = (compensation: SecurityCompensation | null = null) => {
    if (compensation) {
      form.setFieldsValue({
        ...compensation,
        effective_date: dayjs(compensation.effective_date)
      });
      setEditingCompensation(compensation);
    } else {
      form.resetFields();
      setEditingCompensation(null);
    }
    setDrawerVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteCompensation(id);
      notifySuccess('SUCCESS', 'Compensation deleted');
      loadCompensations();
    } catch (error) {
      notifyError('ERROR', 'Failed to delete compensation');
    }finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const compensationData = {
        ...values,
        effective_date: values.effective_date.format('YYYY-MM-DD'),
        security_id: security?.securityId || values.security_id
      };

      if (editingCompensation) {
        await updateCompensation({ ...compensationData, id: editingCompensation.id });
        notifySuccess('SUCCESS', 'Compensation updated');
      } else {
        await createCompensation(compensationData);
        notifySuccess('SUCCESS', 'Compensation created');
      }
      setDrawerVisible(false);
      loadCompensations();
    } catch (error) {
      notifyError('ERROR', 'Failed to submit compensation');
    }finally {
      setLoading(false);
    }
  };

  const columns = [
      {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          render: (amount: number) => `Rs. ${amount}`,
      },
      {
          title: 'Reason',
          dataIndex: 'reason',
          key: 'reason',
      },
      {
          title: 'Effective Date',
          dataIndex: 'effective_date',
          key: 'effective_date',
          render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      },
      {
          title: 'Actions',
          key: 'actions',
          render: (_: any, record: SecurityCompensation) => (
              <>
                  <div className="flex flex-row gap-x-2">
                      <Button
                          icon={<EditOutlined />}
                          size="middle"
                          title="Edit the black mark or complete the black mark with fine amount"
                          onClick={() => showDrawer(record)}
                      >
                          Edit
                      </Button>
                      <Popconfirm title="Remove this Compensation?" onConfirm={() => handleDelete(record.id!)} okText="Yes" cancelText="No">
                          <Button danger>Remove</Button>
                      </Popconfirm>
                  </div>
              </>
          ),
      },
  ];

  return (
      <div style={{ padding: 24 }} className="mt-0">
         {contextHolder}
         {loading && <Loader />}
          <Typography.Title level={2} style={{ marginBottom: 20 }}>
              Security Compensation Managment
          </Typography.Title>
          <Button type="primary" size="large" icon={<PlusCircleFilled />} onClick={() => showDrawer()} style={{ marginBottom: 16 }}>
              Add Compensation
          </Button>

          <Table columns={columns} dataSource={compensations} rowKey="id" bordered />

          <Drawer
              title={editingCompensation ? 'Edit Compensation' : 'Add Compensation'}
              width={800}
              onClose={() => setDrawerVisible(false)}
              open={drawerVisible}
              // styles={{ paddingBottom: 80 }}
              footer={
                  <div style={{ textAlign: 'right' }}>
                      <Button onClick={() => setDrawerVisible(false)} style={{ marginRight: 8 }}>
                          Cancel
                      </Button>
                      <Button onClick={handleSubmit} type="primary">
                          Submit
                      </Button>
                  </div>
              }
          >
              <Form form={form} layout="vertical">
                  {!security && (
                      <Form.Item name="security_id" label="Security ID" rules={[{ required: true, message: 'Please select security' }]}>
                          <Input />
                      </Form.Item>
                  )}

                  <Form.Item name="amount" label="Amount (Rs.)" rules={[{ required: true, message: 'Please enter amount' }]}>
                      <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          step={0.01}
                          formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any) => value!.replace(/Rs.\s?|(,*)/g, '')}
                      />
                  </Form.Item>

                  <Form.Item name="reason" label="Reason" rules={[{ required: true, message: 'Please enter reason' }]}>
                      <Input.TextArea rows={4} />
                  </Form.Item>

                  <Form.Item name="effective_date" label="Effective Date" rules={[{ required: true, message: 'Please select date' }]}>
                      <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                  </Form.Item>
              </Form>
          </Drawer>
      </div>
  );
};

export default CompensationSecurity;
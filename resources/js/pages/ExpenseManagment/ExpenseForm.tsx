import { getSecuiryDropdownOptions } from '@/utils/security';
import { Form, Input, InputNumber, Button, Select, DatePicker, message } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useForm } from '@inertiajs/react';
import ViewExpense from './ViewExpense';
import { createExpenseSecurity, createLoanSecurity } from '@/services/security-managment.service';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

interface ExpenseFormProps {
  securityList: any[];
  onCancel: () => void;
}

export default function ExpenseForm({ securityList, onCancel }: ExpenseFormProps) {
  const { data, setData, reset } = useForm<any>({
    type: null,
    description: '',
    date: null,
    amount: null,
    security_id: null,
    installments: null,
  });

  const [mode, setMode] = useState<'security' | 'general'>('security');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError, contextHolder } = useNotification();
  
  useEffect(() => {
    setOptions(getSecuiryDropdownOptions(securityList));
  }, [securityList]);

  // const handleModeChange = (selectedMode: 'security' | 'general') => {
  //   setMode(selectedMode);
  //   if (selectedMode === 'general') {
  //     setData('securityId', null);
  //   }
  // };

  const handleFinish = async () => {
      if (!data.type || !data.date || !data.amount || (mode === 'security' && !data.security_id)) {
          notifyError('ERROR', 'Please fill all required fields');
          return;
      }

      // const formattedDate = typeof data.date === 'string' ? data.date : dayjs(data.date).format('YYYY-MM-DD');
       const formattedDate = data.date;
      if (mode === 'general' && data.type === 'Loan') {
         notifyError('ERROR', 'Loans can only be added to securities');
          return;
      }

      if (data.type === 'Loan') {
          const loanPayload = {
              security_id: data.security_id,
              total_amount: data.amount,
              start_date: formattedDate,
              installments: data.installments,
              description: data.description,
          };

          try {
              setLoading(true);
              console.log(loanPayload);
              const response = await createLoanSecurity(loanPayload);
              console.log(response);
              notifySuccess('SUCCESS', 'Successfully Created Loan');
              setTimeout(() => {
                  onCancel();
              }, 1000);
          } catch (error) {
              notifyError('ERROR', 'Failed to Create Loan');
          } finally {
              setLoading(false);
          }
      } else {
          const { installments, ...rest } = data;
          const expensePayload = {
              ...rest,
              date: formattedDate,
          };

          try {
              setLoading(true);
              const result = await createExpenseSecurity(expensePayload);
              notifySuccess('SUCCESS', 'Successfully Created Expense');
              setTimeout(() => {
                  onCancel();
              }, 1000);
          } catch (error) {
              notifyError('ERROR', 'Failed to Create Expense');
          } finally {
              setLoading(false);
          }
      }
      reset();
  };

  const submitButtonDiabled = ()=>{
    return !data.security_id || !data.amount || !data.date || !data.description || !data.type || (data.type ==="loan" && !data.installments)
  }

  return (
    <Form layout="vertical" onFinish={handleFinish} className="space-y-4 rounded-lg bg-white p-6! shadow-md">
      {contextHolder}
      {loading && <Loader/>}
      <h2 className="text-2xl font-semibold text-gray-700">Add {mode === 'security' ? 'Security' : 'General'} Expense</h2>

      {mode === 'security' && (
        <Form.Item
          label="Select Security"
          className="mb-4"
          required
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            placeholder="Search Security"
            optionFilterProp="label"
            className="w-full"
            value={data.security_id}
            onChange={(value) => setData('security_id', value)}
            options={options}
          />
        </Form.Item>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Item label="Expense Type" required>
          <Select
            placeholder="Select expense type"
            value={data.type}
            onChange={(val) => setData('type', val)}
          >
            <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Travel">Travel</Select.Option>
            <Select.Option value="Accommodation">Accommodation</Select.Option>
            <Select.Option value="Advances">Salary Advance</Select.Option>
            {mode === 'security' && <Select.Option value="Loan">Loan</Select.Option>}
          </Select>
        </Form.Item>

        {data.type && (
          <Form.Item label="Description" required>
            <Input
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
          </Form.Item>
        )}
        <Form.Item label={data.type==="Loan"?"Loan Start Date":"Date"} required>
        <DatePicker
          className="w-full"
          value={data.date ? dayjs(data.date) : undefined}
          onChange={(date) => {
            setData('date', date ? date.format('YYYY-MM-DD') : null)
          }}
        />
      </Form.Item>

        <Form.Item label="Amount (LKR)" required>
          <InputNumber
            min={1}
            className="w-full"
            value={data.amount}
            onChange={(val) => setData('amount', val ?? 0)}
          />
        </Form.Item>

        {data.type === 'Loan' && (
          <Form.Item label="Installments" required>
            <InputNumber
              min={1}
              className="w-full"
              value={data.installments}
              onChange={(val) => setData('installments', val)}
            />
          </Form.Item>
        )}
      </div>

      <ViewExpense isLoan={data.type === 'Loan'? true: false}  expenses={[data]} isEdit={false}  />

      <Form.Item className="mt-6">
        <div className="flex flex-row gap-x-5">
          <Button type="primary" disabled={submitButtonDiabled()} htmlType="submit">
            Add Expense
          </Button>
          <Button type="primary" htmlType="button" className="bg-red-600!" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

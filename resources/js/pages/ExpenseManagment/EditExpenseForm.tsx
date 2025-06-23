import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { editExpenseSecurity, editLoanSecurity } from '@/services/security-managment.service';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

interface ExpenseFormProps {
  initialData?: any;
  onCancelUpdate?: () => void;
  onCancelLoanUpdate?: ()=> void;
  isLoanEdit: boolean;
}

export default function EditExpenseForm({ initialData, onCancelUpdate, onCancelLoanUpdate, isLoanEdit }: ExpenseFormProps) {
  const [form] = Form.useForm();
 const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError, contextHolder } = useNotification();

  useEffect(() => {

    if (initialData) {
        if(isLoanEdit){
            form.setFieldsValue({
                ...initialData,
                start_date: initialData.start_date ? dayjs(initialData.start_date) : null,
              });
        }else{
            form.setFieldsValue({
                ...initialData,
                date: initialData.date ? dayjs(initialData.date) : null,
              });
        }
      
    }

  }, [initialData, form]);

  const handleFinish = async(values: any) => {
    if(isLoanEdit){
        const { security,created_at, updated_at, id, ...rest } = initialData;
        const formattedData = {
            ...rest,
            ...values,
            start_date: dayjs(values.start_date).format('YYYY-MM-DD'),
        };
        console.log(formattedData);
        try {
          setLoading(true);
          const result = await editLoanSecurity(id, formattedData);
          setTimeout(() => {
            onCancelLoanUpdate?.();
          }, 1000);
          notifySuccess('SUCCESS', 'Loan updated successfully');
        } catch (error) {
          notifyError('ERROR', 'Failed to update loan');
        }finally{
          setLoading(false);
        }

    }else{
        const { security,created_at, updated_at, id, ...rest } = initialData;
        const formattedData = {
            ...rest,
            ...values,
            date: dayjs(values.date).format('YYYY-MM-DD'),
          }; 
          console.log(formattedData);
          try {
            setLoading(true);
            const result = await editExpenseSecurity(id, formattedData);
            setTimeout(() => {   onCancelUpdate?.(); }, 1000);
            notifySuccess('SUCCESS', 'Expense updated successfully');
          } catch (error) {
            notifyError('ERROR', 'Failed to update Expense');
          }finally{
            setLoading(false);
          }
    }
  };


  return (
    <>
    
    {!isLoanEdit? <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="mb-10! space-y-4 rounded-lg bg-white p-6! shadow-md"
    >
            {contextHolder}
      {loading && <Loader/>}
      <h2 className="text-2xl font-semibold text-gray-700">Edit Expense</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item label="Expense Type" name="type" rules={[{ required: true }]}>
          <Select placeholder="Select">
            <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Travel">Travel</Select.Option>
            <Select.Option value="Accommodation">Accommodation</Select.Option>
            <Select.Option value="Advances">Salary Advance</Select.Option>
            <Select.Option value="Loan">Loan</Select.Option>
          </Select>
        </Form.Item>

       
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
    

        <Form.Item label="Date" name="date" rules={[{ required: true }]}>
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item label="Amount (LKR)" name="amount" rules={[{ required: true }]}>
          <InputNumber className="w-full" min={1} />
        </Form.Item>
      </div>

      <div className="flex flex-row gap-x-5">
        <Button type="primary" htmlType="submit">
          Update Expense
        </Button>
        <Button danger onClick={onCancelUpdate}>
          Cancel
        </Button>
      </div>
    </Form>
    
    : 
    

    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="mb-10! space-y-4 rounded-lg bg-white p-6! shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-700">Edit Expense</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>

        <Form.Item label="Date" name="start_date" rules={[{ required: true }]}>
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item label="Amount (LKR)" name="total_amount" rules={[{ required: true }]}>
          <InputNumber className="w-full" min={1} />
        </Form.Item>

        
          <Form.Item label="Installments" name="installments" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={1} />
          </Form.Item>
      </div>

      <div className="flex flex-row gap-x-5">
        <Button type="primary" htmlType="submit">
          Update Expense
        </Button>
        <Button danger onClick={onCancelLoanUpdate}>
          Cancel
        </Button>
      </div>
    </Form>}
    
    </>
  );
}

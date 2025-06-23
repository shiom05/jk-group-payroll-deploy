import { Table, Input, Button, Space, Tag, DatePicker } from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import dayjs from 'dayjs';

interface ExpenseTableProps {
  expenses: any[];
  onEdit: (expense: any) => void;
  onDelete: (id: number) => void;
}

export default function ExpensesTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const filteredExpenses = expenses
    .filter((exp) => exp.type !== 'Loan')
    .filter((exp) =>
      exp.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      exp.type?.toLowerCase().includes(searchText.toLowerCase()) ||
      exp?.security?.securityName?.toLowerCase().includes(searchText.toLowerCase()) ||
      exp?.securityId?.toString().includes(searchText)
    )
    .filter((exp) =>
      selectedDate ? exp.date === selectedDate : true
    );

  const columns: ColumnsType<any> = [
    {
      title: 'Security ID',
      dataIndex: 'security_id',
    },
    {
      title: 'Security Name',
      dataIndex: ['security', 'securityName'],
      render: (name: string) => name || '-',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Amount (LKR)',
      dataIndex: 'amount',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => onEdit(record)} />
          <Button icon={<DeleteOutlined />} type="link" danger onClick={() => onDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Search type, description or security"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <DatePicker onChange={(date) => setSelectedDate(date ? dayjs(date).format('YYYY-MM-DD') : null)} />
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-2">Expenses</h3>
      <Table
        columns={columns}
        dataSource={filteredExpenses.map((item) => ({ ...item, key: item.id }))}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
}

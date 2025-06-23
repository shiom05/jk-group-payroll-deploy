import { Table, Button, Space, Tag } from 'antd';
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined
  } from '@ant-design/icons';

interface LoanTableProps {
  loans: any[];
  onEdit: (loan: any) => void;
  onDelete: (id: number) => void;
}

export default function LoansTable({ loans, onEdit, onDelete }: LoanTableProps) {
//   const filteredLoans = loans.filter((loan) => loan.type === 'Loan');

  const columns = [
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
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
    },
    {
      title: 'Amount (LKR)',
      dataIndex: 'total_amount',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Installments',
      dataIndex: 'installments',
    },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined size={16} />} type="link" onClick={() => onEdit(record)} />
          <Button icon={<DeleteOutlined size={16} />} type="link" danger onClick={() => onDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Loans</h3>
      <Table
        columns={columns}
        dataSource={loans}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
}

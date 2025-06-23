import React from "react";
import { Table, Tag } from "antd";

interface Expense {
  id: number;
  type: string;
  item?: string;
  description?: string;
  date: string;
  amount: number;
  installments?: number;
}

interface ExpenseTableProps {
  expenses: Expense[]; // expecting a single record
  isEdit: boolean;
  isLoan: boolean;
}

export default function ViewExpense({ expenses, isEdit, isLoan }: ExpenseTableProps) {
  console.log(expenses)
  const columns = [
  
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Item/Description",
      dataIndex: "item",
      key: "item",
      render: (_: any, record: Expense) => record?.item || record?.description || "-",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount (LKR)",
      dataIndex: "amount",
      key: "amount",
      render: (val: number) => val?.toLocaleString(),
    }
  ];

  const loanViewColumns = [
    ...columns,
    {
      title: "Installments",
      dataIndex: "installments",
      key: "installments",
      render: (val: number | undefined) => val || "-",
    },
  ]

  const editLoanCol = [
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag color="blue">Loan</Tag>,
    },
    {
      title: "Item/Description",
      dataIndex: "item",
      key: "item",
      render: (_: any, record: Expense) => record?.item || record?.description || "-",
    },
    {
      title: "Date",
      dataIndex: "start_date",
      key: "date",
    },
    {
      title: "Amount (LKR)",
      dataIndex: "total_amount",
      key: "amount",
      render: (val: number) => val?.toLocaleString(),
    },
    {
      title: "Installments",
      dataIndex: "installments",
      key: "installments",
      render: (val: number | undefined) => val || "-",
    },
  
  ]

  const editExpenseCol = [
    {
      title: 'Security ID',
      dataIndex: 'security_id',
  },
  {
      title: 'Security Name',
      dataIndex: ['security', 'securityName'],
      render: (name: string) => name || '-',
  },
    ...columns,
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {isEdit ? "Editing Expense" : "New Expense Details Getting Saved"}
      </h3>
      <Table
        columns={(isEdit)? (isLoan? editLoanCol: editExpenseCol) : (isLoan)? loanViewColumns: columns}
        dataSource={expenses}
        pagination={false}
        bordered
      />
    </div>
  );
}

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Layout from '@/layouts/Layout';
import SecurityExpenses from './SecurityExpenses';
import {
  DollarCircleOutlined,
} from '@ant-design/icons';

export default function expenseManagment() {

  return (
      <Layout>
          <div className="pt-10 pl-20">
              <h1 className="text-2xl font-semibold text-gray-700">
                  <DollarCircleOutlined /> Expense Managment
              </h1>
              <p className="ml-8">Select the option to add an expense to a security or a company general expense</p>
          </div>
          <SecurityExpenses />;
      </Layout>
  );
}

import { useEffect, useState } from 'react';
import { Table, Tag, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import axios from 'axios';
import Security from '@/types/jk/security';

interface SelectSecurityProps {
  onSelected: (security: Security) => void;
  selectedSecurity: Security
  securityList: Security[];
}

const SelectSecurity = ({ onSelected, selectedSecurity, securityList }: SelectSecurityProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);


useEffect(() => {
    setSelectedRowKeys([selectedSecurity?.securityId])
}, []);


  const getStatusText = (status: number) => {
    return status === 200 ? 'Active' : 'Inactive';
  };

  const columns: ColumnsType<Security> = [
    {
        title: 'Photo',
        dataIndex: 'securityPhoto',
        key: 'securityPhoto',
        width: 100,
        render: (photo) => (
          <Image
            src={`/storage/${photo}`}
            alt="Security Photo"
            width={50}
            height={50}
            className="rounded-full object-cover"
            preview={false}
          />
        )
      },
    {
      title: 'Security Name',
      dataIndex: 'securityName',
      key: 'securityName',
      render: (text, record) => (
        record.securityStatus === 300 ? (
          <span className="text-gray-400 cursor-not-allowed">{text}</span>
        ) : (
          <a onClick={() => onSelected(record)} className="hover:text-blue-600">
            {text}
          </a>
        )
      )
    },
    {
      title: 'Security ID',
      dataIndex: 'securityId',
      key: 'securityId'
    },
    {
      title: 'Status',
      dataIndex: 'securityStatus',
      key: 'securityStatus',
      render: (status) => {
        const isActive = status === 200;
        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {getStatusText(status)}
          </Tag>
        );
      }
    }
  ];

  const onSelectChange = (selectedKeys: React.Key[], selectedRows: Security[]) => {
    const enabledRows = selectedRows.filter(row => row.securityStatus !== 300);
    setSelectedRowKeys(enabledRows.map(row => row.securityId));
    if (enabledRows.length > 0) {
      onSelected(enabledRows[0]);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: Security) => ({
        disabled: record.securityStatus === 300
      }),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div>
      <Table
        rowKey="securityId"
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={securityList}
        pagination={{ pageSize: 5 }}
        onRow={(record: Security) => ({
          onClick: () => {
            if (record.securityStatus !== 300) {
            onSelected(record);
            setSelectedRowKeys([record.securityId]);
            }
          },
        })}
      />
    </div>
  );
};

export default SelectSecurity;
import Layout from '@/layouts/Layout';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CreateLeave from './CreateLeave';
import { formatDate, getLeaveStatus } from '@/utils/security';
import { Button, Table, Tag, Space, Popconfirm, message, Input, InputRef } from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import EditLeave from './EditLeave';
import useNotification from '@/hooks/useNotification';
import Security from '@/types/jk/security';
import { ColumnType } from 'antd/es/table';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaveEdit, setLeaveEdit]= useState<any>(null);
 const { notifySuccess, notifyError, contextHolder } = useNotification();
 
  const fetchLeaves = async () => {
    setLoading(true)
    try {
      const response = await axios.get('api/security-leaves');
      setLeaves(response.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    }finally{
      setLoading(false)
    }
  };

  const deleteLeave = async (id: number) => {
    try {
      console.log(id);
        setLoading(true)
      await axios.delete(`api/security-leaves/${id}`);
       notifySuccess('SUCCESS', 'Leave Deleted Successfully');
      fetchLeaves();
    } catch (error) {
      console.error('Failed to delete leave:', error);
      notifyError('ERROR', 'Something Went Wrong Deleting Leave, Please Try Again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const searchInput = useRef<InputRef>(null);
    
    const handleSearch = (   
      selectedKeys: string[],
      confirm: () => void,
      dataIndex: keyof Security
    ) => {
      confirm();
      // setSearchText(selectedKeys[0]);
      // setSearchedColumn(dataIndex as string);
    };
  
    const handleReset = (clearFilters?: () => void, confirm?: ()=> void) => {
      clearFilters?.();
      confirm?.();
      // setSearchText('');
    };
  
    const getColumnSearchProps = (
      dataIndex: keyof Security  
    ): ColumnType<Security> => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input 
            ref={searchInput} 
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => 
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: 'block' }}
          />  
          <Space>   
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters, confirm)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    });
  

  const columns = [
    {
      title: 'Employee',
      dataIndex: ['security', 'securityName'],
      key: 'employee',
      ...getColumnSearchProps('securityName')
    },
    {
      title: 'Type',
      dataIndex: 'leave_type',
      key: 'type',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Start',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'End',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => {
        const status = getLeaveStatus(record.start_date, record.end_date);
        const color = status === 'Pending' ? 'gold' : status === 'Completed' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
                  <Button icon={<EditOutlined />} type="link" onClick={() => setLeaveEdit(record)} />
                  <Button icon={<DeleteOutlined />} type="link" danger onClick={() => deleteLeave(record.leave_id)} />
                </Space>
      )
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        {contextHolder}
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Security Leave Management</h1>

        {(!showCreateForm && !leaveEdit) && (
          <>
            <Button
              type="primary"
              className="mb-4"
              onClick={() => setShowCreateForm(true)}
            >
              + Create Leave
            </Button>

            <Table
              columns={columns}
              dataSource={leaves}
              rowKey="id"
              bordered
              loading={loading}
            />
          </>
        )}

        {(showCreateForm && !leaveEdit) && (
          <CreateLeave onClose={() => {
            setShowCreateForm(false);
            fetchLeaves();
          }} />
        )}

        {
          (leaveEdit && !showCreateForm) && 
          <EditLeave leave={leaveEdit} onUpdate={()=>{setLeaveEdit(null);fetchLeaves()}} onClose={()=> setLeaveEdit(null)}  />
        }
      </div>
    </Layout>
  );
};

export default LeaveManagement;

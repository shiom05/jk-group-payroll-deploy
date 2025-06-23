import { deleteBlackMark, fetchBlackMarks, SecurityBlackMark } from '@/services/blackmark.service';
import Security from '@/types/jk/security';
import { EyeOutlined, PlusCircleFilled, EditOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Popconfirm, Select, Space, Spin, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import BlackMarkForm from './BlackMarkForm';
import BlackMarkView from './BlackMarkView';
import useNotification from '@/hooks/useNotification';

const { Option } = Select;

interface BlackMarksListProps {
    security: Security;
}

const BlackMarksList = ({ security }: BlackMarksListProps) => {
    const [blackMarks, setBlackMarks] = useState<SecurityBlackMark[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isView, setView] = useState<SecurityBlackMark | null>(null);
    const [toEdit, setToEdit] = useState<SecurityBlackMark | null>(null);
    const { notifySuccess, notifyError, contextHolder } = useNotification();

    const loadData = async () => {
            try {
                setLoading(true);
                if (statusFilter === '') {
                    const data = await fetchBlackMarks({security_id: security.securityId});
                    setBlackMarks(data);
                    
                } else {
                    const data = await fetchBlackMarks({ status: statusFilter, security_id: security.securityId });
                    setBlackMarks(data);
                }
            } catch (error) {
                console.error('Error loading black marks:', error);
                notifyError('ERROR', 'Failed to load black marks');
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadData();
    }, [statusFilter]);

    const onRemove = async(id:string)=>{
        const result = await deleteBlackMark(id);
        loadData();
    }

 const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setIsAdd(false);
    setToEdit(null);
    setView(null);
  };

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Incident Date',
            dataIndex: 'incident_date',
            key: 'incident_date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color={status === 'completed' ? 'green' : 'orange'}>{status.toUpperCase()}</Tag>,
        },
        {
            title: 'Fine',
            dataIndex: 'fine_amount',
            key: 'fine_amount',
            render: (amount: number | null) => (amount ? `Rs ${amount}` : '-'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: SecurityBlackMark) => (
                <div className='flex flex-row gap-x-2'>
                    <Button icon={<EyeOutlined />} size="middle" onClick={() => {setView(record); showDrawer()}}>
                        View
                    </Button>
                    <Button icon={<EditOutlined />} size="middle" title='Edit the black mark or complete the black mark with fine amount' onClick={() => {setToEdit(record); showDrawer()}}>
                        Edit
                    </Button>
                    <Popconfirm title="Remove this Black Mark?" onConfirm={() => onRemove(record.id)} okText="Yes" cancelText="No">
                        <Button danger>Remove</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <>
            {!isView && (
                <div style={{ padding: 24 }} className="mt-20">
                    <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Typography.Title level={2} style={{ margin: 0 }}>
                            Security Black Mark Managment
                        </Typography.Title>
                        <Button
                            type="primary"
                            icon={<PlusCircleFilled />}
                            onClick={() => {
                                setIsAdd(true);
                                showDrawer();
                            }}
                            size="large"
                        >
                            Add Black Mark
                        </Button>
                    </Space>

                    <Space style={{ marginBottom: 16 }}>
                        <Select
                            placeholder="Filter by status"
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            style={{ width: 200 }}
                            allowClear
                        >
                            <Option value="">All</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="completed">Completed</Option>
                        </Select>
                    </Space>

                    <Card>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Table rowKey="id" dataSource={blackMarks} columns={columns} pagination={{ pageSize: 10 }} />
                        )}
                    </Card>
                </div>
            )}

            <Drawer
                title={ isView? "" : !toEdit ? 'Add New Black Mark' : 'Edit Black Mark'}
                width={800}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                maskClosable={false} // Prevent closing when clicking mask
                keyboard={false}
            >
                {(isAdd || toEdit) && (
                    <BlackMarkForm
                        idEditing={!toEdit ? false : true}
                        BlackMark={toEdit ? toEdit : null}
                        security={security}
                        onCancel={() => {
                            setIsAdd(false);
                            setToEdit(null);
                            loadData()
                            onClose();
                        }}
                    />
                )}

                {isView && <BlackMarkView blackMark={isView} onCancel={onClose} />}
            </Drawer>
        </>
    );
};

export default BlackMarksList;

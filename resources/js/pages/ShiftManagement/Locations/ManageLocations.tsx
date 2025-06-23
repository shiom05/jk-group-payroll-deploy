import { DeleteFilled, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Modal, Popconfirm, Row, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import CreateLocation from './CreateLocation';
import EditLocation from './EditLocation';
import { deleteLocation, getLocation } from '@/services/location.service';
import Security from '@/types/jk/security';
import { removeSecurityFromLocation } from '@/services/securityLocationAllocation.service';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';
const { Title, Text } = Typography;
interface Locations {
    locationId: any,
    locationName: string;
    locationType: string;
    address: string;
    isJkPropLocation: boolean;

    billing_OIC_HourlyRate: number;
    billing_JSO_HourlyRate: number;
    billing_CSO_HourlyRate: number;
    billing_LSO_HourlyRate: number;
    billing_SSO_HourlyRate: number;

    paying_OIC_HourlyRate: number;
    paying_JSO_HourlyRate: number;
    paying_CSO_HourlyRate: number;
    paying_LSO_HourlyRate: number;
    paying_SSO_HourlyRate: number;

    securities: Security[]
}

export default function ManageLocations() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [viewLocation, setViewLocation] = useState<Locations | null>(null);
    const [toEditLcoation, setToEditocation] = useState<any>(null);

    const [locations, setLocations] = useState<Locations[]>([]);

      const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError, contextHolder } = useNotification(); 

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleView = (record: Locations) => {
        setViewLocation(record);
        showModal();
        console.log('View:', record);
    };

    const handleEdit = (record: Locations) => {
        setToEditocation(record);
    };

    const handleDelete = async(record: Locations) => {
        try {
            setLoading(true);
            const result = await deleteLocation(record.locationId);
            if (result.status === 200) {
                 fetchLocations();
            }else{
                notifyError('ERROR', 'Failed to delete location');
            }
        } catch (error) {
            notifyError('ERROR', 'Failed to delete location');
            return;
        }finally {
            setLoading(false);
            notifySuccess('Success', 'Location deleted successfully');
        }
    };

    const saveEditedLocation = (location: any) => {};

    const columns: ColumnsType<Locations> = [
        {
            title: 'Location Name',
            dataIndex: 'locationName',
            key: 'locationName',
            filters: [...new Set(locations.map((item: Locations) => item.locationName))].map((type: any) => ({
                text: type,
                value: type,
            })),
            onFilter: (value: any, record) => record.locationName === value,
        },
        {
            title: 'Location Type',
            dataIndex: 'locationType',
            key: 'locationType',
            filters: [...new Set(locations.map((item: Locations) => item.locationType))].map((type: any) => ({
                text: type,
                value: type,
            })),
            onFilter: (value: any, record) => record.locationType === value,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'JK Property',
            dataIndex: 'isJkPropLocation',
            key: 'isJkPropLocation',
            filters: [
                { text: 'Yes', value: true },
                { text: 'No', value: false },
            ],
            onFilter: (value: any, record) => record.isJkPropLocation === value,
            render: (value: boolean) => <Tag color={value ? 'green' : 'red'}>{value ? 'Yes' : 'No'}</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleView(record)}>
                        <EyeOutlined />
                    </Button>
                    <Button onClick={() => handleEdit(record)}>
                        <EditOutlined />
                    </Button>
                    <Button type="primary" danger onClick={() => handleDelete(record)}>
                        <DeleteFilled />
                    </Button>
                </Space>
            ),
        },
    ];

    const fetchLocations = async () => {
        try {
           setLoading(true);
           const result = await getLocation();
           setLocations(result.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            notifyError('ERROR', 'Failed to fetch locations');
        } finally {
            setLoading(false);
        }
    }

    const onRemove = async (security: string) => {
        setLoading(true);
         try {
           const result = await removeSecurityFromLocation(security, viewLocation?.locationId);
           if (result.status === 200) {
               fetchLocations();
               setTimeout(() => {
                setIsModalOpen(false);
               }, 1000);
           } else {
               notifyError('Error', 'Failed to remove security');
           }
        } catch (error) {
            notifyError('Error', 'Failed to remove security');
        } finally {
             notifySuccess('SUCCESS', 'Security removed from location successfully');
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchLocations();
    },[]);

        const columnsAllocatedSecurity: ColumnsType<any> = [
          {
            title: 'ID',
            dataIndex: 'securityId',
            key: 'securityId',
          },
          {
            title: 'Name',
            dataIndex: 'securityName',
            key: 'securityName',
          },
          {
            title: 'Type',
            dataIndex: 'securityType',
            key: 'securityType',
          },
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Popconfirm
                title="Remove this security?"
                onConfirm={() => onRemove(record.securityId)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Remove</Button>
              </Popconfirm>
            ),
          },
        ];

    return (
        <div className="rounded-2xl bg-gray-100 p-10 pt-10 pb-10 shadow-md">
            {contextHolder}
            {loading && <Loader/> }

           { !toEditLcoation && !showCreate &&
             <Button
                onClick={() => setShowCreate(true)}
                type="primary" 
                className="mb-10">
                + Add New Location
            </Button>
           }

            {!toEditLcoation && showCreate && <CreateLocation handleCancel={() =>{fetchLocations(); setShowCreate(false)}}></CreateLocation>}

            {toEditLcoation && !showCreate && (
                <EditLocation  onCancel={() => {fetchLocations(); setToEditocation(null)}} initialValues={toEditLcoation}></EditLocation>
            )}

            {!toEditLcoation && !showCreate && (
                <>
                    <h3 className="mb-4 pb-2 text-xl font-bold text-gray-800">Client Locations</h3>
                    {locations.length > 0 && <Table columns={columns} dataSource={locations} rowKey="locationName" />}
                    <Modal
                        open={isModalOpen}
                        maskClosable
                        onOk={handleOk}
                        onClose={handleCancel}
                        onCancel={handleCancel}
                        width={1000}
                        footer={(_, { OkBtn }) => (
                            <>
                                <OkBtn />
                            </>
                        )}
                    >
                        <Typography>
                            <Title level={3}>{viewLocation?.locationName} Information</Title>
                            <Divider />
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <Text strong>Location Name:</Text> <Text>{viewLocation?.locationName}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Location Type:</Text> <Text>{viewLocation?.locationType}</Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong>Address:</Text> <Text>{viewLocation?.address}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>JK Property:</Text>{' '}
                                    <Text>
                                        <Tag color={viewLocation?.isJkPropLocation ? 'green' : 'red'}>
                                            {viewLocation?.isJkPropLocation ? 'Yes' : 'No'}{' '}
                                        </Tag>
                                    </Text>
                                </Col>
                            </Row>

                            <Divider />

                            <Title level={5}>Billing Rates (Rs/hr)</Title>
                            <Row gutter={[16, 8]}>
                                <Col span={6}>
                                    <Text strong>OIC:</Text> <Text>LKR {viewLocation?.billing_OIC_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>JSO:</Text> <Text>LKR {viewLocation?.billing_JSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>CSO:</Text> <Text>LKR {viewLocation?.billing_CSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>SSO:</Text> <Text>LKR {viewLocation?.billing_SSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>LSO:</Text> <Text>LKR {viewLocation?.billing_LSO_HourlyRate}</Text>
                                </Col>
                            </Row>

                            <Divider />

                            <Title level={5}>Paying Rates (Rs/hr)</Title>
                            <Row gutter={[16, 8]}>
                                <Col span={6}>
                                    <Text strong>OIC:</Text> <Text>LKR {viewLocation?.paying_OIC_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>JSO:</Text> <Text>LKR {viewLocation?.paying_JSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>CSO:</Text> <Text>LKR {viewLocation?.paying_CSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>SSO:</Text> <Text>LKR {viewLocation?.paying_SSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>LSO:</Text> <Text>LKR {viewLocation?.paying_LSO_HourlyRate}</Text>
                                </Col>
                            </Row>
                        </Typography>
                        <Divider />
                        <Title level={5}>Allocated Securities</Title>

                        <Table rowKey="securityId" columns={columnsAllocatedSecurity} dataSource={viewLocation ? viewLocation.securities : []} pagination={false} />
                        <Divider />
                    </Modal>
                </>
            )}
        </div>
    );
}

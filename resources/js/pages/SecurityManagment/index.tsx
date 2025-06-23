import Layout from '@/layouts/Layout';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import Security from '@/types/jk/security';
import ViewSecurity from './ViewSecurity';
import { getStatusText } from '@/utils/security';
import EditSecurity from './EditSecurity';
import { Table, Button, Tag, Popconfirm, Drawer, Divider, Tabs, TabsProps, Input, Space } from 'antd';
import { ColumnsType, ColumnType } from 'antd/es/table';

import { EyeOutlined, EditOutlined,SearchOutlined  } from '@ant-design/icons';
import BlackMarksList from './BlackarkManagment/BlackMarksList';
import SecurityTerminationForm from './ResignationManagment';
import Title from 'antd/es/typography/Title';
import { rehireSecurity } from '@/services/security-managment.service';
import useNotification from '@/hooks/useNotification';
import Loader from '@/components/ui/loader';

import type { InputRef } from 'antd';

const SecurityManagment = () => {
    const [securities, setSecurities] = useState<any>([]);

    const [securitiesPending, setSecuritiesPending] = useState<any>([]); //who have not provided all data
    const [securitiesInactive, setSecuritiesInactive] = useState<any>([]); //to be terminated need to return all assets
    const [securitiesTerminated, setSecuritiesTerminated] = useState<any>([]); //terminated
 

    const [toViewSecuritySelected, setToViewSecuritySelected] = useState<Security | null>(null)
    const [toEditSecuritySelected, setToEditSecuritySelected] = useState<Security | null>(null)
    const [open, setOpen] = useState(false);
    const [toTerminateSecuritySelected, setToTerminateSecuritySelected] = useState<Security | null>(null);

    
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError, contextHolder } = useNotification();
  
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setToTerminateSecuritySelected(null);
    };


    const fetchSecurities = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/all/securities');
            const data = response.data;
            const active = data.filter((sec:Security)=> sec.securityStatus === 200);
            const pending = data.filter((sec:Security)=> sec.securityStatus === 300);
            const inactive = data.filter((sec:Security)=> sec.securityStatus === 400);
            const terminated = data.filter((sec:Security)=> sec.securityStatus === 500);
            setSecurities(active);
            setSecuritiesPending(pending);
            setSecuritiesInactive(inactive);
            setSecuritiesTerminated(terminated);
        } catch (error) {
            console.error('Error fetching securities:', error);
        }finally{
            setLoading(false);
        }
    };

    function getStatusText(code: number) {
        switch (code){
            case 200:
                return 'Active';
            case 300:
                return 'Pending';
            case 400:
                return 'Inactive';
            case 500:
                return 'Terminated';
        }
      }

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  
  const handleSearch = (   
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: keyof Security
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex as string);
  };

  const handleReset = (clearFilters?: () => void, confirm?: ()=> void) => {
    clearFilters?.();
    confirm?.();
    setSearchText('');
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

    const columns: ColumnsType<Security> = [
        {
            title: 'ID',
            dataIndex: 'securityId',
            key: 'securityId',
            sorter: (a: any, b: any) => a.securityId - b.securityId,
        },
        {
            title: 'Name',
            dataIndex: 'securityName',
            key: 'securityName',
            // sorter: (a: any, b: any) => a.securityName.localeCompare(b.securityName),
            ...getColumnSearchProps('securityName')
        },
        {
            title: 'NIC',
            dataIndex: 'securityNicNumber',
            key: 'securityNicNumber',
            sorter: (a: any, b: any) => a.securityNicNumber.localeCompare(b.securityNicNumber),
        },
        {
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Status',
            dataIndex: 'securityStatus',
            key: 'securityStatus',
            render: (status: number) => (
              <Tag color={getStatusText(status) === 'Active' ? 'green' : 'red'}>
                {getStatusText(status)}
              </Tag>
            ),
            filters: [
              { text: 'Active', value: 200 },
              { text: 'Pending', value: 300 },
              { text: 'Inactive', value: 400 },
              { text: 'Terminated', value: 500 },
            ],
            onFilter: (value: any, record: Security) => record.securityStatus === value,
          
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex justify-center gap-2">
                    <Button icon={<EditOutlined />} size="middle" onClick={() => setToEditSecuritySelected(record)} >Edit</Button>
                     <Button icon={<EyeOutlined />} size="middle" onClick={() => setToViewSecuritySelected(record)} >View</Button>                   

                    <Popconfirm title="Confirm Termination of Security?" onConfirm={() => {showDrawer(); setToTerminateSecuritySelected(record);}} okText="Yes" cancelText="No">
                          <Button danger>Terminate</Button>
                      </Popconfirm>
                    
                </div>
            ),
        },
    ];
    const columnsPending: ColumnsType<Security> = [
        {
            title: 'ID',
            dataIndex: 'securityId',
            key: 'securityId',
            sorter: (a: any, b: any) => a.securityId - b.securityId,
        },
        {
            title: 'Name',
            dataIndex: 'securityName',
            key: 'securityName',
            // sorter: (a: any, b: any) => a.securityName.localeCompare(b.securityName),
            ...getColumnSearchProps('securityName')
        },
        {
            title: 'NIC',
            dataIndex: 'securityNicNumber',
            key: 'securityNicNumber',
            sorter: (a: any, b: any) => a.securityNicNumber.localeCompare(b.securityNicNumber),
        },
        {
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Status',
            dataIndex: 'securityStatus',
            key: 'securityStatus',
            render: (status: number) => (
              <Tag color={getStatusText(status) === 'Active' ? 'green' : 'red'}>
                {getStatusText(status)}
              </Tag>
            ),
            filters: [
              { text: 'Active', value: 200 },
              { text: 'Pending', value: 300 },
              { text: 'Inactive', value: 400 },
              { text: 'Terminated', value: 500 },
            ],
            onFilter: (value: any, record: Security) => record.securityStatus === value,
          
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex justify-center gap-2">
                     <Button icon={<EditOutlined />} size="middle" onClick={() => setToEditSecuritySelected(record)} >Edit</Button>
                     <Button icon={<EyeOutlined />} size="middle" onClick={() => setToViewSecuritySelected(record)} >View</Button>                   
                </div>
            ),
        },
    ];
    const columnsInactive: ColumnsType<Security> = [
        {
            title: 'ID',
            dataIndex: 'securityId',
            key: 'securityId',
            sorter: (a: any, b: any) => a.securityId - b.securityId,
        },
        {
            title: 'Name',
            dataIndex: 'securityName',
            key: 'securityName',
            // sorter: (a: any, b: any) => a.securityName.localeCompare(b.securityName),
              ...getColumnSearchProps('securityName')
        },
        {
            title: 'NIC',
            dataIndex: 'securityNicNumber',
            key: 'securityNicNumber',
            sorter: (a: any, b: any) => a.securityNicNumber.localeCompare(b.securityNicNumber),
        },
        {
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Status',
            dataIndex: 'securityStatus',
            key: 'securityStatus',
            render: (status: number) => (
              <Tag color={getStatusText(status) === 'Active' ? 'green' : 'red'}>
                {getStatusText(status)}
              </Tag>
            ),
            filters: [
              { text: 'Active', value: 200 },
              { text: 'Pending', value: 300 },
              { text: 'Inactive', value: 400 },
              { text: 'Terminated', value: 500 },
            ],
            onFilter: (value: any, record: Security) => record.securityStatus === value,
          
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex justify-center gap-2">
                    <Button icon={<EyeOutlined />} size="middle" onClick={() => setToViewSecuritySelected(record)} >View</Button>
                   
                    <Popconfirm title="Confirm Cancel Termination?" onConfirm={() => {rehireEmployee(record);}} okText="Yes" cancelText="No">
                          <Button>Cancel Termination</Button>
                      </Popconfirm>

                    <Popconfirm title="Terminate Security" onConfirm={() => {showDrawer(); setToTerminateSecuritySelected(record);}} okText="Yes" cancelText="No">
                          <Button danger>Complete Termination</Button>
                      </Popconfirm>
                    
                </div>
            ),
        },
    ];

    const rehireEmployee = async(security:Security)=>{
        setLoading(true)
        try {
            const result = await rehireSecurity(security.securityId, {
             resignationEffectiveDate: null,
             resignationReason: null,
             resignationAdditionalInfo: null,
             securityIsResigned: false,
             hasReturnedAllAssets: false,
             securityStatus: 200
        });
              fetchSecurities();
              notifySuccess('SUCCESS', 'Succesfullt Rehired Security');
        } catch (error) {
             notifyError('ERROR', 'Something Went Wrong , Please Try Again Later!');
        }finally{
            setLoading(false)
        }
      
    }

    const columnsTerminated: ColumnsType<Security> = [
        {
            title: 'ID',
            dataIndex: 'securityId',
            key: 'securityId',
            sorter: (a: any, b: any) => a.securityId - b.securityId,
        },
        {
            title: 'Name',
            dataIndex: 'securityName',
            key: 'securityName',
            // sorter: (a: any, b: any) => a.securityName.localeCompare(b.securityName),
              ...getColumnSearchProps('securityName')
        },
        {
            title: 'NIC',
            dataIndex: 'securityNicNumber',
            key: 'securityNicNumber',
            sorter: (a: any, b: any) => a.securityNicNumber.localeCompare(b.securityNicNumber),
        },
        {
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Status',
            dataIndex: 'securityStatus',
            key: 'securityStatus',
            render: (status: number) => (
              <Tag color={getStatusText(status) === 'Active' ? 'green' : 'red'}>
                {getStatusText(status)}
              </Tag>
            ),
            filters: [
              { text: 'Active', value: 200 },
              { text: 'Pending', value: 300 },
              { text: 'Inactive', value: 400 },
              { text: 'Terminated', value: 500 },
            ],
            onFilter: (value: any, record: Security) => record.securityStatus === value,
          
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex justify-center gap-2">
                    
                     <Button icon={<EyeOutlined />} size="middle" onClick={() => setToViewSecuritySelected(record)} > View </Button>
                   
                    <Popconfirm title="Rehire" onConfirm={() => {rehireEmployee(record)}} okText="Yes" cancelText="No">
                          <Button >Rehire</Button>
                      </Popconfirm>
                    
                </div>
            ),
        },
    ];


const items: TabsProps['items'] = [
    {
        key: '1',
        label: (<Title level={2}><Tag color={'green'}>{"Active Securities "}</Tag></Title>),
        children: (
            <>
                <Divider orientation="left">
                    {' '}
                    <Title level={3}>Active Securities</Title>{' '}
                </Divider>
                <Table
                    columns={columns}
                    dataSource={securities}
                    rowKey="securityId"
                    pagination={false}
                    className="rounded-lg shadow-lg"
                    scroll={{ x: true }}
                    locale={{ emptyText: 'No Securities .....' }}
                />
            </>
        ),
    },
    {
        key: '2',
        label: <Title level={2}><Tag color={'yellow'}>{"Pending Securities "}</Tag></Title>,
        children: (
            <div className="">
                <Divider orientation="left">
                    {' '}
                    <Title level={3}>Pending Securities</Title>{' '}
                </Divider>
                <Table
                    columns={columnsPending}
                    dataSource={securitiesPending}
                    rowKey="securityId"
                    pagination={false}
                    className="rounded-lg shadow-lg"
                    scroll={{ x: true }}
                    locale={{ emptyText: 'No Securities .....' }}
                />
            </div>
        ),
    },
    {
        key: '3',
        label: <Title level={2}><Tag color={'pink'}>{"In Active Securities "}</Tag></Title>,
        children: (
            <div className="">
                <Divider orientation="left">
                    {' '}
                    <Title level={3}>Inactive Securities</Title>{' '}
                </Divider>
                <Table
                    columns={columnsInactive}
                    dataSource={securitiesInactive}
                    rowKey="securityId"
                    pagination={false}
                    className="rounded-lg shadow-lg"
                    scroll={{ x: true }}
                    locale={{ emptyText: 'No Securities .....' }}
                />
            </div>
        ),
    },
    {
        key: '4',
        label: <Title level={2}><Tag color={'red'}>{"Terminated Securities "}</Tag></Title>,
        children: (
            <div className="">
                <Divider orientation="left">
                    {' '}
                    <Title level={3}>Terminated Securities</Title>{' '}
                </Divider>
                <Table
                    columns={columnsTerminated}
                    dataSource={securitiesTerminated}
                    rowKey="securityId"
                    pagination={false}
                    className="rounded-lg shadow-lg"
                    scroll={{ x: true }}
                    locale={{ emptyText: 'No Securities .....' }}
                />
            </div>
        ),
    },
];
   
      

    useEffect(() => {
        fetchSecurities();
    }, []);

    return (
        <Layout>
                {loading && <Loader/>}
      {contextHolder}
            {!toViewSecuritySelected && !toEditSecuritySelected && (
                <div className="min-h-screen p-6">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800">Security Managment</h1>

                    <button
                        onClick={() => {
                            router.get('/security-management/create-security');
                        }}
                        className="mb-4 cursor-pointer! rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700"
                    >
                        + Add New Security
                    </button>

                  

                     <Tabs defaultActiveKey="1" items={items}  />
                </div>
                
            )}

            {toViewSecuritySelected && <ViewSecurity security={toViewSecuritySelected} back={() => setToViewSecuritySelected(null)} />}
            {toEditSecuritySelected && <EditSecurity securityData={toEditSecuritySelected} back={() => setToEditSecuritySelected(null)} />}

            {toTerminateSecuritySelected && (
                <Drawer title="Terminating Employee" closable={{ 'aria-label': 'Close Button' }} onClose={onClose} open={open} width={900}  maskClosable={false} >
                    <SecurityTerminationForm
                        security={toTerminateSecuritySelected}
                        onCancel={() => {
                             onClose();
                             fetchSecurities()
                        }}
                    />
                </Drawer>
            )}
        </Layout>
    );
};

export default SecurityManagment;

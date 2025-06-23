import Layout from '@/layouts/Layout';
import { getCurrentMonthShiftsForSecurity } from '@/services/logshift.service';
import { getAllocatedInventoriesForSecuriyCurrentMonth, getAllSecurities, getSecurityCurrentMonthExpenses, getSecurityCurrentMonthPayrollLoans } from '@/services/security-managment.service';
import Security from '@/types/jk/security';
import { DownloadOutlined, PayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Drawer, Form, Image, Row, Space, Tag, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import PayslipComponent from './PaySlip';
import { fetchDeductibleBlackMarks, SecurityBlackMark } from '@/services/blackmark.service';
import dayjs, { Dayjs } from 'dayjs';
import { getCurrentMonthCompensations, SecurityCompensation } from '@/services/compensation.service';
import { formatPayrollMonth, generatePayrollPDF, getPayrollByMonth, getSecurityPayrollByMonth } from '@/services/payroll.service';
import Loader from '@/components/ui/loader';
import useNotification from '@/hooks/useNotification';

const { Title } = Typography;

const PayrolManagment = () => {
    const [securities, setSecurites] = useState<Security[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSecurity, setSelectedSecurity] = useState<Security | null>(null);

    const [shiftData, setShiftData]= useState<any>([])
    const [expenseData, setExpenseData]= useState<any>([])
    const [inventoryData, setInventoryData]= useState<number>(0);
    const [loanData, setLoanData]= useState<any>([]);
    const [finesData, setFinesData] = useState<SecurityBlackMark[]>([]);
    const [compensationData, setCompensationData] = useState<SecurityCompensation[]>([]);

    const [existingPayroll, setExistingPayroll] = useState<any>(null); // State variable for existing payroll data

    const [form] = Form.useForm();
    const [selectedDate, setSelectedDate] = useState<any>(null); // State variable for selected date


   const [loader, setLoader] = useState<boolean>(false);
   const { notifySuccess, notifyError, contextHolder } = useNotification();

    const columns: ColumnsType<Security> = [
        {
            title: 'Photo',
            dataIndex: 'securityPhoto',
            key: 'securityPhoto',
            width: 100,
            render: (photo) => (
                <Image src={`/storage/${photo}`} alt="Security Photo" width={50} height={50} className="rounded-full object-cover" preview={false} />
            ),
        },

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
            sorter: (a: any, b: any) => a.securityName.localeCompare(b.securityName),
        },
        {
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Role',
            dataIndex: 'securityType',
            key: 'securityType',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="">
                    <Button icon={<PayCircleOutlined />} title="View Payroll" onClick={() => showLoading(record)} size="middle">
                        View Payroll
                    </Button>
                    {/* onClick={() => showLoading(record)} */}
                </div>
            ),
        },
    ];

    const fetchSecurites = async () => {
        try {
            setLoader(true);
            const response = await getAllSecurities();
            if (response.data) {
                setSecurites(response.data);
            } else {
                notifyError('ERROR', 'No securities found');
            }
        } catch (error) {
            notifyError('ERROR', 'Failed to fetch securities');
        } finally {
            setLoader(false);
        }
    };
 
    const getCurrentMonthShift = async (security:Security) => {
        try {
            setLoading(true);
        const result = await getCurrentMonthShiftsForSecurity(security.securityId, selectedDate);
        setShiftData(result.data);
        } catch (error) {
            notifyError('ERROR', 'Failed to load shift data');
        }finally {
            setLoading(false);
        }
    };
    const getCurrentMonthExpenses = async (security:Security) => {
        try {
            setLoading(true);
            const result = await getSecurityCurrentMonthExpenses(security.securityId, selectedDate);
            setExpenseData(result.data);
        } catch (error) {
            notifyError('ERROR', 'Failed to load expense data');
        } finally {
            setLoading(false);
        }
    };
    const getCurrentMonthInventory = async (security:Security) => {
        try {
            setLoading(true);
            const result = await getAllocatedInventoriesForSecuriyCurrentMonth(security.securityId, selectedDate);
            setInventoryData(result.data.total_installment_payments);
        } catch (error) {
            notifyError('ERROR', 'Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };
    
    const getCurrentMonthLoan = async (security:Security) => {
        try {
            setLoading(true);
            const result = await getSecurityCurrentMonthPayrollLoans(security.securityId, selectedDate);
            setLoanData(result.data);
        } catch (error) {
            notifyError('ERROR', 'Failed to load loan data');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentMonthFines = async (security:Security) => {
        try {
            setLoading(true);
            const result = await fetchDeductibleBlackMarks(security.securityId, selectedDate);
            setFinesData(result);
        } catch (error) {
            notifyError('ERROR', 'Failed to load fines data');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentMonthCompenstions = async (security:Security) => {
        try {
            setLoading(true);
            const result = await getCurrentMonthCompensations(security.securityId, selectedDate);
            setCompensationData(result);
        } catch (error) {
            notifyError('ERROR', 'Failed to load compensation data');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSecurites();
    }, []);

    // const showLoading = async(Security: Security) => {

    //     const result = await getSecurityPayrollByMonth(Security.securityId, selectedDate);

    //     setOpen(true);
    //     setSelectedSecurity(Security);
    //     getCurrentMonthShift(Security);
    //     getCurrentMonthExpenses(Security);
    //     getCurrentMonthInventory(Security); 
    //     getCurrentMonthLoan(Security);
    //     getCurrentMonthFines(Security);
    //     getCurrentMonthCompenstions(Security);
        

    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 2000);


    // };

    const showLoading = async (security: Security) => {
        setLoading(true);
        setSelectedSecurity(security);
        try {
            const payrollResponse = await getSecurityPayrollByMonth(security.securityId, selectedDate);
            console.log('Payroll Response:', payrollResponse);
            if (payrollResponse.data.data) {
                setOpen(true);
                setExistingPayroll(payrollResponse.data.data);
            } else {
                    setOpen(true);
                    getCurrentMonthShift(security);
                    getCurrentMonthExpenses(security);
                    getCurrentMonthInventory(security);
                    getCurrentMonthLoan(security);
                    getCurrentMonthFines(security);
                    getCurrentMonthCompenstions(security);
            }
        } catch (error) {
            notifyError('ERROR', 'Failed to load payroll data');
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    const onFinish = (values: { monthYear: Dayjs }) => {
    const formattedDate = values.monthYear ? values.monthYear.format('YYYY-MM') : null;
    // console.log('Selected Date:', formattedDate);
    setSelectedDate(formattedDate);
  };


  const handleDownload = ({data}:any) => {
    if (data && data.length > 0) {
    setLoader(true);
     const result =  generatePayrollPDF(data, selectedDate);
     if (result) {
         notifySuccess('SUCCESS', 'PDF generated successfully');
         setLoader(false);
     } else {
        notifyError('ERROR', 'Failed to generate PDF');
        setLoader(false);
     }
    } else {
      notifyError('ERROR', 'No payroll data available to generate PDF');  
    }
  };

    return (
        <Layout>
            {contextHolder}
      {loader && <Loader/>}
            <div className="p-10 pt-10">
                <Title level={2}>
                    {' '}
                    <PayCircleOutlined /> PAYROLL MANAGMENT
                </Title>

                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item label="Select Month and Year" name="monthYear" rules={[{ required: true, message: 'Please select month and year' }]}>
                        <DatePicker picker="month" className="w-full" format="MMMM YYYY" placeholder="Select month" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                {selectedDate && (
                    <>
                        <Card
                            style={{
                                marginBottom: 24,
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                                border: '1px solid #f0f0f0',
                            }}
                        >
                            <Row align="middle" justify="space-between">
                                <Col>
                                    <Space direction="vertical" size={0}>
                                        <Title level={2} style={{ fontSize: 18, margin: 0 }}>
                                            Payroll Period
                                        </Title>
                                        <Title level={2} style={{ margin: 0 }}>
                                            <Tag color={'green'}>{selectedDate || 'Not selected'}</Tag>
                                        </Title>
                                    </Space>
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        icon={<DownloadOutlined />}
                                        size="large"
                                        style={{
                                            padding: '0 24px',
                                            height: 40,
                                            fontWeight: 500,
                                        }}
                                        onClick={async () => {
                                           const response = await getPayrollByMonth( selectedDate);
                                            console.log('Exporting report for:', response.data);
                                            handleDownload(response);
                                           
                                        }}
                                    >
                                        Export Report
                                    </Button>
                                </Col>
                            </Row>
                        </Card>

                        <Card
                            style={{
                                marginBottom: 24,
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                                border: '1px solid #f0f0f0',
                            }}
                        >
                            <Title level={4} className=" mb-4">
                                VIEW PAYROLL FOR SELECTED SECURITY
                            </Title>
                            <Table
                                columns={columns}
                                dataSource={securities}
                                rowKey="securityId"
                                pagination={false}
                                className="rounded-lg shadow-lg"
                                scroll={{ x: true }}
                                locale={{ emptyText: 'No Securities .....' }}
                            />
                        </Card>
                        <Drawer
                            closable
                            title={
                                <Title className="mb-0!" level={2}>
                                    {selectedSecurity?.securityName} | Payroll | {selectedDate}
                                </Title>
                            }
                            placement="right"
                            open={open}
                            loading={loading}
                            onClose={() => setOpen(false)}
                            size="large"
                            width={1000}
                        >
                            <p>
                                <PayslipComponent
                                    monthYear={selectedDate}
                                    totalShifts={shiftData}
                                    expenses={expenseData}
                                    security={selectedSecurity ? selectedSecurity : null}
                                    inventoryExpenses={inventoryData}
                                    loanInstallment={loanData}
                                    finesData={finesData}
                                    compensationData={compensationData}
                                    existingPayroll={existingPayroll}
                                />
                            </p>
                        </Drawer>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default PayrolManagment;

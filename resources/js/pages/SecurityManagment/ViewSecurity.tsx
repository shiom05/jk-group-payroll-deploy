import { getAsset, getBankDetails, getSecurityExpenses, getSecurityLoans, leaveDetails } from '@/services/security-managment.service';
import Security from '@/types/jk/security';
import { formatDate, getLeaveStatus, getStatusText } from '@/utils/security';
import { Table, Tag,  Collapse, Divider,  Card, Row, Col, Typography, Avatar  } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import BlackMarksList from './BlackarkManagment/BlackMarksList';
import CompensationSecurity from './CompensationManagment';
import { getShiftsBySecurityId } from '@/services/logshift.service';

interface ViewSecurityProps {
    security: Security;
    back: () => void;
}
const { Title, Text } = Typography;
const ViewSecurity = ({ security, back }: ViewSecurityProps) => {
    const [bankDetails, setBankDetials] = useState<any>(null);
    const [leaves, setLeaves] = useState<any>([]);
    const [expenses, setExpenses] = useState<any>([]);
    const [asstes, setAssets] = useState<any>([]);
    const [shiftData, setShiftData] = useState<any>([]);
    const [loans, setLoans] = useState<any>([]);

    const fetchBankDetails = async () => {
        try {
            const response = await getBankDetails(security.securityId);
            console.log(response.data);
            setBankDetials(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchLeaveDetails = async () => {
        try {
            const response = await leaveDetails(security.securityId);
            console.log(response.data);
            setLeaves(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchExpenses = async () => {
        const result = await getSecurityExpenses(security.securityId);
        setExpenses(result.data);
    };

    const fetchAssets = async () => {
        const result = await getAsset(security.securityId);
        setAssets(result.data.data);
    };

    const loadShiftsBySecurity = async () => {
          const { data } = await getShiftsBySecurityId(security.securityId);
          setShiftData(data);
      };

    const fetchAllSecurityLoans= async()=>{
     const result = await getSecurityLoans(security.securityId);
     setLoans(result.data);
    }


    useEffect(() => {
        fetchBankDetails();
        fetchLeaveDetails();
        fetchExpenses();
        fetchAssets();
        loadShiftsBySecurity();
        fetchAllSecurityLoans();
    }, []);

    const columnsLeave = [
        {
            title: '#',
            dataIndex: ['leave_id'],
            key: 'leave_id',
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
            },
        },
    ];

    const columnsExpense: ColumnsType<any> = [
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
    ];

    const columnsAssets = [
        {
            title: 'Name',
            dataIndex: ['inventory_item', 'inventory_type', 'name'],
            key: 'name',
        },
        {
            title: 'Size',
            //   dataIndex: ['inventory_item', 'size'],
            key: 'size',
            render: (item: any) => (item.inventory_item.inventory_type.track_size ? item.inventory_item.size : 'N/A'),
        },
        {
            title: 'Condition',
            dataIndex: ['inventory_item', 'condition'],
            key: 'condition',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
    ];

    const columnsShifts = [
    { title: 'Location', dataIndex:[ 'location' ,'locationName'] },
    { title: 'Date', dataIndex: 'shift_date' },
    { title: 'Start', dataIndex: 'start_time' },
    { title: 'End', dataIndex: 'end_time' },
    { title: 'Hours', dataIndex: 'total_hours' },
    {
      title: 'Pay',
      dataIndex: 'security_total_pay_for_shift',
      render: (val: any) => <Tag color="blue">Rs. {val}</Tag>,
    },
  ];

   const columnsLoans = [
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
    }
  ];

const getEmploymentDuration = (startDateStr: any) => {
  const startDate = new Date(startDateStr);
  const now = new Date();

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const yearText = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
  const monthText = months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';

  return [yearText, monthText].filter(Boolean).join(', ') || '0 months';
};

const getStatusTag = (status: number) => {
    const statusText = getStatusText(status);
    return (
      <Tag color={statusText === 'Active' ? 'green' : 'red'}>
        {statusText}
      </Tag>
    );
  };
    return (
        <>
            <div className="p-20">
                <Card className="p-[24px] bg-gray-100!" >
                    <Row align="middle" gutter={24}>
                        <Col>
                            <Avatar
                                src={`/storage/${security.securityPhoto}`}
                                alt={security.securityName}
                                size={128}
                                style={{
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid #f0f0f0',
                                }}
                            />
                        </Col>
                        <Col>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <Title level={2} style={{ margin: 0 }}>
                                    {security.securityName}
                                </Title>
                                <Text type="secondary" strong style={{ fontSize: 18 }}>
                                    {security.securityId}
                                </Text>
                                  {
                                    security.securityEpfNumber &&
                                    <Text type="secondary" strong style={{ fontSize: 18 }}>
                                   EPF:  {security.securityEpfNumber}
                                </Text>
                                  }
                                <Tag color="blue">{security.securityType}</Tag>
                              <div>{getStatusTag(security.securityStatus)}</div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                <Divider orientation="left"></Divider>
                <Collapse
                    items={[
                        {
                            key: '1',
                            label: <h2 className="text-2xl font-bold text-gray-800"> Personal Details</h2>,
                            showArrow: false,
                            children: (
                                <Card
                                    className="mt-10"
                                    style={{
                                        borderRadius: 12,
                                        borderColor: '#e5e7eb',
                                        backgroundColor: '#f3f4f6',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    }}
                                >
                                    <div style={{ padding: 32 }}>
                                        <Row gutter={48}>
                                            {/* Personal Details */}
                                            <Col xs={24} md={12}>
                                                <Title
                                                    level={2}
                                                    style={{
                                                        marginBottom: 16,
                                                        paddingBottom: 8,
                                                        borderBottom: '1px solid #d1d5db',
                                                        fontSize: '1.5rem',
                                                        fontWeight: 700,
                                                        color: '#1f2937',
                                                    }}
                                                >
                                                    Personal Details
                                                </Title>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Primary Contact Number:</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{security.securityPrimaryContact}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Secondary Contact Number:</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{security.securitySecondaryContact}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>NIC Number:</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{security.securityNicNumber}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Date of Birth:</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{formatDate(security.securityDob)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Date of Join:</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{formatDate(security.securityDateOfJoin)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Employment Duration</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{getEmploymentDuration(security.securityDateOfJoin)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Gender</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityGender.toLocaleUpperCase())}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Maritial Status</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityMaritalStatus? "Married":"UnMarried")}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Educational Info</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityEducationalInfo)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Previous Workplace</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityPreviousWorkplace)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Experience</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityExperience)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Other</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityAdditionalInfo? security.securityAdditionalInfo: "-")}</Text>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <Title
                                                    level={2}
                                                    style={{
                                                        marginBottom: 16,
                                                        paddingBottom: 8,
                                                        borderBottom: '1px solid #d1d5db',
                                                        fontSize: '1.5rem',
                                                        fontWeight: 700,
                                                        color: '#1f2937',
                                                        marginTop: 70
                                                    }}
                                                >
                                                    Address Details
                                                </Title>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Current Address</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityCurrentAddress)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Permanent Address</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityPermanentAddress)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>District</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityDistrict)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Police Division</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityPoliceDivision)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Grama Niladari Division</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityGramaNiladariDivision)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Grama Niladari Division</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityGramaNiladariDivision)}</Text>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>

                                            {/* Bank Details */}
                                            {bankDetails && (
                                                <Col xs={24} md={12}>
                                                    <Title
                                                        level={2}
                                                        style={{
                                                            marginBottom: 16,
                                                            paddingBottom: 8,
                                                            borderBottom: '1px solid #d1d5db',
                                                            fontSize: '1.5rem',
                                                            fontWeight: 700,
                                                            color: '#1f2937',
                                                        }}
                                                    >
                                                        Bank Details
                                                    </Title>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Text strong>Bank Name:</Text>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Text>{bankDetails.bank_name}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Text strong>Bank Branch:</Text>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Text>{bankDetails.bank_branch}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Text strong>Bank Account Number:</Text>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Text>{bankDetails.account_number}</Text>
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                      <Title
                                                    level={2}
                                                    style={{
                                                        marginBottom: 16,
                                                        paddingBottom: 8,
                                                        borderBottom: '1px solid #d1d5db',
                                                        fontSize: '1.5rem',
                                                        fontWeight: 700,
                                                        color: '#1f2937',
                                                        marginTop: 70
                                                    }}
                                                >
                                                    Emergency Contact Details
                                                </Title>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Contact Name</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityEmergencyContactName)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Contact Address</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityEmergencyContactNumber)}</Text>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Text strong>Contact Address</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text>{(security.securityEmergencyContactAddress)}</Text>
                                                        </Col>
                                                    </Row>
                                                   </div>
                                                </Col>
                                            )}
                                        </Row>
                                    </div>
                                </Card>
                            ),
                        },
                    ]}
                />

                <Divider orientation="left"></Divider>
                <Collapse
                    size="large"
                    items={[
                        {
                            key: '1',
                            showArrow: false,
                            label: <h2 className="text-2xl font-bold text-gray-800">Document Checklist</h2>,
                            children: (
                                <div className="rounded-xl border border-gray-200 bg-gray-100 p-8 shadow-lg">
                                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                                        <div>
                                            <div className="space-y-3 text-gray-700">
                                                <div className="flex">
                                                    <span className="w-1/2 font-medium">NIC Copy:</span>
                                                    <span className={`w-1/2 ${security.securityNicUploaded ? 'text-green-600' : 'text-red-600'}`}>
                                                        {security.securityNicUploaded ? 'Provided' : 'Not Provided'}
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                    <span className="w-1/2 font-medium">Birth Certificate Copy:</span>
                                                    <span
                                                        className={`w-1/2 ${security.securityBirthCertificateUploaded ? 'text-green-600' : 'text-red-600'}`}
                                                    >
                                                        {security.securityBirthCertificateUploaded ? 'Provided' : 'Not Provided'}
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                    <span className="w-1/2 font-medium">Police Report Copy:</span>
                                                    <span
                                                        className={`w-1/2 ${security.securityPoliceReportUploaded ? 'text-green-600' : 'text-red-600'}`}
                                                    >
                                                        {security.securityPoliceReportUploaded ? 'Provided' : 'Not Provided'}
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                    <span className="w-1/2 font-medium">Gramasewaka Certificate Copy:</span>
                                                    <span
                                                        className={`w-1/2 ${security.securityGramasewakaLetterUploaded ? 'text-green-600' : 'text-red-600'}`}
                                                    >
                                                        {security.securityGramasewakaLetterUploaded ? 'Provided' : 'Not Provided'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />

                <Divider orientation="left"></Divider>

                <Collapse
                    size="large"
                    items={[
                        {
                            key: '1',
                            showArrow: false,
                            label: <h2 className="text-2xl font-bold text-gray-800">Leave Details</h2>,
                            children: (
                                <div className="bg-white-100 mt-10 rounded-xl border border-gray-200 p-8 shadow-lg">
                                    <Table columns={columnsLeave} dataSource={leaves} rowKey="id" bordered />
                                </div>
                            ),
                        },
                    ]}
                />

                <Divider orientation="left"></Divider>
                <Collapse
                    size="large"
                    items={[
                        {
                            key: '1',
                            showArrow: false,
                            label: <h2 className="text-2xl font-bold text-gray-800">Expense Details</h2>,
                            children: (
                                <div className="bg-white-100 mt-10 rounded-xl border border-gray-200 p-8 shadow-lg">
                                    <Table columns={columnsExpense} dataSource={expenses} pagination={{ pageSize: 5 }} bordered />
                                </div>
                            ),
                        },
                    ]}
                />

                <Divider orientation="left"></Divider>
                <Collapse
                    size="large"
                    items={[
                        {
                            key: '1',
                            showArrow: false,
                            label: <h2 className="text-2xl font-bold text-gray-800">Loan Details</h2>,
                            children: (
                                <div className="bg-white-100 mt-10 rounded-xl border border-gray-200 p-8 shadow-lg">
                                    <Table columns={columnsLoans} dataSource={loans} pagination={{ pageSize: 5 }} bordered />
                                </div>
                            ),
                        },
                    ]}
                />

                <Divider orientation="left"></Divider>
                <Collapse
                    size="large"
                    items={[
                        {
                            key: '1',
                            showArrow: false,
                            label: <h2 className="text-2xl font-bold text-gray-800">Asset Details</h2>,
                            children: (
                                <div className="bg-white-100 mt-10 rounded-xl border border-gray-200 p-8 shadow-lg">
                                    <Table columns={columnsAssets} dataSource={asstes} pagination={{ pageSize: 5 }} bordered />
                                </div>
                            ),
                        },
                    ]}
                />

                <Divider orientation="left"></Divider>
                <Collapse
                    size="large"
                    items={[
                        {
                            key: '1',
                            showArrow: false,
                            label: <h2 className="text-2xl font-bold text-gray-800">Shift Details</h2>,
                            children: (
                                <div className="bg-white-100 mt-10 rounded-xl border border-gray-200 p-8 shadow-lg">
                                    <Table columns={columnsShifts} dataSource={shiftData} pagination={{ pageSize: 5 }} bordered />
                                </div>
                            ),
                        },
                    ]}
                />

                <BlackMarksList security={security} />

                <CompensationSecurity security={security} />

                {/* <button onClick={back} className="rounded bg-yellow-500 px-3 py-1 text-white shadow hover:bg-yellow-600">
                Back
        </button> */}
            </div>
        </>
    );
};

export default ViewSecurity;

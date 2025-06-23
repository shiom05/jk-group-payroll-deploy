import { SecurityBlackMark } from '@/services/blackmark.service';
import { SecurityCompensation } from '@/services/compensation.service';
import { savePayroll } from '@/services/payroll.service';
import Security from '@/types/jk/security';
import { Card, Table, Typography, Input, InputNumber, Checkbox, Button } from 'antd';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import useNotification from '@/hooks/useNotification';
const { Title, Text } = Typography;

interface PayslipPorps {
    totalShifts: any[];
    expenses: any[];
    inventoryExpenses: number;
    security: Security | null;
    loanInstallment: any,
    finesData: SecurityBlackMark[],
    compensationData: SecurityCompensation[],
    monthYear: string;
    existingPayroll: any;
}

const PayslipComponent = ({ totalShifts, expenses, inventoryExpenses, security, loanInstallment, finesData, compensationData, monthYear, existingPayroll }: PayslipPorps) => {
    const [basicSalary, setBasicSalary] = useState<number>(existingPayroll? existingPayroll.parameters.basic :17500);
    const [br1Allowance, setBr1Allowance] = useState<number>(existingPayroll? existingPayroll.parameters.br1 : 1000);
    const [br2Allowance, setBr2Allowance] = useState<number>(existingPayroll? existingPayroll.parameters.br2 :2500);
    const [includeWelfare, setIncludeWelfare] = useState<boolean>(existingPayroll? (existingPayroll.parameters.deductions.welfare === 200 ? true : false) : true);

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
;

    const { notifySuccess, notifyError, contextHolder } = useNotification();
    
    const formatNumber = (num: number) => {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const totalShiftPay = existingPayroll? existingPayroll.parameters.gross :  useMemo(() => {
        return totalShifts.reduce((totalPay: number, shift: any) => {
            return totalPay + shift.security_total_pay_for_shift;
        }, 0);
    }, [totalShifts]); 

    const totalAccomdation = existingPayroll? existingPayroll.parameters.deductions.accommodation : useMemo(() => {
        return expenses.reduce((total: number, expense: any) => {
            if(expense.type === "Accommodation"){
                total+= expense.amount;
            }
            return total;
        }, 0);
    }, [expenses]); 

    const totalTravel = existingPayroll? existingPayroll.parameters.deductions.transport : useMemo(() => {
        return expenses.reduce((total: number, expense: any) => {
            if(expense.type === "Travel"){
                total+= expense.amount;
            }
            return total;
        }, 0);
    }, [expenses]); 

    const totalFood =existingPayroll? existingPayroll.parameters.deductions.food : useMemo(() => {
        return expenses.reduce((total: number, expense: any) => {
            if(expense.type === "Food"){
                total+= expense.amount;
            }
            return total;
        }, 0);
    }, [expenses]); 

    const totalSalaryAdvances = existingPayroll? existingPayroll.parameters.deductions.salaryAdvances : useMemo(() => {
        return expenses.reduce((total: number, expense: any) => {
            if(expense.type === "Advances"){
                total+= expense.amount;
            }
            return total;
        }, 0);
    }, [expenses]); 

    const totalFines =existingPayroll? existingPayroll.parameters.deductions.fines : useMemo(() => {
        return finesData.reduce((totalFineAmount: number, fine: SecurityBlackMark) => {
            if(fine.fine_amount){
                totalFineAmount += fine.fine_amount;
            }
            return totalFineAmount;
        }, 0);
    }, [finesData]); 

    const totalCompensation =existingPayroll? existingPayroll.parameters.compensation : useMemo(() => {
        return compensationData.reduce((totalAmount: number, compensation: SecurityCompensation) => {
            if(compensation.amount){
                totalAmount += parseInt(compensation.amount.toString());
            }
            return totalAmount; 
        }, 0);
    }, [compensationData]); 

    const totalInventoryExpense =existingPayroll? existingPayroll.parameters.deductions.uniform : inventoryExpenses;

    const totalLoan =existingPayroll? existingPayroll.parameters.deductions.loan : useMemo(() => {
        return loanInstallment.reduce((total: number, loan: any) => {
            total+= loan.installment_amount;
            return total;
        }, 0);
    }, [loanInstallment]); 

    const bankCharge = existingPayroll? existingPayroll.parameters.deductions.bankCharges : (security?.bank_details.is_commercial_bank === "true" || security?.bank_details.is_commercial_bank === true)? 0: 100;

    const basicEpf = existingPayroll? existingPayroll.parameters.basicEpf :(basicSalary + br1Allowance + br2Allowance);
    const overtimePay = existingPayroll? existingPayroll.parameters.ot : (totalShiftPay - basicEpf);

    // Sample payslip data
    const payslipData = [
        {
            key: 'basic',
            label: 'Basic Salary',
            amount: formatNumber(basicSalary),
            editable: true,
            component: (
                <div>
                    {/* <Text style={{ flex: 1, fontWeight: 500 }}>BASIC SALARY</Text> */}
                    <InputNumber
                        value={basicSalary}
                        onChange={(value) => setBasicSalary(value || 0)}
                        min={0}
                        step={100}
                        style={{ width: 120 }}
                        size="small"
                    />
                </div>
            ),
        },
        {
            key: 'br1',
            label: 'BR 1 Allowance',
            amount: formatNumber(br1Allowance),
            editable: true,
            component: (
                <div>
                    {/* <Text style={{ flex: 1, fontWeight: 500 }}>BR 1 ALLOWANCE</Text> */}
                    <InputNumber
                        value={br1Allowance}
                        onChange={(value) => setBr1Allowance(value || 0)}
                        min={0}
                        step={100}
                        style={{ width: 120 }}
                        size="small"
                    />
                </div>
            ),
        },
        {
            key: 'br2',
            label: 'BR 2 Allowance',
            amount: formatNumber(br2Allowance),
            editable: true,
            component: (
                <div>
                    {/* <Text style={{ flex: 1, fontWeight: 500 }}>BR 2 ALLOWANCE</Text> */}
                    <InputNumber
                        value={br2Allowance}
                        onChange={(value) => setBr2Allowance(value || 0)}
                        min={0}
                        step={100}
                        style={{ width: 120 }}
                        size="small"
                    />
                </div>
            ),
        },
        {
            key: 'basicEpf',
            label: 'BASIC SALARY FOR EPF',
            amount: formatNumber(basicEpf),
            isBold: true,
        },
        {
            key: 'ot',
            label: 'OT',
            amount: overtimePay > 0 ? formatNumber(overtimePay) : '0.00',
        },

        { key: 'space-1', label: '', amount: '' },

        {
            key: 'gross',
            label: 'GROSS SALARY',
            amount: formatNumber(totalShiftPay),
        },
        { key: 'space-2', label: '', amount: '' },
        {
            key: 'compensation',
            label: 'Compensation',
            amount: totalCompensation ? formatNumber(totalCompensation) : '-',
        },

        { key: 'deductions', label: 'DEDUTIONS:', amount: '', isBold: true },

        {
            key: 'salaryadavances',
            label: 'Salary Advances',
            amount: totalSalaryAdvances > 0 ? formatNumber(totalSalaryAdvances) : '-',
            isDeduction: true,
        },
        {
            key: 'food',
            label: 'Food',
            amount: totalFood > 0 ? formatNumber(totalFood) : '-',
            isDeduction: true,
        },
        {
            key: 'transport',
            label: 'Transport',
            amount: totalTravel > 0 ? formatNumber(totalTravel) : '-',
            isDeduction: true,
        },
        {
            key: 'accomadation',
            label: 'accomadation',
            amount: totalAccomdation > 0 ? formatNumber(totalAccomdation) : '-',
            isDeduction: true,
        },
        {
            key: 'uniform',
            label: 'Uniform',
            amount: totalInventoryExpense > 0 ? formatNumber(totalInventoryExpense) : '-',
            isDeduction: true,
        },
        {
            key: 'fines',
            label: 'fines',
            amount: totalFines ? formatNumber(totalFines) : '-',
            isDeduction: true,
        },
        {
            key: 'bankchanrges',
            label: 'bank charges',
            amount: bankCharge > 0 ? formatNumber(bankCharge) : '-',
            isDeduction: true,
        },
        {
            key: 'welfare',
            label: 'welfare',
            amount: includeWelfare ? '200.00' : '0.00',
            isDeduction: true,
            isWelfare: true,
            component: (
                <div style={{display: 'flex', justifyContent: 'space-between'}}><Text className={`font-medium`}>{'welfare'.toLocaleUpperCase()}</Text> 
                <Checkbox checked={includeWelfare} onChange={(e) => setIncludeWelfare(e.target.checked)}>
                   Include Welfare (200)
                </Checkbox>
                </div>  
            ),
        },
        {
            key: 'otherLoanInstl',
            label: 'other: Loan Instl',
            amount: totalLoan > 0 ? formatNumber(totalLoan) : '-',
            isDeduction: true,
        },
    ];

    // Calculate totals including welfare
    const welfareDeduction = (includeWelfare ? 200 : 0);
    const earnings = totalShiftPay + totalCompensation;
    const deductions = totalAccomdation + totalFood + totalSalaryAdvances + totalTravel + totalLoan + totalInventoryExpense + bankCharge + welfareDeduction + totalFines;
    const netSalary = earnings - deductions;

    console.log({totalShiftPay, totalAccomdation, totalFood, totalTravel, totalLoan,totalSalaryAdvances, totalInventoryExpense, totalFines, totalCompensation })


    const columns: any = [
        {
            dataIndex: 'label',
            key: 'label',
            render: (text: string, record: any) => {

                if (record.isWelfare) {
                    return record.component;
                }
                return <Text className={`${record.isBold ? 'font-extrabold': 'font-medium'}`}>{text.toLocaleUpperCase()}</Text>;
            },
        },
        {
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (text: string, record: any) => {
                if (record.editable) {
                    return record.component; 
                }
                return (
                    <Text type={record.isDeduction ? 'danger' : 'success'}>
                        {record.isDeduction ? '-' : ''}
                        {text}
                    </Text>
                );
            },
        },
    ];



    const handleSavePayroll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
        const payrollData = {
            payroll_month: monthYear, // You should make this dynamic
            security_id: security?.securityId,
            parameters: {
                basic: basicSalary,
                br1: br1Allowance,
                br2: br2Allowance,
                basicEpf: basicEpf,
                ot: overtimePay,
                gross: totalShiftPay,
                compensation: totalCompensation,
                deductions: {
                    salaryAdvances: totalSalaryAdvances,
                    food: totalFood,
                    transport: totalTravel,
                    accommodation: totalAccomdation,
                    uniform: totalInventoryExpense,
                    fines: totalFines,
                    bankCharges: bankCharge,
                    welfare: includeWelfare ? 200 : 0,
                    loan: totalLoan
                },
                netSalary: netSalary
            }
        };

        const response = await savePayroll(payrollData);
        
        if (response.status === 201) {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            notifySuccess('SUCCESS', 'Payroll saved successfully');
        }
    } catch (error) {
        notifyError('ERROR', 'Failed to save payroll');
    } finally {
        setIsSaving(false);
    }
};

    return (
        <Card
            title={   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection:'column', justifyContent: 'space-between', padding: '8px 0' }}>
           {contextHolder}
           <Title style={{ margin: '0' }} level={3}>Monthly Payslip - {monthYear}</Title>
            { existingPayroll && <Title style={{ margin: '0' }} level={5}>Last updated - {dayjs(existingPayroll.updated_at).format('YYYY-MM-DD')}</Title>} 
            </div>
            <Button 
                type="primary" 
                onClick={handleSavePayroll}
                loading={isSaving}>
                {saveSuccess ? 'Saved!' : 'Save Payroll'}
            </Button>
        </div>}
            style={{ maxWidth: 600, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
            {security && (
                <div style={{ marginBottom: 24 }}>
                    <Text strong>Employee: </Text>
                    <Text>{security.securityName}</Text>
                    <br />
                    <Text strong>Employee ID: </Text>
                    <Text>{security.securityId}</Text>
                    <br />
                    <Text strong>Designation: </Text>
                    <Text>{security.securityType}</Text>
                </div>
            )}

            <Table
                dataSource={payslipData}
                columns={columns}
                pagination={false}
                showHeader={false}
                bordered
                size="middle"
                style={{ marginBottom: 24 }}
            />

            <div style={{ background: '#fafafa', padding: 16, borderRadius: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>Total Earnings:</Text>
                    <Text strong type="success">
                        {earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>Total Deductions:</Text>
                    <Text strong type="danger">
                        -{deductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                    <Text strong style={{ fontSize: 16 }}>
                        Net Salary Payable:
                    </Text>
                    <Text strong style={{ fontSize: 16 }} type="success">
                        {netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Text type="secondary">This is a computer generated payslip and does not require a signature.</Text>
            </div>
        </Card>
    );
};

export default PayslipComponent;
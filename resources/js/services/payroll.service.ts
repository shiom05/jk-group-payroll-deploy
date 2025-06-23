import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Payroll Service Functions
export const getPayrolls = () => {
    return axios.get('/api/payrolls');
}

export const getPayrollByMonth = (month: string) => {
    return axios.get(`/api/payrolls/month/${month}`);
}

export const savePayroll = (data: any) => {
    return axios.post('/api/payrolls', data);
}

export const updatePayroll = (id: number, data: any) => {
    return axios.put(`/api/payrolls/${id}`, data);
}


// Security-specific Payroll Functions
export const getSecurityPayrolls = (securityId: string) => {
    return axios.get(`/api/payrolls/security/${securityId}`);
}

export const getSecurityPayrollByMonth = (securityId: string, month: string) => {
    return axios.get(`/api/payrolls/security/${securityId}/month/${month}`);
}


// Utility function to format month (YYYY-MM)
export const formatPayrollMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}



interface PayrollRecord {
  id: number;
  payroll_month: string;
  security_id: string;
  parameters: {
    basic: number;
    br1: number;
    br2: number;
    basicEpf: number;
    ot: number;
    gross: number;
    compensation: number;
    deductions: Record<string, number>;
    netSalary: number;
  };
  security: {
    securityName: string;
    securityType: string;
    securityId: string;
  };
}

export const generatePayrollPDF = (records: PayrollRecord[], dateSelected: string) => {
  if (!dateSelected) {
      console.error('No date selected for PDF generation.');
      return false;
    }
  try {
  const doc = new jsPDF();

  records.forEach((record, index) => {
    if (index > 0) doc.addPage();

    doc.setFontSize(18);
    doc.text(`Payroll Report - ${record.security.securityName}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Period: ${record.payroll_month} | Employee ID: ${record.security_id} |  ${record.security.securityType}  `, 14, 30) ;

    autoTable(doc, {
      startY: 40,
      head: [['Earnings', 'Amount']],
      body: [
        ['Basic Salary', record.parameters.basic],
        ['BR1 Allowance', record.parameters.br1],
        ['BR2 Allowance', record.parameters.br2],
        ['Overtime', record.parameters.ot],
        ['Compensation', record.parameters.compensation],
        ['Total Earnings', record.parameters.gross]
      ],
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Deductions', 'Amount']],
      body: [
        ['Transport', record.parameters.deductions.transport],
        ['Accommodation', record.parameters.deductions.accommodation],
        ['Food', record.parameters.deductions.food],
        ['Inventory', record.parameters.deductions.uniform],
        ['Salary Advances', record.parameters.deductions.salaryAdvances],
        ['Loan', record.parameters.deductions.loan],
        ['Bank Charges', record.parameters.deductions.bankCharges],
        ['Welfare', record.parameters.deductions.welfare],
        ['Fines', record.parameters.deductions.fines],

        ['Total Deductions', Object.values(record.parameters.deductions).reduce((a, b) => a + b, 0)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [231, 76, 60] }
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      body: [
        ['Net Salary', record.parameters.netSalary]
      ],
      theme: 'plain',
      styles: { fontSize: 14, fontStyle: 'bold', textColor: [52, 152, 219] }
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.height - 10);
  });

  const [year, month] = dateSelected.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1); // month is 0-based
  const formattedMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g., May 2025
  doc.save(`payroll-report-${formattedMonth.replace(' ', '-')}.pdf`);
//   doc.save(`payroll-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  return true;
  } catch (error) {
    console.error('Error generating payroll PDF:', error);
    return false;
  }
};
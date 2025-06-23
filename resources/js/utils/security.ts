import Security from "@/types/jk/security";

    export const getStatusText = (status: number) => {
        switch (status) {
            case 200:
                return 'Active';
            case 300:
                return 'Pending';
            case 400:
                return 'Inactive';
            case 500:
                return 'Terminated';
            default:
                return 'Unknown';
        }
    };

export const formatDate = (dateStr: string | Date) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' }); // or 'short' for Apr
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

export const formatDateForInput = (dateString: any) => {
    if (!dateString) return '';
    
    // If it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If it's an ISO string (2024-08-15T00:00:00.000Z)
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    // For other formats, use Date object
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

export function getLeaveStatus(startDate: string | Date, endDate: string | Date) {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
      
        if (today < start) return "Pending";
        if (today >= start && today <= end) return "Active";
        return "Completed";
      }


export const getSecuiryDropdownOptions = (securites: Security[]) =>{

    const arrayOptions: {value: string, label: string}[] = [];

    securites.forEach((security: Security)=>{
        arrayOptions.push({
            value: security.securityId,
            label: security.securityName
        })
    });

    return arrayOptions;

}
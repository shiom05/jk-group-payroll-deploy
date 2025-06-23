import axios from 'axios';

export const getAllSecurities = ()=>{
    return axios.get(`/api/securities`);
}

export const getBankDetails = (id: string)=>{
    return axios.get(`/api/bank-details/${id}`);
}

export const leaveDetails = (id: string)=> {
    return axios.get(`/api/security-leaves/security/${id}`);
    
}
export const fetchSecurities = ()=> {
    return axios.get('/api/securities'); 
}
export const fetchAllStatusSecurities = ()=> {
    return axios.get('/api/all/securities'); 
}

export const fetchInventoryTypes = ()=> {
    return axios.get('/api/inventory/types'); 
}

export const saveInventory = (data: any)=> {
    return axios.post('/api/inventory', data); 
}

export const getInventoryitems = ()=>{
    return axios.get('/api/inventory')
}
export const editInventoryitems = (id: any, data: any)=>{
    return axios.put(`/api/inventory/${id}`, data);
}
export const allocateInventory = (data: any)=> {
    return axios.post('/api/inventory/allocate', data); 
}
export const returnInventory = (data: any)=> {
    return axios.post('/api/inventory/return', data); 
}

export const saveAsset = (data: any)=> {
    return axios.post('/api/inventory/asign-asset', data); 
}
export const returnAsset = (data: any)=> {
    return axios.post('/api/inventory/return-asset', data); 
}

export const getAsset = (securityId: any)=>{ //get current assets 
    return axios.get(`/api/inventory/security/${securityId}`); 
}

export const getAllocatedInventoriesForSecuriy = (securityId:any)=>{
    return axios.get(`/api/inventory/allocations/${securityId}`)
}

export const getAllocatedInventoriesForSecuriyCurrentMonth = (securityId:any, date: any)=>{ //use to calculate expense monthly
    return axios.get(`/api/inventory/allocations/current-month/${securityId}?date=${date}`)
}


export const getAllExpenses = ()=>{
    return axios.get(`/api/expenses/security`)
}
export const getSecurityExpenses = (securityId:any)=>{
    return axios.get(`/api/expenses/security/${securityId}`)
}

export const createExpenseSecurity = (data: any)=> {
    return axios.post('/api/expenses/security', data); 
}

export const editExpenseSecurity = (id: any, data: any)=> {
    return axios.put(`/api/expenses/security/${id}`, data); 
}

export const deleteExpenseSecurity = (id: any)=> {
    return axios.delete(`/api/expenses/security/${id}`); 
}


export const getSecurityCurrentMonthExpenses = (securityId:any, date:any)=>{
    return axios.get(`/api/expenses/security/${securityId}/current-month?date=${date}`)
}



// Loans----


export const getAllLoans = ()=>{
    return axios.get(`/api/loans/security`)
}
export const getSecurityLoans = (securityId:any)=>{
    return axios.get(`/api/loans/security/${securityId}`)
}

export const createLoanSecurity = (data: any)=> {
    return axios.post('/api/loans/security', data); 
}

export const editLoanSecurity = (id: any, data:any)=> {
    return axios.put(`/api/loans/security/${id}`, data); 
}
export const deleteLoanSecurity = (id: any)=> {
    return axios.delete(`/api/loans/security/${id}`); 
}

export const getSecurityCurrentMonthLoans = (securityId:any)=>{
    return axios.get(`/api/loans/security/${securityId}/current-month`)
}

export const getSecurityCurrentMonthPayrollLoans = (securityId:any, date?: any)=>{
    return axios.get(`/api/loans/security/${securityId}/current-month/payroll?date=${date}`)
}
export const resignSecurity = (securityId:any, resignationData: any)=>{
    return axios.post(`/api/termination/securities/${securityId}/resign`, resignationData);
}
export const rehireSecurity = (securityId:any, resignationData: any)=>{
    return axios.post(`/api/termination/securities/${securityId}/rehire`, resignationData);
}

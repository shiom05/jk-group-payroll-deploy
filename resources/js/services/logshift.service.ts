import axios from 'axios';

export const getAllShiftLogs = () => {
    return axios.get('/api/log-shift');
};

export const getShiftsBySecurityId = (securityId: string) => {
    return axios.get(`/api/log-shift/security/${securityId}`);
};

export const getShiftsByLocationId = (locationId: string) => {
    return axios.get(`/api/log-shift/location/${locationId}`);
};

export const getCurrentMonthShiftsForSecurity = (securityId: string, date: any) => {
    return axios.get(`/api/log-shift/security/${securityId}/current-month?date=${date}`);
};

export const createShiftLog = (data: any) => {
    return axios.post('/api/log-shift/create', data);
};

export const updateShiftLog = (id: number, data: any) => {
    return axios.put(`/api/log-shift/update/${id}`, data);
};

export const deleteShiftLog = (id: number) => {
    return axios.delete(`/api/log-shift/delete/${id}`);
};

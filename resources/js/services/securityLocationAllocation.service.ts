import axios from 'axios';

export const getAllAllocations = () => {
    return axios.get('/api/locations-allocations');
};

export const assignSecurityToLocation = (data: { security_id: string; location_id: string }) => {
    return axios.post('/api/locations-allocations/allocate-security', data);
};

export const removeSecurityFromLocation = (securityId: string, locationId: string) => {
    return axios.delete(`/api/locations-allocations/remove-allocation/${securityId}/${locationId}`);
};

export const getLocationsOfSecurity = (securityId: string) => {
    return axios.get(`/api/locations-allocations/security/${securityId}/locations`);
};

export const getSecuritiesOfLocation = (locationId: string) => {
    return axios.get(`/api/locations-allocations/location/${locationId}/securities`);
};

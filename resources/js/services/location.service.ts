import axios from 'axios';

export const getLocation = ()=>{
    return axios.get(`/api/locations`);
}

export const saveLocation = (data: any)=> {
    return axios.post('/api/locations', data); 
}

export const editLocation = (id: any, data:any)=> {
    return axios.put(`/api/locations/${id}`, data); 
}

export const deleteLocation = (id: any)=> {
    return axios.delete(`/api/locations/${id}`); 
}
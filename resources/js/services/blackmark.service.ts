// src/api/securityBlackMarks.ts

import axios from 'axios';

const API_URL = '/api/security-black-marks';

export interface SecurityBlackMark {
  id: string;
  security_id: string;
  security: {
    id: string;
    name: string;
  };
  type: string;
  incident_description: string;
  incident_date: string;
  inquiry_details?: string;
  fine_amount?: number;
  fine_effective_date?: string;
  status: 'pending' | 'completed';
}

export const fetchBlackMarks = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const fetchBlackMark = async (id: any) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createBlackMark = async (data: Omit<SecurityBlackMark, 'id' | 'security'>) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateBlackMark = async (id: string, data: Partial<SecurityBlackMark>) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const fetchSecurities = async () => {
  const response = await axios.get('/api/securities');
  return response.data;
};

export const deleteBlackMark = (id: any)=> {
    return axios.delete(`${API_URL}/${id}`); 
}

export const fetchPendingBlackMarks = async (securityId?: string) => {
  const url = securityId 
    ? `${API_URL}/current-month/pending/${securityId}`
    : `${API_URL}/current-month/pending`;
  const response = await axios.get(url);
  return response.data;
};

// completed black marks
export const fetchDeductibleBlackMarks = async (securityId?: string, date?: string) => {
  let url = securityId 
    ? `${API_URL}/current-month/deductible/${securityId}`
    : `${API_URL}/current-month/deductible`;

  if (date) {
    url += `?date=${(date)}`;
  }

  const response = await axios.get(url);
  return response.data;
};


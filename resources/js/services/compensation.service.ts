// src/services/compensationService.ts
import axios from 'axios';

const API_URL = '/api/compensation';

export interface SecurityCompensation {
  id?: number;
  security_id: string;
  amount: number;
  reason: string;
  effective_date: string;
  security?: {
    securityId: string;
    securityName: string;
  };
}

export const getCompensations = async (params?: {
  security_id?: string;
  month?: number;
}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const createCompensation = async (data: Omit<SecurityCompensation, 'id'>) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateCompensation = async (compensation: SecurityCompensation) => {
  const response = await axios.put(`${API_URL}/${compensation.id}`, compensation);
  return response.data;
};

export const deleteCompensation = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getCurrentMonthCompensations = async (security_id: string, date: any) => {
  const response = await axios.get(`${API_URL}/current-month/${security_id}?date=${date}`);
  return response.data;
};
import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export interface AuditParams {
  page?: number;
  limit?: number;
  entityName?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
}

export const fetchAudit = async (params: AuditParams = {}) => {
  const apiParams = { ...params };

  if (apiParams.fromDate) {
    apiParams.fromDate = new Date(apiParams.fromDate).toISOString();
  }

  if (apiParams.toDate) {
    apiParams.toDate = new Date(apiParams.toDate).toISOString();
  }

  try {
    const response = await axiosInstance.get('/Audit', {
      headers: { key: API_KEY, value: API_VALUE },
      params: apiParams,
    });

    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return {
      error: errorData?.error || errorData?.message || error.message,
      statusCode: error.response?.status,
    };
  }
};

export const fetchAuditById = async (id: number | string) => {
  try {
    const response = await axiosInstance.get(`/Audit/${id}`, {
      headers: { key: API_KEY, value: API_VALUE },
    });
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return {
      error: errorData?.error || errorData?.message || error.message,
      statusCode: error.response?.status,
    };
  }
};


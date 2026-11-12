import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const fetchCategories = async (params?: { searchName?: string; limit?: number }) => {
  try {
    const response = await axiosInstance.get('/Category', {
      headers: { key: API_KEY, value: API_VALUE },
      params,
    });
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const fetchCategoryById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/Category/${id}`, {
      headers: { key: API_KEY, value: API_VALUE },
    });
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

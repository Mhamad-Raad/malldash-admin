import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export interface DashboardStats {
  totalUsers: number;
  activeVendors: number;
  totalBuildings: number;
  totalApartments: number;
  occupiedApartments: number;
  totalProducts: number;
  pendingRequests: number;
}

export const fetchDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/Dashboard/admin', {
      headers: { key: API_KEY, value: API_VALUE },
    });
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return {
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || [],
    };
  }
};

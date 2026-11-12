import { axiosInstance } from '@/data/axiosInstance';
import type { ProductFilters } from '@/interfaces/Products.interface';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const fetchProducts = async (params?: ProductFilters) => {
  try {
    const response = await axiosInstance.get('/Product', {
      headers: { key: API_KEY, value: API_VALUE },
      params,
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

export const fetchProductById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/Product/${id}`, {
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

export const updateProduct = async (id: number, productData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `/Product/admin/${id}`,
      productData,
      {
        headers: {
          key: API_KEY,
          value: API_VALUE,
        },
        transformRequest: [(data) => data],
      }
    );
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return {
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || [],
    };
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/Product/admin/${id}`, {
      headers: { key: API_KEY, value: API_VALUE },
    });
    // If status is 204 No Content, return success
    if (response.status === 204 || !response.data) {
      return { error: null };
    }
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return {
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || [],
    };
  }
};

export const createProduct = async (productData: FormData) => {
  try {
    const response = await axiosInstance.post('/Product', productData, {
      headers: {
        key: API_KEY,
        value: API_VALUE,
      },
      transformRequest: [(data) => data],
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


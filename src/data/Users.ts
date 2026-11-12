import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const fetchUsers = async (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: number;
  buildingNameSearch?: string;
}) => {
  try {
    const response = await axiosInstance.get('/Account/users', {
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

export const fetchUserById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/Account/user/${id}`, {
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

export const updateUser = async (
  id: string,
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: number;
    ProfileImageUrl?: File;
  }
) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as any);
        console.log(`FormData appended: ${key} =`, value instanceof File ? `File: ${value.name}` : value);
      }
    });

    console.log('Sending update request to:', `/Account/${id}`);

    // Create a custom config to override the default Content-Type
    const response = await axiosInstance.put(`/Account/${id}`, formData, {
      headers: {
        key: API_KEY,
        value: API_VALUE,
        // Don't set Content-Type - let the browser set it with boundary for multipart/form-data
      },
      // This transformer prevents axios from setting the default Content-Type
      transformRequest: [(data) => data],
    });

    console.log('Update successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update failed:', error.response?.data || error.message);
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

// Delete user by ID (DELETE request)
export const deleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/Account/${id}`, {
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

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: number;
  ProfileImageUrl?: File;
}) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as any);
        console.log(`FormData appended: ${key} =`, value instanceof File ? `File: ${value.name}` : value);
      }
    });

    console.log('Creating user...');

    const response = await axiosInstance.post('/Account/register', formData, {
      headers: {
        key: API_KEY,
        value: API_VALUE,
        // Don't set Content-Type - let browser handle it for multipart/form-data
      },
      // This transformer prevents axios from setting the default Content-Type
      transformRequest: [(data) => data],
    });

    console.log('User created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create user failed:', error.response?.data || error.message);
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const createVendor = async (params: {
  name: string;
  description: string;
  openingTime: string;
  closeTime: string;
  type: number;
  userId: string;
  ProfileImageUrl?: File;
}) => {
  try {
    const hasFile = params.ProfileImageUrl instanceof File;

    if (hasFile && params.ProfileImageUrl) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', params.name);
      formData.append('description', params.description);
      formData.append('openingTime', params.openingTime);
      formData.append('closeTime', params.closeTime);
      formData.append('type', params.type.toString());
      formData.append('userId', params.userId);
      formData.append('ProfileImageUrl', params.ProfileImageUrl);

      const response = await axiosInstance.post('/Vendor', formData, {
        headers: {
          key: API_KEY,
          value: API_VALUE,
        },
        transformRequest: [(data) => data],
      });

      return response.data;
    } else {
      const response = await axiosInstance.post(
        '/Vendor',
        {
          name: params.name,
          description: params.description,
          openingTime: params.openingTime,
          closeTime: params.closeTime,
          type: params.type,
          userId: params.userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            key: API_KEY,
            value: API_VALUE,
          },
        }
      );
      return response.data;
    }
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const fetchVendors = async (params?: {
  page?: number;
  limit?: number;
  searchName?: string;
  type?: number;
}) => {
  try {
    const response = await axiosInstance.get('/Vendor', {
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

export const fetchVendorById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/Vendor/${id}`, {
      headers: { key: API_KEY, value: API_VALUE },
    });
    console.log('response.data', response.data);

    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const updateVendor = async (
  id: string,
  vendorData: {
    name: string;
    description: string;
    openingTime: string;
    closeTime: string;
    type: number;
    userId: string;
    ProfileImageUrl?: File;
  }
) => {
  try {
    const formData = new FormData();
    Object.entries(vendorData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as any);
        console.log(
          `FormData appended: ${key} =`,
          value instanceof File ? `File: ${value.name}` : value
        );
      }
    });

    console.log('Sending update request to:', `/Vendor/${id}`);

    // Create a custom config to override the default Content-Type
    const response = await axiosInstance.put(`/Vendor/${id}`, formData, {
      headers: {
        key: API_KEY,
        value: API_VALUE,
      },
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

export const deleteVendor = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/Vendor/${id}`, {
      headers: {
        key: API_KEY,
        value: API_VALUE,
      },
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


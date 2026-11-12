import { axiosInstance } from '@/data/axiosInstance';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export const fetchBuildings = async (params?: {
  page?: number;
  limit?: number;
  searchName?: string;
}) => {
  try {
    const response = await axiosInstance.get('/Building', {
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

export const fetchBuildingById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/Building/${id}`, {
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

export const fetchBuildingsByName = async (searchName: string) => {
  try {
    const response = await axiosInstance.get('/Building', {
      params: {
        limit: 5,
        searchName: searchName,
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

export const updateBuildingName = async (id: number, name: string) => {
  try {
    const response = await axiosInstance.put(
      `/Building/BuildingName/${id}`,
      { name },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const addBuildingFloor = async (buildingId: number) => {
  try {
    const response = await axiosInstance.post(`/Building/${buildingId}/floor`);
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const deleteBuildingFloor = async (floorId: number) => {
  try {
    const response = await axiosInstance.delete(`/Building/floor/${floorId}`);
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const updateApartment = async (
  id: number,
  apartmentName: string,
  userId: string | number | null
) => {
  try {
    const response = await axiosInstance.put(
      `/Building/apartment/${id}`,
      { apartmentName, userId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const addApartmentToFloor = async (
  floorId: number,
  apartmentName: string
) => {
  try {
    const response = await axiosInstance.post(
      `/Building/floor/${floorId}/apartment`,
      { apartmentName },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const deleteApartment = async (apartmentId: number) => {
  try {
    const response = await axiosInstance.delete(
      `/Building/apartment/${apartmentId}`
    );
    return response.data;
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const createBuilding = async (params: {
  name: string;
  floors: Array<{ floorNumber: number; numberOfApartments: number }>;
}) => {
  try {
    const response = await axiosInstance.post(
      '/Building',
      {
        name: params.name,
        floors: params.floors,
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
  } catch (error: any) {
    const errorData = error.response?.data;
    return { 
      error: errorData?.error || errorData?.message || error.message,
      errors: errorData?.errors || []
    };
  }
};

export const deleteBuilding = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/Building/${id}`, {
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

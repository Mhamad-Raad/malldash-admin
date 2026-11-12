import { axiosInstance } from '@/data/axiosInstance';
import type { Order, OrderStatus } from '@/interfaces/Order.interface';

interface FetchOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus | 'All' | null;
  search?: string;
  vendorId?: number;
}

interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

export const fetchOrders = async (
  params: FetchOrdersParams = {},
  signal?: AbortSignal
): Promise<OrdersResponse | { error: string }> => {
  try {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (params.status && params.status !== 'All') {
      queryParams.status = params.status;
    }
    if (params.search) {
      queryParams.search = params.search;
    }
    if (params.vendorId) {
      queryParams.vendorId = params.vendorId;
    }

    const response = await axiosInstance.get<OrdersResponse>('/Order', {
      params: queryParams,
      signal,
    });

    return response.data;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return {
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch orders',
    };
  }
};

export const fetchOrderById = async (
  id: number
): Promise<Order | { error: string }> => {
  try {
    const response = await axiosInstance.get<Order>(`/Order/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching order ${id}:`, error);
    return {
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch order',
    };
  }
};


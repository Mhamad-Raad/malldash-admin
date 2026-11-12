import { axiosInstance } from '@/data/axiosInstance';
import type {
  SupportTicketsResponse,
  TicketStatus,
  TicketPriority,
} from '@/interfaces/SupportTicket.interface';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_VALUE = import.meta.env.VITE_API_VALUE;

export interface FetchSupportTicketsParams {
  page?: number;
  limit?: number;
  status?: TicketStatus | 'all' | null;
  search?: string;
}

export const fetchSupportTickets = async (
  params: FetchSupportTicketsParams = {},
  signal?: AbortSignal
): Promise<SupportTicketsResponse | { error: string }> => {
  try {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (
      params.status !== undefined &&
      params.status !== null &&
      params.status !== 'all'
    ) {
      queryParams.status = params.status;
    }

    if (params.search) {
      queryParams.search = params.search;
    }

    const response = await axiosInstance.get<SupportTicketsResponse>(
      '/SupportTicket',
      {
        params: queryParams,
        signal,
        headers: { key: API_KEY, value: API_VALUE },
      }
    );

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch support tickets';

    return { error: message };
  }
};

export interface SupportTicketDetailInterface {
  id: number;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  resolvedAt?: string | null;
  adminNotes?: string | null;
  imageUrls: string[];
}

export const fetchSupportTicketById = async (
  id: number
): Promise<SupportTicketDetailInterface | { error: string }> => {
  try {
    const response = await axiosInstance.get<SupportTicketDetailInterface>(
      `/SupportTicket/${id}`,
      {
        headers: { key: API_KEY, value: API_VALUE },
      }
    );

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch support ticket';

    return { error: message };
  }
};

export const updateSupportTicketStatus = async (
  id: number,
  body: { status: TicketStatus; adminNotes: string | null }
): Promise<SupportTicketDetailInterface | { error: string }> => {
  try {
    const response = await axiosInstance.put<SupportTicketDetailInterface>(
      `/SupportTicket/${id}/status`,
      body,
      {
        headers: { key: API_KEY, value: API_VALUE },
      }
    );

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to update support ticket status';

    return { error: message };
  }
};


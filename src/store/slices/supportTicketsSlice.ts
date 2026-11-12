import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  SupportTicket,
  SupportTicketsResponse,
} from '@/interfaces/SupportTicket.interface';
import {
  fetchSupportTickets as fetchSupportTicketsAPI,
  type FetchSupportTicketsParams,
} from '@/data/SupportTickets';

interface SupportTicketsState {
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  limit: number;
  page: number;
  total: number;
}

const initialState: SupportTicketsState = {
  tickets: [],
  loading: false,
  error: null,
  limit: 10,
  page: 1,
  total: 0,
};

export const fetchSupportTickets = createAsyncThunk<
  SupportTicketsResponse,
  FetchSupportTicketsParams | undefined,
  { rejectValue: string; signal: AbortSignal }
>(
  'supportTickets/fetchSupportTickets',
  async (params = {}, { rejectWithValue, signal }) => {
    try {
      const data = await fetchSupportTicketsAPI(params, signal);

      if ('error' in data) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch {
      return rejectWithValue('Failed to fetch support tickets');
    }
  }
);

const supportTicketsSlice = createSlice({
  name: 'supportTickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSupportTickets.fulfilled,
        (state, action: PayloadAction<SupportTicketsResponse>) => {
          state.loading = false;
          state.tickets = action.payload.data;
          state.limit = action.payload.limit;
          state.page = action.payload.page;
          state.total = action.payload.total;
          state.error = null;
        }
      )
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default supportTicketsSlice.reducer;


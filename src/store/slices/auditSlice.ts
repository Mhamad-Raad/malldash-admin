import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuditLog } from '@/interfaces/Audit.interface';
import {
  fetchAudit as fetchAuditAPI,
  fetchAuditById as fetchAuditByIdAPI,
} from '@/data/Audit';
import type { AuditParams } from '@/data/Audit';

interface AuditState {
  logs: AuditLog[];
  selectedLog: AuditLog | null;
  loading: boolean;
  detailsLoading: boolean;
  error: string | null;
  limit: number;
  page: number;
  total: number;
}

const initialState: AuditState = {
  logs: [],
  selectedLog: null,
  loading: false,
  detailsLoading: false,
  error: null,
  limit: 20,
  page: 1,
  total: 0,
};

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchAuditLogs',
  async (params: AuditParams = {}, { rejectWithValue }) => {
    try {
      const data = await fetchAuditAPI(params);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch audit logs');
    }
  }
);

export const fetchAuditLogDetails = createAsyncThunk(
  'audit/fetchAuditLogDetails',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const data = await fetchAuditByIdAPI(id);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch audit log details');
    }
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedLog: (state) => {
      state.selectedLog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAuditLogs.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: AuditLog[];
            limit: number;
            page: number;
            total: number;
          }>
        ) => {
          state.loading = false;
          // Handle cases where data might be wrapped or just an array
          // Assuming the API returns { data: [], total: number, page: number, limit: number }
          // If it returns just an array, we might need to adjust.
          // Based on Users slice, it seems to return { data, limit, page, total }
          state.logs = action.payload.data || [];
          state.limit = action.payload.limit || state.limit;
          state.page = action.payload.page || state.page;
          state.total = action.payload.total || 0;
          state.error = null;
        }
      )
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAuditLogDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedLog = action.payload;
      })
      .addCase(fetchAuditLogDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedLog } = auditSlice.actions;
export default auditSlice.reducer;


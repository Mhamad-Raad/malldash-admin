import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Order,
  OrdersState,
  OrderStatus,
} from '@/interfaces/Order.interface';
import { fetchOrders as fetchOrdersAPI } from '@/data/Orders';

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  limit: 10,
  page: 1,
  total: 0,
  statusFilter: 'All',
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (
    params: {
      page?: number;
      limit?: number;
      status?: OrderStatus | 'All' | null;
      search?: string;
      vendorId?: number;
    } = {},
    { rejectWithValue, signal }
  ) => {
    try {
      const data = await fetchOrdersAPI(params, signal);

      if ('error' in data) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setStatusFilter: (
      state,
      action: PayloadAction<OrderStatus | 'All' | null>
    ) => {
      state.statusFilter = action.payload;
      state.page = 1; // Reset to first page on filter change
    },
    // Real-time updates
    addOrder: (state, action: PayloadAction<Order>) => {
      // Prevent duplicates
      if (state.orders.some((o) => o.id === action.payload.id)) {
        return;
      }

      // Only add if it matches current filter (or filter is All)
      if (
        state.statusFilter === 'All' ||
        !state.statusFilter ||
        action.payload.status === state.statusFilter
      ) {
        state.orders.unshift(action.payload);
        state.total += 1;

        // Remove last item if we exceed limit (optional, but keeps page size consistent)
        if (state.orders.length > state.limit) {
          state.orders.pop();
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Sync state with fetch params to ensure consistency without triggering re-fetches
        if (action.meta.arg.status !== undefined) {
          state.statusFilter = action.meta.arg.status;
        }
        if (action.meta.arg.page !== undefined) {
          state.page = action.meta.arg.page;
        }
        if (action.meta.arg.limit !== undefined) {
          state.limit = action.meta.arg.limit;
        }
      })
      .addCase(
        fetchOrders.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Order[];
            limit: number;
            page: number;
            total: number;
          }>
        ) => {
          state.loading = false;
          state.orders = action.payload.data;
          state.limit = action.payload.limit;
          state.page = action.payload.page;
          state.total = action.payload.total;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setLimit, setStatusFilter, addOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;


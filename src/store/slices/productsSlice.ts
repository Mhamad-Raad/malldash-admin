import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductType, ProductFilters } from '@/interfaces/Products.interface';
import { fetchProducts as fetchProductsAPI } from '@/data/Products';

interface ProductsState {
  products: ProductType[];
  loading: boolean;
  error: string | null;
  limit: number;
  page: number;
  total: number;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  limit: 10,
  page: 1,
  total: 0,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    params: ProductFilters = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchProductsAPI(params);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: ProductType[];
            limit: number;
            page: number;
            total: number;
          }>
        ) => {
          state.loading = false;
          state.products = action.payload.data;
          state.limit = action.payload.limit;
          state.page = action.payload.page;
          state.total = action.payload.total;
          state.error = null;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;

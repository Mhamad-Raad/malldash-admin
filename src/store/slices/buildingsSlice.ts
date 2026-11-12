import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BuildingType } from '@/interfaces/Building.interface'; // Define this type for building objects
import { fetchBuildings as fetchBuildingsAPI } from '@/data/Buildings';

interface BuildingsState {
  buildings: BuildingType[];
  loading: boolean;
  error: string | null;
  errors: string[];
  page: number;
  limit: number;
  total: number;
}

const initialState: BuildingsState = {
  buildings: [],
  loading: false,
  error: null,
  errors: [],
  page: 1,
  limit: 10,
  total: 0,
};

export const fetchBuildings = createAsyncThunk(
  'buildings/fetchBuildings',
  async (
    params: { page?: number; limit?: number; searchName?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchBuildingsAPI(params);
      if (data.error) {
        return rejectWithValue({ error: data.error, errors: data.errors || [] });
      }
      return data;
    } catch (error) {
      return rejectWithValue({ error: 'Failed to fetch buildings', errors: [] });
    }
  }
);

const buildingsSlice = createSlice({
  name: 'buildings',
  initialState,
  reducers: {
    clearBuildingsError(state) {
      state.error = null;
      state.errors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errors = [];
      })
      .addCase(
        fetchBuildings.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: BuildingType[];
            page: number;
            limit: number;
            total: number;
          }>
        ) => {
          state.loading = false;
          state.buildings = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.total = action.payload.total;
          state.error = null;
          state.errors = [];
        }
      )
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: string; errors: string[] } | undefined;
        state.error = payload?.error || 'An error occurred';
        state.errors = payload?.errors || [];
      });
  },
});

export const { clearBuildingsError } = buildingsSlice.actions;
export default buildingsSlice.reducer;

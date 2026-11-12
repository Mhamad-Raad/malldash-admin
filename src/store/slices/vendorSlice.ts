import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { VendorType, VendorAPIResponse } from '@/interfaces/Vendor.interface';
import { mapVendorAPIToUI } from '@/interfaces/Vendor.interface';
import { fetchVendorById as fetchVendorByIdAPI, updateVendor as updateVendorAPI, deleteVendor as deleteVendorAPI } from '@/data/Vendor';

interface VendorState {
  vendor: VendorType | null;
  loading: boolean;
  error: string | null;
  errors: string[];
  updating: boolean;
  updateError: string | null;
  updateErrors: string[];
}

const initialState: VendorState = {
  vendor: null,
  loading: false,
  error: null,
  errors: [],
  updating: false,
  updateError: null,
  updateErrors: [],
};

export const fetchVendorById = createAsyncThunk(
  'vendor/fetchVendorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await fetchVendorByIdAPI(id);

      if (data.error) {
        return rejectWithValue({ error: data.error, errors: data.errors || [] });
      }

      return data;
    } catch (error) {
      return rejectWithValue({ error: 'Failed to fetch vendor', errors: [] });
    }
  }
);

export const updateVendor = createAsyncThunk(
  'vendor/updateVendor',
  async (
    {
      id,
      vendorData,
    }: {
      id: string;
      vendorData: {
        name: string;
        description: string;
        openingTime: string;
        closeTime: string;
        type: number;
        userId: string;
        ProfileImageUrl?: File;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateVendorAPI(id, vendorData);

      if (data.error) {
        return rejectWithValue({ error: data.error, errors: data.errors || [] });
      }

      return data;
    } catch (error) {
      return rejectWithValue({ error: 'Failed to update vendor', errors: [] });
    }
  }
);

export const deleteVendor = createAsyncThunk(
  'vendor/deleteVendor',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await deleteVendorAPI(id);

      if (data.error) {
        return rejectWithValue({ error: data.error, errors: data.errors || [] });
      }

      return { id };
    } catch (error) {
      return rejectWithValue({ error: 'Failed to delete vendor', errors: [] });
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.errors = [];
      state.updateError = null;
      state.updateErrors = [];
    },
    clearVendor: (state) => {
      state.vendor = null;
      state.error = null;
      state.errors = [];
      state.updateError = null;
      state.updateErrors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vendor by ID
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errors = [];
      })
      .addCase(
        fetchVendorById.fulfilled,
        (state, action: PayloadAction<VendorAPIResponse>) => {
          state.loading = false;
          state.vendor = mapVendorAPIToUI(action.payload);
          state.error = null;
          state.errors = [];
        }
      )
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: string; errors: string[] } | undefined;
        state.error = payload?.error || 'An error occurred';
        state.errors = payload?.errors || [];
      })
      // Update vendor
      .addCase(updateVendor.pending, (state) => {
        state.updating = true;
        state.updateError = null;
        state.updateErrors = [];
      })
      .addCase(
        updateVendor.fulfilled,
        (state, action: PayloadAction<VendorAPIResponse>) => {
          state.updating = false;
          state.vendor = mapVendorAPIToUI(action.payload);
          state.updateError = null;
          state.updateErrors = [];
        }
      )
      .addCase(updateVendor.rejected, (state, action) => {
        state.updating = false;
        const payload = action.payload as { error: string; errors: string[] } | undefined;
        state.updateError = payload?.error || 'An error occurred';
        state.updateErrors = payload?.errors || [];
      });
  },
});

export const { clearError, clearVendor } = vendorSlice.actions;
export default vendorSlice.reducer;

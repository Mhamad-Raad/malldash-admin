import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserType } from '@/interfaces/Users.interface';
import {
  fetchUserById as fetchUserByIdAPI,
  updateUser as updateUserAPI,
  deleteUser as deleteUserAPI,
} from '@/data/Users';
import { initialUser } from '@/constants/Users';

interface UserState {
  user: UserType;
  luser: boolean;
  euser: string | null;
  euserErrors: string[];
  updating: boolean;
  updatingError: string | null;
  updatingErrors: string[];
  deleting: boolean;
  deletingError: string | null;
  deletingErrors: string[];
}

const initialState: UserState = {
  user: initialUser,
  luser: false,
  euser: null,
  euserErrors: [],
  updating: false,
  updatingError: null,
  updatingErrors: [],
  deleting: false,
  deletingError: null,
  deletingErrors: [],
};

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId: string, { rejectWithValue }) => {
    const data = await fetchUserByIdAPI(userId);
    if (data.error) return rejectWithValue({ error: data.error, errors: data.errors || [] });
    return data;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    {
      id,
      update,
    }: {
      id: string;
      update: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        role: number;
        imageFile?: File;
        buildingName?: string;
      };
    },
    { rejectWithValue }
  ) => {
    // Transform imageFile to ProfileImageUrl for API compatibility
    const apiPayload: any = {
      firstName: update.firstName,
      lastName: update.lastName,
      email: update.email,
      phoneNumber: update.phoneNumber,
      role: update.role,
    };

    // Only include ProfileImageUrl if a new file was provided
    if (update.imageFile instanceof File) {
      apiPayload.ProfileImageUrl = update.imageFile;
    }

    const data = await updateUserAPI(id, apiPayload);
    if (data.error) return rejectWithValue({ error: data.error, errors: data.errors || [] });
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue }) => {
    const data = await deleteUserAPI(id);
    if (data.error) return rejectWithValue({ error: data.error, errors: data.errors || [] });
    return data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = initialUser;
      state.euser = null;
      state.euserErrors = [];
      state.updating = false;
      state.updatingError = null;
      state.updatingErrors = [];
      state.deleting = false;
      state.deletingError = null;
      state.deletingErrors = [];
    },
    clearError: (state) => {
      state.euser = null;
      state.euserErrors = [];
      state.updatingError = null;
      state.updatingErrors = [];
      state.deletingError = null;
      state.deletingErrors = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch user
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.luser = true;
        state.euser = null;
        state.euserErrors = [];
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<UserType>) => {
          state.luser = false;
          state.user = action.payload;
          state.euser = null;
          state.euserErrors = [];
        }
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.luser = false;
        const payload = action.payload as { error: string; errors: string[] } | undefined;
        state.euser = payload?.error || 'An error occurred';
        state.euserErrors = payload?.errors || [];
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.updating = true;
        state.updatingError = null;
        state.updatingErrors = [];
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserType>) => {
          state.updating = false;
          state.user = action.payload;
          state.updatingError = null;
          state.updatingErrors = [];
        }
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.updating = false;
        const payload = action.payload as { error: string; errors: string[] } | undefined;
        state.updatingError = payload?.error || 'An error occurred';
        state.updatingErrors = payload?.errors || [];
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.deletingError = null;
        state.deletingErrors = [];
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.deleting = false;
        state.user = initialUser; // Clear user after deletion
        state.deletingError = null;
        state.deletingErrors = [];
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        const payload = action.payload as { error: string; errors: string[] } | undefined;
        state.deletingError = payload?.error || 'An error occurred';
        state.deletingErrors = payload?.errors || [];
      });
  },
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;

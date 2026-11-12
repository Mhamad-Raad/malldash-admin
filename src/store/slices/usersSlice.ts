import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserType } from '@/interfaces/Users.interface';
import { fetchUsers as fetchUsersAPI } from '@/data/Users';

interface UsersState {
  users: UserType[];
  lusers: boolean;
  eusers: string | null;
  limit: number;
  page: number;
  total: number;
}

const initialState: UsersState = {
  users: [],
  lusers: false,
  eusers: null,
  limit: 10,
  page: 1,
  total: 10,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (
    params: {
      page?: number;
      limit?: number;
      searchTerm?: string;
      role?: number;
      buildingNameSearch?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchUsersAPI(params);

      if (data.error) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch users');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.eusers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.lusers = true;
        state.eusers = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: UserType[];
            limit: number;
            page: number;
            total: number;
          }>
        ) => {
          state.lusers = false;
          state.users = action.payload.data;
          state.limit = action.payload.limit;
          state.page = action.payload.page;
          state.total = action.payload.total;
          state.eusers = null;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.lusers = false;
        state.eusers = action.payload as string;
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;

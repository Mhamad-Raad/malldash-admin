import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserType } from '@/interfaces/Users.interface';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getMe } from '@/data/Authorization';

interface MeState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  vendorProfile: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: MeState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  vendorProfile: null,
  loading: false,
  error: null,
};

export const fetchMe = createAsyncThunk(
  'me/fetchMe',
  async (_, { rejectWithValue }) => {
    const data = await getMe();
    if (data.error) {
      return rejectWithValue(data.error);
    }
    return data;
  }
);

const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    setMe: (state, action: PayloadAction<any>) => {
      const {
        user,
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        vendorProfile,
      } = action.payload;

      if (user && !user._id && user.id) {
        user._id = user.id;
      }

      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.accessTokenExpiresAt = accessTokenExpiresAt;
      state.refreshTokenExpiresAt = refreshTokenExpiresAt;
      state.vendorProfile = vendorProfile;
      state.error = null;
    },
    clearMe: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.accessTokenExpiresAt = null;
      state.refreshTokenExpiresAt = null;
      state.vendorProfile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        if (payload.user) {
          const {
            user,
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
            vendorProfile,
          } = payload;

          // Ensure _id is present if id is available
          if (user && !user._id && user.id) {
            user._id = user.id;
          }

          state.user = user;
          if (accessToken) state.accessToken = accessToken;
          if (refreshToken) state.refreshToken = refreshToken;
          if (accessTokenExpiresAt)
            state.accessTokenExpiresAt = accessTokenExpiresAt;
          if (refreshTokenExpiresAt)
            state.refreshTokenExpiresAt = refreshTokenExpiresAt;
          if (vendorProfile !== undefined) state.vendorProfile = vendorProfile;
        } else if (payload._id || payload.id || payload.email) {
          // Fallback: Assume payload is the user object itself
          const userPayload = payload as UserType;
          // Ensure _id is present if id is available
          if (!userPayload._id && userPayload.id) {
            userPayload._id = userPayload.id;
          }
          state.user = userPayload;
        }
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMe, clearMe } = meSlice.actions;
export default meSlice.reducer;


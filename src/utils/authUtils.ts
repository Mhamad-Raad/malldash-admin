import { axiosInstance } from '@/data/axiosInstance';

export interface RefreshTokenResponse {
  accessToken?: string;
  token?: string;
  access_token?: string;
}

export const validateRefreshToken = async (): Promise<RefreshTokenResponse | null> => {
  try {
    // The refresh token is sent automatically via HTTP-only cookie
    const response = await axiosInstance.post<RefreshTokenResponse>('/Account/Web/refresh', {});
    // Return the response data which should contain the new access token
    return response.data;
  } catch (error) {
    return null;
  }
};

// These functions are kept for backwards compatibility but tokens are now in HTTP-only cookies
export const getStoredTokens = () => ({
  accessToken: null,
  refreshToken: null,
});

export const clearTokens = () => {
  // Tokens are now managed via HTTP-only cookies
  // Call logout endpoint to clear them server-side
};

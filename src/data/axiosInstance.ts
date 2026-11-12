import axios, { AxiosError } from 'axios';
import { DEMO, demoAdapter } from '@/demo/server';

import type { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue: {
  resolve: () => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Public demo: every request is answered by the fake server in the browser (src/demo/server.ts).
if (DEMO) {
  axiosInstance.defaults.adapter = demoAdapter;
  axios.defaults.adapter = demoAdapter;
}

// No request interceptor needed for Authorization header
// Tokens are now sent via HTTP-only cookies automatically with withCredentials: true

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          await new Promise<void>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });

          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the new refresh token endpoint
        // The refresh token is sent automatically via HTTP-only cookie
        await axios.post(
          `${API_URL}/Account/NewRefreshToken`,
          {},
          { withCredentials: true }
        );

        // New tokens are set as HTTP-only cookies by the backend
        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (err: any) {
        processQueue(err);
        window.dispatchEvent(new Event('force-logout'));
        throw new Error(err?.message);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

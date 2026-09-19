import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // sends/receives the httpOnly auth cookie
});

let onUnauthorized: (() => void) | null = null;

/** AuthProvider calls this once on mount to hear about session-ending 401s. */
export const registerUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(err);
  },
);
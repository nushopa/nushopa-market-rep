// src/api/authApi.ts
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const is401 = err.response?.status === 401;
    const hasToken = !!localStorage.getItem("token");

    if (is401 && hasToken) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(err);
  },
);

export interface MarketRepProfileUpdate {
  city?: string;
  address?: string;
  state?: string;
  date_of_birth?: string;
  id_type?: string;
  profile_picture?: string;
  proof_of_identity?: string;
}

// Raw shape returned by the API — _id is the MongoDB identifier
export interface ApiAuthUser {
  _id: string;
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: number;
  city?: string;
  address?: string;
  proof_Of_Identity?: string;
  status?: string;
  profile_picture?: string;
  date_of_birth?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
  user?: ApiAuthUser;
}

export const sendOtpForSignup = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  password: string;
  role: number;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/create", data);
  return response.data;
};

export const verifyOtpAndCreateAccount = async (data: {
  email: string;
  otp: string;
}): Promise<AuthResponse> =>
  (await api.post<AuthResponse>("/verify-otp", data)).data;

export const resendOtp = async (email: string): Promise<AuthResponse> =>
  (await api.post<AuthResponse>("/resend-otp", { email })).data;

export const login = async (data: {
  email: string;
  password: string;
  role?: number;
}): Promise<AuthResponse> =>
  (await api.post<AuthResponse>("/login", data)).data;

export const forgotPassword = async (email: string): Promise<AuthResponse> =>
  (await api.post<AuthResponse>("/customers/forget", { email })).data;

export const verifyResetCode = async (data: {
  email: string;
  code: string;
}): Promise<AuthResponse> =>
  (await api.post<AuthResponse>("/customers/verify", data)).data;

export const updatePassword = async (data: {
  email: string;
  password: string;
  code?: string;
}): Promise<AuthResponse> =>
  (await api.post<AuthResponse>("/customers/update", data)).data;

export const getProfileDetails = async (): Promise<ApiAuthUser> => {
  const response = await api.get<{ customer: ApiAuthUser }>("/profile");
  return response.data.customer;
};

export const updateMarketRepProfile = async (
  data: MarketRepProfileUpdate
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put('/update/market-rep/profile', data);
  return response.data;
};

export const logoutUser = async () => {
  return (await api.post("/logout")).data;
};
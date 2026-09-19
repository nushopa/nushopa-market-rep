import { api } from "./httpClient";

export interface MarketRepProfileUpdate {
  city?: string;
  address?: string;
  state?: string;
  date_of_birth?: string;
  id_type?: string;
  profile_picture?: string;
  proof_of_identity?: string;
}

export interface ApiAuthUser {
  _id: string;
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: number;
  city?: string | null;
  address?: string | null;
  state?: string | null;
  id_type?: string | null;
  proof_Of_Identity?: string | null;
  status?: string | null;
  review?: boolean | null;
  auth_provider?: string;
  provider_id?: string | null;
  profile_picture?: string | null;
  date_of_birth?: string | null;
  profile_completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
  user?: ApiAuthUser;
}

export interface UpdateMarketRepProfileResponse {
  success: boolean;
  message: string;
  profile: ApiAuthUser;
}

export interface ApiErrorResponse {
  message?: string;
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
  data: MarketRepProfileUpdate,
): Promise<UpdateMarketRepProfileResponse> => {
  const response = await api.put<UpdateMarketRepProfileResponse>(
    "/update/market-rep/profile",
    data,
  );
  return response.data;
};

export const logoutUser = async () => {
  return (await api.post("/logout")).data;
};
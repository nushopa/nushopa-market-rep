import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as api from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { AuthUser } from '../context/AuthContext';

export interface ApiErrorResponse {
  message?: string;
}

export type AppAxiosError = AxiosError<ApiErrorResponse>;

// `ApiAuthUser.status` is `string | null | undefined`, but `AuthUser.status`
// is a narrow literal union. This coerces any unexpected value to `null`
// instead of trusting the backend string, so callers below can safely spread
// `data.user` into a `setUser` call without a type error or an unsafe cast.
const VALID_STATUSES = ['pending', 'approved', 'rejected'] as const;

function toAuthStatus(
  status: string | null | undefined,
): AuthUser['status'] {
  return VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])
    ? (status as AuthUser['status'])
    : null;
}

export const useSendSignupOtp = () =>
  useMutation<api.AuthResponse, AppAxiosError, Parameters<typeof api.sendOtpForSignup>[0]>({
    mutationFn: api.sendOtpForSignup,
  });

export const useVerifySignupOtp = () => {
  const qc = useQueryClient();
  const { setUser } = useAuth();

  return useMutation<api.AuthResponse, AppAxiosError, Parameters<typeof api.verifyOtpAndCreateAccount>[0]>({
    mutationFn: api.verifyOtpAndCreateAccount,
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
        qc.invalidateQueries({ queryKey: ['currentUser'] });
      }
      if (data?.user) {
        const resolvedId = data.user._id ?? data.user.id ?? '';
        localStorage.setItem('userId', resolvedId);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        setUser({
          ...data.user,
          id: resolvedId,
          name: `${data.user.first_name ?? ''} ${data.user.last_name ?? ''}`.trim(),
          status: toAuthStatus(data.user.status),
        });
      }
    },
  });
};

export const useResendOtp = () =>
  useMutation<api.AuthResponse, AppAxiosError, Parameters<typeof api.resendOtp>[0]>({
    mutationFn: api.resendOtp,
  });

export const useLogin = () => {
  const qc = useQueryClient();
  const { setUser } = useAuth();

  return useMutation<api.AuthResponse, AppAxiosError, Parameters<typeof api.login>[0]>({
    mutationFn: api.login,
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
        qc.invalidateQueries({ queryKey: ['currentUser'] });
      }
      if (data?.user) {
        const resolvedId = data.user._id ?? data.user.id ?? '';
        localStorage.setItem('userId', resolvedId);
        localStorage.setItem('authUser', JSON.stringify(data.user));
        setUser({
          ...data.user,
          id: resolvedId,
          name: `${data.user.first_name ?? ''} ${data.user.last_name ?? ''}`.trim(),
          status: toAuthStatus(data.user.status),
        });
      }
    },
  });
};

export const useForgotPassword = () =>
  useMutation<api.AuthResponse, AppAxiosError, Parameters<typeof api.forgotPassword>[0]>({
    mutationFn: api.forgotPassword,
  });

export const useVerifyResetCode = () =>
  useMutation<api.AuthResponse, AppAxiosError, Parameters<typeof api.verifyResetCode>[0]>({
    mutationFn: api.verifyResetCode,
  });

export const useUpdatePassword = () =>
  useMutation<api.AuthResponse, AppAxiosError, Parameters<typeof api.updatePassword>[0]>({
    mutationFn: api.updatePassword,
  });
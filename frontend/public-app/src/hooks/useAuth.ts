import { useMutation } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../lib/apiClient';
import { saveSession } from '../lib/auth';

interface LoginResponse {
  token: string;
  user: { name?: string; email?: string; role?: string; profileImage?: string };
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await apiFetch<LoginResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
      return saveSession(res.token, res.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (formData: FormData) => apiFetch('/api/auth/register', { method: 'POST', body: formData }),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => apiFetch<{ message?: string }>('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      apiFetch(`/api/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify({ password }) }),
  });
}

export { ApiError };

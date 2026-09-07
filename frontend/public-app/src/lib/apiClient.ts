import { getStoredUser } from './auth';

export const API_URL = import.meta.env.VITE_API_URL ?? 'https://aly-mbelleza-backend.onrender.com';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const user = getStoredUser();
  const headers = new Headers(options.headers);
  if (user?.token) headers.set('Authorization', `Bearer ${user.token}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error || 'Ocurrió un error inesperado.', res.status);
  }
  return data as T;
}

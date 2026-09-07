import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { User } from '../types/models';

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiFetch<{ data: User[] }>('/api/auth/users');
      return res.data;
    },
  });
}

// Igual que el panel viejo: parchea el usuario afectado en el cache en vez de
// refetchear toda la lista tras un cambio de un solo campo.
export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ data: User }>(`/api/auth/users/${id}/toggle-active`, { method: 'PUT' }),
    onSuccess: (res, id) => {
      queryClient.setQueryData<User[]>(['users'], (old) =>
        old?.map((u) => (u._id === id ? { ...u, isActive: res.data.isActive } : u))
      );
    },
  });
}

export function useSetUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'cliente' | 'admin' }) =>
      apiFetch<{ data: User }>(`/api/auth/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
    onSuccess: (res, { id }) => {
      queryClient.setQueryData<User[]>(['users'], (old) => old?.map((u) => (u._id === id ? { ...u, role: res.data.role } : u)));
    },
  });
}

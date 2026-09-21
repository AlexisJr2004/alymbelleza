import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import { isLoggedIn } from '../lib/auth';
import type { AppNotification } from '../types/models';

// Primer sistema de notificaciones genérico del proyecto — antes la campana
// (NotificationBell.tsx) solo leía citas directamente. Se mantiene separado
// de useAppointmentsQuery a propósito: NotificationBell combina ambas listas
// para no perder las citas, que ya funcionaban, en vez de migrarlas a este
// modelo nuevo.
export function useNotificationsQuery() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await apiFetch<{ data: AppNotification[] }>('/api/notifications');
      return res.data;
    },
    enabled: isLoggedIn(),
    // Ver notificaciones nuevas (p.ej. alguien respondió mientras se navegaba
    // por el sitio) sin depender de una recarga manual de la página.
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ data: AppNotification }>(`/api/notifications/${id}/read`, { method: 'PATCH' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<{ message: string }>('/api/notifications/read-all', { method: 'PATCH' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

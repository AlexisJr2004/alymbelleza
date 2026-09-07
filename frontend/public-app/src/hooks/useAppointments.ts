import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import { isLoggedIn } from '../lib/auth';
import type { Appointment } from '../types/models';

// Citas del usuario logueado — misma respuesta que alimenta tanto el panel
// "Tus citas" de citas.html como la campana de notificaciones en el header
// (son la misma llamada renderizada en dos sitios, no dos sistemas distintos).
export function useAppointmentsQuery() {
  return useQuery({
    queryKey: ['my-appointments'],
    queryFn: async () => {
      const res = await apiFetch<{ appointments: Appointment[] }>('/api/appointments');
      return res.appointments;
    },
    enabled: isLoggedIn(),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (date: string) => apiFetch<Appointment>('/api/appointments', { method: 'POST', body: JSON.stringify({ date }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-appointments'] }),
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'realizada' | 'cancelada' }) =>
      apiFetch(`/api/appointments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-appointments'] }),
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/appointments/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-appointments'] }),
  });
}

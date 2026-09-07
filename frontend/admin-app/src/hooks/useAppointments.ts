import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { Appointment } from '../types/models';

export function useAppointmentsQuery() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      try {
        const res = await apiFetch<{ appointments: Appointment[] }>('/api/appointments/admin/all');
        return res.appointments || [];
      } catch {
        return [] as Appointment[];
      }
    },
  });
}

// Igual que el panel viejo: parchea la cita afectada en el cache en vez de
// refetchear toda la lista tras un cambio de estado.
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'realizada' | 'cancelada' }) =>
      apiFetch(`/api/appointments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: (_res, { id, status }) => {
      queryClient.setQueryData<Appointment[]>(['appointments'], (old) =>
        old?.map((c) => (c._id === id ? { ...c, status } : c))
      );
    },
  });
}

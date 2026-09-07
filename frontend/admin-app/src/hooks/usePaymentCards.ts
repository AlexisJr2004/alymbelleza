import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { PaymentCard } from '../types/models';

export interface PaymentCardPayload {
  plantilla: 'pichincha' | 'guayaquil';
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  titular: string;
  marca: 'visa' | 'mastercard';
  activa: boolean;
}

export function usePaymentCardsQuery() {
  return useQuery({
    queryKey: ['payment-cards'],
    queryFn: async () => {
      const res = await apiFetch<{ data: PaymentCard[] }>('/api/payment-cards/admin');
      return res.data;
    },
  });
}

export function useCreatePaymentCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaymentCardPayload) =>
      apiFetch<{ data: PaymentCard }>('/api/payment-cards', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-cards'] }),
  });
}

export function useUpdatePaymentCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PaymentCardPayload }) =>
      apiFetch<{ data: PaymentCard }>(`/api/payment-cards/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-cards'] }),
  });
}

export function useDeletePaymentCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ message: string }>(`/api/payment-cards/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-cards'] }),
  });
}

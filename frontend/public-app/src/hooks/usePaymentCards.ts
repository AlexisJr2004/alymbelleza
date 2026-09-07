import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { PaymentCard } from '../types/models';

// GET /api/payment-cards es público (sin auth) y el controlador ya filtra por
// `activa: true` del lado del servidor (ver
// backend/.../paymentCardController.js getPaymentCards), así que acá no hace
// falta volver a filtrar.
export function usePaymentCardsQuery() {
  return useQuery({
    queryKey: ['payment-cards'],
    queryFn: async () => {
      const res = await apiFetch<{ success: boolean; data: PaymentCard[] }>('/api/payment-cards');
      return res.data;
    },
  });
}

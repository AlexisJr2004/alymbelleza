import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { Order } from '../types/models';

// POST /api/orders arma la orden a partir del carrito ACTUAL del usuario en el
// backend (no se manda el carrito en el body, solo el cupón opcional) y lo
// vacía como efecto colateral — ver backend/.../orderController.js createOrder
// y pagos.html líneas ~1367-1381.
export function useCreateOrder() {
  return useMutation({
    mutationFn: (couponCode?: string) =>
      apiFetch<{ success: boolean; data: Order }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ couponCode }),
      }),
  });
}

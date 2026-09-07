import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import { isLoggedIn } from '../lib/auth';
import type { Cart } from '../types/models';

// GET /api/cart devuelve el carrito directo (sin envolver en {data}), y cae a
// {items: []} si el usuario todavía no tiene uno — igual que hace el backend.
export function useCartQuery() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => apiFetch<Cart>('/api/cart'),
    enabled: isLoggedIn(),
  });
}

function useCartMutation() {
  const queryClient = useQueryClient();
  return { queryClient, invalidate: () => queryClient.invalidateQueries({ queryKey: ['cart'] }) };
}

export function useAddToCart() {
  const { invalidate } = useCartMutation();
  return useMutation({
    mutationFn: ({ productId, cantidad }: { productId: string; cantidad: number }) =>
      apiFetch<Cart>('/api/cart/add', { method: 'POST', body: JSON.stringify({ productId, cantidad }) }),
    onSuccess: invalidate,
  });
}

export function useUpdateCartQuantity() {
  const { invalidate } = useCartMutation();
  return useMutation({
    mutationFn: ({ productId, cantidad }: { productId: string; cantidad: number }) =>
      apiFetch<Cart>('/api/cart/update', { method: 'POST', body: JSON.stringify({ productId, cantidad }) }),
    onSuccess: invalidate,
  });
}

export function useRemoveFromCart() {
  const { invalidate } = useCartMutation();
  return useMutation({
    mutationFn: (productId: string) => apiFetch<Cart>('/api/cart/remove', { method: 'POST', body: JSON.stringify({ productId }) }),
    onSuccess: invalidate,
  });
}

export function useClearCart() {
  const { invalidate } = useCartMutation();
  return useMutation({
    mutationFn: () => apiFetch('/api/cart/clear', { method: 'POST' }),
    onSuccess: invalidate,
  });
}

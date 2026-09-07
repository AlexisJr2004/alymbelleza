import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { Coupon } from '../types/models';

export interface CouponPayload {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  active: boolean;
  expiresAt: string | null;
}

export function useCouponsQuery() {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await apiFetch<{ data: Coupon[] }>('/api/coupons');
      return res.data;
    },
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CouponPayload) =>
      apiFetch<{ data: Coupon }>('/api/coupons', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CouponPayload }) =>
      apiFetch<{ data: Coupon }>(`/api/coupons/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ message: string }>(`/api/coupons/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });
}

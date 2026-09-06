import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { Order } from '../types/models';

export function useOrdersQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const res = await apiFetch<{ data: Order[] }>('/api/orders');
        return res.data;
      } catch {
        return [] as Order[];
      }
    },
  });
}

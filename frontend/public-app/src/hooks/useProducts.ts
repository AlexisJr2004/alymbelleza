import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { Product } from '../types/models';

// Mismo endpoint público que usa el panel de admin (ver admin-app/src/hooks/useProducts.ts),
// aquí solo de lectura: el sitio público nunca crea/edita/borra productos.
export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await apiFetch<{ data: Product[] }>('/api/products');
      return res.data;
    },
  });
}

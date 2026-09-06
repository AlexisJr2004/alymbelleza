import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { Product } from '../types/models';

export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await apiFetch<{ data: Product[] }>('/api/products');
      return res.data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => apiFetch<{ data: Product }>('/api/products', { method: 'POST', body: formData }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      apiFetch<{ data: Product }>(`/api/products/${id}`, { method: 'PUT', body: formData }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ message: string }>(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

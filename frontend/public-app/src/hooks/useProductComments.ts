import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { ProductComment, ReactionType } from '../types/models';

// A diferencia de /api/testimonials (multer().none(), obliga multipart), esta
// ruta nueva usa express.json() como el resto de rutas modernas del backend —
// apiFetch ya pone Content-Type: application/json solo cuando el body no es
// FormData (ver apiClient.ts), así que estos mutationFn mandan objetos planos.
export function useProductCommentsQuery(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-comments', productId],
    queryFn: async () => {
      const res = await apiFetch<{ data: ProductComment[] }>(`/api/product-comments?productId=${productId}`);
      return res.data;
    },
    enabled: !!productId,
  });
}

interface CreateCommentInput {
  productId: string;
  comment: string;
  parentId?: string | null;
}

export function useCreateProductComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCommentInput) =>
      apiFetch<{ message: string; data: ProductComment }>('/api/product-comments', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: (_res, variables) => queryClient.invalidateQueries({ queryKey: ['product-comments', variables.productId] }),
  });
}

export function useUpdateProductComment(productId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      apiFetch<{ message: string; data: ProductComment }>(`/api/product-comments/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ comment }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product-comments', productId] }),
  });
}

export function useDeleteProductComment(productId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ message: string }>(`/api/product-comments/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product-comments', productId] }),
  });
}

export function useReactToComment(productId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: ReactionType }) =>
      apiFetch<{ data: ProductComment }>(`/api/product-comments/${id}/react`, { method: 'POST', body: JSON.stringify({ type }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product-comments', productId] }),
  });
}

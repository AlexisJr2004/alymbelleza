import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { GalleryItem } from '../types/models';

// GET /api/gallery es pública (galleryRoutes.js no la protege con verifyToken);
// apiFetch igual manda el Authorization header si hay sesión, sin efecto
// distinto server-side.
export function useGalleryQuery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const res = await apiFetch<{ success: boolean; data: GalleryItem[] }>('/api/gallery');
      return res.data;
    },
  });
}

// POST /api/gallery (multipart: category + file) — solo admin en el backend
// (authorize('admin') en galleryRoutes.js); GaleriaPage replica ese gate del
// lado del cliente antes de llamar a esta mutación.
export function useUploadGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<{ success: boolean; message: string; data: GalleryItem }>('/api/gallery', {
        method: 'POST',
        body: formData,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ success: boolean; message: string }>(`/api/gallery/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
  });
}

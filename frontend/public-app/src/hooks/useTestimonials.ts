import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { Testimonial } from '../types/models';

// GET /api/testimonials es paginado (page/limit), pero el sitio viejo (main.js
// loadTestimonials) nunca manda esos query params y se queda con la página por
// defecto del backend (page=1, limit=10) — se replica igual, sin agregar
// paginación que no existía.
export function useTestimonialsQuery() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const res = await apiFetch<{ data: Testimonial[] }>('/api/testimonials');
      return res.data;
    },
  });
}

interface TestimonialInput {
  name: string;
  role: string;
  comment: string;
  avatar: string;
}

// El backend monta estas rutas con multer().none(): solo campos de texto, sin
// archivos, pero exige multipart/form-data (no JSON). Un FormData enviado tal
// cual via fetch ya produce ese content-type con boundary automáticamente.
function toFormData(input: TestimonialInput): FormData {
  const fd = new FormData();
  fd.append('name', input.name);
  fd.append('role', input.role);
  fd.append('comment', input.comment);
  fd.append('avatar', input.avatar);
  return fd;
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TestimonialInput) =>
      apiFetch<{ message: string; data: Testimonial }>('/api/testimonials', { method: 'POST', body: toFormData(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: TestimonialInput & { id: string }) =>
      apiFetch<{ message: string; data: Testimonial }>(`/api/testimonials/${id}`, { method: 'PUT', body: toFormData(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ message: string }>(`/api/testimonials/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}

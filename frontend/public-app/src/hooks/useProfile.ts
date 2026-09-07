import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import { isLoggedIn } from '../lib/auth';
import type { ProfileUser } from '../types/models';

// Perfil del usuario logueado — alimenta tanto la tarjeta de solo lectura como
// los valores por defecto del formulario de edición en perfil.html.
export function useProfileQuery() {
  return useQuery({
    queryKey: ['profile-me'],
    queryFn: async () => {
      const res = await apiFetch<{ user: ProfileUser }>('/api/auth/me');
      return res.user;
    },
    enabled: isLoggedIn(),
  });
}

// PUT /api/auth/me (multipart) — mismos campos que updateProfile espera en
// backend/.../authController.js: name, dni, birthdate, gender, phone, address
// y opcionalmente profileImage.
//
// Desviación deliberada respecto a perfil.html: el original hace
// window.location.reload() tras un guardado exitoso para refrescar la
// tarjeta de perfil. Acá no hace falta un reload completo de la SPA — el
// propio backend ya devuelve el usuario actualizado en la respuesta, así que
// alcanza con escribirlo directo en la caché de ['profile-me'] para que la
// tarjeta (y el formulario, que se remonta con key={updatedAt}) reflejen los
// nuevos valores de inmediato.
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<{ success: boolean; message: string; user: ProfileUser }>('/api/auth/me', {
        method: 'PUT',
        body: formData,
      }),
    onSuccess: (res) => {
      queryClient.setQueryData(['profile-me'], res.user);
    },
  });
}

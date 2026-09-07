import { API_URL } from './apiClient';

export function formatoFechaLarga(fecha: Date): string {
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatoFechaCorta(fecha: string | Date): string {
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatoMoneda(valor: number): string {
  return `$${(valor || 0).toFixed(2)}`;
}

// Normaliza un número local de Ecuador a formato internacional para enlaces wa.me
export function numeroWhatsapp(phone: string): string {
  let digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (!digits.startsWith('593')) digits = '593' + digits;
  return digits;
}

// Puerto de formatImageUrl() de js/main.js — con una diferencia deliberada: usa
// API_URL (la URL absoluta del backend) en vez de window.location.origin, para
// que las imágenes con ruta relativa (/uploads/...) también resuelvan bien en
// desarrollo local (vite dev en localhost), no solo en producción donde
// frontend y backend comparten origen.
export function formatImageUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Puerto directo de la resolución de foto de perfil usada en el dropdown de
// usuario y el menú móvil (index.html:2770-2773 y equivalentes). El parámetro
// se tipa como un subconjunto estructural (no StoredUser completo) porque
// PerfilPage la reutiliza con el objeto de GET /api/auth/me, que trae los
// mismos campos name/profileImage pero no token — misma lógica, sin forzar
// un tipo que no encaja.
export function resolveProfileImage(user: { name?: string; profileImage?: string } | null): string {
  const img = user?.profileImage;
  if (img && img.startsWith('http')) return img;
  if (img && img.startsWith('/uploads/')) return `${API_URL}${img}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=random&length=1`;
}

import type { StoredUser } from './auth';
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
  return new Date(fecha).toLocaleDateString('es-ES');
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

export function resolveProfileImage(user: StoredUser | null): string {
  const img = user?.profileImage;
  if (img && img.startsWith('http')) return img;
  if (img && img.startsWith('/uploads/')) return `${API_URL}${img}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'A')}&background=random&length=1`;
}

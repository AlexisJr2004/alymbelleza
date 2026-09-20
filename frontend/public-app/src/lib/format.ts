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

// Inserta una transformación de Cloudinary justo después de "/upload/" en una
// URL de video/imagen ya subida (p.ej. .../upload/so_5/v169.../clip.mp4) — sin
// esto, `so_`/`eo_` (start/end offset) no tienen dónde ir. Si la URL no es de
// Cloudinary (no contiene "/upload/"), se devuelve tal cual: mejor mostrar el
// video completo sin recortar que romper la URL.
function insertCloudinaryTransformation(url: string, transformation: string): string {
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const insertAt = idx + marker.length;
  return `${url.slice(0, insertAt)}${transformation}/${url.slice(insertAt)}`;
}

function replaceUrlExtension(url: string, ext: string): string {
  const lastSlash = url.lastIndexOf('/');
  const lastDot = url.lastIndexOf('.');
  if (lastDot === -1 || lastDot < lastSlash) return `${url}.${ext}`;
  return `${url.slice(0, lastDot)}.${ext}`;
}

interface VideoPosterSource {
  url: string;
  type: string;
  posterSeconds?: number;
}

// Portada de un video de la galería (UploadModal.tsx elige el segundo,
// GalleryCard.tsx la muestra). No se sube ni procesa nada aparte: Cloudinary
// genera este JPG al vuelo (y lo cachea) a partir del fotograma en ese
// instante del video ya subido, la primera vez que se pide esta URL.
export function getGalleryVideoPosterUrl(item: VideoPosterSource): string {
  if (item.type !== 'video') return item.url;
  const seconds = item.posterSeconds ?? 0;
  return replaceUrlExtension(insertCloudinaryTransformation(item.url, `so_${seconds}`), 'jpg');
}

interface VideoTrimSource {
  url: string;
  type: string;
  trimStart?: number;
  trimEnd?: number;
}

// Video recortado según el rango elegido al subirlo (o el video completo si
// no se configuró ninguno) — igual que la portada, Cloudinary sirve el tramo
// pedido al vuelo sobre el mismo archivo, no hay una copia recortada aparte.
export function getGalleryVideoPlaybackUrl(item: VideoTrimSource): string {
  if (item.type !== 'video' || item.trimStart == null || item.trimEnd == null) return item.url;
  return insertCloudinaryTransformation(item.url, `so_${item.trimStart},eo_${item.trimEnd}`);
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

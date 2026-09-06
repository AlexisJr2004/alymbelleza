import { useEffect } from 'react';
import { getStoredUser, isAdmin } from '../../lib/auth';

// Mismo gate que el panel viejo: solo del lado del cliente (cada llamada a la
// API igual exige un JWT válido con rol admin por su cuenta). No-admin o sin
// sesión se redirige fuera de esta SPA, no a una ruta interna del router.
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const user = getStoredUser();
  const allowed = isAdmin(user);

  useEffect(() => {
    if (!allowed) {
      window.location.href = '/index.html';
    }
  }, [allowed]);

  if (!allowed) return null;
  return <>{children}</>;
}

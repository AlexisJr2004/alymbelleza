import type { Order, User } from '../types/models';

export interface ClienteRanking {
  nombre: string;
  email: string;
  total: number;
  gastado: number;
  ultimo: string;
  phone?: string;
  profileImage?: string;
}

// El pedido solo trae name/email del cliente (ver Order en types/models.ts) —
// el teléfono y la foto de perfil viven en el User completo, así que se
// cruzan acá por email. Lista completa sin recortar: ResumenPage.tsx se
// queda con el top 3 y RankingPage.tsx muestra el listado entero.
export function calcularClientesActivos(orders: Order[], users: User[]): ClienteRanking[] {
  const porUsuario: Record<string, ClienteRanking> = {};
  orders.forEach((o) => {
    const email = o.user?.email;
    if (!email) return;
    if (!porUsuario[email]) {
      porUsuario[email] = { nombre: o.user?.name || 'Cliente', email, total: 0, gastado: 0, ultimo: o.createdAt };
    }
    porUsuario[email].total += 1;
    porUsuario[email].gastado += o.total || 0;
    if (new Date(o.createdAt) > new Date(porUsuario[email].ultimo)) porUsuario[email].ultimo = o.createdAt;
  });
  const usuarioPorEmail = new Map(users.filter((u) => u.email).map((u) => [u.email as string, u]));
  Object.values(porUsuario).forEach((c) => {
    const u = usuarioPorEmail.get(c.email);
    c.phone = u?.phone;
    c.profileImage = u?.profileImage;
  });
  return Object.values(porUsuario).sort((a, b) => b.total - a.total);
}

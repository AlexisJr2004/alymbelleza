export interface StoredUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  token: string;
  profileImage?: string;
}

interface LoginResponseUser {
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

// El backend nunca manda _id en el body de /api/auth/login (solo va dentro del
// JWT como "userId"). El sitio viejo lo parchaba a mano en un par de sitios
// leyendo esto; acá se decodifica una sola vez, al guardar la sesión, para que
// _id esté siempre disponible sin que cada pantalla tenga que acordarse de hacerlo.
function decodeUserId(token: string): string | undefined {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload._id || payload.id;
  } catch {
    return undefined;
  }
}

export function saveSession(token: string, user: LoginResponseUser): StoredUser {
  const stored: StoredUser = { ...user, token, _id: decodeUserId(token) };
  localStorage.setItem('user', JSON.stringify(stored));
  return stored;
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw) as StoredUser;
    if (!user._id && user.token) user._id = decodeUserId(user.token);
    return user;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getStoredUser()?.token;
}

export function isAdmin(user: StoredUser | null): boolean {
  return !!user && user.role === 'admin';
}

export function logout(): void {
  localStorage.removeItem('user');
}

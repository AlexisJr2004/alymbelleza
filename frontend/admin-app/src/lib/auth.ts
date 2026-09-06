export interface StoredUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  token: string;
  profileImage?: string;
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function isAdmin(user: StoredUser | null): user is StoredUser {
  return !!user && user.role === 'admin';
}

export function logout(): void {
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

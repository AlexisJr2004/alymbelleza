import { useSyncExternalStore } from 'react';
import { getStoredUser } from '../lib/auth';

function subscribe(listener: () => void) {
  window.addEventListener('storage', listener);
  window.addEventListener('bella-session-changed', listener);
  return () => { window.removeEventListener('storage', listener); window.removeEventListener('bella-session-changed', listener); };
}
function snapshot() {
  try { return localStorage.getItem('user'); } catch { return null; }
}
export function useSessionUser() {
  useSyncExternalStore(subscribe, snapshot);
  const user = getStoredUser();
  return user?.token ? user : null;
}

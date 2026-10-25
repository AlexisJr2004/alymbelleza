import { useSyncExternalStore } from 'react';

const KEY = 'bella-beauty-favorites';
const EVENT = 'bella-favorites-changed';
let memoryValue = '[]';
let storageUnavailable = false;
function snapshot() {
  if (storageUnavailable) return memoryValue;
  try { return localStorage.getItem(KEY) || '[]'; } catch { return memoryValue; }
}
function subscribe(listener: () => void) {
  window.addEventListener('storage', listener);
  window.addEventListener(EVENT, listener);
  return () => { window.removeEventListener('storage', listener); window.removeEventListener(EVENT, listener); };
}
export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, snapshot);
  let favorites: string[] = [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) favorites = parsed.filter((id): id is string => typeof id === 'string');
  } catch { /* Ignore invalid stored data. */ }
  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id];
    memoryValue = JSON.stringify(next);
    try { localStorage.setItem(KEY, memoryValue); } catch { storageUnavailable = true; }
    window.dispatchEvent(new Event(EVENT));
  }
  return { favorites, toggleFavorite };
}

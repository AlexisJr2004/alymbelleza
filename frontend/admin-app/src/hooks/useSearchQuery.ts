import { useSearchParams } from 'react-router-dom';

// El buscador superior y el filtro de cada tabla comparten el mismo término.
export function useSearchQuery(): [string, (value: string) => void] {
  const [params, setParams] = useSearchParams();
  return [params.get('q') || '', (value) => setParams(current => {
    const next = new URLSearchParams(current);
    if (value) next.set('q', value); else next.delete('q');
    return next;
  }, { replace: true })];
}

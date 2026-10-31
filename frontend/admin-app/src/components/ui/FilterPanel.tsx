import { useEffect, useId, useState, type ReactNode } from 'react';
import { ChevronDownIcon } from '../icons';

export default function FilterPanel({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const id = useId();

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setExpanded(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return <aside className="admin-filters w-full shrink-0 lg:w-[208px]">
    <button type="button" className="admin-filter-toggle" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)}>
      Filtros y estadísticas
      <ChevronDownIcon className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
    </button>
    <div id={id} hidden={!expanded}>{children}</div>
  </aside>;
}

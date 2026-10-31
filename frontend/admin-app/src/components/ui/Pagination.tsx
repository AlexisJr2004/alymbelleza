interface PaginationProps {
  totalItems: number;
  porPagina: number;
  paginaActiva: number;
  onChange: (pagina: number) => void;
}

export default function Pagination({ totalItems, porPagina, paginaActiva, onChange }: PaginationProps) {
  const totalPaginas = Math.ceil(totalItems / porPagina);
  if (totalPaginas <= 1) return null;
  const pages = [...new Set([1, paginaActiva - 1, paginaActiva, paginaActiva + 1, totalPaginas])]
    .filter(page => page >= 1 && page <= totalPaginas).sort((a, b) => a - b);
  const control = 'h-8 min-w-8 rounded-lg border border-rose-100 bg-white px-2 text-xs disabled:opacity-40 hover:bg-rose-50';

  return <nav aria-label="Paginación" className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-rose-100 pt-3">
    <p className="text-xs text-muted">{totalItems} registros · Página {paginaActiva} de {totalPaginas}</p>
    <div className="flex items-center gap-1">
      <button type="button" className={control} aria-label="Página anterior" disabled={paginaActiva <= 1} onClick={() => onChange(paginaActiva - 1)}>‹</button>
      {pages.map((page, index) => <span key={page} className="flex items-center gap-1">
        {index > 0 && page - pages[index - 1] > 1 && <span aria-hidden="true" className="px-1 text-muted">…</span>}
        <button type="button" aria-label={`Página ${page}`} aria-current={page === paginaActiva ? 'page' : undefined} onClick={() => onChange(page)}
          className={page === paginaActiva ? 'h-8 min-w-8 rounded-lg bg-coral px-2 text-xs text-white' : control}>{page}</button>
      </span>)}
      <button type="button" className={control} aria-label="Página siguiente" disabled={paginaActiva >= totalPaginas} onClick={() => onChange(paginaActiva + 1)}>›</button>
    </div>
  </nav>;
}

interface PaginationProps {
  totalItems: number;
  porPagina: number;
  paginaActiva: number;
  onChange: (pagina: number) => void;
}

export default function Pagination({ totalItems, porPagina, paginaActiva, onChange }: PaginationProps) {
  const totalPaginas = Math.ceil(totalItems / porPagina);
  if (totalPaginas <= 1) return null;

  return (
    <nav aria-label="Paginación" className="flex flex-wrap justify-center mt-5 gap-2">
      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`Página ${i}`}
          aria-current={i === paginaActiva ? 'page' : undefined}
          onClick={() => onChange(i)}
          className={`h-10 min-w-10 px-3 text-sm font-semibold ${
            i === paginaActiva ? 'glass-button-primary' : 'glass-button'
          }`}
        >
          {i}
        </button>
      ))}
    </nav>
  );
}

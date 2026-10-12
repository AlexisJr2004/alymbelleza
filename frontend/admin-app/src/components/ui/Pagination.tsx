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
    <div className="flex justify-center mt-4 gap-1.5">
      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`h-8 w-8 rounded-full text-sm font-medium transition ${
            i === paginaActiva ? 'bg-ink text-white' : 'bg-white/50 text-[#3a3d45] hover:bg-white/90'
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

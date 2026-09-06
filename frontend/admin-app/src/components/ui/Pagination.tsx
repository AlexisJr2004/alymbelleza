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
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`mx-1 px-3 py-1 rounded transition ${
            i === paginaActiva ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

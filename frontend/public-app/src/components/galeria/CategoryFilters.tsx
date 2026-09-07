interface CategoryFiltersProps {
  active: string;
  onChange: (filter: string) => void;
}

// Copiado verbatim del orden/labels de los botones en galeria.html ~606-625
// (distinto del orden de <option> del modal de subida, que se copia aparte en
// UploadModal.tsx tal cual aparece en su propio markup).
const FILTERS = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'tratamiento_capilar', label: 'Tratamientos capilares' },
  { value: 'tratamiento_facial', label: 'Tratamientos faciales' },
  { value: 'especialidades', label: 'Especialidades' },
  { value: 'local', label: 'Local' },
];

// El original alterna clases con classList.add/remove sin limpiar del todo
// las anteriores (ej. el botón "Todas las categorías" nunca pierde su borde
// azul aunque quede "inactivo", y un botón activo termina con text-blue-700
// Y text-white a la vez, un choque de clases que depende del orden interno
// del CSS generado por Tailwind para decidir cuál gana). Acá se calculan las
// clases finales de forma declarativa según el estado activo/inactivo, sin
// heredar esa acumulación accidental — incluso el propio botón que empieza
// activo por defecto('all') termina con el mismo aspecto "pastilla azul
// rellena" que cualquier otro filtro seleccionado.
const ACTIVE_CLASSES =
  'filter-btn text-white bg-blue-700 border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 transition';
const INACTIVE_CLASSES =
  'filter-btn text-gray-900 border border-white hover:border-gray-200 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 transition';

export default function CategoryFilters({ active, onChange }: CategoryFiltersProps) {
  return (
    <div id="filter-buttons" className="flex items-center justify-center py-2 md:py-2 flex-wrap">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          data-filter={filter.value}
          onClick={() => onChange(filter.value)}
          className={active === filter.value ? ACTIVE_CLASSES : INACTIVE_CLASSES}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

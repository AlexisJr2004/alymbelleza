import type { useSwitchFilter } from '../../hooks/useSwitchFilter';
import Switch from '../ui/Switch';

interface CategoryFiltersProps {
  filter: ReturnType<typeof useSwitchFilter>;
}

// Copiado verbatim del orden/labels de los botones en galeria.html ~606-625
// (distinto del orden de <option> del modal de subida, que se copia aparte en
// UploadModal.tsx tal cual aparece en su propio markup).
const CATEGORIES = [
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

export default function CategoryFilters({ filter }: CategoryFiltersProps) {
  const allActive = filter.selected.size === 0;

  return (
    <>
      {/* Móvil: misma fila de pastillas de siempre — una sola categoría a la
          vez. Elegir una categoría reemplaza la selección; "Todas" limpia. */}
      <div className="lg:hidden flex items-center justify-center py-2 flex-wrap">
        <button type="button" onClick={filter.clear} className={allActive ? ACTIVE_CLASSES : INACTIVE_CLASSES}>
          Todas las categorías
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => {
              filter.clear();
              filter.toggle(c.value, true);
            }}
            className={filter.isChecked(c.value) ? ACTIVE_CLASSES : INACTIVE_CLASSES}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Escritorio: switches independientes, igual que en los filtros de
          productos (FiltrosSidebar.tsx) — se pueden combinar varias
          categorías a la vez. "Todas las categorías" no es un switch
          independiente de verdad: siempre refleja que no hay ninguna
          categoría marcada, y tocarlo limpia el resto. */}
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4">
        <Switch label="Todas las categorías" checked={allActive} onChange={() => filter.clear()} />
        {CATEGORIES.map((c) => (
          <Switch key={c.value} label={c.label} checked={filter.isChecked(c.value)} onChange={(checked) => filter.toggle(c.value, checked)} />
        ))}
      </div>
    </>
  );
}

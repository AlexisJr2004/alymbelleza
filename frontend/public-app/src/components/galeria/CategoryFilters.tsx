import { useState } from 'react';
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

// Sidebar de filtros de la galería — mismo patrón que FiltrosSidebar.tsx en
// productos: colapsable detrás de un botón "Filtros" en móvil, siempre
// visible a la izquierda del grid en escritorio (lg:sticky). Las categorías
// son switches independientes que se pueden combinar (OR); "Todas las
// categorías" no es un switch real, siempre refleja que no hay ninguna
// categoría marcada y tocarlo limpia el resto (igual que "Limpiar").
export default function CategoryFilters({ filter }: CategoryFiltersProps) {
  const [open, setOpen] = useState(false);
  const allActive = filter.selected.size === 0;

  return (
    <aside className="lg:w-72 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-2.5 mb-4 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700"
      >
        <span>
          <i className="fas fa-sliders-h mr-2 text-purple-500" />
          Filtros
        </span>
        <i className={`fas fa-chevron-down text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`${open ? 'block' : 'hidden'} lg:block space-y-6 border border-gray-200 rounded-xl p-5 lg:sticky lg:top-24`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Filtros</h3>
          <button type="button" onClick={filter.clear} className="text-xs font-medium text-purple-600 hover:text-purple-800">
            Limpiar
          </button>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Categoría</h4>
          <div className="space-y-2">
            <Switch label="Todas las categorías" checked={allActive} onChange={() => filter.clear()} />
            {CATEGORIES.map((c) => (
              <Switch key={c.value} label={c.label} checked={filter.isChecked(c.value)} onChange={(checked) => filter.toggle(c.value, checked)} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import type { ProductFilters } from '../../hooks/useProductFilters';
import Switch from '../ui/Switch';

const CATEGORIAS = [
  { value: 'capilar', label: 'Capilar' },
  { value: 'facial', label: 'Facial' },
];

const TIPOS = [
  { value: 'shampoo', label: 'Shampoo' },
  { value: 'acondicionador', label: 'Acondicionador' },
  { value: 'mascarilla', label: 'Mascarilla' },
  { value: 'crema', label: 'Crema' },
  { value: 'serum', label: 'Sérum' },
  { value: 'aceite', label: 'Aceite' },
  { value: 'tratamiento', label: 'Tratamiento' },
  { value: 'otro', label: 'Otro' },
];

interface FiltrosSidebarProps {
  filters: ProductFilters;
}

// Puerto del <aside> de filtros de productos.html (líneas ~532-626), incluido
// el botón "toggle-filtros" que lo colapsa en móvil (oculto en lg: y hacia
// arriba, donde el panel siempre se muestra).
export default function FiltrosSidebar({ filters }: FiltrosSidebarProps) {
  const [open, setOpen] = useState(false);

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
          <button type="button" onClick={filters.clear} className="text-xs font-medium text-purple-600 hover:text-purple-800">
            Limpiar
          </button>
        </div>

        {/* Categoría */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Categoría</h4>
          <div className="space-y-2">
            {CATEGORIAS.map((c) => (
              <Switch
                key={c.value}
                label={c.label}
                checked={filters.categoria.isChecked(c.value)}
                onChange={(checked) => filters.categoria.toggle(c.value, checked)}
              />
            ))}
          </div>
        </div>

        {/* Tipo de producto */}
        <div className="pt-5 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de producto</h4>
          <div className="space-y-2">
            {TIPOS.map((t) => (
              <Switch
                key={t.value}
                label={t.label}
                checked={filters.tipo.isChecked(t.value)}
                onChange={(checked) => filters.tipo.toggle(t.value, checked)}
              />
            ))}
          </div>
        </div>

        {/* Rango de precio */}
        <div className="pt-5 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Rango de precio</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Mín"
              value={filters.precioMin}
              onChange={(e) => filters.setPrecioMin(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              min={0}
              placeholder="Máx"
              value={filters.precioMax}
              onChange={(e) => filters.setPrecioMax(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Otros */}
        <div className="pt-5 border-t border-gray-100 space-y-2">
          <Switch label="Solo destacados" checked={filters.soloDestacados} onChange={filters.setSoloDestacados} />
          <Switch label="Solo disponibles" checked={filters.soloDisponibles} onChange={filters.setSoloDisponibles} />
        </div>
      </div>
    </aside>
  );
}

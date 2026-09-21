import { useEffect, useState } from 'react';
import type { GalleryItem } from '../../types/models';
import GalleryCard from './GalleryCard';

interface GalleryGridProps {
  items: GalleryItem[];
  isAdmin: boolean;
  hasActiveFilter: boolean;
  onItemClick: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
}

const TRANSITION_MS = 180;

// Puerto de #gallery-grid (galeria.html ~628). El sitio viejo declaraba una
// transición de opacidad/escala para el filtrado, pero una SEGUNDA definición
// de applyFilter() más abajo en el mismo script (un simple display:block/none)
// pisaba a la primera y esa animación nunca llegó a ejecutarse — el filtrado
// terminaba siendo instantáneo. Acá sí se implementa: al cambiar la categoría
// activa, la grilla actual se desvanece brevemente y la nueva entra con una
// aparición escalonada por tarjeta, en vez de reemplazar el contenido de
// golpe. `displayed` (no `items` directamente) es lo que se pinta, para poder
// mantener el contenido VIEJO visible durante el breve fundido de salida
// antes de swapearlo por el nuevo — comparado por "firma" (ids concatenados)
// en vez de por referencia, porque el arreglo filtrado es nuevo en cada
// render aunque su contenido no haya cambiado.
export default function GalleryGrid({ items, isAdmin, hasActiveFilter, onItemClick, onDelete }: GalleryGridProps) {
  const signature = items.map((i) => i._id).join(',');
  const [displayed, setDisplayed] = useState({ items, signature, generation: 0 });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (signature === displayed.signature) return undefined;
    setFading(true);
    const t = window.setTimeout(() => {
      setDisplayed((prev) => ({ items, signature, generation: prev.generation + 1 }));
      setFading(false);
    }, TRANSITION_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const count = displayed.items.length;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {count} elemento{count === 1 ? '' : 's'} {count === 1 ? 'encontrado' : 'encontrados'}
      </p>

      {count === 0 ? (
        <div className="w-full flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <i className="fas fa-image text-2xl text-purple-300" />
          </div>
          <p className="font-medium text-gray-600">{hasActiveFilter ? 'No se encontró contenido' : 'Aún no hay contenido en la galería'}</p>
          <p className="text-sm text-gray-400 mt-1">
            {hasActiveFilter ? 'Prueba a elegir otra categoría' : 'Vuelve pronto para ver fotos y videos'}
          </p>
        </div>
      ) : (
        <div
          id="gallery-grid"
          className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-200 ease-out ${
            fading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
          }`}
        >
          {displayed.items.map((item, i) => (
            <div
              key={`${item._id}-${displayed.generation}`}
              style={{ animation: 'galleryItemIn 0.35s ease-out both', animationDelay: `${Math.min(i, 11) * 30}ms` }}
            >
              <GalleryCard item={item} isAdmin={isAdmin} onClick={() => onItemClick(item)} onDelete={() => onDelete(item._id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

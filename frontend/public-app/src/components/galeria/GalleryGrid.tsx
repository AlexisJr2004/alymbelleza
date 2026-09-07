import type { GalleryItem } from '../../types/models';
import GalleryCard from './GalleryCard';

interface GalleryGridProps {
  items: GalleryItem[];
  isAdmin: boolean;
  onItemClick: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
}

// Puerto de #gallery-grid (galeria.html ~628). El filtrado en el sitio viejo
// terminaba resuelto por la SEGUNDA definición de applyFilter() (galeria.html
// ~1155-1161, un simple display:block/none), que pisa a la primera versión
// con transición de opacidad/escala declarada antes en el mismo script (misma
// función, mismo scope — la última declaración gana) — esa primera versión
// nunca llega a ejecutarse. Acá directamente se renderiza el array ya
// filtrado que recibe como prop, sin animación, replicando el comportamiento
// que el sitio real efectivamente tiene.
export default function GalleryGrid({ items, isAdmin, onItemClick, onDelete }: GalleryGridProps) {
  return (
    <div id="gallery-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <GalleryCard key={item._id} item={item} isAdmin={isAdmin} onClick={() => onItemClick(item)} onDelete={() => onDelete(item._id)} />
      ))}
    </div>
  );
}

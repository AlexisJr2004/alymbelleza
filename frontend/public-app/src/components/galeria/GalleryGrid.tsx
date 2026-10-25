import type { GalleryItem } from '../../types/models';
import GalleryCard from './GalleryCard';
import StoreIcon from '../home/StoreIcon';

interface GalleryGridProps {
  items: GalleryItem[];
  isAdmin: boolean;
  hasActiveFilter: boolean;
  onItemClick: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
}
export default function GalleryGrid({ items, isAdmin, hasActiveFilter, onItemClick, onDelete }: GalleryGridProps) {
  const count = items.length;
  return <div>
    <p className="bb-gallery-count" role="status">{count} {count === 1 ? 'elemento encontrado' : 'elementos encontrados'}</p>
    {count === 0 ? <div className="bb-commerce-empty bb-gallery-empty">
      <StoreIcon name="image" /><h2>{hasActiveFilter ? 'No se encontró contenido' : 'Pronto, más momentos para compartir'}</h2>
      <p>{hasActiveFilter ? 'Prueba a elegir otra categoría.' : 'Aún no hay contenido en la galería. Vuelve pronto para ver fotos y videos.'}</p>
    </div> : <div id="gallery-grid" className="bb-gallery-grid" key={items.map(item => item._id).join(',')}>
      {items.map((item, index) => <div key={item._id} style={{ animation: 'galleryItemIn .35s ease-out both', animationDelay: `${Math.min(index, 11) * 30}ms` }}>
        <GalleryCard item={item} isAdmin={isAdmin} onClick={() => onItemClick(item)} onDelete={() => onDelete(item._id)} />
      </div>)}
    </div>}
  </div>;
}

import { useState } from 'react';
import { formatDuration, formatImageUrl, getGalleryVideoPosterUrl } from '../../lib/format';
import { galleryCategoryLabel } from '../../lib/galleryCategories';
import type { GalleryItem } from '../../types/models';
import StoreIcon from '../home/StoreIcon';

interface GalleryCardProps {
  item: GalleryItem;
  isAdmin: boolean;
  onClick: () => void;
  onDelete: () => void;
}
export default function GalleryCard({ item, isAdmin, onClick, onDelete }: GalleryCardProps) {
  const [failed, setFailed] = useState(false);
  const category = galleryCategoryLabel(item.category);
  const fecha = new Date(item.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  return <article className="bb-gallery-card" data-category={item.category}>
    <button className="bb-gallery-open" type="button" onClick={onClick} aria-label={`Ver ${item.type === 'video' ? 'video' : 'foto'} de ${category}, ${fecha}`}>
      <span className="bb-gallery-media">
        {failed ? <span className="bb-gallery-unavailable"><StoreIcon name="image" /><span>Vista previa no disponible</span></span>
          : <img src={formatImageUrl(item.type === 'video' ? getGalleryVideoPosterUrl(item) : item.url)} alt={category} loading="lazy" onError={() => setFailed(true)} />}
        <span className="bb-gallery-type"><StoreIcon name={item.type === 'video' ? 'play' : 'image'} />{item.type === 'video' ? 'Video' : 'Foto'}</span>
        {item.type === 'video' && <span className="bb-gallery-play"><StoreIcon name="play" /></span>}
        {item.type === 'video' && typeof item.duration === 'number' && <span className="bb-gallery-duration">{formatDuration(item.duration)}</span>}
      </span>
      <span className="bb-gallery-caption"><span><strong>{category}</strong><time dateTime={item.createdAt}>{fecha}</time></span><StoreIcon name="arrow" /></span>
    </button>
    {isAdmin && <button className="bb-gallery-delete" type="button" aria-label={`Eliminar elemento de ${category}`} onClick={onDelete}><StoreIcon name="trash" /></button>}
  </article>;
}

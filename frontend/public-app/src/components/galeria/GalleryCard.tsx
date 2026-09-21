import { formatDuration, formatImageUrl, getGalleryVideoPosterUrl } from '../../lib/format';
import type { GalleryItem } from '../../types/models';

interface GalleryCardProps {
  item: GalleryItem;
  isAdmin: boolean;
  onClick: () => void;
  onDelete: () => void;
}

// Puerto de una tarjeta de renderDatabaseGallery() (galeria.html ~994-1077).
// El botón de eliminar solo se pinta acá (al pasar el mouse sobre la
// tarjeta) — el popup/lightbox del original no tiene ningún botón de borrar
// en su propio markup, así que esa acción no se duplica en LightboxModal.
export default function GalleryCard({ item, isAdmin, onClick, onDelete }: GalleryCardProps) {
  const url = formatImageUrl(item.url);
  const fecha = new Date(item.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div
      className="gallery-item relative group rounded-xl overflow-hidden shadow-md bg-white transition-all duration-500 ease-in-out cursor-pointer hover:shadow-2xl hover:-translate-y-1"
      data-category={item.category}
      onClick={onClick}
    >
      {item.type === 'video' ? (
        <>
          <img
            src={formatImageUrl(getGalleryVideoPosterUrl(item))}
            alt={item.category}
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
          />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center pointer-events-none">
            <i className="fas fa-play text-white text-sm ml-0.5" />
          </span>
          {typeof item.duration === 'number' && (
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs font-medium pointer-events-none">
              {formatDuration(item.duration)}
            </span>
          )}
        </>
      ) : (
        <img
          src={url}
          alt={item.category}
          loading="lazy"
          className="w-full h-48 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
        />
      )}

      <div className="gallery-hover-info absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <span className="text-white text-base font-semibold px-4 py-2 rounded-lg bg-black/70 shadow-lg backdrop-blur-sm">
          <i className="fas fa-calendar-alt mr-2" />
          {fecha}
        </span>
      </div>

      {isAdmin && (
        <button
          type="button"
          aria-label="Eliminar elemento"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
        >
          <i className="fas fa-trash text-xs" />
        </button>
      )}
    </div>
  );
}

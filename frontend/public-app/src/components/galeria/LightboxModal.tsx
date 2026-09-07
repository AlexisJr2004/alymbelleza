import { useEffect } from 'react';
import { formatImageUrl } from '../../lib/format';
import type { GalleryItem } from '../../types/models';

interface LightboxModalProps {
  items: GalleryItem[];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

// Puerto del popup de galería (galeria.html ~559-581 + script ~1167-1287):
// navegación anterior/siguiente y tira de miniaturas, ambas acotadas al
// arreglo YA FILTRADO que se le pasa (openGalleryPopup() en el original arma
// `popupItems` a partir de currentGalleryFilter en el momento de abrir el
// popup, no de la lista completa sin filtrar) — GaleriaPage es quien calcula
// ese arreglo antes de montar este componente.
export default function LightboxModal({ items, index, onNavigate, onClose }: LightboxModalProps) {
  const total = items.length;
  const multiple = total > 1;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + total) % total);
      if (e.key === 'ArrowRight') onNavigate((index + 1) % total);
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [index, total, onNavigate, onClose]);

  const item = items[index];
  if (!item) return null;

  const url = formatImageUrl(item.url);
  const fecha = new Date(item.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-transparent max-w-3xl w-full flex flex-col items-center">
        {multiple && (
          <button
            type="button"
            onClick={() => onNavigate((index - 1 + total) % total)}
            aria-label="Elemento anterior"
            className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <i className="fas fa-chevron-left" />
          </button>
        )}
        {multiple && (
          <button
            type="button"
            onClick={() => onNavigate((index + 1) % total)}
            aria-label="Elemento siguiente"
            className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <i className="fas fa-chevron-right" />
          </button>
        )}

        <div className="w-full flex items-center justify-center">
          {item.type === 'video' ? (
            // key={item._id} fuerza un elemento <video> nuevo por cada
            // navegación (igual que document.createElement("video") en el
            // original), para que autoPlay realmente dispare en cada cambio
            // en vez de que React solo actualice el atributo src de un mismo
            // nodo ya reproducido.
            <video key={item._id} src={url} controls autoPlay className="max-h-[70vh] max-w-full rounded-lg shadow-lg" />
          ) : (
            <img key={item._id} src={url} alt={item.category} className="max-h-[70vh] max-w-full rounded-lg shadow-lg" />
          )}
        </div>
        <div className="mt-4 text-white text-sm">Subido el {fecha}</div>

        {multiple && (
          <div className="mt-8 max-w-full">
            <div className="flex items-center gap-3 overflow-x-auto px-3 py-3 bg-white/5 backdrop-blur-sm rounded-xl">
              {items.map((it, i) => (
                <button
                  key={it._id}
                  type="button"
                  onClick={() => onNavigate(i)}
                  aria-label={`Ver elemento ${i + 1} de ${total}`}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    i === index ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-90'
                  }`}
                >
                  {it.type === 'video' ? (
                    <video src={formatImageUrl(it.url)} muted className="w-full h-full object-cover pointer-events-none" />
                  ) : (
                    <img src={formatImageUrl(it.url)} alt="" className="w-full h-full object-cover pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

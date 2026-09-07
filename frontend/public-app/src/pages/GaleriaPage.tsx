import { useState } from 'react';
import { useDeleteGalleryItem, useGalleryQuery, useUploadGalleryItem } from '../hooks/useGallery';
import { getStoredUser, isAdmin as checkIsAdmin } from '../lib/auth';
import { confirmAction, notifyError, notifySuccess } from '../lib/sweetalert';
import CategoryFilters from '../components/galeria/CategoryFilters';
import GalleryGrid from '../components/galeria/GalleryGrid';
import UploadModal from '../components/galeria/UploadModal';
import LightboxModal from '../components/galeria/LightboxModal';
import type { GalleryItem } from '../types/models';

interface LightboxState {
  items: GalleryItem[];
  index: number;
}

// Página "Galería" — puerto de frontend/galeria.html. El botón/sección
// "Subir Contenido" y el botón de eliminar en cada tarjeta solo se muestran
// para admin (mismo gate que authorize('admin') en
// backend/.../galleryRoutes.js para POST/DELETE); GET /api/gallery es pública.
export default function GaleriaPage() {
  const { data: items, isLoading, isError } = useGalleryQuery();
  const uploadItem = useUploadGalleryItem();
  const deleteItem = useDeleteGalleryItem();

  const [activeFilter, setActiveFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const user = getStoredUser();
  const admin = checkIsAdmin(user);

  const allItems = items ?? [];
  const filteredItems = activeFilter === 'all' ? allItems : allItems.filter((item) => item.category === activeFilter);

  function openLightbox(item: GalleryItem) {
    // openGalleryPopup() en el original arma la lista de navegación a partir
    // del filtro activo EN ESE MOMENTO, con fallback al elemento suelto si el
    // filtro no incluye nada (caso borde que en la práctica no debería darse,
    // ya que el propio item clickeado viene de la lista filtrada).
    const pool = filteredItems.length ? filteredItems : [item];
    const idx = pool.findIndex((i) => i._id === item._id);
    setLightbox({ items: pool, index: idx === -1 ? 0 : idx });
  }

  async function handleUploadSubmit(formData: FormData) {
    // Réplica del guard de admin que hace uploadForm.addEventListener('submit', ...)
    // en el original, además del gate visual del botón "Subir Contenido".
    if (!admin) {
      notifyError('No autorizado', 'Solo los administradores pueden subir contenido.');
      return;
    }
    try {
      const res = await uploadItem.mutateAsync(formData);
      notifySuccess('¡Éxito!', res.message);
      setUploadOpen(false);
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'Error al subir el archivo');
    }
  }

  async function handleDelete(id: string) {
    const confirmed = await confirmAction({
      title: '¿Eliminar elemento?',
      text: 'Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
    });
    if (!confirmed) return;
    try {
      const res = await deleteItem.mutateAsync(id);
      notifySuccess('Eliminado', res.message);
      // El elemento eliminado puede ser el que está abierto en el lightbox.
      setLightbox(null);
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'Error al eliminar el elemento');
    }
  }

  return (
    <>
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSubmit={handleUploadSubmit} isSubmitting={uploadItem.isPending} />

      {lightbox && (
        <LightboxModal
          items={lightbox.items}
          index={lightbox.index}
          onNavigate={(i) => setLightbox((prev) => (prev ? { ...prev, index: i } : prev))}
          onClose={() => setLightbox(null)}
        />
      )}

      <section className="bg-white">
        <div id="galeria" className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-10 md:pb-24">
          <div className="flex flex-col items-center justify-center text-center mb-16 animate-fade-in">
            <br />
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight text-gray-900">Galería de Fotos ✨</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-4" />
          </div>

          <div className="flex flex-col items-center">
            {admin && (
              <div id="admin-upload-section" className="mb-6">
                <button
                  id="upload-btn"
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <i className="fas fa-plus" />
                  <i className="fas fa-image" />
                  Subir Contenido
                </button>
              </div>
            )}

            <CategoryFilters active={activeFilter} onChange={setActiveFilter} />

            {isLoading && (
              <div className="w-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-purple-500 mx-auto" />
              </div>
            )}

            {!isLoading && isError && <div className="text-center text-red-500">Error al cargar la galería.</div>}

            {!isLoading && !isError && (
              <GalleryGrid items={filteredItems} isAdmin={admin} onItemClick={openLightbox} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

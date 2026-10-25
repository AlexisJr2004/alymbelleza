import { useState } from 'react';
import { Link } from 'react-router-dom';
import StorePageHeading from '../components/home/StorePageHeading';
import StoreIcon from '../components/home/StoreIcon';
import '../styles/gallery.css';
import { useDeleteGalleryItem, useGalleryQuery, useUploadGalleryItem } from '../hooks/useGallery';
import { isAdmin as checkIsAdmin } from '../lib/auth';
import { useSessionUser } from '../hooks/useSessionUser';
import { confirmAction, notifyError, notifySuccess } from '../lib/sweetalert';
import { useSwitchFilter } from '../hooks/useSwitchFilter';
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
  const { data: items, isLoading, isError, refetch } = useGalleryQuery();
  const uploadItem = useUploadGalleryItem();
  const deleteItem = useDeleteGalleryItem();

  const categoryFilter = useSwitchFilter();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const user = useSessionUser();
  const admin = checkIsAdmin(user);

  const allItems = items ?? [];
  const filteredItems =
    categoryFilter.selected.size === 0 ? allItems : allItems.filter((item) => categoryFilter.selected.has(item.category));

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

      <LightboxModal
        open={!!lightbox}
        items={lightbox?.items ?? []}
        index={lightbox?.index ?? 0}
        onNavigate={(i) => setLightbox((prev) => (prev ? { ...prev, index: i } : prev))}
        onClose={() => setLightbox(null)}
      />

      <main className="bb-commerce bb-gallery" id="contenido">
        <div className="bb-container">
          <StorePageHeading page="Galería" eyebrow="EL UNIVERSO BELLA BEAUTY" title={<>Belleza que <em>se vive</em></>} description="Conoce nuestro espacio, descubre nuestros cuidados y encuentra inspiración en cada detalle." icon="image" />
          <div className="bb-gallery-toolbar">
            <div><h2>Nuestra galería</h2><p>Fotos y videos de los momentos que compartimos.</p></div>
            {admin && <button type="button" onClick={() => setUploadOpen(true)} className="bb-button"><StoreIcon name="image" />Subir contenido</button>}
          </div>
          <CategoryFilters filter={categoryFilter} />
          {isLoading ? <div className="bb-gallery-grid" role="status" aria-label="Cargando galería">{Array.from({ length: 8 }, (_, index) => <div className="bb-gallery-skeleton" key={index} />)}</div>
            : isError ? <div className="bb-commerce-empty bb-gallery-empty" role="alert"><StoreIcon name="image" /><h2>No pudimos cargar la galería</h2><p>Inténtalo de nuevo en un momento.</p><button type="button" className="bb-button bb-button-outline" onClick={() => refetch()}>Reintentar</button></div>
            : <GalleryGrid items={filteredItems} isAdmin={admin} hasActiveFilter={categoryFilter.selected.size > 0} onItemClick={openLightbox} onDelete={handleDelete} />}
          <aside className="bb-gallery-invitation"><div><StoreIcon name="calendar" /><span><strong>Tu próximo momento de belleza</strong><small>Nos encantará recibirte y cuidar de ti.</small></span></div><Link to="/citas" className="bb-button">Reservar una cita<StoreIcon name="arrow" /></Link></aside>
        </div>
      </main>
    </>
  );
}

import Sheet from '../ui/Sheet';

interface ProfilePhotoLightboxProps {
  open: boolean;
  src: string;
  onClose: () => void;
}

// Visor de la foto de perfil en grande, calcado del LightboxModal.tsx de
// Galería (mismo Sheet, mismo fondo blanco en móvil / transparente en
// escritorio sobre el backdrop oscuro). Sin flechas ni tira de miniaturas
// porque acá solo hay una imagen — a diferencia de la galería, que navega
// entre varios elementos.
export default function ProfilePhotoLightbox({ open, src, onClose }: ProfilePhotoLightboxProps) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      desktopMaxWidthClassName="md:max-w-lg"
      panelClassName="bg-white md:bg-transparent rounded-t-3xl md:rounded-none"
      backdropClassName="bg-black/40"
      labelledBy="profile-photo-lightbox-title"
    >
      <div className="relative w-full flex flex-col items-center px-4 pb-6 pt-1 md:p-0">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-0 right-2 md:top-2 z-10 w-11 h-11 rounded-full bg-black/10 md:bg-white/10 hover:bg-black/20 md:hover:bg-white/20 text-gray-700 md:text-white flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <i className="fas fa-times" />
        </button>

        <div className="w-full flex items-center justify-center pt-8 md:pt-0">
          <img src={src} alt="Foto de perfil" className="w-64 h-64 max-w-full object-cover rounded-full shadow-lg border-4 border-white/80" />
        </div>
        <div id="profile-photo-lightbox-title" className="mt-4 text-gray-700 md:text-white text-sm">
          Tu foto de perfil
        </div>
      </div>
    </Sheet>
  );
}

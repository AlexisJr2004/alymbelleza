import { useEffect, useState } from 'react';
import Sheet from '../ui/Sheet';

interface CartImagePreviewModalProps {
  image: { src: string; name: string } | null;
  onClose: () => void;
}

// Puerto de #cartImagePreviewModal + showModal/hideModal/openCartImagePreview
// (carrito.html ~558-565, ~1530-1561).
export default function CartImagePreviewModal({ image, onClose }: CartImagePreviewModalProps) {
  // Se conserva la última imagen mostrada durante la animación de salida del
  // Sheet (sigue montado unos ms más aunque `image` ya sea null).
  const [rendered, setRendered] = useState(image);

  useEffect(() => {
    if (image) setRendered(image);
  }, [image]);

  useEffect(() => {
    if (!image) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [image, onClose]);

  if (!rendered) return null;

  return (
    <Sheet
      open={!!image}
      onClose={onClose}
      onFullyClosed={() => setRendered(null)}
      desktopMaxWidthClassName="md:max-w-lg"
      panelClassName="bg-transparent rounded-t-3xl md:rounded-none"
      handleClassName="bg-white/50"
      backdropClassName="bg-black/40 backdrop-blur-sm"
      labelledBy="cart-image-preview-title"
    >
      <div className="px-4 pb-6 pt-1 md:p-0">
        <img src={rendered.src} alt={rendered.name} className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl bg-white" />
        <p id="cart-image-preview-title" className="mt-4 text-center text-white text-lg font-semibold">
          {rendered.name}
        </p>
      </div>
    </Sheet>
  );
}

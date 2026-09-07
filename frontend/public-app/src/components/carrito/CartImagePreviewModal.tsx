import { useEffect, useState } from 'react';

interface CartImagePreviewModalProps {
  image: { src: string; name: string } | null;
  onClose: () => void;
}

// Puerto de #cartImagePreviewModal + showModal/hideModal/openCartImagePreview
// (carrito.html ~558-565, ~1530-1561): el nodo se mantiene montado durante los
// 300ms de la animación de salida (igual que el hidden/opacity-0 con setTimeout
// del original) en vez de desmontarse de golpe al cerrar.
export default function CartImagePreviewModal({ image, onClose }: CartImagePreviewModalProps) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState<{ src: string; name: string } | null>(null);

  useEffect(() => {
    if (image) {
      setRendered(image);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timeout = setTimeout(() => setRendered(null), 300);
    return () => clearTimeout(timeout);
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
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-[9999] flex items-center justify-center p-4 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-w-lg w-full">
        <img src={rendered.src} alt={rendered.name} className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl bg-white" />
        <p className="mt-4 text-center text-white text-lg font-semibold">{rendered.name}</p>
      </div>
    </div>
  );
}

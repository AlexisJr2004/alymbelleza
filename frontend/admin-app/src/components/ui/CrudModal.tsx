import { useEffect, useRef } from 'react';
import { XIcon } from '../icons';

interface CrudModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

// Modal con la misma animación fade+scale que el panel viejo (abrirFormTarjeta/
// cerrarFormProducto, etc.): se maneja con refs + classList directamente en vez de
// solo clases derivadas de estado, porque la secuencia real importa (quitar
// invisible -> esperar un frame -> animar opacidad/escala; al cerrar, animar
// primero y recién después de 200ms volver a poner invisible) y replicar eso con
// puro render declarativo sería más frágil que el propio efecto imperativo.
export default function CrudModal({ open, title, onClose, children, maxWidth = 'max-w-2xl' }: CrudModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const box = boxRef.current;
    if (!panel || !box) return;

    if (open) {
      panel.classList.remove('invisible', 'opacity-0');
      const raf = requestAnimationFrame(() => {
        panel.classList.add('opacity-100');
        box.classList.remove('scale-95');
        box.classList.add('scale-100');
      });
      return () => cancelAnimationFrame(raf);
    }

    panel.classList.remove('opacity-100');
    panel.classList.add('opacity-0');
    box.classList.remove('scale-100');
    box.classList.add('scale-95');
    const timer = setTimeout(() => {
      panel.classList.add('invisible');
    }, 200);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose();
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      className="invisible opacity-0 fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-200 ease-out"
    >
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />
      <div
        ref={boxRef}
        className={`relative bg-white rounded-xl border border-gray-200 p-6 w-full ${maxWidth} max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-200 ease-out`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

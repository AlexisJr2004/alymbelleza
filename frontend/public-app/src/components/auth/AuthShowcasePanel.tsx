import { XIcon } from '../icons';

interface AuthShowcasePanelProps {
  onClose: () => void;
  cornerColor?: string;
}

// Imagen editorial compartida con la colección del inicio.
export default function AuthShowcasePanel({ onClose, cornerColor = '#FFFFFF' }: AuthShowcasePanelProps) {
  return (
    <section className="relative hidden flex-1 py-3 pr-3 lg:block">
      <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl">
        <img src="/img/storefront/beauty-collection.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-6 pt-20 text-white">
          <p className="text-xs uppercase tracking-[.2em]">Bella Beauty</p>
          <h2 className="mt-2 font-display text-3xl">Un momento para ti</h2>
          <p className="mt-2 text-xs leading-relaxed">Descubre tu rutina de belleza y organiza tu próxima visita.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar y volver al inicio"
          className="bb-dialog-close absolute right-3 top-3" style={{ backgroundColor: cornerColor }}>
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

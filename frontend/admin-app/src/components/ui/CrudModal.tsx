import { XIcon } from '../icons';
import Sheet from './Sheet';

interface CrudModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

// Modal de crear/editar (Productos, Cupones, Tarjetas) — antes manejaba su
// propia animación fade+scale a mano con refs/classList; ahora es un
// consumidor más de Sheet (mismo cascarón que usan los modales del sitio
// público), lo que de paso le suma el comportamiento de hoja deslizable en
// móvil sin que las páginas que lo usan necesiten cambiar nada.
//
// `maxWidth` debe venir siempre con el prefijo "md:" ya incluido (p.ej.
// "md:max-w-2xl"), NUNCA armado por partes con un template string — Tailwind
// escanea el código como texto plano buscando nombres de clase completos, así
// que un `md:${maxWidth}` nunca hace que compile la clase con breakpoint (solo
// generaba las variantes sin prefijo, dejando el modal sin max-width real en
// escritorio y ocupando toda la pantalla).
export default function CrudModal({ open, title, onClose, children, maxWidth = 'md:max-w-2xl' }: CrudModalProps) {
  const titleId = 'crud-modal-title';

  return (
    <Sheet
      open={open}
      onClose={onClose}
      desktopMaxWidthClassName={maxWidth}
      labelledBy={titleId}
      panelClassName="bg-white/80 backdrop-blur-xl border border-white/70 rounded-t-3xl md:rounded-[26px]"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 id={titleId} className="text-lg font-bold text-ink">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/80 bg-white/60 text-muted transition hover:bg-white/90 hover:text-ink"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </Sheet>
  );
}

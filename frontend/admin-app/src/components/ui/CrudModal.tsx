import { useId } from 'react';
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
  const titleId = useId();

  return (
    <Sheet
      open={open}
      onClose={onClose}
      desktopMaxWidthClassName={maxWidth}
      labelledBy={titleId}
      panelClassName="glass-sheet rounded-t-[30px] md:rounded-[30px]"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h3 id={titleId} className="text-xl font-semibold tracking-tight text-ink">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario"
            className="glass-icon-button grid h-10 w-10 shrink-0 place-items-center"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </Sheet>
  );
}

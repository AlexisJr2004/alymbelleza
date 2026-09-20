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
    <Sheet open={open} onClose={onClose} desktopMaxWidthClassName={maxWidth} labelledBy={titleId}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 id={titleId} className="text-lg font-bold text-gray-800">
            {title}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </Sheet>
  );
}

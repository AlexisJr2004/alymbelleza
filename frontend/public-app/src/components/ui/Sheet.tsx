import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Cascarón reutilizable para TODOS los modales del sitio (reemplazo de
// SweetAlert2 en Modal.tsx, y los modales propios: vista rápida de producto,
// lightbox de galería, vista previa de imagen del carrito, subir a galería,
// nuevo testimonio). En móvil se comporta como una hoja que sube desde abajo
// sin tapar la parte superior, con esquinas superiores redondeadas y una
// manija que se puede arrastrar hacia abajo para cerrar o soltar antes del
// umbral para que "suba" de nuevo — igual que en iOS. En escritorio es un
// diálogo centrado con fade+scale, sin manija ni gesto de arrastre.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export const SHEET_EXIT_MS = 260;

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
  /** Ancho máximo en escritorio. Default: diálogo chico (usado por confirmaciones). */
  desktopMaxWidthClassName?: string;
  /** Fondo/bordes/radios del panel. Default: tarjeta blanca. Los modales de
   * imagen (lightbox, vista previa del carrito) pasan algo transparente. */
  panelClassName?: string;
  /** Color de la manija de arrastre (móvil). Default: gris, para paneles
   * blancos; los modales oscuros pasan un tono claro/translúcido. */
  handleClassName?: string;
  /** Color/opacidad del fondo oscurecido. Default: negro 50%. */
  backdropClassName?: string;
  /** Se dispara una vez terminada la animación de salida y el nodo ya se
   * desmontó — útil para consumidores imperativos (ver Modal.tsx) que
   * necesitan saber cuándo el cierre visual realmente terminó. */
  onFullyClosed?: () => void;
}

export default function Sheet({
  open,
  onClose,
  children,
  labelledBy,
  desktopMaxWidthClassName = 'md:max-w-sm',
  panelClassName = 'bg-white rounded-t-3xl md:rounded-2xl',
  handleClassName = 'bg-gray-300',
  backdropClassName = 'bg-gray-900/50',
  onFullyClosed,
}: SheetProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(open);
  const [phase, setPhase] = useState<'entering' | 'open' | 'exiting'>(open ? 'entering' : 'exiting');
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const onFullyClosedRef = useRef(onFullyClosed);
  onFullyClosedRef.current = onFullyClosed;
  // Distingue "todavía no se abrió nunca" de "se acaba de cerrar", para no
  // disparar la animación de salida ni onFullyClosed en el primer render de
  // un consumidor que empieza con open=false (ProductQuickViewModal, etc.).
  const hasOpenedRef = useRef(open);

  useEffect(() => {
    if (open) {
      hasOpenedRef.current = true;
      setMounted(true);
      setDragY(0);
      // Doble rAF, no uno solo: cuando este Sheet ya estaba montado con
      // open=false (p.ej. TestimonialModal/UploadModal, a diferencia de
      // ModalCard que se monta directo con open=true vía key={modal.id}),
      // este mismo efecto es el que recién pone mounted=true — un solo rAF
      // corre demasiado pronto, antes de que el navegador llegue a pintar
      // el estado "cerrado" (translateY 100% / scale 0.95), así que salta
      // directo al estado abierto sin animar nada. El segundo rAF garantiza
      // que ya hubo un pintado real del estado inicial antes de cambiar de
      // fase — el fix estándar para esta condición de carrera.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setPhase('open'));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    if (!hasOpenedRef.current) return undefined;
    setPhase('exiting');
    const t = window.setTimeout(() => {
      setMounted(false);
      onFullyClosedRef.current?.();
    }, SHEET_EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  // Arrastre estilo iOS: solo la manija dispara el gesto (no toda la tarjeta,
  // para no interferir con taps en el contenido). Deslizar hacia abajo pasado
  // un umbral cierra el modal; soltar antes del umbral hace que "suba" de
  // nuevo (snap-back) a su posición abierta.
  const onHandlePointerDown = (e: React.PointerEvent) => {
    if (!isMobile) return;
    draggingRef.current = true;
    setDragging(true);
    startYRef.current = e.clientY;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onHandlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dy = e.clientY - startYRef.current;
    setDragY(Math.max(0, dy));
  };
  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const sheetHeight = sheetRef.current?.offsetHeight ?? 320;
    if (dragY > sheetHeight * 0.28) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  if (!mounted) return null;

  const isClosed = phase !== 'open';

  const style: React.CSSProperties = isMobile
    ? {
        transform: `translateY(${isClosed ? '100%' : `${dragY}px`})`,
        transitionProperty: 'transform',
        transitionDuration: dragging ? '0ms' : `${SHEET_EXIT_MS}ms`,
        transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
      }
    : {
        transform: `translate(-50%, -50%) scale(${isClosed ? 0.95 : 1})`,
        opacity: isClosed ? 0 : 1,
        transitionProperty: 'transform, opacity',
        transitionDuration: `${SHEET_EXIT_MS}ms`,
        transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
      };

  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[2000] transition-opacity ${backdropClassName}`}
        style={{ transitionDuration: `${SHEET_EXIT_MS}ms`, opacity: phase === 'open' ? 1 : 0 }}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`fixed z-[2001] inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto md:inset-auto md:left-1/2 md:top-1/2 md:bottom-auto md:w-full md:max-h-[90vh] ${desktopMaxWidthClassName} ${panelClassName}`}
        style={style}
      >
        {isMobile && (
          <div
            className="pt-2.5 pb-1.5 flex justify-center cursor-grab active:cursor-grabbing touch-none sticky top-0"
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <span className={`w-10 h-1.5 rounded-full ${handleClassName}`} />
          </div>
        )}
        {children}
      </div>
    </>,
    document.body
  );
}

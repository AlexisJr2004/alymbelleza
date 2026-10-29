import type { ReactNode } from 'react';
import Sheet from '../ui/Sheet';

interface AuthCardShellProps {
  onClose: () => void;
  /** Ancho máximo de la tarjeta en escritorio, clase Tailwind completa y
   * literal con prefijo `md:` (p.ej. "md:max-w-[1090px]") — Sheet pasa a su
   * modo "diálogo centrado" a partir de 768px (md), no 1024px (lg) como el
   * resto de esta tarjeta, así que el ancho tiene que activarse en ese
   * mismo punto. Nunca construida por concatenación, para que el scanner
   * de Tailwind la detecte en build. */
  maxWidthClassName: string;
  children: ReactNode;
  /** Clase Tailwind completa y literal para el fondo detrás de la tarjeta
   * (p.ej. "bg-white"). Default: el gris de la referencia. Se pasa como
   * backdrop de Sheet a opacidad completa, no como superposición
   * translúcida. */
  pageBackgroundClassName?: string;
  /** Valor CSS de `background` de la tarjeta — por defecto el degradado
   * blanco y rosa de Bella Beauty. Pasar un color sólido
   * (p.ej. "#FFFFFF") lo reemplaza entero, radial incluido. */
  cardBackground?: string;
}

// Tarjeta compartida de acceso, registro y recuperación: formulario compacto,
// panel decorativo en escritorio y desplazamiento interno en pantallas pequeñas.
export default function AuthCardShell({
  onClose,
  maxWidthClassName,
  children,
  pageBackgroundClassName = 'bg-[#fcf1f5]',
  cardBackground = 'linear-gradient(110deg, #fff 0%, #fff8fb 55%, #fbeaf1 100%)',
}: AuthCardShellProps) {
  return (
    <Sheet
      open
      variant="auth"
      onClose={onClose}
      labelledBy="auth-card-title"
      desktopMaxWidthClassName={maxWidthClassName}
      panelClassName={`font-body flex flex-col overflow-hidden rounded-t-3xl border border-gray-200 lg:flex-row lg:max-h-[680px] md:rounded-[40px]`}
      panelStyle={{ background: cardBackground }}
      backdropClassName={pageBackgroundClassName}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar y volver al inicio"
        className="bb-dialog-close absolute right-4 top-4 z-20 lg:hidden"
      >
        Cerrar
      </button>

      {children}
    </Sheet>
  );
}

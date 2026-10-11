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
   * morado→rosa calcado de login-crextio.html. Pasar un color sólido
   * (p.ej. "#FFFFFF") lo reemplaza entero, radial incluido. */
  cardBackground?: string;
}

// Cascarón compartido por Login/Register, sobre el mismo Sheet que usa
// cualquier otro modal del sitio (vista rápida de producto, lightbox de
// galería, subir a galería, etc.) — en mobile sube desde abajo con manija
// de arrastre y esquinas superiores redondeadas, igual que esos; en
// escritorio es el diálogo centrado de siempre, con el layout a dos
// columnas (formulario + AuthShowcasePanel) propio de esta tarjeta. El
// fondo y el degradado de la tarjeta son configurables (Login los pasa en
// blanco a modo de prueba; Register se queda con los valores por
// defecto); el botón de cerrar de mobile vive acá, el de escritorio (con
// el recorte/fillet) vive dentro de AuthShowcasePanel.
export default function AuthCardShell({
  onClose,
  maxWidthClassName,
  children,
  pageBackgroundClassName = 'bg-[#ABA6B6]',
  cardBackground = 'radial-gradient(75% 60% at 22% 105%, rgba(168,85,247,.35) 0%, rgba(168,85,247,0) 70%), linear-gradient(90deg, #EBE7F0 0%, #EFE7ED 36%, #F8E3EF 60%, #FBE2EE 100%)',
}: AuthCardShellProps) {
  return (
    <Sheet
      open
      onClose={onClose}
      labelledBy="auth-card-title"
      desktopMaxWidthClassName={maxWidthClassName}
      panelClassName={`font-outfit flex flex-col overflow-hidden rounded-t-3xl border border-gray-200 lg:flex-row lg:h-[767px] md:rounded-[40px]`}
      panelStyle={{ background: cardBackground }}
      backdropClassName={pageBackgroundClassName}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar y volver al inicio"
        className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/70 text-gray-700 shadow-md backdrop-blur-md transition hover:bg-white lg:hidden"
      >
        <i className="fas fa-times" />
      </button>

      {children}
    </Sheet>
  );
}

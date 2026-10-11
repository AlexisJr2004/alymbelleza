import type { ReactNode } from 'react';

interface AuthCardShellProps {
  onClose: () => void;
  /** Ancho máximo de la tarjeta en escritorio, clase Tailwind completa y
   * literal (p.ej. "lg:max-w-[1090px]") — nunca construida por
   * concatenación, para que el scanner de Tailwind la detecte en build. */
  maxWidthClassName: string;
  children: ReactNode;
  /** Clase Tailwind completa y literal para el fondo fijo detrás de la
   * tarjeta (p.ej. "bg-white"). Default: el gris de la referencia. */
  pageBackgroundClassName?: string;
  /** Valor CSS de `background` de la tarjeta — por defecto el degradado
   * morado→rosa calcado de login-crextio.html. Pasar un color sólido
   * (p.ej. "#FFFFFF") lo reemplaza entero, radial incluido. */
  cardBackground?: string;
}

// Cascarón compartido por Login/Register (y el resto del flujo de auth si
// se suma después): el fondo que reemplaza el bg-gray-50 de AuthLayout
// solo en estas rutas, la tarjeta en degradado morado→rosa calcada de
// login-crextio.html, esquinas a 40px, sin box-shadow, y el botón de
// cerrar visible solo en mobile (el de escritorio, con el recorte/fillet,
// vive dentro de AuthShowcasePanel). El fondo y el degradado de la
// tarjeta son configurables (Login los pasa en blanco a modo de prueba;
// Register se queda con los valores por defecto).
export default function AuthCardShell({
  onClose,
  maxWidthClassName,
  children,
  pageBackgroundClassName = 'bg-[#ABA6B6]',
  cardBackground = 'radial-gradient(75% 60% at 22% 105%, rgba(168,85,247,.35) 0%, rgba(168,85,247,0) 70%), linear-gradient(90deg, #EBE7F0 0%, #EFE7ED 36%, #F8E3EF 60%, #FBE2EE 100%)',
}: AuthCardShellProps) {
  return (
    <>
      {/* Sin z-index explícito a propósito: un elemento fixed ya pinta por
          encima de una caja plana sin posicionar (como el bg-gray-50 del
          layout) y de las formas con z-index negativo del fondo, por orden
          de capas — no hace falta pelear con z-index (lección de los dos
          bugs de stacking de este mismo login). */}
      <div className={`fixed inset-0 ${pageBackgroundClassName}`} aria-hidden="true" />

      <div
        className={`font-outfit relative flex w-full max-w-[480px] flex-col overflow-hidden rounded-[40px] lg:h-[767px] lg:flex-row ${maxWidthClassName}`}
        style={{ background: cardBackground }}
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
      </div>
    </>
  );
}

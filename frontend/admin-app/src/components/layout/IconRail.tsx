import { BackArrowIcon, LogoutIcon } from '../icons';
import { logout } from '../../lib/auth';
import { confirmAction } from '../../lib/sweetalert';

// Riel de acciones rápidas (izquierda) de la plantilla customer-journeys.html.
// La plantilla rellena el riel con ~10 iconos genéricos de CRM (conexiones,
// exportar, favoritos, llamadas...) que no tienen equivalente real en este
// admin; en vez de copiar botones decorativos sin función, el riel queda
// solo con las dos acciones de "salida" que sí existen: volver al sitio
// público y cerrar sesión — mismo lenguaje visual (rail-btn circular), solo
// que más corto.
export default function IconRail() {
  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir de tu cuenta?',
      confirmText: 'Sí, cerrar sesión',
      icon: 'question',
    });
    if (confirmed) logout();
  };

  return (
    <nav
      className="fixed bottom-[18px] left-[18px] z-20 hidden w-[60px] flex-col items-center gap-[7px] rounded-full border border-white/70 bg-white/30 py-[10px] lg:flex"
      aria-label="Acciones rápidas"
    >
      <a href="/" className="rail-btn" aria-label="Volver al sitio" title="Volver al sitio">
        <BackArrowIcon className="h-[18px] w-[18px]" />
      </a>
      <button
        type="button"
        onClick={handleLogout}
        className="rail-btn text-coral"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
      >
        <LogoutIcon className="h-[18px] w-[18px]" />
      </button>
    </nav>
  );
}

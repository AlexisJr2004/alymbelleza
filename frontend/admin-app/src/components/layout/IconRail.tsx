import { BackArrowIcon, LogoutIcon } from '../icons';
import { logout } from '../../lib/auth';
import { confirmAction } from '../../lib/sweetalert';

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
      className="glass-chrome fixed bottom-6 left-5 z-20 hidden w-[60px] flex-col items-center gap-2 rounded-full py-2 xl:flex"
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

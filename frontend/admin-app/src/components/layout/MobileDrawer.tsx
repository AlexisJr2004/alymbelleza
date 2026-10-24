import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ResumenIcon,
  TrophyIcon,
  ProductosIcon,
  CuponesIcon,
  PedidosIcon,
  TarjetasIcon,
  UsuariosIcon,
  CitasIcon,
  BackArrowIcon,
  LogoutIcon,
  XIcon,
} from '../icons';
import { getStoredUser, logout } from '../../lib/auth';
import { resolveProfileImage } from '../../lib/format';
import { confirmAction } from '../../lib/sweetalert';

const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

interface NavItem {
  to: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/resumen', label: 'Resumen', icon: ResumenIcon },
  { to: '/ranking', label: 'Ranking', icon: TrophyIcon },
  { to: '/productos', label: 'Productos', icon: ProductosIcon },
  { to: '/cupones', label: 'Cupones', icon: CuponesIcon },
  { to: '/pedidos', label: 'Pedidos', icon: PedidosIcon },
  { to: '/tarjetas', label: 'Tarjetas', icon: TarjetasIcon },
  { to: '/usuarios', label: 'Usuarios', icon: UsuariosIcon },
  { to: '/citas', label: 'Citas', icon: CitasIcon },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const user = getStoredUser();
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector<HTMLButtonElement>('button')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector('[data-admin-sheet]')) return;
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const controls = drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = () => { if (desktop.matches) onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    desktop.addEventListener('change', closeOnDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      desktop.removeEventListener('change', closeOnDesktop);
      previousFocus?.focus();
    };
  }, [open, onClose]);

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
    <aside
      ref={drawerRef}
      role="dialog"
      aria-modal={open ? true : undefined}
      aria-label="Navegación de administración"
      aria-hidden={!open}
      inert={!open}
      className={`glass-sheet fixed inset-y-3 left-3 z-40 flex w-[340px] max-w-[calc(100vw-24px)] flex-col rounded-[30px] transition-transform duration-300 ease-out xl:hidden ${
        open ? 'translate-x-0' : '-translate-x-[calc(100%+16px)]'
      }`}
    >
      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/60 px-5">
        <div className="flex items-center gap-2.5">
          <span className="glass-button-primary grid h-9 w-9 place-items-center rounded-full text-[13px] font-semibold">
            B
          </span>
          <span className="text-[19px] font-semibold text-ink">Bella Beauty</span>
        </div>
        <button type="button" onClick={onClose} className="circle-btn h-9 w-9" aria-label="Cerrar menú">
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="glass-inset mx-4 mt-4 flex shrink-0 items-center gap-3 rounded-[22px] p-4">
        <img
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
          src={resolveProfileImage(user)}
          alt="Foto de perfil"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{user?.name || 'Administrador'}</p>
          <p className="truncate text-xs text-muted">{user?.email || ''}</p>
        </div>
      </div>

      <nav aria-label="Todas las secciones" className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-pill flex h-11 w-full gap-3 rounded-[18px] px-4 text-sm ${isActive ? 'is-active' : ''}`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 space-y-2 border-t border-white/60 p-4">
        <a
          href="/"
          className="glass-button flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
        >
          <BackArrowIcon className="h-4 w-4" />
          Volver al sitio
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="glass-button flex w-full items-center justify-center gap-2 rounded-full border-coral/25 px-4 py-2.5 text-sm font-medium text-coral hover:bg-coral/10"
        >
          <LogoutIcon className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

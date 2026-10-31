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

const FALLBACK_AVATAR = `${import.meta.env.BASE_URL}favicon.svg`;

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

// Versión móvil de la navegación — en escritorio TopNav ya es la barra de
// píldoras + IconRail de la plantilla; esa barra horizontal no entra en una
// pantalla chica, así que acá se pliega a una lista vertical (mismas píldoras,
// apiladas) dentro de un cajón deslizante, reusando la animación del Sidebar
// original.
export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const user = getStoredUser();

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
      className={`fixed inset-y-0 left-0 z-40 flex w-80 flex-col rounded-r-[30px] border-r border-white/70 bg-white/90 shadow-xl backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-gray-100 px-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[13px] font-bold text-white">
            B
          </span>
          <span className="text-[19px] font-semibold text-ink">Bella Beauty</span>
        </div>
        <button type="button" onClick={onClose} className="circle-btn h-9 w-9" aria-label="Cerrar menú">
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-5 py-4">
        <img
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
          src={resolveProfileImage(user)}
          alt="Foto de perfil"
          onError={(e) => {
            if (e.currentTarget.dataset.fallback) return;
                  e.currentTarget.dataset.fallback = 'true';
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{user?.name || 'Administrador'}</p>
          <p className="truncate text-xs text-muted">{user?.email || ''}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-full px-4 py-2.5 text-[14px] font-medium transition ${
                isActive ? 'bg-ink text-white' : 'text-[#2a2c33] hover:bg-white/70'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 space-y-2 border-t border-gray-100 p-4">
        <a
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#2a2c33] transition hover:bg-gray-50"
        >
          <BackArrowIcon className="h-4 w-4" />
          Volver al sitio
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-4 py-2.5 text-sm font-medium text-coral transition hover:bg-coral/20"
        >
          <LogoutIcon className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

import { NavLink } from 'react-router-dom';
import {
  ResumenIcon,
  ProductosIcon,
  CuponesIcon,
  PedidosIcon,
  TarjetasIcon,
  UsuariosIcon,
  CitasIcon,
  BackArrowIcon,
  LogoutIcon,
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

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  { label: 'General', items: [{ to: '/resumen', label: 'Resumen', icon: ResumenIcon }] },
  {
    label: 'Catálogo',
    items: [
      { to: '/productos', label: 'Productos', icon: ProductosIcon },
      { to: '/cupones', label: 'Cupones', icon: CuponesIcon },
    ],
  },
  {
    label: 'Ventas',
    items: [
      { to: '/pedidos', label: 'Pedidos', icon: PedidosIcon },
      { to: '/tarjetas', label: 'Tarjetas', icon: TarjetasIcon },
    ],
  },
  {
    label: 'Clientes',
    items: [
      { to: '/usuarios', label: 'Usuarios', icon: UsuariosIcon },
      { to: '/citas', label: 'Citas', icon: CitasIcon },
    ],
  },
];

const linkBase = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors';
const linkInactive = 'text-gray-600 hover:bg-white/70 hover:text-gray-900';
const linkActive = 'bg-purple-50 text-purple-700';

// Entrada escalonada al desplegar en móvil (mismo patrón que
// public-app/src/components/layout/MobileMenu.tsx). Forzado siempre visible
// desde lg: hacia arriba porque este mismo <aside> es también el sidebar
// permanente de escritorio (lg:translate-x-0) — sin el override, quedaría
// invisible ahí ya que `open` solo representa el estado del toggle móvil.
function reveal(open: boolean, index: number) {
  return {
    className: `transition-all duration-300 ease-out lg:opacity-100 lg:translate-y-0 ${
      open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`,
    style: { transitionDelay: open ? `${index * 60}ms` : '0ms' } as const,
  };
}

function cx(...classes: string[]) {
  return classes.join(' ');
}

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

export default function Sidebar({ open, onNavigate }: SidebarProps) {
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
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-md lg:bg-white/70 lg:backdrop-blur-xl border-r border-gray-200 flex flex-col rounded-r-3xl lg:rounded-none transition-transform duration-300 ease-out lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div
        style={reveal(open, 0).style}
        className={cx('h-16 flex items-center gap-2.5 px-6 border-b border-gray-200 shrink-0', reveal(open, 0).className)}
      >
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
          B
        </span>
        <span className="font-display text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
          Bella Beauty
        </span>
      </div>

      {/* Tarjeta de perfil — solo en móvil (mismo patrón que
          MobileMenu.tsx del sitio público), porque el Topbar oculta el
          nombre/rol en pantallas chicas (hidden sm:block) y este es el
          único lugar donde se ve quién inició sesión. */}
      <div
        style={reveal(open, 1).style}
        className={cx('lg:hidden px-4 py-4 border-b border-gray-200 shrink-0', reveal(open, 1).className)}
      >
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-100 shadow-sm shrink-0"
            src={resolveProfileImage(user)}
            alt="Foto de perfil"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_AVATAR;
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Administrador'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              Administrador
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {NAV_GROUPS.map((group, i) => (
          <div
            key={group.label}
            style={reveal(open, i + 2).style}
            className={cx(i < NAV_GROUPS.length - 1 ? 'mb-6' : '', reveal(open, i + 2).className)}
          >
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div
        style={reveal(open, NAV_GROUPS.length + 2).style}
        className={cx('border-t border-gray-200 p-4 space-y-1 shrink-0', reveal(open, NAV_GROUPS.length + 2).className)}
      >
        <a
          href="/"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <BackArrowIcon className="w-4 h-4 shrink-0" />
          Volver al sitio
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <LogoutIcon className="w-4 h-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

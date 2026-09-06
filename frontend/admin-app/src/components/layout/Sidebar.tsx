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
import { logout } from '../../lib/auth';
import { confirmAction } from '../../lib/sweetalert';

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

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

export default function Sidebar({ open, onNavigate }: SidebarProps) {
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
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/70 backdrop-blur-xl border-r border-gray-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-gray-200 shrink-0">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
          B
        </span>
        <span className="font-display text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
          Bella Beauty
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {NAV_GROUPS.map((group, i) => (
          <div key={group.label} className={i < NAV_GROUPS.length - 1 ? 'mb-6' : ''}>
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
      <div className="border-t border-gray-200 p-4 space-y-1 shrink-0">
        <a
          href="/index.html"
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

import { Link, NavLink } from 'react-router-dom';
import { MenuIcon, BellIcon } from '../icons';
import { getStoredUser } from '../../lib/auth';
import { resolveProfileImage } from '../../lib/format';
import { useAppointmentsQuery } from '../../hooks/useAppointments';

const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

const NAV_ITEMS = [
  { to: '/resumen', label: 'Resumen' },
  { to: '/productos', label: 'Productos' },
  { to: '/cupones', label: 'Cupones' },
  { to: '/pedidos', label: 'Pedidos' },
  { to: '/tarjetas', label: 'Tarjetas' },
  { to: '/usuarios', label: 'Usuarios' },
  { to: '/citas', label: 'Citas' },
];

export default function TopNav({ onToggleMobile }: { onToggleMobile: () => void }) {
  const user = getStoredUser();
  const { data: citas = [] } = useAppointmentsQuery();
  const hayPendientes = citas.some((c) => (c.status || 'pendiente') === 'pendiente');

  return (
    <header className="sticky top-0 z-20 flex h-[74px] items-center gap-3 border-b border-white/60 bg-white/50 px-4 backdrop-blur-xl lg:px-8">
      <button
        type="button"
        onClick={onToggleMobile}
        className="circle-btn lg:hidden"
        aria-label="Abrir menú"
      >
        <MenuIcon className="h-[18px] w-[18px]" />
      </button>

      <Link to="/resumen" className="flex shrink-0 items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[14px] font-bold text-white">
          B
        </span>
        <span className="hidden text-[20px] font-semibold tracking-[-0.01em] text-ink sm:inline">Bella Beauty</span>
      </Link>

      <nav className="hidden flex-1 justify-center lg:flex" aria-label="Secciones">
        <ul className="flex items-center gap-[2px] rounded-full border border-white/70 bg-white/30 p-[3px]">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `nav-pill ${isActive ? 'is-active' : ''}`}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Link
          to="/citas"
          title="Citas pendientes"
          aria-label="Citas pendientes"
          className="circle-btn relative"
        >
          <BellIcon className="h-[18px] w-[18px]" />
          {hayPendientes && (
            <span className="absolute right-[11px] top-[11px] h-[7px] w-[7px] rounded-full bg-coral ring-2 ring-white" />
          )}
        </Link>
        <img
          className="h-[44px] w-[44px] rounded-full object-cover ring-[3px] ring-white/80"
          src={resolveProfileImage(user)}
          alt="Foto de perfil"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />
      </div>
    </header>
  );
}

import BeautyBrand from './BeautyBrand';
import { Link, NavLink } from 'react-router-dom';
import { BellIcon, MenuGridIcon } from '../icons';
import { getStoredUser } from '../../lib/auth';
import { formatoFechaLarga, resolveProfileImage } from '../../lib/format';
import { useAppointmentsQuery } from '../../hooks/useAppointments';

const FALLBACK_AVATAR = `${import.meta.env.BASE_URL}favicon.svg`;

const NAV_ITEMS = [
  { to: '/resumen', label: 'Resumen' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/productos', label: 'Productos' },
  { to: '/cupones', label: 'Cupones' },
  { to: '/pedidos', label: 'Pedidos' },
  { to: '/tarjetas', label: 'Tarjetas' },
  { to: '/usuarios', label: 'Usuarios' },
  { to: '/citas', label: 'Citas' },
];

export default function TopNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const user = getStoredUser();
  const { data: citas = [] } = useAppointmentsQuery();
  const hayPendientes = citas.some((c) => (c.status || 'pendiente') === 'pendiente');

  const rawDate = formatoFechaLarga(new Date());
  const fecha = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  return (
    <header className="admin-topnav sticky top-0 z-20 px-3 lg:px-5 border-b border-rose-100 bg-white">

      <div className="flex h-16 items-center justify-between lg:hidden">
        <div className="shrink-0 rounded-full border border-white/70 bg-white/30 p-1.5">
          <button type="button" onClick={onOpenMenu} aria-label="Menú" className="rail-btn">
            <MenuGridIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
        <Link to="/resumen" className="min-w-0"><BeautyBrand /></Link>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/70 bg-white/30 py-1.5 pl-1.5 pr-1.5">
          <Link to="/citas" title="Citas pendientes" aria-label="Citas pendientes" className="rail-btn relative">
            <BellIcon className="h-[18px] w-[18px]" />
            {hayPendientes && (
              <span className="absolute right-[11px] top-[11px] h-[7px] w-[7px] rounded-full bg-coral ring-2 ring-white" />
            )}
          </Link>
          <img
            className="h-9 w-9 rounded-full object-cover ring-[3px] ring-white/80"
            src={resolveProfileImage(user)}
            alt="Foto de perfil"
            onError={(e) => {
              if (e.currentTarget.dataset.fallback) return;
                  e.currentTarget.dataset.fallback = 'true';
              e.currentTarget.src = FALLBACK_AVATAR;
            }}
          />
        </div>
      </div>


      <div className="hidden h-16 items-center gap-2 lg:flex">
        <Link
          to="/resumen"
          className="shrink-0 pr-3"
        >
          <BeautyBrand />
        </Link>

        <nav className="flex min-w-0 flex-1 justify-center" aria-label="Secciones">
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

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {fecha && (
            <p className="hidden rounded-full border border-white/70 bg-white/30 px-5 py-2.5 text-sm text-[#3a3d45] 2xl:block">
              {fecha}
            </p>
          )}

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/70 bg-white/30 py-1.5 pl-1.5 pr-4">
            <Link
              to="/citas"
              title="Citas pendientes"
              aria-label="Citas pendientes"
              className="rail-btn relative"
            >
              <BellIcon className="h-[18px] w-[18px]" />
              {hayPendientes && (
                <span className="absolute right-[11px] top-[11px] h-[7px] w-[7px] rounded-full bg-coral ring-2 ring-white" />
              )}
            </Link>
            <img
              className="h-9 w-9 rounded-full object-cover ring-[3px] ring-white/80"
              src={resolveProfileImage(user)}
              alt="Foto de perfil"
              onError={(e) => {
                if (e.currentTarget.dataset.fallback) return;
                  e.currentTarget.dataset.fallback = 'true';
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
            />
            <div className="hidden min-w-0 max-w-[160px] leading-tight 2xl:block">
              <p className="truncate text-sm font-semibold text-ink">{user?.name || 'Administrador'}</p>
              <p className="truncate text-xs text-muted">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

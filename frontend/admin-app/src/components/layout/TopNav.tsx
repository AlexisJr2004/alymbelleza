import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BellIcon, MenuGridIcon } from '../icons';
import { getStoredUser } from '../../lib/auth';
import { formatoFechaLarga, resolveProfileImage } from '../../lib/format';
import { useAppointmentsQuery } from '../../hooks/useAppointments';

const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

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

  const [fecha, setFecha] = useState('');
  useEffect(() => {
    // Solo la primera letra en mayúscula ("Domingo, 11 de octubre de
    // 2026") — con la clase capitalize de Tailwind, que mayusculiza cada
    // palabra, los conectores ("de") quedaban en mayúscula también, poco
    // natural en español.
    const raw = formatoFechaLarga(new Date());
    setFecha(raw.charAt(0).toUpperCase() + raw.slice(1));
  }, []);

  return (
    <header className="sticky top-0 z-20 mx-auto max-w-[2000px] px-4 xl:px-6">
      <div className="flex h-[84px] items-center justify-between gap-3 xl:hidden">
        <div className="glass-chrome shrink-0 rounded-full p-1.5">
          <button type="button" onClick={onOpenMenu} aria-label="Abrir menú" aria-haspopup="dialog" className="rail-btn">
            <MenuGridIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
        <Link to="/resumen" className="min-w-0 text-center">
          <span className="block truncate text-[15px] font-semibold tracking-tight text-ink sm:text-lg">Bella Beauty</span>
          <span className="mt-0.5 block text-[10px] font-medium tracking-[0.12em] text-muted">ADMINISTRACIÓN</span>
        </Link>
        <div className="glass-chrome flex shrink-0 items-center gap-1.5 rounded-full p-1.5">
          <Link to="/citas" title="Citas pendientes" aria-label="Citas pendientes" className="rail-btn relative">
            <BellIcon className="h-[18px] w-[18px]" />
            {hayPendientes && (
              <span className="absolute right-[11px] top-[11px] h-[7px] w-[7px] rounded-full bg-coral ring-2 ring-white" />
            )}
          </Link>
          <img
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white/90"
            src={resolveProfileImage(user)}
            alt="Foto de perfil"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_AVATAR;
            }}
          />
        </div>
      </div>

      <div className="hidden h-[90px] items-center gap-3 xl:flex">
        <Link
          to="/resumen"
          className="glass-chrome flex shrink-0 items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4"
        >
          <span className="glass-button-primary grid h-10 w-10 place-items-center rounded-full text-sm font-semibold">
            B
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-ink">Bella Beauty</span>
        </Link>

        <nav className="flex min-w-0 flex-1 justify-center" aria-label="Secciones">
          <ul className="glass-chrome flex items-center gap-0.5 rounded-full p-1.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={({ isActive }) => `nav-pill whitespace-nowrap px-3 2xl:px-4 ${isActive ? 'is-active' : ''}`}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {fecha && (
            <p className="glass-chrome hidden rounded-full px-4 py-3 text-xs font-medium text-muted min-[1800px]:block">
              {fecha}
            </p>
          )}

          <div className="glass-chrome flex shrink-0 items-center gap-2 rounded-full p-1.5 2xl:pr-4">
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
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white/90"
              src={resolveProfileImage(user)}
              alt="Foto de perfil"
              onError={(e) => {
                e.currentTarget.onerror = null;
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

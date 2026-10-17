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

  const avatar = (
    <img
      className="h-[51px] w-[51px] rounded-full object-cover"
      src={resolveProfileImage(user)}
      alt="Foto de perfil"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = FALLBACK_AVATAR;
      }}
    />
  );

  return (
    <header className="sticky top-0 z-20 px-4 lg:px-8">
      {/* Header móvil — copiado literalmente de surveys-app.html (botones
          .round-btn blancos sueltos: menú a la izquierda, notificación +
          avatar a la derecha), a pedido explícito del usuario. El botón de
          menú abre el mismo MobileDrawer que el ícono "Más" de
          BottomMobileNav. */}
      <div className="flex h-[74px] items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Menú"
          className="grid h-[49px] w-[49px] place-items-center rounded-full bg-white text-ink transition hover:bg-white/70"
        >
          <MenuGridIcon className="h-[19px] w-[19px]" />
        </button>
        <div className="flex items-center gap-[11px]">
          <Link
            to="/citas"
            title="Citas pendientes"
            aria-label="Citas pendientes"
            className="relative grid h-[49px] w-[49px] place-items-center rounded-full bg-white text-ink transition hover:bg-white/70"
          >
            <BellIcon className="h-[19px] w-[19px]" />
            {hayPendientes && (
              <span className="absolute right-[15px] top-[13px] h-[7px] w-[7px] rounded-full bg-[#ef4444] ring-2 ring-white" />
            )}
          </Link>
          {avatar}
        </div>
      </div>

      {/* Header de escritorio — cápsulas glass sin cambios */}
      <div className="hidden h-[74px] items-center gap-3 lg:flex">
        <Link
          to="/resumen"
          className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/70 bg-white/30 py-1.5 pl-1.5 pr-4"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[14px] font-bold text-white">
            B
          </span>
          <span className="text-[20px] font-semibold tracking-[-0.01em] text-ink">Bella Beauty</span>
        </Link>

        <nav className="flex flex-1 justify-center" aria-label="Secciones">
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
              className="h-[44px] w-[44px] rounded-full object-cover ring-[3px] ring-white/80"
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

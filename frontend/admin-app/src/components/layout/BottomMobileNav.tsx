import { NavLink } from 'react-router-dom';
import { ResumenIcon, PedidosIcon, CitasIcon, UsuariosIcon, MenuIcon } from '../icons';

const PRIMARY_ITEMS = [
  { to: '/resumen', label: 'Resumen', icon: ResumenIcon },
  { to: '/pedidos', label: 'Pedidos', icon: PedidosIcon },
  { to: '/citas', label: 'Citas', icon: CitasIcon },
  { to: '/usuarios', label: 'Usuarios', icon: UsuariosIcon },
];

interface BottomMobileNavProps {
  onOpenMore: () => void;
}

// Cápsula de navegación flotante para móvil — reemplaza el botón de
// hamburguesa de TopNav como gesto principal (inspirada en una plantilla de
// dashboard que compartió el usuario: iconos circulares en una barra
// flotante inferior, el activo relleno). Con 8 secciones reales y solo 4
// cupos razonables acá, las más usadas quedan de acceso directo; "Más" abre
// el mismo MobileDrawer de siempre (listado completo + Volver al sitio/
// Cerrar sesión), ahora en su papel de panel de secciones secundarias en vez
// de navegación principal.
export default function BottomMobileNav({ onOpenMore }: BottomMobileNavProps) {
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-[18px] z-20 flex justify-center lg:hidden">
      <div className="flex items-center gap-1 rounded-full border border-white/70 bg-white/55 p-1.5 shadow-lg shadow-ink/10 backdrop-blur-md">
        {PRIMARY_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={({ isActive }) =>
              `grid h-12 w-12 place-items-center rounded-full transition ${
                isActive ? 'bg-ink text-white' : 'text-muted hover:bg-white/70'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onOpenMore}
          aria-label="Más secciones"
          className="grid h-12 w-12 place-items-center rounded-full text-muted transition hover:bg-white/70"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}

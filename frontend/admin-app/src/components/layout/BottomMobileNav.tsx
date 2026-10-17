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
// hamburguesa de TopNav como gesto principal. El usuario pidió volver al
// estilo glass/translúcido propio del admin-app para esta cápsula en vez
// del fondo negro sólido copiado literalmente de surveys-app.html (que sí
// se mantiene para el acento lilac del ícono activo, en línea con las
// tarjetas/accesos rápidos) — y un poco más grande que antes. Con 8
// secciones reales y solo 4 cupos razonables acá, las más usadas quedan de
// acceso directo; "Más" abre el mismo MobileDrawer de siempre (listado
// completo + Volver al sitio/Cerrar sesión), ahora en su papel de panel de
// secciones secundarias en vez de navegación principal.
export default function BottomMobileNav({ onOpenMore }: BottomMobileNavProps) {
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-[18px] z-20 flex justify-center lg:hidden">
      <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/55 p-2 shadow-lg shadow-ink/10 backdrop-blur-md">
        {PRIMARY_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={({ isActive }) =>
              `grid h-14 w-14 place-items-center rounded-full transition ${
                isActive ? 'bg-lilac text-ink' : 'text-muted hover:bg-white/70'
              }`
            }
          >
            <item.icon className="h-[22px] w-[22px]" />
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onOpenMore}
          aria-label="Más secciones"
          className="grid h-14 w-14 place-items-center rounded-full text-muted transition hover:bg-white/70"
        >
          <MenuIcon className="h-[22px] w-[22px]" />
        </button>
      </div>
    </nav>
  );
}

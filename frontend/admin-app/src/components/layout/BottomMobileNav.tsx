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
// hamburguesa de TopNav como gesto principal. Colores y proporciones
// copiados literalmente de surveys-app.html (.nav-btn/.nav-btn.is-active):
// cápsula casi negra (#111113), cada botón inactivo es su propio círculo
// gris oscuro (#2a2a2c), el activo se rellena de lilac con ícono oscuro —
// a pedido explícito del usuario, no el estilo glass/translúcido del resto
// del admin-app. Con 8 secciones reales y solo 4 cupos razonables acá, las
// más usadas quedan de acceso directo; "Más" abre el mismo MobileDrawer de
// siempre (listado completo + Volver al sitio/Cerrar sesión), ahora en su
// papel de panel de secciones secundarias en vez de navegación principal.
export default function BottomMobileNav({ onOpenMore }: BottomMobileNavProps) {
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-[18px] z-20 flex justify-center lg:hidden">
      <div className="flex h-[55px] items-center gap-2.5 rounded-full bg-[#111113] px-[5.5px] shadow-lg shadow-black/30">
        {PRIMARY_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={({ isActive }) =>
              `grid h-[45px] w-[45px] place-items-center rounded-full border transition ${
                isActive ? 'border-transparent bg-lilac text-ink' : 'border-white/10 bg-[#2a2a2c] text-white hover:bg-[#3a3a3d]'
              }`
            }
          >
            <item.icon className="h-[19px] w-[19px]" />
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onOpenMore}
          aria-label="Más secciones"
          className="grid h-[45px] w-[45px] place-items-center rounded-full border border-white/10 bg-[#2a2a2c] text-white transition hover:bg-[#3a3a3d]"
        >
          <MenuIcon className="h-[19px] w-[19px]" />
        </button>
      </div>
    </nav>
  );
}

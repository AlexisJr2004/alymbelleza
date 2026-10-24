import { NavLink } from 'react-router-dom';
import { ResumenIcon, PedidosIcon, CitasIcon, UsuariosIcon, ProductosIcon } from '../icons';

const PRIMARY_ITEMS = [
  { to: '/resumen', label: 'Resumen', icon: ResumenIcon },
  { to: '/pedidos', label: 'Pedidos', icon: PedidosIcon },
  { to: '/citas', label: 'Citas', icon: CitasIcon },
  { to: '/usuarios', label: 'Usuarios', icon: UsuariosIcon },
  { to: '/productos', label: 'Productos', icon: ProductosIcon },
];

export default function BottomMobileNav() {
  return (
    <nav aria-label="Navegación principal" className="pointer-events-none fixed inset-x-0 bottom-[max(12px,env(safe-area-inset-bottom))] z-20 flex justify-center px-3 xl:hidden">
      <div className="glass-chrome pointer-events-auto grid w-full max-w-[400px] grid-cols-5 gap-1 rounded-[30px] p-1.5">
        {PRIMARY_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={({ isActive }) =>
              `nav-pill h-[58px] min-w-0 flex-col justify-center gap-1 rounded-[24px] px-0 ${isActive ? 'is-active' : ''}`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[9px] font-medium leading-none sm:text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

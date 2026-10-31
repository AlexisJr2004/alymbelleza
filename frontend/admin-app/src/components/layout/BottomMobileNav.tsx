import { NavLink } from 'react-router-dom';
import { ResumenIcon, PedidosIcon, CitasIcon, UsuariosIcon, ProductosIcon } from '../icons';

const PRIMARY_ITEMS = [
  { to: '/resumen', label: 'Resumen', icon: ResumenIcon },
  { to: '/pedidos', label: 'Pedidos', icon: PedidosIcon },
  { to: '/citas', label: 'Citas', icon: CitasIcon },
  { to: '/usuarios', label: 'Usuarios', icon: UsuariosIcon },
  { to: '/productos', label: 'Productos', icon: ProductosIcon },
];

// Cápsula de navegación flotante para móvil — reemplaza el botón de
// hamburguesa de TopNav como gesto principal. Estilo glass/translúcido
// propio del admin-app (el usuario rechazó el fondo negro sólido copiado
// literalmente de surveys-app.html), con el acento lilac en el ícono
// activo, en línea con las tarjetas/accesos rápidos.
//
// El 5.º cupo era antes un botón "Más" (3 rayas) que abría MobileDrawer —
// el usuario lo quería reemplazado por un acceso directo real, así que
// ahora es Productos (el mismo gesto que los otros 4). El botón de menú de
// TopNav ya abre ese mismo MobileDrawer completo (Ranking/Cupones/Tarjetas
// y el resto), así que esa función no se pierde, solo deja de duplicarse acá.
export default function BottomMobileNav() {
  return (
    <nav aria-label="Navegación principal" className="admin-mobile-nav fixed inset-x-0 bottom-[18px] z-20 flex justify-center lg:hidden">
      <div className="flex w-[min(360px,calc(100%-24px))] items-center justify-between gap-1 rounded-full border border-white/70 bg-white/55 p-2 shadow-lg shadow-ink/10 backdrop-blur-md">
        {PRIMARY_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={({ isActive }) =>
              `flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full transition ${
                isActive ? 'bg-lilac text-ink' : 'text-muted hover:bg-white/70'
              }`
            }
          >
            <item.icon className="h-5 w-5" /><span className="text-[9px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

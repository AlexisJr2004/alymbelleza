import { ResumenIcon, PedidosIcon, ProductosIcon, UsuariosIcon, CuponesIcon, TrophyIcon, TarjetasIcon, CitasIcon } from '../icons';

export const ADMIN_NAV_ITEMS = [
  { to: '/resumen', label: 'Resumen', icon: ResumenIcon },
  { to: '/pedidos', label: 'Pedidos', icon: PedidosIcon },
  { to: '/productos', label: 'Productos', icon: ProductosIcon },
  { to: '/usuarios', label: 'Usuarios', icon: UsuariosIcon },
  { to: '/cupones', label: 'Cupones', icon: CuponesIcon },
  { to: '/ranking', label: 'Ranking de clientes', icon: TrophyIcon },
  { to: '/tarjetas', label: 'Tarjetas de pago', icon: TarjetasIcon },
  { to: '/citas', label: 'Citas', icon: CitasIcon },
];

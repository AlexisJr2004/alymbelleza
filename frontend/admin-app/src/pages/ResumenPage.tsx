import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, DollarIcon, PedidosIcon, ProductosIcon, UsuariosIcon, CitasIcon, StarIcon, CheckIcon, EyeIcon } from '../components/icons';
import TrendChart from '../components/ui/TrendChart';
import Sparkline from '../components/ui/Sparkline';
import CrudModal from '../components/ui/CrudModal';
import { useOrdersQuery } from '../hooks/useOrders';
import { useUsersQuery } from '../hooks/useUsers';
import { useProductsQuery } from '../hooks/useProducts';
import { useCouponsQuery } from '../hooks/useCoupons';
import { useAppointmentsQuery } from '../hooks/useAppointments';
import { getStoredUser } from '../lib/auth';
import { formatoFechaCorta, formatoMoneda } from '../lib/format';
import { buildDashboard, percentageChange } from '../lib/dashboard';
import type { Order } from '../types/models';

function Metric({ label, value, icon, series, note, warm = false }: { label: string; value: ReactNode; icon: ReactNode; series?: { total: number }[]; note?: string; warm?: boolean }) {
  const change = series ? percentageChange(series[5].total, series[4].total) : null;
  return <article className={`dashboard-metric ${warm ? 'is-warm' : ''}`}>
    <span className="dashboard-metric-icon">{icon}</span>
    <div><p>{label}</p><strong>{value}</strong><small>{note || (change === null ? 'Sin base del mes anterior' : <><span className={change < 0 ? 'negative' : 'positive'}>{change > 0 ? '↑' : change < 0 ? '↓' : ''} {Math.abs(change)}%</span> vs. mes anterior</>)}</small></div>
    {series && <Sparkline data={series} />}
  </article>;
}

function CardHeading({ title, to, children }: { title: string; to?: string; children?: ReactNode }) {
  return <header className="dashboard-card-heading"><div><h2>{title}</h2>{children}</div>{to && <Link to={to}>Ver todos <ArrowRightIcon className="h-3 w-3" /></Link>}</header>;
}

export default function ResumenPage() {
  const orderQuery = useOrdersQuery(), userQuery = useUsersQuery(), productQuery = useProductsQuery();
  const { data: coupons = [] } = useCouponsQuery();
  const { data: appointments = [] } = useAppointmentsQuery();
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    return { value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`, label: date.toLocaleDateString('es', { month: 'long', year: 'numeric' }) };
  });
  const [month, setMonth] = useState(months[0].value);
  const [chartMonths, setChartMonths] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const products = productQuery.data || [];
  const data = buildDashboard(orderQuery.data || [], userQuery.data || [], products, month);
  const loading = orderQuery.isLoading || userQuery.isLoading || productQuery.isLoading;
  const failed = orderQuery.isError || userQuery.isError || productQuery.isError;
  const unavailable = products.filter(product => !product.availability).length;
  const firstName = getStoredUser()?.name?.trim().split(' ')[0] || 'bienvenido';
  const imageBase = import.meta.env.BASE_URL + 'img/';
  const donut = data.categories.map((category, index) => {
    const preceding = data.categories.slice(0, index).reduce((sum, item) => sum + item.count, 0);
    const start = data.totalUnits ? preceding / data.totalUnits * 100 : 0;
    const end = data.totalUnits ? (preceding + category.count) / data.totalUnits * 100 : 0;
    return `${category.color} ${start}% ${end}%`;
  }).join(', ');
  return <div className="dashboard" aria-busy={loading}>
    <div className="dashboard-heading">
      <div><h1>Resumen general</h1><p>¡Hola, {firstName}! Aquí tienes un resumen del estado de tu negocio.</p></div>
      <label className="dashboard-month"><CitasIcon className="h-4 w-4" /><span className="sr-only">Mes del resumen</span><select value={month} onChange={event => setMonth(event.target.value)}>{months.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
    </div>
    {failed && <div role="alert" className="dashboard-error">No se pudieron cargar todos los datos. <button type="button" onClick={() => { void orderQuery.refetch(); void userQuery.refetch(); void productQuery.refetch(); }}>Reintentar</button></div>}
    <section className="dashboard-hero">
      <img src={imageBase + 'dashboard-skincare.jpg'} alt="" />
      <div className="dashboard-hero-copy"><h2>Belleza que <em>inspira,</em><br />negocios que crecen</h2><p>Gestiona tus pedidos, clientes y productos desde un solo lugar y lleva tu marca al siguiente nivel.</p><Link to="/productos" className="dashboard-button">Ver productos <ArrowRightIcon className="h-3 w-3" /></Link></div>
      <div className="dashboard-hero-benefits"><span><PedidosIcon />Tus ventas, a la vista</span><span><UsuariosIcon />Más cerca de tus clientes</span><span><StarIcon />Tu marca, en un solo lugar</span></div>
    </section>
    <div className="dashboard-metrics">
      <Metric label="Ingresos totales" value={loading ? '…' : orderQuery.isError ? '—' : formatoMoneda(data.income)} icon={<DollarIcon />} series={orderQuery.isError || loading ? undefined : data.incomeSeries} note={orderQuery.isError ? 'Datos no disponibles' : loading ? 'Cargando…' : undefined} />
      <Metric label="Pedidos" value={loading ? '…' : orderQuery.isError ? '—' : data.orders.length} icon={<PedidosIcon />} series={orderQuery.isError || loading ? undefined : data.orderSeries} note={orderQuery.isError ? 'Datos no disponibles' : loading ? 'Cargando…' : undefined} />
      <Metric label="Productos" value={loading ? '…' : productQuery.isError ? '—' : products.length} icon={<ProductosIcon />} note={productQuery.isError ? 'Datos no disponibles' : loading ? 'Cargando…' : `${unavailable} agotados · catálogo actual`} warm />
      <Metric label="Clientes" value={loading ? '…' : userQuery.isError ? '—' : data.clients.length} icon={<UsuariosIcon />} series={userQuery.isError || loading ? undefined : data.clientSeries} note={userQuery.isError ? 'Datos no disponibles' : loading ? 'Cargando…' : undefined} />
    </div>
    <p className="dashboard-period-note">Pedidos, ingresos y clientes acumulados hasta {months.find(item => item.value === month)?.label}. La variación compara ese mes con el anterior.</p>
    <div className="dashboard-chart-grid">
      <section className="dashboard-card dashboard-revenue">
        <div className="dashboard-chart-heading"><div><h2>Ingresos de los últimos {chartMonths} meses</h2><p>Importe de los pedidos registrados.</p></div><label><span className="sr-only">Periodo del gráfico</span><select value={chartMonths} onChange={event => setChartMonths(Number(event.target.value))}><option value={6}>Últimos 6 meses</option><option value={3}>Últimos 3 meses</option></select></label></div>
        <div className="dashboard-line-chart">{orderQuery.isError ? <p className="dashboard-empty">Datos no disponibles.</p> : loading ? <p className="dashboard-empty">Cargando ingresos…</p> : <TrendChart key={month + chartMonths} data={data.incomeSeries.slice(-chartMonths)} formatValue={formatoMoneda} color="#db5076" />}</div>
      </section>
      <section className="dashboard-card dashboard-distribution">
        <CardHeading title="Ventas por categoría" />
        {data.totalUnits ? <div className="dashboard-donut-layout"><div className="dashboard-donut" role="img" aria-label={data.categories.map(category => `${category.label}: ${category.count} unidades`).join(', ')} style={{ background: `conic-gradient(${donut})` }}><div><strong>{data.totalUnits}</strong><span>unidades</span></div></div><ul>{data.categories.map(category => <li key={category.label}><i style={{ background: category.color }} /><span>{category.label}</span><strong>{Math.round(category.count / data.totalUnits * 100)}%</strong></li>)}</ul></div> : <p className="dashboard-empty">{loading ? 'Cargando ventas…' : orderQuery.isError ? 'Datos no disponibles.' : 'Las ventas aparecerán con tus primeros pedidos.'}</p>}
      </section>
      <section className="dashboard-promo"><img src={imageBase + 'dashboard-perfume.jpg'} alt="" /><div><small>Tu escaparate digital</small><h2>Realza la belleza<br />de cada cliente</h2><p>Descubre cómo se presentan tus productos en la tienda.</p><a href="/productos" className="dashboard-button">Ver tienda <ArrowRightIcon className="h-3 w-3" /></a></div></section>
    </div>
    <div className="dashboard-bottom-grid">
      <section className="dashboard-card dashboard-orders">
        <CardHeading title="Pedidos recientes" to="/pedidos" />
        <div className="dashboard-table-scroll" tabIndex={0} aria-label="Pedidos recientes"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Registro</th><th>Total</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>
          {data.recentOrders.map(order => <tr key={order._id}><td title={order._id}>#{order._id.slice(-6)}</td><td><span className="dashboard-client-initial" aria-hidden="true">{order.user?.name?.[0] || 'C'}</span>{order.user?.name || 'Cliente eliminado'}</td><td>{formatoFechaCorta(order.createdAt)}</td><td><span className="dashboard-order-status"><CheckIcon className="h-3 w-3" />Registrado</span></td><td>{formatoMoneda(order.total)}</td><td><button type="button" onClick={() => setSelectedOrder(order)} aria-label={`Ver pedido ${order._id.slice(-6)}`}><EyeIcon className="h-4 w-4" /></button></td></tr>)}
          {!data.recentOrders.length && <tr><td colSpan={6} className="dashboard-empty">{loading ? 'Cargando pedidos…' : orderQuery.isError ? 'Datos no disponibles.' : 'No hay pedidos en este periodo.'}</td></tr>}
        </tbody></table></div>
      </section>
      <section className="dashboard-card dashboard-bestsellers">
        <CardHeading title="Productos más vendidos" to="/productos" />
        {data.bestSellers.slice(0, 4).map((item, index) => <div className="dashboard-product-row" key={item.id}><span className="dashboard-product-rank">{index + 1}</span>{item.image ? <img src={item.image} alt="" onError={event => { if (!event.currentTarget.dataset.fallback) { event.currentTarget.dataset.fallback = 'true'; event.currentTarget.src = import.meta.env.BASE_URL + 'favicon.svg'; } }} /> : <span className="dashboard-product-placeholder"><ProductosIcon className="h-5 w-5" /></span>}<div><strong>{item.name}</strong><small>{item.category}</small></div><div className="dashboard-product-numbers"><strong>{item.units}</strong><small>unidades</small></div><div className="dashboard-product-numbers"><strong>{formatoMoneda(item.amount)}</strong><small>en productos</small></div></div>)}
        {!data.bestSellers.length && <p className="dashboard-empty">{loading ? 'Cargando productos…' : orderQuery.isError ? 'Datos no disponibles.' : 'Aún no hay productos vendidos en este periodo.'}</p>}
      </section>
    </div>
    <details className="admin-analytics dashboard-extra"><summary>Más información del negocio <span>Citas y promociones actuales</span></summary><div className="dashboard-operations"><Link to="/citas"><CitasIcon /><strong>{appointments.filter(item => (item.status || 'pendiente') === 'pendiente').length}</strong><span>Citas pendientes</span><ArrowRightIcon /></Link><Link to="/cupones"><StarIcon /><strong>{coupons.filter(item => item.active && (!item.expiresAt || new Date(item.expiresAt) >= now)).length}</strong><span>Cupones activos</span><ArrowRightIcon /></Link><Link to="/ranking"><UsuariosIcon /><span>Explorar el ranking de clientes</span><ArrowRightIcon /></Link><Link to="/tarjetas"><DollarIcon /><span>Administrar cuentas de pago</span><ArrowRightIcon /></Link></div></details>
    <CrudModal open={!!selectedOrder} title="Detalle del pedido" onClose={() => setSelectedOrder(null)}>
      {selectedOrder && <div className="dashboard-order-detail"><p className="break-all">#{selectedOrder._id}</p><p>{selectedOrder.user?.name || 'Cliente eliminado'} · {formatoFechaCorta(selectedOrder.createdAt)}</p><p>{selectedOrder.user?.email}</p><ul>{selectedOrder.items.map((item, index) => <li key={index}><span>{item.cantidad} × {item.name}</span><strong>{formatoMoneda(item.cantidad * item.price)}</strong></li>)}</ul><dl><div><dt>Subtotal</dt><dd>{formatoMoneda(selectedOrder.subtotal)}</dd></div><div><dt>Descuento {selectedOrder.couponCode || ''}</dt><dd>−{formatoMoneda(selectedOrder.discount || 0)}</dd></div><div><dt>Total</dt><dd>{formatoMoneda(selectedOrder.total)}</dd></div></dl></div>}
    </CrudModal>
  </div>;
}

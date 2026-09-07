import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Sparkline from '../components/ui/Sparkline';
import TrendChart from '../components/ui/TrendChart';
import AnnularDonut from '../components/ui/AnnularDonut';
import BankCardPreview from '../components/ui/BankCardPreview';
import {
  PedidosIcon,
  UsuariosIcon,
  ProductosIcon,
  CuponesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CitasIcon,
  PlusIcon,
} from '../components/icons';
import { useOrdersQuery } from '../hooks/useOrders';
import { useUsersQuery } from '../hooks/useUsers';
import { useProductsQuery } from '../hooks/useProducts';
import { useCouponsQuery } from '../hooks/useCoupons';
import { usePaymentCardsQuery } from '../hooks/usePaymentCards';
import { useAppointmentsQuery } from '../hooks/useAppointments';
import { construirSerieMensual } from '../lib/monthly';
import { formatoMoneda, formatoFechaCorta } from '../lib/format';
import type { Order } from '../types/models';

function ResumenKpiCard({
  etiqueta,
  valor,
  sub,
  iconBg,
  iconColor,
  icon,
}: {
  etiqueta: string;
  valor: React.ReactNode;
  sub: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{etiqueta}</p>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-tight">{valor}</p>
      <p className="text-xs text-gray-400 mt-2">{sub}</p>
    </div>
  );
}

function calcularClientesActivos(orders: Order[]) {
  const porUsuario: Record<string, { nombre: string; email: string; total: number; gastado: number; ultimo: string }> = {};
  orders.forEach((o) => {
    const email = o.user?.email;
    if (!email) return;
    if (!porUsuario[email]) {
      porUsuario[email] = { nombre: o.user?.name || 'Cliente', email, total: 0, gastado: 0, ultimo: o.createdAt };
    }
    porUsuario[email].total += 1;
    porUsuario[email].gastado += o.total || 0;
    if (new Date(o.createdAt) > new Date(porUsuario[email].ultimo)) porUsuario[email].ultimo = o.createdAt;
  });
  return Object.values(porUsuario)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

function calcularClientesInactivos(orders: Order[], users: { name?: string; email?: string; role: string; createdAt: string }[]) {
  const ultimoPorEmail: Record<string, string> = {};
  orders.forEach((o) => {
    const email = o.user?.email;
    if (!email) return;
    if (!ultimoPorEmail[email] || new Date(o.createdAt) > new Date(ultimoPorEmail[email])) {
      ultimoPorEmail[email] = o.createdAt;
    }
  });
  const ahora = new Date();
  return users
    .filter((u) => u.role !== 'admin')
    .map((u) => {
      const ultimo = (u.email && ultimoPorEmail[u.email]) || null;
      const dias = ultimo ? Math.floor((ahora.getTime() - new Date(ultimo).getTime()) / 86400000) : null;
      return { ...u, ultimoPedido: ultimo, dias };
    })
    .filter((u) => u.dias == null || u.dias >= 30)
    .sort((a, b) => {
      if (a.dias == null && b.dias == null) return 0;
      if (a.dias == null) return -1;
      if (b.dias == null) return 1;
      return b.dias - a.dias;
    })
    .slice(0, 8);
}

export default function ResumenPage() {
  const { data: orders = [] } = useOrdersQuery();
  const { data: users = [] } = useUsersQuery();
  const { data: products = [] } = useProductsQuery();
  const { data: coupons = [] } = useCouponsQuery();
  const { data: paymentCards = [] } = usePaymentCardsQuery();
  const { data: citas = [] } = useAppointmentsQuery();

  const [tarjetaIndex, setTarjetaIndex] = useState(0);

  const ingresos = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const descuentos = orders.reduce((sum, o) => sum + (o.discount || 0), 0);
  const productosAgotados = products.filter((p) => !p.availability).length;
  const cuponesActivos = coupons.filter((c) => c.active).length;

  const hoy = new Date();
  const usuariosEsteMes = users.filter((u) => {
    const f = new Date(u.createdAt);
    return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
  }).length;

  const serieIngresos = useMemo(() => construirSerieMensual(orders, (o) => o.createdAt, (o) => o.total || 0), [orders]);
  const seriePedidos = useMemo(() => construirSerieMensual(orders, (o) => o.createdAt, () => 1), [orders]);
  const serieUsuariosNuevos = useMemo(() => construirSerieMensual(users, (u) => u.createdAt, () => 1), [users]);

  const mesActualTotal = serieIngresos[5].total;
  const mesAnteriorTotal = serieIngresos[4].total;
  const cambioPct = mesAnteriorTotal > 0 ? Math.round(((mesActualTotal - mesAnteriorTotal) / mesAnteriorTotal) * 100) : null;
  const mesSub = `${serieIngresos[5].label} de ${hoy.getFullYear()}`.replace(/^\w/, (c) => c.toUpperCase());

  const estadosCitas = [
    { key: 'pendiente' as const, label: 'Pendientes', color: '#f59e0b' },
    { key: 'realizada' as const, label: 'Realizadas', color: '#10b981' },
    { key: 'cancelada' as const, label: 'Canceladas', color: '#f43f5e' },
  ];
  const conteosCitas = estadosCitas.map((e) => ({ ...e, count: citas.filter((c) => (c.status || 'pendiente') === e.key).length }));
  const totalCitas = citas.length;
  const realizadasCount = conteosCitas.find((e) => e.key === 'realizada')?.count || 0;
  const pctRealizadas = totalCitas ? Math.round((realizadasCount / totalCitas) * 100) : 0;

  const ultimosPedidos = orders.slice(0, 5);
  const pedidosTabla = orders.slice(0, 6);
  const ultimosUsuarios = users.slice(0, 5);

  const clientesActivos = useMemo(() => calcularClientesActivos(orders), [orders]);
  const clientesInactivos = useMemo(() => calcularClientesInactivos(orders, users), [orders, users]);

  const tarjetasActivas = paymentCards.filter((c) => c.activa);
  const tarjetaActual = tarjetasActivas.length ? tarjetasActivas[tarjetaIndex % tarjetasActivas.length] : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Panel de control"
        title="Resumen general"
        description="Los pedidos, citas y usuarios de Bella Beauty se consolidan aquí para ver el estado del negocio de un vistazo."
      />

      {/* Fila 1: hero de ingresos + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800">Ingresos totales</h3>
            <p className="text-sm text-gray-400">Resumen de tus ingresos actuales</p>

            <div className="flex items-end justify-between gap-4 mt-5">
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatoMoneda(ingresos)}</p>
                {cambioPct === null ? (
                  <p className="text-sm font-medium mt-1 text-gray-400">Sin datos del mes anterior</p>
                ) : (
                  <p className={`text-sm font-medium mt-1 ${cambioPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <span className="inline-flex items-center gap-1">
                      {cambioPct >= 0 ? <ArrowUpIcon className="w-3.5 h-3.5" /> : <ArrowDownIcon className="w-3.5 h-3.5" />}
                      {Math.abs(cambioPct)}% que el mes anterior
                    </span>
                  </p>
                )}
              </div>
              <Sparkline data={serieIngresos} />
            </div>

            <div className="border-t border-dashed border-gray-300/70 my-5" />

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{orders.length}</span> pedidos registrados
              </p>
              <Link to="/pedidos" className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1">
                Ver todos
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/pedidos"
              className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
            >
              <PedidosIcon className="w-4 h-4" />
              Ver pedidos
            </Link>
            <Link
              to="/citas"
              className="flex-1 bg-white/70 backdrop-blur-md border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
            >
              <CitasIcon className="w-4 h-4" />
              Ver citas
            </Link>
            <Link
              to="/productos"
              title="Agregar producto"
              className="w-11 h-11 shrink-0 bg-white/70 backdrop-blur-md border border-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-white/90 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ResumenKpiCard
            etiqueta="Pedidos"
            valor={orders.length}
            sub={`${formatoMoneda(descuentos)} en descuentos`}
            iconBg="bg-purple-100/70"
            iconColor="text-purple-600"
            icon={<PedidosIcon className="w-4 h-4" />}
          />
          <ResumenKpiCard
            etiqueta="Usuarios"
            valor={users.length}
            sub={`${usuariosEsteMes} nuevos este mes`}
            iconBg="bg-blue-100/70"
            iconColor="text-blue-600"
            icon={<UsuariosIcon className="w-4 h-4" />}
          />
          <ResumenKpiCard
            etiqueta="Productos"
            valor={products.length}
            sub={`${productosAgotados} agotados`}
            iconBg="bg-pink-100/70"
            iconColor="text-pink-600"
            icon={<ProductosIcon className="w-4 h-4" />}
          />
          <ResumenKpiCard
            etiqueta="Cupones activos"
            valor={`${cuponesActivos}/${coupons.length}`}
            sub={`${coupons.length} en total`}
            iconBg="bg-amber-100/70"
            iconColor="text-amber-600"
            icon={<CuponesIcon className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Fila 2: gráfico de ingresos + panel lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Ingresos de los últimos 6 meses</h3>
          <p className="text-sm text-gray-500 mb-6">Total facturado por mes según los pedidos registrados.</p>
          <div className="h-48">
            <TrendChart data={serieIngresos} formatValue={formatoMoneda} color="#9333ea" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-6 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
            <p className="text-sm text-white/80 relative">Ingresos de este mes</p>
            <p className="text-3xl font-bold mt-1 relative">{formatoMoneda(mesActualTotal)}</p>
            <p className="text-sm text-white/80 mt-4 relative">{mesSub}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800">Últimos pedidos</h3>
              <Link to="/pedidos" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                Ver todos
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {ultimosPedidos.length ? (
                ultimosPedidos.map((o) => (
                  <div key={o._id} className="flex items-center justify-between px-6 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{o.user?.name || 'Cliente'}</p>
                      <p className="text-xs text-gray-400">{formatoFechaCorta(o.createdAt)}</p>
                    </div>
                    <span className="text-sm font-semibold text-purple-700">{formatoMoneda(o.total)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 px-6 py-6 text-center">Todavía no hay pedidos.</p>
              )}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800">Tarjetas de pago</h3>
              <Link to="/tarjetas" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                Ver todas
              </Link>
            </div>
            <div className="p-6">
              {tarjetaActual ? (
                <BankCardPreview card={tarjetaActual} />
              ) : (
                <p className="text-sm text-gray-400 text-center py-10">Todavía no hay tarjetas visibles.</p>
              )}
              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  disabled={!tarjetasActivas.length}
                  onClick={() => setTarjetaIndex((i) => (i - 1 + tarjetasActivas.length) % tarjetasActivas.length)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-40"
                >
                  <ChevronDownIcon className="w-3.5 h-3.5 rotate-90" />
                </button>
                <span className="text-xs text-gray-400">
                  {tarjetasActivas.length ? `${(tarjetaIndex % tarjetasActivas.length) + 1} / ${tarjetasActivas.length}` : '0 / 0'}
                </span>
                <button
                  type="button"
                  disabled={!tarjetasActivas.length}
                  onClick={() => setTarjetaIndex((i) => (i + 1) % tarjetasActivas.length)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-40"
                >
                  <ChevronDownIcon className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fila 3: distribución de citas + pedidos por mes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-purple-600 font-semibold">Estado general</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-1">Estado de las citas</h3>
            </div>
            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100 shrink-0">
              Total: <span className="font-semibold">{totalCitas}</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
            <AnnularDonut groups={conteosCitas} centerPct={pctRealizadas} centerCaption="Realizadas" />
            <div className="space-y-2.5">
              {conteosCitas.map((e) => (
                <div key={e.key} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                  <span>{e.label}</span>
                  <span className="ml-auto font-medium text-gray-800">{e.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Pedidos de los últimos 6 meses</h3>
          <p className="text-sm text-gray-500 mb-6">Cantidad de pedidos registrados por mes.</p>
          <div className="h-40">
            <TrendChart data={seriePedidos} formatValue={(v) => String(v)} color="#db2777" />
          </div>
        </div>
      </div>

      {/* Fila 4: pedidos recientes */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Pedidos recientes</h3>
          <Link to="/pedidos" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cupón</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {pedidosTabla.length ? (
                pedidosTabla.map((o) => {
                  const productosPlano = (o.items || []).map((i) => `${i.cantidad}× ${i.name}`).join(', ');
                  return (
                    <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {o.user ? (
                          <>
                            {o.user.name || 'Cliente'}
                            <br />
                            <span className="text-xs text-gray-400">{o.user.email || ''}</span>
                          </>
                        ) : (
                          'Cliente eliminado'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={productosPlano}>
                        {productosPlano}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {o.couponCode ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-700">{o.couponCode}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatoFechaCorta(o.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{formatoMoneda(o.total)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Todavía no hay pedidos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fila 5: usuarios nuevos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Usuarios nuevos por mes</h3>
          <p className="text-sm text-gray-500 mb-6">Registros nuevos en los últimos 6 meses.</p>
          <div className="h-40">
            <TrendChart data={serieUsuariosNuevos} formatValue={(v) => String(v)} color="#4f46e5" />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Últimos usuarios registrados</h3>
            <Link to="/usuarios" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {ultimosUsuarios.length ? (
              ultimosUsuarios.map((u) => (
                <div key={u._id} className="flex items-center justify-between px-6 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{u.name || 'Usuario'}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email || ''}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{formatoFechaCorta(u.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 px-6 py-6 text-center">Todavía no hay usuarios.</p>
            )}
          </div>
        </div>
      </div>

      {/* Fila 6: clientes más activos */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-purple-600 font-semibold">Usuarios</p>
            <h3 className="text-lg font-bold text-gray-800 mt-1">Clientes más activos</h3>
          </div>
          <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100">
            {clientesActivos.length} cliente{clientesActivos.length === 1 ? '' : 's'} con pedidos
          </span>
        </div>
        {clientesActivos.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {clientesActivos.map((u, i) => (
              <div key={u.email} className="rounded-2xl border border-gray-200 bg-white p-3">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Cliente {i + 1}</p>
                <h4 className="mt-1 text-sm font-semibold text-gray-900 truncate">{u.nombre}</h4>
                <div className="mt-3 rounded-xl bg-purple-50/60 p-3">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-500">Pedidos</p>
                      <p className="text-xl font-bold text-gray-900">{u.total}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wide text-gray-500">Gastado</p>
                      <p className="text-sm font-semibold text-purple-700">{formatoMoneda(u.gastado)}</p>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[11px] text-gray-400">Último: {formatoFechaCorta(u.ultimo)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-6 text-sm">Todavía no hay pedidos de clientes.</p>
        )}
      </div>

      {/* Fila 7: clientes en riesgo de abandono */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold">Retención</p>
            <h3 className="text-lg font-bold text-gray-800 mt-1">Clientes en riesgo de abandono</h3>
          </div>
          <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100 shrink-0">
            30+ días sin pedidos
          </span>
        </div>
        {clientesInactivos.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {clientesInactivos.map((u) => (
              <div key={u.email} className="rounded-2xl border border-amber-100 bg-amber-50/40 p-3">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{u.name || 'Cliente'}</h4>
                <p className="text-xs text-gray-500 mt-1 truncate">{u.email || ''}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{u.ultimoPedido ? `Último: ${formatoFechaCorta(u.ultimoPedido)}` : 'Nunca ha comprado'}</span>
                  {u.dias != null && <span className="text-xs font-bold text-amber-700">{u.dias}d</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-6 text-sm">Todos los clientes activos tienen pedidos recientes.</p>
        )}
      </div>
    </div>
  );
}

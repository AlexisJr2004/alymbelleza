import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Sparkline from '../components/ui/Sparkline';
import TrendChart from '../components/ui/TrendChart';
import AnnularDonut from '../components/ui/AnnularDonut';
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
import { formatoMoneda, formatoFechaCorta, numeroWhatsapp } from '../lib/format';
import type { Order, User } from '../types/models';

const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

// Mismo set de degradés que la cuadrícula de resumen de TarjetasPage.tsx —
// se reutiliza acá para que "Tarjetas de pago" tenga el mismo diseño de
// tarjeta en vez del estilo "banco real" (BankCardPreview) que tenía antes.
const RESUMEN_TARJETA_ESTILOS = [
  'from-emerald-500 to-emerald-600',
  'from-violet-500 to-purple-600',
  'from-orange-400 to-orange-500',
  'from-sky-400 to-blue-500',
];

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
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted">{etiqueta}</p>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>{icon}</div>
      </div>
      <p className="text-xl font-bold text-ink leading-tight">{valor}</p>
      <p className="text-xs text-muted mt-1.5">{sub}</p>
    </div>
  );
}

function calcularClientesActivos(orders: Order[], users: User[]) {
  const porUsuario: Record<
    string,
    { nombre: string; email: string; total: number; gastado: number; ultimo: string; phone?: string; profileImage?: string }
  > = {};
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
  // El pedido solo trae name/email del cliente (ver Order en types/models.ts) —
  // el teléfono y la foto de perfil viven en el User completo, así que se
  // cruzan acá por email para el ranking de compras.
  const usuarioPorEmail = new Map(users.filter((u) => u.email).map((u) => [u.email as string, u]));
  Object.values(porUsuario).forEach((c) => {
    const u = usuarioPorEmail.get(c.email);
    c.phone = u?.phone;
    c.profileImage = u?.profileImage;
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

  const clientesActivos = useMemo(() => calcularClientesActivos(orders, users), [orders, users]);
  const clientesInactivos = useMemo(() => calcularClientesInactivos(orders, users), [orders, users]);

  const tarjetasActivas = paymentCards.filter((c) => c.activa);
  const tarjetaEstiloIndice = tarjetasActivas.length ? tarjetaIndex % tarjetasActivas.length : 0;
  const tarjetaActual = tarjetasActivas.length ? tarjetasActivas[tarjetaEstiloIndice] : null;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Panel de control"
        title="Resumen general"
        description="Los pedidos, citas y usuarios de Bella Beauty se consolidan aquí para ver el estado del negocio de un vistazo."
      />

      {/* Fila 1: ranking de clientes (a la izquierda) + las 4 KPIs. items-start
          para que la columna del ranking (más alta, tiene foto + lista) no
          estire la grilla de KPIs de al lado y le deje aire de más abajo. */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
        {/* Ranking de clientes — un solo contenedor .glass con 2 sub-bloques:
            el N.º 1 (foto circular centrada + nombre/correo/celular) y,
            debajo, la lista del resto. */}
        <div className="lg:col-span-2 glass p-5">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-coral font-semibold">Ranking</p>
            <h3 className="text-base font-bold text-ink mt-1">Clientes con más compras</h3>
          </div>

          {clientesActivos.length ? (
            <>
              <div className="flex flex-col items-center rounded-2xl border border-white/80 bg-white/40 p-6 text-center">
                <div className="relative">
                  <img
                    src={clientesActivos[0].profileImage || FALLBACK_AVATAR}
                    alt={clientesActivos[0].nombre}
                    className="h-24 w-24 rounded-full object-cover ring-[3px] ring-white"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_AVATAR;
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-bold text-white ring-2 ring-white">
                    1
                  </span>
                </div>
                <h4 className="mt-3 text-lg font-bold text-ink">{clientesActivos[0].nombre}</h4>
                <p className="mt-1 text-sm text-muted">{clientesActivos[0].email}</p>
                {clientesActivos[0].phone ? (
                  <a
                    href={`https://wa.me/${numeroWhatsapp(clientesActivos[0].phone)}`}
                    target="_blank"
                    rel="noopener"
                    className="text-sm text-sky hover:text-sky/70 hover:underline"
                  >
                    {clientesActivos[0].phone}
                  </a>
                ) : (
                  <p className="text-sm text-muted">Sin teléfono</p>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="rounded-full border border-white/80 bg-white/60 px-3 py-1 font-medium text-[#3a3d45]">
                    {clientesActivos[0].total} pedidos
                  </span>
                  <span className="rounded-full bg-sky/15 px-3 py-1 font-semibold text-sky">
                    {formatoMoneda(clientesActivos[0].gastado)}
                  </span>
                </div>
              </div>

              {clientesActivos.length > 1 && (
                <div className="mt-4 divide-y divide-white/60 rounded-2xl border border-white/80 bg-white/25 px-4">
                  {clientesActivos.slice(1).map((c, i) => (
                    <div key={c.email} className="flex items-center gap-3 py-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/80 bg-white/60 text-xs font-semibold text-[#3a3d45]">
                        {i + 2}
                      </span>
                      <img
                        src={c.profileImage || FALLBACK_AVATAR}
                        alt={c.nombre}
                        className="h-9 w-9 rounded-full object-cover shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_AVATAR;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink truncate">{c.nombre}</p>
                        <p className="text-xs text-muted truncate">{c.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-ink">{c.total} pedidos</p>
                        <p className="text-xs text-sky">{formatoMoneda(c.gastado)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted py-6 text-sm">Todavía no hay compras de clientes.</p>
          )}
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ResumenKpiCard
            etiqueta="Pedidos"
            valor={orders.length}
            sub={`${formatoMoneda(descuentos)} en descuentos`}
            iconBg="bg-ink/5"
            iconColor="text-ink"
            icon={<PedidosIcon className="w-4 h-4" />}
          />
          <ResumenKpiCard
            etiqueta="Usuarios"
            valor={users.length}
            sub={`${usuariosEsteMes} nuevos este mes`}
            iconBg="bg-sky/15"
            iconColor="text-sky"
            icon={<UsuariosIcon className="w-4 h-4" />}
          />
          <ResumenKpiCard
            etiqueta="Productos"
            valor={products.length}
            sub={`${productosAgotados} agotados`}
            iconBg="bg-coral/15"
            iconColor="text-coral"
            icon={<ProductosIcon className="w-4 h-4" />}
          />
          <ResumenKpiCard
            etiqueta="Cupones activos"
            valor={`${cuponesActivos}/${coupons.length}`}
            sub={`${coupons.length} en total`}
            iconBg="bg-[#eef0f4]"
            iconColor="text-muted"
            icon={<CuponesIcon className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Fila 1b: ingresos totales + acciones — antes vivía a la izquierda de
          las 4 KPIs; ese lugar ahora lo ocupa el ranking de clientes, así
          que pasa a su propia fila, con un ancho acotado (max-w-xl) para no
          quedar estirado a todo el ancho de la página. */}
      <div className="max-w-xl flex flex-col gap-3">
        <div className="glass p-5">
          <h3 className="font-semibold text-ink">Ingresos totales</h3>
          <p className="text-sm text-muted">Resumen de tus ingresos actuales</p>

          <div className="flex items-end justify-between gap-4 mt-4">
            <div>
              <p className="text-2xl font-bold text-ink">{formatoMoneda(ingresos)}</p>
              {cambioPct === null ? (
                <p className="text-sm font-medium mt-1 text-muted">Sin datos del mes anterior</p>
              ) : (
                <p className={`text-sm font-medium mt-1 ${cambioPct >= 0 ? 'text-sky' : 'text-coral'}`}>
                  <span className="inline-flex items-center gap-1">
                    {cambioPct >= 0 ? <ArrowUpIcon className="w-3.5 h-3.5" /> : <ArrowDownIcon className="w-3.5 h-3.5" />}
                    {Math.abs(cambioPct)}% que el mes anterior
                  </span>
                </p>
              )}
            </div>
            <Sparkline data={serieIngresos} />
          </div>

          <div className="border-t border-dashed border-white/80 my-4" />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">{orders.length}</span> pedidos registrados
            </p>
            <Link to="/pedidos" className="text-sm font-medium text-sky hover:text-sky/70 flex items-center gap-1">
              Ver todos
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex gap-2.5">
          <Link
            to="/pedidos"
            className="flex-1 bg-ink text-white py-2.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-ink/85 transition-colors"
          >
            <PedidosIcon className="w-4 h-4" />
            Ver pedidos
          </Link>
          <Link
            to="/citas"
            className="flex-1 bg-white/50 border border-white/80 text-[#3a3d45] py-2.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
          >
            <CitasIcon className="w-4 h-4" />
            Ver citas
          </Link>
          <Link
            to="/productos"
            title="Agregar producto"
            className="w-11 h-11 shrink-0 bg-white/50 border border-white/80 text-[#3a3d45] rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Fila 2: gráfico de ingresos + ingresos de este mes, a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass p-5">
          <h3 className="text-base font-semibold text-ink mb-1">Ingresos de los últimos 6 meses</h3>
          <p className="text-sm text-muted mb-4">Total facturado por mes según los pedidos registrados.</p>
          <div className="h-36">
            <TrendChart data={serieIngresos} formatValue={formatoMoneda} color="#7e9ce3" />
          </div>
        </div>

        <div className="rounded-[26px] bg-ink p-5 text-white relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-6 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
          <p className="text-sm text-white/70 relative">Ingresos de este mes</p>
          <p className="text-2xl font-bold mt-1 relative">{formatoMoneda(mesActualTotal)}</p>
          <p className="text-sm text-white/70 mt-3 relative">{mesSub}</p>
        </div>
      </div>

      {/* Fila 3: distribución de citas + pedidos por mes, justo debajo de
          ingresos y en las mismas 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-coral font-semibold">Estado general</p>
              <h3 className="text-base font-semibold text-ink mt-1">Estado de las citas</h3>
            </div>
            <span className="text-xs px-2 py-1 bg-white/50 text-[#3a3d45] rounded-full border border-white/80 shrink-0">
              Total: <span className="font-semibold">{totalCitas}</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 items-center">
            <AnnularDonut groups={conteosCitas} centerPct={pctRealizadas} centerCaption="Realizadas" />
            <div className="space-y-2">
              {conteosCitas.map((e) => (
                <div key={e.key} className="flex items-center gap-2 text-sm text-[#3a3d45]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                  <span>{e.label}</span>
                  <span className="ml-auto font-medium text-ink">{e.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="glass p-5">
          <h3 className="text-base font-semibold text-ink mb-1">Pedidos de los últimos 6 meses</h3>
          <p className="text-sm text-muted mb-4">Cantidad de pedidos registrados por mes.</p>
          <div className="h-32">
            <TrendChart data={seriePedidos} formatValue={(v) => String(v)} color="#e2766f" />
          </div>
        </div>
      </div>

      {/* Fila 3b: últimos pedidos + tarjetas de pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass overflow-hidden">
          <div className="px-5 py-3 border-b border-white/70 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Últimos pedidos</h3>
            <Link to="/pedidos" className="text-xs text-sky hover:text-sky/70 font-medium">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-white/60">
            {ultimosPedidos.length ? (
              ultimosPedidos.map((o) => (
                <div key={o._id} className="flex items-center justify-between px-5 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{o.user?.name || 'Cliente'}</p>
                    <p className="text-xs text-muted">{formatoFechaCorta(o.createdAt)}</p>
                  </div>
                  <span className="text-sm font-semibold text-sky">{formatoMoneda(o.total)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted px-5 py-5 text-center">Todavía no hay pedidos.</p>
            )}
          </div>
        </div>

        <div className="glass overflow-hidden">
          <div className="px-5 py-3 border-b border-white/70 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Tarjetas de pago</h3>
            <Link to="/tarjetas" className="text-xs text-sky hover:text-sky/70 font-medium">
              Ver todas
            </Link>
          </div>
          <div className="p-5">
            {tarjetaActual ? (
              <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${RESUMEN_TARJETA_ESTILOS[tarjetaEstiloIndice % RESUMEN_TARJETA_ESTILOS.length]} p-5 text-white`}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-sm font-medium text-white/80">{tarjetaActual.banco}</p>
                  <p className="text-xl font-bold mt-1 tracking-wide">{tarjetaActual.numeroCuenta}</p>
                  <div className="flex items-center gap-1.5 mt-4">
                    <span className="w-6 h-6 rounded-full bg-white/50" />
                    <span className="w-6 h-6 rounded-full bg-white/25 -ml-3" />
                    <span className="text-xs font-semibold ml-2 uppercase tracking-wide">{tarjetaActual.marca}</span>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/20">
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/70 uppercase tracking-wide">Tipo de cuenta</p>
                      <p className="text-sm font-semibold mt-0.5 truncate">{tarjetaActual.tipoCuenta}</p>
                    </div>
                    <div className="text-right min-w-0">
                      <p className="text-[10px] text-white/70 uppercase tracking-wide">Titular</p>
                      <p className="text-sm font-semibold mt-0.5 truncate">{tarjetaActual.titular}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-8">Todavía no hay tarjetas visibles.</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <button
                type="button"
                disabled={!tarjetasActivas.length}
                onClick={() => setTarjetaIndex((i) => (i - 1 + tarjetasActivas.length) % tarjetasActivas.length)}
                className="w-8 h-8 rounded-full border border-white/80 bg-white/50 flex items-center justify-center text-[#3a3d45] hover:bg-white/90 transition disabled:opacity-40"
              >
                <ChevronDownIcon className="w-3.5 h-3.5 rotate-90" />
              </button>
              <span className="text-xs text-muted">
                {tarjetasActivas.length ? `${(tarjetaIndex % tarjetasActivas.length) + 1} / ${tarjetasActivas.length}` : '0 / 0'}
              </span>
              <button
                type="button"
                disabled={!tarjetasActivas.length}
                onClick={() => setTarjetaIndex((i) => (i + 1) % tarjetasActivas.length)}
                className="w-8 h-8 rounded-full border border-white/80 bg-white/50 flex items-center justify-center text-[#3a3d45] hover:bg-white/90 transition disabled:opacity-40"
              >
                <ChevronDownIcon className="w-3.5 h-3.5 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fila 4: pedidos recientes */}
      <div className="glass overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/70 flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink">Pedidos recientes</h3>
          <Link to="/pedidos" className="text-sm text-sky hover:text-sky/70 font-medium">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/70">
            <thead className="bg-white/40">
              <tr>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Cliente</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Productos</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Cupón</th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-muted uppercase tracking-wider">Fecha</th>
                <th className="px-5 py-2.5 text-right text-xs font-medium text-muted uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white/20 divide-y divide-white/60">
              {pedidosTabla.length ? (
                pedidosTabla.map((o) => {
                  const productosPlano = (o.items || []).map((i) => `${i.cantidad}× ${i.name}`).join(', ');
                  return (
                    <tr key={o._id} className="hover:bg-white/40 transition-colors">
                      <td className="px-5 py-3 text-sm text-[#3a3d45]">
                        {o.user ? (
                          <>
                            {o.user.name || 'Cliente'}
                            <br />
                            <span className="text-xs text-muted">{o.user.email || ''}</span>
                          </>
                        ) : (
                          'Cliente eliminado'
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted max-w-xs truncate" title={productosPlano}>
                        {productosPlano}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {o.couponCode ? <span className="status bg-coral">{o.couponCode}</span> : '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted">{formatoFechaCorta(o.createdAt)}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-ink text-right">{formatoMoneda(o.total)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted">
                    Todavía no hay pedidos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fila 5: usuarios nuevos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass p-5">
          <h3 className="text-base font-semibold text-ink mb-1">Usuarios nuevos por mes</h3>
          <p className="text-sm text-muted mb-4">Registros nuevos en los últimos 6 meses.</p>
          <div className="h-32">
            <TrendChart data={serieUsuariosNuevos} formatValue={(v) => String(v)} color="#16181d" />
          </div>
        </div>
        <div className="glass overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/70 flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink">Últimos usuarios registrados</h3>
            <Link to="/usuarios" className="text-sm text-sky hover:text-sky/70 font-medium">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-white/60">
            {ultimosUsuarios.length ? (
              ultimosUsuarios.map((u) => (
                <div key={u._id} className="flex items-center justify-between px-5 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{u.name || 'Usuario'}</p>
                    <p className="text-xs text-muted truncate">{u.email || ''}</p>
                  </div>
                  <span className="text-xs text-muted shrink-0 ml-2">{formatoFechaCorta(u.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted px-5 py-5 text-center">Todavía no hay usuarios.</p>
            )}
          </div>
        </div>
      </div>

      {/* Fila 6: clientes más activos + en riesgo de abandono, lado a lado
          (antes eran dos tarjetas de ancho completo apiladas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-3 gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-coral font-semibold">Usuarios</p>
              <h3 className="text-base font-bold text-ink mt-1">Clientes más activos</h3>
            </div>
            <span className="text-xs px-2 py-1 bg-white/50 text-[#3a3d45] rounded-full border border-white/80 shrink-0">
              {clientesActivos.length} con pedidos
            </span>
          </div>
          {clientesActivos.length ? (
            <div className="grid grid-cols-2 gap-2.5">
              {clientesActivos.slice(0, 4).map((u, i) => (
                <div key={u.email} className="rounded-2xl border border-white/80 bg-white/40 p-2.5">
                  <p className="text-[10px] uppercase tracking-wide text-muted">Cliente {i + 1}</p>
                  <h4 className="mt-0.5 text-sm font-semibold text-ink truncate">{u.nombre}</h4>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-wide text-muted">Pedidos</p>
                      <p className="text-lg font-bold text-ink leading-tight">{u.total}</p>
                    </div>
                    <p className="text-xs font-semibold text-sky">{formatoMoneda(u.gastado)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-5 text-sm">Todavía no hay pedidos de clientes.</p>
          )}
        </div>

        <div className="glass p-5">
          <div className="flex items-center justify-between mb-3 gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-coral font-semibold">Retención</p>
              <h3 className="text-base font-bold text-ink mt-1">En riesgo de abandono</h3>
            </div>
            <span className="text-xs px-2 py-1 bg-coral/10 text-coral rounded-full border border-coral/25 shrink-0">
              30+ días
            </span>
          </div>
          {clientesInactivos.length ? (
            <div className="grid grid-cols-2 gap-2.5">
              {clientesInactivos.slice(0, 4).map((u) => (
                <div key={u.email} className="rounded-2xl border border-coral/25 bg-coral/5 p-2.5">
                  <h4 className="text-sm font-semibold text-ink truncate">{u.name || 'Cliente'}</h4>
                  <p className="text-xs text-muted mt-0.5 truncate">{u.email || ''}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-muted">
                      {u.ultimoPedido ? formatoFechaCorta(u.ultimoPedido) : 'Nunca compró'}
                    </span>
                    {u.dias != null && <span className="text-xs font-bold text-coral">{u.dias}d</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-5 text-sm">Todos los clientes activos tienen pedidos recientes.</p>
          )}
        </div>
      </div>

    </div>
  );
}

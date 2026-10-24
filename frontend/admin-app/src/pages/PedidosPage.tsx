import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
import StatCardMobile from '../components/ui/StatCardMobile';
import Switch from '../components/ui/Switch';
import DonutChart from '../components/ui/DonutChart';
import Pagination from '../components/ui/Pagination';
import { PedidosIcon, DollarIcon, CuponesIcon, BarsIcon } from '../components/icons';
import { useOrdersQuery } from '../hooks/useOrders';
import { filtrarPorRangoDeFechas } from '../lib/filters';
import { formatoFechaCorta, formatoMoneda } from '../lib/format';

const PEDIDOS_POR_PAGINA = 6;

export default function PedidosPage() {
  const { data: orders = [], isLoading } = useOrdersQuery();

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [soloConCupon, setSoloConCupon] = useState(false);
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    let lista = filtrarPorRangoDeFechas(orders, (o) => o.createdAt, fechaDesde, fechaHasta);
    if (soloConCupon) lista = lista.filter((o) => !!o.couponCode);
    return lista;
  }, [orders, fechaDesde, fechaHasta, soloConCupon]);

  const ingresos = filtrados.reduce((sum, o) => sum + (o.total || 0), 0);
  const descuentos = filtrados.reduce((sum, o) => sum + (o.discount || 0), 0);
  const promedio = filtrados.length ? ingresos / filtrados.length : 0;
  const conCupon = filtrados.filter((o) => !!o.couponCode).length;
  const sinCupon = filtrados.length - conCupon;

  // Porcentajes para los anillos de progreso de las tarjetas de estadística
  // en móvil: % de pedidos con cupón, y qué fracción de los ingresos se fue
  // en descuentos.
  const pctConCupon = filtrados.length ? Math.round((conCupon / filtrados.length) * 100) : 0;
  const pctDescuentos = ingresos ? Math.round((descuentos / ingresos) * 100) : 0;

  const inicio = (pagina - 1) * PEDIDOS_POR_PAGINA;
  const pedidosPagina = filtrados.slice(inicio, inicio + PEDIDOS_POR_PAGINA);

  const limpiarFiltros = () => {
    setFechaDesde('');
    setFechaHasta('');
    setSoloConCupon(false);
    setPagina(1);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestión de pedidos"
        title="Pedidos registrados"
        description="Revisa los pedidos realizados por los clientes, filtra por fecha o cupón, y consulta ingresos y descuentos aplicados."
      />

      <div className="grid grid-cols-2 gap-3 mb-6 lg:hidden">
        <StatCardMobile
          icon={<PedidosIcon className="w-5 h-5" />}
          percent={pctConCupon}
          label="Total pedidos"
          value={filtrados.length}
        />
        <StatCardMobile
          icon={<DollarIcon className="w-5 h-5" />}
          percent={100}
          label="Ingresos"
          value={formatoMoneda(ingresos)}
          highlighted
        />
        <StatCardMobile
          icon={<CuponesIcon className="w-5 h-5" />}
          percent={pctDescuentos}
          label="Descuentos"
          value={formatoMoneda(descuentos)}
        />
        <StatCardMobile
          icon={<BarsIcon className="w-5 h-5" />}
          percent={100}
          label="Ticket promedio"
          value={formatoMoneda(promedio)}
        />
      </div>

      <KpiRow>
        <KpiCard
          label="Total pedidos"
          value={filtrados.length}
          note="Pedidos registrados"
          iconBg="bg-ink/5"
          iconColor="text-ink"
          icon={<PedidosIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Ingresos"
          value={formatoMoneda(ingresos)}
          note="Total facturado"
          valueClassName="text-sky"
          iconBg="bg-sky/15"
          iconColor="text-sky"
          icon={<DollarIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Descuentos"
          value={formatoMoneda(descuentos)}
          note="Aplicados con cupón"
          valueClassName="text-coral"
          iconBg="bg-coral/15"
          iconColor="text-coral"
          icon={<CuponesIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Ticket promedio"
          value={formatoMoneda(promedio)}
          note="Por pedido"
          valueClassName="text-ink"
          iconBg="bg-[#eef0f4]"
          iconColor="text-muted"
          icon={<BarsIcon className="w-5 h-5" />}
        />
      </KpiRow>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="glass p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wide">Filtros</h3>
              <button type="button" onClick={limpiarFiltros} className="glass-button px-3 py-1.5 rounded-full text-xs font-medium">
                Limpiar
              </button>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Rango de fechas</h4>
              <div className="space-y-2">
                <input
                  type="date"
                  aria-label="Desde"
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value);
                    setPagina(1);
                  }}
                  className="glass-input w-full px-3 py-2 rounded-full text-sm"
                />
                <input
                  type="date"
                  aria-label="Hasta"
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value);
                    setPagina(1);
                  }}
                  className="glass-input w-full px-3 py-2 rounded-full text-sm"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-white/70">
              <Switch
                checked={soloConCupon}
                onChange={(v) => {
                  setSoloConCupon(v);
                  setPagina(1);
                }}
                label="Solo con cupón"
              />
            </div>
          </div>

          <div className="mt-6">
            <DonutChart
              title="Uso de cupones"
              centerCaption="Con cupón"
              groups={[
                { label: 'Con cupón', count: conCupon, color: '#e2766f' },
                { label: 'Sin cupón', count: sinCupon, color: '#c3c8d4' },
              ]}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <div className="glass p-6 md:p-8">
            <div className="glass-toolbar flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-ink flex items-center">
                <PedidosIcon className="w-5 h-5 mr-2 text-coral" />
                Pedidos
              </h2>
            </div>
            <div className="glass-inset overflow-x-auto rounded-[22px]">
              <table className="glass-table min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Productos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Cupón</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Descuento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted">Cargando...</td>
                    </tr>
                  ) : pedidosPagina.length ? (
                    pedidosPagina.map((o) => {
                      const productosPlano = (o.items || []).map((i) => `${i.cantidad}× ${i.name}`).join(', ');
                      return (
                        <tr key={o._id}>
                          <td className="p-3 pl-6 text-[#3a3d45]">
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
                          <td className="p-3 text-[#3a3d45] max-w-xs truncate" title={productosPlano}>
                            {productosPlano}
                          </td>
                          <td className="p-3">
                            {o.couponCode ? <span className="status bg-coral">{o.couponCode}</span> : '—'}
                          </td>
                          <td className="p-3 text-[#3a3d45]">{o.discount ? `-${formatoMoneda(o.discount)}` : '—'}</td>
                          <td className="p-3 font-semibold text-ink">{formatoMoneda(o.total)}</td>
                          <td className="p-3 text-[#3a3d45]">{formatoFechaCorta(o.createdAt)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted">Todavía no hay pedidos registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination totalItems={filtrados.length} porPagina={PEDIDOS_POR_PAGINA} paginaActiva={pagina} onChange={setPagina} />
          </div>
        </div>
      </div>
    </div>
  );
}

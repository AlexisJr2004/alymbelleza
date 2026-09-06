import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
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

      <KpiRow>
        <KpiCard
          label="Total pedidos"
          value={filtrados.length}
          note="Pedidos registrados"
          iconBg="bg-purple-100/70"
          iconColor="text-purple-600"
          icon={<PedidosIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Ingresos"
          value={formatoMoneda(ingresos)}
          note="Total facturado"
          valueClassName="text-emerald-700"
          iconBg="bg-emerald-100/70"
          iconColor="text-emerald-600"
          icon={<DollarIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Descuentos"
          value={formatoMoneda(descuentos)}
          note="Aplicados con cupón"
          valueClassName="text-pink-700"
          iconBg="bg-pink-100/70"
          iconColor="text-pink-600"
          icon={<CuponesIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Ticket promedio"
          value={formatoMoneda(promedio)}
          note="Por pedido"
          valueClassName="text-sky-700"
          iconBg="bg-sky-100/70"
          iconColor="text-sky-600"
          icon={<BarsIcon className="w-5 h-5" />}
        />
      </KpiRow>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Filtros</h3>
              <button type="button" onClick={limpiarFiltros} className="text-xs font-medium text-purple-600 hover:text-purple-800">
                Limpiar
              </button>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rango de fechas</h4>
              <div className="space-y-2">
                <input
                  type="date"
                  aria-label="Desde"
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
                <input
                  type="date"
                  aria-label="Hasta"
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
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
                { label: 'Con cupón', count: conCupon, color: '#db2777' },
                { label: 'Sin cupón', count: sinCupon, color: '#e5e7eb' },
              ]}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <PedidosIcon className="w-5 h-5 mr-2 text-purple-600" />
                Pedidos
              </h2>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cupón</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">Cargando...</td>
                    </tr>
                  ) : pedidosPagina.length ? (
                    pedidosPagina.map((o) => {
                      const productosPlano = (o.items || []).map((i) => `${i.cantidad}× ${i.name}`).join(', ');
                      return (
                        <tr key={o._id}>
                          <td className="p-3 pl-6">
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
                          <td className="p-3 max-w-xs truncate" title={productosPlano}>
                            {productosPlano}
                          </td>
                          <td className="p-3">
                            {o.couponCode ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-700">{o.couponCode}</span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="p-3">{o.discount ? `-${formatoMoneda(o.discount)}` : '—'}</td>
                          <td className="p-3 font-semibold text-purple-700">{formatoMoneda(o.total)}</td>
                          <td className="p-3">{formatoFechaCorta(o.createdAt)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">Todavía no hay pedidos registrados.</td>
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

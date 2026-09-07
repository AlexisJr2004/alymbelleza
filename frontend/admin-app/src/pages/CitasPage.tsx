import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
import Switch from '../components/ui/Switch';
import Pagination from '../components/ui/Pagination';
import { CitasIcon, ClockIcon, CheckIcon, XCircleIcon } from '../components/icons';
import { useAppointmentsQuery, useUpdateAppointmentStatus } from '../hooks/useAppointments';
import { useSwitchFilter } from '../hooks/useSwitchFilter';
import { filtrarPorRangoDeFechas } from '../lib/filters';
import { formatoFechaCorta } from '../lib/format';
import { computeConicGradient } from '../lib/donut';
import { notifyError } from '../lib/sweetalert';

const CITAS_POR_PAGINA = 8;

const ESTADO_BADGE: Record<string, string> = {
  realizada: 'bg-emerald-100 text-emerald-700',
  cancelada: 'bg-rose-100 text-rose-700',
  pendiente: 'bg-amber-100 text-amber-700',
};

const ESTADO_LABEL: Record<string, string> = {
  realizada: 'Realizada',
  cancelada: 'Cancelada',
  pendiente: 'Pendiente',
};

export default function CitasPage() {
  const { data: citas = [], isLoading } = useAppointmentsQuery();
  const cambiarEstado = useUpdateAppointmentStatus();

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const estadoFiltro = useSwitchFilter();
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    let lista = filtrarPorRangoDeFechas(citas, (c) => c.date, fechaDesde, fechaHasta);
    if (estadoFiltro.selected.size) {
      lista = lista.filter((c) => estadoFiltro.selected.has(c.status || 'pendiente'));
    }
    return lista;
  }, [citas, fechaDesde, fechaHasta, estadoFiltro.selected]);

  const pendientes = filtrados.filter((c) => (c.status || 'pendiente') === 'pendiente').length;
  const realizadas = filtrados.filter((c) => c.status === 'realizada').length;
  const canceladas = filtrados.filter((c) => c.status === 'cancelada').length;

  const donut = computeConicGradient([
    { label: 'Pendientes', count: pendientes, color: '#f59e0b' },
    { label: 'Realizadas', count: realizadas, color: '#10b981' },
    { label: 'Canceladas', count: canceladas, color: '#f43f5e' },
  ]);
  const centerPct = donut.total > 0 ? Math.round((realizadas / donut.total) * 100) : 0;

  const inicio = (pagina - 1) * CITAS_POR_PAGINA;
  const citasPagina = filtrados.slice(inicio, inicio + CITAS_POR_PAGINA);

  const limpiarFiltros = () => {
    setFechaDesde('');
    setFechaHasta('');
    estadoFiltro.clear();
    setPagina(1);
  };

  const handleCambiarEstado = async (id: string, status: 'realizada' | 'cancelada') => {
    try {
      await cambiarEstado.mutateAsync({ id, status });
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo actualizar la cita.');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestión de citas"
        title="Citas registradas"
        description="Revisa las citas agendadas por los clientes, filtra por fecha o estado, y marca cada una como realizada o cancelada."
      />

      <KpiRow>
        <KpiCard
          label="Total citas"
          value={filtrados.length}
          note="Citas registradas"
          iconBg="bg-purple-100/70"
          iconColor="text-purple-600"
          icon={<CitasIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Pendientes"
          value={pendientes}
          note="Por atender"
          valueClassName="text-amber-700"
          iconBg="bg-amber-100/70"
          iconColor="text-amber-600"
          icon={<ClockIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Realizadas"
          value={realizadas}
          note="Atendidas"
          valueClassName="text-emerald-700"
          iconBg="bg-emerald-100/70"
          iconColor="text-emerald-600"
          icon={<CheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Canceladas"
          value={canceladas}
          note="No atendidas"
          valueClassName="text-rose-700"
          iconBg="bg-rose-100/70"
          iconColor="text-rose-600"
          icon={<XCircleIcon className="w-5 h-5" />}
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
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Estado</h4>
              <Switch checked={estadoFiltro.isChecked('pendiente')} onChange={(v) => { estadoFiltro.toggle('pendiente', v); setPagina(1); }} label="Pendientes" />
              <Switch checked={estadoFiltro.isChecked('realizada')} onChange={(v) => { estadoFiltro.toggle('realizada', v); setPagina(1); }} label="Realizadas" />
              <Switch checked={estadoFiltro.isChecked('cancelada')} onChange={(v) => { estadoFiltro.toggle('cancelada', v); setPagina(1); }} label="Canceladas" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-5 mt-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Distribución de citas</h3>
            <div className="flex justify-center">
              <div className="relative">
                <div className="relative w-32 h-32 rounded-full" style={{ background: donut.background }}>
                  <div className="absolute inset-[13px] bg-white rounded-full" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold text-gray-900">{centerPct}%</span>
                  <span className="text-[10px] text-gray-500">Realizadas</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {donut.total === 0 ? (
                <p className="text-sm text-gray-400 text-center">Sin datos todavía.</p>
              ) : (
                [
                  { label: 'Pendientes', count: pendientes, color: '#f59e0b' },
                  { label: 'Realizadas', count: realizadas, color: '#10b981' },
                  { label: 'Canceladas', count: canceladas, color: '#f43f5e' },
                ].map((g) => (
                  <div key={g.label} className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
                    <span className="text-gray-600">{g.label}</span>
                    <span className="ml-auto font-medium text-gray-800">{g.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <CitasIcon className="w-5 h-5 mr-2 text-purple-600" />
                Citas
              </h2>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-400">Cargando...</td>
                    </tr>
                  ) : citasPagina.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-400">No hay citas registradas.</td>
                    </tr>
                  ) : (
                    citasPagina.map((c) => {
                      const estado = c.status || 'pendiente';
                      const pendienteAccion = cambiarEstado.isPending && cambiarEstado.variables?.id === c._id;
                      return (
                        <tr key={c._id}>
                          <td className="p-3 pl-6">
                            {c.user ? (
                              <>
                                {c.user.name || 'Cliente'}
                                <br />
                                <span className="text-xs text-gray-400">{c.user.email || ''}</span>
                              </>
                            ) : (
                              'Cliente eliminado'
                            )}
                          </td>
                          <td className="p-3">{formatoFechaCorta(c.date)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ESTADO_BADGE[estado]}`}>
                              {ESTADO_LABEL[estado]}
                            </span>
                          </td>
                          <td className="p-3 text-right pr-6">
                            {estado === 'pendiente' ? (
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  type="button"
                                  disabled={pendienteAccion}
                                  onClick={() => handleCambiarEstado(c._id, 'realizada')}
                                  title="Marcar como realizada"
                                  className="text-emerald-600 hover:text-emerald-800 p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 transition disabled:opacity-60"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  disabled={pendienteAccion}
                                  onClick={() => handleCambiarEstado(c._id, 'cancelada')}
                                  title="Cancelar"
                                  className="text-rose-600 hover:text-rose-800 p-2 rounded-full bg-rose-50 hover:bg-rose-100 transition disabled:opacity-60"
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-300 text-sm">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <Pagination totalItems={filtrados.length} porPagina={CITAS_POR_PAGINA} paginaActiva={pagina} onChange={setPagina} />
          </div>
        </div>
      </div>
    </div>
  );
}

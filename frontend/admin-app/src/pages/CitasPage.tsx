import FilterPanel from '../components/ui/FilterPanel';
import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
import StatCardMobile from '../components/ui/StatCardMobile';
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
  realizada: 'bg-sky',
  cancelada: 'bg-muted',
  pendiente: 'bg-coral',
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
    { label: 'Pendientes', count: pendientes, color: '#e2766f' },
    { label: 'Realizadas', count: realizadas, color: '#7e9ce3' },
    { label: 'Canceladas', count: canceladas, color: '#c3c8d4' },
  ]);
  const centerPct = donut.total > 0 ? Math.round((realizadas / donut.total) * 100) : 0;

  // Porcentajes para los anillos de progreso de las tarjetas de estadística
  // en móvil (Realizadas reusa centerPct, ya es la misma fracción).
  const pctPendientes = filtrados.length ? Math.round((pendientes / filtrados.length) * 100) : 0;
  const pctCanceladas = filtrados.length ? Math.round((canceladas / filtrados.length) * 100) : 0;

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

      <div className="grid grid-cols-2 gap-3 mb-4 lg:hidden">
        <StatCardMobile
          icon={<CitasIcon className="w-5 h-5" />}
          percent={100}
          label="Total citas"
          value={filtrados.length}
        />
        <StatCardMobile
          icon={<ClockIcon className="w-5 h-5" />}
          percent={pctPendientes}
          label="Pendientes"
          value={pendientes}
          highlighted
        />
        <StatCardMobile
          icon={<CheckIcon className="w-5 h-5" />}
          percent={centerPct}
          label="Realizadas"
          value={realizadas}
        />
        <StatCardMobile
          icon={<XCircleIcon className="w-5 h-5" />}
          percent={pctCanceladas}
          label="Canceladas"
          value={canceladas}
        />
      </div>

      <KpiRow>
        <KpiCard
          label="Total citas"
          value={filtrados.length}
          note="Citas registradas"
          iconBg="bg-ink/5"
          iconColor="text-ink"
          icon={<CitasIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Pendientes"
          value={pendientes}
          note="Por atender"
          valueClassName="text-coral"
          iconBg="bg-coral/15"
          iconColor="text-coral"
          icon={<ClockIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Realizadas"
          value={realizadas}
          note="Atendidas"
          valueClassName="text-sky"
          iconBg="bg-sky/15"
          iconColor="text-sky"
          icon={<CheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Canceladas"
          value={canceladas}
          note="No atendidas"
          valueClassName="text-muted"
          iconBg="bg-[#eef0f4]"
          iconColor="text-muted"
          icon={<XCircleIcon className="w-5 h-5" />}
        />
      </KpiRow>

      <div className="flex flex-col lg:flex-row items-start gap-4">
        <FilterPanel>
          <div className="admin-panel p-4 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wide">Filtros</h3>
              <button type="button" onClick={limpiarFiltros} className="text-xs font-medium text-coral hover:text-coral/80">
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
                  className="w-full px-3 py-1.5 border border-white/80 bg-white/60 rounded-full text-sm focus:ring-2 focus:ring-sky/50 focus:outline-none"
                />
                <input
                  type="date"
                  aria-label="Hasta"
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-1.5 border border-white/80 bg-white/60 rounded-full text-sm focus:ring-2 focus:ring-sky/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-white/70 space-y-2">
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Estado</h4>
              <Switch checked={estadoFiltro.isChecked('pendiente')} onChange={(v) => { estadoFiltro.toggle('pendiente', v); setPagina(1); }} label="Pendientes" />
              <Switch checked={estadoFiltro.isChecked('realizada')} onChange={(v) => { estadoFiltro.toggle('realizada', v); setPagina(1); }} label="Realizadas" />
              <Switch checked={estadoFiltro.isChecked('cancelada')} onChange={(v) => { estadoFiltro.toggle('cancelada', v); setPagina(1); }} label="Canceladas" />
            </div>
          </div>

          <div className="admin-panel p-4 mt-6">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">Distribución de citas</h3>
            <div className="flex justify-center">
              <div className="relative">
                <div className="relative w-32 h-32 rounded-full" style={{ background: donut.background }}>
                  <div className="absolute inset-[13px] bg-white rounded-full" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold text-ink">{centerPct}%</span>
                  <span className="text-[10px] text-muted">Realizadas</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {donut.total === 0 ? (
                <p className="text-sm text-muted text-center">Sin datos todavía.</p>
              ) : (
                [
                  { label: 'Pendientes', count: pendientes, color: '#e2766f' },
                  { label: 'Realizadas', count: realizadas, color: '#7e9ce3' },
                  { label: 'Canceladas', count: canceladas, color: '#c3c8d4' },
                ].map((g) => (
                  <div key={g.label} className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
                    <span className="text-[#3a3d45]">{g.label}</span>
                    <span className="ml-auto font-medium text-ink">{g.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </FilterPanel>

        <div className="flex-1 min-w-0 w-full">
          <div className="admin-panel p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold text-ink flex items-center">
                <CitasIcon className="w-5 h-5 mr-2 text-coral" />
                Citas
              </h2>
            </div>
            <div className="overflow-x-auto rounded-[22px] border border-white/70">
              <table className="admin-table min-w-full divide-y divide-white/70">
                <thead className="bg-white/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white/20 divide-y divide-white/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted">Cargando...</td>
                    </tr>
                  ) : citasPagina.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted">No hay citas registradas.</td>
                    </tr>
                  ) : (
                    citasPagina.map((c) => {
                      const estado = c.status || 'pendiente';
                      const pendienteAccion = cambiarEstado.isPending && cambiarEstado.variables?.id === c._id;
                      return (
                        <tr key={c._id}>
                          <td className="p-3 pl-6 text-[#3a3d45]">
                            {c.user ? (
                              <>
                                {c.user.name || 'Cliente'}
                                <br />
                                <span className="text-xs text-muted">{c.user.email || ''}</span>
                              </>
                            ) : (
                              'Cliente eliminado'
                            )}
                          </td>
                          <td className="p-3 text-[#3a3d45]">{formatoFechaCorta(c.date)}</td>
                          <td className="p-3">
                            <span className={`status ${ESTADO_BADGE[estado]}`}>{ESTADO_LABEL[estado]}</span>
                          </td>
                          <td className="p-3 text-right pr-6">
                            {estado === 'pendiente' ? (
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  type="button"
                                  disabled={pendienteAccion}
                                  onClick={() => handleCambiarEstado(c._id, 'realizada')}
                                  title="Marcar como realizada"
                                  className="text-sky hover:text-sky/70 p-2 rounded-full bg-sky/10 hover:bg-sky/20 transition disabled:opacity-60"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  disabled={pendienteAccion}
                                  onClick={() => handleCambiarEstado(c._id, 'cancelada')}
                                  title="Cancelar"
                                  className="text-coral hover:text-coral/70 p-2 rounded-full bg-coral/10 hover:bg-coral/20 transition disabled:opacity-60"
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted/70 text-sm">—</span>
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

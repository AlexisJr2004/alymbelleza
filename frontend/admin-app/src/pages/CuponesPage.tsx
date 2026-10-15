import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
import StatCardMobile from '../components/ui/StatCardMobile';
import Switch from '../components/ui/Switch';
import DonutChart from '../components/ui/DonutChart';
import CrudModal from '../components/ui/CrudModal';
import CouponForm from '../components/forms/CouponForm';
import { CuponesIcon, CheckIcon, XIcon, PlusIcon, PencilIcon, TrashIcon, SearchIcon, BellIcon } from '../components/icons';
import { useCouponsQuery, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '../hooks/useCoupons';
import { useSwitchFilter } from '../hooks/useSwitchFilter';
import { confirmAction, notifyError, notifySuccess } from '../lib/sweetalert';
import type { Coupon } from '../types/models';
import type { CouponPayload } from '../hooks/useCoupons';

const TREINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

export default function CuponesPage() {
  const { data: cupones = [], isLoading } = useCouponsQuery();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [search, setSearch] = useState('');
  const tipoFiltro = useSwitchFilter();
  const estadoFiltro = useSwitchFilter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // KPIs y donut sobre el total, igual que el panel viejo — solo la tabla se filtra.
  const activos = cupones.filter((c) => !!c.active).length;
  const inactivos = cupones.length - activos;
  const vencenPronto = useMemo(() => {
    const ahora = Date.now();
    return cupones.filter((c) => {
      if (!c.active || !c.expiresAt) return false;
      const t = new Date(c.expiresAt).getTime();
      return t >= ahora && t <= ahora + TREINTA_DIAS_MS;
    }).length;
  }, [cupones]);

  // Porcentajes para los anillos de progreso de las tarjetas de estadística
  // en móvil, todos como fracción del total de cupones.
  const pctActivos = cupones.length ? Math.round((activos / cupones.length) * 100) : 0;
  const pctInactivos = cupones.length ? Math.round((inactivos / cupones.length) * 100) : 0;
  const pctVencenPronto = cupones.length ? Math.round((vencenPronto / cupones.length) * 100) : 0;

  const filtrados = useMemo(() => {
    const texto = search.trim().toLowerCase();
    let lista = cupones.filter((c) => c.code.toLowerCase().includes(texto));
    if (tipoFiltro.selected.size) lista = lista.filter((c) => tipoFiltro.selected.has(c.type));
    if (estadoFiltro.selected.size) lista = lista.filter((c) => estadoFiltro.selected.has(String(!!c.active)));
    return lista;
  }, [cupones, search, tipoFiltro.selected, estadoFiltro.selected]);

  const limpiarFiltros = () => {
    setSearch('');
    tipoFiltro.clear();
    estadoFiltro.clear();
  };

  const abrirNuevo = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };
  const abrirEditar = (cupon: Coupon) => {
    setEditingCoupon(cupon);
    setModalOpen(true);
  };
  const cerrarModal = () => setModalOpen(false);

  const guardando = createCoupon.isPending || updateCoupon.isPending;

  const handleSubmit = async (payload: CouponPayload) => {
    try {
      if (editingCoupon) {
        await updateCoupon.mutateAsync({ id: editingCoupon._id, payload });
      } else {
        await createCoupon.mutateAsync(payload);
      }
      cerrarModal();
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo guardar el cupón.');
    }
  };

  const handleDelete = async (cupon: Coupon) => {
    const confirmed = await confirmAction({
      title: '¿Eliminar cupón?',
      text: 'Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
    });
    if (!confirmed) return;
    try {
      await deleteCoupon.mutateAsync(cupon._id);
      notifySuccess('Eliminado', 'El cupón ha sido eliminado.');
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo eliminar el cupón.');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestión de cupones"
        title="Cupones registrados"
        description="Crea y administra los códigos de descuento de Bella Beauty. Filtra por tipo, estado o vencimiento."
        action={
          <button
            type="button"
            onClick={abrirNuevo}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white rounded-full text-sm font-medium hover:bg-ink/85 transition-colors shrink-0"
          >
            <PlusIcon className="w-4 h-4" /> Nuevo Cupón
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 mb-6 lg:hidden">
        <StatCardMobile
          icon={<CuponesIcon className="w-5 h-5" />}
          iconBg="bg-ink/5"
          iconColor="text-ink"
          ringColor="#16181d"
          percent={100}
          label="Total cupones"
          value={cupones.length}
        />
        <StatCardMobile
          icon={<CheckIcon className="w-5 h-5" />}
          iconBg="bg-sky/15"
          iconColor="text-sky"
          ringColor="#7e9ce3"
          percent={pctActivos}
          label="Activos"
          value={activos}
        />
        <StatCardMobile
          icon={<XIcon className="w-5 h-5" />}
          iconBg="bg-[#eef0f4]"
          iconColor="text-muted"
          ringColor="#8a8f9a"
          percent={pctInactivos}
          label="Inactivos"
          value={inactivos}
        />
        <StatCardMobile
          icon={<BellIcon className="w-5 h-5" />}
          iconBg="bg-coral/15"
          iconColor="text-coral"
          ringColor="#e2766f"
          percent={pctVencenPronto}
          label="Vencen pronto"
          value={vencenPronto}
        />
      </div>

      <KpiRow>
        <KpiCard
          label="Total cupones"
          value={cupones.length}
          note="Creados en total"
          iconBg="bg-ink/5"
          iconColor="text-ink"
          icon={<CuponesIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Activos"
          value={activos}
          note="Disponibles para usar"
          valueClassName="text-sky"
          iconBg="bg-sky/15"
          iconColor="text-sky"
          icon={<CheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Inactivos"
          value={inactivos}
          note="Deshabilitados"
          valueClassName="text-muted"
          iconBg="bg-[#eef0f4]"
          iconColor="text-muted"
          icon={<XIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Vencen pronto"
          value={vencenPronto}
          note="En los próximos 30 días"
          valueClassName="text-coral"
          iconBg="bg-coral/15"
          iconColor="text-coral"
          icon={<BellIcon className="w-5 h-5" />}
        />
      </KpiRow>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="glass p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wide">Filtros</h3>
              <button type="button" onClick={limpiarFiltros} className="text-xs font-medium text-coral hover:text-coral/80">
                Limpiar
              </button>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Tipo de descuento</h4>
              <div className="space-y-2">
                <Switch checked={tipoFiltro.isChecked('percentage')} onChange={(v) => tipoFiltro.toggle('percentage', v)} label="Porcentaje" />
                <Switch checked={tipoFiltro.isChecked('fixed')} onChange={(v) => tipoFiltro.toggle('fixed', v)} label="Monto fijo" />
              </div>
            </div>
            <div className="pt-4 border-t border-white/70">
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Estado</h4>
              <div className="space-y-2">
                <Switch checked={estadoFiltro.isChecked('true')} onChange={(v) => estadoFiltro.toggle('true', v)} label="Activos" />
                <Switch checked={estadoFiltro.isChecked('false')} onChange={(v) => estadoFiltro.toggle('false', v)} label="Inactivos" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <DonutChart
              title="Distribución"
              centerCaption="Activos"
              groups={[
                { label: 'Activos', count: activos, color: '#7e9ce3' },
                { label: 'Inactivos', count: inactivos, color: '#e2766f' },
              ]}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <div className="glass p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-ink flex items-center">
                <CuponesIcon className="w-5 h-5 mr-2 text-coral" />
                Cupones
              </h2>
              <div className="relative">
                <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por código..."
                  className="pl-10 pr-4 py-2 border border-white/80 bg-white/60 rounded-full focus:ring-2 focus:ring-sky/50 focus:border-transparent focus:outline-none w-full md:w-72"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-[22px] border border-white/70">
              <table className="min-w-full divide-y divide-white/70">
                <thead className="bg-white/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Descuento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Compra mínima</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Expira</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white/20 divide-y divide-white/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted">Cargando...</td>
                    </tr>
                  ) : filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted">No hay cupones creados todavía.</td>
                    </tr>
                  ) : (
                    filtrados.map((c) => {
                      const descuentoTexto = c.type === 'percentage' ? `${c.value}%` : `$${Number(c.value).toFixed(2)}`;
                      const expira = c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('es-ES') : 'Sin vencimiento';
                      return (
                        <tr key={c._id}>
                          <td className="p-3 pl-6 font-semibold text-ink">{c.code}</td>
                          <td className="p-3 text-[#3a3d45]">{descuentoTexto}</td>
                          <td className="p-3 text-[#3a3d45]">{c.minPurchase ? `$${Number(c.minPurchase).toFixed(2)}` : '—'}</td>
                          <td className="p-3 text-[#3a3d45]">{expira}</td>
                          <td className="p-3">
                            {c.active ? (
                              <span className="status bg-sky">Activo</span>
                            ) : (
                              <span className="status bg-muted">Inactivo</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                type="button"
                                title="Editar"
                                onClick={() => abrirEditar(c)}
                                className="text-sky hover:text-sky/70 p-2 rounded-full bg-sky/10 hover:bg-sky/20 transition"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                title="Eliminar"
                                onClick={() => handleDelete(c)}
                                className="text-coral hover:text-coral/70 p-2 rounded-full bg-coral/10 hover:bg-coral/20 transition"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CrudModal open={modalOpen} title={editingCoupon ? 'Editar Cupón' : 'Nuevo Cupón'} onClose={cerrarModal} maxWidth="md:max-w-lg">
        <CouponForm
          key={editingCoupon?._id ?? 'nuevo'}
          initialData={editingCoupon}
          onSubmit={handleSubmit}
          onCancel={cerrarModal}
          submitting={guardando}
        />
      </CrudModal>
    </div>
  );
}

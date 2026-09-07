import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors shrink-0"
          >
            <PlusIcon className="w-4 h-4" /> Nuevo Cupón
          </button>
        }
      />

      <KpiRow>
        <KpiCard
          label="Total cupones"
          value={cupones.length}
          note="Creados en total"
          iconBg="bg-purple-100/70"
          iconColor="text-purple-600"
          icon={<CuponesIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Activos"
          value={activos}
          note="Disponibles para usar"
          valueClassName="text-emerald-700"
          iconBg="bg-emerald-100/70"
          iconColor="text-emerald-600"
          icon={<CheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Inactivos"
          value={inactivos}
          note="Deshabilitados"
          valueClassName="text-rose-700"
          iconBg="bg-rose-100/70"
          iconColor="text-rose-600"
          icon={<XIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Vencen pronto"
          value={vencenPronto}
          note="En los próximos 30 días"
          valueClassName="text-amber-700"
          iconBg="bg-amber-100/70"
          iconColor="text-amber-600"
          icon={<BellIcon className="w-5 h-5" />}
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
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tipo de descuento</h4>
              <div className="space-y-2">
                <Switch checked={tipoFiltro.isChecked('percentage')} onChange={(v) => tipoFiltro.toggle('percentage', v)} label="Porcentaje" />
                <Switch checked={tipoFiltro.isChecked('fixed')} onChange={(v) => tipoFiltro.toggle('fixed', v)} label="Monto fijo" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Estado</h4>
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
                { label: 'Activos', count: activos, color: '#059669' },
                { label: 'Inactivos', count: inactivos, color: '#e11d48' },
              ]}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <CuponesIcon className="w-5 h-5 mr-2 text-purple-600" />
                Cupones
              </h2>
              <div className="relative">
                <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por código..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-72"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compra mínima</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expira</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">Cargando...</td>
                    </tr>
                  ) : filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">No hay cupones creados todavía.</td>
                    </tr>
                  ) : (
                    filtrados.map((c) => {
                      const descuentoTexto = c.type === 'percentage' ? `${c.value}%` : `$${Number(c.value).toFixed(2)}`;
                      const expira = c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('es-ES') : 'Sin vencimiento';
                      return (
                        <tr key={c._id}>
                          <td className="p-2 font-semibold">{c.code}</td>
                          <td className="p-2">{descuentoTexto}</td>
                          <td className="p-2">{c.minPurchase ? `$${Number(c.minPurchase).toFixed(2)}` : '—'}</td>
                          <td className="p-2">{expira}</td>
                          <td className="p-2">
                            {c.active ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Activo</span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Inactivo</span>
                            )}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                type="button"
                                title="Editar"
                                onClick={() => abrirEditar(c)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                title="Eliminar"
                                onClick={() => handleDelete(c)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
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

      <CrudModal open={modalOpen} title={editingCoupon ? 'Editar Cupón' : 'Nuevo Cupón'} onClose={cerrarModal} maxWidth="max-w-lg">
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

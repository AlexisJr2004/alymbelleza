import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import CrudModal from '../components/ui/CrudModal';
import { computeConicGradient } from '../lib/donut';
import PaymentCardForm from '../components/forms/PaymentCardForm';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from '../components/icons';
import {
  usePaymentCardsQuery,
  useCreatePaymentCard,
  useUpdatePaymentCard,
  useDeletePaymentCard,
} from '../hooks/usePaymentCards';
import { confirmAction, notifyError, notifySuccess } from '../lib/sweetalert';
import type { PaymentCard } from '../types/models';
import type { PaymentCardPayload } from '../hooks/usePaymentCards';

const RESUMEN_TARJETA_ESTILOS = [
  'from-emerald-500 to-emerald-600',
  'from-violet-500 to-purple-600',
  'from-orange-400 to-orange-500',
  'from-sky-400 to-blue-500',
];
const DONUT_COLORES = ['#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#14b8a6'];

export default function TarjetasPage() {
  const { data: tarjetas = [], isLoading } = usePaymentCardsQuery();
  const createCard = useCreatePaymentCard();
  const updateCard = useUpdatePaymentCard();
  const deleteCard = useDeletePaymentCard();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<PaymentCard | null>(null);

  const filtradas = useMemo(() => {
    const texto = search.trim().toLowerCase();
    return tarjetas.filter(
      (c) =>
        (c.banco || '').toLowerCase().includes(texto) ||
        (c.numeroCuenta || '').toLowerCase().includes(texto) ||
        (c.titular || '').toLowerCase().includes(texto)
    );
  }, [tarjetas, search]);

  const donutGroups = useMemo(() => {
    const conteoPorBanco = new Map<string, number>();
    tarjetas.forEach((c) => conteoPorBanco.set(c.banco, (conteoPorBanco.get(c.banco) || 0) + 1));
    return Array.from(conteoPorBanco.entries()).map(([banco, count], i) => ({
      label: banco,
      count,
      color: DONUT_COLORES[i % DONUT_COLORES.length],
    }));
  }, [tarjetas]);

  const abrirNueva = () => {
    setEditingCard(null);
    setModalOpen(true);
  };
  const abrirEditar = (card: PaymentCard) => {
    setEditingCard(card);
    setModalOpen(true);
  };
  const cerrarModal = () => setModalOpen(false);

  const guardando = createCard.isPending || updateCard.isPending;

  const handleSubmit = async (payload: PaymentCardPayload) => {
    try {
      if (editingCard) {
        await updateCard.mutateAsync({ id: editingCard._id, payload });
      } else {
        await createCard.mutateAsync(payload);
      }
      cerrarModal();
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo guardar la tarjeta.');
    }
  };

  const handleDelete = async (card: PaymentCard) => {
    const confirmed = await confirmAction({
      title: '¿Eliminar tarjeta?',
      text: 'Dejará de mostrarse en la página de pagos.',
      confirmText: 'Sí, eliminar',
    });
    if (!confirmed) return;
    try {
      await deleteCard.mutateAsync(card._id);
      notifySuccess('Eliminada', 'La tarjeta ha sido eliminada.');
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo eliminar la tarjeta.');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestión de pagos"
        title="Centro de Tarjetas"
        description="Administra las cuentas bancarias que los clientes ven en la pasarela de pagos al finalizar su compra. Desde aquí puedes agregar, editar o desactivar una cuenta, y revisar cuántas hay activas por banco."
        action={
          <button
            type="button"
            onClick={abrirNueva}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors shrink-0"
          >
            <PlusIcon className="w-4 h-4" /> Tarjeta nueva
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {isLoading ? null : tarjetas.length === 0 ? (
          <p className="sm:col-span-2 xl:col-span-4 text-center text-gray-400 py-6">No hay tarjetas de pago creadas todavía.</p>
        ) : (
          tarjetas.map((c, i) => (
            <div
              key={c._id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${RESUMEN_TARJETA_ESTILOS[i % RESUMEN_TARJETA_ESTILOS.length]} p-5 text-white`}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-sm font-medium text-white/80">{c.banco}</p>
                <p className="text-xl font-bold mt-1 tracking-wide">{c.numeroCuenta}</p>
                <div className="flex items-center gap-1.5 mt-4">
                  <span className="w-6 h-6 rounded-full bg-white/50" />
                  <span className="w-6 h-6 rounded-full bg-white/25 -ml-3" />
                  <span className="text-xs font-semibold ml-2 uppercase tracking-wide">{c.marca}</span>
                </div>
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/20">
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/70 uppercase tracking-wide">Tipo de cuenta</p>
                    <p className="text-sm font-semibold mt-0.5 truncate">{c.tipoCuenta}</p>
                  </div>
                  <div className="text-right min-w-0">
                    <p className="text-[10px] text-white/70 uppercase tracking-wide">Titular</p>
                    <p className="text-sm font-semibold mt-0.5 truncate">{c.titular}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1">
            <h3 className="text-lg font-bold text-gray-800">Lista de tarjetas</h3>
            <div className="relative">
              <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por banco, cuenta o titular..."
                className="pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">Todas las cuentas bancarias registradas.</p>
          <div className="divide-y divide-gray-100">
            {filtradas.length === 0 ? (
              <p className="text-center text-gray-400 py-6">No se encontraron tarjetas de pago.</p>
            ) : (
              filtradas.map((c) => {
                const indiceOriginal = tarjetas.indexOf(c);
                const estilo = RESUMEN_TARJETA_ESTILOS[indiceOriginal % RESUMEN_TARJETA_ESTILOS.length];
                return (
                  <div key={c._id} className="flex flex-wrap items-center gap-4 py-3.5">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${estilo} shrink-0`} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 min-w-[200px] text-sm">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">Banco</p>
                        <p className="font-medium text-gray-800 truncate">{c.banco}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">Tipo</p>
                        <p className="font-medium text-gray-800 truncate">{c.tipoCuenta}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">Número de cuenta</p>
                        <p className="font-medium text-gray-800 truncate">{c.numeroCuenta}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">Titular</p>
                        <p className="font-medium text-gray-800 truncate">{c.titular}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      {c.activa ? (
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                          Visible
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-600 whitespace-nowrap">
                          Oculta
                        </span>
                      )}
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
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Estadística de tarjetas</h3>
          <p className="text-sm text-gray-500 mb-5">Distribución por banco.</p>
          <div className="flex justify-center">
            <div className="relative w-36 h-36 rounded-full" style={{ background: computeConicGradient(donutGroups).background }}>
              <div className="absolute inset-[14px] bg-white rounded-full" />
            </div>
          </div>
          <div className="mt-6 space-y-2.5">
            {donutGroups.length === 0 ? (
              <p className="text-sm text-gray-400 text-center">Sin datos todavía.</p>
            ) : (
              donutGroups.map((g) => (
                <div key={g.label} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
                  <span className="text-gray-600 truncate">{g.label}</span>
                  <span className="ml-auto font-medium text-gray-800">{g.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <CrudModal open={modalOpen} title={editingCard ? 'Editar Tarjeta' : 'Nueva Tarjeta'} onClose={cerrarModal}>
        <PaymentCardForm
          key={editingCard?._id ?? 'nueva'}
          initialData={editingCard}
          onSubmit={handleSubmit}
          onCancel={cerrarModal}
          submitting={guardando}
        />
      </CrudModal>
    </div>
  );
}

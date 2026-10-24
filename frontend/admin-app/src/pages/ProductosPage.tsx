import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
import StatCardMobile from '../components/ui/StatCardMobile';
import Switch from '../components/ui/Switch';
import DonutChart from '../components/ui/DonutChart';
import Pagination from '../components/ui/Pagination';
import CrudModal from '../components/ui/CrudModal';
import ProductForm from '../components/forms/ProductForm';
import { ProductosIcon, CheckIcon, XIcon, PlusIcon, PencilIcon, TrashIcon, SearchIcon, StarIcon } from '../components/icons';
import { useProductsQuery, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { useSwitchFilter } from '../hooks/useSwitchFilter';
import { confirmAction, notifyError, notifySuccess } from '../lib/sweetalert';
import type { Product } from '../types/models';

const PRODUCTOS_POR_PAGINA = 5;

const TIPOS = [
  { value: 'shampoo', label: 'Shampoo' },
  { value: 'acondicionador', label: 'Acondicionador' },
  { value: 'mascarilla', label: 'Mascarilla' },
  { value: 'crema', label: 'Crema' },
  { value: 'serum', label: 'Sérum' },
  { value: 'aceite', label: 'Aceite' },
  { value: 'tratamiento', label: 'Tratamiento' },
  { value: 'otro', label: 'Otro' },
];

export default function ProductosPage() {
  const { data: productos = [], isLoading } = useProductsQuery();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const estadoFiltro = useSwitchFilter();
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [pagina, setPagina] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Los KPIs y el donut se calculan sobre el catálogo completo (no el filtrado);
  // solo la tabla refleja los filtros activos — igual que el panel viejo.
  const disponibles = productos.filter((p) => !!p.availability).length;
  const agotados = productos.length - disponibles;
  const destacados = productos.filter((p) => !!p.featured).length;

  // Porcentajes para los anillos de progreso de las tarjetas de estadística
  // en móvil, todos como fracción del catálogo completo.
  const pctDisponibles = productos.length ? Math.round((disponibles / productos.length) * 100) : 0;
  const pctAgotados = productos.length ? Math.round((agotados / productos.length) * 100) : 0;
  const pctDestacados = productos.length ? Math.round((destacados / productos.length) * 100) : 0;

  const filtrados = useMemo(() => {
    const texto = search.trim().toLowerCase();
    let lista = productos.filter(
      (p) => p.name.toLowerCase().includes(texto) || p.description.toLowerCase().includes(texto)
    );
    if (categoriaFiltro) lista = lista.filter((p) => p.category === categoriaFiltro);
    if (tipoFiltro) lista = lista.filter((p) => (p.type || 'otro') === tipoFiltro);
    if (estadoFiltro.selected.size) lista = lista.filter((p) => estadoFiltro.selected.has(String(!!p.availability)));
    if (soloDestacados) lista = lista.filter((p) => !!p.featured);
    return lista;
  }, [productos, search, categoriaFiltro, tipoFiltro, estadoFiltro.selected, soloDestacados]);

  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
  const productosPagina = filtrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

  const limpiarFiltros = () => {
    setSearch('');
    setCategoriaFiltro('');
    setTipoFiltro('');
    estadoFiltro.clear();
    setSoloDestacados(false);
    setPagina(1);
  };

  const abrirNuevo = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };
  const abrirEditar = (producto: Product) => {
    setEditingProduct(producto);
    setModalOpen(true);
  };
  const cerrarModal = () => setModalOpen(false);

  const guardando = createProduct.isPending || updateProduct.isPending;

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct._id, formData });
      } else {
        await createProduct.mutateAsync(formData);
      }
      cerrarModal();
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo guardar el producto.');
    }
  };

  const handleDelete = async (producto: Product) => {
    const confirmed = await confirmAction({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
    });
    if (!confirmed) return;
    try {
      await deleteProduct.mutateAsync(producto._id);
      notifySuccess('Eliminado', 'El producto ha sido eliminado.');
    } catch (err) {
      notifyError('Error', err instanceof Error ? err.message : 'No se pudo eliminar el producto.');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestión de productos"
        title="Productos registrados"
        description="Administra el catálogo de Bella Beauty. Puedes buscar, filtrar por categoría, tipo o estado, y crear o editar productos."
        action={
          <button
            type="button"
            onClick={abrirNuevo}
            className="glass-button-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shrink-0"
          >
            <PlusIcon className="w-4 h-4" /> Nuevo Producto
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 mb-6 lg:hidden">
        <StatCardMobile
          icon={<ProductosIcon className="w-5 h-5" />}
          percent={100}
          label="Total productos"
          value={productos.length}
        />
        <StatCardMobile
          icon={<CheckIcon className="w-5 h-5" />}
          percent={pctDisponibles}
          label="Disponibles"
          value={disponibles}
          highlighted
        />
        <StatCardMobile
          icon={<XIcon className="w-5 h-5" />}
          percent={pctAgotados}
          label="Agotados"
          value={agotados}
        />
        <StatCardMobile
          icon={<StarIcon className="w-5 h-5" />}
          percent={pctDestacados}
          label="Destacados"
          value={destacados}
        />
      </div>

      <KpiRow>
        <KpiCard
          label="Total productos"
          value={productos.length}
          note="En el catálogo"
          iconBg="bg-ink/5"
          iconColor="text-ink"
          icon={<ProductosIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Disponibles"
          value={disponibles}
          note="Con stock"
          valueClassName="text-sky"
          iconBg="bg-sky/15"
          iconColor="text-sky"
          icon={<CheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Agotados"
          value={agotados}
          note="Sin stock"
          valueClassName="text-coral"
          iconBg="bg-coral/15"
          iconColor="text-coral"
          icon={<XIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Destacados"
          value={destacados}
          note="En vitrina"
          valueClassName="text-ink"
          iconBg="bg-[#eef0f4]"
          iconColor="text-muted"
          icon={<StarIcon className="w-5 h-5" />}
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
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Categoría</h4>
              <div className="relative">
                <select
                  value={categoriaFiltro}
                  onChange={(e) => {
                    setCategoriaFiltro(e.target.value);
                    setPagina(1);
                  }}
                  className="glass-input w-full px-3 py-2 rounded-full text-sm"
                >
                  <option value="">Todas</option>
                  <option value="capilar">Productos Capilares</option>
                  <option value="facial">Productos Faciales</option>
                </select>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Tipo</h4>
              <select
                value={tipoFiltro}
                onChange={(e) => {
                  setTipoFiltro(e.target.value);
                  setPagina(1);
                }}
                className="glass-input w-full px-3 py-2 rounded-full text-sm"
              >
                <option value="">Todos</option>
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-4 border-t border-white/70 space-y-2">
              <h4 className="text-sm font-medium text-[#3a3d45] mb-2">Estado</h4>
              <Switch
                checked={estadoFiltro.isChecked('true')}
                onChange={(v) => {
                  estadoFiltro.toggle('true', v);
                  setPagina(1);
                }}
                label="Disponibles"
              />
              <Switch
                checked={estadoFiltro.isChecked('false')}
                onChange={(v) => {
                  estadoFiltro.toggle('false', v);
                  setPagina(1);
                }}
                label="Agotados"
              />
            </div>
            <div className="pt-4 border-t border-white/70">
              <Switch
                checked={soloDestacados}
                onChange={(v) => {
                  setSoloDestacados(v);
                  setPagina(1);
                }}
                label="Solo destacados"
              />
            </div>
          </div>

          <div className="mt-6">
            <DonutChart
              title="Disponibilidad"
              centerCaption="Disponibles"
              groups={[
                { label: 'Disponibles', count: disponibles, color: '#7e9ce3' },
                { label: 'Agotados', count: agotados, color: '#e2766f' },
              ]}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <div className="glass p-6 md:p-8">
            <div className="glass-toolbar flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-ink flex items-center">
                <ProductosIcon className="w-5 h-5 mr-2 text-coral" />
                Productos
              </h2>
              <div className="relative">
                <SearchIcon className="pointer-events-none z-10 w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagina(1);
                  }}
                  placeholder="Buscar producto..."
                  className="glass-input pl-10 pr-4 py-2.5 rounded-full text-sm w-full md:w-72"
                />
              </div>
            </div>

            <div className="glass-inset overflow-x-auto rounded-[22px]">
              <table className="glass-table min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Calificación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-muted">Cargando...</td>
                    </tr>
                  ) : (
                    productosPagina.map((p) => (
                      <tr key={p._id}>
                        <td className="p-3 pl-6 font-semibold text-ink">{p.name}</td>
                        <td className="p-3 text-[#3a3d45]">${p.price}</td>
                        <td className="p-3 text-[#3a3d45] max-w-xs truncate" title={p.description}>{p.description}</td>
                        <td className="p-3 text-[#3a3d45]">{p.rating ?? 0}</td>
                        <td className="p-3 text-[#3a3d45]">
                          {p.stock === null || p.stock === undefined ? (
                            <span className="text-muted">Sin control</span>
                          ) : (
                            p.stock
                          )}
                        </td>
                        <td className="p-3">
                          <img src={p.image || './img/default.jpg'} alt={p.name} className="w-16 h-16 object-cover rounded-xl" />
                        </td>
                        <td className="p-3">
                          {p.availability ? <span className="status bg-sky">Sí</span> : <span className="status bg-muted">No</span>}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              title="Editar"
                              onClick={() => abrirEditar(p)}
                              className="glass-icon-button text-sky p-2 rounded-full"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              title="Eliminar"
                              onClick={() => handleDelete(p)}
                              className="glass-button-danger p-2 rounded-full"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination totalItems={filtrados.length} porPagina={PRODUCTOS_POR_PAGINA} paginaActiva={pagina} onChange={setPagina} />
          </div>
        </div>
      </div>

      <CrudModal open={modalOpen} title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'} onClose={cerrarModal}>
        <ProductForm
          key={editingProduct?._id ?? 'nuevo'}
          initialData={editingProduct}
          onSubmit={handleSubmit}
          onCancel={cerrarModal}
          submitting={guardando}
        />
      </CrudModal>
    </div>
  );
}

import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KpiCard, KpiRow } from '../components/ui/KpiCard';
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors shrink-0"
          >
            <PlusIcon className="w-4 h-4" /> Nuevo Producto
          </button>
        }
      />

      <KpiRow>
        <KpiCard
          label="Total productos"
          value={productos.length}
          note="En el catálogo"
          iconBg="bg-purple-100/70"
          iconColor="text-purple-600"
          icon={<ProductosIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Disponibles"
          value={disponibles}
          note="Con stock"
          valueClassName="text-emerald-700"
          iconBg="bg-emerald-100/70"
          iconColor="text-emerald-600"
          icon={<CheckIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Agotados"
          value={agotados}
          note="Sin stock"
          valueClassName="text-rose-700"
          iconBg="bg-rose-100/70"
          iconColor="text-rose-600"
          icon={<XIcon className="w-5 h-5" />}
        />
        <KpiCard
          label="Destacados"
          value={destacados}
          note="En vitrina"
          valueClassName="text-sky-700"
          iconBg="bg-sky-100/70"
          iconColor="text-sky-600"
          icon={<StarIcon className="w-5 h-5" />}
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
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categoría</h4>
              <div className="relative">
                <select
                  value={categoriaFiltro}
                  onChange={(e) => {
                    setCategoriaFiltro(e.target.value);
                    setPagina(1);
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  <option value="">Todas</option>
                  <option value="capilar">Productos Capilares</option>
                  <option value="facial">Productos Faciales</option>
                </select>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tipo</h4>
              <select
                value={tipoFiltro}
                onChange={(e) => {
                  setTipoFiltro(e.target.value);
                  setPagina(1);
                }}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value="">Todos</option>
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Estado</h4>
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
            <div className="pt-4 border-t border-gray-100">
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
                { label: 'Disponibles', count: disponibles, color: '#059669' },
                { label: 'Agotados', count: agotados, color: '#e11d48' },
              ]}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <ProductosIcon className="w-5 h-5 mr-2 text-purple-600" />
                Productos
              </h2>
              <div className="relative">
                <SearchIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagina(1);
                  }}
                  placeholder="Buscar producto..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-72"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-gray-400">Cargando...</td>
                    </tr>
                  ) : (
                    productosPagina.map((p) => (
                      <tr key={p._id}>
                        <td className="p-2 font-semibold">{p.name}</td>
                        <td className="p-2">${p.price}</td>
                        <td className="p-2">{p.description}</td>
                        <td className="p-2">{p.rating ?? 0}</td>
                        <td className="p-2">
                          {p.stock === null || p.stock === undefined ? (
                            <span className="text-gray-400">Sin control</span>
                          ) : (
                            p.stock
                          )}
                        </td>
                        <td className="p-2">
                          <img src={p.image || './img/default.jpg'} alt={p.name} className="w-16 h-16 object-cover rounded" />
                        </td>
                        <td className="p-2">{p.availability ? 'Sí' : 'No'}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              title="Editar"
                              onClick={() => abrirEditar(p)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              title="Eliminar"
                              onClick={() => handleDelete(p)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
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

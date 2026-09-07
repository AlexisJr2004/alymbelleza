import type { ProductFilters } from '../../hooks/useProductFilters';
import ProductCard from '../ui/ProductCard';

interface ProductosGridProps {
  filters: ProductFilters;
  isLoading: boolean;
  isError: boolean;
}

// Puerto de la zona de contenido de productos.html (líneas ~628-640) más
// renderProductos()/el contador de resultados (líneas ~1062-1074, ~1264).
// A diferencia de FeaturedProducts (Home), acá el grid es de 3 columnas en
// desktop (xl:w-1/3) en vez de 4.
export default function ProductosGrid({ filters, isLoading, isError }: ProductosGridProps) {
  const n = filters.filtrados.length;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar producto por nombre..."
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
          className="w-full md:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
        />
        {!isLoading && !isError ? (
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {n} producto{n === 1 ? '' : 's'} encontrado{n === 1 ? '' : 's'}
          </p>
        ) : null}
      </div>

      {isError ? (
        <div className="w-full text-center text-red-500 py-8">No se pudieron cargar los productos.</div>
      ) : isLoading ? (
        <div className="w-full text-center text-gray-400 py-8">Cargando productos...</div>
      ) : n === 0 ? (
        <div className="w-full flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <i className="fas fa-magnifying-glass text-2xl text-purple-300" />
          </div>
          <p className="font-medium text-gray-600">No se encontraron productos</p>
          <p className="text-sm text-gray-400 mt-1">Prueba a ajustar los filtros o el término de búsqueda</p>
        </div>
      ) : (
        <div className="flex flex-wrap -m-4">
          {filters.filtrados.map((product) => (
            <div key={product._id} className="xl:w-1/3 md:w-1/2 w-full p-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

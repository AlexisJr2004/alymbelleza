import { useProductsQuery } from '../hooks/useProducts';
import { useProductFilters } from '../hooks/useProductFilters';
import { ProductQuickViewProvider } from '../components/ui/ProductQuickViewProvider';
import FiltrosSidebar from '../components/productos/FiltrosSidebar';
import ProductosGrid from '../components/productos/ProductosGrid';

// Página "Productos" — puerto de frontend/productos.html. El motor de filtros
// (búsqueda por nombre + categoría/tipo por switches + rango de precio +
// destacados/disponibles) replica exactamente filtrarYRenderizar() del script
// original (ver useProductFilters), ahora como estado derivado en vez de
// reconstrucción manual del DOM.
export default function ProductosPage() {
  const { data: products, isLoading, isError } = useProductsQuery();
  const filters = useProductFilters(products ?? []);

  return (
    <ProductQuickViewProvider>
      <div className="flex flex-col items-center justify-center text-center mb-16 animate-fade-in">
        <br />
        <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight text-gray-900">Lista de Productos ✨</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-4" />
      </div>

      <div className="container mx-auto px-5 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <FiltrosSidebar filters={filters} />
          <ProductosGrid filters={filters} isLoading={isLoading} isError={isError} />
        </div>
      </div>
    </ProductQuickViewProvider>
  );
}

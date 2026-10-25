import { useState } from 'react';
import type { ProductFilters } from '../../hooks/useProductFilters';
import { useFavorites } from '../../hooks/useFavorites';
import StoreProductCard from '../home/StoreProductCard';
import StoreIcon from '../home/StoreIcon';

interface ProductosGridProps {
  filters: ProductFilters;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}
export default function ProductosGrid({ filters, isLoading, isError, onRetry }: ProductosGridProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const [order, setOrder] = useState('featured');
  const sorted = [...filters.filtrados].sort((a, b) => order === 'price-asc' ? a.price - b.price : order === 'price-desc' ? b.price - a.price : order === 'name' ? a.name.localeCompare(b.name, 'es') : Number(b.featured) - Number(a.featured));
  const n = sorted.length;
  return <div className="bb-catalog-results">
    <div className="bb-catalog-toolbar">
      <label className="bb-catalog-search"><StoreIcon name="search" /><span className="sr-only">Buscar en el catálogo</span><input type="search" placeholder="Encuentra tu próximo favorito…" value={filters.search} onChange={event => filters.setSearch(event.target.value)} /></label>
      <label className="bb-catalog-sort"><span>Ordenar por</span><select aria-label="Ordenar por" value={order} onChange={event => setOrder(event.target.value)}><option value="featured">Destacados</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="name">Nombre: A–Z</option></select></label>
    </div>
    {!isLoading && !isError && <p className="bb-results-count" role="status">{n} producto{n === 1 ? '' : 's'} encontrado{n === 1 ? '' : 's'}</p>}
    {isError ? <div className="bb-catalog-status" role="alert"><StoreIcon name="bag" /><h2>No pudimos cargar los productos</h2><p>Inténtalo de nuevo en un momento.</p><button type="button" className="bb-button" onClick={onRetry}>Reintentar</button></div> : isLoading ? <div className="bb-catalog-grid" role="status" aria-label="Cargando productos">{Array.from({ length: 6 }, (_, index) => <div className="bb-product-skeleton" key={index}><span /><span /><span /></div>)}</div> : n === 0 ? <div className="bb-catalog-status"><StoreIcon name="search" /><h2>No se encontraron productos</h2><p>Prueba con otros filtros o guarda tus favoritos con el corazón.</p><button type="button" className="bb-button bb-button-outline" onClick={filters.clear}>Limpiar filtros</button></div> : <div className="bb-catalog-grid">{sorted.map(product => <StoreProductCard key={product._id} product={product} favorite={favorites.includes(product._id)} onFavorite={() => toggleFavorite(product._id)} />)}</div>}
  </div>;
}

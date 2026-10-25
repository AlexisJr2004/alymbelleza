import { Link, useSearchParams } from 'react-router-dom';
import { useProductsQuery } from '../hooks/useProducts';
import { useFavorites } from '../hooks/useFavorites';
import { useProductFilters } from '../hooks/useProductFilters';
import { ProductQuickViewProvider } from '../components/ui/ProductQuickViewProvider';
import FiltrosSidebar from '../components/productos/FiltrosSidebar';
import ProductosGrid from '../components/productos/ProductosGrid';
import StoreIcon from '../components/home/StoreIcon';
import '../styles/catalog.css';

export default function ProductosPage() {
  const [params] = useSearchParams();
  return <ProductCatalog key={params.toString()} params={params} />;
}

function ProductCatalog({ params }: { params: URLSearchParams }) {
  const { data: products = [], isLoading, isError, refetch } = useProductsQuery();
  const { favorites } = useFavorites();
  const category = params.get('categoria');
  const favoritesOnly = params.get('favoritos') === '1';
  const collection = favoritesOnly ? products.filter(product => favorites.includes(product._id)) : products;
  const filters = useProductFilters(collection, {
    search: params.get('q') ?? '',
    category: category === 'facial' || category === 'capilar' ? category : undefined,
    offers: params.get('ofertas') === '1',
  });

  return <main className="bb-catalog" id="contenido">
    <div className="bb-container">
      <nav className="bb-breadcrumb" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><StoreIcon name="chevron" /><span aria-current="page">{favoritesOnly ? 'Mis favoritos' : 'Tienda'}</span></nav>
      <header className="bb-catalog-hero">
        <div><p className="bb-eyebrow">TU RITUAL DE BELLEZA</p><h1>{favoritesOnly ? <>Todo lo que <em>te encanta</em></> : <>Belleza para <em>cada día</em></>}</h1><p>{favoritesOnly ? 'Tu selección de favoritos, guardada para cuando quieras volver.' : 'Encuentra el cuidado perfecto para tu piel y tu cabello. Un pequeño momento para ti, todos los días.'}</p><span><StoreIcon name={favoritesOnly ? 'heart' : 'leaf'} />{favoritesOnly ? 'Elegidos por ti' : 'Descubre tu próxima rutina favorita'}</span></div>
      </header>
      <nav className="bb-catalog-categories" aria-label="Colecciones">
        <Link to="/productos" className={!category && !favoritesOnly && !params.has('ofertas') ? 'is-active' : ''}>Todos los productos</Link>
        <Link to="/productos?categoria=facial" className={category === 'facial' ? 'is-active' : ''}>Cuidado facial</Link>
        <Link to="/productos?categoria=capilar" className={category === 'capilar' ? 'is-active' : ''}>Cuidado capilar</Link>
        <Link to="/productos?ofertas=1" className={params.get('ofertas') === '1' ? 'is-active' : ''}>Ofertas</Link>
        <Link to="/productos?favoritos=1" className={favoritesOnly ? 'is-active' : ''}><StoreIcon name="heart" />Mis favoritos</Link>
      </nav>
      <ProductQuickViewProvider><div className="bb-catalog-layout">
        <FiltrosSidebar filters={filters} />
        <ProductosGrid filters={filters} isLoading={isLoading} isError={isError} onRetry={() => void refetch()} />
      </div></ProductQuickViewProvider>
      <div className="bb-catalog-assistance"><span><StoreIcon name="headset" /><span><strong>¿Buscas algo especial?</strong><small>Te ayudamos a encontrar el cuidado ideal para ti.</small></span></span><Link to="/contacto" className="bb-text-link">Habla con una asesora <StoreIcon name="arrow" /></Link></div>
    </div>
  </main>;
}

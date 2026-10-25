import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProductsQuery } from '../hooks/useProducts';
import { useFavorites } from '../hooks/useFavorites';
import { ProductQuickViewProvider } from '../components/ui/ProductQuickViewProvider';
import StoreHeader from '../components/home/StoreHeader';
import StoreFooter from '../components/home/StoreFooter';
import StoreProductCard from '../components/home/StoreProductCard';
import StoreTestimonials from '../components/home/StoreTestimonials';
import ContactSection from '../components/home/ContactSection';
import StoreIcon, { type StoreIconName } from '../components/home/StoreIcon';
import CookieConsent from '../components/home/CookieConsent';
import '../styles/storefront.css';

const ChatWidget = lazy(() => import('../components/chatbot/ChatWidget'));
const categories = [
  { title: 'Maquillaje', subtitle: 'Realza tu belleza', query: 'q=maquillaje', image: 'makeup' },
  { title: 'Skincare', subtitle: 'Piel saludable', query: 'categoria=facial', image: 'skincare' },
  { title: 'Perfumes', subtitle: 'Fragancias únicas', query: 'q=perfume', image: 'perfume' },
  { title: 'Cuidado Capilar', subtitle: 'Cabello radiante', query: 'categoria=capilar', image: 'hair' },
];
const benefits: { icon: StoreIconName; title: string; subtitle: string }[] = [
  { icon: 'truck', title: 'Envíos de tus favoritos', subtitle: 'Belleza hasta tu puerta' },
  { icon: 'lock', title: 'Compra con confianza', subtitle: 'Gestiona tus pedidos en tu cuenta' },
  { icon: 'award', title: 'Cuidado para ti', subtitle: 'Tu rutina, tu momento' },
  { icon: 'headset', title: 'Atención Personalizada', subtitle: 'Estamos para ayudarte' },
];

export default function HomePage() {
  const { data: products = [], isLoading, isError, refetch } = useProductsQuery();
  const { favorites, toggleFavorite } = useFavorites();
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const navigate = useNavigate();
  const { hash, key } = useLocation();

  // Keep bookmarks and links to the former homepage sections working.
  useEffect(() => {
    if (hash === '#servicios') navigate('/nosotros#servicios', { replace: true });
    else if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, key, navigate]);
  const featured = [...products].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 6);
  const shownProducts = favoritesOnly ? products.filter(product => favorites.includes(product._id)) : featured;
  const maxDiscount = products.reduce((max, product) => product.availability && (product.stock == null || product.stock > 0) && product.originalPrice && product.originalPrice > product.price ? Math.max(max, Math.floor((1 - product.price / product.originalPrice) * 100)) : max, 0);

  return <div className="bb-storefront">
    <StoreHeader favoritesActive={favoritesOnly} onFavorites={() => { setFavoritesOnly(value => !value); document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }); }} />
    <main id="contenido">
      <section className="bb-hero" aria-labelledby="hero-title">
        <img className="bb-hero-image" src="/img/storefront/beauty-hero.jpg" alt="" fetchPriority="high" />
        <div className="bb-header-container bb-hero-inner"><div className="bb-hero-copy">
          <p className="bb-eyebrow">COSMÉTICA PREMIUM</p>
          <h1 id="hero-title">Belleza que<br /><span>resalta tu esencia</span></h1>
          <p className="bb-hero-description">Descubre una selección exclusiva de productos de belleza<br className="bb-desktop-break" /> de alta calidad para realzar tu belleza natural, todos los días.</p>
          <div className="bb-hero-actions"><Link className="bb-button" to="/productos">Comprar ahora <StoreIcon name="arrow" /></Link><a className="bb-button bb-button-outline" href="#productos">Ver colección</a></div>
          <div className="bb-hero-features"><span><i><StoreIcon name="leaf" /></i>Cuidado<br />para tu piel</span><span><i><StoreIcon name="diamond" /></i>Tu belleza<br />natural</span><span><i><StoreIcon name="heart" /></i>Un momento<br />para ti</span></div>
        </div></div>
        <p className="bb-hero-note">Más que<br />cosmética,<br />es amor propio <span>♡</span></p>
      </section>
      <section className="bb-container bb-categories" id="categorias" aria-labelledby="categories-title">
        <div className="bb-section-heading"><div><h2 id="categories-title">Nuestras Categorías</h2><p>Explora nuestras categorías y encuentra tus favoritos</p></div><Link className="bb-text-link" to="/productos">Ver todas las categorías <StoreIcon name="arrow" /></Link></div>
        <div className="bb-category-grid">{categories.map(category => <Link className={'bb-category bb-category-' + category.image} to={'/productos?' + category.query} key={category.title}>
          <span className="bb-category-art" aria-hidden="true" /><span className="bb-category-copy"><h3>{category.title}</h3><span>{category.subtitle}</span></span><span className="bb-category-arrow"><StoreIcon name="chevron" /></span>
        </Link>)}</div>
      </section>
      <section className="bb-container bb-products" id="productos" aria-labelledby="products-title">
        <div className="bb-section-heading"><div><h2 id="products-title">{favoritesOnly ? 'Tus Favoritos' : 'Productos Destacados'}</h2><p>{favoritesOnly ? 'Tu selección guardada en este dispositivo' : 'Encuentra tu próximo favorito de belleza'}</p></div>{favoritesOnly ? <button type="button" className="bb-text-link" onClick={() => setFavoritesOnly(false)}>Ver destacados <StoreIcon name="arrow" /></button> : <Link className="bb-text-link" to="/productos">Ver todos los productos <StoreIcon name="arrow" /></Link>}</div>
        <div className="bb-products-layout">
          <ProductQuickViewProvider><div className="bb-product-grid" data-count={shownProducts.length} aria-live="polite" aria-busy={isLoading}>
            {isLoading ? Array.from({ length: 6 }, (_, index) => <div className="bb-product-skeleton" key={index}><span /><span /><span /><span /></div>) : isError ? <div className="bb-catalog-status"><StoreIcon name="bag" /><p>No pudimos cargar los productos.</p><button type="button" className="bb-button bb-button-outline" onClick={() => refetch()}>Reintentar</button></div> : !shownProducts.length ? <div className="bb-catalog-status"><StoreIcon name={favoritesOnly ? 'heart' : 'bag'} /><p>{favoritesOnly ? 'Guarda los productos que te encantan tocando el corazón.' : 'Pronto encontrarás nuevos productos aquí.'}</p>{favoritesOnly && <button className="bb-text-link" type="button" onClick={() => setFavoritesOnly(false)}>Explorar productos <StoreIcon name="arrow" /></button>}</div> : shownProducts.map(product => <StoreProductCard key={product._id} product={product} favorite={favorites.includes(product._id)} onFavorite={() => toggleFavorite(product._id)} />)}
          </div></ProductQuickViewProvider>
          <aside className="bb-collection"><img src="/img/storefront/beauty-collection.jpg" alt="Modelo con maquillaje en tonos rosa y flores" loading="lazy" /><div className="bb-collection-copy"><h2>Tu momento<br />de florecer</h2><p>Colores que inspiran<br />tu mejor versión</p><Link className="bb-button" to={maxDiscount > 0 ? '/productos?ofertas=1' : '/productos'}>Descubrir ahora <StoreIcon name="arrow" /></Link></div>{maxDiscount > 0 && <div className="bb-discount"><span>HASTA</span><strong>{maxDiscount}%</strong><span>DE DESCUENTO</span></div>}</aside>
        </div>
      </section>
      <section className="bb-benefits" aria-label="La experiencia Bella Beauty"><div className="bb-container">{benefits.map(benefit => <div className="bb-benefit" key={benefit.title}><span className="bb-benefit-icon"><StoreIcon name={benefit.icon} /></span><div><h3>{benefit.title}</h3><p>{benefit.subtitle}</p></div></div>)}</div></section>
      <StoreTestimonials />
      <ContactSection />
    </main>
    <StoreFooter />
    <CookieConsent />
    <Suspense fallback={null}><ChatWidget /></Suspense>
  </div>;
}

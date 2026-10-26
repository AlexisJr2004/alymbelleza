import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartQuery } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import StoreAccountMenu from './StoreAccountMenu';
import MobileMenu from '../layout/MobileMenu';
import '../../styles/navigation.css';
import { FacebookIcon, TiktokIcon } from '../icons';
import StoreIcon, { BeautyBrand } from './StoreIcon';

export function StoreSocials() {
  return <span className="bb-socials">
    <a href="https://www.facebook.com/HairdresserandSpa?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" aria-label="Bella Beauty en Facebook"><FacebookIcon className="w-3.5 h-3.5" /></a>
    <a href="https://www.tiktok.com/@merly_macias?lang=es" target="_blank" rel="noopener noreferrer" aria-label="Bella Beauty en TikTok"><TiktokIcon className="w-3.5 h-3.5" /></a>
  </span>;
}

export default function StoreHeader({ onFavorites, favoritesActive }: { onFavorites?: () => void; favoritesActive?: boolean }) {
  const { favorites } = useFavorites();
  const favoriteCount = favorites.length;
  const { pathname, search: query, key } = useLocation();
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  useEffect(() => { setMenuOpen(false); }, [key]);
  const { data: cart } = useCartQuery();
  const navigate = useNavigate();
  const cartCount = cart?.items?.reduce((total, item) => total + item.cantidad, 0) ?? 0;
  function handleSearch(event: FormEvent) {
    event.preventDefault();
    navigate(`/productos${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`);
  }

  return <header className="bb-header">
    <a className="bb-skip" href="#contenido">Ir al contenido</a>
    <div className="bb-topbar"><div className="bb-header-container">
      <div className="bb-promises"><span><StoreIcon name="truck" />Envíos de tus productos favoritos</span><span><StoreIcon name="shield" />Belleza y cuidado personal</span><Link to="/#contacto"><StoreIcon name="headset" />Asesoría personalizada</Link></div>
      <div className="bb-community">Únete a nuestra comunidad <StoreSocials /></div>
    </div></div>
    <div className="bb-header-container bb-header-main">
      <Link to="/" aria-label="Bella Beauty, inicio"><BeautyBrand /></Link>
      <nav id="store-navigation" className="bb-nav" aria-label="Navegación principal" onClick={() => setMenuOpen(false)}>
        <Link to="/" aria-current={pathname === '/' ? 'page' : undefined}>Inicio</Link><Link to="/productos" aria-current={pathname === '/productos' ? 'page' : undefined}>Tienda</Link>
        <Link to="/#categorias">Categorías <StoreIcon name="down" /></Link>
        <Link className="bb-offers-link" to="/productos?ofertas=1">Ofertas</Link>
        <Link to="/galeria" aria-current={pathname === '/galeria' ? 'page' : undefined}>Galería</Link><Link to="/#contacto">Contacto</Link>
      </nav>
      <form role="search" className="bb-search" onSubmit={handleSearch}>
        <StoreIcon name="search" /><input type="search" aria-label="Buscar productos" placeholder="Buscar productos…" value={search} onChange={event => setSearch(event.target.value)} />
        <button type="submit" aria-label="Buscar"><StoreIcon name="search" /></button>
      </form>
      <div className="bb-header-actions" role="navigation" aria-label="Accesos rápidos">
        <StoreAccountMenu />
        <Link className="bb-icon-button" to="/citas" aria-label="Agendar una cita" title="Agendar una cita" aria-current={pathname === '/citas' ? 'page' : undefined}><StoreIcon name="calendar" /><span className="bb-mobile-label">Citas</span></Link>
        <button className="bb-icon-button" type="button" onClick={onFavorites ?? (() => navigate('/productos?favoritos=1'))} aria-label={`Mis favoritos (${favoriteCount})`} aria-pressed={favoritesActive ?? new URLSearchParams(query).get('favoritos') === '1'}><StoreIcon name="heart" /><span className="bb-mobile-label">Favoritos</span>{favoriteCount > 0 && <span className="bb-count">{favoriteCount}</span>}</button>
        <Link className="bb-icon-button" to="/carrito" aria-current={pathname === '/carrito' ? 'page' : undefined} aria-label={`Mi carrito (${cartCount})`}><StoreIcon name="bag" /><span className="bb-mobile-label">Carrito</span>{cartCount > 0 && <span className="bb-count">{cartCount}</span>}</Link>

      </div>
      <button ref={menuTrigger} type="button" className="bb-icon-button bb-menu-toggle" aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="store-mobile-menu" onClick={() => setMenuOpen(true)}><StoreIcon name="settings" /></button>
    </div>
    <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onReturnFocus={() => menuTrigger.current?.focus()} />
  </header>;
}

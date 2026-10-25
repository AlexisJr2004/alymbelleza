import { Link } from 'react-router-dom';
import { BeautyBrand } from './StoreIcon';
import StoreIcon from './StoreIcon';
import { StoreSocials } from './StoreHeader';

export default function StoreFooter() {
  return <footer className="bb-footer"><div className="bb-container bb-footer-grid">
    <div><Link to="/" aria-label="Bella Beauty, inicio"><BeautyBrand /></Link><p>Un momento para ti.<br />Una belleza que es solo tuya.</p></div>
    <div className="bb-footer-advice"><h2>Tu próximo ritual de belleza empieza aquí</h2><p>Te ayudamos a elegir el cuidado ideal para ti.</p><Link className="bb-advice-link" to="/contacto"><StoreIcon name="mail" /> Habla con una asesora <StoreIcon name="arrow" /></Link></div>
    <div><h2>Enlaces</h2><div className="bb-footer-links"><Link to="/">Inicio</Link><Link to="/nosotros">Nosotros</Link><Link to="/productos">Tienda</Link><Link to="/contacto">Contacto</Link><Link to="/galeria">Galería</Link><Link to="/citas">Reservar cita</Link></div></div>
    <div><h2>Síguenos</h2><StoreSocials /><p>Conectemos con tu belleza.</p></div>
  </div><div className="bb-container bb-footer-bottom"><span>© {new Date().getFullYear()} Bella Beauty. Todos los derechos reservados.</span><span>Hecho con amor para ti <StoreIcon name="heart" /></span></div></footer>;
}

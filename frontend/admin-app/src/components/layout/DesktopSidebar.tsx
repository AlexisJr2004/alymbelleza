import { Link, NavLink } from 'react-router-dom';
import BeautyBrand from './BeautyBrand';
import { ADMIN_NAV_ITEMS } from './navigation';
import { ArrowRightIcon, BackArrowIcon, LogoutIcon } from '../icons';
import { logout } from '../../lib/auth';
import { confirmAction } from '../../lib/sweetalert';

export default function DesktopSidebar() {
  async function signOut() {
    if (await confirmAction({ title: '¿Cerrar sesión?', text: '¿Estás seguro de que deseas salir de tu cuenta?', confirmText: 'Sí, cerrar sesión', icon: 'question' })) logout();
  }
  return <aside className="admin-sidebar">
    <Link to="/resumen" className="admin-sidebar-brand"><BeautyBrand /></Link>
    <nav aria-label="Secciones del panel">
      {ADMIN_NAV_ITEMS.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'is-active' : ''}><Icon className="h-5 w-5" /><span>{label}</span></NavLink>)}
    </nav>
    <div className="admin-sidebar-secondary">
      <a href="/"><BackArrowIcon className="h-5 w-5" />Ver tienda</a>
      <button type="button" onClick={() => void signOut()}><LogoutIcon className="h-5 w-5" />Cerrar sesión</button>
    </div>
    <div className="admin-sidebar-promo">
      <h2>Haz crecer<br />tu negocio</h2>
      <p>Conoce a tus clientes y descubre quiénes vuelven a elegirte.</p>
      <Link to="/ranking">Ver clientes <ArrowRightIcon className="h-3 w-3" /></Link>
    </div>
  </aside>;
}

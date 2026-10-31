import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, MenuGridIcon, ChevronDownIcon, LogoutIcon } from '../icons';
import { getStoredUser, logout } from '../../lib/auth';
import { resolveProfileImage } from '../../lib/format';
import { useAppointmentsQuery } from '../../hooks/useAppointments';
import { confirmAction } from '../../lib/sweetalert';
import GlobalSearch from './GlobalSearch';

export default function TopNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const user = getStoredUser();
  const { data: appointments = [] } = useAppointmentsQuery();
  const pending = appointments.filter(item => (item.status || 'pendiente') === 'pendiente').length;
  const [accountOpen, setAccountOpen] = useState(false);
  async function signOut() {
    setAccountOpen(false);
    if (await confirmAction({ title: '¿Cerrar sesión?', text: '¿Estás seguro de que deseas salir de tu cuenta?', confirmText: 'Sí, cerrar sesión', icon: 'question' })) logout();
  }
  return <header className="admin-workspace-header">
    <button type="button" className="admin-menu-trigger rail-btn" onClick={onOpenMenu} aria-label="Menú"><MenuGridIcon className="h-5 w-5" /></button>
    <GlobalSearch />
    <div className="admin-header-tools">
      <Link to="/citas" className="admin-appointments-link" aria-label={`Citas pendientes: ${pending}`} title="Citas pendientes"><BellIcon className="h-5 w-5" />{pending > 0 && <span />}</Link>
      <div className="admin-header-account" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setAccountOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') setAccountOpen(false); }}>
        <button type="button" onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-controls="admin-account-options" aria-label="Opciones de mi cuenta">
          <img src={resolveProfileImage(user)} alt="" onError={event => { if (!event.currentTarget.dataset.fallback) { event.currentTarget.dataset.fallback = 'true'; event.currentTarget.src = `${import.meta.env.BASE_URL}favicon.svg`; } }} />
          <span><strong>{user?.name || 'Administrador'}</strong><small>Administrador</small></span>
          <ChevronDownIcon className="h-3 w-3" />
        </button>
        {accountOpen && <div id="admin-account-options" className="admin-account-options"><a href="/perfil">Mi perfil</a><a href="/">Visitar la tienda</a><button type="button" onClick={() => void signOut()}><LogoutIcon className="h-4 w-4" />Cerrar sesión</button></div>}
      </div>
    </div>
  </header>;
}

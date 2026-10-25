import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSessionUser } from '../../hooks/useSessionUser';
import { isAdmin, logout } from '../../lib/auth';
import StoreIcon from './StoreIcon';

export default function StoreAccountMenu() {
  const user = useSessionUser();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const focusFirst = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => { setOpen(false); }, [location.key]);
  useEffect(() => {
    if (open && focusFirst.current) {
      root.current?.querySelector<HTMLAnchorElement>('.bb-account-panel a')?.focus();
      focusFirst.current = false;
    }
  }, [open]);
  useEffect(() => {
    function outside(event: PointerEvent) { if (!root.current?.contains(event.target as Node)) setOpen(false); }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  async function signOut() {
    await queryClient.cancelQueries();
    logout();
    queryClient.clear();
    setOpen(false);
    navigate('/');
  }
  return <div ref={root} className="bb-account" onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(true); }} onPointerLeave={event => { if (event.pointerType === 'mouse' && !root.current?.contains(document.activeElement)) setOpen(false); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } }}>
    <button ref={trigger} type="button" className="bb-icon-button" aria-label="Menú de mi cuenta" aria-expanded={open} aria-controls="store-account-panel" onClick={() => setOpen(value => !value)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); if (open) root.current?.querySelector<HTMLAnchorElement>('.bb-account-panel a')?.focus(); else { focusFirst.current = true; setOpen(true); } } }}><StoreIcon name="user" /></button>
    {open && <div className="bb-account-popover" id="store-account-panel"><div className="bb-account-panel">
      <div className="bb-account-intro"><span className="bb-account-avatar">{user?.name?.charAt(0).toUpperCase() || <StoreIcon name="user" />}</span><div><strong>{user?.name || 'Bienvenida a Bella Beauty'}</strong><small>{user ? 'Tu espacio de belleza' : 'Un espacio pensado para ti'}</small></div></div>
      <nav aria-label="Opciones de mi cuenta">
        {user ? <><Link to="/perfil"><StoreIcon name="user" /> Perfil <StoreIcon name="chevron" /></Link>{isAdmin(user) && <a href="/admin"><StoreIcon name="settings" /> Panel de Administrador <StoreIcon name="chevron" /></a>}<button type="button" className="bb-sign-out" onClick={() => void signOut()}><StoreIcon name="logout" /> Cerrar sesión</button></> : <><Link to="/login"><StoreIcon name="user" /> Iniciar sesión <StoreIcon name="chevron" /></Link><Link to="/register"><StoreIcon name="sparkle" /> Registrarse <StoreIcon name="chevron" /></Link></>}
      </nav>
    </div></div>}
  </div>;
}

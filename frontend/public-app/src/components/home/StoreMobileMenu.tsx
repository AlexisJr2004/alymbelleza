import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import StoreIcon, { BeautyBrand, type StoreIconName } from './StoreIcon';

const links: { to: string; label: string; icon: StoreIconName }[] = [
  { to: '/', label: 'Inicio', icon: 'sparkle' },
  { to: '/productos', label: 'Tienda', icon: 'bag' },
  { to: '/#categorias', label: 'Categorías', icon: 'settings' },
  { to: '/productos?ofertas=1', label: 'Ofertas', icon: 'diamond' },
  { to: '/galeria', label: 'Galería', icon: 'image' },
  { to: '/#contacto', label: 'Contacto', icon: 'mail' },
];

export default function StoreMobileMenu({ open, onClose, onReturnFocus }: { open: boolean; onClose: () => void; onReturnFocus: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  const returnRef = useRef(onReturnFocus);
  closeRef.current = onClose;
  returnRef.current = onReturnFocus;
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    if (!open) return;
    const panel = dialog.current;
    if (!panel) return;
    panel.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktop = window.matchMedia('(min-width: 768px)');
    const resize = () => { if (desktop.matches) closeRef.current(); };
    desktop.addEventListener('change', resize);
    return () => {
      panel.close();
      document.body.style.overflow = overflow;
      desktop.removeEventListener('change', resize);
      returnRef.current();
    };
  }, [open]);
  return createPortal(<dialog ref={dialog} id="store-mobile-menu" className="bb-storefront bb-mobile-drawer" aria-labelledby="mobile-menu-title" onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const targets = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not(:disabled)'));
    const first = targets[0], last = targets[targets.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget && event.clientX > event.currentTarget.getBoundingClientRect().right) onClose(); }}>
    <header><BeautyBrand /><button type="button" className="bb-icon-button" aria-label="Cerrar menú" onClick={onClose}><StoreIcon name="close" /></button></header>
    <div className="bb-drawer-intro"><p className="bb-eyebrow">TU UNIVERSO DE BELLEZA</p><h2 id="mobile-menu-title">Explora Bella Beauty</h2><p>Un momento para ti, a un toque.</p></div>
    <nav aria-label="Navegación móvil">{links.map(link => <Link key={link.to} to={link.to} onClick={onClose} aria-current={pathname + search + hash === link.to ? 'page' : undefined}><StoreIcon name={link.icon} /><span>{link.label}</span><StoreIcon name="chevron" /></Link>)}</nav>
    <div className="bb-drawer-bottom"><StoreIcon name="heart" /><p>Tu belleza, nuestra pasión.</p><Link className="bb-button" to="/citas" onClick={onClose}>Reserva tu cita<StoreIcon name="arrow" /></Link></div>
  </dialog>, document.body);
}

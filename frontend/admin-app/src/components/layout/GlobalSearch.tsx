import { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon } from '../icons';
import { useProductsQuery } from '../../hooks/useProducts';
import { useOrdersQuery } from '../../hooks/useOrders';
import { useUsersQuery } from '../../hooks/useUsers';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const id = useId();
  const navigate = useNavigate();
  const products = useProductsQuery(), orders = useOrdersQuery(), users = useUsersQuery();
  const text = query.trim().toLocaleLowerCase('es');
  const contains = (value?: string) => value?.toLocaleLowerCase('es').includes(text);
  const results = text.length < 2 ? [] : [
    ...(products.data || []).filter(p => contains(p.name)).slice(0, 3).map(p => ({ key: `p-${p._id}`, title: p.name, type: 'Producto', to: `/productos?q=${encodeURIComponent(p.name)}` })),
    ...(users.data || []).filter(u => contains(u.name) || contains(u.email)).slice(0, 3).map(u => ({ key: `u-${u._id}`, title: u.name || u.email || 'Usuario', type: 'Usuario', to: `/usuarios?q=${encodeURIComponent(u.email || u.name || '')}` })),
    ...(orders.data || []).filter(o => contains(o._id) || contains(o.user?.name) || contains(o.user?.email)).slice(0, 3).map(o => ({ key: `o-${o._id}`, title: `#${o._id.slice(-6)} · ${o.user?.name || 'Cliente'}`, type: 'Pedido', to: `/pedidos?q=${encodeURIComponent(o._id)}` })),
  ];
  const loading = products.isLoading || orders.isLoading || users.isLoading;
  const failed = products.isError || orders.isError || users.isError;
  return <div className="admin-global-search" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <form role="search" onSubmit={event => { event.preventDefault(); if (results[0]) { navigate(results[0].to); setOpen(false); window.scrollTo(0, 0); } }}>
      <SearchIcon className="h-4 w-4" />
      <input type="search" aria-label="Buscar en el panel" aria-controls={id} aria-expanded={open} placeholder="Buscar pedidos, usuarios, productos..." value={query} onChange={event => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }} />
    </form>
    {open && <div id={id} className="admin-search-results">
      {text.length < 2 ? <p>Escribe al menos dos caracteres para buscar.</p> : loading ? <p>Buscando...</p> : <>
        {failed && <p>No se pudieron cargar todos los resultados.</p>}
        {results.length ? results.map(result => <Link key={result.key} to={result.to} onClick={() => { setOpen(false); window.scrollTo(0, 0); }}><span>{result.title}</span><small>{result.type}</small></Link>) : <p>No hay coincidencias para «{query}».</p>}
      </>}
    </div>}
  </div>;
}

import { useState } from 'react';
import type { CartItem } from '../../types/models';
import StoreIcon from '../home/StoreIcon';
import { formatoMoneda } from '../../lib/format';

interface CarritoListaProps {
  items: CartItem[];
  busy?: boolean;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onImageClick: (src: string, name: string) => void;
}

function CartThumbnail({ src, name, onClick }: { src?: string; name: string; onClick: () => void }) {
  const [failed, setFailed] = useState(false);
  return src && !failed
    ? <button type="button" className="bb-cart-image" aria-label={`Ampliar imagen de ${name}`} onClick={onClick}><img src={src} alt={name} onError={() => setFailed(true)} /></button>
    : <span className="bb-cart-image"><StoreIcon name="bag" /></span>;
}

export default function CarritoLista({ items, busy, onIncrement, onDecrement, onRemove, onImageClick }: CarritoListaProps) {
  return <div className="bb-cart-list" aria-busy={busy}>
    {items.map(({ product, cantidad }) => <article key={product._id} className="bb-cart-row">
      <CartThumbnail src={product.image} name={product.name} onClick={() => onImageClick(product.image!, product.name)} />
      <div className="bb-cart-detail">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <small>{formatoMoneda(product.price)} / unidad</small>
      </div>
      <div className="bb-cart-quantity">
        <button type="button" disabled={busy || cantidad <= 1} onClick={() => onDecrement(product._id)} aria-label={`Reducir cantidad de ${product.name}`}>−</button>
        <output aria-label={`Cantidad de ${product.name}`}>{cantidad}</output>
        <button type="button" disabled={busy} onClick={() => onIncrement(product._id)} aria-label={`Aumentar cantidad de ${product.name}`}>+</button>
      </div>
      <div className="bb-cart-total">
        <strong>{formatoMoneda(product.price * cantidad)}</strong>
        <button type="button" className="bb-cart-remove" disabled={busy} onClick={() => onRemove(product._id)} aria-label={`Eliminar ${product.name}`}><StoreIcon name="trash" />Eliminar</button>
      </div>
    </article>)}
  </div>;
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/models';
import { useAddToCart } from '../../hooks/useCart';
import { isLoggedIn } from '../../lib/auth';
import { notifyError, notifySuccess } from '../../lib/sweetalert';
import { useProductQuickView } from '../ui/ProductQuickViewProvider';
import StarRating from '../ui/StarRating';
import StoreIcon from './StoreIcon';

export default function StoreProductCard({ product, favorite, onFavorite }: { product: Product; favorite: boolean; onFavorite: () => void }) {
  const navigate = useNavigate();
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const addToCart = useAddToCart();
  const { openQuickView } = useProductQuickView();
  const available = product.availability && !(typeof product.stock === 'number' && product.stock <= 0);
  function add() {
    if (!isLoggedIn()) { navigate('/login'); return; }
    addToCart.mutate({ productId: product._id, cantidad: 1 }, {
      onSuccess: () => notifySuccess('¡Agregado!', 'Producto agregado al carrito'),
      onError: error => notifyError('Error', error instanceof Error ? error.message : 'No se pudo agregar al carrito'),
    });
  }
  return <article className="bb-product">
    <button type="button" className="bb-product-image" onClick={() => openQuickView(product)} aria-label={`Ver detalles de ${product.name}`}>
      {product.image && product.image !== failedImage ? <img src={product.image} alt={product.name} loading="lazy" onError={() => setFailedImage(product.image ?? null)} /> : <StoreIcon name="bag" />}
    </button>
    <button type="button" className={`bb-product-favorite ${favorite ? 'is-saved' : ''}`} onClick={onFavorite} aria-label={`${favorite ? 'Quitar' : 'Guardar'} ${product.name} ${favorite ? 'de' : 'en'} favoritos`} aria-pressed={favorite}><StoreIcon name="heart" /></button>
    <div className="bb-product-info">
      <div className="bb-rating" aria-label={product.rating ? `Valoración ${product.rating} de 5` : 'Sin valoraciones'}><StarRating rating={product.rating} className="bb-star" /><span>{product.rating ? `(${Number(product.rating).toFixed(1)})` : 'Nuevo'}</span></div>
      <h3><button type="button" onClick={() => openQuickView(product)}>{product.name}</button></h3>
      <p title={product.description}>{product.description}</p>
      <div className="bb-price">${Number(product.price).toFixed(2)}{product.originalPrice && product.originalPrice > product.price ? <del>${product.originalPrice.toFixed(2)}</del> : null}</div>
      <button type="button" className="bb-add" disabled={!available || addToCart.isPending} onClick={add} aria-label={available ? `Agregar ${product.name} al carrito` : `${product.name}, agotado`}>{!available ? 'Agotado' : addToCart.isPending ? 'Agregando…' : 'Agregar'}{available && <StoreIcon name="cart" />}</button>
    </div>
  </article>;
}

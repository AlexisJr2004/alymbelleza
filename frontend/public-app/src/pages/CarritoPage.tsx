import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StorePageHeading from '../components/home/StorePageHeading';
import StoreIcon from '../components/home/StoreIcon';
import { useCartQuery, useRemoveFromCart, useUpdateCartQuantity } from '../hooks/useCart';
import { useValidateCoupon } from '../hooks/useCoupons';
import { isLoggedIn } from '../lib/auth';
import { notifyError, notifyInfo, notifySuccess } from '../lib/sweetalert';
import type { AppliedCoupon, CartItem } from '../types/models';
import CarritoLista from '../components/carrito/CarritoLista';
import ResumenPedido from '../components/carrito/ResumenPedido';
import CartImagePreviewModal from '../components/carrito/CartImagePreviewModal';

// Página "Carrito" — puerto de frontend/carrito.html. La lista de items se
// gobierna con estado local "optimista" en vez de leer directo del cache de
// React Query: se semilla una sola vez con la primera carga (como el
// `await renderizarCarrito()` de DOMContentLoaded del original) y desde ahí
// cada +/-/eliminar actualiza ese estado de inmediato y dispara la mutación
// real en paralelo, sin esperarla ni resincronizar con refetches en segundo
// plano — igual de fiel al comportamiento viejo que usar
// onMutate/setQueryData, pero más simple de seguir.
export default function CarritoPage() {
  const loggedIn = isLoggedIn();
  const { data: cart, isLoading, isError, refetch } = useCartQuery();
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [cupon, setCupon] = useState<AppliedCoupon | null>(null);
  const [preview, setPreview] = useState<{ src: string; name: string } | null>(null);

  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();
  const validateCoupon = useValidateCoupon();

  useEffect(() => {
    if (cart && items === null) setItems(cart.items);
  }, [cart, items]);

  const subtotal = useMemo(
    () => (items ?? []).reduce((sum, item) => sum + item.product.price * item.cantidad, 0),
    [items]
  );

  // calcularDescuento(subtotal) de carrito.html: puramente para el total en
  // pantalla, el descuento real se vuelve a calcular en el backend al crear
  // la orden.
  const descuento = useMemo(() => {
    if (!cupon) return 0;
    if (subtotal < (cupon.minPurchase || 0)) return 0;
    if (cupon.type === 'percentage') return Math.round(subtotal * (cupon.value / 100) * 100) / 100;
    return Math.min(cupon.value, subtotal);
  }, [cupon, subtotal]);

  const total = Math.max(0, subtotal - descuento);

  // Si al bajar cantidades o quitar un producto el subtotal ya no alcanza la
  // compra mínima del cupón aplicado, se quita solo y se avisa — mismo guard
  // que carrito.html reevaluaba en cada renderVistaCarrito().
  useEffect(() => {
    if (cupon && subtotal < (cupon.minPurchase || 0)) {
      setCupon(null);
      notifyInfo('Cupón quitado', 'Tu compra ya no alcanza el mínimo requerido para ese código.');
    }
  }, [subtotal, cupon]);

  function handleIncrement(productId: string) {
    const current = items?.find((i) => i.product._id === productId);
    if (!current) return;
    const cantidad = current.cantidad + 1;
    setItems((prev) => prev?.map((item) => (item.product._id === productId ? { ...item, cantidad } : item)) ?? prev);
    updateQuantity.mutate(
      { productId, cantidad },
      { onError: (err) => { setItems(items); notifyError('Error', err instanceof Error ? err.message : 'No se pudo actualizar la cantidad'); } }
    );
  }

  function handleDecrement(productId: string) {
    const current = items?.find((i) => i.product._id === productId);
    if (!current || current.cantidad <= 1) return;
    const cantidad = current.cantidad - 1;
    setItems((prev) => prev?.map((item) => (item.product._id === productId ? { ...item, cantidad } : item)) ?? prev);
    updateQuantity.mutate(
      { productId, cantidad },
      { onError: (err) => { setItems(items); notifyError('Error', err instanceof Error ? err.message : 'No se pudo actualizar la cantidad'); } }
    );
  }

  function handleRemove(productId: string) {
    setItems((prev) => prev?.filter((item) => item.product._id !== productId) ?? prev);
    removeFromCart.mutate(productId, {
      onError: (err) => { setItems(items); notifyError('Error', err instanceof Error ? err.message : 'No se pudo eliminar el producto'); },
    });
  }

  function handleImageClick(src: string, name: string) {
    setPreview({ src, name });
  }

  function handleApplyCoupon(code: string): Promise<boolean> {
    return new Promise((resolve) => {
      validateCoupon.mutate(
        { code, subtotal },
        {
          onSuccess: (res) => {
            setCupon(res.coupon);
            notifySuccess('¡Código aplicado!', 'El descuento ya se refleja en tu resumen.');
            resolve(true);
          },
          onError: (err) => {
            notifyError('Código no válido', err instanceof Error ? err.message : 'No se pudo aplicar el código.');
            resolve(false);
          },
        }
      );
    });
  }

  function handleRemoveCoupon() {
    setCupon(null);
  }

  // Traspaso a /pagos: simplificación deliberada respecto al carrito.html
  // viejo. Éste guardaba también una copia redundante de todo el usuario en
  // "factura_usuario" para que pagos.html la releyera; acá ambas páginas
  // viven en la misma SPA y getStoredUser() ya es confiable (ver auth.ts), así
  // que solo se traspasa el cupón — el único dato que de verdad no sobrevive
  // la navegación de otra forma.
  function handleContinue() {
    if (cupon) {
      localStorage.setItem('factura_cupon', cupon.code);
    } else {
      localStorage.removeItem('factura_cupon');
    }
  }


  const busy = updateQuantity.isPending || removeFromCart.isPending;
  const count = (items ?? []).reduce((sum, item) => sum + item.cantidad, 0);
  return <>
    <main className="bb-commerce" id="contenido">
      <div className="bb-container">
        <StorePageHeading page="Carrito" eyebrow="TU SELECCIÓN DE BELLEZA" title={<>Tu bolsa, <em>tus favoritos</em></>} description="Todo lo que elegiste para ti, en un solo lugar. Revisa tu selección y dale el toque final." icon="bag" />
        <div className="bb-commerce-grid">
          <div>
            <section className="bb-commerce-panel" aria-labelledby="cart-title">
              <header className="bb-panel-heading"><h2 id="cart-title">Mi carrito</h2><span>{count} {count === 1 ? 'artículo' : 'artículos'}</span></header>
              {!loggedIn ? <div className="bb-commerce-empty"><StoreIcon name="user" /><h3>Tu selección te espera</h3><p>Inicia sesión para ver los productos de tu carrito.</p><Link className="bb-button" to="/login">Iniciar sesión<StoreIcon name="arrow" /></Link></div>
                : isLoading ? <div className="bb-commerce-empty" role="status"><p>Cargando tu carrito...</p></div>
                : isError ? <div className="bb-commerce-empty" role="alert"><p>No pudimos cargar tu carrito.</p><button className="bb-button bb-button-outline" type="button" onClick={() => refetch()}>Reintentar</button></div>
                : !items?.length ? <div className="bb-commerce-empty"><StoreIcon name="bag" /><h3>Un espacio para tus favoritos</h3><p>Tu carrito está vacío. Descubre productos para acompañar tu rutina de belleza.</p><Link className="bb-button" to="/productos">Explorar productos<StoreIcon name="arrow" /></Link></div>
                : <CarritoLista items={items} busy={busy} onIncrement={handleIncrement} onDecrement={handleDecrement} onRemove={handleRemove} onImageClick={handleImageClick} />}
            </section>
            <Link to="/productos" className="bb-commerce-back"><StoreIcon name="arrow" />Seguir comprando</Link>
          </div>
          <ResumenPedido subtotal={subtotal} descuento={descuento} total={total} cupon={cupon} canContinue={loggedIn && !!items?.length && !busy && !isError && !isLoading} isApplyingCoupon={validateCoupon.isPending} onApplyCoupon={handleApplyCoupon} onRemoveCoupon={handleRemoveCoupon} onContinue={handleContinue} />
        </div>
      </div>
    </main>
    <CartImagePreviewModal image={preview} onClose={() => setPreview(null)} />
  </>;
}

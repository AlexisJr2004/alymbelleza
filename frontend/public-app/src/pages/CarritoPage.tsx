import { useEffect, useMemo, useState } from 'react';
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
  const { data: cart } = useCartQuery();
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
      { onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'No se pudo actualizar la cantidad') }
    );
  }

  function handleDecrement(productId: string) {
    const current = items?.find((i) => i.product._id === productId);
    if (!current || current.cantidad <= 1) return;
    const cantidad = current.cantidad - 1;
    setItems((prev) => prev?.map((item) => (item.product._id === productId ? { ...item, cantidad } : item)) ?? prev);
    updateQuantity.mutate(
      { productId, cantidad },
      { onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'No se pudo actualizar la cantidad') }
    );
  }

  function handleRemove(productId: string) {
    setItems((prev) => prev?.filter((item) => item.product._id !== productId) ?? prev);
    removeFromCart.mutate(productId, {
      onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'No se pudo eliminar el producto'),
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

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center mb-16 animate-fade-in">
        <br />
        <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight text-gray-900">Tu Carrito de Compras ✨</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-4" />
      </div>

      <section className="bg-white pb-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              {loggedIn ? (
                <CarritoLista
                  items={items ?? []}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
                  onImageClick={handleImageClick}
                />
              ) : (
                <div className="text-center text-gray-500 py-8">Debes iniciar sesión para ver tu carrito.</div>
              )}
            </div>

            <ResumenPedido
              subtotal={subtotal}
              descuento={descuento}
              total={total}
              cupon={cupon}
              isApplyingCoupon={validateCoupon.isPending}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onContinue={handleContinue}
            />
          </div>
        </div>
      </section>

      <CartImagePreviewModal image={preview} onClose={() => setPreview(null)} />
    </>
  );
}

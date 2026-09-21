import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/models';
import { isLoggedIn } from '../../lib/auth';
import { notifyError, notifySuccess } from '../../lib/sweetalert';
import { useAddToCart } from '../../hooks/useCart';
import Sheet from './Sheet';
import StarRating from './StarRating';
import ProductReviews from './ProductReviews';

// Puerto de buildProductQuickViewModal()/openProductQuickView() de js/main.js.
// Compartido entre Home y la futura página de Productos (ver useProductQuickView).
interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  // Se conserva el último producto mostrado durante la animación de salida
  // del Sheet (que sigue montado unos ms más aunque `product` ya sea null),
  // para no perder el contenido a medio deslizar hacia abajo.
  const [rendered, setRendered] = useState<Product | null>(product);

  useEffect(() => {
    if (product) setRendered(product);
  }, [product]);

  if (!rendered) return null;

  const categoriaTag = rendered.featured ? 'DESTACADO' : rendered.category === 'capilar' ? 'CAPILAR' : 'FACIAL';
  const categoriaColor = rendered.featured ? 'bg-blue-500' : rendered.category === 'capilar' ? 'bg-yellow-500' : 'bg-pink-500';

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    addToCart.mutate(
      { productId: rendered._id, cantidad: 1 },
      {
        onSuccess: () => {
          notifySuccess('¡Agregado!', 'Producto agregado al carrito');
          onClose();
        },
        onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'No se pudo agregar al carrito'),
      }
    );
  };

  return (
    <Sheet
      open={!!product}
      onClose={onClose}
      onFullyClosed={() => setRendered(null)}
      desktopMaxWidthClassName="md:max-w-2xl lg:max-w-5xl"
      labelledBy="quick-view-title"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h3 id="quick-view-title" className="text-lg font-semibold text-gray-900">
          Detalle del producto
        </h3>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-700 transition-colors">
          <i className="fas fa-times text-xl" />
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_1fr_320px] gap-6 p-6">
        <img
          src={rendered.image || './img/default.jpg'}
          alt={rendered.name}
          className="w-full h-64 md:h-full object-cover rounded-xl"
        />
        <div className="flex flex-col">
          <span
            className={`inline-block w-fit text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-3 ${categoriaColor}`}
          >
            {categoriaTag}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{rendered.name}</h2>
          <div className="flex items-center mb-4">
            <StarRating rating={rendered.rating} className="w-4 h-4" />
            <span className="text-gray-400 text-xs ml-1.5">{rendered.rating ? Number(rendered.rating).toFixed(1) : 'N/A'}</span>
            <span className={`text-xs font-medium ml-3 ${rendered.availability ? 'text-green-600' : 'text-red-500'}`}>
              {rendered.availability ? 'Disponible' : 'Agotado'}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{rendered.description}</p>
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-gray-900 font-bold text-2xl">${rendered.price}</span>
              {rendered.originalPrice ? (
                <span className="text-gray-400 text-sm line-through ml-2">${rendered.originalPrice}</span>
              ) : null}
            </div>
            {rendered.availability && (
              <button
                id="quickViewAddToCart"
                type="button"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center disabled:opacity-60"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Agregar al carrito
              </button>
            )}
          </div>
        </div>

        {/* En md (tablet) ocupa el ancho completo debajo de imagen+info
            (col-span-2); recién en lg (escritorio) pasa a ser la tercera
            columna "a la derecha" que pidió el usuario. Su propio scroll
            interno (ver ProductReviews.tsx) queda acotado a 65vh en escritorio
            para no competir con el scroll general de la hoja (max-h-[85vh]). */}
        <div className="md:col-span-2 lg:col-span-1 lg:border-l lg:border-gray-100 lg:pl-6 pt-6 border-t border-gray-100 md:pt-6 lg:pt-0 lg:border-t-0 lg:max-h-[65vh]">
          <ProductReviews productId={rendered._id} />
        </div>
      </div>
    </Sheet>
  );
}

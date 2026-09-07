import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/models';
import { isLoggedIn } from '../../lib/auth';
import { notifyError, notifySuccess } from '../../lib/sweetalert';
import { useAddToCart } from '../../hooks/useCart';
import StarRating from './StarRating';

// Puerto de buildProductQuickViewModal()/openProductQuickView() de js/main.js.
// Compartido entre Home y la futura página de Productos (ver useProductQuickView).
interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  if (!product) return null;

  const categoriaTag = product.featured ? 'DESTACADO' : product.category === 'capilar' ? 'CAPILAR' : 'FACIAL';
  const categoriaColor = product.featured ? 'bg-blue-500' : product.category === 'capilar' ? 'bg-yellow-500' : 'bg-pink-500';

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    addToCart.mutate(
      { productId: product._id, cantidad: 1 },
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
    <div
      id="productQuickViewModal"
      className="fixed inset-0 bg-black/40 opacity-100 transition-opacity duration-300 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-enter bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Detalle del producto</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <i className="fas fa-times text-xl" />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <img
            src={product.image || './img/default.jpg'}
            alt={product.name}
            className="w-full h-64 md:h-full object-cover rounded-xl"
          />
          <div className="flex flex-col">
            <span
              className={`inline-block w-fit text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-3 ${categoriaColor}`}
            >
              {categoriaTag}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <div className="flex items-center mb-4">
              <StarRating rating={product.rating} className="w-4 h-4" />
              <span className="text-gray-400 text-xs ml-1.5">{product.rating ? Number(product.rating).toFixed(1) : 'N/A'}</span>
              <span className={`text-xs font-medium ml-3 ${product.availability ? 'text-green-600' : 'text-red-500'}`}>
                {product.availability ? 'Disponible' : 'Agotado'}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <span className="text-gray-900 font-bold text-2xl">${product.price}</span>
                {product.originalPrice ? (
                  <span className="text-gray-400 text-sm line-through ml-2">${product.originalPrice}</span>
                ) : null}
              </div>
              {product.availability && (
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
        </div>
      </div>
    </div>
  );
}

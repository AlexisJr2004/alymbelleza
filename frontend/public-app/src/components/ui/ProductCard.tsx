import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/models';
import { isLoggedIn } from '../../lib/auth';
import { notifyError, notifySuccess } from '../../lib/sweetalert';
import { useAddToCart } from '../../hooks/useCart';
import { useProductQuickView } from './ProductQuickViewProvider';
import StarRating from './StarRating';

// Tarjeta de producto: mismo marcado que generaba el template literal de
// index.html (script "Script para cargar productos y agregar al carrito").
// Reutilizada por Home (destacados) y, en una fase posterior, por la página
// de Productos completa — por eso no asume nada sobre el grid contenedor.
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const { openQuickView } = useProductQuickView();

  const categoriaTag = product.featured ? 'DESTACADO' : product.category === 'capilar' ? 'CAPILAR' : 'FACIAL';
  const categoriaBg = product.featured ? 'bg-blue-500' : 'bg-gray-500';
  const categoriaLabel = product.category === 'capilar' ? 'Productos Capilares' : 'Productos Faciales';

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    addToCart.mutate(
      { productId: product._id, cantidad: 1 },
      {
        onSuccess: () => notifySuccess('¡Agregado!', 'Producto agregado al carrito'),
        onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'No se pudo agregar al carrito'),
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
      <div className="relative">
        <img className="h-48 w-full object-cover object-center" src={product.image || './img/default.jpg'} alt={product.name} />
        <div className="absolute top-4 left-4">
          <span className={`${categoriaBg} text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide`}>{categoriaTag}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-blue-600 text-xs font-medium tracking-wider uppercase mb-1">{categoriaLabel}</h3>
        <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200">{product.name}</h2>
        <p className="text-gray-500 text-sm mb-4 line-clamp-4">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} className="w-3.5 h-3.5" />
            <span className="text-gray-400 text-xs">{product.rating ? Number(product.rating).toFixed(1) : 'N/A'}</span>
          </div>
          <span className={`text-xs font-medium ${product.availability ? 'text-green-600' : 'text-red-500'}`}>
            {product.availability ? 'Disponible' : 'Agotado'}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div>
            <span className="text-gray-900 font-bold text-lg">${product.price}</span>
            {product.originalPrice ? <span className="text-gray-400 text-sm line-through ml-2">${product.originalPrice}</span> : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openQuickView(product)}
              aria-label={`Ver detalles de ${product.name}`}
              className="ver-detalle-btn w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            {product.availability ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center disabled:opacity-60"
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
            ) : (
              <button type="button" disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                Agotado
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

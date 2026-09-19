import { Link } from 'react-router-dom';
import { useCartQuery } from '../../hooks/useCart';

export default function CartBadge() {
  const { data: cart } = useCartQuery();
  const count = cart?.items.reduce((sum, i) => sum + i.cantidad, 0) || 0;

  return (
    <Link
      to="/carrito"
      title="Ver carrito"
      className="shrink-0 relative w-10 h-10 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white/90 transition-colors"
    >
      <i className="fas fa-shopping-cart" />
      {count > 0 && (
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
      )}
    </Link>
  );
}

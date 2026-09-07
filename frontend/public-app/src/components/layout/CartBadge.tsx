import { Link } from 'react-router-dom';
import { useCartQuery } from '../../hooks/useCart';

export default function CartBadge() {
  const { data: cart } = useCartQuery();
  const count = cart?.items.reduce((sum, i) => sum + i.cantidad, 0) || 0;

  return (
    <Link
      to="/carrito"
      title="Ver carrito"
      className="text-purple-600 hover:text-purple-700 transition duration-200 p-2 rounded-full hover:bg-purple-50 relative"
    >
      <i className="fas fa-shopping-cart" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </Link>
  );
}

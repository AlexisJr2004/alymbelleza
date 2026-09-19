import { Link } from 'react-router-dom';
import { useCartQuery } from '../../hooks/useCart';
import { CartIcon } from '../icons';

export default function CartBadge() {
  const { data: cart } = useCartQuery();
  // cart?.items.reduce(...) solo protege si `cart` mismo es nulo — si el
  // backend alguna vez devuelve un objeto sin `items` (o algo con otra
  // forma), `.reduce` sobre undefined tira una excepción sin capturar que
  // se lleva puesto el <Header> entero (y con él, cualquier página pública).
  const count = cart?.items?.reduce((sum, i) => sum + i.cantidad, 0) ?? 0;

  return (
    <Link
      to="/carrito"
      title="Ver carrito"
      className="shrink-0 relative w-10 h-10 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white/90 transition-colors"
    >
      <CartIcon className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
      )}
    </Link>
  );
}

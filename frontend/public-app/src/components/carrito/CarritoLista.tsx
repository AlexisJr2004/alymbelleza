import type { CartItem } from '../../types/models';

interface CarritoListaProps {
  items: CartItem[];
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onImageClick: (src: string, name: string) => void;
}

// Puerto de renderVistaCarrito() (carrito.html ~1338-1453): una tarjeta por
// producto del carrito, con +/- de cantidad, eliminar y la miniatura clicable
// que abre la vista previa ampliada (ver CartImagePreviewModal). El estado
// (items, mutaciones) vive en CarritoPage — este componente es puramente de
// presentación.
export default function CarritoLista({ items, onIncrement, onDecrement, onRemove, onImageClick }: CarritoListaProps) {
  if (items.length === 0) {
    return <div className="text-center text-gray-500 py-8">Tu carrito está vacío.</div>;
  }

  return (
    <div className="space-y-6">
      {items.map((item) => {
        const prod = item.product;
        const imageUrl = prod.image || './img/default.jpg';
        return (
          <div
            key={prod._id}
            className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <img
              className="h-20 w-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
              src={imageUrl}
              alt={prod.name}
              onClick={() => onImageClick(imageUrl, prod.name)}
            />
            <div className="flex-1 min-w-0 w-full">
              <h3 className="font-bold text-gray-900 mb-1">{prod.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{prod.description || ''}</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onDecrement(prod._id)} className="px-2 py-1 bg-gray-200 rounded">
                  -
                </button>
                <span className="mx-2">{item.cantidad}</span>
                <button type="button" onClick={() => onIncrement(prod._id)} className="px-2 py-1 bg-gray-200 rounded">
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-lg font-bold text-purple-700">${(prod.price * item.cantidad).toFixed(2)}</span>
              <button type="button" onClick={() => onRemove(prod._id)} className="text-red-600 text-sm flex items-center gap-1">
                <i className="fas fa-trash" /> Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

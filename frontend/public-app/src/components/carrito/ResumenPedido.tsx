import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { AppliedCoupon } from '../../types/models';
import { formatoMoneda } from '../../lib/format';

interface ResumenPedidoProps {
  subtotal: number;
  descuento: number;
  total: number;
  cupon: AppliedCoupon | null;
  isApplyingCoupon: boolean;
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon: () => void;
  onContinue: () => void;
}

// Puerto del panel "Resumen del pedido" de carrito.html (~508-553): totales +
// formulario/banner de cupón + botón "Continuar con la compra". onApplyCoupon
// devuelve una Promise<boolean> (éxito/fracaso) para que este componente sepa
// si debe limpiar el input — igual que el original solo hacía
// `cuponInput.value = ""` en la rama de éxito, no en la de error.
export default function ResumenPedido({
  subtotal,
  descuento,
  total,
  cupon,
  isApplyingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onContinue,
}: ResumenPedidoProps) {
  const [codigo, setCodigo] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = codigo.trim();
    if (!code) return;
    const aplicado = await onApplyCoupon(code);
    if (aplicado) setCodigo('');
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <p className="text-xl font-semibold text-gray-900">Resumen del pedido</p>
        <div className="space-y-4">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500">Subtotal</dt>
            <dd className="text-base font-medium text-gray-900">{formatoMoneda(subtotal)}</dd>
          </dl>
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500">Descuentos</dt>
            <dd className="text-base font-medium text-green-600">-{formatoMoneda(descuento)}</dd>
          </dl>
          <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
            <dt className="text-base font-bold text-gray-900">Total</dt>
            <dd className="text-base font-bold text-gray-900">{formatoMoneda(total)}</dd>
          </dl>
        </div>

        {cupon ? (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm">
            <span className="text-green-700 truncate">
              <i className="fas fa-tag mr-1" />
              Código <strong>{cupon.code}</strong> aplicado
            </span>
            <button type="button" onClick={onRemoveCoupon} className="text-green-700 hover:text-green-900 font-medium shrink-0">
              Quitar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Código de descuento"
              autoComplete="off"
              className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
            />
            <button
              type="submit"
              disabled={isApplyingCoupon}
              className="px-4 py-2 text-sm font-medium text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 transition shrink-0 disabled:opacity-60"
            >
              {isApplyingCoupon ? 'Validando...' : 'Aplicar'}
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-2">
          <Link
            to="/pagos"
            onClick={onContinue}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full shadow hover:from-purple-700 hover:to-pink-700 transition"
          >
            Continuar con la compra
          </Link>
        </div>
      </div>
    </div>
  );
}

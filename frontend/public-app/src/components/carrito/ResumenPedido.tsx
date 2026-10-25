import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { AppliedCoupon } from '../../types/models';
import { formatoMoneda } from '../../lib/format';
import StoreIcon from '../home/StoreIcon';

interface ResumenPedidoProps {
  subtotal: number;
  descuento: number;
  total: number;
  cupon: AppliedCoupon | null;
  canContinue: boolean;
  isApplyingCoupon: boolean;
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon: () => void;
  onContinue: () => void;
}

export default function ResumenPedido({ subtotal, descuento, total, cupon, canContinue, isApplyingCoupon, onApplyCoupon, onRemoveCoupon, onContinue }: ResumenPedidoProps) {
  const [codigo, setCodigo] = useState('');
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = codigo.trim();
    if (!code || !canContinue || isApplyingCoupon) return;
    if (await onApplyCoupon(code)) setCodigo('');
  }
  return <aside className="bb-commerce-panel bb-order-summary" aria-labelledby="order-summary-title">
    <h2 id="order-summary-title">Resumen del pedido</h2>
    <dl className="bb-order-totals" aria-live="polite">
      <div><dt>Subtotal</dt><dd>{formatoMoneda(subtotal)}</dd></div>
      <div><dt>Descuentos</dt><dd className="bb-order-discount">−{formatoMoneda(descuento)}</dd></div>
      <div className="bb-order-grand-total"><dt>Total</dt><dd>{formatoMoneda(total)}</dd></div>
    </dl>
    {cupon ? <div className="bb-coupon-applied">
      <span>Código <strong>{cupon.code}</strong> aplicado</span>
      <button type="button" onClick={onRemoveCoupon}>Quitar</button>
    </div> : <form onSubmit={handleSubmit} className="bb-coupon-form">
      <label htmlFor="cart-coupon">¿Tienes un código de descuento?</label>
      <div><input id="cart-coupon" value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Tu código" autoComplete="off" disabled={!canContinue || isApplyingCoupon} />
      <button type="submit" disabled={!canContinue || isApplyingCoupon || !codigo.trim()}>{isApplyingCoupon ? 'Validando...' : 'Aplicar'}</button></div>
    </form>}
    {canContinue && !isApplyingCoupon
      ? <Link to="/pagos" className="bb-button" onClick={onContinue}>Continuar con la compra<StoreIcon name="arrow" /></Link>
      : <button type="button" className="bb-button" disabled>Continuar con la compra<StoreIcon name="arrow" /></button>}
    <p className="bb-commerce-note"><StoreIcon name="bag" />Revisa tus productos y cantidades antes de continuar al pago.</p>
  </aside>;
}

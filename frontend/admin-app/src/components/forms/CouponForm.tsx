import { useId, useState } from 'react';
import Switch from '../ui/Switch';
import { CuponesIcon, PercentIcon, DollarIcon, ChevronDownIcon, XIcon, CheckIcon } from '../icons';
import type { Coupon } from '../../types/models';
import type { CouponPayload } from '../../hooks/useCoupons';

interface CouponFormProps {
  initialData?: Coupon | null;
  onSubmit: (payload: CouponPayload) => void;
  onCancel: () => void;
  submitting: boolean;
}

const inputClass =
  'glass-input w-full pl-10 pr-4 py-2.5 text-sm';
const plainInputClass =
  'glass-input w-full px-4 py-2.5 text-sm';

export default function CouponForm({ initialData, onSubmit, onCancel, submitting }: CouponFormProps) {
  const formId = useId();
  const [code, setCode] = useState(initialData?.code ?? '');
  const [type, setType] = useState<'percentage' | 'fixed'>(initialData?.type ?? 'percentage');
  const [value, setValue] = useState(initialData ? String(initialData.value) : '');
  const [minPurchase, setMinPurchase] = useState(initialData?.minPurchase ? String(initialData.minPurchase) : '');
  const [expiresAt, setExpiresAt] = useState(initialData?.expiresAt ? initialData.expiresAt.substring(0, 10) : '');
  const [active, setActive] = useState(initialData ? !!initialData.active : true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      code: code.trim(),
      type,
      value: Number(value),
      minPurchase: Number(minPurchase) || 0,
      active,
      expiresAt: expiresAt || null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor={`${formId}-code`} className="block text-sm font-medium text-ink">Código</label>
          <div className="relative">
            <CuponesIcon className="pointer-events-none w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <input
              id={`${formId}-code`}
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: BELLA10"
              className={`${inputClass} uppercase`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-type`} className="block text-sm font-medium text-ink">Tipo de descuento</label>
          <div className="relative">
            <PercentIcon className="pointer-events-none w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <select
              id={`${formId}-type`}
              required
              value={type}
              onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
              className={`${inputClass} appearance-none pr-9`}
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo ($)</option>
            </select>
            <ChevronDownIcon className="pointer-events-none w-3.5 h-3.5 absolute right-3.5 top-3.5 text-muted" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-value`} className="block text-sm font-medium text-ink">Valor</label>
          <div className="relative">
            <DollarIcon className="pointer-events-none w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <input
              id={`${formId}-value`}
              type="number"
              required
              min={0}
              step={0.01}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="10"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-minimum`} className="block text-sm font-medium text-ink">Compra mínima (opcional)</label>
          <input
            id={`${formId}-minimum`}
            type="number"
            min={0}
            step={0.01}
            value={minPurchase}
            onChange={(e) => setMinPurchase(e.target.value)}
            placeholder="0.00"
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-expires`} className="block text-sm font-medium text-ink">Fecha de expiración (opcional)</label>
          <input
            id={`${formId}-expires`}
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className={plainInputClass}
          />
        </div>

        <div className="flex items-end">
          <div className="mb-2">
            <Switch checked={active} onChange={setActive} label="Activo" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2.5 pt-5 mt-6 border-t border-slate-400/15">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="glass-button px-4 py-2.5 text-sm font-medium flex items-center"
        >
          <XIcon className="w-4 h-4 mr-1.5" /> Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="glass-button-primary px-5 py-2.5 text-sm font-medium flex items-center justify-center"
        >
          <CheckIcon className="w-4 h-4 mr-1.5" /> {submitting ? 'Guardando...' : 'Guardar Cupón'}
        </button>
      </div>
    </form>
  );
}

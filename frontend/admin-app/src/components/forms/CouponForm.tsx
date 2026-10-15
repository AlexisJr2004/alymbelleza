import { useState } from 'react';
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
  'w-full pl-9 pr-3 py-2 text-sm border border-white/80 bg-white/60 rounded-full focus:ring-2 focus:ring-sky/50 focus:border-transparent focus:outline-none transition-all';
const plainInputClass =
  'w-full px-3 py-2 text-sm border border-white/80 bg-white/60 rounded-full focus:ring-2 focus:ring-sky/50 focus:border-transparent focus:outline-none';

export default function CouponForm({ initialData, onSubmit, onCancel, submitting }: CouponFormProps) {
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
          <label className="block text-sm font-medium text-[#3a3d45]">Código</label>
          <div className="relative">
            <CuponesIcon className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
            <input
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
          <label className="block text-sm font-medium text-[#3a3d45]">Tipo de descuento</label>
          <div className="relative">
            <PercentIcon className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
            <select
              required
              value={type}
              onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
              className={`${inputClass} appearance-none`}
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo ($)</option>
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-3 top-3 text-muted" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#3a3d45]">Valor</label>
          <div className="relative">
            <DollarIcon className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
            <input
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
          <label className="block text-sm font-medium text-[#3a3d45]">Compra mínima (opcional)</label>
          <input
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
          <label className="block text-sm font-medium text-[#3a3d45]">Fecha de expiración (opcional)</label>
          <input
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

      <div className="flex justify-end gap-2.5 pt-4 mt-4 border-t border-white/70">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 text-sm border border-white/80 bg-white/50 rounded-full text-[#3a3d45] hover:bg-white/90 transition-colors flex items-center disabled:opacity-60"
        >
          <XIcon className="w-4 h-4 mr-1.5" /> Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm bg-ink text-white rounded-full hover:bg-ink/85 transition-colors flex items-center justify-center disabled:opacity-60"
        >
          <CheckIcon className="w-4 h-4 mr-1.5" /> {submitting ? 'Guardando...' : 'Guardar Cupón'}
        </button>
      </div>
    </form>
  );
}

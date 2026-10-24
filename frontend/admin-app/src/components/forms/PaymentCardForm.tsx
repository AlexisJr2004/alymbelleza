import { useId, useState } from 'react';
import Switch from '../ui/Switch';
import { BankIcon, IdCardIcon, ChevronDownIcon, XIcon, CheckIcon } from '../icons';
import type { PaymentCard } from '../../types/models';
import type { PaymentCardPayload } from '../../hooks/usePaymentCards';

interface PaymentCardFormProps {
  initialData?: PaymentCard | null;
  onSubmit: (payload: PaymentCardPayload) => void;
  onCancel: () => void;
  submitting: boolean;
}

const TARJETA_NOMBRES_BANCO: Record<PaymentCard['plantilla'], string> = {
  pichincha: 'Pichincha',
  guayaquil: 'Guayaquil',
};

const inputClass =
  'glass-input w-full pl-10 pr-9 py-2.5 text-sm appearance-none';
const plainInputClass =
  'glass-input w-full px-4 py-2.5 text-sm';

export default function PaymentCardForm({ initialData, onSubmit, onCancel, submitting }: PaymentCardFormProps) {
  const formId = useId();
  const [plantilla, setPlantilla] = useState<PaymentCard['plantilla']>(initialData?.plantilla ?? 'pichincha');
  const [tipoCuenta, setTipoCuenta] = useState(initialData?.tipoCuenta ?? '');
  const [numeroCuenta, setNumeroCuenta] = useState(initialData?.numeroCuenta ?? '');
  const [titular, setTitular] = useState(initialData?.titular ?? '');
  const [marca, setMarca] = useState<PaymentCard['marca']>(initialData?.marca ?? 'visa');
  const [activa, setActiva] = useState(initialData ? !!initialData.activa : true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      plantilla,
      banco: TARJETA_NOMBRES_BANCO[plantilla],
      tipoCuenta: tipoCuenta.trim(),
      numeroCuenta: numeroCuenta.trim(),
      titular: titular.trim(),
      marca,
      activa,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor={`${formId}-bank`} className="block text-sm font-medium text-ink">Banco</label>
          <div className="relative">
            <BankIcon className="pointer-events-none w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <select id={`${formId}-bank`} required value={plantilla} onChange={(e) => setPlantilla(e.target.value as PaymentCard['plantilla'])} className={inputClass}>
              <option value="pichincha">Banco Pichincha</option>
              <option value="guayaquil">Banco Guayaquil</option>
            </select>
            <ChevronDownIcon className="pointer-events-none w-3.5 h-3.5 absolute right-3.5 top-3.5 text-muted" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-account-type`} className="block text-sm font-medium text-ink">Tipo de cuenta</label>
          <input
            id={`${formId}-account-type`}
            type="text"
            required
            value={tipoCuenta}
            onChange={(e) => setTipoCuenta(e.target.value)}
            placeholder="Ej: Ahorros"
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-account-number`} className="block text-sm font-medium text-ink">Número de cuenta</label>
          <input
            id={`${formId}-account-number`}
            type="text"
            required
            value={numeroCuenta}
            onChange={(e) => setNumeroCuenta(e.target.value)}
            placeholder="Ej: 2209 0506 71"
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-holder`} className="block text-sm font-medium text-ink">Titular</label>
          <input
            id={`${formId}-holder`}
            type="text"
            required
            value={titular}
            onChange={(e) => setTitular(e.target.value)}
            placeholder="Nombre del titular de la cuenta"
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-brand`} className="block text-sm font-medium text-ink">Marca de tarjeta</label>
          <div className="relative">
            <IdCardIcon className="pointer-events-none w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <select id={`${formId}-brand`} required value={marca} onChange={(e) => setMarca(e.target.value as PaymentCard['marca'])} className={inputClass}>
              <option value="visa">Visa</option>
              <option value="mastercard">MasterCard</option>
            </select>
            <ChevronDownIcon className="pointer-events-none w-3.5 h-3.5 absolute right-3.5 top-3.5 text-muted" />
          </div>
        </div>

        <div className="flex items-end">
          <div className="mb-2">
            <Switch checked={activa} onChange={setActiva} label="Visible en la pasarela de pagos" />
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
          <CheckIcon className="w-4 h-4 mr-1.5" /> {submitting ? 'Guardando...' : 'Guardar Tarjeta'}
        </button>
      </div>
    </form>
  );
}

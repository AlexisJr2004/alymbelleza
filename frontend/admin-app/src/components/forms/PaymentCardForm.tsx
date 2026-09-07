import { useState } from 'react';
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
  'w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none';
const plainInputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent';

export default function PaymentCardForm({ initialData, onSubmit, onCancel, submitting }: PaymentCardFormProps) {
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
          <label className="block text-sm font-medium text-gray-700">Banco</label>
          <div className="relative">
            <BankIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <select required value={plantilla} onChange={(e) => setPlantilla(e.target.value as PaymentCard['plantilla'])} className={inputClass}>
              <option value="pichincha">Banco Pichincha</option>
              <option value="guayaquil">Banco Guayaquil</option>
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Tipo de cuenta</label>
          <input
            type="text"
            required
            value={tipoCuenta}
            onChange={(e) => setTipoCuenta(e.target.value)}
            placeholder="Ej: Ahorros"
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Número de cuenta</label>
          <input
            type="text"
            required
            value={numeroCuenta}
            onChange={(e) => setNumeroCuenta(e.target.value)}
            placeholder="Ej: 2209 0506 71"
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Titular</label>
          <input
            type="text"
            required
            value={titular}
            onChange={(e) => setTitular(e.target.value)}
            placeholder="Nombre del titular de la cuenta"
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Marca de tarjeta</label>
          <div className="relative">
            <IdCardIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <select required value={marca} onChange={(e) => setMarca(e.target.value as PaymentCard['marca'])} className={inputClass}>
              <option value="visa">Visa</option>
              <option value="mastercard">MasterCard</option>
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="flex items-end">
          <div className="mb-2">
            <Switch checked={activa} onChange={setActiva} label="Visible en la pasarela de pagos" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
        >
          <XIcon className="w-4 h-4 mr-1.5" /> Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-60"
        >
          <CheckIcon className="w-4 h-4 mr-1.5" /> {submitting ? 'Guardando...' : 'Guardar Tarjeta'}
        </button>
      </div>
    </form>
  );
}

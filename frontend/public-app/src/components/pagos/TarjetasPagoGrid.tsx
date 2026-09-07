import type { PaymentCard } from '../../types/models';
import BankCardPreview from '../ui/BankCardPreview';

interface TarjetasPagoGridProps {
  cards: PaymentCard[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

// Puerto de cargarTarjetasPago()/renderizarTarjetaPago() (pagos.html
// ~1472-1531): grid de cuentas bancarias activas, con el mismo mensaje de
// respaldo por WhatsApp tanto si la lista viene vacía como si la petición
// falla.
export default function TarjetasPagoGrid({ cards, isLoading, isError }: TarjetasPagoGridProps) {
  if (isLoading) {
    return <p className="text-center text-gray-400 w-full">Cargando cuentas...</p>;
  }

  if (isError) {
    return <p className="text-center text-gray-400 w-full">No se pudieron cargar las cuentas. Contáctanos por WhatsApp: 099 793 2650.</p>;
  }

  if (!cards || cards.length === 0) {
    return (
      <p className="text-center text-gray-400 w-full">
        No hay cuentas disponibles en este momento. Contáctanos por WhatsApp: 099 793 2650.
      </p>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
      {cards.map((card) => (
        <div key={card._id} className="w-full md:w-1/2 px-4">
          <BankCardPreview card={card} />
        </div>
      ))}
    </div>
  );
}

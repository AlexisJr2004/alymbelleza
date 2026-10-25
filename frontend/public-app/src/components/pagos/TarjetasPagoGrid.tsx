import type { PaymentCard } from '../../types/models';
import BankCardPreview from '../ui/BankCardPreview';

interface TarjetasPagoGridProps {
  cards: PaymentCard[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}
export default function TarjetasPagoGrid({ cards, isLoading, isError, onRetry }: TarjetasPagoGridProps) {
  if (isLoading) return <div className="bb-commerce-empty" role="status"><p>Cargando cuentas...</p></div>;
  if (isError) return <div className="bb-commerce-empty" role="alert"><p>No se pudieron cargar las cuentas. Contáctanos por WhatsApp: 099 793 2650.</p><button className="bb-button bb-button-outline" type="button" onClick={onRetry}>Reintentar</button></div>;
  if (!cards?.length) return <div className="bb-commerce-empty"><p>No hay cuentas disponibles en este momento. Contáctanos por WhatsApp: 099 793 2650.</p></div>;
  return <div className="bb-bank-grid">{cards.map(card => <BankCardPreview key={card._id} card={card} />)}</div>;
}

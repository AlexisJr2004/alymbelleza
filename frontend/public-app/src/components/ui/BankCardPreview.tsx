import type { PaymentCard } from '../../types/models';

const CARD_BRANDS: Record<string, string> = { visa: '/img/Visa_debit.svg', mastercard: '/img/MasterCard.svg' };

export default function BankCardPreview({ card }: { card: PaymentCard }) {
  const logo = card.plantilla === 'guayaquil' ? '/img/Banco_Guayaquil.png' : '/img/Banco_Pichincha.svg';
  return <article className="bb-bank-card" aria-label={`Cuenta de ${card.banco}`}>
    <header><div className="bb-bank-logo"><img src={logo} alt={card.banco} /></div><span>{card.tipoCuenta}</span></header>
    <dl>
      <dt>Número de cuenta</dt><dd className="bb-account-number">{card.numeroCuenta}</dd>
      <dt>Titular</dt><dd>{card.titular}</dd>
    </dl>
    <footer><span>{card.banco} · {card.tipoCuenta}</span><img src={CARD_BRANDS[card.marca] || CARD_BRANDS.visa} alt={card.marca} /></footer>
  </article>;
}

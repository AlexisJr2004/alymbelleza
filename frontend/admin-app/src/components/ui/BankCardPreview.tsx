import type { PaymentCard } from '../../types/models';

const TARJETA_MARCAS: Record<string, { logo: string; alto: string }> = {
  visa: { logo: '/img/Visa_debit.svg', alto: 'h-6' },
  mastercard: { logo: '/img/MasterCard.svg', alto: 'h-8' },
};

// Vista previa de tarjeta estilo "glass" (mismo diseño que pagos.html). Puerto
// directo de renderizarVistaPreviaTarjeta(), usada por el carrusel de Resumen.
export default function BankCardPreview({ card }: { card: PaymentCard }) {
  const marca = TARJETA_MARCAS[card.marca] || TARJETA_MARCAS.visa;
  const esGuayaquil = card.plantilla === 'guayaquil';
  const logoBanco = esGuayaquil ? '/img/Banco_Guayaquil.png' : '/img/Banco_Pichincha.svg';
  const claseTarjeta = esGuayaquil ? 'tarjeta-guayaquil text-white p-5' : 'tarjeta-pichincha text-black p-5';
  const subtitulo = esGuayaquil ? 'text-white/70' : 'text-black/60';

  return (
    <div className={claseTarjeta}>
      <div className="tarjeta-sheen" />
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <img src={logoBanco} alt={`Banco ${card.banco}`} className="h-6" />
          <div className="tarjeta-chip" />
        </div>
        <div>
          <p className={`text-[11px] font-light ${subtitulo}`}>Número de cuenta</p>
          <p className="text-lg font-semibold tracking-wider mt-0.5">{card.numeroCuenta}</p>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className={`text-[11px] font-light ${subtitulo}`}>Titular</p>
            <p className="text-sm font-semibold tracking-wide">{card.titular}</p>
          </div>
          <div className="text-right">
            <p className={`text-[11px] font-light ${subtitulo}`}>
              {card.banco} · {card.tipoCuenta}
            </p>
            <img src={marca.logo} alt={card.marca} className={`${marca.alto} ml-auto mt-0.5`} />
          </div>
        </div>
      </div>
    </div>
  );
}

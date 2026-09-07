import type { PaymentCard } from '../../types/models';

const TARJETA_MARCAS: Record<string, { logo: string; alto: string }> = {
  visa: { logo: '/img/Visa_debit.svg', alto: 'h-7' },
  mastercard: { logo: '/img/MasterCard.svg', alto: 'h-9' },
};

// Vista previa de cuenta bancaria de pagos.html — mismo diseño "glass" que
// admin-app/src/components/ui/BankCardPreview.tsx (mismas clases .tarjeta-*),
// pero porteada directo de renderizarTarjetaPago() en el pagos.html viejo, no
// copiada de la de admin: acá el padding y los tamaños de texto/logos son
// mayores (p-6, text-xl, h-7/h-9) porque esta página muestra las tarjetas más
// grandes que el carrusel compacto de "Resumen" del panel de admin. Duplicada
// a propósito en vez de compartida entre admin-app y public-app, siguiendo la
// convención ya establecida en esta migración de no compartir código entre
// ambas apps.
export default function BankCardPreview({ card }: { card: PaymentCard }) {
  const marca = TARJETA_MARCAS[card.marca] || TARJETA_MARCAS.visa;
  const esGuayaquil = card.plantilla === 'guayaquil';
  const logoBanco = esGuayaquil ? '/img/Banco_Guayaquil.png' : '/img/Banco_Pichincha.svg';
  const claseTarjeta = esGuayaquil ? 'tarjeta-guayaquil text-white p-6' : 'tarjeta-pichincha text-black p-6';
  const subtitulo = esGuayaquil ? 'text-white/70' : 'text-black/60';

  return (
    <div className={claseTarjeta}>
      <div className="tarjeta-sheen" />
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <img src={logoBanco} alt={`Banco ${card.banco}`} className="h-7" />
          </div>
          <div className="tarjeta-chip" />
        </div>
        <div>
          <p className={`text-xs font-light ${subtitulo}`}>Número de cuenta</p>
          <p className="text-xl font-semibold tracking-wider mt-1">{card.numeroCuenta}</p>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className={`text-xs font-light ${subtitulo}`}>Titular</p>
            <p className="text-base font-semibold tracking-wide">{card.titular}</p>
          </div>
          <div className="text-right">
            <p className={`text-xs font-light ${subtitulo}`}>
              {card.banco} · {card.tipoCuenta}
            </p>
            <img src={marca.logo} alt={card.marca} className={`${marca.alto} ml-auto mt-1`} />
          </div>
        </div>
      </div>
    </div>
  );
}

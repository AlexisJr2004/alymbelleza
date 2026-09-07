import { useEffect, useRef, useState } from 'react';

interface Faq {
  question: string;
  lines: string[];
}

const FAQS: Faq[] = [
  {
    question: '¿Cómo puedo reservar una cita?',
    lines: [
      'Puedes reservar una cita de tres formas:',
      '1. Directamente en nuestro sitio web con el botón "Reserva Online"',
      '2. Llamando a nuestro número +1 234 567 890',
      '3. Visitándonos en nuestro local en Av. Principal 123',
      '',
      'Las reservas online requieren un anticipo del 20% para confirmar.',
    ],
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    lines: [
      'Aceptamos todos los métodos de pago para tu comodidad:',
      '- Efectivo',
      '- Tarjetas de crédito/débito (Visa, MasterCard, American Express)',
      '- Transferencias bancarias',
      '- PayPal',
      '- Mercado Pago',
      '',
      '¡También tenemos planes de pago para tratamientos especiales!',
    ],
  },
  {
    question: '¿Tienen productos para todo tipo de piel/cabello?',
    lines: [
      'Sí, en Bella Beauty seleccionamos cuidadosamente productos para todo tipo de necesidades:',
      '',
      '- Líneas para pieles sensibles, grasas, mixtas y secas',
      '- Productos para cabello rizado, liso, teñido o con tratamientos químicos',
      '- Opciones veganas y cruelty-free',
      '- Productos orgánicos y naturales',
      '',
      'Nuestros especialistas pueden recomendarte los mejores productos según tus características.',
    ],
  },
  {
    question: '¿Cuál es su política de cancelación?',
    lines: [
      'Entendemos que pueden surgir imprevistos. Nuestra política es:',
      '',
      '✅ Cancelación con más de 24 horas: Reembolso completo del anticipo',
      '⏱️ Entre 6-24 horas antes: Conservamos el anticipo pero puedes reagendar',
      '❌ Menos de 6 horas o no presentación: Perdida del anticipo',
      '',
      'Para emergencias, contáctenos directamente y haremos excepciones cuando sea posible.',
    ],
  },
];

// Puerto de setupAccordion() de js/main.js. Nota: la clase original
// "transition-max-height" no es una utilidad real de Tailwind (ni el
// tailwind.config.js viejo ni el de este proyecto la definen), pero la
// animación sí ocurre igual: "duration-500" fija transition-duration:500ms, y
// como transition-property es "all" por defecto en CSS (no hace falta una
// clase que lo declare), el cambio de max-height termina animándose sobre
// esos 500ms. Se conserva la misma clase (aunque su nombre no sea válido)
// porque el efecto real que produce coincide con el del sitio viejo.
export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.maxHeight = i === openIndex ? `${el.scrollHeight}px` : '';
    });
  }, [openIndex]);

  return (
    <div className="space-y-4">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:border-purple-100 border border-transparent"
          >
            <button type="button" className="accordion-toggle flex w-full items-center justify-between" onClick={() => setOpenIndex(isOpen ? null : index)}>
              <h5 className="text-xl font-medium text-gray-900 group-hover:text-purple-600 transition-colors">{faq.question}</h5>
              <svg
                className={`w-6 h-6 text-gray-500 group-hover:text-purple-600 transition-all duration-300 transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              className="accordion-content mt-4 text-gray-600 overflow-hidden max-h-0 transition-max-height duration-500"
            >
              {faq.lines.map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

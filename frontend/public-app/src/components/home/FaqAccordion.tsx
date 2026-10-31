import { useEffect, useRef, useState } from 'react';

interface Faq {
  question: string;
  lines: string[];
}

const FAQS: Faq[] = [
  {
    question: '¿Cómo puedo reservar una cita?',
    lines: ['Inicia sesión y entra en la sección Citas. Elige el servicio, la fecha y el horario disponible para enviar tu reserva. Puedes consultar tus citas desde esa misma sección.'],
  },
  {
    question: '¿Cómo puedo pagar mi pedido?',
    lines: ['En la sección Pagos encontrarás las cuentas bancarias disponibles. Realiza la transferencia y comparte el comprobante por el WhatsApp indicado en esa página para coordinar tu compra.'],
  },
  {
    question: '¿Cómo elijo un producto?',
    lines: ['Consulta la descripción, las reseñas y los comentarios de cada producto en la tienda. Si necesitas orientación, escríbenos desde la sección Contacto de la página de inicio.'],
  },
  {
    question: '¿Cómo consulto un cambio en mi cita?',
    lines: ['Revisa tu reserva en la sección Citas. Para consultar un cambio de horario o una cancelación, comunícate con nuestro equipo desde Contacto.'],
  },
];

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
              className="accordion-content mt-4 text-gray-600 overflow-hidden max-h-0 transition-[max-height] duration-500"
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

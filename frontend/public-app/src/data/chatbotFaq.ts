export interface ChatbotFaqEntry {
  question: string;
  answer: string;
}

// Reemplazo de frontend/chatbot_training_data.json. El archivo original tenía
// contenido íntegro de una plantilla reciclada de otro proyecto (la "Unidad
// Educativa Siete de Noviembre", un colegio en Naranjal, Ecuador) — nada de
// eso aplica a Bella Beauty. Este archivo se reescribió desde cero con datos
// reales del propio sitio (no se inventó nada que no esté ya publicado en
// otra página): horarios de ContactSection.tsx, contacto de Footer.tsx,
// servicios de ServicesTabsSection.tsx, políticas de FaqAccordion.tsx,
// WhatsApp de CitasPage.tsx/PagosPage.tsx y redes sociales del index.html
// original (líneas ~132-138).
//
// Se importa directo como módulo (no se hace fetch en runtime como hacía el
// index.html viejo con /chatbot_training_data.json): es un array chico y ya
// va empaquetado en el chunk de Home, así que no aporta nada pedirlo por red.
export const CHATBOT_FAQ: ChatbotFaqEntry[] = [
  {
    question: 'hola',
    answer: '¡Hola! 👋 Bienvenido a Bella Beauty, soy Sofía, tu asistente virtual. ¿En qué puedo ayudarte hoy?',
  },
  {
    question: 'gracias',
    answer: '¡Con mucho gusto! 😊 Si tienes otra pregunta, aquí estoy.',
  },
  {
    question: '¿Quién eres?',
    answer:
      '¡Hola! Soy Sofía, el asistente virtual de Bella Beauty 😊. Estoy aquí para resolver tus dudas sobre nuestros servicios, productos y reservas. ¿En qué puedo ayudarte?',
  },
  {
    question: '¿Cuál es su horario de atención?',
    answer: 'Nuestro horario es: Lunes a Viernes de 9:00 AM a 8:00 PM, Sábados de 10:00 AM a 6:00 PM. Los domingos permanecemos cerrados.',
  },
  {
    question: '¿Dónde están ubicados?',
    answer: 'Nos encontramos en Av. Principal 123, Ciudad. ¡Te esperamos!',
  },
  {
    question: '¿Cuál es su número de teléfono?',
    answer: 'Puedes llamarnos al +1 234 567 890.',
  },
  {
    question: '¿Cuál es su correo electrónico?',
    answer: 'Puedes escribirnos a info@bellabeauty.com y te responderemos a la brevedad.',
  },
  {
    question: '¿Tienen WhatsApp?',
    answer: 'Sí, para confirmar tus citas puedes escribirnos por WhatsApp al +593 98 122 9675.',
  },
  {
    question: '¿Cómo puedo reservar una cita?',
    answer:
      'Puedes reservar tu cita directamente en nuestro sitio con el botón "Reserva Online" (sección Citas): eliges un día en el calendario y te contactamos por WhatsApp para confirmar. También puedes llamarnos al +1 234 567 890. Las reservas online requieren un anticipo del 20% para confirmar.',
  },
  {
    question: '¿Necesito una cuenta para agendar una cita?',
    answer: 'Sí, debes iniciar sesión en el sitio para poder agendar una cita desde el calendario de la sección Citas.',
  },
  {
    question: '¿Cuál es su política de cancelación?',
    answer:
      'Entendemos que pueden surgir imprevistos. Con más de 24 horas de anticipación reembolsamos tu anticipo completo. Entre 6 y 24 horas antes conservamos el anticipo pero puedes reagendar. Con menos de 6 horas o si no te presentas, se pierde el anticipo. Para emergencias, contáctanos directamente.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos efectivo, tarjetas de crédito/débito (Visa, MasterCard, American Express), transferencias bancarias, PayPal y Mercado Pago. También tenemos planes de pago para tratamientos especiales.',
  },
  {
    question: '¿Puedo pagar con transferencia bancaria?',
    answer:
      'Sí, en nuestra página de Pagos encontrarás las cuentas del Banco Pichincha y Banco Guayaquil. Transfiere el monto y envíanos el comprobante junto con la factura por WhatsApp.',
  },
  {
    question: '¿Qué servicios ofrecen?',
    answer:
      'Nuestros servicios premium incluyen Tratamientos Faciales, Manicure & Pedicure y Terapia de Masajes. También contamos con maquillaje profesional y venta de productos de belleza.',
  },
  {
    question: '¿Qué incluyen los tratamientos faciales?',
    answer: 'Ofrecemos rejuvenecimiento y cuidado especializado para todo tipo de piel, desde limpieza profunda hasta tratamientos anti-age.',
  },
  {
    question: '¿Tienen servicio de manicure y pedicure?',
    answer: 'Sí, contamos con técnicas profesionales para manos y pies impecables.',
  },
  {
    question: '¿Ofrecen masajes?',
    answer: 'Sí, nuestra Terapia de Masajes brinda relajación profunda y tratamiento para tensiones musculares.',
  },
  {
    question: '¿Venden productos de belleza?',
    answer:
      'Sí, en nuestra sección de Productos encontrarás líneas para todo tipo de piel y cabello, incluyendo opciones veganas, cruelty-free y orgánicas. Nuestros especialistas pueden recomendarte lo mejor para ti.',
  },
  {
    question: '¿Cómo compro productos en línea?',
    answer: 'Explora nuestra sección de Productos, agrega lo que te interese al carrito y completa tu compra desde Pagos, transfiriendo a nuestras cuentas bancarias.',
  },
  {
    question: '¿Tienen redes sociales?',
    answer: '¡Claro! Síguenos en Facebook (HairdresserandSpa) y en TikTok (@merly_macias) para ver nuestros trabajos y promociones.',
  },
  {
    question: '¿Cuánto cuesta un tratamiento?',
    answer: 'El precio varía según el tratamiento y tus necesidades. Escríbenos por WhatsApp o agenda una cita y con gusto te damos una cotización personalizada.',
  },
];

// Puerto de findAnswerInJSON() (script principal de index.html, ~2409-2432):
// primero busca coincidencia exacta (pregunta normalizada === consulta) y, si
// no hay, cae a coincidencia parcial en cualquiera de las dos direcciones
// (la pregunta del FAQ contiene la consulta, o la consulta contiene la
// pregunta del FAQ). Se conserva tal cual, incluida su limitación conocida:
// una pregunta corta como "hola" puede quedar contenida dentro de un mensaje
// más largo del usuario y disparar esa respuesta en vez de una más específica
// — no es uno de los 3 bugs señalados para corregir en esta sub-fase, así que
// se replica el comportamiento real en vez de "arreglarlo" por cuenta propia.
export function findFaqAnswer(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return null;

  const exactMatch = CHATBOT_FAQ.find((item) => item.question.toLowerCase().trim() === normalizedQuery);
  if (exactMatch) return exactMatch.answer;

  const partialMatch = CHATBOT_FAQ.find((item) => {
    const question = item.question.toLowerCase().trim();
    return question.includes(normalizedQuery) || normalizedQuery.includes(question);
  });
  return partialMatch ? partialMatch.answer : null;
}

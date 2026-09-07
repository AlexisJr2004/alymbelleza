import { useState, type FormEvent } from 'react';
import { notifyError, notifySuccess } from '../../lib/sweetalert';
import { useSendContact } from '../../hooks/useContact';

// Puerto de setupContactForm() en js/main.js. El sitio viejo mostraba el
// resultado con su propio sistema de notificación flotante (showNotification);
// acá se usa notifySuccess/notifyError (SweetAlert2), igual que en el resto de
// esta migración, en vez de reintroducir ese sistema aparte.
export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const sendContact = useSendContact();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendContact.mutate(
      { name, email, message },
      {
        onSuccess: () => {
          notifySuccess('¡Mensaje enviado!', 'Gracias por contactarnos. Te responderemos pronto.');
          setName('');
          setEmail('');
          setMessage('');
        },
        onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'No se pudo conectar con el servidor. Intenta más tarde.'),
      }
    );
  };

  return (
    <section className="py-16">
      <div id="contacto" className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">Contáctanos</h2>
          <p className="text-lg text-gray-600">Estamos aquí para ayudarte. No dudes en contactarnos para cualquier consulta.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Nombre
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Tu nombre"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Tu email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                  Mensaje
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tu mensaje"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={sendContact.isPending}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-60 inline-flex items-center"
              >
                {sendContact.isPending ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Mensaje'
                )}
              </button>
            </form>
          </div>
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
            <p className="text-gray-600 mb-4">Estamos disponibles para atenderte en los siguientes horarios:</p>
            <ul className="text-gray-600 mb-4">
              <li>Lun - Vie: 9:00 AM - 8:00 PM</li>
              <li>Sáb: 10:00 AM - 6:00 PM</li>
              <li>Dom: Cerrado</li>
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>Teléfono:</strong> +1 234 567 890
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Email:</strong> info@bellabeauty.com
            </p>
            <p className="text-gray-600">
              <strong>Dirección:</strong> Av. Principal 123, Ciudad
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

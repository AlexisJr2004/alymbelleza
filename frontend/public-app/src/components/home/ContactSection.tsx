import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { notifyError, notifySuccess } from '../../lib/sweetalert';
import { useSendContact } from '../../hooks/useContact';
import StoreIcon from './StoreIcon';
import { StoreSocials } from './StoreHeader';
import '../../styles/contact.css';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const sendContact = useSendContact();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (sendContact.isPending) return;
    if (!name.trim() || !email.trim() || !message.trim()) {
      notifyError('Revisa tu mensaje', 'Completa tu nombre, correo y mensaje antes de enviar.');
      return;
    }
    sendContact.mutate({ name: name.trim(), email: email.trim(), message: message.trim() }, {
      onSuccess: () => {
        notifySuccess('¡Mensaje enviado!', 'Gracias por contactarnos. Te responderemos pronto.');
        setName(''); setEmail(''); setMessage('');
      },
      onError: err => notifyError('No pudimos enviar tu mensaje', err instanceof Error ? err.message : 'Intenta de nuevo en un momento.'),
    });
  }

  return <section className="bb-contact" id="contacto" aria-labelledby="contact-title">
    <div className="bb-container">
      <div className="bb-section-heading"><div><h2 id="contact-title">Conversemos de belleza</h2><p>Cuéntanos qué necesitas. Nos encantará acompañarte.</p></div><span className="bb-contact-heading-note"><StoreIcon name="heart" />Atención para ti</span></div>
      <div className="bb-contact-layout">
        <aside className="bb-contact-intro">
          <span className="bb-contact-symbol"><StoreIcon name="mail" /></span>
          <p className="bb-eyebrow">ESTAMOS CERCA DE TI</p>
          <h3>Tu belleza merece<br /><em>atención personal</em></h3>
          <p>¿Buscas un producto, tienes dudas sobre tu pedido o quieres conocer nuestros cuidados? Escríbenos.</p>
          <div className="bb-contact-options">
            <a href="https://wa.me/593981229675" target="_blank" rel="noopener noreferrer"><StoreIcon name="headset" /><span><strong>Hablemos por WhatsApp</strong><small>+593 98 122 9675</small></span><StoreIcon name="arrow" /></a>
            <Link to="/citas"><StoreIcon name="calendar" /><span><strong>Reserva un momento para ti</strong><small>Elige el día de tu próxima cita</small></span><StoreIcon name="arrow" /></Link>
          </div>
          <div className="bb-contact-social"><span>También nos encuentras en</span><StoreSocials /></div>
        </aside>
        <form className="bb-contact-form" onSubmit={handleSubmit} aria-busy={sendContact.isPending}>
          <div className="bb-contact-form-heading"><h3>Envíanos un mensaje</h3><p>Te responderemos al correo que nos indiques.</p></div>
          <div className="bb-contact-fields">
            <div><label htmlFor="contact-name">Tu nombre</label><input id="contact-name" name="name" autoComplete="name" placeholder="¿Cómo te llamas?" required value={name} onChange={e => setName(e.target.value)} disabled={sendContact.isPending} /></div>
            <div><label htmlFor="contact-email">Correo electrónico</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={sendContact.isPending} /></div>
          </div>
          <div><label htmlFor="contact-message">¿En qué podemos ayudarte?</label><textarea id="contact-message" name="message" rows={4} placeholder="Cuéntanos un poco más..." required value={message} onChange={e => setMessage(e.target.value)} disabled={sendContact.isPending} /></div>
          <div className="bb-contact-submit"><span><StoreIcon name="mail" />Una conversación que empieza contigo.</span><button type="submit" className="bb-button" disabled={sendContact.isPending}>{sendContact.isPending ? 'Enviando...' : 'Enviar mensaje'}<StoreIcon name="arrow" /></button></div>
        </form>
      </div>
    </div>
  </section>;
}

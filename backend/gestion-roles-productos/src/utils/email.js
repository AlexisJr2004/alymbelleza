const nodemailer = require('nodemailer');

function mailError(code, message) {
  return Object.assign(new Error(message), { code });
}

function emailProvider() {
  return (process.env.EMAIL_PROVIDER || (process.env.RESEND_API_KEY ? 'resend' : 'smtp')).trim().toLowerCase();
}

// Solo devuelve nombres de variables, nunca credenciales, para el diagnóstico de arranque.
function missingEmailSettings() {
  const provider = emailProvider();
  if (provider === 'resend') {
    return ['RESEND_API_KEY', 'EMAIL_FROM'].filter((key) => !process.env[key]?.trim());
  }
  if (provider === 'smtp') {
    return ['EMAIL_USER', 'EMAIL_PASS'].filter((key) => !process.env[key]?.trim());
  }
  return ['EMAIL_PROVIDER (resend o smtp)'];
}

async function sendEmail({ to, replyTo, subject, text, html }) {
  const missing = missingEmailSettings();
  if (missing.length || !to?.trim()) {
    throw mailError('EMAIL_CONFIG', `Configuración de correo incompleta: ${missing.join(', ') || 'destinatario'}`);
  }

  const from = process.env.EMAIL_FROM?.trim() || `"Bella Beauty Contacto" <${process.env.EMAIL_USER.trim()}>`;
  const message = { from, to, replyTo, subject, text, html };

  if (emailProvider() === 'smtp') {
    // Conserva Gmail para instalaciones con SMTP disponible.
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.replace(/\s+/g, ''),
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
    return transporter.sendMail(message);
  }

  // HTTPS evita los puertos SMTP bloqueados en Render Free. No se reintenta
  // por SMTP si falla: el proveedor podría haber aceptado ya el mensaje.
  let response;
  let data;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to.trim()], reply_to: replyTo, subject, text, html }),
      signal: AbortSignal.timeout(20000),
    });
    // El plazo también cubre la lectura del cuerpo de la respuesta.
    const raw = await response.text();
    try { data = JSON.parse(raw); } catch { data = null; }
  } catch (error) {
    throw mailError(
      error.name === 'TimeoutError' || error.name === 'AbortError' ? 'ETIMEDOUT' : 'ECONNECTION',
      'No se pudo confirmar la respuesta del servicio de correo HTTPS.'
    );
  }

  if (!response.ok) {
    const code = [401, 403].includes(response.status) ? 'EAUTH'
      : response.status === 429 ? 'EMAIL_RATE_LIMIT' : 'EMAIL_DELIVERY_ERROR';
    // No incluir el cuerpo del proveedor: puede contener destinatarios u otros datos privados.
    throw mailError(code, `Resend rechazó la solicitud de correo (HTTP ${response.status}). Revisa la clave, el remitente verificado y los límites del proveedor.`);
  }
  if (!data || typeof data.id !== 'string' || !data.id.trim()) {
    throw mailError('EMAIL_DELIVERY_ERROR', 'Resend no devolvió una confirmación válida del envío.');
  }
  return { messageId: data.id };
}

module.exports = { sendEmail, missingEmailSettings };

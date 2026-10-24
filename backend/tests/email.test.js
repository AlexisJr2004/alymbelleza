const mockSendMail = jest.fn();
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: mockSendMail })),
}));
const nodemailer = require('nodemailer');
const { sendEmail, missingEmailSettings } = require('../gestion-roles-productos/src/utils/email');

const keys = ['EMAIL_PROVIDER', 'RESEND_API_KEY', 'EMAIL_FROM', 'EMAIL_USER', 'EMAIL_PASS'];
const message = { to: 'bandeja@example.com', replyTo: 'cliente@example.com', subject: 'Consulta', text: 'Hola', html: '<p>Hola</p>' };
let previousSettings;
let fetchSpy;

beforeEach(() => {
  previousSettings = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  keys.forEach((key) => delete process.env[key]);
  Object.assign(process.env, {
    EMAIL_PROVIDER: 'resend',
    RESEND_API_KEY: 'test-api-key',
    EMAIL_FROM: 'Bella Beauty <contacto@example.com>',
  });
  jest.clearAllMocks();
  fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Red deshabilitada en pruebas'));
});

afterEach(() => {
  fetchSpy.mockRestore();
  for (const key of keys) {
    if (previousSettings[key] === undefined) delete process.env[key];
    else process.env[key] = previousSettings[key];
  }
});

test('envía el contrato HTTPS de Resend con un plazo de espera y confirma su ID', async () => {
  fetchSpy.mockResolvedValue({ ok: true, status: 200, text: async () => '{"id":"email-id"}' });
  await expect(sendEmail(message)).resolves.toEqual({ messageId: 'email-id' });
  expect(fetchSpy).toHaveBeenCalledWith('https://api.resend.com/emails', expect.objectContaining({
    method: 'POST',
    headers: { Authorization: 'Bearer test-api-key', 'Content-Type': 'application/json' },
    signal: expect.any(AbortSignal),
  }));
  expect(JSON.parse(fetchSpy.mock.calls[0][1].body)).toEqual({
    from: process.env.EMAIL_FROM, to: [message.to], reply_to: message.replyTo,
    subject: message.subject, text: message.text, html: message.html,
  });
  expect(nodemailer.createTransport).not.toHaveBeenCalled();
});

test.each([[401, 'EAUTH'], [403, 'EAUTH'], [429, 'EMAIL_RATE_LIMIT'], [422, 'EMAIL_DELIVERY_ERROR'], [500, 'EMAIL_DELIVERY_ERROR']])(
  'maneja HTTP %i sin exponer la respuesta del proveedor ni reintentar por SMTP', async (status, code) => {
    fetchSpy.mockResolvedValue({ ok: false, status, text: async () => '{"message":"dato privado"}' });
    await expect(sendEmail(message)).rejects.toMatchObject({ code });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  }
);

test.each(['{}', 'null', 'no es JSON', '{"id":null}'])(
  'rechaza respuestas exitosas sin confirmación válida: %s', async (body) => {
    fetchSpy.mockResolvedValue({ ok: true, status: 200, text: async () => body });
    await expect(sendEmail(message)).rejects.toMatchObject({ code: 'EMAIL_DELIVERY_ERROR' });
  }
);

test('normaliza los timeouts HTTPS sin recurrir a SMTP', async () => {
  fetchSpy.mockRejectedValue(Object.assign(new Error('timeout'), { name: 'TimeoutError' }));
  await expect(sendEmail(message)).rejects.toMatchObject({ code: 'ETIMEDOUT' });
  expect(nodemailer.createTransport).not.toHaveBeenCalled();
});

test('cubre el timeout al leer el cuerpo de la respuesta', async () => {
  fetchSpy.mockResolvedValue({ text: async () => { throw Object.assign(new Error('timeout'), { name: 'AbortError' }); } });
  await expect(sendEmail(message)).rejects.toMatchObject({ code: 'ETIMEDOUT' });
});

test('rechaza configuración incompleta antes de intentar conectarse', async () => {
  delete process.env.RESEND_API_KEY;
  expect(missingEmailSettings()).toEqual(['RESEND_API_KEY']);
  await expect(sendEmail(message)).rejects.toMatchObject({ code: 'EMAIL_CONFIG' });
  expect(fetchSpy).not.toHaveBeenCalled();
  expect(nodemailer.createTransport).not.toHaveBeenCalled();
});

test('mantiene SMTP en instalaciones existentes sin clave de Resend', async () => {
  keys.forEach((key) => delete process.env[key]);
  process.env.EMAIL_USER = 'negocio@example.com';
  process.env.EMAIL_PASS = 'abcd efgh ijkl mnop';
  mockSendMail.mockResolvedValue({ messageId: 'smtp-id' });
  await expect(sendEmail(message)).resolves.toEqual({ messageId: 'smtp-id' });
  expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({
    host: 'smtp.gmail.com', port: 587, requireTLS: true,
    auth: { user: 'negocio@example.com', pass: 'abcdefghijklmnop' },
  }));
  expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({ from: '"Bella Beauty Contacto" <negocio@example.com>' }));
  expect(fetchSpy).not.toHaveBeenCalled();
});

test('selecciona Resend al configurar su clave sin un proveedor explícito', async () => {
  delete process.env.EMAIL_PROVIDER;
  fetchSpy.mockResolvedValue({ ok: true, status: 200, text: async () => '{"id":"resend-id"}' });
  await expect(sendEmail(message)).resolves.toEqual({ messageId: 'resend-id' });
  expect(nodemailer.createTransport).not.toHaveBeenCalled();
});

const mockSendMail = jest.fn();
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: mockSendMail })),
}));

const express = require('express');
const request = require('supertest');
const contactRoutes = require('../gestion-roles-productos/src/routes/contactRoutes');

// Prueba la ruta real con el transporte simulado: no envía correos ni usa MongoDB.
const app = express();
app.use(express.json());
app.use('/api/contact', contactRoutes);

const input = { name: 'Cliente', email: 'cliente@example.com', message: 'Consulta de horarios' };
let logSpy;
let previousEnvironment;
let previousMailSettings;
let fetchSpy;
const mailKeys = ['EMAIL_PROVIDER', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM', 'RESEND_API_KEY', 'CONTACT_EMAIL'];

beforeEach(() => {
  mockSendMail.mockReset();
  logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  previousEnvironment = process.env.NODE_ENV;
  previousMailSettings = Object.fromEntries(mailKeys.map((key) => [key, process.env[key]]));
  mailKeys.forEach((key) => delete process.env[key]);
  process.env.EMAIL_PROVIDER = 'smtp';
  process.env.EMAIL_USER = 'negocio@example.com';
  process.env.EMAIL_PASS = 'test-password';
  fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Red deshabilitada en pruebas'));
  process.env.NODE_ENV = 'production';
});

afterEach(() => {
  logSpy.mockRestore();
  fetchSpy.mockRestore();
  for (const key of mailKeys) {
    if (previousMailSettings[key] === undefined) delete process.env[key];
    else process.env[key] = previousMailSettings[key];
  }
  if (previousEnvironment === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = previousEnvironment;
});

describe('POST /api/contact', () => {
  it('confirma el envío cuando el transporte acepta el correo', async () => {
    mockSendMail.mockResolvedValue({ messageId: 'test-message' });
    const response = await request(app).post('/api/contact').send(input);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ success: true, messageId: 'test-message' });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it.each(['ETIMEDOUT', 'ECONNECTION', 'ECONNREFUSED', 'EDNS', 'ESOCKET'])(
    'no confirma el envío cuando falla la conexión (%s)',
    async (code) => {
      mockSendMail.mockRejectedValue(Object.assign(new Error('Detalles internos del transporte'), { code }));
      const response = await request(app).post('/api/contact').send(input);
      expect(response.status).toBe(503);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('No se pudo confirmar el envío');
      expect(response.body).not.toHaveProperty('details');
    }
  );

  it('distingue los fallos de autenticación de los fallos de conexión', async () => {
    mockSendMail.mockRejectedValue(Object.assign(new Error('Credenciales rechazadas'), { code: 'EAUTH' }));
    const response = await request(app).post('/api/contact').send(input);
    expect(response.status).toBe(500);
    expect(response.body.error).toContain('autenticación');
    expect(response.body.success).toBe(false);
  });

  it('no envía correos si faltan campos', async () => {
    const response = await request(app).post('/api/contact').send({ ...input, message: '' });
    expect(response.status).toBe(400);
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it('no muestra éxito ni detalles internos ante un fallo desconocido', async () => {
    mockSendMail.mockRejectedValue(new Error('Detalles internos del transporte'));
    const response = await request(app).post('/api/contact').send(input);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: 'Error al enviar el mensaje' });
  });

  it('envía por HTTPS al negocio y permite responder al visitante sin usar SMTP', async () => {
    process.env.EMAIL_PROVIDER = 'resend';
    process.env.RESEND_API_KEY = 'test-api-key';
    process.env.EMAIL_FROM = 'Bella Beauty <contacto@example.com>';
    process.env.CONTACT_EMAIL = 'bandeja@example.com';
    fetchSpy.mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ id: 'resend-message' }) });
    const response = await request(app).post('/api/contact').send({ ...input, email: ' cliente@example.com ' });
    expect(response.status).toBe(200);
    expect(response.body.messageId).toBe('resend-message');
    expect(mockSendMail).not.toHaveBeenCalled();
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body)).toMatchObject({
      from: process.env.EMAIL_FROM,
      to: ['bandeja@example.com'],
      reply_to: 'cliente@example.com',
    });
  });

  it('informa configuración incompleta sin caer de nuevo en SMTP', async () => {
    process.env.EMAIL_PROVIDER = 'resend';
    const response = await request(app).post('/api/contact').send(input);
    expect(response.status).toBe(503);
    expect(response.body.error).toContain('no está configurado');
    expect(mockSendMail).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rechaza campos que no sean texto antes de contactar al proveedor', async () => {
    const response = await request(app).post('/api/contact').send({ ...input, name: { value: 'Cliente' } });
    expect(response.status).toBe(400);
    expect(mockSendMail).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

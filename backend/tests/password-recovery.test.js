jest.mock('../gestion-roles-productos/src/models/user');
jest.mock('../gestion-roles-productos/src/utils/email', () => ({ sendEmail: jest.fn() }));

const express = require('express');
const request = require('supertest');
const User = require('../gestion-roles-productos/src/models/user');
const { sendEmail } = require('../gestion-roles-productos/src/utils/email');
const { forgotPassword } = require('../gestion-roles-productos/src/controllers/authController');

const app = express();
app.use(express.json());
app.post('/api/auth/forgot-password', forgotPassword);
const keys = ['FRONTEND_URL', 'RENDER_EXTERNAL_URL'];
let previousSettings;
let user;
let logSpy;

beforeEach(() => {
  jest.clearAllMocks();
  previousSettings = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  keys.forEach((key) => delete process.env[key]);
  logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  user = {
    name: 'Cliente', email: 'cliente@example.com',
    resetPasswordToken: 'previous-token', resetPasswordExpires: 123,
    save: jest.fn().mockResolvedValue(undefined),
  };
  User.findOne.mockResolvedValue(user);
  sendEmail.mockResolvedValue({ messageId: 'test-message' });
});

afterEach(() => {
  logSpy.mockRestore();
  for (const key of keys) {
    if (previousSettings[key] === undefined) delete process.env[key];
    else process.env[key] = previousSettings[key];
  }
});

async function recover() {
  return request(app).post('/api/auth/forgot-password')
    .set('Host', 'untrusted.example').set('Origin', 'https://untrusted.example')
    .set('X-Forwarded-Host', 'untrusted.example')
    .send({ email: user.email });
}

function expectValidLink(origin) {
  const mail = sendEmail.mock.calls[0][0];
  const href = mail.html.match(/href="([^"]*\/reset-password\?token=[^"]+)"/)[1];
  const link = new URL(href);
  expect(mail.to).toBe(user.email);
  expect(link.origin).toBe(origin);
  expect(link.pathname).toBe('/reset-password');
  expect(link.searchParams.get('token')).toBe(user.resetPasswordToken);
  expect(user.resetPasswordToken).toMatch(/^[a-f0-9]{40}$/);
  expect(user.resetPasswordExpires).toBeGreaterThan(Date.now());
  expect(user.save).toHaveBeenCalledTimes(1);
  expect(mail.html).not.toContain('untrusted.example');
}

test('usa la URL pública de Render cuando FRONTEND_URL no está definida', async () => {
  process.env.RENDER_EXTERNAL_URL = 'https://bella.onrender.com';
  const response = await recover();
  expect(response.status).toBe(200);
  expectValidLink('https://bella.onrender.com');
  expect(response.body).not.toHaveProperty('token');
});

test('prioriza el dominio configurado y normaliza espacios y barra final', async () => {
  process.env.FRONTEND_URL = ' https://belleza.example/ ';
  process.env.RENDER_EXTERNAL_URL = 'https://bella.onrender.com';
  expect((await recover()).status).toBe(200);
  expectValidLink('https://belleza.example');
});

test('usa Render si la variable FRONTEND_URL está vacía', async () => {
  process.env.FRONTEND_URL = '   ';
  process.env.RENDER_EXTERNAL_URL = 'https://bella.onrender.com/';
  expect((await recover()).status).toBe(200);
  expectValidLink('https://bella.onrender.com');
});

test('permite la URL del frontend local con su puerto', async () => {
  process.env.FRONTEND_URL = 'http://localhost:5173';
  expect((await recover()).status).toBe(200);
  expectValidLink('http://localhost:5173');
});

test.each([undefined, 'undefined', 'http://undefined', 'https://null', 'sin-protocolo.example', 'javascript:alert(1)', 'https://user:pass@belleza.example', 'https://belleza.example/admin', 'https://belleza.example?next=other', 'https://belleza.example/#contacto'])(
  'no guarda un token ni envía correo con configuración inválida: %s', async (value) => {
    if (value !== undefined) process.env.FRONTEND_URL = value;
    const response = await recover();
    expect(response.status).toBe(503);
    expect(response.body.error).toContain('no está configurada');
    expect(user.save).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
    expect(user.resetPasswordToken).toBe('previous-token');
    expect(user.resetPasswordExpires).toBe(123);
  }
);

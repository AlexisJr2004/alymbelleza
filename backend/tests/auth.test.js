process.env.JWT_SECRET = process.env.JWT_SECRET || 'clave-de-pruebas';

const request = require('supertest');
const app = require('../app');

// Estas pruebas cubren validaciones que se resuelven antes de tocar la base de datos,
// para poder correr sin necesidad de una conexión real a MongoDB.

describe('GET /health', () => {
  it('responde 200 sin necesidad de base de datos', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Rutas /api desconocidas', () => {
  it('devuelven 404 en JSON en vez del index del frontend', async () => {
    const res = await request(app).get('/api/esto-no-existe');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  it('rechaza un email que no sea texto (intento de inyección NoSQL)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: { $ne: null }, password: { $ne: null } });
    expect(res.status).toBe(400);
  });

  it('rechaza una petición sin contraseña', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'cliente@example.com' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/register', () => {
  it('rechaza una contraseña demasiado corta', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Cliente Prueba', email: 'cliente@example.com', password: '123' });
    expect(res.status).toBe(400);
  });

  it('rechaza un email con formato inválido', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Cliente Prueba', email: 'no-es-un-email', password: 'contraseñaValida123' });
    expect(res.status).toBe(400);
  });
});

process.env.JWT_SECRET = process.env.JWT_SECRET || 'clave-de-pruebas';

const request = require('supertest');
const app = require('../app');

// Las rutas de listado para el panel de administrador deben rechazar peticiones sin
// token antes de tocar la base de datos, así que esto se puede probar sin una
// conexión real a MongoDB.
describe('Rutas de administrador requieren token', () => {
  it('GET /api/auth/users rechaza sin token', async () => {
    const res = await request(app).get('/api/auth/users');
    expect(res.status).toBe(401);
  });

  it('GET /api/orders rechaza sin token', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
  });

  it('GET /api/appointments/admin/all rechaza sin token', async () => {
    const res = await request(app).get('/api/appointments/admin/all');
    expect(res.status).toBe(401);
  });

  it('GET /api/payment-cards/admin rechaza sin token', async () => {
    const res = await request(app).get('/api/payment-cards/admin');
    expect(res.status).toBe(401);
  });

  it('PUT /api/auth/users/:id/toggle-active rechaza sin token', async () => {
    const res = await request(app).put('/api/auth/users/000000000000000000000000/toggle-active');
    expect(res.status).toBe(401);
  });

  it('PUT /api/auth/users/:id/role rechaza sin token', async () => {
    const res = await request(app).put('/api/auth/users/000000000000000000000000/role').send({ role: 'admin' });
    expect(res.status).toBe(401);
  });
});

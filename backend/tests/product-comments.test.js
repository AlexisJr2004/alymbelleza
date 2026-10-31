process.env.JWT_SECRET = 'clave-de-pruebas';

jest.mock('../gestion-roles-productos/src/models/productComment');
jest.mock('../gestion-roles-productos/src/middlewares/authMiddleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = { _id: '507f1f77bcf86cd799439011', name: 'Cliente' };
    next();
  },
  authorize: () => (req, res, next) => next(),
}));

const request = require('supertest');
const app = require('../app');
const ProductComment = require('../gestion-roles-productos/src/models/productComment');

afterEach(() => jest.clearAllMocks());

it('publica respuestas a otros clientes sin depender del centro de notificaciones', async () => {
  const parentId = '507f1f77bcf86cd799439012';
  const productId = '507f1f77bcf86cd799439013';
  ProductComment.findById.mockResolvedValue({ _id: parentId, userId: 'otro-cliente' });
  ProductComment.create.mockImplementation(async data => ({ ...data, _id: 'respuesta' }));
  const res = await request(app).post('/api/product-comments').send({ productId, parentId, comment: ' Gracias ' });
  expect(res.status).toBe(201);
  expect(res.body.data).toMatchObject({ parentId, productId, comment: 'Gracias' });
  expect(ProductComment.create).toHaveBeenCalledTimes(1);
});

it('retira la API de notificaciones y responde con el 404 JSON habitual', async () => {
  const res = await request(app).get('/api/notifications');
  expect(res.status).toBe(404);
  expect(res.body).toEqual({ success: false, error: 'Recurso no encontrado' });
});

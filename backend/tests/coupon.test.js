process.env.JWT_SECRET = process.env.JWT_SECRET || 'clave-de-pruebas';

const couponController = require('../gestion-roles-productos/src/controllers/couponController');

// Prueba el controlador directamente (sin pasar por Express/verifyToken) para cubrir
// las validaciones que se resuelven antes de tocar la base de datos, sin necesitar
// una conexión real a MongoDB ni un token válido.
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('couponController.validateCoupon', () => {
  it('rechaza un código vacío', async () => {
    const res = mockRes();
    await couponController.validateCoupon({ body: { code: '', subtotal: 50 } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rechaza un subtotal que no es un número', async () => {
    const res = mockRes();
    await couponController.validateCoupon({ body: { code: 'BELLA10', subtotal: 'no-es-numero' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rechaza un subtotal negativo', async () => {
    const res = mockRes();
    await couponController.validateCoupon({ body: { code: 'BELLA10', subtotal: -5 } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('couponController.createCoupon', () => {
  it('rechaza un tipo de descuento inválido', async () => {
    const res = mockRes();
    await couponController.createCoupon(
      { body: { code: 'BELLA10', type: 'otro', value: 10 } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rechaza un código vacío', async () => {
    const res = mockRes();
    await couponController.createCoupon(
      { body: { code: '  ', type: 'percentage', value: 10 } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

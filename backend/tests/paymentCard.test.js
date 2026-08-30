process.env.JWT_SECRET = process.env.JWT_SECRET || 'clave-de-pruebas';

const paymentCardController = require('../gestion-roles-productos/src/controllers/paymentCardController');

// Prueba el controlador directamente (sin pasar por Express/verifyToken) para cubrir
// las validaciones que se resuelven antes de tocar la base de datos, sin necesitar
// una conexión real a MongoDB ni un token válido.
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('paymentCardController.createPaymentCard', () => {
  it('rechaza una plantilla inválida', async () => {
    const res = mockRes();
    await paymentCardController.createPaymentCard(
      { body: { plantilla: 'banco-x', numeroCuenta: '123', titular: 'Ana' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rechaza un número de cuenta vacío', async () => {
    const res = mockRes();
    await paymentCardController.createPaymentCard(
      { body: { plantilla: 'pichincha', numeroCuenta: '  ', titular: 'Ana' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rechaza un titular vacío', async () => {
    const res = mockRes();
    await paymentCardController.createPaymentCard(
      { body: { plantilla: 'pichincha', numeroCuenta: '123', titular: '' } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

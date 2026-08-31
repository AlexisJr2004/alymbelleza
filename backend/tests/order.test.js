process.env.JWT_SECRET = process.env.JWT_SECRET || 'clave-de-pruebas';

jest.mock('../gestion-roles-productos/src/models/cart');
jest.mock('../gestion-roles-productos/src/models/order');
jest.mock('../gestion-roles-productos/src/models/coupon');
jest.mock('../gestion-roles-productos/src/models/couponRedemption');
jest.mock('../gestion-roles-productos/src/models/product');

const Cart = require('../gestion-roles-productos/src/models/cart');
const Order = require('../gestion-roles-productos/src/models/order');
const Coupon = require('../gestion-roles-productos/src/models/coupon');
const CouponRedemption = require('../gestion-roles-productos/src/models/couponRedemption');
const Product = require('../gestion-roles-productos/src/models/product');
const orderController = require('../gestion-roles-productos/src/controllers/orderController');

// Prueba el controlador con los modelos de Mongoose simulados (sin conexión real a la
// base de datos), para cubrir el flujo completo de creación de orden y la regla de que
// un mismo cliente no puede redimir dos veces el mismo cupón.
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const userId = 'user123';
const coupon10 = {
  _id: 'c1',
  code: 'BELLA10',
  type: 'percentage',
  value: 10,
  minPurchase: 0,
  active: true,
  expiresAt: null,
};

describe('orderController.createOrder', () => {
  afterEach(() => jest.clearAllMocks());

  it('rechaza un carrito vacío', async () => {
    Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue({ items: [] }) });
    const res = mockRes();
    await orderController.createOrder({ body: {}, user: { _id: userId } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rechaza un código de cupón inexistente', async () => {
    Cart.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        items: [{ product: { _id: 'p1', name: 'Shampoo', price: 20 }, cantidad: 1 }],
      }),
    });
    Coupon.findOne.mockResolvedValue(null);
    const res = mockRes();
    await orderController.createOrder({ body: { couponCode: 'NOPE' }, user: { _id: userId } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('crea la orden, aplica el descuento y vacía el carrito', async () => {
    const cartDoc = {
      items: [{ product: { _id: 'p1', name: 'Shampoo', price: 20 }, cantidad: 2 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(cartDoc) });
    Coupon.findOne.mockResolvedValue(coupon10);
    CouponRedemption.create.mockResolvedValue({ _id: 'r1', save: jest.fn().mockResolvedValue(true) });
    Order.create.mockResolvedValue({ _id: 'o1', subtotal: 40, discount: 4, total: 36 });

    const res = mockRes();
    await orderController.createOrder({ body: { couponCode: 'bella10' }, user: { _id: userId } }, res);

    expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({
      subtotal: 40,
      discount: 4,
      total: 36,
      couponCode: 'BELLA10',
    }));
    expect(cartDoc.items).toEqual([]);
    expect(cartDoc.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('rechaza la orden si un producto con stock controlado no tiene unidades suficientes', async () => {
    const cartDoc = {
      items: [{ product: { _id: 'p1', name: 'Shampoo', price: 20, stock: 1 }, cantidad: 2 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(cartDoc) });

    const res = mockRes();
    await orderController.createOrder({ body: {}, user: { _id: userId } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Shampoo') }));
    expect(Order.create).not.toHaveBeenCalled();
  });

  it('no bloquea productos que nunca configuraron stock (stock null/undefined)', async () => {
    const cartDoc = {
      items: [{ product: { _id: 'p1', name: 'Shampoo', price: 20, stock: null }, cantidad: 50 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(cartDoc) });
    Order.create.mockResolvedValue({ _id: 'o1', subtotal: 1000, discount: 0, total: 1000 });

    const res = mockRes();
    await orderController.createOrder({ body: {}, user: { _id: userId } }, res);

    expect(Order.create).toHaveBeenCalled();
    expect(Product.updateOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('descuenta el stock de forma atómica al crear la orden', async () => {
    const cartDoc = {
      items: [{ product: { _id: 'p1', name: 'Shampoo', price: 20, stock: 5 }, cantidad: 2 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(cartDoc) });
    Order.create.mockResolvedValue({ _id: 'o1', subtotal: 40, discount: 0, total: 40 });
    Product.updateOne.mockResolvedValue({ matchedCount: 1 });

    const res = mockRes();
    await orderController.createOrder({ body: {}, user: { _id: userId } }, res);

    expect(Product.updateOne).toHaveBeenCalledWith(
      { _id: 'p1', stock: { $gte: 2 } },
      { $inc: { stock: -2 } }
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('revierte la orden si el stock se agotó por una compra concurrente', async () => {
    const cartDoc = {
      items: [{ product: { _id: 'p1', name: 'Shampoo', price: 20, stock: 5 }, cantidad: 2 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(cartDoc) });
    Order.create.mockResolvedValue({ _id: 'o1', subtotal: 40, discount: 0, total: 40 });
    Order.deleteOne.mockResolvedValue(true);
    Product.updateOne.mockResolvedValue({ matchedCount: 0 });

    const res = mockRes();
    await orderController.createOrder({ body: {}, user: { _id: userId } }, res);

    expect(Order.deleteOne).toHaveBeenCalledWith({ _id: 'o1' });
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('rechaza un cupón ya usado antes por el mismo cliente', async () => {
    const cartDoc = {
      items: [{ product: { _id: 'p1', name: 'Shampoo', price: 20 }, cantidad: 1 }],
      save: jest.fn().mockResolvedValue(true),
    };
    Cart.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(cartDoc) });
    Coupon.findOne.mockResolvedValue(coupon10);
    const dupError = new Error('duplicate key');
    dupError.code = 11000;
    CouponRedemption.create.mockRejectedValue(dupError);

    const res = mockRes();
    await orderController.createOrder({ body: { couponCode: 'BELLA10' }, user: { _id: userId } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Ya usaste') }));
    expect(Order.create).not.toHaveBeenCalled();
  });
});

describe('orderController.getOrders', () => {
  afterEach(() => jest.clearAllMocks());

  it('devuelve la lista de órdenes con los datos del cliente poblados', async () => {
    const ordenes = [{ _id: 'o1', user: { name: 'Cliente', email: 'c@test.com' }, total: 36 }];
    const sortMock = jest.fn().mockResolvedValue(ordenes);
    const populateMock = jest.fn().mockReturnValue({ sort: sortMock });
    Order.find.mockReturnValue({ populate: populateMock });

    const res = mockRes();
    await orderController.getOrders({}, res);

    expect(populateMock).toHaveBeenCalledWith('user', 'name email');
    expect(res.json).toHaveBeenCalledWith({ success: true, data: ordenes });
  });
});

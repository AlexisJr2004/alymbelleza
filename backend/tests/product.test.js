process.env.JWT_SECRET = process.env.JWT_SECRET || 'clave-de-pruebas';

jest.mock('../gestion-roles-productos/src/models/product');

const Product = require('../gestion-roles-productos/src/models/product');
const productController = require('../gestion-roles-productos/src/controllers/productController');

// Cubre la normalización del campo stock (unidades disponibles): una cadena vacía
// en el formulario debe guardarse como null ("sin controlar stock"), no intentar
// castearse a Number, ya que Mongoose lanza CastError con "".
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('productController.createProduct', () => {
  afterEach(() => jest.clearAllMocks());

  it('guarda stock como null cuando el formulario lo envía vacío', async () => {
    let productoConstruido;
    Product.mockImplementation((data) => {
      productoConstruido = data;
      return { ...data, save: jest.fn().mockResolvedValue(true) };
    });

    const res = mockRes();
    await productController.createProduct({
      body: { name: 'Shampoo', description: 'x', price: '10', category: 'capilar', stock: '' },
      file: null,
    }, res);

    expect(productoConstruido.stock).toBeNull();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('conserva el valor numérico de stock cuando se envía', async () => {
    let productoConstruido;
    Product.mockImplementation((data) => {
      productoConstruido = data;
      return { ...data, save: jest.fn().mockResolvedValue(true) };
    });

    const res = mockRes();
    await productController.createProduct({
      body: { name: 'Shampoo', description: 'x', price: '10', category: 'capilar', stock: '15' },
      file: null,
    }, res);

    expect(productoConstruido.stock).toBe('15');
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('productController.updateProduct', () => {
  afterEach(() => jest.clearAllMocks());

  it('convierte stock vacío a null al actualizar', async () => {
    Product.findByIdAndUpdate.mockResolvedValue({ _id: 'p1', stock: null });

    const res = mockRes();
    await productController.updateProduct({
      params: { id: 'p1' },
      body: { stock: '' },
      file: null,
    }, res);

    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      'p1',
      expect.objectContaining({ stock: null }),
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

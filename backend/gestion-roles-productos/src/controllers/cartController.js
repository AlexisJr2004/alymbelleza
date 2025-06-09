const Cart = require('../models/cart');
const Product = require('../models/product');

// Obtener carrito del usuario
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  res.json(cart || { user: req.user.id, items: [] });
};

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
  const { productId, cantidad } = req.body;
  if (!cantidad || cantidad < 1) {
    return res.status(400).json({ message: 'La cantidad debe ser al menos 1' });
  }
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }
  const item = cart.items.find(i => i.product.toString() === productId);
  if (item) {
    item.cantidad += cantidad;
  } else {
    cart.items.push({ product: productId, cantidad });
  }
  await cart.save();
  res.json(cart);
};

// Modificar cantidad
exports.updateQuantity = async (req, res) => {
  const { productId, cantidad } = req.body;
  if (cantidad < 1) {
    // Eliminar el producto si la cantidad es menor a 1
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    return res.json(cart);
  }
  // Si la cantidad es válida, actualizar
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
  const item = cart.items.find(i => i.product.toString() === productId);
  if (item) {
    item.cantidad = cantidad;
    await cart.save();
    return res.json(cart);
  }
  res.status(404).json({ message: 'Producto no encontrado en el carrito' });
};

// Eliminar producto
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};

// Vaciar carrito
exports.clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: 'Carrito vaciado' });
};
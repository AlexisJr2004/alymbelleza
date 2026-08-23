const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');

// Obtener carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { user: req.user._id, items: [] });
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
  try {
    const { productId, cantidad } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Producto no válido' });
    }
    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ message: 'La cantidad debe ser al menos 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    // Siempre compara como string
    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) {
      item.cantidad += cantidad;
    } else {
      cart.items.push({ product: productId, cantidad });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error al agregar al carrito:', err);
    res.status(500).json({ message: 'Error al agregar al carrito' });
  }
};

// Modificar cantidad
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, cantidad } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Producto no válido' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado en el carrito' });

    if (cantidad < 1) {
      // Eliminar el producto si la cantidad es menor a 1
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    } else {
      item.cantidad = cantidad;
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error al actualizar el carrito:', err);
    res.status(500).json({ message: 'Error al actualizar el carrito' });
  }
};

// Eliminar producto
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Producto no válido' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Error al eliminar del carrito:', err);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};

// Vaciar carrito
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Carrito vaciado' });
  } catch (err) {
    console.error('Error al vaciar el carrito:', err);
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
};

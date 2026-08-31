const Cart = require('../models/cart');
const Order = require('../models/order');
const Coupon = require('../models/coupon');
const CouponRedemption = require('../models/couponRedemption');
const Product = require('../models/product');
const { calculateDiscount } = require('./couponController');

// Crea una orden a partir del carrito actual del usuario (confirmación de pago),
// aplica y redime el cupón (si se envió) de forma atómica y vacía el carrito.
exports.createOrder = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'El carrito está vacío.' });
    }

    const items = cart.items
      .filter((i) => i.product)
      .map((i) => ({
        product: i.product._id,
        name: i.product.name,
        price: i.product.price,
        cantidad: i.cantidad,
      }));
    if (items.length === 0) {
      return res.status(400).json({ success: false, error: 'El carrito está vacío.' });
    }

    // Solo los productos con stock controlado (stock !== null) pueden bloquear el
    // checkout; los que nunca configuraron stock se venden sin límite, como siempre.
    const sinStockSuficiente = cart.items.filter(
      (i) => i.product && typeof i.product.stock === 'number' && i.product.stock < i.cantidad
    );
    if (sinStockSuficiente.length > 0) {
      return res.status(400).json({
        success: false,
        error: `No hay suficientes unidades disponibles de: ${sinStockSuficiente.map((i) => i.product.name).join(', ')}.`,
      });
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.cantidad, 0);

    let discount = 0;
    let coupon = null;
    let redemption = null;

    if (typeof couponCode === 'string' && couponCode.trim()) {
      coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });
      if (!coupon || !coupon.active) {
        return res.status(404).json({ success: false, error: 'El código no existe o ya no está activo.' });
      }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return res.status(400).json({ success: false, error: 'Este código ya expiró.' });
      }
      if (subtotal < coupon.minPurchase) {
        return res.status(400).json({
          success: false,
          error: `Este código requiere una compra mínima de $${coupon.minPurchase.toFixed(2)}.`,
        });
      }

      try {
        redemption = await CouponRedemption.create({ coupon: coupon._id, user: req.user._id });
      } catch (err) {
        if (err.code === 11000) {
          return res.status(400).json({ success: false, error: 'Ya usaste este código de descuento antes.' });
        }
        throw err;
      }

      discount = calculateDiscount(coupon, subtotal);
    }

    const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100);

    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      discount,
      total,
      couponCode: coupon ? coupon.code : undefined,
    });

    // Descuento atómico y guardado por producto (sin transacción multi-documento):
    // si otro checkout concurrente ya consumió el stock entre la validación de
    // arriba y este punto, se revierte la orden recién creada en vez de venderla.
    for (const i of cart.items) {
      if (!i.product || typeof i.product.stock !== 'number') continue;
      const resultado = await Product.updateOne(
        { _id: i.product._id, stock: { $gte: i.cantidad } },
        { $inc: { stock: -i.cantidad } }
      );
      if (resultado.matchedCount === 0) {
        await Order.deleteOne({ _id: order._id });
        if (redemption) await CouponRedemption.deleteOne({ _id: redemption._id });
        return res.status(409).json({
          success: false,
          error: `El producto "${i.product.name}" ya no tiene stock suficiente. Intenta de nuevo.`,
        });
      }
    }

    if (redemption) {
      redemption.order = order._id;
      await redemption.save();
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error('Error al crear la orden:', err);
    res.status(500).json({ success: false, error: 'Error al procesar la orden.' });
  }
};

// Lista todas las órdenes (panel de administrador)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('Error al obtener las órdenes:', err);
    res.status(500).json({ success: false, error: 'Error al obtener las órdenes.' });
  }
};

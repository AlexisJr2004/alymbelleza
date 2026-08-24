const Coupon = require('../models/coupon');

// Calcula el descuento de un cupón sobre un subtotal dado
function calculateDiscount(coupon, subtotal) {
  if (coupon.type === 'percentage') {
    return Math.round(subtotal * (coupon.value / 100) * 100) / 100;
  }
  return Math.min(coupon.value, subtotal);
}

// Valida un código de descuento contra el subtotal del carrito (uso público de clientes)
exports.validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ success: false, error: 'Ingresa un código de descuento.' });
    }
    const parsedSubtotal = Number(subtotal);
    if (!Number.isFinite(parsedSubtotal) || parsedSubtotal < 0) {
      return res.status(400).json({ success: false, error: 'El subtotal no es válido.' });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon || !coupon.active) {
      return res.status(404).json({ success: false, error: 'El código no existe o ya no está activo.' });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ success: false, error: 'Este código ya expiró.' });
    }
    if (parsedSubtotal < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        error: `Este código requiere una compra mínima de $${coupon.minPurchase.toFixed(2)}.`,
      });
    }

    res.json({
      success: true,
      coupon: { code: coupon.code, type: coupon.type, value: coupon.value, minPurchase: coupon.minPurchase },
      discount: calculateDiscount(coupon, parsedSubtotal),
    });
  } catch (err) {
    console.error('Error al validar cupón:', err);
    res.status(500).json({ success: false, error: 'Error al validar el cupón.' });
  }
};

// --- Administración de cupones (solo admin) ---

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) {
    console.error('Error al obtener cupones:', err);
    res.status(500).json({ success: false, error: 'Error al obtener los cupones.' });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, type, value, minPurchase, active, expiresAt } = req.body;

    if (typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ success: false, error: 'El código es requerido.' });
    }
    if (!['percentage', 'fixed'].includes(type)) {
      return res.status(400).json({ success: false, error: 'El tipo de descuento debe ser "percentage" o "fixed".' });
    }

    const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Ya existe un cupón con ese código.' });
    }

    const coupon = new Coupon({
      code: code.trim(),
      type,
      value,
      minPurchase: minPurchase || 0,
      active: active !== undefined ? active : true,
      expiresAt: expiresAt || undefined,
    });
    await coupon.save();
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: Object.values(err.errors).map((e) => e.message).join(' ') });
    }
    console.error('Error al crear cupón:', err);
    res.status(500).json({ success: false, error: 'Error al crear el cupón.' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.code) updates.code = updates.code.trim();

    const coupon = await Coupon.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Cupón no encontrado.' });
    }
    res.json({ success: true, data: coupon });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: Object.values(err.errors).map((e) => e.message).join(' ') });
    }
    console.error('Error al actualizar cupón:', err);
    res.status(500).json({ success: false, error: 'Error al actualizar el cupón.' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Cupón no encontrado.' });
    }
    res.json({ success: true, message: 'Cupón eliminado.' });
  } catch (err) {
    console.error('Error al eliminar cupón:', err);
    res.status(500).json({ success: false, error: 'Error al eliminar el cupón.' });
  }
};

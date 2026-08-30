const PaymentCard = require('../models/paymentCard');

const PLANTILLAS = ['pichincha', 'guayaquil'];
const MARCAS = ['visa', 'mastercard'];

// Tarjetas activas para mostrar en la página de pagos (uso público de clientes)
exports.getPaymentCards = async (req, res) => {
  try {
    const cards = await PaymentCard.find({ activa: true }).sort({ orden: 1, createdAt: 1 });
    res.json({ success: true, data: cards });
  } catch (err) {
    console.error('Error al obtener las tarjetas de pago:', err);
    res.status(500).json({ success: false, error: 'Error al obtener las tarjetas de pago.' });
  }
};

// --- Administración de tarjetas de pago (solo admin) ---

exports.getPaymentCardsAdmin = async (req, res) => {
  try {
    const cards = await PaymentCard.find().sort({ orden: 1, createdAt: 1 });
    res.json({ success: true, data: cards });
  } catch (err) {
    console.error('Error al obtener las tarjetas de pago:', err);
    res.status(500).json({ success: false, error: 'Error al obtener las tarjetas de pago.' });
  }
};

exports.createPaymentCard = async (req, res) => {
  try {
    const { plantilla, banco, tipoCuenta, numeroCuenta, titular, marca, activa, orden } = req.body;

    if (!PLANTILLAS.includes(plantilla)) {
      return res.status(400).json({ success: false, error: 'La plantilla debe ser "pichincha" o "guayaquil".' });
    }
    if (typeof numeroCuenta !== 'string' || !numeroCuenta.trim()) {
      return res.status(400).json({ success: false, error: 'El número de cuenta es requerido.' });
    }
    if (typeof titular !== 'string' || !titular.trim()) {
      return res.status(400).json({ success: false, error: 'El titular es requerido.' });
    }

    const card = new PaymentCard({
      plantilla,
      banco: banco?.trim() || (plantilla === 'pichincha' ? 'Pichincha' : 'Guayaquil'),
      tipoCuenta: tipoCuenta?.trim() || 'Ahorros',
      numeroCuenta: numeroCuenta.trim(),
      titular: titular.trim(),
      marca: MARCAS.includes(marca) ? marca : 'visa',
      activa: activa !== undefined ? activa : true,
      orden: orden || 0,
    });
    await card.save();
    res.status(201).json({ success: true, data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: Object.values(err.errors).map((e) => e.message).join(' ') });
    }
    console.error('Error al crear la tarjeta de pago:', err);
    res.status(500).json({ success: false, error: 'Error al crear la tarjeta de pago.' });
  }
};

exports.updatePaymentCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.numeroCuenta) updates.numeroCuenta = updates.numeroCuenta.trim();
    if (updates.titular) updates.titular = updates.titular.trim();
    if (updates.banco) updates.banco = updates.banco.trim();
    if (updates.plantilla && !PLANTILLAS.includes(updates.plantilla)) {
      return res.status(400).json({ success: false, error: 'La plantilla debe ser "pichincha" o "guayaquil".' });
    }

    const card = await PaymentCard.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!card) {
      return res.status(404).json({ success: false, error: 'Tarjeta de pago no encontrada.' });
    }
    res.json({ success: true, data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: Object.values(err.errors).map((e) => e.message).join(' ') });
    }
    console.error('Error al actualizar la tarjeta de pago:', err);
    res.status(500).json({ success: false, error: 'Error al actualizar la tarjeta de pago.' });
  }
};

exports.deletePaymentCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PaymentCard.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Tarjeta de pago no encontrada.' });
    }
    res.json({ success: true, message: 'Tarjeta de pago eliminada.' });
  } catch (err) {
    console.error('Error al eliminar la tarjeta de pago:', err);
    res.status(500).json({ success: false, error: 'Error al eliminar la tarjeta de pago.' });
  }
};

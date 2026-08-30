const mongoose = require('mongoose');

const paymentCardSchema = new mongoose.Schema({
  plantilla: { type: String, enum: ['pichincha', 'guayaquil'], required: true },
  banco: { type: String, required: true, trim: true },
  tipoCuenta: { type: String, required: true, trim: true },
  numeroCuenta: { type: String, required: true, trim: true },
  titular: { type: String, required: true, trim: true },
  marca: { type: String, enum: ['visa', 'mastercard'], default: 'visa' },
  activa: { type: Boolean, default: true },
  orden: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('PaymentCard', paymentCardSchema);

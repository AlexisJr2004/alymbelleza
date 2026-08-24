const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 },
  minPurchase: { type: Number, default: 0, min: 0 },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date },
}, { timestamps: true });

// Un cupón de porcentaje mayor a 100% no tiene sentido
couponSchema.path('value').validate(function (value) {
  return this.type !== 'percentage' || value <= 100;
}, 'Un descuento por porcentaje no puede ser mayor a 100.');

module.exports = mongoose.model('Coupon', couponSchema);

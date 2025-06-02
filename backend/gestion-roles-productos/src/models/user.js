const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  role: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
  birthdate: { type: Date },
  gender: { type: String, enum: ['masculino', 'femenino', 'otro'] },
  address: { type: String },
  dni: { type: String },
  phone: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
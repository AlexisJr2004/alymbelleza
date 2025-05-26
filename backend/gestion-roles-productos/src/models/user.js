const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String }, // URL o ruta de la imagen
  role: { type: String, enum: ['cliente', 'admin'], default: 'cliente' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
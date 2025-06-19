const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Verificar si el modelo ya existe antes de definirlo
module.exports = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    availability: { type: Boolean, default: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    image: { type: String },
    imagePublicId: { type: String }, // public_id de Cloudinary, necesario para poder borrar la imagen real
    category: { type: String, enum: ['capilar', 'facial'], required: true },
    type: {
        type: String,
        enum: ['shampoo', 'acondicionador', 'mascarilla', 'crema', 'serum', 'aceite', 'tratamiento', 'otro'],
        default: 'otro',
    },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
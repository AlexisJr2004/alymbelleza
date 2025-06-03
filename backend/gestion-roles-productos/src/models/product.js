const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    availability: { type: Boolean, default: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    image: { type: String },
    category: { type: String, enum: ['capilar', 'facial'], required: true },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'La descripción del producto es requerida'],
        trim: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es requerido'],
        min: 0,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
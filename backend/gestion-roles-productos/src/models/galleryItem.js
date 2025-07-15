const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    url: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['escuela', 'especialidades', 'eventos', 'viajes-escolares', 'tratamiento_capilar', 'tratamiento_facial', 'local']
    },
    type: { type: String, enum: ['image', 'video'], required: true },
    filename: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const GalleryItem = mongoose.model('GalleryItem', gallerySchema);

module.exports = GalleryItem;
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // public_id de Cloudinary, necesario para poder borrar el archivo real
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
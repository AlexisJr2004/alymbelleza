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
    createdAt: { type: Date, default: Date.now },
    // Solo aplican a videos. posterSeconds es el instante (segundos) que el
    // admin eligió como portada; trimStart/trimEnd (opcionales) acotan el
    // rango que se reproduce. Ninguno reprocesa ni re-sube el archivo: ambos
    // se resuelven como transformaciones de Cloudinary al vuelo (so_/eo_)
    // sobre el mismo video ya subido.
    posterSeconds: { type: Number, default: 0, min: 0 },
    trimStart: { type: Number, min: 0 },
    trimEnd: { type: Number, min: 0 },
    // Duración total del video en segundos, leída en el navegador al elegir
    // el archivo (video.duration) — solo para mostrar un badge tipo "0:45"
    // en la tarjeta de la grilla, no se usa para nada del lado del servidor.
    duration: { type: Number, min: 0 }
});

const GalleryItem = mongoose.model('GalleryItem', gallerySchema);

module.exports = GalleryItem;
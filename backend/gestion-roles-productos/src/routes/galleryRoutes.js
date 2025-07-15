const express = require('express');
const router = express.Router();
const GalleryItem = require('../models/galleryItem');
const { verifyToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

// Configuración de Multer para memoria
const galleryStorage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Tipo de archivo no permitido. Solo imágenes y videos."), false);
  },
});

// GET pública
router.get('/', async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error al obtener galería' });
  }
});

// POST (solo admin)
router.post(
  '/',
  verifyToken,
  roleMiddleware(['admin']),
  galleryStorage.single('file'),
  async (req, res) => {
    try {
      const { category } = req.body;
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No se proporcionó ningún archivo" });
      if (!category) return res.status(400).json({ error: "La categoría es requerida" });
      const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
      const uploadOptions = {
        folder: `bella-beauty/gallery/${category}`,
        resource_type: fileType === 'video' ? 'video' : 'image',
      };
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      if (!result || !result.secure_url) throw new Error("Error al subir el archivo a Cloudinary");
      const galleryItem = new GalleryItem({
        url: result.secure_url,
        category,
        type: fileType,
        filename: result.original_filename,
        uploadedBy: req.user.id,
      });
      await galleryItem.save();
      res.json({
        success: true,
        message: `${fileType === 'image' ? 'Imagen' : 'Video'} subido exitosamente`,
        data: galleryItem,
      });
    } catch (error) {
      res.status(500).json({ error: "Error al subir el archivo", details: error.message });
    }
  }
);

// DELETE (solo admin)
router.delete(
  '/:id',
  verifyToken,
  roleMiddleware(['admin']),
  async (req, res) => {
    try {
      const item = await GalleryItem.findById(req.params.id);
      if (!item) return res.status(404).json({ error: "Elemento no encontrado" });
      // Eliminar de Cloudinary
      const urlParts = item.url.split('/');
      const filenameWithExt = urlParts[urlParts.length - 1];
      const filename = filenameWithExt.split('.')[0];
      const folder = urlParts.slice(-3, -1).join('/');
      const publicId = `${folder}/${filename}`;
      await cloudinary.uploader.destroy(publicId, {
        resource_type: item.type === 'video' ? 'video' : 'image'
      });
      await GalleryItem.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Elemento eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el elemento" });
    }
  }
);

module.exports = router;
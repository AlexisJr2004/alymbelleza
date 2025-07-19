const express = require("express");
const multer = require("multer");
const path = require("path");
const Testimonial = require("../models/Testimonial");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../../uploads");
const testimonialStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `testimonial-${Date.now()}${path.extname(file.originalname)}`),
});
const testimonialUpload = multer({
  storage: testimonialStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Tipo de archivo no permitido. Solo imágenes."), false);
  },
});

// Crear testimonio
router.post("/", authMiddleware, testimonialUpload.none(), async (req, res) => {
  try {
    const { name, role, comment, avatar } = req.body;
    if (!name || !role || !comment || !avatar) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son requeridos",
      });
    }
    const newTestimonial = new Testimonial({
      name,
      role,
      comment,
      avatar,
      userId: req.user._id, //
    });
    await newTestimonial.save();
    res.status(201).json({
      success: true,
      message: "Testimonio agregado exitosamente",
      data: newTestimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al procesar el testimonio",
    });
  }
});

// Obtener testimonios (paginado)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [testimonials, total] = await Promise.all([
      Testimonial.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Testimonial.countDocuments(),
    ]);
    // Forzar userId a string
    testimonials.forEach(t => t.userId = t.userId?.toString());
    res.json({
      success: true,
      count: testimonials.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al obtener testimonios",
    });
  }
});

// Editar testimonio
router.put("/:id", authMiddleware, testimonialUpload.none(), async (req, res) => {
  try {
    const { name, role, comment, avatar } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, error: "Testimonio no encontrado" });
    }
    // Solo el dueño puede editar
    if (testimonial.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "No autorizado" });
    }
    testimonial.name = name || testimonial.name;
    testimonial.role = role || testimonial.role;
    testimonial.comment = comment || testimonial.comment;
    testimonial.avatar = avatar || testimonial.avatar;
    await testimonial.save();
    res.json({ success: true, message: "Testimonio actualizado", data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al actualizar testimonio" });
  }
});

// Eliminar testimonio
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, error: "Testimonio no encontrado" });
    }
    // Solo el dueño puede eliminar
    if (testimonial.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "No autorizado" });
    }
    await testimonial.deleteOne();
    res.json({ success: true, message: "Testimonio eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al eliminar testimonio" });
  }
});

module.exports = router;
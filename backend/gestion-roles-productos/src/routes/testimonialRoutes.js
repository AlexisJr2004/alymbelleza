const express = require("express");
const multer = require("multer");
const Testimonial = require("../models/Testimonial");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Los testimonios solo llevan campos de texto (el avatar es una URL), no archivos
const upload = multer();

// Crear testimonio
router.post("/", verifyToken, upload.none(), async (req, res) => {
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
      userId: req.user._id,
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
router.put("/:id", verifyToken, upload.none(), async (req, res) => {
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
router.delete("/:id", verifyToken, async (req, res) => {
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

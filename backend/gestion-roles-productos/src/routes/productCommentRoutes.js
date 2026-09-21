const express = require("express");
const mongoose = require("mongoose");
const ProductComment = require("../models/productComment");
const Notification = require("../models/notification");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

const REACTION_TYPES = ["heart", "like", "dislike"];

// Sin nesting bajo /api/products para no interferir con la ruta genérica
// GET /api/products/:id que ya existe (productRoutes.js) — mount plano en
// app.js como /api/product-comments, mismo criterio que /api/testimonials.

// Listar comentarios de un producto (top-level + respuestas en un solo
// arreglo plano — el frontend agrupa por parentId, ver useProductComments.ts).
router.get("/", async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, error: "productId inválido" });
    }
    const comments = await ProductComment.find({ productId }).sort({ createdAt: 1 }).lean();
    comments.forEach((c) => {
      c.userId = c.userId?.toString();
      c.parentId = c.parentId ? c.parentId.toString() : null;
    });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener los comentarios" });
  }
});

// Crear comentario o respuesta (parentId presente = respuesta). Una
// respuesta genera además una Notification para el dueño del comentario
// respondido, salvo que se esté respondiendo a uno propio.
router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId, comment, parentId } = req.body;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, error: "productId inválido" });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, error: "El comentario es requerido" });
    }

    let parentComment = null;
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ success: false, error: "parentId inválido" });
      }
      parentComment = await ProductComment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({ success: false, error: "El comentario que intentas responder ya no existe" });
      }
    }

    const newComment = await ProductComment.create({
      productId,
      userId: req.user._id,
      name: req.user.name,
      avatar: req.user.profileImage || "",
      comment: comment.trim(),
      parentId: parentComment ? parentComment._id : null,
    });

    if (parentComment && parentComment.userId.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: parentComment.userId,
        type: "comment_reply",
        message: `${req.user.name} respondió a tu comentario`,
        productId,
        commentId: newComment._id,
      });
    }

    res.status(201).json({ success: true, message: "Comentario publicado", data: newComment });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al publicar el comentario" });
  }
});

// Editar (solo el dueño, solo el texto).
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, error: "El comentario es requerido" });
    }
    const existing = await ProductComment.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Comentario no encontrado" });
    }
    if (existing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "No autorizado" });
    }
    existing.comment = comment.trim();
    existing.editedAt = new Date();
    await existing.save();
    res.json({ success: true, message: "Comentario actualizado", data: existing });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al actualizar el comentario" });
  }
});

// Eliminar (solo el dueño) — en cascada con sus respuestas directas, para no
// dejar respuestas huérfanas apuntando a un parentId inexistente.
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const existing = await ProductComment.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Comentario no encontrado" });
    }
    if (existing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "No autorizado" });
    }
    await ProductComment.deleteMany({ $or: [{ _id: existing._id }, { parentId: existing._id }] });
    res.json({ success: true, message: "Comentario eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al eliminar el comentario" });
  }
});

// Reaccionar (corazón/like/dislike) — un usuario tiene a lo sumo una reacción
// por comentario; tocar el mismo ícono que ya tenías puesto lo quita (mismo
// comportamiento de "despresionar" que Facebook), tocar uno distinto la
// reemplaza.
router.post("/:id/react", verifyToken, async (req, res) => {
  try {
    const { type } = req.body;
    if (!REACTION_TYPES.includes(type)) {
      return res.status(400).json({ success: false, error: "Tipo de reacción inválido" });
    }
    const existing = await ProductComment.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Comentario no encontrado" });
    }
    const userId = req.user._id.toString();
    const current = existing.reactions.find((r) => r.userId.toString() === userId);
    if (current && current.type === type) {
      existing.reactions = existing.reactions.filter((r) => r.userId.toString() !== userId);
    } else {
      existing.reactions = existing.reactions.filter((r) => r.userId.toString() !== userId);
      existing.reactions.push({ userId: req.user._id, type });
    }
    await existing.save();
    res.json({ success: true, data: existing });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al reaccionar al comentario" });
  }
});

module.exports = router;

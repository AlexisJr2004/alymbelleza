const express = require("express");
const Notification = require("../models/notification");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Notificaciones del usuario logueado, más recientes primero. Se limita a
// 30 — esto es una campana, no un historial completo.
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener las notificaciones" });
  }
});

router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: "Notificación no encontrada" });
    }
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "No autorizado" });
    }
    notification.read = true;
    await notification.save();
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al actualizar la notificación" });
  }
});

router.patch("/read-all", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { $set: { read: true } });
    res.json({ success: true, message: "Notificaciones marcadas como leídas" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al actualizar las notificaciones" });
  }
});

module.exports = router;

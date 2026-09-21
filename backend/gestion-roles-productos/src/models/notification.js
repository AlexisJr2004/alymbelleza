const mongoose = require("mongoose");

// No existía ningún sistema de notificaciones genérico en el backend (la
// "campana" del sitio público solo mostraba citas, ver NotificationBell.tsx)
// — este modelo es la primera pieza de uno real, pensado para poder sumar
// más "type" a futuro sin cambiar el esquema. `message` va ya armado en
// español al crearla (en vez de reconstruirlo en el frontend a partir de
// piezas sueltas), igual que el resto de textos de notificación de este
// proyecto.
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["comment_reply"],
    required: true,
  },
  message: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductComment" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("Notification", notificationSchema);

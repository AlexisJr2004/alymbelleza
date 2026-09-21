const mongoose = require("mongoose");

// Un solo modelo cubre tanto comentarios de primer nivel como respuestas:
// parentId null = comentario sobre el producto, parentId = id de otro
// ProductComment = respuesta a ese comentario (un solo nivel de anidado,
// igual que reseñas de Amazon/comentarios de YouTube — no se permite
// responder a una respuesta). name/avatar se copian del usuario al momento
// de comentar (mismo patrón que Testimonial.js) en vez de poblar userId en
// cada lectura.
const reactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["heart", "like", "dislike"], required: true },
  },
  { _id: false }
);

const productCommentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    comment: {
      type: String,
      required: [true, "El comentario es requerido"],
      trim: true,
      maxlength: [500, "El comentario no puede exceder los 500 caracteres"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductComment",
      default: null,
      index: true,
    },
    // Un usuario tiene a lo sumo una reacción por comentario (se reemplaza o
    // se quita al volver a tocar el mismo ícono, ver productCommentRoutes.js).
    reactions: { type: [reactionSchema], default: [] },
    createdAt: { type: Date, default: Date.now, index: true },
    editedAt: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("ProductComment", productCommentSchema);

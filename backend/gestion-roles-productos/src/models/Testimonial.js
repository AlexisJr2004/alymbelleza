const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
    },
    role: {
      type: String,
      required: [true, "El rol/título es requerido"],
      trim: true,
      maxlength: [100, "El rol no puede exceder los 100 caracteres"],
    },
    comment: {
      type: String,
      required: [true, "El comentario es requerido"],
      trim: true,
      maxlength: [500, "El comentario no puede exceder los 500 caracteres"],
    },
    avatar: {
      type: String,
      required: [true, "La imagen de avatar es requerida"],
      validate: {
        validator: (v) => /\.(jpe?g|png|gif|webp)$/i.test(v),
        message: "La URL de la imagen no es válida",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cors = require("cors");
const authRoutes = require('./gestion-roles-productos/src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Configuración de Middlewares
app.use(
  cors({
    origin: [
      "https://alexisjr2004.github.io",
      "https://aly-mbelleza-backend.onrender.com",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 2. Conexión a MongoDB
const DB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://snietod:kLSSYgP2D4wmS59m@bellabeauty.y61attk.mongodb.net/bellaBeauty?retryWrites=true&w=majority&appName=bellaBeauty";

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: "majority",
  authSource: "admin",
};

mongoose
  .connect(DB_URI, mongooseOptions)
  .then(() => console.log("✅ MongoDB conectado exitosamente"))
  .catch((err) => {
    console.error("❌ Error de conexión a MongoDB:", err.message);
    process.exit(1);
  });

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB desconectado. Intentando reconectar en 5 segundos...");
  setTimeout(() => mongoose.connect(DB_URI, mongooseOptions), 5000);
});

// 3. Carpeta de uploads y configuración de Multer
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

// 4. Servir archivos estáticos de uploads (¡esto debe ir antes del frontend!)
app.use(
  "/uploads",
  express.static(uploadDir, {
    maxAge: "1y",
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        res.setHeader("Content-Type", getContentType(filePath));
      }
    },
  })
);

// 5. Rutas de autenticación y API
app.use('/api/auth', authRoutes);

// 6. Resto de middlewares y rutas (testimonios, email, etc.)

// Modelo de Testimonio
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

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

// Multer para testimonios (usa el mismo uploadDir y configuración)
const testimonialStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `testimonial-${Date.now()}${path.extname(file.originalname)}`)
});
const testimonialUpload = multer({
  storage: testimonialStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Tipo de archivo no permitido. Solo imágenes."), false);
  }
});

// Ruta para subir testimonios
app.post("/api/testimonials", testimonialUpload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Debe proporcionar una imagen válida",
      });
    }
    const { name, role, comment } = req.body;
    if (!name || !role || !comment) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: "Todos los campos son requeridos",
      });
    }
    const avatarUrl = `/uploads/${req.file.filename}`;
    const newTestimonial = new Testimonial({
      name,
      role,
      comment,
      avatar: avatarUrl,
    });
    await newTestimonial.save();
    res.status(201).json({
      success: true,
      message: "Testimonio agregado exitosamente",
      data: newTestimonial,
    });
  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      error: "Error al procesar el testimonio",
    });
  }
});

// Ruta para obtener testimonios (paginada)
app.get("/api/testimonials", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [testimonials, total] = await Promise.all([
      Testimonial.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(),
    ]);
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

// Configuración de Nodemailer
const mailConfig = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "duranalexis879@gmail.com",
    pass: process.env.EMAIL_PASS || "yccz nfxk mtfk mhwc",
  },
  tls: {
    rejectUnauthorized: false,
  },
};
const transporter = nodemailer.createTransport(mailConfig);

// Ruta para enviar emails de contacto
app.post("/api/send-email", express.json(), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son requeridos",
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: "El email no es válido",
      });
    }
    const mailOptions = {
      from: `"${name}" <${mailConfig.auth.user}>`,
      to: mailConfig.auth.user,
      replyTo: email,
      subject: `Nuevo mensaje de contacto: ${name}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4a5568;">Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f7fafc; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Correo enviado exitosamente",
      messageId: info.messageId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al enviar el mensaje",
      details: error.message,
    });
  }
});

// 7. Servir el frontend
app.use(
  express.static(path.join(__dirname, "../frontend"), {
    extensions: ["html", "htm"],
    index: "login.html",
  })
);

// 8. Catch-all para SPA (debe ir al final)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// 9. Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error:
        err.code === "LIMIT_FILE_SIZE"
          ? "El archivo es demasiado grande (máximo 15MB)"
          : "Error al subir el archivo",
      details: err.message,
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({
      success: false,
      error: "Error de validación",
      details: errors,
    });
  }

  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 10. Inicio del servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📌 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  Base de datos: ${mongoose.connection.host}`);
});

process.on("SIGTERM", () => {
  console.log("🛑 Recibido SIGTERM. Cerrando servidor...");
  server.close(() => {
    console.log("🔌 Servidor cerrado");
    mongoose.connection.close(false, () => {
      console.log("🗄️  Conexión a MongoDB cerrada");
      process.exit(0);
    });
  });
});

process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
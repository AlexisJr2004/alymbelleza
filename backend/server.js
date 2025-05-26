require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cors = require("cors");

// Configuración inicial
const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// 1. Configuración de Middlewares
// =============================================
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

// =============================================
// 2. Configuración de la Base de Datos
// =============================================
const configureDatabase = () => {
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
      console.error(
        "ℹ️ Cadena de conexión usada:",
        DB_URI.replace(/:\/\/.*@/, "://<usuario>:<contraseña>@")
      );
      process.exit(1);
    });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB desconectado. Intentando reconectar en 5 segundos...");
    setTimeout(() => mongoose.connect(DB_URI, mongooseOptions), 5000);
  });
};

// =============================================
// 3. Configuración de Multer para Subida de Archivos
// =============================================
const configureFileUploads = () => {
  const uploadDir = path.join(__dirname, "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `testimonial-${Date.now()}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WEBP)"
        ),
        false
      );
    }
  };

  return multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
    fileFilter,
  });
};

const upload = configureFileUploads();

// =============================================
// 4. Modelos de Base de Datos
// =============================================
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

// =============================================
// 5. Configuración de Nodemailer
// =============================================
const configureEmail = () => {
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

  return nodemailer.createTransport(mailConfig);
};

const transporter = configureEmail();

// =============================================
// 6. Rutas de la API
// =============================================

// Middleware para servir archivos estáticos
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public", "uploads"), {
    maxAge: "1y",
    immutable: true,
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      
      if (contentTypes[ext]) {
        res.setHeader("Content-Type", contentTypes[ext]);
      }
    },
  })
);

// Rutas de Testimonios
app.post("/api/testimonials", upload.single("avatar"), async (req, res) => {
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
    const newTestimonial = new Testimonial({ name, role, comment, avatar: avatarUrl });
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
    console.error("Error al obtener testimonios:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener testimonios",
    });
  }
});

// Ruta de Envío de Emails
app.post("/api/send-email", multer().none(), async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son requeridos",
        received: req.body,
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: "El email no es válido",
      });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER || "duranalexis879@gmail.com"}>`,
      to: process.env.EMAIL_USER || "duranalexis879@gmail.com",
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
    console.log("Email enviado:", info.messageId);

    res.json({
      success: true,
      message: "Correo enviado exitosamente",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error al enviar email:", error);
    res.status(500).json({
      success: false,
      error: "Error al enviar el mensaje",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// =============================================
// 7. Manejo de Archivos Estáticos y Frontend
// =============================================
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "public", "uploads"), {
    setHeaders: (res, path) => {
      if (path.match(/\.(jpg|png|webp)$/i)) {
        res.setHeader("Cache-Control", "public, max-age=86400");
      }
    },
  })
);

app.use(
  express.static(path.join(__dirname, "../frontend"), {
    extensions: ["html", "htm"],
    index: "index.html",
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// =============================================
// 8. Manejo Centralizado de Errores
// =============================================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: err.code === "LIMIT_FILE_SIZE" 
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

// =============================================
// 9. Inicialización del Servidor
// =============================================
const startServer = () => {
  configureDatabase();
  
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
};

startServer();
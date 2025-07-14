require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cors = require("cors");
const authRoutes = require("./gestion-roles-productos/src/routes/authRoutes");
const productRoutes = require("./gestion-roles-productos/src/routes/productRoutes");
const appointmentRoutes = require('./gestion-roles-productos/src/routes/appointmentRoutes');
const cartRoutes = require('./gestion-roles-productos/src/routes/cartRoutes');
const { verifyToken: authMiddleware } = require('./gestion-roles-productos/src/middlewares/authMiddleware');
const { verifyToken } = require('./gestion-roles-productos/src/middlewares/authMiddleware');
const roleMiddleware = require('./gestion-roles-productos/src/middlewares/roleMiddleware');
const cloudinary = require('./gestion-roles-productos/src/utils/cloudinary');
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Configuración de Middlewares
app.use(
  cors({
    origin: [
      "https://alexisjr2004.github.io",
      "https://aly-mbelleza-backend.onrender.com",
    ],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use('/api/appointments', appointmentRoutes);
app.use('/api/cart', cartRoutes);

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
  console.log(
    "⚠️ MongoDB desconectado. Intentando reconectar en 5 segundos..."
  );
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
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
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
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

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

// Ruta para subir testimonios (ahora acepta avatar como URL)
app.post("/api/testimonials", testimonialUpload.none(), async (req, res) => {
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

// Editar testimonio
app.put("/api/testimonials/:id", testimonialUpload.none(), async (req, res) => {
  try {
    const { name, role, comment, avatar } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, error: "Testimonio no encontrado" });
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
app.delete("/api/testimonials/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, error: "Testimonio no encontrado" });
    }
    res.json({ success: true, message: "Testimonio eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al eliminar testimonio" });
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

    // Validación más robusta
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
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

    // Configuración más segura del correo
    const mailOptions = {
      from: `"Bella Beauty Contacto" <${mailConfig.auth.user}>`,
      to: mailConfig.auth.user,
      replyTo: `${name} <${email}>`,
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      html: `
        <div style="font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eaeaea;">
            <img src="https://res.cloudinary.com/dokmxt0ja/image/upload/v1748585094/mujer-con-pelo-largo_ppap6w.png" alt="Bella Beauty Logo" style="max-width: 80px; height: auto;">
            <h1 style="color: #7e22ce; font-size: 24px; margin-top: 15px; font-weight: 600;">Nuevo Mensaje de Contacto</h1>
          </div>

          <div style="padding: 25px 30px;">
            <div style="margin-bottom: 25px;">
              <h2 style="color: #4b5563; font-size: 18px; font-weight: 500; margin-bottom: 5px;">Información del Cliente</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 30%; padding: 8px 0; color: #6b7280; font-weight: 500;">Nombre:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 400;">${name}</td>
                </tr>
                <tr>
                  <td style="width: 30%; padding: 8px 0; color: #6b7280; font-weight: 500;">Email:</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${email}" style="color: #7e22ce; text-decoration: none; font-weight: 500;">${email}</a>
                  </td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 30px;">
              <h2 style="color: #4b5563; font-size: 18px; font-weight: 500; margin-bottom: 10px;">Mensaje</h2>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <p style="margin: 0; color: #374151; line-height: 1.7; white-space: pre-line;">${message}</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #7e22ce; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 500; font-size: 15px; box-shadow: 0 2px 5px rgba(126, 34, 206, 0.2);">Responder al Cliente</a>
            </div>
          </div>

          <!-- Pie de página -->
          <div style="padding: 20px; background-color: #f9fafb; text-align: center; border-top: 1px solid #eaeaea; font-size: 13px; color: #6b7280;">
            <p style="margin: 0 0 10px 0;">Este mensaje fue enviado desde el formulario de contacto de Bella Beauty</p>
            <p style="margin: 0;">
              <a href="https://bellabeauty.com" style="color: #7e22ce; text-decoration: none;">bellabeauty.com</a> | 
              <a href="tel:+1234567890" style="color: #7e22ce; text-decoration: none;">+1 234 567 890</a> | 
              <a href="mailto:info@bellabeauty.com" style="color: #7e22ce; text-decoration: none;">info@bellabeauty.com</a>
            </p>
          </div>
        </div>
      `,
    };

    // Verificar la conexión con el servidor SMTP primero
    await transporter.verify();

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Correo enviado exitosamente",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error al enviar correo:", error);

    let errorMessage = "Error al enviar el mensaje";
    if (error.code === "EAUTH") {
      errorMessage = "Error de autenticación con el servidor de correo";
    } else if (error.code === "ECONNECTION") {
      errorMessage = "No se pudo conectar al servidor de correo";
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
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

// Configuración de Multer para subir archivos
const galleryStorage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB para videos
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido. Solo imágenes y videos."), false);
    }
  },
});

// Modelo para elementos de galería
const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['escuela', 'especialidades', 'eventos', 'viajes-escolares']
  },
  type: { type: String, enum: ['image', 'video'], required: true },
  filename: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const GalleryItem = mongoose.model('GalleryItem', gallerySchema);

// Ruta para subir elementos a la galería (solo admin)
app.post("/api/gallery", verifyToken, roleMiddleware(['admin']), galleryStorage.single('file'), async (req, res) => {
    try {
        const { category } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No se proporcionó ningún archivo" });
        }

        if (!category) {
            return res.status(400).json({ error: "La categoría es requerida" });
        }

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
        console.error("Error al subir archivo:", error);
        res.status(500).json({ error: "Error al subir el archivo", details: error.message });
    }
});

// Ruta para obtener elementos de la galería
app.get("/api/gallery", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    
    const items = await GalleryItem.find(filter)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error("Error al obtener galería:", error);
    res.status(500).json({ error: "Error al obtener elementos de la galería" });
  }
});

// Ruta para eliminar elemento de galería (solo admin)
app.delete("/api/gallery/:id", authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: "Elemento no encontrado" });
    }

    // Extraer public_id de Cloudinary de la URL
    const urlParts = item.url.split('/');
    const filenameWithExt = urlParts[urlParts.length - 1];
    const filename = filenameWithExt.split('.')[0];
    const folder = urlParts.slice(-3, -1).join('/');
    const publicId = `${folder}/${filename}`;

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(publicId, {
      resource_type: item.type === 'video' ? 'video' : 'image'
    });
     
    // Eliminar de la base de datos
    await GalleryItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Elemento eliminado exitosamente"
    });

  } catch (error) {
    console.error("Error al eliminar elemento:", error);
    res.status(500).json({ error: "Error al eliminar el elemento" });
  }
});

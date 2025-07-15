require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const authRoutes = require("./gestion-roles-productos/src/routes/authRoutes");
const productRoutes = require("./gestion-roles-productos/src/routes/productRoutes");
const galleryRoutes = require('./gestion-roles-productos/src/routes/galleryRoutes');
const testimonialRoutes = require("./gestion-roles-productos/src/routes/testimonialRoutes");
const contactRoutes = require("./gestion-roles-productos/src/routes/contactRoutes");

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
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);

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
app.use("/api/testimonials", testimonialRoutes);

// 6. Servir el frontend
app.use(
  express.static(path.join(__dirname, "../frontend"), {
    extensions: ["html", "htm"],
    index: "login.html",
  })
);

// 7. Catch-all para SPA (debe ir al final)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// 8. Manejo centralizado de errores
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

// 9. Inicio del servidor
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
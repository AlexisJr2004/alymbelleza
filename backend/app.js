const express = require("express");
require("express-async-errors"); // reenvía rechazos de promesas en rutas async al middleware de errores en vez de tumbar el proceso
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const authRoutes = require("./gestion-roles-productos/src/routes/authRoutes");
const productRoutes = require("./gestion-roles-productos/src/routes/productRoutes");
const galleryRoutes = require("./gestion-roles-productos/src/routes/galleryRoutes");
const testimonialRoutes = require("./gestion-roles-productos/src/routes/testimonialRoutes");
const contactRoutes = require("./gestion-roles-productos/src/routes/contactRoutes");
const cartRoutes = require("./gestion-roles-productos/src/routes/cartRoutes");
const appointmentRoutes = require("./gestion-roles-productos/src/routes/appointmentRoutes");
const couponRoutes = require("./gestion-roles-productos/src/routes/couponRoutes");

const app = express();

// 1. Seguridad de cabeceras HTTP
// El CSP por defecto de helmet bloquearía los CDN (Swiper, SweetAlert2, Font Awesome) y los
// scripts inline que usan varias páginas del frontend; se desactiva hasta poder consolidar
// esos recursos en el build local.
app.use(helmet({ contentSecurityPolicy: false }));

// 2. CORS restringido a orígenes conocidos
const allowedOrigins = [
  "https://alexisjr2004.github.io",
  "https://aly-mbelleza-backend.onrender.com",
];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 3. Sanitiza el body/query contra operadores de MongoDB ($gt, $ne, etc.)
app.use(mongoSanitize());

// 4. Health check para Render y monitoreo externo (antes de cualquier límite de peticiones)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// 5. Límite de peticiones en los endpoints más sensibles a fuerza bruta / spam
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
});
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
});
// Evita que alguien intente adivinar códigos de cupón por fuerza bruta
const couponLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
});

// 6. Rutas de la API
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/coupons/validate", couponLimiter);
app.use("/api/coupons", couponRoutes);

// 7. Cualquier ruta /api no reconocida devuelve 404 en JSON, no el SPA fallback
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, error: "Recurso no encontrado" });
});

// 8. Servir el frontend estático
app.use(
  express.static(path.join(__dirname, "../frontend"), {
    extensions: ["html", "htm"],
    index: "login.html",
  })
);

// 9. Catch-all para SPA (debe ir al final)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// 10. Manejo centralizado de errores
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

module.exports = app;

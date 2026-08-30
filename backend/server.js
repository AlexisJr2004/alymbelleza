require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");
const app = require("./app");
const PaymentCard = require("./gestion-roles-productos/src/models/paymentCard");

// En Render (y otras plataformas similares) las conexiones salientes por IPv6 a veces se
// quedan esperando sin responder, aunque el host sí resuelva por IPv6 (ej. smtp.gmail.com).
// Esto hace que Node prefiera IPv4 al resolver dominios, evitando timeouts de conexión.
dns.setDefaultResultOrder("ipv4first");

// Variables de entorno obligatorias: sin ellas el servidor no puede operar de forma segura
const REQUIRED_ENV_VARS = ["MONGODB_URI", "JWT_SECRET"];
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Faltan variables de entorno obligatorias: ${missing.join(", ")}`);
  process.exit(1);
}

// Variables opcionales cuya ausencia solo apaga una función concreta (correo, imágenes, etc.)
const OPTIONAL_ENV_VARS = [
  "EMAIL_USER",
  "EMAIL_PASS",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "FRONTEND_URL",
];
OPTIONAL_ENV_VARS.filter((key) => !process.env[key]).forEach((key) => {
  console.warn(`⚠️  Variable de entorno "${key}" no definida — algunas funciones no estarán disponibles.`);
});

const PORT = process.env.PORT || 5000;

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: "majority",
  authSource: "admin",
};

// Antes de esta función las tarjetas de pago (Pichincha, Guayaquil) estaban escritas a mano
// en pagos.html. Al pasarlas a la base de datos, este bootstrap las crea una sola vez si la
// colección está vacía, para que el sitio en producción no se quede sin tarjetas tras el deploy.
const seedPaymentCardsIfEmpty = async () => {
  const count = await PaymentCard.countDocuments();
  if (count > 0) return;
  await PaymentCard.insertMany([
    {
      plantilla: "pichincha",
      banco: "Pichincha",
      tipoCuenta: "Ahorros",
      numeroCuenta: "2209 0506 71",
      titular: "Merly Macias Cevallos",
      marca: "visa",
      orden: 0,
    },
    {
      plantilla: "guayaquil",
      banco: "Guayaquil",
      tipoCuenta: "Ahorros",
      numeroCuenta: "2209 0506 71",
      titular: "Merly Macias Cevallos",
      marca: "mastercard",
      orden: 1,
    },
  ]);
  console.log("✅ Tarjetas de pago iniciales creadas (Pichincha, Guayaquil).");
};

mongoose
  .connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => console.log("✅ MongoDB conectado exitosamente"))
  .then(seedPaymentCardsIfEmpty)
  .catch((err) => {
    console.error("❌ Error de conexión a MongoDB:", err.message);
    process.exit(1);
  });

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB desconectado. Intentando reconectar en 5 segundos...");
  setTimeout(() => mongoose.connect(process.env.MONGODB_URI, mongooseOptions), 5000);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📌 Entorno: ${process.env.NODE_ENV || "development"}`);
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

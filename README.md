<p align="center">
  <img src="https://res.cloudinary.com/dokmxt0ja/image/upload/v1752727246/logo_mybdvl.png" alt="Bella Beauty" width="140"/>
</p>

<h1 align="center">Bella Beauty</h1>
<p align="center"><em>Plataforma web para la gestión integral de un centro de belleza</em></p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
  <img alt="Jest" src="https://img.shields.io/badge/Tests-Jest-C21325?style=flat-square&logo=jest&logoColor=white">
  <img alt="Licencia" src="https://img.shields.io/badge/Licencia-Propietaria-6b7280?style=flat-square">
</p>

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Características](#características)
- [Pila tecnológica](#pila-tecnológica)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y configuración](#instalación-y-configuración)
- [Variables de entorno](#variables-de-entorno)
- [Pruebas](#pruebas)
- [Seguridad](#seguridad)
- [Despliegue](#despliegue)
- [Contacto](#contacto)
- [Licencia](#licencia)

---

## Descripción general

Bella Beauty es una plataforma web para la gestión integral de un centro de belleza. Permite a los clientes reservar citas, comprar productos, gestionar su perfil y dejar testimonios, mientras que el equipo administrativo gestiona el catálogo y la galería desde un panel protegido por rol. El sistema está construido como una aplicación Node.js/Express con un frontend estático, pensado para desplegarse como un único servicio en Render.

---

## Características

| Módulo | Descripción |
|---|---|
| Reserva de citas | Los clientes agendan, consultan y cancelan sus citas desde su perfil. |
| Catálogo de productos | Exploración de productos por categoría, con imágenes servidas desde Cloudinary. |
| Carrito y pagos | Carrito de compras persistente por usuario y flujo de pago con comprobante descargable. |
| Panel de administración | Alta, edición y baja de productos y galería, restringido al rol `admin`. |
| Testimonios | Los clientes publican, editan y eliminan sus propios testimonios; visibles para todos. |
| Gestión de perfil | Edición de datos personales y foto de perfil. |
| Recuperación de contraseña | Flujo de restablecimiento por correo con token de un solo uso y expiración de una hora. |
| Galería multimedia | Imágenes y videos de trabajos realizados, organizados por categoría. |
| Accesibilidad | Control de zoom, tamaño de fuente y tipografía desde la interfaz. |

---

## Pila tecnológica

<p>
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
  <img alt="Swiper" src="https://img.shields.io/badge/Swiper.js-6332F6?style=flat-square&logo=swiper&logoColor=white">
  <img alt="Font Awesome" src="https://img.shields.io/badge/Font_Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white">
</p>
<p>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white">
  <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white">
  <img alt="Helmet" src="https://img.shields.io/badge/Helmet-security-49b02d?style=flat-square">
  <img alt="Multer" src="https://img.shields.io/badge/Multer-file_uploads-orange?style=flat-square">
</p>
<p>
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white">
  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-ODM-880000?style=flat-square">
  <img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white">
  <img alt="Jest" src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white">
</p>

| Capa | Detalle |
|---|---|
| Frontend | HTML5, Tailwind CSS (compilado con Tailwind CLI, sin CDN), JavaScript, Swiper.js, Font Awesome. |
| Backend | Node.js, Express, JWT, Multer, Helmet, express-rate-limit, express-mongo-sanitize. |
| Base de datos | MongoDB Atlas vía Mongoose. |
| Almacenamiento de archivos | Cloudinary (perfil, productos y galería). |
| Pruebas | Jest + Supertest. |
| Integraciones externas | Nodemailer (Gmail), WhatsApp, OpenAI (chatbot, opcional). |

---

## Estructura del proyecto

```plaintext
/
├── backend/
│   ├── app.js               # Definición de la app Express (middlewares y rutas)
│   ├── server.js            # Arranque: valida variables de entorno, conecta Mongo y levanta el servidor
│   ├── package.json
│   ├── .env.example         # Variables de entorno requeridas (copiar como .env)
│   ├── tests/                # Pruebas con Jest + Supertest
│   └── gestion-roles-productos/
│       └── src/
│           ├── controllers/
│           ├── middlewares/
│           ├── models/
│           ├── routes/
│           └── utils/
├── frontend/
│   ├── index.html
│   ├── productos.html
│   ├── carrito.html
│   ├── pagos.html
│   ├── perfil.html
│   ├── admin-productos.html
│   ├── login.html
│   ├── register.html
│   ├── forgot-password.html
│   ├── reset-password.html
│   ├── package.json          # Build de Tailwind CSS
│   ├── tailwind.config.js
│   ├── css/
│   │   ├── input.css         # Fuente de Tailwind (@tailwind base/components/utilities)
│   │   ├── tailwind.css      # Generado por `npm run build:css`; se versiona porque Render no compila el frontend
│   │   └── style.css         # Estilos propios del proyecto
│   ├── js/
│   └── img/
├── .gitignore
└── README.md
```

---

## Instalación y configuración

**Requisitos:** Node.js 20.x, una cuenta de MongoDB Atlas y, opcionalmente, credenciales de Cloudinary y Gmail.

1. **Clonar el repositorio**

   ```sh
   git clone [URL_DEL_REPOSITORIO]
   cd alymbelleza
   ```

2. **Backend**

   ```sh
   cd backend
   npm install
   cp .env.example .env    # completar con credenciales propias (ver sección Variables de entorno)
   npm start                # o "npm run dev" para recarga automática con nodemon
   ```

   El servidor no arranca si faltan `MONGODB_URI` o `JWT_SECRET`: es una validación intencional para no depender nunca de credenciales por defecto en el código.

3. **Frontend**

   ```sh
   cd frontend
   npm install
   npm run build:css        # genera css/tailwind.css a partir de las clases usadas en HTML y JS
   # npm run watch:css      # opcional: regenera el CSS automáticamente mientras se edita
   ```

   Después, abrir `frontend/index.html` en el navegador o servir la carpeta con un servidor estático. Cualquier cambio de clases de Tailwind en el HTML o en `js/main.js` requiere volver a ejecutar `build:css` antes de hacer commit, ya que el archivo generado se versiona y Render no ejecuta ningún paso de build para el frontend.

---

## Variables de entorno

Definidas en `backend/.env.example`. En Render se configuran desde el panel del servicio (Environment), nunca en el repositorio.

| Variable | Obligatoria | Descripción |
|---|---|---|
| `MONGODB_URI` | Sí | Cadena de conexión a MongoDB Atlas. |
| `JWT_SECRET` | Sí | Clave para firmar y verificar los tokens de sesión. |
| `PORT` | No | Puerto del servidor (por defecto 5000). |
| `NODE_ENV` | No | `development` o `production`. |
| `FRONTEND_URL` | No | URL pública del frontend; se usa en el enlace de recuperación de contraseña. |
| `EMAIL_USER` / `EMAIL_PASS` | No | Cuenta de Gmail para el envío de correo (`EMAIL_PASS` debe ser una contraseña de aplicación). |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | No | Credenciales de Cloudinary para imágenes de perfil, productos y galería. |

---

## Pruebas

```sh
cd backend
npm test
```

La suite usa Jest y Supertest sobre la app de Express (`app.js`) sin depender de una conexión real a MongoDB, cubriendo las validaciones de entrada de autenticación (formato de email, longitud de contraseña, rechazo de payloads no textuales) y el healthcheck.

---

## Seguridad

- Contraseñas con hash `bcrypt`; los tokens de sesión son JWT firmados con `JWT_SECRET`.
- Cabeceras HTTP reforzadas con Helmet.
- Límite de peticiones (`express-rate-limit`) en los endpoints de autenticación y contacto.
- Sanitización de `body`/`query` contra operadores de MongoDB (`express-mongo-sanitize`).
- Autorización por rol (`admin` / `cliente`) centralizada en un único middleware.
- CORS restringido a una lista explícita de orígenes permitidos.
- Errores de servidor registrados internamente; nunca se exponen detalles internos al cliente.

Para reportar una vulnerabilidad, usar los datos de contacto de esta misma página.

---

## Despliegue

La aplicación está pensada para desplegarse como un único servicio web en Render:

- Directorio raíz del servicio: `backend/` (el servidor Express sirve también los archivos estáticos de `frontend/`).
- Comando de build: `npm install`; comando de arranque: `npm start`.
- Variables de entorno configuradas en el panel de Render (ver [Variables de entorno](#variables-de-entorno)).
- Endpoint `GET /health` disponible para el monitoreo del servicio.

---

## Contacto

- <img src="https://img.icons8.com/color/24/000000/new-post.png" width="18" alt="Correo"/> **Correo:** [info@bellabeauty.com](mailto:info@bellabeauty.com)
- <img src="https://img.icons8.com/color/24/000000/marker.png" width="18" alt="Dirección"/> **Dirección:** Av. Principal 123, Ciudad
- <img src="https://img.icons8.com/color/24/000000/phone.png" width="18" alt="Teléfono"/> **Teléfono:** +1 234 567 890

---

## Licencia

Software propietario. Todos los derechos reservados © 2024 Bella Beauty.

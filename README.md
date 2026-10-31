<div align="center">

# Bella Beauty

**Belleza, cuidado y una experiencia digital pensada para cada visita.**

Tienda · Citas · Galería · Gestión del negocio

[![CI](https://github.com/AlexisJr2004/alymbelleza/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexisJr2004/alymbelleza/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-222222?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)

[Visitar el sitio](https://aly-mbelleza-backend.onrender.com/) · [Diseño e interfaz](docs/homepage-redesign.md) · [Configuración](#configuración) · [Desarrollo](#desarrollo)

<img src="frontend/public-app/public/img/storefront/beauty-hero.jpg" alt="Imagen editorial de Bella Beauty" width="960">

</div>

## El proyecto

Bella Beauty reúne una tienda de productos de belleza, reservas de citas y una galería de trabajos en una misma plataforma. El sitio público y el panel administrativo son aplicaciones independientes de React que comparten una API de Express y datos en MongoDB.

La interfaz pública utiliza fondos blancos, acentos rosados, tipografía editorial y espacios compactos. En móvil, una barra flotante permite acceder a Inicio, Galería, Citas, Favoritos y Carrito.

## Experiencia y funciones

| Para clientes | Para el equipo |
| :--- | :--- |
| Catálogo con búsqueda, categorías, precios, ofertas y favoritos. | Gestión de productos, disponibilidad y existencias. |
| Detalle del producto con comentarios, respuestas y reacciones. | Panel de resumen y ranking. |
| Carrito por usuario y aplicación de cupones. | Gestión de cupones y pedidos. |
| Creación de pedidos, cuentas bancarias y resumen PDF. | Administración de las cuentas de pago. |
| Calendario de citas y coordinación por WhatsApp. | Gestión de usuarios y citas. |
| Galería de imágenes y videos con visor y descarga. | Publicación y eliminación de contenido de galería desde el sitio público. |
| Perfil, foto personal y recuperación de contraseña por correo. | Acceso protegido por rol de administrador. |
| Testimonios y contacto desde el inicio. | Recepción de consultas por correo. |

**Pagos:** el flujo muestra cuentas bancarias y genera el pedido y su resumen PDF con el identificador registrado en el servidor. No integra una pasarela de cobro con tarjeta ni confirma automáticamente una transferencia.

**Accesibilidad:** controles de zoom, tamaño de texto, tipografía y lectura de página cuando el navegador la admite. Los diálogos gestionan el foco, permiten cierre con Escape y limitan su tamaño al espacio disponible.

El panel administrativo utiliza tablas e indicadores compactos, filtros plegables en móvil y un resumen que prioriza ingresos y pedidos. Los análisis secundarios se pueden desplegar cuando se necesitan.

## Arquitectura

| Componente | Ubicación | Función |
| :--- | :--- | :--- |
| Sitio público | `frontend/public-app` | React 19, TypeScript 6, Vite 8, Tailwind CSS 3, React Router y TanStack Query. |
| Administración | `frontend/admin-app` | Aplicación React independiente, publicada bajo `/admin`. |
| API | `backend` | Express 4, Mongoose 7, JWT, bcrypt, validación y autorización por rol. |
| Archivos | Cloudinary | Imágenes de productos y perfiles; imágenes y videos de galería. |
| Correo | Resend / SMTP | Contacto y recuperación de contraseña; Resend utiliza HTTPS. |
| Verificación | Jest, Supertest y TypeScript | Pruebas del backend y compilación de las dos aplicaciones. |

```text
alymbelleza/
├── backend/
│   ├── app.js                    # API, seguridad y publicación de ambas SPA
│   ├── server.js                 # Arranque y conexión a MongoDB
│   ├── gestion-roles-productos/src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── tests/
│   └── .env.example
├── frontend/
│   ├── public-app/
│   │   ├── src/                  # Páginas, componentes, hooks y estilos
│   │   ├── public/               # Imágenes, fuentes y archivos para buscadores
│   │   └── dist/                 # Compilación servida por Express
│   ├── admin-app/
│   │   ├── src/
│   │   └── dist/
│   └── img/                      # Recursos compartidos por el servidor
├── docs/homepage-redesign.md
└── .github/workflows/ci.yml
```

Las dos carpetas `dist/` están versionadas porque el servidor las publica directamente. Deben regenerarse cuando se modifica una aplicación.

## Configuración

Necesitas Node.js **20.19 o superior dentro de la rama 20.x**, npm y una base de datos MongoDB. El backend declara Node 20.x; Vite requiere al menos 20.19 dentro de esa rama.

Instala las dependencias desde la raíz:

```sh
npm --prefix backend ci
npm --prefix frontend/public-app ci
npm --prefix frontend/admin-app ci
```

Copia `backend/.env.example` como `backend/.env` y completa la configuración. Para trabajar en local, utiliza una base de datos de desarrollo.

| Variable del backend | Uso |
| :--- | :--- |
| `MONGODB_URI` | Obligatoria. Conexión a MongoDB. |
| `JWT_SECRET` | Obligatoria. Secreto de firma de sesión. |
| `PORT` | Puerto del servidor; por defecto, `5000`. |
| `NODE_ENV` | Entorno de ejecución. |
| `FRONTEND_URL` | URL raíz del sitio para CORS y enlaces de recuperación. En Render puede obtenerse de `RENDER_EXTERNAL_URL` si no se define. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Credenciales de subida y gestión de archivos. |
| `EMAIL_PROVIDER` | `resend` o `smtp`. |
| `RESEND_API_KEY`, `EMAIL_FROM` | Clave y remitente autorizado para Resend. |
| `CONTACT_EMAIL` | Destino de las consultas; si falta, se usa `EMAIL_USER`. |
| `EMAIL_USER`, `EMAIL_PASS` | Cuenta y contraseña de aplicación para la alternativa SMTP. |

Los secretos pertenecen al backend. **Nunca deben guardarse en Git ni en variables `VITE_*`**, cuyos valores se incluyen en el navegador.

## Desarrollo

### Ejecutar todo desde un mismo origen

1. En `backend/.env`, configura `FRONTEND_URL=http://localhost:5000`.
2. Crea un archivo `.env.local` dentro de **cada aplicación frontend**, con:

   ```dotenv
   VITE_API_URL=http://localhost:5000
   ```

3. Compila ambas aplicaciones y arranca el servidor:

   ```sh
   npm --prefix frontend/public-app run build
   npm --prefix frontend/admin-app run build
   npm --prefix backend run dev
   ```

4. Abre [localhost:5000](http://localhost:5000) para el sitio público o [localhost:5000/admin](http://localhost:5000/admin) para administración.

La administración requiere una cuenta con rol `admin`. No se incluyen credenciales predeterminadas.

### Editar la interfaz pública con recarga automática

Mantén el backend en `5000`, configura su `FRONTEND_URL=http://localhost:5173` y ejecuta:

```sh
npm --prefix frontend/public-app run dev -- --port 5173
```

Conserva `VITE_API_URL=http://localhost:5000` en `public-app/.env.local`. Si cambias de puerto u origen, ajusta también CORS. Los dos frontends usan la URL del backend publicado cuando `VITE_API_URL` no está definida; configura esta variable para trabajar contra tu servidor local.

En PowerShell, si la política de ejecución bloquea `npm.ps1`, utiliza `npm.cmd` en los mismos comandos.

## Rutas principales

| Ruta | Contenido |
| :--- | :--- |
| `/` | Inicio, categorías, productos, testimonios y contacto. |
| `/#contacto` | Formulario de contacto integrado. |
| `/productos` | Catálogo y filtros. |
| `/galeria` | Fotos y videos. |
| `/citas` | Calendario y citas del usuario. |
| `/carrito` · `/pagos` | Selección de productos y creación de pedidos. |
| `/perfil` | Datos personales y foto. |
| `/nosotros` | Servicios y preguntas frecuentes, aún enlazados desde el sitio. |
| `/login` · `/register` | Acceso y registro. |
| `/forgot-password` · `/reset-password` | Recuperación de acceso. |
| `/admin` | Panel administrativo. |
| `/api/*` · `/health` | API y estado del servidor. |

`/contacto` redirige a `/#contacto` para conservar los enlaces existentes.

## Verificación

```sh
npm --prefix backend test
npm --prefix frontend/public-app run build
npm --prefix frontend/admin-app run build
```

La suite del backend cubre autenticación, recuperación de contraseña, correo, contacto, productos, cupones, pedidos, tarjetas de pago y permisos administrativos. Utiliza mocks donde corresponde para evitar operaciones reales sobre servicios externos.

GitHub Actions ejecuta las pruebas del backend y las compilaciones de ambas aplicaciones en pushes y pull requests a `master`.

## Despliegue

El backend sirve `public-app/dist` en `/` y `admin-app/dist` en `/admin`. Las rutas `/api/*` se resuelven antes del fallback de las SPA.

Para el servicio existente en Render:

| Ajuste | Valor |
| :--- | :--- |
| Directorio raíz | `backend` |
| Instalación | `npm ci` |
| Arranque | `npm start` |
| Comprobación de estado | `/health` |

Antes de publicar, genera las compilaciones con la URL de API del entorno de destino. Un `.env.local` que apunte a localhost también afecta a `vite build`; revisa ese valor al preparar `dist/` para producción.

Configura las variables del backend en el entorno del servicio. Para correo con Resend, completa `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_FROM` y `CONTACT_EMAIL`. Usa la URL pública raíz en `FRONTEND_URL`, sin `/admin` ni `/reset-password`.

## Mantenimiento y documentación

- [Diseño del sitio público](docs/homepage-redesign.md): composición, navegación, componentes y comportamiento adaptable.
- [Variables del backend](backend/.env.example): referencia de configuración sin credenciales.
- [Sitio público](frontend/public-app/README.md): organización del frontend y comandos.
- El script `npm --prefix backend run cleanup:cloudinary` permite revisar archivos huérfanos. Ejecuta primero el modo de revisión y comprueba el reporte antes de usar su opción de borrado.

Las imágenes editoriales se incluyen en `public-app/public/img/storefront`; las imágenes del catálogo y los perfiles proceden de los datos del negocio. La fuente Montserrat conserva su [licencia OFL](frontend/public-app/public/fonts/Montserrat-OFL.txt).

---

<div align="center">
<strong>Bella Beauty</strong><br>
Tu belleza, nuestra pasión.<br><br>
<sub>Repositorio: <a href="https://github.com/AlexisJr2004/alymbelleza">AlexisJr2004/alymbelleza</a></sub>
</div>

# Inicio de Bella Beauty

La portada de `frontend/public-app` reproduce la composición de la referencia proporcionada: franja informativa, cabecera compacta, fotografía rosa, categorías, productos con promoción lateral, beneficios, testimonios, contacto y pie de página.

Los productos, precios, existencias, valoraciones y testimonios vienen de las API existentes. El sello de descuento calcula el mayor descuento de los productos disponibles; no se muestra cuando no hay ofertas. No se añaden reseñas, calificaciones ni compras verificadas ficticias. Los favoritos se guardan en el navegador del visitante.

La búsqueda enlaza a `/productos?q=...`; las categorías disponibles usan `categoria=facial` y `categoria=capilar`, y las ofertas usan `ofertas=1`. Maquillaje y perfumes buscan esos términos en el catálogo. Su disponibilidad depende de los productos registrados en administración.

El formulario de contacto está en el inicio, debajo de los testimonios, en `/#contacto`. La antigua ruta `/contacto` redirige a esa sección. Servicios y preguntas frecuentes siguen disponibles en `/nosotros`, también mediante `/#servicios`.

## Imágenes

Generadas con la herramienta integrada `image_gen`, usando la imagen del usuario como referencia visual de la portada. No se usó la API ni el CLI alternativo. Los archivos finales se guardaron en el proyecto en JPEG, calidad 88, conservando las dimensiones originales. Son fotografías decorativas; las imágenes de los productos a la venta siguen viniendo del catálogo.

| Archivo final | Uso |
| --- | --- |
| `frontend/public-app/public/img/storefront/beauty-hero.jpg` | Portada y categoría capilar |
| `frontend/public-app/public/img/storefront/beauty-collection.jpg` | Promoción lateral |
| `frontend/public-app/public/img/storefront/category-makeup.jpg` | Categoría maquillaje |
| `frontend/public-app/public/img/storefront/category-skincare.jpg` | Categoría skincare |
| `frontend/public-app/public/img/storefront/category-perfume.jpg` | Categoría perfumes |

### Prompts finales

**Portada**

> Create a photorealistic luxury beauty ecommerce HERO BACKGROUND PHOTOGRAPH, very wide panoramic 3:1 aspect ratio. Inspired by the attached website screenshot's hero ONLY. No website UI, absolutely NO text, lettering, typography, logos or watermarks. Soft pale blush pink silk backdrop and warm daylight. Left 42% of image is near-empty pale ivory blush space for later HTML title, with a few delicate gold olive leaves only at far left edge. Center at 56%: beautiful adult brunette woman with swept up hair, natural glowing skin, subtle makeup and bare shoulder, looking at camera, editorial luxury cosmetics photography, cropped chest-up. Right 35%: luxurious unbranded transparent pink perfume bottle with gold lid, golden serum dropper bottle, white pink cream jar, pink lipstick and makeup brushes, on cream marble plinth, scattered white and blush flowers. Match the reference's soft feminine editorial style and composition, highly realistic product photography, no dark colors or harsh contrast. Keep woman's face and products in right 55% so left stays clean for text. Output a single banner photo suitable for a real online beauty shop.

**Promoción**

> Photorealistic luxury beauty campaign photograph for a website promotion card, landscape 2:1 ratio. Close-up of an adult brunette woman's face with luminous dewy skin, peach-pink eyeshadow and closed eyes on far right 40% of the image, her face framed by large soft pink cherry blossoms. Left 55% is empty very pale blush pink backdrop with subtle out of focus petals for later HTML text overlay. Elegant feminine cosmetics campaign, warm soft studio lighting, refined romantic aesthetic, realistic skin texture, premium magazine photography. NO text, logos, labels, borders, website mockup or watermarks. Single photo, no collages.

**Maquillaje**

> Luxury makeup still life, broken rose-pink face powder dust artfully scattered, one soft makeup brush with a shiny gold ferrule and black handle diagonally placed, and a pink lipstick in gold case. Delicate pastel blush pink background, close-up overhead view, warm natural soft light, photorealistic beauty ecommerce category image. Square composition, no text, no logos, no watermark, high-end commercial photography. Objects fill the frame.

**Skincare**

> Luxury skincare still life: a single open pale blush pink glass face cream jar filled with silky white cream with a sculpted swirl, surrounded by two fresh small green leaves and white flower petals on pale blush marble. Warm soft light, photorealistic beauty ecommerce category image, square composition, close-up three-quarter view. No text, no logos, no watermark. Refined pink cream color palette. Jar centered, fills frame.

**Perfumes**

> Luxury perfume still life: a single exquisite transparent rectangular pink perfume bottle with a shiny gold cap, delicate white and pink blossoms and a few olive leaves alongside it, on pale blush pink marble. Warm natural soft light, high-end photorealistic beauty ecommerce category photo, square composition, centered bottle fills the frame. No text, no logos, no watermark.

## Tipografía

Montserrat se sirve localmente desde `frontend/public-app/public/fonts`, con su licencia SIL Open Font License incluida. Los títulos utilizan Georgia. Los estilos de la portada están limitados a `.bb-storefront` y `.bb-home-layout`.

## Cuenta, testimonios y catálogo

- Inicio, Productos, Perfil, Carrito, Citas, Pagos y Galería comparten cabecera y pie de página. El calendario de la cabecera enlaza a `/citas`.
- El icono de cuenta abre sus opciones con el cursor, un toque o el teclado. Los visitantes ven acceso y registro; las cuentas autenticadas ven Perfil y Cerrar sesión. El enlace `/admin` aparece únicamente con el rol `admin`.
- El cierre de sesión elimina la sesión y limpia la caché de consultas. El nombre del menú se actualiza al guardar el perfil.
- El carrusel muestra los testimonios recibidos de la API, con reproducción automática, avance y pausa. Se detiene al interactuar o editar y respeta la preferencia de movimiento reducido. Editar y eliminar solo aparecen para su autor; eliminar requiere confirmación y conserva la validación de permisos del servidor.
- Productos conserva los filtros de categoría, tipo, precio, disponibilidad y ofertas. Añade orden por nombre o precio y comparte los favoritos del navegador con el inicio y la cabecera.
- Perfil conserva los campos y la subida de fotografía, con colores rosa, títulos serif y tarjetas coordinadas con el inicio. Una imagen local sustituye las fotografías que no se puedan cargar.

## Carrito, citas y pagos

- Productos reduce el encabezado, márgenes, filtros e imágenes. La cuadrícula muestra cuatro productos por fila en escritorio, tres en tamaños intermedios y dos en móvil.
- `StorePageHeading` y `commerce.css` unifican los encabezados compactos, tarjetas blancas, bordes suaves y acentos rosados de Carrito, Citas y Pagos.
- El carrito conserva cantidades, eliminación, vista previa y cupones. Sus controles esperan las operaciones pendientes y restauran las cantidades si falla una actualización; continuar requiere productos cargados y sesión activa.
- Las citas mantienen la navegación mensual, los avisos de WhatsApp y las acciones de realizada, cancelación y eliminación. Las fechas son botones accesibles por teclado.
- Pagos conserva los datos bancarios recibidos de la API, las marcas de los bancos y la generación de factura PDF. Al crear el pedido se actualiza también el contador del carrito de la cabecera.
- Las tres páginas distinguen estados de carga, error y contenido vacío; Carrito y Citas ofrecen acceso a iniciar sesión cuando corresponde.

## Galería y contacto integrado

- Galería reemplaza a Nosotros en la navegación superior. La página conserva fotos, videos, filtros combinables, visor, descarga y las opciones de subir/eliminar para administradores.
- Los filtros se presentan como botones compactos y las tarjetas muestran categoría y fecha. Se adaptan a cuatro, tres o dos columnas según el ancho disponible; las animaciones respetan movimiento reducido.
- Contacto utiliza el mismo diseño blanco y rosa, con formulario de nombre, correo y mensaje. Conserva el envío a `/api/contact`, bloqueo durante el envío, confirmación y errores sin perder el mensaje.
- Los enlaces de contacto apuntan a `/#contacto`. Se utiliza el WhatsApp de citas ya configurado y los enlaces sociales existentes; se retiran los datos de ejemplo de dirección, teléfono y correo del formulario anterior.

## Navegación móvil y accesibilidad

- En pantallas menores de 768 px, Perfil, Citas, Favoritos y Carrito se presentan en una isla inferior flotante, separada de los bordes, con forma de cápsula, acabado translúcido y espacio para el área segura del dispositivo. El menú de cuenta se abre hacia arriba.
- El botón de cuatro cuadros abre la versión anterior de `MobileMenu`: bloque de usuario y rol, Perfil y administración, búsqueda, Servicios desplegables, Productos, Contacto, Galería, redes sociales y reserva. Mantiene sus estilos originales y las mejoras de foco, bloqueo del fondo y cierre al navegar, pulsar Escape, tocar fuera o cambiar a escritorio. La búsqueda enlaza al catálogo y se utilizan los datos de contacto reales en lugar de los textos de ejemplo.
- Cerrar sesión requiere confirmación; cancelar conserva la cuenta y confirmar limpia la sesión y la caché.
- Productos conserva sus interruptores y filtros con controles, separaciones y ancho más compactos. En móvil las filas mantienen una superficie de toque mayor.
- Productos, Perfil, Citas, Carrito y Galería comparten el estilo de ruta de navegación de 10 px.
- Accesibilidad utiliza un panel compacto blanco y rosa con zoom, tamaño de texto, selector de tipografía y lectura de página. Se conservan la tipografía elegida y los controles para restablecer; el aumento de texto se aplica también al contenido que se monta al navegar.

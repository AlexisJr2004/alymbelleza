# Bella Beauty · Administración

Panel de gestión construido con React, TypeScript y Vite, publicado bajo `/admin`. Requiere una sesión con rol administrador; la API valida también los permisos.

## Secciones

Resumen, Ranking, Productos, Cupones, Pedidos, Tarjetas, Usuarios y Citas. Todas las rutas están enlazadas desde la navegación.

## Interfaz

- Identidad visual de la tienda: logotipo floral, Montserrat local, títulos Georgia, fondos blancos y acentos rosa.
- Menú lateral fijo en escritorio, cabecera con búsqueda de productos, pedidos y usuarios, y acceso a citas y cuenta.
- Resumen con banner, indicadores, selector de mes, tendencia de ingresos, distribución por categoría, pedidos recientes y productos más vendidos.
- Indicadores compactos, tablas con desplazamiento horizontal y paginación acotada.
- Filtros plegables en móvil y visibles en escritorio.
- Formularios adaptables, botones degradados y navegación inferior translúcida con área segura.

Los componentes compartidos están en `src/components/ui`; los estilos comunes, en `src/index.css` y `src/styles/dashboard.css`.

El mes seleccionado limita los pedidos, ingresos y clientes acumulados hasta su cierre; los porcentajes comparan ese mes con el anterior. El catálogo muestra las existencias actuales. Las categorías se obtienen del catálogo y los importes por producto son anteriores a los descuentos del pedido. Los pedidos se identifican como registrados, ya que la API no proporciona estados de pago o envío. Las fotografías decorativas reutilizan recursos de la tienda. La búsqueda conserva el filtro en el parámetro `q` de cada sección.

## Desarrollo

```sh
npm ci
npm run dev
npm run build
npm run lint
```

Configura `VITE_API_URL` para apuntar al backend de desarrollo. Consulta la [documentación principal](../../README.md) para preparar el entorno.

La carpeta `dist` está versionada y debe actualizarse con cada cambio, ya que Express la sirve directamente.

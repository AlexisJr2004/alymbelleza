# Bella Beauty · Administración

Panel de gestión construido con React, TypeScript y Vite, publicado bajo `/admin`. Requiere una sesión con rol administrador; la API valida también los permisos.

## Secciones

Resumen, Ranking, Productos, Cupones, Pedidos, Tarjetas, Usuarios y Citas. Todas las rutas están enlazadas desde la navegación.

## Interfaz

- Paneles blancos, tipografía de sistema y acentos rosa.
- Indicadores compactos, tablas con desplazamiento horizontal y paginación acotada.
- Filtros plegables en móvil y visibles en escritorio.
- Formularios adaptables y navegación inferior con área segura.

Los componentes compartidos están en `src/components/ui`; los estilos comunes, en `src/index.css`.

## Desarrollo

```sh
npm ci
npm run dev
npm run build
npm run lint
```

Configura `VITE_API_URL` para apuntar al backend de desarrollo. Consulta la [documentación principal](../../README.md) para preparar el entorno.

La carpeta `dist` está versionada y debe actualizarse con cada cambio, ya que Express la sirve directamente.

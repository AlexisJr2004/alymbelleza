# Bella Beauty · Sitio público

Aplicación React y TypeScript de la tienda, citas, galería y cuenta de clientes.

## Comandos

Desde esta carpeta:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

La compilación se genera en `dist/`, carpeta versionada que sirve el backend en la raíz del sitio. Configura `VITE_API_URL` en `.env.local` para utilizar una API local; revisa ese valor antes de compilar para producción.

## Organización

| Carpeta | Contenido |
| --- | --- |
| `src/pages` | Páginas conectadas al router. |
| `src/components` | Interfaz organizada por función y componentes compartidos. |
| `src/hooks` | Consultas, mutaciones y estado reutilizable. |
| `src/lib` | Cliente API, sesión, formatos y utilidades. |
| `src/styles` | Estilos de la tienda, modales y accesibilidad. |
| `src/types` | Tipos de datos de la API. |
| `public` | Recursos locales, fuentes y archivos de indexación. |

Los modales comparten `Sheet`; la navegación utiliza `StoreHeader` y `StoreFooter`. La barra flotante móvil ofrece Inicio, Galería, Citas, Favoritos y Carrito.

Consulta la [configuración del proyecto](../../README.md) y la [documentación de diseño](../../docs/homepage-redesign.md).

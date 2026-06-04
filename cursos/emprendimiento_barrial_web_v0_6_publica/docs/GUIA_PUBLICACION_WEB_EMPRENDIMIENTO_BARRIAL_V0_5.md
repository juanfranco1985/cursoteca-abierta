# GUÍA DE PUBLICACIÓN WEB — Emprendimiento Barrial v0.5

## Objetivo

Publicar el curso como sitio web estático.

## Plataformas sugeridas

- GitHub Pages.
- Netlify.
- Vercel.
- Hosting estático propio.
- Blog o portfolio personal.

## Pasos previos

1. Abrir el proyecto con VS Code.
2. Ejecutar con Live Server.
3. Probar navegación completa.
4. Revisar DevTools > Application > Manifest.
5. Revisar DevTools > Application > Service Workers.
6. Verificar que todos los JSON carguen correctamente.
7. Probar una recarga offline luego de una primera carga online.

## Archivos que deben subirse

Subir toda la carpeta del proyecto, incluyendo:

- `index.html`
- `styles.css`
- `src/`
- `icons/`
- `manifest.webmanifest`
- `service-worker.js`
- `README.md`
- `docs/`

## Advertencia

No cambiar las rutas relativas sin actualizar `course_manifest.json`, `service-worker.js` y referencias internas.

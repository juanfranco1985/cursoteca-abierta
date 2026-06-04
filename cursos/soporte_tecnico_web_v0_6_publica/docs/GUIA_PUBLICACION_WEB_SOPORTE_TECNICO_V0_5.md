# Guía de publicación web — Soporte Técnico v0.5

## Opción recomendada

Publicar como sitio estático en GitHub Pages, Netlify, Vercel o Cloudflare Pages.

## Antes de publicar

1. Probar con Live Server.
2. Revisar DevTools > Console sin errores críticos.
3. Revisar DevTools > Application:
   - Manifest cargado.
   - Service Worker registrado.
   - Cache creada.
4. Probar recarga después de navegar por el curso.
5. Probar navegación offline luego de una primera carga online.
6. Revisar que no haya datos personales o archivos innecesarios.

## Archivos que deben subirse

Subir todo el contenido de la carpeta del proyecto:

- `index.html`
- `styles.css`
- `src/`
- `icons/`
- `manifest.webmanifest`
- `service-worker.js`
- `README.md`
- `docs/`
- `store/`

## Nota

No mover `src/data` sin actualizar `course_manifest.json` y `service-worker.js`.

# GUÍA DE PUBLICACIÓN WEB — Analista de Datos Ciudadano v0.5

## Objetivo

Publicar el curso como sitio web estático, sin backend y sin base de datos.

## Plataformas recomendadas

- GitHub Pages.
- Netlify.
- Vercel.
- Hosting estático propio.
- Blog o sitio personal que permita subir archivos estáticos.

## Archivos mínimos a subir

Subir la carpeta completa, incluyendo:

- `index.html`
- `styles.css`
- `src/`
- `icons/`
- `manifest.webmanifest`
- `service-worker.js`
- `README.md`
- `docs/`

## Prueba previa

Desde VS Code:

1. Abrir la carpeta.
2. Ejecutar Live Server.
3. Verificar Home.
4. Verificar módulos y lecciones.
5. Verificar laboratorio de tablas.
6. Verificar carga de CSV.
7. Verificar exportación TXT.
8. Verificar `#/publish`.
9. Verificar `#/legal`.
10. Probar una recarga offline después de una primera carga online.

## Nota sobre rutas

El proyecto usa rutas hash (`#/...`), por lo que funciona bien en hosting estático sin configurar servidor especial.

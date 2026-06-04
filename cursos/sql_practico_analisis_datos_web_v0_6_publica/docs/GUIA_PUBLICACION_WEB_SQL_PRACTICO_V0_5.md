# Guía de publicación web — SQL Práctico v0.5

## Opción recomendada

Publicar como sitio estático en GitHub Pages, Netlify o Vercel.

## Antes de publicar

1. Probar con VS Code + Live Server.
2. Verificar que carguen los JSON.
3. Probar el laboratorio SQL.
4. Probar copiar y descargar reportes TXT.
5. Probar Service Worker en navegador.
6. Revisar README público.
7. Tomar capturas reales.
8. Confirmar que no haya datos personales ni claves.

## Estructura mínima publicable

```text
index.html
styles.css
src/
icons/
manifest.webmanifest
service-worker.js
README.md
docs/
store/screenshots/
```

## Nota

Si se publica en una subcarpeta, revisar rutas relativas y caché del Service Worker.

# Guía de publicación web — Seguridad Digital Escolar v0.5

## Prueba local

1. Abrir la carpeta en VS Code.
2. Ejecutar con Live Server.
3. Revisar rutas principales:
   - `#/home`
   - `#/modules`
   - `#/help-mode`
   - `#/school-simulator`
   - `#/family-teacher-guides`
   - `#/school-protocol`
   - `#/adult-school-report`
   - `#/certificate`

## Publicación recomendada

Opciones simples:

- GitHub Pages.
- Netlify.
- Vercel.
- Servidor estático propio.

## Antes de publicar

- Revisar README.
- Revisar aviso legal y alcance educativo.
- Revisar política de privacidad.
- Tomar capturas.
- Probar en celular.
- Probar navegación offline después de cargar el sitio una vez.

## Nota sobre Service Worker

El Service Worker funciona correctamente en `localhost` o en sitios HTTPS. No debe evaluarse abriendo `index.html` con doble clic.

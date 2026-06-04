# GUÍA DE PUBLICACIÓN WEB — FINANZAS DIGITALES SEGURAS v0.5

## Objetivo

Publicar el curso como sitio estático sin backend.

## Prueba local

1. Abrir la carpeta en VS Code.
2. Ejecutar Live Server desde `index.html`.
3. Probar rutas principales: `#/home`, `#/modules`, `#/tools`, `#/risk`, `#/commerce-guide`, `#/certificate`.
4. Abrir DevTools y revisar que no haya errores de carga de JSON.

## Validación técnica

```bash
node --check src/app.js
node --check service-worker.js
node scripts/validate-template.mjs
```

## Publicar en GitHub Pages

1. Crear repositorio.
2. Subir todos los archivos del proyecto.
3. Activar GitHub Pages desde Settings > Pages.
4. Seleccionar rama y carpeta raíz.
5. Probar la URL pública.

## Publicar en Netlify

1. Crear sitio nuevo.
2. Arrastrar la carpeta del proyecto o conectar repositorio.
3. No requiere build command.
4. Publish directory: raíz del proyecto.

## Publicar en Vercel

1. Importar repositorio.
2. Framework: Other.
3. Build command vacío.
4. Output directory raíz.

## Revisión final

- No incluir datos reales de cuentas, tarjetas, DNI, CBU/CVU ni comprobantes.
- Revisar aviso legal y privacidad.
- Probar en celular.
- Probar modo offline después de una primera carga.
- Limpiar cache del navegador si se actualiza el Service Worker.

# ESTADO ACTUAL — WEB v0.5

**Proyecto:** Escudo Comercial Digital Argentina — Curso Web
**Versión:** 0.5
**Foco:** publicación web, PWA básica y modo offline inicial.

## Estado

La plantilla ya cuenta con motor de curso, progreso persistente, quizzes, checklists, incidentes, constancia interna, accesibilidad básica y preparación para publicación como sitio estático.

## Incorporado en v0.5

- `manifest.webmanifest` para comportamiento instalable.
- `service-worker.js` con caché de app shell y JSON principales.
- Carpeta `icons/` con SVG y PNG 192/512.
- Registro automático del Service Worker desde `src/app.js`.
- Detección online/offline en el footer.
- Nueva ruta `#/publish` con estado PWA, checklist y guía de publicación.
- Bloque `webApp` en `course_manifest.json`.
- Documentación de publicación en `docs/GUIA_PUBLICACION_WEB_V0_5.md`.

## Limitaciones conocidas

- El modo offline requiere una primera carga correcta desde servidor web.
- No hay backend ni sincronización entre dispositivos.
- La instalación depende del navegador y del contexto seguro usado al publicar.
- `file://` no es compatible para probar correctamente fetch, manifest ni Service Worker.

## Próxima versión sugerida

La v0.6 debe convertir esta base en **plantilla clonable oficial**, separando mejor documentación, instrucciones de copia y contratos de datos para crear rápidamente otros cursos.

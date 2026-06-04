# ESTADO ACTUAL — ESCUDO COMERCIAL DIGITAL ARGENTINA WEB v0.4

## Resumen

La versión 0.4 consolida la base web como producto educativo más usable en celular, tablet y escritorio. El objetivo principal fue mejorar responsive, accesibilidad, lectura y navegación antes de avanzar hacia publicación/offline y plantilla clonable v0.6.

## Estado funcional

- Curso web navegable por hash routing.
- Carga de identidad y rutas desde `src/data/course_manifest.json`.
- 6 módulos, 36 lecciones y 30 preguntas de quiz.
- Progreso persistente en `localStorage` separado por `courseId`.
- Quizzes con feedback inmediato, historial de intentos y mejor resultado.
- Checklists persistentes.
- Casos/incidentes con buscador.
- Modo emergencia.
- Constancia interna imprimible.
- Exportación/importación de progreso.
- Guía de clonación.
- Panel de accesibilidad.

## Cambios principales v0.4

1. Se agregó enlace de salto al contenido principal.
2. Se agregó navegación hacia panel de accesibilidad.
3. Se agregó `theme-color` para navegador móvil.
4. Se agregó panel `#/accessibility`.
5. Se agregó configuración local de tamaño de texto.
6. Se agregó configuración local de alto contraste.
7. Se agregó opción para reducir animaciones.
8. Se reforzó foco visible con `:focus-visible`.
9. Se reforzó tamaño táctil mínimo de botones, inputs, filas y opciones.
10. Se agregó navegación anterior/siguiente dentro de lecciones.
11. Se agregó buscador de módulos.
12. Se mejoró layout móvil con navegación inferior fija.
13. Se agregó layout intermedio para tablets.
14. Se amplió `course_manifest.json` con bloque `accessibility`.
15. Se actualizó la guía de clonación para contemplar responsive y accesibilidad.

## Importancia estratégica

Esta versión acerca el proyecto a la futura v0.6 porque cada curso clonado podrá reutilizar no solo el motor de contenido, quizzes y constancia, sino también una experiencia más estable para pantallas pequeñas.

## Próxima versión recomendada

v0.5 — Publicación web/offline básico:

- `manifest.webmanifest`.
- Service worker simple para cache local.
- Carpeta `assets/icons`.
- Metadatos de publicación web.
- Revisión de rutas relativas.
- Guía para subir a GitHub Pages, Netlify o Vercel.
- Auditoría de publicación.

Después de v0.5 debería construirse la v0.6 como plantilla clonable oficial.

# CHANGELOG WEB

## v0.2

### Agregado

- `course_manifest.json` como archivo central de identidad/configuración.
- Storage key dinámica basada en `courseId`.
- Pantalla `#/progress` para gestionar avance local.
- Exportación de progreso en JSON.
- Importación de progreso en JSON.
- Reinicio de progreso desde pantalla dedicada.
- Pantalla `#/template` con guía de clonación.
- Botón “Continuar donde quedé”.
- Botón para marcar un módulo completo.
- Barra de avance dentro del detalle de checklist.
- Aplicación dinámica de colores desde manifest.
- Validación básica de datos en consola.

### Modificado

- `index.html` ahora usa textos dinámicos parcialmente controlados por manifest.
- `src/app.js` carga primero el manifest y luego los datos del curso.
- Home ahora comunica explícitamente el camino hacia plantilla clonable.
- README actualizado para enfoque navegador.

### Conservado

- Estructura simple HTML/CSS/JS.
- Carga local de JSON.
- Navegación por hash.
- Progreso con `localStorage`.
- Módulos, lecciones, quizzes, checklists, incidentes, emergencia, legal y constancia.

---

## v0.1

- Base navegable inicial.
- Curso web con módulos, lecciones, checklists, incidentes y progreso local inicial.


## v0.3 — Quizzes, historial y constancia interna

- Mejora del motor de quizzes.
- Feedback inmediato por respuesta.
- Validación de preguntas completas antes de guardar.
- Historial de intentos por módulo.
- Mejor resultado por módulo.
- Promedio general de quizzes.
- Constancia interna mejorada con ID local.
- Botón para imprimir o guardar la constancia como PDF.
- Nuevas opciones `quiz` y `certificate` en `course_manifest.json`.

## v0.4 — Responsive, accesibilidad y navegación de lectura

- Agregado panel `#/accessibility`.
- Agregado ajuste local de tamaño de texto.
- Agregado modo alto contraste local.
- Agregada opción de reducción de movimiento.
- Agregado enlace de salto al contenido principal.
- Mejorado foco visible para teclado.
- Reforzado tamaño táctil mínimo.
- Agregada navegación anterior/siguiente en lecciones.
- Agregado buscador de módulos.
- Mejorado layout móvil con navegación inferior fija.
- Agregado layout intermedio para tablet.
- Actualizado `course_manifest.json` a `templateVersion: 0.4`.
- Agregados documentos `ESTADO_ACTUAL_WEB_V0_4.md` y `AUDITORIA_WEB_V0_4.md`.


## v0.5 — Publicación web/offline básico

- Se agregó `manifest.webmanifest`.
- Se agregó `service-worker.js`.
- Se agregó carpeta `icons/` con íconos web.
- Se registró Service Worker desde `src/app.js`.
- Se agregó estado online/offline en el footer.
- Se agregó ruta `#/publish`.
- Se agregó guía de publicación web.
- Se actualizó `course_manifest.json` a `templateVersion: 0.5`.

---

## v0.6 — Plantilla clonable oficial

### Agregado

- Conversión del proyecto en plantilla clonable oficial.
- `scripts/validate-template.mjs` para validar manifest, JSON e ids únicos.
- Carpeta `templates/data/` con plantillas JSON mínimas.
- Documento `CONTRATOS_JSON_TEMPLATE_V0_6.md`.
- Documento `CHECKLIST_CLONACION_CURSO_WEB_V0_6.md`.
- Documento `PROMPT_CODEX_CREAR_NUEVO_CURSO_WEB.md`.
- Documento `ROADMAP_CURSOS_WEB_CLONABLES.md`.
- Documento `ESTADO_ACTUAL_WEB_V0_6.md`.
- Documento `AUDITORIA_WEB_V0_6.md`.

### Cambiado

- `course_manifest.json` actualizado a `templateVersion: 0.6`.
- `course_content.json` actualizado a versión 0.6.
- `service-worker.js` actualizado a caché v0.6.
- Pantalla `#/template` reforzada con contrato mínimo y validación local.
- README actualizado como documentación principal de plantilla.

### Criterio de cierre

La versión 0.6 queda lista para crear clones rápidos de cursos web usando JSON y manifest, sin reescribir el motor principal.

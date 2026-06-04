# ESTADO ACTUAL — WEB v0.3

**Proyecto:** Escudo Comercial Digital Argentina — Curso Web  
**Versión:** 0.3  
**Objetivo de la versión:** fortalecer evaluación, historial de intentos y constancia interna para preparar la plantilla clonable v0.6.

## Incorporado

- Motor de quizzes mejorado.
- Feedback inmediato por pregunta.
- Validación: no se guarda el quiz si faltan respuestas.
- Porcentaje actual del quiz antes de guardar.
- Umbral de aprobación orientativa configurable desde `course_manifest.json`.
- Historial de intentos por módulo.
- Mejor resultado por módulo.
- Promedio general de quizzes.
- Constancia interna mejorada.
- ID interno de constancia.
- Botón para imprimir o guardar como PDF desde el navegador.
- Campos nuevos en `course_manifest.json`: `quiz` y `certificate`.

## Importancia para crear otros cursos rápido

Esta versión reduce la dependencia temática del motor. Para otro curso, el mismo `app.js` puede reutilizar:

- módulos,
- lecciones,
- quizzes,
- checklists,
- casos,
- progreso local,
- historial de intentos,
- constancia interna.

## Validación

- `src/app.js` validado con `node --check`.
- JSON validados con Python.
- ZIP generado correctamente.

## Pendiente v0.4

- Mejorar responsive avanzado.
- Refinar accesibilidad.
- Agregar navegación inferior opcional para móvil.
- Mejorar pantalla de casos y búsqueda.
- Preparar modo publicación web.

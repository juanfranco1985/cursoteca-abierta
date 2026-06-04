# ESTADO ACTUAL — Analista de Datos Ciudadano Web v0.4

## Resumen

La versión v0.4 mejora la experiencia de usuario del laboratorio de tablas. El proyecto mantiene el curso modular completo, las misiones, checklists, quizzes, progreso local y constancia interna, pero agrega una capa más clara para que el usuario principiante pueda practicar análisis de datos paso a paso.

## Objetivo de la versión

Convertir el laboratorio técnico de v0.3 en una herramienta más pedagógica y usable:

- guiar el recorrido de análisis;
- explicar cómo leer resultados;
- mejorar la experiencia en celular;
- conservar historial local sin guardar tablas completas;
- preparar el curso para una futura versión orientada a publicación.

## Funciones principales agregadas

- Nueva ruta `#/guided-practice`.
- Nueva ruta `#/practice-summary`.
- Nueva ruta `#/analysis-history`.
- Modo de práctica guiada o libre en `#/table-lab`.
- Stepper visual de 5 pasos del laboratorio.
- Lectura guiada del resultado.
- Checklist imprimible de análisis ciudadano.
- Resumen visual de prácticas locales.
- Mejor orientación del historial local.
- Nuevas notas v0.4 dentro de `table_lab.json`.

## Archivos modificados

- `src/app.js`
- `styles.css`
- `src/data/course_manifest.json`
- `src/data/table_lab.json`
- `service-worker.js`
- `manifest.webmanifest`
- `index.html`
- `README.md`
- `scripts/validate-template.mjs`
- `docs/CHANGELOG_ANALISTA_DATOS_WEB.md`

## Archivos nuevos

- `docs/ESTADO_ACTUAL_WEB_V0_4_ANALISTA_DATOS.md`
- `docs/AUDITORIA_WEB_V0_4_ANALISTA_DATOS.md`
- `docs/PROMPT_CODEX_CONTINUAR_ANALISTA_DATOS_WEB_V0_5.md`

## Estado funcional

- Curso navegable.
- JSON cargados desde `src/data/`.
- Laboratorio de tablas operativo.
- Práctica guiada operativa.
- Resumen visual operativo.
- Historial local operativo.
- Exportación TXT operativa.
- Service Worker actualizado a cache v0.4.

## Próximo paso recomendado

La v0.5 debe orientarse a publicación:

- README público final;
- guía de publicación web;
- guía de capturas;
- aviso legal y alcance educativo;
- política de privacidad base;
- checklist de publicación;
- limpieza de documentación heredada.

# Estado actual — Analista de Datos Ciudadano Web v0.2

## Resumen

La v0.2 transforma el curso base en una herramienta más práctica al agregar un **Laboratorio de Tablas** dentro del navegador.

## Funcionalidades principales

- Curso modular con 6 módulos y 36 lecciones.
- Quizzes por módulo.
- Checklists persistentes.
- Misiones de análisis de datos.
- Progreso local en `localStorage`.
- Constancia interna no oficial.
- Panel de accesibilidad.
- Service Worker y manifest web.
- Nueva ruta `#/table-lab`.

## Laboratorio de Tablas

El laboratorio permite:

- cargar tablas de ejemplo desde `src/data/table_lab.json`;
- pegar CSV propio con encabezados;
- detectar celdas faltantes;
- detectar duplicados exactos;
- detectar variantes de escritura en categorías;
- calcular métricas simples en columnas numéricas;
- generar un mini reporte;
- copiar o descargar el reporte como `.txt`;
- guardar un resumen local no sensible.

## Archivos nuevos

- `src/data/table_lab.json`
- `docs/ESTADO_ACTUAL_WEB_V0_2_ANALISTA_DATOS.md`
- `docs/AUDITORIA_WEB_V0_2_ANALISTA_DATOS.md`
- `docs/PROMPT_CODEX_CONTINUAR_ANALISTA_DATOS_WEB_V0_3.md`

## Archivos modificados

- `README.md`
- `src/app.js`
- `src/data/course_manifest.json`
- `scripts/validate-template.mjs`
- `service-worker.js`
- `manifest.webmanifest`
- `styles.css`

## Estado recomendado

Proyecto listo para probar en VS Code + Live Server y continuar hacia v0.3.

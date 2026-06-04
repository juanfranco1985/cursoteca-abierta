# Miniaturas Tematicas de Cursos - 2026-05-28

## Objetivo

Se agregaron miniaturas locales para que cada tarjeta del portal tenga una imagen ligada al curso, manteniendo una identidad visual coherente con `Cursoteca Abierta`.

## Criterio visual

- SVG local por curso, sin dependencias externas.
- Estilo uniforme: portadas de libro, madera oscura, papel, dorado, verde biblioteca y acentos editoriales.
- Motivo visual segun tema: IA, datos, desarrollo web, seguridad, finanzas, emprendimiento, productividad, educacion, trabajo o contenido plus.
- Proporcion fija 16:9 para evitar saltos de layout.
- Texto alternativo generado desde el titulo del curso.

## Archivos generados

- `portal/portal_publico_profesional_v0_6/assets/course-covers/`: 50 miniaturas SVG.
- `scripts/generar_miniaturas_portal.mjs`: generador reproducible de miniaturas para las salidas `06_PUBLICOS_PROFESIONALES` y `07_PUBLICACION_BETA`.

## Archivos modificados

- `portal/portal_publico_profesional_v0_6/src/app.js`: render de imagen por tarjeta.
- `portal/portal_publico_profesional_v0_6/styles.css`: estilos de miniatura, marco de biblioteca y comportamiento responsive.

## Validacion

- Miniaturas generadas en `07_PUBLICACION_BETA`: 50.
- Miniaturas generadas en `06_PUBLICOS_PROFESIONALES`: 50.
- SVG parseados como XML sin errores: 50.
- Cursos del portal: 50.
- Enlaces de cursos faltantes: 0.
- Miniaturas faltantes: 0.
- Portal HTTP: 200.
- Miniatura SVG por HTTP: 200.
- JavaScript del portal: `node --check` correcto.
- ZIPs del portal regenerados.

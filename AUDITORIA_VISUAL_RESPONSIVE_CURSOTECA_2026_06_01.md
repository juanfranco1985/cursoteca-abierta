# Auditoria Visual y Responsive - Cursoteca Abierta

Fecha: 2026-06-01

## Alcance

Revision con Microsoft Edge headless sobre el portal y cursos internos representativos, complementada con inspeccion visual manual de capturas generadas.

## Hallazgos corregidos

- Los previews de estantes usaban miniaturas horizontales dentro de columnas verticales y recortaban texto. Se reemplazaron por lomos decorativos sin texto.
- Botones, badges y chips tenian cajas demasiado rigidas. Ahora permiten salto de linea y no cortan palabras largas.
- En vista movil, el hero y el HUD podian desbordar el viewport. Se ajusto una columna movil de ancho controlado y HUD de una columna.
- La navegacion por hash hacia secciones dinamicas podia quedar mal posicionada. Ahora el portal restaura la posicion despues de renderizar el inventario.
- Se detecto una segunda familia de plantilla interna de cursos (`topbar`, `topnav`, `btn`, `article`, `stats-grid`) que no estaba cubierta por el CSS comun. Se agrego soporte visual para esa plantilla.
- Se retiraron textos publicos internos como `Curso bandera v1.0-beta`, `Plantilla JSON clonable` y `v0.6 publica profesional` de los archivos visibles principales de cursos.

## Capturas generadas

- `auditoria_visual_portal_desktop_v3.png`
- `auditoria_visual_portal_mobile_v5.png`
- `auditoria_visual_curso_js_v3.png`
- `auditoria_visual_curso_finanzas_v5.png`

## Validaciones

- CSS de cursos regenerado para 50 cursos en `07_PUBLICACION_BETA` y 50 cursos en `06_PUBLICOS_PROFESIONALES`.
- Manifests de cursos normalizados: 100.
- Subtitulos publicos saneados: 100.
- Footers tecnicos de app saneados: 90.
- Footers tecnicos iniciales en HTML saneados: 90.
- Sintaxis JS de cursos: OK.
- JSON de cursos: OK.
- Prueba HTTP local: 354 recursos revisados, 50 cursos, 0 rotos.
- ZIPs regenerados: 51 en `07_PUBLICACION_BETA/zips` y 51 en `06_PUBLICOS_PROFESIONALES/zips`.

## Pendiente

Revision visual humana final en navegador normal para ajustar preferencias esteticas finas: densidad, tamano del hero, contraste y jerarquia de las tarjetas.

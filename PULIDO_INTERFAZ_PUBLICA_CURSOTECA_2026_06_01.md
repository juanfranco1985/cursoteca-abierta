# Pulido de Interfaz Publica - Cursoteca Abierta

Fecha: 2026-06-01

## Objetivo

Dejar la experiencia visible del portal alineada con una biblioteca publica de cursos gratuitos, sin mostrar metadatos internos de desarrollo en las tarjetas ni en el hero.

## Cambios aplicados

- Se retiraron de la interfaz visible las etiquetas internas de version, estado tecnico, ID de curso y uso como base.
- Las tarjetas ahora muestran etiquetas publicas: `Curso gratuito`, `Disponible`, publico destinatario y categoria.
- Las descripciones genericas del inventario se presentan como textos editoriales de curso practico.
- Las caracteristicas tecnicas se traducen a beneficios publicos: ejercicios, checklists, recursos, acceso directo y material revisado.
- El hero y el footer ya no muestran `v1.0-beta`, `Beta`, `publico profesional` ni `stack estatico`.
- Se conservaron los datos tecnicos en los inventarios para trazabilidad interna.

## Archivos actualizados

- `07_PUBLICACION_BETA/portal/portal_publico_profesional_v0_6/index.html`
- `07_PUBLICACION_BETA/portal/portal_publico_profesional_v0_6/src/app.js`
- `06_PUBLICOS_PROFESIONALES/portal/portal_publico_profesional_v0_6/index.html`
- `06_PUBLICOS_PROFESIONALES/portal/portal_publico_profesional_v0_6/src/app.js`

## Validaciones

- Sintaxis JavaScript del portal beta: OK.
- Sintaxis JavaScript del portal espejo publico profesional: OK.
- Busqueda de textos visibles internos en `index.html` y `src/app.js`: sin coincidencias para versiones, IDs visibles, `Uso como base`, `stack estatico` o `Beta` en UI.
- Prueba HTTP local sobre `07_PUBLICACION_BETA`: 304 recursos revisados, 50 cursos, 0 enlaces rotos.
- ZIP del portal beta regenerado.
- ZIP del portal espejo publico profesional regenerado.

## Pendiente

La revision visual humana sigue siendo necesaria para ajustar detalles finos de proporcion, contraste, jerarquia y sensacion editorial antes de difusion publica masiva.

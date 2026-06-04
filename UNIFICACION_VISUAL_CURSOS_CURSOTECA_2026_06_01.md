# Unificacion Visual de Cursos - Cursoteca Abierta - 2026-06-01

## Objetivo

Se detecto que el estilo de biblioteca estaba aplicado al portal principal, pero las paginas internas de los cursos conservaban la apariencia anterior. Se unifico la experiencia visual para que al abrir cualquier curso continue la identidad `Cursoteca Abierta`.

## Cambios aplicados

- Se aplico una hoja visual comun a los 50 cursos en `07_PUBLICACION_BETA/cursos/`.
- Se aplico la misma hoja visual a los 50 cursos en `06_PUBLICOS_PROFESIONALES/cursos/`.
- Navegacion interna de cursos con marca visual `Cursoteca Abierta`.
- Heroes, tarjetas, modulos, quizzes, checklists, laboratorios y paneles con estilo de biblioteca.
- Paleta interna: madera oscura, verde biblioteca, papel, cobre y dorado.
- Manifests PWA normalizados a colores de Cursoteca Abierta.
- Iconos SVG de cursos normalizados a libro abierto de Cursoteca Abierta.
- ZIPs de los 50 cursos regenerados en ambas salidas.

## Archivos y scripts

- `scripts/aplicar_estilo_cursoteca_cursos.mjs`
- `scripts/normalizar_manifest_cursoteca.mjs`
- `07_PUBLICACION_BETA/cursos/*/styles.css`
- `06_PUBLICOS_PROFESIONALES/cursos/*/styles.css`
- `*/manifest.webmanifest`
- `*/src/data/course_manifest.json`
- `*/icons/icon.svg`

## Validacion

- Cursos actualizados en `07_PUBLICACION_BETA`: 50.
- Cursos actualizados en `06_PUBLICOS_PROFESIONALES`: 50.
- Manifests normalizados: 100.
- Course manifests normalizados: 100.
- Iconos normalizados: 100.
- JSON de manifests sin errores: 0 errores.
- Prueba HTTP ampliada: 303 recursos revisados, 0 rotos.
- ZIPs de cursos regenerados: 50 por salida.
- ZIPs revisados con `styles.css` y `manifest.webmanifest`: 50 por salida, 0 faltantes.
- Rastros visibles de `TECHLEARN` o del estilo anterior en cursos: no detectados.

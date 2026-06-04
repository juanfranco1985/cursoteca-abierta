# Pulido Editorial - Tanda 4

Fecha: 2026-06-02

## Alcance

Cuarta tanda editorial sobre 10 cursos de Desarrollo Web, Emprendimiento y Finanzas en Cursoteca Abierta:

- Accesibilidad Web para Principiantes.
- APIs para Proyectos Web.
- React Basico para Principiantes.
- CSS Practico para Principiantes.
- Git y GitHub para Proyectos Web.
- HTML Practico para Principiantes.
- Publicacion Web para Principiantes.
- Tienda Online para Principiantes.
- WhatsApp Business Avanzado.
- Costos, Precios y Rentabilidad.

## Cambios aplicados

- Descripciones principales reescritas con foco publico y orientado a uso real.
- Subtitulos ajustados para explicar mejor la utilidad de cada curso.
- Descripciones de modulos reforzadas con dos enfoques: construir/probar/publicar para cursos web y operar/vender/medir para cursos comerciales.
- Lecciones retocadas en idea clave, teoria breve, ejemplo practico, error comun y ejercicio de cierre.
- Entregables esperados adaptados por curso: auditoria de accesibilidad, componente con API, componente React, pagina estilizada, repositorio, pagina HTML, web publicada, ficha de tienda, flujo de WhatsApp Business u hoja de calculo de costos.
- Descripciones visibles del portal sincronizadas desde los manifests de los cursos con pulido editorial fino.

## Archivos modificados

En ambas salidas (`07_PUBLICACION_BETA` y `06_PUBLICOS_PROFESIONALES`) se actualizaron:

- `src/data/course_manifest.json` de los 10 cursos.
- `src/data/course_content.json` de los 10 cursos.
- `portal/portal_publico_profesional_v0_6/data/courses.json` para reflejar en tarjetas las descripciones de los cursos ya pulidos.

## Volumen

- Manifests actualizados: 20.
- Archivos de contenido actualizados: 20.
- Modulos retocados: 120.
- Lecciones retocadas: 720.
- Inventarios de portal actualizados: 2.
- Descripciones sincronizadas en portal: 10 por salida en esta tanda.
- ZIPs regenerados: 10 cursos y 1 portal en `07_PUBLICACION_BETA`; 10 cursos y 1 portal en `06_PUBLICOS_PROFESIONALES`.

## Validaciones

- JSON modificados de la tanda revisados: 40.
- Marcadores editoriales revisados: 20 manifests y 20 contenidos.
- Sintaxis JS de la tanda: 20 archivos `app.js` revisados con `node --check`, sin errores.
- Busqueda de restos de plantilla visibles: sin coincidencias para `curso web practico profesionalizado`, `Modulo profesional`, `deberia poder producir`, `debe producir una decision`, `Curso bandera v1.0-beta` o `Plantilla JSON clonable` en archivos visibles principales.
- Prueba HTTP local sobre la tanda: 70 recursos revisados, 10 cursos, 0 rotos.
- Prueba HTTP local sobre portal actualizado: 4 recursos revisados, 0 rotos.
- JSON de portal: 50 cursos por salida; 46 descripciones no genericas detectadas.

## Pendiente

Continuar con la quinta tanda editorial para cerrar los 10 cursos restantes.

# Pulido Editorial - Tanda 3

Fecha: 2026-06-02

## Alcance

Tercera tanda editorial sobre 10 cursos de Datos, BI y Gobierno de Datos en Cursoteca Abierta:

- Analista de Datos Ciudadano.
- Catalogo de Datos y Alation.
- SQL Practico para Analisis de Datos.
- Tableau para Visualizacion de Datos.
- Calidad de Datos para Principiantes.
- Estadistica Basica para Decisiones.
- Excel para Analisis de Datos.
- Python para Datos desde Cero.
- Storytelling con Datos.
- Gobierno de Datos Basico.

## Cambios aplicados

- Descripciones principales reescritas con foco publico y orientado a decisiones reales.
- Subtitulos ajustados para explicar mejor la utilidad de cada curso.
- Descripciones de modulos reforzadas alrededor de pregunta, fuente, calidad, evidencia y explicacion.
- Lecciones retocadas en idea clave, teoria breve, ejemplo practico, error comun y ejercicio de cierre.
- Entregables esperados adaptados por curso: mini informe, ficha de dato catalogado, consulta SQL comentada, boceto de dashboard, registro de calidad, nota de decision, reporte en Excel, notebook/script, mini presentacion o esquema de gobierno.
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
- Descripciones sincronizadas en portal: 30 por salida.
- ZIPs regenerados: 10 cursos y 1 portal en `07_PUBLICACION_BETA`; 10 cursos y 1 portal en `06_PUBLICOS_PROFESIONALES`.

## Validaciones

- JSON modificados de la tanda revisados: 40.
- Marcadores editoriales revisados: 20 manifests y 20 contenidos.
- Sintaxis JS de la tanda: 20 archivos `app.js` revisados con `node --check`, sin errores.
- Busqueda de restos de plantilla visibles: sin coincidencias para `curso web practico profesionalizado`, `Modulo profesional`, `deberia poder producir`, `debe producir una decision`, `Curso bandera v1.0-beta` o `Plantilla JSON clonable` en archivos visibles principales.
- Prueba HTTP local sobre la tanda: 70 recursos revisados, 10 cursos, 0 rotos.
- Prueba HTTP local sobre portal actualizado: 4 recursos revisados, 0 rotos.
- JSON de portal: 50 cursos por salida; 40 descripciones no genericas detectadas.

## Pendiente

Continuar con la cuarta tanda editorial para seguir homogeneizando los cursos restantes.

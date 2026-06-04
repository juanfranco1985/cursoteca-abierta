# Pulido Editorial - Tanda 5

Fecha: 2026-06-02

## Alcance

Quinta y ultima tanda editorial sobre los 10 cursos restantes de Cursoteca Abierta:

- Astronomia General para Curiosos.
- Atencion al Cliente por WhatsApp y Redes.
- Computacion Cuantica para Curiosos.
- Educacion Financiera Basica Argentina.
- Escudo Comercial Digital Argentina.
- Excel y Google Sheets desde Cero.
- Monotributo y Organizacion Administrativa Basica.
- Notion, Trello y Organizacion Personal.
- Privacidad Digital Ciudadana.
- Teletrabajo Seguro y Productivo.

## Cambios aplicados

- Descripciones principales reescritas con foco publico y orientado a uso real.
- Subtitulos ajustados para explicar mejor la utilidad de cada curso.
- Descripciones de modulos reforzadas con tres enfoques: aprendizaje/divulgacion, operacion administrativa-productiva y seguridad cotidiana.
- Lecciones retocadas en idea clave, teoria breve, ejemplo practico, error comun y ejercicio de cierre.
- Entregables esperados adaptados por curso: guia de observacion, protocolo de atencion, ficha cuantica, mapa financiero, plan de escudo comercial, planilla inicial, rutina administrativa, tablero personal, revision de privacidad o plan de teletrabajo.
- Descripciones visibles del portal sincronizadas desde los manifests de los cursos con pulido editorial fino.

## Archivos modificados

En ambas salidas (`07_PUBLICACION_BETA` y `06_PUBLICOS_PROFESIONALES`) se actualizaron:

- `src/data/course_manifest.json` de los 10 cursos.
- `src/data/course_content.json` de los 10 cursos.
- `portal/portal_publico_profesional_v0_6/data/courses.json` para reflejar en tarjetas las descripciones finales.

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
- Control final: 50 cursos con pulido editorial fino en `07_PUBLICACION_BETA` y 50 en `06_PUBLICOS_PROFESIONALES`.
- JSON de portal: 50 cursos por salida y 50 descripciones no genericas detectadas.

## Cierre

Con esta tanda, los 50 cursos completos tienen pulido editorial fino registrado, descripciones visibles sincronizadas en el portal y ZIPs actualizados.

# Pulido Editorial - Tanda 2

Fecha: 2026-06-01

## Alcance

Segunda tanda editorial sobre 10 cursos de Cursoteca Abierta:

- Android Seguro para Principiantes.
- Ciudadano Digital Argentina.
- Cuidado Digital para Adultos Mayores y Familias.
- Seguridad Digital Escolar.
- Seguridad Digital para Docentes.
- Tramites Digitales Argentina.
- Automatizacion con IA para Tareas Repetitivas.
- CV, LinkedIn y Busqueda Laboral Digital.
- Google Workspace para Trabajo y Datos.
- Simulador Laboral de Soporte Tecnico.

## Cambios aplicados

- Descripciones principales reescritas con tono publico, claro y orientado a uso real.
- Subtitulos ajustados para explicar mejor la utilidad de cada curso.
- Descripciones de modulos reforzadas para quitar lenguaje mecanico o de plantilla.
- Lecciones retocadas en idea clave, teoria breve, ejemplo practico, error comun y ejercicio.
- Entregables esperados adaptados por curso: revision de telefono, mapa de tramite, plan de acompanamiento familiar, protocolo escolar, guia docente, expediente digital, automatizacion revisable, perfil laboral, tablero de trabajo o registro de soporte.

## Archivos modificados

En ambas salidas (`07_PUBLICACION_BETA` y `06_PUBLICOS_PROFESIONALES`) se actualizaron:

- `src/data/course_manifest.json` de los 10 cursos.
- `src/data/course_content.json` de los 10 cursos.

## Volumen

- Manifests actualizados: 20.
- Archivos de contenido actualizados: 20.
- Modulos retocados: 120.
- Lecciones retocadas: 720.
- ZIPs regenerados: 10 en `07_PUBLICACION_BETA` y 10 en `06_PUBLICOS_PROFESIONALES`.

## Validaciones

- JSON modificados revisados: 40.
- Marcadores editoriales revisados: 20 manifests y 20 contenidos.
- Sintaxis JS de la tanda: 20 archivos `app.js` revisados con `node --check`, sin errores.
- Busqueda de restos de plantilla visibles: sin coincidencias para `curso web practico profesionalizado`, `Modulo profesional`, `deberia poder producir`, `debe producir una decision`, `Curso bandera v1.0-beta` o `Plantilla JSON clonable` en archivos visibles principales.
- Prueba HTTP local sobre la tanda: 70 recursos revisados, 10 cursos, 0 rotos.

## Pendiente

Continuar con la tercera tanda editorial para acercar los 50 cursos al mismo nivel de pulido fino.

# Auditoria de publicacion final

Fecha: 2026-05-26

## Alcance

Se reviso la salida `06_PUBLICOS_PROFESIONALES` como paquete publico/profesional listo para prueba local y preparacion de publicacion estatica.

## Resultado general

- Entradas en portal: 50.
- Cursos publicos completos: 50.
- Fichas programadas: 0.
- Carpetas de cursos completas: 50.
- ZIPs generados: 51, incluyendo portal.
- Backend requerido: no.
- Login requerido: no.

## Correcciones realizadas

- Se corrigieron los enlaces del portal de `../cursos/...` a `../../cursos/...`; ahora las 32 tarjetas publicas abren cursos reales desde la ubicacion actual del portal.
- Se normalizaron 5 cursos que tenian 30 preguntas bajo `quizQuestions`, pero solo 6 preguntas visibles bajo `quiz`; ahora todos los cursos completos exponen 30 preguntas en `quiz`.
- Se corrigieron caracteres mal codificados en 30 archivos publicos, especialmente secuencias como `ñ` y `¿`.
- Se reescribieron los archivos publicos de texto en UTF-8 sin BOM para evitar problemas de parseo JSON en pruebas HTTP.
- Se normalizaron encabezados HTML y footers de 27 cursos para mostrar nombre propio, subtitulo propio y estado `v0.6 publica profesional`.
- Se regeneraron los 32 ZIPs de cursos y el ZIP del portal despues de las correcciones.
- Se completo la primera tanda de 6 cursos previamente programados: Seguridad Digital para Docentes, Cuidado Digital para Adultos Mayores y Familias, Ciudadano Digital Argentina, Seguridad Familiar en Internet, Teletrabajo Seguro y Productivo, y Atencion al Cliente por WhatsApp y Redes.
- Se normalizaron textos heredados adicionales como `Protocolo ante fraude` y `Riesgo comercial` fuera de contexto.
- Se regeneraron los 38 ZIPs de cursos y el ZIP del portal despues de la primera tanda.
- Se completo la segunda tanda de 6 cursos previamente programados: Notion, Trello y Organizacion Personal, Automatizacion con IA para Tareas Repetitivas, Estadistica Basica para Decisiones, Python para Datos desde Cero, Storytelling con Datos, y Calidad de Datos para Principiantes.
- Se regeneraron los 44 ZIPs de cursos y el ZIP del portal despues de la segunda tanda.
- Se completo la tercera tanda de 6 cursos previamente programados: Gobierno de Datos Basico, WhatsApp Business Avanzado, Tienda Online para Principiantes, Costos, Precios y Rentabilidad, Monotributo y Organizacion Administrativa Basica, y UX/UI Basico para Sitios y Apps.
- Se regeneraron los 50 ZIPs de cursos y el ZIP del portal despues de la tercera tanda.

## Validaciones realizadas

- Inventario JSON: 50 entradas, 50 publicas y 0 programadas.
- CSV: 50 filas, sin titulos vacios.
- Portal JSON: 50 entradas, 50 publicas y 0 programadas.
- Enlaces de portal por sistema de archivos: 50 publicos revisados, 0 rotos.
- Enlaces de portal por servidor local HTTP: 50 publicos revisados, 0 rotos.
- Fichas programadas: 0.
- Contrato de cursos completos: 50 cursos revisados, 0 inconsistencias.
- Cada curso completo quedo con 6 modulos, 36 lecciones, 30 preguntas, 6 checklists y 8 proyectos/casos.
- JSON de cursos y portal: parse correcto.
- JavaScript: `node --check` correcto sobre 101 archivos.
- Scripts generadores principales: parse correcto.
- Barrido de mojibake publico: sin coincidencias para `Ã`, `Â` o `â` en los archivos publicos revisados.

## Nota de prueba visual

Se intento ejecutar captura visual con Playwright, pero Chromium no estaba instalado y la descarga del navegador excedio el tiempo de espera disponible. La prueba funcional con servidor local si fue completada correctamente.

Comando de prueba local recomendado:

```powershell
cd "c:\Users\juanf\Downloads\Proyecto Cursos\06_PUBLICOS_PROFESIONALES"
python -m http.server 8038 --bind 127.0.0.1
```

URL del portal:

```text
http://127.0.0.1:8038/portal/portal_publico_profesional_v0_6/index.html
```

## Estado

La etapa de catalogo minimo queda terminada: 50 cursos completos publicos/profesionales, sin fichas programadas pendientes.



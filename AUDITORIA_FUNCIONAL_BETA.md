# Auditoria Funcional - Publicacion Beta v1.0

Fecha: 2026-05-27

## Alcance

Se reviso la carpeta `07_PUBLICACION_BETA` como paquete separado para prueba y publicacion estatica inicial.

## Resultados

- Portal principal por HTTP: 200.
- Cursos probados por HTTP desde enlaces del portal: 50.
- Enlaces rotos: 0.
- JSON revisados: inventario, cursos del portal y manifest.
- JS revisados con `node --check`: 101.
- Errores JS: 0.
- Carpetas de cursos: 50.
- ZIPs: 51.
- Mojibake visible en portal: corregido y no detectado en la validacion posterior.
- Contrato de cursos completos: 50 revisados, 0 inconsistencias.
- Cursos bandera profesionalizados: 50.
- Ultima prueba HTTP local: 354 recursos revisados, 50 cursos y 0 enlaces rotos.

## Correcciones incluidas en esta beta

- Textos heredados del portal retirados.
- Seccion superior reducida a 6 cursos destacados.
- Inventario completo mantiene las 50 tarjetas.
- Filtro redundante de estado eliminado.
- CSV del portal regenerado desde `courses.json`.
- Documentacion activa del portal actualizada al estado de 50 cursos completos.
- Textos visibles del portal normalizados a ASCII limpio para evitar problemas de codificacion en hosting estatico.
- 50 cursos fueron reforzados como `Curso bandera v1.0-beta` en cinco tandas y se regeneraron sus ZIPs.
- Portal redisenado con identidad `Cursoteca Abierta`, hero de biblioteca generado con CSS y navegacion superior tipo catalogo editorial.
- Se agregaron 50 miniaturas SVG locales, una por curso, regeneradas como portadas de biblioteca y sin usar imagenes externas ni la imagen de referencia compartida.
- Portal reorganizado con 8 estantes principales y vista interna de cursos por estante; las 21 categorias reales del inventario quedan cubiertas.
- Paginas internas de los 50 cursos unificadas visualmente con Cursoteca Abierta; prueba HTTP ampliada con 303 recursos y 0 rotos.
- Interfaz publica del portal saneada para ocultar versiones, IDs, estados tecnicos y textos de base interna; ZIPs del portal regenerados.
- Auditoria visual responsive aplicada: previews de estantes sin texto recortado, botones/chips flexibles, layout movil corregido, soporte CSS para dos plantillas internas de cursos y textos tecnicos visibles retirados de cursos.
- Primera tanda editorial completada sobre 10 cursos destacados: 20 manifests, 20 contenidos, 120 modulos y 720 lecciones retocadas en ambas salidas; prueba HTTP de 70 recursos con 0 rotos.
- Segunda tanda editorial completada sobre 10 cursos adicionales: 20 manifests, 20 contenidos, 120 modulos y 720 lecciones retocadas en ambas salidas; 20 archivos JS revisados, 70 recursos HTTP con 0 rotos y ZIPs regenerados.
- Tercera tanda editorial completada sobre 10 cursos de Datos/BI/Gobierno de Datos: 20 manifests, 20 contenidos, 120 modulos y 720 lecciones retocadas en ambas salidas; 20 archivos JS revisados, 70 recursos HTTP con 0 rotos, descripciones del portal sincronizadas y ZIPs regenerados.
- Cuarta tanda editorial completada sobre 10 cursos de Desarrollo Web, Emprendimiento y Finanzas: 20 manifests, 20 contenidos, 120 modulos y 720 lecciones retocadas en ambas salidas; 20 archivos JS revisados, 70 recursos HTTP con 0 rotos, descripciones del portal sincronizadas y ZIPs regenerados.
- Quinta tanda editorial completada sobre los 10 cursos restantes: 20 manifests, 20 contenidos, 120 modulos y 720 lecciones retocadas en ambas salidas; 20 archivos JS revisados, 70 recursos HTTP con 0 rotos, descripciones del portal sincronizadas y ZIPs regenerados.
- Control final de pulido editorial: 50 cursos con marcador de pulido fino en `07_PUBLICACION_BETA` y 50 en `06_PUBLICOS_PROFESIONALES`; inventarios del portal con 50 descripciones no genericas por salida.
- Paquete publico v1.0-beta documentado: README final, indice publico, instrucciones de hosting, pendientes reales y plan de secciones publicas del portal.

## Prueba visual

La captura automatizada con Playwright no pudo completarse porque Chromium no esta instalado en esta maquina:

```text
Executable doesn't exist at ... ms-playwright ... chrome-headless-shell.exe
```

La revision visual humana sigue pendiente antes de difusion masiva.

## Estado

Beta funcionalmente lista para prueba local y despliegue estatico inicial.

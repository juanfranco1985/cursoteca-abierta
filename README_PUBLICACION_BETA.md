# Publicacion Beta v1.0 - Portal de Cursos Web

Paquete publico estatico preparado el 2026-05-27 para prueba, entrega y despliegue inicial.

## Estado del paquete

- 50 cursos completos.
- 50 tarjetas en el portal.
- 50 cursos bandera profesionalizados como `v1.0-beta`.
- 0 cursos pendientes de desarrollo.
- 50 carpetas de cursos en `cursos/`.
- 51 archivos ZIP en `zips/`: 50 cursos y 1 portal.
- Sin backend, login ni base de datos.
- Portal redisenado con identidad `Cursoteca Abierta` y estetica de biblioteca digital.
- 50 miniaturas SVG locales, una por curso, regeneradas como portadas/fichas de biblioteca.
- Navegacion principal por 8 estantes de aprendizaje, con vista interna de cursos por estante.
- 50 cursos internos unificados visualmente con la identidad `Cursoteca Abierta`.
- Interfaz publica pulida para no mostrar versiones, IDs ni estados tecnicos internos en las tarjetas.
- Auditoria visual/responsive aplicada: portada, movil, cursos internos representativos y plantillas alternativas de curso.
- Primera tanda editorial aplicada a 10 cursos destacados: manifests, modulos y lecciones con tono publico menos generico.
- Segunda tanda editorial aplicada a 10 cursos adicionales: manifests, modulos y lecciones con tono publico menos generico.
- Tercera tanda editorial aplicada a 10 cursos de Datos/BI/Gobierno de Datos y descripciones visibles del portal sincronizadas para los cursos ya pulidos.
- Cuarta tanda editorial aplicada a 10 cursos de Desarrollo Web, Emprendimiento y Finanzas; ZIPs de cursos y portal regenerados.
- Quinta tanda editorial aplicada a los 10 cursos restantes; los 50 cursos ya tienen pulido editorial fino registrado.
- Paquete publico v1.0-beta documentado con README final, indice publico, instrucciones de hosting, pendientes reales y plan de portal publico.

## Entrada principal

```text
portal/portal_publico_profesional_v0_6/index.html
```

## Prueba local recomendada

Opcion simple en Windows:

```text
ABRIR_PORTAL_BETA.bat
```

Ese archivo abre el portal y deja una ventana de servidor activa. Mantenela abierta mientras uses el sitio.

Desde esta carpeta:

```powershell
python -m http.server 8040 --bind 127.0.0.1
```

Abrir:

```text
http://127.0.0.1:8040/portal/portal_publico_profesional_v0_6/index.html
```

## Estructura que debe conservarse

```text
07_PUBLICACION_BETA/
|-- portal/
|-- cursos/
|-- inventario/
`-- zips/
```

El portal usa rutas relativas desde `portal/portal_publico_profesional_v0_6/` hacia `../../cursos/`. Si se cambia esta estructura, hay que actualizar `portal/portal_publico_profesional_v0_6/data/courses.json`.

## Documentacion final v1.0-beta

- `README_FINAL_V1_0_BETA.md`: guia principal del paquete publico.
- `INDICE_PUBLICO_V1_0_BETA.md`: indice publico de 50 cursos.
- `INSTRUCCIONES_HOSTING_V1_0_BETA.md`: instrucciones para hosting estatico.
- `PENDIENTES_REALES_V1_0_BETA.md`: pendientes reales antes de difusion masiva.
- `PLAN_PORTAL_PUBLICO_V1_0_BETA.md`: secciones necesarias para lanzar el portal publico.

## Pendientes reales antes de v1.0 final

- Revision visual humana en escritorio y movil.
- Revision visual/editorial humana final sobre los 50 cursos antes de difusion masiva.
- Revision de contenido sensible, legal o medico segun tema.
- Definir hosting final y URL publica.
- Implementar o enlazar secciones publicas de Nosotros, Contacto, Privacidad y Publicidad/Ads.
- Agregar capturas publicas finales si se quiere mejorar la presentacion comercial.

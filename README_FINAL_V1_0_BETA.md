# Cursoteca Abierta - Paquete Publico v1.0-beta

Fecha de cierre: 2026-06-02

Este paquete contiene la beta publica estatica de Cursoteca Abierta: una biblioteca digital de 50 cursos gratuitos, navegables desde el navegador y sin backend, login ni base de datos.

## Estado

- 50 cursos completos.
- 50 cursos con pulido editorial fino registrado.
- 50 descripciones publicas no genericas en el portal.
- 8 estantes principales de aprendizaje.
- 50 miniaturas locales de cursos.
- 51 ZIPs disponibles: 50 cursos y 1 portal.
- Portal y cursos preparados para hosting estatico.

## Entrada Principal

```text
portal/portal_publico_profesional_v0_6/index.html
```

Para prueba local:

```powershell
python -m http.server 8040 --bind 127.0.0.1
```

Abrir:

```text
http://127.0.0.1:8040/portal/portal_publico_profesional_v0_6/index.html
```

## Estructura Publicable

```text
07_PUBLICACION_BETA/
|-- portal/
|   `-- portal_publico_profesional_v0_6/
|-- cursos/
|   `-- 50 carpetas de cursos
|-- inventario/
|-- zips/
|   |-- 50 ZIPs de cursos
|   `-- portal_publico_profesional_v0_6.zip
|-- README_FINAL_V1_0_BETA.md
|-- INDICE_PUBLICO_V1_0_BETA.md
|-- INSTRUCCIONES_HOSTING_V1_0_BETA.md
|-- PENDIENTES_REALES_V1_0_BETA.md
`-- PLAN_PORTAL_PUBLICO_V1_0_BETA.md
```

El portal usa rutas relativas desde:

```text
portal/portal_publico_profesional_v0_6/
```

hacia:

```text
../../cursos/
```

No mover `portal/` y `cursos/` por separado si no se actualiza `portal/portal_publico_profesional_v0_6/data/courses.json`.

## Documentos Clave

- `INDICE_PUBLICO_V1_0_BETA.md`: resumen publico de los 50 cursos por estante.
- `INSTRUCCIONES_HOSTING_V1_0_BETA.md`: pasos recomendados para publicar en hosting estatico.
- `PENDIENTES_REALES_V1_0_BETA.md`: lista corta de pendientes antes de difusion masiva.
- `PLAN_PORTAL_PUBLICO_V1_0_BETA.md`: secciones necesarias para evolucionar el portal publico.
- `AUDITORIA_FUNCIONAL_BETA.md`: historial de controles funcionales.

## Recomendacion de Publicacion

Para una beta publica inicial, subir completa la carpeta `07_PUBLICACION_BETA` o replicar su estructura exacta en el hosting.

Si el hosting permite elegir carpeta raiz, publicar desde la raiz que contiene `portal/`, `cursos/`, `inventario/` y `zips/`.

## Pendientes Antes de v1.0 Final

- Revision visual humana completa en escritorio y movil.
- Revision editorial humana final de cursos sensibles.
- Definir texto publico final de contacto, privacidad y publicidad.
- Definir hosting final y URL publica.
- Probar el portal ya publicado desde una URL real.

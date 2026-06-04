# Guia de Integracion de Cursos

## Objetivo

Explicar como usar el portal junto a las carpetas reales de los cursos web.

## Organizacion requerida

```text
paquete-publico/
|-- portal/
|   `-- portal_publico_profesional_v0_6/
|-- cursos/
|-- inventario/
`-- zips/
```

## Archivo clave

`portal/portal_publico_profesional_v0_6/data/courses.json`

Cada curso tiene un campo `path` que apunta a `../../cursos/<slug>/index.html`. Si cambia la ubicacion del portal o de los cursos, hay que ajustar ese campo.

## Integridad esperada

- 50 entradas en `courses.json`.
- 50 carpetas dentro de `cursos/`.
- 50 enlaces a `index.html`.
- 51 ZIPs: 50 cursos y 1 ZIP del portal.

## Prueba minima

Abrir el portal con servidor local y comprobar que cada enlace `Abrir curso` responde con HTTP 200.

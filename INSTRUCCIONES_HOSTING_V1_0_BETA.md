# Instrucciones de Hosting - Cursoteca Abierta v1.0-beta

Fecha: 2026-06-02

## Tipo de Sitio

Cursoteca Abierta es un sitio estatico:

- No requiere backend.
- No requiere base de datos.
- No requiere login.
- Carga datos desde archivos JSON locales.
- Usa rutas relativas entre portal y cursos.

## Estructura a Subir

Subir esta estructura completa:

```text
portal/
cursos/
inventario/
zips/
```

La entrada principal sera:

```text
portal/portal_publico_profesional_v0_6/index.html
```

## GitHub Pages

Opcion recomendada si se publica desde repositorio:

1. Subir el contenido de `07_PUBLICACION_BETA` al repositorio.
2. Activar GitHub Pages sobre la rama principal.
3. Abrir la URL generada y navegar a:

```text
/portal/portal_publico_profesional_v0_6/index.html
```

Si se quiere que el portal abra desde la raiz del dominio, crear luego una version reorganizada donde `index.html`, `styles.css`, `src/`, `data/` y `assets/` del portal queden en la raiz, y ajustar rutas hacia `cursos/`.

## Netlify

Opcion recomendada para prueba rapida:

1. Arrastrar o conectar la carpeta `07_PUBLICACION_BETA`.
2. Mantener la estructura completa.
3. Verificar que `data/courses.json` cargue correctamente.
4. Probar al menos un curso de cada estante.

## Vercel

Opcion valida para hosting estatico:

1. Importar repositorio o carpeta.
2. No configurar build.
3. Publicar como sitio estatico.
4. Validar rutas relativas del portal hacia `../../cursos/`.

## Hosting Propio

Requisitos minimos:

- Servir archivos `.html`, `.css`, `.js`, `.json`, `.svg`, `.webmanifest` y `.zip`.
- No bloquear JSON por politica del servidor.
- Mantener codificacion UTF-8.
- Permitir descarga de ZIPs si se usa la carpeta `zips/`.

## Validacion Despues de Publicar

Probar:

- Carga del portal.
- Carga de `data/courses.json`.
- Busqueda.
- Filtro por categoria.
- Apertura de cursos desde tarjetas.
- Apertura de al menos 8 cursos, uno por estante.
- Vista movil.
- Descarga de ZIPs si se van a ofrecer publicamente.

## Ads y Analitica

No hay anuncios ni analitica activos por defecto.

Antes de agregar publicidad o medicion:

- Definir politica de privacidad.
- Definir aviso de publicidad.
- Evitar anuncios dentro de ejercicios o contenido sensible.
- Probar rendimiento y legibilidad en movil.

# Preparacion SEO, Search Console y AdSense

Fecha: 2026-06-07

## Implementado

- Paginas institucionales visibles: Acerca, Contacto, Politica de privacidad, Terminos de uso y Aviso educativo/no profesional.
- `sitemap.xml` en la raiz del sitio.
- `robots.txt` con referencia al sitemap publico.
- Canonical, description, Open Graph, Twitter Card y datos estructurados basicos en el portal, paginas institucionales y cursos.
- Titulos y descripciones SEO por curso generados desde los manifests.
- 50 fichas estaticas SEO en `/curso/<slug>/`, enlazadas desde el portal y el sitemap.

## Search Console

1. Crear una propiedad URL prefix para `https://juanfranco1985.github.io/cursoteca-abierta/`.
2. Verificar propiedad con el metodo que indique Google. No se dejo un token inventado en el repositorio.
3. Si Google entrega un archivo `google-site-verification-XXXX.html`, copiarlo en la raiz y commitearlo.
4. Si Google entrega una meta etiqueta, pegarla en el `<head>` de `index.html` y del portal.
5. Enviar el sitemap: `https://juanfranco1985.github.io/cursoteca-abierta/sitemap.xml`.
6. Usar inspeccion de URL para revisar la raiz, el portal y algunos cursos representativos.

## AdSense

Pendiente antes de solicitar aprobacion o insertar anuncios:

- Revisar manualmente que los cursos tengan contenido propio, sustancial y no duplicado.
- Mantener privacidad, terminos, contacto y aviso educativo enlazados desde el sitio.
- No insertar anuncios en pop-ups, elementos flotantes invasivos, botones de navegacion ni zonas que confundan al usuario.
- No pedir clics en anuncios ni presentar anuncios como recursos del curso.
- Actualizar privacidad si se activa publicidad o cookies publicitarias.
- Agregar `ads.txt` solo cuando exista un publisher ID real de AdSense.

## Fuentes oficiales revisadas

- Requisitos de elegibilidad de AdSense: https://support.google.com/adsense/answer/9724
- Politicas del programa AdSense: https://support.google.com/adsense/answer/48182
- Google Publisher Policies: https://support.google.com/publisherpolicies/answer/10502938
- Sitemaps en Google Search Central: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- robots.txt en Google Search Central: https://developers.google.com/crawling/docs/robots-txt/create-robots-txt
- Verificacion de propiedad en Search Console: https://support.google.com/webmasters/answer/9008080

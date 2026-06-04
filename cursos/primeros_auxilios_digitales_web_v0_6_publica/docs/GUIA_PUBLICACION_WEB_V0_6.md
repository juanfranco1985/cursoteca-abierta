# Guía de publicación web — v0.6

## Requisito

Publicar la carpeta completa manteniendo rutas relativas.

## Opciones recomendadas

- GitHub Pages.
- Netlify.
- Vercel.
- Servidor estático propio.
- Portal de la familia de cursos.

## Prueba previa

Antes de publicar:

1. Abrir con Live Server.
2. Verificar que carguen módulos, checklists e incidentes.
3. Ejecutar diagnóstico rápido.
4. Abrir mapa de emergencia.
5. Probar checklist imprimible.
6. Revisar manifest en DevTools.
7. Revisar Service Worker en DevTools > Application.
8. Recargar offline después de una primera carga completa.

## Nota

Si se publica en subcarpeta, mantener `start_url`, `scope` y rutas relativas tal como están.

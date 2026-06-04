# GUÍA DE PUBLICACIÓN WEB — v0.5

## Objetivo

Publicar el curso como sitio estático navegable sin backend.

## Opción recomendada para pruebas

1. Abrir la carpeta en VS Code.
2. Ejecutar Live Server sobre `index.html`.
3. Abrir DevTools > Application.
4. Verificar Manifest y Service Worker.
5. Navegar por módulos, quizzes, checklists y casos.
6. Desactivar conexión desde DevTools y recargar para comprobar caché básica.

## Publicar en GitHub Pages

1. Crear un repositorio.
2. Subir todos los archivos de la carpeta del proyecto.
3. Activar GitHub Pages desde Settings > Pages.
4. Seleccionar la rama principal y la carpeta raíz.
5. Abrir la URL publicada y probar rutas hash.

## Publicar en Netlify

1. Entrar a Netlify.
2. Crear nuevo sitio manual.
3. Arrastrar la carpeta del proyecto o conectar repositorio.
4. Publicar sin comando de build.
5. Verificar `manifest.webmanifest` y Service Worker.

## Publicar en Vercel

1. Crear proyecto nuevo.
2. Importar repositorio o subir carpeta.
3. Framework: Other.
4. Build command: vacío.
5. Output directory: raíz del proyecto.

## Importante

No publicar archivos privados, claves, bases de datos sensibles ni datos personales. Esta plantilla está pensada para contenido educativo local y estático.

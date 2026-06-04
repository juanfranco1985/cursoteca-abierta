# ESTADO ACTUAL — Escudo Comercial Digital Argentina Web v0.2

## Estado general

La versión v0.2 transforma la v0.1 en una base web más sólida y mejor preparada para convertirse en plantilla clonable.

El proyecto ya puede ejecutarse en navegador mediante Live Server o servidor HTTP local. No depende de Android Studio, Kotlin, Gradle, Jetpack Compose ni DataStore.

---

## Funciones disponibles

- Home dinámica.
- Navegación por hash (`#/modules`, `#/lesson/...`, etc.).
- Carga de contenido desde JSON local.
- 6 módulos.
- 36 lecciones.
- Quizzes por módulo.
- Checklists persistentes.
- Casos/incidentes con buscador.
- Modo emergencia.
- Pantalla legal/privacidad.
- Constancia interna.
- Gestión de progreso local.
- Exportación e importación de progreso.
- Pantalla de guía para clonar.

---

## Cambio más importante frente a v0.1

Se agregó:

```text
src/data/course_manifest.json
```

Este archivo concentra:

- `courseId`
- nombre de app
- subtítulo
- descripción
- rutas de datos
- etiquetas de navegación
- funciones activas
- colores principales
- aviso responsable
- notas de clonación

Esto permite que futuros cursos puedan reutilizar el motor sin tocar `src/app.js` en la mayoría de los casos.

---

## Progreso persistente

El progreso se guarda en `localStorage` con una clave derivada de:

```text
curso-web:{courseId}:progress:v1
```

Esto evita mezclar el progreso de distintos cursos si se clonan correctamente con un `courseId` único.

---

## Estructura de contenido actual

### `course_content.json`

- 6 módulos.
- 36 lecciones.
- 30 preguntas de quiz.
- 5 preguntas por módulo.

### `checklists.json`

- 6 checklists.
- Ítems persistentes en navegador.

### `incidents.json`

- 8 casos/incidentes.
- Cada caso incluye pasos, evidencia, errores y prevención.

---

## Limitaciones actuales

- Sigue siendo una app web estática.
- No hay empaquetado con Vite/React todavía.
- No hay generación automática de nuevos cursos.
- Los incidentes todavía se llaman `incidents.json`; para cursos no relacionados con seguridad podría renombrarse conceptualmente más adelante.
- No hay impresión real del certificado.
- No hay modo offline con Service Worker todavía.

---

## Próxima versión recomendada

### v0.3 — Quizzes y certificado mejorados

Recomendado incluir:

- Mejor resumen de quiz.
- Feedback final por nivel.
- Promedio general.
- Botón para repetir quiz limpiamente.
- Certificado imprimible.
- Mejor pantalla de avance.

---

## Horizonte hacia v0.6

La v0.6 debería ser la **Plantilla Web Clonable Oficial**:

- Motor separado de contenido.
- Curso ejemplo incluido.
- Documentación clara para clonar.
- Carpeta `/courses` opcional.
- Plantillas JSON vacías.
- Prompt maestro para generar nuevos cursos.
- Validador básico de JSON.

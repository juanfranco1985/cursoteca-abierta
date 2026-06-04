# ESTADO ACTUAL — WEB v0.6

**Proyecto base:** Escudo Comercial Digital Argentina — Curso Web  
**Versión:** 0.6  
**Objetivo de la versión:** convertir el proyecto en una plantilla clonable oficial para crear cursos web educativos rápidamente.

## 1. Estado general

La versión 0.6 deja el motor web separado de la temática del curso. La identidad, rutas de datos, etiquetas, colores, avisos, certificado y reglas generales viven en `src/data/course_manifest.json`. El contenido pedagógico vive en JSON independientes.

La regla central de esta versión es:

> Para crear una variante educativa común no se debería tocar `src/app.js`.

## 2. Motor reutilizable consolidado

El motor actual incluye:

- navegación por hash;
- módulos y lecciones;
- quizzes por módulo;
- feedback inmediato;
- historial de intentos;
- progreso local con `localStorage`;
- checklists persistentes;
- casos/incidentes/tickets/misiones desde JSON;
- modo emergencia o acción rápida;
- constancia interna imprimible;
- exportar/importar progreso;
- panel de accesibilidad;
- responsive móvil/tablet/escritorio;
- manifest web;
- Service Worker básico;
- guía de publicación;
- guía de clonación;
- contratos JSON;
- script de validación local.

## 3. Archivos clave para clonar cursos

Editar por cada curso nuevo:

```text
src/data/course_manifest.json
src/data/course_content.json
src/data/checklists.json
src/data/incidents.json
manifest.webmanifest
README.md
```

Mantener salvo necesidad real:

```text
index.html
styles.css
src/app.js
service-worker.js
scripts/validate-template.mjs
```

## 4. Nuevo kit de plantilla

Se agregan:

```text
templates/data/course_manifest.template.json
templates/data/course_content.template.json
templates/data/checklists.template.json
templates/data/incidents.template.json
scripts/validate-template.mjs
docs/CONTRATOS_JSON_TEMPLATE_V0_6.md
docs/CHECKLIST_CLONACION_CURSO_WEB_V0_6.md
docs/PROMPT_CODEX_CREAR_NUEVO_CURSO_WEB.md
docs/ROADMAP_CURSOS_WEB_CLONABLES.md
docs/AUDITORIA_WEB_V0_6.md
```

## 5. Validación esperada

Desde la raíz del proyecto:

```bash
node scripts/validate-template.mjs
```

El script valida:

- existencia del manifest;
- rutas declaradas en manifest;
- módulos;
- lecciones;
- quizzes;
- checklists;
- casos/incidentes;
- ids duplicados;
- índices correctos de quiz.

## 6. Próxima etapa sugerida

La próxima etapa puede tomar dos caminos:

### Camino A — Crear primer clon real

Crear un curso nuevo usando esta plantilla, por ejemplo:

1. Primeros Auxilios Digitales.
2. IA Práctica para Trabajadores y Emprendedores.
3. Finanzas Digitales Seguras.

### Camino B — v0.7 del motor

Agregar mejoras de fábrica:

- selector de curso desde una carpeta `courses/`;
- generador de índice de cursos;
- modo multiproducto;
- exportación/importación mejorada;
- pruebas automatizadas más estrictas.

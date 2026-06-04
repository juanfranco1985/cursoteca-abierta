# ESTADO ACTUAL — Simulador Laboral de Soporte Técnico Web v0.4

## Objetivo de la versión
Profesionalizar el tablero laboral de tickets para que el curso se parezca más a una mesa de ayuda real.

## Funciones agregadas
- Filtros por estado, prioridad y semáforo SLA educativo.
- Cola priorizada de tickets en `#/ticket-queue`.
- SLA educativo por prioridad: baja, media, alta y crítica.
- Semáforo de tickets: sin iniciar, en tiempo, en riesgo, demorado y cerrado.
- Perfiles de usuario simulados en `#/user-profiles`.
- Tarjetas de ticket con perfil asociado, SLA y acciones rápidas.
- Métricas visuales del tablero ampliadas.

## Archivos modificados
- `index.html`
- `styles.css`
- `src/app.js`
- `src/data/course_manifest.json`
- `service-worker.js`
- `README.md`
- `docs/CHANGELOG_SOPORTE_TECNICO_WEB.md`

## Estado funcional
La app mantiene los 6 módulos, 36 lecciones, 30 preguntas, 6 checklists y 8 tickets. La v0.4 suma criterios de gestión laboral sin cambiar el contrato principal de la plantilla clonable.

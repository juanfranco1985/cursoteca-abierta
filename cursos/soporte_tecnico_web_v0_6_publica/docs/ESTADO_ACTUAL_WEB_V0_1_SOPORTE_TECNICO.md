# Estado actual — Simulador Laboral de Soporte Técnico Web v0.1

## Estado

Primera versión funcional creada como clon de la plantilla web clonable.

## Incluye

- Identidad propia de soporte técnico.
- 6 módulos y 36 lecciones.
- 30 preguntas de quiz.
- 6 checklists.
- 8 tickets simulados usando el contrato `incidents.json`.
- Progreso local.
- Certificado interno no oficial.
- Accesibilidad base.
- PWA básica con manifest y Service Worker.

## Decisión técnica

Para mantener compatibilidad con el motor clonable, los tickets se cargan desde `src/data/incidents.json`, aunque la interfaz los nombra como Tickets.

## Próximo paso recomendado

v0.2: tablero de tickets con estados, prioridades, puntaje de resolución y flujo de atención más laboral.

# ESTADO ACTUAL — Simulador Laboral de Soporte Técnico Web v0.2

## Estado

Versión funcional orientada a tablero laboral de tickets.

## Funciones disponibles

- Curso web navegable.
- 6 módulos, 36 lecciones y 30 preguntas de quiz.
- 6 checklists prácticos.
- 8 tickets simulados cargados desde `src/data/incidents.json`.
- Progreso local con `localStorage`.
- Constancia interna no oficial.
- Panel de accesibilidad.
- PWA básica con `manifest.webmanifest` y `service-worker.js`.
- Nueva ruta `#/ticket-board`.

## Novedad principal v0.2

Se agregó un tablero laboral de tickets para practicar flujo de mesa de ayuda:

- estado del ticket;
- prioridad;
- nota de resolución o escalamiento;
- feedback educativo;
- puntaje por ticket;
- métricas generales;
- eventos recientes.

## Estados disponibles

1. Nuevo.
2. En diagnóstico.
3. Esperando usuario.
4. Escalado.
5. Resuelto.

## Prioridades disponibles

1. Baja.
2. Media.
3. Alta.
4. Crítica.

## Próximo paso recomendado

La v0.3 debería incorporar una bitácora más detallada por ticket, simulador de conversación con usuario y exportación del cierre como `.txt`.

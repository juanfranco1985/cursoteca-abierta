# ESTADO ACTUAL — Emprendimiento Barrial Web v0.3

## Estado

Versión v0.3 funcional orientada a simulación de decisiones de negocio barrial.

## Base

Proviene de Emprendimiento Barrial Web v0.2 y conserva:

- curso modular;
- lecciones;
- quizzes;
- checklists;
- casos de negocio;
- herramientas de negocio;
- progreso local;
- constancia interna;
- Service Worker básico.

## Novedad principal

Se agregó un **Simulador de decisiones de negocio barrial** con casos cotidianos:

1. Elegir productos iniciales.
2. Decidir compra mayorista.
3. Resolver reclamo de cliente.
4. Evaluar si conviene una promoción.
5. Decidir entrega o retiro.
6. Revisar productos de baja rotación.

Cada caso incluye contexto, riesgo, opciones, puntaje educativo, feedback, próxima acción y reporte exportable.

## Rutas nuevas

```text
#/decision-simulator
#/decision-case/{caseId}
#/decision-report
```

## Archivos nuevos

```text
src/data/business_decisions.json
docs/ESTADO_ACTUAL_WEB_V0_3_EMPRENDIMIENTO_BARRIAL.md
docs/AUDITORIA_WEB_V0_3_EMPRENDIMIENTO_BARRIAL.md
docs/PROMPT_CODEX_CONTINUAR_EMPRENDIMIENTO_BARRIAL_WEB_V0_4.md
```

## Límite responsable

El simulador es educativo. No reemplaza asesoramiento contable, impositivo, legal, financiero ni comercial profesional.

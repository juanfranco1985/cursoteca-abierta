# ESTADO ACTUAL — POWER BI PARA PRINCIPIANTES WEB v0.4

## Estado

Versión v0.4 orientada a mejorar la comunicación de dashboards y storytelling con datos.

## Funciones principales agregadas

- Laboratorio de storytelling con datos.
- Simulador de presentación ejecutiva.
- Checklist de lectura de dashboard.
- Reporte ejecutivo copiables, imprimible y exportable como `.txt`.
- Historial local no sensible de presentaciones practicadas.
- Guía de estructura: pregunta de negocio, hallazgo, evidencia, límites, recomendación y próximo paso.

## Rutas nuevas

- `#/storytelling`
- `#/executive-presentation`
- `#/dashboard-reading-checklist`

## Archivos nuevos

- `src/data/storytelling_lab.json`
- `docs/ESTADO_ACTUAL_WEB_V0_4_POWER_BI.md`
- `docs/AUDITORIA_WEB_V0_4_POWER_BI.md`
- `docs/PROMPT_CODEX_CONTINUAR_POWER_BI_WEB_V0_5.md`

## Archivos actualizados

- `src/app.js`
- `src/data/course_manifest.json`
- `service-worker.js`
- `scripts/validate-template.mjs`
- `README.md`
- `manifest.webmanifest`
- `docs/CHANGELOG_POWER_BI_WEB.md`

## Validación

Comandos ejecutados:

```bash
node --check src/app.js
node --check service-worker.js
node scripts/validate-template.mjs
```

Resultado esperado:

- 6 módulos.
- 36 lecciones.
- 30 preguntas.
- 6 checklists.
- 8 casos BI.
- 3 datasets de dashboard.
- 5 KPIs de laboratorio.
- 5 preguntas de negocio.
- 3 escenarios de storytelling.
- 7 ítems de checklist de lectura de dashboard.

## Próximo paso recomendado

v0.5 orientada a publicación:

- README público final.
- Guía de publicación web.
- Guía de capturas.
- Aviso legal y alcance educativo.
- Política de privacidad base.
- Checklist de publicación.
- Carpeta `store/screenshots/`.

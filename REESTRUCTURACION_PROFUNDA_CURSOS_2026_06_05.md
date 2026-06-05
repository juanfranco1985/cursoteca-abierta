# Reestructuracion profunda de cursos - 2026-06-05

## Diagnostico

La tanda anterior mejoro navegacion, estructura, quizzes, checklists y casos, pero no resolvio completamente la profundidad teorica. La auditoria local de 50 cursos detecto:

- 1.800 lecciones.
- Mediana de `shortTheory`: 32 palabras.
- 1.152 lecciones con la frase `En esta leccion se trabaja`.
- 792 lecciones con `Practica de 25 minutos`.
- 792 lecciones con `El error habitual`.
- 1.152 lecciones con `Criterio de cierre`.

Conclusion: el problema no es solo falta de cantidad. Hay una arquitectura editorial demasiado templada, con cambios superficiales entre unidades.

## Nuevo criterio editorial

Cada leccion profunda debe dejar de ser una variacion de plantilla y pasar a una pieza teorica aplicable. La estructura objetivo es:

1. Idea clave especifica.
2. Resumen teorico.
3. Modelo mental.
4. Principio aplicado.
5. Como evaluarlo.
6. Ejemplo practico.
7. Contraejemplo.
8. Error comun.
9. Practica guiada.
10. Conceptos clave.
11. Fuentes externas visibles.

La teoria no se mide solo por cantidad de palabras. Tambien se mide por especificidad, fuente, capacidad de evaluacion y ausencia de frases genericas repetidas.

## Fuentes externas base

Estas fuentes quedan como banco inicial para reescribir por dominios:

- UX/UI y accesibilidad:
  - Nielsen Norman Group, 10 Usability Heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/
  - W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/
  - W3C WAI, Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
  - Material Design 3 Foundations: https://m3.material.io/foundations
  - Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/

- Seguridad digital:
  - NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
  - NIST Privacy Framework: https://www.nist.gov/privacy-framework

- IA y datos:
  - NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
  - W3C Data on the Web Best Practices: https://www.w3.org/TR/dwbp/

- Ciudadania y alfabetizacion digital:
  - UNESCO Digital Literacy Global Framework: https://unesdoc.unesco.org/ark:/48223/pf0000265403

## Piloto aplicado: UX/UI Basico

Curso: `cursos/ux_ui_basico_sitios_apps_v0_6_publica`

Cambios aplicados:

- Version: `0.8-profunda-uxui-v1`.
- 6 modulos reestructurados.
- 36 lecciones con `theorySections`.
- 30 preguntas.
- 6 checklists.
- 8 casos guiados.
- 5 fuentes externas integradas.
- La app ahora renderiza teoria aplicada, bloques teoricos, contraejemplos y fuentes usadas.

Metricas del piloto:

- Patrones repetidos auditados: 0 ocurrencias.
- Lecciones con tres bloques teoricos: 36/36.
- Lecciones con fuentes: 36/36.
- Teoria total por leccion, sumando resumen y bloques:
  - minimo: 91 palabras.
  - mediana: 109 palabras.
  - promedio: 112 palabras.
  - maximo: 172 palabras.

## Proximo despliegue recomendado

No conviene reescribir los 49 cursos restantes con una sola plantilla nueva, porque eso recrearia el mismo problema. La reestructuracion debe ir por familias, con fuentes especificas y validacion de repeticion.

Orden sugerido:

1. Seguridad digital:
   `privacidad_digital_ciudadana`, `primeros_auxilios_digitales`, `seguridad_familiar`, `seguridad_digital_docentes`, `android_seguro`, `finanzas_digitales_seguras`.

2. Datos e IA:
   `ia_practica`, `automatizacion_ia_tareas`, `python_datos`, `power_bi`, `sql_practico`, `calidad_datos`, `gobierno_datos`, `storytelling_datos`.

3. Empleabilidad y productividad:
   `cv_linkedin`, `teletrabajo`, `notion_trello`, `google_workspace`, `excel_google_sheets`.

4. Negocios y finanzas:
   `costos_precios_rentabilidad`, `educacion_financiera`, `monotributo`, `emprendimiento_barrial`, `tienda_online`, `whatsapp_business`.

5. Desarrollo web:
   `html`, `css`, `javascript`, `react`, `apis`, `git_github`, `publicacion_web`.

## Puerta de calidad por curso

Antes de marcar un curso como reestructurado:

- Cero ocurrencias de patrones genericos auditados.
- Todas las lecciones con bloques teoricos o estructura equivalente.
- Todas las lecciones con ejemplo y contraejemplo.
- Fuentes externas por modulo y, cuando aplique, por leccion.
- Teoria total con mediana minima de 90 palabras por leccion.
- Quiz y checklist alineados con conceptos teoricos, no solo con acciones genericas.
- Inventario y portal sincronizados.
- JSON parseado correctamente.
- Zip actualizado.


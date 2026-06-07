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

## Diagnostico externo incorporado

El diagnostico general recibido el 2026-06-05 refuerza cuatro decisiones de producto:

- La marca y el portal tienen una base solida, pero la profundidad real de los cursos no sostiene todavia una promesa de "50 cursos completos al mismo nivel profesional".
- La prioridad no debe ser sumar mas cursos, sino enriquecer los 10 o 12 cursos principales.
- El portal necesita rutas recomendadas para usuarios nuevos, porque un catalogo amplio puede generar indecision.
- La confianza pedagogica debe explicarse mejor: metodologia, nivel, resultado esperado, fecha de actualizacion y estado editorial.

Accion aplicada: se ajusto la promesa publica del portal a "biblioteca inicial en ampliacion editorial", se agregaron rutas recomendadas y se explicito la metodologia de revision.

## Insumo de investigacion v0.9

El paquete `cursoteca_investigacion_profesional_web_v0_9.zip` fue incorporado al repositorio como insumo editorial:

`investigacion/cursoteca_investigacion_profesional_web_v0_9/`

Validacion local:

- 50 fichas individuales.
- 50 slugs coinciden con las 50 carpetas de cursos.
- 0 cursos sin ficha.

Advertencia: este paquete no debe aplicarse como reescritura automatica. Varias fichas todavia contienen conceptos genericos o conceptos cruzados de otro dominio. Debe usarse como matriz de objetivos, fuentes y productos finales, con verificacion de fuentes primarias antes de cada tanda.

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

## Cursos completos v1 incorporados

El 2026-06-05 se integraron los primeros cinco cursos reescritos que empiezan a cumplir la norma de curso completo:

- Astronomia General para Curiosos: 9 modulos, 9 lecciones, producto final: Guia personal de iniciacion astronomica.
- Computacion Cuantica para Curiosos: 12 modulos, 12 lecciones, producto final: Mapa conceptual de computacion cuantica sin humo.
- Escudo Comercial Digital Argentina: 10 modulos, 34 lecciones, producto final: Escudo comercial digital minimo para un comercio.
- Alfabetizacion Digital para Adultos: 11 modulos, 44 lecciones, producto final: Carpeta personal de autonomia digital.
- Android Seguro para Principiantes: 12 modulos, 46 lecciones, producto final: Checklist de telefono Android seguro.

Estos cursos ya reemplazan la estructura templada anterior en sus JSON de curso y quedan marcados como `Curso completo v1` en portal e inventario.

## Cursos completos v1 incorporados 06-50

El 2026-06-07 se integraron los 45 cursos reescritos del 06 al 50 que completan la norma de curso completo:

- Ciudadano Digital Argentina: 12 modulos, 47 lecciones, producto final: Carpeta Ciudadana Digital Personal.
- Cuidado Digital para Adultos Mayores y Familias: 12 modulos, 49 lecciones, producto final: Plan Familiar de Cuidado Digital.
- Finanzas Digitales Seguras Argentina: 12 modulos, 49 lecciones, producto final: Protocolo de Finanzas Digitales Seguras.
- Primeros Auxilios Digitales: 12 modulos, 51 lecciones, producto final: Kit de Primeros Auxilios Digitales.
- Privacidad Digital Ciudadana: 12 modulos, 49 lecciones, producto final: Plan de Privacidad Digital Ciudadana.
- Seguridad Digital Escolar: 12 modulos, 48 lecciones, producto final: Protocolo Escolar de Seguridad Digital.
- Seguridad Digital para Docentes: 12 modulos, 50 lecciones, producto final: Plan Docente de Seguridad Digital.
- Seguridad Familiar en Internet: 12 modulos, 49 lecciones, producto final: Plan Familiar de Seguridad en Internet.
- Tramites Digitales Argentina: 12 modulos, 48 lecciones, producto final: Carpeta Personal de Trámites Digitales.
- Atencion al Cliente por WhatsApp y Redes: 12 modulos, 50 lecciones, producto final: Manual Básico de Atención Digital.
- Automatizacion con IA para Tareas Repetitivas: 12 modulos, 53 lecciones, producto final: Primer Plan de Automatización con IA.
- CV, LinkedIn y Busqueda Laboral Digital: 12 modulos, 50 lecciones, producto final: Kit Personal de Búsqueda Laboral Digital.
- Excel y Google Sheets desde Cero: 14 modulos, 63 lecciones, producto final: Planilla Funcional desde Cero.
- Google Workspace para Trabajo y Datos: 14 modulos, 68 lecciones, producto final: Sistema Básico de Trabajo y Datos en Google Workspace.
- IA Practica para Trabajadores y Emprendedores: 14 modulos, 58 lecciones, producto final: Kit Personal de IA Práctica.
- Notion, Trello y Organizacion Personal: 14 modulos, 61 lecciones, producto final: Sistema Personal de Organización Digital.
- Simulador Laboral de Soporte Técnico: 15 modulos, 76 lecciones, producto final: Protocolo Inicial de Soporte Técnico.
- Teletrabajo Seguro y Productivo: 15 modulos, 60 lecciones, producto final: Plan Personal de Teletrabajo Seguro y Productivo.
- Analista de Datos Ciudadano: 14 modulos, 71 lecciones, producto final: Mini Diagnóstico de Datos Ciudadano.
- Calidad de Datos para Principiantes: 14 modulos, 70 lecciones, producto final: Informe Básico de Calidad de Datos.
- Catálogo de Datos y Alation: 15 modulos, 78 lecciones, producto final: Mini Catálogo de Datos Inicial.
- Estadistica Basica para Decisiones: 15 modulos, 76 lecciones, producto final: Informe Estadístico Básico para una Decisión.
- Excel para Analisis de Datos: 15 modulos, 76 lecciones, producto final: Dashboard Analítico Básico en Excel.
- Gobierno de Datos Basico: 15 modulos, 77 lecciones, producto final: Plan Básico de Gobierno de Datos.
- Power BI para Principiantes: 15 modulos, 79 lecciones, producto final: Reporte Básico en Power BI.
- Python para Datos desde Cero: 18 modulos, 96 lecciones, producto final: Mini Análisis de Datos con Python.
- SQL Práctico para Análisis de Datos: 19 modulos, 100 lecciones, producto final: Mini Análisis con SQL.
- Storytelling con Datos: 16 modulos, 82 lecciones, producto final: Presentación de Storytelling con Datos.
- Tableau para Visualización de Datos: 18 modulos, 93 lecciones, producto final: Dashboard Inicial en Tableau.
- Costos, Precios y Rentabilidad: 18 modulos, 90 lecciones, producto final: Planilla Básica de Costos, Precios y Rentabilidad.
- Educacion Financiera Basica Argentina: 18 modulos, 89 lecciones, producto final: Plan Financiero Personal Básico.
- Emprendimiento Barrial: 18 modulos, 90 lecciones, producto final: Plan de Emprendimiento Barrial de 30 Días.
- Marketing Digital Barrial: 18 modulos, 91 lecciones, producto final: Plan de Marketing Digital Barrial de 30 Días.
- Monotributo y Organizacion Administrativa Basica: 19 modulos, 99 lecciones, producto final: Sistema Administrativo Básico para Monotributo.
- Tienda Online para Principiantes: 19 modulos, 88 lecciones, producto final: Plan Inicial de Tienda Online.
- WhatsApp Business Avanzado: 18 modulos, 87 lecciones, producto final: Sistema Comercial de WhatsApp Business.
- Accesibilidad Web para Principiantes: 18 modulos, 90 lecciones, producto final: Mejora Básica de Accesibilidad Web sobre una página real o ficticia.
- APIs para Proyectos Web: 20 modulos, 97 lecciones, producto final: Mini Proyecto Web con API.
- CSS Práctico para Principiantes: 19 modulos, 92 lecciones, producto final: Landing Page Responsive con CSS.
- Git y GitHub para Proyectos Web: 20 modulos, 90 lecciones, producto final: Proyecto Web Versionado y Publicado.
- HTML Práctico para Principiantes: 19 modulos, 86 lecciones, producto final: Página HTML Semántica Completa.
- JavaScript desde Cero: 20 modulos, 91 lecciones, producto final: Mini Aplicación Web Interactiva.
- Publicación Web para Principiantes: 20 modulos, 86 lecciones, producto final: Web Publicada y Documentada.
- React Basico para Principiantes: 19 modulos, 83 lecciones, producto final: Mini Aplicación React.
- UX/UI Basico para Sitios y Apps: 22 modulos, 98 lecciones, producto final: Prototipo Básico UX/UI.

Estos cursos reemplazan la estructura templada anterior en sus JSON de curso y quedan marcados como `Curso completo v1` en portal e inventario.

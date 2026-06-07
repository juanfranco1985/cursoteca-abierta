# Curso 16 — Automatización con IA para Tareas Repetitivas

## Presentación del curso

Muchas personas pierden horas cada semana haciendo tareas repetitivas: copiar datos de un mensaje a una planilla, responder siempre las mismas consultas, ordenar archivos, renombrar documentos, resumir correos, preparar reportes, cargar información en formularios, revisar listas, clasificar pedidos o transformar textos.

La automatización con IA permite reducir parte de ese trabajo manual. No significa reemplazar totalmente a una persona ni dejar que una máquina decida todo. Significa identificar tareas repetitivas, dividirlas en pasos, usar herramientas digitales para ejecutarlas mejor y agregar inteligencia artificial donde aporte valor: resumir, clasificar, redactar, extraer, comparar o sugerir.

Este curso está pensado para trabajadores, administrativos, emprendedores, docentes, pequeños negocios, estudiantes y personas que quieren organizar mejor su trabajo cotidiano. No requiere saber programar. El objetivo es aprender a detectar oportunidades de automatización, diseñar flujos simples y usar IA de manera segura, útil y responsable.

La idea central es:

> Automatizar no es hacer magia. Es convertir una tarea repetida en un proceso claro, medible y mejorable.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es automatización y qué diferencia hay entre automatizar, digitalizar y usar IA.
2. Identificar tareas repetitivas en el trabajo, estudio o emprendimiento.
3. Dividir una tarea en pasos simples.
4. Reconocer entradas, salidas, reglas, excepciones y responsables.
5. Diseñar flujos básicos de automatización sin código.
6. Usar IA para resumir, clasificar, redactar, extraer y organizar información.
7. Crear prompts útiles para tareas repetitivas.
8. Evitar automatizar procesos desordenados, inseguros o sensibles.
9. Incorporar revisión humana en puntos críticos.
10. Construir un mapa personal de automatizaciones posibles.

---

# Módulo 1 — Qué es automatización

## 1.1 Definición

La automatización es el uso de herramientas, reglas o sistemas para ejecutar tareas con mínima intervención humana.

Ejemplos simples:

- recibir un formulario y guardar la respuesta en una planilla;
- enviar un correo automático de confirmación;
- mover archivos a una carpeta según su nombre;
- generar recordatorios;
- clasificar mensajes;
- crear tareas desde correos;
- enviar alertas cuando cambia una celda;
- completar una plantilla;
- resumir textos largos;
- transformar datos de un formato a otro.

La automatización no siempre usa IA. Puede basarse en reglas simples: “si ocurre esto, hacer aquello”.

## 1.2 Digitalizar no es automatizar

Digitalizar significa pasar algo a formato digital.

Ejemplo:

- antes anotaba pedidos en papel;
- ahora los anoto en una planilla.

Automatizar significa que parte del proceso se ejecuta sola.

Ejemplo:

- el cliente completa un formulario;
- la respuesta se guarda automáticamente;
- se envía confirmación;
- se crea una tarea;
- se actualiza el estado del pedido.

Digitalizar ordena. Automatizar acelera y reduce repetición.

## 1.3 IA no es automatización completa

La IA puede formar parte de una automatización, pero no todo uso de IA es automatización.

Ejemplo de uso de IA no automatizado:

- pedirle a ChatGPT que redacte un mensaje.

Ejemplo de automatización con IA:

- cada vez que llega una consulta, el sistema la clasifica como venta, reclamo o soporte;
- luego sugiere una respuesta;
- una persona revisa antes de enviarla.

La IA aporta capacidad de interpretación, generación y clasificación. La automatización aporta flujo, repetición y ejecución.

## 1.4 Automatización responsable

No todo debe automatizarse.

Conviene evitar automatizar completamente:

- decisiones legales;
- diagnósticos médicos;
- despidos;
- aprobaciones financieras críticas;
- respuestas sensibles a clientes;
- manejo de datos personales sin control;
- acciones irreversibles;
- comunicaciones que requieren empatía;
- tareas mal definidas.

La regla práctica:

> Si un error puede causar daño importante, debe haber revisión humana.

---

# Módulo 2 — Detectar tareas repetitivas

## 2.1 Qué tareas conviene mirar

Una buena candidata a automatización suele ser:

- repetitiva;
- frecuente;
- clara;
- basada en reglas;
- con datos estructurados;
- de bajo riesgo;
- medible;
- aburrida;
- propensa a errores manuales.

Ejemplos:

- copiar datos de pedidos;
- responder preguntas frecuentes;
- ordenar archivos;
- enviar recordatorios;
- crear presupuestos simples;
- actualizar planillas;
- resumir reuniones;
- clasificar correos;
- generar reportes semanales;
- renombrar documentos.

## 2.2 Señales de oportunidad

Hay oportunidad de automatizar cuando una persona dice:

- “esto lo hago todos los días”;
- “siempre copio y pego lo mismo”;
- “me olvido de avisar”;
- “tengo que revisar muchas veces”;
- “pierdo tiempo buscando archivos”;
- “respondo siempre igual”;
- “me equivoco al pasar datos”;
- “nadie sabe en qué estado está”;
- “depende de que yo me acuerde”.

## 2.3 Tareas que no conviene automatizar al principio

Para principiantes, evitar empezar por tareas:

- críticas;
- legales;
- bancarias;
- con datos sensibles;
- con muchas excepciones;
- que requieren juicio profesional;
- que cambian todos los días;
- que nadie entiende bien;
- que no tienen responsable claro.

Primero se automatizan tareas pequeñas y seguras.

## 2.4 Matriz de selección

Una matriz simple:

| Tarea | Frecuencia | Tiempo que consume | Riesgo | Claridad | Prioridad |
|---|---:|---:|---:|---:|---:|
| Responder horarios | Alta | Bajo | Bajo | Alta | Media |
| Pasar pedidos a planilla | Alta | Medio | Medio | Alta | Alta |
| Aprobar devoluciones | Media | Alto | Alto | Media | Baja |
| Resumir reuniones | Media | Medio | Bajo | Alta | Alta |
| Enviar recordatorios | Alta | Bajo | Bajo | Alta | Alta |

---

# Módulo 3 — Pensar en procesos

## 3.1 Qué es un proceso

Un proceso es una serie de pasos que transforma una entrada en una salida.

Ejemplo:

Entrada:

- mensaje de cliente.

Proceso:

1. leer consulta;
2. identificar producto;
3. verificar stock;
4. informar precio;
5. pedir datos;
6. confirmar pago;
7. registrar pedido.

Salida:

- pedido confirmado o consulta cerrada.

## 3.2 Entrada, transformación y salida

Toda automatización debe tener:

- entrada;
- reglas;
- transformación;
- salida;
- responsable;
- control.

Ejemplo:

Entrada:

- formulario de inscripción.

Transformación:

- validar datos;
- guardar en planilla;
- enviar correo;
- crear registro.

Salida:

- inscripción registrada.

## 3.3 Excepciones

Las excepciones son casos que no siguen el camino normal.

Ejemplos:

- falta un dato;
- el correo está mal escrito;
- el cliente ya existe;
- el archivo es ilegible;
- el pago no coincide;
- la IA no está segura;
- el mensaje es agresivo;
- el pedido es urgente.

Una automatización profesional no ignora excepciones: las deriva.

## 3.4 Documentar antes de automatizar

Antes de usar herramientas, escribir:

1. qué tarea quiero automatizar;
2. quién la hace hoy;
3. cada cuánto ocurre;
4. qué datos necesita;
5. qué resultado debe producir;
6. qué errores pueden pasar;
7. quién revisa;
8. qué pasa si falla.

Si no se puede explicar en papel, todavía no conviene automatizar.

---

# Módulo 4 — Tipos de automatización

## 4.1 Automatización basada en reglas

Funciona con lógica simple:

- si llega un correo con una palabra, etiquetarlo;
- si se completa un formulario, guardar respuesta;
- si vence una fecha, enviar recordatorio;
- si una celda cambia, avisar;
- si un archivo se sube a carpeta, moverlo.

Es ideal para empezar.

## 4.2 Automatización de flujos

Un flujo conecta varias aplicaciones o pasos.

Ejemplo:

1. cliente completa formulario;
2. respuesta entra a Google Sheets;
3. se crea tarea en Trello;
4. se envía correo de confirmación;
5. se notifica al equipo por WhatsApp o Slack.

Herramientas como Power Automate permiten crear flujos automatizados entre aplicaciones y servicios para sincronizar archivos, recibir notificaciones, recopilar datos y más.

## 4.3 RPA

RPA significa Robotic Process Automation. Se usa para automatizar acciones en interfaces cuando no hay integración directa por API.

Ejemplos:

- abrir una aplicación;
- copiar datos;
- pegar en sistema;
- descargar archivo;
- completar formulario repetitivo.

Power Automate contempla tanto automatización digital como RPA para conectar servicios modernos y aplicaciones o sitios sin conectores API.

## 4.4 Automatización con IA

La IA agrega capacidades como:

- resumir;
- clasificar;
- redactar;
- traducir;
- extraer datos;
- detectar intención;
- convertir texto desordenado en tabla;
- generar borradores;
- analizar sentimiento;
- comparar documentos.

---

# Módulo 5 — Herramientas sin código

## 5.1 Categorías de herramientas

Existen muchas herramientas. Lo importante no es casarse con una, sino entender categorías:

- formularios;
- planillas;
- gestores de tareas;
- automatizadores;
- correo;
- almacenamiento en la nube;
- calendarios;
- IA generativa;
- CRM;
- herramientas de atención;
- herramientas de reportes.

## 5.2 Herramientas comunes

Ejemplos:

- Google Forms;
- Google Sheets;
- Google Drive;
- Gmail;
- Google Calendar;
- Microsoft Forms;
- Excel;
- OneDrive;
- Outlook;
- Power Automate;
- Zapier;
- Make;
- Notion;
- Trello;
- Airtable;
- ChatGPT;
- herramientas de IA integradas en suites de trabajo.

## 5.3 No-code y low-code

No-code significa que se puede construir sin programar.

Low-code significa que se puede construir con poca programación o fórmulas simples.

Para la Cursoteca, el enfoque inicial debe ser no-code:

- formularios;
- planillas;
- plantillas;
- automatizaciones simples;
- IA como asistente;
- revisión humana.

## 5.4 Criterios para elegir herramienta

Antes de elegir:

- ¿la entiendo?
- ¿tiene versión gratuita?
- ¿se integra con lo que ya uso?
- ¿protege datos?
- ¿puedo exportar información?
- ¿tiene límites?
- ¿puedo mantenerla?
- ¿otra persona puede usarla?
- ¿qué pasa si deja de funcionar?
- ¿hay soporte o documentación?

---

# Módulo 6 — IA para tareas repetitivas

## 6.1 Qué tareas puede ayudar a resolver la IA

La IA puede ayudar en tareas como:

- redactar respuestas;
- resumir documentos;
- clasificar consultas;
- extraer datos de texto;
- transformar listas;
- corregir estilo;
- generar ideas;
- crear plantillas;
- comparar versiones;
- explicar información;
- ordenar notas de reunión;
- producir borradores de informes.

## 6.2 Qué no debe hacer sola

La IA no debería decidir sin revisión humana en temas:

- legales;
- médicos;
- financieros críticos;
- disciplinarios;
- laborales sensibles;
- datos personales;
- reclamos graves;
- atención emocional;
- decisiones irreversibles.

## 6.3 IA como copiloto, no piloto automático

La IA funciona mejor cuando actúa como asistente:

- propone;
- resume;
- clasifica;
- redacta;
- estructura;
- detecta patrones;
- ayuda a revisar.

La persona decide, valida y responde por el resultado.

## 6.4 Ejemplos prácticos

### Atención al cliente

Entrada:

> “Hola, quiero saber si tienen envío a Santo Tomé y cuánto tarda.”

IA:

- clasifica: consulta de envío;
- sugiere respuesta;
- detecta ubicación;
- pide zona exacta si falta.

### Administración

Entrada:

> lista de gastos desordenada.

IA:

- ordena por categoría;
- detecta fechas;
- crea tabla;
- marca datos faltantes.

### Educación

Entrada:

> notas de una reunión.

IA:

- resume acuerdos;
- lista tareas;
- identifica responsables;
- genera acta borrador.

---

# Módulo 7 — Prompts para automatizar

## 7.1 Qué es un prompt

Un prompt es una instrucción dada a un modelo de IA para obtener una respuesta útil.

## 7.2 Prompt básico

Estructura recomendada:

1. rol;
2. tarea;
3. contexto;
4. entrada;
5. formato de salida;
6. restricciones;
7. criterio de calidad.

Ejemplo:

> Actúa como asistente administrativo. Clasifica los siguientes mensajes de clientes en: venta, reclamo, soporte o consulta general. Devuelve una tabla con: mensaje, categoría, urgencia y acción sugerida. No inventes datos.

## 7.3 Prompts reutilizables

Para tareas repetitivas, conviene crear plantillas.

### Prompt para resumir

> Resume el siguiente texto en 5 viñetas. Incluye decisiones tomadas, tareas pendientes, responsables y fechas. Si falta información, indícalo como “no informado”.

### Prompt para clasificar

> Clasifica estos mensajes en las categorías: venta, reclamo, soporte, pago, envío u otro. Agrega prioridad alta, media o baja y explica brevemente por qué.

### Prompt para transformar datos

> Convierte esta lista desordenada en una tabla con columnas: fecha, cliente, producto, monto, estado y observaciones. Si algún dato falta, escribe “pendiente”.

## 7.4 Evitar prompts peligrosos

Mal prompt:

> Respondé automáticamente a todos los reclamos como si estuviera todo bien.

Mejor prompt:

> Genera un borrador de respuesta cordial para este reclamo. No prometas compensaciones. Pide datos necesarios y deriva a revisión humana si falta información.

---

# Módulo 8 — Diseño de flujos con IA

## 8.1 Estructura básica

Un flujo con IA puede tener:

1. disparador;
2. entrada;
3. procesamiento;
4. IA;
5. revisión;
6. acción;
7. registro.

Ejemplo:

- llega formulario;
- se guarda respuesta;
- IA resume necesidad;
- persona revisa;
- se envía correo;
- se crea tarea.

## 8.2 Disparadores

Un disparador inicia el flujo.

Ejemplos:

- nuevo correo;
- nuevo formulario;
- nueva fila en planilla;
- archivo subido;
- fecha programada;
- comentario nuevo;
- mensaje recibido;
- tarea vencida.

## 8.3 Acciones

Acciones posibles:

- enviar correo;
- crear tarea;
- actualizar planilla;
- mover archivo;
- generar documento;
- enviar notificación;
- crear evento;
- clasificar registro;
- pedir aprobación;
- generar resumen.

## 8.4 Revisión humana

La revisión humana debe aparecer cuando:

- hay datos sensibles;
- hay dinero;
- hay reclamos;
- hay decisiones importantes;
- la IA no está segura;
- el mensaje es agresivo;
- la respuesta puede afectar reputación;
- hay impacto legal o laboral.

---

# Módulo 9 — Automatización en emprendimientos

## 9.1 Casos comunes

Un emprendimiento puede automatizar:

- registro de pedidos;
- confirmaciones;
- recordatorios de pago;
- respuestas frecuentes;
- actualización de stock;
- seguimiento de envíos;
- encuestas de satisfacción;
- reportes semanales;
- agenda de turnos;
- clasificación de reclamos.

## 9.2 Ejemplo: pedidos por formulario

Flujo:

1. cliente completa formulario;
2. datos entran a planilla;
3. se envía confirmación;
4. se crea tarea de preparación;
5. se etiqueta pedido;
6. se genera resumen diario;
7. persona revisa pagos.

## 9.3 Ejemplo: reportes semanales

Cada viernes:

1. la planilla calcula ventas;
2. IA resume principales movimientos;
3. detecta productos más vendidos;
4. lista reclamos;
5. sugiere acciones;
6. dueño revisa.

## 9.4 Riesgos

- automatizar con precios viejos;
- enviar respuestas erróneas;
- duplicar pedidos;
- exponer datos;
- no detectar pagos faltantes;
- depender de una herramienta gratuita;
- no tener copia de seguridad.

---

# Módulo 10 — Automatización en trabajo administrativo

## 10.1 Tareas frecuentes

- actas de reunión;
- seguimiento de tareas;
- envío de recordatorios;
- clasificación de correos;
- generación de informes;
- carga de datos;
- control de vencimientos;
- organización de archivos;
- creación de carpetas;
- respuesta a consultas internas.

## 10.2 Reuniones

Flujo posible:

1. se toman notas;
2. IA genera resumen;
3. se extraen tareas;
4. se asignan responsables;
5. se crean recordatorios;
6. se guarda acta;
7. se envía borrador para revisión.

## 10.3 Correos

Automatizaciones posibles:

- etiquetar por asunto;
- separar facturas;
- detectar urgentes;
- crear tareas;
- resumir hilos largos;
- generar borradores;
- avisar vencimientos.

## 10.4 Archivos

Automatizar:

- renombrado;
- clasificación;
- carpetas por cliente;
- respaldo;
- conversión;
- alertas de documentos faltantes.

---

# Módulo 11 — Seguridad, privacidad y límites

## 11.1 Datos que no conviene automatizar sin cuidado

- DNI;
- datos bancarios;
- claves;
- salud;
- menores;
- información laboral sensible;
- reclamos graves;
- datos fiscales;
- contratos;
- información de clientes;
- documentos privados.

## 11.2 Principio de minimización

Solo usar los datos necesarios.

Ejemplo:

Para clasificar consultas no hace falta enviar DNI del cliente a una IA.

Para resumir reclamos, puede anonimizarse:

- Cliente A;
- Pedido 123;
- Producto X.

## 11.3 Revisión de permisos

Antes de conectar herramientas:

- qué datos accede;
- qué puede modificar;
- quién administra;
- qué pasa si se revoca;
- dónde se guarda;
- si hay exportación;
- quién puede ver resultados;
- si cumple políticas del negocio.

## 11.4 Fallas de automatización

Toda automatización debe tener plan de falla:

- notificación de error;
- responsable;
- registro;
- reversión;
- revisión manual;
- copia de datos;
- prueba periódica.

---

# Módulo 12 — Plan personal de automatización

## 12.1 Inventario de tareas

Crear lista:

- tareas diarias;
- tareas semanales;
- tareas mensuales;
- tareas repetitivas;
- tareas molestas;
- tareas con errores frecuentes;
- tareas que dependen de memoria;
- tareas que generan demoras.

## 12.2 Selección de primera automatización

Elegir una tarea:

- frecuente;
- simple;
- de bajo riesgo;
- con pasos claros;
- que ahorre tiempo;
- que pueda probarse sin afectar clientes.

## 12.3 Diseño

Completar:

| Elemento | Descripción |
|---|---|
| Tarea |  |
| Entrada |  |
| Pasos actuales |  |
| Herramientas |  |
| IA necesaria |  |
| Revisión humana |  |
| Resultado esperado |  |
| Riesgos |  |
| Cómo probar |  |

## 12.4 Mejora continua

Después de probar:

- medir tiempo ahorrado;
- detectar errores;
- ajustar prompt;
- mejorar datos de entrada;
- agregar validaciones;
- documentar;
- capacitar a otra persona;
- revisar seguridad.

---

# Caso práctico integrador

## Caso: automatización de consultas de un emprendimiento

Un emprendimiento recibe 40 mensajes diarios por redes y WhatsApp. Muchas consultas son repetidas: horarios, precios, medios de pago, envíos y disponibilidad. La persona que atiende pierde tiempo respondiendo lo mismo y a veces olvida registrar pedidos.

### Paso 1 — Identificar tarea

Problema:

- consultas repetidas;
- pedidos no registrados;
- demoras.

### Paso 2 — Clasificar mensajes

Categorías:

- precio;
- envío;
- pago;
- stock;
- reclamo;
- otro.

### Paso 3 — Crear respuestas rápidas

Se redactan plantillas para cada categoría.

### Paso 4 — Usar IA como apoyo

La IA ayuda a:

- clasificar mensajes;
- sugerir respuesta;
- resumir pedidos;
- detectar reclamos.

### Paso 5 — Registro

Cada pedido confirmado se carga en una planilla.

### Paso 6 — Revisión humana

Ninguna respuesta sensible se envía automáticamente sin revisión.

### Paso 7 — Medición

Se mide:

- tiempo de respuesta;
- consultas resueltas;
- pedidos registrados;
- reclamos.

---

# Actividades del curso

## Actividad 1 — Inventario de tareas repetitivas

Listar 15 tareas repetitivas personales, laborales o comerciales.

Clasificar:

- diaria;
- semanal;
- mensual;
- alta pérdida de tiempo;
- alto riesgo;
- candidata a automatización.

## Actividad 2 — Mapa de proceso

Elegir una tarea y escribir:

- entrada;
- pasos;
- salida;
- excepciones;
- responsable.

## Actividad 3 — Prompt reutilizable

Crear un prompt para:

- resumir;
- clasificar;
- convertir en tabla;
- redactar respuesta.

## Actividad 4 — Diseño de flujo

Diseñar un flujo simple:

- disparador;
- acción;
- IA;
- revisión;
- resultado.

## Actividad 5 — Matriz de riesgos

Indicar:

- datos usados;
- riesgo;
- impacto;
- revisión humana;
- medida de seguridad.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es automatización?
2. ¿Qué diferencia hay entre digitalizar y automatizar?
3. ¿Qué aporta la IA a una automatización?
4. ¿Qué tareas conviene automatizar primero?
5. ¿Qué tareas no conviene automatizar completamente?
6. ¿Qué es un disparador?
7. ¿Qué es una acción?
8. ¿Por qué es importante documentar procesos?
9. ¿Por qué debe haber revisión humana?
10. ¿Qué riesgos de privacidad existen al automatizar?

## Parte 2 — Producción práctica

El estudiante debe entregar un documento llamado:

**“Mi Primer Plan de Automatización con IA”**

Debe incluir:

1. inventario de tareas repetitivas;
2. matriz de selección;
3. proceso elegido;
4. flujo paso a paso;
5. herramienta sugerida;
6. prompt reutilizable;
7. punto de revisión humana;
8. riesgos;
9. prueba inicial;
10. métrica de mejora.

---

# Glosario básico

Automatización: uso de herramientas o reglas para ejecutar tareas con mínima intervención humana.

Digitalización: conversión de procesos o información al formato digital.

IA: inteligencia artificial, sistema capaz de generar, clasificar, resumir o analizar información según instrucciones.

Flujo: secuencia de pasos automatizados.

Disparador: evento que inicia una automatización.

Acción: tarea que ejecuta el sistema después del disparador.

RPA: automatización robótica de procesos, usada para automatizar acciones en interfaces o aplicaciones.

No-code: construcción de soluciones sin programar.

Low-code: construcción con poca programación.

Prompt: instrucción dada a un modelo de IA.

Revisión humana: control realizado por una persona antes de aprobar una acción o salida.

Excepción: caso que no sigue el camino normal del proceso.

---

# Producto final del curso

Al finalizar, el estudiante debe crear su **Primer Plan de Automatización con IA**.

Ese plan debe permitir:

- detectar tareas repetitivas;
- elegir una automatización segura;
- describir pasos;
- usar IA con criterio;
- crear prompts reutilizables;
- incorporar revisión humana;
- medir mejoras;
- proteger datos;
- evitar automatizar errores;
- construir una base para flujos más avanzados.

El curso termina cuando la persona deja de ver la IA como una herramienta aislada y empieza a usarla como parte de procesos reales.

---

# Fuentes recomendadas para profundizar

- Microsoft Power Automate Documentation.
- Microsoft Power Automate — tipos de automatización de procesos.
- Microsoft Power Automate — aprobaciones.
- Zapier — workflow automation.
- Zapier — AI automation.
- OpenAI — Prompt Engineering Guide.
- Microsoft Azure OpenAI — Prompt Engineering.
- Materiales sobre no-code, productividad, RPA, mejora de procesos y gestión operativa.

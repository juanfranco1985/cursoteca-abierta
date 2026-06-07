# Curso 26 — Catálogo de Datos y Alation

## Presentación del curso

A medida que una organización crece, también crece su cantidad de datos: planillas, bases SQL, dashboards, archivos, reportes, formularios, indicadores, clientes, productos, ventas, reclamos, campañas, sistemas y documentos. El problema aparece cuando nadie sabe exactamente dónde está el dato correcto, qué significa cada campo, quién lo mantiene, cuándo se actualizó, qué tan confiable es o si se puede usar para cierto propósito.

Un catálogo de datos ayuda a resolver ese problema. Funciona como un inventario organizado de activos de datos: permite descubrir qué datos existen, entender su significado, revisar contexto, identificar responsables, documentar reglas, relacionar datos técnicos con definiciones de negocio y fortalecer la confianza.

Alation es una de las plataformas conocidas en el mundo de catálogos de datos y data intelligence. Su enfoque combina búsqueda, documentación, colaboración, gobierno, glosarios, linaje, stewardship y conocimiento compartido sobre los datos.

Este curso está pensado para principiantes de análisis de datos, estudiantes, equipos administrativos, analistas ciudadanos, responsables de calidad, perfiles de BI, data stewards iniciales y personas que quieren comprender cómo se ordenan y gobiernan los datos en una organización moderna.

No requiere experiencia previa con Alation. El objetivo es entender los conceptos principales y simular prácticas profesionales que también pueden aplicarse con herramientas simples como planillas, Notion, Google Drive, SharePoint o wikis internas.

La idea central es:

> Un catálogo de datos no guarda datos por guardar. Ayuda a encontrar, entender, confiar y usar datos correctamente.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es un catálogo de datos.
2. Diferenciar datos, metadatos, glosario, diccionario y linaje.
3. Identificar activos de datos en una organización.
4. Documentar significado, dueño, fuente y uso de un dato.
5. Comprender el rol de data owner, data steward y data consumer.
6. Reconocer cómo un catálogo apoya gobierno y calidad de datos.
7. Entender las funciones principales de una plataforma como Alation.
8. Crear una ficha básica de activo de datos.
9. Diseñar un glosario de negocio inicial.
10. Elaborar un mini catálogo de datos para un caso real o ficticio.

---

# Módulo 1 — El problema de encontrar datos confiables

## 1.1 El caos de datos

En muchas organizaciones, los datos existen, pero están dispersos:

- planillas en carpetas personales;
- dashboards sin explicación;
- bases con nombres técnicos;
- columnas sin definición;
- reportes duplicados;
- archivos “final final”;
- sistemas sin documentación;
- indicadores calculados de distinta forma;
- responsables poco claros.

El resultado es confusión.

## 1.2 Preguntas frecuentes

Cuando no hay catálogo, aparecen preguntas como:

- ¿Dónde está la base correcta de clientes?
- ¿Qué significa “cliente activo”?
- ¿Quién mantiene esta tabla?
- ¿Este dashboard sigue vigente?
- ¿De dónde sale este indicador?
- ¿Puedo usar estos datos para reportar a dirección?
- ¿Cuándo se actualizó esta información?
- ¿Hay datos sensibles?
- ¿Qué diferencia hay entre ventas brutas y ventas netas?
- ¿Este campo viene del sistema o se carga manualmente?

## 1.3 Consecuencias

La falta de organización genera:

- pérdida de tiempo;
- análisis duplicados;
- decisiones contradictorias;
- baja confianza;
- errores de reporte;
- conflictos entre áreas;
- uso de datos obsoletos;
- riesgo de privacidad;
- dependencia de una sola persona;
- problemas de cumplimiento.

## 1.4 Catálogo como mapa

Un catálogo de datos funciona como un mapa: no reemplaza el territorio, pero ayuda a ubicarse.

No necesariamente contiene todos los datos reales. Contiene información sobre ellos:

- dónde están;
- qué significan;
- quién los gestiona;
- cómo se usan;
- qué calidad tienen;
- qué reglas aplican;
- cómo se relacionan.

---

# Módulo 2 — Qué es un catálogo de datos

## 2.1 Definición

Un catálogo de datos es un inventario organizado de activos de datos y sus metadatos. Ayuda a las personas a descubrir, entender, gestionar y usar datos de manera confiable.

IBM define un catálogo de datos como un inventario detallado de activos de datos dentro de una organización que ayuda a descubrir, comprender, gestionar, curar y acceder a datos. Alation lo describe como un repositorio centralizado que almacena metadatos sobre activos de datos y ayuda a encontrar, entender y confiar en los datos necesarios.

## 2.2 Qué puede catalogarse

Un catálogo puede incluir:

- tablas;
- columnas;
- bases de datos;
- dashboards;
- reportes;
- datasets;
- archivos CSV;
- planillas;
- métricas;
- indicadores;
- modelos;
- APIs;
- documentos;
- consultas SQL;
- pipelines;
- términos de negocio.

## 2.3 Qué información guarda

Un catálogo puede guardar:

- nombre del activo;
- descripción;
- fuente;
- ubicación;
- propietario;
- steward;
- sensibilidad;
- calidad;
- frecuencia de actualización;
- linaje;
- reglas de uso;
- definiciones;
- etiquetas;
- consultas frecuentes;
- documentación;
- usuarios relacionados.

## 2.4 Qué no es

Un catálogo de datos no es simplemente:

- una carpeta con archivos;
- una planilla de nombres;
- un repositorio de datos;
- un dashboard;
- una base SQL;
- una herramienta mágica que corrige datos automáticamente.

Es una capa de conocimiento sobre los datos.

## 2.5 Valor principal

El valor del catálogo está en reducir preguntas repetidas y aumentar confianza.

Permite que las personas sepan:

- qué dato existe;
- si es confiable;
- a quién preguntar;
- cómo interpretarlo;
- cómo usarlo sin romper reglas.

---

# Módulo 3 — Metadatos

## 3.1 Qué son metadatos

Los metadatos son datos sobre los datos.

Ejemplo:

Dato:

> 15000

Metadatos:

- campo: total_venta;
- tipo: número;
- moneda: ARS;
- origen: sistema de ventas;
- actualización: diaria;
- dueño: área comercial;
- definición: monto total facturado antes de descuentos;
- sensibilidad: baja;
- calidad: revisada semanalmente.

## 3.2 Tipos de metadatos

### Metadatos técnicos

Describen estructura y ubicación.

Ejemplos:

- nombre de tabla;
- nombre de columna;
- tipo de dato;
- sistema origen;
- esquema;
- formato;
- tamaño;
- frecuencia de carga.

### Metadatos de negocio

Explican significado y uso.

Ejemplos:

- definición de cliente activo;
- cálculo de margen;
- responsable de indicador;
- regla de interpretación;
- área usuaria.

### Metadatos operativos

Describen funcionamiento.

Ejemplos:

- fecha de actualización;
- cantidad de registros;
- errores de carga;
- usuarios frecuentes;
- nivel de uso;
- calidad observada.

## 3.3 Por qué importan

Sin metadatos, los datos son difíciles de interpretar.

Una columna llamada `status` puede significar:

- estado del cliente;
- estado del pedido;
- estado del pago;
- estado del envío;
- estado de aprobación.

El metadato evita ambigüedad.

## 3.4 Metadatos mínimos

Para empezar, documentar:

- nombre;
- descripción;
- fuente;
- responsable;
- tipo;
- frecuencia;
- sensibilidad;
- uso principal.

## 3.5 Metadatos buenos vs pobres

Pobre:

> Tabla ventas.

Bueno:

> Tabla que contiene una fila por venta confirmada en el sistema comercial. Se actualiza diariamente a las 8 hs. Es usada para reportes de facturación mensual. Responsable: área comercial.

---

# Módulo 4 — Glosario de negocio

## 4.1 Qué es un glosario

Un glosario de negocio define términos importantes para que distintas áreas usen el mismo lenguaje.

Ejemplos:

- cliente activo;
- venta neta;
- venta bruta;
- margen;
- ticket promedio;
- reclamo cerrado;
- pedido entregado;
- abandono;
- lead;
- conversión.

## 4.2 Por qué es necesario

Sin glosario, cada área puede usar definiciones distintas.

Ejemplo:

Área comercial:

> Cliente activo = compró en los últimos 90 días.

Área financiera:

> Cliente activo = tiene cuenta vigente y deuda cero.

Área marketing:

> Cliente activo = abrió una campaña en los últimos 30 días.

Si no se aclara, los reportes no coinciden.

## 4.3 Ficha de término

Un término de glosario debe incluir:

- nombre;
- definición;
- fórmula si corresponde;
- ejemplo;
- responsable;
- área;
- fuente;
- sinónimos;
- términos relacionados;
- fecha de revisión.

## 4.4 Ejemplo

Término:

> Ticket promedio

Definición:

> Monto promedio de venta por pedido confirmado en un período determinado.

Fórmula:

> ventas totales / cantidad de pedidos confirmados

Responsable:

> Área comercial.

## 4.5 Glosario vivo

Un glosario no se escribe una vez y se abandona. Debe revisarse cuando cambian procesos, sistemas, productos o reglas.

---

# Módulo 5 — Diccionario de datos

## 5.1 Qué es un diccionario de datos

Un diccionario de datos describe campos, columnas y estructuras de una tabla o dataset.

Mientras el glosario define lenguaje de negocio, el diccionario describe elementos técnicos o semitécnicos.

## 5.2 Ejemplo

Tabla:

> ventas

Diccionario:

| Campo | Descripción | Tipo | Regla |
|---|---|---|---|
| id_venta | Identificador único de venta | Texto/Número | Obligatorio |
| fecha | Fecha de venta | Fecha | Obligatoria |
| canal | Canal de venta | Categoría | Lista cerrada |
| total | Monto total | Número | Mayor a 0 |
| estado | Estado del pedido | Categoría | Lista cerrada |

## 5.3 Diferencia entre glosario y diccionario

Glosario:

> Define conceptos de negocio.

Diccionario:

> Define campos de una estructura de datos.

Ejemplo:

Glosario:

> Cliente activo.

Diccionario:

> campo `fecha_ultima_compra`.

Ambos se conectan.

## 5.4 Diccionario mínimo

Para cada campo:

- nombre;
- descripción;
- tipo;
- obligatorio;
- valores permitidos;
- ejemplo;
- sensibilidad;
- regla de calidad.

## 5.5 Uso práctico

Un diccionario ayuda a:

- cargar datos bien;
- entender planillas;
- validar información;
- crear dashboards;
- evitar errores;
- formar nuevos usuarios;
- conectar sistemas.

---

# Módulo 6 — Activos de datos

## 6.1 Qué es un activo de datos

Un activo de datos es cualquier recurso que contiene o representa datos útiles para una organización.

Ejemplos:

- tabla SQL;
- archivo CSV;
- planilla de ventas;
- dashboard Power BI;
- reporte mensual;
- formulario de inscripción;
- base de clientes;
- API;
- métrica oficial;
- consulta SQL;
- modelo de datos.

## 6.2 Activo técnico y activo de negocio

Activo técnico:

> tabla `fact_sales`.

Activo de negocio:

> reporte de ventas mensuales.

Ambos pueden estar relacionados.

## 6.3 Ficha de activo

Una ficha de activo debe incluir:

- nombre;
- tipo;
- descripción;
- ubicación;
- dueño;
- steward;
- frecuencia de actualización;
- campos principales;
- calidad;
- sensibilidad;
- usos;
- restricciones;
- contacto.

## 6.4 Ejemplo

Activo:

> Base de ventas mensuales

Tipo:

> Planilla / dataset

Descripción:

> Registro de ventas confirmadas por fecha, producto, canal y monto.

Dueño:

> Área comercial.

Frecuencia:

> Actualización diaria.

Sensibilidad:

> Media si incluye clientes identificables.

## 6.5 Catálogo mínimo sin herramienta

Aunque no exista Alation, se puede empezar con una planilla:

| Activo | Tipo | Fuente | Dueño | Descripción | Frecuencia | Sensibilidad |
|---|---|---|---|---|---|---|

---

# Módulo 7 — Roles: owner, steward y consumidor

## 7.1 Data owner

El data owner es responsable del dato desde el punto de vista de negocio.

Define:

- finalidad;
- uso autorizado;
- prioridad;
- reglas;
- calidad esperada;
- decisiones sobre cambios.

Ejemplo:

El área comercial puede ser owner de datos de ventas.

## 7.2 Data steward

El data steward cuida la calidad, documentación y uso correcto del dato.

Tareas:

- mantener definiciones;
- revisar calidad;
- coordinar correcciones;
- documentar campos;
- responder dudas;
- validar cambios;
- promover buenas prácticas.

## 7.3 Data consumer

El data consumer usa datos para análisis, reportes o decisiones.

Ejemplos:

- analista;
- gerente;
- docente;
- administrativo;
- equipo de marketing;
- emprendedor;
- auditor.

## 7.4 Data producer

El data producer genera o carga datos.

Ejemplos:

- sistema de ventas;
- formulario;
- empleado que carga pedidos;
- aplicación;
- integración automática.

## 7.5 Por qué definir roles

Sin roles claros:

- nadie corrige errores;
- nadie aprueba definiciones;
- nadie sabe a quién preguntar;
- se duplican esfuerzos;
- los datos pierden confianza.

---

# Módulo 8 — Linaje de datos

## 8.1 Qué es linaje

El linaje de datos muestra de dónde viene un dato, cómo se transforma y dónde se usa.

Ejemplo:

Formulario de ventas → planilla base → tabla limpia → dashboard mensual → informe de dirección.

## 8.2 Para qué sirve

El linaje ayuda a:

- entender origen;
- detectar errores;
- evaluar impacto de cambios;
- auditar procesos;
- explicar indicadores;
- mejorar confianza;
- resolver diferencias entre reportes.

## 8.3 Linaje simple

No hace falta empezar con diagramas complejos.

Ejemplo textual:

1. El cliente completa formulario.
2. Las respuestas llegan a Google Sheets.
3. Se validan estados.
4. Se calcula total.
5. Se alimenta dashboard.
6. Se genera informe mensual.

## 8.4 Impacto de cambios

Si una columna cambia, el linaje permite saber qué se afecta.

Ejemplo:

Si cambia definición de “venta confirmada”, pueden cambiar:

- tabla de ventas;
- dashboard comercial;
- cálculo de comisión;
- reporte mensual;
- análisis de marketing.

## 8.5 Alation y linaje

Las plataformas de catálogo pueden ayudar a visualizar relaciones, origen y uso de activos. Alation incluye funciones relacionadas con data lineage y contexto sobre activos, lo cual permite comprender cómo fluye y se usa la información dentro de una organización.

---

# Módulo 9 — Gobierno de datos y catálogo

## 9.1 Qué es gobierno de datos

El gobierno de datos es el conjunto de políticas, roles, procesos y reglas para asegurar que los datos se gestionen correctamente durante su ciclo de vida.

Incluye:

- calidad;
- seguridad;
- privacidad;
- ownership;
- definiciones;
- acceso;
- cumplimiento;
- documentación;
- uso responsable.

## 9.2 Cómo ayuda un catálogo

Un catálogo apoya gobierno porque permite:

- identificar activos;
- asignar responsables;
- documentar definiciones;
- clasificar sensibilidad;
- registrar reglas;
- mostrar linaje;
- conectar calidad;
- facilitar búsqueda;
- reducir uso indebido.

Alation señala que los catálogos de datos apoyan el gobierno al dar visibilidad sobre linaje, calidad y cumplimiento, y al ayudar a definir y aplicar políticas de uso de datos.

## 9.3 Políticas

Ejemplos de políticas:

- datos de clientes no se comparten fuera del equipo autorizado;
- reportes oficiales usan dataset certificado;
- todo indicador crítico debe tener definición y owner;
- datos sensibles deben clasificarse;
- cambios en campos críticos deben documentarse.

## 9.4 Datos sensibles

El catálogo puede marcar:

- datos personales;
- datos financieros;
- salud;
- menores;
- ubicación;
- credenciales;
- información confidencial;
- datos comerciales estratégicos.

## 9.5 Confianza

El objetivo de gobierno no es burocracia. Es aumentar confianza y reducir riesgos.

---

# Módulo 10 — Alation como plataforma de catálogo

## 10.1 Qué es Alation

Alation es una plataforma de catálogo de datos y data intelligence orientada a ayudar a las organizaciones a descubrir, entender, gobernar y colaborar alrededor de sus activos de datos.

Sus funciones se asocian con:

- búsqueda y descubrimiento;
- glosario;
- documentación;
- linaje;
- gobierno;
- stewardship;
- colaboración;
- contexto de uso;
- confianza en datos;
- data products.

## 10.2 Búsqueda y descubrimiento

Una función central es poder buscar activos de datos.

Ejemplos:

- buscar “ventas”;
- encontrar tablas relacionadas;
- encontrar dashboards;
- filtrar por fuente;
- identificar owners;
- revisar documentación;
- ver términos relacionados.

Alation destaca capacidades de búsqueda y filtrado para encontrar activos como tablas, artículos de conocimiento o consultas en el catálogo.

## 10.3 Colaboración

Un catálogo moderno no es solo inventario. Permite que usuarios hagan preguntas, documenten conocimiento, recomienden activos, agreguen descripciones y compartan contexto.

Esto evita que el conocimiento quede en conversaciones privadas o en la memoria de una sola persona.

## 10.4 Gobierno activo

Alation se vincula con gobierno porque permite documentar políticas, asignar responsables, clasificar información y promover uso correcto de activos.

## 10.5 Limitación importante

Alation no reemplaza la cultura de datos. Si nadie documenta, valida, gobierna o usa el catálogo, la herramienta pierde valor.

---

# Módulo 11 — Búsqueda y descubrimiento de datos

## 11.1 Problema

Un analista necesita responder:

> ¿Cuál es el dataset correcto para ventas mensuales?

Sin catálogo, puede encontrar varias planillas o tablas con nombres parecidos.

## 11.2 Criterios para elegir activo

Revisar:

- descripción;
- owner;
- actualización;
- calidad;
- certificación;
- uso reciente;
- linaje;
- comentarios;
- términos asociados;
- sensibilidad;
- restricciones.

## 11.3 Activo certificado

Un activo certificado o aprobado indica que es recomendado para cierto uso.

Ejemplo:

> Dataset oficial de ventas confirmadas para reportes mensuales.

No significa que sea perfecto, sino que tiene revisión y respaldo.

## 11.4 Preguntas antes de usar

- ¿Qué contiene?
- ¿Qué no contiene?
- ¿Cuándo se actualiza?
- ¿Quién lo mantiene?
- ¿Para qué se usa?
- ¿Tiene datos sensibles?
- ¿Qué calidad tiene?
- ¿Hay definición de campos?
- ¿Existe versión más nueva?

## 11.5 Resultado esperado

El usuario debe poder encontrar el dato correcto sin depender de preguntar siempre a la misma persona.

---

# Módulo 12 — Documentación de activos

## 12.1 Por qué documentar activos

Una tabla sin documentación puede ser inútil aunque tenga buenos datos.

Documentar permite:

- entender;
- reutilizar;
- confiar;
- auditar;
- capacitar;
- evitar errores;
- acelerar análisis.

## 12.2 Descripción útil

Mala descripción:

> Datos de clientes.

Buena descripción:

> Dataset con una fila por cliente registrado en el sistema comercial. Incluye datos de contacto, fecha de alta, estado, canal de origen y segmento. Se actualiza diariamente a las 7 hs.

## 12.3 Campos clave

Para cada activo documentar:

- propósito;
- granularidad;
- fuente;
- frecuencia;
- owner;
- campos principales;
- limitaciones;
- uso recomendado;
- restricciones.

## 12.4 Granularidad

La granularidad define qué representa cada fila.

Ejemplos:

- una fila por venta;
- una fila por cliente;
- una fila por producto;
- una fila por pedido;
- una fila por día;
- una fila por respuesta.

Sin granularidad clara, los cálculos pueden duplicarse.

## 12.5 Limitaciones

Toda documentación seria incluye limitaciones.

Ejemplo:

> No incluye ventas canceladas. Los datos anteriores a enero 2025 pueden tener categorías incompletas.

---

# Módulo 13 — Data stewardship práctico

## 13.1 Qué hace un steward

Un data steward ayuda a que los datos sean comprensibles, confiables y gobernados.

Tareas:

- revisar definiciones;
- mantener glosario;
- documentar activos;
- coordinar owners;
- detectar problemas;
- proponer reglas;
- validar calidad;
- responder consultas;
- promover uso correcto.

## 13.2 Stewardship no es solo técnico

Requiere:

- comunicación;
- conocimiento de negocio;
- orden;
- criterio;
- seguimiento;
- documentación;
- capacidad de negociar definiciones.

## 13.3 Rutina de steward

Semanal:

- revisar activos críticos;
- responder preguntas;
- validar cambios;
- revisar calidad;
- actualizar glosario;
- documentar nuevos datasets;
- marcar activos obsoletos.

## 13.4 Preguntas típicas

- ¿Esta métrica tiene definición?
- ¿Quién es owner?
- ¿El dashboard sigue vigente?
- ¿Este campo contiene datos sensibles?
- ¿Este dataset está certificado?
- ¿Hay duplicados?
- ¿Qué reporte usa este campo?

## 13.5 Valor

El steward evita que el catálogo se convierta en un cementerio de información desactualizada.

---

# Módulo 14 — Mini catálogo sin plataforma

## 14.1 Por qué empezar simple

Una organización pequeña puede no tener Alation. Aun así puede practicar catalogación.

Herramientas posibles:

- Google Sheets;
- Excel;
- Notion;
- SharePoint;
- Google Drive;
- wiki interna;
- documento compartido.

## 14.2 Estructura mínima

Planilla:

| Activo | Tipo | Descripción | Fuente | Owner | Steward | Frecuencia | Sensibilidad | Estado |
|---|---|---|---|---|---|---|---|---|

## 14.3 Glosario mínimo

| Término | Definición | Fórmula | Owner | Estado |
|---|---|---|---|---|

## 14.4 Diccionario mínimo

| Activo | Campo | Descripción | Tipo | Obligatorio | Valores permitidos |
|---|---|---|---|---|---|

## 14.5 Estado de activo

Estados:

- Borrador;
- En revisión;
- Certificado;
- Obsoleto;
- Archivado.

Esto ayuda a saber qué usar.

---

# Módulo 15 — Proyecto final: catálogo inicial

## 15.1 Elegir caso

Opciones:

- emprendimiento;
- escuela;
- consultora;
- comercio;
- curso online;
- soporte técnico;
- ventas;
- inventario;
- atención al cliente.

## 15.2 Identificar activos

Listar al menos 8 activos:

- planilla de ventas;
- formulario de clientes;
- dashboard mensual;
- base de productos;
- registro de gastos;
- encuesta de satisfacción;
- reporte de reclamos;
- tabla de stock.

## 15.3 Documentar

Para cada activo:

- nombre;
- tipo;
- descripción;
- owner;
- fuente;
- frecuencia;
- sensibilidad;
- uso recomendado.

## 15.4 Crear glosario

Al menos 10 términos:

- venta neta;
- cliente activo;
- ticket promedio;
- reclamo cerrado;
- producto disponible;
- margen;
- stock crítico;
- conversión;
- pedido pendiente;
- canal de venta.

## 15.5 Crear diccionario

Elegir un activo y documentar sus campos.

## 15.6 Mapa de linaje

Crear un linaje simple:

Fuente → transformación → reporte → decisión.

## 15.7 Recomendaciones

Proponer:

- activos a certificar;
- datos sensibles a clasificar;
- owners faltantes;
- definiciones prioritarias;
- mejoras de calidad.

---

# Caso práctico integrador

## Caso: catálogo de datos para un emprendimiento comercial

Un emprendimiento vende por WhatsApp, Instagram y tienda online. Tiene muchas planillas: ventas, clientes, productos, stock, reclamos y gastos. Nadie sabe cuál es la versión oficial.

### Paso 1 — Inventario

Se listan activos:

- Ventas 2026;
- Clientes;
- Productos;
- Stock;
- Reclamos;
- Gastos;
- Dashboard mensual;
- Formulario de pedidos.

### Paso 2 — Owners

Se define:

- ventas: dueño comercial;
- stock: responsable operativo;
- gastos: administración;
- reclamos: atención al cliente.

### Paso 3 — Glosario

Se definen:

- venta confirmada;
- pedido pendiente;
- cliente recurrente;
- stock crítico;
- reclamo cerrado.

### Paso 4 — Diccionario

Se documenta la planilla de ventas:

- fecha;
- cliente;
- producto;
- cantidad;
- total;
- canal;
- estado.

### Paso 5 — Sensibilidad

Clientes contiene datos personales. Se marca sensibilidad media.

### Paso 6 — Linaje

Formulario de pedidos → planilla de ventas → dashboard mensual → decisión de compras.

### Paso 7 — Resultado

El equipo sabe qué archivo usar, qué significa cada indicador y a quién consultar.

---

# Actividades del curso

## Actividad 1 — Inventario de activos

Listar 10 activos de datos de un caso propio o ficticio.

Clasificar:

- planilla;
- dashboard;
- formulario;
- reporte;
- base;
- documento;
- API.

## Actividad 2 — Ficha de activo

Crear ficha completa para 3 activos.

## Actividad 3 — Glosario

Definir 10 términos de negocio con definición, owner y ejemplo.

## Actividad 4 — Diccionario

Elegir una tabla y documentar 8 campos.

## Actividad 5 — Roles

Asignar:

- owner;
- steward;
- consumidor;
- productor.

## Actividad 6 — Linaje simple

Dibujar o describir el flujo de un dato desde su origen hasta un reporte.

## Actividad 7 — Clasificación de sensibilidad

Marcar activos como:

- pública;
- interna;
- confidencial;
- sensible.

## Actividad 8 — Mini catálogo

Crear una planilla o documento con el catálogo inicial.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué problema resuelve un catálogo de datos?
2. ¿Qué es un metadato?
3. ¿Qué diferencia hay entre glosario y diccionario de datos?
4. ¿Qué es un activo de datos?
5. ¿Qué hace un data owner?
6. ¿Qué hace un data steward?
7. ¿Qué es linaje de datos?
8. ¿Cómo ayuda un catálogo al gobierno de datos?
9. ¿Qué significa activo certificado?
10. ¿Por qué debe documentarse la granularidad?
11. ¿Qué funciones cumple una plataforma como Alation?
12. ¿Por qué un catálogo puede fallar aunque la herramienta sea buena?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Mini Catálogo de Datos Inicial**.

Debe incluir:

1. inventario de activos;
2. fichas de activos;
3. owners y stewards;
4. glosario de negocio;
5. diccionario de datos;
6. clasificación de sensibilidad;
7. linaje simple;
8. estado de activos;
9. recomendaciones de gobierno;
10. plan de mantenimiento.

---

# Glosario básico

Catálogo de datos: inventario organizado de activos de datos y metadatos.

Activo de datos: recurso que contiene o representa datos útiles.

Metadato: información que describe un dato o activo.

Glosario de negocio: conjunto de definiciones compartidas de términos de negocio.

Diccionario de datos: descripción de campos, columnas y estructuras.

Data owner: responsable de negocio de un dato o activo.

Data steward: persona que cuida documentación, calidad y uso correcto de datos.

Data consumer: persona o sistema que usa datos.

Data producer: persona o sistema que genera datos.

Linaje de datos: recorrido de un dato desde su origen hasta sus usos.

Gobierno de datos: conjunto de políticas, roles y procesos para gestionar datos.

Sensibilidad: nivel de cuidado requerido por un dato.

Activo certificado: activo revisado y recomendado para uso oficial.

Granularidad: unidad que representa cada fila o registro.

Alation: plataforma de catálogo de datos y data intelligence.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Mini Catálogo de Datos Inicial**.

Ese catálogo debe permitir:

- saber qué datos existen;
- encontrar fuentes confiables;
- entender significados;
- identificar responsables;
- reconocer sensibilidad;
- documentar campos;
- conectar datos con glosario;
- describir linaje;
- mejorar gobierno;
- aumentar confianza en el análisis.

El curso termina cuando la persona deja de buscar datos “preguntando por ahí” y empieza a construir conocimiento documentado y reutilizable sobre los datos.

---

# Fuentes recomendadas para profundizar

- Alation — What is a Data Catalog.
- Alation Glossary — Data Catalog, Data Governance, Data Lineage, Data Products.
- IBM — What is a Data Catalog.
- IBM — Governance and Catalog / Knowledge Catalog.
- DAMA-DMBOK — Data Governance and Metadata Management.
- Data Management Association — buenas prácticas de gestión de datos.
- DataHub — Data Catalog concepts.
- Materiales sobre metadatos, linaje, glosarios, stewardship y gobierno de datos.

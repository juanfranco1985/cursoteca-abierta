# Curso 25 — Calidad de Datos para Principiantes

## Presentación del curso

La calidad de datos es una de las bases más importantes para tomar buenas decisiones. Una planilla puede tener muchas filas, gráficos prolijos y fórmulas correctas, pero si los datos están incompletos, duplicados, desactualizados, mal escritos o cargados con criterios distintos, el análisis puede llevar a conclusiones equivocadas.

En negocios, educación, administración, salud, ventas, atención al cliente, inventario o proyectos comunitarios, los datos de mala calidad generan problemas concretos: reclamos, pérdidas de tiempo, decisiones erróneas, reportes contradictorios, clientes duplicados, stock mal calculado, pagos no registrados, errores de comunicación y falta de confianza.

Este curso está pensado para principiantes que trabajan con planillas, formularios, registros, bases simples o reportes. No requiere programación. Su objetivo es enseñar a mirar los datos con criterio de calidad: detectar errores, prevenirlos, documentar cambios, limpiar información y establecer reglas simples para que los datos sean más confiables.

La idea central es:

> Un dato no es útil solo por estar guardado. Es útil cuando es correcto, completo, consistente, actual y comprensible.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué significa calidad de datos.
2. Identificar errores comunes en planillas y registros.
3. Diferenciar completitud, exactitud, consistencia, validez, unicidad y actualidad.
4. Detectar datos faltantes, duplicados, formatos incorrectos y valores sospechosos.
5. Aplicar reglas simples de validación.
6. Normalizar categorías, fechas, nombres y estados.
7. Documentar cambios realizados sobre una base.
8. Crear checklists de revisión de datos.
9. Prevenir errores desde formularios y procesos de carga.
10. Elaborar un informe básico de calidad de datos.

---

# Módulo 1 — Qué es calidad de datos

## 1.1 Definición

La calidad de datos es el grado en que los datos son adecuados para cumplir un propósito. No existe calidad en abstracto: un dato es bueno si sirve para la tarea que se necesita realizar.

Un registro de ventas, por ejemplo, debe permitir responder:

- cuánto se vendió;
- cuándo se vendió;
- qué producto se vendió;
- a quién;
- por qué canal;
- en qué estado está;
- si fue pagado;
- si fue entregado.

Si faltan campos o están mal cargados, la calidad es baja para ese propósito.

## 1.2 Por qué importa

Los datos de mala calidad pueden causar:

- decisiones equivocadas;
- pérdida de dinero;
- reclamos;
- reportes contradictorios;
- duplicación de trabajo;
- pérdida de confianza;
- errores de stock;
- pagos mal imputados;
- clientes mal contactados;
- métricas falsas;
- problemas legales o administrativos.

## 1.3 Calidad y confianza

Cuando las personas no confían en los datos, dejan de usarlos o crean sus propias planillas paralelas. Eso genera más desorden.

Frases típicas:

- “Esa planilla no está actualizada.”
- “No sé si esos números están bien.”
- “Cada área tiene un dato distinto.”
- “Mejor lo calculo yo de nuevo.”
- “No sabemos cuál es la versión final.”

La calidad de datos también es una cuestión de confianza organizacional.

## 1.4 Calidad no es perfección absoluta

Buscar calidad no significa esperar datos perfectos. Significa conocer errores, reducirlos, documentarlos y evitar que afecten decisiones importantes.

Un conjunto de datos puede tener limitaciones y aun así ser útil si esas limitaciones se explican.

---

# Módulo 2 — Dimensiones de calidad

## 2.1 Completitud

La completitud pregunta:

> ¿Están todos los datos necesarios?

Ejemplos de baja completitud:

- ventas sin fecha;
- clientes sin teléfono;
- pedidos sin estado;
- productos sin categoría;
- encuestas sin respuesta clave;
- facturas sin monto.

## 2.2 Exactitud

La exactitud pregunta:

> ¿El dato representa correctamente la realidad?

Ejemplos de baja exactitud:

- precio cargado mal;
- fecha equivocada;
- cliente incorrecto;
- cantidad duplicada;
- dirección mal escrita;
- producto asignado a categoría incorrecta.

## 2.3 Consistencia

La consistencia pregunta:

> ¿Los datos se registran siempre con el mismo criterio?

Ejemplo:

- “Instagram”
- “instagram”
- “IG”
- “Insta”

Para una persona puede ser lo mismo; para una planilla, son valores distintos.

## 2.4 Validez

La validez pregunta:

> ¿El dato cumple el formato o regla esperada?

Ejemplos:

- fecha válida;
- correo con formato correcto;
- monto mayor o igual a cero;
- estado dentro de una lista permitida;
- porcentaje entre 0% y 100%;
- teléfono con cantidad razonable de dígitos.

## 2.5 Unicidad

La unicidad pregunta:

> ¿Cada registro aparece una sola vez cuando debería ser único?

Ejemplos:

- cliente duplicado;
- pedido cargado dos veces;
- factura repetida;
- producto duplicado con nombres parecidos;
- contacto repetido con dos correos.

## 2.6 Actualidad

La actualidad pregunta:

> ¿Los datos están al día?

Ejemplos:

- precios viejos;
- stock no actualizado;
- teléfonos antiguos;
- estado de pedido atrasado;
- domicilio incorrecto;
- lista de alumnos del año anterior.

---

# Módulo 3 — Errores comunes en planillas

## 3.1 Filas vacías dentro de tablas

Las filas vacías rompen filtros, tablas dinámicas y lecturas automáticas.

Solución:

- eliminar filas vacías;
- separar notas fuera de la base;
- mantener la tabla continua.

## 3.2 Celdas combinadas

Las celdas combinadas pueden servir para diseño, pero suelen ser malas para bases de datos.

Problemas:

- dificultan ordenar;
- rompen filtros;
- complican fórmulas;
- impiden análisis automático.

Regla:

> No usar celdas combinadas dentro de tablas de datos.

## 3.3 Totales mezclados con registros

Un error frecuente es insertar filas de subtotal dentro de la tabla.

Ejemplo:

| Fecha | Producto | Total |
|---|---|---:|
| 01/06 | Remera | 10000 |
| 02/06 | Gorra | 5000 |
| Total |  | 15000 |

Ese “Total” no es un registro de venta. Debe ir en una hoja resumen o fuera de la tabla base.

## 3.4 Datos múltiples en una celda

Ejemplo incorrecto:

> Ana López - Santa Fe - 342555000

Mejor:

| Nombre | Ciudad | Teléfono |
|---|---|---|
| Ana López | Santa Fe | 342555000 |

Separar datos mejora filtros, búsquedas y análisis.

## 3.5 Formatos mezclados

Ejemplos:

- fechas como texto;
- montos con símbolos escritos manualmente;
- números con puntos y comas mezclados;
- teléfonos con espacios irregulares;
- categorías escritas de muchas formas.

---

# Módulo 4 — Datos faltantes

## 4.1 Qué es un dato faltante

Un dato faltante es un campo vacío o incompleto donde se esperaba información.

Ejemplos:

- cliente sin correo;
- producto sin precio;
- venta sin fecha;
- reclamo sin tipo;
- pedido sin estado;
- encuesta sin respuesta.

## 4.2 No todos los faltantes son iguales

Puede faltar porque:

- no se pidió;
- el usuario no respondió;
- no era obligatorio;
- se olvidó cargar;
- no aplica;
- se perdió en una importación;
- hubo error de sistema;
- no se sabe.

## 4.3 Diferenciar vacío de “no aplica”

No es lo mismo:

- dato desconocido;
- dato no aplicable;
- dato pendiente;
- dato omitido.

Conviene usar valores controlados:

- Pendiente;
- No aplica;
- No informado;
- En revisión.

Pero hay que usarlos con criterio.

## 4.4 Medir completitud

Ejemplo:

Si hay 100 pedidos y 20 no tienen estado, la completitud del campo estado es 80%.

Fórmula conceptual:

> registros completos / registros totales * 100

## 4.5 Qué hacer con faltantes

Opciones:

- completar consultando fuente;
- marcar como pendiente;
- excluir del análisis;
- estimar, solo si corresponde y se aclara;
- corregir proceso de carga;
- hacer obligatorio el campo en formulario.

---

# Módulo 5 — Duplicados

## 5.1 Qué es un duplicado

Un duplicado ocurre cuando un mismo registro aparece más de una vez.

Ejemplos:

- misma venta cargada dos veces;
- cliente repetido con distinto nombre;
- producto duplicado;
- misma factura en dos filas;
- inscripción repetida.

## 5.2 Duplicado exacto y duplicado probable

Duplicado exacto:

- todos los campos son iguales.

Duplicado probable:

- Ana López;
- Ana L.;
- Lopez Ana;
- ana.lopez@gmail.com;
- mismo teléfono.

Los duplicados probables requieren revisión humana.

## 5.3 Riesgos

Los duplicados pueden causar:

- ventas infladas;
- conteos incorrectos;
- clientes contactados dos veces;
- stock mal calculado;
- pagos duplicados;
- estadísticas falsas.

## 5.4 Detección

Métodos simples:

- ordenar por nombre;
- filtrar por teléfono;
- buscar correos repetidos;
- usar formato condicional;
- contar valores;
- crear identificador único;
- revisar combinaciones de campos.

## 5.5 Prevención

Para prevenir:

- usar IDs;
- validar correos;
- controlar teléfonos;
- evitar carga doble;
- revisar antes de importar;
- definir reglas de alta;
- usar formularios con campos obligatorios.

---

# Módulo 6 — Consistencia de categorías

## 6.1 Qué son categorías

Las categorías agrupan registros.

Ejemplos:

- canal de venta;
- tipo de reclamo;
- estado de pedido;
- categoría de gasto;
- rubro;
- zona;
- curso;
- prioridad.

## 6.2 Problema de categorías libres

Si cada persona escribe como quiere, el análisis se rompe.

Ejemplo:

- WhatsApp;
- Wsp;
- Whatsapp;
- WA;
- wpp.

Para un reporte, aparecerán como canales diferentes.

## 6.3 Diccionario de categorías

Crear una lista oficial.

Ejemplo para estado de pedido:

- Nuevo;
- Pendiente de pago;
- Pagado;
- En preparación;
- Enviado;
- Entregado;
- Cancelado.

## 6.4 Listas desplegables

Usar validación de datos permite seleccionar categorías predefinidas y evitar errores.

Ventajas:

- menos tipeo;
- menos variantes;
- filtros confiables;
- reportes consistentes;
- carga más rápida.

## 6.5 Cambios en categorías

Si se modifica una categoría, documentar:

- categoría anterior;
- categoría nueva;
- fecha;
- motivo;
- responsable.

---

# Módulo 7 — Formatos de fecha, número y texto

## 7.1 Fechas

Las fechas deben permitir ordenar, filtrar y agrupar.

Formato recomendado:

- dd/mm/aaaa;
- o formato ISO: aaaa-mm-dd, especialmente en sistemas.

Evitar:

- “hoy”;
- “ayer”;
- “junio” sin año;
- “5/6” sin claridad;
- texto libre.

## 7.2 Números

Los números deben permitir cálculos.

Evitar:

- `$ 10.000 aprox`
- `diez mil`
- `10000 pesos`
- `10 mil`
- `10.000?`

Mejor:

- valor numérico en una columna;
- moneda en otra si hace falta;
- observación separada.

## 7.3 Porcentajes

Un porcentaje debe estar claro.

Ejemplo:

- 15%;
- 0,15 con formato porcentaje.

Evitar mezclar:

- “15 porciento”;
- “quince”;
- “15 aprox”.

## 7.4 Texto

Normalizar:

- mayúsculas/minúsculas;
- espacios;
- acentos;
- nombres;
- abreviaturas;
- códigos.

## 7.5 Teléfonos y documentos

Teléfonos y documentos muchas veces conviene tratarlos como texto, no como número, para no perder ceros iniciales ni símbolos relevantes.

---

# Módulo 8 — Valores sospechosos y outliers

## 8.1 Qué es un valor sospechoso

Un valor sospechoso es un dato que parece posible error o caso especial.

Ejemplos:

- venta de $0;
- venta de $999.999 cuando el promedio es $10.000;
- edad 250;
- cantidad negativa;
- fecha futura imposible;
- descuento de 150%;
- pedido entregado antes de ser creado.

## 8.2 Outlier

Un outlier es un valor atípico. No siempre es error.

Ejemplo:

Una venta muy grande puede ser real si fue una compra mayorista.

## 8.3 Qué hacer

No borrar automáticamente.

Pasos:

1. identificar;
2. verificar fuente;
3. consultar responsable;
4. corregir si es error;
5. marcar si es caso especial;
6. documentar decisión.

## 8.4 Herramientas simples

- ordenar de mayor a menor;
- usar filtros;
- calcular mínimo y máximo;
- usar promedio;
- comparar contra rango esperado;
- aplicar formato condicional.

## 8.5 Reglas de negocio

Definir reglas ayuda.

Ejemplos:

- cantidad no puede ser menor a 1;
- descuento máximo 50%;
- fecha de entrega no puede ser anterior a fecha de pedido;
- estado debe estar dentro de lista;
- precio debe ser mayor a 0.

---

# Módulo 9 — Validación de datos

## 9.1 Qué es validar

Validar significa comprobar que un dato cumple una regla esperada.

Ejemplos:

- campo obligatorio;
- formato de correo;
- lista de estados;
- número positivo;
- fecha dentro de rango;
- categoría permitida.

## 9.2 Validación preventiva

La mejor calidad se logra antes de que el error entre.

Ejemplos:

- formularios con campos obligatorios;
- listas desplegables;
- límites de valores;
- instrucciones claras;
- ejemplos de carga;
- controles de duplicados;
- revisión previa.

## 9.3 Validación correctiva

Se aplica después de cargar.

Ejemplos:

- filtrar vacíos;
- buscar duplicados;
- revisar formatos;
- detectar valores raros;
- comparar totales;
- cruzar con otra fuente.

## 9.4 Reglas simples en planillas

Ejemplos:

- Estado debe ser uno de la lista.
- Fecha no debe estar vacía.
- Monto debe ser mayor a cero.
- Canal debe estar informado.
- Producto debe existir en catálogo.
- Correo debe contener `@`.

## 9.5 Checklist de validación

Antes de analizar:

- ¿hay encabezados?
- ¿hay filas vacías?
- ¿hay duplicados?
- ¿faltan campos clave?
- ¿las fechas son válidas?
- ¿los números calculan?
- ¿las categorías son consistentes?
- ¿hay valores extremos?
- ¿se entiende la fuente?

---

# Módulo 10 — Limpieza de datos

## 10.1 Qué es limpiar datos

Limpiar datos es corregir, ordenar o transformar una base para que pueda usarse mejor.

Incluye:

- eliminar duplicados;
- corregir formatos;
- completar campos;
- normalizar categorías;
- separar columnas;
- unificar nombres;
- revisar fechas;
- corregir errores evidentes.

## 10.2 Limpieza no es manipulación

Limpiar no significa cambiar datos para que digan lo que queremos. Significa mejorar su confiabilidad.

Manipulación indebida:

- borrar casos que no convienen;
- cambiar números sin fuente;
- ocultar errores;
- eliminar reclamos;
- ajustar resultados para quedar bien.

## 10.3 Copia de trabajo

Siempre:

1. conservar archivo original;
2. trabajar sobre copia;
3. registrar cambios;
4. guardar versión limpia;
5. documentar reglas usadas.

## 10.4 Proceso básico

1. Revisar estructura.
2. Revisar campos obligatorios.
3. Revisar duplicados.
4. Normalizar categorías.
5. Corregir formatos.
6. Revisar valores extremos.
7. Crear resumen de calidad.
8. Documentar.

## 10.5 Resultado esperado

Al final debe existir:

- base original;
- base limpia;
- registro de limpieza;
- lista de problemas encontrados;
- limitaciones pendientes.

---

# Módulo 11 — Documentación y trazabilidad

## 11.1 Por qué documentar

Si se limpia una base sin documentar, nadie sabe qué cambió.

Documentar permite:

- explicar decisiones;
- repetir proceso;
- auditar cambios;
- evitar discusiones;
- mejorar confianza;
- capacitar a otros.

## 11.2 Registro de cambios

Crear una hoja llamada:

> Registro de limpieza

Columnas:

- fecha;
- campo;
- problema encontrado;
- acción realizada;
- cantidad de registros afectados;
- responsable;
- observación.

## 11.3 Diccionario de datos

Un diccionario de datos explica qué significa cada columna.

Ejemplo:

| Campo | Descripción | Tipo | Regla |
|---|---|---|---|
| fecha_pedido | Fecha en que ingresó el pedido | Fecha | Obligatoria |
| estado | Estado operativo del pedido | Categoría | Lista cerrada |
| total | Monto total del pedido | Número | Mayor a 0 |

## 11.4 Versión de archivos

Nombres recomendados:

- `ventas_original_2026_06.xlsx`
- `ventas_limpieza_v1_2026_06.xlsx`
- `ventas_base_limpia_2026_06.xlsx`
- `informe_calidad_ventas_2026_06.pdf`

## 11.5 Trazabilidad

La trazabilidad permite responder:

- de dónde salió el dato;
- quién lo modificó;
- cuándo;
- por qué;
- con qué regla;
- dónde está la versión original.

---

# Módulo 12 — Prevención desde formularios

## 12.1 Formularios bien diseñados

Un formulario bien hecho mejora la calidad desde el inicio.

Debe tener:

- preguntas claras;
- campos obligatorios donde corresponda;
- listas desplegables;
- instrucciones;
- validación;
- opciones cerradas;
- orden lógico;
- mensaje final.

## 12.2 Evitar preguntas ambiguas

Malo:

> Datos de contacto.

Mejor:

> Escribí tu correo electrónico principal.

Malo:

> Producto.

Mejor:

> Seleccioná el producto solicitado.

## 12.3 Campos obligatorios

No todo debe ser obligatorio. Solo lo necesario.

Obligatorio:

- nombre;
- contacto;
- fecha;
- producto;
- cantidad;
- motivo de solicitud.

Opcional:

- comentario adicional;
- preferencia;
- observación.

## 12.4 Opciones cerradas

Usar opciones cerradas cuando se necesita analizar.

Ejemplo:

Canal de contacto:

- WhatsApp;
- Instagram;
- Facebook;
- Local;
- Web;
- Referido.

## 12.5 Mensaje de confirmación

El formulario debe indicar qué pasará después.

Ejemplo:

> Recibimos tu solicitud. Revisaremos los datos y te responderemos dentro de las próximas 24 horas hábiles.

---

# Módulo 13 — Informe de calidad de datos

## 13.1 Qué es un informe de calidad

Es un documento breve que resume el estado de una base de datos.

Debe explicar:

- fuente;
- cantidad de registros;
- período;
- problemas encontrados;
- impacto;
- acciones realizadas;
- problemas pendientes;
- recomendaciones.

## 13.2 Indicadores de calidad

Ejemplos:

- porcentaje de campos completos;
- cantidad de duplicados;
- cantidad de valores inválidos;
- cantidad de categorías inconsistentes;
- cantidad de registros corregidos;
- registros pendientes de revisión.

## 13.3 Estructura

1. Título.
2. Fuente analizada.
3. Período.
4. Cantidad de registros.
5. Campos revisados.
6. Problemas detectados.
7. Acciones de limpieza.
8. Limitaciones.
9. Recomendaciones.
10. Próxima revisión.

## 13.4 Lenguaje claro

Evitar:

> La base presenta anomalías en dimensiones de completitud.

Mejor:

> El 18% de los pedidos no tiene estado cargado, lo que impide saber si fueron entregados o siguen pendientes.

## 13.5 Recomendaciones útiles

Ejemplo:

- agregar lista desplegable para estado;
- hacer obligatorio el campo fecha;
- usar catálogo único de productos;
- revisar duplicados semanalmente;
- crear diccionario de datos;
- capacitar a quien carga información.

---

# Módulo 14 — Cultura de calidad de datos

## 14.1 La calidad no depende solo de una persona

Los datos suelen pasar por varias manos:

- quien carga;
- quien revisa;
- quien analiza;
- quien decide;
- quien actualiza;
- quien comunica.

Si cada persona usa criterios distintos, la calidad cae.

## 14.2 Reglas compartidas

Un equipo debe acordar:

- qué campos son obligatorios;
- cómo se escriben categorías;
- quién puede editar;
- cuándo se actualiza;
- cómo se corrigen errores;
- dónde está la versión oficial;
- quién valida.

## 14.3 Responsable de datos

Aunque sea un equipo pequeño, conviene definir quién cuida la base.

Responsabilidades:

- revisar estructura;
- controlar duplicados;
- mantener listas;
- documentar cambios;
- aprobar modificaciones;
- crear reportes de calidad.

## 14.4 Calidad continua

La calidad no se revisa una sola vez. Debe ser rutina:

- diaria en procesos críticos;
- semanal en ventas o atención;
- mensual en reportes;
- antes de cualquier análisis importante.

## 14.5 Principio final

> Es más barato prevenir un dato malo que corregir cientos de errores después.

---

# Caso práctico integrador

## Caso: base de pedidos desordenada

Un emprendimiento tiene una planilla de pedidos con 300 filas. Hay pedidos sin fecha, estados escritos de muchas formas, clientes duplicados, montos como texto y productos con nombres diferentes.

### Paso 1 — Copia de seguridad

Se guarda:

- `pedidos_original_junio.xlsx`
- `pedidos_limpieza_v1.xlsx`

### Paso 2 — Revisión inicial

Problemas encontrados:

- 25 pedidos sin estado;
- 14 clientes duplicados;
- 5 fechas inválidas;
- 8 montos escritos como texto;
- 12 variantes de canal WhatsApp.

### Paso 3 — Normalización

Canal:

- Wsp;
- WhatsApp;
- wpp;

se unifica como:

> WhatsApp

### Paso 4 — Duplicados

Se revisan duplicados por:

- teléfono;
- nombre;
- fecha;
- producto;
- monto.

No se borran automáticamente los casos dudosos.

### Paso 5 — Validación

Se crea lista desplegable para estado:

- Nuevo;
- Pendiente de pago;
- Pagado;
- En preparación;
- Entregado;
- Cancelado.

### Paso 6 — Documentación

Se registra cada cambio en una hoja de limpieza.

### Paso 7 — Informe

Se entrega resumen:

- calidad inicial;
- correcciones;
- problemas pendientes;
- recomendaciones.

---

# Actividades del curso

## Actividad 1 — Diagnóstico de calidad

Tomar una planilla propia o ficticia y revisar:

- encabezados;
- filas vacías;
- duplicados;
- datos faltantes;
- categorías inconsistentes;
- fechas;
- números;
- valores sospechosos.

## Actividad 2 — Diccionario de datos

Crear un diccionario con al menos 8 campos:

- nombre del campo;
- descripción;
- tipo;
- obligatorio;
- regla;
- ejemplo válido.

## Actividad 3 — Duplicados

Crear una tabla con duplicados exactos y probables. Marcar cuáles se eliminan y cuáles requieren revisión.

## Actividad 4 — Normalización de categorías

Unificar categorías mal escritas en una lista oficial.

## Actividad 5 — Validación

Diseñar reglas para:

- estado;
- fecha;
- monto;
- correo;
- producto;
- canal.

## Actividad 6 — Registro de limpieza

Crear una hoja con cambios realizados.

## Actividad 7 — Informe final

Redactar un informe de calidad de datos con problemas, acciones y recomendaciones.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es calidad de datos?
2. ¿Por qué calidad no significa perfección absoluta?
3. ¿Qué es completitud?
4. ¿Qué diferencia hay entre exactitud y consistencia?
5. ¿Qué es validez?
6. ¿Por qué los duplicados son peligrosos?
7. ¿Qué problema generan categorías escritas de muchas formas?
8. ¿Por qué no hay que borrar outliers automáticamente?
9. ¿Para qué sirve un diccionario de datos?
10. ¿Qué debe documentarse durante la limpieza?
11. ¿Cómo ayudan los formularios a prevenir errores?
12. ¿Qué debe incluir un informe de calidad?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Informe Básico de Calidad de Datos**.

Debe incluir:

1. base analizada;
2. propósito de uso;
3. cantidad de registros;
4. campos revisados;
5. problemas de completitud;
6. duplicados;
7. inconsistencias;
8. valores inválidos;
9. valores sospechosos;
10. acciones de limpieza;
11. diccionario de datos;
12. recomendaciones preventivas.

---

# Glosario básico

Calidad de datos: grado en que los datos son adecuados para un propósito.

Completitud: presencia de los datos necesarios.

Exactitud: correspondencia entre dato y realidad.

Consistencia: uniformidad en la forma de registrar datos.

Validez: cumplimiento de reglas o formatos esperados.

Unicidad: ausencia de duplicados indebidos.

Actualidad: grado en que los datos están actualizados.

Duplicado: registro repetido exacto o probable.

Outlier: valor atípico que puede ser error o caso especial.

Normalización: unificación de formatos, nombres o categorías.

Validación: comprobación de que un dato cumple una regla.

Limpieza de datos: proceso de corregir y preparar datos para su uso.

Diccionario de datos: documento que explica campos, tipos y reglas.

Trazabilidad: capacidad de conocer origen y cambios de un dato.

Formulario: herramienta para recolectar información de manera estructurada.

Registro de limpieza: documentación de cambios realizados.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Informe Básico de Calidad de Datos**.

Ese informe debe permitir:

- evaluar una base simple;
- detectar errores;
- medir problemas;
- limpiar con criterio;
- documentar cambios;
- prevenir errores futuros;
- mejorar confianza;
- preparar datos para análisis;
- comunicar limitaciones;
- proponer reglas de mejora.

El curso termina cuando la persona deja de aceptar los datos “tal como vienen” y aprende a revisar si realmente sirven para decidir.

---

# Fuentes recomendadas para profundizar

- DAMA-DMBOK — principios de gestión y calidad de datos.
- ISO 8000 — calidad de datos.
- Data Management Association — buenas prácticas de datos.
- Microsoft Excel Help — validación, duplicados y limpieza.
- Google Sheets Help — validación de datos y limpieza.
- Tableau — data quality and preparation.
- Power BI documentation — data preparation and profiling.
- Materiales introductorios sobre data governance, data quality, data profiling y data literacy.

# Curso 28 — Excel para Análisis de Datos

## Presentación del curso

Excel sigue siendo una de las herramientas más usadas para analizar datos en empresas, emprendimientos, instituciones educativas, áreas administrativas, equipos comerciales y proyectos personales. Aunque existen herramientas más avanzadas como Power BI, SQL, Python o Tableau, Excel continúa siendo una puerta de entrada fundamental al análisis de datos porque permite cargar, limpiar, transformar, resumir, visualizar y comunicar información con relativa facilidad.

Este curso no es una introducción general a Excel. Parte de una base inicial y se enfoca en usar Excel como herramienta de análisis: tablas estructuradas, filtros, funciones, validación, limpieza, tablas dinámicas, gráficos, segmentadores, dashboards simples, Power Query inicial y criterios para comunicar hallazgos.

El objetivo no es memorizar fórmulas sueltas, sino aprender un flujo de trabajo analítico:

1. recibir datos;
2. revisar calidad;
3. limpiar y ordenar;
4. calcular métricas;
5. resumir;
6. visualizar;
7. interpretar;
8. presentar conclusiones.

Está pensado para estudiantes, administrativos, emprendedores, analistas ciudadanos, trabajadores de oficina, perfiles comerciales, docentes y personas que quieren avanzar desde “usar planillas” hacia “analizar datos con criterio”.

La idea central es:

> Excel para análisis de datos no consiste en hacer muchas fórmulas, sino en construir información confiable para responder preguntas y tomar decisiones.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender el flujo de análisis de datos en Excel.
2. Preparar tablas limpias y estructuradas.
3. Usar tablas de Excel para organizar bases.
4. Aplicar filtros, ordenamientos y formatos adecuados.
5. Usar funciones analíticas como SI, CONTAR.SI, SUMAR.SI, PROMEDIO.SI y BUSCARX/BUSCARV.
6. Crear campos calculados básicos.
7. Detectar errores, duplicados y datos faltantes.
8. Construir tablas dinámicas para resumir información.
9. Usar segmentadores y gráficos dinámicos.
10. Crear dashboards simples en Excel.
11. Introducirse a Power Query para importar y transformar datos.
12. Comunicar hallazgos con claridad y límites.

---

# Módulo 1 — Excel como herramienta de análisis

## 1.1 Excel más allá de la planilla

Excel puede usarse para muchas tareas:

- listas;
- presupuestos;
- registros;
- cálculos;
- reportes;
- dashboards;
- inventarios;
- control de ventas;
- seguimiento de tareas;
- análisis de datos.

Para análisis, Excel debe usarse con estructura. No alcanza con “poner datos” en una hoja.

## 1.2 Flujo analítico

Un flujo básico en Excel incluye:

1. Pregunta de análisis.
2. Fuente de datos.
3. Revisión de calidad.
4. Limpieza.
5. Transformación.
6. Cálculo de métricas.
7. Resumen.
8. Visualización.
9. Interpretación.
10. Recomendación.

Si se salta la revisión de calidad, las conclusiones pueden ser incorrectas.

## 1.3 Preguntas que Excel puede responder

Ejemplos:

- ¿Cuánto vendimos este mes?
- ¿Qué producto genera más ingresos?
- ¿Qué canal tiene mejor ticket promedio?
- ¿Qué clientes compran con más frecuencia?
- ¿Qué gastos crecieron?
- ¿Qué pedidos están pendientes?
- ¿Qué reclamos se repiten?
- ¿Qué indicador cambió respecto al mes anterior?

## 1.4 Límites de Excel

Excel es muy útil, pero tiene límites:

- grandes volúmenes pueden volverlo lento;
- riesgo de errores manuales;
- dificultad para múltiples usuarios simultáneos;
- trazabilidad limitada si no se documenta;
- problemas con versiones duplicadas;
- seguridad insuficiente para datos sensibles si se usa mal.

Excel sirve muy bien como punto de partida, pero debe usarse con criterio.

---

# Módulo 2 — Preparación de datos

## 2.1 Tabla base

Una tabla base debe tener:

- una fila de encabezados;
- una fila por registro;
- una columna por variable;
- datos consistentes;
- sin celdas combinadas;
- sin subtotales mezclados;
- sin notas dentro del cuerpo;
- fechas y números correctamente formateados.

## 2.2 Ejemplo de tabla analítica

| Fecha | Cliente | Producto | Categoría | Canal | Cantidad | Precio | Total | Estado |
|---|---|---|---|---|---:|---:|---:|---|
| 01/06/2026 | Ana | Remera | Ropa | WhatsApp | 2 | 8000 | 16000 | Pagado |

## 2.3 Errores que dañan el análisis

- filas vacías;
- encabezados duplicados;
- campos sin nombre;
- fechas como texto;
- números mezclados con símbolos;
- categorías escritas de distintas formas;
- productos en una sola celda;
- comentarios mezclados con datos;
- totales intermedios dentro de la base.

## 2.4 Hoja de trabajo recomendada

Separar el archivo en hojas:

- `Base_original`;
- `Base_limpia`;
- `Listas`;
- `Calculos`;
- `Tablas_dinamicas`;
- `Dashboard`;
- `Documentacion`.

Esto evita mezclar datos crudos, análisis y presentación.

## 2.5 Copia del original

Antes de limpiar datos, conservar una copia original. La base original no debe modificarse.

Regla:

> Nunca limpiar sobre la única versión de los datos.

---

# Módulo 3 — Tablas de Excel

## 3.1 Qué es una tabla de Excel

Una tabla de Excel es un rango convertido en estructura formal mediante la opción “Formato como tabla” o “Insertar tabla”.

Permite:

- filtros automáticos;
- formato consistente;
- expansión automática;
- referencias estructuradas;
- totales;
- mejor uso con tablas dinámicas;
- mayor claridad.

## 3.2 Ventajas

Trabajar con tablas permite:

- evitar rangos incompletos;
- agregar datos sin rehacer fórmulas;
- leer fórmulas más claramente;
- aplicar estilos;
- filtrar columnas;
- conectar con Power Query;
- alimentar gráficos y pivots.

## 3.3 Nombre de tabla

Es recomendable nombrar tablas.

Ejemplos:

- `tblVentas`;
- `tblClientes`;
- `tblProductos`;
- `tblGastos`;
- `tblReclamos`.

Un nombre claro facilita fórmulas y mantenimiento.

## 3.4 Referencias estructuradas

En vez de usar:

> =H2*I2

Una tabla puede permitir referencias como:

> =[@Cantidad]*[@Precio]

Esto hace que las fórmulas sean más comprensibles.

## 3.5 Buenas prácticas

- una tabla por conjunto de datos;
- nombres claros;
- encabezados únicos;
- sin celdas combinadas;
- tipos de datos consistentes;
- no mezclar resumen con datos;
- no dejar columnas vacías.

---

# Módulo 4 — Limpieza básica en Excel

## 4.1 Objetivo de la limpieza

La limpieza busca preparar los datos para analizarlos. No debe alterar la realidad ni cambiar resultados para que “queden mejor”.

Incluye:

- quitar duplicados;
- corregir formatos;
- normalizar categorías;
- separar columnas;
- completar datos faltantes;
- revisar valores extremos;
- corregir espacios;
- validar fechas.

## 4.2 Quitar espacios

Los espacios invisibles generan errores.

Ejemplo:

- “Ana”;
- “Ana ”;
- “ Ana”.

Excel puede tratarlos como valores distintos.

Funciones útiles:

- `ESPACIOS`;
- `LIMPIAR`;
- buscar y reemplazar.

## 4.3 Texto en columnas

Sirve para separar datos mezclados.

Ejemplo:

Una columna contiene:

> Ana López - Santa Fe - WhatsApp

Puede separarse en:

- nombre;
- ciudad;
- canal.

## 4.4 Quitar duplicados

Excel permite quitar duplicados, pero debe usarse con cuidado.

Antes de eliminar:

- identificar campos clave;
- revisar duplicados probables;
- guardar copia;
- documentar cambios.

No siempre dos nombres iguales son la misma persona.

## 4.5 Buscar y reemplazar

Útil para normalizar categorías.

Ejemplo:

- Wsp → WhatsApp;
- IG → Instagram;
- Local fisico → Local.

Debe hacerse con cuidado para no reemplazar texto incorrecto.

---

# Módulo 5 — Validación y control de calidad

## 5.1 Validación de datos

La validación permite limitar qué se puede ingresar en una celda.

Ejemplos:

- lista de estados;
- número positivo;
- fecha válida;
- porcentaje entre 0 y 100;
- texto de longitud limitada.

## 5.2 Listas cerradas

Para categorías, usar listas desplegables.

Ejemplo estado:

- Nuevo;
- Pendiente de pago;
- Pagado;
- Enviado;
- Entregado;
- Cancelado.

Esto evita variantes como:

- pag;
- PAGO;
- pago confirmado;
- ya pagó.

## 5.3 Formato condicional

Sirve para detectar visualmente:

- valores vacíos;
- duplicados;
- montos altos;
- fechas vencidas;
- estados críticos;
- valores negativos;
- productos sin stock.

## 5.4 Reglas de calidad

Ejemplos:

- Total debe ser mayor a 0.
- Fecha no puede estar vacía.
- Estado debe estar en lista.
- Cantidad debe ser mayor o igual a 1.
- Canal debe estar informado.
- Producto debe existir en catálogo.

## 5.5 Hoja de control

Crear hoja `Control_calidad` con:

- registros totales;
- campos vacíos;
- duplicados;
- valores fuera de rango;
- categorías no válidas;
- fecha de revisión;
- responsable.

---

# Módulo 6 — Funciones condicionales

## 6.1 Función SI

Permite evaluar una condición.

Ejemplo:

> =SI([@Total]>10000;"Venta alta";"Venta normal")

Sirve para clasificar registros.

## 6.2 SI anidado

Permite evaluar varias condiciones, aunque puede volverse difícil de mantener.

Ejemplo:

> =SI(A2>=90;"Excelente";SI(A2>=70;"Bueno";"Revisar"))

Para muchos casos, conviene usar tablas de referencia.

## 6.3 SI.ERROR

Evita mostrar errores visibles.

Ejemplo:

> =SI.ERROR(A2/B2;0)

Pero no debe usarse para esconder problemas sin revisar. Si aparece error, hay que entender por qué.

## 6.4 Y / O

Permiten combinar condiciones.

Ejemplo:

> =SI(Y([@Estado]="Pagado";[@Total]>0);"OK";"Revisar")

## 6.5 Aplicación práctica

Crear columna `Revision`:

- OK;
- Falta estado;
- Monto inválido;
- Fecha faltante;
- Revisar.

Esto ayuda a auditar datos antes del análisis.

---

# Módulo 7 — Funciones de conteo, suma y promedio condicional

## 7.1 CONTAR.SI

Cuenta registros que cumplen una condición.

Ejemplo:

> =CONTAR.SI(tblVentas[Canal];"WhatsApp")

Sirve para contar ventas por canal, reclamos por tipo o pedidos por estado.

## 7.2 CONTAR.SI.CONJUNTO

Cuenta con varias condiciones.

Ejemplo:

> =CONTAR.SI.CONJUNTO(tblVentas[Canal];"WhatsApp";tblVentas[Estado];"Pagado")

## 7.3 SUMAR.SI

Suma valores que cumplen una condición.

Ejemplo:

> =SUMAR.SI(tblVentas[Canal];"Instagram";tblVentas[Total])

## 7.4 SUMAR.SI.CONJUNTO

Suma con varias condiciones.

Ejemplo:

> =SUMAR.SI.CONJUNTO(tblVentas[Total];tblVentas[Canal];"WhatsApp";tblVentas[Estado];"Pagado")

## 7.5 PROMEDIO.SI

Calcula promedio condicionado.

Ejemplo:

> =PROMEDIO.SI(tblVentas[Canal];"Instagram";tblVentas[Total])

## 7.6 Aplicación

Con estas funciones se pueden crear indicadores:

- ventas por canal;
- cantidad de pedidos pagados;
- ticket promedio por producto;
- reclamos por tipo;
- gastos por categoría;
- asistencia por curso.

---

# Módulo 8 — Búsquedas y cruces de datos

## 8.1 Por qué cruzar datos

Muchas veces una tabla no contiene toda la información.

Ejemplo:

Tabla ventas:

- id_producto;
- cantidad;
- fecha.

Tabla productos:

- id_producto;
- nombre;
- categoría;
- precio;
- costo.

Para analizar margen, hay que cruzarlas.

## 8.2 BUSCARV

BUSCARV permite traer información desde otra tabla usando una clave.

Ejemplo:

> =BUSCARV([@id_producto];tblProductos;2;FALSO)

Limitaciones:

- busca de izquierda a derecha;
- puede fallar si cambia el orden de columnas;
- requiere coincidencia exacta para datos confiables.

## 8.3 BUSCARX

BUSCARX es más flexible y moderna.

Ejemplo:

> =BUSCARX([@id_producto];tblProductos[id_producto];tblProductos[Categoría];"No encontrado")

Permite definir valor si no encuentra coincidencia.

## 8.4 Clave única

Para cruzar datos, se necesita una clave confiable.

Ejemplos:

- id_cliente;
- id_producto;
- número de pedido;
- código de factura;
- SKU.

Usar nombres como clave puede generar errores.

## 8.5 Errores frecuentes

- claves duplicadas;
- espacios extra;
- tipos distintos;
- IDs escritos como texto en una tabla y número en otra;
- productos sin correspondencia;
- valores no encontrados.

Crear columna de control:

> Encontrado / No encontrado

---

# Módulo 9 — Campos calculados e indicadores

## 9.1 Qué es un campo calculado

Es una columna nueva creada a partir de datos existentes.

Ejemplos:

- total = cantidad * precio;
- margen = total - costo;
- mes = MES(fecha);
- año = AÑO(fecha);
- estado_analisis = SI(...);
- ticket_categoria = clasificación por monto.

## 9.2 Campos de fecha

Crear columnas:

- año;
- mes;
- semana;
- día;
- trimestre;
- día de la semana.

Esto permite analizar evolución.

## 9.3 Indicadores comerciales

Ejemplos:

- ventas totales;
- pedidos;
- ticket promedio;
- unidades vendidas;
- margen bruto;
- porcentaje de pedidos pendientes;
- conversión;
- ventas por canal.

## 9.4 Indicadores operativos

Ejemplos:

- tiempo promedio de resolución;
- cantidad de tickets;
- casos vencidos;
- reclamos por tipo;
- entregas demoradas;
- porcentaje de cumplimiento.

## 9.5 Cuidado

Cada indicador debe tener definición clara.

Ejemplo:

Venta total puede significar:

- venta bruta;
- venta neta;
- venta pagada;
- venta entregada;
- venta facturada.

Sin definición, el indicador genera discusión.

---

# Módulo 10 — Tablas dinámicas

## 10.1 Qué es una tabla dinámica

Una tabla dinámica resume datos de una tabla base para analizar por categorías, períodos o métricas.

Permite calcular:

- sumas;
- conteos;
- promedios;
- máximos;
- mínimos;
- porcentajes;
- agrupaciones.

## 10.2 Preguntas típicas

- ¿ventas por canal?
- ¿ventas por mes?
- ¿pedidos por estado?
- ¿gastos por categoría?
- ¿reclamos por tipo?
- ¿ticket promedio por producto?
- ¿unidades vendidas por vendedor?

## 10.3 Campos

Una tabla dinámica se organiza con:

- filas;
- columnas;
- valores;
- filtros.

Ejemplo:

Pregunta:

> ¿Cuánto vendimos por canal?

Filas:

- canal.

Valores:

- suma de total.

## 10.4 Agrupar fechas

Las fechas pueden agruparse por:

- año;
- trimestre;
- mes;
- día.

Esto permite análisis temporal.

## 10.5 Errores frecuentes

- base con filas vacías;
- columnas sin encabezado;
- fechas como texto;
- categorías inconsistentes;
- no actualizar tabla dinámica;
- sumar campos que son texto;
- interpretar totales sin revisar filtros.

---

# Módulo 11 — Segmentadores y gráficos dinámicos

## 11.1 Segmentadores

Los segmentadores permiten filtrar visualmente una tabla dinámica.

Ejemplos:

- canal;
- producto;
- categoría;
- estado;
- mes;
- vendedor;
- zona.

Hacen que un reporte sea interactivo.

## 11.2 Línea de tiempo

La línea de tiempo permite filtrar por fechas.

Útil para:

- meses;
- trimestres;
- años;
- períodos específicos.

## 11.3 Gráficos dinámicos

Un gráfico dinámico se conecta a una tabla dinámica y cambia con filtros y segmentadores.

Sirve para dashboards simples.

## 11.4 Buenas prácticas

- no usar demasiados segmentadores;
- nombrar filtros claramente;
- revisar si todos afectan los gráficos correctos;
- evitar diseño recargado;
- mantener un período visible;
- validar que los números coincidan con la base.

## 11.5 Aplicación

Dashboard de ventas:

- segmentador de canal;
- segmentador de categoría;
- línea de tiempo por mes;
- gráfico de ventas por producto;
- indicador de ventas totales;
- gráfico de pedidos por estado.

---

# Módulo 12 — Gráficos para análisis

## 12.1 Columnas y barras

Para comparar categorías.

Ejemplos:

- ventas por producto;
- gastos por categoría;
- reclamos por tipo.

## 12.2 Líneas

Para evolución temporal.

Ejemplos:

- ventas mensuales;
- asistencia semanal;
- tickets diarios.

## 12.3 Combinados

Permiten mostrar dos métricas relacionadas.

Ejemplo:

- ventas y cantidad de pedidos por mes.

Usar con cuidado para no confundir escalas.

## 12.4 Dispersión

Para explorar relación entre dos variables numéricas.

Ejemplo:

- inversión publicitaria y ventas;
- precio y cantidad vendida.

## 12.5 Malas prácticas

- gráficos 3D;
- demasiados colores;
- ejes sin nombre;
- títulos genéricos;
- categorías desordenadas;
- escala engañosa;
- demasiada información;
- falta de fuente o período.

## 12.6 Título interpretativo

Malo:

> Ventas.

Mejor:

> WhatsApp concentró el 55% de las ventas pagadas en junio.

El título debe ayudar a leer el hallazgo.

---

# Módulo 13 — Dashboard básico en Excel

## 13.1 Qué es un dashboard

Un dashboard es una vista resumida de indicadores, gráficos y filtros que ayuda a entender una situación rápidamente.

No es una decoración. Debe responder preguntas.

## 13.2 Elementos

Un dashboard simple puede incluir:

- título;
- período;
- indicadores clave;
- gráficos;
- segmentadores;
- tabla resumen;
- observaciones;
- fecha de actualización;
- fuente.

## 13.3 Indicadores clave

Ejemplo ventas:

- ventas totales;
- cantidad de pedidos;
- ticket promedio;
- producto más vendido;
- canal principal;
- pedidos pendientes.

## 13.4 Diseño

Recomendaciones:

- una pantalla clara;
- pocos colores;
- alineación;
- títulos claros;
- filtros visibles;
- números grandes para KPIs;
- gráficos simples;
- notas de interpretación.

## 13.5 Errores

- demasiados gráficos;
- indicadores sin definición;
- no aclarar período;
- no mostrar fuente;
- mezclar métricas incompatibles;
- no actualizar datos;
- priorizar estética sobre claridad.

---

# Módulo 14 — Power Query inicial

## 14.1 Qué es Power Query

Power Query es una herramienta de Excel para importar, limpiar y transformar datos de manera más repetible que haciendo cambios manuales celda por celda.

Permite trabajar con:

- archivos Excel;
- CSV;
- carpetas;
- bases de datos;
- web;
- tablas;
- otras fuentes.

## 14.2 Para qué sirve

Power Query ayuda a:

- importar datos;
- quitar columnas;
- cambiar tipos;
- filtrar filas;
- separar columnas;
- combinar tablas;
- anexar archivos;
- quitar duplicados;
- reemplazar valores;
- automatizar pasos de limpieza.

## 14.3 Ventaja principal

Los pasos quedan registrados. Si llega un nuevo archivo con la misma estructura, se puede actualizar el proceso.

Esto reduce trabajo repetitivo y errores manuales.

## 14.4 Transformaciones básicas

- cambiar tipo de dato;
- quitar columnas;
- renombrar columnas;
- filtrar filas;
- dividir columnas;
- reemplazar valores;
- quitar duplicados;
- combinar consultas.

## 14.5 Precauciones

Power Query no corrige malas decisiones de análisis. Si se transforman datos sin entender, se pueden producir errores repetibles.

Documentar:

- fuente;
- pasos;
- reglas;
- fecha;
- responsable.

---

# Módulo 15 — Comunicación de hallazgos

## 15.1 De número a conclusión

Dato:

> Ventas: $500.000.

Hallazgo:

> Las ventas de junio fueron $500.000, un 18% más que mayo.

Interpretación:

> El crecimiento se explica principalmente por el canal WhatsApp.

Recomendación:

> Reforzar seguimiento por WhatsApp y revisar stock de los productos con mayor rotación.

## 15.2 Estructura de análisis

1. Pregunta.
2. Datos utilizados.
3. Método.
4. Métricas.
5. Visualizaciones.
6. Hallazgos.
7. Límites.
8. Recomendaciones.

## 15.3 Límites

Aclarar:

- período;
- fuente;
- datos faltantes;
- criterios de limpieza;
- supuestos;
- errores posibles;
- qué no se incluyó.

## 15.4 Lenguaje responsable

Evitar:

> Esto demuestra que Instagram es mejor.

Mejor:

> En el período analizado, Instagram tuvo mayor ticket promedio, aunque WhatsApp concentró mayor volumen de pedidos.

## 15.5 Acción

El análisis debe terminar en una decisión o próximo paso.

Ejemplos:

- medir otro mes;
- limpiar datos;
- mejorar registro;
- probar campaña;
- ajustar stock;
- revisar precios;
- crear tablero periódico.

---

# Caso práctico integrador

## Caso: análisis de ventas mensual

Un comercio tiene una planilla con 500 ventas. Quiere saber qué canal vende más, qué productos priorizar y qué pedidos siguen pendientes.

### Paso 1 — Preparar base

Se crea `tblVentas` con:

- fecha;
- cliente;
- producto;
- categoría;
- canal;
- cantidad;
- precio;
- total;
- estado.

### Paso 2 — Revisar calidad

Se revisan:

- fechas vacías;
- totales en cero;
- canales inconsistentes;
- productos duplicados;
- estados fuera de lista.

### Paso 3 — Crear campos

- mes;
- año;
- total;
- estado de revisión;
- ticket alto/normal.

### Paso 4 — Funciones

Se calculan:

- ventas totales;
- pedidos pagados;
- pedidos pendientes;
- ticket promedio;
- ventas por canal.

### Paso 5 — Tabla dinámica

Se crea resumen:

- ventas por canal;
- ventas por producto;
- pedidos por estado;
- ventas por mes.

### Paso 6 — Dashboard

Incluye:

- KPIs;
- gráfico de ventas por canal;
- gráfico de productos;
- pedidos pendientes;
- segmentador de mes;
- segmentador de estado.

### Paso 7 — Hallazgos

Ejemplo:

- WhatsApp concentra el 58% de ventas pagadas.
- Instagram tiene menor volumen, pero mayor ticket promedio.
- Tres productos generan el 45% de la facturación.
- El 12% de pedidos sigue pendiente.

### Paso 8 — Recomendación

- reforzar seguimiento de pendientes;
- asegurar stock de productos principales;
- medir conversión de Instagram el próximo mes;
- crear reporte semanal.

---

# Actividades del curso

## Actividad 1 — Preparar tabla

Crear una tabla estructurada con al menos 50 registros de ventas, gastos, reclamos o asistencia.

Debe tener:

- encabezados;
- tipos correctos;
- columna de fecha;
- columna de categoría;
- columna numérica;
- columna de estado.

## Actividad 2 — Control de calidad

Detectar:

- vacíos;
- duplicados;
- valores inválidos;
- categorías inconsistentes;
- números sospechosos.

## Actividad 3 — Funciones condicionales

Crear indicadores usando:

- SI;
- CONTAR.SI;
- SUMAR.SI;
- PROMEDIO.SI;
- SI.ERROR.

## Actividad 4 — Cruce de datos

Crear dos tablas y usar BUSCARV o BUSCARX para traer una categoría, precio, costo o responsable.

## Actividad 5 — Tabla dinámica

Crear al menos dos tablas dinámicas:

- resumen por categoría;
- resumen por período;
- resumen por estado.

## Actividad 6 — Gráficos

Crear:

- gráfico de barras;
- gráfico de líneas;
- gráfico dinámico.

## Actividad 7 — Dashboard

Crear una hoja de dashboard con:

- tres KPIs;
- dos gráficos;
- un segmentador;
- una tabla resumen;
- fecha de actualización.

## Actividad 8 — Informe

Redactar hallazgos, límites y recomendaciones.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué diferencia hay entre usar Excel para cargar datos y usarlo para analizarlos?
2. ¿Por qué conviene convertir una base en tabla de Excel?
3. ¿Por qué debe conservarse una copia original?
4. ¿Para qué sirve la validación de datos?
5. ¿Qué permite CONTAR.SI?
6. ¿Qué diferencia hay entre BUSCARV y BUSCARX?
7. ¿Qué es una clave única?
8. ¿Para qué sirve una tabla dinámica?
9. ¿Qué función cumplen los segmentadores?
10. ¿Qué debe incluir un dashboard básico?
11. ¿Para qué sirve Power Query?
12. ¿Por qué hay que comunicar límites del análisis?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Dashboard Analítico Básico en Excel**.

Debe incluir:

1. tabla base estructurada;
2. control de calidad;
3. campos calculados;
4. funciones condicionales;
5. cruce con tabla auxiliar;
6. tablas dinámicas;
7. gráficos;
8. segmentadores;
9. dashboard;
10. hallazgos;
11. límites;
12. recomendaciones.

---

# Glosario básico

Excel: herramienta de hojas de cálculo usada para cálculos, análisis y reportes.

Tabla de Excel: rango estructurado con encabezados, filtros y referencias.

Base original: archivo o tabla sin modificar que sirve como respaldo.

Base limpia: versión corregida y preparada para análisis.

Validación de datos: regla que controla qué puede ingresarse en una celda.

Formato condicional: formato visual aplicado según condiciones.

SI: función condicional.

CONTAR.SI: función para contar registros que cumplen una condición.

SUMAR.SI: función para sumar valores que cumplen una condición.

PROMEDIO.SI: función para promediar valores que cumplen una condición.

BUSCARV: función para buscar valores en una tabla vertical.

BUSCARX: función moderna para buscar valores de manera flexible.

Clave única: campo que identifica de forma única un registro.

Tabla dinámica: herramienta para resumir y analizar datos.

Segmentador: filtro visual para tablas dinámicas.

Dashboard: vista resumida de indicadores y gráficos.

Power Query: herramienta para importar y transformar datos.

KPI: indicador clave de desempeño.

Hallazgo: observación relevante basada en datos.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Dashboard Analítico Básico en Excel**.

Ese producto debe permitir:

- trabajar con datos estructurados;
- revisar calidad;
- limpiar información;
- cruzar tablas;
- calcular indicadores;
- resumir con tablas dinámicas;
- filtrar con segmentadores;
- visualizar resultados;
- interpretar hallazgos;
- recomendar acciones.

El curso termina cuando la persona deja de usar Excel solo como planilla de carga y empieza a usarlo como herramienta de análisis y comunicación de datos.

---

# Fuentes recomendadas para profundizar

- Microsoft Excel Help & Learning.
- Microsoft Support — Create and format tables.
- Microsoft Support — PivotTables.
- Microsoft Support — Slicers and timelines.
- Microsoft Support — Power Query.
- Microsoft Support — XLOOKUP and lookup functions.
- Microsoft Support — Data validation.
- Materiales introductorios sobre dashboards, visualización, limpieza de datos y análisis en planillas.

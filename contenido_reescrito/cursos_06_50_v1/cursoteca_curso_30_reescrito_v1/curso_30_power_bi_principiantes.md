# Curso 30 — Power BI para Principiantes

## Presentación del curso

Power BI es una de las herramientas más utilizadas para transformar datos en reportes visuales, tableros interactivos e indicadores de negocio. Permite conectar fuentes de datos, limpiarlas, modelarlas, crear medidas, diseñar visualizaciones y compartir reportes para apoyar decisiones.

Para una persona que viene de Excel, Google Sheets o análisis básico, Power BI representa un salto importante: ya no se trabaja solo con una planilla, sino con un modelo de datos, relaciones entre tablas, visualizaciones interactivas, filtros, segmentadores, medidas y publicación en un servicio online.

Este curso está pensado para principiantes: estudiantes, administrativos, emprendedores, analistas ciudadanos, trabajadores de oficina, perfiles comerciales, docentes y personas que quieren crear sus primeros reportes profesionales. No requiere saber programar, aunque sí conviene tener nociones básicas de planillas, calidad de datos e indicadores.

El objetivo no es crear tableros visualmente llamativos sin criterio. El objetivo es aprender a construir reportes útiles, claros, confiables y orientados a preguntas reales.

La idea central es:

> Power BI no sirve solo para hacer gráficos. Sirve para convertir datos conectados y modelados en información visual para decidir mejor.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es Power BI y para qué se utiliza.
2. Diferenciar Power BI Desktop, Power BI Service y reportes publicados.
3. Conectar fuentes simples como Excel, CSV o carpetas.
4. Usar Power Query para limpiar y transformar datos.
5. Comprender tablas, columnas, relaciones y modelo de datos.
6. Crear visualizaciones básicas.
7. Usar filtros y segmentadores.
8. Crear medidas simples con DAX.
9. Diseñar un dashboard o reporte inicial.
10. Publicar o preparar un reporte para compartir.
11. Interpretar resultados con responsabilidad.
12. Construir un reporte básico de ventas, gastos, asistencia o reclamos.

---

# Módulo 1 — Qué es Power BI

## 1.1 Definición

Power BI es una plataforma de inteligencia de negocio de Microsoft que permite conectar datos, transformarlos, modelarlos, analizarlos, visualizarlos y compartir reportes interactivos.

Se usa para:

- reportes de ventas;
- seguimiento de gastos;
- análisis de clientes;
- control de stock;
- indicadores de desempeño;
- tableros ejecutivos;
- análisis educativo;
- métricas de atención;
- seguimiento operativo;
- reportes financieros simples.

## 1.2 Qué problema resuelve

Muchas organizaciones tienen datos dispersos:

- Excel;
- CSV;
- bases de datos;
- formularios;
- sistemas;
- carpetas;
- reportes manuales.

Power BI ayuda a centralizar, transformar y visualizar esos datos en reportes interactivos.

## 1.3 Diferencia con Excel

Excel es muy flexible para planillas, cálculos y análisis manual.

Power BI está más orientado a:

- conectar fuentes;
- crear modelos de datos;
- automatizar transformaciones;
- diseñar reportes interactivos;
- publicar dashboards;
- compartir indicadores;
- actualizar datos;
- trabajar con relaciones entre tablas.

Excel puede ser una fuente de datos para Power BI.

## 1.4 Componentes principales

### Power BI Desktop

Aplicación de escritorio donde se crean reportes, modelos y visualizaciones.

### Power BI Service

Plataforma online donde se publican, comparten y consultan reportes.

### Power Query

Motor para limpiar y transformar datos.

### Modelo de datos

Conjunto de tablas, relaciones, columnas y medidas.

### DAX

Lenguaje de fórmulas usado para crear medidas y cálculos analíticos.

---

# Módulo 2 — Flujo de trabajo en Power BI

## 2.1 Flujo general

Un flujo básico en Power BI incluye:

1. Obtener datos.
2. Transformar datos.
3. Crear modelo.
4. Crear medidas.
5. Diseñar visualizaciones.
6. Crear reporte.
7. Publicar.
8. Compartir.
9. Actualizar.
10. Revisar uso y calidad.

## 2.2 Pregunta de análisis

Antes de abrir Power BI, definir qué se quiere responder.

Ejemplos:

- ¿cuánto vendimos por mes?
- ¿qué producto tiene mayor facturación?
- ¿qué canal genera más pedidos?
- ¿qué gastos crecieron?
- ¿qué reclamos son más frecuentes?
- ¿qué alumnos tienen baja asistencia?

## 2.3 Fuente de datos

Power BI puede conectarse a muchas fuentes. Para principiantes, conviene empezar con:

- Excel;
- CSV;
- carpetas;
- Google Sheets exportado;
- bases simples;
- archivos de ventas;
- planillas de gastos;
- registros de asistencia.

## 2.4 Transformación

Los datos rara vez llegan listos. Puede ser necesario:

- quitar columnas;
- cambiar tipos;
- renombrar campos;
- filtrar filas;
- quitar duplicados;
- separar columnas;
- unificar categorías;
- corregir fechas;
- combinar tablas.

## 2.5 Modelo

El modelo define cómo se relacionan las tablas.

Ejemplo:

- tabla de ventas;
- tabla de productos;
- tabla de clientes;
- tabla calendario.

El reporte depende de un modelo correcto.

---

# Módulo 3 — Instalación y entorno de trabajo

## 3.1 Power BI Desktop

Power BI Desktop se usa para crear archivos `.pbix`.

En esta herramienta se puede:

- conectar datos;
- transformar con Power Query;
- crear relaciones;
- crear medidas;
- diseñar reportes;
- guardar el archivo;
- publicar al servicio.

## 3.2 Interfaz principal

Áreas comunes:

- cinta superior;
- panel de campos;
- panel de visualizaciones;
- lienzo del reporte;
- vista de informe;
- vista de datos;
- vista de modelo;
- editor de Power Query.

## 3.3 Archivo PBIX

El archivo `.pbix` contiene:

- consultas;
- modelo;
- medidas;
- visualizaciones;
- páginas del reporte;
- configuración.

No debe confundirse con la fuente original. Si los datos cambian, el reporte debe actualizarse.

## 3.4 Power BI Service

Permite:

- publicar reportes;
- crear dashboards;
- compartir;
- configurar actualizaciones;
- administrar espacios de trabajo;
- consultar desde navegador;
- colaborar.

Algunas funciones pueden requerir licencias específicas.

## 3.5 Buenas prácticas iniciales

- guardar versiones;
- nombrar archivos claramente;
- mantener fuentes ordenadas;
- documentar origen;
- no mezclar datos sensibles sin control;
- revisar tipos de datos;
- diseñar antes de publicar.

---

# Módulo 4 — Obtener datos

## 4.1 Conectar Excel

Power BI puede importar tablas o rangos desde Excel.

Buenas prácticas:

- usar tablas de Excel;
- encabezados claros;
- una fila por registro;
- una columna por variable;
- sin celdas combinadas;
- sin totales mezclados;
- tipos de datos correctos.

## 4.2 Conectar CSV

Los archivos CSV son comunes para exportaciones.

Revisar:

- separador;
- codificación;
- encabezados;
- tipos;
- fechas;
- decimales;
- columnas vacías.

## 4.3 Conectar carpeta

Cuando hay varios archivos con la misma estructura, Power BI puede combinarlos desde una carpeta.

Ejemplo:

- ventas_enero.csv;
- ventas_febrero.csv;
- ventas_marzo.csv.

Esto permite actualizar agregando nuevos archivos a la carpeta.

## 4.4 Conectar web o base

Power BI también puede conectarse a:

- web;
- SQL Server;
- SharePoint;
- Dataverse;
- servicios online;
- APIs, según configuración.

Para principiantes, conviene empezar con archivos simples.

## 4.5 Importar vs conexión

En modo importación, Power BI carga los datos al modelo.

En conexiones más avanzadas, puede consultar datos externos. Este curso trabaja principalmente con importación.

---

# Módulo 5 — Power Query inicial

## 5.1 Qué es Power Query

Power Query es el editor de transformación de datos. Permite preparar datos antes de cargarlos al modelo.

Sirve para:

- limpiar;
- transformar;
- combinar;
- filtrar;
- renombrar;
- cambiar tipos;
- quitar errores;
- documentar pasos.

## 5.2 Pasos aplicados

Cada acción en Power Query queda registrada como un paso.

Ejemplos:

- origen;
- encabezados promovidos;
- tipo cambiado;
- columnas quitadas;
- filas filtradas;
- valores reemplazados.

Esto permite repetir la transformación cuando se actualizan datos.

## 5.3 Tipos de datos

Revisar:

- texto;
- número entero;
- número decimal;
- fecha;
- fecha/hora;
- moneda;
- porcentaje;
- verdadero/falso.

Un tipo incorrecto puede romper medidas y gráficos.

## 5.4 Transformaciones básicas

Acciones frecuentes:

- quitar columnas innecesarias;
- renombrar columnas;
- quitar filas vacías;
- filtrar registros;
- reemplazar valores;
- dividir columna;
- combinar columnas;
- quitar duplicados;
- cambiar tipo de dato.

## 5.5 Cerrar y aplicar

Después de transformar, se usa “Cerrar y aplicar” para cargar los datos al modelo.

Regla:

> Power Query prepara datos. El modelo los relaciona. El reporte los visualiza.

---

# Módulo 6 — Modelo de datos

## 6.1 Qué es un modelo

El modelo de datos es la estructura interna que Power BI usa para analizar información.

Incluye:

- tablas;
- columnas;
- relaciones;
- medidas;
- jerarquías;
- tipos de datos.

## 6.2 Tabla de hechos

Una tabla de hechos contiene eventos o movimientos.

Ejemplos:

- ventas;
- pedidos;
- gastos;
- reclamos;
- asistencias;
- tickets.

Suele tener muchas filas y valores numéricos.

## 6.3 Tablas de dimensión

Las dimensiones describen entidades.

Ejemplos:

- productos;
- clientes;
- calendario;
- vendedores;
- canales;
- zonas.

Ayudan a filtrar y agrupar.

## 6.4 Modelo estrella

Un modelo estrella conecta una tabla de hechos con varias dimensiones.

Ejemplo:

- Ventas al centro;
- Productos;
- Clientes;
- Calendario;
- Canales.

Es una estructura recomendada porque facilita análisis y reduce confusión.

## 6.5 Granularidad

La granularidad define qué representa cada fila.

Ejemplos:

- una fila por venta;
- una fila por producto;
- una fila por cliente;
- una fila por día.

Si la granularidad no está clara, los cálculos pueden duplicarse.

---

# Módulo 7 — Relaciones entre tablas

## 7.1 Qué es una relación

Una relación conecta tablas mediante campos comunes.

Ejemplo:

Ventas tiene `id_producto`.
Productos tiene `id_producto`.

La relación permite analizar ventas por categoría de producto.

## 7.2 Clave

Una clave identifica registros.

Ejemplos:

- id_producto;
- id_cliente;
- id_pedido;
- fecha;
- código de vendedor.

Las claves deben ser consistentes.

## 7.3 Relación uno a muchos

Es la relación más común.

Ejemplo:

Un producto puede aparecer en muchas ventas.

Productos:

- una fila por producto.

Ventas:

- muchas filas con ese producto.

## 7.4 Dirección de filtro

Power BI usa relaciones para filtrar datos entre tablas. En modelos simples, conviene mantener relaciones claras y evitar direcciones complejas sin necesidad.

## 7.5 Errores frecuentes

- relacionar por nombre en vez de ID;
- claves duplicadas en dimensión;
- tipos de datos distintos;
- relaciones muchos a muchos innecesarias;
- tablas sin relación;
- fechas no conectadas a calendario.

---

# Módulo 8 — Visualizaciones básicas

## 8.1 Tipos de visuales

Power BI incluye visuales como:

- tarjetas;
- gráfico de barras;
- gráfico de columnas;
- gráfico de líneas;
- gráfico circular;
- tabla;
- matriz;
- mapa;
- segmentador;
- KPI;
- gráfico combinado.

## 8.2 Tarjetas

Sirven para mostrar indicadores clave:

- ventas totales;
- cantidad de pedidos;
- ticket promedio;
- clientes activos;
- gastos totales;
- reclamos abiertos.

## 8.3 Barras y columnas

Sirven para comparar categorías:

- ventas por producto;
- gastos por categoría;
- reclamos por tipo;
- pedidos por canal.

## 8.4 Líneas

Sirven para evolución temporal:

- ventas por mes;
- gastos por semana;
- asistencia por fecha;
- tickets por día.

## 8.5 Tablas y matrices

Sirven cuando se necesita detalle.

Tabla:

- muestra registros.

Matriz:

- permite agrupar por filas y columnas.

## 8.6 Gráfico correcto

Elegir visual según pregunta:

- comparación: barras;
- evolución: líneas;
- indicador único: tarjeta;
- detalle: tabla;
- composición: barras apiladas o circular con cuidado.

---

# Módulo 9 — Filtros y segmentadores

## 9.1 Filtros

Los filtros permiten limitar datos.

Niveles:

- filtro de visual;
- filtro de página;
- filtro de reporte;
- segmentador visible.

## 9.2 Segmentador

Un segmentador es un filtro interactivo visible para el usuario.

Ejemplos:

- año;
- mes;
- canal;
- categoría;
- producto;
- zona;
- estado.

## 9.3 Buen uso

Un buen segmentador debe:

- ser claro;
- tener valores limpios;
- no tener demasiadas opciones;
- estar bien ubicado;
- afectar los visuales correctos.

## 9.4 Problemas frecuentes

- segmentadores con categorías duplicadas;
- filtros ocultos que confunden;
- usuario no sabe qué está filtrado;
- visuales que no responden;
- exceso de filtros.

## 9.5 Botón de limpieza

En reportes más avanzados, se puede crear una opción para limpiar filtros. En nivel inicial, basta con diseñar filtros visibles y comprensibles.

---

# Módulo 10 — DAX básico

## 10.1 Qué es DAX

DAX es el lenguaje de fórmulas de Power BI para crear medidas, columnas calculadas y cálculos analíticos.

No hace falta dominar DAX avanzado para empezar, pero sí entender medidas básicas.

## 10.2 Medida

Una medida calcula un resultado según el contexto del reporte.

Ejemplo:

> Ventas Totales = SUM(Ventas[Total])

Si se filtra por mes o producto, la medida cambia automáticamente.

## 10.3 Columna calculada

Una columna calculada se calcula fila por fila y queda guardada en el modelo.

Ejemplo:

> Año = YEAR(Ventas[Fecha])

## 10.4 Medidas vs columnas

Usar medidas para indicadores agregados:

- ventas totales;
- ticket promedio;
- cantidad de pedidos;
- margen;
- porcentaje.

Usar columnas para clasificaciones por fila:

- año;
- mes;
- categoría calculada;
- estado derivado.

## 10.5 Medidas iniciales

Ejemplos:

```DAX
Ventas Totales = SUM(Ventas[Total])
```

```DAX
Cantidad de Pedidos = COUNTROWS(Ventas)
```

```DAX
Ticket Promedio = DIVIDE([Ventas Totales], [Cantidad de Pedidos])
```

```DAX
Unidades Vendidas = SUM(Ventas[Cantidad])
```

```DAX
Clientes = DISTINCTCOUNT(Ventas[id_cliente])
```

---

# Módulo 11 — Medidas e indicadores

## 11.1 Indicadores clave

Un reporte debe tener pocos indicadores bien definidos.

Ejemplo ventas:

- ventas totales;
- pedidos;
- ticket promedio;
- unidades vendidas;
- clientes;
- producto principal;
- canal principal.

## 11.2 DIVIDE

En DAX, conviene usar `DIVIDE` para evitar errores por división por cero.

Ejemplo:

```DAX
Ticket Promedio = DIVIDE([Ventas Totales], [Cantidad de Pedidos])
```

## 11.3 Porcentajes

Ejemplo:

```DAX
Porcentaje Pendiente = DIVIDE([Pedidos Pendientes], [Cantidad de Pedidos])
```

Luego se formatea como porcentaje.

## 11.4 Contexto de filtro

Una medida se recalcula según filtros.

Ejemplo:

Ventas Totales puede mostrar:

- total general;
- total por mes;
- total por canal;
- total por producto;
- total según segmentador.

## 11.5 Definición

Cada indicador debe tener definición clara.

Ejemplo:

Ventas Totales:

> Suma del campo Total para pedidos con estado Pagado o Entregado durante el período filtrado.

Sin definición, el reporte puede interpretarse mal.

---

# Módulo 12 — Diseño de reportes

## 12.1 Reporte vs dashboard

En Power BI, un reporte puede tener varias páginas con visualizaciones interactivas.

Un dashboard en Power BI Service suele ser una vista resumida con elementos fijados desde reportes.

En uso cotidiano, muchas personas llaman dashboard a una página de reporte con KPIs y gráficos.

## 12.2 Página inicial

Debe responder rápido:

- qué se analiza;
- período;
- indicadores principales;
- filtros;
- gráficos clave;
- fuente;
- fecha de actualización.

## 12.3 Jerarquía visual

Orden recomendado:

1. Título.
2. Filtros.
3. KPIs.
4. Gráficos principales.
5. Tabla de detalle.
6. Observaciones.

## 12.4 Menos es más

Errores comunes:

- demasiados gráficos;
- colores excesivos;
- títulos genéricos;
- filtros escondidos;
- métricas sin definición;
- páginas saturadas;
- tablas enormes sin necesidad.

## 12.5 Diseño profesional

Recomendaciones:

- usar colores consistentes;
- alinear elementos;
- agrupar visuales relacionados;
- usar títulos interpretativos;
- evitar 3D;
- mostrar unidades;
- aclarar período;
- usar espacio en blanco.

---

# Módulo 13 — Reporte de ventas desde cero

## 13.1 Datos necesarios

Tablas:

- Ventas;
- Productos;
- Clientes;
- Calendario;
- Canales, opcional.

Campos de ventas:

- fecha;
- id_producto;
- id_cliente;
- canal;
- cantidad;
- precio;
- total;
- estado.

## 13.2 Transformación

En Power Query:

- revisar tipos;
- eliminar filas vacías;
- normalizar canal;
- filtrar ventas válidas;
- corregir fechas;
- revisar columnas necesarias.

## 13.3 Modelo

Relaciones:

- Ventas con Productos por id_producto.
- Ventas con Clientes por id_cliente.
- Ventas con Calendario por fecha.

## 13.4 Medidas

- Ventas Totales.
- Pedidos.
- Ticket Promedio.
- Unidades.
- Clientes.
- Ventas Pagadas.
- Porcentaje Pendiente.

## 13.5 Visuales

- tarjetas de KPI;
- gráfico de ventas por mes;
- barras de ventas por producto;
- barras de ventas por canal;
- tabla de pedidos pendientes;
- segmentador de mes;
- segmentador de estado.

## 13.6 Hallazgos

Ejemplo:

- WhatsApp concentra mayor volumen.
- Instagram tiene mayor ticket promedio.
- Tres productos explican gran parte de la facturación.
- Los pedidos pendientes crecen a fin de mes.

---

# Módulo 14 — Publicar y compartir

## 14.1 Publicar

Desde Power BI Desktop se puede publicar al Power BI Service si se cuenta con una cuenta habilitada.

Al publicar, el reporte queda disponible en un espacio de trabajo.

## 14.2 Espacios de trabajo

Un espacio de trabajo organiza reportes, datasets y dashboards para un equipo o proyecto.

## 14.3 Compartir

Antes de compartir:

- revisar datos sensibles;
- validar permisos;
- confirmar audiencia;
- revisar filtros;
- verificar actualización;
- probar visuales;
- documentar fuente.

## 14.4 Actualización

Si la fuente cambia, el reporte debe actualizarse. En algunos casos se puede configurar actualización programada.

Depende de:

- tipo de fuente;
- permisos;
- gateway;
- licencia;
- configuración.

## 14.5 Seguridad

No publicar datos sensibles sin control.

Revisar:

- quién accede;
- si puede exportar datos;
- si hay información personal;
- si corresponde anonimizar;
- si el reporte es interno o externo.

---

# Módulo 15 — Interpretación y comunicación

## 15.1 Reporte no es decisión automática

Power BI muestra datos, pero la interpretación sigue siendo humana.

Un gráfico puede sugerir algo, pero hay que revisar:

- período;
- calidad de datos;
- filtros;
- fuente;
- valores atípicos;
- contexto;
- cambios recientes.

## 15.2 Hallazgo

Un hallazgo debe ser claro y respaldado.

Ejemplo:

> En junio, el canal WhatsApp generó el 58% de las ventas pagadas. Sin embargo, Instagram tuvo un ticket promedio 22% superior.

## 15.3 Recomendación

Una recomendación debe ser accionable.

Ejemplo:

> Mantener WhatsApp como canal principal de conversión y probar campañas de productos premium en Instagram durante 30 días.

## 15.4 Límites

Todo reporte debe aclarar:

- fuente;
- fecha de actualización;
- filtros aplicados;
- datos excluidos;
- problemas de calidad;
- supuestos.

## 15.5 Narrativa

Un buen reporte cuenta una historia:

1. situación;
2. dato principal;
3. comparación;
4. explicación posible;
5. recomendación;
6. próxima medición.

---

# Caso práctico integrador

## Caso: dashboard de ventas para emprendimiento

Un emprendimiento tiene ventas en Excel con columnas:

- fecha;
- cliente;
- producto;
- canal;
- cantidad;
- precio;
- total;
- estado.

Quiere un reporte en Power BI para saber cómo va el negocio.

### Paso 1 — Conectar datos

Se importa la tabla de Excel.

### Paso 2 — Power Query

Se corrigen:

- tipos de fecha;
- números;
- canales duplicados;
- estados inconsistentes;
- filas vacías.

### Paso 3 — Modelo

Se crean tablas:

- Ventas;
- Productos;
- Calendario.

Se relacionan correctamente.

### Paso 4 — Medidas

Se crean:

- Ventas Totales;
- Pedidos;
- Ticket Promedio;
- Unidades Vendidas.

### Paso 5 — Reporte

Página principal:

- KPI de ventas;
- KPI de pedidos;
- gráfico de ventas por mes;
- ventas por canal;
- ventas por producto;
- segmentador de fecha;
- tabla de pendientes.

### Paso 6 — Interpretación

Se redactan tres hallazgos y tres acciones.

### Paso 7 — Publicación

Se prepara el archivo para compartir, revisando permisos y datos sensibles.

---

# Actividades del curso

## Actividad 1 — Preparar fuente

Crear o usar una tabla de al menos 100 registros con:

- fecha;
- categoría;
- valor;
- estado;
- canal o grupo.

## Actividad 2 — Power Query

Aplicar transformaciones:

- cambiar tipos;
- renombrar columnas;
- filtrar filas;
- reemplazar valores;
- quitar columnas innecesarias.

## Actividad 3 — Modelo

Crear al menos dos tablas relacionadas:

- tabla de hechos;
- tabla de dimensión.

## Actividad 4 — Visuales

Crear:

- tarjeta;
- gráfico de barras;
- gráfico de líneas;
- tabla o matriz;
- segmentador.

## Actividad 5 — DAX básico

Crear medidas:

- total;
- conteo;
- promedio;
- porcentaje.

## Actividad 6 — Reporte

Diseñar una página de reporte con:

- título;
- KPIs;
- filtros;
- gráficos;
- tabla de detalle.

## Actividad 7 — Hallazgos

Redactar:

- tres hallazgos;
- dos límites;
- tres recomendaciones.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es Power BI?
2. ¿Qué diferencia hay entre Power BI Desktop y Power BI Service?
3. ¿Para qué sirve Power Query?
4. ¿Qué es un modelo de datos?
5. ¿Qué es una tabla de hechos?
6. ¿Qué es una dimensión?
7. ¿Por qué conviene usar relaciones por ID?
8. ¿Qué es DAX?
9. ¿Qué diferencia hay entre medida y columna calculada?
10. ¿Para qué sirve un segmentador?
11. ¿Qué debe tener un reporte profesional?
12. ¿Qué cuidados hay que tener antes de compartir un reporte?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Reporte Básico en Power BI**.

Debe incluir:

1. fuente de datos;
2. transformaciones en Power Query;
3. modelo con relaciones;
4. medidas DAX básicas;
5. tarjetas KPI;
6. gráficos;
7. segmentadores;
8. tabla de detalle;
9. diseño ordenado;
10. hallazgos;
11. límites del análisis;
12. recomendaciones.

---

# Glosario básico

Power BI: plataforma de inteligencia de negocio para transformar datos en reportes visuales.

Power BI Desktop: aplicación de escritorio para crear reportes.

Power BI Service: plataforma online para publicar y compartir reportes.

PBIX: archivo de Power BI Desktop.

Power Query: herramienta para importar y transformar datos.

Modelo de datos: estructura de tablas, relaciones, columnas y medidas.

Tabla de hechos: tabla con eventos o transacciones.

Dimensión: tabla descriptiva usada para filtrar o agrupar.

Relación: conexión entre tablas mediante campos comunes.

DAX: lenguaje de fórmulas de Power BI.

Medida: cálculo dinámico que responde a filtros.

Columna calculada: columna creada a partir de una fórmula fila por fila.

Segmentador: filtro visual interactivo.

KPI: indicador clave de desempeño.

Dashboard: vista resumida de indicadores y visualizaciones.

Reporte: conjunto de páginas con visualizaciones interactivas.

Gateway: componente para actualizar datos locales en el servicio, según configuración.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Reporte Básico en Power BI**.

Ese reporte debe permitir:

- conectar datos;
- limpiarlos;
- modelarlos;
- crear medidas;
- visualizar indicadores;
- filtrar información;
- interpretar resultados;
- comunicar hallazgos;
- cuidar permisos;
- preparar publicación.

El curso termina cuando la persona deja de mirar Power BI como una herramienta de gráficos y empieza a entenderlo como un entorno completo de análisis, modelado y comunicación de datos.

---

# Fuentes recomendadas para profundizar

- Microsoft Learn — Introducción a Power BI.
- Microsoft Learn — Power BI Desktop.
- Microsoft Learn — Power Query.
- Microsoft Learn — Modelado de datos en Power BI.
- Microsoft Learn — DAX básico.
- Microsoft Learn — Visualizaciones en Power BI.
- Microsoft Power BI documentation.
- Materiales introductorios sobre BI, dashboards, modelado dimensional y storytelling con datos.

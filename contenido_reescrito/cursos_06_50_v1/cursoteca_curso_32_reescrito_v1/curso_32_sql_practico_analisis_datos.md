# Curso 32 — SQL Práctico para Análisis de Datos

## Presentación del curso

SQL es uno de los lenguajes más importantes para trabajar con datos. Muchas organizaciones guardan su información en bases de datos: ventas, clientes, productos, pagos, stock, usuarios, reclamos, tickets, cursos, transacciones y registros operativos. Para analizar esa información, no alcanza con abrir una planilla. Muchas veces hay que consultar directamente una base de datos.

SQL significa Structured Query Language. Es un lenguaje diseñado para consultar, filtrar, ordenar, agrupar, combinar y resumir datos almacenados en tablas. Para un analista de datos, SQL es una herramienta fundamental porque permite obtener exactamente la información necesaria desde la fuente, preparar datos para reportes, validar indicadores y responder preguntas de negocio.

Este curso está pensado para principiantes que ya tienen alguna base en planillas, calidad de datos o análisis inicial y quieren aprender SQL desde cero con orientación práctica. No busca formar administradores de bases de datos ni expertos en optimización, sino enseñar el SQL necesario para análisis: SELECT, WHERE, ORDER BY, GROUP BY, funciones agregadas, JOIN, subconsultas simples, limpieza básica y buenas prácticas.

La idea central es:

> SQL permite hacer preguntas precisas a bases de datos y convertir tablas operativas en información útil para analizar.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es SQL y para qué se usa en análisis de datos.
2. Entender tablas, filas, columnas, claves y relaciones.
3. Escribir consultas SELECT básicas.
4. Filtrar datos con WHERE.
5. Ordenar resultados con ORDER BY.
6. Usar funciones agregadas como COUNT, SUM, AVG, MIN y MAX.
7. Agrupar información con GROUP BY.
8. Filtrar grupos con HAVING.
9. Combinar tablas con JOIN.
10. Usar alias y expresiones calculadas.
11. Detectar datos faltantes, duplicados y valores sospechosos.
12. Crear consultas para reportes de ventas, clientes, stock o reclamos.
13. Documentar consultas y evitar errores comunes.
14. Desarrollar un mini análisis de datos con SQL.

---

# Módulo 1 — Qué es SQL

## 1.1 Definición

SQL es un lenguaje estándar para trabajar con bases de datos relacionales. Permite consultar, insertar, actualizar, eliminar y administrar datos. En análisis de datos, se usa principalmente para consultar y transformar información.

Ejemplos de preguntas que SQL puede responder:

- ¿cuántas ventas hubo este mes?
- ¿qué clientes compraron más?
- ¿qué productos tienen bajo stock?
- ¿cuál fue el ticket promedio?
- ¿qué reclamos siguen abiertos?
- ¿qué canal genera más ingresos?
- ¿qué pedidos están pendientes de pago?

## 1.2 Bases de datos relacionales

Una base de datos relacional organiza información en tablas relacionadas entre sí.

Ejemplo:

- tabla clientes;
- tabla ventas;
- tabla productos;
- tabla pagos;
- tabla stock.

Cada tabla contiene filas y columnas.

## 1.3 SQL para análisis

Un analista usa SQL para:

- extraer datos;
- filtrar períodos;
- calcular indicadores;
- unir tablas;
- validar reportes;
- revisar calidad;
- preparar datasets;
- alimentar Power BI, Tableau, Excel o Python.

## 1.4 SQL no es solo para programadores

Muchas personas no técnicas usan SQL:

- analistas de datos;
- analistas comerciales;
- administrativos avanzados;
- perfiles de BI;
- data stewards;
- responsables de reportes;
- equipos de operaciones.

Aprender SQL da autonomía para consultar datos sin depender siempre de exportaciones manuales.

---

# Módulo 2 — Tablas, filas, columnas y claves

## 2.1 Tabla

Una tabla es una estructura que almacena datos sobre un tema.

Ejemplo: tabla `ventas`.

| id_venta | fecha | id_cliente | total |
|---:|---|---:|---:|
| 1 | 2026-06-01 | 101 | 15000 |
| 2 | 2026-06-02 | 102 | 22000 |

## 2.2 Fila

Cada fila representa un registro.

En una tabla de ventas:

- una fila = una venta.

En una tabla de clientes:

- una fila = un cliente.

## 2.3 Columna

Cada columna representa una variable o atributo.

Ejemplos:

- fecha;
- total;
- canal;
- estado;
- nombre;
- ciudad.

## 2.4 Clave primaria

Una clave primaria identifica de forma única cada fila.

Ejemplos:

- `id_cliente`;
- `id_producto`;
- `id_venta`;
- `id_pedido`.

No debería repetirse.

## 2.5 Clave externa

Una clave externa conecta una tabla con otra.

Ejemplo:

La tabla `ventas` tiene `id_cliente`, que se relaciona con la tabla `clientes`.

## 2.6 Por qué importan las claves

Las claves permiten unir tablas sin depender de nombres ambiguos.

Es mejor unir por:

> id_cliente

que por:

> nombre_cliente

porque los nombres pueden repetirse, escribirse diferente o cambiar.

---

# Módulo 3 — Primera consulta SELECT

## 3.1 SELECT

`SELECT` permite elegir columnas.

```sql
SELECT nombre, ciudad
FROM clientes;
```

Esta consulta trae las columnas `nombre` y `ciudad` desde la tabla `clientes`.

## 3.2 Seleccionar todas las columnas

```sql
SELECT *
FROM clientes;
```

El asterisco trae todas las columnas.

Para exploración inicial puede servir, pero en reportes conviene seleccionar solo lo necesario.

## 3.3 FROM

`FROM` indica de qué tabla se obtienen los datos.

```sql
SELECT producto, precio
FROM productos;
```

## 3.4 Alias de columnas

```sql
SELECT
  nombre AS cliente,
  ciudad AS localidad
FROM clientes;
```

Los alias hacen más claro el resultado.

## 3.5 Buenas prácticas

- escribir consultas ordenadas;
- usar saltos de línea;
- seleccionar columnas necesarias;
- usar alias claros;
- evitar `SELECT *` en reportes finales;
- comentar consultas importantes.

---

# Módulo 4 — Filtrar con WHERE

## 4.1 WHERE

`WHERE` filtra filas según una condición.

```sql
SELECT *
FROM ventas
WHERE estado = 'Pagado';
```

## 4.2 Operadores de comparación

- `=` igual;
- `<>` distinto;
- `>` mayor;
- `<` menor;
- `>=` mayor o igual;
- `<=` menor o igual.

Ejemplo:

```sql
SELECT *
FROM ventas
WHERE total > 10000;
```

## 4.3 Filtrar texto

```sql
SELECT *
FROM clientes
WHERE ciudad = 'Santa Fe';
```

## 4.4 Filtrar fechas

```sql
SELECT *
FROM ventas
WHERE fecha >= '2026-06-01';
```

Según el motor de base de datos, el formato de fecha puede variar. Un formato común y claro es `YYYY-MM-DD`.

## 4.5 AND y OR

```sql
SELECT *
FROM ventas
WHERE estado = 'Pagado'
  AND total > 10000;
```

```sql
SELECT *
FROM clientes
WHERE ciudad = 'Santa Fe'
   OR ciudad = 'Paraná';
```

## 4.6 Cuidado con OR

Usar paréntesis cuando hay condiciones combinadas.

```sql
SELECT *
FROM ventas
WHERE estado = 'Pagado'
  AND (canal = 'WhatsApp' OR canal = 'Instagram');
```

---

# Módulo 5 — Ordenar y limitar resultados

## 5.1 ORDER BY

Ordena resultados.

```sql
SELECT *
FROM ventas
ORDER BY fecha DESC;
```

`DESC` ordena descendente.
`ASC` ordena ascendente.

## 5.2 Ordenar por monto

```sql
SELECT *
FROM ventas
ORDER BY total DESC;
```

Sirve para ver las ventas más altas.

## 5.3 Ordenar por varias columnas

```sql
SELECT *
FROM ventas
ORDER BY fecha DESC, total DESC;
```

## 5.4 LIMIT

En algunos motores, `LIMIT` restringe cantidad de filas.

```sql
SELECT *
FROM ventas
ORDER BY total DESC
LIMIT 10;
```

En SQL Server se usa `TOP`.

```sql
SELECT TOP 10 *
FROM ventas
ORDER BY total DESC;
```

## 5.5 Uso analítico

Ordenar permite:

- encontrar mayores ventas;
- revisar últimos pedidos;
- detectar valores extremos;
- priorizar casos;
- explorar datos.

---

# Módulo 6 — Operadores útiles

## 6.1 IN

Filtra varios valores posibles.

```sql
SELECT *
FROM clientes
WHERE ciudad IN ('Santa Fe', 'Paraná', 'Rosario');
```

## 6.2 BETWEEN

Filtra rangos.

```sql
SELECT *
FROM ventas
WHERE total BETWEEN 10000 AND 30000;
```

También puede usarse con fechas.

```sql
SELECT *
FROM ventas
WHERE fecha BETWEEN '2026-06-01' AND '2026-06-30';
```

## 6.3 LIKE

Busca patrones de texto.

```sql
SELECT *
FROM clientes
WHERE nombre LIKE 'Ana%';
```

Esto busca nombres que empiezan con Ana.

## 6.4 IS NULL

Detecta valores faltantes.

```sql
SELECT *
FROM clientes
WHERE telefono IS NULL;
```

## 6.5 IS NOT NULL

```sql
SELECT *
FROM clientes
WHERE telefono IS NOT NULL;
```

## 6.6 NOT

Niega una condición.

```sql
SELECT *
FROM ventas
WHERE estado <> 'Cancelado';
```

O:

```sql
SELECT *
FROM ventas
WHERE NOT estado = 'Cancelado';
```

---

# Módulo 7 — Funciones agregadas

## 7.1 COUNT

Cuenta registros.

```sql
SELECT COUNT(*) AS cantidad_ventas
FROM ventas;
```

## 7.2 SUM

Suma valores.

```sql
SELECT SUM(total) AS ventas_totales
FROM ventas
WHERE estado = 'Pagado';
```

## 7.3 AVG

Calcula promedio.

```sql
SELECT AVG(total) AS ticket_promedio
FROM ventas
WHERE estado = 'Pagado';
```

## 7.4 MIN y MAX

```sql
SELECT
  MIN(total) AS venta_minima,
  MAX(total) AS venta_maxima
FROM ventas;
```

## 7.5 COUNT DISTINCT

Cuenta valores únicos.

```sql
SELECT COUNT(DISTINCT id_cliente) AS clientes_unicos
FROM ventas;
```

## 7.6 Cuidado con NULL

Algunas funciones ignoran valores NULL. Es importante entender si hay datos faltantes antes de interpretar resultados.

---

# Módulo 8 — Agrupar con GROUP BY

## 8.1 Qué hace GROUP BY

`GROUP BY` agrupa filas para calcular métricas por categoría.

Ejemplo:

```sql
SELECT
  canal,
  SUM(total) AS ventas_totales
FROM ventas
GROUP BY canal;
```

## 8.2 Ventas por producto

```sql
SELECT
  id_producto,
  SUM(total) AS ventas_totales
FROM ventas
GROUP BY id_producto
ORDER BY ventas_totales DESC;
```

## 8.3 Cantidad de pedidos por estado

```sql
SELECT
  estado,
  COUNT(*) AS cantidad
FROM ventas
GROUP BY estado;
```

## 8.4 Agrupar por varias columnas

```sql
SELECT
  canal,
  estado,
  COUNT(*) AS pedidos
FROM ventas
GROUP BY canal, estado;
```

## 8.5 Error común

Si una columna aparece en SELECT y no está agregada con SUM, COUNT, AVG, MIN o MAX, normalmente debe aparecer en GROUP BY.

Incorrecto:

```sql
SELECT canal, estado, SUM(total)
FROM ventas
GROUP BY canal;
```

Correcto:

```sql
SELECT canal, estado, SUM(total)
FROM ventas
GROUP BY canal, estado;
```

---

# Módulo 9 — Filtrar grupos con HAVING

## 9.1 Diferencia entre WHERE y HAVING

`WHERE` filtra filas antes de agrupar.
`HAVING` filtra grupos después de agrupar.

## 9.2 Ejemplo

Canales con ventas mayores a 100000:

```sql
SELECT
  canal,
  SUM(total) AS ventas_totales
FROM ventas
GROUP BY canal
HAVING SUM(total) > 100000;
```

## 9.3 Otro ejemplo

Productos con más de 10 ventas:

```sql
SELECT
  id_producto,
  COUNT(*) AS cantidad_ventas
FROM ventas
GROUP BY id_producto
HAVING COUNT(*) > 10;
```

## 9.4 WHERE y HAVING juntos

```sql
SELECT
  canal,
  SUM(total) AS ventas_totales
FROM ventas
WHERE estado = 'Pagado'
GROUP BY canal
HAVING SUM(total) > 100000;
```

Primero filtra ventas pagadas, luego agrupa, luego filtra grupos.

## 9.5 Uso analítico

HAVING permite detectar:

- productos importantes;
- clientes frecuentes;
- canales fuertes;
- categorías con muchos reclamos;
- zonas con alto volumen.

---

# Módulo 10 — JOIN: combinar tablas

## 10.1 Por qué usar JOIN

Los datos suelen estar separados en varias tablas.

Ejemplo:

Ventas contiene:

- id_producto;
- id_cliente;
- total.

Productos contiene:

- id_producto;
- nombre_producto;
- categoría.

Clientes contiene:

- id_cliente;
- nombre;
- ciudad.

Para analizar ventas por categoría o ciudad, hay que unir tablas.

## 10.2 INNER JOIN

Trae registros que tienen coincidencia en ambas tablas.

```sql
SELECT
  v.id_venta,
  v.fecha,
  p.nombre_producto,
  p.categoria,
  v.total
FROM ventas v
INNER JOIN productos p
  ON v.id_producto = p.id_producto;
```

## 10.3 LEFT JOIN

Trae todos los registros de la tabla izquierda y los datos coincidentes de la derecha.

```sql
SELECT
  v.id_venta,
  v.fecha,
  p.nombre_producto,
  v.total
FROM ventas v
LEFT JOIN productos p
  ON v.id_producto = p.id_producto;
```

Si no hay producto coincidente, los campos de productos quedan NULL.

## 10.4 Alias de tablas

Usar alias mejora legibilidad:

- `v` para ventas;
- `p` para productos;
- `c` para clientes.

## 10.5 Error frecuente

Un JOIN mal hecho puede duplicar datos.

Causas:

- claves duplicadas;
- unión por campo incorrecto;
- relación muchos a muchos;
- falta de condición ON.

Siempre revisar conteos antes y después de un JOIN.

---

# Módulo 11 — Consultas con varias tablas

## 11.1 Ventas por categoría

```sql
SELECT
  p.categoria,
  SUM(v.total) AS ventas_totales
FROM ventas v
INNER JOIN productos p
  ON v.id_producto = p.id_producto
WHERE v.estado = 'Pagado'
GROUP BY p.categoria
ORDER BY ventas_totales DESC;
```

## 11.2 Ventas por ciudad del cliente

```sql
SELECT
  c.ciudad,
  SUM(v.total) AS ventas_totales
FROM ventas v
INNER JOIN clientes c
  ON v.id_cliente = c.id_cliente
GROUP BY c.ciudad
ORDER BY ventas_totales DESC;
```

## 11.3 Clientes frecuentes

```sql
SELECT
  c.id_cliente,
  c.nombre,
  COUNT(v.id_venta) AS cantidad_compras,
  SUM(v.total) AS total_comprado
FROM clientes c
INNER JOIN ventas v
  ON c.id_cliente = v.id_cliente
GROUP BY c.id_cliente, c.nombre
HAVING COUNT(v.id_venta) >= 3
ORDER BY total_comprado DESC;
```

## 11.4 Productos sin ventas

```sql
SELECT
  p.id_producto,
  p.nombre_producto
FROM productos p
LEFT JOIN ventas v
  ON p.id_producto = v.id_producto
WHERE v.id_venta IS NULL;
```

## 11.5 Clientes sin compras

```sql
SELECT
  c.id_cliente,
  c.nombre
FROM clientes c
LEFT JOIN ventas v
  ON c.id_cliente = v.id_cliente
WHERE v.id_venta IS NULL;
```

---

# Módulo 12 — Expresiones calculadas y CASE

## 12.1 Columnas calculadas en consulta

```sql
SELECT
  cantidad,
  precio,
  cantidad * precio AS total_calculado
FROM ventas;
```

## 12.2 CASE

`CASE` permite clasificar valores.

```sql
SELECT
  id_venta,
  total,
  CASE
    WHEN total >= 50000 THEN 'Alta'
    WHEN total >= 20000 THEN 'Media'
    ELSE 'Baja'
  END AS categoria_venta
FROM ventas;
```

## 12.3 Clasificar estados

```sql
SELECT
  id_pedido,
  estado,
  CASE
    WHEN estado IN ('Pagado', 'Entregado') THEN 'OK'
    WHEN estado = 'Pendiente' THEN 'Revisar'
    ELSE 'Otro'
  END AS estado_analisis
FROM pedidos;
```

## 12.4 CASE con agregaciones

```sql
SELECT
  canal,
  SUM(CASE WHEN estado = 'Pagado' THEN total ELSE 0 END) AS ventas_pagadas
FROM ventas
GROUP BY canal;
```

## 12.5 Uso analítico

CASE sirve para:

- crear segmentos;
- clasificar ventas;
- marcar riesgos;
- agrupar estados;
- calcular métricas condicionadas;
- preparar reportes.

---

# Módulo 13 — Calidad de datos con SQL

## 13.1 Detectar faltantes

```sql
SELECT *
FROM clientes
WHERE telefono IS NULL;
```

## 13.2 Contar faltantes

```sql
SELECT COUNT(*) AS clientes_sin_telefono
FROM clientes
WHERE telefono IS NULL;
```

## 13.3 Detectar duplicados

```sql
SELECT
  email,
  COUNT(*) AS cantidad
FROM clientes
GROUP BY email
HAVING COUNT(*) > 1;
```

## 13.4 Valores fuera de rango

```sql
SELECT *
FROM ventas
WHERE total <= 0;
```

## 13.5 Categorías inconsistentes

```sql
SELECT
  canal,
  COUNT(*) AS cantidad
FROM ventas
GROUP BY canal
ORDER BY canal;
```

Esto permite ver variantes como:

- WhatsApp;
- Wsp;
- whatsapp;
- WPP.

## 13.6 Fechas sospechosas

```sql
SELECT *
FROM ventas
WHERE fecha > CURRENT_DATE;
```

Según el motor SQL, la función de fecha actual puede variar.

## 13.7 Registros huérfanos

Ventas con producto inexistente:

```sql
SELECT v.*
FROM ventas v
LEFT JOIN productos p
  ON v.id_producto = p.id_producto
WHERE p.id_producto IS NULL;
```

---

# Módulo 14 — Subconsultas simples

## 14.1 Qué es una subconsulta

Una subconsulta es una consulta dentro de otra.

Ejemplo:

Ventas mayores al promedio:

```sql
SELECT *
FROM ventas
WHERE total > (
  SELECT AVG(total)
  FROM ventas
);
```

## 14.2 IN con subconsulta

Clientes que compraron:

```sql
SELECT *
FROM clientes
WHERE id_cliente IN (
  SELECT DISTINCT id_cliente
  FROM ventas
);
```

## 14.3 NOT IN

Clientes sin compras:

```sql
SELECT *
FROM clientes
WHERE id_cliente NOT IN (
  SELECT DISTINCT id_cliente
  FROM ventas
);
```

Cuidado: `NOT IN` puede comportarse de forma inesperada si hay NULL. En muchos casos, LEFT JOIN es más claro.

## 14.4 Subconsulta en FROM

```sql
SELECT
  canal,
  AVG(ventas_totales) AS promedio_por_canal
FROM (
  SELECT
    canal,
    fecha,
    SUM(total) AS ventas_totales
  FROM ventas
  GROUP BY canal, fecha
) resumen_diario
GROUP BY canal;
```

## 14.5 Uso

Las subconsultas sirven para:

- comparar contra promedios;
- filtrar por conjuntos;
- crear tablas temporales lógicas;
- preparar resúmenes intermedios.

---

# Módulo 15 — CTE: consultas organizadas

## 15.1 Qué es una CTE

Una CTE, Common Table Expression, permite definir una consulta temporal con `WITH`.

Ayuda a ordenar consultas complejas.

```sql
WITH ventas_pagadas AS (
  SELECT *
  FROM ventas
  WHERE estado = 'Pagado'
)
SELECT
  canal,
  SUM(total) AS ventas_totales
FROM ventas_pagadas
GROUP BY canal;
```

## 15.2 Por qué usar CTE

Ventajas:

- mejora lectura;
- evita repetir lógica;
- separa pasos;
- facilita depuración;
- documenta intención.

## 15.3 Ejemplo con calidad

```sql
WITH ventas_limpias AS (
  SELECT *
  FROM ventas
  WHERE total > 0
    AND fecha IS NOT NULL
)
SELECT
  canal,
  COUNT(*) AS pedidos,
  SUM(total) AS ventas_totales
FROM ventas_limpias
GROUP BY canal;
```

## 15.4 Varias CTE

```sql
WITH ventas_pagadas AS (
  SELECT *
  FROM ventas
  WHERE estado = 'Pagado'
),
resumen_canal AS (
  SELECT
    canal,
    SUM(total) AS ventas_totales
  FROM ventas_pagadas
  GROUP BY canal
)
SELECT *
FROM resumen_canal
ORDER BY ventas_totales DESC;
```

## 15.5 Uso recomendado

Para principiantes, las CTE ayudan a pensar la consulta por etapas.

---

# Módulo 16 — SQL para reportes

## 16.1 Consulta de ventas mensuales

```sql
SELECT
  EXTRACT(YEAR FROM fecha) AS anio,
  EXTRACT(MONTH FROM fecha) AS mes,
  SUM(total) AS ventas_totales,
  COUNT(*) AS pedidos
FROM ventas
WHERE estado = 'Pagado'
GROUP BY anio, mes
ORDER BY anio, mes;
```

La función para extraer año y mes puede variar según el motor SQL.

## 16.2 Reporte por canal

```sql
SELECT
  canal,
  COUNT(*) AS pedidos,
  SUM(total) AS ventas_totales,
  AVG(total) AS ticket_promedio
FROM ventas
WHERE estado = 'Pagado'
GROUP BY canal
ORDER BY ventas_totales DESC;
```

## 16.3 Reporte de stock crítico

```sql
SELECT
  id_producto,
  nombre_producto,
  stock_actual,
  stock_minimo
FROM productos
WHERE stock_actual <= stock_minimo
ORDER BY stock_actual ASC;
```

## 16.4 Reporte de reclamos

```sql
SELECT
  tipo_reclamo,
  estado,
  COUNT(*) AS cantidad
FROM reclamos
GROUP BY tipo_reclamo, estado
ORDER BY cantidad DESC;
```

## 16.5 Exportación

Muchas herramientas permiten exportar resultados a:

- CSV;
- Excel;
- Power BI;
- Tableau;
- Python;
- reportes internos.

---

# Módulo 17 — Buenas prácticas

## 17.1 Formato legible

Consulta difícil:

```sql
SELECT canal,SUM(total) FROM ventas WHERE estado='Pagado' GROUP BY canal;
```

Mejor:

```sql
SELECT
  canal,
  SUM(total) AS ventas_totales
FROM ventas
WHERE estado = 'Pagado'
GROUP BY canal;
```

## 17.2 Comentarios

```sql
-- Ventas pagadas por canal durante junio
SELECT
  canal,
  SUM(total) AS ventas_totales
FROM ventas
WHERE estado = 'Pagado'
  AND fecha BETWEEN '2026-06-01' AND '2026-06-30'
GROUP BY canal;
```

## 17.3 Evitar modificar datos sin saber

Este curso se enfoca en SELECT. Las sentencias UPDATE, DELETE e INSERT deben usarse con mucho cuidado.

Nunca ejecutar cambios en bases productivas sin autorización.

## 17.4 Validar resultados

Antes de confiar:

- revisar conteos;
- comparar con fuente;
- validar filtros;
- revisar JOINs;
- detectar duplicados;
- confirmar período;
- revisar NULLs.

## 17.5 Documentar definiciones

Guardar:

- consulta;
- objetivo;
- fuente;
- período;
- filtros;
- definición de métricas;
- autor;
- fecha.

---

# Módulo 18 — Diferencias entre motores SQL

## 18.1 SQL estándar y variantes

SQL tiene una base común, pero cada motor puede tener diferencias.

Motores frecuentes:

- PostgreSQL;
- MySQL;
- SQL Server;
- SQLite;
- BigQuery;
- Snowflake;
- Oracle;
- DuckDB.

## 18.2 Diferencias comunes

- manejo de fechas;
- funciones de texto;
- límites de resultados;
- comillas;
- tipos de datos;
- funciones estadísticas;
- sintaxis de paginación.

## 18.3 Ejemplo LIMIT vs TOP

PostgreSQL/MySQL/SQLite:

```sql
SELECT *
FROM ventas
LIMIT 10;
```

SQL Server:

```sql
SELECT TOP 10 *
FROM ventas;
```

## 18.4 Fechas

Algunas funciones cambian:

- `EXTRACT`;
- `DATEPART`;
- `strftime`;
- `FORMAT_DATE`.

Conviene revisar documentación del motor usado.

## 18.5 Principio práctico

Aprender la lógica de SQL es más importante que memorizar una variante exacta. Luego se adapta la sintaxis al motor.

---

# Módulo 19 — Mini proyecto final

## 19.1 Objetivo

Crear un mini análisis con SQL sobre una base de datos simple.

Tema posible:

- ventas;
- clientes;
- productos;
- stock;
- reclamos;
- asistencia;
- tickets de soporte;
- cursos.

## 19.2 Tablas mínimas

Ejemplo comercial:

- clientes;
- productos;
- ventas.

## 19.3 Preguntas

Responder al menos:

1. ¿cuántas ventas hubo?
2. ¿cuánto se vendió?
3. ¿qué canal vendió más?
4. ¿qué producto vendió más?
5. ¿qué clientes compraron más?
6. ¿hay datos faltantes?
7. ¿hay productos sin ventas?
8. ¿qué pedidos están pendientes?

## 19.4 Consultas requeridas

El proyecto debe incluir:

- SELECT básico;
- WHERE;
- ORDER BY;
- GROUP BY;
- HAVING;
- JOIN;
- CASE;
- detección de calidad;
- consulta final de reporte.

## 19.5 Entregable

Documento con:

- objetivo;
- esquema de tablas;
- consultas;
- resultados esperados;
- hallazgos;
- límites;
- recomendaciones.

---

# Caso práctico integrador

## Caso: análisis de ventas de una tienda

Tablas:

`clientes`

| id_cliente | nombre | ciudad |
|---:|---|---|

`productos`

| id_producto | nombre_producto | categoria | precio |
|---:|---|---|---:|

`ventas`

| id_venta | fecha | id_cliente | id_producto | canal | cantidad | total | estado |
|---:|---|---:|---:|---|---:|---:|---|

### Consulta 1 — Ventas pagadas por canal

```sql
SELECT
  canal,
  COUNT(*) AS pedidos,
  SUM(total) AS ventas_totales,
  AVG(total) AS ticket_promedio
FROM ventas
WHERE estado = 'Pagado'
GROUP BY canal
ORDER BY ventas_totales DESC;
```

### Consulta 2 — Ventas por categoría

```sql
SELECT
  p.categoria,
  SUM(v.total) AS ventas_totales
FROM ventas v
INNER JOIN productos p
  ON v.id_producto = p.id_producto
WHERE v.estado = 'Pagado'
GROUP BY p.categoria
ORDER BY ventas_totales DESC;
```

### Consulta 3 — Clientes frecuentes

```sql
SELECT
  c.nombre,
  c.ciudad,
  COUNT(v.id_venta) AS compras,
  SUM(v.total) AS total_comprado
FROM clientes c
INNER JOIN ventas v
  ON c.id_cliente = v.id_cliente
WHERE v.estado = 'Pagado'
GROUP BY c.nombre, c.ciudad
HAVING COUNT(v.id_venta) >= 2
ORDER BY total_comprado DESC;
```

### Consulta 4 — Calidad de datos

```sql
SELECT *
FROM ventas
WHERE fecha IS NULL
   OR total <= 0
   OR canal IS NULL
   OR estado IS NULL;
```

### Interpretación

El análisis permite identificar:

- canal principal;
- categoría más fuerte;
- clientes frecuentes;
- registros que requieren revisión.

---

# Actividades del curso

## Actividad 1 — SELECT básico

Escribir consultas para traer columnas específicas de una tabla.

## Actividad 2 — Filtros

Crear consultas con:

- igualdad;
- mayor que;
- rango de fechas;
- IN;
- LIKE;
- IS NULL.

## Actividad 3 — Agregaciones

Calcular:

- cantidad de registros;
- suma;
- promedio;
- mínimo;
- máximo.

## Actividad 4 — GROUP BY

Crear resúmenes por:

- categoría;
- canal;
- estado;
- ciudad;
- mes.

## Actividad 5 — HAVING

Filtrar grupos con más de cierto volumen.

## Actividad 6 — JOIN

Unir dos o tres tablas usando claves.

## Actividad 7 — CASE

Crear una clasificación de ventas, clientes o pedidos.

## Actividad 8 — Calidad

Detectar:

- faltantes;
- duplicados;
- valores inválidos;
- registros huérfanos.

## Actividad 9 — Reporte

Crear una consulta final para un reporte.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es SQL?
2. ¿Qué es una tabla?
3. ¿Qué diferencia hay entre fila y columna?
4. ¿Qué es una clave primaria?
5. ¿Para qué sirve WHERE?
6. ¿Qué hace GROUP BY?
7. ¿Cuál es la diferencia entre WHERE y HAVING?
8. ¿Para qué sirve un JOIN?
9. ¿Qué diferencia hay entre INNER JOIN y LEFT JOIN?
10. ¿Para qué sirve CASE?
11. ¿Cómo se detectan duplicados con SQL?
12. ¿Por qué hay que validar resultados después de un JOIN?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Mini Análisis con SQL**.

Debe incluir:

1. descripción del caso;
2. esquema de tablas;
3. consultas SELECT;
4. filtros;
5. agregaciones;
6. agrupaciones;
7. joins;
8. consultas de calidad;
9. clasificación con CASE;
10. consulta final de reporte;
11. hallazgos;
12. recomendaciones.

---

# Glosario básico

SQL: lenguaje estructurado para consultar y gestionar bases de datos relacionales.

Base de datos: conjunto organizado de datos.

Tabla: estructura con filas y columnas.

Fila: registro individual.

Columna: atributo o variable.

Clave primaria: campo que identifica de forma única una fila.

Clave externa: campo que conecta una tabla con otra.

SELECT: instrucción para consultar datos.

FROM: indica la tabla de origen.

WHERE: filtra filas.

ORDER BY: ordena resultados.

GROUP BY: agrupa registros.

HAVING: filtra grupos.

JOIN: combina tablas.

INNER JOIN: trae coincidencias entre tablas.

LEFT JOIN: trae todos los registros de la tabla izquierda y coincidencias de la derecha.

NULL: valor faltante o desconocido.

COUNT: cuenta registros.

SUM: suma valores.

AVG: calcula promedio.

CASE: crea lógica condicional.

CTE: expresión de tabla común definida con WITH.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Mini Análisis con SQL**.

Ese producto debe permitir:

- consultar datos;
- filtrar registros;
- ordenar resultados;
- calcular métricas;
- agrupar información;
- unir tablas;
- detectar errores;
- preparar reportes;
- documentar consultas;
- comunicar hallazgos.

El curso termina cuando la persona deja de depender solo de exportaciones manuales y empieza a consultar datos directamente con criterio analítico.

---

# Fuentes recomendadas para profundizar

- PostgreSQL Documentation — SQL basics.
- MySQL Documentation — SELECT, JOIN and GROUP BY.
- Microsoft Learn — Query data with T-SQL.
- SQLite Documentation — SQL language.
- W3Schools SQL Tutorial.
- Mode SQL Tutorial.
- Khan Academy — Intro to SQL.
- Materiales introductorios sobre bases relacionales, modelado, joins y análisis con SQL.

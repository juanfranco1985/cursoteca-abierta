# Curso 18 — Excel y Google Sheets desde Cero

## Presentación del curso

Excel y Google Sheets son dos de las herramientas más importantes para estudiar, trabajar, administrar un emprendimiento, organizar información y tomar decisiones. Aunque muchas personas las usan de manera básica, pocas aprovechan realmente su potencial: ordenar datos, calcular automáticamente, filtrar información, crear gráficos, controlar gastos, registrar ventas, hacer presupuestos, analizar listas, preparar reportes y compartir archivos con otras personas.

Este curso está pensado para personas que comienzan desde cero o que ya usaron planillas de forma intuitiva pero necesitan una base ordenada. No requiere conocimientos previos. El objetivo no es memorizar botones, sino entender cómo funciona una planilla y cómo usarla para resolver problemas reales.

Excel y Google Sheets se parecen en muchos conceptos: celdas, filas, columnas, fórmulas, funciones, filtros, gráficos y tablas. También tienen diferencias: Excel suele ser más potente para análisis avanzado, modelos grandes y trabajo offline; Google Sheets destaca por colaboración en línea, facilidad para compartir y conexión con formularios y otras herramientas web.

La idea central es:

> Una planilla no es una hoja para “poner datos”. Es una herramienta para ordenar información, calcular, detectar errores y tomar mejores decisiones.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es una hoja de cálculo.
2. Diferenciar libro, hoja, fila, columna, celda, rango y tabla.
3. Cargar datos de manera ordenada.
4. Aplicar formatos básicos sin dañar la estructura.
5. Usar fórmulas simples con suma, resta, multiplicación y división.
6. Aplicar funciones básicas como SUMA, PROMEDIO, MIN, MAX y CONTAR.
7. Usar referencias relativas y absolutas.
8. Ordenar y filtrar información.
9. Crear gráficos simples.
10. Usar validación de datos y listas desplegables.
11. Limpiar errores frecuentes.
12. Crear una planilla funcional para un caso real.
13. Compartir archivos de forma segura.
14. Construir un informe básico con datos organizados.

---

# Módulo 1 — Qué es una hoja de cálculo

## 1.1 Definición

Una hoja de cálculo es una herramienta digital organizada en filas y columnas. Cada cruce entre una fila y una columna forma una celda. En esas celdas se pueden escribir datos, textos, números, fechas, fórmulas o funciones.

Una hoja de cálculo permite:

- organizar información;
- hacer cálculos;
- comparar datos;
- buscar valores;
- crear gráficos;
- registrar movimientos;
- controlar gastos;
- analizar ventas;
- hacer listados;
- preparar reportes.

## 1.2 Excel y Google Sheets

Excel es parte del ecosistema Microsoft. Puede usarse en escritorio, web y dispositivos móviles. Es muy fuerte para análisis, modelos grandes, tablas dinámicas, Power Query, gráficos, automatización y trabajo empresarial.

Google Sheets es parte de Google Workspace. Funciona principalmente en la nube, permite colaboración en tiempo real, integración con Google Forms, Drive y otros servicios, y es muy útil para equipos pequeños, educación y trabajo compartido.

Ambas herramientas comparten principios básicos. Aprender una ayuda a entender la otra.

## 1.3 Libro, hoja y celda

En Excel, el archivo completo se llama libro. Dentro del libro puede haber varias hojas.

En Google Sheets, el archivo también puede contener varias hojas o pestañas.

Elementos principales:

- Libro o archivo: documento completo.
- Hoja: pestaña dentro del archivo.
- Fila: línea horizontal numerada.
- Columna: línea vertical identificada con letras.
- Celda: cruce entre fila y columna.
- Rango: conjunto de celdas.

Ejemplo:

- A1 es la celda ubicada en columna A, fila 1.
- A1:C10 es un rango desde A1 hasta C10.

## 1.4 Para qué sirve una planilla

Casos cotidianos:

- presupuesto familiar;
- control de gastos;
- lista de clientes;
- registro de ventas;
- inventario;
- asistencia;
- cronograma;
- seguimiento de tareas;
- notas de estudiantes;
- cálculo de precios;
- comparación de productos;
- organización de turnos.

Una buena planilla reduce memoria manual y mejora el orden.

---

# Módulo 2 — Estructura correcta de datos

## 2.1 La importancia del orden

Una planilla desordenada puede verse “linda”, pero ser difícil de filtrar, calcular o analizar.

Una planilla profesional debe tener:

- una fila de encabezados;
- una columna por variable;
- una fila por registro;
- datos consistentes;
- sin celdas combinadas en tablas de datos;
- sin títulos mezclados con registros;
- formatos coherentes.

## 2.2 Encabezados

Los encabezados son los nombres de las columnas.

Ejemplo:

| Fecha | Cliente | Producto | Cantidad | Precio unitario | Total | Estado |
|---|---|---|---:|---:|---:|---|

Los encabezados deben ser claros y únicos.

Evitar encabezados como:

- dato 1;
- cosa;
- info;
- total total;
- varios;
- sin nombre.

## 2.3 Una fila, un registro

Cada fila debe representar una unidad de información.

Ejemplo en ventas:

- una fila = una venta;
- una columna = un dato de esa venta.

Correcto:

| Fecha | Cliente | Producto | Cantidad |
|---|---|---|---:|
| 05/06/2026 | Ana | Cuaderno | 2 |

Incorrecto:

- poner varios productos en una sola celda;
- escribir comentarios largos mezclados;
- separar datos con guiones sin estructura;
- usar colores como único significado.

## 2.4 Errores comunes de estructura

Errores frecuentes:

- celdas combinadas;
- filas vacías dentro de la tabla;
- totales intermedios mezclados;
- fechas escritas como texto;
- números con símbolos dentro de la celda;
- columnas duplicadas;
- datos de distinto tipo en la misma columna;
- usar color en vez de categoría;
- no tener encabezados.

---

# Módulo 3 — Carga y formato básico

## 3.1 Tipos de datos

Una celda puede contener:

- texto;
- número;
- fecha;
- hora;
- porcentaje;
- moneda;
- fórmula;
- valor lógico;
- error.

Es importante que la planilla reconozca correctamente el tipo de dato.

Ejemplo:

- 1000 como número permite calcular.
- “mil pesos” como texto no permite sumar correctamente.

## 3.2 Formato no es dato

El formato cambia cómo se ve la información, no necesariamente su valor.

Ejemplo:

- escribir 0,15 y darle formato porcentaje muestra 15%.
- escribir “15% de descuento” es texto.

Para calcular bien, conviene separar datos:

| Producto | Descuento |
|---|---:|
| Remera | 15% |

No mezclar texto y número si luego habrá cálculos.

## 3.3 Formatos útiles

Formatos básicos:

- negrita para encabezados;
- moneda;
- fecha;
- porcentaje;
- alineación;
- bordes suaves;
- color moderado;
- formato condicional;
- ancho de columnas.

El formato debe ayudar a leer, no decorar en exceso.

## 3.4 Congelar filas y columnas

Congelar la fila de encabezados permite ver los nombres de columnas mientras se baja por una tabla grande.

Es útil en:

- ventas;
- inventarios;
- asistencia;
- bases de clientes;
- reportes.

## 3.5 Ajustar texto

Cuando una celda tiene texto largo, se puede ajustar texto para verlo dentro de la celda sin ampliar demasiado la columna.

Útil para:

- observaciones;
- descripciones;
- notas;
- comentarios.

---

# Módulo 4 — Fórmulas básicas

## 4.1 Qué es una fórmula

Una fórmula es una instrucción que calcula un resultado.

En Excel y Google Sheets, las fórmulas comienzan con el signo igual:

> =A1+B1

Ejemplos:

- `=A1+B1`
- `=C2-D2`
- `=A2*B2`
- `=D2/E2`

## 4.2 Operadores básicos

Operadores:

- suma: `+`
- resta: `-`
- multiplicación: `*`
- división: `/`
- potencia: `^`

Ejemplo:

| Cantidad | Precio | Total |
|---:|---:|---:|
| 3 | 500 | =A2*B2 |

## 4.3 Orden de operaciones

La planilla respeta un orden:

1. paréntesis;
2. potencias;
3. multiplicación y división;
4. suma y resta.

Ejemplo:

`=10+5*2` da 20.

`=(10+5)*2` da 30.

Los paréntesis evitan confusión.

## 4.4 Copiar fórmulas

Una ventaja de las planillas es copiar fórmulas hacia abajo.

Si en C2 está:

> =A2*B2

Al copiar a C3, se transforma en:

> =A3*B3

Esto sucede por referencias relativas.

---

# Módulo 5 — Funciones básicas

## 5.1 Qué es una función

Una función es una fórmula predefinida que realiza una tarea.

Ejemplos:

- SUMA;
- PROMEDIO;
- MIN;
- MAX;
- CONTAR;
- CONTARA;
- SI.

Las funciones ahorran tiempo y reducen errores.

## 5.2 SUMA

Suma valores.

Ejemplo:

> =SUMA(B2:B10)

Sirve para:

- ventas totales;
- gastos;
- cantidades;
- horas;
- unidades.

## 5.3 PROMEDIO

Calcula el promedio.

Ejemplo:

> =PROMEDIO(C2:C20)

Sirve para:

- promedio de notas;
- ticket promedio;
- gasto promedio;
- rendimiento promedio.

## 5.4 MIN y MAX

`MIN` devuelve el valor más bajo.

`MAX` devuelve el valor más alto.

Ejemplos:

> =MIN(D2:D50)

> =MAX(D2:D50)

Sirve para detectar:

- menor precio;
- mayor venta;
- menor stock;
- máxima calificación.

## 5.5 CONTAR y CONTARA

`CONTAR` cuenta celdas con números.

`CONTARA` cuenta celdas no vacías.

Ejemplo:

> =CONTARA(A2:A100)

Sirve para saber cuántos registros hay cargados.

---

# Módulo 6 — Referencias relativas y absolutas

## 6.1 Referencias relativas

Una referencia relativa cambia cuando la fórmula se copia.

Ejemplo:

En C2:

> =A2*B2

Copiada a C3:

> =A3*B3

Esto es útil cuando cada fila tiene su propio cálculo.

## 6.2 Referencias absolutas

Una referencia absoluta queda fija usando `$`.

Ejemplo:

> =$B$1*A2

Si B1 contiene un porcentaje de IVA, la fórmula puede copiarse hacia abajo y seguir usando siempre B1.

## 6.3 Referencias mixtas

Se puede fijar solo columna o solo fila:

- `$A1`: fija columna A;
- `A$1`: fija fila 1.

Esto se usa en tablas más avanzadas.

## 6.4 Caso práctico

Supongamos:

- B1 contiene dólar oficial;
- A2:A20 contiene precios en dólares.

Fórmula:

> =A2*$B$1

Al copiar hacia abajo, cada precio usa la misma cotización de B1.

---

# Módulo 7 — Ordenar y filtrar

## 7.1 Ordenar

Ordenar permite cambiar el orden de las filas según una columna.

Ejemplos:

- ventas de mayor a menor;
- clientes de A a Z;
- fechas más recientes;
- productos por stock;
- precios de menor a mayor.

Antes de ordenar, seleccionar toda la tabla o usar filtros para no desalinear datos.

## 7.2 Filtrar

Filtrar permite mostrar solo registros que cumplen una condición.

Ejemplos:

- ventas de un mes;
- clientes de una ciudad;
- productos sin stock;
- pedidos pendientes;
- gastos de una categoría.

## 7.3 Filtros por texto, número y fecha

Filtros posibles:

- contiene;
- no contiene;
- igual a;
- mayor que;
- menor que;
- entre fechas;
- valores específicos;
- celdas vacías.

## 7.4 Error grave al ordenar

Si se ordena solo una columna y no toda la tabla, los datos se desalinean.

Ejemplo:

- nombres quedan con teléfonos incorrectos;
- productos quedan con precios incorrectos;
- pedidos quedan con clientes equivocados.

Regla:

> Ordenar siempre la tabla completa, no una columna aislada.

---

# Módulo 8 — Tablas y rangos

## 8.1 Qué es una tabla

Una tabla es un rango de datos organizado con encabezados, registros y estructura clara.

Excel tiene una función específica de tabla que permite filtros, formato, referencias estructuradas y expansión automática. Google Sheets trabaja con rangos, filtros, tablas dinámicas y funciones de organización.

## 8.2 Ventajas de trabajar como tabla

- filtros;
- orden;
- referencias claras;
- formato consistente;
- facilidad para gráficos;
- base para tablas dinámicas;
- menor riesgo de errores.

## 8.3 Buenas prácticas

Una tabla debe:

- tener encabezados;
- no tener filas vacías;
- no tener columnas vacías;
- no usar celdas combinadas;
- tener datos consistentes;
- separar datos de cálculos finales;
- no mezclar notas generales dentro del cuerpo.

## 8.4 Tabla de ventas ejemplo

| Fecha | Cliente | Producto | Cantidad | Precio | Total | Estado |
|---|---|---|---:|---:|---:|---|
| 01/06/2026 | Ana | Remera | 2 | 8000 | 16000 | Pagado |
| 02/06/2026 | Luis | Gorra | 1 | 5000 | 5000 | Pendiente |

Fórmula en Total:

> =Cantidad*Precio

---

# Módulo 9 — Gráficos básicos

## 9.1 Para qué sirven los gráficos

Un gráfico transforma datos en una visualización. Ayuda a ver:

- comparaciones;
- tendencias;
- proporciones;
- cambios;
- diferencias;
- evolución.

Un gráfico no reemplaza los datos. Los comunica.

## 9.2 Tipos de gráficos

### Columnas o barras

Sirven para comparar categorías.

Ejemplo:

- ventas por producto;
- gastos por categoría.

### Líneas

Sirven para ver evolución en el tiempo.

Ejemplo:

- ventas por mes;
- asistencia semanal.

### Circular

Sirve para mostrar proporciones, aunque debe usarse con cuidado.

Ejemplo:

- distribución de gastos por categoría.

### Dispersión

Sirve para analizar relación entre dos variables.

Ejemplo:

- precio y cantidad vendida.

## 9.3 Elegir gráfico correcto

Preguntas:

- ¿quiero comparar?
- ¿quiero mostrar evolución?
- ¿quiero mostrar composición?
- ¿quiero mostrar relación?
- ¿el público entenderá rápido?

## 9.4 Errores comunes

- usar demasiados colores;
- gráficos 3D innecesarios;
- títulos poco claros;
- ejes sin nombre;
- mezclar unidades;
- usar circular con muchas categorías;
- ocultar datos importantes;
- exagerar diferencias con escala engañosa.

---

# Módulo 10 — Validación de datos y listas desplegables

## 10.1 Qué es validación de datos

La validación de datos controla qué puede ingresarse en una celda.

Sirve para evitar errores.

Ejemplos:

- solo fechas;
- solo números positivos;
- lista de estados;
- lista de categorías;
- valores entre 1 y 10;
- correo con formato válido.

## 10.2 Listas desplegables

Una lista desplegable permite elegir una opción predefinida.

Ejemplo en estado de pedido:

- Pendiente;
- Pagado;
- Enviado;
- Entregado;
- Cancelado.

Esto evita que alguien escriba:

- pendiente;
- PEND;
- pend.;
- sin pagar;
- falta pago.

La consistencia mejora filtros y análisis.

## 10.3 Categorías

Ejemplo de gastos:

- Alquiler;
- Servicios;
- Insumos;
- Transporte;
- Marketing;
- Sueldos;
- Otros.

Si cada persona escribe distinto, luego no se puede agrupar bien.

## 10.4 Mensajes de error

La validación puede mostrar advertencias cuando un dato no cumple la regla.

Ejemplo:

> Ingresá una fecha válida.

O:

> Seleccioná una categoría de la lista.

---

# Módulo 11 — Errores frecuentes y limpieza básica

## 11.1 Errores de fórmula

Errores comunes:

- `#DIV/0!`: división por cero;
- `#N/A`: valor no encontrado;
- `#VALUE!`: tipo de dato incorrecto;
- `#REF!`: referencia inválida;
- `#NAME?`: nombre de función incorrecto.

No hay que entrar en pánico. Un error indica que la fórmula necesita revisión.

## 11.2 Datos duplicados

Los duplicados pueden alterar conteos, ventas o listas.

Ejemplos:

- cliente repetido;
- producto duplicado;
- pedido cargado dos veces;
- correo repetido.

Antes de borrar, revisar si realmente es duplicado o si son registros distintos.

## 11.3 Espacios y texto mal escrito

Errores:

- “Santa Fe”;
- “Santa  Fe”;
- “santa fe”;
- “Santa Fé”;
- “Sta Fe”.

Para analizar datos, conviene unificar criterios.

## 11.4 Fechas como texto

Una fecha mal cargada puede no ordenarse ni filtrarse correctamente.

Ejemplos problemáticos:

- “5 de junio”;
- “junio 5”;
- “05-06” sin año;
- “ayer”;
- “principios de mes”.

Mejor:

> 05/06/2026

## 11.5 Limpieza básica

Pasos:

1. revisar encabezados;
2. quitar filas vacías;
3. normalizar fechas;
4. corregir categorías;
5. revisar duplicados;
6. verificar números;
7. aplicar filtros;
8. revisar fórmulas;
9. guardar copia antes de cambios grandes.

---

# Módulo 12 — Tablas dinámicas iniciales

## 12.1 Qué es una tabla dinámica

Una tabla dinámica permite resumir un conjunto de datos de forma flexible. Puede calcular totales, conteos, promedios y agrupaciones por categorías.

## 12.2 Para qué sirven

Ejemplos:

- ventas por producto;
- gastos por categoría;
- pedidos por estado;
- clientes por ciudad;
- promedio de notas por curso;
- unidades vendidas por mes.

## 12.3 Estructura mental

Una tabla dinámica responde preguntas.

Ejemplo:

Pregunta:

> ¿Cuánto vendí por producto?

Datos necesarios:

- producto;
- total de venta.

Configuración:

- filas: producto;
- valores: suma de total.

## 12.4 Caso simple

Tabla base:

| Fecha | Producto | Categoría | Total |
|---|---|---|---:|
| 01/06/2026 | Remera | Ropa | 16000 |
| 02/06/2026 | Gorra | Accesorios | 5000 |
| 03/06/2026 | Remera | Ropa | 8000 |

Tabla dinámica:

| Producto | Suma de Total |
|---|---:|
| Remera | 24000 |
| Gorra | 5000 |

## 12.5 Precauciones

La tabla dinámica depende de la calidad de la tabla base.

Si la tabla base tiene:

- fechas mal cargadas;
- categorías duplicadas;
- filas vacías;
- encabezados confusos;
- números como texto;

la tabla dinámica puede dar resultados incorrectos.

---

# Módulo 13 — Colaboración y uso compartido

## 13.1 Compartir archivos

En Google Sheets es común compartir por enlace o por correo. En Excel también se puede compartir mediante OneDrive o SharePoint.

Antes de compartir:

- revisar permisos;
- definir si la persona puede ver, comentar o editar;
- evitar enlaces públicos si hay datos sensibles;
- usar cuentas correctas;
- quitar accesos cuando ya no hagan falta.

## 13.2 Permisos

Tipos frecuentes:

- lector;
- comentarista;
- editor;
- propietario.

No todos necesitan editar.

Regla:

> Dar el permiso mínimo necesario.

## 13.3 Historial de versiones

El historial de versiones permite ver cambios anteriores y, en muchos casos, restaurar una versión previa.

Es útil cuando:

- alguien borra datos;
- se rompe una fórmula;
- se modifica una tabla;
- se necesita revisar quién cambió algo.

## 13.4 Trabajo en equipo

Buenas prácticas:

- definir responsable del archivo;
- proteger fórmulas;
- usar comentarios;
- no modificar estructura sin avisar;
- evitar duplicados de archivo;
- acordar nombres de columnas;
- documentar reglas;
- usar una hoja de instrucciones.

---

# Módulo 14 — Primer informe con planillas

## 14.1 Qué es un informe básico

Un informe convierte datos en información útil.

Debe responder:

- qué pasó;
- cuánto pasó;
- cuándo pasó;
- dónde pasó;
- qué cambió;
- qué conviene revisar.

## 14.2 Estructura simple

Un informe puede incluir:

1. título;
2. período;
3. resumen ejecutivo;
4. tabla principal;
5. indicadores;
6. gráfico;
7. observaciones;
8. próximos pasos.

## 14.3 Indicadores simples

Ejemplos para ventas:

- ventas totales;
- cantidad de pedidos;
- ticket promedio;
- producto más vendido;
- pedidos pendientes;
- porcentaje de pagos completados.

Ejemplos para gastos:

- gasto total;
- categoría más alta;
- promedio semanal;
- gastos fijos;
- gastos variables;
- diferencia contra presupuesto.

## 14.4 Narrativa

No alcanza con mostrar números.

Ejemplo pobre:

> Ventas: $500.000.

Ejemplo mejor:

> En junio se registraron ventas por $500.000. El producto con mayor facturación fue Remera Básica, con el 35% del total. Los pedidos pendientes representan el 12%, por lo que conviene revisar seguimiento de pagos.

---

# Caso práctico integrador

## Caso: control de ventas de un emprendimiento

Un emprendimiento vende productos por WhatsApp e Instagram. Hasta ahora anota pedidos en mensajes y cuadernos. Se pierden datos, no sabe cuánto vendió ni qué productos se venden más.

### Paso 1 — Crear tabla base

Columnas:

- fecha;
- cliente;
- producto;
- categoría;
- cantidad;
- precio unitario;
- total;
- medio de pago;
- estado;
- observaciones.

### Paso 2 — Agregar fórmulas

Total:

> cantidad * precio unitario

Indicadores:

- ventas totales;
- cantidad de pedidos;
- ticket promedio.

### Paso 3 — Validación

Lista desplegable para estado:

- pendiente;
- pagado;
- enviado;
- entregado;
- cancelado.

### Paso 4 — Filtros

Filtrar:

- pedidos pendientes;
- ventas por mes;
- producto específico;
- estado de pago.

### Paso 5 — Gráfico

Crear gráfico de ventas por categoría.

### Paso 6 — Tabla dinámica

Resumir ventas por producto.

### Paso 7 — Informe

Preparar una hoja “Resumen” con indicadores y observaciones.

---

# Actividades del curso

## Actividad 1 — Crear una tabla limpia

Crear una tabla con 20 registros de ventas, gastos, asistencia o tareas.

Debe tener:

- encabezados claros;
- una fila por registro;
- una columna por dato;
- sin celdas combinadas;
- formatos correctos.

## Actividad 2 — Fórmulas básicas

Agregar:

- suma;
- resta;
- multiplicación;
- división;
- total por fila;
- total general.

## Actividad 3 — Funciones

Usar:

- SUMA;
- PROMEDIO;
- MIN;
- MAX;
- CONTARA.

## Actividad 4 — Filtros y orden

Aplicar:

- filtro por categoría;
- orden por fecha;
- orden por monto;
- filtro por estado.

## Actividad 5 — Gráfico

Crear un gráfico que responda una pregunta.

Ejemplo:

> ¿Qué categoría generó más ventas?

## Actividad 6 — Validación

Crear una lista desplegable para una columna de estado o categoría.

## Actividad 7 — Tabla dinámica

Crear una tabla dinámica simple:

- ventas por producto;
- gastos por categoría;
- tareas por estado;
- asistencia por persona.

## Actividad 8 — Informe final

Crear una hoja resumen con:

- tres indicadores;
- un gráfico;
- una observación;
- una recomendación.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es una hoja de cálculo?
2. ¿Qué diferencia hay entre fila, columna, celda y rango?
3. ¿Por qué es importante tener encabezados claros?
4. ¿Qué significa que una fila represente un registro?
5. ¿Cuál es la diferencia entre fórmula y función?
6. ¿Qué hace una referencia absoluta?
7. ¿Por qué puede ser peligroso ordenar una sola columna?
8. ¿Para qué sirve la validación de datos?
9. ¿Qué problema generan las fechas escritas como texto?
10. ¿Para qué sirve una tabla dinámica?
11. ¿Qué cuidados hay que tener al compartir una planilla?
12. ¿Qué debe incluir un informe básico?

## Parte 2 — Producción práctica

El estudiante debe entregar una **Planilla Funcional desde Cero**.

Debe incluir:

1. tabla base limpia;
2. encabezados claros;
3. formatos adecuados;
4. fórmulas básicas;
5. funciones principales;
6. filtros;
7. validación de datos;
8. gráfico;
9. tabla dinámica simple;
10. hoja de resumen con indicadores;
11. observaciones;
12. recomendación final.

---

# Glosario básico

Hoja de cálculo: herramienta digital organizada en filas y columnas para cargar, calcular y analizar datos.

Libro: archivo completo de Excel.

Hoja: pestaña dentro de un libro o archivo de planilla.

Celda: cruce entre fila y columna.

Rango: conjunto de celdas.

Fila: línea horizontal numerada.

Columna: línea vertical identificada con letras.

Encabezado: nombre de una columna.

Registro: fila que representa una unidad de información.

Fórmula: instrucción de cálculo creada por el usuario.

Función: fórmula predefinida.

Referencia relativa: referencia que cambia al copiar una fórmula.

Referencia absoluta: referencia fija usando el signo `$`.

Filtro: herramienta para mostrar solo datos que cumplen una condición.

Ordenar: reorganizar filas según un criterio.

Validación de datos: regla que controla qué puede escribirse en una celda.

Lista desplegable: lista de opciones predefinidas para elegir.

Gráfico: representación visual de datos.

Tabla dinámica: herramienta para resumir y analizar datos agrupados.

Formato condicional: formato que cambia según reglas.

Informe: presentación organizada de datos, indicadores y conclusiones.

---

# Producto final del curso

Al finalizar, el estudiante debe crear una **Planilla Funcional desde Cero**.

Esa planilla debe permitir:

- cargar datos ordenados;
- calcular automáticamente;
- filtrar información;
- reducir errores;
- visualizar datos;
- resumir con tabla dinámica;
- compartir con cuidado;
- generar un informe básico;
- tomar una decisión simple.

El curso termina cuando la persona deja de usar Excel o Google Sheets como una simple cuadrícula y empieza a usarlos como herramientas de trabajo, análisis y organización.

---

# Fuentes recomendadas para profundizar

- Microsoft Excel Help & Learning.
- Microsoft Support — fórmulas y funciones de Excel.
- Microsoft Support — tablas dinámicas en Excel.
- Microsoft Support — gráficos en Excel.
- Microsoft Support — Analyze Data en Excel.
- Google Workspace Learning Center — Google Sheets.
- Google Docs Editors Help — funciones, gráficos y tablas dinámicas en Google Sheets.
- Materiales de alfabetización de datos, análisis básico y productividad con planillas.

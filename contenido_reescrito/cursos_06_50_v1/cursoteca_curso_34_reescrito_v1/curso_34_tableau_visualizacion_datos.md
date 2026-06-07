# Curso 34 — Tableau para Visualización de Datos

## Presentación del curso

Tableau es una de las herramientas más reconocidas para visualización de datos y análisis visual. Permite conectar fuentes de datos, explorar información, crear gráficos interactivos, diseñar dashboards y construir historias visuales que ayuden a comprender problemas, detectar patrones y comunicar hallazgos.

A diferencia de una planilla tradicional, Tableau está pensado para explorar datos visualmente: arrastrar dimensiones y medidas, cambiar tipos de gráficos, filtrar información, crear jerarquías, mapas, dashboards y vistas interactivas. Su fortaleza está en ayudar a ver relaciones, comparaciones, tendencias y excepciones con rapidez.

Este curso está pensado para principiantes que ya tienen nociones básicas de datos, Excel, calidad de datos, estadística o Power BI, y quieren aprender Tableau desde cero. No requiere programación. El foco será práctico y profesional: conectar datos, entender dimensiones y medidas, crear visualizaciones adecuadas, diseñar dashboards claros y comunicar hallazgos con responsabilidad.

La idea central es:

> Tableau no es solo una herramienta para hacer gráficos bonitos. Es un entorno para explorar, interpretar y comunicar datos visualmente.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es Tableau y para qué se utiliza.
2. Diferenciar Tableau Desktop, Tableau Public, Tableau Server y Tableau Cloud.
3. Conectar fuentes simples como Excel, CSV o Google Sheets.
4. Entender dimensiones, medidas, campos discretos y continuos.
5. Crear gráficos básicos: barras, líneas, mapas, tablas y dispersión.
6. Usar filtros, colores, etiquetas, tooltips y segmentaciones.
7. Crear campos calculados simples.
8. Diseñar dashboards interactivos.
9. Construir historias de datos con estructura narrativa.
10. Aplicar buenas prácticas de visualización.
11. Publicar o compartir una visualización de forma responsable.
12. Crear un dashboard final basado en un caso real o ficticio.

---

# Módulo 1 — Qué es Tableau

## 1.1 Definición

Tableau es una plataforma de visualización y análisis de datos. Permite transformar datos en gráficos, dashboards e historias interactivas para facilitar la exploración y la toma de decisiones.

Se utiliza en:

- análisis comercial;
- ventas;
- marketing;
- educación;
- salud;
- finanzas;
- operaciones;
- recursos humanos;
- datos públicos;
- investigación;
- proyectos ciudadanos;
- inteligencia de negocio.

## 1.2 Para qué sirve

Tableau ayuda a responder preguntas como:

- ¿qué categoría vende más?
- ¿cómo evolucionaron las ventas?
- ¿qué zona concentra reclamos?
- ¿qué clientes tienen mayor valor?
- ¿qué producto tiene menor rendimiento?
- ¿qué indicador cambió respecto del período anterior?
- ¿dónde hay valores atípicos?

## 1.3 Diferencia con Excel

Excel es muy flexible para cálculos, planillas y análisis manual.

Tableau está orientado a:

- análisis visual;
- dashboards interactivos;
- exploración rápida;
- filtros visuales;
- mapas;
- conexión a múltiples fuentes;
- publicación de visualizaciones;
- comunicación visual de datos.

## 1.4 Diferencia con Power BI

Power BI y Tableau son herramientas de BI y visualización. Power BI suele estar muy integrado al ecosistema Microsoft. Tableau es especialmente reconocido por su enfoque visual, exploratorio y flexible en la construcción de visualizaciones.

La elección depende de:

- herramientas disponibles;
- costos;
- ecosistema;
- audiencia;
- fuentes de datos;
- necesidad de publicación;
- experiencia del equipo.

---

# Módulo 2 — Ecosistema Tableau

## 2.1 Tableau Desktop

Es la aplicación principal para crear visualizaciones, dashboards y análisis.

Permite:

- conectar datos;
- crear hojas;
- diseñar dashboards;
- crear historias;
- guardar libros de trabajo;
- publicar en servidor o nube.

## 2.2 Tableau Public

Es una versión gratuita orientada a publicar visualizaciones públicas. Es muy útil para aprendizaje, portfolio y datos no sensibles.

Advertencia:

> Lo publicado en Tableau Public queda disponible públicamente. No debe usarse para datos privados, comerciales o personales sensibles.

## 2.3 Tableau Server

Es una plataforma empresarial para alojar, compartir y administrar visualizaciones dentro de una organización.

## 2.4 Tableau Cloud

Es la versión en la nube para publicar, compartir y colaborar sin administrar infraestructura propia.

## 2.5 Tableau Prep

Herramienta orientada a preparar, limpiar y combinar datos antes del análisis.

En este curso se menciona como concepto, pero el foco principal está en Tableau para visualización.

---

# Módulo 3 — Flujo de trabajo en Tableau

## 3.1 Flujo general

Un flujo básico en Tableau incluye:

1. Definir pregunta de análisis.
2. Conectar datos.
3. Revisar campos.
4. Crear hojas de visualización.
5. Aplicar filtros.
6. Crear cálculos simples.
7. Diseñar dashboard.
8. Crear historia si corresponde.
9. Revisar interpretación.
10. Publicar o compartir.

## 3.2 Pregunta antes de gráfico

Antes de crear visualizaciones, responder:

- ¿qué quiero explicar?
- ¿quién verá el dashboard?
- ¿qué decisión debe tomar?
- ¿qué datos tengo?
- ¿qué período cubre?
- ¿qué métricas importan?

## 3.3 Hoja, dashboard e historia

### Hoja

Contiene una visualización individual.

### Dashboard

Combina varias hojas en una vista interactiva.

### Historia

Organiza visualizaciones en secuencia narrativa.

## 3.4 Buen flujo

No conviene empezar diseñando el dashboard final. Primero se exploran visualizaciones, luego se seleccionan las mejores.

## 3.5 Resultado esperado

Una visualización debe ser:

- clara;
- relevante;
- correcta;
- filtrable;
- comprensible;
- orientada a una pregunta.

---

# Módulo 4 — Conexión de datos

## 4.1 Fuentes simples

Para principiantes, las fuentes más comunes son:

- Excel;
- CSV;
- Google Sheets;
- archivos de texto;
- bases simples;
- datos públicos.

## 4.2 Preparar datos antes de conectar

La tabla debe tener:

- encabezados claros;
- una fila por registro;
- una columna por variable;
- fechas correctas;
- números como números;
- categorías consistentes;
- sin celdas combinadas;
- sin subtotales mezclados.

## 4.3 Conexión a Excel

Tableau puede leer hojas o tablas de Excel. Conviene que el archivo esté limpio y con una estructura tabular.

## 4.4 Conexión a CSV

Revisar:

- separador;
- codificación;
- encabezados;
- fechas;
- decimales;
- columnas vacías.

## 4.5 Datos sensibles

Antes de conectar y publicar datos, revisar:

- nombres de personas;
- correos;
- teléfonos;
- DNI;
- direcciones;
- información financiera;
- datos de salud;
- datos comerciales confidenciales.

No publicar información privada en plataformas públicas.

---

# Módulo 5 — Interfaz básica

## 5.1 Panel de datos

Muestra las tablas y campos disponibles.

Los campos se clasifican como:

- dimensiones;
- medidas.

## 5.2 Estantes

Tableau usa estantes como:

- Columns;
- Rows;
- Filters;
- Marks;
- Pages.

Arrastrar campos a estos espacios define la visualización.

## 5.3 Marks Card

La tarjeta de marcas controla:

- color;
- tamaño;
- etiqueta;
- detalle;
- tooltip;
- forma.

## 5.4 Show Me

La opción “Show Me” sugiere tipos de gráficos según los campos seleccionados.

Es útil para aprender, pero no debe reemplazar el criterio de visualización.

## 5.5 Hojas

Cada hoja puede contener una vista específica:

- ventas por mes;
- ventas por categoría;
- mapa por región;
- top productos;
- reclamos por tipo.

---

# Módulo 6 — Dimensiones y medidas

## 6.1 Dimensión

Una dimensión es un campo cualitativo o categórico que sirve para segmentar, agrupar o describir.

Ejemplos:

- producto;
- categoría;
- canal;
- ciudad;
- cliente;
- estado;
- fecha, según uso.

## 6.2 Medida

Una medida es un campo numérico que se puede agregar.

Ejemplos:

- ventas;
- cantidad;
- precio;
- margen;
- reclamos;
- horas;
- asistencia.

## 6.3 Agregación

Tableau puede agregar medidas con:

- suma;
- promedio;
- conteo;
- mínimo;
- máximo;
- mediana, según configuración.

Ejemplo:

Ventas por categoría:

- dimensión: categoría;
- medida: suma de ventas.

## 6.4 Discreto y continuo

Un campo discreto genera categorías separadas.

Un campo continuo genera ejes o escalas.

En Tableau, los campos discretos suelen verse en azul y los continuos en verde.

## 6.5 Error común

Arrastrar campos sin entender si se quiere contar, sumar, promediar o segmentar.

Un mismo dato puede contar historias distintas según la agregación.

---

# Módulo 7 — Primeras visualizaciones

## 7.1 Gráfico de barras

Sirve para comparar categorías.

Ejemplo:

- ventas por producto;
- reclamos por tipo;
- gastos por categoría.

Pasos conceptuales:

1. arrastrar categoría a filas;
2. arrastrar ventas a columnas;
3. ordenar descendente;
4. agregar etiquetas si corresponde.

## 7.2 Gráfico de líneas

Sirve para evolución temporal.

Ejemplo:

- ventas por mes;
- asistencia semanal;
- gastos por trimestre.

Pasos:

1. fecha a columnas;
2. ventas a filas;
3. ajustar nivel de fecha;
4. revisar continuidad.

## 7.3 Tabla de texto

Sirve para detalle y valores exactos.

Ejemplo:

- ventas por producto y canal;
- resumen por mes;
- ranking.

## 7.4 Mapa

Sirve para datos geográficos.

Ejemplo:

- ventas por provincia;
- reclamos por ciudad;
- alumnos por localidad.

Requiere campos geográficos limpios.

## 7.5 Dispersión

Sirve para relación entre dos medidas.

Ejemplo:

- precio y cantidad vendida;
- inversión y ventas;
- tiempo de respuesta y satisfacción.

---

# Módulo 8 — Filtros

## 8.1 Para qué sirven

Los filtros permiten enfocar el análisis.

Ejemplos:

- año;
- mes;
- canal;
- categoría;
- zona;
- estado;
- producto;
- vendedor.

## 8.2 Filtro de dimensión

Ejemplo:

Mostrar solo ventas del canal WhatsApp o Instagram.

## 8.3 Filtro de fecha

Permite analizar períodos:

- días;
- meses;
- años;
- rango personalizado;
- últimos períodos.

## 8.4 Filtro de medida

Ejemplo:

Mostrar productos con ventas mayores a cierto monto.

## 8.5 Mostrar filtro

Tableau permite mostrar controles de filtro en la vista o dashboard.

El usuario puede interactuar con ellos.

## 8.6 Buenas prácticas

- no poner demasiados filtros;
- usar nombres claros;
- revisar que afecten lo correcto;
- evitar filtros ocultos confusos;
- aclarar período;
- probar el dashboard como usuario final.

---

# Módulo 9 — Color, tamaño, etiqueta y tooltip

## 9.1 Color

El color debe tener propósito.

Usos:

- diferenciar categorías;
- resaltar alertas;
- mostrar intensidad;
- marcar positivo/negativo;
- destacar un hallazgo.

Evitar usar muchos colores sin significado.

## 9.2 Tamaño

El tamaño puede representar una medida.

Ejemplo:

- puntos más grandes para mayor venta;
- burbujas por cantidad de clientes.

Usar con cuidado porque las áreas pueden ser difíciles de comparar.

## 9.3 Etiquetas

Las etiquetas muestran valores en el gráfico.

Sirven cuando:

- hay pocos elementos;
- el valor exacto importa;
- se destaca un ranking;
- se necesita lectura rápida.

No saturar.

## 9.4 Tooltips

Los tooltips aparecen al pasar el cursor.

Pueden incluir:

- valor;
- porcentaje;
- categoría;
- explicación;
- detalles adicionales.

Un buen tooltip mejora lectura sin cargar el gráfico.

## 9.5 Detalle

El campo Detail agrega nivel de desagregación sin necesariamente mostrarlo como eje.

---

# Módulo 10 — Campos calculados

## 10.1 Qué es un campo calculado

Un campo calculado es una fórmula creada dentro de Tableau para generar un nuevo dato a partir de campos existentes.

Ejemplos:

- margen;
- porcentaje;
- clasificación;
- año;
- segmento;
- estado de análisis.

## 10.2 Cálculo simple

Ejemplo:

```text
[Ventas] - [Costos]
```

Campo:

> Margen

## 10.3 Clasificación

Ejemplo:

```text
IF [Ventas] >= 50000 THEN "Alta"
ELSEIF [Ventas] >= 20000 THEN "Media"
ELSE "Baja"
END
```

## 10.4 Porcentaje

Ejemplo:

```text
[Margen] / [Ventas]
```

Luego se formatea como porcentaje.

## 10.5 Cuidado

Un cálculo debe tener definición clara.

Preguntas:

- ¿se calcula por fila o agregado?
- ¿qué pasa con valores nulos?
- ¿se usa suma o promedio?
- ¿qué filtros lo afectan?

---

# Módulo 11 — Fechas y análisis temporal

## 11.1 Fechas en Tableau

Tableau permite analizar fechas por:

- año;
- trimestre;
- mes;
- semana;
- día;
- fecha exacta.

## 11.2 Discreto vs continuo en fechas

Una fecha discreta crea categorías separadas.

Una fecha continua crea una línea temporal.

Ejemplo:

Ventas por mes como línea continua permite ver tendencia.

## 11.3 Comparar períodos

Preguntas:

- ¿ventas actuales vs mes anterior?
- ¿evolución por trimestre?
- ¿estacionalidad?
- ¿picos o caídas?
- ¿impacto de una campaña?

## 11.4 Anotar eventos

Agregar contexto:

- promoción;
- cambio de precio;
- feriado;
- quiebre de stock;
- campaña;
- cambio de sistema.

## 11.5 Error común

Interpretar una caída sin revisar calendario, feriados, stock o cambios operativos.

---

# Módulo 12 — Jerarquías y grupos

## 12.1 Jerarquías

Una jerarquía permite navegar niveles.

Ejemplo geográfico:

- país;
- provincia;
- ciudad.

Ejemplo producto:

- categoría;
- subcategoría;
- producto.

## 12.2 Drill down

Permite bajar de nivel de detalle.

Ejemplo:

Ver ventas por categoría y luego abrir productos dentro de esa categoría.

## 12.3 Grupos

Los grupos permiten unir elementos.

Ejemplo:

Agrupar ciudades pequeñas como “Otras”.

## 12.4 Sets

Los sets permiten crear subconjuntos, como:

- top clientes;
- productos prioritarios;
- regiones clave.

## 12.5 Uso práctico

Jerarquías y grupos ayudan a ordenar análisis sin crear gráficos separados para todo.

---

# Módulo 13 — Dashboards en Tableau

## 13.1 Qué es un dashboard

Un dashboard combina varias hojas en una misma vista interactiva.

Sirve para:

- resumir indicadores;
- comparar dimensiones;
- permitir exploración;
- comunicar estado;
- monitorear desempeño.

## 13.2 Componentes

Un dashboard puede incluir:

- título;
- KPIs;
- gráficos;
- filtros;
- leyendas;
- texto explicativo;
- imágenes o logos con moderación;
- notas;
- fecha de actualización.

## 13.3 Diseño

Recomendaciones:

- alinear elementos;
- usar espacio en blanco;
- agrupar visuales relacionados;
- evitar saturación;
- usar títulos interpretativos;
- mantener filtros visibles;
- priorizar lo importante arriba.

## 13.4 Interactividad

Tableau permite acciones como:

- filtrar al hacer clic;
- resaltar;
- navegar;
- usar parámetros;
- mostrar detalles.

Para principiantes, empezar con filtros simples.

## 13.5 Dashboard efectivo

Debe responder:

- ¿qué está pasando?
- ¿dónde está el problema?
- ¿qué categoría destaca?
- ¿qué cambió?
- ¿qué acción debería seguir?

---

# Módulo 14 — Historias en Tableau

## 14.1 Qué es una historia

Una historia en Tableau permite organizar visualizaciones en una secuencia de puntos narrativos.

Sirve para guiar a la audiencia paso a paso.

## 14.2 Diferencia con dashboard

Dashboard:

- exploración.

Historia:

- explicación guiada.

## 14.3 Estructura

Una historia puede tener:

1. contexto;
2. métrica principal;
3. comparación;
4. hallazgo;
5. explicación;
6. recomendación;
7. cierre.

## 14.4 Uso

Ejemplo:

Historia sobre reclamos:

- total de reclamos;
- reclamos por tipo;
- evolución mensual;
- tiempo de resolución;
- foco en demoras;
- recomendación operativa.

## 14.5 Cuidado

No usar historias para forzar una conclusión. Deben guiar interpretación basada en evidencia.

---

# Módulo 15 — Buenas prácticas de visualización

## 15.1 Elegir gráfico según pregunta

- Comparación: barras.
- Evolución: líneas.
- Composición: barras apiladas o proporciones simples.
- Distribución: histograma.
- Relación: dispersión.
- Mapa: ubicación geográfica.

## 15.2 Evitar ruido visual

Eliminar:

- fondos innecesarios;
- bordes excesivos;
- colores sin sentido;
- etiquetas repetidas;
- gráficos 3D;
- leyendas redundantes.

## 15.3 Ordenar datos

Ordenar de mayor a menor suele mejorar lectura en barras.

## 15.4 Mostrar unidades

Indicar:

- moneda;
- porcentaje;
- cantidad;
- período;
- fuente.

## 15.5 Títulos interpretativos

Malo:

> Ventas por canal.

Mejor:

> WhatsApp concentra más de la mitad de las ventas pagadas.

## 15.6 Accesibilidad

Cuidar:

- contraste;
- tamaño de fuente;
- colores distinguibles;
- no depender solo del color;
- claridad en etiquetas.

---

# Módulo 16 — Publicación y Tableau Public

## 16.1 Publicar

Tableau permite publicar visualizaciones en Tableau Public, Tableau Cloud o Tableau Server, según herramienta y licencia.

## 16.2 Tableau Public

Es útil para:

- portfolio;
- aprendizaje;
- datos públicos;
- proyectos abiertos;
- visualizaciones demostrativas.

No usar para:

- datos de clientes;
- ventas privadas;
- información personal;
- datos sensibles;
- documentos internos.

## 16.3 Antes de publicar

Revisar:

- fuente;
- privacidad;
- filtros;
- datos ocultos;
- tooltips;
- nombres personales;
- permisos;
- exactitud;
- ortografía.

## 16.4 Compartir

Puede compartirse mediante enlace o incrustación, según plataforma.

## 16.5 Responsabilidad

Publicar una visualización es publicar una interpretación. Debe ser clara, correcta y ética.

---

# Módulo 17 — Caso práctico: dashboard de ventas

## 17.1 Pregunta

> ¿Qué canal y qué productos sostienen las ventas del mes?

## 17.2 Datos

Campos:

- fecha;
- producto;
- categoría;
- canal;
- cantidad;
- ventas;
- estado;
- cliente.

## 17.3 Hojas

Crear hojas:

1. ventas por mes;
2. ventas por canal;
3. top productos;
4. ventas por categoría;
5. pedidos por estado;
6. mapa por ciudad, si hay datos geográficos.

## 17.4 Dashboard

Debe incluir:

- ventas totales;
- cantidad de pedidos;
- ticket promedio;
- gráfico temporal;
- barras por canal;
- top productos;
- filtros por mes y estado.

## 17.5 Hallazgos

Ejemplo:

- WhatsApp concentra mayor volumen.
- Instagram tiene mayor ticket promedio.
- Dos categorías explican la mayor parte de la facturación.
- Hay aumento de pedidos pendientes al cierre del mes.

## 17.6 Recomendación

- reforzar WhatsApp como canal de cierre;
- probar campaña premium en Instagram;
- revisar productos principales;
- medir pendientes semanalmente.

---

# Módulo 18 — Proyecto final

## 18.1 Objetivo

Crear un dashboard o historia en Tableau a partir de datos propios o ficticios.

## 18.2 Tema

Opciones:

- ventas;
- gastos;
- reclamos;
- asistencia;
- inventario;
- encuestas;
- redes sociales;
- datos públicos.

## 18.3 Requisitos

El proyecto debe incluir:

- fuente de datos;
- limpieza básica previa;
- al menos 4 visualizaciones;
- filtros;
- un dashboard;
- títulos interpretativos;
- hallazgos;
- límites;
- recomendaciones.

## 18.4 Entregables

- archivo de Tableau;
- captura o enlace, si corresponde;
- documento breve con explicación;
- fuente de datos anonimizada si aplica.

## 18.5 Criterio de calidad

Se evaluará:

- claridad;
- gráfico correcto;
- coherencia narrativa;
- uso responsable de datos;
- diseño limpio;
- utilidad para una decisión.

---

# Caso práctico integrador

## Caso: reclamos de clientes

Una organización tiene una base con reclamos:

- fecha;
- tipo de reclamo;
- canal;
- producto;
- estado;
- días de resolución;
- ciudad.

### Paso 1 — Conectar datos

Se importa el archivo CSV o Excel.

### Paso 2 — Revisar campos

Se identifican:

- dimensiones: tipo, canal, producto, estado, ciudad;
- medidas: días de resolución, cantidad de reclamos.

### Paso 3 — Crear visualizaciones

- reclamos por tipo;
- evolución mensual;
- promedio de días de resolución;
- reclamos por canal;
- mapa por ciudad.

### Paso 4 — Dashboard

Filtros:

- mes;
- estado;
- canal.

KPIs:

- total de reclamos;
- reclamos abiertos;
- días promedio de resolución.

### Paso 5 — Interpretación

Hallazgo:

> Las demoras son el tipo de reclamo más frecuente y tienen mayor tiempo promedio de resolución.

### Paso 6 — Recomendación

> Revisar el proceso de entrega y comunicar demoras antes de que el cliente reclame.

---

# Actividades del curso

## Actividad 1 — Conexión

Conectar un archivo Excel o CSV en Tableau.

## Actividad 2 — Dimensiones y medidas

Clasificar 10 campos como dimensión o medida.

## Actividad 3 — Barras

Crear un gráfico de barras para comparar categorías.

## Actividad 4 — Línea temporal

Crear un gráfico de líneas con una fecha y una medida.

## Actividad 5 — Filtros

Agregar filtros por fecha, categoría o estado.

## Actividad 6 — Tooltip

Editar tooltips para que expliquen mejor el dato.

## Actividad 7 — Campo calculado

Crear un campo calculado simple, como margen, clasificación o porcentaje.

## Actividad 8 — Dashboard

Combinar al menos 4 hojas en un dashboard.

## Actividad 9 — Historia

Crear una secuencia de 3 a 5 puntos narrativos.

## Actividad 10 — Presentación

Redactar hallazgos, límites y recomendaciones.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es Tableau?
2. ¿Qué diferencia hay entre Tableau Desktop y Tableau Public?
3. ¿Por qué no se deben publicar datos sensibles en Tableau Public?
4. ¿Qué es una dimensión?
5. ¿Qué es una medida?
6. ¿Qué diferencia hay entre discreto y continuo?
7. ¿Para qué sirve un filtro?
8. ¿Qué función cumple la tarjeta Marks?
9. ¿Qué es un campo calculado?
10. ¿Qué diferencia hay entre hoja, dashboard e historia?
11. ¿Qué debe tener un buen dashboard?
12. ¿Qué prácticas ayudan a evitar visualizaciones engañosas?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Dashboard Inicial en Tableau**.

Debe incluir:

1. fuente de datos;
2. clasificación de dimensiones y medidas;
3. al menos 4 visualizaciones;
4. filtros;
5. tooltips mejorados;
6. un campo calculado;
7. dashboard;
8. títulos interpretativos;
9. hallazgos;
10. límites;
11. recomendaciones;
12. criterio de publicación responsable.

---

# Glosario básico

Tableau: plataforma de visualización y análisis de datos.

Tableau Desktop: aplicación para crear visualizaciones y dashboards.

Tableau Public: plataforma gratuita para publicar visualizaciones públicas.

Tableau Server: plataforma empresarial para compartir visualizaciones internamente.

Tableau Cloud: versión en la nube para publicación y colaboración.

Tableau Prep: herramienta para preparación de datos.

Hoja: vista individual de una visualización.

Dashboard: conjunto de visualizaciones integradas en una misma pantalla.

Historia: secuencia narrativa de visualizaciones.

Dimensión: campo categórico o descriptivo.

Medida: campo numérico que puede agregarse.

Discreto: campo que genera categorías separadas.

Continuo: campo que genera una escala continua.

Marks Card: tarjeta que controla color, tamaño, etiqueta, detalle y tooltip.

Tooltip: información emergente al pasar el cursor.

Filtro: control para limitar los datos mostrados.

Campo calculado: fórmula creada en Tableau.

Jerarquía: estructura de niveles para navegar datos.

Set: subconjunto de datos definido por una condición o selección.

Dashboard interactivo: tablero que permite explorar mediante filtros o acciones.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Dashboard Inicial en Tableau**.

Ese producto debe permitir:

- conectar datos;
- explorar campos;
- crear visualizaciones;
- aplicar filtros;
- diseñar un dashboard;
- comunicar hallazgos;
- reconocer límites;
- evitar publicar datos sensibles;
- presentar recomendaciones;
- practicar visual analytics.

El curso termina cuando la persona deja de ver Tableau como una herramienta de gráficos aislados y empieza a usarlo como un entorno de exploración, visualización y comunicación de datos.

---

# Fuentes recomendadas para profundizar

- Tableau Help — Get Started with Tableau.
- Tableau Public resources.
- Tableau eLearning — visual analytics basics.
- Tableau Blueprint — best practices.
- Tableau Help — Dimensions and Measures.
- Tableau Help — Dashboards and Stories.
- Tableau Help — Calculated Fields.
- Materiales de visual analytics, dashboard design, storytelling con datos y ética de visualización.

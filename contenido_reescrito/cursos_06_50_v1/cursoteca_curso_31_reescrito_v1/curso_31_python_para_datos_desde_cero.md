# Curso 31 — Python para Datos desde Cero

## Presentación del curso

Python es uno de los lenguajes más utilizados para análisis de datos, automatización, inteligencia artificial, ciencia de datos, visualización, limpieza de información y construcción de herramientas. Su popularidad se debe a que combina una sintaxis relativamente clara con un ecosistema muy amplio de bibliotecas como pandas, NumPy, matplotlib, seaborn, scikit-learn y muchas otras.

Para una persona que viene de Excel, Google Sheets o Power BI, Python representa un nuevo paso: permite automatizar tareas repetitivas, trabajar con archivos grandes, limpiar datos de manera reproducible, analizar información con más control y preparar bases para reportes, dashboards o modelos.

Este curso está pensado para principiantes absolutos en programación que quieren usar Python para datos. No busca formar programadores avanzados en una primera etapa, sino enseñar los fundamentos necesarios para cargar datos, inspeccionarlos, limpiarlos, analizarlos y comunicar resultados simples.

La idea central es:

> Python para datos no se aprende memorizando código. Se aprende resolviendo preguntas con datos, paso a paso y con criterio.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es Python y por qué se usa en análisis de datos.
2. Preparar un entorno básico de trabajo con notebooks.
3. Entender variables, tipos de datos, listas, diccionarios y funciones.
4. Leer archivos CSV o Excel simples.
5. Usar pandas para explorar tablas.
6. Filtrar, ordenar, agrupar y resumir datos.
7. Detectar valores faltantes, duplicados y errores básicos.
8. Crear gráficos simples con matplotlib.
9. Calcular métricas iniciales.
10. Documentar un análisis en un notebook.
11. Evitar errores comunes de principiantes.
12. Crear un mini análisis de datos reproducible.

---

# Módulo 1 — Qué es Python

## 1.1 Definición

Python es un lenguaje de programación de propósito general. Se usa en muchos campos:

- análisis de datos;
- ciencia de datos;
- automatización;
- desarrollo web;
- inteligencia artificial;
- scripting;
- educación;
- procesamiento de archivos;
- visualización;
- machine learning.

Su sintaxis es más legible que la de muchos lenguajes, lo que lo vuelve adecuado para principiantes.

## 1.2 Python aplicado a datos

En análisis de datos, Python permite:

- leer archivos;
- limpiar datos;
- transformar columnas;
- unir tablas;
- calcular indicadores;
- crear gráficos;
- automatizar reportes;
- trabajar con APIs;
- preparar datos para Power BI;
- analizar grandes volúmenes;
- documentar procesos.

## 1.3 Diferencia con Excel

Excel es visual, inmediato y muy útil para análisis manual.

Python es más potente cuando:

- la tarea se repite;
- los archivos son grandes;
- hay muchas transformaciones;
- se necesita trazabilidad;
- se trabaja con varias fuentes;
- se quiere automatizar;
- se requiere reproducibilidad.

No se trata de reemplazar Excel siempre, sino de sumar una herramienta más.

## 1.4 Qué es reproducibilidad

Un análisis reproducible permite repetir los pasos y obtener el mismo resultado si los datos no cambiaron.

En Excel, muchos cambios se hacen manualmente y pueden perderse.

En Python, el código documenta el proceso:

1. leer archivo;
2. limpiar;
3. transformar;
4. calcular;
5. graficar;
6. exportar.

---

# Módulo 2 — Entorno de trabajo

## 2.1 Qué se necesita

Para empezar con Python para datos se puede usar:

- Google Colab;
- Jupyter Notebook;
- JupyterLab;
- Anaconda;
- VS Code;
- Python instalado localmente.

Para principiantes, Google Colab suele ser una opción simple porque funciona desde el navegador.

## 2.2 Notebook

Un notebook combina:

- código;
- texto;
- gráficos;
- resultados;
- explicaciones;
- tablas.

Es ideal para análisis porque permite contar el proceso paso a paso.

## 2.3 Celda de código y celda de texto

En una celda de código se ejecutan instrucciones Python.

Ejemplo:

```python
print("Hola, datos")
```

En una celda de texto se explica el análisis usando Markdown.

Ejemplo:

```md
## Objetivo del análisis

Analizar las ventas del mes de junio.
```

## 2.4 Instalación de bibliotecas

En muchos entornos, pandas y matplotlib ya vienen instalados. Si hace falta instalar:

```python
pip install pandas matplotlib
```

En notebooks, a veces se usa:

```python
!pip install pandas matplotlib
```

## 2.5 Buenas prácticas

- nombrar notebooks claramente;
- explicar objetivos;
- ejecutar celdas en orden;
- no borrar resultados importantes sin guardar;
- separar carga, limpieza, análisis y gráficos;
- documentar supuestos;
- guardar versión final.

---

# Módulo 3 — Primeros conceptos de programación

## 3.1 Variable

Una variable guarda un valor.

```python
nombre = "Ana"
edad = 30
ventas = 15000
```

Las variables permiten reutilizar información.

## 3.2 Tipos de datos

Tipos básicos:

- texto: `str`;
- entero: `int`;
- decimal: `float`;
- booleano: `bool`;
- lista: `list`;
- diccionario: `dict`.

Ejemplo:

```python
producto = "Remera"
cantidad = 3
precio = 8000.50
pagado = True
```

## 3.3 Comentarios

Los comentarios explican código.

```python
# Calcular total de la venta
total = cantidad * precio
```

No se ejecutan. Ayudan a entender.

## 3.4 Operaciones

```python
suma = 10 + 5
resta = 10 - 5
multiplicacion = 10 * 5
division = 10 / 5
```

## 3.5 Mostrar resultados

```python
print(total)
```

En notebooks, también se puede escribir el nombre de una variable al final de una celda.

---

# Módulo 4 — Listas, diccionarios y estructuras

## 4.1 Lista

Una lista guarda varios elementos.

```python
productos = ["Remera", "Gorra", "Pantalón"]
```

Acceder:

```python
productos[0]
```

Python empieza a contar desde cero.

## 4.2 Agregar elementos

```python
productos.append("Campera")
```

## 4.3 Recorrer lista

```python
for producto in productos:
    print(producto)
```

## 4.4 Diccionario

Un diccionario guarda pares clave-valor.

```python
cliente = {
    "nombre": "Ana",
    "ciudad": "Santa Fe",
    "compras": 3
}
```

Acceder:

```python
cliente["nombre"]
```

## 4.5 Lista de diccionarios

Muy útil para datos.

```python
ventas = [
    {"producto": "Remera", "total": 16000},
    {"producto": "Gorra", "total": 5000}
]
```

Aunque para análisis real se suele usar pandas.

---

# Módulo 5 — Condiciones y funciones

## 5.1 Condicional if

Permite ejecutar código según una condición.

```python
total = 20000

if total > 10000:
    print("Venta alta")
else:
    print("Venta normal")
```

## 5.2 Comparaciones

Operadores:

- `==` igual;
- `!=` distinto;
- `>` mayor;
- `<` menor;
- `>=` mayor o igual;
- `<=` menor o igual.

## 5.3 Función

Una función agrupa instrucciones reutilizables.

```python
def calcular_total(cantidad, precio):
    return cantidad * precio
```

Uso:

```python
calcular_total(3, 8000)
```

## 5.4 Función con condición

```python
def clasificar_venta(total):
    if total >= 20000:
        return "Alta"
    else:
        return "Normal"
```

## 5.5 Por qué importan

En análisis de datos, las funciones ayudan a:

- no repetir código;
- clasificar datos;
- transformar columnas;
- ordenar procesos;
- documentar lógica.

---

# Módulo 6 — Introducción a pandas

## 6.1 Qué es pandas

pandas es una biblioteca de Python para trabajar con datos tabulares. Es una de las herramientas principales para análisis de datos.

Permite:

- leer archivos;
- explorar tablas;
- limpiar datos;
- filtrar registros;
- agrupar;
- calcular métricas;
- unir tablas;
- exportar resultados.

## 6.2 Importar pandas

```python
import pandas as pd
```

La abreviatura `pd` es una convención muy usada.

## 6.3 DataFrame

Un DataFrame es una tabla.

Ejemplo:

```python
datos = {
    "producto": ["Remera", "Gorra", "Pantalón"],
    "ventas": [16000, 5000, 22000]
}

df = pd.DataFrame(datos)
df
```

## 6.4 Ver primeras filas

```python
df.head()
```

## 6.5 Ver información general

```python
df.info()
```

Muestra columnas, tipos de datos y valores no nulos.

## 6.6 Estadísticas rápidas

```python
df.describe()
```

Muestra conteo, promedio, mínimo, máximo y otros valores para columnas numéricas.

---

# Módulo 7 — Leer archivos de datos

## 7.1 Leer CSV

```python
df = pd.read_csv("ventas.csv")
```

Si el separador es punto y coma:

```python
df = pd.read_csv("ventas.csv", sep=";")
```

## 7.2 Leer Excel

```python
df = pd.read_excel("ventas.xlsx")
```

Si hay varias hojas:

```python
df = pd.read_excel("ventas.xlsx", sheet_name="Ventas")
```

## 7.3 Revisar datos cargados

Después de leer:

```python
df.head()
df.info()
df.shape
```

`shape` muestra filas y columnas.

## 7.4 Problemas frecuentes

- archivo no encontrado;
- separador incorrecto;
- codificación;
- nombres de columnas raros;
- fechas como texto;
- números cargados como texto;
- columnas vacías.

## 7.5 Ruta del archivo

Si Python no encuentra el archivo, revisar:

- nombre;
- extensión;
- carpeta;
- mayúsculas;
- espacios;
- ruta completa;
- si fue subido al entorno.

---

# Módulo 8 — Explorar datos

## 8.1 Ver columnas

```python
df.columns
```

## 8.2 Ver tamaño

```python
df.shape
```

Ejemplo:

> 500 filas, 9 columnas.

## 8.3 Ver tipos

```python
df.dtypes
```

## 8.4 Conteos

```python
df["canal"].value_counts()
```

Sirve para categorías.

## 8.5 Valores únicos

```python
df["estado"].unique()
```

Ayuda a detectar inconsistencias.

## 8.6 Revisar muestra

```python
df.sample(5)
```

Permite ver filas aleatorias.

## 8.7 Preguntas iniciales

- ¿cuántas filas hay?
- ¿qué columnas tiene?
- ¿hay datos faltantes?
- ¿los tipos son correctos?
- ¿hay categorías duplicadas?
- ¿hay valores sospechosos?

---

# Módulo 9 — Seleccionar, filtrar y ordenar

## 9.1 Seleccionar columna

```python
df["producto"]
```

## 9.2 Seleccionar varias columnas

```python
df[["fecha", "producto", "total"]]
```

## 9.3 Filtrar filas

```python
ventas_altas = df[df["total"] > 20000]
```

## 9.4 Filtrar por texto

```python
ventas_whatsapp = df[df["canal"] == "WhatsApp"]
```

## 9.5 Combinar condiciones

```python
df[(df["canal"] == "WhatsApp") & (df["total"] > 10000)]
```

Operadores:

- `&` para Y;
- `|` para O.

## 9.6 Ordenar

```python
df.sort_values("total", ascending=False)
```

## 9.7 Aplicación

Preguntas que se pueden responder:

- ¿cuáles fueron las ventas más altas?
- ¿qué pedidos están pendientes?
- ¿qué ventas llegaron por Instagram?
- ¿qué productos superan cierto monto?

---

# Módulo 10 — Limpieza básica con pandas

## 10.1 Valores faltantes

Detectar:

```python
df.isna().sum()
```

## 10.2 Eliminar filas vacías

```python
df = df.dropna()
```

Cuidado: esto elimina filas con cualquier valor faltante. No siempre conviene.

## 10.3 Completar faltantes

```python
df["estado"] = df["estado"].fillna("Pendiente")
```

## 10.4 Duplicados

Detectar:

```python
df.duplicated().sum()
```

Eliminar duplicados exactos:

```python
df = df.drop_duplicates()
```

## 10.5 Normalizar texto

```python
df["canal"] = df["canal"].str.strip()
df["canal"] = df["canal"].str.title()
```

## 10.6 Reemplazar valores

```python
df["canal"] = df["canal"].replace({
    "Wsp": "WhatsApp",
    "Whatsapp": "WhatsApp",
    "Ig": "Instagram"
})
```

## 10.7 Documentar limpieza

En el notebook, escribir qué se cambió y por qué.

---

# Módulo 11 — Fechas y columnas calculadas

## 11.1 Convertir fechas

```python
df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce")
```

`errors="coerce"` convierte errores en valores nulos.

## 11.2 Extraer año, mes y día

```python
df["año"] = df["fecha"].dt.year
df["mes"] = df["fecha"].dt.month
df["dia"] = df["fecha"].dt.day
```

## 11.3 Crear total

```python
df["total"] = df["cantidad"] * df["precio"]
```

## 11.4 Clasificar ventas

```python
df["tipo_venta"] = df["total"].apply(lambda x: "Alta" if x >= 20000 else "Normal")
```

## 11.5 Crear columna de revisión

```python
df["revision"] = "OK"
df.loc[df["total"] <= 0, "revision"] = "Revisar monto"
df.loc[df["estado"].isna(), "revision"] = "Falta estado"
```

## 11.6 Utilidad

Las columnas calculadas permiten:

- segmentar;
- agrupar;
- filtrar;
- crear indicadores;
- detectar problemas;
- preparar reportes.

---

# Módulo 12 — Agrupar y resumir datos

## 12.1 groupby

`groupby` permite agrupar datos por una columna.

Ejemplo:

```python
ventas_por_canal = df.groupby("canal")["total"].sum()
```

## 12.2 Agrupar por producto

```python
ventas_por_producto = df.groupby("producto")["total"].sum().sort_values(ascending=False)
```

## 12.3 Múltiples métricas

```python
resumen = df.groupby("canal").agg(
    ventas_totales=("total", "sum"),
    pedidos=("total", "count"),
    ticket_promedio=("total", "mean")
)
```

## 12.4 Agrupar por mes

```python
ventas_por_mes = df.groupby("mes")["total"].sum()
```

## 12.5 Resetear índice

```python
resumen = resumen.reset_index()
```

Esto convierte el resultado en DataFrame normal.

## 12.6 Preguntas

Con agrupaciones se puede responder:

- ¿ventas por canal?
- ¿ventas por producto?
- ¿ticket promedio por categoría?
- ¿pedidos por estado?
- ¿reclamos por tipo?
- ¿asistencia por curso?

---

# Módulo 13 — Estadística básica con Python

## 13.1 Promedio

```python
df["total"].mean()
```

## 13.2 Mediana

```python
df["total"].median()
```

## 13.3 Mínimo y máximo

```python
df["total"].min()
df["total"].max()
```

## 13.4 Desviación estándar

```python
df["total"].std()
```

Indica dispersión.

## 13.5 Conteos

```python
df["estado"].value_counts()
```

## 13.6 Porcentajes

```python
df["canal"].value_counts(normalize=True) * 100
```

## 13.7 Interpretación

Python calcula, pero la persona interpreta.

Ejemplo:

> El promedio de ticket es $18.000, pero la mediana es $11.000. Esto sugiere que algunas ventas altas elevan el promedio.

---

# Módulo 14 — Gráficos básicos

## 14.1 Importar matplotlib

```python
import matplotlib.pyplot as plt
```

## 14.2 Gráfico de barras

```python
ventas_por_canal.plot(kind="bar")
plt.title("Ventas por canal")
plt.xlabel("Canal")
plt.ylabel("Ventas")
plt.show()
```

## 14.3 Gráfico de líneas

```python
ventas_por_mes.plot(kind="line", marker="o")
plt.title("Ventas por mes")
plt.xlabel("Mes")
plt.ylabel("Ventas")
plt.show()
```

## 14.4 Histograma

```python
df["total"].plot(kind="hist", bins=10)
plt.title("Distribución de tickets")
plt.xlabel("Total")
plt.show()
```

## 14.5 Buenas prácticas

Un gráfico debe tener:

- título claro;
- ejes;
- unidades;
- fuente o contexto;
- escala razonable;
- pocas categorías;
- propósito claro.

## 14.6 Evitar

- gráficos sin título;
- demasiadas categorías;
- interpretar sin revisar datos;
- usar gráfico solo por decorar;
- no aclarar período.

---

# Módulo 15 — Exportar resultados

## 15.1 Exportar CSV

```python
resumen.to_csv("resumen_ventas.csv", index=False)
```

## 15.2 Exportar Excel

```python
resumen.to_excel("resumen_ventas.xlsx", index=False)
```

## 15.3 Exportar base limpia

```python
df.to_csv("ventas_limpias.csv", index=False)
```

## 15.4 Guardar gráficos

```python
plt.savefig("ventas_por_canal.png")
```

Debe ejecutarse antes de `plt.show()` en muchos casos.

## 15.5 Usos

Los resultados pueden usarse para:

- Excel;
- Power BI;
- informes;
- presentaciones;
- seguimiento;
- auditoría;
- automatización.

---

# Módulo 16 — Errores comunes de principiantes

## 16.1 Error de nombre

```python
NameError
```

Ocurre cuando se usa una variable no definida o mal escrita.

## 16.2 Error de archivo

```python
FileNotFoundError
```

El archivo no está en la ruta esperada.

## 16.3 Error de tipo

```python
TypeError
```

Se intenta operar con tipos incompatibles.

Ejemplo:

- texto + número.

## 16.4 Error de columna

```python
KeyError
```

Se intenta acceder a una columna que no existe o está mal escrita.

## 16.5 Orden de celdas

En notebooks, ejecutar celdas fuera de orden puede generar resultados confusos.

Regla:

> Ejecutar desde arriba hacia abajo y reiniciar kernel si hay dudas.

## 16.6 Copiar sin entender

Copiar código de internet puede servir, pero hay que entender:

- qué hace;
- qué datos espera;
- qué cambia;
- qué resultado produce;
- qué riesgos tiene.

---

# Módulo 17 — Buenas prácticas de análisis en notebooks

## 17.1 Estructura recomendada

Un notebook profesional básico puede tener:

1. título;
2. objetivo;
3. fuente de datos;
4. carga de datos;
5. exploración inicial;
6. limpieza;
7. análisis;
8. visualización;
9. hallazgos;
10. límites;
11. recomendaciones.

## 17.2 Nombrar variables

Mal:

```python
x = pd.read_csv("ventas.csv")
```

Mejor:

```python
ventas = pd.read_csv("ventas.csv")
```

## 17.3 Explicar pasos

Entre bloques de código, escribir:

- qué se hace;
- por qué;
- qué se encontró;
- qué decisión se tomó.

## 17.4 No ocultar problemas

Si hay datos faltantes, duplicados o errores, mencionarlos.

## 17.5 Reproducibilidad

Guardar:

- archivo original;
- notebook;
- base limpia;
- resultados;
- gráficos;
- fecha de análisis;
- versión de datos.

---

# Módulo 18 — Mini proyecto final

## 18.1 Objetivo

Crear un mini análisis de datos con Python a partir de una base simple.

Opciones:

- ventas;
- gastos;
- asistencia;
- reclamos;
- inventario;
- encuestas;
- pedidos;
- tickets de soporte.

## 18.2 Datos mínimos

La base debe tener al menos:

- 50 registros;
- una columna de fecha;
- una columna categórica;
- una columna numérica;
- una columna de estado o grupo.

## 18.3 Pasos

1. Cargar datos.
2. Explorar.
3. Revisar calidad.
4. Limpiar.
5. Crear columnas.
6. Agrupar.
7. Calcular métricas.
8. Graficar.
9. Interpretar.
10. Exportar resumen.

## 18.4 Entregables

- notebook;
- base limpia;
- resumen CSV o Excel;
- dos gráficos;
- informe breve;
- recomendaciones.

## 18.5 Criterio

No importa que el análisis sea complejo. Importa que sea claro, reproducible y honesto.

---

# Caso práctico integrador

## Caso: ventas de un emprendimiento

Un emprendimiento registra ventas en un archivo `ventas.csv` con columnas:

- fecha;
- cliente;
- producto;
- canal;
- cantidad;
- precio;
- estado.

Quiere saber:

- cuánto vendió;
- qué canal generó más ventas;
- cuál fue el ticket promedio;
- qué productos vendieron más;
- cuántos pedidos quedaron pendientes.

### Paso 1 — Cargar

```python
import pandas as pd

ventas = pd.read_csv("ventas.csv")
ventas.head()
```

### Paso 2 — Revisar

```python
ventas.info()
ventas.isna().sum()
ventas["canal"].unique()
```

### Paso 3 — Limpiar

```python
ventas["canal"] = ventas["canal"].str.strip().str.title()
ventas["canal"] = ventas["canal"].replace({"Wsp": "WhatsApp"})
ventas["fecha"] = pd.to_datetime(ventas["fecha"], errors="coerce")
```

### Paso 4 — Calcular

```python
ventas["total"] = ventas["cantidad"] * ventas["precio"]
```

### Paso 5 — Resumir

```python
resumen_canal = ventas.groupby("canal").agg(
    ventas_totales=("total", "sum"),
    pedidos=("total", "count"),
    ticket_promedio=("total", "mean")
).reset_index()
```

### Paso 6 — Graficar

```python
resumen_canal.plot(kind="bar", x="canal", y="ventas_totales")
plt.title("Ventas totales por canal")
plt.show()
```

### Paso 7 — Interpretar

Ejemplo:

> WhatsApp concentra la mayor cantidad de ventas. Instagram tiene menos pedidos, pero mayor ticket promedio. Conviene medir también consultas por canal para calcular conversión.

---

# Actividades del curso

## Actividad 1 — Primer notebook

Crear un notebook con:

- título;
- objetivo;
- una celda de código;
- una celda de texto;
- una explicación.

## Actividad 2 — Variables

Crear variables para:

- producto;
- cantidad;
- precio;
- total;
- estado.

## Actividad 3 — DataFrame

Crear un DataFrame manual con al menos 5 registros.

## Actividad 4 — Leer archivo

Cargar un CSV o Excel y mostrar:

- primeras filas;
- columnas;
- tamaño;
- tipos de datos.

## Actividad 5 — Calidad

Detectar:

- valores faltantes;
- duplicados;
- categorías inconsistentes;
- tipos incorrectos.

## Actividad 6 — Filtrado

Crear filtros para:

- registros mayores a cierto valor;
- categoría específica;
- estado pendiente.

## Actividad 7 — Agrupación

Crear resumen por categoría con:

- suma;
- conteo;
- promedio.

## Actividad 8 — Gráfico

Crear un gráfico de barras y uno de líneas o histograma.

## Actividad 9 — Exportación

Exportar una base limpia y un resumen.

## Actividad 10 — Informe final

Redactar 3 hallazgos, 2 límites y 3 recomendaciones.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es Python?
2. ¿Por qué Python es útil para análisis de datos?
3. ¿Qué es un notebook?
4. ¿Qué es una variable?
5. ¿Qué es una lista?
6. ¿Qué es un diccionario?
7. ¿Qué es pandas?
8. ¿Qué es un DataFrame?
9. ¿Para qué sirve `head()`?
10. ¿Cómo se detectan valores faltantes?
11. ¿Qué permite `groupby()`?
12. ¿Por qué es importante documentar un análisis?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Mini Análisis de Datos con Python**.

Debe incluir:

1. notebook organizado;
2. carga de datos;
3. exploración inicial;
4. revisión de calidad;
5. limpieza básica;
6. columnas calculadas;
7. filtros;
8. agrupaciones;
9. métricas;
10. gráficos;
11. exportación;
12. hallazgos y recomendaciones.

---

# Glosario básico

Python: lenguaje de programación usado para análisis, automatización y desarrollo.

Notebook: documento interactivo que combina código, texto y resultados.

Variable: nombre que guarda un valor.

String: texto.

Integer: número entero.

Float: número decimal.

Boolean: valor verdadero o falso.

Lista: colección ordenada de elementos.

Diccionario: estructura de pares clave-valor.

Función: bloque de código reutilizable.

Biblioteca: conjunto de herramientas de código ya creadas.

pandas: biblioteca de Python para trabajar con datos tabulares.

DataFrame: tabla de datos en pandas.

CSV: archivo de texto con datos separados por comas u otro separador.

NaN: valor faltante en pandas.

groupby: operación para agrupar datos.

matplotlib: biblioteca para crear gráficos.

Filtro: selección de filas según una condición.

Columna calculada: columna nueva creada a partir de otras.

Reproducibilidad: capacidad de repetir un análisis y obtener el mismo resultado.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Mini Análisis de Datos con Python**.

Ese producto debe permitir:

- cargar una base;
- explorar datos;
- limpiar errores básicos;
- calcular métricas;
- agrupar información;
- crear gráficos;
- exportar resultados;
- documentar pasos;
- comunicar hallazgos;
- dejar un análisis reproducible.

El curso termina cuando la persona deja de ver Python como código abstracto y empieza a usarlo como herramienta práctica para responder preguntas con datos.

---

# Fuentes recomendadas para profundizar

- Python.org — documentación oficial de Python.
- pandas documentation — Getting started.
- Google Colab documentation.
- Jupyter documentation.
- matplotlib documentation.
- W3Schools Python basics.
- Microsoft Learn — Python for beginners.
- Kaggle Learn — Python and pandas.
- Materiales introductorios sobre análisis de datos, notebooks, limpieza de datos y visualización.

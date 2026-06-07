# Curso 44 — CSS Práctico para Principiantes

## Presentación del curso

CSS es el lenguaje que permite transformar una estructura HTML en una interfaz visual clara, usable y atractiva. Define colores, tamaños, espaciados, tipografías, disposición de elementos, comportamiento responsive, estilos de botones, tarjetas, formularios, menús, grillas y estados visuales.

Aprender CSS no consiste solo en “poner colores”. CSS es una herramienta de diseño aplicada al navegador. Permite construir jerarquía visual, ordenar contenido, mejorar legibilidad, adaptar una web a distintos dispositivos y sostener una identidad visual coherente.

Este curso está pensado para principiantes que ya conocen algo de HTML o están empezando a construir páginas web. El enfoque será práctico: entender selectores, cascada, box model, flexbox, grid, responsive design, variables, organización de estilos y buenas prácticas.

La idea central es:

> CSS no decora una web terminada: construye la experiencia visual con la que el usuario entiende, navega y usa una página.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es CSS y cómo se conecta con HTML.
2. Usar selectores básicos y combinados.
3. Entender cascada, especificidad y herencia.
4. Aplicar colores, tipografías y espaciados con criterio.
5. Comprender el box model.
6. Crear diseños con flexbox.
7. Crear estructuras con CSS grid.
8. Diseñar páginas responsive.
9. Estilizar botones, tarjetas, formularios y navegación.
10. Usar variables CSS para mantener consistencia.
11. Aplicar buenas prácticas de accesibilidad visual.
12. Crear una landing page simple y profesional.

---

# Módulo 1 — Qué es CSS

## 1.1 Definición

CSS significa Cascading Style Sheets. Es el lenguaje que define la presentación visual de documentos HTML.

HTML estructura el contenido.
CSS define cómo se ve.

Ejemplo:

```html
<h1>Mi página</h1>
```

```css
h1 {
  color: #1f2937;
  font-size: 2rem;
}
```

## 1.2 Qué puede hacer CSS

CSS permite controlar:

- colores;
- fuentes;
- tamaños;
- márgenes;
- rellenos;
- bordes;
- sombras;
- grillas;
- columnas;
- alineación;
- animaciones;
- responsive;
- estados hover/focus;
- diseño de componentes.

## 1.3 CSS en proyectos reales

Se usa para crear:

- landing pages;
- blogs;
- tiendas online;
- dashboards;
- formularios;
- portales educativos;
- aplicaciones web;
- interfaces móviles.

## 1.4 CSS y experiencia de usuario

Un mal CSS puede hacer que una web sea confusa, ilegible o difícil de usar. Un buen CSS guía la lectura y facilita la navegación.

---

# Módulo 2 — Formas de incluir CSS

## 2.1 CSS en línea

```html
<p style="color: red;">Texto</p>
```

No se recomienda para proyectos mantenibles.

## 2.2 CSS interno

```html
<style>
  p {
    color: red;
  }
</style>
```

Útil para pruebas pequeñas.

## 2.3 CSS externo

```html
<link rel="stylesheet" href="styles.css">
```

Es la forma recomendada para proyectos organizados.

## 2.4 Separación de responsabilidades

HTML: estructura.
CSS: presentación.
JavaScript: comportamiento.

## 2.5 Buenas prácticas

- usar archivo externo;
- nombrar clases claramente;
- evitar estilos repetidos;
- comentar secciones importantes;
- organizar por componentes o bloques.

---

# Módulo 3 — Selectores básicos

## 3.1 Selector de etiqueta

```css
p {
  color: #333;
}
```

Aplica a todos los párrafos.

## 3.2 Selector de clase

```css
.tarjeta {
  padding: 1rem;
}
```

En HTML:

```html
<div class="tarjeta">Contenido</div>
```

## 3.3 Selector de ID

```css
#principal {
  max-width: 1200px;
}
```

El ID debe ser único.

## 3.4 Selector universal

```css
* {
  box-sizing: border-box;
}
```

Se aplica a todos los elementos.

## 3.5 Recomendación

Para estilos reutilizables, usar clases.

---

# Módulo 4 — Cascada, especificidad y herencia

## 4.1 Cascada

CSS se llama “cascading” porque cuando varias reglas aplican a un elemento, el navegador decide cuál gana según orden, especificidad e importancia.

## 4.2 Orden

Si dos reglas tienen la misma especificidad, gana la última.

```css
p {
  color: blue;
}

p {
  color: green;
}
```

El párrafo será verde.

## 4.3 Especificidad

Un ID pesa más que una clase. Una clase pesa más que una etiqueta.

Orden simplificado:

1. estilos inline;
2. ID;
3. clase;
4. etiqueta.

## 4.4 Herencia

Algunas propiedades se heredan, como color y font-family.

```css
body {
  font-family: Arial, sans-serif;
  color: #222;
}
```

## 4.5 Evitar !important

`!important` debe usarse con mucho cuidado porque dificulta mantenimiento.

---

# Módulo 5 — Colores y tipografía

## 5.1 Colores

Se pueden escribir como:

```css
color: red;
color: #ff0000;
color: rgb(255, 0, 0);
color: hsl(0, 100%, 50%);
```

## 5.2 Paleta

Un sitio profesional usa pocos colores:

- color principal;
- color secundario;
- fondo;
- texto;
- alerta;
- éxito;
- borde.

## 5.3 Contraste

El texto debe ser legible sobre el fondo. Evitar gris claro sobre blanco o colores vibrantes sin control.

## 5.4 Tipografía

Propiedades:

```css
body {
  font-family: system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
}
```

## 5.5 Jerarquía

Usar tamaños y pesos para distinguir:

- título principal;
- subtítulos;
- párrafos;
- notas;
- botones.

---

# Módulo 6 — Unidades de medida

## 6.1 Pixeles

```css
font-size: 16px;
```

Son precisos, pero menos flexibles.

## 6.2 rem

`rem` se basa en el tamaño raíz del documento.

```css
font-size: 1rem;
padding: 2rem;
```

Es útil para escalabilidad.

## 6.3 Porcentajes

```css
width: 80%;
```

Dependen del contenedor.

## 6.4 viewport

```css
min-height: 100vh;
width: 100vw;
```

Se relacionan con el tamaño de la pantalla.

## 6.5 Recomendación

Usar `rem` para tamaños y espaciados generales; porcentajes para anchos flexibles; `px` para detalles puntuales.

---

# Módulo 7 — Box model

## 7.1 Qué es

Todo elemento en CSS se comporta como una caja.

Incluye:

- content;
- padding;
- border;
- margin.

## 7.2 Padding

Espacio interno.

```css
.card {
  padding: 1rem;
}
```

## 7.3 Margin

Espacio externo.

```css
.card {
  margin-bottom: 1rem;
}
```

## 7.4 Border

Borde de la caja.

```css
.card {
  border: 1px solid #ddd;
}
```

## 7.5 box-sizing

Recomendado:

```css
* {
  box-sizing: border-box;
}
```

Hace que width incluya contenido, padding y borde.

---

# Módulo 8 — Display y flujo normal

## 8.1 Block

Elementos como `div`, `p`, `section` ocupan todo el ancho disponible.

## 8.2 Inline

Elementos como `span` o `a` ocupan solo su contenido.

## 8.3 Inline-block

Permite tamaño y alineación, pero conserva comportamiento en línea.

## 8.4 none

```css
.oculto {
  display: none;
}
```

Oculta el elemento y lo saca del flujo.

## 8.5 Flujo normal

Antes de usar flex o grid, entender cómo los elementos se apilan naturalmente.

---

# Módulo 9 — Flexbox

## 9.1 Qué es

Flexbox sirve para distribuir elementos en una dimensión: fila o columna.

## 9.2 Contenedor flex

```css
.contenedor {
  display: flex;
}
```

## 9.3 Dirección

```css
.contenedor {
  flex-direction: row;
}
```

Opciones:

- row;
- column;
- row-reverse;
- column-reverse.

## 9.4 Alineación

```css
.contenedor {
  justify-content: center;
  align-items: center;
}
```

`justify-content` alinea en eje principal.
`align-items` alinea en eje cruzado.

## 9.5 Gap

```css
.contenedor {
  gap: 1rem;
}
```

Crea espacio entre elementos.

---

# Módulo 10 — Casos prácticos con flexbox

## 10.1 Menú horizontal

```css
.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}
```

## 10.2 Botones en fila

```css
.acciones {
  display: flex;
  gap: .75rem;
  flex-wrap: wrap;
}
```

## 10.3 Card centrada

```css
.wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## 10.4 Layout de tarjeta

```css
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

## 10.5 Cuándo usar flexbox

Usar flexbox para:

- navegación;
- botones;
- alineación;
- filas simples;
- componentes internos;
- distribución lineal.

---

# Módulo 11 — CSS Grid

## 11.1 Qué es

CSS Grid sirve para diseños en dos dimensiones: filas y columnas.

## 11.2 Crear grilla

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

## 11.3 fr

`fr` representa una fracción del espacio disponible.

## 11.4 Columnas responsive

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
```

## 11.5 Cuándo usar grid

Usar grid para:

- galerías;
- cards;
- layouts principales;
- catálogos;
- dashboards;
- secciones con columnas y filas.

---

# Módulo 12 — Responsive design

## 12.1 Qué es

Responsive design permite que una web se adapte a distintos tamaños de pantalla.

## 12.2 Mobile first

Diseñar primero para móvil y luego ampliar.

```css
.card {
  padding: 1rem;
}

@media (min-width: 768px) {
  .card {
    padding: 2rem;
  }
}
```

## 12.3 Media queries

Permiten cambiar estilos según condiciones.

```css
@media (max-width: 600px) {
  .menu {
    flex-direction: column;
  }
}
```

## 12.4 Imágenes fluidas

```css
img {
  max-width: 100%;
  height: auto;
}
```

## 12.5 Evitar anchos fijos

Usar max-width y porcentajes para que el diseño respire.

---

# Módulo 13 — Botones y enlaces visuales

## 13.1 Botón base

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: .75rem 1rem;
  border-radius: .5rem;
  border: none;
  cursor: pointer;
}
```

## 13.2 Estados

```css
.btn:hover {
  filter: brightness(0.95);
}

.btn:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

## 13.3 Botón primario y secundario

```css
.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-secondary {
  background: white;
  color: #2563eb;
  border: 1px solid #2563eb;
}
```

## 13.4 Enlaces

Los enlaces deben distinguirse visualmente. No depender solo de color si el contexto no es claro.

## 13.5 Accesibilidad

No quitar foco visible. No usar `div` como botón.

---

# Módulo 14 — Tarjetas

## 14.1 Qué es una card

Una tarjeta agrupa información relacionada.

Ejemplos:

- curso;
- producto;
- artículo;
- perfil;
- servicio;
- indicador.

## 14.2 Estructura

```html
<article class="card">
  <h2>Curso CSS</h2>
  <p>Aprendé estilos prácticos.</p>
  <a href="#">Ver curso</a>
</article>
```

## 14.3 Estilo

```css
.card {
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 8px 24px rgba(0,0,0,.06);
}
```

## 14.4 Card grid

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
```

## 14.5 Buenas prácticas

- no saturar;
- título claro;
- texto breve;
- acción visible;
- altura consistente si ayuda al orden.

---

# Módulo 15 — Formularios con CSS

## 15.1 Campos

```css
.input {
  width: 100%;
  padding: .75rem;
  border: 1px solid #cbd5e1;
  border-radius: .5rem;
}
```

## 15.2 Labels

```css
.label {
  display: block;
  margin-bottom: .35rem;
  font-weight: 600;
}
```

## 15.3 Estados

```css
.input:focus {
  outline: 3px solid rgba(37, 99, 235, .25);
  border-color: #2563eb;
}
```

## 15.4 Errores

```css
.error {
  color: #b91c1c;
  font-size: .9rem;
}
```

## 15.5 Diseño

Los formularios deben ser claros, espaciados y fáciles de completar en móvil.

---

# Módulo 16 — Variables CSS

## 16.1 Qué son

Las variables CSS permiten guardar valores reutilizables.

```css
:root {
  --color-primary: #2563eb;
  --color-text: #1f2937;
  --space-1: .5rem;
  --space-2: 1rem;
}
```

## 16.2 Uso

```css
.btn {
  background: var(--color-primary);
  color: white;
  padding: var(--space-2);
}
```

## 16.3 Ventajas

- consistencia;
- mantenimiento;
- cambios rápidos;
- sistema visual;
- temas.

## 16.4 Variables útiles

- colores;
- tipografías;
- sombras;
- radios;
- espaciados;
- anchos máximos;
- transiciones.

## 16.5 Buen hábito

Crear un pequeño sistema de diseño desde el inicio.

---

# Módulo 17 — Organización de CSS

## 17.1 Orden recomendado

Un archivo puede organizarse así:

1. reset/base;
2. variables;
3. estilos generales;
4. layout;
5. componentes;
6. utilidades;
7. media queries.

## 17.2 Nombres claros

Malo:

```css
.caja1 {}
.azulito {}
```

Mejor:

```css
.course-card {}
.hero-title {}
```

## 17.3 Evitar repetición

Si varios botones comparten estilos, crear clase base.

## 17.4 Comentarios

Usar comentarios para separar secciones.

```css
/* Componentes: Cards */
```

## 17.5 Escalabilidad

CSS desordenado se vuelve difícil de mantener. La organización importa desde proyectos pequeños.

---

# Módulo 18 — Accesibilidad visual en CSS

## 18.1 Contraste

Cuidar texto y fondo.

## 18.2 Foco visible

```css
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 3px;
}
```

## 18.3 Movimiento reducido

Respetar preferencias del usuario:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none;
    transition: none;
  }
}
```

## 18.4 Tamaño táctil

Botones en móvil deben tener tamaño suficiente.

## 18.5 No ocultar contenido importante

No usar solo color, animación o posición para transmitir información clave.

---

# Módulo 19 — Proyecto final: landing page

## 19.1 Objetivo

Crear una landing page responsive y accesible para un curso, producto o emprendimiento.

## 19.2 Secciones

Debe incluir:

- header;
- hero;
- beneficios;
- tarjetas;
- sección explicativa;
- formulario o CTA;
- footer.

## 19.3 Requisitos CSS

Aplicar:

- variables;
- box model;
- flexbox;
- grid;
- responsive;
- botones;
- cards;
- formularios;
- foco visible.

## 19.4 Criterio visual

La landing debe ser:

- clara;
- legible;
- coherente;
- responsive;
- accesible;
- mantenible.

## 19.5 Entrega

Archivos:

- `index.html`;
- `styles.css`;
- carpeta de imágenes si corresponde;
- breve documentación.

---

# Caso práctico integrador

## Caso: landing para Cursoteca

Se necesita una página para promocionar un curso de APIs.

### Paso 1 — HTML

Estructura:

- header con navegación;
- hero con título y CTA;
- sección de objetivos;
- tarjetas de módulos;
- formulario de interés;
- footer.

### Paso 2 — Variables

Definir colores, espaciados y radios.

### Paso 3 — Layout

Usar flexbox para navegación y hero.
Usar grid para tarjetas.

### Paso 4 — Responsive

En móvil, las columnas pasan a una sola columna.

### Paso 5 — Accesibilidad

Contraste suficiente, foco visible, labels en formulario y botones reales.

### Resultado

Una landing simple, profesional y preparada para crecer.

---

# Actividades del curso

1. Conectar un archivo CSS externo a HTML.
2. Crear selectores de etiqueta, clase e ID.
3. Corregir un conflicto de especificidad.
4. Diseñar una paleta simple.
5. Aplicar box model a una tarjeta.
6. Crear menú con flexbox.
7. Crear grilla de tarjetas con grid.
8. Hacer una sección responsive con media queries.
9. Estilizar un formulario accesible.
10. Crear variables CSS para colores y espacios.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es CSS?
2. ¿Qué diferencia hay entre CSS inline, interno y externo?
3. ¿Qué es un selector?
4. ¿Qué es especificidad?
5. ¿Qué es herencia?
6. ¿Qué incluye el box model?
7. ¿Para qué sirve flexbox?
8. ¿Para qué sirve CSS grid?
9. ¿Qué es responsive design?
10. ¿Para qué sirven las variables CSS?
11. ¿Por qué no conviene ocultar el foco?
12. ¿Cómo ayuda CSS a la accesibilidad?

## Parte 2 — Producción práctica

El estudiante debe entregar una **Landing Page Responsive con CSS**.

Debe incluir:

1. HTML estructurado;
2. archivo CSS externo;
3. variables;
4. estilos base;
5. layout con flexbox;
6. grilla con grid;
7. botones;
8. cards;
9. formulario estilizado;
10. media queries;
11. foco visible;
12. breve documentación.

---

# Glosario básico

CSS: lenguaje de estilos para páginas web.

Selector: regla que indica qué elementos se estilizan.

Clase: atributo reutilizable para aplicar estilos.

ID: identificador único de un elemento.

Cascada: sistema por el cual CSS decide qué regla gana.

Especificidad: peso de una regla CSS.

Herencia: propiedades que pasan de elementos padres a hijos.

Box model: modelo de caja compuesto por contenido, padding, borde y margen.

Padding: espacio interno.

Margin: espacio externo.

Flexbox: sistema de layout unidimensional.

Grid: sistema de layout bidimensional.

Media query: regla para aplicar estilos según condiciones.

Responsive: diseño adaptable a pantallas.

Variable CSS: valor reutilizable definido con `--nombre`.

Foco: estado de elemento activo en navegación por teclado.

---

# Producto final del curso

Al finalizar, el estudiante debe crear una **Landing Page Responsive con CSS**.

Ese producto debe permitir:

- aplicar estilos organizados;
- crear jerarquía visual;
- construir layout flexible;
- adaptar a móvil;
- mejorar accesibilidad;
- reutilizar variables;
- diseñar componentes básicos;
- presentar un curso, producto o servicio con claridad.

El curso termina cuando la persona deja de ver CSS como una lista de propiedades sueltas y empieza a usarlo como un sistema visual para construir interfaces web profesionales.

---

# Fuentes recomendadas para profundizar

- MDN Web Docs — CSS.
- MDN Web Docs — CSS Selectors.
- MDN Web Docs — Box Model.
- MDN Web Docs — Flexbox.
- MDN Web Docs — CSS Grid.
- web.dev — Learn CSS.
- W3C — CSS specifications.
- CSS-Tricks — guías de Flexbox y Grid.
- Materiales introductorios sobre responsive design, accesibilidad visual y sistemas de diseño.

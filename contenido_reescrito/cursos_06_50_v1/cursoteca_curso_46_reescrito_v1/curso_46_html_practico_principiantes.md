# Curso 46 — HTML Práctico para Principiantes

## Presentación del curso

HTML es la base estructural de la web. Cada página, aplicación, blog, tienda online, portal educativo, landing page o documento web comienza con HTML. Aunque muchas herramientas visuales ocultan el código, comprender HTML permite entender cómo se organiza el contenido, cómo navegan los usuarios, cómo leen los buscadores y cómo interactúan las tecnologías de asistencia.

HTML no es un lenguaje de programación en sentido estricto. Es un lenguaje de marcado: sirve para describir la estructura y el significado del contenido. Define títulos, párrafos, enlaces, imágenes, listas, tablas, formularios, secciones, navegación y componentes básicos de una página.

Este curso está pensado para principiantes absolutos o personas que han visto algo de desarrollo web pero necesitan ordenar fundamentos. El enfoque será práctico y profesional: escribir documentos HTML claros, semánticos, accesibles y preparados para ser estilizados con CSS y mejorados con JavaScript.

La idea central es:

> HTML no sirve solo para “poner cosas en pantalla”. Sirve para dar estructura, significado y orden a la información en la web.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es HTML y cuál es su rol en la web.
2. Crear la estructura básica de un documento HTML.
3. Usar etiquetas de texto, títulos, párrafos y énfasis.
4. Crear enlaces internos y externos.
5. Insertar imágenes con texto alternativo.
6. Crear listas ordenadas y desordenadas.
7. Usar tablas solo cuando corresponda.
8. Crear formularios básicos con labels y controles.
9. Aplicar HTML semántico con header, nav, main, section, article y footer.
10. Comprender atributos importantes como id, class, href, src, alt y type.
11. Mejorar accesibilidad básica desde el marcado.
12. Crear una página web completa y bien estructurada.

---

# Módulo 1 — Qué es HTML

## 1.1 Definición

HTML significa HyperText Markup Language. Es el lenguaje de marcado usado para estructurar contenido en la web.

Permite definir:

- títulos;
- párrafos;
- enlaces;
- imágenes;
- listas;
- tablas;
- formularios;
- secciones;
- navegación;
- metadatos;
- contenido principal.

## 1.2 HTML, CSS y JavaScript

HTML define estructura.
CSS define presentación visual.
JavaScript define comportamiento dinámico.

Ejemplo:

- HTML: “esto es un botón”.
- CSS: “el botón es azul y tiene bordes redondeados”.
- JavaScript: “al hacer clic, se abre un menú”.

## 1.3 HTML no es decoración

Una etiqueta HTML debe elegirse por significado, no solo por apariencia.

Malo:

```html
<div>Mi título</div>
```

Mejor:

```html
<h1>Mi título</h1>
```

## 1.4 Por qué importa

HTML correcto mejora:

- accesibilidad;
- SEO;
- mantenimiento;
- compatibilidad;
- lectura de código;
- integración con CSS;
- interacción con JavaScript.

---

# Módulo 2 — Estructura básica de un documento

## 2.1 Documento mínimo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi primera página</title>
</head>
<body>
  <h1>Hola, mundo</h1>
</body>
</html>
```

## 2.2 DOCTYPE

Indica al navegador que el documento usa HTML moderno.

```html
<!DOCTYPE html>
```

## 2.3 html

Contiene todo el documento.

```html
<html lang="es">
```

El atributo `lang` ayuda a lectores de pantalla y buscadores.

## 2.4 head

Incluye metadatos, título, enlaces a CSS y configuración.

## 2.5 body

Contiene lo visible para el usuario.

---

# Módulo 3 — Etiquetas y atributos

## 3.1 Qué es una etiqueta

Una etiqueta marca un elemento.

```html
<p>Esto es un párrafo</p>
```

## 3.2 Etiqueta de apertura y cierre

Muchas etiquetas tienen apertura y cierre.

```html
<h1>Título</h1>
```

## 3.3 Etiquetas vacías

Algunas no tienen contenido interno.

```html
<img src="foto.jpg" alt="Descripción">
```

## 3.4 Atributos

Los atributos agregan información.

```html
<a href="https://example.com">Visitar sitio</a>
```

`href` indica destino.

## 3.5 Atributos comunes

- `id`;
- `class`;
- `href`;
- `src`;
- `alt`;
- `type`;
- `name`;
- `value`;
- `placeholder`;
- `required`.

---

# Módulo 4 — Títulos y jerarquía

## 4.1 Encabezados

HTML tiene títulos de `h1` a `h6`.

```html
<h1>Título principal</h1>
<h2>Sección</h2>
<h3>Subsección</h3>
```

## 4.2 Un h1 principal

Una página debería tener un título principal claro.

## 4.3 Jerarquía lógica

No saltar niveles sin motivo.

Malo:

```html
<h1>Curso</h1>
<h4>Introducción</h4>
```

Mejor:

```html
<h1>Curso</h1>
<h2>Introducción</h2>
```

## 4.4 Importancia

Los encabezados ayudan a:

- lectores de pantalla;
- SEO;
- organización;
- lectura rápida;
- mantenimiento.

## 4.5 No usar por tamaño

El tamaño se cambia con CSS. La etiqueta define estructura.

---

# Módulo 5 — Párrafos, énfasis y texto

## 5.1 Párrafos

```html
<p>Este es un párrafo de contenido.</p>
```

## 5.2 Énfasis

```html
<em>importante</em>
```

Indica énfasis.

## 5.3 Importancia fuerte

```html
<strong>Atención:</strong>
```

Indica relevancia fuerte.

## 5.4 Saltos de línea

`<br>` debe usarse con moderación. Para separar bloques, usar párrafos o CSS.

## 5.5 Texto claro

HTML estructura el texto, pero el contenido debe ser comprensible.

---

# Módulo 6 — Enlaces

## 6.1 Etiqueta a

```html
<a href="https://example.com">Visitar sitio</a>
```

## 6.2 Enlaces internos

```html
<a href="contacto.html">Contacto</a>
```

## 6.3 Enlaces a secciones

```html
<a href="#servicios">Ver servicios</a>

<section id="servicios">
  <h2>Servicios</h2>
</section>
```

## 6.4 Texto descriptivo

Malo:

```html
<a href="curso.html">Click aquí</a>
```

Mejor:

```html
<a href="curso.html">Ver curso de HTML práctico</a>
```

## 6.5 Abrir en nueva pestaña

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Abrir recurso</a>
```

Usar con criterio.

---

# Módulo 7 — Imágenes

## 7.1 Etiqueta img

```html
<img src="imagen.jpg" alt="Persona usando una notebook">
```

## 7.2 src

Indica la ruta de la imagen.

## 7.3 alt

Describe la imagen.

Debe ser útil para quien no la ve o si no carga.

## 7.4 Imagen decorativa

```html
<img src="adorno.png" alt="">
```

## 7.5 figure y figcaption

```html
<figure>
  <img src="grafico.png" alt="Ventas suben entre enero y junio">
  <figcaption>Evolución de ventas durante el semestre.</figcaption>
</figure>
```

Útil para imágenes con explicación.

---

# Módulo 8 — Listas

## 8.1 Lista desordenada

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

## 8.2 Lista ordenada

```html
<ol>
  <li>Crear archivo</li>
  <li>Escribir HTML</li>
  <li>Guardar</li>
</ol>
```

## 8.3 Cuándo usar listas

Usar listas para:

- pasos;
- características;
- requisitos;
- beneficios;
- menús;
- recursos.

## 8.4 Listas anidadas

```html
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
</ul>
```

## 8.5 Ventaja

Las listas mejoran lectura y estructura.

---

# Módulo 9 — Tablas

## 9.1 Cuándo usar tablas

Usar tablas para datos tabulares, no para diseñar layouts.

## 9.2 Tabla básica

```html
<table>
  <thead>
    <tr>
      <th>Curso</th>
      <th>Nivel</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML</td>
      <td>Inicial</td>
    </tr>
  </tbody>
</table>
```

## 9.3 th y td

`th` define encabezados.
`td` define datos.

## 9.4 caption

```html
<caption>Listado de cursos disponibles</caption>
```

Ayuda a comprender la tabla.

## 9.5 Accesibilidad

Las tablas deben tener encabezados claros y estructura simple.

---

# Módulo 10 — Formularios

## 10.1 Para qué sirven

Los formularios permiten recibir información del usuario.

Ejemplos:

- contacto;
- registro;
- búsqueda;
- compra;
- encuesta;
- inscripción.

## 10.2 form

```html
<form>
  ...
</form>
```

## 10.3 label e input

```html
<label for="nombre">Nombre</label>
<input id="nombre" name="nombre" type="text">
```

## 10.4 Importancia de label

La label mejora accesibilidad y usabilidad.

## 10.5 Botón de envío

```html
<button type="submit">Enviar</button>
```

Usar botón real, no un `div`.

---

# Módulo 11 — Tipos de input

## 11.1 Texto

```html
<input type="text">
```

## 11.2 Correo

```html
<input type="email">
```

## 11.3 Contraseña

```html
<input type="password">
```

## 11.4 Número

```html
<input type="number">
```

## 11.5 Fecha

```html
<input type="date">
```

## 11.6 Checkbox

```html
<input type="checkbox" id="acepto">
<label for="acepto">Acepto términos</label>
```

## 11.7 Radio

```html
<input type="radio" name="nivel" id="basico">
<label for="basico">Básico</label>
```

---

# Módulo 12 — Select, textarea y validación básica

## 12.1 Select

```html
<label for="curso">Curso</label>
<select id="curso" name="curso">
  <option value="html">HTML</option>
  <option value="css">CSS</option>
</select>
```

## 12.2 Textarea

```html
<label for="mensaje">Mensaje</label>
<textarea id="mensaje" name="mensaje"></textarea>
```

## 12.3 Required

```html
<input id="email" type="email" required>
```

## 12.4 Placeholder

Puede dar ejemplo, pero no reemplaza la label.

## 12.5 Fieldset y legend

```html
<fieldset>
  <legend>Preferencia de contacto</legend>
  ...
</fieldset>
```

Útil para agrupar campos.

---

# Módulo 13 — HTML semántico

## 13.1 Qué es

HTML semántico usa etiquetas según significado.

## 13.2 Header

```html
<header>
  <h1>Mi sitio</h1>
</header>
```

## 13.3 Nav

```html
<nav>
  <a href="#inicio">Inicio</a>
  <a href="#cursos">Cursos</a>
</nav>
```

## 13.4 Main

```html
<main>
  <h1>Contenido principal</h1>
</main>
```

Debe haber un `main` principal.

## 13.5 Section y article

`section` agrupa una sección temática.
`article` representa contenido independiente.

## 13.6 Footer

```html
<footer>
  <p>© 2026 Mi sitio</p>
</footer>
```

---

# Módulo 14 — Div y span

## 14.1 Div

`div` es un contenedor genérico de bloque.

```html
<div class="card">
  ...
</div>
```

## 14.2 Span

`span` es un contenedor genérico en línea.

```html
<p>Estado: <span class="badge">Activo</span></p>
```

## 14.3 Cuándo usarlos

Usarlos cuando no exista una etiqueta semántica más adecuada.

## 14.4 Error común

Construir toda la página con `div`.

## 14.5 Regla

Primero pensar significado. Luego contenedor.

---

# Módulo 15 — Rutas y archivos

## 15.1 Archivos comunes

Un proyecto básico puede tener:

```text
index.html
styles.css
script.js
img/
```

## 15.2 Rutas relativas

```html
<img src="img/logo.png" alt="Logo">
```

## 15.3 Subcarpetas

Si el archivo está en otra carpeta, la ruta cambia.

## 15.4 Errores frecuentes

- mayúsculas distintas;
- extensión incorrecta;
- carpeta mal escrita;
- archivo no subido;
- espacios raros en nombres.

## 15.5 Buenas prácticas

Usar nombres simples:

- `logo.png`;
- `hero.jpg`;
- `curso-html.html`.

---

# Módulo 16 — Metadatos básicos

## 16.1 Title

```html
<title>Curso HTML Práctico</title>
```

Aparece en pestaña y buscadores.

## 16.2 Description

```html
<meta name="description" content="Curso inicial para aprender HTML práctico desde cero.">
```

## 16.3 Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Clave para diseño responsive.

## 16.4 Charset

```html
<meta charset="UTF-8">
```

Permite caracteres como ñ y tildes.

## 16.5 SEO básico

Un buen HTML ayuda a que el contenido sea entendido por buscadores.

---

# Módulo 17 — Accesibilidad inicial

## 17.1 lang

```html
<html lang="es">
```

Indica idioma.

## 17.2 Labels

Todo campo de formulario debe tener label.

## 17.3 Alt

Toda imagen informativa debe tener alt útil.

## 17.4 Botones reales

Usar:

```html
<button>Enviar</button>
```

No:

```html
<div onclick="...">Enviar</div>
```

## 17.5 Orden lógico

El contenido debe leerse en orden natural.

---

# Módulo 18 — Errores comunes

## 18.1 Etiquetas sin cerrar

```html
<p>Texto
```

Debe cerrarse:

```html
<p>Texto</p>
```

## 18.2 Anidar mal

Malo:

```html
<p><div>Texto</div></p>
```

## 18.3 Usar br para diseño

No usar muchos `<br>` para crear espacios. Eso corresponde a CSS.

## 18.4 Omitir alt

Las imágenes importantes necesitan alt.

## 18.5 Enlaces vacíos

Evitar:

```html
<a href="#">Ver más</a>
```

si no tiene comportamiento definido.

## 18.6 Duplicar id

Cada id debe ser único.

---

# Módulo 19 — Proyecto final: página completa

## 19.1 Objetivo

Crear una página web completa y semántica.

Tema sugerido:

- curso;
- emprendimiento;
- portfolio;
- servicio;
- tienda simple;
- blog;
- proyecto personal.

## 19.2 Estructura mínima

Debe incluir:

- header;
- nav;
- main;
- hero;
- secciones;
- tarjetas;
- imagen;
- lista;
- tabla si corresponde;
- formulario;
- footer.

## 19.3 Requisitos

- documento HTML válido;
- idioma definido;
- metadatos básicos;
- jerarquía de títulos;
- enlaces descriptivos;
- imágenes con alt;
- formulario con labels;
- semántica correcta.

## 19.4 CSS opcional

Puede vincularse un CSS, pero la evaluación del curso se centra en HTML.

## 19.5 Entrega

Archivo:

- `index.html`.

Opcional:

- `styles.css`;
- carpeta `img`.

---

# Caso práctico integrador

## Caso: página de curso

Se crea una página para promocionar un curso de CSS.

### Paso 1 — Documento base

Se crea `index.html` con DOCTYPE, lang, head y body.

### Paso 2 — Header y navegación

Se agregan enlaces a secciones.

### Paso 3 — Main

Incluye hero, objetivos, módulos y formulario.

### Paso 4 — Imagen

Se agrega imagen con alt.

### Paso 5 — Formulario

Incluye nombre, email, curso y mensaje, todos con labels.

### Paso 6 — Footer

Incluye información de contacto.

### Resultado

La página tiene estructura clara, semántica y preparada para CSS.

---

# Actividades del curso

1. Crear un documento HTML básico.
2. Agregar título, descripción y viewport.
3. Crear jerarquía de encabezados.
4. Escribir párrafos y textos con énfasis.
5. Crear enlaces internos y externos.
6. Insertar imágenes con alt.
7. Crear listas ordenadas y desordenadas.
8. Crear una tabla simple con caption.
9. Crear formulario con labels.
10. Convertir una página con divs en HTML semántico.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es HTML?
2. ¿Cuál es la diferencia entre HTML, CSS y JavaScript?
3. ¿Para qué sirve DOCTYPE?
4. ¿Por qué es importante `lang`?
5. ¿Qué va dentro de head?
6. ¿Qué va dentro de body?
7. ¿Qué es un atributo?
8. ¿Por qué importa la jerarquía de encabezados?
9. ¿Para qué sirve alt?
10. ¿Por qué una label es importante?
11. ¿Qué es HTML semántico?
12. ¿Cuándo usar div?

## Parte 2 — Producción práctica

El estudiante debe entregar una **Página HTML Semántica Completa**.

Debe incluir:

1. estructura básica;
2. metadatos;
3. header;
4. nav;
5. main;
6. secciones;
7. títulos jerárquicos;
8. enlaces;
9. imágenes con alt;
10. listas;
11. formulario accesible;
12. footer.

---

# Glosario básico

HTML: lenguaje de marcado para estructurar contenido web.

Etiqueta: marca que define un elemento.

Atributo: información adicional de una etiqueta.

Elemento: etiqueta completa con contenido y atributos.

DOCTYPE: declaración del tipo de documento.

Head: sección de metadatos.

Body: sección visible de la página.

H1-H6: encabezados jerárquicos.

Párrafo: bloque de texto.

Enlace: elemento que lleva a otra página o sección.

Imagen: recurso visual insertado con `img`.

Alt: texto alternativo de imagen.

Lista: conjunto de elementos ordenados o no ordenados.

Tabla: estructura para datos tabulares.

Formulario: conjunto de campos para enviar información.

Label: etiqueta descriptiva de un campo.

HTML semántico: uso de etiquetas según significado.

Div: contenedor genérico de bloque.

Span: contenedor genérico en línea.

---

# Producto final del curso

Al finalizar, el estudiante debe crear una **Página HTML Semántica Completa**.

Ese producto debe permitir:

- estructurar contenido;
- usar etiquetas correctas;
- crear navegación;
- insertar imágenes;
- crear formularios;
- mejorar accesibilidad;
- preparar la página para CSS;
- sostener buenas prácticas web.

El curso termina cuando la persona deja de ver HTML como una colección de etiquetas sueltas y empieza a usarlo como la arquitectura semántica de una página web.

---

# Fuentes recomendadas para profundizar

- MDN Web Docs — HTML.
- MDN Web Docs — HTML elements reference.
- web.dev — Learn HTML.
- W3C — HTML standard.
- WHATWG — HTML Living Standard.
- W3C Web Accessibility Initiative.
- Materiales introductorios sobre HTML semántico, formularios y accesibilidad inicial.

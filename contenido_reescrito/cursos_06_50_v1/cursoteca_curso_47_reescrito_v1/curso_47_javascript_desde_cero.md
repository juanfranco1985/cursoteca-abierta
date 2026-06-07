# Curso 47 — JavaScript desde Cero

## Presentación del curso

JavaScript es el lenguaje que permite agregar comportamiento e interactividad a las páginas web. Mientras HTML define la estructura y CSS define la apariencia visual, JavaScript permite responder a acciones del usuario, modificar contenido, validar formularios, abrir menús, crear juegos, consumir APIs, manejar datos y construir aplicaciones web completas.

Aprender JavaScript desde cero es un paso clave para pasar de páginas estáticas a proyectos dinámicos. Una página con JavaScript puede reaccionar a clics, guardar información, mostrar mensajes, filtrar elementos, calcular resultados, conectarse a servicios externos y actualizar la interfaz sin recargar toda la página.

Este curso está pensado para principiantes que ya tienen nociones básicas de HTML y CSS, o que están construyendo proyectos web simples y quieren empezar a programar. No requiere experiencia previa en programación. El enfoque será práctico y progresivo: conceptos fundamentales, ejemplos pequeños, manipulación del DOM, eventos, formularios, arrays, objetos, funciones, errores y un proyecto final interactivo.

La idea central es:

> JavaScript permite que una página web deje de ser solo contenido visible y se convierta en una experiencia interactiva.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es JavaScript y para qué se usa.
2. Conectar un archivo JavaScript con HTML.
3. Usar variables, constantes y tipos de datos.
4. Aplicar operadores, condiciones y bucles.
5. Crear funciones simples y reutilizables.
6. Trabajar con arrays y objetos.
7. Manipular el DOM para cambiar contenido.
8. Escuchar eventos como clics, envíos y cambios.
9. Validar formularios básicos.
10. Manejar errores frecuentes de principiantes.
11. Usar `fetch` básico para consumir datos.
12. Crear una mini aplicación web interactiva.

---

# Módulo 1 — Qué es JavaScript

## 1.1 Definición

JavaScript es un lenguaje de programación usado principalmente en la web para agregar interactividad, lógica y comportamiento a las páginas.

Permite:

- responder a clics;
- validar formularios;
- cambiar textos;
- mostrar u ocultar elementos;
- crear animaciones;
- consumir APIs;
- manejar datos;
- construir aplicaciones;
- desarrollar juegos;
- trabajar con servidores mediante Node.js.

## 1.2 JavaScript en la web

En una página web:

- HTML estructura;
- CSS presenta;
- JavaScript actúa.

Ejemplo:

- HTML crea un botón.
- CSS lo hace visible y atractivo.
- JavaScript define qué pasa al hacer clic.

## 1.3 JavaScript no es Java

JavaScript y Java son lenguajes distintos. Comparten parte del nombre por razones históricas, pero no son lo mismo.

## 1.4 Dónde se ejecuta

JavaScript puede ejecutarse:

- en el navegador;
- en servidores con Node.js;
- en aplicaciones móviles;
- en herramientas de escritorio;
- en entornos de automatización.

Este curso se centra en JavaScript del navegador.

---

# Módulo 2 — Conectar JavaScript con HTML

## 2.1 Archivo externo

Crear un archivo:

```text
script.js
```

Conectarlo en HTML:

```html
<script src="script.js"></script>
```

Suele colocarse antes de cerrar `body`.

## 2.2 Código interno

También puede escribirse:

```html
<script>
  console.log("Hola");
</script>
```

Pero para proyectos ordenados conviene archivo externo.

## 2.3 Consola

La consola del navegador permite ver mensajes y errores.

```js
console.log("JavaScript funcionando");
```

## 2.4 DevTools

Las herramientas de desarrollador permiten inspeccionar HTML, CSS, consola, red y errores.

## 2.5 Primer programa

```js
console.log("Hola, mundo");
```

---

# Módulo 3 — Variables y constantes

## 3.1 Variable

Una variable guarda un valor.

```js
let nombre = "Ana";
```

## 3.2 Constante

Una constante guarda un valor que no debería reasignarse.

```js
const curso = "JavaScript desde Cero";
```

## 3.3 var

`var` es una forma antigua. Para código moderno, usar `let` y `const`.

## 3.4 Reasignación

```js
let puntos = 0;
puntos = 10;
```

## 3.5 Nombres claros

Malo:

```js
let x = 25;
```

Mejor:

```js
let edadUsuario = 25;
```

---

# Módulo 4 — Tipos de datos

## 4.1 String

Texto.

```js
const ciudad = "Santa Fe";
```

## 4.2 Number

Números.

```js
const precio = 12000;
```

## 4.3 Boolean

Verdadero o falso.

```js
const usuarioActivo = true;
```

## 4.4 Null

Representa ausencia intencional de valor.

```js
let resultado = null;
```

## 4.5 Undefined

Una variable declarada sin valor queda undefined.

```js
let mensaje;
```

## 4.6 Array

Lista de elementos.

```js
const cursos = ["HTML", "CSS", "JavaScript"];
```

## 4.7 Object

Conjunto de propiedades.

```js
const usuario = {
  nombre: "Ana",
  edad: 30
};
```

---

# Módulo 5 — Operadores

## 5.1 Aritméticos

```js
const suma = 10 + 5;
const resta = 10 - 5;
const multiplicacion = 10 * 5;
const division = 10 / 5;
```

## 5.2 Comparación

```js
10 > 5;
10 === 10;
10 !== 8;
```

## 5.3 Igualdad estricta

Usar `===` en vez de `==` para evitar conversiones confusas.

## 5.4 Lógicos

```js
const puedeComprar = edad >= 18 && tieneDinero;
const puedeEntrar = esSocio || tieneInvitacion;
```

## 5.5 Template literals

```js
const mensaje = `Hola, ${nombre}`;
```

---

# Módulo 6 — Condicionales

## 6.1 if

```js
if (edad >= 18) {
  console.log("Mayor de edad");
}
```

## 6.2 else

```js
if (edad >= 18) {
  console.log("Puede ingresar");
} else {
  console.log("No puede ingresar");
}
```

## 6.3 else if

```js
if (nota >= 9) {
  console.log("Excelente");
} else if (nota >= 6) {
  console.log("Aprobado");
} else {
  console.log("Revisar");
}
```

## 6.4 Condiciones múltiples

```js
if (usuarioActivo && pagoConfirmado) {
  console.log("Acceso permitido");
}
```

## 6.5 Uso práctico

Las condiciones sirven para:

- validar edad;
- revisar formularios;
- mostrar mensajes;
- controlar estados;
- decidir acciones.

---

# Módulo 7 — Bucles

## 7.1 for

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

## 7.2 Recorrer array

```js
const cursos = ["HTML", "CSS", "JavaScript"];

for (let i = 0; i < cursos.length; i++) {
  console.log(cursos[i]);
}
```

## 7.3 for...of

```js
for (const curso of cursos) {
  console.log(curso);
}
```

## 7.4 while

```js
let contador = 0;

while (contador < 5) {
  console.log(contador);
  contador++;
}
```

## 7.5 Cuidado

Evitar bucles infinitos. Siempre debe haber una condición que eventualmente termine.

---

# Módulo 8 — Funciones

## 8.1 Qué es una función

Una función agrupa código reutilizable.

```js
function saludar() {
  console.log("Hola");
}
```

## 8.2 Ejecutar función

```js
saludar();
```

## 8.3 Parámetros

```js
function saludar(nombre) {
  console.log(`Hola, ${nombre}`);
}
```

## 8.4 Return

```js
function sumar(a, b) {
  return a + b;
}
```

## 8.5 Funciones flecha

```js
const multiplicar = (a, b) => {
  return a * b;
};
```

## 8.6 Buenas prácticas

Una función debería hacer una tarea clara.

---

# Módulo 9 — Arrays

## 9.1 Crear array

```js
const productos = ["Remera", "Gorra", "Pantalón"];
```

## 9.2 Acceder

```js
productos[0];
```

JavaScript empieza desde cero.

## 9.3 Agregar

```js
productos.push("Campera");
```

## 9.4 Eliminar último

```js
productos.pop();
```

## 9.5 Métodos útiles

```js
productos.includes("Gorra");
productos.length;
```

## 9.6 Recorrer

```js
productos.forEach(producto => {
  console.log(producto);
});
```

---

# Módulo 10 — Objetos

## 10.1 Crear objeto

```js
const producto = {
  nombre: "Remera",
  precio: 12000,
  stock: 5
};
```

## 10.2 Acceder a propiedades

```js
producto.nombre;
producto["precio"];
```

## 10.3 Modificar

```js
producto.stock = 4;
```

## 10.4 Array de objetos

```js
const productos = [
  { nombre: "Remera", precio: 12000 },
  { nombre: "Gorra", precio: 5000 }
];
```

## 10.5 Uso real

Los datos de APIs suelen llegar como objetos y arrays de objetos.

---

# Módulo 11 — Métodos modernos de arrays

## 11.1 map

Transforma elementos.

```js
const nombres = productos.map(producto => producto.nombre);
```

## 11.2 filter

Filtra elementos.

```js
const baratos = productos.filter(producto => producto.precio < 10000);
```

## 11.3 find

Encuentra un elemento.

```js
const encontrado = productos.find(producto => producto.nombre === "Gorra");
```

## 11.4 reduce

Acumula valores.

```js
const total = productos.reduce((suma, producto) => suma + producto.precio, 0);
```

## 11.5 Importancia

Estos métodos son muy usados en interfaces, filtros, carritos, listados y análisis simples.

---

# Módulo 12 — DOM

## 12.1 Qué es el DOM

DOM significa Document Object Model. Es la representación del HTML como estructura manipulable desde JavaScript.

## 12.2 Seleccionar elemento

```js
const titulo = document.querySelector("h1");
```

## 12.3 Cambiar texto

```js
titulo.textContent = "Nuevo título";
```

## 12.4 Cambiar clases

```js
titulo.classList.add("activo");
titulo.classList.remove("activo");
titulo.classList.toggle("activo");
```

## 12.5 Seleccionar varios

```js
const botones = document.querySelectorAll("button");
```

---

# Módulo 13 — Eventos

## 13.1 Qué es un evento

Un evento ocurre cuando el usuario o el navegador hace algo.

Ejemplos:

- click;
- submit;
- input;
- change;
- keydown;
- load.

## 13.2 Escuchar click

```js
const boton = document.querySelector("#boton");

boton.addEventListener("click", () => {
  console.log("Click");
});
```

## 13.3 Evento submit

```js
const formulario = document.querySelector("#formulario");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Formulario enviado");
});
```

## 13.4 this y event

El objeto `event` contiene información sobre lo ocurrido.

## 13.5 Buenas prácticas

No mezclar demasiada lógica dentro del evento. Usar funciones separadas.

---

# Módulo 14 — Formularios

## 14.1 Obtener valor

```js
const input = document.querySelector("#nombre");
console.log(input.value);
```

## 14.2 Validación simple

```js
if (input.value.trim() === "") {
  console.log("El campo es obligatorio");
}
```

## 14.3 Mostrar error

```js
const error = document.querySelector("#error");
error.textContent = "Ingresá tu nombre";
```

## 14.4 Limpiar formulario

```js
formulario.reset();
```

## 14.5 Uso

Los formularios permiten crear:

- contacto;
- búsqueda;
- login;
- registro;
- filtros;
- calculadoras.

---

# Módulo 15 — Renderizar contenido

## 15.1 Crear HTML desde datos

```js
const lista = document.querySelector("#lista");

productos.forEach(producto => {
  lista.innerHTML += `<li>${producto.nombre}</li>`;
});
```

## 15.2 Cuidado con innerHTML

`innerHTML` es cómodo, pero si se insertan datos no confiables puede haber riesgos de seguridad.

## 15.3 createElement

```js
const item = document.createElement("li");
item.textContent = producto.nombre;
lista.appendChild(item);
```

## 15.4 Renderizar cards

```js
function renderProductos(productos) {
  contenedor.innerHTML = "";

  productos.forEach(producto => {
    const card = document.createElement("article");
    card.className = "card";
    card.textContent = producto.nombre;
    contenedor.appendChild(card);
  });
}
```

## 15.5 Estado vacío

Si no hay resultados, mostrar mensaje.

---

# Módulo 16 — LocalStorage

## 16.1 Qué es

LocalStorage permite guardar datos simples en el navegador.

```js
localStorage.setItem("nombre", "Ana");
```

## 16.2 Leer

```js
const nombre = localStorage.getItem("nombre");
```

## 16.3 Eliminar

```js
localStorage.removeItem("nombre");
```

## 16.4 Guardar objetos

```js
localStorage.setItem("producto", JSON.stringify(producto));
```

Leer:

```js
const productoGuardado = JSON.parse(localStorage.getItem("producto"));
```

## 16.5 Cuidado

LocalStorage no es base de datos segura. No guardar contraseñas, tarjetas ni datos sensibles.

---

# Módulo 17 — Fetch básico

## 17.1 Consumir API

```js
async function cargarDatos() {
  const respuesta = await fetch("https://api.ejemplo.com/datos");
  const datos = await respuesta.json();
  console.log(datos);
}
```

## 17.2 Manejar error

```js
async function cargarDatos() {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error("Error HTTP");
    }

    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error(error);
  }
}
```

## 17.3 Mostrar carga

Mientras se cargan datos, mostrar mensaje.

## 17.4 Usos

- clima;
- noticias;
- productos;
- cursos;
- países;
- personajes;
- indicadores.

## 17.5 Seguridad

No exponer claves privadas en JavaScript público.

---

# Módulo 18 — Errores comunes

## 18.1 ReferenceError

Variable no definida.

```js
console.log(nombre);
```

si `nombre` no existe.

## 18.2 TypeError

Intentar usar algo con tipo incorrecto.

## 18.3 SyntaxError

Error de sintaxis: paréntesis, llaves o comillas mal cerradas.

## 18.4 querySelector devuelve null

Ocurre si el selector no encuentra elemento.

## 18.5 Orden de carga

Si JavaScript corre antes de que exista el HTML, puede fallar. Colocar script al final del body o usar `defer`.

```html
<script src="script.js" defer></script>
```

---

# Módulo 19 — Buenas prácticas

## 19.1 Nombres claros

Usar nombres descriptivos.

```js
const totalCarrito = 0;
```

## 19.2 Separar responsabilidades

- datos;
- funciones;
- eventos;
- render;
- validación.

## 19.3 Código pequeño

Evitar funciones enormes.

## 19.4 Comentar con criterio

Explicar intención, no cada línea obvia.

## 19.5 Probar seguido

Después de cada cambio, probar en navegador y consola.

---

# Módulo 20 — Proyecto final: app interactiva

## 20.1 Objetivo

Crear una mini aplicación web interactiva.

Opciones:

- lista de tareas;
- catálogo filtrable;
- calculadora de precios;
- formulario de contacto;
- buscador con API;
- carrito simple;
- juego básico;
- quiz.

## 20.2 Requisitos

Debe incluir:

- HTML;
- CSS;
- JavaScript externo;
- eventos;
- manipulación DOM;
- funciones;
- arrays u objetos;
- validación;
- estado vacío o error;
- localStorage o fetch opcional.

## 20.3 Ejemplo: lista de tareas

Funciones:

- agregar tarea;
- marcar completada;
- eliminar;
- guardar en localStorage;
- mostrar contador.

## 20.4 Evaluación

Se evaluará:

- claridad;
- funcionamiento;
- orden;
- nombres;
- interacción;
- manejo de errores;
- experiencia de usuario.

## 20.5 Entrega

Archivos:

- `index.html`;
- `styles.css`;
- `script.js`;
- README breve.

---

# Caso práctico integrador

## Caso: catálogo filtrable de cursos

Una página muestra cursos disponibles y permite filtrar por categoría.

### Paso 1 — Datos

```js
const cursos = [
  { titulo: "HTML", categoria: "Web" },
  { titulo: "Excel", categoria: "Datos" },
  { titulo: "Marketing", categoria: "Emprendimiento" }
];
```

### Paso 2 — Render

Se crean cards dinámicamente.

### Paso 3 — Filtro

Un select permite elegir categoría.

### Paso 4 — Evento

Al cambiar el select, se actualiza la lista.

### Paso 5 — Estado vacío

Si no hay cursos, se muestra mensaje.

### Resultado

La página deja de ser estática y responde a la acción del usuario.

---

# Actividades del curso

1. Conectar archivo JavaScript a HTML.
2. Crear variables y constantes.
3. Escribir condiciones.
4. Crear bucles.
5. Crear funciones.
6. Crear arrays y objetos.
7. Manipular texto del DOM.
8. Escuchar eventos de click.
9. Validar un formulario.
10. Renderizar una lista desde un array.
11. Guardar un dato en localStorage.
12. Consumir una API simple con fetch.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es JavaScript?
2. ¿Qué diferencia hay entre HTML, CSS y JavaScript?
3. ¿Qué es una variable?
4. ¿Qué diferencia hay entre let y const?
5. ¿Qué es un array?
6. ¿Qué es un objeto?
7. ¿Qué es una función?
8. ¿Qué es el DOM?
9. ¿Qué es un evento?
10. ¿Para qué sirve preventDefault?
11. ¿Qué es localStorage?
12. ¿Qué hace fetch?

## Parte 2 — Producción práctica

El estudiante debe entregar una **Mini Aplicación Web Interactiva**.

Debe incluir:

1. HTML estructurado;
2. CSS básico;
3. archivo JavaScript externo;
4. variables;
5. funciones;
6. arrays u objetos;
7. eventos;
8. manipulación del DOM;
9. validación;
10. render dinámico;
11. manejo de estado vacío o error;
12. README breve.

---

# Glosario básico

JavaScript: lenguaje de programación usado para interactividad web.

Variable: espacio para guardar un valor.

Constante: valor que no debería reasignarse.

String: texto.

Number: número.

Boolean: verdadero o falso.

Array: lista de elementos.

Object: estructura de propiedades y valores.

Function: bloque reutilizable de código.

Condition: decisión lógica.

Loop: repetición de instrucciones.

DOM: representación del HTML manipulable con JavaScript.

Event: acción detectada por el navegador.

Listener: función que escucha un evento.

Form: formulario.

LocalStorage: almacenamiento simple en navegador.

Fetch: función para hacer peticiones HTTP.

JSON: formato de datos.

Error: problema de ejecución o sintaxis.

---

# Producto final del curso

Al finalizar, el estudiante debe crear una **Mini Aplicación Web Interactiva**.

Ese producto debe permitir:

- responder a acciones del usuario;
- modificar el DOM;
- trabajar con datos;
- validar entradas;
- renderizar contenido;
- usar funciones;
- organizar código;
- crear una experiencia web dinámica.

El curso termina cuando la persona deja de ver JavaScript como código abstracto y empieza a usarlo para crear comportamiento real en una página web.

---

# Fuentes recomendadas para profundizar

- MDN Web Docs — JavaScript.
- MDN Web Docs — DOM.
- MDN Web Docs — Events.
- MDN Web Docs — Fetch API.
- JavaScript.info.
- freeCodeCamp JavaScript Basics.
- Eloquent JavaScript.
- web.dev — JavaScript.
- Materiales introductorios sobre programación, DOM, eventos, formularios y APIs.

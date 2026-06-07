# Curso 49 — React Básico para Principiantes

## Presentación del curso

React es una de las bibliotecas más usadas para construir interfaces web modernas. Permite crear aplicaciones a partir de componentes reutilizables, manejar estados, responder a eventos, renderizar listas, construir formularios, consumir datos externos y organizar proyectos frontend de manera más escalable que con HTML, CSS y JavaScript sueltos.

Para una persona que ya conoce HTML, CSS y JavaScript básico, React representa un salto importante: se deja de pensar la página como un documento estático y se empieza a pensar la interfaz como un conjunto de piezas dinámicas que reciben datos, cambian estado y se actualizan automáticamente.

Este curso está pensado para principiantes que quieren entrar al desarrollo frontend moderno. No busca cubrir React avanzado, Next.js o arquitectura empresarial, sino enseñar las bases necesarias para entender componentes, JSX, props, estado, eventos, listas, formularios, efectos y estructura de una mini aplicación.

La idea central es:

> React ayuda a construir interfaces como sistemas de componentes: piezas pequeñas, reutilizables y conectadas por datos.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es React y para qué se usa.
2. Entender la diferencia entre una página HTML tradicional y una interfaz basada en componentes.
3. Crear un proyecto básico con React.
4. Escribir componentes funcionales.
5. Usar JSX correctamente.
6. Pasar información mediante props.
7. Manejar estado con `useState`.
8. Responder a eventos.
9. Renderizar listas.
10. Crear formularios controlados.
11. Usar `useEffect` de manera inicial.
12. Consumir datos simples desde una API.
13. Organizar una mini aplicación React.
14. Crear un proyecto final básico.

---

# Módulo 1 — Qué es React

## 1.1 Definición

React es una biblioteca de JavaScript para construir interfaces de usuario.

Fue creada para facilitar la construcción de interfaces dinámicas, reutilizables y mantenibles.

## 1.2 Biblioteca, no framework completo

React se centra principalmente en la interfaz. Para routing, backend, manejo global de estado o renderizado avanzado se pueden sumar otras herramientas.

## 1.3 Por qué se usa

React permite:

- crear componentes reutilizables;
- actualizar interfaz según datos;
- manejar estado;
- organizar proyectos;
- separar lógica visual;
- construir aplicaciones interactivas;
- escalar interfaces complejas.

## 1.4 Ejemplos de uso

- dashboards;
- plataformas educativas;
- tiendas online;
- paneles administrativos;
- blogs modernos;
- aplicaciones internas;
- formularios complejos;
- herramientas interactivas.

---

# Módulo 2 — De HTML a componentes

## 2.1 Página tradicional

En HTML tradicional se escribe una estructura completa.

```html
<section>
  <h2>Curso HTML</h2>
  <p>Nivel inicial</p>
</section>
```

## 2.2 Componente React

En React, esa pieza puede convertirse en componente.

```jsx
function CursoCard() {
  return (
    <section>
      <h2>Curso HTML</h2>
      <p>Nivel inicial</p>
    </section>
  );
}
```

## 2.3 Reutilización

Un componente puede usarse muchas veces.

## 2.4 Ventaja

Si el diseño o lógica cambia, se modifica el componente y se actualiza en todos los lugares donde se usa.

## 2.5 Mentalidad

Pensar la interfaz como partes:

- Header;
- Footer;
- Card;
- Button;
- CourseList;
- Form;
- Dashboard.

---

# Módulo 3 — Crear un proyecto React

## 3.1 Herramientas

Para empezar se puede usar Vite, una herramienta moderna y rápida.

Comando típico:

```bash
npm create vite@latest mi-app
```

Luego:

```bash
cd mi-app
npm install
npm run dev
```

## 3.2 Node.js

React moderno suele requerir Node.js y npm para instalar dependencias y ejecutar el entorno de desarrollo.

## 3.3 Estructura inicial

Un proyecto puede incluir:

```text
src/
  App.jsx
  main.jsx
  index.css
package.json
index.html
```

## 3.4 Servidor de desarrollo

`npm run dev` abre un servidor local para probar la app.

## 3.5 Build

Para publicar:

```bash
npm run build
```

Genera archivos optimizados.

---

# Módulo 4 — JSX

## 4.1 Qué es JSX

JSX es una sintaxis que permite escribir estructura parecida a HTML dentro de JavaScript.

```jsx
const titulo = <h1>Hola React</h1>;
```

## 4.2 No es HTML puro

En JSX algunas cosas cambian:

- `class` se escribe `className`;
- los estilos inline usan objetos;
- debe haber un elemento padre;
- las expresiones JS van entre llaves.

## 4.3 className

```jsx
<h1 className="titulo">Hola</h1>
```

## 4.4 Expresiones

```jsx
const nombre = "Ana";

function App() {
  return <h1>Hola, {nombre}</h1>;
}
```

## 4.5 Fragment

Si no se quiere agregar un div extra:

```jsx
<>
  <h1>Título</h1>
  <p>Texto</p>
</>
```

---

# Módulo 5 — Componentes funcionales

## 5.1 Crear componente

```jsx
function Saludo() {
  return <h1>Hola</h1>;
}
```

## 5.2 Usar componente

```jsx
function App() {
  return (
    <main>
      <Saludo />
    </main>
  );
}
```

## 5.3 Nombres

Los componentes empiezan con mayúscula.

Correcto:

```jsx
function CourseCard() {}
```

## 5.4 Un componente, una responsabilidad

Un componente debería tener una función clara.

## 5.5 Archivos separados

En proyectos más grandes, cada componente puede tener su archivo.

```text
components/
  CourseCard.jsx
```

---

# Módulo 6 — Props

## 6.1 Qué son props

Props son datos que se pasan de un componente padre a un componente hijo.

## 6.2 Ejemplo

```jsx
function CursoCard({ titulo, nivel }) {
  return (
    <article>
      <h2>{titulo}</h2>
      <p>{nivel}</p>
    </article>
  );
}
```

Uso:

```jsx
<CursoCard titulo="HTML" nivel="Inicial" />
```

## 6.3 Props hacen componentes reutilizables

El mismo componente puede mostrar distintos cursos.

## 6.4 Props no se modifican

Un componente no debe cambiar directamente sus props.

## 6.5 Buenas prácticas

Usar nombres claros y pasar solo datos necesarios.

---

# Módulo 7 — Estado con useState

## 7.1 Qué es estado

El estado representa datos que pueden cambiar durante el uso de la aplicación.

Ejemplos:

- contador;
- formulario;
- menú abierto;
- lista filtrada;
- usuario seleccionado;
- carga de datos.

## 7.2 useState

```jsx
import { useState } from "react";

function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <button onClick={() => setContador(contador + 1)}>
      Clics: {contador}
    </button>
  );
}
```

## 7.3 Estado inicial

`useState(0)` define valor inicial.

## 7.4 Actualizar estado

Nunca modificar directamente. Usar la función setter.

## 7.5 Renderizado

Cuando cambia el estado, React vuelve a renderizar el componente.

---

# Módulo 8 — Eventos

## 8.1 Eventos en React

React usa nombres como:

- `onClick`;
- `onChange`;
- `onSubmit`;
- `onKeyDown`.

## 8.2 Click

```jsx
<button onClick={handleClick}>Guardar</button>
```

## 8.3 Función manejadora

```jsx
function handleClick() {
  console.log("Click");
}
```

## 8.4 Evento inline

```jsx
<button onClick={() => setActivo(true)}>Activar</button>
```

## 8.5 Formularios

En submit:

```jsx
function handleSubmit(event) {
  event.preventDefault();
}
```

---

# Módulo 9 — Renderizado condicional

## 9.1 Mostrar según estado

```jsx
{estaLogueado ? <p>Bienvenido</p> : <p>Iniciá sesión</p>}
```

## 9.2 AND lógico

```jsx
{mensaje && <p>{mensaje}</p>}
```

## 9.3 Estados comunes

- cargando;
- error;
- vacío;
- éxito;
- autenticado;
- no autenticado.

## 9.4 Ejemplo

```jsx
if (cargando) {
  return <p>Cargando...</p>;
}
```

## 9.5 Importancia

Una buena interfaz muestra qué está pasando.

---

# Módulo 10 — Listas

## 10.1 map

Para renderizar listas se usa `map`.

```jsx
const cursos = ["HTML", "CSS", "JavaScript"];

function ListaCursos() {
  return (
    <ul>
      {cursos.map(curso => (
        <li key={curso}>{curso}</li>
      ))}
    </ul>
  );
}
```

## 10.2 key

React necesita `key` para identificar elementos.

## 10.3 Array de objetos

```jsx
const cursos = [
  { id: 1, titulo: "HTML" },
  { id: 2, titulo: "CSS" }
];
```

## 10.4 Renderizar cards

```jsx
{cursos.map(curso => (
  <CursoCard key={curso.id} titulo={curso.titulo} />
))}
```

## 10.5 Error común

Usar índices como key puede causar problemas si la lista cambia de orden.

---

# Módulo 11 — Formularios controlados

## 11.1 Qué es un formulario controlado

El valor del input vive en el estado de React.

```jsx
const [nombre, setNombre] = useState("");
```

## 11.2 Input controlado

```jsx
<input
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
/>
```

## 11.3 Submit

```jsx
function handleSubmit(e) {
  e.preventDefault();
  console.log(nombre);
}
```

## 11.4 Validación simple

```jsx
if (nombre.trim() === "") {
  setError("El nombre es obligatorio");
  return;
}
```

## 11.5 Uso

Formularios controlados sirven para:

- registro;
- búsqueda;
- filtros;
- contacto;
- creación de tareas;
- edición de datos.

---

# Módulo 12 — useEffect

## 12.1 Qué es useEffect

`useEffect` permite ejecutar efectos secundarios.

Ejemplos:

- cargar datos;
- suscribirse a eventos;
- actualizar título;
- sincronizar con localStorage.

## 12.2 Ejemplo básico

```jsx
import { useEffect } from "react";

useEffect(() => {
  console.log("Componente montado");
}, []);
```

## 12.3 Dependencias

El array de dependencias controla cuándo se ejecuta.

```jsx
useEffect(() => {
  console.log("Cambió búsqueda");
}, [busqueda]);
```

## 12.4 Cuidado

Un efecto mal configurado puede generar bucles infinitos.

## 12.5 Regla inicial

Usar `useEffect` para sincronizar con cosas externas al render.

---

# Módulo 13 — Consumir datos con fetch

## 13.1 Fetch en React

```jsx
useEffect(() => {
  async function cargarDatos() {
    const res = await fetch("https://api.example.com/items");
    const data = await res.json();
    setItems(data);
  }

  cargarDatos();
}, []);
```

## 13.2 Estados

Conviene manejar:

- datos;
- cargando;
- error.

## 13.3 Ejemplo

```jsx
const [datos, setDatos] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState(null);
```

## 13.4 Render condicional

```jsx
if (cargando) return <p>Cargando...</p>;
if (error) return <p>{error}</p>;
```

## 13.5 Cuidado

No exponer claves sensibles en frontend.

---

# Módulo 14 — Estilos en React

## 14.1 CSS global

Se puede importar CSS en `main.jsx` o `App.jsx`.

```jsx
import "./index.css";
```

## 14.2 Clases

```jsx
<button className="btn">Guardar</button>
```

## 14.3 Estilos inline

```jsx
<div style={{ color: "red", padding: "1rem" }}>
```

Usar con moderación.

## 14.4 Componentes y CSS

Organizar estilos por componentes puede ayudar.

```text
components/
  CourseCard.jsx
  CourseCard.css
```

## 14.5 Buenas prácticas

- clases claras;
- evitar estilos duplicados;
- mantener consistencia;
- cuidar responsive;
- respetar accesibilidad.

---

# Módulo 15 — Estructura de proyecto

## 15.1 Carpeta src

Ejemplo:

```text
src/
  components/
  data/
  pages/
  hooks/
  App.jsx
  main.jsx
  index.css
```

## 15.2 components

Componentes reutilizables:

- Button;
- Card;
- Header;
- Footer;
- CourseList;
- Form.

## 15.3 data

Datos estáticos temporales.

```text
data/cursos.js
```

## 15.4 hooks

Más adelante, lógica reutilizable.

## 15.5 Principio

No poner toda la app en un solo archivo si empieza a crecer.

---

# Módulo 16 — LocalStorage en React

## 16.1 Uso

Puede guardar datos simples en navegador.

Ejemplo:

- tema;
- tareas;
- preferencias;
- favoritos.

## 16.2 Leer inicial

```jsx
const [tareas, setTareas] = useState(() => {
  const guardadas = localStorage.getItem("tareas");
  return guardadas ? JSON.parse(guardadas) : [];
});
```

## 16.3 Guardar con useEffect

```jsx
useEffect(() => {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}, [tareas]);
```

## 16.4 Cuidado

No guardar datos sensibles.

## 16.5 Limitación

LocalStorage no reemplaza base de datos ni autenticación.

---

# Módulo 17 — Errores comunes

## 17.1 Mutar estado directamente

Malo:

```jsx
items.push(nuevoItem);
```

Mejor:

```jsx
setItems([...items, nuevoItem]);
```

## 17.2 Olvidar key

Listas sin key generan advertencias.

## 17.3 Usar class en vez de className

En JSX se usa `className`.

## 17.4 Efectos infinitos

Dependencias mal configuradas pueden crear bucles.

## 17.5 Componentes enormes

Dividir en componentes pequeños.

## 17.6 Mezclar demasiada lógica en JSX

Separar funciones y datos cuando mejora legibilidad.

---

# Módulo 18 — Buenas prácticas

## 18.1 Componentes claros

Cada componente debe tener un propósito.

## 18.2 Props explícitas

Pasar solo lo necesario.

## 18.3 Estado mínimo

Guardar en estado solo lo que realmente cambia.

## 18.4 Render limpio

Evitar JSX imposible de leer.

## 18.5 Accesibilidad

Usar:

- botones reales;
- labels;
- alt;
- navegación con teclado;
- mensajes de error claros;
- contraste adecuado.

---

# Módulo 19 — Proyecto final: mini app React

## 19.1 Objetivo

Crear una mini aplicación React funcional.

Opciones:

- lista de tareas;
- catálogo de cursos;
- buscador;
- calculadora;
- gestor de gastos;
- listado de productos;
- app de favoritos.

## 19.2 Requisitos

Debe incluir:

- componentes;
- props;
- useState;
- eventos;
- listas;
- formulario;
- render condicional;
- CSS;
- localStorage o fetch;
- README.

## 19.3 Ejemplo: catálogo de cursos

Funciones:

- mostrar cursos;
- filtrar por categoría;
- buscar por texto;
- marcar favorito;
- guardar favoritos.

## 19.4 Estructura

```text
src/
  components/
    CourseCard.jsx
    SearchBar.jsx
  data/
    courses.js
  App.jsx
```

## 19.5 Evaluación

Se evaluará funcionamiento, claridad, componentes, estado, estilos, accesibilidad y documentación.

---

# Caso práctico integrador

## Caso: mini Cursoteca React

Una plataforma quiere mostrar cursos y permitir búsqueda.

### Paso 1 — Datos

Crear array de cursos con título, categoría y nivel.

### Paso 2 — Componentes

- Header;
- CourseCard;
- CourseList;
- SearchBar;
- CategoryFilter.

### Paso 3 — Estado

Guardar búsqueda y categoría seleccionada.

### Paso 4 — Filtro

Filtrar cursos según texto y categoría.

### Paso 5 — Render

Mostrar cards o mensaje “No hay resultados”.

### Paso 6 — Favoritos

Permitir marcar cursos favoritos y guardarlos en localStorage.

### Resultado

La página se comporta como una mini aplicación interactiva.

---

# Actividades del curso

1. Crear proyecto con Vite.
2. Crear primer componente.
3. Usar JSX con expresiones.
4. Crear componente con props.
5. Usar useState con contador.
6. Manejar evento de click.
7. Renderizar lista con map.
8. Crear formulario controlado.
9. Implementar render condicional.
10. Usar useEffect básico.
11. Consumir API simple.
12. Guardar favoritos en localStorage.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es React?
2. ¿Qué problema resuelve el enfoque por componentes?
3. ¿Qué es JSX?
4. ¿Por qué se usa className?
5. ¿Qué son props?
6. ¿Qué es estado?
7. ¿Para qué sirve useState?
8. ¿Cómo se manejan eventos?
9. ¿Para qué sirve key en listas?
10. ¿Qué es un formulario controlado?
11. ¿Para qué sirve useEffect?
12. ¿Por qué no se debe mutar estado directamente?

## Parte 2 — Producción práctica

El estudiante debe entregar una **Mini Aplicación React**.

Debe incluir:

1. proyecto creado con herramienta moderna;
2. componentes separados;
3. props;
4. estado con useState;
5. eventos;
6. listas;
7. formulario;
8. render condicional;
9. useEffect;
10. localStorage o fetch;
11. CSS;
12. README.

---

# Glosario básico

React: biblioteca de JavaScript para construir interfaces.

Componente: pieza reutilizable de interfaz.

JSX: sintaxis que combina JavaScript con estructura similar a HTML.

Props: datos enviados de un componente padre a un hijo.

Estado: datos internos que pueden cambiar.

useState: hook para manejar estado.

Hook: función especial de React para usar capacidades como estado o efectos.

useEffect: hook para manejar efectos secundarios.

Render: proceso de mostrar interfaz según datos.

Evento: acción del usuario o navegador.

Formulario controlado: formulario cuyos valores dependen del estado.

Key: identificador para elementos de lista.

Vite: herramienta moderna para crear proyectos frontend.

Build: versión optimizada para producción.

LocalStorage: almacenamiento simple del navegador.

---

# Producto final del curso

Al finalizar, el estudiante debe crear una **Mini Aplicación React**.

Ese producto debe permitir:

- dividir interfaz en componentes;
- pasar datos con props;
- manejar estado;
- responder a eventos;
- renderizar listas;
- validar formularios;
- consumir o guardar datos;
- aplicar estilos;
- documentar el proyecto.

El curso termina cuando la persona deja de pensar una web como un archivo único y empieza a construir interfaces mediante componentes, estado y datos.

---

# Fuentes recomendadas para profundizar

- React Docs — Learn React.
- Vite documentation.
- MDN Web Docs — JavaScript.
- MDN Web Docs — DOM and events.
- React Docs — Components and Props.
- React Docs — State.
- React Docs — Effects.
- Materiales introductorios sobre frontend moderno, componentes, hooks y aplicaciones web.

# Curso 43 — APIs para Proyectos Web

## Presentación del curso

Las APIs son una de las bases del desarrollo web moderno. Permiten que una página, aplicación o sistema se conecte con servicios externos para obtener datos, enviar información, consultar recursos, automatizar procesos o integrar funcionalidades que no sería práctico construir desde cero.

Cuando una web muestra el clima, cotizaciones, noticias, mapas, datos de productos, usuarios, pagos, formularios, inteligencia artificial, estadísticas, calendarios o información en tiempo real, probablemente está usando una API.

Este curso está pensado para principiantes que ya tienen nociones básicas de HTML, CSS y JavaScript, o que están desarrollando proyectos web y quieren incorporar datos externos. No busca formar especialistas backend, sino enseñar lo necesario para entender qué es una API, cómo se consume desde JavaScript, cómo se interpreta una respuesta JSON, cómo manejar errores y cómo pensar integraciones seguras y útiles.

La idea central es:

> Una API permite que un proyecto web deje de ser una página aislada y empiece a conversar con datos, servicios y sistemas externos.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es una API y para qué se usa.
2. Diferenciar frontend, backend, cliente, servidor y endpoint.
3. Entender conceptos básicos de HTTP.
4. Leer e interpretar respuestas JSON.
5. Consumir una API desde JavaScript usando `fetch`.
6. Manejar promesas, async/await y errores básicos.
7. Entender métodos HTTP como GET, POST, PUT y DELETE.
8. Usar parámetros de consulta y rutas dinámicas.
9. Comprender qué son API keys, tokens y límites de uso.
10. Diseñar una interfaz simple que muestre datos externos.
11. Evitar exponer claves sensibles en frontend.
12. Crear un mini proyecto web conectado a una API pública.

---

# Módulo 1 — Qué es una API

## 1.1 Definición

API significa Application Programming Interface. Es una interfaz que permite que dos sistemas se comuniquen siguiendo reglas definidas.

En términos simples:

> Una API es una puerta organizada para pedir o enviar información a otro sistema.

Ejemplos:

- una app consulta el clima;
- una tienda consulta el estado de pago;
- una web muestra noticias;
- un mapa muestra ubicaciones;
- una app guarda un usuario;
- un dashboard consulta datos.

## 1.2 API como contrato

Una API define:

- qué se puede pedir;
- cómo se pide;
- qué datos hay que enviar;
- qué respuesta se recibe;
- qué errores pueden ocurrir;
- qué permisos se necesitan.

## 1.3 Ejemplo cotidiano

Una página de clima no mide la temperatura por sí misma. Consulta una API meteorológica y recibe datos.

Flujo:

1. Usuario busca una ciudad.
2. La web envía una petición.
3. La API responde con datos.
4. La web muestra temperatura, humedad y pronóstico.

## 1.4 Por qué importan

Las APIs permiten reutilizar servicios, conectar sistemas, automatizar procesos, mostrar datos actualizados, integrar pagos, usar mapas, trabajar con IA y crear experiencias dinámicas.

---

# Módulo 2 — Cliente, servidor y backend

## 2.1 Cliente

El cliente es quien realiza la petición. Puede ser navegador, app móvil, frontend, script, servidor o herramienta como Postman.

## 2.2 Servidor

El servidor recibe la petición, procesa y responde. Puede consultar una base de datos, validar permisos o devolver información.

## 2.3 Frontend

El frontend es la parte visible para el usuario: HTML, CSS, JavaScript, React u otra interfaz.

## 2.4 Backend

El backend es la parte del sistema que corre en servidor. Maneja datos, seguridad, lógica de negocio y conexión con bases.

## 2.5 API entre frontend y backend

En una aplicación moderna, el frontend muestra interfaz, el backend expone API, la base de datos guarda información y la API conecta ambos mundos.

---

# Módulo 3 — HTTP básico

## 3.1 Qué es HTTP

HTTP es el protocolo principal de comunicación en la web. Cuando un navegador carga una página o consulta una API, usa HTTP o HTTPS.

## 3.2 Petición y respuesta

Una interacción HTTP tiene request y response: pedido y respuesta.

Ejemplo:

> GET /productos

Respuesta:

> lista de productos.

## 3.3 URL

Una URL identifica un recurso.

```text
https://api.ejemplo.com/productos
```

## 3.4 HTTPS

HTTPS es la versión segura de HTTP. Cifra la comunicación. Para APIs reales, usar HTTPS es una práctica básica.

## 3.5 Partes de una petición

Una petición puede incluir método, URL, headers, parámetros, body y credenciales.

---

# Módulo 4 — Endpoints

## 4.1 Qué es un endpoint

Un endpoint es una URL específica de una API para acceder a un recurso o acción.

```text
/api/productos
/api/productos/10
/api/clima?ciudad=Santa+Fe
/api/usuarios/login
```

## 4.2 Recurso

Un recurso es aquello que se consulta o modifica: productos, usuarios, pedidos, clima, noticias, cursos o pagos.

## 4.3 Endpoint de lista

```text
GET /productos
```

Trae todos los productos o una lista paginada.

## 4.4 Endpoint de detalle

```text
GET /productos/15
```

Trae un producto específico.

## 4.5 Endpoint con acción

```text
POST /usuarios/login
```

Puede enviar datos para iniciar sesión.

---

# Módulo 5 — Métodos HTTP

## 5.1 GET

Sirve para obtener datos.

```text
GET /cursos
```

## 5.2 POST

Sirve para crear o enviar información.

```text
POST /contacto
```

## 5.3 PUT y PATCH

Sirven para actualizar. PUT suele reemplazar un recurso completo. PATCH modifica una parte.

## 5.4 DELETE

Sirve para eliminar.

```text
DELETE /productos/10
```

## 5.5 Cuidado

Desde frontend público, no se debe permitir modificar o borrar datos sin autenticación y autorización.

---

# Módulo 6 — JSON

## 6.1 Qué es JSON

JSON significa JavaScript Object Notation. Es un formato liviano para intercambiar datos.

```json
{
  "nombre": "Curso de APIs",
  "nivel": "Principiante",
  "duracion": "4 horas"
}
```

## 6.2 Objetos

Un objeto tiene claves y valores.

```json
{
  "producto": "Remera",
  "precio": 12000
}
```

## 6.3 Arrays

Un array contiene varios elementos.

```json
[
  { "producto": "Remera", "precio": 12000 },
  { "producto": "Gorra", "precio": 5000 }
]
```

## 6.4 JSON y JavaScript

JavaScript puede trabajar naturalmente con objetos similares a JSON.

## 6.5 Error común

JSON válido requiere comillas dobles en claves y textos.

---

# Módulo 7 — fetch en JavaScript

## 7.1 Qué es fetch

`fetch` permite realizar peticiones HTTP desde JavaScript.

```js
fetch("https://api.ejemplo.com/productos")
  .then(response => response.json())
  .then(data => console.log(data));
```

## 7.2 Flujo

Se llama a una URL, llega una respuesta, se convierte a JSON y se usan los datos.

## 7.3 async/await

```js
async function cargarProductos() {
  const respuesta = await fetch("https://api.ejemplo.com/productos");
  const datos = await respuesta.json();
  console.log(datos);
}
```

## 7.4 Mostrar en pantalla

```js
async function cargarProducto() {
  const respuesta = await fetch("https://api.ejemplo.com/producto");
  const producto = await respuesta.json();
  document.querySelector("#resultado").textContent = producto.nombre;
}
```

## 7.5 Buenas prácticas

Separar función de carga, manejar errores, mostrar estado de carga, validar datos antes de mostrarlos y no repetir código innecesariamente.

---

# Módulo 8 — Promesas y async/await

## 8.1 Qué es una promesa

Una promesa representa una operación que puede terminar en el futuro. Una petición a API tarda tiempo porque depende de red, servidor y respuesta.

## 8.2 then/catch

```js
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## 8.3 async/await

```js
async function obtenerDatos() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Error al cargar datos", error);
  }
}
```

## 8.4 try/catch

Permite manejar errores sin romper toda la aplicación.

## 8.5 Estado de carga

Mientras se cargan datos, mostrar “Cargando...” mejora experiencia de usuario.

---

# Módulo 9 — Manejo de errores

## 9.1 Errores posibles

Sin internet, API caída, URL incorrecta, clave inválida, límite de uso superado, datos incompletos, respuesta no JSON, error 404, error 500.

## 9.2 Status HTTP

Códigos comunes:

- 200: correcto;
- 201: creado;
- 400: petición incorrecta;
- 401: no autorizado;
- 403: prohibido;
- 404: no encontrado;
- 429: demasiadas peticiones;
- 500: error del servidor.

## 9.3 Verificar response.ok

```js
async function cargarDatos() {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error HTTP: " + res.status);
  }
  const data = await res.json();
  return data;
}
```

## 9.4 Mensajes al usuario

No mostrar errores técnicos crudos. Mejor:

> No pudimos cargar la información. Intentá nuevamente en unos minutos.

## 9.5 Registro para desarrollo

En consola se puede mostrar detalle para depurar, pero al usuario se le debe hablar claro.

---

# Módulo 10 — Parámetros de consulta

## 10.1 Qué son

Los parámetros de consulta permiten enviar opciones en la URL.

```text
/api/productos?categoria=ropa&orden=precio
```

## 10.2 Query string

Todo lo que va después de `?` son parámetros.

## 10.3 Buscar por ciudad

```text
/api/clima?ciudad=Santa%20Fe
```

## 10.4 URLSearchParams

```js
const params = new URLSearchParams({
  ciudad: "Santa Fe",
  pais: "AR"
});

const url = "https://api.ejemplo.com/clima?" + params.toString();
```

## 10.5 Evitar concatenaciones frágiles

Mejor usar `URLSearchParams` que armar URLs manualmente con espacios y caracteres raros.

---

# Módulo 11 — Headers y body

## 11.1 Headers

Los headers envían información adicional.

```js
fetch(url, {
  headers: {
    "Content-Type": "application/json"
  }
});
```

## 11.2 Authorization

Algunas APIs requieren token.

```js
fetch(url, {
  headers: {
    "Authorization": "Bearer TOKEN"
  }
});
```

## 11.3 Body

El body envía datos, generalmente en POST o PUT.

```js
fetch("/api/contacto", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    nombre: "Ana",
    mensaje: "Hola"
  })
});
```

## 11.4 JSON.stringify

Convierte un objeto JavaScript en texto JSON.

## 11.5 Cuidado

No enviar información sensible innecesaria.

---

# Módulo 12 — API keys y seguridad

## 12.1 Qué es una API key

Una API key es una clave que identifica a quien usa una API. Sirve para controlar acceso, medir uso, aplicar límites, facturar o bloquear abuso.

## 12.2 No exponer claves sensibles

Si una clave queda en JavaScript público, cualquier persona puede verla. Esto es crítico si la clave permite consumir crédito, modificar datos, acceder a información privada o hacer operaciones pagas.

## 12.3 Backend como intermediario

Para claves sensibles, conviene crear un backend propio.

Flujo:

1. frontend pide a tu backend;
2. tu backend usa clave privada;
3. backend devuelve solo lo necesario.

## 12.4 Variables de entorno

En proyectos modernos, las claves se guardan en variables de entorno.

## 12.5 Claves públicas

Algunas APIs tienen claves diseñadas para frontend, pero aun así deben restringirse por dominio, permisos y límites cuando sea posible.

---

# Módulo 13 — CORS

## 13.1 Qué es CORS

CORS es un mecanismo de seguridad del navegador que controla qué sitios pueden pedir recursos a una API.

## 13.2 Error común

Puede aparecer:

> blocked by CORS policy

Significa que el navegador bloqueó la petición por reglas del servidor.

## 13.3 No se arregla desde el frontend

Si una API no permite llamadas desde tu origen, no siempre podés solucionarlo en el navegador.

## 13.4 Solución común

Usar un backend propio como proxy controlado.

## 13.5 Cuidado con proxies públicos

Evitar proxies públicos inseguros porque pueden exponer datos, claves o romper la privacidad.

---

# Módulo 14 — APIs públicas útiles

## 14.1 Clima

Permiten mostrar temperatura, pronóstico, humedad, viento o alertas. Útiles para portales locales, apps turísticas, dashboards diarios o blogs informativos.

## 14.2 Noticias

Permiten mostrar titulares o artículos. Revisar licencias, límites y atribución.

## 14.3 Mapas y geocodificación

Permiten mostrar ubicaciones, coordenadas, distancias o rutas.

## 14.4 Datos públicos

Gobiernos y organismos ofrecen datasets o APIs sobre transporte, economía, salud, clima, educación o geografía.

## 14.5 APIs educativas

Para practicar: JSONPlaceholder, Rick and Morty API, PokeAPI, Open-Meteo, REST Countries y DummyJSON. Verificar siempre términos de uso.

---

# Módulo 15 — Diseño de interfaz con datos externos

## 15.1 Estados de interfaz

Una interfaz que consume APIs debe contemplar estado inicial, cargando, éxito, vacío y error.

## 15.2 Cargando

Mostrar “Cargando datos...”.

## 15.3 Sin resultados

Mostrar “No encontramos resultados para tu búsqueda”.

## 15.4 Error

Mostrar mensaje claro y opción de reintentar.

## 15.5 Datos incompletos

No asumir que todos los campos existen.

```js
const titulo = data.title || "Sin título disponible";
```

---

# Módulo 16 — Proyecto: buscador con API

## 16.1 Objetivo

Crear una página que permita buscar información en una API pública y mostrar resultados.

Ejemplos: países, personajes, clima, productos ficticios, recetas, libros o cursos.

## 16.2 Estructura HTML

Elementos:

- input de búsqueda;
- botón;
- contenedor de resultados;
- mensaje de carga;
- mensaje de error.

## 16.3 JavaScript

Debe leer búsqueda, construir URL, hacer fetch, manejar errores, renderizar resultados y limpiar estados anteriores.

## 16.4 Accesibilidad

El formulario debe tener label, botón real y mensajes claros.

## 16.5 Mejora

Agregar filtros, favoritos, paginación o detalle.

---

# Módulo 17 — Proyecto: dashboard simple

## 17.1 Objetivo

Crear un pequeño dashboard con datos externos.

Ejemplos: clima local, cotizaciones simuladas, estadísticas de países, lista de noticias o indicadores públicos.

## 17.2 Componentes

- tarjetas de indicadores;
- lista o tabla;
- gráfico opcional;
- fecha de actualización;
- fuente;
- botón de recargar.

## 17.3 Cuidado

Indicar fuente de datos y fecha. No mostrar información como si fuera propia.

## 17.4 Actualización

Se puede actualizar al cargar página o con botón.

## 17.5 Error

Si la API falla, el dashboard debe seguir siendo comprensible.

---

# Módulo 18 — Buenas prácticas

## 18.1 Leer documentación

Antes de usar una API, revisar endpoints, métodos, parámetros, autenticación, límites, ejemplos y términos de uso.

## 18.2 No hacer llamadas innecesarias

Evitar pedir datos en cada tecla sin control. Usar botón o debounce.

## 18.3 Cache básico

Si el dato no cambia seguido, se puede guardar temporalmente para evitar exceso de peticiones.

## 18.4 Separar lógica

Separar obtener datos, procesar datos, renderizar interfaz y manejar errores.

## 18.5 Privacidad

No enviar datos personales a APIs externas sin necesidad y consentimiento.

---

# Módulo 19 — Errores comunes

## 19.1 No manejar errores

La API puede fallar. Siempre preparar respuesta.

## 19.2 Exponer claves privadas

Es uno de los errores más graves.

## 19.3 No revisar límites

Muchas APIs tienen límite diario o mensual.

## 19.4 Confiar ciegamente en datos

Validar que la respuesta tenga el formato esperado.

## 19.5 No leer términos de uso

Algunas APIs restringen uso comercial, atribución o cantidad de peticiones.

## 19.6 Interfaz sin estados

Una web que queda en blanco mientras carga parece rota.

---

# Módulo 20 — Plan de integración de API

## 20.1 Pregunta inicial

Antes de integrar una API:

- ¿qué problema resuelve?
- ¿qué dato necesito?
- ¿con qué frecuencia?
- ¿es gratuito?
- ¿requiere clave?
- ¿puedo usarla comercialmente?
- ¿qué pasa si falla?

## 20.2 Checklist

- documentación leída;
- endpoint elegido;
- método definido;
- parámetros claros;
- manejo de carga;
- manejo de error;
- seguridad revisada;
- interfaz diseñada;
- fuente citada;
- límites entendidos.

## 20.3 Prueba mínima

Primero probar en consola, luego mostrar en interfaz.

## 20.4 Escalabilidad

Si el proyecto crece, evaluar backend propio, caché, base de datos y monitoreo.

## 20.5 Principio final

> Una API debe mejorar el proyecto, no agregar complejidad innecesaria.

---

# Caso práctico integrador

## Caso: portal local con clima y noticias

Un proyecto web barrial quiere mostrar clima actual y titulares relevantes.

### Paso 1 — Necesidad

Los usuarios quieren consultar información rápida del día.

### Paso 2 — APIs

Se elige una API de clima sin clave sensible y una API de noticias o fuente compatible.

### Paso 3 — Interfaz

La página muestra ciudad, temperatura, descripción, humedad, actualización, lista de titulares y fuente.

### Paso 4 — JavaScript

Se usa `fetch` con `async/await`.

### Paso 5 — Estados

Se agregan cargando, error, sin resultados y botón reintentar.

### Paso 6 — Seguridad

No se exponen claves privadas. Si una API requiere clave sensible, se planifica backend.

### Resultado

El proyecto deja de ser estático y muestra información actualizada.

---

# Actividades del curso

1. Identificar 5 APIs útiles para un proyecto web.
2. Leer documentación de una API pública.
3. Hacer una petición GET desde el navegador.
4. Interpretar una respuesta JSON.
5. Crear una función `fetch` con async/await.
6. Mostrar datos en HTML.
7. Manejar estado de carga y error.
8. Construir una URL con parámetros.
9. Crear un formulario de búsqueda conectado a API.
10. Diseñar un mini dashboard con fuente y fecha de actualización.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es una API?
2. ¿Qué es un endpoint?
3. ¿Qué diferencia hay entre cliente y servidor?
4. ¿Qué es HTTP?
5. ¿Para qué sirve GET?
6. ¿Para qué sirve POST?
7. ¿Qué es JSON?
8. ¿Qué hace `fetch`?
9. ¿Qué es async/await?
10. ¿Qué significa un error 404?
11. ¿Por qué no conviene exponer API keys sensibles?
12. ¿Qué es CORS?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Mini Proyecto Web con API**.

Debe incluir:

1. HTML estructurado;
2. CSS básico;
3. JavaScript con fetch;
4. consumo de API pública;
5. interpretación de JSON;
6. formulario o botón de consulta;
7. estado de carga;
8. manejo de errores;
9. renderizado de resultados;
10. fuente de datos;
11. explicación de seguridad;
12. mejoras futuras.

---

# Glosario básico

API: interfaz que permite comunicación entre sistemas.

Endpoint: URL específica de una API.

Cliente: sistema que realiza una petición.

Servidor: sistema que responde una petición.

Frontend: parte visible de una aplicación.

Backend: parte del sistema que corre en servidor.

HTTP: protocolo de comunicación web.

HTTPS: versión segura de HTTP.

GET: método para obtener datos.

POST: método para enviar o crear datos.

PUT: método para actualizar un recurso completo.

PATCH: método para actualizar parte de un recurso.

DELETE: método para eliminar.

JSON: formato liviano de intercambio de datos.

fetch: función de JavaScript para hacer peticiones HTTP.

Promesa: operación asincrónica que puede completarse o fallar.

async/await: sintaxis para trabajar con promesas de forma más clara.

API key: clave de acceso a una API.

Token: credencial temporal o permanente de autorización.

CORS: política de seguridad del navegador para peticiones entre orígenes.

Rate limit: límite de peticiones permitido.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Mini Proyecto Web con API**.

Ese producto debe permitir consultar datos externos, interpretar JSON, renderizar información, manejar errores, diseñar estados de carga, cuidar seguridad, citar fuente y mejorar una web estática con datos reales o dinámicos.

El curso termina cuando la persona entiende que una API no es magia: es una forma estructurada de pedir, recibir y usar datos en un proyecto web.

---

# Fuentes recomendadas para profundizar

- MDN Web Docs — Fetch API.
- MDN Web Docs — HTTP.
- MDN Web Docs — JSON.
- JavaScript.info — Fetch.
- REST API Tutorial.
- JSONPlaceholder.
- Open-Meteo API.
- REST Countries API.
- PokeAPI.
- Materiales introductorios sobre APIs REST, HTTP, CORS, seguridad y consumo de datos en frontend.

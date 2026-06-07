# Curso 48 — Publicación Web para Principiantes

## Presentación del curso

Crear una página web es solo una parte del trabajo. Para que otras personas puedan verla, usarla, compartirla y encontrarla, hay que publicarla correctamente. Publicar una web implica preparar archivos, revisar rutas, elegir un hosting, configurar dominio, subir el proyecto, probarlo en distintos dispositivos, corregir errores, cuidar rendimiento, seguridad básica, accesibilidad, SEO inicial y mantenimiento.

Muchas personas terminan una página en su computadora, pero luego se encuentran con problemas al subirla: imágenes que no cargan, enlaces rotos, archivos mal nombrados, rutas absolutas, errores con mayúsculas, formularios que no funcionan, sitios que no aparecen en Google o páginas que solo abren localmente. Este curso enseña cómo pasar de “funciona en mi PC” a “está publicado y se puede visitar”.

Está pensado para principiantes que ya conocen algo de HTML, CSS, JavaScript o GitHub, y quieren publicar proyectos simples: landing pages, portfolios, blogs estáticos, páginas de cursos, prototipos, juegos HTML, documentación o sitios institucionales básicos.

La idea central es:

> Publicar una web no es solo subir archivos. Es preparar un proyecto para que funcione correctamente fuera de tu computadora.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué significa publicar una web.
2. Diferenciar sitio local, hosting, dominio, DNS y deploy.
3. Preparar una carpeta web para publicación.
4. Entender rutas relativas y absolutas.
5. Publicar un sitio estático en GitHub Pages.
6. Conocer alternativas como Netlify, Vercel y hosting tradicional.
7. Configurar nociones básicas de dominio.
8. Revisar errores comunes de assets y enlaces.
9. Aplicar checklist básico de SEO, accesibilidad y rendimiento.
10. Probar una web publicada en distintos dispositivos.
11. Documentar versión y cambios publicados.
12. Crear un plan de mantenimiento básico.

---

# Módulo 1 — Qué significa publicar una web

## 1.1 Definición

Publicar una web significa hacer que sus archivos estén disponibles en internet para que otras personas puedan acceder mediante una URL.

Una web publicada necesita:

- archivos;
- servidor o hosting;
- dirección web;
- configuración;
- pruebas;
- mantenimiento.

## 1.2 Sitio local

Un sitio local funciona en tu computadora.

Ejemplo:

```text
C:/Usuarios/Juan/proyecto/index.html
```

Puede abrirse en navegador, pero otras personas no pueden verlo desde internet.

## 1.3 Sitio publicado

Un sitio publicado tiene una URL pública.

Ejemplo:

```text
https://usuario.github.io/proyecto/
```

## 1.4 Publicar no corrige errores

Si el proyecto tiene rutas mal escritas, imágenes faltantes o código roto, publicarlo no lo arregla. A veces incluso aparecen errores que localmente no se notaban.

## 1.5 Mentalidad profesional

Antes de publicar, revisar. Después de publicar, probar. Luego mantener.

---

# Módulo 2 — Archivos de un sitio web

## 2.1 Archivos básicos

Un sitio simple puede tener:

```text
index.html
styles.css
script.js
img/
```

## 2.2 index.html

Es el archivo principal que se abre por defecto.

Si falta `index.html`, muchos hostings no sabrán qué mostrar.

## 2.3 CSS

Define estilos.

Debe estar correctamente enlazado:

```html
<link rel="stylesheet" href="styles.css">
```

## 2.4 JavaScript

Define comportamiento.

```html
<script src="script.js" defer></script>
```

## 2.5 Assets

Assets son recursos como:

- imágenes;
- íconos;
- fuentes;
- videos;
- PDFs;
- JSON;
- audios.

Deben subirse junto con el proyecto.

---

# Módulo 3 — Rutas relativas y absolutas

## 3.1 Ruta relativa

Depende de la ubicación del archivo actual.

```html
<img src="img/logo.png" alt="Logo">
```

## 3.2 Ruta absoluta

Incluye dirección completa o raíz del sitio.

```html
<img src="https://example.com/img/logo.png" alt="Logo">
```

## 3.3 Problema común

Una imagen puede funcionar localmente porque el navegador la encuentra en tu PC, pero fallar online si la ruta está mal.

## 3.4 Mayúsculas y minúsculas

En muchos servidores, `Logo.png` y `logo.png` son archivos distintos.

## 3.5 Buenas prácticas

- usar nombres simples;
- evitar espacios;
- usar minúsculas;
- usar guiones;
- revisar carpetas;
- probar después del deploy.

---

# Módulo 4 — Hosting

## 4.1 Qué es hosting

Hosting es el servicio o espacio donde se alojan los archivos de una web.

## 4.2 Hosting estático

Sirve para HTML, CSS y JavaScript sin backend.

Ejemplos:

- GitHub Pages;
- Netlify;
- Vercel;
- Cloudflare Pages;
- hosting estático tradicional.

## 4.3 Hosting dinámico

Necesario cuando hay backend, base de datos o procesamiento del lado servidor.

Ejemplos:

- servidores VPS;
- plataformas cloud;
- hosting con PHP;
- Node.js;
- bases de datos.

## 4.4 Para principiantes

Para proyectos estáticos, GitHub Pages, Netlify o Vercel suelen ser suficientes.

## 4.5 Elegir hosting

Evaluar:

- tipo de proyecto;
- costo;
- facilidad;
- dominio;
- HTTPS;
- despliegue automático;
- límites;
- soporte;
- escalabilidad.

---

# Módulo 5 — Dominio

## 5.1 Qué es un dominio

Un dominio es una dirección legible para acceder a una web.

Ejemplo:

```text
midominio.com
```

## 5.2 Subdominio

Ejemplo:

```text
blog.midominio.com
```

## 5.3 Dominio gratuito de plataforma

GitHub Pages ofrece una URL como:

```text
usuario.github.io/repositorio
```

No es un dominio propio, pero sirve para publicar.

## 5.4 Dominio propio

Mejora profesionalismo y recordación.

Ejemplo:

```text
cursoteca.com.ar
```

## 5.5 Dominio no es hosting

Dominio: dirección.
Hosting: lugar donde viven los archivos.

---

# Módulo 6 — DNS básico

## 6.1 Qué es DNS

DNS traduce un dominio legible en una dirección técnica que permite encontrar el servidor.

## 6.2 Registros comunes

- A;
- CNAME;
- TXT;
- MX.

## 6.3 CNAME

Usado frecuentemente para conectar un subdominio a una plataforma.

## 6.4 Propagación

Los cambios DNS pueden tardar en reflejarse.

## 6.5 Principiante

No es necesario dominar DNS al principio, pero sí entender que dominio y hosting deben conectarse.

---

# Módulo 7 — GitHub Pages

## 7.1 Qué es

GitHub Pages permite publicar sitios estáticos desde un repositorio GitHub.

Ideal para:

- portfolios;
- landing pages;
- demos;
- documentación;
- cursos estáticos;
- juegos web simples.

## 7.2 Requisitos

- cuenta GitHub;
- repositorio;
- archivo `index.html`;
- proyecto estático;
- rama configurada.

## 7.3 Activar Pages

En el repositorio:

1. Settings.
2. Pages.
3. Elegir rama.
4. Elegir carpeta.
5. Guardar.

## 7.4 URL

El sitio quedará en una URL pública del tipo:

```text
https://usuario.github.io/repositorio/
```

## 7.5 Errores frecuentes

- no hay index.html;
- rama incorrecta;
- carpeta equivocada;
- rutas rotas;
- assets no subidos;
- mayúsculas diferentes.

---

# Módulo 8 — Netlify y Vercel

## 8.1 Netlify

Permite publicar sitios estáticos y proyectos frontend con despliegue automático desde Git.

Ventajas:

- fácil;
- HTTPS;
- dominio personalizado;
- formularios, según plan;
- deploy previews.

## 8.2 Vercel

Muy usado para proyectos frontend modernos, especialmente Next.js y React.

Ventajas:

- integración con GitHub;
- deploy automático;
- dominios;
- HTTPS;
- previews.

## 8.3 Cuándo usarlos

Usarlos cuando:

- se quiere flujo más profesional;
- hay proyectos frontend modernos;
- se necesita deploy automático;
- se quiere conectar dominio fácilmente.

## 8.4 Diferencia con GitHub Pages

GitHub Pages es excelente para sitios estáticos simples. Netlify y Vercel ofrecen flujos más avanzados para proyectos modernos.

## 8.5 Cuidado

Leer límites gratuitos y condiciones de uso.

---

# Módulo 9 — Preparar proyecto antes de publicar

## 9.1 Checklist de archivos

Verificar:

- existe `index.html`;
- CSS enlazado;
- JS enlazado;
- imágenes en carpeta;
- rutas correctas;
- no hay archivos innecesarios;
- no hay claves privadas;
- README actualizado.

## 9.2 Prueba local

Abrir el sitio y revisar:

- navegación;
- imágenes;
- botones;
- formularios;
- responsive;
- consola sin errores críticos.

## 9.3 Nombres

Usar nombres simples:

- `index.html`;
- `styles.css`;
- `script.js`;
- `img/hero.jpg`.

## 9.4 No subir

Evitar subir:

- claves;
- archivos temporales;
- node_modules;
- backups innecesarios;
- capturas privadas;
- datos personales.

## 9.5 Versionar

Hacer commit antes de publicar.

---

# Módulo 10 — Deploy

## 10.1 Qué es deploy

Deploy es el proceso de publicar una versión del proyecto.

## 10.2 Deploy manual

Subir archivos manualmente a hosting.

## 10.3 Deploy con Git

Cada push a una rama puede disparar publicación automática.

## 10.4 Ventaja del deploy automático

- reduce errores;
- mantiene historial;
- facilita rollback;
- permite colaboración;
- ordena versiones.

## 10.5 Después del deploy

Siempre probar la URL pública.

---

# Módulo 11 — Errores comunes después de publicar

## 11.1 Página en blanco

Posibles causas:

- error JavaScript;
- archivo JS no carga;
- ruta incorrecta;
- build fallido;
- index ausente.

## 11.2 CSS no carga

Revisar ruta:

```html
<link rel="stylesheet" href="styles.css">
```

## 11.3 Imágenes rotas

Revisar:

- nombre exacto;
- carpeta;
- extensión;
- mayúsculas;
- archivo subido.

## 11.4 Enlaces rotos

Probar todos los enlaces.

## 11.5 Funciona local pero no online

Causa frecuente: rutas absolutas al disco local, diferencias de mayúsculas o archivos no subidos.

---

# Módulo 12 — Formularios en sitios estáticos

## 12.1 Problema

Un formulario HTML no envía correos por sí solo si no hay backend o servicio externo.

## 12.2 Opciones

- servicio de formularios;
- Netlify Forms;
- Formspree;
- backend propio;
- Google Forms;
- integración con email marketing.

## 12.3 mailto

```html
<form action="mailto:correo@example.com">
```

No es una solución profesional. Depende del cliente de correo del usuario.

## 12.4 Validación

Aunque el formulario no tenga backend, puede validar datos básicos en frontend.

## 12.5 Avisar al usuario

Si un formulario no funciona realmente, no debe simular envío exitoso.

---

# Módulo 13 — HTTPS y seguridad básica

## 13.1 Qué es HTTPS

HTTPS cifra la comunicación entre usuario y sitio.

## 13.2 Por qué importa

- protege datos;
- mejora confianza;
- es esperado por navegadores;
- ayuda al SEO;
- evita advertencias.

## 13.3 Plataformas modernas

GitHub Pages, Netlify y Vercel suelen ofrecer HTTPS.

## 13.4 Seguridad en frontend

No exponer:

- claves privadas;
- tokens sensibles;
- datos personales;
- credenciales;
- archivos internos.

## 13.5 Dependencias

Si se usan librerías externas, preferir fuentes confiables y mantenerlas actualizadas.

---

# Módulo 14 — SEO básico antes de publicar

## 14.1 Title

Cada página debe tener título claro.

```html
<title>Cursoteca Abierta — Cursos digitales</title>
```

## 14.2 Description

```html
<meta name="description" content="Cursos digitales prácticos para ciudadanía, trabajo, datos, emprendimiento y desarrollo web.">
```

## 14.3 Encabezados

Usar jerarquía h1, h2, h3.

## 14.4 URLs claras

Usar rutas comprensibles.

```text
/cursos/html-practico
```

## 14.5 Open Graph

Permite mejorar vista al compartir en redes.

```html
<meta property="og:title" content="Cursoteca Abierta">
<meta property="og:description" content="Cursos digitales prácticos.">
```

---

# Módulo 15 — Accesibilidad antes de publicar

## 15.1 Revisión rápida

Antes de publicar:

- HTML semántico;
- alt en imágenes;
- contraste;
- labels;
- foco visible;
- navegación con teclado;
- textos claros.

## 15.2 Prueba con teclado

Intentar navegar sin mouse.

## 15.3 Lighthouse

Ejecutar auditoría básica.

## 15.4 Responsive

Probar en móvil.

## 15.5 Errores comunes

- botones sin texto;
- imágenes sin alt;
- formularios sin labels;
- menú inaccesible;
- foco oculto.

---

# Módulo 16 — Rendimiento básico

## 16.1 Por qué importa

Una web lenta pierde usuarios.

## 16.2 Imágenes

Optimizar tamaño y peso.

No subir imágenes enormes si se muestran pequeñas.

## 16.3 CSS y JS

Evitar archivos innecesarios.

## 16.4 Fuentes

Demasiadas fuentes externas pueden ralentizar.

## 16.5 Medir

Usar Lighthouse o herramientas del navegador.

---

# Módulo 17 — Analítica básica

## 17.1 Para qué medir

Medir permite saber:

- cuántas personas visitan;
- desde dónde llegan;
- qué páginas ven;
- qué funciona;
- qué se debe mejorar.

## 17.2 Herramientas

Opciones:

- Google Analytics;
- Plausible;
- Umami;
- paneles del hosting;
- métricas simples de plataforma.

## 17.3 Privacidad

Respetar privacidad y normativas. No recolectar datos innecesarios.

## 17.4 Eventos

Se pueden medir acciones:

- clic en botón;
- envío de formulario;
- descarga;
- visita a curso;
- reproducción.

## 17.5 Principiante

Al inicio, basta con saber visitas y páginas principales.

---

# Módulo 18 — Mantenimiento

## 18.1 Publicar no es terminar

Toda web necesita revisión.

## 18.2 Rutina mensual

Revisar:

- enlaces;
- formularios;
- datos de contacto;
- precios;
- fechas;
- imágenes;
- errores;
- métricas;
- seguridad;
- contenido desactualizado.

## 18.3 Versiones

Registrar cambios:

```text
v1.0 — Primera publicación
v1.1 — Corrección de enlaces
v1.2 — Mejora responsive
```

## 18.4 Backups

Mantener copia del proyecto y repositorio.

## 18.5 Retirar contenido obsoleto

No dejar información vieja que confunda.

---

# Módulo 19 — Checklist de publicación

## 19.1 Archivos

- index.html presente.
- CSS carga.
- JS carga.
- Imágenes cargan.
- No hay archivos sensibles.

## 19.2 Funcionalidad

- enlaces probados;
- botones funcionan;
- formularios revisados;
- menú funciona;
- no hay errores graves en consola.

## 19.3 Visual

- responsive;
- contraste;
- tipografía legible;
- imágenes optimizadas;
- diseño coherente.

## 19.4 SEO y accesibilidad

- title;
- description;
- h1;
- alt;
- labels;
- foco visible;
- estructura semántica.

## 19.5 Post-publicación

- probar URL;
- compartir con alguien;
- revisar móvil;
- guardar versión;
- anotar mejoras.

---

# Módulo 20 — Proyecto final

## 20.1 Objetivo

Publicar una página web estática y documentar el proceso.

## 20.2 Proyecto sugerido

- portfolio;
- landing de curso;
- página de emprendimiento;
- blog estático;
- demo de juego;
- documentación de proyecto.

## 20.3 Requisitos

Debe incluir:

- HTML, CSS y JS si corresponde;
- repositorio GitHub;
- README;
- deploy;
- URL pública;
- checklist;
- capturas;
- registro de errores corregidos.

## 20.4 Evaluación

Se evaluará:

- funcionamiento online;
- rutas correctas;
- responsive;
- accesibilidad básica;
- SEO inicial;
- documentación;
- mantenimiento propuesto.

## 20.5 Resultado

El estudiante termina con una web real publicada y verificable.

---

# Caso práctico integrador

## Caso: publicar una página de curso

Una persona crea una landing para un curso de JavaScript.

### Paso 1 — Preparar archivos

Verifica:

- index.html;
- styles.css;
- script.js;
- img/.

### Paso 2 — Revisar rutas

Corrige imágenes y enlaces relativos.

### Paso 3 — GitHub

Sube el proyecto a un repositorio.

### Paso 4 — Pages

Activa GitHub Pages.

### Paso 5 — Prueba

Abre la URL pública y revisa:

- diseño;
- móvil;
- imágenes;
- enlaces;
- consola;
- accesibilidad básica.

### Paso 6 — Documentación

Actualiza README con URL y versión.

### Resultado

La página queda publicada y lista para compartir.

---

# Actividades del curso

1. Preparar carpeta de proyecto para publicación.
2. Revisar rutas relativas.
3. Detectar imágenes rotas.
4. Subir proyecto a GitHub.
5. Activar GitHub Pages.
6. Probar URL publicada.
7. Crear metadatos básicos.
8. Ejecutar Lighthouse.
9. Crear checklist de publicación.
10. Documentar versión publicada.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué significa publicar una web?
2. ¿Qué diferencia hay entre sitio local y sitio publicado?
3. ¿Qué es hosting?
4. ¿Qué es dominio?
5. ¿Qué es DNS?
6. ¿Qué es deploy?
7. ¿Para qué sirve GitHub Pages?
8. ¿Por qué se rompen imágenes al publicar?
9. ¿Por qué un formulario estático no envía correos por sí solo?
10. ¿Por qué HTTPS importa?
11. ¿Qué revisar antes de publicar?
12. ¿Por qué publicar no significa terminar?

## Parte 2 — Producción práctica

El estudiante debe entregar una **Web Publicada y Documentada**.

Debe incluir:

1. proyecto web;
2. repositorio;
3. URL pública;
4. checklist de publicación;
5. revisión de rutas;
6. prueba responsive;
7. prueba de accesibilidad básica;
8. metadatos SEO;
9. revisión de rendimiento;
10. README actualizado;
11. registro de errores corregidos;
12. plan de mantenimiento.

---

# Glosario básico

Publicación web: proceso de hacer una web accesible en internet.

Hosting: servicio donde se alojan archivos web.

Dominio: dirección legible de un sitio.

DNS: sistema que conecta dominio con servidor.

Deploy: proceso de publicar una versión del proyecto.

Sitio estático: web que no requiere backend para generar páginas.

GitHub Pages: servicio para publicar sitios estáticos desde GitHub.

Netlify: plataforma de despliegue web.

Vercel: plataforma de despliegue frontend.

HTTPS: protocolo seguro de comunicación web.

Asset: recurso como imagen, CSS, JS o fuente.

Ruta relativa: dirección basada en ubicación del archivo actual.

SEO: optimización para motores de búsqueda.

Lighthouse: herramienta de auditoría web.

Rollback: volver a una versión anterior.

README: documento de presentación del proyecto.

---

# Producto final del curso

Al finalizar, el estudiante debe crear una **Web Publicada y Documentada**.

Ese producto debe permitir:

- subir un proyecto real;
- hacerlo accesible por URL;
- corregir rutas;
- probar funcionamiento;
- revisar SEO básico;
- revisar accesibilidad;
- documentar versión;
- planificar mantenimiento.

El curso termina cuando la persona deja de tener un proyecto que “solo funciona en mi computadora” y pasa a tener una web publicada, revisada y compartible.

---

# Fuentes recomendadas para profundizar

- GitHub Pages documentation.
- Netlify Docs.
- Vercel Docs.
- MDN Web Docs — Deployment and hosting.
- web.dev — Performance and Lighthouse.
- Google Search Central — SEO basics.
- W3C Web Accessibility Initiative.
- Materiales introductorios sobre dominios, DNS, HTTPS, hosting y mantenimiento web.

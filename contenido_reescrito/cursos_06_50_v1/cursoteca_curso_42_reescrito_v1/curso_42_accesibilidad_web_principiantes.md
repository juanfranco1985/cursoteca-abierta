# Curso 42 — Accesibilidad Web para Principiantes

## Presentación del curso

La accesibilidad web consiste en diseñar y desarrollar sitios, aplicaciones y contenidos digitales para que puedan ser usados por la mayor cantidad posible de personas, incluyendo personas con discapacidad visual, auditiva, motriz, cognitiva, neurológica o situacional. También beneficia a personas mayores, usuarios con conexiones lentas, pantallas pequeñas, dispositivos antiguos, lesiones temporales o entornos difíciles.

Una web accesible no es una web “especial” ni una versión secundaria. Es una web bien construida: clara, navegable, compatible con teclado, comprensible para lectores de pantalla, con buen contraste, formularios usables, textos alternativos, estructura semántica y mensajes de error entendibles.

Este curso está pensado para principiantes en desarrollo web, diseño, contenido digital, educación, emprendimientos, comunicación y proyectos online. No requiere experiencia avanzada, pero sí conviene tener nociones básicas de HTML y diseño web.

La idea central es:

> La accesibilidad web no es un agregado final. Es parte de la calidad profesional de cualquier sitio o aplicación.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es accesibilidad web y por qué importa.
2. Reconocer barreras digitales frecuentes.
3. Conocer los principios básicos de WCAG: perceptible, operable, comprensible y robusto.
4. Usar HTML semántico para mejorar navegación y comprensión.
5. Escribir textos alternativos útiles para imágenes.
6. Diseñar enlaces, botones y formularios accesibles.
7. Revisar contraste, tamaño de texto y legibilidad.
8. Entender la importancia de la navegación por teclado.
9. Aplicar ARIA básica solo cuando sea necesario.
10. Probar una página con herramientas simples.
11. Crear un checklist básico de accesibilidad.
12. Mejorar un sitio o prototipo para hacerlo más inclusivo.

---

# Módulo 1 — Qué es accesibilidad web

## 1.1 Definición

La accesibilidad web es la práctica de crear productos digitales que puedan ser percibidos, entendidos, navegados y utilizados por personas con distintas capacidades, dispositivos y contextos.

Incluye sitios web, aplicaciones, documentos, plataformas educativas, formularios, tiendas online, blogs, dashboards y contenido multimedia.

## 1.2 A quién beneficia

Beneficia a personas con baja visión, ceguera, daltonismo, sordera o baja audición, dificultades motrices, dificultades cognitivas, dislexia, epilepsia fotosensible, lesiones temporales, uso de teclado, uso de lector de pantalla, dispositivos móviles y conexiones lentas.

También mejora la experiencia general para todos.

## 1.3 Accesibilidad no es solo discapacidad

Una persona puede necesitar accesibilidad por situación: usar el celular bajo sol, tener una mano ocupada, estar en un lugar ruidoso, tener internet lento, usar pantalla chica, tener una lesión temporal, ser adulto mayor o no dominar el idioma técnico.

## 1.4 Accesibilidad como calidad

Un sitio accesible suele ser más claro, ordenado, usable, compatible, indexable, profesional y fácil de mantener.

## 1.5 Error común

Pensar que la accesibilidad se agrega al final. En realidad, debe considerarse desde diseño, contenido y código.

---

# Módulo 2 — Barreras digitales frecuentes

## 2.1 Qué es una barrera

Una barrera digital es cualquier elemento que impide o dificulta el uso de un sitio o aplicación.

## 2.2 Barreras visuales

Ejemplos: bajo contraste, texto pequeño, información solo por color, imágenes sin texto alternativo, botones sin etiqueta, tipografía difícil y contenido desordenado.

## 2.3 Barreras motrices

Ejemplos: funciones que solo se usan con mouse, botones muy pequeños, menús imposibles con teclado, tiempos demasiado cortos, gestos complejos y falta de foco visible.

## 2.4 Barreras auditivas

Ejemplos: videos sin subtítulos, audios sin transcripción, instrucciones solo sonoras y alertas sin equivalente visual.

## 2.5 Barreras cognitivas

Ejemplos: textos largos y confusos, navegación inconsistente, formularios sin ayuda, errores poco claros, exceso de animaciones y lenguaje técnico innecesario.

---

# Módulo 3 — Principios WCAG

## 3.1 Qué son las WCAG

WCAG significa Web Content Accessibility Guidelines. Son pautas internacionales para crear contenido web accesible.

Se organizan alrededor de cuatro principios: perceptible, operable, comprensible y robusto.

## 3.2 Perceptible

La información debe poder percibirse. Ejemplos: texto alternativo en imágenes, subtítulos, contraste suficiente, estructura clara y contenido adaptable.

## 3.3 Operable

La interfaz debe poder usarse. Ejemplos: navegación con teclado, foco visible, evitar trampas de teclado, tiempo suficiente y evitar flashes peligrosos.

## 3.4 Comprensible

El contenido y la interacción deben entenderse. Ejemplos: lenguaje claro, navegación consistente, errores explicados, formularios con instrucciones y etiquetas correctas.

## 3.5 Robusto

El contenido debe funcionar en distintos navegadores, dispositivos y tecnologías de asistencia. Ejemplos: HTML válido, roles correctos, componentes compatibles y soluciones no frágiles.

---

# Módulo 4 — HTML semántico

## 4.1 Qué es semántica

HTML semántico significa usar etiquetas según su significado, no solo por apariencia.

Ejemplos: `header`, `nav`, `main`, `section`, `article`, `footer`, `button`, `form`, `label`, `h1` a `h6`.

## 4.2 Por qué importa

Ayuda a lectores de pantalla, navegación por regiones, SEO, mantenimiento, claridad de código y compatibilidad.

## 4.3 Mal ejemplo

```html
<div onclick="enviar()">Enviar</div>
```

Problemas: no es botón real, puede no funcionar con teclado y no comunica su rol.

## 4.4 Buen ejemplo

```html
<button type="submit">Enviar</button>
```

El navegador ya entiende que es un botón.

## 4.5 Regla práctica

Usar primero HTML correcto. Agregar JavaScript y estilos después.

---

# Módulo 5 — Estructura de encabezados

## 5.1 Para qué sirven

Los encabezados organizan el contenido. Una persona que usa lector de pantalla puede navegar por títulos para entender la estructura.

## 5.2 Jerarquía

Usar un `h1` principal, `h2` para secciones y `h3` para subsecciones. No saltar niveles sin motivo.

## 5.3 Mal ejemplo

```html
<h1>Curso</h1>
<h4>Introducción</h4>
<h2>Actividad</h2>
```

## 5.4 Buen ejemplo

```html
<h1>Curso de Accesibilidad Web</h1>
<h2>Introducción</h2>
<h2>Actividad</h2>
<h3>Consigna</h3>
```

## 5.5 No usar títulos solo por tamaño

Si se quiere cambiar tamaño, usar CSS. La etiqueta debe representar estructura.

---

# Módulo 6 — Texto alternativo para imágenes

## 6.1 Qué es alt

El atributo `alt` describe una imagen para personas que no pueden verla o cuando la imagen no carga.

```html
<img src="grafico.png" alt="Ventas mensuales crecieron de enero a junio">
```

## 6.2 Imágenes decorativas

Si una imagen no aporta información, puede tener alt vacío.

```html
<img src="separador.png" alt="">
```

## 6.3 Imágenes informativas

El alt debe comunicar el contenido relevante.

Malo: `alt="imagen"`.

Mejor: `alt="Persona usando una notebook con lector de pantalla"`.

## 6.4 Gráficos

Si la imagen es un gráfico, el alt debe resumir el mensaje y el contenido completo puede estar en texto cercano.

## 6.5 Evitar

Evitar “foto de...” innecesario, descripciones larguísimas, repetir texto cercano o dejar alt vacío en imágenes importantes.

---

# Módulo 7 — Enlaces y botones

## 7.1 Diferencia

Un enlace lleva a otro lugar.

```html
<a href="/cursos">Ver cursos</a>
```

Un botón ejecuta una acción.

```html
<button>Abrir menú</button>
```

## 7.2 Texto de enlace

Debe ser descriptivo.

Malo: `Click aquí`.

Mejor: `Ver curso de accesibilidad web`.

## 7.3 Botones claros

El texto debe explicar la acción: enviar formulario, descargar certificado, abrir menú, guardar cambios o continuar lección.

## 7.4 Área clickeable

Botones y enlaces deben ser suficientemente grandes, especialmente en móvil.

## 7.5 Foco visible

Cuando se navega con teclado, debe verse qué elemento está activo.

---

# Módulo 8 — Navegación por teclado

## 8.1 Por qué importa

Muchas personas navegan sin mouse. Usan teclado, switch, lector de pantalla o dispositivos adaptados.

## 8.2 Teclas básicas

- Tab: avanzar.
- Shift + Tab: retroceder.
- Enter: activar enlaces o botones.
- Espacio: activar botones.
- Escape: cerrar modales, si aplica.

## 8.3 Foco

El foco indica dónde está el usuario. No debe ocultarse con CSS.

Malo:

```css
*:focus {
  outline: none;
}
```

## 8.4 Orden lógico

El orden de tabulación debe seguir la lectura natural de la página.

## 8.5 Prueba simple

Intentar usar toda la página solo con teclado. Si algo no se puede hacer, hay una barrera.

---

# Módulo 9 — Color y contraste

## 9.1 Contraste

El texto debe contrastar suficientemente con el fondo. Bajo contraste dificulta lectura, especialmente en móviles, sol, baja visión o pantallas malas.

## 9.2 No depender solo del color

Malo:

> Los campos en rojo son obligatorios.

Mejor:

> Los campos obligatorios están marcados con * y un mensaje de texto.

## 9.3 Estados

Errores, alertas y éxito deben tener color y texto o icono.

## 9.4 Tamaño de texto

Evitar textos demasiado pequeños. Permitir zoom sin romper diseño.

## 9.5 Herramientas

Se pueden usar verificadores de contraste en navegador, Lighthouse, DevTools o extensiones de accesibilidad.

---

# Módulo 10 — Formularios accesibles

## 10.1 Etiquetas

Cada campo debe tener una etiqueta asociada.

```html
<label for="email">Correo electrónico</label>
<input id="email" name="email" type="email">
```

## 10.2 Placeholder no reemplaza label

Malo:

```html
<input placeholder="Nombre">
```

Mejor:

```html
<label for="nombre">Nombre</label>
<input id="nombre" name="nombre">
```

## 10.3 Ayuda

Agregar instrucciones cuando haga falta.

```html
<p id="ayuda-password">Usá al menos 8 caracteres.</p>
<input aria-describedby="ayuda-password">
```

## 10.4 Errores claros

Malo: `Error`.

Mejor: `El correo electrónico debe incluir @ y un dominio válido.`

## 10.5 Agrupar campos

Usar `fieldset` y `legend` para grupos de opciones.

---

# Módulo 11 — Contenido claro y legible

## 11.1 Lenguaje simple

Un sitio accesible usa lenguaje claro según su audiencia. Evitar frases demasiado largas, tecnicismos innecesarios, instrucciones ambiguas y bloques enormes de texto.

## 11.2 Escaneabilidad

Usar títulos, listas, párrafos cortos, tablas solo cuando correspondan, resaltados moderados y llamadas a la acción claras.

## 11.3 Instrucciones

Malo: `Complete correctamente`.

Mejor: `Ingresá tu correo para recibir el certificado del curso`.

## 11.4 Lectura móvil

En móvil, textos largos sin estructura se vuelven difíciles.

## 11.5 Consistencia

Usar los mismos términos para las mismas acciones. No alternar “Comprar”, “Adquirir”, “Pedir” y “Solicitar” si significan lo mismo.

---

# Módulo 12 — Multimedia accesible

## 12.1 Videos

Deben considerar subtítulos, transcripción, descripción de información visual importante, controles accesibles y no autoplay agresivo.

## 12.2 Audio

Debe ofrecer transcripción cuando el contenido sea importante.

## 12.3 Animaciones

Evitar animaciones excesivas o parpadeos.

## 12.4 Control del usuario

Permitir pausar, detener o controlar multimedia.

## 12.5 Contenido educativo

En cursos online, videos y audios deberían acompañarse con texto para mejorar comprensión y acceso.

---

# Módulo 13 — ARIA básica

## 13.1 Qué es ARIA

ARIA permite agregar información semántica cuando HTML nativo no alcanza, pero debe usarse con cuidado.

## 13.2 Regla principal

> No uses ARIA si podés resolverlo con HTML semántico.

## 13.3 Ejemplo útil

Un botón que abre menú puede indicar estado:

```html
<button aria-expanded="false" aria-controls="menu">
  Menú
</button>
<nav id="menu">
  ...
</nav>
```

## 13.4 Mal uso

Malo:

```html
<div role="button">Enviar</div>
```

Mejor:

```html
<button>Enviar</button>
```

## 13.5 ARIA no arregla todo

ARIA no corrige mal contraste, mala redacción, falta de teclado o formularios confusos.

---

# Módulo 14 — Componentes comunes

## 14.1 Menús

Deben poder abrirse y cerrarse con teclado, tener foco visible y orden lógico.

## 14.2 Modales

Deben mover foco al modal, permitir cerrar con Escape, no dejar foco perdido detrás, tener título claro y devolver foco al botón que lo abrió.

## 14.3 Acordeones

Deben indicar si están abiertos o cerrados, y funcionar con teclado.

## 14.4 Cards

Si toda una tarjeta es clickeable, el enlace debe ser claro y no duplicar muchos focos innecesarios.

## 14.5 Alertas

Los mensajes importantes deben ser visibles, claros y anunciables para tecnologías de asistencia si corresponde.

---

# Módulo 15 — Pruebas de accesibilidad

## 15.1 Prueba con teclado

Revisar si se puede navegar todo con Tab, si se ve el foco, si se pueden abrir y cerrar menús, enviar formularios y evitar trampas.

## 15.2 Lighthouse

Chrome Lighthouse puede detectar problemas básicos.

## 15.3 Lectores de pantalla

Opciones:

- NVDA en Windows.
- VoiceOver en macOS/iOS.
- TalkBack en Android.

No hace falta dominar todo al inicio, pero sí probar experiencias básicas.

## 15.4 Validadores

Usar WAVE, axe DevTools, Lighthouse, validadores HTML y contrast checkers.

## 15.5 Prueba humana

Las herramientas ayudan, pero no reemplazan revisión humana ni pruebas con usuarios reales.

---

# Módulo 16 — Checklist básico

## 16.1 Estructura

- Existe un `h1`.
- Los encabezados tienen orden lógico.
- Hay regiones semánticas.
- La navegación es clara.

## 16.2 Imágenes

- Imágenes informativas tienen alt útil.
- Imágenes decorativas tienen alt vacío.
- Gráficos tienen explicación textual.

## 16.3 Interacción

- Todo funciona con teclado.
- El foco es visible.
- Botones y enlaces son claros.
- No hay elementos clickeables falsos.

## 16.4 Formularios

- Cada campo tiene label.
- Los errores son claros.
- Hay ayuda cuando corresponde.
- Los campos obligatorios se indican con texto.

## 16.5 Visual

- Contraste suficiente.
- No se depende solo del color.
- Texto legible.
- Zoom funcional.

---

# Módulo 17 — Accesibilidad en proyectos educativos

## 17.1 Cursos online

Una plataforma educativa debe cuidar lectura clara, navegación por módulos, progreso comprensible, subtítulos, descargas accesibles, actividades entendibles, formularios accesibles y evaluaciones usables.

## 17.2 PDFs y documentos

No basta con subir un PDF escaneado como imagen. Un documento accesible debe tener texto seleccionable, estructura, títulos, orden de lectura, descripciones y buen contraste.

## 17.3 Evaluaciones

Deben permitir entender consigna, navegar con teclado, recibir errores claros, tener tiempo razonable y compatibilidad con tecnologías de asistencia.

## 17.4 Lectura

Para lecciones: párrafos cortos, títulos, índice, botones claros, progreso, modo responsive y buen contraste.

## 17.5 Inclusión

La accesibilidad educativa aumenta permanencia, comprensión y participación.

---

# Módulo 18 — Plan de mejora accesible

## 18.1 Auditoría inicial

Elegir una página y revisar encabezados, imágenes, teclado, formularios, contraste, enlaces, contenido y errores.

## 18.2 Priorizar

Prioridad alta: no se puede navegar, formularios imposibles, botones sin etiqueta, contraste muy bajo o contenido clave sin alternativa.

## 18.3 Mejoras rápidas

Agregar labels, mejorar textos de enlaces, corregir alt, restaurar foco visible, aumentar contraste, usar botones reales y ordenar encabezados.

## 18.4 Documentar

Registrar problema, impacto, solución, fecha, responsable y prueba realizada.

## 18.5 Mejora continua

La accesibilidad no se revisa una vez. Debe formar parte del proceso de diseño, desarrollo y contenido.

---

# Caso práctico integrador

## Caso: página de curso inaccesible

Una página de curso tiene estos problemas:

- botones hechos con `div`;
- imágenes sin alt;
- contraste bajo;
- formulario sin labels;
- menú no funciona con teclado;
- títulos desordenados;
- errores poco claros.

### Paso 1 — Diagnóstico

Se revisa con teclado, Lighthouse y checklist manual.

### Paso 2 — HTML semántico

Se reemplazan `div` clickeables por `button` y enlaces reales.

### Paso 3 — Imágenes

Se agregan alt útiles o vacíos si son decorativas.

### Paso 4 — Formularios

Se agregan labels, ayudas y errores claros.

### Paso 5 — Contraste

Se ajustan colores para mejorar lectura.

### Paso 6 — Navegación

El menú funciona con teclado y muestra foco visible.

### Resultado

La página mejora usabilidad para todos los usuarios y reduce barreras.

---

# Actividades del curso

1. Identificar 10 barreras de accesibilidad en un sitio.
2. Corregir estructura de encabezados de una página.
3. Escribir textos alternativos para 8 imágenes.
4. Transformar enlaces “click aquí” en enlaces descriptivos.
5. Probar una página solo con teclado.
6. Revisar contraste de colores.
7. Crear un formulario con labels y errores claros.
8. Mejorar un menú para que sea más usable.
9. Aplicar checklist básico a una página propia.
10. Documentar mejoras realizadas.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es accesibilidad web?
2. ¿Por qué beneficia a más personas que solo usuarios con discapacidad?
3. ¿Cuáles son los cuatro principios WCAG?
4. ¿Qué es HTML semántico?
5. ¿Por qué es importante la jerarquía de encabezados?
6. ¿Para qué sirve el atributo alt?
7. ¿Qué diferencia hay entre enlace y botón?
8. ¿Por qué debe poder navegarse con teclado?
9. ¿Por qué no se debe depender solo del color?
10. ¿Por qué un placeholder no reemplaza una label?
11. ¿Cuándo conviene usar ARIA?
12. ¿Por qué las herramientas automáticas no alcanzan?

## Parte 2 — Producción práctica

El estudiante debe entregar una **Mejora Básica de Accesibilidad Web**.

Debe incluir diagnóstico inicial, problemas detectados, mejoras semánticas, textos alternativos, revisión de teclado, mejoras de contraste, formulario accesible, checklist aplicado, pruebas realizadas, limitaciones y próximos pasos.

---

# Glosario básico

Accesibilidad web: diseño y desarrollo de contenido digital usable por la mayor cantidad posible de personas.

WCAG: pautas internacionales de accesibilidad para contenido web.

Perceptible: principio que exige que la información pueda percibirse.

Operable: principio que exige que la interfaz pueda usarse.

Comprensible: principio que exige que el contenido e interacción sean entendibles.

Robusto: principio que exige compatibilidad con tecnologías y navegadores.

HTML semántico: uso de etiquetas HTML según su significado.

Lector de pantalla: tecnología que interpreta contenido digital mediante voz o braille.

Texto alternativo: descripción textual de una imagen.

Foco: indicador del elemento activo al navegar con teclado.

Contraste: diferencia visual entre texto y fondo.

ARIA: atributos para mejorar semántica cuando HTML nativo no alcanza.

Label: etiqueta asociada a un campo de formulario.

Modal: ventana o panel emergente dentro de una interfaz.

Checklist: lista de verificación.

---

# Producto final del curso

Al finalizar, el estudiante debe crear una **Mejora Básica de Accesibilidad Web** sobre una página real o ficticia.

Ese producto debe permitir detectar barreras, mejorar estructura, escribir alt útiles, corregir navegación, mejorar formularios, revisar contraste, usar HTML semántico, aplicar pruebas simples, documentar cambios e incorporar accesibilidad al flujo de trabajo.

El curso termina cuando la persona deja de ver la accesibilidad como una obligación externa y empieza a verla como parte natural de una web profesional, inclusiva y de calidad.

---

# Fuentes recomendadas para profundizar

- W3C Web Accessibility Initiative — Introducción a la accesibilidad web.
- WCAG 2.2 — Web Content Accessibility Guidelines.
- MDN Web Docs — Accessibility.
- WebAIM — recursos y contrast checker.
- WAI-ARIA Authoring Practices Guide.
- Google Lighthouse — auditoría de accesibilidad.
- axe DevTools — pruebas automatizadas.
- Materiales introductorios sobre HTML semántico, formularios accesibles y diseño inclusivo.

# Curso 02 — Computación Cuántica para Curiosos

## Presentación del curso

La computación cuántica es una de las áreas tecnológicas más fascinantes y, al mismo tiempo, más difíciles de explicar con claridad. Suele aparecer rodeada de exageraciones: computadoras que “lo harán todo”, máquinas que “probarán todas las posibilidades a la vez” o promesas de una revolución inmediata. La realidad es más interesante y más compleja.

Este curso propone una introducción seria, gradual y comprensible a la computación cuántica. Está pensado para personas curiosas, estudiantes, docentes, divulgadores, emprendedores tecnológicos, programadores iniciales y cualquier persona que quiera entender qué hay detrás de conceptos como qubit, superposición, entrelazamiento, medición, decoherencia, algoritmos cuánticos y ventaja cuántica.

No se requiere saber física avanzada ni matemática universitaria. El curso evita tecnicismos innecesarios, pero también evita simplificaciones engañosas. La meta no es convertir al estudiante en investigador cuántico, sino darle una base conceptual sólida para comprender qué es la computación cuántica, por qué es diferente de la computación clásica, qué problemas podría resolver y cuáles son sus límites actuales.

La idea central es:

> La computación cuántica no es una computadora clásica más rápida. Es una forma distinta de procesar información usando principios físicos de la mecánica cuántica.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es computación cuántica y por qué se diferencia de la clásica.
2. Explicar qué es un bit y qué es un qubit.
3. Entender de manera introductoria superposición, medición y entrelazamiento.
4. Diferenciar una analogía útil de una explicación incorrecta.
5. Comprender por qué medir un sistema cuántico cambia el resultado disponible.
6. Reconocer qué son compuertas y circuitos cuánticos.
7. Conocer los principales tipos de hardware cuántico.
8. Comprender los problemas de ruido, decoherencia y corrección de errores.
9. Identificar aplicaciones posibles: criptografía, química, optimización, simulación y aprendizaje automático.
10. Conocer algoritmos famosos como Shor y Grover a nivel conceptual.
11. Diferenciar potencial real de hype tecnológico.
12. Diseñar una explicación divulgativa o mapa conceptual sobre computación cuántica.

---

# Módulo 1 — Qué es la computación cuántica

## 1.1 Definición

La computación cuántica es un paradigma de computación que utiliza propiedades de la mecánica cuántica para procesar información.

A diferencia de la computación clásica, que trabaja con bits, la computación cuántica trabaja con qubits.

## 1.2 Qué no es

La computación cuántica no es:

- una computadora mágica;
- una máquina que resuelve cualquier problema instantáneamente;
- un reemplazo directo de todas las computadoras actuales;
- una computadora clásica con más velocidad;
- una tecnología madura para cualquier uso cotidiano;
- una solución universal para todo tipo de cálculo.

## 1.3 Qué sí es

Es una tecnología que puede ofrecer ventajas en ciertos problemas específicos, especialmente donde la naturaleza cuántica, la exploración de grandes espacios de estados o ciertos algoritmos especializados permiten un enfoque diferente.

## 1.4 Por qué importa

Podría impactar en áreas como:

- simulación de moléculas;
- diseño de materiales;
- criptografía;
- optimización;
- investigación física;
- química computacional;
- ciertos problemas matemáticos;
- aprendizaje automático cuántico, todavía en investigación.

## 1.5 Estado actual

La computación cuántica está en desarrollo. Existen prototipos reales, servicios en la nube, laboratorios, lenguajes y empresas trabajando en el tema, pero todavía hay grandes desafíos técnicos.

---

# Módulo 2 — Computación clásica

## 2.1 Bit

El bit es la unidad mínima de información clásica.

Puede tener dos valores:

- 0;
- 1.

## 2.2 Hardware clásico

Las computadoras clásicas usan componentes electrónicos para representar bits mediante estados físicos.

Ejemplo simplificado:

- bajo voltaje: 0;
- alto voltaje: 1.

## 2.3 Operaciones lógicas

Los bits se procesan mediante compuertas lógicas.

Ejemplos:

- AND;
- OR;
- NOT;
- XOR.

## 2.4 Algoritmo clásico

Un algoritmo clásico es una secuencia de instrucciones definida para resolver un problema.

Ejemplos:

- ordenar una lista;
- buscar un dato;
- calcular una suma;
- procesar una imagen;
- ejecutar una aplicación.

## 2.5 Limitaciones

Las computadoras clásicas son extremadamente poderosas, pero algunos problemas crecen tan rápido en complejidad que se vuelven prácticamente intratables con métodos clásicos directos.

---

# Módulo 3 — Por qué aparece la computación cuántica

## 3.1 Simular la naturaleza

La naturaleza a escala microscópica se comporta según reglas cuánticas.

Simular sistemas cuánticos complejos en computadoras clásicas puede ser muy difícil porque la cantidad de información crece rápidamente.

## 3.2 Idea de Feynman

Una motivación histórica de la computación cuántica fue la idea de usar sistemas cuánticos para simular otros sistemas cuánticos.

## 3.3 No todos los problemas mejoran

La computación cuántica no acelera todo.

Es útil potencialmente para ciertos tipos de problemas, no para cualquier tarea.

## 3.4 Cambio de paradigma

En computación clásica, la información se representa en bits.

En computación cuántica, la información se representa en estados cuánticos manipulados mediante operaciones cuánticas.

## 3.5 Pregunta clave

> ¿Qué problemas pueden beneficiarse de procesar información usando propiedades cuánticas?

---

# Módulo 4 — Mecánica cuántica mínima

## 4.1 Qué es la mecánica cuántica

La mecánica cuántica es la teoría física que describe el comportamiento de la materia y la energía a escalas microscópicas.

Explica fenómenos que la física clásica no puede describir correctamente.

## 4.2 Escala cuántica

Aparece en sistemas como:

- electrones;
- fotones;
- átomos;
- iones;
- superconductores;
- partículas subatómicas.

## 4.3 Probabilidad

La mecánica cuántica describe resultados mediante probabilidades.

Antes de medir, el sistema puede estar descrito por un estado que no equivale simplemente a “ya tiene un valor oculto clásico”.

## 4.4 Estado cuántico

Un estado cuántico contiene la información necesaria para calcular probabilidades de resultados posibles.

## 4.5 Cuidado con analogías

La cuántica no debe reducirse a frases como “todo es posible” o “la mente crea la realidad”. Este curso se mantiene en el uso científico del concepto.

---

# Módulo 5 — Qubit

## 5.1 Qué es un qubit

Un qubit es la unidad básica de información cuántica.

Puede medirse como 0 o 1, pero antes de la medición su estado puede involucrar una combinación cuántica de posibilidades.

## 5.2 Diferencia con bit

Bit clásico:

- está en 0 o 1.

Qubit:

- al medirse da 0 o 1;
- antes de medirse se describe mediante amplitudes cuánticas.

## 5.3 Amplitudes

Las amplitudes son valores matemáticos asociados a los resultados posibles. Al medir, las probabilidades dependen de esas amplitudes.

No son probabilidades comunes simples, porque pueden interferir.

## 5.4 Representación conceptual

Un qubit puede pensarse como un estado manipulable antes de la medición.

Pero no debe imaginarse simplemente como “0 y 1 al mismo tiempo” en sentido clásico.

## 5.5 Medición

Cuando se mide un qubit, se obtiene un resultado clásico: 0 o 1.

---

# Módulo 6 — Superposición

## 6.1 Qué es

La superposición es una propiedad por la cual un sistema cuántico puede estar descrito como combinación de estados posibles.

En un qubit, puede haber una superposición de los estados base 0 y 1.

## 6.2 Analogía prudente

Puede imaginarse como una mezcla matemática de posibilidades antes de medir, pero no como un objeto clásico que simplemente tiene dos valores simultáneos en secreto.

## 6.3 Por qué importa

La superposición permite que los algoritmos cuánticos manipulen amplitudes de múltiples estados.

## 6.4 Interferencia

La clave no es solo tener muchas posibilidades, sino hacer que las amplitudes interfieran de forma útil:

- algunas se refuerzan;
- otras se cancelan.

## 6.5 Error común

Decir que una computadora cuántica prueba todas las respuestas a la vez y luego elige la correcta es engañoso.

La parte difícil es diseñar un algoritmo que aumente la probabilidad de medir una respuesta útil.

---

# Módulo 7 — Medición

## 7.1 Qué es medir

Medir un sistema cuántico produce un resultado clásico observable.

En el caso de un qubit, el resultado será 0 o 1.

## 7.2 La medición cambia el estado disponible

Después de medir, la superposición original deja de estar disponible para seguir siendo usada del mismo modo.

## 7.3 Probabilidad

El resultado no se elige arbitrariamente. Está gobernado por probabilidades derivadas del estado cuántico.

## 7.4 Repetición

Para estimar probabilidades, muchas veces se ejecuta el mismo circuito muchas veces y se observan frecuencias de resultados.

## 7.5 Importancia computacional

El diseño del algoritmo busca que, al final, la medición tenga alta probabilidad de devolver una respuesta útil.

---

# Módulo 8 — Entrelazamiento

## 8.1 Qué es

El entrelazamiento es una correlación cuántica entre sistemas que no puede explicarse como simple desconocimiento clásico.

Dos o más qubits entrelazados tienen un estado conjunto que no se puede describir completamente separando cada qubit por su cuenta.

## 8.2 Por qué importa

El entrelazamiento es un recurso fundamental en:

- computación cuántica;
- comunicación cuántica;
- teleportación cuántica;
- criptografía cuántica;
- investigación de fundamentos físicos.

## 8.3 No permite comunicación instantánea útil

Aunque el entrelazamiento produce correlaciones fuertes, no permite enviar información más rápido que la luz.

## 8.4 Diferencia con correlación clásica

Dos guantes en cajas separadas están correlacionados clásicamente: si uno es izquierdo, el otro será derecho.

El entrelazamiento es más profundo: las correlaciones no se explican como propiedades clásicas ya definidas de antemano.

## 8.5 En computación

Muchos algoritmos cuánticos usan entrelazamiento para crear relaciones complejas entre qubits.

---

# Módulo 9 — Interferencia cuántica

## 9.1 Concepto

La interferencia cuántica ocurre cuando amplitudes de probabilidad se combinan.

Pueden:

- reforzarse;
- cancelarse.

## 9.2 Analogía con ondas

Como ondas de agua o sonido pueden sumarse o cancelarse, las amplitudes cuánticas también pueden interferir.

La analogía es útil, pero no completa.

## 9.3 Computación

Los algoritmos cuánticos buscan organizar la interferencia para aumentar la probabilidad de respuestas correctas y reducir respuestas incorrectas.

## 9.4 No basta con superposición

Sin interferencia útil, la superposición no resuelve el problema.

## 9.5 Idea clave

> La ventaja cuántica no viene de “mirar todas las opciones”, sino de manipular amplitudes para que la respuesta útil sea más probable al medir.

---

# Módulo 10 — Compuertas cuánticas

## 10.1 Qué son

Las compuertas cuánticas son operaciones que modifican el estado de qubits.

Son equivalentes conceptuales a las compuertas lógicas clásicas, pero operan sobre estados cuánticos.

## 10.2 Compuerta X

Similar a un NOT cuántico en la base computacional: intercambia 0 y 1.

## 10.3 Compuerta H

La compuerta Hadamard puede crear superposición a partir de un estado base.

## 10.4 Compuertas de fase

Modifican fases de amplitudes, lo que afecta interferencia posterior.

## 10.5 Compuertas de dos qubits

Ejemplo:

- CNOT.

Permiten crear correlaciones y entrelazamiento.

## 10.6 Circuito cuántico

Un circuito cuántico es una secuencia de compuertas aplicadas a qubits, seguida muchas veces de medición.

---

# Módulo 11 — Circuitos cuánticos

## 11.1 Qué es un circuito

Un circuito cuántico representa operaciones sobre qubits a lo largo del tiempo.

Visualmente, cada línea suele representar un qubit.

## 11.2 Estructura general

Un circuito puede incluir:

- inicialización;
- compuertas;
- entrelazamiento;
- mediciones;
- resultados clásicos.

## 11.3 Ejecuciones repetidas

Como el resultado es probabilístico, se ejecuta muchas veces.

Cada ejecución se llama a veces “shot”.

## 11.4 Interpretación

El resultado se analiza observando distribución de mediciones.

## 11.5 Simuladores

Antes de usar hardware real, se pueden simular circuitos en computadoras clásicas, aunque la simulación se vuelve difícil al aumentar qubits.

---

# Módulo 12 — Hardware cuántico

## 12.1 Por qué es difícil

Los estados cuánticos son frágiles. Interactuar con el ambiente puede destruir información útil.

## 12.2 Qubits superconductores

Usan circuitos superconductores a temperaturas extremadamente bajas.

Son usados por varias empresas y laboratorios.

## 12.3 Iones atrapados

Usan átomos ionizados controlados con campos electromagnéticos y láseres.

## 12.4 Fotones

Usan partículas de luz para transportar y procesar información cuántica.

## 12.5 Átomos neutros

Usan átomos controlados mediante láseres, una línea de investigación muy activa.

## 12.6 No hay una única tecnología ganadora

Diferentes enfoques compiten y avanzan con ventajas y desafíos propios.

---

# Módulo 13 — Ruido y decoherencia

## 13.1 Ruido

El ruido son perturbaciones que afectan el estado cuántico y generan errores.

## 13.2 Decoherencia

La decoherencia ocurre cuando un sistema cuántico pierde sus propiedades útiles por interacción con el entorno.

## 13.3 Por qué importa

La computación cuántica requiere mantener estados delicados el tiempo suficiente para ejecutar algoritmos.

## 13.4 Errores

Los errores pueden surgir por:

- control imperfecto;
- temperatura;
- vibraciones;
- radiación;
- interacción con el ambiente;
- medición no deseada;
- fallas de compuertas.

## 13.5 NISQ

Se llama NISQ a la etapa de dispositivos cuánticos ruidosos de escala intermedia.

Son máquinas reales, pero limitadas por ruido y cantidad/calidad de qubits.

---

# Módulo 14 — Corrección de errores cuánticos

## 14.1 Problema

En computación clásica, se pueden copiar bits para proteger información. En cuántica, no se puede copiar un estado cuántico arbitrario por el teorema de no clonación.

## 14.2 Corrección cuántica

La corrección de errores cuánticos usa varios qubits físicos para formar qubits lógicos más estables.

## 14.3 Qubit físico y lógico

Qubit físico:

- dispositivo real individual.

Qubit lógico:

- unidad protegida construida a partir de varios qubits físicos.

## 14.4 Sobrecarga

La corrección de errores puede requerir muchos qubits físicos por cada qubit lógico.

## 14.5 Importancia

Para computación cuántica a gran escala, la corrección de errores es uno de los grandes desafíos.

---

# Módulo 15 — Algoritmo de Deutsch-Jozsa

## 15.1 Por qué se estudia

Es un algoritmo histórico y educativo que muestra cómo un circuito cuántico puede resolver cierto problema con menos consultas que un enfoque clásico determinista.

## 15.2 Problema

Distinguir si una función es constante o balanceada bajo ciertas condiciones.

## 15.3 Valor pedagógico

No es famoso por su aplicación comercial directa, sino por demostrar una separación conceptual.

## 15.4 Enseñanza

Muestra:

- superposición;
- interferencia;
- consulta a un oráculo;
- medición final.

## 15.5 Cuidado

No debe venderse como una aplicación práctica inmediata. Es un ejemplo fundacional.

---

# Módulo 16 — Algoritmo de Grover

## 16.1 Qué problema aborda

Grover permite acelerar la búsqueda no estructurada.

Si se busca un elemento en una lista sin orden, Grover puede ofrecer una aceleración cuadrática.

## 16.2 Aceleración cuadrática

Si clásicamente se requieren N pasos en promedio, Grover puede requerir aproximadamente raíz de N consultas.

## 16.3 No es magia

No convierte búsquedas enormes en instantáneas, pero sí puede representar una mejora importante.

## 16.4 Idea conceptual

Grover amplifica la amplitud de la respuesta correcta y reduce la de las incorrectas.

## 16.5 Aplicaciones

Se relaciona con búsqueda, optimización y análisis de seguridad, aunque requiere hardware cuántico suficientemente robusto para usos grandes.

---

# Módulo 17 — Algoritmo de Shor

## 17.1 Qué problema aborda

Shor permite factorizar enteros grandes de manera eficiente en una computadora cuántica ideal.

## 17.2 Importancia

Muchos sistemas criptográficos clásicos dependen de que factorizar números grandes sea difícil para computadoras clásicas.

## 17.3 Impacto en criptografía

Una computadora cuántica grande y corregida de errores podría amenazar ciertos sistemas criptográficos actuales.

## 17.4 Estado actual

No implica que toda la criptografía esté rota hoy. Se necesitan máquinas cuánticas mucho más grandes y robustas.

## 17.5 Criptografía post-cuántica

Se desarrollan sistemas criptográficos resistentes a ataques cuánticos conocidos.

---

# Módulo 18 — Simulación cuántica

## 18.1 Aplicación natural

Una de las aplicaciones más prometedoras es simular sistemas cuánticos.

## 18.2 Química

La química molecular depende de interacciones cuánticas. Simularlas mejor podría ayudar en:

- nuevos materiales;
- medicamentos;
- catalizadores;
- baterías;
- procesos industriales.

## 18.3 Física de materiales

Puede ayudar a estudiar superconductores, magnetismo, fases exóticas y fenómenos complejos.

## 18.4 Ventaja esperada

Como la naturaleza microscópica es cuántica, usar sistemas cuánticos para modelarla puede ser más natural que simularla clásicamente.

## 18.5 Desafíos

Requiere precisión, control, escalabilidad y algoritmos adecuados.

---

# Módulo 19 — Optimización cuántica

## 19.1 Qué es optimización

Optimizar significa buscar la mejor solución entre muchas posibilidades.

Ejemplos:

- rutas;
- asignación de recursos;
- horarios;
- portafolios;
- logística;
- producción;
- redes.

## 19.2 Problemas difíciles

Muchos problemas de optimización crecen rápidamente con el tamaño.

## 19.3 Enfoques cuánticos

Existen enfoques como:

- annealing cuántico;
- algoritmos variacionales;
- QAOA.

## 19.4 Prudencia

No todo problema de optimización será resuelto mejor por computadoras cuánticas.

## 19.5 Estado

Es un área activa de investigación, con potencial pero también con muchas preguntas abiertas.

---

# Módulo 20 — Criptografía cuántica y post-cuántica

## 20.1 Diferencia

Criptografía cuántica:

- usa principios cuánticos para comunicación segura, como distribución cuántica de claves.

Criptografía post-cuántica:

- algoritmos clásicos diseñados para resistir ataques de computadoras cuánticas.

## 20.2 QKD

La distribución cuántica de claves busca detectar intentos de espionaje usando propiedades cuánticas.

## 20.3 Amenaza cuántica

Shor amenaza ciertos sistemas basados en factorización y logaritmos discretos.

## 20.4 Transición

Gobiernos, empresas y organismos trabajan en migrar a esquemas post-cuánticos.

## 20.5 Importancia práctica

La seguridad digital a largo plazo debe considerar el riesgo futuro de computadoras cuánticas robustas.

---

# Módulo 21 — Programación cuántica

## 21.1 Qué significa programar una computadora cuántica

No significa escribir un programa común y ejecutarlo más rápido.

Significa diseñar circuitos o algoritmos que manipulan qubits mediante compuertas y mediciones.

## 21.2 Herramientas

Existen frameworks como:

- Qiskit;
- Cirq;
- PennyLane;
- Braket SDK;
- Q#.

## 21.3 Simuladores

Permiten ejecutar circuitos pequeños en computadoras clásicas.

## 21.4 Hardware en la nube

Algunas plataformas permiten enviar trabajos a dispositivos cuánticos reales disponibles en la nube.

## 21.5 Perfil requerido

Para avanzar se necesita combinar:

- álgebra lineal;
- probabilidad;
- programación;
- física cuántica;
- teoría de algoritmos.

Este curso solo abre la puerta conceptual.

---

# Módulo 22 — Hype, límites y realidad

## 22.1 Hype

La computación cuántica suele presentarse con promesas exageradas.

## 22.2 Señales de exageración

Desconfiar de frases como:

- “resolverá todos los problemas”;
- “reemplazará todas las computadoras”;
- “ya rompió toda la seguridad”;
- “funciona porque prueba todo a la vez”;
- “estará en todos los hogares pronto”.

## 22.3 Límites reales

- ruido;
- decoherencia;
- cantidad de qubits;
- corrección de errores;
- costo;
- especialización;
- dificultad algorítmica;
- problemas donde no hay ventaja conocida.

## 22.4 Valor real

Aun con límites, el campo es importante porque puede abrir capacidades nuevas en problemas específicos.

## 22.5 Actitud correcta

Ni rechazo automático ni entusiasmo ingenuo.

La postura profesional es:

> entender fundamentos, distinguir evidencia de marketing y seguir la evolución técnica.

---

# Módulo 23 — Futuro de la computación cuántica

## 23.1 Posibles etapas

1. Dispositivos experimentales.
2. NISQ.
3. Mejores qubits y menor ruido.
4. Corrección de errores más robusta.
5. Qubits lógicos escalables.
6. Aplicaciones prácticas específicas.

## 23.2 Áreas con expectativa

- química;
- materiales;
- criptografía;
- simulación física;
- optimización;
- investigación fundamental;
- sensores cuánticos.

## 23.3 Ecosistema

Incluye:

- universidades;
- startups;
- grandes tecnológicas;
- gobiernos;
- laboratorios;
- plataformas cloud;
- estándares de seguridad.

## 23.4 Formación

Quienes quieran avanzar pueden estudiar:

- álgebra lineal;
- física moderna;
- Python;
- algoritmos;
- Qiskit o similares;
- teoría de información.

## 23.5 Pregunta abierta

La computación cuántica todavía está construyendo su camino hacia aplicaciones prácticas masivas.

---

# Módulo 24 — Proyecto final

## 24.1 Objetivo

Crear una explicación, mapa conceptual o mini investigación sobre computación cuántica para público no experto.

## 24.2 Opciones de proyecto

- infografía: bit vs qubit;
- presentación: superposición, medición y entrelazamiento;
- mapa conceptual de computación cuántica;
- artículo divulgativo sobre Shor y criptografía;
- explicación visual de un circuito cuántico simple;
- análisis crítico de una noticia sobre computación cuántica;
- glosario comentado de conceptos cuánticos.

## 24.3 Requisitos

Debe incluir:

- tema;
- pregunta guía;
- explicación conceptual;
- analogías controladas;
- advertencias contra malentendidos;
- ejemplo;
- glosario;
- fuentes;
- conclusión.

## 24.4 Criterio de calidad

Se evaluará:

- claridad;
- precisión;
- ausencia de exageraciones;
- uso correcto de conceptos;
- capacidad de explicar a principiantes;
- estructura;
- fuentes.

## 24.5 Resultado

El estudiante debe poder explicar qué es la computación cuántica sin caer en frases mágicas ni marketing vacío.

---

# Caso práctico integrador

## Caso: explicar qubits a una persona no técnica

Una persona pregunta:

> ¿Un qubit es simplemente 0 y 1 al mismo tiempo?

### Paso 1 — Respuesta inicial

No exactamente. Un qubit, al medirse, da 0 o 1. Antes de medirlo, su estado se describe mediante amplitudes cuánticas asociadas a esos resultados.

### Paso 2 — Analogía prudente

Puede pensarse como una combinación matemática de posibilidades, pero no como una moneda clásica que ya tiene dos caras activas a la vez.

### Paso 3 — Concepto clave

La utilidad aparece cuando las amplitudes se manipulan mediante compuertas y se produce interferencia.

### Paso 4 — Medición

Al medir, se obtiene un resultado clásico.

### Paso 5 — Cierre

La computación cuántica no consiste en leer todas las respuestas, sino en diseñar operaciones para que la respuesta útil tenga más probabilidad de aparecer.

---

# Actividades del curso

## Actividad 1 — Bit vs qubit

Crear una tabla comparativa entre bit clásico y qubit.

## Actividad 2 — Analogías

Escribir una analogía para superposición y luego aclarar sus límites.

## Actividad 3 — Medición

Explicar por qué la medición es importante en computación cuántica.

## Actividad 4 — Entrelazamiento

Redactar una explicación breve que evite decir “comunicación instantánea”.

## Actividad 5 — Interferencia

Explicar por qué la interferencia es clave para algoritmos cuánticos.

## Actividad 6 — Circuitos

Dibujar un circuito conceptual con dos qubits, compuertas y medición.

## Actividad 7 — Hardware

Comparar dos tecnologías de qubits.

## Actividad 8 — Algoritmos

Explicar la diferencia conceptual entre Grover y Shor.

## Actividad 9 — Hype

Analizar una noticia sobre computación cuántica e identificar exageraciones.

## Actividad 10 — Proyecto final

Crear una pieza divulgativa sobre un concepto cuántico.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es la computación cuántica?
2. ¿Qué diferencia hay entre bit y qubit?
3. ¿Qué es superposición?
4. ¿Por qué decir “0 y 1 al mismo tiempo” puede ser incompleto?
5. ¿Qué ocurre al medir un qubit?
6. ¿Qué es entrelazamiento?
7. ¿Por qué el entrelazamiento no permite comunicación más rápida que la luz?
8. ¿Qué es interferencia cuántica?
9. ¿Qué es una compuerta cuántica?
10. ¿Qué es un circuito cuántico?
11. ¿Qué es decoherencia?
12. ¿Por qué la corrección de errores cuánticos es difícil?
13. ¿Qué idea general tiene Grover?
14. ¿Por qué Shor importa para criptografía?
15. ¿Qué es criptografía post-cuántica?
16. ¿Qué significa hype en este contexto?

## Parte 2 — Producción práctica

El estudiante debe entregar una **Explicación Divulgativa de Computación Cuántica**.

Debe incluir:

1. tema elegido;
2. pregunta guía;
3. explicación gradual;
4. conceptos correctos;
5. analogía con límites aclarados;
6. ejemplo;
7. riesgos de malinterpretación;
8. glosario;
9. fuentes;
10. conclusión.

---

# Glosario básico

Computación cuántica: paradigma de computación que usa principios de la mecánica cuántica para procesar información.

Bit: unidad clásica de información con valores 0 o 1.

Qubit: unidad cuántica de información que al medirse produce 0 o 1, y antes se describe mediante amplitudes.

Superposición: combinación cuántica de estados posibles.

Medición: proceso que produce un resultado clásico a partir de un sistema cuántico.

Amplitud: valor matemático asociado a resultados posibles, relacionado con probabilidades.

Interferencia: combinación de amplitudes que puede reforzar o cancelar resultados.

Entrelazamiento: correlación cuántica entre sistemas que no se describe separando sus partes.

Compuerta cuántica: operación que modifica estados de qubits.

Circuito cuántico: secuencia de compuertas y mediciones.

Decoherencia: pérdida de propiedades cuánticas útiles por interacción con el entorno.

Ruido: perturbaciones que generan errores en sistemas cuánticos.

Qubit físico: qubit implementado en hardware real.

Qubit lógico: qubit protegido mediante corrección de errores.

NISQ: etapa de dispositivos cuánticos ruidosos de escala intermedia.

Algoritmo de Grover: algoritmo cuántico para acelerar búsqueda no estructurada.

Algoritmo de Shor: algoritmo cuántico para factorizar enteros eficientemente en una computadora cuántica ideal.

Criptografía post-cuántica: algoritmos clásicos diseñados para resistir ataques cuánticos.

Simulación cuántica: uso de sistemas cuánticos para estudiar otros sistemas cuánticos.

API cuántica/cloud cuántica: acceso remoto a simuladores o hardware cuántico mediante plataformas.

---

# Producto final del curso

Al finalizar, el estudiante debe crear una **Explicación Divulgativa de Computación Cuántica**.

Ese producto debe permitir:

- explicar el tema sin exageraciones;
- diferenciar bit y qubit;
- describir superposición, medición e interferencia;
- aclarar qué es entrelazamiento;
- entender aplicaciones posibles;
- reconocer límites técnicos;
- distinguir ciencia de marketing;
- comunicar el tema a público no experto.

El curso termina cuando la persona deja de ver la computación cuántica como magia tecnológica y empieza a comprenderla como una disciplina científica y computacional específica, poderosa en ciertos problemas y limitada por desafíos reales.

---

# Fuentes recomendadas para profundizar

- IBM Quantum Learning.
- Microsoft Quantum documentation.
- Qiskit Textbook / Qiskit Learning.
- Google Quantum AI educational resources.
- Nielsen & Chuang — Quantum Computation and Quantum Information.
- John Preskill — Quantum computing lecture notes.
- MIT OpenCourseWare — Quantum information science.
- Nature Reviews Physics — artículos introductorios sobre computación cuántica.
- NIST — Post-Quantum Cryptography.
- Materiales introductorios sobre qubits, circuitos cuánticos, algoritmos de Shor y Grover, decoherencia y corrección de errores.

# Curso 29 — Gobierno de Datos Básico

## Presentación del curso

El gobierno de datos es una disciplina esencial para que una organización pueda usar sus datos de manera confiable, segura, ordenada y responsable. No alcanza con tener planillas, reportes, dashboards o bases de datos. También hace falta definir quién es responsable de cada dato, qué reglas se aplican, quién puede acceder, cómo se corrigen errores, cómo se documentan definiciones, cómo se protege información sensible y cómo se asegura que los datos sirvan para tomar decisiones.

En organizaciones pequeñas, emprendimientos, escuelas, comercios, equipos administrativos o proyectos comunitarios, el gobierno de datos puede sonar como algo lejano o corporativo. Pero sus problemas aparecen todos los días:

- varias personas usan versiones distintas de una planilla;
- nadie sabe cuál es el reporte oficial;
- se comparten datos de clientes sin criterio;
- se modifican fórmulas sin avisar;
- no hay responsable claro;
- se mezclan datos personales con archivos públicos;
- cada área calcula un indicador de forma diferente;
- los errores se corrigen sin dejar registro.

Este curso enseña gobierno de datos desde cero, con un enfoque práctico y accesible. No se trata de burocracia ni de crear documentos interminables. Se trata de construir reglas mínimas para que los datos sean confiables, protegidos y útiles.

La idea central es:

> Gobernar datos no es controlar por controlar. Es definir responsabilidades, reglas y cuidados para que los datos puedan usarse con confianza.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es gobierno de datos.
2. Diferenciar gobierno de datos, calidad de datos, seguridad y gestión documental.
3. Identificar activos de datos críticos.
4. Definir roles básicos: data owner, data steward, productor y consumidor.
5. Crear políticas simples de uso, acceso, calidad y documentación.
6. Clasificar datos según sensibilidad.
7. Establecer reglas de acceso y permisos.
8. Comprender el ciclo de vida de los datos.
9. Diseñar un comité o rutina mínima de gobierno.
10. Crear un marco básico de gobierno de datos para una organización pequeña o caso ficticio.

---

# Módulo 1 — Qué es gobierno de datos

## 1.1 Definición

El gobierno de datos es el conjunto de roles, reglas, políticas, procesos y responsabilidades que permiten gestionar los datos de una organización de manera confiable, segura, ética y útil.

Incluye preguntas como:

- ¿qué datos tenemos?
- ¿quién es responsable?
- ¿quién puede acceder?
- ¿qué dato es oficial?
- ¿cómo se define cada indicador?
- ¿cómo se corrigen errores?
- ¿cómo se protege información sensible?
- ¿cuánto tiempo se conserva?
- ¿quién aprueba cambios?
- ¿cómo se documenta?

## 1.2 Gobierno no es solo tecnología

Una organización puede tener buenas herramientas y mal gobierno.

Ejemplo:

- usa Power BI, pero cada dashboard calcula ventas de forma distinta;
- usa Google Drive, pero todos tienen permisos de edición;
- usa CRM, pero nadie actualiza clientes;
- usa Excel, pero no hay versión oficial.

El gobierno de datos es principalmente una cuestión de reglas, personas y responsabilidad.

## 1.3 Por qué importa

Un buen gobierno de datos ayuda a:

- aumentar confianza;
- reducir errores;
- proteger datos sensibles;
- mejorar reportes;
- evitar duplicados;
- cumplir normas;
- ahorrar tiempo;
- tomar mejores decisiones;
- aclarar responsabilidades;
- sostener calidad.

## 1.4 Riesgos de no gobernar datos

Sin gobierno aparecen:

- reportes contradictorios;
- uso indebido de información;
- accesos excesivos;
- pérdida de datos;
- baja calidad;
- decisiones erróneas;
- conflictos entre áreas;
- falta de trazabilidad;
- exposición de datos personales;
- dependencia de personas específicas.

---

# Módulo 2 — Gobierno, calidad, seguridad y catálogo

## 2.1 Gobierno de datos

Define reglas, responsables y procesos para gestionar datos.

Pregunta principal:

> ¿Cómo se administran los datos y quién responde por ellos?

## 2.2 Calidad de datos

Se enfoca en que los datos sean completos, correctos, consistentes, válidos, únicos y actualizados.

Pregunta principal:

> ¿Los datos sirven para el propósito que necesitamos?

## 2.3 Seguridad de datos

Se enfoca en proteger datos contra accesos no autorizados, pérdida, modificación indebida o exposición.

Pregunta principal:

> ¿Quién puede ver, modificar o compartir los datos?

## 2.4 Catálogo de datos

Organiza conocimiento sobre activos de datos, definiciones, responsables, linaje y uso.

Pregunta principal:

> ¿Dónde están los datos, qué significan y quién los mantiene?

## 2.5 Relación entre conceptos

Gobierno define reglas.
Calidad mide si los datos están bien.
Seguridad protege el acceso.
Catálogo documenta y facilita descubrimiento.

Trabajan juntos.

---

# Módulo 3 — Activos de datos críticos

## 3.1 Qué es un activo de datos

Un activo de datos es cualquier recurso que contiene o representa datos útiles.

Ejemplos:

- base de clientes;
- planilla de ventas;
- inventario;
- dashboard;
- sistema de facturación;
- formulario;
- reporte mensual;
- base de estudiantes;
- registro de reclamos;
- tabla de productos.

## 3.2 No todos los activos tienen la misma importancia

Algunos activos son críticos porque afectan:

- ingresos;
- clientes;
- obligaciones legales;
- privacidad;
- decisiones directivas;
- continuidad operativa;
- reputación;
- pagos;
- stock;
- atención.

## 3.3 Criterios de criticidad

Un activo puede ser crítico si:

- se usa para decisiones importantes;
- contiene datos personales;
- alimenta reportes oficiales;
- impacta dinero;
- se comparte con terceros;
- se actualiza con frecuencia;
- muchos usuarios dependen de él;
- su error genera daño.

## 3.4 Inventario inicial

Crear una tabla:

| Activo | Tipo | Área | Responsable | Criticidad | Sensibilidad |
|---|---|---|---|---|---|

Ejemplo:

| Base de clientes | Planilla | Comercial | Ventas | Alta | Alta |
| Reporte mensual | Dashboard | Dirección | BI | Alta | Media |
| Catálogo de productos | Planilla | Operaciones | Stock | Media | Baja |

## 3.5 Priorizar

No se gobierna todo al mismo tiempo. Se empieza por activos críticos.

Prioridad inicial:

1. datos personales;
2. datos financieros;
3. reportes oficiales;
4. indicadores clave;
5. bases compartidas;
6. datos con errores frecuentes.

---

# Módulo 4 — Roles de gobierno

## 4.1 Data owner

El data owner es responsable del dato desde el punto de vista de negocio.

Define:

- finalidad del dato;
- reglas de uso;
- nivel de calidad esperado;
- acceso autorizado;
- criterios de actualización;
- prioridades de mejora.

Ejemplo:

El responsable comercial puede ser owner de los datos de ventas.

## 4.2 Data steward

El data steward cuida la documentación, calidad y uso correcto del dato.

Tareas:

- mantener glosario;
- revisar calidad;
- documentar campos;
- detectar inconsistencias;
- coordinar correcciones;
- responder dudas;
- proponer reglas.

## 4.3 Productor de datos

Es quien genera o carga datos.

Ejemplos:

- vendedor que registra pedido;
- formulario web;
- sistema de facturación;
- docente que carga asistencia;
- atención al cliente que registra reclamo.

## 4.4 Consumidor de datos

Es quien usa datos para consultar, analizar, reportar o decidir.

Ejemplos:

- analista;
- gerente;
- emprendedor;
- docente;
- administrativo;
- auditor;
- equipo de marketing.

## 4.5 Responsable técnico

En organizaciones con sistemas, puede existir un responsable técnico:

- administra bases;
- gestiona integraciones;
- mantiene permisos;
- resuelve incidentes;
- asegura disponibilidad.

## 4.6 Por qué los roles deben estar claros

Sin roles:

- nadie corrige datos;
- nadie aprueba cambios;
- nadie define términos;
- nadie responde dudas;
- todos usan criterios distintos.

---

# Módulo 5 — Políticas de datos

## 5.1 Qué es una política

Una política de datos es una regla formal o acordada sobre cómo se deben gestionar, usar, proteger o documentar los datos.

No tiene que ser compleja. Debe ser clara y aplicable.

## 5.2 Política de acceso

Define quién puede ver o editar datos.

Ejemplo:

> Solo el equipo de administración puede editar la planilla de pagos. El equipo comercial puede verla en modo lectura.

## 5.3 Política de calidad

Define reglas mínimas de carga y revisión.

Ejemplo:

> Toda venta debe tener fecha, cliente, producto, monto, estado y canal. Los registros incompletos deben revisarse antes del cierre semanal.

## 5.4 Política de documentación

Define qué debe documentarse.

Ejemplo:

> Todo indicador usado en reportes mensuales debe tener definición, fórmula, fuente y responsable.

## 5.5 Política de conservación

Define cuánto tiempo se guardan los datos.

Ejemplo:

> Los comprobantes se conservan en carpeta anual. Los formularios vencidos se cierran y archivan al finalizar el período.

## 5.6 Política de uso responsable

Define límites.

Ejemplo:

> Los datos de clientes no deben compartirse en grupos abiertos ni enviarse a personas no autorizadas.

---

# Módulo 6 — Clasificación de datos

## 6.1 Por qué clasificar

No todos los datos requieren el mismo nivel de protección.

Clasificar permite decidir:

- quién accede;
- cómo se comparte;
- dónde se guarda;
- si se puede publicar;
- si requiere anonimización;
- cuánto cuidado necesita.

## 6.2 Niveles simples

Una clasificación básica puede ser:

### Público

Puede compartirse sin riesgo significativo.

Ejemplo:

- horarios publicados;
- catálogo sin datos internos;
- información institucional pública.

### Interno

Uso dentro del equipo u organización.

Ejemplo:

- procedimientos;
- cronogramas;
- plantillas internas;
- reportes generales.

### Confidencial

Debe limitarse a personas autorizadas.

Ejemplo:

- datos de clientes;
- ventas detalladas;
- gastos;
- contratos;
- estrategias.

### Sensible

Requiere máximo cuidado.

Ejemplo:

- datos bancarios;
- salud;
- menores;
- documentos personales;
- credenciales;
- información legal delicada.

## 6.3 Datos personales

Los datos personales identifican o pueden identificar a una persona.

Ejemplos:

- nombre;
- DNI;
- teléfono;
- correo;
- domicilio;
- ubicación;
- imagen;
- datos laborales;
- datos financieros.

## 6.4 Datos sensibles

Algunos datos personales requieren más cuidado por su naturaleza.

Ejemplos:

- salud;
- menores;
- información biométrica;
- datos financieros;
- información íntima;
- credenciales;
- datos legales delicados.

## 6.5 Etiquetar activos

En el inventario, agregar columna:

> Sensibilidad

Valores:

- Pública;
- Interna;
- Confidencial;
- Sensible.

---

# Módulo 7 — Accesos y permisos

## 7.1 Principio de mínimo privilegio

Cada persona debe tener solo el acceso necesario para cumplir su tarea.

Ejemplo:

- lector si solo consulta;
- editor si carga datos;
- propietario solo si administra.

## 7.2 Permisos frecuentes

- ver;
- comentar;
- editar;
- administrar;
- compartir;
- descargar;
- borrar.

No todos deben poder compartir o borrar.

## 7.3 Revisión de accesos

Revisar periódicamente:

- quién tiene acceso;
- qué permisos tiene;
- si sigue necesitando acceso;
- si hay usuarios externos;
- si hay enlaces públicos;
- si hay cuentas antiguas.

## 7.4 Riesgos

- enlaces abiertos;
- carpetas completas compartidas;
- permisos heredados;
- cuentas personales;
- usuarios que ya no participan;
- archivos sensibles en modo público;
- demasiados editores.

## 7.5 Matriz de acceso

Ejemplo:

| Activo | Owner | Lectores | Editores | Admin | Sensibilidad |
|---|---|---|---|---|---|
| Base clientes | Comercial | Marketing | Comercial | Owner | Confidencial |
| Dashboard ventas | Dirección | Equipo | BI | BI | Interno |
| Pagos | Administración | Dirección | Admin | Admin | Sensible |

---

# Módulo 8 — Ciclo de vida de los datos

## 8.1 Qué es ciclo de vida

El ciclo de vida describe las etapas por las que pasa un dato desde que se crea hasta que se archiva o elimina.

Etapas:

1. creación;
2. captura;
3. almacenamiento;
4. uso;
5. intercambio;
6. actualización;
7. archivo;
8. eliminación.

## 8.2 Creación y captura

Preguntas:

- ¿quién crea el dato?
- ¿en qué sistema?
- ¿con qué reglas?
- ¿qué campos son obligatorios?
- ¿hay validación?
- ¿se informa finalidad?

## 8.3 Almacenamiento

Preguntas:

- ¿dónde se guarda?
- ¿quién accede?
- ¿hay respaldo?
- ¿está protegido?
- ¿hay versión oficial?

## 8.4 Uso

Preguntas:

- ¿para qué se usa?
- ¿quién lo analiza?
- ¿qué reportes alimenta?
- ¿hay definiciones?
- ¿qué decisiones dependen de él?

## 8.5 Intercambio

Preguntas:

- ¿se comparte con terceros?
- ¿por qué canal?
- ¿se anonimiza?
- ¿hay permiso?
- ¿se registra?

## 8.6 Archivo y eliminación

Preguntas:

- ¿cuánto tiempo se conserva?
- ¿cuándo se archiva?
- ¿quién puede borrar?
- ¿qué se elimina?
- ¿hay obligación legal de conservar?

---

# Módulo 9 — Definiciones e indicadores oficiales

## 9.1 Problema de definiciones

Muchas discusiones de datos surgen porque cada persona calcula diferente.

Ejemplo:

Ventas del mes puede significar:

- ventas facturadas;
- ventas cobradas;
- ventas entregadas;
- ventas confirmadas;
- ventas netas;
- ventas brutas.

## 9.2 Indicador oficial

Un indicador oficial debe tener:

- nombre;
- definición;
- fórmula;
- fuente;
- período;
- owner;
- frecuencia;
- filtros;
- exclusiones;
- fecha de revisión.

## 9.3 Ejemplo

Indicador:

> Ticket promedio

Definición:

> Monto promedio de pedidos pagados durante un período.

Fórmula:

> ventas pagadas / cantidad de pedidos pagados

Fuente:

> Planilla de ventas limpia.

Owner:

> Área comercial.

## 9.4 Glosario

El glosario evita ambigüedad.

Términos posibles:

- cliente activo;
- venta neta;
- pedido entregado;
- reclamo cerrado;
- stock crítico;
- conversión;
- margen;
- abandono.

## 9.5 Certificación

Un indicador puede marcarse como:

- borrador;
- en revisión;
- aprobado;
- oficial;
- obsoleto.

No todo número en una planilla debe considerarse oficial.

---

# Módulo 10 — Calidad dentro del gobierno

## 10.1 Calidad como responsabilidad

La calidad no debe depender solo del analista que recibe los datos. Debe incluirse en el proceso.

Responsables:

- quien carga;
- quien valida;
- quien analiza;
- quien decide;
- owner;
- steward.

## 10.2 Reglas de calidad

Ejemplos:

- todo pedido debe tener estado;
- el monto debe ser mayor a cero;
- la fecha no puede estar vacía;
- el canal debe salir de una lista;
- el cliente debe tener contacto;
- no puede haber IDs duplicados.

## 10.3 Controles periódicos

Frecuencia:

- diaria para procesos críticos;
- semanal para ventas o atención;
- mensual para reportes;
- antes de presentaciones importantes.

## 10.4 Indicadores de calidad

- porcentaje de campos completos;
- cantidad de duplicados;
- registros inválidos;
- categorías inconsistentes;
- activos sin owner;
- reportes sin definición;
- accesos vencidos.

## 10.5 Corrección de errores

Definir:

- quién reporta;
- quién corrige;
- quién aprueba;
- cómo se documenta;
- cuándo se vuelve a medir.

---

# Módulo 11 — Privacidad y cumplimiento

## 11.1 Datos y responsabilidad

Quien maneja datos también maneja responsabilidad. No todo dato disponible debe usarse libremente.

Preguntas:

- ¿tenemos permiso?
- ¿para qué se recolectó?
- ¿quién puede verlo?
- ¿se puede compartir?
- ¿hay datos personales?
- ¿hay datos sensibles?
- ¿se puede anonimizar?

## 11.2 Minimización

Recolectar solo lo necesario.

Ejemplo:

Si un formulario de inscripción solo requiere contacto, no pedir DNI salvo que sea necesario y justificable.

## 11.3 Finalidad

Usar datos para el propósito informado.

Ejemplo:

Si alguien deja su correo para recibir una constancia, no debería agregarse automáticamente a una lista comercial sin consentimiento adecuado.

## 11.4 Anonimización

Antes de analizar o compartir, puede reemplazarse:

- nombre por Cliente A;
- DNI por identificador;
- teléfono eliminado;
- dirección agrupada por zona.

## 11.5 Cumplimiento

Cada país y sector puede tener normas sobre protección de datos personales, conservación documental, secreto profesional o información sensible.

El gobierno de datos debe adaptarse a esas obligaciones.

---

# Módulo 12 — Documentación mínima

## 12.1 Documentar para reutilizar

Si una persona entiende una planilla pero nadie más puede usarla, el conocimiento está mal documentado.

Documentar evita dependencia.

## 12.2 Documentos mínimos

Un gobierno básico puede incluir:

1. inventario de datos;
2. glosario;
3. diccionario de datos;
4. matriz de accesos;
5. política de calidad;
6. política de uso;
7. registro de cambios;
8. responsables.

## 12.3 Registro de cambios

Cada cambio importante debe registrar:

- fecha;
- activo;
- cambio;
- motivo;
- responsable;
- impacto;
- aprobación.

## 12.4 Versión oficial

Definir dónde está la versión oficial.

Ejemplo:

> La carpeta `Reportes Oficiales` contiene los documentos válidos para dirección. Las copias personales no son fuente oficial.

## 12.5 Obsolescencia

Marcar documentos viejos como:

- obsoleto;
- archivado;
- reemplazado por;
- no usar para decisiones.

---

# Módulo 13 — Comité o rutina de gobierno

## 13.1 Comité de datos

En organizaciones grandes puede existir un comité formal. En equipos pequeños, puede ser una reunión mensual breve.

Objetivo:

- revisar problemas;
- aprobar definiciones;
- priorizar mejoras;
- resolver conflictos;
- revisar accesos;
- validar indicadores.

## 13.2 Participantes

Puede incluir:

- owner de datos;
- steward;
- responsable técnico;
- usuario de negocio;
- administración;
- dirección;
- analista.

## 13.3 Agenda básica

1. Activos críticos.
2. Problemas de calidad.
3. Indicadores nuevos.
4. Accesos.
5. Datos sensibles.
6. Cambios de definiciones.
7. Acciones pendientes.
8. Próxima revisión.

## 13.4 Decisiones

Toda decisión debe quedar registrada:

- qué se decidió;
- quién aprueba;
- desde cuándo aplica;
- qué activos afecta;
- quién ejecuta.

## 13.5 Rutina mínima para equipos pequeños

Una vez por mes:

- revisar activos;
- actualizar glosario;
- revisar permisos;
- revisar calidad;
- archivar obsoletos;
- documentar cambios.

---

# Módulo 14 — Implementación progresiva

## 14.1 No empezar demasiado grande

Un error común es intentar gobernar todo de golpe.

Mejor empezar por:

- 3 activos críticos;
- 5 indicadores;
- 1 glosario inicial;
- 1 matriz de acceso;
- 1 checklist de calidad;
- 1 rutina mensual.

## 14.2 Etapa 1: inventario

Listar activos principales.

## 14.3 Etapa 2: responsables

Asignar owner y steward.

## 14.4 Etapa 3: definiciones

Definir términos e indicadores críticos.

## 14.5 Etapa 4: accesos

Revisar permisos y sensibilidad.

## 14.6 Etapa 5: calidad

Crear controles básicos.

## 14.7 Etapa 6: revisión

Establecer rutina mensual.

## 14.8 Éxito inicial

El éxito no es tener muchos documentos. Es que las personas sepan:

- qué dato usar;
- dónde está;
- qué significa;
- quién responde;
- si pueden acceder;
- cómo corregir errores.

---

# Módulo 15 — Plan básico de gobierno de datos

## 15.1 Componentes

Un plan básico debe incluir:

- objetivo;
- alcance;
- activos críticos;
- roles;
- políticas;
- clasificación;
- accesos;
- glosario;
- calidad;
- documentación;
- rutina de revisión.

## 15.2 Alcance

Definir qué se gobernará primero.

Ejemplo:

> Este plan cubre datos de ventas, clientes, productos y reportes comerciales mensuales.

## 15.3 Reglas iniciales

Ejemplos:

- toda base crítica debe tener owner;
- todo indicador oficial debe tener definición;
- los datos confidenciales no se comparten por enlace público;
- toda modificación relevante se documenta;
- los permisos se revisan mensualmente.

## 15.4 Indicadores de gobierno

Medir:

- activos con owner;
- activos documentados;
- indicadores definidos;
- accesos revisados;
- problemas de calidad abiertos;
- datos sensibles clasificados.

## 15.5 Mejora continua

El gobierno de datos no termina. Evoluciona con:

- nuevos datos;
- nuevos sistemas;
- cambios legales;
- nuevos reportes;
- crecimiento del equipo;
- incidentes;
- auditorías;
- necesidades de negocio.

---

# Caso práctico integrador

## Caso: gobierno de datos para un emprendimiento comercial

Un emprendimiento vende por WhatsApp, Instagram y tienda online. Tiene planillas de clientes, ventas, productos, pagos y stock. Varias personas editan archivos, hay duplicados, enlaces públicos y reportes con números diferentes.

### Paso 1 — Inventario

Activos críticos:

- clientes;
- ventas;
- productos;
- stock;
- pagos;
- dashboard mensual.

### Paso 2 — Roles

- Ventas: owner comercial.
- Pagos: owner administración.
- Stock: owner operaciones.
- Steward: persona responsable de revisar calidad y documentación.

### Paso 3 — Clasificación

- clientes: confidencial;
- pagos: sensible;
- productos: interno;
- dashboard: interno.

### Paso 4 — Accesos

- clientes: lectura para atención, edición para comercial;
- pagos: solo administración y dirección;
- dashboard: lectura para equipo.

### Paso 5 — Definiciones

Se define:

- venta confirmada;
- venta pagada;
- pedido pendiente;
- stock crítico;
- cliente recurrente.

### Paso 6 — Calidad

Reglas:

- venta sin fecha no se acepta;
- pedido sin estado se marca para revisión;
- pagos deben tener comprobante;
- productos deben tener código único.

### Paso 7 — Rutina mensual

Se revisan:

- duplicados;
- permisos;
- indicadores;
- reportes obsoletos;
- problemas pendientes.

### Resultado

El emprendimiento deja de depender de planillas desordenadas y empieza a tomar decisiones con datos más confiables.

---

# Actividades del curso

## Actividad 1 — Inventario inicial

Listar 10 activos de datos de un caso real o ficticio.

Indicar:

- tipo;
- área;
- responsable;
- criticidad;
- sensibilidad.

## Actividad 2 — Asignación de roles

Para cada activo, definir:

- data owner;
- data steward;
- productor;
- consumidor.

## Actividad 3 — Clasificación

Clasificar activos como:

- público;
- interno;
- confidencial;
- sensible.

Justificar.

## Actividad 4 — Matriz de acceso

Crear una matriz con:

- activo;
- lectores;
- editores;
- administradores;
- permisos especiales.

## Actividad 5 — Glosario inicial

Definir 8 términos críticos.

## Actividad 6 — Política simple

Redactar tres políticas:

- acceso;
- calidad;
- documentación.

## Actividad 7 — Rutina de gobierno

Diseñar una reunión mensual de gobierno con agenda y responsables.

## Actividad 8 — Plan básico

Crear un plan de gobierno para un área o emprendimiento.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es gobierno de datos?
2. ¿Por qué gobierno de datos no es solo tecnología?
3. ¿Qué diferencia hay entre gobierno, calidad, seguridad y catálogo?
4. ¿Qué es un activo de datos crítico?
5. ¿Qué hace un data owner?
6. ¿Qué hace un data steward?
7. ¿Qué significa mínimo privilegio?
8. ¿Por qué clasificar datos por sensibilidad?
9. ¿Qué es ciclo de vida de datos?
10. ¿Por qué deben definirse indicadores oficiales?
11. ¿Qué debe documentarse en un registro de cambios?
12. ¿Por qué conviene implementar gobierno progresivamente?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Plan Básico de Gobierno de Datos**.

Debe incluir:

1. alcance;
2. inventario de activos críticos;
3. roles asignados;
4. clasificación de sensibilidad;
5. matriz de accesos;
6. glosario inicial;
7. políticas básicas;
8. reglas de calidad;
9. documentación mínima;
10. rutina de revisión;
11. indicadores de gobierno;
12. próximos pasos.

---

# Glosario básico

Gobierno de datos: conjunto de roles, reglas y procesos para gestionar datos de forma confiable, segura y útil.

Activo de datos: recurso que contiene o representa datos importantes.

Data owner: responsable de negocio de un dato o activo.

Data steward: responsable de documentación, calidad y uso correcto.

Productor de datos: persona o sistema que genera o carga datos.

Consumidor de datos: persona o sistema que usa datos.

Política de datos: regla formal sobre uso, acceso, calidad o conservación.

Clasificación de datos: asignación de nivel de sensibilidad o protección.

Mínimo privilegio: principio de dar solo el acceso necesario.

Ciclo de vida de datos: etapas desde creación hasta archivo o eliminación.

Indicador oficial: métrica aprobada con definición y fuente.

Glosario: conjunto de definiciones de negocio.

Matriz de acceso: tabla que muestra quién puede ver o editar datos.

Registro de cambios: documentación de modificaciones relevantes.

Dato sensible: dato que requiere protección especial.

Comité de datos: grupo o rutina encargada de revisar reglas, problemas y decisiones.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Plan Básico de Gobierno de Datos**.

Ese plan debe permitir:

- identificar activos críticos;
- asignar responsables;
- definir reglas;
- proteger datos sensibles;
- controlar accesos;
- mejorar calidad;
- documentar indicadores;
- reducir confusión;
- aumentar confianza;
- sostener una rutina de revisión.

El curso termina cuando la persona comprende que los datos no se gobiernan solos: necesitan responsables, reglas claras, documentación y revisión continua.

---

# Fuentes recomendadas para profundizar

- DAMA-DMBOK — Data Governance.
- Data Governance Institute — principios de gobierno de datos.
- IBM — Data Governance.
- Microsoft Purview documentation.
- Google Cloud — Data Governance concepts.
- Alation — Data Governance and Data Catalog resources.
- ISO 8000 — calidad de datos.
- Materiales introductorios sobre privacidad, gestión de accesos, metadatos y stewardship.

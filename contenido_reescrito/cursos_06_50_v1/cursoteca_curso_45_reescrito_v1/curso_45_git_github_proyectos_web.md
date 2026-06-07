# Curso 45 — Git y GitHub para Proyectos Web

## Presentación del curso

Git y GitHub son herramientas fundamentales para desarrollar, guardar, versionar, publicar y colaborar en proyectos web. Cuando un proyecto crece, no alcanza con tener carpetas llamadas `version-final`, `version-final-ahora-si`, `copia-nueva` o `backup-ultimo`. Hace falta un sistema ordenado para registrar cambios, volver atrás si algo se rompe, trabajar por etapas, colaborar con otras personas y publicar código de manera profesional.

Git es un sistema de control de versiones. Permite registrar la historia de un proyecto: qué cambió, cuándo cambió, quién lo cambió y por qué. GitHub es una plataforma online que permite alojar repositorios Git, compartirlos, colaborar, revisar cambios y publicar sitios estáticos con GitHub Pages.

Este curso está pensado para principiantes que están construyendo páginas web, cursos digitales, juegos HTML/JS, blogs, portfolios, landing pages o pequeñas aplicaciones. No requiere experiencia previa con terminal, aunque sí conviene tener conocimientos básicos de archivos, carpetas y proyectos web.

La idea central es:

> Git ayuda a controlar la historia del proyecto. GitHub ayuda a guardar, compartir, colaborar y publicar esa historia.

---

## Objetivos de aprendizaje

Al finalizar este curso, el estudiante debería poder:

1. Comprender qué es control de versiones.
2. Diferenciar Git y GitHub.
3. Crear un repositorio local.
4. Usar comandos básicos: init, status, add, commit, log.
5. Conectar un repositorio local con GitHub.
6. Subir cambios con push y traer cambios con pull.
7. Entender ramas y flujo básico de trabajo.
8. Crear un archivo README profesional.
9. Usar .gitignore para excluir archivos innecesarios.
10. Publicar un sitio estático con GitHub Pages.
11. Resolver errores frecuentes de principiantes.
12. Crear un flujo simple para proyectos web personales.

---

# Módulo 1 — Qué es control de versiones

## 1.1 Problema inicial

En proyectos sin control de versiones aparecen carpetas como:

- proyecto_final;
- proyecto_final_2;
- proyecto_final_corregido;
- proyecto_final_no_tocar;
- backup_viejo;
- copia_funciona.

Esto genera confusión y riesgo.

## 1.2 Definición

El control de versiones es un sistema para registrar cambios en archivos a lo largo del tiempo.

Permite:

- saber qué cambió;
- volver a una versión anterior;
- comparar versiones;
- trabajar en paralelo;
- colaborar;
- documentar evolución;
- proteger el proyecto.

## 1.3 Ejemplo

Si modificás `index.html`, `styles.css` y `main.js`, Git puede registrar esos cambios en un commit.

Ese commit funciona como una foto del estado del proyecto.

## 1.4 Por qué importa

En proyectos web, Git ayuda a:

- probar cambios sin miedo;
- guardar versiones;
- publicar avances;
- detectar errores;
- trabajar con Codex u otros asistentes;
- colaborar con otras personas;
- mantener historial profesional.

## 1.5 Mentalidad

Git no es solo una herramienta técnica. Es una forma ordenada de trabajar.

---

# Módulo 2 — Git y GitHub

## 2.1 Qué es Git

Git es un sistema de control de versiones que funciona en tu computadora.

Permite crear repositorios, hacer commits, crear ramas y revisar historial.

## 2.2 Qué es GitHub

GitHub es una plataforma online para alojar repositorios Git.

Permite:

- guardar código en la nube;
- compartir proyectos;
- colaborar;
- revisar cambios;
- usar issues;
- publicar con GitHub Pages;
- documentar proyectos.

## 2.3 Diferencia

Git:

> herramienta de versionado.

GitHub:

> servicio online para alojar y colaborar con repositorios Git.

## 2.4 Repositorio

Un repositorio es una carpeta controlada por Git.

Contiene:

- archivos del proyecto;
- historial;
- ramas;
- configuración;
- commits.

## 2.5 Local y remoto

Repositorio local:

- está en tu computadora.

Repositorio remoto:

- está en GitHub u otro servicio.

---

# Módulo 3 — Instalación y configuración

## 3.1 Instalar Git

Git puede instalarse desde su sitio oficial. En Windows suele incluir Git Bash, una terminal útil para comandos Git.

## 3.2 Verificar instalación

```bash
git --version
```

Si muestra versión, Git está instalado.

## 3.3 Configurar nombre

```bash
git config --global user.name "Tu Nombre"
```

## 3.4 Configurar email

```bash
git config --global user.email "tuemail@example.com"
```

Conviene usar el mismo correo asociado a GitHub o uno configurado para commits.

## 3.5 Ver configuración

```bash
git config --list
```

## 3.6 Editor

Git puede usar un editor para mensajes. Para principiantes, se pueden escribir mensajes directamente con `-m`.

---

# Módulo 4 — Terminal básica

## 4.1 Por qué usar terminal

Git suele usarse desde terminal. Aunque existen interfaces gráficas, aprender comandos básicos da control y comprensión.

## 4.2 Comandos útiles

Ver carpeta actual:

```bash
pwd
```

Listar archivos:

```bash
ls
```

Cambiar carpeta:

```bash
cd nombre-carpeta
```

Subir nivel:

```bash
cd ..
```

Crear carpeta:

```bash
mkdir proyecto
```

## 4.3 Cuidado con ubicación

Antes de ejecutar Git, asegurarse de estar en la carpeta correcta.

## 4.4 Windows

En Windows se puede usar:

- Git Bash;
- PowerShell;
- terminal de VS Code.

## 4.5 VS Code

VS Code integra terminal y control de código fuente, lo que facilita trabajar con Git.

---

# Módulo 5 — Crear un repositorio local

## 5.1 Iniciar repositorio

Entrar a la carpeta del proyecto y ejecutar:

```bash
git init
```

Esto crea una carpeta oculta `.git` con el historial.

## 5.2 Ver estado

```bash
git status
```

Muestra archivos nuevos, modificados o listos para commit.

## 5.3 Agregar archivos

```bash
git add index.html
```

Para agregar todos:

```bash
git add .
```

## 5.4 Crear commit

```bash
git commit -m "Crear estructura inicial del sitio"
```

## 5.5 Primer flujo

```bash
git init
git status
git add .
git commit -m "Primer commit"
```

---

# Módulo 6 — Estados de Git

## 6.1 Untracked

Archivo nuevo que Git todavía no sigue.

## 6.2 Modified

Archivo seguido por Git que fue modificado.

## 6.3 Staged

Archivo agregado al área de preparación con `git add`.

## 6.4 Committed

Cambio guardado en el historial mediante commit.

## 6.5 Flujo mental

Archivo cambiado → `git add` → staged → `git commit` → historial.

## 6.6 Por qué existe staging

Permite elegir qué cambios incluir en cada commit.

---

# Módulo 7 — Commits

## 7.1 Qué es un commit

Un commit es un registro de cambios en el historial del proyecto.

Incluye:

- cambios;
- autor;
- fecha;
- mensaje;
- identificador.

## 7.2 Mensajes claros

Malo:

```bash
git commit -m "cosas"
```

Mejor:

```bash
git commit -m "Agregar sección de cursos destacados"
```

## 7.3 Frecuencia

Hacer commits cuando hay avances coherentes:

- crear estructura inicial;
- agregar estilos;
- corregir navegación;
- mejorar responsive;
- agregar formulario.

## 7.4 No hacer commits gigantes

Un commit enorme con muchas cosas mezcladas es difícil de revisar.

## 7.5 Ver historial

```bash
git log
```

Versión corta:

```bash
git log --oneline
```

---

# Módulo 8 — Revisar cambios

## 8.1 git diff

Muestra diferencias entre archivos modificados y última versión confirmada.

```bash
git diff
```

## 8.2 Diff después de add

```bash
git diff --staged
```

Muestra cambios que están preparados para commit.

## 8.3 Por qué revisar

Antes de confirmar, revisar evita subir errores, claves o archivos innecesarios.

## 8.4 VS Code

VS Code permite ver cambios visualmente en la sección Source Control.

## 8.5 Buen hábito

Antes de cada commit:

```bash
git status
git diff
```

---

# Módulo 9 — .gitignore

## 9.1 Qué es

`.gitignore` indica archivos o carpetas que Git debe ignorar.

## 9.2 Para qué sirve

Evita subir:

- dependencias;
- archivos temporales;
- configuraciones locales;
- claves;
- builds;
- logs;
- archivos pesados innecesarios.

## 9.3 Ejemplo básico

```gitignore
node_modules/
.env
dist/
.DS_Store
*.log
```

## 9.4 Proyectos web simples

Para HTML/CSS/JS puro, puede ignorarse:

```gitignore
.DS_Store
Thumbs.db
*.log
```

## 9.5 Cuidado con .env

Nunca subir claves privadas en `.env`.

---

# Módulo 10 — GitHub: crear repositorio remoto

## 10.1 Crear cuenta

GitHub requiere una cuenta.

## 10.2 Crear repositorio

Desde GitHub:

- New repository;
- nombre;
- público o privado;
- README opcional;
- crear.

## 10.3 Público o privado

Público:

- cualquiera puede verlo.

Privado:

- solo personas autorizadas.

## 10.4 Repositorio vacío

Si ya tenés proyecto local, conviene crear repositorio sin README inicial para evitar conflictos.

## 10.5 URL remota

GitHub ofrece una URL para conectar el repositorio local.

---

# Módulo 11 — Conectar local con remoto

## 11.1 Agregar remote

```bash
git remote add origin https://github.com/usuario/repositorio.git
```

## 11.2 Ver remotos

```bash
git remote -v
```

## 11.3 Cambiar rama principal

Muchas veces se usa `main`.

```bash
git branch -M main
```

## 11.4 Subir primera vez

```bash
git push -u origin main
```

## 11.5 Flujo posterior

Luego de nuevos commits:

```bash
git push
```

---

# Módulo 12 — Clonar repositorios

## 12.1 Qué es clonar

Clonar copia un repositorio remoto a tu computadora.

```bash
git clone https://github.com/usuario/repositorio.git
```

## 12.2 Cuándo se usa

- trabajar en otra computadora;
- descargar proyecto propio;
- colaborar;
- probar repositorio;
- continuar proyecto.

## 12.3 Entrar a carpeta

```bash
cd repositorio
```

## 12.4 Pull

Si el remoto cambió:

```bash
git pull
```

Trae cambios al local.

## 12.5 Cuidado

Antes de hacer pull, revisar si tenés cambios locales sin commit.

---

# Módulo 13 — Ramas

## 13.1 Qué es una rama

Una rama permite trabajar en una línea separada del proyecto.

La rama principal suele ser `main`.

## 13.2 Crear rama

```bash
git branch nueva-seccion
```

## 13.3 Cambiar de rama

```bash
git checkout nueva-seccion
```

O:

```bash
git switch nueva-seccion
```

## 13.4 Crear y cambiar

```bash
git switch -c nueva-seccion
```

## 13.5 Para qué sirven

- probar cambios;
- desarrollar una función;
- corregir errores;
- no romper la rama principal.

---

# Módulo 14 — Merge

## 14.1 Qué es merge

Merge une los cambios de una rama con otra.

## 14.2 Ejemplo

Estás en `main` y querés traer cambios de `nueva-seccion`.

```bash
git switch main
git merge nueva-seccion
```

## 14.3 Conflictos

Un conflicto ocurre cuando Git no puede decidir qué cambio conservar.

## 14.4 Resolver conflictos

Abrir archivo, elegir contenido correcto, guardar, agregar y confirmar.

```bash
git add .
git commit -m "Resolver conflicto"
```

## 14.5 Principio

Mientras más pequeños y frecuentes sean los commits, más fácil resolver problemas.

---

# Módulo 15 — Pull requests

## 15.1 Qué es un pull request

Un pull request es una propuesta para incorporar cambios de una rama a otra en GitHub.

## 15.2 Para qué sirve

Permite:

- revisar cambios;
- comentar;
- aprobar;
- detectar errores;
- colaborar;
- documentar decisiones.

## 15.3 En proyectos personales

Aunque trabajes solo, un pull request puede ayudar a revisar antes de fusionar.

## 15.4 Flujo básico

1. crear rama;
2. hacer cambios;
3. commit;
4. push;
5. abrir pull request;
6. revisar;
7. merge.

## 15.5 Buen título

Ejemplo:

> Agregar sección de preguntas frecuentes

---

# Módulo 16 — README profesional

## 16.1 Qué es README

Es el archivo principal de presentación del repositorio.

Nombre:

```text
README.md
```

## 16.2 Qué debe incluir

- nombre del proyecto;
- descripción;
- captura o demo;
- tecnologías;
- estructura;
- instalación;
- uso;
- estado;
- próximos pasos;
- autor;
- licencia, si corresponde.

## 16.3 Ejemplo

```md
# Cursoteca Abierta

Plataforma educativa web con cursos digitales organizados por rutas.

## Tecnologías

- HTML
- CSS
- JavaScript

## Uso

Abrir index.html en el navegador.
```

## 16.4 Importancia

Un buen README comunica profesionalismo y ayuda a otros a entender el proyecto.

## 16.5 Actualización

Debe actualizarse cuando el proyecto cambia.

---

# Módulo 17 — GitHub Pages

## 17.1 Qué es

GitHub Pages permite publicar sitios estáticos desde un repositorio.

Sirve para:

- landing pages;
- portfolios;
- documentación;
- cursos estáticos;
- demos;
- juegos HTML.

## 17.2 Requisitos

Funciona bien con HTML, CSS y JavaScript estático.

No ejecuta backend tradicional.

## 17.3 Publicar

En GitHub:

- Settings;
- Pages;
- elegir rama;
- elegir carpeta;
- guardar.

## 17.4 Ruta

La web suele quedar en una URL como:

```text
https://usuario.github.io/repositorio/
```

## 17.5 Errores frecuentes

- archivo principal no se llama `index.html`;
- rutas relativas mal escritas;
- mayúsculas diferentes;
- assets no subidos;
- configuración de rama incorrecta.

---

# Módulo 18 — Flujo de trabajo para proyectos web

## 18.1 Flujo simple

1. Crear proyecto.
2. `git init`.
3. Primer commit.
4. Crear repositorio en GitHub.
5. Conectar remoto.
6. Push.
7. Trabajar por cambios pequeños.
8. Commit.
9. Push.
10. Publicar con Pages si corresponde.

## 18.2 Antes de cada sesión

```bash
git status
git pull
```

## 18.3 Después de cambios

```bash
git status
git add .
git commit -m "Describir cambio"
git push
```

## 18.4 Versiones

Se pueden crear tags para marcar versiones importantes.

```bash
git tag v1.0.0
git push origin v1.0.0
```

## 18.5 Documentar cambios

Crear `CHANGELOG.md` para registrar versiones.

---

# Módulo 19 — Errores comunes

## 19.1 No estar en la carpeta correcta

Antes de comandos, verificar ubicación.

## 19.2 Olvidar git add

Si no se agregan cambios, no entran al commit.

## 19.3 Hacer commit vacío de sentido

Mensajes como “update” no ayudan.

## 19.4 Subir node_modules

Usar `.gitignore`.

## 19.5 Exponer claves

Nunca subir `.env` con claves privadas.

## 19.6 Conflictos por editar en GitHub y local

Si editás online y local, hacer pull antes de seguir.

## 19.7 Rutas rotas en GitHub Pages

Cuidar mayúsculas, carpetas y rutas relativas.

---

# Módulo 20 — Proyecto final

## 20.1 Objetivo

Crear, versionar y publicar un proyecto web simple usando Git y GitHub.

## 20.2 Proyecto sugerido

Una landing page con:

- HTML;
- CSS;
- JavaScript opcional;
- README;
- .gitignore;
- historial de commits;
- publicación en GitHub Pages.

## 20.3 Requisitos

- repositorio local;
- al menos 5 commits claros;
- repositorio remoto en GitHub;
- README completo;
- .gitignore;
- rama principal `main`;
- URL publicada;
- breve changelog.

## 20.4 Evaluación

Se evaluará:

- orden;
- commits;
- estructura;
- documentación;
- publicación;
- funcionamiento;
- claridad del README.

## 20.5 Resultado

El estudiante termina con un proyecto web versionado, documentado y publicado.

---

# Caso práctico integrador

## Caso: publicar una landing de Cursoteca

Una persona crea una landing para presentar un curso.

### Paso 1 — Proyecto local

Archivos:

- index.html;
- styles.css;
- script.js;
- README.md.

### Paso 2 — Git

```bash
git init
git add .
git commit -m "Crear estructura inicial de landing"
```

### Paso 3 — GitHub

Crea repositorio remoto y conecta:

```bash
git remote add origin https://github.com/usuario/landing-cursoteca.git
git branch -M main
git push -u origin main
```

### Paso 4 — Mejoras

Agrega secciones con commits separados:

- hero;
- tarjetas;
- responsive;
- formulario;
- accesibilidad.

### Paso 5 — GitHub Pages

Activa Pages y obtiene URL pública.

### Resultado

El proyecto queda publicado y con historial profesional.

---

# Actividades del curso

1. Instalar Git y verificar versión.
2. Configurar usuario y email.
3. Crear repositorio local.
4. Hacer primer commit.
5. Revisar cambios con status y diff.
6. Crear .gitignore.
7. Crear repositorio en GitHub.
8. Conectar remoto y hacer push.
9. Crear rama y fusionarla.
10. Publicar sitio con GitHub Pages.
11. Crear README profesional.
12. Crear CHANGELOG básico.

---

# Evaluación final

## Parte 1 — Preguntas conceptuales

1. ¿Qué es control de versiones?
2. ¿Qué diferencia hay entre Git y GitHub?
3. ¿Qué es un repositorio?
4. ¿Qué hace `git status`?
5. ¿Qué hace `git add`?
6. ¿Qué es un commit?
7. ¿Para qué sirve `.gitignore`?
8. ¿Qué es un repositorio remoto?
9. ¿Qué hace `git push`?
10. ¿Qué hace `git pull`?
11. ¿Qué es una rama?
12. ¿Para qué sirve GitHub Pages?

## Parte 2 — Producción práctica

El estudiante debe entregar un **Proyecto Web Versionado y Publicado**.

Debe incluir:

1. carpeta de proyecto;
2. repositorio Git local;
3. mínimo 5 commits;
4. repositorio en GitHub;
5. README;
6. .gitignore;
7. rama main;
8. URL de GitHub Pages;
9. changelog simple;
10. captura o descripción;
11. estructura clara;
12. reflexión sobre flujo usado.

---

# Glosario básico

Git: sistema de control de versiones.

GitHub: plataforma online para alojar repositorios Git.

Repositorio: carpeta versionada por Git.

Commit: registro de cambios en el historial.

Staging area: zona donde se preparan cambios antes del commit.

Branch: rama de desarrollo.

Merge: unión de cambios de una rama a otra.

Remote: repositorio remoto.

Origin: nombre habitual del remoto principal.

Push: subir commits al remoto.

Pull: traer cambios del remoto.

Clone: copiar un repositorio remoto.

README: archivo de presentación del proyecto.

.gitignore: archivo que indica qué debe ignorar Git.

GitHub Pages: servicio para publicar sitios estáticos.

Pull request: propuesta de cambio para revisar y fusionar.

Conflict: choque entre cambios incompatibles.

Tag: marca de versión.

---

# Producto final del curso

Al finalizar, el estudiante debe crear un **Proyecto Web Versionado y Publicado**.

Ese producto debe permitir:

- trabajar con historial;
- evitar caos de copias;
- guardar código en GitHub;
- documentar el proyecto;
- publicar una demo;
- corregir errores con más seguridad;
- colaborar en el futuro;
- mostrar trabajo de forma profesional.

El curso termina cuando la persona deja de guardar proyectos como carpetas sueltas y empieza a trabajar con versiones, repositorios, commits y publicación real.

---

# Fuentes recomendadas para profundizar

- Git documentation.
- GitHub Docs.
- GitHub Skills.
- Atlassian Git Tutorials.
- Pro Git Book.
- MDN — publicación web básica.
- GitHub Pages documentation.
- Materiales introductorios sobre control de versiones, colaboración y documentación de proyectos.

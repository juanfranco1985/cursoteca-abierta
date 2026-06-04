import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesDir = path.join(root, "cursos");
const portalHref = "../../portal/portal_publico_profesional_v0_6/index.html";

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function json(file, value) {
  write(file, `${JSON.stringify(value, null, 2)}\n`);
}

function addCourseNavigation() {
  const cssBlock = `

/* Navegacion transversal hacia el portal publico. */
.portal-return {
  color: var(--ink) !important;
  border-color: transparent !important;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, .32), transparent 32%),
    linear-gradient(135deg, var(--paper), var(--gold)) !important;
  box-shadow: 0 0 24px rgba(214, 168, 92, .26), inset 0 1px 0 rgba(255, 244, 220, .38) !important;
}

.portal-footer-link {
  color: var(--paper);
  font-weight: 900;
}

.portal-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  justify-content: flex-end;
  padding: .7rem 1rem;
  border-bottom: 1px solid var(--line);
  background: rgba(33, 19, 11, .9);
  backdrop-filter: blur(14px);
}
`;

  for (const entry of fs.readdirSync(coursesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const coursePath = path.join(coursesDir, entry.name);
    const indexPath = path.join(coursePath, "index.html");
    const stylesPath = path.join(coursePath, "styles.css");
    const swPath = path.join(coursePath, "service-worker.js");
    if (!fs.existsSync(indexPath)) continue;

    let html = read(indexPath);
    if (!html.includes("data-portal-return")) {
      if (/<nav class="topnav"[^>]*>/.test(html)) {
        html = html.replace(
          /(<nav class="topnav"[^>]*>)/,
          `$1\n        <a class="portal-return" data-portal-return href="${portalHref}">Menu principal</a>`
        );
      } else if (/<nav id="nav"><\/nav>/.test(html)) {
        html = html.replace(
          /<nav id="nav"><\/nav>/,
          `<nav id="nav"><a class="portal-return" data-portal-return href="${portalHref}">Menu principal</a></nav>`
        );
      } else if (/<body>/.test(html)) {
        html = html.replace(
          /<body>/,
          `<body>\n  <nav class="portal-topbar" aria-label="Navegacion principal"><a class="portal-return" data-portal-return href="${portalHref}">Menu principal</a></nav>`
        );
      }
    }
    if (!html.includes("data-portal-footer")) {
      if (/<footer class="footer">/.test(html)) {
        html = html.replace(
          /(<footer class="footer">)/,
          `$1\n      <a class="portal-footer-link" data-portal-footer href="${portalHref}">Volver al portal</a>`
        );
      } else if (/<footer>/.test(html)) {
        html = html.replace(
          /<footer>/,
          `<footer><a class="portal-footer-link" data-portal-footer href="${portalHref}">Volver al portal</a> `
        );
      } else {
        html = html.replace(
          /(<script src="src\/app\.js"><\/script>)/,
          `<footer class="footer"><a class="portal-footer-link" data-portal-footer href="${portalHref}">Volver al portal</a></footer>$1`
        );
      }
    }
    write(indexPath, html);

    if (fs.existsSync(stylesPath)) {
      let css = read(stylesPath);
      if (!css.includes(".portal-return")) {
        css += cssBlock;
        write(stylesPath, css);
      } else if (!css.includes(".portal-topbar")) {
        css += cssBlock.replace(/[\s\S]*?\.portal-topbar/, ".portal-topbar");
        write(stylesPath, css);
      }
    }

    if (fs.existsSync(swPath)) {
      let sw = read(swPath);
      if (!sw.includes("nav-v1")) {
        sw = sw.replace(/-cache-v0-6-publica-profesional/g, "-cache-v0-6-publica-profesional-nav-v1");
        write(swPath, sw);
      }
    }
  }
}

function lesson(id, title, focus, artifact) {
  return {
    id,
    title,
    keyIdea: `${title}: una buena decision de UX/UI se comprueba con una tarea, una evidencia y una mejora visible.`,
    shortTheory: `${focus} En UX/UI no alcanza con que una pantalla se vea prolija: tiene que orientar a una persona real, reducir dudas y dejar claro que hacer despues. Revisar ${title.toLowerCase()} ayuda a separar gusto personal de criterio usable.`,
    practicalExample: `Caso: una pagina de inscripcion tiene demasiado texto, botones parecidos y personas que no saben como avanzar. Aplicacion: revisa ${title.toLowerCase()}, define la accion principal, elimina ruido y marca el siguiente paso con una prueba simple.`,
    commonMistake: `Confundir ${title.toLowerCase()} con decoracion o preferencia visual. La correccion es escribir el problema observado, explicar su impacto y proponer un cambio que otra persona pueda probar.`,
    whatToDoNow: `Ejercicio de 25 minutos: toma una pantalla real o simulada, detecta un problema relacionado con ${title.toLowerCase()}, propone una version mejorada y guarda ${artifact}.`,
    alert: "No sacrificar legibilidad, contraste, accesibilidad ni claridad por una solucion visual llamativa.",
    keyPoints: [
      "Definir la tarea principal antes de redisenar.",
      "Separar problema, evidencia, propuesta y criterio de exito.",
      "Probar el cambio con una persona o con una tarea concreta.",
      "Priorizar claridad y accesibilidad antes que ornamentacion."
    ],
    responsibleNote: "Contenido educativo introductorio. No reemplaza revision profesional, investigacion formal con usuarios ni normativa de accesibilidad aplicable."
  };
}

function quiz(id, question, options, correctAnswerIndex, feedback) {
  return { id, question, options, correctAnswerIndex, feedback };
}

function buildUxCourse() {
  const modules = [
    {
      id: "m1",
      title: "Fundamentos UX/UI",
      description: "Aprende a mirar una interfaz desde la tarea de la persona usuaria: objetivo, contexto, problema, criterio de exito y evidencia.",
      learningRisk: "Disenar sin objetivo verificable",
      commercialRisk: "Pantallas lindas que no ayudan a completar una tarea",
      lessons: [
        lesson("m1-l1", "Usuario y tarea", "Una interfaz empieza por una persona intentando lograr algo en un contexto concreto.", "una ficha con usuario, tarea, contexto y obstaculo principal"),
        lesson("m1-l2", "Objetivo de la pantalla", "Cada pantalla debe tener una razon clara: informar, guiar, pedir datos, confirmar o permitir una accion.", "un objetivo escrito en una sola frase y una accion principal"),
        lesson("m1-l3", "Contexto de uso", "La misma pantalla se usa distinto en celular, con prisa, con mala conexion o con poca experiencia digital.", "tres restricciones de contexto que afectan el diseno"),
        lesson("m1-l4", "Problema observable", "Un problema UX no es 'se ve feo': es una friccion que impide entender, decidir o avanzar.", "una lista de tres problemas observables con evidencia"),
        lesson("m1-l5", "Criterio de exito", "El exito se define antes de redisenar: menos dudas, menos pasos, mejor comprension o tarea completada.", "un criterio medible de exito para la mejora"),
        lesson("m1-l6", "Evidencia antes y despues", "Guardar evidencia permite explicar por que un cambio mejora la experiencia.", "captura o descripcion antes/despues con motivo del cambio")
      ],
      quiz: [
        quiz("m1-q1", "Que convierte una opinion visual en un hallazgo UX?", ["Una evidencia sobre una tarea concreta", "Un color que parece moderno", "Una preferencia del disenador", "Una animacion llamativa"], 0, "Un hallazgo UX necesita tarea, problema observado e impacto."),
        quiz("m1-q2", "Cual es un objetivo de pantalla bien definido?", ["Que la persona encuentre y complete la inscripcion", "Que la pantalla tenga muchos efectos", "Que use todos los colores de marca", "Que el texto ocupe poco espacio"], 0, "El objetivo debe describir la accion que la persona necesita completar."),
        quiz("m1-q3", "Que dato conviene mirar antes de redisenar?", ["Quien usa la pantalla y en que contexto", "La tendencia visual de moda", "La cantidad de iconos disponibles", "El nombre interno del proyecto"], 0, "Usuario y contexto condicionan jerarquia, lenguaje y pasos."),
        quiz("m1-q4", "Que es un criterio de exito util?", ["La tarea se completa sin dudas en menos pasos", "La pantalla parece mas sofisticada", "El equipo dice que quedo linda", "Hay mas texto explicativo"], 0, "El criterio debe poder probarse con una tarea o evidencia."),
        quiz("m1-q5", "Por que guardar antes/despues?", ["Para justificar el cambio con evidencia", "Para hacer mas pesada la carpeta", "Para reemplazar pruebas con usuarios", "Para evitar revisar el problema"], 0, "La comparacion ayuda a explicar impacto y aprendizaje.")
      ],
      professionalOutcome: "Ficha de diagnostico UX con usuario, tarea, problema, evidencia y criterio de exito."
    },
    {
      id: "m2",
      title: "Estructura y navegacion",
      description: "Ordena informacion, menu, rutas, estados vacios y regreso al inicio para que nadie dependa del boton atras.",
      learningRisk: "Personas perdidas dentro del sitio",
      commercialRisk: "Abandono por no encontrar el camino",
      lessons: [
        lesson("m2-l1", "Inventario de contenido", "Antes de disenar menus conviene listar que existe, que sobra y que falta.", "un inventario con secciones principales, secundarias y duplicadas"),
        lesson("m2-l2", "Menu principal", "El menu principal debe responder a las rutas reales de uso y mantenerse disponible en momentos clave.", "un menu propuesto con 4 a 7 opciones claras"),
        lesson("m2-l3", "Rutas de navegacion", "Una ruta muestra como una persona entra, avanza, se equivoca y vuelve a orientarse.", "un flujo de navegacion con entrada, avance, salida y vuelta"),
        lesson("m2-l4", "Estados vacios", "Cuando no hay resultados o falta informacion, la interfaz debe explicar que paso y que hacer.", "un estado vacio con mensaje y accion siguiente"),
        lesson("m2-l5", "Volver al inicio", "Toda experiencia larga necesita una salida visible al menu o portal principal.", "un boton o enlace persistente de regreso al menu principal"),
        lesson("m2-l6", "Prueba de encontrar", "La navegacion se valida pidiendo a alguien que encuentre una seccion sin explicaciones extra.", "una prueba con tarea, tiempo, duda observada y mejora")
      ],
      quiz: [
        quiz("m2-q1", "Cual es la falla de navegacion mas critica en un curso largo?", ["No tener regreso visible al menu principal", "Tener un color de fondo sobrio", "Usar titulos breves", "Mostrar el progreso"], 0, "Sin una salida clara, la persona depende del boton atras y pierde orientacion."),
        quiz("m2-q2", "Que debe incluir un buen menu?", ["Opciones comprensibles y rutas esperadas", "Todos los enlaces posibles", "Nombres internos del equipo", "Solo iconos sin texto"], 0, "El menu debe servir a la persona, no a la estructura interna."),
        quiz("m2-q3", "Para que sirve un estado vacio?", ["Explicar el problema y ofrecer proximo paso", "Rellenar espacio", "Ocultar errores", "Decorar la pantalla"], 0, "Un estado vacio tambien guia."),
        quiz("m2-q4", "Como validar navegacion basica?", ["Pedir que alguien encuentre una seccion sin ayuda", "Mirar solo el codigo", "Elegir un color mas fuerte", "Agregar mas banners"], 0, "La prueba de encontrar revela dudas reales."),
        quiz("m2-q5", "Que mejora evita perderse dentro de una SPA?", ["Un enlace persistente al portal o menu principal", "Mas animaciones", "Menos contraste", "Un texto legal mas largo"], 0, "La salida persistente corrige el problema de volver muchas veces.")
      ],
      professionalOutcome: "Mapa de navegacion con rutas principales, salida al inicio y prueba de encontrar."
    },
    {
      id: "m3",
      title: "Jerarquia visual y componentes",
      description: "Mejora lectura, prioridad, contraste, botones, tarjetas y estados visuales sin depender de decoracion excesiva.",
      learningRisk: "Todo parece tener la misma importancia",
      commercialRisk: "La accion principal pasa desapercibida",
      lessons: [
        lesson("m3-l1", "Titulos y niveles", "Los titulos ordenan la lectura y ayudan a escanear antes de leer en detalle.", "una jerarquia H1/H2/H3 revisada"),
        lesson("m3-l2", "Espaciado y agrupacion", "El espacio comunica relacion: lo cercano se entiende como parte del mismo bloque.", "una captura marcada con grupos y separaciones"),
        lesson("m3-l3", "Contraste y legibilidad", "Texto, fondo y tamano deben permitir lectura comoda en celular y escritorio.", "una revision de contraste y tamano de texto"),
        lesson("m3-l4", "Botones y acciones", "La accion principal debe verse distinta de acciones secundarias y destructivas.", "un set de botones principal/secundario/alerta"),
        lesson("m3-l5", "Tarjetas utiles", "Una tarjeta debe contener informacion suficiente para decidir sin obligar a abrir todo.", "una tarjeta con titulo, descripcion, estado y accion"),
        lesson("m3-l6", "Estados visuales", "Hover, foco, seleccionado, completado y error deben ser visibles y coherentes.", "una lista de estados visuales para un componente")
      ],
      quiz: [
        quiz("m3-q1", "Que indica una buena jerarquia visual?", ["Que se entiende que mirar primero y que hacer despues", "Que todos los bloques tienen el mismo peso", "Que hay muchos colores", "Que el texto es pequeno"], 0, "La jerarquia reduce esfuerzo de lectura."),
        quiz("m3-q2", "Que problema causa poco contraste?", ["Lectura dificil y menor accesibilidad", "Carga mas rapida", "Mas confianza", "Menos necesidad de revision"], 0, "Contraste bajo afecta comprension y accesibilidad."),
        quiz("m3-q3", "Como debe verse la accion principal?", ["Diferente y prioritaria frente a acciones secundarias", "Igual que todos los enlaces", "Oculta hasta el final", "Solo con un icono ambiguo"], 0, "La accion principal necesita prioridad visual."),
        quiz("m3-q4", "Que hace una tarjeta util?", ["Ayuda a decidir con informacion minima suficiente", "Repite todo el contenido completo", "Oculta el estado", "No tiene accion"], 0, "Una tarjeta debe orientar la decision."),
        quiz("m3-q5", "Por que importa el foco visible?", ["Permite navegar con teclado y entender ubicacion", "Es solo decorativo", "Reduce contenido", "Evita usar etiquetas"], 0, "El foco visible es parte de accesibilidad basica.")
      ],
      professionalOutcome: "Guia visual corta con jerarquia, componentes y estados."
    },
    {
      id: "m4",
      title: "Formularios y microcopy",
      description: "Disena campos, etiquetas, ayudas, errores y confirmaciones para reducir dudas y abandonos.",
      learningRisk: "Formularios confusos o intimidantes",
      commercialRisk: "Perdida de consultas, inscripciones o ventas",
      lessons: [
        lesson("m4-l1", "Campos necesarios", "Cada campo agrega esfuerzo; conviene pedir solo lo necesario para la tarea.", "una lista de campos obligatorios, opcionales y eliminables"),
        lesson("m4-l2", "Etiquetas claras", "La etiqueta debe decir que dato va, no depender solo del placeholder.", "tres campos con etiqueta clara y ejemplo"),
        lesson("m4-l3", "Ayudas breves", "La ayuda aparece donde evita errores, no como parrafo largo antes del formulario.", "microayudas para campos dificiles"),
        lesson("m4-l4", "Mensajes de error", "Un error util explica que paso y como corregirlo sin culpar a la persona.", "tres mensajes de error reescritos"),
        lesson("m4-l5", "Confirmaciones", "Despues de enviar, la interfaz debe confirmar resultado y proximo paso.", "una pantalla de confirmacion con siguiente accion"),
        lesson("m4-l6", "Accesibilidad del formulario", "Labels, foco, contraste y mensajes asociados permiten completar con distintas capacidades.", "checklist de accesibilidad de formulario")
      ],
      quiz: [
        quiz("m4-q1", "Que campo conviene eliminar?", ["El que no es necesario para completar la tarea", "El que ocupa poco lugar", "El que tiene etiqueta", "El que se entiende bien"], 0, "Cada campo debe justificar su existencia."),
        quiz("m4-q2", "Por que no alcanza el placeholder?", ["Puede desaparecer y no siempre es accesible", "Ocupa demasiado espacio", "Nunca se lee", "Impide enviar"], 0, "La etiqueta persistente es mas clara."),
        quiz("m4-q3", "Que mensaje de error ayuda mas?", ["Indica que corregir y como hacerlo", "Dice 'error' sin detalle", "Culpa a la persona", "Oculta el campo"], 0, "El error debe orientar la correccion."),
        quiz("m4-q4", "Que debe pasar tras enviar un formulario?", ["Confirmar resultado y siguiente paso", "Volver arriba sin mensaje", "Borrar todo sin aviso", "Mostrar solo una animacion"], 0, "La confirmacion reduce incertidumbre."),
        quiz("m4-q5", "Que mejora la accesibilidad del formulario?", ["Label, foco visible, contraste y mensajes asociados", "Solo color rojo", "Campos mas chicos", "Iconos sin texto"], 0, "La accesibilidad necesita senales claras y estructurales.")
      ],
      professionalOutcome: "Formulario revisado con etiquetas, ayudas, errores y confirmacion."
    },
    {
      id: "m5",
      title: "Prototipo y mejora",
      description: "Convierte hallazgos en wireframes simples, versiones antes/despues y entregables comprensibles para desarrollo o decision.",
      learningRisk: "Proponer cambios sin aterrizarlos",
      commercialRisk: "Mejoras que no se pueden implementar ni evaluar",
      lessons: [
        lesson("m5-l1", "Wireframe rapido", "Un wireframe permite discutir estructura sin distraerse con detalles visuales finales.", "un boceto de pantalla con zonas principales"),
        lesson("m5-l2", "Flujo principal", "El flujo muestra el camino completo de la tarea, no solo una pantalla aislada.", "un flujo de 3 a 5 pasos"),
        lesson("m5-l3", "Antes y despues", "La comparacion hace visible que problema se corrigio y que se mantiene.", "una tabla antes/despues con motivo"),
        lesson("m5-l4", "Priorizacion", "No todo se corrige a la vez: impacto y esfuerzo ayudan a elegir.", "una matriz impacto/esfuerzo con tres mejoras"),
        lesson("m5-l5", "Entrega para desarrollo", "Una propuesta util dice comportamiento, estados, textos y restricciones.", "una mini especificacion para implementar"),
        lesson("m5-l6", "Revision con otra persona", "Una mirada externa detecta dudas que el disenador ya no ve.", "notas de revision con hallazgos y ajustes")
      ],
      quiz: [
        quiz("m5-q1", "Para que sirve un wireframe?", ["Discutir estructura y flujo sin distraerse con estilos finales", "Reemplazar pruebas", "Decidir colores definitivos", "Ocultar problemas"], 0, "El wireframe baja la idea a estructura."),
        quiz("m5-q2", "Que muestra un flujo principal?", ["Pasos necesarios para completar una tarea", "Solo una pantalla linda", "La paleta de colores", "El nombre de archivos"], 0, "UX se entiende en secuencia."),
        quiz("m5-q3", "Como priorizar mejoras?", ["Comparando impacto para usuarios y esfuerzo de implementacion", "Por gusto personal", "Por orden alfabetico", "Por la animacion mas atractiva"], 0, "Impacto y esfuerzo ayudan a decidir."),
        quiz("m5-q4", "Que debe incluir una entrega para desarrollo?", ["Comportamiento, estados, textos y restricciones", "Solo una captura", "Una opinion general", "Un enlace sin contexto"], 0, "Desarrollo necesita detalles accionables."),
        quiz("m5-q5", "Por que revisar con otra persona?", ["Detecta dudas que el autor ya no percibe", "Evita documentar", "Hace innecesaria la accesibilidad", "Garantiza conversion"], 0, "La revision externa mejora claridad.")
      ],
      professionalOutcome: "Prototipo simple con flujo, prioridad y especificacion minima."
    },
    {
      id: "m6",
      title: "Pruebas simples y cierre",
      description: "Ejecuta pruebas livianas, registra hallazgos, prioriza mejoras y cierra una auditoria UX/UI basica.",
      learningRisk: "No comprobar si la mejora funciona",
      commercialRisk: "Publicar cambios que no resuelven el problema",
      lessons: [
        lesson("m6-l1", "Tareas de prueba", "La prueba empieza con una consigna simple que la persona pueda intentar sin ayuda.", "tres tareas de prueba escritas"),
        lesson("m6-l2", "Observacion", "Observar no es explicar: se registra donde duda, se detiene o se equivoca.", "notas de observacion sin interpretar de mas"),
        lesson("m6-l3", "Preguntas utiles", "Las preguntas abiertas revelan que entendio la persona y que esperaba encontrar.", "cinco preguntas de cierre"),
        lesson("m6-l4", "Medicion basica", "Tiempo, errores, dudas y tarea completada alcanzan para una prueba inicial.", "una tabla con metricas simples"),
        lesson("m6-l5", "Priorizar hallazgos", "Un hallazgo critico bloquea la tarea; uno menor solo molesta o ralentiza.", "hallazgos clasificados por severidad"),
        lesson("m6-l6", "Informe final", "El cierre debe permitir tomar decisiones: problema, evidencia, impacto, propuesta y proximo paso.", "un informe UX/UI de una pagina")
      ],
      quiz: [
        quiz("m6-q1", "Que tarea de prueba esta mejor escrita?", ["Encuentra un curso y abre la primera leccion", "Mira si te gusta la pagina", "Explora un rato", "Decime algo"], 0, "Una tarea clara permite observar comportamiento."),
        quiz("m6-q2", "Que conviene observar?", ["Dudas, errores, bloqueos y comentarios espontaneos", "Solo si sonrie", "Solo el tiempo total", "Nada, alcanza con opinar"], 0, "La observacion registra friccion real."),
        quiz("m6-q3", "Que pregunta de cierre aporta mas?", ["Que esperabas encontrar en este paso?", "Te gusta el color?", "Queres terminar?", "Esta perfecto, no?"], 0, "Las preguntas abiertas evitan inducir respuesta."),
        quiz("m6-q4", "Que hallazgo es critico?", ["El que impide completar la tarea principal", "El que cambia un detalle estetico", "El que solo afecta un icono decorativo", "El que tarda un segundo"], 0, "La severidad depende del impacto en la tarea."),
        quiz("m6-q5", "Que debe incluir el informe final?", ["Problema, evidencia, impacto, propuesta y proximo paso", "Solo capturas lindas", "Solo una lista de colores", "Solo opiniones"], 0, "El informe debe permitir decidir.")
      ],
      professionalOutcome: "Informe UX/UI basico con hallazgos priorizados y mejoras verificables."
    }
  ];

  return {
    courseId: "ux-ui-basico-sitios-apps",
    title: "UX/UI Basico para Sitios y Apps",
    version: "0.6-publica-profesional-nav-v1",
    publicationStatus: "publica-profesional-v0.6-reforzada",
    modules,
    appName: "UX/UI Basico para Sitios y Apps",
    professionalization: {
      tier: "curso-reforzado-v1.0-beta",
      updatedAt: "2026-06-04",
      focus: "Contenido especifico de UX/UI, navegacion, formularios, prototipos y pruebas simples."
    },
    editorialPolish: {
      usabilityPass: "2026-06-04",
      status: "content-specific-copy-reinforced"
    }
  };
}

function buildUxChecklists() {
  const specs = [
    ["checklist-1", "Diagnostico inicial de pantalla", ["Usuario y tarea definidos", "Objetivo de pantalla escrito", "Problema observable anotado", "Evidencia antes/despues guardada", "Criterio de exito definido", "Riesgo principal priorizado"]],
    ["checklist-2", "Navegacion y salida", ["Menu principal visible", "Ruta de regreso al portal", "Estados vacios explicados", "Busqueda o filtro comprensible", "Acciones primarias diferenciadas", "Prueba de encontrar realizada"]],
    ["checklist-3", "Jerarquia visual", ["Titulo principal claro", "Accion principal destacada", "Contraste revisado", "Espaciado consistente", "Tarjetas con informacion suficiente", "Foco visible probado"]],
    ["checklist-4", "Formulario y microcopy", ["Campos innecesarios eliminados", "Labels persistentes", "Ayudas breves donde hacen falta", "Errores accionables", "Confirmacion posterior al envio", "Accesibilidad del formulario revisada"]],
    ["checklist-5", "Prototipo y entrega", ["Wireframe de baja fidelidad", "Flujo principal documentado", "Antes/despues comparado", "Prioridad impacto/esfuerzo", "Estados del componente definidos", "Mini especificacion lista"]],
    ["checklist-6", "Prueba y cierre", ["Tareas de prueba escritas", "Observaciones registradas", "Preguntas de cierre realizadas", "Metricas simples anotadas", "Hallazgos priorizados", "Informe final de una pagina"]]
  ];
  return {
    checklists: specs.map(([id, title, items], checklistIndex) => ({
      id,
      title,
      description: "Checklist practico para revisar una interfaz simple con evidencia, criterio de exito y proximo paso.",
      commercialArea: "UX/UI para sitios, apps y cursos web",
      items: items.map((item, itemIndex) => ({
        id: `cl${checklistIndex + 1}-i${itemIndex + 1}`,
        title: item,
        explanation: `Este punto ayuda a convertir la revision en una decision verificable, no solo en una opinion visual.`,
        recommendedAction: "Aplicalo sobre una pantalla real o simulada y guarda problema, evidencia, cambio propuesto y criterio de mejora."
      }))
    }))
  };
}

function buildUxIncidents() {
  const cases = [
    ["case-1", "El usuario no encuentra como volver al inicio", "La persona avanza en un curso o flujo y depende del boton atras del navegador para regresar."],
    ["case-2", "Formulario de inscripcion confuso", "La persona no sabe que campos son obligatorios ni que ocurrira al enviar."],
    ["case-3", "Catalogo con demasiadas tarjetas iguales", "La persona no distingue destacados, categorias ni cursos recomendados para empezar."],
    ["case-4", "Boton principal poco visible", "La accion mas importante compite con enlaces secundarios y textos largos."],
    ["case-5", "Pantalla movil saturada", "En celular el contenido exige mucho scroll y los botones quedan lejos del contexto."],
    ["case-6", "Error sin explicacion", "Un estado vacio o error no dice que paso ni como resolverlo."],
    ["case-7", "Microcopy tecnico", "Los textos usan terminos internos y no explican la accion con lenguaje de usuario."],
    ["case-8", "Proyecto final: auditoria de una pantalla", "Revision integral de una pantalla con hallazgos priorizados y propuesta de mejora."]
  ];

  return {
    incidents: cases.map(([id, title, summary], index) => ({
      id,
      title,
      summary,
      severity: index === 7 ? "Proyecto final" : "Practica guiada",
      immediateGoal: "Detectar la friccion principal, proponer una mejora pequena y comprobarla con una tarea concreta.",
      steps: [
        "Describir la tarea que la persona intenta completar.",
        "Registrar donde se pierde, duda, se equivoca o abandona.",
        "Identificar si el problema es de contenido, navegacion, jerarquia, formulario o estado.",
        "Proponer un cambio minimo que reduzca la friccion.",
        "Probar la mejora con una tarea simple.",
        "Guardar evidencia antes/despues y proximo paso."
      ],
      evidenceToPreserve: [
        "Captura o descripcion de la version inicial",
        "Problema observado",
        "Impacto sobre la tarea",
        "Propuesta de mejora",
        "Resultado de la prueba simple"
      ],
      errorsToAvoid: [
        "Resolver solo con decoracion visual.",
        "Agregar mas texto sin mejorar la decision.",
        "Ocultar el camino de regreso al inicio.",
        "Usar datos personales reales en practicas.",
        "No definir criterio de exito."
      ],
      aftercare: [
        "Priorizar hallazgos por impacto.",
        "Separar cambios rapidos de cambios estructurales.",
        "Documentar la decision para otra persona.",
        "Programar una segunda prueba si el cambio afecta una tarea critica."
      ],
      guidedDecision: {
        question: "Que accion muestra mejor criterio UX/UI?",
        options: [
          {
            text: "Corregir la friccion principal, dejar salida clara y probar la tarea.",
            isCorrect: true,
            feedback: "Correcto: una mejora UX debe reducir dudas y comprobarse."
          },
          {
            text: "Agregar mas efectos visuales sin cambiar el flujo.",
            isCorrect: false,
            feedback: "La estetica puede ayudar, pero no reemplaza navegacion, claridad y prueba."
          },
          {
            text: "Mantener el problema porque el usuario puede usar el boton atras.",
            isCorrect: false,
            feedback: "Depender del boton atras es una senal de navegacion incompleta."
          }
        ]
      }
    }))
  };
}

function reinforceUxCourse() {
  const coursePath = path.join(coursesDir, "ux_ui_basico_sitios_apps_v0_6_publica");
  json(path.join(coursePath, "src", "data", "course_content.json"), buildUxCourse());
  json(path.join(coursePath, "src", "data", "checklists.json"), buildUxChecklists());
  json(path.join(coursePath, "src", "data", "incidents.json"), buildUxIncidents());

  const manifestPath = path.join(coursePath, "src", "data", "course_manifest.json");
  const manifest = JSON.parse(read(manifestPath));
  manifest.version = "0.6-publica-profesional-nav-v1";
  manifest.publicationStatus = "publica-profesional-v0.6-reforzada";
  manifest.subtitle = "Curso practico para mejorar claridad, jerarquia, navegacion, formularios, prototipos y pruebas simples.";
  manifest.description = "Revisa interfaces simples con mirada de usuario: detecta fricciones, mejora navegacion, ordena formularios y propone cambios verificables.";
  manifest.labels = {
    ...manifest.labels,
    modules: "Modulos",
    checklists: "Checklists",
    incidents: "Proyectos",
    emergency: "Practica rapida",
    certificate: "Constancia"
  };
  manifest.webApp = {
    ...manifest.webApp,
    cacheName: "ux_ui_basico_sitios_apps_v0_6_publica-cache-v0-6-publica-profesional-nav-v1",
    publicationStatus: "publica-profesional-v0.6-reforzada"
  };
  manifest.professionalization = {
    tier: "curso-reforzado-v1.0-beta",
    updatedAt: "2026-06-04",
    improvements: [
      "Lecciones especificas de UX/UI, navegacion, jerarquia, formularios, prototipos y pruebas.",
      "Quizzes con preguntas vinculadas a problemas reales de interfaz.",
      "Checklists e incidentes orientados a evidencia, retorno al portal y mejora verificable."
    ]
  };
  manifest.editorialPolish = {
    usabilityPass: "2026-06-04",
    status: "content-specific-copy-reinforced"
  };
  json(manifestPath, manifest);

  const indexPath = path.join(coursePath, "index.html");
  let html = read(indexPath)
    .replace("UX/UI Basico para Sitios y Apps â€” Curso Web", "UX/UI Basico para Sitios y Apps - Curso Web")
    .replace("NavegaciÃ³n principal", "Navegacion principal")
    .replace("MÃ³dulos", "Modulos")
    .replace("GuÃ­a para clonar", "Guia para clonar")
    .replace("PublicaciÃ³n", "Publicacion")
    .replace("Cargando cursoâ€¦", "Cargando curso...");
  write(indexPath, html);
}

function main() {
  addCourseNavigation();
  reinforceUxCourse();
}

main();

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesRoot = path.join(root, "cursos");
const portalDataDir = path.join(root, "portal", "portal_publico_profesional_v0_6", "data");
const version = "0.7-tanda-1";
const publicationStatus = "publica-profesional-v0.7-tanda-1";

const responsibleNotice = "Contenido educativo introductorio. No reemplaza asesoramiento profesional, soporte oficial ni normativa aplicable. Si la decision afecta dinero, seguridad, datos personales, salud, trabajo o derechos, valida con fuentes oficiales o una persona competente antes de actuar.";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function safeId(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function lesson(id, module, item, index, course) {
  const evidence = item.evidence || module.evidence;
  const criterion = item.criterion || module.criterion;
  return {
    id,
    title: item.title,
    keyIdea: item.idea || `${item.title} se aprende mejor cuando se conecta con una tarea concreta, una prueba visible y una mejora documentada.`,
    shortTheory: item.theory || `En esta leccion se trabaja ${item.title.toLowerCase()} dentro de ${module.title.toLowerCase()}. La meta es reconocer el problema real, tomar una decision simple y comprobarla con ${criterion}.`,
    practicalExample: item.example || `${course.exampleContext} Practica ${item.title.toLowerCase()} sobre ese caso, compara una version inicial con una version corregida y registra ${evidence}.`,
    commonMistake: item.mistake || `El error habitual es resolver ${item.title.toLowerCase()} por intuicion, sin probar con una persona, un dispositivo o una situacion parecida a la real.`,
    whatToDoNow: item.practice || `Practica de 25 minutos: aplica ${item.title.toLowerCase()} en un ejemplo pequeno. Entrega: ${evidence}, decision tomada, prueba realizada y proxima mejora.`,
    alert: item.alert || module.alert,
    keyPoints: [
      item.point || `${item.title} debe dejar una accion observable, no solo una definicion.`,
      `Criterio de cierre: ${criterion}.`,
      `Evidencia minima: ${evidence}.`,
      `Relacion con el proyecto final: ${course.finalArtifact}.`
    ],
    responsibleNote: responsibleNotice
  };
}

function quizForModule(module, moduleIndex) {
  const base = `m${moduleIndex + 1}`;
  return [
    {
      id: `${base}-q1`,
      question: `Cual es la mejor forma de empezar el modulo "${module.title}"?`,
      options: [
        `Definir el caso, el usuario afectado y la evidencia que se va a revisar.`,
        "Copiar una solucion completa sin probarla.",
        "Esperar a tener una herramienta perfecta antes de practicar.",
        "Elegir la opcion mas vistosa aunque no resuelva el problema."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: el modulo se vuelve util cuando parte de un caso y de evidencia verificable."
    },
    {
      id: `${base}-q2`,
      question: `Que evidencia sirve para cerrar "${module.title}" sin depender de opiniones?`,
      options: [
        module.evidence,
        "Una captura sin contexto.",
        "Una frase como 'parece estar bien'.",
        "La cantidad de colores o iconos usados."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.evidence} permite revisar el resultado despues.`
    },
    {
      id: `${base}-q3`,
      question: "Que conducta aumenta el riesgo durante la practica?",
      options: [
        module.riskyChoice,
        "Trabajar con datos simulados.",
        "Anotar dudas antes de publicar o aplicar.",
        "Probar en una version pequena."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: esa conducta elimina control y puede producir errores reales."
    },
    {
      id: `${base}-q4`,
      question: "Cuando conviene pedir ayuda o validar con una fuente externa?",
      options: [
        module.helpTrigger,
        "Nunca, porque el ejercicio es suficiente para cualquier caso.",
        "Solo despues de borrar la evidencia.",
        "Cuando el resultado se ve agradable visualmente."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: validar a tiempo evita decisiones inseguras o incompletas."
    },
    {
      id: `${base}-q5`,
      question: `Cual es el entregable minimo del modulo "${module.title}"?`,
      options: [
        module.deliverable,
        "Un resumen sin prueba.",
        "Una lista de ideas sueltas.",
        "Un archivo final sin explicar cambios."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.deliverable} deja avance verificable.`
    }
  ];
}

function buildCourse(config) {
  return {
    courseId: config.courseId,
    title: config.title,
    version,
    publicationStatus,
    modules: config.modules.map((module, moduleIndex) => ({
      id: `m${moduleIndex + 1}`,
      title: module.title,
      description: module.description,
      learningRisk: module.learningRisk || "Practicar sin evidencia deja una mejora dificil de sostener.",
      lessons: module.lessons.map((item, lessonIndex) => lesson(`m${moduleIndex + 1}-l${lessonIndex + 1}`, module, item, lessonIndex, config)),
      quiz: quizForModule(module, moduleIndex)
    }))
  };
}

const checklistItemTitles = [
  "Caso y publico definidos",
  "Riesgo principal identificado",
  "Pasos de practica escritos",
  "Prueba realizada en contexto",
  "Evidencia guardada",
  "Proxima mejora priorizada"
];

function buildChecklists(config) {
  return {
    checklists: config.modules.map((module, moduleIndex) => ({
      id: `${config.shortId}-checklist-${moduleIndex + 1}`,
      title: `${module.title}: checklist de aplicacion`,
      description: `Control breve para convertir ${module.title.toLowerCase()} en una practica real dentro de ${config.practiceArea}.`,
      commercialArea: config.practiceArea,
      items: checklistItemTitles.map((title, itemIndex) => ({
        id: `${config.shortId}-cl${moduleIndex + 1}-i${itemIndex + 1}`,
        title,
        explanation: `${title} en ${module.title.toLowerCase()} debe reducir una duda concreta y dejar trazabilidad del resultado.`,
        recommendedAction: `Aplicar sobre el caso del curso y guardar ${module.evidence}. Criterio de cierre: ${module.criterion}.`
      }))
    }))
  };
}

function buildIncidents(config) {
  return {
    incidents: config.cases.map((item, index) => ({
      id: `${config.shortId}-case-${index + 1}`,
      title: item.title,
      summary: item.summary,
      severity: item.severity || "Practica guiada",
      immediateGoal: item.goal,
      steps: [
        `Definir que paso antes de actuar: ${item.trigger}.`,
        `Separar datos reales de datos simulados y evitar compartir informacion sensible.`,
        `Aplicar el criterio del curso: ${item.courseAction}.`,
        `Registrar evidencia: ${item.evidence}.`,
        `Decidir la accion minima segura y quien debe validarla si el caso es real.`,
        `Cerrar con una nota breve: resultado, duda pendiente y siguiente control.`
      ],
      evidenceToPreserve: [
        "Consigna o descripcion del caso",
        item.evidence,
        "Decision tomada y motivo",
        "Captura o registro sin datos sensibles",
        "Proxima accion"
      ],
      errorsToAvoid: [
        item.error,
        "Usar datos privados en una practica educativa.",
        "Aplicar una recomendacion sin revisar consecuencias.",
        "Borrar evidencia antes de entender el problema.",
        "Confundir ejemplo de practica con solucion definitiva."
      ],
      aftercare: [
        item.aftercare,
        "Guardar una plantilla reutilizable.",
        "Revisar si el caso se repite y convertirlo en checklist.",
        "Pedir validacion externa si afecta cuentas, pagos, seguridad o derechos."
      ],
      guidedDecision: {
        question: "Cual es la mejor decision profesional en este caso?",
        options: [
          {
            text: "Trabajar en una version controlada, guardar evidencia y validar antes de aplicar a un caso real.",
            isCorrect: true,
            feedback: "Correcto: reduce riesgo y deja aprendizaje reutilizable."
          },
          {
            text: "Actuar rapido sin documentar porque el problema parece simple.",
            isCorrect: false,
            feedback: "La falta de evidencia impide revisar errores y aprender."
          },
          {
            text: "Usar datos reales para que el ejercicio sea mas completo.",
            isCorrect: false,
            feedback: "En practicas educativas conviene usar datos simulados o anonimizados."
          }
        ]
      }
    }))
  };
}

function updateManifest(config) {
  const file = path.join(coursesRoot, config.folder, "src", "data", "course_manifest.json");
  const manifest = readJson(file);
  Object.assign(manifest, {
    templateVersion: "0.7-publica-profesional-tanda-1",
    appName: config.title,
    shortName: config.shortName,
    subtitle: config.subtitle,
    description: config.description,
    audience: config.audience,
    responsibleNotice,
    cacheName: `${config.folder}-cache-${version}`,
    contentAudit: {
      status: "reforzado-tanda-1",
      date: "2026-06-04",
      modules: 6,
      lessons: 36,
      quizQuestions: 30,
      checklists: 6,
      cases: 8,
      notes: "Contenido reemplazado para reducir patrones genericos y mejorar practica aplicada."
    }
  });
  manifest.labels = {
    ...(manifest.labels || {}),
    modules: "Modulos de aprendizaje",
    checklists: "Checklists de aplicacion",
    incidents: "Casos guiados",
    emergency: "Ayuda rapida",
    certificate: "Constancia de avance",
    primaryAction: "Empezar curso"
  };
  manifest.features = {
    ...(manifest.features || {}),
    modules: true,
    quizzes: true,
    checklists: true,
    incidents: true,
    reinforcedBatch1: true,
    publicationCandidate: true,
    publicProfessionalEdition: true,
    requiresBackend: false,
    requiresLogin: false
  };
  const note = "v0.7 tanda 1 reemplaza contenido generico por modulos, practicas, checklists y casos especificos.";
  manifest.cloneNotes = [...new Set([...(manifest.cloneNotes || []), note])];
  writeJson(file, manifest);
}

function updateServiceWorker(config) {
  const file = path.join(coursesRoot, config.folder, "service-worker.js");
  if (!fs.existsSync(file)) return;
  let sw = fs.readFileSync(file, "utf8");
  sw = sw.replace(/const CACHE_NAME = ".*?";/, `const CACHE_NAME = "${config.folder}-cache-${version}";`);
  fs.writeFileSync(file, sw, "utf8");
}

function writeCourseFiles(config) {
  const dataDir = path.join(coursesRoot, config.folder, "src", "data");
  writeJson(path.join(dataDir, "course_content.json"), buildCourse(config));
  writeJson(path.join(dataDir, "checklists.json"), buildChecklists(config));
  writeJson(path.join(dataDir, "incidents.json"), buildIncidents(config));
  if (config.stepGuides) writeJson(path.join(dataDir, "step_guides.json"), { guides: config.stepGuides });
  if (config.taskAssistant) writeJson(path.join(dataDir, "task_assistant.json"), config.taskAssistant);
  updateManifest(config);
  updateServiceWorker(config);
}

function updatePortalInventory(configs) {
  const coursesFile = path.join(portalDataDir, "courses.json");
  const courses = readJson(coursesFile);
  const byId = new Map(configs.map(config => [config.folder, config]));
  for (const course of courses) {
    const config = byId.get(course.id);
    if (!config) continue;
    course.title = config.title;
    course.version = "v0.7 tanda 1 reforzada";
    course.status = "Curso reforzado - tanda 1";
    course.audience = config.audience;
    course.description = config.description;
    course.features = [
      "6 modulos",
      "36 lecciones reforzadas",
      "30 preguntas",
      "6 checklists de aplicacion",
      "8 casos guiados",
      "Sin backend ni login"
    ];
    course.recommendedBase = "Contenido reforzado con practicas, evidencia, casos y criterios de cierre especificos.";
    course.tags = [...new Set([...(course.tags || []), "reforzado-tanda-1", "contenido-v0-7"])];
    course.publicReady = true;
  }
  writeJson(coursesFile, courses);

  const csvFile = path.join(portalDataDir, "courses_inventory.csv");
  if (fs.existsSync(csvFile)) {
    let csv = fs.readFileSync(csvFile, "utf8");
    for (const config of configs) {
      const lineRegex = new RegExp(`^${config.folder},.*$`, "m");
      const audience = `"${config.audience.replaceAll('"', '""')}"`;
      const title = config.title.includes(",") ? `"${config.title.replaceAll('"', '""')}"` : config.title;
      csv = csv.replace(lineRegex, `${config.folder},${title},v0.7 tanda 1 reforzada,Curso reforzado - tanda 1,${config.portalCategory || config.practiceArea},${audience},../../cursos/${config.folder}/index.html,true,true`);
    }
    fs.writeFileSync(csvFile, csv, "utf8");
  }
}

function updateDocs(configs) {
  const auditFile = path.join(root, "AUDITORIA_NAVEGABILIDAD_CONTENIDO_2026_06_04.md");
  if (fs.existsSync(auditFile)) {
    let text = fs.readFileSync(auditFile, "utf8");
    const marker = "## Tanda 1 de refuerzo";
    const block = `${marker}\n\nCompletada el 2026-06-04 con 5 cursos reforzados:\n\n${configs.map(config => `- ${config.folder}: 6 modulos, 36 lecciones, 30 preguntas, 6 checklists y 8 casos guiados.`).join("\n")}\n\nDeuda de contenido generico despues de esta tanda: 27 cursos.\n`;
    if (!text.includes(marker)) {
      text = `${text.trim()}\n\n${block}\n`;
    }
    text = text.replace("Real content debt: 32 courses still show generic/repeated content patterns.", "Real content debt: 27 courses still show generic/repeated content patterns after tanda 1.");
    fs.writeFileSync(auditFile, text, "utf8");
  }

  const checklistFile = path.join(root, "CHECKLIST_PUBLICACION_BETA.md");
  if (fs.existsSync(checklistFile)) {
    let text = fs.readFileSync(checklistFile, "utf8");
    if (!text.includes("Reforzar primera tanda de 5 cursos")) {
      text = text.replace(
        "- [ ] Reforzar los 32 cursos detectados con patrones de contenido generico.",
        "- [x] Reforzar primera tanda de 5 cursos detectados con patrones de contenido generico.\n- [ ] Reforzar los 27 cursos restantes con patrones de contenido generico."
      );
    }
    fs.writeFileSync(checklistFile, text, "utf8");
  }

  const pendingFile = path.join(root, "PENDIENTES_REALES_V1_0_BETA.md");
  if (fs.existsSync(pendingFile)) {
    let text = fs.readFileSync(pendingFile, "utf8");
    text = text.replace(
      "La auditoria del 2026-06-04 detecto 32 cursos con patrones de contenido generico. UX/UI Basico fue reforzado como primera muestra. Falta trabajar el resto por tandas antes de considerar v1.0 final.",
      "La auditoria del 2026-06-04 detecto 32 cursos con patrones de contenido generico. UX/UI Basico fue reforzado como primera muestra y la tanda 1 reforzo 5 cursos adicionales. Quedan 27 cursos por trabajar antes de considerar v1.0 final."
    );
    fs.writeFileSync(pendingFile, text, "utf8");
  }
}

const commonAccessibilityAlert = "No asumir que funciona para todos porque funciona con mouse, buena vista o un dispositivo propio.";

const courses = [
  {
    folder: "accesibilidad_web_principiantes_v0_6_publica",
    shortId: "a11y",
    courseId: "accesibilidad-web-principiantes",
    title: "Accesibilidad Web para Principiantes",
    shortName: "Accesibilidad Web",
    subtitle: "Barreras, HTML semantico, teclado, contraste, formularios y pruebas simples.",
    description: "Aprende a detectar barreras de accesibilidad, corregirlas con criterios verificables y documentar una mini auditoria web.",
    audience: "Principiantes de desarrollo web, docentes, creadores de sitios y equipos que publican contenidos digitales.",
    portalCategory: "Desarrollo web",
    practiceArea: "accesibilidad web inicial y mejora de interfaces publicas",
    exampleContext: "Una pagina de inscripcion a un taller se ve correcta, pero varias personas no logran completar el formulario.",
    finalArtifact: "una mini auditoria con barrera, impacto, correccion aplicada y prueba posterior",
    modules: [
      {
        title: "Accesibilidad como calidad de uso",
        description: "Entender accesibilidad como una condicion de uso real, no como un agregado estetico o legal al final.",
        evidence: "lista de barreras detectadas, usuario afectado y prioridad",
        criterion: "la mejora se puede explicar por problema, persona afectada y beneficio concreto",
        deliverable: "mapa inicial de barreras y prioridades",
        riskyChoice: "Decidir solo mirando la pagina en una pantalla propia.",
        helpTrigger: "Cuando la mejora afecta normativa, educacion, salud, trabajo o servicios publicos.",
        alert: commonAccessibilityAlert,
        lessons: [
          { title: "Accesibilidad no es solo discapacidad", idea: "Tambien cubre contexto: poca luz, mala conexion, cansancio, edad, lesion temporal o dispositivos limitados.", practice: "Describe tres usuarios distintos para una misma pagina y anota que podria impedirles avanzar.", mistake: "Pensar que accesibilidad solo importa si hay una persona ciega usando lector de pantalla." },
          { title: "Barreras visibles e invisibles", idea: "Una barrera puede estar en el color, el orden, el lenguaje, el foco, el formulario o la falta de alternativa.", practice: "Revisa una pantalla y separa barreras visuales, de navegacion, de comprension y de operacion.", mistake: "Corregir solo colores y dejar enlaces ambiguos, errores confusos o botones inaccesibles." },
          { title: "Principios POUR en lenguaje simple", idea: "Perceptible, operable, comprensible y robusto ayudan a ordenar la revision sin memorizar toda la norma.", practice: "Clasifica cinco problemas de una pagina usando esos cuatro principios.", mistake: "Usar POUR como teoria decorativa sin convertirlo en preguntas de prueba." },
          { title: "Priorizar por impacto", idea: "No todos los problemas bloquean igual: primero se corrige lo que impide leer, navegar, entender o completar una accion.", practice: "Ordena diez hallazgos por bloqueo, frecuencia y esfuerzo de correccion.", mistake: "Empezar por detalles menores mientras una accion principal sigue bloqueada." },
          { title: "Evidencia antes y despues", idea: "La accesibilidad mejora cuando se puede comparar el problema inicial con la correccion aplicada.", practice: "Guarda captura, descripcion, cambio y prueba posterior de una barrera.", mistake: "Anotar 'mejorado' sin mostrar que cambio ni como se comprobo." },
          { title: "Alcance de una auditoria inicial", idea: "Una auditoria principiante no promete cumplimiento total; delimita paginas, flujos y pruebas realizadas.", practice: "Redacta alcance, limitaciones y proximo paso de tu revision.", mistake: "Decir 'sitio accesible' despues de revisar una sola pantalla." }
        ]
      },
      {
        title: "HTML semantico y lectura clara",
        description: "Ordenar estructura, titulos, enlaces, imagenes y regiones para que el contenido tenga sentido mas alla de lo visual.",
        evidence: "estructura de encabezados, enlaces descriptivos y alternativas revisadas",
        criterion: "la pagina mantiene sentido al leer titulos, enlaces y regiones en orden",
        deliverable: "pagina o fragmento HTML con semantica corregida",
        riskyChoice: "Usar divs y textos visuales sin marcar funcion ni jerarquia.",
        helpTrigger: "Cuando un componente propio reemplaza controles nativos importantes.",
        alert: "No sacrificar semantica por una apariencia mas facil de maquetar.",
        lessons: [
          { title: "Titulos que arman un mapa", idea: "Los headings deben contar la estructura de la pagina, no decorar tamanos de texto.", practice: "Reordena H1, H2 y H3 de una pagina y verifica que se pueda entender el mapa sin ver el diseno.", mistake: "Saltar de H1 a H4 porque el tamano visual parece conveniente." },
          { title: "Landmarks y regiones", idea: "Header, nav, main, section y footer ayudan a moverse rapido con tecnologias de asistencia.", practice: "Marca las regiones principales de una pagina simple.", mistake: "Repetir nav o main sin necesidad y crear ruido para quien navega por regiones." },
          { title: "Enlaces y botones con nombre real", idea: "El nombre accesible debe decir que pasa al activar el control.", practice: "Reemplaza enlaces 'click aqui' por textos que indiquen destino o accion.", mistake: "Poner iconos sin texto ni aria-label cuando el icono no se entiende solo." },
          { title: "Imagenes con alternativa util", idea: "El alt depende de la funcion de la imagen: informar, decorar, explicar o enlazar.", practice: "Escribe alt para una imagen informativa, una decorativa y una imagen dentro de un enlace.", mistake: "Describir todos los detalles visuales aunque no aporten a la tarea." },
          { title: "Tablas y listas con proposito", idea: "Listas y tablas deben elegirse por estructura de informacion, no por comodidad visual.", practice: "Convierte un bloque de texto en lista y una comparacion en tabla con encabezados.", mistake: "Usar tablas para maquetar columnas decorativas." },
          { title: "Lenguaje comprensible", idea: "La claridad tambien es accesibilidad: frases cortas, accion visible y palabras consistentes reducen errores.", practice: "Reescribe instrucciones largas de un formulario en pasos cortos.", mistake: "Usar jerga interna del equipo en acciones que ve el publico." }
        ]
      },
      {
        title: "Teclado, foco y navegacion",
        description: "Probar que una persona pueda recorrer, entender y operar la interfaz sin mouse.",
        evidence: "recorrido de teclado anotado, foco visible y bloqueos corregidos",
        criterion: "todo control importante se alcanza, se entiende y se activa con teclado",
        deliverable: "prueba de teclado documentada con correcciones",
        riskyChoice: "Probar solo con mouse o pantalla tactil.",
        helpTrigger: "Cuando aparecen modales, menus complejos, carruseles o componentes personalizados.",
        alert: "No ocultar el foco porque molesta visualmente: el foco es orientacion.",
        lessons: [
          { title: "Recorrido con Tab y Shift Tab", idea: "El orden de foco debe seguir el orden logico de lectura y tarea.", practice: "Recorre una pagina completa con Tab y anota saltos inesperados.", mistake: "Mover elementos visualmente con CSS y dejar un orden de foco incoherente." },
          { title: "Foco visible", idea: "La persona debe ver donde esta antes de activar un enlace, boton o campo.", practice: "Aumenta contraste y grosor del foco en botones y enlaces.", mistake: "Eliminar outline globalmente sin reemplazo accesible." },
          { title: "Skip link", idea: "Un enlace de salto permite pasar navegacion repetida e ir al contenido principal.", practice: "Agrega y prueba un skip link que aparezca al recibir foco.", mistake: "Crear el enlace pero apuntarlo a un id inexistente." },
          { title: "Menus desplegables simples", idea: "Un menu debe abrirse, cerrarse y recorrerse de forma predecible.", practice: "Prueba abrir, cerrar con Escape y volver el foco al boton del menu.", mistake: "Dejar el foco perdido dentro de contenido oculto." },
          { title: "Modales sin trampa", idea: "Un modal debe atrapar foco mientras esta abierto y devolverlo al cerrar.", practice: "Dibuja el recorrido de foco de un modal de confirmacion.", mistake: "Permitir que Tab navegue por la pagina que queda detras." },
          { title: "Estados activos y actuales", idea: "La navegacion necesita indicar pagina, paso o pestaña actual tambien para lectores.", practice: "Agrega aria-current en el enlace de seccion activa.", mistake: "Depender solo de un color para indicar ubicacion." }
        ]
      },
      {
        title: "Contraste, tamano y percepcion",
        description: "Mejorar legibilidad, estados visuales y mensajes sin depender solo del color.",
        evidence: "contraste revisado, estados distinguibles y texto legible en movil",
        criterion: "la informacion se comprende con zoom, bajo contraste ambiental y sin distinguir colores",
        deliverable: "lista de ajustes visuales con prueba de legibilidad",
        riskyChoice: "Elegir colores por marca sin medir contraste ni estados.",
        helpTrigger: "Cuando el sitio tiene requisitos de marca, gobierno, educacion o servicios masivos.",
        alert: "Un color lindo que no se lee es un bloqueo, no un detalle estetico.",
        lessons: [
          { title: "Contraste de texto", idea: "El texto debe separarse del fondo con contraste suficiente en estados normales y deshabilitados.", practice: "Mide contraste de texto principal, enlaces y botones.", mistake: "Medir solo un color de marca y olvidar hover, foco y error." },
          { title: "No depender solo del color", idea: "El color debe reforzar informacion, no ser el unico canal.", practice: "Agrega texto o icono a mensajes de exito, error y advertencia.", mistake: "Mostrar errores solo con borde rojo." },
          { title: "Tamano y espaciado", idea: "Texto, interlineado y espacios tactiles reducen esfuerzo y errores.", practice: "Revisa una tarjeta en movil y aumenta legibilidad sin romper jerarquia.", mistake: "Achicar texto para que todo entre en una sola pantalla." },
          { title: "Iconos con significado", idea: "Un icono necesita etiqueta, contexto o repeticion suficiente para ser entendido.", practice: "Etiqueta tres iconos de accion y prueba si se entienden fuera de contexto.", mistake: "Usar iconos decorativos como unica instruccion." },
          { title: "Zoom y responsive", idea: "La interfaz debe soportar aumento de texto y pantallas pequenas sin solapar contenido.", practice: "Prueba 200% de zoom y ancho movil en una pagina.", mistake: "Fijar alturas que cortan texto cuando el usuario aumenta fuente." },
          { title: "Movimiento y distraccion", idea: "Animaciones, parpadeos y transiciones pueden afectar comprension o comodidad.", practice: "Identifica animaciones no esenciales y define alternativa reducida.", mistake: "Animar elementos criticos sin respetar preferencias de movimiento reducido." }
        ]
      },
      {
        title: "Formularios, errores y ayuda",
        description: "Diseñar campos, instrucciones, validaciones y confirmaciones que eviten abandono y errores repetidos.",
        evidence: "formulario probado con etiquetas, instrucciones, errores y confirmacion",
        criterion: "una persona puede completar, corregir y confirmar el envio sin adivinar",
        deliverable: "formulario corregido con prueba de error",
        riskyChoice: "Validar solo despues de enviar y mostrar mensajes ambiguos.",
        helpTrigger: "Cuando se piden datos personales, pagos, turnos, salud o informacion sensible.",
        alert: "Nunca pedir mas datos de los necesarios para la tarea.",
        lessons: [
          { title: "Label visible y asociado", idea: "Cada campo necesita una etiqueta que permanezca visible y este conectada al input.", practice: "Asocia labels a nombre, correo y telefono.", mistake: "Usar placeholder como unica etiqueta." },
          { title: "Instrucciones antes del error", idea: "La ayuda debe aparecer antes de que la persona falle.", practice: "Agrega formato esperado y ejemplo seguro en un campo complejo.", mistake: "Reprender al usuario despues de un error que el sistema podia prevenir." },
          { title: "Mensajes de error accionables", idea: "Un buen error explica que paso, donde y como corregirlo.", practice: "Reescribe tres errores genericos para que indiquen accion.", mistake: "Mostrar 'dato invalido' sin decir cual dato ni por que." },
          { title: "Campos obligatorios y opcionales", idea: "La obligacion debe ser clara y consistente desde el inicio.", practice: "Marca campos obligatorios y explica por que se pide cada dato sensible.", mistake: "Dejar que el usuario descubra campos requeridos al final." },
          { title: "Confirmacion y recuperacion", idea: "Despues de enviar, la persona necesita saber si la accion se completo y que hacer luego.", practice: "Redacta pantalla de confirmacion con numero, correo o proximo paso.", mistake: "Vaciar el formulario sin confirmar resultado." },
          { title: "Privacidad en formularios", idea: "Accesibilidad y privacidad se cruzan cuando pedimos datos: menos datos, mejor explicacion y mas control.", practice: "Elimina un campo innecesario y agrega texto de uso de datos.", mistake: "Copiar formularios largos de otra organizacion sin revisar necesidad." }
        ]
      },
      {
        title: "Prueba manual y reporte",
        description: "Cerrar una revision accesible con evidencia, recomendaciones claras y un backlog posible.",
        evidence: "reporte breve con hallazgos, severidad, evidencia, solucion y retest",
        criterion: "cada hallazgo puede ser entendido y corregido por otra persona",
        deliverable: "reporte de auditoria inicial priorizado",
        riskyChoice: "Entregar una lista de problemas sin severidad ni prueba posterior.",
        helpTrigger: "Cuando se declara cumplimiento normativo o se auditan servicios criticos.",
        alert: "Una auditoria inicial no reemplaza una evaluacion experta completa.",
        lessons: [
          { title: "Prueba con teclado", idea: "La prueba manual mas barata y reveladora es recorrer el flujo sin mouse.", practice: "Graba o anota el recorrido de foco de una tarea principal.", mistake: "Probar solo la home y no el flujo completo." },
          { title: "Prueba con lector basica", idea: "No hace falta ser experto para detectar nombres confusos, orden raro o controles sin etiqueta.", practice: "Escucha titulos, enlaces y campos con una herramienta disponible.", mistake: "Simular lector mirando el DOM sin escuchar la experiencia." },
          { title: "Severidad y prioridad", idea: "Severidad mide impacto; prioridad combina impacto, frecuencia y esfuerzo.", practice: "Clasifica cinco hallazgos en bloqueante, alto, medio o bajo.", mistake: "Marcar todo como urgente y perder foco." },
          { title: "Redaccion del hallazgo", idea: "Un hallazgo util dice problema, evidencia, impacto, recomendacion y criterio de cierre.", practice: "Escribe un hallazgo completo sobre un error de formulario.", mistake: "Escribir 'arreglar accesibilidad' como tarea unica." },
          { title: "Retest", idea: "Una correccion no termina hasta probar que resolvio el problema sin crear otro.", practice: "Define como vas a retestear un foco, un contraste y una etiqueta.", mistake: "Cerrar el ticket apenas se modifica el codigo." },
          { title: "Backlog accesible", idea: "La accesibilidad mejora por ciclos: critico ahora, importante despues, aprendizaje continuo.", practice: "Arma un backlog de 5 mejoras con responsable y fecha de revision.", mistake: "Guardar la auditoria en un documento que nadie vuelve a abrir." }
        ]
      }
    ],
    cases: [
      { title: "Formulario de inscripcion que no se completa con teclado", summary: "Una persona no puede llegar al boton final sin mouse.", goal: "Detectar el bloqueo de foco y proponer correccion verificable.", trigger: "el flujo se detiene en un selector personalizado", courseAction: "recorrer con Tab, documentar el punto exacto y sugerir control nativo o foco gestionado", evidence: "orden de foco, captura del control y recomendacion", error: "Cambiar colores del boton sin corregir el bloqueo.", aftercare: "Agregar prueba de teclado al checklist de publicacion." },
      { title: "Texto importante con bajo contraste", summary: "La informacion de vencimiento casi no se lee en movil.", goal: "Medir contraste y corregir estilo sin perder jerarquia.", trigger: "texto gris claro sobre fondo blanco", courseAction: "medir contraste, ajustar color/tamano y probar estados", evidence: "valor inicial, valor corregido y captura comparativa", error: "Aumentar brillo de pantalla y declarar resuelto.", aftercare: "Crear tokens de color accesibles para el sitio." },
      { title: "Error de formulario incomprensible", summary: "El usuario recibe 'dato invalido' y no sabe que corregir.", goal: "Convertir el error en una instruccion accionable.", trigger: "mensaje generico despues de enviar", courseAction: "asociar error al campo, explicar formato y preservar datos escritos", evidence: "mensaje anterior, mensaje nuevo y prueba de correccion", error: "Vaciar el formulario despues del error.", aftercare: "Revisar todos los mensajes de validacion." },
      { title: "Pagina con enlaces 'ver mas'", summary: "Una lista de noticias repite el mismo enlace sin contexto.", goal: "Mejorar nombres accesibles de enlaces repetidos.", trigger: "links identicos para destinos diferentes", courseAction: "hacer textos descriptivos o aria-label contextual", evidence: "lista de enlaces antes y despues", error: "Agregar title y dejar el mismo texto ambiguo.", aftercare: "Definir regla editorial para enlaces." },
      { title: "Imagen informativa sin alternativa", summary: "Un grafico comunica requisitos pero no tiene texto equivalente.", goal: "Escribir alternativa util para contenido visual importante.", trigger: "imagen con texto incrustado", courseAction: "separar texto real, alt breve y descripcion si hace falta", evidence: "contenido de la imagen y alternativa propuesta", error: "Poner alt='imagen' o dejar alt vacio.", aftercare: "Evitar imagenes de texto en nuevas publicaciones." },
      { title: "Menu movil dificil de cerrar", summary: "El menu abre pero el foco queda perdido y Escape no funciona.", goal: "Documentar comportamiento esperado del menu.", trigger: "componente personalizado sin gestion de foco", courseAction: "probar apertura, recorrido, cierre y retorno de foco", evidence: "pasos de teclado y recomendacion de cierre", error: "Solo revisar el menu con tactil.", aftercare: "Agregar prueba de menu a QA." },
      { title: "Contenido que se rompe al hacer zoom", summary: "A 200% de zoom se superponen botones y texto.", goal: "Detectar causa de layout rigido.", trigger: "alto fijo y texto largo", courseAction: "probar zoom, eliminar restricciones y revisar responsive", evidence: "captura 100%, captura 200% y ajuste CSS", error: "Reducir fuente para que entre.", aftercare: "Usar restricciones fluidas en componentes." },
      { title: "Declaracion de accesibilidad exagerada", summary: "El equipo quiere decir que el sitio cumple todo tras una revision breve.", goal: "Redactar alcance honesto de auditoria inicial.", trigger: "revision parcial de pocas paginas", courseAction: "delimitar alcance, pruebas hechas y pendientes", evidence: "alcance escrito y lista de pendientes", error: "Prometer cumplimiento total sin evaluacion completa.", aftercare: "Planificar auditoria experta si hay obligacion normativa." }
    ]
  },
  {
    folder: "alfabetizacion_digital_adultos_web_v0_6_publica",
    shortId: "alfa",
    courseId: "alfabetizacion-digital-adultos-web",
    title: "Alfabetizacion Digital para Adultos",
    shortName: "Alfabetizacion Digital",
    subtitle: "Celular, WhatsApp, correo, turnos, formularios y seguridad con pasos claros.",
    description: "Curso practico para ganar autonomia digital en tareas cotidianas sin compartir claves, codigos ni datos sensibles.",
    audience: "Adultos con baja experiencia digital, personas mayores, familias acompanantes y talleres comunitarios.",
    portalCategory: "Ciudadania digital",
    practiceArea: "autonomia digital cotidiana y acompanamiento seguro",
    exampleContext: "Una persona necesita sacar un turno, enviar un comprobante y reconocer si un mensaje es confiable.",
    finalArtifact: "carpeta de guias personales con pasos, dudas frecuentes y criterios para pedir ayuda segura",
    modules: [
      {
        title: "Confianza digital y cuidado basico",
        description: "Construir una forma tranquila de aprender, practicar sin miedo y reconocer cuando una tarea requiere ayuda.",
        evidence: "lista personal de tareas que puedo hacer, practicar o pedir ayuda",
        criterion: "la persona distingue practica, tarea real y situacion de riesgo",
        deliverable: "plan personal de aprendizaje digital",
        riskyChoice: "Compartir claves o codigos para que otra persona resuelva rapido.",
        helpTrigger: "Cuando aparecen pagos, claves, codigos, documentos, amenazas o urgencias.",
        alert: "Nadie confiable deberia pedir tu clave o codigo de verificacion por chat.",
        lessons: [
          { title: "Aprender sin apuro", idea: "La autonomia digital se construye con pasos repetibles, no con memoria perfecta.", practice: "Elegir una tarea chica y escribirla en pasos numerados.", mistake: "Pensar que equivocarse una vez significa no poder aprender." },
          { title: "Diferenciar practicar y operar en serio", idea: "Primero se practica con datos inventados; despues se hace la tarea real con mas cuidado.", practice: "Marca que datos usaras para practicar y cuales nunca debes compartir.", mistake: "Usar fotos de documentos reales en ejercicios." },
          { title: "Claves, codigos y privacidad", idea: "Clave, PIN y codigo de verificacion son llaves personales.", practice: "Escribe una regla simple para no compartir claves ni codigos.", mistake: "Dictar un codigo de SMS a alguien que llama apurado." },
          { title: "Pedir ayuda segura", idea: "Pedir ayuda no es entregar control: se puede pedir acompanamiento mirando la pantalla.", practice: "Redacta una frase para pedir ayuda sin dar claves.", mistake: "Dejar el celular desbloqueado para que otra persona haga todo." },
          { title: "Senales de urgencia falsa", idea: "Los fraudes suelen apurar, asustar o prometer premios.", practice: "Clasifica mensajes como tranquilo, revisar o detener.", mistake: "Responder por miedo antes de consultar." },
          { title: "Registro de dudas", idea: "Anotar dudas evita repetir errores y ayuda a pedir ayuda concreta.", practice: "Crea una hoja con tarea, duda, paso donde me trabo y persona confiable.", mistake: "Borrar todo cuando algo no sale." }
        ]
      },
      {
        title: "Celular esencial",
        description: "Usar ajustes, conexion, capturas, archivos, fotos y actualizaciones sin perder control del dispositivo.",
        evidence: "guia personal de ajustes basicos y comprobaciones del celular",
        criterion: "la persona encuentra ajustes clave y puede explicar para que sirven",
        deliverable: "mapa simple del celular propio",
        riskyChoice: "Instalar o tocar permisos sin leer de que se trata.",
        helpTrigger: "Cuando el celular pide restablecer, borrar datos o cambiar cuenta principal.",
        alert: "Antes de borrar o restablecer, verificar copia, cuenta y fotos importantes.",
        lessons: [
          { title: "Conocer pantalla, botones y gestos", idea: "Nombrar las partes del celular ayuda a seguir instrucciones.", practice: "Dibuja tu pantalla principal y ubica telefono, mensajes, ajustes y camara.", mistake: "Cambiar pantallas y no saber volver al inicio." },
          { title: "WiFi, datos y modo avion", idea: "Muchas fallas son de conexion, no de la app.", practice: "Compara iconos de WiFi, datos moviles y modo avion.", mistake: "Reintentar una tarea sensible sin revisar conexion." },
          { title: "Capturas de pantalla", idea: "Una captura sirve para pedir ayuda sin entregar el celular.", practice: "Haz una captura de una pantalla sin datos privados y guardala.", mistake: "Enviar capturas con DNI, saldos o codigos visibles." },
          { title: "Fotos y archivos", idea: "Distinguir foto, descarga y archivo evita perder comprobantes.", practice: "Busca una foto reciente y un PDF descargado.", mistake: "Descargar muchas veces el mismo archivo y no saber cual usar." },
          { title: "Actualizaciones", idea: "Actualizar corrige errores y mejora seguridad, pero conviene revisar bateria y conexion.", practice: "Busca donde se ven actualizaciones del sistema y apps.", mistake: "Ignorar actualizaciones por meses por miedo a tocar." },
          { title: "Accesibilidad del celular", idea: "Aumentar letra, contraste o lectura en voz alta puede facilitar autonomia.", practice: "Prueba aumentar tamano de texto y volver al valor anterior.", mistake: "Forzar vista pequena para no 'molestar' aunque dificulte leer." }
        ]
      },
      {
        title: "WhatsApp y comunicacion cotidiana",
        description: "Enviar mensajes, audios, fotos, ubicacion y archivos con cuidado y criterio.",
        evidence: "guia de comunicacion segura con ejemplos de mensajes",
        criterion: "la persona elige que compartir, con quien y por que canal",
        deliverable: "plantilla de mensajes y cuidados para WhatsApp",
        riskyChoice: "Reenviar enlaces, audios o datos personales sin revisar.",
        helpTrigger: "Cuando piden dinero, codigos, datos bancarios o cambios urgentes por chat.",
        alert: "Un contacto conocido tambien puede estar usando una cuenta robada.",
        lessons: [
          { title: "Contactos y chats", idea: "Confirmar contacto evita enviar informacion a la persona equivocada.", practice: "Revisa nombre, foto, numero y ultimo mensaje antes de responder.", mistake: "Responder datos privados a un numero nuevo que usa foto familiar." },
          { title: "Audios claros", idea: "Un audio util dice quien habla, que necesita y que accion espera.", practice: "Graba un audio breve de practica y escuchalo antes de enviar.", mistake: "Mandar audios largos con varios temas mezclados." },
          { title: "Fotos y documentos", idea: "Antes de enviar una foto se revisa que no muestre datos innecesarios.", practice: "Prepara una foto simulada y recorta informacion que no corresponde.", mistake: "Enviar frente y dorso de documentos sin verificar destino." },
          { title: "Enlaces y archivos recibidos", idea: "No todo enlace enviado por chat es seguro.", practice: "Mira dominio, urgencia y pedido antes de abrir.", mistake: "Abrir un link porque viene de un contacto conocido." },
          { title: "Ubicacion", idea: "Compartir ubicacion puede ser util, pero tambien expone donde estas.", practice: "Diferencia enviar ubicacion actual y ubicacion en tiempo real.", mistake: "Dejar ubicacion en tiempo real activa sin necesidad." },
          { title: "Bloquear y reportar", idea: "Bloquear no es mala educacion cuando hay riesgo, acoso o fraude.", practice: "Identifica donde se bloquea y reporta un contacto.", mistake: "Seguir respondiendo para convencer a un estafador." }
        ]
      },
      {
        title: "Correo, cuentas y recuperacion",
        description: "Usar correo electronico, adjuntos, recuperacion de cuenta y verificacion sin exponer claves.",
        evidence: "mapa de cuenta principal, metodos de recuperacion y cuidados",
        criterion: "la cuenta puede recuperarse sin entregar claves a terceros",
        deliverable: "ficha segura de cuenta y recuperacion",
        riskyChoice: "Guardar claves en chats o papeles visibles.",
        helpTrigger: "Cuando se pierde acceso a correo, banco, red social o cuenta estatal.",
        alert: "El correo suele ser la llave para recuperar otras cuentas.",
        lessons: [
          { title: "Para que sirve el correo", idea: "El correo recibe turnos, comprobantes, avisos y recuperacion de cuentas.", practice: "Enumera tres tramites donde necesitas correo.", mistake: "Usar correo de otra persona para cuentas propias." },
          { title: "Enviar y responder", idea: "Asunto, destinatario y adjunto se revisan antes de enviar.", practice: "Redacta un correo de practica con asunto claro y saludo.", mistake: "Responder a todos cuando solo corresponde a una persona." },
          { title: "Adjuntos y descargas", idea: "Un adjunto puede ser comprobante o riesgo; se revisa remitente y tipo de archivo.", practice: "Diferencia PDF, foto y enlace de descarga.", mistake: "Abrir adjuntos inesperados de supuestos bancos." },
          { title: "Recuperacion de cuenta", idea: "Telefono y correo alternativo ayudan a recuperar acceso.", practice: "Revisa si la cuenta tiene metodo de recuperacion actualizado.", mistake: "Compartir codigo de recuperacion con quien dice ser soporte." },
          { title: "Spam y phishing", idea: "Mensajes falsos copian logos y urgencias para robar datos.", practice: "Marca senales de fraude en un correo simulado.", mistake: "Confiar solo en el logo." },
          { title: "Cerrar sesion en equipos ajenos", idea: "En computadoras compartidas hay que cerrar sesion y evitar guardar claves.", practice: "Escribe los pasos para salir de una cuenta en un equipo publico.", mistake: "Cerrar la ventana creyendo que eso cierra sesion." }
        ]
      },
      {
        title: "Turnos, tramites y formularios",
        description: "Resolver tareas frecuentes en sitios oficiales o servicios privados con evidencia y paciencia.",
        evidence: "pasos del tramite, datos usados y comprobante guardado",
        criterion: "la persona sabe donde esta, que dato entrega y como guardar comprobante",
        deliverable: "guia de tramite frecuente con comprobante",
        riskyChoice: "Entrar desde links dudosos o entregar datos sin verificar sitio.",
        helpTrigger: "Cuando se piden pagos, documentos, claves fiscales, salud o datos bancarios.",
        alert: "Antes de completar un tramite, verificar direccion del sitio y organismo.",
        lessons: [
          { title: "Buscar sitio oficial", idea: "El primer resultado no siempre es el sitio correcto.", practice: "Compara una busqueda con el dominio oficial esperado.", mistake: "Entrar a anuncios o copias sin revisar direccion." },
          { title: "Leer requisitos antes de empezar", idea: "Saber que se necesita evita abandonar a mitad del tramite.", practice: "Lista datos y documentos de un tramite simulado.", mistake: "Empezar sin tener correo, documento o comprobante a mano." },
          { title: "Completar formularios", idea: "Un formulario se completa mejor campo por campo, revisando antes de enviar.", practice: "Practica con datos simulados y marca campos obligatorios.", mistake: "Enviar varias veces porque tarda en responder." },
          { title: "Turnos y calendarios", idea: "Fecha, hora, sede y comprobante deben guardarse juntos.", practice: "Crea una nota con datos de un turno simulado.", mistake: "Confiar en recordar la fecha sin anotar." },
          { title: "Guardar comprobantes", idea: "Captura, PDF o correo sirven para demostrar la accion realizada.", practice: "Guarda un comprobante simulado con nombre claro.", mistake: "Cerrar la pantalla de confirmacion sin guardar nada." },
          { title: "Si algo falla", idea: "Error de sitio, conexion o dato requiere pausa y evidencia.", practice: "Escribe que hacer si aparece un mensaje de error.", mistake: "Reintentar pagos o envios muchas veces sin consultar." }
        ]
      },
      {
        title: "Autonomia y rutina segura",
        description: "Armar una rutina para seguir aprendiendo, practicar tareas y detectar situaciones donde conviene detenerse.",
        evidence: "rutina personal de practica, ayuda segura y revision mensual",
        criterion: "la persona tiene pasos para practicar y limites claros para no exponerse",
        deliverable: "rutina digital segura de 30 dias",
        riskyChoice: "Delegar todas las tareas y no aprender ningun paso.",
        helpTrigger: "Cuando una tarea genera miedo, presion, perdida de dinero o posible fraude.",
        alert: "La autonomia tambien incluye saber detenerse.",
        lessons: [
          { title: "Tareas que puedo repetir", idea: "Repetir tareas frecuentes consolida confianza.", practice: "Elige tres tareas semanales: mensaje, correo y comprobante.", mistake: "Practicar siempre una tarea distinta y no automatizar ninguna." },
          { title: "Lista de personas confiables", idea: "Tener ayuda definida evita recurrir a desconocidos.", practice: "Anota dos personas y que tipo de ayuda pueden dar.", mistake: "Pedir ayuda en comentarios publicos con datos personales." },
          { title: "Palabras de alerta", idea: "Urgente, premio, bloqueo, deuda o codigo pueden indicar riesgo.", practice: "Crea una lista propia de palabras para pausar.", mistake: "Responder rapido para que no 'se venza' una amenaza." },
          { title: "Orden de comprobantes", idea: "Nombrar y guardar comprobantes evita buscar en chats eternos.", practice: "Define nombres simples: fecha, tramite y organismo.", mistake: "Mandarse todo por WhatsApp y perder contexto." },
          { title: "Revision mensual", idea: "Una vez por mes conviene revisar apps, cuentas y dudas.", practice: "Crea una alarma mensual de revision digital.", mistake: "Esperar a tener un problema para revisar seguridad." },
          { title: "Celebrar avances concretos", idea: "Medir avances por tareas realizadas ayuda a sostener el aprendizaje.", practice: "Escribe cinco cosas digitales que ahora puedes hacer mejor.", mistake: "Compararse con personas que usan tecnologia hace anos." }
        ]
      }
    ],
    cases: [
      { title: "Mensaje que pide codigo de WhatsApp", summary: "Un supuesto familiar pide reenviar un codigo recibido por SMS.", goal: "Detener la accion y proteger la cuenta.", trigger: "pedido urgente de codigo", courseAction: "no compartir codigo, llamar por otro canal y revisar seguridad", evidence: "captura del pedido ocultando datos sensibles", error: "Enviar el codigo para ayudar rapido.", aftercare: "Activar verificacion en dos pasos si corresponde." },
      { title: "Turno perdido por no guardar comprobante", summary: "La persona cerro la pagina y no sabe fecha ni sede.", goal: "Reconstruir evidencia y crear rutina de guardado.", trigger: "cierre de pantalla sin captura", courseAction: "buscar correo, historial o cuenta y anotar datos", evidence: "correo de confirmacion o captura recuperada", error: "Sacar otro turno sin revisar si ya habia uno.", aftercare: "Guardar comprobantes con nombre claro." },
      { title: "Correo falso de banco", summary: "Llega un correo con logo que pide actualizar clave.", goal: "Reconocer senales de phishing.", trigger: "enlace con urgencia y pedido de clave", courseAction: "no abrir enlace, verificar desde app o sitio escrito manualmente", evidence: "remitente, asunto y enlace sospechoso", error: "Confiar en el logo del correo.", aftercare: "Crear regla: banco nunca pide clave por correo." },
      { title: "Foto de documento enviada al chat equivocado", summary: "Se envio una imagen sensible a un contacto incorrecto.", goal: "Reducir exposicion y aprender revision previa.", trigger: "envio apresurado de imagen", courseAction: "avisar, borrar si es posible y revisar que datos quedaron expuestos", evidence: "registro del envio sin republicar la imagen", error: "Reenviar de nuevo para explicar.", aftercare: "Usar lista de verificacion antes de mandar documentos." },
      { title: "App desconocida instalada", summary: "Aparece una app que la persona no recuerda haber instalado.", goal: "Revisar origen y permisos.", trigger: "icono desconocido y permisos amplios", courseAction: "identificar app, revisar permisos y pedir ayuda si hay duda", evidence: "nombre de app y permisos", error: "Abrir la app para ver que hace.", aftercare: "Instalar solo desde tiendas oficiales." },
      { title: "Problema al adjuntar un archivo", summary: "El comprobante esta descargado pero no aparece al adjuntar.", goal: "Diferenciar fotos, descargas y archivos.", trigger: "archivo en carpeta incorrecta", courseAction: "buscar por nombre, fecha y tipo de archivo", evidence: "ubicacion encontrada o paso donde se trabo", error: "Descargar muchas copias sin nombrarlas.", aftercare: "Guardar comprobantes con nombre y carpeta simple." },
      { title: "Ayuda insegura en un local", summary: "Una persona desconocida ofrece resolver una cuenta pidiendo clave.", goal: "Pedir ayuda sin entregar control total.", trigger: "pedido de clave y celular desbloqueado", courseAction: "mantener el celular en mano y no dictar claves", evidence: "descripcion del pedido", error: "Entregar telefono y clave para terminar rapido.", aftercare: "Definir personas confiables de ayuda." },
      { title: "Pago duplicado por reintentar", summary: "Un sitio tarda y la persona presiona pagar varias veces.", goal: "Pausar, guardar evidencia y consultar.", trigger: "pantalla lenta despues de pago", courseAction: "no repetir, revisar comprobante y contactar soporte oficial", evidence: "hora, captura y movimiento si existe", error: "Seguir tocando pagar por ansiedad.", aftercare: "Crear regla de pausa en pagos." }
    ],
    stepGuides: [
      { id: "guia-whatsapp-mensaje", title: "Enviar un mensaje de WhatsApp con cuidado", category: "WhatsApp", goal: "Mandar un mensaje al contacto correcto sin compartir datos de mas.", estimatedTime: "10 minutos", difficulty: "Basica", beforeStart: ["Tener el contacto guardado o verificar el numero.", "No incluir claves, codigos ni documentos."], steps: ["Abrir WhatsApp.", "Buscar el contacto por nombre.", "Revisar foto, numero y ultimo mensaje.", "Escribir un mensaje corto con una sola idea.", "Leer antes de enviar.", "Enviar y esperar respuesta."], commonMistakes: ["Enviar al grupo equivocado.", "Mandar datos privados en el primer mensaje."], whenAskHelp: ["Si el contacto pide dinero, codigos o datos bancarios.", "Si no estas seguro de que sea la persona correcta."], copySummary: "Verificar contacto, escribir claro, revisar y recien enviar." },
      { id: "guia-captura", title: "Hacer una captura sin exponer datos", category: "Celular", goal: "Guardar evidencia para pedir ayuda sin mostrar informacion privada.", estimatedTime: "8 minutos", difficulty: "Basica", beforeStart: ["Cerrar datos sensibles si se puede.", "Revisar que no aparezcan codigos o saldos."], steps: ["Abrir la pantalla que queres guardar.", "Tapar o salir de datos privados si aparecen.", "Usar la combinacion de captura del celular.", "Abrir la galeria.", "Revisar la captura.", "Enviar solo si no muestra datos sensibles."], commonMistakes: ["Enviar capturas con DNI o codigos.", "No revisar la imagen antes de compartir."], whenAskHelp: ["Si no sabes hacer captura en tu modelo.", "Si la pantalla muestra informacion sensible."], copySummary: "Capturar, revisar datos visibles y compartir solo lo necesario." },
      { id: "guia-correo-adjunto", title: "Enviar un correo con adjunto", category: "Correo", goal: "Mandar un archivo a la persona correcta con asunto claro.", estimatedTime: "15 minutos", difficulty: "Media", beforeStart: ["Tener archivo ubicado.", "Confirmar destinatario."], steps: ["Abrir correo.", "Tocar redactar.", "Escribir destinatario.", "Poner asunto claro.", "Escribir mensaje breve.", "Adjuntar archivo.", "Revisar todo antes de enviar."], commonMistakes: ["Olvidar el adjunto.", "Enviar al correo incorrecto."], whenAskHelp: ["Si el archivo contiene datos personales.", "Si el adjunto no aparece."], copySummary: "Destinatario, asunto, mensaje, adjunto y revision final." },
      { id: "guia-turno", title: "Guardar un turno o comprobante", category: "Tramites", goal: "No perder fecha, hora, sede ni numero de tramite.", estimatedTime: "12 minutos", difficulty: "Media", beforeStart: ["Esperar pantalla de confirmacion.", "Tener papel o app de notas si hace falta."], steps: ["Leer fecha, hora y lugar.", "Hacer captura o descargar comprobante.", "Revisar correo de confirmacion.", "Anotar datos principales.", "Guardar archivo con nombre claro.", "Crear recordatorio."], commonMistakes: ["Cerrar pantalla sin guardar.", "Confiar solo en la memoria."], whenAskHelp: ["Si el tramite implica pago o documento.", "Si no aparece comprobante."], copySummary: "Guardar captura/PDF, anotar fecha y crear recordatorio." },
      { id: "guia-link-sospechoso", title: "Revisar un enlace antes de abrir", category: "Seguridad", goal: "Evitar entrar a sitios falsos por apuro.", estimatedTime: "10 minutos", difficulty: "Cuidado", beforeStart: ["No tocar enlaces con urgencia o premio.", "Respirar y revisar."], steps: ["Leer quien envio el mensaje.", "Mirar si pide clave, codigo o pago.", "Revisar direccion del enlace sin abrir si es posible.", "Buscar el sitio oficial por cuenta propia.", "Consultar si hay duda.", "Borrar o reportar si parece fraude."], commonMistakes: ["Abrir porque lo mando un conocido.", "Confiar en logos."], whenAskHelp: ["Si habla de banco, dinero, cuenta bloqueada o deuda.", "Si ya abriste y escribiste datos."], copySummary: "No abrir por apuro: revisar remitente, pedido y sitio oficial." },
      { id: "guia-descarga-pdf", title: "Encontrar un PDF descargado", category: "Archivos", goal: "Ubicar un comprobante descargado en el celular.", estimatedTime: "10 minutos", difficulty: "Basica", beforeStart: ["Recordar fecha aproximada.", "Saber si era PDF o imagen."], steps: ["Abrir Archivos o Mis archivos.", "Entrar en Descargas.", "Ordenar por fecha si se puede.", "Buscar nombre del tramite.", "Abrir y confirmar contenido.", "Renombrar si hace falta."], commonMistakes: ["Descargar varias copias.", "Buscar solo en fotos."], whenAskHelp: ["Si el archivo tiene datos sensibles.", "Si no sabes si se descargo."], copySummary: "Ir a Descargas, buscar por fecha/nombre y renombrar." },
      { id: "guia-pedir-ayuda", title: "Pedir ayuda sin compartir clave", category: "Ayuda segura", goal: "Recibir acompanamiento sin perder control de la cuenta.", estimatedTime: "8 minutos", difficulty: "Basica", beforeStart: ["Elegir persona confiable.", "Tener claro que no se comparten claves."], steps: ["Explicar la tarea.", "Decir en que paso te trabaste.", "Mantener el celular en tu mano.", "No dictar claves ni codigos.", "Pedir que te guien mirando, no que hagan todo.", "Anotar el paso aprendido."], commonMistakes: ["Entregar el celular desbloqueado.", "Mandar claves por chat."], whenAskHelp: ["Si la persona insiste en pedir claves.", "Si hay dinero o datos personales."], copySummary: "Pedir guia paso a paso, sin entregar clave ni codigo." },
      { id: "guia-cerrar-sesion", title: "Cerrar sesion en un equipo compartido", category: "Correo", goal: "Evitar que otra persona quede dentro de tu cuenta.", estimatedTime: "7 minutos", difficulty: "Basica", beforeStart: ["Identificar si estas en computadora ajena.", "No guardar clave."], steps: ["Buscar foto o inicial de la cuenta.", "Tocar cerrar sesion o salir.", "Esperar pantalla de ingreso.", "Cerrar ventana.", "Si hay duda, cambiar clave desde equipo propio.", "Anotar donde usaste la cuenta."], commonMistakes: ["Cerrar la ventana sin salir.", "Aceptar guardar clave."], whenAskHelp: ["Si no aparece cerrar sesion.", "Si crees que alguien entro a tu cuenta."], copySummary: "Salir de la cuenta, no guardar clave y confirmar pantalla de ingreso." }
    ],
    taskAssistant: {
      title: "Asistente de tareas frecuentes",
      description: "Elegir una necesidad cotidiana y abrir la guia o caso mas cercano.",
      calmNotice: "Lee una opcion por vez. Si hay claves, dinero o codigos, detente y pide ayuda segura.",
      recommendationLabel: "Recomendacion sugerida",
      copyLabel: "Copiar recomendacion",
      printLabel: "Imprimir / guardar",
      tasks: [
        { id: "task-enviar-whatsapp", title: "Quiero mandar un WhatsApp", category: "WhatsApp", question: "Necesito escribir a alguien sin equivocarme de contacto.", difficulty: "Basica", recommendedType: "guide", targetId: "guia-whatsapp-mensaje", why: "Ordena verificacion de contacto, mensaje y revision previa.", firstSteps: ["Buscar contacto.", "Revisar numero.", "Escribir una sola idea."], avoid: ["Enviar datos privados.", "Responder a numeros desconocidos."] },
        { id: "task-sacar-captura", title: "Necesito mostrar un error", category: "Celular", question: "Quiero pedir ayuda mostrando que aparece en pantalla.", difficulty: "Basica", recommendedType: "guide", targetId: "guia-captura", why: "Permite guardar evidencia sin exponer informacion privada.", firstSteps: ["Ocultar datos sensibles.", "Hacer captura.", "Revisar antes de enviar."], avoid: ["Mostrar codigos o documentos.", "Mandar capturas completas sin revisar."] },
        { id: "task-turno", title: "Tengo que guardar un turno", category: "Tramites", question: "No quiero perder fecha, hora o comprobante.", difficulty: "Media", recommendedType: "guide", targetId: "guia-turno", why: "Ayuda a conservar comprobante y recordatorio.", firstSteps: ["Esperar confirmacion.", "Capturar o descargar.", "Anotar datos."], avoid: ["Cerrar sin guardar.", "Repetir el tramite sin revisar."] },
        { id: "task-link-raro", title: "Me mandaron un link raro", category: "Seguridad", question: "No se si abrirlo o borrarlo.", difficulty: "Cuidado", recommendedType: "guide", targetId: "guia-link-sospechoso", why: "Prioriza pausa, verificacion y consulta antes de abrir.", firstSteps: ["No tocar el enlace.", "Revisar pedido.", "Buscar sitio oficial."], avoid: ["Abrir por urgencia.", "Escribir claves."] },
        { id: "task-codigo-whatsapp", title: "Me piden un codigo", category: "Seguridad", question: "Un contacto me pide reenviar un codigo que llego por SMS.", difficulty: "Cuidado", recommendedType: "incident", targetId: "alfa-case-1", why: "Es un caso de alto riesgo de robo de cuenta.", firstSteps: ["No compartir codigo.", "Verificar por llamada.", "Revisar seguridad."], avoid: ["Reenviar el codigo.", "Responder por apuro."] },
        { id: "task-correo-adjunto", title: "Tengo que enviar un archivo por correo", category: "Correo", question: "No se como adjuntar o revisar antes de enviar.", difficulty: "Media", recommendedType: "guide", targetId: "guia-correo-adjunto", why: "Ordena destinatario, asunto, adjunto y revision final.", firstSteps: ["Ubicar archivo.", "Redactar correo.", "Adjuntar y revisar."], avoid: ["Enviar sin adjunto.", "Usar destinatario equivocado."] },
        { id: "task-pedir-ayuda", title: "Necesito que alguien me ayude", category: "Ayuda segura", question: "Quiero ayuda sin entregar mi clave.", difficulty: "Basica", recommendedType: "guide", targetId: "guia-pedir-ayuda", why: "Da una forma segura de pedir acompanamiento.", firstSteps: ["Elegir persona confiable.", "Explicar paso donde te trabaste.", "No compartir claves."], avoid: ["Entregar celular desbloqueado.", "Dictar codigos."] },
        { id: "task-pdf", title: "No encuentro un comprobante", category: "Archivos", question: "Creo que descargue un PDF pero no se donde esta.", difficulty: "Basica", recommendedType: "guide", targetId: "guia-descarga-pdf", why: "Ayuda a buscar por carpeta, fecha y nombre.", firstSteps: ["Abrir Archivos.", "Entrar a Descargas.", "Ordenar por fecha."], avoid: ["Descargar muchas copias.", "Mandar archivos sin revisar."] }
      ]
    }
  },
  {
    folder: "android_seguro_principiantes_v0_6_publica",
    shortId: "andsec",
    courseId: "android-seguro-principiantes",
    title: "Android Seguro para Principiantes",
    shortName: "Android Seguro",
    subtitle: "Bloqueo, permisos, apps, cuentas, enlaces sospechosos y respuesta ante incidentes.",
    description: "Aprende a configurar un Android con criterios basicos de seguridad, privacidad y recuperacion sin tecnicismos innecesarios.",
    audience: "Usuarios de Android, familias, personas mayores y principiantes digitales que quieren reducir riesgos cotidianos.",
    portalCategory: "Ciudadania digital",
    practiceArea: "seguridad basica de celulares Android",
    exampleContext: "Un telefono Android recibe enlaces sospechosos, instala apps nuevas y guarda cuentas personales importantes.",
    finalArtifact: "plan de seguridad del celular con ajustes, permisos, copia, recuperacion y respuesta ante incidentes",
    modules: [
      {
        title: "Mapa de seguridad del telefono",
        description: "Reconocer ajustes clave y dejar una base segura antes de instalar, compartir o resolver incidentes.",
        evidence: "mapa de ajustes revisados y estado inicial del telefono",
        criterion: "se identifican bloqueo, actualizaciones, cuenta, permisos y copias",
        deliverable: "diagnostico inicial del Android",
        riskyChoice: "Tocar ajustes sensibles sin entender si borran datos o cambian cuentas.",
        helpTrigger: "Cuando aparece restablecer, borrar datos, cambiar cuenta principal o pago.",
        alert: "Antes de cambiar algo critico, verificar copia y cuenta de recuperacion.",
        lessons: [
          { title: "Pantalla de bloqueo", idea: "PIN, patron, huella o rostro son la primera barrera si se pierde el equipo.", practice: "Revisa tipo de bloqueo y tiempo de bloqueo automatico.", mistake: "Usar patron visible o PIN facil como 1234." },
          { title: "Actualizaciones del sistema", idea: "Las actualizaciones corrigen fallas de seguridad y estabilidad.", practice: "Ubica donde Android muestra version y actualizaciones.", mistake: "Posponer actualizaciones indefinidamente por miedo." },
          { title: "Cuenta de Google vinculada", idea: "La cuenta principal permite recuperar, localizar y proteger el telefono.", practice: "Verifica que la cuenta sea propia y tenga recuperacion.", mistake: "Usar cuenta prestada para un celular personal." },
          { title: "Play Protect y tienda oficial", idea: "Instalar desde fuentes confiables reduce riesgo de apps maliciosas.", practice: "Busca Play Protect y revisa ultimo analisis.", mistake: "Instalar APKs de enlaces enviados por chat." },
          { title: "Copia de seguridad", idea: "Una copia ayuda si se pierde, rompe o cambia el equipo.", practice: "Revisa si fotos, contactos y ajustes tienen copia activada.", mistake: "Descubrir que no habia copia despues de perder el celular." },
          { title: "Datos visibles en bloqueo", idea: "Notificaciones en pantalla bloqueada pueden exponer codigos o mensajes.", practice: "Configura notificaciones sensibles para que no muestren contenido.", mistake: "Mostrar SMS completos con codigos en pantalla bloqueada." }
        ]
      },
      {
        title: "Permisos y privacidad de apps",
        description: "Entender que permisos pide cada app y como reducir acceso innecesario.",
        evidence: "lista de apps con permisos sensibles y decision tomada",
        criterion: "cada permiso sensible tiene razon, limite o revocacion",
        deliverable: "revision de permisos del telefono",
        riskyChoice: "Aceptar todos los permisos para que una app deje de molestar.",
        helpTrigger: "Cuando una app pide accesibilidad, administrador, SMS, ubicacion permanente o datos bancarios.",
        alert: "Un permiso innecesario puede exponer ubicacion, contactos, microfono o archivos.",
        lessons: [
          { title: "Que son permisos", idea: "Los permisos son accesos: camara, microfono, contactos, ubicacion, archivos o notificaciones.", practice: "Elige tres apps y anota que permisos tienen.", mistake: "Pensar que permiso significa seguridad garantizada." },
          { title: "Ubicacion precisa o aproximada", idea: "No todas las apps necesitan saber exactamente donde estas.", practice: "Revisa ubicacion en clima, mapas y redes.", mistake: "Dejar ubicacion precisa siempre activa para apps que no la necesitan." },
          { title: "Camara y microfono", idea: "Estos permisos deben activarse solo para funciones claras.", practice: "Revisa que apps pueden usar camara y microfono.", mistake: "Permitir microfono a apps sin funcion de audio." },
          { title: "Contactos y archivos", idea: "Contactos y archivos pueden exponer informacion de otras personas.", practice: "Revisa apps con acceso a contactos y almacenamiento.", mistake: "Permitir contactos a juegos o apps de dudoso origen." },
          { title: "Permisos de accesibilidad", idea: "Accesibilidad puede controlar pantalla; es util pero sensible.", practice: "Identifica si alguna app tiene permisos de accesibilidad.", mistake: "Activar accesibilidad por instrucciones de un desconocido." },
          { title: "Permisos temporales", idea: "Muchas tareas funcionan con permisos solo mientras se usa la app.", practice: "Cambia un permiso a 'solo al usar' cuando sea razonable.", mistake: "Elegir 'siempre' por comodidad." }
        ]
      },
      {
        title: "Apps confiables y apps sospechosas",
        description: "Instalar, actualizar, revisar y eliminar apps con criterio.",
        evidence: "inventario de apps dudosas, origen y accion tomada",
        criterion: "cada app instalada tiene origen, uso y permisos razonables",
        deliverable: "limpieza basica de apps",
        riskyChoice: "Instalar apps desde anuncios, premios o supuestos soportes.",
        helpTrigger: "Cuando una app pide pago, acceso remoto, claves o permisos de administrador.",
        alert: "Si no sabes para que sirve una app, no la abras para investigar con datos reales.",
        lessons: [
          { title: "Origen de instalacion", idea: "La tienda, el desarrollador y las opiniones ayudan a evaluar confianza.", practice: "Revisa ficha de una app antes de instalar.", mistake: "Instalar desde un boton llamativo de publicidad." },
          { title: "Apps que no uso", idea: "Menos apps reducen permisos, notificaciones y superficie de riesgo.", practice: "Lista apps que no usaste en 60 dias.", mistake: "Conservar apps desconocidas por si acaso." },
          { title: "Desinstalar o desactivar", idea: "Algunas apps se desinstalan; otras solo se desactivan si son del sistema.", practice: "Diferencia desinstalar, desactivar y forzar detencion.", mistake: "Desactivar algo critico sin saber si afecta llamadas o cuenta." },
          { title: "Apps de limpieza milagrosa", idea: "Muchas prometen velocidad y piden permisos excesivos.", practice: "Evalua una app de limpieza por permisos, anuncios y desarrollador.", mistake: "Instalar limpiadores que muestran miedo o alertas falsas." },
          { title: "Acceso remoto", idea: "Apps de control remoto pueden entregar el telefono a otra persona.", practice: "Identifica senales de una app de asistencia remota.", mistake: "Instalar control remoto por indicacion de un supuesto banco." },
          { title: "Actualizaciones de apps", idea: "Actualizar desde tienda oficial corrige fallas y evita versiones falsas.", practice: "Revisa actualizaciones pendientes en Play Store.", mistake: "Actualizar desde enlaces externos." }
        ]
      },
      {
        title: "Mensajes, enlaces y descargas",
        description: "Reconocer fraudes por SMS, WhatsApp, correo, QR y navegador.",
        evidence: "analisis de mensaje sospechoso con senales de riesgo",
        criterion: "se decide abrir, verificar o detener segun senales observables",
        deliverable: "matriz simple de enlaces sospechosos",
        riskyChoice: "Abrir enlaces por urgencia, premio o amenaza.",
        helpTrigger: "Cuando el mensaje habla de banco, deuda, cuenta bloqueada, paquete, premio o codigo.",
        alert: "Un enlace puede parecer conocido y llevar a un sitio falso.",
        lessons: [
          { title: "Dominios y direcciones", idea: "La direccion del sitio importa mas que el logo.", practice: "Compara dominio oficial y dominio sospechoso.", mistake: "Confiar en colores o logos parecidos." },
          { title: "Urgencia y miedo", idea: "El fraude presiona para que no pienses.", practice: "Subraya palabras de urgencia en mensajes simulados.", mistake: "Responder antes de confirmar por otro canal." },
          { title: "QR desconocidos", idea: "Un QR es un enlace escondido: hay que revisar destino.", practice: "Define cuando escanear y cuando no.", mistake: "Escanear QR pegados en lugares publicos sin verificar." },
          { title: "Descargas del navegador", idea: "Archivos descargados pueden ser utiles o peligrosos.", practice: "Revisa nombre, origen y extension de una descarga.", mistake: "Abrir archivos ejecutables o raros enviados por chat." },
          { title: "SMS de supuesta entrega", idea: "Mensajes de paquetes son una excusa frecuente para robar datos.", practice: "Escribe pasos para verificar una entrega desde fuente oficial.", mistake: "Pagar una tasa por enlace recibido." },
          { title: "Reportar y borrar", idea: "Reportar ayuda a cortar fraude y borrar reduce tentacion.", practice: "Ubica opciones de reportar en mensajes o WhatsApp.", mistake: "Seguir conversando con quien presiona." }
        ]
      },
      {
        title: "Cuentas, verificacion y recuperacion",
        description: "Proteger Google, WhatsApp y cuentas importantes con recuperacion y doble verificacion.",
        evidence: "estado de recuperacion y verificacion de cuentas principales",
        criterion: "cada cuenta importante tiene recuperacion propia y verificacion adecuada",
        deliverable: "plan de proteccion de cuentas",
        riskyChoice: "Usar una sola clave repetida o compartir codigos.",
        helpTrigger: "Cuando se pierde acceso, aparece inicio de sesion desconocido o piden codigos.",
        alert: "El codigo de verificacion sirve para entrar: no se reenvia.",
        lessons: [
          { title: "Clave fuerte y unica", idea: "Repetir clave permite que un problema se vuelva muchos.", practice: "Identifica cuentas donde nunca deberias repetir clave.", mistake: "Usar la misma clave para correo, banco y redes." },
          { title: "Verificacion en dos pasos", idea: "Agrega una segunda barrera aunque alguien sepa la clave.", practice: "Revisa donde se activa en Google o WhatsApp.", mistake: "Guardar codigos de respaldo en un chat visible." },
          { title: "Metodos de recuperacion", idea: "Telefono y correo alternativo deben estar actualizados.", practice: "Verifica recuperacion de cuenta principal.", mistake: "Mantener un numero viejo que ya no usas." },
          { title: "Dispositivos conectados", idea: "Las cuentas muestran donde estan abiertas.", practice: "Revisa sesiones activas y cierra desconocidas.", mistake: "Ignorar avisos de inicio de sesion." },
          { title: "WhatsApp en otros dispositivos", idea: "WhatsApp Web y dispositivos vinculados deben revisarse.", practice: "Mira dispositivos vinculados y cierra los que no reconozcas.", mistake: "Dejar abierto WhatsApp en una computadora compartida." },
          { title: "Administrador de contrasenas", idea: "Guardar claves de forma segura es mejor que repetir o anotar mal.", practice: "Compara memoria, papel visible y gestor integrado.", mistake: "Mandarse claves por mensaje." }
        ]
      },
      {
        title: "Respuesta ante perdida o sospecha",
        description: "Actuar con calma ante robo, perdida, cuenta tomada o app peligrosa.",
        evidence: "plan de emergencia con pasos, contactos y evidencia",
        criterion: "se prioriza bloquear dano, preservar evidencia y recuperar control",
        deliverable: "protocolo personal de emergencia Android",
        riskyChoice: "Borrar todo o confrontar sin preservar evidencia.",
        helpTrigger: "Siempre que haya perdida de equipo, dinero, amenazas, extorsion o acceso no autorizado.",
        alert: "En emergencias reales, priorizar cuentas, dinero y seguridad personal.",
        lessons: [
          { title: "Perdi el telefono", idea: "El orden importa: localizar, bloquear, avisar y proteger cuentas.", practice: "Escribe pasos si pierdes el equipo hoy.", mistake: "Esperar muchas horas para bloquear por si aparece." },
          { title: "Cuenta sospechosa", idea: "Un aviso de acceso desconocido requiere cambiar clave y cerrar sesiones.", practice: "Define que haras ante un inicio de sesion no reconocido.", mistake: "Ignorar el correo de alerta." },
          { title: "App maliciosa posible", idea: "No siempre hay que abrir la app para confirmar; se revisan permisos y origen.", practice: "Prepara pasos para app desconocida.", mistake: "Dar permisos para ver si se arregla." },
          { title: "Banco o billetera en riesgo", idea: "Si hay dinero involucrado, se contacta canal oficial y se bloquea rapido.", practice: "Anota canales oficiales de tu banco o billetera.", mistake: "Seguir instrucciones de un numero recibido por chat." },
          { title: "Preservar evidencia", idea: "Capturas, fechas y mensajes ayudan a soporte o denuncia.", practice: "Crea formato de registro de incidente.", mistake: "Borrar mensajes por verguenza antes de pedir ayuda." },
          { title: "Despues del incidente", idea: "La recuperacion incluye revisar permisos, claves, copias y aprendizajes.", practice: "Arma checklist de revision posterior.", mistake: "Cambiar una clave y no revisar el resto." }
        ]
      }
    ],
    cases: [
      { title: "SMS de paquete retenido", summary: "Un SMS pide pagar una tasa para liberar una entrega.", goal: "Evitar pago y robo de datos.", trigger: "link corto y urgencia por paquete", courseAction: "no abrir, verificar en sitio oficial de correo o comercio", evidence: "captura del SMS y dominio sospechoso", error: "Pagar desde el enlace recibido.", aftercare: "Guardar regla para entregas: verificar desde fuente oficial." },
      { title: "App de acceso remoto indicada por supuesto soporte", summary: "Una llamada pide instalar una app para solucionar un problema bancario.", goal: "Detener posible control del telefono.", trigger: "pedido de instalar app y compartir pantalla", courseAction: "cortar comunicacion, no instalar y llamar al canal oficial", evidence: "numero, app solicitada y hora", error: "Instalar para que el soporte vea la pantalla.", aftercare: "Bloquear numero y revisar apps instaladas." },
      { title: "Telefono perdido en transporte", summary: "El equipo tiene cuentas abiertas y notificaciones visibles.", goal: "Bloquear equipo y proteger cuentas.", trigger: "perdida fisica del celular", courseAction: "usar localizar, bloquear, cerrar sesiones y avisar a operadora si hace falta", evidence: "hora, lugar y acciones realizadas", error: "Esperar al dia siguiente sin bloquear.", aftercare: "Revisar bloqueo automatico y copia." },
      { title: "WhatsApp vinculado en computadora desconocida", summary: "Aparece una sesion que la persona no reconoce.", goal: "Cerrar sesion y revisar verificacion.", trigger: "dispositivo vinculado sospechoso", courseAction: "cerrar dispositivo, activar verificacion y avisar contactos si hubo mensajes raros", evidence: "nombre del dispositivo y hora", error: "Ignorar porque WhatsApp sigue funcionando.", aftercare: "Revisar dispositivos vinculados mensualmente." },
      { title: "Permiso de ubicacion siempre activo", summary: "Una app simple registra ubicacion permanente.", goal: "Limitar permiso al uso real.", trigger: "permiso de ubicacion 'siempre'", courseAction: "cambiar permiso, evaluar necesidad y desinstalar si no corresponde", evidence: "permiso antes y despues", error: "Dejar permiso siempre por comodidad.", aftercare: "Revisar permisos sensibles cada mes." },
      { title: "Anuncio de limpieza con alerta falsa", summary: "Una pagina dice que el telefono tiene virus y ofrece app.", goal: "Evitar instalacion por miedo.", trigger: "alerta del navegador con boton llamativo", courseAction: "cerrar pestana, no instalar y revisar Play Protect", evidence: "captura de alerta si no expone datos", error: "Instalar la app sugerida por la alerta.", aftercare: "Evitar sitios con ventanas agresivas." },
      { title: "Codigo de verificacion pedido por contacto conocido", summary: "Un amigo pide reenviar un codigo para recuperar su cuenta.", goal: "Proteger cuenta propia.", trigger: "pedido de codigo por chat", courseAction: "no reenviar, verificar por llamada y reportar si sospecha", evidence: "mensaje recibido", error: "Enviar el codigo por confianza.", aftercare: "Activar verificacion en dos pasos." },
      { title: "App desconocida con permiso de accesibilidad", summary: "Una app tiene permiso sensible y no se reconoce.", goal: "Reducir riesgo sin borrar evidencia.", trigger: "permiso de accesibilidad activo", courseAction: "desactivar permiso, identificar app y pedir ayuda si hay dinero/cuentas", evidence: "nombre, permiso y fecha", error: "Abrir la app y darle mas permisos.", aftercare: "Revisar apps instaladas recientemente." }
    ]
  },
  {
    folder: "atencion_cliente_whatsapp_redes_v0_6_publica",
    shortId: "atcli",
    courseId: "atencion-cliente-whatsapp-redes",
    title: "Atencion al Cliente por WhatsApp y Redes",
    shortName: "Atencion WhatsApp",
    subtitle: "Tono, tiempos, etiquetas, respuestas rapidas, reclamos, escalamiento y seguimiento.",
    description: "Curso practico para ordenar la atencion digital de un comercio o emprendimiento sin perder conversaciones ni calidad.",
    audience: "Comercios, emprendedores, community managers iniciales y equipos chicos que atienden por WhatsApp, Instagram o Facebook.",
    portalCategory: "Atencion al cliente",
    practiceArea: "operacion de atencion digital en canales conversacionales",
    exampleContext: "Un comercio recibe consultas por stock, precios, envios y reclamos en varios chats al mismo tiempo.",
    finalArtifact: "manual breve de atencion con flujo, etiquetas, respuestas, escalamiento y metricas",
    modules: [
      {
        title: "Base de servicio y promesa de respuesta",
        description: "Definir que se atiende, en que horario, con que tono y que casos se escalan.",
        evidence: "promesa de atencion, horario, tono y limites publicados",
        criterion: "el cliente entiende cuando recibira respuesta y que informacion debe enviar",
        deliverable: "acuerdo basico de atencion digital",
        riskyChoice: "Prometer respuesta inmediata en todos los canales sin capacidad real.",
        helpTrigger: "Cuando un reclamo puede afectar dinero, garantia, datos personales o reputacion publica.",
        alert: "Atender rapido no significa responder sin verificar.",
        lessons: [
          { title: "Objetivo del canal", idea: "Cada canal debe tener una funcion: consulta, venta, soporte, reclamo o seguimiento.", practice: "Define para que se usa WhatsApp y para que redes.", mistake: "Atender todo por cualquier canal sin orden." },
          { title: "Horario y expectativa", idea: "Decir horarios reduce ansiedad y reclamos repetidos.", practice: "Redacta mensaje de horario y tiempo estimado de respuesta.", mistake: "Dejar visto sin explicar cuando se respondera." },
          { title: "Tono de marca", idea: "El tono debe ser humano, claro y consistente sin sonar automatico.", practice: "Escribe version cordial, neutra y disculpa para un mismo caso.", mistake: "Responder con ironia o informalidad excesiva ante reclamos." },
          { title: "Datos minimos para atender", idea: "Pedir pocos datos correctos acelera la respuesta.", practice: "Lista datos necesarios para stock, envio y reclamo.", mistake: "Pedir DNI o datos sensibles cuando no hacen falta." },
          { title: "Limites de resolucion", idea: "El equipo debe saber que puede resolver y que debe derivar.", practice: "Marca casos simples, casos con autorizacion y casos de escalamiento.", mistake: "Prometer devoluciones o descuentos sin permiso." },
          { title: "Cierre de conversacion", idea: "Cerrar confirma que la persona entendio y sabe el proximo paso.", practice: "Redacta cierres para venta, reclamo y consulta informativa.", mistake: "Terminar la conversacion sin confirmar si queda algo pendiente." }
        ]
      },
      {
        title: "WhatsApp Business ordenado",
        description: "Configurar perfil, etiquetas, respuestas rapidas y catalogo para reducir repeticion.",
        evidence: "perfil completo, etiquetas activas y tres respuestas rapidas probadas",
        criterion: "el canal permite encontrar conversaciones y responder preguntas frecuentes",
        deliverable: "configuracion inicial de WhatsApp Business",
        riskyChoice: "Usar WhatsApp personal mezclado con atencion comercial sin respaldo.",
        helpTrigger: "Cuando se manejan pedidos, pagos, datos de clientes o varios operadores.",
        alert: "No usar etiquetas como reemplazo de seguimiento real.",
        lessons: [
          { title: "Perfil comercial", idea: "Nombre, descripcion, direccion, horario y enlaces reducen preguntas repetidas.", practice: "Completa una ficha de perfil comercial.", mistake: "Dejar datos desactualizados o incompletos." },
          { title: "Mensaje de bienvenida", idea: "Un buen inicio orienta y pide datos minimos.", practice: "Redacta bienvenida para consulta de producto.", mistake: "Mandar un texto largo que nadie lee." },
          { title: "Mensaje de ausencia", idea: "Cuando no se atiende, el canal debe explicarlo.", practice: "Configura un texto de ausencia con horario y urgencias.", mistake: "Simular disponibilidad permanente." },
          { title: "Etiquetas utiles", idea: "Las etiquetas deben reflejar estado de gestion, no gustos personales.", practice: "Crea etiquetas: nuevo, esperando dato, presupuestado, resuelto.", mistake: "Tener demasiadas etiquetas parecidas." },
          { title: "Respuestas rapidas", idea: "Plantillas ahorran tiempo si se personalizan.", practice: "Escribe atajos para precio, envio y reclamo.", mistake: "Enviar plantilla sin leer la pregunta real." },
          { title: "Catalogo y enlaces", idea: "Un catalogo claro evita enviar fotos repetidas y precios contradictorios.", practice: "Define datos minimos de producto: nombre, precio, stock, condicion.", mistake: "Tener catalogo vencido y prometer stock inexistente." }
        ]
      },
      {
        title: "Flujo de conversacion",
        description: "Pasar de saludo a diagnostico, respuesta, accion y cierre sin perder contexto.",
        evidence: "flujo de atencion con preguntas, decisiones y cierres",
        criterion: "cada conversacion tiene estado claro y siguiente accion",
        deliverable: "mapa de flujo conversacional",
        riskyChoice: "Responder cada mensaje aislado sin mirar historial.",
        helpTrigger: "Cuando el cliente esta molesto, hay dinero de por medio o falta informacion critica.",
        alert: "La primera respuesta debe ordenar, no solo saludar.",
        lessons: [
          { title: "Saludo con contexto", idea: "Saludar y reconocer el motivo evita respuestas roboticas.", practice: "Transforma 'hola' en una apertura con pregunta util.", mistake: "Pedir otra vez datos que el cliente ya envio." },
          { title: "Diagnostico en pocas preguntas", idea: "Preguntar bien reduce ida y vuelta.", practice: "Crea tres preguntas para resolver envio demorado.", mistake: "Hacer cinco preguntas separadas en cinco mensajes." },
          { title: "Respuesta clara y accionable", idea: "La respuesta debe decir estado, opcion y proximo paso.", practice: "Escribe respuesta para producto sin stock con alternativa.", mistake: "Responder 'no hay' sin alternativa ni fecha." },
          { title: "Manejo de espera", idea: "Si falta verificar, se informa plazo y responsable.", practice: "Redacta mensaje de espera de 30 minutos.", mistake: "Dejar al cliente sin novedad mientras se consulta internamente." },
          { title: "Confirmacion de datos", idea: "Antes de enviar, cobrar o reservar se confirma lo importante.", practice: "Arma mensaje de confirmacion de pedido.", mistake: "Tomar datos por supuestos y generar errores." },
          { title: "Cierre y seguimiento", idea: "El cierre deja claro si el caso termino o sigue pendiente.", practice: "Redacta cierre para reclamo resuelto y para pendiente.", mistake: "Cerrar por silencio sin documentar estado." }
        ]
      },
      {
        title: "Redes sociales y comentarios publicos",
        description: "Distinguir respuesta publica, mensaje privado, moderacion y escalamiento.",
        evidence: "criterio de respuesta para comentarios, DMs y reclamos publicos",
        criterion: "cada interaccion publica protege datos y reputacion",
        deliverable: "guia de manejo de comentarios y mensajes",
        riskyChoice: "Discutir publicamente con clientes o pedir datos privados en comentarios.",
        helpTrigger: "Cuando hay acusaciones publicas, amenazas, discriminacion, salud, seguridad o dinero.",
        alert: "Lo publico se responde con cuidado: nunca exponer datos del cliente.",
        lessons: [
          { title: "Responder en publico o privado", idea: "En publico se orienta; en privado se toman datos.", practice: "Clasifica diez mensajes como publico, privado o escalar.", mistake: "Pedir numero de pedido o telefono en comentarios." },
          { title: "Comentarios negativos", idea: "Un reclamo publico necesita reconocer, ordenar y mover a canal adecuado.", practice: "Redacta respuesta a comentario de demora.", mistake: "Defenderse atacando al cliente." },
          { title: "Mensajes repetidos", idea: "La repeticion se gestiona con informacion fija y seguimiento.", practice: "Crea respuesta para pregunta frecuente de horarios.", mistake: "Responder distinto cada vez y generar contradicciones." },
          { title: "Moderacion basica", idea: "Hay diferencia entre queja valida, spam, insulto y amenaza.", practice: "Define cuando ocultar, bloquear, responder o guardar evidencia.", mistake: "Borrar reclamos validos para que no se vean." },
          { title: "Escalamiento interno", idea: "Un caso publico delicado debe llegar a quien puede decidir.", practice: "Define ruta: quien revisa, plazo y mensaje puente.", mistake: "Dejar que cada operador improvise." },
          { title: "Consistencia entre canales", idea: "WhatsApp, Instagram y Facebook deben decir lo mismo sobre precios, horarios y politicas.", practice: "Compara una respuesta de cada canal y corrige diferencias.", mistake: "Actualizar un canal y olvidar los otros." }
        ]
      },
      {
        title: "Reclamos, conflictos y datos sensibles",
        description: "Atender reclamos con evidencia, respeto, limites y cuidado de informacion personal.",
        evidence: "registro de reclamo con datos minimos, evidencia y accion acordada",
        criterion: "el reclamo queda documentado sin exponer datos innecesarios",
        deliverable: "protocolo de reclamos digitales",
        riskyChoice: "Resolver por impulso sin revisar politica, comprobante o autorizacion.",
        helpTrigger: "Cuando hay devolucion, garantia, cobro, datos personales, amenaza o posible denuncia.",
        alert: "Un reclamo no se gana discutiendo; se gestiona con datos y respeto.",
        lessons: [
          { title: "Escuchar y resumir", idea: "Resumir muestra comprension y evita repetir el problema.", practice: "Escribe resumen de un reclamo en una frase.", mistake: "Responder con explicaciones antes de entender." },
          { title: "Pedir evidencia minima", idea: "Se pide lo necesario para resolver, no todo lo disponible.", practice: "Define datos minimos para reclamo de envio.", mistake: "Pedir fotos de documentos sin necesidad." },
          { title: "Politicas claras", idea: "Cambios, devoluciones y garantias deben poder explicarse sin improvisar.", practice: "Redacta version breve de una politica.", mistake: "Prometer excepciones sin registrar autorizacion." },
          { title: "Disculpa responsable", idea: "Disculparse no implica inventar culpa; implica reconocer impacto y accion.", practice: "Escribe disculpa con proximo paso y plazo.", mistake: "Decir 'no es mi culpa' al cliente." },
          { title: "Clientes agresivos", idea: "El limite protege al equipo y mantiene evidencia.", practice: "Redacta mensaje ante insultos y criterio de bloqueo.", mistake: "Responder en el mismo tono." },
          { title: "Datos sensibles", idea: "Direcciones, telefonos, comprobantes y pagos requieren canal y resguardo.", practice: "Marca que datos no deben pedirse por comentario publico.", mistake: "Copiar datos de clientes en grupos sin control." }
        ]
      },
      {
        title: "Metricas y mejora continua",
        description: "Medir tiempos, temas frecuentes, resolucion y calidad para mejorar la atencion.",
        evidence: "tablero simple de temas, tiempos, estado y aprendizajes",
        criterion: "las metricas llevan a una mejora concreta del servicio",
        deliverable: "plan semanal de mejora de atencion",
        riskyChoice: "Medir solo cantidad de mensajes y no resolucion real.",
        helpTrigger: "Cuando hay saturacion, muchos reclamos repetidos o caida de reputacion.",
        alert: "Una metrica que no cambia decisiones es decorativa.",
        lessons: [
          { title: "Tiempo de primera respuesta", idea: "Mide cuanto espera el cliente para saber que fue recibido.", practice: "Calcula tiempo promedio de cinco conversaciones.", mistake: "Medir solo cuando el equipo responde rapido." },
          { title: "Estado de conversaciones", idea: "Nuevo, en espera, resuelto y escalado dan control operativo.", practice: "Etiqueta diez conversaciones simuladas.", mistake: "Dejar chats sin estado y depender de memoria." },
          { title: "Temas frecuentes", idea: "Las preguntas repetidas indican que falta informacion o plantilla.", practice: "Agrupa 20 consultas en cinco temas.", mistake: "Responder repetido sin corregir causa." },
          { title: "Calidad de respuesta", idea: "Una respuesta buena es clara, correcta, cordial y accionable.", practice: "Evalua tres respuestas con una rubrica simple.", mistake: "Premiar solo velocidad." },
          { title: "Base de conocimiento", idea: "Cada problema repetido puede convertirse en respuesta, guia o politica.", practice: "Escribe una ficha de conocimiento para envio.", mistake: "Guardar aprendizaje solo en la cabeza de una persona." },
          { title: "Revision semanal", idea: "Una reunion corta permite ajustar plantillas y escalamientos.", practice: "Planifica 20 minutos de revision semanal.", mistake: "Esperar crisis para mejorar." }
        ]
      }
    ],
    cases: [
      { title: "Cliente reclama demora en publico", summary: "Un comentario en Instagram acusa al comercio de no responder.", goal: "Responder sin discutir y mover a canal privado.", trigger: "reclamo visible en comentario publico", courseAction: "reconocer, pedir DM sin datos sensibles y registrar caso", evidence: "captura del comentario y respuesta publica", error: "Responder culpando al cliente.", aftercare: "Revisar tiempos de respuesta del canal." },
      { title: "Pedido con direccion incompleta", summary: "El envio no puede salir porque faltan datos.", goal: "Pedir dato minimo y confirmar antes de despachar.", trigger: "direccion incompleta", courseAction: "solicitar dato faltante por privado y confirmar pedido", evidence: "mensaje con dato corregido y confirmacion", error: "Enviar igual por apuro.", aftercare: "Agregar plantilla de confirmacion de envio." },
      { title: "Consulta de precio repetida veinte veces", summary: "El equipo responde lo mismo todo el dia.", goal: "Crear respuesta rapida y actualizar catalogo.", trigger: "pregunta frecuente sin informacion visible", courseAction: "crear plantilla y revisar donde falta precio", evidence: "cantidad de consultas y nueva respuesta", error: "Responder manualmente cada vez sin mejorar causa.", aftercare: "Actualizar catalogo y destacadas." },
      { title: "Cliente envia comprobante con datos sensibles", summary: "El chat contiene imagen con datos que no hacen falta.", goal: "Reducir exposicion y definir manejo seguro.", trigger: "comprobante con datos personales", courseAction: "pedir solo dato necesario y evitar reenviar a grupos", evidence: "registro anonimo del caso", error: "Compartir captura completa con todo el equipo.", aftercare: "Definir politica de datos en reclamos." },
      { title: "Operador promete descuento sin autorizacion", summary: "Para calmar un reclamo se ofrece algo que no estaba permitido.", goal: "Escalar decisiones comerciales sensibles.", trigger: "promesa improvisada", courseAction: "registrar, consultar responsable y responder con plazo", evidence: "mensaje enviado y autorizacion requerida", error: "Resolver para cerrar rapido.", aftercare: "Crear tabla de decisiones autorizadas." },
      { title: "Mensaje agresivo por WhatsApp", summary: "Un cliente insulta repetidamente al equipo.", goal: "Mantener limite y evidencia.", trigger: "agresion verbal en chat", courseAction: "responder una vez con limite, guardar evidencia y escalar", evidence: "capturas y horario", error: "Responder con insultos o ironia.", aftercare: "Definir protocolo de bloqueo." },
      { title: "Stock informado distinto en redes y WhatsApp", summary: "Un canal dice disponible y otro dice agotado.", goal: "Unificar informacion y disculparse con accion.", trigger: "datos contradictorios entre canales", courseAction: "corregir catalogo, avisar alternativa y actualizar plantillas", evidence: "capturas de ambos canales", error: "Decir que fue error del cliente.", aftercare: "Revisar stock publicado diariamente." },
      { title: "Caso queda sin responsable", summary: "Tres personas respondieron pero nadie cerro el reclamo.", goal: "Asignar estado y responsable.", trigger: "conversacion larga sin cierre", courseAction: "resumir historial, asignar responsable y definir proximo paso", evidence: "estado, responsable y plazo", error: "Seguir agregando respuestas sin decision.", aftercare: "Usar etiquetas de estado obligatorias." }
    ]
  },
  {
    folder: "automatizacion_ia_tareas_v0_6_publica",
    shortId: "autoia",
    courseId: "automatizacion-ia-tareas",
    title: "Automatizacion con IA para Tareas Repetitivas",
    shortName: "Automatizacion IA",
    subtitle: "Mapeo de procesos, prompts, documentos, tablas, flujos, privacidad y control humano.",
    description: "Curso practico para detectar tareas repetitivas, automatizarlas con IA de forma controlada y medir si realmente ahorran tiempo.",
    audience: "Trabajadores, emprendedores, equipos administrativos y personas que quieren mejorar rutinas sin perder control.",
    portalCategory: "Trabajo e IA",
    practiceArea: "automatizacion responsable de tareas operativas con IA",
    exampleContext: "Un equipo copia datos entre correos, planillas y mensajes, y quiere ahorrar tiempo sin exponer informacion sensible.",
    finalArtifact: "flujo automatizado documentado con entrada, salida, control humano, riesgos y metrica de ahorro",
    modules: [
      {
        title: "Elegir la tarea correcta",
        description: "Separar tareas repetitivas, tareas de juicio humano y tareas que no conviene automatizar.",
        evidence: "mapa de proceso con pasos, frecuencia, datos y riesgo",
        criterion: "la tarea tiene reglas claras, bajo riesgo y resultado verificable",
        deliverable: "matriz de oportunidad de automatizacion",
        riskyChoice: "Automatizar una decision sensible sin control humano.",
        helpTrigger: "Cuando la tarea afecta dinero, salud, datos personales, contratos o derechos.",
        alert: "No todo lo repetitivo debe automatizarse; algunas tareas requieren criterio humano.",
        lessons: [
          { title: "Inventario de tareas repetitivas", idea: "Primero se observa el trabajo real antes de elegir herramientas.", practice: "Lista diez tareas, frecuencia y tiempo aproximado.", mistake: "Elegir una herramienta antes de entender el proceso." },
          { title: "Entrada, transformacion y salida", idea: "Toda automatizacion recibe algo, lo transforma y entrega algo.", practice: "Dibuja esos tres bloques para una tarea administrativa.", mistake: "No definir que salida se considera correcta." },
          { title: "Reglas claras o criterio humano", idea: "La IA ayuda mas cuando el criterio puede explicarse y revisarse.", practice: "Marca pasos con regla y pasos con juicio.", mistake: "Delegar aprobaciones sensibles a una respuesta automatica." },
          { title: "Volumen y frecuencia", idea: "Automatizar tiene costo; conviene si la tarea se repite lo suficiente.", practice: "Calcula minutos por semana de una tarea.", mistake: "Automatizar algo que se hace una vez al mes." },
          { title: "Riesgo de datos", idea: "Datos personales, clientes y finanzas cambian el nivel de cuidado.", practice: "Clasifica datos de una tarea como publicos, internos o sensibles.", mistake: "Pegar bases reales en herramientas sin evaluar privacidad." },
          { title: "Criterio de exito", idea: "Ahorrar tiempo no alcanza si aumenta error o riesgo.", practice: "Define metrica: tiempo, errores, retrabajo y satisfaccion.", mistake: "Medir exito solo por novedad de la IA." }
        ]
      },
      {
        title: "Prompts de trabajo verificables",
        description: "Escribir instrucciones que produzcan salidas claras, comparables y revisables.",
        evidence: "prompt con contexto, tarea, formato, restricciones y ejemplo",
        criterion: "otra persona puede usar el prompt y obtener una salida controlable",
        deliverable: "biblioteca inicial de prompts operativos",
        riskyChoice: "Pedir respuestas abiertas para tareas que necesitan formato fijo.",
        helpTrigger: "Cuando el resultado se enviara a clientes, jefatura, organismos o publico.",
        alert: "La IA puede sonar segura y estar equivocada.",
        lessons: [
          { title: "Contexto minimo", idea: "Un buen prompt dice rol, objetivo, publico y datos disponibles.", practice: "Reescribe un prompt vago agregando contexto.", mistake: "Pedir 'mejoralo' sin explicar para quien ni para que." },
          { title: "Formato de salida", idea: "Tablas, listas, JSON o pasos reducen ambiguedad.", practice: "Pide una respuesta en tabla con columnas definidas.", mistake: "Aceptar parrafos largos cuando necesitas copiar a planilla." },
          { title: "Restricciones y limites", idea: "Decir que no debe hacer la IA evita excesos.", practice: "Agrega restricciones: no inventar datos, marcar dudas, pedir faltantes.", mistake: "Permitir que complete informacion desconocida." },
          { title: "Ejemplos de entrada y salida", idea: "Un ejemplo enseña estilo y estructura.", practice: "Incluye un ejemplo corto antes de pedir diez casos.", mistake: "Dar ejemplos con datos reales sensibles." },
          { title: "Checklist de revision", idea: "Cada salida de IA necesita una revision definida.", practice: "Crea checklist: exactitud, tono, datos, fuente y accion.", mistake: "Copiar y pegar sin leer." },
          { title: "Versionar prompts", idea: "Si un prompt mejora, conviene guardar version y cambio.", practice: "Nombra prompt v1, v2 y explica que cambio.", mistake: "Editar sin conservar la version que funcionaba." }
        ]
      },
      {
        title: "Documentos, correos y textos repetidos",
        description: "Automatizar borradores, resumenes, respuestas y plantillas sin perder tono ni control.",
        evidence: "plantilla de texto con revision humana y criterios de calidad",
        criterion: "el texto final conserva datos correctos, tono adecuado y aprobacion humana",
        deliverable: "flujo de borrador y revision",
        riskyChoice: "Enviar textos generados sin revisar datos, tono o promesas.",
        helpTrigger: "Cuando el texto tiene valor legal, comercial, medico, financiero o publico.",
        alert: "La IA redacta borradores; la responsabilidad del envio sigue siendo humana.",
        lessons: [
          { title: "Responder correos frecuentes", idea: "La IA puede armar borradores desde datos estructurados.", practice: "Crea prompt para responder consulta de horario con tono cordial.", mistake: "Enviar promesas o descuentos inventados." },
          { title: "Resumir conversaciones", idea: "Un resumen util separa hechos, pendientes y decisiones.", practice: "Resume un chat simulado en tres bloques.", mistake: "Borrar matices importantes por resumir demasiado." },
          { title: "Convertir notas en acta", idea: "Las notas crudas pueden transformarse en acuerdos y tareas.", practice: "Pide acta con responsables y fechas.", mistake: "Agregar responsables que no fueron acordados." },
          { title: "Plantillas con variables", idea: "Nombre, fecha, pedido y estado pueden insertarse de forma controlada.", practice: "Define variables para respuesta de envio.", mistake: "Mezclar datos de dos clientes." },
          { title: "Tono y marca", idea: "La automatizacion debe sonar consistente con la organizacion.", practice: "Define tres reglas de tono y prueba un borrador.", mistake: "Usar tono exagerado o frio segun salida aleatoria." },
          { title: "Control antes de enviar", idea: "Un paso humano final evita errores visibles.", practice: "Disena una revision de 60 segundos antes de enviar.", mistake: "Programar envio automatico sin aprobacion para casos sensibles." }
        ]
      },
      {
        title: "Tablas, datos y pequenas operaciones",
        description: "Usar IA para limpiar, clasificar, resumir y preparar datos con trazabilidad.",
        evidence: "tabla de prueba con cambios, supuestos y validacion",
        criterion: "cada transformacion puede explicarse y revisarse con muestra",
        deliverable: "procedimiento de limpieza asistida",
        riskyChoice: "Procesar datos reales sensibles en herramientas no evaluadas.",
        helpTrigger: "Cuando hay datos personales, financieros, laborales o confidenciales.",
        alert: "Antes de pegar datos, quitar o simular informacion sensible.",
        lessons: [
          { title: "Preparar datos de prueba", idea: "Datos simulados permiten aprender sin exponer informacion.", practice: "Crea una tabla ficticia con 10 filas.", mistake: "Copiar base real completa en una herramienta externa." },
          { title: "Clasificar registros", idea: "La IA puede sugerir categorias, pero hay que revisar criterios.", practice: "Clasifica consultas por tema y revisa errores.", mistake: "Aceptar categorias sin definicion." },
          { title: "Limpiar textos", idea: "Normalizar mayusculas, espacios y nombres mejora uso posterior.", practice: "Pide reglas de limpieza y muestra antes/despues.", mistake: "Cambiar datos originales sin copia." },
          { title: "Extraer campos", idea: "Desde textos se pueden extraer fecha, pedido, estado o prioridad.", practice: "Extrae datos de cinco mensajes simulados.", mistake: "No marcar campos dudosos." },
          { title: "Validar muestras", idea: "Revisar una muestra detecta errores antes de aplicar masivamente.", practice: "Compara 10 resultados contra criterio humano.", mistake: "Procesar 1000 filas sin prueba pequena." },
          { title: "Registrar supuestos", idea: "La automatizacion necesita dejar claro que asumio.", practice: "Escribe supuestos usados para clasificar.", mistake: "Ocultar dudas para que el resultado parezca perfecto." }
        ]
      },
      {
        title: "Flujos no-code y aprobaciones",
        description: "Conectar pasos entre herramientas manteniendo control de errores, permisos y aprobaciones.",
        evidence: "diagrama de flujo con disparador, acciones, validaciones y fallback",
        criterion: "el flujo tiene punto de inicio, salida, control de error y responsable",
        deliverable: "prototipo de flujo automatizado",
        riskyChoice: "Conectar cuentas reales sin probar con datos de ejemplo.",
        helpTrigger: "Cuando el flujo envia mensajes, modifica bases, cobra, publica o borra archivos.",
        alert: "Automatizar sin fallback convierte un error chico en error repetido.",
        lessons: [
          { title: "Disparadores", idea: "Un flujo empieza por evento: formulario, correo, fila nueva o horario.", practice: "Define disparador para seguimiento de consultas.", mistake: "No saber que evento activo la automatizacion." },
          { title: "Acciones encadenadas", idea: "Cada accion debe recibir datos correctos del paso anterior.", practice: "Dibuja tres acciones: recibir, clasificar, avisar.", mistake: "Conectar campos sin verificar nombres." },
          { title: "Aprobacion humana", idea: "Algunas salidas deben esperar revision antes de enviarse.", practice: "Agrega paso de aprobar borrador.", mistake: "Enviar automatico a clientes sin revision." },
          { title: "Pruebas con muestra", idea: "Un flujo se prueba con pocos casos antes de operar.", practice: "Prepara tres casos: normal, incompleto y error.", mistake: "Activar en produccion con datos reales de entrada." },
          { title: "Manejo de errores", idea: "Debe quedar claro que pasa si falta un dato o falla una herramienta.", practice: "Define mensaje de error y responsable.", mistake: "Reintentar indefinidamente sin aviso." },
          { title: "Permisos de herramientas", idea: "El flujo solo debe tener permisos necesarios.", practice: "Lista cuentas y permisos que necesita un prototipo.", mistake: "Usar cuenta personal con acceso total." }
        ]
      },
      {
        title: "Gobierno, medicion y mantenimiento",
        description: "Documentar, medir, revisar y retirar automatizaciones cuando ya no sirven.",
        evidence: "ficha de automatizacion con dueno, version, metrica y revision",
        criterion: "la automatizacion puede mantenerse sin depender de una sola persona",
        deliverable: "manual operativo de automatizacion",
        riskyChoice: "Dejar flujos activos sin responsable ni revision.",
        helpTrigger: "Cuando cambia una politica, herramienta, dato sensible o regulacion.",
        alert: "Una automatizacion abandonada puede seguir cometiendo errores.",
        lessons: [
          { title: "Dueno del flujo", idea: "Toda automatizacion necesita responsable.", practice: "Asigna dueno, suplente y canal de aviso.", mistake: "Crear flujos desde cuentas personales sin dueno." },
          { title: "Documentacion minima", idea: "La ficha debe explicar objetivo, entrada, salida, permisos y fallback.", practice: "Completa ficha de un flujo simple.", mistake: "Depender de memoria de quien lo creo." },
          { title: "Metricas de valor", idea: "Se mide tiempo ahorrado, errores, retrabajo y satisfaccion.", practice: "Define antes/despues para una tarea.", mistake: "Medir solo cantidad de ejecuciones." },
          { title: "Revision periodica", idea: "Los procesos cambian; las automatizaciones tambien.", practice: "Agenda revision mensual de prompts y flujos.", mistake: "No revisar hasta que falle." },
          { title: "Control de cambios", idea: "Versionar evita perder una configuracion que funcionaba.", practice: "Escribe historial v1, v2 y motivo de cambio.", mistake: "Editar en caliente sin registro." },
          { title: "Retirar automatizaciones", idea: "Apagar tambien es parte del mantenimiento.", practice: "Define criterios para pausar o retirar un flujo.", mistake: "Dejar activo un flujo que ya no corresponde." }
        ]
      }
    ],
    cases: [
      { title: "Prompt que inventa datos de clientes", summary: "Un borrador agrega informacion que no estaba en la consulta.", goal: "Agregar restricciones y revision humana.", trigger: "salida con datos no provistos", courseAction: "ajustar prompt para marcar faltantes y prohibir inventar", evidence: "prompt anterior, salida incorrecta y version corregida", error: "Enviar el texto porque esta bien escrito.", aftercare: "Agregar checklist de no inventar datos." },
      { title: "Base real pegada en herramienta no evaluada", summary: "Se uso una lista con datos personales para probar IA.", goal: "Detener exposicion y crear datos simulados.", trigger: "uso de datos sensibles en prueba", courseAction: "pausar, documentar, reemplazar con datos ficticios y consultar politica", evidence: "tipo de datos expuestos y herramienta usada", error: "Seguir probando porque ya se pego una vez.", aftercare: "Crear dataset simulado para practicas." },
      { title: "Flujo envia correos duplicados", summary: "Una automatizacion se dispara dos veces por cada fila.", goal: "Identificar disparador y cortar repeticion.", trigger: "duplicacion de evento", courseAction: "pausar flujo, revisar logs y agregar condicion de enviado", evidence: "hora, filas afectadas y correos enviados", error: "Borrar filas sin entender causa.", aftercare: "Agregar prueba de duplicados." },
      { title: "Resumen de reunion pierde un acuerdo", summary: "La IA resume pero omite una decision importante.", goal: "Mejorar formato de acta y revision.", trigger: "resumen incompleto", courseAction: "pedir secciones obligatorias y validar contra notas", evidence: "nota original, resumen y correccion", error: "Publicar acta sin revisar con participantes.", aftercare: "Usar plantilla de acuerdos y pendientes." },
      { title: "Clasificacion automatica sesgada", summary: "La IA marca como baja prioridad consultas con palabras informales.", goal: "Revisar criterio de clasificacion.", trigger: "prioridad mal asignada", courseAction: "definir reglas, probar muestra y agregar revision humana", evidence: "casos mal clasificados y regla corregida", error: "Confiar en la etiqueta por estar automatizada.", aftercare: "Auditar muestras semanalmente." },
      { title: "Cuenta personal sostiene flujo de trabajo", summary: "Si una persona se va, la automatizacion queda inaccesible.", goal: "Pasar a cuenta y documentacion controlada.", trigger: "flujo creado con cuenta personal", courseAction: "registrar dueno, permisos y migracion segura", evidence: "cuenta usada, permisos y dependencias", error: "Compartir clave de la cuenta personal.", aftercare: "Usar cuentas institucionales o compartidas seguras." },
      { title: "Respuesta automatica promete descuento", summary: "Un flujo responde a reclamos con una promesa no autorizada.", goal: "Agregar aprobacion humana en casos comerciales.", trigger: "texto automatizado con compromiso", courseAction: "pausar envio automatico y convertir en borrador revisable", evidence: "mensaje enviado y condicion que lo genero", error: "Dejar activo para ahorrar tiempo.", aftercare: "Separar respuestas informativas de decisiones comerciales." },
      { title: "Automatizacion sin metrica real", summary: "El equipo cree ahorrar tiempo pero hay mas retrabajo.", goal: "Medir antes/despues y decidir continuidad.", trigger: "aumento de correcciones manuales", courseAction: "medir tiempo, errores y satisfaccion por dos semanas", evidence: "datos antes/despues y decision", error: "Mantener por orgullo tecnico.", aftercare: "Retirar o redisenar flujos sin valor." }
    ]
  }
];

for (const config of courses) {
  writeCourseFiles(config);
}
updatePortalInventory(courses);
updateDocs(courses);

console.log(`Tanda 1 reforzada: ${courses.length} cursos`);
for (const config of courses) {
  const data = readJson(path.join(coursesRoot, config.folder, "src", "data", "course_content.json"));
  const lessons = data.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const quiz = data.modules.reduce((sum, module) => sum + module.quiz.length, 0);
  console.log(`- ${config.folder}: ${data.modules.length} modulos, ${lessons} lecciones, ${quiz} preguntas`);
}

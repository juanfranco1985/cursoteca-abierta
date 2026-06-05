import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesRoot = path.join(root, "cursos");
const portalDataDir = path.join(root, "portal", "portal_publico_profesional_v0_6", "data");
const version = "0.7-tanda-3";
const publicationStatus = "publica-profesional-v0.7-tanda-3";
const date = "2026-06-05";

const responsibleNotice = "Contenido educativo introductorio. No reemplaza asesoramiento profesional, soporte oficial ni normativa aplicable. Si la decision afecta dinero, seguridad, datos personales, salud, trabajo o derechos, valida con fuentes oficiales o una persona competente antes de actuar.";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeLesson(item) {
  return typeof item === "string" ? { title: item } : item;
}

function buildLesson(id, module, raw, config) {
  const item = normalizeLesson(raw);
  return {
    id,
    title: item.title,
    keyIdea: item.idea || `${item.title} sirve para convertir una practica tecnica en un resultado que otra persona pueda revisar, probar y mejorar.`,
    shortTheory: item.theory || `En esta leccion se trabaja ${item.title.toLowerCase()} dentro de ${module.title.toLowerCase()}. La meta es entender el concepto, aplicarlo en un caso pequeno y comprobar el resultado con evidencia.`,
    practicalExample: item.example || `${config.exampleContext} Aplica ${item.title.toLowerCase()} sobre ese escenario, guarda ${module.evidence} y anota que decision permite tomar.`,
    commonMistake: item.mistake || `El error habitual es avanzar por copia o intuicion sin probar datos, estados de error, casos limite ni claridad del resultado.`,
    whatToDoNow: item.practice || `Practica de 25 minutos: arma una version pequena de ${item.title.toLowerCase()}, prueba el resultado y registra evidencia, duda y proxima mejora.`,
    alert: item.alert || module.alert,
    keyPoints: [
      item.point || `${item.title} debe producir una salida observable, no solo una definicion.`,
      `Criterio de cierre: ${module.criterion}.`,
      `Evidencia minima: ${module.evidence}.`,
      `Entregable final relacionado: ${config.finalArtifact}.`
    ],
    responsibleNote: responsibleNotice
  };
}

function quizForModule(module, index) {
  const id = `m${index + 1}`;
  return [
    {
      id: `${id}-q1`,
      question: `Que conviene definir primero en "${module.title}"?`,
      options: [
        "Objetivo, entrada, salida esperada y evidencia de prueba.",
        "La herramienta mas vistosa disponible.",
        "Un resultado final sin pasos intermedios.",
        "Una respuesta rapida sin revisar contexto."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: el trabajo mejora cuando se sabe que entra, que sale y como se comprueba."
    },
    {
      id: `${id}-q2`,
      question: "Que evidencia permite cerrar el modulo con mas confianza?",
      options: [
        module.evidence,
        "Un comentario general sin prueba.",
        "Una captura sin explicar que se valido.",
        "Una herramienta abierta en pantalla."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.evidence} permite revisar y mantener el resultado.`
    },
    {
      id: `${id}-q3`,
      question: "Que conducta aumenta la probabilidad de error?",
      options: [
        module.riskyChoice,
        "Usar datos de prueba antes de aplicar a un caso real.",
        "Separar errores de funcionamiento y errores de interpretacion.",
        "Guardar supuestos y decisiones."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: esa conducta oculta problemas y dificulta corregirlos."
    },
    {
      id: `${id}-q4`,
      question: "Cuando corresponde pedir validacion externa o revisar una fuente confiable?",
      options: [
        module.helpTrigger,
        "Nunca, porque la practica educativa reemplaza cualquier revision.",
        "Solo cuando el resultado se ve mal.",
        "Despues de publicar sin pruebas."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: algunas decisiones requieren soporte, fuente oficial o una persona competente."
    },
    {
      id: `${id}-q5`,
      question: `Cual es el entregable minimo de "${module.title}"?`,
      options: [
        module.deliverable,
        "Una lista de ideas sin evidencia.",
        "Una copia de pantalla sin explicacion.",
        "Un archivo final sin criterio de cierre."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.deliverable} deja avance verificable.`
    }
  ];
}

function buildCourse(config, courseId) {
  return {
    courseId,
    title: config.title,
    version,
    publicationStatus,
    modules: config.modules.map((module, moduleIndex) => ({
      id: `m${moduleIndex + 1}`,
      title: module.title,
      description: module.description,
      learningRisk: module.learningRisk || "Practicar sin evidencia puede dejar errores invisibles o decisiones dificiles de sostener.",
      lessons: module.lessons.map((item, lessonIndex) => buildLesson(`m${moduleIndex + 1}-l${lessonIndex + 1}`, module, item, config)),
      quiz: quizForModule(module, moduleIndex)
    }))
  };
}

const checklistItems = [
  "Objetivo y usuario definidos",
  "Datos de prueba preparados",
  "Pasos reproducibles escritos",
  "Resultado probado",
  "Errores o limites anotados",
  "Mejora siguiente priorizada"
];

function buildChecklists(config) {
  return {
    checklists: config.modules.map((module, moduleIndex) => ({
      id: `${config.shortId}-checklist-${moduleIndex + 1}`,
      title: `${module.title}: checklist de practica`,
      description: `Control breve para aplicar ${module.title.toLowerCase()} en ${config.practiceArea} con salida verificable.`,
      commercialArea: config.practiceArea,
      items: checklistItems.map((title, itemIndex) => ({
        id: `${config.shortId}-cl${moduleIndex + 1}-i${itemIndex + 1}`,
        title,
        explanation: `${title} reduce improvisacion y deja trazabilidad durante ${module.title.toLowerCase()}.`,
        recommendedAction: `Aplicar sobre un caso pequeno y guardar ${module.evidence}. Criterio de cierre: ${module.criterion}.`
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
        `Describir el problema inicial: ${item.trigger}.`,
        "Separar datos reales, datos simulados y datos que no deben compartirse.",
        `Aplicar el criterio del curso: ${item.courseAction}.`,
        `Guardar evidencia: ${item.evidence}.`,
        "Validar el resultado contra una prueba pequena y una persona o fuente confiable si corresponde.",
        "Cerrar con decision, limite detectado y proxima mejora."
      ],
      evidenceToPreserve: [
        "Consigna o caso de partida",
        item.evidence,
        "Version inicial y version corregida",
        "Decision tomada y motivo",
        "Duda o riesgo pendiente"
      ],
      errorsToAvoid: [
        item.error,
        "Usar datos sensibles en practicas educativas.",
        "Publicar sin revisar estados de error.",
        "Copiar resultados sin entender supuestos.",
        "Medir exito solo por apariencia."
      ],
      aftercare: [
        item.aftercare,
        "Guardar una plantilla reutilizable.",
        "Actualizar el checklist del curso.",
        "Definir el siguiente caso de practica."
      ],
      guidedDecision: {
        question: "Que decision muestra mejor criterio profesional?",
        options: [
          {
            text: "Probar en pequeno, guardar evidencia, revisar limites y recien despues aplicar o publicar.",
            isCorrect: true,
            feedback: "Correcto: reduce errores y deja aprendizaje transferible."
          },
          {
            text: "Usar el primer resultado porque parece correcto.",
            isCorrect: false,
            feedback: "La apariencia no alcanza sin prueba ni criterio de cierre."
          },
          {
            text: "Agregar datos reales para que la practica sea mas completa.",
            isCorrect: false,
            feedback: "Las practicas deben usar datos simulados o anonimizados."
          }
        ]
      }
    }))
  };
}

function updateManifest(config, courseId) {
  const file = path.join(coursesRoot, config.folder, "src", "data", "course_manifest.json");
  const manifest = readJson(file);
  Object.assign(manifest, {
    courseId,
    templateVersion: "0.7-publica-profesional-tanda-3",
    appName: config.title,
    shortName: config.shortName,
    subtitle: config.subtitle,
    description: config.description,
    audience: config.audience,
    responsibleNotice,
    cacheName: `${config.folder}-cache-${version}`,
    contentAudit: {
      status: "reforzado-tanda-3",
      date,
      modules: 6,
      lessons: 36,
      quizQuestions: 30,
      checklists: 6,
      cases: 8,
      notes: "Contenido reemplazado para reducir patrones genericos en cursos de alta visibilidad."
    }
  });
  manifest.labels = {
    ...(manifest.labels || {}),
    modules: "Modulos de aprendizaje",
    checklists: "Checklists de practica",
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
    reinforcedBatch3: true,
    publicationCandidate: true,
    publicProfessionalEdition: true,
    requiresBackend: false,
    requiresLogin: false
  };
  const note = "v0.7 tanda 3 reemplaza contenido generico por modulos, practicas, checklists y casos especificos en cursos de alta visibilidad.";
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
  const manifestPath = path.join(coursesRoot, config.folder, "src", "data", "course_manifest.json");
  const existingManifest = readJson(manifestPath);
  const courseId = existingManifest.courseId;
  const dataDir = path.join(coursesRoot, config.folder, "src", "data");
  writeJson(path.join(dataDir, "course_content.json"), buildCourse(config, courseId));
  writeJson(path.join(dataDir, "checklists.json"), buildChecklists(config));
  writeJson(path.join(dataDir, "incidents.json"), buildIncidents(config));
  updateManifest(config, courseId);
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
    course.version = "v0.7 tanda 3 reforzada";
    course.status = "Curso reforzado - tanda 3";
    course.category = config.portalCategory || course.category;
    course.audience = config.audience;
    course.description = config.description;
    course.features = [
      "6 modulos",
      "36 lecciones reforzadas",
      "30 preguntas",
      "6 checklists de practica",
      "8 casos guiados",
      "Sin backend ni login"
    ];
    course.recommendedBase = "Contenido reforzado con practicas, evidencia, casos aplicados y criterios de cierre.";
    course.tags = [...new Set([...(course.tags || []), "reforzado-tanda-3", "contenido-v0-7", "alta-visibilidad"])];
    course.publicReady = true;
  }
  writeJson(coursesFile, courses);

  const csvFile = path.join(portalDataDir, "courses_inventory.csv");
  if (fs.existsSync(csvFile)) {
    let csv = fs.readFileSync(csvFile, "utf8");
    for (const config of configs) {
      const lineRegex = new RegExp(`^${config.folder},.*$`, "m");
      csv = csv.replace(lineRegex, `${config.folder},${csvCell(config.title)},v0.7 tanda 3 reforzada,Curso reforzado - tanda 3,${csvCell(config.portalCategory || config.practiceArea)},${csvCell(config.audience)},../../cursos/${config.folder}/index.html,true,true`);
    }
    fs.writeFileSync(csvFile, csv, "utf8");
  }
}

function csvCell(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function updateDocs(configs) {
  const auditFile = path.join(root, "AUDITORIA_NAVEGABILIDAD_CONTENIDO_2026_06_04.md");
  if (fs.existsSync(auditFile)) {
    let text = fs.readFileSync(auditFile, "utf8");
    for (const config of configs) text = text.replace(`- \`${config.folder}\`\n`, "");
    text = text.replace("Pendientes actuales despues de UX/UI, tanda 1 y tanda 2:", "Pendientes actuales despues de UX/UI, tanda 1, tanda 2 y tanda 3:");
    const marker = "## Tanda 3 de refuerzo";
    const block = `${marker}\n\nCompletada el ${date} con 5 cursos de alta visibilidad reforzados:\n\n${configs.map(config => `- ${config.folder}: 6 modulos, 36 lecciones, 30 preguntas, 6 checklists y 8 casos guiados.`).join("\n")}\n\nDeuda de contenido generico despues de esta tanda: 17 cursos.\n`;
    if (!text.includes(marker)) text = `${text.trim()}\n\n${block}\n`;
    fs.writeFileSync(auditFile, text, "utf8");
  }

  const checklistFile = path.join(root, "CHECKLIST_PUBLICACION_BETA.md");
  if (fs.existsSync(checklistFile)) {
    let text = fs.readFileSync(checklistFile, "utf8");
    if (!text.includes("Reforzar tercera tanda de 5 cursos de alta visibilidad")) {
      text = text.replace(
        "- [ ] Reforzar los 22 cursos restantes con patrones de contenido generico.",
        "- [x] Reforzar tercera tanda de 5 cursos de alta visibilidad.\n- [ ] Reforzar los 17 cursos restantes con patrones de contenido generico."
      );
    }
    fs.writeFileSync(checklistFile, text, "utf8");
  }

  const pendingFile = path.join(root, "PENDIENTES_REALES_V1_0_BETA.md");
  if (fs.existsSync(pendingFile)) {
    let text = fs.readFileSync(pendingFile, "utf8");
    text = text.replace(
      "La auditoria del 2026-06-04 detecto 32 cursos con patrones de contenido generico. UX/UI Basico fue reforzado como primera muestra, la tanda 1 reforzo 5 cursos adicionales y la tanda 2 reforzo 5 cursos sensibles. Quedan 22 cursos por trabajar antes de considerar v1.0 final.",
      "La auditoria del 2026-06-04 detecto 32 cursos con patrones de contenido generico. UX/UI Basico fue reforzado como primera muestra, la tanda 1 reforzo 5 cursos adicionales, la tanda 2 reforzo 5 cursos sensibles y la tanda 3 reforzo 5 cursos de alta visibilidad. Quedan 17 cursos por trabajar antes de considerar v1.0 final."
    );
    fs.writeFileSync(pendingFile, text, "utf8");
  }
}

function m(title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons) {
  return { title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons };
}

const courses = [
  {
    folder: "ia_practica_web_v0_6_publica",
    shortId: "iaprac",
    title: "IA Practica para Trabajadores y Emprendedores",
    shortName: "IA Practica",
    subtitle: "Prompts, privacidad, verificacion, automatizacion liviana y uso responsable.",
    description: "Curso practico para usar IA en tareas reales de trabajo sin exponer datos sensibles ni delegar decisiones criticas.",
    audience: "Trabajadores, emprendedores, docentes y equipos chicos que quieren usar IA con criterio operativo.",
    portalCategory: "Trabajo e IA",
    practiceArea: "uso responsable de IA en tareas laborales y emprendimientos",
    exampleContext: "Un equipo necesita responder consultas, resumir informacion, ordenar ideas y revisar textos usando IA sin filtrar datos privados.",
    finalArtifact: "kit de prompts y flujo de trabajo con criterios de privacidad, revision humana y evidencia",
    modules: [
      m("IA como asistente de trabajo", "Entender que la IA ayuda a preparar borradores, ordenar informacion y acelerar tareas, pero no reemplaza criterio humano.", "mapa de tareas aptas, dudosas y no aptas para IA", "cada tarea tiene beneficio, riesgo y control humano definido", "matriz de uso de IA por tarea", "Usar IA para decidir temas sensibles sin revision humana.", "Cuando la tarea afecta clientes, dinero, salud, datos personales o derechos.", "No pegues datos sensibles en herramientas sin evaluar privacidad.", ["Que puede y que no puede hacer la IA", "Tareas repetitivas y tareas de criterio", "Datos publicos, internos y sensibles", "Control humano obligatorio", "Beneficio real vs novedad", "Mapa de usos permitidos"]),
      m("Prompts utiles y verificables", "Construir instrucciones con contexto, objetivo, formato, restricciones y ejemplo.", "prompt con contexto, salida esperada, restricciones y criterio de revision", "otra persona puede reutilizar el prompt y revisar si la salida sirve", "biblioteca inicial de prompts", "Pedir respuestas generales para tareas que necesitan formato preciso.", "Cuando la salida sera enviada a clientes, publico o autoridades.", "Un prompt bueno tambien dice que no debe inventar.", ["Contexto y rol", "Objetivo de la salida", "Formato pedido", "Restricciones", "Ejemplos seguros", "Versionado de prompts"]),
      m("Privacidad y seguridad", "Reducir exposicion de datos al preparar consultas, ejemplos y archivos.", "version anonimizada de un caso antes de usar IA", "el ejercicio no contiene datos personales innecesarios", "protocolo de anonimizado", "Pegar chats, documentos o bases reales completas.", "Cuando aparecen nombres, documentos, datos bancarios, salud o informacion laboral sensible.", "Si no sabes si un dato es sensible, tratalo como sensible.", ["Anonimizar datos", "Minimizar informacion", "Archivos y adjuntos", "Historial de herramientas", "Permisos y cuentas", "Registro de riesgos"]),
      m("Verificar respuestas", "Detectar errores, alucinaciones, sesgos, omisiones y supuestos antes de usar la salida.", "checklist de verificacion aplicado a una respuesta de IA", "la salida se revisa por exactitud, fuente, tono, faltantes y accion", "proceso de revision de respuestas", "Copiar y pegar una respuesta porque suena profesional.", "Cuando se citan datos, leyes, precios, salud, finanzas o instrucciones tecnicas.", "La seguridad del tono no prueba exactitud.", ["Hechos y fuentes", "Supuestos ocultos", "Errores por omision", "Tono y publico", "Prueba con casos limite", "Decision de usar o descartar"]),
      m("Flujos de trabajo con IA", "Integrar IA en procesos chicos: correo, resumen, planilla, ideas, atencion o documentacion.", "flujo con entrada, prompt, salida, revision y archivo final", "el flujo ahorra tiempo sin aumentar errores ni exposicion", "flujo operativo asistido por IA", "Automatizar envio o publicacion sin paso de aprobacion.", "Cuando la salida impacta clientes, contratos, pagos o reputacion.", "La IA debe quedar dentro de un proceso, no al mando del proceso.", ["Borradores de correo", "Resumenes de reuniones", "Ideas y planificacion", "Clasificacion simple", "Plantillas reutilizables", "Aprobacion final"]),
      m("Mejora y mantenimiento", "Medir si la IA ayuda realmente y mantener prompts actualizados.", "comparacion antes/despues con tiempo, errores y calidad", "la mejora tiene metrica y proxima revision", "plan de mejora de IA de 30 dias", "Mantener prompts que producen errores porque ya estan instalados.", "Cuando cambia una politica, herramienta, cliente o tipo de dato.", "Una practica con IA se revisa igual que cualquier proceso de trabajo.", ["Medir ahorro real", "Medir calidad", "Registro de prompts", "Actualizar restricciones", "Retirar usos riesgosos", "Rutina de mejora"])
    ],
    cases: [
      { title: "Prompt con datos de clientes", summary: "Una persona pega un chat real para pedir resumen.", goal: "Anonimizar antes de usar IA.", trigger: "chat con nombres y telefonos", courseAction: "reemplazar datos por etiquetas y probar con version simulada", evidence: "version anonimizada y prompt corregido", error: "Pegar el chat completo por comodidad.", aftercare: "Crear plantilla de anonimizado." },
      { title: "Respuesta que inventa una politica", summary: "La IA responde como si conociera reglas internas.", goal: "Marcar datos faltantes y no inventar.", trigger: "salida con informacion no provista", courseAction: "agregar restriccion de no inventar y pedir preguntas faltantes", evidence: "prompt anterior, salida incorrecta y version corregida", error: "Enviar porque suena convincente.", aftercare: "Agregar checklist de verificacion." },
      { title: "Borrador de correo demasiado frio", summary: "La IA genera un texto correcto pero poco humano.", goal: "Ajustar tono y publico.", trigger: "respuesta sin contexto de cliente", courseAction: "definir tono, relacion y proximo paso", evidence: "dos versiones comparadas", error: "Usar tono generico para todos.", aftercare: "Guardar reglas de tono." },
      { title: "Resumen que omite un acuerdo", summary: "Una reunion resumida por IA pierde una decision clave.", goal: "Usar formato con acuerdos y pendientes.", trigger: "resumen narrativo incompleto", courseAction: "pedir secciones obligatorias y validar contra notas", evidence: "nota, resumen y correccion", error: "Publicar acta sin revisar.", aftercare: "Usar plantilla de acta." },
      { title: "Automatizacion sin aprobacion", summary: "Se quiere enviar respuestas automaticas a clientes.", goal: "Agregar revision humana.", trigger: "salida directa a cliente", courseAction: "convertir respuesta en borrador revisable", evidence: "flujo antes/despues", error: "Enviar automatico para ahorrar tiempo.", aftercare: "Separar borrador de envio." },
      { title: "Prompts dispersos", summary: "Cada persona usa instrucciones distintas.", goal: "Crear biblioteca comun.", trigger: "resultados inconsistentes", courseAction: "versionar prompts y documentar uso", evidence: "prompt v1, v2 y criterio", error: "Editar sin registrar cambios.", aftercare: "Revisar biblioteca mensualmente." },
      { title: "Uso de IA para tema legal", summary: "La salida se toma como asesoramiento definitivo.", goal: "Delimitar alcance educativo.", trigger: "consulta sensible", courseAction: "usar IA solo para ordenar preguntas y buscar fuentes", evidence: "lista de dudas y fuentes a validar", error: "Tomar decision legal por respuesta de IA.", aftercare: "Definir temas que requieren profesional." },
      { title: "Resultado bonito pero inutil", summary: "La IA entrega texto largo que no reduce trabajo.", goal: "Medir utilidad real.", trigger: "salida extensa sin accion", courseAction: "pedir formato accionable y medir tiempo", evidence: "antes/despues y criterio de calidad", error: "Valorar por longitud.", aftercare: "Crear rubrica de salida util." }
    ]
  },
  {
    folder: "javascript_desde_cero_web_v0_6_publica",
    shortId: "js0",
    title: "JavaScript desde Cero",
    shortName: "JavaScript Cero",
    subtitle: "Variables, eventos, DOM, formularios, arrays, errores y mini apps.",
    description: "Curso practico para construir interacciones web simples con JavaScript, probando estados, errores y datos reales de interfaz.",
    audience: "Principiantes de programacion web, estudiantes, docentes y personas que ya conocen HTML/CSS basico.",
    portalCategory: "Desarrollo web",
    practiceArea: "programacion JavaScript inicial para interfaces web",
    exampleContext: "Una pagina estatica necesita botones, formularios, listas, filtros y mensajes de error que respondan al usuario.",
    finalArtifact: "mini app web con entrada de datos, validacion, estado, renderizado y pruebas manuales",
    modules: [
      m("Modelo mental de JavaScript", "Entender donde corre JavaScript, que modifica y como se conecta con HTML/CSS.", "diagrama de pagina, script, datos y resultado visible", "la persona explica que parte cambia JS y que parte no", "mapa de funcionamiento de una pagina interactiva", "Copiar scripts sin saber que elemento modifican.", "Cuando el codigo manipula datos personales, pagos o acciones irreversibles.", "JavaScript mejora la pagina, pero tambien puede romperla si no se prueba.", ["HTML, CSS y JS", "Consola del navegador", "Variables y tipos", "Funciones", "Orden de ejecucion", "Errores iniciales"]),
      m("DOM y eventos", "Seleccionar elementos, escuchar acciones y actualizar pantalla.", "boton o control que cambia contenido verificable", "la accion del usuario produce un cambio claro y reversible", "interaccion DOM documentada", "Usar selectores fragiles o repetir codigo sin necesidad.", "Cuando la interfaz controla informacion sensible o publicacion.", "Cada evento necesita un estado esperado y un error posible.", ["Seleccionar elementos", "click y input", "Cambiar texto y clases", "Crear elementos", "Delegacion simple", "Estados de foco y accesibilidad"]),
      m("Datos y arrays", "Guardar listas, recorrerlas, filtrar, ordenar y mostrarlas.", "lista renderizada desde datos de prueba", "los datos se separan del HTML y se pueden actualizar", "render de lista dinamica", "Escribir cada item a mano en HTML.", "Cuando los datos vienen de usuarios o fuentes externas.", "No mezcles datos de prueba con datos reales sensibles.", ["Objetos simples", "Arrays", "map y forEach", "filter", "sort basico", "Render desde datos"]),
      m("Formularios y validacion", "Leer entradas, validar campos y mostrar mensajes claros.", "formulario con validacion, mensajes y preservacion de datos", "el usuario entiende que corregir y no pierde lo escrito", "formulario interactivo validado", "Validar solo con alertas genericas.", "Cuando se piden datos personales, pagos, salud o credenciales.", "Un error claro vale mas que un formulario vistoso.", ["Leer inputs", "Validar requeridos", "Mensajes de error", "Prevenir envio", "Guardar temporalmente", "Confirmacion final"]),
      m("Estado, almacenamiento y errores", "Controlar estado de la app, localStorage y errores comunes.", "estado visible y prueba de recarga o error", "la app no pierde informacion importante sin avisar", "mini app con estado persistente simple", "Guardar todo sin pensar privacidad ni limpieza.", "Cuando localStorage contiene datos personales o compartidos.", "No guardes datos sensibles en almacenamiento local.", ["Estado en memoria", "localStorage", "Reset seguro", "try/catch basico", "Estados vacios", "Mensajes de fallo"]),
      m("Proyecto final y publicacion", "Unir conceptos en una mini app mantenible y publicable.", "mini app probada en escritorio y movil", "la app cumple flujo principal, errores y accesibilidad basica", "mini app JavaScript final", "Publicar sin probar flujo completo.", "Cuando la app sera usada por otras personas o recopila datos.", "Antes de publicar, probar como usuario nuevo.", ["Definir proyecto", "Estructura de archivos", "Pruebas manuales", "Accesibilidad", "Refactor minimo", "Publicacion estatica"])
    ],
    cases: [
      { title: "Boton que no hace nada", summary: "El evento no se conecta al elemento correcto.", goal: "Diagnosticar selector y timing.", trigger: "click sin respuesta", courseAction: "verificar selector, carga del script y listener", evidence: "error de consola y correccion", error: "Cambiar CSS sin revisar JS.", aftercare: "Crear checklist de eventos." },
      { title: "Formulario que borra datos", summary: "Al fallar validacion se pierde lo escrito.", goal: "Preservar entrada y explicar error.", trigger: "submit sin prevenir comportamiento", courseAction: "usar preventDefault y mensajes por campo", evidence: "formulario antes/despues", error: "Mostrar alert y recargar.", aftercare: "Probar campos vacios y validos." },
      { title: "Lista repetida duplicada", summary: "Cada render agrega items sin limpiar contenedor.", goal: "Controlar renderizado.", trigger: "duplicacion tras filtrar", courseAction: "limpiar contenedor o renderizar desde estado", evidence: "captura antes/despues", error: "Crear mas condiciones sin entender render.", aftercare: "Separar datos y vista." },
      { title: "localStorage con datos sensibles", summary: "La app guarda informacion que no deberia quedar en el navegador.", goal: "Reducir persistencia.", trigger: "almacenamiento innecesario", courseAction: "guardar solo preferencias no sensibles o limpiar", evidence: "clave localStorage revisada", error: "Guardar todo por comodidad.", aftercare: "Documentar que se guarda." },
      { title: "Filtro no encuentra mayusculas", summary: "La busqueda falla por diferencias de texto.", goal: "Normalizar comparacion.", trigger: "busqueda sensible a mayusculas", courseAction: "usar lowerCase y trim", evidence: "casos de prueba", error: "Duplicar datos con variantes.", aftercare: "Agregar pruebas de busqueda." },
      { title: "Error silencioso", summary: "La consola muestra error pero la interfaz no avisa.", goal: "Mostrar estado de fallo amigable.", trigger: "JSON o dato inesperado", courseAction: "capturar error y renderizar mensaje", evidence: "mensaje de consola y UI", error: "Ignorar porque a veces funciona.", aftercare: "Crear estados loading/error/empty." },
      { title: "Funcion gigante", summary: "Todo el codigo esta en un bloque dificil de mantener.", goal: "Separar responsabilidades.", trigger: "codigo repetido y confuso", courseAction: "extraer leer datos, validar y renderizar", evidence: "funciones antes/despues", error: "Refactorizar sin probar.", aftercare: "Cambiar de a poco." },
      { title: "Mini app que no funciona en movil", summary: "El flujo se probo solo en escritorio.", goal: "Validar viewport y tactil.", trigger: "botones chicos o layout roto", courseAction: "probar ancho movil y ajustar controles", evidence: "capturas desktop/movil", error: "Asumir que responsive es solo CSS.", aftercare: "Agregar prueba movil antes de publicar." }
    ]
  },
  {
    folder: "power_bi_principiantes_web_v0_6_publica",
    shortId: "pbi",
    title: "Power BI para Principiantes",
    shortName: "Power BI",
    subtitle: "Datos, modelo, medidas, visualizaciones, filtros, publicacion y relato.",
    description: "Curso practico para construir dashboards iniciales con datos limpios, indicadores claros y decisiones bien explicadas.",
    audience: "Principiantes de BI, analistas iniciales, equipos administrativos y personas que preparan reportes.",
    portalCategory: "BI",
    practiceArea: "dashboarding inicial y analisis visual con Power BI",
    exampleContext: "Un equipo tiene ventas, gastos o atencion en planillas y necesita un tablero que explique que pasa y que decision tomar.",
    finalArtifact: "dashboard inicial con datos preparados, medidas basicas, visualizaciones, filtros y relato de hallazgos",
    modules: [
      m("Pregunta de negocio", "Definir que pregunta responde el tablero antes de elegir graficos.", "pregunta, audiencia y decision esperada", "cada visual responde a una pregunta concreta", "brief de dashboard", "Armar graficos sin saber que decision apoyan.", "Cuando el tablero afecta dinero, rendimiento, personas o decisiones comerciales.", "Un dashboard sin pregunta se vuelve decoracion.", ["Audiencia", "Decision esperada", "Indicadores clave", "Granularidad", "Periodo", "Alcance"]),
      m("Preparacion de datos", "Revisar origen, columnas, tipos, calidad y transformaciones.", "tabla de datos con tipos, faltantes y reglas de limpieza", "los datos cargan sin errores visibles y tienen significado", "dataset preparado", "Confiar en la planilla sin revisar duplicados ni formatos.", "Cuando los datos incluyen personas, salarios, clientes o datos sensibles.", "Un grafico bueno no salva datos malos.", ["Origen de datos", "Tipos de columna", "Valores faltantes", "Duplicados", "Columnas calculadas simples", "Documentar limpieza"]),
      m("Modelo y relaciones", "Crear relaciones simples y evitar cruces incorrectos.", "diagrama de tablas y relaciones justificadas", "las relaciones responden al nivel de detalle correcto", "modelo basico documentado", "Relacionar tablas por columnas parecidas sin validar.", "Cuando los resultados se usaran para reportes ejecutivos o financieros.", "Una relacion incorrecta cambia todos los numeros.", ["Tabla de hechos", "Dimensiones", "Claves", "Relaciones uno a muchos", "Direccion de filtro", "Validacion de totales"]),
      m("Medidas e indicadores", "Construir medidas basicas y revisar resultados contra datos fuente.", "medidas con formula, definicion y prueba de total", "cada indicador tiene definicion y validacion", "diccionario de medidas", "Crear medidas sin saber que significan.", "Cuando un KPI define pagos, metas, bonos o decisiones laborales.", "Un KPI sin definicion genera discusiones.", ["Suma y conteo", "Promedio", "Porcentaje", "Periodo anterior", "Formato", "Validacion manual"]),
      m("Visualizaciones y filtros", "Elegir graficos adecuados, jerarquia visual y filtros utiles.", "pagina de reporte con visuales justificados", "el usuario puede leer tendencia, comparacion y detalle sin confusion", "pagina de dashboard", "Usar graficos llamativos que ocultan el dato.", "Cuando se publica para publico amplio o direccion.", "La visualizacion debe reducir esfuerzo, no aumentarlo.", ["Tarjetas KPI", "Barras", "Lineas", "Tablas", "Segmentadores", "Interacciones"]),
      m("Publicacion y relato", "Presentar el tablero con contexto, limites y recomendaciones.", "relato de hallazgos con capturas y limites", "el informe explica que muestra, que no muestra y que accion sugiere", "presentacion del dashboard", "Publicar sin explicar filtros, fecha de datos ni limites.", "Cuando el dashboard sale del equipo que conoce los datos.", "Todo tablero publicado necesita contexto.", ["Portada", "Hallazgos", "Anotaciones", "Limitaciones", "Exportacion", "Revision periodica"])
    ],
    cases: [
      { title: "Ventas no coinciden con la planilla", summary: "El total del tablero difiere del archivo fuente.", goal: "Validar carga y relaciones.", trigger: "total distinto", courseAction: "comparar filas, tipos y filtros activos", evidence: "total fuente vs total Power BI", error: "Ajustar visual hasta que parezca correcto.", aftercare: "Crear prueba de totales." },
      { title: "Grafico saturado", summary: "Demasiadas categorias vuelven ilegible el reporte.", goal: "Elegir visual y nivel adecuado.", trigger: "barras o etiquetas excesivas", courseAction: "agrupar, filtrar top N o cambiar visual", evidence: "version antes/despues", error: "Achicar texto para que entre.", aftercare: "Definir jerarquia visual." },
      { title: "Relacion incorrecta", summary: "Los datos se duplican al cruzar tablas.", goal: "Corregir modelo.", trigger: "relacion muchos a muchos inesperada", courseAction: "revisar claves y nivel de detalle", evidence: "diagrama y prueba de total", error: "Crear medida compensatoria sin entender causa.", aftercare: "Documentar relaciones." },
      { title: "KPI sin definicion", summary: "Dos personas entienden distinto el mismo indicador.", goal: "Crear diccionario de medidas.", trigger: "discusion por significado", courseAction: "definir formula, periodo y exclusiones", evidence: "ficha de KPI", error: "Cambiar nombre para evitar debate.", aftercare: "Aprobar definiciones." },
      { title: "Filtro oculto altera decision", summary: "Un segmentador queda activo y sesga lectura.", goal: "Mostrar contexto de filtros.", trigger: "resultado inesperado", courseAction: "revisar filtros visual/pagina/reporte", evidence: "lista de filtros activos", error: "Exportar captura sin filtros visibles.", aftercare: "Agregar tarjeta de contexto." },
      { title: "Datos sensibles en captura", summary: "Se comparte dashboard con nombres de clientes.", goal: "Anonimizar antes de publicar.", trigger: "reporte compartido fuera del equipo", courseAction: "ocultar datos sensibles y usar agregados", evidence: "campos removidos", error: "Borrar solo una columna visible.", aftercare: "Crear version publica." },
      { title: "Dashboard sin accion", summary: "El reporte muestra numeros pero no sugiere decision.", goal: "Agregar relato y recomendacion.", trigger: "lectura sin conclusion", courseAction: "escribir hallazgo, impacto y proximo paso", evidence: "slide o nota de hallazgo", error: "Agregar mas graficos.", aftercare: "Revisar con usuario final." },
      { title: "Actualizacion fallida", summary: "El reporte no carga datos nuevos.", goal: "Diagnosticar origen y ruta.", trigger: "error de refresh", courseAction: "revisar fuente, permisos y cambios de columnas", evidence: "mensaje de error y fuente", error: "Publicar datos viejos sin aviso.", aftercare: "Crear rutina de actualizacion." }
    ]
  },
  {
    folder: "python_datos_desde_cero_v0_6_publica",
    shortId: "pydatos",
    title: "Python para Datos desde Cero",
    shortName: "Python Datos",
    subtitle: "Variables, listas, archivos, pandas, limpieza, analisis y reportes simples.",
    description: "Curso practico para iniciar Python aplicado a datos con ejercicios pequenos, lectura de archivos y analisis reproducible.",
    audience: "Principiantes de programacion, analistas iniciales, estudiantes y personas que trabajan con planillas.",
    portalCategory: "Datos",
    practiceArea: "analisis de datos inicial con Python",
    exampleContext: "Una persona recibe archivos CSV con ventas, gastos o registros y necesita limpiarlos, analizarlos y explicar hallazgos.",
    finalArtifact: "notebook o script simple que carga datos, limpia columnas, calcula indicadores y exporta un resumen",
    modules: [
      m("Primeros pasos en Python", "Entender variables, tipos, errores y ejecucion de codigo.", "script pequeno con variables y salida revisada", "el codigo corre y la persona explica cada linea", "primer script documentado", "Copiar codigo sin ejecutar por partes.", "Cuando el script manipula archivos reales o datos sensibles.", "Primero entender, despues automatizar.", ["Instalar o usar entorno", "print y comentarios", "Variables", "Tipos", "Errores comunes", "Ejecutar por bloques"]),
      m("Colecciones y control", "Usar listas, diccionarios, condicionales y bucles para ordenar informacion.", "estructura de datos con recorrido y resultado esperado", "los datos se recorren sin perder significado", "ejercicio de listas y diccionarios", "Usar muchas variables sueltas para datos repetidos.", "Cuando hay datos personales o grandes volumenes.", "Las estructuras ayudan si se nombran con claridad.", ["Listas", "Diccionarios", "if", "for", "Funciones simples", "Pruebas con casos chicos"]),
      m("Archivos y datos tabulares", "Leer CSV, revisar columnas, filas y tipos antes de analizar.", "archivo cargado con inspeccion inicial", "se conocen columnas, filas, faltantes y tipos", "lectura de CSV documentada", "Analizar sin mirar estructura ni calidad.", "Cuando el archivo contiene clientes, empleados o datos privados.", "Nunca asumas que un CSV esta limpio.", ["Rutas de archivo", "Leer CSV", "Ver primeras filas", "Columnas", "Tipos de datos", "Faltantes"]),
      m("Limpieza con pandas", "Renombrar, filtrar, corregir tipos y preparar datos para indicadores.", "dataset limpio con reglas aplicadas", "cada limpieza tiene motivo y prueba", "procedimiento de limpieza", "Sobrescribir datos originales sin copia.", "Cuando la limpieza afecta reportes oficiales o financieros.", "Limpieza sin registro es dificil de auditar.", ["Renombrar columnas", "Filtrar filas", "Convertir fechas", "Rellenar o excluir faltantes", "Eliminar duplicados", "Guardar version limpia"]),
      m("Analisis y visualizacion basica", "Calcular indicadores, agrupar datos y crear graficos simples.", "tabla resumen y grafico basico con interpretacion", "el resultado responde una pregunta concreta", "analisis exploratorio inicial", "Crear graficos sin pregunta ni conclusion.", "Cuando el resultado se usara para tomar decisiones.", "Un grafico necesita titulo, contexto y lectura.", ["sum y count", "groupby", "Promedios", "Ordenar resultados", "Graficos simples", "Interpretar hallazgos"]),
      m("Reporte reproducible", "Convertir el analisis en script o notebook que otra persona pueda repetir.", "archivo con pasos, parametros y salida final", "otra persona puede ejecutar y obtener el mismo resultado", "reporte reproducible", "Arreglar resultados manualmente despues de exportar.", "Cuando el reporte se comparte o se actualiza periodicamente.", "Reproducible significa que el proceso importa tanto como el resultado.", ["Orden del notebook", "Funciones reutilizables", "Exportar CSV", "Exportar resumen", "README breve", "Revision final"])
    ],
    cases: [
      { title: "CSV con columnas raras", summary: "Los nombres tienen espacios y acentos mezclados.", goal: "Normalizar columnas.", trigger: "columnas dificiles de usar", courseAction: "renombrar con criterio y documentar", evidence: "diccionario antes/despues", error: "Cambiar nombres sin guardar equivalencia.", aftercare: "Crear regla de nombres." },
      { title: "Fechas como texto", summary: "Los filtros por mes no funcionan.", goal: "Convertir fecha y validar.", trigger: "tipo incorrecto", courseAction: "parsear fechas y revisar errores", evidence: "conteo de fechas invalidas", error: "Ordenar texto como si fuera fecha.", aftercare: "Agregar prueba de tipo." },
      { title: "Duplicados inflan ventas", summary: "El total se duplica por registros repetidos.", goal: "Detectar y tratar duplicados.", trigger: "filas iguales o claves repetidas", courseAction: "identificar clave y decidir conservar/eliminar", evidence: "cantidad de duplicados", error: "Borrar duplicados sin criterio.", aftercare: "Documentar regla." },
      { title: "Archivo no abre", summary: "El script falla por ruta incorrecta.", goal: "Hacer rutas claras.", trigger: "FileNotFoundError", courseAction: "revisar carpeta de trabajo y ruta relativa", evidence: "ruta esperada y real", error: "Mover archivos hasta que funcione sin entender.", aftercare: "Usar estructura de proyecto." },
      { title: "Promedio enganoso", summary: "Un valor extremo distorsiona lectura.", goal: "Comparar media y mediana.", trigger: "outlier", courseAction: "calcular resumen y detectar extremos", evidence: "estadisticas y filas extremas", error: "Concluir solo con promedio.", aftercare: "Agregar chequeo de outliers." },
      { title: "Datos sensibles en notebook", summary: "El archivo muestra nombres reales.", goal: "Anonimizar antes de compartir.", trigger: "notebook compartido", courseAction: "remover o simular campos sensibles", evidence: "columnas eliminadas", error: "Ocultar visualmente sin borrar datos.", aftercare: "Crear version publica." },
      { title: "Grafico sin contexto", summary: "La imagen no dice periodo ni unidad.", goal: "Mejorar lectura.", trigger: "visualizacion ambigua", courseAction: "agregar titulo, ejes y nota", evidence: "grafico antes/despues", error: "Cambiar colores solamente.", aftercare: "Checklist de graficos." },
      { title: "Notebook no reproducible", summary: "Corre solo si se ejecutan celdas en orden raro.", goal: "Ordenar flujo.", trigger: "variables invisibles", courseAction: "reiniciar y ejecutar de arriba abajo", evidence: "run limpio", error: "Mandar notebook sin probar reinicio.", aftercare: "Agregar instrucciones de ejecucion." }
    ]
  },
  {
    folder: "excel_google_sheets_desde_cero_v0_6_publica",
    shortId: "sheets0",
    title: "Excel y Google Sheets desde Cero",
    shortName: "Excel y Sheets",
    subtitle: "Tablas, formulas, filtros, validacion, graficos, colaboracion y reportes simples.",
    description: "Curso practico para usar planillas desde cero con datos ordenados, formulas verificables y reportes claros.",
    audience: "Principiantes, trabajadores, estudiantes, docentes y emprendedores que necesitan ordenar datos en planillas.",
    portalCategory: "Productividad",
    practiceArea: "planillas iniciales para trabajo, estudio y emprendimientos",
    exampleContext: "Una persona lleva ventas, gastos, asistencia o tareas en una planilla y necesita ordenar datos sin romper formulas.",
    finalArtifact: "planilla simple con tabla limpia, formulas, filtros, validacion, grafico y resumen",
    modules: [
      m("Planilla bien armada", "Crear estructura con encabezados, filas, columnas y criterios de carga.", "tabla inicial con encabezados claros y ejemplo de carga", "la planilla permite agregar filas sin romper lectura", "tabla base ordenada", "Mezclar titulos, totales y datos en cualquier celda.", "Cuando la planilla se comparte o contiene datos sensibles.", "Una buena planilla empieza por estructura.", ["Filas y columnas", "Encabezados", "Una fila por registro", "Formatos basicos", "Congelar paneles", "Nombrar hojas"]),
      m("Carga y limpieza de datos", "Evitar errores de tipeo, duplicados, formatos raros y celdas vacias.", "datos revisados con reglas de limpieza", "los errores frecuentes estan detectados y corregidos", "planilla limpia", "Corregir a mano sin criterio repetible.", "Cuando los datos alimentan pagos, reportes o decisiones.", "Limpiar no es maquillar: es hacer datos confiables.", ["Espacios y mayusculas", "Duplicados", "Fechas", "Numeros como texto", "Celdas vacias", "Reglas de carga"]),
      m("Formulas esenciales", "Usar SUMA, PROMEDIO, SI, CONTAR.SI y referencias con cuidado.", "formulas con prueba manual y celdas fuente identificadas", "la formula se entiende y coincide con calculo de control", "hoja de formulas basicas", "Copiar formulas sin revisar referencias.", "Cuando la formula calcula dinero, notas o indicadores.", "Una formula incorrecta se replica rapido.", ["SUMA", "PROMEDIO", "SI", "CONTAR.SI", "Referencias relativas", "Copiar formulas"]),
      m("Filtros, tablas y resumenes", "Filtrar, ordenar, agrupar y resumir datos para responder preguntas.", "vista filtrada y resumen por categoria", "el resumen responde una pregunta clara", "tabla filtrable con resumen", "Ordenar una sola columna y desarmar la tabla.", "Cuando se comparte una vista filtrada con otras personas.", "Antes de ordenar, seleccionar toda la tabla.", ["Filtros", "Ordenar", "Tablas", "Subtotal simple", "Tablas dinamicas iniciales", "Preguntas de analisis"]),
      m("Graficos y presentacion", "Elegir graficos simples, titulos claros y mensajes utiles.", "grafico con titulo, fuente y lectura principal", "el grafico comunica tendencia, comparacion o composicion sin confusion", "mini reporte visual", "Elegir grafico por decoracion.", "Cuando el grafico se usa para decidir o publicar.", "Un grafico necesita pregunta y contexto.", ["Barras", "Lineas", "Torta con cuidado", "Titulos", "Etiquetas", "Resumen ejecutivo"]),
      m("Colaboracion y proteccion", "Compartir, comentar, proteger rangos y evitar cambios accidentales.", "planilla compartida con permisos y zonas protegidas", "cada persona sabe que puede editar y que no", "planilla lista para colaborar", "Dar permiso de edicion total sin necesidad.", "Cuando hay datos personales, clientes, notas o dinero.", "Compartir una planilla tambien comparte responsabilidad.", ["Permisos", "Comentarios", "Historial de cambios", "Proteccion de rangos", "Versiones", "Exportar o publicar"])
    ],
    cases: [
      { title: "Tabla rota por ordenar una columna", summary: "Los nombres ya no coinciden con montos.", goal: "Prevenir ordenamientos parciales.", trigger: "orden aplicado a una sola columna", courseAction: "reconstruir desde backup y usar filtros de tabla", evidence: "captura antes/despues", error: "Ordenar columnas sueltas.", aftercare: "Convertir rango en tabla." },
      { title: "Formula arrastrada mal", summary: "La referencia cambia donde no debe.", goal: "Entender referencias.", trigger: "resultado incoherente", courseAction: "revisar celdas relativas/absolutas", evidence: "formula antes/despues", error: "Cambiar resultado manualmente.", aftercare: "Probar una formula antes de copiar." },
      { title: "Fechas mezcladas", summary: "Algunas fechas son texto y no filtran.", goal: "Normalizar formato.", trigger: "filtro por mes falla", courseAction: "convertir fechas y validar", evidence: "conteo de fechas corregidas", error: "Cambiar formato visual solamente.", aftercare: "Usar validacion de fecha." },
      { title: "Planilla compartida con permisos excesivos", summary: "Cualquiera puede editar datos criticos.", goal: "Ajustar permisos.", trigger: "link abierto", courseAction: "limitar acceso y proteger rangos", evidence: "permisos antes/despues", error: "Confiar en que nadie tocara nada.", aftercare: "Revisar accesos mensualmente." },
      { title: "Grafico confuso", summary: "El grafico no responde una pregunta.", goal: "Elegir visual adecuado.", trigger: "grafico decorativo", courseAction: "definir pregunta y rehacer visual", evidence: "grafico antes/despues", error: "Agregar colores sin cambiar estructura.", aftercare: "Checklist de graficos." },
      { title: "Duplicados en lista de clientes", summary: "El conteo de clientes esta inflado.", goal: "Detectar duplicados con criterio.", trigger: "nombres repetidos", courseAction: "identificar clave y revisar casos", evidence: "lista de duplicados", error: "Eliminar todos los repetidos sin revisar.", aftercare: "Definir identificador unico." },
      { title: "Celda con dato sensible en captura", summary: "Se comparte una imagen con telefonos o documentos.", goal: "Ocultar o anonimizar antes de compartir.", trigger: "captura enviada", courseAction: "crear version anonima", evidence: "campos removidos", error: "Tapar solo una parte y dejar otra visible.", aftercare: "Crear hoja publica." },
      { title: "Resumen manual con errores", summary: "El total se calcula a mano y no coincide.", goal: "Usar formula verificable.", trigger: "suma manual", courseAction: "crear formula y comparar contra muestra", evidence: "resultado manual vs formula", error: "Editar el total para que cierre.", aftercare: "Bloquear formulas importantes." }
    ]
  }
];

for (const config of courses) writeCourseFiles(config);
updatePortalInventory(courses);
updateDocs(courses);

console.log(`Tanda 3 reforzada: ${courses.length} cursos`);
for (const config of courses) {
  const data = readJson(path.join(coursesRoot, config.folder, "src", "data", "course_content.json"));
  const lessons = data.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const quiz = data.modules.reduce((sum, module) => sum + module.quiz.length, 0);
  console.log(`- ${config.folder}: ${data.modules.length} modulos, ${lessons} lecciones, ${quiz} preguntas`);
}

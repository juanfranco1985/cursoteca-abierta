import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesRoot = path.join(root, "cursos");
const portalDataDir = path.join(root, "portal", "portal_publico_profesional_v0_6", "data");
const version = "0.7-tanda-4";
const publicationStatus = "publica-profesional-v0.7-tanda-4";
const date = "2026-06-05";

const responsibleNotice = "Contenido educativo introductorio. No reemplaza asesoramiento profesional, soporte oficial ni normativa aplicable. Si la decision afecta dinero, seguridad, datos personales, salud, trabajo o derechos, valida con fuentes oficiales o una persona competente antes de actuar.";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function lower(text) {
  return String(text).toLowerCase();
}

function buildLesson(id, module, raw, config) {
  const item = typeof raw === "string" ? { title: raw } : raw;
  return {
    id,
    title: item.title,
    keyIdea: item.idea || `${item.title} convierte una intencion general en una accion concreta que se puede revisar con evidencia.`,
    shortTheory: item.theory || `En esta leccion se trabaja ${lower(item.title)} dentro de ${lower(module.title)}. La meta es aplicar el concepto en una situacion pequena, medir si funciona y dejar un criterio claro para repetirlo.`,
    practicalExample: item.example || `${config.exampleContext} Aplica ${lower(item.title)}, guarda ${module.evidence} y anota que decision permite tomar.`,
    commonMistake: item.mistake || `El error habitual es resolver por intuicion, copiar un formato ajeno o publicar sin probar si el resultado ayuda a la persona destinataria.`,
    whatToDoNow: item.practice || `Practica de 25 minutos: arma una version pequena de ${lower(item.title)}, revisala con ${module.criterion} y registra evidencia, limite y proxima mejora.`,
    alert: item.alert || module.alert,
    keyPoints: [
      item.point || `${item.title} debe terminar en una salida visible, no solo en una idea.`,
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
        "Objetivo, destinatario, contexto y evidencia de cierre.",
        "La herramienta mas rapida aunque no responda al caso.",
        "Un resultado final sin pruebas intermedias.",
        "Un formato copiado sin adaptarlo."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: el modulo se vuelve util cuando parte de una necesidad real y una prueba concreta."
    },
    {
      id: `${id}-q2`,
      question: "Que evidencia permite cerrar el modulo con mas confianza?",
      options: [
        module.evidence,
        "Una opinion general sin contexto.",
        "Una captura que no muestra que se valido.",
        "Un archivo lindo sin explicar decision."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.evidence} permite revisar el resultado y mejorarlo.`
    },
    {
      id: `${id}-q3`,
      question: "Que conducta aumenta el riesgo de obtener un resultado pobre?",
      options: [
        module.riskyChoice,
        "Probar con un caso pequeno antes de publicar o usar.",
        "Guardar decisiones y supuestos.",
        "Pedir revision si afecta trabajo, dinero, datos o reputacion."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: esa conducta elimina trazabilidad y hace dificil corregir errores."
    },
    {
      id: `${id}-q4`,
      question: "Cuando corresponde pedir ayuda o validar con una fuente confiable?",
      options: [
        module.helpTrigger,
        "Nunca, porque un curso introductorio alcanza para cualquier caso.",
        "Solo despues de compartir datos sensibles.",
        "Cuando ya no se puede corregir el resultado."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: validar a tiempo evita decisiones inseguras o dificiles de sostener."
    },
    {
      id: `${id}-q5`,
      question: `Cual es el entregable minimo de "${module.title}"?`,
      options: [
        module.deliverable,
        "Una lista de ideas sin evidencia.",
        "Un resumen sin destinatario.",
        "Un archivo final sin criterio de calidad."
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
      learningRisk: module.learningRisk || "Practicar sin evidencia puede dejar resultados dificiles de explicar, vender, sostener o mejorar.",
      lessons: module.lessons.map((item, lessonIndex) => buildLesson(`m${moduleIndex + 1}-l${lessonIndex + 1}`, module, item, config)),
      quiz: quizForModule(module, moduleIndex)
    }))
  };
}

const checklistItems = [
  "Resultado esperado escrito",
  "Destinatario o usuario definido",
  "Insumos preparados",
  "Criterio de calidad aplicado",
  "Evidencia guardada",
  "Siguiente accion priorizada"
];

function buildChecklists(config) {
  return {
    checklists: config.modules.map((module, moduleIndex) => ({
      id: `${config.shortId}-checklist-${moduleIndex + 1}`,
      title: `${module.title}: checklist operativo`,
      description: `Control breve para aplicar ${lower(module.title)} en ${config.practiceArea} con resultado revisable.`,
      commercialArea: config.practiceArea,
      items: checklistItems.map((title, itemIndex) => ({
        id: `${config.shortId}-cl${moduleIndex + 1}-i${itemIndex + 1}`,
        title,
        explanation: `${title} reduce improvisacion y deja trazabilidad durante ${lower(module.title)}.`,
        recommendedAction: `Aplicar sobre un caso pequeno y guardar ${module.evidence}. Cierre esperado: ${module.criterion}.`
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
        "Validar el resultado con una prueba pequena o una persona competente si corresponde.",
        "Cerrar con decision, limite detectado y proxima mejora."
      ],
      evidenceToPreserve: [
        "Consigna o caso de partida",
        item.evidence,
        "Version inicial y version corregida",
        "Decision tomada y motivo",
        "Riesgo o duda pendiente"
      ],
      errorsToAvoid: [
        item.error,
        "Usar datos sensibles en practicas educativas.",
        "Publicar sin revisar contexto, permisos o consecuencias.",
        "Copiar formatos sin adaptarlos al destinatario.",
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
            text: "Usar el primer resultado porque parece suficiente.",
            isCorrect: false,
            feedback: "La apariencia no alcanza sin prueba ni criterio de cierre."
          },
          {
            text: "Compartir mas datos reales para que el ejercicio sea mas completo.",
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
    templateVersion: "0.7-publica-profesional-tanda-4",
    appName: config.title,
    shortName: config.shortName,
    subtitle: config.subtitle,
    description: config.description,
    audience: config.audience,
    responsibleNotice,
    cacheName: `${config.folder}-cache-${version}`,
    contentAudit: {
      status: "reforzado-tanda-4",
      date,
      modules: 6,
      lessons: 36,
      quizQuestions: 30,
      checklists: 6,
      cases: 8,
      notes: "Contenido reemplazado para reducir patrones genericos en cursos de trabajo, productividad y emprendimiento."
    }
  });
  manifest.labels = {
    ...(manifest.labels || {}),
    modules: "Modulos de aprendizaje",
    checklists: "Checklists operativos",
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
    reinforcedBatch4: true,
    publicationCandidate: true,
    publicProfessionalEdition: true,
    requiresBackend: false,
    requiresLogin: false
  };
  const note = "v0.7 tanda 4 reemplaza contenido generico por modulos, practicas, checklists y casos especificos en cursos de trabajo y emprendimiento.";
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
  const courseId = readJson(manifestPath).courseId;
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
    course.version = "v0.7 tanda 4 reforzada";
    course.status = "Curso reforzado - tanda 4";
    course.category = config.portalCategory || course.category;
    course.audience = config.audience;
    course.description = config.description;
    course.features = [
      "6 modulos",
      "36 lecciones reforzadas",
      "30 preguntas",
      "6 checklists operativos",
      "8 casos guiados",
      "Sin backend ni login"
    ];
    course.recommendedBase = "Contenido reforzado con practicas, evidencia, casos de trabajo y criterios de cierre.";
    course.tags = [...new Set([...(course.tags || []), "reforzado-tanda-4", "contenido-v0-7", "trabajo-emprendimiento"])];
    course.publicReady = true;
  }
  writeJson(coursesFile, courses);

  const csvFile = path.join(portalDataDir, "courses_inventory.csv");
  if (fs.existsSync(csvFile)) {
    let csv = fs.readFileSync(csvFile, "utf8");
    for (const config of configs) {
      const lineRegex = new RegExp(`^${config.folder},.*$`, "m");
      csv = csv.replace(lineRegex, `${config.folder},${csvCell(config.title)},v0.7 tanda 4 reforzada,Curso reforzado - tanda 4,${csvCell(config.portalCategory || config.practiceArea)},${csvCell(config.audience)},../../cursos/${config.folder}/index.html,true,true`);
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
    text = text.replace(
      "Pendientes actuales despues de UX/UI, tanda 1, tanda 2 y tanda 3:",
      "Pendientes actuales despues de UX/UI, tanda 1, tanda 2, tanda 3 y tanda 4:"
    );
    const marker = "## Tanda 4 de refuerzo";
    const block = `${marker}\n\nCompletada el ${date} con 5 cursos de trabajo y emprendimiento reforzados:\n\n${configs.map(config => `- ${config.folder}: 6 modulos, 36 lecciones, 30 preguntas, 6 checklists y 8 casos guiados.`).join("\n")}\n\nDeuda de contenido generico despues de esta tanda: 12 cursos.\n`;
    if (!text.includes(marker)) text = `${text.trim()}\n\n${block}\n`;
    fs.writeFileSync(auditFile, text, "utf8");
  }

  const checklistFile = path.join(root, "CHECKLIST_PUBLICACION_BETA.md");
  if (fs.existsSync(checklistFile)) {
    let text = fs.readFileSync(checklistFile, "utf8");
    if (!text.includes("Reforzar cuarta tanda de 5 cursos de trabajo y emprendimiento")) {
      text = text.replace(
        "- [ ] Reforzar los 17 cursos restantes con patrones de contenido generico.",
        "- [x] Reforzar cuarta tanda de 5 cursos de trabajo y emprendimiento.\n- [ ] Reforzar los 12 cursos restantes con patrones de contenido generico."
      );
    }
    fs.writeFileSync(checklistFile, text, "utf8");
  }

  const pendingFile = path.join(root, "PENDIENTES_REALES_V1_0_BETA.md");
  if (fs.existsSync(pendingFile)) {
    let text = fs.readFileSync(pendingFile, "utf8");
    text = text.replace(
      /la tanda 3 reforzo 5 cursos de alta visibilidad\.\s+Quedan 17 cursos por trabajar antes de considerar v1\.0 final\./,
      "la tanda 3 reforzo 5 cursos de alta visibilidad y la tanda 4 reforzo 5 cursos de trabajo y emprendimiento. Quedan 12 cursos por trabajar antes de considerar v1.0 final."
    );
    fs.writeFileSync(pendingFile, text, "utf8");
  }
}

function m(title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons) {
  return { title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons };
}

const courses = [
  {
    folder: "cv_linkedin_busqueda_laboral_v0_6_publica",
    shortId: "cvlin",
    title: "CV, LinkedIn y Busqueda Laboral Digital",
    shortName: "CV y LinkedIn",
    subtitle: "Perfil laboral, CV verificable, LinkedIn, postulaciones, entrevistas y portafolio.",
    description: "Curso practico para preparar una busqueda laboral digital con CV claro, LinkedIn profesional, registro de postulaciones y evidencia de mejora.",
    audience: "Personas que buscan empleo, cambio laboral, primera experiencia, becas, practicas o mejores oportunidades.",
    portalCategory: "Empleabilidad",
    practiceArea: "busqueda laboral digital y marca profesional",
    exampleContext: "Una persona quiere postularse a empleos reales y necesita ordenar experiencia, mostrar logros y sostener seguimiento sin improvisar.",
    finalArtifact: "kit laboral con CV, perfil LinkedIn, mensaje de postulacion, registro de busqueda y plan de mejora de 30 dias",
    modules: [
      m("Perfil laboral y objetivo", "Definir que trabajo se busca, que evidencia se tiene y que brechas hay que cerrar.", "matriz de puesto objetivo, evidencias y brechas", "el objetivo laboral tiene puesto, sector, condiciones y evidencia asociada", "perfil laboral objetivo", "Postularse a cualquier aviso sin criterio.", "Cuando se comparten datos personales, pretension salarial o informacion laboral sensible.", "Una busqueda clara evita enviar el mismo CV a cualquier lugar.", ["Objetivo de busqueda", "Puesto deseado", "Evidencias laborales", "Logros medibles", "Brecha de habilidades", "Plan de postulacion"]),
      m("CV claro y verificable", "Armar un CV breve, ordenado y orientado a logros reales.", "CV de una pagina o dos con logros y palabras clave revisadas", "cada bloque aporta informacion verificable para el puesto objetivo", "CV en PDF listo para enviar", "Inflar experiencia o copiar frases genericas.", "Cuando una postulacion pide datos, documentos o referencias.", "El CV debe ayudar a decidir una entrevista, no contar toda la vida.", ["Estructura del CV", "Resumen profesional", "Experiencia por logros", "Educacion y cursos", "Palabras clave ATS", "Version PDF y nombre"]),
      m("LinkedIn profesional", "Convertir LinkedIn en un perfil consistente con el CV y visible para oportunidades.", "perfil revisado con titular, acerca de, experiencia y aptitudes", "el perfil comunica especialidad, evidencia y forma de contacto adecuada", "perfil LinkedIn optimizado", "Usar LinkedIn como copia desordenada del CV.", "Cuando se publica informacion personal o laboral que no conviene exponer.", "LinkedIn muestra criterio incluso antes de una entrevista.", ["Titular profesional", "Acerca de", "Experiencia", "Aptitudes", "Actividad", "Privacidad"]),
      m("Busqueda y postulacion", "Encontrar avisos adecuados, leer requisitos y registrar postulaciones.", "planilla de postulaciones con fuente, fecha, requisitos y estado", "cada postulacion tiene ajuste minimo y seguimiento", "sistema de seguimiento laboral", "Enviar postulaciones masivas sin adaptar nada.", "Cuando el aviso pide pagos, datos sensibles o canales dudosos.", "Un registro evita perder oportunidades y repetir errores.", ["Mapa de portales", "Filtros utiles", "Analisis del aviso", "Carta o mensaje breve", "Registro de postulaciones", "Seguimiento"]),
      m("Entrevistas y mensajes", "Preparar respuestas, preguntas y comunicaciones profesionales.", "guion de presentacion y respuestas STAR para tres situaciones", "las respuestas muestran situacion, accion, resultado y aprendizaje", "kit de entrevista", "Improvisar respuestas criticas sin ejemplos concretos.", "Cuando una oferta exige decision economica, contrato o traslado.", "La entrevista se prepara con historias reales, no con frases perfectas.", ["Presentacion de 60 segundos", "Metodo STAR", "Preguntas frecuentes", "Preguntas al empleador", "Mensaje a reclutador", "Seguimiento amable"]),
      m("Portafolio y mejora", "Mostrar evidencias de trabajo y mejorar la busqueda con datos.", "portafolio o carpeta de evidencias con plan de revision", "cada evidencia tiene contexto, resultado y relacion con el puesto", "plan de mejora laboral de 30 dias", "Esperar resultados sin medir postulaciones ni respuestas.", "Cuando se publican trabajos con datos de clientes, empresas o terceros.", "El portafolio debe probar capacidad sin exponer informacion privada.", ["Evidencias de trabajo", "Proyecto muestra", "Referencias", "Revision del CV", "Metricas de busqueda", "Plan de 30 dias"])
    ],
    cases: [
      { title: "CV con tareas pero sin logros", summary: "El CV enumera responsabilidades sin mostrar impacto.", goal: "Convertir tareas en logros verificables.", trigger: "experiencia escrita como lista generica", courseAction: "reescribir con accion, resultado y evidencia", evidence: "version antes/despues de tres bullets", error: "Inventar numeros para sonar mejor.", aftercare: "Guardar banco de logros reales." },
      { title: "LinkedIn no coincide con el CV", summary: "El perfil dice una cosa y el CV otra.", goal: "Alinear mensaje profesional.", trigger: "inconsistencia entre documentos", courseAction: "unificar puesto objetivo, resumen y experiencia", evidence: "checklist de consistencia", error: "Cambiar solo el titulo del perfil.", aftercare: "Revisar perfil cada mes." },
      { title: "Aviso laboral sospechoso", summary: "Piden pago o datos sensibles antes de entrevistar.", goal: "Detectar senales de riesgo.", trigger: "pedido inusual de dinero o documentos", courseAction: "verificar empresa, canal y requisitos", evidence: "capturas y fuente de verificacion", error: "Enviar documentos por apuro.", aftercare: "Crear lista de alertas." },
      { title: "Postulaciones sin seguimiento", summary: "La persona no recuerda donde envio CV.", goal: "Crear registro simple.", trigger: "postulaciones dispersas", courseAction: "armar planilla con fecha, puesto, ajuste y estado", evidence: "registro de 10 postulaciones", error: "Confiar en la memoria.", aftercare: "Revisar semanalmente." },
      { title: "Entrevista sin ejemplos", summary: "Las respuestas quedan generales.", goal: "Preparar historias STAR.", trigger: "preguntas sobre experiencia real", courseAction: "escribir situacion, tarea, accion y resultado", evidence: "tres respuestas STAR", error: "Memorizar frases vacias.", aftercare: "Actualizar banco de historias." },
      { title: "Portafolio con datos privados", summary: "Una muestra incluye clientes o informacion interna.", goal: "Anonimizar evidencia.", trigger: "archivo real compartible solo internamente", courseAction: "crear version simulada o anonimizada", evidence: "version publica de la muestra", error: "Tapar datos en una captura y dejar metadata.", aftercare: "Crear carpeta publica separada." },
      { title: "Perfil sin foco", summary: "El CV intenta cubrir demasiados puestos distintos.", goal: "Crear versiones por objetivo.", trigger: "mezcla de perfiles incompatibles", courseAction: "priorizar dos perfiles y adaptar palabras clave", evidence: "dos versiones de CV", error: "Enviar un CV unico para todo.", aftercare: "Mantener plantilla base." },
      { title: "Oferta requiere decision rapida", summary: "La propuesta llega sin condiciones claras.", goal: "Pedir informacion antes de aceptar.", trigger: "oferta incompleta", courseAction: "listar dudas sobre sueldo, horario, contrato y tareas", evidence: "mensaje de consulta", error: "Aceptar por presion.", aftercare: "Guardar checklist de oferta." }
    ]
  },
  {
    folder: "teletrabajo_seguro_productivo_v0_6_publica",
    shortId: "tele",
    title: "Teletrabajo Seguro y Productivo",
    shortName: "Teletrabajo",
    subtitle: "Rutinas, seguridad, comunicacion asincronica, foco, archivos y limites saludables.",
    description: "Curso practico para trabajar remoto con organizacion, seguridad digital, comunicacion clara y cuidado de tiempos personales.",
    audience: "Personas que trabajan desde casa, equipos hibridos, freelancers, estudiantes y emprendimientos con colaboracion remota.",
    portalCategory: "Trabajo remoto",
    practiceArea: "teletrabajo seguro y productividad personal",
    exampleContext: "Un equipo remoto necesita coordinar tareas, proteger cuentas, compartir archivos y sostener entregas sin depender de reuniones constantes.",
    finalArtifact: "rutina de teletrabajo con reglas de comunicacion, seguridad, archivos, foco y revision semanal",
    modules: [
      m("Espacio y rutina", "Preparar un entorno de trabajo realista con horarios, pausas y condiciones minimas.", "rutina semanal con bloques, pausas y condiciones de trabajo", "la rutina protege foco, energia y disponibilidad", "plan semanal de teletrabajo", "Trabajar todo el dia sin limites ni pausas.", "Cuando el trabajo afecta salud, contratos, cuidados o responsabilidades familiares.", "Teletrabajar no significa estar disponible todo el tiempo.", ["Lugar de trabajo", "Horario base", "Inicio y cierre", "Pausas", "Ergonomia simple", "Ritual de revision"]),
      m("Seguridad de cuentas y dispositivos", "Reducir riesgos en cuentas, redes, archivos y dispositivos usados para trabajar.", "checklist de seguridad aplicado a cuenta y equipo", "las cuentas criticas tienen proteccion y recuperacion documentada", "plan de seguridad remoto", "Usar la misma clave en cuentas personales y laborales.", "Cuando hay datos de clientes, empresa, pagos o informacion confidencial.", "La seguridad remota empieza antes del incidente.", ["Claves", "Doble factor", "Bloqueo de pantalla", "Red Wi-Fi", "Actualizaciones", "Separacion personal/laboral"]),
      m("Comunicacion asincronica", "Escribir mensajes, acuerdos y pedidos que eviten reuniones innecesarias.", "mensaje de tarea con contexto, pedido, fecha y criterio de cierre", "otra persona puede actuar sin preguntar lo basico", "protocolo de comunicacion", "Mandar mensajes incompletos y resolver todo por urgencia.", "Cuando un malentendido puede afectar plazos, clientes o pagos.", "Un buen mensaje ahorra reuniones.", ["Contexto", "Pedido concreto", "Fecha limite", "Canal adecuado", "Resumen de acuerdos", "Decision documentada"]),
      m("Productividad y foco", "Priorizar tareas, reducir interrupciones y medir entregables reales.", "tablero semanal con prioridades, bloqueos y entregables", "cada bloque de trabajo tiene salida concreta", "sistema de foco semanal", "Confundir estar conectado con avanzar.", "Cuando la sobrecarga afecta salud o compromisos laborales.", "La productividad remota se mide por entregables, no por presencia.", ["Prioridades", "Bloques de foco", "Interrupciones", "Reuniones utiles", "Bloqueos", "Revision diaria"]),
      m("Archivos y colaboracion", "Ordenar documentos, permisos, versiones y responsabilidades compartidas.", "estructura de carpetas con permisos y convencion de nombres", "los archivos importantes se encuentran, se entienden y se protegen", "sistema de archivos remoto", "Compartir links abiertos sin revisar permisos.", "Cuando los archivos incluyen datos personales, comerciales o confidenciales.", "Un archivo mal compartido puede ser un incidente.", ["Carpetas", "Nombres de archivo", "Versiones", "Permisos", "Comentarios", "Backup"]),
      m("Bienestar y limites", "Sostener rendimiento sin quemarse ni mezclar todo el dia con trabajo.", "acuerdo personal de limites, pausas y alertas de sobrecarga", "los limites estan escritos y se revisan", "plan de bienestar remoto", "Responder siempre fuera de horario por costumbre.", "Cuando aparecen sintomas de sobrecarga, aislamiento o conflicto laboral.", "Los limites tambien son parte del sistema de trabajo.", ["Cierre del dia", "Notificaciones", "Pausas reales", "Reuniones seguras", "Senales de sobrecarga", "Conversaciones dificiles"])
    ],
    cases: [
      { title: "Link abierto con archivos internos", summary: "Un documento queda visible para cualquiera con enlace.", goal: "Corregir permisos.", trigger: "link compartido sin restriccion", courseAction: "revisar acceso, cambiar permisos y avisar al equipo", evidence: "permisos antes/despues", error: "Confiar en que nadie lo abrira.", aftercare: "Auditar links compartidos." },
      { title: "Reuniones que ocupan todo el dia", summary: "No quedan bloques para trabajo profundo.", goal: "Reducir y ordenar reuniones.", trigger: "agenda fragmentada", courseAction: "definir objetivo, agenda y decision esperada", evidence: "agenda antes/despues", error: "Aceptar todas las reuniones sin preguntar objetivo.", aftercare: "Crear regla de reuniones." },
      { title: "Clave personal usada en trabajo", summary: "La misma clave se usa en varias cuentas.", goal: "Separar y proteger credenciales.", trigger: "reutilizacion de contrasena", courseAction: "crear claves unicas y activar doble factor", evidence: "checklist de cuentas protegidas", error: "Cambiar solo una clave.", aftercare: "Usar gestor de contrasenas." },
      { title: "Mensaje urgente sin contexto", summary: "Una persona recibe un pedido confuso.", goal: "Reescribir pedido asincronico.", trigger: "mensaje corto y ambiguo", courseAction: "agregar contexto, pedido, fecha y criterio", evidence: "mensaje corregido", error: "Resolver con cadena de audios.", aftercare: "Usar plantilla de pedido." },
      { title: "Archivo final final version 3", summary: "No se sabe cual es el documento correcto.", goal: "Ordenar versiones.", trigger: "multiples archivos con nombres confusos", courseAction: "definir convencion y responsable", evidence: "carpeta reorganizada", error: "Borrar archivos sin backup.", aftercare: "Crear politica de nombres." },
      { title: "Disponibilidad permanente", summary: "Se responde de noche y fines de semana sin acuerdo.", goal: "Definir limites.", trigger: "notificaciones fuera de horario", courseAction: "escribir horarios, excepciones y canal urgente", evidence: "acuerdo de disponibilidad", error: "Responder siempre para evitar conflicto.", aftercare: "Revisar limites con el equipo." },
      { title: "Wi-Fi publico para tareas sensibles", summary: "Se trabaja con datos internos desde una red abierta.", goal: "Reducir exposicion.", trigger: "red insegura", courseAction: "posponer tarea sensible o usar conexion segura", evidence: "decision y alternativa", error: "Enviar archivos porque es rapido.", aftercare: "Crear regla para redes publicas." },
      { title: "Tablero lleno sin prioridades", summary: "Hay muchas tareas pero no se sabe que importa.", goal: "Priorizar por impacto y fecha.", trigger: "lista acumulada", courseAction: "clasificar urgente, importante, bloqueado y delegable", evidence: "tablero priorizado", error: "Trabajar por orden de llegada.", aftercare: "Revision semanal." }
    ]
  },
  {
    folder: "notion_trello_organizacion_v0_6_publica",
    shortId: "notrell",
    title: "Notion, Trello y Organizacion Personal",
    shortName: "Notion y Trello",
    subtitle: "Captura, tareas, proyectos, tableros, bases simples y revision semanal.",
    description: "Curso practico para construir un sistema personal de organizacion con herramientas visuales sin convertir la herramienta en una carga.",
    audience: "Estudiantes, trabajadores, freelancers, docentes y emprendedores que necesitan ordenar tareas, proyectos e informacion.",
    portalCategory: "Productividad",
    practiceArea: "organizacion personal con Notion y Trello",
    exampleContext: "Una persona tiene tareas dispersas entre chats, notas y memoria, y necesita un sistema simple para priorizar y avanzar.",
    finalArtifact: "sistema personal con bandeja de entrada, tablero de proyectos, base de notas y revision semanal",
    modules: [
      m("Sistema personal simple", "Definir que problema de organizacion se quiere resolver antes de abrir plantillas.", "mapa de entradas, tareas, proyectos y revisiones", "el sistema tiene pocos lugares y reglas claras", "diseno del sistema personal", "Instalar plantillas complejas que no se usan.", "Cuando el sistema contiene datos laborales, clientes o informacion sensible.", "La herramienta debe servir al trabajo, no al reves.", ["Problema real", "Entradas", "Tareas", "Proyectos", "Notas", "Reglas minimas"]),
      m("Captura y bandeja de entrada", "Guardar pendientes sin perderlos y procesarlos con criterio.", "bandeja de entrada con tareas procesadas y descartadas", "cada elemento termina en hacer, agendar, delegar, archivar o descartar", "flujo de captura", "Anotar todo sin procesar nunca.", "Cuando un pendiente afecta plazos, dinero o compromisos con otras personas.", "Capturar no es organizar: falta decidir.", ["Captura rapida", "Inbox", "Procesar", "Delegar", "Agendar", "Archivar"]),
      m("Tareas y prioridades", "Convertir pendientes en acciones concretas con fecha, contexto y energia.", "lista priorizada con proxima accion y fecha realista", "cada tarea se puede ejecutar sin reinterpretarla", "tablero de tareas semanal", "Escribir tareas enormes como si fueran acciones.", "Cuando una mala prioridad afecta entregas, clientes o salud.", "Una tarea buena empieza con verbo y tiene cierre.", ["Proxima accion", "Fechas", "Prioridad", "Contexto", "Bloqueos", "Cierre"]),
      m("Proyectos en Trello", "Usar columnas, tarjetas, etiquetas y responsables para avanzar proyectos.", "tablero Trello con flujo, tarjetas y criterios de cierre", "el tablero muestra estado real sin exceso de columnas", "tablero de proyecto", "Crear columnas para decorar y no para decidir.", "Cuando el tablero coordina trabajo de varias personas.", "Un tablero debe mostrar trabajo, no ocultarlo.", ["Columnas", "Tarjetas", "Etiquetas", "Checklist", "Responsables", "Revision"]),
      m("Bases simples en Notion", "Crear bases de datos pequenas para notas, recursos, clientes o clases.", "base Notion con propiedades utiles y vistas simples", "la base permite encontrar informacion y decidir siguiente paso", "base de informacion personal", "Crear demasiadas propiedades sin uso.", "Cuando la base contiene datos personales o comerciales.", "Menos propiedades bien usadas ganan a una base gigante.", ["Propiedades", "Vistas", "Filtros", "Plantillas", "Relacion simple", "Archivo"]),
      m("Revision y mantenimiento", "Evitar que el sistema se ensucie con una rutina de revision.", "revision semanal con pendientes cerrados, movidos o descartados", "el sistema se mantiene en menos de 30 minutos semanales", "rutina de mantenimiento", "Cambiar de herramienta cada vez que el sistema se desordena.", "Cuando se acumulan atrasos o compromisos incumplidos.", "La revision es parte del sistema, no un extra.", ["Revision diaria", "Revision semanal", "Limpiar inbox", "Actualizar proyectos", "Medir carga", "Ajustar reglas"])
    ],
    cases: [
      { title: "Plantilla gigante abandonada", summary: "La persona copio una plantilla y dejo de usarla.", goal: "Simplificar sistema.", trigger: "demasiadas secciones vacias", courseAction: "volver a entradas, tareas, proyectos y revision", evidence: "sistema reducido", error: "Buscar otra plantilla mas completa.", aftercare: "Limitar cambios por 30 dias." },
      { title: "Inbox con cien pendientes", summary: "Todo se guarda pero nada se procesa.", goal: "Procesar por decision.", trigger: "bandeja saturada", courseAction: "clasificar hacer, agendar, delegar, archivar o descartar", evidence: "inbox antes/despues", error: "Reordenar sin decidir.", aftercare: "Procesar dos veces por semana." },
      { title: "Tarea imposible de empezar", summary: "La tarjeta dice 'mejorar negocio'.", goal: "Convertir en proxima accion.", trigger: "tarea demasiado grande", courseAction: "dividir en acciones concretas", evidence: "tarjeta reescrita", error: "Poner fecha a una tarea vaga.", aftercare: "Usar verbos de accion." },
      { title: "Tablero con columnas confusas", summary: "Nadie entiende que significa cada estado.", goal: "Definir flujo.", trigger: "columnas duplicadas o ambiguas", courseAction: "acordar estados y criterio de movimiento", evidence: "flujo documentado", error: "Agregar mas columnas.", aftercare: "Revisar flujo mensualmente." },
      { title: "Base de Notion lenta y desordenada", summary: "Demasiadas propiedades traban el uso.", goal: "Reducir propiedades.", trigger: "base dificil de mantener", courseAction: "quitar campos sin decision asociada", evidence: "base simplificada", error: "Agregar iconos y colores solamente.", aftercare: "Auditar propiedades." },
      { title: "Pendientes vencidos ocultos", summary: "Las fechas pasadas no se revisan.", goal: "Crear vista de atrasos.", trigger: "tareas vencidas", courseAction: "filtrar vencidas y replanificar", evidence: "vista de atrasos", error: "Cambiar todas las fechas al futuro.", aftercare: "Revision semanal fija." },
      { title: "Informacion sensible en tablero compartido", summary: "Se suben datos privados a una tarjeta.", goal: "Separar informacion sensible.", trigger: "tablero compartido con terceros", courseAction: "retirar datos y ajustar permisos", evidence: "tarjeta corregida", error: "Confiar en que nadie la vera.", aftercare: "Definir regla de datos." },
      { title: "Sistema sin cierre", summary: "Las tareas completadas quedan mezcladas.", goal: "Cerrar y archivar.", trigger: "tablero lleno de tareas viejas", courseAction: "crear criterio de finalizado y archivo", evidence: "tablero limpio", error: "Borrar sin revisar aprendizaje.", aftercare: "Cierre semanal." }
    ]
  },
  {
    folder: "marketing_digital_barrial_v0_6_publica",
    shortId: "mktbar",
    title: "Marketing Digital Barrial",
    shortName: "Marketing Barrial",
    subtitle: "Propuesta, cliente local, presencia digital, contenidos, promociones y medicion simple.",
    description: "Curso practico para negocios barriales que quieren mejorar comunicacion digital sin perder trato cercano ni gastar sin medir.",
    audience: "Comercios, feriantes, oficios, emprendimientos familiares y proyectos locales que venden por redes, WhatsApp o recomendacion.",
    portalCategory: "Marketing local",
    practiceArea: "marketing digital para comercios y emprendimientos barriales",
    exampleContext: "Un negocio de barrio quiere atraer clientes cercanos, explicar su oferta y ordenar publicaciones, promociones y mensajes.",
    finalArtifact: "plan de marketing barrial con propuesta, perfil de cliente, calendario de contenido, promocion y medicion semanal",
    modules: [
      m("Propuesta local clara", "Definir que se vende, para quien, por que conviene y que diferencia al negocio.", "frase de propuesta con producto, cliente, beneficio y prueba", "la propuesta se entiende en menos de 15 segundos", "propuesta de valor local", "Comunicar todo a todos sin foco.", "Cuando se prometen resultados, garantias, precios o condiciones comerciales.", "Una buena propuesta evita explicar de cero cada vez.", ["Producto o servicio", "Beneficio principal", "Diferencial", "Prueba social", "Objeciones", "Frase corta"]),
      m("Cliente y barrio", "Entender necesidades, horarios, recorridos y canales del publico cercano.", "mapa de clientes, momentos de compra y canales", "el plan habla a personas reales y situaciones concretas", "perfil de cliente barrial", "Copiar estrategias de marcas grandes sin contexto local.", "Cuando se usan datos personales o listas de clientes.", "El barrio tiene ritmos y confianza propios.", ["Tipos de cliente", "Momentos de compra", "Problemas frecuentes", "Canales", "Competencia cercana", "Oportunidades"]),
      m("Presencia digital basica", "Ordenar perfiles, datos, fotos, horarios, ubicacion y enlaces.", "perfil revisado con datos correctos y llamada a la accion", "una persona puede encontrar, entender y contactar al negocio", "perfil digital listo", "Tener redes activas con datos desactualizados.", "Cuando se publica direccion, telefono, precios o promociones.", "Antes de publicar mas, hay que estar encontrable.", ["Nombre y descripcion", "Horarios", "Ubicacion", "Fotos base", "Link de contacto", "Resenas"]),
      m("Contenido que vende sin cansar", "Planificar publicaciones utiles, cercanas y orientadas a accion.", "calendario de 2 semanas con piezas, objetivo y canal", "cada pieza tiene objetivo y proximo paso claro", "calendario de contenido", "Publicar solo ofertas o solo frases genericas.", "Cuando se usan fotos de clientes, menores o terceros.", "El contenido debe ayudar a comprar o confiar.", ["Ideas de contenido", "Demostraciones", "Historias del negocio", "Preguntas frecuentes", "Testimonios", "Llamadas a la accion"]),
      m("Promociones y WhatsApp", "Diseñar ofertas simples, mensajes claros y seguimiento sin invadir.", "promocion con condiciones, pieza y mensaje de WhatsApp", "la promocion tiene vigencia, condiciones y forma de compra", "campana local simple", "Lanzar descuentos sin calcular margen.", "Cuando la promocion afecta precios, stock, reclamos o datos de clientes.", "Una promocion confusa genera reclamos.", ["Objetivo de promocion", "Condiciones", "Mensaje breve", "Lista de difusion", "Respuestas rapidas", "Seguimiento"]),
      m("Medicion y mejora", "Medir preguntas, ventas, mensajes, visitas y aprendizaje para ajustar.", "registro semanal con accion, resultado y decision", "cada semana deja una decision concreta", "tablero simple de marketing", "Medir solo likes y no ventas o consultas utiles.", "Cuando se invierte dinero en anuncios o promociones.", "Lo que no se mide se repite por costumbre.", ["Metricas utiles", "Registro semanal", "Comparar piezas", "Aprender de consultas", "Ajustar oferta", "Plan de 30 dias"])
    ],
    cases: [
      { title: "Perfil sin horarios actualizados", summary: "Clientes llegan cuando el local esta cerrado.", goal: "Actualizar presencia basica.", trigger: "horario incorrecto en redes o mapas", courseAction: "corregir datos y publicar aviso claro", evidence: "perfil antes/despues", error: "Avisar solo en una historia temporal.", aftercare: "Revisar datos cada mes." },
      { title: "Promocion sin margen", summary: "La oferta vende pero deja perdida.", goal: "Revisar numeros antes de publicar.", trigger: "descuento atractivo sin calculo", courseAction: "calcular costo, precio y limite", evidence: "calculo de margen", error: "Copiar promociones de otro negocio.", aftercare: "Crear plantilla de promocion." },
      { title: "Contenido sin llamada a la accion", summary: "La publicacion gusta pero no genera consultas.", goal: "Agregar proximo paso.", trigger: "post informativo sin accion", courseAction: "definir comprar, consultar, reservar o visitar", evidence: "pieza corregida", error: "Esperar que la gente adivine.", aftercare: "Usar checklist de pieza." },
      { title: "Fotos con clientes sin permiso", summary: "Se publica una imagen con personas reconocibles.", goal: "Cuidar privacidad.", trigger: "foto de cliente o menor", courseAction: "pedir permiso o usar foto sin personas", evidence: "pieza reemplazada", error: "Tapar una cara parcialmente.", aftercare: "Definir regla de fotos." },
      { title: "WhatsApp saturado", summary: "Llegan muchas consultas repetidas.", goal: "Crear respuestas rapidas.", trigger: "preguntas frecuentes repetidas", courseAction: "armar respuestas con precio, horario y condiciones", evidence: "biblioteca de respuestas", error: "Responder distinto cada vez.", aftercare: "Actualizar FAQ." },
      { title: "Anuncio pago sin objetivo", summary: "Se gasta dinero sin saber que medir.", goal: "Definir objetivo y metrica.", trigger: "campana improvisada", courseAction: "elegir consulta, visita, reserva o venta", evidence: "plan de anuncio", error: "Medir solo alcance.", aftercare: "Probar presupuesto pequeno." },
      { title: "Resena negativa", summary: "Un cliente deja comentario publico critico.", goal: "Responder con criterio.", trigger: "queja visible", courseAction: "agradecer, pedir datos por privado y proponer solucion", evidence: "respuesta redactada", error: "Responder con enojo.", aftercare: "Registrar causa de queja." },
      { title: "Calendario abandonado", summary: "Se publican muchas piezas una semana y luego nada.", goal: "Crear rutina sostenible.", trigger: "publicaciones irregulares", courseAction: "planificar pocas piezas repetibles", evidence: "calendario de 2 semanas", error: "Armar calendario imposible.", aftercare: "Revisar cada viernes." }
    ]
  },
  {
    folder: "tienda_online_principiantes_v0_6_publica",
    shortId: "tienda",
    title: "Tienda Online para Principiantes",
    shortName: "Tienda Online",
    subtitle: "Oferta, catalogo, fotos, precios, pagos, envios, atencion, publicacion y operacion.",
    description: "Curso practico para preparar una tienda online simple con catalogo claro, condiciones visibles, operacion cuidada y mejora continua.",
    audience: "Emprendedores, comercios chicos, feriantes y personas que quieren empezar a vender online sin improvisar procesos criticos.",
    portalCategory: "Comercio digital",
    practiceArea: "venta online inicial para emprendimientos",
    exampleContext: "Un emprendimiento quiere publicar productos online y necesita ordenar catalogo, precios, medios de pago, envios y atencion al cliente.",
    finalArtifact: "tienda minima publicable con catalogo, fichas, precios, condiciones, flujo de pedido y checklist operativo",
    modules: [
      m("Oferta y catalogo", "Definir que productos publicar primero, categorias, stock y condiciones basicas.", "catalogo inicial con productos, categorias, stock y estado", "cada producto tiene informacion suficiente para decidir compra", "catalogo minimo viable", "Subir todos los productos sin orden ni stock confiable.", "Cuando se prometen productos, entregas o condiciones comerciales.", "La tienda empieza por un catalogo que se pueda cumplir.", ["Producto inicial", "Categorias", "Stock", "Variantes", "Condiciones", "Prioridad de publicacion"]),
      m("Canal y plataforma", "Elegir donde vender segun costo, control, facilidad y forma de atencion.", "comparacion de canales con costo, esfuerzo y limite", "el canal elegido coincide con capacidad operativa", "decision de plataforma", "Elegir plataforma por moda sin revisar costos.", "Cuando se aceptan pagos, datos de clientes o terminos comerciales.", "La mejor plataforma es la que se puede mantener.", ["Redes", "Marketplace", "Tienda propia", "Costos", "Comisiones", "Mantenimiento"]),
      m("Fotos, fichas y precios", "Preparar fotos claras, descripciones, medidas, precio y condiciones.", "ficha de producto con foto, descripcion, precio y preguntas frecuentes", "la ficha responde dudas antes de comprar", "fichas de productos publicables", "Publicar fotos oscuras o precios incompletos.", "Cuando el precio depende de stock, envio, impuestos o promociones.", "Una ficha clara reduce reclamos.", ["Foto base", "Descripcion", "Medidas", "Precio", "Variantes", "FAQ"]),
      m("Pagos, envios y atencion", "Definir medios de pago, entrega, cambios, reclamos y mensajes.", "flujo de pedido con pago, entrega y atencion", "el cliente sabe como compra, paga, recibe y reclama", "flujo de compra documentado", "Aceptar pedidos sin explicar condiciones.", "Cuando se manejan pagos, direcciones, telefonos o reclamos.", "La venta online falla si la operacion no esta clara.", ["Medios de pago", "Comprobantes", "Envios", "Retiro", "Cambios", "Mensajes"]),
      m("Publicacion y conversion", "Publicar la tienda con navegacion simple, confianza y llamadas a la accion.", "pagina o catalogo revisado con CTA y prueba de compra", "una persona puede encontrar producto y hacer pedido sin ayuda", "tienda lista para prueba", "Publicar sin hacer una compra de prueba.", "Cuando la tienda empieza a recibir pedidos reales.", "Antes de anunciar, hay que probar comprar.", ["Home o portada", "Categorias visibles", "Boton de compra", "Confianza", "Prueba de pedido", "Correcciones"]),
      m("Operacion y mejora", "Controlar stock, pedidos, reclamos, metricas y mejoras semanales.", "registro de pedidos, problemas y decisiones de mejora", "cada semana deja ajuste sobre producto, ficha u operacion", "rutina operativa de tienda", "Vender mas de lo que se puede entregar.", "Cuando aumentan reclamos, devoluciones o demoras.", "La tienda online es un sistema, no solo una vidriera.", ["Stock", "Pedidos", "Reclamos", "Metricas", "Reposicion", "Plan de mejora"])
    ],
    cases: [
      { title: "Producto sin stock publicado", summary: "Un cliente compra algo que ya no esta disponible.", goal: "Actualizar stock y politica.", trigger: "stock desactualizado", courseAction: "marcar sin stock, avisar y ofrecer alternativa", evidence: "registro de stock corregido", error: "Esperar a conseguirlo sin avisar.", aftercare: "Crear rutina de stock." },
      { title: "Ficha con medidas incompletas", summary: "El cliente devuelve por informacion faltante.", goal: "Completar ficha.", trigger: "duda sobre tamano o compatibilidad", courseAction: "agregar medidas, variantes y FAQ", evidence: "ficha antes/despues", error: "Responder solo por privado.", aftercare: "Revisar fichas mas consultadas." },
      { title: "Pago recibido sin pedido claro", summary: "No se sabe que producto pidio la persona.", goal: "Ordenar flujo de pedido.", trigger: "comprobante sin detalle", courseAction: "pedir datos minimos y crear numero de pedido", evidence: "plantilla de pedido", error: "Depender de chats mezclados.", aftercare: "Usar formulario o mensaje estructurado." },
      { title: "Envio prometido sin costo visible", summary: "El cliente se molesta por cargo extra.", goal: "Mostrar condiciones.", trigger: "costo de envio informado tarde", courseAction: "publicar zonas, tiempos y costos", evidence: "condiciones visibles", error: "Aclarar solo cuando preguntan.", aftercare: "Actualizar condiciones." },
      { title: "Fotos no representan producto", summary: "La imagen genera expectativas incorrectas.", goal: "Mejorar fotos y descripcion.", trigger: "reclamo por diferencia", courseAction: "usar fotos reales y notas de variacion", evidence: "fotos corregidas", error: "Usar imagen generica sin aclarar.", aftercare: "Checklist de foto." },
      { title: "Tienda publicada sin prueba", summary: "El boton de compra no funciona.", goal: "Hacer compra de prueba.", trigger: "error reportado por cliente", courseAction: "probar flujo completo y corregir", evidence: "checklist de prueba", error: "Anunciar antes de probar.", aftercare: "Probar luego de cada cambio." },
      { title: "Reclamo por cambio", summary: "No habia politica visible.", goal: "Definir cambios y devoluciones.", trigger: "cliente pide cambio", courseAction: "escribir politica clara y resolver caso", evidence: "politica publicada", error: "Improvisar reglas por cliente.", aftercare: "Revisar politica con casos reales." },
      { title: "Muchas visitas pocas ventas", summary: "La tienda recibe trafico pero no pedidos.", goal: "Detectar friccion.", trigger: "baja conversion", courseAction: "revisar fichas, CTA, precios, confianza y envio", evidence: "lista de mejoras priorizadas", error: "Bajar precio sin entender causa.", aftercare: "Medir cambios semanalmente." }
    ]
  }
];

for (const config of courses) writeCourseFiles(config);
updatePortalInventory(courses);
updateDocs(courses);

console.log(`Tanda 4 reforzada: ${courses.length} cursos`);
for (const config of courses) {
  const data = readJson(path.join(coursesRoot, config.folder, "src", "data", "course_content.json"));
  const lessons = data.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const quiz = data.modules.reduce((sum, module) => sum + module.quiz.length, 0);
  console.log(`- ${config.folder}: ${data.modules.length} modulos, ${lessons} lecciones, ${quiz} preguntas`);
}

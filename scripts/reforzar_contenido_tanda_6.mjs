import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesRoot = path.join(root, "cursos");
const portalDataDir = path.join(root, "portal", "portal_publico_profesional_v0_6", "data");
const version = "0.7-tanda-6";
const publicationStatus = "publica-profesional-v0.7-tanda-6";
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

function buildLesson(id, module, title, config) {
  return {
    id,
    title,
    keyIdea: `${title} ayuda a convertir una situacion digital sensible en una accion cuidada, verificable y facil de explicar.`,
    shortTheory: `En esta leccion se trabaja ${lower(title)} dentro de ${lower(module.title)}. La meta es reconocer riesgo, ordenar pasos y decidir con evidencia antes de actuar o compartir datos.`,
    practicalExample: `${config.exampleContext} Aplica ${lower(title)}, guarda ${module.evidence} y anota que decision permite tomar.`,
    commonMistake: "El error habitual es actuar por apuro, copiar instrucciones de terceros o compartir datos personales sin confirmar canal, permiso y necesidad.",
    whatToDoNow: `Practica de 25 minutos: arma un caso pequeno de ${lower(title)}, marca datos sensibles, prueba el paso seguro y registra evidencia, limite y proxima mejora.`,
    alert: module.alert,
    keyPoints: [
      `${title} debe dejar una accion concreta, no solo una recomendacion general.`,
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
        "Objetivo, persona afectada, datos sensibles, canal confiable y evidencia de cierre.",
        "La respuesta mas rapida que aparezca.",
        "Una solucion unica para todos los casos.",
        "Un tutorial sin revisar fecha ni fuente."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: en temas digitales sensibles conviene ordenar contexto, datos y canal antes de actuar."
    },
    {
      id: `${id}-q2`,
      question: "Que evidencia permite cerrar el modulo con mas confianza?",
      options: [
        module.evidence,
        "Una captura sin fecha ni contexto.",
        "Un mensaje reenviado por otra persona.",
        "Una frase como 'debe estar bien'."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.evidence} deja trazabilidad y reduce improvisacion.`
    },
    {
      id: `${id}-q3`,
      question: "Que conducta aumenta el riesgo?",
      options: [
        module.riskyChoice,
        "Usar datos simulados para practicar.",
        "Verificar por canal oficial o persona responsable.",
        "Anotar dudas antes de compartir informacion."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: esa conducta elimina controles y puede exponer datos, cuentas o personas."
    },
    {
      id: `${id}-q4`,
      question: "Cuando corresponde escalar o pedir ayuda competente?",
      options: [
        module.helpTrigger,
        "Nunca, porque un curso introductorio alcanza para todo.",
        "Solo despues de borrar la evidencia.",
        "Cuando el mensaje parece urgente."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: escalar a tiempo evita danos mayores y preserva evidencia."
    },
    {
      id: `${id}-q5`,
      question: `Cual es el entregable minimo de "${module.title}"?`,
      options: [
        module.deliverable,
        "Un consejo generico sin pasos.",
        "Una captura sin decision.",
        "Una accion hecha sin registro."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.deliverable} permite repetir, revisar y mejorar.`
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
      learningRisk: "Actuar sin verificar puede exponer datos personales, cuentas, estudiantes, familiares, clientes o decisiones sensibles.",
      lessons: module.lessons.map((title, lessonIndex) => buildLesson(`m${moduleIndex + 1}-l${lessonIndex + 1}`, module, title, config)),
      quiz: quizForModule(module, moduleIndex)
    }))
  };
}

const checklistItems = [
  "Persona afectada y objetivo definidos",
  "Datos sensibles separados",
  "Canal confiable verificado",
  "Permisos o consentimiento revisados",
  "Evidencia guardada",
  "Proximo paso responsable"
];

function buildChecklists(config) {
  return {
    checklists: config.modules.map((module, moduleIndex) => ({
      id: `${config.shortId}-checklist-${moduleIndex + 1}`,
      title: `${module.title}: checklist de cuidado digital`,
      description: `Control breve para aplicar ${lower(module.title)} en ${config.practiceArea} sin exponer datos ni improvisar.`,
      commercialArea: config.practiceArea,
      items: checklistItems.map((title, itemIndex) => ({
        id: `${config.shortId}-cl${moduleIndex + 1}-i${itemIndex + 1}`,
        title,
        explanation: `${title} reduce riesgo y deja trazabilidad durante ${lower(module.title)}.`,
        recommendedAction: `Aplicar sobre un caso simulado o de bajo riesgo y guardar ${module.evidence}. Cierre esperado: ${module.criterion}.`
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
      severity: item.severity || "Practica sensible",
      immediateGoal: item.goal,
      steps: [
        `Pausar la accion automatica y describir el disparador: ${item.trigger}.`,
        "Separar datos reales, datos simulados y datos que no deben compartirse.",
        `Aplicar el criterio del curso: ${item.courseAction}.`,
        `Guardar evidencia: ${item.evidence}.`,
        "Definir si alcanza una accion propia o si corresponde soporte, canal oficial, escuela, familia o profesional competente.",
        "Cerrar con decision, motivo, limite del ejercicio y siguiente control."
      ],
      evidenceToPreserve: [
        "Descripcion del caso",
        item.evidence,
        "Fecha aproximada y canal usado",
        "Decision tomada y motivo",
        "Duda que requiere validacion externa"
      ],
      errorsToAvoid: [
        item.error,
        "Compartir claves, codigos, documentos completos o datos personales.",
        "Confiar solo en capturas o mensajes reenviados.",
        "Borrar evidencia antes de entender el problema.",
        "Tomar una practica educativa como solucion definitiva."
      ],
      aftercare: [
        item.aftercare,
        "Actualizar checklist personal, familiar o institucional.",
        "Guardar una plantilla reutilizable.",
        "Revisar si hace falta bloquear, reclamar, denunciar o consultar por canales oficiales."
      ],
      guidedDecision: {
        question: "Que decision reduce mejor el riesgo?",
        options: [
          {
            text: "Pausar, verificar por canal confiable, guardar evidencia y actuar solo con informacion suficiente.",
            isCorrect: true,
            feedback: "Correcto: baja la probabilidad de fraude, exposicion o dano."
          },
          {
            text: "Responder rapido porque el mensaje parece urgente.",
            isCorrect: false,
            feedback: "La urgencia suele ser parte del riesgo; primero se verifica."
          },
          {
            text: "Enviar mas datos para que otra persona decida.",
            isCorrect: false,
            feedback: "Se comparte lo minimo necesario y por canales confiables."
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
    templateVersion: "0.7-publica-profesional-tanda-6",
    appName: config.title,
    shortName: config.shortName,
    subtitle: config.subtitle,
    description: config.description,
    audience: config.audience,
    responsibleNotice,
    cacheName: `${config.folder}-cache-${version}`,
    contentAudit: {
      status: "reforzado-tanda-6",
      date,
      modules: 6,
      lessons: 36,
      quizQuestions: 30,
      checklists: 6,
      cases: 8,
      notes: "Contenido reemplazado para reducir patrones genericos en cursos de ciudadania, seguridad digital y comunicacion comercial."
    }
  });
  manifest.labels = {
    ...(manifest.labels || {}),
    modules: "Modulos de aprendizaje",
    checklists: "Checklists de cuidado digital",
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
    reinforcedBatch6: true,
    publicationCandidate: true,
    publicProfessionalEdition: true,
    requiresBackend: false,
    requiresLogin: false
  };
  const note = "v0.7 tanda 6 reemplaza contenido generico por modulos, practicas, checklists y casos especificos en ciudadania y seguridad digital.";
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
    course.version = "v0.7 tanda 6 reforzada";
    course.status = "Curso reforzado - tanda 6";
    course.category = config.portalCategory || course.category;
    course.audience = config.audience;
    course.description = config.description;
    course.features = [
      "6 modulos",
      "36 lecciones reforzadas",
      "30 preguntas",
      "6 checklists de cuidado digital",
      "8 casos guiados",
      "Sin backend ni login"
    ];
    course.recommendedBase = "Contenido reforzado con practicas, evidencia, casos sensibles y criterios de validacion.";
    course.tags = [...new Set([...(course.tags || []), "reforzado-tanda-6", "contenido-v0-7", "seguridad-ciudadania"])];
    course.publicReady = true;
  }
  writeJson(coursesFile, courses);

  const csvFile = path.join(portalDataDir, "courses_inventory.csv");
  if (fs.existsSync(csvFile)) {
    let csv = fs.readFileSync(csvFile, "utf8");
    for (const config of configs) {
      const lineRegex = new RegExp(`^${config.folder},.*$`, "m");
      csv = csv.replace(lineRegex, `${config.folder},${csvCell(config.title)},v0.7 tanda 6 reforzada,Curso reforzado - tanda 6,${csvCell(config.portalCategory || config.practiceArea)},${csvCell(config.audience)},../../cursos/${config.folder}/index.html,true,true`);
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
      "Pendientes actuales despues de UX/UI, tanda 1, tanda 2, tanda 3, tanda 4 y tanda 5:",
      "Pendientes actuales despues de UX/UI, tanda 1, tanda 2, tanda 3, tanda 4, tanda 5 y tanda 6:"
    );
    const marker = "## Tanda 6 de refuerzo";
    const block = `${marker}\n\nCompletada el ${date} con 5 cursos de ciudadania, seguridad digital y comunicacion comercial reforzados:\n\n${configs.map(config => `- ${config.folder}: 6 modulos, 36 lecciones, 30 preguntas, 6 checklists y 8 casos guiados.`).join("\n")}\n\nDeuda de contenido generico despues de esta tanda: 2 cursos.\n`;
    if (!text.includes(marker)) text = `${text.trim()}\n\n${block}\n`;
    fs.writeFileSync(auditFile, text, "utf8");
  }

  const checklistFile = path.join(root, "CHECKLIST_PUBLICACION_BETA.md");
  if (fs.existsSync(checklistFile)) {
    let text = fs.readFileSync(checklistFile, "utf8");
    if (!text.includes("Reforzar sexta tanda de 5 cursos de ciudadania y seguridad digital")) {
      text = text.replace(
        "- [ ] Reforzar los 7 cursos restantes con patrones de contenido generico.",
        "- [x] Reforzar sexta tanda de 5 cursos de ciudadania y seguridad digital.\n- [ ] Reforzar los 2 cursos restantes con patrones de contenido generico."
      );
    }
    fs.writeFileSync(checklistFile, text, "utf8");
  }

  const pendingFile = path.join(root, "PENDIENTES_REALES_V1_0_BETA.md");
  if (fs.existsSync(pendingFile)) {
    let text = fs.readFileSync(pendingFile, "utf8");
    text = text.replace(
      /la tanda 5 reforzo 5 cursos de datos y analisis\.\s+Quedan 7 cursos por trabajar antes de considerar v1\.0 final\./,
      "la tanda 5 reforzo 5 cursos de datos y analisis, la tanda 6 reforzo 5 cursos de ciudadania, seguridad digital y comunicacion comercial. Quedan 2 cursos por trabajar antes de considerar v1.0 final."
    );
    fs.writeFileSync(pendingFile, text, "utf8");
  }
}

function m(title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons) {
  return { title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons };
}

const courses = [
  {
    folder: "ciudadano_digital_argentina_v0_6_publica",
    shortId: "ciudad",
    title: "Ciudadano Digital Argentina",
    shortName: "Ciudadano Digital",
    subtitle: "Identidad digital, portales oficiales, tramites, seguridad, comprobantes y reclamos.",
    description: "Curso practico para moverse en servicios digitales argentinos con cuidado de identidad, documentos, turnos, pagos y evidencia.",
    audience: "Personas que realizan tramites, consultan servicios, guardan constancias o ayudan a familiares en gestiones digitales.",
    portalCategory: "Ciudadania digital",
    practiceArea: "ciudadania digital y tramites cotidianos",
    exampleContext: "Una persona necesita hacer tramites, consultar servicios o guardar comprobantes sin caer en sitios falsos ni perder evidencia.",
    finalArtifact: "carpeta ciudadana digital con cuentas protegidas, portales verificados, comprobantes y plan de seguimiento",
    modules: [
      m("Identidad digital y cuentas", "Reconocer credenciales, correos, claves, doble factor y recuperacion.", "mapa de cuentas criticas y metodo de recuperacion", "cada cuenta critica tiene clave unica y recuperacion revisada", "plan de identidad digital", "Usar la misma clave en cuentas oficiales y personales.", "Cuando se pierde acceso a una cuenta o aparece actividad desconocida.", "La identidad digital se cuida antes de necesitarla.", ["CUIL, DNI y usuario", "Correo principal", "Claves seguras", "Doble factor", "Recuperacion", "Registro de cuentas"]),
      m("Portales oficiales y tramites", "Distinguir sitios oficiales, turnos, formularios y seguimiento.", "lista de portales verificados con URL, tramite y comprobante", "el tramite se inicia desde fuente oficial y queda registrado", "mapa de tramites seguros", "Entrar desde anuncios, mensajes o links reenviados sin verificar.", "Cuando el tramite pide documentos, pagos o datos personales.", "Un sitio parecido no siempre es oficial.", ["Buscar sitio oficial", "Turnos", "Formularios", "Estado de tramite", "Comprobantes", "Canales de ayuda"]),
      m("Documentos y datos personales", "Compartir documentos solo cuando corresponde y con minimo necesario.", "protocolo de envio de documentos con canal y destinatario", "cada documento compartido tiene motivo, canal y registro", "regla de documentos personales", "Enviar foto completa de DNI por cualquier chat.", "Cuando se solicitan documentos, datos bancarios o codigos.", "Compartir menos datos reduce riesgo.", ["Datos sensibles", "Fotos de documentos", "Marcas de agua", "Canal seguro", "Permisos", "Archivo ordenado"]),
      m("Pagos, servicios y comprobantes", "Manejar pagos digitales, facturas, reclamos y constancias con cuidado.", "comprobante guardado con fecha, servicio, monto y canal", "cada pago o reclamo tiene evidencia suficiente", "sistema de comprobantes", "Pagar desde links recibidos sin verificar deuda o destinatario.", "Cuando hay monto dudoso, doble cobro, deuda o reclamo.", "Un comprobante sin contexto se pierde rapido.", ["Facturas", "Medios de pago", "Comprobantes", "Deudas", "Reclamos", "Suscripciones"]),
      m("Comunicacion con organismos", "Redactar consultas, tickets y reclamos con datos minimos y seguimiento.", "ticket o reclamo con fecha, numero, canal y proximo paso", "la comunicacion permite seguimiento sin repetir todo", "plantilla de reclamo", "Enviar muchos datos sin numero de tramite ni objetivo claro.", "Cuando no responden, se vence un plazo o hay perjuicio.", "La evidencia ordenada mejora cualquier reclamo.", ["Consulta clara", "Numero de tramite", "Archivos adjuntos", "Fechas", "Seguimiento", "Escalamiento"]),
      m("Carpeta ciudadana y rutina", "Organizar cuentas, documentos, vencimientos y backups.", "carpeta con estructura, calendario y copia de seguridad", "los documentos se encuentran y se actualizan con rutina", "carpeta ciudadana digital", "Guardar todo en chats sin orden ni backup.", "Cuando varias personas ayudan en gestiones familiares.", "Ordenar documentos evita rehacer tramites.", ["Carpetas", "Nombres de archivo", "Calendario", "Backup", "Acceso familiar", "Revision mensual"])
    ],
    cases: [
      { title: "Sitio falso de tramite", summary: "Una pagina parecida pide datos y pago urgente.", goal: "Verificar fuente antes de cargar datos.", trigger: "link recibido por buscador o mensaje", courseAction: "buscar portal oficial, comparar dominio y no pagar desde link dudoso", evidence: "URL verificada y captura del sitio sospechoso", error: "Cargar datos porque el sitio se ve profesional.", aftercare: "Guardar portales oficiales favoritos." },
      { title: "Clave compartida para ayudar", summary: "Un familiar pide la clave para hacer un tramite.", goal: "Ayudar sin entregar credenciales.", trigger: "pedido de clave o codigo", courseAction: "usar acompanamiento presencial o pantalla compartida segura sin dictar claves", evidence: "acuerdo de ayuda y cambio de clave si fue compartida", error: "Mandar clave por WhatsApp.", aftercare: "Configurar recuperacion y 2FA." },
      { title: "Tramite sin comprobante", summary: "Se completo un formulario pero no se guardo constancia.", goal: "Recuperar y ordenar evidencia.", trigger: "falta numero de tramite", courseAction: "buscar correo, historial y portal de seguimiento", evidence: "numero, fecha o captura recuperada", error: "Rehacer el tramite sin revisar duplicados.", aftercare: "Crear carpeta de comprobantes." },
      { title: "Turno perdido", summary: "La persona no encuentra fecha, sede o requisito.", goal: "Registrar turno completo.", trigger: "confirmacion dispersa", courseAction: "guardar PDF/captura y calendario con alerta", evidence: "turno con fecha, sede y requisitos", error: "Confiar en la memoria.", aftercare: "Usar calendario compartido si corresponde." },
      { title: "Pago dudoso de servicio", summary: "Llega un link de deuda por mensaje.", goal: "Verificar deuda por canal oficial.", trigger: "mensaje con link de pago", courseAction: "entrar al portal oficial o app confiable antes de pagar", evidence: "captura de deuda oficial o descarte", error: "Pagar por miedo a corte inmediato.", aftercare: "Definir regla para links de pago." },
      { title: "Documento enviado a canal equivocado", summary: "Se mando una foto de documento en un grupo.", goal: "Reducir exposicion.", trigger: "documento compartido de mas", courseAction: "borrar si es posible, avisar, cambiar claves si aplica y registrar riesgo", evidence: "accion tomada y canal afectado", error: "Ignorar porque ya paso.", aftercare: "Crear version marcada para tramites." },
      { title: "Cambio de correo principal", summary: "Una cuenta oficial queda asociada a email viejo.", goal: "Actualizar recuperacion.", trigger: "correo sin acceso", courseAction: "entrar por canal oficial y actualizar email/telefono", evidence: "cuenta con recuperacion vigente", error: "Crear una cuenta nueva sin cerrar la anterior.", aftercare: "Revisar cuentas criticas." },
      { title: "Reclamo sin seguimiento", summary: "Se hizo una consulta pero no hay numero ni fecha.", goal: "Crear registro de reclamo.", trigger: "respuesta demorada", courseAction: "ordenar fecha, canal, numero y proximo paso", evidence: "registro de seguimiento", error: "Reenviar el mismo mensaje sin datos.", aftercare: "Usar plantilla de reclamo." }
    ]
  },
  {
    folder: "cuidado_digital_mayores_familias_v0_6_publica",
    shortId: "mayfam",
    title: "Cuidado Digital para Adultos Mayores y Familias",
    shortName: "Cuidado Digital",
    subtitle: "Acompanamiento, celular seguro, estafas, tramites, salud, autonomia y plan familiar.",
    description: "Curso practico para acompanar a personas mayores en tecnologia con seguridad, paciencia, autonomia y acuerdos familiares claros.",
    audience: "Adultos mayores, familiares, cuidadores, docentes comunitarios y personas que acompanan gestiones digitales.",
    portalCategory: "Cuidado digital",
    practiceArea: "acompanamiento digital familiar y comunitario",
    exampleContext: "Una familia quiere ayudar a una persona mayor a usar celular, pagos, turnos y mensajes sin quitarle autonomia ni exponer datos.",
    finalArtifact: "plan familiar de cuidado digital con acuerdos, cuentas protegidas, alertas de estafa y pasos de emergencia",
    modules: [
      m("Acompanamiento respetuoso", "Ayudar sin infantilizar, invadir o quedarse con el control de las cuentas.", "acuerdo familiar de ayuda con limites y permisos", "la persona sabe que se hace, por que y quien puede ayudar", "acuerdo de acompanamiento", "Tomar el celular y resolver todo sin explicar.", "Cuando hay desacuerdo familiar, dinero, salud o autonomia afectada.", "Cuidar tambien es respetar decisiones.", ["Autonomia", "Consentimiento", "Paciencia", "Lenguaje claro", "Limites", "Registro de ayuda"]),
      m("Celular seguro y simple", "Ordenar pantalla, bloqueo, contactos, actualizaciones y recuperacion.", "checklist del celular con bloqueo, contactos y recuperacion", "el celular queda usable, protegido y entendible", "configuracion segura basica", "Quitar bloqueos para que sea mas facil.", "Cuando se pierde el equipo o hay actividad sospechosa.", "Simple no significa sin seguridad.", ["Bloqueo", "Contactos utiles", "Apps necesarias", "Actualizaciones", "Copia de seguridad", "Recuperacion"]),
      m("Estafas y mensajes sospechosos", "Reconocer urgencia falsa, premios, suplantacion, links y pedidos de codigos.", "tarjeta de alertas con frases y pasos de verificacion", "la persona sabe pausar y consultar antes de responder", "guia antiestafas familiar", "Responder por miedo o verguenza antes de preguntar.", "Cuando piden codigos, dinero, claves o datos bancarios.", "La urgencia es una senal para pausar.", ["Mensajes falsos", "Llamadas", "Premios", "Codigos", "Suplantacion familiar", "Pedir ayuda"]),
      m("Tramites, salud y pagos con ayuda", "AcompanAR gestiones sensibles con evidencia y canales oficiales.", "flujo de ayuda para tramite o pago con comprobante", "cada gestion tiene canal oficial, permiso y constancia", "protocolo de gestion asistida", "Hacer pagos o tramites sin que la persona entienda.", "Cuando se trata de salud, dinero, turnos o beneficios.", "La ayuda debe dejar evidencia y explicacion.", ["Turnos medicos", "Recetas", "Pagos", "Comprobantes", "Portales oficiales", "Seguimiento"]),
      m("Comunicacion familiar", "Definir canales, palabras clave, contactos y reglas ante dudas.", "lista de contactos confiables y regla de verificacion", "ante una duda hay una persona y un canal acordado", "red de ayuda digital", "Crear muchos grupos y canales que confunden.", "Cuando aparece una urgencia o pedido de dinero.", "Un acuerdo simple puede frenar una estafa.", ["Contactos", "Palabra clave", "Canal principal", "Horarios", "Registro", "Privacidad familiar"]),
      m("Plan de emergencia y mejora", "Preparar respuesta ante perdida, estafa, bloqueo o conflicto.", "plan de emergencia con pasos, telefonos y evidencias", "la familia sabe que hacer sin improvisar", "plan familiar de emergencia digital", "Borrar mensajes y pruebas por verguenza.", "Cuando hubo transferencia, robo, amenaza o exposicion de datos.", "La evidencia ayuda a reparar y aprender.", ["Perdida de celular", "Bloqueo de cuenta", "Estafa", "Denuncia o reclamo", "Contencion", "Revision mensual"])
    ],
    cases: [
      { title: "Mensaje del nieto falso", summary: "Un supuesto familiar pide dinero urgente.", goal: "Verificar identidad por canal alternativo.", trigger: "pedido emotivo y urgente", courseAction: "pausar, llamar a contacto conocido y no transferir hasta confirmar", evidence: "captura del mensaje y registro de verificacion", error: "Transferir para ayudar rapido.", aftercare: "Crear palabra clave familiar." },
      { title: "Llamada del banco", summary: "Alguien pide codigo para proteger la cuenta.", goal: "Cortar y llamar al canal oficial.", trigger: "pedido de codigo o clave", courseAction: "no dictar codigos, cortar y verificar desde numero oficial", evidence: "numero recibido y accion tomada", error: "Seguir instrucciones por miedo.", aftercare: "Guardar telefonos oficiales." },
      { title: "Celular perdido", summary: "El equipo tiene apps y cuentas abiertas.", goal: "Bloquear y recuperar acceso.", trigger: "perdida o robo", courseAction: "bloquear equipo, cambiar claves y avisar contactos", evidence: "lista de cuentas revisadas", error: "Esperar a ver si aparece.", aftercare: "Configurar bloqueo y backup." },
      { title: "App desconocida instalada", summary: "Aparece una app que nadie recuerda.", goal: "Revisar permisos y origen.", trigger: "app sospechosa", courseAction: "identificar, desinstalar si corresponde y revisar permisos", evidence: "captura de app y permisos", error: "Abrir para ver que hace.", aftercare: "Activar instalacion segura." },
      { title: "Clave anotada a la vista", summary: "Las claves estan en papel visible.", goal: "Mejorar recuperacion sin exponer.", trigger: "clave compartida o visible", courseAction: "cambiar claves y guardar metodo seguro acordado", evidence: "cuentas actualizadas", error: "Dejar claves faciles para no olvidarlas.", aftercare: "Usar ayuda de confianza." },
      { title: "Turno medico perdido", summary: "No se encuentra confirmacion ni requisitos.", goal: "Ordenar salud digital.", trigger: "turno sin constancia", courseAction: "buscar confirmacion, guardar captura y poner alerta", evidence: "turno con fecha y requisitos", error: "Repetir pedido sin revisar mensajes.", aftercare: "Crear carpeta de salud." },
      { title: "Transferencia guiada por tercero", summary: "Alguien insiste por llamada mientras se opera la app.", goal: "Interrumpir operacion.", trigger: "instrucciones remotas para mover dinero", courseAction: "cortar comunicacion y consultar a familiar o banco oficial", evidence: "hora, numero y captura disponible", error: "Seguir paso a paso sin entender.", aftercare: "Regla de no operar bajo llamada." },
      { title: "Conflicto por autonomia", summary: "La familia quiere controlar todas las cuentas.", goal: "Acordar ayuda proporcional.", trigger: "tension familiar", courseAction: "definir permisos, limites y momentos de ayuda", evidence: "acuerdo escrito simple", error: "Quitar acceso sin conversar.", aftercare: "Revisar acuerdo periodicamente." }
    ]
  },
  {
    folder: "seguridad_digital_docentes_v0_6_publica",
    shortId: "docseg",
    title: "Seguridad Digital para Docentes",
    shortName: "Seguridad Docente",
    subtitle: "Cuentas, aulas virtuales, datos de estudiantes, comunicacion, incidentes y materiales.",
    description: "Curso practico para docentes que usan plataformas, grupos, archivos y comunicacion digital cuidando datos, permisos y evidencia.",
    audience: "Docentes, preceptores, coordinadores, equipos escolares y formadores que trabajan con estudiantes y familias.",
    portalCategory: "Educacion digital",
    practiceArea: "seguridad digital educativa",
    exampleContext: "Una docente usa aulas virtuales, grupos, planillas y archivos con estudiantes y familias, y necesita reducir riesgos sin frenar la clase.",
    finalArtifact: "protocolo docente con cuentas protegidas, permisos de aula, resguardo de datos y respuesta a incidentes",
    modules: [
      m("Cuentas docentes", "Proteger accesos institucionales, correos, aulas y recuperacion.", "mapa de cuentas docentes con doble factor y recuperacion", "cada cuenta critica tiene proteccion y responsable", "plan de cuentas docentes", "Usar la misma clave personal para plataformas escolares.", "Cuando hay acceso raro, perdida de dispositivo o cambio de rol.", "La cuenta docente abre puertas a datos de estudiantes.", ["Correo institucional", "Aula virtual", "Claves", "Doble factor", "Recuperacion", "Cierre de sesion"]),
      m("Aulas virtuales y permisos", "Configurar clases, enlaces, roles, salas y acceso a materiales.", "aula revisada con roles, permisos y enlaces controlados", "solo entra quien corresponde y con permisos adecuados", "checklist de aula segura", "Publicar enlaces permanentes sin control.", "Cuando se comparte aula con estudiantes, familias o invitados.", "Un enlace mal configurado puede exponer toda la clase.", ["Roles", "Enlaces", "Salas", "Materiales", "Tareas", "Visibilidad"]),
      m("Datos de estudiantes", "Minimizar, proteger y compartir datos escolares con criterio.", "matriz de datos con necesidad, acceso y cuidado", "cada dato compartido tiene motivo y canal adecuado", "regla de datos estudiantiles", "Compartir listas completas en grupos abiertos.", "Cuando hay notas, salud, asistencia, convivencia o datos familiares.", "Los datos de estudiantes requieren cuidado especial.", ["Minimizacion", "Listas", "Notas", "Asistencia", "Datos sensibles", "Retencion"]),
      m("Comunicacion con familias", "Usar canales claros, horarios, mensajes y limites.", "plantilla de comunicacion con canal, horario y registro", "la comunicacion es clara sin exponer informacion innecesaria", "protocolo de comunicacion", "Responder casos sensibles en grupos generales.", "Cuando el mensaje afecta privacidad, convivencia o evaluacion.", "No todo tema escolar corresponde a un grupo.", ["Canales", "Horarios", "Mensajes", "Grupos", "Casos privados", "Registro"]),
      m("Incidentes digitales", "Responder ante phishing, filtraciones, ciberacoso, suplantacion o errores.", "plan de respuesta con pasos, evidencia y escalamiento", "el incidente se contiene sin borrar pruebas", "protocolo de incidente", "Borrar mensajes para que no se vea el problema.", "Cuando hay amenaza, exposicion de datos, acoso o acceso no autorizado.", "Primero contener y preservar evidencia.", ["Detectar", "Contener", "Evidencia", "Avisar", "Escalar", "Aprender"]),
      m("Materiales y derechos", "Compartir recursos, imagenes, videos y trabajos respetando privacidad y permisos.", "ficha de material con fuente, permiso y publico previsto", "cada recurso publicado tiene permiso y contexto", "guia de materiales seguros", "Subir fotos o trabajos con datos personales sin revisar.", "Cuando se publican imagenes, voces, trabajos o datos de estudiantes.", "El material educativo tambien tiene permisos.", ["Fuentes", "Derechos", "Imagenes", "Trabajos", "Publicacion", "Archivo"])
    ],
    cases: [
      { title: "Cuenta docente comprometida", summary: "Llegan avisos de inicio de sesion desconocido.", goal: "Recuperar y asegurar cuenta.", trigger: "alerta de acceso raro", courseAction: "cambiar clave, cerrar sesiones, activar 2FA y avisar canal institucional", evidence: "alerta y acciones tomadas", error: "Ignorar porque la clase sigue.", aftercare: "Revisar cuentas vinculadas." },
      { title: "Lista de estudiantes compartida", summary: "Una planilla con datos circula en un grupo.", goal: "Reducir exposicion.", trigger: "archivo con datos personales", courseAction: "retirar acceso, avisar responsable y compartir version minima", evidence: "permisos antes/despues", error: "Reenviar pidiendo que no difundan.", aftercare: "Crear regla de listas." },
      { title: "Enlace de clase publico", summary: "Personas externas entran a una sala.", goal: "Controlar acceso.", trigger: "link permanente difundido", courseAction: "cambiar enlace, usar sala de espera o acceso institucional", evidence: "configuracion corregida", error: "Mantener el mismo link por comodidad.", aftercare: "Revisar enlaces por curso." },
      { title: "Phishing institucional", summary: "Un correo pide actualizar clave de plataforma.", goal: "Verificar remitente y canal.", trigger: "correo con urgencia y link", courseAction: "no ingresar clave, reportar y entrar por URL conocida", evidence: "correo sospechoso reportado", error: "Probar el link para ver si funciona.", aftercare: "Difundir alerta sin datos sensibles." },
      { title: "Foto de estudiante publicada", summary: "Una imagen de clase se comparte sin permiso claro.", goal: "Revisar consentimiento.", trigger: "publicacion con personas reconocibles", courseAction: "retirar o reemplazar por version permitida", evidence: "decision y fuente de permiso", error: "Tapar una cara parcialmente.", aftercare: "Crear banco de imagenes seguras." },
      { title: "Ciberacoso en grupo", summary: "Aparecen mensajes agresivos entre estudiantes.", goal: "Preservar evidencia y escalar.", trigger: "mensajes de hostigamiento", courseAction: "guardar evidencia, contener grupo y avisar protocolo escolar", evidence: "capturas con fecha y contexto", error: "Borrar todo para cortar el conflicto.", aftercare: "Revisar normas de grupo." },
      { title: "Dispositivo compartido", summary: "La cuenta docente queda abierta en computadora ajena.", goal: "Cerrar sesiones.", trigger: "uso en equipo compartido", courseAction: "cerrar sesion remota y cambiar clave si hubo riesgo", evidence: "sesiones revisadas", error: "Confiar en que nadie entrara.", aftercare: "Usar navegador privado y cierre." },
      { title: "Evaluacion filtrada", summary: "Un archivo de prueba queda visible antes de tiempo.", goal: "Corregir permisos y comunicar.", trigger: "material publicado por error", courseAction: "cambiar permisos, registrar alcance y definir nueva evaluacion si corresponde", evidence: "historial de permisos", error: "Negar el error sin medir alcance.", aftercare: "Checklist previo a publicar." }
    ]
  },
  {
    folder: "seguridad_familiar_internet_v0_6_publica",
    shortId: "famseg",
    title: "Seguridad Familiar en Internet",
    shortName: "Seguridad Familiar",
    subtitle: "Cuentas, dispositivos, redes, juegos, acuerdos, privacidad, estafas e incidentes.",
    description: "Curso practico para que familias construyan acuerdos digitales, protejan cuentas y respondan a riesgos cotidianos sin miedo ni improvisacion.",
    audience: "Familias, madres, padres, tutores, adolescentes, docentes comunitarios y personas que cuidan entornos digitales compartidos.",
    portalCategory: "Seguridad digital",
    practiceArea: "seguridad familiar y convivencia en internet",
    exampleContext: "Una familia comparte dispositivos, redes, juegos, compras y redes sociales, y necesita reglas claras para cuidarse sin controlar de mas.",
    finalArtifact: "acuerdo familiar de internet con seguridad de cuentas, privacidad, compras, convivencia y respuesta a incidentes",
    modules: [
      m("Mapa digital familiar", "Identificar dispositivos, cuentas, apps, edades, permisos y riesgos.", "mapa familiar de dispositivos, cuentas y responsables", "cada cuenta o equipo tiene responsable y regla basica", "mapa digital familiar", "Hablar de seguridad solo despues de un problema.", "Cuando hay menores, compras, datos personales o conflictos.", "Conocer el entorno es el primer paso de cuidado.", ["Dispositivos", "Cuentas", "Apps", "Edades", "Responsables", "Riesgos"]),
      m("Cuentas y dispositivos seguros", "Configurar claves, bloqueos, recuperacion, actualizaciones y ubicacion.", "checklist de seguridad por dispositivo", "los equipos principales tienen bloqueo, actualizacion y recuperacion", "plan de dispositivos seguros", "Compartir una clave familiar para todo.", "Cuando se pierde un equipo o aparece acceso desconocido.", "La comodidad no debe dejar todo abierto.", ["Claves", "Bloqueo", "Actualizaciones", "Ubicacion", "Backup", "Recuperacion"]),
      m("Privacidad en redes y fotos", "Cuidar perfiles, publicaciones, ubicacion, imagenes y datos de terceros.", "revision de privacidad de perfiles y regla de fotos", "lo publicado respeta consentimiento y minimiza datos", "regla familiar de privacidad", "Publicar fotos, escuela o ubicacion sin preguntar.", "Cuando se comparte imagen, ubicacion o informacion de menores.", "Una publicacion puede viajar fuera de la familia.", ["Perfiles", "Ubicacion", "Fotos", "Etiquetas", "Consentimiento", "Audiencia"]),
      m("Juegos, apps y compras", "Gestionar permisos, chats, compras, tiempos y contactos en apps y juegos.", "configuracion de app o juego con permisos y compras revisadas", "el uso tiene limites y canales de ayuda", "plan de juegos y apps", "Instalar apps sin revisar permisos o compras internas.", "Cuando hay contacto con desconocidos, gastos o contenido inadecuado.", "La conversacion vale mas que el bloqueo aislado.", ["Permisos", "Compras", "Chats", "Contactos", "Tiempos", "Reportes"]),
      m("Conversaciones y acuerdos", "Crear acuerdos familiares claros, revisables y adaptados por edad.", "acuerdo familiar con reglas, motivos y consecuencias", "las reglas se entienden y se revisan sin amenazas", "acuerdo familiar de internet", "Imponer reglas sin explicar ni escuchar.", "Cuando hay conflicto, secreto, presion o cambio de etapa.", "Un acuerdo sirve si todos pueden hablar.", ["Reglas", "Motivos", "Escucha", "Privacidad", "Consecuencias", "Revision"]),
      m("Incidentes y respuesta", "Actuar ante estafas, acoso, perdida, contenido riesgoso o exposicion de datos.", "plan de respuesta familiar con evidencia y contactos", "la familia sabe pausar, guardar evidencia y pedir ayuda", "plan de emergencia digital", "Retar primero y preguntar despues.", "Cuando hay amenaza, acoso, perdida de dinero o exposicion de datos.", "La respuesta debe cuidar a la persona y la evidencia.", ["Pausar", "Evidencia", "Bloquear", "Reportar", "Contener", "Aprender"])
    ],
    cases: [
      { title: "Compra dentro de juego", summary: "Aparece un gasto no esperado.", goal: "Configurar compras y conversar.", trigger: "cargo en tarjeta o tienda", courseAction: "revisar permisos, solicitar devolucion si aplica y acordar regla", evidence: "registro del cargo y configuracion corregida", error: "Culpar sin revisar configuracion.", aftercare: "Activar aprobacion de compras." },
      { title: "Contacto desconocido insiste", summary: "Una persona desconocida escribe en una app.", goal: "Cortar contacto y preservar evidencia.", trigger: "mensaje insistente", courseAction: "guardar captura, bloquear y reportar segun plataforma", evidence: "capturas con fecha y usuario", error: "Responder para investigar.", aftercare: "Revisar privacidad de perfiles." },
      { title: "Contrasena compartida", summary: "Varios integrantes usan la misma cuenta.", goal: "Separar accesos.", trigger: "clave conocida por todos", courseAction: "crear claves unicas y recuperar control", evidence: "cuentas actualizadas", error: "Mantener clave simple para no olvidarla.", aftercare: "Usar gestor o metodo acordado." },
      { title: "Foto familiar muy publica", summary: "Se comparte imagen con datos de escuela o ubicacion.", goal: "Revisar privacidad.", trigger: "publicacion con datos visibles", courseAction: "retirar o editar publicacion y ajustar audiencia", evidence: "publicacion corregida", error: "Pensar que solo la ven conocidos.", aftercare: "Regla antes de publicar." },
      { title: "Celular perdido", summary: "Un dispositivo familiar desaparece.", goal: "Bloquear y proteger cuentas.", trigger: "perdida o robo", courseAction: "usar ubicacion si corresponde, bloquear, cambiar claves y avisar", evidence: "lista de cuentas revisadas", error: "Esperar demasiado.", aftercare: "Activar bloqueo y respaldo." },
      { title: "Grupo agresivo", summary: "Un chat familiar o escolar se vuelve hostil.", goal: "Contener sin borrar evidencia.", trigger: "mensajes agresivos", courseAction: "guardar evidencia, pausar respuestas y escalar si corresponde", evidence: "capturas contextualizadas", error: "Responder con mas agresion.", aftercare: "Acordar reglas de grupo." },
      { title: "App con permisos excesivos", summary: "Una app pide contactos, camara y ubicacion sin necesidad.", goal: "Reducir permisos.", trigger: "permiso innecesario", courseAction: "revisar permisos y buscar alternativa si hace falta", evidence: "permisos antes/despues", error: "Aceptar todo para avanzar.", aftercare: "Revision mensual de apps." },
      { title: "Estafa por premio", summary: "Llega un mensaje de premio o sorteo.", goal: "Verificar antes de tocar links.", trigger: "premio inesperado", courseAction: "no abrir link, verificar fuente y reportar", evidence: "mensaje sospechoso", error: "Compartir con familiares por si es cierto.", aftercare: "Lista de senales de estafa." }
    ]
  },
  {
    folder: "whatsapp_business_avanzado_v0_6_publica",
    shortId: "wabiz",
    title: "WhatsApp Business Avanzado",
    shortName: "WhatsApp Business",
    subtitle: "Canal comercial, catalogo, etiquetas, respuestas, difusion, privacidad, metricas y mejora.",
    description: "Curso practico para usar WhatsApp Business con organizacion comercial, atencion clara, permisos, seguimiento y medicion responsable.",
    audience: "Emprendedores, comercios, oficios, atencion al cliente, ventas locales y equipos chicos que usan WhatsApp para vender o responder.",
    portalCategory: "Comercio digital",
    practiceArea: "atencion y ventas con WhatsApp Business",
    exampleContext: "Un negocio recibe consultas, pedidos y reclamos por WhatsApp y necesita ordenar catalogo, respuestas, etiquetas y seguimiento sin saturar clientes.",
    finalArtifact: "sistema de WhatsApp Business con catalogo, etiquetas, respuestas rapidas, campanas cuidadas y tablero de seguimiento",
    modules: [
      m("Estrategia del canal", "Definir para que se usa WhatsApp y que no debe resolverse ahi.", "mapa de usos permitidos, limites y horarios", "el canal tiene objetivo, horario y tipo de consulta definido", "politica de canal WhatsApp", "Usar WhatsApp para todo sin prioridad ni limites.", "Cuando se manejan pagos, datos personales, reclamos o garantias.", "Un canal sin reglas se vuelve desorden.", ["Objetivo", "Horario", "Tipos de consulta", "Derivaciones", "Limites", "Tono"]),
      m("Perfil, catalogo y confianza", "Ordenar informacion del negocio, productos, condiciones y enlaces.", "perfil y catalogo revisados con condiciones visibles", "el cliente puede entender oferta, precio y forma de compra", "catalogo confiable", "Publicar productos sin stock, precio o condiciones.", "Cuando hay promociones, cambios, envios o datos de pago.", "La confianza empieza antes del chat.", ["Perfil", "Descripcion", "Catalogo", "Precios", "Condiciones", "Enlaces"]),
      m("Etiquetas y seguimiento", "Clasificar conversaciones para no perder pedidos, reclamos ni oportunidades.", "sistema de etiquetas con estados y responsables", "cada conversacion importante tiene estado y proximo paso", "tablero de seguimiento en WhatsApp", "Dejar todo en chats sin estado.", "Cuando hay pedidos pendientes, reclamos o pagos.", "La etiqueta correcta evita olvidos.", ["Etiquetas", "Estados", "Prioridad", "Responsable", "Historial", "Cierre"]),
      m("Respuestas rapidas y automatizacion", "Crear respuestas utiles sin sonar robotico ni prometer de mas.", "biblioteca de respuestas con uso y limite", "cada respuesta informa, orienta y deja proximo paso", "biblioteca de respuestas", "Automatizar mensajes sensibles sin revision.", "Cuando el mensaje afecta precio, reclamo, garantia o privacidad.", "Automatizar no es desentenderse.", ["Bienvenida", "FAQ", "Horarios", "Precios", "Reclamos", "Derivacion"]),
      m("Difusion y campanas cuidadas", "Enviar novedades sin invadir, respetando permiso, frecuencia y segmentacion.", "campana con objetivo, segmento, permiso y metrica", "la difusion aporta valor y permite dejar de recibir", "plan de difusion responsable", "Enviar promociones masivas sin permiso ni segmentacion.", "Cuando se usan listas de clientes o datos de compra.", "La confianza se pierde con spam.", ["Segmentos", "Permiso", "Frecuencia", "Mensaje", "CTA", "Baja"]),
      m("Metricas, privacidad y mejora", "Medir consultas, conversion, tiempos, reclamos y calidad de atencion.", "tablero semanal con metricas, problemas y decisiones", "cada mejora surge de evidencia y no de sensacion", "rutina de mejora WhatsApp", "Medir solo cantidad de mensajes.", "Cuando hay reclamos repetidos, demoras o datos sensibles.", "Mas mensajes no siempre significa mejor atencion.", ["Consultas", "Conversion", "Tiempo de respuesta", "Reclamos", "Privacidad", "Mejora semanal"])
    ],
    cases: [
      { title: "Difusion sin consentimiento", summary: "Clientes reciben promociones que no pidieron.", goal: "Ajustar permiso y frecuencia.", trigger: "quejas por mensajes", courseAction: "detener envio, segmentar y ofrecer baja clara", evidence: "mensaje corregido y regla de lista", error: "Seguir enviando porque algunos compran.", aftercare: "Registrar permisos." },
      { title: "Catalogo desactualizado", summary: "Un producto figura disponible pero no hay stock.", goal: "Actualizar oferta.", trigger: "pedido imposible de cumplir", courseAction: "marcar sin stock, avisar alternativa y revisar rutina", evidence: "catalogo antes/despues", error: "Prometer conseguirlo sin plazo.", aftercare: "Revision semanal de catalogo." },
      { title: "Reclamo perdido", summary: "Un cliente reclama y el chat queda enterrado.", goal: "Etiquetar y cerrar seguimiento.", trigger: "reclamo sin estado", courseAction: "usar etiqueta, responsable y fecha de respuesta", evidence: "conversacion etiquetada", error: "Responder cuando aparezca tiempo.", aftercare: "Crear etiqueta de reclamos." },
      { title: "Respuesta automatica promete de mas", summary: "El mensaje confirma disponibilidad sin revisar.", goal: "Corregir automatizacion.", trigger: "plantilla ambigua", courseAction: "reescribir con condicion y paso de confirmacion", evidence: "respuesta antes/despues", error: "Mantener mensaje porque ahorra tiempo.", aftercare: "Auditar respuestas rapidas." },
      { title: "Etiqueta confusa", summary: "Hay demasiadas etiquetas y nadie las usa bien.", goal: "Simplificar sistema.", trigger: "estados duplicados", courseAction: "reducir a estados accionables", evidence: "lista de etiquetas nueva", error: "Agregar mas colores.", aftercare: "Revisar etiquetas mensualmente." },
      { title: "Datos sensibles en chat", summary: "Un cliente envia documento o datos de pago.", goal: "Minimizar y proteger informacion.", trigger: "dato personal recibido", courseAction: "pedir solo lo necesario y derivar a canal seguro si aplica", evidence: "protocolo de datos sensibles", error: "Guardar documentos en chats indefinidamente.", aftercare: "Definir retencion." },
      { title: "Campana satura consultas", summary: "Se lanza promocion sin capacidad de respuesta.", goal: "Planificar operacion.", trigger: "pico de mensajes", courseAction: "preparar respuestas, stock, horarios y prioridad", evidence: "plan de campana", error: "Enviar a todos al mismo tiempo.", aftercare: "Probar con segmento chico." },
      { title: "Metrica mal interpretada", summary: "Suben mensajes pero bajan ventas.", goal: "Medir conversion y calidad.", trigger: "mas actividad sin resultado", courseAction: "comparar consultas, pedidos, reclamos y ventas", evidence: "tablero semanal", error: "Celebrar volumen de chats.", aftercare: "Definir metrica principal." }
    ]
  }
];

for (const config of courses) writeCourseFiles(config);
updatePortalInventory(courses);
updateDocs(courses);

console.log(`Tanda 6 reforzada: ${courses.length} cursos`);
for (const config of courses) {
  const data = readJson(path.join(coursesRoot, config.folder, "src", "data", "course_content.json"));
  const lessons = data.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const quiz = data.modules.reduce((sum, module) => sum + module.quiz.length, 0);
  console.log(`- ${config.folder}: ${data.modules.length} modulos, ${lessons} lecciones, ${quiz} preguntas`);
}

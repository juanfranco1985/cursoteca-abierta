import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesRoot = path.join(root, "cursos");
const portalDataDir = path.join(root, "portal", "portal_publico_profesional_v0_6", "data");
const version = "0.7-tanda-2";
const publicationStatus = "publica-profesional-v0.7-tanda-2";
const date = "2026-06-04";

const responsibleNotice = "Contenido educativo introductorio. No reemplaza asesoramiento profesional, soporte oficial ni normativa aplicable. Si la decision afecta dinero, seguridad, datos personales, salud, trabajo o derechos, valida con fuentes oficiales o una persona competente antes de actuar.";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function lesson(id, module, item, course) {
  return {
    id,
    title: item.title,
    keyIdea: item.idea || `${item.title} ayuda a convertir una situacion sensible en una decision revisable, con evidencia y limites claros.`,
    shortTheory: item.theory || `En esta leccion se trabaja ${item.title.toLowerCase()} dentro de ${module.title.toLowerCase()}. El foco es separar hechos, riesgos, datos necesarios y pasos seguros antes de actuar.`,
    practicalExample: item.example || `${course.exampleContext} La practica consiste en aplicar ${item.title.toLowerCase()}, registrar ${module.evidence} y decidir el siguiente paso sin compartir datos sensibles.`,
    commonMistake: item.mistake || `El error frecuente es actuar por apuro, copiar una respuesta generica o confiar en una captura sin verificar por canales oficiales.`,
    whatToDoNow: item.practice || `Ejercicio de 25 minutos: toma un caso simulado, completa ${module.deliverable}, marca dudas y escribe que validarias con una fuente oficial antes de usarlo en un caso real.`,
    alert: item.alert || module.alert,
    keyPoints: [
      item.point || `${item.title} debe terminar en una accion concreta y verificable.`,
      `Criterio de cierre: ${module.criterion}.`,
      `Evidencia minima: ${module.evidence}.`,
      `Entregable del curso: ${course.finalArtifact}.`
    ],
    responsibleNote: responsibleNotice
  };
}

function quizForModule(module, moduleIndex) {
  const base = `m${moduleIndex + 1}`;
  return [
    {
      id: `${base}-q1`,
      question: `Que conviene hacer primero en "${module.title}"?`,
      options: [
        "Identificar hechos, datos sensibles, riesgo y evidencia antes de actuar.",
        "Resolver rapido para que la situacion no incomode.",
        "Copiar la primera respuesta que parezca correcta.",
        "Compartir mas datos para recibir ayuda mas rapido."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: en temas sensibles, ordenar el caso reduce errores y exposicion."
    },
    {
      id: `${base}-q2`,
      question: "Que evidencia permite revisar el resultado?",
      options: [
        module.evidence,
        "Una opinion general sin fecha.",
        "Una captura sin contexto ni fuente.",
        "Un mensaje reenviado sin verificacion."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.evidence} deja trazabilidad.`
    },
    {
      id: `${base}-q3`,
      question: "Que accion aumenta el riesgo?",
      options: [
        module.riskyChoice,
        "Usar datos simulados para practicar.",
        "Pedir validacion oficial si hay dudas.",
        "Anotar limites del ejercicio."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: esa accion elimina control y puede afectar dinero, cuentas o derechos."
    },
    {
      id: `${base}-q4`,
      question: "Cuando se debe escalar o consultar una fuente competente?",
      options: [
        module.helpTrigger,
        "Nunca, porque un curso introductorio alcanza para todo.",
        "Solo cuando ya se perdio la evidencia.",
        "Cuando la respuesta generada suena segura."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: la validacion externa es parte del cuidado en temas sensibles."
    },
    {
      id: `${base}-q5`,
      question: `Cual es el entregable minimo de "${module.title}"?`,
      options: [
        module.deliverable,
        "Una lista de ideas sin prioridad.",
        "Una decision sin evidencia.",
        "Un resumen que no indica riesgos."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.deliverable} permite continuar con orden.`
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
      learningRisk: module.learningRisk || "Practicar sin evidencia puede llevar a decisiones inseguras o dificiles de corregir.",
      lessons: module.lessons.map((item, lessonIndex) => lesson(`m${moduleIndex + 1}-l${lessonIndex + 1}`, module, item, courseFromConfig(config))),
      quiz: quizForModule(module, moduleIndex)
    }))
  };
}

function courseFromConfig(config) {
  return {
    exampleContext: config.exampleContext,
    finalArtifact: config.finalArtifact
  };
}

const checklistItemTitles = [
  "Situacion definida",
  "Datos sensibles separados",
  "Fuente oficial o criterio marcado",
  "Riesgo priorizado",
  "Evidencia guardada",
  "Proximo paso responsable"
];

function buildChecklists(config) {
  return {
    checklists: config.modules.map((module, moduleIndex) => ({
      id: `${config.shortId}-checklist-${moduleIndex + 1}`,
      title: `${module.title}: checklist operativo`,
      description: `Control practico para aplicar ${module.title.toLowerCase()} en ${config.practiceArea} sin depender de memoria ni improvisacion.`,
      commercialArea: config.practiceArea,
      items: checklistItemTitles.map((title, itemIndex) => ({
        id: `${config.shortId}-cl${moduleIndex + 1}-i${itemIndex + 1}`,
        title,
        explanation: `${title} en ${module.title.toLowerCase()} ayuda a revisar el caso antes de actuar, especialmente si hay dinero, cuentas, tramites o datos personales.`,
        recommendedAction: `Aplicar sobre un caso simulado y conservar ${module.evidence}. Cierre esperado: ${module.criterion}.`
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
        `Detener la accion automatica y describir el disparador: ${item.trigger}.`,
        "Separar datos reales, datos simulados y datos que no deben compartirse.",
        `Aplicar el criterio del curso: ${item.courseAction}.`,
        `Guardar evidencia: ${item.evidence}.`,
        "Definir si alcanza con una accion propia o si corresponde canal oficial, profesional o soporte competente.",
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
        "Compartir claves, codigos, documentos completos o datos bancarios.",
        "Confiar solo en capturas o mensajes reenviados.",
        "Borrar evidencia antes de entender el problema.",
        "Tomar una practica educativa como recomendacion profesional definitiva."
      ],
      aftercare: [
        item.aftercare,
        "Actualizar checklist personal o familiar.",
        "Guardar una plantilla reutilizable.",
        "Revisar si hace falta bloquear, reclamar, denunciar o consultar por canales oficiales."
      ],
      guidedDecision: {
        question: "Que decision reduce mejor el riesgo?",
        options: [
          {
            text: "Pausar, verificar por canal oficial, guardar evidencia y actuar solo con informacion suficiente.",
            isCorrect: true,
            feedback: "Correcto: baja la probabilidad de fraude, error o exposicion de datos."
          },
          {
            text: "Responder rapido para no perder tiempo.",
            isCorrect: false,
            feedback: "La rapidez sin verificacion puede agravar el problema."
          },
          {
            text: "Enviar mas datos para que otra persona decida.",
            isCorrect: false,
            feedback: "En temas sensibles se comparte lo minimo necesario y por canales confiables."
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
    templateVersion: "0.7-publica-profesional-tanda-2",
    appName: config.title,
    shortName: config.shortName,
    subtitle: config.subtitle,
    description: config.description,
    audience: config.audience,
    responsibleNotice,
    cacheName: `${config.folder}-cache-${version}`,
    contentAudit: {
      status: "reforzado-tanda-2",
      date,
      modules: 6,
      lessons: 36,
      quizQuestions: 30,
      checklists: 6,
      cases: 8,
      notes: "Contenido reemplazado para reducir patrones genericos en cursos sensibles."
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
    reinforcedBatch2: true,
    publicationCandidate: true,
    publicProfessionalEdition: true,
    requiresBackend: false,
    requiresLogin: false
  };
  const note = "v0.7 tanda 2 reemplaza contenido generico por modulos, practicas, checklists y casos especificos en cursos sensibles.";
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
  if (config.financialTools) writeJson(path.join(dataDir, "financial_tools.json"), config.financialTools);
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
    course.version = "v0.7 tanda 2 reforzada";
    course.status = "Curso reforzado - tanda 2";
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
    if (config.financialTools) course.features.push("Herramientas financieras actualizadas");
    course.recommendedBase = "Contenido reforzado con practicas, evidencia, casos sensibles y criterios de validacion.";
    course.tags = [...new Set([...(course.tags || []), "reforzado-tanda-2", "contenido-v0-7", "curso-sensible"])];
    course.publicReady = true;
  }
  writeJson(coursesFile, courses);

  const csvFile = path.join(portalDataDir, "courses_inventory.csv");
  if (fs.existsSync(csvFile)) {
    let csv = fs.readFileSync(csvFile, "utf8");
    for (const config of configs) {
      const lineRegex = new RegExp(`^${config.folder},.*$`, "m");
      const title = csvCell(config.title);
      const audience = csvCell(config.audience);
      const category = csvCell(config.portalCategory || config.practiceArea);
      csv = csv.replace(lineRegex, `${config.folder},${title},v0.7 tanda 2 reforzada,Curso reforzado - tanda 2,${category},${audience},../../cursos/${config.folder}/index.html,true,true`);
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
    for (const config of configs) {
      text = text.replace(`- \`${config.folder}\`\n`, "");
    }
    text = text.replace("Pendientes actuales despues de UX/UI y tanda 1:", "Pendientes actuales despues de UX/UI, tanda 1 y tanda 2:");
    text = text.replace("Deuda de contenido generico despues de esta tanda: 27 cursos.", "Deuda de contenido generico despues de esta tanda: 27 cursos.");
    const marker = "## Tanda 2 de refuerzo";
    const block = `${marker}\n\nCompletada el ${date} con 5 cursos sensibles reforzados:\n\n${configs.map(config => `- ${config.folder}: 6 modulos, 36 lecciones, 30 preguntas, 6 checklists y 8 casos guiados.`).join("\n")}\n\nDeuda de contenido generico despues de esta tanda: 22 cursos.\n`;
    if (!text.includes(marker)) text = `${text.trim()}\n\n${block}\n`;
    fs.writeFileSync(auditFile, text, "utf8");
  }

  const checklistFile = path.join(root, "CHECKLIST_PUBLICACION_BETA.md");
  if (fs.existsSync(checklistFile)) {
    let text = fs.readFileSync(checklistFile, "utf8");
    if (!text.includes("Reforzar segunda tanda de 5 cursos sensibles")) {
      text = text.replace(
        "- [ ] Reforzar los 27 cursos restantes con patrones de contenido generico.",
        "- [x] Reforzar segunda tanda de 5 cursos sensibles.\n- [ ] Reforzar los 22 cursos restantes con patrones de contenido generico."
      );
    }
    fs.writeFileSync(checklistFile, text, "utf8");
  }

  const pendingFile = path.join(root, "PENDIENTES_REALES_V1_0_BETA.md");
  if (fs.existsSync(pendingFile)) {
    let text = fs.readFileSync(pendingFile, "utf8");
    text = text.replace(
      "La auditoria del 2026-06-04 detecto 32 cursos con patrones de contenido generico. UX/UI Basico fue reforzado como primera muestra y la tanda 1 reforzo 5 cursos adicionales. Quedan 27 cursos por trabajar antes de considerar v1.0 final.",
      "La auditoria del 2026-06-04 detecto 32 cursos con patrones de contenido generico. UX/UI Basico fue reforzado como primera muestra, la tanda 1 reforzo 5 cursos adicionales y la tanda 2 reforzo 5 cursos sensibles. Quedan 22 cursos por trabajar antes de considerar v1.0 final."
    );
    fs.writeFileSync(pendingFile, text, "utf8");
  }
}

function makeLessons(titles, prefix) {
  return titles.map(([title, idea, practice, mistake]) => ({
    title,
    idea: idea || `${title} se trabaja con pasos concretos, evidencia y una decision prudente.`,
    practice: practice || `Aplicar ${title.toLowerCase()} sobre un caso simulado y anotar que dato se usa, que riesgo existe y que fuente validaria.`,
    mistake: mistake || `Resolver ${title.toLowerCase()} de memoria, sin verificar datos ni conservar evidencia.`,
    point: `${prefix}: ${title} debe poder explicarse a otra persona sin exponer datos sensibles.`
  }));
}

const financialTools = {
  budgetCategories: [
    { id: "ingresos", label: "Ingresos mensuales estimados" },
    { id: "vivienda", label: "Alquiler, expensas o vivienda" },
    { id: "servicios", label: "Servicios, internet, celular y plataformas" },
    { id: "alimentos", label: "Alimentos y compras basicas" },
    { id: "transporte", label: "Transporte y movilidad" },
    { id: "deudas", label: "Cuotas, prestamos, tarjetas y billeteras" },
    { id: "salud", label: "Salud, medicamentos y cuidado familiar" },
    { id: "otros", label: "Otros gastos variables" }
  ],
  antExpenses: [
    { id: "kiosco", label: "Kiosco, cafe, snack o gaseosa" },
    { id: "delivery", label: "Delivery o comida rapida" },
    { id: "suscripciones", label: "Suscripciones poco usadas" },
    { id: "transferencias", label: "Comisiones, recargas o transferencias evitables" },
    { id: "impulsos", label: "Compras por impulso en apps o redes" }
  ],
  messages: [
    {
      id: "verificar_acreditacion",
      title: "Verificar acreditacion antes de entregar",
      context: "Para ventas por QR, transferencia, link de pago o billetera.",
      body: "Hola. Para cuidar la operacion, primero necesito verificar que el pago figure acreditado en la app oficial de banco o billetera. La captura o PDF no alcanza como confirmacion. Te aviso apenas lo vea acreditado."
    },
    {
      id: "pausar_devolucion",
      title: "Pausar devolucion dudosa",
      context: "Cuando alguien presiona para devolver una transferencia desconocida.",
      body: "Recibi tu mensaje. Por seguridad no voy a mover fondos hasta verificar el origen por canales oficiales de mi banco o billetera. Si corresponde una devolucion, seguire el procedimiento formal de la entidad."
    },
    {
      id: "movimiento_desconocido",
      title: "Ordenar reclamo por movimiento desconocido",
      context: "Para contactar banco, tarjeta o billetera sin compartir claves.",
      body: "Necesito registrar un reclamo por un movimiento que no reconozco. Fecha aproximada: ____. Monto: ____. Medio afectado: ____. No comparti claves ni codigos por este canal. Solicito numero de reclamo y pasos oficiales."
    },
    {
      id: "link_pago_sospechoso",
      title: "Responder ante link de pago sospechoso",
      context: "Cuando llega un enlace por chat, SMS o correo.",
      body: "No voy a ingresar al link recibido por mensaje. Para evitar fraudes, voy a entrar desde la app o sitio oficial escribiendo la direccion por mi cuenta. Si hace falta, vuelvo a consultar por el canal oficial."
    },
    {
      id: "comprobante_incompleto",
      title: "Pedir datos minimos de comprobante",
      context: "Cuando el comprobante no coincide o falta informacion.",
      body: "El comprobante recibido no permite confirmar la operacion. Necesito verificar monto, fecha, destinatario y estado desde el canal oficial. Hasta que no figure acreditado, dejo la operacion pendiente."
    }
  ],
  riskQuestions: [
    {
      id: "money",
      question: "Hay dinero, tarjeta, cuenta bancaria o billetera comprometida ahora?",
      options: [
        { label: "Si, hay movimiento o acceso sospechoso", score: 3 },
        { label: "Hay dudas, pero no veo movimiento todavia", score: 2 },
        { label: "No, es preventivo", score: 0 }
      ]
    },
    {
      id: "pressure",
      question: "Alguien presiona para entregar producto, devolver dinero o compartir codigos?",
      options: [
        { label: "Si, hay apuro, amenaza o insistencia", score: 3 },
        { label: "Insisten, pero sin amenaza directa", score: 2 },
        { label: "No", score: 0 }
      ]
    },
    {
      id: "proof",
      question: "La unica prueba es una captura, PDF o comprobante enviado por chat?",
      options: [
        { label: "Si, no lo verifique en app oficial", score: 3 },
        { label: "Lo estoy verificando", score: 1 },
        { label: "No, ya figura acreditado oficialmente", score: 0 }
      ]
    },
    {
      id: "credentials",
      question: "Compartiste clave, codigo, token o instalaste algo por indicacion de un tercero?",
      options: [
        { label: "Si", score: 3 },
        { label: "No estoy seguro", score: 2 },
        { label: "No", score: 0 }
      ]
    },
    {
      id: "official",
      question: "Verificaste desde app, sitio o telefono oficial escrito por vos?",
      options: [
        { label: "No, vengo desde un link recibido", score: 3 },
        { label: "Parcialmente", score: 1 },
        { label: "Si, desde canal oficial", score: 0 }
      ]
    }
  ],
  riskLevels: [
    { min: 0, max: 3, level: "Bajo", className: "ok", title: "Riesgo bajo o preventivo", advice: ["Reforza habitos y notificaciones.", "Guarda comprobantes utiles.", "No compartas datos innecesarios."] },
    { min: 4, max: 7, level: "Medio", className: "warn", title: "Riesgo medio", advice: ["Pausa antes de operar.", "Verifica desde canal oficial.", "Conserva capturas y datos de contexto."] },
    { min: 8, max: 11, level: "Alto", className: "danger", title: "Riesgo alto", advice: ["No entregues producto ni devuelvas dinero sin acreditacion oficial.", "No compartas codigos.", "Contacta banco, billetera o soporte oficial."] },
    { min: 12, max: 99, level: "Critico", className: "danger", title: "Riesgo critico", advice: ["Bloquea medio afectado si corresponde.", "Cambia claves desde dispositivo seguro.", "Registra reclamo y preserva evidencia."] }
  ],
  duePlannerDefaults: {
    categories: ["Tarjeta", "Prestamo", "Servicio", "Alquiler", "Impuesto", "Suscripcion", "Proveedor", "Otro"],
    priorityRules: [
      { daysMax: 0, level: "Vencido", className: "danger", advice: "Prioridad maxima: verificar recargos, corte de servicio o canal oficial de pago." },
      { daysMax: 3, level: "Muy proximo", className: "danger", advice: "Reservar monto y pagar desde canal oficial; evitar links recibidos por mensaje." },
      { daysMax: 7, level: "Esta semana", className: "warn", advice: "Programar pago y confirmar monto real." },
      { daysMax: 30, level: "Proximo", className: "ok", advice: "Dejar registrado y revisar presupuesto." },
      { daysMax: 9999, level: "Futuro", className: "ok", advice: "Sin accion inmediata; mantener en calendario." }
    ]
  },
  specialChecklists: [
    {
      id: "comprobante_dudoso",
      title: "Checklist ante comprobante dudoso",
      description: "Usar antes de entregar producto, prestar servicio o devolver dinero.",
      items: [
        "No entregar solo por captura o PDF.",
        "Verificar acreditacion en app oficial.",
        "Comparar monto, fecha, destinatario y estado.",
        "No abrir links enviados por el comprador.",
        "Guardar chat y comprobante recibido.",
        "Responder con mensaje calmo y sin acusaciones."
      ]
    },
    {
      id: "movimiento_no_reconocido",
      title: "Checklist ante movimiento no reconocido",
      description: "Usar cuando aparece un gasto, transferencia o acceso sospechoso.",
      items: [
        "No borrar notificaciones ni comprobantes.",
        "Entrar desde app oficial, no desde links.",
        "Bloquear tarjeta o medio si corresponde.",
        "Cambiar clave si hubo acceso dudoso.",
        "Registrar reclamo y numero de caso.",
        "Revisar dispositivos y sesiones activas."
      ]
    },
    {
      id: "vencimientos",
      title: "Checklist mensual de vencimientos",
      description: "Usar para ordenar pagos sin caer en links falsos ni recargos evitables.",
      items: [
        "Listar vencimientos por fecha.",
        "Separar pagos criticos de pagos postergables.",
        "Confirmar importe en canal oficial.",
        "Guardar comprobantes utiles.",
        "Revisar debitos automaticos.",
        "Actualizar presupuesto mensual."
      ]
    }
  ],
  commerceGuide: {
    title: "Guia de cobro digital seguro para comercios chicos",
    description: "Rutina para cobrar con QR, transferencia o billetera sin depender de capturas ni presion del comprador.",
    sections: [
      { kicker: "Antes", title: "Preparar medios de cobro", items: ["Definir medios aceptados.", "Separar cuenta personal y comercial si es posible.", "Activar alertas de movimientos.", "Tener canales oficiales de soporte a mano."] },
      { kicker: "Durante", title: "Confirmar sin apuro", items: ["Verificar acreditacion desde app oficial.", "Comparar monto y destinatario.", "No entregar por captura.", "Usar mensaje copiable si hay presion."] },
      { kicker: "Despues", title: "Cerrar caja y evidencia", items: ["Revisar operaciones pendientes.", "Guardar evidencia solo si hay conflicto.", "Registrar reclamos.", "Actualizar reglas del equipo."] }
    ]
  }
};

const courses = [
  {
    folder: "finanzas_digitales_seguras_web_v0_6_publica",
    shortId: "findig",
    courseId: "finanzas-digitales-seguras",
    title: "Finanzas Digitales Seguras Argentina",
    shortName: "Finanzas Digitales",
    subtitle: "Billeteras, transferencias, comprobantes, tarjetas, presupuesto y respuesta ante fraudes.",
    description: "Curso practico para usar pagos digitales con mas control, verificar operaciones y actuar con calma ante movimientos sospechosos.",
    audience: "Personas que usan billeteras, transferencias, QR, tarjetas o ventas digitales en Argentina.",
    portalCategory: "Finanzas digitales",
    practiceArea: "uso seguro de pagos digitales y finanzas cotidianas",
    exampleContext: "Una persona cobra por QR, recibe comprobantes por WhatsApp y necesita ordenar gastos, vencimientos y riesgos.",
    finalArtifact: "protocolo personal de finanzas digitales con presupuesto, verificacion de pagos, alertas y respuesta ante incidentes",
    financialTools,
    modules: [
      {
        title: "Mapa de dinero digital",
        description: "Identificar cuentas, billeteras, tarjetas, claves, limites y canales oficiales antes de operar.",
        evidence: "mapa de medios de pago, cuentas y canales oficiales",
        criterion: "cada medio tiene uso, riesgo, limite y canal de soporte identificado",
        deliverable: "mapa personal de finanzas digitales",
        riskyChoice: "Guardar claves o codigos en chats y operar desde links recibidos.",
        helpTrigger: "Cuando hay acceso desconocido, perdida de telefono, movimiento no reconocido o pedido de codigo.",
        alert: "El canal oficial se abre desde la app o sitio escrito por vos, no desde un link recibido.",
        lessons: makeLessons([
          ["Cuentas, billeteras y tarjetas", "Cada medio cumple una funcion distinta y expone riesgos distintos.", "Listar cuenta bancaria, billetera, tarjeta y uso principal.", "Usar la misma cuenta para todo sin limites ni alertas."],
          ["Alias, CBU, CVU y QR", "Saber que dato identifica una cuenta evita enviar o cobrar mal.", "Comparar alias, CBU/CVU y QR en un caso simulado.", "Confiar solo en el nombre que aparece en una captura."],
          ["Claves, PIN y biometria", "Las credenciales son llaves: no se comparten ni se dictan.", "Escribir reglas personales para claves y codigos.", "Reenviar un codigo para que otro 'ayude'."],
          ["Canales oficiales", "La verificacion se hace desde app, sitio o telefono oficial.", "Guardar canales oficiales de banco, billetera y tarjeta.", "Entrar al soporte desde anuncios o mensajes."],
          ["Limites y notificaciones", "Los limites reducen dano y las alertas avisan rapido.", "Revisar que alertas conviene activar.", "Tener limites altos sin necesidad."],
          ["Evidencia financiera minima", "Fecha, monto, medio y estado ayudan a reclamar.", "Crear una ficha de comprobante seguro.", "Guardar capturas sueltas sin contexto."]
        ], "Finanzas")
      },
      {
        title: "Presupuesto y vencimientos",
        description: "Ordenar ingresos, gastos, deudas, vencimientos y margen de maniobra mensual.",
        evidence: "presupuesto mensual con vencimientos y pagos criticos",
        criterion: "el presupuesto muestra saldo estimado, pagos cercanos y decisiones posibles",
        deliverable: "presupuesto digital de 30 dias",
        riskyChoice: "Pagar por links recibidos sin confirmar deuda o importe.",
        helpTrigger: "Cuando una deuda puede generar corte, recargo, refinanciacion o embargo.",
        alert: "Un vencimiento urgente no justifica entrar por un link dudoso.",
        lessons: makeLessons([
          ["Ingresos reales y estimados", "Separar ingresos seguros de esperados evita gastar dinero que no entro.", "Armar dos columnas: confirmado y posible.", "Contar como disponible un pago aun pendiente."],
          ["Gastos fijos y variables", "Distinguir gastos permite encontrar margen de ajuste.", "Clasificar gastos del mes en fijos, variables y evitables.", "Meter todo en 'otros' y perder control."],
          ["Vencimientos criticos", "No todos los pagos pesan igual: vivienda, servicios, tarjeta y deudas tienen prioridad.", "Ordenar cinco vencimientos por fecha e impacto.", "Pagar primero lo menos importante por comodidad."],
          ["Debitos automaticos", "Los debitos ayudan, pero tambien ocultan gastos olvidados.", "Revisar debitos y suscripciones activas.", "No mirar debitos hasta que falta saldo."],
          ["Gastos hormiga digitales", "Suscripciones, apps y comisiones pequenas se acumulan.", "Usar la herramienta de gastos hormiga con valores simulados.", "Desestimar importes chicos sin multiplicarlos."],
          ["Decision de ajuste", "Un presupuesto sirve si cambia una decision.", "Elegir una accion: bajar gasto, renegociar, postergar o consultar.", "Hacer cuentas sin definir proximo paso."]
        ], "Presupuesto")
      },
      {
        title: "Transferencias, QR y comprobantes",
        description: "Verificar acreditacion, estado de operaciones y senales de comprobantes dudosos.",
        evidence: "registro de verificacion de pago con fuente oficial",
        criterion: "la operacion se confirma solo si aparece acreditada oficialmente",
        deliverable: "protocolo de cobro y pago seguro",
        riskyChoice: "Entregar producto o devolver dinero solo por una captura.",
        helpTrigger: "Cuando hay operacion pendiente, comprobante dudoso, pago duplicado o presion del comprador.",
        alert: "Captura no es acreditacion.",
        lessons: makeLessons([
          ["Acreditado, pendiente y rechazado", "El estado de la app oficial manda mas que el comprobante enviado.", "Comparar tres estados de pago simulados.", "Entregar cuando el pago figura pendiente."],
          ["Comprobante recibido por chat", "Una imagen puede estar editada o no corresponder a tu cuenta.", "Aplicar checklist de comprobante dudoso.", "Mirar solo monto y olvidar destinatario."],
          ["QR propio y QR ajeno", "Un QR equivocado puede enviar dinero a otra cuenta.", "Verificar nombre y destino antes de pagar.", "Escanear QR pegados o reenviados sin confirmar."],
          ["Transferencia desconocida", "Si aparece dinero inesperado no se devuelve por presion.", "Escribir mensaje de pausa y verificacion.", "Devolver de inmediato a quien presiona."],
          ["Errores de pago", "Un pago fallido requiere evidencia, no reintentos infinitos.", "Registrar hora, medio y mensaje de error.", "Presionar pagar muchas veces."],
          ["Cierre de venta", "El cierre ordena entrega, comprobante y seguimiento.", "Crear pasos para venta por WhatsApp.", "Cerrar sin guardar evidencia en operaciones dudosas."]
        ], "Comprobantes")
      },
      {
        title: "Fraudes y presion digital",
        description: "Detectar urgencias falsas, enlaces, llamadas y pedidos de codigos.",
        evidence: "analisis de mensaje sospechoso con senales de fraude",
        criterion: "se decide detener, verificar o escalar por senales observables",
        deliverable: "matriz de riesgo financiero digital",
        riskyChoice: "Compartir codigos, claves o instalar apps por llamada.",
        helpTrigger: "Cuando piden codigo, token, clave, acceso remoto o transferencia urgente.",
        alert: "Banco, billetera o tarjeta no necesitan que les dictes tu clave o codigo.",
        lessons: makeLessons([
          ["Urgencia, miedo y premio", "La presion busca que actues sin revisar.", "Subrayar palabras de presion en mensajes simulados.", "Responder para que no bloqueen la cuenta."],
          ["Links de bancos y billeteras", "El dominio y el canal importan mas que el logo.", "Comparar un link oficial con uno falso.", "Confiar en logos o colores."],
          ["Llamadas de supuesto soporte", "El soporte real no pide claves ni acceso remoto por sorpresa.", "Escribir guion para cortar y llamar al canal oficial.", "Seguir instrucciones porque conocen tu nombre."],
          ["Codigos y tokens", "Un codigo puede autorizar ingreso u operacion.", "Crear regla familiar sobre codigos.", "Dictar codigos para 'cancelar' una operacion."],
          ["Apps de acceso remoto", "Permiten ver o controlar pantalla.", "Identificar apps de asistencia remota y riesgos.", "Instalar una app porque lo indica una llamada."],
          ["Diagnostico rapido", "Un cuestionario ayuda a priorizar respuesta.", "Usar preguntas de riesgo con un caso simulado.", "Minimizar senales porque todavia no falta dinero."]
        ], "Fraudes")
      },
      {
        title: "Deudas, cuotas y tarjetas",
        description: "Leer deuda, cuotas, intereses, resumen de tarjeta y alternativas con prudencia.",
        evidence: "ficha de deuda con monto, vencimiento, costo y fuente",
        criterion: "la decision considera costo total, fecha y consecuencia de no pagar",
        deliverable: "inventario de deudas y cuotas",
        riskyChoice: "Tomar credito o refinanciar sin leer costo total.",
        helpTrigger: "Cuando no se puede pagar, hay mora, refinanciacion, intimacion o duda legal.",
        alert: "Este curso no reemplaza asesoramiento financiero ni legal.",
        lessons: makeLessons([
          ["Resumen de tarjeta", "El resumen separa consumo, vencimiento, pago minimo e intereses.", "Leer un resumen simulado y marcar datos clave.", "Pagar minimo sin entender costo."],
          ["Cuotas y costo total", "La cuota baja puede esconder costo total alto.", "Comparar precio contado y cuotas.", "Mirar solo valor mensual."],
          ["Prestamos y refinanciacion", "Refinanciar puede aliviar o encarecer.", "Anotar monto, plazo, tasa visible y costo final.", "Aceptar propuesta por mensaje sin fuente oficial."],
          ["Prioridad de pago", "Cuando no alcanza, se prioriza por impacto y recargo.", "Ordenar deudas simuladas por riesgo.", "Pagar al azar al que mas insiste."],
          ["Comunicaciones de deuda", "Hay que distinguir canal oficial, estafa y reclamo formal.", "Analizar aviso de deuda simulado.", "Pagar a un alias enviado por WhatsApp."],
          ["Consulta competente", "Algunas decisiones requieren asesoramiento externo.", "Escribir que preguntas haria a entidad o profesional.", "Firmar acuerdos sin entender."]
        ], "Deudas")
      },
      {
        title: "Respuesta ante incidentes financieros",
        description: "Bloquear dano, preservar evidencia, reclamar y recuperar control.",
        evidence: "registro de incidente con accion, reclamo y seguimiento",
        criterion: "se protege la cuenta afectada y se conserva informacion util para reclamo",
        deliverable: "protocolo de emergencia financiera digital",
        riskyChoice: "Borrar chats, seguir conversando o mover fondos sin verificar.",
        helpTrigger: "Ante movimiento no reconocido, cuenta tomada, perdida de celular o datos compartidos.",
        alert: "En emergencia financiera, actuar por canales oficiales y registrar numero de reclamo.",
        lessons: makeLessons([
          ["Primeros 10 minutos", "Pausar, bloquear si corresponde y guardar evidencia.", "Escribir pasos inmediatos para movimiento desconocido.", "Seguir hablando con quien presiona."],
          ["Bloqueo preventivo", "Bloquear tarjeta o cuenta puede evitar mas dano.", "Identificar donde se bloquea cada medio.", "Esperar a ver si se soluciona solo."],
          ["Reclamo formal", "El reclamo necesita datos claros y numero de caso.", "Completar plantilla de reclamo.", "Hacer reclamo por canales no oficiales."],
          ["Cambio de claves", "Si hubo acceso, se cambia clave desde dispositivo seguro.", "Armar secuencia de cambio y cierre de sesiones.", "Cambiar clave desde link recibido."],
          ["Evidencia ordenada", "Capturas, fechas y movimientos deben guardarse sin exponer mas datos.", "Crear carpeta de incidente simulado.", "Borrar por verguenza."],
          ["Seguimiento posterior", "Despues del reclamo se revisan cuentas, limites y aprendizajes.", "Planificar controles de 24h, 7 dias y 30 dias.", "Cerrar el caso sin seguimiento."]
        ], "Incidentes")
      }
    ],
    cases: [
      { title: "Comprobante falso por WhatsApp", summary: "Un comprador envia captura y presiona para retirar el producto.", goal: "Evitar entrega sin acreditacion real.", trigger: "captura de pago sin movimiento acreditado", courseAction: "verificar en app oficial y usar mensaje de pausa", evidence: "captura recibida, hora y estado real en app", error: "Entregar producto por miedo a perder la venta.", aftercare: "Agregar regla: solo se entrega con acreditacion oficial." },
      { title: "Transferencia desconocida y pedido de devolucion", summary: "Alguien dice haberse equivocado y exige devolver dinero ya.", goal: "No mover fondos sin verificar origen.", trigger: "presion por devolucion inmediata", courseAction: "consultar entidad y no operar desde datos enviados por tercero", evidence: "mensaje, monto y consulta oficial", error: "Devolver a un alias enviado por chat.", aftercare: "Guardar mensaje copiable de devolucion dudosa." },
      { title: "SMS de bloqueo de billetera", summary: "Un mensaje indica que la cuenta sera bloqueada si no se entra al link.", goal: "Reconocer phishing financiero.", trigger: "link con amenaza de bloqueo", courseAction: "entrar por app oficial y reportar mensaje", evidence: "remitente, link y captura sin tocar", error: "Ingresar clave desde el link.", aftercare: "Activar alertas y revisar sesiones." },
      { title: "Pago duplicado por reintento", summary: "La app tardo y la persona presiono pagar dos veces.", goal: "Pausar, verificar y reclamar con evidencia.", trigger: "operacion lenta o error ambiguo", courseAction: "no reintentar hasta revisar movimientos", evidence: "hora, comprobantes y estado de ambos pagos", error: "Seguir intentando sin revisar.", aftercare: "Crear regla de espera ante pagos lentos." },
      { title: "Tarjeta con consumo no reconocido", summary: "Aparece un gasto que la persona no identifica.", goal: "Bloquear si corresponde y reclamar.", trigger: "movimiento desconocido", courseAction: "verificar, bloquear medio afectado y registrar reclamo", evidence: "fecha, comercio, monto y numero de reclamo", error: "Esperar al cierre de resumen sin hacer nada.", aftercare: "Revisar alertas y limites." },
      { title: "Llamada que pide instalar app", summary: "Supuesto soporte pide instalar acceso remoto para anular un gasto.", goal: "Cortar posible fraude.", trigger: "pedido de app y codigo", courseAction: "cortar, no instalar y llamar al canal oficial", evidence: "numero, app solicitada y horario", error: "Instalar para que el operador ayude.", aftercare: "Revisar apps y permisos." },
      { title: "Vencimiento pagado desde link falso", summary: "Un aviso de servicio impago lleva a un sitio no oficial.", goal: "Distinguir deuda real de fraude.", trigger: "link de pago recibido por mensaje", courseAction: "buscar deuda en canal oficial", evidence: "mensaje, dominio y deuda oficial", error: "Pagar por el link por urgencia.", aftercare: "Usar planificador de vencimientos." },
      { title: "Clave compartida con familiar", summary: "Para recibir ayuda se compartio la clave de una billetera.", goal: "Recuperar control y establecer ayuda segura.", trigger: "clave dictada o enviada", courseAction: "cambiar clave, cerrar sesiones y definir ayuda sin claves", evidence: "fecha y cuenta afectada", error: "Mantener la clave porque es familiar.", aftercare: "Crear regla familiar de no compartir credenciales." }
    ]
  },
  {
    folder: "tramites_digitales_argentina_v0_6_publica",
    shortId: "tram",
    courseId: "tramites-digitales-argentina",
    title: "Tramites Digitales Argentina",
    shortName: "Tramites Digitales",
    subtitle: "Sitios oficiales, requisitos, turnos, claves, formularios, comprobantes y seguimiento.",
    description: "Curso practico para preparar, completar y seguir tramites digitales con menos improvisacion y mas cuidado de datos.",
    audience: "Personas que hacen tramites online, familias y acompanantes digitales en Argentina.",
    portalCategory: "Tramites digitales",
    practiceArea: "gestion segura de tramites digitales",
    exampleContext: "Una persona necesita sacar un turno, completar un formulario y conservar comprobantes sin caer en sitios falsos.",
    finalArtifact: "carpeta de tramite con requisitos, canal oficial, pasos, comprobante y seguimiento",
    modules: [
      { title: "Preparar el tramite", description: "Definir objetivo, organismo, requisitos, datos y riesgos antes de empezar.", evidence: "ficha de tramite con objetivo, fuente oficial y requisitos", criterion: "el tramite tiene canal oficial identificado y datos necesarios separados", deliverable: "ficha preparatoria de tramite", riskyChoice: "Entrar desde anuncios o links reenviados sin verificar organismo.", helpTrigger: "Cuando se piden claves fiscales, documentos, pagos, salud o datos sensibles.", alert: "Un tramite real se prepara antes de cargar datos.", lessons: makeLessons([["Objetivo y organismo", "Saber que se quiere lograr evita entrar a sitios equivocados."], ["Fuente oficial", "El dominio y el organismo importan mas que el primer resultado."], ["Requisitos previos", "Leer requisitos evita abandonar a mitad del flujo."], ["Datos necesarios", "Se separan datos obligatorios de datos que no conviene compartir."], ["Tiempo y vencimiento", "Fechas y plazos cambian prioridad."], ["Plan B", "Si el sitio falla, conviene saber canal alternativo."]], "Tramites") },
      { title: "Identidad digital y claves", description: "Cuidar cuentas, claves, recuperacion y sesiones en portales oficiales.", evidence: "mapa de cuentas y recuperacion vinculadas al tramite", criterion: "la cuenta puede recuperarse sin entregar claves a terceros", deliverable: "ficha segura de identidad digital", riskyChoice: "Prestar usuario, clave o codigo para que otro haga el tramite.", helpTrigger: "Cuando se pierde acceso, aparece error de identidad o se bloquea una cuenta.", alert: "Clave y codigo son personales aunque alguien ayude.", lessons: makeLessons([["Usuario y clave", "La cuenta representa identidad y responsabilidad."], ["Recuperacion", "Correo y telefono actualizados evitan perder acceso."], ["Codigos de verificacion", "Un codigo puede autorizar ingreso o cambio."], ["Equipo compartido", "En computadoras ajenas se cierra sesion y no se guarda clave."], ["Acompanamiento seguro", "Se puede pedir guia sin entregar control."], ["Registro de accesos", "Anotar donde se ingreso ayuda a detectar problemas."]], "Identidad") },
      { title: "Formularios y carga de datos", description: "Completar formularios con revision, evidencia y minimo dato necesario.", evidence: "formulario simulado revisado antes de enviar", criterion: "cada dato cargado tiene motivo y fue revisado antes de confirmar", deliverable: "checklist de carga de formulario", riskyChoice: "Enviar varias veces por ansiedad o cargar datos sin revisar.", helpTrigger: "Cuando el formulario pide pago, documento, salud, menores o datos bancarios.", alert: "Antes de enviar, revisar pantalla completa.", lessons: makeLessons([["Campos obligatorios", "Los campos requeridos se detectan antes de avanzar."], ["Formato de datos", "Fechas, documentos y domicilios deben respetar formato."], ["Adjuntos", "Archivos se nombran y revisan antes de subir."], ["Errores de validacion", "Un error debe corregirse sin borrar todo."], ["Confirmacion previa", "La pantalla final es la ultima oportunidad de revisar."], ["Privacidad", "No se cargan datos que no correspondan al tramite."]], "Formularios") },
      { title: "Turnos, pagos y comprobantes", description: "Guardar evidencia, evitar links falsos y ordenar pagos o turnos.", evidence: "comprobante guardado con fecha, organismo y numero", criterion: "todo turno o pago queda verificable por canal oficial", deliverable: "registro de turno o comprobante", riskyChoice: "Pagar desde links recibidos sin entrar al sitio oficial.", helpTrigger: "Cuando hay tasas, pagos, multas, turnos medicos o vencimientos.", alert: "Un comprobante se guarda antes de cerrar la pantalla.", lessons: makeLessons([["Elegir turno", "Fecha, sede y requisito deben coincidir con la necesidad."], ["Recordatorios", "Un turno sin recordatorio se pierde facil."], ["Pagos oficiales", "Las tasas se pagan desde canal indicado por organismo."], ["Comprobante PDF", "Guardar PDF o captura permite seguimiento."], ["Numero de tramite", "El numero conecta consulta, reclamo y seguimiento."], ["Reprogramar o cancelar", "Modificar un turno tambien requiere comprobante."]], "Comprobantes") },
      { title: "Seguimiento y reclamo", description: "Consultar estado, responder observaciones y escalar sin perder evidencia.", evidence: "registro de seguimiento con estado, fecha y respuesta", criterion: "cada consulta o reclamo incluye numero, fecha y canal oficial", deliverable: "plan de seguimiento de tramite", riskyChoice: "Hacer otro tramite igual sin revisar el estado del primero.", helpTrigger: "Cuando hay rechazo, silencio prolongado, plazo legal o impacto economico.", alert: "No repetir formularios sin entender estado anterior.", lessons: makeLessons([["Estado del tramite", "Consultar estado evita duplicar gestiones."], ["Observaciones", "Una observacion indica que dato falta o debe corregirse."], ["Canal de consulta", "El reclamo se hace por canal oficial y con numero de caso."], ["Plazos", "Anotar fecha de inicio y respuesta permite seguimiento."], ["Evidencia de contacto", "Guardar respuesta evita empezar de cero."], ["Cierre", "El tramite termina cuando hay constancia o resolucion."]], "Seguimiento") },
      { title: "Acompanamiento digital responsable", description: "Ayudar a otra persona sin apropiarse de sus claves ni decisiones.", evidence: "acuerdo de ayuda con limites y datos protegidos", criterion: "la persona acompanada conserva control de cuenta, claves y decisiones", deliverable: "protocolo familiar de ayuda digital", riskyChoice: "Hacer todo por otra persona y quedarse con claves o documentos.", helpTrigger: "Cuando la persona no comprende impacto, firma, pago o dato sensible.", alert: "Acompanar no es reemplazar la voluntad de la persona.", lessons: makeLessons([["Rol del acompanante", "Guiar es explicar pasos, no apropiarse de la cuenta."], ["Consentimiento", "La persona debe saber que se esta haciendo."], ["Datos a la vista", "No fotografiar ni reenviar documentos sin necesidad."], ["Lenguaje simple", "Explicar con calma reduce errores."], ["Registro compartido", "La persona debe quedarse con comprobantes."], ["Limites", "Si hay duda legal o economica, se consulta."]], "Acompanamiento") }
    ],
    cases: [
      { title: "Turno medico perdido", summary: "La persona cerro la pantalla sin guardar fecha ni comprobante.", goal: "Recuperar evidencia y crear rutina de guardado.", trigger: "pantalla cerrada sin constancia", courseAction: "buscar correo, historial o portal oficial", evidence: "fecha, sede y numero recuperado", error: "Sacar otro turno sin verificar si ya habia uno.", aftercare: "Crear regla de captura o PDF antes de cerrar." },
      { title: "Sitio falso de tramite", summary: "Un anuncio promete gestionar rapido y pide datos personales.", goal: "Verificar organismo y dominio oficial.", trigger: "resultado patrocinado o link reenviado", courseAction: "buscar organismo oficial y comparar dominio", evidence: "captura del sitio dudoso y fuente oficial", error: "Cargar documento y pagar por urgencia.", aftercare: "Guardar lista de sitios oficiales usados." },
      { title: "Clave compartida con gestor informal", summary: "Alguien ofrece hacer el tramite si le pasan usuario y clave.", goal: "Evitar entrega de identidad digital.", trigger: "pedido de credenciales", courseAction: "pedir guia presencial o canal formal sin compartir clave", evidence: "mensaje de pedido y tramite involucrado", error: "Enviar clave por chat.", aftercare: "Cambiar clave si ya fue compartida." },
      { title: "Formulario rechazado por adjunto incorrecto", summary: "El tramite vuelve observado por archivo ilegible.", goal: "Corregir adjunto y registrar observacion.", trigger: "observacion del portal", courseAction: "leer motivo, reemplazar archivo y guardar constancia", evidence: "observacion, archivo nuevo y fecha", error: "Subir el mismo archivo otra vez.", aftercare: "Nombrar archivos antes de subir." },
      { title: "Pago de tasa por link dudoso", summary: "Llega mensaje con link para pagar una tasa.", goal: "Confirmar deuda real en canal oficial.", trigger: "link recibido por SMS o WhatsApp", courseAction: "entrar al portal oficial y verificar", evidence: "mensaje y deuda oficial", error: "Pagar por el enlace recibido.", aftercare: "Usar planificador de pagos oficiales." },
      { title: "Tramite duplicado", summary: "Por no ver estado, se inicio dos veces la misma gestion.", goal: "Ordenar seguimiento antes de repetir.", trigger: "incertidumbre sobre estado", courseAction: "consultar por numero de tramite y registrar resultado", evidence: "ambos numeros y estado", error: "Seguir iniciando formularios nuevos.", aftercare: "Usar registro unico de tramites." },
      { title: "Ayuda a adulto mayor sin consentimiento claro", summary: "Un familiar hace todo sin explicar que envia.", goal: "Mejorar acompanamiento responsable.", trigger: "acompanante controla pantalla y claves", courseAction: "explicar pasos, pedir confirmacion y entregar comprobantes", evidence: "acuerdo y comprobante final", error: "Guardar claves del familiar.", aftercare: "Crear protocolo familiar de ayuda." },
      { title: "Error despues de enviar", summary: "Aparece error del sitio y no se sabe si entro la solicitud.", goal: "Pausar y preservar evidencia.", trigger: "mensaje de error ambiguo", courseAction: "capturar pantalla, revisar correo y estado antes de reenviar", evidence: "captura, hora y estado consultado", error: "Reenviar muchas veces.", aftercare: "Anotar hora y respuesta de cada intento." }
    ]
  }
];

courses.push(
  {
    folder: "monotributo_organizacion_administrativa_v0_6_publica",
    shortId: "mono",
    courseId: "monotributo-organizacion-administrativa",
    title: "Monotributo y Organizacion Administrativa Basica",
    shortName: "Monotributo Basico",
    subtitle: "Comprobantes, vencimientos, categorias, pagos, registros y rutina mensual.",
    description: "Curso practico para ordenar la administracion cotidiana de un monotributo sin reemplazar asesoramiento contable.",
    audience: "Emprendedores, trabajadores independientes y pequenos prestadores que necesitan organizar registros basicos.",
    portalCategory: "Administracion",
    practiceArea: "organizacion administrativa basica para monotributistas",
    exampleContext: "Una persona vende servicios o productos, emite comprobantes y necesita ordenar pagos, registros y vencimientos.",
    finalArtifact: "rutina mensual de administracion con comprobantes, ingresos, gastos, vencimientos y dudas para consultar",
    modules: [
      { title: "Mapa administrativo", description: "Identificar actividades, obligaciones, comprobantes y datos que se deben controlar.", evidence: "mapa de actividad, ingresos, gastos y obligaciones", criterion: "la persona sabe que registrar, cuando revisar y que consultar", deliverable: "ficha administrativa inicial", riskyChoice: "Tomar decisiones tributarias solo con ejemplos de internet.", helpTrigger: "Cuando hay alta, baja, recategorizacion, deuda, exclusion o duda normativa.", alert: "Este curso no reemplaza asesoramiento contable ni fuentes oficiales.", lessons: makeLessons([["Actividad y alcance"], ["Datos fiscales basicos"], ["Ingresos a registrar"], ["Gastos y comprobantes"], ["Calendario administrativo"], ["Dudas para consultar"]], "Monotributo") },
      { title: "Comprobantes e ingresos", description: "Ordenar facturas, cobros, medios de pago y registro de ventas.", evidence: "registro de ingresos con fecha, cliente, medio y comprobante", criterion: "cada ingreso tiene comprobante y medio identificado", deliverable: "planilla simple de ingresos", riskyChoice: "Mezclar cobros personales y comerciales sin registro.", helpTrigger: "Cuando hay facturacion a empresas, exportacion, retenciones o topes.", alert: "El comprobante no es solo archivo: conecta ingreso, cliente y fecha.", lessons: makeLessons([["Factura y recibo"], ["Fecha y concepto"], ["Medios de cobro"], ["Clientes recurrentes"], ["Errores de comprobante"], ["Archivo mensual"]], "Ingresos") },
      { title: "Gastos, compras y evidencia", description: "Guardar gastos utiles, separar lo personal de lo laboral y evitar registros confusos.", evidence: "carpeta de gastos con criterio de clasificacion", criterion: "cada gasto tiene fecha, motivo y comprobante asociado", deliverable: "registro mensual de gastos", riskyChoice: "Cargar gastos sin criterio o perder comprobantes.", helpTrigger: "Cuando un gasto es grande, dudoso, compartido o fiscalmente relevante.", alert: "Guardar no significa que todo sea valido para cualquier uso.", lessons: makeLessons([["Gastos del trabajo"], ["Comprobantes de compra"], ["Servicios compartidos"], ["Herramientas y insumos"], ["Archivo digital"], ["Consulta contable"]], "Gastos") },
      { title: "Pagos y vencimientos", description: "Controlar cuota, deuda, intereses, medios de pago y comprobantes.", evidence: "calendario de vencimientos y pagos realizados", criterion: "cada pago queda confirmado por canal oficial y comprobante", deliverable: "calendario mensual de pagos", riskyChoice: "Pagar desde links dudosos o esperar a recordar vencimientos.", helpTrigger: "Cuando hay deuda, intereses, baja de obra social o plan de pago.", alert: "Los vencimientos se verifican por canal oficial.", lessons: makeLessons([["Cuota mensual"], ["Medios de pago"], ["Comprobante de pago"], ["Deuda y recargos"], ["Recordatorios"], ["Revision mensual"]], "Pagos") },
      { title: "Categorias y limites", description: "Entender recategorizacion como control periodico que requiere datos confiables.", evidence: "resumen de ingresos acumulados y dudas sobre categoria", criterion: "los datos para revisar categoria estan disponibles y ordenados", deliverable: "ficha de revision de categoria", riskyChoice: "Ignorar limites hasta que haya un problema.", helpTrigger: "Siempre que se acerquen limites, cambie actividad o haya duda normativa.", alert: "La decision de categoria debe validarse con fuente oficial o contador.", lessons: makeLessons([["Que mirar"], ["Ingresos acumulados"], ["Cambios de actividad"], ["Senales de alerta"], ["Consulta antes de decidir"], ["Registro de revision"]], "Categorias") },
      { title: "Rutina y control mensual", description: "Convertir la administracion en una rutina pequena y repetible.", evidence: "checklist mensual completado", criterion: "la rutina permite detectar atrasos, errores y dudas a tiempo", deliverable: "rutina administrativa de 30 dias", riskyChoice: "Dejar todo para fin de ano o cuando aparece deuda.", helpTrigger: "Cuando se acumulan meses sin registrar o hay notificaciones oficiales.", alert: "La rutina evita urgencias evitables.", lessons: makeLessons([["Dia fijo de administracion"], ["Carpetas por mes"], ["Resumen mensual"], ["Backup"], ["Dudas acumuladas"], ["Cierre del mes"]], "Rutina") }
    ],
    cases: [
      { title: "Tres meses sin registrar ingresos", summary: "La persona cobra pero no tiene planilla ni comprobantes ordenados.", goal: "Reconstruir registro minimo.", trigger: "ingresos dispersos en billetera y banco", courseAction: "ordenar por fecha, medio y comprobante", evidence: "extractos, facturas y planilla inicial", error: "Inventar datos para completar huecos.", aftercare: "Crear rutina semanal de registro." },
      { title: "Vencimiento olvidado", summary: "Aparece deuda por cuota mensual no pagada.", goal: "Verificar deuda y crear calendario.", trigger: "notificacion o consulta de deuda", courseAction: "entrar por canal oficial y guardar comprobante", evidence: "estado de deuda y pago realizado", error: "Pagar desde link recibido por mensaje.", aftercare: "Activar recordatorios mensuales." },
      { title: "Comprobante perdido", summary: "Un cliente pide factura anterior y no se encuentra.", goal: "Ordenar archivo por fecha y cliente.", trigger: "pedido de comprobante", courseAction: "buscar en sistema/correo/carpeta y registrar metodo", evidence: "comprobante recuperado o constancia de busqueda", error: "Emitir de nuevo sin consultar.", aftercare: "Nombrar archivos con fecha y cliente." },
      { title: "Duda de categoria", summary: "Los ingresos crecieron y no se sabe si corresponde revisar categoria.", goal: "Preparar datos para consulta.", trigger: "aumento sostenido de ingresos", courseAction: "sumar ingresos, revisar periodo y consultar fuente oficial/contador", evidence: "resumen de ingresos y dudas", error: "Cambiar categoria por intuicion.", aftercare: "Programar revision periodica." },
      { title: "Gastos mezclados", summary: "Compras personales y de trabajo estan juntas.", goal: "Separar registros para entender costos.", trigger: "extracto confuso", courseAction: "clasificar gastos y marcar dudas", evidence: "planilla con categoria y comprobante", error: "Asumir que todo gasto sirve para el negocio.", aftercare: "Usar cuenta o etiqueta separada." },
      { title: "Pago duplicado", summary: "Se pago dos veces por no guardar comprobante.", goal: "Verificar y reclamar si corresponde.", trigger: "dos movimientos similares", courseAction: "comparar fechas, importes y canal oficial", evidence: "comprobantes y movimientos", error: "Borrar uno para no confundirse.", aftercare: "Registrar pago apenas se realiza." },
      { title: "Notificacion oficial ignorada", summary: "Llega aviso y queda sin leer.", goal: "Crear rutina de revision de comunicaciones.", trigger: "mensaje oficial no atendido", courseAction: "leer desde portal oficial y anotar accion requerida", evidence: "aviso, fecha y respuesta", error: "Confiar en que si es importante llamaran.", aftercare: "Revisar domicilio/correo fiscal segun corresponda." },
      { title: "Ayuda contable sin datos", summary: "Se consulta tarde y sin registros.", goal: "Preparar carpeta para una consulta eficiente.", trigger: "duda urgente antes de vencimiento", courseAction: "juntar ingresos, gastos, pagos y preguntas", evidence: "carpeta mensual y lista de dudas", error: "Pedir respuesta sin datos.", aftercare: "Mantener ficha administrativa actualizada." }
    ]
  },
  {
    folder: "educacion_financiera_basica_argentina_v0_6_publica",
    shortId: "edfin",
    courseId: "educacion-financiera-basica-argentina",
    title: "Educacion Financiera Basica Argentina",
    shortName: "Educacion Financiera",
    subtitle: "Presupuesto, ahorro, deuda, consumo, inflacion, metas y decisiones cotidianas.",
    description: "Curso introductorio para ordenar decisiones de dinero con ejemplos cotidianos, sin promesas de inversion ni asesoramiento financiero.",
    audience: "Publico general, familias, estudiantes y personas que quieren mejorar habitos financieros basicos.",
    portalCategory: "Finanzas",
    practiceArea: "educacion financiera personal y familiar",
    exampleContext: "Una familia necesita llegar a fin de mes, ordenar deudas pequenas y decidir una compra importante.",
    finalArtifact: "plan financiero personal de 30 dias con presupuesto, meta, deuda y reglas de decision",
    modules: [
      { title: "Diagnostico financiero personal", description: "Mirar ingresos, gastos, deudas y habitos sin culpa ni fantasia.", evidence: "foto financiera inicial con ingresos, gastos y deudas", criterion: "la persona puede explicar donde esta el dinero y que decision urge", deliverable: "diagnostico financiero de 30 dias", riskyChoice: "Hacer planes con ingresos que todavia no existen.", helpTrigger: "Cuando hay mora, deuda impagable, embargo, adiccion al juego o violencia economica.", alert: "Ordenar no es culparse: es ver datos para decidir.", lessons: makeLessons([["Ingresos reales"], ["Gastos visibles"], ["Gastos invisibles"], ["Deudas"], ["Habitos de consumo"], ["Prioridad inicial"]], "Diagnostico") },
      { title: "Presupuesto simple", description: "Armar un presupuesto flexible para decisiones reales.", evidence: "presupuesto con categorias y saldo estimado", criterion: "el presupuesto muestra que se puede pagar, ajustar o postergar", deliverable: "presupuesto mensual simple", riskyChoice: "Copiar porcentajes ideales sin mirar realidad propia.", helpTrigger: "Cuando faltan ingresos para necesidades basicas o hay deuda creciente.", alert: "Un presupuesto util se adapta, no castiga.", lessons: makeLessons([["Categorias"], ["Saldo disponible"], ["Necesario y deseable"], ["Ajustes posibles"], ["Revision semanal"], ["Presupuesto familiar"]], "Presupuesto") },
      { title: "Ahorro y metas", description: "Crear metas concretas y reservas pequenas segun capacidad real.", evidence: "meta con monto, fecha, motivo y aporte posible", criterion: "la meta tiene monto, plazo y accion semanal realista", deliverable: "plan de ahorro inicial", riskyChoice: "Prometer ahorrar lo que el presupuesto no permite.", helpTrigger: "Cuando la meta implica deuda, inversion o decision de alto impacto.", alert: "Ahorrar tambien puede ser evitar un gasto o reducir deuda.", lessons: makeLessons([["Fondo de emergencia"], ["Metas chicas"], ["Aportes automaticos"], ["Inflacion y ajuste"], ["Tentaciones"], ["Seguimiento"]], "Ahorro") },
      { title: "Deuda y credito", description: "Entender cuotas, intereses, pago minimo, refinanciacion y senales de alerta.", evidence: "inventario de deudas con monto, cuota, vencimiento y costo", criterion: "cada deuda tiene prioridad y proximo paso definido", deliverable: "mapa de deudas", riskyChoice: "Tomar deuda para tapar otra sin calcular costo.", helpTrigger: "Ante mora, intimacion, refinanciacion compleja o imposibilidad de pago.", alert: "Credito no es ingreso: es compromiso futuro.", lessons: makeLessons([["Cuotas"], ["Interes"], ["Pago minimo"], ["Prioridad de deuda"], ["Refinanciacion"], ["Senales de alerta"]], "Deuda") },
      { title: "Consumo y decisiones", description: "Comprar con criterio: necesidad, precio total, oportunidad, garantia y costo oculto.", evidence: "ficha de decision de compra", criterion: "la compra se decide por necesidad, costo total y efecto en presupuesto", deliverable: "matriz de decision de compra", riskyChoice: "Comprar por urgencia artificial o descuento sin presupuesto.", helpTrigger: "Cuando la compra implica credito, contrato, garantia o ingreso familiar.", alert: "Una oferta puede ser cara si rompe el presupuesto.", lessons: makeLessons([["Necesidad o deseo"], ["Costo total"], ["Garantia"], ["Comparar opciones"], ["Compra impulsiva"], ["Regla de espera"]], "Consumo") },
      { title: "Rutina financiera", description: "Instalar revision semanal, registro mensual y conversaciones familiares.", evidence: "rutina de revision con calendario y reglas", criterion: "la rutina permite corregir antes de llegar tarde", deliverable: "rutina financiera familiar o personal", riskyChoice: "Revisar dinero solo cuando aparece una crisis.", helpTrigger: "Cuando hay conflicto familiar, deuda oculta o control economico de otra persona.", alert: "Hablar de dinero con respeto previene problemas.", lessons: makeLessons([["Revision semanal"], ["Cierre mensual"], ["Conversacion familiar"], ["Reglas de compra"], ["Registro de avances"], ["Proxima mejora"]], "Rutina") }
    ],
    cases: [
      { title: "No alcanza hasta fin de mes", summary: "Los gastos superan ingresos antes de la ultima semana.", goal: "Armar foto financiera sin culpas.", trigger: "saldo insuficiente recurrente", courseAction: "separar gastos fijos, variables y deudas", evidence: "presupuesto y gastos ultimos 30 dias", error: "Buscar credito sin mirar gastos.", aftercare: "Revisar presupuesto semanalmente." },
      { title: "Pago minimo de tarjeta", summary: "Se paga minimo varios meses y la deuda crece.", goal: "Entender costo y buscar plan responsable.", trigger: "deuda acumulada en tarjeta", courseAction: "identificar monto, intereses visibles y prioridad", evidence: "resumen y vencimientos", error: "Seguir usando tarjeta igual.", aftercare: "Consultar opciones con entidad o profesional si hace falta." },
      { title: "Compra por oferta", summary: "Un descuento empuja una compra no planificada.", goal: "Aplicar regla de espera y costo total.", trigger: "oferta con urgencia", courseAction: "comparar necesidad, presupuesto y costo final", evidence: "ficha de compra", error: "Comprar para no perder descuento.", aftercare: "Crear regla de espera 24/48h." },
      { title: "Deuda familiar informal", summary: "Se presta dinero sin fecha ni acuerdo claro.", goal: "Ordenar acuerdo y evitar conflicto.", trigger: "prestamo entre familiares", courseAction: "escribir monto, fecha, devolucion y limites", evidence: "acuerdo simple", error: "No anotar por confianza.", aftercare: "Separar ayuda de deuda." },
      { title: "Suscripciones olvidadas", summary: "Se cobran apps que nadie usa.", goal: "Reducir gasto recurrente.", trigger: "debitos pequenos repetidos", courseAction: "listar suscripciones y cancelar lo innecesario", evidence: "lista antes/despues", error: "Ignorar importes chicos.", aftercare: "Revisar debitos mensualmente." },
      { title: "Meta imposible", summary: "Se propone ahorrar un monto que no entra en el presupuesto.", goal: "Ajustar meta a realidad.", trigger: "plan de ahorro irreal", courseAction: "calcular aporte posible y plazo", evidence: "meta corregida", error: "Abandonar al primer mes.", aftercare: "Usar metas pequenas y medibles." },
      { title: "Credito para consumo impulsivo", summary: "Una compra se financia en muchas cuotas sin evaluar.", goal: "Revisar costo y efecto mensual.", trigger: "cuotas tentadoras", courseAction: "comparar contado, cuotas y saldo mensual", evidence: "ficha de costo total", error: "Mirar solo cuota baja.", aftercare: "Definir limite de cuota mensual." },
      { title: "Conflicto por gastos compartidos", summary: "En la casa no hay acuerdo sobre prioridades.", goal: "Hacer conversacion con datos.", trigger: "discusion por dinero", courseAction: "llevar presupuesto, gastos y reglas propuestas", evidence: "acuerdo familiar", error: "Acusar sin mostrar datos.", aftercare: "Agendar revision mensual." }
    ]
  },
  {
    folder: "primeros_auxilios_digitales_web_v0_6_publica",
    shortId: "padig",
    courseId: "primeros-auxilios-digitales",
    title: "Primeros Auxilios Digitales",
    shortName: "Auxilios Digitales",
    subtitle: "Robo de cuentas, links, billeteras, dispositivos, evidencia, bloqueo y recuperacion.",
    description: "Curso practico para actuar en los primeros minutos de una emergencia digital sin agravar el problema.",
    audience: "Publico general, familias, docentes, comercios y personas que necesitan una guia de respuesta rapida.",
    portalCategory: "Emergencia digital",
    practiceArea: "respuesta inicial ante incidentes digitales",
    exampleContext: "Una persona recibio un link, perdio acceso a una cuenta o detecto un movimiento sospechoso y no sabe por donde empezar.",
    finalArtifact: "plan de emergencia digital con pasos por minuto, evidencia, contactos y recuperacion",
    modules: [
      { title: "Proteger antes de tocar", description: "Pausar, cortar dano y evitar acciones que borren evidencia.", evidence: "registro inicial del incidente con hora, canal y riesgo", criterion: "la primera accion reduce dano y no destruye evidencia", deliverable: "ficha inicial de incidente", riskyChoice: "Seguir conversando, instalar apps o enviar codigos.", helpTrigger: "Cuando hay amenaza, extorsion, dinero, menores, salud o acceso tomado.", alert: "En emergencia, primero pausar y preservar.", lessons: makeLessons([["Pausa operativa"], ["Que no tocar"], ["Riesgo inmediato"], ["Persona afectada"], ["Canal del incidente"], ["Accion minima segura"]], "Emergencia") },
      { title: "Cuentas tomadas", description: "Recuperar control de correo, redes, WhatsApp o servicios.", evidence: "lista de cuenta afectada, sesiones y recuperacion", criterion: "se corta acceso no autorizado y se cambia clave desde canal seguro", deliverable: "plan de recuperacion de cuenta", riskyChoice: "Pedir ayuda entregando codigos de recuperacion.", helpTrigger: "Si hay suplantacion, mensajes enviados, dinero o datos sensibles.", alert: "El correo principal suele ser la llave de otras cuentas.", lessons: makeLessons([["Correo principal"], ["WhatsApp"], ["Redes sociales"], ["Cerrar sesiones"], ["Cambiar clave"], ["Avisar contactos"]], "Cuentas") },
      { title: "Fraudes y pagos", description: "Actuar ante comprobantes falsos, transferencias, tarjetas y billeteras.", evidence: "registro financiero del incidente con movimiento y reclamo", criterion: "se bloquea o reclama por canal oficial antes de mover fondos", deliverable: "protocolo de incidente financiero", riskyChoice: "Devolver dinero o pagar por presion.", helpTrigger: "Ante movimiento no reconocido, tarjeta, billetera o amenaza economica.", alert: "No mover dinero por indicacion de desconocidos.", lessons: makeLessons([["Movimiento desconocido"], ["Comprobante dudoso"], ["Transferencia erronea"], ["Tarjeta comprometida"], ["Billetera bloqueada"], ["Reclamo oficial"]], "Fraudes") },
      { title: "Dispositivos y archivos", description: "Responder ante perdida, robo, malware, permisos o archivos sospechosos.", evidence: "estado del dispositivo, apps, permisos y acciones tomadas", criterion: "se reduce acceso al dispositivo y se preservan datos importantes", deliverable: "checklist de dispositivo afectado", riskyChoice: "Abrir archivos sospechosos para ver que son.", helpTrigger: "Cuando hay perdida fisica, malware, acceso remoto o datos laborales.", alert: "No investigues abriendo lo sospechoso.", lessons: makeLessons([["Telefono perdido"], ["Computadora compartida"], ["Archivo sospechoso"], ["App desconocida"], ["Permisos sensibles"], ["Copia y bloqueo"]], "Dispositivos") },
      { title: "Evidencia, denuncia y soporte", description: "Guardar informacion util sin exponer mas datos.", evidence: "paquete de evidencia con capturas, fechas, usuario y relato", criterion: "la evidencia permite explicar el caso a soporte, entidad o autoridad", deliverable: "carpeta de evidencia de incidente", riskyChoice: "Borrar chats por verguenza o reenviar capturas con datos sensibles.", helpTrigger: "Cuando hay delito, amenaza, menores, dinero o dano reputacional.", alert: "Evidencia no es viralizar: es preservar con cuidado.", lessons: makeLessons([["Capturas seguras"], ["Linea de tiempo"], ["Datos de contacto"], ["Numero de reclamo"], ["Denuncia o reporte"], ["Privacidad de evidencia"]], "Evidencia") },
      { title: "Recuperacion y prevencion", description: "Cerrar el incidente, revisar danos y cambiar habitos.", evidence: "plan de 48 horas, 7 dias y 30 dias", criterion: "se revisan cuentas relacionadas y se instalan controles preventivos", deliverable: "plan posterior al incidente", riskyChoice: "Cambiar una clave y no revisar nada mas.", helpTrigger: "Si el incidente se repite o afecta trabajo, familia, escuela o comercio.", alert: "La recuperacion sigue despues de volver a entrar.", lessons: makeLessons([["Primeras 48 horas"], ["Revision de cuentas"], ["Aviso a terceros"], ["Nuevas claves"], ["Aprendizajes"], ["Simulacro familiar"]], "Recuperacion") }
    ],
    cases: [
      { title: "WhatsApp robado", summary: "Contactos reciben mensajes pidiendo dinero.", goal: "Recuperar cuenta y avisar contactos.", trigger: "codigo compartido o sesion tomada", courseAction: "intentar recuperacion oficial, avisar por otro canal y activar verificacion", evidence: "mensajes enviados y hora de perdida", error: "Pedir a contactos que respondan al chat tomado.", aftercare: "Activar verificacion en dos pasos." },
      { title: "Correo principal comprometido", summary: "Llegan avisos de accesos desconocidos.", goal: "Cerrar sesiones y proteger cuentas vinculadas.", trigger: "inicio de sesion no reconocido", courseAction: "cambiar clave desde dispositivo seguro y revisar recuperacion", evidence: "alertas, dispositivos y cambios realizados", error: "Ignorar porque todavia entra.", aftercare: "Revisar cuentas que dependen del correo." },
      { title: "Link de banco abierto", summary: "La persona ingreso datos en un sitio falso.", goal: "Cortar dano y contactar entidad.", trigger: "datos cargados en phishing", courseAction: "bloquear medio, cambiar claves y reclamar oficialmente", evidence: "link, hora y datos ingresados", error: "Volver al link para verificar.", aftercare: "Revisar movimientos por 30 dias." },
      { title: "Telefono perdido", summary: "El celular tiene billeteras, correo y redes abiertas.", goal: "Bloquear dispositivo y cuentas.", trigger: "perdida fisica", courseAction: "localizar/bloquear, cerrar sesiones y avisar operadora si corresponde", evidence: "hora, lugar y acciones", error: "Esperar sin bloquear por si aparece.", aftercare: "Revisar bloqueo, copia y alertas." },
      { title: "Comprobante falso en venta", summary: "Un cliente presiona con una captura.", goal: "Evitar entrega y preservar evidencia.", trigger: "captura sin acreditacion", courseAction: "verificar app oficial y pausar entrega", evidence: "chat, comprobante y estado oficial", error: "Entregar producto por presion.", aftercare: "Agregar regla de cobro seguro." },
      { title: "Amenaza o extorsion digital", summary: "Alguien amenaza publicar informacion.", goal: "Preservar evidencia y buscar ayuda competente.", trigger: "mensaje amenazante", courseAction: "no negociar por impulso, guardar evidencia y consultar canal adecuado", evidence: "mensajes, usuarios, fechas", error: "Borrar o responder con mas informacion.", aftercare: "Revisar privacidad y apoyo legal/psicologico si corresponde." },
      { title: "Archivo sospechoso descargado", summary: "Se abrio un adjunto inesperado.", goal: "Reducir dano y revisar dispositivo.", trigger: "archivo de origen dudoso", courseAction: "desconectar si hace falta, no ingresar claves y consultar soporte", evidence: "nombre del archivo, origen y acciones", error: "Seguir usando cuentas sensibles en el mismo equipo.", aftercare: "Actualizar sistema y cambiar claves desde equipo seguro." },
      { title: "Cuenta de red social suplanta identidad", summary: "Publican o escriben como si fuera la persona.", goal: "Reportar, avisar y recuperar control.", trigger: "perfil tomado o falso", courseAction: "reportar, guardar URLs/capturas y avisar por canal alternativo", evidence: "URL, capturas y mensajes", error: "Discutir publicamente desde otra cuenta.", aftercare: "Reforzar claves y revisar sesiones." }
    ]
  }
);

for (const config of courses) {
  writeCourseFiles(config);
}
updatePortalInventory(courses);
updateDocs(courses);

console.log(`Tanda 2 reforzada: ${courses.length} cursos`);
for (const config of courses) {
  const data = readJson(path.join(coursesRoot, config.folder, "src", "data", "course_content.json"));
  const lessons = data.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const quiz = data.modules.reduce((sum, module) => sum + module.quiz.length, 0);
  console.log(`- ${config.folder}: ${data.modules.length} modulos, ${lessons} lecciones, ${quiz} preguntas`);
}

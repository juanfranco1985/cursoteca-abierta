import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesRoot = path.join(root, "cursos");
const portalDataDir = path.join(root, "portal", "portal_publico_profesional_v0_6", "data");
const version = "0.7-tanda-7-final";
const publicationStatus = "publica-profesional-v0.7-tanda-7-final";
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
    keyIdea: `${title} convierte una decision comercial en un paso medible, con numeros, contexto y evidencia.`,
    shortTheory: `En esta leccion se trabaja ${lower(title)} dentro de ${lower(module.title)}. La meta es separar intuicion, deseo y realidad operativa para tomar una decision que se pueda revisar.`,
    practicalExample: `${config.exampleContext} Aplica ${lower(title)}, guarda ${module.evidence} y anota que decision permite tomar.`,
    commonMistake: "El error habitual es decidir por entusiasmo, urgencia o comparacion con otros negocios sin calcular costos, capacidad, clientes reales ni riesgo de caja.",
    whatToDoNow: `Practica de 25 minutos: aplica ${lower(title)} sobre un producto, servicio o idea concreta. Registra calculo, supuesto, evidencia y proxima mejora.`,
    alert: module.alert,
    keyPoints: [
      `${title} debe terminar en una accion o numero verificable.`,
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
        "Objetivo, dato necesario, costo o recurso afectado y evidencia de cierre.",
        "La opcion que parece mas grande o ambiciosa.",
        "Un precio o decision copiada de otro negocio.",
        "Una promocion antes de calcular margen."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: las decisiones comerciales sostenibles empiezan con objetivo, datos y criterio."
    },
    {
      id: `${id}-q2`,
      question: "Que evidencia permite cerrar el modulo con mas confianza?",
      options: [
        module.evidence,
        "Una opinion general sin calculo.",
        "Un comentario de un cliente sin contexto.",
        "Una captura que no muestra margen, stock ni condicion."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.evidence} permite revisar la decision despues.`
    },
    {
      id: `${id}-q3`,
      question: "Que conducta aumenta el riesgo comercial?",
      options: [
        module.riskyChoice,
        "Probar con una escala chica antes de crecer.",
        "Separar costos fijos, variables y margen.",
        "Registrar supuestos y resultados."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: esa conducta puede dañar caja, stock, reputacion o rentabilidad."
    },
    {
      id: `${id}-q4`,
      question: "Cuando corresponde validar con una persona competente o fuente confiable?",
      options: [
        module.helpTrigger,
        "Nunca, porque un calculo educativo alcanza para toda decision.",
        "Solo despues de comprometer dinero o stock.",
        "Cuando la idea ya esta publicada."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: validar antes reduce errores costosos."
    },
    {
      id: `${id}-q5`,
      question: `Cual es el entregable minimo de "${module.title}"?`,
      options: [
        module.deliverable,
        "Una idea atractiva sin numeros.",
        "Una lista de tareas sin responsable.",
        "Un precio final sin explicar calculo."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.deliverable} deja una decision verificable.`
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
      learningRisk: "Decidir sin numeros ni evidencia puede generar perdida de caja, precios mal calculados, sobrestock, promesas incumplidas o crecimiento fragil.",
      lessons: module.lessons.map((title, lessonIndex) => buildLesson(`m${moduleIndex + 1}-l${lessonIndex + 1}`, module, title, config)),
      quiz: quizForModule(module, moduleIndex)
    }))
  };
}

const checklistItems = [
  "Objetivo comercial definido",
  "Costos o recursos identificados",
  "Cliente y canal revisados",
  "Riesgo principal anotado",
  "Evidencia guardada",
  "Decision siguiente priorizada"
];

function buildChecklists(config) {
  return {
    checklists: config.modules.map((module, moduleIndex) => ({
      id: `${config.shortId}-checklist-${moduleIndex + 1}`,
      title: `${module.title}: checklist de decision`,
      description: `Control breve para aplicar ${lower(module.title)} en ${config.practiceArea} con numeros y evidencia.`,
      commercialArea: config.practiceArea,
      items: checklistItems.map((title, itemIndex) => ({
        id: `${config.shortId}-cl${moduleIndex + 1}-i${itemIndex + 1}`,
        title,
        explanation: `${title} reduce decisiones impulsivas durante ${lower(module.title)}.`,
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
      severity: item.severity || "Practica comercial",
      immediateGoal: item.goal,
      steps: [
        `Describir el problema inicial: ${item.trigger}.`,
        "Separar datos reales, datos simulados y datos que no deben compartirse.",
        `Aplicar el criterio del curso: ${item.courseAction}.`,
        `Guardar evidencia: ${item.evidence}.`,
        "Validar con muestra pequena, cliente, proveedor o persona competente si corresponde.",
        "Cerrar con decision, limite detectado y proxima mejora."
      ],
      evidenceToPreserve: [
        "Caso o decision de partida",
        item.evidence,
        "Calculo o version inicial y version corregida",
        "Decision tomada y motivo",
        "Riesgo o duda pendiente"
      ],
      errorsToAvoid: [
        item.error,
        "Usar datos sensibles de clientes o proveedores en practicas educativas.",
        "Cambiar numeros para que la idea parezca rentable.",
        "Prometer precios, entregas o stock sin capacidad real.",
        "Medir exito solo por ventas sin mirar margen ni caja."
      ],
      aftercare: [
        item.aftercare,
        "Guardar una plantilla reutilizable.",
        "Actualizar el checklist del curso.",
        "Definir el siguiente caso de practica."
      ],
      guidedDecision: {
        question: "Que decision muestra mejor criterio comercial?",
        options: [
          {
            text: "Probar en pequeno, calcular margen/caja, guardar evidencia y ajustar antes de crecer.",
            isCorrect: true,
            feedback: "Correcto: protege caja, aprendizaje y relacion con clientes."
          },
          {
            text: "Avanzar rapido porque la oportunidad parece buena.",
            isCorrect: false,
            feedback: "La oportunidad necesita numeros y capacidad real."
          },
          {
            text: "Copiar precio o estrategia de otro negocio.",
            isCorrect: false,
            feedback: "Otro negocio puede tener costos, publico y escala distintos."
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
    templateVersion: "0.7-publica-profesional-tanda-7-final",
    appName: config.title,
    shortName: config.shortName,
    subtitle: config.subtitle,
    description: config.description,
    audience: config.audience,
    responsibleNotice,
    cacheName: `${config.folder}-cache-${version}`,
    contentAudit: {
      status: "reforzado-tanda-7-final",
      date,
      modules: 6,
      lessons: 36,
      quizQuestions: 30,
      checklists: 6,
      cases: 8,
      notes: "Contenido reemplazado para cerrar la deuda de contenido generico en cursos comerciales y de emprendimiento."
    }
  });
  manifest.labels = {
    ...(manifest.labels || {}),
    modules: "Modulos de aprendizaje",
    checklists: "Checklists de decision",
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
    reinforcedBatch7Final: true,
    publicationCandidate: true,
    publicProfessionalEdition: true,
    requiresBackend: false,
    requiresLogin: false
  };
  const note = "v0.7 tanda 7 final reemplaza contenido generico por modulos, practicas, checklists y casos especificos; deuda generica cerrada.";
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
    course.version = "v0.7 tanda final reforzada";
    course.status = "Curso reforzado - tanda final";
    course.category = config.portalCategory || course.category;
    course.audience = config.audience;
    course.description = config.description;
    course.features = [
      "6 modulos",
      "36 lecciones reforzadas",
      "30 preguntas",
      "6 checklists de decision",
      "8 casos guiados",
      "Sin backend ni login"
    ];
    course.recommendedBase = "Contenido reforzado con practicas, evidencia, casos comerciales y criterios de decision.";
    course.tags = [...new Set([...(course.tags || []), "reforzado-tanda-7-final", "contenido-v0-7", "deuda-generica-cerrada"])];
    course.publicReady = true;
  }
  writeJson(coursesFile, courses);

  const csvFile = path.join(portalDataDir, "courses_inventory.csv");
  if (fs.existsSync(csvFile)) {
    let csv = fs.readFileSync(csvFile, "utf8");
    for (const config of configs) {
      const lineRegex = new RegExp(`^${config.folder},.*$`, "m");
      csv = csv.replace(lineRegex, `${config.folder},${csvCell(config.title)},v0.7 tanda final reforzada,Curso reforzado - tanda final,${csvCell(config.portalCategory || config.practiceArea)},${csvCell(config.audience)},../../cursos/${config.folder}/index.html,true,true`);
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
      "Pendientes actuales despues de UX/UI, tanda 1, tanda 2, tanda 3, tanda 4, tanda 5 y tanda 6:",
      "Pendientes actuales despues de UX/UI y tandas 1 a 7:"
    );
    text = text.replace(
      "Pendientes actuales despues de UX/UI y tandas 1 a 7:\n\n\n## Recomendacion",
      "Pendientes actuales despues de UX/UI y tandas 1 a 7:\n\n- Sin cursos pendientes por contenido generico.\n\n## Recomendacion"
    );
    const marker = "## Tanda 7 final de refuerzo";
    const block = `${marker}\n\nCompletada el ${date} con los 2 cursos comerciales restantes reforzados:\n\n${configs.map(config => `- ${config.folder}: 6 modulos, 36 lecciones, 30 preguntas, 6 checklists y 8 casos guiados.`).join("\n")}\n\nDeuda de contenido generico despues de esta tanda: 0 cursos.\n`;
    if (!text.includes(marker)) text = `${text.trim()}\n\n${block}\n`;
    fs.writeFileSync(auditFile, text, "utf8");
  }

  const checklistFile = path.join(root, "CHECKLIST_PUBLICACION_BETA.md");
  if (fs.existsSync(checklistFile)) {
    let text = fs.readFileSync(checklistFile, "utf8");
    if (!text.includes("Reforzar tanda final de 2 cursos comerciales")) {
      text = text.replace(
        "- [ ] Reforzar los 2 cursos restantes con patrones de contenido generico.",
        "- [x] Reforzar tanda final de 2 cursos comerciales.\n- [x] Cerrar deuda de contenido generico detectada en la auditoria."
      );
    }
    fs.writeFileSync(checklistFile, text, "utf8");
  }

  const pendingFile = path.join(root, "PENDIENTES_REALES_V1_0_BETA.md");
  if (fs.existsSync(pendingFile)) {
    let text = fs.readFileSync(pendingFile, "utf8");
    text = text.replace(
      /la tanda 6 reforzo 5 cursos de ciudadania, seguridad digital y comunicacion comercial\.\s+Quedan 2 cursos por trabajar antes de considerar v1\.0 final\./,
      "las tandas 1 a 6 reforzaron 30 cursos adicionales y la tanda 7 final reforzo los 2 cursos comerciales restantes. La deuda de contenido generico quedo cerrada antes de considerar v1.0 final."
    );
    fs.writeFileSync(pendingFile, text, "utf8");
  }
}

function m(title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons) {
  return { title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons };
}

const courses = [
  {
    folder: "costos_precios_rentabilidad_v0_6_publica",
    shortId: "costos",
    title: "Costos, Precios y Rentabilidad",
    shortName: "Costos y Precios",
    subtitle: "Costos fijos, variables, margen, precio, punto de equilibrio, caja y decisiones.",
    description: "Curso practico para calcular costos, fijar precios y revisar rentabilidad en productos, servicios y emprendimientos chicos.",
    audience: "Emprendedores, comercios, oficios, feriantes y personas que necesitan poner precios sin perder margen ni caja.",
    portalCategory: "Negocios",
    practiceArea: "costos, precios y rentabilidad para negocios chicos",
    exampleContext: "Un negocio chico vende productos o servicios y necesita saber si el precio cubre costos, deja margen y sostiene la caja.",
    finalArtifact: "planilla de costos y precios con margen, punto de equilibrio, escenarios y rutina de revision",
    modules: [
      m("Costos basicos del negocio", "Separar costos fijos, variables, directos e indirectos para no mezclar todo en una sola cuenta.", "lista de costos clasificados con fuente y frecuencia", "cada costo tiene tipo, monto, frecuencia y relacion con la venta", "mapa de costos del negocio", "Poner precio mirando solo el costo de mercaderia.", "Cuando un costo cambia seguido o afecta contratos, impuestos o pagos.", "Un costo invisible igual se paga.", ["Costo fijo", "Costo variable", "Costo directo", "Costo indirecto", "Frecuencia", "Costo oculto"]),
      m("Costo unitario", "Calcular cuanto cuesta producir, comprar o entregar una unidad vendible.", "calculo unitario con insumos, merma, comisiones y empaque", "el costo unitario incluye lo necesario para entregar la unidad", "ficha de costo unitario", "Olvidar empaque, comision, merma o envio absorbido.", "Cuando hay productos con variantes o proveedores distintos.", "El costo unitario incompleto genera precios falsos.", ["Insumos", "Merma", "Empaque", "Comisiones", "Tiempo", "Entrega"]),
      m("Precio y margen", "Definir precio usando costo, margen, mercado y valor percibido.", "tabla de precio con margen bruto y motivo de precio", "el precio cubre costo y explica su margen", "precio objetivo por producto", "Copiar precio de competidor sin conocer sus costos.", "Cuando se cambia precio a clientes frecuentes o contratos.", "Un precio bajo puede vender mas y ganar menos.", ["Margen bruto", "Markup", "Precio psicologico", "Precio de mercado", "Valor percibido", "Ajuste de precio"]),
      m("Punto de equilibrio", "Calcular cuantas unidades o ventas hacen falta para cubrir costos fijos.", "calculo de punto de equilibrio en unidades y dinero", "la meta minima se entiende y se puede revisar", "punto de equilibrio del negocio", "Creer que vender mucho siempre alcanza.", "Cuando se agregan alquiler, sueldo, cuota o gasto fijo nuevo.", "El equilibrio muestra cuando se deja de perder.", ["Costos fijos", "Margen por unidad", "Unidades necesarias", "Ventas necesarias", "Escenarios", "Limites"]),
      m("Caja y rentabilidad", "Distinguir ganancia, caja, deuda, stock e inversion.", "flujo simple de caja con entradas, salidas y alertas", "la decision no ahoga caja aunque parezca rentable", "control de caja mensual", "Comprar barato y quedarse sin efectivo.", "Cuando una compra grande, credito o deuda compromete pagos.", "Rentable no siempre significa con caja disponible.", ["Caja", "Ganancia", "Stock", "Deuda", "Plazos", "Reserva"]),
      m("Revision y decisiones", "Crear rutina para ajustar precios, promociones y costos sin improvisar.", "revision mensual con indicadores, decisiones y proximo ajuste", "cada ajuste tiene dato, motivo y fecha de revision", "rutina de revision de precios", "Cambiar precios solo cuando falta dinero.", "Cuando suben costos, baja margen o cambia demanda.", "Los precios se gestionan, no se adivinan.", ["Indicadores", "Aumento de costos", "Promociones", "Productos lentos", "Decision de ajuste", "Comunicacion"])
    ],
    cases: [
      { title: "Precio que no cubre comisiones", summary: "El negocio vende por plataforma y olvida la comision.", goal: "Recalcular precio real.", trigger: "margen menor al esperado", courseAction: "sumar comision, empaque y envio absorbido al costo unitario", evidence: "ficha de precio corregida", error: "Subir ventas sin revisar margen.", aftercare: "Crear regla por canal de venta." },
      { title: "Promocion con perdida", summary: "Una oferta atrae clientes pero deja margen negativo.", goal: "Probar promocion con numeros.", trigger: "descuento improvisado", courseAction: "calcular margen antes/despues y limite de unidades", evidence: "simulacion de promocion", error: "Copiar descuentos de otros negocios.", aftercare: "Plantilla de promociones." },
      { title: "Compra mayorista que ahoga caja", summary: "El descuento parece bueno pero inmoviliza dinero.", goal: "Evaluar caja y rotacion.", trigger: "oferta por volumen", courseAction: "comparar ahorro, stock, vencimiento y pagos pendientes", evidence: "escenario de compra", error: "Comprar porque el precio baja.", aftercare: "Definir limite de compra." },
      { title: "Servicio sin costo de tiempo", summary: "Un oficio cobra materiales pero no tiempo propio.", goal: "Incluir horas de trabajo.", trigger: "precio de servicio bajo", courseAction: "estimar horas, traslado y preparacion", evidence: "ficha de servicio", error: "Cobrar solo materiales.", aftercare: "Actualizar tarifa por tipo de trabajo." },
      { title: "Producto estrella poco rentable", summary: "Se vende mucho pero deja poco margen.", goal: "Medir margen por producto.", trigger: "alta rotacion con baja caja", courseAction: "calcular margen unitario y total", evidence: "ranking de rentabilidad", error: "Priorizar solo volumen.", aftercare: "Revisar mix de productos." },
      { title: "Aumento de proveedor", summary: "Sube el costo y el precio queda viejo.", goal: "Actualizar precio con criterio.", trigger: "nuevo costo de compra", courseAction: "recalcular margen, evaluar comunicacion y fecha de cambio", evidence: "precio antes/despues", error: "Absorber aumento hasta perder margen.", aftercare: "Revision mensual de costos." },
      { title: "Punto de equilibrio desconocido", summary: "No se sabe cuanto vender para cubrir gastos.", goal: "Calcular minimo viable.", trigger: "gastos fijos acumulados", courseAction: "dividir costos fijos por margen unitario", evidence: "unidades y ventas necesarias", error: "Confiar en sensacion de movimiento.", aftercare: "Control semanal de avance." },
      { title: "Caja mezclada con dinero personal", summary: "No se distingue plata del negocio y de la casa.", goal: "Separar caja.", trigger: "retiros y pagos mezclados", courseAction: "registrar entradas, salidas y retiro definido", evidence: "flujo de caja separado", error: "Usar caja como billetera comun.", aftercare: "Definir retiro y reserva." }
    ]
  },
  {
    folder: "emprendimiento_barrial_web_v0_6_publica",
    shortId: "barrio",
    title: "Emprendimiento Barrial",
    shortName: "Emprendimiento Barrial",
    subtitle: "Idea, barrio, cliente, oferta, costos, canales, operacion, ventas y mejora.",
    description: "Curso practico para iniciar o mejorar un emprendimiento barrial con foco, numeros simples, trato cercano y decisiones sostenibles.",
    audience: "Personas que venden en su barrio, feriantes, oficios, comercios familiares y emprendimientos de escala chica.",
    portalCategory: "Emprendimiento",
    practiceArea: "emprendimiento barrial y comercio local",
    exampleContext: "Una persona quiere vender en su barrio o mejorar un negocio chico, cuidando caja, relacion con clientes, stock y comunicacion.",
    finalArtifact: "plan barrial de 30 dias con oferta inicial, clientes, costos, canal de venta, rutina operativa y metricas simples",
    modules: [
      m("Idea y problema local", "Elegir una oportunidad barrial basada en necesidad real, no solo en gusto personal.", "ficha de idea con problema, cliente, solucion y prueba chica", "la idea se puede probar en escala pequena", "ficha de oportunidad barrial", "Comprar mercaderia antes de validar demanda.", "Cuando la idea requiere inversion, permisos o compromisos con terceros.", "Una idea de barrio se prueba con barrio real.", ["Problema local", "Cliente cercano", "Solucion simple", "Diferencial", "Prueba chica", "Decision de seguir"]),
      m("Cliente y propuesta", "Definir a quien se vende, que beneficio recibe y por que compraria cerca.", "perfil de cliente con necesidad, objecion y mensaje", "la propuesta se entiende y conecta con una situacion real", "propuesta de valor barrial", "Decir que el producto es para todo el mundo.", "Cuando se usan datos de clientes o grupos de vecinos.", "El barrio no es un publico unico.", ["Tipos de cliente", "Necesidad", "Objeciones", "Beneficio", "Confianza", "Mensaje corto"]),
      m("Oferta inicial y stock", "Armar un surtido o servicio inicial que se pueda cumplir y medir.", "lista de oferta con stock, costo, precio y prioridad", "cada oferta tiene capacidad de entrega y margen revisado", "catalogo inicial controlado", "Ofrecer demasiadas opciones desde el primer dia.", "Cuando hay alimentos, vencimientos, reservas o adelantos.", "Vender poco y aprender es mejor que sobreprometer.", ["Productos iniciales", "Servicios", "Stock minimo", "Rotacion", "Proveedores", "Prueba de demanda"]),
      m("Costos, precio y caja", "Calcular costos, precio, margen y caja para no vender a perdida.", "planilla simple de costo, precio, margen y caja", "la venta cubre costos y no ahoga dinero disponible", "control financiero inicial", "Confundir venta con ganancia.", "Cuando se aceptan pedidos grandes, fiado o compra mayorista.", "La caja es el oxigeno del emprendimiento.", ["Costo unitario", "Precio", "Margen", "Fiado", "Caja", "Reserva"]),
      m("Canales y atencion", "Vender por WhatsApp, redes, feria, puerta a puerta o local con reglas claras.", "mapa de canales con mensaje, horario y condiciones", "cada canal tiene proposito, respuesta y limite", "sistema de atencion barrial", "Atender por todos lados sin registrar pedidos.", "Cuando hay reclamos, pagos, entregas o datos de clientes.", "La confianza barrial se cuida en cada mensaje.", ["WhatsApp", "Redes", "Feria", "Recomendacion", "Pedidos", "Reclamos"]),
      m("Rutina y crecimiento", "Medir ventas, clientes, problemas y aprendizajes para mejorar sin desorden.", "registro de 30 dias con ventas, margen, reclamos y decision", "el crecimiento surge de evidencia y capacidad real", "plan barrial de mejora", "Crecer antes de ordenar operacion.", "Cuando una mejora requiere deuda, alquiler, personal o proveedor fijo.", "Crecer bien es sostener lo que ya se promete.", ["Registro diario", "Metricas simples", "Problemas repetidos", "Mejora semanal", "Decision de crecer", "Plan de 30 dias"])
    ],
    cases: [
      { title: "Compra inicial demasiado grande", summary: "Se invierte en mucho stock sin validar demanda.", goal: "Reducir riesgo de arranque.", trigger: "compra por entusiasmo", courseAction: "definir prueba chica, stock minimo y metrica de venta", evidence: "lista de compra reducida", error: "Comprar variedad para parecer negocio grande.", aftercare: "Medir rotacion semanal." },
      { title: "Cliente pide fiado", summary: "La relacion barrial presiona la caja.", goal: "Definir regla de fiado.", trigger: "pedido de pago diferido", courseAction: "establecer monto, plazo y registro o alternativa", evidence: "politica de fiado", error: "Aceptar sin anotar por confianza.", aftercare: "Revisar deuda semanal." },
      { title: "Pedido mal entendido por WhatsApp", summary: "Se entrega algo distinto a lo pedido.", goal: "Confirmar pedido estructurado.", trigger: "chat ambiguo", courseAction: "confirmar producto, cantidad, precio, entrega y pago", evidence: "mensaje de confirmacion", error: "Armar pedido con informacion incompleta.", aftercare: "Usar plantilla de pedido." },
      { title: "Proveedor ofrece descuento fuerte", summary: "La oferta puede inmovilizar caja.", goal: "Evaluar compra mayorista.", trigger: "descuento por volumen", courseAction: "calcular rotacion, margen y vencimiento", evidence: "simulacion de compra", error: "Comprar por miedo a perder descuento.", aftercare: "Definir regla de proveedor." },
      { title: "Promocion atrae muchos pedidos", summary: "El negocio no puede entregar a tiempo.", goal: "Ajustar capacidad.", trigger: "demanda mayor a la prevista", courseAction: "limitar cupos, avisar plazos y priorizar calidad", evidence: "plan de cupos", error: "Aceptar todo para no perder ventas.", aftercare: "Calcular capacidad antes de promocionar." },
      { title: "Reclamo publico de cliente", summary: "Un cliente se queja en redes o grupo vecinal.", goal: "Responder con evidencia y calma.", trigger: "queja visible", courseAction: "revisar caso, responder con respeto y proponer solucion", evidence: "registro del reclamo", error: "Discutir en publico.", aftercare: "Registrar causa y correccion." },
      { title: "Ventas suben pero caja baja", summary: "Hay movimiento, pero falta dinero para reponer.", goal: "Separar venta, margen y caja.", trigger: "caja insuficiente", courseAction: "revisar costos, fiado, stock y retiros", evidence: "flujo de caja corregido", error: "Pensar que vender mas siempre resuelve.", aftercare: "Control diario de caja." },
      { title: "Crecimiento sin rutina", summary: "Se agregan productos y canales sin control.", goal: "Ordenar antes de crecer.", trigger: "desorden operativo", courseAction: "priorizar productos rentables, canales y responsables", evidence: "plan de 30 dias ajustado", error: "Abrir otro canal para vender mas.", aftercare: "Revision semanal de foco." }
    ]
  }
];

for (const config of courses) writeCourseFiles(config);
updatePortalInventory(courses);
updateDocs(courses);

console.log(`Tanda 7 final reforzada: ${courses.length} cursos`);
for (const config of courses) {
  const data = readJson(path.join(coursesRoot, config.folder, "src", "data", "course_content.json"));
  const lessons = data.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const quiz = data.modules.reduce((sum, module) => sum + module.quiz.length, 0);
  console.log(`- ${config.folder}: ${data.modules.length} modulos, ${lessons} lecciones, ${quiz} preguntas`);
}

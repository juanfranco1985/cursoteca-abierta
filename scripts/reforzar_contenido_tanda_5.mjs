import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesRoot = path.join(root, "cursos");
const portalDataDir = path.join(root, "portal", "portal_publico_profesional_v0_6", "data");
const version = "0.7-tanda-5";
const publicationStatus = "publica-profesional-v0.7-tanda-5";
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
    keyIdea: `${title} ayuda a que el dato, indicador o mensaje sea revisable y no dependa de intuicion.`,
    shortTheory: `En esta leccion se trabaja ${lower(title)} dentro de ${lower(module.title)}. La meta es pasar de una idea general a un criterio de trabajo que se pueda comprobar con evidencia.`,
    practicalExample: `${config.exampleContext} Aplica ${lower(title)}, guarda ${module.evidence} y anota que decision permite tomar.`,
    commonMistake: `El error habitual es avanzar con datos o graficos que parecen correctos sin revisar origen, definicion, calidad, contexto ni consecuencia de uso.`,
    whatToDoNow: `Practica de 25 minutos: aplica ${lower(title)} sobre una muestra pequena, compara resultado esperado contra resultado obtenido y registra limite, evidencia y proxima mejora.`,
    alert: module.alert,
    keyPoints: [
      `${title} debe terminar en una salida observable, no solo en una definicion.`,
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
        "Pregunta, dato necesario, fuente, criterio de calidad y evidencia de cierre.",
        "El grafico mas vistoso.",
        "Una conclusion antes de revisar datos.",
        "La herramienta que ya esta abierta."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: datos utiles empiezan con pregunta, fuente y criterio verificable."
    },
    {
      id: `${id}-q2`,
      question: "Que evidencia permite cerrar el modulo con mas confianza?",
      options: [
        module.evidence,
        "Una captura sin explicar filtros ni fuente.",
        "Una frase como 'parece estar bien'.",
        "Un numero aislado sin periodo ni definicion."
      ],
      correctAnswerIndex: 0,
      feedback: `Correcto: ${module.evidence} permite revisar el resultado despues.`
    },
    {
      id: `${id}-q3`,
      question: "Que conducta aumenta el riesgo de una mala decision con datos?",
      options: [
        module.riskyChoice,
        "Validar una muestra antes de generalizar.",
        "Documentar supuestos y limites.",
        "Separar dato, interpretacion y recomendacion."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: esa conducta oculta errores y puede llevar a decisiones equivocadas."
    },
    {
      id: `${id}-q4`,
      question: "Cuando corresponde pedir validacion externa o revisar una fuente confiable?",
      options: [
        module.helpTrigger,
        "Nunca, porque un ejercicio introductorio reemplaza cualquier revision.",
        "Solo despues de publicar el informe.",
        "Cuando el grafico usa muchos colores."
      ],
      correctAnswerIndex: 0,
      feedback: "Correcto: algunos datos requieren fuente oficial, responsable del dato o una persona competente."
    },
    {
      id: `${id}-q5`,
      question: `Cual es el entregable minimo de "${module.title}"?`,
      options: [
        module.deliverable,
        "Una tabla sin fuente ni fecha.",
        "Un grafico sin lectura principal.",
        "Un archivo final sin criterios de calidad."
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
      learningRisk: "Trabajar con datos sin evidencia puede producir confianza falsa, decisiones pobres o exposicion de informacion sensible.",
      lessons: module.lessons.map((title, lessonIndex) => buildLesson(`m${moduleIndex + 1}-l${lessonIndex + 1}`, module, title, config)),
      quiz: quizForModule(module, moduleIndex)
    }))
  };
}

const checklistItems = [
  "Pregunta y decision definidas",
  "Fuente y fecha registradas",
  "Calidad minima revisada",
  "Supuestos y limites escritos",
  "Resultado probado con muestra",
  "Accion siguiente priorizada"
];

function buildChecklists(config) {
  return {
    checklists: config.modules.map((module, moduleIndex) => ({
      id: `${config.shortId}-checklist-${moduleIndex + 1}`,
      title: `${module.title}: checklist de datos`,
      description: `Control breve para aplicar ${lower(module.title)} en ${config.practiceArea} con trazabilidad.`,
      commercialArea: config.practiceArea,
      items: checklistItems.map((title, itemIndex) => ({
        id: `${config.shortId}-cl${moduleIndex + 1}-i${itemIndex + 1}`,
        title,
        explanation: `${title} reduce errores antes de usar ${lower(module.title)} para analizar, comunicar o decidir.`,
        recommendedAction: `Aplicar sobre una muestra pequena y guardar ${module.evidence}. Criterio de cierre: ${module.criterion}.`
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
        "Validar con una muestra, fuente confiable o responsable del dato si corresponde.",
        "Cerrar con decision, limite detectado y proxima mejora."
      ],
      evidenceToPreserve: [
        "Fuente o archivo de partida",
        item.evidence,
        "Version inicial y version corregida",
        "Decision tomada y motivo",
        "Duda o riesgo pendiente"
      ],
      errorsToAvoid: [
        item.error,
        "Usar datos sensibles en practicas educativas.",
        "Cambiar resultados manualmente para que cierren.",
        "Publicar sin explicar filtros, periodo o fuente.",
        "Confundir correlacion, tendencia o apariencia con causa."
      ],
      aftercare: [
        item.aftercare,
        "Guardar una plantilla reutilizable.",
        "Actualizar el checklist del curso.",
        "Definir siguiente caso de practica."
      ],
      guidedDecision: {
        question: "Que decision muestra mejor criterio profesional con datos?",
        options: [
          {
            text: "Verificar fuente, calidad, definicion y limites antes de comunicar o decidir.",
            isCorrect: true,
            feedback: "Correcto: reduce errores y deja trazabilidad."
          },
          {
            text: "Usar el resultado porque el grafico se ve claro.",
            isCorrect: false,
            feedback: "La claridad visual no prueba calidad ni contexto."
          },
          {
            text: "Ocultar dudas para que el informe parezca mas firme.",
            isCorrect: false,
            feedback: "Los limites bien escritos aumentan confianza responsable."
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
    templateVersion: "0.7-publica-profesional-tanda-5",
    appName: config.title,
    shortName: config.shortName,
    subtitle: config.subtitle,
    description: config.description,
    audience: config.audience,
    responsibleNotice,
    cacheName: `${config.folder}-cache-${version}`,
    contentAudit: {
      status: "reforzado-tanda-5",
      date,
      modules: 6,
      lessons: 36,
      quizQuestions: 30,
      checklists: 6,
      cases: 8,
      notes: "Contenido reemplazado para reducir patrones genericos en cursos de datos, analisis y comunicacion."
    }
  });
  manifest.labels = {
    ...(manifest.labels || {}),
    modules: "Modulos de aprendizaje",
    checklists: "Checklists de datos",
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
    reinforcedBatch5: true,
    publicationCandidate: true,
    publicProfessionalEdition: true,
    requiresBackend: false,
    requiresLogin: false
  };
  const note = "v0.7 tanda 5 reemplaza contenido generico por modulos, practicas, checklists y casos especificos en cursos de datos.";
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
    course.version = "v0.7 tanda 5 reforzada";
    course.status = "Curso reforzado - tanda 5";
    course.category = config.portalCategory || course.category;
    course.audience = config.audience;
    course.description = config.description;
    course.features = [
      "6 modulos",
      "36 lecciones reforzadas",
      "30 preguntas",
      "6 checklists de datos",
      "8 casos guiados",
      "Sin backend ni login"
    ];
    course.recommendedBase = "Contenido reforzado con practicas, evidencia, casos de datos y criterios de validacion.";
    course.tags = [...new Set([...(course.tags || []), "reforzado-tanda-5", "contenido-v0-7", "datos-analisis"])];
    course.publicReady = true;
  }
  writeJson(coursesFile, courses);

  const csvFile = path.join(portalDataDir, "courses_inventory.csv");
  if (fs.existsSync(csvFile)) {
    let csv = fs.readFileSync(csvFile, "utf8");
    for (const config of configs) {
      const lineRegex = new RegExp(`^${config.folder},.*$`, "m");
      csv = csv.replace(lineRegex, `${config.folder},${csvCell(config.title)},v0.7 tanda 5 reforzada,Curso reforzado - tanda 5,${csvCell(config.portalCategory || config.practiceArea)},${csvCell(config.audience)},../../cursos/${config.folder}/index.html,true,true`);
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
      "Pendientes actuales despues de UX/UI, tanda 1, tanda 2, tanda 3 y tanda 4:",
      "Pendientes actuales despues de UX/UI, tanda 1, tanda 2, tanda 3, tanda 4 y tanda 5:"
    );
    const marker = "## Tanda 5 de refuerzo";
    const block = `${marker}\n\nCompletada el ${date} con 5 cursos de datos y analisis reforzados:\n\n${configs.map(config => `- ${config.folder}: 6 modulos, 36 lecciones, 30 preguntas, 6 checklists y 8 casos guiados.`).join("\n")}\n\nDeuda de contenido generico despues de esta tanda: 7 cursos.\n`;
    if (!text.includes(marker)) text = `${text.trim()}\n\n${block}\n`;
    fs.writeFileSync(auditFile, text, "utf8");
  }

  const checklistFile = path.join(root, "CHECKLIST_PUBLICACION_BETA.md");
  if (fs.existsSync(checklistFile)) {
    let text = fs.readFileSync(checklistFile, "utf8");
    if (!text.includes("Reforzar quinta tanda de 5 cursos de datos y analisis")) {
      text = text.replace(
        "- [ ] Reforzar los 12 cursos restantes con patrones de contenido generico.",
        "- [x] Reforzar quinta tanda de 5 cursos de datos y analisis.\n- [ ] Reforzar los 7 cursos restantes con patrones de contenido generico."
      );
    }
    fs.writeFileSync(checklistFile, text, "utf8");
  }

  const pendingFile = path.join(root, "PENDIENTES_REALES_V1_0_BETA.md");
  if (fs.existsSync(pendingFile)) {
    let text = fs.readFileSync(pendingFile, "utf8");
    text = text.replace(
      /la tanda 4 reforzo 5 cursos de trabajo y emprendimiento\.\s+Quedan 12 cursos por trabajar antes de considerar v1\.0 final\./,
      "la tanda 4 reforzo 5 cursos de trabajo y emprendimiento, y la tanda 5 reforzo 5 cursos de datos y analisis. Quedan 7 cursos por trabajar antes de considerar v1.0 final."
    );
    fs.writeFileSync(pendingFile, text, "utf8");
  }
}

function m(title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons) {
  return { title, description, evidence, criterion, deliverable, riskyChoice, helpTrigger, alert, lessons };
}

const courses = [
  {
    folder: "calidad_datos_principiantes_v0_6_publica",
    shortId: "caldat",
    title: "Calidad de Datos para Principiantes",
    shortName: "Calidad de Datos",
    subtitle: "Fuentes, completitud, duplicados, formatos, validacion, trazabilidad y mejora.",
    description: "Curso practico para detectar problemas de calidad de datos y convertirlos en reglas simples de limpieza, control y seguimiento.",
    audience: "Personas que trabajan con planillas, formularios, reportes, datos de clientes o registros operativos.",
    portalCategory: "Datos",
    practiceArea: "calidad de datos inicial para reportes y operaciones",
    exampleContext: "Un equipo recibe planillas con clientes, ventas o solicitudes y necesita confiar en los datos antes de reportar o decidir.",
    finalArtifact: "perfil de calidad con reglas, incidencias, muestra corregida y plan de mejora",
    modules: [
      m("Que significa calidad de datos", "Entender dimensiones basicas: exactitud, completitud, consistencia, unicidad, actualidad y validez.", "tabla de dimensiones con ejemplo real y riesgo asociado", "cada dimension tiene ejemplo, control y consecuencia", "mapa inicial de calidad", "Decir que un dato es bueno porque esta en una planilla.", "Cuando el dato se usa para pagos, clientes, reportes o decisiones publicas.", "Un dato puede existir y aun asi no ser confiable.", ["Dato, campo y registro", "Exactitud", "Completitud", "Consistencia", "Actualidad", "Validez"]),
      m("Fuentes y trazabilidad", "Registrar origen, fecha, responsable y transformaciones del dato.", "ficha de fuente con origen, fecha, responsable y uso permitido", "otra persona puede saber de donde viene el dato y para que sirve", "catalogo simple de fuentes", "Mezclar archivos sin recordar cual fue usado.", "Cuando se comparten datos entre areas o con terceros.", "Sin trazabilidad no hay forma de auditar.", ["Origen del archivo", "Responsable", "Fecha de corte", "Version", "Transformaciones", "Uso permitido"]),
      m("Errores frecuentes", "Detectar faltantes, duplicados, formatos mezclados, valores raros y codigos invalidos.", "perfilado de una muestra con conteos de errores", "los problemas principales estan cuantificados y priorizados", "reporte de problemas", "Corregir a mano sin medir frecuencia ni causa.", "Cuando los errores afectan clientes, dinero o cumplimiento.", "Primero se mide el problema, despues se corrige.", ["Nulos", "Duplicados", "Formatos", "Outliers", "Codigos invalidos", "Errores de carga"]),
      m("Reglas de validacion", "Convertir criterios de calidad en reglas verificables.", "lista de reglas con condicion, ejemplo valido e invalido", "cada regla puede probarse sobre datos nuevos", "diccionario de reglas", "Escribir reglas ambiguas que cada persona interpreta distinto.", "Cuando la validacion bloquea operaciones o reportes.", "Una regla buena se puede explicar y probar.", ["Campos obligatorios", "Rangos", "Formatos", "Listas permitidas", "Dependencias", "Mensajes de error"]),
      m("Limpieza responsable", "Corregir datos sin perder originales ni ocultar problemas.", "archivo corregido con copia de seguridad y log de cambios", "cada correccion tiene motivo y puede revertirse", "procedimiento de limpieza", "Sobrescribir el archivo original sin respaldo.", "Cuando el dato corregido tiene impacto administrativo o legal.", "Limpiar no es borrar evidencias.", ["Backup", "Normalizar texto", "Resolver duplicados", "Completar faltantes", "Marcar dudas", "Log de cambios"]),
      m("Monitoreo y mejora", "Crear controles periodicos para que el problema no vuelva.", "tablero simple de calidad con tendencia y responsables", "los errores tienen indicador, responsable y accion", "plan de mejora de calidad", "Hacer una limpieza unica y olvidar la causa.", "Cuando el proceso se repite semanal o mensualmente.", "La calidad mejora cuando se controla en origen.", ["Indicadores", "Umbrales", "Responsables", "Causa raiz", "Acciones", "Revision periodica"])
    ],
    cases: [
      { title: "Clientes duplicados", summary: "La misma persona aparece varias veces con diferencias pequenas.", goal: "Definir criterio de unicidad.", trigger: "registros repetidos con documento, email o telefono parecido", courseAction: "comparar claves, marcar posibles duplicados y decidir regla", evidence: "lista de duplicados y criterio usado", error: "Borrar duplicados sin revisar casos dudosos.", aftercare: "Crear regla de alta de clientes." },
      { title: "Fechas mezcladas", summary: "Un archivo tiene fechas como texto, numeros y formatos distintos.", goal: "Normalizar fechas.", trigger: "filtros por periodo fallan", courseAction: "detectar formatos, convertir y registrar errores", evidence: "conteo de fechas validas e invalidas", error: "Cambiar solo el formato visual.", aftercare: "Validar fecha al cargar." },
      { title: "Campo obligatorio vacio", summary: "Faltan datos clave para operar.", goal: "Priorizar completitud.", trigger: "registros sin dato necesario", courseAction: "medir faltantes y definir accion por campo", evidence: "porcentaje de completitud", error: "Completar con valores inventados.", aftercare: "Agregar control de carga." },
      { title: "Codigo de producto invalido", summary: "Aparecen codigos que no existen en catalogo.", goal: "Usar lista permitida.", trigger: "valores fuera del catalogo", courseAction: "cruzar contra maestro y separar excepciones", evidence: "tabla de invalidos", error: "Forzar codigos parecidos.", aftercare: "Actualizar catalogo maestro." },
      { title: "Archivo sin fecha de corte", summary: "No se sabe de que periodo son los datos.", goal: "Recuperar trazabilidad.", trigger: "archivo enviado por chat sin contexto", courseAction: "registrar fuente, fecha y version antes de usar", evidence: "ficha de fuente", error: "Usar el archivo porque es el ultimo recibido.", aftercare: "Definir convencion de nombres." },
      { title: "Correccion sin log", summary: "Nadie puede explicar por que cambio un dato.", goal: "Documentar cambios.", trigger: "resultado diferente al archivo original", courseAction: "crear log con campo, valor anterior, valor nuevo y motivo", evidence: "log de limpieza", error: "Modificar hasta que el reporte cierre.", aftercare: "Usar plantilla de cambios." },
      { title: "Outlier real confundido con error", summary: "Un valor extremo parece incorrecto pero puede ser valido.", goal: "Validar antes de borrar.", trigger: "monto o cantidad muy alta", courseAction: "marcar, investigar fuente y decidir tratamiento", evidence: "registro de decision sobre outlier", error: "Eliminar extremos automaticamente.", aftercare: "Definir umbrales por negocio." },
      { title: "Indicador mejora por cambio de regla", summary: "La calidad parece subir pero se cambio el criterio.", goal: "Separar mejora real de cambio metodologico.", trigger: "salto inesperado en metrica", courseAction: "registrar version de regla y comparar periodos", evidence: "nota metodologica", error: "Mostrar tendencia sin aclarar cambio.", aftercare: "Versionar reglas de calidad." }
    ]
  },
  {
    folder: "estadistica_basica_decisiones_v0_6_publica",
    shortId: "estad",
    title: "Estadistica Basica para Decisiones",
    shortName: "Estadistica Basica",
    subtitle: "Preguntas, muestras, promedios, dispersion, comparaciones, incertidumbre y comunicacion.",
    description: "Curso practico para usar estadistica inicial sin tecnicismos innecesarios, evitando conclusiones apresuradas y decisiones con datos mal interpretados.",
    audience: "Personas que toman decisiones con planillas, encuestas, ventas, asistencia, operaciones o indicadores simples.",
    portalCategory: "Datos",
    practiceArea: "estadistica basica aplicada a decisiones",
    exampleContext: "Un equipo necesita interpretar ventas, encuestas o indicadores y decidir sin confundir ruido, tendencia, promedio o excepcion.",
    finalArtifact: "informe estadistico simple con pregunta, muestra, resumen, comparacion, incertidumbre y recomendacion responsable",
    modules: [
      m("Pregunta y datos", "Definir que decision se quiere apoyar y que datos alcanzan para responder.", "pregunta de decision con variable, periodo y poblacion", "la pregunta puede responderse con datos disponibles y limites claros", "ficha de pregunta estadistica", "Buscar numeros sin saber que decision se tomara.", "Cuando la decision afecta personas, dinero, salud, educacion o derechos.", "La estadistica no arregla una pregunta mal formulada.", ["Decision", "Variable", "Unidad de analisis", "Periodo", "Poblacion", "Dato necesario"]),
      m("Muestras y sesgos", "Entender cuando los datos representan bien o mal la realidad que se quiere analizar.", "descripcion de muestra con posibles sesgos", "la muestra se interpreta segun como fue obtenida", "evaluacion de muestra", "Generalizar una encuesta pequena como si fuera toda la poblacion.", "Cuando se publican resultados o se comparan grupos.", "Una muestra sesgada puede sonar precisa y estar equivocada.", ["Poblacion", "Muestra", "Sesgo de seleccion", "No respuesta", "Tamaño", "Alcance"]),
      m("Resumenes numericos", "Usar conteos, porcentajes, media, mediana y percentiles segun el caso.", "tabla resumen con medida elegida y justificacion", "la medida elegida representa el fenomeno sin ocultar extremos", "resumen estadistico", "Usar solo promedio cuando hay valores extremos.", "Cuando el indicador define metas, premios o politicas.", "Un promedio puede esconder desigualdad.", ["Conteos", "Porcentajes", "Media", "Mediana", "Percentiles", "Lectura conjunta"]),
      m("Variacion e incertidumbre", "Reconocer dispersion, variabilidad, error y cambios que pueden ser ruido.", "grafico o tabla con variacion y lectura prudente", "la conclusion distingue cambio real de variacion esperable", "analisis de variacion", "Decir que todo cambio pequeno es tendencia.", "Cuando se decide cambiar procesos por diferencias pequenas.", "No todo movimiento del dato es una señal.", ["Rango", "Desvio simple", "Variacion temporal", "Ruido", "Margen aproximado", "Cautela"]),
      m("Comparaciones justas", "Comparar periodos, grupos o categorias evitando bases distintas y conclusiones falsas.", "comparacion con bases, filtros y contexto documentados", "los grupos comparados tienen definicion y escala compatible", "comparacion responsable", "Comparar cantidades sin mirar tamanos de grupo.", "Cuando la comparacion afecta evaluaciones o recursos.", "Comparar mal puede ser peor que no comparar.", ["Misma base", "Tasas", "Periodos", "Segmentos", "Normalizacion", "Contexto"]),
      m("Comunicar conclusiones", "Escribir hallazgos con dato, contexto, limite y accion sugerida.", "recomendacion con evidencia, limite y siguiente paso", "la conclusion no promete mas de lo que los datos permiten", "informe estadistico breve", "Presentar una conclusion fuerte con datos debiles.", "Cuando el informe se usa para decisiones publicas o laborales.", "Una buena conclusion incluye lo que no se sabe.", ["Hallazgo", "Contexto", "Limites", "Visual simple", "Recomendacion", "Proxima medicion"])
    ],
    cases: [
      { title: "Promedio engañoso", summary: "Una venta muy grande sube el promedio mensual.", goal: "Comparar media y mediana.", trigger: "valor extremo", courseAction: "calcular ambas medidas y explicar diferencia", evidence: "tabla con media, mediana y outlier", error: "Concluir solo con el promedio.", aftercare: "Revisar extremos en cada reporte." },
      { title: "Encuesta de pocos amigos", summary: "Se quiere decidir con respuestas de un grupo no representativo.", goal: "Marcar sesgo de muestra.", trigger: "muestra de conveniencia", courseAction: "describir sesgo y limitar conclusion", evidence: "ficha de muestra", error: "Publicar como opinion general.", aftercare: "Mejorar metodo de recoleccion." },
      { title: "Cambio pequeño exagerado", summary: "Un indicador sube 1 punto y se anuncia gran mejora.", goal: "Evaluar variacion.", trigger: "diferencia pequeña entre periodos", courseAction: "comparar historico y tamaño de base", evidence: "serie con variacion", error: "Convertir ruido en noticia.", aftercare: "Definir umbral de cambio relevante." },
      { title: "Comparacion injusta de sucursales", summary: "Se compara ventas absolutas de locales de distinto tamaño.", goal: "Normalizar indicador.", trigger: "bases desiguales", courseAction: "usar tasa, promedio por dia o venta por superficie", evidence: "comparacion normalizada", error: "Premiar solo por volumen absoluto.", aftercare: "Definir metrica justa." },
      { title: "Porcentaje sin denominador", summary: "Se informa 40% sin decir de cuantos casos.", goal: "Mostrar base.", trigger: "porcentaje aislado", courseAction: "agregar numerador, denominador y periodo", evidence: "indicador corregido", error: "Usar porcentaje para impresionar.", aftercare: "Checklist de indicadores." },
      { title: "Grafico de tendencia con pocos puntos", summary: "Tres meses se interpretan como tendencia firme.", goal: "Agregar contexto temporal.", trigger: "serie corta", courseAction: "ampliar periodo o escribir limite", evidence: "grafico con nota de alcance", error: "Proyectar futuro con pocos datos.", aftercare: "Recolectar mas periodos." },
      { title: "Datos con faltantes ignorados", summary: "No responden varias personas y se calculan porcentajes igual.", goal: "Medir no respuesta.", trigger: "faltantes en encuesta", courseAction: "separar validos, faltantes y total", evidence: "tabla de respuesta", error: "Borrar faltantes sin mencionarlos.", aftercare: "Mejorar formulario." },
      { title: "Conclusion sin accion", summary: "El informe tiene numeros pero no ayuda a decidir.", goal: "Escribir recomendacion prudente.", trigger: "hallazgos sueltos", courseAction: "conectar dato, limite y siguiente paso", evidence: "conclusion reescrita", error: "Agregar mas tablas.", aftercare: "Usar plantilla de decision." }
    ]
  },
  {
    folder: "excel_analisis_datos_v0_6_publica",
    shortId: "exanal",
    title: "Excel para Analisis de Datos",
    shortName: "Excel Analisis",
    subtitle: "Importacion, limpieza, tablas, formulas, tablas dinamicas, graficos y reportes.",
    description: "Curso practico para analizar datos en Excel con estructura, validacion, tablas dinamicas, visualizaciones y reportes reproducibles.",
    audience: "Usuarios de Excel que ya cargan datos y quieren pasar a analisis, reportes y decisiones con mayor criterio.",
    portalCategory: "Datos",
    practiceArea: "analisis de datos con Excel",
    exampleContext: "Una persona recibe datos de ventas, gastos, asistencia o reclamos y necesita limpiarlos, resumirlos y presentar hallazgos en Excel.",
    finalArtifact: "archivo Excel con datos limpios, tabla dinamica, indicadores, graficos y hoja de conclusiones",
    modules: [
      m("Preparar datos para analizar", "Convertir rangos desordenados en tablas limpias con encabezados y tipos correctos.", "tabla de datos con encabezados, tipos y controles iniciales", "la tabla permite filtrar, ordenar y agregar filas sin romper formulas", "tabla base analizable", "Analizar un rango mezclado con totales, notas y celdas combinadas.", "Cuando el archivo alimenta reportes financieros, comerciales o de personas.", "Excel analiza mejor cuando los datos estan en formato de tabla.", ["Formato tabular", "Encabezados", "Tipos", "Celdas combinadas", "Totales separados", "Convertir en tabla"]),
      m("Importar y limpiar", "Traer datos desde CSV o copias, revisar separadores, espacios, duplicados y formatos.", "procedimiento de importacion con problemas detectados", "los datos entran sin perder columnas ni cambiar significado", "datos importados y limpios", "Pegar datos encima de formulas sin revisar.", "Cuando los datos vienen de sistemas externos o terceros.", "Importar bien evita arreglos manuales interminables.", ["CSV", "Separadores", "Espacios", "Duplicados", "Fechas", "Numeros como texto"]),
      m("Formulas para analisis", "Usar formulas que respondan preguntas y puedan auditarse.", "hoja de indicadores con formulas explicadas y prueba manual", "cada formula tiene fuente, logica y control", "indicadores calculados", "Encadenar formulas largas sin comprobar partes.", "Cuando la formula calcula dinero, metas o evaluaciones.", "Una formula util tambien debe ser revisable.", ["SI", "SUMAR.SI", "CONTAR.SI", "BUSCARX o BUSCARV", "FECHA", "Validacion de formulas"]),
      m("Tablas dinamicas", "Resumir datos por categoria, periodo y segmento sin duplicar trabajo.", "tabla dinamica con campos, filtros y lectura principal", "la tabla dinamica responde una pregunta concreta", "resumen dinamico", "Arrastrar campos al azar hasta que aparezca algo interesante.", "Cuando la tabla dinamica se usa en reportes recurrentes.", "La tabla dinamica resume, pero no reemplaza criterio.", ["Crear tabla dinamica", "Filas y columnas", "Valores", "Filtros", "Agrupar fechas", "Actualizar datos"]),
      m("Graficos e indicadores", "Elegir graficos y KPIs que muestren tendencia, comparacion o composicion.", "panel simple con indicadores y graficos justificados", "cada grafico tiene pregunta, titulo y lectura", "mini dashboard en Excel", "Usar graficos 3D o decorativos que confunden.", "Cuando se comparte con direccion, clientes o publico.", "Un buen grafico reduce explicacion, no la aumenta.", ["KPI", "Barras", "Lineas", "Segmentadores", "Formato condicional", "Titulos"]),
      m("Reporte reproducible", "Ordenar hojas, proteger formulas, documentar pasos y preparar actualizacion.", "archivo con hoja de datos, calculos, reporte y README interno", "otra persona puede actualizar y entender el reporte", "reporte Excel reproducible", "Arreglar resultados a mano despues de actualizar.", "Cuando el reporte se actualiza cada semana o mes.", "Un reporte que no se puede repetir se vuelve fragil.", ["Estructura de hojas", "Proteccion", "Notas", "Actualizacion", "Versiones", "Entrega"])
    ],
    cases: [
      { title: "Tabla dinamica no actualiza", summary: "Se agregan filas pero el resumen no cambia.", goal: "Usar tabla como origen.", trigger: "rango fijo", courseAction: "convertir rango en tabla y actualizar origen", evidence: "origen corregido", error: "Copiar filas manualmente dentro del resumen.", aftercare: "Usar tablas en reportes recurrentes." },
      { title: "Fechas importadas como texto", summary: "Los meses no agrupan correctamente.", goal: "Convertir y validar fechas.", trigger: "tipo incorrecto", courseAction: "identificar formato y convertir con control", evidence: "conteo de fechas validas", error: "Cambiar formato visual sin convertir.", aftercare: "Crear control de importacion." },
      { title: "Formula arrastrada rompe referencias", summary: "Un indicador cambia porque una celda fija se movio.", goal: "Auditar referencias.", trigger: "referencia relativa incorrecta", courseAction: "separar referencias relativas y absolutas", evidence: "formula antes/despues", error: "Editar resultado final.", aftercare: "Probar formulas antes de copiar." },
      { title: "Duplicados inflan indicadores", summary: "La venta aparece dos veces en el reporte.", goal: "Detectar duplicados.", trigger: "clave repetida", courseAction: "usar conteo, formato condicional y criterio de resolucion", evidence: "lista de duplicados", error: "Eliminar todo repetido sin revisar.", aftercare: "Validar clave unica." },
      { title: "Grafico sin pregunta", summary: "El reporte muestra varias visualizaciones pero no decide nada.", goal: "Reformular visuales.", trigger: "dashboard decorativo", courseAction: "asociar cada grafico a una pregunta", evidence: "mapa pregunta-grafico", error: "Agregar mas colores.", aftercare: "Checklist de visualizacion." },
      { title: "Filtro oculto cambia resultado", summary: "Una tabla esta filtrada y nadie lo nota.", goal: "Mostrar contexto.", trigger: "resultado inesperado", courseAction: "revisar filtros activos y agregar nota", evidence: "captura con filtros", error: "Copiar tabla filtrada como total.", aftercare: "Agregar tarjeta de filtros." },
      { title: "Archivo pesado y lento", summary: "El Excel tarda mucho en abrir.", goal: "Limpiar estructura.", trigger: "formulas y formatos excesivos", courseAction: "revisar rangos usados, formatos y hojas ocultas", evidence: "archivo optimizado", error: "Seguir duplicando hojas.", aftercare: "Crear version historica separada." },
      { title: "Reporte mensual no reproducible", summary: "Cada mes se arma de forma distinta.", goal: "Documentar proceso.", trigger: "pasos manuales dispersos", courseAction: "escribir secuencia de importacion, limpieza y actualizacion", evidence: "README interno", error: "Depender de memoria.", aftercare: "Usar checklist mensual." }
    ]
  },
  {
    folder: "gobierno_datos_basico_v0_6_publica",
    shortId: "gobdat",
    title: "Gobierno de Datos Basico",
    shortName: "Gobierno de Datos",
    subtitle: "Roles, catalogo, definiciones, calidad, privacidad, acceso, linaje y acuerdos.",
    description: "Curso practico para ordenar responsabilidades, definiciones y controles de datos sin burocracia excesiva.",
    audience: "Equipos chicos, organizaciones, escuelas, municipios, emprendimientos y areas que comparten datos entre personas.",
    portalCategory: "Datos",
    practiceArea: "gobierno de datos inicial para equipos y organizaciones",
    exampleContext: "Una organizacion usa planillas y reportes compartidos, pero no tiene claro quien define, cuida, actualiza o autoriza cada dato.",
    finalArtifact: "kit basico de gobierno de datos con roles, catalogo, definiciones, reglas, accesos y acuerdos",
    modules: [
      m("Por que gobernar datos", "Entender gobierno de datos como acuerdos utiles, no como burocracia.", "mapa de dolores, riesgos y decisiones afectadas por datos", "cada problema de datos se conecta con una decision o riesgo real", "diagnostico inicial de gobierno", "Crear reglas sin explicar que problema resuelven.", "Cuando los datos afectan servicios, dinero, derechos, privacidad o reputacion.", "Gobernar datos es decidir responsabilidades.", ["Problemas frecuentes", "Riesgos", "Decisiones", "Confianza", "Costo del error", "Alcance inicial"]),
      m("Roles y responsabilidades", "Definir quien produce, usa, valida, aprueba y protege cada dato clave.", "matriz RACI simple de datos criticos", "cada dato clave tiene responsable y usuario identificado", "matriz de roles", "Suponer que 'sistemas' es responsable de todo dato.", "Cuando nadie sabe quien puede cambiar una definicion.", "Sin responsables, los datos se deterioran.", ["Dueño de dato", "Custodio", "Usuario", "Validador", "Aprobador", "Escalamiento"]),
      m("Catalogo y definiciones", "Documentar datasets, campos, significado, fuente, frecuencia y uso.", "catalogo minimo con definiciones de 10 campos clave", "otra persona puede entender campo, fuente y uso sin preguntar", "catalogo basico", "Usar nombres de columnas como si fueran definiciones.", "Cuando distintos equipos usan el mismo indicador.", "Un catalogo simple evita discusiones repetidas.", ["Dataset", "Campo", "Definicion", "Fuente", "Frecuencia", "Uso permitido"]),
      m("Calidad y reglas", "Acordar reglas de calidad, validacion y tratamiento de errores.", "lista de reglas de calidad con responsable y umbral", "cada regla tiene control, umbral y accion", "plan de calidad gobernado", "Medir calidad sin asignar correccion.", "Cuando errores se repiten en procesos operativos.", "Una regla sin accion es solo una observacion.", ["Reglas", "Umbrales", "Incidentes", "Priorizacion", "Correccion", "Seguimiento"]),
      m("Privacidad y acceso", "Definir permisos, minimizacion, datos sensibles y uso permitido.", "matriz de acceso con niveles y justificacion", "cada acceso tiene necesidad, alcance y responsable", "politica simple de acceso", "Compartir archivos completos por comodidad.", "Cuando hay datos personales, menores, salud, finanzas o informacion laboral.", "El acceso se da por necesidad, no por costumbre.", ["Datos sensibles", "Minimizacion", "Permisos", "Compartir", "Retencion", "Revision de accesos"]),
      m("Linaje y cambios", "Registrar de donde viene el dato, como cambia y como se comunica una modificacion.", "diagrama simple de linaje y registro de cambios", "los cambios relevantes se pueden rastrear y explicar", "linaje basico y bitacora", "Cambiar formulas o fuentes sin avisar.", "Cuando un cambio altera indicadores o decisiones.", "Cada cambio importante necesita contexto.", ["Origen", "Transformacion", "Reporte", "Version", "Cambio", "Comunicacion"])
    ],
    cases: [
      { title: "Dos areas calculan distinto el mismo KPI", summary: "Ventas tiene un numero y administracion otro.", goal: "Acordar definicion oficial.", trigger: "indicadores incompatibles", courseAction: "documentar formula, fuente, exclusiones y dueño", evidence: "ficha de KPI", error: "Elegir el numero que conviene.", aftercare: "Crear catalogo de indicadores." },
      { title: "Nadie sabe quien puede cambiar una columna", summary: "Un campo se modifica y rompe reportes.", goal: "Asignar responsable.", trigger: "cambio sin dueño claro", courseAction: "definir dueño, custodio y proceso de cambio", evidence: "matriz RACI", error: "Culpar al ultimo usuario.", aftercare: "Registrar cambios." },
      { title: "Archivo con datos sensibles compartido amplio", summary: "Una planilla con datos personales circula por enlace abierto.", goal: "Reducir acceso.", trigger: "permiso excesivo", courseAction: "limitar enlace, separar datos y justificar accesos", evidence: "matriz de permisos corregida", error: "Confiar en que nadie lo usara mal.", aftercare: "Auditar accesos trimestralmente." },
      { title: "Campo sin definicion", summary: "La columna 'estado' significa cosas distintas.", goal: "Definir valores permitidos.", trigger: "interpretaciones diferentes", courseAction: "crear definicion y lista de valores", evidence: "entrada de catalogo", error: "Agregar otra columna parecida.", aftercare: "Revisar campos ambiguos." },
      { title: "Regla de calidad sin responsable", summary: "Se detectan errores pero nadie los corrige.", goal: "Asignar accion.", trigger: "incidentes repetidos", courseAction: "vincular regla, umbral, responsable y plazo", evidence: "plan de accion", error: "Medir errores sin corregir causa.", aftercare: "Reunion breve de calidad." },
      { title: "Cambio de fuente rompe historico", summary: "El reporte cambia porque se reemplazo origen.", goal: "Registrar linaje.", trigger: "fuente nueva", courseAction: "documentar origen anterior, nuevo y fecha de corte", evidence: "diagrama de linaje", error: "Empalmar series sin nota.", aftercare: "Versionar fuentes." },
      { title: "Catalogo demasiado grande", summary: "Se intenta documentar todo y se abandona.", goal: "Priorizar datos criticos.", trigger: "exceso de alcance", courseAction: "elegir 10 datos de mayor riesgo o uso", evidence: "catalogo minimo", error: "Esperar catalogo perfecto.", aftercare: "Agregar por tandas." },
      { title: "Usuario pide acceso total", summary: "Se solicita planilla completa para una tarea puntual.", goal: "Aplicar minimo necesario.", trigger: "pedido amplio", courseAction: "definir campos necesarios y alternativa agregada", evidence: "decision de acceso", error: "Dar copia completa para ahorrar tiempo.", aftercare: "Crear niveles de acceso." }
    ]
  },
  {
    folder: "storytelling_datos_v0_6_publica",
    shortId: "story",
    title: "Storytelling con Datos",
    shortName: "Storytelling Datos",
    subtitle: "Audiencia, pregunta, hallazgo, visualizacion, relato, accion y revision.",
    description: "Curso practico para comunicar datos con claridad, contexto y responsabilidad, sin exagerar conclusiones ni decorar por decorar.",
    audience: "Personas que preparan reportes, presentaciones, dashboards, clases, ventas, proyectos o informes con datos.",
    portalCategory: "Datos",
    practiceArea: "comunicacion y narrativa con datos",
    exampleContext: "Una persona debe presentar resultados de ventas, encuesta, proyecto o gestion y necesita que el publico entienda hallazgo, limite y accion.",
    finalArtifact: "presentacion breve con pregunta, hallazgo, visual principal, relato, recomendacion y notas de limite",
    modules: [
      m("Audiencia y decision", "Definir quien mira el dato, que sabe, que necesita y que decision tomara.", "ficha de audiencia con decision esperada", "el relato responde a una necesidad concreta del publico", "brief de audiencia", "Preparar la misma presentacion para todos.", "Cuando la audiencia tomara decisiones comerciales, laborales o publicas.", "Un dato cambia de sentido segun quien lo necesita.", ["Audiencia", "Conocimiento previo", "Decision", "Objeciones", "Tiempo disponible", "Formato"]),
      m("Pregunta e hilo narrativo", "Transformar datos en una pregunta clara, un hallazgo y una secuencia logica.", "estructura problema-hallazgo-evidencia-accion", "la historia se entiende sin revisar todas las tablas", "guion de datos", "Mostrar datos en el orden en que se analizaron.", "Cuando el relato puede inducir una decision equivocada.", "El analisis no siempre es el mejor orden para comunicar.", ["Pregunta", "Mensaje principal", "Contexto", "Evidencia", "Contraste", "Accion"]),
      m("Visualizacion clara", "Elegir grafico, escala, color y etiquetas segun el mensaje.", "grafico con titulo accionable, fuente y lectura principal", "el visual comunica una idea sin esconder contexto", "visual principal", "Elegir grafico por apariencia antes de elegir mensaje.", "Cuando el grafico compara personas, grupos o rendimiento.", "La visualizacion debe reducir esfuerzo cognitivo.", ["Tipo de grafico", "Escala", "Color", "Etiquetas", "Orden", "Fuente"]),
      m("Contexto y limites", "Explicar periodo, fuente, muestra, filtros, supuestos e incertidumbre.", "nota de contexto y limites junto al hallazgo", "la audiencia sabe que muestra y que no muestra el dato", "bloque de contexto", "Quitar limites para que el mensaje parezca mas fuerte.", "Cuando los datos son incompletos, muestrales o sensibles.", "Un limite honesto mejora la decision.", ["Periodo", "Fuente", "Muestra", "Filtros", "Supuestos", "Incertidumbre"]),
      m("Presentacion y accion", "Convertir hallazgos en recomendacion, decision o proximo experimento.", "slide o informe con hallazgo, impacto y accion sugerida", "la audiencia entiende que hacer despues", "recomendacion accionable", "Cerrar con datos sin pedir ni proponer nada.", "Cuando la accion implica presupuesto, personas o cambios operativos.", "Un buen cierre traduce dato en proximo paso.", ["Hallazgo", "Impacto", "Opciones", "Recomendacion", "Riesgo", "Proximo paso"]),
      m("Revision etica y mejora", "Revisar sesgos, exageraciones, accesibilidad y aprendizaje posterior.", "checklist de revision aplicado antes de publicar", "el relato no manipula, oculta ni excluye", "presentacion revisada", "Usar colores, recortes o escalas para forzar una conclusion.", "Cuando se publica a clientes, ciudadania, estudiantes o direccion.", "Persuadir no es manipular.", ["Escalas honestas", "Sesgos", "Accesibilidad", "Lenguaje", "Privacidad", "Feedback"])
    ],
    cases: [
      { title: "Grafico bonito sin mensaje", summary: "La presentacion tiene visuales pero nadie sabe que decidir.", goal: "Definir hallazgo central.", trigger: "slides decorativos", courseAction: "escribir una frase accionable por grafico", evidence: "visual con titulo accionable", error: "Agregar mas visuales.", aftercare: "Usar plantilla de hallazgo." },
      { title: "Eje recortado exagera cambio", summary: "Una diferencia pequena parece enorme.", goal: "Usar escala honesta.", trigger: "eje vertical manipulado", courseAction: "mostrar escala adecuada y explicar variacion", evidence: "grafico antes/despues", error: "Recortar para impactar mas.", aftercare: "Checklist de escalas." },
      { title: "Sin fuente ni fecha", summary: "El publico no puede evaluar vigencia.", goal: "Agregar contexto.", trigger: "dato aislado", courseAction: "incluir fuente, periodo y fecha de corte", evidence: "nota de contexto", error: "Decir que el dato es interno y alcanza.", aftercare: "Bloque fijo de fuente." },
      { title: "Demasiados datos por slide", summary: "La audiencia se pierde entre tablas.", goal: "Priorizar mensaje.", trigger: "slide saturada", courseAction: "separar detalle de mensaje principal", evidence: "slide simplificada", error: "Achicar texto para que entre todo.", aftercare: "Anexo para detalle." },
      { title: "Conclusion mas fuerte que la evidencia", summary: "Se recomienda una accion grande con datos debiles.", goal: "Ajustar tono y limite.", trigger: "muestra pequena o incompleta", courseAction: "formular recomendacion prudente y proximo experimento", evidence: "conclusion reescrita", error: "Ocultar incertidumbre.", aftercare: "Definir nivel de confianza." },
      { title: "Color confunde categorias", summary: "El grafico usa colores sin significado.", goal: "Dar funcion al color.", trigger: "paleta arbitraria", courseAction: "usar color para resaltar hallazgo o estado", evidence: "grafico recoloreado", error: "Usar muchos colores para decorar.", aftercare: "Crear regla de color." },
      { title: "Datos personales en presentacion", summary: "Una tabla muestra nombres o datos sensibles.", goal: "Anonimizar.", trigger: "detalle innecesario", courseAction: "agregar agregados o ejemplos simulados", evidence: "version anonima", error: "Tapar parcialmente en captura.", aftercare: "Revision de privacidad." },
      { title: "Audiencia equivocada", summary: "El informe tecnico se envia a publico no tecnico.", goal: "Adaptar lenguaje.", trigger: "preguntas basicas de comprension", courseAction: "reescribir en lenguaje de decision", evidence: "version para audiencia", error: "Decir que la audiencia debe saber mas.", aftercare: "Preparar dos niveles de detalle." }
    ]
  }
];

for (const config of courses) writeCourseFiles(config);
updatePortalInventory(courses);
updateDocs(courses);

console.log(`Tanda 5 reforzada: ${courses.length} cursos`);
for (const config of courses) {
  const data = readJson(path.join(coursesRoot, config.folder, "src", "data", "course_content.json"));
  const lessons = data.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const quiz = data.modules.reduce((sum, module) => sum + module.quiz.length, 0);
  console.log(`- ${config.folder}: ${data.modules.length} modulos, ${lessons} lecciones, ${quiz} preguntas`);
}

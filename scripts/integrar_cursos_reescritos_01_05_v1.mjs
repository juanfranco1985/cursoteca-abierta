import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(root, "..");
const extractedRoot = path.join(workspaceRoot, "__cursos_reescritos_v1");
const repoSourceRoot = path.join(root, "contenido_reescrito", "cursos_01_05_v1");
const coursesRoot = path.join(root, "cursos");
const date = "2026-06-05";
const version = "1.0-curso-completo-v1";
const publicVersion = "v1 curso completo";
const status = "Curso completo v1";

const courseInputs = [
  {
    folder: "astronomia_general_curiosos_v0_6_publica",
    source: "cursoteca_cursos_01_02_v1/curso_01_astronomia_general_para_curiosos.md",
    sourceFolder: "cursoteca_cursos_01_02_v1",
    finalArtifact: "Guia personal de iniciacion astronomica",
    description: "Curso completo para comprender astronomia general, observar el cielo con seguridad y leer noticias astronomicas con pensamiento critico.",
    tags: ["curso-completo-v1", "astronomia", "pensamiento-critico", "contenido-plus"]
  },
  {
    folder: "computacion_cuantica_curiosos_v0_6_publica",
    source: "cursoteca_cursos_01_02_v1/curso_02_computacion_cuantica_para_curiosos.md",
    sourceFolder: "cursoteca_cursos_01_02_v1",
    finalArtifact: "Mapa conceptual de computacion cuantica sin humo",
    description: "Curso completo para entender bits, qubits, superposicion, medicion, entrelazamiento, circuitos, limites y aplicaciones reales.",
    tags: ["curso-completo-v1", "computacion-cuantica", "divulgacion", "contenido-plus"]
  },
  {
    folder: "escudo_comercial_web_v0_6_publica",
    source: "cursoteca_curso_03_reescrito_v1/curso_03_escudo_comercial_digital_argentina.md",
    sourceFolder: "cursoteca_curso_03_reescrito_v1",
    finalArtifact: "Escudo comercial digital minimo para un comercio",
    description: "Curso completo para proteger canales digitales, cuentas, pagos, datos de clientes, comunicacion y reputacion de un comercio.",
    tags: ["curso-completo-v1", "seguridad-comercial", "comercio-digital", "argentina"]
  },
  {
    folder: "alfabetizacion_digital_adultos_web_v0_6_publica",
    source: "cursoteca_curso_04_reescrito_v1/curso_04_alfabetizacion_digital_para_adultos.md",
    sourceFolder: "cursoteca_curso_04_reescrito_v1",
    finalArtifact: "Carpeta personal de autonomia digital",
    description: "Curso completo para desarrollar autonomia digital basica: dispositivos, internet, busqueda confiable, comunicacion, archivos, tramites y seguridad.",
    tags: ["curso-completo-v1", "alfabetizacion-digital", "adultos", "ciudadania-digital"]
  },
  {
    folder: "android_seguro_principiantes_v0_6_publica",
    source: "cursoteca_curso_05_reescrito_v1/curso_05_android_seguro_para_principiantes.md",
    sourceFolder: "cursoteca_curso_05_reescrito_v1",
    finalArtifact: "Checklist de telefono Android seguro",
    description: "Curso completo para configurar un celular Android con bloqueo, cuenta Google, actualizaciones, apps confiables, permisos, copias y respuesta ante incidentes.",
    tags: ["curso-completo-v1", "android", "seguridad-digital", "principiantes"]
  }
];

const sourceUrls = new Map([
  ["NASA Solar System Exploration", "https://solarsystem.nasa.gov/"],
  ["NASA Exoplanet Exploration", "https://exoplanets.nasa.gov/"],
  ["International Astronomical Union", "https://www.iau.org/"],
  ["European Space Agency", "https://www.esa.int/"],
  ["IBM Quantum Learning", "https://learning.quantum.ibm.com/"],
  ["Qiskit documentation", "https://docs.quantum.ibm.com/"],
  ["Microsoft Quantum documentation", "https://learn.microsoft.com/en-us/azure/quantum/"],
  ["Google Quantum AI", "https://quantumai.google/"],
  ["NIST", "https://www.nist.gov/"],
  ["Google Business Profile Help", "https://support.google.com/business/"],
  ["WhatsApp Business Help", "https://faq.whatsapp.com/"],
  ["Meta Business Help", "https://www.facebook.com/business/help"],
  ["Banco Central de la Republica Argentina", "https://www.bcra.gob.ar/"],
  ["Banco Central de la Republica Argentina", "https://www.bcra.gob.ar/"],
  ["Argentina.gob.ar", "https://www.argentina.gob.ar/"],
  ["Mi Argentina", "https://www.argentina.gob.ar/miargentina"],
  ["Google Safety Center", "https://safety.google/"],
  ["Microsoft Digital Literacy", "https://www.microsoft.com/en-us/digital-literacy"],
  ["DigComp 2.2", "https://publications.jrc.ec.europa.eu/repository/handle/JRC128415"],
  ["Google Android Help", "https://support.google.com/android/"],
  ["Google Play Help", "https://support.google.com/googleplay/"],
  ["Google Account Help", "https://support.google.com/accounts/"],
  ["NIST Cybersecurity Framework", "https://www.nist.gov/cyberframework"]
]);

const responsibleNotice = "Contenido educativo. No reemplaza asesoramiento profesional, soporte oficial ni normativa aplicable. En temas de seguridad, datos personales, dinero, comercios, tramites o derechos, valida decisiones criticas con fuentes oficiales o una persona competente.";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\uFEFF/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function stripRules(text) {
  return normalizeText(text).replace(/^---+\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}

function titleCaseFromHeading(heading) {
  return heading.replace(/^#+\s*/, "").replace(/^M[oó]dulo\s+\d+\s+[—-]\s*/i, "").trim();
}

function splitTopSections(markdown) {
  const lines = normalizeText(markdown).split("\n");
  const sections = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(/^(#{1,3})\s+(.+)$/);
    if (m) {
      if (current) sections.push(current);
      current = { level: m[1].length, title: m[2].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function sectionContent(sections, titlePattern) {
  const section = sections.find(item => titlePattern.test(item.title));
  return section ? stripRules(section.lines.join("\n")) : "";
}

function firstSentences(text, count = 2) {
  const clean = stripMarkdown(text).replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]+/g);
  if (sentences?.length) return sentences.slice(0, count).join(" ").trim();
  return words(clean, 60);
}

function words(text, max) {
  const parts = String(text).replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean);
  return parts.length <= max ? parts.join(" ") : `${parts.slice(0, max).join(" ")}...`;
}

function stripMarkdown(text) {
  return String(text)
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^>\s?/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

function splitParagraphs(text) {
  return stripRules(text)
    .split(/\n{2,}/)
    .map(item => item.trim())
    .filter(Boolean);
}

function parseModules(markdown) {
  const lines = normalizeText(markdown).split("\n");
  const modules = [];
  let current = null;
  for (const line of lines) {
    const moduleMatch = line.match(/^#{1,2}\s+M[oó]dulo\s+(\d+)\s+[—-]\s+(.+)$/i);
    const stopMatch = line.match(/^#{1,2}\s+(Caso pr[aá]ctico integrador|Actividades|Evaluaci[oó]n final|Glosario|Producto final|Fuentes recomendadas)/i);
    if (moduleMatch) {
      if (current) modules.push(current);
      current = { number: Number(moduleMatch[1]), title: moduleMatch[2].trim(), lines: [] };
    } else if (stopMatch) {
      if (current) modules.push(current);
      current = null;
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) modules.push(current);
  return modules.map(module => ({ ...module, content: stripRules(module.lines.join("\n")) }));
}

function splitLessons(module) {
  const lines = module.content.split("\n");
  const subheads = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(/^#{2,3}\s+(.+)$/);
    if (m) {
      if (current) subheads.push(current);
      current = { title: m[1].replace(/^\d+\.\d+\s+/, "").trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) subheads.push(current);
  const completeSubheads = subheads
    .map(item => ({ title: item.title, content: stripRules(item.lines.join("\n")) }))
    .filter(item => item.content.length > 40);
  if (completeSubheads.length >= 2) return completeSubheads;
  return [{ title: module.title, content: module.content }];
}

function parseListItems(text) {
  return normalizeText(text)
    .split("\n")
    .map(line => line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function parseSources(text) {
  const section = sectionContent(splitTopSections(text), /^Fuentes recomendadas/i);
  return parseListItems(section).map(item => item.replace(/\.$/, ""));
}

function parseActivities(text) {
  const sections = splitTopSections(text);
  const activityContainer = sections.find(item => /^Actividades/i.test(item.title));
  if (!activityContainer) return [];
  const content = activityContainer.lines.join("\n");
  const subheads = splitTopSections(`# Actividades\n${content}`).filter(item => item.level >= 2 && /^Actividad/i.test(item.title));
  if (subheads.length) {
    return subheads.map(item => ({
      title: item.title.replace(/^Actividad\s+\d+\s+[—-]\s*/i, "").trim(),
      content: stripRules(item.lines.join("\n"))
    }));
  }
  return parseListItems(content).map((title, index) => ({ title: title.replace(/^\d+\.\s*/, ""), content: `Actividad ${index + 1}: ${title}` }));
}

function parseCase(text) {
  return sectionContent(splitTopSections(text), /^Caso pr[aá]ctico integrador/i);
}

function parseEvaluation(text) {
  return sectionContent(splitTopSections(text), /^Evaluaci[oó]n final/i);
}

function parseGlossary(text) {
  return sectionContent(splitTopSections(text), /^Glosario/i);
}

function parseProduct(text) {
  return sectionContent(splitTopSections(text), /^Producto final/i);
}

function sourceObjects(sources) {
  return sources.map(name => ({
    title: name,
    organization: name,
    url: sourceUrls.get(name) || "#",
    note: "Fuente recomendada por el paquete de reescritura v1."
  }));
}

function buildTheorySections(content) {
  const paragraphs = splitParagraphs(content);
  if (!paragraphs.length) return [];
  if (paragraphs.length === 1) {
    return [{ title: "Desarrollo teorico", body: stripMarkdown(paragraphs[0]) }];
  }
  const third = Math.max(1, Math.ceil(paragraphs.length / 3));
  const groups = [
    paragraphs.slice(0, third),
    paragraphs.slice(third, third * 2),
    paragraphs.slice(third * 2)
  ].filter(group => group.length);
  const titles = ["Fundamento", "Criterios y detalles", "Aplicacion y limites"];
  return groups.map((group, index) => ({
    title: titles[index] || "Desarrollo",
    body: stripMarkdown(group.join("\n\n"))
  }));
}

function extractKeyPoints(content, fallbackTitle) {
  const bullets = parseListItems(content).map(stripMarkdown).filter(item => item.length > 8);
  if (bullets.length >= 3) return bullets.slice(0, 5);
  const clean = stripMarkdown(content).replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]+/g)?.map(item => item.trim()) || [];
  const selected = sentences.filter(item => item.length > 30).slice(0, 4);
  while (selected.length < 4) selected.push(`${fallbackTitle} debe poder explicarse con una idea clara, una decision practica y un limite responsable.`);
  return selected.slice(0, 5);
}

function buildLesson({ module, moduleIndex, lesson, lessonIndex, courseTitle, sources, activities, finalArtifact }) {
  const intro = firstSentences(lesson.content, 2);
  const activity = activities[(moduleIndex + lessonIndex) % Math.max(activities.length, 1)];
  return {
    id: `m${moduleIndex + 1}-l${lessonIndex + 1}`,
    title: lesson.title,
    keyIdea: `${lesson.title}: ${firstSentences(lesson.content, 1)}`,
    shortTheory: intro,
    theorySections: buildTheorySections(lesson.content),
    practicalExample: activity
      ? `Aplicacion sugerida: ${stripMarkdown(activity.title)}. ${words(stripMarkdown(activity.content), 55)}`
      : `Aplicacion sugerida: relaciona "${lesson.title}" con un caso real del curso ${courseTitle} y registra observacion, decision, evidencia y limite.`,
    counterExample: `Contraejemplo: tratar "${lesson.title}" como una receta aislada, sin contexto, evidencia ni criterio de calidad.`,
    commonMistake: `Error frecuente: memorizar el concepto sin poder explicar para que sirve, que limite tiene y como se aplica en una situacion concreta.`,
    whatToDoNow: `Actividad: escribe una ficha breve sobre "${lesson.title}" con definicion, ejemplo, riesgo, fuente consultada y una accion concreta vinculada al producto final: ${finalArtifact}.`,
    alert: "Validar decisiones importantes con fuentes oficiales o personas competentes. No usar datos sensibles reales en practicas educativas.",
    keyPoints: extractKeyPoints(lesson.content, lesson.title),
    references: sourceObjects(sources),
    responsibleNote: responsibleNotice
  };
}

function buildQuiz(module, moduleIndex) {
  const title = module.title;
  const lessonTitles = module.lessons.map(item => item.title);
  return [
    {
      id: `m${moduleIndex + 1}-q1`,
      question: `Que debe poder explicar el estudiante al cerrar "${title}"?`,
      options: [
        "Concepto, utilidad, limite y aplicacion a un caso concreto.",
        "Solo una definicion memorizada.",
        "Una opinion sin evidencia.",
        "Una lista de palabras tecnicas sin contexto."
      ],
      correctAnswerIndex: 0,
      feedback: "La norma de curso completo exige comprension, aplicacion y criterio."
    },
    {
      id: `m${moduleIndex + 1}-q2`,
      question: `Cual es una mala forma de estudiar "${title}"?`,
      options: [
        "Aplicarlo a un caso y revisar fuentes.",
        "Tomar notas de conceptos y limites.",
        "Memorizar frases sin poder usarlas.",
        "Comparar un ejemplo con un contraejemplo."
      ],
      correctAnswerIndex: 2,
      feedback: "La repeticion sin aplicacion fue uno de los problemas que esta version corrige."
    },
    {
      id: `m${moduleIndex + 1}-q3`,
      question: `Que evidencia conviene guardar en este modulo?`,
      options: [
        `Una ficha con ${lessonTitles.slice(0, 2).join(" y ")} aplicada al producto final.`,
        "Una captura sin explicacion.",
        "Un resumen copiado sin fuente.",
        "Una promesa de mejora sin criterio."
      ],
      correctAnswerIndex: 0,
      feedback: "La evidencia debe conectar teoria, practica y producto final."
    }
  ];
}

function buildChecklists(activities, modules, finalArtifact, shortId) {
  const source = activities.length ? activities : modules.slice(0, 6).map(module => ({
    title: module.title,
    content: `Aplicar el modulo "${module.title}" al producto final.`
  }));
  return {
    checklists: source.slice(0, 8).map((activity, index) => ({
      id: `${shortId}-checklist-${index + 1}`,
      title: stripMarkdown(activity.title),
      description: `Control de aplicacion para avanzar hacia el producto final: ${finalArtifact}.`,
      commercialArea: "Curso completo v1",
      items: [
        {
          id: `${shortId}-cl${index + 1}-i1`,
          title: "Concepto comprendido",
          explanation: "El estudiante puede explicar la idea con sus palabras.",
          recommendedAction: `Escribir una definicion breve relacionada con ${stripMarkdown(activity.title)}.`
        },
        {
          id: `${shortId}-cl${index + 1}-i2`,
          title: "Caso aplicado",
          explanation: "La actividad se vincula con una situacion realista.",
          recommendedAction: words(stripMarkdown(activity.content), 70)
        },
        {
          id: `${shortId}-cl${index + 1}-i3`,
          title: "Riesgo o limite identificado",
          explanation: "Un curso completo no presenta recetas sin limites.",
          recommendedAction: "Anotar un error frecuente, una condicion de uso y una forma de verificar."
        },
        {
          id: `${shortId}-cl${index + 1}-i4`,
          title: "Fuente consultada",
          explanation: "La decision debe apoyarse en una fuente confiable.",
          recommendedAction: "Registrar fuente, fecha de consulta y que dato se uso."
        },
        {
          id: `${shortId}-cl${index + 1}-i5`,
          title: "Producto final actualizado",
          explanation: "Cada actividad debe acercar el entregable final.",
          recommendedAction: `Actualizar el entregable: ${finalArtifact}.`
        }
      ]
    }))
  };
}

function buildIncidents(caseContent, evaluation, product, courseTitle, shortId) {
  const cleanCase = stripMarkdown(caseContent) || `Aplicar ${courseTitle} a un caso realista.`;
  const cleanEvaluation = stripMarkdown(evaluation) || "Responder preguntas conceptuales y producir una entrega practica.";
  const cleanProduct = stripMarkdown(product) || "Producto final verificable.";
  const cases = [
    {
      title: "Caso practico integrador",
      summary: words(cleanCase, 90),
      goal: "Aplicar la teoria completa del curso a una situacion realista.",
      action: cleanCase
    },
    {
      title: "Evaluacion final",
      summary: words(cleanEvaluation, 90),
      goal: "Comprobar comprension conceptual y produccion practica.",
      action: cleanEvaluation
    },
    {
      title: "Producto final del curso",
      summary: words(cleanProduct, 90),
      goal: "Cerrar el curso con una evidencia concreta de aprendizaje.",
      action: cleanProduct
    }
  ];
  return {
    incidents: cases.map((item, index) => ({
      id: `${shortId}-case-${index + 1}`,
      title: item.title,
      summary: item.summary,
      severity: "Practica integradora",
      immediateGoal: item.goal,
      steps: [
        "Describir el contexto del caso.",
        "Identificar conceptos teoricos necesarios.",
        "Aplicar el criterio del curso paso a paso.",
        "Registrar evidencia y limite de la decision.",
        "Contrastar con fuentes recomendadas.",
        "Cerrar con producto final, duda pendiente y proxima mejora."
      ],
      evidenceToPreserve: [
        "Descripcion del caso",
        "Conceptos usados",
        "Fuente consultada",
        "Decision o produccion final",
        "Riesgo, limite o duda pendiente"
      ],
      errorsToAvoid: [
        "Resolver por intuicion sin explicar criterio.",
        "Copiar una fuente sin sintetizar.",
        "Usar datos sensibles reales en la practica.",
        "Cerrar el curso sin producto verificable."
      ],
      aftercare: [
        item.action,
        "Guardar la entrega final.",
        "Revisar el checklist antes de marcar el curso como completo."
      ],
      guidedDecision: {
        question: "Que decision muestra mejor criterio de curso completo?",
        options: [
          {
            text: "Conectar teoria, caso, fuente, limite y producto verificable.",
            isCorrect: true,
            feedback: "Correcto: esa es la diferencia entre ficha introductoria y curso completo."
          },
          {
            text: "Repetir una definicion sin aplicarla.",
            isCorrect: false,
            feedback: "La definicion aislada no alcanza."
          },
          {
            text: "Cerrar sin evidencia ni fuente.",
            isCorrect: false,
            feedback: "Falta verificacion y producto final."
          }
        ]
      }
    }))
  };
}

function buildCourse(input, markdown) {
  const oldCourse = readJson(path.join(coursesRoot, input.folder, "src", "data", "course_content.json"));
  const manifest = readJson(path.join(coursesRoot, input.folder, "src", "data", "course_manifest.json"));
  const title = oldCourse.title || manifest.appName || manifest.shortName;
  const sections = splitTopSections(markdown);
  const presentation = sectionContent(sections, /^Presentaci[oó]n/i);
  const objectives = parseListItems(sectionContent(sections, /^Objetivos/i));
  const sources = parseSources(markdown);
  const activities = parseActivities(markdown);
  const caseContent = parseCase(markdown);
  const evaluation = parseEvaluation(markdown);
  const glossary = parseGlossary(markdown);
  const product = parseProduct(markdown);
  const parsedModules = parseModules(markdown);
  const modules = parsedModules.map((module, moduleIndex) => {
    const lessonInputs = splitLessons(module);
    const lessons = lessonInputs.map((lessonInput, lessonIndex) => buildLesson({
      module,
      moduleIndex,
      lesson: lessonInput,
      lessonIndex,
      courseTitle: title,
      sources,
      activities,
      finalArtifact: input.finalArtifact
    }));
    return {
      id: `m${moduleIndex + 1}`,
      title: module.title,
      description: firstSentences(module.content, 2),
      learningRisk: "Estudiar el tema como una lista de datos sin comprender fundamentos, limites ni aplicacion.",
      commercialRisk: "Tomar decisiones practicas sin criterio, fuente ni producto verificable.",
      lessons,
      quiz: buildQuiz({ ...module, lessons }, moduleIndex)
    };
  });
  return {
    courseId: oldCourse.courseId,
    title,
    version,
    publicationStatus: "publica-curso-completo-v1",
    depthModel: {
      status: "curso-completo-v1",
      updatedAt: date,
      sourcePackage: "cursos_01_05_reescritos_v1",
      theoryArchitecture: [
        "presentacion del curso",
        "objetivos de aprendizaje",
        "modulos teoricos",
        "caso practico integrador",
        "actividades",
        "evaluacion final",
        "glosario",
        "producto final",
        "fuentes recomendadas"
      ]
    },
    presentation: stripMarkdown(presentation),
    objectives,
    finalProduct: stripMarkdown(product),
    glossary: stripMarkdown(glossary),
    sourceBank: Object.fromEntries(sources.map((source, index) => [`source-${index + 1}`, sourceObjects([source])[0]])),
    modules
  };
}

function patchCourseApp(folder) {
  const file = path.join(coursesRoot, folder, "src", "app.js");
  let app = fs.readFileSync(file, "utf8");
  if (!app.includes("function formatText(")) {
    app = app.replace(
      /function list\(items = \[\]\) \{/,
      `function formatText(value = "") {\n  return esc(value).replace(/\\n{2,}/g, "<br><br>").replace(/\\n/g, "<br>");\n}\n\nfunction list(items = []) {`
    );
  }
  if (!app.includes("function renderTheorySections(")) {
    app = app.replace(
      /function renderLesson\(moduleId, lessonId\) \{/,
      `function renderTheorySections(lesson) {\n  const sections = Array.isArray(lesson.theorySections) ? lesson.theorySections : [];\n  if (!sections.length) return "";\n  return \`\n    <div class="theory-stack">\n      \${sections.map(section => \`\n        <section class="theory-block">\n          <h3>\${esc(section.title || "Bloque teorico")}</h3>\n          <p>\${formatText(section.body || "")}</p>\n        </section>\`).join("")}\n    </div>\`;\n}\n\nfunction renderReferences(lesson) {\n  const references = Array.isArray(lesson.references) ? lesson.references : [];\n  if (!references.length) return "";\n  return \`\n    <div class="card reading-card source-card">\n      <h2>Fuentes usadas</h2>\n      <ul class="source-list">\n        \${references.map(ref => \`\n          <li>\n            <a href="\${esc(ref.url || "#")}" target="_blank" rel="noopener">\n              <strong>\${esc(ref.title || ref.key || "Fuente")}</strong>\n              <span>\${esc(ref.organization || ref.note || "")}</span>\n            </a>\n          </li>\`).join("")}\n      </ul>\n    </div>\`;\n}\n\nfunction renderLesson(moduleId, lessonId) {`
    );
  }
  app = app
    .replace('<div class="card reading-card"><h2>Teoría breve</h2><p>${esc(lesson.shortTheory || lesson.content || "")}</p></div>', '<div class="card reading-card"><h2>Teoría aplicada</h2><p>${formatText(lesson.shortTheory || lesson.content || "")}</p>${renderTheorySections(lesson)}</div>')
    .replace('<div class="card reading-card"><h2>Ejemplo práctico</h2><p>${esc(lesson.practicalExample || "")}</p></div>', '<div class="card reading-card"><h2>Ejemplo práctico</h2><p>${formatText(lesson.practicalExample || "")}</p></div>\\n      ${lesson.counterExample ? `<div class="card reading-card counter-card"><h2>Contraejemplo</h2><p>${formatText(lesson.counterExample)}</p></div>` : ""}')
    .replace('<div class="card alert"><h2>Error común</h2><p>${esc(lesson.commonMistake || "")}</p></div>', '<div class="card alert"><h2>Error común</h2><p>${formatText(lesson.commonMistake || "")}</p></div>')
    .replace('<div class="card reading-card"><h2>Qué hacer ahora</h2><p>${esc(lesson.whatToDoNow || lesson.recommendedAction || "")}</p></div>', '<div class="card reading-card"><h2>Qué hacer ahora</h2><p>${formatText(lesson.whatToDoNow || lesson.recommendedAction || "")}</p></div>')
    .replace('<div class="card"><h2>Conceptos clave</h2>${list(lesson.keyPoints)}</div>', '<div class="card"><h2>Conceptos clave</h2>${list(lesson.keyPoints)}</div>\\n      ${renderReferences(lesson)}');
  fs.writeFileSync(file, app, "utf8");
}

function patchCourseStyles(folder) {
  const file = path.join(coursesRoot, folder, "styles.css");
  let css = fs.readFileSync(file, "utf8");
  if (css.includes(".theory-stack")) return;
  const block = `
.reading-flow {
  max-width: 920px;
}

.reading-card p,
.theory-block p {
  max-width: 78ch;
}

.theory-stack {
  display: grid;
  gap: .85rem;
  margin-top: 1rem;
}

.theory-block {
  padding: .9rem 1rem;
  border-left: 3px solid var(--teal);
  border-radius: 6px;
  background: rgba(255, 244, 220, .055);
}

.theory-block h3 {
  color: var(--paper);
}

.counter-card {
  border-color: rgba(79, 182, 170, .36);
}

.source-list {
  display: grid;
  gap: .7rem;
  padding: 0;
  list-style: none;
}

.source-list a {
  display: block;
  padding: .8rem .9rem;
  border: 1px solid rgba(214, 168, 92, .24);
  border-radius: var(--radius);
  text-decoration: none;
  background: rgba(18, 12, 8, .42);
}

.source-list strong,
.source-list span {
  display: block;
}

.source-list span {
  color: var(--muted);
}
`;
  css = css.replace(/\n\.todo-app-demo\s*\{/, `${block}\n.todo-app-demo {`);
  fs.writeFileSync(file, css, "utf8");
}

function updateManifestFiles(input, content, checklistCount, caseCount) {
  const dataRoot = path.join(coursesRoot, input.folder, "src", "data");
  const manifestFile = path.join(dataRoot, "course_manifest.json");
  const manifest = readJson(manifestFile);
  Object.assign(manifest, {
    templateVersion: version,
    subtitle: input.description,
    description: input.description,
    version,
    publicationStatus: "publica-curso-completo-v1",
    responsibleNotice,
    webApp: {
      ...(manifest.webApp || {}),
      cacheName: `${input.folder}-cache-v1-curso-completo`,
      publicationStatus: "publica-curso-completo-v1"
    },
    professionalization: {
      tier: "curso-completo-v1",
      updatedAt: date,
      sourcePackage: "cursos_01_05_reescritos_v1",
      improvements: [
        "Reescritura teorica extensa en formato de curso completo.",
        "Objetivos, modulos teoricos, caso integrador, actividades, evaluacion, glosario y producto final.",
        "Lecciones con bloques teoricos, contraejemplos y fuentes recomendadas."
      ]
    },
    contentDepthAudit: {
      status: "curso-completo-v1",
      updatedAt: date,
      modules: content.modules.length,
      lessons: content.modules.reduce((sum, module) => sum + module.lessons.length, 0),
      questions: content.modules.reduce((sum, module) => sum + module.quiz.length, 0),
      checklists: checklistCount,
      cases: caseCount
    }
  });
  writeJson(manifestFile, manifest);

  const publicationFile = path.join(coursesRoot, input.folder, "manifest_publicacion.json");
  const publication = readJson(publicationFile);
  Object.assign(publication, {
    version: publicVersion,
    status,
    contentDepth: "curso completo reescrito v1",
    updatedAt: date
  });
  writeJson(publicationFile, publication);

  const serviceWorkerFile = path.join(coursesRoot, input.folder, "service-worker.js");
  if (fs.existsSync(serviceWorkerFile)) {
    const sw = fs.readFileSync(serviceWorkerFile, "utf8").replace(/const CACHE_NAME = "[^"]+";/, `const CACHE_NAME = "${input.folder}-cache-v1-curso-completo";`);
    fs.writeFileSync(serviceWorkerFile, sw, "utf8");
  }

  const webmanifestFile = path.join(coursesRoot, input.folder, "manifest.webmanifest");
  if (fs.existsSync(webmanifestFile)) {
    const webmanifest = readJson(webmanifestFile);
    webmanifest.description = input.description;
    writeJson(webmanifestFile, webmanifest);
  }

  const readmeFile = path.join(coursesRoot, input.folder, "README.md");
  if (fs.existsSync(readmeFile)) {
    const readme = fs.readFileSync(readmeFile, "utf8");
    const note = `\n\n## Reescritura curso completo v1\n\nActualizado el ${date} con teoria ampliada, objetivos, modulos, caso integrador, actividades, evaluacion, glosario, producto final y fuentes recomendadas.\n`;
    fs.writeFileSync(readmeFile, readme.includes("## Reescritura curso completo v1") ? readme : `${readme.trim()}${note}`, "utf8");
  }
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function updatePortalAndInventory(results) {
  const resultByFolder = new Map(results.map(item => [item.folder, item]));

  const portalJsonFile = path.join(root, "portal", "portal_publico_profesional_v0_6", "data", "courses.json");
  const portalCourses = readJson(portalJsonFile);
  for (const course of portalCourses) {
    const result = resultByFolder.get(course.id);
    if (!result) continue;
    Object.assign(course, {
      version: publicVersion,
      status,
      description: result.description,
      features: [
        `${result.modules} modulos teoricos`,
        `${result.lessons} lecciones completas`,
        `${result.questions} preguntas`,
        `${result.checklists} checklists de aplicacion`,
        `${result.cases} casos integradores`,
        "Glosario, producto final y fuentes"
      ],
      recommendedBase: "Curso reescrito con estructura completa v1: teoria, practica, evaluacion y producto final.",
      tags: uniq([...(course.tags || []), ...result.tags])
    });
  }
  writeJson(portalJsonFile, portalCourses);

  const inventoryJsonFile = path.join(root, "inventario", "inventario_publico_profesional.json");
  const inventory = readJson(inventoryJsonFile);
  for (const course of inventory) {
    const result = resultByFolder.get(course.slug);
    if (!result) continue;
    Object.assign(course, {
      version: publicVersion,
      status,
      modules: result.modules,
      lessons: result.lessons,
      questions: result.questions,
      checklists: result.checklists,
      cases: result.cases,
      contentDepth: "curso completo reescrito v1",
      deepReworkedAt: date,
      tags: uniq([...(course.tags || []), ...result.tags])
    });
  }
  writeJson(inventoryJsonFile, inventory);

  const inventoryCsvFile = path.join(root, "inventario", "inventario_publico_profesional.csv");
  if (fs.existsSync(inventoryCsvFile)) {
    const lines = fs.readFileSync(inventoryCsvFile, "utf8").split(/\r?\n/);
    const updated = lines.map(line => {
      if (!line.trim()) return line;
      const result = results.find(item => line.includes(`,${item.folder},`));
      if (!result) return line;
      const parts = line.split(",");
      parts[4] = publicVersion;
      parts[5] = status;
      parts[6] = String(result.modules);
      parts[7] = String(result.lessons);
      parts[8] = String(result.questions);
      parts[9] = String(result.checklists);
      parts[10] = String(result.cases);
      return parts.join(",");
    });
    fs.writeFileSync(inventoryCsvFile, updated.join("\n"), "utf8");
  }

  const portalCsvFile = path.join(root, "portal", "portal_publico_profesional_v0_6", "data", "courses_inventory.csv");
  if (fs.existsSync(portalCsvFile)) {
    const lines = fs.readFileSync(portalCsvFile, "utf8").split(/\r?\n/);
    const updated = lines.map(line => {
      if (!line.trim()) return line;
      const result = results.find(item => line.startsWith(`${item.folder},`));
      if (!result) return line;
      const course = portalCourses.find(item => item.id === result.folder);
      return `${result.folder},${course.title},${publicVersion},${status},${course.category},"${course.audience}",${course.path},true,true`;
    });
    fs.writeFileSync(portalCsvFile, updated.join("\n"), "utf8");
  }

  const inventoryMdFile = path.join(root, "inventario", "inventario_publico_profesional.md");
  if (fs.existsSync(inventoryMdFile)) {
    let md = fs.readFileSync(inventoryMdFile, "utf8");
    for (const result of results) {
      const pattern = new RegExp(`(\\| [^|]+ \\| [^|]+ \\| )[^|]+( \\| )[^|]+( \\| \`zips/${result.folder}\\.zip\` \\|)`, "g");
      md = md.replace(pattern, `$1${status}$2${publicVersion}$3`);
    }
    fs.writeFileSync(inventoryMdFile, md, "utf8");
  }
}

function updateRoadmap(results) {
  const file = path.join(root, "REESTRUCTURACION_PROFUNDA_CURSOS_2026_06_05.md");
  let text = fs.readFileSync(file, "utf8");
  const lines = results.map(item => `- ${item.title}: ${item.modules} modulos, ${item.lessons} lecciones, producto final: ${item.finalArtifact}.`).join("\n");
  const block = `## Cursos completos v1 incorporados\n\nEl 2026-06-05 se integraron los primeros cinco cursos reescritos que empiezan a cumplir la norma de curso completo:\n\n${lines}\n\nEstos cursos ya reemplazan la estructura templada anterior en sus JSON de curso y quedan marcados como \`${status}\` en portal e inventario.\n`;
  text = text.replace(/\n*## Cursos completos v1 incorporados[\s\S]*?Estos cursos ya reemplazan la estructura templada anterior en sus JSON de curso y quedan marcados como `Curso completo v1` en portal e inventario\.\s*$/m, "");
  text = `${text.trimEnd()}\n\n${block}`;
  fs.writeFileSync(file, text, "utf8");
}

function main() {
  ensureDir(repoSourceRoot);
  if (fs.existsSync(extractedRoot)) copyDir(extractedRoot, repoSourceRoot);

  const results = [];
  for (const input of courseInputs) {
    const sourceFile = path.join(repoSourceRoot, input.source);
    const markdown = fs.readFileSync(sourceFile, "utf8");
    const content = buildCourse(input, markdown);
    const activities = parseActivities(markdown);
    const parsedModules = parseModules(markdown);
    const checklists = buildChecklists(activities, parsedModules, input.finalArtifact, input.folder.replace(/_v0_6_publica$/, ""));
    const incidents = buildIncidents(parseCase(markdown), parseEvaluation(markdown), parseProduct(markdown), content.title, input.folder.replace(/_v0_6_publica$/, ""));
    const dataRoot = path.join(coursesRoot, input.folder, "src", "data");
    writeJson(path.join(dataRoot, "course_content.json"), content);
    writeJson(path.join(dataRoot, "checklists.json"), checklists);
    writeJson(path.join(dataRoot, "incidents.json"), incidents);
    patchCourseApp(input.folder);
    patchCourseStyles(input.folder);
    updateManifestFiles(input, content, checklists.checklists.length, incidents.incidents.length);
    const result = {
      ...input,
      title: content.title,
      modules: content.modules.length,
      lessons: content.modules.reduce((sum, module) => sum + module.lessons.length, 0),
      questions: content.modules.reduce((sum, module) => sum + module.quiz.length, 0),
      checklists: checklists.checklists.length,
      cases: incidents.incidents.length
    };
    results.push(result);
  }
  updatePortalAndInventory(results);
  updateRoadmap(results);
  console.log(JSON.stringify({ updatedCourses: results }, null, 2));
}

main();

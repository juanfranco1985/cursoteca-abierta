const MANIFEST_PATH = "src/data/course_manifest.json";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let catalogLab = null;
let documentationLab = null;
let governanceLab = null;
let catalogDraft = {};
let documentationDraft = {};
let governanceReportDraft = {};
let quizRuntime = { moduleId: null, answers: {} };
let deferredInstallPrompt = null;

const app = document.querySelector("#app");

function storageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:progress:v1`;
}

const emptyProgress = () => ({ lessons: [], quizzes: {}, checklistItems: [], visitedIncidents: [], updatedAt: null });


function uiStorageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:ui:v1`;
}

function readUiSettings() {
  try {
    return { fontScale: "normal", contrast: "normal", reducedMotion: false, ...(JSON.parse(localStorage.getItem(uiStorageKey())) || {}) };
  } catch {
    return { fontScale: "normal", contrast: "normal", reducedMotion: false };
  }
}

function writeUiSettings(next) {
  localStorage.setItem(uiStorageKey(), JSON.stringify(next));
  applyUiSettings(next);
}

function applyUiSettings(settings = readUiSettings()) {
  document.body.dataset.fontScale = settings.fontScale || "normal";
  document.body.dataset.contrast = settings.contrast || "normal";
  document.body.dataset.reducedMotion = settings.reducedMotion ? "true" : "false";
}

const storage = {
  read() {
    try {
      const raw = localStorage.getItem(storageKey());
      return raw ? { ...emptyProgress(), ...JSON.parse(raw) } : emptyProgress();
    } catch {
      return emptyProgress();
    }
  },
  write(next) {
    localStorage.setItem(storageKey(), JSON.stringify({ ...next, updatedAt: new Date().toISOString() }));
  },
  update(mutator) {
    const state = this.read();
    mutator(state);
    this.write(state);
    return state;
  },
  reset() { localStorage.removeItem(storageKey()); }
};

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function list(items = []) {
  if (!items.length) return "<p>No hay elementos cargados todavía.</p>";
  return `<ul>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function percent(done, total) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.json();
}

function routeTo(hash) { location.hash = hash; }

function applyManifestToShell() {
  document.title = `${manifest.appName} — Curso Web`;
  document.documentElement.style.setProperty("--accent", manifest.theme?.accent || "#27d7a1");
  document.documentElement.style.setProperty("--accent-2", manifest.theme?.accent2 || "#57a6ff");
  document.documentElement.style.setProperty("--danger", manifest.theme?.danger || "#fb7185");
  document.documentElement.style.setProperty("--warning", manifest.theme?.warning || "#fbbf24");
  document.querySelector("[data-brand-name]").textContent = manifest.shortName || manifest.appName;
  document.querySelector("[data-brand-subtitle]").textContent = manifest.subtitle || "Curso web";
  document.querySelector("[data-brand-mark]").textContent = initials(manifest.shortName || manifest.appName);
  document.querySelector("[data-footer-version]").textContent = "Cursoteca Abierta - Curso gratuito";
  document.querySelector("[data-nav-modules]").textContent = manifest.labels?.modules || "Módulos";
  document.querySelector("[data-nav-checklists]").textContent = manifest.labels?.checklists || "Checklists";
  document.querySelector("[data-nav-incidents]").textContent = manifest.labels?.incidents || "Casos";
  document.querySelector("[data-nav-emergency]").textContent = manifest.labels?.emergency || "Emergencia";
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 3).map(w => w[0]).join("").toUpperCase();
}


function updateConnectivityStatus() {
  const status = document.querySelector("#offlineStatus");
  if (!status) return;
  const online = navigator.onLine;
  status.textContent = online ? "Modo online" : "Modo offline";
  status.classList.toggle("is-offline", !online);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js");
      console.info("Service Worker registrado:", registration.scope);
    } catch (error) {
      console.warn("No se pudo registrar el Service Worker:", error.message);
    }
  });
}

function setupPwaEvents() {
  updateConnectivityStatus();
  window.addEventListener("online", updateConnectivityStatus);
  window.addEventListener("offline", updateConnectivityStatus);
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });
}

async function requestInstall() {
  const msg = document.querySelector("#installMsg");
  if (!deferredInstallPrompt) {
    if (msg) msg.textContent = "El navegador todavía no ofrece instalación. Probá desde Chrome/Edge, con servidor web y luego de una primera carga completa.";
    return;
  }
  deferredInstallPrompt.prompt();
  const result = await deferredInstallPrompt.userChoice;
  if (msg) msg.textContent = result.outcome === "accepted" ? "Instalación aceptada por el usuario." : "Instalación cancelada o pospuesta.";
  deferredInstallPrompt = null;
}

async function bootstrap() {
  try {
    manifest = await loadJson(MANIFEST_PATH);
    applyManifestToShell();
    applyUiSettings();
    setupPwaEvents();
    registerServiceWorker();
    const [courseData, checklistData, incidentData, catalogLabData, documentationLabData, governanceLabData] = await Promise.all([
      loadJson(manifest.dataPaths.course),
      loadJson(manifest.dataPaths.checklists),
      loadJson(manifest.dataPaths.incidents),
      manifest.dataPaths.catalogLab ? loadJson(manifest.dataPaths.catalogLab) : Promise.resolve(null),
      manifest.dataPaths.datasetDocumentation ? loadJson(manifest.dataPaths.datasetDocumentation) : Promise.resolve(null),
      manifest.dataPaths.governanceLab ? loadJson(manifest.dataPaths.governanceLab) : Promise.resolve(null),
    ]);
    course = courseData;
    checklists = checklistData.checklists || [];
    incidents = incidentData.incidents || [];
    catalogLab = catalogLabData || null;
    documentationLab = documentationLabData || null;
    governanceLab = governanceLabData || null;
    const validation = validateData();
    if (validation.errors.length) console.warn("Validación del curso:", validation.errors);
    window.addEventListener("hashchange", render);
    render();
  } catch (error) {
    app.innerHTML = `
      <section class="article">
        <div class="card danger-card">
          <p class="eyebrow">Error de carga</p>
          <h1>No se pudieron cargar los JSON locales</h1>
          <p>Este proyecto está preparado para ejecutarse con un servidor local. Abrilo desde VS Code con Live Server, o usá <code>python -m http.server</code> dentro de la carpeta del proyecto.</p>
          <p><strong>Detalle técnico:</strong> ${esc(error.message)}</p>
        </div>
      </section>`;
  }
}

function validateData() {
  const errors = [];
  if (!course?.modules?.length) errors.push("course_content.json no tiene módulos.");
  const lessonIds = new Set();
  for (const module of course.modules || []) {
    if (!module.id) errors.push("Hay un módulo sin id.");
    if (!module.lessons?.length) errors.push(`El módulo ${module.id} no tiene lecciones.`);
    for (const lesson of module.lessons || []) {
      if (!lesson.id) errors.push(`Hay una lección sin id en ${module.id}.`);
      if (lessonIds.has(lesson.id)) errors.push(`ID de lección duplicado: ${lesson.id}`);
      lessonIds.add(lesson.id);
    }
    for (const q of module.quiz || []) {
      if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`Pregunta ${q.id} sin opciones suficientes.`);
      if (q.correctAnswerIndex < 0 || q.correctAnswerIndex >= (q.options || []).length) errors.push(`Pregunta ${q.id} tiene correctAnswerIndex inválido.`);
    }
  }
  return { errors };
}

function getAllLessons() {
  return course.modules.flatMap(module => module.lessons.map(lesson => ({ ...lesson, moduleId: module.id, moduleTitle: module.title })));
}

function getModule(moduleId) { return course.modules.find(module => module.id === moduleId); }
function getLesson(moduleId, lessonId) { return getModule(moduleId)?.lessons.find(lesson => lesson.id === lessonId); }
function getChecklist(id) { return checklists.find(item => item.id === id); }
function getIncident(id) { return incidents.find(item => item.id === id); }
function getCatalogDataset(id) { return (catalogLab?.datasets || []).find(item => item.id === id); }
function getCatalogSearchScenario(id) { return (catalogLab?.searchScenarios || []).find(item => item.id === id); }
function getDocScenario(id) { return (documentationLab?.scenarios || []).find(item => item.id === id); }
function getLineageScenario(id) { return (governanceLab?.lineageScenarios || []).find(item => item.id === id); }
function getImpactScenario(id) { return (governanceLab?.impactScenarios || []).find(item => item.id === id); }

function completionStats() {
  const state = storage.read();
  const allLessons = getAllLessons();
  const totalQuiz = course.modules.length;
  const doneQuiz = Object.keys(state.quizzes || {}).length;
  const allChecklistItems = checklists.flatMap(c => c.items || []);
  const doneChecklist = allChecklistItems.filter(item => state.checklistItems.includes(item.id)).length;
  return {
    lessonsDone: allLessons.filter(l => state.lessons.includes(l.id)).length,
    lessonsTotal: allLessons.length,
    quizDone: doneQuiz,
    quizTotal: totalQuiz,
    checklistDone: doneChecklist,
    checklistTotal: allChecklistItems.length,
    incidentDone: (state.visitedIncidents || []).length,
    incidentTotal: incidents.length,
  };
}

function overallProgress() {
  const s = completionStats();
  return percent(s.lessonsDone + s.quizDone + s.checklistDone + s.incidentDone, s.lessonsTotal + s.quizTotal + s.checklistTotal + s.incidentTotal);
}

function quizPercent(score, total) {
  return total ? Math.round((score / total) * 100) : 0;
}

function getQuizRecord(moduleId) {
  return storage.read().quizzes?.[moduleId] || null;
}

function getQuizAverage() {
  const records = Object.values(storage.read().quizzes || {});
  if (!records.length) return 0;
  const total = records.reduce((sum, r) => sum + quizPercent(r.score || 0, r.total || 0), 0);
  return Math.round(total / records.length);
}

function getQuizAttemptsCount() {
  return Object.values(storage.read().quizzes || {}).reduce((sum, r) => sum + ((r.attempts || []).length || 1), 0);
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  try { return new Date(value).toLocaleString("es-AR"); } catch { return value; }
}

function nextPendingLesson() {
  const state = storage.read();
  return getAllLessons().find(lesson => !state.lessons.includes(lesson.id));
}

function renderProgressBar(value) {
  return `<div class="progress-bar" aria-label="Progreso ${value}%"><span style="width:${value}%"></span></div>`;
}

function render() {
  const hash = location.hash.replace(/^#\/?/, "") || "";
  const [page, p1, p2] = hash.split("/");
  const routes = {
    "": renderHome,
    "modules": renderModules,
    "module": () => renderModule(p1),
    "lesson": () => renderLesson(p1, p2),
    "quiz": () => renderQuiz(p1),
    "checklists": renderChecklists,
    "checklist": () => renderChecklist(p1),
    "incidents": renderIncidents,
    "incident": () => renderIncident(p1),
    "emergency": renderEmergency,
    "legal": renderLegal,
    "certificate": renderCertificate,
    "progress": renderProgressTools,
    "template": renderTemplateGuide,
    "accessibility": renderAccessibilityTools,
    "publish": renderPublishTools,
    "catalog-lab": renderCatalogLab,
    "catalog-dataset": () => renderCatalogDataset(p1),
    "catalog-search": renderCatalogSearch,
    "catalog-generator": renderCatalogGenerator,
    "catalog-report": renderCatalogReport,
    "dataset-documentation": renderDatasetDocumentation,
    "documentation-scenario": () => renderDocumentationScenario(p1),
    "documentation-generator": renderDocumentationGenerator,
    "documentation-report": renderDocumentationReport,
    "governance": renderGovernanceHome,
    "data-roles": renderDataRoles,
    "quality-dimensions": renderQualityDimensions,
    "lineage-impact": renderLineageImpact,
    "lineage-scenario": () => renderLineageScenario(p1),
    "change-impact": () => renderChangeImpact(p1),
    "certification-checklist": renderCertificationChecklist,
    "governance-report": renderGovernanceReport,
  };
  (routes[page] || renderNotFound)();
  app.focus({ preventScroll: true });
}

function renderHome() {
  const s = completionStats();
  const p = overallProgress();
  const next = nextPendingLesson();
  app.innerHTML = `
    <section class="hero">
      <div class="hero-card">
        <p class="eyebrow">${esc(manifest.subtitle || "Curso interactivo")}</p>
        <h1>${esc(manifest.appName || course.appName)}</h1>
        <p class="lead">${esc(manifest.description || "Curso interactivo para navegador.")}</p>
        <div class="actions">
          <a class="btn primary" href="${next ? `#/lesson/${next.moduleId}/${next.id}` : "#/modules"}">${next ? "Continuar donde quedé" : (manifest.labels?.primaryAction || "Empezar curso")}</a>
          <a class="btn danger" href="#/emergency">${esc(manifest.labels?.emergencyAction || "Estoy en una emergencia")}</a>
          <a class="btn ghost" href="#/progress">Gestionar progreso</a>
          <a class="btn ghost" href="#/catalog-lab">Abrir laboratorio de catálogo</a>
          <a class="btn ghost" href="#/dataset-documentation">Simular documentación</a>
          <a class="btn ghost" href="#/governance">Gobierno y calidad</a>
        </div>
      </div>
      <aside class="card">
        <p class="eyebrow">Progreso general</p>
        <h2>${p}%</h2>
        ${renderProgressBar(p)}
        <div class="stats-grid section">
          <div class="stat"><strong>${s.lessonsDone}/${s.lessonsTotal}</strong><span>Lecciones</span></div>
          <div class="stat"><strong>${s.quizDone}/${s.quizTotal}</strong><span>Quizzes · promedio ${getQuizAverage()}%</span></div>
          <div class="stat"><strong>${s.checklistDone}/${s.checklistTotal}</strong><span>Checklist</span></div>
          <div class="stat"><strong>${s.incidentDone}/${s.incidentTotal}</strong><span>Casos vistos</span></div>
        </div>
      </aside>
    </section>
    <section class="section">
      <div class="section-head">
        <div><p class="eyebrow">Ruta principal</p><h2>${esc(manifest.labels?.modules || "Módulos del curso")}</h2></div>
        <a class="btn ghost" href="#/modules">Ver todos</a>
      </div>
      <div class="grid modules">${course.modules.map(renderModuleCard).join("")}</div>
    </section>
    <section class="section grid two">
      <div class="card danger-card">
        <p class="eyebrow">Modo acción rápida</p>
        <h2>Practica guiada</h2>
        <p>Guía de primeros 5 minutos, primera hora y primeras 48 horas. No reemplaza canales oficiales, pero ordena qué hacer primero.</p>
        <a class="btn danger" href="#/emergency">Abrir modo emergencia</a>
      </div>
      <div class="card">
        <p class="eyebrow">Rumbo v0.6</p>
        <h2>Plantilla clonable</h2>
        <p>La identidad, rutas de datos, textos principales, colores, quizzes, constancia y accesibilidad básica ya salen de una arquitectura reutilizable.</p>
        <a class="btn ghost" href="#/template">Ver guía para clonar</a>
      </div>
    </section>
    <section class="section card compact-helper">
      <div>
        <p class="eyebrow">v0.4</p>
        <h2>Lectura cómoda en cualquier pantalla</h2>
        <p>Se agregó panel de accesibilidad, foco visible, objetivos táctiles más grandes y navegación de lecciones anterior/siguiente.</p>
      </div>
      <a class="btn ghost" href="#/accessibility">Abrir accesibilidad</a>
    </section>`;
}

function renderModuleCard(module) {
  const state = storage.read();
  const done = module.lessons.filter(l => state.lessons.includes(l.id)).length;
  const p = percent(done, module.lessons.length);
  return `
    <article class="card module-card">
      <div class="meta"><span class="pill">${esc(module.id.toUpperCase())}</span><span class="pill warn">${esc(module.commercialRisk || "Punto clave")}</span></div>
      <h3>${esc(module.title)}</h3>
      <p>${esc(module.description)}</p>
      ${renderProgressBar(p)}
      <p>${done}/${module.lessons.length} lecciones completadas</p>
      <div class="actions"><a class="btn primary" href="#/module/${module.id}">Entrar</a><a class="btn ghost" href="#/quiz/${module.id}">Quiz</a></div>
    </article>`;
}

function renderModules() {
  app.innerHTML = `
    <section class="section-head"><div><p class="eyebrow">Curso</p><h1>${esc(manifest.labels?.modules || "Módulos")}</h1><p>Avanzá por lecciones cortas, casos prácticos y evaluación rápida.</p></div></section>
    <input class="search-box" id="moduleSearch" placeholder="Buscar módulo: cobros, WhatsApp, bancos, fraude…" aria-label="Buscar módulo" />
    <section class="grid modules" id="moduleGrid"></section>`;
  const grid = document.querySelector("#moduleGrid");
  const search = document.querySelector("#moduleSearch");
  const paint = () => {
    const q = search.value.trim().toLowerCase();
    const filtered = course.modules.filter(module => `${module.title} ${module.description} ${module.commercialRisk || ""}`.toLowerCase().includes(q));
    grid.innerHTML = filtered.map(renderModuleCard).join("") || `<div class="card"><p>No encontré módulos con esa búsqueda.</p></div>`;
  };
  search.addEventListener("input", paint);
  paint();
}

function renderModule(moduleId) {
  const module = getModule(moduleId);
  if (!module) return renderNotFound();
  const state = storage.read();
  const done = module.lessons.filter(l => state.lessons.includes(l.id)).length;
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">${esc(module.id.toUpperCase())}</p>
        <h1>${esc(module.title)}</h1>
        <p class="lead">${esc(module.description)}</p>
        <div class="pill-row"><span class="pill warn">Riesgo: ${esc(module.commercialRisk || "No especificado")}</span><span class="pill">${module.lessons.length} lecciones</span><span class="pill">${module.quiz?.length || 0} preguntas</span><span class="pill ok">${done}/${module.lessons.length} completadas</span></div>
        ${renderProgressBar(percent(done, module.lessons.length))}
      </div>
      <div class="card">
        <h2>Lecciones</h2>
        <div class="list section">
          ${module.lessons.map(lesson => `
            <a class="list-row ${state.lessons.includes(lesson.id) ? "done" : ""}" href="#/lesson/${module.id}/${lesson.id}">
              <span><strong>${esc(lesson.title)}</strong><br><small>${esc(lesson.keyIdea || lesson.shortTheory || "Lección del curso")}</small></span>
              <span class="pill ${state.lessons.includes(lesson.id) ? "ok" : ""}">${state.lessons.includes(lesson.id) ? "Completada" : "Leer"}</span>
            </a>`).join("")}
        </div>
        <div class="actions"><button class="btn ghost" id="completeModule">Marcar módulo completo</button><a class="btn primary" href="#/quiz/${module.id}">Hacer quiz del módulo</a><a class="btn ghost" href="#/modules">Volver</a></div>
      </div>
    </section>`;
  document.querySelector("#completeModule").addEventListener("click", () => {
    storage.update(state => {
      state.lessons = [...new Set([...(state.lessons || []), ...module.lessons.map(l => l.id)])];
    });
    renderModule(moduleId);
  });
}

function lessonNavigation(moduleId, lessonId) {
  const lessons = getAllLessons();
  const index = lessons.findIndex(l => l.moduleId === moduleId && l.id === lessonId);
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  return `
    <nav class="lesson-nav card" aria-label="Navegación de lecciones">
      ${prev ? `<a class="btn ghost" href="#/lesson/${prev.moduleId}/${prev.id}">← Anterior</a>` : `<span class="pill">Primera lección</span>`}
      <a class="btn ghost" href="#/module/${moduleId}">Índice del módulo</a>
      ${next ? `<a class="btn primary" href="#/lesson/${next.moduleId}/${next.id}">Siguiente →</a>` : `<a class="btn primary" href="#/quiz/${moduleId}">Ir al quiz →</a>`}
    </nav>`;
}

function renderLesson(moduleId, lessonId) {
  const module = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  if (!module || !lesson) return renderNotFound();
  const isDone = storage.read().lessons.includes(lesson.id);
  app.innerHTML = `
    <article class="article reading-flow">
      ${lessonNavigation(moduleId, lessonId)}
      <div class="card">
        <p class="eyebrow">${esc(module.title)}</p>
        <h1>${esc(lesson.title)}</h1>
        <p class="lead">${esc(lesson.keyIdea || "")}</p>
        <div class="actions">
          <button class="btn primary" id="completeLesson">${isDone ? "Marcar como pendiente" : "Marcar como completada"}</button>
          <a class="btn ghost" href="#/module/${module.id}">Volver al módulo</a>
        </div>
      </div>
      <div class="card reading-card"><h2>Teoría breve</h2><p>${esc(lesson.shortTheory || lesson.content || "")}</p></div>
      <div class="card reading-card"><h2>Ejemplo práctico</h2><p>${esc(lesson.practicalExample || "")}</p></div>
      <div class="card alert"><h2>Error común</h2><p>${esc(lesson.commonMistake || "")}</p></div>
      <div class="card reading-card"><h2>Qué hacer ahora</h2><p>${esc(lesson.whatToDoNow || lesson.recommendedAction || "")}</p></div>
      ${lesson.alert ? `<div class="card danger-card"><h2>Alerta</h2><p>${esc(lesson.alert)}</p></div>` : ""}
      <div class="card"><h2>Conceptos clave</h2>${list(lesson.keyPoints)}</div>
      <div class="card"><h2>Nota responsable</h2><p>${esc(lesson.responsibleNote || manifest.responsibleNotice || "Contenido educativo. No reemplaza asesoramiento profesional ni canales oficiales.")}</p></div>
      ${lessonNavigation(moduleId, lessonId)}
    </article>`;
  document.querySelector("#completeLesson").addEventListener("click", () => {
    storage.update(state => {
      state.lessons = state.lessons || [];
      state.lessons = state.lessons.includes(lesson.id)
        ? state.lessons.filter(id => id !== lesson.id)
        : [...state.lessons, lesson.id];
    });
    renderLesson(moduleId, lessonId);
  });
}

function renderQuiz(moduleId) {
  const module = getModule(moduleId);
  if (!module) return renderNotFound();
  const questions = module.quiz || [];
  const saved = getQuizRecord(module.id);
  const passing = manifest.quiz?.passingPercent || 70;
  if (quizRuntime.moduleId !== module.id) quizRuntime = { moduleId: module.id, answers: {} };
  const answeredCount = questions.filter(q => quizRuntime.answers[q.id] !== undefined).length;
  const currentScore = questions.reduce((score, q) => score + (quizRuntime.answers[q.id] === q.correctAnswerIndex ? 1 : 0), 0);
  const currentPercent = quizPercent(currentScore, questions.length);
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Evaluación v0.3</p>
        <h1>Quiz: ${esc(module.title)}</h1>
        <p class="lead">Respondé todas las preguntas. El resultado queda guardado en el progreso local y alimenta la constancia interna del curso.</p>
        <div class="pill-row">
          <span class="pill">${answeredCount}/${questions.length} respondidas</span>
          <span class="pill ${currentPercent >= passing ? "ok" : "warn"}">Resultado actual: ${currentPercent}%</span>
          <span class="pill">Aprobación orientativa: ${passing}%</span>
          ${saved ? `<span class="pill ok">Último guardado: ${saved.score}/${saved.total} · ${quizPercent(saved.score, saved.total)}%</span>` : `<span class="pill warn">Sin intento guardado</span>`}
        </div>
        ${renderProgressBar(percent(answeredCount, questions.length))}
      </div>
      ${saved ? renderQuizHistory(module.id, saved) : ""}
      ${questions.map((q, qi) => renderQuestion(q, qi)).join("")}
      <div class="card">
        <h2>Guardar evaluación</h2>
        <p>Para que el quiz cuente en tu progreso, guardá el resultado al finalizar. Podés repetirlo las veces que necesites.</p>
        <div class="actions">
          <button class="btn primary" id="finishQuiz">Guardar resultado</button>
          <button class="btn ghost" id="resetQuizRuntime">Reiniciar respuestas actuales</button>
          <a class="btn ghost" href="#/module/${module.id}">Volver al módulo</a>
        </div>
        <p id="quizResult"></p>
      </div>
    </section>`;
  document.querySelectorAll(".quiz-option[data-qid]").forEach(button => {
    button.addEventListener("click", () => {
      const qid = button.dataset.qid;
      const idx = Number(button.dataset.idx);
      quizRuntime.answers[qid] = idx;
      renderQuiz(moduleId);
    });
  });
  document.querySelector("#resetQuizRuntime").addEventListener("click", () => {
    quizRuntime = { moduleId: module.id, answers: {} };
    renderQuiz(moduleId);
  });
  document.querySelector("#finishQuiz").addEventListener("click", () => {
    if (answeredCount < questions.length) {
      document.querySelector("#quizResult").innerHTML = `<strong>Faltan respuestas:</strong> completá ${questions.length - answeredCount} pregunta(s) antes de guardar.`;
      return;
    }
    let score = 0;
    const answers = {};
    questions.forEach(q => {
      answers[q.id] = quizRuntime.answers[q.id];
      if (quizRuntime.answers[q.id] === q.correctAnswerIndex) score++;
    });
    const resultPercent = quizPercent(score, questions.length);
    const attempt = { score, total: questions.length, percent: resultPercent, answers, date: new Date().toISOString() };
    storage.update(state => {
      state.quizzes = state.quizzes || {};
      const previous = state.quizzes[module.id] || { attempts: [] };
      const attempts = [...(previous.attempts || []), attempt];
      const best = attempts.reduce((a, b) => (b.percent > a.percent ? b : a), attempts[0]);
      state.quizzes[module.id] = {
        score,
        total: questions.length,
        percent: resultPercent,
        date: attempt.date,
        bestScore: best.score,
        bestPercent: best.percent,
        bestDate: best.date,
        attempts,
      };
    });
    document.querySelector("#quizResult").innerHTML = `<strong>Resultado guardado:</strong> ${score}/${questions.length} · ${resultPercent}% · ${resultPercent >= passing ? "aprobación orientativa" : "conviene repasar y repetir"}.`;
  });
}

function renderQuizHistory(moduleId, saved) {
  const attempts = saved.attempts || [];
  const rows = attempts.slice(-3).reverse().map((a, idx) => `
    <tr>
      <td>${attempts.length - idx}</td>
      <td>${a.score}/${a.total}</td>
      <td>${a.percent ?? quizPercent(a.score, a.total)}%</td>
      <td>${esc(formatDate(a.date))}</td>
    </tr>`).join("");
  return `
    <div class="card quiz-history">
      <h2>Historial del módulo</h2>
      <div class="pill-row">
        <span class="pill ok">Mejor resultado: ${saved.bestScore ?? saved.score}/${saved.total} · ${saved.bestPercent ?? quizPercent(saved.score, saved.total)}%</span>
        <span class="pill">Intentos guardados: ${attempts.length || 1}</span>
      </div>
      ${rows ? `<div class="table-wrap"><table><thead><tr><th>Intento</th><th>Puntaje</th><th>%</th><th>Fecha</th></tr></thead><tbody>${rows}</tbody></table></div>` : ""}
    </div>`;
}

function renderQuestion(q, qi) {
  const selected = quizRuntime.answers[q.id];
  const answered = selected !== undefined;
  const selectedCorrect = answered && selected === q.correctAnswerIndex;
  return `
    <div class="card quiz-card">
      <p class="eyebrow">Pregunta ${qi + 1}</p>
      <h2>${esc(q.question)}</h2>
      ${(q.options || []).map((option, idx) => {
        const wasSelected = selected === idx;
        const className = answered && idx === q.correctAnswerIndex ? "correct" : (wasSelected ? "wrong" : "");
        const label = answered && idx === q.correctAnswerIndex ? " ✓" : (wasSelected ? " ✕" : "");
        return `<button class="quiz-option ${className}" data-qid="${esc(q.id)}" data-idx="${idx}">${esc(option)}${label}</button>`;
      }).join("")}
      ${answered ? `<div class="feedback ${selectedCorrect ? "ok-feedback" : "bad-feedback"}"><strong>${selectedCorrect ? "Bien elegido." : "Revisá esta respuesta."}</strong><br>${esc(q.feedback || "")}</div>` : `<p>Elegí una opción para ver feedback inmediato.</p>`}
    </div>`;
}

function renderChecklists() {
  const state = storage.read();
  app.innerHTML = `
    <section class="section-head"><div><p class="eyebrow">Autoauditoría</p><h1>${esc(manifest.labels?.checklists || "Checklists prácticos")}</h1><p>Marcá acciones reales del comercio. El avance queda guardado en este navegador.</p></div></section>
    <section class="grid two">
      ${checklists.map(c => {
        const done = (c.items || []).filter(i => state.checklistItems.includes(i.id)).length;
        const p = percent(done, c.items?.length || 0);
        return `<article class="card item-card"><span class="pill">${esc(c.commercialArea || "Área")}</span><h2>${esc(c.title)}</h2><p>${esc(c.description)}</p>${renderProgressBar(p)}<p>${done}/${c.items?.length || 0} ítems</p><a class="btn primary" href="#/checklist/${c.id}">Abrir checklist</a></article>`;
      }).join("")}
    </section>`;
}

function renderChecklist(id) {
  const checklist = getChecklist(id);
  if (!checklist) return renderNotFound();
  const state = storage.read();
  const done = (checklist.items || []).filter(i => state.checklistItems.includes(i.id)).length;
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Checklist</p><h1>${esc(checklist.title)}</h1><p>${esc(checklist.description)}</p>${renderProgressBar(percent(done, checklist.items?.length || 0))}<p><strong>${done}/${checklist.items?.length || 0}</strong> acciones marcadas.</p></div>
      <div class="card">
        ${(checklist.items || []).map(item => `
          <label class="check-item">
            <input type="checkbox" data-item="${esc(item.id)}" ${state.checklistItems.includes(item.id) ? "checked" : ""}>
            <span><strong>${esc(item.title)}</strong><br>${esc(item.explanation || "")}<br><em>${esc(item.recommendedAction || "")}</em></span>
          </label>`).join("")}
      </div>
      <div class="actions"><a class="btn ghost" href="#/checklists">Volver</a></div>
    </section>`;
  document.querySelectorAll("input[data-item]").forEach(input => input.addEventListener("change", () => {
    const itemId = input.dataset.item;
    storage.update(state => {
      state.checklistItems = state.checklistItems || [];
      state.checklistItems = input.checked
        ? [...new Set([...state.checklistItems, itemId])]
        : state.checklistItems.filter(id => id !== itemId);
    });
    renderChecklist(id);
  }));
}

function renderIncidents() {
  app.innerHTML = `
    <section class="section-head"><div><p class="eyebrow">Simulador de casos</p><h1>${esc(manifest.labels?.incidents || "Incidentes")}</h1><p>Guías de actuación para comprobantes falsos, presión de clientes, billeteras, redes y cuentas comerciales.</p></div></section>
    <input class="search-box" id="incidentSearch" placeholder="Buscar caso: comprobante, WhatsApp, Instagram, transferencia…" />
    <section class="grid two" id="incidentGrid"></section>`;
  const grid = document.querySelector("#incidentGrid");
  const search = document.querySelector("#incidentSearch");
  const paint = () => {
    const q = search.value.trim().toLowerCase();
    const filtered = incidents.filter(i => `${i.title} ${i.summary} ${i.severity}`.toLowerCase().includes(q));
    grid.innerHTML = filtered.map(i => `<article class="card item-card"><span class="pill danger">Severidad ${esc(i.severity)}</span><h2>${esc(i.title)}</h2><p>${esc(i.summary)}</p><a class="btn primary" href="#/incident/${i.id}">Abrir caso</a></article>`).join("") || `<div class="card"><p>No encontré casos con esa búsqueda.</p></div>`;
  };
  search.addEventListener("input", paint);
  paint();
}

function renderIncident(id) {
  const incident = getIncident(id);
  if (!incident) return renderNotFound();
  storage.update(state => { state.visitedIncidents = [...new Set([...(state.visitedIncidents || []), incident.id])]; });
  app.innerHTML = `
    <article class="article">
      <div class="card danger-card"><p class="eyebrow">Caso guiado · Severidad ${esc(incident.severity)}</p><h1>${esc(incident.title)}</h1><p class="lead">${esc(incident.summary || "")}</p></div>
      <div class="card"><h2>Objetivo inmediato</h2><p>${esc(incident.immediateGoal || "")}</p></div>
      <div class="card"><h2>Pasos recomendados</h2>${list(incident.steps)}</div>
      <div class="card"><h2>Evidencia a preservar</h2>${list(incident.evidenceToPreserve)}</div>
      <div class="card alert"><h2>Errores a evitar</h2>${list(incident.errorsToAvoid)}</div>
      <div class="card"><h2>Prevención posterior</h2>${list(incident.aftercare || incident.preventionAfterwards)}</div>
      ${renderDecision(incident)}
      <div class="actions"><a class="btn ghost" href="#/incidents">Volver a casos</a><a class="btn danger" href="#/emergency">Modo emergencia</a></div>
    </article>`;
}

function renderDecision(incident) {
  const d = incident.guidedDecision || incident.decision || null;
  if (!d) return "";
  const options = d.options || [];
  return `<div class="card"><h2>Decisión guiada</h2><p>${esc(d.question || "¿Qué harías primero?")}</p>${options.map(o => `<div class="quiz-option ${o.isCorrect ? "correct" : ""}"><strong>${esc(o.text || o.option || "Opción")}</strong><br>${esc(o.feedback || "")}</div>`).join("")}</div>`;
}

function renderEmergency() {
  app.innerHTML = `
    <section class="article">
      <div class="card danger-card"><p class="eyebrow">Modo emergencia</p><h1>Estoy en una emergencia digital comercial</h1><p class="lead">Esta guía ordena acciones urgentes. No garantiza recuperación ni reemplaza banco, billetera, plataforma, soporte técnico, denuncia o asesoramiento profesional.</p></div>
      <div class="card"><h2>Primeros 5 minutos</h2>${list(["Cortá la conversación con quien presiona o amenaza.", "No entregues mercadería si el pago no aparece en la app oficial.", "No compartas códigos, claves, capturas de seguridad ni tokens.", "No abras links enviados por el comprador o supuesto soporte.", "Guardá capturas de conversación, comprobantes y perfiles."])}</div>
      <div class="card"><h2>Primera hora</h2>${list(["Entrá manualmente a banco, billetera, correo y redes desde apps o sitios oficiales.", "Cambiá claves de correo principal, billetera y redes comerciales si hay sospecha de acceso.", "Cerrá sesiones desconocidas y activá doble factor.", "Contactá soporte oficial de banco, billetera o plataforma afectada.", "Avisá al equipo o familia que no respondan mensajes sospechosos del negocio."])}</div>
      <div class="card"><h2>Primeras 48 horas</h2>${list(["Ordená la evidencia por fecha y hora.", "Revisá movimientos, ventas, entregas y conversaciones relacionadas.", "Actualizá datos de recuperación y dispositivos autorizados.", "Reforzá protocolos de cobro y entrega.", "Consultá canales oficiales o asesoramiento profesional si corresponde."])}</div>
      <div class="card"><h2>Casos frecuentes</h2><div class="list">${incidents.slice(0,6).map(i => `<a class="list-row" href="#/incident/${i.id}"><span>${esc(i.title)}</span><span class="pill danger">${esc(i.severity)}</span></a>`).join("")}</div></div>
    </section>`;
}

function renderLegal() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Alcance y privacidad</p><h1>Contenido educativo</h1><p>${esc(manifest.responsibleNotice || "Este curso web es una herramienta educativa y preventiva.")}</p></div>
      <div class="card"><h2>Privacidad</h2>${list(["No tiene login.", "No envía progreso a servidores.", "No usa analíticas externas.", "No usa publicidad.", "El avance queda guardado en LocalStorage del navegador.", "Si borrás datos del navegador, podés perder el progreso local."])}</div>
      <div class="card"><h2>Límites responsables</h2><p>Las recomendaciones pueden reducir riesgos y ordenar la respuesta, pero no garantizan recuperación de cuentas, dinero, mercadería ni resolución de incidentes.</p></div>
    </section>`;
}

function renderCertificate() {
  const s = completionStats();
  const p = overallProgress();
  const quizAvg = getQuizAverage();
  const attempts = getQuizAttemptsCount();
  const minProgress = manifest.certificate?.minimumSuggestedProgress || 70;
  const minQuiz = manifest.certificate?.minimumSuggestedQuizAverage || 70;
  let level = "Comercio en formación";
  if (p >= 90 && quizAvg >= 80) level = "Comercio digital preventivo avanzado";
  else if (p >= 70 && quizAvg >= 70) level = "Comercio digital preventivo";
  else if (p >= 45) level = "Comercio atento en progreso";
  const certificateId = `${(manifest.courseId || "curso").slice(0, 12).toUpperCase()}-${String(p).padStart(3, "0")}-${String(quizAvg).padStart(3, "0")}`;
  const ready = p >= minProgress && quizAvg >= minQuiz;
  app.innerHTML = `
    <section class="article">
      <div class="certificate-card card">
        <p class="eyebrow">${esc(manifest.certificate?.title || manifest.labels?.certificate || "Constancia interna")}</p>
        <h1>${esc(level)}</h1>
        <p class="lead">${esc(manifest.appName || course.appName)}</p>
        <div class="certificate-seal">${p}%</div>
        <p><strong>Avance general:</strong> ${p}% · <strong>Promedio de quizzes:</strong> ${quizAvg}% · <strong>Intentos guardados:</strong> ${attempts}</p>
        <p><strong>ID interno:</strong> ${esc(certificateId)}</p>
        <p><strong>Fecha de emisión local:</strong> ${esc(formatDate(new Date().toISOString()))}</p>
        <p>${esc(manifest.certificate?.notOfficialNotice || "Esta constancia es educativa y no equivale a una certificación oficial.")}</p>
        ${ready ? `<p class="status-ok">Estado: constancia orientativa lista para mostrar o imprimir.</p>` : `<p class="status-warn">Estado: todavía conviene completar más lecciones y mejorar quizzes para una constancia más sólida.</p>`}
      </div>
      <div class="grid two section">
        <div class="stat"><strong>${s.lessonsDone}/${s.lessonsTotal}</strong><span>Lecciones completadas</span></div>
        <div class="stat"><strong>${s.quizDone}/${s.quizTotal}</strong><span>Quizzes realizados · promedio ${quizAvg}%</span></div>
        <div class="stat"><strong>${s.checklistDone}/${s.checklistTotal}</strong><span>Ítems checklist</span></div>
        <div class="stat"><strong>${s.incidentDone}/${s.incidentTotal}</strong><span>Casos revisados</span></div>
      </div>
      <div class="card section">
        <h2>Acciones</h2>
        <div class="actions"><button class="btn primary" id="printCertificate">Imprimir / guardar como PDF</button><a class="btn ghost" href="#/progress">Gestionar progreso local</a><a class="btn ghost" href="#/modules">Seguir estudiando</a></div>
      </div>
    </section>`;
  document.querySelector("#printCertificate").addEventListener("click", () => window.print());
}

function renderProgressTools() {
  const state = storage.read();
  const payload = JSON.stringify({ courseId: manifest.courseId, exportedAt: new Date().toISOString(), progress: state }, null, 2);
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Progreso local</p><h1>Exportar, importar o reiniciar avance</h1><p>El progreso vive en este navegador. Esta pantalla ayuda a respaldarlo o resetearlo durante pruebas.</p></div>
      <div class="card"><h2>Exportar progreso</h2><textarea class="textarea" id="progressPayload" readonly>${esc(payload)}</textarea><div class="actions"><button class="btn primary" id="copyProgress">Copiar progreso</button></div></div>
      <div class="card"><h2>Importar progreso</h2><textarea class="textarea" id="importPayload" placeholder="Pegá aquí un progreso exportado"></textarea><div class="actions"><button class="btn ghost" id="importProgress">Importar</button><button class="btn danger" id="resetProgress">Reiniciar progreso</button></div><p id="progressMsg"></p></div>
    </section>`;
  document.querySelector("#copyProgress").addEventListener("click", async () => {
    await navigator.clipboard?.writeText(payload);
    document.querySelector("#progressMsg").textContent = "Progreso copiado.";
  });
  document.querySelector("#importProgress").addEventListener("click", () => {
    try {
      const parsed = JSON.parse(document.querySelector("#importPayload").value);
      if (!parsed.progress) throw new Error("El JSON no contiene progress.");
      storage.write({ ...emptyProgress(), ...parsed.progress });
      document.querySelector("#progressMsg").textContent = "Progreso importado correctamente.";
    } catch (error) {
      document.querySelector("#progressMsg").textContent = `No se pudo importar: ${error.message}`;
    }
  });
  document.querySelector("#resetProgress").addEventListener("click", () => {
    if (confirm("¿Reiniciar el progreso guardado en este navegador?")) {
      storage.reset();
      renderProgressTools();
    }
  });
}

function renderTemplateGuide() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Arquitectura clonable</p><h1>Cómo crear otro curso rápido</h1><p>Esta v0.6 convierte el proyecto en una plantilla clonable oficial: el motor web queda separado del contenido, la identidad del curso vive en el manifest y los datos pedagógicos se reemplazan por JSON.</p></div>
      <div class="card"><h2>Regla principal</h2><p>Para una variante común no deberías tocar <code>src/app.js</code>. El cambio debe vivir en <code>course_manifest.json</code> y en los JSON de contenido.</p></div>
      <div class="card"><h2>Pasos de clonación</h2>${list(manifest.cloneNotes || [])}</div>
      <div class="card"><h2>Flujo recomendado</h2>${list(manifest.cloneKit?.recommendedCloneFlow || [])}</div>
      <div class="card"><h2>Archivos que cambian por curso</h2>${list(["src/data/course_manifest.json", "src/data/course_content.json", "src/data/checklists.json", "src/data/incidents.json o archivo equivalente manteniendo el path del manifest", "README.md", "manifest.webmanifest", "docs/ESTADO_ACTUAL_WEB.md"])} </div>
      <div class="card"><h2>Archivos que deberían mantenerse</h2>${list(["index.html", "styles.css", "src/app.js", "service-worker.js", "estructura de carpetas src/data, icons, docs y scripts", "lógica de localStorage y navegación hash"])} </div>
      <div class="card"><h2>Contrato mínimo de datos</h2>${list(["course_content.json debe tener modules y lessons", "cada módulo puede tener quizQuestions", "checklists.json debe tener checklists e items", "incidents.json debe tener incidents con pasos, evidencia, errores y prevención", "todos los ids deben ser únicos y estables"])}<div class="actions"><a class="btn primary" href="docs/CONTRATOS_JSON_TEMPLATE_V0_6.md" target="_blank" rel="noopener">Ver contrato JSON</a></div></div>
      <div class="card"><h2>Validación local</h2><p>Desde la raíz del proyecto, si tenés Node.js instalado, podés ejecutar:</p><pre><code>node scripts/validate-template.mjs</code></pre><p>El script revisa manifest, rutas, cantidad básica de datos e ids duplicados.</p></div>
    </section>`;
}

function renderAccessibilityTools() {
  const settings = readUiSettings();
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Accesibilidad v0.4</p>
        <h1>Opciones de lectura</h1>
        <p class="lead">Estos ajustes quedan guardados solo en este navegador y sirven para probar cómo se comportará cualquier curso clonado desde esta plantilla.</p>
      </div>
      <div class="card settings-card">
        <h2>Tamaño de texto</h2>
        <div class="segmented" role="group" aria-label="Tamaño de texto">
          <button class="btn ${settings.fontScale === "normal" ? "primary" : "ghost"}" data-font="normal">Normal</button>
          <button class="btn ${settings.fontScale === "large" ? "primary" : "ghost"}" data-font="large">Grande</button>
          <button class="btn ${settings.fontScale === "extra-large" ? "primary" : "ghost"}" data-font="extra-large">Extra grande</button>
        </div>
      </div>
      <div class="card settings-card">
        <h2>Contraste</h2>
        <div class="segmented" role="group" aria-label="Contraste">
          <button class="btn ${settings.contrast === "normal" ? "primary" : "ghost"}" data-contrast="normal">Normal</button>
          <button class="btn ${settings.contrast === "high" ? "primary" : "ghost"}" data-contrast="high">Alto contraste</button>
        </div>
      </div>
      <div class="card settings-card">
        <h2>Movimiento</h2>
        <label class="check-item"><input type="checkbox" id="reducedMotion" ${settings.reducedMotion ? "checked" : ""}><span><strong>Reducir animaciones y transiciones</strong><br>Recomendado para usuarios sensibles al movimiento o para dispositivos de bajo rendimiento.</span></label>
      </div>
      <div class="card">
        <h2>Prueba de lectura</h2>
        <p>Este bloque permite verificar legibilidad, contraste, espaciado, foco visible y tamaño táctil antes de clonar la plantilla a otros cursos.</p>
        <div class="actions"><a class="btn primary" href="#/modules">Probar módulos</a><a class="btn ghost" href="#/lesson/${course.modules[0].id}/${course.modules[0].lessons[0].id}">Probar una lección</a></div>
      </div>
    </section>`;
  document.querySelectorAll("[data-font]").forEach(button => {
    button.addEventListener("click", () => {
      writeUiSettings({ ...readUiSettings(), fontScale: button.dataset.font });
      renderAccessibilityTools();
    });
  });
  document.querySelectorAll("[data-contrast]").forEach(button => {
    button.addEventListener("click", () => {
      writeUiSettings({ ...readUiSettings(), contrast: button.dataset.contrast });
      renderAccessibilityTools();
    });
  });
  document.querySelector("#reducedMotion").addEventListener("change", event => {
    writeUiSettings({ ...readUiSettings(), reducedMotion: event.target.checked });
    renderAccessibilityTools();
  });
}


function renderPublishTools() {
  const swSupport = "serviceWorker" in navigator;
  const installSupport = "BeforeInstallPromptEvent" in window || deferredInstallPrompt;
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Publicación web v0.5</p>
        <h1>Preparación para publicar el curso</h1>
        <p class="lead">Esta versión agrega manifest web, Service Worker, caché offline básico, íconos y guía de publicación estática. El objetivo es poder subir el curso como sitio web y usarlo como base para cursos clonados.</p>
      </div>
      <div class="grid two">
        <article class="card">
          <h2>Estado PWA</h2>
          ${list([
            `Service Worker soportado: ${swSupport ? "sí" : "no"}`,
            `Estado de conexión: ${navigator.onLine ? "online" : "offline"}`,
            `Instalación visible: ${installSupport ? "posible o pendiente" : "depende del navegador"}`,
            `Cache name: ${manifest.webApp?.cacheName || "definido en service-worker.js"}`
          ])}
          <div class="actions"><button id="installApp" class="btn primary">Intentar instalar</button><a class="btn ghost" href="manifest.webmanifest" target="_blank" rel="noreferrer">Ver manifest</a></div>
          <p id="installMsg" class="muted"></p>
        </article>
        <article class="card">
          <h2>Publicación recomendada</h2>
          ${list(manifest.webApp?.publishTargets || ["GitHub Pages", "Netlify", "Vercel"])}
          <p class="muted">Subir siempre la carpeta completa, respetando rutas relativas. No cambiar la ubicación de <code>src/data</code> salvo que también se actualice <code>course_manifest.json</code>.</p>
        </article>
      </div>
      <div class="card">
        <h2>Checklist antes de publicar</h2>
        ${list([
          "Abrir con Live Server y verificar que carguen todos los JSON.",
          "Probar navegación completa: inicio, módulos, lecciones, quizzes, checklists, casos, emergencia, constancia, accesibilidad y publicación.",
          "Abrir DevTools > Application y verificar manifest + Service Worker.",
          "Probar una recarga offline después de una primera carga online.",
          "Confirmar que README, CHANGELOG y ESTADO_ACTUAL correspondan a la versión publicada.",
          "No incluir datos personales, claves privadas ni archivos innecesarios."
        ])}
      </div>
      <div class="card">
        <h2>Advertencia importante</h2>
        <p>El modo offline es básico: cachea la app y sus datos principales luego de una primera carga exitosa. No reemplaza una estrategia avanzada de sincronización, backend o actualización remota.</p>
      </div>
    </section>`;
  const installButton = document.querySelector("#installApp");
  if (installButton) installButton.addEventListener("click", requestInstall);
}


function catalogLabHistoryKey() {
  return `${storageKey()}:catalogLabHistory`;
}

function readCatalogHistory() {
  try { return JSON.parse(localStorage.getItem(catalogLabHistoryKey())) || []; } catch { return []; }
}

function writeCatalogHistory(items) {
  localStorage.setItem(catalogLabHistoryKey(), JSON.stringify(items.slice(-20)));
}

function saveCatalogHistory(entry) {
  const items = readCatalogHistory();
  items.push({ ...entry, date: new Date().toISOString() });
  writeCatalogHistory(items);
}

function datasetRiskPill(dataset) {
  const score = Number(dataset.qualityScore || 0);
  const cls = score >= 85 ? "ok" : score >= 70 ? "warn" : "danger";
  return `<span class="pill ${cls}">Calidad ${score}/100</span>`;
}

function renderCatalogLab() {
  if (!catalogLab) return renderNotFound();
  const datasets = catalogLab.datasets || [];
  const scenarios = catalogLab.searchScenarios || [];
  const history = readCatalogHistory();
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Laboratorio v0.2</p>
        <h1>Laboratorio de catálogo de datos simulado</h1>
        <p class="lead">Practicá cómo buscar datasets, leer fichas de catálogo, revisar metadatos, calidad, dueño, linaje y usos recomendados sin usar datos corporativos reales.</p>
        <div class="actions">
          <a class="btn primary" href="#/catalog-search">Practicar búsqueda</a>
          <a class="btn ghost" href="#/catalog-generator">Generar ficha de dataset</a>
          <a class="btn ghost" href="#/catalog-report">Ver historial</a>
        </div>
      </div>
      <div class="grid two">
        ${datasets.map(dataset => `
          <article class="card">
            <p class="eyebrow">${esc(dataset.domain)} · ${esc(dataset.certification)}</p>
            <h2>${esc(dataset.businessName)}</h2>
            <p>${esc(dataset.description)}</p>
            <div class="pill-row">${datasetRiskPill(dataset)}<span class="pill">Dueño: ${esc(dataset.owner)}</span><span class="pill">${esc(dataset.freshness)}</span></div>
            <div class="actions"><a class="btn primary" href="#/catalog-dataset/${dataset.id}">Abrir ficha</a></div>
          </article>`).join("")}
      </div>
      <div class="card">
        <h2>Escenarios de búsqueda</h2>
        <div class="list">
          ${scenarios.map(s => `<a class="list-row" href="#/catalog-search?scenario=${s.id}"><span><strong>${esc(s.title)}</strong><br><small>Búsqueda sugerida: ${esc(s.query)}</small></span><span class="pill">Practicar</span></a>`).join("")}
        </div>
      </div>
      <div class="card">
        <h2>Historial local no sensible</h2>
        <p>Se guardan solo resúmenes de práctica, no nombres reales de tablas ni datos corporativos.</p>
        ${history.length ? `<div class="list">${history.slice(-5).reverse().map(h => `<div class="list-row"><span><strong>${esc(h.type)}</strong><br><small>${esc(h.summary || "Práctica realizada")} · ${formatDate(h.date)}</small></span></div>`).join("")}</div>` : `<p class="muted">Todavía no hay prácticas registradas.</p>`}
      </div>
    </section>`;
}

function renderCatalogDataset(datasetId) {
  const dataset = getCatalogDataset(datasetId);
  if (!dataset) return renderNotFound();
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Ficha de catálogo</p>
        <h1>${esc(dataset.businessName)}</h1>
        <p class="lead">${esc(dataset.description)}</p>
        <div class="pill-row">
          <span class="pill">Técnico: ${esc(dataset.name)}</span>
          <span class="pill">Dominio: ${esc(dataset.domain)}</span>
          <span class="pill">Certificación: ${esc(dataset.certification)}</span>
          ${datasetRiskPill(dataset)}
        </div>
      </div>
      <div class="grid two">
        <div class="card"><h2>Responsabilidad</h2>${list([`Dueño: ${dataset.owner}`, `Steward: ${dataset.steward}`, `Sensibilidad: ${dataset.sensitivity}`, `Actualización: ${dataset.freshness}`])}</div>
        <div class="card"><h2>Uso recomendado</h2>${list(dataset.recommendedUse)}<h3>Evitar para</h3>${list(dataset.notRecommendedUse)}</div>
      </div>
      <div class="card"><h2>Columnas principales</h2><div class="table-wrap"><table><thead><tr><th>Columna</th><th>Tipo</th><th>Descripción</th><th>Calidad</th></tr></thead><tbody>${(dataset.columns || []).map(c => `<tr><td>${esc(c.name)}</td><td>${esc(c.type)}</td><td>${esc(c.description)}</td><td>${esc(c.quality)}</td></tr>`).join("")}</tbody></table></div></div>
      <div class="grid two">
        <div class="card"><h2>Términos de negocio</h2>${list(dataset.businessTerms)}</div>
        <div class="card"><h2>Términos técnicos</h2>${list(dataset.technicalTerms)}</div>
      </div>
      <div class="card"><h2>Linaje simplificado</h2><div class="timeline">${(dataset.lineage || []).map((step, idx) => `<div class="timeline-item"><span class="pill">${idx + 1}</span><strong>${esc(step)}</strong></div>`).join("")}</div></div>
      <div class="card"><h2>Preguntas frecuentes</h2>${list(dataset.commonQuestions)}<div class="actions"><button class="btn primary" id="saveDatasetPractice">Guardar práctica</button><button class="btn ghost" id="downloadDatasetReport">Descargar ficha .txt</button><a class="btn ghost" href="#/catalog-lab">Volver al laboratorio</a></div></div>
    </section>`;
  document.querySelector("#saveDatasetPractice").addEventListener("click", () => {
    saveCatalogHistory({ type: "Ficha revisada", summary: dataset.businessName, datasetId: dataset.id });
    alert("Práctica guardada en historial local.");
  });
  document.querySelector("#downloadDatasetReport").addEventListener("click", () => downloadText(`ficha_${dataset.id}.txt`, buildDatasetReport(dataset)));
}

function buildDatasetReport(dataset) {
  return [
    `Ficha de catálogo: ${dataset.businessName}`,
    `Nombre técnico: ${dataset.name}`,
    `Dominio: ${dataset.domain}`,
    `Dueño: ${dataset.owner}`,
    `Steward: ${dataset.steward}`,
    `Certificación: ${dataset.certification}`,
    `Calidad: ${dataset.qualityScore}/100`,
    `Actualización: ${dataset.freshness}`,
    `Sensibilidad: ${dataset.sensitivity}`,
    "",
    "Descripción:", dataset.description,
    "", "Uso recomendado:", ...(dataset.recommendedUse || []).map(x => `- ${x}`),
    "", "Evitar para:", ...(dataset.notRecommendedUse || []).map(x => `- ${x}`),
    "", "Linaje:", ...(dataset.lineage || []).map((x,i) => `${i+1}. ${x}`)
  ].join("\n");
}

function renderCatalogSearch() {
  if (!catalogLab) return renderNotFound();
  const params = new URLSearchParams((location.hash.split("?")[1] || ""));
  const scenario = getCatalogSearchScenario(params.get("scenario"));
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Búsqueda simulada</p>
        <h1>Encontrar el dataset correcto</h1>
        <p class="lead">Buscá por términos técnicos o de negocio. La práctica muestra cómo decidir si un dataset es confiable para una pregunta analítica.</p>
        <label><strong>Término de búsqueda</strong><input class="search-box" id="catalogQuery" value="${esc(scenario?.query || "")}" placeholder="Ej: ventas mensuales, cliente activo, stock disponible"></label>
      </div>
      <div id="catalogSearchResults" class="grid two"></div>
      ${scenario ? `<div class="card"><h2>Escenario sugerido</h2><p>${esc(scenario.title)}</p><p><strong>Dataset esperado:</strong> ${esc(scenario.expectedDatasetId)}</p><p>${esc(scenario.explanation)}</p></div>` : ""}
    </section>`;
  const input = document.querySelector("#catalogQuery");
  const results = document.querySelector("#catalogSearchResults");
  const paint = () => {
    const q = input.value.trim().toLowerCase();
    const filtered = (catalogLab.datasets || []).filter(d => !q || `${d.name} ${d.businessName} ${d.domain} ${d.description} ${(d.businessTerms||[]).join(" ")} ${(d.technicalTerms||[]).join(" ")}`.toLowerCase().includes(q));
    results.innerHTML = filtered.map(d => `<article class="card"><p class="eyebrow">${esc(d.domain)} · ${esc(d.certification)}</p><h2>${esc(d.businessName)}</h2><p>${esc(d.description)}</p><div class="pill-row">${datasetRiskPill(d)}<span class="pill">${esc(d.owner)}</span></div><div class="actions"><a class="btn primary" href="#/catalog-dataset/${d.id}">Abrir ficha</a><button class="btn ghost" data-select-dataset="${esc(d.id)}">Elegir para este caso</button></div></article>`).join("") || `<div class="card"><p>No se encontraron datasets simulados.</p></div>`;
    document.querySelectorAll("[data-select-dataset]").forEach(button => button.addEventListener("click", () => {
      const d = getCatalogDataset(button.dataset.selectDataset);
      saveCatalogHistory({ type: "Búsqueda de catálogo", summary: `Búsqueda: ${input.value || "sin término"} · elegido: ${d?.businessName || button.dataset.selectDataset}`, datasetId: button.dataset.selectDataset });
      alert("Selección guardada en historial local.");
    }));
  };
  input.addEventListener("input", paint);
  paint();
}

function renderCatalogGenerator() {
  if (!catalogLab) return renderNotFound();
  const fields = [
    ["businessName", "Nombre de negocio", "Ej: Ventas mensuales consolidadas"],
    ["technicalName", "Nombre técnico", "Ej: fact_sales_monthly"],
    ["domain", "Dominio", "Ej: Comercial"],
    ["owner", "Dueño", "Ej: Equipo Comercial BI"],
    ["steward", "Steward", "Ej: Data Steward Comercial"],
    ["description", "Descripción", "Qué contiene, para qué sirve y qué límites tiene"],
    ["quality", "Estado de calidad", "Alta, media, baja o en revisión"],
    ["lineage", "Linaje resumido", "Origen → transformación → dataset → dashboard"],
    ["recommendedUse", "Uso recomendado", "Para qué se puede usar"],
    ["limitations", "Limitaciones", "Para qué no conviene usarlo"]
  ];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Generador de ficha</p><h1>Documentar un dataset simulado</h1><p class="lead">Completá una ficha educativa. No ingreses nombres reales de tablas, personas, clientes, sistemas internos ni información confidencial.</p></div>
      <div class="grid two">
        <form class="card" id="catalogForm">
          ${fields.map(([id,label,placeholder]) => `<label><strong>${esc(label)}</strong><textarea id="${id}" rows="${id === "description" ? 4 : 2}" placeholder="${esc(placeholder)}">${esc(catalogDraft[id] || "")}</textarea></label>`).join("")}
          <div class="actions"><button class="btn primary" type="submit">Generar ficha</button><button class="btn ghost" type="button" id="clearCatalogDraft">Limpiar</button></div>
        </form>
        <div class="card" id="catalogGenerated"><h2>Vista previa</h2><p>Completá el formulario y generá la ficha.</p></div>
      </div>
    </section>`;
  const form = document.querySelector("#catalogForm");
  const preview = document.querySelector("#catalogGenerated");
  const collect = () => Object.fromEntries(fields.map(([id]) => [id, document.querySelector(`#${id}`).value.trim()]));
  const paint = (data) => {
    const report = buildGeneratedCatalogReport(data);
    preview.innerHTML = `<h2>Ficha generada</h2><pre class="code-block">${esc(report)}</pre><div class="actions"><button class="btn primary" id="saveGeneratedCatalog">Guardar práctica</button><button class="btn ghost" id="downloadGeneratedCatalog">Descargar .txt</button></div>`;
    document.querySelector("#saveGeneratedCatalog").addEventListener("click", () => { saveCatalogHistory({ type: "Ficha generada", summary: data.businessName || "Dataset simulado" }); alert("Ficha guardada en historial local."); });
    document.querySelector("#downloadGeneratedCatalog").addEventListener("click", () => downloadText("ficha_dataset_simulado.txt", report));
  };
  form.addEventListener("input", () => { catalogDraft = collect(); });
  form.addEventListener("submit", event => { event.preventDefault(); catalogDraft = collect(); paint(catalogDraft); });
  document.querySelector("#clearCatalogDraft").addEventListener("click", () => { catalogDraft = {}; renderCatalogGenerator(); });
}

function buildGeneratedCatalogReport(data) {
  return [
    "FICHA DE DATASET SIMULADO",
    `Nombre de negocio: ${data.businessName || "Pendiente"}`,
    `Nombre técnico: ${data.technicalName || "Pendiente"}`,
    `Dominio: ${data.domain || "Pendiente"}`,
    `Dueño: ${data.owner || "Pendiente"}`,
    `Steward: ${data.steward || "Pendiente"}`,
    `Calidad: ${data.quality || "Pendiente"}`,
    "",
    "Descripción:", data.description || "Pendiente",
    "", "Linaje:", data.lineage || "Pendiente",
    "", "Uso recomendado:", data.recommendedUse || "Pendiente",
    "", "Limitaciones:", data.limitations || "Pendiente",
    "", "Nota: ficha educativa. No usar como documentación oficial sin revisión del dueño/steward."
  ].join("\n");
}

function renderCatalogReport() {
  const history = readCatalogHistory();
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Reporte del laboratorio</p><h1>Historial de prácticas de catálogo</h1><p class="lead">Este historial guarda solo resúmenes educativos no sensibles.</p></div>
      <div class="card">
        <h2>Prácticas registradas</h2>
        ${history.length ? `<div class="list">${history.slice().reverse().map(h => `<div class="list-row"><span><strong>${esc(h.type)}</strong><br><small>${esc(h.summary || "Práctica")} · ${formatDate(h.date)}</small></span></div>`).join("")}</div>` : `<p>No hay prácticas registradas todavía.</p>`}
        <div class="actions"><button class="btn primary" id="downloadCatalogHistory">Descargar reporte .txt</button><button class="btn ghost" id="clearCatalogHistory">Limpiar historial</button><a class="btn ghost" href="#/catalog-lab">Volver</a></div>
      </div>
    </section>`;
  document.querySelector("#downloadCatalogHistory").addEventListener("click", () => {
    const text = ["REPORTE DE PRÁCTICAS - LABORATORIO DE CATÁLOGO", "", ...history.map(h => `- ${formatDate(h.date)} · ${h.type}: ${h.summary || "Práctica"}`)].join("\n");
    downloadText("reporte_laboratorio_catalogo.txt", text);
  });
  document.querySelector("#clearCatalogHistory").addEventListener("click", () => { localStorage.removeItem(catalogLabHistoryKey()); renderCatalogReport(); });
}


function documentationHistoryKey() {
  return `${storageKey()}:datasetDocumentationHistory`;
}

function readDocumentationHistory() {
  try { return JSON.parse(localStorage.getItem(documentationHistoryKey())) || []; } catch { return []; }
}

function saveDocumentationHistory(item) {
  const items = readDocumentationHistory();
  items.push({ ...item, date: new Date().toISOString() });
  localStorage.setItem(documentationHistoryKey(), JSON.stringify(items.slice(-30)));
}

function scoreDocumentation(data) {
  const rubric = documentationLab?.documentationRubric || [];
  const checks = {
    doc_name: Boolean((data.businessName || "").trim() && (data.technicalName || "").trim()),
    doc_purpose: Boolean((data.purpose || "").trim().length >= 40),
    doc_owner: Boolean((data.owner || "").trim() && (data.steward || "").trim()),
    doc_columns: Boolean((data.columns || "").trim().length >= 40),
    doc_quality: Boolean((data.quality || "").trim() && (data.freshness || "").trim()),
    doc_lineage: Boolean((data.lineage || "").trim().length >= 30),
    doc_usage: Boolean((data.recommendedUse || "").trim() && (data.limitations || "").trim())
  };
  const total = rubric.reduce((sum, item) => sum + (checks[item.id] ? item.weight : 0), 0);
  const band = (documentationLab?.qualityBands || []).find(b => total >= b.min) || { label: "Sin nivel", message: "Completá más campos para evaluar." };
  const missing = rubric.filter(item => !checks[item.id]);
  return { score: total, band, missing };
}

function renderDatasetDocumentation() {
  if (!documentationLab) return renderNotFound();
  const scenarios = documentationLab.scenarios || [];
  const templates = documentationLab.glossaryTemplates || [];
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Simulador v0.3</p>
        <h1>Documentación de datasets</h1>
        <p class="lead">Practicá cómo evaluar y mejorar la documentación de un dataset antes de usarlo en SQL, Power BI, Tableau o una herramienta de catálogo como Alation.</p>
        <div class="actions">
          <a class="btn primary" href="#/documentation-generator">Generar ficha propia</a>
          <a class="btn ghost" href="#/documentation-report">Ver historial</a>
          <a class="btn ghost" href="#/catalog-lab">Volver al catálogo</a>
        </div>
      </div>
      <div class="grid two">
        <div class="card"><h2>Escenarios de documentación</h2><div class="list">${scenarios.map(s => `<a class="list-row" href="#/documentation-scenario/${s.id}"><span><strong>${esc(s.title)}</strong><br><small>${esc(s.dataset)}</small></span><span class="pill">Practicar</span></a>`).join("")}</div></div>
        <div class="card"><h2>Plantillas incluidas</h2>${templates.map(t => `<div class="mini-card"><strong>${esc(t.title)}</strong>${list(t.fields)}</div>`).join("")}</div>
      </div>
      <div class="card"><h2>Rúbrica de calidad documental</h2><div class="grid two">${(documentationLab.documentationRubric || []).map(r => `<div class="mini-card"><strong>${esc(r.label)}</strong><p>${esc(r.hint)}</p><span class="pill">${r.weight} puntos</span></div>`).join("")}</div></div>
    </section>`;
}

function renderDocumentationScenario(id) {
  const scenario = getDocScenario(id);
  if (!scenario) return renderNotFound();
  const report = [
    `Escenario: ${scenario.title}`,
    `Dataset: ${scenario.dataset}`,
    "",
    "Contexto:", scenario.context,
    "",
    "Faltantes detectados:", ...(scenario.missing || []).map(x => `- ${x}`),
    "",
    "Secciones esperadas:", ...(scenario.expectedSections || []).map(x => `- ${x}`),
    "",
    "Mejora sugerida:", scenario.sampleImprovement
  ].join("\n");
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Escenario guiado</p><h1>${esc(scenario.title)}</h1><p class="lead">${esc(scenario.context)}</p></div>
      <div class="grid two">
        <div class="card"><h2>Faltantes detectados</h2>${list(scenario.missing)}</div>
        <div class="card"><h2>Secciones esperadas</h2>${list(scenario.expectedSections)}</div>
      </div>
      <div class="card"><h2>Mejora sugerida</h2><p>${esc(scenario.sampleImprovement)}</p><div class="actions"><button class="btn primary" id="saveDocScenario">Guardar práctica</button><button class="btn ghost" id="downloadDocScenario">Descargar .txt</button><a class="btn ghost" href="#/documentation-generator">Crear ficha</a></div></div>
    </section>`;
  document.querySelector("#saveDocScenario").addEventListener("click", () => { saveDocumentationHistory({ type: "Escenario documentado", summary: scenario.title, score: null }); alert("Práctica guardada en historial local."); });
  document.querySelector("#downloadDocScenario").addEventListener("click", () => downloadText(`escenario_documentacion_${scenario.id}.txt`, report));
}

function renderDocumentationGenerator() {
  if (!documentationLab) return renderNotFound();
  const fields = [
    ["businessName", "Nombre de negocio", "Ej: Ventas mensuales consolidadas"],
    ["technicalName", "Nombre técnico", "Ej: mart_sales_monthly"],
    ["purpose", "Propósito y pregunta de negocio", "Qué responde, quién lo usa y para qué decisión sirve"],
    ["owner", "Dueño del dato", "Área o rol responsable"],
    ["steward", "Data steward", "Rol que mantiene definición y calidad"],
    ["columns", "Columnas principales", "Nombre, significado, tipo, ejemplo y advertencias"],
    ["quality", "Calidad/certificación", "Certificado, en revisión, experimental, etc."],
    ["freshness", "Frescura", "Frecuencia de actualización y fecha esperada"],
    ["lineage", "Linaje", "Origen → transformación → dataset → reporte"],
    ["recommendedUse", "Usos recomendados", "Para qué decisiones o reportes conviene"],
    ["limitations", "Limitaciones", "Para qué no conviene usarlo"],
    ["glossaryTerms", "Glosario/diccionario", "Términos de negocio y columnas críticas"],
  ];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Generador + evaluador</p><h1>Crear ficha documental de dataset</h1><p class="lead">Completá una ficha simulada. El evaluador revisa completitud documental, no calidad real del dato. No ingreses datos corporativos reales.</p></div>
      <div class="grid two">
        <form class="card" id="documentationForm">
          ${fields.map(([id,label,placeholder]) => `<label><strong>${esc(label)}</strong><textarea id="${id}" rows="${["purpose","columns","lineage","glossaryTerms"].includes(id) ? 4 : 2}" placeholder="${esc(placeholder)}">${esc(documentationDraft[id] || "")}</textarea></label>`).join("")}
          <div class="actions"><button class="btn primary" type="submit">Evaluar ficha</button><button class="btn ghost" type="button" id="clearDocumentationDraft">Limpiar</button></div>
        </form>
        <div class="card" id="documentationResult"><h2>Resultado</h2><p>Completá la ficha para calcular calidad documental.</p></div>
      </div>
    </section>`;
  const form = document.querySelector("#documentationForm");
  const result = document.querySelector("#documentationResult");
  const collect = () => Object.fromEntries(fields.map(([id]) => [id, document.querySelector(`#${id}`).value.trim()]));
  const paint = (data) => {
    const assessment = scoreDocumentation(data);
    const report = buildDocumentationReport(data, assessment);
    result.innerHTML = `<h2>${assessment.score}/100 · ${esc(assessment.band.label)}</h2>${renderProgressBar(assessment.score)}<p>${esc(assessment.band.message)}</p>${assessment.missing.length ? `<h3>Secciones a mejorar</h3>${list(assessment.missing.map(m => `${m.label}: ${m.hint}`))}` : `<p><strong>La ficha está completa para una revisión inicial.</strong></p>`}<pre class="code-block">${esc(report)}</pre><div class="actions"><button class="btn primary" id="saveDocumentationPractice">Guardar práctica</button><button class="btn ghost" id="downloadDocumentationReport">Descargar .txt</button></div>`;
    document.querySelector("#saveDocumentationPractice").addEventListener("click", () => { saveDocumentationHistory({ type: "Ficha evaluada", summary: data.businessName || "Dataset simulado", score: assessment.score }); alert("Evaluación guardada en historial local."); });
    document.querySelector("#downloadDocumentationReport").addEventListener("click", () => downloadText("reporte_documentacion_dataset.txt", report));
  };
  form.addEventListener("input", () => { documentationDraft = collect(); });
  form.addEventListener("submit", event => { event.preventDefault(); documentationDraft = collect(); paint(documentationDraft); });
  document.querySelector("#clearDocumentationDraft").addEventListener("click", () => { documentationDraft = {}; renderDocumentationGenerator(); });
}

function buildDocumentationReport(data, assessment) {
  return [
    "REPORTE DE DOCUMENTACIÓN DE DATASET",
    `Puntaje documental: ${assessment.score}/100`,
    `Nivel: ${assessment.band.label}`,
    `Lectura: ${assessment.band.message}`,
    "",
    `Nombre de negocio: ${data.businessName || "Pendiente"}`,
    `Nombre técnico: ${data.technicalName || "Pendiente"}`,
    `Propósito: ${data.purpose || "Pendiente"}`,
    `Dueño: ${data.owner || "Pendiente"}`,
    `Steward: ${data.steward || "Pendiente"}`,
    "",
    "Columnas principales:", data.columns || "Pendiente",
    "",
    `Calidad/certificación: ${data.quality || "Pendiente"}`,
    `Frescura: ${data.freshness || "Pendiente"}`,
    "",
    "Linaje:", data.lineage || "Pendiente",
    "",
    "Usos recomendados:", data.recommendedUse || "Pendiente",
    "",
    "Limitaciones:", data.limitations || "Pendiente",
    "",
    "Glosario/diccionario:", data.glossaryTerms || "Pendiente",
    "",
    "Mejoras sugeridas:", ...(assessment.missing.length ? assessment.missing.map(m => `- ${m.label}: ${m.hint}`) : ["- Mantener revisión periódica con dueño/steward."]),
    "",
    "Nota: ejercicio educativo. No reemplaza gobierno de datos formal ni documentación corporativa oficial."
  ].join("\n");
}

function renderDocumentationReport() {
  const history = readDocumentationHistory();
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Historial v0.3</p><h1>Prácticas de documentación</h1><p class="lead">Historial local no sensible. Guarda solo resumen, tipo de práctica y puntaje educativo cuando corresponde.</p></div>
      <div class="card">
        <h2>Registros</h2>
        ${history.length ? `<div class="list">${history.slice().reverse().map(h => `<div class="list-row"><span><strong>${esc(h.type)}</strong><br><small>${esc(h.summary || "Práctica")} · ${h.score ?? "sin puntaje"} · ${formatDate(h.date)}</small></span></div>`).join("")}</div>` : `<p>No hay prácticas registradas todavía.</p>`}
        <div class="actions"><button class="btn primary" id="downloadDocumentationHistory">Descargar historial .txt</button><button class="btn ghost" id="clearDocumentationHistory">Limpiar historial</button><a class="btn ghost" href="#/dataset-documentation">Volver</a></div>
      </div>
    </section>`;
  document.querySelector("#downloadDocumentationHistory").addEventListener("click", () => {
    const text = ["HISTORIAL DE PRÁCTICAS DE DOCUMENTACIÓN", "", ...history.map(h => `- ${formatDate(h.date)} · ${h.type}: ${h.summary || "Práctica"} · Puntaje: ${h.score ?? "N/A"}`)].join("\n");
    downloadText("historial_documentacion_dataset.txt", text);
  });
  document.querySelector("#clearDocumentationHistory").addEventListener("click", () => { localStorage.removeItem(documentationHistoryKey()); renderDocumentationReport(); });
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


function governanceHistoryKey() {
  return `curso-web:${manifest?.courseId || "catalogo"}:governance-history:v1`;
}
function readGovernanceHistory() {
  try { return JSON.parse(localStorage.getItem(governanceHistoryKey())) || []; } catch { return []; }
}
function saveGovernanceHistory(item) {
  const items = readGovernanceHistory();
  items.push({ ...item, savedAt: new Date().toISOString() });
  localStorage.setItem(governanceHistoryKey(), JSON.stringify(items.slice(-30)));
}
function governanceTxt(title, lines = []) {
  return [title, "", ...lines].join("\n");
}

function renderGovernanceHome() {
  if (!governanceLab) return renderNotFound();
  app.innerHTML = `
    <section class="article">
      <div class="section-head"><div><p class="eyebrow">v0.4 · Gobierno de datos</p><h1>Gobierno, calidad, linaje y certificación</h1><p class="lead">Practicá cómo evaluar confianza, roles, impacto de cambios y certificación de datasets antes de usarlos en reportes o análisis.</p></div><a class="btn ghost" href="#/">Inicio</a></div>
      <div class="grid two">
        <a class="card lift" href="#/data-roles"><p class="eyebrow">Roles</p><h2>Owner, steward, consumer y analyst</h2><p>Entendé responsabilidades y errores frecuentes.</p></a>
        <a class="card lift" href="#/quality-dimensions"><p class="eyebrow">Calidad</p><h2>Dimensiones de calidad</h2><p>Completitud, frescura, unicidad y consistencia.</p></a>
        <a class="card lift" href="#/lineage-impact"><p class="eyebrow">Linaje</p><h2>Impacto de cambios</h2><p>Revisá rutas de datos y cambios en columnas.</p></a>
        <a class="card lift" href="#/certification-checklist"><p class="eyebrow">Certificación</p><h2>Checklist de dataset confiable</h2><p>Checklist imprimible para evaluar publicación/certificación.</p></a>
      </div>
      <div class="card section"><h2>Reporte de prácticas</h2><p>Consultá prácticas guardadas y exportá un resumen de gobierno de datos.</p><a class="btn primary" href="#/governance-report">Ver reporte</a></div>
    </section>`;
}

function renderDataRoles() {
  const roles = governanceLab?.roles || [];
  app.innerHTML = `
    <section class="article">
      <div class="section-head"><div><p class="eyebrow">Roles de gobierno</p><h1>Quién decide, cuida y usa los datos</h1></div><a class="btn ghost" href="#/governance">Volver</a></div>
      <div class="grid two">${roles.map(role => `
        <div class="card">
          <p class="eyebrow">${esc(role.name)}</p>
          <h2>${esc(role.plainName)}</h2>
          <p><strong>Responsabilidad:</strong> ${esc(role.responsibility)}</p>
          <p><strong>Error común:</strong> ${esc(role.commonMistake)}</p>
          <p><strong>Buena práctica:</strong> ${esc(role.goodPractice)}</p>
        </div>`).join("")}</div>
    </section>`;
}

function renderQualityDimensions() {
  const dims = governanceLab?.qualityDimensions || [];
  app.innerHTML = `
    <section class="article">
      <div class="section-head"><div><p class="eyebrow">Calidad del dato</p><h1>Dimensiones de calidad</h1><p class="lead">Un dataset confiable no solo existe: también debe ser entendible, actualizado, consistente y apto para el uso declarado.</p></div><a class="btn ghost" href="#/governance">Volver</a></div>
      <div class="grid two">${dims.map(dim => `
        <div class="card">
          <p class="eyebrow">${esc(dim.name)}</p>
          <h2>${esc(dim.question)}</h2>
          <p><strong>Riesgo:</strong> ${esc(dim.risk)}</p>
          <p><strong>Ejemplo:</strong> ${esc(dim.example)}</p>
          <p><strong>Control sugerido:</strong> ${esc(dim.suggestedControl)}</p>
        </div>`).join("")}</div>
    </section>`;
}

function renderLineageImpact() {
  const lineage = governanceLab?.lineageScenarios || [];
  const impacts = governanceLab?.impactScenarios || [];
  app.innerHTML = `
    <section class="article">
      <div class="section-head"><div><p class="eyebrow">Linaje e impacto</p><h1>Antes de cambiar datos, revisá consumidores y trazabilidad</h1></div><a class="btn ghost" href="#/governance">Volver</a></div>
      <div class="grid two">
        <div class="card"><h2>Escenarios de linaje</h2><div class="list">${lineage.map(s => `<a class="list-row" href="#/lineage-scenario/${s.id}"><span><strong>${esc(s.title)}</strong><br><small>${esc(s.context)}</small></span><span class="pill">Analizar</span></a>`).join("")}</div></div>
        <div class="card"><h2>Impacto de cambios</h2><div class="list">${impacts.map(s => `<a class="list-row" href="#/change-impact/${s.id}"><span><strong>${esc(s.title)}</strong><br><small>${esc(s.change)}</small></span><span class="pill">Evaluar</span></a>`).join("")}</div></div>
      </div>
    </section>`;
}

function renderLineageScenario(id) {
  const scenario = getLineageScenario(id);
  if (!scenario) return renderNotFound();
  const txt = governanceTxt(`Linaje — ${scenario.title}`, [
    `Contexto: ${scenario.context}`,
    `Ruta: ${(scenario.lineage || []).join(" -> ")}`,
    `Riesgo: ${scenario.risk}`,
    `Acción recomendada: ${scenario.recommendedAction}`
  ]);
  app.innerHTML = `
    <section class="article">
      <div class="section-head"><div><p class="eyebrow">Escenario de linaje</p><h1>${esc(scenario.title)}</h1></div><a class="btn ghost" href="#/lineage-impact">Volver</a></div>
      <div class="card"><h2>Contexto</h2><p>${esc(scenario.context)}</p></div>
      <div class="card"><h2>Linaje textual</h2><ol>${(scenario.lineage || []).map(step => `<li>${esc(step)}</li>`).join("")}</ol></div>
      <div class="grid two"><div class="card warning-card"><h2>Riesgo</h2><p>${esc(scenario.risk)}</p></div><div class="card"><h2>Acción recomendada</h2><p>${esc(scenario.recommendedAction)}</p></div></div>
      <div class="actions"><button class="btn primary" id="saveLineage">Guardar práctica</button><button class="btn ghost" id="downloadLineage">Descargar .txt</button></div>
    </section>`;
  document.querySelector("#saveLineage").addEventListener("click", () => { saveGovernanceHistory({ type: "linaje", title: scenario.title, summary: scenario.recommendedAction }); alert("Práctica de linaje guardada localmente."); });
  document.querySelector("#downloadLineage").addEventListener("click", () => downloadText(`linaje_${scenario.id}.txt`, txt));
}

function renderChangeImpact(id) {
  const scenario = getImpactScenario(id);
  if (!scenario) return renderNotFound();
  const txt = governanceTxt(`Impacto de cambio — ${scenario.title}`, [
    `Cambio: ${scenario.change}`,
    `Severidad: ${scenario.severity}`,
    `Activos afectados: ${(scenario.affectedAssets || []).join(", ")}`,
    "Proceso seguro:", ...(scenario.safeProcess || []).map((item, i) => `${i+1}. ${item}`)
  ]);
  app.innerHTML = `
    <section class="article">
      <div class="section-head"><div><p class="eyebrow">Impacto de cambios</p><h1>${esc(scenario.title)}</h1></div><a class="btn ghost" href="#/lineage-impact">Volver</a></div>
      <div class="card"><h2>Cambio propuesto</h2><p>${esc(scenario.change)}</p><span class="pill">Severidad: ${esc(scenario.severity)}</span></div>
      <div class="card"><h2>Activos afectados</h2>${list(scenario.affectedAssets)}</div>
      <div class="card"><h2>Proceso seguro</h2><ol>${(scenario.safeProcess || []).map(item => `<li>${esc(item)}</li>`).join("")}</ol></div>
      <div class="actions"><button class="btn primary" id="saveImpact">Guardar práctica</button><button class="btn ghost" id="downloadImpact">Descargar .txt</button></div>
    </section>`;
  document.querySelector("#saveImpact").addEventListener("click", () => { saveGovernanceHistory({ type: "impacto", title: scenario.title, summary: scenario.change }); alert("Práctica de impacto guardada localmente."); });
  document.querySelector("#downloadImpact").addEventListener("click", () => downloadText(`impacto_${scenario.id}.txt`, txt));
}

function renderCertificationChecklist() {
  const items = governanceLab?.certificationChecklist || [];
  const key = `curso-web:${manifest?.courseId}:certification-checklist:v1`;
  let selected = [];
  try { selected = JSON.parse(localStorage.getItem(key)) || []; } catch { selected = []; }
  const score = percent(selected.length, items.length);
  app.innerHTML = `
    <section class="article">
      <div class="section-head"><div><p class="eyebrow">Certificación educativa</p><h1>Checklist de dataset confiable</h1><p class="lead">No es certificación real de Alation ni de una empresa. Es una guía educativa para pensar si un dataset está listo para uso compartido.</p></div><a class="btn ghost" href="#/governance">Volver</a></div>
      <div class="card"><h2>Avance: ${score}%</h2>${renderProgressBar(score)}</div>
      <form class="card" id="certForm">${items.map(item => `<label class="check-row"><input type="checkbox" value="${esc(item.id)}" ${selected.includes(item.id) ? "checked" : ""}/><span>${esc(item.label)}</span></label>`).join("")}</form>
      <div class="actions"><button class="btn primary" id="saveCert">Guardar checklist</button><button class="btn ghost" id="printCert">Imprimir / PDF</button><button class="btn ghost" id="downloadCert">Descargar .txt</button></div>
    </section>`;
  const collect = () => Array.from(document.querySelectorAll('#certForm input:checked')).map(i => i.value);
  document.querySelector("#saveCert").addEventListener("click", () => { localStorage.setItem(key, JSON.stringify(collect())); saveGovernanceHistory({ type: "certificación", title: "Checklist de dataset confiable", summary: `${collect().length}/${items.length} ítems completados` }); renderCertificationChecklist(); });
  document.querySelector("#printCert").addEventListener("click", () => window.print());
  document.querySelector("#downloadCert").addEventListener("click", () => downloadText("checklist_certificacion_dataset.txt", governanceTxt("Checklist de certificación de dataset", items.map(item => `${collect().includes(item.id) ? "[x]" : "[ ]"} ${item.label}`))));
}

function renderGovernanceReport() {
  const history = readGovernanceHistory();
  const txt = governanceTxt("Reporte de prácticas de gobierno de datos", history.map(item => `- ${formatDate(item.savedAt)} · ${item.type}: ${item.title} — ${item.summary}`));
  app.innerHTML = `
    <section class="article">
      <div class="section-head"><div><p class="eyebrow">Reporte de gobierno</p><h1>Prácticas guardadas</h1></div><a class="btn ghost" href="#/governance">Volver</a></div>
      <div class="card"><h2>Historial local no sensible</h2>${history.length ? `<div class="list">${history.slice().reverse().map(item => `<div class="list-row"><span><strong>${esc(item.title)}</strong><br><small>${esc(item.type)} · ${formatDate(item.savedAt)} · ${esc(item.summary || "")}</small></span></div>`).join("")}</div>` : `<p>No hay prácticas guardadas todavía.</p>`}</div>
      <div class="actions"><button class="btn primary" id="downloadGovReport">Descargar reporte .txt</button><button class="btn ghost" id="clearGovHistory">Limpiar historial</button></div>
    </section>`;
  document.querySelector("#downloadGovReport").addEventListener("click", () => downloadText("reporte_gobierno_datos.txt", txt));
  document.querySelector("#clearGovHistory").addEventListener("click", () => { localStorage.removeItem(governanceHistoryKey()); renderGovernanceReport(); });
}

function renderNotFound() {
  app.innerHTML = `<section class="article"><div class="card"><h1>Ruta no encontrada</h1><p>La sección solicitada no existe o el contenido fue movido.</p><a class="btn primary" href="#/">Volver al inicio</a></div></section>`;
}

bootstrap();



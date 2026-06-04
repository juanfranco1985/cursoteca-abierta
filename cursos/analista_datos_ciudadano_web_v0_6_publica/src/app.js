const MANIFEST_PATH = "src/data/course_manifest.json";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let financialTools = null;
let tableLab = null;
let quizRuntime = { moduleId: null, answers: {} };
let deferredInstallPrompt = null;

const app = document.querySelector("#app");

function storageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:progress:v1`;
}

const emptyProgress = () => ({ lessons: [], quizzes: {}, checklistItems: [], visitedIncidents: [], updatedAt: null });

function toolsHistoryKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:tools-history:v1`;
}

function readToolsHistory() {
  try {
    return JSON.parse(localStorage.getItem(toolsHistoryKey())) || [];
  } catch {
    return [];
  }
}

function writeToolsHistory(items) {
  localStorage.setItem(toolsHistoryKey(), JSON.stringify(items.slice(0, 20)));
}

function recordToolHistory(kind, title, summary, notes = []) {
  const item = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: new Date().toISOString(),
    kind,
    title,
    summary,
    notes
  };
  writeToolsHistory([item, ...readToolsHistory()]);
  return item;
}

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
    const [courseData, checklistData, incidentData, financialToolsData, tableLabData] = await Promise.all([
      loadJson(manifest.dataPaths.course),
      loadJson(manifest.dataPaths.checklists),
      loadJson(manifest.dataPaths.incidents),
      manifest.dataPaths.financialTools ? loadJson(manifest.dataPaths.financialTools) : Promise.resolve(null),
      manifest.dataPaths.tableLab ? loadJson(manifest.dataPaths.tableLab) : Promise.resolve(null),
    ]);
    course = courseData;
    checklists = checklistData.checklists || [];
    incidents = incidentData.incidents || [];
    financialTools = financialToolsData;
    tableLab = tableLabData;
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
    "tools": renderFinancialTools,
    "table-lab": renderTableLab,
    "data-cleaning": renderDataCleaningGuide,
    "data-visuals": renderDataVisualsGuide,
    "guided-practice": renderGuidedPractice,
    "practice-summary": renderPracticeSummary,
    "analysis-history": renderAnalysisHistory,
    "budget": renderBudgetCalculator,
    "ant-expenses": renderAntExpensesCalculator,
    "installments": renderInstallmentComparator,
    "margin": renderMarginCalculator,
    "messages": renderFinancialMessages,
    "risk": renderFinancialRiskDiagnostic,
    "due-planner": renderDuePlanner,
    "export-results": renderExportResults,
    "print-risk": renderPrintableRiskDiagnostic,
    "special-checklists": renderSpecialFinancialChecklists,
    "history": renderCalculationHistory,
    "commerce-guide": renderCommerceGuide,
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
          <a class="btn ghost" href="#/tools">Herramientas de datos</a>
          <a class="btn ghost" href="#/table-lab">Laboratorio de tablas</a>
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
        <h2>Revisión rápida de una tabla</h2>
        <p>Guía para frenar conclusiones apresuradas, revisar calidad de datos, conservar la tabla original y definir una acción prudente.</p>
        <a class="btn danger" href="#/emergency">Abrir modo emergencia</a>
      </div>
      <div class="card">
        <p class="eyebrow">Laboratorio inicial</p>
        <h2>Herramientas de análisis ciudadano</h2>
        <p>Revisión de tabla, calidad de datos, comparación simple, ROI básico, mensajes de reporte y diagnóstico de confiabilidad.</p>
        <div class="actions"><a class="btn primary" href="#/table-lab">Abrir laboratorio</a><a class="btn ghost" href="#/tools">Ver herramientas</a><a class="btn ghost" href="#/risk">Diagnóstico de calidad</a></div>
      </div>
    </section>
    <section class="section card compact-helper">
      <div>
        <p class="eyebrow">v0.5 · Publicación</p>
        <h2>Candidato web para publicación</h2>
        <p>El curso ya cuenta con laboratorio guiado, historial local seguro, documentación pública, guías de publicación, capturas sugeridas, privacidad, aviso legal y checklist de salida.</p>
      </div>
      <a class="btn ghost" href="#/publish">Ver preparación web</a>
    </section>`;
}

function renderModuleCard(module) {
  const state = storage.read();
  const done = module.lessons.filter(l => state.lessons.includes(l.id)).length;
  const p = percent(done, module.lessons.length);
  return `
    <article class="card module-card">
      <div class="meta"><span class="pill">${esc(module.id.toUpperCase())}</span><span class="pill warn">${esc(module.commercialRisk || "Calidad de análisis")}</span></div>
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
    <input class="search-box" id="moduleSearch" placeholder="Buscar módulo: tablas, limpieza, métricas, ROI, reporte…" aria-label="Buscar módulo" />
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
        <div class="pill-row"><span class="pill warn">Calidad: ${esc(module.commercialRisk || "No especificado")}</span><span class="pill">${module.lessons.length} lecciones</span><span class="pill">${module.quiz?.length || 0} preguntas</span><span class="pill ok">${done}/${module.lessons.length} completadas</span></div>
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
    <section class="section-head"><div><p class="eyebrow">Autoauditoría</p><h1>${esc(manifest.labels?.checklists || "Checklists prácticos")}</h1><p>Marcá acciones reales de revisión, calidad y comunicación de datos. El avance queda guardado en este navegador.</p></div></section>
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
    <section class="section-head"><div><p class="eyebrow">Simulador de casos</p><h1>${esc(manifest.labels?.incidents || "Incidentes")}</h1><p>Misiones prácticas para analizar ventas, gastos, precios, publicaciones, stock, ROI, tablas sucias y reportes.</p></div></section>
    <input class="search-box" id="incidentSearch" placeholder="Buscar misión: ventas, gastos, precios, ROI, stock, reporte…" />
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
      <div class="card danger-card"><p class="eyebrow">Modo emergencia</p><h1>Necesito revisar una tabla o análisis urgente</h1><p class="lead">Esta guía ayuda a frenar conclusiones apresuradas, conservar la tabla original y revisar calidad antes de decidir. No reemplaza análisis profesional.</p></div>
      <div class="card"><h2>Primeros 5 minutos</h2>${list(["Frená la decisión si la tabla tiene errores visibles.", "Conservá una copia original antes de limpiar o modificar datos.", "No compartas datos personales, claves, documentos ni información sensible en reportes de práctica.", "No pegues tablas sensibles en herramientas externas sin anonimizar.", "Guardá fuente, fecha, criterios de limpieza y cambios realizados."])}</div>
      <div class="card"><h2>Primera hora</h2>${list(["Revisá columnas, tipos de datos, fechas y categorías.", "Buscá faltantes, duplicados y valores fuera de rango.", "Validá totales y cálculos con una segunda revisión.", "Escribí una conclusión prudente con límites claros.", "Compartí solo reportes sin datos sensibles y con contexto suficiente."])}</div>
      <div class="card"><h2>Primeras 48 horas</h2>${list(["Ordená evidencia, fuente y criterios usados.", "Revisá registros, categorías, métricas y visualizaciones relacionadas.", "Actualizá la tabla corregida y la bitácora de cambios.", "Reforzá rutina de carga y revisión de datos.", "Consultá asesoramiento profesional si el análisis se usará para decisiones importantes."])}</div>
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
  let level = "Analista ciudadano en formación";
  if (p >= 90 && quizAvg >= 80) level = "Analista ciudadano avanzado";
  else if (p >= 70 && quizAvg >= 70) level = "Analista ciudadano preventivo";
  else if (p >= 45) level = "Analista ciudadano en progreso";
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
        <p class="eyebrow">Accesibilidad v0.1</p>
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



function money(value) {
  const n = Number(value || 0);
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function readNumber(id) {
  const value = document.querySelector(id)?.value || "0";
  return Number(String(value).replace(",", ".")) || 0;
}

function renderNumberInput(id, label, placeholder = "0") {
  return `<label class="field"><span>${esc(label)}</span><input id="${esc(id)}" type="number" min="0" step="0.01" placeholder="${esc(placeholder)}" /></label>`;
}

function renderFinancialTools() {
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Herramientas educativas v0.1</p>
        <h1>Herramientas de datos digitales</h1>
        <p class="lead">Herramientas introductorias para revisar tablas, calcular métricas simples, preparar reportes y practicar decisiones con datos. Todo funciona sin login.</p>
        <p class="muted">No reemplazan análisis profesional. Son ayudas educativas para ordenar datos y detectar problemas de calidad.</p>
      </div>
      <div class="grid two">
        <article class="card strong-card"><p class="eyebrow">v0.4 · Laboratorio guiado</p><h2>Laboratorio de tablas guiado</h2><p>Cargá una tabla de ejemplo o CSV propio para revisar calidad, limpiar categorías, calcular columnas, ver rankings y generar un reporte completo con pasos más claros.</p><div class="actions"><a class="btn primary" href="#/table-lab">Abrir laboratorio</a><a class="btn ghost" href="#/guided-practice">Ver práctica guiada</a></div></article>
        <article class="card"><p class="eyebrow">v0.4 · Resumen</p><h2>Resumen de prácticas</h2><p>Revisá tu avance práctico local: reportes guardados, tipos de análisis realizados y próximos ejercicios recomendados.</p><a class="btn primary" href="#/practice-summary">Ver resumen</a></article>
        <article class="card"><p class="eyebrow">Limpieza asistida</p><h2>Categorías y duplicados</h2><p>Guía para corregir variantes de escritura, faltantes y registros repetidos sin romper la fuente original.</p><a class="btn primary" href="#/data-cleaning">Ver guía</a></article>
        <article class="card"><p class="eyebrow">Visualización</p><h2>Rankings y barras simples</h2><p>Aprendé a leer top 5, totales por categoría y barras educativas antes de hacer gráficos más complejos.</p><a class="btn primary" href="#/data-visuals">Ver guía</a></article>
        <article class="card"><p class="eyebrow">Tabla</p><h2>Tabla mensual</h2><p>Estimá registros, faltantes, duplicados y acciones pendientes.</p><a class="btn primary" href="#/budget">Abrir herramienta</a></article>
        <article class="card"><p class="eyebrow">Errores frecuentes</p><h2>Problemas de calidad</h2><p>Contá errores frecuentes y estimá impacto en el análisis.</p><a class="btn primary" href="#/ant-expenses">Revisar calidad</a></article>
        <article class="card"><p class="eyebrow">Comparación</p><h2>Comparación simple</h2><p>Compará dos escenarios o períodos con criterio simple.</p><a class="btn primary" href="#/installments">Comparar</a></article>
        <article class="card"><p class="eyebrow">Indicador</p><h2>ROI simple</h2><p>Calculá costo, resultado y retorno orientativo de una acción.</p><a class="btn primary" href="#/margin">Calcular ROI</a></article>
        <article class="card"><p class="eyebrow">Reporte</p><h2>Plantillas copiables</h2><p>Plantillas para pedir datos, comunicar hallazgos y aclarar límites.</p><a class="btn primary" href="#/messages">Ver mensajes</a></article>
        <article class="card danger-card"><p class="eyebrow">Calidad</p><h2>Diagnóstico de calidad de datos</h2><p>Respondé preguntas simples y obtené una prioridad de revisión.</p><a class="btn danger" href="#/risk">Iniciar revisión</a></article>
        <article class="card"><p class="eyebrow">Plan de análisis</p><h2>Planificador de tareas</h2><p>Ordená tareas, fechas y prioridades de un análisis simple.</p><a class="btn primary" href="#/due-planner">Planificar</a></article>
        <article class="card"><p class="eyebrow">Exportar</p><h2>Reporte en TXT</h2><p>Copiá o descargá un resumen educativo de hallazgos, métricas y límites.</p><a class="btn primary" href="#/export-results">Exportar</a></article>
        <article class="card"><p class="eyebrow">Historial opcional</p><h2>Historial local de análisis</h2><p>Guardá resúmenes generales sin datos personales ni información sensible.</p><a class="btn primary" href="#/history">Ver historial</a></article>
        <article class="card"><p class="eyebrow">Negocios</p><h2>Guía para pequeños negocios</h2><p>Rutina de registro, revisión, métricas y reporte semanal.</p><a class="btn primary" href="#/commerce-guide">Abrir guía</a></article>
        <article class="card"><p class="eyebrow">Checklists críticos</p><h2>Tabla sucia o reporte externo</h2><p>Dos guías rápidas para revisar datos antes de concluir.</p><a class="btn primary" href="#/special-checklists">Abrir checklists</a></article>
      </div>
    </section>`;
}


function parseCsv(text) {
  const lines = String(text || "").trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return { headers: [], rows: [] };
  const splitLine = (line) => line.split(",").map(value => value.trim());
  const headers = splitLine(lines[0]);
  const rows = lines.slice(1).map((line, index) => {
    const values = splitLine(line);
    const row = { __rowNumber: index + 2 };
    headers.forEach((header, i) => { row[header] = values[i] ?? ""; });
    return row;
  });
  return { headers, rows };
}

function normalizeCategory(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function analyzeTable(csvText) {
  const parsed = parseCsv(csvText);
  const { headers, rows } = parsed;
  const missing = [];
  const numericColumns = {};
  const categoryVariants = {};
  const duplicateMap = new Map();
  rows.forEach(row => {
    const signature = headers.map(h => String(row[h] || "").trim().toLowerCase()).join("|");
    duplicateMap.set(signature, [...(duplicateMap.get(signature) || []), row.__rowNumber]);
    headers.forEach(header => {
      const raw = String(row[header] ?? "").trim();
      if (!raw) missing.push({ row: row.__rowNumber, column: header });
      const n = Number(raw.replace(",", "."));
      if (raw && Number.isFinite(n)) {
        numericColumns[header] ||= [];
        numericColumns[header].push(n);
      }
      if (raw && !Number.isFinite(n) && raw.length <= 40) {
        const key = normalizeCategory(raw);
        if (key) {
          categoryVariants[header] ||= {};
          categoryVariants[header][key] ||= new Set();
          categoryVariants[header][key].add(raw);
        }
      }
    });
  });
  const duplicates = [...duplicateMap.entries()]
    .filter(([signature, nums]) => signature && nums.length > 1)
    .map(([_, nums]) => nums);
  const numericSummary = Object.entries(numericColumns).map(([column, values]) => {
    const total = values.reduce((a,b)=>a+b,0);
    const avg = values.length ? total / values.length : 0;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const suspicious = values.filter(v => avg && v > avg * 3).length;
    return { column, count: values.length, total, avg, min, max, suspicious };
  });
  const inconsistentCategories = [];
  Object.entries(categoryVariants).forEach(([column, groups]) => {
    Object.entries(groups).forEach(([normalized, variants]) => {
      if (variants.size > 1) inconsistentCategories.push({ column, normalized, variants: [...variants] });
    });
  });
  const warnings = [];
  if (!headers.length) warnings.push("No se detectaron columnas. Pegá una tabla CSV con encabezados.");
  if (missing.length) warnings.push(`Hay ${missing.length} celdas vacías. Revisá si afectan columnas importantes.`);
  if (duplicates.length) warnings.push(`Hay ${duplicates.length} posible(s) duplicado(s) exactos.`);
  if (inconsistentCategories.length) warnings.push(`Hay ${inconsistentCategories.length} grupo(s) de categorías con variantes de escritura.`);
  const suspiciousTotals = numericSummary.filter(n => n.suspicious > 0);
  if (suspiciousTotals.length) warnings.push("Hay valores numéricos muy altos frente al promedio. Pueden ser datos extremos o errores de carga.");
  if (!warnings.length) warnings.push("No se detectaron problemas fuertes en esta revisión inicial. Igual documentá fuente, período y límites.");
  return { headers, rows, missing, duplicates, numericSummary, inconsistentCategories, warnings };
}

function renderDataPreview(headers, rows) {
  const sampleRows = rows.slice(0, 8);
  if (!headers.length) return `<p>No hay tabla para mostrar.</p>`;
  return `<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${sampleRows.map(row=>`<tr>${headers.map(h=>`<td>${esc(row[h])}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="muted">Vista previa: ${sampleRows.length} de ${rows.length} filas.</p>`;
}

function buildTableReport(analysis, question) {
  const lines = [];
  lines.push("Analista de Datos Ciudadano - Reporte de laboratorio de tablas");
  lines.push(`Fecha: ${formatDate(new Date().toISOString())}`);
  lines.push(`Pregunta analizada: ${question || "No indicada"}`);
  lines.push(`Filas: ${analysis.rows.length}`);
  lines.push(`Columnas: ${analysis.headers.length} (${analysis.headers.join(", ")})`);
  lines.push("");
  lines.push("Hallazgos de calidad:");
  analysis.warnings.forEach((w,i)=>lines.push(`${i+1}. ${w}`));
  lines.push("");
  lines.push("Métricas numéricas simples:");
  if (analysis.numericSummary.length) {
    analysis.numericSummary.forEach(n=>lines.push(`- ${n.column}: cantidad ${n.count}, total ${n.total.toFixed(2)}, promedio ${n.avg.toFixed(2)}, mínimo ${n.min}, máximo ${n.max}`));
  } else {
    lines.push("- No se detectaron columnas numéricas suficientes.");
  }
  lines.push("");
  lines.push("Límites:");
  lines.push("- Revisión educativa con reglas simples; no reemplaza análisis profesional.");
  lines.push("- La detección de duplicados es exacta y puede no encontrar duplicados parciales.");
  lines.push("- Las categorías se revisan por variantes de escritura simples.");
  lines.push("");
  lines.push("Próxima acción sugerida:");
  lines.push("Conservar copia original, corregir sobre una copia, documentar cambios y volver a calcular métricas.");
  return lines.join("\n");
}


function toNumber(value) {
  const raw = String(value ?? "").replace(/\./g, "").replace(",", ".").trim();
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function chooseColumn(headers, candidates) {
  const normalized = headers.map(h => ({ original: h, key: normalizeCategory(h) }));
  for (const candidate of candidates) {
    const key = normalizeCategory(candidate);
    const exact = normalized.find(h => h.key === key);
    if (exact) return exact.original;
    const partial = normalized.find(h => h.key.includes(key) || key.includes(h.key));
    if (partial) return partial.original;
  }
  return null;
}

function buildCategoryCleaningPlan(analysis) {
  const plan = [];
  analysis.inconsistentCategories.forEach(item => {
    const preferred = item.variants
      .slice()
      .sort((a,b) => b.length - a.length)[0];
    plan.push({
      column: item.column,
      variants: item.variants,
      suggested: preferred,
      action: `Unificar ${item.variants.join(" / ")} como "${preferred}".`
    });
  });
  analysis.duplicates.forEach(rows => {
    plan.push({
      column: "fila completa",
      variants: rows.map(r => `fila ${r}`),
      suggested: "conservar una sola fila si representa el mismo hecho",
      action: `Revisar duplicado exacto en filas ${rows.join(", ")}. No borrar sin confirmar fuente.`
    });
  });
  analysis.missing.slice(0, 8).forEach(cell => {
    plan.push({
      column: cell.column,
      variants: [`fila ${cell.row}`],
      suggested: "buscar fuente original o marcar como dato faltante",
      action: `Completar o documentar celda vacía en fila ${cell.row}, columna ${cell.column}.`
    });
  });
  return plan;
}

function buildCalculatedColumns(headers, rows) {
  const calculations = [];
  const cantidad = chooseColumn(headers, ["cantidad", "unidades", "ventas"]);
  const precio = chooseColumn(headers, ["precio", "importe", "monto"]);
  if (cantidad && precio) {
    const values = rows.map(row => {
      const qty = toNumber(row[cantidad]);
      const price = toNumber(row[precio]);
      return qty != null && price != null ? qty * price : null;
    }).filter(v => v != null);
    if (values.length) {
      calculations.push({
        name: `total_estimado = ${cantidad} × ${precio}`,
        count: values.length,
        total: values.reduce((a,b)=>a+b,0),
        avg: values.reduce((a,b)=>a+b,0) / values.length,
        example: values.slice(0,5)
      });
    }
  }
  const alcance = chooseColumn(headers, ["alcance", "vistas", "impresiones"]);
  const interacciones = chooseColumn(headers, ["interacciones", "likes", "clics", "clicks"]);
  if (alcance && interacciones) {
    const rates = rows.map(row => {
      const a = toNumber(row[alcance]);
      const i = toNumber(row[interacciones]);
      return a ? (i / a) * 100 : null;
    }).filter(v => v != null && Number.isFinite(v));
    if (rates.length) calculations.push({ name: `tasa_interaccion = ${interacciones} / ${alcance}`, count: rates.length, total: null, avg: rates.reduce((a,b)=>a+b,0)/rates.length, example: rates.slice(0,5).map(v=>`${v.toFixed(2)}%`) });
  }
  const consultas = chooseColumn(headers, ["consultas", "leads", "mensajes"]);
  const ventas = chooseColumn(headers, ["ventas", "conversiones"]);
  if (consultas && ventas) {
    const conv = rows.map(row => {
      const c = toNumber(row[consultas]);
      const v = toNumber(row[ventas]);
      return c ? (v / c) * 100 : null;
    }).filter(v => v != null && Number.isFinite(v));
    if (conv.length) calculations.push({ name: `conversion = ${ventas} / ${consultas}`, count: conv.length, total: null, avg: conv.reduce((a,b)=>a+b,0)/conv.length, example: conv.slice(0,5).map(v=>`${v.toFixed(2)}%`) });
  }
  const costo = chooseColumn(headers, ["costo", "inversion", "gasto"]);
  const resultado = chooseColumn(headers, ["resultado", "ganancia", "ingreso"]);
  if (costo && resultado) {
    const rois = rows.map(row => {
      const c = toNumber(row[costo]);
      const r = toNumber(row[resultado]);
      return c ? ((r - c) / c) * 100 : null;
    }).filter(v => v != null && Number.isFinite(v));
    if (rois.length) calculations.push({ name: `roi_simple = (${resultado} - ${costo}) / ${costo}`, count: rois.length, total: null, avg: rois.reduce((a,b)=>a+b,0)/rois.length, example: rois.slice(0,5).map(v=>`${v.toFixed(2)}%`) });
  }
  if (!calculations.length) calculations.push({ name: "Sin columna calculada sugerida", count: 0, total: null, avg: null, example: ["Agregá columnas como cantidad/precio, alcance/interacciones o costo/resultado para calcular indicadores."] });
  return calculations;
}

function buildTopRanking(headers, rows) {
  const categoryCol = chooseColumn(headers, ["producto", "categoria", "rubro", "publicacion", "canal"]);
  const numericCandidates = headers.filter(h => rows.some(row => toNumber(row[h]) != null));
  const valueCol = chooseColumn(numericCandidates, ["total", "monto", "precio", "ventas", "cantidad", "alcance", "interacciones"]) || numericCandidates[0];
  if (!categoryCol || !valueCol) return { categoryCol, valueCol, items: [] };
  const totals = new Map();
  rows.forEach(row => {
    const key = String(row[categoryCol] || "Sin categoría").trim() || "Sin categoría";
    const value = toNumber(row[valueCol]);
    if (value != null) totals.set(key, (totals.get(key) || 0) + value);
  });
  const items = [...totals.entries()].map(([label, value]) => ({ label, value })).sort((a,b)=>b.value-a.value).slice(0,5);
  return { categoryCol, valueCol, items };
}

function renderSimpleBarChart(ranking) {
  if (!ranking.items.length) return `<p>No se pudo generar ranking con las columnas disponibles.</p>`;
  const max = Math.max(...ranking.items.map(i=>i.value)) || 1;
  return `<div class="bar-list" role="img" aria-label="Ranking top 5 por ${esc(ranking.valueCol || "valor")}">${ranking.items.map(item => `<div class="bar-row"><span>${esc(item.label)}</span><div class="bar-track"><b style="width:${Math.max(4, Math.round((item.value/max)*100))}%"></b></div><strong>${Number(item.value).toFixed(2)}</strong></div>`).join("")}</div>`;
}

function buildAdvancedTableReport(analysis, question, cleaningPlan, calculations, ranking) {
  const base = buildTableReport(analysis, question);
  const lines = [base, "", "Limpieza asistida sugerida:"];
  if (cleaningPlan.length) cleaningPlan.slice(0,10).forEach((item,i)=>lines.push(`${i+1}. ${item.action}`));
  else lines.push("- No hay acciones de limpieza obvias. Revisar igualmente fuente y criterios.");
  lines.push("", "Columnas calculadas sugeridas:");
  calculations.forEach(calc => lines.push(`- ${calc.name}${calc.avg != null ? ` · promedio ${Number(calc.avg).toFixed(2)}` : ""}${calc.total != null ? ` · total ${Number(calc.total).toFixed(2)}` : ""}`));
  lines.push("", "Ranking top 5:");
  if (ranking.items.length) ranking.items.forEach((item,i)=>lines.push(`${i+1}. ${item.label}: ${Number(item.value).toFixed(2)} (${ranking.valueCol})`));
  else lines.push("- No se pudo generar ranking automático.");
  lines.push("", "Recomendación final:");
  const hasQuality = analysis.missing.length || analysis.duplicates.length || analysis.inconsistentCategories.length;
  lines.push(hasQuality ? "Primero corregir/calificar problemas de calidad y luego tomar decisiones con las métricas." : "El conjunto parece apto para una práctica inicial; documentar fuente, período y límites antes de comunicar conclusiones.");
  return lines.join("\n");
}


function buildGuidedReadingSteps(analysis, cleaningPlan, calculations, ranking) {
  const steps = [];
  steps.push(`Primero confirmá fuente y período: ${analysis.rows.length} filas y ${analysis.headers.length} columnas no dicen nada si no sabés de dónde salieron.`);
  steps.push(analysis.missing.length ? `Hay ${analysis.missing.length} celdas vacías: no las reemplaces sin revisar la fuente.` : "No hay faltantes fuertes detectados en esta revisión inicial.");
  steps.push(analysis.duplicates.length ? `Hay ${analysis.duplicates.length} duplicado(s) exactos: verificá si son errores o eventos reales repetidos.` : "No se detectaron duplicados exactos.");
  steps.push(cleaningPlan.length ? `Hay ${cleaningPlan.length} acción(es) sugeridas de limpieza: aplicalas sobre una copia, nunca sobre el único original.` : "No hay limpieza automática urgente, pero conviene revisar criterios manualmente.");
  steps.push(calculations.some(c => c.count > 0) ? "El laboratorio detectó columnas calculables: usalas como hipótesis inicial, no como verdad absoluta." : "No se detectaron columnas calculadas fuertes; probá con campos como cantidad/precio, alcance/interacciones o costo/resultado.");
  steps.push(ranking.items.length ? `El ranking top 5 usa ${ranking.valueCol} agrupado por ${ranking.categoryCol}: comunicá siempre esa regla.` : "No se generó ranking automático porque faltan columnas claras de categoría y valor.");
  steps.push("Cerrá el análisis con una recomendación responsable: hallazgo, límite y próxima acción concreta.");
  return steps;
}

function renderGuidedPractice() {
  const samples = tableLab?.sampleTables || [];
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">v0.4 · Práctica guiada</p>
        <h1>Guía paso a paso del laboratorio</h1>
        <p class="lead">Usá esta pantalla como recorrido de entrenamiento antes de analizar una tabla propia. Está pensada para celular y para personas que están empezando.</p>
        <div class="actions"><a class="btn primary" href="#/table-lab">Abrir laboratorio</a><a class="btn ghost" href="#/practice-summary">Ver resumen de prácticas</a></div>
      </div>
      <div class="guided-steps">
        <article class="card step-card"><span>1</span><h2>Elegí una muestra</h2><p>Empezá con una tabla pequeña y con problema visible. Recomendado: ${esc(samples[0]?.title || "Ventas de kiosco")}.</p></article>
        <article class="card step-card"><span>2</span><h2>Escribí una pregunta</h2><p>Ejemplo: “¿qué producto vende más?” o “¿hay datos que debo limpiar antes de decidir?”.</p></article>
        <article class="card step-card"><span>3</span><h2>Revisá calidad</h2><p>Buscá faltantes, duplicados, categorías mal escritas y valores demasiado altos.</p></article>
        <article class="card step-card"><span>4</span><h2>Calculá métricas</h2><p>No empieces por gráficos. Primero entendé totales, promedios, mínimos, máximos y columnas calculadas.</p></article>
        <article class="card step-card"><span>5</span><h2>Generá reporte</h2><p>El reporte debe decir fuente, hallazgo, límite y próxima acción. Evitá conclusiones absolutas.</p></article>
      </div>
      <div class="card print-friendly">
        <h2>Checklist imprimible de análisis ciudadano</h2>
        ${list(["Conservo una copia original de la tabla.", "Escribo una pregunta de análisis concreta.", "Reviso faltantes y duplicados antes de calcular.", "Unifico categorías solo si representan lo mismo.", "Anoto fuente, período y cambios realizados.", "Comunico hallazgos con límites y recomendación."])}
        <div class="actions no-print"><button class="btn primary" onclick="window.print()">Imprimir / guardar PDF</button></div>
      </div>
    </section>`;
}

function renderPracticeSummary() {
  const items = readToolsHistory();
  const labItems = items.filter(item => String(item.kind || "").includes("laboratorio") || String(item.kind || "").includes("datos") || String(item.kind || "").includes("riesgo"));
  const last = labItems[0];
  const qualityMentions = labItems.reduce((acc, item) => acc + (item.notes || []).filter(note => /faltante|duplicado|limpieza|categor/i.test(note)).length, 0);
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">v0.4 · Resumen visual</p>
        <h1>Resumen de prácticas de análisis</h1>
        <p class="lead">Panel local para ver tu actividad práctica sin guardar tablas completas ni datos sensibles.</p>
        <p class="muted">Se guardan solo resúmenes educativos generados por vos. Podés borrar el historial cuando quieras.</p>
      </div>
      <div class="stats-grid">
        <div class="stat"><strong>${labItems.length}</strong><span>Prácticas guardadas</span></div>
        <div class="stat"><strong>${qualityMentions}</strong><span>Alertas de calidad registradas</span></div>
        <div class="stat"><strong>${last ? new Date(last.date).toLocaleDateString() : "—"}</strong><span>Última práctica</span></div>
      </div>
      <div class="grid two">
        <article class="card"><h2>Próximo ejercicio recomendado</h2>${list(labItems.length < 1 ? ["Abrí el laboratorio y analizá Ventas de kiosco.", "Guardá un resumen local.", "Leé el reporte y detectá al menos un límite."] : labItems.length < 3 ? ["Probá otra tabla de ejemplo.", "Compará los problemas de calidad entre dos tablas.", "Exportá un reporte TXT."] : ["Pegá una tabla propia anonimizada.", "Prepará una recomendación responsable.", "Usá el resumen para explicar tu análisis a otra persona."])}</article>
        <article class="card"><h2>Buenas prácticas</h2>${list(["No guardar datos sensibles en el historial.", "No tomar decisiones reales con datos sin verificar.", "Separar hallazgo, interpretación y recomendación.", "Documentar cambios de limpieza."])}</article>
      </div>
      <div class="actions"><a class="btn primary" href="#/table-lab">Practicar ahora</a><a class="btn ghost" href="#/analysis-history">Ver historial</a><button class="btn danger" id="clearPracticeHistory">Borrar historial local</button></div>
    </section>`;
  const clear = document.querySelector("#clearPracticeHistory");
  if (clear) clear.addEventListener("click", () => { localStorage.removeItem(toolsHistoryKey()); renderPracticeSummary(); });
}

function renderAnalysisHistory() {
  renderCalculationHistory();
}


function renderDataCleaningGuide() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">v0.3 · Limpieza asistida</p><h1>Guía de limpieza de datos</h1><p class="lead">Antes de calcular métricas, conviene ordenar categorías, faltantes y duplicados. Esta guía resume el método aplicado por el laboratorio.</p></div>
      <div class="grid two">
        <article class="card"><h2>1. Conservar original</h2>${list(["Nunca limpies sobre el único archivo original.", "Duplicá la tabla y anotá fecha/fuente.", "Guardá qué cambiaste y por qué."])}</article>
        <article class="card"><h2>2. Normalizar categorías</h2>${list(["Elegí una forma estándar: Almacén, Bebidas, Servicios.", "Unificá mayúsculas, tildes y variantes.", "No mezcles categorías distintas solo porque se parecen."])}</article>
        <article class="card"><h2>3. Revisar faltantes</h2>${list(["Diferenciar dato realmente cero de dato desconocido.", "Buscar fuente antes de inventar valores.", "Marcar faltantes importantes en el reporte."])}</article>
        <article class="card"><h2>4. Duplicados</h2>${list(["Confirmar si son repetidos o eventos reales iguales.", "Revisar fecha, producto, monto y canal.", "Eliminar solo con criterio documentado."])}</article>
      </div>
      <div class="actions"><a class="btn primary" href="#/table-lab">Practicar en el laboratorio</a><a class="btn ghost" href="#/tools">Volver a herramientas</a></div>
    </section>`;
}

function renderDataVisualsGuide() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">v0.3 · Visualización básica</p><h1>Rankings y barras simples</h1><p class="lead">La primera visualización útil no tiene que ser compleja: un top 5 bien explicado suele ser suficiente para tomar una primera decisión.</p></div>
      <div class="grid two">
        <article class="card"><h2>Top 5</h2>${list(["Sirve para ver productos, rubros o publicaciones con mayor valor.", "Debe indicar qué métrica ordena el ranking.", "No prueba causalidad: solo muestra concentración."])}</article>
        <article class="card"><h2>Barras simples</h2>${list(["Comparan magnitudes de forma rápida.", "No conviene mezclar unidades distintas.", "Etiquetá período, fuente y unidad."])}</article>
        <article class="card"><h2>Hallazgo responsable</h2>${list(["Decí qué muestra el dato y qué no muestra.", "Aclarar faltantes, duplicados o categorías corregidas.", "Evitar conclusiones absolutas con muestras chicas."])}</article>
        <article class="card"><h2>Comunicación</h2>${list(["Usar una frase de hallazgo principal.", "Agregar recomendación concreta.", "Separar evidencia de opinión."])}</article>
      </div>
      <div class="actions"><a class="btn primary" href="#/table-lab">Generar ranking con una tabla</a><a class="btn ghost" href="#/tools">Volver a herramientas</a></div>
    </section>`;
}

function renderTableLab() {
  const samples = tableLab?.sampleTables || [];
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Laboratorio v0.4 · experiencia guiada</p>
        <h1>${esc(tableLab?.title || "Laboratorio de tablas")}</h1>
        <p class="lead">${esc(tableLab?.description || "Pegá una tabla CSV para revisar calidad y métricas simples.")}</p>
        <p class="muted">${esc(tableLab?.privacyNotice || "No pegues datos sensibles.")}</p>
      </div>
      <div class="card">
        <h2>1. Elegí una tabla de ejemplo o pegá CSV</h2>
        <div class="stepper" aria-label="Pasos del laboratorio"><span>1 · Fuente</span><span>2 · Pregunta</span><span>3 · Calidad</span><span>4 · Métricas</span><span>5 · Reporte</span></div>
        <label class="field"><span>Modo de práctica</span><select id="practiceMode"><option value="guided">Guiado paso a paso</option><option value="free">Libre</option></select></label>
        <label class="field"><span>Tabla de ejemplo</span><select id="sampleTable"><option value="">-- Elegir muestra --</option>${samples.map(s=>`<option value="${esc(s.id)}">${esc(s.title)}</option>`).join("")}</select></label>
        <label class="field"><span>Pregunta de análisis</span><input id="analysisQuestion" placeholder="Ej: ¿qué producto vendió más?, ¿hay problemas de carga?, ¿qué campaña funcionó mejor?" /></label>
        <label class="field"><span>CSV con encabezados</span><textarea id="csvInput" class="textarea" placeholder="fecha,producto,categoria,cantidad,precio\n2026-05-01,Yerba,Almacén,2,1800"></textarea></label>
        <div class="actions"><button class="btn primary" id="analyzeTableBtn">Analizar tabla</button><button class="btn ghost" id="clearTableBtn">Limpiar</button><a class="btn ghost" href="#/guided-practice">Guía paso a paso</a><a class="btn ghost" href="#/tools">Volver a herramientas</a></div>
      </div>
      <div class="card" id="tableLabResult"><h2>Resultado</h2><p>Cargá una tabla para ver diagnóstico, limpieza asistida, columnas calculadas, ranking top 5 y reporte completo.</p></div>
    </section>`;
  const select = document.querySelector("#sampleTable");
  const input = document.querySelector("#csvInput");
  const question = document.querySelector("#analysisQuestion");
  select.addEventListener("change", () => {
    const sample = samples.find(s => s.id === select.value);
    if (sample) {
      input.value = sample.csv;
      question.value = sample.description || "";
    }
  });
  document.querySelector("#clearTableBtn").addEventListener("click", () => renderTableLab());
  document.querySelector("#analyzeTableBtn").addEventListener("click", () => {
    const analysis = analyzeTable(input.value);
    const cleaningPlan = buildCategoryCleaningPlan(analysis);
    const calculations = buildCalculatedColumns(analysis.headers, analysis.rows);
    const ranking = buildTopRanking(analysis.headers, analysis.rows);
    const report = buildAdvancedTableReport(analysis, question.value.trim(), cleaningPlan, calculations, ranking);
    const result = document.querySelector("#tableLabResult");
    result.innerHTML = `
      <h2>Diagnóstico de tabla</h2>
      <div class="stats-grid section">
        <div class="stat"><strong>${analysis.rows.length}</strong><span>Filas</span></div>
        <div class="stat"><strong>${analysis.headers.length}</strong><span>Columnas</span></div>
        <div class="stat"><strong>${analysis.missing.length}</strong><span>Celdas vacías</span></div>
        <div class="stat"><strong>${analysis.duplicates.length}</strong><span>Duplicados exactos</span></div>
      </div>
      <div class="guided-panel">
        <h3>Lectura guiada del resultado</h3>
        ${list(buildGuidedReadingSteps(analysis, cleaningPlan, calculations, ranking))}
      </div>
      <h3>Alertas y hallazgos</h3>${list(analysis.warnings)}
      <h3>Métricas numéricas simples</h3>${analysis.numericSummary.length ? `<div class="grid two">${analysis.numericSummary.map(n=>`<article class="card mini-card"><h4>${esc(n.column)}</h4>${list([`Cantidad numérica: ${n.count}`, `Total: ${n.total.toFixed(2)}`, `Promedio: ${n.avg.toFixed(2)}`, `Mínimo: ${n.min}`, `Máximo: ${n.max}`, `Valores muy altos vs promedio: ${n.suspicious}`])}</article>`).join("")}</div>` : `<p>No se detectaron columnas numéricas.</p>`}
      <h3>Categorías inconsistentes</h3>${analysis.inconsistentCategories.length ? list(analysis.inconsistentCategories.map(c=>`${c.column}: ${c.variants.join(" / ")}`)) : `<p>No se detectaron variantes obvias de escritura.</p>`}
      <h3>Limpieza asistida sugerida</h3>${cleaningPlan.length ? `<div class="grid two">${cleaningPlan.slice(0,8).map(item=>`<article class="card mini-card"><h4>${esc(item.column)}</h4>${list([`Detectado: ${item.variants.join(" / ")}`, `Sugerencia: ${item.suggested}`, item.action])}</article>`).join("")}</div>` : `<p>No hay acciones automáticas fuertes. Revisá igual fuente, período y criterios.</p>`}
      <h3>Columnas calculadas simples</h3><div class="grid two">${calculations.map(calc=>`<article class="card mini-card"><h4>${esc(calc.name)}</h4>${list([`Registros útiles: ${calc.count}`, calc.total != null ? `Total: ${Number(calc.total).toFixed(2)}` : "Total: no aplica", calc.avg != null ? `Promedio: ${Number(calc.avg).toFixed(2)}` : "Promedio: no aplica", `Ejemplos: ${calc.example.join(", ")}`])}</article>`).join("")}</div>
      <h3>Ranking top 5 y barras educativas</h3><p class="muted">Ordenado por ${esc(ranking.valueCol || "columna numérica detectada")} agrupado por ${esc(ranking.categoryCol || "categoría detectada")}.</p>${renderSimpleBarChart(ranking)}
      <h3>Vista previa</h3>${renderDataPreview(analysis.headers, analysis.rows)}
      <h3>Reporte completo</h3><textarea class="textarea" id="tableReport" readonly>${esc(report)}</textarea>
      <div class="actions"><button class="btn primary" id="copyTableReport">Copiar reporte</button><button class="btn ghost" id="downloadTableReport">Descargar TXT</button><button class="btn ghost" id="saveTableHistory">Guardar resumen</button><button class="btn ghost" onclick="window.print()">Imprimir</button></div>`;
    document.querySelector("#copyTableReport").addEventListener("click", async () => { await navigator.clipboard?.writeText(report); document.querySelector("#copyTableReport").textContent = "Reporte copiado"; });
    document.querySelector("#downloadTableReport").addEventListener("click", () => downloadText("reporte-avanzado-laboratorio-tablas.txt", report));
    bindHistoryButton("#saveTableHistory", () => ({ kind: "laboratorio_tablas_v04", title: "Laboratorio de tablas guiado", summary: `${analysis.rows.length} filas · ${analysis.missing.length} vacíos · ${analysis.duplicates.length} duplicados · ${ranking.items.length} items en ranking`, notes: buildGuidedReadingSteps(analysis, cleaningPlan, calculations, ranking).slice(0,6) }));
  });
}

function renderBudgetCalculator() {
  const cats = financialTools?.budgetCategories || [];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Herramienta educativa</p><h1>Tabla mensual simple</h1><p>Ingresá montos aproximados. El cálculo queda solo en pantalla y no se guarda.</p></div>
      <div class="card form-grid">
        ${cats.map(c => renderNumberInput(`budget_${c.id}`, c.label)).join("")}
        <div class="actions"><button class="btn primary" id="calcBudget">Calcular</button><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="card" id="budgetResult"><h2>Resultado</h2><p>Completá los campos y presioná calcular.</p></div>
    </section>`;
  document.querySelector("#calcBudget").addEventListener("click", () => {
    const ingresos = readNumber("#budget_ingresos");
    const gastos = cats.filter(c => c.id !== "ingresos").reduce((sum,c)=>sum+readNumber(`#budget_${c.id}`),0);
    const saldo = ingresos - gastos;
    const ratio = ingresos ? Math.round((gastos / ingresos) * 100) : 0;
    const cls = saldo < 0 ? "danger" : ratio > 85 ? "warn" : "ok";
    const advice = saldo < 0 ? "Hay muchos problemas de calidad. Conviene limpiar la tabla antes de analizar." : ratio > 85 ? "Hay varios puntos a revisar. Priorizá faltantes, duplicados y categorías." : "La tabla parece manejable para práctica. Aun así, documentá límites.";
    document.querySelector("#budgetResult").innerHTML = `<h2>Resultado</h2>${list([`Ingresos: ${money(ingresos)}`, `Gastos estimados: ${money(gastos)}`, `Saldo estimado: ${money(saldo)}`, `Gastos sobre ingresos: ${ratio}%`])}<p class="pill ${cls}">${esc(advice)}</p><div class="actions"><button class="btn ghost" id="saveBudgetSummary">Guardar resumen</button><a class="btn ghost" href="#/history">Ver historial</a></div>`;
    bindHistoryButton("#saveBudgetSummary", () => ({ kind: "presupuesto", title: "Tabla mensual", summary: `Saldo ${money(saldo)} · gastos ${ratio}% de ingresos`, notes: [advice] }));
  });
}

function renderAntExpensesCalculator() {
  const items = financialTools?.antExpenses || [];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Herramienta educativa</p><h1>Problemas de calidad</h1><p>Estimá cuánto representan pequeños gastos repetidos durante un mes.</p></div>
      <div class="card form-grid">
        ${items.map(i => `<div class="tool-row"><label><span>${esc(i.label)} - monto promedio</span><input id="ant_${i.id}_amount" type="number" min="0" step="0.01" placeholder="0"></label><label><span>Veces por semana</span><input id="ant_${i.id}_freq" type="number" min="0" step="1" placeholder="0"></label></div>`).join("")}
        <div class="actions"><button class="btn primary" id="calcAnt">Calcular impacto mensual</button><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="card" id="antResult"><h2>Resultado</h2><p>Completá montos y frecuencias.</p></div>
    </section>`;
  document.querySelector("#calcAnt").addEventListener("click", () => {
    const rows = items.map(i => {
      const amount = readNumber(`#ant_${i.id}_amount`);
      const freq = readNumber(`#ant_${i.id}_freq`);
      return { label: i.label, monthly: amount * freq * 4.33 };
    });
    const total = rows.reduce((s,r)=>s+r.monthly,0);
    document.querySelector("#antResult").innerHTML = `<h2>Impacto mensual aproximado</h2>${list(rows.filter(r=>r.monthly>0).map(r=>`${r.label}: ${money(r.monthly)}`))}<p class="pill warn">Total estimado: ${money(total)}</p><p class="muted">El mes se estimó como 4,33 semanas. Es una aproximación educativa.</p><div class="actions"><button class="btn ghost" id="saveAntSummary">Guardar resumen</button><a class="btn ghost" href="#/history">Ver historial</a></div>`;
    bindHistoryButton("#saveAntSummary", () => ({ kind: "gastos_hormiga", title: "Problemas de calidad", summary: `Total mensual estimado ${money(total)}`, notes: rows.filter(r=>r.monthly>0).slice(0,5).map(r=>`${r.label}: ${money(r.monthly)}`) }));
  });
}

function renderInstallmentComparator() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Herramienta educativa</p><h1>Comparador simple de escenarios</h1><p>Compará dos valores o períodos. Es una ayuda educativa: no reemplaza análisis profesional.</p></div>
      <div class="card form-grid">
        ${renderNumberInput("cashPrice", "Precio contado")}
        ${renderNumberInput("installmentAmount", "Valor del escenario B")}
        ${renderNumberInput("installmentCount", "Cantidad o factor del escenario B")}
        <div class="actions"><button class="btn primary" id="calcInstallments">Comparar</button><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="card" id="installmentResult"><h2>Resultado</h2><p>Completá los datos de compra.</p></div>
    </section>`;
  document.querySelector("#calcInstallments").addEventListener("click", () => {
    const cash = readNumber("#cashPrice");
    const total = readNumber("#installmentAmount") * readNumber("#installmentCount");
    const diff = total - cash;
    const pct = cash ? Math.round((diff / cash) * 100) : 0;
    const advice = diff > 0 ? `El escenario B suma ${money(diff)} más que el escenario A (${pct}% de diferencia simple).` : diff < 0 ? `El escenario B queda ${money(Math.abs(diff))} por debajo del escenario A. Verificá supuestos, período y fuente de datos.` : "Ambos escenarios tienen el mismo total simple.";
    document.querySelector("#installmentResult").innerHTML = `<h2>Comparación simple</h2>${list([`Escenario A: ${money(cash)}`, `Escenario B total: ${money(total)}`, `Diferencia: ${money(diff)}`, `Diferencia porcentual simple: ${pct}%`])}<p class="pill warn">${esc(advice)}</p><div class="actions"><button class="btn ghost" id="saveInstallmentSummary">Guardar resumen</button><a class="btn ghost" href="#/history">Ver historial</a></div>`;
    bindHistoryButton("#saveInstallmentSummary", () => ({ kind: "cuotas", title: "Comparación de escenarios", summary: `Diferencia simple ${money(diff)} (${pct}%)`, notes: [advice] }));
  });
}

function renderMarginCalculator() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Herramienta educativa</p><h1>ROI simple para pequeños negocios</h1><p>Útil para estimar costo, precio, ganancia y margen bruto. No reemplaza cálculo contable ni impositivo.</p></div>
      <div class="card form-grid">
        ${renderNumberInput("unitCost", "Costo unitario del producto")}
        ${renderNumberInput("salePrice", "Precio de venta")}
        ${renderNumberInput("extraCost", "Costo extra por unidad: comisión, bolsa, envío subsidiado, etc.")}
        <div class="actions"><button class="btn primary" id="calcMargin">Calcular ROI</button><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="card" id="marginResult"><h2>Resultado</h2><p>Completá los datos.</p></div>
    </section>`;
  document.querySelector("#calcMargin").addEventListener("click", () => {
    const cost = readNumber("#unitCost") + readNumber("#extraCost");
    const price = readNumber("#salePrice");
    const profit = price - cost;
    const margin = price ? Math.round((profit / price) * 100) : 0;
    const markup = cost ? Math.round((profit / cost) * 100) : 0;
    const cls = profit <= 0 ? "danger" : margin < 15 ? "warn" : "ok";
    const advice = profit <= 0 ? "La operación no deja ganancia bruta. Revisá costo, comisiones o precio." : margin < 15 ? "El margen es bajo. Cuidado con comisiones, devoluciones, descuentos y costos no incluidos." : "El margen bruto parece saludable, pero faltan impuestos, pérdidas y gastos generales.";
    document.querySelector("#marginResult").innerHTML = `<h2>Margen estimado</h2>${list([`Costo total unitario: ${money(cost)}`, `Precio de venta: ${money(price)}`, `Ganancia bruta estimada: ${money(profit)}`, `Margen sobre venta: ${margin}%`, `Markup sobre costo: ${markup}%`])}<p class="pill ${cls}">${esc(advice)}</p><div class="actions"><button class="btn ghost" id="saveMarginSummary">Guardar resumen</button><a class="btn ghost" href="#/history">Ver historial</a></div>`;
    bindHistoryButton("#saveMarginSummary", () => ({ kind: "margen", title: "ROI simple", summary: `Margen ${margin}% · ganancia ${money(profit)}`, notes: [advice] }));
  });
}

function renderFinancialMessages() {
  const messages = financialTools?.messages || [];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Plantillas copiables</p><h1>Respuestas ante pagos dudosos</h1><p>Modelos de texto para responder con calma, no entregar productos por presión y derivar a canales oficiales.</p></div>
      <div class="grid">
        ${messages.map(m => `<article class="card"><p class="eyebrow">${esc(m.context)}</p><h2>${esc(m.title)}</h2><textarea class="textarea" readonly id="msg_${esc(m.id)}">${esc(m.body)}</textarea><button class="btn primary" data-copy-message="${esc(m.id)}">Copiar mensaje</button></article>`).join("")}
      </div>
    </section>`;
  document.querySelectorAll("[data-copy-message]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.copyMessage;
      const text = document.querySelector(`#msg_${CSS.escape(id)}`).value;
      await navigator.clipboard?.writeText(text);
      btn.textContent = "Copiado";
      setTimeout(()=>btn.textContent="Copiar mensaje",1200);
    });
  });
}

function renderFinancialRiskDiagnostic() {
  const questions = financialTools?.riskQuestions || [];
  const levels = financialTools?.riskLevels || [];
  app.innerHTML = `
    <section class="article">
      <div class="card danger-card"><p class="eyebrow">Diagnóstico de calidad</p><h1>Calidad de análisis digital</h1><p>Respondé sin datos personales. El resultado es orientativo y no se guarda automáticamente.</p></div>
      <div class="card" id="riskForm">
        ${questions.map((q, qi) => `<fieldset class="question-card"><legend><strong>${qi+1}. ${esc(q.question)}</strong></legend>${q.options.map((o, oi) => `<label class="check-item"><input type="radio" name="risk_${esc(q.id)}" value="${o.score}"><span>${esc(o.label)}</span></label>`).join("")}</fieldset>`).join("")}
        <div class="actions"><button class="btn danger" id="calcRisk">Ver prioridad</button><a class="btn ghost" href="#/tools">Volver</a><a class="btn ghost" href="#/emergency">Modo emergencia</a></div>
      </div>
      <div class="card" id="riskResult"><h2>Resultado</h2><p>Completá el diagnóstico para ver una prioridad de acción.</p></div>
    </section>`;
  document.querySelector("#calcRisk").addEventListener("click", () => {
    let score = 0;
    let answered = 0;
    for (const q of questions) {
      const selected = document.querySelector(`input[name="risk_${CSS.escape(q.id)}"]:checked`);
      if (selected) { score += Number(selected.value || 0); answered++; }
    }
    if (answered < questions.length) {
      document.querySelector("#riskResult").innerHTML = `<h2>Faltan respuestas</h2><p class="pill warn">Respondé todas las preguntas para obtener una prioridad más útil.</p>`;
      return;
    }
    const level = levels.find(l => score >= l.min && score <= l.max) || levels[levels.length - 1];
    const plan = [...(level?.advice || []), "Guardá capturas, fechas, montos, usuarios y números de reclamo.", "Usá siempre apps, sitios y teléfonos oficiales: no links enviados por desconocidos."];
    document.querySelector("#riskResult").innerHTML = `<h2>${esc(level.title)}</h2><p class="pill ${esc(level.className)}">Nivel: ${esc(level.level)} · Puntaje ${score}</p><h3>Plan inmediato</h3>${list(plan)}<div class="actions"><a class="btn danger" href="#/emergency">Abrir modo emergencia</a><a class="btn ghost" href="#/messages">Ver mensajes copiables</a><a class="btn ghost" href="#/print-risk">Versión imprimible</a><button class="btn ghost" id="copyRiskPlan">Copiar plan</button><button class="btn ghost" id="saveRiskSummary">Guardar resumen</button></div>`;
    bindHistoryButton("#saveRiskSummary", () => ({ kind: "riesgo", title: "Diagnóstico de calidad de datos", summary: `Nivel ${level.level} · puntaje ${score}`, notes: plan.slice(0,5) }));
    document.querySelector("#copyRiskPlan").addEventListener("click", async () => {
      await navigator.clipboard?.writeText(`Diagnóstico de calidad de datos: ${level.level} (${score}).\n` + plan.map((p,i)=>`${i+1}. ${p}`).join("\n"));
      document.querySelector("#copyRiskPlan").textContent = "Plan copiado";
    });
  });
}


function todayIso() {
  return new Date().toISOString().slice(0,10);
}

function daysUntil(dateString) {
  if (!dateString) return 9999;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(`${dateString}T00:00:00`);
  return Math.ceil((due - today) / 86400000);
}

function classifyDue(days) {
  const rules = financialTools?.duePlannerDefaults?.priorityRules || [];
  return rules.find(r => days <= r.daysMax) || { level: "Sin clasificar", className: "warn", advice: "Revisá manualmente este vencimiento." };
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function renderDuePlanner() {
  const categories = financialTools?.duePlannerDefaults?.categories || ["Pago", "Servicio", "Tarjeta", "Otro"];
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Herramienta educativa v0.4</p>
        <h1>Planificador simple de vencimientos y pagos</h1>
        <p class="lead">Cargá hasta 6 vencimientos para ordenar prioridades. Los datos quedan solo en esta pantalla hasta que exportes o limpies.</p>
        <p class="muted">No cargues datos personales, claves, documentos ni información sensible.</p>
      </div>
      <div class="card form-grid" id="duePlannerForm">
        ${Array.from({length:6}).map((_,i)=>`
          <div class="tool-row due-row">
            <label><span>Tarea ${i+1}</span><input id="due_name_${i}" type="text" placeholder="Ej: limpiar fechas, calcular métricas, revisar reporte"></label>
            <label><span>Categoría</span><select id="due_cat_${i}">${categories.map(c=>`<option>${esc(c)}</option>`).join("")}</select></label>
            <label><span>Métrica revisada estimado</span><input id="due_amount_${i}" type="number" min="0" step="0.01" placeholder="0"></label>
            <label><span>Vence</span><input id="due_date_${i}" type="date" min="${todayIso()}"></label>
          </div>`).join("")}
        <div class="actions"><button class="btn primary" id="calcDuePlanner">Ordenar vencimientos</button><button class="btn ghost" id="clearDuePlanner">Limpiar</button><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="card" id="duePlannerResult"><h2>Resultado</h2><p>Completá al menos un vencimiento y presioná ordenar.</p></div>
    </section>`;
  document.querySelector("#calcDuePlanner").addEventListener("click", () => {
    const rows = Array.from({length:6}).map((_,i)=>{
      const name = document.querySelector(`#due_name_${i}`).value.trim();
      const category = document.querySelector(`#due_cat_${i}`).value;
      const amount = readNumber(`#due_amount_${i}`);
      const date = document.querySelector(`#due_date_${i}`).value;
      const days = daysUntil(date);
      const cls = classifyDue(days);
      return name || amount || date ? { name: name || "Tarea sin nombre", category, amount, date, days, cls } : null;
    }).filter(Boolean).sort((a,b)=>a.days-b.days || b.amount-a.amount);
    if (!rows.length) {
      document.querySelector("#duePlannerResult").innerHTML = `<h2>Sin datos</h2><p class="pill warn">Cargá al menos un pago o vencimiento.</p>`;
      return;
    }
    const total = rows.reduce((sum,r)=>sum+r.amount,0);
    const lines = rows.map((r,idx)=>`${idx+1}. ${r.name} · ${r.category} · ${money(r.amount)} · vence ${r.date || "sin fecha"} · ${r.days < 0 ? "vencido" : r.days + " días"} · ${r.cls.level}`);
    const text = `Planificador de análisis - Analista de Datos Ciudadano\nGenerado: ${formatDate(new Date().toISOString())}\n\n${lines.join("\n")}\n\nTotal estimado: ${money(total)}\n\nRecordatorio: conservar copia original, documentar cambios y evitar datos sensibles.`;
    document.querySelector("#duePlannerResult").innerHTML = `<h2>Prioridad de pagos</h2>${list(lines)}<p class="pill warn">Total estimado: ${money(total)}</p><h3>Recomendaciones</h3>${list([...new Set(rows.map(r=>r.cls.advice)), "Separá el dinero de pagos críticos antes de compras impulsivas.", "Usá canales oficiales: app, home banking o sitio escrito manualmente."])}<div class="actions"><button class="btn primary" id="copyDuePlan">Copiar plan</button><button class="btn ghost" id="downloadDuePlan">Descargar TXT</button><button class="btn ghost" onclick="window.print()">Imprimir</button></div>`;
    document.querySelector("#copyDuePlan").addEventListener("click", async()=>{ await navigator.clipboard?.writeText(text); document.querySelector("#copyDuePlan").textContent="Copiado"; });
    document.querySelector("#downloadDuePlan").addEventListener("click", ()=>downloadText("planificador-analisis-datos.txt", text));
  });
  document.querySelector("#clearDuePlanner").addEventListener("click", () => renderDuePlanner());
}

function renderExportResults() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Exportación educativa</p><h1>Exportar resultados como TXT</h1><p class="lead">Armá un resumen simple para guardar o enviar. No incluyas datos personales ni sensibles.</p></div>
      <div class="card form-grid">
        <label class="field"><span>Tipo de resultado</span><select id="exportType"><option>Tabla mensual</option><option>Problemas de calidad</option><option>Comparación simple</option><option>ROI simple</option><option>Diagnóstico de calidad</option><option>Planificador de análisis</option></select></label>
        <label class="field"><span>Resumen sin datos sensibles</span><textarea id="exportSummary" class="textarea" placeholder="Ej: total estimado, diferencia observada, decisión pendiente, canal oficial consultado..."></textarea></label>
        <label class="field"><span>Próxima acción</span><textarea id="exportAction" class="textarea" placeholder="Ej: verificar en app oficial, esperar acreditación, guardar evidencia, consultar soporte oficial..."></textarea></label>
        <div class="actions"><button class="btn primary" id="buildExportTxt">Generar TXT</button><button class="btn ghost" id="downloadExportTxt">Descargar TXT</button><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="card"><h2>Vista previa</h2><textarea id="exportPreview" class="textarea" readonly>Completá los campos y generá el resumen.</textarea></div>
    </section>`;
  const build = () => {
    const text = `Analista de Datos Ciudadano - Reporte educativo\nFecha: ${formatDate(new Date().toISOString())}\nTipo: ${document.querySelector("#exportType").value}\n\nResumen:\n${document.querySelector("#exportSummary").value.trim() || "Sin resumen cargado."}\n\nPróxima acción:\n${document.querySelector("#exportAction").value.trim() || "Sin acción definida."}\n\nAviso: este archivo no reemplaza asesoramiento estadístico, financiero, legal, contable ni profesional. No compartir claves ni códigos.`;
    document.querySelector("#exportPreview").value = text;
    return text;
  };
  document.querySelector("#buildExportTxt").addEventListener("click", build);
  document.querySelector("#downloadExportTxt").addEventListener("click", ()=>downloadText("reporte-analista-datos-ciudadano.txt", build()));
}

function renderPrintableRiskDiagnostic() {
  app.innerHTML = `
    <section class="article printable">
      <div class="card danger-card"><p class="eyebrow">Versión imprimible</p><h1>Diagnóstico de calidad de datos imprimible</h1><p>Usá esta hoja como guía para ordenar información y próximos pasos sin cargar datos sensibles.</p></div>
      <div class="card">
        <h2>1. Situación</h2>
        ${list(["Tabla con faltantes", "Registro duplicado", "Categoría inconsistente", "Valor fuera de rango", "Dato sensible innecesario", "Otro caso"])}
        <h2>2. Evidencia a preservar</h2>
        ${list(["Copia de tabla original", "Fecha del análisis", "Métrica revisada", "Fuente de datos", "Criterio de limpieza", "Notas de cambios"])}
        <h2>3. Acciones seguras</h2>
        ${list(["Trabajar sobre copia, no sobre original", "No usar datos sin fuente clara", "No compartir datos sensibles", "No decidir con datos sin validar", "Consultar fuente o responsable del dato", "Guardar bitácora de limpieza"])}
        <h2>4. Resultado del diagnóstico</h2>
        <p class="muted">Anotá aquí el nivel obtenido en el diagnóstico: _______________________________</p>
        <p class="muted">Próxima acción: ____________________________________________________________</p>
        <div class="actions no-print"><a class="btn danger" href="#/risk">Hacer diagnóstico interactivo</a><button class="btn primary" onclick="window.print()">Imprimir / guardar PDF</button><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
    </section>`;
}

function renderSpecialFinancialChecklists() {
  const checklists = financialTools?.specialChecklists || [];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Checklists críticos v0.3</p><h1>Tabla sucia o reporte externo</h1><p class="lead">Dos guías rápidas para actuar sin apuro, verificar por canales oficiales y conservar evidencia.</p></div>
      <div class="grid two">
        ${checklists.map(c=>`<article class="card"><p class="eyebrow">Guía rápida</p><h2>${esc(c.title)}</h2><p>${esc(c.description)}</p>${list(c.items)}<div class="actions"><button class="btn primary" data-copy-special="${esc(c.id)}">Copiar checklist</button><button class="btn ghost" onclick="window.print()">Imprimir</button></div></article>`).join("")}
      </div>
    </section>`;
  document.querySelectorAll("[data-copy-special]").forEach(btn=>btn.addEventListener("click", async()=>{
    const item = checklists.find(c=>c.id===btn.dataset.copySpecial);
    const text = `${item.title}\n${item.description}\n\n${item.items.map((x,i)=>`${i+1}. ${x}`).join("\n")}`;
    await navigator.clipboard?.writeText(text);
    btn.textContent = "Checklist copiada";
  }));
}

function renderCalculationHistory() {
  const items = readToolsHistory();
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Historial local v0.4</p>
        <h1>Historial opcional de herramientas</h1>
        <p class="lead">Guarda solo resúmenes educativos. Evitá registrar nombres de clientes, DNI, CBU, CVU, números completos de tarjeta, alias reales, claves o capturas.</p>
        <div class="actions"><a class="btn primary" href="#/tools">Volver a herramientas</a><button class="btn ghost" id="exportHistory">Descargar historial TXT</button><button class="btn danger" id="clearHistory">Borrar historial</button></div>
      </div>
      ${items.length ? `<div class="grid">${items.map(item => `<article class="card history-card"><p class="eyebrow">${esc(item.kind)} · ${new Date(item.date).toLocaleString()}</p><h2>${esc(item.title)}</h2><p class="pill ok">${esc(item.summary)}</p>${list(item.notes || [])}</article>`).join("")}</div>` : `<div class="card"><h2>Sin registros</h2><p>Todavía no guardaste resúmenes desde las calculadoras o diagnósticos.</p></div>`}
    </section>`;
  const clearBtn = document.querySelector("#clearHistory");
  if (clearBtn) clearBtn.addEventListener("click", () => { localStorage.removeItem(toolsHistoryKey()); renderCalculationHistory(); });
  const exportBtn = document.querySelector("#exportHistory");
  if (exportBtn) exportBtn.addEventListener("click", () => {
    const text = items.map((item, idx) => `${idx+1}. ${item.title}\nTipo: ${item.kind}\nFecha: ${new Date(item.date).toLocaleString()}\nResumen: ${item.summary}\n${(item.notes || []).map((n,i)=>`- ${n}`).join("\n")}`).join("\n\n");
    downloadText("historial_analista_datos_ciudadano.txt", text || "Sin registros.");
  });
}

function renderCommerceGuide() {
  const guide = financialTools?.commerceGuide || {};
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Guía para pequeños negocios v0.4</p>
        <h1>${esc(guide.title || "Guía para pequeños negocios")}</h1>
        <p class="lead">${esc(guide.description || "Rutina práctica para cobrar, verificar, responder y cerrar el día con menos riesgo digital.")}</p>
        <div class="actions"><a class="btn primary" href="#/messages">Plantillas copiables</a><a class="btn ghost" href="#/special-checklists">Checklists críticos</a><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="grid two">
        ${(guide.sections || []).map(section => `<article class="card"><p class="eyebrow">${esc(section.kicker || "Comercio")}</p><h2>${esc(section.title)}</h2>${list(section.items || [])}</article>`).join("")}
      </div>
      <div class="card print-friendly">
        <h2>Rutina imprimible de análisis simple</h2>
        ${list(guide.printableRoutine || [])}
        <div class="actions no-print"><button class="btn primary" onclick="window.print()">Imprimir / guardar PDF</button><button class="btn ghost" id="copyCommerceGuide">Copiar rutina</button></div>
      </div>
    </section>`;
  const copyBtn = document.querySelector("#copyCommerceGuide");
  if (copyBtn) copyBtn.addEventListener("click", async () => {
    const text = `${guide.title || "Guía para pequeños negocios"}\n\n${(guide.printableRoutine || []).map((x,i)=>`${i+1}. ${x}`).join("\n")}`;
    await navigator.clipboard?.writeText(text);
    copyBtn.textContent = "Rutina copiada";
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
        <p class="lead">Esta versión consolida el paquete publicable: manifest web, Service Worker, caché offline básico, íconos, README final, guías de publicación, capturas sugeridas, privacidad, aviso legal y checklist de salida.</p>
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

function renderNotFound() {
  app.innerHTML = `<section class="article"><div class="card"><h1>Ruta no encontrada</h1><p>La sección solicitada no existe o el contenido fue movido.</p><a class="btn primary" href="#/">Volver al inicio</a></div></section>`;
}

bootstrap();


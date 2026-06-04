const MANIFEST_PATH = "src/data/course_manifest.json";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let financialTools = null;
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
    const [courseData, checklistData, incidentData, financialToolsData] = await Promise.all([
      loadJson(manifest.dataPaths.course),
      loadJson(manifest.dataPaths.checklists),
      loadJson(manifest.dataPaths.incidents),
      manifest.dataPaths.financialTools ? loadJson(manifest.dataPaths.financialTools) : Promise.resolve(null),
    ]);
    course = courseData;
    checklists = checklistData.checklists || [];
    incidents = incidentData.incidents || [];
    financialTools = financialToolsData;
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
          <a class="btn ghost" href="#/tools">Herramientas financieras</a>
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
        <h2>Protocolo financiero urgente</h2>
        <p>Guía para pausar, verificar, conservar evidencia y contactar canales oficiales ante consumos, transferencias o mensajes sospechosos.</p>
        <a class="btn danger" href="#/emergency">Abrir modo emergencia</a>
      </div>
      <div class="card">
        <p class="eyebrow">Herramientas v0.2</p>
        <h2>Calculadoras y diagnóstico</h2>
        <p>Presupuesto, gastos hormiga, cuota vs contado, margen simple, mensajes copiables y diagnóstico de riesgo financiero digital.</p>
        <div class="actions"><a class="btn primary" href="#/tools">Abrir herramientas</a><a class="btn ghost" href="#/risk">Diagnóstico rápido</a></div>
      </div>
    </section>
    <section class="section card compact-helper">
      <div>
        <p class="eyebrow">v0.2</p>
        <h2>Curso financiero con herramientas prácticas</h2>
        <p>Esta versión agrega calculadoras educativas, mensajes copiables y diagnóstico de riesgo para decisiones cotidianas de billeteras, QR, transferencias y tarjetas.</p>
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
      <div class="meta"><span class="pill">${esc(module.id.toUpperCase())}</span><span class="pill warn">${esc(module.commercialRisk || "Riesgo financiero")}</span></div>
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
    <section class="section-head"><div><p class="eyebrow">Autoauditoría</p><h1>${esc(manifest.labels?.checklists || "Checklists prácticos")}</h1><p>Marcá acciones reales de seguridad y control financiero. El avance queda guardado en este navegador.</p></div></section>
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
    <section class="section-head"><div><p class="eyebrow">Simulador de casos</p><h1>${esc(manifest.labels?.incidents || "Incidentes")}</h1><p>Guías de actuación para consumos desconocidos, comprobantes falsos, transferencias, QR, billeteras, bancos y tarjetas.</p></div></section>
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
      <div class="card danger-card"><p class="eyebrow">Modo emergencia</p><h1>Tengo un problema financiero digital</h1><p class="lead">Esta guía ordena acciones urgentes. No garantiza recuperación ni reemplaza banco, billetera, plataforma, soporte técnico, denuncia o asesoramiento profesional.</p></div>
      <div class="card"><h2>Primeros 5 minutos</h2>${list(["Cortá la conversación con quien presiona o amenaza.", "No muevas dinero ni confirmes entregas si el movimiento no aparece acreditado en la app oficial.", "No compartas códigos, claves, PIN, token ni datos completos de tarjeta.", "No abras links enviados por supuestos bancos, billeteras, compradores o soporte.", "Guardá capturas de movimientos, comprobantes, chats, perfiles y horarios."])}</div>
      <div class="card"><h2>Primera hora</h2>${list(["Entrá manualmente a banco, billetera, correo y tarjetas desde apps o sitios oficiales.", "Cambiá claves de correo principal, banco y billetera si hay sospecha de acceso.", "Cerrá sesiones desconocidas y activá doble factor.", "Contactá soporte oficial de banco, billetera, tarjeta o plataforma afectada.", "Avisá a familia o equipo que no respondan mensajes sospechosos ni compartan códigos."])}</div>
      <div class="card"><h2>Primeras 48 horas</h2>${list(["Ordená la evidencia por fecha y hora.", "Revisá movimientos, tarjetas, transferencias, suscripciones y conversaciones relacionadas.", "Actualizá datos de recuperación y dispositivos autorizados.", "Reforzá protocolos de verificación, límites y alertas.", "Consultá canales oficiales o asesoramiento profesional si corresponde."])}</div>
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
  let level = "Usuario financiero digital en formación";
  if (p >= 90 && quizAvg >= 80) level = "Usuario financiero preventivo avanzado";
  else if (p >= 70 && quizAvg >= 70) level = "Usuario financiero preventivo";
  else if (p >= 45) level = "Usuario financiero atento en progreso";
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
        <p class="eyebrow">Herramientas educativas v0.4</p>
        <h1>Herramientas financieras digitales</h1>
        <p class="lead">Calculadoras, mensajes, diagnóstico, historial local opcional y guías para pequeños comercios. Todo funciona sin login y sin guardar datos sensibles por defecto.</p>
        <p class="muted">No son asesoramiento financiero. Son ayudas educativas para ordenar datos y detectar señales de riesgo.</p>
      </div>
      <div class="grid two">
        <article class="card"><p class="eyebrow">Presupuesto</p><h2>Presupuesto mensual</h2><p>Estimá ingresos, gastos y saldo disponible.</p><a class="btn primary" href="#/budget">Abrir calculadora</a></article>
        <article class="card"><p class="eyebrow">Gastos chicos</p><h2>Gastos hormiga</h2><p>Convertí gastos diarios o semanales en impacto mensual.</p><a class="btn primary" href="#/ant-expenses">Calcular gastos</a></article>
        <article class="card"><p class="eyebrow">Decisión de compra</p><h2>Cuota vs contado</h2><p>Compará costo contado, cuotas y diferencia total.</p><a class="btn primary" href="#/installments">Comparar</a></article>
        <article class="card"><p class="eyebrow">Emprendimiento</p><h2>Margen simple</h2><p>Calculá precio, costo, ganancia y margen orientativo.</p><a class="btn primary" href="#/margin">Calcular margen</a></article>
        <article class="card"><p class="eyebrow">Comunicación</p><h2>Mensajes copiables</h2><p>Respuestas para verificar pagos, comprobantes y reclamos.</p><a class="btn primary" href="#/messages">Ver mensajes</a></article>
        <article class="card danger-card"><p class="eyebrow">Riesgo</p><h2>Diagnóstico financiero digital</h2><p>Respondé preguntas simples y obtené una prioridad de acción.</p><a class="btn danger" href="#/risk">Iniciar diagnóstico</a></article>
        <article class="card"><p class="eyebrow">Vencimientos</p><h2>Planificador de pagos</h2><p>Ordená vencimientos, montos y prioridades sin guardar datos sensibles.</p><a class="btn primary" href="#/due-planner">Planificar</a></article>
        <article class="card"><p class="eyebrow">Exportar</p><h2>Resultados en TXT</h2><p>Copiá o descargá un resumen educativo de cálculos y diagnósticos.</p><a class="btn primary" href="#/export-results">Exportar</a></article>
        <article class="card"><p class="eyebrow">Historial opcional</p><h2>Historial local de cálculos</h2><p>Guardá resúmenes generales sin claves, DNI, CBU, CVU ni datos sensibles.</p><a class="btn primary" href="#/history">Ver historial</a></article>
        <article class="card"><p class="eyebrow">Comercios</p><h2>Guía para pequeños comercios</h2><p>Rutina de cobros, comprobantes, QR, devoluciones y cierre de caja.</p><a class="btn primary" href="#/commerce-guide">Abrir guía</a></article>
        <article class="card"><p class="eyebrow">Checklists críticos</p><h2>Comprobante falso o movimiento desconocido</h2><p>Dos guías rápidas para actuar sin apuro y conservar evidencia.</p><a class="btn primary" href="#/special-checklists">Abrir checklists</a></article>
      </div>
    </section>`;
}

function renderBudgetCalculator() {
  const cats = financialTools?.budgetCategories || [];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Calculadora educativa</p><h1>Presupuesto mensual simple</h1><p>Ingresá montos aproximados. El cálculo queda solo en pantalla y no se guarda.</p></div>
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
    const advice = saldo < 0 ? "El presupuesto queda negativo. Revisá gastos variables, cuotas y vencimientos antes de asumir nuevos compromisos." : ratio > 85 ? "Queda poco margen. Conviene separar prioridades y evitar compras impulsivas." : "El presupuesto deja margen disponible. Aun así, verificá vencimientos y reservas.";
    document.querySelector("#budgetResult").innerHTML = `<h2>Resultado</h2>${list([`Ingresos: ${money(ingresos)}`, `Gastos estimados: ${money(gastos)}`, `Saldo estimado: ${money(saldo)}`, `Gastos sobre ingresos: ${ratio}%`])}<p class="pill ${cls}">${esc(advice)}</p><div class="actions"><button class="btn ghost" id="saveBudgetSummary">Guardar resumen</button><a class="btn ghost" href="#/history">Ver historial</a></div>`;
    bindHistoryButton("#saveBudgetSummary", () => ({ kind: "presupuesto", title: "Presupuesto mensual", summary: `Saldo ${money(saldo)} · gastos ${ratio}% de ingresos`, notes: [advice] }));
  });
}

function renderAntExpensesCalculator() {
  const items = financialTools?.antExpenses || [];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Calculadora educativa</p><h1>Gastos hormiga</h1><p>Estimá cuánto representan pequeños gastos repetidos durante un mes.</p></div>
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
    bindHistoryButton("#saveAntSummary", () => ({ kind: "gastos_hormiga", title: "Gastos hormiga", summary: `Total mensual estimado ${money(total)}`, notes: rows.filter(r=>r.monthly>0).slice(0,5).map(r=>`${r.label}: ${money(r.monthly)}`) }));
  });
}

function renderInstallmentComparator() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Calculadora educativa</p><h1>Comparador cuota vs contado</h1><p>Compará precio contado contra precio en cuotas. No calcula inflación ni costo financiero real: solo muestra diferencia simple.</p></div>
      <div class="card form-grid">
        ${renderNumberInput("cashPrice", "Precio contado")}
        ${renderNumberInput("installmentAmount", "Valor de cada cuota")}
        ${renderNumberInput("installmentCount", "Cantidad de cuotas")}
        <div class="actions"><button class="btn primary" id="calcInstallments">Comparar</button><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="card" id="installmentResult"><h2>Resultado</h2><p>Completá los datos de compra.</p></div>
    </section>`;
  document.querySelector("#calcInstallments").addEventListener("click", () => {
    const cash = readNumber("#cashPrice");
    const total = readNumber("#installmentAmount") * readNumber("#installmentCount");
    const diff = total - cash;
    const pct = cash ? Math.round((diff / cash) * 100) : 0;
    const advice = diff > 0 ? `La opción en cuotas cuesta ${money(diff)} más que contado (${pct}% de diferencia simple).` : diff < 0 ? `La opción en cuotas queda ${money(Math.abs(diff))} por debajo del contado. Verificá si hay cargos, intereses o condiciones ocultas.` : "Ambas opciones tienen el mismo total simple.";
    document.querySelector("#installmentResult").innerHTML = `<h2>Comparación simple</h2>${list([`Contado: ${money(cash)}`, `Total en cuotas: ${money(total)}`, `Diferencia: ${money(diff)}`, `Diferencia porcentual simple: ${pct}%`])}<p class="pill warn">${esc(advice)}</p><div class="actions"><button class="btn ghost" id="saveInstallmentSummary">Guardar resumen</button><a class="btn ghost" href="#/history">Ver historial</a></div>`;
    bindHistoryButton("#saveInstallmentSummary", () => ({ kind: "cuotas", title: "Comparación cuota vs contado", summary: `Diferencia simple ${money(diff)} (${pct}%)`, notes: [advice] }));
  });
}

function renderMarginCalculator() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Calculadora educativa</p><h1>Margen simple para pequeños negocios</h1><p>Útil para estimar costo, precio, ganancia y margen bruto. No reemplaza cálculo contable ni impositivo.</p></div>
      <div class="card form-grid">
        ${renderNumberInput("unitCost", "Costo unitario del producto")}
        ${renderNumberInput("salePrice", "Precio de venta")}
        ${renderNumberInput("extraCost", "Costo extra por unidad: comisión, bolsa, envío subsidiado, etc.")}
        <div class="actions"><button class="btn primary" id="calcMargin">Calcular margen</button><a class="btn ghost" href="#/tools">Volver</a></div>
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
    bindHistoryButton("#saveMarginSummary", () => ({ kind: "margen", title: "Margen simple", summary: `Margen ${margin}% · ganancia ${money(profit)}`, notes: [advice] }));
  });
}

function renderFinancialMessages() {
  const messages = financialTools?.messages || [];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Mensajes copiables</p><h1>Respuestas ante pagos dudosos</h1><p>Modelos de texto para responder con calma, no entregar productos por presión y derivar a canales oficiales.</p></div>
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
      <div class="card danger-card"><p class="eyebrow">Diagnóstico rápido</p><h1>Riesgo financiero digital</h1><p>Respondé sin datos personales. El resultado es orientativo y no se guarda automáticamente.</p></div>
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
    bindHistoryButton("#saveRiskSummary", () => ({ kind: "riesgo", title: "Diagnóstico de riesgo financiero", summary: `Nivel ${level.level} · puntaje ${score}`, notes: plan.slice(0,5) }));
    document.querySelector("#copyRiskPlan").addEventListener("click", async () => {
      await navigator.clipboard?.writeText(`Diagnóstico financiero digital: ${level.level} (${score}).\n` + plan.map((p,i)=>`${i+1}. ${p}`).join("\n"));
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
        <p class="muted">No cargues claves, números completos de tarjeta, DNI ni datos sensibles.</p>
      </div>
      <div class="card form-grid" id="duePlannerForm">
        ${Array.from({length:6}).map((_,i)=>`
          <div class="tool-row due-row">
            <label><span>Pago ${i+1}</span><input id="due_name_${i}" type="text" placeholder="Ej: tarjeta, luz, proveedor"></label>
            <label><span>Categoría</span><select id="due_cat_${i}">${categories.map(c=>`<option>${esc(c)}</option>`).join("")}</select></label>
            <label><span>Monto estimado</span><input id="due_amount_${i}" type="number" min="0" step="0.01" placeholder="0"></label>
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
      return name || amount || date ? { name: name || "Pago sin nombre", category, amount, date, days, cls } : null;
    }).filter(Boolean).sort((a,b)=>a.days-b.days || b.amount-a.amount);
    if (!rows.length) {
      document.querySelector("#duePlannerResult").innerHTML = `<h2>Sin datos</h2><p class="pill warn">Cargá al menos un pago o vencimiento.</p>`;
      return;
    }
    const total = rows.reduce((sum,r)=>sum+r.amount,0);
    const lines = rows.map((r,idx)=>`${idx+1}. ${r.name} · ${r.category} · ${money(r.amount)} · vence ${r.date || "sin fecha"} · ${r.days < 0 ? "vencido" : r.days + " días"} · ${r.cls.level}`);
    const text = `Planificador de vencimientos - Finanzas Digitales Seguras\nGenerado: ${formatDate(new Date().toISOString())}\n\n${lines.join("\n")}\n\nTotal estimado: ${money(total)}\n\nRecordatorio: pagar solo por canales oficiales y evitar links recibidos por mensaje.`;
    document.querySelector("#duePlannerResult").innerHTML = `<h2>Prioridad de pagos</h2>${list(lines)}<p class="pill warn">Total estimado: ${money(total)}</p><h3>Recomendaciones</h3>${list([...new Set(rows.map(r=>r.cls.advice)), "Separá el dinero de pagos críticos antes de compras impulsivas.", "Usá canales oficiales: app, home banking o sitio escrito manualmente."])}<div class="actions"><button class="btn primary" id="copyDuePlan">Copiar plan</button><button class="btn ghost" id="downloadDuePlan">Descargar TXT</button><button class="btn ghost" onclick="window.print()">Imprimir</button></div>`;
    document.querySelector("#copyDuePlan").addEventListener("click", async()=>{ await navigator.clipboard?.writeText(text); document.querySelector("#copyDuePlan").textContent="Copiado"; });
    document.querySelector("#downloadDuePlan").addEventListener("click", ()=>downloadText("planificador-vencimientos-finanzas-digitales.txt", text));
  });
  document.querySelector("#clearDuePlanner").addEventListener("click", () => renderDuePlanner());
}

function renderExportResults() {
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Exportación educativa</p><h1>Exportar resultados como TXT</h1><p class="lead">Armá un resumen simple para guardar o enviar. No incluyas datos sensibles.</p></div>
      <div class="card form-grid">
        <label class="field"><span>Tipo de resultado</span><select id="exportType"><option>Presupuesto mensual</option><option>Gastos hormiga</option><option>Cuota vs contado</option><option>Margen simple</option><option>Diagnóstico financiero</option><option>Planificador de vencimientos</option></select></label>
        <label class="field"><span>Resumen sin datos sensibles</span><textarea id="exportSummary" class="textarea" placeholder="Ej: total estimado, diferencia observada, decisión pendiente, canal oficial consultado..."></textarea></label>
        <label class="field"><span>Próxima acción</span><textarea id="exportAction" class="textarea" placeholder="Ej: verificar en app oficial, esperar acreditación, guardar evidencia, consultar soporte oficial..."></textarea></label>
        <div class="actions"><button class="btn primary" id="buildExportTxt">Generar TXT</button><button class="btn ghost" id="downloadExportTxt">Descargar TXT</button><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="card"><h2>Vista previa</h2><textarea id="exportPreview" class="textarea" readonly>Completá los campos y generá el resumen.</textarea></div>
    </section>`;
  const build = () => {
    const text = `Finanzas Digitales Seguras Argentina - Resumen educativo\nFecha: ${formatDate(new Date().toISOString())}\nTipo: ${document.querySelector("#exportType").value}\n\nResumen:\n${document.querySelector("#exportSummary").value.trim() || "Sin resumen cargado."}\n\nPróxima acción:\n${document.querySelector("#exportAction").value.trim() || "Sin acción definida."}\n\nAviso: este archivo no reemplaza asesoramiento financiero, legal, bancario ni soporte oficial. No compartir claves ni códigos.`;
    document.querySelector("#exportPreview").value = text;
    return text;
  };
  document.querySelector("#buildExportTxt").addEventListener("click", build);
  document.querySelector("#downloadExportTxt").addEventListener("click", ()=>downloadText("resumen-finanzas-digitales.txt", build()));
}

function renderPrintableRiskDiagnostic() {
  app.innerHTML = `
    <section class="article printable">
      <div class="card danger-card"><p class="eyebrow">Versión imprimible</p><h1>Diagnóstico financiero digital imprimible</h1><p>Usá esta hoja como guía para ordenar información y próximos pasos sin cargar datos sensibles.</p></div>
      <div class="card">
        <h2>1. Situación</h2>
        ${list(["Comprobante dudoso", "Movimiento desconocido", "Transferencia que piden devolver", "Préstamo o promoción sospechosa", "Cuenta/billetera con acceso sospechoso", "Otro caso"])}
        <h2>2. Evidencia a preservar</h2>
        ${list(["Capturas del chat completo", "Fecha y hora", "Monto", "Alias/CBU/CVU visible si corresponde", "Nombre de usuario, teléfono o perfil", "Número de reclamo oficial"])}
        <h2>3. Acciones seguras</h2>
        ${list(["Entrar solo desde app o sitio oficial", "No abrir links del mensaje recibido", "No compartir códigos ni claves", "No entregar mercadería sin acreditación real", "Contactar soporte oficial", "Guardar constancia del reclamo"])}
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
      <div class="card"><p class="eyebrow">Checklists críticos v0.3</p><h1>Comprobante falso o movimiento desconocido</h1><p class="lead">Dos guías rápidas para actuar sin apuro, verificar por canales oficiales y conservar evidencia.</p></div>
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
    downloadText("historial_finanzas_digitales_seguras.txt", text || "Sin registros.");
  });
}

function renderCommerceGuide() {
  const guide = financialTools?.commerceGuide || {};
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Guía para pequeños comercios v0.4</p>
        <h1>${esc(guide.title || "Guía para pequeños comercios")}</h1>
        <p class="lead">${esc(guide.description || "Rutina práctica para cobrar, verificar, responder y cerrar el día con menos riesgo digital.")}</p>
        <div class="actions"><a class="btn primary" href="#/messages">Mensajes copiables</a><a class="btn ghost" href="#/special-checklists">Checklists críticos</a><a class="btn ghost" href="#/tools">Volver</a></div>
      </div>
      <div class="grid two">
        ${(guide.sections || []).map(section => `<article class="card"><p class="eyebrow">${esc(section.kicker || "Comercio")}</p><h2>${esc(section.title)}</h2>${list(section.items || [])}</article>`).join("")}
      </div>
      <div class="card print-friendly">
        <h2>Rutina imprimible de cobro seguro</h2>
        ${list(guide.printableRoutine || [])}
        <div class="actions no-print"><button class="btn primary" onclick="window.print()">Imprimir / guardar PDF</button><button class="btn ghost" id="copyCommerceGuide">Copiar rutina</button></div>
      </div>
    </section>`;
  const copyBtn = document.querySelector("#copyCommerceGuide");
  if (copyBtn) copyBtn.addEventListener("click", async () => {
    const text = `${guide.title || "Guía para pequeños comercios"}\n\n${(guide.printableRoutine || []).map((x,i)=>`${i+1}. ${x}`).join("\n")}`;
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

function renderNotFound() {
  app.innerHTML = `<section class="article"><div class="card"><h1>Ruta no encontrada</h1><p>La sección solicitada no existe o el contenido fue movido.</p><a class="btn primary" href="#/">Volver al inicio</a></div></section>`;
}

bootstrap();


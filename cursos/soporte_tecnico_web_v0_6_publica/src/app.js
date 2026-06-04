const MANIFEST_PATH = "src/data/course_manifest.json";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let quizRuntime = { moduleId: null, answers: {} };
let deferredInstallPrompt = null;

const app = document.querySelector("#app");

function storageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:progress:v1`;
}

const emptyProgress = () => ({
  lessons: [],
  quizzes: {},
  checklistItems: [],
  visitedIncidents: [],
  ticketBoard: {},
  ticketEvents: [],
  ticketLogs: {},
  ticketConversations: {},
  ticketEscalations: {},
  ticketFilters: { status: "all", priority: "all", sla: "all" },
  updatedAt: null
});


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
    const [courseData, checklistData, incidentData] = await Promise.all([
      loadJson(manifest.dataPaths.course),
      loadJson(manifest.dataPaths.checklists),
      loadJson(manifest.dataPaths.incidents),
    ]);
    course = courseData;
    checklists = checklistData.checklists || [];
    incidents = incidentData.incidents || [];
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
    "ticket-board": renderTicketBoard,
    "ticket-queue": renderTicketQueue,
    "user-profiles": renderUserProfiles,
    "ticket-log": () => renderTicketLog(p1),
    "ticket-conversation": () => renderTicketConversation(p1),
    "ticket-escalation": () => renderTicketEscalation(p1),
    "ticket-export": () => renderTicketExport(p1),
    "emergency": renderEmergency,
    "legal": renderLegal,
    "certificate": renderCertificate,
    "progress": renderProgressTools,
    "template": renderTemplateGuide,
    "accessibility": renderAccessibilityTools,
    "publish": renderPublishTools,
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
    <section class="section card compact-helper">
      <div>
        <p class="eyebrow">v0.2 · Mesa de ayuda</p>
        <h2>Tablero laboral de tickets</h2>
        <p>Clasificá tickets por estado y prioridad, resolvé casos y revisá métricas locales de desempeño educativo.</p>
      </div>
      <a class="btn primary" href="#/ticket-board">Abrir tablero</a><a class="btn ghost" href="#/ticket-queue">Ver cola priorizada</a>
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
    <section class="section-head"><div><p class="eyebrow">Simulador laboral</p><h1>${esc(manifest.labels?.incidents || "Tickets")}</h1><p>Tickets simulados para practicar diagnóstico, evidencia, comunicación, documentación y escalamiento.</p></div><a class="btn primary" href="#/ticket-board">Abrir tablero laboral</a></section>
    <input class="search-box" id="incidentSearch" placeholder="Buscar ticket: internet, navegador, contraseña, Wi‑Fi, malware…" />
    <section class="grid two" id="incidentGrid"></section>`;
  const grid = document.querySelector("#incidentGrid");
  const search = document.querySelector("#incidentSearch");
  const paint = () => {
    const q = search.value.trim().toLowerCase();
    const filtered = incidents.filter(i => `${i.title} ${i.summary} ${i.severity}`.toLowerCase().includes(q));
    grid.innerHTML = filtered.map(i => `<article class="card item-card"><span class="pill danger">Prioridad sugerida ${esc(i.severity)}</span><h2>${esc(i.title)}</h2><p>${esc(i.summary)}</p><div class="actions"><a class="btn primary" href="#/incident/${i.id}">Abrir ticket</a><a class="btn ghost" href="#/ticket-board">Tablero</a></div></article>`).join("") || `<div class="card"><p>No encontré tickets con esa búsqueda.</p></div>`;
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
      <div class="card danger-card"><p class="eyebrow">Ticket guiado · Prioridad sugerida ${esc(incident.severity)}</p><h1>${esc(incident.title)}</h1><p class="lead">${esc(incident.summary || "")}</p></div>
      <div class="card"><h2>Objetivo inmediato</h2><p>${esc(incident.immediateGoal || "")}</p></div>
      <div class="card"><h2>Pasos recomendados</h2>${list(incident.steps)}</div>
      <div class="card"><h2>Evidencia a preservar</h2>${list(incident.evidenceToPreserve)}</div>
      <div class="card alert"><h2>Errores a evitar</h2>${list(incident.errorsToAvoid)}</div>
      <div class="card"><h2>Prevención posterior</h2>${list(incident.aftercare || incident.preventionAfterwards)}</div>
      ${renderDecision(incident)}
      <div class="actions"><a class="btn ghost" href="#/incidents">Volver a tickets</a><a class="btn primary" href="#/ticket-board">Gestionar en tablero</a><a class="btn ghost" href="#/ticket-log/${incident.id}">Bitácora</a><a class="btn ghost" href="#/ticket-conversation/${incident.id}">Conversación</a><a class="btn ghost" href="#/ticket-escalation/${incident.id}">Escalar</a><a class="btn danger" href="#/emergency">Incidente crítico</a></div>
    </article>`;
}

function renderDecision(incident) {
  const d = incident.guidedDecision || incident.decision || null;
  if (!d) return "";
  const options = d.options || [];
  return `<div class="card"><h2>Decisión guiada</h2><p>${esc(d.question || "¿Qué harías primero?")}</p>${options.map(o => `<div class="quiz-option ${o.isCorrect ? "correct" : ""}"><strong>${esc(o.text || o.option || "Opción")}</strong><br>${esc(o.feedback || "")}</div>`).join("")}</div>`;
}


function ticketBoardDefaults() {
  return incidents.reduce((acc, ticket) => {
    acc[ticket.id] = { status: "new", priority: severityToPriority(ticket.severity), score: 0, notes: "", openedAt: null, updatedAt: null };
    return acc;
  }, {});
}

function readTicketBoard() {
  const state = storage.read();
  return { ...ticketBoardDefaults(), ...(state.ticketBoard || {}) };
}

function severityToPriority(severity = "") {
  const value = severity.toLowerCase();
  if (value.includes("crítica") || value.includes("critica")) return "critical";
  if (value.includes("alta")) return "high";
  if (value.includes("media")) return "medium";
  return "low";
}

function ticketStatusLabel(id) {
  return manifest.ticketBoard?.statuses?.find(s => s.id === id)?.label || id;
}

function ticketPriorityLabel(id) {
  return manifest.ticketBoard?.priorities?.find(p => p.id === id)?.label || id;
}

function ticketPriorityScore(id) {
  return manifest.ticketBoard?.priorities?.find(p => p.id === id)?.score || 1;
}

function calculateTicketScore(record) {
  let score = ticketPriorityScore(record.priority);
  if (["diagnosing", "waiting_user", "escalated", "resolved"].includes(record.status)) score += 2;
  if (["waiting_user", "escalated"].includes(record.status)) score += 1;
  if (record.status === "resolved") score += 4;
  if ((record.notes || "").trim().length >= 20) score += 2;
  return Math.min(score, 10);
}

function ticketBoardMetrics(board = readTicketBoard()) {
  const records = Object.values(board);
  const total = records.length;
  const byStatus = records.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {});
  const byPriority = records.reduce((acc, record) => {
    acc[record.priority] = (acc[record.priority] || 0) + 1;
    return acc;
  }, {});
  const resolved = byStatus.resolved || 0;
  const escalated = byStatus.escalated || 0;
  const score = records.reduce((sum, record) => sum + calculateTicketScore(record), 0);
  const maxScore = total * 10;
  return { total, byStatus, byPriority, resolved, escalated, score, maxScore, percent: percent(score, maxScore) };
}

function updateTicketRecord(ticketId, patch) {
  storage.update(state => {
    const currentBoard = { ...ticketBoardDefaults(), ...(state.ticketBoard || {}) };
    const current = currentBoard[ticketId] || { status: "new", priority: "medium", score: 0, notes: "" };
    const now = new Date().toISOString();
    const next = { ...current, ...patch, openedAt: current.openedAt || now, updatedAt: now };
    next.score = calculateTicketScore(next);
    currentBoard[ticketId] = next;
    state.ticketBoard = currentBoard;
    state.ticketEvents = [
      ...(state.ticketEvents || []),
      { ticketId, status: next.status, priority: next.priority, score: next.score, date: next.updatedAt }
    ].slice(-40);
    state.visitedIncidents = [...new Set([...(state.visitedIncidents || []), ticketId])];
  });
}

function readTicketFilters() {
  return { status: "all", priority: "all", sla: "all", ...(storage.read().ticketFilters || {}) };
}

function updateTicketFilters(patch) {
  storage.update(state => { state.ticketFilters = { status: "all", priority: "all", sla: "all", ...(state.ticketFilters || {}), ...patch }; });
}

function priorityRank(priority) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[priority] || 0;
}

function statusRank(status) {
  return { new: 5, diagnosing: 4, waiting_user: 3, escalated: 2, resolved: 1 }[status] || 0;
}

function ticketUserProfile(ticketId) {
  const profiles = manifest.userProfiles || [];
  return profiles.find(p => (p.ticketIds || []).includes(ticketId)) || profiles[0] || {
    name: "Usuario interno",
    area: "Área no especificada",
    digitalLevel: "Básico",
    communicationStyle: "Necesita instrucciones claras y breves.",
    risk: "Puede omitir datos importantes si no se le pregunta con precisión."
  };
}

function slaConfigForPriority(priority) {
  const fallback = {
    critical: { label: "Crítica", targetHours: 1, description: "Atención inmediata y posible escalamiento." },
    high: { label: "Alta", targetHours: 4, description: "Resolver o escalar durante la jornada." },
    medium: { label: "Media", targetHours: 24, description: "Atender con diagnóstico documentado." },
    low: { label: "Baja", targetHours: 72, description: "Planificar sin bloquear tickets urgentes." }
  };
  return (manifest.ticketSla || fallback)[priority] || fallback[priority] || fallback.medium;
}

function ticketAgeHours(record) {
  const start = record.openedAt || record.updatedAt;
  if (!start) return 0;
  const diff = Date.now() - new Date(start).getTime();
  if (Number.isNaN(diff) || diff < 0) return 0;
  return Math.round(diff / 36_000) / 100;
}

function ticketSlaStatus(record) {
  if (record.status === "resolved") return { id: "ok", label: "Cerrado", tone: "ok", detail: "El ticket fue marcado como resuelto." };
  const cfg = slaConfigForPriority(record.priority);
  const age = ticketAgeHours(record);
  if (!record.openedAt && !record.updatedAt) return { id: "not_started", label: "Sin iniciar", tone: "", detail: `${cfg.description} SLA educativo: ${cfg.targetHours} h.` };
  if (age >= cfg.targetHours) return { id: "late", label: "Demorado", tone: "danger", detail: `Supera el SLA educativo de ${cfg.targetHours} h.` };
  if (age >= cfg.targetHours * 0.75) return { id: "risk", label: "En riesgo", tone: "warn", detail: `Se acerca al SLA educativo de ${cfg.targetHours} h.` };
  return { id: "on_track", label: "En tiempo", tone: "ok", detail: `Dentro del SLA educativo de ${cfg.targetHours} h.` };
}

function filteredTickets(board = readTicketBoard()) {
  const filters = readTicketFilters();
  return incidents.filter(ticket => {
    const record = board[ticket.id];
    const sla = ticketSlaStatus(record);
    if (filters.status !== "all" && record.status !== filters.status) return false;
    if (filters.priority !== "all" && record.priority !== filters.priority) return false;
    if (filters.sla !== "all" && sla.id !== filters.sla) return false;
    return true;
  });
}

function prioritizedTickets(board = readTicketBoard()) {
  return [...incidents].sort((a, b) => {
    const ra = board[a.id];
    const rb = board[b.id];
    const slaA = ticketSlaStatus(ra).id;
    const slaB = ticketSlaStatus(rb).id;
    const slaWeight = { late: 4, risk: 3, not_started: 2, on_track: 1, ok: 0 };
    return (slaWeight[slaB] || 0) - (slaWeight[slaA] || 0)
      || priorityRank(rb.priority) - priorityRank(ra.priority)
      || statusRank(rb.status) - statusRank(ra.status)
      || a.title.localeCompare(b.title);
  });
}

function renderTicketFilters(filters, statuses, priorities) {
  return `<section class="card section ticket-filter-panel">
    <div class="compact-helper"><div><h2>Filtros del tablero</h2><p>Filtrá por estado, prioridad o semáforo SLA para practicar lectura de cola laboral.</p></div><a class="btn ghost" href="#/ticket-queue">Abrir cola priorizada</a></div>
    <div class="ticket-controls">
      <label>Estado
        <select id="filterStatus">
          <option value="all" ${filters.status === "all" ? "selected" : ""}>Todos</option>
          ${statuses.map(s => `<option value="${esc(s.id)}" ${filters.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
        </select>
      </label>
      <label>Prioridad
        <select id="filterPriority">
          <option value="all" ${filters.priority === "all" ? "selected" : ""}>Todas</option>
          ${priorities.map(p => `<option value="${esc(p.id)}" ${filters.priority === p.id ? "selected" : ""}>${esc(p.label)}</option>`).join("")}
        </select>
      </label>
      <label>Semáforo SLA
        <select id="filterSla">
          <option value="all" ${filters.sla === "all" ? "selected" : ""}>Todos</option>
          <option value="late" ${filters.sla === "late" ? "selected" : ""}>Demorados</option>
          <option value="risk" ${filters.sla === "risk" ? "selected" : ""}>En riesgo</option>
          <option value="on_track" ${filters.sla === "on_track" ? "selected" : ""}>En tiempo</option>
          <option value="not_started" ${filters.sla === "not_started" ? "selected" : ""}>Sin iniciar</option>
          <option value="ok" ${filters.sla === "ok" ? "selected" : ""}>Cerrados</option>
        </select>
      </label>
    </div>
  </section>`;
}

function wireTicketFilters() {
  const status = document.querySelector("#filterStatus");
  const priority = document.querySelector("#filterPriority");
  const sla = document.querySelector("#filterSla");
  if (status) status.addEventListener("change", () => { updateTicketFilters({ status: status.value }); renderTicketBoard(); });
  if (priority) priority.addEventListener("change", () => { updateTicketFilters({ priority: priority.value }); renderTicketBoard(); });
  if (sla) sla.addEventListener("change", () => { updateTicketFilters({ sla: sla.value }); renderTicketBoard(); });
}

function renderSlaLegend() {
  return `<section class="card section">
    <h2>SLA educativo por prioridad</h2>
    <p>No es un SLA real de una empresa: sirve para entrenar criterio de urgencia y cola de trabajo.</p>
    <div class="grid four">
      ${Object.entries(manifest.ticketSla || {}).map(([id, cfg]) => `<div class="mini-card"><span class="pill ${id === "critical" ? "danger" : id === "high" ? "warn" : ""}">${esc(cfg.label || ticketPriorityLabel(id))}</span><strong>${esc(String(cfg.targetHours))} h</strong><p>${esc(cfg.description || "")}</p></div>`).join("")}
    </div>
  </section>`;
}

function renderTicketBoard() {
  const board = readTicketBoard();
  const metrics = ticketBoardMetrics(board);
  const statuses = manifest.ticketBoard?.statuses || [];
  const priorities = manifest.ticketBoard?.priorities || [];
  const filters = readTicketFilters();
  const selected = filteredTickets(board);
  const slaCounts = Object.values(board).reduce((acc, record) => {
    const status = ticketSlaStatus(record).id;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  app.innerHTML = `
    <section class="section-head">
      <div>
        <p class="eyebrow">v0.4 · Tablero laboral avanzado</p>
        <h1>Tablero de tickets</h1>
        <p>Clasificá, filtrá, priorizá y documentá tickets simulados con criterios de mesa de ayuda.</p>
      </div>
      <div class="actions"><a class="btn primary" href="#/ticket-queue">Cola priorizada</a><a class="btn ghost" href="#/user-profiles">Perfiles simulados</a><a class="btn ghost" href="#/incidents">Ver tickets guiados</a></div>
    </section>
    <section class="grid four ticket-metrics">
      <div class="stat"><strong>${metrics.total}</strong><span>Tickets cargados</span></div>
      <div class="stat"><strong>${metrics.resolved}</strong><span>Resueltos</span></div>
      <div class="stat"><strong>${slaCounts.late || 0}</strong><span>Demorados</span></div>
      <div class="stat"><strong>${metrics.percent}%</strong><span>Puntaje educativo</span></div>
    </section>
    <section class="card section">
      <h2>Reglas de puntaje</h2>
      ${list(manifest.ticketBoard?.scoreRules || [])}
      ${renderProgressBar(metrics.percent)}
      <p><strong>${metrics.score}/${metrics.maxScore}</strong> puntos educativos posibles.</p>
    </section>
    ${renderTicketFilters(filters, statuses, priorities)}
    ${renderSlaLegend()}
    <section class="grid two section">
      ${selected.map(ticket => renderTicketBoardCard(ticket, board[ticket.id], statuses, priorities)).join("") || `<article class="card"><h2>Sin resultados</h2><p>No hay tickets que coincidan con los filtros activos.</p><div class="actions"><button class="btn ghost" id="clearFilters">Limpiar filtros</button></div></article>`}
    </section>
    <section class="card section">
      <h2>Eventos recientes</h2>
      ${renderTicketEvents()}
      <div class="actions"><button class="btn danger" id="resetTicketBoard">Reiniciar tablero</button></div>
    </section>`;

  wireTicketFilters();
  const clearFilters = document.querySelector("#clearFilters");
  if (clearFilters) clearFilters.addEventListener("click", () => { updateTicketFilters({ status: "all", priority: "all", sla: "all" }); renderTicketBoard(); });
  document.querySelectorAll("[data-ticket-status]").forEach(select => {
    select.addEventListener("change", () => {
      updateTicketRecord(select.dataset.ticketStatus, { status: select.value });
      renderTicketBoard();
    });
  });
  document.querySelectorAll("[data-ticket-priority]").forEach(select => {
    select.addEventListener("change", () => {
      updateTicketRecord(select.dataset.ticketPriority, { priority: select.value });
      renderTicketBoard();
    });
  });
  document.querySelectorAll("[data-ticket-notes]").forEach(textarea => {
    textarea.addEventListener("change", () => {
      updateTicketRecord(textarea.dataset.ticketNotes, { notes: textarea.value });
      renderTicketBoard();
    });
  });
  const reset = document.querySelector("#resetTicketBoard");
  if (reset) reset.addEventListener("click", () => {
    if (confirm("¿Reiniciar solo el tablero laboral de tickets?")) {
      storage.update(state => { state.ticketBoard = {}; state.ticketEvents = []; state.ticketFilters = { status: "all", priority: "all", sla: "all" }; });
      renderTicketBoard();
    }
  });
}

function renderTicketBoardCard(ticket, record, statuses, priorities) {
  const score = calculateTicketScore(record);
  const feedback = ticketFeedback(record);
  const sla = ticketSlaStatus(record);
  const profile = ticketUserProfile(ticket.id);
  return `
    <article class="card ticket-card">
      <div class="pill-row">
        <span class="pill danger">${esc(ticketPriorityLabel(record.priority))}</span>
        <span class="pill ${record.status === "resolved" ? "ok" : record.status === "escalated" ? "warn" : ""}">${esc(ticketStatusLabel(record.status))}</span>
        <span class="pill ${sla.tone || ""}">${esc(sla.label)}</span>
        <span class="pill">${score}/10 pts</span>
      </div>
      <h2>${esc(ticket.title)}</h2>
      <p>${esc(ticket.summary)}</p>
      <div class="mini-card"><strong>Perfil simulado:</strong> ${esc(profile.name)} · ${esc(profile.area)} · Nivel ${esc(profile.digitalLevel)}<br><span class="muted">${esc(sla.detail)}</span></div>
      ${renderProgressBar(score * 10)}
      <div class="ticket-controls">
        <label>Estado
          <select data-ticket-status="${esc(ticket.id)}">
            ${statuses.map(s => `<option value="${esc(s.id)}" ${record.status === s.id ? "selected" : ""}>${esc(s.label)}</option>`).join("")}
          </select>
        </label>
        <label>Prioridad
          <select data-ticket-priority="${esc(ticket.id)}">
            ${priorities.map(p => `<option value="${esc(p.id)}" ${record.priority === p.id ? "selected" : ""}>${esc(p.label)}</option>`).join("")}
          </select>
        </label>
      </div>
      <label class="ticket-note-label">Nota de resolución o escalamiento
        <textarea data-ticket-notes="${esc(ticket.id)}" rows="3" placeholder="Ej.: usuario sin internet, afecta solo su PC, se probó navegador y Wi‑Fi, se escala a redes con evidencia…">${esc(record.notes || "")}</textarea>
      </label>
      <div class="feedback ${record.status === "resolved" ? "ok-feedback" : "bad-feedback"}"><strong>Feedback:</strong><br>${esc(feedback)}</div>
      <div class="actions"><a class="btn primary" href="#/incident/${ticket.id}">Abrir guía</a><a class="btn ghost" href="#/ticket-log/${ticket.id}">Bitácora</a><a class="btn ghost" href="#/ticket-conversation/${ticket.id}">Simular usuario</a><a class="btn ghost" href="#/ticket-escalation/${ticket.id}">Escalar</a><a class="btn ghost" href="#/ticket-export/${ticket.id}">Exportar cierre</a></div>
    </article>`;
}

function ticketFeedback(record) {
  if (record.status === "new") return "Ticket recibido. El siguiente paso profesional es reunir síntomas, impacto, evidencia y permisos antes de tocar configuraciones.";
  if (record.status === "diagnosing") return "Buen avance. Documentá pruebas seguras y evitá cambios destructivos sin respaldo o autorización.";
  if (record.status === "waiting_user") return "Correcto cuando falta información. Dejá una pregunta concreta y una próxima acción clara para el usuario.";
  if (record.status === "escalated") return "Escalar es adecuado si hay riesgo de seguridad, red, permisos, sistemas críticos o alcance fuera del nivel inicial.";
  if (record.status === "resolved") return "Cierre educativo correcto: debe incluir causa probable, acción aplicada, validación con usuario y prevención.";
  return "Actualizá estado, prioridad y nota para recibir mejor feedback.";
}

function renderTicketQueue() {
  const board = readTicketBoard();
  const ordered = prioritizedTickets(board);
  app.innerHTML = `
    <section class="section-head"><div><p class="eyebrow">v0.4 · Cola priorizada</p><h1>Cola de tickets</h1><p>Orden sugerido por demora SLA, prioridad, estado y necesidad de acción.</p></div><a class="btn ghost" href="#/ticket-board">Volver al tablero</a></section>
    <section class="card section">
      <div class="table-wrap"><table><thead><tr><th>#</th><th>Ticket</th><th>Perfil</th><th>Prioridad</th><th>Estado</th><th>SLA</th><th>Acción</th></tr></thead><tbody>
      ${ordered.map((ticket, index) => {
        const record = board[ticket.id];
        const sla = ticketSlaStatus(record);
        const profile = ticketUserProfile(ticket.id);
        return `<tr><td>${index + 1}</td><td>${esc(ticket.title)}</td><td>${esc(profile.name)}<br><small>${esc(profile.area)}</small></td><td>${esc(ticketPriorityLabel(record.priority))}</td><td>${esc(ticketStatusLabel(record.status))}</td><td><span class="pill ${sla.tone || ""}">${esc(sla.label)}</span><br><small>${esc(sla.detail)}</small></td><td><a class="btn ghost" href="#/ticket-log/${ticket.id}">Trabajar</a></td></tr>`;
      }).join("")}
      </tbody></table></div>
    </section>
    ${renderSlaLegend()}`;
}

function renderUserProfiles() {
  const profiles = manifest.userProfiles || [];
  app.innerHTML = `
    <section class="section-head"><div><p class="eyebrow">v0.4 · Perfiles simulados</p><h1>Usuarios de práctica</h1><p>Perfiles ficticios para entrenar comunicación, diagnóstico y nivel de detalle según el usuario.</p></div><a class="btn ghost" href="#/ticket-board">Tablero</a></section>
    <section class="grid two section">
      ${profiles.map(profile => `<article class="card"><span class="pill">${esc(profile.area)}</span><h2>${esc(profile.name)}</h2><p><strong>Nivel digital:</strong> ${esc(profile.digitalLevel)}</p><p><strong>Estilo:</strong> ${esc(profile.communicationStyle)}</p><p><strong>Riesgo:</strong> ${esc(profile.risk)}</p><h3>Tickets asociados</h3>${list((profile.ticketIds || []).map(id => getIncident(id)?.title || id))}</article>`).join("") || `<article class="card"><p>No hay perfiles configurados.</p></article>`}
    </section>`;
}

function renderTicketEvents() {
  const events = (storage.read().ticketEvents || []).slice(-8).reverse();
  if (!events.length) return `<p>Todavía no hay movimientos en el tablero.</p>`;
  return `<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Ticket</th><th>Estado</th><th>Prioridad</th><th>Puntaje</th></tr></thead><tbody>${events.map(event => {
    const ticket = getIncident(event.ticketId);
    return `<tr><td>${esc(formatDate(event.date))}</td><td>${esc(ticket?.title || event.ticketId)}</td><td>${esc(ticketStatusLabel(event.status))}</td><td>${esc(ticketPriorityLabel(event.priority))}</td><td>${event.score}/10</td></tr>`;
  }).join("")}</tbody></table></div>`;
}


function getTicketRecord(ticketId) {
  return readTicketBoard()[ticketId] || ticketBoardDefaults()[ticketId] || { status: "new", priority: "medium", score: 0, notes: "" };
}

function ticketLogEntries(ticketId) {
  const logs = storage.read().ticketLogs || {};
  return logs[ticketId] || [];
}

function addTicketLog(ticketId, entry) {
  storage.update(state => {
    state.ticketLogs = state.ticketLogs || {};
    const current = state.ticketLogs[ticketId] || [];
    state.ticketLogs[ticketId] = [...current, { ...entry, date: new Date().toISOString() }].slice(-60);
    state.visitedIncidents = [...new Set([...(state.visitedIncidents || []), ticketId])];
  });
}

function documentationScore(ticketId) {
  const record = getTicketRecord(ticketId);
  const logs = ticketLogEntries(ticketId);
  let score = 0;
  if (record.status !== "new") score += 15;
  if (record.priority) score += 10;
  if ((record.notes || "").trim().length >= 20) score += 20;
  if (logs.some(l => l.type === "sintoma")) score += 15;
  if (logs.some(l => l.type === "prueba")) score += 15;
  if (logs.some(l => l.type === "comunicacion")) score += 10;
  if (logs.some(l => l.type === "cierre" || l.type === "escalamiento")) score += 15;
  return Math.min(score, 100);
}

function supportLogTypeLabel(type) {
  const labels = {
    sintoma: "Síntoma reportado",
    prueba: "Prueba realizada",
    evidencia: "Evidencia",
    comunicacion: "Comunicación con usuario",
    solucion: "Solución aplicada",
    escalamiento: "Escalamiento",
    cierre: "Cierre"
  };
  return labels[type] || type;
}

function buildTicketClosureText(ticketId) {
  const ticket = getIncident(ticketId);
  const record = getTicketRecord(ticketId);
  const logs = ticketLogEntries(ticketId);
  const escalation = (storage.read().ticketEscalations || {})[ticketId];
  const lines = [
    `CIERRE EDUCATIVO DE TICKET`,
    `Curso: ${manifest.appName}`,
    `Ticket: ${ticket?.title || ticketId}`,
    `Fecha: ${new Date().toLocaleString("es-AR")}`,
    `Estado: ${ticketStatusLabel(record.status)}`,
    `Prioridad: ${ticketPriorityLabel(record.priority)}`,
    `Puntaje de documentación: ${documentationScore(ticketId)}%`,
    ``,
    `RESUMEN DEL CASO`,
    ticket?.summary || "Sin resumen cargado.",
    ``,
    `OBJETIVO INMEDIATO`,
    ticket?.immediateGoal || "No cargado.",
    ``,
    `NOTA DE RESOLUCIÓN / ESCALAMIENTO`,
    record.notes || "Sin nota registrada.",
    ``,
    `BITÁCORA`,
    ...(logs.length ? logs.map((entry, index) => `${index + 1}. [${formatDate(entry.date)}] ${supportLogTypeLabel(entry.type)}: ${entry.note}`) : ["Sin entradas de bitácora."]),
    ``,
    `PLANTILLA DE ESCALAMIENTO`,
    escalation?.text || "Sin escalamiento generado.",
    ``,
    `AVISO`,
    manifest.responsibleNotice || "Contenido educativo. No reemplaza procedimientos profesionales."
  ];
  return lines.join("\n");
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

async function copyText(content, selector) {
  await navigator.clipboard?.writeText(content);
  const el = selector ? document.querySelector(selector) : null;
  if (el) el.textContent = "Copiado al portapapeles.";
}

function renderTicketLog(ticketId) {
  const ticket = getIncident(ticketId);
  if (!ticket) return renderNotFound();
  const entries = ticketLogEntries(ticketId).slice().reverse();
  const score = documentationScore(ticketId);
  app.innerHTML = `
    <section class="section-head">
      <div><p class="eyebrow">v0.3 · Bitácora detallada</p><h1>${esc(ticket.title)}</h1><p>Registrá síntomas, pruebas, evidencia, comunicación, solución, escalamiento y cierre. No escribas contraseñas, tokens ni datos sensibles.</p></div>
      <a class="btn ghost" href="#/ticket-board">Volver al tablero</a>
    </section>
    <section class="grid two">
      <article class="card">
        <h2>Nueva entrada</h2>
        <label>Tipo de entrada
          <select id="logType">
            <option value="sintoma">Síntoma reportado</option>
            <option value="prueba">Prueba realizada</option>
            <option value="evidencia">Evidencia preservada</option>
            <option value="comunicacion">Comunicación con usuario</option>
            <option value="solucion">Solución aplicada</option>
            <option value="escalamiento">Escalamiento</option>
            <option value="cierre">Cierre</option>
          </select>
        </label>
        <label>Nota profesional
          <textarea id="logNote" rows="7" placeholder="Ej.: usuario informa que solo su notebook no conecta al Wi‑Fi. Se verificó que otros equipos sí navegan. Se solicita captura del error sin datos sensibles."></textarea>
        </label>
        <div class="actions"><button class="btn primary" id="addLogEntry">Agregar a bitácora</button><a class="btn ghost" href="#/ticket-export/${ticket.id}">Exportar cierre</a></div>
        <p class="muted">Puntaje de documentación: <strong>${score}%</strong></p>${renderProgressBar(score)}
      </article>
      <article class="card">
        <h2>Guía de buena documentación</h2>
        ${list(manifest.ticketDocumentation?.rules || ["Describir síntoma, impacto y alcance.", "Registrar pruebas seguras realizadas.", "Separar hechos de hipótesis.", "Cerrar con causa probable, acción y validación."])}
      </article>
    </section>
    <section class="card section">
      <h2>Entradas registradas</h2>
      ${entries.length ? `<div class="timeline">${entries.map(e => `<div class="timeline-item"><span class="pill">${esc(supportLogTypeLabel(e.type))}</span><strong>${esc(formatDate(e.date))}</strong><p>${esc(e.note)}</p></div>`).join("")}</div>` : `<p>Todavía no hay entradas para este ticket.</p>`}
    </section>`;
  document.querySelector("#addLogEntry").addEventListener("click", () => {
    const type = document.querySelector("#logType").value;
    const note = document.querySelector("#logNote").value.trim();
    if (!note) return alert("Escribí una nota antes de agregarla a la bitácora.");
    addTicketLog(ticket.id, { type, note });
    renderTicketLog(ticket.id);
  });
}

function renderTicketConversation(ticketId) {
  const ticket = getIncident(ticketId) || incidents[0];
  if (!ticket) return renderNotFound();
  const scenarios = manifest.conversationSimulator?.scenarios || [];
  const scenario = scenarios.find(s => ticket.title.toLowerCase().includes((s.match || "").toLowerCase())) || scenarios[0] || {
    userMessage: "No me funciona y lo necesito urgente.",
    goodResponse: "Entiendo la urgencia. Para ayudarte de forma segura necesito confirmar qué equipo usás, desde cuándo ocurre, qué mensaje aparece y si afecta a otros usuarios.",
    badResponse: "Reiniciá todo y avisame.",
    checklist: ["Reconocer la urgencia", "Pedir datos concretos", "Evitar culpar al usuario", "Indicar próxima acción"]
  };
  app.innerHTML = `
    <section class="section-head"><div><p class="eyebrow">v0.3 · Simulador de conversación</p><h1>Conversar con el usuario</h1><p>Practicá una respuesta profesional para el ticket: <strong>${esc(ticket.title)}</strong></p></div><a class="btn ghost" href="#/ticket-log/${ticket.id}">Abrir bitácora</a></section>
    <section class="grid two">
      <article class="card"><h2>Mensaje del usuario</h2><blockquote>${esc(scenario.userMessage)}</blockquote><h3>Debe contener</h3>${list(scenario.checklist)}</article>
      <article class="card"><h2>Tu respuesta</h2><textarea id="userReply" rows="9" placeholder="Escribí una respuesta clara, empática y accionable..."></textarea><div class="actions"><button class="btn primary" id="evaluateReply">Evaluar respuesta</button><button class="btn ghost" id="saveReplyLog">Guardar en bitácora</button></div><div id="replyFeedback" class="feedback"></div></article>
    </section>
    <section class="grid two section">
      <article class="card ok-card"><h2>Ejemplo fuerte</h2><p>${esc(scenario.goodResponse)}</p></article>
      <article class="card alert"><h2>Ejemplo débil</h2><p>${esc(scenario.badResponse)}</p></article>
    </section>`;
  document.querySelector("#evaluateReply").addEventListener("click", () => {
    const reply = document.querySelector("#userReply").value.trim();
    let score = 0;
    if (reply.length >= 80) score += 25;
    if (/entiendo|comprendo|gracias|te ayudo|vamos/i.test(reply)) score += 20;
    if (/desde cuándo|mensaje|error|captura|equipo|usuario|afecta|internet|wifi|wi-fi|contraseña|app/i.test(reply)) score += 25;
    if (/próximo|siguiente|paso|validar|probar|confirmar/i.test(reply)) score += 20;
    if (!/contraseña|clave|token|código/i.test(reply)) score += 10;
    document.querySelector("#replyFeedback").innerHTML = `<strong>Puntaje de comunicación: ${Math.min(score,100)}%</strong><br>${score >= 70 ? "Respuesta adecuada: combina empatía, diagnóstico y próxima acción." : "Respuesta mejorable: agregá más contexto, una pregunta concreta y un próximo paso seguro."}`;
  });
  document.querySelector("#saveReplyLog").addEventListener("click", () => {
    const reply = document.querySelector("#userReply").value.trim();
    if (!reply) return alert("Escribí una respuesta antes de guardarla.");
    addTicketLog(ticket.id, { type: "comunicacion", note: `Respuesta propuesta al usuario: ${reply}` });
    alert("Respuesta guardada en la bitácora del ticket.");
  });
}

function renderTicketEscalation(ticketId) {
  const ticket = getIncident(ticketId);
  if (!ticket) return renderNotFound();
  const existing = (storage.read().ticketEscalations || {})[ticket.id]?.form || {};
  app.innerHTML = `
    <section class="section-head"><div><p class="eyebrow">v0.3 · Escalamiento profesional</p><h1>Plantilla de escalamiento</h1><p>Prepará un resumen claro para red, seguridad, proveedor, administrador o nivel superior.</p></div><a class="btn ghost" href="#/ticket-board">Tablero</a></section>
    <section class="grid two">
      <article class="card"><h2>Datos para escalar</h2>
        <label>Impacto / alcance<textarea id="escImpact" rows="3">${esc(existing.impact || "")}</textarea></label>
        <label>Pruebas realizadas<textarea id="escTests" rows="4">${esc(existing.tests || "")}</textarea></label>
        <label>Evidencia adjunta o preservada<textarea id="escEvidence" rows="3">${esc(existing.evidence || "")}</textarea></label>
        <label>Motivo de escalamiento<textarea id="escReason" rows="3">${esc(existing.reason || "")}</textarea></label>
        <div class="actions"><button class="btn primary" id="generateEscalation">Generar plantilla</button><button class="btn ghost" id="copyEscalation">Copiar</button></div><p id="escalationMsg" class="muted"></p>
      </article>
      <article class="card"><h2>Resultado</h2><textarea id="escalationOutput" rows="17" readonly></textarea><div class="actions"><button class="btn ghost" id="saveEscalationLog">Guardar en bitácora</button></div></article>
    </section>`;
  const build = () => {
    const form = {
      impact: document.querySelector("#escImpact").value.trim(),
      tests: document.querySelector("#escTests").value.trim(),
      evidence: document.querySelector("#escEvidence").value.trim(),
      reason: document.querySelector("#escReason").value.trim()
    };
    const text = `ESCALAMIENTO DE TICKET\nTicket: ${ticket.title}\nPrioridad sugerida: ${ticket.severity}\n\nImpacto / alcance:\n${form.impact || "Completar impacto."}\n\nPruebas realizadas:\n${form.tests || "Completar pruebas."}\n\nEvidencia preservada:\n${form.evidence || "Completar evidencia."}\n\nMotivo de escalamiento:\n${form.reason || "Completar motivo."}\n\nSolicitud:\nRevisar el caso, confirmar alcance y proponer próxima acción segura.`;
    document.querySelector("#escalationOutput").value = text;
    storage.update(state => {
      state.ticketEscalations = state.ticketEscalations || {};
      state.ticketEscalations[ticket.id] = { form, text, updatedAt: new Date().toISOString() };
    });
    updateTicketRecord(ticket.id, { status: "escalated" });
    return text;
  };
  document.querySelector("#generateEscalation").addEventListener("click", build);
  document.querySelector("#copyEscalation").addEventListener("click", async () => copyText(document.querySelector("#escalationOutput").value || build(), "#escalationMsg"));
  document.querySelector("#saveEscalationLog").addEventListener("click", () => { const out = document.querySelector("#escalationOutput").value || build(); addTicketLog(ticket.id, { type: "escalamiento", note: out }); alert("Escalamiento guardado en bitácora."); });
  build();
}

function renderTicketExport(ticketId) {
  const ticket = getIncident(ticketId);
  if (!ticket) return renderNotFound();
  const payload = buildTicketClosureText(ticket.id);
  app.innerHTML = `
    <section class="section-head"><div><p class="eyebrow">v0.3 · Exportar cierre</p><h1>Exportar cierre del ticket</h1><p>Generá un archivo TXT educativo para practicar documentación profesional.</p></div><a class="btn ghost" href="#/ticket-log/${ticket.id}">Bitácora</a></section>
    <section class="card"><textarea class="textarea" id="closurePayload" readonly>${esc(payload)}</textarea><div class="actions"><button class="btn primary" id="copyClosure">Copiar cierre</button><button class="btn ghost" id="downloadClosure">Descargar .txt</button><a class="btn ghost" href="#/ticket-board">Tablero</a></div><p id="closureMsg" class="muted"></p></section>`;
  document.querySelector("#copyClosure").addEventListener("click", () => copyText(payload, "#closureMsg"));
  document.querySelector("#downloadClosure").addEventListener("click", () => downloadText(`cierre-ticket-${ticket.id}.txt`, payload));
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

function renderNotFound() {
  app.innerHTML = `<section class="article"><div class="card"><h1>Ruta no encontrada</h1><p>La sección solicitada no existe o el contenido fue movido.</p><a class="btn primary" href="#/">Volver al inicio</a></div></section>`;
}

bootstrap();



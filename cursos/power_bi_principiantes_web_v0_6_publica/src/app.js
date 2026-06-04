const MANIFEST_PATH = "src/data/course_manifest.json";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let dashboardLab = null;
let dashboardBuilder = null;
let storytellingLab = null;
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
    const [courseData, checklistData, incidentData, dashboardData, dashboardBuilderData, storytellingData] = await Promise.all([
      loadJson(manifest.dataPaths.course),
      loadJson(manifest.dataPaths.checklists),
      loadJson(manifest.dataPaths.incidents),
      manifest.dataPaths.dashboardLab ? loadJson(manifest.dataPaths.dashboardLab) : Promise.resolve(null),
      manifest.dataPaths.dashboardBuilder ? loadJson(manifest.dataPaths.dashboardBuilder) : Promise.resolve(null),
      manifest.dataPaths.storytellingLab ? loadJson(manifest.dataPaths.storytellingLab) : Promise.resolve(null),
    ]);
    course = courseData;
    checklists = checklistData.checklists || [];
    incidents = incidentData.incidents || [];
    dashboardLab = dashboardData || null;
    dashboardBuilder = dashboardBuilderData || null;
    storytellingLab = storytellingData || null;
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
  const rawHash = location.hash.replace(/^#\/?/, "") || "";
  const hash = rawHash.split("?")[0];
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
    "dashboard-lab": renderDashboardLab,
    "dashboard-report": renderDashboardReport,
    "kpi-builder": renderKpiBuilder,
    "dashboard-design-report": renderDashboardDesignReport,
    "storytelling": renderStorytellingLab,
    "executive-presentation": renderExecutivePresentation,
    "dashboard-reading-checklist": renderDashboardReadingChecklist,
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
    <section class="section grid two">
      <div class="card">
        <p class="eyebrow">Laboratorio v0.2</p>
        <h2>Dashboard simulado</h2>
        <p>Elegí un dataset de ejemplo, seleccioná KPIs, revisá visualizaciones sugeridas y generá un mini reporte de tablero.</p>
        <a class="btn primary" href="#/dashboard-lab">Abrir laboratorio</a><a class="btn ghost" href="#/kpi-builder">Constructor KPI</a><a class="btn ghost" href="#/storytelling">Storytelling</a>
      </div>
      <div class="card compact-helper">
        <p class="eyebrow">Accesibilidad</p>
        <h2>Lectura cómoda en cualquier pantalla</h2>
        <p>Panel de accesibilidad, foco visible, objetivos táctiles más grandes y navegación de lecciones anterior/siguiente.</p>
        <a class="btn ghost" href="#/accessibility">Abrir accesibilidad</a>
      </div>
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


function dashboardKey() {
  const id = manifest?.courseId || "power-bi";
  return `curso-web:${id}:dashboard-lab:v1`;
}

function readDashboardHistory() {
  try { return JSON.parse(localStorage.getItem(dashboardKey())) || []; } catch { return []; }
}

function writeDashboardHistory(history) {
  localStorage.setItem(dashboardKey(), JSON.stringify(history.slice(-12)));
}

function getDashboardDataset(id) {
  return (dashboardLab?.datasets || []).find(dataset => dataset.id === id) || dashboardLab?.datasets?.[0] || null;
}

function getDashboardKpisFor(datasetId) {
  return (dashboardLab?.kpis || []).filter(kpi => !kpi.bestFor || kpi.bestFor.includes(datasetId));
}

function renderSmallDataTable(dataset) {
  if (!dataset) return `<p>No hay dataset seleccionado.</p>`;
  const rows = dataset.rows || [];
  const columns = dataset.columns || Object.keys(rows[0] || {});
  return `<div class="table-wrap"><table><thead><tr>${columns.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.slice(0, 8).map(row => `<tr>${columns.map(c => `<td>${esc(row[c] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function recommendVisuals(datasetId, selectedKpis = []) {
  const visuals = dashboardLab?.visuals || [];
  const base = [];
  if (selectedKpis.includes("ventas_totales") || selectedKpis.includes("top_categoria")) base.push("bar", "card");
  if (datasetId === "ventas_mensuales") base.push("line", "slicer");
  if (datasetId === "stock_critico") base.push("table", "bar", "card");
  if (datasetId === "clientes_ventas") base.push("bar", "table", "slicer");
  const ids = [...new Set(base.length ? base : ["card", "bar", "table"])] ;
  return visuals.filter(v => ids.includes(v.id));
}

function buildDashboardReport(datasetId, selectedKpis) {
  const dataset = getDashboardDataset(datasetId);
  const kpis = (dashboardLab?.kpis || []).filter(kpi => selectedKpis.includes(kpi.id));
  const visuals = recommendVisuals(datasetId, selectedKpis);
  const template = (dashboardLab?.dashboardTemplates || []).find(t => {
    if (datasetId === "ventas_mensuales") return t.id === "ventas_basico";
    if (datasetId === "stock_critico") return t.id === "stock_operativo";
    if (datasetId === "clientes_ventas") return t.id === "clientes_concentracion";
    return false;
  });
  const lines = [
    `Reporte educativo de dashboard simulado`,
    `Curso: ${manifest.appName}`,
    `Fecha: ${new Date().toLocaleString("es-AR")}`,
    ``,
    `Pregunta de negocio: ${dataset?.recommendedQuestion || "No definida"}`,
    `Dataset elegido: ${dataset?.title || "No definido"}`,
    ``,
    `KPIs seleccionados:`,
    ...(kpis.length ? kpis.map(k => `- ${k.title}: ${k.description}`) : ["- No se seleccionaron KPIs."]),
    ``,
    `Visualizaciones sugeridas:`,
    ...(visuals.length ? visuals.map(v => `- ${v.title}: ${v.useWhen}`) : ["- No hay sugerencias." ]),
    ``,
    `Diseño conceptual recomendado:`,
    ...(template?.layout || ["Usar una tarjeta KPI, un gráfico comparativo y una tabla de detalle."]).map(x => `- ${x}`),
    ``,
    `Límites de la práctica:`,
    `- Es una simulación educativa, no Power BI real.`,
    `- Los datos son de ejemplo.`,
    `- Antes de tomar decisiones reales hay que validar fuente, fecha, calidad y contexto de negocio.`
  ];
  return lines.join("\n");
}

async function copyTextToClipboard(text, statusId) {
  try {
    await navigator.clipboard.writeText(text);
    const el = document.querySelector(statusId);
    if (el) el.textContent = "Copiado al portapapeles.";
  } catch {
    const el = document.querySelector(statusId);
    if (el) el.textContent = "No se pudo copiar automáticamente. Podés seleccionar el texto y copiarlo manualmente.";
  }
}

function downloadTextFile(filename, text) {
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

function renderDashboardLab() {
  if (!dashboardLab) return renderNotFound();
  const first = dashboardLab.datasets?.[0]?.id || "";
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Laboratorio v0.2</p>
        <h1>Dashboard simulado de Power BI</h1>
        <p class="lead">Practicá cómo pensar un dashboard antes de abrir Power BI: elegí datos, pregunta de negocio, KPIs, visualizaciones y filtros. No carga datos reales ni sensibles.</p>
      </div>
      <div class="grid two">
        <div class="card">
          <h2>1. Elegí un dataset de práctica</h2>
          <label class="field-label" for="dashDataset">Dataset</label>
          <select class="search-box" id="dashDataset">
            ${(dashboardLab.datasets || []).map(dataset => `<option value="${esc(dataset.id)}">${esc(dataset.title)}</option>`).join("")}
          </select>
          <div id="datasetDescription" class="section"></div>
        </div>
        <div class="card">
          <h2>2. Elegí KPIs</h2>
          <p>Seleccioná los indicadores que pondrías como tarjetas, gráficos o medidas simples.</p>
          <div id="kpiOptions" class="list"></div>
        </div>
      </div>
      <div class="card">
        <h2>Vista previa de datos</h2>
        <div id="datasetPreview"></div>
      </div>
      <div class="grid two">
        <div class="card">
          <h2>Visualizaciones sugeridas</h2>
          <div id="visualSuggestions"></div>
        </div>
        <div class="card">
          <h2>Mini reporte</h2>
          <p>Generá una explicación corta del tablero conceptual.</p>
          <div class="actions"><button class="btn primary" id="generateDashboardReport">Generar reporte</button><a class="btn ghost" href="#/dashboard-report">Ver historial</a></div>
          <p id="dashboardMsg" class="muted"></p>
        </div>
      </div>
      <div class="card">
        <h2>Reporte generado</h2>
        <textarea class="textarea" id="dashboardReportText" readonly placeholder="Todavía no generaste un reporte."></textarea>
        <div class="actions"><button class="btn primary" id="copyDashboardReport">Copiar</button><button class="btn ghost" id="downloadDashboardReport">Descargar .txt</button></div>
        <p id="copyDashboardStatus" class="muted"></p>
      </div>
    </section>`;

  const datasetSelect = document.querySelector("#dashDataset");
  const kpiOptions = document.querySelector("#kpiOptions");
  const datasetDescription = document.querySelector("#datasetDescription");
  const datasetPreview = document.querySelector("#datasetPreview");
  const visualSuggestions = document.querySelector("#visualSuggestions");
  const reportText = document.querySelector("#dashboardReportText");

  const paint = () => {
    const dataset = getDashboardDataset(datasetSelect.value || first);
    datasetDescription.innerHTML = `<p>${esc(dataset.description)}</p><p><strong>Pregunta guía:</strong> ${esc(dataset.recommendedQuestion)}</p>`;
    datasetPreview.innerHTML = renderSmallDataTable(dataset);
    const kpis = getDashboardKpisFor(dataset.id);
    kpiOptions.innerHTML = kpis.map(kpi => `
      <label class="check-item">
        <input type="checkbox" data-kpi="${esc(kpi.id)}">
        <span><strong>${esc(kpi.title)}</strong><br>${esc(kpi.description)}</span>
      </label>`).join("");
    const suggested = recommendVisuals(dataset.id, kpis.slice(0, 2).map(k => k.id));
    visualSuggestions.innerHTML = list(suggested.map(v => `${v.title}: ${v.useWhen}`));
    document.querySelectorAll("input[data-kpi]").forEach(input => input.addEventListener("change", updateSuggestions));
    updateSuggestions();
  };

  const selectedKpis = () => Array.from(document.querySelectorAll("input[data-kpi]:checked")).map(input => input.dataset.kpi);
  const updateSuggestions = () => {
    const dataset = getDashboardDataset(datasetSelect.value || first);
    const suggested = recommendVisuals(dataset.id, selectedKpis());
    visualSuggestions.innerHTML = list(suggested.map(v => `${v.title}: ${v.useWhen}`));
  };

  datasetSelect.addEventListener("change", paint);
  paint();

  document.querySelector("#generateDashboardReport").addEventListener("click", () => {
    const dataset = getDashboardDataset(datasetSelect.value || first);
    const kpis = selectedKpis();
    const text = buildDashboardReport(dataset.id, kpis);
    reportText.value = text;
    const history = readDashboardHistory();
    history.push({ date: new Date().toISOString(), datasetId: dataset.id, datasetTitle: dataset.title, kpis, summary: text.slice(0, 450) });
    writeDashboardHistory(history);
    document.querySelector("#dashboardMsg").textContent = "Reporte generado y guardado en historial local no sensible.";
  });
  document.querySelector("#copyDashboardReport").addEventListener("click", () => copyTextToClipboard(reportText.value || "", "#copyDashboardStatus"));
  document.querySelector("#downloadDashboardReport").addEventListener("click", () => downloadTextFile("reporte_dashboard_power_bi_simulado.txt", reportText.value || "Reporte vacío"));
}

function renderDashboardReport() {
  const history = readDashboardHistory().slice().reverse();
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Historial local</p>
        <h1>Reportes de laboratorio</h1>
        <p class="lead">Este historial guarda resúmenes de prácticas, no datos completos ni información sensible.</p>
        <div class="actions"><a class="btn primary" href="#/dashboard-lab">Volver al laboratorio</a><button class="btn ghost" id="clearDashboardHistory">Borrar historial</button></div>
      </div>
      ${history.length ? history.map(item => `
        <article class="card">
          <p class="eyebrow">${esc(formatDate(item.date))}</p>
          <h2>${esc(item.datasetTitle || item.datasetId)}</h2>
          <p><strong>KPIs:</strong> ${esc((item.kpis || []).join(", ") || "sin KPIs seleccionados")}</p>
          <pre><code>${esc(item.summary || "")}</code></pre>
        </article>`).join("") : `<div class="card"><p>Todavía no hay reportes guardados. Abrí el laboratorio y generá uno.</p></div>`}
    </section>`;
  document.querySelector("#clearDashboardHistory").addEventListener("click", () => {
    if (confirm("¿Borrar historial local de reportes de dashboard?")) {
      writeDashboardHistory([]);
      renderDashboardReport();
    }
  });
}


function dashboardDesignKey() {
  const id = manifest?.courseId || "power-bi";
  return `curso-web:${id}:dashboard-design:v1`;
}

function readDashboardDesignHistory() {
  try { return JSON.parse(localStorage.getItem(dashboardDesignKey())) || []; } catch { return []; }
}

function writeDashboardDesignHistory(history) {
  localStorage.setItem(dashboardDesignKey(), JSON.stringify(history.slice(-12)));
}

function getBuilderQuestion(id) {
  return (dashboardBuilder?.businessQuestions || []).find(q => q.id === id) || dashboardBuilder?.businessQuestions?.[0] || null;
}

function getBuilderKpi(id) {
  return (dashboardBuilder?.kpis || []).find(k => k.id === id);
}

function getBuilderVisual(id) {
  return (dashboardBuilder?.visuals || []).find(v => v.id === id);
}

function buildDashboardDesignText(questionId, selectedKpis, selectedVisuals, audience, note) {
  const question = getBuilderQuestion(questionId);
  const kpis = selectedKpis.map(getBuilderKpi).filter(Boolean);
  const visuals = selectedVisuals.map(getBuilderVisual).filter(Boolean);
  const cards = dashboardBuilder?.dashboardCards || [];
  const tips = dashboardBuilder?.designTips || [];
  const lines = [
    `Diseño educativo de dashboard Power BI`,
    `Curso: ${manifest.appName}`,
    `Fecha: ${new Date().toLocaleString("es-AR")}`,
    ``,
    `Pregunta de negocio elegida: ${question?.title || "No definida"}`,
    `Descripción: ${question?.description || "Sin descripción"}`,
    `Audiencia del reporte: ${audience || "No especificada"}`,
    ``,
    `KPIs sugeridos/seleccionados:`,
    ...(kpis.length ? kpis.map(k => `- ${k.title} (${k.formula}): ${k.why}`) : ["- Sin KPIs seleccionados."]),
    ``,
    `Visualizaciones recomendadas:`,
    ...(visuals.length ? visuals.map(v => `- ${v.title}: ${v.bestFor}`) : ["- Sin visualizaciones seleccionadas."]),
    ``,
    `Tarjetas simuladas de tablero:`,
    ...cards.slice(0, 4).map(c => `- ${c.title}: ${c.value}. ${c.note}`),
    ``,
    `Consejos de diseño aplicables:`,
    ...tips.slice(0, 6).map(t => `- ${t}`),
    ``,
    `Nota propia del estudiante:`,
    note || "Sin nota agregada.",
    ``,
    `Límites:`,
    `- Es una práctica conceptual, no un archivo .pbix real.`,
    `- Antes de publicar un dashboard real se deben validar datos, reglas de negocio, permisos y calidad de fuentes.`
  ];
  return lines.join("\n");
}

function renderKpiBuilder() {
  if (!dashboardBuilder) return renderNotFound();
  const first = dashboardBuilder.businessQuestions?.[0]?.id || "";
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Laboratorio v0.3</p>
        <h1>Constructor de KPIs y visualizaciones</h1>
        <p class="lead">Elegí una pregunta de negocio, seleccioná indicadores y armá un diseño conceptual de tablero. El objetivo es aprender a pensar un dashboard antes de construirlo en Power BI.</p>
        <div class="actions"><a class="btn ghost" href="#/dashboard-lab">Volver al laboratorio</a><a class="btn ghost" href="#/dashboard-design-report">Ver historial</a></div>
      </div>
      <div class="grid two">
        <div class="card">
          <h2>1. Pregunta de negocio</h2>
          <label class="field-label" for="businessQuestion">Pregunta</label>
          <select class="search-box" id="businessQuestion">
            ${(dashboardBuilder.businessQuestions || []).map(q => `<option value="${esc(q.id)}">${esc(q.title)}</option>`).join("")}
          </select>
          <div id="questionDescription" class="section"></div>
        </div>
        <div class="card">
          <h2>2. Audiencia y objetivo</h2>
          <label class="field-label" for="dashboardAudience">¿Quién leerá el dashboard?</label>
          <input class="search-box" id="dashboardAudience" placeholder="Ej.: dueño del negocio, gerente, equipo comercial">
          <label class="field-label" for="dashboardNote">Nota propia</label>
          <textarea class="textarea small" id="dashboardNote" placeholder="Ej.: quiero que el tablero muestre ventas, margen y alertas de stock"></textarea>
        </div>
      </div>
      <div class="grid two">
        <div class="card">
          <h2>3. KPIs recomendados</h2>
          <div id="builderKpis" class="list"></div>
        </div>
        <div class="card">
          <h2>4. Visualizaciones recomendadas</h2>
          <div id="builderVisuals" class="list"></div>
        </div>
      </div>
      <div class="card">
        <h2>Tarjetas simuladas de dashboard</h2>
        <div class="stats-grid">${(dashboardBuilder.dashboardCards || []).map(card => `<div class="stat"><strong>${esc(card.value)}</strong><span>${esc(card.title)}</span><small>${esc(card.note)}</small></div>`).join("")}</div>
      </div>
      <div class="card">
        <h2>Reporte de diseño</h2>
        <div class="actions"><button class="btn primary" id="generateDesignReport">Generar reporte</button><button class="btn ghost" id="copyDesignReport">Copiar</button><button class="btn ghost" id="downloadDesignReport">Descargar .txt</button></div>
        <textarea class="textarea" id="designReportText" readonly placeholder="Todavía no generaste un reporte de diseño."></textarea>
        <p id="designReportStatus" class="muted"></p>
      </div>
    </section>`;

  const questionSelect = document.querySelector("#businessQuestion");
  const questionDescription = document.querySelector("#questionDescription");
  const kpisBox = document.querySelector("#builderKpis");
  const visualsBox = document.querySelector("#builderVisuals");
  const reportText = document.querySelector("#designReportText");

  const paintQuestion = () => {
    const question = getBuilderQuestion(questionSelect.value || first);
    questionDescription.innerHTML = `<p>${esc(question.description)}</p><p><strong>Uso recomendado:</strong> ${esc(question.title)}</p>`;
    kpisBox.innerHTML = (dashboardBuilder.kpis || []).map(kpi => {
      const recommended = question.recommendedKpis?.includes(kpi.id);
      return `<label class="check-item ${recommended ? "selected-soft" : ""}"><input type="checkbox" data-builder-kpi="${esc(kpi.id)}" ${recommended ? "checked" : ""}><span><strong>${esc(kpi.title)}</strong><br>${esc(kpi.formula)} · ${esc(kpi.why)}</span></label>`;
    }).join("");
    visualsBox.innerHTML = (dashboardBuilder.visuals || []).map(visual => {
      const recommended = question.recommendedVisuals?.includes(visual.id);
      return `<label class="check-item ${recommended ? "selected-soft" : ""}"><input type="checkbox" data-builder-visual="${esc(visual.id)}" ${recommended ? "checked" : ""}><span><strong>${esc(visual.title)}</strong><br>${esc(visual.bestFor)}</span></label>`;
    }).join("");
  };

  const selectedKpis = () => Array.from(document.querySelectorAll("input[data-builder-kpi]:checked")).map(input => input.dataset.builderKpi);
  const selectedVisuals = () => Array.from(document.querySelectorAll("input[data-builder-visual]:checked")).map(input => input.dataset.builderVisual);

  questionSelect.addEventListener("change", paintQuestion);
  paintQuestion();

  document.querySelector("#generateDesignReport").addEventListener("click", () => {
    const text = buildDashboardDesignText(
      questionSelect.value || first,
      selectedKpis(),
      selectedVisuals(),
      document.querySelector("#dashboardAudience").value.trim(),
      document.querySelector("#dashboardNote").value.trim()
    );
    reportText.value = text;
    const history = readDashboardDesignHistory();
    const question = getBuilderQuestion(questionSelect.value || first);
    history.push({ date: new Date().toISOString(), questionId: question?.id, questionTitle: question?.title, kpis: selectedKpis(), visuals: selectedVisuals(), summary: text.slice(0, 500) });
    writeDashboardDesignHistory(history);
    document.querySelector("#designReportStatus").textContent = "Reporte generado y guardado en historial local no sensible.";
  });
  document.querySelector("#copyDesignReport").addEventListener("click", () => copyTextToClipboard(reportText.value || "", "#designReportStatus"));
  document.querySelector("#downloadDesignReport").addEventListener("click", () => downloadTextFile("diseno_dashboard_power_bi.txt", reportText.value || "Reporte vacío"));
}

function renderDashboardDesignReport() {
  const history = readDashboardDesignHistory().slice().reverse();
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Historial local</p>
        <h1>Diseños de dashboard</h1>
        <p class="lead">Se guardan resúmenes educativos, no datos empresariales reales.</p>
        <div class="actions"><a class="btn primary" href="#/kpi-builder">Volver al constructor</a><button class="btn ghost" id="clearDesignHistory">Borrar historial</button></div>
      </div>
      ${history.length ? history.map(item => `<article class="card"><p class="eyebrow">${esc(formatDate(item.date))}</p><h2>${esc(item.questionTitle || item.questionId)}</h2><p><strong>KPIs:</strong> ${esc((item.kpis || []).join(", ") || "sin selección")}</p><p><strong>Visuales:</strong> ${esc((item.visuals || []).join(", ") || "sin selección")}</p><pre><code>${esc(item.summary || "")}</code></pre></article>`).join("") : `<div class="card"><p>Todavía no hay diseños guardados.</p></div>`}
    </section>`;
  document.querySelector("#clearDesignHistory").addEventListener("click", () => {
    if (confirm("¿Borrar historial local de diseños de dashboard?")) {
      writeDashboardDesignHistory([]);
      renderDashboardDesignReport();
    }
  });
}


function storytellingKey() {
  const id = manifest?.courseId || "power-bi";
  return `curso-web:${id}:storytelling:v1`;
}

function readStorytellingHistory() {
  try { return JSON.parse(localStorage.getItem(storytellingKey())) || []; } catch { return []; }
}

function writeStorytellingHistory(history) {
  localStorage.setItem(storytellingKey(), JSON.stringify(history.slice(-12)));
}

function getStoryScenario(id) {
  return (storytellingLab?.executiveScenarios || []).find(s => s.id === id) || storytellingLab?.executiveScenarios?.[0] || null;
}

function buildExecutiveStoryText(scenarioId, presenter, recommendation, nextStep) {
  const scenario = getStoryScenario(scenarioId);
  const template = storytellingLab?.presentationTemplate || { sections: [] };
  const lines = [
    `Presentación ejecutiva educativa - Power BI`,
    `Curso: ${manifest.appName}`,
    `Fecha: ${new Date().toLocaleString("es-AR")}`,
    ``,
    `Escenario: ${scenario?.title || "No definido"}`,
    `Audiencia: ${scenario?.audience || "No definida"}`,
    `Presenta: ${presenter || "No especificado"}`,
    ``,
    `1. Pregunta de negocio`,
    scenario?.context || "Sin contexto.",
    ``,
    `2. Hallazgo principal`,
    scenario?.keyMessage || "Sin hallazgo definido.",
    ``,
    `3. Evidencia sugerida del dashboard`,
    ...(scenario?.suggestedVisuals || []).map(v => `- ${v}`),
    ``,
    `4. Estructura recomendada para explicar`,
    ...(scenario?.recommendedStructure || []).map(step => `- ${step}`),
    ``,
    `5. Riesgos o límites`,
    ...(scenario?.risks || []).map(r => `- ${r}`),
    ``,
    `6. Recomendación concreta`,
    recommendation || "Definir una acción concreta antes de cerrar la presentación.",
    ``,
    `7. Próximo paso`,
    nextStep || "Validar datos, responsables y fecha de revisión.",
    ``,
    `Preguntas de cierre sugeridas`,
    ...(template.closingQuestions || []).map(q => `- ${q}`),
    ``,
    `Nota: práctica educativa. Antes de presentar un tablero real, validar fuentes, permisos, calidad de datos y reglas de negocio.`
  ];
  return lines.join("\n");
}

function renderStorytellingLab() {
  if (!storytellingLab) return renderNotFound();
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Laboratorio v0.4</p>
        <h1>Storytelling con datos</h1>
        <p class="lead">Aprendé a explicar un dashboard de Power BI como una historia de negocio: pregunta, hallazgo, evidencia, límites y próxima acción.</p>
        <div class="actions"><a class="btn primary" href="#/executive-presentation">Simular presentación</a><a class="btn ghost" href="#/dashboard-reading-checklist">Checklist de lectura</a><a class="btn ghost" href="#/kpi-builder">Constructor KPI</a></div>
      </div>
      <div class="grid two">
        ${(storytellingLab.executiveScenarios || []).map(scenario => `
          <article class="card">
            <p class="eyebrow">Escenario ejecutivo</p>
            <h2>${esc(scenario.title)}</h2>
            <p>${esc(scenario.context)}</p>
            <p><strong>Mensaje clave:</strong> ${esc(scenario.keyMessage)}</p>
            <p><strong>Audiencia:</strong> ${esc(scenario.audience)}</p>
            <div class="actions"><a class="btn ghost" href="#/executive-presentation?scenario=${esc(scenario.id)}">Practicar este caso</a></div>
          </article>`).join("")}
      </div>
      <div class="card">
        <h2>Reglas simples para contar datos</h2>
        ${list(storytellingLab.storytellingTips || [])}
      </div>
    </section>`;
}

function renderExecutivePresentation() {
  if (!storytellingLab) return renderNotFound();
  const params = new URLSearchParams((location.hash.split("?")[1] || ""));
  const initial = params.get("scenario") || storytellingLab.executiveScenarios?.[0]?.id || "";
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Simulador de presentación</p>
        <h1>Presentación ejecutiva del dashboard</h1>
        <p class="lead">Elegí un escenario, completá una recomendación y generá un reporte breve para explicar el tablero a una persona no técnica.</p>
        <div class="actions"><a class="btn ghost" href="#/storytelling">Volver a storytelling</a><a class="btn ghost" href="#/dashboard-reading-checklist">Checklist de lectura</a></div>
      </div>
      <div class="grid two">
        <div class="card">
          <h2>1. Escenario</h2>
          <label class="field-label" for="storyScenario">Caso</label>
          <select class="search-box" id="storyScenario">
            ${(storytellingLab.executiveScenarios || []).map(s => `<option value="${esc(s.id)}" ${s.id === initial ? "selected" : ""}>${esc(s.title)}</option>`).join("")}
          </select>
          <div id="scenarioPreview" class="section"></div>
        </div>
        <div class="card">
          <h2>2. Cierre ejecutivo</h2>
          <label class="field-label" for="presenterName">Rol o nombre opcional</label>
          <input class="search-box" id="presenterName" placeholder="Ej.: analista junior, equipo comercial">
          <label class="field-label" for="storyRecommendation">Recomendación concreta</label>
          <textarea class="textarea small" id="storyRecommendation" placeholder="Ej.: revisar reposición de productos críticos antes del viernes"></textarea>
          <label class="field-label" for="storyNextStep">Próximo paso</label>
          <textarea class="textarea small" id="storyNextStep" placeholder="Ej.: validar stock real y actualizar dashboard semanalmente"></textarea>
        </div>
      </div>
      <div class="card">
        <h2>Reporte ejecutivo</h2>
        <div class="actions"><button class="btn primary" id="generateStoryReport">Generar reporte</button><button class="btn ghost" id="copyStoryReport">Copiar</button><button class="btn ghost" id="downloadStoryReport">Descargar .txt</button><button class="btn ghost" onclick="window.print()">Imprimir/PDF</button></div>
        <textarea class="textarea" id="storyReportText" readonly placeholder="Todavía no generaste un reporte."></textarea>
        <p id="storyReportStatus" class="muted"></p>
      </div>
    </section>`;

  const select = document.querySelector("#storyScenario");
  const preview = document.querySelector("#scenarioPreview");
  const report = document.querySelector("#storyReportText");
  const paint = () => {
    const scenario = getStoryScenario(select.value);
    preview.innerHTML = `
      <p><strong>Contexto:</strong> ${esc(scenario.context)}</p>
      <p><strong>Mensaje clave:</strong> ${esc(scenario.keyMessage)}</p>
      <p><strong>Visuales sugeridos:</strong> ${(scenario.suggestedVisuals || []).map(esc).join(", ")}</p>
      <p><strong>Riesgos:</strong> ${(scenario.risks || []).map(esc).join(", ")}</p>`;
  };
  select.addEventListener("change", paint);
  paint();

  document.querySelector("#generateStoryReport").addEventListener("click", () => {
    const text = buildExecutiveStoryText(select.value, document.querySelector("#presenterName").value.trim(), document.querySelector("#storyRecommendation").value.trim(), document.querySelector("#storyNextStep").value.trim());
    report.value = text;
    const scenario = getStoryScenario(select.value);
    const history = readStorytellingHistory();
    history.push({ date: new Date().toISOString(), scenarioId: scenario?.id, scenarioTitle: scenario?.title, summary: text.slice(0, 550) });
    writeStorytellingHistory(history);
    document.querySelector("#storyReportStatus").textContent = "Reporte generado y guardado en historial local no sensible.";
  });
  document.querySelector("#copyStoryReport").addEventListener("click", () => copyTextToClipboard(report.value || "", "#storyReportStatus"));
  document.querySelector("#downloadStoryReport").addEventListener("click", () => downloadTextFile("presentacion_ejecutiva_power_bi.txt", report.value || "Reporte vacío"));
}

function renderDashboardReadingChecklist() {
  if (!storytellingLab) return renderNotFound();
  const history = readStorytellingHistory().slice().reverse();
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Lectura de dashboard</p>
        <h1>Checklist para leer un tablero</h1>
        <p class="lead">Usá esta lista antes de tomar decisiones con un dashboard. Ayuda a revisar filtros, períodos, métricas y límites del análisis.</p>
        <div class="actions"><a class="btn primary" href="#/storytelling">Volver a storytelling</a><button class="btn ghost" onclick="window.print()">Imprimir/PDF</button></div>
      </div>
      <div class="card printable-card">
        <h2>Checklist de lectura</h2>
        ${(storytellingLab.dashboardReadingChecklist || []).map((item, idx) => `<label class="check-item"><input type="checkbox"><span><strong>${idx + 1}.</strong> ${esc(item)}</span></label>`).join("")}
      </div>
      <div class="card">
        <h2>Historial de presentaciones simuladas</h2>
        ${history.length ? history.map(item => `<article class="soft-card"><p class="eyebrow">${esc(formatDate(item.date))}</p><h3>${esc(item.scenarioTitle || item.scenarioId)}</h3><pre><code>${esc(item.summary || "")}</code></pre></article>`).join("") : `<p>Todavía no hay presentaciones guardadas.</p>`}
      </div>
    </section>`;
}

function renderNotFound() {
  app.innerHTML = `<section class="article"><div class="card"><h1>Ruta no encontrada</h1><p>La sección solicitada no existe o el contenido fue movido.</p><a class="btn primary" href="#/">Volver al inicio</a></div></section>`;
}

bootstrap();



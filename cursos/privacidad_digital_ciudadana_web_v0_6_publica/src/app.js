const MANIFEST_PATH = "src/data/course_manifest.json";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let privacyAudit = null;
let privacyGuides = null;
let privacyRoutine = null;
let quizRuntime = { moduleId: null, answers: {} };
let deferredInstallPrompt = null;

const app = document.querySelector("#app");

function storageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:progress:v1`;
}

const emptyProgress = () => ({ lessons: [], quizzes: {}, checklistItems: [], visitedIncidents: [], updatedAt: null });

function privacyStorageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:privacy-audit:v1`;
}

function readPrivacyHistory() {
  try { return JSON.parse(localStorage.getItem(privacyStorageKey())) || []; } catch { return []; }
}

function writePrivacyHistory(items) {
  localStorage.setItem(privacyStorageKey(), JSON.stringify(items.slice(-12)));
}

function privacyRoutineStorageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:privacy-routine:v1`;
}

function readPrivacyRoutineHistory() {
  try { return JSON.parse(localStorage.getItem(privacyRoutineStorageKey())) || []; } catch { return []; }
}

function writePrivacyRoutineHistory(items) {
  localStorage.setItem(privacyRoutineStorageKey(), JSON.stringify(items.slice(-16)));
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
    const [courseData, checklistData, incidentData, privacyAuditData, privacyGuidesData, privacyRoutineData] = await Promise.all([
      loadJson(manifest.dataPaths.course),
      loadJson(manifest.dataPaths.checklists),
      loadJson(manifest.dataPaths.incidents),
      manifest.dataPaths.privacyAudit ? loadJson(manifest.dataPaths.privacyAudit) : Promise.resolve(null),
      manifest.dataPaths.privacyGuides ? loadJson(manifest.dataPaths.privacyGuides) : Promise.resolve(null),
      manifest.dataPaths.privacyRoutine ? loadJson(manifest.dataPaths.privacyRoutine) : Promise.resolve(null),
    ]);
    course = courseData;
    checklists = checklistData.checklists || [];
    incidents = incidentData.incidents || [];
    privacyAudit = privacyAuditData;
    privacyGuides = privacyGuidesData;
    privacyRoutine = privacyRoutineData;
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
  if (manifest.dataPaths?.privacyAudit && (!privacyAudit?.questions?.length || !privacyAudit?.riskLevels?.length)) errors.push("privacy_audit.json incompleto.");
  if (manifest.dataPaths?.privacyRoutine && (!privacyRoutine?.routineItems?.length || !privacyRoutine?.monthlyChecklist?.length)) errors.push("privacy_routine.json incompleto.");
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
    "privacy-audit": renderPrivacyAudit,
    "privacy-audit-result": renderPrivacyAuditResult,
    "privacy-history": renderPrivacyAuditHistory,
    "privacy-guides": renderPrivacyGuides,
    "privacy-guide": () => renderPrivacyGuide(p1),
    "privacy-routine": renderPrivacyRoutine,
    "privacy-report": renderPrivacyPrintableReport,
    "monthly-privacy-checklist": renderMonthlyPrivacyChecklist,
    "privacy-routine-history": renderPrivacyRoutineHistory,
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
          <a class="btn primary" href="#/privacy-audit">Auditor de privacidad</a>
          <a class="btn ghost" href="#/privacy-guides">Guías paso a paso</a>
          <a class="btn ghost" href="#/privacy-routine">Rutina ciudadana</a>
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
        <p class="eyebrow">v0.3</p>
        <h2>Auditor y guías paso a paso</h2>
        <p>Combiná el auditor local con guías simples para revisar WhatsApp, Android, Google, navegador, ubicación, nube y un celular antes de venderlo o prestarlo. La v0.4 suma una rutina semanal/mensual y reportes imprimibles.</p>
      </div>
      <div class="actions"><a class="btn primary" href="#/privacy-audit">Abrir auditor</a><a class="btn ghost" href="#/privacy-guides">Ver guías</a><a class="btn ghost" href="#/privacy-routine">Rutina v0.4</a></div>
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


function getPrivacyLevel(score) {
  const levels = privacyAudit?.riskLevels || [];
  return levels.find(level => score >= level.min && score <= level.max) || levels[levels.length - 1] || { label: "Sin nivel", tone: "warn", summary: "No se pudo calcular el nivel." };
}

function readPrivacyDraft() {
  try { return JSON.parse(sessionStorage.getItem(`${privacyStorageKey()}:draft`)) || {}; } catch { return {}; }
}

function writePrivacyDraft(answers) {
  sessionStorage.setItem(`${privacyStorageKey()}:draft`, JSON.stringify(answers));
}

function calculatePrivacyAudit(answers) {
  const questions = privacyAudit?.questions || [];
  let score = 0;
  const reviewAreas = [];
  const selected = [];
  for (const question of questions) {
    const index = Number(answers[question.id]);
    const option = question.options?.[index];
    if (!option) continue;
    score += Number(option.score || 0);
    selected.push({ id: question.id, label: question.label, question: question.question, option: option.text, score: Number(option.score || 0) });
    if (Number(option.score || 0) >= 10) reviewAreas.push(question.id);
  }
  const maxScore = questions.reduce((sum, q) => sum + Math.max(...(q.options || []).map(o => Number(o.score || 0))), 0) || 1;
  const percentScore = Math.min(100, Math.round((score / maxScore) * 100));
  const level = getPrivacyLevel(percentScore);
  const recs = [...new Set(reviewAreas.flatMap(area => privacyAudit.recommendations?.[area] || []))];
  return { score: percentScore, rawScore: score, maxScore, level, reviewAreas, selected, recommendations: recs.slice(0, 12), date: new Date().toISOString() };
}

function renderPrivacyAudit() {
  if (!privacyAudit) return renderNotFound();
  const answers = readPrivacyDraft();
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Privacidad v0.2</p>
        <h1>${esc(privacyAudit.title || "Auditor de privacidad")}</h1>
        <p class="lead">${esc(privacyAudit.intro || "Revisá permisos, cuentas y hábitos de privacidad.")}</p>
        <div class="pill-row"><span class="pill ok">Local</span><span class="pill warn">No ingreses datos personales</span><span class="pill">Reporte exportable</span></div>
      </div>
      <form class="card audit-form" id="privacyAuditForm">
        <h2>Formulario de revisión</h2>
        ${(privacyAudit.questions || []).map((q, qi) => `
          <fieldset class="audit-field">
            <legend><span class="pill">${qi + 1}</span> ${esc(q.label)}</legend>
            <p>${esc(q.question)}</p>
            ${(q.options || []).map((option, idx) => `
              <label class="check-item audit-option">
                <input type="radio" name="${esc(q.id)}" value="${idx}" ${String(answers[q.id]) === String(idx) ? "checked" : ""} required>
                <span>${esc(option.text)}</span>
              </label>`).join("")}
          </fieldset>`).join("")}
        <div class="card alert embedded-note">
          <h3>Antes de calcular</h3>
          <p>No escribas nombres de apps, direcciones de correo, teléfonos, contraseñas ni datos personales. La herramienta solo necesita opciones generales.</p>
        </div>
        <div class="actions">
          <button class="btn primary" type="submit">Calcular riesgo</button>
          <button class="btn ghost" type="button" id="clearAuditDraft">Limpiar respuestas</button>
          <a class="btn ghost" href="#/privacy-history">Ver historial</a>
        </div>
      </form>
    </section>`;
  document.querySelectorAll("#privacyAuditForm input[type=radio]").forEach(input => {
    input.addEventListener("change", () => {
      const current = readPrivacyDraft();
      current[input.name] = input.value;
      writePrivacyDraft(current);
    });
  });
  document.querySelector("#clearAuditDraft").addEventListener("click", () => {
    sessionStorage.removeItem(`${privacyStorageKey()}:draft`);
    renderPrivacyAudit();
  });
  document.querySelector("#privacyAuditForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const answerMap = {};
    for (const question of privacyAudit.questions || []) answerMap[question.id] = form.get(question.id);
    const result = calculatePrivacyAudit(answerMap);
    sessionStorage.setItem(`${privacyStorageKey()}:last-result`, JSON.stringify(result));
    const summary = { date: result.date, score: result.score, level: result.level.label, areas: result.reviewAreas };
    writePrivacyHistory([...readPrivacyHistory(), summary]);
    routeTo("#/privacy-audit-result");
  });
}

function getLastPrivacyResult() {
  try { return JSON.parse(sessionStorage.getItem(`${privacyStorageKey()}:last-result`)); } catch { return null; }
}

function privacyReportText(result) {
  if (!result) return "Sin resultado.";
  return [
    `Reporte educativo de privacidad — ${manifest.appName}`,
    `Fecha: ${formatDate(result.date)}`,
    `Nivel: ${result.level.label}`,
    `Puntaje de exposición: ${result.score}/100`,
    `Resumen: ${result.level.summary}`,
    "",
    "Áreas revisadas:",
    ...(result.selected || []).map(item => `- ${item.label}: ${item.option}`),
    "",
    "Recomendaciones prioritarias:",
    ...((result.recommendations || []).length ? result.recommendations.map(r => `- ${r}`) : ["- Mantener una revisión mensual de permisos, cuentas y privacidad."]),
    "",
    "Aviso: contenido educativo. No reemplaza asesoramiento profesional ni políticas oficiales de plataformas."
  ].join("\n");
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

function renderPrivacyAuditResult() {
  const result = getLastPrivacyResult();
  if (!result) {
    app.innerHTML = `<section class="article"><div class="card"><h1>No hay resultado reciente</h1><p>Primero completá el auditor de privacidad.</p><a class="btn primary" href="#/privacy-audit">Abrir auditor</a></div></section>`;
    return;
  }
  const report = privacyReportText(result);
  app.innerHTML = `
    <section class="article">
      <div class="card ${result.level.tone === "danger" ? "danger-card" : ""}">
        <p class="eyebrow">Resultado del auditor</p>
        <h1>${esc(result.level.label)}</h1>
        <p class="lead">${esc(result.level.summary)}</p>
        <div class="pill-row"><span class="pill ${result.score >= 50 ? "danger" : result.score >= 25 ? "warn" : "ok"}">Exposición ${result.score}/100</span><span class="pill">${result.reviewAreas.length} áreas para revisar</span></div>
        ${renderProgressBar(result.score)}
      </div>
      <div class="card">
        <h2>Áreas con mayor prioridad</h2>
        ${(result.selected || []).filter(item => item.score >= 10).length ? list((result.selected || []).filter(item => item.score >= 10).map(item => `${item.label}: ${item.option}`)) : `<p>No aparecen áreas críticas en este resultado.</p>`}
      </div>
      <div class="card">
        <h2>Recomendaciones copiables</h2>
        ${list(result.recommendations || [])}
        <div class="actions"><button class="btn primary" id="copyPrivacyReport">Copiar reporte</button><button class="btn ghost" id="downloadPrivacyReport">Descargar .txt</button><a class="btn ghost" href="#/privacy-audit">Repetir auditor</a></div>
        <p id="privacyReportMsg" class="muted"></p>
      </div>
      <div class="card">
        <h2>Reporte completo</h2>
        <textarea class="textarea" readonly>${esc(report)}</textarea>
      </div>
    </section>`;
  document.querySelector("#copyPrivacyReport").addEventListener("click", async () => {
    await navigator.clipboard?.writeText(report);
    document.querySelector("#privacyReportMsg").textContent = "Reporte copiado.";
  });
  document.querySelector("#downloadPrivacyReport").addEventListener("click", () => downloadText("reporte_privacidad_digital.txt", report));
}

function renderPrivacyAuditHistory() {
  const history = readPrivacyHistory().slice().reverse();
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Historial local</p><h1>Auditorías recientes</h1><p>${esc(privacyAudit?.safeHistoryNotice || "El historial guarda solo datos mínimos no sensibles.")}</p></div>
      <div class="card">
        <h2>Últimas revisiones</h2>
        ${history.length ? `<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Nivel</th><th>Puntaje</th><th>Áreas</th></tr></thead><tbody>${history.map(item => `<tr><td>${esc(formatDate(item.date))}</td><td>${esc(item.level)}</td><td>${esc(item.score)}/100</td><td>${esc((item.areas || []).join(", ") || "sin áreas críticas")}</td></tr>`).join("")}</tbody></table></div>` : `<p>No hay auditorías guardadas todavía.</p>`}
        <div class="actions"><a class="btn primary" href="#/privacy-audit">Nueva auditoría</a><button class="btn danger" id="clearPrivacyHistory">Borrar historial</button></div>
      </div>
    </section>`;
  document.querySelector("#clearPrivacyHistory").addEventListener("click", () => {
    if (confirm("¿Borrar historial local del auditor?")) {
      writePrivacyHistory([]);
      renderPrivacyAuditHistory();
    }
  });
}


function renderPrivacyGuides() {
  if (!privacyGuides) return renderNotFound();
  const guides = privacyGuides.guides || [];
  const categories = [...new Set(guides.map(g => g.category).filter(Boolean))];
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Privacidad v0.3</p>
        <h1>${esc(privacyGuides.title || "Guías paso a paso")}</h1>
        <p class="lead">${esc(privacyGuides.intro || "Guías simples para revisar configuraciones de privacidad.")}</p>
        <div class="pill-row"><span class="pill ok">Paso a paso</span><span class="pill">Copiar</span><span class="pill">Imprimir</span><span class="pill warn">Revisar canales oficiales</span></div>
      </div>
      <div class="card toolbar-card">
        <label for="guideSearch"><strong>Buscar guía</strong></label>
        <input id="guideSearch" class="input" type="search" placeholder="Ej.: WhatsApp, ubicación, cookies, nube..." />
        <div class="pill-row" id="guideCategories"><button class="pill filter-pill active" data-category="">Todas</button>${categories.map(c => `<button class="pill filter-pill" data-category="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      </div>
      <div class="grid cards-grid" id="privacyGuidesGrid"></div>
      <div class="card embedded-note"><h2>Uso seguro</h2><p>${esc(privacyGuides.safeUseNotice || "Estas guías son educativas y generales.")}</p></div>
    </section>`;
  const search = document.querySelector("#guideSearch");
  const grid = document.querySelector("#privacyGuidesGrid");
  let activeCategory = "";
  function draw() {
    const q = normalize(search.value || "");
    const filtered = guides.filter(g => (!activeCategory || g.category === activeCategory) && (!q || normalize(`${g.title} ${g.category} ${g.goal}`).includes(q)));
    grid.innerHTML = filtered.map(g => `
      <article class="card item-card">
        <span class="pill">${esc(g.category || "Guía")}</span>
        <h2>${esc(g.title)}</h2>
        <p>${esc(g.goal)}</p>
        <p><strong>Dificultad:</strong> ${esc(g.difficulty || "Básica")}</p>
        <a class="btn primary" href="#/privacy-guide/${g.id}">Abrir guía</a>
      </article>`).join("") || `<div class="card"><p>No encontré guías con ese filtro.</p></div>`;
  }
  search.addEventListener("input", draw);
  document.querySelectorAll("#guideCategories [data-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category || "";
      document.querySelectorAll("#guideCategories [data-category]").forEach(b => b.classList.toggle("active", b === btn));
      draw();
    });
  });
  draw();
}

function privacyGuideText(guide) {
  return [
    `Guía paso a paso — ${guide.title}`,
    `Curso: ${manifest.appName}`,
    `Categoría: ${guide.category || "General"}`,
    `Objetivo: ${guide.goal}`,
    "",
    "Antes de empezar:",
    ...(guide.beforeYouStart || []).map((x, i) => `${i + 1}. ${x}`),
    "",
    "Pasos:",
    ...(guide.steps || []).map((x, i) => `${i + 1}. ${x}`),
    "",
    "Errores a evitar:",
    ...(guide.avoid || []).map(x => `- ${x}`),
    "",
    `Resultado esperado: ${guide.result || "Configuración revisada."}`,
    "",
    "Aviso: guía educativa general. Las pantallas pueden cambiar según versión o plataforma."
  ].join("\n");
}

function renderPrivacyGuide(id) {
  if (!privacyGuides) return renderNotFound();
  const guide = (privacyGuides.guides || []).find(g => g.id === id);
  if (!guide) return renderNotFound();
  const text = privacyGuideText(guide);
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Guía de privacidad</p>
        <h1>${esc(guide.title)}</h1>
        <p class="lead">${esc(guide.goal)}</p>
        <div class="pill-row"><span class="pill">${esc(guide.category || "General")}</span><span class="pill">${esc(guide.difficulty || "Básico")}</span></div>
      </div>
      <div class="grid two">
        <div class="card"><h2>Antes de empezar</h2>${list(guide.beforeYouStart || [])}</div>
        <div class="card"><h2>Errores a evitar</h2>${list(guide.avoid || [])}</div>
      </div>
      <div class="card step-card">
        <h2>Pasos</h2>
        <ol class="steps-list">${(guide.steps || []).map(step => `<li>${esc(step)}</li>`).join("")}</ol>
      </div>
      <div class="card ok-card"><h2>Resultado esperado</h2><p>${esc(guide.result || "Configuración revisada.")}</p></div>
      <div class="card">
        <h2>Copiar o guardar guía</h2>
        <textarea class="textarea" readonly>${esc(text)}</textarea>
        <div class="actions"><button class="btn primary" id="copyGuide">Copiar guía</button><button class="btn ghost" id="downloadGuide">Descargar .txt</button><button class="btn ghost" id="printGuide">Imprimir / PDF</button><a class="btn ghost" href="#/privacy-guides">Volver a guías</a></div>
        <p id="guideMsg" class="muted"></p>
      </div>
    </section>`;
  document.querySelector("#copyGuide").addEventListener("click", async () => {
    await navigator.clipboard?.writeText(text);
    document.querySelector("#guideMsg").textContent = "Guía copiada.";
  });
  document.querySelector("#downloadGuide").addEventListener("click", () => downloadText(`${guide.id}.txt`, text));
  document.querySelector("#printGuide").addEventListener("click", () => window.print());
}


function priorityPill(priority) {
  const map = { critica: "danger", alta: "danger", media: "warn", baja: "ok" };
  return `<span class="pill ${map[priority] || ""}">${esc(priority || "general")}</span>`;
}

function privacyRoutineReportText(selectedItems = []) {
  const items = selectedItems.length ? selectedItems : (privacyRoutine?.routineItems || []);
  return [
    `Reporte ciudadano de privacidad — ${manifest.appName}`,
    `Fecha: ${new Date().toLocaleString("es-AR")}`,
    "",
    "Aviso: este reporte es educativo. No incluye datos personales, claves, correos ni nombres reales de apps.",
    "",
    "Áreas revisadas:",
    ...items.map(item => `- ${item.title} [${item.area}] prioridad ${item.priority}`),
    "",
    "Acciones sugeridas:",
    ...items.flatMap(item => (item.steps || []).map(step => `- ${step}`)),
    "",
    "Evidencia segura:",
    ...items.map(item => `- ${item.evidence || "Anotar solo información general, sin datos sensibles."}`),
    "",
    "Próxima revisión sugerida: repetir una revisión mensual o después de instalar apps nuevas, cambiar celular o compartir dispositivos."
  ].join("\n");
}

function renderPrivacyRoutine() {
  if (!privacyRoutine) return renderNotFound();
  const items = privacyRoutine.routineItems || [];
  const frequencies = privacyRoutine.frequencies || [];
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Privacidad v0.4</p>
        <h1>${esc(privacyRoutine.title || "Rutina ciudadana de privacidad")}</h1>
        <p class="lead">${esc(privacyRoutine.intro || "Revisión semanal y mensual de privacidad.")}</p>
        <div class="pill-row"><span class="pill ok">Semanal</span><span class="pill warn">Mensual</span><span class="pill danger">Antes de vender/prestar</span></div>
      </div>
      <div class="grid three">
        ${frequencies.map(f => `<article class="card"><h2>${esc(f.label)}</h2><p>${esc(f.description)}</p></article>`).join("")}
      </div>
      <div class="card toolbar-card">
        <label for="routineFilter"><strong>Filtrar rutina</strong></label>
        <select id="routineFilter" class="input">
          <option value="">Todas las revisiones</option>
          ${frequencies.map(f => `<option value="${esc(f.id)}">${esc(f.label)}</option>`).join("")}
        </select>
      </div>
      <div class="grid cards-grid" id="routineGrid"></div>
      <div class="card embedded-note"><h2>Uso seguro</h2><p>${esc(privacyRoutine.safeNotice || "No ingreses datos personales.")}</p></div>
      <div class="actions"><a class="btn primary" href="#/privacy-report">Reporte imprimible</a><a class="btn ghost" href="#/monthly-privacy-checklist">Checklist mensual</a><a class="btn ghost" href="#/privacy-routine-history">Historial</a></div>
    </section>`;
  const grid = document.querySelector("#routineGrid");
  const filter = document.querySelector("#routineFilter");
  function draw() {
    const value = filter.value;
    const filtered = items.filter(item => !value || item.frequency === value);
    grid.innerHTML = filtered.map(item => `
      <article class="card item-card">
        <div class="pill-row"><span class="pill">${esc(item.area)}</span>${priorityPill(item.priority)}<span class="pill">${esc(item.frequency)}</span></div>
        <h2>${esc(item.title)}</h2>
        <p><strong>Resultado esperado:</strong> ${esc(item.expected || "Privacidad revisada.")}</p>
        <h3>Pasos</h3>${list(item.steps || [])}
        <p><strong>Evidencia segura:</strong> ${esc(item.evidence || "Anotar solo datos generales.")}</p>
        <button class="btn ghost saveRoutine" data-id="${esc(item.id)}">Marcar como practicada</button>
      </article>`).join("") || `<div class="card"><p>No hay ítems para ese filtro.</p></div>`;
    document.querySelectorAll(".saveRoutine").forEach(btn => btn.addEventListener("click", () => {
      const item = items.find(x => x.id === btn.dataset.id);
      const history = readPrivacyRoutineHistory();
      history.push({ date: new Date().toISOString(), id: item.id, title: item.title, area: item.area, priority: item.priority });
      writePrivacyRoutineHistory(history);
      btn.textContent = "Guardado en historial";
    }));
  }
  filter.addEventListener("change", draw);
  draw();
}

function renderPrivacyPrintableReport() {
  if (!privacyRoutine) return renderNotFound();
  const report = privacyRoutineReportText();
  app.innerHTML = `
    <section class="article printable-report">
      <div class="card">
        <p class="eyebrow">Reporte imprimible</p>
        <h1>Reporte ciudadano de privacidad</h1>
        <p class="lead">Una hoja para ordenar revisión de permisos, cuentas, nube, navegador y dispositivos sin guardar datos sensibles.</p>
      </div>
      <div class="card">
        <h2>Secciones sugeridas</h2>
        ${list(privacyRoutine.printableReportSections || [])}
      </div>
      <div class="card">
        <h2>Reporte base</h2>
        <textarea class="textarea" readonly>${esc(report)}</textarea>
        <div class="actions"><button class="btn primary" id="copyRoutineReport">Copiar reporte</button><button class="btn ghost" id="downloadRoutineReport">Descargar .txt</button><button class="btn ghost" id="printRoutineReport">Imprimir / PDF</button><a class="btn ghost" href="#/privacy-routine">Volver a rutina</a></div>
        <p id="routineReportMsg" class="muted"></p>
      </div>
    </section>`;
  document.querySelector("#copyRoutineReport").addEventListener("click", async () => {
    await navigator.clipboard?.writeText(report);
    document.querySelector("#routineReportMsg").textContent = "Reporte copiado.";
  });
  document.querySelector("#downloadRoutineReport").addEventListener("click", () => downloadText("reporte_ciudadano_privacidad.txt", report));
  document.querySelector("#printRoutineReport").addEventListener("click", () => window.print());
}

function renderMonthlyPrivacyChecklist() {
  if (!privacyRoutine) return renderNotFound();
  const items = privacyRoutine.monthlyChecklist || [];
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Checklist mensual</p>
        <h1>Revisión mensual de privacidad</h1>
        <p class="lead">Marcá mentalmente o imprimí esta lista. No guardes datos sensibles.</p>
      </div>
      <div class="card checklist-print">
        ${items.map((item, index) => `<label class="check-row"><input type="checkbox" /> <span>${index + 1}. ${esc(item)}</span></label>`).join("")}
        <div class="actions"><button class="btn ghost" id="printMonthlyChecklist">Imprimir / PDF</button><a class="btn ghost" href="#/privacy-routine">Volver a rutina</a></div>
      </div>
      <div class="card"><h2>Consejos rápidos</h2>${list(privacyRoutine.quickTips || [])}</div>
    </section>`;
  document.querySelector("#printMonthlyChecklist").addEventListener("click", () => window.print());
}

function renderPrivacyRoutineHistory() {
  const history = readPrivacyRoutineHistory().slice().reverse();
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Historial local no sensible</p><h1>Prácticas de privacidad</h1><p>Guarda solo fecha, área y título de práctica. No guarda datos privados ni nombres reales de apps.</p></div>
      <div class="card">
        <h2>Últimas prácticas</h2>
        ${history.length ? `<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Área</th><th>Práctica</th><th>Prioridad</th></tr></thead><tbody>${history.map(item => `<tr><td>${esc(formatDate(item.date))}</td><td>${esc(item.area)}</td><td>${esc(item.title)}</td><td>${esc(item.priority)}</td></tr>`).join("")}</tbody></table></div>` : `<p>No hay prácticas guardadas todavía.</p>`}
        <div class="actions"><a class="btn primary" href="#/privacy-routine">Abrir rutina</a><button class="btn danger" id="clearRoutineHistory">Borrar historial</button></div>
      </div>
    </section>`;
  document.querySelector("#clearRoutineHistory").addEventListener("click", () => {
    if (confirm("¿Borrar historial local de prácticas de privacidad?")) {
      writePrivacyRoutineHistory([]);
      renderPrivacyRoutineHistory();
    }
  });
}

function renderNotFound() {
  app.innerHTML = `<section class="article"><div class="card"><h1>Ruta no encontrada</h1><p>La sección solicitada no existe o el contenido fue movido.</p><a class="btn primary" href="#/">Volver al inicio</a></div></section>`;
}

bootstrap();



const MANIFEST_PATH = "src/data/course_manifest.json";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let stepGuides = [];
let taskAssistant = { tasks: [] };
let quizRuntime = { moduleId: null, answers: {} };
let deferredInstallPrompt = null;

const app = document.querySelector("#app");

function storageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:progress:v1`;
}

const emptyProgress = () => ({ lessons: [], quizzes: {}, checklistItems: [], visitedIncidents: [], triageHistory: [], practicedGuides: [], taskAssistantHistory: [], updatedAt: null });


function uiStorageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:ui:v1`;
}

function readUiSettings() {
  try {
    return { fontScale: "large", contrast: "normal", reducedMotion: false, simpleMode: false, ...(JSON.parse(localStorage.getItem(uiStorageKey())) || {}) };
  } catch {
    return { fontScale: "large", contrast: "normal", reducedMotion: false, simpleMode: false };
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
  document.body.dataset.simpleMode = settings.simpleMode ? "true" : "false";
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

function formatText(value = "") {
  return esc(value).replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>");
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
    if (manifest.dataPaths?.stepGuides) {
      try {
        const stepGuideData = await loadJson(manifest.dataPaths.stepGuides);
        stepGuides = stepGuideData.guides || [];
      } catch (error) {
        console.warn("No se pudieron cargar las guías paso a paso:", error.message);
        stepGuides = [];
      }
    }
    if (manifest.dataPaths?.taskAssistant) {
      try {
        taskAssistant = await loadJson(manifest.dataPaths.taskAssistant);
      } catch (error) {
        console.warn("No se pudo cargar el asistente de tareas frecuentes:", error.message);
        taskAssistant = { tasks: [] };
      }
    }
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
  if (manifest.dataPaths?.taskAssistant && !Array.isArray(taskAssistant?.tasks)) errors.push("task_assistant.json debe tener tasks[].");
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
    "step-guides": renderStepGuides,
    "step-guide": () => renderStepGuide(p1),
    "task-assistant": renderTaskAssistant,
    "task-result": () => renderTaskResult(p1),
    "simple-mode": renderSimpleMode,
    "triage": renderTriage,
    "emergency-map": renderEmergencyMap,
    "print-checklist": renderPrintableChecklist,
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
          <a class="btn primary" href="#/step-guides">Guía paso a paso</a>
          <a class="btn primary" href="#/task-assistant">Asistente de tareas</a>
          <a class="btn primary simple-mode-cta" href="#/simple-mode">Modo simple</a>
          <a class="btn ghost" href="#/triage">Diagnóstico rápido</a>
          <a class="btn ghost" href="#/emergency-map">Mapa de rutas</a>
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
        <div class="actions"><a class="btn danger" href="#/emergency">Abrir modo emergencia</a><a class="btn primary" href="#/triage">Hacer diagnóstico</a><a class="btn ghost" href="#/emergency-map">Ver mapa</a></div>
      </div>
      <div class="card">
        <p class="eyebrow">Curso de acción rápida</p>
        <h2>Plantilla clonable</h2>
        <p>La identidad, rutas de datos, textos principales, colores, quizzes, constancia y accesibilidad básica ya salen de una arquitectura reutilizable.</p>
        <a class="btn ghost" href="#/template">Ver guía para clonar</a>
      </div>
    </section>
    <section class="section grid two">
      <div class="card compact-helper">
        <div>
          <p class="eyebrow">v0.2 del curso</p>
          <h2>Modo guía paso a paso</h2>
          <p>Guías grandes, simples, copiables e imprimibles para practicar tareas frecuentes: WhatsApp, archivos, turnos, links dudosos y ayuda segura.</p>
        </div>
        <a class="btn primary" href="#/step-guides">Abrir guías paso a paso</a>
      </div>
      <div class="card compact-helper">
        <div>
          <p class="eyebrow">v0.3 del curso</p>
          <h2>Asistente de tareas frecuentes</h2>
          <p>Elegí qué necesitás hacer y el sistema te recomienda una guía, checklist o caso guiado con primeros pasos claros.</p>
        </div>
        <a class="btn primary" href="#/task-assistant">Abrir asistente</a>
      </div>
    </section>`;
}


function renderSimpleMode() {
  const next = nextPendingLesson();
  const recent = storage.read().taskAssistantHistory || [];
  app.innerHTML = `
    <section class="simple-dashboard article">
      <div class="card simple-hero">
        <p class="eyebrow">Modo simple v0.4</p>
        <h1>Elegí una acción</h1>
        <p class="lead">Esta vista muestra menos opciones, textos más directos y botones grandes para practicar sin perderse.</p>
        <div class="actions simple-actions">
          <a class="btn primary giant-btn" href="#/step-guides">Ver guías paso a paso</a>
          <a class="btn primary giant-btn" href="#/task-assistant">Decir qué quiero hacer</a>
          <a class="btn danger giant-btn" href="#/emergency">Necesito ayuda</a>
          <a class="btn ghost giant-btn" href="${next ? `#/lesson/${next.moduleId}/${next.id}` : '#/modules'}">Continuar curso</a>
        </div>
      </div>
      <div class="grid two section">
        <div class="card simple-card">
          <h2>Tareas frecuentes</h2>
          ${list(["Enviar una foto", "Buscar una app", "Revisar un link", "Encontrar un comprobante", "Pedir ayuda sin compartir claves"])}
          <div class="actions"><a class="btn primary" href="#/task-assistant">Abrir asistente</a></div>
        </div>
        <div class="card simple-card">
          <h2>Recomendación de lectura</h2>
          <p>Usá el tamaño de texto grande, alto contraste si hace falta y reducí animaciones si el dispositivo se siente lento.</p>
          <div class="actions"><a class="btn ghost" href="#/accessibility">Configurar lectura</a></div>
        </div>
      </div>
      <div class="card section">
        <h2>Últimas consultas</h2>
        ${recent.length ? `<ul>${recent.slice(-5).reverse().map(item => `<li>${esc(item.taskTitle || 'Tarea consultada')} · <small>${formatDate(item.at)}</small></li>`).join('')}</ul>` : '<p>Todavía no hay tareas consultadas en este navegador.</p>'}
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

function renderTheorySections(lesson) {
  const sections = Array.isArray(lesson.theorySections) ? lesson.theorySections : [];
  if (!sections.length) return "";
  return `
    <div class="theory-stack">
      ${sections.map(section => `
        <section class="theory-block">
          <h3>${esc(section.title || "Bloque teorico")}</h3>
          <p>${formatText(section.body || "")}</p>
        </section>`).join("")}
    </div>`;
}

function renderReferences(lesson) {
  const references = Array.isArray(lesson.references) ? lesson.references : [];
  if (!references.length) return "";
  return `
    <div class="card reading-card source-card">
      <h2>Fuentes usadas</h2>
      <ul class="source-list">
        ${references.map(ref => `
          <li>
            <a href="${esc(ref.url || "#")}" target="_blank" rel="noopener">
              <strong>${esc(ref.title || ref.key || "Fuente")}</strong>
              <span>${esc(ref.organization || ref.note || "")}</span>
            </a>
          </li>`).join("")}
      </ul>
    </div>`;
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
      <div class="card reading-card"><h2>Teoría aplicada</h2><p>${formatText(lesson.shortTheory || lesson.content || "")}</p>${renderTheorySections(lesson)}</div>
      <div class="card reading-card"><h2>Ejemplo práctico</h2><p>${formatText(lesson.practicalExample || "")}</p></div>\n      ${lesson.counterExample ? `<div class="card reading-card counter-card"><h2>Contraejemplo</h2><p>${formatText(lesson.counterExample)}</p></div>` : ""}
      <div class="card alert"><h2>Error común</h2><p>${formatText(lesson.commonMistake || "")}</p></div>
      <div class="card reading-card"><h2>Qué hacer ahora</h2><p>${formatText(lesson.whatToDoNow || lesson.recommendedAction || "")}</p></div>
      ${lesson.alert ? `<div class="card danger-card"><h2>Alerta</h2><p>${esc(lesson.alert)}</p></div>` : ""}
      <div class="card"><h2>Conceptos clave</h2>${list(lesson.keyPoints)}</div>\n      ${renderReferences(lesson)}\n      ${renderReferences(lesson)}\n      ${renderReferences(lesson)}
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


function getStepGuide(id) { return stepGuides.find(guide => guide.id === id); }
function getTaskAssistantTasks() { return taskAssistant?.tasks || []; }
function getTaskAssistantTask(id) { return getTaskAssistantTasks().find(task => task.id === id); }
function getTaskTarget(task) {
  if (!task) return null;
  if (task.recommendedType === "guide") return getStepGuide(task.targetId);
  if (task.recommendedType === "incident") return getIncident(task.targetId);
  if (task.recommendedType === "checklist") return getChecklist(task.targetId);
  return null;
}
function getTaskTargetUrl(task) {
  if (!task) return "#/task-assistant";
  if (task.recommendedType === "guide") return `#/step-guide/${task.targetId}`;
  if (task.recommendedType === "incident") return `#/incident/${task.targetId}`;
  if (task.recommendedType === "checklist") return `#/checklist/${task.targetId}`;
  return "#/task-assistant";
}
function getTaskTargetLabel(task) {
  if (!task) return "Abrir recurso";
  if (task.recommendedType === "guide") return "Abrir guía paso a paso";
  if (task.recommendedType === "incident") return "Abrir caso guiado";
  if (task.recommendedType === "checklist") return "Abrir checklist";
  return "Abrir recurso";
}

function buildStepGuideText(guide) {
  return [
    `${manifest.appName || "Curso"} — ${guide.title}`,
    "",
    `Objetivo: ${guide.goal || "Practicar una tarea digital concreta."}`,
    `Tiempo estimado: ${guide.estimatedTime || "Variable"}`,
    `Dificultad: ${guide.difficulty || "Básica"}`,
    "",
    "Antes de empezar",
    ...((guide.beforeStart || []).map(item => `- ${item}`)),
    "",
    "Pasos",
    ...((guide.steps || []).map((item, index) => `${index + 1}. ${item}`)),
    "",
    "Errores comunes",
    ...((guide.commonMistakes || []).map(item => `- ${item}`)),
    "",
    "Cuándo pedir ayuda",
    ...((guide.whenAskHelp || []).map(item => `- ${item}`)),
    "",
    `Resumen corto: ${guide.copySummary || "Seguir la guía paso a paso con calma."}`,
    "",
    manifest.responsibleNotice || "Contenido educativo. No compartas claves ni códigos."
  ].join("\n");
}

function renderStepGuides() {
  const config = manifest.stepGuideMode || {};
  const state = storage.read();
  const categories = [...new Set(stepGuides.map(guide => guide.category || "General"))];
  app.innerHTML = `
    <section class="section-head">
      <div>
        <p class="eyebrow">v0.2 · Modo guía</p>
        <h1>${esc(config.title || "Guías paso a paso")}</h1>
        <p>${esc(config.description || "Elegí una tarea y seguí pasos cortos.")}</p>
        <p class="calm-notice">${esc(config.calmNotice || "Leé un paso, hacelo y recién después seguí con el siguiente.")}</p>
      </div>
    </section>
    <input class="search-box" id="guideSearch" placeholder="Buscar guía: WhatsApp, foto, turno, link, archivo…" aria-label="Buscar guía paso a paso" />
    <section class="guide-category-bar" aria-label="Categorías de guías">
      <button class="btn primary" data-guide-category="">Todas</button>
      ${categories.map(category => `<button class="btn ghost" data-guide-category="${esc(category)}">${esc(category)}</button>`).join("")}
    </section>
    <section class="grid two" id="guideGrid"></section>`;
  const grid = document.querySelector("#guideGrid");
  const search = document.querySelector("#guideSearch");
  let activeCategory = "";
  const paint = () => {
    const q = search.value.trim().toLowerCase();
    const filtered = stepGuides.filter(guide => {
      const text = `${guide.title} ${guide.category} ${guide.goal} ${(guide.steps || []).join(" ")}`.toLowerCase();
      return (!activeCategory || guide.category === activeCategory) && text.includes(q);
    });
    grid.innerHTML = filtered.map(guide => {
      const practiced = (state.practicedGuides || []).includes(guide.id);
      return `<article class="card guide-card">
        <div class="meta"><span class="pill">${esc(guide.category || "Guía")}</span><span class="pill ${practiced ? "ok" : "warn"}">${practiced ? "Practicada" : esc(guide.difficulty || "Paso a paso")}</span></div>
        <h2>${esc(guide.title)}</h2>
        <p>${esc(guide.goal || "Guía práctica.")}</p>
        <p><strong>Tiempo:</strong> ${esc(guide.estimatedTime || "Variable")}</p>
        <a class="btn primary" href="#/step-guide/${guide.id}">Abrir guía</a>
      </article>`;
    }).join("") || `<div class="card"><p>No encontré guías con esa búsqueda.</p></div>`;
  };
  search.addEventListener("input", paint);
  document.querySelectorAll("[data-guide-category]").forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.guideCategory || "";
    document.querySelectorAll("[data-guide-category]").forEach(btn => btn.className = `btn ${btn.dataset.guideCategory === activeCategory ? "primary" : "ghost"}`);
    paint();
  }));
  paint();
}

function renderStepGuide(id) {
  const guide = getStepGuide(id);
  if (!guide) return renderNotFound();
  const state = storage.read();
  const practiced = (state.practicedGuides || []).includes(guide.id);
  const text = buildStepGuideText(guide);
  app.innerHTML = `
    <article class="article guide-detail">
      <div class="card guide-hero">
        <p class="eyebrow">Guía paso a paso · ${esc(guide.category || "General")}</p>
        <h1>${esc(guide.title)}</h1>
        <p class="lead">${esc(guide.goal || "Practicar una tarea digital concreta.")}</p>
        <div class="pill-row"><span class="pill">${esc(guide.difficulty || "Básica")}</span><span class="pill">${esc(guide.estimatedTime || "Tiempo variable")}</span><span class="pill ${practiced ? "ok" : "warn"}">${practiced ? "Ya practicada" : "Pendiente de práctica"}</span></div>
        <p class="calm-notice">${esc(manifest.stepGuideMode?.calmNotice || "Leé un paso, hacelo y recién después seguí con el siguiente.")}</p>
      </div>
      <div class="card"><h2>Antes de empezar</h2>${list(guide.beforeStart || [])}</div>
      <div class="card step-guide-card"><h2>Pasos</h2>
        <ol class="big-steps">${(guide.steps || []).map((step, index) => `<li><span class="step-number">${index + 1}</span><p>${esc(step)}</p></li>`).join("")}</ol>
      </div>
      <div class="card alert"><h2>Errores comunes</h2>${list(guide.commonMistakes || [])}</div>
      <div class="card"><h2>Cuándo pedir ayuda</h2>${list(guide.whenAskHelp || [])}</div>
      <div class="card"><h2>Resumen corto</h2><p>${esc(guide.copySummary || "Seguir los pasos con calma.")}</p></div>
      <div class="card action-plan-card">
        <h2>Copiar o imprimir esta guía</h2>
        <textarea class="textarea plan-textarea" readonly id="stepGuideText">${esc(text)}</textarea>
        <div class="actions">
          <button class="btn primary" data-copy-target="stepGuideText">${esc(manifest.stepGuideMode?.copyLabel || "Copiar pasos")}</button>
          <button class="btn ghost" data-print-page>${esc(manifest.stepGuideMode?.printLabel || "Imprimir / guardar guía")}</button>
          <button class="btn ${practiced ? "ghost" : "primary"}" id="practiceGuide">${practiced ? "Marcar como no practicada" : esc(manifest.stepGuideMode?.practiceLabel || "Marcar como practicada")}</button>
          <a class="btn ghost" href="#/step-guides">Volver a guías</a>
        </div>
      </div>
    </article>`;
  bindUtilityButtons(app);
  document.querySelector("#practiceGuide").addEventListener("click", () => {
    storage.update(progress => {
      progress.practicedGuides = progress.practicedGuides || [];
      progress.practicedGuides = progress.practicedGuides.includes(guide.id)
        ? progress.practicedGuides.filter(item => item !== guide.id)
        : [...new Set([...progress.practicedGuides, guide.id])];
    });
    renderStepGuide(id);
  });
}


function buildTaskRecommendationText(task) {
  const target = getTaskTarget(task);
  return [
    `Asistente de tareas frecuentes — ${manifest.appName}`,
    "",
    `Tarea elegida: ${task.title}`,
    `Categoría: ${task.category || "General"}`,
    `Dificultad orientativa: ${task.difficulty || "Básica"}`,
    "",
    `Recurso recomendado: ${target?.title || task.targetId}`,
    `Tipo: ${task.recommendedType === "guide" ? "Guía paso a paso" : task.recommendedType === "incident" ? "Caso guiado" : "Checklist"}`,
    "",
    "Por qué se recomienda",
    task.why || "Este recurso ordena la tarea en pasos simples.",
    "",
    "Primeros pasos",
    ...((task.firstSteps || []).map(item => `- ${item}`)),
    "",
    "Evitar",
    ...((task.avoid || []).map(item => `- ${item}`)),
    "",
    manifest.responsibleNotice || "Contenido educativo. No compartas claves ni códigos."
  ].join("\n");
}

function renderTaskAssistant() {
  const config = manifest.taskAssistantMode || {};
  const tasks = getTaskAssistantTasks();
  const categories = [...new Set(tasks.map(task => task.category || "General"))];
  app.innerHTML = `
    <section class="section-head">
      <div>
        <p class="eyebrow">v0.3 · Asistente simple</p>
        <h1>${esc(config.title || taskAssistant.title || "Asistente de tareas frecuentes")}</h1>
        <p>${esc(config.description || taskAssistant.description || "Elegí una tarea para recibir una recomendación.")}</p>
        <p class="calm-notice">${esc(config.calmNotice || taskAssistant.calmNotice || "Elegí la frase más parecida a lo que necesitás hacer.")}</p>
      </div>
    </section>
    <input class="search-box" id="taskSearch" placeholder="${esc(config.searchPlaceholder || "Buscar tarea…")}" aria-label="Buscar tarea frecuente" />
    <section class="guide-category-bar" aria-label="Categorías de tareas">
      <button class="btn primary" data-task-category="">Todas</button>
      ${categories.map(category => `<button class="btn ghost" data-task-category="${esc(category)}">${esc(category)}</button>`).join("")}
    </section>
    <section class="grid two" id="taskGrid"></section>
    <section class="section card">
      <p class="eyebrow">Historial local</p>
      <h2>Últimas tareas consultadas</h2>
      ${renderTaskAssistantHistory()}
    </section>`;
  const grid = document.querySelector("#taskGrid");
  const search = document.querySelector("#taskSearch");
  let activeCategory = "";
  const paint = () => {
    const q = search.value.trim().toLowerCase();
    const filtered = tasks.filter(task => {
      const text = `${task.title} ${task.category} ${task.question} ${task.why} ${(task.firstSteps || []).join(" ")}`.toLowerCase();
      return (!activeCategory || task.category === activeCategory) && text.includes(q);
    });
    grid.innerHTML = filtered.map(task => {
      const target = getTaskTarget(task);
      const typeLabel = task.recommendedType === "guide" ? "Guía" : task.recommendedType === "incident" ? "Caso" : "Checklist";
      return `<article class="card guide-card task-card">
        <div class="meta"><span class="pill">${esc(task.category || "Tarea")}</span><span class="pill ${task.difficulty === "Cuidado" ? "danger" : "ok"}">${esc(task.difficulty || "Básica")}</span><span class="pill">${esc(typeLabel)}</span></div>
        <h2>${esc(task.title)}</h2>
        <p>${esc(task.question || "Elegí esta tarea para recibir una recomendación.")}</p>
        <p><strong>Recomienda:</strong> ${esc(target?.title || task.targetId || "Recurso del curso")}</p>
        <div class="actions"><a class="btn primary" href="#/task-result/${task.id}">Ver recomendación</a><a class="btn ghost" href="${getTaskTargetUrl(task)}">${esc(getTaskTargetLabel(task))}</a></div>
      </article>`;
    }).join("") || `<div class="card"><p>No encontré tareas con esa búsqueda.</p></div>`;
  };
  search.addEventListener("input", paint);
  document.querySelectorAll("[data-task-category]").forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.taskCategory || "";
    document.querySelectorAll("[data-task-category]").forEach(btn => btn.className = `btn ${btn.dataset.taskCategory === activeCategory ? "primary" : "ghost"}`);
    paint();
  }));
  paint();
}

function renderTaskAssistantHistory() {
  const history = storage.read().taskAssistantHistory || [];
  if (!history.length) return `<p>Todavía no consultaste tareas. Cuando abras una recomendación, aparecerá acá.</p>`;
  return `<ul class="compact-list">${history.slice(-6).reverse().map(item => {
    const task = getTaskAssistantTask(item.taskId);
    return `<li><a href="#/task-result/${esc(item.taskId)}">${esc(task?.title || item.taskId)}</a><small>${esc(formatDate(item.at))}</small></li>`;
  }).join("")}</ul>`;
}

function renderTaskResult(id) {
  const task = getTaskAssistantTask(id);
  if (!task) return renderNotFound();
  const target = getTaskTarget(task);
  const text = buildTaskRecommendationText(task);
  storage.update(progress => {
    progress.taskAssistantHistory = progress.taskAssistantHistory || [];
    progress.taskAssistantHistory = [...progress.taskAssistantHistory.filter(item => item.taskId !== task.id), { taskId: task.id, at: new Date().toISOString() }].slice(-20);
  });
  app.innerHTML = `
    <article class="article">
      <div class="card guide-hero">
        <p class="eyebrow">Asistente de tareas frecuentes</p>
        <h1>${esc(task.title)}</h1>
        <p class="lead">${esc(task.question || "Tarea seleccionada.")}</p>
        <div class="pill-row"><span class="pill">${esc(task.category || "General")}</span><span class="pill ${task.difficulty === "Cuidado" ? "danger" : "ok"}">${esc(task.difficulty || "Básica")}</span></div>
        <p class="calm-notice">${esc(taskAssistant.calmNotice || "Seguí un paso por vez, sin apurarte.")}</p>
      </div>
      <div class="card">
        <p class="eyebrow">${esc(taskAssistant.recommendationLabel || "Recomendación sugerida")}</p>
        <h2>${esc(target?.title || "Recurso recomendado")}</h2>
        <p>${esc(task.why || "Este recurso es el más cercano a la tarea elegida.")}</p>
        <div class="actions"><a class="btn primary" href="${getTaskTargetUrl(task)}">${esc(getTaskTargetLabel(task))}</a><a class="btn ghost" href="#/task-assistant">Volver al asistente</a></div>
      </div>
      <div class="card"><h2>Primeros pasos</h2>${list(task.firstSteps || [])}</div>
      <div class="card alert"><h2>Evitar</h2>${list(task.avoid || [])}</div>
      <div class="card action-plan-card">
        <h2>Copiar o imprimir recomendación</h2>
        <textarea class="textarea plan-textarea" readonly id="taskRecommendationText">${esc(text)}</textarea>
        <div class="actions">
          <button class="btn primary" data-copy-target="taskRecommendationText">${esc(taskAssistant.copyLabel || manifest.taskAssistantMode?.copyLabel || "Copiar recomendación")}</button>
          <button class="btn ghost" data-print-page>${esc(taskAssistant.printLabel || manifest.taskAssistantMode?.printLabel || "Imprimir / guardar recomendación")}</button>
        </div>
      </div>
    </article>`;
  bindUtilityButtons(app);
}

function renderIncidents() {
  app.innerHTML = `
    <section class="section-head"><div><p class="eyebrow">Simulador de casos</p><h1>${esc(manifest.labels?.incidents || "Incidentes")}</h1><p>Guías de actuación para robo de cuentas, links sospechosos, movimientos desconocidos, apps dudosas y amenazas digitales.</p></div></section>
    <input class="search-box" id="incidentSearch" placeholder="Buscar emergencia: WhatsApp, banco, link, Gmail, amenaza…" />
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


function getTriageConfig() {
  return manifest.triage || { questions: [] };
}

function scoreTriage(answers) {
  const config = getTriageConfig();
  const scores = {};
  const priorities = {};
  for (const question of config.questions || []) {
    const selectedIndex = Number(answers[question.id]);
    const option = question.options?.[selectedIndex];
    if (!option?.incidentId) continue;
    scores[option.incidentId] = (scores[option.incidentId] || 0) + Number(option.weight || 1);
    const priorityRank = { "Rojo": 4, "Naranja": 3, "Amarillo": 2, "Verde": 1 };
    const current = priorities[option.incidentId] || "Verde";
    priorities[option.incidentId] = (priorityRank[option.priority] || 1) > (priorityRank[current] || 1) ? option.priority : current;
  }
  const ordered = Object.entries(scores)
    .map(([incidentId, score]) => ({ incidentId, score, priority: priorities[incidentId] || "Amarillo", incident: getIncident(incidentId) }))
    .filter(item => item.incident)
    .sort((a, b) => b.score - a.score);
  return ordered;
}

function priorityClass(priority = "") {
  const p = String(priority).toLowerCase();
  if (p.includes("rojo") || p.includes("alta") || p.includes("crítica")) return "danger";
  if (p.includes("naranja") || p.includes("media")) return "warn";
  if (p.includes("verde") || p.includes("baja")) return "ok";
  return "";
}

function safePlanLine(label, value) {
  return value ? `${label}: ${value}` : "";
}

function buildTriageActionPlan(top, ordered = []) {
  const emergency = manifest.emergencyMode || {};
  const common = getTriageConfig().commonImmediateSteps || [];
  const incident = top?.incident || {};
  const alternatives = ordered.slice(1, 4).map(item => `${item.incident.title} (${item.priority}, ${item.score} pts)`);
  const lines = [
    `PLAN DE ACCIÓN — ${manifest.appName}`,
    safePlanLine("Fecha", new Date().toLocaleString("es-AR")),
    safePlanLine("Ruta prioritaria", incident.title),
    safePlanLine("Prioridad", top?.priority),
    safePlanLine("Objetivo inmediato", incident.immediateGoal),
    "",
    "1) Qué cortar ahora",
    ...((emergency.firstFiveMinutes || []).slice(0, 5).map(item => `- ${item}`)),
    "",
    "2) Ruta específica sugerida",
    ...((incident.steps || []).slice(0, 6).map(item => `- ${item}`)),
    "",
    "3) Evidencia a preservar",
    ...((incident.evidenceToPreserve || []).slice(0, 6).map(item => `- ${item}`)),
    "",
    "4) Errores a evitar",
    ...((incident.errorsToAvoid || []).slice(0, 5).map(item => `- ${item}`)),
    "",
    "5) Pasos comunes del diagnóstico",
    ...(common.slice(0, 6).map(item => `- ${item}`)),
    alternatives.length ? "" : null,
    alternatives.length ? "Otras rutas posibles" : null,
    ...alternatives.map(item => `- ${item}`),
    "",
    manifest.responsibleNotice || "Contenido educativo. No reemplaza canales oficiales ni asesoramiento profesional."
  ].filter(Boolean);
  return lines.join("\n");
}

function renderActionPlanCard(top, ordered = []) {
  const planText = buildTriageActionPlan(top, ordered);
  const id = `actionPlan${Date.now()}`;
  return `
    <div class="card action-plan-card">
      <p class="eyebrow">Plan de acción v0.5</p>
      <h2>Plan copiable e imprimible</h2>
      <p>Este resumen está pensado para usarlo con calma, enviarlo a una persona de confianza o guardarlo como PDF desde el navegador.</p>
      <textarea class="textarea plan-textarea" readonly id="${id}">${esc(planText)}</textarea>
      <div class="actions">
        <button class="btn primary" data-copy-target="${id}">${esc(getTriageConfig().copyPlanLabel || "Copiar plan de acción")}</button>
        <button class="btn ghost" data-print-page>${esc(getTriageConfig().printPlanLabel || "Imprimir / guardar plan")}</button>
        <a class="btn ghost" href="#/emergency-map">${esc(getTriageConfig().mapLabel || "Ver mapa de rutas")}</a>
      </div>
    </div>`;
}

function bindUtilityButtons(root = document) {
  root.querySelectorAll("[data-copy-target]").forEach(button => {
    button.addEventListener("click", async () => {
      const field = document.getElementById(button.dataset.copyTarget);
      if (!field) return;
      try {
        await navigator.clipboard.writeText(field.value || field.textContent || "");
      } catch {
        field.select?.();
        document.execCommand("copy");
      }
      const previous = button.textContent;
      button.textContent = "Copiado";
      setTimeout(() => button.textContent = previous, 1600);
    });
  });
  root.querySelectorAll("[data-print-page]").forEach(button => {
    button.addEventListener("click", () => window.print());
  });
}

function renderEmergencyMap() {
  const map = manifest.emergencyMap || {};
  const groups = map.groups || [];
  app.innerHTML = `
    <section class="article">
      <div class="card danger-card">
        <p class="eyebrow">Mapa visual v0.5</p>
        <h1>${esc(map.title || "Mapa visual de rutas de emergencia")}</h1>
        <p class="lead">${esc(map.description || "Elegí la ruta más parecida a tu situación. Si hay dinero, amenaza o cuenta tomada, priorizá actuar ahora y contactar canales oficiales.")}</p>
        <div class="actions"><a class="btn primary" href="#/triage">Hacer diagnóstico</a><a class="btn ghost" href="#/print-checklist">Checklist imprimible</a></div>
      </div>
      <div class="route-map">
        ${groups.map(group => `
          <article class="card route-group ${priorityClass(group.priority)}-soft">
            <div class="route-head"><span class="pill ${priorityClass(group.priority)}">${esc(group.priority || "Prioridad")}</span><h2>${esc(group.title || "Ruta")}</h2></div>
            <div class="list">
              ${(group.incidentIds || []).map(id => {
                const incident = getIncident(id);
                return incident ? `<a class="list-row" href="#/incident/${incident.id}"><span><strong>${esc(incident.title)}</strong><br><small>${esc(incident.immediateGoal || incident.summary || "Abrir caso guiado")}</small></span><span class="pill danger">${esc(incident.severity || group.priority || "")}</span></a>` : "";
              }).join("")}
            </div>
          </article>`).join("")}
      </div>
      <div class="card alert"><h2>Regla práctica</h2><p>Cuando dudes entre dos rutas, abrí primero la que tenga dinero comprometido, amenaza directa, pérdida de cuenta o posibilidad de que otras personas sean engañadas desde tu perfil.</p></div>
    </section>`;
}

function renderPrintableChecklist() {
  const printable = manifest.printableChecklist || {};
  app.innerHTML = `
    <section class="article printable-checklist">
      <div class="card">
        <p class="eyebrow">Checklist v0.5</p>
        <h1>${esc(printable.title || "Checklist imprimible de actuación")}</h1>
        <p class="lead">${esc(printable.description || "Lista breve para actuar con orden durante una emergencia digital.")}</p>
        <div class="actions"><button class="btn primary" data-print-page>Imprimir / guardar PDF</button><button class="btn ghost" data-copy-target="printableChecklistText">Copiar checklist</button><a class="btn ghost" href="#/emergency">Modo emergencia</a></div>
      </div>
      <div class="card">
        <h2>Pasos de actuación</h2>
        <ol class="print-list">${(printable.items || []).map(item => `<li>${esc(item)}</li>`).join("")}</ol>
        <textarea class="textarea sr-copy" readonly id="printableChecklistText">${esc((printable.items || []).map((item, i) => `${i + 1}. ${item}`).join("\n"))}</textarea>
      </div>
      <div class="card"><h2>Nota responsable</h2><p>${esc(manifest.responsibleNotice || "Contenido educativo. No reemplaza canales oficiales ni asesoramiento profesional.")}</p></div>
    </section>`;
  bindUtilityButtons(app);
}

function renderTriage() {
  const config = getTriageConfig();
  const questions = config.questions || [];
  const state = storage.read();
  const previous = (state.triageHistory || []).slice(-3).reverse();
  app.innerHTML = `
    <section class="article">
      <div class="card danger-card">
        <p class="eyebrow">Diagnóstico rápido v0.5</p>
        <h1>${esc(config.title || "Diagnóstico rápido digital")}</h1>
        <p class="lead">${esc(config.description || "Respondé unas preguntas para priorizar el caso más urgente.")}</p>
        <p class="calm-notice">${esc(config.calmNotice || "Respirá, no respondas bajo presión y seguí solo los pasos prioritarios.")}</p>
      </div>
      <form class="card triage-form" id="triageForm">
        <h2>Responder diagnóstico</h2>
        ${questions.map((question, qi) => `
          <fieldset class="triage-question">
            <legend><span class="pill">${qi + 1}</span> ${esc(question.question)}</legend>
            ${(question.options || []).map((option, oi) => `
              <label class="triage-option">
                <input type="radio" name="${esc(question.id)}" value="${oi}" required>
                <span><strong>${esc(option.label)}</strong><br><small>Prioridad sugerida: ${esc(option.priority || "A revisar")}</small></span>
              </label>`).join("")}
          </fieldset>`).join("")}
        <div class="actions"><button class="btn primary" type="submit">Ver recomendación</button><button class="btn ghost" type="reset">Reiniciar respuestas</button><a class="btn ghost" href="#/emergency-map">Mapa de rutas</a><a class="btn danger" href="#/emergency">Modo emergencia</a></div>
      </form>
      <div id="triageResult"></div>
      ${previous.length ? `<div class="card"><h2>Últimos diagnósticos locales</h2><div class="list">${previous.map(item => `<a class="list-row" href="#/incident/${esc(item.incidentId)}"><span><strong>${esc(item.title || item.incidentId)}</strong><br><small>${esc(formatDate(item.createdAt))} · prioridad ${esc(item.priority || "")}</small></span><span class="pill danger">${esc(item.score || 0)} pts</span></a>`).join("")}</div></div>` : ""}
      <div class="card alert"><h2>Pasos inmediatos comunes</h2>${list(config.commonImmediateSteps || [])}</div>
    </section>`;

  const form = document.querySelector("#triageForm");
  const result = document.querySelector("#triageResult");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const answers = {};
    for (const question of questions) answers[question.id] = data.get(question.id);
    const ordered = scoreTriage(answers);
    const top = ordered[0];
    if (!top) {
      result.innerHTML = `<div class="card alert"><h2>No hay recomendación suficiente</h2><p>Revisá las respuestas o abrí el modo emergencia para seguir el protocolo general.</p></div>`;
      return;
    }
    storage.update(progress => {
      progress.triageHistory = progress.triageHistory || [];
      progress.triageHistory.push({
        createdAt: new Date().toISOString(),
        incidentId: top.incidentId,
        title: top.incident.title,
        score: top.score,
        priority: top.priority,
        answers
      });
      progress.triageHistory = progress.triageHistory.slice(-10);
    });
    const specificSteps = (top.incident.steps || []).slice(0, 4);
    result.innerHTML = `
      <div class="card triage-result">
        <p class="eyebrow">${esc(config.resultTitle || "Resultado del diagnóstico")}</p>
        <h2>${esc(top.incident.title)}</h2>
        <p><span class="pill ${priorityClass(top.priority)}">Prioridad ${esc(top.priority)}</span> <span class="pill">Puntaje ${esc(top.score)}</span></p>
        <p>${esc(top.incident.summary || "")}</p>
        <h3>Objetivo inmediato</h3>
        <p>${esc(top.incident.immediateGoal || "Revisar el caso guiado y cortar el daño inicial.")}</p>
        ${specificSteps.length ? `<h3>Primeros pasos sugeridos para esta ruta</h3>${list(specificSteps)}` : ""}
        <div class="actions"><a class="btn danger" href="#/incident/${top.incidentId}">Abrir emergencia sugerida</a><a class="btn ghost" href="#/emergency">Ver protocolo general</a><a class="btn ghost" href="#/print-checklist">Checklist imprimible</a></div>
      </div>
      ${renderActionPlanCard(top, ordered)}
      ${ordered.length > 1 ? `<div class="card"><h2>Otras rutas posibles</h2><div class="list">${ordered.slice(1, 4).map(item => `<a class="list-row" href="#/incident/${item.incidentId}"><span>${esc(item.incident.title)}</span><span class="pill ${priorityClass(item.priority)}">${item.score} pts</span></a>`).join("")}</div></div>` : ""}`;
    bindUtilityButtons(result);
  });
}

function renderEmergency() {
  const emergency = manifest.emergencyMode || {};
  const first5 = emergency.firstFiveMinutes || [
    "Cortá la interacción con quien presiona, amenaza o pide códigos.",
    "No compartas claves, tokens, códigos SMS, capturas sensibles ni datos personales.",
    "No abras nuevos links ni instales apps enviadas por chat o correo.",
    "Guardá evidencia antes de borrar conversaciones o correos.",
    "Entrá solo desde apps o sitios oficiales escritos manualmente."
  ];
  const firstHour = emergency.firstHour || [
    "Cambiá la clave del correo principal desde un dispositivo confiable.",
    "Cerrá sesiones desconocidas en correo, WhatsApp, redes, banco y billeteras.",
    "Activá doble factor donde esté disponible.",
    "Contactá canales oficiales de banco, billetera o plataforma afectada.",
    "Avisá a contactos cercanos si tu cuenta puede estar enviando mensajes falsos."
  ];
  const first48 = emergency.first48Hours || [
    "Ordená la evidencia por fecha, hora, cuenta, monto y canal.",
    "Revisá movimientos, dispositivos vinculados y datos de recuperación.",
    "Actualizá contraseñas reutilizadas en otros servicios.",
    "Registrá qué acciones hiciste y qué respuestas recibiste.",
    "Consultá soporte oficial, autoridad o asesoramiento profesional si corresponde."
  ];
  const priority = emergency.priorityScale || [];
  const messages = manifest.quickMessages || [];
  app.innerHTML = `
    <section class="article">
      <div class="card danger-card"><p class="eyebrow">Modo emergencia</p><h1>${esc(emergency.title || "Estoy en una emergencia digital")}</h1><p class="lead">${esc(emergency.description || "Esta guía ordena acciones urgentes. No garantiza recuperación ni reemplaza canales oficiales o asesoramiento profesional.")}</p><div class="actions"><a class="btn primary" href="#/step-guides">Abrir guía paso a paso</a><a class="btn ghost" href="#/triage">Hacer diagnóstico rápido</a><a class="btn ghost" href="#/emergency-map">Mapa de rutas</a><a class="btn ghost" href="#/print-checklist">Checklist imprimible</a></div></div>
      <div class="card"><h2>Prioridad inmediata</h2>${priority.length ? `<div class="grid two">${priority.map(item => `<div class="mini-card"><strong>${esc(item.level || "Prioridad")}</strong><p>${esc(item.description || "")}</p></div>`).join("")}</div>` : list(["Riesgo alto: cuenta tomada, dinero en juego, amenaza, extorsión o datos sensibles expuestos.", "Riesgo medio: link abierto, app sospechosa, mensaje extraño o movimiento dudoso."])}</div>
      <div class="card"><h2>Primeros 5 minutos</h2>${list(first5)}</div>
      <div class="card"><h2>Primera hora</h2>${list(firstHour)}</div>
      <div class="card"><h2>Primeras 48 horas</h2>${list(first48)}</div>
      ${messages.length ? `<div class="card"><h2>Mensajes copiables</h2><p>Usalos como base. No incluyas claves, códigos ni datos sensibles.</p>${messages.map((m, index) => `<div class="copy-card"><h3>${esc(m.title)}</h3><textarea class="textarea" readonly id="quickMessage${index}">${esc(m.text)}</textarea><button class="btn primary" data-copy-message="quickMessage${index}">Copiar mensaje</button></div>`).join("")}</div>` : ""}
      <div class="card"><h2>Emergencias guiadas</h2><div class="list">${incidents.map(i => `<a class="list-row" href="#/incident/${i.id}"><span>${esc(i.title)}</span><span class="pill danger">${esc(i.severity)}</span></a>`).join("")}</div></div>
      <div class="card"><h2>Herramientas v0.5</h2><p>Usá el mapa visual para elegir ruta o imprimí una checklist breve para actuar con menos presión.</p><div class="actions"><a class="btn primary" href="#/emergency-map">Abrir mapa visual</a><a class="btn ghost" href="#/print-checklist">Abrir checklist imprimible</a></div></div>
    </section>`;
  bindUtilityButtons(app);
  document.querySelectorAll("[data-copy-message]").forEach(btn => btn.addEventListener("click", async () => {
    const id = btn.dataset.copyMessage;
    const field = document.getElementById(id);
    try {
      await navigator.clipboard.writeText(field.value);
      btn.textContent = "Copiado";
      setTimeout(() => btn.textContent = "Copiar mensaje", 1600);
    } catch (error) {
      field.select();
      document.execCommand("copy");
      btn.textContent = "Copiado";
      setTimeout(() => btn.textContent = "Copiar mensaje", 1600);
    }
  }));
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
  let level = "Persona en preparación digital";
  if (p >= 90 && quizAvg >= 80) level = "Respuesta digital preventiva avanzada";
  else if (p >= 70 && quizAvg >= 70) level = "Respuesta digital preventiva";
  else if (p >= 45) level = "Persona atenta en progreso";
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
        <h1>Opciones de lectura y modo simple</h1>
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
      <div class="card settings-card">
        <h2>Modo simple</h2>
        <label class="check-item"><input type="checkbox" id="simpleModeToggle" ${settings.simpleMode ? "checked" : ""}><span><strong>Mostrar una experiencia más simple</strong><br>Reduce opciones secundarias, agranda acciones importantes y prioriza guías, asistente y ayuda.</span></label>
        <div class="actions"><a class="btn primary" href="#/simple-mode">Abrir modo simple</a></div>
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
  document.querySelector("#simpleModeToggle").addEventListener("change", event => {
    writeUiSettings({ ...readUiSettings(), simpleMode: event.target.checked });
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
        <p class="lead">Esta versión deja el producto como candidato de publicación web: manifest, Service Worker pulido, caché offline básico, guía de despliegue, revisión legal/documental y capturas sugeridas para publicar como sitio estático.</p>
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
          "Confirmar que README, CHANGELOG, ESTADO_ACTUAL, AVISO_LEGAL y GUIA_PUBLICACION correspondan a la versión publicada.",
          "Tomar capturas sugeridas para Home, Diagnóstico, Emergencia, Mapa, Checklist imprimible y Constancia.",
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



const MANIFEST_PATH = "src/data/course_manifest.json";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let sheetsLab = null;
let formsLab = null;
let workspaceRoutine = null;
let quizRuntime = { moduleId: null, answers: {} };
let deferredInstallPrompt = null;

const app = document.querySelector("#app");

function storageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:progress:v1`;
}

const emptyProgress = () => ({ lessons: [], quizzes: {}, checklistItems: [], visitedIncidents: [], sheetsPractices: [], sheetsReports: [], formsPractices: [], formsReports: [], updatedAt: null });


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
    const [courseData, checklistData, incidentData, sheetsData, formsData, workspaceData] = await Promise.all([
      loadJson(manifest.dataPaths.course),
      loadJson(manifest.dataPaths.checklists),
      loadJson(manifest.dataPaths.incidents),
      manifest.dataPaths.sheetsLab ? loadJson(manifest.dataPaths.sheetsLab) : Promise.resolve(null),
      manifest.dataPaths.formsLab ? loadJson(manifest.dataPaths.formsLab) : Promise.resolve(null),
      manifest.dataPaths.workspaceRoutine ? loadJson(manifest.dataPaths.workspaceRoutine) : Promise.resolve(null),
    ]);
    course = courseData;
    checklists = checklistData.checklists || [];
    incidents = incidentData.incidents || [];
    sheetsLab = sheetsData;
    formsLab = formsData;
    workspaceRoutine = workspaceData;
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

function tableHtml(columns = [], rows = [], limit = 8) {
  const safeRows = rows.slice(0, limit);
  return `<div class="table-wrap"><table><thead><tr>${columns.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${safeRows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${rows.length > limit ? `<p class="muted">Mostrando ${limit} de ${rows.length} filas.</p>` : ""}`;
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
    "sheets-lab": renderSheetsLab,
    "sheets-dataset": () => renderSheetsDataset(p1),
    "sheets-exercise": () => renderSheetsExercise(p1),
    "sheets-report": renderSheetsReport,
    "forms-lab": renderFormsLab,
    "form-template": () => renderFormTemplate(p1),
    "form-responses": () => renderFormResponses(p1),
    "forms-report": renderFormsReport,
    "collaboration": renderCollaborationHub,
    "permission-simulator": renderPermissionSimulator,
    "permission-case": () => renderPermissionCase(p1),
    "weekly-routine": renderWorkspaceWeeklyRoutine,
    "workspace-checklist": renderWorkspacePrintChecklist,
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
      <div class="card accent-card">
        <p class="eyebrow">Núcleo v0.2</p>
        <h2>Laboratorio de Google Sheets</h2>
        <p>Practicá con tablas de ventas, gastos y formularios. Probá fórmulas, filtros, ordenamiento, limpieza básica y generá un mini reporte exportable.</p>
        <a class="btn primary" href="#/sheets-lab">Abrir laboratorio</a>
      </div>
      <div class="card danger-card">
        <p class="eyebrow">Acción rápida</p>
        <h2>Necesito ordenar mi trabajo</h2>
        <p>Casos guiados para organizar archivos, permisos, planillas, formularios y seguimiento de tareas con herramientas de Google.</p>
        <a class="btn danger" href="#/emergency">Abrir acción rápida</a>
      </div>
    </section>

    <section class="section card accent-card">
      <p class="eyebrow">Núcleo v0.3</p>
      <h2>Laboratorio Forms + Sheets</h2>
      <p>Diseñá formularios simples, revisá respuestas simuladas, detectá campos incompletos y prepará un reporte para ordenar la información en Google Sheets.</p>
      <div class="actions"><a class="btn primary" href="#/forms-lab">Abrir Forms + Sheets</a><a class="btn ghost" href="#/sheets-lab">Ir a Sheets</a></div>
    </section>

    <section class="section card accent-card">
      <p class="eyebrow">Núcleo v0.4</p>
      <h2>Colaboración, permisos y rutina de trabajo</h2>
      <p>Practicá cómo compartir archivos sin exponer información, revisar permisos de Drive y organizar una rutina semanal con Gmail, Calendar, Sheets y Forms.</p>
      <div class="actions"><a class="btn primary" href="#/collaboration">Abrir colaboración</a><a class="btn ghost" href="#/workspace-checklist">Checklist imprimible</a></div>
    </section>

    <section class="section card compact-helper">
      <div>
        <p class="eyebrow">Google Workspace v0.2</p>
        <h2>Curso + práctica con planillas</h2>
        <p>La versión agrega datasets, fórmulas básicas, ejercicios guiados y reportes locales sin guardar datos sensibles.</p>
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



function sheetsStorageKey() {
  const id = manifest?.courseId || "google-workspace";
  return `curso-web:${id}:sheets-lab:v1`;
}

function readSheetsState() {
  try { return JSON.parse(localStorage.getItem(sheetsStorageKey())) || { practices: [], reports: [] }; }
  catch { return { practices: [], reports: [] }; }
}

function writeSheetsState(next) {
  localStorage.setItem(sheetsStorageKey(), JSON.stringify(next));
}

function getSheetDataset(id) { return (sheetsLab?.datasets || []).find(item => item.id === id); }
function getSheetExercise(id) { return (sheetsLab?.guidedExercises || []).find(item => item.id === id); }

function renderSheetsLab() {
  if (!sheetsLab) return renderNotFound();
  const state = readSheetsState();
  app.innerHTML = `
    <section class="article wide-article">
      <div class="card">
        <p class="eyebrow">Laboratorio Google Sheets v0.2</p>
        <h1>Practicar planillas con datos de ejemplo</h1>
        <p class="lead">Este laboratorio es educativo y local. Usá ejemplos ficticios para practicar fórmulas, filtros, ordenamiento, limpieza simple y reportes sin subir información privada.</p>
        <div class="actions"><a class="btn primary" href="#/sheets-report">Generar mini reporte</a><a class="btn ghost" href="#/modules">Volver al curso</a></div>
      </div>
      <div class="grid two section">
        <article class="card">
          <h2>Datasets de ejemplo</h2>
          <div class="list section">
            ${(sheetsLab.datasets || []).map(ds => `<a class="list-row" href="#/sheets-dataset/${ds.id}"><span><strong>${esc(ds.title)}</strong><br><small>${esc(ds.description)}</small></span><span class="pill">${ds.rows?.length || 0} filas</span></a>`).join("")}
          </div>
        </article>
        <article class="card">
          <h2>Fórmulas básicas</h2>
          <div class="formula-grid section">
            ${(sheetsLab.formulas || []).map(f => `<div class="mini-card"><strong>${esc(f.title)}</strong><code>${esc(f.syntax)}</code><p>${esc(f.use)}</p></div>`).join("")}
          </div>
        </article>
      </div>
      <div class="card section">
        <h2>Ejercicios guiados</h2>
        <div class="grid two">
          ${(sheetsLab.guidedExercises || []).map(ex => `<article class="item-card mini-card"><p class="eyebrow">${esc(ex.difficulty)}</p><h3>${esc(ex.goal)}</h3><p>${esc(ex.expectedInsight)}</p><div class="actions"><a class="btn primary" href="#/sheets-exercise/${ex.id}">Practicar</a></div></article>`).join("")}
        </div>
      </div>
      <div class="card section">
        <h2>Historial local</h2>
        <p>Prácticas registradas: <strong>${state.practices.length}</strong>. Reportes guardados: <strong>${state.reports.length}</strong>.</p>
        <p class="muted">Solo se guardan títulos, fecha y resumen. No se guardan tablas completas ni datos sensibles.</p>
      </div>
    </section>`;
}

function renderSheetsDataset(datasetId) {
  const ds = getSheetDataset(datasetId);
  if (!ds) return renderNotFound();
  const numericIndexes = (ds.columns || []).map((c, i) => ({ c, i })).filter(({ i }) => ds.rows?.some(row => typeof row[i] === "number"));
  const metrics = numericIndexes.map(({ c, i }) => {
    const nums = ds.rows.map(row => Number(row[i])).filter(n => Number.isFinite(n));
    const total = nums.reduce((a,b)=>a+b,0);
    return { c, count: nums.length, total, avg: nums.length ? total / nums.length : 0, min: Math.min(...nums), max: Math.max(...nums) };
  });
  app.innerHTML = `
    <section class="article wide-article">
      <div class="card"><p class="eyebrow">Dataset</p><h1>${esc(ds.title)}</h1><p>${esc(ds.description)}</p><div class="actions"><a class="btn ghost" href="#/sheets-lab">Volver al laboratorio</a></div></div>
      <div class="card section"><h2>Vista previa</h2>${tableHtml(ds.columns, ds.rows, 12)}</div>
      <div class="card section"><h2>Métricas simples</h2><div class="grid two">${metrics.map(m => `<div class="mini-card"><strong>${esc(m.c)}</strong><p>Total: ${m.total.toLocaleString("es-AR")}</p><p>Promedio: ${m.avg.toFixed(2)}</p><p>Mín/Máx: ${m.min} / ${m.max}</p></div>`).join("") || `<p>No se detectaron columnas numéricas.</p>`}</div></div>
      <div class="card section"><h2>Prácticas sugeridas</h2>${list(["Ordenar una columna numérica de mayor a menor.", "Aplicar filtro por categoría o estado.", "Revisar celdas vacías antes de crear gráficos.", "Crear un resumen con total, promedio y observación principal."])}</div>
    </section>`;
}

function renderSheetsExercise(exerciseId) {
  const ex = getSheetExercise(exerciseId);
  if (!ex) return renderNotFound();
  const ds = getSheetDataset(ex.datasetId);
  app.innerHTML = `
    <section class="article wide-article">
      <div class="card"><p class="eyebrow">Ejercicio ${esc(ex.difficulty)}</p><h1>${esc(ex.goal)}</h1><p>Dataset: <strong>${esc(ds?.title || ex.datasetId)}</strong></p></div>
      ${ds ? `<div class="card section"><h2>Tabla de práctica</h2>${tableHtml(ds.columns, ds.rows, 10)}</div>` : ""}
      <div class="card section"><h2>Pasos</h2>${list(ex.steps)}<h3>Fórmula o acción sugerida</h3><pre><code>${esc(ex.suggestedFormula)}</code></pre><p><strong>Hallazgo esperado:</strong> ${esc(ex.expectedInsight)}</p><p><strong>Error común:</strong> ${esc(ex.commonMistake)}</p></div>
      <div class="card section"><h2>Tu práctica</h2><textarea class="textarea" id="practiceNotes" placeholder="Escribí qué fórmula usaste, qué filtro aplicaste o qué hallazgo encontraste."></textarea><div class="actions"><button class="btn primary" id="savePractice">Guardar práctica local</button><button class="btn ghost" id="copyExercise">Copiar consigna</button><button class="btn ghost" id="downloadExercise">Descargar .txt</button></div><p id="exerciseMsg" class="muted"></p></div>
    </section>`;
  const text = () => `Práctica Google Sheets\nEjercicio: ${ex.goal}\nDataset: ${ds?.title || ex.datasetId}\nFórmula/acción sugerida: ${ex.suggestedFormula}\nHallazgo esperado: ${ex.expectedInsight}\nNotas: ${document.querySelector("#practiceNotes")?.value || ""}`;
  document.querySelector("#savePractice").addEventListener("click", () => {
    const state = readSheetsState();
    state.practices.unshift({ id: ex.id, title: ex.goal, date: new Date().toISOString(), notes: document.querySelector("#practiceNotes").value.slice(0, 220) });
    writeSheetsState(state);
    document.querySelector("#exerciseMsg").textContent = "Práctica guardada en este navegador.";
  });
  document.querySelector("#copyExercise").addEventListener("click", async () => {
    await navigator.clipboard?.writeText(text());
    document.querySelector("#exerciseMsg").textContent = "Consigna copiada.";
  });
  document.querySelector("#downloadExercise").addEventListener("click", () => downloadText(`${ex.id}.txt`, text()));
}

function renderSheetsReport() {
  const state = readSheetsState();
  const template = sheetsLab?.reportTemplate || [];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Mini reporte</p><h1>Armar reporte de práctica en Google Sheets</h1><p class="lead">Completá un resumen breve de la práctica. Evitá datos personales, correos, teléfonos, nombres reales de clientes o información privada.</p></div>
      <div class="card section">
        <h2>Campos sugeridos</h2>
        ${template.map((field, idx) => `<label class="field-label" for="reportField${idx}">${esc(field)}</label><textarea class="textarea small-textarea" id="reportField${idx}" placeholder="${esc(field)}"></textarea>`).join("")}
        <div class="actions"><button class="btn primary" id="buildReport">Generar reporte</button><button class="btn ghost" id="downloadReport">Descargar .txt</button><button class="btn ghost" id="copyReport">Copiar</button></div>
        <textarea class="textarea" id="finalReport" readonly placeholder="El reporte aparecerá aquí."></textarea><p id="reportMsg" class="muted"></p>
      </div>
      <div class="card section"><h2>Reportes locales recientes</h2>${state.reports.length ? list(state.reports.slice(0,5).map(r => `${formatDate(r.date)} · ${r.title}`)) : `<p>No hay reportes guardados todavía.</p>`}</div>
    </section>`;
  const build = () => template.map((field, idx) => `${field}: ${document.querySelector(`#reportField${idx}`).value || "Sin completar"}`).join("\n");
  const save = (content) => {
    const st = readSheetsState();
    st.reports.unshift({ title: "Reporte de práctica Sheets", date: new Date().toISOString(), summary: content.slice(0, 240) });
    writeSheetsState(st);
  };
  document.querySelector("#buildReport").addEventListener("click", () => {
    const content = `Mini reporte Google Sheets\nCurso: ${manifest.appName}\nFecha: ${new Date().toLocaleString("es-AR")}\n\n${build()}`;
    document.querySelector("#finalReport").value = content;
    save(content);
    document.querySelector("#reportMsg").textContent = "Reporte generado y guardado localmente.";
  });
  document.querySelector("#downloadReport").addEventListener("click", () => downloadText("reporte-google-sheets.txt", document.querySelector("#finalReport").value || build()));
  document.querySelector("#copyReport").addEventListener("click", async () => {
    await navigator.clipboard?.writeText(document.querySelector("#finalReport").value || build());
    document.querySelector("#reportMsg").textContent = "Reporte copiado.";
  });
}



function formsStorageKey() {
  const id = manifest?.courseId || "google-workspace";
  return `curso-web:${id}:forms-lab:v1`;
}

function readFormsState() {
  try { return JSON.parse(localStorage.getItem(formsStorageKey())) || { practices: [], reports: [] }; }
  catch { return { practices: [], reports: [] }; }
}

function writeFormsState(next) {
  localStorage.setItem(formsStorageKey(), JSON.stringify(next));
}

function getFormTemplate(id) { return (formsLab?.formTemplates || []).find(item => item.id === id); }
function getFormResponses(templateId) { return (formsLab?.simulatedResponses || []).find(item => item.templateId === templateId); }

function renderFormsLab() {
  if (!formsLab) return renderNotFound();
  const state = readFormsState();
  app.innerHTML = `
    <section class="article wide-article">
      <div class="card">
        <p class="eyebrow">Laboratorio Forms + Sheets v0.3</p>
        <h1>Diseñar formularios y organizar respuestas</h1>
        <p class="lead">Practicá cómo crear formularios útiles, pensar campos obligatorios, revisar respuestas simuladas y transformar datos en una planilla ordenada. Usá siempre ejemplos ficticios.</p>
        <div class="actions"><a class="btn primary" href="#/forms-report">Generar reporte Forms</a><a class="btn ghost" href="#/sheets-lab">Volver a Sheets</a></div>
      </div>
      <div class="grid two section">
        ${(formsLab.formTemplates || []).map(t => `
          <article class="card item-card">
            <p class="eyebrow">Formulario</p>
            <h2>${esc(t.title)}</h2>
            <p>${esc(t.goal)}</p>
            <div class="pill-row"><span class="pill">${t.fields.length} campos</span><span class="pill ok">${esc(t.audience)}</span></div>
            <div class="actions"><a class="btn primary" href="#/form-template/${t.id}">Diseñar</a><a class="btn ghost" href="#/form-responses/${t.id}">Ver respuestas</a></div>
          </article>`).join("")}
      </div>
      <div class="card section">
        <h2>Controles de calidad</h2>
        ${list(formsLab.qualityChecks || [])}
      </div>
      <div class="card section">
        <h2>Historial local</h2>
        <p>Prácticas registradas: <strong>${state.practices.length}</strong>. Reportes guardados: <strong>${state.reports.length}</strong>.</p>
        <p class="muted">Solo se guardan títulos y resúmenes. No se guardan formularios reales ni respuestas completas.</p>
      </div>
    </section>`;
}

function renderFormTemplate(templateId) {
  const template = getFormTemplate(templateId);
  if (!template) return renderNotFound();
  const fieldRows = template.fields.map((field, index) => [index + 1, field.label, field.type, field.required ? "Sí" : "No", (field.options || []).join(" / ")]);
  app.innerHTML = `
    <section class="article wide-article">
      <div class="card"><p class="eyebrow">Diseño de formulario</p><h1>${esc(template.title)}</h1><p class="lead">${esc(template.goal)}</p><div class="actions"><a class="btn primary" href="#/form-responses/${template.id}">Ver respuestas simuladas</a><a class="btn ghost" href="#/forms-lab">Volver</a></div></div>
      <div class="card section"><h2>Campos sugeridos</h2>${tableHtml(["#", "Campo", "Tipo", "Obligatorio", "Opciones"], fieldRows, 20)}</div>
      <div class="card section"><h2>Columnas esperadas en Sheets</h2>${list(template.expectedSheetColumns || [])}</div>
      <div class="card section"><h2>Errores comunes</h2>${list(template.commonMistakes || [])}<p><strong>Visualización recomendada:</strong> ${esc(template.recommendedChart || "Resumen por categoría")}</p></div>
      <div class="card section"><h2>Guardar práctica</h2><textarea class="textarea" id="formPracticeNotes" placeholder="Anotá cómo mejorarías este formulario o qué campo agregarías/quitarías."></textarea><div class="actions"><button class="btn primary" id="saveFormPractice">Guardar práctica</button><button class="btn ghost" id="downloadFormTemplate">Descargar diseño .txt</button></div><p id="formPracticeMsg" class="muted"></p></div>
    </section>`;
  const build = () => `Diseño de formulario\n${template.title}\nObjetivo: ${template.goal}\nAudiencia: ${template.audience}\n\nCampos:\n${template.fields.map(f => `- ${f.label} (${f.type})${f.required ? " [obligatorio]" : ""}`).join("\n")}\n\nErrores a evitar:\n${(template.commonMistakes || []).map(x => `- ${x}`).join("\n")}\n\nNotas: ${document.querySelector("#formPracticeNotes")?.value || ""}`;
  document.querySelector("#saveFormPractice").addEventListener("click", () => {
    const state = readFormsState();
    state.practices.unshift({ id: template.id, title: template.title, date: new Date().toISOString(), notes: document.querySelector("#formPracticeNotes").value.slice(0, 220) });
    writeFormsState(state);
    document.querySelector("#formPracticeMsg").textContent = "Práctica guardada localmente.";
  });
  document.querySelector("#downloadFormTemplate").addEventListener("click", () => downloadText(`${template.id}-diseno-formulario.txt`, build()));
}

function analyzeFormResponses(template, responses) {
  const columns = template.expectedSheetColumns || [];
  const rows = responses?.rows || [];
  const issues = [];
  rows.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === "" || cell === null || cell === undefined) issues.push(`Fila ${rowIndex + 1}: falta dato en ${columns[cellIndex] || `columna ${cellIndex + 1}`}.`);
    });
  });
  const textValues = rows.flat().filter(value => typeof value === "string");
  const lowerMap = new Map();
  textValues.forEach(value => {
    const clean = value.trim();
    const key = clean.toLowerCase();
    if (!clean || !key) return;
    if (!lowerMap.has(key)) lowerMap.set(key, new Set());
    lowerMap.get(key).add(clean);
  });
  lowerMap.forEach((variants, key) => {
    if (variants.size > 1) issues.push(`Posible inconsistencia de escritura: ${[...variants].join(" / ")}.`);
  });
  return issues;
}

function renderFormResponses(templateId) {
  const template = getFormTemplate(templateId);
  const responses = getFormResponses(templateId);
  if (!template || !responses) return renderNotFound();
  const issues = analyzeFormResponses(template, responses);
  app.innerHTML = `
    <section class="article wide-article">
      <div class="card"><p class="eyebrow">Respuestas simuladas</p><h1>${esc(template.title)}</h1><p>Revisá cómo quedaría la información al llegar a Sheets y qué problemas habría que corregir antes de analizarla.</p><div class="actions"><a class="btn primary" href="#/forms-report">Armar reporte</a><a class="btn ghost" href="#/form-template/${template.id}">Ver diseño</a></div></div>
      <div class="card section"><h2>Tabla de respuestas</h2>${tableHtml(template.expectedSheetColumns, responses.rows, 20)}</div>
      <div class="card section"><h2>Problemas detectados</h2>${issues.length ? list(issues) : `<p>No se detectaron problemas evidentes en esta muestra.</p>`}</div>
      <div class="card section"><h2>Cómo organizar en Sheets</h2>${list(["Congelar la fila de encabezados.", "Aplicar filtros por categoría o estado.", "Revisar campos vacíos antes de contar o graficar.", "Unificar categorías escritas de forma diferente.", `Crear resumen sugerido: ${template.recommendedChart}`])}</div>
    </section>`;
}

function renderFormsReport() {
  const state = readFormsState();
  const template = formsLab?.reportTemplate || [];
  app.innerHTML = `
    <section class="article">
      <div class="card"><p class="eyebrow">Reporte Forms + Sheets</p><h1>Preparar reporte de formulario</h1><p class="lead">Completá un resumen educativo. No pegues respuestas reales, correos, teléfonos ni datos personales.</p></div>
      <div class="card section">
        <h2>Campos sugeridos</h2>
        ${template.map((field, idx) => `<label class="field-label" for="formsReportField${idx}">${esc(field)}</label><textarea class="textarea small-textarea" id="formsReportField${idx}" placeholder="${esc(field)}"></textarea>`).join("")}
        <div class="actions"><button class="btn primary" id="buildFormsReport">Generar reporte</button><button class="btn ghost" id="downloadFormsReport">Descargar .txt</button><button class="btn ghost" id="copyFormsReport">Copiar</button></div>
        <textarea class="textarea" id="formsFinalReport" readonly placeholder="El reporte aparecerá aquí."></textarea><p id="formsReportMsg" class="muted"></p>
      </div>
      <div class="card section"><h2>Reportes locales recientes</h2>${state.reports.length ? list(state.reports.slice(0,5).map(r => `${formatDate(r.date)} · ${r.title}`)) : `<p>No hay reportes guardados todavía.</p>`}</div>
    </section>`;
  const build = () => template.map((field, idx) => `${field}: ${document.querySelector(`#formsReportField${idx}`).value || "Sin completar"}`).join("\n");
  const save = (content) => {
    const st = readFormsState();
    st.reports.unshift({ title: "Reporte Forms + Sheets", date: new Date().toISOString(), summary: content.slice(0, 240) });
    writeFormsState(st);
  };
  document.querySelector("#buildFormsReport").addEventListener("click", () => {
    const content = `Reporte Forms + Sheets\nCurso: ${manifest.appName}\nFecha: ${new Date().toLocaleString("es-AR")}\n\n${build()}`;
    document.querySelector("#formsFinalReport").value = content;
    save(content);
    document.querySelector("#formsReportMsg").textContent = "Reporte generado y guardado localmente.";
  });
  document.querySelector("#downloadFormsReport").addEventListener("click", () => downloadText("reporte-forms-sheets.txt", document.querySelector("#formsFinalReport").value || build()));
  document.querySelector("#copyFormsReport").addEventListener("click", async () => {
    await navigator.clipboard?.writeText(document.querySelector("#formsFinalReport").value || build());
    document.querySelector("#formsReportMsg").textContent = "Reporte copiado.";
  });
}


function workspaceStateKey() {
  return `${storageKey()}:workspace-routine`;
}

function readWorkspaceState() {
  try {
    return JSON.parse(localStorage.getItem(workspaceStateKey())) || { permissionPractices: [], weeklyDone: [], checklistDone: [], reports: [] };
  } catch {
    return { permissionPractices: [], weeklyDone: [], checklistDone: [], reports: [] };
  }
}

function writeWorkspaceState(state) {
  localStorage.setItem(workspaceStateKey(), JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
}

function renderCollaborationHub() {
  const state = readWorkspaceState();
  const practiced = new Set((state.permissionPractices || []).map(p => p.id));
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Google Workspace v0.4</p>
        <h1>Colaboración, permisos y rutina de trabajo</h1>
        <p class="lead">Aprendé a compartir archivos con criterio, revisar permisos y sostener una rutina semanal de Drive, Gmail, Calendar, Sheets y Forms sin guardar datos sensibles.</p>
        <div class="actions">
          <a class="btn primary" href="#/permission-simulator">Simular permisos</a>
          <a class="btn ghost" href="#/weekly-routine">Rutina semanal</a>
          <a class="btn ghost" href="#/workspace-checklist">Checklist imprimible</a>
        </div>
      </div>
      <div class="grid two">
        <article class="card">
          <h2>Escenarios de permisos</h2>
          <p>Practicados: <strong>${practiced.size}/${workspaceRoutine?.permissionsScenarios?.length || 0}</strong></p>
          ${renderProgressBar(percent(practiced.size, workspaceRoutine?.permissionsScenarios?.length || 0))}
          <a class="btn primary" href="#/permission-simulator">Abrir simulador</a>
        </article>
        <article class="card">
          <h2>Permisos recomendados</h2>
          ${list((workspaceRoutine?.permissionLevels || []).map(item => `${item.level}: ${item.use}`))}
        </article>
      </div>
      <div class="card">
        <h2>Principio central</h2>
        <p>Compartí siempre con el permiso mínimo necesario: lector para consultar, comentador para revisar, editor para trabajar y propietario solo para responsables reales.</p>
      </div>
    </section>`;
}

function renderPermissionSimulator() {
  const scenarios = workspaceRoutine?.permissionsScenarios || [];
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Simulador de permisos</p>
        <h1>Compartir archivos correctamente</h1>
        <p class="lead">Elegí un escenario y revisá qué permiso conviene, qué errores evitar y qué pasos seguir antes de compartir.</p>
      </div>
      <div class="grid">
        ${scenarios.map(item => `
          <article class="card">
            <p class="eyebrow">${esc(item.recommendedPermission)}</p>
            <h2>${esc(item.title)}</h2>
            <p>${esc(item.context)}</p>
            <a class="btn primary" href="#/permission-case/${item.id}">Practicar caso</a>
          </article>
        `).join("")}
      </div>
    </section>`;
}

function renderPermissionCase(caseId) {
  const item = (workspaceRoutine?.permissionsScenarios || []).find(s => s.id === caseId);
  if (!item) return renderNotFound();
  const report = [
    `Caso: ${item.title}`,
    `Permiso recomendado: ${item.recommendedPermission}`,
    "",
    "Pasos sugeridos:",
    ...(item.steps || []).map((s, i) => `${i + 1}. ${s}`),
    "",
    "Errores a evitar:",
    ...(item.avoid || []).map((s, i) => `- ${s}`)
  ].join("\n");
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Caso de permisos</p>
        <h1>${esc(item.title)}</h1>
        <p class="lead">${esc(item.context)}</p>
        <p><strong>Permiso recomendado:</strong> ${esc(item.recommendedPermission)}</p>
      </div>
      <div class="grid two">
        <article class="card"><h2>Pasos seguros</h2>${list(item.steps || [])}</article>
        <article class="card danger-card"><h2>Errores a evitar</h2>${list(item.avoid || [])}</article>
      </div>
      <div class="card">
        <h2>Reporte del caso</h2>
        <textarea class="textarea" id="permissionReport" readonly>${esc(report)}</textarea>
        <div class="actions"><button class="btn primary" id="markPermissionPractice">Marcar como practicado</button><button class="btn ghost" id="copyPermissionReport">Copiar</button><button class="btn ghost" id="downloadPermissionReport">Descargar .txt</button></div>
        <p id="permissionMsg" class="muted"></p>
      </div>
    </section>`;
  document.querySelector("#markPermissionPractice").addEventListener("click", () => {
    const state = readWorkspaceState();
    const existing = state.permissionPractices || [];
    if (!existing.some(x => x.id === item.id)) existing.unshift({ id: item.id, title: item.title, date: new Date().toISOString() });
    state.permissionPractices = existing;
    writeWorkspaceState(state);
    document.querySelector("#permissionMsg").textContent = "Caso guardado localmente como práctica realizada.";
  });
  document.querySelector("#copyPermissionReport").addEventListener("click", async () => {
    await navigator.clipboard?.writeText(report);
    document.querySelector("#permissionMsg").textContent = "Reporte copiado.";
  });
  document.querySelector("#downloadPermissionReport").addEventListener("click", () => downloadText(`permiso-${item.id}.txt`, report));
}

function renderWorkspaceWeeklyRoutine() {
  const state = readWorkspaceState();
  const done = new Set(state.weeklyDone || []);
  const items = workspaceRoutine?.weeklyRoutine || [];
  app.innerHTML = `
    <section class="article">
      <div class="card">
        <p class="eyebrow">Rutina semanal</p>
        <h1>Organización semanal con Google Workspace</h1>
        <p class="lead">Una rutina breve para mantener Drive, Gmail, Calendar, Sheets y Forms bajo control.</p>
      </div>
      <div class="grid">
        ${items.map(item => `
          <article class="card">
            <p class="eyebrow">${esc(item.day)}</p>
            <h2>${esc(item.title)}</h2>
            <p>${esc(item.action)}</p>
            <label class="check-row"><input type="checkbox" data-routine="${esc(item.id)}" ${done.has(item.id) ? "checked" : ""}> Marcar esta práctica</label>
          </article>
        `).join("")}
      </div>
      <div class="card">
        <h2>Avance de rutina</h2>
        <p>${done.size}/${items.length} prácticas marcadas.</p>
        ${renderProgressBar(percent(done.size, items.length))}
        <div class="actions"><button class="btn ghost" id="clearRoutine">Reiniciar rutina semanal</button><a class="btn primary" href="#/workspace-checklist">Abrir checklist imprimible</a></div>
      </div>
    </section>`;
  document.querySelectorAll("[data-routine]").forEach(input => input.addEventListener("change", () => {
    const next = readWorkspaceState();
    const set = new Set(next.weeklyDone || []);
    if (input.checked) set.add(input.dataset.routine); else set.delete(input.dataset.routine);
    next.weeklyDone = [...set];
    writeWorkspaceState(next);
    renderWorkspaceWeeklyRoutine();
  }));
  document.querySelector("#clearRoutine")?.addEventListener("click", () => {
    const next = readWorkspaceState();
    next.weeklyDone = [];
    writeWorkspaceState(next);
    renderWorkspaceWeeklyRoutine();
  });
}

function renderWorkspacePrintChecklist() {
  const state = readWorkspaceState();
  const done = new Set(state.checklistDone || []);
  const items = workspaceRoutine?.printChecklist || [];
  const report = `Checklist Google Workspace\nFecha: ${new Date().toLocaleString("es-AR")}\n\n${items.map((item, idx) => `${done.has(String(idx)) ? "[x]" : "[ ]"} ${item}`).join("\n")}`;
  app.innerHTML = `
    <section class="article print-area">
      <div class="card">
        <p class="eyebrow">Checklist imprimible</p>
        <h1>Permisos y archivos compartidos</h1>
        <p class="lead">Usá esta lista para revisar Drive, archivos, formularios, planillas y agenda sin guardar datos sensibles.</p>
        <div class="actions no-print"><button class="btn primary" onclick="window.print()">Imprimir / guardar PDF</button><button class="btn ghost" id="downloadWorkspaceChecklist">Descargar .txt</button></div>
      </div>
      <div class="card">
        ${items.map((item, idx) => `
          <label class="check-row"><input type="checkbox" data-workspace-check="${idx}" ${done.has(String(idx)) ? "checked" : ""}> ${esc(item)}</label>
        `).join("")}
      </div>
      <div class="card no-print">
        <h2>Recordatorio</h2>
        <p>No anotes contraseñas, correos personales, enlaces privados ni nombres reales de personas en reportes exportados.</p>
      </div>
    </section>`;
  document.querySelectorAll("[data-workspace-check]").forEach(input => input.addEventListener("change", () => {
    const next = readWorkspaceState();
    const set = new Set(next.checklistDone || []);
    if (input.checked) set.add(input.dataset.workspaceCheck); else set.delete(input.dataset.workspaceCheck);
    next.checklistDone = [...set];
    writeWorkspaceState(next);
  }));
  document.querySelector("#downloadWorkspaceChecklist")?.addEventListener("click", () => downloadText("checklist-google-workspace.txt", report));
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



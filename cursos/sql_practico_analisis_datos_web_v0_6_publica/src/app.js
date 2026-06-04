const MANIFEST_PATH = "src/data/course_manifest.json";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let sqlLab = { tables: [], exercises: [] };
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
    const [courseData, checklistData, incidentData] = await Promise.all([
      loadJson(manifest.dataPaths.course),
      loadJson(manifest.dataPaths.checklists),
      loadJson(manifest.dataPaths.incidents),
    ]);
    course = courseData;
    checklists = checklistData.checklists || [];
    incidents = incidentData.incidents || [];
    if (manifest.dataPaths?.sqlLab) {
      sqlLab = await loadJson(manifest.dataPaths.sqlLab);
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
    "sql-lab": renderSqlLab,
    "sql-exercise": () => renderSqlExercise(p1),
    "sql-practice": renderSqlFreePractice,
    "sql-challenge": () => renderSqlChallenge(p1),
    "sql-progress": renderSqlProgress,
    "sql-guide": renderSqlBeginnerGuide,
    "sql-help": renderSqlContextHelp,
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
          <a class="btn ghost" href="#/sql-lab">Laboratorio SQL</a>
          <a class="btn ghost" href="#/sql-practice">Práctica libre</a>
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
        <p class="eyebrow">Práctica SQL</p>
        <h2>Laboratorio SQL + práctica libre</h2>
        <p>Practicá SELECT, WHERE, GROUP BY, JOIN, fechas y calidad de datos. Ahora incluye evaluador educativo, desafíos, guía paso a paso y ayudas contextuales.</p>
        <div class="actions"><a class="btn primary" href="#/sql-lab">Abrir laboratorio</a><a class="btn ghost" href="#/sql-practice">Práctica libre</a></div>
      </div>
    </section>
    <section class="section card compact-helper">
      <div>
        <p class="eyebrow">v0.3</p>
        <h2>SQL aplicado, con práctica y desafíos</h2>
        <p>La versión suma práctica libre, desafíos por dificultad, evaluación educativa de consultas y reporte de avance exportable.</p>
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


function tableById(tableId) {
  return (sqlLab.tables || []).find(table => table.id === tableId);
}

function exerciseById(exerciseId) {
  return (sqlLab.exercises || []).find(ex => ex.id === exerciseId);
}

function renderDataTable(columns = [], rows = [], maxRows = 20) {
  if (!columns.length) return `<p>No hay columnas para mostrar.</p>`;
  const visibleRows = rows.slice(0, maxRows);
  return `<div class="table-wrap"><table><thead><tr>${columns.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${visibleRows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>${rows.length > maxRows ? `<p class="muted">Vista parcial: ${maxRows} de ${rows.length} filas.</p>` : ""}</div>`;
}

function sqlPracticeKey() {
  const id = manifest?.courseId || "sql-practico";
  return `curso-web:${id}:sql-practice:v1`;
}

function readSqlPracticeHistory() {
  try { return JSON.parse(localStorage.getItem(sqlPracticeKey())) || []; } catch { return []; }
}

function writeSqlPracticeHistory(items) {
  localStorage.setItem(sqlPracticeKey(), JSON.stringify(items.slice(-20)));
}

function saveSqlPractice(exercise) {
  const history = readSqlPracticeHistory();
  history.push({ id: exercise.id, title: exercise.title, topic: exercise.topic, savedAt: new Date().toISOString() });
  writeSqlPracticeHistory(history);
}

async function copyText(text, selector) {
  await navigator.clipboard?.writeText(text);
  const el = selector ? document.querySelector(selector) : null;
  if (el) el.textContent = "Copiado.";
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

function practiceText(exercise) {
  return [
    `SQL Práctico para Análisis de Datos — práctica`,
    `Ejercicio: ${exercise.title}`,
    `Tema: ${exercise.topic}`,
    `Nivel: ${exercise.level}`,
    `Objetivo: ${exercise.objective}`,
    `Consigna: ${exercise.prompt}`,
    ``,
    `Consulta sugerida:`,
    exercise.query,
    ``,
    `Explicación: ${exercise.explanation}`,
    `Error común: ${exercise.commonMistake}`,
    ``,
    `Nota: práctica educativa simulada. Validá sintaxis y funciones según el motor SQL real que uses.`
  ].join("\n");
}

function renderSqlLab() {
  const tables = sqlLab.tables || [];
  const exercises = sqlLab.exercises || [];
  const history = readSqlPracticeHistory();
  app.innerHTML = `
    <section class="section-head">
      <div><p class="eyebrow">Laboratorio SQL</p><h1>${esc(sqlLab.title || "Laboratorio SQL simulado")}</h1><p>${esc(sqlLab.description || "Practicá consultas SQL con tablas de ejemplo.")}</p></div>
      <div class="actions"><a class="btn ghost" href="#/modules">Volver al curso</a><a class="btn primary" href="#/sql-practice">Práctica libre</a><a class="btn ghost" href="#/sql-guide">Guía paso a paso</a><a class="btn ghost" href="#/sql-help">Ayuda SQL</a><a class="btn ghost" href="#/sql-progress">Avance SQL</a></div>
    </section>
    <section class="grid two section">
      <div class="card">
        <p class="eyebrow">Tablas de ejemplo</p>
        <h2>Datos disponibles</h2>
        <div class="list">${tables.map(t => `<a class="list-row" href="#/sql-lab" data-table-preview="${esc(t.id)}"><span>${esc(t.title)}</span><span class="pill">${(t.rows||[]).length} filas</span></a>`).join("")}</div>
      </div>
      <div class="card">
        <p class="eyebrow">Progreso práctico</p>
        <h2>${history.length} prácticas guardadas</h2>
        <p>El historial solo guarda título, tema y fecha. No guarda datos sensibles ni consultas personales.</p>
        ${history.length ? `<div class="list">${history.slice(-5).reverse().map(item => `<div class="list-row"><span>${esc(item.title)}</span><span class="pill ok">${esc(item.topic)}</span></div>`).join("")}</div>` : `<p>Todavía no guardaste prácticas.</p>`}
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Ejercicios guiados</p><h2>Consultas sugeridas</h2></div></div>
      <div class="grid modules">${exercises.map(ex => `<article class="card module-card"><div class="meta"><span class="pill ok">${esc(ex.topic)}</span><span class="pill">${esc(ex.level)}</span></div><h3>${esc(ex.title)}</h3><p>${esc(ex.objective)}</p><p><strong>Consigna:</strong> ${esc(ex.prompt)}</p><div class="actions"><a class="btn primary" href="#/sql-exercise/${ex.id}">Practicar</a></div></article>`).join("")}</div>
    </section>
    <section class="section">
      <div class="section-head"><div><p class="eyebrow">Práctica SQL</p><h2>Desafíos por dificultad</h2></div><a class="btn ghost" href="#/sql-progress">Ver avance SQL</a></div>
      <div class="grid modules">${(sqlLab.challenges || []).map(ch => `<article class="card module-card"><div class="meta"><span class="pill warn">${esc(ch.difficulty)}</span><span class="pill">${esc(ch.topic)}</span></div><h3>${esc(ch.title)}</h3><p>${esc(ch.prompt)}</p><div class="actions"><a class="btn primary" href="#/sql-challenge/${ch.id}">Resolver desafío</a></div></article>`).join("")}</div>
    </section>
    <section class="section card sql-flow-card">
      <p class="eyebrow">Nuevo en v0.4</p>
      <h2>Ruta sugerida para principiantes</h2>
      <div class="stepper">
        <span>1 · Mirar tabla</span><span>2 · Elegir columnas</span><span>3 · Filtrar</span><span>4 · Agrupar</span><span>5 · Explicar resultado</span>
      </div>
      <div class="actions"><a class="btn primary" href="#/sql-guide">Abrir guía paso a paso</a><a class="btn ghost" href="#/sql-help">Ver ayuda por cláusula</a></div>
    </section>
    <section class="section card" id="tablePreview"><p class="eyebrow">Vista rápida</p><h2>Elegí una tabla para previsualizarla</h2><p>Usá las tablas de ejemplo para entender qué columnas existen antes de escribir una consulta.</p></section>`;
  document.querySelectorAll("[data-table-preview]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const table = tableById(link.dataset.tablePreview);
      const target = document.querySelector("#tablePreview");
      target.innerHTML = `<p class="eyebrow">Tabla de ejemplo</p><h2>${esc(table.title)}</h2><p>${esc(table.description)}</p>${renderDataTable(table.columns, table.rows)}`;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderSqlExercise(exerciseId) {
  const exercise = exerciseById(exerciseId);
  if (!exercise) return renderNotFound();
  const table = tableById(exercise.tableId);
  const text = practiceText(exercise);
  app.innerHTML = `
    <section class="section-head">
      <div><p class="eyebrow">${esc(exercise.topic)} · ${esc(exercise.level)}</p><h1>${esc(exercise.title)}</h1><p>${esc(exercise.objective)}</p></div>
      <a class="btn ghost" href="#/sql-lab">Volver al laboratorio</a>
    </section>
    <section class="grid two section">
      <article class="card">
        <p class="eyebrow">Consigna</p>
        <h2>Problema</h2>
        <p>${esc(exercise.prompt)}</p>
        <h3>Consulta sugerida</h3>
        <textarea class="textarea" readonly id="sqlQuery">${esc(exercise.query)}</textarea>
        <div class="actions"><button class="btn primary" id="copySql">Copiar SQL</button><button class="btn ghost" id="downloadPractice">Descargar práctica TXT</button><button class="btn ghost" id="savePractice">Guardar práctica</button></div>
        <p id="sqlActionMsg" class="muted"></p>
      </article>
      <article class="card">
        <p class="eyebrow">Explicación</p>
        <h2>Cómo leer esta consulta</h2>
        <p>${esc(exercise.explanation)}</p>
        <h3>Error común</h3>
        <p>${esc(exercise.commonMistake)}</p>
      </article>
    </section>
    <section class="section card">
      <p class="eyebrow">Tabla usada</p>
      <h2>${esc(table?.title || "Tabla")}</h2>
      <p>${esc(table?.description || "")}</p>
      ${renderDataTable(table?.columns || [], table?.rows || [], 10)}
    </section>
    <section class="section card">
      <p class="eyebrow">Resultado esperado simulado</p>
      <h2>Salida esperada</h2>
      ${renderDataTable(exercise.expectedColumns || [], exercise.expectedRows || [])}
      <p class="muted">El resultado es educativo y simulado. La sintaxis puede variar levemente entre SQLite, PostgreSQL, MySQL, SQL Server, BigQuery u otros motores.</p>
    </section>
    <section class="section card">
      <p class="eyebrow">Nuevo en v0.4</p>
      <h2>Compará tu consulta con la sugerida</h2>
      <p>Escribí tu versión. El comparador revisa estructura y palabras clave; no ejecuta SQL real.</p>
      <textarea class="textarea tall sql-editor" id="exerciseAttempt">${esc(exercise.query)}</textarea>
      <div class="actions"><button class="btn primary" id="compareExerciseSql">Comparar</button><a class="btn ghost" href="#/sql-help">Ayuda por cláusula</a></div>
      <div id="exerciseCompareResult" class="result-box muted">La comparación aparecerá acá.</div>
    </section>`;
  document.querySelector("#copySql").addEventListener("click", () => copyText(exercise.query, "#sqlActionMsg"));
  document.querySelector("#downloadPractice").addEventListener("click", () => downloadText(`${exercise.id}.txt`, text));
  document.querySelector("#savePractice").addEventListener("click", () => { saveSqlPractice(exercise); document.querySelector("#sqlActionMsg").textContent = "Práctica guardada en historial local."; });
  document.querySelector("#compareExerciseSql").addEventListener("click", () => {
    const attempt = document.querySelector("#exerciseAttempt").value;
    const expected = extractKeywordsFromQuery(exercise.query);
    const evaluation = evaluateSqlQuery(attempt, expected);
    document.querySelector("#exerciseCompareResult").innerHTML = renderSqlEvaluation(evaluation, "Comparación con la consulta sugerida");
  });
}


function sqlChallengeById(id) {
  return (sqlLab.challenges || []).find(challenge => challenge.id === id);
}

function sqlTemplateById(id) {
  return (sqlLab.freePracticeTemplates || []).find(template => template.id === id);
}

function sqlProgressKey() {
  const id = manifest?.courseId || "sql-practico";
  return `curso-web:${id}:sql-progress:v3`;
}

function readSqlV3Progress() {
  try {
    return { challenges: [], freePractices: [], ...(JSON.parse(localStorage.getItem(sqlProgressKey())) || {}) };
  } catch {
    return { challenges: [], freePractices: [] };
  }
}

function writeSqlV3Progress(next) {
  localStorage.setItem(sqlProgressKey(), JSON.stringify(next));
}

function normalizeSql(query = "") {
  return query.toLowerCase().replace(/--.*$/gm, " ").replace(/\s+/g, " ").trim();
}

function evaluateSqlQuery(query = "", expectedKeywords = []) {
  const normalized = normalizeSql(query);
  const checks = [
    { label: "Incluye SELECT", ok: /\bselect\b/.test(normalized) },
    { label: "Incluye FROM", ok: /\bfrom\b/.test(normalized) },
    { label: "Evita SELECT * en práctica profesional", ok: !/select\s+\*/.test(normalized) },
    { label: "Tiene cierre o estructura legible", ok: normalized.length >= 20 },
    ...expectedKeywords.map(k => ({ label: `Contiene ${k.toUpperCase()}`, ok: normalized.includes(String(k).toLowerCase()) }))
  ];
  const okCount = checks.filter(c => c.ok).length;
  const score = percent(okCount, checks.length);
  return { score, checks };
}

function challengeText(challenge, answer, evaluation) {
  return [
    "SQL Práctico para Análisis de Datos — desafío",
    `Desafío: ${challenge.title}`,
    `Dificultad: ${challenge.difficulty}`,
    `Tema: ${challenge.topic}`,
    `Consigna: ${challenge.prompt}`,
    "",
    "Respuesta escrita:",
    answer || "Sin respuesta guardada.",
    "",
    `Puntaje educativo: ${evaluation.score}%`,
    "Revisión:",
    ...evaluation.checks.map(c => `- ${c.ok ? "OK" : "Revisar"}: ${c.label}`),
    "",
    "Respuesta sugerida:",
    challenge.suggestedAnswer,
    "",
    "Nota: esta evaluación es heurística y educativa; no ejecuta SQL real."
  ].join("\n");
}

function renderSqlFreePractice() {
  const templates = sqlLab.freePracticeTemplates || [];
  const progress = readSqlV3Progress();
  const starter = templates[0]?.query || "SELECT columna\nFROM tabla\nWHERE condicion;";
  app.innerHTML = `
    <section class="section-head">
      <div><p class="eyebrow">Práctica SQL</p><h1>Práctica libre SQL</h1><p>Elegí una plantilla, adaptala y usá el evaluador educativo para revisar estructura básica. No ejecuta SQL real: sirve para aprender a escribir consultas.</p></div>
      <a class="btn ghost" href="#/sql-lab">Volver al laboratorio</a>
    </section>
    <section class="grid two section">
      <article class="card">
        <p class="eyebrow">Plantillas</p>
        <h2>Elegí un punto de partida</h2>
        <div class="list">${templates.map(t => `<button class="list-row button-row" data-template="${esc(t.id)}"><span>${esc(t.title)}</span><span class="pill">usar</span></button>`).join("")}</div>
      </article>
      <article class="card">
        <p class="eyebrow">Historial</p>
        <h2>${progress.freePractices.length} prácticas libres</h2>
        <p>Solo se guarda fecha, puntaje y título. Evitá escribir datos personales o información real sensible.</p>
        ${progress.freePractices.length ? `<div class="list">${progress.freePractices.slice(-5).reverse().map(item => `<div class="list-row"><span>${esc(item.title)}</span><span class="pill ok">${item.score}%</span></div>`).join("")}</div>` : `<p>Todavía no hay prácticas libres guardadas.</p>`}
      </article>
    </section>
    <section class="section card">
      <label class="form-label">Título de la práctica<input class="input" id="freeTitle" value="Práctica libre SQL"></label>
      <label class="form-label">Consulta SQL<textarea class="textarea tall" id="freeSql">${esc(starter)}</textarea></label>
      <div class="actions"><button class="btn primary" id="evaluateFreeSql">Evaluar consulta</button><button class="btn ghost" id="saveFreeSql">Guardar avance</button><button class="btn ghost" id="downloadFreeSql">Descargar TXT</button></div>
      <div id="freeSqlResult" class="result-box muted">El resultado aparecerá acá.</div>
    </section>`;
  document.querySelectorAll("[data-template]").forEach(btn => btn.addEventListener("click", () => {
    const tpl = sqlTemplateById(btn.dataset.template);
    document.querySelector("#freeTitle").value = tpl.title;
    document.querySelector("#freeSql").value = tpl.query;
    document.querySelector("#freeSqlResult").innerHTML = `<p><strong>${esc(tpl.title)}:</strong> ${esc(tpl.description)}</p>`;
  }));
  const run = () => {
    const query = document.querySelector("#freeSql").value;
    const evaluation = evaluateSqlQuery(query, []);
    document.querySelector("#freeSqlResult").innerHTML = renderSqlEvaluation(evaluation, "Puntaje orientativo");
    return evaluation;
  };
  document.querySelector("#evaluateFreeSql").addEventListener("click", run);
  document.querySelector("#saveFreeSql").addEventListener("click", () => {
    const evaluation = run();
    const state = readSqlV3Progress();
    state.freePractices.push({ title: document.querySelector("#freeTitle").value || "Práctica libre", score: evaluation.score, savedAt: new Date().toISOString() });
    writeSqlV3Progress(state);
    renderSqlFreePractice();
  });
  document.querySelector("#downloadFreeSql").addEventListener("click", () => {
    const evaluation = run();
    const title = document.querySelector("#freeTitle").value || "Práctica libre";
    const query = document.querySelector("#freeSql").value;
    downloadText("practica-libre-sql.txt", [`SQL Práctico — práctica libre`, `Título: ${title}`, `Puntaje: ${evaluation.score}%`, "", query, "", ...evaluation.checks.map(c => `- ${c.ok ? "OK" : "Revisar"}: ${c.label}`)].join("\n"));
  });
}

function renderSqlChallenge(challengeId) {
  const challenge = sqlChallengeById(challengeId);
  if (!challenge) return renderNotFound();
  app.innerHTML = `
    <section class="section-head">
      <div><p class="eyebrow">${esc(challenge.topic)} · ${esc(challenge.difficulty)}</p><h1>${esc(challenge.title)}</h1><p>${esc(challenge.prompt)}</p></div>
      <a class="btn ghost" href="#/sql-lab">Volver al laboratorio</a>
    </section>
    <section class="grid two section">
      <article class="card">
        <h2>Escribí tu consulta</h2>
        <textarea class="textarea tall" id="challengeSql">SELECT ...\nFROM ...;</textarea>
        <div class="actions"><button class="btn primary" id="evaluateChallenge">Evaluar</button><button class="btn ghost" id="saveChallenge">Guardar resultado</button><button class="btn ghost" id="downloadChallenge">Descargar reporte</button></div>
        <div id="challengeResult" class="result-box muted">El evaluador revisa estructura y palabras clave esperadas. No ejecuta SQL real.</div>
      </article>
      <article class="card">
        <p class="eyebrow">Ayuda</p>
        <h2>Qué debería aparecer</h2>
        ${list((challenge.expectedKeywords || []).map(k => `Usar o considerar: ${k.toUpperCase()}`))}
        <details><summary>Ver respuesta sugerida</summary><pre><code>${esc(challenge.suggestedAnswer)}</code></pre></details>
      </article>
    </section>`;
  const run = () => {
    const answer = document.querySelector("#challengeSql").value;
    const evaluation = evaluateSqlQuery(answer, challenge.expectedKeywords || []);
    document.querySelector("#challengeResult").innerHTML = renderSqlEvaluation(evaluation, "Puntaje educativo");
    return evaluation;
  };
  document.querySelector("#evaluateChallenge").addEventListener("click", run);
  document.querySelector("#saveChallenge").addEventListener("click", () => {
    const evaluation = run();
    const state = readSqlV3Progress();
    state.challenges.push({ id: challenge.id, title: challenge.title, topic: challenge.topic, difficulty: challenge.difficulty, score: evaluation.score, savedAt: new Date().toISOString() });
    writeSqlV3Progress(state);
    document.querySelector("#challengeResult").insertAdjacentHTML("beforeend", `<p class="ok-text">Resultado guardado localmente.</p>`);
  });
  document.querySelector("#downloadChallenge").addEventListener("click", () => {
    const answer = document.querySelector("#challengeSql").value;
    const evaluation = run();
    downloadText(`${challenge.id}-reporte.txt`, challengeText(challenge, answer, evaluation));
  });
}

function renderSqlProgress() {
  const guided = readSqlPracticeHistory();
  const progress = readSqlV3Progress();
  const allChallengeScores = progress.challenges.map(item => item.score);
  const avg = allChallengeScores.length ? Math.round(allChallengeScores.reduce((a,b)=>a+b,0)/allChallengeScores.length) : 0;
  const report = [
    "SQL Práctico para Análisis de Datos — reporte de avance",
    `Fecha: ${new Date().toLocaleString()}`,
    `Prácticas guiadas guardadas: ${guided.length}`,
    `Prácticas libres guardadas: ${progress.freePractices.length}`,
    `Desafíos resueltos: ${progress.challenges.length}`,
    `Promedio de desafíos: ${avg}%`,
    "",
    "Últimos desafíos:",
    ...progress.challenges.slice(-10).map(item => `- ${item.title}: ${item.score}% (${item.difficulty})`),
    "",
    "Nota: reporte educativo local. No acredita certificación oficial."
  ].join("\n");
  app.innerHTML = `
    <section class="section-head">
      <div><p class="eyebrow">Reporte v0.3</p><h1>Avance SQL</h1><p>Resumen local de ejercicios guiados, práctica libre y desafíos.</p></div>
      <a class="btn ghost" href="#/sql-lab">Volver al laboratorio</a>
    </section>
    <section class="grid three section">
      <div class="card stat"><strong>${guided.length}</strong><span>Prácticas guiadas</span></div>
      <div class="card stat"><strong>${progress.freePractices.length}</strong><span>Prácticas libres</span></div>
      <div class="card stat"><strong>${avg}%</strong><span>Promedio desafíos</span></div>
    </section>
    <section class="section card">
      <h2>Reporte exportable</h2>
      <pre><code>${esc(report)}</code></pre>
      <div class="actions"><button class="btn primary" id="copySqlProgress">Copiar reporte</button><button class="btn ghost" id="downloadSqlProgress">Descargar TXT</button></div>
      <p id="sqlProgressMsg" class="muted"></p>
    </section>`;
  document.querySelector("#copySqlProgress").addEventListener("click", () => copyText(report, "#sqlProgressMsg"));
  document.querySelector("#downloadSqlProgress").addEventListener("click", () => downloadText("reporte-avance-sql.txt", report));
}


function renderSqlBeginnerGuide() {
  const guide = sqlLab.beginnerGuide || [];
  app.innerHTML = `
    <section class="section-head">
      <div><p class="eyebrow">Nuevo en v0.4</p><h1>Guía paso a paso para escribir una consulta SQL</h1><p>Una ruta simple para pasar de una pregunta de negocio a una consulta legible.</p></div>
      <div class="actions"><a class="btn ghost" href="#/sql-lab">Volver al laboratorio</a><a class="btn primary" href="#/sql-practice">Practicar libre</a></div>
    </section>
    <section class="section sql-guide">
      ${(guide.length ? guide : defaultSqlGuide()).map((step, index) => `
        <article class="card guide-step">
          <span class="step-number">${index + 1}</span>
          <div><p class="eyebrow">Paso ${index + 1}</p><h2>${esc(step.title)}</h2><p>${esc(step.description)}</p>${step.example ? `<pre><code>${esc(step.example)}</code></pre>` : ""}</div>
        </article>`).join("")}
    </section>
    <section class="section grid two">
      <article class="card"><h2>Consejo práctico</h2><p>Antes de escribir SQL, anotá en lenguaje común qué pregunta querés responder, qué tabla usarías y qué columnas necesitás.</p></article>
      <article class="card"><h2>Atajo de aprendizaje</h2><p>Primero dominá <code>SELECT</code>, <code>FROM</code> y <code>WHERE</code>. Luego sumá <code>GROUP BY</code>, fechas y <code>JOIN</code>.</p></article>
    </section>`;
}

function defaultSqlGuide() {
  return [
    { title: "Definir la pregunta", description: "Convertí el pedido en una pregunta clara: qué quiero saber y para qué.", example: "¿Qué productos vendieron más unidades?" },
    { title: "Elegir tabla", description: "Buscá la tabla que contiene las columnas necesarias.", example: "FROM ventas_kiosco" },
    { title: "Elegir columnas", description: "Seleccioná solo las columnas útiles para responder la pregunta.", example: "SELECT producto, cantidad" },
    { title: "Filtrar", description: "Usá WHERE para quedarte con los registros relevantes.", example: "WHERE medio_pago = 'QR'" },
    { title: "Agrupar y ordenar", description: "Usá GROUP BY para indicadores y ORDER BY para leer mejor el resultado.", example: "GROUP BY producto\nORDER BY unidades DESC" }
  ];
}

function renderSqlContextHelp() {
  const clauses = sqlLab.contextHelp || defaultSqlContextHelp();
  app.innerHTML = `
    <section class="section-head">
      <div><p class="eyebrow">Ayuda contextual v0.4</p><h1>Ayuda rápida por cláusula SQL</h1><p>Guía de consulta para leer y escribir <code>SELECT</code>, <code>WHERE</code>, <code>GROUP BY</code>, <code>JOIN</code> y fechas.</p></div>
      <a class="btn ghost" href="#/sql-lab">Volver al laboratorio</a>
    </section>
    <section class="grid two section">
      ${clauses.map(item => `
        <article class="card clause-card">
          <p class="eyebrow">${esc(item.clause)}</p>
          <h2>${esc(item.title)}</h2>
          <p>${esc(item.description)}</p>
          <pre><code>${esc(item.example)}</code></pre>
          <h3>Error común</h3>
          <p>${esc(item.commonMistake)}</p>
        </article>`).join("")}
    </section>`;
}

function defaultSqlContextHelp() {
  return [
    { clause: "SELECT", title: "Qué columnas mostrar", description: "Define qué campos aparecen en el resultado.", example: "SELECT producto, cantidad\nFROM ventas_kiosco;", commonMistake: "Usar SELECT * cuando el reporte solo necesita dos o tres columnas." },
    { clause: "WHERE", title: "Filtrar filas", description: "Reduce la tabla a los registros que cumplen una condición.", example: "WHERE medio_pago = 'QR'", commonMistake: "Confundir filtro de filas con agrupación de resultados." },
    { clause: "GROUP BY", title: "Agrupar para medir", description: "Agrupa filas para calcular totales, promedios o conteos.", example: "SELECT categoria, SUM(cantidad)\nFROM ventas_kiosco\nGROUP BY categoria;", commonMistake: "Seleccionar columnas que no están agrupadas ni agregadas." },
    { clause: "JOIN", title: "Unir tablas", description: "Relaciona tablas mediante una clave compartida.", example: "FROM clientes c\nJOIN pedidos p ON c.cliente_id = p.cliente_id", commonMistake: "Unir tablas sin ON o con una clave incorrecta." },
    { clause: "Fechas", title: "Analizar por período", description: "Permite mirar datos por día, mes, semana o rango.", example: "WHERE fecha >= '2026-05-01'\nORDER BY fecha", commonMistake: "Comparar fechas como texto sin revisar el formato real del motor SQL." }
  ];
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



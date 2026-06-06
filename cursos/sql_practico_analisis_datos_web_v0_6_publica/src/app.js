const MANIFEST_PATH = "src/data/course_manifest.json";
const PORTAL_PATH = "../../portal/portal_publico_profesional_v0_6/index.html";

let manifest = null;
let course = null;
let checklists = [];
let incidents = [];
let quizRuntime = { moduleId: null, answers: {} };

const app = document.querySelector("#app");
const themeSelect = document.querySelector("#selector-ambiente");

function storageKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:progress:v2-libro-abierto`;
}

function notesKey(scope) {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:notes:${scope}:v1`;
}

function themeKey() {
  const id = manifest?.courseId || "curso-web";
  return `curso-web:${id}:ambiente:v1`;
}

const emptyProgress = () => ({
  lessons: [],
  quizzes: {},
  checklistItems: [],
  visitedIncidents: [],
  updatedAt: null
});

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
  reset() {
    localStorage.removeItem(storageKey());
  }
};

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function attr(value = "") {
  return esc(value).replaceAll("`", "&#096;");
}

function formatText(value = "") {
  const clean = esc(value).replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
  return clean ? `<p>${clean}</p>` : "";
}

function list(items = []) {
  if (!items.length) return "";
  return `<ul>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function percent(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  return response.json();
}

async function bootstrap() {
  try {
    manifest = await loadJson(MANIFEST_PATH);
    applyShell();
    applyTheme(localStorage.getItem(themeKey()) || "candil");

    const [courseData, checklistData, incidentData] = await Promise.all([
      loadJson(manifest.dataPaths.course),
      loadJson(manifest.dataPaths.checklists),
      loadJson(manifest.dataPaths.incidents)
    ]);

    course = courseData;
    checklists = checklistData.checklists || [];
    incidents = incidentData.incidents || [];

    window.addEventListener("hashchange", render);
    render();
  } catch (error) {
    app.innerHTML = `
      <section class="escena-libro-abierto">
        <div class="mueble-libro error-book">
          <div class="pagina-izq"><h1>Error de carga</h1></div>
          <div class="pagina-der">
            <p>No se pudieron cargar los JSON locales. Abrilo con un servidor local, por ejemplo Live Server o python -m http.server.</p>
            <p><strong>Detalle:</strong> ${esc(error.message)}</p>
          </div>
        </div>
      </section>`;
  }
}

function applyShell() {
  document.title = `${manifest.appName || course?.title || "Curso"} - Cursoteca Abierta`;
  const brand = document.querySelector("[data-brand-name]");
  if (brand) brand.textContent = manifest.shortName || manifest.appName || "Cursoteca Abierta";
  const subtitle = document.querySelector("[data-brand-subtitle]");
  if (subtitle) subtitle.textContent = manifest.subtitle || "Manual de estudio";
  const portalLinks = document.querySelectorAll("[data-portal-return]");
  portalLinks.forEach(link => link.href = PORTAL_PATH);
  if (themeSelect) themeSelect.value = localStorage.getItem(themeKey()) || "candil";
}

function applyTheme(value) {
  document.body.classList.remove("ambiente-claro", "ambiente-nocturno");
  if (value === "claro") document.body.classList.add("ambiente-claro");
  if (value === "nocturno") document.body.classList.add("ambiente-nocturno");
  try {
    localStorage.setItem(themeKey(), value);
  } catch {
    // El curso funciona aunque el navegador bloquee almacenamiento local.
  }
  if (themeSelect) themeSelect.value = value;
}

function getAllLessons() {
  return (course.modules || []).flatMap(module =>
    (module.lessons || []).map(lesson => ({ ...lesson, moduleId: module.id, moduleTitle: module.title }))
  );
}

function getModule(moduleId) {
  return (course.modules || []).find(module => module.id === moduleId);
}

function getLesson(moduleId, lessonId) {
  return getModule(moduleId)?.lessons?.find(lesson => lesson.id === lessonId);
}

function getChecklist(id) {
  return checklists.find(item => item.id === id);
}

function getIncident(id) {
  return incidents.find(item => item.id === id);
}

function completionStats() {
  const state = storage.read();
  const allLessons = getAllLessons();
  const quizTotal = (course.modules || []).filter(module => (module.quiz || []).length).length;
  const allChecklistItems = checklists.flatMap(checklist => checklist.items || []);
  return {
    lessonsDone: allLessons.filter(lesson => state.lessons.includes(lesson.id)).length,
    lessonsTotal: allLessons.length,
    quizDone: Object.keys(state.quizzes || {}).length,
    quizTotal,
    checklistDone: allChecklistItems.filter(item => state.checklistItems.includes(item.id)).length,
    checklistTotal: allChecklistItems.length,
    incidentDone: (state.visitedIncidents || []).length,
    incidentTotal: incidents.length
  };
}

function overallProgress() {
  const s = completionStats();
  return percent(
    s.lessonsDone + s.quizDone + s.checklistDone + s.incidentDone,
    s.lessonsTotal + s.quizTotal + s.checklistTotal + s.incidentTotal
  );
}

function route() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!parts.length) return { name: "home" };
  return { name: parts[0], a: parts[1], b: parts[2] };
}

function render() {
  const current = route();
  const content = renderRightPage(current);
  app.innerHTML = `
    <section class="escena-libro-abierto">
      <div class="book-actions">
        <a class="btn-volver" href="${PORTAL_PATH}">Cerrar volumen y volver al estante</a>
        <a href="#/">Portada</a>
        <a href="#/checklists">Checklists</a>
        <a href="#/incidents">Casos</a>
        <a href="#/certificate">Constancia</a>
      </div>
      <div class="mueble-libro">
        <aside class="pagina-izq">
          ${renderLeftPage(current)}
        </aside>
        <article class="pagina-der animacion-pagina">
          ${content}
        </article>
      </div>
    </section>`;
  focusMain();
}

function focusMain() {
  requestAnimationFrame(() => {
    const main = document.querySelector("#app");
    if (main) main.focus({ preventScroll: true });
  });
}

function renderLeftPage(current) {
  const progress = overallProgress();
  const stats = completionStats();
  return `
    <span class="curso-categoria">${esc(manifest.subtitle || "Manual de estudio")}</span>
    <h1 class="curso-titulo-abierto">${esc(course.title || manifest.appName)}</h1>
    <div class="progreso-global-contenedor">
      <span class="progreso-titulo-macro">Progreso del volumen</span>
      <div class="barra-macro-bg"><div class="barra-macro-fill" style="width:${progress}%"></div></div>
      <span class="texto-macro-porcentaje">${progress}% completado</span>
    </div>
    <div class="indice-resumen">
      <span>${stats.lessonsDone}/${stats.lessonsTotal} lecciones</span>
      <span>${stats.quizDone}/${stats.quizTotal} evaluaciones</span>
      <span>${stats.checklistDone}/${stats.checklistTotal} checklist</span>
    </div>
    <nav class="indice-lecciones" aria-label="Indice del curso">
      <a class="${current.name === "home" ? "activa" : ""}" href="#/">
        <span class="num">0</span><span>Portada del volumen</span>
      </a>
      ${(course.modules || []).map((module, moduleIndex) => renderModuleIndex(module, moduleIndex, current)).join("")}
      <a class="${current.name === "checklists" ? "activa" : ""}" href="#/checklists"><span class="num">C</span><span>Checklists</span></a>
      <a class="${current.name === "incidents" ? "activa" : ""}" href="#/incidents"><span class="num">K</span><span>Casos practicos</span></a>
      <a class="${current.name === "progress" ? "activa" : ""}" href="#/progress"><span class="num">P</span><span>Progreso y exportacion</span></a>
    </nav>`;
}

function renderModuleIndex(module, moduleIndex, current) {
  const state = storage.read();
  const lessons = module.lessons || [];
  return `
    <section class="indice-modulo">
      <a class="item-modulo ${current.name === "module" && current.a === module.id ? "activa" : ""}" href="#/module/${attr(module.id)}">
        <span class="num">${moduleIndex + 1}</span><span>${esc(module.title)}</span>
      </a>
      ${lessons.map((lesson, lessonIndex) => {
        const read = state.lessons.includes(lesson.id);
        const active = current.name === "lesson" && current.a === module.id && current.b === lesson.id;
        return `
          <a class="item-leccion ${active ? "activa" : ""} ${read ? "leida" : ""}" href="#/lesson/${attr(module.id)}/${attr(lesson.id)}">
            <span class="num">${moduleIndex + 1}.${lessonIndex + 1}</span>
            <span>${esc(lesson.title)}</span>
            <span class="tilde-completado">${read ? "OK" : ""}</span>
          </a>`;
      }).join("")}
      ${(module.quiz || []).length ? `<a class="item-leccion item-quiz ${current.name === "quiz" && current.a === module.id ? "activa" : ""}" href="#/quiz/${attr(module.id)}"><span class="num">Q</span><span>Evaluacion del modulo</span></a>` : ""}
    </section>`;
}

function renderRightPage(current) {
  if (current.name === "home") return renderHome();
  if (current.name === "module") return renderModule(current.a);
  if (current.name === "lesson") return renderLesson(current.a, current.b);
  if (current.name === "quiz") return renderQuiz(current.a);
  if (current.name === "checklists") return renderChecklists();
  if (current.name === "checklist") return renderChecklist(current.a);
  if (current.name === "incidents") return renderIncidents();
  if (current.name === "incident") return renderIncident(current.a);
  if (current.name === "certificate") return renderCertificate();
  if (current.name === "progress") return renderProgressTools();
  if (current.name === "legal") return renderLegal();
  if (current.name === "accessibility") return renderAccessibility();
  if (current.name === "publish") return renderPublish();
  if (current.name === "template") return renderTemplate();
  if (current.name === "emergency") return renderEmergency();
  return renderHome();
}

function renderHome() {
  const firstModule = course.modules?.[0];
  const firstLesson = firstModule?.lessons?.[0];
  return `
    <div class="leccion-meta">Portada del volumen</div>
    <h2 class="leccion-titulo">${esc(course.title || manifest.appName)}</h2>
    <div class="leccion-texto">
      ${formatText(course.presentation || manifest.description || manifest.subtitle || "Curso abierto de Cursoteca Abierta.")}
    </div>
    ${course.objectives?.length ? `<section class="bloque-lectura"><h3>Objetivos de aprendizaje</h3>${list(course.objectives)}</section>` : ""}
    ${course.finalProduct ? `<section class="bloque-lectura"><h3>Producto final</h3>${formatText(course.finalProduct)}</section>` : ""}
    <div class="acciones-pagina">
      ${firstLesson ? `<a class="button-link" href="#/lesson/${attr(firstModule.id)}/${attr(firstLesson.id)}">Comenzar lectura</a>` : ""}
      <a class="secondary-button" href="#/checklists">Ver checklists</a>
    </div>
    ${renderNotes("portada")}`;
}

function renderModule(moduleId) {
  const module = getModule(moduleId) || course.modules?.[0];
  if (!module) return renderHome();
  const firstLesson = module.lessons?.[0];
  return `
    <div class="leccion-meta">Modulo</div>
    <h2 class="leccion-titulo">${esc(module.title)}</h2>
    <div class="leccion-texto">${formatText(module.description || module.learningRisk || "")}</div>
    <section class="bloque-lectura">
      <h3>Lecciones del modulo</h3>
      <ol class="lista-tarjetas">
        ${(module.lessons || []).map(lesson => `<li><a href="#/lesson/${attr(module.id)}/${attr(lesson.id)}">${esc(lesson.title)}</a></li>`).join("")}
      </ol>
    </section>
    <div class="acciones-pagina">
      ${firstLesson ? `<a class="button-link" href="#/lesson/${attr(module.id)}/${attr(firstLesson.id)}">Abrir primera leccion</a>` : ""}
      ${(module.quiz || []).length ? `<a class="secondary-button" href="#/quiz/${attr(module.id)}">Evaluacion del modulo</a>` : ""}
    </div>`;
}

function renderLesson(moduleId, lessonId) {
  const module = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId) || module?.lessons?.[0];
  if (!module || !lesson) return renderHome();
  markLessonRead(lesson.id);
  const nav = lessonNavigation(module.id, lesson.id);
  return `
    <div class="leccion-meta">${esc(module.title)}</div>
    <h2 class="leccion-titulo">${esc(lesson.title)}</h2>
    <div class="leccion-texto">
      ${formatText(lesson.shortTheory || lesson.content || lesson.keyIdea || "")}
    </div>
    ${renderTheorySections(lesson)}
    ${lesson.keyPoints?.length ? `<section class="bloque-lectura"><h3>Puntos clave</h3>${list(lesson.keyPoints)}</section>` : ""}
    ${renderLessonBlock("Ejemplo practico", lesson.practicalExample)}
    ${renderLessonBlock("Contraejemplo", lesson.counterExample)}
    ${renderLessonBlock("Error frecuente", lesson.commonMistake)}
    ${renderLessonBlock("Actividad", lesson.whatToDoNow)}
    ${renderLessonBlock("Alerta responsable", lesson.alert)}
    ${renderReferences(lesson)}
    <div class="acciones-pagina">
      ${nav.prev ? `<a class="secondary-button" href="#/lesson/${attr(nav.prev.moduleId)}/${attr(nav.prev.id)}">Leccion anterior</a>` : ""}
      ${nav.next ? `<a class="button-link" href="#/lesson/${attr(nav.next.moduleId)}/${attr(nav.next.id)}">Siguiente leccion</a>` : `<a class="button-link" href="#/quiz/${attr(module.id)}">Ir a evaluacion</a>`}
    </div>
    ${renderNotes(lesson.id)}`;
}

function renderTheorySections(lesson) {
  const sections = lesson.theorySections || [];
  if (!sections.length) return "";
  return `
    <div class="theory-stack">
      ${sections.map(section => `
        <section class="theory-block">
          <h3>${esc(section.title || "Bloque teorico")}</h3>
          ${formatText(section.body || "")}
        </section>`).join("")}
    </div>`;
}

function renderLessonBlock(title, value) {
  if (!value) return "";
  return `<section class="bloque-lectura"><h3>${esc(title)}</h3>${formatText(value)}</section>`;
}

function renderReferences(lesson) {
  const refs = lesson.references || [];
  if (!refs.length) return "";
  return `
    <section class="bloque-lectura source-card">
      <h3>Fuentes usadas</h3>
      <ul class="source-list">
        ${refs.map(ref => `
          <li>
            <a href="${attr(ref.url || "#")}" target="_blank" rel="noopener">
              <strong>${esc(ref.title || ref.organization || "Fuente")}</strong>
              <span>${esc(ref.organization || ref.note || "")}</span>
            </a>
          </li>`).join("")}
      </ul>
    </section>`;
}

function lessonNavigation(moduleId, lessonId) {
  const lessons = getAllLessons();
  const index = lessons.findIndex(lesson => lesson.moduleId === moduleId && lesson.id === lessonId);
  return {
    prev: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null
  };
}

function markLessonRead(lessonId) {
  storage.update(state => {
    if (!state.lessons.includes(lessonId)) state.lessons.push(lessonId);
  });
}

function renderQuiz(moduleId) {
  const module = getModule(moduleId);
  if (!module) return renderHome();
  const questions = module.quiz || [];
  const saved = storage.read().quizzes?.[module.id];
  if (quizRuntime.moduleId !== module.id) quizRuntime = { moduleId: module.id, answers: saved?.answers || {} };
  const answered = Object.keys(quizRuntime.answers).length;
  return `
    <div class="leccion-meta">Evaluacion</div>
    <h2 class="leccion-titulo">${esc(module.title)}</h2>
    ${saved ? `<p class="resultado-quiz">Resultado guardado: ${saved.score}/${saved.total} (${percent(saved.score, saved.total)}%).</p>` : ""}
    <div class="quiz-stack">
      ${questions.map((question, qi) => renderQuestion(module.id, question, qi)).join("")}
    </div>
    <div class="acciones-pagina">
      <a class="secondary-button" href="#/module/${attr(module.id)}">Volver al modulo</a>
      <button class="button-link" type="button" data-save-quiz="${attr(module.id)}" ${answered < questions.length ? "disabled" : ""}>Guardar evaluacion</button>
    </div>`;
}

function renderQuestion(moduleId, question, qi) {
  const selected = quizRuntime.answers[question.id];
  return `
    <section class="bloque-lectura quiz-question">
      <h3>${qi + 1}. ${esc(question.question)}</h3>
      <div class="answer-grid">
        ${(question.options || []).map((option, oi) => {
          const isSelected = selected === oi;
          const isCorrect = oi === question.correctAnswerIndex;
          const className = selected === undefined ? "" : isSelected && isCorrect ? "is-correct" : isSelected ? "is-wrong" : "";
          return `<button class="${className}" type="button" data-answer-module="${attr(moduleId)}" data-answer-question="${attr(question.id)}" data-answer-index="${oi}">${esc(option)}</button>`;
        }).join("")}
      </div>
      ${selected !== undefined ? `<p class="feedback">${esc(question.feedback || "")}</p>` : ""}
    </section>`;
}

function answerQuestion(moduleId, questionId, index) {
  if (quizRuntime.moduleId !== moduleId) quizRuntime = { moduleId, answers: {} };
  quizRuntime.answers[questionId] = Number(index);
  render();
}

function saveQuiz(moduleId) {
  const module = getModule(moduleId);
  if (!module) return;
  const questions = module.quiz || [];
  const score = questions.filter(q => quizRuntime.answers[q.id] === q.correctAnswerIndex).length;
  storage.update(state => {
    state.quizzes[moduleId] = {
      score,
      total: questions.length,
      answers: quizRuntime.answers,
      savedAt: new Date().toISOString()
    };
  });
  render();
}

function renderChecklists() {
  return `
    <div class="leccion-meta">Herramientas</div>
    <h2 class="leccion-titulo">Checklists de aplicacion</h2>
    <div class="lista-tarjetas">
      ${checklists.map(checklist => `
        <article class="bloque-lectura">
          <h3>${esc(checklist.title)}</h3>
          <p>${esc(checklist.description || "")}</p>
          <a class="secondary-button" href="#/checklist/${attr(checklist.id)}">Abrir checklist</a>
        </article>`).join("")}
    </div>`;
}

function renderChecklist(id) {
  const checklist = getChecklist(id) || checklists[0];
  if (!checklist) return renderChecklists();
  const state = storage.read();
  return `
    <div class="leccion-meta">Checklist</div>
    <h2 class="leccion-titulo">${esc(checklist.title)}</h2>
    <div class="leccion-texto">${formatText(checklist.description || "")}</div>
    <div class="checklist-stack">
      ${(checklist.items || []).map(item => {
        const checked = state.checklistItems.includes(item.id);
        return `
          <label class="check-item ${checked ? "checked" : ""}">
            <input type="checkbox" data-check-item="${attr(item.id)}" ${checked ? "checked" : ""}>
            <span>
              <strong>${esc(item.title)}</strong>
              ${item.explanation ? `<small>${esc(item.explanation)}</small>` : ""}
              ${item.recommendedAction ? `<em>${esc(item.recommendedAction)}</em>` : ""}
            </span>
          </label>`;
      }).join("")}
    </div>`;
}

function toggleChecklistItem(itemId) {
  storage.update(state => {
    state.checklistItems = state.checklistItems || [];
    if (state.checklistItems.includes(itemId)) {
      state.checklistItems = state.checklistItems.filter(id => id !== itemId);
    } else {
      state.checklistItems.push(itemId);
    }
  });
  render();
}

function renderIncidents() {
  return `
    <div class="leccion-meta">Casos practicos</div>
    <h2 class="leccion-titulo">Casos, incidentes y decisiones guiadas</h2>
    <div class="lista-tarjetas">
      ${incidents.map(incident => `
        <article class="bloque-lectura">
          <h3>${esc(incident.title)}</h3>
          <p>${esc(incident.summary || "")}</p>
          <a class="secondary-button" href="#/incident/${attr(incident.id)}">Abrir caso</a>
        </article>`).join("")}
    </div>`;
}

function renderIncident(id) {
  const incident = getIncident(id) || incidents[0];
  if (!incident) return renderIncidents();
  storage.update(state => {
    if (!state.visitedIncidents.includes(incident.id)) state.visitedIncidents.push(incident.id);
  });
  return `
    <div class="leccion-meta">${esc(incident.severity || "Caso practico")}</div>
    <h2 class="leccion-titulo">${esc(incident.title)}</h2>
    <div class="leccion-texto">${formatText(incident.summary || incident.immediateGoal || "")}</div>
    ${incident.steps?.length ? `<section class="bloque-lectura"><h3>Pasos</h3>${list(incident.steps)}</section>` : ""}
    ${incident.evidenceToPreserve?.length ? `<section class="bloque-lectura"><h3>Evidencia a preservar</h3>${list(incident.evidenceToPreserve)}</section>` : ""}
    ${incident.errorsToAvoid?.length ? `<section class="bloque-lectura"><h3>Errores a evitar</h3>${list(incident.errorsToAvoid)}</section>` : ""}
    ${incident.aftercare?.length ? `<section class="bloque-lectura"><h3>Despues del caso</h3>${list(incident.aftercare)}</section>` : ""}
    ${incident.guidedDecision ? renderGuidedDecision(incident.guidedDecision) : ""}`;
}

function renderGuidedDecision(decision) {
  return `
    <section class="bloque-lectura">
      <h3>${esc(decision.question)}</h3>
      <ul>
        ${(decision.options || []).map(option => `<li><strong>${option.isCorrect ? "Correcta" : "Revisar"}:</strong> ${esc(option.text)} ${option.feedback ? `<br><small>${esc(option.feedback)}</small>` : ""}</li>`).join("")}
      </ul>
    </section>`;
}

function renderCertificate() {
  const progress = overallProgress();
  return `
    <div class="leccion-meta">Constancia interna</div>
    <h2 class="leccion-titulo">${esc(manifest.certificate?.title || "Constancia interna de avance")}</h2>
    <div class="leccion-texto">
      <p>Progreso actual: <strong>${progress}%</strong>.</p>
      <p>${esc(manifest.certificate?.notOfficialNotice || "Esta constancia es educativa y no equivale a una certificacion oficial.")}</p>
    </div>
    <div class="acciones-pagina">
      <button class="button-link" type="button" onclick="window.print()">Imprimir constancia</button>
    </div>`;
}

function renderProgressTools() {
  const state = storage.read();
  return `
    <div class="leccion-meta">Progreso</div>
    <h2 class="leccion-titulo">Progreso y exportacion</h2>
    <div class="leccion-texto">${formatText(JSON.stringify(state, null, 2))}</div>
    <div class="acciones-pagina">
      <button class="secondary-button" type="button" data-export-progress>Exportar progreso</button>
      <button class="secondary-button danger-action" type="button" data-reset-progress>Reiniciar progreso</button>
    </div>`;
}

function renderLegal() {
  return `
    <div class="leccion-meta">Alcance</div>
    <h2 class="leccion-titulo">Alcance y privacidad</h2>
    <div class="leccion-texto">
      ${formatText(manifest.responsibleNotice || course.responsibleNotice || "Contenido educativo. No reemplaza asesoramiento profesional.")}
      <p>El progreso y las notas se guardan localmente en este navegador.</p>
    </div>`;
}

function renderAccessibility() {
  return `
    <div class="leccion-meta">Accesibilidad</div>
    <h2 class="leccion-titulo">Ambiente de lectura</h2>
    <div class="leccion-texto"><p>Usa el selector superior para alternar entre tarde de candil, manana clara y estudio nocturno.</p></div>`;
}

function renderPublish() {
  return `
    <div class="leccion-meta">Publicacion</div>
    <h2 class="leccion-titulo">Publicacion del curso</h2>
    <div class="leccion-texto"><p>Este curso es parte de Cursoteca Abierta y se ejecuta sin backend ni login.</p></div>`;
}

function renderTemplate() {
  return `
    <div class="leccion-meta">Plantilla</div>
    <h2 class="leccion-titulo">Guia de clonacion</h2>
    <div class="leccion-texto">${list(manifest.cloneNotes || [])}</div>`;
}

function renderEmergency() {
  const firstIncident = incidents[0];
  return `
    <div class="leccion-meta">Respuesta rapida</div>
    <h2 class="leccion-titulo">Emergencia o bloqueo</h2>
    <div class="leccion-texto"><p>Si estas ante un problema real, prioriza seguridad, evidencia y fuentes oficiales. No compartas claves, codigos ni datos sensibles.</p></div>
    ${firstIncident ? `<a class="button-link" href="#/incident/${attr(firstIncident.id)}">Abrir primer caso guiado</a>` : ""}`;
}

function renderNotes(scope) {
  let value = "";
  try {
    value = localStorage.getItem(notesKey(scope)) || "";
  } catch {
    value = "";
  }
  return `
    <div class="bloque-anotador">
      <div class="anotador-cabecera">
        <h3 class="anotador-titulo">Notas al margen del lector</h3>
        <button class="btn-exportar" type="button" data-export-notes="${attr(scope)}">Exportar apuntes (.md)</button>
      </div>
      <textarea class="anotador-textarea" data-note-scope="${attr(scope)}" placeholder="Tus conclusiones se guardan localmente en este navegador...">${esc(value)}</textarea>
    </div>`;
}

function saveNote(scope, value) {
  try {
    localStorage.setItem(notesKey(scope), value);
  } catch {
    // Sin almacenamiento local, el anotador sigue siendo editable mientras la pagina esta abierta.
  }
}

function exportNotes(scope) {
  let value = "";
  try {
    value = localStorage.getItem(notesKey(scope)) || "";
  } catch {
    value = "";
  }
  if (!value.trim()) {
    alert("El anotador de esta pagina esta vacio.");
    return;
  }
  const blob = new Blob([`# Apuntes de estudio: ${course.title || manifest.appName}\n\n${value}\n\n---\nGenerado en Cursoteca Abierta.`], { type: "text/markdown;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `apuntes_${manifest.courseId || "curso"}.md`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(storage.read(), null, 2)], { type: "application/json;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `progreso_${manifest.courseId || "curso"}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

document.addEventListener("click", event => {
  const answer = event.target.closest("[data-answer-module]");
  if (answer) {
    answerQuestion(answer.dataset.answerModule, answer.dataset.answerQuestion, answer.dataset.answerIndex);
    return;
  }
  const saveQuizButton = event.target.closest("[data-save-quiz]");
  if (saveQuizButton) {
    saveQuiz(saveQuizButton.dataset.saveQuiz);
    return;
  }
  const checkItem = event.target.closest("[data-check-item]");
  if (checkItem) {
    toggleChecklistItem(checkItem.dataset.checkItem);
    return;
  }
  const exportNotesButton = event.target.closest("[data-export-notes]");
  if (exportNotesButton) {
    exportNotes(exportNotesButton.dataset.exportNotes);
    return;
  }
  if (event.target.closest("[data-export-progress]")) {
    exportProgress();
    return;
  }
  if (event.target.closest("[data-reset-progress]")) {
    if (confirm("Reiniciar el progreso local de este curso?")) {
      storage.reset();
      render();
    }
  }
});

document.addEventListener("input", event => {
  const note = event.target.closest("[data-note-scope]");
  if (!note) return;
  saveNote(note.dataset.noteScope, note.value);
});

if (themeSelect) {
  themeSelect.addEventListener("change", event => applyTheme(event.target.value));
}

bootstrap();

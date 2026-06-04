
const state = {
  manifest: null,
  course: null,
  checklists: null,
  incidents: null,
  jsLab: null,
  miniApps: null,
  guidedProject: null,
  progress: { completedLessons: [], checklistItems: [], quizScores: {}, completedCases: [], jsPractices: [], miniApps: [], guidedProjects: [] },
};

const $ = (selector) => document.querySelector(selector);

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`No se pudo cargar ${path}`);
  return res.json();
}

function saveProgress() {
  localStorage.setItem(state.manifest.progressKey, JSON.stringify(state.progress));
}

function loadProgress() {
  const raw = localStorage.getItem(state.manifest.progressKey);
  if (raw) {
    try { state.progress = { ...state.progress, ...JSON.parse(raw) }; } catch {}
  }
}

function pct(done, total) { return total ? Math.round((done / total) * 100) : 0; }
function allLessons() { return state.course.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id, moduleTitle: m.title }))); }
function renderLayout(content) { $("#app").innerHTML = content; }

function nav() {
  return `
    <nav class="top-nav">
      <a href="#/">Inicio</a>
      <a href="#/modules">Módulos</a>
      <a href="#/js-lab">Laboratorio JS</a>
      <a href="#/mini-app-builder">Mini apps</a>
      <a href="#/guided-project">Proyecto guiado</a>
      <a href="#/checklists">Checklists</a>
      <a href="#/certificate">Constancia</a>
    </nav>
  `;
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}

function downloadText(filename, text, type = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function buildPreviewDoc(html, css, js) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
}

function renderPreview(frameId, html, css, js) {
  const frame = document.getElementById(frameId);
  if (frame) frame.srcdoc = buildPreviewDoc(html, css, js);
}

function savePractice(kind, id, title) {
  state.progress.jsPractices.unshift({ kind, id, title, date: new Date().toISOString() });
  state.progress.jsPractices = state.progress.jsPractices.slice(0, 20);
  saveProgress();
}

function saveMiniApp(templateId, title) {
  state.progress.miniApps.unshift({ templateId, title, date: new Date().toISOString() });
  state.progress.miniApps = state.progress.miniApps.slice(0, 20);
  saveProgress();
}

function saveGuidedProject(title) {
  state.progress.guidedProjects.unshift({ title, date: new Date().toISOString() });
  state.progress.guidedProjects = state.progress.guidedProjects.slice(0, 20);
  saveProgress();
}

function renderHome() {
  const lessons = allLessons();
  const completed = state.progress.completedLessons.length;
  renderLayout(`
    ${nav()}
    <section class="hero">
      <p class="eyebrow">${state.manifest.route || "Ruta 5"} · ${state.manifest.category || "Desarrollo Web y Programación"}</p>
      <h1>${state.manifest.title}</h1>
      <p>${state.manifest.description}</p>
      <div class="hero-actions">
        <a class="button primary" href="#/modules">Empezar curso</a>
        <a class="button" href="#/js-lab">Laboratorio JS</a>
        <a class="button" href="#/mini-app-builder">Mini apps</a>
        <a class="button" href="#/guided-project">Proyecto guiado</a>
      </div>
    </section>
    <section class="grid stats">
      <article><strong>${state.course.modules.length}</strong><span>Módulos</span></article>
      <article><strong>${lessons.length}</strong><span>Lecciones</span></article>
      <article><strong>${pct(completed, lessons.length)}%</strong><span>Avance</span></article>
      <article><strong>${state.guidedProject?.steps?.length || 0}</strong><span>Pasos proyecto</span></article>
    </section>
  `);
}

function renderModules() {
  renderLayout(`${nav()}<main><h1>Módulos</h1><div class="grid cards">${state.course.modules.map(m => `<article class="card"><h2>${m.title}</h2><p>${m.description}</p><p>${m.lessons.length} lecciones · ${m.quiz.length} preguntas</p><a class="button" href="#/module/${m.id}">Ver módulo</a></article>`).join("")}</div></main>`);
}

function renderModule(id) {
  const m = state.course.modules.find(x => x.id === id);
  if (!m) return renderNotFound();
  renderLayout(`${nav()}<main><a href="#/modules">← Volver</a><h1>${m.title}</h1><p>${m.description}</p><section class="list">${m.lessons.map(l => `<a class="list-item" href="#/lesson/${m.id}/${l.id}"><span>${state.progress.completedLessons.includes(l.id) ? "✅" : "○"}</span><strong>${l.title}</strong></a>`).join("")}</section><a class="button primary" href="#/quiz/${m.id}">Realizar quiz</a></main>`);
}

function renderLesson(moduleId, lessonId) {
  const m = state.course.modules.find(x => x.id === moduleId);
  const l = m?.lessons.find(x => x.id === lessonId);
  if (!m || !l) return renderNotFound();
  renderLayout(`${nav()}<main class="lesson"><a href="#/module/${moduleId}">← Volver al módulo</a><h1>${l.title}</h1><div class="panel"><h2>Idea clave</h2><p>${l.keyIdea || ""}</p><h2>Teoría breve</h2><p>${l.shortTheory || l.content || ""}</p><h2>Ejemplo práctico</h2><p>${l.practicalExample || ""}</p><h2>Error común</h2><p>${l.commonMistake || ""}</p><h2>Qué hacer ahora</h2><p>${l.whatToDoNow || l.recommendedAction || ""}</p><h2>Conceptos clave</h2><ul>${(l.keyPoints || []).map(p => `<li>${p}</li>`).join("")}</ul><p class="note">${l.responsibleNote || ""}</p></div><button class="button primary" onclick="markLesson('${lessonId}')">Marcar como completada</button></main>`);
}

window.markLesson = function(id) {
  if (!state.progress.completedLessons.includes(id)) state.progress.completedLessons.push(id);
  saveProgress(); history.back();
};

function renderQuiz(moduleId) {
  const m = state.course.modules.find(x => x.id === moduleId);
  if (!m) return renderNotFound();
  renderLayout(`${nav()}<main><h1>Quiz: ${m.title}</h1><form id="quizForm" class="panel">${m.quiz.map((q, qi) => `<fieldset><legend>${qi + 1}. ${q.question}</legend>${q.options.map((op, oi) => `<label><input type="radio" name="${q.id}" value="${oi}"> ${op}</label>`).join("")}</fieldset>`).join("")}<button class="button primary" type="submit">Guardar resultado</button></form><div id="quizResult"></div></main>`);
  $("#quizForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    let score = 0;
    m.quiz.forEach(q => {
      const selected = document.querySelector(`input[name="${q.id}"]:checked`);
      if (selected && Number(selected.value) === q.correctAnswerIndex) score++;
    });
    state.progress.quizScores[moduleId] = { score, total: m.quiz.length, date: new Date().toISOString() };
    saveProgress();
    $("#quizResult").innerHTML = `<div class="success">Resultado: ${score}/${m.quiz.length}</div>`;
  });
}

function renderJsLab() {
  renderLayout(`${nav()}<main><h1>Laboratorio JavaScript interactivo</h1><div class="grid cards"><article class="card"><h2>Ejemplos editables</h2><p>Probá código HTML, CSS y JS con vista previa segura.</p><a class="button" href="#/js-examples">Abrir ejemplos</a></article><article class="card"><h2>Ejercicios guiados</h2><p>Resolvé desafíos cortos con pista y solución sugerida.</p><a class="button" href="#/js-exercises">Abrir ejercicios</a></article><article class="card"><h2>Correcto vs incorrecto</h2><p>Compará errores típicos con versiones mejoradas.</p><a class="button" href="#/js-compare">Comparar</a></article><article class="card"><h2>Snippets</h2><p>Copiá fragmentos útiles para practicar.</p><a class="button" href="#/js-snippets">Ver snippets</a></article></div></main>`);
}

function renderJsExamples() {
  renderLayout(`${nav()}<main><h1>Ejemplos editables</h1><div class="grid cards">${state.jsLab.examples.map(e => `<article class="card"><h2>${e.title}</h2><p>${e.description}</p><p class="note">${e.learningGoal}</p><a class="button" href="#/js-example/${e.id}">Editar ejemplo</a></article>`).join("")}</div></main>`);
}

function renderJsExample(id) {
  const e = state.jsLab.examples.find(x => x.id === id);
  if (!e) return renderNotFound();
  renderLayout(`${nav()}<main><a href="#/js-examples">← Volver</a><h1>${e.title}</h1><p>${e.description}</p><div class="lab-grid"><section class="panel"><label>HTML<textarea id="htmlCode" spellcheck="false">${escapeHtml(e.html)}</textarea></label><label>CSS<textarea id="cssCode" spellcheck="false">${escapeHtml(e.css)}</textarea></label><label>JavaScript<textarea id="jsCode" spellcheck="false">${escapeHtml(e.js)}</textarea></label><div class="hero-actions"><button class="button primary" id="runBtn">Actualizar vista previa</button><button class="button" id="copyBtn">Copiar práctica</button><button class="button" id="downloadBtn">Descargar .txt</button></div></section><section class="panel"><h2>Vista previa segura</h2><iframe id="previewFrame" sandbox="allow-scripts"></iframe></section></div></main>`);
  const update = () => renderPreview("previewFrame", $("#htmlCode").value, $("#cssCode").value, $("#jsCode").value);
  $("#runBtn").addEventListener("click", update);
  $("#copyBtn").addEventListener("click", async () => {
    const text = `HTML\n${$("#htmlCode").value}\n\nCSS\n${$("#cssCode").value}\n\nJS\n${$("#jsCode").value}`;
    await navigator.clipboard.writeText(text);
    savePractice("example", e.id, e.title);
  });
  $("#downloadBtn").addEventListener("click", () => {
    const text = `Práctica: ${e.title}\n\nHTML\n${$("#htmlCode").value}\n\nCSS\n${$("#cssCode").value}\n\nJS\n${$("#jsCode").value}`;
    downloadText(`${e.id}.txt`, text);
    savePractice("example", e.id, e.title);
  });
  update();
}

function renderJsExercises() {
  renderLayout(`${nav()}<main><h1>Ejercicios guiados</h1><div class="grid cards">${state.jsLab.exercises.map(e => `<article class="card"><span class="pill">${e.difficulty}</span><h2>${e.title}</h2><p>${e.prompt}</p><a class="button" href="#/js-exercise/${e.id}">Resolver</a></article>`).join("")}</div></main>`);
}

function renderJsExercise(id) {
  const e = state.jsLab.exercises.find(x => x.id === id);
  if (!e) return renderNotFound();
  const css = "body{font-family:Arial;padding:20px}button,input{padding:8px;margin:4px}.active{background:#f7df1e;padding:12px}";
  renderLayout(`${nav()}<main><a href="#/js-exercises">← Volver</a><h1>${e.title}</h1><p>${e.prompt}</p><p class="note">Pista: ${e.hint}</p><div class="lab-grid"><section class="panel"><label>HTML<textarea id="htmlCode" spellcheck="false">${escapeHtml(e.starterHtml)}</textarea></label><label>JavaScript<textarea id="jsCode" spellcheck="false">${escapeHtml(e.starterJs)}</textarea></label><details><summary>Ver solución sugerida</summary><pre>${escapeHtml(e.suggestedSolution)}</pre></details><div class="hero-actions"><button class="button primary" id="runBtn">Probar</button><button class="button" id="downloadBtn">Descargar práctica</button></div></section><section class="panel"><h2>Vista previa</h2><iframe id="previewFrame" sandbox="allow-scripts"></iframe></section></div></main>`);
  const update = () => renderPreview("previewFrame", $("#htmlCode").value, css, $("#jsCode").value);
  $("#runBtn").addEventListener("click", update);
  $("#downloadBtn").addEventListener("click", () => {
    downloadText(`${e.id}.txt`, `Ejercicio: ${e.title}\n\nHTML\n${$("#htmlCode").value}\n\nJS\n${$("#jsCode").value}\n\nSolución sugerida\n${e.suggestedSolution}`);
    savePractice("exercise", e.id, e.title);
  });
  update();
}

function renderJsCompare() {
  renderLayout(`${nav()}<main><h1>JavaScript correcto vs incorrecto</h1><div class="grid cards">${state.jsLab.comparisons.map(c => `<article class="card wide"><h2>${c.title}</h2><div class="compare-grid"><div><h3>Incorrecto</h3><pre>${escapeHtml(c.wrong)}</pre></div><div><h3>Mejorado</h3><pre>${escapeHtml(c.right)}</pre></div></div><p>${c.explanation}</p></article>`).join("")}</div></main>`);
}

function renderJsSnippets() {
  renderLayout(`${nav()}<main><h1>Fragmentos copiables</h1><div class="grid cards">${state.jsLab.snippets.map(s => `<article class="card"><h2>${s.title}</h2><pre>${escapeHtml(s.code)}</pre><button class="button" onclick="copySnippet('${s.id}')">Copiar</button></article>`).join("")}</div></main>`);
}

window.copySnippet = async function(id) {
  const s = state.jsLab.snippets.find(x => x.id === id);
  if (!s) return;
  await navigator.clipboard.writeText(s.code);
  savePractice("snippet", s.id, s.title);
};

function renderMiniAppBuilder() {
  renderLayout(`${nav()}<main><h1>Constructor de mini apps simples</h1><p>Elegí una plantilla, configurá textos básicos y generá un archivo HTML completo.</p><div class="grid cards">${state.miniApps.templates.map(t => `<article class="card"><h2>${t.title}</h2><p>${t.description}</p><p class="note">${t.learningGoal}</p><a class="button" href="#/mini-app-builder/${t.id}">Construir</a></article>`).join("")}</div></main>`);
}

function generateMiniApp(templateId, values) {
  const safe = (value) => escapeHtml(value || "");
  if (templateId === "miniapp-counter") {
    const start = Number(values.startValue || 0);
    return {
      html: `<main class="app-card"><h1>${safe(values.title)}</h1><p class="counter" id="count">${start}</p><div class="actions"><button id="decrement">${safe(values.decrementText)}</button><button id="increment">${safe(values.incrementText)}</button><button id="reset">${safe(values.resetText)}</button></div></main>`,
      css: `body{font-family:Arial;min-height:100vh;display:grid;place-items:center;background:#f4f6fb}.app-card{background:white;padding:28px;border-radius:18px;box-shadow:0 10px 30px #0002;text-align:center}.counter{font-size:56px;font-weight:800}button{padding:10px 14px;border:0;border-radius:10px;cursor:pointer;margin:4px}`,
      js: `let count=${start};const startValue=${start};const countEl=document.querySelector('#count');document.querySelector('#increment').addEventListener('click',()=>{count++;countEl.textContent=count});document.querySelector('#decrement').addEventListener('click',()=>{count--;countEl.textContent=count});document.querySelector('#reset').addEventListener('click',()=>{count=startValue;countEl.textContent=count});`
    };
  }
  if (templateId === "miniapp-todo") {
    return generateGuidedTodo(values);
  }
  return {
    html: `<main class="app-card"><h1>${safe(values.title)}</h1><label>${safe(values.labelA)} <input id="a" type="number" value="0"></label><label>${safe(values.labelB)} <input id="b" type="number" value="0"></label><button id="calculate">${safe(values.buttonText)}</button><p id="result">${safe(values.resultLabel)}: 0</p></main>`,
    css: `body{font-family:Arial;min-height:100vh;display:grid;place-items:center;background:#f4f6fb}.app-card{width:min(420px,92vw);background:white;padding:28px;border-radius:18px;box-shadow:0 10px 30px #0002}label{display:block;margin:12px 0}input{width:100%;padding:10px;margin-top:4px}button{padding:10px 14px;border:0;border-radius:10px;cursor:pointer}`,
    js: `const a=document.querySelector('#a');const b=document.querySelector('#b');const result=document.querySelector('#result');document.querySelector('#calculate').addEventListener('click',()=>{const total=Number(a.value)+Number(b.value);result.textContent='${(values.resultLabel || "Resultado").replace(/'/g, "\\'")}: '+total});`
  };
}

function renderMiniAppTemplate(id) {
  const t = state.miniApps.templates.find(x => x.id === id);
  if (!t) return renderNotFound();
  renderBuilderForm(t, "mini-app-builder");
}

function generateGuidedTodo(values) {
  const safe = (value) => escapeHtml(value || "");
  const title = values.appTitle || values.title || "Mi lista de tareas";
  const placeholder = values.placeholder || "Escribir una tarea";
  const buttonText = values.buttonText || "Agregar";
  const emptyMessage = (values.emptyMessage || "Escribí una tarea antes de agregar.").replace(/'/g, "\\'");
  const counterLabel = values.counterLabel || "Tareas pendientes";
  const html = `<main class="todo-app">
  <h1>${safe(title)}</h1>
  <div class="row">
    <input id="taskInput" placeholder="${safe(placeholder)}">
    <button id="addTask">${safe(buttonText)}</button>
  </div>
  <p id="message" class="message"></p>
  <p><strong>${safe(counterLabel)}:</strong> <span id="pendingCount">0</span></p>
  <ul id="taskList"></ul>
</main>`;
  const css = `body { font-family: Arial, sans-serif; min-height: 100vh; margin: 0; display: grid; place-items: center; background: #f4f6fb; }
.todo-app { width: min(620px, 92vw); background: white; padding: 28px; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.12); }
.row { display: flex; gap: 8px; }
input { flex: 1; padding: 12px; border: 1px solid #ccd; border-radius: 10px; }
button { padding: 12px 14px; border: 0; border-radius: 10px; cursor: pointer; background: #222; color: white; }
li { margin: 8px 0; padding: 10px; border: 1px solid #dde; border-radius: 10px; cursor: pointer; }
li.completed { text-decoration: line-through; opacity: .65; background: #eef5ee; }
.message { color: crimson; min-height: 1.4em; }
@media (max-width: 560px) { .row { flex-direction: column; } }`;
  const js = `const input = document.querySelector('#taskInput');
const button = document.querySelector('#addTask');
const list = document.querySelector('#taskList');
const message = document.querySelector('#message');
const pendingCount = document.querySelector('#pendingCount');

function updateCounter() {
  const pending = list.querySelectorAll('li:not(.completed)').length;
  pendingCount.textContent = pending;
}

function addTask() {
  const text = input.value.trim();
  if (!text) {
    message.textContent = '${emptyMessage}';
    return;
  }

  message.textContent = '';
  const item = document.createElement('li');
  item.textContent = text;
  item.addEventListener('click', () => {
    item.classList.toggle('completed');
    updateCounter();
  });

  list.appendChild(item);
  input.value = '';
  updateCounter();
}

button.addEventListener('click', addTask);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

updateCounter();`;
  return { html, css, js };
}

function renderBuilderForm(t, baseRoute) {
  renderLayout(`${nav()}<main><a href="#/${baseRoute}">← Volver</a><h1>${t.title}</h1><p>${t.description || state.guidedProject.description}</p><div class="lab-grid"><section class="panel"><form id="builderForm">${t.fields.map(f => `<label>${f.label}<input class="builder-input" name="${f.id}" value="${escapeHtml(f.default)}"></label>`).join("")}<div class="hero-actions"><button class="button primary" type="submit">Generar</button><button class="button" type="button" id="downloadHtml">Descargar .html</button><button class="button" type="button" id="downloadReview">Descargar revisión .txt</button></div></form></section><section class="panel"><h2>Vista previa</h2><iframe id="previewFrame" sandbox="allow-scripts"></iframe></section></div><section class="panel"><h2>HTML/CSS/JS generado</h2><textarea id="generatedCode" spellcheck="false"></textarea></section></main>`);
  let current = null;
  const collect = () => {
    const data = {};
    new FormData($("#builderForm")).forEach((value, key) => data[key] = value);
    return data;
  };
  const update = () => {
    const values = collect();
    current = baseRoute === "guided-project" ? generateGuidedTodo(values) : generateMiniApp(t.id, values);
    const full = buildPreviewDoc(current.html, current.css, current.js);
    $("#generatedCode").value = full;
    renderPreview("previewFrame", current.html, current.css, current.js);
    if (baseRoute === "guided-project") saveGuidedProject(t.title); else saveMiniApp(t.id, t.title);
  };
  $("#builderForm").addEventListener("submit", (ev) => { ev.preventDefault(); update(); });
  $("#downloadHtml").addEventListener("click", () => {
    if (!current) update();
    downloadText(`${baseRoute === "guided-project" ? "lista-tareas-guiada" : t.id}.html`, buildPreviewDoc(current.html, current.css, current.js), "text/html;charset=utf-8");
  });
  $("#downloadReview").addEventListener("click", () => {
    const checklist = baseRoute === "guided-project" ? state.guidedProject.testChecklist : state.miniApps.reviewChecklist;
    const review = `${t.title}\n\nChecklist\n${checklist.map(i => "- " + i.text).join("\n")}`;
    downloadText(`${baseRoute}-revision.txt`, review);
  });
  update();
}

function renderGuidedProject() {
  renderLayout(`${nav()}<main><h1>${state.guidedProject.title}</h1><p>${state.guidedProject.description}</p><div class="hero-actions"><a class="button primary" href="#/guided-builder">Abrir constructor guiado</a><a class="button" href="#/guided-errors">Ver errores comunes</a></div><section class="grid cards">${state.guidedProject.steps.map((s, idx) => `<article class="card"><span class="pill">Paso ${idx + 1}</span><h2>${s.title}</h2><p>${s.goal}</p><ul>${s.instructions.map(i => `<li>${i}</li>`).join("")}</ul><p class="success">${s.checkpoint}</p></article>`).join("")}</section><section class="panel"><h2>Checklist de pruebas</h2>${state.guidedProject.testChecklist.map(i => `<label class="check-row"><input type="checkbox"> ${i.text}</label>`).join("")}</section></main>`);
}

function renderGuidedBuilder() {
  renderBuilderForm({
    id: "guided-todo",
    title: state.guidedProject.title,
    description: state.guidedProject.description,
    fields: state.guidedProject.fields
  }, "guided-project");
}

function renderGuidedErrors() {
  renderLayout(`${nav()}<main><h1>Errores comunes del proyecto guiado</h1><div class="grid cards">${state.guidedProject.commonErrors.map(e => `<article class="card"><h2>${e.title}</h2><p><strong>Síntoma:</strong> ${e.symptom}</p><p><strong>Corrección:</strong> ${e.fix}</p></article>`).join("")}</div></main>`);
}

function renderChecklists() {
  renderLayout(`${nav()}<main><h1>Checklists prácticos</h1><div class="grid cards">${state.checklists.checklists.map(c => `<article class="card"><h2>${c.title}</h2><p>${c.description}</p><a class="button" href="#/checklist/${c.id}">Abrir checklist</a></article>`).join("")}</div></main>`);
}

function renderChecklist(id) {
  const c = state.checklists.checklists.find(x => x.id === id);
  if (!c) return renderNotFound();
  renderLayout(`${nav()}<main><a href="#/checklists">← Volver</a><h1>${c.title}</h1><p>${c.description}</p><div class="panel">${c.items.map(item => `<label class="check-row"><input type="checkbox" ${state.progress.checklistItems.includes(item.id) ? "checked" : ""} onchange="toggleChecklist('${item.id}')"> ${item.text}</label>`).join("")}</div></main>`);
}

window.toggleChecklist = function(id) {
  const list = state.progress.checklistItems;
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1); else list.push(id);
  saveProgress();
};

function renderCases() {
  renderLayout(`${nav()}<main><h1>Casos prácticos</h1><div class="grid cards">${state.incidents.incidents.map(i => `<article class="card"><span class="pill">${i.severity}</span><h2>${i.title}</h2><p>${i.objective}</p><a class="button" href="#/case/${i.id}">Resolver caso</a></article>`).join("")}</div></main>`);
}

function renderCase(id) {
  const i = state.incidents.incidents.find(x => x.id === id);
  if (!i) return renderNotFound();
  renderLayout(`${nav()}<main><a href="#/cases">← Volver</a><h1>${i.title}</h1><p><strong>Objetivo:</strong> ${i.objective}</p><section class="panel"><h2>Pasos</h2><ol>${i.steps.map(s => `<li>${s}</li>`).join("")}</ol><h2>Evidencia de práctica</h2><ul>${i.evidence.map(s => `<li>${s}</li>`).join("")}</ul><h2>Errores a evitar</h2><ul>${i.avoid.map(s => `<li>${s}</li>`).join("")}</ul><h2>Prevención</h2><p>${i.prevention}</p><h2>Decisión guiada</h2><p>${i.guidedDecision.question}</p><p class="success">${i.guidedDecision.feedback}</p></section></main>`);
}

function renderCertificate() {
  const lessons = allLessons();
  const completed = state.progress.completedLessons.length;
  renderLayout(`${nav()}<main><h1>Constancia interna</h1><div class="certificate"><h2>${state.manifest.title}</h2><p>Avance de lecciones: ${completed}/${lessons.length} (${pct(completed, lessons.length)}%)</p><p>Quizzes realizados: ${Object.keys(state.progress.quizScores).length}</p><p>Prácticas JS registradas: ${(state.progress.jsPractices || []).length}</p><p>Mini apps generadas: ${(state.progress.miniApps || []).length}</p><p>Proyectos guiados: ${(state.progress.guidedProjects || []).length}</p><p class="note">Esta constancia es orientativa y no es una certificación oficial.</p><button class="button" onclick="window.print()">Imprimir o guardar PDF</button></div></main>`);
}

function renderNotFound() { renderLayout(`${nav()}<main><h1>No encontrado</h1><p>La sección solicitada no existe.</p></main>`); }

function router() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts.length === 0) return renderHome();
  const [route, a, b] = parts;
  if (route === "modules") return renderModules();
  if (route === "module") return renderModule(a);
  if (route === "lesson") return renderLesson(a, b);
  if (route === "quiz") return renderQuiz(a);
  if (route === "js-lab") return renderJsLab();
  if (route === "js-examples") return renderJsExamples();
  if (route === "js-example") return renderJsExample(a);
  if (route === "js-exercises") return renderJsExercises();
  if (route === "js-exercise") return renderJsExercise(a);
  if (route === "js-compare") return renderJsCompare();
  if (route === "js-snippets") return renderJsSnippets();
  if (route === "mini-app-builder") return a ? renderMiniAppTemplate(a) : renderMiniAppBuilder();
  if (route === "guided-project") return renderGuidedProject();
  if (route === "guided-builder") return renderGuidedBuilder();
  if (route === "guided-errors") return renderGuidedErrors();
  if (route === "checklists") return renderChecklists();
  if (route === "checklist") return renderChecklist(a);
  if (route === "cases") return renderCases();
  if (route === "case") return renderCase(a);
  if (route === "certificate") return renderCertificate();
  return renderNotFound();
}

async function init() {
  state.manifest = await loadJson("src/data/course_manifest.json");
  state.course = await loadJson(state.manifest.dataPaths.course);
  state.checklists = await loadJson(state.manifest.dataPaths.checklists);
  state.incidents = await loadJson(state.manifest.dataPaths.incidents);
  state.jsLab = await loadJson(state.manifest.dataPaths.jsLab);
  state.miniApps = await loadJson(state.manifest.dataPaths.miniApps);
  state.guidedProject = await loadJson(state.manifest.dataPaths.guidedProject);
  loadProgress();
  window.addEventListener("hashchange", router);
  router();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js").catch(console.warn);
}

init().catch(err => {
  document.body.innerHTML = `<main class="error"><h1>Error de carga</h1><pre>${err.message}</pre></main>`;
});

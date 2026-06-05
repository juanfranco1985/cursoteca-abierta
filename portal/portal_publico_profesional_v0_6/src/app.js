const storageKeys = {
  opened: "cursoteca_portal_volumenes_abiertos_v1",
  theme: "cursoteca_portal_ambiente_v1"
};

const state = {
  courses: [],
  category: "all",
  query: "",
  activeGroup: null,
  openedCourses: new Set()
};

const elements = {
  body: document.body,
  grid: document.querySelector("#courses-grid"),
  featuredGrid: document.querySelector("#featured-grid"),
  categoryHub: document.querySelector("#category-hub"),
  categoryView: document.querySelector("#category-view"),
  categoryCoursesGrid: document.querySelector("#category-courses-grid"),
  categoryViewTitle: document.querySelector("#category-view-title"),
  categoryViewDescription: document.querySelector("#category-view-description"),
  categoryViewCount: document.querySelector("#category-view-count"),
  backToCategories: document.querySelector("#back-to-categories"),
  categoryFilter: document.querySelector("#category-filter"),
  searchInput: document.querySelector("#search-input"),
  resetButton: document.querySelector("#reset-filters"),
  resultCount: document.querySelector("#result-count"),
  courseCount: document.querySelector("#course-count"),
  shelfIndex: document.querySelector("#shelf-index"),
  progressBar: document.querySelector("#barra-progreso-global"),
  progressText: document.querySelector("#texto-progreso-global"),
  themeSelect: document.querySelector("#selector-ambiente")
};

const categoryGroups = [
  {
    id: "ciudadania-seguridad",
    label: "Pasillo I",
    title: "Ciudadania Digital y Seguridad",
    description: "Uso seguro de dispositivos, privacidad, emergencias, identidad digital y proteccion cotidiana.",
    categories: ["Ciudadania digital", "Emergencia digital", "Privacidad", "Finanzas digitales", "Plantilla"]
  },
  {
    id: "ia-trabajo-productividad",
    label: "Pasillo II",
    title: "IA, Trabajo y Productividad",
    description: "Herramientas para trabajar mejor, automatizar tareas, organizar informacion y mejorar rutinas.",
    categories: ["Trabajo e IA", "Productividad", "Trabajo", "Soporte tecnico"]
  },
  {
    id: "datos-bi-gobierno",
    label: "Pasillo III",
    title: "Datos, BI y Gobierno de Datos",
    description: "Analisis, visualizacion, planillas, SQL, calidad, gobierno y storytelling con datos.",
    categories: ["BI", "Datos", "Gobierno de datos"]
  },
  {
    id: "desarrollo-ux-programacion",
    label: "Pasillo IV",
    title: "Desarrollo Web, UX/UI y Programacion",
    description: "HTML, CSS, JavaScript, React, APIs, Git, accesibilidad, publicacion y diseno de interfaces.",
    categories: ["Desarrollo web"]
  },
  {
    id: "emprendimiento-finanzas",
    label: "Pasillo V",
    title: "Emprendimiento, Marketing y Finanzas",
    description: "Ventas, precios, rentabilidad, tienda online, marketing barrial y herramientas comerciales.",
    categories: ["Emprendimiento", "Finanzas"]
  },
  {
    id: "educacion-familia",
    label: "Pasillo VI",
    title: "Educacion, Familia y Acompanamiento",
    description: "Cursos para escuelas, docentes, familias y acompanamiento digital responsable.",
    categories: ["Escuela", "Familia"]
  },
  {
    id: "administracion-tramites-atencion",
    label: "Pasillo VII",
    title: "Administracion, Tramites y Atencion",
    description: "Organizacion administrativa, tramites digitales y atencion profesional por canales online.",
    categories: ["Administracion", "Tramites digitales", "Atencion al cliente"]
  },
  {
    id: "contenido-plus",
    label: "Pasillo VIII",
    title: "Contenido Plus",
    description: "Cursos de cultura tecnologica y divulgacion para ampliar la mirada del catalogo.",
    categories: ["Contenido Plus"]
  }
];

const featuredCourseIds = new Set([
  "alfabetizacion_digital_adultos_web_v0_6_publica",
  "astronomia_general_curiosos_v0_6_publica",
  "computacion_cuantica_curiosos_v0_6_publica",
  "escudo_comercial_web_v0_6_publica",
  "android_seguro_principiantes_v0_6_publica",
  "ux_ui_basico_sitios_apps_v0_6_publica",
  "power_bi_principiantes_web_v0_6_publica",
  "ia_practica_web_v0_6_publica"
]);

async function init() {
  restoreTheme();
  state.openedCourses = getOpenedCourses();

  try {
    const response = await fetch("data/courses.json");
    state.courses = await response.json();
    elements.courseCount.textContent = state.courses.length;
    setupCategories();
    renderAll();
    restoreHashPosition();
  } catch (error) {
    const message = `<article class="libro-tarjeta empty-state"><h3>No se pudo cargar el inventario</h3><p class="libro-sinopsis">Abri el portal con Live Server o un servidor local para permitir la carga de JSON.</p></article>`;
    elements.grid.innerHTML = message;
    elements.featuredGrid.innerHTML = message;
    elements.categoryHub.innerHTML = message;
    console.error(error);
  }
}

function renderAll() {
  renderShelfIndex();
  renderCategoryHub();
  renderFeaturedCourses();
  renderCourses();
  updateProgress();
}

function setupCategories() {
  const categories = [...new Set(state.courses.map(course => course.category))].sort();
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    elements.categoryFilter.appendChild(option);
  }
}

function renderShelfIndex() {
  elements.shelfIndex.innerHTML = categoryGroups.map(group => {
    const count = getGroupCourses(group).length;
    return `
      <li>
        <button type="button" data-shelf-id="${escapeAttribute(group.id)}">
          <span>${escapeHtml(group.label)}: ${escapeHtml(group.title)}</span>
          <strong>${count}</strong>
        </button>
      </li>`;
  }).join("");
}

function renderCategoryHub() {
  elements.categoryHub.innerHTML = categoryGroups.map((group, index) => {
    const courses = getGroupCourses(group);
    const openedCount = courses.filter(course => state.openedCourses.has(course.id)).length;
    const previewBooks = courses.slice(0, 6).map((course, previewIndex) => `
      <span class="preview-book" style="--book-order: ${previewIndex}; --book-accent: ${getAccentForCourse(course)};" aria-hidden="true"></span>
    `).join("");
    const categoryLabels = group.categories.map(category => `<span>${escapeHtml(category)}</span>`).join("");
    return `
      <article class="category-card">
        <div class="category-preview" aria-hidden="true">${previewBooks}</div>
        <div class="category-card-body">
          <p class="eyebrow">${escapeHtml(group.label)}</p>
          <h3>${escapeHtml(group.title)}</h3>
          <p class="description">${escapeHtml(group.description)}</p>
          <div class="category-tags">${categoryLabels}</div>
        </div>
        <div class="category-card-footer">
          <div><strong>${courses.length}</strong><span>volumenes</span></div>
          <div><strong>${openedCount}</strong><span>abiertos</span></div>
          <button class="secondary-button category-open" type="button" data-group-id="${escapeAttribute(group.id)}">Ver estante ${index + 1}</button>
        </div>
      </article>`;
  }).join("");
}

function openCategory(groupId) {
  const group = categoryGroups.find(item => item.id === groupId);
  if (!group) return;
  const courses = getGroupCourses(group);
  state.activeGroup = group.id;
  elements.categoryViewTitle.textContent = group.title;
  elements.categoryViewDescription.textContent = group.description;
  elements.categoryViewCount.textContent = `${courses.length} cursos en este estante`;
  elements.categoryCoursesGrid.innerHTML = courses.map((course, index) => renderCourseCard(course, { index })).join("");
  elements.categoryView.hidden = false;
  elements.categoryView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeCategoryView() {
  state.activeGroup = null;
  elements.categoryView.hidden = true;
  document.querySelector("#categorias").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderFeaturedCourses() {
  const featured = state.courses
    .filter(course => featuredCourseIds.has(course.id))
    .sort((a, b) => getPriority(b) - getPriority(a));
  elements.featuredGrid.innerHTML = featured.map((course, index) => renderCourseCard(course, { index, featured: true })).join("");
}

function renderCourses() {
  const filtered = getFilteredCourses();
  elements.resultCount.textContent = `${filtered.length} de ${state.courses.length} cursos`;
  if (!filtered.length) {
    elements.grid.innerHTML = `<article class="libro-tarjeta empty-state"><h3>Sin resultados</h3><p class="libro-sinopsis">Proba limpiar filtros o buscar por una palabra mas general.</p></article>`;
    return;
  }
  elements.grid.innerHTML = filtered.map((course, index) => renderCourseCard(course, { index })).join("");
}

function renderCourseCard(course, options = {}) {
  const opened = state.openedCourses.has(course.id);
  const complete = isCompleteCourse(course);
  const featured = options.featured;
  const coverPath = `assets/course-covers/${course.id}.svg`;
  const volume = String((options.index || 0) + 1).padStart(2, "0");
  const description = getPublicDescription(course);
  const features = getPublicFeatures(course);
  const lessonMeta = getLessonMeta(course);
  const status = complete ? "Curso completo v1" : getPublicStatus(course);
  const openAction = course.publicReady && course.path
    ? `<a class="button-link" href="${escapeAttribute(course.path)}" data-course-open="${escapeAttribute(course.id)}">Abrir volumen</a>`
    : `<span class="secondary-link">En revision</span>`;

  return `
    <article class="libro-tarjeta ${opened ? "tocado" : ""} ${complete ? "curso-completo" : ""} ${featured ? "is-featured" : ""}" data-course-id="${escapeAttribute(course.id)}" style="--book-accent: ${getAccentForCourse(course)};">
      <div class="${opened ? "marcapaginas" : "ribbon-slot"}" aria-hidden="true"></div>
      <div class="libro-cuerpo">
        <figure class="libro-cover-frame">
          <img class="libro-cover" src="${escapeAttribute(coverPath)}" alt="Portada de ${escapeAttribute(course.title)}" loading="${featured ? "eager" : "lazy"}" decoding="async">
        </figure>
        <div class="libro-meta">Vol. ${volume} · ${escapeHtml(course.category)}</div>
        <h3 class="libro-titulo">${escapeHtml(course.title)}</h3>
        <p class="libro-sinopsis">${escapeHtml(description)}</p>
        <div class="badges">
          ${featured ? `<span class="badge featured">Mesa de lectura</span>` : ""}
          <span class="badge ${complete ? "accent" : ""}">${escapeHtml(status)}</span>
          <span class="badge">${escapeHtml(course.audience)}</span>
        </div>
        <ul class="feature-list">${features.map(feature => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
      </div>
      <div class="libro-footer">
        <span><span class="autor-nombre">Cursoteca Abierta</span></span>
        <span>${escapeHtml(lessonMeta)}</span>
      </div>
      <div class="card-actions">${openAction}</div>
    </article>`;
}

function getFilteredCourses() {
  const query = normalize(state.query);
  return state.courses.filter(course => {
    const matchesCategory = state.category === "all" || course.category === state.category;
    const searchable = [
      course.title,
      course.category,
      course.audience,
      getPublicDescription(course),
      getPublicStatus(course),
      getPublicFeatures(course).join(" "),
      (course.tags || []).join(" ")
    ].join(" ");
    return matchesCategory && normalize(searchable).includes(query);
  });
}

function getGroupCourses(group) {
  return state.courses.filter(course => group.categories.includes(course.category));
}

function markCourseOpened(courseId) {
  if (!courseId) return;
  state.openedCourses.add(courseId);
  writeOpenedCourses(state.openedCourses);
  updateProgress();
  updateVisibleBookmarks();
  renderCategoryHub();
}

function updateVisibleBookmarks() {
  for (const card of document.querySelectorAll("[data-course-id]")) {
    const opened = state.openedCourses.has(card.dataset.courseId);
    card.classList.toggle("tocado", opened);
    const ribbon = card.querySelector(".marcapaginas, .ribbon-slot");
    if (ribbon) ribbon.className = opened ? "marcapaginas" : "ribbon-slot";
  }
}

function updateProgress() {
  const total = state.courses.length || 1;
  const opened = state.openedCourses.size;
  const percentage = Math.round((opened / total) * 100);
  elements.progressBar.style.width = `${percentage}%`;
  elements.progressText.textContent = `${percentage}% explorado · ${opened} de ${state.courses.length}`;
}

function restoreTheme() {
  const savedTheme = safeLocalGet(storageKeys.theme) || "candil";
  applyTheme(savedTheme);
  elements.themeSelect.value = savedTheme;
}

function applyTheme(value) {
  elements.body.classList.remove("ambiente-claro", "ambiente-nocturno");
  if (value === "claro") elements.body.classList.add("ambiente-claro");
  if (value === "nocturno") elements.body.classList.add("ambiente-nocturno");
  safeLocalSet(storageKeys.theme, value);
}

function restoreHashPosition() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
}

function getPublicStatus(course) {
  if (course.status) return course.status;
  return course.publicReady && course.path ? "Disponible" : "En revision";
}

function getPublicDescription(course) {
  const rawDescription = String(course.description || "").trim();
  if (!rawDescription || /^curso web publico profesional de\b/i.test(rawDescription)) {
    return `Curso practico de ${course.category} con explicaciones claras, ejercicios guiados y recursos aplicables.`;
  }
  return rawDescription
    .replace(/\bv\d+(?:\.\d+)*(?:-beta)?\b/gi, "")
    .replace(/\bpublic[ao] profesional\b/gi, "abierto")
    .replace(/\bcurso bandera\b/gi, "curso destacado")
    .replace(/\s+/g, " ")
    .trim();
}

function getPublicFeatures(course) {
  const featureMap = new Map([
    ["Curso completo", "Material abierto"],
    ["Ejercicios practicos", "Ejercicios practicos"],
    ["Checklist de aplicacion", "Checklist de aplicacion"],
    ["Guia de recursos", "Guia de recursos"],
    ["Sin backend ni login", "Acceso directo desde el navegador"],
    ["Empaquetado ZIP", "Material preparado para descarga"],
    ["Publicado en portal", "Disponible en el catalogo"],
    ["Validado por auditoria local", "Material revisado"],
    ["Datos de progreso local", "Progreso guardado en el dispositivo"]
  ]);
  return (course.features || [])
    .map(feature => featureMap.get(feature) || feature)
    .filter(feature => !/backend|login|zip|auditoria|portal/i.test(feature))
    .slice(0, 5);
}

function getLessonMeta(course) {
  const features = course.features || [];
  const modules = features.find(feature => /modulos/i.test(normalize(feature)));
  const lessons = features.find(feature => /lecciones/i.test(normalize(feature)));
  if (modules && lessons) return `${modules} · ${lessons}`;
  if (lessons) return lessons;
  return course.version || "Curso abierto";
}

function isCompleteCourse(course) {
  return normalize([course.status, course.version, (course.tags || []).join(" ")].join(" ")).includes("curso completo v1");
}

function getPriority(course) {
  if (isCompleteCourse(course)) return 3;
  if (course.isPilot) return 2;
  return 1;
}

function getAccentForCourse(course) {
  const normalized = normalize(course.category);
  if (normalized.includes("datos") || normalized.includes("bi")) return "#4fb6aa";
  if (normalized.includes("desarrollo")) return "#57a6ff";
  if (normalized.includes("finanzas") || normalized.includes("emprendimiento")) return "#ba9653";
  if (normalized.includes("escuela") || normalized.includes("familia")) return "#8b6bd6";
  if (normalized.includes("contenido")) return "#c76767";
  return "#558b6e";
}

function getOpenedCourses() {
  try {
    return new Set(JSON.parse(localStorage.getItem(storageKeys.opened)) || []);
  } catch {
    return new Set();
  }
}

function writeOpenedCourses(openedCourses) {
  safeLocalSet(storageKeys.opened, JSON.stringify([...openedCourses]));
}

function safeLocalGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // El portal funciona igual si el navegador bloquea almacenamiento local.
  }
}

function normalize(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

elements.categoryHub.addEventListener("click", event => {
  const button = event.target.closest("[data-group-id]");
  if (!button) return;
  openCategory(button.dataset.groupId);
});

elements.shelfIndex.addEventListener("click", event => {
  const button = event.target.closest("[data-shelf-id]");
  if (!button) return;
  openCategory(button.dataset.shelfId);
});

document.addEventListener("click", event => {
  const courseLink = event.target.closest("[data-course-open]");
  if (!courseLink) return;
  markCourseOpened(courseLink.dataset.courseOpen);
});

elements.backToCategories.addEventListener("click", closeCategoryView);
elements.categoryFilter.addEventListener("change", event => {
  state.category = event.target.value;
  renderCourses();
});
elements.searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  renderCourses();
});
elements.resetButton.addEventListener("click", () => {
  state.category = "all";
  state.query = "";
  elements.categoryFilter.value = "all";
  elements.searchInput.value = "";
  renderCourses();
});
elements.themeSelect.addEventListener("change", event => applyTheme(event.target.value));

init();

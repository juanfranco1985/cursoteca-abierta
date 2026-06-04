const state = { courses: [], category: "all", query: "", activeGroup: null };
const grid = document.querySelector("#courses-grid");
const featuredGrid = document.querySelector("#featured-grid");
const categoryHub = document.querySelector("#category-hub");
const categoryView = document.querySelector("#category-view");
const categoryCoursesGrid = document.querySelector("#category-courses-grid");
const categoryViewTitle = document.querySelector("#category-view-title");
const categoryViewDescription = document.querySelector("#category-view-description");
const categoryViewCount = document.querySelector("#category-view-count");
const backToCategories = document.querySelector("#back-to-categories");
const categoryFilter = document.querySelector("#category-filter");
const searchInput = document.querySelector("#search-input");
const resetButton = document.querySelector("#reset-filters");
const resultCount = document.querySelector("#result-count");
const courseCount = document.querySelector("#course-count");

const categoryGroups = [
  {
    id: "ciudadania-seguridad",
    title: "Ciudadania Digital y Seguridad",
    description: "Uso seguro de dispositivos, privacidad, emergencias, identidad digital y proteccion cotidiana.",
    categories: ["Ciudadania digital", "Emergencia digital", "Privacidad", "Finanzas digitales", "Plantilla"]
  },
  {
    id: "ia-trabajo-productividad",
    title: "IA, Trabajo y Productividad",
    description: "Herramientas para trabajar mejor, automatizar tareas, organizar informacion y mejorar rutinas.",
    categories: ["Trabajo e IA", "Productividad", "Trabajo", "Soporte tecnico"]
  },
  {
    id: "datos-bi-gobierno",
    title: "Datos, BI y Gobierno de Datos",
    description: "Analisis, visualizacion, planillas, SQL, calidad, gobierno y storytelling con datos.",
    categories: ["BI", "Datos", "Gobierno de datos"]
  },
  {
    id: "desarrollo-ux-programacion",
    title: "Desarrollo Web, UX/UI y Programacion",
    description: "HTML, CSS, JavaScript, React, APIs, Git, accesibilidad, publicacion y diseno de interfaces.",
    categories: ["Desarrollo web"]
  },
  {
    id: "emprendimiento-finanzas",
    title: "Emprendimiento, Marketing y Finanzas",
    description: "Ventas, precios, rentabilidad, tienda online, marketing barrial y herramientas comerciales.",
    categories: ["Emprendimiento", "Finanzas"]
  },
  {
    id: "educacion-familia",
    title: "Educacion, Familia y Acompanamiento",
    description: "Cursos para escuelas, docentes, familias y acompanamiento digital responsable.",
    categories: ["Escuela", "Familia"]
  },
  {
    id: "administracion-tramites-atencion",
    title: "Administracion, Tramites y Atencion",
    description: "Organizacion administrativa, tramites digitales y atencion profesional por canales online.",
    categories: ["Administracion", "Tramites digitales", "Atencion al cliente"]
  },
  {
    id: "contenido-plus",
    title: "Contenido Plus",
    description: "Cursos de cultura tecnologica y divulgacion para ampliar la mirada del catalogo.",
    categories: ["Contenido Plus"]
  }
];

const featuredCourseIds = new Set([
  "alfabetizacion_digital_adultos_web_v0_6_publica",
  "ia_practica_web_v0_6_publica",
  "power_bi_principiantes_web_v0_6_publica",
  "javascript_desde_cero_web_v0_6_publica",
  "marketing_digital_barrial_v0_6_publica",
  "ux_ui_basico_sitios_apps_v0_6_publica"
]);

async function init() {
  try {
    const response = await fetch("data/courses.json");
    state.courses = await response.json();
    courseCount.textContent = state.courses.length;
    setupCategories();
    renderCategoryHub();
    renderFeaturedCourses();
    renderCourses();
    restoreHashPosition();
  } catch (error) {
    const message = `<article class="course-card"><h3>No se pudo cargar el inventario</h3><p class="description">Abri el portal con Live Server o un servidor local para permitir la carga de JSON.</p></article>`;
    grid.innerHTML = message;
    featuredGrid.innerHTML = message;
    categoryHub.innerHTML = message;
    console.error(error);
  }
}

function restoreHashPosition() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
}

function setupCategories() {
  const categories = [...new Set(state.courses.map(course => course.category))].sort();
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  }
}

function getGroupCourses(group) {
  return state.courses.filter(course => group.categories.includes(course.category));
}

function renderCategoryHub() {
  categoryHub.innerHTML = categoryGroups.map((group, index) => {
    const courses = getGroupCourses(group);
    const previewBooks = courses.slice(0, 5).map((course, previewIndex) => `
      <span class="preview-book" style="--book-order: ${previewIndex};" aria-hidden="true"></span>
    `).join("");
    const categoryLabels = group.categories.map(category => `<span>${escapeHtml(category)}</span>`).join("");
    return `
      <article class="category-card">
        <div class="category-preview" aria-hidden="true">${previewBooks}</div>
        <div class="category-card-body">
          <p class="eyebrow">Estante ${String(index + 1).padStart(2, "0")}</p>
          <h3>${escapeHtml(group.title)}</h3>
          <p class="description">${escapeHtml(group.description)}</p>
          <div class="category-tags">${categoryLabels}</div>
        </div>
        <div class="category-card-footer">
          <strong>${courses.length}</strong>
          <span>cursos</span>
          <button class="secondary-button category-open" type="button" data-group-id="${escapeAttribute(group.id)}">Ver estante</button>
        </div>
      </article>`;
  }).join("");
}

function openCategory(groupId) {
  const group = categoryGroups.find(item => item.id === groupId);
  if (!group) return;
  const courses = getGroupCourses(group);
  state.activeGroup = group.id;
  categoryViewTitle.textContent = group.title;
  categoryViewDescription.textContent = group.description;
  categoryViewCount.textContent = `${courses.length} cursos en este estante`;
  categoryCoursesGrid.innerHTML = courses.map(course => renderCourseCard(course)).join("");
  categoryView.hidden = false;
  categoryView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeCategoryView() {
  state.activeGroup = null;
  categoryView.hidden = true;
  document.querySelector("#categorias").scrollIntoView({ behavior: "smooth", block: "start" });
}

function getFilteredCourses() {
  const query = normalize(state.query);
  return state.courses.filter(course => {
    const matchesCategory = state.category === "all" || course.category === state.category;
    const text = normalize([course.title, course.category, course.audience, getPublicDescription(course), getPublicStatus(course), getPublicFeatures(course).join(" "), (course.tags || []).join(" ")].join(" "));
    return matchesCategory && text.includes(query);
  });
}

function renderFeaturedCourses() {
  const featured = state.courses.filter(course => featuredCourseIds.has(course.id));
  featuredGrid.innerHTML = featured.map(course => renderCourseCard(course, true)).join("");
}

function renderCourses() {
  const filtered = getFilteredCourses();
  resultCount.textContent = `${filtered.length} de ${state.courses.length} cursos`;
  if (!filtered.length) {
    grid.innerHTML = `<article class="course-card"><h3>Sin resultados</h3><p class="description">Proba limpiar filtros o buscar por una palabra mas general.</p></article>`;
    return;
  }
  grid.innerHTML = filtered.map(course => renderCourseCard(course)).join("");
}

function renderCourseCard(course, featured = false) {
  const featuredBadge = featured ? `<span class="badge featured">Destacado</span>` : "";
  const availability = course.publicReady && course.path
    ? `<a class="button-link" href="${escapeAttribute(course.path)}">Abrir curso</a>`
    : `<span class="secondary-link">Revisar enlace</span>`;
  const cardClass = featured ? "course-card is-featured" : "course-card";
  const coverPath = `assets/course-covers/${course.id}.svg`;
  const coverAlt = `Miniatura del curso ${course.title}`;
  const loading = featured ? "eager" : "lazy";
  const publicDescription = getPublicDescription(course);
  const publicFeatures = getPublicFeatures(course);
  return `
    <article class="${cardClass}" data-course-id="${escapeAttribute(course.id)}">
      <figure class="course-media">
        <img class="course-cover" src="${escapeAttribute(coverPath)}" alt="${escapeAttribute(coverAlt)}" loading="${loading}" decoding="async">
      </figure>
      <header><div><p class="eyebrow">${escapeHtml(course.category)}</p><h3>${escapeHtml(course.title)}</h3></div><span class="badge accent">Curso gratuito</span></header>
      <div class="badges">${featuredBadge}<span class="badge">${escapeHtml(getPublicStatus(course))}</span><span class="badge">${escapeHtml(course.audience)}</span></div>
      <p class="description">${escapeHtml(publicDescription)}</p>
      <ul class="feature-list">${publicFeatures.map(feature => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
      <p class="description"><strong>Incluye:</strong> lecciones, recursos practicos y actividades para avanzar a tu ritmo.</p>
      <div class="card-actions">${availability}</div>
    </article>`;
}

function getPublicStatus(course) {
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
    ["Curso completo", "Curso completo"],
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
    .slice(0, 6);
}

function normalize(value) { return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function escapeAttribute(value) { return escapeHtml(value).replaceAll("`", "&#096;"); }

categoryHub.addEventListener("click", event => {
  const button = event.target.closest("[data-group-id]");
  if (!button) return;
  openCategory(button.dataset.groupId);
});
backToCategories.addEventListener("click", closeCategoryView);
categoryFilter.addEventListener("change", event => { state.category = event.target.value; renderCourses(); });
searchInput.addEventListener("input", event => { state.query = event.target.value; renderCourses(); });
resetButton.addEventListener("click", () => {
  state.category = "all";
  state.query = "";
  categoryFilter.value = "all";
  searchInput.value = "";
  renderCourses();
});
init();

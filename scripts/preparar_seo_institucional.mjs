import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const portalDir = path.join(root, "portal", "portal_publico_profesional_v0_6");
const coursesRoot = path.join(root, "cursos");
const fichasRoot = path.join(root, "curso");
const baseUrl = "https://juanfranco1985.github.io/cursoteca-abierta";
const today = "2026-06-07";

const institutionalPages = [
  {
    file: "acerca.html",
    title: "Acerca del proyecto",
    description: "Cursoteca Abierta es una biblioteca digital gratuita de cursos introductorios, guias practicas y materiales de estudio autonomo.",
    eyebrow: "Proyecto",
    heading: "Una biblioteca digital abierta",
    intro: "Cursoteca Abierta reune cursos gratuitos para aprendizaje autonomo, consulta cotidiana y formacion inicial. El objetivo es ofrecer explicaciones claras, ejercicios guiados y rutas de estudio accesibles sin pedir cuenta, pago ni datos personales.",
    sections: [
      ["Que ofrece", "Cursos organizados por estantes tematicos, contenidos teoricos, actividades, checklists, casos y materiales descargables."],
      ["Estado editorial", "El catalogo se publica y mejora por tandas. Algunos cursos ya estan reescritos como cursos completos v1 o v2; otros siguen en revision y se actualizan progresivamente."],
      ["Criterio de calidad", "La prioridad es profundizar teoria, sumar ejemplos concretos, evitar contenido generico y sostener una navegacion clara para estudiantes, familias, trabajadores y emprendedores."]
    ]
  },
  {
    file: "contacto.html",
    title: "Contacto",
    description: "Canales de contacto de Cursoteca Abierta para reportar errores, sugerir mejoras o pedir revision de contenidos.",
    eyebrow: "Contacto",
    heading: "Reportes, mejoras y seguimiento",
    intro: "El proyecto no usa formularios propios ni recopila datos desde esta pagina. Para reportar errores, proponer mejoras o pedir revision de un curso, se centraliza el seguimiento en el repositorio publico.",
    sections: [
      ["Canal principal", "Usa GitHub Issues para dejar reportes trazables sobre navegacion, contenido incompleto, errores de enlace o propuestas editoriales."],
      ["Datos personales", "No publiques informacion sensible, documentos, claves, telefonos privados ni datos de terceros en reportes publicos."],
      ["Respuesta", "Las mejoras se revisan por prioridad: navegabilidad, seguridad, privacidad, profundidad teorica y claridad del material."]
    ],
    actions: [
      ["Abrir GitHub Issues", "https://github.com/juanfranco1985/cursoteca-abierta/issues"],
      ["Ver repositorio", "https://github.com/juanfranco1985/cursoteca-abierta"]
    ]
  },
  {
    file: "privacidad.html",
    title: "Politica de privacidad",
    description: "Politica de privacidad de Cursoteca Abierta: sitio estatico, sin cuentas, formularios propios ni base de datos.",
    eyebrow: "Privacidad",
    heading: "Privacidad y datos del sitio",
    intro: "Cursoteca Abierta funciona como sitio estatico. No requiere registro, no tiene backend propio, no usa formularios propios y no conserva una base de datos de estudiantes.",
    sections: [
      ["Datos que no pedimos", "No solicitamos nombre, documento, telefono, direccion, tarjeta, contrasena ni credenciales de servicios externos para acceder a los cursos."],
      ["Progreso local", "Algunos avances de lectura, notas o preferencias visuales pueden guardarse en el almacenamiento local del navegador. Esa informacion queda en el dispositivo y puede borrarse desde la configuracion del navegador."],
      ["Servicios externos", "El sitio se aloja en GitHub Pages y puede enlazar a GitHub u otros recursos externos. Esos servicios tienen sus propias politicas de privacidad."],
      ["Publicidad", "Actualmente no se inserta codigo publicitario. Si se activa AdSense u otra red, esta politica debe actualizarse para explicar cookies, identificadores publicitarios, proveedores y opciones de consentimiento aplicables."],
      ["Menores y escuelas", "El contenido es educativo y abierto. Si se usa en contextos escolares o familiares, se recomienda supervision adulta y no compartir datos personales en canales publicos."]
    ]
  },
  {
    file: "terminos.html",
    title: "Terminos de uso",
    description: "Terminos de uso de Cursoteca Abierta para acceso gratuito, uso educativo, limitaciones y responsabilidad del usuario.",
    eyebrow: "Uso",
    heading: "Terminos de uso",
    intro: "Al usar Cursoteca Abierta aceptas que el material se ofrece con fines educativos, de orientacion general y aprendizaje autonomo. El acceso al catalogo publicado es gratuito.",
    sections: [
      ["Uso permitido", "Puedes leer, estudiar, compartir enlaces publicos y usar los materiales como apoyo educativo, siempre respetando autoria, contexto y finalidad formativa."],
      ["Sin garantia profesional", "Los contenidos no reemplazan asesoramiento profesional, soporte tecnico oficial, normativa vigente ni decisiones criticas validadas por especialistas."],
      ["Cambios del contenido", "Los cursos pueden corregirse, ampliarse o reorganizarse. La fecha de publicacion y version editorial ayudan a ubicar el estado de cada material."],
      ["Enlaces externos", "Los enlaces a recursos externos se ofrecen como referencia. Cursoteca Abierta no controla cambios, disponibilidad ni politicas de esos sitios."],
      ["Publicidad futura", "Si se incorporan anuncios, deberan distinguirse claramente del contenido y no interferir con la navegacion ni inducir clics."]
    ]
  },
  {
    file: "aviso-educativo.html",
    title: "Aviso educativo y no profesional",
    description: "Aviso de alcance educativo de Cursoteca Abierta: los cursos no sustituyen asesoramiento profesional, legal, medico, financiero o tecnico oficial.",
    eyebrow: "Alcance",
    heading: "Aviso educativo y no profesional",
    intro: "Los cursos son materiales de aprendizaje general. Estan pensados para orientar, explicar conceptos y proponer practicas, no para emitir diagnosticos, dictamenes ni instrucciones profesionales personalizadas.",
    sections: [
      ["Decisiones criticas", "En temas de salud, seguridad, finanzas, impuestos, tramites, derechos, trabajo, datos personales o tecnologia en produccion, valida siempre con fuentes oficiales o profesionales competentes."],
      ["Ejercicios y ejemplos", "Los ejercicios son simulaciones educativas. Antes de aplicar cambios reales en cuentas, dispositivos, negocios o sistemas, revisa contexto, riesgos y respaldo."],
      ["Actualizacion", "Algunos contenidos pueden quedar desactualizados por cambios normativos, tecnicos o de plataformas. La revision editorial continua reduce ese riesgo, pero no lo elimina."],
      ["Responsabilidad del usuario", "Cada persona decide como usa el material y debe contrastar la informacion antes de tomar acciones con impacto real."]
    ]
  }
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

function html(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fixMojibake(value = "") {
  const text = String(value || "").normalize("NFC");
  if (!/[ÃÂâ]/.test(text)) return text;
  const repaired = Buffer.from(text, "latin1").toString("utf8");
  const score = candidate => (candidate.match(/[ÃÂ�]/g) || []).length;
  return score(repaired) < score(text) ? repaired : text;
}

function cleanText(value = "") {
  return fixMojibake(value)
    .replace(/\s+/g, " ")
    .trim();
}

function cleanMultiline(value = "") {
  return fixMojibake(value)
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function clampDescription(value, fallback) {
  const text = cleanText(value || fallback);
  if (text.length <= 158) return text;
  const slice = text.slice(0, 158);
  const punctuation = Math.max(slice.lastIndexOf("."), slice.lastIndexOf(";"), slice.lastIndexOf(":"));
  if (punctuation > 80) return slice.slice(0, punctuation + 1);
  const trimmed = slice.replace(/\s+\S*$/, "");
  return `${trimmed}.`;
}

function slugify(value = "") {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "curso";
}

function initials(name = "") {
  return cleanText(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(word => word[0])
    .join("")
    .toUpperCase() || "CA";
}

function scriptJson(data) {
  return JSON.stringify(data, null, 2).replaceAll("</", "<\\/");
}

function renderList(items = []) {
  const cleanItems = items.map(item => cleanText(item)).filter(Boolean);
  if (!cleanItems.length) return "";
  return `<ul>${cleanItems.map(item => `<li>${html(item)}</li>`).join("")}</ul>`;
}

function renderRichText(value = "") {
  const blocks = cleanMultiline(value).split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
  return blocks.map(block => {
    const lines = block.split("\n").map(line => line.trim()).filter(Boolean);
    if (lines.length > 1 && lines.every(line => /^[-*]\s+/.test(line))) {
      return `<ul>${lines.map(line => `<li>${html(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
    }
    if (lines.length > 1) {
      return `<p>${lines.map(line => html(line)).join("<br>")}</p>`;
    }
    return `<p>${html(block)}</p>`;
  }).join("\n");
}

function compactText(value = "", maxWords = 42) {
  const words = cleanText(value).split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}.`;
}

function courseStats(course = {}) {
  const modules = course.modules || [];
  const lessons = modules.reduce((total, module) => total + (module.lessons || []).length, 0);
  const questions = modules.reduce((total, module) => total + (module.quiz || module.questions || []).length, 0);
  return {
    modules: modules.length,
    lessons,
    questions,
    objectives: (course.objectives || []).length,
    sources: Object.keys(course.sourceBank || {}).length
  };
}

function buildCourseDescription(appName, courseContent = {}, fallback = "") {
  const stats = courseStats(courseContent);
  const firstObjective = cleanText((courseContent.objectives || [])[0] || "");
  const statsText = stats.modules && stats.lessons
    ? `Incluye ${stats.modules} modulos, ${stats.lessons} lecciones, objetivos, temario y producto final.`
    : "Incluye objetivos, temario, materiales de estudio y acceso al volumen interactivo.";
  const base = firstObjective
    ? `Curso gratis de ${appName}: ${firstObjective} ${statsText}`
    : `Curso gratis de ${appName}. ${statsText}`;
  return clampDescription(base, fallback || `Curso gratis de ${appName} en Cursoteca Abierta, con teoria, ejercicios guiados y materiales de estudio autonomo.`);
}

function siteHead({ title, description, canonical, type = "website", image }) {
  const fullTitle = title.includes("Cursoteca Abierta") ? title : `${title} | Cursoteca Abierta`;
  const imageUrl = image || `${baseUrl}/auditoria_visual_portal_desktop_v3.png`;
  return `  <title>${html(fullTitle)}</title>
  <meta name="description" content="${html(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${html(canonical)}" />
  <meta property="og:site_name" content="Cursoteca Abierta" />
  <meta property="og:locale" content="es_AR" />
  <meta property="og:type" content="${html(type)}" />
  <meta property="og:title" content="${html(fullTitle)}" />
  <meta property="og:description" content="${html(description)}" />
  <meta property="og:url" content="${html(canonical)}" />
  <meta property="og:image" content="${html(imageUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${html(fullTitle)}" />
  <meta name="twitter:description" content="${html(description)}" />
  <meta name="twitter:image" content="${html(imageUrl)}" />`;
}

function institutionalPage(page) {
  const canonical = `${baseUrl}/portal/portal_publico_profesional_v0_6/${page.file}`;
  const actions = (page.actions || []).map(([label, href]) => `<a class="button-link institutional-action" href="${html(href)}">${html(label)}</a>`).join("");
  const actionsBlock = actions ? `\n        <div class="institutional-actions">${actions}</div>` : "";
  const sections = page.sections.map(([title, body]) => `
          <section class="institutional-section">
            <h2>${html(title)}</h2>
            <p>${html(body)}</p>
          </section>`).join("");
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${page.title} | Cursoteca Abierta`,
    description: page.description,
    url: canonical,
    inLanguage: "es-AR",
    isPartOf: {
      "@type": "WebSite",
      name: "Cursoteca Abierta",
      url: `${baseUrl}/`
    }
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${siteHead({ title: page.title, description: page.description, canonical })}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css?v=20260607-seo-institucional" />
  <script type="application/ld+json">${scriptJson(ld)}</script>
</head>
<body class="institutional-body">
  <a class="skip-link" href="#main">Saltar al contenido principal</a>
  <nav class="meson-nav" aria-label="Navegacion principal">
    <a class="logo-club" href="index.html#inicio" aria-label="Cursoteca Abierta">Cursoteca Abierta</a>
    <div class="controles-meson">
      <div class="menu-meson" aria-label="Accesos institucionales">
        <a href="index.html#categorias">Estanterias</a>
        <a href="index.html#inventario">Catalogo</a>
        <a href="acerca.html">Acerca</a>
        <a href="contacto.html">Contacto</a>
      </div>
    </div>
  </nav>

  <main id="main" class="institutional-main">
    <article class="policy-book">
      <aside class="policy-book-index" aria-label="Secciones institucionales">
        <p class="eyebrow">${html(page.eyebrow)}</p>
        <h1>${html(page.heading)}</h1>
        <p>${html(page.intro)}</p>
        <nav class="policy-links" aria-label="Paginas institucionales">
          ${institutionalPages.map(item => `<a href="${html(item.file)}"${item.file === page.file ? ' aria-current="page"' : ""}>${html(item.title)}</a>`).join("")}
        </nav>${actionsBlock}
      </aside>
      <div class="policy-book-content">
${sections}
      </div>
    </article>
  </main>

  <footer class="site-footer">
    <nav class="footer-links" aria-label="Informacion del proyecto">
      <a href="index.html#inicio">Menu principal</a>
      <a href="acerca.html">Acerca</a>
      <a href="contacto.html">Contacto</a>
      <a href="privacidad.html">Privacidad</a>
      <a href="terminos.html">Terminos</a>
      <a href="aviso-educativo.html">Aviso educativo</a>
    </nav>
    <p>Cursoteca Abierta - Sala de estudio digital de cursos gratuitos.</p>
  </footer>
</body>
</html>`;
}

function courseIndex(manifest, folder, courseData = {}, courseContent = {}) {
  const appName = cleanText(manifest.appName || courseData.title || manifest.shortName || "Curso Cursoteca Abierta");
  const subtitle = cleanText(manifest.subtitle || manifest.description || courseData.description || "Manual de estudio");
  const shortName = cleanText(manifest.shortName || appName);
  const category = cleanText(manifest.category || courseData.category || "Curso abierto");
  const mark = initials(shortName);
  const canonical = `${baseUrl}/cursos/${folder}/`;
  const description = buildCourseDescription(appName, courseContent, subtitle);
  const title = `${appName} | Curso gratis`;
  const image = fs.existsSync(path.join(coursesRoot, folder, "icons", "icon-512.png"))
    ? `${baseUrl}/cursos/${folder}/icons/icon-512.png`
    : `${baseUrl}/cursos/${folder}/icons/icon.svg`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: appName,
    description,
    url: canonical,
    inLanguage: "es-AR",
    isAccessibleForFree: true,
    educationalLevel: "Introductorio",
    about: category,
    provider: {
      "@type": "Organization",
      name: "Cursoteca Abierta",
      url: `${baseUrl}/`
    }
  };

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${siteHead({ title, description, canonical, type: "article", image })}
  <meta name="theme-color" content="${html(manifest.theme?.background || "#f6f0e2")}" />
  <meta name="application-name" content="${html(appName)}" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="${html(shortName)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="manifest" href="manifest.webmanifest" />
  <link rel="icon" href="icons/icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="icons/icon-192.png" />
  <link rel="stylesheet" href="styles.css?v=20260605-libro-abierto" />
  <script type="application/ld+json">${scriptJson(ld)}</script>
</head>
<body>
  <a class="skip-link" href="#app">Saltar al contenido principal</a>
  <nav class="meson-nav" aria-label="Navegacion principal del curso">
    <a class="logo-club" href="#/" aria-label="Ir a portada del curso">
      <span data-brand-name>${html(shortName)}</span>
      <small data-brand-subtitle>${html(description)}</small>
    </a>
    <div class="controles-meson">
      <label class="sr-only" for="selector-ambiente">Ambiente de lectura</label>
      <select class="selector-candil" id="selector-ambiente">
        <option value="candil">Tarde de candil</option>
        <option value="claro">Manana clara</option>
        <option value="nocturno">Estudio nocturno</option>
      </select>
      <div class="menu-meson">
        <a data-portal-return href="../../portal/portal_publico_profesional_v0_6/index.html">Ver estanterias</a>
        <a href="#/">Portada</a>
        <a href="#/checklists">Checklists</a>
        <a href="#/incidents">Casos</a>
      </div>
    </div>
  </nav>
  <main id="app" tabindex="-1">
    <section class="escena-libro-abierto">
      <div class="mueble-libro">
        <div class="pagina-izq">
          <span class="curso-categoria">${html(category)}</span>
          <h1 class="curso-titulo-abierto">${html(shortName)}</h1>
        </div>
        <div class="pagina-der">
          <div class="leccion-meta">${html(mark)}</div>
          <h2 class="leccion-titulo">Cargando volumen...</h2>
          <div class="leccion-texto"><p>Si abriste este archivo directamente con doble clic y no carga, usa un servidor local.</p></div>
        </div>
      </div>
    </section>
  </main>
  <footer class="footer">
    <a data-portal-return href="../../portal/portal_publico_profesional_v0_6/index.html">Volver al portal</a>
    <span>Cursoteca Abierta - Curso gratuito</span>
    <a href="#/legal">Alcance y privacidad</a>
    <a href="../../portal/portal_publico_profesional_v0_6/privacidad.html">Privacidad global</a>
    <a href="../../portal/portal_publico_profesional_v0_6/aviso-educativo.html">Aviso educativo</a>
    <a href="#/certificate">Constancia</a>
  </footer>
  <script src="src/app.js?v=20260605-libro-abierto" defer></script>
</body>
</html>`;
}

function courseFicha({ manifest, folder, courseData = {}, courseContent = {}, slug }) {
  const appName = cleanText(courseContent.title || manifest.appName || courseData.title || "Curso Cursoteca Abierta");
  const subtitle = cleanText(manifest.subtitle || manifest.description || courseData.description || "Curso gratuito de Cursoteca Abierta.");
  const presentation = cleanMultiline(courseContent.presentation || subtitle);
  const category = cleanText(manifest.category || courseData.category || "Curso abierto");
  const audience = cleanText(manifest.audience || courseData.audience || "Personas que buscan aprender desde cero.");
  const version = cleanText(manifest.version || courseContent.version || courseData.version || "Curso abierto");
  const finalProduct = cleanMultiline(courseContent.finalProduct || "Al finalizar, el estudiante prepara una actividad o producto de aplicacion vinculado al curso.");
  const description = buildCourseDescription(appName, courseContent, presentation || subtitle);
  const canonical = `${baseUrl}/curso/${slug}/`;
  const interactiveUrl = `${baseUrl}/cursos/${folder}/`;
  const image = fs.existsSync(path.join(coursesRoot, folder, "icons", "icon-512.png"))
    ? `${baseUrl}/cursos/${folder}/icons/icon-512.png`
    : `${baseUrl}/auditoria_visual_portal_desktop_v3.png`;
  const stats = courseStats(courseContent);
  const modules = (courseContent.modules || []).map((module, index) => {
    const lessons = (module.lessons || []).slice(0, 4).map(lesson => cleanText(lesson.title)).filter(Boolean);
    return `
          <article class="ficha-module">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>${html(cleanText(module.title || `Modulo ${index + 1}`))}</h3>
              <p>${html(compactText(module.description || module.learningRisk || "Modulo del programa de estudio.", 34))}</p>
              ${lessons.length ? `<small>Lecciones: ${html(lessons.join(" · "))}</small>` : ""}
            </div>
          </article>`;
  }).join("");
  const sources = Object.values(courseContent.sourceBank || {}).slice(0, 10).map(source => {
    const title = cleanText(source.title || source.organization || "Fuente recomendada");
    const org = cleanText(source.organization || "");
    const url = cleanText(source.url || "");
    const body = org && org !== title ? `${title} - ${org}` : title;
    return url && url !== "#"
      ? `<li><a href="${html(url)}">${html(body)}</a></li>`
      : `<li>${html(body)}</li>`;
  }).join("");
  const glossary = cleanMultiline(courseContent.glossary || "")
    .split(/\n{2,}/)
    .map(item => cleanText(item))
    .filter(Boolean)
    .slice(0, 8);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: appName,
    description,
    url: canonical,
    inLanguage: "es-AR",
    isAccessibleForFree: true,
    educationalLevel: "Introductorio",
    about: category,
    provider: {
      "@type": "Organization",
      name: "Cursoteca Abierta",
      url: `${baseUrl}/`
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: stats.lessons ? `PT${Math.max(2, Math.round(stats.lessons * 0.25))}H` : undefined,
      url: interactiveUrl
    }
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Cursoteca Abierta",
        item: `${baseUrl}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cursos",
        item: `${baseUrl}/portal/portal_publico_profesional_v0_6/`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: appName,
        item: canonical
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${siteHead({ title: `${appName} | Ficha del curso gratis`, description, canonical, type: "article", image })}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../portal/portal_publico_profesional_v0_6/styles.css?v=20260608-fichas-seo" />
  <script type="application/ld+json">${scriptJson(ld)}</script>
  <script type="application/ld+json">${scriptJson(breadcrumbs)}</script>
</head>
<body class="course-ficha-body">
  <a class="skip-link" href="#main">Saltar al contenido principal</a>
  <nav class="meson-nav" aria-label="Navegacion principal">
    <a class="logo-club" href="../../portal/portal_publico_profesional_v0_6/index.html#inicio" aria-label="Cursoteca Abierta">Cursoteca Abierta</a>
    <div class="controles-meson">
      <div class="menu-meson" aria-label="Accesos del curso">
        <a href="../../portal/portal_publico_profesional_v0_6/index.html#inventario">Catalogo</a>
        <a href="../../cursos/${html(folder)}/index.html">Abrir volumen</a>
        <a href="../../portal/portal_publico_profesional_v0_6/privacidad.html">Privacidad</a>
        <a href="../../portal/portal_publico_profesional_v0_6/contacto.html">Contacto</a>
      </div>
    </div>
  </nav>

  <main id="main" class="course-ficha-main">
    <nav class="ficha-breadcrumb" aria-label="Miga de pan">
      <a href="../../portal/portal_publico_profesional_v0_6/index.html">Portal</a>
      <span>/</span>
      <span>${html(appName)}</span>
    </nav>

    <header class="ficha-hero">
      <div>
        <p class="eyebrow">${html(category)}</p>
        <h1>${html(appName)}</h1>
        <p class="ficha-lead">${html(description)}</p>
        <div class="ficha-actions">
          <a class="button-link" href="../../cursos/${html(folder)}/index.html">Abrir curso interactivo</a>
          <a class="secondary-button" href="../../portal/portal_publico_profesional_v0_6/index.html#inventario">Volver al catalogo</a>
        </div>
      </div>
      <aside class="ficha-meta" aria-label="Datos principales del curso">
        <span><strong>${html(String(stats.modules || "0"))}</strong> modulos</span>
        <span><strong>${html(String(stats.lessons || "0"))}</strong> lecciones</span>
        <span><strong>${html(String(stats.objectives || "0"))}</strong> objetivos</span>
        <span><strong>${html(version)}</strong> version</span>
      </aside>
    </header>

    <div class="ficha-layout">
      <aside class="ficha-toc" aria-label="Indice de la ficha">
        <a href="#presentacion">Presentacion</a>
        <a href="#objetivos">Objetivos</a>
        <a href="#temario">Temario</a>
        <a href="#producto-final">Producto final</a>
        <a href="#fuentes">Fuentes</a>
        <a href="#alcance">Alcance educativo</a>
      </aside>

      <article class="ficha-content">
        <section id="presentacion" class="ficha-section">
          <p class="eyebrow">Ficha estatica</p>
          <h2>Presentacion del curso</h2>
          ${renderRichText(presentation)}
          <div class="ficha-callout">
            <strong>Publico recomendado</strong>
            <p>${html(audience)}</p>
          </div>
        </section>

        <section id="objetivos" class="ficha-section">
          <p class="eyebrow">Aprendizajes</p>
          <h2>Objetivos de aprendizaje</h2>
          ${renderList(courseContent.objectives || [])}
        </section>

        <section id="temario" class="ficha-section">
          <p class="eyebrow">Programa</p>
          <h2>Temario del curso</h2>
          <div class="ficha-module-list">${modules}</div>
        </section>

        <section id="producto-final" class="ficha-section">
          <p class="eyebrow">Aplicacion</p>
          <h2>Producto final esperado</h2>
          ${renderRichText(finalProduct)}
        </section>

        ${glossary.length ? `<section class="ficha-section">
          <p class="eyebrow">Conceptos clave</p>
          <h2>Glosario inicial</h2>
          ${renderList(glossary)}
        </section>` : ""}

        <section id="fuentes" class="ficha-section">
          <p class="eyebrow">Referencia editorial</p>
          <h2>Fuentes y recursos recomendados</h2>
          ${sources ? `<ul>${sources}</ul>` : "<p>Las fuentes se revisan durante la profundizacion editorial de cada curso.</p>"}
        </section>

        <section id="alcance" class="ficha-section ficha-callout">
          <p class="eyebrow">Aviso</p>
          <h2>Alcance educativo</h2>
          <p>${html(cleanText(manifest.responsibleNotice || "Contenido educativo. No reemplaza asesoramiento profesional, soporte oficial ni normativa aplicable. En decisiones criticas, valida con fuentes oficiales o especialistas competentes."))}</p>
        </section>
      </article>
    </div>
  </main>

  <footer class="site-footer">
    <nav class="footer-links" aria-label="Informacion del proyecto">
      <a href="../../portal/portal_publico_profesional_v0_6/index.html#inicio">Menu principal</a>
      <a href="../../portal/portal_publico_profesional_v0_6/acerca.html">Acerca</a>
      <a href="../../portal/portal_publico_profesional_v0_6/contacto.html">Contacto</a>
      <a href="../../portal/portal_publico_profesional_v0_6/privacidad.html">Privacidad</a>
      <a href="../../portal/portal_publico_profesional_v0_6/terminos.html">Terminos</a>
      <a href="../../portal/portal_publico_profesional_v0_6/aviso-educativo.html">Aviso educativo</a>
    </nav>
    <p>Cursoteca Abierta - Ficha estatica de curso gratuito.</p>
  </footer>
</body>
</html>`;
}

function rootIndex() {
  const canonical = `${baseUrl}/`;
  const description = "Cursoteca Abierta es una biblioteca digital gratuita con 50 cursos introductorios, rutas de aprendizaje y materiales de estudio autonomo.";
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="0; url=portal/portal_publico_profesional_v0_6/index.html" />
${siteHead({ title: "Cursoteca Abierta", description, canonical })}
  <style>
    :root {
      color-scheme: light;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f7f5ef;
      color: #1f2933;
    }

    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      padding: 24px;
    }

    main {
      width: min(100%, 620px);
      text-align: center;
    }

    h1 {
      margin: 0 0 12px;
      font-size: clamp(2rem, 8vw, 4rem);
      line-height: 1;
      letter-spacing: 0;
    }

    p {
      margin: 0 0 24px;
      color: #52606d;
      font-size: 1.05rem;
    }

    .links {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 0 18px;
      border-radius: 8px;
      background: #175cd3;
      color: #ffffff;
      font-weight: 700;
      text-decoration: none;
    }

    a.secondary {
      color: #1f2933;
      background: transparent;
      border: 1px solid #ccd2d8;
    }
  </style>
</head>
<body>
  <main>
    <h1>Cursoteca Abierta</h1>
    <p>Redirigiendo al portal publico de cursos gratuitos.</p>
    <div class="links">
      <a href="portal/portal_publico_profesional_v0_6/index.html">Abrir portal</a>
      <a class="secondary" href="portal/portal_publico_profesional_v0_6/acerca.html">Acerca del proyecto</a>
      <a class="secondary" href="portal/portal_publico_profesional_v0_6/privacidad.html">Privacidad</a>
    </div>
  </main>
  <script>
    window.location.replace("portal/portal_publico_profesional_v0_6/index.html");
  </script>
</body>
</html>`;
}

function sitemap(courseEntries) {
  const staticPages = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${baseUrl}/portal/portal_publico_profesional_v0_6/`, priority: "0.9", changefreq: "weekly" },
    ...institutionalPages.map(page => ({
      loc: `${baseUrl}/portal/portal_publico_profesional_v0_6/${page.file}`,
      priority: "0.6",
      changefreq: "monthly"
    }))
  ];
  const fichaPages = courseEntries.map(entry => ({
    loc: `${baseUrl}/curso/${entry.slug}/`,
    priority: "0.8",
    changefreq: "monthly"
  }));
  const coursePages = courseEntries.map(entry => ({
    loc: `${baseUrl}/cursos/${entry.folder}/`,
    priority: "0.7",
    changefreq: "monthly"
  }));
  const urls = [...staticPages, ...fichaPages, ...coursePages].map(item => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function adsenseSeoGuide() {
  return `# Preparacion SEO, Search Console y AdSense

Fecha: ${today}

## Implementado

- Paginas institucionales visibles: Acerca, Contacto, Politica de privacidad, Terminos de uso y Aviso educativo/no profesional.
- \`sitemap.xml\` en la raiz del sitio.
- \`robots.txt\` con referencia al sitemap publico.
- Canonical, description, Open Graph, Twitter Card y datos estructurados basicos en el portal, paginas institucionales y cursos.
- Titulos y descripciones SEO por curso generados desde los manifests.
- 50 fichas estaticas SEO en \`/curso/<slug>/\`, enlazadas desde el portal y el sitemap.

## Search Console

1. Crear una propiedad URL prefix para \`${baseUrl}/\`.
2. Verificar propiedad con el metodo que indique Google. No se dejo un token inventado en el repositorio.
3. Si Google entrega un archivo \`google-site-verification-XXXX.html\`, copiarlo en la raiz y commitearlo.
4. Si Google entrega una meta etiqueta, pegarla en el \`<head>\` de \`index.html\` y del portal.
5. Enviar el sitemap: \`${baseUrl}/sitemap.xml\`.
6. Usar inspeccion de URL para revisar la raiz, el portal y algunos cursos representativos.

## AdSense

Pendiente antes de solicitar aprobacion o insertar anuncios:

- Revisar manualmente que los cursos tengan contenido propio, sustancial y no duplicado.
- Mantener privacidad, terminos, contacto y aviso educativo enlazados desde el sitio.
- No insertar anuncios en pop-ups, elementos flotantes invasivos, botones de navegacion ni zonas que confundan al usuario.
- No pedir clics en anuncios ni presentar anuncios como recursos del curso.
- Actualizar privacidad si se activa publicidad o cookies publicitarias.
- Agregar \`ads.txt\` solo cuando exista un publisher ID real de AdSense.

## Fuentes oficiales revisadas

- Requisitos de elegibilidad de AdSense: https://support.google.com/adsense/answer/9724
- Politicas del programa AdSense: https://support.google.com/adsense/answer/48182
- Google Publisher Policies: https://support.google.com/publisherpolicies/answer/10502938
- Sitemaps en Google Search Central: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- robots.txt en Google Search Central: https://developers.google.com/crawling/docs/robots-txt/create-robots-txt
- Verificacion de propiedad en Search Console: https://support.google.com/webmasters/answer/9008080
`;
}

const courses = readJson(path.join(portalDir, "data", "courses.json"));
const coursesByFolder = new Map();
for (const course of courses) {
  const folder = String(course.path || "").match(/cursos\/([^/]+)\/index\.html/)?.[1] || course.id;
  coursesByFolder.set(folder, course);
}

const courseEntries = [];
const folderToFicha = new Map();
for (const entry of fs.readdirSync(coursesRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const folder = entry.name;
  const manifestFile = path.join(coursesRoot, folder, "src", "data", "course_manifest.json");
  const courseContentFile = path.join(coursesRoot, folder, "src", "data", "course_content.json");
  if (!fs.existsSync(manifestFile)) continue;
  const manifest = readJson(manifestFile);
  const courseContent = fs.existsSync(courseContentFile) ? readJson(courseContentFile) : {};
  const courseData = coursesByFolder.get(folder) || {};
  const slug = slugify(courseContent.title || manifest.appName || courseData.title || folder);
  write(path.join(coursesRoot, folder, "index.html"), courseIndex(manifest, folder, coursesByFolder.get(folder), courseContent));
  write(path.join(fichasRoot, slug, "index.html"), courseFicha({ manifest, folder, courseData, courseContent, slug }));
  folderToFicha.set(folder, slug);
  courseEntries.push({ folder, slug });
}

const enrichedCourses = courses.map(course => {
  const folder = String(course.path || "").match(/cursos\/([^/]+)\/index\.html/)?.[1] || course.id;
  const slug = folderToFicha.get(folder);
  return {
    ...course,
    title: cleanText(course.title),
    version: cleanText(course.version),
    status: cleanText(course.status),
    category: cleanText(course.category),
    audience: cleanText(course.audience),
    description: cleanText(course.description),
    recommendedBase: cleanText(course.recommendedBase),
    features: (course.features || []).map(feature => cleanText(feature)),
    seoPath: slug ? `../../curso/${slug}/index.html` : course.seoPath
  };
});
write(path.join(portalDir, "data", "courses.json"), JSON.stringify(enrichedCourses, null, 2));

for (const page of institutionalPages) {
  write(path.join(portalDir, page.file), institutionalPage(page));
}

write(path.join(root, "index.html"), rootIndex());
write(path.join(root, "sitemap.xml"), sitemap(courseEntries.sort((a, b) => a.slug.localeCompare(b.slug))));
write(path.join(root, "robots.txt"), `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`);
write(path.join(root, "SEO_ADSENSE_SEARCH_CONSOLE_2026_06_07.md"), adsenseSeoGuide());

console.log(JSON.stringify({
  institutionalPages: institutionalPages.length,
  courseIndexes: courseEntries.length,
  courseFichaPages: courseEntries.length,
  sitemapUrls: (courseEntries.length * 2) + institutionalPages.length + 2,
  baseUrl
}, null, 2));

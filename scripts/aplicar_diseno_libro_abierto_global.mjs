import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coursesRoot = path.join(root, "cursos");
const templatesRoot = path.join(root, "scripts", "templates");

const appTemplate = fs.readFileSync(path.join(templatesRoot, "curso_libro_abierto_app.js"), "utf8");
const cssTemplate = fs.readFileSync(path.join(templatesRoot, "curso_libro_abierto_styles.css"), "utf8");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function write(file, content) {
  fs.writeFileSync(file, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(word => word[0])
    .join("")
    .toUpperCase() || "CA";
}

function courseIndex(manifest) {
  const appName = manifest.appName || manifest.shortName || "Curso Cursoteca Abierta";
  const subtitle = manifest.subtitle || manifest.description || "Manual de estudio";
  const shortName = manifest.shortName || appName;
  const mark = initials(shortName);
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${escapeHtml(subtitle)}" />
  <meta name="theme-color" content="${escapeHtml(manifest.theme?.background || "#f6f0e2")}" />
  <meta name="application-name" content="${escapeHtml(appName)}" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="${escapeHtml(shortName)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="manifest" href="manifest.webmanifest" />
  <link rel="icon" href="icons/icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="icons/icon-192.png" />
  <title>${escapeHtml(appName)} - Cursoteca Abierta</title>
  <link rel="stylesheet" href="styles.css?v=20260605-libro-abierto" />
</head>
<body>
  <a class="skip-link" href="#app">Saltar al contenido principal</a>
  <nav class="meson-nav" aria-label="Navegacion principal del curso">
    <a class="logo-club" href="#/" aria-label="Ir a portada del curso">
      <span data-brand-name>${escapeHtml(shortName)}</span>
      <small data-brand-subtitle>${escapeHtml(subtitle)}</small>
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
          <span class="curso-categoria">Manual de estudio</span>
          <h1 class="curso-titulo-abierto">${escapeHtml(shortName)}</h1>
        </div>
        <div class="pagina-der">
          <div class="leccion-meta">${escapeHtml(mark)}</div>
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
    <a href="#/certificate">Constancia</a>
  </footer>
  <script src="src/app.js?v=20260605-libro-abierto" defer></script>
</body>
</html>`;
}

function updateServiceWorker(file, folder) {
  if (!fs.existsSync(file)) return false;
  let text = fs.readFileSync(file, "utf8");
  text = text.replace(/const CACHE_NAME = "([^"]+)";/, `const CACHE_NAME = "${folder}-cache-v2-libro-abierto";`);
  write(file, text);
  return true;
}

const results = [];

for (const entry of fs.readdirSync(coursesRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const folder = entry.name;
  const courseDir = path.join(coursesRoot, folder);
  const manifestFile = path.join(courseDir, "src", "data", "course_manifest.json");
  if (!fs.existsSync(manifestFile)) continue;
  const manifest = readJson(manifestFile);

  write(path.join(courseDir, "index.html"), courseIndex(manifest));
  write(path.join(courseDir, "styles.css"), cssTemplate);
  write(path.join(courseDir, "src", "app.js"), appTemplate);
  const serviceWorkerUpdated = updateServiceWorker(path.join(courseDir, "service-worker.js"), folder);

  results.push({
    folder,
    title: manifest.appName || manifest.shortName,
    serviceWorkerUpdated
  });
}

console.log(JSON.stringify({ updatedCourses: results.length, results }, null, 2));

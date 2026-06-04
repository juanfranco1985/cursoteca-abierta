const state={manifest:null,course:null,checklists:null,incidents:null,htmlLab:null,progress:{lessons:{},checklists:{},quiz:{},htmlLab:{},htmlHistory:[],pageBuilder:{},pageHistory:[],landingProject:{},landingHistory:[]},pageBuilder:null,landingProject:null};
const key='html_practico_principiantes_progress_v04';
const $=s=>document.querySelector(s);
async function loadJson(path){const r=await fetch(path); if(!r.ok) throw new Error(path); return r.json();}
function save(){localStorage.setItem(key,JSON.stringify(state.progress));}
function loadProgress(){try{state.progress=JSON.parse(localStorage.getItem(key))||state.progress}catch(e){}}
function nav(){const n=$('#nav'); n.innerHTML=['Inicio','#/','Módulos','#/modules','Laboratorio','#/html-lab','Constructor','#/page-builder','Landing','#/landing-project','Checklists','#/checklists','Casos','#/cases','Certificado','#/certificate'].reduce((a,v,i,arr)=>i%2?a+`<a class="btn secondary" href="${v}">${arr[i-1]}</a>`:a,'');}
function pct(){const total=state.course.modules.flatMap(m=>m.lessons).length; const done=Object.keys(state.progress.lessons).length; return Math.round(done/total*100);}
function shell(title,body){$('#app').innerHTML=`<section class="hero"><span class="pill">${state.manifest.category}</span><h1>${title}</h1><p class="muted">${state.manifest.subtitle}</p><div class="progress"><span style="width:${pct()}%"></span></div><p>${pct()}% de lecciones completadas</p></section>${body}`;}
function home(){shell(state.manifest.title,`<div class="grid"><div class="card"><h2>Curso base</h2><p>Aprendé HTML creando páginas reales desde cero.</p><a class="btn" href="#/modules">Ver módulos</a></div><div class="card"><h2>Laboratorio HTML</h2><p>Editá ejemplos, compará código correcto e incorrecto y exportá tus prácticas.</p><a class="btn" href="#/html-lab">Abrir laboratorio</a></div><div class="card"><h2>Casos prácticos</h2><p>Resolvé situaciones típicas: páginas, tablas, formularios e imágenes.</p><a class="btn secondary" href="#/cases">Practicar</a></div><div class="card"><h2>Constructor de página</h2><p>Generá una página HTML simple con formulario, vista previa y exportación.</p><a class="btn secondary" href="#/page-builder">Crear página</a></div><div class="card"><h2>Proyecto guiado: landing page</h2><p>Armá una landing page básica con hero, beneficios, imagen, llamada a la acción y contacto.</p><a class="btn" href="#/landing-project">Crear landing</a></div></div>`)}
function modules(){shell('Módulos',`<div class="grid">${state.course.modules.map(m=>`<article class="card"><h2>${m.title}</h2><p>${m.description}</p><p class="muted">${m.lessons.length} lecciones · ${m.quiz.length} preguntas</p><a class="btn" href="#/module/${m.id}">Abrir</a></article>`).join('')}</div>`)}
function module(id){const m=state.course.modules.find(x=>x.id===id); shell(m.title,`<div class="card"><p>${m.description}</p><a class="btn secondary" href="#/quiz/${m.id}">Quiz del módulo</a></div><div class="grid">${m.lessons.map(l=>`<article class="card"><h3>${state.progress.lessons[l.id]?'✅ ':''}${l.title}</h3><p>${l.keyIdea}</p><a class="btn" href="#/lesson/${m.id}/${l.id}">Leer</a></article>`).join('')}</div>`)}
function lesson(mid,lid){const m=state.course.modules.find(x=>x.id===mid); const l=m.lessons.find(x=>x.id===lid); shell(l.title,`<article class="card lesson"><p><strong>Idea clave:</strong> ${l.keyIdea}</p><p>${l.shortTheory}</p><p><strong>Ejemplo:</strong> ${l.practicalExample}</p><p><strong>Error común:</strong> ${l.commonMistake}</p><p><strong>Qué hacer ahora:</strong> ${l.whatToDoNow}</p><pre class="code">&lt;!doctype html&gt;
&lt;html lang="es"&gt;
  &lt;head&gt;&lt;title&gt;Mi página&lt;/title&gt;&lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hola HTML&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre><button onclick="state.progress.lessons['${l.id}']=true;save();router()">Marcar como completada</button></article>`)}
function quiz(mid){const m=state.course.modules.find(x=>x.id===mid); let score=0; shell(`Quiz: ${m.title}`,`<form class="card" id="quizForm">${m.quiz.map((q,i)=>`<fieldset><legend>${q.question}</legend>${q.options.map((o,oi)=>`<label><input type="radio" name="q${i}" value="${oi}"> ${o}</label><br>`).join('')}</fieldset>`).join('')}<button>Finalizar quiz</button><p id="quizResult"></p></form>`); $('#quizForm').onsubmit=e=>{e.preventDefault(); score=0; m.quiz.forEach((q,i)=>{const v=Number(new FormData(e.target).get('q'+i)); if(v===q.correctAnswerIndex)score++}); state.progress.quiz[mid]=score; save(); $('#quizResult').textContent=`Resultado: ${score}/${m.quiz.length}`}}
function checklists(){shell('Checklists',`<div class="grid">${state.checklists.checklists.map(c=>`<article class="card"><h2>${c.title}</h2>${c.items.map(it=>`<label><input type="checkbox" ${state.progress.checklists[it.id]?'checked':''} onchange="state.progress.checklists['${it.id}']=this.checked;save()"> ${it.text}</label><br>`).join('')}</article>`).join('')}</div>`)}
function cases(){shell('Casos prácticos',`<div class="grid">${state.incidents.incidents.map(c=>`<article class="card"><h2>${c.title}</h2><p>${c.immediateObjective}</p><a class="btn" href="#/case/${c.id}">Resolver</a></article>`).join('')}</div>`)}
function caseDetail(id){const c=state.incidents.incidents.find(x=>x.id===id); shell(c.title,`<article class="card"><h2>Objetivo</h2><p>${c.immediateObjective}</p><h3>Pasos</h3><ol>${c.steps.map(s=>`<li>${s}</li>`).join('')}</ol><h3>Errores a evitar</h3><ul>${c.mistakesToAvoid.map(s=>`<li>${s}</li>`).join('')}</ul><p><strong>Decisión:</strong> ${c.decision.question}</p>${c.decision.options.map((o,i)=>`<button class="secondary" onclick="alert('${i===c.decision.correctAnswerIndex?'Correcto: ': 'Revisá: '} ${c.decision.feedback}')">${o}</button> `).join('')}</article>`)}

function escapeHtml(str=''){return String(str).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function downloadTxt(name,content){const blob=new Blob([content],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); URL.revokeObjectURL(a.href);}
function copyText(text){navigator.clipboard?.writeText(text).then(()=>alert('Copiado')).catch(()=>alert('No se pudo copiar automáticamente.'));}
function htmlLab(){const lab=state.htmlLab; shell('Laboratorio HTML interactivo',`<div class="grid"><article class="card"><h2>Ejemplos editables</h2><p>Practicá con estructuras HTML reales y vista previa simulada.</p><a class="btn" href="#/html-examples">Abrir ejemplos</a></article><article class="card"><h2>Ejercicios guiados</h2><p>Resolvé consignas y compará con una solución sugerida.</p><a class="btn" href="#/html-exercises">Ver ejercicios</a></article><article class="card"><h2>Correcto vs incorrecto</h2><p>Entendé errores frecuentes de estructura, accesibilidad y semántica.</p><a class="btn secondary" href="#/html-compare">Comparar</a></article><article class="card"><h2>Fragmentos copiables</h2><p>Usá plantillas base para acelerar tus primeras páginas.</p><a class="btn secondary" href="#/html-snippets">Copiar fragmentos</a></article></div><section class="card"><h2>Historial local</h2><p class="muted">Se guarda solo el título de la práctica y la fecha, no datos sensibles.</p><ul>${(state.progress.htmlHistory||[]).slice(-5).reverse().map(h=>`<li>${h.title} · ${new Date(h.date).toLocaleString()}</li>`).join('')||'<li>Todavía no hay prácticas guardadas.</li>'}</ul></section>`)}
function htmlExamples(){shell('Ejemplos editables',`<div class="grid">${state.htmlLab.examples.map(ex=>`<article class="card"><h2>${ex.title}</h2><p>${ex.goal}</p><p class="muted">Categoría: ${ex.category}</p><a class="btn" href="#/html-example/${ex.id}">Practicar</a></article>`).join('')}</div>`)}
function htmlExample(id){const ex=state.htmlLab.examples.find(x=>x.id===id); const val=state.progress.htmlLab[id]||ex.starterCode; shell(ex.title,`<article class="card"><p>${ex.goal}</p><label for="codeArea"><strong>Código editable</strong></label><textarea id="codeArea" class="codearea" rows="14">${escapeHtml(val)}</textarea><div class="actions"><button onclick="state.progress.htmlLab['${id}']=$('#codeArea').value; state.progress.htmlHistory=(state.progress.htmlHistory||[]).concat([{title:'Ejemplo: ${ex.title}',date:new Date().toISOString()}]); save(); alert('Práctica guardada')">Guardar práctica</button><button class="secondary" onclick="copyText($('#codeArea').value)">Copiar HTML</button><button class="secondary" onclick="downloadTxt('${ex.id}.txt',$('#codeArea').value)">Descargar TXT</button></div><h3>Vista previa simulada</h3><iframe class="preview" sandbox srcdoc="${escapeHtml(val)}"></iframe><h3>Elementos esperados</h3><ul>${ex.expectedElements.map(e=>`<li><code>${escapeHtml(e)}</code></li>`).join('')}</ul><p><strong>Explicación:</strong> ${ex.explanation}</p></article>`); $('#codeArea').addEventListener('input',e=>{$('.preview').srcdoc=e.target.value});}
function htmlExercises(){shell('Ejercicios guiados',`<div class="grid">${state.htmlLab.exercises.map(ex=>`<article class="card"><h2>${ex.title}</h2><p>${ex.task}</p><p class="pill">${ex.difficulty}</p><a class="btn" href="#/html-exercise/${ex.id}">Resolver</a></article>`).join('')}</div>`)}
function htmlExercise(id){const ex=state.htmlLab.exercises.find(x=>x.id===id); const saved=state.progress.htmlLab[id]||''; shell(ex.title,`<article class="card"><h2>Consigna</h2><p>${ex.task}</p><p><strong>Pista:</strong> ${ex.hint}</p><textarea id="exerciseArea" class="codearea" rows="10" placeholder="Escribí tu HTML aquí...">${escapeHtml(saved)}</textarea><div class="actions"><button onclick="state.progress.htmlLab['${id}']=$('#exerciseArea').value; state.progress.htmlHistory=(state.progress.htmlHistory||[]).concat([{title:'Ejercicio: ${ex.title}',date:new Date().toISOString()}]); save(); alert('Ejercicio guardado')">Guardar</button><button class="secondary" onclick="copyText($('#exerciseArea').value)">Copiar</button><button class="secondary" onclick="downloadTxt('${ex.id}.txt',$('#exerciseArea').value+'\n\n--- Solución sugerida ---\n${ex.solution.replace(/`/g,'\\`')}')">Exportar práctica</button></div><details><summary>Ver solución sugerida</summary><pre class="code">${escapeHtml(ex.solution)}</pre><p><strong>Error común:</strong> ${ex.commonMistake}</p></details></article>`)}
function htmlCompare(){shell('HTML correcto e incorrecto',`<div class="grid">${state.htmlLab.comparisons.map(c=>`<article class="card"><h2>${c.title}</h2><h3>A evitar</h3><pre class="code bad">${escapeHtml(c.wrong)}</pre><h3>Mejor opción</h3><pre class="code good">${escapeHtml(c.right)}</pre><p>${c.reason}</p></article>`).join('')}</div>`)}
function htmlSnippets(){shell('Fragmentos copiables',`<div class="grid">${state.htmlLab.snippets.map(s=>`<article class="card"><h2>${s.title}</h2><pre class="code">${escapeHtml(s.code)}</pre><button onclick="copyText(\`${s.code.replace(/`/g,'\\`')}\`)">Copiar fragmento</button><button class="secondary" onclick="downloadTxt('${s.id}.txt',\`${s.code.replace(/`/g,'\\`')}\`)">Descargar TXT</button></article>`).join('')}</div>`)}


function buildGeneratedPage(data){
  const safe=v=>escapeHtml(v||'');
  const url=(data.linkUrl||'#').trim() || '#';
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safe(data.title||'Mi página')}</title>
  </head>
  <body>
    <header>
      <h1>${safe(data.title||'Mi página')}</h1>
      <p>${safe(data.subtitle||'Una página creada con HTML')}</p>
    </header>
    <main>
      <section>
        <h2>Presentación</h2>
        <p>${safe(data.intro||'Escribí aquí una breve presentación.')}</p>
      </section>
      <section>
        <h2>${safe(data.sectionOne||'Primera sección')}</h2>
        <p>${safe(data.sectionOneText||'Contenido de la primera sección.')}</p>
      </section>
      <section>
        <h2>${safe(data.sectionTwo||'Segunda sección')}</h2>
        <p>${safe(data.sectionTwoText||'Contenido de la segunda sección.')}</p>
        <p><a href="${safe(url)}">${safe(data.linkText||'Ver más')}</a></p>
      </section>
    </main>
    <footer>
      <p>Página de práctica creada en HTML Práctico para Principiantes.</p>
    </footer>
  </body>
</html>`;
}
function getBuilderData(){
  const f=$('#pageBuilderForm'); const fd=new FormData(f); const data={}; state.pageBuilder.fields.forEach(x=>data[x.id]=fd.get(x.id)||''); return data;
}
function renderGeneratedPreview(){
  const html=buildGeneratedPage(getBuilderData());
  $('#generatedCode').value=html;
  $('#builderPreview').srcdoc=html;
}
function pageBuilderHome(){
  const saved=state.progress.pageBuilder||{};
  shell('Constructor de página simple',`<div class="grid"><article class="card"><h2>Crear desde cero</h2><p>Completá un formulario y generá una página HTML base.</p><a class="btn" href="#/page-builder/new">Empezar</a></article>${state.pageBuilder.templates.map(t=>`<article class="card"><h2>${t.title}</h2><p>${t.description}</p><p class="muted">Secciones sugeridas: ${t.sections.join(', ')}</p><a class="btn secondary" href="#/page-builder/${t.id}">Usar plantilla</a></article>`).join('')}</div><section class="card"><h2>Historial local</h2><p class="muted">Se guardan solo título, plantilla y fecha.</p><ul>${(state.progress.pageHistory||[]).slice(-6).reverse().map(h=>`<li>${h.title||'Página sin título'} · ${h.template||'sin plantilla'} · ${new Date(h.date).toLocaleString()}</li>`).join('')||'<li>Todavía no hay páginas generadas.</li>'}</ul></section>`)
}
function pageBuilderForm(templateId){
  const t=state.pageBuilder.templates.find(x=>x.id===templateId) || state.pageBuilder.templates[0];
  const saved=state.progress.pageBuilder||{};
  const defaults={title:saved.title||t.title, subtitle:saved.subtitle||'Página creada como práctica HTML', intro:saved.intro||t.description, sectionOne:saved.sectionOne||t.sections[0], sectionOneText:saved.sectionOneText||'Escribí aquí el contenido principal de esta sección.', sectionTwo:saved.sectionTwo||t.sections[1], sectionTwoText:saved.sectionTwoText||'Agregá información complementaria o recursos útiles.', linkText:saved.linkText||'Abrir recurso', linkUrl:saved.linkUrl||'#'};
  shell('Constructor: '+t.title,`<article class="card"><p>Completá los campos. El HTML se genera automáticamente y podés exportarlo como <code>.txt</code> o <code>.html</code>.</p><form id="pageBuilderForm" class="builder-form">${state.pageBuilder.fields.map(field=>`<label><strong>${field.label}</strong><input name="${field.id}" value="${escapeHtml(defaults[field.id]||'')}" placeholder="${escapeHtml(field.placeholder)}"></label>`).join('')}</form><div class="actions"><button onclick="renderGeneratedPreview()">Actualizar vista previa</button><button class="secondary" onclick="const html=$('#generatedCode').value||buildGeneratedPage(getBuilderData()); copyText(html)">Copiar HTML</button><button class="secondary" onclick="downloadTxt('mi_pagina_html.txt',$('#generatedCode').value||buildGeneratedPage(getBuilderData()))">Descargar TXT</button><button class="secondary" onclick="downloadTxt('mi_pagina.html',$('#generatedCode').value||buildGeneratedPage(getBuilderData()))">Descargar HTML</button><button class="secondary" onclick="state.progress.pageBuilder=getBuilderData(); state.progress.pageHistory=(state.progress.pageHistory||[]).concat([{title:state.progress.pageBuilder.title,template:'${t.title}',date:new Date().toISOString()}]); save(); alert('Página guardada en historial local')">Guardar historial</button></div><h3>Código generado</h3><textarea id="generatedCode" class="codearea" rows="16"></textarea><h3>Vista previa</h3><iframe id="builderPreview" class="preview" sandbox></iframe><h3>Consejos</h3><ul>${state.pageBuilder.tips.map(t=>`<li>${t}</li>`).join('')}</ul></article>`);
  $('#pageBuilderForm').addEventListener('input',renderGeneratedPreview); renderGeneratedPreview();
}


function buildLandingPage(data){
  const safe=v=>escapeHtml(v||'');
  const mail=(data.contactEmail||'contacto@ejemplo.com').trim()||'contacto@ejemplo.com';
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safe(data.siteTitle||'Landing page básica')}</title>
  </head>
  <body>
    <header>
      <h1>${safe(data.siteTitle||'Landing page básica')}</h1>
      <p>${safe(data.siteSubtitle||'Una propuesta clara para un público concreto.')}</p>
      <p><a href="#contacto">${safe(data.ctaText||'Quiero saber más')}</a></p>
    </header>
    <main>
      <section aria-labelledby="para-quien">
        <h2 id="para-quien">¿Para quién es?</h2>
        <p>${safe(data.audience||'Personas que quieren aprender o resolver una necesidad concreta.')}</p>
      </section>
      <section aria-labelledby="beneficios">
        <h2 id="beneficios">Beneficios principales</h2>
        <ul>
          <li>${safe(data.benefitOne||'Beneficio principal de la propuesta.')}</li>
          <li>${safe(data.benefitTwo||'Segundo beneficio importante.')}</li>
          <li>${safe(data.benefitThree||'Tercer beneficio concreto.')}</li>
        </ul>
      </section>
      <section aria-labelledby="imagen">
        <h2 id="imagen">Imagen representativa</h2>
        <figure>
          <img src="imagen-ejemplo.jpg" alt="${safe(data.imageAlt||'Imagen representativa de la propuesta')}">
          <figcaption>Reemplazá <code>imagen-ejemplo.jpg</code> por el archivo real de tu proyecto.</figcaption>
        </figure>
      </section>
      <section aria-labelledby="accion">
        <h2 id="accion">Próximo paso</h2>
        <p>La acción principal debe ser simple y visible.</p>
        <p><a href="#contacto">${safe(data.ctaText||'Quiero participar')}</a></p>
      </section>
      <section id="contacto" aria-labelledby="contacto-titulo">
        <h2 id="contacto-titulo">Contacto</h2>
        <form>
          <label for="nombre">Nombre</label>
          <input id="nombre" name="nombre" type="text">
          <label for="mensaje">Mensaje</label>
          <textarea id="mensaje" name="mensaje"></textarea>
          <button type="submit">Enviar consulta</button>
        </form>
        <p>También podés escribir a <a href="mailto:${safe(mail)}">${safe(mail)}</a>.</p>
      </section>
    </main>
    <footer>
      <p>Landing creada como práctica de HTML básico.</p>
    </footer>
  </body>
</html>`;
}
function getLandingData(){
  const f=$('#landingForm'); const fd=new FormData(f); const data={}; state.landingProject.fields.forEach(x=>data[x.id]=fd.get(x.id)||''); return data;
}
function renderLandingPreview(){
  const html=buildLandingPage(getLandingData());
  $('#landingCode').value=html;
  $('#landingPreview').srcdoc=html;
  const checks=reviewLanding(html,getLandingData());
  $('#landingReview').innerHTML=`<h3>Revisión rápida</h3><div class="grid mini-grid">${checks.map(c=>`<div class="mini-card ${c.ok?'ok':'warn'}"><strong>${c.ok?'✓':'!'}</strong> ${c.text}</div>`).join('')}</div>`;
}
function reviewLanding(html,data){
  return [
    {ok:(html.match(/<h1>/g)||[]).length===1,text:'Tiene un único <h1> principal.'},
    {ok:/<header>[\s\S]*<\/header>/.test(html)&&/<main>[\s\S]*<\/main>/.test(html),text:'Usa estructura semántica con header y main.'},
    {ok:/<section[\s\S]*<\/section>/.test(html),text:'Organiza contenido en secciones.'},
    {ok:!!(data.imageAlt||'').trim(),text:'Incluye descripción alt para imagen.'},
    {ok:/<label for=/.test(html),text:'El formulario usa labels asociados.'},
    {ok:!!(data.ctaText||'').trim() && !/clic aquí/i.test(data.ctaText||''),text:'La llamada a la acción es específica.'}
  ];
}
function landingProject(){
  const saved=state.progress.landingProject||{};
  shell('Proyecto guiado: landing page básica',`<div class="grid"><article class="card"><h2>Objetivo</h2><p>${state.landingProject.description}</p><a class="btn" href="#/landing-builder">Abrir constructor guiado</a></article><article class="card"><h2>Pasos del proyecto</h2><ol>${state.landingProject.steps.map(s=>`<li><strong>${s.title}</strong>: ${s.goal}</li>`).join('')}</ol></article><article class="card"><h2>Consejos iniciales</h2><ul>${state.landingProject.starterTips.map(t=>`<li>${t}</li>`).join('')}</ul></article><article class="card"><h2>Historial local</h2><p class="muted">Solo se guardan título y fecha.</p><ul>${(state.progress.landingHistory||[]).slice(-5).reverse().map(h=>`<li>${h.title||'Landing sin título'} · ${new Date(h.date).toLocaleString()}</li>`).join('')||'<li>Todavía no hay landings generadas.</li>'}</ul></article></div>`)
}
function landingBuilder(){
  const saved=state.progress.landingProject||{};
  shell('Constructor guiado de landing',`<article class="card"><p>Completá los campos para generar una landing page semántica. Luego revisá estructura, accesibilidad y exportá el archivo.</p><form id="landingForm" class="builder-form">${state.landingProject.fields.map(field=>`<label><strong>${field.label}</strong><input name="${field.id}" value="${escapeHtml(saved[field.id]||'')}" placeholder="${escapeHtml(field.placeholder)}"></label>`).join('')}</form><div class="actions"><button onclick="renderLandingPreview()">Actualizar vista previa</button><button class="secondary" onclick="const html=$('#landingCode').value||buildLandingPage(getLandingData()); copyText(html)">Copiar HTML</button><button class="secondary" onclick="downloadTxt('landing_page.html',$('#landingCode').value||buildLandingPage(getLandingData()))">Descargar HTML</button><button class="secondary" onclick="downloadTxt('landing_page_revision.txt',buildLandingReport())">Descargar revisión TXT</button><button class="secondary" onclick="state.progress.landingProject=getLandingData(); state.progress.landingHistory=(state.progress.landingHistory||[]).concat([{title:state.progress.landingProject.siteTitle,date:new Date().toISOString()}]); save(); alert('Landing guardada en historial local')">Guardar historial</button></div><h3>Código HTML generado</h3><textarea id="landingCode" class="codearea" rows="18"></textarea><h3>Vista previa</h3><iframe id="landingPreview" class="preview" sandbox></iframe><section id="landingReview" class="review-box"></section><h3>Checklist semántica</h3><ul>${state.landingProject.semanticChecklist.map(x=>`<li>${x}</li>`).join('')}</ul><h3>Checklist de accesibilidad básica</h3><ul>${state.landingProject.accessibilityChecklist.map(x=>`<li>${x}</li>`).join('')}</ul></article>`);
  $('#landingForm').addEventListener('input',renderLandingPreview); renderLandingPreview();
}
function buildLandingReport(){
  const data=getLandingData(); const html=$('#landingCode')?.value||buildLandingPage(data); const checks=reviewLanding(html,data);
  return `REPORTE DE LANDING PAGE BÁSICA\n\nTítulo: ${data.siteTitle||'Sin título'}\nPúblico: ${data.audience||'No indicado'}\n\nRevisión rápida:\n${checks.map(c=>`${c.ok?'OK':'REVISAR'} - ${c.text}`).join('\n')}\n\nPróximo paso sugerido:\nAbrir el archivo .html en navegador, revisar textos reales y luego agregar CSS en la siguiente etapa del aprendizaje.`;
}

function certificate(){shell('Constancia interna',`<div class="card"><h2>Avance: ${pct()}%</h2><p>Constancia no oficial de práctica en HTML básico.</p><button onclick="window.print()">Imprimir / guardar PDF</button></div>`)}
function router(){const [_,route,a,b]=location.hash.split('/'); if(!route) return home(); if(route==='modules')return modules(); if(route==='html-lab')return htmlLab(); if(route==='html-examples')return htmlExamples(); if(route==='html-example')return htmlExample(a); if(route==='html-exercises')return htmlExercises(); if(route==='html-exercise')return htmlExercise(a); if(route==='html-compare')return htmlCompare(); if(route==='html-snippets')return htmlSnippets(); if(route==='page-builder'&&!a)return pageBuilderHome(); if(route==='page-builder')return pageBuilderForm(a); if(route==='landing-project')return landingProject(); if(route==='landing-builder')return landingBuilder(); if(route==='module')return module(a); if(route==='lesson')return lesson(a,b); if(route==='quiz')return quiz(a); if(route==='checklists')return checklists(); if(route==='cases')return cases(); if(route==='case')return caseDetail(a); if(route==='certificate')return certificate(); home();}
async function init(){loadProgress(); state.manifest=await loadJson('src/data/course_manifest.json'); state.course=await loadJson(state.manifest.dataPaths.course); state.checklists=await loadJson(state.manifest.dataPaths.checklists); state.incidents=await loadJson(state.manifest.dataPaths.incidents); state.htmlLab=await loadJson(state.manifest.dataPaths.htmlLab); state.pageBuilder=await loadJson(state.manifest.dataPaths.pageBuilder); state.landingProject=await loadJson(state.manifest.dataPaths.landingProject); nav(); router(); if('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(()=>{});}window.addEventListener('hashchange',router);init().catch(e=>{$('#app').innerHTML='<h1>Error cargando curso</h1><p>'+e.message+'</p>'});

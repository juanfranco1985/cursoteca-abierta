import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const courseFolder = "ux_ui_basico_sitios_apps_v0_6_publica";
const courseRoot = path.join(root, "cursos", courseFolder);
const dataRoot = path.join(courseRoot, "src", "data");
const date = "2026-06-05";
const version = "0.8-profunda-uxui-v1";
const publicationStatus = "publica-profesional-v0.8-reestructuracion-profunda";

const responsibleNote = "Contenido educativo introductorio. No reemplaza investigacion profesional con usuarios, revision experta, soporte oficial ni normativa de accesibilidad aplicable. Si una decision afecta datos personales, salud, dinero, derechos o seguridad, valida con fuentes oficiales y personas competentes.";

const sourceBank = {
  "nng-heuristics": {
    title: "10 Usability Heuristics for User Interface Design",
    organization: "Nielsen Norman Group",
    url: "https://www.nngroup.com/articles/ten-usability-heuristics/",
    use: "Marco para revisar visibilidad del estado, consistencia, control del usuario, prevencion de errores y reduccion de carga cognitiva."
  },
  "wcag-22": {
    title: "Web Content Accessibility Guidelines 2.2",
    organization: "W3C",
    url: "https://www.w3.org/TR/WCAG22/",
    use: "Referencia para decisiones de accesibilidad: contenido perceptible, operable, comprensible y robusto."
  },
  "material-foundations": {
    title: "Material Design 3 Foundations",
    organization: "Google / Material Design",
    url: "https://m3.material.io/foundations",
    use: "Referencia para componentes, color, tipografia, layout, interaccion y sistemas visuales consistentes."
  },
  "apple-hig": {
    title: "Human Interface Guidelines",
    organization: "Apple Developer",
    url: "https://developer.apple.com/design/human-interface-guidelines/",
    use: "Referencia para claridad, feedback, patrones familiares, consistencia de plataforma y experiencia tactil."
  },
  "wai-forms": {
    title: "Forms Tutorial",
    organization: "W3C WAI",
    url: "https://www.w3.org/WAI/tutorials/forms/",
    use: "Referencia practica para labels, ayuda, errores, grupos de campos y formularios accesibles."
  }
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function refs(keys) {
  return uniq(keys).map(key => ({ key, ...sourceBank[key] }));
}

function theorySections(lesson) {
  return [
    { title: "Modelo mental", body: lesson.model },
    { title: "Principio aplicado", body: lesson.principle },
    { title: "Como evaluarlo", body: lesson.evaluate }
  ];
}

function lesson(module, moduleIndex, item, lessonIndex) {
  const id = `m${moduleIndex + 1}-l${lessonIndex + 1}`;
  return {
    id,
    title: item.title,
    keyIdea: item.idea,
    shortTheory: item.summary,
    theorySections: theorySections(item),
    practicalExample: item.example,
    counterExample: item.counter,
    commonMistake: item.mistake,
    whatToDoNow: item.practice,
    alert: item.alert || module.alert,
    keyPoints: item.points,
    references: refs([...(module.refs || []), ...(item.refs || [])]),
    responsibleNote
  };
}

const modules = [
  {
    title: "Investigacion UX y definicion del problema",
    description: "Convierte opiniones sobre una pantalla en problemas observables, tareas, contexto, evidencia e hipotesis de mejora.",
    learningRisk: "Disenar desde gustos personales",
    commercialRisk: "Invertir tiempo en pantallas que no resuelven la tarea real",
    refs: ["nng-heuristics"],
    alert: "No uses datos personales reales en ejercicios. Trabaja con capturas anonimizadas, descripciones o prototipos.",
    lessons: [
      {
        title: "Usuario, tarea y contexto",
        idea: "Una decision UX empieza por una persona, una tarea y un contexto, no por una pantalla aislada.",
        summary: "La teoria base de UX no pregunta primero si algo es lindo, sino quien intenta hacer que, con que limitaciones y que resultado espera. Sin esa triada, el diseno se vuelve decoracion aplicada a supuestos. Una misma interfaz puede funcionar en escritorio y fallar en celular, en apuro, con baja vision o con poca experiencia digital.",
        model: "Piensa la interfaz como una conversacion entre la persona y el sistema. La pantalla ofrece opciones, el usuario interpreta esas opciones desde su objetivo y el contexto modifica cada decision: tiempo disponible, dispositivo, conexion, conocimientos previos y riesgo percibido.",
        principle: "Las heuristicas de usabilidad ayudan a mirar la interfaz desde la tarea: si el estado es visible, el lenguaje coincide con el mundo real y las opciones relevantes aparecen donde la persona las espera, baja la friccion.",
        evaluate: "Define una tarea concreta, por ejemplo 'inscribirme al curso X desde el celular'. Observa si la persona identifica donde empezar, que datos necesita, como confirmar y como volver. Si necesita que alguien le explique la pantalla, hay una deuda UX.",
        example: "En un portal de cursos, una tarjeta con titulo, nivel, duracion y boton 'Empezar' ayuda mas que una tarjeta con solo imagen y una frase general.",
        counter: "Cambiar colores y sombras sin explicar que curso conviene empezar no resuelve el problema de decision del usuario.",
        mistake: "Escribir 'usuario general' y tratar todos los contextos como iguales.",
        practice: "Elige una pantalla del portal y completa una ficha con usuario primario, tarea, contexto, obstaculo y evidencia observable.",
        points: ["Usuario no es publico abstracto: es una persona intentando completar una tarea.", "Contexto incluye dispositivo, tiempo, conocimiento previo y riesgo.", "La mejora se valida con comportamiento, no con opinion estetica.", "Una tarea bien escrita permite probar antes y despues."],
        refs: ["apple-hig"]
      },
      {
        title: "Objetivo de pantalla y promesa",
        idea: "Cada pantalla debe poder explicar que ofrece, que decision pide y cual es el siguiente paso.",
        summary: "Una pantalla pobre mezcla objetivos: informa, vende, pide datos y muestra enlaces sin jerarquia. En UX/UI, el objetivo de pantalla funciona como contrato: la persona debe entender por que esta ahi, que puede hacer y que pasara despues. Si la promesa no coincide con el boton o con el resultado, aumenta la desconfianza.",
        model: "Lee la pantalla como si fuera una frase: sujeto, accion y resultado. Si no puedes resumirla en una linea, probablemente hay demasiados objetivos compitiendo entre si.",
        principle: "La claridad que recomiendan guias de interfaz no significa menos contenido siempre; significa contenido ordenado por prioridad. Un boton principal debe representar la accion que completa la tarea principal.",
        evaluate: "Tapa visualmente todo salvo el titulo y la accion principal. Si una persona no puede anticipar que ocurrira al tocar el boton, el objetivo no esta suficientemente expresado.",
        example: "Una pantalla de curso puede decir 'Aprende UX/UI basico' y ofrecer 'Entrar al modulo 1'. Eso es mas claro que 'Explorar experiencia' con varios botones similares.",
        counter: "Un hero llamativo con tres botones del mismo peso obliga a adivinar cual inicia realmente el curso.",
        mistake: "Definir el objetivo como 'que se vea moderno' en lugar de una accion verificable.",
        practice: "Reescribe el objetivo de una pantalla en una sola frase y elimina o baja de jerarquia las acciones que no apoyan esa frase.",
        points: ["Una pantalla necesita una accion principal.", "La promesa debe coincidir con el resultado posterior.", "Los textos secundarios no deben competir con la tarea.", "El objetivo permite decidir que contenido sobra."],
        refs: ["apple-hig", "material-foundations"]
      },
      {
        title: "Evidencia observable vs opinion",
        idea: "Un hallazgo UX debe describir una friccion observable y su impacto sobre la tarea.",
        summary: "Decir 'la pagina es aburrida' puede ser una senal inicial, pero no alcanza como diagnostico. La teoria UX transforma opinion en evidencia: donde se detuvo la persona, que interpreto mal, que accion omitio, cuanto tardo o que error cometio. Esa evidencia permite priorizar cambios y defender decisiones.",
        model: "Separa tres capas: percepcion, comportamiento e impacto. La percepcion dice que siente la persona; el comportamiento muestra que hizo; el impacto explica que paso con la tarea.",
        principle: "Las revisiones heuristicas y las pruebas con tareas buscan patrones de friccion. Una observacion aislada no obliga a redisenar todo, pero si indica que hay que mirar con metodo.",
        evaluate: "Registra el hallazgo con esta formula: 'Al intentar X, la persona hizo Y, porque interpreto Z, y eso provoco W'. Si falta una parte, aun estas ante una opinion incompleta.",
        example: "Hallazgo util: 'Al buscar el menu principal, la persona uso tres veces Atras porque no habia una ruta visible de regreso'.",
        counter: "Hallazgo debil: 'No me gusta el menu'. No dice tarea, evidencia ni efecto.",
        mistake: "Confundir preferencia personal del evaluador con problema de uso.",
        practice: "Convierte tres opiniones sobre una pantalla en hallazgos con tarea, evidencia e impacto.",
        points: ["La evidencia reduce discusiones de gusto.", "Un hallazgo debe mencionar tarea e impacto.", "La observacion no reemplaza juicio, pero lo ordena.", "La prioridad surge de severidad y frecuencia."],
        refs: ["nng-heuristics"]
      },
      {
        title: "Personas, escenarios y limites",
        idea: "Una persona UX sirve cuando ayuda a decidir contenido, lenguaje, flujo y restricciones.",
        summary: "Las personas no son fichas decorativas con nombre y foto. Son modelos de decision que resumen necesidades, capacidades, motivaciones y limites relevantes para el producto. Para cursos publicos, una persona puede incluir experiencia digital, tiempo disponible, objetivo laboral, tipo de dispositivo y dudas frecuentes.",
        model: "Una persona util responde: que quiere lograr, que sabe, que teme, que recursos tiene y que le impediria avanzar. Si esos datos no cambian ninguna decision de diseno, la persona esta demasiado superficial.",
        principle: "Las guias de interfaz insisten en adaptar lenguaje y patrones a expectativas de uso. Una persona principiante necesita explicaciones, rutas visibles y feedback distinto a una persona experta.",
        evaluate: "Revisa una decision concreta, por ejemplo el texto de un boton. Pregunta si esa persona lo entenderia, si anticiparia el resultado y si tendria una alternativa para recuperarse.",
        example: "Para adultos con poca practica digital, 'Menu principal' puede ser mas claro que un icono sin etiqueta.",
        counter: "Usar una persona llamada 'Juan, 35' sin conectar sus necesidades con navegacion, ayuda o contenido.",
        mistake: "Hacer personas por requisito y no usarlas para tomar decisiones.",
        practice: "Crea dos personas contrastantes para el portal y anota que cambiaria en textos, navegacion y ayudas para cada una.",
        points: ["La persona debe influir en decisiones reales.", "Escenario es tarea mas contexto.", "Los limites ayudan a priorizar accesibilidad y ayuda.", "Evita datos inventados que no afectan el diseno."],
        refs: ["apple-hig", "wcag-22"]
      },
      {
        title: "Mapa de fricciones",
        idea: "Mapear fricciones muestra donde se acumulan dudas, errores y abandonos dentro de una tarea.",
        summary: "Una friccion es cualquier punto donde la persona debe adivinar, retroceder, esperar, corregir o pedir ayuda. El mapa de fricciones ordena esos puntos por etapa de la tarea: entrada, decision, accion, confirmacion y recuperacion. Sirve para no arreglar solo lo visible y olvidar el flujo completo.",
        model: "Imagina la tarea como una cadena. Una pantalla puede verse bien, pero si el enlace anterior no prepara a la persona o la confirmacion posterior no aparece, la experiencia completa falla.",
        principle: "La visibilidad del estado y la prevencion de errores son claves: las personas necesitan saber donde estan, que paso y como corregir sin sentirse atrapadas.",
        evaluate: "Dibuja cinco pasos de la tarea y marca dudas, decisiones, esperas y errores. Prioriza fricciones que bloquean avance o que obligan a usar memoria.",
        example: "En un curso, una friccion aparece cuando la persona termina una leccion y no sabe si debe volver al modulo, seguir o hacer quiz.",
        counter: "Mejorar solo la portada del curso sin mirar el camino entre leccion, quiz, progreso y menu.",
        mistake: "Confundir cantidad de pasos con friccion; a veces un paso extra claro reduce errores.",
        practice: "Mapea la tarea 'entrar, elegir curso, avanzar una leccion y volver al portal' y marca tres fricciones prioritarias.",
        points: ["La friccion puede estar antes o despues de la pantalla.", "No todos los pasos son malos: los pasos ambiguos son el problema.", "Prioriza bloqueos, dudas repetidas y errores costosos.", "El mapa permite decidir cambios pequenos con impacto."],
        refs: ["nng-heuristics"]
      },
      {
        title: "Hipotesis UX y criterio de exito",
        idea: "Una mejora UX debe formularse como hipotesis comprobable, no como promesa vaga.",
        summary: "Cuando el problema esta claro, la solucion todavia es una hipotesis: creemos que al cambiar X, la persona lograra Y con menos friccion. El criterio de exito define como sabremos si eso ocurre. Puede ser tarea completada, menos pasos erroneos, menos dudas o mejor comprension del resultado.",
        model: "Piensa cada cambio como experimento de bajo costo. No necesitas laboratorio para aprender: necesitas una tarea, una version antes, una version despues y una forma honesta de comparar.",
        principle: "La aplicacion de heuristicas funciona mejor cuando se convierte en pruebas observables. 'Mas visible' debe traducirse en comportamiento: encontrar, entender, completar o recuperar.",
        evaluate: "Escribe: 'Si hacemos X, entonces la persona podra Y, porque Z. Lo sabremos si W'. Evita criterios como 'queda mejor' o 'parece profesional'.",
        example: "Si agregamos un boton persistente 'Menu principal', la persona volvera al portal sin usar Atras; lo sabremos si completa la tarea en un intento.",
        counter: "Agregar un boton por intuicion y no comprobar si realmente se usa.",
        mistake: "Medir el exito por cantidad de cambios realizados, no por mejora en la tarea.",
        practice: "Toma una friccion y redacta una hipotesis UX con cambio, resultado esperado, motivo y criterio de exito.",
        points: ["La solucion siempre es una hipotesis hasta probarse.", "El criterio de exito se define antes del rediseño.", "La evidencia antes/despues evita cambios impulsivos.", "Una prueba chica puede orientar decisiones grandes."],
        refs: ["nng-heuristics"]
      }
    ],
    quiz: [
      ["Que convierte una opinion visual en hallazgo UX?", ["Tarea, evidencia observable e impacto", "Un color nuevo", "Una preferencia del equipo", "Una animacion atractiva"], 0],
      ["Que dato falta en un objetivo de pantalla debil?", ["La accion que la persona debe completar", "El nombre interno del proyecto", "La tecnologia usada", "La cantidad de sombras"], 0],
      ["Para que sirve una persona UX bien hecha?", ["Para orientar decisiones de contenido, flujo y ayuda", "Para decorar una presentacion", "Para reemplazar pruebas", "Para justificar cualquier gusto visual"], 0],
      ["Que describe mejor una friccion?", ["Un punto donde la persona duda, se equivoca, retrocede o se bloquea", "Un paso adicional siempre negativo", "Una decision estetica distinta", "Un boton con otro color"], 0],
      ["Como se formula una hipotesis UX util?", ["Cambio propuesto, resultado esperado, motivo y criterio de exito", "Lista de preferencias visuales", "Promesa general de mejora", "Descripcion tecnica sin tarea"], 0]
    ],
    checklist: [
      ["Usuario primario identificado", "Describe quien usa la pantalla y que sabe antes de llegar.", "Anota usuario, experiencia digital, dispositivo probable y limite principal."],
      ["Tarea principal escrita", "La tarea permite probar la interfaz sin explicar verbalmente que hacer.", "Redacta la tarea con verbo, objeto y resultado esperado."],
      ["Contexto de uso considerado", "El contexto anticipa celular, tiempo, conexion, ruido, apuro o baja experiencia.", "Marca tres restricciones que pueden afectar comprension o accion."],
      ["Hallazgo con evidencia", "El problema se describe por comportamiento observado, no por gusto.", "Usa la formula tarea-comportamiento-interpretacion-impacto."],
      ["Friccion priorizada", "No todas las molestias tienen el mismo costo para la persona.", "Ordena hallazgos por bloqueo, frecuencia y riesgo."],
      ["Hipotesis comprobable", "La mejora tiene criterio de exito antes de implementarse.", "Escribe cambio, resultado esperado y prueba minima."]
    ]
  },
  {
    title: "Arquitectura de informacion y navegacion",
    description: "Organiza contenidos, rutas, etiquetas y salidas para que la persona se ubique, elija y vuelva sin depender del boton Atras.",
    learningRisk: "Confundir cantidad de enlaces con buena navegacion",
    commercialRisk: "Abandono por no encontrar cursos, categorias o regreso al inicio",
    refs: ["nng-heuristics", "apple-hig"],
    alert: "La navegacion debe funcionar con teclado y con pantalla pequena; no escondas rutas criticas detras de patrones ambiguos.",
    lessons: [
      {
        title: "Inventario de contenido",
        idea: "No se puede ordenar bien lo que no esta inventariado.",
        summary: "La arquitectura de informacion empieza listando que existe: paginas, cursos, categorias, filtros, estados, documentos y acciones. Un inventario revela duplicados, vacios, nombres inconsistentes y piezas que nadie mantiene. En portales educativos, tambien muestra si todos los cursos tienen la misma profundidad real o solo la misma estructura.",
        model: "Piensa el portal como una biblioteca. Antes de redisenar estanterias, necesitas saber que libros hay, como se llaman, cual es su tema y cuales estan incompletos.",
        principle: "La consistencia reduce carga cognitiva. Si la misma idea aparece con nombres distintos, el usuario debe interpretar en lugar de decidir.",
        evaluate: "Crea una tabla con elemento, proposito, audiencia, estado, ruta y accion principal. Marca contenido repetido, incompleto o sin duenio.",
        example: "El inventario detecta que 'UX/UI Basico' tiene 36 lecciones, pero muchas repiten teoria; eso cambia la prioridad editorial.",
        counter: "Agregar una nueva categoria sin revisar si las existentes ya cubren ese contenido.",
        mistake: "Inventariar solo titulos y no registrar proposito, estado ni accion.",
        practice: "Haz un inventario de diez tarjetas del portal y agrega una columna 'decision que ayuda a tomar'.",
        points: ["Inventario no es catalogo publico: es herramienta de orden.", "Permite detectar duplicacion y contenido pobre.", "Debe incluir estado y accion principal.", "Es base para categorias y navegacion."],
        refs: ["material-foundations"]
      },
      {
        title: "Agrupacion, etiquetas y categorias",
        idea: "Una categoria es buena si ayuda a elegir, no si suena elegante.",
        summary: "Las personas buscan por necesidad, nivel, tema, urgencia o resultado esperado. Las categorias deben reflejar esos modelos mentales. Una etiqueta como 'Productividad' puede ser demasiado amplia; 'Organizar tareas con Notion y Trello' orienta mejor. El objetivo no es crear muchas categorias, sino reducir ambiguedad.",
        model: "Una categoria funciona como una pregunta respondida de antemano: 'donde busco esto?'. Si dos categorias parecen posibles, el sistema obliga al usuario a adivinar.",
        principle: "La correspondencia con el mundo real recomienda usar lenguaje familiar para la audiencia. El vocabulario interno del equipo suele ser menos claro que el vocabulario de la tarea.",
        evaluate: "Da tarjetas de cursos a tres personas y pideles agruparlas. Observa nombres espontaneos, dudas y tarjetas que cambian de grupo.",
        example: "Agrupar por 'Trabajo y empleabilidad', 'Datos', 'Seguridad digital' y 'Desarrollo web' puede ser mas claro que etiquetas tecnicas mezcladas.",
        counter: "Llamar 'soluciones transversales' a cursos para principiantes que buscan algo concreto.",
        mistake: "Crear categorias desde la organizacion interna del proyecto, no desde la decision del estudiante.",
        practice: "Reagrupa doce cursos con criterio de necesidad y compara con las categorias actuales.",
        points: ["La categoria debe reducir duda.", "Las etiquetas deben hablar el idioma del estudiante.", "Una tarjeta puede necesitar etiqueta secundaria.", "Las pruebas de agrupacion revelan modelos mentales."],
        refs: ["nng-heuristics"]
      },
      {
        title: "Navegacion primaria, secundaria y rutas de regreso",
        idea: "La navegacion no solo permite avanzar; tambien permite orientarse y volver.",
        summary: "Una interfaz educativa necesita rutas estables: menu principal, modulos, lecciones, quiz, progreso y regreso al portal. La navegacion primaria contiene destinos esenciales; la secundaria ayuda dentro de una seccion; las rutas de regreso evitan que el usuario dependa del historial del navegador. Esto fue una friccion real del proyecto.",
        model: "Piensa en tres niveles: ubicacion global, ubicacion local y salida. La persona debe saber en que curso esta, en que modulo esta y como volver a una decision anterior.",
        principle: "El control y libertad del usuario es una heuristica central: las personas necesitan deshacer, volver, salir y reorientarse sin quedar atrapadas.",
        evaluate: "Entra a una leccion profunda desde el portal y prueba volver al menu principal sin usar Atras. Si no puedes, falta navegacion global.",
        example: "Un boton visible 'Menu principal' en cursos evita que una persona retroceda pantalla por pantalla hasta la raiz.",
        counter: "Confiar en que el usuario siempre conoce el boton Atras o el logo como ruta de salida.",
        mistake: "Agregar enlaces en exceso sin diferenciar jerarquia primaria y secundaria.",
        practice: "Dibuja la navegacion global y local de un curso. Marca donde aparece inicio, modulo, leccion siguiente, quiz y portal.",
        points: ["La salida es parte del flujo.", "Navegacion global y local cumplen funciones distintas.", "No depender del historial del navegador.", "El boton principal debe ser visible y persistente."],
        refs: ["nng-heuristics", "apple-hig"]
      },
      {
        title: "Busqueda, filtros y estados vacios",
        idea: "Buscar no es solo escribir: es entender que paso con el resultado.",
        summary: "Una busqueda usable informa si encontro, si no encontro, si hay filtros activos y que puede hacer la persona despues. Los estados vacios son momentos pedagogicos: explican el motivo y ofrecen salida. En un portal de cursos, un filtro sin resultados debe proponer borrar filtros, revisar otra categoria o usar terminos sugeridos.",
        model: "La busqueda es una conversacion corta: la persona expresa una intencion, el sistema responde y ambos ajustan. Si el sistema solo muestra 'nada', corta la conversacion.",
        principle: "La visibilidad del estado del sistema y la ayuda contextual reducen incertidumbre. Un estado vacio debe ser informativo, no un castigo visual.",
        evaluate: "Prueba busquedas con terminos esperables, errores comunes y categorias mezcladas. Revisa si el resultado explica cantidad, filtros y siguiente accion.",
        example: "Si se busca 'trabajo remoto' y no hay exacto, mostrar 'Teletrabajo seguro y productivo' como sugerencia relacionada.",
        counter: "Un listado en blanco sin texto ni boton para limpiar filtros.",
        mistake: "Tratar el estado vacio como un caso raro y dejarlo sin diseno.",
        practice: "Escribe tres estados vacios para busqueda: sin resultados, filtro demasiado estrecho y curso no disponible.",
        points: ["El estado vacio tambien es contenido.", "Los filtros activos deben ser visibles.", "Las sugerencias ayudan a recuperar la tarea.", "Buscar debe tolerar lenguaje del usuario."],
        refs: ["nng-heuristics", "material-foundations"]
      },
      {
        title: "Flujo de tarea de punta a punta",
        idea: "La calidad UX se mide en el recorrido completo, no en una pantalla suelta.",
        summary: "Una tarea real atraviesa varias pantallas: descubrir, comparar, elegir, entrar, estudiar, completar y volver. Si cada pantalla se optimiza de forma aislada, pueden aparecer saltos de lenguaje, acciones duplicadas o confirmaciones ausentes. Un flujo de punta a punta revela dependencias que el diseño visual por pantalla no ve.",
        model: "Dibuja el flujo como una historia con inicio, nudo y cierre. El usuario no piensa en componentes; piensa en lograr algo sin perderse.",
        principle: "La consistencia entre pantallas ayuda a reconocer patrones y reduce memoria. Las transiciones deben confirmar que la accion anterior tuvo efecto.",
        evaluate: "Ejecuta una tarea completa y anota cada decision que la persona debe tomar. Marca decisiones innecesarias, ambiguas o sin confirmacion.",
        example: "Elegir un curso, completar una leccion, hacer quiz y ver progreso debe sentirse como una misma ruta, no como cuatro mini apps.",
        counter: "Diseñar una tarjeta de curso perfecta pero olvidar que el quiz no tiene regreso al modulo.",
        mistake: "Validar solo la pantalla inicial porque es la mas visible.",
        practice: "Prueba el flujo completo de un curso y registra un antes/despues de cada friccion encontrada.",
        points: ["Un flujo une pantallas, contenido y estados.", "Las decisiones deben aparecer en el orden correcto.", "La confirmacion cierra la accion.", "Las pantallas no deben cambiar vocabulario sin motivo."],
        refs: ["apple-hig", "material-foundations"]
      },
      {
        title: "Migas, progreso y recuperacion de orientacion",
        idea: "La persona estudia mejor cuando sabe donde esta, que completo y que falta.",
        summary: "En cursos, la orientacion no es un detalle: sostiene motivacion y reduce abandono. Migas, modulo actual, progreso, leccion anterior/siguiente y estado completado ayudan a construir mapa mental. El progreso debe ser honesto: no inflar avance por visitar una pantalla ni ocultar requisitos pendientes.",
        model: "La orientacion combina lugar, avance y proxima accion. Si falta uno, la persona puede seguir, pero con mas esfuerzo mental.",
        principle: "La visibilidad del estado del sistema aplica al aprendizaje: el sistema debe mostrar estado de curso, modulo, evaluacion y checklist.",
        evaluate: "Entra en la mitad de un curso desde un enlace directo. Comprueba si sabes curso, modulo, leccion, avance y forma de volver.",
        example: "Mostrar 'Modulo 3 de 6', 'Leccion 4 de 6' y 'Siguiente: quiz de usabilidad' reduce incertidumbre.",
        counter: "Una barra de progreso sin explicar que esta midiendo.",
        mistake: "Usar progreso como adorno visual sin relacionarlo con acciones reales.",
        practice: "Define que significa progreso para una leccion, un modulo y el curso completo. Escribe como lo comunicarias.",
        points: ["Orientacion incluye ubicacion, avance y proxima accion.", "El progreso debe representar trabajo real.", "Los enlaces directos tambien necesitan contexto.", "Migas y botones no cumplen exactamente la misma funcion."],
        refs: ["nng-heuristics"]
      }
    ],
    quiz: [
      ["Que revela un inventario de contenido ademas de titulos?", ["Proposito, estado, duplicados y accion principal", "Solo el orden visual", "La paleta de colores", "El hosting usado"], 0],
      ["Cuando una categoria funciona bien?", ["Cuando ayuda a elegir con lenguaje familiar", "Cuando suena tecnica", "Cuando hay muchas subcategorias", "Cuando responde al organigrama"], 0],
      ["Por que importa una ruta de regreso?", ["Da control y evita depender del historial del navegador", "Reduce todo el contenido", "Elimina la necesidad de menu", "Hace que todos los botones sean iguales"], 0],
      ["Que debe hacer un estado vacio usable?", ["Explicar que paso y ofrecer una accion siguiente", "Mostrar una pantalla en blanco", "Ocultar filtros", "Cerrar el flujo"], 0],
      ["Que valida un flujo de punta a punta?", ["El recorrido completo entre pantallas y decisiones", "Solo la primera impresion", "Solo el color de botones", "La cantidad de imagenes"], 0]
    ],
    checklist: [
      ["Inventario completo", "Lista piezas, rutas, proposito, estado y accion.", "Completa una tabla con al menos diez elementos."],
      ["Categorias por necesidad", "Agrupa desde la decision del estudiante, no desde nombres internos.", "Prueba dos formas de agrupacion y compara dudas."],
      ["Ruta de regreso visible", "Permite volver al portal o menu principal sin usar Atras.", "Verifica la salida desde portada, modulo, leccion y quiz."],
      ["Filtros explicados", "Muestra resultados, filtros activos y modo de limpiar.", "Escribe el texto para busqueda sin resultados."],
      ["Flujo completo probado", "Evalua la tarea de punta a punta.", "Ejecuta entrar, estudiar, completar y volver."],
      ["Progreso honesto", "Explica que mide y que falta.", "Revisa avance de leccion, quiz y checklist."]
    ]
  },
  {
    title: "Usabilidad e interaccion",
    description: "Aplica heuristicas para revisar estado del sistema, lenguaje, control, errores, consistencia, carga cognitiva y feedback.",
    learningRisk: "Usar heuristicas como lista superficial",
    commercialRisk: "Interfaces que parecen completas pero generan errores repetidos",
    refs: ["nng-heuristics"],
    alert: "Una heuristica no reemplaza observar usuarios; sirve para encontrar riesgos y preparar pruebas mejores.",
    lessons: [
      {
        title: "Heuristicas como marco de revision",
        idea: "Las heuristicas convierten la revision UX en preguntas concretas sobre comportamiento.",
        summary: "Las heuristicas de usabilidad son principios generales para detectar problemas frecuentes. No son reglas mecanicas ni recetas visuales. Funcionan como lentes: estado del sistema, lenguaje familiar, control, consistencia, prevencion de errores, reconocimiento, flexibilidad, diseño minimalista, recuperacion y ayuda.",
        model: "Imagina cada heuristica como una pregunta de auditoria: que sabe la persona ahora?, que espera que pase?, como corrige?, que debe recordar?",
        principle: "El valor no esta en memorizar la lista, sino en conectarla con una tarea real y una consecuencia concreta para el usuario.",
        evaluate: "Selecciona tres heuristicas por pantalla segun el riesgo principal. No intentes revisar todo con la misma intensidad en cada caso.",
        example: "Para una pantalla de formulario, prevencion de errores, ayuda contextual y feedback son mas urgentes que flexibilidad avanzada.",
        counter: "Poner una tabla con diez heuristicas y marcar 'ok' sin evidencia.",
        mistake: "Usar heuristicas para justificar gustos personales.",
        practice: "Audita una leccion del curso con tres heuristicas y redacta un hallazgo por cada una.",
        points: ["Las heuristicas orientan preguntas.", "Deben conectarse con tarea e impacto.", "No sustituyen pruebas con personas.", "Sirven para priorizar riesgos de usabilidad."],
        refs: ["nng-heuristics"]
      },
      {
        title: "Visibilidad del estado del sistema",
        idea: "El sistema debe mostrar que paso, que esta pasando y que falta.",
        summary: "Cuando una persona toca un boton, espera respuesta: carga, exito, error, guardado o proximo paso. La visibilidad del estado evita ansiedad y acciones duplicadas. En cursos, aplica a progreso, leccion completada, quiz guardado, conexion online/offline y descarga disponible.",
        model: "El usuario no ve la logica interna. Solo interpreta señales externas: texto, cambio visual, estado del boton, barra de progreso o mensaje.",
        principle: "La respuesta debe llegar en el momento correcto y con significado claro. Un spinner sin texto puede no explicar si se esta guardando, cargando o fallando.",
        evaluate: "Haz una accion y pregunta: que cambio?, donde se ve?, cuanto dura?, que hago si falla? Si no hay respuesta clara, falta estado.",
        example: "Despues de guardar un quiz, mostrar puntaje, fecha y enlace para seguir estudiando comunica cierre.",
        counter: "Un boton que parece no responder y permite multiples clics durante una accion.",
        mistake: "Confiar solo en cambios sutiles de color para indicar estado.",
        practice: "Lista cinco estados de una app de curso y diseña el mensaje minimo para cada uno.",
        points: ["Todo cambio importante necesita feedback.", "El estado debe ser perceptible y comprensible.", "Progreso, guardado y error son estados distintos.", "No dependas solo del color."],
        refs: ["wcag-22"]
      },
      {
        title: "Correspondencia con lenguaje real",
        idea: "El sistema debe hablar como la persona piensa la tarea.",
        summary: "Una interfaz falla cuando usa palabras internas, tecnicas o ambiguas para acciones simples. La correspondencia con el mundo real pide ordenar informacion con conceptos familiares para la audiencia. En cursos introductorios, terminos como 'ruta', 'modulo', 'leccion' y 'menu principal' pueden ser mas claros que nombres de producto o jerga.",
        model: "El lenguaje es parte de la interfaz. Cada etiqueta crea una expectativa: si dice 'empezar', la persona espera iniciar; si dice 'explorar', espera navegar sin compromiso.",
        principle: "Usar palabras familiares reduce interpretacion y memoria. Cuando hace falta un termino tecnico, se introduce con contexto y ejemplo.",
        evaluate: "Subraya etiquetas y botones. Pregunta a una persona que cree que ocurrira al tocarlos. Si debe adivinar, el texto no cumple.",
        example: "'Volver al menu principal' comunica mejor que 'root' o 'home state' para una persona principiante.",
        counter: "Usar nombres internos de sprint o componente como etiquetas visibles.",
        mistake: "Creer que una palabra corta siempre es mas clara.",
        practice: "Reescribe diez etiquetas de una interfaz para un publico principiante y explica el cambio.",
        points: ["El texto crea expectativas.", "La claridad depende de audiencia y tarea.", "La jerga aumenta carga cognitiva.", "Un termino tecnico puede enseñarse, pero no esconderse."],
        refs: ["nng-heuristics", "apple-hig"]
      },
      {
        title: "Control, libertad y prevencion de errores",
        idea: "Una interfaz madura permite corregir antes de castigar.",
        summary: "Las personas se equivocan: tocan el boton incorrecto, cargan un dato incompleto o entran a una ruta no deseada. El buen UX previene errores previsibles y ofrece recuperacion clara. Control significa poder cancelar, volver, editar, deshacer o confirmar cuando una accion tiene consecuencia.",
        model: "No diseñes para la persona perfecta. Diseña para una persona distraida, con prisa o insegura, y reduce el costo de equivocarse.",
        principle: "Prevencion de errores y libertad del usuario trabajan juntas: primero evitar problemas; si ocurren, permitir recuperarse sin perder trabajo.",
        evaluate: "Identifica acciones irreversibles, datos obligatorios y rutas de salida. Pregunta que pasa si la persona toca mal, borra algo o abandona a mitad.",
        example: "Antes de reiniciar progreso local, pedir confirmacion y explicar que se perdera.",
        counter: "Un boton 'resetear' junto a 'guardar' con mismo peso visual y sin confirmacion.",
        mistake: "Agregar advertencias largas en vez de rediseñar el punto donde ocurre el error.",
        practice: "Elige una accion riesgosa y diseña prevencion, confirmacion y recuperacion.",
        points: ["Los errores previsibles deben prevenirse.", "La recuperacion reduce miedo a explorar.", "Acciones destructivas necesitan confirmacion.", "La salida clara es parte del control."],
        refs: ["nng-heuristics", "wcag-22"]
      },
      {
        title: "Consistencia, reconocimiento y carga cognitiva",
        idea: "La interfaz debe permitir reconocer patrones, no recordar reglas ocultas.",
        summary: "La consistencia no significa que todo se vea igual. Significa que acciones similares se comportan de forma similar y que los patrones aparecen donde la persona los espera. Reconocimiento antes que memoria implica mostrar opciones, estados y ayudas en contexto para que el usuario no dependa de recordar instrucciones previas.",
        model: "Cada inconsistencia obliga a aprender una regla nueva. Una app educativa debe reservar esfuerzo mental para aprender el contenido, no para descifrar la interfaz.",
        principle: "Componentes, estilos y textos consistentes construyen confianza. Las excepciones deben tener motivo y señalizacion clara.",
        evaluate: "Compara botones, tarjetas, formularios y mensajes de error. Si el mismo color o texto significa cosas distintas, hay deuda de consistencia.",
        example: "Todos los cursos usan 'Entrar', 'Quiz', 'Seguir estudiando' y 'Menu principal' con comportamiento estable.",
        counter: "Un boton dorado inicia curso en una pagina, descarga archivo en otra y borra progreso en otra.",
        mistake: "Confundir consistencia con monotonia visual y eliminar jerarquia.",
        practice: "Haz una mini guia de cinco componentes del curso y define uso, texto y estado.",
        points: ["La consistencia reduce aprendizaje de interfaz.", "Reconocer es mas facil que recordar.", "Los componentes necesitan reglas de uso.", "La excepcion debe comunicar por que existe."],
        refs: ["material-foundations", "apple-hig"]
      },
      {
        title: "Feedback, recuperacion y ayuda contextual",
        idea: "La ayuda mas valiosa aparece en el momento exacto de la duda.",
        summary: "La ayuda contextual evita manuales largos para problemas simples. Un buen feedback explica resultado, motivo y siguiente accion. En cursos, puede indicar que una respuesta fue guardada, por que una opcion del quiz es incorrecta o como continuar si no se encuentra un modulo.",
        model: "Feedback no es solo mensaje de exito. Es una pieza de orientacion que cierra el ciclo entre accion de la persona y respuesta del sistema.",
        principle: "La ayuda debe estar cerca de la accion y escrita en lenguaje operativo. Si obliga a salir del flujo para entender un error, llega tarde.",
        evaluate: "Revisa mensajes de exito, error, vacio y espera. Cada uno debe responder: que paso?, por que importa?, que puedo hacer ahora?",
        example: "En quiz, un feedback que explica el criterio enseña mas que 'correcto' o 'incorrecto'.",
        counter: "Mostrar 'error 400' a una persona principiante sin explicacion ni salida.",
        mistake: "Escribir ayuda generica que no menciona el problema real.",
        practice: "Reescribe tres mensajes de error y tres de exito con proxima accion clara.",
        points: ["Feedback cierra el ciclo de interaccion.", "La ayuda debe estar cerca de la duda.", "Un buen error enseña como recuperarse.", "El feedback tambien forma parte del aprendizaje."],
        refs: ["nng-heuristics", "wai-forms"]
      }
    ],
    quiz: [
      ["Como deben usarse las heuristicas?", ["Como preguntas conectadas con tareas y evidencia", "Como reglas visuales absolutas", "Como decoracion de auditoria", "Como reemplazo total de usuarios"], 0],
      ["Que mejora la visibilidad de estado?", ["Mostrar accion, resultado y proximo paso", "Ocultar mensajes", "Usar solo cambios de color", "Evitar confirmaciones"], 0],
      ["Que texto respeta lenguaje real?", ["Uno que la audiencia puede anticipar por su tarea", "Uno que usa nombres internos", "Uno siempre tecnico", "Uno ambiguo pero corto"], 0],
      ["Que combina control y prevencion?", ["Evitar errores previsibles y permitir recuperacion", "Eliminar botones de salida", "Ocultar acciones riesgosas sin explicar", "Confirmar todo siempre"], 0],
      ["Para que sirve la ayuda contextual?", ["Para responder dudas en el momento de la accion", "Para reemplazar toda la interfaz", "Para justificar textos largos", "Para aparecer solo al final"], 0]
    ],
    checklist: [
      ["Heuristicas priorizadas", "Selecciona principios segun riesgo real.", "Elige tres heuristicas para una pantalla especifica."],
      ["Estados visibles", "Toda accion importante tiene respuesta.", "Lista carga, guardado, exito, error y vacio."],
      ["Lenguaje del usuario", "Las etiquetas anticipan resultado.", "Prueba botones con una persona ajena al proyecto."],
      ["Errores prevenidos", "El diseño evita errores previsibles.", "Agrega restricciones, confirmacion o ayudas donde corresponda."],
      ["Patrones consistentes", "Acciones similares se ven y se comportan parecido.", "Documenta cinco componentes y su uso."],
      ["Ayuda en contexto", "Los mensajes explican que paso y que hacer.", "Reescribe un error tecnico como instruccion clara."]
    ]
  },
  {
    title: "UI visual, componentes y respuesta en pantalla",
    description: "Construye jerarquia, lectura, color, componentes, layout responsivo y estados de interfaz al servicio de la tarea.",
    learningRisk: "Creer que UI es solo estetica",
    commercialRisk: "Pantallas atractivas pero dificiles de leer, tocar o mantener",
    refs: ["material-foundations", "apple-hig"],
    alert: "La estetica nunca debe sacrificar legibilidad, contraste, foco, tamano tactil ni comprension.",
    lessons: [
      {
        title: "Jerarquia visual y escaneo",
        idea: "La jerarquia visual guia la mirada hacia decisiones, no hacia adornos.",
        summary: "Una pantalla usable organiza importancia mediante tamaño, peso, posicion, espacio, contraste y agrupacion. La persona escanea antes de leer: busca titulo, accion, estado y opciones. Si todo compite por atencion, nada orienta. La jerarquia convierte contenido en recorrido visual.",
        model: "Piensa la pantalla como una ruta de lectura: primero comprendo donde estoy, luego que puedo hacer, despues detalles y opciones secundarias.",
        principle: "Los sistemas de diseño usan escala, espaciado y componentes para crear estructura repetible. La jerarquia debe mantenerse en desktop y mobile.",
        evaluate: "Mira la pantalla durante cinco segundos. Anota lo primero que viste, lo segundo y lo que ignoraste. Compara con la prioridad real de la tarea.",
        example: "En una leccion, titulo, idea clave y boton siguiente deben tener mas presencia que enlaces legales o textos de soporte.",
        counter: "Tarjetas con todos los textos del mismo tamaño, multiples botones iguales y sin foco principal.",
        mistake: "Aumentar tamaño de todo para que 'se note' y destruir la prioridad.",
        practice: "Rediseña una tarjeta de curso definiendo primer, segundo y tercer nivel de lectura.",
        points: ["La jerarquia ordena atencion.", "Espacio y peso comunican importancia.", "No todo puede ser primario.", "El escaneo rapido revela problemas de prioridad."],
        refs: ["material-foundations"]
      },
      {
        title: "Tipografia, lectura y ritmo",
        idea: "La tipografia es una herramienta de comprension, no solo de personalidad visual.",
        summary: "La lectura mejora cuando el tamaño, longitud de linea, interlineado y contraste acompañan el contenido. En teoria de cursos, parrafos demasiado cortos pueden ser superficiales, pero parrafos largos sin estructura cansan. El ritmo combina resumen, bloques, listas y ejemplos para sostener aprendizaje.",
        model: "Piensa la teoria como capas: resumen para orientar, bloque conceptual para profundizar, ejemplo para concretar y checklist para aplicar.",
        principle: "Las guias visuales recomiendan tipografia consistente y jerarquias claras. Cambiar fuentes o pesos sin criterio aumenta ruido.",
        evaluate: "Lee un bloque en celular. Si pierdes la linea, si el texto se aplasta o si no se distingue seccion, hay problema de ritmo.",
        example: "Separar 'modelo mental', 'principio aplicado' y 'como evaluarlo' hace mas digerible una leccion profunda.",
        counter: "Un unico parrafo extenso con teoria, ejemplo, advertencia y ejercicio mezclados.",
        mistake: "Usar tamaño hero dentro de tarjetas compactas o textos minimos en parrafos densos.",
        practice: "Toma una leccion generica y reorganizala en resumen, tres bloques y cuatro conceptos clave.",
        points: ["Tipografia sostiene comprension.", "La longitud de linea importa.", "Los bloques ayudan a estudiar teoria profunda.", "El ritmo evita tanto pobreza como saturacion."],
        refs: ["material-foundations", "wcag-22"]
      },
      {
        title: "Color, contraste y semantica",
        idea: "El color debe comunicar estado y prioridad sin ser la unica pista.",
        summary: "El color puede guiar, agrupar y alertar, pero mal usado genera confusion o inaccesibilidad. Contraste suficiente, estados diferenciados y significado estable son requisitos de calidad. En un curso, un color de alerta no deberia usarse tambien para acciones positivas.",
        model: "Asigna funciones al color: accion principal, informacion, advertencia, peligro, exito y fondo. Luego comprueba que esas funciones se mantienen.",
        principle: "WCAG trata el contraste y el uso no exclusivo del color como parte de la accesibilidad. Material tambien separa roles de color para evitar ambiguedad.",
        evaluate: "Revisa una pantalla en escala de grises o con bajo contraste. Si pierdes estados o jerarquia, dependias demasiado del color.",
        example: "Un quiz puede mostrar feedback con texto, icono/etiqueta y color, no solo verde o rojo.",
        counter: "Usar dorado para boton principal, advertencia, enlace, progreso y decoracion sin distincion.",
        mistake: "Elegir paleta por gusto sin asignar significado funcional.",
        practice: "Define una tabla de roles de color para un curso y revisa dos pantallas contra esa tabla.",
        points: ["El color necesita rol funcional.", "El contraste afecta acceso y lectura.", "No uses color como unica señal.", "Los estados deben ser consistentes."],
        refs: ["wcag-22", "material-foundations"]
      },
      {
        title: "Componentes, patrones y consistencia visual",
        idea: "Un componente es una decision repetible con reglas, no un bloque copiado.",
        summary: "Botones, tarjetas, alertas, inputs y barras de progreso deben tener variantes claras. Un componente bien definido incluye proposito, estados, contenido minimo, comportamiento y limites. Esto permite mantener 50 cursos sin rediseñar cada pantalla a mano y evita que cada tanda invente una UI distinta.",
        model: "Piensa en componentes como piezas de una caja de herramientas. Cada pieza sirve para algo especifico; si usas martillo para todo, rompes el sistema.",
        principle: "Los sistemas de diseño documentan fundamentos y componentes para sostener consistencia a escala. La consistencia visual ayuda a aprender la interfaz una vez.",
        evaluate: "Elige tres cursos y compara sus botones principales. Si texto, color y comportamiento cambian sin motivo, el componente no esta gobernado.",
        example: "Una tarjeta de curso requiere titulo, categoria, nivel, descripcion concreta, progreso o estado y accion principal.",
        counter: "Tarjetas con diferente estructura segun quien las edito, aunque representen el mismo tipo de contenido.",
        mistake: "Crear variantes visuales nuevas para resolver problemas de contenido pobre.",
        practice: "Documenta un componente tarjeta: campos obligatorios, variantes, estados y errores a evitar.",
        points: ["Los componentes tienen reglas.", "La consistencia facilita mantenimiento.", "Un componente no arregla contenido generico.", "Las variantes deben responder a necesidades reales."],
        refs: ["material-foundations", "apple-hig"]
      },
      {
        title: "Layout responsivo y tactil",
        idea: "Una interfaz no es responsive solo porque entra en la pantalla.",
        summary: "El layout responsivo reorganiza prioridad, lectura y controles segun espacio y forma de interaccion. En celular, botones necesitan tamaño tactil, textos no deben quedar comprimidos y la navegacion debe ser accesible sin punteria fina. Responsive implica decidir que cambia y que se conserva.",
        model: "No pienses en achicar desktop. Piensa en recomponer la tarea para pantallas pequeñas: que se ve primero, que queda abajo y que accion debe seguir disponible.",
        principle: "Las guias de plataforma cuidan objetivos tactiles, zonas de interaccion y patrones familiares. WCAG tambien exige operabilidad sin depender de precision excesiva.",
        evaluate: "Prueba en 320px de ancho, con zoom y teclado. Si botones se cortan, textos se superponen o la accion se pierde, el layout falla.",
        example: "En mobile, la navegacion puede apilar botones a ancho completo para evitar textos apretados y targets pequeños.",
        counter: "Una grilla de cuatro columnas que solo se estrecha hasta hacer ilegibles las tarjetas.",
        mistake: "Usar tamaño de letra dependiente del viewport y generar saltos impredecibles.",
        practice: "Revisa una pantalla en desktop y mobile. Anota que prioridad cambia y que controles deben mantener tamaño estable.",
        points: ["Responsive reorganiza, no solo achica.", "El tacto requiere objetivos comodos.", "El texto no debe cortarse ni superponerse.", "La accion principal debe seguir visible."],
        refs: ["apple-hig", "wcag-22"]
      },
      {
        title: "Estados de componentes",
        idea: "Un componente incompleto falla justo cuando la persona necesita respuesta.",
        summary: "Los componentes tienen estados: normal, hover, foco, activo, deshabilitado, cargando, error, exito y vacio. Diseñar solo el estado ideal deja huecos en la experiencia. En cursos, estados de leccion completada, quiz guardado, checklist marcado y conexion offline son parte del producto.",
        model: "Cada componente vive en el tiempo. Antes, durante y despues de la accion debe comunicar algo distinto.",
        principle: "Visibilidad de estado, feedback y accesibilidad se cruzan en los estados de componentes. El foco visible es tan importante como el hover, porque no todos usan mouse.",
        evaluate: "Lista estados de un boton, tarjeta y campo. Comprueba si cada estado se percibe con texto, forma, posicion o atributo, no solo color.",
        example: "Una tarjeta de leccion completada puede mostrar etiqueta 'Completada', cambio visual y conservar enlace para repasar.",
        counter: "Un boton deshabilitado sin explicar por que no se puede usar.",
        mistake: "Diseñar hover y olvidar foco de teclado.",
        practice: "Dibuja estados de un boton 'Guardar progreso' y escribe el mensaje de cada uno.",
        points: ["Los estados son parte del diseño.", "El foco visible es obligatorio para teclado.", "Deshabilitado debe explicar condicion cuando afecte la tarea.", "Exito y error necesitan proxima accion."],
        refs: ["wcag-22", "nng-heuristics"]
      }
    ],
    quiz: [
      ["Que organiza la jerarquia visual?", ["La prioridad de lectura y accion", "La cantidad de decoracion", "El color favorito", "La tecnologia del frontend"], 0],
      ["Que mejora la lectura teorica profunda?", ["Resumen, bloques, ejemplos y listas con ritmo", "Un parrafo unico enorme", "Texto minimo siempre", "Cambios aleatorios de fuente"], 0],
      ["Que criterio de color es accesible?", ["No depender solo del color y asegurar contraste", "Usar rojo y verde sin texto", "Aplicar un color a todo", "Evitar etiquetas"], 0],
      ["Que define un componente completo?", ["Proposito, contenido, estados, comportamiento y limites", "Solo su borde", "Solo una captura", "Solo su color"], 0],
      ["Que significa responsive real?", ["Reorganizar prioridad y controles segun pantalla e interaccion", "Achicar todo", "Eliminar contenido teorico", "Usar columnas fijas"], 0]
    ],
    checklist: [
      ["Jerarquia escaneable", "La prioridad se percibe en cinco segundos.", "Marca primer, segundo y tercer foco visual."],
      ["Lectura comoda", "La teoria se estructura en capas.", "Revisa ancho de linea, interlineado y bloques."],
      ["Roles de color", "Cada color tiene funcion estable.", "Define accion, exito, alerta, peligro e informacion."],
      ["Componentes documentados", "Cada componente tiene reglas y variantes.", "Describe tarjeta, boton, alerta, input y progreso."],
      ["Mobile probado", "La pantalla se recompone sin cortar texto.", "Prueba 320px, zoom y teclado."],
      ["Estados completos", "Los componentes responden antes, durante y despues.", "Lista estados de boton, tarjeta y formulario."]
    ]
  },
  {
    title: "Accesibilidad, formularios y contenido usable",
    description: "Aplica criterios de accesibilidad, estructura, foco, formularios, microcopy y privacidad para que mas personas puedan usar el curso.",
    learningRisk: "Tratar accesibilidad como agregado final",
    commercialRisk: "Excluir usuarios y crear barreras evitables en tareas simples",
    refs: ["wcag-22", "wai-forms"],
    alert: "No presentes accesibilidad como favor o extra. Es parte de la calidad basica de una interfaz publica.",
    lessons: [
      {
        title: "WCAG como marco de calidad",
        idea: "Accesibilidad es diseñar para que el contenido sea perceptible, operable, comprensible y robusto.",
        summary: "WCAG organiza accesibilidad en principios que sirven como control de calidad. No se trata solo de lectores de pantalla: incluye contraste, teclado, estructura, alternativas, movimiento, errores, foco, lenguaje y compatibilidad. Para cursos publicos, aplicar WCAG mejora uso para personas con discapacidades y tambien para usuarios en contextos dificiles.",
        model: "Piensa cada barrera como una puerta cerrada. Si alguien no puede percibir, operar, entender o usar tecnicamente el contenido, la experiencia queda incompleta.",
        principle: "Los cuatro principios de WCAG ayudan a revisar desde la persona: puede verlo u oirlo?, puede operar?, entiende?, funciona con tecnologias distintas?",
        evaluate: "Elige una pantalla y revisala con teclado, zoom, contraste y lectura de estructura. Anota barreras por principio.",
        example: "Un boton visible, con texto claro, foco de teclado y contraste suficiente cubre varias necesidades a la vez.",
        counter: "Una interfaz bonita que solo funciona con mouse y contraste bajo.",
        mistake: "Esperar al final para 'pasar accesibilidad' cuando ya esta todo diseñado.",
        practice: "Revisa una leccion con los cuatro principios de WCAG y escribe una mejora por principio.",
        points: ["Accesibilidad es calidad de producto.", "WCAG no se limita a discapacidad visual.", "Los principios ayudan a auditar barreras.", "Diseñar accesible desde el inicio evita retrabajo."],
        refs: ["wcag-22"]
      },
      {
        title: "Alternativas, estructura y orden",
        idea: "La estructura semantica permite entender una pantalla mas alla de su apariencia visual.",
        summary: "Titulos, listas, labels, textos alternativos y orden de lectura ayudan a personas y tecnologias de asistencia. Una pantalla que visualmente parece ordenada puede ser confusa si el HTML o el orden de foco no respeta la tarea. En cursos, cada leccion necesita encabezados claros y contenido agrupado por sentido.",
        model: "Imagina la pantalla sin estilos. Si aun puedes entender jerarquia, secciones y acciones, la estructura tiene buena base.",
        principle: "La accesibilidad robusta requiere que contenido y controles tengan significado programatico, no solo apariencia visual.",
        evaluate: "Navega con teclado y revisa el orden de encabezados. Si salta de modo ilogico o el link no describe destino, hay deuda estructural.",
        example: "Usar h1 para titulo de leccion, h2 para teoria y listas para conceptos clave ayuda a lectura asistida.",
        counter: "Crear titulos grandes con divs sin semantica y enlaces llamados 'ver mas'.",
        mistake: "Pensar que el orden visual siempre coincide con el orden de lectura.",
        practice: "Toma una pantalla y escribe su estructura en forma de esquema de encabezados.",
        points: ["La semantica comunica estructura.", "El orden de foco debe seguir la tarea.", "Los textos alternativos deben aportar informacion.", "Los links necesitan destino comprensible."],
        refs: ["wcag-22"]
      },
      {
        title: "Formularios accesibles",
        idea: "Un formulario accesible reduce dudas antes, durante y despues del envio.",
        summary: "Los formularios requieren labels persistentes, instrucciones cercanas, campos agrupados, errores especificos y confirmacion. El placeholder no reemplaza al label porque desaparece al escribir. En cursos o inscripciones, pedir datos minimos y explicar para que se usan reduce carga y desconfianza.",
        model: "Un formulario es una entrevista estructurada. Cada pregunta debe tener motivo, formato esperado y forma de corregir.",
        principle: "W3C WAI recomienda asociar labels, ayudas y errores con los campos correspondientes para que todos puedan operar el formulario.",
        evaluate: "Intenta completar el formulario solo con teclado y luego con errores deliberados. Revisa si sabes que corregir y donde.",
        example: "Campo 'Email' con label visible, ayuda 'lo usaremos para enviarte la constancia' y error 'inclui @ y dominio'.",
        counter: "Campos obligatorios sin marca, placeholder como unica guia y error global 'datos invalidos'.",
        mistake: "Agregar mas texto arriba del formulario en vez de ayudar campo por campo.",
        practice: "Rediseña un formulario de inscripcion con labels, ayudas, errores y confirmacion posterior.",
        points: ["El label no debe desaparecer.", "Cada error debe indicar campo y accion.", "Pide solo datos necesarios.", "La confirmacion cierra la tarea."],
        refs: ["wai-forms", "wcag-22"]
      },
      {
        title: "Foco, teclado y movimiento",
        idea: "Si una interfaz no funciona sin mouse, no esta completa.",
        summary: "Muchas personas navegan con teclado, switch, lector de pantalla o combinaciones de tecnologias. El foco visible indica donde esta la accion actual. El movimiento excesivo puede distraer o afectar a personas sensibles. Una UI responsable permite operar controles, saltar contenido repetido y reducir movimiento cuando sea necesario.",
        model: "El foco es el cursor de quienes no usan mouse. Si no se ve, la persona esta navegando a ciegas.",
        principle: "WCAG incluye criterios sobre teclado, foco visible, orden de foco y movimiento. No son extras: definen operabilidad.",
        evaluate: "Guarda el mouse y recorre la pantalla con Tab, Enter, Shift+Tab y Escape cuando aplique. Debes poder llegar, entender y salir.",
        example: "Botones de leccion anterior/siguiente con foco visible y orden logico permiten estudiar sin mouse.",
        counter: "Menu que abre solo con hover y no se puede usar con teclado.",
        mistake: "Diseñar estados hover y olvidar estados focus.",
        practice: "Audita un curso usando solo teclado y anota tres interrupciones de flujo.",
        points: ["El foco visible es orientacion.", "Todos los controles deben operar con teclado.", "El orden debe seguir la tarea.", "El movimiento debe poder reducirse si afecta."],
        refs: ["wcag-22"]
      },
      {
        title: "Microcopy, errores y confirmaciones",
        idea: "El microcopy guia decisiones pequenas que sostienen la tarea completa.",
        summary: "Microcopy son textos breves en botones, ayudas, errores, estados y confirmaciones. Su trabajo es reducir incertidumbre. Un buen error no culpa: explica que paso, donde, por que importa y como corregir. Una buena confirmacion deja claro que la accion termino y que se puede hacer despues.",
        model: "Cada texto pequeño responde una pregunta silenciosa: que es esto?, por que me lo piden?, que pasa si lo hago?, como corrijo?",
        principle: "La comprensibilidad de WCAG y la ayuda contextual de usabilidad se encuentran en mensajes claros, especificos y accionables.",
        evaluate: "Busca textos genericos como 'error', 'continuar', 'mas' o 'enviar'. Reescribelos con objeto y resultado.",
        example: "'Guardar progreso' es mas claro que 'Aceptar' cuando el resultado es persistir avance local.",
        counter: "Mensaje 'fallo inesperado' sin explicar si se perdieron datos o como reintentar.",
        mistake: "Hacer microcopy simpatico pero impreciso.",
        practice: "Reescribe cinco botones y cinco mensajes de error con accion y resultado.",
        points: ["El microcopy reduce dudas.", "Los errores deben ser especificos y recuperables.", "Las confirmaciones cierran acciones.", "El tono no debe sacrificar precision."],
        refs: ["nng-heuristics", "wcag-22"]
      },
      {
        title: "Inclusion, privacidad y datos minimos",
        idea: "Una interfaz inclusiva tambien respeta datos, contexto y vulnerabilidad de la persona.",
        summary: "UX responsable evita pedir datos innecesarios, exponer informacion sensible o hacer suposiciones sobre identidad, capacidad o contexto. En cursos publicos, muchas practicas pueden hacerse con datos ficticios. La privacidad no es solo legalidad: tambien influye en confianza y disposicion a aprender.",
        model: "Cada dato pedido crea una carga: explicar, confiar, recordar y arriesgar. Si el dato no mejora la tarea, probablemente sobra.",
        principle: "La accesibilidad y la claridad se complementan con minimizacion de datos y lenguaje respetuoso. La persona debe entender por que se pide algo.",
        evaluate: "Lista todos los datos que pide una pantalla y responde: para que se usa?, es obligatorio?, puede simularse?, como se protege?",
        example: "En ejercicios de UX, usar capturas anonimizadas o pantallas simuladas evita exponer usuarios reales.",
        counter: "Pedir nombre, telefono y documento para una practica que solo necesita un ejemplo ficticio.",
        mistake: "Confundir personalizacion con pedir datos de mas.",
        practice: "Revisa una actividad del curso y reemplaza datos reales por datos simulados seguros.",
        points: ["Pedir menos datos reduce riesgo.", "La finalidad debe ser comprensible.", "Los ejercicios pueden usar datos ficticios.", "La inclusion incluye tono, privacidad y contexto."],
        refs: ["wcag-22"]
      }
    ],
    quiz: [
      ["Que resumen correcto da WCAG?", ["Contenido perceptible, operable, comprensible y robusto", "Solo colores bonitos", "Solo lectores de pantalla", "Solo reglas para expertos"], 0],
      ["Por que importa la estructura semantica?", ["Permite entender jerarquia y operar con tecnologias distintas", "Hace que todo se vea igual", "Elimina necesidad de contenido", "Solo mejora SEO"], 0],
      ["Que formulario es mas accesible?", ["Labels visibles, ayudas, errores especificos y datos minimos", "Placeholders como unica guia", "Error global generico", "Campos sin explicacion"], 0],
      ["Que prueba revela problemas de foco?", ["Navegar toda la tarea solo con teclado", "Mirar la paleta", "Cambiar la imagen", "Contar iconos"], 0],
      ["Que dato conviene pedir?", ["Solo el necesario para completar o mejorar la tarea", "Todo dato disponible", "Datos reales para cualquier practica", "Datos sensibles sin finalidad"], 0]
    ],
    checklist: [
      ["Principios WCAG revisados", "Perceptible, operable, comprensible y robusto aparecen en la auditoria.", "Marca una barrera por principio."],
      ["Estructura semantica", "Encabezados, listas y enlaces tienen sentido.", "Revisa la pantalla sin estilos o como esquema."],
      ["Formulario con labels", "Cada campo tiene label persistente y ayuda cuando hace falta.", "Prueba errores deliberados."],
      ["Teclado completo", "Se puede llegar, operar y salir sin mouse.", "Recorre con Tab y Shift+Tab."],
      ["Mensajes accionables", "Errores y confirmaciones explican proxima accion.", "Reescribe mensajes genericos."],
      ["Datos minimos", "Cada dato pedido tiene finalidad clara.", "Elimina o simula datos innecesarios."]
    ]
  },
  {
    title: "Prototipado, pruebas e iteracion",
    description: "Valida cambios con prototipos, tareas, pruebas simples, sintesis de hallazgos, priorizacion y documentacion.",
    learningRisk: "Confundir prototipo con producto terminado",
    commercialRisk: "Escalar decisiones no probadas y repetir errores en muchos cursos",
    refs: ["nng-heuristics", "material-foundations"],
    alert: "Una prueba chica no demuestra verdad absoluta; reduce incertidumbre y ayuda a decidir el siguiente paso.",
    lessons: [
      {
        title: "Prototipos de baja fidelidad",
        idea: "Un prototipo barato permite aprender antes de invertir en detalle visual o codigo.",
        summary: "La baja fidelidad sirve para probar estructura, flujo y lenguaje sin distraerse con colores o animaciones. Puede ser papel, esquema, wireframe o HTML simple. Su valor esta en exponer supuestos temprano: que espera la persona, donde busca, que entiende y que no necesita.",
        model: "Prototipar es pensar con una version incompleta. No busca impresionar; busca hacer preguntas mejores.",
        principle: "Antes de pulir componentes, conviene validar tarea y arquitectura. Un diseño visual avanzado puede ocultar problemas de flujo.",
        evaluate: "Usa el prototipo para una tarea concreta. Si la persona no sabe por donde empezar, el problema no es la fidelidad sino la estructura.",
        example: "Un wireframe de portal con categorias y boton 'Menu principal' puede validar navegacion antes de rediseñar estilos.",
        counter: "Esperar a tener UI final para descubrir que la persona no entiende el camino.",
        mistake: "Defender el prototipo como si fuera producto final.",
        practice: "Dibuja en papel una version alternativa de modulo/leccion/quiz y prueba una tarea con otra persona.",
        points: ["Baja fidelidad reduce costo de aprendizaje.", "Sirve para probar estructura y flujo.", "No necesita parecer final.", "Debe estar atado a una tarea."],
        refs: ["nng-heuristics"]
      },
      {
        title: "Prototipo navegable y supuestos",
        idea: "Un prototipo navegable prueba decisiones entre pantallas.",
        summary: "Cuando la pregunta es de flujo, una imagen estatica no alcanza. Un prototipo navegable permite comprobar entradas, salidas, retrocesos, estados y continuidad de lenguaje. Tambien deja visibles los supuestos: que ruta espera la persona, que boton usara, que informacion necesita antes de decidir.",
        model: "Cada enlace del prototipo representa una hipotesis sobre el camino mental del usuario.",
        principle: "La consistencia de patrones y la visibilidad de estado deben observarse a traves de pantallas, no solo en una vista aislada.",
        evaluate: "Define supuestos antes de probar: 'usara filtro', 'volvera al modulo', 'entendera progreso'. Luego mira si ocurren.",
        example: "Un prototipo con portal, curso, modulo, leccion y regreso al portal prueba la navegacion real.",
        counter: "Probar solo una captura de la portada y concluir que el curso es usable.",
        mistake: "Agregar interacciones sin saber que supuesto validan.",
        practice: "Escribe cinco supuestos de un flujo de curso y arma un prototipo simple para probarlos.",
        points: ["La navegacion revela problemas invisibles en capturas.", "Cada enlace debe tener proposito.", "Los supuestos se escriben antes de observar.", "El prototipo debe cubrir entrada, accion y salida."],
        refs: ["material-foundations", "apple-hig"]
      },
      {
        title: "Prueba moderada de tareas",
        idea: "Una prueba simple observa comportamiento, no opiniones abstractas.",
        summary: "Una prueba moderada puede hacerse con pocas personas si la tarea esta bien definida. El moderador presenta contexto, pide realizar una accion y evita explicar la interfaz. Se observa donde la persona duda, que interpreta y que necesita para avanzar. No se busca aprobar el diseño, se busca aprender.",
        model: "La tarea es el instrumento de medicion. Si la tarea es vaga, los hallazgos seran vagos.",
        principle: "Las heuristicas anticipan problemas; la prueba muestra como aparecen en conducta real.",
        evaluate: "Define exito, dudas esperadas, tiempo aproximado y errores criticos. Registra conducta antes de pedir opiniones.",
        example: "Tarea: 'Encuentra el curso UX/UI, entra a la leccion 2 del modulo 3 y vuelve al menu principal'.",
        counter: "Preguntar 'te gusta la pagina?' como unica prueba.",
        mistake: "Ayudar durante la prueba y borrar evidencia de friccion.",
        practice: "Prepara un guion de cinco tareas para el portal y pruebalo con una persona.",
        points: ["La prueba observa acciones.", "El moderador no debe enseñar la interfaz.", "Pocas pruebas bien hechas ya revelan patrones.", "La opinion se recoge despues de la tarea."],
        refs: ["nng-heuristics"]
      },
      {
        title: "Sintesis de hallazgos",
        idea: "La sintesis convierte observaciones sueltas en decisiones priorizadas.",
        summary: "Despues de probar, aparecen notas, comentarios, errores y dudas. La sintesis agrupa hallazgos por patron, impacto y evidencia. Sin sintesis, el equipo puede sobrerreaccionar a una anecdota o ignorar problemas repetidos. Un buen hallazgo incluye tarea, evidencia, severidad, causa probable y recomendacion.",
        model: "No confundas dato con decision. La observacion es materia prima; la sintesis explica que significa y que conviene hacer.",
        principle: "Priorizar por impacto en la tarea evita gastar energia en detalles visuales de baja consecuencia.",
        evaluate: "Agrupa observaciones similares y pregunta: bloquea?, retrasa?, confunde?, afecta a muchas personas?, tiene riesgo legal/accesible?",
        example: "Tres personas usan Atras para volver al portal: patron de navegacion global insuficiente.",
        counter: "Cambiar todo porque una persona dijo que prefiere otro color.",
        mistake: "Presentar transcripcion completa sin interpretacion ni prioridad.",
        practice: "Toma cinco observaciones y conviertelas en dos hallazgos con severidad y recomendacion.",
        points: ["Sintesis no es copiar notas.", "Un patron pesa mas que una anecdota.", "La severidad depende de tarea e impacto.", "Cada hallazgo necesita recomendacion verificable."],
        refs: ["nng-heuristics"]
      },
      {
        title: "Priorizar por impacto, esfuerzo y riesgo",
        idea: "No toda mejora valiosa debe hacerse primero.",
        summary: "La priorizacion ordena cambios segun impacto en la tarea, esfuerzo tecnico/editorial y riesgo de no resolverlo. En este proyecto, profundizar teoria generica tiene alto impacto, pero debe hacerse por familias y fuentes para evitar otra tanda superficial. La navegacion critica puede tener menor esfuerzo y alto impacto inmediato.",
        model: "Piensa en una matriz: alto impacto y bajo esfuerzo primero; alto impacto y alto esfuerzo se planifica; bajo impacto se pospone.",
        principle: "La calidad UX combina criterio de usuario y criterio operativo. Una solucion imposible de mantener puede empeorar el sistema a largo plazo.",
        evaluate: "Para cada hallazgo, puntua impacto, esfuerzo, riesgo, evidencia y dependencia. Ordena por valor real, no por entusiasmo.",
        example: "Agregar fuentes y bloques teoricos al piloto UX/UI valida el modelo antes de reescribir 50 cursos.",
        counter: "Reescribir todo rapido con plantillas nuevas y volver a generar contenido generico.",
        mistake: "Priorizar lo mas visible aunque no sea lo que bloquea la tarea.",
        practice: "Crea una matriz de cinco mejoras del portal y decide que hacer en la siguiente tanda.",
        points: ["Impacto y esfuerzo deben verse juntos.", "El riesgo de no actuar tambien cuenta.", "Pilotos reducen incertidumbre antes de escalar.", "La mantenibilidad es parte de la decision UX."],
        refs: ["material-foundations"]
      },
      {
        title: "Documentar decisiones y handoff",
        idea: "Una decision UX no termina hasta que otra persona puede entenderla y mantenerla.",
        summary: "Documentar no es burocracia si captura problema, evidencia, alternativas, decision, criterio y fuente. En cursos, el handoff debe incluir estructura editorial, fuentes externas, campos JSON usados, reglas de calidad y pendientes. Asi se evita que la siguiente tanda vuelva a frases genericas.",
        model: "La documentacion es memoria operativa. Permite revisar por que existe un cambio y que condicion lo haria cambiar.",
        principle: "Los sistemas de diseño y contenidos escalables dependen de reglas compartidas. Sin handoff, cada curso queda atado a quien lo edito.",
        evaluate: "Lee la documentacion una semana despues. Si no puedes reconstruir problema, fuente y criterio de exito, falta informacion.",
        example: "Una ficha de leccion profunda incluye fuentes, modelo mental, principio aplicado, evaluacion, ejemplo y practica.",
        counter: "Subir cambios sin indicar que fuente respaldo la nueva teoria.",
        mistake: "Documentar solo una lista de archivos modificados.",
        practice: "Escribe una decision UX con problema, evidencia, fuente, cambio, riesgo y siguiente validacion.",
        points: ["El handoff preserva criterio.", "Fuentes y evidencia deben quedar visibles.", "La documentacion evita repetir errores editoriales.", "Una decision mantenible explica cuando revisarse."],
        refs: ["material-foundations", "wcag-22"]
      }
    ],
    quiz: [
      ["Para que sirve baja fidelidad?", ["Para aprender rapido sobre estructura y flujo", "Para publicar producto final", "Para ocultar problemas", "Para reemplazar contenido"], 0],
      ["Que prueba un prototipo navegable?", ["Rutas, salidas, estados y supuestos entre pantallas", "Solo color", "Solo logo", "Solo opinion estetica"], 0],
      ["Que observa una prueba de tareas?", ["Comportamiento frente a una accion concreta", "Preferencias abstractas solamente", "Tecnologia usada", "Cantidad de cursos"], 0],
      ["Que incluye un hallazgo sintetizado?", ["Tarea, evidencia, severidad, causa probable y recomendacion", "Una frase de gusto", "Una captura sin contexto", "Una lista de colores"], 0],
      ["Por que documentar decisiones?", ["Para mantener problema, fuente, criterio y cambio comprensibles", "Para llenar archivos", "Para evitar probar", "Para ocultar deuda"], 0]
    ],
    checklist: [
      ["Prototipo barato", "La version permite aprender sin pulir de mas.", "Usa papel, wireframe o HTML simple para una tarea."],
      ["Supuestos escritos", "Cada interaccion responde una pregunta.", "Lista supuestos antes de probar."],
      ["Guion de tareas", "La prueba observa accion concreta.", "Prepara cinco tareas y criterios de exito."],
      ["Hallazgos sintetizados", "Las observaciones se agrupan por patron.", "Escribe severidad y recomendacion."],
      ["Matriz de prioridad", "Ordena impacto, esfuerzo y riesgo.", "Decide que va en piloto y que queda planificado."],
      ["Decision documentada", "El cambio tiene evidencia y fuente.", "Registra problema, cambio, criterio y proxima revision."]
    ]
  }
];

function buildQuiz(module, moduleIndex) {
  return module.quiz.map((q, index) => ({
    id: `m${moduleIndex + 1}-q${index + 1}`,
    question: q[0],
    options: q[1],
    correctAnswerIndex: q[2],
    feedback: "Respuesta esperada: conecta la decision con tarea, evidencia y criterio de calidad UX/UI."
  }));
}

const courseContent = {
  courseId: "ux-ui-basico-sitios-apps",
  title: "UX/UI Basico para Sitios y Apps",
  version,
  publicationStatus,
  depthModel: {
    status: "reestructuracion-profunda-piloto",
    updatedAt: date,
    theoryArchitecture: ["resumen teorico", "modelo mental", "principio aplicado", "como evaluarlo", "ejemplo", "contraejemplo", "practica", "fuentes"],
    baselineIssue: "El contenido anterior tenia teoria breve repetitiva y patrones genericos entre lecciones."
  },
  sourceBank,
  modules: modules.map((module, moduleIndex) => ({
    id: `m${moduleIndex + 1}`,
    title: module.title,
    description: module.description,
    learningRisk: module.learningRisk,
    commercialRisk: module.commercialRisk,
    sourceKeys: module.refs,
    lessons: module.lessons.map((item, lessonIndex) => lesson(module, moduleIndex, item, lessonIndex)),
    quiz: buildQuiz(module, moduleIndex)
  }))
};

const checklists = {
  checklists: modules.map((module, moduleIndex) => ({
    id: `uxui-profundo-checklist-${moduleIndex + 1}`,
    title: `${module.title}: control de aplicacion`,
    description: `Checklist para aplicar ${module.title.toLowerCase()} con evidencia, criterio UX y fuente de referencia.`,
    commercialArea: "UX/UI para sitios, apps y cursos web",
    items: module.checklist.map((item, itemIndex) => ({
      id: `uxui-profundo-cl${moduleIndex + 1}-i${itemIndex + 1}`,
      title: item[0],
      explanation: item[1],
      recommendedAction: item[2]
    }))
  }))
};

const incidents = {
  incidents: [
    {
      id: "uxui-profundo-case-1",
      title: "La persona queda atrapada dentro de una leccion",
      summary: "El flujo permite avanzar, pero no ofrece una ruta clara para volver al modulo o al menu principal.",
      severity: "Alta: orientacion y control",
      immediateGoal: "Restituir control del usuario y comprobar que puede volver sin usar el historial del navegador.",
      steps: ["Definir la tarea exacta de regreso.", "Registrar desde que pantallas falta salida.", "Agregar ruta global y ruta local con jerarquia clara.", "Probar con teclado y celular.", "Medir si la persona vuelve en un intento.", "Documentar patron para todos los cursos."],
      evidenceToPreserve: ["Captura de la leccion sin salida", "Ruta intentada por la persona", "Cambio aplicado", "Resultado de la prueba antes/despues"],
      errorsToAvoid: ["Confiar solo en el boton Atras", "Agregar enlaces sin jerarquia", "Ocultar la salida en iconos sin texto", "No probar desde enlaces directos"],
      aftercare: ["Crear regla de navegacion transversal", "Actualizar checklist de arquitectura", "Auditar otros cursos con el mismo flujo"],
      guidedDecision: {
        question: "Que solucion respeta mejor control y libertad del usuario?",
        options: [
          { text: "Agregar ruta visible a modulo y menu principal, y probarla en una tarea real.", isCorrect: true, feedback: "Correcto: resuelve orientacion, salida y evidencia." },
          { text: "Decirle al usuario que use Atras.", isCorrect: false, feedback: "Eso traslada la deuda de navegacion a la persona." },
          { text: "Cambiar colores del boton siguiente.", isCorrect: false, feedback: "No resuelve el regreso ni la orientacion." }
        ]
      }
    },
    {
      id: "uxui-profundo-case-2",
      title: "Curso con teoria repetida entre lecciones",
      summary: "Las unidades tienen estructura completa, pero la teoria repite frases y no desarrolla conceptos.",
      severity: "Alta: calidad pedagogica",
      immediateGoal: "Reestructurar la leccion con teoria, modelo mental, principio, evaluacion y fuentes.",
      steps: ["Identificar patrones repetidos.", "Separar objetivo teorico de practica.", "Buscar fuente externa confiable.", "Redactar modelo mental y principio aplicado.", "Agregar ejemplo y contraejemplo.", "Crear criterio de evaluacion."],
      evidenceToPreserve: ["Texto anterior", "Fuente usada", "Nueva estructura", "Criterio de profundidad aplicado"],
      errorsToAvoid: ["Crear otra plantilla generica", "Cambiar solo algunas palabras", "No citar fuentes", "Confundir practica con teoria"],
      aftercare: ["Medir palabras y repeticiones", "Revisar con checklist editorial", "Aplicar por familias de cursos"],
      guidedDecision: {
        question: "Que cambio ataca el problema de profundidad?",
        options: [
          { text: "Reescribir con bloques teoricos diferenciados, fuentes y evaluacion.", isCorrect: true, feedback: "Correcto: cambia arquitectura, no solo fraseo." },
          { text: "Agregar mas lecciones cortas iguales.", isCorrect: false, feedback: "Aumenta volumen sin profundidad." },
          { text: "Cambiar el titulo de cada unidad.", isCorrect: false, feedback: "No corrige la pobreza teorica." }
        ]
      }
    },
    {
      id: "uxui-profundo-case-3",
      title: "Formulario de inscripcion con errores ambiguos",
      summary: "La persona no sabe que campo corregir ni por que el envio fallo.",
      severity: "Media alta: comprension y recuperacion",
      immediateGoal: "Hacer que labels, ayudas, errores y confirmacion permitan completar la tarea.",
      steps: ["Listar campos y finalidad.", "Asociar labels visibles.", "Escribir ayuda cerca del campo.", "Redactar error especifico.", "Probar con teclado.", "Confirmar resultado del envio."],
      evidenceToPreserve: ["Formulario inicial", "Errores observados", "Version corregida", "Prueba de recuperacion"],
      errorsToAvoid: ["Usar placeholder como label", "Mostrar error global generico", "Pedir datos innecesarios", "No indicar campos obligatorios"],
      aftercare: ["Actualizar patron de formularios", "Revisar contraste y foco", "Documentar datos minimos"],
      guidedDecision: {
        question: "Que mejora es mas accesible?",
        options: [
          { text: "Labels visibles, error por campo y accion de correccion.", isCorrect: true, feedback: "Correcto: ayuda a operar y recuperarse." },
          { text: "Un mensaje general al final.", isCorrect: false, feedback: "No indica donde ni como corregir." },
          { text: "Mas color rojo sin texto.", isCorrect: false, feedback: "Depende solo del color." }
        ]
      }
    },
    {
      id: "uxui-profundo-case-4",
      title: "Tarjetas de cursos indistinguibles",
      summary: "Las tarjetas tienen el mismo peso visual y no ayudan a elegir por necesidad, nivel o resultado.",
      severity: "Media: decision y escaneo",
      immediateGoal: "Mejorar jerarquia de tarjetas para que la eleccion sea clara.",
      steps: ["Definir decision que la tarjeta debe ayudar a tomar.", "Ordenar titulo, categoria, nivel, resultado y accion.", "Diferenciar destacado sin romper consistencia.", "Probar escaneo de cinco segundos.", "Ajustar textos y pesos.", "Actualizar regla de componente."],
      evidenceToPreserve: ["Tarjeta anterior", "Nueva jerarquia", "Resultado de escaneo", "Regla de componente"],
      errorsToAvoid: ["Hacer todas las tarjetas destacadas", "Usar solo imagen como informacion", "Ocultar nivel o resultado", "Cambiar estilos sin regla"],
      aftercare: ["Documentar tarjeta de curso", "Auditar catalogo completo", "Revisar mobile"],
      guidedDecision: {
        question: "Que dato ayuda mas a elegir curso?",
        options: [
          { text: "Necesidad, nivel, resultado esperado y accion principal.", isCorrect: true, feedback: "Correcto: orienta decision." },
          { text: "Una frase inspiradora sin contenido.", isCorrect: false, feedback: "No ayuda a comparar." },
          { text: "Solo una imagen decorativa.", isCorrect: false, feedback: "No informa tarea ni nivel." }
        ]
      }
    },
    {
      id: "uxui-profundo-case-5",
      title: "Boton principal compite con acciones secundarias",
      summary: "La persona no distingue que accion inicia, guarda, descarga o vuelve.",
      severity: "Media: jerarquia de accion",
      immediateGoal: "Asignar prioridad visual y texto especifico a cada accion.",
      steps: ["Listar acciones de la pantalla.", "Identificar accion primaria real.", "Bajar peso a acciones secundarias.", "Reescribir textos ambiguos.", "Probar anticipacion de resultado.", "Documentar variantes de boton."],
      evidenceToPreserve: ["Pantalla con acciones previas", "Nueva jerarquia", "Respuesta de prueba", "Regla de boton"],
      errorsToAvoid: ["Usar mismo estilo para todo", "Nombrar botones 'Aceptar' sin objeto", "Poner acciones destructivas junto a primarias", "No probar mobile"],
      aftercare: ["Actualizar guia de componentes", "Auditar botones de quiz y progreso", "Revisar estados foco/disabled"],
      guidedDecision: {
        question: "Que texto de boton es mas claro?",
        options: [
          { text: "Guardar progreso", isCorrect: true, feedback: "Correcto: indica objeto y resultado." },
          { text: "Aceptar", isCorrect: false, feedback: "No anticipa que ocurrira." },
          { text: "Ir", isCorrect: false, feedback: "Es ambiguo." }
        ]
      }
    },
    {
      id: "uxui-profundo-case-6",
      title: "Pantalla no usable con teclado",
      summary: "La persona no puede recorrer, activar o salir de componentes sin mouse.",
      severity: "Alta: accesibilidad operable",
      immediateGoal: "Restaurar operabilidad por teclado y foco visible.",
      steps: ["Recorrer la tarea con Tab.", "Registrar controles inaccesibles.", "Corregir orden y foco.", "Evitar menus solo hover.", "Probar acciones principales.", "Guardar evidencia antes/despues."],
      evidenceToPreserve: ["Ruta de foco inicial", "Controles inaccesibles", "CSS/HTML corregido", "Prueba por teclado"],
      errorsToAvoid: ["Diseñar solo hover", "Ocultar outline sin reemplazo", "Cambiar orden visual y foco sin revisar", "No probar enlaces directos"],
      aftercare: ["Agregar prueba de teclado al checklist", "Revisar todos los cursos", "Documentar patron de foco"],
      guidedDecision: {
        question: "Que señal es indispensable para operar con teclado?",
        options: [
          { text: "Foco visible y orden logico.", isCorrect: true, feedback: "Correcto: orienta la navegacion sin mouse." },
          { text: "Hover animado.", isCorrect: false, feedback: "El hover no sirve para teclado." },
          { text: "Mas color de fondo.", isCorrect: false, feedback: "No garantiza operabilidad." }
        ]
      }
    },
    {
      id: "uxui-profundo-case-7",
      title: "Busqueda sin resultados utiles",
      summary: "El portal muestra vacio sin explicar filtros, terminos o alternativas.",
      severity: "Media: recuperacion",
      immediateGoal: "Convertir el estado vacio en una salida informativa.",
      steps: ["Detectar filtros activos.", "Explicar que no se encontro.", "Ofrecer limpiar filtros.", "Sugerir cursos relacionados.", "Probar terminos reales.", "Documentar microcopy de vacio."],
      evidenceToPreserve: ["Busqueda original", "Termino usado", "Estado vacio nuevo", "Resultado de recuperacion"],
      errorsToAvoid: ["Pantalla en blanco", "Culpar al usuario", "No mostrar filtros activos", "No ofrecer alternativas"],
      aftercare: ["Agregar sinonimos frecuentes", "Revisar categorias", "Medir busquedas fallidas"],
      guidedDecision: {
        question: "Que estado vacio ayuda mas?",
        options: [
          { text: "Explica el resultado y ofrece limpiar filtros o probar sugerencias.", isCorrect: true, feedback: "Correcto: permite recuperar la tarea." },
          { text: "No muestra nada.", isCorrect: false, feedback: "Aumenta incertidumbre." },
          { text: "Dice solo 'sin datos'.", isCorrect: false, feedback: "No da proxima accion." }
        ]
      }
    },
    {
      id: "uxui-profundo-case-8",
      title: "Cambio visual sin criterio de exito",
      summary: "El equipo rediseña una pantalla pero no sabe como comprobar si mejoro.",
      severity: "Media alta: decision no verificable",
      immediateGoal: "Convertir el cambio en hipotesis UX con medicion simple.",
      steps: ["Escribir problema observable.", "Definir cambio propuesto.", "Explicar resultado esperado.", "Seleccionar criterio de exito.", "Probar antes/despues.", "Documentar decision y fuente."],
      evidenceToPreserve: ["Problema inicial", "Hipotesis", "Version anterior", "Version nueva", "Resultado de prueba"],
      errorsToAvoid: ["Medir solo opinion", "Cambiar multiples variables sin registro", "No indicar fuente", "Declarar exito sin prueba"],
      aftercare: ["Guardar decision UX", "Actualizar matriz de prioridad", "Revisar si el patron aplica a otros cursos"],
      guidedDecision: {
        question: "Que evidencia valida mejor una mejora?",
        options: [
          { text: "La persona completa mejor la tarea definida antes del cambio.", isCorrect: true, feedback: "Correcto: mide comportamiento contra criterio." },
          { text: "El equipo siente que se ve mas moderno.", isCorrect: false, feedback: "Puede ser util, pero no valida tarea." },
          { text: "Hay mas elementos visuales.", isCorrect: false, feedback: "Cantidad no equivale a mejora." }
        ]
      }
    }
  ]
};

function updateManifest() {
  const file = path.join(dataRoot, "course_manifest.json");
  const manifest = readJson(file);
  Object.assign(manifest, {
    templateVersion: version,
    subtitle: "Curso teorico-practico para diagnosticar interfaces, navegar mejor, aplicar heuristicas, accesibilidad y pruebas simples.",
    description: "Aprende UX/UI con teoria aplicada, fuentes externas, ejemplos, contraejemplos, checklists y casos para mejorar sitios, apps y cursos web.",
    version,
    publicationStatus,
    responsibleNotice: responsibleNote,
    sourceBank,
    webApp: {
      ...(manifest.webApp || {}),
      cacheName: "ux_ui_basico_sitios_apps_v0_6_publica-cache-v0-8-profunda-uxui-v1",
      publicationStatus
    },
    professionalization: {
      tier: "curso-profundo-v0.8-piloto",
      updatedAt: date,
      improvements: [
        "Reestructuracion teorica completa con fuentes externas confiables.",
        "Lecciones con resumen, modelo mental, principio aplicado, evaluacion, ejemplo y contraejemplo.",
        "Checklists y casos alineados a problemas reales de navegacion, accesibilidad y contenido generico."
      ]
    },
    contentDepthAudit: {
      status: "piloto-reestructurado",
      updatedAt: date,
      baseline: "teoria mediana del proyecto: 32 palabras; patrones repetidos detectados en mas de mil lecciones",
      target: "teoria especifica, evaluable y fuenteada por leccion"
    }
  });
  writeJson(file, manifest);
}

function updatePublicationManifest() {
  const file = path.join(courseRoot, "manifest_publicacion.json");
  const manifest = readJson(file);
  Object.assign(manifest, {
    version: "v0.8 profunda UX/UI",
    status: "Curso profundo piloto v0.8",
    contentDepth: "reestructuracion teorica con fuentes externas",
    updatedAt: date
  });
  writeJson(file, manifest);
}

function updatePortalInventory() {
  const portalJsonFile = path.join(root, "portal", "portal_publico_profesional_v0_6", "data", "courses.json");
  const courses = readJson(portalJsonFile);
  const course = courses.find(item => item.id === courseFolder);
  if (course) {
    Object.assign(course, {
      version: "v0.8 profunda UX/UI",
      status: "Curso profundo piloto v0.8",
      description: "Curso UX/UI reestructurado con teoria aplicada, fuentes externas, heuristicas, accesibilidad, ejemplos, contraejemplos y pruebas simples.",
      features: [
        "6 modulos profundos",
        "36 lecciones con teoria aplicada",
        "30 preguntas",
        "6 checklists de auditoria UX/UI",
        "8 casos guiados",
        "Fuentes externas por leccion"
      ],
      recommendedBase: "Piloto de reestructuracion profunda para reemplazar teoria generica por contenido fuenteado.",
      tags: uniq([...(course.tags || []), "profundo-v0-8", "fuentes-externas", "accesibilidad", "heuristicas"])
    });
    writeJson(portalJsonFile, courses);
  }

  const inventoryJsonFile = path.join(root, "inventario", "inventario_publico_profesional.json");
  const inventory = readJson(inventoryJsonFile);
  const inventoryCourse = inventory.find(item => item.slug === courseFolder);
  if (inventoryCourse) {
    Object.assign(inventoryCourse, {
      version: "v0.8 profunda UX/UI",
      status: "Curso profundo piloto v0.8",
      contentDepth: "reestructuracion teorica con fuentes externas",
      professionalizedAt: date,
      deepReworkedAt: date,
      tags: uniq([...(inventoryCourse.tags || []), "profundo-v0-8", "fuentes-externas"])
    });
    writeJson(inventoryJsonFile, inventory);
  }

  const portalCsvFile = path.join(root, "portal", "portal_publico_profesional_v0_6", "data", "courses_inventory.csv");
  if (fs.existsSync(portalCsvFile)) {
    const line = `${courseFolder},UX/UI Basico para Sitios y Apps,v0.8 profunda UX/UI,Curso profundo piloto v0.8,Desarrollo web,"Principiantes de diseno, desarrollo web y productos digitales.",../../cursos/${courseFolder}/index.html,true,true`;
    const csv = fs.readFileSync(portalCsvFile, "utf8")
      .split(/\r?\n/)
      .map(row => row.startsWith(`${courseFolder},`) ? line : row)
      .join("\n");
    fs.writeFileSync(portalCsvFile, csv, "utf8");
  }

  const inventoryCsvFile = path.join(root, "inventario", "inventario_publico_profesional.csv");
  if (fs.existsSync(inventoryCsvFile)) {
    const line = `UX/UI Basico para Sitios y Apps,${courseFolder},Ruta 5 - Desarrollo Web y Programacion,Desarrollo web,v0.8 profunda UX/UI,Curso profundo piloto v0.8,6,36,30,6,8,zips/${courseFolder}.zip,cursos/${courseFolder}/index.html,curso-nuevo`;
    const csv = fs.readFileSync(inventoryCsvFile, "utf8")
      .split(/\r?\n/)
      .map(row => row.startsWith(`UX/UI Basico para Sitios y Apps,${courseFolder},`) ? line : row)
      .join("\n");
    fs.writeFileSync(inventoryCsvFile, csv, "utf8");
  }

  const inventoryMdFile = path.join(root, "inventario", "inventario_publico_profesional.md");
  if (fs.existsSync(inventoryMdFile)) {
    const md = fs.readFileSync(inventoryMdFile, "utf8")
      .replace(
        /\| UX\/UI Basico para Sitios y Apps \| Ruta 5 - Desarrollo Web y Programacion \| Publico profesional \| v0\.6 publica profesional \| `zips\/ux_ui_basico_sitios_apps_v0_6_publica\.zip` \|/,
        "| UX/UI Basico para Sitios y Apps | Ruta 5 - Desarrollo Web y Programacion | Curso profundo piloto v0.8 | v0.8 profunda UX/UI | `zips/ux_ui_basico_sitios_apps_v0_6_publica.zip` |"
      );
    fs.writeFileSync(inventoryMdFile, md, "utf8");
  }
}

writeJson(path.join(dataRoot, "course_content.json"), courseContent);
writeJson(path.join(dataRoot, "checklists.json"), checklists);
writeJson(path.join(dataRoot, "incidents.json"), incidents);
updateManifest();
updatePublicationManifest();
updatePortalInventory();

console.log(JSON.stringify({
  course: courseFolder,
  version,
  modules: courseContent.modules.length,
  lessons: courseContent.modules.reduce((sum, module) => sum + module.lessons.length, 0),
  questions: courseContent.modules.reduce((sum, module) => sum + module.quiz.length, 0),
  checklists: checklists.checklists.length,
  incidents: incidents.incidents.length,
  sources: Object.keys(sourceBank).length
}, null, 2));

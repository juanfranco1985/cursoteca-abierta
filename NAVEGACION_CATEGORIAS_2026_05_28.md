# Navegacion por Categorias - 2026-05-28

## Objetivo

Se reorganizo el portal para que la entrada principal no sea una grilla directa de 50 cursos, sino 8 estantes principales. Cada estante abre una vista interna con los cursos correspondientes.

## Estantes principales

- Ciudadania Digital y Seguridad.
- IA, Trabajo y Productividad.
- Datos, BI y Gobierno de Datos.
- Desarrollo Web, UX/UI y Programacion.
- Emprendimiento, Marketing y Finanzas.
- Educacion, Familia y Acompanamiento.
- Administracion, Tramites y Atencion.
- Contenido Plus.

## Cambios aplicados

- Menu principal actualizado con entrada a `Categorias`.
- Hero actualizado para dirigir a la navegacion por estantes.
- Seccion `Estantes de aprendizaje` generada dinamicamente desde `courses.json`.
- Vista interna `Estante seleccionado` con los cursos del grupo elegido.
- Catalogo completo con buscador y filtro conservado como vista secundaria.
- Cursos destacados conservados como muestra inicial.

## Validacion

- Estantes principales: 8.
- Categorias reales del inventario cubiertas: 21.
- Cursos asignados a una familia: 50.
- Familias vacias: 0.
- Cursos faltantes desde enlaces relativos: 0.
- Miniaturas faltantes: 0.
- JavaScript del portal: `node --check` correcto.
- Enlaces antiguos a `#rutas`: no detectados.

# Portal Publico Profesional de Cursos Web

Portal estatico para navegar las 50 ediciones publicas profesionales generadas el 2026-05-26.

## Estado

- 50 cursos completos.
- 0 pendientes de desarrollo.
- 50 enlaces publicos hacia `../../cursos/`.
- Sin backend, login ni base de datos.
- Marca visual: `Cursoteca Abierta`.
- Navegacion principal por 8 estantes de aprendizaje.
- 50 miniaturas SVG locales tipo portada de biblioteca en `assets/course-covers/`.

## Uso local

Abrir con Live Server o un servidor local y entrar a `index.html`.

```powershell
python -m http.server 8040 --bind 127.0.0.1
```

URL sugerida:

```text
http://127.0.0.1:8040/portal/portal_publico_profesional_v0_6/index.html
```

El portal carga `data/courses.json` y necesita conservar esta estructura relativa:

```text
portal/portal_publico_profesional_v0_6/
cursos/
inventario/
zips/
```

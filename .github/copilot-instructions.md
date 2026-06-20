# Copilot Instructions for PlanEstudio

## Build, test, and lint commands

```powershell
pip install -r requirements.txt
mkdocs serve --dev-addr=127.0.0.1:8001
mkdocs build
```

- Este repositorio no tiene suite de tests automatizados ni linter configurado actualmente.
- No aplica comando de "single test" porque no existen tests en el proyecto.

## MCP servers (repository config)

El repositorio incluye `.mcp.json` con servidor `playwright` para automatizar validaciones visuales/navegación del sitio durante sesiones con soporte MCP.

## High-level architecture

Este repositorio es un sitio estático de aprendizaje construido con MkDocs Material:

- `mkdocs.yml` define navegación, tema, plugins, extensiones Markdown y `extra_css`.
- `docs/` contiene toda la fuente editable del contenido.
- `site/` es artefacto generado y no se debe editar manualmente.

La arquitectura de contenido es progresiva y está acoplada entre configuración y documentación:

1. `docs/index.md` actúa como landing page con bloques HTML custom (`hero-banner`, `level-card`, `module-list`, etc.).
2. `docs/stylesheets/extra.css` contiene estilos para esas clases HTML; cambios en clases de `index.md` requieren actualizar CSS en conjunto.
3. `mkdocs.yml` conecta la navegación principal por niveles (`NIVEL_1_BASICO.md` → `NIVEL_4_ARQUITECTO.md`), anexos y recursos.

## Key conventions

- Todo el contenido editorial se mantiene en **español**; nombres de producto/tecnología se conservan en inglés (Power Fx, Model-Driven, Canvas, etc.).
- Los archivos de contenido siguen `SCREAMING_SNAKE_CASE.md` (especialmente en `docs/Niveles`, `docs/Anexos`, `docs/Recursos`).
- No se deben saltar niveles en la ruta formativa: `NIVEL 1 -> NIVEL 2 -> NIVEL 3 -> NIVEL 4`.
- Cada módulo debe mantener la estructura fija:
  - `🎯 Objetivo`
  - `📖 Conceptos Clave`
  - `👨‍💻 Actividades Prácticas Paso a Paso`
  - `💼 Casos Reales de Negocio`
  - `✅ Buenas Prácticas`
  - `⚠️ Errores Comunes`
  - `🧪 Criterios de Validación`
- Convención de bloques de código:
  - Power Fx en bloque `js`
  - DAX en bloque `dax`
  - Power Query en bloque `m`
- Mantener consistencia de prefijos funcionales del ecosistema Power Platform:
  - columnas personalizadas Dataverse con prefijo de publisher (ej. `sit_`, `sse_`, `cr123_`)
  - evitar prefijo por defecto `new_`
  - controles Power Fx con prefijo por tipo + PascalCase (ej. `btnGuardar`, `galSolicitudes`, `txtBusqueda`)

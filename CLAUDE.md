# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

A structured, progressive learning plan for Microsoft Power Platform and Dynamics 365 — from beginner to Solution Architect. All content is Markdown documentation served as a static e-learning site via MkDocs Material.

## Repository Structure

```
mkdocs.yml               # MkDocs configuration (site_name, nav, theme, plugins)
requirements.txt         # Python deps: mkdocs-material
.gitignore               # Excludes site/ (generated output)
docs/                    # MkDocs source — all editable content lives here
  index.md               # Master index and overview (start here; was PLAN_MAESTRO.md)
  Niveles/
    NIVEL_1_BASICO.md    # Level 1: Fundamentals (4–6 months)
    NIVEL_2_INTERMEDIO.md  # Level 2: Intermediate (planned)
    NIVEL_3_AVANZADO.md    # Level 3: Advanced (planned)
    NIVEL_4_ARQUITECTO.md  # Level 4: Architect Master (planned)
  Anexos/
    LENGUAJES_PROGRAMACION.md
    COPILOT_STUDIO_COMPLETO.md
    ALM_DEVOPS_ESTRATEGIAS.md
    ARQUITECTURA_EMPRESARIAL.md
    CASOS_REALES_NEGOCIO.md
  Recursos/
    CHECKLIST_PROGRESO.md
    GLOSARIO_TERMINOS.md
    CERTIFICACIONES.md
  stylesheets/
    extra.css            # Custom CSS: level colors, badges, visual enhancements
site/                    # Generated output (git-ignored — do not edit)
```

## Running the Site Locally

```powershell
pip install -r requirements.txt
& "C:\Users\bdp_u\AppData\Roaming\Python\Python314\Scripts\mkdocs.exe" serve --dev-addr=127.0.0.1:8001
# Open http://127.0.0.1:8001
```

## Document Conventions

Each module within a level follows this fixed structure:
1. **🎯 Objetivo** — what the learner can do upon completion
2. **📖 Conceptos Clave** — theoretical knowledge list
3. **👨‍💻 Actividades Prácticas Paso a Paso** — numbered, sequential exercises with code snippets
4. **💼 Casos Reales de Negocio** — business scenarios grounding the exercises
5. **✅ Buenas Prácticas** — design, performance, security, governance notes
6. **⚠️ Errores Comunes** — common pitfalls with diagnosis and fix
7. **🧪 Criterios de Validación** — checkbox list for completion

Maintain this structure strictly when adding or editing modules.

## Naming and Prefix Conventions

- File names use `SCREAMING_SNAKE_CASE.md`
- Dataverse custom column prefixes follow publisher convention defined per project (e.g., `cr123_`, `sit_`, `sse_`)
- Power Fx control naming: `btnGuardar`, `galSolicitudes`, `txtBusqueda` (type prefix + PascalCase)
- Solution publisher prefix should be unique per project; avoid the default `new_` prefix

## Progression Dependencies

**Do not skip levels.** Each level builds on the previous:

```
NIVEL 1 → NIVEL 2 → NIVEL 3 → NIVEL 4
```

Matching certification path: PL-900 → PL-200 → PL-400 → PL-600

## Language

All content is written in **Spanish**. When adding or editing documentation, maintain Spanish throughout — technical terms (Power Fx, DAX, Canvas, Model-Driven, etc.) stay in English as they are proper product names.

## Power Fx / Code Snippets Style

Code blocks use JavaScript syntax highlighting (`js`) for Power Fx, `dax` for DAX measures, and `m` for Power Query M. Examples from NIVEL_1_BASICO.md demonstrate the expected format — annotate non-obvious lines with `//` comments inline.

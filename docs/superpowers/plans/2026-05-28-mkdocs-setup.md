# MkDocs E-Learning Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el repositorio de Markdown en un sitio e-learning navegable con MkDocs Material — sin mover ni duplicar los archivos de contenido existentes.

**Architecture:** MkDocs se configura con `docs_dir: .` (raíz del repo) y un `nav:` explícito que expone solo los archivos de contenido. El tema Material añade búsqueda en español, pestañas de navegación, resaltado de código, y checkboxes interactivos. Un CSS personalizado pinta los indicadores de nivel (verde/azul/naranja/rojo) y badges de certificación.

**Tech Stack:** Python 3.14, mkdocs-material 9.x, mkdocs-minify-plugin (opcional), PowerShell para servir localmente.

---

## Mapa de archivos

| Acción | Ruta | Responsabilidad |
|--------|------|-----------------|
| Crear | `mkdocs.yml` | Configuración completa del sitio |
| Crear | `requirements.txt` | Dependencias Python reproducibles |
| Crear | `stylesheets/extra.css` | Colores de nivel, badges, mejoras visuales |
| Crear | `.gitignore` | Excluir carpeta `site/` generada |
| No tocar | `PLAN_MAESTRO.md`, `Niveles/*.md`, `Anexos/*.md`, `Recursos/*.md` | Fuente de verdad — sin cambios |

---

## Task 1: Dependencias Python

**Files:**
- Create: `requirements.txt`

- [ ] **Step 1: Crear requirements.txt**

```
mkdocs-material==9.5.27
```

- [ ] **Step 2: Instalar dependencias**

```powershell
pip install -r requirements.txt
```

Salida esperada: `Successfully installed mkdocs-material-9.5.27 ...`

- [ ] **Step 3: Verificar instalación**

```powershell
mkdocs --version
```

Salida esperada: `mkdocs, version 1.6.x from ...`

---

## Task 2: Configuración principal MkDocs

**Files:**
- Create: `mkdocs.yml`

- [ ] **Step 1: Crear mkdocs.yml**

```yaml
site_name: "Power Platform & D365 — Plan de Estudio"
site_description: "Plan de aprendizaje progresivo: de fundamentos a Arquitecto Senior"
docs_dir: .
exclude_docs: |
  docs/superpowers/**
  CLAUDE.md
  requirements.txt
  mkdocs.yml
  .gitignore
  site/**

theme:
  name: material
  language: es
  palette:
    - scheme: default
      primary: blue
      accent: indigo
      toggle:
        icon: material/weather-night
        name: Cambiar a modo oscuro
    - scheme: slate
      primary: blue
      accent: indigo
      toggle:
        icon: material/weather-sunny
        name: Cambiar a modo claro
  features:
    - navigation.tabs
    - navigation.tabs.sticky
    - navigation.sections
    - navigation.expand
    - navigation.top
    - navigation.footer
    - search.highlight
    - search.suggest
    - search.share
    - content.code.copy
    - content.tabs.link
    - toc.follow
  icon:
    logo: material/school
    repo: fontawesome/brands/github
  font:
    text: Roboto
    code: Roboto Mono

nav:
  - Inicio: PLAN_MAESTRO.md
  - "🟢 Nivel 1 — Básico":
      - Contenido: Niveles/NIVEL_1_BASICO.md
  - "🔵 Nivel 2 — Intermedio":
      - Contenido: Niveles/NIVEL_2_INTERMEDIO.md
  - "🟠 Nivel 3 — Avanzado":
      - Contenido: Niveles/NIVEL_3_AVANZADO.md
  - "🔴 Nivel 4 — Arquitecto":
      - Contenido: Niveles/NIVEL_4_ARQUITECTO.md
  - Anexos:
      - Lenguajes de Programación: Anexos/LENGUAJES_PROGRAMACION.md
      - Copilot Studio Completo: Anexos/COPILOT_STUDIO_COMPLETO.md
      - ALM y DevOps: Anexos/ALM_DEVOPS_ESTRATEGIAS.md
      - Arquitectura Empresarial: Anexos/ARQUITECTURA_EMPRESARIAL.md
      - Casos Reales de Negocio: Anexos/CASOS_REALES_NEGOCIO.md
  - Recursos:
      - "✅ Checklist de Progreso": Recursos/CHECKLIST_PROGRESO.md
      - "📖 Glosario": Recursos/GLOSARIO_TERMINOS.md
      - "🏆 Certificaciones": Recursos/CERTIFICACIONES.md

plugins:
  - search:
      lang: es
      separator: '[\s\-\.]+'

markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - pymdownx.highlight:
      anchor_linenums: true
      line_spans: __span
      pygments_lang_class: true
  - pymdownx.inlinehilite
  - pymdownx.tabbed:
      alternate_style: true
  - pymdownx.tasklist:
      custom_checkbox: true
      clickable_checkbox: false
  - pymdownx.emoji:
      emoji_index: !!python/name:material.extensions.emoji.twemoji
      emoji_generator: !!python/name:material.extensions.emoji.to_svg
  - attr_list
  - md_in_html
  - tables
  - toc:
      permalink: true
      title: Contenido

extra_css:
  - stylesheets/extra.css

extra:
  generator: false
```

- [ ] **Step 2: Primer arranque para detectar errores de configuración**

```powershell
mkdocs serve --config-file mkdocs.yml 2>&1 | Select-Object -First 20
```

Salida esperada: `INFO - Serving on http://127.0.0.1:8000/` (sin errores en rojo).  
Si hay error `exclude_docs not supported`, eliminar esa key y crear un `.mkdocsignore` en su lugar — ver Task 3 alt.

---

## Task 3: CSS personalizado para niveles y e-learning

**Files:**
- Create: `stylesheets/extra.css`

- [ ] **Step 1: Crear directorio y archivo CSS**

```powershell
New-Item -ItemType Directory -Path "stylesheets" -Force
```

- [ ] **Step 2: Escribir extra.css**

```css
/* ─── Colores de nivel en la barra de navegación ─── */
.md-tabs__item:nth-child(2) .md-tabs__link { border-bottom: 3px solid #4caf50; } /* N1 verde */
.md-tabs__item:nth-child(3) .md-tabs__link { border-bottom: 3px solid #2196f3; } /* N2 azul */
.md-tabs__item:nth-child(4) .md-tabs__link { border-bottom: 3px solid #ff9800; } /* N3 naranja */
.md-tabs__item:nth-child(5) .md-tabs__link { border-bottom: 3px solid #f44336; } /* N4 rojo */

/* ─── Badge de duración / certificación en encabezados ─── */
.level-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  vertical-align: middle;
  margin-left: 8px;
}
.badge-green  { background: #e8f5e9; color: #2e7d32; }
.badge-blue   { background: #e3f2fd; color: #1565c0; }
.badge-orange { background: #fff3e0; color: #e65100; }
.badge-red    { background: #ffebee; color: #b71c1c; }

/* ─── Checklist interactivo ─── */
.task-list-item input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

/* ─── Bloques de código más compactos ─── */
.highlight pre {
  font-size: 0.85rem;
}

/* ─── Tabla de módulos con hover highlight ─── */
.md-typeset table:not([class]) tr:hover {
  background-color: var(--md-accent-fg-color--transparent);
}

/* ─── Admoniciones personalizadas: Actividad Práctica ─── */
:root {
  --md-admonition-icon--practica: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z'/></svg>");
}
.md-typeset .admonition.practica,
.md-typeset details.practica {
  border-color: #00897b;
}
.md-typeset .practica > .admonition-title,
.md-typeset .practica > summary {
  background-color: rgba(0, 137, 123, 0.1);
}
.md-typeset .practica > .admonition-title::before,
.md-typeset .practica > summary::before {
  background-color: #00897b;
  -webkit-mask-image: var(--md-admonition-icon--practica);
          mask-image: var(--md-admonition-icon--practica);
}

/* ─── Ancho máximo para mejor lectura en pantallas grandes ─── */
.md-grid {
  max-width: 1280px;
}
```

- [ ] **Step 3: Reiniciar servidor y verificar estilos**

```powershell
mkdocs serve
```

Abrir `http://127.0.0.1:8000` y verificar:
- Pestañas con color por nivel
- Checkboxes visibles en CHECKLIST_PROGRESO.md
- Código con botón "Copy"
- Búsqueda en español funciona (buscar "Dataverse")

---

## Task 4: .gitignore

**Files:**
- Modify: `.gitignore` (crear si no existe)

- [ ] **Step 1: Crear/actualizar .gitignore**

Contenido completo:

```
# MkDocs site generado
site/

# Python
__pycache__/
*.pyc
.venv/
venv/
```

---

## Task 5: Verificación final y build estático

- [ ] **Step 1: Build de producción**

```powershell
mkdocs build --strict
```

Salida esperada: `INFO - Documentation built in X.XX seconds` sin warnings en rojo.

- [ ] **Step 2: Revisar salida**

```powershell
ls site/
```

Debe existir `site/index.html`, `site/Niveles/`, `site/Recursos/`, etc.

- [ ] **Step 3: Confirmar navegación completa**

Con `mkdocs serve` abierto, navegar manualmente:
- [ ] Inicio carga PLAN_MAESTRO.md
- [ ] Nivel 1 muestra módulos con checkboxes
- [ ] Búsqueda "Power Fx" retorna resultados
- [ ] Modo oscuro funciona con el toggle
- [ ] Código Power Fx tiene sintaxis coloreada

---

## Notas de diseño

- Los archivos de contenido (`Niveles/`, `Anexos/`, `Recursos/`) **no se tocan**. MkDocs los sirve tal cual.
- La carpeta `docs/superpowers/` es excluida vía `exclude_docs` y no aparece en el sitio.
- Para publicar en GitHub Pages en el futuro: `mkdocs gh-deploy` (requiere remote configurado).
- Para compartir con otros sin servidor: `mkdocs build` genera `site/` como HTML estático — se puede subir a cualquier hosting.

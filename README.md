# Power Platform & D365 — Plan de Estudio

**Estado: versión estable pública** — 65 módulos · 63 laboratorios · 488 preguntas · 603 criterios de checklist, con roadmap de sprints correctivos post-auditoría cerrado. Detalle completo, taxonomía de estados y limitaciones honestas en la sección "Estado estable — release readiness" de [`SPRINT_HANDOFF.md`](SPRINT_HANDOFF.md).

Plan de aprendizaje progresivo de Microsoft Power Platform y Dynamics 365, desde fundamentos hasta Solution Architect, alineado con las certificaciones oficiales de Microsoft.

**App en producción:** [edwingalarcon.github.io/PlanEstudio](https://edwingalarcon.github.io/PlanEstudio/)

### Qué cubre esta versión estable

- **Cubre bien:** progresión PL-900 → PL-200 → PL-400 → Arquitectura; especialización transversal en IA aplicada al desarrollo (Copilot/Claude Code/Codex); especialización transversal en Dynamics 365 CE (Sales, Customer Service, Customer Insights, Field Service) con labs hands-on donde el trial lo permite; capa de empleabilidad (rutas job-ready, matriz de skills, portafolio, CV/LinkedIn, inglés técnico).
- **Cubre parcialmente (job-ready / simulación):** Migration/Legacy, Admin/Governance y Solution Architect preparan criterio y evidencia defendible en entrevista, no sustituyen operación con tenant/infraestructura real. Contact Center Voz/SMS y Sales Insights predictivo quedan como diseño hasta contratar proveedor de telefonía o licencia Premium real.
- **No debe prometerse:** migración productiva enterprise, CRM on-premises operado en vivo, auditoría con logs reales de Purview/Dataverse, ni PL-600/MB-2xx como certificaciones vigentes (todas retiradas por Microsoft).

---

## Arquitectura del repositorio

```
PlanEstudio/
├── app-elearning/          ← APP PRINCIPAL (Next.js 15, static export)
│   ├── src/
│   │   ├── app/            ← Rutas (dashboard, niveles, módulos, simulador)
│   │   ├── components/     ← UI (layout, quiz, módulos)
│   │   └── lib/            ← Lógica: content.ts, quiz-engine.ts, progress.ts
│   ├── content/            ← FUENTE OFICIAL de módulos y labs para la app
│   ├── next.config.ts      ← output: 'export', basePath: '/PlanEstudio'
│   └── vitest.config.ts    ← Vitest + coverage
│
├── docs/                   ← MkDocs legacy/referencia + recursos compartidos
│   ├── Niveles/            ← Contenido legacy MkDocs (4 archivos)
│   ├── Labs/               ← Labs legacy MkDocs
│   ├── Anexos/             ← Copilot Studio, ALM/DevOps, Arquitectura
│   ├── Recursos/           ← Checklist, Glosario, Certificaciones, Prompts Reutilizables IA
│   └── javascripts/
│       └── evaluaciones-simulador.js  ← Banco de 488 preguntas (fuente actual, incluye Nivel IA y Nivel D365)
│
├── .github/workflows/ci.yml  ← CI/CD: lint → test → build → deploy + MkDocs
├── mkdocs.yml              ← Configuración del sitio MkDocs (referencia/legacy)
└── requirements.txt        ← mkdocs-material
```

### Relación entre las dos superficies

La app Next.js **lee `app-elearning/content/` en build-time** para módulos y laboratorios mediante `fs.readFileSync`. No hay backend, base de datos ni API: es un sitio completamente estático.

```
app-elearning/content/modules/*.md  ──build-time──▶  content.ts  ──▶  páginas HTML estáticas
app-elearning/content/labs/*.md     ──build-time──▶  content.ts  ──▶  páginas HTML estáticas
docs/javascripts/evaluaciones-simulador.js  ──build-time──▶  questions-parser.ts  ──▶  quizzes
```

`app-elearning/content/` es la fuente oficial para la app principal. `docs/` se conserva para MkDocs legacy/referencia y para recursos compartidos como el banco de preguntas.

---

## Ruta de aprendizaje

| Nivel | Módulos | Certificación | Duración estimada |
|-------|---------|---------------|-------------------|
| Nivel 1 — Básico | 8 | PL-900 | 4–6 semanas |
| Nivel 2 — Intermedio | 9 | PL-200 | 2–3 meses |
| Nivel 3 — Avanzado | 13 | PL-400 | 3–4 meses |
| Nivel 4 — Arquitecto | 11 | Arquitectura Power Platform | 4–6 meses |
| Nivel IA — Desarrollo Asistido *(transversal)* | 14 | Buenas Prácticas | Estudio libre, sin prerequisitos |
| Nivel D365 — Especialización *(transversal)* | 10 | CE avanzado + F&O Awareness | Estudio libre, sin prerequisitos |

Los niveles IA y D365 son transversales: no bloquean ni son bloqueados por los cuatro niveles base de Power Platform.

---

## Ejecutar localmente

### App Next.js (superficie principal)

```powershell
cd app-elearning
npm install
npm run dev
# Abrir http://localhost:3000
```

### MkDocs (referencia/legacy)

```powershell
pip install -r requirements.txt
mkdocs serve --dev-addr=127.0.0.1:8001
# Abrir http://127.0.0.1:8001
```

---

## Comandos de la app

```powershell
cd app-elearning

npm run dev           # Servidor de desarrollo con Turbopack
npm run build         # Build estático → out/
npm run build:pages   # Build estático para GitHub Pages con basePath /PlanEstudio
npm run lint             # ESLint
npm run typecheck        # TypeScript check
npm run validate:content # Frontmatter, moduleId/slug únicos, rangos por nivel, cobertura de preguntas
npm run test             # Vitest
npm run test:coverage    # Cobertura (umbral 80%)
npm run e2e              # Playwright smoke tests
npm run verify           # lint + typecheck + validate:content + coverage + build:pages
```

---

## CI/CD

GitHub Actions ejecuta en cada push a `master`:

| Job | Qué valida |
|-----|------------|
| `lint` | ESLint CLI + TypeScript (`tsc --noEmit`) + validación de contenido (`validate:content`) |
| `test` | Vitest con cobertura (umbral 80%; 225 tests al último diagnóstico local) |
| `e2e` | Playwright smoke: home, niveles, módulo, labs, simulador, búsqueda, dark mode, 404 |
| `build` | `GITHUB_PAGES=true next build` vía `npm run build:pages` → export estático en `out/` |
| `mkdocs` | `mkdocs build --strict` (valida nav, links internos) |
| `deploy` | Despliega `out/` a GitHub Pages (solo `master`) |

El job `deploy` depende de `build` y `mkdocs`; si falla lint, typecheck, tests, smoke E2E, build o MkDocs strict, no se despliega.

---

## Agregar nuevos módulos

1. Edita el archivo individual correspondiente en `app-elearning/content/modules/<nivel>/`.

2. Mantén frontmatter válido:
   ```yaml
   ---
   moduleId: 9
   title: "Dataverse Avanzado"
   level: "intermedio"
   certification: "PL-200"
   estimatedMinutes: 9
   slug: "dataverse-avanzado"
   ---
   ```

3. Sigue la estructura de 7 secciones: Objetivo → Conceptos Clave → Actividades → Casos Reales → Buenas Prácticas → Errores Comunes → Criterios de Validación.

4. Actualiza `i18n.ts` si cambias el conteo/rango de módulos por nivel:
   ```ts
   // app-elearning/src/lib/i18n.ts
   LEVEL_MODULE_RANGE = { basico: [1, 8], ... }
   ```

---

## Agregar preguntas al banco

El banco de preguntas vive en `docs/javascripts/evaluaciones-simulador.js` como un objeto `MODULE_QUESTIONS`:

```js
const MODULE_QUESTIONS = {
  1: [
    {
      type: "single",      // "single" | "multi"
      prompt: "¿Qué es Dataverse?",
      options: ["SharePoint", "Dataverse", "Excel", "Blob Storage"],
      answer: [1],         // índices 0-based de las respuestas correctas
      explanation: "Dataverse es la base de datos nativa de Power Platform."
    }
  ],
  // ...
};
```

Para agregar preguntas:
1. Localiza la clave del módulo (`1` a `65`).
2. Agrega el objeto de pregunta siguiendo el esquema exacto.
3. Verifica que el JS sigue siendo válido: `node -e "const MODULE_QUESTIONS = require('./docs/javascripts/evaluaciones-simulador.js')"` — o abre la consola del navegador y pega el objeto.

> El script `scripts/extract-questions.mjs` valida y genera `app-elearning/src/data/questions.ts` antes del build. Si el archivo tiene sintaxis o estructura inválida, el build falla con error explícito.

---

## Laboratorios

Los laboratorios oficiales para la app están en `app-elearning/content/labs/` con frontmatter validado (63 labs en total). `docs/Labs/` queda como copia legacy/referencia para MkDocs. Muestra parcial:

| Lab | Nivel | Cert |
|-----|-------|------|
| Lab 02 — Dataverse: Modelo de Datos | N1 | PL-900 |
| Lab 03 — Canvas App: Primera Aplicación | N1 | PL-900 |
| Lab 04 — Model-Driven App: Gestión Completa | N1 | PL-900 |
| Lab 05 — Power Automate: Notificación y Aprobación | N1 | PL-900 |
| Lab 09 — Dataverse Avanzado: BPF y Field Security | N2 | PL-200 |
| Lab 19 — ALM y CI/CD: Azure DevOps Pipeline | N3 | PL-400 |
| Lab 22 — Copilot Studio: SSO y Knowledge Sources | N3 | PL-400 |
| Lab 23 — Plugin C#: Validación Server-Side | N3 | PL-400 |
| Lab 32 — CoE Starter Kit: Gobernanza del Tenant | N4 | Arquitectura Power Platform |

Otros grupos de labs no listados arriba: 71–80/91–92 (simulaciones job-ready por perfil laboral,
filtrable en `/labs` o `/portafolio` por perfil), 93–100 (F&O hands-on: Finance, P2P, O2C,
Inventory, Project Operations, Commerce, Security, Reporting — requieren que el estudiante consiga
un trial/demo tenant de Dynamics 365 Finance & SCM; ver `docs/Recursos/ROADMAP_ESPECIALIZACION_AVANZADA.md`).

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router, static export) |
| UI | React 19, Tailwind CSS v3, shadcn/ui |
| Estado | Zustand v5 (persist → localStorage) |
| Búsqueda | FlexSearch 0.7 |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| Tests | Vitest v3, jsdom, @testing-library/react |
| CI/CD | GitHub Actions → GitHub Pages |
| Contenido | Markdown en `app-elearning/content/` para la app; `docs/` para MkDocs legacy y preguntas |

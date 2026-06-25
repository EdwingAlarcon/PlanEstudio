# Power Platform & D365 — Plan de Estudio

Plan de aprendizaje progresivo de Microsoft Power Platform y Dynamics 365, desde fundamentos hasta Solution Architect, alineado con las certificaciones oficiales de Microsoft.

**App en producción:** [edwingalarcon.github.io/PlanEstudio](https://edwingalarcon.github.io/PlanEstudio/)

---

## Arquitectura del repositorio

```
PlanEstudio/
├── app-elearning/          ← APP PRINCIPAL (Next.js 15, static export)
│   ├── src/
│   │   ├── app/            ← Rutas (dashboard, niveles, módulos, simulador)
│   │   ├── components/     ← UI (layout, quiz, módulos)
│   │   └── lib/            ← Lógica: content.ts, quiz-engine.ts, progress.ts
│   ├── next.config.ts      ← output: 'export', basePath: '/PlanEstudio'
│   └── vitest.config.ts    ← 72 tests unitarios
│
├── docs/                   ← FUENTE EDITORIAL (Markdown)
│   ├── Niveles/            ← Contenido de los 41 módulos (4 archivos)
│   ├── Labs/               ← 9 laboratorios formales tipo Microsoft App in a Day
│   ├── Anexos/             ← Copilot Studio, ALM/DevOps, Arquitectura
│   ├── Recursos/           ← Checklist, Glosario, Certificaciones
│   └── javascripts/
│       └── evaluaciones-simulador.js  ← Banco de 215 preguntas (fuente actual)
│
├── .github/workflows/ci.yml  ← CI/CD: lint → test → build → deploy + MkDocs
├── mkdocs.yml              ← Configuración del sitio MkDocs (referencia/legacy)
└── requirements.txt        ← mkdocs-material
```

### Relación entre las dos superficies

La app Next.js **lee los archivos de `docs/` en build-time** mediante `fs.readFileSync`. No hay base de datos ni API — es un sitio completamente estático.

```
docs/Niveles/*.md  ──build-time──▶  app-elearning/src/lib/content.ts  ──▶  páginas HTML estáticas
docs/javascripts/evaluaciones-simulador.js  ──build-time──▶  questions-parser.ts  ──▶  quizzes
```

`docs/` es la fuente editorial — ahí se edita el contenido. La app Next.js es la experiencia de usuario final que consume ese contenido.

---

## Ruta de aprendizaje

| Nivel | Módulos | Certificación | Duración estimada |
|-------|---------|---------------|-------------------|
| Nivel 1 — Básico | 8 | PL-900 | 4–6 semanas |
| Nivel 2 — Intermedio | 9 | PL-200 | 2–3 meses |
| Nivel 3 — Avanzado | 13 | PL-400 | 3–4 meses |
| Nivel 4 — Arquitecto | 11 | PL-600 | 4–6 meses |

---

## Ejecutar localmente

### App Next.js (superficie principal)

```powershell
cd app-elearning
npm install
npm run dev
# Abrir http://localhost:3000/PlanEstudio
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
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript check
npm run test          # Vitest (72 tests)
npm run test:coverage # Cobertura (umbral 80%)
```

---

## CI/CD

GitHub Actions ejecuta en cada push a `master`:

| Job | Qué valida |
|-----|------------|
| `lint` | ESLint + TypeScript (`tsc --noEmit`) |
| `test` | 72 tests Vitest con cobertura (umbral 80%) |
| `build` | `next build` → export estático en `out/` |
| `mkdocs` | `mkdocs build --strict` (valida nav, links internos) |
| `deploy` | Despliega `out/` a GitHub Pages (solo `master`) |

El job `deploy` depende de `build`. El job `mkdocs` corre en paralelo y falla el CI si hay errores en la navegación o links rotos de MkDocs.

---

## Agregar nuevos módulos

1. Edita el archivo correspondiente en `docs/Niveles/`:
   - `NIVEL_1_BASICO.md` → módulos 1-8 (PL-900)
   - `NIVEL_2_INTERMEDIO.md` → módulos 9-17 (PL-200)
   - `NIVEL_3_AVANZADO.md` → módulos 18-30 (PL-400)
   - `NIVEL_4_ARQUITECTO.md` → módulos 31-41 (PL-600)

2. Usa el heading exacto que espera el parser:
   - Nivel 1: `### **Módulo N: Título del módulo**`
   - Niveles 2-4: `## MÓDULO N: TÍTULO DEL MÓDULO`

3. Sigue la estructura de 7 secciones: Objetivo → Conceptos Clave → Actividades → Casos Reales → Buenas Prácticas → Errores Comunes → Criterios de Validación.

4. Actualiza `i18n.ts` si cambias el conteo de módulos por nivel:
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
1. Localiza la clave del módulo (`1` a `41`).
2. Agrega el objeto de pregunta siguiendo el esquema exacto.
3. Verifica que el JS sigue siendo válido: `node -e "const MODULE_QUESTIONS = require('./docs/javascripts/evaluaciones-simulador.js')"` — o abre la consola del navegador y pega el objeto.

> El parser (`questions-parser.ts`) extrae el objeto en build-time. Si el archivo tiene un error de sintaxis JS, el build completará pero los quizzes quedarán sin preguntas.

---

## Laboratorios

Los laboratorios formales están en `docs/Labs/` y se sirven tanto desde MkDocs (sección "🧪 Laboratorios") como contenido de referencia.

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
| Lab 32 — CoE Starter Kit: Gobernanza del Tenant | N4 | PL-600 |

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
| Contenido | Markdown en `docs/` (leído en build-time) |

# Copilot Instructions for PlanEstudio

## Build, test, and lint commands

Primary app:

```powershell
cd app-elearning
npm ci
npm run lint
npm run typecheck
npm run test:coverage
npm run build:pages
npm run e2e
```

Legacy/reference MkDocs site:

```powershell
pip install -r requirements.txt
mkdocs build --strict
mkdocs serve --dev-addr=127.0.0.1:8001
```

The project has ESLint, TypeScript, Vitest coverage, Playwright smoke tests, and GitHub Actions CI/CD for GitHub Pages.

## High-level architecture

The primary product is `app-elearning/`, a Next.js 15 App Router static export deployed at:

https://edwingalarcon.github.io/PlanEstudio/

`next.config.ts` uses `output: "export"` and enables `basePath`/`assetPrefix` only when `GITHUB_PAGES=true`. Local dev runs at `http://localhost:3000`; GitHub Pages builds run with `/PlanEstudio`.

MkDocs remains as a legacy/reference surface from `docs/`. Do not remove it without an explicit product decision.

## Content sources

- `app-elearning/content/modules/` is the official module source for the Next.js app.
- `app-elearning/content/labs/` is the official lab source for the Next.js app.
- `docs/Niveles/` and `docs/Labs/` are legacy/reference content for MkDocs.
- `docs/javascripts/evaluaciones-simulador.js` remains the shared question-bank source.
- `scripts/extract-questions.mjs` validates the question bank and generates `app-elearning/src/data/questions.ts`.

The app validates module frontmatter, lab metadata, unique `moduleId`, unique `slug`, valid level ranges, and question/module association during tests/build.

## CI/CD

GitHub Actions should:

- use Node from `app-elearning/.nvmrc`;
- install with `npm ci`;
- run lint, typecheck, coverage, Playwright smoke, static export build, and MkDocs strict;
- deploy to GitHub Pages only after required checks pass.

## Key conventions

- Main language is Spanish. Keep product names in English where they are official names.
- No backend or database is part of this project.
- Do not replace educational content with placeholders.
- Keep modules in progression order: `basico` → `intermedio` → `avanzado` → `arquitecto`.
- Preserve the 7-section module structure: Objetivo, Conceptos Clave, Actividades Prácticas, Casos Reales, Buenas Prácticas, Errores Comunes, Criterios de Validación.
- Use Power Fx code fences as `js`, DAX as `dax`, Power Query M as `m`, and C# as `csharp`.

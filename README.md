# Power Platform & D365 — Plan de Estudio

Plan de aprendizaje progresivo de Microsoft Power Platform y Dynamics 365, desde fundamentos hasta Solution Architect, alineado con las certificaciones oficiales de Microsoft.

## Estructura del repositorio

```
PlanEstudio/
├── docs/                        # Contenido MkDocs (fuente de verdad)
│   ├── index.md                 # Índice maestro
│   ├── Niveles/                 # Módulos de estudio por nivel
│   │   ├── NIVEL_1_BASICO.md    # 8 módulos — PL-900
│   │   ├── NIVEL_2_INTERMEDIO.md # 9 módulos — PL-200
│   │   ├── NIVEL_3_AVANZADO.md  # 13 módulos — PL-400
│   │   └── NIVEL_4_ARQUITECTO.md # 11 módulos — PL-600
│   ├── Anexos/                  # Copilot Studio, ALM/DevOps, Arquitectura
│   ├── Recursos/                # Checklist, Glosario, Certificaciones
│   └── javascripts/             # Banco de 123 preguntas de evaluación
├── app-elearning/               # App web Next.js 15 (e-learning interactivo)
├── mkdocs.yml                   # Configuración del sitio MkDocs
└── requirements.txt             # Dependencias Python (mkdocs-material)
```

## Ruta de aprendizaje

| Nivel | Módulos | Certificación | Duración estimada |
|-------|---------|---------------|-------------------|
| Nivel 1 — Básico | 8 | PL-900 | 4–6 semanas |
| Nivel 2 — Intermedio | 9 | PL-200 | 2–3 meses |
| Nivel 3 — Avanzado | 13 | PL-400 | 3–4 meses |
| Nivel 4 — Arquitecto | 11 | PL-600 | 4–6 meses |

## Ejecutar el sitio MkDocs

```powershell
pip install -r requirements.txt
mkdocs serve --dev-addr=127.0.0.1:8001
# Abrir http://127.0.0.1:8001
```

## App e-learning (Next.js)

Aplicación web interactiva con dashboard de progreso, lector de módulos, quizzes por módulo y simulador de examen cronometrado.

```powershell
cd app-elearning
npm install
npm run dev
# Abrir http://localhost:3000/PlanEstudio
```

### Funcionalidades

- Dashboard con anillos de progreso por nivel
- Lector de módulos con tipografía prose y modo oscuro
- Quiz de práctica al final de cada módulo (A/B/C/D, retroalimentación inmediata)
- Simulador de examen: 40 preguntas aleatorias, 50 min, umbral 70%
- Progreso persistido en `localStorage` (sin backend)
- Accesible: skip link, ARIA labels, focus visible

### Comandos

```powershell
npm run dev          # Servidor de desarrollo
npm run build        # Build estático (out/)
npm run test         # Pruebas unitarias (Vitest)
npm run test:coverage # Cobertura de código
npm run lint         # ESLint
```

## CI/CD

GitHub Actions ejecuta en cada push a `master`:

1. **Lint & Type Check** — ESLint + TypeScript
2. **Unit Tests** — Vitest con reporte de cobertura
3. **Build** — `next build` con export estático
4. **Deploy** — GitHub Pages (rama `master` únicamente)

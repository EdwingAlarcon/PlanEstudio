# Auditoría de alineación con el mercado laboral — PlanEstudio (2026-10-06)

**Pregunta central:** ¿PlanEstudio forma estudiantes íntegros y capaces de construir soluciones reales para empresas, cargos y habilidades que existen HOY en el mercado — no solo contenido teóricamente correcto?

**Metodología:** 6 fases (inventario → anclaje externo con ofertas reales → análisis de brechas → vigencia técnica → integridad profesional → síntesis). Auditoría de **solo lectura** — ningún archivo de contenido fue editado en esta pasada. Alcance confirmado con el usuario: 11 de 16 rutas profesionales investigadas con evidencia externa real (6 a fondo, 5 con investigación ligera), 5 excluidas con justificación explícita. Ejecutada con 4 subagentes en paralelo + trabajo directo del orquestador; el detalle completo de cada grupo de rutas vive en los archivos fuente listados en el Apéndice.

---

## Veredicto ejecutivo

**Sí, con una salvedad importante.** El contenido técnico de PlanEstudio es, en las 11 rutas investigadas, consistentemente **más riguroso y a menudo más actualizado que el propio mercado** que dice preparar (ejemplos verificados: ya documentaba el retiro de PL-600→AB-100 antes de que la mayoría de ofertas activas se actualizaran; ya corrigió detalles de licenciamiento que el propio curso había escrito mal en una sesión anterior). La dimensión de **integridad profesional** (honestidad sobre qué es experiencia real vs. simulada, documentación, seguridad, mínimo privilegio) está resuelta con una política explícita y poco común en cursos de autoestudio.

**Pero existe un defecto sistémico de datos, no de contenido**, que afecta la experiencia real de al menos 4 de las 16 rutas: números de módulo incorrectos en `professional-routes.ts`, originados en la renumeración de módulos del 2026-08-23, que nunca se propagó completamente a este archivo. Esto hace que un estudiante en esas 4 rutas vea, literalmente, el módulo equivocado recomendado en su plan de estudio — un defecto verificable, de alto impacto y bajísimo costo de corrección.

---

## Hallazgo transversal más importante — bug sistémico de 4 rutas (descubierto correlacionando los 4 forks)

Ningún fork individual tenía visibilidad de las otras rutas, así que este patrón solo emergió al cruzar sus resultados. Verificado directamente por el orquestador:

El 2026-08-23 el curso insertó el Módulo 56 (JS Fundamentos) en Nivel IA, lo que desplazó `d365` de `[56,65]` a `[57,66]` y `rpa` de `[66,75]` a `[67,76]` — un remapeo scriptado de 20 archivos de contenido y ~106 referencias cruzadas (documentado en `CLAUDE.md`). **Ese remapeo nunca se aplicó a `app-elearning/src/lib/professional-routes.ts`**, que sigue citando IDs de módulo de antes del cambio en 4 rutas:

| Ruta | Array actual | Problema verificado | Impacto real en UI (confirmado leyendo el código) |
|---|---|---|---|
| `dynamics-365-customer-engagement` | incluye `56` | `56` ya no es un módulo D365 — es "Fundamentos de JavaScript para Power Platform" (Nivel IA) | `src/app/rutas/[slug]/page.tsx:56` renderiza ese módulo en la lista de la ruta D365 CE; `route-readiness.ts` usa `route.modules.length` como denominador de progreso — el % de avance que ve el estudiante también está mal |
| `dynamics-365-customer-insights` | incluye `56` | mismo problema | mismo impacto |
| `dynamics-365-field-service` | `[20, 56, 58, 65]` — **falta el 59** | `59` es literalmente el módulo "Field Service End-to-End", el único cuyo contenido coincide con el nombre de la ruta; en su lugar están `56` (JS, ajeno) y `58` (Customer Insights - Data, producto distinto). Los 3 labs de esta misma ruta (lab-86, lab-87, lab-113) sí citan "Módulo 59 estudiado" como prerrequisito — la propia ruta es inconsistente consigo misma | El módulo central de la especialización no aparece en la página de la ruta; aparecen dos módulos ajenos en su lugar |
| `rpa` | `[66, 67...75]` — **falta el 76** | `66` es el capstone de D365 (sin relación con RPA); `76` ("ALM, Operación, Gobierno y Soporte RPA") es precisamente el módulo que cubre Azure DevOps/CI-CD/gobernanza — el requisito que más citan las ofertas reales de RPA Developer/Automation Engineer — y queda fuera del array oficial, aunque sí está enlazado desde los labs 111/112 | Un estudiante que sigue la ruta recomendada nunca ve enlazado el módulo de ALM/gobierno de su propia especialización |

**Severidad: Alta. Esfuerzo de corrección: mínimo** — son 4 cambios de array de una línea cada uno, sin crear contenido nuevo (todos los módulos correctos ya existen). No se corrigió en esta pasada por ser auditoría de solo lectura; queda como la recomendación de mayor prioridad del informe.

---

## Scores por ruta

### Investigadas a fondo (evidencia externa: ~5-10 ofertas reales cada una)

| Ruta | Score | Hallazgo principal |
|---|---|---|
| Developer | **Alto** | Era Medio al iniciar esta sesión; se cerraron 2 gaps reales (agile/Gherkin, Graph API) hoy mismo, antes de esta auditoría |
| Consultor Funcional | **Alto** | Sin brechas de contenido; único gap ya está honestamente documentado en el propio código |
| Solution Architect | **Alto** | Curso más actualizado que el mercado en certificación (PL-600→AB-100) |
| Dynamics 365 CE (general) | **Alto** | Cobertura amplia; falta mención del sucesor de certificación AB-210 (ver vigencia) |
| RPA Developer | **Alto** | Contenido técnico excelente; bug de array (ver arriba) + ausencia de scripting complementario (PowerShell/Python/SQL) que varias ofertas piden |
| AI & Copilot | **Medio** | Cubre con solidez el rol "Copilot Studio Developer"; el perfil "Gen AI Engineer" (construcción de RAG propio) queda solo a nivel conceptual |

### Investigadas con evidencia ligera (3-5 ofertas, o patrón declarado explícitamente ausente)

| Ruta | Score | Hallazgo principal |
|---|---|---|
| Dynamics 365 Sales | **Alto** | Forecast/pipeline sólido; IA/Copilot en Sales tratado como tema secundario pese a que el mercado 2026 lo centra |
| Dynamics 365 Customer Service | **Alto** | SLA/entitlements excelente; 2 de 3 ofertas reales eran de Contact Center/Omnichannel, fuera del núcleo de esta ruta específica |
| Dynamics 365 Field Service | **Medio** | Contenido excelente; el score baja exclusivamente por el bug de array (módulo central ausente), no por el contenido en sí |
| Customer Insights - Data | **Alto** | Único lugar del curso donde se enseña identity resolution con rigor; el mercado real pide perfil "data specialist" más general |
| Customer Insights - Journeys | **Medio-Alto** | Journeys bien cubierto; el mercado combina Data+Journeys en un solo rol más de lo que el curso los separa (decisión pedagógica ya documentada) |

### No investigadas externamente (justificación)

| Ruta | Razón de exclusión |
|---|---|
| Maker | No es un título de vacante externo buscable — es un punto de entrada evaluado implícitamente dentro del perfil junior de Developer |
| Fundamentos Power Platform | No es un cargo, es el Nivel Básico completo — mismo caso que Maker |
| Finance & Operations | El propio código la marca explícitamente `"Archivada / futura especialización"` con nota: *"No forma parte del progreso obligatorio ni de la promesa laboral base de PlanEstudio"* — investigarla externamente contradiría la propia honestidad que el curso ya declara sobre ella |
| Empleabilidad | Ruta meta de portafolio/entrevista, no una especialización de producto — evaluada en la Fase 5 (integridad profesional), no en la Fase 2/3 |
| AI & Copilot — sub-perfil "AI Builder Developer" | Hallazgo de mercado en sí mismo: no existe como título de vacante independiente en volumen relevante (ver detalle en Fase 2/3 de esa ruta) |

---

## Vigencia técnica (spot-check de 4 áreas de alto riesgo, no re-auditoría completa de los 149 archivos — la auditoría completa ya cerró el 2026-09-06)

1. **[CRÍTICO — pedagógico, no operativo] Módulo 22 (Copilot Studio Avanzado)** enseña exclusivamente el modelo de **Topics**, pero Microsoft lanzó en Build 2026 (junio) un modelo nuevo de 4 superficies (**Skills, Tools, Knowledge, Connected Agents**) que reemplaza a Topics como la unidad recomendada para agentes *nuevos* — "Topics and Child Agents are no longer supported" para construcción nueva (fuente: inogic.com, verificado contra el anuncio de Microsoft). Lo existente sigue funcionando (retrocompatible), así que nada está "roto" — pero el curso enseña el patrón que Microsoft ya no recomienda para quien empieza hoy. La auditoría de vigencia de septiembre no lo capturó pese a ser 3 meses posterior al cambio. **Decisión de alcance pendiente de aprobación explícita antes de tocar el módulo** (no es un fix trivial).
2. **[MENOR, con plazo]** Módulo 37 (AI Builder): desde el 1-nov-2026 las licencias nuevas dejan de incluir AI Builder credits — el contenido actual no refleja esta fecha límite.
3. **[CONFIRMADO CORRECTO]** PL-600→AB-100 ya documentado antes de que ocurriera el retiro — el curso se adelantó al mercado en este punto.
4. **[SIN CAMBIOS DE RUPTURA]** pac CLI / Azure DevOps Build Tools / `microsoft/powerplatform-actions`.
5. Hallazgo adicional de la Fase 2/3: el examen **MB-280 fue reemplazado por AB-210** (Dynamics 365 Sales AI Consultant, vigente desde junio 2026, foco en "agent-driven selling") — el curso ya anticipó correctamente el retiro de MB-280 pero no documenta su sucesor ni el giro hacia IA que lo define.

---

## Integridad profesional (más allá de lo técnico) — Score: Alto

- `docs/Recursos/JOB_READY_INTERVIEW_READINESS.md` contiene una política explícita anti-inflado-de-CV: tabla "Evita decir / Mejor di" que instruye a nunca presentar un lab simulado como experiencia laboral real, con el lenguaje honesto alternativo ya redactado. Cita textual del principio central: *"presenta lo que hiciste como proyecto, práctica o capstone; no como empleo si no fue empleo"*. Esto es, literalmente, la dimensión de integridad que pidió el usuario, resuelta con política explícita, no implícita.
- 18 incidentes + 6 challenges + 2 simulaciones + 6 prácticas guiadas de setup simulan situaciones reales de trabajo con evidencia exigida (no quizzes teóricos).
- Seguridad enseñada como práctica ética, no solo técnica: `content/modules/intermedio/16-seguridad-y-administracion-de-soluciones.md` cita explícitamente que el exceso de permisos es "un riesgo regulatorio y reputacional", no solo un problema de configuración.
- Agile/documentación reforzado hoy mismo en esta sesión (Definition of Ready con criterios Gherkin antes de estimar, trazabilidad commit↔Work Item).
- Brecha menor: no hay recurso dedicado a negociación salarial post-oferta (fase posterior a lo que el curso puede razonablemente simular).

---

## Recomendaciones priorizadas

### Quick wins (impacto alto, esfuerzo mínimo — cambios de datos de una línea, sin contenido nuevo)
1. **Corregir los 4 arrays de módulos rotos en `professional-routes.ts`** (ver tabla del hallazgo transversal): `dynamics-365-customer-engagement`, `dynamics-365-customer-insights`, `dynamics-365-field-service`, `rpa`.
2. Agregar el Módulo 32 (CoE Starter Kit) al array de la ruta `ai-copilot` — ya existe como contenido, solo falta declararlo.
3. Agregar una nota en los módulos de certificación D365 Sales/Solution Architect mencionando los sucesores vigentes (AB-210, AB-100) junto al nombre retirado, para no perder matches de búsqueda de reclutadores que aún usan el término viejo.

### Impacto medio, esfuerzo bajo (extender contenido existente, sin módulos nuevos)
4. Extender el Módulo 37 (AI Builder) con un paso conceptual breve sobre dónde encajaría un índice vectorial/RAG real en el flujo ya enseñado.
5. Agregar una sub-sección de "scripting complementario" (PowerShell/Python vía la acción nativa de PAD) en el Módulo 69 o 74 de RPA.
6. Agregar el Módulo 63 (Contact Center/Omnichannel) al array de la ruta específica `dynamics-365-customer-service` (ya existe, el mercado real para esa sub-especialidad se solapa fuertemente con omnichannel).
7. Aclarar en los `gapNote` de Customer Insights - Data/Journeys que el mercado real combina ambas capas en un solo rol más de lo que el curso las separa (decisión pedagógica ya justificada, falta solo la aclaración honesta).

### Decisión de alcance (requiere aprobación explícita antes de tocar, no es un fix trivial)
8. Módulo 22 (Copilot Studio Avanzado): decidir si se agrega una sección sobre el modelo Skills/Tools/Knowledge/Connected Agents manteniendo Topics como introducción pedagógica, o se reescribe el módulo completo.

---

## Apéndice — fuentes de este informe

- `audit-developer.md`, `audit-consultor-architect.md`, `audit-d365-family.md`, `audit-rpa-ai.md`, `audit-vigencia-tecnica.md`, `audit-integridad-profesional.md` — detalle completo por ruta/fase, con cada oferta de empleo citada (empresa + cargo + fuente) y cada cita de contenido (archivo + sección), generados en el scratchpad de esta sesión.
- Evidencia de mercado para la ruta Developer: 5 ofertas reales de LinkedIn revisadas con el usuario en esta misma sesión (ver conversación previa a esta auditoría).

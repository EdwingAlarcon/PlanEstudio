# AUDITORÍA INTEGRAL DE PLANESTUDIO 2026-2027

**Fecha de ejecución:** 2026-10-06. **Metodología:** 5 frentes de investigación en paralelo (mercado laboral real vía WebSearch, auditoría curricular de 76 módulos con lectura íntegra de muestra representativa, auditoría de 73 labs/32 prácticas, auditoría técnica del código `app-elearning/`, auditoría de empleabilidad/portafolio/IA), más verificación directa contra Microsoft Learn de hallazgos de vigencia. Este documento consolida y complementa dos auditorías previas de esta misma sesión (`AUDITORIA_ALINEACION_MERCADO_LABORAL_2026.md`, `audit-vigencia-integridad.md`) sin repetir su trabajo ya cerrado.

**Regla seguida:** no se inventan vacantes, requisitos, salarios ni porcentajes. Donde la evidencia es limitada o parcial, se dice explícitamente. Las matrices con porcentajes de esta auditoría son **estimaciones direccionales basadas en la muestra investigada** (no un censo completo de 76 módulos × 73 labs × cientos de vacantes), y se declara el tamaño de muestra en cada caso.

---

## Executive Summary

PlanEstudio tiene **contenido técnico de alta calidad real** (código C#/TypeScript/XML compilable, casos de negocio creíbles, vigencia técnica mayormente correcta tras los cierres de esta sesión) y una **plataforma de software técnicamente sólida** (sin `any`, sin TODOs olvidados, sin vectores XSS, backup de usuario bien defendido). El riesgo más grave NO está en el contenido en sí, sino en tres brechas estructurales:

1. **Brecha pedagógica sistémica**: ~13 de 14 módulos muestreados (y por extensión, la mayoría de los 76) enseñan a nivel "Aplicar paso a paso" (Nivel 2 de 7), delegando la práctica de "Resolver/Diseñar sin instrucciones" casi por completo a labs externos opcionales.
2. **Brecha de operación en equipo y producción real**: 0 de 73 labs simulan una ceremonia Agile con otra persona (Daily, PR Review entre pares), y el monitoreo/observability real (Application Insights) y disaster recovery son puramente conceptuales en todo el catálogo.
3. **Brecha de producto**: no existe hoy un motor de scoring Job-Ready — lo que existe es checklist estático y autoreporte, no verificación independiente de competencia.

**Corrección post-publicación (misma sesión):** el hallazgo inicial sobre el Módulo 29 (Azure AD B2C) resultó impreciso — ver nota al final de §9/§20. El 15-mar-2026 es la fecha de downgrade de licencia P2→P1, no un retiro de tenant; el módulo ya tenía la distinción correcta y no requirió cambios.

El veredicto global (sección 32, desarrollado en detalle): PlanEstudio forma estudiantes que **conocen y pueden aplicar** tecnología Power Platform/D365 real y vigente, de forma **parcial** pueden resolver/diseñar sin guía, y **no todavía** pueden demostrar verificablemente esas competencias ni operar/colaborar en un entorno de producción en equipo.

---

## 1. Estado actual de PlanEstudio

- **76 módulos** en 7 niveles (Básico 1-8, Intermedio 9-17, Avanzado 18-30, Arquitecto 31-41, IA transversal 42-56, D365 transversal 57-66, RPA transversal 67-76).
- **73 labs** + **32 prácticas profesionales** (18 incidentes, 6 challenges, 2 simulaciones, 6 guiadas) + **24 prácticas interactivas**.
- **891 preguntas** (516 quiz + 375 diagnóstico de caso), **636 criterios de validación**, **39 páginas de recursos**.
- Stack: Next.js 15 con export estático, contenido en Markdown con frontmatter, stores Zustand con persistencia local, producción en Vercel.
- Trabajo de esta sesión ya cerrado y verificado (no se repite aquí): corrección de 6 rutas profesionales desalineadas tras renumeración, reescritura completa del Módulo 22 a Connected Agents, notas de retiro PL-400→AB-400 (13 módulos), PL-200, MB-280→AB-210, mención de Microsoft Foundry en Módulo 37, corrección de terminología en banco de preguntas, y una ampliación de muestreo de integridad profesional sin hallazgos nuevos en 11 archivos JOB_READY/Portafolio.
- Esta auditoría es la primera de esta sesión en cubrir: profundidad pedagógica real por nivel de competencia, cobertura real de production-ops y Agile en labs, arquitectura técnica del código, y factibilidad de un sistema Job-Ready.

---

## 2. Score global (metodología explícita)

No existe un score único defendible sin inventar una ponderación arbitraria. En su lugar, se reporta un score por dimensión, cada uno con su base de evidencia:

| Dimensión | Score cualitativo | Base de evidencia |
|---|---|---|
| Vigencia técnica del contenido | **Alto** (con 1 excepción nueva: Módulo 29) | 2 auditorías previas + verificación directa Microsoft Learn de PL-400/MB-280/Copilot Studio/Azure AD B2C |
| Profundidad pedagógica (nivel de competencia) | **Medio-bajo** | Muestra de 14 módulos leídos íntegros + clasificación de objetivos de los 76 |
| Cobertura de production-ops en la práctica | **Bajo** en monitoreo/DR, **Alto** en troubleshooting/RCA | Muestra de 6 labs/prácticas íntegros + grep estructural sobre 73 labs |
| Trabajo en equipo/Agile practicado | **Muy bajo** | Grep estructural: 0 coincidencias de ceremonia simulada en 73 labs |
| Salud técnica de la plataforma (código) | **Alto** | Lectura directa de stores, seguridad, CI, mantenibilidad |
| Empleabilidad — producto (scoring/verificación) | **Bajo** | Lectura directa de `employability.ts`, `labor-profiles.ts`, `progress.ts` |
| Empleabilidad — guías/honestidad documental | **Alto** | 11 archivos JOB_READY/Portafolio ya auditados íntegros |
| Alineación con mercado laboral real | **Medio-alto**, con huecos de evidencia declarados | 28 vacantes/fuentes reales (WebSearch), cobertura desigual por rol |

---

## 3. Auditoría curricular

Ver detalle completo en el archivo de trabajo `curriculum-audit.md` (resumen aquí). Muestra: 14 módulos leídos íntegros distribuidos en Básico/Intermedio/Avanzado, más clasificación de objetivos de los 76 vía frontmatter.

- Contenido técnico de **alta calidad real** en la muestra: código compilable, buenas prácticas, errores comunes bien construidos.
- **13 de 14 módulos leídos se quedan en Nivel 2 (Aplicar)** — instrucciones numeradas que especifican hasta el valor exacto del campo. Única excepción clara: **Módulo 18** (árbol de decisión + ADR que exige justificar una decisión propia) — Nivel 4.
- Redundancia no documentada (P2) entre Módulo 20 (D365 CE en Avanzado) y Módulos 58/59/61/62/64 (D365 transversal): mismos conceptos de SLA/Entitlements/Routing sin una frase que aclare si es profundización intencional.
- Certificaciones: sin hallazgos nuevos, propagación ya confirmada correcta en todos los niveles.

---

## 4. Auditoría pedagógica

El patrón "Nivel 2 en el cuerpo del módulo, Nivel 3-4 delegado al lab" es el hallazgo pedagógico central de esta auditoría. Es coherente con lo ya sabido de los pilotos Learning-by-Doing (Módulos 10/11/13): el patrón de reto abierto "sin pasos" existe y funciona cuando se aplica, pero vive en 3 módulos piloto de 76, no en el diseño por defecto.

**No es un problema de contenido.** Es un problema de diseño de actividad: la mayoría de módulos podría ganar una sola actividad corta de "decide sin que te digan los pasos" (como ya hace el Módulo 18) sin necesitar más contenido nuevo — ver recomendación P1 en Roadmap (§35).

---

## 5. Auditoría técnica

Ver detalle completo en `arquitectura-tecnica-audit.md`. Hallazgos reales (código leído directamente, no inferido):

- **P1**: `src/lib/progress.ts` (store académico más crítico: módulos, quiz, labs, checklist, notas) es el único de 6 stores `persist` de Zustand **sin** `version`/`migrate` — los otros 5 sí lo tienen. Riesgo real si cambia el esquema a futuro: estado inconsistente silencioso en usuarios existentes, sin guardrail de saneamiento.
- **P2**: 3 componentes cliente grandes (`interactive-practice-client.tsx` 915 líneas, `practice-workspace-client.tsx` 734, `quiz-panel.tsx` 601) mezclan UI+lógica sin test unitario propio, solo validados por e2e (~17 min de feedback).
- **P2 (arquitectura de CI)**: el pipeline de Vercel (producción real) no tiene gate visible en el `ci.yml` de este repo — es una dependencia externa no verificada desde aquí.
- **Positivo verificado con evidencia concreta**: 0 `any`, 0 TODOs olvidados, 1 solo uso de patrón potencialmente inseguro (`mermaid`, mitigado con `securityLevel: "strict"`), `rehype-raw` ausente del renderer de markdown (cierra XSS por diseño), `progress-backup.ts` con defensas reales contra prototype pollution/tamaño/versión. Conteos de `CLAUDE.md` confirmados exactos contra `validate:content`.

---

## 6. Auditoría de arquitectura (producto/plataforma)

- Navegación y rutas: sin inconsistencias nuevas detectadas (las de `professional-routes.ts` ya se cerraron en sesiones previas).
- UX de progresión: el checklist de `/portafolio` es real (lee el store de progreso) pero binario y con lista de labs hardcodeada por perfil — no se actualiza dinámicamente ni distingue antigüedad de la evidencia.
- Accesibilidad: 39 componentes usan `aria-*`, incluidos los de mayor riesgo de interacción; consistente con el test e2e de skip-to-content ya existente.
- Sin inconsistencias nuevas de números de módulos/labs/rutas — los conteos declarados en CLAUDE.md son exactos.

---

## 7. Auditoría Power Platform

Confirmado por evidencia de mercado (§15-16): Power Apps, Power Automate y Dataverse son las skills de mayor frecuencia en vacantes reales encontradas (~20/28, ~18/28 y ~12/28 respectivamente) — el currículo las cubre en profundidad desde Básico hasta Avanzado, consistente con la demanda. Copilot Studio pasó de feature mencionada a **rol dedicado** en el mercado (6 vacantes específicas encontradas) — valida la decisión, ya ejecutada esta sesión, de reescribir el Módulo 22 al modelo de agentes. Gobierno/administración: el mercado ya habla en términos PPAC-nativo/Managed Environments/DLP/Entra ID, sin exigir CoE Starter Kit como núcleo — consistente con el enfoque ya adoptado en `JOB_READY_ADMIN_GOVERNANCE.md`.

---

## 8. Auditoría Dynamics 365

C#/.NET (plugins) sigue siendo requisito frecuente en vacantes de Technical Consultant/CE Developer (6/8 de esas vacantes) — no es skill en declive, confirma la relevancia continua del Módulo 23. Redundancia no documentada entre Módulo 20 y los módulos D365 transversales (§3). Certificaciones MB-210/MB-230 confirmadas vigentes (no deprecadas). PL-600 sigue apareciendo en JDs agregadas de Solution Architect pese a estar retirado desde 30-jun-2026 — el mercado de agregadores va rezagado frente a Microsoft (ver §16).

---

## 9. Auditoría Azure

El stack de integración (Functions, Service Bus, APIM, Logic Apps) se cubre con código de calidad profesional real (Módulo 24, confirmado en auditoría curricular). **Hallazgo de vigencia inicial descartado tras verificación directa contra Microsoft Learn (ver §20)**: el Módulo 29 (Azure AD B2C para Power Pages) ya tenía la terminología correcta; no requirió cambios.

---

## 10. Auditoría DevOps / ALM

Punto fuerte confirmado: Módulo 19 (Gherkin, Azure Boards, `AB#<id>`) y LAB-111 (RPA deployment/rollback) son genuinamente sólidos en ALM operativo. Hueco real: ningún lab practica un ciclo de rollback de una solución Dataverse/Power Platform en producción (solo conceptual fuera de RPA), y release management con gates de aprobación multi-componente no tiene práctica dedicada.

---

## 11. Auditoría Security / Governance

Sin hallazgos nuevos de contenido (ya cerrado en auditorías previas: DLP, mínimo privilegio, antipatrón "dar System Administrator" explícitamente prohibido). A nivel de plataforma (código), sin hallazgos de seguridad críticos (§5/§6).

---

## 12. Auditoría IA

Ver detalle completo en `empleabilidad-ia-audit.md`. El nivel `ia` (42-56) tiene **fuerte asimetría interna**: 7 módulos (42, 45, 47, 48, 49, 50, 51) exigen inducir un fallo a propósito y corregirlo con criterio explícito de evaluación — competencia profesional real, con el Módulo 51 como capstone agentic genuino sobre el propio repositorio del curso. Los otros 5 (43, 44, 46, 54, 55) son mayormente expositivos/feature-tour. **Gap no cubierto antes**: no hay disciplina de "AI evaluation" (evaluar prompts/agentes en sí, no solo su output) ni un marco formal de "Responsible AI" (fairness/transparencia/explicabilidad) — ambos temas crecientes en vacantes de roles de IA.

---

## 13. Auditoría RPA

Cobertura de mercado débil en evidencia verificable (la mayoría de resultados fueron agregadores genéricos sin JD individual citable), pero consistente donde hay evidencia: Power Automate Desktop es la skill nombrada en las 5 vacantes RPA encontradas. LAB-111 es, por evidencia directa de la auditoría de labs, el lab con mejor cobertura de ALM operativo de todo el currículo (deployment checklist, rollback con orden de reversión, runbook unattended).

---

## 14. Auditoría de empleabilidad

No existe hoy un motor de Job-Ready scoring (§31). Todo el sistema de progreso es autoreporte sin verificación independiente (§29). El checklist de `/portafolio` es real pero estático/binario. Las guías JOB_READY (11 archivos, ya auditados íntegros en sesión previa) son honestas y detalladas — la brecha es de producto, no de contenido guía.

---

## 15. Auditoría de mercado laboral

Ver detalle completo en `mercado-laboral.md`. **28 vacantes/fuentes reales** registradas (empresas nombrables: Accenture, Deloitte, Cognizant, Globant, Guidehouse, Rockwell Automation, GlobalLogic, Vbeyond, Apex Systems, Experis, TIVIT Colombia, Amaris Consulting, entre otras). Cobertura honesta por rol:

- **Buena cobertura**: Power Platform Developer, D365 Technical Consultant/CE Developer, Copilot Studio Developer, Power Platform Administrator.
- **Cobertura media**: D365 Functional Consultant, Solution Architect.
- **Cobertura débil**: RPA Developer puro, "AI Solution Architect" como título exacto (no se encontró ninguna vacante con ese título literal).
- **Sin evidencia verificable**: EPAM, NTT DATA, Capgemini, Infosys, TCS, HCLTech, SoftwareOne, Avanade, Hitachi, Devoteam, KPMG, PwC, EY en este ecosistema específico (aparecen en búsquedas genéricas, sin JD puntual citable).

Salarios reales encontrados: Power Platform Developer remoto en US, US$106K-157K/año (senior) y US$67K-87K/año (junior); UK £40K-65K/año; D365 Functional Consultant US, promedio US$110K/año; Colombia (Bogotá), COP 4.5-8M/mes para desarrollador junior-mid — brecha salarial grande frente a remoto internacional, dato relevante para comunicar en empleabilidad. Dos cifras colombianas adicionales (COP 40-102M/mes) se marcan explícitamente como no confiables por la fuente misma.

---

## 16. Comparación con ofertas reales

Hallazgo clave con implicación directa para el roadmap de contenido: **ninguna de las 28 vacantes reales pide AB-400, AB-210 o AB-100 por nombre** — esos códigos solo aparecen en blogs/guías de certificación, no en texto de vacante real. En cambio, **PL-600 (oficialmente retirado el 30-jun-2026) sigue apareciendo en JDs agregadas de Solution Architect**. Conclusión operativa: el contenido técnico nuevo (agentes, IA) sí es exigido por el mercado ya hoy (Copilot Studio como rol dedicado lo confirma), pero sería prematuro para PlanEstudio asumir que el mercado ya exige los nuevos *códigos de examen* por nombre — debe seguir enseñando el contenido vigente sin sobre-indexar en el nombre exacto del examen nuevo.

---

## 17. Matriz Skill → Mercado → PlanEstudio

Metodología: cobertura en PlanEstudio estimada de la muestra curricular (14 módulos íntegros + clasificación de 76); frecuencia de mercado de la tabla de 28 vacantes/fuentes de `mercado-laboral.md`. Son estimaciones direccionales, no un censo.

| Competencia | PlanEstudio | Mercado (muestra 28) | Importancia | Gap | Acción |
|---|---|---|---|---|---|
| Power Apps (Canvas+Model-Driven) | 🟢 Adecuada | Muy alta (~20/28) | Crítica | Ninguno | Mantener |
| Power Automate (cloud) | 🟢 Adecuada | Muy alta (~18/28) | Crítica | Ninguno | Mantener |
| Dataverse | 🟢 Adecuada | Alta (~12/28) | Crítica | Ninguno | Mantener |
| C#/.NET plugins | 🟢 Adecuada | Alta en Dev/Tech Consultant (6/8) | Alta | Ninguno | Mantener |
| Copilot Studio / agentes | 🟢 Adecuada (tras reescritura de esta sesión) | Alta y creciendo (6 vacantes dedicadas) | Alta, creciente | Cerrado esta sesión | Monitorear evolución 6-12 meses |
| PPAC / Managed Environments / DLP | 🟢 Adecuada | Alta en Admin | Alta | Ninguno | Mantener |
| Monitoreo/Application Insights hands-on | 🔴 Crítica faltante | Transversal (mencionado en auditorías previas como skill de mercado) | Alta | Grande — solo conceptual en 73 labs | Diseñar 1 lab hands-on, no agregar módulo |
| Trabajo en equipo Agile (Daily/PR review simulado) | 🔴 Crítica faltante | Alta (toda vacante asume trabajo en equipo) | Alta | Grande — 0/73 labs lo practican | Diseñar simulación, no módulo nuevo |
| Disaster recovery/backup | 🟠 Insuficiente | Media | Media | Ausente en labs | Diseñar 1 práctica dedicada |
| AI evaluation (evaluar prompts/agentes) | 🟠 Insuficiente | Creciente, sin evidencia cuantificada en esta muestra de mercado | Media-alta, creciente | Real | Agregar actividad a módulo existente, no módulo nuevo |
| RPA Power Automate Desktop | 🟢 Adecuada | Alta en el grupo RPA (5/5) | Media (nicho) | Ninguno | Mantener |
| Azure AD B2C (identidad Power Pages) | 🟢 Adecuada (verificado, sin cambios) | No evaluado en mercado (tema de infraestructura, no de JD) | Media | Ninguno — hallazgo inicial descartado tras verificación, ver §20 | Mantener |

---

## 18. Matriz por cargo profesional

(Ver mapas detallados en §23.) Resumen: los perfiles con mejor cobertura simultánea de contenido + evidencia de mercado son **Power Platform Developer** y **D365 Technical Consultant**. El perfil con mayor brecha de evidencia de mercado (no de contenido) es **RPA Developer puro** y **AI Solution Architect** como título dedicado — el contenido existe, pero no se pudo confirmar con la misma fuerza que el mercado ya use esos títulos exactos a gran escala.

---

## 19. Gaps críticos

Consolidado de los 5 frentes, solo lo no cerrado ya en sesiones previas:

1. ~~Azure AD B2C (Módulo 29)~~ — descartado tras verificación directa (ver §20); no es un gap real.
2. **P1** — Monitoreo/observability real ausente en los 73 labs (solo conceptual).
3. **P1** — 0 simulaciones de ceremonia Agile/trabajo en equipo en todo el catálogo de labs.
4. **P1** — Disaster recovery/backup ausente en la práctica.
5. **P1** — Sistema de progreso 100% autoreporte, sin ningún nivel "Verified" instrumentado.
6. **P1** — No existe motor de Job-Ready scoring/matching contra requisitos de vacante.
7. **P1** — `progress.ts` sin versionado de esquema persistido (riesgo técnico real, no de contenido).
8. **P2** — Redundancia no documentada Módulo 20 vs. D365 transversal.
9. **P2** — Ningún capstone recorre el ciclo completo de 14 etapas (falta monitoreo, incidente post-launch, presentación en vivo).
10. **P2** — Inglés profesional practicado (no solo explicado) concentrado en un único lab (LAB-79).
11. **P2** — Asimetría interna en el nivel IA: 5/14 módulos sin forzar fallo/corrección.
12. **P3** — Ausencia de disciplina formal "AI evaluation"/Responsible AI.

---

## 20. Contenido obsoleto

**Hallazgo inicial de esta auditoría — descartado tras verificación directa contra Microsoft Learn (corrección aplicada en la misma sesión):**

La hipótesis inicial (basada en fuentes de blog de terceros, ej. guptadeepak.com/ciam-compass) era que Microsoft retiraba los tenants Azure AD B2C existentes el 15-mar-2026. **Verificación directa contra el FAQ oficial de Microsoft Learn de Azure AD B2C mostró que esto es impreciso**: el 15-mar-2026 es la fecha de **downgrade automático de licencia P2→P1** (pérdida de ID Protection en B2C), no un retiro de tenant. Microsoft confirma explícitamente que los tenants B2C ya provisionados siguen soportados ("operational commitments including SLAs, security updates, and compliance... supported until at least May 2030"); solo se cerró la venta a clientes nuevos desde el 1-may-2025.

El **Módulo 29** ("Power Pages Avanzado y Azure AD B2C") ya tenía, de una sesión anterior, exactamente esta distinción correcta documentada en su propio cuerpo ("Microsoft no anunció una fecha de retiro para los tenants ya provisionados"). **No se requirió ningún cambio al módulo** — se verificó, se confirmó correcto, y se dejó intacto.

**Lección operativa para esta y futuras auditorías**: una afirmación de vigencia sourced solo en blogs de terceros (sin verificación directa contra Microsoft Learn) puede introducir un falso positivo — exactamente el tipo de error que esta sesión ya había corregido una vez antes (un fork citó una fuente de terceros con una afirmación más fuerte sobre Copilot Studio que la oficial). Este hallazgo demuestra que la disciplina de verificación directa aplicada en el resto de la sesión (PL-400, MB-280) es la que evitó publicar una corrección innecesaria al Módulo 29.

Sin otros hallazgos de obsolescencia en esta auditoría — las 2 auditorías de vigencia previas de esta sesión (PL-400, PL-200, MB-280, PL-600, Microsoft Foundry) ya cerraron su alcance correctamente, y este ítem queda también cerrado (sin acción, contenido ya correcto).

---

## 21. Contenido redundante

Módulo 20 (D365 CE Avanzado) vs. Módulos 58/59/61/62/64 (D365 transversal): mismos conceptos de SLA/Entitlements/Unified Routing sin frase de enlace que aclare si es profundización intencional o duplicado por descuido. **Acción recomendada: no eliminar contenido** — añadir una línea en "Conexión con módulo anterior" de cada módulo D365 transversal aclarando qué profundiza sobre el Módulo 20.

---

## 22. Contenido faltante

**Ningún hallazgo de esta auditoría recomienda un módulo nuevo** (regla §29 respetada). Los gaps reales (monitoreo, Agile en equipo, disaster recovery, AI evaluation) se cierran con **actividades/labs nuevos dentro de estructura existente**, no con módulos adicionales — ver Roadmap §35.

---

## 23. Labs faltantes

Propuestas concretas, cada una cerrando un gap ya documentado, sin inflar el catálogo de 73 a un número arbitrario:

1. **Lab de monitoreo hands-on**: configurar Application Insights sobre una solución existente (reutilizar una ya construida en un lab previo), generar una alerta real, diagnosticar con el dashboard. Cierra gap P1 de §19.
2. **Simulación de ceremonia Agile con "segunda persona"**: un Product Owner simulado (vía texto estructurado o rol de IA) que da feedback específico sobre una User Story entregada, exige re-negociación de alcance y cierre de un Pull Request con comentarios a resolver. Cierra gap P1 de trabajo en equipo.
3. **Práctica de disaster recovery**: backup/restore de una solución Dataverse (export/import de solución + datos), simular pérdida y medir RTO/RPO. Cierra gap P1.
4. **Extensión de un capstone existente (no uno nuevo)** con una etapa de "incidente post-launch + presentación en vivo" — el candidato más natural es LAB-90 (ya tiene Discovery→Roadmap→UAT) o LAB-63 (Developer), añadiendo el tramo final que falta.

---

## 24. Capstones recomendados

No se recomienda un capstone nuevo desde cero. Se recomienda **extender LAB-90 o LAB-63** (ver §23.4) para cerrar la brecha de "ningún capstone recorre el ciclo completo" — es la intervención de menor esfuerzo con mayor cobertura del gap más visible de la auditoría de labs.

---

## 25. Production Operations

Resumen de `labs-capstones-audit.md` (detalle completo ahí): **incident management y RCA están genuinamente bien cubiertos con práctica real** (INC-001 a INC-008, LAB-92/JR-012 con evidencia de Plugin Trace Log y descarte de hipótesis) — es el punto más fuerte verificado de todo el currículo en esta dimensión. Monitoreo/telemetría, disaster recovery y release management con gates multi-componente son los huecos reales, confirmados con evidencia (grep estructural + lectura íntegra), no supuestos.

---

## 26. Inglés profesional

LAB-79/JR-009 es la **única** práctica real (no solo guía) de inglés técnico en todo el catálogo: pitch de 45s, demo de 2 min, 8+ preguntas respondidas en inglés. `JOB_READY_INTERVIEW_READINESS.md` da plantillas y frases honestas (ya confirmado en auditoría previa), pero es guía, no ejecución forzada. El inglés profesional vive concentrado en un solo lab al final de la ruta, no distribuido como práctica recurrente.

---

## 27. Trabajo en equipo

Grep estructural sobre los 73 labs: **0 coincidencias** de "Daily", "Retrospective", "Sprint", "Backlog", "Pull Request", "Code Review" como ejercicio simulado. El Módulo 19 enseña el marco conceptual (Gherkin, Azure Boards, jerarquía Epic→Story→Task) a Nivel 1-2, pero ningún lab simula la ceremonia. **Conclusión honesta: PlanEstudio entrena hoy trabajo individual — construir, diagnosticar y documentar solo.**

---

## 28. Portfolio

Las guías (`PORTAFOLIO_PROFESIONAL.md` + 5 guías JOB_READY, ya auditadas íntegras en sesión previa) son fuertes y honestas: estructura de README consistente, retrospectiva por proyecto, ejemplos de frase honesta para CV/LinkedIn. **La brecha es de producto, no de guía**: la app no ayuda a empaquetar la evidencia — es 100% trabajo manual del estudiante fuera de la plataforma, y el checklist de `/portafolio` es binario/estático, sin fecha de verificación por lab ni actualización dinámica.

---

## 29. Certification / Verification

Ningún mecanismo de "Verified" (evaluación independiente) existe hoy en el código. `markModuleComplete` es un toggle sin validación; el quiz se autoevalúa en cliente sin backend. El sistema opera en el nivel **Completion**, con una capa de **Demonstrated potencial** que depende de que el estudiante siga las guías honestamente — pero el producto no lo confirma ni lo exige como gate.

---

## 30. Labor Market Intelligence

Propuesta de sistema (no implementado, factibilidad evaluada en §31):

- **Fuentes**: WebSearch/APIs de bolsas de empleo (LinkedIn Jobs API si hay acceso, Indeed, Greenhouse/Workday cuando sea accesible), con registro estructurado de empresa/cargo/skills/fecha/fuente — exactamente el formato ya usado en `mercado-laboral.md` de esta auditoría.
- **Metodología de scoring**: frecuencia de skill en muestra de vacantes recientes (ventana rodante de 90 días) ponderada por si la skill aparece como "required" vs. "nice to have" cuando el JD lo distingue.
- **Frecuencia de actualización recomendada**: trimestral — no hace falta tiempo real; los ciclos de certificación de Microsoft y de contratación cambian en meses, no en días.
- **Almacenamiento**: un archivo de datos versionado en el repo (JSON/Markdown con tabla), igual que esta auditoría ya produjo, no una base de datos nueva — mantiene la filosofía de "contenido como archivos" del repo.
- **Trazabilidad**: cada hallazgo de skill-demand debe citar fuente y fecha, igual que se hizo en esta auditoría — sin esto, el sistema degenera en afirmaciones no verificables.
- **Limitación honesta**: WebFetch falló consistentemente contra Workday/Greenhouse (JS dinámico) en esta auditoría — cualquier implementación futura de este sistema necesitará una fuente de datos más confiable que scraping directo (API oficial de una bolsa de empleo, o un servicio de terceros), no asumir que WebSearch/WebFetch escalan a actualización automática confiable.

---

## 31. Job-Ready System — factibilidad real

Lo que existe hoy: `employability.ts` y `labor-profiles.ts` son **datos estáticos** (perfil→lista fija de labs→checklist binario), sin motor de matching. `/portafolio` lee el store de progreso real pero solo pinta ✅/⬜ contra una lista hardcodeada.

Lo que haría falta para un sistema real (los 3 componentes, ninguno existe hoy):
1. Estructura de datos de "requisitos de vacante" (aunque sea manual/curada, no necesita scraping en vivo).
2. Motor de matching skill↔evidencia con pesos.
3. Lógica de recomendación de gaps ("qué 3 skills aprender después").

**Ejemplo Power Platform Developer** (aplicando la pregunta exigida por la auditoría con los datos reales disponibles): de las ~12 skills de mayor frecuencia en las 28 vacantes de `mercado-laboral.md` (Power Apps, Power Automate, Dataverse, C#/.NET, JavaScript cliente, PCF, Custom Connectors, ALM/Git, Copilot Studio, Azure Functions, Power BI, seguridad/DLP), el currículo de PlanEstudio cubre **las 12 con contenido real** (confirmado por auditoría curricular + arquitectura). El problema no es de cobertura de contenido — es que **hoy ningún código calcula ese porcentaje automáticamente**; este número (12/12 ≈ 100% de cobertura de contenido) se calculó manualmente para este ejemplo, no por un motor del producto.

---

## 32. Nueva arquitectura de progresión profesional

Propuesta mínima viable, consistente con la regla §29 (no agregar contenido antes de agotar práctica/evaluación):

1. Mantener las rutas por cargo (`professional-routes.ts`) como la unidad de progresión — ya corregidas esta sesión.
2. Agregar una capa ligera de "evidencia con fecha" al store de progreso (cuándo se completó cada lab, no solo si), para poder distinguir competencia reciente de antigua — esto habilita después cualquier scoring real.
3. No construir un motor de matching de vacantes en tiempo real (fuera de alcance razonable de un curso individual) — sí curar manualmente, trimestralmente, una tabla de "requisitos típicos por cargo" (el insumo de §30) contra la cual comparar el progreso del estudiante.

---

## 33. Definición de "Estudiante Íntegro"

Un estudiante íntegro de PlanEstudio es aquel que, al completar una ruta profesional, puede:

- **Técnica**: construir una solución Power Platform/D365 correcta y mantenible, con código real (no pseudocódigo) y buenas prácticas de la plataforma.
- **Negocio**: traducir un requerimiento ambiguo en una solución justificada, no solo ejecutar una receta.
- **Arquitectura**: elegir entre alternativas razonables y defender la elección con trade-offs explícitos (patrón ya validado en Módulo 18).
- **Seguridad**: aplicar mínimo privilegio y DLP por defecto, nunca como atajo de "dar System Administrator" (antipatrón ya enseñado explícitamente).
- **Calidad**: probar su propio trabajo y diagnosticar una falla con evidencia, no con suposición.
- **Comunicación**: explicar su trabajo a un no-técnico y, en inglés, a un entrevistador o cliente.
- **Ética/IA responsable**: usar IA generativa revisando el output, sin aceptar código o decisiones no verificadas, y sin pegar secretos/datos sensibles en un prompt.
- **Documentación**: dejar evidencia trazable de lo que hizo y por qué.
- **Trabajo en equipo**: ceder y recibir feedback de otro rol (hoy es el gap más grande — ver §27).
- **Honestidad de alcance**: declarar explícitamente qué es simulado y qué es experiencia real, sin inflar el CV — ya es una fortaleza documental confirmada de PlanEstudio.

---

## 34. Nueva rúbrica de graduación

Propuesta de pesos (no implementada, requiere decisión del equipo de producto):

| Dimensión | Peso | Evidencia requerida |
|---|---|---|
| Knowledge (quiz/diagnóstico) | 15% | Ya instrumentado |
| Hands-on (labs completados con evidencia real) | 25% | Ya instrumentado parcialmente (autoreporte) |
| Problem solving (reto sin pasos) | 20% | Hoy débil — requiere más actividades tipo Módulo 18 |
| Arquitectura/decisión justificada | 15% | Ya existe en algunos capstones |
| Seguridad | 10% | Ya cubierto conceptualmente, falta instrumentar verificación |
| Comunicación/inglés | 10% | Hoy concentrado en 1 lab (LAB-79) |
| Trabajo en equipo | 5% (debería crecer cuando exista la práctica) | Hoy no instrumentable — gap §27 |

Nota: estos pesos son una propuesta de punto de partida, no un cálculo derivado de datos — se marcan como tales.

---

## 35. Roadmap P0/P1/P2/P3

| # | Problema | Evidencia | Prioridad | Esfuerzo | Solución propuesta | Afecta |
|---|---|---|---|---|---|---|
| 1 | ~~Azure AD B2C "en retiro"~~ — **descartado**: verificado contra Microsoft Learn, el módulo ya era correcto (15-mar-2026 es downgrade de licencia P2→P1, no retiro de tenant) | Verificación directa Microsoft Learn (§20) | **Cerrado sin acción** | — | Ninguna — contenido ya vigente | Módulo 29 (sin cambios) |
| 2 | `progress.ts` sin versionado de esquema persistido | Lectura directa de código (§5) | **P0** | Bajo | Agregar `version`+`migrate` replicando patrón de los otros 5 stores | `src/lib/progress.ts` |
| 3 | Monitoreo/observability sin práctica hands-on | Grep + lectura de labs (§25) | P1 | Medio | 1 lab nuevo de Application Insights sobre solución existente | Nuevo lab, no módulo |
| 4 | 0 simulación de Agile en equipo | Grep estructural (§27) | P1 | Medio-alto | 1 simulación con "segunda persona" (PO/reviewer simulado) | Nuevo lab/práctica |
| 5 | Disaster recovery ausente | Lectura de labs (§25) | P1 | Bajo-medio | 1 práctica de backup/restore con RTO/RPO | Nuevo lab |
| 6 | Sin nivel "Verified" instrumentado | Lectura de `progress.ts` (§29) | P1 | Alto (decisión de producto) | Decidir si se instrumenta revisión externa/IA antes de construir | Arquitectura de producto |
| 7 | Sin motor de Job-Ready scoring | Lectura de `employability.ts`/`labor-profiles.ts` (§31) | P1 | Alto | Evaluar factibilidad de versión mínima (matching manual curado, no tiempo real) | Nuevo subsistema |
| 8 | Redundancia Módulo 20 vs D365 transversal | Lectura curricular (§3/§21) | P2 | Muy bajo | Una frase de enlace por módulo afectado | 5 módulos D365 |
| 9 | Ningún capstone cierra el ciclo completo | Auditoría de labs (§24) | P2 | Medio | Extender LAB-90 o LAB-63, no crear uno nuevo | 1 lab existente |
| 10 | Inglés profesional concentrado en 1 lab | Auditoría de labs (§26) | P2 | Bajo-medio | Distribuir 1-2 checkpoints de inglés en otros labs ya existentes | 2-3 labs |
| 11 | Asimetría interna nivel IA (5/14 expositivos) | Auditoría empleabilidad/IA (§12) | P2 | Bajo | Agregar actividad de fallo/corrección a Módulos 43,44,46,54,55 | 5 módulos |
| 12 | Sin disciplina "AI evaluation"/Responsible AI | Auditoría empleabilidad/IA (§12) | P3 | Bajo-medio | Agregar sección a un módulo existente del nivel IA | 1 módulo |
| 13 | 3 componentes cliente grandes sin test unitario | Auditoría técnica (§5) | P3 | Medio | Extraer hooks/sub-componentes cuando se toquen de todos modos | 3 componentes |

---

## 36. Plan de implementación

Orden recomendado, respetando que P0 se resuelve primero por fecha/riesgo, y que el resto no requiere secuencia estricta entre sí:

1. **Inmediato**: ítem #2 (P0) — el ítem #1 (Azure AD B2C) quedó cerrado sin acción tras verificación directa (ver §20).
2. **Corto plazo (1-2 sprints)**: ítems #8, #10, #11, #13 — bajo esfuerzo, cierran hallazgos concretos sin requerir decisión de producto.
3. **Mediano plazo**: ítems #3, #4, #5, #9 — requieren diseñar un lab/práctica nuevo cada uno, esfuerzo medio, sin dependencia de decisiones de arquitectura de producto.
4. **Decisión de producto previa a implementar**: ítems #6 y #7 — ambos de alto esfuerzo y con implicaciones de alcance (¿quiere PlanEstudio seguir siendo un curso individual o evolucionar a plataforma con verificación externa?). Recomendación: decidir esto explícitamente antes de construir nada, no implementar a medias.

---

## 37. Riesgos

- **Riesgo de sobre-construcción**: los ítems #6 y #7 del roadmap (Verified, Job-Ready scoring) son fácilmente sobredimensionables — el riesgo es construir un sistema complejo sin validar primero si agrega valor real frente al costo de mantenimiento.
- **Riesgo de expectativa**: la sobrecarga curricular (9 especializaciones combinadas) no es un error pero si no se comunica explícitamente ("nadie debe completar las 76, elige tu ruta"), genera expectativas irreales en estudiantes nuevos.
- **Riesgo de evidencia de mercado**: la cobertura de vacantes reales es desigual (fuerte en Power Platform Developer, débil en RPA puro y AI Solution Architect) — decisiones de contenido para esos perfiles deben tratarse con más cautela que las de perfiles con buena evidencia.

---

## 38. Métricas de éxito

Propuestas, condicionadas a que se implementen los ítems del roadmap:

- % de labs con al menos una actividad de "decide sin pasos" (hoy: bajo, no cuantificado con precisión en esta auditoría — requeriría clasificación completa de 73 labs).
- Existencia de al menos 1 lab hands-on de monitoreo, 1 de disaster recovery, 1 de simulación Agile con segunda persona (hoy: 0 de los 3).
- `progress.ts` con `version`+`migrate` (binario: hecho/no hecho).
- Decisión explícita documentada sobre si se construye o no un motor de Job-Ready scoring (binario: decidido/no decidido).

---

## 39. Veredicto final

### ¿PlanEstudio forma estudiantes que conocen tecnología?
**Sí.** Contenido técnico de alta calidad real, código compilable, vigencia mayormente correcta (con la excepción nueva del Módulo 29, ya identificada y con plazo claro para actuar).

### ¿Forma estudiantes que saben construir soluciones?
**Sí, de forma parcial-alta.** Los labs técnicos (plugins, PCF, Canvas Apps, desktop flows) producen artefactos reales y funcionales cuando se completan con evidencia honesta.

### ¿Forma estudiantes capaces de resolver problemas sin guía?
**Parcial.** El troubleshooting/RCA es el punto más fuerte verificado (INC-001 a INC-008, LAB-92). Pero el cuerpo de los módulos (13/14 de la muestra) no exige esto — depende de que el estudiante haga también el lab correspondiente, que es opcional en la práctica.

### ¿Forma estudiantes capaces de diseñar soluciones?
**Parcial, con un punto de evidencia fuerte y aislado.** El Módulo 18 (árbol de decisión + ADR) demuestra que el patrón funciona cuando se diseña así — pero es la excepción (1 de 14 en la muestra), no la norma.

### ¿Forma estudiantes capaces de operar soluciones en producción?
**Parcial-bajo.** Fuerte en incident response/RCA y en ALM de deployment (LAB-111). Débil-ausente en monitoreo/observability real y disaster recovery — ambos puramente conceptuales en los 73 labs.

### ¿Forma estudiantes capaces de trabajar profesionalmente?
**Parcial.** Fuerte en documentación y honestidad de alcance (confirmado repetidamente). **No** en trabajo en equipo real — 0 simulaciones de Agile/PR review entre pares en todo el catálogo de labs.

### ¿Forma estudiantes preparados para entrevistas reales?
**Parcial.** Las guías JOB_READY son honestas y detalladas, y existe un lab real de práctica de entrevista en inglés (LAB-79) — pero es un único punto de práctica forzada, no distribuido.

### ¿Está alineado con ofertas laborales reales?
**Sí, con huecos de evidencia declarados.** Las skills de mayor demanda confirmada (Power Apps, Power Automate, Dataverse, C#/.NET, Copilot Studio) están todas cubiertas en profundidad. La alineación es más débil, por falta de evidencia de mercado (no de contenido), para RPA puro y roles de IA con título dedicado.

### ¿Está actualizado tecnológicamente?
**Sí.** La vigencia técnica, verificada en esta sesión contra Microsoft Learn directamente en múltiples puntos (PL-400, MB-280, Copilot Studio, y el propio Módulo 29/Azure AD B2C, cuyo hallazgo inicial se descartó tras verificación), está correcta.

### ¿Puede demostrar las competencias del estudiante?
**No, de forma verificable hoy.** Todo el sistema de progreso es autoreporte; no existe ningún mecanismo de verificación independiente instrumentado en el producto. Las guías recomiendan buscar validación externa, pero esto depende enteramente de la iniciativa del estudiante.

### ¿Puede producir un estudiante "Job Ready"?
**Parcial.** El contenido y las guías son consistentes con "Job Ready" en la intención y en varios artefactos concretos (labs JR-0XX bien diseñados). El producto no puede medirlo ni confirmarlo — "Job Ready" hoy es una aspiración documentada, no un estado verificable por la plataforma.

### ¿Puede formar un profesional integral?
**Parcial.** Cubre con fuerza real la dimensión técnica, de documentación, de seguridad conceptual y de honestidad profesional. Las dimensiones que faltan para "integral" en el sentido estricto definido en §33 son trabajo en equipo real y verificación independiente de competencia — ambas, gaps de producto y de diseño de práctica, no de contenido.

---

## Apéndice — Archivos fuente de esta auditoría

Hallazgos completos (no resumidos) disponibles en el directorio de trabajo de la sesión: `mercado-laboral.md`, `curriculum-audit.md`, `labs-capstones-audit.md`, `arquitectura-tecnica-audit.md`, `empleabilidad-ia-audit.md`. Este documento maestro los consolida; para el detalle línea por línea de cada hallazgo, consultar el archivo correspondiente.

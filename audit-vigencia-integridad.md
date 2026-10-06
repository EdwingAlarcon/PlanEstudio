# Auditoría de vigencia técnica e integridad profesional — PlanEstudio
Fecha de ejecución: 2026-10-06. Auditoría de solo lectura — ningún archivo del repo fue modificado.

Alcance: muestreo dirigido (no re-auditoría completa de los 149 archivos ya cubiertos por la
"Auditoría de vigencia contra Microsoft Learn" cerrada el 2026-09-06, documentada en
`SPRINT_HANDOFF.md`). Esta auditoría es complementaria, no sustitutiva.

---

## Parte A — Vigencia técnica

### A1. [ALTA CONFIANZA - VERIFICADO] PL-400 deja de poder registrarse el 16 de octubre de 2026 — a 10 días de hoy

**Afirmación verificada:** Microsoft retira el registro a PL-400 el 16 de octubre de 2026, el mismo
día en que abre su reemplazo AB-400. PL-400 sigue siendo válido en el transcript de quien ya lo
tiene (renovación anual gratuita), pero nadie podrá *inscribirse* a examen después de esa fecha.

**Fuente:** búsqueda web (modo extended) — certcrush.app "PL-400 Is Becoming AB-400 on 16 October
2026"; examsnap.com, roadmap de certificaciones Power Platform 2026.

**Evidencia en el repo:** 13 módulos del nivel `avanzado`
(`app-elearning/content/modules/avanzado/18-*.md` a `30-*.md`, incluidos 19 y 22 leídos para esta
auditoría) declaran `certification: "PL-400"` en su frontmatter, sin ninguna nota sobre la
transición a AB-400 — a diferencia de PL-200, que sí tiene la nota de retiro (31 ago 2026) añadida
en el frontmatter de los 9 módulos de Intermedio según el handoff de sesión anterior.

**Recomendación concreta:** replicar en estos 13 módulos exactamente el mismo patrón ya usado para
PL-200 (nota de frontmatter/anotación, sin reescribir contenido técnico) indicando que PL-400 cierra
inscripciones el 16-oct-2026 y que AB-400 es su sucesor. Es una extensión mecánica de un patrón ya
aprobado, no una pieza de infraestructura nueva.

### A2. [ALTA CONFIANZA - VERIFICADO] PL-200 y PL-600: estado ya correctamente reflejado

PL-200 retira el 31 de agosto de 2026 (ya anotado, confirmado por búsqueda). PL-600 retiró el 30 de
junio de 2026 — el repo ya no vincula ningún módulo activo a PL-600 (`certification: "Arquitectura
Power Platform"` en su lugar, según CLAUDE.md). Sin hallazgos nuevos aquí; solo confirmación.

### A3. [ALTA CONFIANZA - VERIFICADO] "AI Builder"/"Azure AI Services (en transición a Foundry Tools)" — la redacción actual es correcta y ya está matizada

**Verificado:** Microsoft rebautizó "Azure AI Foundry" → "Microsoft Foundry" (Ignite 2025), y
"Foundry Tools" es efectivamente el nuevo nombre de lo que antes eran "Azure AI Services"/"Cognitive
Services" (confirmado vía Microsoft Learn: `learn.microsoft.com/.../ai-services-overview` habla de
"Use Foundry Tools in Fabric").

**Evidencia en el repo:** `app-elearning/content/modules/arquitecto/37-ai-builder-y-azure-ai-integrado.md`
(objetivo, línea 11) ya dice "Azure AI Services (en transición de nombre a 'Foundry Tools')" — lo cual
es precisamente correcto según la fuente verificada, no un error.

**Hallazgo real (menor):** el módulo nunca usa el término "Microsoft Foundry" (el nombre paraguas
actual que engloba Foundry Tools + Foundry Models + Agent Service), solo "Azure AI Services" y
"Azure OpenAI Service"/"Semantic Kernel" por separado. No es información falsa — Azure OpenAI
Service sigue siendo un producto real y ese es el nombre que seguirá apareciendo en el portal de
Azure — pero un estudiante que entreviste hoy puede beneficiarse de saber que el paraguas de marketing
se llama "Microsoft Foundry". **Recomendación:** agregar una frase breve en Conceptos Clave del
Módulo 37 vinculando "Azure OpenAI Service" al paraguas "Microsoft Foundry" actual, sin reescribir
las actividades prácticas (que siguen siendo técnicamente correctas: el endpoint, el API y el SDK no
cambiaron).

### A4. [ALTA CONFIANZA - VERIFICADO] Microsoft Fabric / Link to Microsoft Fabric — Módulo 35 está notablemente más actualizado que el promedio del repo

El Módulo 35 (`arquitecto/35-arquitectura-de-datos-fabric-synapse-y-medallion.md`) ya distingue
explícitamente "Link to Microsoft Fabric" (mecanismo actual recomendado) de "Azure Synapse Link for
Dataverse" (mecanismo anterior, catalogado hoy como "Other Links" en el portal) — este nivel de
precisión no es trivial y coincide con el estado actual de la documentación de Microsoft. No se
encontraron anuncios posteriores a septiembre 2026 que contradigan este contenido. Sin hallazgos de
corrección.

### A5. [REQUIERE VERIFICACIÓN MANUAL] Precio de Power Apps Premium sube de $20 a $22/usuario/mes desde enero 2027

**Fuente:** búsqueda web — anuncio del 9 de septiembre de 2026, primer incremento de precio en más de
5 años, efectivo 1-enero-2027.

No se encontró ningún módulo del repo que cite un precio específico de licencia por usuario (el
contenido tiende a hablar de "licencia Premium" sin cifra en USD), por lo que **no hay afirmación
puntual que corregir**. Se marca como "requiere verificación manual" solo para el caso de que algún
módulo de licenciamiento no muestreado en esta pasada sí incluya la cifra antigua — no se revisaron
los 76 módulos buscando precios explícitos.

### A6. [REQUIERE VERIFICACIÓN MANUAL] Renombre "Microsoft 365 Copilot" → "Microsoft Copilot" (guía de licenciamiento, sept. 2026)

**Fuente:** búsqueda web — licensingschool.co.uk, actualización de la guía de licenciamiento de
Power Platform de septiembre 2026.

Se buscó la cadena exacta "Microsoft 365 Copilot" en `app-elearning/content` y `docs/Recursos`: cero
coincidencias. No hay afirmación que corregir en el contenido muestreado. Dado que esta auditoría no
cubrió los 76 módulos completos, se marca como pendiente de verificación manual si se desea cerrar
con certeza total.

### A7. [ALTA CONFIANZA - VERIFICADO] Módulo 22 (Copilot Studio Avanzado) y Módulo 38 — sin hallazgos de obsolescencia

Ambos módulos fueron leídos íntegramente. El Módulo 22 usa terminología actual (Generative
Orchestration, Knowledge Sources, Microsoft Entra ID — ya no "Azure Active Directory" salvo como
referencia histórica correcta, "antes Azure Active Directory"). El Módulo 19 (ALM/CI-CD) referencia
correctamente `pac` CLI, Power Platform Build Tools y `microsoft/powerplatform-actions`, todos
vigentes. Sin hallazgos.

### Resumen Parte A

| # | Hallazgo | Confianza | Acción recomendada |
|---|---|---|---|
| A1 | PL-400 cierra registro 16-oct-2026, sin nota en 13 módulos | Alta | Replicar patrón de nota PL-200 en los 13 módulos de `avanzado/` |
| A3 | Falta mención de "Microsoft Foundry" como paraguas | Alta (hallazgo menor) | Una frase en Módulo 37, no reescritura |
| A5 | Precio Power Apps Premium — sin afirmación en el repo que corregir | Requiere verificación manual si se amplía el muestreo |
| A6 | "Microsoft 365 Copilot" → "Microsoft Copilot" — sin afirmación en el repo que corregir | Requiere verificación manual si se amplía el muestreo |

No se encontró ningún anuncio de Microsoft posterior a septiembre de 2026 que invalide contenido
técnico puntual de los módulos muestreados (22, 35, 37, 19, 38, más los 13 de avanzado revisados por
frontmatter). El hallazgo más urgente por plazo es A1.

---

## Parte B — Integridad profesional / habilidades blandas

Archivos leídos íntegramente: `JOB_READY_INTERVIEW_READINESS.md`, `JOB_READY_CRM_FUNCTIONAL.md`,
Módulo 38, Módulo 19, y 4 prácticas representativas (`sim-001`, `inc-001`, `ch-001`, `gl-setup-05`).
`JOB_READY_ADMIN_GOVERNANCE.md`, `JOB_READY_CRM_DEVELOPER.md`, `JOB_READY_DATA_MIGRATION_LEGACY.md`
y `PORTAFOLIO_PROFESIONAL.md` no se leyeron íntegramente en esta pasada (quedan fuera del
presupuesto de esta auditoría dirigida); no se afirma nada sobre su contenido.

### B1. Honestidad de alcance (lab vs. empleo) — fuerte, con evidencia concreta

`docs/Recursos/JOB_READY_INTERVIEW_READINESS.md`, sección "Principio central: evidencia sin
exagerar" (líneas 32-43), da una tabla explícita "Evita decir / Mejor di" ("Trabajé como consultor
Power Platform para una empresa ficticia" → "Desarrollé un capstone simulado..."). La sección
"Frases para reconocer límites sin sonar inseguro" (líneas 503-511) da frases concretas en inglés
para no inflar experiencia ("I have practiced this in a portfolio project, but I have not operated
it in a production tenant yet."). Esto es excepcionalmente explícito comparado con cursos
típicos del mercado, que rara vez entrenan a decir "no sé" con elegancia.

### B2. Documentación técnica y trazabilidad — fuerte, con mecanismo concreto, no solo principio

Módulo 19 (`avanzado/19-alm-y-ci-cd-con-azure-devops.md`), Actividad 19.6 (líneas 336-351): enseña
el mecanismo real `AB#<id>` de Azure Boards para vincular commits/PRs a Work Items automáticamente,
no solo "documenta bien tu código". Módulo 38, Actividad 38.4 (líneas 128-144): matriz de
trazabilidad requerimiento→historia→diseño→componente→UAT→evidencia→estado, presentada como "la
defensa profesional contra discusiones de alcance". Esto va más allá de teoría: da la tabla
literal que un consultor usaría en un proyecto real.

### B3. Seguridad y gobernanza (mínimo privilegio, DLP) — fuerte, verificado con evidencia de ejecución real, no solo de diseño

`app-elearning/content/practices/inc-001-seguridad-dataverse-oportunidades.md`: el incidente entero
gira sobre mínimo privilegio (un rol reducido mal diseñado deja a un owner team sin `Write`
efectivo). La rúbrica (líneas 43-59) penaliza explícitamente la "solución" de dar `System
Administrator` para desbloquear, y las "pistas falsas posibles" (líneas 99-103) incluyen
textualmente "Dar System Administrator para 'desbloquear'" como antipatrón a evitar, no como
atajo válido. `ch-001-solucion-solicitudes-empresariales.md`, sección "Restricciones" (línea 83):
"No uses System Administrator como rol operativo." DLP se cubre en Módulo 49
(`ia/49-seguridad-secretos-y-compliance.md`, líneas 17, 36, 57) con actividad práctica real de
revisar políticas DLP en Power Platform Admin Center, no solo mención de la palabra.

### B4. Metodologías ágiles / Scrum — cubierto con profundidad real, incluyendo Gherkin recién agregado

Módulo 19, Conceptos Clave (líneas 45-49) y Actividad 19.6: jerarquía Epic→Feature→User
Story→Task, Sprint Backlog vs. Product Backlog, Velocity como propiedad del equipo (no constante
universal, línea 21 del Módulo 38), y criterios de aceptación en formato Gherkin Given/When/Then
con ejemplo concreto de Dataverse. Esto confirma lo que CLAUDE.md reporta como adición reciente
tras el análisis de empleabilidad (gaps de "agile y Graph API" cerrados en `bd6db4e`), y la
implementación real coincide con lo documentado — no es solo una entrada de changelog sin
contenido detrás.

### B5. Trabajo en ambientes DEV/QA/PRD — cubierto, con práctica guiada de verificación activa (no solo lectura)

`gl-setup-05-confirmar-entorno-no-productivo-y-roles.md` es una práctica *guiada ejecutable*: pide
al estudiante confirmar en vivo (Maker Portal + Power Platform Admin Center) que el entorno donde va
a trabajar NO es producción, y detenerse si lo es ("Si el tipo es Production, **detente** — no
practiques ahí.", línea 66). Módulo 19 cubre pipelines multi-ambiente DEV→TEST→UAT→PROD con
aprobaciones. Esta es una de las piezas más fuertes del curso: no es un principio abstracto, es un
chequeo accionable con evidencia de captura de pantalla real exigida (`evidence.artifactTypes:
["real"]`, línea 23).

### B6. Preparación de portafolio defendible en entrevista — fuerte y bien integrado con el resto del curso

`JOB_READY_CRM_FUNCTIONAL.md`, sección "Evidencia de portafolio" (líneas 100-113) da una lista
concreta de qué debe contener un portafolio CRM Functional (documento funcional, matriz fit-gap,
casos UAT con pass/fail, etc.), y la sección "Pendientes que siguen abiertos y por qué" (líneas
175-201) es inusualmente honesta: documenta explícitamente qué brechas NO se pueden cerrar con
contenido simulado (experiencia laboral verificable, tenant productivo real, integraciones con
proveedores externos que requieren contrato) en vez de fingir que sí se cubren. Esto es una señal de
integridad fuerte — el curso no pretende sustituir experiencia real, lo dice por escrito.

### B7. Comunicación con stakeholders no técnicos — cubierto con ejemplo contrastivo concreto

Módulo 38, Actividad 38.6 (líneas 183-193) y el caso real de negocio (líneas 190-193): da un
ejemplo explícito de mal vs. buen mensaje ejecutivo ("Implementaremos Dataverse con 12 tablas
personalizadas..." vs. "En 7 meses tendrán un sistema donde los vendedores ven en tiempo real si
hay stock disponible..."), con métrica de resultado ("tasa de cierre de propuestas subió de 30% a
65%"). `JOB_READY_INTERVIEW_READINESS.md` añade plantillas de "Update diario" y "Reporte de
incidente" en formato de comunicación remota asíncrona (líneas 543-560).

### B8. Sin hallazgos de fabricación o sobre-promesa detectados en el material muestreado

En los 6 archivos de Parte B leídos íntegramente no se encontró ninguna afirmación que prometa
empleo, certificación oficial equivalente, o experiencia laboral formal a partir de los labs/
prácticas — lo contrario: cada archivo contiene al menos una advertencia textual explícita de que
la simulación no sustituye experiencia real. No se evaluaron los 4 archivos JOB_READY restantes ni
`PORTAFOLIO_PROFESIONAL.md`; esto no es una afirmación sobre ellos.

### Resumen Parte B

| Dimensión | Evidencia citada | Nivel |
|---|---|---|
| Documentación técnica | Módulo 19 Act. 19.6, Módulo 38 Act. 38.4 | Fuerte |
| Seguridad/gobernanza (mínimo privilegio, DLP) | `inc-001`, `ch-001`, Módulo 49 | Fuerte, con antipatrón explícito prohibido |
| Ágil/Scrum | Módulo 19 (Gherkin, Azure Boards), Módulo 38 (Velocity, WBS) | Fuerte |
| DEV/QA/PRD | `gl-setup-05` (ejecutable, con evidencia real), Módulo 19 | Fuerte |
| Portafolio defendible | `JOB_READY_CRM_FUNCTIONAL.md` | Fuerte, con límites honestos documentados |
| Comunicación con stakeholders no técnicos | Módulo 38 Act. 38.6 | Fuerte |
| Honestidad lab vs. empleo | `JOB_READY_INTERVIEW_READINESS.md` | Fuerte, verificado en múltiples archivos |

No se encontraron brechas de integridad profesional en el material muestreado. La recomendación de
Parte B es únicamente ampliar el muestreo a los 4 archivos JOB_READY no leídos y
`PORTAFOLIO_PROFESIONAL.md` si se desea una cobertura completa de esa carpeta, no corregir nada.

---

## Cierre de pendientes (2026-10-06, misma fecha de ejecución)

**A1 — cerrado.** Verificado directamente contra Microsoft Learn
(`learn.microsoft.com/.../power-platform-developer-associate/`): PL-400 cierra registro el
16 de octubre de 2026 (mismo día en que abre AB-400 en adelante). Se agregó la nota
`"PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"` en el frontmatter `certification` de
los 13 módulos de `avanzado/` (18-30), replicando el patrón ya usado para PL-200.

**A3 — cerrado.** Se agregó una frase en Conceptos Clave del Módulo 37 vinculando "Azure OpenAI
Service" al paraguas de marca actual "Microsoft Foundry" (Ignite 2025), sin reescribir las
actividades prácticas (siguen siendo técnicamente correctas).

**Hallazgo residual de la auditoría de empleabilidad (Módulo 22, banco de preguntas) — cerrado.**
De las 2 preguntas con fraseo del harness antiguo: la de "Solo Topics con trigger phrases fijas"
se dejó igual porque sigue siendo una opción incorrecta válida (el harness estándar sin
Generative Orchestration sí depende de frases exactas). La de "bot maestro + bots de habilidad"
se reescribió a terminología de **Connected Agents** (el mecanismo de delegación actual que
enseña el Módulo 22 reescrito), conservando el mismo concepto evaluado. Verificado con
`node ../scripts/extract-questions.mjs` (891 preguntas, parseo correcto) y
`npm run validate:content`.

**Parte B — cobertura ampliada a los 11 archivos.** Se leyeron íntegramente los 4 archivos
JOB_READY restantes (`JOB_READY_ADMIN_GOVERNANCE.md`, `JOB_READY_CRM_DEVELOPER.md`,
`JOB_READY_DATA_MIGRATION_LEGACY.md`) y `PORTAFOLIO_PROFESIONAL.md`. Mismo patrón de integridad
que los 6 ya evaluados: cada archivo declara explícitamente sus límites (estados "parcial /
awareness avanzado / job-ready simulation", secciones "Roadmap avanzado fuera de alcance actual",
tablas "Qué evitar" al enlazar CV/LinkedIn) y ninguno promete empleo o experiencia laboral formal
a partir de los labs. **Sin hallazgos nuevos.** La cobertura de Parte B queda completa en los 11
archivos de `docs/Recursos/JOB_READY*.md` + `PORTAFOLIO_PROFESIONAL.md`.

# JR-1 Matriz de Skills Laborales Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build JR-1 by adding a job-market skills matrix resource and exposing it in both the Next.js app and MkDocs navigation.

**Architecture:** The feature is documentation-first. A new Markdown resource becomes the source of truth, `content.ts` registers it for the Next.js resource route, `i18n.ts` and `sidebar.tsx` expose it in the app navigation, and `mkdocs.yml` exposes it in the legacy/reference site.

**Tech Stack:** Markdown, Next.js App Router static resource route, TypeScript, MkDocs Material.

## Global Constraints

- Do not create labs `JR-*` in this iteration.
- Do not create new entries in `professional-routes.ts` in this iteration.
- Do not modify massive existing module content.
- Do not promise guaranteed employment.
- Do not say completing PlanEstudio automatically equals job experience.
- Keep all content in Spanish.
- Keep the new resource focused on labor-market skills, interview readiness, evidence, and roadmap gaps.
- Preserve existing resource patterns in `app-elearning/src/lib/content.ts`, `app-elearning/src/lib/i18n.ts`, and `app-elearning/src/components/layout/sidebar.tsx`.

---

### Task 1: Add The Labor Skills Resource

**Files:**
- Create: `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`

**Interfaces:**
- Consumes: Existing module/lab identifiers and resource slugs already present in PlanEstudio.
- Produces: Markdown page consumable by MkDocs and by the app resource renderer.

- [ ] **Step 1: Create `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`**

Use this structure:

```markdown
# Matriz de Skills Laborales

Esta matriz traduce habilidades pedidas en vacantes de Power Platform, Dynamics 365 CRM y Microsoft Business Applications a contenido concreto de PlanEstudio.

No garantiza empleo. Tampoco convierte automaticamente un laboratorio en experiencia laboral formal. Su objetivo es ayudarte a decidir que estudiar, que practicar, que evidencia construir y como explicar tu trabajo en una entrevista tecnica.

## Como usar esta matriz

- Si buscas tu primer rol, empieza por las skills de prioridad Alta marcadas como Cubierto o Parcial.
- Si ya tienes base tecnica, usa las filas Parcial, Awareness y No cubierto para cerrar brechas antes de aplicar a vacantes exigentes.
- Si estas preparando entrevistas, practica la pregunta tipica y respóndela usando evidencia de tus labs o capstones.
- Si eres mentor o reclutador tecnico, usa el estado para distinguir entre conocimiento demostrable, awareness y roadmap.

## Escala de estado

| Estado | Significado |
|---|---|
| Cubierto | Existe modulo y practica/evidencia razonable en PlanEstudio. |
| Parcial | Existe base, pero falta profundidad, escenario laboral o evidencia completa. |
| Awareness | El tema se menciona o se explica conceptualmente, pero no se practica lo suficiente. |
| No cubierto | No hay contenido suficiente para afirmar preparacion. |
| En roadmap | Esta identificado como mejora futura, pero no debe presentarse como skill disponible. |

## Diagnostico de empleabilidad actual

PlanEstudio ya cubre bien la base de Power Platform: Dataverse, Canvas Apps, Model-Driven Apps, Power Automate, Power Fx, ALM, plugins, integraciones, arquitectura, gobernanza y varios escenarios Dynamics 365 Customer Engagement. La plataforma tambien cuenta con rutas profesionales, capstones, rubricas y guia de portafolio.

La brecha principal no es falta total de contenido, sino falta de una capa explicita que diga: "esta skill aparece en vacantes, se aprende aqui, se practica aqui, y se demuestra con esta evidencia".

| Area laboral | Estado actual | Lectura ejecutiva |
|---|---|---|
| Power Platform Development | Cubierto | Buena base para roles maker/developer, con gaps puntuales en pruebas tecnicas CRM JavaScript y Power Automate Desktop. |
| Power Platform Administration & Governance | Parcial | Hay arquitectura, CoE, DLP y ambientes; falta simulacion operativa PPAC con audit logs, capacity y licensing. |
| Dynamics 365 CRM Functional | Parcial | Sales y Customer Service tienen buena base; faltan mas simulaciones de soporte funcional diario y configuracion tipo vacante. |
| Dynamics 365 CRM Developer | Parcial | Hay C#, plugins, Web API e integraciones; falta JavaScript CRM profundo, Custom APIs/workflows y debugging/tracing de entrevista. |
| Data Migration & Legacy CRM | Awareness | Hay conceptos de migracion y legacy modernization; falta lab dedicado de mapping, cleansing, reconciliacion, cutover y health assessment on-premises. |
| Business / Consulting / Soft Skills | Parcial | Hay discovery, UAT, documentacion y portafolio; falta entrevista tecnica, demo laboral, CV/LinkedIn e ingles tecnico. |

## Matriz de Skills Laborales

### Power Platform Development

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Donde se aprende | Donde se practica | Evidencia para portafolio | Pregunta tipica de entrevista | Recomendacion | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Model-driven apps | Power Platform Developer / Functional Consultant | Intermedio | Cubierto | Modulo 4 | LAB-004, LAB-061 | App con formularios, vistas, BPF y roles probados | Como decides entre Canvas App y Model-driven App? | Convertir LAB-004 en variante de prueba tecnica JR-001 | Alta |
| Canvas apps | Maker / Developer | Fundacional-Intermedio | Cubierto | Modulos 3, 10 | LAB-003, LAB-061 | App con navegacion, validaciones y datos reales | Como manejas delegacion y performance en Canvas Apps? | Agregar reto de dataset grande y delegacion | Media |
| Power Fx | Maker / Developer | Intermedio | Parcial | Modulos 7, 10 | LAB-003, LAB-061 | Formulas documentadas y sin hardcode innecesario | Que problemas causa una formula no delegable? | Agregar checklist de delegacion en labs Maker | Media |
| Dataverse modelado | Developer / Functional Consultant | Intermedio | Cubierto | Modulos 2, 9 | LAB-002, LAB-009 | Diagrama de tablas, relaciones, choices y seguridad | Como modelas una relacion N:N y cuando la evitas? | Mantener como evidencia obligatoria en capstones | Alta |
| Dataverse seguridad | Admin / Developer / Functional | Intermedio | Cubierto | Modulos 9, 16, 36 | LAB-009 | Matriz de roles y field security probado | Como aplicas minimo privilegio en Dataverse? | Conectar evidencia con JR-006 Governance Assessment | Alta |
| Power Automate cloud flows | Maker / Functional Consultant | Intermedio | Cubierto | Modulos 5, 11 | LAB-005 | Flujo con aprobacion, errores y ejecucion exitosa | Como evitas loops o ejecuciones duplicadas en un flujo? | Agregar manejo de errores mas visible en portfolio | Alta |
| Power Automate Desktop | RPA / Admin / Developer | Intermedio | Awareness | Modulo 39 menciona RPA | Sin lab dedicado | Documento de proceso RPA y monitoreo, aun no disponible | Como monitoreas y recuperas un desktop flow fallido? | Crear JR posterior de desktop flow operativo | Alta |
| Power Pages | Developer / Portal Consultant | Intermedio-Avanzado | Parcial | Modulos 21, 29 | Sin lab job-ready dedicado | Portal con autenticacion, permisos y pagina externa | Como aseguras datos de Dataverse expuestos en Power Pages? | Crear lab de portal externo con seguridad y roles web | Alta |
| ALM via Solutions | Developer / Architect | Avanzado | Cubierto | Modulos 19, 54 | LAB-019, LAB-053 | Pipeline, solucion exportada y checklist de importacion | Diferencia entre solucion managed y unmanaged? | Mantener como requisito para rutas Developer/Admin | Alta |
| Power Platform CLI | Developer / ALM Specialist | Avanzado | Cubierto | Modulo 52 | LAB-052, LAB-053 | Historial de comandos y solucion desempaquetada | Para que usas `pac solution unpack`? | Agregar preguntas practicas en JR-003/JR-006 | Media |
| Custom connectors | Developer / Integration Consultant | Avanzado | Parcial | Modulo 14 | LAB-054 | OpenAPI/connector conceptual y consumo controlado | Como manejas autenticacion y secretos en custom connectors? | Reforzar con API real o mock verificable | Alta |
| Integraciones Azure | Developer / Architect | Avanzado | Parcial | Modulos 24, 34, 53 | LAB-054, LAB-070 | Diagrama, patron sync/async y manejo de errores | Cuando usas Service Bus en vez de llamada directa? | Crear challenge JR-004 con API externa | Alta |
| Componentes reutilizables / PCF | Developer | Avanzado | Parcial | Modulos 13, 27 | LAB-063 | Control o componente empaquetado | Cuando un PCF justifica el costo frente a configuracion? | Separar evidencia PCF dentro de capstone Developer | Media |

### Power Platform Administration & Governance

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Donde se aprende | Donde se practica | Evidencia para portafolio | Pregunta tipica de entrevista | Recomendacion | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Power Platform Admin Center | Admin / Governance Specialist | Intermedio | Parcial | Modulos 1, 31, 32 | LAB-032 | Inventario y decisiones de gobierno | Que revisarias primero en PPAC ante un tenant desordenado? | Crear JR-006 con assessment PPAC operativo | Alta |
| Estrategia de ambientes | Admin / Architect | Avanzado | Cubierto | Modulos 31, 33 | LAB-056 | Diagrama DEV/TEST/PROD y politica de promocion | Como separas ambientes por criticidad y ciclo de vida? | Conectar con matriz laboral como evidencia Admin | Alta |
| DLP policies | Admin / Governance Specialist | Avanzado | Cubierto | Modulos 31, 33, 36 | LAB-032 | Politica DLP y prueba de bloqueo | Como impedirias mezclar datos corporativos con conectores personales? | Actualizar lenguaje CoE hacia capacidades nativas PPAC | Alta |
| Security roles | Admin / Functional / Architect | Intermedio-Avanzado | Cubierto | Modulos 9, 16, 36 | LAB-009, LAB-068 | Matriz rol-entidad-privilegio | Como diagnosticas acceso indebido a un registro? | Mantener evidencia obligatoria por ruta | Alta |
| Licensing | Admin / Architect | Intermedio | Parcial | Modulos 31, 40 | Preguntas banco/simulador | Analisis de licencias por escenario | Diferencia entre licencia standard y premium en Power Platform? | Agregar ejercicio JR-006 de optimizacion de licencias | Alta |
| Capacity planning | Admin / Architect | Intermedio | Awareness | Modulos 31, 35 | Sin lab dedicado | Estimacion de capacidad y riesgos | Que revisas si Dataverse se queda sin capacidad? | Agregar seccion en JR-006 | Alta |
| M365 audit logs | Admin / Security Specialist | Intermedio | No cubierto | No evidente | Sin lab dedicado | Consulta o informe de auditoria | Como investigarias quien exporto datos sensibles? | Agregar a JR-006 como simulacion guiada | Alta |
| Managed Environments | Admin / Architect | Avanzado | Parcial | Modulo 33 | LAB-056 parcial | Decision de habilitacion y controles | Cuando justificas Managed Environments en produccion? | Agregar decision licensing/governance en JR-006 | Media-Alta |
| CoE / gobierno | Governance Specialist / CoE Lead | Avanzado | Parcial | Modulo 32 | LAB-032 | Modelo operativo CoE y reporte de inventario | Que diferencia hay entre instalar CoE Starter Kit y operar un CoE? | Actualizar enfoque a CoE moderno + PPAC nativo | Alta |
| Soporte operativo | Admin / Support Engineer | Intermedio | Parcial | Modulos 26, 31, 32 | LAB-032 | Runbook de incidentes y monitoreo | Como priorizas un flujo fallando en produccion? | Crear checklist operativo dentro de JR-006 | Media-Alta |

### Dynamics 365 CRM Functional

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Donde se aprende | Donde se practica | Evidencia para portafolio | Pregunta tipica de entrevista | Recomendacion | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Administracion CRM | CRM Functional Specialist | Intermedio | Parcial | Modulos 20, 56 | LAB-066, LAB-068 | Configuracion funcional documentada | Que revisas al recibir un CRM con configuracion heredada? | Crear ruta JR Functional CRM | Alta |
| Formularios y vistas | CRM Functional / Developer | Intermedio | Cubierto | Modulos 4, 20 | LAB-004, LAB-066 | Formularios, vistas y pruebas por rol | Como decides que campo va en formulario vs business rule? | Reforzar en JR-001/JR-007 | Alta |
| Business Process Flows | Functional Consultant | Intermedio | Cubierto | Modulos 4, 9, 20 | LAB-004, LAB-066 | BPF con etapas y validaciones | Cuando usas BPF y cuando no? | Mantener como prueba tecnica functional | Alta |
| Customer Service casos | Customer Service Specialist | Intermedio-Avanzado | Cubierto | Modulo 20 | LAB-068 | Caso end-to-end con cola, SLA y dashboard | Como modelas el ciclo case-to-resolution? | Convertir LAB-068 en base JR-007 | Alta |
| Colas | Customer Service Specialist | Intermedio | Cubierto | Modulo 20 | LAB-068 | Cola configurada y prueba de enrutamiento | Como decides colas por equipo, prioridad o canal? | Ampliar con soporte funcional diario | Alta |
| SLAs | Customer Service Specialist | Avanzado | Cubierto | Modulo 20 | LAB-068 | SLA con pausa/reanudacion y escalamiento | Como diagnosticas un SLA que no se dispara? | Agregar troubleshooting guiado | Alta |
| Entitlements | Customer Service Specialist | Intermedio | Parcial | Modulo 20 | LAB-068 parcial | Politica de cobertura por cliente | Para que sirven los entitlements en Customer Service? | Hacerlos obligatorios en JR-007 | Media-Alta |
| Knowledge base | Customer Service Specialist | Intermedio | Parcial | Modulos 20, 22 | LAB-068 parcial | Articulos y uso en resolucion | Como conectas knowledge articles al soporte de agentes? | Ampliar JR-007 con KB y busqueda | Media-Alta |
| Dynamics 365 Sales | CE Consultant | Intermedio-Avanzado | Cubierto | Modulos 20, 56 | LAB-066, LAB-057 | Proceso lead-to-cash y fit-gap | Como evitas personalizar Sales antes de usar entidades estandar? | Mantener como evidencia CE | Alta |
| Customer Insights - Journeys/Data | CE Consultant / Data Specialist | Intermedio | Parcial | Modulo 57 | LAB-058, LAB-067 | Segmento, journey o customer 360 | Diferencia entre Customer Insights Data y Journeys? | Separar mejor Data vs Journeys en ruta laboral | Media |
| Field Service | CE Consultant | Intermedio | Parcial | Modulo 58 | LAB-059 | Work order, scheduling y UAT | Que elementos minimos necesita una orden de trabajo? | Mantener como especializacion CE | Media |
| Reporting / dashboards | Functional Consultant | Intermedio | Parcial | Modulos 6, 12, 20 | LAB-068 | Dashboard operativo | Que KPIs usarias para medir soporte al cliente? | Agregar dashboards como evidencia transversal | Media-Alta |
| UAT y soporte funcional | Functional Consultant | Intermedio | Cubierto | Modulos 38, 55 | LAB-055, LAB-062 | Casos UAT y sign-off | Como manejas un defecto critico encontrado en UAT? | Conectar con Interview Readiness | Alta |

### Dynamics 365 CRM Developer

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Donde se aprende | Donde se practica | Evidencia para portafolio | Pregunta tipica de entrevista | Recomendacion | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| C# para CRM | CRM Developer | Avanzado | Cubierto | Modulo 23 | LAB-023 | Plugin con codigo fuente y pruebas | Que diferencia hay entre PreOperation y PostOperation? | Mantener como skill central Developer | Alta |
| Plugins Dataverse | CRM Developer | Avanzado | Cubierto | Modulo 23 | LAB-023 | Plugin registrado, tracing y manejo de errores | Como evitas recursion en un plugin? | Ampliar tracing/debugging en JR-003 | Alta |
| JavaScript CRM | CRM Developer | Avanzado | Parcial | Modulo 13 | Sin lab dedicado | Web resource con eventos y Xrm.WebApi | Como usas `formContext` y por que no `Xrm.Page`? | Crear JR-002 | Alta |
| Web resources | CRM Developer | Avanzado | Parcial | Modulo 13 | Sin lab dedicado | JS versionado y registrado en formulario | Como organizas namespaces en web resources? | Incluir en JR-002 | Alta |
| Dataverse Web API | CRM Developer | Avanzado | Cubierto | Modulo 53 | LAB-054 | App externa o llamada autenticada | Como manejas paginacion y errores en Web API? | Reforzar con challenge JR-004 | Alta |
| Custom APIs | CRM Developer | Avanzado | No cubierto | No evidente | Sin lab dedicado | Endpoint Dataverse custom y pruebas | Cuando usarias Custom API frente a plugin clasico? | Agregar en JR-3 posterior | Media-Alta |
| Custom workflow activities | CRM Developer legacy | Avanzado | No cubierto | No evidente | Sin lab dedicado | Assembly y escenario legacy | Cuando mantenerias un workflow legacy y cuando migrarias? | Tratar en ruta legacy/dev avanzada | Media |
| Azure Functions | Integration Developer | Avanzado | Parcial | Modulos 24, 34 | LAB-054 conceptual | Funcion/API con autenticacion | Como proteges una Azure Function llamada desde Power Platform? | Incluir en JR-004 | Media-Alta |
| Azure Logic Apps | Integration Consultant | Intermedio-Avanzado | Awareness | Modulo 34 | Sin lab dedicado | Workflow de integracion | Cuando prefieres Logic Apps frente a Power Automate? | Incluir opcion en JR-004 | Media |
| Service Bus | Integration Developer | Avanzado | Awareness | Modulos 24, 34 | LAB-070 conceptual | Diseno asincrono con cola | Como disenas reintentos e idempotencia? | Agregar simulacion tecnica | Media |
| Testing automatizado | Developer | Avanzado | Parcial | Modulo 50 | LAB-023, LAB-063 | Unit tests y resultado CI | Como pruebas logica de plugins sin depender del tenant? | Reforzar criterios de JR-003 | Alta |
| Debugging y tracing | CRM Developer | Avanzado | Parcial | Modulos 23, 26 | LAB-023 parcial | Log de Plugin Trace y explicacion | Como diagnosticas un plugin que falla solo en produccion? | Agregar caso obligatorio en JR-003 | Alta |
| Clean code / ALM tecnico | CRM Developer | Avanzado | Cubierto | Modulos 19, 48, 50, 54 | LAB-019, LAB-053, LAB-063 | PR/diff revisado, pipeline y solucion | Como evitas cambios manuales en produccion? | Mantener como evidencia Developer | Alta |
| IA aplicada al desarrollo | CRM Developer | Intermedio | Cubierto parcial | Modulos 42-55 | LAB-045, LAB-051, LAB-053 | Prompt, diff y revision humana | Como usas IA sin aceptar codigo inseguro? | Crear JR-010 mas adelante | Media |

### Data Migration & Legacy CRM

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Donde se aprende | Donde se practica | Evidencia para portafolio | Pregunta tipica de entrevista | Recomendacion | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Migracion CRM legacy a Dynamics 365 | Migration Specialist / Architect | Avanzado | Awareness | Modulos 39, 40 | Sin lab dedicado | Roadmap de migracion y cutover | Como reduces riesgo al migrar un CRM critico? | Crear JR-005 | Alta |
| Mapping de datos | Migration Specialist | Intermedio | Parcial | Modulos 34, 40 | LAB-064 conceptual | Mapping origen-destino con reglas | Que haces con campos legacy sin equivalente en Dataverse? | Incluir en JR-005 | Alta |
| Data cleansing | Migration Specialist | Intermedio | Awareness | Modulos 39, 40 | Sin lab dedicado | Reglas de deduplicacion y estandarizacion | Como limpias datos antes de cargarlos a Dataverse? | Incluir dataset sucio en JR-005 | Alta |
| Importacion masiva | Migration Specialist | Avanzado | Awareness | Modulos 34, 40 | Sin lab dedicado | Estrategia batch y errores | Por que Excel no es buena opcion para millones de registros? | Incluir ADF/Power Query/Bulk API conceptual | Alta |
| Reconciliacion | Migration Specialist | Avanzado | No cubierto | No evidente | Sin lab dedicado | Conteos, checksums y reporte post-carga | Como demuestras que la migracion fue correcta? | Incluir validacion post-migracion en JR-005 | Alta |
| Cutover | Migration Lead | Avanzado | Awareness | Modulos 39, 40 | Sin lab dedicado | Plan de corte y rollback | Que contiene un plan de cutover CRM? | Incluir runbook en JR-005 | Alta |
| SQL Server awareness | Legacy Specialist | Intermedio | Awareness | Modulos 34, 35, 39 | Sin lab dedicado | Diagnostico conceptual | Que revisas en SQL si CRM on-prem esta lento? | Incluir en JR-008 como awareness tecnico | Media-Alta |
| Oracle/Sybase awareness | Migration Specialist | Basico | No cubierto | No evidente | Sin lab dedicado | Inventario de fuentes legacy | Como abordas una fuente de datos que no conoces? | Tratar como fuente externa en JR-005 | Media |
| IIS / CRM on-prem | Legacy Specialist | Intermedio | No cubierto | No evidente | Sin lab dedicado | Health assessment conceptual | Que rol cumple IIS en Dynamics CRM on-prem? | Crear JR-008 | Media-Alta |
| Networking/troubleshooting | Legacy / Integration Specialist | Intermedio | Awareness | Modulo 34 | Sin lab dedicado | Diagrama de conectividad y riesgos | Como diagnosticas latencia entre CRM y un sistema on-prem? | Incluir checklist en JR-008 | Media |
| Upgrade path CRM 2015+ | Legacy Specialist | Avanzado | No cubierto | No evidente | Sin lab dedicado | Plan de upgrade/migracion | Que factores revisas antes de actualizar CRM on-prem? | Incluir como roadmap, no promesa actual | Media |
| Health assessment | Legacy Specialist / Architect | Avanzado | No cubierto | No evidente | Sin lab dedicado | Informe de salud y riesgos | Que pondrias en un health assessment de CRM? | Crear JR-008 | Alta |

### Business / Consulting / Soft Skills

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Donde se aprende | Donde se practica | Evidencia para portafolio | Pregunta tipica de entrevista | Recomendacion | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Levantamiento de requerimientos | Functional Consultant / Architect | Intermedio | Cubierto | Modulos 38, 39, 55 | LAB-062 | Acta de discovery e historias | Como conviertes una necesidad ambigua en requerimiento? | Conectar con entrevista STAR | Alta |
| Fit-gap | Functional Consultant / Architect | Intermedio | Cubierto | Modulos 20, 38, 55 | LAB-057, LAB-062 | Matriz fit-gap | Cuando decides configurar vs personalizar? | Mantener como evidencia CE | Alta |
| Documentacion funcional | Functional Consultant | Intermedio | Cubierto | Modulo 38 | LAB-062 | Documento funcional | Como escribes documentacion para usuarios no tecnicos? | Reforzar ejemplo en JR Interview | Alta |
| Documentacion tecnica | Developer / Architect | Avanzado | Cubierto | Modulos 19, 23, 41 | LAB-063 | README tecnico y ADRs | Que debe incluir una decision arquitectonica? | Mantener en capstones | Alta |
| Training a clientes | Functional Consultant / Admin | Intermedio | Parcial | Modulo 38 | LAB-062 | Agenda y manual de usuario | Como entrenas usuarios resistentes al cambio? | Agregar simulacion de sesion cliente | Media-Alta |
| Agile/Scrum | Consultant / Developer | Intermedio | Parcial | Modulo 38 | LAB-062 | Backlog y criterios de aceptacion | Como manejas cambios de alcance durante un sprint? | Incluir en entrevista JR-009 | Media |
| Resolucion de problemas | Todos | Intermedio | Parcial | Modulos 26, 38 | LAB-023, LAB-068 | Registro de incidente y RCA | Cuentame de un problema tecnico dificil que resolviste | Crear banco de respuestas STAR | Alta |
| Ingles tecnico | Todos | Intermedio | No cubierto | No evidente | Sin lab dedicado | Demo bilingue y respuestas tecnicas | Explain a plugin pipeline in English. | Crear JR-009 | Alta |
| CV tecnico | Todos | Basico | No cubierto | Recurso portafolio parcial | Sin lab dedicado | CV orientado a Power Platform/D365 | Como presentarias tus labs como experiencia academica/proyecto? | Crear seccion Interview Readiness | Media-Alta |
| LinkedIn tecnico | Todos | Basico | No cubierto | No evidente | Sin lab dedicado | Perfil optimizado | Que headline usarias para un rol Power Platform junior? | Crear guia JR-6 | Media |
| Demo de 10 minutos | Todos | Intermedio | Parcial | Portafolio Profesional | Capstones | Guion y grabacion/demo | Muestrame un proyecto del que estes orgulloso. | Crear JR-009 | Alta |
| Trabajo remoto / comunicacion | Todos | Intermedio | Parcial | Modulo 38 | LAB-062 | Update escrito, decisiones y riesgos | Como reportas bloqueo tecnico a un cliente remoto? | Incluir en JR-009 | Media |

## Rutas Job-Ready propuestas

Estas rutas aun no son rutas oficiales de `/rutas`. Son propuestas de empleabilidad que deben implementarse por sprints cuando tengan labs, evidencia y criterios de aprobacion suficientes.

### Ruta Job-Ready Power Platform Developer

- **Objetivo:** preparar para pruebas tecnicas de desarrollo Power Platform con Dataverse, model-driven apps, ALM, integraciones y extensibilidad.
- **Perfil laboral objetivo:** Power Platform Developer, CRM Developer junior/mid, Technical Consultant.
- **Skills cubiertos:** model-driven apps, Dataverse, Power Fx, ALM, CLI, plugins C#, Web API, custom connectors, integraciones.
- **Modulos reutilizados:** 4, 9, 13, 14, 19, 21, 23, 24, 26, 52, 53, 54.
- **Labs reutilizados:** LAB-004, LAB-019, LAB-023, LAB-052, LAB-053, LAB-054, LAB-063.
- **Nuevos labs recomendados:** JR-001, JR-002, JR-003, JR-004.
- **Evidencia esperada:** solucion exportada, repo tecnico, plugin probado, pipeline, diagrama de integracion.
- **Preguntas de entrevista:** managed vs unmanaged, plugin pipeline, `formContext`, Web API, idempotencia.
- **Nivel sugerido:** Intermedio-Avanzado.

### Ruta Job-Ready Power Platform Admin / Governance

- **Objetivo:** preparar para administrar tenants, ambientes, seguridad, DLP, capacidad, licenciamiento y gobierno.
- **Perfil laboral objetivo:** Power Platform Admin, Governance Specialist, CoE Analyst, Platform Owner.
- **Skills cubiertos:** PPAC, ambientes, DLP, security roles, Managed Environments, licensing, capacity, CoE, soporte operativo.
- **Modulos reutilizados:** 31, 32, 33, 36, 40.
- **Labs reutilizados:** LAB-032, LAB-056.
- **Nuevos labs recomendados:** JR-006.
- **Evidencia esperada:** governance assessment, matriz de ambientes, politica DLP, analisis de licencias/capacidad, runbook operativo.
- **Preguntas de entrevista:** como gobernar Default environment, como investigar fuga de datos, cuando habilitar Managed Environments.
- **Nivel sugerido:** Intermedio-Avanzado.

### Ruta Job-Ready Dynamics 365 CRM Functional Specialist

- **Objetivo:** preparar para roles funcionales CRM con configuracion, soporte, Customer Service, Sales, reporting y UAT.
- **Perfil laboral objetivo:** CRM Specialist, Dynamics 365 CE Functional Consultant, Customer Service Specialist.
- **Skills cubiertos:** formularios, vistas, tablas, BPF, workflows/procesos, casos, colas, SLA, entitlements, KB, dashboards, UAT.
- **Modulos reutilizados:** 4, 9, 20, 38, 55, 56, 57, 58.
- **Labs reutilizados:** LAB-057, LAB-058, LAB-059, LAB-066, LAB-067, LAB-068.
- **Nuevos labs recomendados:** JR-007.
- **Evidencia esperada:** configuracion case-to-resolution, dashboard, matriz UAT, manual funcional.
- **Preguntas de entrevista:** como configuras un SLA, como haces fit-gap, como das soporte funcional a usuarios.
- **Nivel sugerido:** Intermedio.

### Ruta Job-Ready Dynamics 365 CRM Developer

- **Objetivo:** preparar para roles tecnicos CRM con C#, JavaScript, plugins, Web API, integraciones, testing y ALM.
- **Perfil laboral objetivo:** Dynamics 365 CRM Developer, Power Platform Developer, Technical Consultant.
- **Skills cubiertos:** C#, plugins, JavaScript CRM, web resources, Web API, Azure Functions, Logic Apps, Service Bus, testing, tracing.
- **Modulos reutilizados:** 13, 19, 23, 24, 26, 50, 53, 54.
- **Labs reutilizados:** LAB-019, LAB-023, LAB-054, LAB-063.
- **Nuevos labs recomendados:** JR-002, JR-003, JR-004, JR-010.
- **Evidencia esperada:** repo con plugin y web resource, pruebas, trazas, diagrama de integracion, pipeline.
- **Preguntas de entrevista:** plugin stages, recursion, `formContext`, Custom API, trazabilidad, secretos.
- **Nivel sugerido:** Avanzado.

### Ruta CRM Legacy & Cloud Migration

- **Objetivo:** preparar para roles enterprise donde conviven CRM on-premises, sistemas legacy y migracion a Dynamics 365 cloud.
- **Perfil laboral objetivo:** CRM Migration Specialist, Solution Architect, Legacy Modernization Consultant.
- **Skills cubiertos:** mapping, cleansing, importacion, reconciliacion, cutover, CRM on-prem awareness, SQL/IIS/networking, health assessment.
- **Modulos reutilizados:** 34, 39, 40.
- **Labs reutilizados:** LAB-064, LAB-070 como referencia conceptual.
- **Nuevos labs recomendados:** JR-005, JR-008.
- **Evidencia esperada:** plan de migracion, mapping, reporte post-migracion, health assessment, matriz de riesgos.
- **Preguntas de entrevista:** como migrar 10M registros, como validar integridad, que revisar en CRM on-prem lento.
- **Nivel sugerido:** Avanzado / Especializacion.

### Ruta Technical English & Interview Readiness

- **Objetivo:** preparar al estudiante para explicar proyectos, responder entrevistas, presentar capstones y comunicarse en contextos remotos/internacionales.
- **Perfil laboral objetivo:** todos los perfiles.
- **Skills cubiertos:** CV, LinkedIn, demo de 10 minutos, respuestas tecnicas, ingles tecnico, STAR, comunicacion remota.
- **Modulos reutilizados:** 38, 55 y recursos de portafolio.
- **Labs reutilizados:** capstones LAB-060 a LAB-065.
- **Nuevos labs recomendados:** JR-009.
- **Evidencia esperada:** CV, perfil LinkedIn, guion de demo, respuestas en espanol/ingles, README de proyecto.
- **Preguntas de entrevista:** Tell me about a Power Platform project you built. Explain ALM in Power Platform. How do you handle production incidents?
- **Nivel sugerido:** Transversal.

## Laboratorios Job-Ready recomendados

| Lab propuesto | Prioridad | Vacante que valida | Skills que valida | Evidencia esperada | Rubrica sugerida | Dificultad | Duracion |
|---|---|---|---|---|---|---|---|
| JR-001 Model-Driven App Job Test | Alta | Power Platform Developer / Functional | Dataverse, forms, views, BPF, security roles | Solucion exportada, capturas, matriz de seguridad | 40% funcionalidad, 25% seguridad, 20% calidad, 15% explicacion | Intermedia | 3-4 h |
| JR-002 CRM JavaScript Customization | Alta | Dynamics 365 CRM Developer | OnLoad, OnChange, OnSave, `formContext`, `Xrm.WebApi` | Web resource, registro de eventos, casos de prueba | 35% eventos, 25% Web API, 20% errores, 20% clean code | Avanzada | 4 h |
| JR-003 Dataverse Plugin C# | Alta | CRM Developer | Plugin pipeline, tracing, errores, tests | Codigo, plugin registrado, trazas, tests | 35% pipeline, 25% testing, 20% tracing, 20% ALM | Avanzada | 4-5 h |
| JR-004 CRM Integration Challenge | Media-Alta | Integration Developer | API externa, Logic Apps/Power Automate, errores | Diagrama, flujo/API, logs | 35% patron integracion, 25% seguridad, 25% resiliencia, 15% documentacion | Avanzada | 4 h |
| JR-005 Data Migration to Dynamics 365 | Alta | Migration Specialist | mapping, cleansing, importacion, reconciliacion, cutover | Mapping, carga, reporte validacion | 30% mapping, 25% limpieza, 25% validacion, 20% cutover | Avanzada | 5 h |
| JR-006 PPAC Governance Assessment | Alta | Admin / Governance | PPAC, DLP, capacity, licensing, audit logs, CoE | Informe de tenant, DLP, runbook | 30% diagnostico, 25% controles, 25% recomendaciones, 20% evidencia | Avanzada | 4 h |
| JR-007 Customer Service Specialist Job Simulation | Alta | CRM Functional / Customer Service | casos, colas, SLA, entitlements, KB, dashboard | Configuracion y UAT | 35% proceso, 25% SLA/colas, 20% reporting, 20% soporte | Intermedia-Avanzada | 4 h |
| JR-008 CRM Legacy Health Assessment | Media-Alta | Legacy / Migration | IIS, SQL, networking, upgrade, performance | Health assessment y riesgos | 40% diagnostico, 25% riesgos, 20% roadmap, 15% comunicacion | Avanzada | 3 h |
| JR-009 Technical Interview Simulation | Media-Alta | Todos | entrevista, ingles tecnico, demo, CV | Guion, respuestas, demo de 10 minutos | 30% claridad, 25% evidencia, 25% precision tecnica, 20% ingles/comunicacion | Transversal | 2-3 h |
| JR-010 AI-Assisted CRM Development | Media | CRM Developer moderno | IA, revision de codigo, seguridad, prompts | Prompt, diff, checklist de revision | 30% prompt, 30% revision, 25% seguridad, 15% resultado | Intermedia | 3 h |

## Brechas criticas

1. Power Automate Desktop practico.
2. PPAC operativo con audit logs, capacity, licensing y Managed Environments.
3. JavaScript CRM profundo.
4. Data migration hands-on.
5. CRM on-premises / legacy health assessment.
6. Interview readiness e ingles tecnico.

## Plan de implementacion por sprints

| Sprint | Entrega | Resultado esperado |
|---|---|---|
| JR-1 | Matriz de Skills Laborales + mapeo a contenido actual | El estudiante ve que skills laborales cubre PlanEstudio y que falta. |
| JR-2 | Ruta Dynamics 365 CRM Functional Specialist | Ruta laboral functional con Customer Service/Sales/UAT/reporting. |
| JR-3 | Ruta Dynamics 365 CRM Developer | Ruta tecnica con JavaScript, plugins, Web API, testing y tracing. |
| JR-4 | Ruta Power Platform Admin/Governance | Ruta con PPAC, DLP, ambientes, licencias, capacity y CoE moderno. |
| JR-5 | Data Migration + CRM Legacy | Ruta/labs de migracion, on-prem awareness y health assessment. |
| JR-6 | Interview readiness + portafolio laboral | CV, LinkedIn, demo de 10 minutos, respuestas tecnicas e ingles. |
| JR-7 | Labs job-ready y simulaciones tecnicas | Implementacion progresiva de JR-001 a JR-010 segun prioridad. |

## Relacion con recursos existentes

- Usa `MATRIZ_COMPETENCIAS.md` para saber que evidencia demuestra una competencia.
- Usa `PORTAFOLIO_PROFESIONAL.md` para empaquetar esa evidencia.
- Usa `ROADMAP_ESPECIALIZACION_AVANZADA.md` para no sobreprometer especializaciones aun incompletas.
- Usa esta matriz para traducir vacantes en decisiones de estudio y practica.
```

- [ ] **Step 2: Review the resource for forbidden promises**

Run:

```powershell
rg -n "garantiza empleo|equivale automaticamente a experiencia|experiencia laboral formal garantizada" docs/Recursos/MATRIZ_SKILLS_LABORALES.md
```

Expected: Either no matches, or only the explicit caution saying the resource does not guarantee employment and does not convert labs into formal job experience.

- [ ] **Step 3: Commit Task 1**

Run:

```powershell
git add docs/Recursos/MATRIZ_SKILLS_LABORALES.md
git commit -m "docs: add labor skills matrix resource"
```

Expected: Commit succeeds with one new file.

---

### Task 2: Register The Resource In The Next.js Content Loader

**Files:**
- Modify: `app-elearning/src/lib/content.ts`
- Test: `app-elearning/src/lib/__tests__/content.test.ts` or existing resource-loading coverage if present

**Interfaces:**
- Consumes: `docs/Recursos/MATRIZ_SKILLS_LABORALES.md` from Task 1.
- Produces: Resource slug `matriz-skills-laborales` available through `getAllResourcePages()` and `/recursos/matriz-skills-laborales`.

- [ ] **Step 1: Inspect existing content tests**

Run:

```powershell
rg -n "getAllResourcePages|getResourceBySlug|RESOURCE_FILES|matriz-competencias" app-elearning/src/lib/__tests__ app-elearning/src/lib/content.ts
```

Expected: Shows whether resource slugs are already tested.

- [ ] **Step 2: Add the resource mapping**

In `app-elearning/src/lib/content.ts`, update `RESOURCE_FILES`:

```ts
  "matriz-competencias":    "Recursos/MATRIZ_COMPETENCIAS.md",
  "matriz-skills-laborales": "Recursos/MATRIZ_SKILLS_LABORALES.md",
  "portafolio-profesional": "Recursos/PORTAFOLIO_PROFESIONAL.md",
```

- [ ] **Step 3: Add or update a resource loader test**

If an existing test already checks resource slugs, add `matriz-skills-laborales` to it. If not, add this test to `app-elearning/src/lib/__tests__/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getAllResourcePages, getResourceBySlug } from "../content";

describe("resource pages", () => {
  it("loads the labor skills matrix resource", () => {
    const resource = getResourceBySlug("matriz-skills-laborales");

    expect(resource).toBeDefined();
    expect(resource?.title).toBe("Matriz de Skills Laborales");
    expect(resource?.rawContent).toContain("Power Platform Development");
  });

  it("includes the labor skills matrix in all resource pages", () => {
    expect(getAllResourcePages().map((page) => page.slug)).toContain("matriz-skills-laborales");
  });
});
```

If `content.test.ts` already imports these helpers or already has a `describe("resource pages")`, merge the assertions into that structure instead of duplicating imports.

- [ ] **Step 4: Run the focused test**

Run:

```powershell
cd app-elearning
npm test -- src/lib/__tests__/content.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit Task 2**

Run:

```powershell
git add app-elearning/src/lib/content.ts app-elearning/src/lib/__tests__/content.test.ts
git commit -m "feat: register labor skills matrix resource"
```

Expected: Commit succeeds.

---

### Task 3: Add App Navigation Label And Sidebar Link

**Files:**
- Modify: `app-elearning/src/lib/i18n.ts`
- Modify: `app-elearning/src/components/layout/sidebar.tsx`

**Interfaces:**
- Consumes: Resource slug `matriz-skills-laborales` from Task 2.
- Produces: Sidebar navigation link to `/recursos/matriz-skills-laborales`.

- [ ] **Step 1: Inspect navigation labels**

Run:

```powershell
Get-Content -LiteralPath app-elearning/src/lib/i18n.ts
Get-Content -LiteralPath app-elearning/src/components/layout/sidebar.tsx
```

Expected: Existing `UI.nav` keys and sidebar `resourceLinks` are visible.

- [ ] **Step 2: Add the i18n label**

In `app-elearning/src/lib/i18n.ts`, add a nav label next to the other resource labels:

```ts
    laborSkillsMatrix: "Skills laborales",
```

Use the exact nesting and comma style already used in `UI.nav`.

- [ ] **Step 3: Add the sidebar link**

In `app-elearning/src/components/layout/sidebar.tsx`, add the link near `matriz-competencias` and `portafolio-profesional`:

```tsx
  { href: "/recursos/matriz-skills-laborales", label: UI.nav.laborSkillsMatrix, icon: FileText },
```

- [ ] **Step 4: Run TypeScript check**

Run:

```powershell
cd app-elearning
npm run typecheck
```

Expected: PASS with no missing `UI.nav` property errors.

- [ ] **Step 5: Commit Task 3**

Run:

```powershell
git add app-elearning/src/lib/i18n.ts app-elearning/src/components/layout/sidebar.tsx
git commit -m "feat: link labor skills matrix in app navigation"
```

Expected: Commit succeeds.

---

### Task 4: Add MkDocs Navigation

**Files:**
- Modify: `mkdocs.yml`

**Interfaces:**
- Consumes: `docs/Recursos/MATRIZ_SKILLS_LABORALES.md` from Task 1.
- Produces: MkDocs navigation item under `Recursos`.

- [ ] **Step 1: Add the navigation item**

In `mkdocs.yml`, under `Recursos:`, add:

```yaml
      - "💼 Matriz de Skills Laborales": Recursos/MATRIZ_SKILLS_LABORALES.md
```

Place it near `Certificaciones`, `Banco de Preguntas`, or after `Checklist de Progreso`. Keep indentation exactly aligned with the other resource entries.

- [ ] **Step 2: Validate MkDocs configuration**

Run:

```powershell
mkdocs build --strict
```

Expected: PASS. If `mkdocs` is unavailable in the local environment, record the command failure and continue to the Next.js validation.

- [ ] **Step 3: Commit Task 4**

Run:

```powershell
git add mkdocs.yml
git commit -m "docs: expose labor skills matrix in mkdocs"
```

Expected: Commit succeeds.

---

### Task 5: Final Validation

**Files:**
- Read: `app-elearning/package.json`
- No required file edits unless validation exposes JR-1 defects.

**Interfaces:**
- Consumes: All tasks.
- Produces: Verified JR-1 implementation.

- [ ] **Step 1: Inspect scripts**

Run:

```powershell
Get-Content -LiteralPath app-elearning/package.json
```

Expected: Confirm exact script names for lint, typecheck, validate content, and build.

- [ ] **Step 2: Run lint**

Run:

```powershell
cd app-elearning
npm run lint
```

Expected: PASS.

- [ ] **Step 3: Run typecheck**

Run:

```powershell
cd app-elearning
npm run typecheck
```

Expected: PASS.

- [ ] **Step 4: Run content validation**

Run:

```powershell
cd app-elearning
npm run validate:content
```

Expected: PASS.

- [ ] **Step 5: Run static export build**

Run:

```powershell
cd app-elearning
npm run build:pages
```

Expected: PASS and generate/update `app-elearning/out/` as build output. Do not commit generated output unless the repository already tracks it.

- [ ] **Step 6: Review git diff**

Run:

```powershell
git status --short
git log --oneline -5
```

Expected: Only intended files changed; commits show JR-1 tasks.

- [ ] **Step 7: Final response**

Report:

- Resource added: `/recursos/matriz-skills-laborales`.
- Files changed.
- Validation commands and results.
- Any validation not run or any unrelated failure.


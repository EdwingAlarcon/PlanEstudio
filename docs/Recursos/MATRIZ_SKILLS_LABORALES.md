# Matriz de Skills Laborales

Esta matriz traduce habilidades pedidas en vacantes de Power Platform, Dynamics 365 CRM y Microsoft Business Applications a contenido concreto de PlanEstudio.

No garantiza empleo. Tampoco convierte automáticamente un laboratorio en experiencia laboral formal. Su objetivo es ayudarte a decidir qué estudiar, qué practicar, qué evidencia construir y cómo explicar tu trabajo en una entrevista técnica.

## Cómo usar esta matriz

- Si buscas tu primer rol, empieza por las skills de prioridad Alta marcadas como Cubierto o Parcial.
- Si ya tienes base técnica, usa las filas Parcial, Awareness y No cubierto para cerrar brechas antes de aplicar a vacantes exigentes.
- Si estás preparando entrevistas, practica la pregunta típica y respóndela usando evidencia de tus labs o capstones.
- Si eres mentor o reclutador técnico, usa el estado para distinguir entre conocimiento demostrable, awareness y roadmap.

## Escala de estado

| Estado | Significado |
|---|---|
| Cubierto | Existe módulo y práctica/evidencia razonable en PlanEstudio. |
| Parcial | Existe base, pero falta profundidad, escenario laboral o evidencia completa. |
| Awareness | El tema se menciona o se explica conceptualmente, pero no se practica lo suficiente. |
| No cubierto | No hay contenido suficiente para afirmar preparación. |
| En roadmap | Está identificado como mejora futura, pero no debe presentarse como skill disponible. |

## Diagnóstico de empleabilidad actual

PlanEstudio ya cubre bien la base de Power Platform: Dataverse, Canvas Apps, Model-Driven Apps, Power Automate, Power Fx, ALM, plugins, integraciones, arquitectura, gobernanza y varios escenarios Dynamics 365 Customer Engagement. La plataforma también cuenta con rutas profesionales, capstones, rúbricas y guía de portafolio.

La brecha principal no es falta total de contenido, sino falta de una capa explícita que diga: "esta skill aparece en vacantes, se aprende aquí, se practica aquí, y se demuestra con esta evidencia".

| Área laboral | Estado actual | Lectura ejecutiva |
|---|---|---|
| Power Platform Development | Cubierto | Buena base para roles maker/developer, con gaps puntuales en pruebas técnicas CRM JavaScript y Power Automate Desktop. |
| Power Platform Administration & Governance | Parcial | Hay arquitectura, CoE, DLP y ambientes; falta simulación operativa PPAC con audit logs, capacity y licensing. |
| Dynamics 365 CRM Functional | Parcial | Sales y Customer Service tienen buena base; faltan más simulaciones de soporte funcional diario y configuración tipo vacante. |
| Dynamics 365 CRM Developer | Parcial | Hay C#, plugins, Web API e integraciones; falta JavaScript CRM profundo, Custom APIs/workflows y debugging/tracing de entrevista. |
| Data Migration & Legacy CRM | Awareness | Hay conceptos de migración y legacy modernization; falta lab dedicado de mapping, cleansing, reconciliación, cutover y health assessment on-premises. |
| Business / Consulting / Soft Skills | Parcial | Hay discovery, UAT, documentación y portafolio; falta entrevista técnica, demo laboral, CV/LinkedIn e inglés técnico. |

## Matriz de Skills Laborales

### Power Platform Development

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Dónde se aprende | Dónde se practica | Evidencia para portafolio | Pregunta típica de entrevista | Recomendación | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Model-driven apps | Power Platform Developer / Functional Consultant | Intermedio | Cubierto | Módulo 4 | LAB-004, LAB-061 | App con formularios, vistas, BPF y roles probados | ¿Cómo decides entre Canvas App y Model-driven App? | Convertir LAB-004 en variante de prueba técnica JR-001 | Alta |
| Canvas apps | Maker / Developer | Fundacional-Intermedio | Cubierto | Módulos 3, 10 | LAB-003, LAB-061 | App con navegación, validaciones y datos reales | ¿Cómo manejas delegación y performance en Canvas Apps? | Agregar reto de dataset grande y delegación | Media |
| Power Fx | Maker / Developer | Intermedio | Parcial | Módulos 7, 10 | LAB-003, LAB-061 | Fórmulas documentadas y sin hardcode innecesario | ¿Qué problemas causa una fórmula no delegable? | Agregar checklist de delegación en labs Maker | Media |
| Dataverse modelado | Developer / Functional Consultant | Intermedio | Cubierto | Módulos 2, 9 | LAB-002, LAB-009 | Diagrama de tablas, relaciones, choices y seguridad | ¿Cómo modelas una relación N:N y cuándo la evitas? | Mantener como evidencia obligatoria en capstones | Alta |
| Dataverse seguridad | Admin / Developer / Functional | Intermedio | Cubierto | Módulos 9, 16, 36 | LAB-009 | Matriz de roles y field security probado | ¿Cómo aplicas mínimo privilegio en Dataverse? | Conectar evidencia con JR-006 Governance Assessment | Alta |
| Power Automate cloud flows | Maker / Functional Consultant | Intermedio | Cubierto | Módulos 5, 11 | LAB-005 | Flujo con aprobación, errores y ejecución exitosa | ¿Cómo evitas loops o ejecuciones duplicadas en un flujo? | Agregar manejo de errores más visible en portafolio | Alta |
| Power Automate Desktop | RPA / Admin / Developer | Intermedio | Awareness | Módulo 39 menciona RPA | Sin lab dedicado | Documento de proceso RPA y monitoreo, aún no disponible | ¿Cómo monitoreas y recuperas un desktop flow fallido? | Crear JR posterior de desktop flow operativo | Alta |
| Power Pages | Developer / Portal Consultant | Intermedio-Avanzado | Parcial | Módulos 21, 29 | Sin lab job-ready dedicado | Portal con autenticación, permisos y página externa | ¿Cómo aseguras datos de Dataverse expuestos en Power Pages? | Crear lab de portal externo con seguridad y roles web | Alta |
| ALM via Solutions | Developer / Architect | Avanzado | Cubierto | Módulos 19, 54 | LAB-019, LAB-053 | Pipeline, solución exportada y checklist de importación | ¿Diferencia entre solución managed y unmanaged? | Mantener como requisito para rutas Developer/Admin | Alta |
| Power Platform CLI | Developer / ALM Specialist | Avanzado | Cubierto | Módulo 52 | LAB-052, LAB-053 | Historial de comandos y solución desempaquetada | ¿Para qué usas `pac solution unpack`? | Agregar preguntas prácticas en JR-003/JR-006 | Media |
| Custom connectors | Developer / Integration Consultant | Avanzado | Parcial | Módulo 14 | LAB-054 | OpenAPI/connector conceptual y consumo controlado | ¿Cómo manejas autenticación y secretos en custom connectors? | Reforzar con API real o mock verificable | Alta |
| Integraciones Azure | Developer / Architect | Avanzado | Parcial | Módulos 24, 34, 53 | LAB-054, LAB-070 | Diagrama, patrón sync/async y manejo de errores | ¿Cuándo usas Service Bus en vez de llamada directa? | Crear challenge JR-004 con API externa | Alta |
| Componentes reutilizables / PCF | Developer | Avanzado | Parcial | Módulos 13, 27 | LAB-063 | Control o componente empaquetado | ¿Cuándo un PCF justifica el costo frente a configuración? | Separar evidencia PCF dentro de capstone Developer | Media |

### Power Platform Administration & Governance

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Dónde se aprende | Dónde se practica | Evidencia para portafolio | Pregunta típica de entrevista | Recomendación | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Power Platform Admin Center | Admin / Governance Specialist | Intermedio | Parcial | Módulos 1, 31, 32 | LAB-032 | Inventario y decisiones de gobierno | ¿Qué revisarías primero en PPAC ante un tenant desordenado? | Crear JR-006 con assessment PPAC operativo | Alta |
| Estrategia de ambientes | Admin / Architect | Avanzado | Cubierto | Módulos 31, 33 | LAB-056 | Diagrama DEV/TEST/PROD y política de promoción | ¿Cómo separas ambientes por criticidad y ciclo de vida? | Conectar con matriz laboral como evidencia Admin | Alta |
| DLP policies | Admin / Governance Specialist | Avanzado | Cubierto | Módulos 31, 33, 36 | LAB-032 | Política DLP y prueba de bloqueo | ¿Cómo impedirías mezclar datos corporativos con conectores personales? | Actualizar lenguaje CoE hacia capacidades nativas PPAC | Alta |
| Security roles | Admin / Functional / Architect | Intermedio-Avanzado | Cubierto | Módulos 9, 16, 36 | LAB-009, LAB-068 | Matriz rol-entidad-privilegio | ¿Cómo diagnosticas acceso indebido a un registro? | Mantener evidencia obligatoria por ruta | Alta |
| Licensing | Admin / Architect | Intermedio | Parcial | Módulos 31, 40 | Preguntas banco/simulador | Análisis de licencias por escenario | ¿Diferencia entre licencia standard y premium en Power Platform? | Agregar ejercicio JR-006 de optimización de licencias | Alta |
| Capacity planning | Admin / Architect | Intermedio | Awareness | Módulos 31, 35 | Sin lab dedicado | Estimación de capacidad y riesgos | ¿Qué revisas si Dataverse se queda sin capacidad? | Agregar sección en JR-006 | Alta |
| M365 audit logs | Admin / Security Specialist | Intermedio | No cubierto | No evidente | Sin lab dedicado | Consulta o informe de auditoría | ¿Cómo investigarías quién exportó datos sensibles? | Agregar a JR-006 como simulación guiada | Alta |
| Managed Environments | Admin / Architect | Avanzado | Parcial | Módulo 33 | LAB-056 parcial | Decisión de habilitación y controles | ¿Cuándo justificas Managed Environments en producción? | Agregar decisión licensing/governance en JR-006 | Media-Alta |
| CoE / gobierno | Governance Specialist / CoE Lead | Avanzado | Parcial | Módulo 32 | LAB-032 | Modelo operativo CoE y reporte de inventario | ¿Qué diferencia hay entre instalar CoE Starter Kit y operar un CoE? | Actualizar enfoque a CoE moderno + PPAC nativo | Alta |
| Soporte operativo | Admin / Support Engineer | Intermedio | Parcial | Módulos 26, 31, 32 | LAB-032 | Runbook de incidentes y monitoreo | ¿Cómo priorizas un flujo fallando en producción? | Crear checklist operativo dentro de JR-006 | Media-Alta |

### Dynamics 365 CRM Functional

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Dónde se aprende | Dónde se practica | Evidencia para portafolio | Pregunta típica de entrevista | Recomendación | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Administración CRM | CRM Functional Specialist | Intermedio | Parcial | Módulos 20, 56 | LAB-066, LAB-068 | Configuración funcional documentada | ¿Qué revisas al recibir un CRM con configuración heredada? | Crear ruta JR Functional CRM | Alta |
| Formularios y vistas | CRM Functional / Developer | Intermedio | Cubierto | Módulos 4, 20 | LAB-004, LAB-066 | Formularios, vistas y pruebas por rol | ¿Cómo decides qué campo va en formulario vs business rule? | Reforzar en JR-001/JR-007 | Alta |
| Business Process Flows | Functional Consultant | Intermedio | Cubierto | Módulos 4, 9, 20 | LAB-004, LAB-066 | BPF con etapas y validaciones | ¿Cuándo usas BPF y cuándo no? | Mantener como prueba técnica functional | Alta |
| Customer Service casos | Customer Service Specialist | Intermedio-Avanzado | Cubierto | Módulo 20 | LAB-068 | Caso end-to-end con cola, SLA y dashboard | ¿Cómo modelas el ciclo case-to-resolution? | Convertir LAB-068 en base JR-007 | Alta |
| Colas | Customer Service Specialist | Intermedio | Cubierto | Módulo 20 | LAB-068 | Cola configurada y prueba de enrutamiento | ¿Cómo decides colas por equipo, prioridad o canal? | Ampliar con soporte funcional diario | Alta |
| SLAs | Customer Service Specialist | Avanzado | Cubierto | Módulo 20 | LAB-068 | SLA con pausa/reanudación y escalamiento | ¿Cómo diagnosticas un SLA que no se dispara? | Agregar troubleshooting guiado | Alta |
| Entitlements | Customer Service Specialist | Intermedio | Parcial | Módulo 20 | LAB-068 parcial | Política de cobertura por cliente | ¿Para qué sirven los entitlements en Customer Service? | Hacerlos obligatorios en JR-007 | Media-Alta |
| Knowledge base | Customer Service Specialist | Intermedio | Parcial | Módulos 20, 22 | LAB-068 parcial | Artículos y uso en resolución | ¿Cómo conectas knowledge articles al soporte de agentes? | Ampliar JR-007 con KB y búsqueda | Media-Alta |
| Dynamics 365 Sales | CE Consultant | Intermedio-Avanzado | Cubierto | Módulos 20, 56 | LAB-066, LAB-057 | Proceso lead-to-cash y fit-gap | ¿Cómo evitas personalizar Sales antes de usar entidades estándar? | Mantener como evidencia CE | Alta |
| Customer Insights - Journeys/Data | CE Consultant / Data Specialist | Intermedio | Parcial | Módulo 57 | LAB-058, LAB-067 | Segmento, journey o customer 360 | ¿Diferencia entre Customer Insights Data y Journeys? | Separar mejor Data vs Journeys en ruta laboral | Media |
| Field Service | CE Consultant | Intermedio | Parcial | Módulo 58 | LAB-059 | Work order, scheduling y UAT | ¿Qué elementos mínimos necesita una orden de trabajo? | Mantener como especialización CE | Media |
| Reporting / dashboards | Functional Consultant | Intermedio | Parcial | Módulos 6, 12, 20 | LAB-068 | Dashboard operativo | ¿Qué KPIs usarías para medir soporte al cliente? | Agregar dashboards como evidencia transversal | Media-Alta |
| UAT y soporte funcional | Functional Consultant | Intermedio | Cubierto | Módulos 38, 55 | LAB-055, LAB-062 | Casos UAT y sign-off | ¿Cómo manejas un defecto crítico encontrado en UAT? | Conectar con Interview Readiness | Alta |

### Dynamics 365 CRM Developer

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Dónde se aprende | Dónde se practica | Evidencia para portafolio | Pregunta típica de entrevista | Recomendación | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| C# para CRM | CRM Developer | Avanzado | Cubierto | Módulo 23 | LAB-023 | Plugin con código fuente y pruebas | ¿Qué diferencia hay entre PreOperation y PostOperation? | Mantener como skill central Developer | Alta |
| Plugins Dataverse | CRM Developer | Avanzado | Cubierto | Módulo 23 | LAB-023 | Plugin registrado, tracing y manejo de errores | ¿Cómo evitas recursion en un plugin? | Ampliar tracing/debugging en JR-003 | Alta |
| JavaScript CRM | CRM Developer | Avanzado | Parcial | Módulo 13 | Sin lab dedicado | Web resource con eventos y Xrm.WebApi | ¿Cómo usas `formContext` y por qué no `Xrm.Page`? | Crear JR-002 | Alta |
| Web resources | CRM Developer | Avanzado | Parcial | Módulo 13 | Sin lab dedicado | JS versionado y registrado en formulario | ¿Cómo organizas namespaces en web resources? | Incluir en JR-002 | Alta |
| Dataverse Web API | CRM Developer | Avanzado | Cubierto | Módulo 53 | LAB-054 | App externa o llamada autenticada | ¿Cómo manejas paginación y errores en Web API? | Reforzar con challenge JR-004 | Alta |
| Custom APIs | CRM Developer | Avanzado | No cubierto | No evidente | Sin lab dedicado | Endpoint Dataverse custom y pruebas | ¿Cuándo usarías Custom API frente a plugin clásico? | Agregar en JR-3 posterior | Media-Alta |
| Custom workflow activities | CRM Developer legacy | Avanzado | No cubierto | No evidente | Sin lab dedicado | Assembly y escenario legacy | ¿Cuándo mantendrías un workflow legacy y cuándo migrarías? | Tratar en ruta legacy/dev avanzada | Media |
| Azure Functions | Integration Developer | Avanzado | Parcial | Módulos 24, 34 | LAB-054 conceptual | Function/API con autenticación | ¿Cómo proteges una Azure Function llamada desde Power Platform? | Incluir en JR-004 | Media-Alta |
| Azure Logic Apps | Integration Consultant | Intermedio-Avanzado | Awareness | Módulo 34 | Sin lab dedicado | Workflow de integración | ¿Cuándo prefieres Logic Apps frente a Power Automate? | Incluir opción en JR-004 | Media |
| Service Bus | Integration Developer | Avanzado | Awareness | Módulos 24, 34 | LAB-070 conceptual | Diseño asíncrono con cola | ¿Cómo diseñas reintentos e idempotencia? | Agregar simulación técnica | Media |
| Testing automatizado | Developer | Avanzado | Parcial | Módulo 50 | LAB-023, LAB-063 | Unit tests y resultado CI | ¿Cómo pruebas lógica de plugins sin depender del tenant? | Reforzar criterios de JR-003 | Alta |
| Debugging y tracing | CRM Developer | Avanzado | Parcial | Módulos 23, 26 | LAB-023 parcial | Log de Plugin Trace y explicación | ¿Cómo diagnosticas un plugin que falla solo en producción? | Agregar caso obligatorio en JR-003 | Alta |
| Clean code / ALM técnico | CRM Developer | Avanzado | Cubierto | Módulos 19, 48, 50, 54 | LAB-019, LAB-053, LAB-063 | PR/diff revisado, pipeline y solución | ¿Cómo evitas cambios manuales en producción? | Mantener como evidencia Developer | Alta |
| IA aplicada al desarrollo | CRM Developer | Intermedio | Cubierto parcial | Módulos 42-55 | LAB-045, LAB-051, LAB-053 | Prompt, diff y revisión humana | ¿Cómo usas IA sin aceptar código inseguro? | Crear JR-010 más adelante | Media |

### Data Migration & Legacy CRM

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Dónde se aprende | Dónde se practica | Evidencia para portafolio | Pregunta típica de entrevista | Recomendación | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Migración CRM legacy a Dynamics 365 | Migration Specialist / Architect | Avanzado | Awareness | Módulos 39, 40 | Sin lab dedicado | Roadmap de migración y cutover | ¿Cómo reduces riesgo al migrar un CRM crítico? | Crear JR-005 | Alta |
| Mapping de datos | Migration Specialist | Intermedio | Parcial | Módulos 34, 40 | LAB-064 conceptual | Mapping origen-destino con reglas | ¿Qué haces con campos legacy sin equivalente en Dataverse? | Incluir en JR-005 | Alta |
| Data cleansing | Migration Specialist | Intermedio | Awareness | Módulos 39, 40 | Sin lab dedicado | Reglas de deduplicación y estandarización | ¿Cómo limpias datos antes de cargarlos a Dataverse? | Incluir dataset sucio en JR-005 | Alta |
| Importación masiva | Migration Specialist | Avanzado | Awareness | Módulos 34, 40 | Sin lab dedicado | Estrategia batch y errores | ¿Por qué Excel no es buena opción para millones de registros? | Incluir ADF/Power Query/Bulk API conceptual | Alta |
| Reconciliación | Migration Specialist | Avanzado | No cubierto | No evidente | Sin lab dedicado | Conteos, checksums y reporte post-carga | ¿Cómo demuestras que la migración fue correcta? | Incluir validación post-migración en JR-005 | Alta |
| Cutover | Migration Lead | Avanzado | Awareness | Módulos 39, 40 | Sin lab dedicado | Plan de corte y rollback | ¿Qué contiene un plan de cutover CRM? | Incluir runbook en JR-005 | Alta |
| SQL Server awareness | Legacy Specialist | Intermedio | Awareness | Módulos 34, 35, 39 | Sin lab dedicado | Diagnóstico conceptual | ¿Qué revisas en SQL si CRM on-prem está lento? | Incluir en JR-008 como awareness técnico | Media-Alta |
| Oracle/Sybase awareness | Migration Specialist | Básico | No cubierto | No evidente | Sin lab dedicado | Inventario de fuentes legacy | ¿Cómo abordas una fuente de datos que no conoces? | Tratar como fuente externa en JR-005 | Media |
| IIS / CRM on-prem | Legacy Specialist | Intermedio | No cubierto | No evidente | Sin lab dedicado | Health assessment conceptual | ¿Qué rol cumple IIS en Dynamics CRM on-prem? | Crear JR-008 | Media-Alta |
| Networking/troubleshooting | Legacy / Integration Specialist | Intermedio | Awareness | Módulo 34 | Sin lab dedicado | Diagrama de conectividad y riesgos | ¿Cómo diagnosticas latencia entre CRM y un sistema on-prem? | Incluir checklist en JR-008 | Media |
| Upgrade path CRM 2015+ | Legacy Specialist | Avanzado | No cubierto | No evidente | Sin lab dedicado | Plan de upgrade/migración | ¿Qué factores revisas antes de actualizar CRM on-prem? | Incluir como roadmap, no promesa actual | Media |
| Health assessment | Legacy Specialist / Architect | Avanzado | No cubierto | No evidente | Sin lab dedicado | Informe de salud y riesgos | ¿Qué pondrías en un health assessment de CRM? | Crear JR-008 | Alta |

### Business / Consulting / Soft Skills

| Skill laboral | Perfil laboral asociado | Nivel esperado | Estado | Dónde se aprende | Dónde se practica | Evidencia para portafolio | Pregunta típica de entrevista | Recomendación | Prioridad |
|---|---|---|---|---|---|---|---|---|---|
| Levantamiento de requerimientos | Functional Consultant / Architect | Intermedio | Cubierto | Módulos 38, 39, 55 | LAB-062 | Acta de discovery e historias | ¿Cómo conviertes una necesidad ambigua en requerimiento? | Conectar con entrevista STAR | Alta |
| Fit-gap | Functional Consultant / Architect | Intermedio | Cubierto | Módulos 20, 38, 55 | LAB-057, LAB-062 | Matriz fit-gap | ¿Cuándo decides configurar vs personalizar? | Mantener como evidencia CE | Alta |
| Documentación funcional | Functional Consultant | Intermedio | Cubierto | Módulo 38 | LAB-062 | Documento funcional | ¿Cómo escribes documentación para usuarios no técnicos? | Reforzar ejemplo en JR Interview | Alta |
| Documentación técnica | Developer / Architect | Avanzado | Cubierto | Módulos 19, 23, 41 | LAB-063 | README técnico y ADRs | ¿Qué debe incluir una decisión arquitectónica? | Mantener en capstones | Alta |
| Training a clientes | Functional Consultant / Admin | Intermedio | Parcial | Módulo 38 | LAB-062 | Agenda y manual de usuario | ¿Cómo entrenas usuarios resistentes al cambio? | Agregar simulación de sesión cliente | Media-Alta |
| Agile/Scrum | Consultant / Developer | Intermedio | Parcial | Módulo 38 | LAB-062 | Backlog y criterios de aceptación | ¿Cómo manejas cambios de alcance durante un sprint? | Incluir en entrevista JR-009 | Media |
| Resolución de problemas | Todos | Intermedio | Parcial | Módulos 26, 38 | LAB-023, LAB-068 | Registro de incidente y RCA | Cuéntame de un problema técnico difícil que resolviste | Crear banco de respuestas STAR | Alta |
| Inglés técnico | Todos | Intermedio | No cubierto | No evidente | Sin lab dedicado | Demo bilingüe y respuestas técnicas | Explain a plugin pipeline in English. | Crear JR-009 | Alta |
| CV técnico | Todos | Básico | No cubierto | Recurso portafolio parcial | Sin lab dedicado | CV orientado a Power Platform/D365 | ¿Cómo presentarías tus labs como experiencia académica/proyecto? | Crear sección Interview Readiness | Media-Alta |
| LinkedIn técnico | Todos | Básico | No cubierto | No evidente | Sin lab dedicado | Perfil optimizado | ¿Qué headline usarías para un rol Power Platform junior? | Crear guía JR-6 | Media |
| Demo de 10 minutos | Todos | Intermedio | Parcial | Portafolio Profesional | Capstones | Guion y grabación/demo | Muéstrame un proyecto del que estés orgulloso. | Crear JR-009 | Alta |
| Trabajo remoto / comunicación | Todos | Intermedio | Parcial | Módulo 38 | LAB-062 | Update escrito, decisiones y riesgos | ¿Cómo reportas bloqueo técnico a un cliente remoto? | Incluir en JR-009 | Media |

## Rutas Job-Ready propuestas

Estas rutas aún no son rutas oficiales de `/rutas`. Son propuestas de empleabilidad que deben implementarse por sprints cuando tengan labs, evidencia y criterios de aprobación suficientes.

### Ruta Job-Ready Power Platform Developer

- **Objetivo:** preparar para pruebas técnicas de desarrollo Power Platform con Dataverse, model-driven apps, ALM, integraciones y extensibilidad.
- **Perfil laboral objetivo:** Power Platform Developer, CRM Developer junior/mid, Technical Consultant.
- **Skills cubiertos:** model-driven apps, Dataverse, Power Fx, ALM, CLI, plugins C#, Web API, custom connectors, integraciones.
- **Módulos reutilizados:** 4, 9, 13, 14, 19, 21, 23, 24, 26, 52, 53, 54.
- **Labs reutilizados:** LAB-004, LAB-019, LAB-023, LAB-052, LAB-053, LAB-054, LAB-063.
- **Nuevos labs recomendados:** JR-001, JR-002, JR-003, JR-004.
- **Evidencia esperada:** solución exportada, repo técnico, plugin probado, pipeline, diagrama de integración.
- **Preguntas de entrevista:** managed vs unmanaged, plugin pipeline, `formContext`, Web API, idempotencia.
- **Nivel sugerido:** Intermedio-Avanzado.

### Ruta Job-Ready Power Platform Admin / Governance

- **Objetivo:** preparar para administrar tenants, ambientes, seguridad, DLP, capacidad, licenciamiento y gobierno.
- **Perfil laboral objetivo:** Power Platform Admin, Governance Specialist, CoE Analyst, Platform Owner.
- **Skills cubiertos:** PPAC, ambientes, DLP, security roles, Managed Environments, licensing, capacity, CoE, soporte operativo.
- **Módulos reutilizados:** 31, 32, 33, 36, 40.
- **Labs reutilizados:** LAB-032, LAB-056.
- **Nuevos labs recomendados:** JR-006.
- **Evidencia esperada:** governance assessment, matriz de ambientes, política DLP, análisis de licencias/capacidad, runbook operativo.
- **Preguntas de entrevista:** cómo gobernar Default environment, cómo investigar fuga de datos, cuándo habilitar Managed Environments.
- **Nivel sugerido:** Intermedio-Avanzado.

### Ruta Job-Ready Dynamics 365 CRM Functional Specialist

- **Objetivo:** preparar para roles funcionales CRM con configuración, soporte, Customer Service, Sales, reporting y UAT.
- **Perfil laboral objetivo:** CRM Specialist, Dynamics 365 CE Functional Consultant, Customer Service Specialist.
- **Skills cubiertos:** formularios, vistas, tablas, BPF, workflows/procesos, casos, colas, SLA, entitlements, KB, dashboards, UAT.
- **Módulos reutilizados:** 4, 9, 20, 38, 55, 56, 57, 58.
- **Labs reutilizados:** LAB-057, LAB-058, LAB-059, LAB-066, LAB-067, LAB-068.
- **Nuevos labs recomendados:** JR-007.
- **Evidencia esperada:** configuración case-to-resolution, dashboard, matriz UAT, manual funcional.
- **Preguntas de entrevista:** cómo configuras un SLA, cómo haces fit-gap, cómo das soporte funcional a usuarios.
- **Nivel sugerido:** Intermedio.

### Ruta Job-Ready Dynamics 365 CRM Developer

Recurso detallado: [Ruta Job-Ready Dynamics 365 CRM Developer](JOB_READY_CRM_DEVELOPER.md).

- **Objetivo:** preparar para roles técnicos CRM con C#, JavaScript, plugins, Web API, integraciones, testing y ALM.
- **Perfil laboral objetivo:** Dynamics 365 CRM Developer, Power Platform Developer, Technical Consultant.
- **Skills cubiertos:** C#, plugins, JavaScript CRM, web resources, Web API, Azure Functions, Logic Apps, Service Bus, testing, tracing.
- **Módulos reutilizados:** 13, 19, 23, 24, 26, 50, 53, 54.
- **Labs reutilizados:** LAB-019, LAB-023, LAB-054, LAB-063.
- **Nuevos labs recomendados:** JR-002, JR-003, JR-004, JR-010.
- **Evidencia esperada:** repo con plugin y web resource, pruebas, trazas, diagrama de integración, pipeline.
- **Preguntas de entrevista:** plugin stages, recursion, `formContext`, Custom API, trazabilidad, secretos.
- **Nivel sugerido:** Avanzado.

### Ruta CRM Legacy & Cloud Migration

- **Objetivo:** preparar para roles enterprise donde conviven CRM on-premises, sistemas legacy y migración a Dynamics 365 cloud.
- **Perfil laboral objetivo:** CRM Migration Specialist, Solution Architect, Legacy Modernization Consultant.
- **Skills cubiertos:** mapping, cleansing, importación, reconciliación, cutover, CRM on-prem awareness, SQL/IIS/networking, health assessment.
- **Módulos reutilizados:** 34, 39, 40.
- **Labs reutilizados:** LAB-064, LAB-070 como referencia conceptual.
- **Nuevos labs recomendados:** JR-005, JR-008.
- **Evidencia esperada:** plan de migración, mapping, reporte post-migración, health assessment, matriz de riesgos.
- **Preguntas de entrevista:** cómo migrar 10M registros, cómo validar integridad, qué revisar en CRM on-prem lento.
- **Nivel sugerido:** Avanzado / Especialización.

### Ruta Technical English & Interview Readiness

- **Objetivo:** preparar al estudiante para explicar proyectos, responder entrevistas, presentar capstones y comunicarse en contextos remotos/internacionales.
- **Perfil laboral objetivo:** todos los perfiles.
- **Skills cubiertos:** CV, LinkedIn, demo de 10 minutos, respuestas técnicas, inglés técnico, STAR, comunicación remota.
- **Módulos reutilizados:** 38, 55 y recursos de portafolio.
- **Labs reutilizados:** capstones LAB-060 a LAB-065.
- **Nuevos labs recomendados:** JR-009.
- **Evidencia esperada:** CV, perfil LinkedIn, guion de demo, respuestas en español/inglés, README de proyecto.
- **Preguntas de entrevista:** Tell me about a Power Platform project you built. Explain ALM in Power Platform. How do you handle production incidents?
- **Nivel sugerido:** Transversal.

## Laboratorios Job-Ready recomendados

| Lab propuesto | Prioridad | Vacante que valida | Skills que valida | Evidencia esperada | Rúbrica sugerida | Dificultad | Duración |
|---|---|---|---|---|---|---|---|
| JR-001 Model-Driven App Job Test | Alta | Power Platform Developer / Functional | Dataverse, forms, views, BPF, security roles | Solución exportada, capturas, matriz de seguridad | 40% funcionalidad, 25% seguridad, 20% calidad, 15% explicación | Intermedia | 3-4 h |
| JR-002 CRM JavaScript Customization | Alta | Dynamics 365 CRM Developer | OnLoad, OnChange, OnSave, `formContext`, `Xrm.WebApi` | Web resource, registro de eventos, casos de prueba | 35% eventos, 25% Web API, 20% errores, 20% clean code | Avanzada | 4 h |
| JR-003 Dataverse Plugin C# | Alta | CRM Developer | Plugin pipeline, tracing, errores, tests | Código, plugin registrado, trazas, tests | 35% pipeline, 25% testing, 20% tracing, 20% ALM | Avanzada | 4-5 h |
| JR-004 CRM Integration Challenge | Media-Alta | Integration Developer | API externa, Logic Apps/Power Automate, errores | Diagrama, flujo/API, logs | 35% patrón integración, 25% seguridad, 25% resiliencia, 15% documentación | Avanzada | 4 h |
| JR-005 Data Migration to Dynamics 365 | Alta | Migration Specialist | mapping, cleansing, importación, reconciliación, cutover | Mapping, carga, reporte validación | 30% mapping, 25% limpieza, 25% validación, 20% cutover | Avanzada | 5 h |
| JR-006 PPAC Governance Assessment | Alta | Admin / Governance | PPAC, DLP, capacity, licensing, audit logs, CoE | Informe de tenant, DLP, runbook | 30% diagnóstico, 25% controles, 25% recomendaciones, 20% evidencia | Avanzada | 4 h |
| JR-007 Customer Service Specialist Job Simulation | Alta | CRM Functional / Customer Service | casos, colas, SLA, entitlements, KB, dashboard | Configuración y UAT | 35% proceso, 25% SLA/colas, 20% reporting, 20% soporte | Intermedia-Avanzada | 4 h |
| JR-008 CRM Legacy Health Assessment | Media-Alta | Legacy / Migration | IIS, SQL, networking, upgrade, performance | Health assessment y riesgos | 40% diagnóstico, 25% riesgos, 20% roadmap, 15% comunicación | Avanzada | 3 h |
| JR-009 Technical Interview Simulation | Media-Alta | Todos | entrevista, inglés técnico, demo, CV | Guion, respuestas, demo de 10 minutos | 30% claridad, 25% evidencia, 25% precisión técnica, 20% inglés/comunicación | Transversal | 2-3 h |
| JR-010 AI-Assisted CRM Development | Media | CRM Developer moderno | IA, revisión de código, seguridad, prompts | Prompt, diff, checklist de revisión | 30% prompt, 30% revisión, 25% seguridad, 15% resultado | Intermedia | 3 h |

## Brechas críticas

1. Power Automate Desktop práctico.
2. PPAC operativo con audit logs, capacity, licensing y Managed Environments.
3. JavaScript CRM profundo.
4. Data migration hands-on.
5. CRM on-premises / legacy health assessment.
6. Interview readiness e inglés técnico.

## Plan de implementación por sprints

| Sprint | Entrega | Resultado esperado |
|---|---|---|
| JR-1 | Matriz de Skills Laborales + mapeo a contenido actual | El estudiante ve qué skills laborales cubre PlanEstudio y qué falta. |
| JR-2 | Ruta Dynamics 365 CRM Functional Specialist | Ruta laboral functional con Customer Service/Sales/UAT/reporting. |
| JR-3 | Ruta Dynamics 365 CRM Developer | Ruta técnica con JavaScript, plugins, Web API, testing y tracing. |
| JR-4 | Ruta Power Platform Admin/Governance | Ruta con PPAC, DLP, ambientes, licencias, capacity y CoE moderno. |
| JR-5 | Data Migration + CRM Legacy | Ruta/labs de migración, on-prem awareness y health assessment. |
| JR-6 | Interview readiness + portafolio laboral | CV, LinkedIn, demo de 10 minutos, respuestas técnicas e inglés. |
| JR-7 | Labs job-ready y simulaciones técnicas | Implementación progresiva de JR-001 a JR-010 según prioridad. |

## Relación con recursos existentes

- Usa `MATRIZ_COMPETENCIAS.md` para saber qué evidencia demuestra una competencia.
- Usa `PORTAFOLIO_PROFESIONAL.md` para empaquetar esa evidencia.
- Usa `ROADMAP_ESPECIALIZACION_AVANZADA.md` para no sobreprometer especializaciones aún incompletas.
- Usa esta matriz para traducir vacantes en decisiones de estudio y práctica.

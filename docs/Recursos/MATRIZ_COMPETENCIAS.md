# Matriz de Competencias por Ruta Profesional

Esta matriz responde una pregunta distinta a la de los módulos: no "¿qué debo leer?", sino
"¿qué debo poder demostrar?". Cada fila es una competencia con evidencia verificable, el
laboratorio o proyecto que la ejercita hoy, y el criterio mínimo para considerarla aprobada.

Se apoya en la misma escala 0-4 y el mismo lenguaje de [Rúbricas y Plantillas de
Evaluación](RUBRICAS_PLANTILLAS_EVALUACION.md) — esta matriz decide **qué** evaluar por perfil;
esa rúbrica decide **cómo** puntuar cada entrega.

Cada ruta profesional ya tiene un capstone dedicado (LAB-060 a LAB-065, o el Módulo 41 para
arquitectura) — ver la sección final de este documento para el detalle de qué capstone
corresponde a cada ruta.

## Cómo usar esta matriz

- Antes de empezar una ruta: revisa qué evidencia tendrás que producir, no solo qué módulos leerás.
- Al cerrar un laboratorio: verifica si genera evidencia para alguna fila de tu ruta.
- Antes de pedir el certificado de un nivel: el certificado exige módulos + quizzes (≥70%) + labs
  del nivel, pero **no sustituye** esta matriz — un nivel completo no implica que ya cubriste
  las competencias de tu ruta profesional.

---

## Maker Power Platform

*Low-code, apps departamentales.* Ruta: Maker → Consultor Funcional.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Canvas Apps (pantallas, navegación, colecciones) | Fundacional | App exportada o enlace al environment | LAB-003 | 3+ pantallas, navegación sin errores, datos de prueba reales |
| Power Automate básico (aprobaciones, notificaciones) | Fundacional | Flujo exportado + captura de ejecución exitosa | LAB-005 | Corre sin intervención manual en 3 ejecuciones de prueba |
| Dataverse básico (tablas, relaciones, choices) | Fundacional | Diagrama de modelo de datos (3+ tablas relacionadas) | LAB-002 | Relaciones N:1/N:N correctas, sin columnas `new_` |
| UX funcional (formularios claros, mensajes de error) | Fundacional | Capturas antes/después de una revisión de usabilidad | LAB-003 (reto adicional) | Un usuario de prueba completa la tarea sin ayuda |
| Validaciones de datos (obligatoriedad, formato, duplicados) | Fundacional | Casos de prueba con datos inválidos + resultado | LAB-002 / LAB-004 | 3 casos de borde bloqueados correctamente |
| Publicación y roles básicos | Fundacional | Captura de app compartida + rol asignado | LAB-004 | Un segundo usuario accede solo a lo que le corresponde |
| Buenas prácticas low-code (nomenclatura, sin hardcode) | Fundacional | Revisión de fórmulas vs. checklist de estilo | LAB-061 (Capstone Maker) | 0 fórmulas con valores hardcodeados que deberían ser variables/Named Formulas |

## Consultor Funcional

*Discovery, fit-gap, UAT.* Ruta: Maker → Consultor Funcional → Dynamics 365 CE / Solution Architect.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Levantamiento de requerimientos / workshops | Intermedio | Acta de workshop con decisiones y pendientes | LAB-062 (Capstone Consultor Funcional) | Acta identifica ≥5 requerimientos con dueño y prioridad |
| Historias de usuario y criterios de aceptación | Intermedio | Backlog "Como... quiero... para..." + Given/When/Then | LAB-062 (Capstone Consultor Funcional) | ≥8 historias, criterios verificables (no ambiguos) |
| Procesos AS-IS / TO-BE | Intermedio | 2 diagramas de flujo con puntos de fricción marcados | LAB-060 (referencia reutilizable) | TO-BE elimina ≥2 fricciones identificadas en AS-IS |
| Fit-Gap | Intermedio | Matriz Fit-Gap con decisión (config/personalización/fuera de alcance) | LAB-060 | 100% de requerimientos clasificados, brechas con propuesta |
| Configuración Dataverse/D365 sin código | Intermedio | Entorno configurado + captura de seguridad por rol | LAB-009 | Seguridad de campo y BPF configurados y probados |
| UAT (casos, ejecución, sign-off) | Intermedio | ≥8 casos UAT con resultado pass/fail | LAB-055, LAB-060 | 100% de casos ejecutados, defectos críticos en 0 |
| Documentación funcional para stakeholders | Intermedio | Documento funcional de 3-5 páginas, lenguaje no técnico | LAB-060 | Un no-técnico puede explicar la solución tras leerlo |
| Capacitación a usuarios finales | Intermedio | Manual de usuario + agenda de sesión de capacitación | LAB-062 (Capstone Consultor Funcional) | Manual cubre los 3 flujos más usados sin jerga técnica |

## Power Platform Developer

*Extensibilidad, integración, ALM.* Ruta: Maker/Consultor Funcional → Developer → Solution Architect.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Power Fx avanzado (delegable, funciones de colección) | Avanzado | Fórmulas con anotación de por qué son delegables | LAB-003 (reto), Módulo 12 | 0 advertencias de delegación en datasets &gt;500 filas |
| Dataverse avanzado (plugins, business rules complejas) | Avanzado | Plugin registrado en PRT con imagen pre/post | LAB-023 | Pasa unit tests con Moq + captura de registro en PRT |
| JavaScript / web resources | Avanzado | Web resource con manejo de errores, sin globales en `window` | Módulo 21 | Pasa linter, sin `eval` ni credenciales embebidas |
| Plugins C# / Custom APIs | Avanzado | Código fuente + resultado de unit tests | LAB-023 | Cobertura ≥ 1 caso feliz + 1 caso de error |
| PCF Controls | Avanzado | Control empaquetado + captura funcionando en formulario | LAB-063 (Capstone Developer) | Maneja al menos un estado de error de forma visible |
| Custom Connectors | Avanzado | Connector con swagger/OpenAPI documentado | LAB-054 | Autentica y responde con datos reales de prueba |
| Power Platform CLI | Avanzado | Historial de comandos usados en export/import de solución | LAB-052, LAB-053 | Exporta e importa sin edición manual del zip |
| ALM (pipelines, ambientes, connection references) | Avanzado | Pipeline YAML + evidencia de despliegue Dev→Test | LAB-019 | Corre sin intervención manual, usa variables de entorno |
| Observabilidad e integraciones | Avanzado | Log de errores capturado y explicado | Módulo 26/27 | Un incidente simulado diagnosticado con logs, no prueba y error |

## Dynamics 365 Customer Engagement Consultant

*Sales, Service, Insights, Field Service.* Ruta: Consultor Funcional → Dynamics 365 CE → Solution Architect.
Estado de la ruta: **avanzado — especializaciones en expansión** — Sales, Customer Service,
Customer Insights - Data y Field Service ya tienen módulo y lab dedicados con datos reales;
Contact Center/Omnichannel avanzado y Sales Operations siguen en el
[Roadmap de Especialización Avanzada](ROADMAP_ESPECIALIZACION_AVANZADA.md).

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Procesos comerciales (lead-to-cash) | Intermedio-Avanzado | BPF configurado con campos requeridos por etapa, Quote→Order con Price List Item | Módulo 20, LAB-066 | La oportunidad no avanza de etapa sin campos obligatorios; el monto de Quote y Order coincide |
| Customer Service (case-to-resolution, SLA, escalamiento, dashboard) | Avanzado | Cola configurada + SLA con pausa/reanudación + escalamiento automático + dashboard con FRT/Resolution Time/SLA Success Rate/Backlog/CSAT | Módulo 20, LAB-068 | El caso llega a la cola correcta, el SLA se pausa en espera del cliente y escala automáticamente al superar el KPI |
| Customer Insights - Journeys (segmentación, journeys) | Avanzado | Segmento + journey documentado con trigger y salida | LAB-058 | Segmento filtra correctamente, sin envíos duplicados en el journey |
| Customer Insights - Data (unificación de perfiles, medidas, activación) | Avanzado | Regla de matching aplicada a datos de prueba + medidas con fórmula documentada | Módulo 57, LAB-067 | La regla de matching unifica correctamente al cliente sin email por teléfono/nombre |
| Field Service (work orders, SLAs, scheduling) | Avanzado | Work order de principio a fin + SLA con escalamiento + Incident Type con tareas obligatorias | Módulo 58, LAB-059 | El SLA se dispara y escala cuando se incumple el tiempo; el Schedule Board resalta solo técnicos con la skill requerida |
| Integración con Dataverse (datos compartidos entre apps) | Avanzado | Diagrama de flujo de datos entre Sales/Service/Insights | LAB-060 | Sin duplicación de entidades cliente entre apps |
| UAT y go-live de un escenario CE completo | Avanzado | 8 casos UAT + checklist de go-live | LAB-060 | 100% de casos ejecutados, checklist sin pendientes críticos |

## Finance & Operations Consultant / Architect Awareness

*ERP conceptual, integración.* Ruta: Consultor Funcional → Finance & Operations → Solution Architect.
Estado de la ruta: **awareness avanzado — práctica en roadmap** — el Módulo 59 ya cubre vocabulario y mapas
paso a paso de los 5 procesos ERP estándar, y los LAB-069/LAB-070 aplican ese vocabulario a un
escenario concreto con diseño técnico de integración; sigue faltando profundidad de configuración
real de producto (Finance, SCM, Commerce, Project Operations) para dejar de ser una ruta conceptual
inicial.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Diferenciación CE vs. F&O (cuándo aplica cada uno) | Conceptual | Tabla de decisión por escenario de negocio | Módulo 20 (compartido) | Justifica la elección para 3 escenarios sin genéricos ("depende") |
| Mapeo de procesos ERP estándar (O2C, P2P, R2R, I2D, Project-to-Profit) | Conceptual-Avanzado | Mapa de proceso paso a paso con actores y sistema responsable | Módulo 59, LAB-069 | Documenta los 5 procesos con pasos reales, no solo el nombre del proceso |
| Dual-write vs. DMF vs. virtual tables (diseño técnico) | Avanzado | Matriz de ownership de datos y diagrama Mermaid de integración | Módulo 59, LAB-070 | Justifica el patrón técnico por entidad y resuelve conflictos de sincronización |
| Data Management Framework conceptual | Conceptual | Explicación de un escenario de importación masiva con manejo de errores | LAB-064 (Capstone F&O Awareness) | Propone estrategia de reintentos y validación previa a carga |
| Mapa de integración ERP + CRM | Conceptual-Avanzado | Diagrama de arquitectura con puntos de fallo señalados | LAB-070, LAB-064 (Capstone F&O Awareness) | Señala ≥2 puntos de fallo y su mitigación |
| Límites de Power Platform frente a ERP | Conceptual | Lista de "esto no lo resuelve Power Platform solo" con justificación | Módulo 18/34 | Identifica correctamente ≥3 límites reales (no genéricos) |

## Solution Architect

*Arquitectura empresarial, gobernanza.* Ruta: Developer / Dynamics 365 CE / F&O Awareness → Solution Architect.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Estrategia de ambientes (Dev/Test/Prod) | Enterprise | Diagrama de ambientes + políticas de promoción | LAB-056 | Ningún cambio pasa directo a Prod sin paso por Test |
| Modelo de seguridad (roles, BU, columnas) | Enterprise | Matriz de roles vs. entidades vs. nivel de acceso | LAB-009, Módulo 33 | Principio de menor privilegio aplicado |
| ALM enterprise (pipelines multi-solución) | Enterprise | Pipeline con gates de aprobación entre ambientes | LAB-019, LAB-032 | Rollback documentado y probado al menos una vez |
| Integraciones (patrones, latencia, resiliencia) | Enterprise | Diagrama de integración con manejo de fallos (retry, circuit breaker) | Módulo 25 | Explica qué pasa si el sistema externo cae 10 minutos |
| Gobernanza (CoE Starter Kit, DLP) | Enterprise | Políticas DLP configuradas + reporte de CoE | LAB-032 | Al menos 1 política DLP bloquea un conector no autorizado en prueba |
| Riesgos, roadmap y decisiones arquitectónicas (ADR) | Enterprise | 2+ ADRs con alternativas consideradas y descartadas | Módulo 41, LAB-060 (reto) | Cada ADR justifica el descarte de al menos una alternativa razonable |
| Documentación y presentación ejecutiva | Enterprise | Deck de 8-10 láminas para un comité no técnico | Módulo 41 | Un ejecutivo no técnico entiende riesgo y costo sin preguntas básicas de seguimiento |

## AI & Copilot Specialist

*Agentes, gobernanza de IA.* Ruta transversal — se combina con cualquiera de las otras seis.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Copilot Studio (temas, entidades, fuentes de conocimiento) | Avanzado | Agente publicado + transcript de 3 conversaciones de prueba | LAB-022 | Responde correctamente en ≥2 de 3 casos fuera del guion feliz |
| AI Builder | Intermedio | Modelo entrenado + métricas de precisión | Módulo 8 (suplemento 1A) | Precisión documentada, no solo "funciona" |
| Prompting técnico y revisión de diffs generados por IA | Avanzado | Prompt + diff generado + comentario de revisión humana | LAB-053 | El revisor identifica al menos 1 riesgo o mejora en el diff |
| Seguridad y gobernanza de agentes | Avanzado | Matriz de riesgos de IA (alucinación, fuga de datos, sobre-confianza) | LAB-065 (Capstone AI & Copilot) | ≥4 riesgos identificados con mitigación concreta, no genérica |
| Escalamiento humano y auditoría de prompts | Avanzado | Política de escalamiento + log de auditoría | LAB-055 | Existe un criterio objetivo de escalamiento (no "si el bot no sabe") |
| Integración con Dataverse / Power Automate | Avanzado | Flujo disparado por el agente con resultado verificable en Dataverse | LAB-022, Módulo 44 | El registro creado coincide exactamente con lo solicitado en la conversación |
| Implementación guiada por IA (cambio acotado, revisión humana) | Intermedio | Prompt + diff + checklist de alcance/efectos secundarios/seguridad completada | LAB-045, Módulo 48 | El cambio generado por IA se verifica contra 2 escenarios de prueba antes de aprobarse |
| Flujo completo humano→IA→CI→aprobación sobre un caso real | Avanzado | Registro del ciclo diseña→IA implementa→CI valida→humano aprueba, con auditoría de prompts | LAB-051 | Ningún paso del ciclo se salta; la aprobación humana queda documentada antes del merge |
| Diseño funcional D365 Sales asistido por IA (fit-gap, mapeo a entidades estándar) | Avanzado | Documento de diseño de una página + matriz de seguridad Vendedor/Gerente | LAB-057, Módulo 55 | Cada brecha identificada está justificada, no resuelta por defecto con personalización |

---

## Capstone por ruta profesional

Cada ruta profesional tiene un proyecto final evaluable, enlazado desde `/rutas/[slug]` con una
tarjeta destacada "Proyecto final de la ruta":

| Ruta | Capstone | Rúbrica aplicable |
|---|---|---|
| Maker | LAB-061 — Sistema Interno de Gestión de Solicitudes | Low-code / Maker |
| Consultor Funcional | LAB-062 — Proyecto Funcional Completo | Consultoría Funcional |
| Developer | LAB-063 — Solución Técnica Avanzada | Desarrollo Técnico |
| Dynamics 365 Customer Engagement | LAB-060 — Capstone Microsoft Business Applications (Servicio Postventa + Power Automate + decisión F&O + ADRs) | Customer Insights / Field Service |
| Finance & Operations Awareness | LAB-064 — Arquitectura Conceptual ERP + CRM | Arquitectura Empresarial (alcance conceptual) |
| Solution Architect | Módulo 41 — Proyecto Capstone Arquitectura Enterprise | Arquitectura Empresarial (ponderada) |
| AI & Copilot | LAB-065 — Agente Empresarial Gobernado | IA y Agentes Gobernados |

Con esto, las 7 rutas quedan con evidencia de cierre verificable — no solo lectura de módulos.

---

## Especializaciones futuras / en expansión

Las filas "Customer Service" y "Finance & Operations Consultant / Architect Awareness" de esta
matriz representan lo máximo que se puede demostrar **hoy**. Cuatro áreas de especialización
avanzada todavía no tienen fila propia porque no tienen módulo, lab ni rúbrica implementados:

| Especialización futura | Estado | Detalle tema por tema |
|---|---|---|
| Expert Customer Service / Contact Center | ⚪ En expansión (base 🔵 Avanzado ya cubierta: Módulo 20, LAB-068) | [Roadmap de Especialización Avanzada](ROADMAP_ESPECIALIZACION_AVANZADA.md#1-ruta-expert-customer-service--contact-center) |
| Expert Sales Operations | ⚪ En expansión (base 🔵 Avanzado ya cubierta: Módulo 20, LAB-066) | [Roadmap de Especialización Avanzada](ROADMAP_ESPECIALIZACION_AVANZADA.md#2-ruta-expert-sales-operations) |
| F&O Practitioner / Architect Track | ⚪ En expansión (mayor brecha: solo awareness/diseño, sin configuración de producto) | [Roadmap de Especialización Avanzada](ROADMAP_ESPECIALIZACION_AVANZADA.md#3-ruta-fo-practitioner--architect-track) |
| Business Applications Architect Enterprise | ⚪ En expansión (base 🔵 Avanzado ya cubierta: LAB-070, Módulo 41) | [Roadmap de Especialización Avanzada](ROADMAP_ESPECIALIZACION_AVANZADA.md#4-ruta-business-applications-architect-enterprise) |

Ninguna de estas cuatro aparece como ruta profesional en `/rutas` ni tiene evidencia listada en
`/portafolio` — hacerlo antes de tener lab, evidencia y rúbrica reales sería prometer una
experticia que la plataforma todavía no puede respaldar. El roadmap enlazado detalla, tema por
tema, qué está en 🔵 Avanzado, qué en 🟡 Awareness y qué en ⚪ En expansión, y qué se necesita para
que cada tema pase a 🟢 Cubierto.

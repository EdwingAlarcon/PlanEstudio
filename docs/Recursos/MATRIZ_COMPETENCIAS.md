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
Estado de la ruta: **disponible** — Sales, Customer Service, Contact Center/Omnichannel, Customer
Insights - Data/Journeys y Field Service tienen módulo y lab dedicados. Las capacidades que
requieren tenant/licencia real se controlan con el recurso
[D365 Tenant Readiness](D365_TENANT_READINESS.md).

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Procesos comerciales (lead-to-cash) | Intermedio-Avanzado | BPF configurado con campos requeridos por etapa, Quote→Order con Price List Item | Módulo 20, LAB-066 | La oportunidad no avanza de etapa sin campos obligatorios; el monto de Quote y Order coincide |
| Customer Service (case-to-resolution, SLA, escalamiento, dashboard) | Avanzado | Cola configurada + SLA con pausa/reanudación + escalamiento automático + dashboard con FRT/Resolution Time/SLA Success Rate/Backlog/CSAT | Módulo 20, LAB-068 | El caso llega a la cola correcta, el SLA se pausa en espera del cliente y escala automáticamente al superar el KPI |
| Customer Insights - Journeys (segmentación, consentimiento, real-time journeys) | Avanzado | Journey documentado con trigger, consentimiento, canal, salida y métricas | Módulo 63, LAB-084 | El journey respeta consentimiento, evita envíos duplicados y tiene criterio de salida claro |
| Customer Insights - Data (unificación de perfiles, medidas, activación) | Avanzado | Regla de matching aplicada a datos de prueba + medidas con fórmula documentada | Módulo 57, LAB-085, LAB-067 | La regla de matching unifica correctamente al cliente sin email por teléfono/nombre |
| Field Service (work orders, agreements, mobile offline, scheduling) | Avanzado | Work order end-to-end + agreement preventivo + matriz mobile offline | Módulo 58, LAB-086, LAB-087 | El ciclo de orden de trabajo, mantenimiento preventivo y offline profile quedan validados o simulados con evidencia |
| Integración con Dataverse (datos compartidos entre apps) | Avanzado | Diagrama de flujo de datos entre Sales/Service/Insights | LAB-060 | Sin duplicación de entidades cliente entre apps |
| UAT y go-live de un escenario CE completo | Avanzado | 8 casos UAT + checklist de go-live | LAB-060 | 100% de casos ejecutados, checklist sin pendientes críticos |

## Finance & Operations Consultant / Architect Awareness

*ERP conceptual, integración y — desde LAB-093 a LAB-097 — configuración práctica en tenant real.*
Ruta: Consultor Funcional → Finance & Operations → Solution Architect.
Estado de la ruta: **awareness avanzado + práctica hands-on con trial tenant** — los Módulos 59/64
cubren vocabulario, mapas de proceso, ownership de datos e integración CE + F&O. Los
LAB-069/LAB-070/LAB-088/LAB-089 producen evidencia de arquitectura; LAB-093 a LAB-097 llevan al
estudiante a configurar Finance/SCM/Project Operations paso a paso en un ambiente trial/demo real.
Los pasos de LAB-093 a LAB-097 no fueron verificados contra un tenant en vivo al momento de
escribirse — ver la nota de verificación en cada lab.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Diferenciación CE vs. F&O (cuándo aplica cada uno) | Conceptual | Tabla de decisión por escenario de negocio | Módulo 20 (compartido) | Justifica la elección para 3 escenarios sin genéricos ("depende") |
| Mapeo de procesos ERP estándar (O2C, P2P, R2R, I2D, Project-to-Profit) | Conceptual-Avanzado | Mapa de proceso paso a paso con actores y sistema responsable | Módulo 59, LAB-069 | Documenta los 5 procesos con pasos reales, no solo el nombre del proceso |
| Dual-write vs. DMF vs. virtual tables (diseño técnico) | Avanzado | Matriz de ownership de datos y diagrama Mermaid de integración | Módulo 59, LAB-070 | Justifica el patrón técnico por entidad y resuelve conflictos de sincronización |
| Data Management Framework conceptual | Conceptual | Explicación de un escenario de importación masiva con manejo de errores | LAB-064 (Capstone F&O Awareness) | Propone estrategia de reintentos y validación previa a carga |
| Mapa de integración ERP + CRM | Conceptual-Avanzado | Diagrama de arquitectura con puntos de fallo señalados | LAB-070, LAB-064 (Capstone F&O Awareness) | Señala ≥2 puntos de fallo y su mitigación |
| Límites de Power Platform frente a ERP | Conceptual | Lista de "esto no lo resuelve Power Platform solo" con justificación | Módulo 18/34 | Identifica correctamente ≥3 límites reales (no genéricos) |
| Setup financiero (legal entity, calendario fiscal, catálogo de cuentas, dimensiones) | Práctico (tenant real) | Configuración ejecutada en trial/demo con capturas | LAB-093 | Legal entity, calendario, catálogo y ≥2 dimensiones documentados con evidencia |
| Ciclo Procure-to-Pay end-to-end | Práctico (tenant real) | Orden de compra → recepción → factura → pago ejecutados, con discrepancia de cantidad manejada | LAB-094 | Coincidencia de 3 vías correcta y asientos contables documentados |
| Ciclo Order-to-Cash end-to-end | Práctico (tenant real) | Pedido → envío → factura → cobro ejecutados, con envío parcial manejado | LAB-095 | Factura coincide con lo enviado, no con lo pedido; saldo pendiente documentado |
| Maestro de producto e inventario (variantes, dimensiones, reservas) | Práctico (tenant real) | Producto con variantes y jerarquía de reservas configurados | LAB-096 | ≥9 variantes y jerarquía de reservas justificada con ejemplo |
| Setup de Project Operations (WBS, facturación por hitos) | Práctico (tenant real) | Proyecto con WBS y regla de facturación mixta (hito + tiempo) configurados | LAB-097 | Hito fijo y facturación por tiempo distinguidos correctamente en la propuesta de factura |

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

## Especializaciones avanzadas y gates de ambiente real

Estas áreas ya tienen cobertura de módulo/lab o roadmap declarado. Cuando una capacidad depende de
tenant/licencia/canal real, debe completarse el gate correspondiente en
[D365 Tenant Readiness](D365_TENANT_READINESS.md) antes de presentarla como ejecución real.

| Especialización | Estado | Detalle tema por tema |
|---|---|---|
| Expert Customer Service / Contact Center | 🔵 Avanzado con canal de chat hands-on en trial (LAB-083); Voz/SMS requieren además proveedor de telefonía real | [Roadmap de Especialización Avanzada](ROADMAP_ESPECIALIZACION_AVANZADA.md#1-ruta-expert-customer-service-contact-center) |
| Expert Sales Operations | 🔵 Avanzado con forecasting/pipeline; predicción real requiere Sales/licencia/datos | [Roadmap de Especialización Avanzada](ROADMAP_ESPECIALIZACION_AVANZADA.md#2-ruta-expert-sales-operations) |
| F&O Practitioner / Architect Track | 🔵 Arquitectura, integración y setup práctico (Finance, P2P, O2C, Inventory, Project Operations) en trial tenant; Commerce y Supply Chain avanzado siguen en expansión | [Roadmap de Especialización Avanzada](ROADMAP_ESPECIALIZACION_AVANZADA.md#3-ruta-fo-practitioner-architect-track) |
| Business Applications Architect Enterprise | 🔵 Avanzado con Capstone Enterprise D365 | [Roadmap de Especialización Avanzada](ROADMAP_ESPECIALIZACION_AVANZADA.md#4-ruta-business-applications-architect-enterprise) |

El roadmap enlazado detalla qué está cubierto como diseño/lab y qué exige ambiente real. El
portafolio debe declarar el estado de cada evidencia: Simulado, Sandbox real o Productivo
controlado.

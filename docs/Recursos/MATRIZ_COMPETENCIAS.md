# Matriz de Competencias por Ruta Profesional

Esta matriz responde una pregunta distinta a la de los módulos: no "¿qué debo leer?", sino
"¿qué debo poder demostrar?". Cada fila es una competencia con evidencia verificable, el
laboratorio o proyecto que la ejercita hoy, y el criterio mínimo para considerarla aprobada.

Se apoya en la misma escala 0-4 y el mismo lenguaje de [Rúbricas y Plantillas de
Evaluación](RUBRICAS_PLANTILLAS_EVALUACION.md) — esta matriz decide **qué** evaluar por perfil;
esa rúbrica decide **cómo** puntuar cada entrega.

Cada ruta profesional ya tiene un capstone dedicado (Lab 60 a 65, o el Módulo 41 para
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
| Canvas Apps (pantallas, navegación, colecciones) | Fundacional | App exportada o enlace al environment | Lab 03 | 3+ pantallas, navegación sin errores, datos de prueba reales |
| Power Automate básico (aprobaciones, notificaciones) | Fundacional | Flujo exportado + captura de ejecución exitosa | Lab 05 | Corre sin intervención manual en 3 ejecuciones de prueba |
| Dataverse básico (tablas, relaciones, choices) | Fundacional | Diagrama de modelo de datos (3+ tablas relacionadas) | Lab 02 | Relaciones N:1/N:N correctas, sin columnas `new_` |
| UX funcional (formularios claros, mensajes de error) | Fundacional | Capturas antes/después de una revisión de usabilidad | Lab 03 (reto adicional) | Un usuario de prueba completa la tarea sin ayuda |
| Validaciones de datos (obligatoriedad, formato, duplicados) | Fundacional | Casos de prueba con datos inválidos + resultado | Lab 02 / Lab 04 | 3 casos de borde bloqueados correctamente |
| Publicación y roles básicos | Fundacional | Captura de app compartida + rol asignado | Lab 04 | Un segundo usuario accede solo a lo que le corresponde |
| Buenas prácticas low-code (nomenclatura, sin hardcode) | Fundacional | Revisión de fórmulas vs. checklist de estilo | Lab 61 (Capstone Maker) | 0 fórmulas con valores hardcodeados que deberían ser variables/Named Formulas |

## Consultor Funcional

*Discovery, fit-gap, UAT.* Ruta: Maker → Consultor Funcional → Dynamics 365 CE / Solution Architect.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Levantamiento de requerimientos / workshops | Intermedio | Acta de workshop con decisiones y pendientes | Lab 62 (Capstone Consultor Funcional) | Acta identifica ≥5 requerimientos con dueño y prioridad |
| Historias de usuario y criterios de aceptación | Intermedio | Backlog "Como... quiero... para..." + Given/When/Then | Lab 62 (Capstone Consultor Funcional) | ≥8 historias, criterios verificables (no ambiguos) |
| Procesos AS-IS / TO-BE | Intermedio | 2 diagramas de flujo con puntos de fricción marcados | Lab 60 (referencia reutilizable) | TO-BE elimina ≥2 fricciones identificadas en AS-IS |
| Fit-Gap | Intermedio | Matriz Fit-Gap con decisión (config/personalización/fuera de alcance) | Lab 60 | 100% de requerimientos clasificados, brechas con propuesta |
| Configuración Dataverse/D365 sin código | Intermedio | Entorno configurado + captura de seguridad por rol | Lab 09 | Seguridad de campo y BPF configurados y probados |
| UAT (casos, ejecución, sign-off) | Intermedio | ≥8 casos UAT con resultado pass/fail | Lab 55, Lab 60 | 100% de casos ejecutados, defectos críticos en 0 |
| Documentación funcional para stakeholders | Intermedio | Documento funcional de 3-5 páginas, lenguaje no técnico | Lab 60 | Un no-técnico puede explicar la solución tras leerlo |
| Capacitación a usuarios finales | Intermedio | Manual de usuario + agenda de sesión de capacitación | Lab 62 (Capstone Consultor Funcional) | Manual cubre los 3 flujos más usados sin jerga técnica |

## Power Platform Developer

*Extensibilidad, integración, ALM.* Ruta: Maker/Consultor Funcional → Developer → Solution Architect.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Power Fx avanzado (delegable, funciones de colección) | Avanzado | Fórmulas con anotación de por qué son delegables | Lab 03 (reto), Módulo 12 | 0 advertencias de delegación en datasets &gt;500 filas |
| Dataverse avanzado (plugins, business rules complejas) | Avanzado | Plugin registrado en PRT con imagen pre/post | Lab 23 | Pasa unit tests con Moq + captura de registro en PRT |
| JavaScript / web resources | Avanzado | Web resource con manejo de errores, sin globales en `window` | Módulo 21 | Pasa linter, sin `eval` ni credenciales embebidas |
| Plugins C# / Custom APIs | Avanzado | Código fuente + resultado de unit tests | Lab 23 | Cobertura ≥ 1 caso feliz + 1 caso de error |
| PCF Controls | Avanzado | Control empaquetado + captura funcionando en formulario | Lab 63 (Capstone Developer) | Maneja al menos un estado de error de forma visible |
| Custom Connectors | Avanzado | Connector con swagger/OpenAPI documentado | Lab 54 | Autentica y responde con datos reales de prueba |
| Power Platform CLI | Avanzado | Historial de comandos usados en export/import de solución | Lab 52, Lab 53 | Exporta e importa sin edición manual del zip |
| ALM (pipelines, ambientes, connection references) | Avanzado | Pipeline YAML + evidencia de despliegue Dev→Test | Lab 19 | Corre sin intervención manual, usa variables de entorno |
| Observabilidad e integraciones | Avanzado | Log de errores capturado y explicado | Módulo 26/27 | Un incidente simulado diagnosticado con logs, no prueba y error |

## Dynamics 365 Customer Engagement Consultant

*Sales, Service, Insights, Field Service.* Ruta: Consultor Funcional → Dynamics 365 CE → Solution Architect.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Procesos comerciales (lead-to-cash) | Intermedio-Avanzado | BPF configurado con campos requeridos por etapa, Quote→Order con Price List Item | Módulo 20, Lab 66 | La oportunidad no avanza de etapa sin campos obligatorios; el monto de Quote y Order coincide |
| Casos de servicio y colas | Intermedio-Avanzado | Cola configurada + regla de enrutamiento probada | Lab 59 (adaptable) | El caso llega a la cola correcta según el criterio definido |
| Customer Insights - Journeys (segmentación, journeys) | Avanzado | Segmento + journey documentado con trigger y salida | Lab 58 | Segmento filtra correctamente, sin envíos duplicados en el journey |
| Customer Insights - Data (unificación de perfiles, medidas, activación) | Avanzado | Regla de matching aplicada a datos de prueba + medidas con fórmula documentada | Módulo 57, Lab 67 | La regla de matching unifica correctamente al cliente sin email por teléfono/nombre |
| Field Service (work orders, SLAs) | Avanzado | Work order de principio a fin + SLA con escalamiento | Lab 59 | El SLA se dispara y escala cuando se incumple el tiempo |
| Integración con Dataverse (datos compartidos entre apps) | Avanzado | Diagrama de flujo de datos entre Sales/Service/Insights | Lab 60 | Sin duplicación de entidades cliente entre apps |
| UAT y go-live de un escenario CE completo | Avanzado | 8 casos UAT + checklist de go-live | Lab 60 | 100% de casos ejecutados, checklist sin pendientes críticos |

## Finance & Operations Consultant / Architect Awareness

*ERP conceptual, integración.* Ruta: Consultor Funcional → Finance & Operations → Solution Architect.
Estado de la ruta: **cobertura en expansión** — no exigir el capstone completo hasta ampliar
módulos F&O dedicados.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Diferenciación CE vs. F&O (cuándo aplica cada uno) | Conceptual | Tabla de decisión por escenario de negocio | Módulo 20 (compartido) | Justifica la elección para 3 escenarios sin genéricos ("depende") |
| Dual-write conceptual | Conceptual | Diagrama de entidades sincronizadas + dirección del flujo | Lab 64 (Capstone F&O Awareness) | Identifica qué entidad es "fuente de verdad" en cada dirección |
| Data Management Framework conceptual | Conceptual | Explicación de un escenario de importación masiva con manejo de errores | Lab 64 (Capstone F&O Awareness) | Propone estrategia de reintentos y validación previa a carga |
| Mapa de integración ERP + CRM | Conceptual-Avanzado | Diagrama de arquitectura con puntos de fallo señalados | Lab 64 (Capstone F&O Awareness) | Señala ≥2 puntos de fallo y su mitigación |
| Límites de Power Platform frente a ERP | Conceptual | Lista de "esto no lo resuelve Power Platform solo" con justificación | Módulo 18/34 | Identifica correctamente ≥3 límites reales (no genéricos) |

## Solution Architect

*Arquitectura empresarial, gobernanza.* Ruta: Developer / Dynamics 365 CE / F&O Awareness → Solution Architect.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Estrategia de ambientes (Dev/Test/Prod) | Enterprise | Diagrama de ambientes + políticas de promoción | Lab 56 | Ningún cambio pasa directo a Prod sin paso por Test |
| Modelo de seguridad (roles, BU, columnas) | Enterprise | Matriz de roles vs. entidades vs. nivel de acceso | Lab 09, Módulo 33 | Principio de menor privilegio aplicado |
| ALM enterprise (pipelines multi-solución) | Enterprise | Pipeline con gates de aprobación entre ambientes | Lab 19, Lab 32 | Rollback documentado y probado al menos una vez |
| Integraciones (patrones, latencia, resiliencia) | Enterprise | Diagrama de integración con manejo de fallos (retry, circuit breaker) | Módulo 25 | Explica qué pasa si el sistema externo cae 10 minutos |
| Gobernanza (CoE Starter Kit, DLP) | Enterprise | Políticas DLP configuradas + reporte de CoE | Lab 32 | Al menos 1 política DLP bloquea un conector no autorizado en prueba |
| Riesgos, roadmap y decisiones arquitectónicas (ADR) | Enterprise | 2+ ADRs con alternativas consideradas y descartadas | Módulo 41, Lab 60 (reto) | Cada ADR justifica el descarte de al menos una alternativa razonable |
| Documentación y presentación ejecutiva | Enterprise | Deck de 8-10 láminas para un comité no técnico | Módulo 41 | Un ejecutivo no técnico entiende riesgo y costo sin preguntas básicas de seguimiento |

## AI & Copilot Specialist

*Agentes, gobernanza de IA.* Ruta transversal — se combina con cualquiera de las otras seis.

| Competencia | Nivel | Evidencia esperada | Lab / proyecto | Criterio de aprobación |
|---|---|---|---|---|
| Copilot Studio (temas, entidades, fuentes de conocimiento) | Avanzado | Agente publicado + transcript de 3 conversaciones de prueba | Lab 22 | Responde correctamente en ≥2 de 3 casos fuera del guion feliz |
| AI Builder | Intermedio | Modelo entrenado + métricas de precisión | Módulo 8 (suplemento 1A) | Precisión documentada, no solo "funciona" |
| Prompting técnico y revisión de diffs generados por IA | Avanzado | Prompt + diff generado + comentario de revisión humana | Lab 53 | El revisor identifica al menos 1 riesgo o mejora en el diff |
| Seguridad y gobernanza de agentes | Avanzado | Matriz de riesgos de IA (alucinación, fuga de datos, sobre-confianza) | Lab 65 (Capstone AI & Copilot) | ≥4 riesgos identificados con mitigación concreta, no genérica |
| Escalamiento humano y auditoría de prompts | Avanzado | Política de escalamiento + log de auditoría | Lab 55 | Existe un criterio objetivo de escalamiento (no "si el bot no sabe") |
| Integración con Dataverse / Power Automate | Avanzado | Flujo disparado por el agente con resultado verificable en Dataverse | Lab 22, Módulo 44 | El registro creado coincide exactamente con lo solicitado en la conversación |

---

## Capstone por ruta profesional

Cada ruta profesional tiene un proyecto final evaluable, enlazado desde `/rutas/[slug]` con una
tarjeta destacada "Proyecto final de la ruta":

| Ruta | Capstone | Rúbrica aplicable |
|---|---|---|
| Maker | Lab 61 — Sistema Interno de Gestión de Solicitudes | Low-code / Maker |
| Consultor Funcional | Lab 62 — Proyecto Funcional Completo | Consultoría Funcional |
| Developer | Lab 63 — Solución Técnica Avanzada | Desarrollo Técnico |
| Dynamics 365 Customer Engagement | Lab 60 — Proyecto Integrador Servicio Postventa | Customer Insights / Field Service |
| Finance & Operations Awareness | Lab 64 — Arquitectura Conceptual ERP + CRM | Arquitectura Empresarial (alcance conceptual) |
| Solution Architect | Módulo 41 — Proyecto Capstone Arquitectura Enterprise | Arquitectura Empresarial (ponderada) |
| AI & Copilot | Lab 65 — Agente Empresarial Gobernado | IA y Agentes Gobernados |

Con esto, las 7 rutas quedan con evidencia de cierre verificable — no solo lectura de módulos.

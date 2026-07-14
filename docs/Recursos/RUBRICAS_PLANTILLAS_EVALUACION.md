# Rúbricas y Plantillas de Evaluación

Este recurso convierte laboratorios y proyectos en evidencia verificable. Úsalo como paquete base para revisar entregables de Customer Insights, Field Service, UAT, ALM, consultoría funcional y proyectos integradores sin crear documentos distintos para cada módulo.

## Cuándo usar este recurso

- Al cerrar un laboratorio con evidencia esperada.
- Antes de UAT con usuarios de negocio.
- Al revisar un diseño funcional o técnico.
- En proyectos integradores de nivel avanzado o arquitecto.
- Cuando un estudiante necesita saber qué significa "aprobado" más allá de completar pasos.

## Escala de evaluación

| Nivel | Criterio | Interpretación |
|---|---|---|
| 0 | No entregado | No existe evidencia revisable o no corresponde al escenario |
| 1 | Inicial | Entrega incompleta, con decisiones implícitas y baja trazabilidad |
| 2 | Funcional | Resuelve el caso principal, pero omite excepciones o controles |
| 3 | Profesional | Cubre proceso, datos, seguridad, evidencia y validaciones |
| 4 | Enterprise | Además incluye riesgos, operación, auditoría, métricas y mejora continua |

Regla práctica: un laboratorio se considera aprobado con promedio mínimo 3 y ningún criterio crítico en 0.

## Rúbrica general para laboratorios

| Criterio | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Objetivo de negocio | No identificado | Descrito de forma genérica | Relacionado con el escenario | Claro, medible y alineado a rol | Incluye impacto, KPI y trade-offs |
| Diseño funcional | No existe | Lista pantallas o pasos sueltos | Cubre happy path | Cubre reglas, roles y excepciones | Incluye Fit-Gap, decisiones y alcance |
| Datos de prueba | No existen | Datos ambiguos | Datos mínimos para happy path | Datos para happy path, error y permisos | Datos representativos, anonimizados y reutilizables |
| Seguridad y permisos | No considerada | Roles mencionados sin detalle | Roles básicos definidos | Matriz rol-permiso verificable | Incluye mínimo privilegio, auditoría y segregación |
| Evidencia | No hay evidencia | Capturas aisladas | Evidencia del resultado principal | Evidencia vinculada a criterios | Evidencia trazable, versionada y revisable |
| Validaciones | No se ejecutan | Validación manual informal | Validación del caso principal | Validaciones funcionales y técnicas | Incluye regresión, monitoreo y criterios de salida |
| Documentación | No existe | Notas dispersas | Documento básico | Documento claro para negocio y equipo técnico | Documento mantenible con owner, versión y decisiones |

## Plantilla de caso UAT

| Campo | Contenido esperado |
|---|---|
| ID | UAT-[DOMINIO]-### |
| Requerimiento asociado | REQ-### |
| Historia de usuario | Como [rol], quiero [acción], para [beneficio] |
| Tipo | Happy path, excepción, permisos, integración, datos, caso límite |
| Precondiciones | Datos, roles, ambiente y configuración requeridos |
| Pasos | Acciones numeradas que ejecuta el usuario |
| Resultado esperado | Resultado observable y medible |
| Evidencia | Captura, log, registro, export, firma o comentario |
| Estado | Pendiente, en ejecución, aprobado, rechazado, bloqueado |
| Defecto asociado | ID del bug o incidencia si falla |
| Aprobador | Usuario de negocio responsable del sign-off |

Ejemplo:

| ID | Requerimiento | Tipo | Resultado esperado | Evidencia |
|---|---|---|---|---|
| UAT-CI-001 | REQ-CI-001 | Happy path | Contacto con consentimiento entra al journey | Captura del segmento y registro del journey |
| UAT-FS-003 | REQ-FS-003 | Excepción | Work Order crítica queda agendada dentro de SLA | Booking con técnico, fecha y skill |

## Matriz de trazabilidad

| Req ID | Historia | Diseño funcional | Componente técnico | Caso UAT | Evidencia | Estado |
|---|---|---|---|---|---|---|
| REQ-CI-001 | Renovación con consentimiento | FDD-CI-01 Segmento gobernado | Customer Insights segment | UAT-CI-001 | Segmento + contactos incluidos | Aprobado |
| REQ-CI-002 | Excluir cliente con caso crítico | FDD-CI-02 Exclusiones | Segment rule + Case filter | UAT-CI-002 | Contacto excluido con justificación | Pendiente |
| REQ-FS-001 | Crear visita desde caso | FDD-FS-01 Caso a Work Order | Case + Work Order | UAT-FS-001 | Work Order creada | Aprobado |
| REQ-FS-002 | Capturar evidencia móvil | FDD-FS-03 Inspección móvil | Field Service Mobile | UAT-FS-005 | Foto + checklist + firma | En prueba |

Controles mínimos:

- Cada requerimiento tiene al menos un caso UAT.
- Cada caso UAT tiene evidencia esperada.
- Cada componente técnico tiene una razón funcional.
- Cada cambio de alcance genera nueva fila o actualiza estado.

## Plantilla de evidencia

| Evidencia | Formato | Nombre sugerido | Criterio cubierto |
|---|---|---|---|
| Captura de configuración | PNG/PDF | `REQ-CI-001_segmento.png` | Reglas del segmento |
| Export de datos de prueba | CSV/XLSX | `UAT-FS-001_datos-prueba.xlsx` | Datos representativos |
| Registro ejecutado | URL o captura | `UAT-FS-003_booking.png` | Scheduling dentro de SLA |
| Sign-off | PDF/Markdown | `UAT-signoff-sprint-4.md` | Aprobación de negocio |
| Decisión arquitectónica | Markdown | `ADR-004-customer-insights-consent.md` | Justificación de diseño |

Checklist de calidad de evidencia:

- [ ] La evidencia identifica qué requerimiento prueba.
- [ ] No contiene datos reales sensibles si se usó IA o repositorio público.
- [ ] Puede ser revisada por alguien que no estuvo en la sesión.
- [ ] Incluye fecha, responsable y ambiente.
- [ ] Se conserva junto al entregable o en una ruta documentada.

## Plantillas copiables

Estas plantillas están pensadas para copiarse directamente a un archivo Markdown, Word o Excel. Reemplaza los valores entre corchetes y elimina las filas que no apliquen al proyecto.

### 1. Plantilla copiable: matriz de trazabilidad

```markdown
# Matriz de Trazabilidad — [Proyecto]

**Cliente/área:** [Nombre ficticio o área interna]  
**Versión:** [v1.0]  
**Responsable:** [Nombre / rol]  
**Fecha:** [AAAA-MM-DD]

| Req ID | Requerimiento | Historia de usuario | Diseño funcional | Componente técnico | Caso UAT | Evidencia esperada | Estado |
|---|---|---|---|---|---|---|---|
| REQ-001 | [Necesidad de negocio] | Como [rol], quiero [acción], para [beneficio] | FDD-01 [sección] | [Tabla/flujo/app/journey] | UAT-001 | [captura/log/registro] | Pendiente |
| REQ-002 | [Necesidad de negocio] | Como [rol], quiero [acción], para [beneficio] | FDD-02 [sección] | [Tabla/flujo/app/journey] | UAT-002 | [captura/log/registro] | Pendiente |

## Controles

- [ ] Cada requerimiento crítico tiene al menos un caso UAT.
- [ ] Cada caso UAT tiene evidencia esperada.
- [ ] Cada componente técnico tiene una justificación funcional.
- [ ] Los cambios de alcance están marcados como nuevo requerimiento o change request.
```

### 2. Plantilla copiable: caso UAT

```markdown
# Caso UAT — [UAT-###]

| Campo | Valor |
|---|---|
| Requerimiento asociado | [REQ-###] |
| Historia de usuario | Como [rol], quiero [acción], para [beneficio] |
| Tipo de prueba | [Happy path / excepción / permisos / integración / datos / caso límite] |
| Rol que ejecuta | [Usuario de negocio] |
| Ambiente | [UAT / Sandbox] |
| Precondiciones | [Datos, roles, configuración previa] |
| Datos de prueba | [Cuenta, contacto, activo, importe, estado, etc.] |

## Pasos

1. [Acción del usuario]
2. [Acción del usuario]
3. [Acción del usuario]

## Resultado esperado

- [Resultado observable]
- [Registro actualizado]
- [Notificación, booking, journey, approval o evidencia generada]

## Evidencia requerida

- [ ] Captura o enlace del registro.
- [ ] Log, historial o auditoría si aplica.
- [ ] Comentario del usuario de negocio.

## Resultado de ejecución

| Estado | Defecto asociado | Comentarios | Aprobador |
|---|---|---|---|
| Pendiente | N/A | N/A | [Nombre / rol] |
```

### 3. Plantilla copiable: sign-off y checklist de evidencia

```markdown
# Sign-off UAT / Evidencia — [Proyecto]

**Fecha de revisión:** [AAAA-MM-DD]  
**Sprint / release:** [Nombre]  
**Ambiente:** [UAT / Sandbox / PROD]  
**Responsable funcional:** [Nombre / rol]  
**Responsable técnico:** [Nombre / rol]

## Resumen

| Métrica | Resultado |
|---|---|
| Casos UAT planificados | [número] |
| Casos aprobados | [número] |
| Casos rechazados | [número] |
| Defectos bloqueantes abiertos | [número] |
| Riesgo residual | [Bajo / Medio / Alto] |

## Checklist de aprobación

- [ ] Requerimientos críticos cubiertos por UAT.
- [ ] Evidencias almacenadas y nombradas de forma trazable.
- [ ] Roles y permisos validados.
- [ ] Datos sensibles anonimizados o protegidos.
- [ ] Defectos bloqueantes cerrados o aceptados formalmente.
- [ ] Go-live o siguiente fase aprobado por negocio.

## Decisión

| Decisión | Selección |
|---|---|
| Aprobado para siguiente fase | [Sí / No] |
| Aprobado con observaciones | [Sí / No] |
| Requiere nuevo ciclo UAT | [Sí / No] |

## Firmas

| Rol | Nombre | Comentario | Fecha |
|---|---|---|---|
| Negocio | [Nombre] | [Comentario] | [AAAA-MM-DD] |
| TI / Arquitectura | [Nombre] | [Comentario] | [AAAA-MM-DD] |
| QA / UAT Lead | [Nombre] | [Comentario] | [AAAA-MM-DD] |
```

## Rúbrica específica: Customer Insights

| Criterio | Aprobado profesional |
|---|---|
| Perfil y fuentes | Fuentes, dueños y propósito documentados |
| Segmento | Reglas verificables con datos de prueba |
| Consentimiento | Propósito, canal y exclusiones definidos antes del journey |
| Journey | Trigger, ramas, salida y métricas documentadas |
| Riesgo operativo | Clientes con casos críticos quedan excluidos o salen del journey |

## Rúbrica específica: Customer Insights - Data

| Criterio | Aprobado profesional |
|---|---|
| Matriz de fuentes | Cada fuente documentada con dato, uso y dueño |
| Reglas de matching | Regla explícita que resuelve casos sin clave compartida (ej. sin email) |
| Medidas | Fórmula documentada y fuentes identificadas para cada medida |
| Activación | Todo segmento declara un destino de activación y la acción que dispara ahí |
| Riesgo de datos | Riesgos de duplicidad, gobierno y frecuencia de actualización identificados |

## Rúbrica específica: Customer Service

| Criterio | Aprobado profesional |
|---|---|
| Configuración del caso | Case Type, prioridad y entitlement validados antes de enrutar el caso |
| Colas | Clasificadas como públicas o privadas con justificación, no por defecto |
| SLA | KPIs con pausa/reanudación documentados, no un temporizador simple |
| Escalamiento | Regla automática ligada al KPI (Warning/Failure), no discrecional del agente |
| Conocimiento | Knowledge Article vinculado al caso resuelto, con ciclo de vida respetado |
| Dashboard operativo | Reporta First Response Time, Resolution Time, SLA Success Rate, Backlog y CSAT conceptual |
| Autoservicio | Portal respeta campos de solo lectura para el cliente (prioridad, SLA no editables) |
| UAT | Cubre happy path, pausa de SLA, escalamiento, entitlement agotado y autoservicio |

## Rúbrica específica: Field Service

| Criterio | Aprobado profesional |
|---|---|
| Flujo funcional | Case, Work Order y Booking están diferenciados |
| Datos mínimos | Cuenta, activo, incident type, ubicación, prioridad y ventana definidos |
| Scheduling | Asignación considera skill, disponibilidad, ubicación y SLA |
| Incident Type | Duración, Characteristics y tareas obligatorias definidas, no solo una etiqueta |
| Evidencia móvil | Checklist, foto, medición, firma o nota de cierre definidos |
| UAT | Cubre happy path, garantía, prioridad crítica, permisos y evidencia incompleta |

## Proyecto integrador sugerido

**Escenario:** diseñar una solución de servicio postventa para SIT que combine Sales, Customer Service, Customer Insights y Field Service.

Laboratorio recomendado: `LAB-060 — Proyecto Integrador: Servicio Postventa con Customer Insights y Field Service`.

Entregables mínimos:

- Mapa de proceso TO-BE.
- Fit-Gap contra entidades estándar.
- Segmento y journey de renovación con consentimiento.
- Flujo Case → Work Order → Booking → Mobile execution.
- Matriz de seguridad.
- Matriz de trazabilidad.
- 8 casos UAT.
- Evidencia de ejecución o diseño revisable.
- Checklist de go-live y rollback conceptual.

Criterios de aprobación:

- [ ] El diseño evita duplicar entidades estándar sin justificación.
- [ ] Customer Insights no se usa como CRM transaccional.
- [ ] Field Service no se reduce a agenda manual.
- [ ] UAT cubre al menos 2 errores, 2 permisos y 1 integración.
- [ ] La matriz de trazabilidad conecta todos los requerimientos críticos.
- [ ] La evidencia esperada permite auditar el resultado.

## Rúbrica específica: Low-code / Maker

| Criterio | Aprobado profesional |
|---|---|
| Modelo de datos | Tablas relacionadas correctamente, sin columnas `new_`, choices en vez de texto libre para valores fijos |
| Experiencia de usuario | Formularios con validación visible, mensajes de error claros, sin pantallas en blanco ante datos vacíos |
| Validaciones | Casos de borde (campo vacío, duplicado, fuera de rango) bloqueados antes de guardar |
| Seguridad básica | Al menos 2 roles probados con un segundo usuario real, sin acceso "Administrador" por defecto |
| Documentación | Manual de usuario de 1-2 páginas que un no-técnico puede seguir sin ayuda |

## Rúbrica específica: Consultoría Funcional

| Criterio | Aprobado profesional |
|---|---|
| Discovery | Preguntas identifican ambigüedades reales del caso, no solo confirman lo ya dicho |
| Historias de usuario | Formato "Como... quiero... para..." con criterios de aceptación verificables (no "funciona bien") |
| Fit-Gap | 100% de requerimientos clasificados (config/personalización/fuera de alcance), brechas con propuesta |
| Trazabilidad | Cada requerimiento crítico enlaza a un caso UAT y una evidencia |
| UAT | Casos cubren happy path, al menos una excepción y al menos un caso de permisos |
| Documentación funcional | Un stakeholder no técnico entiende la solución sin preguntas de seguimiento básicas |

## Rúbrica específica: Desarrollo Técnico (plugins, PCF, connectors, ALM)

| Criterio | Aprobado profesional |
|---|---|
| Calidad técnica | Código sin lógica duplicada, sin `context.Depth` sin controlar (anti-recursión en plugins) |
| Pruebas | Al menos 1 unit test de caso feliz y 1 de caso de error, en verde |
| Seguridad | Sin secretos/API keys hardcodeados; usa Connection References y Environment Variables |
| ALM | Solución exportable managed/unmanaged según ambiente, ningún cambio directo en PROD |
| Mantenibilidad | Nombres de componentes y variables consistentes con la convención del proyecto |
| Documentación técnica | Explica decisiones no obvias (por qué síncrono/asíncrono, por qué esa integración) |

## Rúbrica específica: Finance & Operations — Procesos ERP e Integración

| Criterio | Aprobado profesional |
|---|---|
| Mapas de proceso ERP | Los 5 procesos (O2C, P2P, R2R, I2D, Project-to-Profit) tienen pasos reales, no solo el nombre |
| Frontera CE vs. F&O | El evento disparador del cruce entre Sales/Dataverse y F&O está nombrado explícitamente |
| Ownership de datos | Fuente de verdad y dirección de sincronización documentadas por entidad, no genéricas |
| Patrón de integración | Dual-write, DMF o virtual table justificado por el criterio de decisión, no por familiaridad |
| Resolución de conflictos | Regla explícita de qué sistema gana ante un conflicto bidireccional |
| Riesgos técnicos | ≥5 riesgos con probabilidad, impacto y mitigación específica |
| Comunicación ejecutiva | Un comité no técnico entiende la recomendación final sin jerga de F&O |

## Rúbrica específica: Arquitectura Empresarial

| Criterio | Peso | Aprobado profesional |
|---|---|---|
| Arquitectura objetivo y ADRs | 20% | Al menos 2 ADRs con alternativas descartadas y su justificación |
| Modelo de seguridad | 15% | Principio de menor privilegio aplicado, sin roles amplios "por ahora" |
| ALM enterprise | 15% | Pipeline con gates de aprobación entre ambientes y rollback probado al menos una vez |
| Integraciones | 15% | Manejo explícito de fallos (retry, circuit breaker, dead-letter) documentado |
| Gobernanza | 15% | Al menos una política DLP o de CoE verificada en la prueba, no solo descrita |
| Riesgos y roadmap | 10% | Riesgos con probabilidad/impacto y plan de mitigación, no una lista genérica |
| Comunicación ejecutiva | 10% | Un ejecutivo no técnico entiende riesgo y costo sin preguntas básicas de seguimiento |

Aprobación: ≥ 75/100 y ningún criterio en nivel 0-1. Esta rúbrica reemplaza como criterio
principal a la autoevaluación 1-5 de dominio — la autoevaluación se conserva como reflexión
complementaria, no como el criterio que decide si el capstone está aprobado.

## Rúbrica específica: IA y Agentes Gobernados

| Criterio | Aprobado profesional |
|---|---|
| Diseño del agente | Alcance y temas responden a un caso de negocio concreto, no un demo genérico |
| Fuentes de conocimiento | Documentadas con dueño y fecha de actualización |
| Seguridad de IA | Matriz de riesgos (alucinación, fuga de datos, sobre-confianza) con mitigación específica, no genérica |
| Escalamiento humano | Criterio objetivo de cuándo escalar (no "si el bot no sabe") |
| Integración | Acción del agente en Dataverse/Power Automate coincide exactamente con lo solicitado en la conversación |
| Auditoría | Log o transcript conservado de al menos 3 conversaciones de prueba, incluida una fuera del guion feliz |

## Evaluación práctica final por nivel

Cada nivel cierra con un proyecto integrador ya existente en el contenido — esta sección lo
conecta con una rúbrica y un umbral numérico, en vez de dejar solo un checklist de honor.

| Nivel | Caso de negocio y entregables | Rúbrica a aplicar | Aprobación | Excelencia |
|---|---|---|---|---|
| N1 — Básico | Módulo 8, *Primer Proyecto Integrado*: sistema de solicitudes con Dataverse, Canvas App, Model-Driven App, Power Automate y Power BI | Low-code / Maker | ≥ 65/100, ningún criterio en 0 | ≥ 85/100 |
| N2 — Intermedio | Módulo 17, *Proyecto Integrador Nivel 2*: solución de ventas con Component Library, Child Flows, RLS y bot de Teams | Low-code / Maker + Consultoría Funcional (seguridad y documentación funcional) | ≥ 70/100, ningún criterio en 0 | ≥ 88/100 |
| N3 — Avanzado | Módulo 30, *Proyecto Multicapa Nivel 3*: 6 soluciones con plugin, PCF, integración vía Service Bus y Copilot Studio con SSO | Desarrollo Técnico | ≥ 70/100, ningún criterio en 0 | ≥ 90/100 |
| N4 — Arquitecto | Módulo 41, *Proyecto Capstone Arquitectura Enterprise*: solución multi-tenant con Zero Trust, Fabric y presentación ejecutiva | Arquitectura Empresarial (ponderada) | ≥ 75/100, ningún criterio en 0-1 | ≥ 92/100 |
| Nivel IA | LAB-051, *Proyecto Integrador Nivel IA*: flujo diseña→IA implementa→CI valida→humano aprueba sobre un cambio real, con auditoría de prompts y matriz de riesgos de IA propia del cambio | IA y Agentes Gobernados | ≥ 70/100, ningún criterio en 0 | ≥ 88/100 |

Las 5 rutas de nivel quedan con un proyecto de cierre equivalente en exigencia: LAB-051 (Nivel IA)
tiene el mismo formato de escenario, entregables, evidencia esperada y rúbrica ponderada que los
módulos 8, 17, 30 y 41. El Capstone AI & Copilot (LAB-065, ver [Matriz de
Competencias](MATRIZ_COMPETENCIAS.md)) sigue siendo distinto y complementario: cierra la ruta
profesional transversal AI & Copilot, no el nivel IA completo.

**Nota sobre el Nivel Dynamics 365 Especialización:** a diferencia de los 5 niveles anteriores, este
nivel transversal (Módulos 56-65) sí cuenta con un capstone enterprise (LAB-090) y labs avanzados por dominio — sus módulos son
de vocabulario y arquitectura (Customer Engagement como ecosistema, Customer Insights - Data,
Field Service avanzado, Finance & Operations), y la práctica evaluable vive en los capstones de
las rutas profesionales que ese vocabulario alimenta: LAB-066 (Sales, ruta Dynamics 365 CE), LAB-067
(Customer Insights - Data, misma ruta), LAB-068 (Customer Service case-to-resolution, misma ruta),
LAB-060 (capstone Microsoft Business Applications, rutas Dynamics 365 CE y Solution Architect) y
LAB-069/LAB-070/LAB-064 (mapeo de procesos, integración técnica y capstone F&O Awareness, ruta
Finance & Operations). Esto es
intencional, no una brecha: el nivel D365 existe para dar profundidad conceptual transversal, y
son las rutas profesionales las que exigen la evidencia práctica correspondiente.

## Uso recomendado por rol

| Rol | Qué debe entregar |
|---|---|
| Maker | Evidencia de app/flujo funcionando y checklist básico |
| Consultor Funcional | FDD, historias, UAT, trazabilidad y sign-off (LAB-062, LAB-101 — backlog Azure DevOps y caso integrado admisión/servicio/retención/cobranza) |
| Developer | Diseño técnico, pruebas, ALM y evidencia de build |
| Dynamics 365 Customer Engagement | Segmento/journey, Work Order/SLA, ciclo case-to-resolution (LAB-068), matriz de trazabilidad y UAT del LAB-060 |
| Finance & Operations Awareness | Mapas de proceso ERP (LAB-069), diseño técnico de integración (LAB-070), matriz de integración ERP+CRM, dual-write conceptual y matriz de riesgos (LAB-064) |
| Solution Architect | Blueprint, riesgos, decisiones, seguridad, go-live y operación |
| AI/Copilot | Prompts sanitizados, revisión humana y trazabilidad de decisiones |

Ver la matriz completa de competencias por perfil, con evidencia y criterio de aprobación por
ítem, en [Matriz de Competencias](MATRIZ_COMPETENCIAS.md).

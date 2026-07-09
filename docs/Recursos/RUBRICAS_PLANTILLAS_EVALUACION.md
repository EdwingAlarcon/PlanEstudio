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

## Rúbrica específica: Field Service

| Criterio | Aprobado profesional |
|---|---|
| Flujo funcional | Case, Work Order y Booking están diferenciados |
| Datos mínimos | Cuenta, activo, incident type, ubicación, prioridad y ventana definidos |
| Scheduling | Asignación considera skill, disponibilidad, ubicación y SLA |
| Evidencia móvil | Checklist, foto, medición, firma o nota de cierre definidos |
| UAT | Cubre happy path, garantía, prioridad crítica, permisos y evidencia incompleta |

## Proyecto integrador sugerido

**Escenario:** diseñar una solución de servicio postventa para SIT que combine Sales, Customer Service, Customer Insights y Field Service.

Laboratorio recomendado: `Lab 60 — Proyecto Integrador: Servicio Postventa con Customer Insights y Field Service`.

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

## Uso recomendado por rol

| Rol | Qué debe entregar |
|---|---|
| Maker | Evidencia de app/flujo funcionando y checklist básico |
| Consultor Funcional | FDD, historias, UAT, trazabilidad y sign-off |
| Developer | Diseño técnico, pruebas, ALM y evidencia de build |
| Solution Architect | Blueprint, riesgos, decisiones, seguridad, go-live y operación |
| AI/Copilot | Prompts sanitizados, revisión humana y trazabilidad de decisiones |

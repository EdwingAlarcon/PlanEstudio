---
id: lab-59
title: "Field Service — Work Order, Evidencia Móvil y UAT de Servicio en Campo"
level: "N3"
duration: 105
product: ["Dynamics 365 Field Service", "Dynamics 365 Customer Service", "Dataverse"]
certifications: ["PL-400", "Dynamics 365 Customer Engagement"]
role: ["Functional Consultant", "Solution Architect"]
prerequisites:
  - "Módulo 20 estudiado: Dynamics 365 CE — Sales y Customer Service"
  - "Conocimiento básico de casos, órdenes de trabajo, recursos y roles de servicio"
files: []
---

# Lab 59 — Field Service: Work Order, Evidencia Móvil y UAT de Servicio en Campo

## Objetivo

Al finalizar este laboratorio habrás diseñado el flujo funcional de Field Service desde un caso de soporte hasta una orden de trabajo ejecutada en campo, incluyendo datos mínimos, criterios de scheduling, evidencia móvil y casos UAT.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** Un cliente reporta falla de un equipo en garantía. El agente de soporte debe validar el derecho de servicio, crear una orden de trabajo, el dispatcher debe asignar un técnico con la skill correcta y el técnico debe capturar evidencia móvil para cerrar el servicio.

## Prerrequisitos

- Entender la diferencia entre `Case`, `Work Order` y `Booking`.
- Conocer el concepto de customer asset e incident type.
- Tener una lista de técnicos, skills y disponibilidad simulada.

## Herramientas necesarias

- Dynamics 365 Field Service o diseño funcional equivalente.
- Dynamics 365 Customer Service para el caso inicial.
- Hoja de cálculo o Markdown para UAT y matriz de trazabilidad.

## Datos de prueba

| Cliente | Activo | Falla | Garantía | Prioridad | Skill requerida | Ventana |
|---|---|---|---|---|---|---|
| Contoso Andina | Compresor CX-200 | Sobrecalentamiento | Sí | Alta | HVAC nivel 2 | 24 h |
| Fabrikam Norte | Sensor IoT S-10 | Sin señal | No | Media | IoT nivel 1 | 72 h |
| Litware Sur | Bomba B-500 | Fuga | Sí | Crítica | Mecánica nivel 3 | 8 h |

## Pasos detallados

### Paso 1 — Trazar el flujo funcional

| Paso | Registro | Responsable | Resultado |
|---|---|---|---|
| 1 | Case | Agente de servicio | Solicitud registrada |
| 2 | Entitlement o garantía | Agente de servicio | Derecho de servicio validado |
| 3 | Work Order | Agente o dispatcher | Trabajo técnico creado |
| 4 | Booking | Dispatcher | Técnico asignado |
| 5 | Mobile execution | Técnico | Evidencias capturadas |
| 6 | Work Order completed | Técnico/dispatcher | Servicio cerrado |

### Paso 2 — Definir plantilla mínima de Work Order

| Campo | Valor esperado | Validación |
|---|---|---|
| Service Account | Cuenta del cliente | Obligatorio |
| Customer Asset | Equipo afectado | Obligatorio si hay garantía |
| Incident Type | Tipo de falla | Define duración y tareas |
| Priority | Alta, media o crítica | Alineada al SLA |
| Primary Incident Description | Descripción clara | Sin datos ambiguos |
| Work Location | Dirección validada | Requerida para scheduling |
| Products/Services | Materiales o servicio | Requerido para costo |

### Paso 3 — Diseñar criterios de scheduling

El dispatcher debe asignar técnico según:

- Skill requerida.
- Disponibilidad en la ventana SLA.
- Cercanía geográfica.
- Herramientas o inventario necesario.
- Prioridad del cliente.

Documenta por qué técnico asignarías a cada caso de prueba.

### Paso 3b — Configurar Incident Type y Schedule Board (Módulo 58)

Para cada uno de los 3 casos de datos de prueba, define su **Incident Type** con:

- Duración estimada (en minutos).
- Characteristics requeridas (skill + nivel, ej. "HVAC nivel 2").
- 2-3 tareas obligatorias (Incident Type Tasks) que el técnico no puede omitir al cerrar.

Luego describe qué verías en el **Schedule Board** al intentar asignar cada caso: qué técnicos
aparecerían resaltados como compatibles (según Characteristics + territorio + disponibilidad) y
cuáles no, y por qué.

Con los 3 casos juntos (24h, 72h y 8h de ventana SLA), decide si el volumen justificaría activar
**Resource Scheduling Optimization** o si el **Scheduling Assistant** manual es suficiente —
justifica tu decisión con el volumen de casos, no con la urgencia individual del caso crítico.

### Paso 4 — Diseñar evidencia móvil

Define la evidencia que el técnico debe capturar:

- Checklist de inspección.
- Foto antes/después.
- Lectura técnica o medición.
- Materiales usados.
- Firma o confirmación del cliente.
- Nota de cierre.

### Paso 5 — Crear casos UAT

| Caso UAT | Tipo | Datos | Resultado esperado |
|---|---|---|---|
| UAT-FS-001 | Happy path | Contoso, garantía válida, skill HVAC | Work Order creada, booking asignado, evidencia completa |
| UAT-FS-002 | Excepción | Fabrikam, sin garantía | El sistema marca servicio facturable o requiere aprobación |
| UAT-FS-003 | Crítico | Litware, prioridad crítica | Booking dentro de ventana de 8 h |
| UAT-FS-004 | Permisos | Técnico intenta modificar precio | Acción bloqueada por seguridad |
| UAT-FS-005 | Evidencia incompleta | Técnico cierra sin foto | Cierre bloqueado o marcado para revisión |

## Resultado esperado

Un diseño funcional de Field Service que conecta soporte, operación en campo, evidencia móvil y UAT sin convertir el proceso en un calendario manual.

## Validaciones

- [ ] Cada caso puede convertirse en Work Order con datos mínimos completos.
- [ ] Cada Work Order tiene criterios claros de scheduling.
- [ ] Cada Incident Type tiene duración, Characteristics y tareas obligatorias definidas.
- [ ] La evidencia móvil permite auditar el cierre.
- [ ] Los casos UAT cubren happy path, excepción, prioridad, permisos y evidencia incompleta.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Usar Case como si fuera Work Order | No distinguir solicitud de soporte y ejecución en campo | Crear Work Order solo cuando se requiere trabajo técnico |
| Asignar técnico solo por disponibilidad | Ignorar skills, ubicación o herramientas | Usar criterios de scheduling documentados |
| Cerrar visita sin evidencia | No definir checklist móvil | Exigir evidencia mínima antes del cierre |

## Reto adicional

Agrega una regla para clientes premium: si la prioridad es crítica y la garantía está activa, escalar automáticamente al dispatcher senior si no hay booking asignado en 30 minutos.

## Evidencia esperada

- Flujo Case → Work Order → Booking → Mobile execution.
- Plantilla de Work Order.
- Criterios de scheduling.
- Checklist de evidencia móvil.
- Casos UAT con resultados esperados.

## Criterios de aprobación

- [ ] El flujo distingue claramente soporte, ejecución y cierre.
- [ ] Los datos mínimos reducen ambigüedad operativa.
- [ ] UAT prueba reglas de negocio y controles de seguridad.
- [ ] La evidencia esperada sería suficiente para auditoría de servicio.

## Módulos relacionados

- Módulo 20 — Dynamics 365 CE — Sales y Customer Service
- Módulo 38 — Liderazgo Técnico y Gestión de Proyectos
- Módulo 58 — Field Service Avanzado: Scheduling, Recursos e Incident Types
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Diseño funcional de Field Service.
- Modelado de órdenes de trabajo.
- UAT aplicado a servicio en campo.
- Trazabilidad entre operación, evidencia y cierre.

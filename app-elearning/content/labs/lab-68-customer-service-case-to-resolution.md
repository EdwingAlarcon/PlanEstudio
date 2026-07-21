---
id: lab-68
title: "Dynamics 365 Customer Service — Case-to-Resolution Avanzado"
level: "N3"
duration: 120
product: ["Dynamics 365 Customer Service", "Power Automate", "Power Pages", "Dataverse"]
certifications: ["PL-400", "Especialista Dynamics 365 CE"]
role: ["Functional Consultant", "Solution Architect"]
prerequisites:
  - "Módulo 20 estudiado: Dynamics 365 CE — Sales y Customer Service"
  - "Conocimiento de colas, SLA, entitlements y Knowledge Base"
files: []
---

# Lab 68 — Dynamics 365 Customer Service: Case-to-Resolution Avanzado

## Objetivo

Al finalizar este laboratorio habrás diseñado el ciclo completo de un caso de servicio —desde su
creación hasta su resolución y cierre— incluyendo colas, asignación, SLA con pausa/reanudación,
escalamiento, Knowledge Article, dashboard operativo con métricas de servicio y un caso UAT,
en el rol de consultor funcional de Customer Service.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** SIT opera un centro de soporte con dos líneas de atención (Soporte
Técnico y Facturación) y necesita demostrar, antes de salir a producción, que el ciclo
case-to-resolution funciona de punta a punta: un caso se prioriza, se enruta a la cola correcta,
respeta un SLA medible, puede escalar cuando el agente no lo resuelve a tiempo, se resuelve
apoyándose en la base de conocimiento, y queda visible en un dashboard operativo para el
supervisor.

## Rol del estudiante

Actúas como **consultor funcional de Customer Service** responsable del diseño funcional del
ciclo de vida del caso — no escribes código; documentas configuración, decisiones y evidencia
que un equipo de implementación podría ejecutar.

## Diferencia con el Lab 82

Este laboratorio prueba el **ciclo completo de un caso individual**: creación, cola, SLA,
escalamiento, Knowledge Article, autoservicio y UAT funcional. El Lab 82 se enfoca en el **modelo
operativo reusable**: catálogo de casos, entitlements por plan, matriz SLA, routing por reglas y
pruebas positivas/negativas a nivel de soporte enterprise. Si haces ambos, evita copiar matrices:
usa este lab para evidenciar el caso end-to-end y el Lab 82 para definir la política reusable.

## Prerrequisitos

- Entender la diferencia entre `Case`, `Queue`, `Entitlement` y `SLA KPI`.
- Conocer el concepto de Knowledge Article y su ciclo de vida (Draft → In Review → Published).
- Haber revisado la configuración de Unified Routing del Módulo 20 (Actividad 20.4).

## Herramientas necesarias

- Dynamics 365 Customer Service (o diseño funcional equivalente) y Customer Service Workspace.
- Power Automate para la notificación opcional de escalamiento.
- Hoja de cálculo o Markdown para el dashboard y la matriz UAT.

## Datos de prueba

| Cliente | Case Type | Prioridad | Cola destino | Entitlement | SLA objetivo |
|---|---|---|---|---|---|
| Contoso Andina | Incidente técnico | Alta | Cola_Soporte_Técnico | Premium (50 casos/año) | 1ª respuesta 2h / resolución 24h |
| Fabrikam Norte | Consulta de facturación | Media | Cola_Facturación | Estándar | 1ª respuesta 4h / resolución 48h |
| Litware Sur | Incidente crítico | Crítica | Cola_Soporte_Técnico | Premium (50 casos/año) | 1ª respuesta 30 min / resolución 8h |

## Pasos detallados

### Paso 1 — Configuración del caso

Para cada registro de la tabla de datos de prueba, define:

- **Case Type** (Incidente técnico, Consulta de facturación, Incidente crítico) y qué campos
  obligatorios cambia cada tipo (ej. un incidente técnico exige "Producto/Activo afectado").
- **Prioridad** y cómo esta prioridad afecta el KPI de SLA aplicado (a mayor prioridad, ventana
  más corta).
- Validación del **Entitlement**: ¿el cliente tiene casos disponibles en su plan? ¿qué pasa si
  el entitlement está agotado?

### Paso 2 — Colas públicas y privadas, asignación y enrutamiento

- Documenta si `Cola_Soporte_Técnico` y `Cola_Facturación` son públicas (visibles para todo el
  equipo, cualquier agente puede tomar un caso) o privadas (solo agentes asignados explícitamente
  pueden verla), y justifica la elección para cada una.
- Describe la regla de enrutamiento de Unified Routing que llevaría cada caso a su cola según
  `Case Type` + `Prioridad`, reutilizando el workstream `WS_Email_Soporte` del Módulo 20.
- Define el criterio de asignación dentro de la cola: por skill (`SQL_Server`, `SAP`, `Hardware`),
  por carga de trabajo del agente, o mixto — y qué pasa si ningún agente tiene la skill requerida.

### Paso 3 — SLA, KPIs y pausa/reanudación

- Para cada caso, calcula el estado del SLA en dos momentos: (a) al crearse, y (b) si el caso
  pasa 6 horas en estado "Esperando respuesta del cliente".
- Explica exactamente cuándo se **pausa** el KPI de resolución (ej. al cambiar el caso a
  "Esperando respuesta del cliente") y cuándo se **reanuda** (al recibir respuesta del cliente),
  y por qué sin esto el caso Fabrikam Norte aparecería incorrectamente como violación de SLA.
- Indica qué acción dispara el sistema cuando un KPI llega a **Warning** (ej. 80% del tiempo
  consumido) vs. cuando llega a **Failure**.

### Paso 4 — Escalamiento

Diseña la regla de escalamiento: si el caso Litware Sur (crítico, SLA de 30 min a primera
respuesta) no tiene primera respuesta registrada al 80% del tiempo, ¿a quién escala (supervisor,
agente senior) y por qué medio (notificación en Workspace, Power Automate, correo)?

### Paso 5 — Knowledge Article y resolución

- Busca o crea (documentalmente) un Knowledge Article aplicable al incidente de Contoso Andina,
  siguiendo el ciclo Draft → In Review → Published del Módulo 20.
- Explica cómo el agente vincula el artículo al caso al resolverlo, y qué campo del caso queda
  como evidencia de que se usó (o no) conocimiento existente antes de escalar.

### Paso 6 — Dashboard de servicio y métricas operativas

Diseña un dashboard de supervisor con al menos estas métricas, usando los 3 casos de prueba como
insumo del ejemplo:

| Métrica | Definición | Valor con los 3 casos de prueba |
|---|---|---|
| First Response Time (FRT) | Tiempo hasta la primera respuesta del agente | Calcula el promedio esperado |
| Resolution Time | Tiempo hasta el cierre del caso | Calcula el promedio esperado |
| SLA Success Rate | % de casos resueltos dentro del SLA | Indica cuántos de los 3 cumplirían |
| Backlog | Casos abiertos sin resolver, especialmente vencidos | Señala cuál caso sería backlog crítico si no se atiende a tiempo |
| CSAT (conceptual) | Satisfacción reportada por el cliente tras el cierre | Describe cómo se recolectaría (encuesta post-cierre) |

### Paso 7 — Integraciones (Power Automate y Power Pages)

- **Power Automate (opcional):** diseña un flujo que notifique al supervisor cuando un caso
  crítico entra en estado Warning de SLA (trigger, condición, acción).
- **Power Pages (autoservicio):** describe qué podría resolver Fabrikam Norte por sí mismo en un
  portal de autoservicio (crear el caso, consultar su estado, buscar el Knowledge Article) antes
  de que el caso llegue a un agente, y qué campos del caso NO deberían ser editables desde el
  portal.
- **Field Service (awareness):** indica en qué punto el caso de Contoso Andina se convertiría en
  un Work Order si el incidente técnico requiere visita en sitio (sin diseñar el Work Order en
  detalle — solo el punto de transición Case → Work Order, referenciando el Lab 59).
- **Copilot para agentes (conceptual):** menciona un control de gobierno (de los ya definidos en
  el Módulo 20, Actividad 20.7) que aplicarías a la resolución de estos 3 casos si el agente usara
  Copilot para redactar la respuesta.

### Paso 8 — UAT del ciclo case-to-resolution

| Caso UAT | Tipo | Datos | Resultado esperado |
|---|---|---|---|
| UAT-CS-001 | Happy path | Contoso, incidente técnico, entitlement vigente | Caso enrutado a Cola_Soporte_Técnico, SLA activo, resuelto con KB vinculado dentro de 24h |
| UAT-CS-002 | Pausa de SLA | Fabrikam, caso pasa a "Esperando respuesta del cliente" | El reloj de resolución se pausa; no se marca como violación mientras espera |
| UAT-CS-003 | Escalamiento | Litware, crítico, sin primera respuesta al 80% del tiempo | El sistema escala a supervisor automáticamente |
| UAT-CS-004 | Entitlement agotado | Cliente Premium sin casos disponibles en el plan | El sistema bloquea o marca el caso como facturable, no lo procesa como incluido |
| UAT-CS-005 | Autoservicio | Fabrikam crea su propio caso desde Power Pages | El caso se crea correctamente y no puede editar campos restringidos (ej. prioridad, SLA) |

## Resultado esperado

Un diseño funcional del ciclo case-to-resolution que conecta priorización, cola, SLA medible con
pausa/reanudación, escalamiento, conocimiento, integración y evidencia de UAT — sin tratar el
soporte como un simple tablero de tickets.

## Validaciones

- [ ] Cada caso tiene Case Type, prioridad y entitlement validados antes de enrutarse.
- [ ] Las colas están clasificadas como públicas o privadas con justificación.
- [ ] El SLA de cada caso se pausa y reanuda según el estado documentado.
- [ ] Existe una regla de escalamiento activada por el KPI, no por criterio manual del agente.
- [ ] El dashboard reporta FRT, Resolution Time, SLA Success Rate, Backlog y CSAT conceptual.
- [ ] Los 5 casos UAT cubren happy path, pausa de SLA, escalamiento, entitlement agotado y
      autoservicio.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| No pausar el SLA en espera del cliente | Configurar solo el KPI sin las condiciones de pausa/reanudación | Definir explícitamente qué estado pausa y qué estado reanuda cada KPI |
| Cola pública para casos sensibles | No distinguir necesidad de confidencialidad por tipo de caso | Usar colas privadas para casos con datos sensibles o clientes VIP |
| Escalamiento manual dependiente del agente | No configurar reglas de escalamiento automáticas por KPI | Automatizar el escalamiento al alcanzar Warning/Failure |
| Dashboard sin backlog visible | Medir solo tiempos promedio, no casos vencidos acumulados | Incluir backlog y casos vencidos como métrica independiente |
| Portal de autoservicio con campos editables sensibles | No restringir permisos de columna en Power Pages | Definir explícitamente qué campos son de solo lectura desde el portal |

## Reto adicional

Diseña una regla adicional: si un caso crítico escala dos veces sin resolverse, el sistema debe
generar automáticamente un "caso de causa raíz" vinculado, para que el equipo de mejora continua
lo revise después del cierre — sin bloquear la resolución del caso original.

## Evidencia esperada

- Matriz de configuración de colas (públicas/privadas, criterio de asignación).
- Diseño de SLA con KPIs, pausa/reanudación y reglas de escalamiento.
- Knowledge Article vinculado al caso resuelto.
- Evidencia del dashboard de servicio con las 5 métricas operativas.
- Casos UAT con resultados esperados.
- Documento corto de decisiones funcionales (colas, SLA, escalamiento, autoservicio).
- Lista de riesgos y recomendaciones antes de salir a producción.

## Criterios de aprobación

- [ ] El ciclo completo case-to-resolution está documentado de principio a fin.
- [ ] El SLA incluye pausa/reanudación, no solo un temporizador simple.
- [ ] El escalamiento es automático y trazable, no discrecional.
- [ ] El dashboard permite a un supervisor identificar backlog y riesgo de incumplimiento.
- [ ] La integración con Power Pages respeta restricciones de edición para el cliente.
- [ ] UAT prueba reglas de negocio, no solo el camino feliz.

## Módulos relacionados

- Módulo 20 — Dynamics 365 CE — Sales y Customer Service
- Módulo 21 — Power Pages
- Lab 59 — Field Service: Work Order, Evidencia Móvil y UAT de Servicio en Campo
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Diseño funcional del ciclo case-to-resolution en Customer Service.
- Configuración de SLA con KPIs, pausa/reanudación y escalamiento.
- Diseño de dashboards operativos y métricas de servicio.
- Integración conceptual con Power Pages, Field Service y Copilot para agentes.
- UAT aplicado a procesos de servicio.

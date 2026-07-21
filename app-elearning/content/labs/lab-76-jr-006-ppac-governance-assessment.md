---
id: lab-76
title: "JR-006 — PPAC Governance Assessment"
level: "N4"
duration: 240
product: ["Power Platform Admin Center", "Dataverse", "Governance"]
certifications: ["Governance", "Arquitectura Power Platform"]
role: ["Power Platform Admin", "Governance Specialist", "Solution Architect"]
prerequisites:
  - "Módulo 31 estudiado: Enterprise Architecture y Gobernanza"
  - "Módulo 32 estudiado: CoE y gobierno"
  - "Ruta Job-Ready Admin/Governance revisada"
---

# Lab 76 — JR-006: PPAC Governance Assessment

## Objetivo

Realizar un assessment de gobierno Power Platform con ambientes, DLP, seguridad, capacidad,
licenciamiento, Managed Environments y soporte operativo.

## Perfil laboral y skill validado

**Vacante objetivo:** Power Platform Admin / Governance Specialist que debe auditar un tenant sin
gobierno y priorizar qué corregir primero con recursos limitados.

**Skill concreto que valida:** capacidad de traducir un inventario técnico en riesgos priorizados y
recomendaciones accionables para dirección — no solo enumerar configuraciones de PPAC.

## Escenario de negocio

**Empresa ficticia:** Global Retail Andino — 45 ambientes creados en 18 meses sin proceso de
aprobación, 3 incidentes de exportación de datos reportados por el área de seguridad en el último
trimestre.

La organización tiene múltiples apps creadas sin control central. La dirección pide un informe
práctico: qué revisar primero, qué riesgos existen y qué controles aplicar.

## Rol del estudiante

Actúas como Power Platform Admin/Governance Specialist.

## Herramientas necesarias

- Power Platform Admin Center si tienes tenant.
- Microsoft Purview / M365 audit logs como referencia conceptual.
- Markdown/Word para informe.

## Qué puedes hacer en tenant real vs. qué debes simular

- **Con tenant real (o de práctica):** genera el inventario real de ambientes desde PPAC, revisa las
  políticas de DLP existentes y su alcance real.
- **Sin tenant con administración real:** usa el inventario simulado de abajo — pero el informe debe
  dejar explícito que las cifras de capacidad/licenciamiento son ilustrativas, no auditadas.

## Datos de prueba (inventario simulado)

| Ambiente | Tipo | Dueño | Apps activas | Riesgo detectado |
|---|---|---|---|---|
| Default | Default | TI | 62 | Sin gobierno, cualquier usuario crea apps |
| DEV-CRM | Developer | Equipo CRM | 8 | Datos de prueba con emails reales de clientes |
| PROD-OPS | Production | Operaciones | 14 | DLP nunca revisada desde creación |
| Sandbox-Finanzas | Sandbox | Finanzas | 3 | Conector Dropbox personal detectado activo |

**Capacidad reportada (simulada):** Dataverse database capacity al 78% de uso; 6 usuarios con
licencia Premium asignada pero sin app premium activa en los últimos 90 días.

## Entregables

- Inventario de ambientes (usa la tabla anterior como base).
- Matriz de DLP.
- Revisión de security roles.
- Estimación de capacidad/licencias.
- Decisión sobre Managed Environments.
- Runbook de incidentes.
- Informe ejecutivo priorizado.

## Pasos detallados

### Paso 1 — Inventario

Toma la tabla de datos de prueba y clasifica cada ambiente por criticidad y riesgo, igual que se
haría con un export real de PPAC.

### Paso 2 — DLP

Clasifica conectores:

- Business: Dataverse, SharePoint corporativo, Outlook.
- Non-business: Twitter/X, Dropbox personal, conectores no aprobados.
- Blocked: conectores de alto riesgo.

Con el dato del conector Dropbox personal activo en Sandbox-Finanzas: explica qué flujo quedaría
bloqueado si aplicas la política y qué impacto tendría avisar al dueño antes de bloquear.

### Paso 3 — Capacidad y licencias

Con los datos simulados (78% de capacidad, 6 licencias Premium sin uso):

- ¿Recomiendas comprar más capacidad o primero investigar qué consume el 78%?
- ¿Qué haces con las 6 licencias Premium sin uso: reasignar, reportar a compras, o esperar?
- Riesgo de habilitar Managed Environments sin presupuesto adicional.

### Paso 4 — Operación

Diseña un runbook para estos 4 incidentes (usa el de "Sandbox-Finanzas con Dropbox personal" como
caso resuelto de ejemplo):

- Flujo fallando en producción.
- App con permisos excesivos.
- Exportación sospechosa.
- Ambiente sin dueño (como "Default").

## Decisiones que debes tomar

- **¿Bloqueas Dropbox personal en Sandbox-Finanzas de inmediato o primero conversas con el dueño?**
  Justifica con base en el riesgo real (datos financieros) vs. el impacto de interrumpir su trabajo.
- **¿"Default" se puede seguir usando o debe congelarse hasta asignar dueño?** El ambiente Default no
  se puede eliminar — documenta qué controles sí puedes aplicar ahí.
- **¿Priorizas primero DLP o primero asignar dueños de ambiente?** Ambos son urgentes con recursos
  limitados — argumenta tu orden.

## Criterios de validación

- [ ] El informe prioriza riesgos con base en el inventario de datos de prueba, no en generalidades.
- [ ] DLP está explicado para negocio, no solo en jerga técnica.
- [ ] Hay estrategia de ambientes (incluyendo qué hacer con "Default").
- [ ] Hay decision de Managed Environments justificada con los datos de capacidad dados.
- [ ] Hay runbook de incidentes con los 4 casos.

## Rúbrica

| Criterio | Peso |
|---|---|
| Diagnóstico | 30% |
| Controles | 25% |
| Recomendaciones | 25% |
| Evidencia | 20% |

## Preguntas de entrevista asociadas

- "Tienes un ambiente Default sin dueño con 62 apps activas — ¿qué haces primero?" — respuesta
  esperada: no eliminar ni bloquear de golpe; inventariar qué apps son críticas, comunicar, y migrar
  progresivamente a ambientes con dueño.
- "¿Cómo le explicarías DLP a un gerente que no es técnico?" — respuesta esperada: analogía de
  "qué puertas puede cruzar cada tipo de dato", no lista de conectores.
- "¿Cuándo NO recomendarías Managed Environments?" — respuesta esperada: cuando no hay presupuesto
  para las licencias adicionales que requiere, o cuando la organización no tiene aún un proceso de
  gobierno mínimo que lo sostenga.

## Qué no debe sobreprometerse

Este assessment usa un inventario simulado; un informe real requiere datos exportados de un tenant
en producción y validación con los dueños de cada ambiente antes de tomar decisiones ejecutables.

## Errores comunes

- Proponer CoE sin operación diaria.
- Activar controles sin evaluar impacto.
- Ignorar licenciamiento.
- No asignar dueños de ambientes.

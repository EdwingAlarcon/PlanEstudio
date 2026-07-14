---
id: lab-103
title: "JR-015 — CRM Functional Post-Go-Live Incident Simulation"
level: "N4"
duration: 120
product: ["Dynamics 365 Customer Service", "Dataverse"]
certifications: ["PL-200", "Especialista Dynamics 365 CE"]
role: ["CRM Functional", "Functional Consultant", "Customer Service Specialist"]
prerequisites:
  - "Lab 68 completado: Customer Service Case-to-Resolution"
  - "Lab 101 revisado (recomendado): CRM Functional Analyst Caso Integrado"
---

# Lab 103 — JR-015: CRM Functional Post-Go-Live Incident Simulation

## Objetivo

Diagnosticar y resolver, como analista funcional de guardia, un incidente funcional simulado
post-go-live (casos mal enrutados y un SLA que dejó de dispararse) usando evidencia de
configuración, sin depender de código ni de logs técnicos — el tipo de troubleshooting que se
espera de un consultor funcional, no de un developer.

## Nota de alcance (léela antes de empezar)

Este es un incidente funcional documentado con evidencia provista abajo, no una investigación en un
tenant en vivo. La evidencia (matriz de colas, definición de SLA, tickets escalados) es la que
tendrías disponible en un entorno real vía la interfaz de administración — no requiere acceso a
código ni a plugin trace logs.

## Escenario de negocio

**Empresa ficticia:** Instituto Técnico Andino (ITA) — mismo cliente del Lab 101, dos semanas
después del go-live de Customer Service.

Desde el lunes, soporte de nivel 2 reporta dos síntomas simultáneos:

1. Casos de tipo "Pagos" que deberían llegar a la cola **Cobranza** están apareciendo en la cola
   **Atención General**, donde el equipo no tiene el contexto para resolverlos.
2. El SLA de primera respuesta de la cola **Cobranza** no se está disparando para los pocos casos
   de pagos que sí llegan correctamente — los tiempos de resolución muestran "Sin SLA aplicado".

## Rol del estudiante

Actúas como analista funcional de guardia investigando un incidente reportado por soporte, dos
semanas después de un go-live que tú mismo (o tu equipo) diseñaste.

## Herramientas necesarias

- Evidencia de configuración provista abajo (regla de enrutamiento, definición de SLA, muestra de
  casos).
- Editor de texto para documentar el análisis.

## Entregables

- Nota de triage (severidad, alcance, impacto en el estudiante y en el equipo de cobranza).
- Análisis de causa raíz con al menos 3 hipótesis descartadas o confirmadas.
- Fix propuesto para cada uno de los 2 síntomas.
- Plan de pruebas de regresión.
- Resumen de post-mortem con acción preventiva para futuros go-lives.

## Pasos detallados

### Paso 1 — Triage

Con la evidencia disponible, documenta:

- Severidad de cada síntoma (¿bloquea el negocio o es degradado parcial?).
- Alcance (¿todos los casos de pagos o un subconjunto?).
- Impacto de negocio (¿qué pasa si un caso de mora no se atiende a tiempo?).

### Paso 2 — Evidencia de configuración

**Regla de enrutamiento de la cola "Cobranza" (configurada en el go-live):**

```text
Regla: Asignar a cola Cobranza SI
  Tipo de caso = "Pagos"
  Y Origen = "Portal de estudiantes"
```

**Muestra de 4 casos recientes de tipo "Pagos":**

| Caso | Origen | Cola asignada |
|---|---|---|
| CS-1042 | Portal de estudiantes | Cobranza (correcto) |
| CS-1043 | Teléfono (registrado por agente) | Atención General (¿correcto?) |
| CS-1044 | Correo (Outlook to Case) | Atención General (¿correcto?) |
| CS-1045 | Portal de estudiantes | Cobranza (correcto) |

**Definición del SLA "Cobranza - Primera respuesta" (configurado en el go-live):**

```text
SLA aplicable SI
  Cola = "Cobranza"
  Y Caso creado DESPUÉS de la fecha de activación del SLA
Tiempo de primera respuesta: 4 horas hábiles
```

Nota del equipo de soporte: el SLA se activó y publicó el mismo día del go-live, pero la fecha de
"activación" configurada en el registro del SLA quedó con la fecha del ambiente de pruebas (3
semanas antes del go-live real), no con la fecha de producción.

### Paso 3 — Hipótesis de causa raíz

Evalúa cada hipótesis con la evidencia disponible:

| Hipótesis | ¿Consistente con la evidencia? | Cómo confirmarla |
|---|---|---|
| La cola Cobranza no existe o está mal nombrada | No — CS-1042 y CS-1045 sí llegan correctamente a Cobranza | Revisar que la cola exista y reciba casos válidos |
| La regla de enrutamiento solo cubre un origen (Portal) y no contempla Teléfono ni Correo | Sí — CS-1043 y CS-1044 tienen origen distinto a "Portal de estudiantes" y ambos cayeron en Atención General | Revisar la condición de origen en la regla y compararla con los orígenes reales de los casos de pagos |
| El SLA nunca se activó | No — si nunca se hubiera activado, ningún caso mostraría "Sin SLA aplicado" como excepción; el problema es la fecha de activación, no la ausencia total de activación | Revisar el registro del SLA y su fecha de activación configurada |
| La fecha de activación del SLA quedó con un valor de ambiente de pruebas | Sí — coincide con el reporte del equipo de soporte y explica por qué casos creados en producción no cumplen la condición de fecha | Comparar la fecha de activación configurada contra la fecha real de go-live |

Causa raíz de síntoma 1: la regla de enrutamiento solo contempla el origen "Portal de estudiantes",
sin incluir Teléfono ni Correo, que también generan casos de tipo "Pagos".

Causa raíz de síntoma 2: la condición de fecha del SLA quedó apuntando al ambiente de pruebas y
nunca se actualizó al migrar a producción, por lo que los casos creados en producción no cumplen la
condición y el SLA no se aplica.

### Paso 4 — Fix y plan de regresión

Para cada síntoma, propón el fix funcional (cambio de configuración, no de código) y documenta:

- Cómo reproducirías cada síntoma en un ambiente de pruebas antes de aplicar el fix.
- Casos de regresión: caso de pagos por Portal, por Teléfono, por Correo; caso de otro tipo (para
  confirmar que no rompes el enrutamiento existente); caso creado después del fix para verificar
  que el SLA se dispara.
- Si el fix requiere republicar reglas de negocio, reactivar el SLA, o solo editar campos de
  configuración.

### Paso 5 — Post-mortem y acción preventiva

Redacta un resumen de post-mortem que incluya:

- Qué pasó, por qué y cómo se detectó.
- Por qué el checklist de UAT o de go-live no detectó estos dos problemas antes de producción.
- Una acción preventiva concreta para futuros go-lives (por ejemplo, checklist de "orígenes de caso
  cubiertos en cada regla de enrutamiento" y "fecha de activación del SLA verificada contra fecha de
  producción").

## Criterios de validación

- [ ] El triage identifica severidad, alcance e impacto para ambos síntomas con base en la
      evidencia, no en suposiciones.
- [ ] El análisis descarta explícitamente la hipótesis de "cola inexistente" y la de "SLA nunca
      activado" usando la evidencia provista.
- [ ] La causa raíz de cada síntoma es consistente con toda la evidencia (incluyendo la tabla de
      casos y la nota sobre la fecha de activación).
- [ ] El fix de cada síntoma es un cambio de configuración explícito, no una reescritura completa
      del diseño.
- [ ] El plan de regresión cubre los orígenes Portal, Teléfono y Correo, y un caso de otro tipo.
- [ ] El post-mortem incluye al menos una acción preventiva verificable en un checklist futuro.

## Rúbrica

| Criterio | Peso |
|---|---|
| Triage | 15% |
| Análisis de hipótesis basado en evidencia | 30% |
| Causa raíz correcta para ambos síntomas | 20% |
| Fix propuesto (configuración) | 20% |
| Plan de regresión y post-mortem | 15% |

## Errores comunes

- Diagnosticar solo uno de los dos síntomas y asumir que comparten la misma causa raíz.
- Proponer un fix de código o plugin para un problema que es puramente de configuración
  (enrutamiento y fecha de SLA).
- Ignorar el patrón en la tabla de casos (los que fallan comparten origen distinto a "Portal de
  estudiantes").
- Pasar directo al fix sin descartar las hipótesis alternativas con la evidencia disponible.
- Omitir la acción preventiva, repitiendo el mismo tipo de incidente en el próximo go-live.

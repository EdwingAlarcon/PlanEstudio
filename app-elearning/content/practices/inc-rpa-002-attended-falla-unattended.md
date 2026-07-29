---
id: INC-RPA-002
title: "Funciona attended, falla unattended"
practiceType: incident
domain: rpa-desktop-automation
roles: ["rpa-operations-specialist", "rpa-developer", "support-analyst"]
difficulty: expert
estimatedEffort: medium
prerequisites:
  modules: [67, 74]
  labs: ["LAB-110", "LAB-111"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Machine Runtime", "Power Automate Desktop", "Run history"]
skills: ["unattended-rpa", "sessions", "permissions", "machine-runtime"]
evidence:
  required: ["incident-report", "root-cause-analysis", "execution-log", "runbook"]
  optional: ["security-matrix", "screenshot"]
  format: "RCA comparando attended vs unattended con checklist de máquina/sesión."
  qualityCriteria: ["No modifica selectores primero", "Revisa sesión y usuario", "Distingue licencia/simulación"]
  sensitiveDataWarning: "No pegues credenciales ni nombres de cuentas reales."
  artifactTypes: ["simulated", "sandbox-reproducible", "requires-license"]
solutionAvailability: after-attempt
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "Compara contexto"
    content: "Attended y unattended no siempre usan misma sesión, perfil o pantalla."
  - id: hint-2
    level: tool
    title: "Mira la máquina"
    content: "Valida runtime, conexión, usuario, pantalla, permisos y aplicación instalada."
  - id: hint-3
    level: hypothesis
    title: "Perfil distinto"
    content: "La app puede existir solo en el perfil del desarrollador."
  - id: hint-4
    level: near-solution
    title: "Readiness"
    content: "Corrige configuración de máquina antes de tocar flujo."
rubric:
  - criterion: "Reproducción"
    weight: 10
  - criterion: "Evidencia"
    weight: 15
  - criterion: "Hipótesis"
    weight: 10
  - criterion: "Causa raíz"
    weight: 20
  - criterion: "Corrección"
    weight: 15
  - criterion: "Validación"
    weight: 10
  - criterion: "Prevención"
    weight: 10
  - criterion: "Comunicación"
    weight: 10
---

## Severidad e impacto

S2 por falla de lote programado. El proceso attended funciona en la máquina del maker, pero falla al lanzarlo unattended.

## Síntoma

"Funciona manualmente, pero en unattended no abre la aplicación correcta."

## Evidencia y cambios recientes

Run history cloud muestra error de ejecución remota. La aplicación legacy fue instalada solo para el usuario interactivo.

## Hipótesis

Permisos, sesión bloqueada, usuario incorrecto, resolución, credenciales, runtime no saludable o licencia/capacidad faltante.

## Pistas

Antes de modificar selectores, revisa máquina, sesión, perfil Windows y permisos de la cuenta.

## Criterios de aceptación

- Comparas attended vs unattended.
- Identificas diferencia de usuario/sesión/permisos.
- Actualizas readiness/runbook.
- No declaras validación real si no hay licencia.

## Solución de referencia

Causa raíz: aplicación no instalada ni configurada para la cuenta usada por la conexión unattended. Solución: instalar/configurar en perfil correcto, validar permisos, resolución, sesión y runtime; ejecutar prueba controlada. Prevención: checklist de readiness de máquina antes de UAT.

## Respuesta de cierre

La máquina quedó registrada con cuenta operativa validada y el runbook documenta sesión, bloqueo y escalamiento.

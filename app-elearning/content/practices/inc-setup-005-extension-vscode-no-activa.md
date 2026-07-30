---
id: INC-SETUP-005
title: "La extensión Power Platform Tools no aparece activa en VS Code"
practiceType: incident
domain: support-troubleshooting
roles: ["maker", "power-platform-developer", "support-analyst"]
difficulty: foundation
estimatedEffort: short
prerequisites:
  modules: [44]
  labs: ["LAB-045"]
environment:
  tenantRequired: none
  codeRequired: false
  tools: ["Visual Studio Code"]
skills: ["workstation-setup", "vscode-troubleshooting"]
evidence:
  required: ["incident-report", "root-cause-analysis"]
  optional: ["screenshot"]
  format: "Diagnóstico de por qué la extensión no se activó y confirmación de que el ícono de Power Platform aparece tras la corrección."
  qualityCriteria: ["Confirma que la extensión está instalada antes de reinstalarla", "Identifica si el problema es de activación, no de instalación"]
  sensitiveDataWarning: "No incluyas capturas con proyectos privados abiertos de fondo."
  artifactTypes: ["real"]
solutionAvailability: after-attempt
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "Instalada no es lo mismo que activa"
    content: "Una extensión puede aparecer en la lista de instaladas sin haberse activado todavía en la sesión actual."
  - id: hint-2
    level: tool
    title: "Revisa el panel de extensiones"
    content: "Confirma en Ctrl+Shift+X que la extensión aparece como 'Enabled', no 'Disabled' ni solo descargada."
  - id: hint-3
    level: hypothesis
    title: "Reload window no siempre alcanza"
    content: "Algunas extensiones necesitan un reinicio completo de VS Code (cerrar todas las ventanas), no solo 'Reload Window'."
  - id: hint-4
    level: near-solution
    title: "Verifica el estado real de la extensión"
    content: "Si tras reiniciar completamente VS Code el ícono sigue sin aparecer, revisa si la extensión está deshabilitada específicamente para ese workspace."
rubric:
  - criterion: "Reproducción del síntoma"
    weight: 20
  - criterion: "Verificación del estado real de la extensión"
    weight: 30
  - criterion: "Identificación de causa raíz"
    weight: 25
  - criterion: "Confirmación de la corrección"
    weight: 15
  - criterion: "Documentación"
    weight: 10
---

## Contexto

Un estudiante siguió GL-SETUP-04, instaló la extensión "Power Platform Tools" desde el Marketplace
de VS Code, y recargó la ventana con "Reload Window". El ícono de Power Platform sigue sin aparecer
en la barra lateral.

## Síntoma reportado

"Instalé la extensión de Power Platform Tools, le di 'Reload Window', pero no veo el ícono en la
barra lateral."

## Evidencia inicial simulada

```text
Panel de extensiones:
Power Platform Tools — Instalada — [Reload Required]

Barra lateral izquierda: sin ícono de Power Platform visible.
```

## Pistas relevantes

- El panel de extensiones muestra "Instalada" pero con la etiqueta "Reload Required" todavía visible.
- El estudiante usó "Reload Window" (`Ctrl+Shift+P` → Reload Window), no un reinicio completo.
- No se revisó si la extensión está deshabilitada para el workspace actual.

## Criterios de aceptación

- Confirmas que la extensión está realmente instalada antes de sospechar de una instalación fallida.
- Distingues entre "recargar ventana" y "reiniciar VS Code completamente".
- El ícono de Power Platform aparece en la barra lateral tras la corrección.
- Documentas el diagnóstico para que sirva como referencia rápida a otros estudiantes.

## Evidencias requeridas

- Reporte del incidente con el estado del panel de extensiones.
- RCA explicando por qué "Reload Window" no fue suficiente.
- Captura confirmando el ícono de Power Platform visible tras la corrección.

## Solución de referencia

Causa raíz: algunas extensiones de VS Code (incluida Power Platform Tools en ciertas versiones)
requieren un reinicio completo del proceso de VS Code para activarse por primera vez, no solo un
"Reload Window", que solo recarga la ventana actual sin reiniciar todos los procesos de extensiones
en segundo plano. Si además la extensión quedó deshabilitada específicamente para el workspace activo
(configuración por workspace, distinta de la global), tampoco se activará con ningún tipo de recarga.

Corrección: cerrar VS Code por completo (todas las ventanas) y volver a abrirlo. Si el ícono sigue
sin aparecer, revisar en el panel de extensiones si "Power Platform Tools" está deshabilitada
específicamente "for this Workspace" en vez de globalmente, y habilitarla a nivel global.

Prevención: la Guía de herramientas de estación ya documenta este paso en la sección de VS Code —
"reinicia VS Code" significa cerrar todas las ventanas, no solo recargar una.

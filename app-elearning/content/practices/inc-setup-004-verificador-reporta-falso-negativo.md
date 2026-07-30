---
id: INC-SETUP-004
title: "El verificador de estación reporta 'no instalada' una herramienta que sí está instalada"
practiceType: incident
domain: support-troubleshooting
roles: ["maker", "power-platform-developer", "support-analyst"]
difficulty: foundation
estimatedEffort: short
prerequisites:
  modules: [1]
  labs: ["LAB-002"]
environment:
  tenantRequired: none
  codeRequired: false
  tools: ["PowerShell"]
skills: ["workstation-setup", "self-diagnosis", "path-troubleshooting"]
evidence:
  required: ["incident-report", "root-cause-analysis"]
  optional: ["execution-log"]
  format: "Diagnóstico de por qué el script no detectó la herramienta y confirmación de un reporte correcto tras la corrección."
  qualityCriteria: ["No asume que el script está roto sin investigar primero", "Confirma la corrección con un segundo reporte"]
  sensitiveDataWarning: "El reporte no contiene datos sensibles; evita compartir rutas de usuario si prefieres mantener tu nombre de usuario privado."
  artifactTypes: ["real", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "El script prueba comandos, no archivos"
    content: "El verificador ejecuta el comando exacto documentado (por ejemplo git --version), no busca archivos en disco."
  - id: hint-2
    level: tool
    title: "Corre el comando manualmente"
    content: "Ejecuta tú mismo el comando de verificación (ver la tabla en la Guía de herramientas) en la misma terminal donde corriste el script."
  - id: hint-3
    level: hypothesis
    title: "Terminal distinta a la de instalación"
    content: "Si instalaste la herramienta después de abrir la terminal, o en una sesión distinta, el script no la verá hasta una terminal nueva."
  - id: hint-4
    level: near-solution
    title: "Reproduce en una terminal nueva"
    content: "Cierra todas las terminales, abre una nueva, corre el comando de verificación manualmente y luego el script otra vez."
rubric:
  - criterion: "Reproducción del síntoma"
    weight: 20
  - criterion: "Verificación manual del comando"
    weight: 25
  - criterion: "Identificación de causa raíz"
    weight: 30
  - criterion: "Confirmación con un segundo reporte correcto"
    weight: 15
  - criterion: "Documentación"
    weight: 10
---

## Contexto

Un estudiante instaló Git, corrió `tools/check-workstation.ps1` inmediatamente después y pegó el
reporte en `/preparar-entorno`. El reporte marca Git como `not_installed`, aunque el estudiante
recuerda haber visto el instalador terminar sin errores.

## Síntoma reportado

"Instalé Git, corrí el script del verificador, y me dice que no está instalada. Pero yo sí la
instalé."

## Evidencia inicial simulada

```json
{
  "id": "git",
  "command": "git --version",
  "detected": false,
  "rawVersion": "",
  "status": "not_installed"
}
```

## Pistas relevantes

- El instalador de Git terminó sin mensajes de error.
- El script se corrió en la misma ventana de PowerShell que estaba abierta antes de instalar Git.
- El estudiante no ha probado `git --version` manualmente en esa terminal.

## Criterios de aceptación

- No se asume que el script tiene un bug antes de probar el comando manualmente.
- Se identifica que el problema es de la terminal (PATH no recargado), no del script ni de la
  instalación.
- Se reproduce un reporte correcto (`"status": "installed"`) tras corregir la causa.
- Se documenta el diagnóstico para que otros estudiantes con el mismo síntoma lo resuelvan rápido.

## Evidencias requeridas

- Reporte JSON con el falso `not_installed`.
- RCA explicando por qué el script no detectó la herramienta.
- Segundo reporte JSON mostrando `"status": "installed"` tras la corrección.

## Solución de referencia

Causa raíz: el script verificador ejecuta el comando de verificación (`git --version`) en la sesión
de la terminal donde se invoca. Si esa terminal ya estaba abierta antes de que el instalador de Git
actualizara el `PATH` del sistema, la terminal conserva su copia antigua del `PATH` en memoria y no
encuentra `git`, sin importar que la instalación en disco sea correcta.

Corrección: cerrar la terminal usada para instalar y correr el verificador, abrir una terminal
completamente nueva, y volver a ejecutar `tools/check-workstation.ps1` (o `.sh`). El nuevo reporte
debe mostrar `"status": "installed"`.

Prevención: la sección de troubleshooting de la Guía de herramientas de estación
(`/recursos/guia-herramientas-workstation`) ya advierte de este patrón — es la causa más común de un
falso "no instalada" en el verificador, y no indica ningún problema con el script ni con la app.

---
id: INC-SETUP-003
title: "Commits registrados con la identidad de Git incorrecta"
practiceType: incident
domain: support-troubleshooting
roles: ["power-platform-developer", "support-analyst"]
difficulty: foundation
estimatedEffort: short
prerequisites:
  modules: [52]
  labs: ["LAB-052"]
environment:
  tenantRequired: none
  codeRequired: false
  tools: ["Git"]
skills: ["workstation-setup", "git-configuration"]
evidence:
  required: ["incident-report", "root-cause-analysis"]
  optional: ["execution-log"]
  format: "Diagnóstico de la configuración global vs. local de Git y corrección de los commits afectados en un repositorio de práctica."
  qualityCriteria: ["Distingue configuración global de configuración local", "No reescribe historial de un repositorio compartido real sin coordinación"]
  sensitiveDataWarning: "Practica la corrección de historial solo en un repositorio propio de práctica, nunca en uno compartido con otras personas sin avisar."
  artifactTypes: ["real", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "Global vs. local"
    content: "Git permite configurar identidad global (para todos tus repos) y local (solo para uno). La local siempre gana."
  - id: hint-2
    level: tool
    title: "Revisa ambas configuraciones"
    content: "`git config --global --list` y `git config --local --list` (dentro del repo) muestran cada nivel por separado."
  - id: hint-3
    level: hypothesis
    title: "Un repo clonado de otro contexto"
    content: "Si el repositorio se clonó o copió de un proyecto anterior, puede traer una configuración local de identidad distinta a la global."
  - id: hint-4
    level: near-solution
    title: "Corrige el nivel correcto"
    content: "Si el problema es local, corrígelo con `git config user.name`/`user.email` sin `--global` dentro de ese repo específico."
rubric:
  - criterion: "Reproducción y delimitación del síntoma"
    weight: 20
  - criterion: "Diagnóstico de configuración global vs. local"
    weight: 30
  - criterion: "Identificación de causa raíz"
    weight: 25
  - criterion: "Corrección segura"
    weight: 15
  - criterion: "Documentación"
    weight: 10
---

## Contexto

Un estudiante configuró su identidad de Git globalmente siguiendo la práctica GL-SETUP-01, pero al
hacer su primer commit en un repositorio de práctica, el historial muestra un nombre y correo que no
son los suyos.

## Síntoma reportado

"Configuré mi nombre y correo con `git config --global`, pero mis commits siguen apareciendo con el
nombre de otra persona."

## Evidencia inicial simulada

```text
$ git config --global user.name
Tu Nombre

$ git log -1 --format="%an <%ae>"
Otro Nombre <otro@correo.com>
```

## Pistas relevantes

- La configuración global sí tiene el nombre correcto.
- El repositorio en cuestión se clonó de un proyecto de ejemplo que ya tenía commits previos.
- El estudiante no ha revisado la configuración local del repositorio.

## Criterios de aceptación

- Delimitas que la configuración global es correcta antes de sospechar de ella.
- Identificas si existe una configuración local que sobrescribe la global.
- Corriges el nivel correcto (local, no global) sin tocar la identidad de otros repositorios.
- Confirmas con un commit de prueba que la identidad correcta queda registrada.

## Evidencias requeridas

- Reporte del incidente con la salida de `git log` mostrando la identidad incorrecta.
- RCA identificando el nivel de configuración responsable.
- Confirmación de un commit de prueba con la identidad correcta.

## Solución de referencia

Causa raíz: Git resuelve la identidad en cascada — configuración local del repositorio (archivo
`.git/config`) tiene prioridad sobre la configuración global (`~/.gitconfig`). Si el repositorio se
clonó o copió de otro proyecto que ya tenía `user.name`/`user.email` configurados localmente, esa
configuración local sobrescribe silenciosamente la identidad global correcta.

Corrección: dentro del repositorio afectado, ejecutar `git config user.name "Tu Nombre"` y
`git config user.email "tu@correo.com"` **sin** `--global`, para sobrescribir solo la configuración
local de ese repositorio. Confirmar con un commit de prueba.

Prevención: al clonar o copiar un repositorio de ejemplo, revisar `git config --local --list` antes
del primer commit real, en vez de asumir que la configuración global siempre aplica.

---
id: INC-SETUP-002
title: "node --version da resultados distintos entre terminales"
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
  tools: ["Node.js LTS"]
skills: ["workstation-setup", "path-troubleshooting"]
evidence:
  required: ["incident-report", "root-cause-analysis"]
  optional: ["screenshot"]
  format: "Diagnóstico de las instalaciones de Node en conflicto y confirmación de una sola versión activa."
  qualityCriteria: ["Identifica ambas instalaciones antes de eliminar una", "Deja una única versión LTS activa de forma consistente"]
  sensitiveDataWarning: "No incluyas rutas completas de usuario si prefieres mantener tu nombre de usuario privado."
  artifactTypes: ["real", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "No es un bug de Node"
    content: "Si dos terminales dan versiones distintas, casi nunca es un problema del propio Node.js."
  - id: hint-2
    level: tool
    title: "Localiza cada instalación"
    content: "`which node` (macOS/Linux) o `where node` (Windows) muestra la ruta exacta que cada terminal está usando."
  - id: hint-3
    level: hypothesis
    title: "nvm y el instalador oficial conviven mal"
    content: "Instalar Node con nvm y también con el instalador oficial deja dos binarios distintos, y el orden del PATH decide cuál gana en cada terminal."
  - id: hint-4
    level: near-solution
    title: "Elige una sola fuente de verdad"
    content: "Decide si usarás nvm o el instalador oficial, y desinstala o reordena el PATH para que la otra instalación no interfiera."
rubric:
  - criterion: "Reproducción del síntoma en ambas terminales"
    weight: 20
  - criterion: "Localización de cada instalación"
    weight: 30
  - criterion: "Identificación de causa raíz"
    weight: 25
  - criterion: "Corrección consistente"
    weight: 15
  - criterion: "Documentación"
    weight: 10
---

## Contexto

Un estudiante en Linux instaló Node.js primero con el gestor de paquetes del sistema y luego, tras
leer la guía de herramientas, también con `nvm`. Ahora `node --version` da una versión distinta según
qué terminal use (terminal integrada del editor vs. terminal del sistema).

## Síntoma reportado

"En la terminal de VS Code me dice v18, pero si abro una terminal normal me dice v16. No sé cuál es
la real."

## Evidencia inicial simulada

```text
# Terminal integrada de VS Code
$ node --version
v18.20.4

# Terminal del sistema
$ node --version
v16.20.2
```

## Pistas relevantes

- El usuario instaló Node con el gestor de paquetes del sistema (`apt install nodejs`) hace tiempo.
- Después instaló `nvm` y corrió `nvm install --lts`.
- No se ha desinstalado la versión anterior.

## Criterios de aceptación

- Delimitas que el problema es de `PATH`, no de una instalación corrupta.
- Identificas las dos instalaciones y cuál `PATH` tiene prioridad en cada terminal.
- La corrección deja una única versión LTS activa y consistente entre terminales.
- Documentas cuál fuente de instalación (nvm vs. gestor del sistema) queda como la oficial para este
  equipo.

## Evidencias requeridas

- Reporte del incidente con ambas versiones reportadas.
- RCA identificando las dos instalaciones y el orden del PATH.
- Confirmación de `node --version` idéntico en ambas terminales tras la corrección.

## Solución de referencia

Causa raíz: dos instalaciones de Node.js coexisten en el sistema (una del gestor de paquetes de la
distribución, desactualizada, y otra de `nvm`), y cada terminal resuelve `node` según el orden de su
propio `PATH`. La terminal integrada de VS Code puede heredar un `PATH` distinto al de una terminal
del sistema abierta directamente.

Corrección: elegir una sola fuente de instalación (se recomienda `nvm`, ya documentado en la Guía de
herramientas de estación como la opción preferida en Linux) y desinstalar o ignorar explícitamente la
otra, o al menos confirmar que el `PATH` de `nvm` tiene prioridad en todas las terminales que se usen
para este plan de estudio.

Prevención: seguir la recomendación de la guía de instalar Node solo por una vía (nvm en
Linux/macOS, instalador oficial LTS en Windows) evita este conflicto desde el inicio.

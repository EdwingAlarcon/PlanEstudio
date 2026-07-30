---
id: CH-SETUP-01
title: "Preparar tu estación completa para tu ruta profesional"
practiceType: challenge
domain: configuration-implementation
roles: ["maker", "functional-consultant", "power-platform-developer", "administrator", "solution-architect"]
difficulty: practitioner
estimatedEffort: medium
prerequisites:
  modules: [1, 52]
  labs: ["LAB-002", "LAB-052"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Git", "Visual Studio Code", "Node.js LTS", ".NET SDK", "PowerShell", "Power Platform CLI"]
skills: ["workstation-setup", "self-diagnosis", "environment-awareness"]
evidence:
  required: ["screenshot", "execution-log"]
  optional: ["runbook"]
  format: "Reporte del verificador de estación aplicado, matriz de /preparar-entorno completa para tu perfil, y una nota breve de cualquier discrepancia resuelta."
  qualityCriteria: ["Cubre todas las herramientas obligatorias de tu perfil elegido", "El entorno usado es explícitamente no productivo", "Documenta cualquier discrepancia entre lo detectado y la realidad"]
  sensitiveDataWarning: "No incluyas credenciales, tokens ni el nombre completo de un tenant real de un tercero."
  artifactTypes: ["real", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "Elige tu perfil real, no el más fácil"
    content: "El challenge se evalúa contra las herramientas obligatorias de tu perfil elegido, no contra un mínimo genérico."
  - id: hint-2
    level: tool
    title: "Usa el verificador, no marques a mano"
    content: "Correr tools/check-workstation y aplicar el reporte es más rápido y más verificable que marcar cada herramienta manualmente."
  - id: hint-3
    level: hypothesis
    title: "Una herramienta 'required_later' no bloquea el challenge"
    content: "Node.js y .NET SDK son required_later para developers: si tu ruta aún no los necesita, no los cuentes como pendientes."
  - id: hint-4
    level: near-solution
    title: "Cierre honesto"
    content: "El challenge está completo cuando todas las herramientas obligatorias de tu perfil aparecen instaladas o verificadas, y confirmaste que tu entorno de práctica no es de producción."
rubric:
  - criterion: "Cobertura de herramientas obligatorias del perfil"
    weight: 35
  - criterion: "Confirmación de entorno no productivo"
    weight: 20
  - criterion: "Uso correcto del verificador de estación"
    weight: 25
  - criterion: "Documentación honesta de discrepancias"
    weight: 20
---

## Contexto

Ya conoces las piezas sueltas: instalar Git, Node.js, VS Code, PAC CLI, confirmar tu entorno y correr
el verificador de estación. Este challenge te pide integrarlas en un solo cierre completo para el
perfil que realmente vas a usar en el resto del plan de estudio, sin una lista prescriptiva de qué
hacer primero.

## Reto

Elige tu perfil real en `/preparar-entorno` (maker, functional, developer, admin, architect o rpa) y
tu sistema operativo. Deja tu estación completamente lista para ese perfil: todas las herramientas
obligatorias instaladas o verificadas, tu entorno de práctica confirmado como no productivo, y tu rol
de seguridad identificado. Resuelve tú mismo cualquier discrepancia entre lo que el verificador
detecta y lo que sabes que tienes instalado.

## Criterios de aceptación

- Todas las herramientas marcadas como obligatorias (`required`) para tu perfil elegido aparecen
  instaladas o verificadas en `/preparar-entorno`.
- El "Setup esencial" está completo: entorno identificado, confirmado como no productivo, y rol de
  seguridad conocido.
- Usaste el script verificador de estación e importaste su reporte al menos una vez.
- Cualquier discrepancia entre el reporte y tu instalación real quedó documentada con su causa, no
  simplemente ignorada o forzada.
- No usaste un entorno de producción en ningún momento de esta preparación.

## Solución de referencia

Un cierre completo combina: el verificador de estación para las herramientas detectables por CLI
(Git, Node.js, .NET SDK, PowerShell, PAC CLI), marcado manual para las que no lo son (VS Code, Visual
Studio, Power Automate Desktop), y el "Setup esencial" de `/preparar-entorno` para tenant/entorno/rol.
No existe un único orden correcto: lo que se evalúa es que al final las tres piezas — herramientas,
entorno confirmado, y rol conocido — queden consistentes entre sí para el perfil elegido.

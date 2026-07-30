---
id: GL-SETUP-03
title: "Configurar Power Platform CLI y conectarte de forma segura"
practiceType: guided
domain: configuration-implementation
roles: ["power-platform-developer", "solution-architect"]
difficulty: practitioner
estimatedEffort: medium
prerequisites:
  modules: [52]
  labs: ["LAB-052"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Power Platform CLI", ".NET SDK"]
skills: ["workstation-setup", "pac-cli-basics", "environment-connection"]
evidence:
  required: ["screenshot", "execution-log"]
  optional: []
  format: "Captura de `pac --version` y de `pac org list` mostrando el entorno de práctica conectado."
  qualityCriteria: ["No usa un entorno de producción", "Usa deviceCode o autenticación segura, no contraseña en texto plano"]
  sensitiveDataWarning: "No incluyas la URL completa de un tenant real ni tokens en la evidencia."
  artifactTypes: ["real", "sandbox-reproducible"]
solutionAvailability: inline-collapsed
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: ".NET SDK primero"
    content: "Si instalas PAC CLI como herramienta de .NET, necesitas el .NET SDK instalado antes."
  - id: hint-2
    level: tool
    title: "pac auth create"
    content: "Usa `pac auth create --name ... --environment ... --deviceCode` para no escribir credenciales en la terminal."
  - id: hint-3
    level: hypothesis
    title: "`pac: command not found`"
    content: "Confirma que la carpeta de herramientas globales de .NET está en tu PATH y abre una terminal nueva."
  - id: hint-4
    level: near-solution
    title: "Nunca producción"
    content: "El entorno que uses en `--environment` debe ser Developer, Trial o Sandbox — nunca producción."
rubric:
  - criterion: "PAC CLI instalado y verificable"
    weight: 40
  - criterion: "Conexión segura a un entorno no productivo"
    weight: 40
  - criterion: "Evidencia sin datos sensibles"
    weight: 20
---

## Contexto

Power Platform CLI permite exportar/importar soluciones, automatizar ALM y conectarte al tenant sin
depender del navegador. Esta práctica confirma tanto la instalación como una primera conexión segura
a un entorno de práctica, siguiendo el mismo flujo del Lab 52.

## Pasos guiados

1. Confirma que tienes .NET SDK instalado (`dotnet --info`); si no, instálalo primero.
2. Instala Power Platform CLI siguiendo la
   [Guía de herramientas de estación](/recursos/guia-herramientas-workstation#power-platform-cli-pac).
3. Verifica la instalación:
   ```
   pac --version
   ```
4. Conéctate a un entorno de práctica (nunca producción) con autenticación por dispositivo:
   ```
   pac auth create --name PlanEstudio --environment "https://TU_ORG.crm.dynamics.com" --deviceCode
   ```
5. Lista los entornos disponibles para confirmar la conexión:
   ```
   pac org list
   ```
6. Vuelve a `/preparar-entorno` y marca PAC CLI como instalada o verificada.

## Criterios de aceptación

- `pac --version` responde con una versión reciente del CLI.
- `pac org list` muestra al menos el entorno de práctica al que te conectaste.
- El entorno usado es explícitamente Developer, Trial o Sandbox, nunca producción.
- La evidencia no expone tokens, contraseñas ni la URL completa de un tenant real de un tercero.

## Solución de referencia

`dotnet tool install --global Microsoft.PowerApps.CLI.Tool` (o el instalador MSI en Windows) seguido
de `pac auth create` con `--deviceCode` contra un entorno de práctica. Si `pac` no se encuentra tras
la instalación, el problema casi siempre es el `PATH` de la terminal, no la instalación en sí.

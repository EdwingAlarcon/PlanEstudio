---
id: GL-SETUP-04
title: "Configurar VS Code con la extensión Power Platform Tools"
practiceType: guided
domain: configuration-implementation
roles: ["maker", "power-platform-developer"]
difficulty: foundation
estimatedEffort: short
prerequisites:
  modules: [44]
  labs: ["LAB-045"]
environment:
  tenantRequired: none
  codeRequired: false
  tools: ["Visual Studio Code"]
skills: ["workstation-setup", "vscode-basics"]
evidence:
  required: ["screenshot"]
  optional: []
  format: "Captura de VS Code con la extensión Power Platform Tools instalada y activa."
  qualityCriteria: ["La extensión aparece habilitada, no solo descargada"]
  sensitiveDataWarning: "No compartas capturas con rutas de proyectos privados abiertas de fondo."
  artifactTypes: ["real"]
solutionAvailability: inline-collapsed
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "Marketplace, no un zip"
    content: "Instala la extensión desde el Marketplace integrado de VS Code, no descargando archivos sueltos."
  - id: hint-2
    level: tool
    title: "Busca 'Power Platform Tools'"
    content: "Es la extensión oficial de Microsoft; verifica el publisher antes de instalar."
  - id: hint-3
    level: hypothesis
    title: "No aparece el ícono de Power Platform"
    content: "Reinicia VS Code después de instalar la extensión; a veces no se activa hasta un reinicio."
  - id: hint-4
    level: near-solution
    title: "Confirma la activación"
    content: "El ícono de Power Platform debe aparecer en la barra lateral izquierda de VS Code."
rubric:
  - criterion: "VS Code instalado"
    weight: 40
  - criterion: "Extensión Power Platform Tools activa"
    weight: 60
---

## Contexto

VS Code con la extensión "Power Platform Tools" te da autenticación, exploración de soluciones y
comandos de PAC CLI integrados en el editor, sin salir a la terminal para cada operación. Es el
editor recomendado para Copilot/Claude Code en este plan de estudio (Módulo 44 y Lab 45).

## Pasos guiados

1. Instala VS Code siguiendo la
   [Guía de herramientas de estación](/recursos/guia-herramientas-workstation#visual-studio-code).
2. Abre VS Code y ve a la vista de Extensiones (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Busca "Power Platform Tools" y confirma que el publisher es Microsoft antes de instalar.
4. Instala la extensión y reinicia VS Code.
5. Confirma que el ícono de Power Platform aparece en la barra lateral izquierda.
6. Vuelve a `/preparar-entorno` y marca VS Code como instalada.

## Criterios de aceptación

- VS Code abre correctamente y `code --version` responde (si instalaste el acceso de línea de
  comandos).
- La extensión "Power Platform Tools" aparece como instalada y habilitada en el panel de extensiones.
- El ícono de Power Platform es visible en la barra lateral tras reiniciar VS Code.

## Solución de referencia

Instalación estándar de VS Code seguida de la extensión oficial "Power Platform Tools" desde el
Marketplace integrado. Si el ícono no aparece, un reinicio completo de VS Code (no solo recargar la
ventana) casi siempre resuelve el problema de activación.

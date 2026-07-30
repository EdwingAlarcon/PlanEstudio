---
id: GL-SETUP-02
title: "Instalar Node.js LTS y verificar tu entorno"
practiceType: guided
domain: configuration-implementation
roles: ["power-platform-developer"]
difficulty: foundation
estimatedEffort: short
prerequisites:
  modules: [52]
  labs: ["LAB-052"]
environment:
  tenantRequired: none
  codeRequired: false
  tools: ["Node.js LTS"]
skills: ["workstation-setup", "nodejs-basics"]
evidence:
  required: ["screenshot"]
  optional: ["execution-log"]
  format: "Captura de `node --version` mostrando una versión LTS (par)."
  qualityCriteria: ["Muestra la versión LTS instalada", "No mezcla dos instalaciones de Node en conflicto"]
  sensitiveDataWarning: "No compartas rutas de usuario completas si contienen tu nombre real y prefieres mantenerlo privado."
  artifactTypes: ["real"]
solutionAvailability: inline-collapsed
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "Elige LTS, no Current"
    content: "El sitio de Node.js ofrece dos versiones: instala siempre la LTS (par: 18, 20, 22...)."
  - id: hint-2
    level: tool
    title: "Linux: usa nvm"
    content: "El gestor de paquetes del sistema suele traer versiones desactualizadas; usa nvm install --lts."
  - id: hint-3
    level: hypothesis
    title: "Versiones inconsistentes entre terminales"
    content: "Si dos terminales dan versiones distintas de node --version, hay dos instalaciones compitiendo en el PATH."
  - id: hint-4
    level: near-solution
    title: "Confirma la versión par"
    content: "node --version debe empezar con v seguido de un número par en la posición mayor (v18, v20, v22...)."
rubric:
  - criterion: "Node.js LTS instalado y verificable"
    weight: 70
  - criterion: "Sin conflicto entre instalaciones"
    weight: 30
---

## Contexto

Node.js LTS es necesario para Power Apps Code Apps, para el tooling de este mismo repositorio, y
para varios labs del nivel IA (52 en adelante). Esta práctica confirma una instalación limpia antes
de que dependas de ella en un lab con más pasos.

## Pasos guiados

1. Revisa qué perfil te recomienda `/preparar-entorno`: Node.js solo aparece como requisito para el
   perfil developer, y como `required_later` (no lo instales antes de necesitarlo si tu ruta actual
   no es developer).
2. Instala Node.js LTS siguiendo la
   [Guía de herramientas de estación](/recursos/guia-herramientas-workstation#nodejs-lts).
3. Abre una terminal nueva y ejecuta:
   ```
   node --version
   ```
4. Confirma que el número mayor de versión es par (18, 20, 22...).
5. Si usas Linux con `nvm`, confirma también con `nvm current` que la versión activa coincide con
   la que instalaste.
6. Vuelve a `/preparar-entorno` y marca Node.js como instalada.

## Criterios de aceptación

- `node --version` responde con una versión LTS (número mayor par).
- La misma versión se obtiene en cualquier terminal nueva que abras (no hay conflicto de `PATH`).
- El estado de Node.js en `/preparar-entorno` queda marcado como instalada.

## Solución de referencia

Instalación desde el instalador oficial de nodejs.org (Windows/macOS) o `nvm install --lts`
(Linux/macOS). Si `node --version` da resultados distintos entre terminales, identifica cuál
instalación tiene prioridad en el `PATH` de cada una y desinstala o reordena la que no quieras usar.

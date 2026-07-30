---
id: GL-SETUP-01
title: "Instalar Git y configurar tu identidad"
practiceType: guided
domain: configuration-implementation
roles: ["maker", "power-platform-developer"]
difficulty: foundation
estimatedEffort: short
prerequisites:
  modules: [52]
  labs: ["LAB-052"]
environment:
  tenantRequired: none
  codeRequired: false
  tools: ["Git"]
skills: ["workstation-setup", "version-control-basics"]
evidence:
  required: ["screenshot"]
  optional: ["execution-log"]
  format: "Captura de `git --version` y de la configuración de identidad aplicada."
  qualityCriteria: ["Muestra la versión instalada", "Muestra nombre y correo configurados"]
  sensitiveDataWarning: "No compartas tokens ni contraseñas en la captura."
  artifactTypes: ["real"]
solutionAvailability: inline-collapsed
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "Reinicia la terminal tras instalar"
    content: "En Windows, el instalador actualiza el PATH pero las terminales ya abiertas no lo recargan solas."
  - id: hint-2
    level: tool
    title: "Usa la guía de instalación por SO"
    content: "Consulta la sección Git de la Guía de herramientas de estación en /recursos/guia-herramientas-workstation."
  - id: hint-3
    level: hypothesis
    title: "Si `git --version` falla"
    content: "Confirma que instalaste el paquete correcto para tu sistema operativo y que abriste una terminal nueva."
  - id: hint-4
    level: near-solution
    title: "Configuración mínima"
    content: "`git config --global user.name` y `git config --global user.email` deben quedar con tu nombre y correo reales, no valores de ejemplo."
rubric:
  - criterion: "Git instalado y verificable"
    weight: 60
  - criterion: "Identidad configurada correctamente"
    weight: 40
---

## Contexto

Git es la base de control de versiones para cualquier proyecto de código de este plan de estudio
(Code Apps, plugins, Power Pages, ALM por CLI). Esta práctica te lleva paso a paso a instalarlo y
dejarlo configurado con tu identidad, sin asumir experiencia previa con la terminal.

## Pasos guiados

1. Abre [`/preparar-entorno`](/preparar-entorno) y confirma tu sistema operativo.
2. Instala Git siguiendo la sección correspondiente de la
   [Guía de herramientas de estación](/recursos/guia-herramientas-workstation#git).
3. Abre una terminal **nueva** (cierra cualquiera que ya tuvieras abierta) y ejecuta:
   ```
   git --version
   ```
4. Configura tu identidad:
   ```
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu@correo.com"
   ```
5. Verifica la configuración:
   ```
   git config --global --list
   ```
6. Vuelve a `/preparar-entorno` y marca Git como instalada (o corre el
   [script verificador de estación](/preparar-entorno) e importa el reporte).

## Criterios de aceptación

- `git --version` responde con un número de versión reciente.
- `git config --global --list` muestra `user.name` y `user.email` con tus datos reales, no
  valores de plantilla.
- El estado de Git en `/preparar-entorno` queda marcado como instalada o verificada.

## Solución de referencia

Instalación estándar desde el instalador oficial o el gestor de paquetes de tu SO, seguida de la
configuración de identidad con `git config --global`. No requiere ningún paso adicional: si
`git --version` y `git config --global --list` responden correctamente, la práctica está completa.

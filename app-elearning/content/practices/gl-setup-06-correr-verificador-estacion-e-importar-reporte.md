---
id: GL-SETUP-06
title: "Correr el verificador de estación e importar tu reporte"
practiceType: guided
domain: configuration-implementation
roles: ["maker", "power-platform-developer", "administrator"]
difficulty: foundation
estimatedEffort: short
prerequisites:
  modules: [1]
  labs: ["LAB-002"]
environment:
  tenantRequired: none
  codeRequired: false
  tools: ["PowerShell"]
skills: ["workstation-setup", "self-diagnosis"]
evidence:
  required: ["screenshot", "execution-log"]
  optional: []
  format: "Reporte JSON generado por el script y captura de la matriz de /preparar-entorno tras aplicarlo."
  qualityCriteria: ["El reporte tiene el formato planestudio-workstation-report", "La matriz refleja el estado real de tu equipo tras aplicar el reporte"]
  sensitiveDataWarning: "El reporte no contiene datos sensibles, pero evita compartir tu nombre de usuario del sistema operativo si prefieres mantenerlo privado."
  artifactTypes: ["real"]
solutionAvailability: inline-collapsed
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "Corres tú, no PlanEstudio"
    content: "El script se ejecuta en tu equipo bajo tu control; PlanEstudio nunca accede a tu máquina."
  - id: hint-2
    level: tool
    title: "Comando según tu SO"
    content: "Windows: pwsh -File tools/check-workstation.ps1. macOS/Linux: sh tools/check-workstation.sh."
  - id: hint-3
    level: hypothesis
    title: "Una herramienta aparece 'no instalada' pero sí la tienes"
    content: "Revisa si la instalaste en una terminal distinta a la que usaste para correr el script, o si no está en el PATH."
  - id: hint-4
    level: near-solution
    title: "Analizar antes de aplicar"
    content: "En /preparar-entorno, usa 'Analizar reporte' para ver la vista previa antes de confirmar 'Aplicar al estado'."
rubric:
  - criterion: "Ejecuta el script correctamente"
    weight: 30
  - criterion: "Importa el reporte en /preparar-entorno"
    weight: 40
  - criterion: "La matriz refleja el estado real tras aplicar"
    weight: 30
---

## Contexto

En vez de marcar cada herramienta a mano, puedes correr un script local que detecta automáticamente
qué tienes instalado y pegar su reporte en `/preparar-entorno`. Esta práctica confirma que sabes
usar ese flujo completo, incluida la verificación de discrepancias.

## Pasos guiados

1. Clona o descarga el repositorio de PlanEstudio si aún no lo tienes localmente.
2. Abre una terminal en la raíz del repositorio.
3. Corre el script correspondiente a tu sistema operativo:
   - Windows: `pwsh -File tools/check-workstation.ps1`
   - macOS/Linux: `sh tools/check-workstation.sh`
4. Copia el JSON completo que imprime el script.
5. Ve a [`/preparar-entorno`](/preparar-entorno), pega el JSON en la sección "Importar reporte del
   verificador" y presiona "Analizar reporte".
6. Revisa la vista previa: herramientas detectadas, advertencias y errores.
7. Si el reporte es válido, presiona "Aplicar al estado" y confirma que la matriz refleja los
   resultados.
8. Si alguna herramienta aparece como "no instalada" y tú sabes que sí la tienes, sigue la sección
   de troubleshooting de la [Guía de herramientas de estación](/recursos/guia-herramientas-workstation).

## Criterios de aceptación

- El script corrió sin errores y produjo un JSON con `"format": "planestudio-workstation-report"`.
- El reporte se analizó y se aplicó correctamente desde `/preparar-entorno`.
- La matriz de herramientas refleja el estado real de tu equipo tras aplicar el reporte (incluida la
  versión detectada cuando corresponda).
- Cualquier discrepancia entre lo detectado y tu instalación real quedó explicada, no ignorada.

## Solución de referencia

El script (`tools/check-workstation.ps1` o `.sh`) prueba los comandos de verificación exactos
documentados en la Guía de herramientas y emite un JSON versionado. La app valida ese JSON con el
mismo rigor que cualquier importación de datos del usuario (tamaño, formato, campos peligrosos) antes
de aplicarlo al estado local. Un falso "no instalada" casi siempre es un problema de `PATH` de la
terminal, no del script.

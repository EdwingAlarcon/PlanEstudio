---
id: INC-SETUP-001
title: "'pac: command not found' tras instalar Power Platform CLI"
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
  tools: ["Power Platform CLI", ".NET SDK"]
skills: ["workstation-setup", "path-troubleshooting"]
evidence:
  required: ["incident-report", "root-cause-analysis"]
  optional: ["screenshot"]
  format: "Diagnóstico breve del PATH y confirmación de que pac --version responde tras la corrección."
  qualityCriteria: ["Identifica la causa exacta antes de reinstalar", "No recomienda reinstalar como primera acción"]
  sensitiveDataWarning: "No incluyas rutas de usuario completas si prefieres mantener tu nombre de usuario privado."
  artifactTypes: ["real", "sandbox-reproducible"]
solutionAvailability: after-attempt
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "No reinstales todavía"
    content: "Antes de reinstalar, confirma si el problema es realmente que falta el ejecutable o que la terminal no lo encuentra."
  - id: hint-2
    level: tool
    title: "Revisa cómo se instaló"
    content: "¿Se instaló con `dotnet tool install --global` o con el MSI? Cada uno modifica el PATH en un lugar distinto."
  - id: hint-3
    level: hypothesis
    title: "La terminal es anterior a la instalación"
    content: "Si abriste la terminal antes de instalar PAC CLI, no tiene el PATH actualizado en su sesión."
  - id: hint-4
    level: near-solution
    title: "Confirma la carpeta de herramientas globales"
    content: "En Windows: %USERPROFILE%\\.dotnet\\tools. En Linux/macOS: ~/.dotnet/tools. Debe estar en el PATH de la terminal donde ejecutas pac."
rubric:
  - criterion: "Reproducción y delimitación del síntoma"
    weight: 20
  - criterion: "Diagnóstico estructurado del PATH"
    weight: 30
  - criterion: "Identificación de causa raíz"
    weight: 25
  - criterion: "Corrección verificada"
    weight: 15
  - criterion: "Documentación"
    weight: 10
---

## Contexto

Un estudiante instaló Power Platform CLI con `dotnet tool install --global Microsoft.PowerApps.CLI.Tool`
siguiendo la guía de herramientas. La instalación terminó sin errores, pero al ejecutar `pac --version`
la terminal responde `pac: command not found` (o el equivalente de Windows).

## Síntoma reportado

"Instalé PAC CLI, no dio ningún error, pero cuando pongo `pac --version` me dice que el comando no
existe."

## Evidencia inicial simulada

```text
$ dotnet tool install --global Microsoft.PowerApps.CLI.Tool
Tool 'microsoft.powerapps.cli.tool' installed successfully.

$ pac --version
bash: pac: command not found
```

## Pistas relevantes

- La instalación de `dotnet tool` terminó "successfully".
- El comando falla solo en la terminal actual.
- El usuario no cerró ni volvió a abrir la terminal después de instalar.

## Criterios de aceptación

- Delimitas si el problema es la instalación en sí o la resolución del comando en el PATH.
- Identificas la causa raíz sin reinstalar el paquete.
- Confirmas la corrección abriendo una terminal nueva y ejecutando `pac --version` con éxito.
- Documentas el diagnóstico de forma que sirva para el próximo estudiante con el mismo síntoma.

## Evidencias requeridas

- Reporte del incidente con el síntoma exacto.
- RCA breve explicando por qué el comando no se encontraba.
- Confirmación de `pac --version` funcionando tras la corrección.

## Solución de referencia

Causa raíz: `dotnet tool install --global` agrega la herramienta a la carpeta de herramientas
globales de .NET (`~/.dotnet/tools` o `%USERPROFILE%\.dotnet\tools`) y actualiza la variable `PATH`
del sistema, pero las terminales que ya estaban abiertas antes de la instalación conservan su propia
copia del `PATH` en memoria y no ven el cambio hasta que se reinician.

Corrección: cerrar la terminal actual y abrir una nueva (o, en sesiones de larga duración, recargar
el perfil de shell). Si `pac --version` sigue fallando en la terminal nueva, confirmar manualmente
que la carpeta de herramientas globales de .NET está en el `PATH` del sistema, no solo del usuario
que instaló.

Prevención: la Guía de herramientas de estación (`/recursos/guia-herramientas-workstation`) ya
documenta este mismo síntoma en su sección de troubleshooting — revisarla antes de reinstalar
cualquier herramienta que "no se encuentra" tras una instalación exitosa.

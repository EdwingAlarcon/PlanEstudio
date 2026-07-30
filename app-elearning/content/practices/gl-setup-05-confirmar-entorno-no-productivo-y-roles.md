---
id: GL-SETUP-05
title: "Confirmar tu entorno no productivo y tus roles antes de tu primer cambio"
practiceType: guided
domain: configuration-implementation
roles: ["maker", "functional-consultant"]
difficulty: foundation
estimatedEffort: short
prerequisites:
  modules: [1]
  labs: ["LAB-002"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Power Apps Maker Portal", "Power Platform Admin Center"]
skills: ["workstation-setup", "environment-awareness", "least-privilege"]
evidence:
  required: ["screenshot"]
  optional: []
  format: "Captura del selector de entorno en el Maker Portal mostrando el nombre y tipo del entorno activo."
  qualityCriteria: ["El entorno mostrado no es de producción", "El nombre del entorno es identificable como Developer/Trial/Sandbox"]
  sensitiveDataWarning: "No incluyas el nombre completo de una organización real de un tercero."
  artifactTypes: ["real"]
solutionAvailability: inline-collapsed
coverageState: guided-only
hints:
  - id: hint-1
    level: light
    title: "Sin tenant propio"
    content: "Si aún no tienes acceso, sigue la alternativa conceptual de cada paso en /preparar-entorno mientras consigues un entorno Developer o Trial."
  - id: hint-2
    level: tool
    title: "Selector de entorno"
    content: "El selector de entorno está en la esquina superior derecha del Maker Portal (make.powerapps.com)."
  - id: hint-3
    level: hypothesis
    title: "¿Cómo sé si es producción?"
    content: "Power Platform Admin Center etiqueta cada entorno con su tipo: Production, Sandbox, Trial o Developer."
  - id: hint-4
    level: near-solution
    title: "Mínimo privilegio"
    content: "Identifica tu rol de seguridad (Environment Maker, Basic User, System Customizer) y confirma que no tienes más permisos de los que tu tarea actual requiere."
rubric:
  - criterion: "Identifica correctamente el tipo de entorno"
    weight: 40
  - criterion: "Confirma que no es producción"
    weight: 30
  - criterion: "Identifica su rol de seguridad"
    weight: 30
---

## Contexto

Antes de tu primer cambio real en cualquier entorno, necesitas saber en qué entorno estás, qué tipo
es, y qué permisos tienes. Esta práctica formaliza el "Setup esencial" de `/preparar-entorno` como
evidencia verificable, no solo como checklist marcado.

## Pasos guiados

1. Abre [`https://make.powerapps.com`](https://make.powerapps.com) y localiza el selector de entorno
   en la esquina superior derecha.
2. Anota el nombre del entorno activo.
3. Abre [Power Platform Admin Center](https://admin.powerplatform.microsoft.com) y busca ese mismo
   entorno en la lista.
4. Confirma su tipo: Developer, Trial, Sandbox o Production.
5. Si el tipo es Production, **detente** — no practiques ahí. Solicita un entorno Developer o Trial.
6. Revisa tu rol de seguridad asignado en ese entorno (Environment Maker, Basic User, System
   Customizer, u otro) desde la configuración de seguridad del entorno.
7. Vuelve a `/preparar-entorno` y marca los pasos correspondientes del "Setup esencial".

## Criterios de aceptación

- Identificaste el nombre y tipo exacto del entorno activo.
- Confirmaste explícitamente que el entorno no es de producción.
- Identificaste tu rol de seguridad asignado en ese entorno.
- Si solo tenías acceso a producción, documentaste que solicitaste un entorno alternativo en vez de
  practicar ahí.

## Solución de referencia

El selector de entorno del Maker Portal y la lista de entornos de Power Platform Admin Center son
la fuente de verdad para el tipo de entorno. La sección de seguridad del entorno (Configuración →
Usuarios + permisos → Roles de seguridad) muestra tu rol asignado. Ninguno de estos pasos requiere
permisos de administrador: cualquier usuario puede consultar su propio rol.

---
id: INC-001
title: "Seguridad Dataverse: oportunidades de equipo no editables"
practiceType: incident
domain: support-troubleshooting
roles: ["support-analyst", "functional-consultant", "administrator"]
difficulty: practitioner
estimatedEffort: medium
prerequisites:
  modules: [9, 16, 31]
  labs: ["LAB-009", "LAB-076"]
environment:
  tenantRequired: recommended
  codeRequired: false
  tools: ["Power Platform Admin Center", "Power Apps", "Dataverse security roles"]
skills: ["security-roles", "business-units", "owner-teams", "access-teams", "field-security", "least-privilege"]
evidence:
  required: ["incident-report", "security-matrix", "test-results", "root-cause-analysis"]
  optional: ["screenshot", "runbook"]
  format: "Documento breve con hechos, hipótesis descartadas, matriz antes/después y validación por usuario de prueba."
  qualityCriteria: ["No usa System Administrator como solución", "Distingue rol, equipo, BU y sharing", "Valida mínimo privilegio"]
  sensitiveDataWarning: "No incluyas nombres, correos ni cuentas reales; usa usuarios ficticios o iniciales."
solutionAvailability: after-attempt
coverageState: partial
hints:
  - id: hint-1
    level: light
    title: "Empieza por el alcance del registro"
    content: "Distingue si el problema ocurre por propiedad del registro, Business Unit, equipo propietario o campo protegido."
  - id: hint-2
    level: tool
    title: "Revisa roles y equipo"
    content: "Contrasta el rol directo del usuario con el rol asignado al owner team y el nivel de privilegio sobre Opportunity."
  - id: hint-3
    level: hypothesis
    title: "Hipótesis de privilegio insuficiente"
    content: "Si el equipo es propietario pero el rol del equipo solo tiene Write a nivel User, el usuario puede quedar sin escritura efectiva."
  - id: hint-4
    level: near-solution
    title: "Apunta a mínimo privilegio"
    content: "Corrige el nivel de Write en el rol adecuado y valida con usuario de prueba; no resuelvas asignando System Administrator."
rubric:
  - criterion: "Reproducción y delimitación"
    weight: 10
  - criterion: "Diagnóstico estructurado"
    weight: 15
  - criterion: "Uso de evidencia"
    weight: 15
  - criterion: "Calidad de hipótesis"
    weight: 10
  - criterion: "Identificación de causa raíz"
    weight: 15
  - criterion: "Corrección técnica"
    weight: 15
  - criterion: "Validación y regresión"
    weight: 10
  - criterion: "Documentación y comunicación"
    weight: 10
---

## Contexto

La empresa Contoso Servicios usa Dynamics 365 Sales sobre Dataverse. Los vendedores trabajan en owner teams por región. Un usuario llamado `u_ventas_norte` puede consultar cuentas, contactos y oportunidades, pero no puede modificar oportunidades asignadas al equipo `Ventas Norte`.

Este incidente usa datos y trazas simuladas. No representa un error literal de Microsoft.

## Síntoma reportado

"Puedo abrir la oportunidad y verla completa, pero al cambiar etapa o presupuesto aparece un error de permisos. Mis compañeros del equipo sí la editan."

## Impacto y severidad

- Severidad sugerida: S2.
- Rol afectado: vendedor regional.
- Impacto: oportunidades abiertas sin actualización de forecast.
- Entorno: producción, app model-driven Sales.

## Evidencia inicial simulada

| Fuente | Dato observado |
|---|---|
| Usuario | `u_ventas_norte` |
| Business Unit | `BU Norte` |
| Equipo propietario | `Ventas Norte` |
| Registro | Opportunity `OPP-2026-0148` |
| Propietario del registro | Team `Ventas Norte` |
| Error visible | "No tiene privilegios suficientes para actualizar este registro." |
| Cambio reciente | Se creó un nuevo rol `SIT Sales Read Regional` para reducir permisos amplios. |

## Pistas relevantes

- El usuario pertenece al owner team correcto.
- El rol directo del usuario tiene lectura de Opportunity a nivel Business Unit.
- El rol asignado al equipo tiene Write de Opportunity solo a nivel User.
- El campo `Estimated Revenue` tiene Field Security Profile separado.
- Otro usuario con rol legacy `Salesperson` sí puede modificar la oportunidad.

## Pistas falsas posibles

- Culpar al Business Process Flow sin revisar privilegios de tabla.
- Compartir manualmente cada oportunidad como solución permanente.
- Dar System Administrator para "desbloquear".

## Criterios de aceptación

- Reproduces el problema con usuario equivalente o matriz razonada.
- Delimitas si falla tabla, campo, equipo, BU o sharing.
- Identificas la causa raíz.
- Propones corrección de mínimo privilegio.
- Validas lectura y escritura en Opportunity sin abrir permisos globales.
- Documentas prevención para cambios futuros de roles.

## Evidencias requeridas

- Reporte de incidente.
- Matriz de seguridad antes/después.
- Resultado de prueba por rol.
- RCA con causa raíz, corrección y prevención.

## Solución de referencia

La causa raíz más probable es una combinación de rol de equipo insuficiente y Field Security Profile no alineado. El owner team `Ventas Norte` necesita privilegio `Write` de Opportunity al nivel que cubra registros propiedad del equipo o de la BU correspondiente; `User` no basta si se interpreta contra el propietario efectivo y el modelo de acceso esperado. Además, si el error ocurre solo al tocar presupuesto, revisar el Field Security Profile de `Estimated Revenue`.

Corrección mínima segura:

1. Ajustar el rol del owner team para `Opportunity: Read/Write/Append/Append To` al alcance requerido por BU o equipo.
2. Mantener permisos de Account/Contact en lectura si el rol no requiere edición.
3. Agregar al usuario o equipo al Field Security Profile únicamente si debe editar el campo protegido.
4. Probar con un usuario sin roles legacy.
5. Documentar una prueba de regresión para oportunidad propia, oportunidad del equipo y oportunidad de otra región.

Comunicación de cierre: explicar que no era un error de la app, sino una reducción de privilegios aplicada sin matriz de regresión por equipos.

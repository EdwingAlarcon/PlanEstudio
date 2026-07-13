# JR-7 Job-Ready Labs Design

## Objetivo

Implementar los laboratorios job-ready recomendados en la matriz laboral como labs reales de la app e-learning, manteniendo compatibilidad con el validador actual de labs.

## Decision de numeracion

El validador actual exige slugs e ids con formato `lab-NN` o `lab-NNN`. Por eso los labs se crearan como:

- `lab-71-jr-001-model-driven-app-job-test.md`
- `lab-72-jr-002-crm-javascript-customization.md`
- `lab-73-jr-003-dataverse-plugin-csharp.md`
- `lab-74-jr-004-crm-integration-challenge.md`
- `lab-75-jr-005-data-migration-dynamics.md`
- `lab-76-jr-006-ppac-governance-assessment.md`
- `lab-77-jr-007-customer-service-specialist-simulation.md`
- `lab-78-jr-008-crm-legacy-health-assessment.md`
- `lab-79-jr-009-technical-interview-simulation.md`
- `lab-80-jr-010-ai-assisted-crm-development.md`

El titulo de cada lab incluira el codigo JR correspondiente para mantener trazabilidad con la matriz.

## Alcance

Cada lab debe tener:

- Frontmatter valido: `id`, `title`, `level`, `duration`, `product`, `certifications`, `role`, `prerequisites`.
- Objetivo.
- Escenario de negocio.
- Rol del estudiante.
- Herramientas necesarias.
- Entregables.
- Pasos detallados.
- Criterios de validacion.
- Rubrica.
- Errores comunes.

## Criterios de aceptacion

- Existen los 10 labs `lab-71` a `lab-80`.
- `npm run validate:content` reporta 40 labs validos.
- La matriz de skills indica que JR-001 a JR-010 estan implementados como LAB-071 a LAB-080.
- Pasan `npm run lint`, `npm run typecheck`, `npm run validate:content`, `npm run build:pages` y `npm test`.

## Fuera de alcance

- Cambiar el validador para aceptar ids `jr-001`.
- Automatizar recursos externos o conectarse a tenants reales.
- Crear datasets binarios o adjuntos.
- Reescribir labs existentes.

## Riesgos

- Los labs avanzados pueden requerir ambientes Microsoft que el estudiante no tenga.
  - Mitigacion: cada lab permitira evidencia conceptual o documentada cuando el tenant no este disponible.
- Diez labs nuevos aumentan el mantenimiento.
  - Mitigacion: usar estructura uniforme y rubricas compactas.

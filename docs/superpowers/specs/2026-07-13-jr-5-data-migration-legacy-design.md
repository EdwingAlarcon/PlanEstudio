# JR-5 Data Migration + CRM Legacy Design

## Objetivo

Crear una ruta Job-Ready para preparar al estudiante para vacantes donde se piden migracion de datos hacia Dynamics 365/Dataverse, awareness de CRM on-premises y evaluacion de riesgos legacy.

La ruta debe ser practica y laboral, pero honesta: ayuda a construir criterio, artefactos de portafolio y respuestas de entrevista; no garantiza empleo ni equivale a experiencia laboral formal en un CRM on-premises real.

## Alcance

Se agregara un recurso nuevo:

- `docs/Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md`
- slug app: `job-ready-data-migration-legacy`
- ruta app: `/recursos/job-ready-data-migration-legacy`

El recurso se enlazara desde:

- `app-elearning/src/lib/content.ts`
- `app-elearning/src/lib/__tests__/content.test.ts`
- `app-elearning/src/lib/i18n.ts`
- `app-elearning/src/components/layout/sidebar.tsx`
- `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`
- `mkdocs.yml`

No se implementaran labs nuevos en este ciclo. JR-005 y JR-008 quedaran descritos como labs recomendados/roadmap.

## Audiencia

La ruta apunta a estudiantes que ya tienen base de Dataverse, modelado, integraciones, arquitectura y ALM. Las vacantes objetivo son:

- CRM Migration Specialist.
- Dynamics 365 Migration Consultant.
- Legacy Modernization Consultant.
- Solution Architect junior-mid con foco en migracion.
- Functional-Technical Consultant que participa en descubrimiento, mapeo, UAT y cutover.

## Enfoque de contenido

La ruta debe cubrir dos bloques conectados:

1. Data migration hacia Dataverse/Dynamics 365.
2. Awareness de CRM legacy/on-premises y health assessment conceptual.

Debe explicar que una migracion profesional no es solo importar archivos. Debe incluir assessment, mapping, cleansing, staging, carga, errores, reconciliacion, cutover, rollback y comunicacion a negocio.

## Mapeo a contenido actual

La ruta reutilizara:

- Modulo 34: integraciones empresariales.
- Modulo 35: rendimiento y escalabilidad.
- Modulo 37: estrategias de migracion empresarial.
- Modulo 39: casos de transformacion digital.
- Modulo 40: licenciamiento, estimacion y roadmap.
- Modulo 53/54 cuando aplique para integracion, ALM y despliegue.
- LAB-064 como practica conceptual si existe en el plan actual.
- Capstones/rutas existentes como evidencia complementaria, no como reemplazo de una migracion real.

## Skills laborales

La ruta debe mapear habilidades a evidencia concreta:

- Source system assessment -> inventario de tablas, volumen, calidad y riesgos.
- Field mapping -> workbook origen-destino con reglas de transformacion.
- Data cleansing -> reglas de deduplicacion, normalizacion y descarte.
- Staging database -> modelo conceptual de staging, success/error tables y flags de procesamiento.
- Importacion batch -> seleccion de herramienta segun volumen y complejidad.
- Upsert y claves externas -> estrategia para cargas repetibles e idempotentes.
- Bulk operations -> awareness de rendimiento, throttling y reintentos.
- Reconciliacion -> conteos, muestras, reglas de integridad y reporte post-carga.
- Cutover -> runbook con ventana, delta load, rollback y comunicacion.
- CRM on-prem awareness -> SQL Server, IIS, networking, versiones, customizaciones e integraciones.
- Health assessment -> matriz de riesgos y recomendaciones antes de migrar.

## Fuentes tecnicas actuales

La ruta debe alinearse con Microsoft Learn:

- Data migration approaches: simple, medium and complex migration approaches by volume and complexity.
- Complex data migration workflow: staging database, transformations, lookup sequencing, success/error tables, retry handling and functional segmentation.
- Dataverse bulk operation guidance: use bulk APIs and plan for service protection behavior.
- Dynamics CRM on-premises to Dynamics 365 migration guidance: treat on-prem-to-cloud as a formal migration process.
- Dataverse import/export options: dataflows, Power Query, Azure Data Factory, Logic Apps and Power Automate.
- Upsert guidance: use alternate keys/idempotent logic when source records may already exist.

## Estructura del recurso

El recurso tendra estas secciones:

1. Titulo y advertencia de alcance.
2. Vacantes objetivo.
3. Resultado esperado.
4. Enfoque moderno de migracion.
5. Skills laborales y estado actual.
6. Secuencia recomendada.
7. Mapeo a contenido actual.
8. Evidencia de portafolio.
9. Preguntas de entrevista.
10. Labs Job-Ready recomendados.
11. Brechas criticas.
12. Checklist antes de aplicar.
13. Relacion con recursos existentes.

## Criterios de aceptacion

- El recurso existe en `docs/Recursos/JOB_READY_DATA_MIGRATION_LEGACY.md`.
- La app carga el recurso por slug `job-ready-data-migration-legacy`.
- El test de contenido valida el slug, titulo y rawContent.
- El sidebar incluye "Data Migration Job-Ready".
- La matriz de skills enlaza el recurso desde la seccion "Ruta CRM Legacy & Cloud Migration".
- MkDocs lista el recurso en la seccion Recursos.
- El contenido evita promesas de empleo y evita presentar labs como experiencia laboral formal.
- Pasan `npm run lint`, `npm run typecheck`, `npm run validate:content`, `npm run build:pages` y `npm test`.
- `mkdocs build --strict` se intenta ejecutar; si `mkdocs` no esta disponible localmente, se reporta como limitacion de entorno.

## Fuera de alcance

- Crear labs JR-005 o JR-008 como laboratorios ejecutables.
- Crear datasets CSV/SQL reales de migracion.
- Automatizar migraciones contra Dataverse.
- Instalar herramientas de migracion.
- Simular infraestructura CRM on-premises real.
- Modificar los modulos existentes.

## Riesgos y mitigaciones

- Riesgo: que el contenido suene demasiado avanzado para estudiantes intermedios.
  - Mitigacion: marcarlo como intermedio-avanzado y mapear prerequisitos.
- Riesgo: que "legacy/on-premises" se interprete como experiencia operativa real.
  - Mitigacion: incluir advertencia explicita y separar awareness de practica verificable.
- Riesgo: duplicar la matriz de skills.
  - Mitigacion: el recurso profundiza la ruta; la matriz solo resume y enlaza.
- Riesgo: usar recomendaciones desactualizadas.
  - Mitigacion: basar el enfoque en Microsoft Learn consultado el 2026-07-13.

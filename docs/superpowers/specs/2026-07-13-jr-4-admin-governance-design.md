# JR-4 - Ruta Job-Ready Power Platform Admin / Governance

## Objetivo

Crear una capa de empleabilidad especifica para vacantes de **Power Platform Admin / Governance Specialist** dentro de PlanEstudio.

La iteracion JR-4 no crea el laboratorio JR-006 todavia ni agrega una ruta oficial nueva a `/rutas`. Su entrega principal es un recurso que convierte el contenido actual de administracion, gobernanza y arquitectura en una ruta laboral clara, con evidencias de portafolio, preguntas de entrevista y brechas priorizadas.

## Alcance

### Incluido

- Nuevo recurso Markdown `docs/Recursos/JOB_READY_ADMIN_GOVERNANCE.md`.
- Exposicion del recurso en la app mediante `/recursos/job-ready-admin-governance`.
- Enlace desde `docs/Recursos/MATRIZ_SKILLS_LABORALES.md` en la seccion de Ruta Job-Ready Power Platform Admin / Governance.
- Enlace en el sidebar de la app, cerca de Skills Laborales y CRM Developer Job-Ready.
- Enlace en `mkdocs.yml` bajo Recursos.
- Contenido inicial con:
  - Objetivo laboral.
  - Vacantes objetivo.
  - Skills laborales de administracion y gobierno.
  - Enfoque moderno de gobierno: PPAC nativo, Managed Environments, auditoria/Purview y CoE como practica operativa.
  - Mapeo a modulos y labs actuales.
  - Evidencia de portafolio.
  - Preguntas de entrevista.
  - Brechas criticas.
  - JR-006 como lab recomendado en roadmap.
  - Checklist antes de aplicar.

### Excluido

- No crear lab `JR-006` todavia.
- No agregar una nueva ruta a `professional-routes.ts` todavia.
- No modificar masivamente modulos 31, 32, 33, 36 o 40.
- No prometer empleo.
- No decir que completar esta ruta equivale automaticamente a experiencia laboral.

## Enfoque Moderno De Gobernanza

JR-4 debe reflejar el estado actual de Microsoft Power Platform:

- El Power Platform admin center es la superficie principal para administrar ambientes, recursos, inventario, uso, monitoreo, acciones, licencias y capacidad.
- Managed Environments agrega controles premium para gobernar ambientes a escala.
- Microsoft Purview y los logs/auditoria deben considerarse para investigaciones y trazabilidad.
- CoE debe presentarse como una capacidad operativa y organizacional: personas, procesos, comunicacion, politicas y mejora continua.
- El CoE Starter Kit puede aparecer como referencia historica o acelerador, pero no debe ser el centro de la ruta. Microsoft indica que sus capacidades principales estan integradas en PPAC y que el kit ya no recibe inversion continua de features.

## Diseño Del Recurso

El recurso debe ser una pagina practica de orientacion laboral. No debe duplicar los modulos existentes; debe decir como usarlos para prepararse para una vacante.

Estructura propuesta:

1. Proposito y advertencia de alcance.
2. Vacantes objetivo.
3. Resultado esperado al completar la ruta.
4. Enfoque moderno de gobierno.
5. Skills laborales y estado actual.
6. Secuencia recomendada de estudio.
7. Mapeo a contenido actual.
8. Evidencia de portafolio.
9. Preguntas de entrevista por bloque.
10. Lab JR-006 recomendado como roadmap.
11. Brechas criticas.
12. Checklist antes de aplicar.

## Mapeo De Contenido Actual

La ruta debe reutilizar:

- Modulo 31 - Enterprise Architecture y Gobernanza.
- Modulo 32 - CoE Starter Kit y Administracion a Escala.
- Modulo 33 - Multi-tenant, Multi-geo y Estrategia de Ambientes.
- Modulo 36 - Seguridad y Cumplimiento Enterprise.
- Modulo 40 - Preparacion PL-600.
- LAB-032 - CoE Starter Kit / Gobernanza.
- LAB-056 - Cambiar entornos Dev/Test/Prod.
- Recurso `MATRIZ_SKILLS_LABORALES.md`.
- Recurso `MATRIZ_COMPETENCIAS.md`.
- Recurso `PORTAFOLIO_PROFESIONAL.md`.

## Skills Laborales Cubiertos

La pagina debe cubrir como minimo:

- Power Platform Admin Center.
- Environment strategy.
- Environment types y lifecycle.
- DLP policies.
- Security roles y minimo privilegio.
- Managed Environments.
- Licensing.
- Capacity planning.
- Dataverse auditing.
- Microsoft Purview / activity logs awareness.
- Inventory, usage, monitor y actions en PPAC.
- CoE operativo moderno.
- Soporte operativo y runbooks.
- Reportes de riesgo y recomendaciones ejecutivas.

## Brechas Que Deben Quedar Explicitas

- No hay todavia un lab JR-006 dedicado a PPAC Governance Assessment.
- M365/Purview audit logs estan identificados, pero no se practican con una simulacion completa.
- Licensing y capacity existen como conocimiento, pero falta ejercicio operativo con recomendaciones.
- CoE Starter Kit existe en contenido actual, pero debe reorientarse hacia PPAC nativo y CoE operativo moderno.
- Falta un runbook de soporte operativo de flujos/apps en produccion.

## Lab Job-Ready Recomendado

La pagina debe listar como roadmap, no como disponible:

- JR-006 - PPAC Governance Assessment.

Debe incluir:

- Vacante que valida.
- Skills que valida.
- Evidencia esperada.
- Rubrica sugerida.
- Dificultad.
- Duracion estimada.
- Relacion con portafolio.

## Cambios Tecnicos

### `docs/Recursos/JOB_READY_ADMIN_GOVERNANCE.md`

Nuevo archivo de recurso compatible con MkDocs y el renderer Markdown de la app.

### `app-elearning/src/lib/content.ts`

Agregar entrada al mapa `RESOURCE_FILES`:

```ts
"job-ready-admin-governance": "Recursos/JOB_READY_ADMIN_GOVERNANCE.md",
```

### `app-elearning/src/lib/i18n.ts`

Agregar etiqueta de navegacion:

```ts
adminGovernanceJobReady: "Admin/Governance Job-Ready",
```

### `app-elearning/src/components/layout/sidebar.tsx`

Agregar enlace:

```tsx
{ href: "/recursos/job-ready-admin-governance", label: UI.nav.adminGovernanceJobReady, icon: FileText },
```

### `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`

Agregar enlace contextual desde la seccion "Ruta Job-Ready Power Platform Admin / Governance" hacia `JOB_READY_ADMIN_GOVERNANCE.md`.

### `mkdocs.yml`

Agregar el recurso bajo `Recursos`.

## Validacion

Despues de implementar:

- Ejecutar test focalizado de recursos si se modifica `content.test.ts`.
- Ejecutar `npm run lint`.
- Ejecutar `npm run typecheck`.
- Ejecutar `npm run validate:content`.
- Ejecutar `npm run build:pages`.
- Ejecutar `npm test` si el tiempo local lo permite.
- Intentar `mkdocs build --strict`; si `mkdocs` no esta disponible, reportarlo.

## Riesgos Y Mitigaciones

| Riesgo | Mitigacion |
|---|---|
| Enseñar CoE como instalacion del Starter Kit solamente | Presentar CoE como practica operativa moderna y PPAC como superficie principal |
| Prometer lab JR-006 como disponible | Marcar JR-006 como roadmap recomendado |
| Inflar experiencia laboral | Incluir advertencia de que la ruta no equivale automaticamente a experiencia formal |
| Desactualizar frente a Microsoft | Referenciar en el contenido el cambio hacia PPAC nativo, Managed Environments y Purview |
| Crear contenido demasiado largo | Priorizar mapeo, evidencia y entrevista sobre teoria extensa |

## Criterios De Aceptacion

- Existe `/recursos/job-ready-admin-governance` en la app.
- El recurso aparece en el sidebar de la app.
- El recurso aparece en la navegacion de MkDocs.
- La Matriz de Skills Laborales enlaza al nuevo recurso.
- La pagina reutiliza contenido existente y no crea labs nuevos.
- El recurso explica que CoE Starter Kit no debe ser el centro unico de la ruta.
- Las brechas de PPAC assessment, audit logs/Purview, licensing/capacity y runbooks quedan visibles.
- Las preguntas de entrevista cubren PPAC, ambientes, DLP, seguridad, licensing, capacity, Managed Environments, audit logs y CoE.
- Las verificaciones locales principales pasan o se reporta claramente cualquier limitacion del entorno.


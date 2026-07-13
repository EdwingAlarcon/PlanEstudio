# JR-3 - Ruta Job-Ready Dynamics 365 CRM Developer

## Objetivo

Crear una capa de empleabilidad especifica para vacantes de **Dynamics 365 CRM Developer** dentro de PlanEstudio.

La iteracion JR-3 no crea laboratorios nuevos ni reemplaza la Ruta Developer existente. Su entrega principal es un recurso que convierte el contenido tecnico actual en una ruta laboral clara para roles CRM Developer, con evidencias de portafolio, preguntas de entrevista y brechas priorizadas.

## Alcance

### Incluido

- Nuevo recurso Markdown `docs/Recursos/JOB_READY_CRM_DEVELOPER.md`.
- Exposicion del recurso en la app mediante `/recursos/job-ready-crm-developer`.
- Enlace desde `docs/Recursos/MATRIZ_SKILLS_LABORALES.md` en la seccion de Ruta Job-Ready Dynamics 365 CRM Developer.
- Enlace en el sidebar de la app, cerca de Skills Laborales y Portafolio.
- Enlace en `mkdocs.yml` bajo Recursos.
- Contenido inicial con:
  - Objetivo laboral.
  - Perfil de vacante objetivo.
  - Skills laborales de CRM Developer.
  - Mapeo a modulos y labs actuales.
  - Evidencia de portafolio.
  - Preguntas de entrevista.
  - Brechas criticas.
  - Labs recomendados como roadmap.
  - Checklist de preparacion antes de aplicar.

### Excluido

- No crear labs `JR-002`, `JR-003`, `JR-004` ni `JR-010` todavia.
- No agregar una nueva ruta a `professional-routes.ts` todavia.
- No modificar masivamente modulos 13, 23, 24, 26, 50, 53 o 54.
- No decir que completar esta ruta equivale automaticamente a experiencia laboral.
- No prometer empleo.

## Diferencia con la Ruta Developer existente

La Ruta Developer actual en `professional-routes.ts` es una ruta general de Power Platform Developer:

- Plugins C#.
- PCF.
- Dataverse Web API.
- Custom Connectors.
- ALM.
- CI/CD.

JR-3 debe funcionar como una **capa laboral especializada** sobre esa ruta, enfocada en vacantes Dynamics 365 CRM Developer:

- JavaScript CRM y Web Resources.
- `formContext`, eventos OnLoad/OnChange/OnSave y `Xrm.WebApi`.
- Plugins C# con stages, images, depth, tracing y testing.
- Custom APIs y custom workflow activities como brecha/roadmap.
- Integraciones con Azure Functions, Logic Apps, Service Bus y APIs externas.
- Debugging, tracing, clean code, testing automatizado y ALM tecnico.
- Preguntas de entrevista y evidencia de portafolio.

## Diseño Del Recurso

El recurso debe ser una pagina practica de orientacion laboral. No debe duplicar los modulos existentes; debe decir como usarlos para prepararse para una vacante.

Estructura propuesta:

1. Proposito y advertencia de alcance.
2. Vacantes objetivo.
3. Resultado esperado al completar la ruta.
4. Skills laborales y estado actual.
5. Secuencia recomendada de estudio.
6. Mapeo a contenido actual.
7. Evidencia de portafolio.
8. Preguntas de entrevista por bloque.
9. Labs Job-Ready recomendados.
10. Brechas criticas y roadmap.
11. Checklist antes de aplicar.

## Mapeo De Contenido Actual

La ruta debe reutilizar:

- Modulo 13 - JavaScript y PCF Basico.
- Modulo 19 - ALM y CI/CD con Azure DevOps.
- Modulo 23 - C# Plugins para Dataverse.
- Modulo 24 - Integraciones con Azure Services.
- Modulo 26 - Performance y Optimizacion.
- Modulo 50 - Tests, CI/CD y Guardrails.
- Modulo 53 - Dataverse Web API y Autenticacion.
- Modulo 54 - ALM de Soluciones Power Platform con Apoyo de IA.
- LAB-019 - Pipeline Azure DevOps.
- LAB-023 - Plugin C#.
- LAB-054 - Conexion externa a Dataverse Web API.
- LAB-063 - Capstone Developer.

## Skills Laborales Cubiertos

La pagina debe cubrir como minimo:

- C# para Dynamics 365 CRM.
- Plugins Dataverse.
- Plugin pipeline: PreValidation, PreOperation, PostOperation.
- Pre/Post Images.
- Depth y recursion.
- ITracingService y Plugin Trace Log.
- Unit testing de plugins.
- JavaScript CRM.
- Web Resources.
- `executionContext` y `formContext`.
- OnLoad, OnChange, OnSave.
- `Xrm.WebApi`.
- Dataverse Web API.
- Azure Functions.
- Azure Logic Apps.
- Service Bus.
- ALM tecnico.
- Clean code.
- Debugging y troubleshooting.
- IA aplicada al desarrollo con revision humana.

## Brechas Que Deben Quedar Explicitas

- No hay todavia un lab dedicado de JavaScript CRM estilo prueba tecnica.
- Custom APIs no estan cubiertas con practica suficiente.
- Custom workflow activities no estan cubiertas.
- Logic Apps y Service Bus estan en awareness/integracion conceptual, no en challenge practico.
- Debugging/tracing necesita una simulacion mas fuerte orientada a entrevista.

## Labs Job-Ready Recomendados

La pagina debe listar como roadmap, no como disponible:

- JR-002 - CRM JavaScript Customization.
- JR-003 - Dataverse Plugin C# Job Test.
- JR-004 - CRM Integration Challenge.
- JR-010 - AI-Assisted CRM Development.

Cada lab recomendado debe incluir:

- Vacante que valida.
- Skills que valida.
- Evidencia esperada.
- Dificultad.
- Duracion estimada.
- Relacion con portafolio.

## Cambios Tecnicos

### `docs/Recursos/JOB_READY_CRM_DEVELOPER.md`

Nuevo archivo de recurso compatible con MkDocs y el renderer Markdown de la app.

### `app-elearning/src/lib/content.ts`

Agregar entrada al mapa `RESOURCE_FILES`:

```ts
"job-ready-crm-developer": "Recursos/JOB_READY_CRM_DEVELOPER.md",
```

### `app-elearning/src/lib/i18n.ts`

Agregar etiqueta de navegacion:

```ts
crmDeveloperJobReady: "CRM Developer Job-Ready",
```

### `app-elearning/src/components/layout/sidebar.tsx`

Agregar enlace:

```tsx
{ href: "/recursos/job-ready-crm-developer", label: UI.nav.crmDeveloperJobReady, icon: FileText },
```

### `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`

Agregar enlace contextual desde la seccion "Ruta Job-Ready Dynamics 365 CRM Developer" hacia `JOB_READY_CRM_DEVELOPER.md`.

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
| Duplicar la Ruta Developer existente | Presentar JR-3 como capa laboral especializada, no como ruta oficial nueva |
| Prometer labs que no existen | Marcar JR-002/JR-003/JR-004/JR-010 como roadmap recomendado |
| Inflar experiencia laboral | Incluir advertencia de que la ruta no equivale automaticamente a experiencia formal |
| Crear contenido demasiado largo | Priorizar mapeo, evidencia y entrevista sobre teoria extensa |
| Desalinear app y MkDocs | Registrar el recurso en `content.ts`, sidebar y `mkdocs.yml` |

## Criterios De Aceptacion

- Existe `/recursos/job-ready-crm-developer` en la app.
- El recurso aparece en el sidebar de la app.
- El recurso aparece en la navegacion de MkDocs.
- La Matriz de Skills Laborales enlaza al nuevo recurso.
- La pagina reutiliza contenido existente y no crea labs nuevos.
- Las brechas de JavaScript CRM, Custom APIs, custom workflow activities, Logic Apps/Service Bus practico y tracing quedan visibles.
- Las preguntas de entrevista cubren JavaScript CRM, plugins, Web API, integraciones, testing, ALM e IA.
- Las verificaciones locales principales pasan o se reporta claramente cualquier limitacion del entorno.


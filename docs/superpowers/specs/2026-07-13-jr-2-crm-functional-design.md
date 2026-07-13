# JR-2 - Ruta Job-Ready Dynamics 365 CRM Functional Specialist

## Objetivo

Crear una capa de empleabilidad especifica para vacantes de **Dynamics 365 CRM Functional Specialist / Dynamics 365 CE Functional Consultant** dentro de PlanEstudio.

La iteracion JR-2 no crea el laboratorio JR-007 todavia ni agrega una ruta oficial nueva a `/rutas`. Su entrega principal es un recurso que convierte el contenido funcional actual de Dynamics 365 Customer Engagement en una ruta laboral clara, con evidencias de portafolio, preguntas de entrevista y brechas priorizadas.

## Alcance

### Incluido

- Nuevo recurso Markdown `docs/Recursos/JOB_READY_CRM_FUNCTIONAL.md`.
- Exposicion del recurso en la app mediante `/recursos/job-ready-crm-functional`.
- Enlace desde `docs/Recursos/MATRIZ_SKILLS_LABORALES.md` en la seccion de Ruta Job-Ready Dynamics 365 CRM Functional Specialist.
- Enlace en el sidebar de la app, cerca de los recursos Job-Ready existentes.
- Enlace en `mkdocs.yml` bajo Recursos.
- Contenido inicial con:
  - Objetivo laboral.
  - Vacantes objetivo.
  - Skills laborales funcionales CRM.
  - Enfoque moderno de Customer Service y Sales.
  - Mapeo a modulos y labs actuales.
  - Evidencia de portafolio.
  - Preguntas de entrevista.
  - Brechas criticas.
  - JR-007 como lab recomendado en roadmap.
  - Checklist antes de aplicar.

### Excluido

- No crear lab `JR-007` todavia.
- No agregar una nueva ruta a `professional-routes.ts` todavia.
- No modificar masivamente modulos 4, 9, 20, 38, 55, 56, 57 o 58.
- No prometer empleo.
- No decir que completar esta ruta equivale automaticamente a experiencia laboral.

## Enfoque Moderno Funcional CRM

JR-2 debe reflejar Dynamics 365 Customer Engagement actual:

- Customer Service debe enfocarse en Customer Service Hub / Copilot Service admin center para configurar casos, colas, knowledge, canales, unified routing y perfiles de agente.
- SLAs deben tratarse como experiencia moderna/enhanced SLA, no como SLAs legacy del web client.
- Queues deben explicarse como contenedores de trabajo y mecanismo de priorizacion, no como seguridad por si mismas.
- Entitlements deben cubrir terminos de soporte por horas/casos/productos/cliente.
- Sales debe cubrir lead, opportunity, quote, order e invoice como proceso lead-to-cash.
- Reporting debe cubrir dashboards operativos, KPIs y UAT, no solo Power BI aislado.

## Diseño Del Recurso

El recurso debe ser una pagina practica de orientacion laboral. No debe duplicar los modulos existentes; debe decir como usarlos para prepararse para una vacante funcional.

Estructura propuesta:

1. Proposito y advertencia de alcance.
2. Vacantes objetivo.
3. Resultado esperado al completar la ruta.
4. Enfoque funcional moderno.
5. Skills laborales y estado actual.
6. Secuencia recomendada de estudio.
7. Mapeo a contenido actual.
8. Evidencia de portafolio.
9. Preguntas de entrevista por bloque.
10. Lab JR-007 recomendado como roadmap.
11. Brechas criticas.
12. Checklist antes de aplicar.

## Mapeo De Contenido Actual

La ruta debe reutilizar:

- Modulo 4 - Power Apps Model-Driven Apps basadas en datos.
- Modulo 9 - Dataverse Avanzado.
- Modulo 20 - Dynamics 365 CE Sales y Customer Service.
- Modulo 38 - Liderazgo Tecnico y Gestion de Proyectos.
- Modulo 55 - IA para Analisis de Soluciones, Arquitectura y Consultoria Funcional D365.
- Modulo 56 - Introduccion Dynamics 365 Avanzado.
- Modulo 57 - Customer Insights Data.
- Modulo 58 - Field Service.
- LAB-057 - Diseno solucion D365 Sales con IA.
- LAB-058 - Customer Insights segmento/journey.
- LAB-059 - Field Service work order UAT.
- LAB-066 - Sales lead-to-cash.
- LAB-067 - Customer 360 Insights Data.
- LAB-068 - Customer Service case-to-resolution.

## Skills Laborales Cubiertos

La pagina debe cubrir como minimo:

- Administracion CRM.
- Configuracion funcional.
- Tablas, formularios y vistas.
- Business Process Flows.
- Business rules.
- Customer Service cases.
- Queues.
- SLAs.
- Entitlements.
- Knowledge base.
- Dynamics 365 Sales lead-to-cash.
- Customer Insights / Customer 360 awareness.
- Field Service awareness.
- Reporting y dashboards.
- Fit-gap.
- UAT.
- Soporte funcional y post-go-live.
- Documentacion funcional y training a usuarios.

## Brechas Que Deben Quedar Explicitas

- No hay todavia un lab JR-007 dedicado a Customer Service Specialist Job Simulation.
- Entitlements y Knowledge Base estan parcialmente cubiertos, pero necesitan practica obligatoria.
- Reporting operativo requiere un escenario funcional mas fuerte.
- Soporte funcional post-go-live y troubleshooting de configuracion necesitan simulacion.
- Omnichannel/Contact Center avanzado sigue en roadmap, no debe venderse como cubierto.

## Lab Job-Ready Recomendado

La pagina debe listar como roadmap, no como disponible:

- JR-007 - Customer Service Specialist Job Simulation.

Debe incluir:

- Vacante que valida.
- Skills que valida.
- Evidencia esperada.
- Rubrica sugerida.
- Dificultad.
- Duracion estimada.
- Relacion con portafolio.

## Cambios Tecnicos

### `docs/Recursos/JOB_READY_CRM_FUNCTIONAL.md`

Nuevo archivo de recurso compatible con MkDocs y el renderer Markdown de la app.

### `app-elearning/src/lib/content.ts`

Agregar entrada al mapa `RESOURCE_FILES`:

```ts
"job-ready-crm-functional": "Recursos/JOB_READY_CRM_FUNCTIONAL.md",
```

### `app-elearning/src/lib/i18n.ts`

Agregar etiqueta de navegacion:

```ts
crmFunctionalJobReady: "CRM Functional Job-Ready",
```

### `app-elearning/src/components/layout/sidebar.tsx`

Agregar enlace:

```tsx
{ href: "/recursos/job-ready-crm-functional", label: UI.nav.crmFunctionalJobReady, icon: FileText },
```

### `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`

Agregar enlace contextual desde la seccion "Ruta Job-Ready Dynamics 365 CRM Functional Specialist" hacia `JOB_READY_CRM_FUNCTIONAL.md`.

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
| Duplicar la ruta Dynamics 365 Customer Engagement existente | Presentar JR-2 como capa laboral funcional, no como ruta oficial nueva |
| Prometer lab JR-007 como disponible | Marcar JR-007 como roadmap recomendado |
| Inflar experiencia laboral | Incluir advertencia de que la ruta no equivale automaticamente a experiencia formal |
| Arrastrar practicas legacy | Enfatizar Customer Service Hub, Copilot Service admin center, enhanced SLAs y Sales moderno |
| Crear contenido demasiado largo | Priorizar mapeo, evidencia y entrevista sobre teoria extensa |

## Criterios De Aceptacion

- Existe `/recursos/job-ready-crm-functional` en la app.
- El recurso aparece en el sidebar de la app.
- El recurso aparece en la navegacion de MkDocs.
- La Matriz de Skills Laborales enlaza al nuevo recurso.
- La pagina reutiliza contenido existente y no crea labs nuevos.
- El recurso explica el enfoque funcional moderno de Customer Service y Sales.
- Las brechas de JR-007, entitlements, knowledge base, reporting, soporte funcional y Omnichannel/Contact Center avanzado quedan visibles.
- Las preguntas de entrevista cubren casos, colas, SLA, entitlements, knowledge base, Sales lead-to-cash, reporting, UAT y soporte funcional.
- Las verificaciones locales principales pasan o se reporta claramente cualquier limitacion del entorno.


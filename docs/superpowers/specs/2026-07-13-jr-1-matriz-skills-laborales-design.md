# JR-1 - Matriz de Skills Laborales

## Objetivo

Crear una capa inicial de empleabilidad para PlanEstudio que conecte habilidades reales pedidas en vacantes de Power Platform, Dynamics 365 CRM y Microsoft Business Applications con el contenido existente de la plataforma.

La iteracion JR-1 no crea laboratorios nuevos ni rutas completas. Su entrega principal es una matriz curricular-laboral que permita responder:

- Que skill pide el mercado.
- Que perfil laboral la necesita.
- Donde se aprende hoy en PlanEstudio.
- Donde se practica hoy.
- Que evidencia puede usar el estudiante en portafolio.
- Que pregunta de entrevista podria recibir.
- Que brecha o mejora deberia priorizarse.

## Alcance

### Incluido

- Nuevo recurso Markdown `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`.
- Exposicion del recurso en la app mediante `/recursos/matriz-skills-laborales`.
- Enlace en el sidebar de la app junto a matriz de competencias, portafolio y roadmap.
- Enlace en `mkdocs.yml` bajo Recursos.
- Contenido diagnostico con:
  - Diagnostico de empleabilidad actual.
  - Categorias de skills laborales.
  - Matriz propuesta por skill.
  - Rutas Job-Ready propuestas.
  - Laboratorios Job-Ready recomendados.
  - Brechas criticas.
  - Plan de implementacion por sprints.

### Excluido

- No crear labs `JR-*` todavia.
- No crear nuevas rutas en `professional-routes.ts` todavia.
- No modificar contenido masivo de modulos existentes.
- No prometer empleo garantizado ni equivalencia automatica con experiencia laboral.
- No convertir PlanEstudio en un listado de vacantes.

## Diseño De Contenido

El recurso debe quedar como una pagina de orientacion laboral, no como una rubrica duplicada.

La diferencia con recursos existentes sera:

- `MATRIZ_COMPETENCIAS.md`: que debe poder demostrar el estudiante por ruta.
- `PORTAFOLIO_PROFESIONAL.md`: como empaquetar evidencia.
- `ROADMAP_ESPECIALIZACION_AVANZADA.md`: que falta para especializaciones profundas.
- `MATRIZ_SKILLS_LABORALES.md`: que skills piden las vacantes, como se mapean al contenido actual, y que brechas laborales existen.

## Estructura Del Recurso

1. Proposito y reglas de uso.
2. Diagnostico de empleabilidad actual.
3. Escala de estado:
   - Cubierto.
   - Parcial.
   - Awareness.
   - No cubierto.
   - En roadmap.
4. Categorias de skills laborales:
   - Power Platform Development.
   - Power Platform Administration & Governance.
   - Dynamics 365 CRM Functional.
   - Dynamics 365 CRM Developer.
   - Data Migration & Legacy CRM.
   - Business / Consulting / Soft Skills.
5. Matriz de Skills Laborales con columnas:
   - Skill laboral.
   - Perfil laboral asociado.
   - Nivel esperado.
   - Estado actual en PlanEstudio.
   - Modulo donde se aprende.
   - Lab donde se practica.
   - Evidencia para portafolio.
   - Pregunta tipica de entrevista.
   - Recomendacion de mejora.
   - Prioridad.
6. Rutas Job-Ready propuestas:
   - Power Platform Developer.
   - Power Platform Admin / Governance.
   - Dynamics 365 CRM Functional Specialist.
   - Dynamics 365 CRM Developer.
   - CRM Legacy & Cloud Migration.
   - Technical English & Interview Readiness.
7. Laboratorios Job-Ready recomendados:
   - JR-001 a JR-010, solo como propuesta.
8. Brechas criticas.
9. Plan de implementacion por sprints.

## Mapeo Inicial Esperado

El contenido debe aprovechar el inventario existente:

- Model-driven apps: Modulo 4, LAB-004.
- Dataverse: Modulos 2 y 9, LAB-002 y LAB-009.
- Power Automate: Modulos 5 y 11, LAB-005.
- ALM: Modulos 19 y 54, LAB-019 y LAB-053.
- Power Pages: Modulos 21 y 29.
- Plugins C#: Modulo 23, LAB-023.
- Integraciones: Modulos 14, 24, 34, 53, LAB-054 y LAB-070.
- Gobernanza: Modulos 31, 32, 33, 36, LAB-032 y LAB-056.
- Dynamics 365 CE: Modulos 20, 56, 57, 58, LAB-057, LAB-058, LAB-059, LAB-066, LAB-067 y LAB-068.
- Portafolio: recurso `PORTAFOLIO_PROFESIONAL.md` y capstones LAB-060 a LAB-065.

Las brechas principales deben quedar explicitas:

- Power Automate Desktop practico.
- PPAC operativo con audit logs, capacity y licensing.
- JavaScript CRM profundo.
- Data migration hands-on.
- CRM on-premises / legacy health assessment.
- Interview readiness e ingles tecnico.

## Cambios Tecnicos

### `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`

Nuevo archivo de recurso. Debe usar Markdown compatible con MkDocs y el renderer de la app.

### `app-elearning/src/lib/content.ts`

Agregar entrada al mapa `RESOURCE_FILES`:

```ts
"matriz-skills-laborales": "Recursos/MATRIZ_SKILLS_LABORALES.md",
```

### `app-elearning/src/lib/i18n.ts`

Agregar etiqueta de navegacion para el nuevo recurso.

### `app-elearning/src/components/layout/sidebar.tsx`

Agregar enlace en la seccion de recursos, preferiblemente cerca de `Matriz de Competencias` y `Portafolio Profesional`.

### `mkdocs.yml`

Agregar el recurso bajo `Recursos`.

## Validacion

Despues de implementar:

- Ejecutar `npm run lint`.
- Ejecutar `npm run typecheck`.
- Ejecutar `npm run validate:content` si esta disponible en `package.json`.
- Ejecutar `npm run build:pages` si el tiempo local lo permite.

Si alguna verificacion falla por una razon no relacionada con JR-1, documentarla sin revertir cambios ajenos.

## Riesgos Y Mitigaciones

| Riesgo | Mitigacion |
|---|---|
| Duplicar la matriz de competencias existente | Enfocar el nuevo recurso en demanda laboral y entrevistas, no en rubricas de aprobacion |
| Inflar la promesa de empleabilidad | Incluir reglas explicitas: no garantiza empleo y no equivale automaticamente a experiencia laboral |
| Crear rutas sin evidencia | Mantener rutas Job-Ready como propuestas hasta que existan labs y capstones |
| Hacer el recurso demasiado largo | Priorizar skills de alta demanda y dejar roadmap de sprints para expansion |
| Desalinear MkDocs y app | Registrar el recurso tanto en `content.ts` como en `mkdocs.yml` |

## Criterios De Aceptacion

- Existe `/recursos/matriz-skills-laborales` en la app.
- El recurso aparece en el sidebar de la app.
- El recurso aparece en la navegacion de MkDocs.
- La matriz cubre al menos 30 skills laborales en las seis categorias principales.
- Cada skill tiene estado, modulo/lab existente o brecha, evidencia, pregunta de entrevista y prioridad.
- Las rutas y labs Job-Ready aparecen como propuestas, no como contenido disponible.
- Las brechas criticas quedan visibles sin ocultarse detras de contenido conceptual.
- Las verificaciones locales principales se ejecutan o se reporta claramente por que no pudieron ejecutarse.


# JR-6 Interview Readiness + Portafolio Laboral Design

## Objetivo

Crear una ruta Job-Ready transversal para ayudar al estudiante a convertir la evidencia tecnica de PlanEstudio en materiales y respuestas utiles para aplicar a vacantes: CV tecnico, LinkedIn, demo de 10 minutos, respuestas STAR, ingles tecnico y comunicacion remota.

La ruta debe ser practica, honesta y accionable. Debe evitar prometer empleo y debe explicar como presentar labs/capstones como proyectos academicos o simulados, no como experiencia laboral formal.

## Alcance

Se agregara un recurso nuevo:

- `docs/Recursos/JOB_READY_INTERVIEW_READINESS.md`
- slug app: `job-ready-interview-readiness`
- ruta app: `/recursos/job-ready-interview-readiness`

El recurso se enlazara desde:

- `app-elearning/src/lib/content.ts`
- `app-elearning/src/lib/__tests__/content.test.ts`
- `app-elearning/src/lib/i18n.ts`
- `app-elearning/src/components/layout/sidebar.tsx`
- `docs/Recursos/MATRIZ_SKILLS_LABORALES.md`
- `mkdocs.yml`

No se generara un CV personalizado del usuario ni se editaran perfiles reales externos.

## Audiencia

La ruta aplica a todos los perfiles:

- Power Platform Maker.
- Functional Consultant.
- Power Platform Developer.
- Dynamics 365 CRM Functional.
- CRM Developer.
- Admin/Governance Specialist.
- Migration/Legacy Consultant.
- Solution Architect en formacion.

## Enfoque de contenido

La ruta debe cubrir:

- Como traducir labs y capstones en evidencia laboral presentable.
- Como escribir bullets de CV sin exagerar experiencia.
- Como preparar un headline y resumen LinkedIn orientados a Power Platform/D365.
- Como construir un README de proyecto de portafolio.
- Como preparar una demo de 10 minutos.
- Como responder entrevistas tecnicas y conductuales con formato STAR.
- Como preparar respuestas tecnicas en ingles.
- Como comunicar bloqueos, riesgos y avances en trabajo remoto.

## Mapeo a contenido actual

La ruta reutilizara:

- `PORTAFOLIO_PROFESIONAL.md`.
- `MATRIZ_COMPETENCIAS.md`.
- `MATRIZ_SKILLS_LABORALES.md`.
- `RUBRICAS_PLANTILLAS_EVALUACION.md`.
- Modulos 38 y 55.
- Capstones LAB-060 a LAB-065.
- Rutas Job-Ready ya creadas para adaptar respuestas por perfil.

## Estructura del recurso

El recurso tendra estas secciones:

1. Titulo y advertencia de alcance.
2. Vacantes objetivo.
3. Resultado esperado.
4. Principio central: evidencia sin exagerar.
5. Artefactos laborales.
6. CV tecnico.
7. LinkedIn tecnico.
8. Demo de 10 minutos.
9. Respuestas STAR.
10. Ingles tecnico.
11. Comunicacion remota.
12. Banco de preguntas por perfil.
13. Lab Job-Ready recomendado.
14. Checklist antes de aplicar.
15. Relacion con recursos existentes.

## Criterios de aceptacion

- El recurso existe en `docs/Recursos/JOB_READY_INTERVIEW_READINESS.md`.
- La app carga el recurso por slug `job-ready-interview-readiness`.
- El test de contenido valida slug, titulo y rawContent.
- El sidebar incluye `Interview Job-Ready`.
- La matriz de skills enlaza el recurso desde `Ruta Technical English & Interview Readiness`.
- MkDocs lista el recurso en Recursos.
- El contenido evita promesas de empleo y evita presentar labs como experiencia laboral formal.
- Pasan `npm run lint`, `npm run typecheck`, `npm run validate:content`, `npm run build:pages` y `npm test`.
- `mkdocs build --strict` se intenta ejecutar; si `mkdocs` no esta disponible localmente, se reporta como limitacion de entorno.

## Fuera de alcance

- Crear o editar un CV real del usuario.
- Conectarse a LinkedIn.
- Generar perfiles publicos.
- Crear un lab ejecutable JR-009.
- Cambiar los capstones existentes.

## Riesgos y mitigaciones

- Riesgo: que el estudiante presente labs como experiencia laboral.
  - Mitigacion: incluir ejemplos de redaccion honesta y frases prohibidas.
- Riesgo: que la guia sea generica.
  - Mitigacion: incluir preguntas y respuestas por perfil Power Platform/D365.
- Riesgo: duplicar `PORTAFOLIO_PROFESIONAL.md`.
  - Mitigacion: JR-6 se enfoca en entrevista/CV/demo; Portafolio Profesional se mantiene como guia de empaque de evidencias.

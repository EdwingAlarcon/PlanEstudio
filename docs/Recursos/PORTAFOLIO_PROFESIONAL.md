# Cómo Convertir tus Labs en Portafolio Profesional

Terminar un capstone no es lo mismo que tener un portafolio. Un capstone demuestra que sabes
hacer algo una vez, dentro de la plataforma; un portafolio demuestra lo mismo ante alguien que no
te conoce — un entrevistador, un cliente potencial, un gerente que evalúa si delegarte un
proyecto real. Esta guía convierte los entregables que ya produces en `/rutas` y en
[Rúbricas y Plantillas de Evaluación](RUBRICAS_PLANTILLAS_EVALUACION.md) en algo mostrable.

Ver el listado interactivo de qué reunir por ruta en **`/portafolio`** dentro de la app.

## El principio: evidencia, no certificados

Un certificado de PlanEstudio (o incluso una certificación oficial de Microsoft) dice "estudié
esto". Un portafolio dice "hice esto, y así se ve". Para proyectos reales de consultoría o
desarrollo, lo segundo pesa más. No necesitas un sistema de carga de archivos para construirlo:
necesitas guardar lo que ya produces en un lugar organizado y enlazable.

## Qué guardar de cada capstone

Cada capstone (`/rutas/[slug]`) ya define una sección "Evidencia esperada". Esa lista es
literalmente tu checklist de portafolio. Por tipo de entregable:

| Tipo de entregable | Cómo conservarlo |
|---|---|
| Documento funcional o ejecutivo (Markdown/Word) | Guárdalo en un repositorio Git o carpeta compartida, versionado |
| Capturas de pantalla (app, dashboard, flujo) | Nómbralas de forma trazable: `REQ-001_pantalla-inicio.png`, no `captura1.png` |
| Solución exportada (.zip) | Consérvala junto al documento técnico, no solo en tu ambiente de desarrollo |
| Transcript o log de ejecución | Copia el texto relevante a un archivo, no dependas de que el ambiente siga activo |
| Matriz de trazabilidad / UAT | Usa las plantillas copiables de la rúbrica — son el mismo formato que un cliente esperaría |

## Estructura sugerida de un repositorio de portafolio

```
portafolio/
  01-maker-sistema-solicitudes/
    README.md              (resumen de 1 página: problema, solución, resultado)
    diseno/                (modelo de datos, capturas de app)
    evidencia/              (flujo ejecutado, roles probados)
    manual-usuario.md
  02-consultor-funcional-daim/
    README.md
    discovery.md
    fit-gap.md
    historias-usuario.md
    trazabilidad.md
    uat/
    presentacion.pdf
  ...
```

Un README por proyecto, con la misma estructura siempre, hace que cualquiera que revise tu
portafolio entienda el patrón rápido: qué problema, qué hiciste, qué resultado, qué evidencia.

## Qué escribir en el README de cada proyecto

1. **Problema** (2-3 líneas): qué necesitaba el cliente/empresa ficticia.
2. **Solución** (3-5 líneas): qué construiste o diseñaste, con las tecnologías usadas.
3. **Restricciones reales** (si el capstone las tenía): presupuesto, DLP, adopción, integración
   legada — mostrar que sabes trabajar con límites es más valioso que mostrar una solución ideal
   sin contexto.
4. **Resultado o criterio de aprobación cumplido**: el puntaje de la rúbrica si lo calculaste, o
   qué criterios de aprobación satisface.
5. **Lecciones aprendidas** (2-3 líneas): qué harías distinto la próxima vez — esto es lo que un
   entrevistador realmente quiere leer, más que la lista de features.

## Retrospectiva por proyecto

Antes de dar un capstone por cerrado, responde por escrito (2-3 líneas cada una):

- ¿Qué parte del proyecto tomó más tiempo del esperado, y por qué?
- ¿Qué decisión tomarías distinto si lo rehicieras hoy?
- ¿Qué parte de la rúbrica te costó más cumplir?

Guarda estas respuestas junto al README — son las que diferencian un portafolio de una carpeta de
entregables sin reflexión.

## Cuándo un proyecto está listo para portafolio

Usa esta señal simple: si no puedes explicar el proyecto en 60 segundos a alguien que no conoce
Power Platform, todavía no está listo para mostrarse. Vuelve al README y simplifica hasta que sí
puedas.

## Cómo enlazar el portafolio desde CV y LinkedIn

Un proyecto listo para portafolio debe poder aparecer en tres lugares sin cambiar de historia:

| Lugar | Qué mostrar | Qué evitar |
|---|---|---|
| CV | 1-2 bullets con problema, tecnología y evidencia | Listar todos los archivos del proyecto |
| LinkedIn Featured | README, demo, captura o documento resumen | Enlaces privados o sin explicación |
| LinkedIn Projects | Descripción corta, tecnologías y nota de alcance | Presentar un lab como empleo formal |

Ejemplo de bullet para CV:

```text
Diseñé una solución model-driven para gestión de solicitudes con Dataverse, roles de seguridad,
BPF y casos UAT; evidencia disponible en README, matriz de datos y capturas de validación.
```

Ejemplo para LinkedIn Projects:

```text
Proyecto académico/simulado de Power Platform para gestionar solicitudes internas. Incluye
Dataverse, model-driven app, Power Automate, matriz de seguridad, casos UAT y retrospectiva.
```

La palabra clave es **consistencia**: el CV, LinkedIn y README deben decir el mismo alcance. Si el
proyecto fue simulado, dilo una vez y con naturalidad. Eso transmite más confianza que exagerar.

## Relación con la matriz de competencias

La [Matriz de Competencias](MATRIZ_COMPETENCIAS.md) lista qué evidencia corresponde a cada
competencia de tu ruta. Tu portafolio no necesita cubrir las 7 rutas — necesita cubrir bien la
tuya. Si tu ruta es Developer, un portafolio con 3 proyectos técnicos sólidos vale más que uno con
7 proyectos superficiales de todas las rutas.

## Especialización Dynamics 365 CE avanzado + F&O Awareness en el portafolio

La ruta Dynamics 365 Customer Engagement y la ruta Finance & Operations ya pueden producir un
portafolio enterprise usando el **LAB-090 — Capstone Enterprise D365**. Guarda como mínimo:

- Diagrama de arquitectura CE + F&O.
- Matriz Fit-Gap.
- Matriz de datos/ownership.
- Roadmap por fases con dependencias de tenant/licencia.
- Casos UAT end-to-end.
- Resumen ejecutivo de 1 página.

Para ser honesto en entrevista: Sales forecasting, SLA, routing, Contact Center, real-time journeys,
Field Service Mobile/RSO y dual-write deben declarar estado de ejecución usando
[D365 Tenant Readiness](D365_TENANT_READINESS.md): **Simulado**, **Sandbox real** o **Productivo
controlado**. La configuración profunda de Finance o Supply Chain Management sigue fuera del
alcance base y debe presentarse como siguiente paso de especialización.

## CRM Legacy & Cloud Migration Specialist en el portafolio

La ruta [Data Migration + CRM Legacy](JOB_READY_DATA_MIGRATION_LEGACY.md) puede presentarse como
evidencia de **criterio funcional/técnico para migraciones**, no como experiencia laboral real en
una migración productiva enterprise. El alcance correcto es: **parcial / awareness avanzado /
job-ready simulation**.

Guarda los entregables de `LAB-075` y `LAB-078` como un proyecto único de portafolio:

- Legacy CRM assessment.
- Migration strategy.
- Data mapping workbook.
- Cleansing rules.
- Staging and load plan.
- Reconciliation report.
- Cutover runbook.
- Rollback plan.
- Legacy health assessment.
- Risk matrix.
- Executive migration summary.

En el README del proyecto declara explícitamente:

- Qué evidencia fue simulada con datos de práctica.
- Qué parte requeriría tenant real, dataset grande o infraestructura CRM on-premises.
- Qué decisiones tomaste para reducir riesgo antes de cargar datos.
- Qué señales revisarías en SQL Server, IIS, ADFS/certificados, networking y CRM Async Service
  antes de recomendar una migración.

Para entrevista, una frase honesta sería:

```text
Este proyecto simula el ciclo de assessment, mapping, cleansing, staging, reconciliación y cutover
para una migración CRM legacy hacia Dynamics 365. Demuestra criterio de consultoría y arquitectura,
pero no sustituye una migración productiva con infraestructura real, dataset grande y operación de
cutover bajo ventana de negocio.
```

La práctica avanzada con CRM on-premises real, logs de SQL/IIS/ADFS, networking productivo,
migración incremental, tooling ETL y performance troubleshooting queda como roadmap de
especialización futura.

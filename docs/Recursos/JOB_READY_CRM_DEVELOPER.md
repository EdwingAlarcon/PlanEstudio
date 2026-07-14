# Ruta Job-Ready Dynamics 365 CRM Developer

Esta ruta convierte el contenido técnico actual de PlanEstudio en una preparación laboral específica para vacantes de **Dynamics 365 CRM Developer**.

No garantiza empleo. Tampoco convierte automáticamente los labs en experiencia laboral formal. Su valor está en ayudarte a practicar, reunir evidencia técnica y explicar tu trabajo con el lenguaje que usan equipos de CRM, consultores técnicos y recruiters especializados.

## Vacantes objetivo

Esta ruta apunta a roles como:

- Dynamics 365 CRM Developer.
- Power Platform Developer con foco en Customer Engagement.
- Microsoft Business Applications Technical Consultant.
- Dataverse / CRM Integration Developer.
- CRM Developer junior-mid que necesita demostrar C#, JavaScript, plugins e integraciones.

## Resultado esperado

Al completar la secuencia recomendada, deberías poder explicar y demostrar:

- Cómo extender Dynamics 365 / Dataverse con JavaScript de formulario y Web Resources.
- Cómo construir plugins C# con stages, images, depth, tracing y pruebas unitarias.
- Cómo consumir Dataverse Web API y diseñar integraciones seguras.
- Cómo mover soluciones con ALM, pipelines, Power Platform CLI y revisión técnica.
- Cómo usar IA para acelerar desarrollo sin aceptar código inseguro ni no verificado.

## Skills laborales y estado actual

| Skill laboral | Estado actual | Contenido actual | Evidencia posible hoy | Brecha |
|---|---|---|---|---|
| C# para Dynamics 365 CRM | Cubierto | Módulo 23, LAB-023 | Plugin con código fuente y pruebas | Profundizar escenarios de entrevista |
| Plugins Dataverse | Cubierto | Módulo 23, LAB-023 | Step registrado, tracing y validaciones server-side | Simulación job-test JR-003 |
| Plugin pipeline | Cubierto | Módulo 23 | Explicación de PreOperation/PostOperation | Más casos de PreValidation y async |
| Pre/Post Images | Parcial | Módulo 23, LAB-023 | Registro de PreImage en PRT | Caso de comparación de cambios más fuerte |
| Depth y recursión | Cubierto | Módulo 23 | Guard clause `context.Depth > 1` | Preguntas de troubleshooting |
| ITracingService / Plugin Trace Log | Cubierto | Módulo 23; LAB-092 | Trazas de plugin analizadas como evidencia de incidente en JR-012 | Ampliar a escenarios con múltiples incidentes concurrentes |
| Custom API / Custom Workflow Activity | Cubierto | LAB-091 | Contrato de Custom API, plugin backing y `CodeActivity` legacy evaluados en JR-011 | Custom Connectors sigue sin job test dedicado |
| Unit testing de plugins | Parcial | Módulo 23, Módulo 50, LAB-023 | Tests con Moq | Ampliar casos error/feliz/seguridad |
| JavaScript CRM | Cubierto | Módulo 13; LAB-072 | Web Resource evaluado en prueba técnica JR-002 | Reforzar OnChange y errores comunes |
| `formContext` / `executionContext` | Cubierto | Módulo 13; LAB-072 | Handler OnLoad/OnSave/OnChange evaluado en JR-002 | Reforzar validación async |
| `Xrm.WebApi` | Cubierto | Módulo 13, Módulo 53; LAB-072 | Consulta desde formulario evaluada en JR-002 | Falta CRUD completo y manejo de errores |
| Dataverse Web API | Cubierto | Módulo 53, LAB-054, LAB-074 | App externa e integración evaluada en JR-004 | Ampliar casos de manejo de errores |
| Azure Functions | Cubierto | Módulo 24; LAB-074 | Implementación de integración evaluada en JR-004 | Profundizar en patrones de reintento |
| Azure Logic Apps | Awareness | Módulo 34 | Comparación con Power Automate | Falta challenge práctico |
| Service Bus | Parcial | Módulos 24, 34; LAB-074 | Patrón asíncrono con idempotencia evaluado en JR-004 | Falta simulación de resiliencia bajo carga |
| ALM técnico | Cubierto | Módulos 19, 54; LAB-019, LAB-053 | Pipeline y solución desempaquetada | Conectar con repo CRM Developer |
| Clean code | Parcial | Módulos 48, 50 | Revisión de diff y guardrails | Checklist específico CRM |
| Debugging y troubleshooting | Cubierto | Módulos 23, 26; LAB-092 | Diagnóstico de incidente de producción con trace log evaluado en JR-012 | Escenario con múltiples incidentes concurrentes |
| IA aplicada al desarrollo | Parcial | Módulos 42-55, LAB-045, LAB-051, LAB-053 | Prompt, diff y revisión humana | JR-010 como práctica job-ready |

## Secuencia recomendada de estudio

1. **Base de cliente CRM:** Módulo 13 para JavaScript, Web Resources, `formContext`, eventos y PCF básico.
2. **Extensión server-side:** Módulo 23 y LAB-023 para plugins, pipeline, images, depth, tracing y tests.
3. **ALM técnico:** Módulo 19, Módulo 54, LAB-019 y LAB-053 para solutions, pipelines y revisión de cambios.
4. **Integraciones:** Módulo 24, Módulo 53 y LAB-054 para Web API, autenticación y diseño de conexión externa.
5. **Calidad y troubleshooting:** Módulo 26 y Módulo 50 para performance, tests, guardrails y diagnóstico.
6. **Capstone:** LAB-063 para reunir evidencia técnica completa.

## Mapeo a contenido actual

| Contenido | Uso dentro de esta ruta | Qué debes extraer como evidencia |
|---|---|---|
| Módulo 13 - JavaScript y PCF Básico | Base client-side CRM | Web Resource, eventos registrados y explicación de `formContext` |
| Módulo 19 - ALM y CI/CD | Transporte de solución | Pipeline, solución managed/unmanaged y gates |
| Módulo 23 - C# Plugins para Dataverse | Core CRM Developer | Plugin, tests, registro en PRT, trace log |
| Módulo 24 - Integraciones con Azure Services | Integración técnica | Diagrama con patrón sync/async y manejo de fallos |
| Módulo 26 - Performance y Optimización | Troubleshooting | Diagnóstico de performance y mitigaciones |
| Módulo 50 - Tests, CI/CD y Guardrails | Calidad técnica | Resultado de tests y checklist de revisión |
| Módulo 53 - Dataverse Web API y Autenticación | API e identidad | Llamada autenticada y manejo de errores |
| Módulo 54 - ALM de Soluciones con IA | Revisión asistida | Prompt, diff y verificación humana |
| LAB-019 | CI/CD | Evidencia de pipeline ejecutado |
| LAB-023 | Plugin C# | Código, tests, registro y trazas |
| LAB-054 | Web API / integración | Diseño de conexión externa a Dataverse |
| LAB-063 | Capstone Developer | Proyecto técnico integrador para portafolio |

## Evidencia de portafolio

Un portafolio CRM Developer debería incluir al menos:

- Repositorio con plugin C# y estructura clara de solución.
- README técnico con problema, diseño, decisiones y limitaciones.
- Captura o export de solución Dataverse.
- Captura del Plugin Registration Tool o evidencia de step registrado.
- Plugin Trace Log explicado: qué pasó, qué se diagnosticó y cómo se corrigió.
- Pruebas unitarias con al menos un caso feliz y un caso de error.
- Web Resource JavaScript con OnLoad, OnChange u OnSave y manejo de errores.
- Ejemplo de uso de `Xrm.WebApi` o Dataverse Web API.
- Diagrama de integración con API externa, Azure Function, Logic Apps o Service Bus.
- Evidencia ALM: pipeline, solución desempaquetada o revisión de diff.

## Preguntas de entrevista

### JavaScript CRM

- ¿Por qué `Xrm.Page` ya no debe usarse en código nuevo?
- ¿Cómo obtienes `formContext` desde un evento OnLoad?
- ¿Qué diferencia hay entre OnLoad, OnChange y OnSave?
- ¿Cómo cancelarías un guardado desde JavaScript?
- ¿Cómo manejarías errores de `Xrm.WebApi.retrieveMultipleRecords`?

### Plugins C#

- ¿Qué diferencia hay entre PreValidation, PreOperation y PostOperation?
- ¿Cuándo usarías una PreImage?
- ¿Qué problema resuelve `context.Depth`?
- ¿Por qué `ITracingService` es crítico en producción?
- ¿Cómo evitarías que un plugin se dispare para cada update irrelevante?
- ¿Cuándo lanzarías `InvalidPluginExecutionException`?

### Dataverse Web API e integraciones

- ¿Cuándo prefieres Web API frente a un conector estándar?
- ¿Cómo manejarías paginación, throttling y reintentos?
- ¿Cuándo usarías Service Bus en lugar de una llamada HTTP directa?
- ¿Qué información no debe quedar hardcodeada en código o flujos?
- ¿Cómo diseñarías idempotencia en una integración CRM?

### Testing, ALM y troubleshooting

- ¿Cómo pruebas un plugin sin depender de producción?
- ¿Qué revisarías si un plugin funciona en DEV pero falla en TEST?
- ¿Cómo moverías una solución de DEV a PROD sin cambios manuales?
- ¿Qué incluirías en un rollback plan?
- ¿Cómo explicarías un incidente técnico a un usuario no técnico?

### IA aplicada al desarrollo

- ¿Cómo usarías IA para generar una primera versión de un plugin sin aceptar código inseguro?
- ¿Qué revisarías en un diff generado por IA antes de aprobarlo?
- ¿Qué datos nunca pegarías en un prompt?

## Labs Job-Ready disponibles

| Lab disponible | Vacante que valida | Skills que valida | Evidencia esperada | Dificultad | Duración | Relación con portafolio |
|---|---|---|---|---|---|---|
| LAB-072 (JR-002) - CRM JavaScript Customization | Dynamics 365 CRM Developer | OnLoad, OnChange, OnSave, `formContext`, `Xrm.WebApi` | Web Resource, casos de prueba, captura de eventos | Avanzada | 4 h | Demuestra client-side customization |
| LAB-073 (JR-003) - Dataverse Plugin C# Job Test | CRM Developer | Plugin pipeline, tracing, depth, images, tests | Código, tests, PRT, Plugin Trace Log | Avanzada | 4-5 h | Demuestra server-side development |
| LAB-074 (JR-004) - CRM Integration Challenge | Integration Developer | Web API, Azure Function/Service Bus, errores, idempotencia | Diagrama, API/flujo, logs, decisiones | Avanzada | 4 h | Demuestra integración enterprise |
| LAB-080 (JR-010) - AI-Assisted CRM Development | CRM Developer moderno | Prompting, revisión de código, seguridad, guardrails | Prompt, diff, checklist, pruebas | Intermedia | 3 h | Demuestra uso responsable de IA |
| LAB-091 (JR-011) - Custom API & Workflow Extensibility Job Test | CRM Developer | Custom API (contrato, parámetros), Custom Workflow Activity legacy, criterio de elección de mecanismo | Definición de Custom API, código del plugin, código del `CodeActivity`, tabla comparativa, pruebas | Avanzada | 4 h | Demuestra extensibilidad avanzada más allá del plugin tradicional |
| LAB-092 (JR-012) - Production Incident Simulation | CRM Developer | Lectura de Plugin Trace Log, descarte de hipótesis, causa raíz, fix, regresión, post-mortem | Triage, análisis de causa raíz, fix propuesto, plan de regresión, post-mortem | Avanzada | 3 h | Demuestra troubleshooting de producción con evidencia, no solo código nuevo |

## Brechas críticas

1. JR-011 y JR-012 cierran las brechas de Custom APIs, workflow activities legacy y simulación de incidente en producción documentadas en la revisión anterior de esta ruta.
2. Custom Connectors (más allá de Custom API) siguen sin un job test dedicado.
3. La simulación de incidente de JR-012 usa un extracto de trace log fijo; un escenario con múltiples incidentes concurrentes queda como roadmap.

## Checklist antes de aplicar

- [ ] Puedo explicar `formContext` sin usar `Xrm.Page`.
- [ ] Tengo un Web Resource con al menos un evento registrado y probado.
- [ ] Tengo un plugin C# con tests y tracing.
- [ ] Sé explicar stages, images, depth y filtering attributes.
- [ ] Puedo mostrar evidencia ALM: solución, pipeline o export/import controlado.
- [ ] Puedo explicar una integración con Dataverse Web API.
- [ ] Tengo un README técnico de mi capstone Developer.
- [ ] Puedo responder al menos 10 preguntas de entrevista de esta página.
- [ ] Puedo explicar qué brechas todavía tengo sin venderlas como experiencia.

## Relación con recursos existentes

- Usa la [Matriz de Skills Laborales](MATRIZ_SKILLS_LABORALES.md) para ver cómo esta ruta encaja con otras vacantes.
- Usa la [Matriz de Competencias](MATRIZ_COMPETENCIAS.md) para criterios de evidencia demostrable.
- Usa [Cómo Convertir tus Labs en Portafolio Profesional](PORTAFOLIO_PROFESIONAL.md) para empaquetar capturas, README y decisiones técnicas.


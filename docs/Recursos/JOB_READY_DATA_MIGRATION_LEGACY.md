# Ruta Job-Ready Data Migration + CRM Legacy

Esta ruta convierte el contenido actual de migracion, arquitectura e integraciones en una preparacion laboral especifica para vacantes de **CRM Migration Specialist**, **Dynamics 365 Migration Consultant**, **Legacy Modernization Consultant** o **Solution Architect junior-mid**.

No garantiza empleo. Tampoco convierte automaticamente los labs en experiencia laboral formal. Su valor esta en ayudarte a practicar decisiones, documentar artefactos de migracion y explicar riesgos con lenguaje de proyecto real.

## Vacantes objetivo

Esta ruta apunta a roles como:

- Dynamics 365 Migration Consultant.
- CRM Migration Specialist.
- Legacy Modernization Consultant.
- Data Migration Analyst para Dataverse.
- Functional-Technical Consultant con foco en migracion y soporte de cutover.
- Solution Architect junior-mid en proyectos de modernizacion CRM.

## Resultado esperado

Al completar esta ruta, deberias poder explicar y demostrar:

- Como evaluar un CRM legacy antes de migrarlo a Dynamics 365.
- Como construir un mapping origen-destino hacia Dataverse.
- Como definir reglas de limpieza, deduplicacion y descarte.
- Como usar staging, success/error tables y flags de procesamiento para controlar una migracion compleja.
- Como elegir entre import wizard, dataflows, Azure Data Factory, bulk APIs, Upsert o herramientas especializadas segun volumen y complejidad.
- Como validar datos despues de cargar: conteos, muestras, integridad referencial y reconciliacion funcional.
- Como preparar un plan de cutover, delta load, rollback y comunicacion a usuarios.
- Que revisar conceptualmente en CRM on-premises: SQL Server, IIS, red, versiones, customizaciones, jobs e integraciones.

## Enfoque moderno de migracion

Una migracion laboral no debe tratarse como "subir un Excel". El enfoque recomendado es:

- **Clasificar complejidad:** distinguir migraciones simples, medias y complejas por volumen, relaciones, customizaciones y criticidad del negocio.
- **Separar assessment de ejecucion:** primero inventario, calidad de datos, dependencias, integraciones y riesgos; despues carga.
- **Usar staging para escenarios complejos:** una base intermedia permite transformar, auditar, reintentar y validar sin golpear directamente el sistema origen o Dataverse.
- **Disenar cargas repetibles:** usar claves externas, `Upsert`, success/error tables y estados de procesamiento para reanudar sin duplicar datos.
- **Cargar por secuencia:** migrar tablas de menor dependencia primero, resolver lookups y manejar ciclos con inserciones parciales y actualizaciones posteriores.
- **Optimizar sin ignorar limites:** ajustar batch size, concurrencia, reintentos y manejo de throttling; no sacrificar integridad por velocidad.
- **Validar con negocio:** los conteos tecnicos no bastan; usuarios clave deben confirmar que los datos sirven para operar.
- **Planear cutover:** definir ventana, delta load, congelamiento, comunicacion, rollback y criterios de go/no-go.

## Skills laborales y estado actual

| Skill laboral | Estado en PlanEstudio | Evidencia esperada | Pregunta tipica de entrevista |
|---|---|---|---|
| Source system assessment | Parcial | Inventario de tablas, volumenes, integraciones y riesgos | ¿Que preguntas haces antes de migrar un CRM legacy? |
| Mapping origen-destino | Parcial | Workbook con tabla origen, campo destino, regla y responsable | ¿Que haces con campos legacy sin equivalente en Dataverse? |
| Data cleansing | Awareness | Reglas de deduplicacion, normalizacion y descarte | ¿Como limpias datos antes de cargarlos a Dataverse? |
| Staging database | Awareness | Modelo conceptual con tablas main, success y error | ¿Por que usar staging en una migracion compleja? |
| Importacion batch | Awareness | Estrategia de carga por lotes y manejo de errores | ¿Por que Excel no es suficiente para millones de registros? |
| Upsert / claves externas | Parcial | Estrategia idempotente para cargas repetibles | ¿Como evitas duplicados si repites una carga? |
| Bulk operations | Awareness | Decision document sobre APIs, batch size y retries | ¿Como manejas throttling o errores 429? |
| Reconciliacion | No cubierto | Reporte con conteos, muestras y reglas de integridad | ¿Como demuestras que la migracion fue correcta? |
| Cutover | Awareness | Runbook con ventana, delta, rollback y comunicacion | ¿Que contiene un plan de cutover CRM? |
| SQL/IIS/networking awareness | Awareness | Checklist conceptual de salud on-prem | ¿Que revisas si CRM on-prem esta lento? |
| Health assessment | No cubierto | Informe de riesgos y roadmap de migracion | ¿Que pondrias en un health assessment de CRM? |

## Secuencia recomendada

1. **Refrescar Dataverse y seguridad:** repasar modelado, relaciones, ownership y roles antes de hablar de migracion.
2. **Estudiar integraciones empresariales:** entender APIs, conectividad, gateways, Service Bus, APIM y patrones sync/async.
3. **Revisar rendimiento y escalabilidad:** conectar migracion con limites, volumenes, jobs, batch y monitoreo.
4. **Estudiar estrategias de migracion empresarial:** Strangler Fig, paralelo temporal, fases, cutover y retiro legacy.
5. **Construir artefactos JR-5:** mapping, reglas de limpieza, staging conceptual, reconciliacion y cutover.
6. **Agregar awareness CRM on-prem:** SQL Server, IIS, networking, versiones, customizaciones e integraciones.
7. **Preparar entrevista:** explicar trade-offs: simple vs compleja, import wizard vs ADF, create/update vs Upsert, big bang vs phased migration.

## Mapeo a contenido actual

| Contenido actual | Como usarlo para JR-5 | Evidencia sugerida |
|---|---|---|
| Modulo 34 - Integraciones empresariales | Base para sistemas origen, APIs, conectividad y patrones de integracion | Diagrama de flujo origen -> staging -> Dataverse |
| Modulo 35 - Rendimiento y escalabilidad | Base para batch, limites, performance y monitoreo | Decision record de rendimiento y retries |
| Modulo 37 - Estrategias de migracion empresarial | Base principal para roadmap, paralelo temporal y cutover | Plan de migracion por fases |
| Modulo 39 - Casos de transformacion digital | Contexto de modernizacion legacy y negocio | Caso ejecutivo con riesgos y beneficios |
| Modulo 40 - Licenciamiento y roadmap | Estimacion, costos, licencias y capacidad | Supuestos de licenciamiento/capacidad |
| Modulos 53/54 | Integracion, ALM y despliegue si la migracion requiere componentes tecnicos | Checklist ALM y despliegue |
| LAB-064 conceptual | Punto de partida para documentar migracion | Mapping y reporte de validacion |
| Rutas Developer/Admin/Functional | Complemento para seguridad, automatizacion, soporte y arquitectura | Evidencias transversales |

## Evidencia de portafolio

Un portafolio JR-5 convincente deberia incluir:

1. **Migration assessment brief**
   - Sistema origen, modulos, volumenes, tablas principales, integraciones, usuarios y riesgos.
   - Decision: migracion simple, media o compleja.

2. **Mapping workbook**
   - Tabla origen.
   - Campo origen.
   - Tabla Dataverse destino.
   - Campo destino.
   - Tipo de transformacion.
   - Regla de limpieza.
   - Responsable funcional.
   - Estado: aprobado, pendiente, descartado.

3. **Data cleansing rules**
   - Deduplicacion de cuentas/contactos.
   - Normalizacion de telefono, correo, pais, ciudad y estados.
   - Campos obligatorios.
   - Campos legacy que se archivan o descartan.

4. **Staging design**
   - Main staging table.
   - Success table.
   - Error table.
   - Processing flag.
   - External ID.
   - Batch ID.
   - Fecha de carga.

5. **Load strategy**
   - Herramienta propuesta.
   - Orden de tablas.
   - Manejo de lookups.
   - Uso de `Upsert`.
   - Reintentos.
   - Manejo de errores.

6. **Reconciliation report**
   - Conteo origen vs destino.
   - Conteo por tabla.
   - Muestras validadas por negocio.
   - Errores pendientes.
   - Reglas de aceptacion.

7. **Cutover runbook**
   - Ventana de corte.
   - Freeze de datos.
   - Delta load.
   - Validacion final.
   - Rollback.
   - Comunicacion a usuarios.

8. **Legacy health assessment**
   - Riesgos SQL/IIS/networking.
   - Customizaciones criticas.
   - Integraciones activas.
   - Jobs/procesos batch.
   - Recomendaciones antes de migrar.

## Preguntas de entrevista

### Migracion de datos

- ¿Como decides si una migracion es simple, media o compleja?
- ¿Por que una migracion compleja necesita staging?
- ¿Que informacion pides al cliente antes de estimar una migracion?
- ¿Como manejas campos legacy sin equivalente en Dataverse?
- ¿Como decides que datos historicos migrar y cuales archivar?

### Dataverse y carga

- ¿Cuando usarias import wizard, dataflows, Azure Data Factory o una integracion custom?
- ¿Como usarias `Upsert` para evitar duplicados?
- ¿Como manejas lookups durante una migracion?
- ¿Por que no conviene cerrar casos, oportunidades o leads antes de terminar la validacion?
- ¿Que haces si una carga falla a mitad del proceso?

### Validacion y reconciliacion

- ¿Como demuestras que los datos migrados son correctos?
- ¿Que validaciones tecnicas y funcionales haces?
- ¿Como documentas registros rechazados?
- ¿Que aceptarias como criterio de go/no-go?

### Cutover

- ¿Que contiene un runbook de cutover?
- ¿Cuando prefieres migracion por fases frente a big bang?
- ¿Como reduces downtime?
- ¿Como preparas rollback?

### CRM legacy / on-prem awareness

- ¿Que rol cumple IIS en Dynamics CRM on-premises?
- ¿Que revisarias en SQL Server si CRM esta lento?
- ¿Como identificas integraciones criticas antes de migrar?
- ¿Que riesgos trae migrar customizaciones antiguas sin redisenarlas?
- ¿Como explicarias a negocio que no todo dato historico debe migrarse?

## Labs Job-Ready recomendados

Estos labs quedan como roadmap, no como laboratorios ejecutables en esta entrega.

| Lab recomendado | Prioridad | Perfil | Skills | Evidencia |
|---|---|---|---|---|
| JR-005 Data Migration to Dynamics 365 | Alta | Migration Specialist | mapping, cleansing, staging, importacion, reconciliacion, cutover | Mapping workbook, staging design, reconciliation report, cutover runbook |
| JR-008 CRM Legacy Health Assessment | Media-Alta | Legacy / Migration / Architect | SQL, IIS, networking, upgrade path, performance, riesgos | Health assessment, matriz de riesgos, roadmap de mitigacion |

## Brechas criticas

- Falta un dataset sucio para practicar limpieza y deduplicacion.
- Falta un lab ejecutable de staging, success/error tables y retry.
- Falta una simulacion de reconciliacion post-carga.
- Falta un caso guiado de cutover con rollback.
- Falta una practica visual de health assessment on-premises.

Estas brechas no bloquean el aprendizaje, pero si marcan que JR-5 debe presentarse como preparacion y criterio profesional, no como experiencia operativa completa.

## Checklist antes de aplicar

Antes de aplicar a una vacante de migracion o legacy CRM, deberias poder:

- [ ] Explicar la diferencia entre migracion simple, media y compleja.
- [ ] Crear un mapping origen-destino con reglas de transformacion.
- [ ] Identificar datos duplicados, incompletos o irrelevantes.
- [ ] Explicar por que staging reduce riesgo.
- [ ] Definir una estrategia de carga por lotes.
- [ ] Explicar `Upsert` y claves externas.
- [ ] Proponer manejo de errores y reintentos.
- [ ] Crear un reporte de reconciliacion.
- [ ] Escribir un runbook de cutover.
- [ ] Explicar riesgos de SQL/IIS/networking en CRM on-premises.
- [ ] Presentar un health assessment conceptual sin exagerar experiencia real.

## Relacion con recursos existentes

- **Matriz de Skills Laborales:** JR-5 profundiza la brecha "Data Migration & Legacy CRM".
- **Ruta CRM Functional:** ayuda a validar que los datos migrados soportan procesos reales de Sales/Customer Service.
- **Ruta CRM Developer:** complementa integraciones, Web API, plugins y ALM cuando la migracion requiere desarrollo.
- **Ruta Admin/Governance:** complementa capacidad, ambientes, DLP, licenciamiento y seguridad.
- **Portafolio profesional:** los artefactos JR-5 deben presentarse como proyecto academico/profesional simulado, con alcance claro y evidencias verificables.

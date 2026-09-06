# Soluciones de Referencia para Capstones

> Usa este recurso despues de intentar el capstone. No es una respuesta unica ni una plantilla para copiar: es una referencia para comparar tu criterio, detectar huecos y mejorar la evidencia antes de presentarla en portafolio.

## Como usar estas soluciones

1. Completa el capstone con tus propios entregables.
2. Marca cada requisito como `Cumple`, `Parcial` o `No cubierto`.
3. Compara tu decision principal contra la solucion de referencia.
4. Ajusta solo lo que puedas justificar con evidencia.
5. Documenta que parte fue simulada, que parte fue ejecutada en sandbox real y que parte no fue verificada.

## LAB-077 — Customer Service Specialist

### Decisiones esperadas

- Usar colas para organizar trabajo, no para reemplazar roles de seguridad.
- Separar SLA de primera respuesta y SLA de resolucion por plan de cliente.
- Mantener entitlement como control comercial/contractual y no como bloqueo silencioso de atencion.
- Incluir al menos un camino negativo: cliente sin entitlement disponible, SLA fuera de horario o caso vencido.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| Matriz de casos | 5 casos con cliente, plan, tipo, cola, prioridad, SLA esperado y resultado observado/simulado |
| Diseno de SLA | Calendario, pausa/reanudacion, primera respuesta, resolucion, excepcion por plan Premium |
| Entitlements | Limite anual, consumo, regla de excepcion y responsable de aprobar override |
| Dashboard | Casos abiertos, vencidos, cumplimiento SLA, cola responsable y accion esperada |
| UAT | Evidencia de cada caso, incluyendo al menos un caso negativo |

### Solucion de referencia resumida

El caso Premium critico con entitlement casi agotado no debe bloquearse automaticamente. La solucion recomendada es crear el caso, marcarlo para revision de supervisor y registrar consumo/override en la matriz de entitlement. Para el caso del viernes 17:00, el SLA debe pausarse fuera del calendario laboral salvo que el cliente tenga soporte 24/7 documentado. El dashboard no solo muestra conteos: debe indicar que C-005 requiere accion inmediata del supervisor.

### Senales de alerta

- El dashboard no permite decidir que caso atender primero.
- El estudiante afirma que configuro SLA real sin tenant ni capturas.
- No hay diferencia entre cliente Premium y Estandar.

## LAB-079 — Technical Interview Simulation

### Decisiones esperadas

- Elegir un rol objetivo unico para CV, LinkedIn y demo.
- Usar un proyecto realmente completado, no un caso hipotetico.
- Declarar limites: lab, simulacion, sandbox o produccion real.
- Responder preguntas tecnicas con evidencia, no con definiciones memorizadas.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| CV | 1 pagina, rol unico, proyectos con tecnologia + problema + evidencia |
| LinkedIn | Headline, About, Featured y Projects coherentes con el CV |
| Demo | 10 minutos, problema, decision, evidencia, limite y mejora |
| STAR | 5 respuestas basadas en hechos de labs/capstones |
| Ingles tecnico | 8+ respuestas breves con estructura Context/Decision/Evidence/Limit |

### Solucion de referencia resumida

Una respuesta fuerte no intenta sonar senior sin evidencia. Por ejemplo: "Este fue un capstone simulado de Customer Service; disene SLA, colas y UAT con datos de prueba. No lo presento como produccion, pero si como evidencia de criterio funcional. Si pasara a produccion, validaria calendario real, volumen de casos y permisos por rol". Esa estructura protege credibilidad y muestra criterio laboral.

### Senales de alerta

- CV generico para todos los roles.
- Proyectos academicos puestos como empleo formal.
- Demo centrada en pantallas sin explicar decisiones.

## LAB-084 — Customer Insights Journeys

### Decisiones esperadas

- Validar consentimiento antes de cualquier envio.
- Separar Customer Insights - Data de Customer Insights - Journeys.
- Definir un objetivo medible del journey.
- Incluir pruebas negativas: sin consentimiento, email invalido y cliente ya renovado.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| Trigger | Evento, campos minimos, condicion de entrada y salida |
| Consentimiento | Proposito, canal, fuente, exclusion y evidencia |
| Journey | Mensaje, espera, condicion de interaccion, tarea comercial y objetivo |
| Pruebas | 4 casos con resultado esperado/observado |
| Estado real | Simulado, Sandbox real o Productivo controlado |

### Solucion de referencia resumida

El journey debe empezar por elegibilidad y consentimiento. Si el contacto no tiene consentimiento de email, no recibe el mensaje aunque pertenezca al segmento. Si el cliente ya renovo, sale del journey por condicion de exclusion. Si abre el correo, se crea una tarea para el vendedor; si no interactua en 48 horas, puede entrar a un fallback solo si ese canal tambien tiene consentimiento valido.

### Senales de alerta

- "Enviar email" aparece como objetivo final.
- Se usa consentimiento generico para todos los canales.
- El journey re-hace matching de perfiles que corresponde a Customer Insights - Data.

## LAB-085 — Customer Insights Data

### Decisiones esperadas

- Definir fuente de verdad por dato de cliente.
- Combinar matching exacto y difuso con umbrales.
- Crear una cola de revision manual para coincidencias ambiguas.
- Bloquear activacion si la calidad de datos no cumple umbral.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| Fuentes | Dataverse, CSV legado y casos con owner, frecuencia, calidad y campos clave |
| Matching | Reglas en orden, umbral de confianza y falsos positivos esperados |
| Medidas | Formula, fuente y uso de negocio |
| Segmento | Criterio, destino y restriccion de gobierno |
| Operacion | Duplicados, perfiles sin email, fuentes atrasadas y regla de stop |

### Solucion de referencia resumida

La unificacion no debe activar segmentos si el porcentaje de perfiles sin email o matches ambiguos supera el umbral definido. Una referencia aceptable usa email normalizado como regla exacta, nombre+telefono como regla difusa con revision manual, y una supresion por baja reciente aunque el cliente califique comercialmente para renovacion.

### Senales de alerta

- Matching solo por nombre.
- Medidas sin formula.
- Segmento sin destino operativo.

## LAB-102 — Dynamics 365 Sales Lead-to-Cash

### Decisiones esperadas

- Mantener el alcance en Sales: Lead, Opportunity, Quote, Order, Invoice, Product y Price List.
- Justificar cualquier tabla custom.
- Definir condiciones de calificacion y descalificacion de leads.
- Probar un caso negativo de conversion.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| Lead qualification | Criterios BANT o equivalente, campos requeridos y salida descalificada |
| BPF | 4 etapas, campos requeridos, rama por monto/riesgo |
| Price lists | 2 listas, 3 productos, reglas de descuento y segmento |
| Quote/Order/Invoice | Validaciones previas, owner y autorizacion |
| UAT | 5 casos end-to-end, minimo 1 negativo |

### Solucion de referencia resumida

Un lead se califica solo si tiene necesidad, contacto valido, presupuesto/rango y plazo estimado. Al calificarlo se crean Account, Contact y Opportunity. Una Opportunity de monto alto entra a aprobacion antes de Quote. La Quote aplica price list por segmento; antes de Order se valida disponibilidad y credito. El caso negativo debe fallar de forma esperada, no "arreglarse" manualmente sin registrar la causa.

### Senales de alerta

- El flujo salta de Opportunity a Invoice sin Quote/Order.
- No hay price list real ni regla de descuento.
- El estudiante mezcla soporte/cobranza y sale del alcance Sales.

## LAB-112 — RPA Capstone

### Decisiones esperadas

- Defender RPA solo donde no existe API, conector o cloud flow viable.
- Separar cloud flow, desktop flow, configuracion por ambiente y credenciales.
- Implementar idempotencia para evitar duplicados.
- Incluir runbook, rollback y RCA.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| PDD/AS-IS/TO-BE | Proceso, excepciones, frecuencia, volumen y duenos |
| Matriz de viabilidad | RPA vs API/conector/cloud flow con decision justificada |
| Diseno tecnico | Cloud + desktop, colas/archivos, logs, secretos y ambiente |
| Pruebas | Positivas, negativas, reintento, duplicado, archivo corrupto |
| Operacion | Runbook, owner, monitoreo, rollback, RCA y evidencia de demo |

### Solucion de referencia resumida

La solucion de referencia procesa cada solicitud con un identificador unico, registra estado antes y despues de tocar el portal legacy, mueve archivos a carpetas `processed`/`rejected`, y permite reejecucion sin duplicar salidas. Las credenciales no quedan en texto plano. El cloud flow orquesta, PAD ejecuta solo el tramo legacy, y el runbook indica como actuar ante portal caido, archivo invalido o ejecucion parcial.

### Senales de alerta

- Automatizacion basada solo en coordenadas.
- Reintentos infinitos.
- No hay criterio para decidir "esto no debe automatizarse con RPA".

## LAB-075 — Data Migration to Dynamics 365

### Decisiones esperadas

- Definir el criterio de deduplicacion antes de cargar (normalizar nombre/email, no comparar a ojo).
- Excluir explicitamente los registros basura (valores tipo "N/A", vacios) en vez de migrarlos "por si acaso".
- Diseñar staging que permita reintentos sin duplicar (tabla de error separada de la de exito).
- Definir un umbral de error por lote que decida pausar o continuar la carga.
- Separar la validacion tecnica (conteos) de la aprobacion funcional de negocio.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| Assessment | Volumen, calidad, dependencias e integraciones documentados con los 40k/65k/12k de referencia |
| Mapping | Reglas de transformacion aplicadas a los 5 registros de la muestra, no solo enunciadas |
| Staging | `stg_account_main/success/error` con `source_id`, `batch_id`, `processing_status` |
| Reconciliacion | Conteo origen-staging-Dataverse, rechazados por causa y aprobacion funcional separada |
| Runbook de cutover | Freeze, carga delta, validacion, go/no-go, rollback y comunicacion |

### Solucion de referencia resumida

Frente a L-1001 y L-1002 (duplicado funcional), la solucion de referencia normaliza `customer_name` a
minusculas sin espacios y compara junto con el dominio del email; conserva el registro con mas
actividad relacionada (L-1001) y redirige cualquier referencia del descartado antes de eliminarlo de
staging. L-1003 se excluye por regla de lista de valores basura y aparece en el reporte de rechazados
con causa explicita, no se descarta en silencio. El umbral de error por lote se fija por debajo del
5%: superarlo pausa el batch para revision manual en vez de continuar cargando datos sospechosos.

### Senales de alerta

- El mapping no resuelve los 5 casos de la muestra, solo los menciona.
- Se declara "reconciliacion aprobada" sin distinguir conteo tecnico de aprobacion funcional.
- El rollback no aclara si tambien reactiva el sistema legacy.

## LAB-076 — PPAC Governance Assessment

### Decisiones esperadas

- Priorizar riesgos con base en el inventario real entregado, no en generalidades de gobierno.
- No bloquear conectores o apps sin evaluar primero el impacto operativo del dueño afectado.
- Definir que hacer con el ambiente "Default" sin poder eliminarlo.
- Decidir Managed Environments en funcion de presupuesto y madurez de gobierno, no por moda.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| Inventario de ambientes | Clasificado por criticidad y riesgo usando los 4 ambientes de la muestra |
| Matriz de DLP | Conectores clasificados business/non-business/blocked con el caso Dropbox resuelto |
| Capacidad/licencias | Decision sobre el 78% de uso y las 6 licencias Premium sin uso, con siguiente paso claro |
| Runbook de incidentes | Los 4 casos (flujo fallando, permisos excesivos, exportacion sospechosa, ambiente sin dueño) |
| Informe ejecutivo | Prioriza 3-5 acciones, no una lista plana de hallazgos |

### Solucion de referencia resumida

Ante el conector Dropbox personal activo en Sandbox-Finanzas con datos financieros, la solucion de
referencia no bloquea de inmediato: notifica al dueño con un plazo corto (ej. 48 horas) explicando el
riesgo y bloquea si no hay respuesta o justificacion valida — bloquear sin aviso genera resistencia al
gobierno futuro. Frente al 78% de capacidad, la recomendacion es investigar el consumo antes de
comprar mas (posible causa: Default sin control, 62 apps activas sin dueño); las 6 licencias Premium
sin uso los ultimos 90 dias se reportan a compras para reasignacion, no se descartan. "Default" no se
elimina ni se congela de golpe: se inventarian sus apps criticas y se migran progresivamente a
ambientes con dueño mientras se le aplican los controles de DLP que si son aplicables sin eliminar
acceso.

### Senales de alerta

- El informe recomienda bloquear conectores sin mencionar comunicacion previa al dueño.
- Se propone eliminar o congelar "Default" sin plan de migracion de sus apps activas.
- La decision de Managed Environments no menciona presupuesto ni madurez de gobierno como condicion.

## LAB-090 — Capstone Enterprise D365

### Decisiones esperadas

- Marcar fronteras de dato/ownership explicitas entre CE, Field Service, Customer Insights y F&O en
  vez de tratarlos como un solo sistema.
- Declarar el estado real (Simulado/Sandbox real/Productivo controlado) de cada capacidad, sin
  inflar a "Productivo controlado" sin evidencia.
- Secuenciar el roadmap por dependencias reales de licencia/tenant, no por preferencia.
- Conectar cada entrada del decision log con evidencia concreta de los Labs 81-89, no inventar
  decisiones nuevas en el capstone.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| Arquitectura integrada | Cubre CE, Field Service, Customer Insights y F&O con limites de dato explicitos |
| Fit-Gap | 12 filas con decision defendible (estandar/configuracion/personalizacion/fuera de alcance) |
| Matriz de datos | Ownership claro por tabla (Account, Case, Work Order, Sales Order, Invoice, etc.) |
| Roadmap | Fases con dependencia de licencia/tenant que desbloquea cada una |
| Decision log | 8+ decisiones citando evidencia de Labs 81-89, no genericas |

### Solucion de referencia resumida

La situacion mas ambigua del capstone es integrar F&O con CE cuando ambos viven en entornos
Dataverse/Finance and Operations distintos y no todos los trials estan disponibles (Contact Center por
region, Customer Insights por licencia separada). La solucion de referencia no asume acceso: declara
explicitamente en el resumen ejecutivo que capacidades quedan como "diseño" por falta de trial y cuales
como "sandbox real", y el roadmap coloca la fase de integracion CE-F&O (dual-write) despues de la fase
en que ambos entornos esten aprovisionados y vinculados — no antes, aunque el negocio quiera verlo
"todo junto" desde la fase 1. El decision log cita, para la decision de dual-write, la evidencia
tecnica generada en los labs de integracion previos, no una afirmacion nueva sin sustento.

### Senales de alerta

- La arquitectura no distingue que producto es la fuente de verdad para cada tabla compartida.
- El roadmap fija fechas sin mencionar que licencia o trial las desbloquea.
- Alguna capacidad se marca "Productivo controlado" sin evidencia de tenant real que lo sustente.

## LAB-101 — CRM Functional Analyst Caso Integrado

### Decisiones esperadas

- Usar tablas estandar de Dataverse (Contact, Account, Lead, Opportunity, Case) antes de crear
  tablas custom como "Matricula" o "Plan de pago".
- Escribir historias de usuario con criterios de aceptacion verificables, no enunciados vagos.
- Justificar la decision tecnica (configuracion/Power Automate/JavaScript/plugin/integracion) con
  criterio (volumen, sincrono/asincrono, mantenibilidad), no con preferencia.
- Tratar la omnicanalidad (WhatsApp/chat) como diseño conceptual con dependencias de licenciamiento,
  no como si ya estuviera implementada.

### Artefactos minimos aceptables

| Artefacto | Referencia de calidad |
|---|---|
| Fit-Gap | 16+ filas (4 por proceso) con decision, riesgo y owner explicitos |
| Backlog Azure DevOps | Epics por proceso, Features y 10+ historias con criterios de aceptacion Given/When/Then |
| Modelo de datos | Tablas estandar primero, custom solo donde el estandar no alcanza, con matriz de roles |
| Atencion | Casos/colas/SLA/entitlements conectados con knowledge base |
| UAT | 10 casos (2+ por proceso) con al menos 3 defectos registrados y severidad |

### Solucion de referencia resumida

La decision mas dificil del caso es el entitlement de atencion: no todo estudiante matriculado debe
tener el mismo nivel de soporte si el programa lo justifica (ej. programas premium con SLA mas
estricto), pero condicionar el soporte por programa no puede traducirse en negar atencion academica
basica. La solucion de referencia separa el SLA base (aplicable a todos) de un SLA diferenciado por
programa solo para canales adicionales (ej. atencion prioritaria telefonica), y conecta la decision
tecnica de las alertas de retencion (Power Automate, por ser asincrono y basado en eventos con umbral
de dias sin actividad) con el criterio de mantenibilidad: un flujo de bajo codigo es mas sostenible
para el equipo de soporte funcional que un plugin, dado que la regla de negocio (N dias sin actividad)
cambia con frecuencia.

### Senales de alerta

- El backlog tiene historias sin criterios de aceptacion verificables.
- Se crean tablas custom para procesos que Dataverse ya cubre de forma estandar (ej. Contact, Case).
- La omnicanalidad se presenta como funcionalidad ya construida en vez de diseño con dependencias.
- La matriz de trazabilidad tiene requerimientos sin historia o historias sin caso de prueba.

## Checklist final comun

- [ ] El capstone declara estado real: Simulado, Sandbox real o Productivo controlado.
- [ ] Hay al menos un caso negativo.
- [ ] Hay evidencia revisable por otra persona.
- [ ] Los requisitos no funcionales aparecen explicitamente.
- [ ] La solucion separa decision, implementacion, evidencia y limite.
- [ ] Ningun entregable promete experiencia laboral o produccion si fue una practica.

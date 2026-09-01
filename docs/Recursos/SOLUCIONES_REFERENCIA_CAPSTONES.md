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

## Checklist final comun

- [ ] El capstone declara estado real: Simulado, Sandbox real o Productivo controlado.
- [ ] Hay al menos un caso negativo.
- [ ] Hay evidencia revisable por otra persona.
- [ ] Los requisitos no funcionales aparecen explicitamente.
- [ ] La solucion separa decision, implementacion, evidencia y limite.
- [ ] Ningun entregable promete experiencia laboral o produccion si fue una practica.

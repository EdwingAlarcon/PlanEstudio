---
moduleId: 61
title: "Dynamics 365 Customer Service Avanzado — SLA, Entitlements y Routing"
level: "d365"
certification: "Dynamics 365 Customer Service"
estimatedMinutes: 13
slug: "dynamics-365-customer-service-avanzado"
---
### 🎯 Objetivo
Configurar conceptualmente un proceso avanzado de Customer Service con casos, colas, contratos de servicio, entitlements, SLA, knowledge management y routing, produciendo una matriz de SLA operable y un árbol de decisión de agente defendibles en una entrevista de Consultor Funcional — distinguiendo configuración practicable con datos simulados de validación que requiere ambiente real.

### 📖 Conceptos Clave
- **Case lifecycle:** creación, clasificación, asignación, investigación, resolución, cierre y reapertura. Cada estado debe tener dueño y criterio de salida — un caso "En Investigación" sin dueño asignado es un caso perdido en la práctica, aunque exista en el sistema.
- **Queues:** bandejas operativas para distribuir trabajo por canal, producto, prioridad o región. Una cola no es solo almacenamiento; es un mecanismo de operación con owner, SLA de recogida y métrica de aging propia — una cola sin owner se convierte en un cementerio de casos.
- **Entitlements:** derechos de servicio que definen qué soporte recibe un cliente: número de casos incluidos, horas de soporte, cobertura (business hours vs. 24/7), canal permitido y vigencia (fecha inicio/fin del contrato). Un caso creado fuera de la vigencia del entitlement debería bloquearse o escalar a validación comercial, no procesarse igual que uno cubierto.
- **SLA — mecánica de cálculo real:** compromisos medibles como first response time y resolution time, calculados contra un calendario de atención (horario laboral + feriados por región), con reglas explícitas de pausa (ej. "esperando información del cliente") y reanudación, y acciones automáticas de warning (ej. al 75% del tiempo) y de incumplimiento (breach). Un SLA sin calendario cuenta horas nocturnas y fines de semana como tiempo de respuesta — infla artificialmente los breaches o los oculta, según el escenario.
- **Routing:** asignación de casos hacia cola o agente según reglas (producto, severidad, skill, carga actual). En escenarios modernos se apoya en unified routing (el mismo motor del Módulo 62/Contact Center), que requiere configuración real en Dynamics 365 Customer Service/Contact Center — diseñar la regla es practicable sin tenant, verificar que el motor la aplique correctamente no lo es.
- **Knowledge articles:** base de conocimiento para acelerar resolución y estandarizar respuestas. Deben tener ciclo de aprobación (borrador → revisión → publicado → obsoleto), owner y fecha de revisión — un artículo desactualizado que un agente sigue al pie de la letra es un riesgo de calidad de servicio, no un ahorro de tiempo.
- **Copilot para servicio:** puede resumir el historial de un caso y sugerir respuestas basadas en knowledge articles, pero requiere licencias/capacidades habilitadas y gobierno de datos — la sugerencia sigue necesitando validación del agente antes de enviarse al cliente, especialmente en casos con implicación legal o de garantía.
- **Métricas operativas:** backlog (casos abiertos sin resolver), aging (tiempo promedio abierto), first response breach, resolution breach, reopen rate (señal de resolución de baja calidad) y CSAT. Un equipo que solo mide breaches sin medir reopen rate puede estar "cumpliendo SLA" cerrando casos mal resueltos que vuelven a abrirse.
- **Requisitos reales de práctica:** diseñar tipos de caso, matrices de SLA y árboles de decisión puede hacerse sin tenant. Configurar SLA con calendario real, entitlements vigentes, colas operando y routing ejecutándose requiere Dynamics 365 Customer Service, licencias y datos de prueba reales.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Diseña 3 tipos de caso: Incidente crítico, Consulta funcional y Solicitud administrativa. Para cada uno define prioridad, cola inicial, entitlement aplicable y SLA.
2. Construye esta matriz de SLA para un contrato de soporte premium 24/7 y complétala con tu propio ejemplo para el tipo "Consulta funcional":

   | Métrica | Calendario | Tiempo objetivo | Condición de pausa | Acción de advertencia | Acción de incumplimiento |
   |---|---|---|---|---|---|
   | First response — Incidente crítico | 24/7 | 30 minutos | No aplica | Notificación a supervisor al 75% | Escalación automática a Nivel 2 + email a gerente de cuenta |
   | Resolution — Incidente crítico | 24/7 | 4 horas | Esperando información del cliente | Notificación al agente al 80% | Reasignación a especialista + registro de causa raíz obligatorio |
   | Consulta funcional (completa tú esta fila) | | | | | |
3. Diseña una regla de routing para enviar casos por producto y severidad. Si no tienes tenant, documenta la regla; si tienes ambiente real, configúrala y prueba con 3 casos.
4. Crea un árbol de decisión para el agente: validar cliente → confirmar entitlement vigente → consultar knowledge article → ¿resuelto? → si no, escalar con resumen y evidencia adjunta.
5. Responde estas 2 preguntas de entrevista/consultoría: (a) "Un cliente reporta que su incidente crítico llevaba 6 horas sin respuesta, pero el sistema no marca breach — ¿qué revisarías primero?" (respuesta esperada: calendario de atención y reglas de pausa mal configuradas, no el SLA en sí); (b) "¿Por qué reopen rate es una métrica de calidad y no solo de volumen?".
6. Define qué evidencia requiere ambiente real: pantallas de SLA ejecutándose, temporizador de caso, cola, routing y auditoría de escalamiento.

### 💼 Casos Reales de Negocio
Un área de soporte tenía SLA escritos en contrato, pero no configurados en Dynamics 365. Los agentes resolvían casos urgentes "por memoria" y los reportes mostraban tiempos inconsistentes porque nadie pausaba el SLA cuando esperaba respuesta del cliente — un caso que esperó 3 días una respuesta del cliente aparecía como "incumplido" en el reporte, penalizando al agente por algo fuera de su control. La remediación fue modelar entitlements, calendario de soporte, reglas de pausa, warning y escalation explícitas. El contrato dejó de ser un PDF archivado y pasó a ser lógica operativa auditable que el equipo podía defender ante el cliente con datos, no con excusas.

### ✅ Buenas Prácticas
- Definir calendarios de atención (horario, feriados, región) antes de activar cualquier SLA — sin calendario, el "tiempo objetivo" no significa nada verificable.
- Separar entitlements comerciales de SLA operativos: ambos se relacionan, pero uno define derecho de cobertura y el otro mide desempeño de respuesta.
- Documentar condiciones de pausa y reanudación con ejemplos reales, no solo el nombre de la condición.
- Usar colas con propósito claro y owner asignado; demasiadas colas sin dueño generan trabajo invisible que nadie revisa.
- Medir backlog, aging y reopen rate semanalmente, no solo breaches — un equipo sin breaches pero con reopen rate alto está resolviendo mal, no rápido.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| SLA sin calendario | Se configura tiempo objetivo genérico sobre reloj continuo | Crear calendario por horario/feriados/región antes de activar el SLA |
| Entitlement creado pero no aplicado al caso | Falta regla de validación operativa en el intake | Agregar paso obligatorio de verificación de entitlement al crear el caso |
| Cola usada como archivo muerto | No hay owner ni métrica de aging sobre la cola | Asignar responsable, aging y alerta de backlog por cola |
| Routing demasiado complejo desde el día uno | Se intenta automatizar sin datos históricos de volumen | Empezar con reglas simples y refinar con métricas reales de los primeros meses |

### 🧪 Criterios de Validación
- [ ] Diseñé tipos de caso con cola, entitlement y SLA
- [ ] Construí una matriz de SLA con pausa, advertencia y escalamiento, y completé la fila de "Consulta funcional"
- [ ] Respondí 2 preguntas de entrevista/consultoría sobre SLA mal configurado y reopen rate
- [ ] Definí reglas de routing verificables con casos de prueba
- [ ] Identifiqué qué evidencias requieren ambiente real Dynamics 365 Customer Service
- [ ] Relacioné este módulo con el Lab 68 (case-to-resolution) y el Lab 82 (SLA, entitlements y routing)


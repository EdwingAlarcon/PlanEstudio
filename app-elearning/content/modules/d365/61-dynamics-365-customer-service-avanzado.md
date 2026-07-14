---
moduleId: 61
title: "Dynamics 365 Customer Service Avanzado — SLA, Entitlements y Routing"
level: "d365"
certification: "Dynamics 365 Customer Service"
estimatedMinutes: 13
slug: "dynamics-365-customer-service-avanzado"
---
### 🎯 Objetivo
Configurar conceptualmente un proceso avanzado de Customer Service con casos, colas, contratos de servicio, entitlements, SLA, knowledge management y routing, distinguiendo configuración practicable con datos simulados de validación que requiere ambiente real.

### 📖 Conceptos Clave
- **Case lifecycle:** creación, clasificación, asignación, investigación, resolución, cierre y reapertura. Cada estado debe tener dueño y criterio de salida.
- **Queues:** bandejas operativas para distribuir trabajo por canal, producto, prioridad o región. Una cola no es solo almacenamiento; es un mecanismo de operación.
- **Entitlements:** derechos de servicio que definen qué soporte recibe un cliente: número de casos, horas, cobertura, canal y vigencia.
- **SLA:** compromisos medibles como first response y resolution time. Requieren calendario de atención, reglas de pausa/reanudación y acciones de escalamiento.
- **Routing:** asignación de casos hacia cola o agente según reglas. En escenarios modernos puede apoyarse en unified routing, que requiere configuración real en Dynamics 365 Customer Service/Contact Center.
- **Knowledge articles:** base de conocimiento para acelerar resolución y estandarizar respuestas. Deben tener ciclo de aprobación y owner.
- **Copilot para servicio:** puede resumir casos y sugerir respuestas, pero requiere licencias/capacidades habilitadas y gobierno de datos.
- **Métricas operativas:** backlog, aging, first response breach, resolution breach, reopen rate, CSAT y deflection rate.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Diseña 3 tipos de caso: Incidente crítico, Consulta funcional y Solicitud administrativa. Para cada uno define prioridad, cola inicial, entitlement aplicable y SLA.
2. Escribe una matriz de SLA con columnas: métrica, calendario, tiempo objetivo, condición de pausa, acción de advertencia y acción de incumplimiento.
3. Diseña una regla de routing para enviar casos por producto y severidad. Si no tienes tenant, documenta la regla; si tienes ambiente real, configúrala y prueba con 3 casos.
4. Crea un árbol de decisión para el agente: validar cliente, confirmar entitlement, consultar knowledge article, resolver o escalar.
5. Define qué evidencia requiere ambiente real: pantallas de SLA ejecutándose, temporizador de caso, cola, routing y auditoría de escalamiento.

### 💼 Casos Reales de Negocio
Un área de soporte tenía SLA escritos en contrato, pero no configurados en Dynamics 365. Los agentes resolvían casos urgentes "por memoria" y los reportes mostraban tiempos inconsistentes porque nadie pausaba el SLA cuando esperaba respuesta del cliente. La remediación fue modelar entitlements, calendario de soporte, reglas de pausa, warning y escalation. El contrato dejó de ser un PDF y pasó a ser lógica operativa auditable.

### ✅ Buenas Prácticas
- Definir calendarios de atención antes de activar SLA.
- Separar entitlements comerciales de SLA operativos: ambos se relacionan, pero no son lo mismo.
- Documentar condiciones de pausa y reanudación con ejemplos reales.
- Usar colas con propósito claro; demasiadas colas generan trabajo invisible.
- Medir backlog y aging semanalmente, no solo breaches.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| SLA sin calendario | Se configura tiempo objetivo genérico | Crear calendario por horario/feriados/región |
| Entitlement creado pero no aplicado al caso | Falta regla de validación operativa | Agregar paso obligatorio en intake o automatización |
| Cola usada como archivo muerto | No hay owner ni métrica | Asignar responsable, aging y alerta de backlog |
| Routing demasiado complejo desde el día uno | Se intenta automatizar sin datos históricos | Empezar con reglas simples y revisar con métricas |

### 🧪 Criterios de Validación
- [ ] Diseñé tipos de caso con cola, entitlement y SLA
- [ ] Documenté pausa, advertencia y escalamiento del SLA
- [ ] Definí reglas de routing verificables con casos de prueba
- [ ] Identifiqué qué evidencias requieren ambiente real Dynamics 365 Customer Service


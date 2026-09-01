---
id: lab-77
title: "JR-007 — Customer Service Specialist Job Simulation"
level: "N3"
duration: 240
product: ["Dynamics 365 Customer Service", "Dataverse", "Power Automate"]
certifications: ["PL-200 (retirado 31 ago 2026)", "Especialista Dynamics 365 CE"]
role: ["CRM Functional", "Customer Service Specialist"]
prerequisites:
  - "Módulo 20 estudiado: Dynamics 365 CE Sales y Customer Service"
  - "Lab 68 revisado: Customer Service Case-to-Resolution"
  - "Ruta Job-Ready CRM Functional revisada"
---

# Lab 77 — JR-007: Customer Service Specialist Job Simulation

## Objetivo

Simular una prueba laboral de Customer Service: casos, colas, SLA, entitlements, knowledge base,
dashboard, soporte funcional y UAT.

## Perfil laboral y skill validado

**Vacante objetivo:** CRM Functional Consultant / Customer Service Specialist que configura y opera
el ciclo de vida de casos con SLA diferenciado por plan de cliente.

**Skill concreto que valida:** capacidad de conectar SLA, entitlements y colas en un mismo diseño
coherente (no como piezas aisladas) y de construir un dashboard que responda preguntas reales de un
supervisor, no solo mostrar conteos.

**Nota de alcance:** este lab comparte dominio con Lab 68 (Case-to-Resolution) y Lab 82; la
diferencia es que aquí el entregable es una simulación de prueba laboral cronometrada con UAT y
dashboard operativo, no el diseño conceptual de SLA/colas en sí — si ya completaste el Lab 68, reusa
su diseño de colas como base y enfócate en el dashboard y el UAT de este lab.

## Escenario de negocio

**Empresa ficticia:** HelpDesk Regional — 3 planes de cliente, ~85 casos abiertos por semana entre
las 3 colas.

El equipo de soporte necesita demostrar que puede gestionar casos de clientes premium y estándar,
cumplir SLA y dar visibilidad al supervisor.

## Rol del estudiante

Actúas como consultor funcional de Dynamics 365 Customer Service.

## Herramientas necesarias

- Dynamics 365 Customer Service o diseño funcional equivalente.
- Markdown/Excel para UAT y dashboard.
- Power Automate opcional para notificaciones.

## Qué puedes hacer en tenant real vs. qué debes simular

- **Con tenant real:** configura colas, SLA y entitlements reales, crea los 5 casos de la tabla de
  datos de prueba y ejecuta el UAT contra el sistema configurado.
- **Sin tenant:** documenta el diseño completo (colas, SLA, entitlements, dashboard) y ejecuta el UAT
  como "resultado esperado" en vez de "resultado observado", dejándolo explícito.

## Datos de prueba

Usa estos 5 casos para ejecutar el UAT del Paso 5:

| Caso | Cliente | Plan | Tipo | Hora de creación | Resultado esperado |
|---|---|---|---|---|---|
| C-001 | Acme Corp | Premium | Incidente técnico | 09:00 | Primera respuesta antes de 09:30 |
| C-002 | Beta SA | Estándar | Consulta de facturación | 09:00 | Primera respuesta antes de 13:00 |
| C-003 | Acme Corp | Premium | Solicitud de información | 14:50 (10 min antes del cierre del entitlement) | Bloqueado o escalado por entitlement agotado |
| C-004 | Gamma Ltda | Estándar | Incidente técnico | Viernes 17:00 | SLA pausado fuera de horario, retoma el lunes |
| C-005 | Beta SA | Estándar | Consulta de facturación | 08:00, sin resolver a las 56h | Aparece como "vencido" en el dashboard |

## Entregables

- Diseño de ciclo case-to-resolution.
- Configuración o diseño de colas.
- Política de SLA.
- Entitlements.
- Knowledge articles.
- Dashboard operativo.
- Casos UAT ejecutados contra los 5 datos de prueba.

## Pasos detallados

### Paso 1 — Casos y colas

Define tres tipos de caso:

- Incidente técnico.
- Consulta de facturación.
- Solicitud de información.

Asigna colas y criterios de prioridad. Verifica que los 5 casos de la tabla anterior encajen en tu
diseño de colas.

### Paso 2 — SLA y entitlements

Define, incluyendo pausa/reanudación fuera de horario laboral (ver caso C-004):

| Cliente | Plan | Casos incluidos | SLA primera respuesta | SLA resolución |
|---|---|---|---|---|
| Premium | Premium | 50/año | 30 min | 8 h |
| Estándar | Estándar | 20/año | 4 h | 48 h |

Documenta explícitamente la regla de pausa: el reloj de SLA se detiene fuera del horario laboral
configurado y se reanuda al iniciar el siguiente turno.

### Paso 3 — Knowledge base

Escribe dos artículos:

- Restablecimiento de acceso.
- Consulta de estado de factura.

Define cuándo el agente debe sugerir cada artículo (ej. al caso C-002 le aplicaría el segundo).

### Paso 4 — Dashboard

Incluye KPIs, calculados sobre los 5 casos de prueba como si fueran la muestra real:

- Casos abiertos por cola.
- Casos vencidos (C-005 debe aparecer aquí).
- Cumplimiento SLA.
- Tiempo promedio de resolución.
- Artículos usados.

### Paso 5 — UAT

Ejecuta (o proyecta, ver arriba) los 5 casos UAT de la tabla de datos de prueba con resultado
esperado y evidencia.

## Decisiones que debes tomar

- **Caso C-003 (entitlement agotado a 10 minutos de cerrarse):** ¿el sistema debe bloquear la
  creación del caso o permitirlo y alertar para revisión manual? Justifica con el impacto en
  satisfacción del cliente Premium.
- **Caso C-004 (SLA pausado fuera de horario):** ¿qué pasa si el cliente Premium pagó por soporte
  24/7 pero el plan Estándar no? Documenta si tu configuración de horario de servicio distingue por
  plan.
- **Caso C-005 (vencido):** ¿el dashboard debe notificar automáticamente al supervisor o solo
  mostrarlo pasivamente? Justifica según el rol de "Dashboard" en el Paso 4.

## Criterios de validación

- [ ] El proceso cubre creación, asignación, resolución y cierre.
- [ ] SLA y entitlements están conectados y resuelven los 5 casos de prueba.
- [ ] Hay knowledge base funcional o diseñada.
- [ ] El dashboard responde preguntas del supervisor usando los 5 casos como muestra.
- [ ] UAT tiene datos y resultados esperados para cada uno de los 5 casos.

## Rúbrica

| Criterio | Peso |
|---|---|
| Proceso funcional | 35% |
| SLA/colas | 25% |
| Reporting | 20% |
| Soporte/UAT | 20% |

## Preguntas de entrevista asociadas

- "¿Qué diferencia hay entre una cola y un rol de seguridad?" — respuesta esperada: la cola organiza
  trabajo pendiente por asignar; el rol de seguridad controla qué puede ver/hacer un usuario — no son
  intercambiables.
- "Un cliente Premium se queda sin casos incluidos en su entitlement a mitad de un incidente crítico
  — ¿qué haces?" — respuesta esperada: reconocer el trade-off entre bloquear estrictamente y el
  riesgo comercial, y proponer una alerta a supervisión en vez de bloqueo silencioso.
- "¿Por qué el SLA se pausa fuera de horario y qué pasa si no lo configuras así?" — respuesta
  esperada: sin pausa, casos creados un viernes en la tarde aparecerían falsamente vencidos el lunes.

## Qué no debe sobreprometerse

Este lab valida diseño funcional de Customer Service con datos de prueba controlados; no reemplaza
la validación con volumen real de casos ni la afinación de SLA que solo aparece con datos de
producción a lo largo de varias semanas.

## Errores comunes

- Confundir cola con rol de seguridad.
- Definir SLA sin pausa/reanudación.
- No documentar entitlement agotado.
- Crear dashboard sin decisiones accionables.

## Reto adicional

Diseñá un cuarto tipo de caso (ej. "Reclamo de facturación") que cruce con el proceso de Sales — un
caso que, si no se resuelve en cierto tiempo, debería generar una alerta hacia el equipo comercial.
Documentá qué dato compartido entre Customer Service y Sales hace posible esa alerta.

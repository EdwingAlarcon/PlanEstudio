---
id: lab-101
title: "JR-013 — CRM Functional Analyst: Caso Integrado (Admisión, Servicio, Retención y Cobranza)"
level: "N3"
duration: 300
product: ["Dynamics 365 Sales", "Dynamics 365 Customer Service", "Dataverse", "Power Automate", "Azure DevOps"]
certifications: ["PL-200", "Especialista Dynamics 365 CE"]
role: ["CRM Functional", "Business Analyst", "Functional Consultant"]
prerequisites:
  - "Lab 66 revisado: Sales Lead-to-Cash"
  - "Lab 68 revisado: Customer Service Case-to-Resolution"
  - "Lab 62 revisado: Capstone Consultor Funcional (fit-gap, backlog, UAT)"
  - "Ruta Job-Ready CRM Functional revisada"
---

# Lab 101 — JR-013: CRM Functional Analyst — Caso Integrado

## Objetivo

Simular, en un solo caso funcional continuo, el trabajo real de un Analista Funcional CRM/Dynamics
365: levantar requerimientos, definir AS-IS/TO-BE/Fit-Gap, construir un backlog funcional en Azure
DevOps con historias de usuario y criterios de aceptación, configurar el modelo CRM (tablas,
formularios, BPF, seguridad), diseñar el proceso de servicio (casos, colas, SLA, entitlements,
knowledge base), decidir entre configuración nativa/Power Automate/JavaScript/plugin/integración,
aplicar reglas de calidad de datos y reporting, ejecutar UAT con matriz de pruebas y auditoría de
configuración, y documentar soporte, adopción y roadmap — todo trazado de punta a punta.

## Nota de alcance (léela antes de empezar)

Este es un **caso funcional documentado**, no una implementación productiva verificada contra un
tenant en vivo. Azure DevOps se usa aquí como estructura de backlog (Epics/Features/User Stories),
igual que lo usaría un analista funcional real para priorizar y trazar trabajo — no se simula una
integración técnica con Dynamics 365. Si tienes acceso a un tenant trial y a un proyecto de Azure
DevOps, ejecuta los pasos de configuración ahí; si no, documenta cada entregable como diseño
funcional explícito, sin presentarlo como configuración verificada en producción.

## Escenario de negocio

**Empresa ficticia:** Instituto Técnico Andino (ITA), institución educativa con 4 sedes que ofrece
programas técnicos y diplomados.

ITA gestiona hoy su relación con estudiantes en hojas de cálculo y correo, sin visibilidad de punta
a punta. La dirección académica pide modernizar cuatro procesos con Dynamics 365 CE:

1. **Admisión:** de prospecto interesado a matrícula confirmada.
2. **Atención/servicio:** consultas, incidencias académicas y administrativas durante el curso.
3. **Retención:** identificar estudiantes en riesgo de deserción y actuar antes de que abandonen.
4. **Cobranza:** seguimiento de pagos de matrícula y pensiones, y gestión de mora.

## Rol del estudiante

Actúas como Analista Funcional CRM contratado para liderar el discovery, diseñar la solución
funcional y dejar el backlog listo para que un equipo de implementación lo ejecute.

## Herramientas necesarias

- Dynamics 365 Customer Service/Sales o diseño funcional equivalente en Dataverse.
- Un proyecto de Azure DevOps (Boards) real o una tabla equivalente en Markdown/Excel si no
  tienes acceso — documenta explícitamente cuál usaste.
- Markdown/Excel para matrices de fit-gap, pruebas y trazabilidad.

## Entregables

- Documento de requerimientos con AS-IS y TO-BE.
- Matriz Fit-Gap (estándar / configuración / personalización / fuera de alcance).
- Backlog funcional en Azure DevOps (o equivalente documentado): Epics, Features, User Stories con
  criterios de aceptación.
- Modelo de datos CRM (tablas, relaciones) para los cuatro procesos.
- Matriz de roles/seguridad.
- Diseño de formularios, vistas y BPF para admisión.
- Diseño de casos, colas, SLA y entitlements para atención.
- Diseño de knowledge base.
- Flujo(s) de Power Automate para alertas de retención y cobranza.
- Matriz de calidad de datos (campos obligatorios, validaciones, duplicados).
- Matriz de integraciones/API awareness (pasarela de pagos, sistema académico).
- Matriz de pruebas y casos UAT con registro de defectos.
- Dashboard de indicadores.
- Documento de soporte/adopción y roadmap de evolución.
- Presentación ejecutiva de 5-10 minutos.

## Pasos detallados

### Paso 1 — Levantamiento de requerimientos y AS-IS

Documenta el proceso actual entrevistando (de forma simulada, con supuestos explícitos y
razonables) a: coordinador de admisión, agente de atención, coordinador de retención y analista de
cobranza. Para cada rol registra: qué hace hoy, en qué herramienta, qué le falta.

- Redacta el AS-IS de cada uno de los 4 procesos en 1 párrafo + 1 diagrama de flujo simple.
- Identifica al menos 3 puntos de dolor por proceso (12 en total).

### Paso 2 — TO-BE y Fit-Gap

Define el TO-BE de cada proceso sobre Dynamics 365 CE estándar antes de personalizar.

Construye una matriz Fit-Gap de al menos 16 filas (4 por proceso) con columnas: `Requerimiento |
Estándar cubre | Gap | Decisión (configuración/Power Automate/JavaScript/plugin/integración/fuera
de alcance) | Riesgo | Owner`.

### Paso 3 — Backlog funcional en Azure DevOps

Estructura el backlog en 3 niveles:

- **Epics** (uno por proceso: Admisión, Atención, Retención, Cobranza).
- **Features** (2-3 por Epic).
- **User Stories** con formato `Como <rol> quiero <capacidad> para <beneficio>` y **criterios de
  aceptación** verificables (formato Given/When/Then o checklist), mínimo 10 historias en total
  distribuidas entre los 4 procesos.

Prioriza el backlog (MoSCoW o valor/esfuerzo) y documenta qué 3 historias irían en el primer
sprint y por qué.

### Paso 4 — Modelo de datos y seguridad

Diseña las tablas necesarias (usa tablas estándar de Dataverse cuando existan: Contact, Account,
Lead, Opportunity, Case; agrega tablas custom solo donde el estándar no alcance, por ejemplo
"Matrícula" o "Plan de pago").

- Diagrama de relaciones con cardinalidad.
- Matriz de roles/seguridad: Coordinador Admisión, Agente Atención, Coordinador Retención, Analista
  Cobranza, Supervisor — qué tabla ve/edita/elimina cada uno.

### Paso 5 — Formularios, vistas y BPF de Admisión

- Diseña el formulario y la vista de "Prospecto/Matrícula" con los campos mínimos necesarios.
- Diseña un Business Process Flow de 5 etapas: Prospecto → Documentación → Evaluación → Matrícula
  → Bienvenida, con al menos una condición de rama (por ejemplo, beca vs. pago regular).

### Paso 6 — Atención: casos, colas, SLA, entitlements, knowledge base

- Define 3 tipos de caso (académico, administrativo, pagos) con colas y criterios de asignación.
- Define SLA con tiempos de primera respuesta y resolución diferenciados por tipo de caso.
- Define entitlement: ¿todo estudiante matriculado tiene el mismo nivel de soporte, o varía por
  programa?
- Escribe 2 artículos de knowledge base (ej. "Cómo solicitar un certificado", "Cómo reportar un
  pago no reflejado") y define cuándo el agente debe sugerirlos.

### Paso 7 — Retención y cobranza con Power Automate

- Diseña un flujo de Power Automate que detecte señales de riesgo de deserción (ej. caso académico
  abierto + más de N días sin actividad) y cree una tarea de seguimiento para el coordinador de
  retención.
- Diseña un flujo equivalente para cobranza: pago vencido → notificación escalonada → tarea de
  gestión de mora.
- Para cada flujo, documenta trigger, condiciones, acciones y manejo de error (qué pasa si el paso
  falla).

### Paso 8 — Calidad de datos, reporting e integraciones

- Matriz de calidad de datos: campos obligatorios, formato válido (ej. email, teléfono), regla de
  duplicados para Contact/Account.
- Define 5 indicadores para el dashboard ejecutivo (ej. tasa de conversión admisión, cumplimiento
  SLA, estudiantes en riesgo, mora promedio, satisfacción).
- Matriz de integraciones/API awareness: pasarela de pagos y sistema académico — qué dato entra/sale,
  en tiempo real o por lote, y qué mecanismo usarías (Power Automate, Azure Logic Apps, API
  personalizada) sin implementarlo.

### Paso 9 — Auditoría de configuración y decisión técnica

Para 5 requerimientos concretos del backlog, documenta explícitamente **por qué** elegiste
configuración nativa, Power Automate, JavaScript, plugin o integración externa — no solo la
decisión, sino el criterio (complejidad, volumen, síncrono vs. asíncrono, mantenibilidad).

Audita tu propio diseño: lista 3 configuraciones que un consultor externo debería revisar antes de
ir a producción (ej. seguridad de campo, duplicidad de reglas de negocio, SLA sin pausa/reanudación).

### Paso 10 — Omnicanalidad conceptual

Documenta, sin implementarlo, cómo se vería agregar un canal de WhatsApp o chat para atención de
estudiantes: qué cambiaría en el enrutamiento de casos, qué requeriría de licenciamiento/proveedor
externo, y qué feedback loop tendría con las colas ya diseñadas en el Paso 6.

### Paso 11 — UAT, matriz de pruebas y riesgos

- Construye una matriz de trazabilidad: `Requerimiento → Historia de usuario → Configuración →
  Caso de prueba`.
- Escribe 10 casos UAT (mínimo 2 por proceso) con pasos, resultado esperado y resultado obtenido
  (simulado), marcando pass/fail.
- Registra al menos 3 defectos encontrados en UAT con severidad y estado.
- Lista 3 riesgos del proyecto (adopción, calidad de datos migrados, dependencia de integración
  externa) con plan de mitigación.

### Paso 12 — Documentación funcional, soporte y roadmap

- Redacta un documento de soporte funcional: qué hace el equipo de soporte ante un caso mal
  enrutado o un SLA incumplido.
- Redacta un plan de adopción: capacitación por rol, canal de dudas, criterio de éxito.
- Propón un roadmap de evolución en 3 fases (ej. fase 1: admisión + atención; fase 2: retención;
  fase 3: cobranza + integraciones).
- Prepara una presentación ejecutiva de 5-10 minutos que resuma AS-IS, TO-BE, fit-gap, backlog,
  UAT, riesgos y roadmap.

## Criterios de validación

- [ ] AS-IS y TO-BE cubren los 4 procesos (admisión, atención, retención, cobranza).
- [ ] La matriz Fit-Gap tiene al menos 16 filas con decisión y riesgo explícitos.
- [ ] El backlog en Azure DevOps (o equivalente documentado) tiene Epics, Features y al menos 10
      historias de usuario con criterios de aceptación verificables.
- [ ] El modelo de datos usa tablas estándar de Dataverse antes de crear tablas custom.
- [ ] La matriz de roles/seguridad cubre los 5 roles del escenario.
- [ ] El BPF de admisión tiene 5 etapas con al menos una condición de rama.
- [ ] El diseño de atención conecta casos, colas, SLA, entitlements y knowledge base.
- [ ] Los flujos de Power Automate de retención y cobranza documentan trigger, condiciones y manejo
      de error.
- [ ] La matriz de calidad de datos define campos obligatorios, validaciones y regla de duplicados.
- [ ] La decisión técnica (configuración/Power Automate/JS/plugin/integración) está justificada
      para al menos 5 requerimientos, no solo enunciada.
- [ ] La omnicanalidad está documentada como diseño conceptual, no presentada como implementación
      real.
- [ ] Hay 10 casos UAT con resultado y al menos 3 defectos registrados con severidad.
- [ ] La matriz de trazabilidad conecta requerimiento → historia → configuración → prueba.
- [ ] El documento de soporte/adopción y el roadmap están completos.
- [ ] La presentación ejecutiva resume el caso completo en 5-10 minutos.

## Rúbrica

| Criterio | Peso |
|---|---|
| AS-IS/TO-BE y Fit-Gap | 15% |
| Backlog Azure DevOps (historias + criterios de aceptación) | 20% |
| Modelo de datos, seguridad, formularios y BPF | 15% |
| Atención (casos, colas, SLA, entitlements, KB) | 15% |
| Power Automate (retención y cobranza) | 10% |
| Calidad de datos, reporting e integraciones awareness | 10% |
| UAT, matriz de pruebas y trazabilidad | 10% |
| Documentación, soporte, adopción y roadmap | 5% |

## Evidencia esperada

- Documento de requerimientos (AS-IS/TO-BE).
- Matriz Fit-Gap.
- Backlog de Azure DevOps exportado o documentado (Epics/Features/Historias con criterios de
  aceptación).
- Modelo de datos y matriz de roles/seguridad.
- Diseño de formularios, vistas y BPF.
- Diseño de casos/colas/SLA/entitlements/knowledge base.
- Flujos de Power Automate documentados.
- Matriz de calidad de datos y matriz de integraciones awareness.
- Matriz de trazabilidad y 10 casos UAT con defectos registrados.
- Documento de soporte/adopción y roadmap.
- Presentación ejecutiva de 5-10 minutos.

## Competencias desarrolladas

- Levantamiento de requerimientos y AS-IS/TO-BE.
- Fit-Gap y backlog funcional en Azure DevOps.
- Historias de usuario y criterios de aceptación.
- Configuración CRM (tablas, formularios, BPF, seguridad).
- Diseño de Customer Service (casos, colas, SLA, entitlements, KB).
- Decisión configuración vs. Power Automate vs. JavaScript vs. plugin vs. integración.
- Calidad de datos y reporting.
- UAT, matriz de pruebas y trazabilidad.
- Soporte funcional, adopción y roadmap.

## Errores comunes

- Escribir historias de usuario sin criterios de aceptación verificables ("como usuario quiero
  gestionar casos" no es una historia evaluable).
- Presentar el backlog de Azure DevOps como si fuera una integración técnica en vez de una
  herramienta de gestión de trabajo.
- Personalizar tablas o procesos antes de verificar si el estándar de Dataverse ya los cubre.
- Diseñar SLA y entitlements sin conectar con las colas y sin regla de pausa/reanudación.
- Tratar la omnicanalidad (WhatsApp/chat) como si ya estuviera implementada en vez de como diseño
  conceptual con dependencias de licenciamiento reales.
- Entregar una matriz de trazabilidad incompleta (requerimiento sin historia, historia sin prueba).
- Justificar la decisión técnica (configuración/Power Automate/JS/plugin) solo con preferencia
  personal en vez de con criterio (volumen, síncrono/asíncrono, mantenibilidad).

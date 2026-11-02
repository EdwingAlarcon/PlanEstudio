---
moduleId: 38
title: "Liderazgo Técnico y Gestión de Proyectos"
level: "arquitecto"
certification: "Arquitectura Power Platform"
estimatedMinutes: 22
practiceMinutes: 420
slug: "liderazgo-tecnico-y-gestion-de-proyectos"
lastVerified: "2026-11"
---
### 🎯 Objetivo
Desarrollar las competencias de liderazgo técnico y consultoría funcional necesarias para el rol de Solution Architect: conducir workshops de descubrimiento, documentar requerimientos, escribir historias de usuario con criterios de aceptación, estimar proyectos con la incertidumbre a la vista, gestionar riesgos, comunicar decisiones técnicas al C-suite, y liderar equipos de Fusion Development. Al terminar, cada decisión de alcance, estimación y riesgo que tomes está escrita con sus razones y sus consecuencias, y sabes defenderla ante un sponsor que pide "todo, ya y por menos".

> **Cómo está organizado este módulo:** en Arquitecto el "construir sin pasos" se convierte en **decidir y defender**. Aquí casi no hay clics: lo que se construye son **decisiones escritas** (un Fit-Gap, una estimación con rango, un change request, un Risk Register, un status report, una matriz de trazabilidad). Cada microlección tiene un concepto breve, una decisión para tomar antes de leer la respuesta, una práctica con un caso continuo y una tabla de **evidencia** (el dato o la frase exacta que escribiste, no un "sí, lo hice"). Después viene un **diagnóstico síntoma primero** y el cierre es un **reto de transferencia** con otras restricciones. En los retos de decisión **no hay una sola respuesta correcta**: se evalúa que la decisión cumpla los criterios y que sus trade-offs estén escritos.
>
> **Antes de empezar:**
> - **No necesitas tenant.** Todo el módulo se hace con el caso continuo de abajo, en una hoja de cálculo y un documento. Si quieres practicar la herramienta, el backlog de la Microlección 5 se puede cargar en **Azure DevOps Boards** (Epics → Features → User Stories → Tasks), como en el Módulo 19.
> - **Viene del Módulo 18** (ADR y decisiones de arquitectura) y del **Módulo 31** (Risk Register y capability map). Si vas por la ruta Consultor Funcional, el [LAB-62](/labs/lab-62-capstone-consultor-funcional-proyecto-completo) pide el ciclo funcional completo con otro escenario; la evidencia de este módulo te sirve de base.
> - **De dónde sale lo verificable:** Microsoft no publica una metodología de gestión de proyectos para Power Platform, pero sí la guía de implementación de Dynamics 365 con **Success by Design** y su capítulo de **gobierno de proyecto**, que valen también para proyectos de Power Platform. Donde el módulo cita a Microsoft, enlaza la página; el resto (MoSCoW, story points, RACI) es práctica estándar de la industria, no una regla de Microsoft.

**Caso continuo — "CRM Comercial" para Distribuidora Andina.** Un distribuidor de insumos industriales con 120 vendedores quiere un CRM sobre Power Platform y Dynamics 365 Sales, integrado con su ERP (SAP) para ver stock y crédito antes de comprometer una entrega. El sponsor es el Director Comercial; el CFO aprueba el presupuesto. Lista de pedidos recogida en la primera reunión (sin depurar):

| # | Pedido del cliente |
|---|---|
| 1 | Gestionar oportunidades y su pipeline por etapa |
| 2 | Cotizaciones con firma digital del cliente |
| 3 | Ver stock y bloqueo de crédito de SAP en la oportunidad, en tiempo real |
| 4 | App móvil para vendedores en campo, que funcione sin conexión |
| 5 | Aprobación del gerente para descuentos mayores al 15% |
| 6 | Tablero ejecutivo de pipeline por región |
| 7 | Predecir qué clientes pueden dejar de comprar |
| 8 | Chatbot para que los clientes consulten el estado de su pedido |
| 9 | Integración con el sistema de nómina para comisiones |
| 10 | Migrar 8 años de historial del CRM antiguo |
| 11 | Cada vendedor ve solo sus cuentas; el gerente, las de su región |
| 12 | Que "funcione igual que el Excel de hoy" |

### 📖 Conceptos Clave
- **Discovery Workshop:** sesión estructurada de 1-3 días con stakeholders de negocio y técnicos cuyo objetivo es entender profundamente el contexto, procesos actuales, puntos de dolor y visión futura ANTES de proponer ninguna tecnología. Un Discovery bien ejecutado produce: mapa del proceso AS-IS, lista de requerimientos priorizada (MoSCoW), Risk Register inicial, y consenso sobre el MVP. Un arquitecto que propone tecnología antes del Discovery está vendiendo, no diseñando. Herramientas típicas: Miro/Whiteboard para mapear procesos, Confluence/SharePoint para documentar, y una agenda estructurada con facilitación activa.
- **Success by Design:** marco de Microsoft, nacido de la experiencia de FastTrack, para implementar Dynamics 365 (y, en su versión actual, soluciones de Power Platform). Divide el ciclo en cinco fases independientes de la metodología: **Discover**, **Initiate**, **Implement**, **Prepare** y **Operate**. La **Solution Blueprint Review** empieza ya en **Discover**, para encontrar riesgos de arquitectura antes de que las decisiones sean caras de revertir; de sus hallazgos salen las **Implementation Reviews** (modelo de datos, seguridad, integración, ALM, pruebas), y la **Go live Readiness Review** es la última parada antes de producción. Los hallazgos se clasifican en **assertions** (lo que se hace bien), **risks** (lo que podría afectar si no se mitiga) e **issues** (lo que ya está afectando) ([Learn: Success by Design](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/success-by-design)).
- **Fit-Gap Analysis:** análisis sistemático que mapea cada requerimiento del cliente contra las capacidades nativas de Power Platform, clasificando cada uno en: Fit (cubierto nativamente sin desarrollo), Partial Fit (cubierto con configuración adicional o customización menor), Gap (no existe en la plataforma y requiere desarrollo custom o integración externa), o Exclusión (fuera del alcance del proyecto). El Fit-Gap es el documento que justifica por qué se necesita desarrollo custom y cuánto costará; sin él, los clientes asumen que "todo es configuración".
- **Solution Blueprint:** documento de arquitectura de alto nivel (10-20 páginas) que precede al desarrollo y describe: el diagrama de componentes del sistema, las decisiones arquitectónicas clave con sus justificaciones (ADRs), la estrategia de integración, el modelo de seguridad, y el plan de ambientes. Es el contrato técnico entre el arquitecto y el equipo de desarrollo; sin Blueprint, cada desarrollador toma decisiones de arquitectura de forma independiente y el resultado es incoherente.
- **Statement of Work (SoW):** documento legal-técnico que define con precisión el alcance del proyecto: qué se construirá (incluyendo criterios de aceptación por entregable), qué explícitamente está excluido del scope, el calendario de entrega, los roles y responsabilidades de cada parte, los precios y condiciones de pago, y el proceso de cambios de alcance. Un SoW bien redactado previene la mayoría de las disputas de proyecto. La sección de exclusiones es tan importante como la de inclusiones; lo que no está en el SoW, el cliente asumirá que está incluido.
- **Risk Register:** registro estructurado de todos los riesgos identificados del proyecto con: descripción del riesgo, probabilidad (1-5), impacto en costo/tiempo/calidad (1-5), score (P×I), categoría (técnico/negocio/regulatorio/equipo), plan de mitigación específico, plan de contingencia si el riesgo se materializa, dueño del riesgo, y estado actual. Se revisa semanalmente en la reunión de steering. La guía de implementación de Microsoft advierte que un Risk Register solo sirve si se actualiza: enfocarse en riesgos relevantes (no triviales), revisarlos con regularidad, alinear su prioridad con la del proyecto y dar a cada uno un dueño y acciones claras ([Learn: estructuras clásicas de gobierno](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/project-governance-classic-structures)). En proyectos de Power Platform, los riesgos más comunes son: integración con sistemas legacy sin API documentada, cambios en el modelo de licenciamiento, y disponibilidad de usuarios para UAT.
- **Steering group, status report y stage gates:** el **steering group** (sponsor, stakeholders de negocio y líderes del proyecto) dirige el proyecto, y para hacerlo necesita un **status report** que responda tres preguntas: ¿vamos en plazo?, ¿cuáles son los riesgos o problemas principales?, ¿qué necesitamos del steering?; en lenguaje simple, con evidencia, comparando lo real contra lo planeado y proponiendo acciones. Los **stage gates** son los puntos de control entre fases, con criterios de entrada y salida medibles que no se saltan por presión u optimismo ([Learn: estructuras clásicas de gobierno](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/project-governance-classic-structures)). Microsoft recomienda definir el modelo de gobierno lo antes posible, idealmente en la fase **Initiate**, y revisarlo durante todo el proyecto ([Learn: gobierno de proyecto](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/project-governance)).
- **WBS (Work Breakdown Structure):** descomposición jerárquica del proyecto en entregables, módulos y tareas estimables de forma independiente, hasta el nivel donde cada tarea tenga una duración de 1-5 días. La WBS es la base para la estimación y el plan de proyecto; sin ella, la estimación es una conjetura. Herramienta: Microsoft Project, Azure DevOps Boards (con Epics → Features → User Stories → Tasks), o una hoja Excel estructurada. El nivel de detalle apropiado depende de la fase: en propuesta comercial, nivel módulo es suficiente; en planificación de sprint, nivel tarea.
- **RACI Matrix:** tabla que asigna para cada entrega o decisión del proyecto quién es: Responsible (quien hace el trabajo), Accountable (quien aprueba y tiene la responsabilidad final — solo 1 persona), Consulted (quien debe ser consultado antes de decidir — su input importa), e Informed (quien debe ser notificado del resultado). En proyectos de Power Platform, las confusiones más comunes son entre Accountable y Responsible (el cliente suele querer ser R y A en todo) y sobre quién aprueba los cambios de scope.
- **Velocity (Agile):** métrica que mide la capacidad real del equipo de desarrollo medida en story points completados por sprint (tipicamente 2 semanas). Los primeros 2-3 sprints se usan para calibrar la velocidad real del equipo; no se compromete con fechas hasta tener al menos 2 sprints de historial. Una velocidad de 20 story points/sprint con un backlog de 200 story points significa aproximadamente 10 sprints (20 semanas) para completar el backlog. La velocidad es una propiedad del equipo específico, no una constante universal.
- **Technical Debt:** acumulación de decisiones de implementación subóptimas tomadas para ganar velocidad a corto plazo que generan costo mayor a largo plazo (más tiempo de mantenimiento, más bugs, más dificultad para agregar features). En Power Platform: hardcodear valores que deberían ser Environment Variables, usar flujos de Power Automate sin error handling, o crear tablas de Dataverse sin pensar en el modelo relacional. El Technical Debt debe ser visible y cuantificado (como una lista en Azure DevOps) para que el equipo pueda pagarlo en sprints dedicados antes de que se vuelva impagable.
- **Change Request Process:** proceso formal documentado en el SoW para gestionar solicitudes de cambio al scope aprobado. Cuando el cliente pide algo nuevo, el proceso es: documentar el cambio, estimar el impacto en tiempo y costo, obtener aprobación escrita del cliente antes de iniciar, y actualizar el contrato. Sin este proceso, el proyecto sufre scope creep — el scope crece sin presupuesto adicional y el proyecto se retrasa. La frase "es un pequeño cambio" es la más peligrosa en gestión de proyectos.
- **User Story con criterios de aceptación:** unidad funcional del backlog escrita desde el valor de negocio: "Como [rol], quiero [capacidad], para [beneficio]". No está lista para desarrollo si no tiene criterios de aceptación verificables, reglas de negocio, datos de prueba y excepciones principales. En Power Platform/D365, una historia suele mapear a configuración, seguridad, automatización, integración, reporte o experiencia de usuario.
- **Documentación funcional:** paquete que explica qué necesita el negocio y cómo se comportará la solución: procesos TO-BE, reglas de negocio, matriz de campos, matriz de roles, pantallas/formularios, flujos de aprobación, reportes, integraciones funcionales y casos UAT. La audiencia principal es negocio, QA y consultoría funcional.
- **Documentación técnica:** paquete que explica cómo se implementa y opera la solución: arquitectura, componentes, modelo Dataverse, decisiones técnicas, plugins, cloud flows, APIs, pipelines ALM, variables de entorno, seguridad, monitoreo, runbook y rollback. La audiencia principal es arquitectura, desarrollo, soporte y operaciones.
- **Matriz de trazabilidad:** tabla que conecta requerimiento, historia de usuario, diseño funcional, componente técnico, caso UAT, evidencia y estado. Es la defensa profesional contra discusiones de alcance: si no está trazado, no se puede probar ni aprobar con claridad.
- **UAT Plan:** plan de pruebas de aceptación de usuario que valida procesos de negocio completos, no solo pantallas. Debe cubrir happy path, excepciones, roles, datos reales anonimizados, criterios de aprobación, responsables, calendario, ambiente, defect management y evidencias. En Success by Design, la fase **Prepare** incluye además el plan de cutover con criterios **go/no-go**, ensayos de go-live (*mock go-lives*), el modelo de soporte listo y un runbook de despliegue con tareas, dueños, duraciones y dependencias ([Learn: Success by Design](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/success-by-design)).

---

## 🧩 Microlección 1 — Discovery y Fit-Gap: decidir qué entra antes de prometer (≈60 min)

**El concepto:** el Discovery no es una reunión para "levantar requerimientos", es la primera decisión de alcance. Su salida no es una lista de deseos, es una lista **clasificada** (Fit, Partial, Gap, Excluido) y **priorizada** (MoSCoW), con los primeros riesgos escritos. Success by Design pide empezar la Solution Blueprint Review ya en esta fase, no después.

**Ahora decide (5 min, sin feedback automático):** de los 12 pedidos del caso continuo, ¿cuál **no** es un requerimiento sino un síntoma que hay que convertir en requerimientos? ¿Cuál tiene más riesgo de esconder un proyecto aparte? Escríbelo antes de seguir.

**Plantilla de agenda del Discovery** (adáptala; no la sigas al pie de la letra):

```markdown
# Discovery Workshop Agenda — [Cliente] / [Proyecto]
**Duración:** 2 días (8h c/u) | **Asistentes:** C-suite + IT + usuarios clave

## Día 1: Contexto y Estado Actual (AS-IS)

### Bloque 1: Contexto estratégico (90 min)
- ¿Cuáles son los 3 objetivos estratégicos de la empresa para los próximos 2 años?
- ¿Qué problemas de negocio le quitan el sueño al CEO?
- ¿Cómo se mide el éxito de este proyecto? (KPIs concretos)

### Bloque 2: Proceso actual (2h)
- Mapeo del proceso AS-IS (whiteboard)
- ¿Qué sistemas usan actualmente?
- ¿Cuáles son los puntos de dolor más grandes?
- ¿Qué workarounds manuales tienen?

### Bloque 3: Usuarios y volúmenes (90 min)
- ¿Quiénes son los usuarios? (roles, cantidad, ubicación, idioma)
- ¿Cuál es el volumen de transacciones? (registros/día, pico)
- ¿Dispositivos? (desktop, mobile, offline requirements?)

## Día 2: Estado Futuro (TO-BE) y Priorización

### Bloque 4: Visión TO-BE (2h)
- Diseñar el proceso ideal (sin restricciones tecnológicas primero)
- ¿Qué decisiones automatizarías si pudieras?
- ¿Qué información necesitas en tiempo real que hoy no tienes?

### Bloque 5: Fit-Gap Analysis (2h)
- Por cada requerimiento: ¿está cubierto en la plataforma? (Fit / Gap / Workaround)
- Priorización MoSCoW: Must Have / Should Have / Could Have / Won't Have

### Bloque 6: Riesgos y siguiente paso (1h)
- Top 5 riesgos identificados
- Definir: MVP del proyecto
- Fecha de kick-off y entregables de la siguiente fase
```

**Ejemplo de Fit-Gap** (de otro proyecto CRM; úsalo como forma, no como respuesta):

```markdown
# Fit-Gap Analysis — Sistema CRM

| # | Requerimiento | Prioridad | Fit / Gap | Observación |
|---|--------------|-----------|-----------|-------------|
| 1 | Gestión de oportunidades comerciales | Must Have | ✅ Fit | D365 Sales cubre 100% |
| 2 | Propuestas con firma digital | Must Have | ⚠️ Partial | Requiere integración con DocuSign o Adobe Sign |
| 3 | Integración en tiempo real con SAP MM | Must Have | ⚠️ Gap | Requiere desarrollo: Custom Connector + Logic App |
| 4 | Análisis predictivo de churn | Should Have | ⚠️ Gap | AI Builder Prediction — requiere 6 meses de datos históricos |
| 5 | App móvil offline para vendedores en campo | Must Have | ✅ Fit | Canvas App con modo offline |
| 6 | Chatbot para consultas de clientes | Could Have | ✅ Fit | Copilot Studio — post-MVP |
| 7 | Integración con sistema de nómina local | Won't Have | ❌ Excluido | Fuera del alcance de este proyecto |

**Resumen:** 
- Fits: 3 (43%) — sin desarrollo adicional
- Partial/Gaps: 3 (43%) — requieren desarrollo
- Won't Have: 1 (14%) — excluidos del scope
```

**Haz el Fit-Gap del caso continuo:** clasifica los 12 pedidos (convierte el 12 en requerimientos concretos o exclúyelo con su razón), asigna MoSCoW con un máximo de la mitad como **Must**, y abre las 3 primeras líneas del Risk Register. Para clasificar, apóyate en lo que viste en los módulos anteriores (AI Builder Prediction en el Módulo 37, offline en Canvas Apps, Copilot Studio en los Módulos 15 y 22, integración en el Módulo 24).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Cuántos Fit, Partial, Gap y Excluidos te salieron | ___ |
| Cómo convertiste el pedido 12 ("igual que el Excel") en requerimientos o por qué lo excluiste | ___ |
| Los Must y por qué cada uno es Must y no Should | ___ |
| El pedido que esconde un proyecto aparte y qué decisión de alcance propones | ___ |
| Las 3 primeras líneas del Risk Register (riesgo, P × I, dueño) | ___ |

---

## 🧩 Microlección 2 — Estimar con incertidumbre y defender el rango (≈60 min)

**El concepto:** una estimación no es un número, es un **rango con supuestos**. En preventa, sin Discovery, lo honesto es un rango amplio (±50%); después del Discovery, con Fit-Gap y WBS, un rango más estrecho (±30% es una incertidumbre válida si la dices). Lo que no se negocia en silencio son los supuestos: si cambian, la estimación cambia.

**Ahora haz algo — micropráctica (8 min):** el cliente pide precio y fecha cerrados en la primera reunión → **[Estimar y comprometer en preventa](/practica/ip-arq-025-estimar-y-comprometer-en-preventa)**.

**Plantilla de estimación** (de un proyecto parecido):

```markdown
# Estimación — Proyecto CRM SIT (v1.2)

## Supuestos clave
- Team: 1 Arquitecto + 2 Developers + 1 QA (50% tiempo cada uno)
- Sprint: 2 semanas, 8 story points de capacidad por developer por sprint
- Incluye: development, testing, documentación básica
- No incluye: infraestructura Azure (billing separado), licencias, migración de datos legacy

## WBS y Estimaciones

| Módulo | Tarea | Story Points | Semanas |
|--------|-------|-------------|---------|
| Setup | Configurar ambientes DEV/TEST/PROD | 5 | 1 |
| Setup | Pipeline CI/CD Azure DevOps | 8 | 1.5 |
| Data Model | Tablas Dataverse + relaciones | 13 | 2 |
| Data Model | Security Roles + Field Security | 8 | 1.5 |
| Canvas App | 5 pantallas principales | 20 | 3.5 |
| Canvas App | Component Library (3 componentes) | 8 | 1.5 |
| Power Automate | Flujo aprobación propuestas | 13 | 2 |
| Power Automate | Integración SAP | 20 | 3.5 |
| Model-Driven | Formularios y vistas | 8 | 1.5 |
| Power BI | Dashboard ejecutivo + RLS | 13 | 2 |
| Testing | QA end-to-end + UAT support | 20 | 3.5 |
| Deployment | Deploy a PROD + documentación | 8 | 1.5 |
| **TOTAL** | | **144 SP** | **25 sem** |

## Contingencia
Buffer del 20% para imprevistos: +5 semanas
**Total estimado: 30 semanas (~7 meses)**

## Nota de riesgo
El item de integración SAP tiene la mayor incertidumbre (±50%). 
Si el API de SAP no tiene documentación actualizada, podría requerir +2 semanas adicionales.
```

**Ojo con esta plantilla — encuéntralo antes de usarla:** la columna **Semanas** suma 25 semanas como si cada tarea se hiciera una detrás de otra. Con los supuestos de arriba (2 developers × 8 SP = 16 SP por sprint de 2 semanas), 144 SP son 9 sprints, es decir **18 semanas** antes del buffer. Ninguna de las dos cifras es "la verdadera": la de 25 ignora el trabajo en paralelo, y la de 18 ignora que la integración SAP es una ruta crítica que no se acelera con más gente y que la velocidad de 8 SP es un supuesto hasta calibrarla en 2-3 sprints. El arquitecto decide cuál presenta y por qué, y lo escribe.

**Haz la estimación del caso continuo:** con tu Fit-Gap de la Microlección 1, estima solo los **Must** por módulo en story points, calcula la duración con una capacidad que declares como supuesto, separa la integración con SAP como línea de riesgo con su propio rango, y escribe el rango final (mínimo–máximo) con sus supuestos.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Total de story points de los Must y capacidad supuesta por sprint | ___ |
| Duración calculada por velocidad y duración calculada en secuencia; cuál presentas y por qué | ___ |
| Rango final (mínimo–máximo) y los 3 supuestos que, si cambian, cambian la estimación | ___ |
| Cómo tratas la integración SAP (rango propio, spike previo, fase aparte…) | ___ |

---

## 🧩 Microlección 3 — Alcance y cambios: MoSCoW, change requests y deuda técnica (≈40 min)

**El concepto:** fecha, presupuesto y alcance no pueden estar fijos los tres a la vez. Cuando el cliente fija fecha y presupuesto, lo que se gestiona es el **alcance**, y para eso existen MoSCoW (qué cae primero si no alcanza) y el Change Request Process (qué pasa cuando alguien pide algo nuevo). La deuda técnica es la otra cara: lo que el equipo "recortó" para llegar y que hay que hacer visible.

**Ahora decide (5 min, sin feedback automático):** en la semana 6, el Director Comercial dice: "es un pequeño cambio: que la aprobación de descuentos tenga un segundo nivel, el CFO, por encima del 25%". ¿Qué haces primero: estimar, decir que no, o meterlo en el sprint porque "es configuración"? Escríbelo.

**Practica con el caso continuo — un change request completo** (una página):

```markdown
# CR-004 — Segundo nivel de aprobación de descuentos (> 25%)

**Solicitado por:** Director Comercial | **Fecha:** semana 6
**Descripción:** descuentos > 25% requieren aprobación del CFO después del gerente.
**Requerimiento afectado:** REQ-005 (aprobación de descuentos > 15%)
**Impacto:**
- Alcance: nueva rama del flujo de aprobación, nuevo rol "Aprobador CFO", 2 casos UAT nuevos
- Esfuerzo: ___ SP (estimación del equipo)
- Fecha: ___ (¿entra en el sprint actual sin desplazar un Must?)
- Riesgo: ___
**Opciones:** (a) aprobar y desplazar ___ ; (b) aprobar con presupuesto adicional; (c) dejarlo para la fase 2
**Recomendación del arquitecto:** ___
**Aprobación:** ________ (Accountable según el RACI) | Fecha: ____
```

Registra también 2 elementos de deuda técnica del proyecto (por ejemplo, un valor hardcodeado que debió ser Environment Variable) con su costo estimado de pagarla.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Impacto del CR-004 en SP y en fecha | ___ |
| La opción que recomiendas y qué Must o Should desplaza (o cuánto cuesta) | ___ |
| Quién aprueba el CR según tu RACI y por qué es una sola persona | ___ |
| Los 2 elementos de deuda técnica y cuándo propones pagarlos | ___ |

---

## 🧩 Microlección 4 — Riesgos y gobierno: Risk Register, steering y stage gates (≈45 min)

**El concepto:** el gobierno de un proyecto falla menos por falta de estructuras que porque las estructuras existen y no funcionan: un Risk Register que nadie revisa, un steering que solo recibe "todo en verde", un stage gate que se aprueba "porque ya lo resolveremos en la siguiente fase". La guía de implementación de Microsoft lo plantea así: tener steering groups, status reports y design boards no garantiza un gobierno efectivo; hay que evaluar cómo funcionan en la práctica ([Learn: estructuras clásicas de gobierno](https://learn.microsoft.com/dynamics365/guidance/implementation-guide/project-governance-classic-structures)).

**Ahora decide (5 min, sin feedback automático):** el status report de las últimas 4 semanas dice "verde: 70% de tareas completadas". ¿Qué le falta para que el steering pueda dirigir el proyecto? Escríbelo.

**Practica con el caso continuo:**

1. Completa el Risk Register a **5 riesgos** con esta forma, uno de cada categoría como mínimo entre técnico, negocio y equipo:

   | ID | Riesgo | Categoría | P (1-5) | I (1-5) | Score | Disparador (cómo sabrás que se materializa) | Mitigación | Contingencia | Dueño | Última revisión |
   |---|---|---|---|---|---|---|---|---|---|---|
   | R-01 | La API de SAP no está documentada | Técnico | 4 | 5 | 20 | En la semana 3 no hay credenciales ni un endpoint de prueba | Spike de 1 semana antes del sprint de integración | Fase 1 sin tiempo real: consulta nocturna | Arquitecto + IT del cliente | ___ |

2. Escribe un **status report de una página** para el steering que responda las tres preguntas de la guía (¿vamos en plazo?, ¿riesgos o problemas principales?, ¿qué necesitamos del steering?), compare lo real con lo planeado y proponga una decisión concreta con opciones.
3. Define los **criterios de salida** del stage gate "Build → Test" (al menos 3, medibles).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El riesgo con mayor score y su disparador | ___ |
| La decisión concreta que pides al steering en tu status report, con sus opciones | ___ |
| Los criterios de salida del stage gate Build → Test | ___ |
| Qué harías si el steering quiere pasar el gate sin cumplir un criterio | ___ |

---

## 🧩 Microlección 5 — Historias, trazabilidad y UAT (≈60 min)

**El concepto:** la mitad de las discusiones de alcance en UAT ("esto siempre se había pedido") se ganan o se pierden con la trazabilidad: si un requerimiento no tiene historia, criterio de aceptación y caso UAT, no se puede probar ni aprobar. Convertir requerimientos ambiguos en historias listas para desarrollo es trabajo del consultor; mantenerlas conectadas hasta el UAT, del arquitecto.

**Ejemplo de historia lista para desarrollo:**

```markdown
# Historia de Usuario — HU-CRM-014

**Como:** gerente comercial  
**Quiero:** ver oportunidades bloqueadas por crédito vencido  
**Para:** priorizar acciones antes de comprometer una fecha de entrega al cliente

## Contexto funcional
- Aplica a oportunidades B2B mayores a USD 10,000.
- La información de crédito viene del ERP/F&O.
- El vendedor puede ver el bloqueo, pero solo finanzas puede liberarlo.

## Criterios de aceptación
1. Dado un cliente con crédito vencido, cuando el vendedor abre la oportunidad, entonces el sistema muestra alerta visible de bloqueo.
2. Dado un cliente sin deuda vencida, cuando se consulta la oportunidad, entonces no se muestra alerta de bloqueo.
3. Dado un usuario sin rol Finanzas, cuando intenta liberar el bloqueo, entonces la acción no está disponible.
4. Dado que el ERP no responde, cuando se consulta el estado de crédito, entonces se muestra estado "pendiente de validación" y se registra evento para soporte.

## Datos de prueba
| Cliente | Crédito | Rol usuario | Resultado esperado |
|---|---|---|---|
| Contoso A | Vencido | Vendedor | Alerta visible, no libera |
| Contoso B | Al día | Vendedor | Sin alerta |
| Contoso C | Vencido | Finanzas | Puede liberar con justificación |
```

Checklist mínimo antes de pasar a desarrollo:
- Historia vinculada a un requerimiento aprobado.
- Criterios de aceptación verificables por QA/UAT.
- Roles y permisos identificados.
- Datos de prueba definidos.
- Dependencias externas documentadas.

**Matriz de trazabilidad** (simple, para evitar duplicidad y discusiones tardías de alcance):

| Req ID | Historia | Diseño funcional | Componente técnico | Caso UAT | Evidencia | Estado |
|---|---|---|---|---|---|---|
| REQ-001 | HU-CRM-014 bloqueo crédito | FDD-03 Reglas comerciales | Cloud flow + campo Dataverse + conector ERP | UAT-014 | Captura alerta + log integración | Aprobado |
| REQ-002 | HU-CS-021 escalamiento SLA | FDD-05 Servicio al cliente | SLA KPI + routing rule | UAT-021 | Caso vencido escalado | En prueba |
| REQ-003 | HU-FS-008 visita técnica | FDD-07 Field Service | Work Order + Booking + mobile inspection | UAT-008 | Firma cliente + checklist | Pendiente |

Paquete documental recomendado sin inflar el proyecto:
- Minutas de workshops con decisiones y pendientes.
- Backlog con historias, criterios de aceptación y prioridad MoSCoW.
- FDD/FRD con procesos TO-BE, reglas, campos, roles, reportes e integraciones funcionales.
- TDD/SDD con arquitectura, componentes, ALM, seguridad, integraciones técnicas y operación.
- Matriz de trazabilidad de requerimientos a UAT.
- Plan UAT con casos, datos, responsables, calendario y criterios de aprobación.
- Registro de riesgos, decisiones y change requests.

**Practica con el caso continuo:** escribe 5 historias de los Must (incluida la de aprobación de descuentos y la de visibilidad por región, pedido 11) con criterios de aceptación, roles y datos de prueba; llévalas a una matriz de trazabilidad con 10 o más filas, y esboza el plan UAT: happy path, excepciones, permisos y los criterios **go/no-go** del go-live.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La historia con más criterios de aceptación y su criterio de excepción | ___ |
| Cuántas filas tiene tu matriz y cuántas tienen ya caso UAT | ___ |
| Un caso UAT de permisos (pedido 11) con su resultado esperado | ___ |
| Tus 3 criterios go/no-go del go-live | ___ |

---

## 🧩 Microlección 6 — Comunicar decisiones a cada audiencia (≈40 min)

**El concepto:** la misma decisión se cuenta distinto al CFO, al equipo de desarrollo y a los usuarios. Regla de oro: **la audiencia ejecutiva no quiere detalles técnicos — quiere resultados de negocio**. Y la guía de implementación lo pide también para el steering: lenguaje simple, sin jerga, con evidencia y con opciones para decidir.

Mal ejemplo: "Implementaremos Dataverse con 12 tablas personalizadas, un plugin C# pre-operation para validación de SLA, PCF controls basados en React, y pipelines CI/CD en Azure DevOps con YAML."

Buen ejemplo: "En 7 meses tendrán un sistema donde los vendedores ven en tiempo real si hay stock disponible en SAP antes de comprometer una fecha al cliente — eliminando el 90% de las entregas tardías. El sistema aprende de su historial de ventas para predecir qué clientes están en riesgo de cancelar, dando a los gerentes la información necesaria para actuar antes de perder la cuenta."

> Fíjate en que el buen ejemplo promete "90% de las entregas tardías" y "7 meses": en una propuesta real, cada cifra que digas al CFO debe salir de tu estimación y de un KPI acordado en el Discovery, o no decirse.

**Practica con el caso continuo:** prepara el esquema de una presentación de 10 slides para el CFO de Distribuidora Andina: las 3 primeras en lenguaje de negocio (problema, resultado medible, costo y plazo como **rango**), y el detalle técnico en un apéndice. Escribe también el RACI de las 4 decisiones clave del proyecto (alcance, arquitectura, go-live, change requests).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| El título de tus 3 primeras slides | ___ |
| El KPI de negocio que prometes y de dónde sale (Discovery, dato del cliente…) | ___ |
| Cómo presentas el plazo al CFO (rango y supuesto principal) | ___ |
| Quién es Accountable de cada una de las 4 decisiones del RACI | ___ |

---

## 🔧 Diagnosticar — "el proyecto que estaba en verde"

Semana 9 del proyecto de Distribuidora Andina, a 4 semanas del go-live: en la primera prueba integrada, la integración con SAP **no existe**. El status report llevaba 8 semanas en verde. Antes de abrir nada, escribe **tres hipótesis** en piezas distintas del gobierno (Risk Register, status report, stage gate, steering) y qué evidencia confirmaría cada una. Después resuelve el caso:

**[Diagnosticar: el proyecto pasó de verde a rojo en una semana](/practica/ip-arq-026-proyecto-de-verde-a-rojo)**

| Campo | Tu valor |
|---|---|
| Tus tres hipótesis y la evidencia que revisarías para cada una | ___ |
| La primera evidencia que contradice "íbamos en verde" | ___ |
| Qué cambias en el gobierno para que no vuelva a pasar, y qué decisión pides hoy al steering | ___ |

---

## 🧭 Decidir y defender — El plan del caso continuo ante el steering

Junta lo que hiciste en las microlecciones en un **documento de decisión de una página** para el steering de Distribuidora Andina: alcance de la fase 1 (Must y lo que queda fuera), estimación como rango con supuestos, tratamiento de la integración SAP, los 3 riesgos principales con dueño y la decisión que pides hoy. No hay una sola respuesta correcta: contrasta tu documento con esta rúbrica.

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Alcance explícito | Dices qué entra y qué **no** entra en la fase 1, y el pedido 12 está convertido en requerimientos o excluido con su razón |
| Estimación honesta | Es un rango con sus supuestos; dices qué lo haría cambiar |
| Riesgo principal tratado | La integración SAP tiene mitigación, contingencia, dueño y un disparador con fecha |
| Una decisión pedida | El steering sale de la reunión con una decisión concreta entre opciones, no solo informado |
| Lenguaje de la audiencia | Sin jerga técnica en el cuerpo; el detalle va en un anexo |
| Trade-off escrito | Nombras qué sacrificas con tu plan (alcance, fecha, presupuesto o calidad) y por qué |

---

## 🔁 Reto de transferencia — Otro cliente, otras restricciones: decide y defiende

**Requisito nuevo:** una agencia de gobierno debe tener en producción un sistema de **trámites de licencias** antes de la fecha en que entra en vigor una ley (inamovible, en 5 meses). El presupuesto está cerrado por licitación. El sponsor quiere los **40 requerimientos** del pliego, el área jurídica aprueba cualquier cambio de alcance por escrito y el equipo del proveedor es de 4 personas que no se puede ampliar. En el Discovery aparece que el sistema actual de pagos no tiene API y que los usuarios de ventanilla solo están disponibles para UAT dos semanas.

**Micropráctica de transferencia (8 min):** **[Transferir: fecha legal fija y presupuesto cerrado](/practica/ip-arq-027-transferir-fecha-legal-fija)**.

**Después, sin pasos:** escribe **ADR-PM-001 "Estrategia de entrega para la fecha legal"** (una página) con: qué variable flexibilizas y cuáles no; qué entra en la primera puesta en producción y qué en las siguientes; cómo tratas el sistema de pagos sin API; cómo planificas un UAT de dos semanas; y quién aprueba los cambios de alcance. Contrasta tu decisión con esta rúbrica.

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Triángulo decidido | Dices explícitamente que fecha y presupuesto están fijos y que se gestiona el alcance, con MoSCoW sobre los 40 requerimientos |
| Primera entrega mínima legal | Lo que exige la ley entra primero; el resto va en entregas posteriores con fecha tentativa |
| Riesgo de pagos tratado | El sistema sin API tiene una alternativa para la primera entrega (por ejemplo, un proceso manual temporal o un archivo) y un dueño |
| UAT realista | Los casos UAT se priorizan por proceso crítico y los usuarios clave se reservan con anticipación |
| Gobierno del cambio | Los cambios de alcance tienen un proceso escrito con aprobación de jurídica, y un único Accountable |
| Trade-off escrito | Nombras qué empeora (requerimientos que esperan, trabajo manual temporal…) y por qué lo aceptas |

| Campo | Tu valor |
|---|---|
| Qué variable flexibilizas y por qué | ___ |
| Cuántos de los 40 requerimientos son Must para la fecha legal y con qué criterio | ___ |
| Tu solución temporal para el sistema de pagos | ___ |
| Cómo usas las dos semanas de UAT | ___ |
| Tu trade-off principal | ___ |

---

### 💼 Caso Real de Negocio
**Situación:** Un arquitecto presentó la propuesta técnica al CFO con 40 slides de diagramas de arquitectura. El CFO interrumpió en el slide 5: "Todo eso está muy bien, pero ¿cuánto me cuesta y en cuánto tiempo lo veo funcionando?"  
**Lección:** Slides 1-3 = problema de negocio y ROI esperado. Slides 4-6 = solución en lenguaje de negocio. Apéndice = detalles técnicos para quien los pida.  
**Resultado del arquitecto que aprendió esto:** tasa de cierre de propuestas subió de 30% a 65%.

**Situación:** En un proyecto D365, negocio afirmó en UAT que "siempre se había pedido" una aprobación adicional para descuentos, pero la historia no tenía criterio de aceptación, no existía caso UAT y el diseño funcional no mencionaba esa regla.  
**Lección:** La consultoría funcional profesional no consiste en escribir documentos largos, sino en mantener trazabilidad viva entre requerimiento, decisión, configuración, prueba y aprobación.  
**Resultado esperado:** menos reprocesos, menos discusiones de alcance y mayor confianza entre negocio, TI y partner.

### ✅ Buenas Prácticas
- El Discovery Workshop debe generar el SoW, no el SoW debe generar el Discovery
- Nunca comprometer fechas en el Discovery — primero estimar, luego comprometer
- Una estimación es un rango con supuestos escritos; si un supuesto cambia, la estimación se revisa en voz alta
- Risk Register: revisar semanalmente con el cliente — no solo al inicio; cada riesgo con dueño, disparador y acción
- Las estimaciones con ±30% de incertidumbre son válidas; sé honesto sobre la incertidumbre
- El status report para el steering responde tres preguntas (¿vamos en plazo?, ¿riesgos?, ¿qué necesitamos?) y pide decisiones con opciones
- Los stage gates tienen criterios de salida medibles y no se pasan por presión; si se pasa con un pendiente, con plan y dueño escritos
- Cuando fecha y presupuesto son fijos, el alcance se gestiona con MoSCoW y un Change Request Process con un solo Accountable
- Ninguna historia entra a desarrollo sin criterios de aceptación, datos de prueba y dependencia principal identificada
- Separar documentación funcional y técnica, pero mantenerlas conectadas por matriz de trazabilidad
- Diseñar UAT por proceso de negocio completo, incluyendo errores esperados y roles reales
- Mantener registro de decisiones y cambios; una decisión no documentada se vuelve opinión discutible dos sprints después

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Estimación comprometida antes de tener el Fit-Gap Analysis completo | Presión comercial para dar un precio "ahora mismo" antes del Discovery | Dar rangos indicativos en la fase de pre-venta (±50%); comprometer la estimación real solo después del Discovery con el Fit-Gap documentado |
| Estimación que suma las semanas de cada tarea como si todo fuera en secuencia, o que divide story points sin mirar la ruta crítica | Se usa un solo cálculo sin contrastarlo | Calcular por capacidad del equipo y revisar la ruta crítica (integraciones, dependencias externas); presentar un rango con los supuestos |
| Discovery Workshop donde solo habla el sponsor ejecutivo | El facilitador no gestiona la dinámica grupal y los usuarios clave no participan | Técnica "1 voto por persona": en la priorización MoSCoW, cada participante vota independientemente; el sponsor no puede votar por todos |
| Risk Register creado al inicio y nunca actualizado | Se ve como un formalismo de documentación, no como herramienta de gestión | El Risk Register es el primer item de revisión en la reunión semanal de steering; si un riesgo no fue revisado esta semana, no existe en la práctica |
| Status report en verde hasta que de pronto está en rojo | Se reporta actividad (% de tareas) en vez de avance contra el plan y riesgos con evidencia | Comparar lo real con lo planeado, mostrar los riesgos con su estado y pedir decisiones al steering |
| Stage gate aprobado con un pendiente crítico "para la siguiente fase" | Presión de calendario u optimismo | Criterios de salida medibles; si se pasa con un pendiente, plan escrito, dueño y fecha |
| Presentación técnica confundida con presentación ejecutiva | El arquitecto prepara una sola presentación para todas las audiencias | Tener siempre 2 versiones: "Ejecutiva" (problema + resultado + costo + ROI, sin jerga técnica) y "Técnica" (arquitectura, componentes, decisiones) — presentar según la audiencia |
| Historias sin criterios de aceptación | Se captura deseo de negocio, pero no comportamiento verificable | Usar Given/When/Then o criterios numerados antes de estimar la historia |
| UAT limitado al happy path | QA y negocio prueban solo el escenario ideal | Incluir excepciones, permisos, errores de integración, datos incompletos y casos de borde |
| Documentación escrita al final | Se trata como entregable administrativo y no como herramienta de diseño | Documentar incrementalmente desde Discovery y actualizar en cada cambio aprobado |
| Requerimientos sin trazabilidad | Backlog, diseño, desarrollo y pruebas viven en documentos separados | Mantener una matriz simple con Req ID, historia, componente, caso UAT, evidencia y estado |

### 🧪 Criterios de Validación
- [ ] Discovery Workshop agenda diseñada para un cliente real o simulado
- [ ] Fit-Gap Analysis con 10+ requerimientos clasificados MoSCoW
- [ ] 5 historias de usuario con criterios de aceptación, datos de prueba y roles
- [ ] Matriz de trazabilidad con 10+ requerimientos vinculados a casos UAT
- [ ] Plan UAT con happy path, excepciones, permisos y evidencias esperadas
- [ ] Paquete documental separado entre funcional y técnico, con owner y versión
- [ ] Estimación por módulo con story points y semanas, incluyendo buffer de contingencia
- [ ] Presentación de 10 slides del proyecto: las primeras 3 en lenguaje de negocio, sin jerga técnica
- [ ] Estimación presentada como rango con sus supuestos, y sé explicar por qué el cálculo en secuencia y el cálculo por velocidad no coinciden
- [ ] Un change request completo con impacto, opciones, recomendación y aprobador único
- [ ] Risk Register de 5 riesgos con dueño y disparador, y un status report que pide una decisión concreta al steering
- [ ] Escribí el documento de decisión del caso continuo y ADR-PM-001, y los contrasté con sus rúbricas, con el trade-off escrito

---

---
moduleId: 38
title: "Liderazgo Técnico y Gestión de Proyectos"
level: "arquitecto"
certification: "PL-600"
estimatedMinutes: 11
slug: "liderazgo-tecnico-y-gestion-de-proyectos"
---
### 🎯 Objetivo
Desarrollar las competencias de liderazgo técnico necesarias para el rol de Solution Architect: conducir workshops de descubrimiento, estimar proyectos con precisión, gestionar riesgos, comunicar decisiones técnicas al C-suite, y liderar equipos de Fusion Development.

### 📖 Conceptos Clave
- **Discovery Workshop:** sesión estructurada de 1-3 días con stakeholders de negocio y técnicos cuyo objetivo es entender profundamente el contexto, procesos actuales, puntos de dolor y visión futura ANTES de proponer ninguna tecnología. Un Discovery bien ejecutado produce: mapa del proceso AS-IS, lista de requerimientos priorizada (MoSCoW), Risk Register inicial, y consenso sobre el MVP. Un arquitecto que propone tecnología antes del Discovery está vendiendo, no diseñando. Herramientas típicas: Miro/Whiteboard para mapear procesos, Confluence/SharePoint para documentar, y una agenda estructurada con facilitación activa.
- **Fit-Gap Analysis:** análisis sistemático que mapea cada requerimiento del cliente contra las capacidades nativas de Power Platform, clasificando cada uno en: Fit (cubierto nativamente sin desarrollo), Partial Fit (cubierto con configuración adicional o customización menor), Gap (no existe en la plataforma y requiere desarrollo custom o integración externa), o Exclusión (fuera del alcance del proyecto). El Fit-Gap es el documento que justifica por qué se necesita desarrollo custom y cuánto costará; sin él, los clientes asumen que "todo es configuración".
- **Solution Blueprint:** documento de arquitectura de alto nivel (10-20 páginas) que precede al desarrollo y describe: el diagrama de componentes del sistema, las decisiones arquitectónicas clave con sus justificaciones (ADRs), la estrategia de integración, el modelo de seguridad, y el plan de ambientes. Es el contrato técnico entre el arquitecto y el equipo de desarrollo; sin Blueprint, cada desarrollador toma decisiones de arquitectura de forma independiente y el resultado es incoherente.
- **Statement of Work (SoW):** documento legal-técnico que define con precisión el alcance del proyecto: qué se construirá (incluyendo criterios de aceptación por entregable), qué explícitamente está excluido del scope, el calendario de entrega, los roles y responsabilidades de cada parte, los precios y condiciones de pago, y el proceso de cambios de alcance. Un SoW bien redactado previene el 80% de las disputas de proyecto. La sección de exclusiones es tan importante como la de inclusiones; lo que no está en el SoW, el cliente asumirá que está incluido.
- **Risk Register:** registro estructurado de todos los riesgos identificados del proyecto con: descripción del riesgo, probabilidad (1-5), impacto en costo/tiempo/calidad (1-5), score (P×I), categoría (técnico/negocio/regulatorio/equipo), plan de mitigación específico, plan de contingencia si el riesgo se materializa, dueño del riesgo, y estado actual. Se revisa semanalmente en la reunión de steering. En proyectos de Power Platform, los riesgos más comunes son: integración con sistemas legacy sin API documentada, cambios en el modelo de licenciamiento, y disponibilidad de usuarios para UAT.
- **WBS (Work Breakdown Structure):** descomposición jerárquica del proyecto en entregables, módulos y tareas estimables de forma independiente, hasta el nivel donde cada tarea tenga una duración de 1-5 días. La WBS es la base para la estimación y el plan de proyecto; sin ella, la estimación es una conjetura. Herramienta: Microsoft Project, Azure DevOps Boards (con Epics → Features → User Stories → Tasks), o una hoja Excel estructurada. El nivel de detalle apropiado depende de la fase: en propuesta comercial, nivel módulo es suficiente; en planificación de sprint, nivel tarea.
- **RACI Matrix:** tabla que asigna para cada entrega o decisión del proyecto quién es: Responsible (quien hace el trabajo), Accountable (quien aprueba y tiene la responsabilidad final — solo 1 persona), Consulted (quien debe ser consultado antes de decidir — su input importa), e Informed (quien debe ser notificado del resultado). En proyectos de Power Platform, las confusiones más comunes son entre Accountable y Responsible (el cliente suele querer ser R y A en todo) y sobre quién aprueba los cambios de scope.
- **Velocity (Agile):** métrica que mide la capacidad real del equipo de desarrollo medida en story points completados por sprint (tipicamente 2 semanas). Los primeros 2-3 sprints se usan para calibrar la velocidad real del equipo; no se compromete con fechas hasta tener al menos 2 sprints de historial. Una velocidad de 20 story points/sprint con un backlog de 200 story points significa aproximadamente 10 sprints (20 semanas) para completar el backlog. La velocidad es una propiedad del equipo específico, no una constante universal.
- **Technical Debt:** acumulación de decisiones de implementación subóptimas tomadas para ganar velocidad a corto plazo que generan costo mayor a largo plazo (más tiempo de mantenimiento, más bugs, más dificultad para agregar features). En Power Platform: hardcodear valores que deberían ser Environment Variables, usar flujos de Power Automate sin error handling, o crear tablas de Dataverse sin pensar en el modelo relacional. El Technical Debt debe ser visible y cuantificado (como una lista en Azure DevOps) para que el equipo pueda pagarlo en sprints dedicados antes de que se vuelva impagable.
- **Change Request Process:** proceso formal documentado en el SoW para gestionar solicitudes de cambio al scope aprobado. Cuando el cliente pide algo nuevo, el proceso es: documentar el cambio, estimar el impacto en tiempo y costo, obtener aprobación escrita del cliente antes de iniciar, y actualizar el contrato. Sin este proceso, el proyecto sufre scope creep — el scope crece sin presupuesto adicional y el proyecto se retrasa. La frase "es un pequeño cambio" es la más peligrosa en gestión de proyectos.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 38.1: Plantilla de Discovery Workshop
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

#### Actividad 38.2: Fit-Gap Analysis Document
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

#### Actividad 38.3: Plantilla de estimación
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

#### Actividad 38.4: Comunicar arquitectura al C-suite
Regla de oro: **La audiencia ejecutiva no quiere detalles técnicos — quiere resultados de negocio**

Mal ejemplo: "Implementaremos Dataverse con 12 tablas personalizadas, un plugin C# pre-operation para validación de SLA, PCF controls basados en React, y pipelines CI/CD en Azure DevOps con YAML."

Buen ejemplo: "En 7 meses tendrán un sistema donde los vendedores ven en tiempo real si hay stock disponible en SAP antes de comprometer una fecha al cliente — eliminando el 90% de las entregas tardías. El sistema aprende de su historial de ventas para predecir qué clientes están en riesgo de cancelar, dando a los gerentes la información necesaria para actuar antes de perder la cuenta."

### 💼 Caso Real de Negocio
**Situación:** Un arquitecto presentó la propuesta técnica al CFO con 40 slides de diagramas de arquitectura. El CFO interrumpió en el slide 5: "Todo eso está muy bien, pero ¿cuánto me cuesta y en cuánto tiempo lo veo funcionando?"  
**Lección:** Slides 1-3 = problema de negocio y ROI esperado. Slides 4-6 = solución en lenguaje de negocio. Apéndice = detalles técnicos para quien los pida.  
**Resultado del arquitecto que aprendió esto:** tasa de cierre de propuestas subió de 30% a 65%.

### ✅ Buenas Prácticas
- El Discovery Workshop debe generar el SoW, no el SoW debe generar el Discovery
- Nunca comprometer fechas en el Discovery — primero estimar, luego comprometer
- Risk Register: revisar semanalmente con el cliente — no solo al inicio
- Las estimaciones con ±30% de incertidumbre son válidas; sé honesto sobre la incertidumbre

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Estimación comprometida antes de tener el Fit-Gap Analysis completo | Presión comercial para dar un precio "ahora mismo" antes del Discovery | Dar rangos indicativos en la fase de pre-venta (±50%); comprometer la estimación real solo después del Discovery con el Fit-Gap documentado |
| Discovery Workshop donde solo habla el sponsor ejecutivo | El facilitador no gestiona la dinámica grupal y los usuarios clave no participan | Técnica "1 voto por persona": en la priorización MoSCoW, cada participante vota independientemente; el sponsor no puede votar por todos |
| Risk Register creado al inicio y nunca actualizado | Se ve como un formalismo de documentación, no como herramienta de gestión | El Risk Register es el primer item de revisión en la reunión semanal de steering; si un riesgo no fue revisado esta semana, no existe en la práctica |
| Presentación técnica confundida con presentación ejecutiva | El arquitecto prepara una sola presentación para todas las audiencias | Tener siempre 2 versiones: "Ejecutiva" (problema + resultado + costo + ROI, sin jerga técnica) y "Técnica" (arquitectura, componentes, decisiones) — presentar según la audiencia |

### 🧪 Criterios de Validación
- [ ] Discovery Workshop agenda diseñada para un cliente real o simulado
- [ ] Fit-Gap Analysis con 10+ requerimientos clasificados MoSCoW
- [ ] Estimación por módulo con story points y semanas, incluyendo buffer de contingencia
- [ ] Presentación de 10 slides del proyecto: las primeras 3 en lenguaje de negocio, sin jerga técnica

---

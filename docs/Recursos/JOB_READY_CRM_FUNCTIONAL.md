# Ruta Job-Ready Dynamics 365 CRM Functional Specialist

Esta ruta convierte el contenido funcional actual de Dynamics 365 Customer Engagement en una preparación laboral específica para vacantes de **CRM Specialist**, **Dynamics 365 CE Functional Consultant**, **Customer Service Specialist** o **Functional-Technical Consultant**.

No garantiza empleo. Tampoco convierte automáticamente los labs en experiencia laboral formal. Su valor está en ayudarte a practicar configuración funcional, reunir evidencia de consultoría y explicar decisiones con el lenguaje que usan usuarios clave, consultores funcionales y equipos de soporte.

## Vacantes objetivo

Esta ruta apunta a roles como:

- Dynamics 365 CRM Functional Specialist.
- Dynamics 365 Customer Engagement Functional Consultant.
- Dynamics 365 Customer Service Specialist.
- CRM Administrator / CRM Specialist.
- Functional-Technical Consultant con foco en configuración y soporte.
- Consultor funcional junior-mid para Sales, Customer Service y Dataverse.

## Resultado esperado

Al completar la secuencia recomendada, deberías poder explicar y demostrar:

- Cómo configurar tablas, formularios, vistas, business rules y Business Process Flows.
- Cómo modelar un proceso de Customer Service con casos, colas, SLAs, entitlements y knowledge base.
- Cómo explicar un proceso Sales lead-to-cash usando entidades estándar.
- Cómo diseñar UAT, soporte funcional, documentación y training a usuarios.
- Cómo convertir un caso funcional en evidencia de portafolio sin exagerar su alcance real.

## Enfoque funcional moderno

Esta ruta debe evitar prácticas legacy como centro del aprendizaje. El enfoque recomendado es:

- **Customer Service Hub / Copilot Service admin center:** configuración moderna de casos, colas, knowledge, canales, unified routing y perfiles de agente.
- **Enhanced SLAs:** usar SLAs modernos para medir tiempos de respuesta/resolución, no depender de SLAs legacy del web client.
- **Queues:** entenderlas como contenedores de trabajo para organizar, priorizar y monitorear casos/actividades; no como sustituto de seguridad.
- **Entitlements:** definir términos de soporte por horas, casos, productos o nivel de cliente.
- **Sales lead-to-cash:** lead, opportunity, quote, order e invoice como proceso comercial estándar antes de personalizar.
- **Reporting operativo:** dashboards, KPIs, backlog, tiempos de resolución, cumplimiento SLA y UAT como evidencia funcional.

## Skills laborales y estado actual

| Skill laboral | Estado actual | Contenido actual | Evidencia posible hoy | Brecha |
|---|---|---|---|---|
| Administración CRM | Parcial | Módulos 20, 56 | Configuración funcional documentada | Falta simulación laboral JR-007 |
| Tablas, formularios y vistas | Cubierto | Módulos 4, 9, 20 | Formularios, vistas y pruebas por rol | Reforzar escenario CRM real |
| Business Process Flows | Cubierto | Módulos 4, 9, 20; LAB-066 | BPF con etapas y validaciones | Agregar troubleshooting funcional |
| Business rules | Parcial | Módulos 4, 9 | Reglas de negocio básicas | Falta evidencia específica |
| Customer Service cases | Cubierto | Módulo 20, LAB-068 | Case-to-resolution end-to-end | Convertir en job simulation JR-007 |
| Queues | Cubierto | Módulo 20, LAB-068 | Cola configurada y enrutamiento | Profundizar criterios de diseño |
| SLAs | Cubierto | Módulo 20, LAB-068 | SLA con pausa/reanudación y escalamiento | Agregar troubleshooting |
| Entitlements | Parcial | Módulo 20, LAB-068 parcial | Política de cobertura por cliente | Hacerlo obligatorio en JR-007 |
| Knowledge base | Parcial | Módulos 20, 22; LAB-068 parcial | Artículos y búsqueda | Hacerlo obligatorio en JR-007 |
| Dynamics 365 Sales | Cubierto | Módulos 20, 56; LAB-066 | Lead-to-cash y fit-gap | Profundizar forecasting/territories en roadmap |
| Customer Insights / Customer 360 | Parcial | Módulo 57, LAB-067 | Perfil unificado / Customer 360 | Mantener como especialización |
| Field Service awareness | Parcial | Módulo 58, LAB-059 | Work order y UAT | Mantener como especialización |
| Reporting y dashboards | Parcial | Módulos 6, 12, 20; LAB-068 | Dashboard operativo | Falta escenario funcional más fuerte |
| Fit-gap | Cubierto | Módulos 20, 38, 55; LAB-057, LAB-062 | Matriz fit-gap | Conectar con entrevista funcional |
| UAT | Cubierto | Módulos 38, 55; LAB-055, LAB-062 | Casos UAT y sign-off | Conectar con soporte post-go-live |
| Soporte funcional | Parcial | Módulos 38, 55 | Manual, training y resolución | Falta incidente funcional simulado |

## Secuencia recomendada de estudio

1. **Base model-driven y Dataverse:** Módulos 4 y 9 para tablas, formularios, vistas, BPF y seguridad funcional.
2. **Customer Engagement base:** Módulos 20 y 56 para Sales, Customer Service y entidades estándar.
3. **Customer Service hands-on:** LAB-068 para casos, colas, SLA, dashboard y ciclo case-to-resolution.
4. **Sales hands-on:** LAB-066 y LAB-057 para lead-to-cash, entidades estándar y fit-gap.
5. **Especializaciones CE:** LAB-058, LAB-067 y LAB-059 para Customer Insights y Field Service awareness.
6. **Consultoría funcional:** Módulos 38 y 55, LAB-055 y LAB-062 para UAT, documentación, training, fit-gap y go-live.

## Mapeo a contenido actual

| Contenido | Uso dentro de esta ruta | Qué debes extraer como evidencia |
|---|---|---|
| Módulo 4 - Model-Driven Apps | Configuración base CRM | Formularios, vistas, BPF y seguridad por rol |
| Módulo 9 - Dataverse Avanzado | Datos y seguridad funcional | BPF, field security, reglas y relaciones |
| Módulo 20 - Dynamics 365 CE Sales y Customer Service | Core funcional CE | Sales, Customer Service, casos, colas, SLAs |
| Módulo 38 - Liderazgo Técnico y Gestión de Proyectos | Consultoría y stakeholders | Backlog, gestión de cambios, training |
| Módulo 55 - IA para Consultoría Funcional D365 | Fit-gap y análisis asistido | Documento de diseño y matriz de seguridad |
| Módulo 56 - Introducción Dynamics 365 Avanzado | Visión CE | Mapa funcional de apps CE |
| Módulo 57 - Customer Insights Data | Customer 360 | Perfil unificado, matching y medidas |
| Módulo 58 - Field Service | Servicio en campo | Work order, scheduling y UAT |
| LAB-057 | Diseño D365 Sales | Fit-gap Sales y entidades estándar |
| LAB-058 | Customer Insights Journeys | Segmento/journey como evidencia |
| LAB-059 | Field Service | Work order y validación funcional |
| LAB-066 | Sales lead-to-cash | Proceso comercial end-to-end |
| LAB-067 | Customer 360 | Unificación de perfil y métricas |
| LAB-068 | Customer Service | Caso, cola, SLA, dashboard y resolución |

## Evidencia de portafolio

Un portafolio CRM Functional debería incluir al menos:

- Documento funcional de 3-5 páginas: problema, AS-IS, TO-BE, alcance y exclusiones.
- Matriz fit-gap: estándar, configuración, personalización, fuera de alcance.
- Configuración case-to-resolution: caso, cola, SLA, escalamiento y dashboard.
- Matriz de colas: propósito, miembros, criterios de enrutamiento y prioridad.
- Diseño de SLA: KPIs, condiciones, pausa/reanudación, escalamiento y validación.
- Diseño de entitlements: cliente/producto, horas/casos, vigencia y reglas.
- Knowledge base: artículos mínimos, criterios de búsqueda y uso por agentes.
- Casos UAT con resultado pass/fail y defectos priorizados.
- Manual funcional o guía rápida para usuarios.
- Resumen ejecutivo de riesgos y decisiones.

## Preguntas de entrevista

### Configuración CRM

- ¿Cómo decides si un requerimiento se resuelve con configuración o personalización?
- ¿Qué diferencia hay entre tabla, formulario, vista y business rule?
- ¿Cuándo usarías un Business Process Flow?
- ¿Cómo validarías que un rol ve solo lo que corresponde?
- ¿Cómo documentas una configuración para soporte futuro?

### Customer Service

- ¿Cómo modelas un proceso case-to-resolution?
- ¿Cuándo crearías colas por equipo, producto, prioridad o región?
- ¿Qué diferencia hay entre una cola y un security role?
- ¿Cómo configuras un SLA y cómo pruebas que se dispara?
- ¿Para qué sirven los entitlements?
- ¿Cómo usarías knowledge articles para reducir tiempos de resolución?

### Dynamics 365 Sales

- ¿Cómo explicarías el ciclo lead-to-cash?
- ¿Qué entidades estándar usarías antes de personalizar Sales?
- ¿Qué pasa al calificar un lead?
- ¿Cuándo una oportunidad debería convertirse en quote/order?
- ¿Cómo manejarías un requerimiento que pide cambiar demasiado el proceso estándar?

### Reporting, UAT y soporte funcional

- ¿Qué KPIs usarías para un equipo de Customer Service?
- ¿Cómo escribirías un caso UAT verificable?
- ¿Cómo priorizas defectos encontrados en UAT?
- ¿Qué harías si usuarios reportan que una vista muestra datos incorrectos?
- ¿Cómo entrenarías usuarios resistentes al cambio?

### Consultoría funcional

- ¿Cómo levantas requerimientos con usuarios no técnicos?
- ¿Cómo manejas un stakeholder que pide personalizar todo?
- ¿Cómo explicas una limitación de producto sin sonar bloqueante?
- ¿Qué debe incluir un documento fit-gap?
- ¿Cómo presentas un capstone funcional en 10 minutos?

## Lab Job-Ready recomendado

Este lab aún no existe como contenido disponible. Es el roadmap recomendado para cerrar la ruta.

| Lab propuesto | Vacante que valida | Skills que valida | Evidencia esperada | Rúbrica sugerida | Dificultad | Duración | Relación con portafolio |
|---|---|---|---|---|---|---|---|
| JR-007 - Customer Service Specialist Job Simulation | CRM Functional / Customer Service Specialist | casos, colas, SLA, entitlements, KB, dashboard, UAT, soporte funcional | configuración funcional, matriz de colas/SLA, dashboard, casos UAT y manual | 35% proceso, 25% SLA/colas, 20% reporting, 20% soporte | Intermedia-Avanzada | 4 h | Demuestra configuración Customer Service y criterio funcional |

## Brechas críticas

1. Falta un lab dedicado JR-007 para Customer Service Specialist Job Simulation.
2. Entitlements y Knowledge Base están parcialmente cubiertos, pero necesitan práctica obligatoria.
3. Reporting operativo requiere un escenario funcional más fuerte.
4. Soporte funcional post-go-live y troubleshooting de configuración necesitan simulación.
5. Omnichannel/Contact Center avanzado sigue en roadmap y no debe presentarse como cubierto.

## Checklist antes de aplicar

- [ ] Puedo explicar el ciclo case-to-resolution.
- [ ] Tengo evidencia de configuración de caso, cola, SLA y dashboard.
- [ ] Puedo explicar entitlements y knowledge base con un ejemplo funcional.
- [ ] Puedo explicar el ciclo lead-to-cash usando entidades estándar.
- [ ] Tengo una matriz fit-gap clara.
- [ ] Tengo al menos 8 casos UAT con criterios verificables.
- [ ] Puedo preparar una demo funcional de 10 minutos.
- [ ] Puedo explicar qué brechas todavía tengo sin venderlas como experiencia.
- [ ] Puedo responder preguntas de usuarios no técnicos sin irme directo a código.

## Relación con recursos existentes

- Usa la [Matriz de Skills Laborales](MATRIZ_SKILLS_LABORALES.md) para ver cómo esta ruta encaja con otras vacantes.
- Usa la [Matriz de Competencias](MATRIZ_COMPETENCIAS.md) para criterios de evidencia demostrable.
- Usa [Cómo Convertir tus Labs en Portafolio Profesional](PORTAFOLIO_PROFESIONAL.md) para empaquetar documentos, capturas, UAT y decisiones funcionales.

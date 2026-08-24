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
| Administración CRM | Cubierto | Módulos 20, 56; LAB-077 | Configuración funcional documentada y evaluada en JR-007 | Reforzar troubleshooting de configuración post-go-live |
| Tablas, formularios y vistas | Cubierto | Módulos 4, 9, 20 | Formularios, vistas y pruebas por rol | Reforzar escenario CRM real |
| Business Process Flows | Cubierto | Módulos 4, 9, 20; LAB-066 | BPF con etapas y validaciones | Agregar troubleshooting funcional |
| Business rules | Parcial | Módulos 4, 9 | Reglas de negocio básicas | Falta evidencia específica |
| Customer Service cases | Cubierto | Módulo 20, LAB-068, LAB-077 | Case-to-resolution end-to-end evaluado en job simulation | Profundizar troubleshooting de casos mal enrutados |
| Queues | Cubierto | Módulo 20, LAB-068, LAB-077 | Cola configurada y enrutamiento | Profundizar criterios de diseño |
| SLAs | Cubierto | Módulo 20, LAB-068, LAB-077 | SLA con pausa/reanudación y escalamiento | Agregar troubleshooting |
| Entitlements | Cubierto | Módulo 20, LAB-068, LAB-077 | Política de cobertura por cliente evaluada en JR-007 | Profundizar reglas de vigencia y renovación |
| Knowledge base | Cubierto | Módulos 20, 22; LAB-068, LAB-077 | Artículos y búsqueda evaluados en JR-007 | Profundizar métricas de uso de KB |
| Dynamics 365 Sales | Cubierto | Módulos 20, 56, 60; LAB-066, LAB-081 | Lead-to-cash, forecasting y pipeline review | Mantener como evidencia CE avanzada |
| Customer Insights / Customer 360 | Cubierto | Módulos 58, 63; LAB-084, LAB-085, LAB-067 | Perfil unificado, consentimiento y real-time journey | Mantener como ruta específica Customer Insights |
| Field Service awareness | Cubierto | Módulo 59; LAB-086, LAB-087, LAB-059 | Work order, agreement preventivo, mobile offline y UAT | Mantener como ruta específica Field Service |
| Reporting y dashboards | Parcial | Módulos 6, 12, 20; LAB-068 | Dashboard operativo | Falta escenario funcional más fuerte (reporting profundo con Data Lake/Power BI sigue en roadmap) |
| Fit-gap | Cubierto | Módulos 20, 38, 55; LAB-057, LAB-062, LAB-101 | Matriz fit-gap | Conectar con entrevista funcional |
| Backlog funcional en Azure DevOps (historias + criterios de aceptación) | Cubierto | LAB-101 (JR-013) | Backlog Epics/Features/Historias con criterios de aceptación priorizado | Ninguna crítica |
| Sales lead-to-cash como job test dedicado | Cubierto | LAB-102 (JR-014) | Prueba técnica cronometrada solo de Sales (lead, opportunity, quote, order, invoice) | Ninguna crítica |
| UAT | Cubierto | Módulos 38, 55; LAB-055, LAB-062, LAB-101 | Casos UAT y sign-off | Conectar con soporte post-go-live |
| Soporte funcional post-go-live | Cubierto | Módulos 38, 55; LAB-101, LAB-103 (JR-015) | Manual, training, documento de soporte/adopción (LAB-101) e incidente funcional simulado con triage, causa raíz y fix de configuración (LAB-103) | Ninguna crítica |

## Secuencia recomendada de estudio

1. **Base model-driven y Dataverse:** Módulos 4 y 9 para tablas, formularios, vistas, BPF y seguridad funcional.
2. **Customer Engagement base:** Módulos 20 y 56 para Sales, Customer Service y entidades estándar.
3. **Customer Service hands-on:** LAB-068 para casos, colas, SLA, dashboard y ciclo case-to-resolution.
4. **Sales hands-on:** LAB-066 y LAB-057 para lead-to-cash, entidades estándar y fit-gap.
5. **Especializaciones CE:** LAB-084, LAB-085, LAB-086 y LAB-087 para Customer Insights y Field Service avanzado.
6. **Consultoría funcional:** Módulos 38 y 55, LAB-055 y LAB-062 para UAT, documentación, training, fit-gap y go-live.
7. **Caso integrado tipo vacante real:** LAB-101 (JR-013) para practicar el ciclo completo requerimiento→backlog en Azure DevOps→configuración→UAT en un solo caso de admisión, servicio, retención y cobranza.
8. **Job test dedicado y troubleshooting post-go-live:** LAB-102 (JR-014) para una prueba técnica cronometrada solo de Sales lead-to-cash, y LAB-103 (JR-015) para practicar un incidente funcional post-go-live (casos mal enrutados y SLA que no se dispara) — recomendados como cierre de la ruta antes de aplicar.

## Mapeo a contenido actual

| Contenido | Uso dentro de esta ruta | Qué debes extraer como evidencia |
|---|---|---|
| Módulo 4 - Model-Driven Apps | Configuración base CRM | Formularios, vistas, BPF y seguridad por rol |
| Módulo 9 - Dataverse Avanzado | Datos y seguridad funcional | BPF, field security, reglas y relaciones |
| Módulo 20 - Dynamics 365 CE Sales y Customer Service | Core funcional CE | Sales, Customer Service, casos, colas, SLAs |
| Módulo 38 - Liderazgo Técnico y Gestión de Proyectos | Consultoría y stakeholders | Backlog, gestión de cambios, training |
| Módulo 55 - IA para Consultoría Funcional D365 | Fit-gap y análisis asistido | Documento de diseño y matriz de seguridad |
| Módulo 57 - Dynamics 365 CE Avanzado | Visión CE | Mapa funcional de apps CE |
| Módulo 58 - Customer Insights Data | Customer 360 | Perfil unificado, matching y medidas |
| Módulo 59 - Field Service | Servicio en campo | Work order, scheduling y UAT |
| Módulo 61 - Sales Avanzado | Ventas enterprise | Forecasting, territories, pipeline review |
| Módulo 62 - Customer Service Avanzado | Servicio enterprise | SLA, entitlements, routing y métricas |
| Módulo 63 - Contact Center / Omnichannel | Operación omnicanal | Unified Routing, canales y supervisión |
| Módulo 64 - Customer Insights Journeys | Marketing en tiempo real | Journey con consentimiento, trigger y analítica |
| LAB-057 | Diseño D365 Sales | Fit-gap Sales y entidades estándar |
| LAB-059 | Field Service | Work order y validación funcional |
| LAB-066 | Sales lead-to-cash | Proceso comercial end-to-end |
| LAB-067 | Customer 360 | Unificación de perfil y métricas |
| LAB-068 | Customer Service | Caso, cola, SLA, dashboard y resolución |
| LAB-081 | Sales Forecasting & Pipeline Review | Forecast/pipeline review con evidencias |
| LAB-084 | Customer Insights Real-Time Journey | Journey con consentimiento y alternativa simulada |
| LAB-085 | Customer Insights Data Unification | Matching, medidas y activación de perfiles |
| LAB-086 | Field Service Preventive Maintenance | Agreement y mantenimiento preventivo |
| LAB-087 | Field Service Mobile Offline | Offline profile y ciclo de work order |

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

| Lab disponible | Vacante que valida | Skills que valida | Evidencia esperada | Dificultad | Duración | Relación con portafolio |
|---|---|---|---|---|---|---|
| LAB-077 (JR-007) - Customer Service Specialist Job Simulation | CRM Functional / Customer Service Specialist | casos, colas, SLA, entitlements, KB, dashboard, UAT, soporte funcional | configuración funcional, matriz de colas/SLA, dashboard, casos UAT y manual | Intermedia-Avanzada | 4 h | Demuestra configuración Customer Service y criterio funcional |
| LAB-101 (JR-013) - CRM Functional Analyst: Caso Integrado (Admisión, Servicio, Retención y Cobranza) | Analista Funcional CRM / Dynamics 365 (vacante tipo administración, workflows, casos/colas/SLA/entitlements, backlog en Azure DevOps, UAT) | AS-IS/TO-BE, fit-gap, backlog funcional en Azure DevOps con historias de usuario y criterios de aceptación, modelo de datos/seguridad, BPF, casos/colas/SLA/entitlements/KB, Power Automate, calidad de datos, auditoría de configuración, decisión config vs. automatización vs. plugin vs. integración, UAT y matriz de trazabilidad | documento de requerimientos, matriz fit-gap, backlog Azure DevOps exportado, modelo de datos, diseño de servicio, flujos Power Automate, matriz de calidad de datos, 10 casos UAT con defectos, documento de soporte/adopción y roadmap, presentación ejecutiva | Avanzada | 5 h | Único lab que cubre en un solo caso todo el ciclo requerimiento→backlog→configuración→prueba que pide esta vacante específica |
| LAB-102 (JR-014) - Dynamics 365 Sales: Lead-to-Cash Job Test | Dynamics 365 Sales Functional Consultant | calificación y conversión de leads, BPF de Opportunity con condición de rama, price lists y Quote, conversión Order/Invoice, casos de prueba end-to-end | diagrama del ciclo lead-to-cash, matriz de calificación de leads, 2 price lists con reglas de descuento, BPF con condición de rama, 5 casos de prueba con al menos un caso negativo | Intermedia-Avanzada | 2.5 h (cronometrado) | Prueba técnica dedicada solo a Sales, sin mezclar con Customer Service/retención/cobranza |
| LAB-103 (JR-015) - CRM Functional Post-Go-Live Incident Simulation | CRM Functional / Customer Service Specialist | triage funcional, análisis de causa raíz sobre evidencia de configuración (reglas de enrutamiento, definición de SLA), fix de configuración, plan de regresión, post-mortem | nota de triage, análisis de 3+ hipótesis descartadas/confirmadas, fix de configuración por síntoma, plan de regresión, post-mortem con acción preventiva | Avanzada | 2 h | Incidente funcional post-go-live simulado con evidencia, sin depender de código ni logs técnicos |

## Brechas críticas

1. Reporting operativo requiere un escenario funcional más fuerte que JR-007 (JR-013 aporta 5 indicadores ejecutivos, pero el reporting profundo con Data Lake/Power BI sigue en roadmap — ver `ROADMAP_ESPECIALIZACION_AVANZADA.md`; requiere una fuente de datos real, no solo documentación).
2. ~~Soporte funcional post-go-live y troubleshooting de configuración necesitan simulación adicional~~ — cerrada por LAB-103 (JR-015): incidente funcional simulado con evidencia de configuración (enrutamiento y SLA), triage, causa raíz, fix y post-mortem, en el mismo formato de "job test" que JR-012 (developer) pero para consultor funcional.
3. Omnichannel/Contact Center avanzado sigue en roadmap y no debe presentarse como cubierto (JR-013 lo trata como diseño conceptual en su Paso 10, consistente con este límite; una implementación real requiere licenciamiento de un proveedor de canal, fuera del alcance de este repositorio de contenido).
4. ~~Falta un job test dedicado para Dynamics 365 Sales (lead-to-cash)~~ — cerrada por LAB-102 (JR-014): prueba técnica cronometrada (150 min) exclusiva de Sales lead-to-cash, sin mezclarla con Customer Service/retención/cobranza.
5. Azure DevOps como **backlog funcional** (historias de usuario + criterios de aceptación, no ALM técnico) — cerrada por LAB-101/JR-013.

### Pendientes que siguen abiertos y por qué

Estos puntos no se cierran con contenido nuevo porque dependen de recursos que este repositorio no
controla — un proyecto de Azure DevOps o tenant productivo real, usuarios reales de una empresa,
licenciamiento de un proveedor de WhatsApp/telefonía, o una fuente de datos real para un Data Lake.
Un lab solo puede *simular* esas condiciones con evidencia realista (como hacen LAB-101, LAB-102 y
LAB-103); no puede sustituir la experiencia verificable en una organización real ni una integración
que dependa de un contrato externo:

- **Experiencia laboral verificable:** ningún lab, por bien diseñado que esté, sustituye el
  historial laboral en una empresa. Los labs producen evidencia de portafolio, no antigüedad
  laboral.
- **Azure DevOps/tenant en producción real:** LAB-101 acepta explícitamente un equivalente en
  Markdown/Excel porque exigir un tenant real excluiría a quien no tiene acceso a uno; quien sí lo
  tenga puede (y debería) ejecutar los pasos ahí.
- **WhatsApp/telefonía productivos:** requieren contratar un canal con un proveedor externo
  (licenciamiento real); el Paso 10 de LAB-101 documenta el diseño conceptual, que es lo que un
  analista funcional entrega antes de que el canal se contrate.
- **Data Lake/reporting profundo:** requiere una fuente de datos real para tener sentido; se
  mantiene en `ROADMAP_ESPECIALIZACION_AVANZADA.md` como candidato a un lab futuro cuando exista un
  dataset de referencia reutilizable.
- **Integración real con proveedores externos:** tratarla como implementación real requeriría
  credenciales y contratos con un proveedor específico (pasarela de pagos, sistema académico), que
  varían por vacante y no se pueden generalizar en contenido educativo.
- **Usuarios reales en discovery:** el Paso 1 de LAB-101 ya es explícito en que las entrevistas son
  simuladas con supuestos razonables — el ejercicio de valor es escribir un AS-IS defendible a
  partir de supuestos declarados, no inventar transcripciones de entrevistas reales.

## Checklist antes de aplicar

- [ ] Puedo explicar el ciclo case-to-resolution.
- [ ] Tengo evidencia de configuración de caso, cola, SLA y dashboard.
- [ ] Puedo explicar entitlements y knowledge base con un ejemplo funcional.
- [ ] Puedo explicar el ciclo lead-to-cash usando entidades estándar.
- [ ] Tengo una matriz fit-gap clara.
- [ ] Tengo un backlog funcional en Azure DevOps con historias de usuario y criterios de aceptación (LAB-101).
- [ ] Resolví una prueba técnica cronometrada solo de Sales lead-to-cash (LAB-102).
- [ ] Puedo diagnosticar un incidente funcional post-go-live con evidencia de configuración, no solo diseñar el proceso (LAB-103).
- [ ] Tengo al menos 8 casos UAT con criterios verificables.
- [ ] Puedo preparar una demo funcional de 10 minutos.
- [ ] Puedo explicar qué brechas todavía tengo sin venderlas como experiencia.
- [ ] Puedo responder preguntas de usuarios no técnicos sin irme directo a código.

## Relación con recursos existentes

- Usa la [Matriz de Skills Laborales](MATRIZ_SKILLS_LABORALES.md) para ver cómo esta ruta encaja con otras vacantes.
- Usa la [Matriz de Competencias](MATRIZ_COMPETENCIAS.md) para criterios de evidencia demostrable.
- Usa [Cómo Convertir tus Labs en Portafolio Profesional](PORTAFOLIO_PROFESIONAL.md) para empaquetar documentos, capturas, UAT y decisiones funcionales.

---
moduleId: 20
title: "Dynamics 365 CE — Sales y Customer Service"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 15
slug: "dynamics-365-ce-sales-y-customer-service"
---
### 🎯 Objetivo
Configurar y personalizar Dynamics 365 Customer Engagement entendiendo primero las capacidades estándar: Sales, Customer Service, Customer Insights y Field Service. El foco es mapear procesos reales contra entidades estándar, evitar duplicidad innecesaria y diseñar integraciones coherentes entre ventas, servicio, marketing, atención en campo y plataformas ERP/F&O.

### 📖 Conceptos Clave
- **Modelo estándar antes de personalizar:** Dynamics 365 Sales y Customer Service ya incluyen tablas, formularios, vistas, procesos y experiencias de usuario probadas. Antes de crear una tabla custom, el consultor debe mapear el proceso contra entidades estándar: `Lead`, `Opportunity`, `Account`, `Contact`, `Quote`, `Order`, `Invoice`, `Case`, `Queue`, `Knowledge Article` y `SLA KPI Instance`. Personalizar sin revisar lo estándar aumenta costo, deuda técnica y fricción en actualizaciones.
- **Lead-to-cash en Sales:** proceso comercial completo desde captura de lead hasta orden/facturación. Flujo típico: `Lead` calificado → `Opportunity` con stakeholder, necesidad y probabilidad → productos y price list → `Quote` enviada → `Order` cuando el cliente acepta. En proyectos reales, el diseño debe decidir qué vive en Sales y qué se delega a ERP/F&O para pricing avanzado, inventario, crédito, impuestos y facturación.
- **Cuentas y contactos:** `Account` representa organizaciones o clientes empresa; `Contact` representa personas. Un error frecuente es usar una tabla custom de "cliente" y perder integración nativa con actividades, oportunidades, casos, marketing y Customer Insights. Si el cliente pide atributos adicionales, se agregan columnas a las entidades estándar salvo que exista una razón de dominio muy fuerte para separar.
- **Catálogo de productos, price lists y unidades:** Sales usa productos, unidades, listas de precios y price list items para cotizar con consistencia. Si el pricing depende de reglas complejas de ERP, descuentos por contrato, impuestos o disponibilidad de inventario, Dynamics 365 Sales debe integrarse con F&O o el sistema ERP en vez de duplicar lógica financiera en Dataverse.
- **Sales Accelerator:** herramienta dentro de D365 Sales que crea y ejecuta secuencias de actividades predefinidas para los vendedores — llamadas, emails, tareas — con intervalos y condiciones configurables. Ejemplo: una secuencia "Seguimiento Propuesta" que 1 día después del envío de propuesta crea una tarea de llamada, y si no hay respuesta en 3 días envía un email automático de seguimiento. Se configura en Sales Hub → Sales Accelerator → Sequences.
- **Predictive Lead/Opportunity Scoring:** funcionalidad de IA de D365 Sales que analiza el historial de oportunidades ganadas/perdidas para entrenar un modelo ML y asignar un score del 1 al 99 a cada Lead y Oportunidad activa. Los vendedores ven qué oportunidades tienen mayor probabilidad de cerrar y pueden priorizar su trabajo. Requiere licencia D365 Sales Premium y mínimo 40 oportunidades históricas para entrenar el modelo.
- **Pipeline Intelligence:** análisis de tendencias del pipeline de ventas con IA integrada en D365 Sales. Detecta oportunidades en riesgo (sin actividad reciente), predice el cierre de oportunidades con fechas ajustadas automáticamente, y muestra tendencias del pipeline (crecimiento, pérdidas por etapa) en el módulo de pronóstico. Se activa en Configuración → Sales Insights.
- **Forecasting y gestión de pipeline:** Sales permite forecast por periodos, territorios, equipos, productos y jerarquías comerciales. El objetivo no es solo reportar ventas, sino detectar gaps de pipeline, oportunidades estancadas y forecast comprometido vs realista. En una implementación madura, forecast debe alinearse con seguridad por territorio y con gobierno de datos.
- **Dynamics 365 App for Outlook y Teams:** Outlook permite trackear emails, citas y contactos contra registros de Dynamics 365; Teams facilita colaboración contextual sobre cuentas, oportunidades y casos. No deben usarse como "extras bonitos": son parte de la adopción, porque reducen doble captura y llevan CRM al flujo de trabajo diario.
- **Copilot aplicado a ventas:** Copilot ayuda a resumir registros, preparar comunicaciones, priorizar oportunidades y acelerar seguimiento. Debe implementarse con gobierno de datos: permisos correctos, calidad de actividades, privacidad y entrenamiento de usuarios para no delegar decisiones comerciales críticas sin revisión humana.
- **Case Management:** módulo central de D365 Customer Service para gestionar incidencias de clientes desde apertura hasta resolución. Cada caso tiene un número único, cliente, descripción, prioridad, estado, SLA asociado, actividades (emails, llamadas, tareas), y puede estar relacionado con un producto, contrato, o entitlement. El ciclo de vida del caso sigue un BPF configurable.
- **Customer Service workspace:** experiencia moderna para agentes que permite manejar múltiples sesiones, consultar información relacionada, usar conocimiento y colaborar sin perder contexto. En implementaciones nuevas debe evaluarse antes de diseñar una app custom para agentes.
- **SLA (Service Level Agreement):** configuración en D365 Customer Service que define los tiempos máximos de respuesta y resolución para los casos. Los KPIs del SLA incluyen Primera Respuesta (tiempo hasta el primer email/llamada) y Resolución (tiempo hasta el cierre). Cuando se acerca la advertencia o se alcanza el fallo, el SLA dispara acciones automáticas: enviar email, actualizar prioridad, crear tarea de escalamiento. Los tiempos se calculan en horario de atención configurado en el Calendario de Servicio.
- **Entitlement:** registro en D365 Customer Service que define los derechos de soporte de un cliente: número de casos permitidos, horas de soporte, canales disponibles (teléfono, email, chat), y período de vigencia. Ejemplo: un cliente con contrato Premium tiene 50 casos por año via cualquier canal; un cliente estándar tiene soporte solo por email. El sistema descuenta automáticamente del entitlement al crear casos.
- **Queues:** colas de trabajo en D365 Customer Service donde se acumulan los casos, emails y tareas pendientes de atención. Los agentes trabajan desde sus colas asignadas. Pueden ser públicas (cualquier agente del equipo ve los ítems) o privadas. Los casos se enrutan a colas por reglas manuales o por Unified Routing automáticamente.
- **Routing Rules:** reglas de asignación automática de casos a colas o usuarios según condiciones del caso. Ejemplo: si el asunto contiene "factura", enrutar a la cola de Facturación; si el cliente tiene contrato Premium, enrutar a la cola de Soporte VIP. Son el mecanismo legacy previo a Unified Routing — aún funcionales pero Unified Routing es más potente.
- **Unified Routing:** motor de enrutamiento inteligente de D365 Customer Service que soporta skills-based routing (asignar al agente con las habilidades requeridas), capacity-based routing (respetar la carga máxima por agente), y ML-based assignment (aprender patrones de asignación del historial). Requiere configurar Workstreams, Queues con miembros, Skills y Skill levels por agente.
- **Customer Service Hub:** la aplicación Model-Driven de D365 Customer Service diseñada específicamente para agentes de soporte. Incluye timeline de actividades, panel de KB, timer de SLA visible, workspace de agente, y vista de cola. Es la interfaz unificada que reemplaza a la interfaz clásica de Dynamics.
- **Knowledge Base:** repositorio de artículos de soporte dentro de D365 Customer Service. Los artículos tienen ciclo de vida (Draft → In Review → Published) con aprobación opcional. Se vinculan a casos para trackear qué artículos resolvieron qué problemas. El agente puede buscar y enviar artículos directamente desde el formulario del caso. Copilot Studio puede usar la KB como Knowledge Source.
- **Canales digitales y voz:** Customer Service puede integrarse con experiencias de conversación, voz y mensajería digital según licenciamiento y oferta vigente. En proyectos nuevos conviene validar la experiencia recomendada por Microsoft para el tenant, porque algunos nombres históricos como "Omnichannel for Customer Service" siguen apareciendo en clientes existentes mientras Microsoft evoluciona hacia experiencias de workspace y ofertas digitales más modernas.
- **Copilot para agentes de servicio:** Copilot puede resumir conversaciones, sugerir respuestas, recuperar conocimiento y acelerar resolución. La calidad depende de datos, artículos KB, permisos y proceso; no reemplaza un modelo claro de escalamiento ni una base de conocimiento gobernada.
- **Customer Insights - Data:** plataforma CDP para construir perfiles unificados desde fuentes como Dataverse, Dynamics 365, data lakes, archivos o sistemas externos. Su valor no es "otro CRM", sino una vista 360 del cliente basada en identificación, unificación, enriquecimiento, medidas y segmentos. Debe usarse cuando Sales/Service no tienen por sí solos una visión completa del cliente.
- **Customer Insights - Journeys:** aplicación para orquestar journeys en tiempo real usando segmentos, triggers, emails, SMS/push según disponibilidad, personalización y consentimiento. Se diferencia del marketing clásico por reaccionar a eventos del cliente y usar datos unificados, no solo listas estáticas o campañas masivas.
- **Consentimiento y compliance:** Customer Insights - Journeys requiere perfiles de cumplimiento, propósitos, temas, centros de preferencias y registros de consentimiento. En proyectos reales, el consentimiento se diseña con Legal/Compliance desde el inicio; no se agrega al final como campo booleano improvisado.
- **Field Service:** aplicación D365 para coordinar servicio en campo: work orders, recursos, scheduling, bookings, customer assets, incident types, inspections, inventory, acuerdos y experiencia móvil para técnicos. Encaja cuando el trabajo ocurre fuera de oficina y requiere planificación, desplazamiento, evidencias, materiales o historial de activos.
- **Work order lifecycle:** ciclo operativo de Field Service donde una orden pasa por estados como unscheduled, scheduled, in progress, completed, posted o canceled. El arquitecto debe distinguir `Work Order` (trabajo a ejecutar) de `Booking` (asignación concreta de recurso/tiempo) y de `Case` (solicitud de soporte que puede originar el trabajo).
- **Schedule board y recursos:** el dispatcher asigna work orders considerando ubicación, disponibilidad, skills, prioridad y ventanas de servicio. Puede hacerlo manualmente, con Scheduling Assistant o con optimización avanzada cuando el volumen y restricciones lo justifican.
- **Field Service mobile e inspections:** los técnicos usan la app móvil para ver bookings, navegar al cliente, registrar tiempo, productos/servicios, fotos, firmas, inspecciones y notas. Si el servicio requiere captura estructurada, una inspection template evita evidencias incompletas y mejora trazabilidad.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 20.0: Mapeo estándar antes de personalizar
Antes de configurar, toma un proceso real o simulado de ventas y servicio y crea una matriz:

| Paso de negocio | Entidad estándar candidata | ¿Fit, gap o custom? | Decisión |
|---|---|---|---|
| Prospecto solicita información | Lead | Fit | Usar Lead estándar |
| Cliente acepta propuesta | Quote / Order | Fit parcial | Quote en Sales, Order validada contra ERP |
| Solicitud de soporte premium | Case + Entitlement + SLA | Fit | Usar Customer Service |
| Descuento requiere aprobación financiera | Opportunity + Power Automate / ERP | Gap | Flujo de aprobación + validación ERP |

Regla: una tabla custom solo se aprueba si no existe entidad estándar razonable o si mezclar conceptos compromete seguridad, reporting o propiedad de datos.

#### Actividad 20.1: Configurar Sales Process personalizado
1. D365 Sales → Configuración → Proceso de ventas → Nuevo BPF
2. Nombre: `Proceso Venta Consultiva`
3. Tabla: Oportunidad
4. Etapas:
    - **Descubrimiento** (Probabilidad: 10%)
     - Paso: Presupuesto del cliente (obligatorio)
     - Paso: Tomador de decisión identificado
     - Paso: Fecha de decisión estimada
    - **Propuesta** (Probabilidad: 30%)
     - Paso: Propuesta enviada (obligatorio)
     - Paso: Demo realizada
    - **Negociación** (Probabilidad: 60%)
     - Paso: Contrato en revisión legal
    - **Cierre** (Probabilidad: 90%)
     - Acción: Generar orden de compra
     - Acción: Notificar a proyectos

5. Activar el BPF y asignarlo al equipo de ventas

#### Actividad 20.1b: Cotizar, convertir a Order y forecast
1. **Crear la lista de precios y productos:**
   ```
   Price List: "Lista Estándar 2026"
   Producto: "Licencia Power Platform Premium" — Unidad: "Por usuario/mes"
   Price List Item:
     Método de cálculo de monto: Monto fijo
     Monto: $38.00 USD
     Cantidad mínima: 10
   ```
2. **Crear la Opportunity** con el producto agregado (10 licencias × $38 = $380/mes) y una probabilidad de 60% (etapa Negociación del BPF).
3. **Generar la Quote** desde la Opportunity: revisar que la línea de producto tome el precio de la Price List Item automáticamente (no capturarlo a mano) y agregar un descuento de línea del 10% para negociar.
4. **Activar y enviar la Quote** al cliente (estado `Active` → `Presented`).
5. **Convertir la Quote a Order** cuando el cliente acepta (`Won` → botón "Create Order"): verificar que las líneas de producto y el monto total pasan intactos de Quote a Order.
6. **Frontera con ERP/F&O:** en este ejercicio, el Order queda en Dynamics 365 Sales como registro de la venta cerrada — la factura real, el cálculo de impuestos y el descuento de inventario NO se generan aquí (ver Módulo 34 para dónde vive esa responsabilidad en una arquitectura con F&O).
7. **Forecast:** con 3-4 oportunidades de ejemplo en distintas etapas (usa las probabilidades del BPF del paso anterior), calcula a mano el forecast ponderado:

   | Oportunidad | Monto | Etapa (probabilidad) | Monto ponderado |
   |---|---:|---|---:|
   | Renovación Contoso | $12,000 | Negociación (60%) | $7,200 |
   | Nueva cuenta Fabrikam | $8,000 | Propuesta (30%) | $2,400 |
   | Ampliación Litware | $20,000 | Cierre (90%) | $18,000 |
   | **Total ponderado** | | | **$27,600** |

   Configura el mismo cálculo en el módulo de Forecasting de Sales Hub (Configuración → Forecasting → Nuevo forecast, periodicidad mensual) y verifica que el sistema calcule el mismo total ponderado que la tabla manual — si no coincide, revisa que las probabilidades del BPF estén bien asignadas por etapa.

#### Actividad 20.2: Email-to-Case automation
1. D365 Customer Service → Configuración → Canales → Email
2. Crear mailbox: `soporte@empresa.com` → sincronizar con Exchange
3. Configurar regla de conversión automática:
    - Configuración → Reglas de creación y actualización de registros
    - Tipo de actividad: Email
    - Condición: Para = `soporte@empresa.com`
    - Acción: Crear caso
    - Mapeos:
     ```
     Caso.Asunto ← Email.Asunto
     Caso.Descripción ← Email.Cuerpo
     Caso.Cliente ← Email.De (buscar en Contactos/Cuentas)
     Caso.Canal de origen ← "Email"
     ```

#### Actividad 20.3: SLA con KPIs y escalamiento
1. Configuración → SLA → Nuevo SLA
2. Nombre: `SLA Soporte Estándar`
3. Tabla: Caso
4. **KPI 1: Primera respuesta**
    - Advertencia: 2 horas
    - Fallo: 4 horas
    - Aplicable cuando: Prioridad = Normal
    - Acción en fallo: Enviar email a supervisor + cambiar prioridad a Alta

5. **KPI 2: Resolución**
    - Advertencia: 20 horas (días hábiles)
    - Fallo: 24 horas (días hábiles)
    - Acción en fallo: Escalar a Nivel 2 + notificar gerente

6. Configurar horario de atención:
    - Configuración → Calendarios de servicio al cliente
    - Lunes–Viernes 8am–6pm, zona horaria Bogotá

7. Asociar el SLA al tipo de caso y activar

#### Actividad 20.4: Enrutamiento con Unified Routing
1. Customer Service Hub → Unified Routing → Configuración
2. Crear Queue: `Cola_Soporte_Técnico`
3. Crear Queue: `Cola_Soporte_Facturación`
4. Definir skills: `SQL_Server`, `SAP`, `Power_BI`, `Hardware`
5. Asignar skills a agentes con nivel de competencia (1-5)
6. Workstream: `WS_Email_Soporte`
    - Canal: Email
    - Modo de distribución: Push (asignación automática)

7. Regla de enrutamiento:
   ```
   Si Asunto contiene "factura" OR "cobro" OR "pago"
     → Enrutar a Cola_Soporte_Facturación
   
   Si Asunto contiene "error" OR "falla" OR "no funciona"
     → Enrutar a Cola_Soporte_Técnico
     → Requerir skill SQL_Server (nivel ≥ 3) si Descripción contiene "base de datos"
   
   Default → Cola_Soporte_Técnico
   ```

#### Actividad 20.5: Knowledge Base integrada
1. Customer Service Hub → Base de conocimientos → Nuevo artículo
2. Crear 5 artículos de soluciones frecuentes con:
    - Título, contenido HTML, palabras clave, categoría
    - Publicar artículos (flujo de aprobación opcional)

3. En formulario de Caso: panel "KB" → buscar artículos relacionados
4. Configurar sugerencia automática de KB en Copilot Studio (Módulo 22)

#### Actividad 20.6: Outlook, Teams y adopción comercial
1. Identificar 3 actividades comerciales que hoy ocurren fuera de CRM:
   - emails de seguimiento,
   - reuniones de demo,
   - conversaciones internas sobre descuentos.

2. Diseñar cómo se registrarán en Dynamics 365:
   - Emails importantes se trackean contra Opportunity o Account desde Outlook.
   - Reuniones se relacionan con Opportunity y Contact.
   - Conversaciones de Teams se vinculan al registro cuando aplique.

3. Definir una regla de adopción:
   - Oportunidad sin actividad en 7 días → alerta al vendedor.
   - Quote sin respuesta en 5 días hábiles → tarea de seguimiento.
   - Descuento mayor a 15% → aprobación antes de enviar quote.

#### Actividad 20.7: Customer Service workspace y Copilot
1. Diseñar una vista de trabajo para agentes con:
   - casos asignados,
   - casos vencidos o próximos a vencer SLA,
   - artículos sugeridos,
   - prioridad y tipo de cliente.

2. Definir qué puede resumir Copilot:
   - historial del caso,
   - última conversación,
   - artículos KB relacionados,
   - próximos pasos sugeridos.

3. Definir controles:
   - el agente revisa la respuesta antes de enviarla,
   - datos sensibles no se copian en prompts externos,
   - cada artículo KB tiene owner y fecha de revisión.

#### Actividad 20.8: Customer Insights — diseño mínimo de segmento y journey
Escenario: el área comercial quiere contactar clientes con contrato próximo a vencer, pero solo si tienen consentimiento válido y no tienen un caso crítico abierto.

1. Identificar, sin diseñarlo aún en detalle, qué 3-4 fuentes alimentarían el perfil unificado (Sales, Customer Service, billing/ERP, registros de consentimiento) y qué aporta cada una.
2. Enunciar en una frase la regla del segmento (ej. "renovación en 60 días, con consentimiento, sin caso crítico abierto") y el evento que dispara el journey.

El diseño completo —segmento con datos de prueba, journey etapa por etapa, métricas y validación de exclusiones— se ejercita a fondo en **Lab 58 (Customer Insights — Segmento y Journey)**: resuélvelo ahí en vez de repetirlo en prosa aquí.

#### Actividad 20.9: Field Service — diseño mínimo del ciclo caso a orden de trabajo
Escenario: un cliente reporta falla de un equipo en garantía y requiere visita técnica.

1. Identificar, sin configurarlo aún, la secuencia mínima: Case (Customer Service) → validación de Entitlement → Work Order (Field Service) → Booking → ejecución móvil → cierre.
2. Enunciar qué dato de garantía o SLA decide si el Work Order se crea o se rechaza.

El diseño completo —datos mínimos de Work Order, criterios de scheduling, evidencia móvil y 5 casos UAT— se ejercita a fondo en **Lab 59 (Field Service — Work Order y UAT)**: resuélvelo ahí en vez de repetirlo en prosa aquí.

### 💼 Caso Real de Negocio
**Empresa:** Empresa de software con 5,000 clientes y mesa de ayuda de 30 agentes  
**Problema:** Los casos se asignaban por turno rotativo sin considerar el expertise del agente. Un caso de SAP llegaba a un agente de Power BI.  
**Solución:** Unified Routing con skills-based routing. Agentes califican sus skills. Los casos de SAP van automáticamente a agentes con skill SAP nivel ≥ 3. SLA diferenciado para clientes Premium (4h resolución) vs Estándar (24h).  
**Resultado:** First-contact resolution: de 45% a 72%. Satisfacción del cliente (CSAT): de 3.2 a 4.4/5.

**Escenario Customer Insights:** una aseguradora enviaba campañas genéricas a clientes con reclamos abiertos. El equipo integró Customer Insights - Data con Sales, Service y billing, creó segmentos que excluyen casos críticos y orquestó journeys de renovación con consentimiento válido. Resultado esperado: menos quejas por comunicaciones inoportunas y mayor conversión en renovaciones.

**Escenario Field Service:** una empresa de mantenimiento industrial gestionaba visitas en Excel y WhatsApp. Al adoptar Field Service, los casos de soporte generan work orders, el dispatcher asigna técnicos por skill y ubicación, y el técnico captura inspecciones desde móvil. Resultado esperado: menor tiempo de asignación, evidencias auditables y mejor cumplimiento de SLA.

### ✅ Buenas Prácticas
- Siempre usar Calendar de servicio en SLAs — los tiempos deben ser en horas hábiles, no absolutas
- Mapear primero contra entidades estándar; personalizar solo cuando el gap esté documentado
- Separar responsabilidades Sales vs ERP: Sales gestiona relación, pipeline y cotización comercial; ERP/F&O gobierna contabilidad, impuestos, inventario, crédito y facturación cuando aplica
- Tener Knowledge Base robusta antes de implementar Copilot Studio para reducir hallucinations
- Unified Routing > Reglas de enrutamiento legacy — migrar si estás en el sistema viejo
- Usar entitlements para clientes con niveles de soporte diferenciados
- En Customer Insights, diseñar consentimiento, exclusiones y preferencias antes de activar journeys
- En Field Service, no confundir Case con Work Order: el caso explica la solicitud; la orden de trabajo coordina ejecución en campo
- Usar assets e incident types para estandarizar diagnóstico, materiales y duración esperada

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| SLA no se activa | SLA no está configurado como "default" para el tipo de caso | Marcar SLA como predeterminado en la configuración |
| Email-to-Case duplica casos | Respuestas al email crean casos nuevos | Configurar que el email de respuesta use el ID del caso en el asunto |
| Routing no asigna a agentes | Cola sin miembros o capacidad de agentes = 0 | Verificar membresía de cola y límite de capacidad por agente |
| Se crea una tabla custom de Clientes | No se revisó Account/Contact estándar | Extender Account/Contact salvo que exista una justificación fuerte y documentada |
| Pricing duplicado en Dataverse y ERP | Se intentó resolver todo en Sales | Definir sistema maestro: Sales cotiza, ERP valida precio final, impuestos, inventario y crédito |
| Journey enviado sin consentimiento válido | Marketing diseñó la campaña antes de Compliance | Crear compliance profile, propósitos y temas antes de publicar journeys |
| Customer Insights usado como CRM operativo | Se confundió CDP con sistema transaccional | Usar Customer Insights para perfiles, segmentos e insights; mantener operación en Sales/Service/F&O |
| Field Service implementado como calendario simple | Se ignoraron work orders, bookings, skills y assets | Modelar ciclo completo: Case → Work Order → Booking → Mobile execution → cierre |

### 🧪 Criterios de Validación
- [ ] Matriz fit-gap contra entidades estándar creada antes de personalizar
- [ ] BPF de venta consultiva con 4 etapas funciona en formulario de Oportunidad
- [ ] Quote convertida a Order conserva el precio de la Price List Item y el descuento de línea
- [ ] Forecast ponderado calculado a mano coincide con el forecast configurado en Sales Hub
- [ ] Email a `soporte@empresa.com` crea caso automáticamente con mapeo correcto
- [ ] SLA escalada al supervisor cuando el caso excede 4 horas sin primera respuesta
- [ ] Unified Routing dirige casos de facturación a la cola correcta
- [ ] 5 artículos KB publicados y visibles en el panel del caso
- [ ] Outlook/Teams tienen reglas claras de adopción y trazabilidad
- [ ] Copilot para agentes tiene controles humanos y KB gobernada
- [ ] Fuentes y regla mínima del segmento de Customer Insights identificadas (detalle completo en Lab 58)
- [ ] Secuencia mínima Case→Entitlement→Work Order→Booking identificada (detalle completo en Lab 59)

---

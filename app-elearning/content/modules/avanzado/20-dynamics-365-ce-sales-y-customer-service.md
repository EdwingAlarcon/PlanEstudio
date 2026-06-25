---
moduleId: 20
title: "Dynamics 365 CE — Sales y Customer Service"
level: "avanzado"
certification: "PL-400"
estimatedMinutes: 8
slug: "dynamics-365-ce-sales-y-customer-service"
---
### 🎯 Objetivo
Configurar y personalizar Dynamics 365 Sales y Customer Service: sales process con BPF personalizado, email-to-case automation, SLA con KPIs, entitlement management, y enrutamiento inteligente de casos con Unified Routing.

### 📖 Conceptos Clave
- **Sales Accelerator:** herramienta dentro de D365 Sales que crea y ejecuta secuencias de actividades predefinidas para los vendedores — llamadas, emails, tareas — con intervalos y condiciones configurables. Ejemplo: una secuencia "Seguimiento Propuesta" que 1 día después del envío de propuesta crea una tarea de llamada, y si no hay respuesta en 3 días envía un email automático de seguimiento. Se configura en Sales Hub → Sales Accelerator → Sequences.
- **Predictive Lead/Opportunity Scoring:** funcionalidad de IA de D365 Sales que analiza el historial de oportunidades ganadas/perdidas para entrenar un modelo ML y asignar un score del 1 al 99 a cada Lead y Oportunidad activa. Los vendedores ven qué oportunidades tienen mayor probabilidad de cerrar y pueden priorizar su trabajo. Requiere licencia D365 Sales Premium y mínimo 40 oportunidades históricas para entrenar el modelo.
- **Pipeline Intelligence:** análisis de tendencias del pipeline de ventas con IA integrada en D365 Sales. Detecta oportunidades en riesgo (sin actividad reciente), predice el cierre de oportunidades con fechas ajustadas automáticamente, y muestra tendencias del pipeline (crecimiento, pérdidas por etapa) en el módulo de pronóstico. Se activa en Configuración → Sales Insights.
- **Case Management:** módulo central de D365 Customer Service para gestionar incidencias de clientes desde apertura hasta resolución. Cada caso tiene un número único, cliente, descripción, prioridad, estado, SLA asociado, actividades (emails, llamadas, tareas), y puede estar relacionado con un producto, contrato, o entitlement. El ciclo de vida del caso sigue un BPF configurable.
- **SLA (Service Level Agreement):** configuración en D365 Customer Service que define los tiempos máximos de respuesta y resolución para los casos. Los KPIs del SLA incluyen Primera Respuesta (tiempo hasta el primer email/llamada) y Resolución (tiempo hasta el cierre). Cuando se acerca la advertencia o se alcanza el fallo, el SLA dispara acciones automáticas: enviar email, actualizar prioridad, crear tarea de escalamiento. Los tiempos se calculan en horario de atención configurado en el Calendario de Servicio.
- **Entitlement:** registro en D365 Customer Service que define los derechos de soporte de un cliente: número de casos permitidos, horas de soporte, canales disponibles (teléfono, email, chat), y período de vigencia. Ejemplo: un cliente con contrato Premium tiene 50 casos por año via cualquier canal; un cliente estándar tiene soporte solo por email. El sistema descuenta automáticamente del entitlement al crear casos.
- **Queues:** colas de trabajo en D365 Customer Service donde se acumulan los casos, emails y tareas pendientes de atención. Los agentes trabajan desde sus colas asignadas. Pueden ser públicas (cualquier agente del equipo ve los ítems) o privadas. Los casos se enrutan a colas por reglas manuales o por Unified Routing automáticamente.
- **Routing Rules:** reglas de asignación automática de casos a colas o usuarios según condiciones del caso. Ejemplo: si el asunto contiene "factura", enrutar a la cola de Facturación; si el cliente tiene contrato Premium, enrutar a la cola de Soporte VIP. Son el mecanismo legacy previo a Unified Routing — aún funcionales pero Unified Routing es más potente.
- **Unified Routing:** motor de enrutamiento inteligente de D365 Customer Service que soporta skills-based routing (asignar al agente con las habilidades requeridas), capacity-based routing (respetar la carga máxima por agente), y ML-based assignment (aprender patrones de asignación del historial). Requiere configurar Workstreams, Queues con miembros, Skills y Skill levels por agente.
- **Customer Service Hub:** la aplicación Model-Driven de D365 Customer Service diseñada específicamente para agentes de soporte. Incluye timeline de actividades, panel de KB, timer de SLA visible, workspace de agente, y vista de cola. Es la interfaz unificada que reemplaza a la interfaz clásica de Dynamics.
- **Knowledge Base:** repositorio de artículos de soporte dentro de D365 Customer Service. Los artículos tienen ciclo de vida (Draft → In Review → Published) con aprobación opcional. Se vinculan a casos para trackear qué artículos resolvieron qué problemas. El agente puede buscar y enviar artículos directamente desde el formulario del caso. Copilot Studio puede usar la KB como Knowledge Source.
- **Omnichannel for Customer Service:** extensión de D365 Customer Service que agrega soporte para canales de comunicación en tiempo real: chat web, WhatsApp Business, SMS, Facebook Messenger, Apple Messages for Business, y Microsoft Teams. Los agentes atienden múltiples conversaciones simultáneas desde un workspace unificado. Requiere licencia adicional de Omnichannel.

### 👨‍💻 Actividades Prácticas Paso a Paso

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

### 💼 Caso Real de Negocio
**Empresa:** Empresa de software con 5,000 clientes y mesa de ayuda de 30 agentes  
**Problema:** Los casos se asignaban por turno rotativo sin considerar el expertise del agente. Un caso de SAP llegaba a un agente de Power BI.  
**Solución:** Unified Routing con skills-based routing. Agentes califican sus skills. Los casos de SAP van automáticamente a agentes con skill SAP nivel ≥ 3. SLA diferenciado para clientes Premium (4h resolución) vs Estándar (24h).  
**Resultado:** First-contact resolution: de 45% a 72%. Satisfacción del cliente (CSAT): de 3.2 a 4.4/5.

### ✅ Buenas Prácticas
- Siempre usar Calendar de servicio en SLAs — los tiempos deben ser en horas hábiles, no absolutas
- Tener Knowledge Base robusta antes de implementar Copilot Studio para reducir hallucinations
- Unified Routing > Reglas de enrutamiento legacy — migrar si estás en el sistema viejo
- Usar entitlements para clientes con niveles de soporte diferenciados

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| SLA no se activa | SLA no está configurado como "default" para el tipo de caso | Marcar SLA como predeterminado en la configuración |
| Email-to-Case duplica casos | Respuestas al email crean casos nuevos | Configurar que el email de respuesta use el ID del caso en el asunto |
| Routing no asigna a agentes | Cola sin miembros o capacidad de agentes = 0 | Verificar membresía de cola y límite de capacidad por agente |

### 🧪 Criterios de Validación
- [ ] BPF de venta consultiva con 4 etapas funciona en formulario de Oportunidad
- [ ] Email a `soporte@empresa.com` crea caso automáticamente con mapeo correcto
- [ ] SLA escalada al supervisor cuando el caso excede 4 horas sin primera respuesta
- [ ] Unified Routing dirige casos de facturación a la cola correcta
- [ ] 5 artículos KB publicados y visibles en el panel del caso

---

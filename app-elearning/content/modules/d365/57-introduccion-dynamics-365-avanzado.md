---
moduleId: 57
title: "Dynamics 365 CE Avanzado — Customer Engagement como Ecosistema Enterprise"
level: "d365"
certification: "D365 CE avanzado + F&O awareness"
estimatedMinutes: 12
slug: "introduccion-dynamics-365-avanzado"
---
### 🎯 Objetivo
Entender por qué Dynamics 365 Sales, Customer Service, Contact Center, Customer Insights y Field Service no son productos aislados sino capas de una arquitectura enterprise sobre Dataverse, reconocer el mapa completo de este nivel transversal, y explicar el ciclo de negocio que conecta marketing, venta, servicio, operación de campo, ERP y fidelización.

### 📖 Conceptos Clave
- **Dataverse como base común:** Sales, Customer Service y Field Service no son bases de datos separadas — son aplicaciones (Model-Driven Apps con lógica y UX propias) construidas sobre el mismo Dataverse. `Account` y `Contact` son las mismas tablas vistas desde Sales o desde Customer Service; un Contact con un caso abierto en Service es visible como el mismo registro en la vista de Sales, sin sincronización ni duplicación.
- **ALM compartido:** una solución de Dataverse que empaqueta personalizaciones de Sales (formularios de Opportunity) puede convivir en la misma solución que personalizaciones de Customer Service (formularios de Case) — el mismo pipeline CI/CD, el mismo Solution Checker y las mismas Connection References del Módulo 19 aplican igual a "Dynamics 365 CE" que a cualquier app de Power Platform. No existe un ALM distinto "para D365".
- **Copilot transversal:** las capacidades de Copilot (resumen de casos, redacción de emails, respuestas sugeridas) no son una función de un solo producto — están disponibles en Sales, Customer Service y Field Service porque leen y escriben sobre el mismo Dataverse, con el mismo modelo de gobierno de datos que cualquier otro flujo de IA de Power Platform.
- **El ciclo de negocio completo (de marketing a fidelización):**
  1. **Marketing → Venta:** Customer Insights - Journeys identifica y nutre leads (segmentación, journeys); cuando un contacto califica, se convierte en `Lead` o se crea una `Opportunity` en Sales.
  2. **Venta → Servicio:** al cerrar una venta, el `Account`/`Contact` y lo vendido (productos, contrato) quedan disponibles para Customer Service — un caso de soporte no empieza de cero, hereda el historial comercial.
  3. **Servicio → Campo:** si un caso requiere una visita física, Customer Service crea un `Work Order` que Field Service programa, ejecuta y cierra con evidencia.
  4. **Servicio/Campo → Fidelización:** el historial de casos y visitas alimenta de vuelta a Customer Insights - Data (Customer 360), que puede activar un nuevo journey de renovación o detectar riesgo de abandono.
- **Gobierno y seguridad compartidos:** los roles de seguridad, las Business Units y las políticas DLP del Módulo 16/32 aplican a las 4 aplicaciones a la vez — un mismo usuario puede tener acceso distinto a Sales y a Service dentro del mismo entorno, sin que eso implique sistemas separados.
- **Integración con Microsoft 365 — transversal, no solo de Sales:** la integración con Outlook y Teams (vista en el Módulo 20 aplicada a ventas) no es una característica exclusiva de Sales — un agente de Customer Service puede colaborar sobre un Case desde Teams igual que un vendedor sobre una Opportunity, y un técnico de Field Service puede recibir la notificación de un Booking por Outlook. Es la misma capa de adopción (reducir doble captura, llevar el CRM al flujo de trabajo diario) aplicada a las 4 aplicaciones, no una integración distinta por producto.
- **Roles típicos en un proyecto Customer Engagement:** Consultor Funcional (por producto o transversal), Solution Architect (diseña la arquitectura común), Developer (extiende con plugins/PCF que pueden tocar cualquiera de las 4 apps), y el rol de Data/CDP Specialist para Customer Insights - Data.
- **Posicionamiento del nivel:** este nivel ya no es solo "una introducción a D365"; es una especialización práctica de Dynamics 365: CE avanzado + F&O Awareness. Cubre CE profundo (Sales, Customer Service, Contact Center, Customer Insights, Field Service) y awareness avanzado de F&O para conversaciones de arquitectura, integración y ownership de datos.
- **Requisitos reales de práctica:** leer y diseñar matrices puede hacerse sin tenant. Configurar forecasting, SLA, unified routing, real-time journeys, Field Service Mobile, RSO o dual-write requiere ambiente real, licencias correspondientes y permisos de administración/configuración.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Dibuja (en papel o una herramienta de diagramación) las 4 aplicaciones — Sales, Customer Service, Customer Insights, Field Service — como capas sobre un único círculo central "Dataverse". No dibujes flechas de sincronización entre ellas: dibuja flechas desde cada app HACIA el círculo central, para representar que comparten el dato, no que se lo envían entre sí.
2. Toma el ciclo de negocio de la sección de Conceptos Clave y aplícalo a un caso propio (real o inventado): identifica qué evento dispara el paso de una etapa a la siguiente (ej. "¿qué dispara que un Lead se convierta en Oportunidad?", "¿qué dispara que un Caso genere un Work Order?").
3. Revisa el Módulo 20 (Dynamics 365 CE — Sales y Customer Service) y identifica una decisión de seguridad (rol, Business Unit) que ya se tomó ahí — explica por qué esa misma decisión también aplicaría si agregas Customer Insights o Field Service al mismo entorno, sin duplicar el modelo de seguridad.
4. Enumera, sin entrar en detalle todavía (los módulos siguientes lo cubren), qué vas a profundizar en este nivel: Sales avanzado, Customer Service avanzado, Contact Center/Omnichannel, Customer Insights - Data, Customer Insights - Journeys, Field Service end-to-end, F&O awareness, integración CE + F&O y capstone enterprise.
5. Crea una tabla con 3 columnas: "puedo practicar sin tenant", "requiere tenant/licencia" y "evidencia esperada". Ubica forecasting, SLA, routing, journeys, mobile offline, RSO y dual-write en la columna correcta.

### 💼 Casos Reales de Negocio
Una aseguradora mediana implementó Sales y Customer Service en proyectos separados, con dos consultoras distintas, en momentos distintos. El resultado: dos modelos de seguridad incompatibles (Sales usaba Business Units por región, Customer Service usaba equipos por producto), y un Contact que existía duplicado porque el proyecto de Service no reutilizó las tablas ya pobladas por Sales. La corrección — meses después — fue dolorosa: unificar duplicados, migrar dos modelos de seguridad a uno, y renegociar el alcance con ambas consultoras. La lección no es técnica, es de gobierno de proyecto: **Sales y Customer Service comparten Dataverse desde el día uno, se implementen juntos o no** — tratarlos como proyectos independientes garantiza este tipo de retrabajo.

### ✅ Buenas Prácticas
- Al iniciar cualquier proyecto D365 CE, diseñar el modelo de seguridad (roles, Business Units) pensando en TODAS las aplicaciones que eventualmente convivirán en el entorno, no solo la que se implementa primero.
- Nunca crear una tabla custom para "clientes de Servicio" o "clientes de Ventas" por separado — Account/Contact ya son compartidos; crear tablas paralelas es la causa más común de duplicidad de datos en proyectos D365 CE.
- Documentar explícitamente, en cualquier Fit-Gap de D365, qué eventos disparan el paso de una aplicación a otra (Lead→Opportunity, Case→Work Order) — es la arquitectura real del proceso, no un detalle técnico menor.
- Tratar Copilot como una capa transversal de gobierno único, no como una función a configurar por separado en cada aplicación.
- Separar explícitamente contenido de diseño (matrices, decisiones, mapas de proceso) de contenido que requiere ambiente real para no prometer una práctica que el estudiante no podrá ejecutar sin licencias.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Crear tablas custom paralelas a Account/Contact para "aislar" un producto | No reconocer que Dataverse ya es compartido | Usar las entidades estándar y diferenciar por vista/seguridad, no por tabla nueva |
| Diseñar el modelo de seguridad pensando solo en la app que se implementa primero | Proyectos por fases sin visión de arquitectura conjunta | Diseñar el modelo de Business Units/roles pensando en el estado final del ecosistema CE |
| Tratar el ALM de "D365" como distinto al de Power Platform | Desconocimiento de que son la misma plataforma de soluciones | Reutilizar el mismo pipeline, Connection References y Environment Variables del Módulo 19 |
| Pensar en Customer Insights solo como "otra herramienta de email" | No conectar Customer Insights - Data con el resto del ciclo (Customer 360) | Diseñar la activación de datos hacia Journeys como parte del mismo ciclo de negocio, no aislada |
| Omitir Contact Center porque "ya existe Customer Service" | No distinguir casos de conversaciones/canales en tiempo real | Modelar Customer Service para casos y Contact Center para canales, presencia y routing |
| Presentar F&O como algo que se implementa desde CE | Se confunde awareness con especialización F&O | Declarar F&O como dominio ERP separado y enfocarse en integración/ownership desde CE |

### 🧪 Criterios de Validación
- [ ] Explico por qué Sales y Customer Service comparten Account/Contact sin sincronización
- [ ] Dibujé el mapa de las 4 aplicaciones sobre Dataverse sin flechas de sincronización entre ellas
- [ ] Identifiqué los 4 eventos que conectan marketing→venta→servicio→campo→fidelización en un caso propio
- [ ] Puedo explicar por qué el ALM de una solución D365 CE es el mismo ALM de cualquier solución Power Platform
- [ ] Separé qué prácticas requieren tenant/licencia real y cuáles pueden entregarse como diseño documentado
- [ ] Puedo posicionar Contact Center, Customer Insights Data/Journeys y F&O dentro del mapa enterprise

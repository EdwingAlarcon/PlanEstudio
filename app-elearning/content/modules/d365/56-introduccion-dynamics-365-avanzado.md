---
moduleId: 56
title: "Introducción a Dynamics 365 Avanzado — Customer Engagement como Ecosistema"
level: "d365"
certification: "Especialista Dynamics 365 CE"
estimatedMinutes: 10
slug: "introduccion-dynamics-365-avanzado"
---
### 🎯 Objetivo
Entender por qué Dynamics 365 Sales, Customer Service, Customer Insights y Field Service no son productos aislados sino capas de una misma plataforma (Dataverse), reconocer el mapa de este nivel transversal, y explicar el ciclo de negocio completo que conecta marketing, venta, servicio y fidelización antes de profundizar en cada producto por separado.

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
- **Roles típicos en un proyecto Customer Engagement:** Consultor Funcional (por producto o transversal), Solution Architect (diseña la arquitectura común), Developer (extiende con plugins/PCF que pueden tocar cualquiera de las 4 apps), y el rol de Data/CDP Specialist para Customer Insights - Data.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Dibuja (en papel o una herramienta de diagramación) las 4 aplicaciones — Sales, Customer Service, Customer Insights, Field Service — como capas sobre un único círculo central "Dataverse". No dibujes flechas de sincronización entre ellas: dibuja flechas desde cada app HACIA el círculo central, para representar que comparten el dato, no que se lo envían entre sí.
2. Toma el ciclo de negocio de la sección de Conceptos Clave y aplícalo a un caso propio (real o inventado): identifica qué evento dispara el paso de una etapa a la siguiente (ej. "¿qué dispara que un Lead se convierta en Oportunidad?", "¿qué dispara que un Caso genere un Work Order?").
3. Revisa el Módulo 20 (Dynamics 365 CE — Sales y Customer Service) y identifica una decisión de seguridad (rol, Business Unit) que ya se tomó ahí — explica por qué esa misma decisión también aplicaría si agregas Customer Insights o Field Service al mismo entorno, sin duplicar el modelo de seguridad.
4. Enumera, sin entrar en detalle todavía (los módulos siguientes lo cubren), qué vas a profundizar en este nivel: Sales end-to-end, Customer Service end-to-end, Customer Insights - Data, Field Service end-to-end, y la integración con Finance & Operations — y en qué orden te conviene estudiarlos según tu rol objetivo (Consultor Funcional D365 CE vs. Solution Architect).

### 💼 Casos Reales de Negocio
Una aseguradora mediana implementó Sales y Customer Service en proyectos separados, con dos consultoras distintas, en momentos distintos. El resultado: dos modelos de seguridad incompatibles (Sales usaba Business Units por región, Customer Service usaba equipos por producto), y un Contact que existía duplicado porque el proyecto de Service no reutilizó las tablas ya pobladas por Sales. La corrección — meses después — fue dolorosa: unificar duplicados, migrar dos modelos de seguridad a uno, y renegociar el alcance con ambas consultoras. La lección no es técnica, es de gobierno de proyecto: **Sales y Customer Service comparten Dataverse desde el día uno, se implementen juntos o no** — tratarlos como proyectos independientes garantiza este tipo de retrabajo.

### ✅ Buenas Prácticas
- Al iniciar cualquier proyecto D365 CE, diseñar el modelo de seguridad (roles, Business Units) pensando en TODAS las aplicaciones que eventualmente convivirán en el entorno, no solo la que se implementa primero.
- Nunca crear una tabla custom para "clientes de Servicio" o "clientes de Ventas" por separado — Account/Contact ya son compartidos; crear tablas paralelas es la causa más común de duplicidad de datos en proyectos D365 CE.
- Documentar explícitamente, en cualquier Fit-Gap de D365, qué eventos disparan el paso de una aplicación a otra (Lead→Opportunity, Case→Work Order) — es la arquitectura real del proceso, no un detalle técnico menor.
- Tratar Copilot como una capa transversal de gobierno único, no como una función a configurar por separado en cada aplicación.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Crear tablas custom paralelas a Account/Contact para "aislar" un producto | No reconocer que Dataverse ya es compartido | Usar las entidades estándar y diferenciar por vista/seguridad, no por tabla nueva |
| Diseñar el modelo de seguridad pensando solo en la app que se implementa primero | Proyectos por fases sin visión de arquitectura conjunta | Diseñar el modelo de Business Units/roles pensando en el estado final del ecosistema CE |
| Tratar el ALM de "D365" como distinto al de Power Platform | Desconocimiento de que son la misma plataforma de soluciones | Reutilizar el mismo pipeline, Connection References y Environment Variables del Módulo 19 |
| Pensar en Customer Insights solo como "otra herramienta de email" | No conectar Customer Insights - Data con el resto del ciclo (Customer 360) | Diseñar la activación de datos hacia Journeys como parte del mismo ciclo de negocio, no aislada |

### 🧪 Criterios de Validación
- [ ] Explico por qué Sales y Customer Service comparten Account/Contact sin sincronización
- [ ] Dibujé el mapa de las 4 aplicaciones sobre Dataverse sin flechas de sincronización entre ellas
- [ ] Identifiqué los 4 eventos que conectan marketing→venta→servicio→campo→fidelización en un caso propio
- [ ] Puedo explicar por qué el ALM de una solución D365 CE es el mismo ALM de cualquier solución Power Platform

---
moduleId: 57
title: "Dynamics 365 CE Avanzado — Customer Engagement como Ecosistema Enterprise"
level: "d365"
certification: "D365 CE avanzado + F&O awareness"
estimatedMinutes: 18
practiceMinutes: 120
slug: "introduccion-dynamics-365-avanzado"
lastVerified: "2026-11"
---
*Lectura: 15-20 min · Con práctica: unos 120 min, mejor en dos sesiones (la primera hasta el diagnóstico; la segunda, la Microlección 3 y el reto de transferencia). La primera vez, cuenta entre una vez y media y el doble.*

### 🎯 Objetivo
Entender por qué Dynamics 365 Sales, Customer Service, Contact Center, Customer Insights y Field Service no son productos aislados sino capas de una arquitectura enterprise sobre Dataverse, reconocer el mapa completo de este nivel transversal, y explicar el ciclo de negocio que conecta marketing, venta, servicio, operación de campo, ERP y fidelización.

> **Cómo está organizado este módulo:** tres microlecciones con práctica entre medias. En la primera compruebas en tu propio ambiente qué parte de Dataverse es común y qué añaden las apps de Dynamics 365. En la segunda trazas los eventos que pasan un cliente de una app a otra. Después diagnosticas un modelo de datos que separó a los clientes de Service de los de Sales, empezando por el síntoma. En la tercera **decides y defiendes** un modelo de seguridad para una implantación por fases (no hay una única respuesta correcta: la evidencia es tu decisión escrita con sus razones) y cierras con un reto de transferencia en otro negocio.
>
> **Antes de empezar, necesitas:**
> - Ningún módulo previo: este nivel es transversal. Si ya hiciste el Módulo 20 (Sales y Customer Service) y el Módulo 19 (ALM), te servirán de ejemplo, pero no son requisito.
> - Tu ambiente del curso (cualquier ambiente con Dataverse donde puedas entrar a [make.powerapps.com](https://make.powerapps.com)). **No necesitas** apps de Dynamics 365: la mayoría de los alumnos no las tiene, porque requieren una trial o una licencia.
> - Opcional: una [trial de 30 días de Dynamics 365 Sales](https://dynamics.microsoft.com/en-us/sales/sales/free-trial/) si quieres ver los pasos de la Microlección 2 en vivo. Cada práctica tiene una **variante en papel** que vale igual como evidencia.

### 📖 Conceptos Clave
- **Dataverse como base común:** Sales, Customer Service y Field Service no son bases de datos separadas — son aplicaciones (Model-Driven Apps con lógica y UX propias) construidas sobre el mismo Dataverse. `Account` y `Contact` son las mismas tablas vistas desde Sales o desde Customer Service; un Contact con un caso abierto en Service es visible como el mismo registro en la vista de Sales, sin sincronización ni duplicación. Learn pone a Account y Contact como ejemplo de las tablas estándar que trae **cualquier** ambiente con Dataverse; las apps de Dynamics 365 se instalan encima y añaden sus propias tablas (por ejemplo Lead, Opportunity o Case) y su lógica ([Learn: tipos de tablas](https://learn.microsoft.com/power-apps/maker/data-platform/types-of-entities)).
- **ALM compartido:** una solución de Dataverse que empaqueta personalizaciones de Sales (formularios de Opportunity) puede convivir en la misma solución que personalizaciones de Customer Service (formularios de Case) — el mismo pipeline CI/CD, el mismo Solution Checker y las mismas Connection References (las del Módulo 19, si lo hiciste) aplican igual a "Dynamics 365 CE" que a cualquier app de Power Platform. No existe un ALM distinto "para D365".
- **Copilot transversal:** las capacidades de Copilot (resumen de casos, redacción de emails, respuestas sugeridas) no son una función de un solo producto — están disponibles en Sales, Customer Service y Field Service porque leen y escriben sobre el mismo Dataverse, con el mismo modelo de gobierno de datos que cualquier otro flujo de IA de Power Platform.
- **El ciclo de negocio completo (de marketing a fidelización):**
  1. **Marketing → Venta:** Customer Insights - Journeys identifica y nutre leads (segmentación, journeys); cuando un contacto califica, se convierte en `Lead` o se crea una `Opportunity` en Sales. En Sales, el evento es **Qualify** sobre el Lead: según cómo lo configure el administrador, crea o asocia el Account, el Contact y la Opportunity, y el Lead pasa a la vista de leads cerrados ([Learn: calificar un lead](https://learn.microsoft.com/dynamics365/sales/qualify-lead-convert-opportunity-sales)).
  2. **Venta → Servicio:** al cerrar una venta, el `Account`/`Contact` y lo vendido (productos, contrato) quedan disponibles para Customer Service — un caso de soporte no empieza de cero, hereda el historial comercial.
  3. **Servicio → Campo:** si un caso requiere una visita física, Customer Service crea un `Work Order` que Field Service programa, ejecuta y cierra con evidencia. En Field Service eso se hace desde el caso con el business process flow **Case to Work Order Business Process** (opción **Convert to Work Order**); el **Incident Type** del caso pasa a ser el **Primary Incident Type** del work order y su descripción, las **Instructions** ([Learn: crear un work order desde un caso](https://learn.microsoft.com/dynamics365/field-service/create-work-order-from-case)).
  4. **Servicio/Campo → Fidelización:** el historial de casos y visitas alimenta de vuelta a Customer Insights - Data (Customer 360), que puede activar un nuevo journey de renovación o detectar riesgo de abandono.
- **Gobierno y seguridad compartidos:** los roles de seguridad, las Business Units y las políticas DLP (los Módulos 16 y 32 los tratan a fondo, si los hiciste) aplican a las 4 aplicaciones a la vez — un mismo usuario puede tener acceso distinto a Sales y a Service dentro del mismo entorno, sin que eso implique sistemas separados.
- **Integración con Microsoft 365 — transversal, no solo de Sales:** la integración con Outlook y Teams (el Módulo 20 la aplica a ventas) no es una característica exclusiva de Sales — un agente de Customer Service puede colaborar sobre un Case desde Teams igual que un vendedor sobre una Opportunity, y un técnico de Field Service puede recibir la notificación de un Booking por Outlook. Es la misma capa de adopción (reducir doble captura, llevar el CRM al flujo de trabajo diario) aplicada a las 4 aplicaciones, no una integración distinta por producto.
- **Roles típicos en un proyecto Customer Engagement:** Consultor Funcional (por producto o transversal), Solution Architect (diseña la arquitectura común), Developer (extiende con plugins/PCF que pueden tocar cualquiera de las 4 apps), y el rol de Data/CDP Specialist para Customer Insights - Data.
- **Posicionamiento del nivel:** este nivel ya no es solo "una introducción a D365"; es una especialización práctica de Dynamics 365: CE avanzado + F&O Awareness. Cubre CE profundo (Sales en el Módulo 61, Customer Service en el 62, Contact Center en el 63, Customer Insights - Data en el 58 y - Journeys en el 64, Field Service en el 59) y awareness avanzado de F&O (Módulo 60) para conversaciones de arquitectura, integración y ownership de datos (Módulo 65), con el capstone en el Módulo 66.
- **Requisitos reales de práctica:** leer y diseñar matrices puede hacerse sin tenant. Configurar forecasting, SLA, unified routing, real-time journeys, Field Service Mobile, RSO o dual-write requiere ambiente real, licencias correspondientes y permisos de administración/configuración.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Un solo Dataverse: compruébalo en tu ambiente

**¿Qué vas a aprender?** A distinguir, mirando un ambiente real, la base común (Dataverse y sus tablas estándar) de lo que añade cada app de Dynamics 365, y a representarlo sin flechas de sincronización.

**¿Por qué existe esto?** El error de arquitectura más caro de un proyecto CE es tratar cada app como un sistema con sus propios clientes. Quien ha visto con sus ojos que Account y Contact ya están en el ambiente antes de instalar nada no crea "su" tabla de clientes.

**Ahora haz algo — micropráctica (5 min):** → **[Un solo Dataverse: qué comparten las apps de Customer Engagement](/practica/ip-d365-004-un-solo-dataverse)**. Selecciona las afirmaciones correctas y lee la consecuencia de cada una.

**Práctica real en tu entorno (15 min, solo lectura):**

1. Entra a [make.powerapps.com](https://make.powerapps.com) y comprueba arriba a la derecha que estás en tu ambiente del curso.
2. En el panel izquierdo, selecciona **Tables** (tablas). Si no lo ves, selecciona **More** (más) y búscalo ahí.
3. Arriba de la lista, selecciona la pestaña **All** (todas). Learn explica que **Recommended** muestra solo tablas estándar, **Custom** solo las creadas por makers y **All** todas ([Learn: ver tablas](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-portal#view-tables)).
4. Con el cuadro de búsqueda de la lista, busca una por una: **Account**, **Contact**, **Lead**, **Opportunity** y **Case**. Para cada una, anota si aparece y, si aparece, el valor de sus columnas **Type** y **Managed** en la lista.
5. **Qué deberías ver:** Account y Contact aparecen siempre. En un ambiente sin apps de Dynamics 365, Lead, Opportunity y Case normalmente **no** aparecen. Si sí aparecen, tu ambiente tiene alguna app de Dynamics 365 instalada (por ejemplo, porque es una trial): anótalo, no es un error.
6. **Dibuja (papel o una herramienta de diagramación, 10 min):** las 4 aplicaciones — Sales, Customer Service, Customer Insights, Field Service — como capas sobre un único círculo central "Dataverse". No dibujes flechas de sincronización entre ellas: dibuja flechas desde cada app HACIA el círculo central, para representar que comparten el dato, no que se lo envían entre sí. Dentro del círculo escribe las tablas que viste en el paso 4 y, junto a cada app, las que esa app añadiría.

**Variante en papel (sin ambiente):** haz solo el paso 6 y escribe, citando la página de Learn de tipos de tablas, qué tablas trae cualquier Dataverse y cuáles llegan con las apps.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre y tipo de tu ambiente (o "variante en papel") | ___ |
| Account y Contact: ¿aparecen? Valor de **Type** y **Managed** | ___ |
| Lead, Opportunity y Case: ¿aparecen? Si aparecen, por qué | ___ |
| Tu diagrama: cuántas flechas entre apps dibujaste (la respuesta esperada es cero) | ___ |
| Una frase para un cliente: por qué no hace falta sincronizar clientes entre Sales y Service | ___ |

---

## 🧩 Microlección 2 — Los eventos que pasan al cliente de una app a otra

**¿Qué vas a aprender?** A nombrar el evento concreto que conecta cada etapa del ciclo (marketing → venta → servicio → campo → fidelización) y el registro que ese evento crea.

**¿Por qué existe esto?** Un Fit-Gap de D365 que solo lista funcionalidades por app no muestra dónde se cae el proceso. Los fallos reales están en las costuras: el Lead que nadie califica, el caso que necesita técnico y no genera visita, la encuesta que no vuelve al perfil.

Los dos eventos que puedes comprobar en Learn con sus nombres exactos:

- **Lead → Opportunity:** en Sales, **Leads** → abrir el lead → **Qualify** en la barra de comandos. Según la configuración que haya elegido el administrador, el sistema crea automáticamente el Account, el Contact y la Opportunity, o abre el panel **Qualify lead** para elegir cuáles crear o reutilizar ([Learn](https://learn.microsoft.com/dynamics365/sales/qualify-lead-convert-opportunity-sales)).
- **Case → Work Order:** en Field Service, desde el caso, **Convert to Work Order** (business process flow **Case to Work Order Business Process**); requiere el rol **Field Service - Dispatcher** o **Field Service - Administrator**. Si la opción no aparece, Learn indica cambiar de proceso con **⋮** → **Process** → **Switch Process** ([Learn](https://learn.microsoft.com/dynamics365/field-service/create-work-order-from-case)).

**Práctica (25 min, en papel):**

1. Toma un negocio propio (real o inventado; no uses la aseguradora del Caso Real) y aplica el ciclo de los Conceptos Clave.
2. Completa la tabla de evidencia: para cada transición, el evento que la dispara, la app donde ocurre, el registro que se crea y quién es su dueño.
3. Enumera, sin entrar en detalle todavía, qué vas a profundizar en este nivel y en qué módulo: Sales avanzado (61), Customer Service avanzado (62), Contact Center/Omnichannel (63), Customer Insights - Data (58), Customer Insights - Journeys (64), Field Service end-to-end (59), F&O awareness (60), integración CE + F&O (65) y capstone enterprise (66). Marca en tu tabla qué módulo cubre cada costura.

**Si tienes una trial de Sales (opcional, 15 min):** crea un Lead de prueba con **Company name** relleno (Learn indica que, en la experiencia nueva de calificación, la opción de crear el Account solo aparece si ese campo tiene valor), selecciona **Qualify** y anota qué registros se crearon y si se abrió el panel **Qualify lead**. Si tu trial no incluye Field Service, no intentes el paso del Work Order: basta con la tabla.

**Evidencia a reportar:**

| Transición | Evento que la dispara | App | Registro que se crea | Dueño del registro |
|---|---|---|---|---|
| Marketing → Venta | ___ | ___ | ___ | ___ |
| Venta → Servicio | ___ | ___ | ___ | ___ |
| Servicio → Campo | ___ | ___ | ___ | ___ |
| Servicio/Campo → Fidelización | ___ | ___ | ___ | ___ |
| (Trial) Registros creados al calificar tu lead | ___ | | | |

---

## 🔧 Diagnosticar — el caso que no ve el historial comercial

Antes de la Microlección 3, resuelve este caso empezando por el síntoma:

**[Diagnosticar: el caso no muestra el historial comercial del cliente](/practica/ip-d365-005-caso-sin-historial-comercial)**

Síntoma: en una distribuidora que implantó Customer Service seis meses después de Sales, el agente abre un caso de Contoso y no ve ninguna de sus oportunidades ni pedidos; el vendedor, en el Account de Contoso, no ve ninguno de sus 40 casos del año. Formula tu hipótesis antes de ver la causa: ¿con qué tabla está relacionado el caso y qué habría que cambiar, en qué orden?

---

## 🧩 Microlección 3 — Implantación por fases: decidir y defender el modelo de seguridad (sin pasos)

**¿Qué vas a aprender?** A diseñar el modelo de seguridad y el alcance práctico de un proyecto CE pensando en **todas** las apps que convivirán, aunque hoy solo se implante una, y a separar lo que se puede validar sin tenant de lo que exige licencias.

**¿Por qué existe esto?** El Caso Real de este módulo es exactamente lo que pasa cuando cada fase diseña su propia seguridad. Decidirlo bien al principio es barato; corregirlo después cuesta meses.

> **Caso (ilustrativo):** un fabricante de equipos industriales implanta **Sales** este semestre, **Customer Service** dentro de 6 meses y **Field Service** el año próximo, todo en el mismo ambiente. Restricciones: los gerentes comerciales ven solo su región (Norte, Centro, Sur); los especialistas de producto (compresores, bombas) atienden casos de **todas** las regiones pero solo de su línea; los técnicos de campo solo deben ver sus visitas y los datos del cliente necesarios para hacerlas; finanzas necesita ver todas las cuentas sin poder modificarlas.
> **Escribe:** (1) tu estructura de Business Units y equipos y qué security role usa cada perfil; (2) qué decisión tomas **ahora**, en la fase de Sales, que evita rehacer la seguridad cuando lleguen Service y Field Service; (3) una tabla de tres columnas — "puedo practicar sin tenant", "requiere tenant/licencia" y "evidencia esperada" — con forecasting, SLA, routing, journeys, mobile offline, RSO y dual-write en la columna correcta.
> **Opcional, si hiciste el Módulo 20:** identifica una decisión de seguridad (rol, Business Unit) que ya se tomó ahí y explica por qué seguiría valiendo si añades Customer Insights o Field Service al mismo entorno.

Contrasta tu decisión con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| El modelo contempla las tres apps desde el día uno | Cada perfil de las tres fases (gerente, especialista, técnico, finanzas) tiene su rol escrito, aunque su app llegue después |
| La dimensión región y la dimensión producto no chocan | Explicas cómo un especialista ve casos de todas las regiones sin ver las oportunidades de otras regiones |
| No hay tablas paralelas de clientes | Todo perfil trabaja sobre Account y Contact; el aislamiento sale de roles, equipos y vistas |
| Mínimo privilegio | Finanzas solo lee; el técnico no ve más cuentas de las que necesita |
| La matriz es honesta | Cada capacidad que exige licencia tiene escrita su evidencia alternativa en papel |
| Lo puedes defender en una reunión | Cierras con tres líneas: qué decides, qué riesgo aceptas y qué revisarás al llegar Field Service |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Business Units y equipos propuestos | ___ |
| Rol por perfil (gerente, especialista, técnico, finanzas) | ___ |
| La decisión de la fase de Sales que protege las fases siguientes | ___ |
| Matriz sin tenant / con tenant / evidencia (7 capacidades) | ___ |
| Riesgo que aceptas y cuándo lo revisas | ___ |

---

## 🔁 Reto de transferencia — otro negocio: mantenimiento de ascensores

El mismo mapa en un negocio que no se parece a los anteriores: una empresa que vende contratos de mantenimiento a administradores de edificios, recibe reportes de falla, envía técnicos y quiere ofrecer la renovación a los clientes con pocas fallas; contabilidad y repuestos viven en su ERP.

**[Transferir: empresa de mantenimiento de ascensores](/practica/ip-d365-006-transferir-empresa-ascensores)** — decide dónde vive cada dato, qué evento pasa de una etapa a otra y qué queda en el ERP. Si solo memorizaste "todo es Dataverse", este reto te lo va a mostrar: la contabilidad de repuestos **no** se replica en el CRM.

Cierra el reto con un **ADR de media página** (Contexto, Opciones, Decisión, Consecuencias) sobre una sola pregunta: "¿un ambiente o uno por app?", contrastado con la rúbrica de la Microlección 3.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Los cuatro eventos del ciclo en este negocio | ___ |
| Qué datos quedan en el ERP y cómo los ve el técnico | ___ |
| Tu decisión del ADR y la consecuencia que aceptas | ___ |
| Qué cambiaría si la empresa comprara otra con su propio CRM | ___ |

---

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
| Tratar el ALM de "D365" como distinto al de Power Platform | Desconocimiento de que son la misma plataforma de soluciones | Reutilizar el mismo pipeline, Connection References y Environment Variables (Módulo 19, si lo hiciste) |
| Pensar en Customer Insights solo como "otra herramienta de email" | No conectar Customer Insights - Data con el resto del ciclo (Customer 360) | Diseñar la activación de datos hacia Journeys como parte del mismo ciclo de negocio, no aislada |
| Omitir Contact Center porque "ya existe Customer Service" | No distinguir casos de conversaciones/canales en tiempo real | Modelar Customer Service para casos y Contact Center para canales, presencia y routing |
| Presentar F&O como algo que se implementa desde CE | Se confunde awareness con especialización F&O | Declarar F&O como dominio ERP separado y enfocarse en integración/ownership desde CE |
| En el caso no aparece **Convert to Work Order** | El caso no está en el business process flow **Case to Work Order Business Process**, o el usuario no tiene rol de Field Service | Cambiar de proceso con **⋮** → **Process** → **Switch Process** y comprobar el rol **Field Service - Dispatcher** o **Field Service - Administrator** |
| Buscar Lead u Opportunity en un ambiente sin apps de D365 y concluir que "Dataverse no sirve para CRM" | Confundir la base común con las tablas que añaden las apps | Account y Contact ya están; Lead, Opportunity y Case llegan al instalar Sales o Customer Service |

### 🧪 Criterios de Validación
- [ ] Comprobé en mi ambiente (o documenté en papel con Learn) qué tablas trae cualquier Dataverse y cuáles llegan con las apps, y dibujé el mapa sin flechas de sincronización entre apps
- [ ] Tracé en un caso propio los 4 eventos que conectan marketing→venta→servicio→campo→fidelización, con el registro que crea cada uno
- [ ] Diagnostiqué el caso sin historial comercial formulando una hipótesis antes de ver la causa
- [ ] Decidí y defendí con la rúbrica un modelo de seguridad para una implantación en tres fases, incluida la matriz de qué requiere tenant/licencia
- [ ] Puedo explicar por qué el ALM de una solución D365 CE es el mismo ALM de cualquier solución Power Platform
- [ ] Completé el reto de los ascensores con su ADR "un ambiente o uno por app"

---
id: lab-83
title: "Contact Center Chat Channel Hands-On"
level: "N6"
duration: 210
product: ["Dynamics 365 Customer Service", "Dynamics 365 Contact Center", "Omnichannel Chat"]
certifications: ["Dynamics 365 Contact Center", "Dynamics 365 Customer Service"]
role: ["Consultor Funcional D365 CE", "Contact Center Architect"]
prerequisites:
  - "Módulo 63 estudiado: Contact Center / Omnichannel"
  - "Lab 68 completado (recomendado): Customer Service case-to-resolution"
  - "Acceso a un ambiente trial/demo de Dynamics 365 Customer Service con Digital messaging/Omnichannel habilitado"
  - "Sin ese ambiente, la parte ejecutable de este lab no aplica — ver Alcance de este lab"
lastVerified: "2026-11"
---

# Lab 83 — Contact Center Chat Channel Hands-On

## Objetivo

Configurar y probar de punta a punta un canal de **chat** real (widget web) en Dynamics 365
Customer Service/Contact Center: workstream, unified routing, presencia de agente, conversación de
prueba con handoff y dashboard de supervisor — en un trial que el propio estudiante consigue.

## Nota de verificación (léela antes de empezar)

Los nombres de menú y pasos se contrastaron con Microsoft Learn en 2026-11 (la app de administración
se llama hoy **Copilot Service admin center** y la del representante **Copilot Service workspace**),
**sin ejecutarlos en un tenant en vivo**. Si un nombre de menú no coincide con tu ambiente, anota la
diferencia como parte de tu evidencia.

## Cómo conseguir el ambiente (aviso de licencia)

- **No sirve tu ambiente del curso:** se creó sin apps de Dynamics 365 (y un ambiente Developer no puede instalarlas), y un trial no se añade a
  un ambiente existente: cada trial crea su propio tenant y URL
  ([Learn: Trial FAQ](https://learn.microsoft.com/dynamics365/customer-service/implement/trial-faq)).
- **Opción 1 — reutiliza la trial de Customer Service del Módulo 62 si sigue activa.** Según el Trial
  FAQ, incluye Dynamics 365 Customer Service Enterprise, Copilot Service workspace y **Digital
  Messaging and voice channel** (chat, voz, mensajería digital y unified routing). No hay que activar
  ningún add-on aparte.
- **Opción 2 — trial de Dynamics 365 Contact Center:** página
  [Try Dynamics 365 Contact Center](https://www.microsoft.com/dynamics-365/products/contact-center) →
  **Try for free** ([Learn](https://learn.microsoft.com/dynamics365/contact-center/implement/try-dynamics365-contact-center)).
- **Datos de las dos trials** ([Learn: Trial FAQ de Contact Center](https://learn.microsoft.com/dynamics365/contact-center/implement/contact-center-trial-faq)):
  30 días, extensible una vez otros 30; caduca tras 14 días seguidos sin actividad y no se reactiva;
  con un correo personal puedes registrarte, pero no podrás entrar al Power Platform admin center
  (añadir usuarios, cambiar roles, extender) — en este lab eso importa en el Paso 3 si quieres un
  segundo usuario agente: usa una cuenta de trabajo o estudio si la tienes, o trabaja con tu propio
  usuario. No disponible en Brasil, Noruega, Sudáfrica ni Government Community Cloud. El número de
  teléfono de prueba solo funciona dentro de EE. UU. y no sirve para SMS ni llamadas salientes.
- **Sin trial:** haz el lab como diseño (Pasos 1 a 5 documentados) y márcalo **Simulado**.

## Alcance de este lab: qué es ejecutable con solo un trial y qué no

No todos los canales de Contact Center requieren lo mismo:

| Canal | Qué necesitas | ¿Ejecutable con solo un trial Microsoft? |
|---|---|---|
| **Chat (widget web)** | Trial de Customer Service o de Contact Center (ambas traen chat), y una página web de prueba donde pegar el script del widget | **Sí** — es el canal que cubre este lab |
| **Voz** | La trial trae un número de prueba gratuito, pero solo se puede llamar desde EE. UU. y no hace llamadas salientes; fuera de EE. UU. o en producción, número y proveedor propios (Azure Communication Services u otro), con costo real | Solo parcialmente y desde EE. UU. — este lab no lo cubre |
| **SMS** | Trial + proveedor de mensajería SMS configurado | No — requiere una cuenta de proveedor externo, más allá del trial |

Este lab cubre **solo Chat**, porque es el único canal que un estudiante puede probar end-to-end sin
contratar un proveedor de telefonía/SMS externo. Voz y SMS quedan documentados como diseño (matriz
de canal, routing, capacidad) pero no como configuración ejecutada — no presentes esa parte como si
la hubieras probado.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT).

SIT quiere ofrecer soporte premium por chat en su sitio web. Un cliente que escribe debe quedar en
una cola con prioridad si su cuenta es premium, y el agente debe ver el contexto completo de la
conversación (no solo el último mensaje) al recibirla.

## Rol del estudiante

Actúas como Contact Center Architect configurando y probando el canal de chat end-to-end.

## Herramientas necesarias

- Ambiente trial de Dynamics 365 Customer Service o Contact Center (ver "Cómo conseguir el ambiente").
- Una página HTML simple donde pegar el script del widget de chat dentro del `<body>` (Learn documenta un sitio web o un portal de Power Pages; que funcione abierta como archivo local no está verificado: si no carga, publícala en un sitio de prueba).
- Dos sesiones de navegador (o una ventana normal y una de incógnito): una para simular al cliente en la página con el widget, otra para el agente en Copilot Service workspace.

## 🔧 Requisitos de tenant y fallos frecuentes

**Licencia y rol mínimo**

En la trial (de Customer Service o de Contact Center) los canales digitales y unified routing ya
vienen incluidos ([Learn: Trial FAQ](https://learn.microsoft.com/dynamics365/customer-service/implement/trial-faq)).
En un tenant de pago, en cambio, los canales dependen de la licencia de canal que se haya comprado:
revisa la [guía de licencias de Dynamics 365](https://go.microsoft.com/fwlink/?LinkId=866544) antes
de prometer un canal. Roles ([Learn: roles](https://learn.microsoft.com/dynamics365/customer-service/implement/add-users-assign-roles)):
quien configura workstreams, colas y canales necesita **Omnichannel administrator** (y **System
Administrator** para gestionar roles de usuarios); quien atiende conversaciones necesita **Omnichannel
agent** además de **Basic User**, y **Customer Service Representative** para trabajar con casos; el
supervisor, **Omnichannel supervisor**. En la trial tu usuario es administrador. Además, para recibir
trabajo con un capacity profile, el usuario debe estar configurado como **bookable resource**
([Learn: capacity profiles](https://learn.microsoft.com/dynamics365/customer-service/administer/capacity-profiles)).

**Configuración previa**

- Al menos una cola de tipo **Messaging** con tu usuario como miembro antes de las reglas de routing.
- Un capacity profile asignado al usuario agente (Paso 3).
- Una página de prueba donde insertar el script del widget.

**Fallos frecuentes de licencia, rol, canal y región**

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| No aparecen **Channels** ni **Workstreams** en **Customer support** de Copilot Service admin center. | Estás en otra app (por ejemplo, la del representante) o, en un tenant de pago, el ambiente no tiene canales aprovisionados. | Abrir **Copilot Service admin center** desde la página **Apps**; en un tenant de pago, revisar con el administrador la provisión de canales ([Learn: provisionar canales](https://learn.microsoft.com/dynamics365/contact-center/implement/provision-channels)). | En la trial, entrar a la app correcta; en pago, provisionar los canales licenciados. |
| El agente no recibe conversaciones aunque esté **Available**. | Le falta el rol **Omnichannel agent**, no es miembro de la cola, no está como bookable resource o no tiene capacity profile. | Revisar roles del usuario, miembros de la cola y su capacity profile. | Asignar el rol, añadirlo a la cola y asignarle el perfil. |
| El widget de chat no carga en la página de prueba (aunque el script esté pegado). | Activaste **Only show widget on the provided domains** con otro dominio, el widget está fuera de su horario de operación, o la página no permite cargar el script. | Revisar esas dos opciones en la pestaña del widget y la consola del navegador. | Ajustar el dominio u horario, o publicar la página en un sitio de prueba ([Learn: solución de problemas del widget](https://learn.microsoft.com/troubleshoot/dynamics-365/customer-service/omnichannel-for-customer-service/chat-widget-not-loading-portal)). |
| No ves los informes de supervisor en tiempo real. | Los informes en tiempo real están activos por defecto, pero solo para ciertos roles (System Administrator, Omnichannel Administrator, Omnichannel Supervisor, Analytics Reports author, CSR manager) y alguien pudo apagarlos. | En Copilot Service admin center → **Operations** → **Insights** → **Real-time Analytics** → **Manage**, revisar **Enable Omnichannel real-time analytics** ([Learn](https://learn.microsoft.com/dynamics365/customer-service/administer/enable-realtime-analytics-dashboard-administrator)). | Encender la opción o usar un usuario con uno de esos roles. Los informes **históricos** se refrescan cada 24 horas: tu conversación de hoy no aparecerá ahí todavía. |
| La conversación queda en la cola y nunca se asigna a ningún agente. | Al agente no se le asignó un perfil de capacidad, o su presencia no está en las **Allowed presences** del workstream. | Revisar el perfil de capacidad asignado al usuario y su estado de presencia actual. | Asignar el perfil de capacidad correspondiente y poner la presencia en **Available**. |

## Entregables

- Canal de chat configurado con widget generado.
- Workstream de chat con regla de routing por prioridad (cliente premium vs. general).
- Perfil de capacidad y presencia de agente configurados.
- Conversación de prueba ejecutada de punta a punta, con capturas de cada etapa.
- Matriz de diseño (no ejecutada) para Voz y SMS.

## Pasos detallados

### Paso 1 — Workstream y canal de chat

Learn pide crear primero el workstream que enruta el chat
([Learn: widget de chat](https://learn.microsoft.com/dynamics365/customer-service/administer/add-chat-widget)):

1. **Copilot Service admin center** → **Customer support** → **Workstreams** → **New workstream**:
   **Name** `WS Chat SIT`, **Type** **Messaging**, **Channel** **Chat**, **Work distribution mode**
   **Push** (no se puede cambiar después), **Fallback queue** → **Create new** → **Create**
   ([Learn: workstreams](https://learn.microsoft.com/dynamics365/customer-service/administer/create-workstreams)).
2. **Customer support** → **Channels** → **Manage** en **Chat** → **Add chat channel** → **Modern** →
   **Continue**. En **General Configuration**, **Name** y **Language**; en **Workstream details**,
   elige `WS Chat SIT`; en **Header** e **Intro page**, título y saludo; en **Chat Widget**, decide si
   usas **Show widget during operation hours** (necesita un registro de horario de operación creado
   antes) y deja apagado **Only show widget on the provided domains** mientras pruebas. Termina en
   **Review and finish** → **Create channel**.
3. Abre el canal (**Channels** → **Chat** → tu canal → **Edit**), copia el código del widget en la
   pestaña **Chat widget** y pégalo dentro del `<body>` de tu página de prueba
   ([Learn: embeber el widget](https://learn.microsoft.com/dynamics365/customer-service/administer/embed-chat-widget-portal)).
   Si tu ambiente muestra el asistente **Classic** en vez de **Modern**, los campos equivalentes están
   en **Channel details** y **Chat Widget**.

- Documenta qué pasa si el horario configurado marca "fuera de línea": ¿qué ve el cliente en el widget?
  (Si no configuraste horario, anótalo como diseño.)

### Paso 2 — Colas y regla de routing

Crea las colas `Soporte Premium` y `Soporte General`: **Customer support** → **Queues** → **Manage**
en **Advanced queues** → **New**, **Type** **Messaging**, **Add users** con tu usuario
([Learn: colas](https://learn.microsoft.com/dynamics365/customer-service/administer/queues-omnichannel)).
Luego, en el workstream `WS Chat SIT`, área **Routing rules**, crea la regla route-to-queue: **Create ruleset** junto a **Route to queues**
→ **Create Rule**; en **Conditions** la condición y en **Route to queues** la cola
([Learn](https://learn.microsoft.com/dynamics365/customer-service/administer/configure-route-to-queue-rules)).

- Configura una regla de routing: si el cliente está marcado como premium (usa un campo o atributo
  de prueba en el contacto), enrutar a la cola `Soporte Premium`; si no, a la cola `Soporte General`.
  Ojo: un chat anónimo no trae contacto identificado. Para probarlo sin autenticación, usa como marca
  una respuesta del cliente que llegue como context variable (por ejemplo, una pregunta de la
  **Pre-conversation survey** del widget) y anota que en producción la marca vendría del contacto
  autenticado ([Learn: context variables](https://learn.microsoft.com/dynamics365/customer-service/administer/manage-context-variables)).
- Documenta la diferencia entre una regla de routing por atributo del cliente y una regla por
  contenido del mensaje (si tu ambiente lo soporta).

### Paso 3 — Capacidad y presencia de agente

Ve a **Copilot Service admin center > Customer support > User management** → **Manage** en
**Capacity profile** → **Create new** ([Learn](https://learn.microsoft.com/dynamics365/customer-service/administer/capacity-profiles))
y asigna el perfil al usuario agente en la pestaña **Users** → **Add user** (tu propia cuenta; una
cuenta de prueba adicional exige añadir usuarios, que con correo personal no puedes). El usuario debe
ser **bookable resource** para aparecer.

- Define el máximo de conversaciones simultáneas (**Work item limit**) y la **Reset frequency**
  (no se cambia después: habría que recrear el perfil).
- En el workstream, **Work distribution** → **See more** → **Capacity** **Profile based** con tu perfil,
  y revisa las **Allowed presences**.
- Inicia sesión como agente en **Copilot Service workspace** y pon tu presencia en **Available**.
- Documenta qué pasa si intentas recibir una conversación con presencia **Away** (depende de si
  dejaste **Away** dentro de las **Allowed presences**: anota cuál era tu configuración).

### Paso 4 — Conversación de prueba y handoff

Desde tu página de prueba (sesión "cliente"), abre el widget de chat y envía un mensaje inicial.

- Desde Copilot Service workspace (sesión "agente"), acepta la conversación entrante.
- Documenta qué contexto ve el agente al aceptar: ¿historial del contacto, transcript, o solo el último mensaje?
- Si tu ambiente incluye un bot de primer contacto, documenta cómo se transfiere la conversación del
  bot al agente y qué datos se conservan (intención, resumen, transcript).

### Paso 5 — Dashboard de supervisor y diseño de Voz/SMS

Revisa las métricas de tu conversación de prueba en los informes **en tiempo real** de Copilot Service
workspace (por ejemplo, el *Ongoing Conversation report*). Vienen activos por defecto para System
Administrator, Omnichannel Administrator y Omnichannel Supervisor, entre otros
([Learn](https://learn.microsoft.com/dynamics365/customer-service/administer/enable-realtime-analytics-dashboard-administrator)).
Los informes **históricos** se refrescan una vez cada 24 horas
([Learn](https://learn.microsoft.com/dynamics365/customer-service/use/customer-service-analytics-insights-csh)):
si quieres verlos, vuelve al día siguiente.

- Documenta qué métricas viste realmente (ASA, AHT, abandon rate, etc.), con su nombre exacto, y
  cuáles no aparecían todavía (por ejemplo, porque el histórico aún no se había refrescado).
- Diseña (sin ejecutar) la matriz de canal para Voz y SMS: qué proveedor usarías, qué licencia
  adicional se requiere, y qué cambiaría en el workstream y el routing.

## Criterios de validación

- [ ] El canal de chat tiene widget generado y horario configurado.
- [ ] El workstream enruta correctamente según el atributo de prioridad del cliente (probado con al menos 2 casos: premium y general).
- [ ] El perfil de capacidad y la presencia del agente están configurados y probados.
- [ ] La conversación de prueba se completó de punta a punta con capturas de cada etapa.
- [ ] La matriz de Voz/SMS está documentada como diseño, no presentada como ejecutada.

## Rúbrica

| Criterio | Peso |
|---|---|
| Canal de chat y widget | 15% |
| Workstream y routing por prioridad | 25% |
| Capacidad y presencia de agente | 20% |
| Conversación de prueba y handoff | 25% |
| Dashboard de supervisor y diseño Voz/SMS | 15% |

## Errores comunes

- Presentar el diseño de Voz/SMS como si hubiera sido probado, cuando solo el canal de chat se ejecutó realmente.
- No probar el caso negativo (presencia "Ausente" o fuera de horario) y asumir que el canal siempre funciona.
- Configurar routing por cola genérica en vez de por atributo/prioridad del cliente.
- Confundir el widget generado (configuración del canal) con el workstream (reglas de enrutamiento) — son pasos distintos y ambos son necesarios.

## Gate de ambiente real (Voz, SMS y operación a escala)

Antes de presentar Voz, SMS o una operación de contact center a escala como configuración real,
completa el gate **Contact Center / Omnichannel** del recurso `/recursos/d365-tenant-readiness`. Ese
gate exige licencias específicas, canal disponible en tu región, agentes con presencia real y
conversación de prueba — más allá de lo que este lab cubre con el canal de chat.

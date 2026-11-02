---
moduleId: 63
title: "Dynamics 365 Contact Center / Omnichannel — Canales, Routing y Operación"
level: "d365"
certification: "Dynamics 365 Contact Center / Customer Service"
estimatedMinutes: 22
practiceMinutes: 150
slug: "dynamics-365-contact-center-omnichannel"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 150 min en papel, mejor en dos sesiones (la primera hasta el diagnóstico; la segunda, la Microlección 4, la decisión y el reto de transferencia). Con trial, suma 60-90 min para aprovisionar el ambiente y configurar. La primera vez, cuenta entre una vez y media y el doble.*

### 🎯 Objetivo
Diseñar una operación de contact center sobre Dynamics 365 Customer Service/Contact Center con canales digitales, conversación, presencia, unified routing, bots, handoff y métricas, produciendo un workstream, una regla de routing y un dashboard de supervisor completos — dejando explícito qué requiere licenciamiento, canal real y configuración del tenant, y qué puede simularse como diseño.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que decidiste o viste, no un "sí, lo hice"). En el punto **Diagnosticar** vas a explicar una tasa de abandono que sube con el canal funcionando, empezando por el síntoma. Después **decides y defiendes** si se abre WhatsApp antes de una campaña, con una rúbrica, y el módulo cierra con un **reto de transferencia** en otro negocio.
>
> **Antes de empezar — qué necesitas (lee esto, ahorra una tarde):**
> - **No necesitas tenant para completar el módulo.** Cada práctica tiene una **variante en papel** (tablas que llenas tú) y una **variante con trial** opcional. Un ambiente Developer no puede instalar apps de Dynamics 365, así que tu ambiente del curso no sirve aquí.
> - **Trial, si la quieres:** la trial de Dynamics 365 Contact Center dura **30 días** (se puede extender una vez otros 30) y caduca si pasan 14 días seguidos sin actividad. Trae chat, mensajería digital, voz, unified routing y la experiencia del representante en **Copilot Service workspace**. Su número de teléfono de prueba es gratuito solo dentro de EE. UU. y no sirve para SMS ni llamadas salientes ([Learn: Trial FAQ de Contact Center](https://learn.microsoft.com/dynamics365/contact-center/implement/contact-center-trial-faq)). Abre la trial el día que vayas a hacer las Microlecciones 1 a 3, no antes.
> - **Opcional, si ya lo hiciste:** el Módulo 62 (Customer Service Avanzado) usa el mismo motor de unified routing para casos, y el Módulo 20 (Microlección 5) ya enrutó casos con intake rules. Aquí no se repite: se aplica a **conversaciones en vivo**.
> - Vocabulario de Learn que vas a ver: Microsoft llama **service representative** (representante) a la persona que atiende y **agent** o **AI agent** al bot de Copilot Studio. En este módulo, "agente" sin más es la persona; al bot lo llamamos "agente de IA" o "bot".

### 📖 Conceptos Clave
- **Contact Center vs. Customer Service:** Customer Service administra casos y conocimiento (el "qué" del problema); Contact Center/Omnichannel agrega canales, conversaciones, presencia, distribución de trabajo en tiempo real y experiencia del representante (el "cómo" se atiende en vivo). Learn distingue tres formas de uso en sus artículos ("Applies to"): **Dynamics 365 Customer Service** con capacidades de contact center sobre casos y conocimiento de Dataverse (el escenario principal de este módulo y del Lab 83); **Contact Center—standalone**, con su propia experiencia de representante en **Copilot Service workspace**; y **Contact Center—embedded**, en el que el representante atiende chat o voz desde un **widget embebido en un CRM que no es de Microsoft** (Learn documenta Salesforce y ServiceNow) ([Learn: experiencia embebida](https://learn.microsoft.com/dynamics365/contact-center/administer/set-up-embedded-experience); [Learn: Trial FAQ](https://learn.microsoft.com/dynamics365/contact-center/implement/contact-center-trial-faq)).
- **Canales — con limitaciones reales:** chat, voz, SMS, WhatsApp u otros canales de mensajería dependen de disponibilidad regional, licencias específicas, números/proveedores de telefonía y configuración del tenant. Diseñar un workstream de WhatsApp se puede hacer en papel; verificar que un mensaje real llegue requiere una cuenta de WhatsApp Business aprobada y activa — awareness de diseño, no garantía de canal productivo.
- **Workstreams:** contenedor que enriquece, enruta y asigna el trabajo de un canal. Learn define tres tipos: **Messaging** (chat, SMS, social, Teams), **Record** (casos, email, actividades) y **Voice**. El **Work distribution mode** (**Push** o **Pick**) se elige al crearlo y **no se puede cambiar después** ([Learn: crear workstreams](https://learn.microsoft.com/dynamics365/customer-service/administer/create-workstreams)).
- **Unified routing — mecánica de decisión:** dos etapas. En **clasificación**, reglas (o modelos de ML) agregan información al trabajo: skills requeridas, prioridad, tipo de cliente. En **asignación**, el trabajo se prioriza dentro de la cola y se entrega al representante según skills, presencia y capacidad. Es el mismo motor para casos (Customer Service) y conversaciones en vivo (Contact Center) ([Learn: overview de unified routing](https://learn.microsoft.com/dynamics365/customer-service/administer/overview-unified-routing)).
- **Presence y capacity — cómo se cuentan:** con **capacidad por perfil** (*profile-based*), un capacity profile define un **Work item limit** (por ejemplo, 3 chats simultáneos); cada conversación del workstream consume una unidad de ese perfil y, al llegar al límite, el sistema deja de asignarle trabajo de ese perfil. Si además activas **Assignment blocking**, al llegar al límite no recibe ningún trabajo nuevo y su presencia pasa a **Busy-DND**. La otra opción es **capacidad por unidades** (*unit based*); Learn recomienda usar una de las dos en la organización, no ambas ([Learn: capacity profiles](https://learn.microsoft.com/dynamics365/customer-service/administer/capacity-profiles)). La presencia cuenta aparte: el workstream solo asigna a representantes cuya presencia esté en sus **Allowed presences**. "El canal está disponible" no significa "el representante puede atenderlo bien".
- **Bot y handoff:** un agente de Copilot Studio puede resolver preguntas frecuentes y transferir a un representante. Al transferir, Copilot Studio comparte el **historial completo de la conversación y las variables** recogidas, y unified routing lleva la conversación a la cola correcta ([Learn: handoff a Customer Service](https://learn.microsoft.com/microsoft-copilot-studio/configuration-hand-off-omnichannel)). Lo que el bot deja en **context variables** del workstream puede usarse en las reglas de routing y en las herramientas del representante ([Learn: context variables](https://learn.microsoft.com/dynamics365/customer-service/administer/manage-context-variables)). Un handoff sin ese contexto obliga al representante a repetir preguntas que el cliente ya respondió al bot.
- **Supervisor experience:** monitoreo casi en tiempo real de colas, conversaciones activas, tiempos de espera, sentiment (cuando está habilitado) y productividad, con acciones para **monitorear y unirse**, **asignar**, **transferir** o **forzar el cierre** de una conversación, si el administrador habilitó cada acción ([Learn: supervisar conversaciones](https://learn.microsoft.com/dynamics365/customer-service/use/monitor-conversations)).
- **Métricas:** ASA (*average speed to answer*), AHT (*average handle time*), abandon rate, first contact resolution, transfer rate, CSAT, backlog y occupancy (% de tiempo que el representante está ocupado vs. disponible). Learn separa el abandono en **antes de la asignación** (el cliente se va sin que nadie lo reciba) y **después de la asignación** (se asignó a un representante que no aceptó a tiempo) ([Learn: métricas de conversación](https://learn.microsoft.com/dynamics365/customer-service/develop/calculate-conversation-metrics)). Esa diferencia es la que diagnostica.
- **Requisitos reales de práctica:** diseñar workstreams, reglas de routing y dashboards de supervisor puede hacerse sin tenant. Probar canales reales (voz, WhatsApp, chat en vivo), presencia, capacity profiles y conversaciones end-to-end requiere Dynamics 365 Contact Center o Customer Service con canales habilitados, licencias por canal y, para voz/SMS/WhatsApp, un número o proveedor configurado.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Primero el modelo operativo: workstream, cola y capacidad

**¿Qué vas a aprender?** A decidir las piezas de un workstream de chat (tipo, modo de distribución, cola de respaldo, capacidad y presencias permitidas) **antes** de conectar el canal.

**¿Por qué existe esto?** El caso real de este módulo es una empresa que abrió el chat sin modelo de capacidad. El canal funcionó; la operación no. Dos decisiones de esta microlección no se pueden corregir después sin rehacer: el **Work distribution mode** del workstream y la **Reset frequency** del capacity profile (Learn: para cambiarla hay que recrear el perfil).

**Micropráctica (5 min):** decide la configuración del workstream de soporte premium con feedback inmediato → **[Configurar el workstream de chat premium](/practica/ip-d365-022-workstream-chat-premium)**.

**Práctica en papel (25 min):** completa esta ficha para el workstream de chat de soporte premium. Para cada fila, escribe tu valor y **por qué**:

| Pieza | Opciones que da Learn | Tu valor y por qué |
|---|---|---|
| **Type** | Messaging / Record / Voice | ___ |
| **Channel** | Chat, SMS, WhatsApp, Teams... | ___ |
| **Work distribution mode** (no se cambia después) | Push / Pick | ___ |
| **Fallback queue** (a dónde va lo que ninguna regla enruta) | Create new / Choose existing | ___ |
| Horario de atención y qué ve el cliente fuera de horario | — | ___ |
| **Capacity** | Unit based / Profile based (con qué perfil) | ___ |
| Capacity profile: **Work item limit** y **Reset frequency** | Número / Immediate o End of day | ___ |
| **Allowed presences** | Las presencias en las que se puede asignar trabajo | ___ |
| **Default skill matching algorithm** | Exact Match / Closest Match / None | ___ |
| Criterio de escalamiento (cuándo pasa a otra cola o a supervisor) | — | ___ |

**Variante con trial (30 min, opcional):**

1. En **Copilot Service admin center**, menú lateral → **Customer support** → **User management** → **Manage** en **Capacity profile** → **Create new**. En **Details**: **Profile name** `Chat Premium`, **Work item limit** `3`, **Reset frequency** **Immediate**. En **Users** → **Add user**, agrega tu usuario de prueba. Si no aparece: Learn exige que el usuario esté configurado como **bookable resource** para poder asignarle el perfil.
2. **Customer support** → **Workstreams** → **New workstream**. **Name** `WS Chat Premium`, **Type** **Messaging**, **Channel** **Chat**, **Work distribution mode** **Push**, en **Fallback queue** elige **Create new** con el nombre `Premium Respaldo` → **Create**. Deberías ver el workstream creado con la opción de configurar el chat.
3. En el área **Work distribution** del workstream → **See more**: **Capacity** **Profile based** con `Chat Premium`, y en **Allowed presences** deja fuera **Do not disturb** e **Inactive**. Anota qué presencias quedaron.
4. Si no ves **Copilot Service admin center** en tu trial: abre la lista de apps del ambiente y busca la app de administración; los nombres de producto cambiaron en 2025-2026, y la trial se aprovisiona con Contact Center.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Work distribution mode elegido y por qué (recuerda: no se cambia después) | ___ |
| Work item limit del perfil y el dato de negocio que lo justifica | ___ |
| Presencias que dejaste fuera de **Allowed presences** | ___ |
| Cola de respaldo y quién es su owner | ___ |
| (Con trial) presencias que muestra tu workstream al guardar, o "sin trial: diseño" | ___ |

---

## 🧩 Microlección 2 — Unified routing: clasificar, enrutar a cola y asignar

**¿Qué vas a aprender?** A escribir reglas de routing separando las tres preguntas que el motor responde en orden: ¿qué es este trabajo? (clasificación), ¿a qué cola va? (route-to-queue), ¿quién lo atiende? (método de asignación de la cola).

**¿Por qué existe esto?** Una tabla de decisión que mezcla las tres preguntas en una sola regla funciona el primer mes y se vuelve imposible de mantener cuando cambian productos o equipos. Learn también aclara un detalle que suele sorprender: los métodos de asignación estándar **no** consideran el horario del representante; para eso hay que escribir un método personalizado con el operador "is_working" ([Learn: métodos de asignación](https://learn.microsoft.com/dynamics365/customer-service/administer/assignment-methods)).

**Práctica en papel (20 min):**

1. Parte de esta tabla de decisión:

   | Condición | Cola destino | Skill requerida | Prioridad |
   |---|---|---|---|
   | Cliente premium Y producto = Field Service | Soporte Field Premium | Field Service nivel 2 | Alta |
   | Cliente premium Y producto ≠ Field Service | Soporte Premium General | Producto correspondiente | Media |
   | Cliente estándar | Cola general | Ninguna específica | Normal |

2. Reescríbela en tres partes: (a) reglas de **clasificación** (qué agregan: skill, prioridad, tipo de cliente); (b) reglas **route-to-queue** (qué condición lleva a qué cola); (c) el **método de asignación** de cada cola. Learn ofrece **Highest capacity**, **Advanced round robin**, **Least active** (solo voz y mensajería; es el que se selecciona por defecto al crear una cola de voz o mensajería) y **No auto assignment** (el representante toma el trabajo), además de métodos propios con *prioritization rulesets* y *assignment rulesets*.
3. Decide qué pasa con un cliente premium cuando no hay ningún representante con la skill "Field Service nivel 2" disponible: ¿esperar en la cola, relajar la skill (Closest Match) o desbordar a otra cola? Escribe el trade-off en una frase.

**Variante con trial (20 min, opcional):** en el workstream `WS Chat Premium`, en la sección de reglas de routing (Learn la describe como reglas de clasificación más reglas route-to-queue), crea una regla de clasificación que agregue la skill y una regla route-to-queue hacia una cola `Soporte Premium General` con tu usuario como miembro. Abre el widget de chat de prueba, envía un mensaje y anota a qué cola llegó.

**Si no lo ves:** "la conversación no se asigna" → la cola no tiene miembros, el representante no está como bookable resource, su presencia no está entre las **Allowed presences** o no tiene capacidad libre. "Llega a la cola de respaldo" → ninguna regla route-to-queue coincidió: revisa la condición y el valor exacto del dato que evalúa.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tus reglas de clasificación (qué agrega cada una) | ___ |
| Tus reglas route-to-queue | ___ |
| Método de asignación de cada cola y por qué | ___ |
| Qué pasa con el premium sin especialista disponible, y el trade-off | ___ |
| (Con trial) cola a la que llegó tu chat de prueba, o "sin trial: diseño" | ___ |

---

## 🧩 Microlección 3 — Handoff del bot al representante, con contexto

**¿Qué vas a aprender?** A diseñar qué datos pasa el agente de IA al representante cuando transfiere, para que nadie repita preguntas.

**¿Por qué existe esto?** El cliente que ya explicó su problema al bot y tiene que explicarlo otra vez al representante es la queja más común de un contact center con bot. Learn documenta que el handoff de Copilot Studio comparte el historial completo y las variables; lo que no hace por ti es decidir **qué** variables recoger ni con qué nombre las espera el workstream: los nombres de las context variables distinguen mayúsculas y minúsculas, admiten hasta 100 caracteres de nombre y 4.000 de valor, y Learn recomienda no cambiarlos una vez creados ([Learn: context variables](https://learn.microsoft.com/dynamics365/customer-service/administer/manage-context-variables)).

**Práctica en papel (20 min):**

1. Define los 5 datos obligatorios del handoff: cliente identificado, intención detectada, resumen de la conversación, artículo de knowledge sugerido y prioridad. Para cada uno, escribe de dónde sale (el bot lo pregunta, lo deduce o lo busca en Dataverse) y si lo usa el **routing**, el **representante** o ambos.
2. Redacta el contexto que el bot pasaría en este ejemplo. **Es un esquema de diseño, no el formato real de la API:** en el producto, cada dato viaja como una context variable de tipo **Text** o **Number** con el nombre que definas en el workstream.

   ```json
   {
     "cliente": "Ana Rivera — Cuenta Premium",
     "intencion": "Falla de sincronización en app móvil de Field Service",
     "resumen": "El cliente reporta que las órdenes de trabajo no sincronizan desde ayer 14:00",
     "articulo_sugerido": "KB-0231 — Troubleshooting de sincronización offline Field Service Mobile",
     "prioridad": "Alta"
   }
   ```
3. Escribe qué hace el bot cuando **no** identifica al cliente (por ejemplo, transfiere igual con `cliente` vacío y prioridad Normal, o pide el número de cuenta una vez y luego transfiere). Un bot que no transfiere hasta identificar al cliente es una causa de abandono.

**Variante con trial (30 min, opcional):** Learn exige que el agente de Copilot Studio y Customer Service estén en el **mismo ambiente**, que el nombre del agente tenga **menos de 30 caracteres** y que el agente esté publicado. En Copilot Studio → tu agente → **Channels** → bajo **Customer engagement hub**, el mosaico **Dynamics 365 Customer Service** → **Connect**. Luego, en el workstream → área **Bot** → **Add bot**. Para probar en tu página, usa el código **embed** del chat widget de Dynamics 365, no el de Copilot Studio: con el de Copilot Studio el handoff no funciona ([Learn: handoff](https://learn.microsoft.com/microsoft-copilot-studio/configuration-hand-off-omnichannel)). Anota qué ve el representante al aceptar la conversación transferida.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre y tipo (Text/Number) de cada context variable | ___ |
| Cuáles usa el routing y cuáles solo el representante | ___ |
| Qué hace el bot si no identifica al cliente | ___ |
| (Con trial) qué vio el representante al aceptar la transferencia, o "sin trial: diseño" | ___ |

---

## 🔧 Diagnosticar — el abandono sube y el canal nunca se cayó

Antes de la Microlección 4, resuelve este caso empezando por el síntoma:

**[Diagnosticar: abandono alto con el chat disponible](/practica/ip-d365-023-abandono-con-canal-disponible)**

Síntoma: durante una campaña, la tasa de abandono del chat pasa de 6 % a 31 %. El widget responde, no hay incidentes de plataforma y la mayoría de los abandonos son **después de la asignación**: el cliente fue asignado a un representante que no alcanzó a aceptar. Formula tu hipótesis antes de ver la causa: ¿qué mirarías en el workstream y en los representantes, y qué cambiarías?

Pregunta de entrevista/consultoría que este diagnóstico te prepara para responder: *"Activamos el canal de chat y la tasa de abandono subió durante la campaña, aunque el canal nunca se cayó — ¿qué revisarías primero?"* Escribe tu respuesta en tres frases antes de seguir.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu hipótesis antes de ver la causa | ___ |
| El dato del síntoma que más te orientó (y por qué) | ___ |
| Las dos configuraciones que cambiarías | ___ |
| Tu respuesta de entrevista en tres frases | ___ |

---

## 🧩 Microlección 4 — El tablero del supervisor: métricas con umbral y acción

**¿Qué vas a aprender?** A diseñar un tablero de supervisor donde cada métrica tiene un umbral de alerta y una acción concreta, no solo un número.

**¿Por qué existe esto?** Un tablero que solo muestra volumen ("hoy atendimos 1.200 chats") no avisa a tiempo. Learn ofrece al supervisor acciones sobre conversaciones en curso — **monitorear y unirse** (conversaciones digitales en estado **Active** o **Wrap-up**), **asignar** manualmente (solo conversaciones **Open** sin asignar, pudiendo saltarse presencia y capacidad), **transferir** (estados **Active** o **Waiting**, solo entre representantes humanos) y **forzar el cierre** — y cada una debe habilitarla un administrador con los ajustes **Supervisor Monitor**, **Supervisor Assign**, **Supervisor Transfer** y **Force Close** ([Learn: supervisar conversaciones](https://learn.microsoft.com/dynamics365/customer-service/use/monitor-conversations)).

**Práctica en papel (20 min):** define un tablero con 6 métricas. Incluye al menos ASA, abandon rate (separando antes y después de la asignación) y occupancy:

| Métrica | Umbral de alerta | Qué hace el supervisor cuando se cruza |
|---|---|---|
| ASA | ___ | ___ |
| Abandon rate antes de la asignación | ___ | ___ |
| Abandon rate después de la asignación | ___ | ___ |
| Occupancy | ___ | ___ |
| Transfer rate | ___ | ___ |
| CSAT o first contact resolution | ___ | ___ |

Ten en cuenta que los informes **históricos** de Customer Service se refrescan **una vez cada 24 horas** ([Learn: dashboards de Customer Service](https://learn.microsoft.com/dynamics365/customer-service/use/customer-service-analytics-insights-csh)): las alertas de la campaña salen de los informes en tiempo real, no del histórico.

**Variante con trial (15 min, opcional):** en **Copilot Service workspace**, abre el informe de conversaciones en curso del dashboard de análisis en tiempo real (Learn lo llama *Ongoing conversation report*; necesitas el rol de supervisor de Omnichannel) e identifica dónde verías el abandono y las conversaciones en espera. Anota los nombres exactos de las columnas que veas.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tus 6 métricas con su umbral | ___ |
| La acción del supervisor para el abandono después de la asignación | ___ |
| Qué métrica sacaste del tiempo real y cuál del histórico | ___ |

---

### 🏗️ Decidir y defender (sin pasos): ¿abrimos WhatsApp antes de la campaña?

> **Situación:** el director comercial quiere abrir WhatsApp tres semanas antes de la campaña de fin de año, "porque los clientes lo piden". Hoy hay 18 representantes de chat, ASA de 40 segundos y occupancy de 88 % en horas pico. Aún no hay cuenta de WhatsApp Business aprobada; Legal no ha revisado la retención de conversaciones. El equipo de operación es de dos personas.
> **Opciones:** (A) abrir WhatsApp ya, en el mismo workstream y la misma cola del chat; (B) abrir WhatsApp en un workstream propio, con capacity profile propio y un piloto con 5 representantes; (C) no abrir WhatsApp hasta después de la campaña y reforzar primero capacidad y bot en el chat.
> **Escribe:** la opción elegida, qué condición tendría que cumplirse para cambiar de opción, el riesgo que aceptas y un resumen de cinco líneas para el director comercial.

Antes de decidir, arma una **matriz de canales** de una línea por canal: canal, disponibilidad en tu región, licencia, proveedor externo (si aplica) y owner operativo. Es la evidencia de la restricción que descarta una opción.

Contrasta tu decisión con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Descartas por restricción, no por gusto | Cada opción descartada tiene escrita la restricción que la descarta (cuenta no aprobada, occupancy, Legal) |
| La capacidad está calculada | Dices con qué Work item limit y cuántos representantes absorberías el volumen esperado |
| El canal nuevo no rompe al existente | Explicas cómo evitas que WhatsApp consuma la capacidad del chat (workstream y perfil propios, o no abrirlo) |
| Hay criterio de salida | Escribes qué métrica y qué umbral harían pausar el canal nuevo |
| El ejecutivo entiende la decisión | El resumen cabe en cinco líneas, sin siglas sin explicar, e incluye el riesgo |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Opción elegida y la restricción que descarta las otras | ___ |
| Tu matriz de canales (una línea por canal) | ___ |
| Métrica y umbral para pausar el canal nuevo | ___ |
| Tu resumen ejecutivo de cinco líneas | ___ |

---

## 🔁 Reto de transferencia — La línea de matrículas de una universidad

**Requisito nuevo:** una universidad atiende por chat web y WhatsApp a **aspirantes** (quieren información de programas) y **estudiantes** (problemas con pagos y matrícula). Durante las dos semanas de matrícula el volumen se multiplica por cinco. Los estudiantes de posgrado deben atenderse en inglés si lo piden. Un bot ya responde fechas y requisitos; cuando transfiere, el representante pregunta otra vez el código de estudiante. Los supervisores se enteran de las colas largas por las redes sociales. Sin guía paso a paso, decide workstreams, clasificación, capacidad, handoff y métricas.

**Micropráctica de transferencia (6 min):** decide las piezas con feedback inmediato → **[Transferir: matrículas de una universidad](/practica/ip-d365-024-matriculas-universidad)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Workstreams que crearías (uno o varios) y por qué | ___ |
| Cómo llega un estudiante de posgrado que pide inglés a quien habla inglés | ___ |
| Capacity profile del pico de matrícula (Work item limit y cómo lo ajustas) | ___ |
| Qué context variable elimina la pregunta repetida del código de estudiante | ___ |
| La métrica y el umbral que avisan a los supervisores antes que las redes sociales | ___ |

---

### 💼 Casos Reales de Negocio
Una empresa activó el canal de chat sin definir capacidad de agentes. Durante campañas de marketing, cada agente recibía demasiadas conversaciones simultáneas y la tasa de abandono subió aunque "el canal nunca se cayó" técnicamente. El equipo inicialmente sospechó de un problema de infraestructura y escaló al proveedor de la plataforma, perdiendo días en diagnóstico técnico. La causa real era de configuración: sin capacity profiles ni presencia, unified routing seguía asignando conversaciones a agentes ya saturados. La solución fue configurar capacity profiles, presencia, skills y reglas de routing por prioridad. La experiencia mejoró no por abrir más canales ni por escalar infraestructura, sino por gobernar la distribución del trabajo.

### ✅ Buenas Prácticas
- Diseñar primero colas, skills y capacidad; conectar canales después de tener ese modelo operativo definido.
- Decidir el **Work distribution mode** y la **Reset frequency** del capacity profile antes de crearlos: no se pueden cambiar después sin rehacer.
- Usar capacidad por perfil o por unidades en la organización, no ambas (recomendación de Learn).
- Probar handoff con transcript y contexto completo, no solo transferencia visual de la conversación; nombrar las context variables una vez y no renombrarlas.
- Mantener una matriz de canales con disponibilidad regional, licencias, proveedor externo (si aplica) y owner operativo.
- Monitorear abandon rate (antes y después de la asignación) y transfer rate desde el piloto, no solo después de un incidente.
- Separar automatización de bot de reglas de SLA: una conversación resuelta por bot también debe tener criterio de éxito medible, no asumirse como "resuelta" por defecto.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Activar canal sin modelo de capacidad | Se prioriza disponibilidad técnica sobre operación del agente | Definir capacity profile y presencia por rol antes de abrir el canal |
| Representantes en "No molestar" siguen recibiendo chats | **Do not disturb** o **Inactive** quedaron dentro de las **Allowed presences** del workstream | Quitar esas presencias de **Allowed presences** y volver a probar |
| Bot transfiere sin contexto | Handoff mal diseñado, sin context variables definidas en el workstream | Definir las context variables y pasar intención, resumen y cliente al transferir |
| El handoff no funciona en la página de prueba | Se usó el código embed de Copilot Studio en lugar del chat widget de Dynamics 365 | Usar el código **embed** del chat widget configurado en Dynamics 365 |
| Skills no mantenidas | Cambian equipos/productos y nadie actualiza la matriz | Asignar owner mensual de la matriz de skills |
| Métricas solo de volumen | No se mide experiencia del cliente ni del agente | Agregar abandono, FCR, transfer rate y CSAT al dashboard |

### 🧪 Criterios de Validación
- [ ] Diseñé un workstream con tipo, modo de distribución, cola de respaldo, capacidad y presencias permitidas, justificando cada valor
- [ ] Documenté reglas de unified routing separando clasificación, route-to-queue y método de asignación
- [ ] Definí handoff bot-agente con context variables nombradas y qué pasa si el bot no identifica al cliente
- [ ] Diagnostiqué el abandono con canal disponible formulando una hipótesis antes de ver la causa, y respondí la pregunta de entrevista
- [ ] Diseñé un tablero de supervisor con 6 métricas, umbral y acción, separando tiempo real e histórico
- [ ] Decidí y defendí la apertura de WhatsApp con matriz de canales, rúbrica y resumen ejecutivo
- [ ] Completé el reto de transferencia de la universidad con su evidencia
- [ ] Identifiqué licencias/canales/tenant necesarios para probar Contact Center real y relacioné este módulo con el Lab 83 (Contact Center Chat Channel Hands-On)

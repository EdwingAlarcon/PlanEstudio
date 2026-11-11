---
moduleId: 64
title: "Customer Insights - Journeys — Real-Time Journeys y Consentimiento"
level: "d365"
certification: "Dynamics 365 Customer Insights"
estimatedMinutes: 22
practiceMinutes: 145
slug: "customer-insights-journeys-real-time"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 145 min en papel, mejor en dos sesiones (la primera hasta el diagnóstico; la segunda, la Microlección 4 y el reto de transferencia). Con trial, suma 45-60 min para crear el ambiente y probar. La primera vez, cuenta entre una vez y media y el doble.*

### 🎯 Objetivo
Diseñar journeys en tiempo real con triggers, segmentos, consentimiento, canales y medición, produciendo un diagrama de flujo completo y un modelo de consentimiento auditable — separando claramente Customer Insights - Journeys de Customer Insights - Data (Módulo 58) y evitando depender de outbound marketing heredado.

> **🔗 Relación con el Módulo 20 (opcional, si ya lo hiciste):** la Microlección 5 del Módulo 20 solo pidió escribir en una
> frase la regla de un segmento y el evento que dispara un journey. Aquí se construye el journey completo: cómo entra el
> contacto (trigger o segmento), anatomía de nodos (espera, rama, mensaje, goal, exit), consentimiento por propósito y
> canal (no genérico) y qué quedó de outbound marketing tras su retiro.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que decidiste o viste). En el punto **Diagnosticar** vas a explicar por qué reciben emails contactos que dijeron "no", empezando por el síntoma. En la Microlección 3 **decides y defiendes** el modelo de consentimiento con una rúbrica, y el módulo cierra con un **reto de transferencia** en otro negocio.
>
> **Antes de empezar — qué necesitas:**
> - **No necesitas tenant para completar el módulo.** Cada práctica tiene una **variante en papel** y una **variante con trial** opcional. Tu ambiente del curso no sirve: se creó sin apps de Dynamics 365.
> - **Trial, si la quieres:** Customer Insights ofrece una trial gratuita de **30 días**, extensible una vez, que instala Customer Insights - Journeys y Customer Insights - Data en el **mismo ambiente de Dataverse**. Se pide con **Try for free** en la página del producto que enlaza Learn. Para registrarte, la guía de Journeys pide un email de trabajo o de escuela, no uno personal; si no tienes uno, sugiere crear primero una trial de Office 365 E5 y usar ese email ([Learn: trial de Customer Insights](https://learn.microsoft.com/dynamics365/customer-insights/journeys/trial-signup)). Ojo: la [FAQ de la trial](https://learn.microsoft.com/dynamics365/customer-insights/data/trial-faq) dice lo contrario (un email personal crea una cuenta y un tenant nuevos); prueba primero con el que tengas.
>   - La trial crea **su propio ambiente**: no se añade a tu ambiente del curso ni a otra trial de Dynamics 365. Solo puede haber una trial de autoservicio activa por tenant; si otra persona de tu tenant ya tiene una, entras en la suya.
>   - Para que los segmentos de Data aparezcan en Journeys, Learn indica **Settings** > **Data Management** > **Customer Insights data connector** > **Connect** (puede estar ya conectado).
>   - En la trial, el dominio de envío es el preautenticado `dyn365mktg.com` (solo para pruebas) y el SMS exige contratar un proveedor (Azure Communication Services, Infobip, LINK Mobility, Telesign, Twilio o Vibes), así que las variantes con trial de este módulo se quedan en diseñar y mirar, sin envíos reales ([Learn: acciones de un journey](https://learn.microsoft.com/dynamics365/customer-insights/journeys/add-action)).
> - **Opcional, si ya lo hiciste:** el Módulo 58 (Customer Insights - Data) construye los perfiles unificados y segmentos que aquí se consumen.

### 📖 Conceptos Clave
- **Journeys vs. Data:** Customer Insights - Data (Módulo 58) unifica perfiles, calcula medidas y define segmentos; Journeys orquesta comunicaciones y experiencias en tiempo real a partir de esos segmentos o de eventos directos en Dataverse. Un journey nunca "inventa" un segmento — lo consume de Data o lo define localmente sobre datos de Dataverse.
- **Dos formas de entrar a un journey:** un **trigger-based journey** reacciona a una acción individual (abrir un email, enviar un formulario, abandonar un carrito); un **segment-based journey** recorre a quienes pertenecen a uno o más segmentos, una vez, con nuevos miembros que entran cuando el segmento se refresca, o de forma repetida según un calendario. Learn advierte que los **eventos de negocio** que afectan a muchos contactos a la vez (un ciclo de facturación, un vencimiento masivo) deben entrar por **segmento**, actualizando un atributo del contacto: lanzarlos como trigger por cada contacto probablemente excede la política de uso justo de triggers ([Learn: trigger-based journey](https://learn.microsoft.com/dynamics365/customer-insights/journeys/real-time-marketing-trigger-based-journey); [Learn: segment-based journey](https://learn.microsoft.com/dynamics365/customer-insights/journeys/real-time-marketing-segment-based-journey)).
- **Real-time journey — anatomía:** inicio (trigger o segmento), mensajes (email, SMS, push u otro canal), **esperas** (un tiempo fijo o hasta una fecha; máximo 90 días), **ramas** (*if/then branch*, que espera un trigger durante un plazo, y *attribute branch*, que decide con los datos del momento y admite varias salidas), **goal** (el trigger que indica éxito y el porcentaje esperado) y **exit** (el trigger o segmento que saca al contacto del journey) ([Learn: acciones de un journey](https://learn.microsoft.com/dynamics365/customer-insights/journeys/add-action)). El motor evalúa cada contacto de forma individual: dos contactos que entran el mismo día pueden estar en pasos distintos según cómo interactúen.
- **Triggers — con ejemplos concretos de origen:** Learn distingue tres tipos en el catálogo: **custom triggers** (los define tu equipo; se lanzan desde un sitio, una app o un servicio con código), **interaction triggers** (interacciones con los mensajes del journey, como *Email opened* o *Email link clicked*) y **business triggers** (cambios en apps de Dynamics 365, como *Contact created*, *Lead created*, *Incident created*, *Opportunity created* o *Marketing form submitted*). Además puedes crear un trigger sobre **cualquier cambio de un registro de Dataverse** sin código, por ejemplo el **Status** de un caso que pasa a **Resolved** ([Learn: triggers](https://learn.microsoft.com/dynamics365/customer-insights/journeys/real-time-marketing-triggers); [Learn: trigger de Dataverse](https://learn.microsoft.com/dynamics365/customer-insights/journeys/real-time-marketing-dataverse-trigger)). El trigger debe ser un evento discreto y con timestamp claro — "cliente insatisfecho" no es un trigger válido; "CSAT registrado menor a 3" sí lo es.
- **Consentimiento:** requisito operativo y legal por canal, propósito y contacto. En Customer Insights - Journeys el consentimiento se guarda **por punto de contacto** (cada email o teléfono) en registros de *contact point consent*, dentro de una jerarquía: **compliance profiles** → **purposes** → **topics**. Los tres tipos estándar de propósito son **Commercial communication**, **Transactional communication** y **Tracking**. Cada propósito tiene un modelo de cumplimiento: **Restrictive** (solo se envía a quien tiene opt-in), **Non-restrictive** (se envía salvo opt-out) o **Disabled** (no se revisa el consentimiento) ([Learn: consentimiento](https://learn.microsoft.com/dynamics365/customer-insights/journeys/real-time-marketing-compliance-settings)). Un contacto puede tener consentimiento para email de servicio pero no para email de marketing: son dos consentimientos distintos, no uno genérico.
- **Outbound marketing heredado — ya no existe:** Microsoft retiró el módulo de outbound marketing de **todos** los ambientes en **mayo de 2026**. Sus tablas y datos siguen accesibles, pero sus emails, formularios, journeys, segmentos y datos de consentimiento **no se pueden usar** en real-time journeys ([Learn: notas de la retirada de outbound](https://learn.microsoft.com/dynamics365/customer-insights/journeys/outbound-removal-notes)). Migrar campañas antiguas es rediseñarlas, no reactivarlas.
- **Canales:** email, SMS, push u otros dependen de configuración, proveedor, consentimiento vigente y licencia. Para email, el dominio del remitente debe estar **autenticado** (registros DNS de propiedad, DKIM y SPF): la revisión de errores del email no te deja ponerlo en vivo con un remitente de un dominio no registrado. Las instancias nuevas y las trials traen un dominio preautenticado que termina en `dyn365mktg.com`, pensado **solo para pruebas** ([Learn: autenticar dominios](https://learn.microsoft.com/dynamics365/customer-insights/journeys/domain-authentication)). Un journey bien diseñado puede fallar en producción por la configuración del dominio, no por la lógica del journey.
- **Personalización:** usa datos del perfil/contacto, medidas de Customer Insights - Data (Módulo 58, ej. LTV) o atributos del trigger, pero debe respetar minimización de datos — personalizar con el dato mínimo necesario, no con todo el perfil disponible solo porque existe.
- **Marketing-to-sales handoff:** cuando un journey detecta que un contacto alcanzó un umbral de calificación (ej. completó 3 journeys de nutrición y visitó la página de precios), el paso siguiente no es "seguir enviando más contenido" — es crear o actualizar un `Lead` (o una tarea para el vendedor) en Sales con el contexto de journeys recorridos. En el journey, Learn ofrece la acción **Create a record** (en **preview**: no la uses en producción) y la acción **Activate a custom trigger**, que puede disparar un flujo de Power Automate que cree el registro ([Learn: acciones de un journey](https://learn.microsoft.com/dynamics365/customer-insights/journeys/add-action)).
- **Métricas:** delivery, open/click (cuando el canal lo permite), conversion (goal attainment), unsubscribe y error rate. Un journey con alto delivery pero bajo conversion puede tener el trigger correcto pero el mensaje o la oferta equivocada — son diagnósticos distintos.
- **Copilot y agentes en Journeys (estado a noviembre de 2026):** Learn lista, entre otras, *query assist* para crear segmentos describiendo el criterio en lenguaje natural, ayuda para redactar y reescribir emails y el **Journey Creation Agent**, que propone la estructura de un journey (tipo, pasos, esperas, ramas, entrada y salida) a partir de una descripción. El agente está en **preview**, solo en inglés, consume Copilot credits, lo activa un administrador en **AI Hub** y usa segmentos y contenidos que **ya existen**: no crea segmentos ni escribe el contenido ([Learn: Copilot en Journeys](https://learn.microsoft.com/dynamics365/customer-insights/journeys/copilot-overview); [Learn: Journey Creation Agent](https://learn.microsoft.com/dynamics365/customer-insights/journeys/journey-creation-agent)). Tampoco decide el consentimiento: lo que propone se revisa con los mismos criterios de este módulo antes de publicar.
- **Requisitos reales de práctica:** diseñar el flujo del journey, el modelo de consentimiento y las pruebas negativas puede hacerse sin tenant. Validar entrega real, triggers en vivo, dominio de envío y consentimiento operando requiere Customer Insights - Journeys habilitado, dominio/canal configurado y contactos de prueba.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — ¿Trigger o segmento? Cómo entra el contacto

**¿Qué vas a aprender?** A elegir cómo entra cada contacto a un journey: por una acción suya (trigger) o por pertenecer a un segmento.

**¿Por qué existe esto?** La renovación de un contrato que vence en 45 días parece un "evento", pero le pasa a cientos de contactos el mismo día por una regla de negocio, no por algo que hizo el cliente. Learn recomienda modelarlo como **segment-based journey** (un segmento de "contratos que vencen en 45 días" que se refresca), no como trigger por contacto. Elegir mal aquí no se nota en el diseño; se nota en producción, cuando los triggers exceden el uso justo o el journey no recoge a quien entra al segmento después.

**Micropráctica (5 min):** decide cómo entra cada journey con feedback inmediato → **[Trigger o segmento: cómo entra cada journey](/practica/ip-d365-025-trigger-o-segmento)**.

**Práctica en papel (15 min):** para cada necesidad, escribe si el journey es **trigger-based** o **segment-based**, qué trigger o segmento lo inicia y qué lo saca (exit):

| Necesidad | Tipo de journey | Qué lo inicia | Qué lo saca (exit) |
|---|---|---|---|
| Encuesta cuando se resuelve un caso de soporte | ___ | ___ | ___ |
| Recordatorio de renovación a contratos que vencen en 45 días | ___ | ___ | ___ |
| Bienvenida cuando alguien envía el formulario de contacto del sitio | ___ | ___ | ___ |
| Seguimiento si el cliente no abre el email de renovación en 7 días | ___ | ___ | ___ |

Para la renovación decide además la **frecuencia** del segment-based journey: **one-time** con audiencia estática, **one-time** con miembros nuevos que entran cuando el segmento se refresca, o **repeating** (todos los miembros vuelven a entrar en cada ejecución). Escribe qué pasaría con un contrato que entra al segmento el día 10 en cada opción.

**Variante con trial (20 min, opcional):** en Customer Insights - Journeys → **Triggers** → **New trigger**, nombre `Caso resuelto`, opción **When a record related to a customer is created or updated** → **Create**; elige la tabla **Case**, el atributo que contiene la audiencia y la columna **Status** como cambio que activa el trigger → **Ready to use**. Learn advierte que este trigger capta **cualquier** cambio de Status: el filtro "Status = Resolved" se agrega en el journey, no en el trigger. Anota qué columnas te ofreció. Si la tabla **Case** no aparece en la lista de tu ambiente, anótalo y repite el ejercicio con **Contact** o **Lead**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tipo de journey e inicio de cada una de las 4 necesidades | ___ |
| Frecuencia elegida para la renovación y qué pasa con el contrato que entra el día 10 | ___ |
| (Con trial) tabla, audiencia y columna de tu trigger `Caso resuelto`, o "sin trial: diseño" | ___ |

---

## 🧩 Microlección 2 — Anatomía del journey de renovación

**¿Qué vas a aprender?** A dibujar un journey completo con mensajes, esperas, ramas, goal y exit, y a saber qué hace cada nodo.

**¿Por qué existe esto?** El diagrama original de este módulo empezaba con "Trigger: contrato vence en 45 días" y volvía en bucle al email de recordatorio sin salida. Las dos cosas fallan en producción: la entrada debería ser un segmento (Microlección 1) y un bucle sin exit sigue enviando recordatorios a quien ya renovó.

**Práctica en papel (25 min):**

1. Parte de este diagrama corregido y complétalo con al menos una rama adicional (ej. qué pasa si el contacto abre el email pero no hace clic):

   ```mermaid
   flowchart TD
       A["Inicio: segmento 'Contratos que vencen en 45 días' (nuevos miembros entran al refrescarse)"] --> B["Email inicial de renovación (con el propósito que definiste para renovación)"]
       B --> C{"If/then: ¿Email link clicked en la oferta antes de 7 días?"}
       C -->|Sí| E["Crear tarea para el vendedor con contexto"]
       C -->|No| F["Email de recordatorio"]
       F --> G{"If/then: ¿Email link clicked antes de 7 días?"}
       G -->|Sí| E
       G -->|No| H["Fin del journey; el contrato queda en la lista de llamadas del vendedor"]
       X["Exit: trigger 'Contrato renovado' en cualquier punto"] -.-> Z["Sale del journey"]
   ```

2. Define el **goal**: qué trigger indica éxito (por ejemplo, el contrato renovado) y qué porcentaje de la audiencia esperas que lo alcance.
3. Para cada espera, comprueba que no supera los **90 días** que admite una espera.
4. Especifica qué datos vienen de Customer Insights - Data (perfil unificado, medidas, segmentos — Módulo 58) y qué datos viven en Dataverse/Journeys (contrato, fecha de vencimiento, interacciones del journey).

**Variante con trial (25 min, opcional):** en **Engagement** → **Journeys** → **+New journey**, elige **Segment-based**, un segmento de prueba y la frecuencia que decidiste. En el lienzo, usa **+** (o **+Add an action**) para agregar un email y después un **Wait for trigger** (Learn también lo llama *if/then branch*) con **Branch off this** = ese email, **Wait for** = *Email link clicked* y límite de 7 días. Si no tienes un email listo, crea uno de prueba en borrador; el goal y el exit se configuran en los ajustes **Goal** y **Exit** del journey ([Learn: segment-based journey](https://learn.microsoft.com/dynamics365/customer-insights/journeys/real-time-marketing-segment-based-journey)). Los emails pueden estar en **Draft** mientras diseñas; para publicar, deben estar en **Ready to send**. No publiques el journey en la trial si el segmento tiene contactos reales.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu rama adicional (condición y destino) | ___ |
| Goal: trigger de éxito y porcentaje esperado | ___ |
| Exit: trigger o segmento que saca al contacto | ___ |
| Qué datos vienen de Data y cuáles de Dataverse/Journeys | ___ |

---

## 🧩 Microlección 3 — Consentimiento por propósito: decidir y defender

**¿Qué vas a aprender?** A modelar el consentimiento con compliance profiles, purposes y topics, y a elegir el modelo de cumplimiento de cada propósito con criterios explícitos.

**¿Por qué existe esto?** El caso real de este módulo es exactamente esto: un consentimiento de "servicio" reutilizado para "marketing". Learn deja la decisión en tus manos — los propósitos por defecto "son valores del producto, no recomendaciones legales" — y el modelo de cumplimiento está **en el propósito**, no en el compliance profile: si compartes un propósito entre perfiles, cambiar su modelo afecta a todos ([Learn: consentimiento](https://learn.microsoft.com/dynamics365/customer-insights/journeys/real-time-marketing-compliance-settings)).

**Práctica en papel (25 min):**

1. Define el modelo de consentimiento en tabla para al menos 2 propósitos distintos (ej. "renovación" y "marketing general"):

   | Propósito | Tipo (Commercial / Transactional / Tracking) | Canal | Fuente del consentimiento | Modelo (Restrictive / Non-restrictive) | Regla de exclusión |
   |---|---|---|---|---|---|
   | ___ | ___ | ___ | ___ | ___ | ___ |
   | ___ | ___ | ___ | ___ | ___ | ___ |

2. Redacta 3 pruebas negativas con su resultado esperado: contacto con consentimiento válido para "renovación", contacto sin consentimiento para ese propósito, y contacto con email inválido o rebotado. Agrega una cuarta: contacto que ya renovó (debe salir por el exit).

**Variante con trial (10 min, opcional, solo mirar):** ve a **Settings** > **Customer engagement** > **Compliance profiles**, abre el perfil que trae el ambiente y anota sus propósitos, su tipo y el modelo de cumplimiento de cada uno. No cambies el modelo: si el propósito está compartido entre perfiles, el cambio afectaría a todos.

**🏗️ Decidir y defender (sin pasos):**

> **Situación:** la empresa opera en Colombia y en España. Marketing quiere un solo compliance profile y un solo propósito "Commercial communication" **Non-restrictive** para los dos países, "para no perder audiencia". Legal en España exige opt-in previo para comunicaciones comerciales; en Colombia el equipo legal aún no se pronuncia. Hay dos preference centers, uno por país.
> **Opciones:** (A) un perfil y un propósito compartido Non-restrictive; (B) un perfil y un propósito compartido Restrictive; (C) dos compliance profiles con propósitos comerciales propios, Restrictive en España y el que decida Legal en Colombia.
> **Escribe:** la opción elegida, qué cambia si Legal en Colombia también pide opt-in, y un resumen de cinco líneas para la directora de marketing.

Contrasta tu decisión con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| El requisito legal manda | Escribes qué requisito de Legal descarta cada opción, y no lo sustituyes por "perder audiencia" |
| Sabes dónde vive el modelo | Dices que el modelo de cumplimiento es del **propósito** y qué pasa al compartirlo entre perfiles |
| Propósitos separados | Renovación y marketing general no comparten consentimiento, y dices con Legal si la renovación es comunicación transaccional o comercial |
| Hay prueba negativa | Incluyes un contacto español sin opt-in y su resultado esperado |
| El ejecutivo entiende la decisión | El resumen cabe en cinco líneas e incluye el costo en audiencia que se acepta |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tus 2 propósitos con tipo, canal, fuente y modelo | ___ |
| Tus 4 pruebas negativas con resultado esperado | ___ |
| Opción elegida para Colombia y España, y la restricción que descarta las otras | ___ |
| Tu resumen de cinco líneas para marketing | ___ |
| (Con trial) propósitos y modelo de cumplimiento del perfil del ambiente, o "sin trial: diseño" | ___ |

---

## 🔧 Diagnosticar — contactos que dijeron "no" siguen recibiendo emails

Antes de la Microlección 4, resuelve este caso empezando por el síntoma:

**[Diagnosticar: el journey ignora el "no enviar email" del contacto](/practica/ip-d365-026-journey-ignora-no-email)**

Síntoma: un equipo de ventas marca en el formulario del contacto que no quiere emails masivos (`DoNotBulkEmail`), pero el journey comercial sigue enviándoles. El propósito usado es **Commercial communication** con modelo **Non-restrictive**, y esos contactos no tienen ningún registro de consentimiento. Formula tu hipótesis antes de ver la causa: ¿qué consentimiento revisa el journey y qué cambiarías?

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu hipótesis antes de ver la causa | ___ |
| Qué consentimiento revisa el journey por defecto y cuál no | ___ |
| Las dos acciones que propones (la rápida y la de fondo) | ___ |

---

## 🧩 Microlección 4 — Del journey al vendedor, y cómo se mide

**¿Qué vas a aprender?** A diseñar el paso de marketing a ventas y a leer las métricas del journey separando problemas de entrega, de mensaje y de oferta.

**¿Por qué existe esto?** Un journey que "funciona" pero nunca entrega un contacto calificado al vendedor es una secuencia de emails. Y un journey con métricas bajas tiene causas distintas según la métrica: un error rate alto apunta a canal o dominio; un click bajo con open alto, al mensaje; un goal bajo con clics altos, a la oferta.

**Práctica en papel (20 min):**

1. Diseña el criterio de marketing-to-sales handoff para el journey de renovación: ¿qué umbral de interacción convierte al contacto en una tarea u oportunidad para el vendedor, y qué contexto de journeys recibe el vendedor?
2. Decide cómo se crea ese registro: la acción **Create a record** (en preview: solo para pruebas) o **Activate a custom trigger** que dispara un flujo de Power Automate. Escribe por qué.
3. Lee este resultado ilustrativo de un journey y di qué revisarías primero: entregados 96 %, abiertos 41 %, clics 2 %, goal 0,5 %, bajas 0,3 %.
4. Indica qué requiere tenant real: ambiente con Customer Insights - Journeys, dominio de envío autenticado (no el `dyn365mktg.com` de prueba), consentimiento vigente, contactos de prueba y permisos.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Umbral de handoff y contexto que recibe el vendedor | ___ |
| Cómo se crea el registro (acción o flujo) y por qué | ___ |
| Qué revisarías primero en el resultado ilustrativo, y por qué esa métrica | ___ |
| Lista de requisitos de tenant real | ___ |

---

## 🔁 Reto de transferencia — Recordatorios y promociones de una red de clínicas dentales

**Requisito nuevo:** una red de clínicas dentales quiere: (1) recordar cada cita por SMS 24 horas antes, con la fecha de la cita que llega en el trigger "Cita agendada"; (2) enviar una promoción de blanqueamiento solo a pacientes que la aceptaron; (3) avisar a recepción para que llame al paciente que no confirma; (4) que el paciente que cancela la cita deje de recibir recordatorios. La mitad de los pacientes nunca dio su consentimiento para promociones. Sin guía paso a paso, decide tipo de journey, propósitos, espera, handoff y exit.

**Micropráctica de transferencia (6 min):** decide las piezas con feedback inmediato → **[Transferir: recordatorios y promociones de clínicas dentales](/practica/ip-d365-027-clinicas-dentales)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tipo de journey y propósito del recordatorio de cita | ___ |
| Propósito y modelo de cumplimiento de la promoción | ___ |
| Cómo esperas hasta 24 horas antes de la cita (y el límite de la espera) | ___ |
| Cómo se avisa a recepción | ___ |
| Qué saca del journey al paciente que cancela | ___ |

---

### 💼 Casos Reales de Negocio
Un equipo de marketing migró campañas históricas de su plataforma outbound sin revisar consentimiento ni triggers. El resultado fue un real-time journey que enviaba emails a contactos sin opt-in vigente para ese propósito específico — el consentimiento existía para "servicio" pero se reutilizó para "marketing", una confusión que un revisor legal detectó antes del despliegue masivo. La corrección no fue solo técnica: se redefinieron propósitos, fuentes de consentimiento, exclusiones y pruebas negativas antes de volver a activar comunicaciones. En Customer Insights - Journeys, compliance es parte del diseño del journey desde el primer nodo, no una validación posterior al lanzamiento.

### ✅ Buenas Prácticas
- Diseñar todo journey nuevo como real-time journey: outbound marketing se retiró de todos los ambientes en mayo de 2026 y sus activos no se pueden usar en real-time.
- Modelar los eventos de negocio masivos (vencimientos, ciclos de facturación) como segment-based journeys, y los triggers para acciones individuales del cliente.
- Documentar consentimiento por propósito y canal antes de redactar el primer mensaje del journey; usar los registros de contact point consent como única fuente de verdad.
- Probar exclusiones negativas (sin consentimiento, email inválido, contacto duplicado, contacto que ya convirtió), no solo el caso feliz.
- Definir el goal y el exit del journey antes de agregar ramas adicionales.
- Autenticar el dominio de envío real antes de salir a producción; el dominio `dyn365mktg.com` es solo para pruebas.
- Mantener clara la frontera Data vs. Journeys para no duplicar la definición de un perfil o segmento en ambos lugares.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Confundir segmento unificado con journey | Se mezclan responsabilidades de Data y de Journeys | Documentar la fuente del segmento (Data) y la acción de activación (Journeys) por separado |
| Enviar sin consentimiento verificable para ese propósito | Pruebas realizadas solo con contactos internos con consentimiento general | Agregar caso negativo de consentimiento específico por propósito |
| El journey ignora `DoNotEmail`/`DoNotBulkEmail` | Por defecto los real-time journeys no evalúan esos campos; revisan el contact point consent | Activar **Check contact consent in real-time journeys** en **Settings** > **Overview** > **Feature switches** o, mejor, llevar ese "no" a registros de contact point consent |
| Disparar un trigger por cada contacto en un evento masivo | Se modeló un vencimiento o un ciclo de negocio como trigger | Rediseñar como segment-based journey sobre un atributo que se actualiza |
| Journey sin objetivo medible | Se diseña como secuencia de emails sin definir conversión | Definir goal y conversion event desde el primer diagrama |
| Depender de outbound heredado | Reutilización de campañas antiguas sin revisar el roadmap de la plataforma | Rediseñar en real-time journeys: los activos de outbound no se pueden usar desde la retirada de mayo de 2026 |

### 🧪 Criterios de Validación
- [ ] Decidí trigger-based o segment-based para 4 necesidades, con su inicio y su exit
- [ ] Diseñé un real-time journey con inicio, rama, espera, goal, exit y al menos una rama adicional
- [ ] Documenté consentimiento por propósito y canal para 2 propósitos distintos, con modelo de cumplimiento
- [ ] Decidí y defendí el modelo de consentimiento para dos países con la rúbrica y un resumen ejecutivo
- [ ] Diagnostiqué el journey que ignora el "no enviar email" formulando una hipótesis antes de ver la causa
- [ ] Separé datos provenientes de Customer Insights - Data y de Journeys/Dataverse
- [ ] Diseñé el criterio de marketing-to-sales handoff para el journey de renovación
- [ ] Identifiqué pruebas negativas y requisitos de tenant/licencia, y completé el reto de las clínicas dentales
- [ ] Relacioné este módulo con el Lab 58 (segmento y journey de renovación) y el Lab 84 (real-time journey)

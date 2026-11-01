---
moduleId: 15
title: "Copilot Studio — Introducción"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 15
practiceMinutes: 150
slug: "copilot-studio-introduccion"
lastVerified: "2026-11"
---
### 🎯 Objetivo
Crear un agente conversacional funcional en Copilot Studio que resuelve consultas de usuarios, escala a Power Automate para acciones sobre datos, y se integra en Teams y páginas web como canal de soporte automatizado.

> **Cómo está organizado este módulo:** cada concepto viene con una micropráctica de feedback inmediato y luego una práctica real en tu entorno, con una tabla de evidencia donde anotas el dato exacto que viste (no un "sí, funcionó"). Al final de la Microlección 3 vas a **diagnosticar** un síntoma antes de ver la causa, y el módulo cierra con un **reto de transferencia** que cambia el requisito.
>
> **Antes de empezar (lee esto, ahorra media hora):**
> - **Cuenta:** necesitas una cuenta de trabajo o estudio (no una cuenta personal de Outlook/Hotmail). Es la misma del Módulo 1.
> - **Licencia:** si no tienes licencia de Copilot Studio, al entrar a [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com) puedes activar una prueba (trial). Con el trial **puedes construir y probar** el agente en el panel de prueba, pero **no puedes publicarlo** en Teams ni en otros canales ([Learn: licencias de Copilot Studio](https://learn.microsoft.com/microsoft-copilot-studio/requirements-licensing-subscriptions)). Este módulo está pensado para que todo lo evaluable se haga en el panel de prueba; la publicación (Microlección 4) tiene un camino alternativo si tu trial no la permite.
> - **Entorno:** crea el agente en el **entorno del curso** (el que tiene Dataverse y tu tabla **Solicitud TI**), no en el entorno por defecto del tenant. En Copilot Studio el entorno se cambia con el selector de entorno de la barra superior. Desde noviembre de 2026 cambió cómo se consigue un entorno de práctica: ver [Entornos y trials](/recursos/entornos-y-trials).
> - **Experiencia "clásica" vs nueva:** Copilot Studio está estrenando experiencias de creación nuevas. Este módulo usa la experiencia estándar (la que tiene las pestañas **Topics**, **Knowledge**, **Tools** y **Channels**). Si al entrar ves otra pantalla de creación, desactiva el interruptor **New experience** y confirma con **Submit**, o abre el menú **…** al pie de la barra lateral y elige **Open classic experience** ([Learn: cambiar de experiencia](https://learn.microsoft.com/microsoft-copilot-studio/switch-experiences)).
> - **Datos de prueba:** al menos 3 solicitudes en tu tabla **Solicitud TI** creadas **después** de agregar la columna Autonumber **Número de Solicitud** del Módulo 7 (formato `SOL-{SEQNUM:6}`, por ejemplo `SOL-001000`). Anota dos números que existan y su Estado.

---

## 🧩 Microlección 1 — El agente, sus instrucciones y su conocimiento

**¿Qué vas a aprender?** Qué piezas tiene un agente de Copilot Studio y cómo darle conocimiento a partir de un documento.

**¿Por qué existe esto?** Microsoft ya no llama "bots" ni "copilots" a lo que construyes aquí: se llaman **agents** (agentes). Un agente combina cuatro piezas, y elegir bien cuál usar para cada necesidad es la mitad del trabajo:

- **Instructions** (instrucciones): el texto que le dice al agente cómo comportarse (tono, idioma, qué no hacer). Admite hasta 8.000 caracteres.
- **Knowledge** (conocimiento): fuentes que el agente consulta para responder preguntas abiertas con IA generativa (*generative answers*): sitios web públicos, documentos subidos, SharePoint, Dataverse. Sirve para "¿cómo reseteo mi contraseña?", **no** para datos que cambian cada hora.
- **Topics** (temas): conversaciones guiadas que tú diseñas nodo a nodo (preguntar, condicionar, responder). Sirven cuando necesitas pasos exactos y datos estructurados.
- **Tools** (herramientas): acciones que el agente ejecuta, por ejemplo un **agent flow** de Power Automate que consulta Dataverse. Sirven para datos vivos, como "¿en qué estado está mi solicitud?".

Dos conceptos más que debes conocer desde el inicio:

- **Orquestación** (*orchestration*): cómo decide el agente qué topic o herramienta usar. Los agentes nuevos usan por defecto **orquestación generativa**: la IA elige según la **descripción** de cada topic y herramienta. En la **orquestación clásica**, el agente activa un topic cuando el mensaje se parece a sus **trigger phrases** (frases de activación). Se cambia en **Settings** > **Generative AI** > **Orchestration** ([Learn: orquestación generativa](https://learn.microsoft.com/microsoft-copilot-studio/advanced-generative-actions)). En este módulo usarás la **clásica**, porque así ves exactamente qué frase activó qué topic y porque las entidades personalizadas (Microlección 2) no se admiten como entradas de topics con la orquestación generativa.
- **Frescura del conocimiento:** un **archivo subido** se guarda como una copia en Dataverse: si el documento original cambia, el agente sigue respondiendo con la versión vieja hasta que subas la nueva. En cambio, una fuente **SharePoint** se consulta en el momento de la pregunta y respeta los permisos de quien pregunta ([Learn: fuentes de conocimiento](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio), [Learn: subir archivos](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-file-upload)).

**Ejemplo pequeño:**
```
"¿Cómo me conecto a la VPN?"          → Knowledge (manual de soporte)
"¿En qué estado está SOL-001000?"      → Topic + Tool (agent flow que lee Dataverse)
"Quiero hablar con una persona"        → Topic de sistema Escalate
```

**Ahora haz algo — micropráctica (5 min):** antes de construir, decide qué pieza resuelve cada necesidad de la mesa de ayuda → **[Elegir la pieza correcta del agente](/practica/ip-cs-001-elegir-pieza-del-agente)**.

**Práctica real en tu entorno (25 min):**

1. Prepara el conocimiento: en Word crea un documento corto `Manual de soporte TI.docx` con 3 preguntas frecuentes y su respuesta (por ejemplo: cómo restablecer la contraseña, cómo conectarse a la VPN, a quién avisar si la impresora no imprime). Inventa un dato concreto en cada respuesta (por ejemplo "la VPN se llama SIT-VPN y el puerto es 443"): te servirá para comprobar que el agente leyó **tu** documento.
2. En [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com), con el entorno del curso seleccionado, ve a la página **Agents** y elige **Create blank agent**.
3. Antes de crearlo, abre **Advanced settings**: elige como idioma principal (*primary language*) el español, y como solución tu solución del curso (la de los Módulos 2 a 8, con publisher `sit`). **Ojo:** el idioma principal **no se puede cambiar después**; si te equivocas, tendrás que crear otro agente ([Learn: crear un agente](https://learn.microsoft.com/microsoft-copilot-studio/authoring-first-bot)).
4. Ponle de nombre `Asistente IT SIT` (máximo 42 caracteres) y selecciona **Create**. Al terminar verás la página **Overview** del agente.
5. En la sección de instrucciones de **Overview**, selecciona **Edit** y escribe: "Eres un asistente amigable de soporte IT. Respondes en español. Si no puedes resolver la consulta, ofreces escalar a un humano. No inventes información: responde solo con lo que encuentres en tus fuentes." Guarda.
6. Cambia a orquestación clásica: **Settings** > **Generative AI** > **Orchestration**; a la pregunta "Use generative AI orchestration for your agent's responses?" elige **No** y guarda.
7. En **Overview** (sección **Knowledge**) selecciona **Add knowledge**, elige subir un archivo (**Upload file**) y sube tu `Manual de soporte TI.docx`. Espera a que su estado pase a **Ready**: puede tardar unos minutos.
8. Abre el panel de prueba (**Test**) y pregunta una de tus preguntas frecuentes con otras palabras. La respuesta debe incluir tu dato inventado y una cita al documento.

**Si no lo ves:** si responde "no sé" o algo genérico, revisa que el archivo esté en **Ready** y que tu pregunta use palabras del documento. Si el agente responde en inglés, revisa el idioma principal (paso 3): si quedó en inglés, crea el agente de nuevo.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Entorno donde creaste el agente (nombre exacto) | ___ |
| Idioma principal y solución elegidos en **Advanced settings** | ___ |
| Valor elegido en **Orchestration** | ___ |
| Estado del archivo en **Knowledge** (texto exacto) | ___ |
| Pregunta que hiciste y fragmento de la respuesta que contiene tu dato inventado | ___ |

---

## 🧩 Microlección 2 — Topic con trigger phrases, entidades y slot filling

**¿Qué vas a aprender?** Cómo diseñar un topic que se active con frases variadas y que extraiga el número de solicitud del primer mensaje sin volver a preguntarlo.

**¿Por qué existe esto?**
- **Topic:** unidad de conversación con un punto de entrada (el **Trigger**), nodos de lógica y una respuesta. Los **system topics** (Conversation Start, Fallback, Escalate, End of Conversation…) vienen predefinidos: puedes editarlos o desactivarlos, pero no crearlos ni borrarlos. Buena práctica: topics pequeños, una intención cada uno.
- **Trigger phrases:** frases de ejemplo con las que el modelo de lenguaje aprende a reconocer la intención. **No** son coincidencias exactas: detecta variaciones. Learn pide **de 5 a 10** frases por topic ([Learn: crear y editar topics](https://learn.microsoft.com/microsoft-copilot-studio/authoring-create-edit-topics)); varía vocabulario, longitud y estilo (formal/informal, con y sin tildes).
- **Entities** (entidades): tipos de dato que el agente reconoce dentro del texto. Hay entidades predefinidas (por ejemplo **Number**, **Email**, **Date and time**, **Person name**, **City**) y personalizadas: **Closed list** (lista cerrada con sinónimos) o **Regular expression (regex)** (un patrón, como el de tus números de solicitud) ([Learn: entidades y slot filling](https://learn.microsoft.com/microsoft-copilot-studio/advanced-entities-slot-filling)).
- **Slot filling:** si la pregunta de un topic espera una entidad y el usuario ya la dijo en su primer mensaje ("¿cómo va SOL-001000?"), el agente toma el valor y **se salta la pregunta**; si no la dijo, pregunta.
- **Variables:** guardan datos durante la conversación. Alcances: **Topic** (solo dentro del topic), **Global** (toda la conversación, entre topics), **System** (las da el agente, por ejemplo `System.Activity.Text` con el último mensaje del usuario o `System.User.DisplayName` cuando el usuario inició sesión con Microsoft) y **Environment** (variables de entorno de Power Platform, de solo lectura) ([Learn: variables](https://learn.microsoft.com/microsoft-copilot-studio/authoring-variables-about)).

**Ejemplo pequeño:** tu número es `SOL-` + 6 dígitos (`SOL-001000`). La entidad predefinida **Number** no sirve: se quedaría solo con un número y perdería el prefijo y los ceros. Una entidad regex `SOL-\d{6}` reconoce exactamente ese formato.

**Práctica real en tu entorno (35 min):**

*Parte A — entidades (10 min)*

1. **Settings** > **Entities** > **Add an entity** > **New entity** > **Regular expression (regex)**. Nombre: `NumeroSolicitudSIT`. Patrón: `(?i)SOL-\d{6}` (el `(?i)` hace que acepte también "sol-001000" en minúsculas). Guarda.
2. **Add an entity** > **New entity** > **Closed list**. Nombre: `CategoriaIT`. Agrega los cinco valores de tu columna **Categoría** del Módulo 2 y sus sinónimos:
   ```
   Hardware   (sinónimos: computadora, equipo, impresora, mouse, teclado)
   Software   (sinónimos: aplicación, programa, instalación, licencia)
   Red        (sinónimos: internet, wifi, conectividad, vpn)
   Accesos    (sinónimos: contraseña, password, usuario, cuenta, login)
   Otro       (sinónimos: otra cosa, no sé, varios)
   ```
   Activa **Smart matching** para que también reconozca errores de tipeo. Guarda. (La usarás en el reto de transferencia.)

*Parte B — el topic (25 min)*

3. **Topics** > **Add a topic** > **From blank**. En **Details**, nombre: `Consultar Estado Solicitud` (sin puntos en el nombre). Escribe también una **Description** ("Consulta el estado de una solicitud de soporte TI por su número"): con orquestación clásica no decide nada, pero te ahorra trabajo si algún día cambias a la generativa.
4. En el nodo **Trigger**, abre sus propiedades (**…** > **Properties**) y agrega estas 8 frases con **Add phrases**:
   ```
   ¿Cuál es el estado de mi solicitud?
   quiero saber cómo va mi solicitud
   cómo va mi ticket
   estado de mi caso
   revisar mi solicitud SOL-001000
   buscar mi ticket
   mi solicitud ya está lista
   ya resolvieron mi caso?
   ```
5. Debajo del Trigger, con el icono **+** (*Add node*) elige **Ask a question**. Texto: "¿Cuál es el número de tu solicitud? (Ejemplo: SOL-001000)". En **Identify** elige tu entidad `NumeroSolicitudSIT`. Abre la variable que se creó, renómbrala a `NumeroSolicitud` y confirma que su alcance es **Topic**.
6. Agrega un **Send a message**: "Voy a consultar la solicitud {x}", insertando la variable `Topic.NumeroSolicitud` con el botón **{x}**. (En la Microlección 3 lo sustituirás por la consulta real.)
7. **Save**.
8. Prueba en el panel **Test**: abre **…** y activa **Track between topics** para ver qué topic se activa. Prueba dos mensajes, reiniciando la conversación con el icono **Reset** entre uno y otro:
   - "quiero ver el estado de SOL-001000" → no debería preguntarte el número (slot filling).
   - "cómo va mi ticket" → debería preguntártelo.
   Mira el valor de `NumeroSolicitud` en el panel **Variables** (pestaña **Test**).

**Si no lo ves:** si "cómo va mi ticket" activa otro topic (o el Fallback), agrega frases más parecidas a cómo escribe la gente. Si el agente vuelve a preguntar el número aunque lo escribiste, revisa que la pregunta identifique `NumeroSolicitudSIT` (no **Number** ni **User's entire response**) y que escribiste el número con el formato exacto.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Patrón exacto de tu entidad regex | ___ |
| Valor de `NumeroSolicitud` en el panel **Variables** tras "quiero ver el estado de SOL-001000" | ___ |
| ¿Te preguntó el número en esa prueba? (anota qué mensaje mostró el agente justo después) | ___ |
| Mensaje exacto del agente tras "cómo va mi ticket" | ___ |
| Una frase de usuario que activó el topic equivocado (o el Fallback) y qué frase agregaste para corregirlo | ___ |

---

## 🧩 Microlección 3 — Consultar Dataverse con un agent flow

**¿Qué vas a aprender?** Cómo darle al agente datos vivos de Dataverse a través de un flujo de Power Automate y cómo bifurcar la respuesta si no hay resultado.

**¿Por qué existe esto?** El conocimiento (Microlección 1) no sirve para el estado de una solicitud, que cambia a cada rato. Para eso se usa un **agent flow**: un flujo cuyo trigger es **When an agent calls the flow** y que termina con **Respond to the agent**. Reglas que Learn marca como obligatorias ([Learn: usar flujos en un agente](https://learn.microsoft.com/microsoft-copilot-studio/advanced-use-flow), [Learn: crear un agent flow](https://learn.microsoft.com/microsoft-copilot-studio/advanced-flow-create)):

- El flujo debe estar **publicado** y en una **solución** del mismo entorno que el agente.
- Debe responder en menos de **100 segundos**, y **Respond to the agent** debe tener la respuesta asíncrona (**Asynchronous response**) desactivada. Si no, el agente da un error (código 3000).

Después, en el topic, un nodo **Condition** (condición) revisa el resultado: si la variable está vacía (**is Blank**), dice "no la encontré"; en la rama **All other conditions**, muestra el estado ([Learn: condiciones](https://learn.microsoft.com/microsoft-copilot-studio/authoring-using-conditions)).

**Práctica real en tu entorno (40 min):**

*Parte A — el flujo (25 min)*

1. En tu agente, ve a **Tools** > **Add tool** y, en las opciones para crear una herramienta nueva, elige **Agent flow**. Se abre el diseñador de flujos con el trigger **When an agent calls the flow** y la acción **Respond to the agent** ya colocados.
2. En el trigger agrega una entrada de tipo texto (**Text**) llamada `NumeroSolicitud`.
3. Entre el trigger y la respuesta agrega la acción **List rows** del conector Dataverse:
   - **Table name:** Solicitudes TI.
   - **Filter rows:** escribe el nombre lógico de tu columna **Número de Solicitud**, seguido de ` eq '`, la entrada `NumeroSolicitud` (desde el contenido dinámico, el rayo azul) y `'`. Queda así, por ejemplo: `sit_numerodesolicitud eq 'SOL-001000'`, con el número como pastilla de contenido dinámico. **El nombre `sit_numerodesolicitud` es un ejemplo:** el tuyo lo ves en tu solución > **Tables** > **Solicitud TI** > **Columns** > columna **Número de Solicitud** (como en el Módulo 5, si Dataverse quitó una tilde, usa el tuyo).
   - En los parámetros avanzados (**Advanced parameters**), **Row count:** `1`.
4. En **Respond to the agent** agrega dos salidas de tipo texto y pon su valor con **fx** (expresión). Ajusta `sit_estado` al nombre lógico de tu columna **Estado**:
   - `Estado`: `coalesce(first(outputs('List_rows')?['body/value'])?['sit_estado@OData.Community.Display.V1.FormattedValue'], '')`
   - `UltimaActualizacion`: `coalesce(first(outputs('List_rows')?['body/value'])?['modifiedon@OData.Community.Display.V1.FormattedValue'], '')`

   `first(...)` toma la primera fila; si no hay ninguna, `coalesce(..., '')` devuelve texto vacío en vez de un error. `@OData.Community.Display.V1.FormattedValue` pide la etiqueta en texto ("En Proceso") en vez del número de la opción, igual que en el Módulo 5. Si en las salidas sin procesar (*raw outputs*) de una prueba no aparece la versión formateada de `modifiedon`, usa `modifiedon` a secas (vendrá en UTC).
5. Abre **Respond to the agent** > **Settings** y confirma que **Asynchronous response** está en **Off**.
6. Ponle nombre al flujo (`SIT - Obtener Estado Solicitud`), selecciona **Publish** y espera la confirmación.
7. Comprueba que el flujo quedó dentro de tu solución (en [make.powerapps.com](https://make.powerapps.com) > **Solutions** > tu solución). Si no está, agrégalo con **Add existing** > **Automation** > **Cloud flow**.

*Parte B — usarlo en el topic (15 min)*

8. Vuelve al topic `Consultar Estado Solicitud`. Borra el mensaje provisional del paso 6 de la Microlección 2. Debajo de la pregunta, con **+** elige **Add a tool** y selecciona tu flujo. Se crea un nodo **Action**: en la entrada `NumeroSolicitud` elige la variable `Topic.NumeroSolicitud`; las salidas `Estado` y `UltimaActualizacion` se guardan en variables del topic.
9. Debajo, **Add a condition**. En la primera rama, **Select a variable** > `Estado`, operador **is Blank**, y un mensaje: "No encontré una solicitud con el número {x}. Revisa que tenga el formato SOL-000000." En la rama **All other conditions**, el mensaje:
   ```
   Tu solicitud {Topic.NumeroSolicitud} está en estado: {Topic.Estado}
   Última actualización: {Topic.UltimaActualizacion}
   ```
10. **Save** y prueba en **Test** con: un número que exista, un número que no exista (`SOL-999999`) y un texto sin formato ("la de ayer"). Si el agente tarda o da error, abre el historial de ejecuciones del flujo en Power Automate.

**Si no lo ves:** "el flujo no aparece en **Add a tool**" → no está publicado o está en otro entorno. "Siempre dice que no la encontró" → revisa en el historial del flujo el **Filter rows** que se envió: casi siempre es el nombre lógico de la columna o un espacio de más. "Error 3000" → **Asynchronous response** está activado.

**🔧 Diagnosticar antes de construir (5 min):** un compañero hizo lo mismo, pero su agente responde "No encontré una solicitud" con números que sí existen. Encuentra la causa antes de ver la solución → **[Diagnosticar: el agente no encuentra la solicitud](/practica/ip-trb-011-agente-no-encuentra-la-solicitud)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre lógico exacto de tu columna **Número de Solicitud** | ___ |
| Texto exacto de **Filter rows** tal como aparece en el historial de una ejecución (con el número ya sustituido) | ___ |
| Respuesta del agente para un número existente (copia el texto) | ___ |
| Respuesta del agente para `SOL-999999` | ___ |
| Duración de la ejecución del flujo en el historial (segundos) | ___ |

---

## 🧩 Microlección 4 — Fallback, escalamiento y publicación en Teams

**¿Qué vas a aprender?** Qué hace el agente cuando no entiende, cómo ofrecer un humano y cómo llevar el agente a Teams.

**¿Por qué existe esto?**
- **Fallback:** topic de sistema que se activa cuando ningún topic coincide. Con la orquestación clásica, antes del Fallback el agente intenta responder con su conocimiento (topic de sistema **Conversational boosting**). Si tampoco encuentra nada, el Fallback vuelve a preguntar y, tras varios intentos, escala.
- **Escalate:** topic de sistema para pasar a un humano. La transferencia real, con historial, usa el nodo **Transfer conversation**, que solo funciona si conectas un *engagement hub* (por ejemplo Dynamics 365 Customer Service con su canal de chat, antes llamado Omnichannel). Sin ese hub, la buena práctica es que **Escalate** diga cómo contactar a la mesa de ayuda (correo, enlace o teléfono): nunca dejes al usuario sin salida ([Learn: hand-off](https://learn.microsoft.com/microsoft-copilot-studio/advanced-hand-off)).
- **Channels** (canales): dónde vive el agente. **Microsoft 365 and Microsoft Teams** es el más común en empresas; también hay sitio web (demo y personalizado), aplicación móvil, SharePoint, WhatsApp y canales vía Azure Bot Service (Slack, Telegram, Twilio, etc.). Al seleccionar **Publish**, la nueva versión llega a **todos** los canales conectados ([Learn: publicar y desplegar](https://learn.microsoft.com/microsoft-copilot-studio/publication-fundamentals-publish-channels)).

**Práctica real en tu entorno (20 min):**

1. **Topics** > pestaña **System** > **Escalate**. Reemplaza el mensaje por uno real: "Te paso con la mesa de ayuda: escribe a soporte@tuempresa.com o llama a la extensión 1234, indicando tu número de solicitud." (Usa un contacto inventado si no tienes uno.) **Save**. Pruébalo en **Test** escribiendo "quiero hablar con una persona".
2. En `Consultar Estado Solicitud`, al final de la rama **All other conditions**, agrega **Ask a question** "¿Necesitas algo más con esta solicitud?" con opciones (**Multiple choice options**): `Escalar al equipo` y `No, gracias`. En la rama de `Escalar al equipo`, agrega **Topic management** > **Go to another topic** > **Escalate**. En la de `No, gracias`, un mensaje de despedida. **Save** y prueba.
3. **Publicar (solo si tu licencia lo permite):** selecciona **Publish** y confirma. Luego **Channels** > **Microsoft 365 and Microsoft Teams** > **Add channel**. Cuando termine, selecciona **See agent in Teams** y luego **Add** en Teams ([Learn: publicar en Teams](https://learn.microsoft.com/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams)). Para que otros lo usen están las **Availability options**: copiar un enlace, mostrarlo a compañeros con quienes compartiste el agente, o enviarlo al catálogo de la organización (requiere aprobación de un administrador). En el curso, quédate con el enlace para ti.
4. En Teams prueba los mismos casos de la Microlección 3. Si después vuelves a publicar un cambio y Teams sigue mostrando la versión anterior, escribe `start over` en el chat del agente para empezar una conversación nueva con la última versión.
5. **Si tienes trial y no puedes publicar:** haz el paso 4 en el panel **Test** y, en **Variables** > **Test**, guarda una instantánea con **Save snapshot**: esa es tu evidencia ([Learn: probar el agente](https://learn.microsoft.com/microsoft-copilot-studio/authoring-test-bot)).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Dónde probaste (Teams o panel **Test**) y por qué | ___ |
| Mensaje exacto que dio **Escalate** al escribir "quiero hablar con una persona" | ___ |
| Qué respondió el agente a una pregunta que no está ni en tus topics ni en tu manual (por ejemplo "¿cuánto cuesta un vuelo a Madrid?") | ___ |
| Si publicaste: hora de la publicación y si tuviste que usar `start over` para ver el cambio | ___ |

---

## 🔁 Reto de transferencia — Cancelar una solicitud, sin pasos

**Requisito nuevo:** la mesa de ayuda quiere que el agente también permita **cancelar** una solicitud. Construye el topic `Cancelar Solicitud` sin una guía paso a paso. Reglas de negocio:

1. Debe activarse con frases como "quiero cancelar mi solicitud" o "ya no necesito el ticket SOL-001000" (slot filling incluido).
2. Antes de cambiar nada, pide confirmación (sí/no) mostrando el número.
3. Un agent flow nuevo pasa la solicitud a **Cerrada** **solo** si existe y no estaba ya en **Cerrada**, y le responde al agente qué pasó (cerrada, ya estaba cerrada, o no existe). Pista: **Update a row** del conector Dataverse; para el valor de una Choice en un flujo necesitas el **número** de la opción (lo viste en el Módulo 5).
4. Si el usuario venía de `Consultar Estado Solicitud`, no le vuelvas a pedir el número. Pista: en las propiedades de la variable puedes marcar que **reciba valores de otros topics** (**Receive values from other topics**), y en el topic de origen pasarla al redirigir con **Go to another topic**; o convertirla en variable **Global** (ojo: esa conversión no se puede deshacer).

**Micropráctica de transferencia (5 min):** la misma idea en otro negocio: un agente de Recursos Humanos → **[Transferir: agente de RR.HH.](/practica/ip-cs-002-agente-de-recursos-humanos)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Frases de activación que usaste (todas) | ___ |
| Cómo evitaste volver a pedir el número (variable global o recibir valores de otro topic) | ___ |
| Respuesta del agente al cancelar una solicitud abierta, y su Estado en Dataverse después | ___ |
| Respuesta del agente al intentar cancelar la misma solicitud otra vez | ___ |

---

### 💼 Caso Real de Negocio
**Empresa:** Empresa de 800 empleados con mesa de ayuda IT sobrecargada  
**Problema:** 70% de tickets eran consultas de estado que podía responder un bot. Los analistas perdían 4 horas diarias en responder "¿cómo va mi solicitud?".  
**Solución:** Copilot Studio con integración a Dataverse vía Power Automate. Knowledge Source con manual de usuario para preguntas frecuentes. Canal Teams para acceso desde donde trabajan los empleados.  
**Resultado:** 65% de consultas resueltas por el bot. Tiempo de respuesta: de 2 horas a instantáneo. Satisfacción usuarios: 4.2/5.

### ✅ Buenas Prácticas
- Entre 8 y 10 trigger phrases por topic (Learn pide de 5 a 10), con variaciones naturales y con errores tipográficos comunes
- Variables Topic.X son locales al topic; usar Global.X (o pasar valores entre topics) para compartir entre topics
- Siempre agregar nodo de "no entendí" en el Fallback topic personalizado, y que **Escalate** diga cómo contactar a un humano
- Probar en el panel **Test your agent** (con **Track between topics** activado) después de cada cambio, antes de publicar
- Los flujos de Power Automate para Copilot Studio deben estar en soluciones, en el mismo entorno que el agente
- Habilitar Generative Answers solo con Knowledge Sources confiables — verificar que no alucine; y recordar que un archivo subido no se actualiza solo
- Datos que cambian (estados, saldos, fechas) van por un agent flow o un conector, no por un archivo de conocimiento

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Bot no activa el topic correcto | Trigger phrases muy similares a otro topic, o muy pocas | Activar **Track between topics** en el panel de prueba para ver qué topic se activó, y ajustar las frases de ambos topics |
| El número de solicitud llega sin "SOL-" ni ceros | La pregunta identifica la entidad **Number** | Usar una entidad **Regular expression (regex)** con el patrón `SOL-\d{6}` |
| Variable del flujo llega vacía | Output del flujo no mapeado correctamente, o **Filter rows** con un nombre lógico equivocado | Verificar nombres de output en el flujo y en el nodo de acción, y revisar el filtro en el historial de ejecuciones |
| El agente da error al llamar el flujo (código 3000) | **Asynchronous response** activado en **Respond to the agent**, o el flujo tarda más de 100 s | Desactivar la respuesta asíncrona y reducir lo que hace el flujo antes de responder |
| Slot filling pregunta dos veces | Entidad detectada pero variable no asignada | Verificar que la variable del slot filling apunta a la variable del nodo pregunta |
| Generative Answers inventa datos o responde con información vieja | Knowledge Source desactualizado o ambiguo (un archivo subido es una copia estática) | Subir de nuevo el archivo actualizado (o usar una fuente SharePoint, que se consulta en vivo) y mantener la instrucción "no inventes datos" |
| Teams no muestra el cambio que publicaste | La conversación abierta sigue con la versión anterior | Escribir `start over` en el chat del agente (o esperar: puede tardar hasta una hora) |

### 🧪 Criterios de Validación
- [ ] Creé el agente en el entorno del curso, con idioma principal español, dentro de mi solución y con instrucciones en español
- [ ] El agente responde con un dato de mi `Manual de soporte TI` y lo cita
- [ ] El topic `Consultar Estado Solicitud` tiene al menos 8 trigger phrases y se activa con 3 frases que no están en la lista
- [ ] Con "quiero ver el estado de SOL-001000" el agente no pregunta el número (slot filling) y la variable guarda `SOL-001000` completo
- [ ] Mi agent flow está publicado, dentro de la solución, y responde en menos de 100 segundos
- [ ] El agente muestra el estado real de Dataverse para un número existente y un mensaje amigable para `SOL-999999`
- [ ] **Escalate** da un contacto real (o inventado) en vez de dejar al usuario sin salida
- [ ] Probé 5 escenarios distintos en Teams (o, con trial, en el panel **Test** con una instantánea guardada)
- [ ] Resolví el reto `Cancelar Solicitud` sin volver a pedir el número cuando vengo de la consulta

---

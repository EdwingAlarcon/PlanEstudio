---
moduleId: 22
title: "Copilot Studio Avanzado"
level: "avanzado"
certification: "PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"
estimatedMinutes: 18
practiceMinutes: 180
slug: "copilot-studio-avanzado"
lastVerified: "2026-11"
---
### 🎯 Objetivo
Construir un agente de producción usando el modelo actual de Copilot Studio (agentes potenciados por el GitHub Copilot harness): instrucciones en lenguaje natural, Knowledge sources, Tools, Skills reutilizables, Connected Agents para arquitecturas modulares, autenticación con Microsoft Entra ID, y evaluación/monitoreo continuo.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica en tu entorno con **evidencia** (el dato exacto que viste, no un "sí, funcionó"). En la Microlección 4 vas a **diagnosticar** un agente que elige la herramienta equivocada antes de ver la causa, y el módulo cierra con un reto de construcción sin pasos y un **reto de transferencia** con otro dominio.
>
> **Antes de empezar (lee esto, ahorra una tarde):**
> - **Viene del Módulo 15.** Necesitas lo que construiste allí: el entorno del curso con tu tabla **Solicitud TI** (con la columna Autonumber **Número de Solicitud**), el documento `Manual de soporte TI.docx` y tu agente `Asistente IT SIT` (harness estándar). En este módulo **no** modificas ese agente: creas uno nuevo con el GitHub Copilot harness y comparas.
> - **Este harness consume Copilot Credits desde que empiezas a construir.** Learn lo advierte en cada artículo: usar, construir, probar en **Preview** y correr **Evaluate** puede consumir Copilot Credits, y ese consumo **no** lo cubre una licencia de Microsoft 365 Copilot ([Learn: facturación por uso](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/billing-credit-overview)). Si tu tenant no tiene créditos asignados al entorno, el agente puede dejar de responder a mitad de la práctica. Si lo administras tú (o se lo pides al administrador), en el [Power Platform admin center](https://admin.powerplatform.microsoft.com) → **Licensing** → **Copilot Studio** se asignan créditos al entorno (**Manage Copilot Credits**) y se puede poner un **límite mensual** por agente (**Manage Agents** → **Set limit**) para que una práctica no gaste de más ([Learn: administrar el consumo del GitHub Copilot harness](https://learn.microsoft.com/power-platform/admin/manage-usage-github-copilot-harness)). La pestaña **Monitor** del agente muestra cuánto llevas consumido.
> - **Comprueba los créditos en 2 minutos, antes de invertir la tarde:** crea un agente de prueba con el GitHub Copilot harness (tile **Agent** en **Home**), llámalo `Prueba creditos`, guárdalo y escribe `hola` en **Preview**. Si responde, tu entorno tiene créditos y puedes seguir (borra ese agente de prueba cuando quieras). Si aparece un aviso de capacidad o de créditos, o no responde, haz el módulo con la **variante sin créditos** de abajo.
> - **Publicar:** la Microlección 5 (agentes conectados) exige que el agente especialista esté **publicado**. Si tu licencia no te deja publicar (como el trial del Módulo 15), esa parte tiene un camino alternativo.
> - **Variante sin créditos:** si no puedes usar el GitHub Copilot harness, haz el módulo con el **harness estándar** (en la página **Home** de Copilot Studio, **Other ways to build**), con la orquestación generativa activada. Las equivalencias están en la tabla de abajo y cada microlección indica qué cambia. Anota en tu evidencia qué harness usaste. El [Lab 22](/labs/lab-22-copilot-studio) también se hace en el harness estándar.

> **Nota de vigencia (nov-2026):** Copilot Studio ofrece hoy **varios harnesses** al crear un agente. Learn documenta tres: el **harness estándar** (el del Módulo 15: Topics con triggers, nodos y flujos de conversación explícitos), el **GitHub Copilot harness** (natural-language-first: describes al agente, conectas lo que necesita, y un runtime de orquestación mejorada decide cuándo usar cada pieza) y el **Customer Conversation harness**, pensado para agentes que atienden a **clientes** por voz o chat, se publican en el chat de un sitio web o en un número de teléfono y pueden escalar a una persona ([Learn: harnesses](https://learn.microsoft.com/microsoft-copilot-studio/harnesses-overview)). Este módulo no usa el tercero: sus agentes atienden a empleados, y WhatsApp no figura entre los canales que Learn le menciona (lo necesitarás en el reto de transferencia). Microsoft mantiene **ambos completamente soportados en paralelo**: no es que Topics esté retirado. Un agente **no** puede pasarse de un harness al otro después de creado: la elección se hace al crear el agente. Este módulo enseña el GitHub Copilot harness porque ofrece razonamiento más profundo (especialmente sobre datos de Microsoft 365) y es donde Microsoft concentra las capacidades nuevas (Skills, Memory), pero **no** es la opción correcta para todo: hoy no soporta algunas piezas que sí tiene el estándar (tabla de abajo), y elegir harness es una decisión de diseño, no de moda ([Learn: agentes con el GitHub Copilot harness](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/overview)).

**Del Módulo 15 a este módulo — qué cambia en el GitHub Copilot harness** (según la tabla comparativa de Learn):

| Lo que hiciste en el Módulo 15 (harness estándar) | En el GitHub Copilot harness |
|---|---|
| Topics con trigger phrases y nodos **Condition** | No hay topics que diseñar: el comportamiento lo dan las **Instructions** y las descripciones de cada pieza. Para ejecutar un workflow en un momento del ciclo de vida (al iniciar sesión, antes de correr un tool) existen los **Hooks** |
| Entidad personalizada con regex `(?i)SOL-\d{6}` | Las entidades personalizadas **no** están soportadas: el formato esperado se explica en las instrucciones y en la descripción de la entrada del workflow |
| Agent flow (**When an agent calls the flow** → **Respond to the agent**) | **Workflow** como tool, con los mismos dos nodos |
| Interruptor de orquestación clásica / generativa | No se configura: todos los agentes usan la orquestación mejorada |
| Prompt tool | No soportado: lo reemplazan los **Skills** |
| **Authenticate manually** (OAuth propio, Client ID/Secret) | No soportado: solo **No authentication** o **Authenticate with Microsoft** |
| Canales SharePoint, WhatsApp, Dynamics 365 Contact Center | No soportados (Teams/Microsoft 365 y sitio web sí) |
| Knowledge con Azure AI Search | No soportado |
| Panel **Test** con **Track between topics** | Pestaña **Preview** con el *activity trace* |
| Idiomas agregados y habilitados | El idioma de respuesta lo controlan las instrucciones |

### 📖 Conceptos Clave

- **GitHub Copilot harness — qué es y qué no es:** es un framework de autoría y orquestación de Copilot Studio (no es el servicio de GitHub Copilot ni envía tus datos a él) que reemplaza la autoría explícita de topics/flujos por una pestaña **Build** donde describes el agente en lenguaje natural y conectas sus piezas. La facturación es por **Copilot Credits** (basada en uso) para construir, probar y evaluar agentes.

- **Las pestañas del agente:** **Build** (configurar identidad, conocimiento, tools, skills, modelo y memoria), **Preview** (probar en un chat), **Evaluate** (correr sets de prueba que miden calidad) y **Monitor** (salud en producción, resultados, reacciones, sesiones y consumo de créditos).

- **La pestaña Build — las 7 piezas del agente:** `Instructions` (identidad, tono, alcance, comportamiento), `Knowledge` (fuentes de datos + memoria para dar contexto), `Tools` (acciones externas: APIs, flujos, conectores), `Skills` (capacidades reutilizables empaquetadas), `Model` (el modelo de IA que razona), `Connected agents` (delega tareas a agentes especializados), `Memory` (en preview — recuerda detalles entre interacciones). Instructions, Tools y Skills son las que reemplazan directamente lo que en el harness estándar vivía en Topics.

- **Agent details — lo que se decide antes del primer guardado:** el **nombre** que tenga el agente al guardarlo por primera vez fija su **schema name** (nombre único del sistema), que después queda de solo lectura. El idioma principal (**Primary language**) y la **Solution** se eligen en **Settings** → **Agent details** antes de ese primer guardado ([Learn: crear un agente](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/build-new-agent)).

- **Tools — el reemplazo de "Call an action":** un Tool conecta el agente con un sistema externo (conector, servidor MCP o un **Workflow** construido en el diseñador de Copilot Studio). El runtime de orquestación decide cuándo invocar un Tool según el mensaje del usuario, las instrucciones y el **nombre y la descripción** del Tool — ya no se diseñan trigger phrases ni ramas de condición para cada acción. Ese nombre y esa descripción son el mecanismo crítico: Learn pone como ejemplo "Create support ticket" frente a un genérico "Ticket tool"; una descripción vaga, o dos Tools con descripciones que se solapan, degradan la precisión con la que el agente elige la herramienta correcta ([Learn: tools](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/tools-overview)).

- **Skills — capacidades reutilizables, distintas de los Tools:** un Skill es un paquete portable de nombre + descripción + instrucciones (en Markdown), que opcionalmente incluye scripts, plantillas y documentos de referencia. A diferencia de un Tool (que conecta con un sistema externo), un Skill es autocontenido — encapsula conocimiento de dominio o un procedimiento multi-paso (ej. "política de gastos", "flujo de escalamiento de incidentes") de forma reutilizable entre distintos agentes. Se agrega de 3 formas: crearlo desde cero (**Create from blank**), subir un archivo `.md` o un paquete `.zip` con `SKILL.md` (**Upload a skill**), o generarlo con IA (**Generate with AI**). El **nombre** solo admite minúsculas, números y guiones (por ejemplo `diagnostico-impresora`), y la **descripción** es lo que el orquestador lee para decidir cuándo activarlo ([Learn: crear skills](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/skills-create)).

- **Knowledge — fuentes específicas, sin toggle general:** el harness soporta sitios web públicos, archivos subidos, SharePoint, OneDrive, conectores de Graph y tablas de Dataverse; en el diálogo **Add knowledge** aparecen como sugeridas, entre otras, sitios web públicos, SharePoint, OneDrive for Business, Salesforce, ServiceNow y Azure SQL, y en **Advanced** Azure DevOps Wiki, Azure DevOps Work Items, Custom Connector y sitios web empresariales. Azure AI Search **no** está soportado. La diferencia con el estándar: no existe un interruptor general de "conocimiento general encendido/apagado" — el acceso se gestiona agregando o quitando fuentes desde **Knowledge** en la pestaña Build ([Learn: agregar conocimiento](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/knowledge-add-existing-copilot)).

- **Connected Agents — arquitectura modular, no monolítica:** en vez de que un solo agente crezca con decenas de Tools/Skills de dominios distintos, un agente primario puede delegar una tarea a un **agente conectado** especializado cuando la petición cae en su dominio. El agente conectado corre con su propio contexto (sus instrucciones, Knowledge y Tools), recibe la tarea (el orquestador puede reformularla) y devuelve el resultado al agente primario, que es quien responde al usuario. Se pueden conectar agentes de Copilot Studio y también agentes de Microsoft Foundry, agentes que usan el protocolo A2A y agentes del Microsoft 365 Agents SDK. Para conectar un agente de Copilot Studio, este debe usar el GitHub Copilot harness, estar en el **mismo entorno**, estar **publicado** y tener activado **Allow other agents to connect** ([Learn: agentes conectados](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/authoring-add-other-agents), [Learn: agregar un agente conectado](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/add-agent-connected)).

- **Autenticación — dos opciones en este harness:** en **Settings** → **Safety & access** → **Authentication** eliges **No authentication** o **Authenticate with Microsoft** (Microsoft Entra ID, automático en Teams y Microsoft 365). La autenticación manual del harness estándar (App Registration propia, Client ID/Secret, Generic OAuth 2, Token Exchange URL para SSO) **no** está soportada en el GitHub Copilot harness: si el caso la exige, es una razón para elegir el harness estándar. Cuando un Tool necesita una conexión del usuario, el agente le muestra una tarjeta **Connection Required** con **Set up connection** ([Learn: settings](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/settings-overview), [Learn: conexiones del usuario final](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/end-user-connections)).

- **Activity trace — cómo ves lo que decidió el orquestador:** en **Preview**, al desactivar **End user preview**, ves la traza de cada turno: mensaje del usuario, consulta de conocimiento, tool o workflow invocado (con los argumentos que recibió y lo que devolvió), skill, errores y respuesta. Es el equivalente de **Track between topics** del Módulo 15 y la herramienta principal de diagnóstico ([Learn: activity trace](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/authoring-activity-trace)).

- **Ciclo de vida del agente:** `Create` (eliges el harness al crear) → `Build` (configuras las piezas) → `Test` (pestañas **Preview** y **Evaluate**) → `Publish` (despliegas a los canales elegidos) → `Monitor` (salud en producción, sesiones y consumo de créditos; los datos de producción aparecen cuando la gente usa el agente publicado).

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Elegir harness y crear el agente con sus instrucciones

**¿Qué vas a aprender?** A decidir con criterio qué harness usar y a crear un agente en el GitHub Copilot harness sin perder decisiones que después no se pueden cambiar.

**¿Por qué existe esto?** El harness no se puede cambiar después. Antes de crear, revisa los requisitos que lo deciden: ¿necesita canal WhatsApp o SharePoint, autenticación manual con un proveedor OAuth propio, entidades personalizadas o Azure AI Search? Entonces, harness estándar. ¿Necesita razonar en varios pasos sobre datos de Microsoft 365, combinar muchas fuentes y tools sin diseñar cada rama, o reutilizar procedimientos como Skills? Entonces, GitHub Copilot harness. Y dentro del agente, dos cosas se fijan en el primer guardado: el nombre (que genera el schema name) y el idioma principal.

**Ahora haz algo — micropráctica (6 min):** elige harness y piezas para tres agentes distintos, con feedback inmediato → **[Elegir harness y piezas del agente](/practica/ip-cs-003-elegir-harness-y-piezas)**.

**Práctica real en tu entorno (20 min):**

1. En [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com), con el **entorno del curso** seleccionado (el mismo del Módulo 15), en la página **Home** selecciona el tile **Agent** (o ve a **Agents** → **New agent**). El agente se abre con la pestaña **Build** activa y el campo del nombre seleccionado.
2. Escribe el nombre `Asistente IT SIT Pro`. **Todavía no guardes.**
3. Abre **…** → **Settings** → **Agent details**: en **Primary language** elige el español y en **Solution** tu solución del curso (publisher `sit`). El campo **Schema name** puede estar vacío: si lo dejas así, Copilot Studio lo genera a partir del nombre del agente en el primer guardado ([Learn: settings](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/settings-overview)). Déjalo vacío y cierra la configuración.
4. En **Instructions** escribe:
   ```
   Eres el asistente de soporte IT de SIT Consulting.
   Ayudas a empleados a crear solicitudes de soporte y respondes preguntas
   basándote únicamente en la base de conocimiento de IT.
   Si no tienes la información, dilo explícitamente y sugiere contactar a soporte@empresa.com.
   Responde siempre en español, máximo 3 párrafos por respuesta.
   Antes de crear una solicitud, confirma con el usuario el título y la descripción.
   ```
5. Selecciona el icono **Save**. Vuelve a **…** → **Settings** → **Agent details**: el campo **Schema name** ya muestra el valor generado y no se puede editar. Anótalo.
6. En el panel de componentes, abre la lista **Model** y anota qué modelo quedó seleccionado. No elijas modelos experimentales o en preview para un agente que irá a producción: Learn advierte que pueden variar en calidad y consumo ([Learn: elegir modelo](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/authoring-select-agent-model)).
7. En **Preview**, escribe "Hola, ¿qué puedes hacer?" y comprueba que responde en español y dentro del alcance de tus instrucciones.

**Si no lo ves:** si no aparece el tile **Agent** o el agente se abre con pestañas **Topics** / **Knowledge** / **Tools** / **Channels**, estás en el harness estándar o tu entorno no tiene habilitado el nuevo ([Learn: cambiar de experiencia](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/switch-experiences)). Si el agente no responde y aparece un aviso de capacidad o créditos, revisa el punto de créditos de "Antes de empezar".

> **Variante sin créditos (harness estándar):** **Home** → **Other ways to build** → crea `Asistente IT SIT Pro` como en el Módulo 15 (idioma y solución en **Advanced settings**), escribe las mismas instrucciones en **Overview** y deja la orquestación **generativa** (no la cambies a clásica como en el Módulo 15).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Harness usado y entorno (nombre exacto) | ___ |
| Schema name generado y si quedó de solo lectura tras guardar | ___ |
| Idioma principal y solución elegidos antes del primer guardado | ___ |
| Modelo seleccionado | ___ |
| Una razón concreta por la que este agente sí encaja en el harness que elegiste | ___ |

---

## 🧩 Microlección 2 — Knowledge y un Workflow que crea solicitudes en Dataverse

**¿Qué vas a aprender?** A darle al agente conocimiento para preguntas abiertas y una acción real (crear una fila en **Solicitud TI**) mediante un Workflow, y a comprobar con el activity trace qué hizo.

**¿Por qué existe esto?** Es la misma separación del Módulo 15 (conocimiento para lo que no cambia, tool para datos vivos y acciones), pero sin topic que decida cuándo llamar al flujo: lo decide el orquestador leyendo el nombre y la descripción del Workflow. Por eso aquí el nombre y la descripción no son metadata secundaria: son la "trigger phrase" de este harness. El Workflow, igual que el agent flow del Módulo 15, empieza con **When an agent calls the flow** y termina con **Respond to the agent** ([Learn: agregar un workflow](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/tools-add-workflow)).

**Práctica real en tu entorno (40 min):**

*Parte A — conocimiento (10 min)*

1. En **Build**, selecciona **Knowledge** → **Add knowledge** y sube tu `Manual de soporte TI.docx` del Módulo 15 (puedes arrastrarlo al diálogo). Si tienes un sitio de SharePoint con documentación, puedes agregarlo en su lugar desde **SharePoint**.
2. Revisa el nombre y la descripción de la fuente: describe en una frase qué cubre ("Manual con preguntas frecuentes de contraseña, VPN e impresoras").
3. En **Preview**, desactiva **End user preview** y pregunta una de tus preguntas frecuentes con otras palabras. En el activity trace comprueba que hubo una consulta de **Knowledge** y que la respuesta contiene tu dato inventado. Luego pregunta algo fuera de alcance ("¿cuál es el menú del comedor?") y comprueba que el agente lo reconoce en vez de inventar.

*Parte B — el Workflow (30 min)*

4. En **Build**, selecciona **Tools** → en el diálogo **Add a tool**, **Add** (junto a la barra de búsqueda) → **Workflow**. Se abre el diseñador con **When an agent calls the flow** y **Respond to the agent**.
5. En **When an agent calls the flow** agrega dos entradas de tipo texto: `Titulo` y `Descripcion`.
6. Entre los dos nodos agrega la acción **Add a new row** del conector Dataverse: **Table name** = Solicitudes TI; **Título de Solicitud** (la columna principal que creaste en el Módulo 2 y el Lab 02; si le pusiste otro nombre, usa el tuyo) = la entrada `Titulo`; **Descripción** = la entrada `Descripcion` (las dos desde el contenido dinámico). Deja **Prioridad** y **Estado** con sus valores por defecto.
7. En **Respond to the agent** agrega una salida de tipo texto `NumeroSolicitud` y elige en el contenido dinámico de **Add a new row** la columna **Número de Solicitud** (el Autonumber del Módulo 7). Como en el Módulo 15, confirma que **Asynchronous response** está en **Off**.
8. Nombra el workflow `SIT - Crear Solicitud TI`, selecciona el icono **Save** y luego **Publish**. Vuelve a la pestaña **Build**: el workflow aparece en la lista de **Tools**.
9. Selecciona el tool en la lista para abrir **Tool details**. En **Details** pon un nombre y una descripción específicos, por ejemplo: nombre `Crear solicitud de soporte TI`; descripción `Crea una solicitud nueva en la mesa de ayuda cuando el usuario reporta un problema técnico que no se resolvió con el manual de soporte. Devuelve el número de solicitud (formato SOL-000000).` **Save**.
10. En **Preview** (con el activity trace visible) escribe "Mi portátil no enciende desde esta mañana, necesito ayuda". El agente debería confirmar título y descripción (por tus instrucciones) y luego invocar el workflow. Anota en el trace los argumentos que recibió y el número que devolvió, y búscalo en tu tabla **Solicitud TI** en [make.powerapps.com](https://make.powerapps.com).

**Si no lo ves:** "el workflow no aparece en **Tools**" → no está publicado o está en otro entorno. "El agente responde con el manual en vez de crear la solicitud" → la descripción del tool no deja claro cuándo usarlo; reescríbela. "La fila se crea pero el número vuelve vacío" → la salida de **Respond to the agent** no está mapeada a **Número de Solicitud**, o la fila se creó en una tabla sin la columna Autonumber.

> **Variante sin créditos (harness estándar):** **Knowledge** → **Add knowledge** con el mismo documento; luego **Tools** → **Add tool** → **Agent flow** con los mismos nodos y la misma descripción del paso 9. Con la orquestación generativa, el agente decide usar el flujo leyendo esa descripción, igual que aquí. Prueba en el panel **Test** del Módulo 15 en lugar del activity trace.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de la fuente de Knowledge y fragmento de respuesta con tu dato inventado | ___ |
| Qué respondió a la pregunta fuera de alcance | ___ |
| Nombre y descripción finales del tool | ___ |
| Argumentos que el trace muestra que recibió el workflow | ___ |
| Número de Solicitud devuelto, y si existe en la tabla **Solicitud TI** | ___ |

---

## 🧩 Microlección 3 — Autenticación y conexiones del usuario

**¿Qué vas a aprender?** Qué autenticación ofrece este harness, qué cambia para el usuario y cuándo la falta de autenticación manual te obliga a elegir el harness estándar.

**¿Por qué existe esto?** El caso real de este módulo depende de saber quién pregunta: sin identidad, el agente solo puede dar el procedimiento genérico. En el GitHub Copilot harness la identidad viene de **Authenticate with Microsoft** (Microsoft Entra ID, sin App Registration propia). Si el agente debe autenticar contra un proveedor OAuth distinto, o necesitas configurar tú la App Registration (Client ID, Client Secret, Token Exchange URL), eso es **autenticación manual** y solo existe en el harness estándar ([Learn: autenticación en el harness estándar](https://learn.microsoft.com/microsoft-copilot-studio/configuration-end-user-authentication)).

**Práctica real en tu entorno (15 min):**

1. Abre **…** → **Settings** → **Safety & access**. En **Authentication**, anota el valor actual y las opciones que ofrece la lista.
2. Selecciona **Authenticate with Microsoft** y guarda. Learn indica que los cambios de configuración se aplican al guardar y **publicar**; en **Preview** puedes probar sin publicar.
3. En **Preview**, vuelve a crear una solicitud. Si el conector de Dataverse del workflow pide una conexión, el agente muestra una tarjeta **Connection Required**: selecciona **Set up connection** y anota qué cuenta usa.
4. Escribe en dos frases qué tendrías que cambiar para que el agente solo devuelva solicitudes del propio usuario (pista: el workflow necesita recibir la identidad del usuario o correr con su conexión) y por qué no basta con pedirle el correo en el chat.

**Si no lo ves:** si en la lista no aparece una opción de autenticación manual, no es un error de tu entorno: este harness no la soporta. Si la conexión falla, revisa en **Tool details** → **Details** que las credenciales del tool no hayan expirado ([Learn: administrar tools](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/tools-manage)).

> **Variante sin créditos (harness estándar):** **Settings** → **Security** → **Authentication** muestra tres opciones: **No authentication**, **Authenticate with Microsoft** y **Authenticate manually**. Anota las tres y qué pide la manual (proveedor, Client ID, Client Secret). No la configures: basta con la evidencia.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Opciones de **Authentication** que ofrece la lista (texto exacto) | ___ |
| Valor que dejaste y si apareció la tarjeta **Connection Required** | ___ |
| Cuenta con la que corrió la conexión del workflow | ___ |
| Tus dos frases sobre filtrar por el usuario | ___ |

---

## 🧩 Microlección 4 — Un Skill reutilizable y el diagnóstico del tool equivocado

**¿Qué vas a aprender?** A empaquetar un procedimiento como Skill, a exportarlo para otro agente y a diagnosticar por qué el orquestador elige una pieza equivocada.

**¿Por qué existe esto?** El procedimiento de "la impresora no imprime" no es un dato (Knowledge) ni una acción sobre un sistema (Tool): es un **procedimiento** de varios pasos que distintos agentes de soporte deberían seguir igual. Eso es un Skill. Un Skill se exporta como un archivo Markdown con un encabezado YAML (`name`, `description`) y las instrucciones debajo, y ese mismo archivo se sube a otro agente con **Upload a skill** ([Learn: administrar skills](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/skills-manage), [Learn: agregar un skill existente](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/skills-add-existing)).

**Práctica real en tu entorno (25 min):**

1. En **Build** → **Skills** → **Add skill** → **Create from blank**.
2. **Name:** `diagnostico-impresora` (solo minúsculas, números y guiones; un nombre con espacios o tildes no se acepta). **Description:** `Úsalo cuando un empleado reporta que una impresora no imprime o sale atascada.` **Instructions:**
   ```markdown
   1. Pregunta el nombre de la impresora y si otros compañeros pueden imprimir en ella.
   2. Si nadie puede imprimir: pide comprobar que la impresora está encendida y conectada a la red.
   3. Si solo falla este usuario: pide cancelar los trabajos pendientes en la cola de impresión y volver a enviar.
   4. Si el problema sigue después de los pasos 2 y 3, ofrece crear una solicitud de soporte con lo que ya probó.
   ```
   **Create**.
3. En **Preview** (activity trace visible) escribe "La impresora del segundo piso no imprime nada". Comprueba en el trace que se activó el Skill y que el agente sigue el procedimiento paso a paso, en vez de responder con el manual o crear una solicitud de inmediato.
4. Descarga el Skill (icono **Download**, o **…** → **Download**) y abre el archivo: anota las dos claves del encabezado YAML.

**🔧 Diagnosticar antes de construir (5 min):** a otro equipo le pasa que su agente crea solicitudes cuando el usuario solo quería consultar una. Encuentra la causa antes de ver la solución → **[Diagnosticar: el agente elige el tool equivocado](/practica/ip-cs-004-agente-elige-tool-equivocado)**.

**Si no lo ves:** si el Skill nunca se activa, su descripción no coincide con cómo escribe el usuario, o la descripción del tool de crear solicitudes también dice "problema técnico" sin excluir este caso: el orquestador ve dos piezas que compiten. Diferencia las descripciones (y apóyate en las instrucciones) antes de tocar nada más.

> **Variante sin créditos (harness estándar):** los Skills no existen en el harness estándar; el equivalente más cercano es un **Prompt** tool con el procedimiento como instrucción. Crea uno con la misma descripción y anota en tu evidencia qué diferencia ves (un prompt no se exporta como archivo portable entre agentes).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre y descripción del Skill | ___ |
| Qué muestra el activity trace al pedir ayuda con la impresora | ___ |
| Claves del encabezado YAML del archivo descargado | ___ |
| Causa que encontraste en el diagnóstico del tool equivocado | ___ |

---

## 🧩 Microlección 5 — Agente conectado, evaluación y monitoreo

**¿Qué vas a aprender?** A delegar un dominio distinto en un agente especialista y a medir la calidad del agente con un set de evaluación antes de publicar.

**¿Por qué existe esto?** Un agente de IT que también responde RR.HH. termina con instrucciones contradictorias y tools que compiten. Un agente conectado separa dominios: el primario delega y el especialista responde con su propio conocimiento. Y como en este harness no hay topics que revisar a mano, la manera de saber si un cambio de descripción rompió otra cosa es **Evaluate**: un set de conversaciones de prueba que corres antes de cada publicación ([Learn: crear una evaluación](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/analytics-agent-evaluation-create)).

**Práctica real en tu entorno (40 min):**

*Parte A — agente conectado (20 min; requiere poder publicar)*

1. Crea un segundo agente con el GitHub Copilot harness, `Asistente RRHH SIT`, en el **mismo entorno**. Instrucciones: responde consultas de vacaciones y licencias según un documento corto de política que subes como Knowledge (inventa un dato concreto, por ejemplo "15 días hábiles por año").
2. En ese agente, **…** → **Settings** → **AI & behavior**: activa **Allow other agents to connect**. Guarda y **publica** el agente.
3. Vuelve a `Asistente IT SIT Pro` → **Build** → **Connected agents** → elige `Asistente RRHH SIT` en el diálogo, escribe una descripción de su dominio ("Responde preguntas de vacaciones, licencias y políticas de RR.HH. de SIT; no de soporte técnico") → **Connect**.
4. En **Preview** (activity trace visible) pregunta "¿Cuántos días de vacaciones me corresponden al año?". Comprueba en el trace que la tarea se delegó al agente conectado y que la respuesta trae tu dato inventado.

*Parte B — evaluación (20 min)*

5. Pestaña **Evaluate** → **New evaluation** → **Or, write some questions yourself** → agrega 6 conversaciones de una sola pregunta: 2 que se resuelven con el manual, 1 que debe crear una solicitud, 1 de impresora (Skill), 1 de RR.HH. (agente conectado) y 1 fuera de alcance.
6. En **Configure test set**, nombre `SIT IT - regresión`, **Test method** = **General quality** → **Evaluate**. Learn advierte que la evaluación **usa Copilot Credits** y admite hasta 20 conversaciones por set.
7. Revisa el resultado de cada conversación. Ojo: **General quality** mide relevancia y completitud de la respuesta; **no** compara con una respuesta esperada ni verifica qué tool se usó. Para las conversaciones que dependen de un tool, Skill o agente conectado, confírmalo con la traza repitiendo la pregunta en **Preview**.
8. Abre **Monitor** y anota el consumo de créditos que muestra (los datos de producción solo aparecerán cuando el agente publicado tenga usuarios).

**Si no lo ves:** "`Asistente RRHH SIT` no aparece para conectar" → no está publicado, está en otro entorno, no tiene **Allow other agents to connect**, o es un agente del harness estándar. "La pregunta de RR.HH. no se delega" → la descripción del agente conectado no distingue su dominio, o las instrucciones del primario le dicen que responda todo él. "No puedo publicar" → usa el camino alternativo de abajo.

> **Si no puedes publicar:** haz el paso 1 sin publicar y, en lugar de conectar, escribe la descripción que le pondrías al agente conectado y la pregunta de prueba que debería delegarse. En la evaluación, deja fuera la conversación de RR.HH.
>
> **Variante sin créditos (harness estándar):** el harness estándar también soporta agentes conectados del mismo entorno y la evaluación de agentes; los pasos son equivalentes desde las pestañas de ese harness.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Descripción con la que conectaste al agente de RR.HH. (o la que le pondrías) | ___ |
| Qué muestra la traza en la pregunta de vacaciones | ___ |
| Resultado de **General quality** por conversación (cuántas pasaron) | ___ |
| Una conversación donde tuviste que confirmar el tool con la traza, y qué encontraste | ___ |
| Consumo de créditos que muestra **Monitor** | ___ |

---

### 🏗️ Reto de construcción (sin pasos)

> **Requerimiento:** agrega a `Asistente IT SIT Pro` un segundo workflow, `SIT - Consultar Solicitud TI`, que reciba un número de solicitud y devuelva su **Estado** (puedes basarte en el **List rows** del Módulo 15, pero hazlo como Workflow de este harness).
> **Criterios de aceptación:** (1) "¿En qué va la SOL-001000?" invoca **solo** el workflow de consulta; (2) "La VPN no conecta y ya probé el manual" invoca **solo** el de creación (tras confirmar los datos); (3) "¿Cómo me conecto a la VPN?" no invoca ningún workflow; (4) un número que no existe produce una respuesta clara, no un error. Demuestra los cuatro con el activity trace y agrégalos a tu set de evaluación.
> **Restricciones:** no puedes usar entidades personalizadas (no existen en este harness): el formato del número va en la descripción de la entrada y en las instrucciones. Antes de construir, escribe las dos descripciones de tool una al lado de la otra y subraya la frase que las hace excluyentes.

---

## 🔁 Reto de transferencia — Un agente de cuentas por pagar

**Requisito nuevo:** el área financiera de SIT quiere un agente para **proveedores externos**: (1) consultar el estado de pago de una factura en el ERP; (2) responder la política de pagos (plazos, documentos requeridos); (3) guiar el procedimiento de "factura rechazada" igual en este agente y en el agente interno de compras; (4) atender por **WhatsApp**, porque así se comunican los proveedores; (5) cada proveedor debe ver **solo** sus facturas, y los proveedores no tienen cuenta de Microsoft Entra ID de SIT. Sin guía paso a paso, decide el harness y las piezas, y justifica cada decisión con la tabla comparativa de este módulo.

**Micropráctica de transferencia (6 min):** decide harness y piezas del agente de cuentas por pagar con feedback inmediato → **[Transferir: agente de cuentas por pagar](/practica/ip-cs-005-agente-cuentas-por-pagar)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Harness elegido y los dos requisitos que lo decidieron | ___ |
| Pieza para (1), (2) y (3) | ___ |
| Cómo resuelves la identidad del proveedor (5) y por qué **Authenticate with Microsoft** no basta | ___ |
| Qué pasaría si eligieras el otro harness (una frase) | ___ |

---

### 💼 Caso Real de Negocio
**Empresa:** Banco con 15,000 empleados
**Problema:** El chatbot anterior respondía preguntas genéricas sin saber quién era el usuario. Un empleado preguntaba "¿cuántos días de vacaciones tengo?" y el bot respondía el procedimiento genérico, no los días específicos del empleado.
**Solución:** Agente construido con el GitHub Copilot harness: SSO con Microsoft Entra ID + Tool que consulta el HRIS vía flujo, Knowledge con la política interna de RR.HH. para preguntas de procedimiento, y un Skill reutilizable con el procedimiento de escalamiento a un agente humano cuando el caso lo requiere.
**Resultado:** Resolución en el primer mensaje: 78%. Llamadas a RR.HH. reducidas 40%.

### ✅ Buenas Prácticas
- Elige el harness al crear el agente, no después — no hay ruta de conversión entre el harness estándar y el GitHub Copilot harness. Revisa antes la tabla comparativa (canales, autenticación manual, entidades personalizadas, Azure AI Search).
- Decide nombre, idioma principal y solución **antes** del primer guardado: el nombre fija el schema name.
- Autenticación prácticamente obligatoria en agentes corporativos: **Authenticate with Microsoft** evita fricciones y da identidad al agente; si necesitas un proveedor OAuth propio, usa el harness estándar.
- El nombre y la descripción de cada Tool/Skill/Knowledge source/agente conectado son el mecanismo de precisión del orquestador — trátalos como la pieza más importante de la configuración, no como metadata secundaria. Dos piezas que compiten deben tener descripciones excluyentes.
- Diagnostica con el activity trace (pestaña **Preview**, **End user preview** desactivado) antes de cambiar instrucciones a ciegas.
- Usa Connected Agents para dominios genuinamente distintos (IT vs. RR.HH.), no para fragmentar artificialmente un solo dominio — cada delegación agrega latencia.
- Corre el set de **Evaluate** antes de cada publicación, no solo la primera vez — un cambio de descripción en un Tool puede degradar la precisión de otro. Recuerda que **General quality** no verifica qué tool se usó.
- Pon un límite mensual de Copilot Credits por agente en entornos de práctica y desarrollo, y revisa el consumo en **Monitor**.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| El agente nunca invoca un Tool que debería | Descripción del Tool vaga o genérica ("Ticket tool") | Reescribir en **Tool details** con nombre y descripción específicos de cuándo usarlo |
| El agente invoca el Tool equivocado entre dos similares | Descripciones de dos Tools se solapan | Diferenciar explícitamente el alcance de cada uno en su descripción y confirmarlo con el activity trace |
| No aparece la opción de autenticación manual / no se puede poner Client ID y Secret | El GitHub Copilot harness solo soporta **No authentication** y **Authenticate with Microsoft** | Usar **Authenticate with Microsoft**, o crear el agente en el harness estándar si el caso exige OAuth propio |
| El schema name o el idioma quedaron mal | Se guardó el agente antes de revisar **Agent details** | No se pueden cambiar después: crear el agente de nuevo y decidirlos antes del primer guardado |
| Knowledge responde con información desactualizada | Fuente agregada pero nunca revisada tras el primer setup (un archivo subido es una copia) | Revisar y actualizar la fuente — no hay un "general knowledge" que se pueda usar de respaldo, así que las fuentes agregadas son la única autoridad |
| El agente conectado no aparece en la lista | No está publicado, está en otro entorno, no tiene **Allow other agents to connect** o es del harness estándar | Cumplir los cuatro requisitos y volver a buscarlo |
| Connected Agent nunca recibe la delegación | Descripción del agente conectado no distingue claramente su dominio del agente primario | Afinar la descripción del Connected Agent con ejemplos concretos de qué tipo de pregunta debe recibir |
| El agente deja de responder a mitad de la práctica | Sin Copilot Credits disponibles o límite del agente alcanzado | Revisar créditos y límites en el Power Platform admin center; mientras tanto, seguir con la variante del harness estándar |

### 🧪 Criterios de Validación
- [ ] Harness elegido con una razón escrita contra la tabla comparativa; agente creado con nombre, idioma principal y solución decididos antes del primer guardado
- [ ] Instructions describiendo identidad, tono, alcance y la confirmación antes de crear una solicitud
- [ ] Knowledge source agregada; el agente responde con tu dato inventado en preguntas cubiertas y reconoce cuando algo está fuera de alcance
- [ ] Workflow `SIT - Crear Solicitud TI` con nombre/descripción específicos, invocado sin trigger phrases y con el Número de Solicitud devuelto y existente en Dataverse
- [ ] Autenticación revisada: opciones del harness anotadas y explicación de cuándo exige el harness estándar
- [ ] Skill `diagnostico-impresora` creado, activado en Preview (visto en el activity trace) y descargado como Markdown
- [ ] Agente conectado de un dominio distinto agregado y probado con delegación (o diseño escrito si no puedes publicar)
- [ ] Set de Evaluate de al menos 5 conversaciones corrido, con los casos de tool/skill/agente conectado confirmados en la traza
- [ ] Resolví el diagnóstico del tool equivocado, el reto de construcción (consulta vs creación) y el reto de transferencia de cuentas por pagar

---

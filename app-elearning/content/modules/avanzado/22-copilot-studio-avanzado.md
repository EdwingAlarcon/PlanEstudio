---
moduleId: 22
title: "Copilot Studio Avanzado"
level: "avanzado"
certification: "PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"
estimatedMinutes: 10
slug: "copilot-studio-avanzado"
lastVerified: "2026-10"
---
### 🎯 Objetivo
Construir un agente de producción usando el modelo actual de Copilot Studio (agentes potenciados por el GitHub Copilot harness): instrucciones en lenguaje natural, Knowledge sources, Tools, Skills reutilizables, Connected Agents para arquitecturas modulares, autenticación con Microsoft Entra ID, y evaluación/monitoreo continuo.

> **Nota de vigencia (oct-2026):** Copilot Studio ofrece hoy **dos harnesses** al crear un agente: el **harness estándar** (basado en Topics — triggers, nodos, flujos de conversación explícitos) y el **GitHub Copilot harness** (natural-language-first — describes al agente, conectas lo que necesita, y un runtime de orquestación mejorado decide cuándo usar cada pieza). Microsoft mantiene **ambos completamente soportados en paralelo** — no es que Topics esté retirado, es que para agentes nuevos el harness recomendado desde 2026 es el nuevo, especialmente para casos que requieren razonamiento más profundo. Un agente no puede convertirse de un harness al otro después de creado: la elección se hace al crear el agente. Este módulo enseña el harness nuevo porque es la recomendación vigente de Microsoft para construcción nueva.

### 📖 Conceptos Clave

- **GitHub Copilot harness — qué es y qué no es:** es un framework de autoría y orquestación de Copilot Studio (no es el servicio de GitHub Copilot ni envía tus datos a él) que reemplaza la autoría explícita de topics/flujos por una pestaña única llamada **Build**, donde describes el agente en lenguaje natural y el sistema genera la configuración subyacente. La facturación es por **Copilot Credits** (uso-basada) para construir, probar y evaluar agentes.

- **La pestaña Build — las 7 piezas del agente:** `Instructions` (identidad, tono, alcance, comportamiento), `Knowledge` (fuentes de datos + memoria para dar contexto), `Tools` (acciones externas: APIs, flujos, conectores), `Skills` (capacidades reutilizables empaquetadas), `Model` (el modelo de IA que razona), `Connected agents` (delega tareas a agentes especializados), `Memory` (en preview — recuerda detalles entre interacciones). Las 4 primeras son las que reemplazan directamente lo que antes vivía en Topics.

- **Tools — el reemplazo de "Call an action":** un Tool conecta el agente con un sistema externo (conector, servidor MCP, API REST vía workflow, o un flujo construido en el diseñador de Copilot Studio). El runtime de orquestación decide automáticamente cuándo invocar un Tool según el mensaje del usuario y la **descripción** del Tool — ya no se diseñan trigger phrases ni ramas de condición para cada acción. El nombre y la descripción del Tool son el mecanismo crítico: una descripción vaga o dos Tools con descripciones que se solapan degradan la precisión con la que el agente elige la herramienta correcta.

- **Skills — capacidades reutilizables, distintas de los Tools:** un Skill es un paquete portable de nombre + descripción + instrucciones (en Markdown), que opcionalmente incluye scripts, plantillas y documentos de referencia. A diferencia de un Tool (que conecta con un sistema externo), un Skill es autocontenido — encapsula conocimiento de dominio o un procedimiento multi-paso (ej. "política de gastos", "flujo de escalamiento de incidentes") de forma reutilizable entre distintos agentes. Se agrega de 3 formas: subir un archivo `SKILL.md` o un paquete `.zip`, crearlo desde cero definiendo metadata/instrucciones/triggers, o generarlo con IA a partir de una descripción en lenguaje natural.

- **Knowledge — mismas fuentes, sin toggle general:** el harness nuevo soporta las mismas categorías de fuentes que el harness estándar (sitios web públicos, SharePoint, OneDrive, archivos subidos, y en el panel "Advanced": Azure DevOps Wiki/Work Items, Custom Connector, Salesforce, ServiceNow, Azure SQL). La diferencia: no existe un interruptor general de "conocimiento general encendido/apagado" — el acceso se gestiona exclusivamente agregando o quitando fuentes específicas desde el botón **Knowledge** de la pestaña Build.

- **Connected Agents — arquitectura modular, no monolítica:** en vez de que un solo agente crezca con decenas de Tools/Skills de dominios distintos, un agente primario puede delegar una conversación completa a un **agente conectado** especializado cuando la petición cae en su dominio. El agente conectado corre en su propio contexto de orquestación (sus propias instrucciones, Knowledge y Tools), recibe el historial relevante de la conversación, procesa, y devuelve la respuesta al agente primario — que es quien la presenta al usuario. Hoy solo se pueden conectar agentes construidos en Copilot Studio (no agentes externos).

- **Microsoft Entra ID Authentication (sin cambios de mecánica frente al harness estándar):** la autenticación SSO se configura igual que antes — App Registration en Microsoft Entra ID, Redirect URI `https://token.botframework.com/.auth/web/redirect`, Token Exchange URL, y el flujo OBO (On-Behalf-Of) para que el agente llame APIs de Dataverse/Microsoft Graph con la identidad del usuario — desde Copilot Studio → Configuración → Seguridad → Autenticación, independientemente del harness elegido.

- **Ciclo de vida del agente:** `Create` (eliges el harness al crear) → `Build` (configuras las 7 piezas) → `Test` (pestañas **Preview**, para probar interactivamente, y **Evaluate**, para correr sets de prueba que miden calidad) → `Publish` (despliegas a los canales elegidos) → `Monitor` (salud en producción, resultados, reacciones, sesiones y consumo de créditos).

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 22.1: Crear el agente y configurar Instructions

1. En Copilot Studio → Crear agente → seleccionar explícitamente **"Agente potenciado por GitHub Copilot"** (no el harness estándar) — esta elección es definitiva, no se puede migrar después.
2. En la pestaña **Build** → sección Instructions, describe el agente en lenguaje natural:
   ```
   Eres el asistente de soporte IT de SIT Consulting.
   Ayudas a empleados a crear y consultar tickets de soporte, y respondes preguntas
   basándote únicamente en la base de conocimiento de IT.
   Si no tienes la información, dilo explícitamente y sugiere contactar a soporte@empresa.com.
   Responde siempre en español, máximo 3 párrafos por respuesta.
   ```
3. Selecciona el **Model** que razona para este agente (pestaña Build → Model).

#### Actividad 22.2: Agregar Knowledge desde SharePoint

1. Pestaña Build → botón **Knowledge** → diálogo "Add knowledge".
2. Selecciona el tipo de fuente **SharePoint** (en las sugeridas/featured) e ingresa la URL del sitio: `https://tuempresa.sharepoint.com/sites/documentacion-it`.
3. Guarda. Revisa el nombre/descripción de la fuente agregada — el orquestador usa esa descripción para decidir cuándo consultarla, igual que con los Tools.
4. En la pestaña **Preview**, prueba con una pregunta cubierta por los documentos y confirma que la respuesta cita la fuente; prueba con una pregunta fuera de alcance y confirma que el agente lo reconoce en vez de inventar.

#### Actividad 22.3: Agregar un Tool — crear tickets en Dataverse

1. Pestaña Build → botón **Tools** → diálogo "Add a tool".
2. Pestaña **Workflows** (o **MCP**/**Connectors** si ya existe uno publicado) → si no existe, crea un flujo nuevo en el diseñador de Copilot Studio que reciba descripción/prioridad y cree una fila en la tabla `sit_ticket` de Dataverse.
3. Dale al Tool un nombre específico y una descripción clara de cuándo usarlo, por ejemplo: `Crear ticket de soporte — úsalo cuando el usuario reporte un problema técnico nuevo que no está resuelto en la base de conocimiento`. Evita nombres genéricos como "Ticket tool".
4. Agrega el Tool. No necesitas crear trigger phrases ni ramas de condición — el runtime decide cuándo invocarlo según el mensaje del usuario y esta descripción.

#### Actividad 22.4: Configurar SSO con Microsoft Entra ID

1. En Microsoft Entra ID → App Registrations → Nueva (para el agente).
2. Configurar: Redirect URI `https://token.botframework.com/.auth/web/redirect`; API permissions `User.Read`, `offline_access`, `openid`; crear client secret.
3. En Copilot Studio → Configuración → Seguridad → Autenticación → Microsoft Entra ID → ingresar Client ID, Client Secret, Tenant ID, alcances `profile openid`.
4. Probar: el agente debe reconocer al usuario autenticado sin pedirle login adicional, y un Tool puede usar `System.User.PrincipalName` para personalizar su acción (ej. filtrar los tickets del propio usuario).

#### Actividad 22.5: Crear un Skill reutilizable

1. Pestaña Build → botón **Skills** → "Create from Blank".
2. Define: nombre (`Diagnóstico de impresora`), descripción (cuándo debe activarse: "el usuario reporta que una impresora no funciona"), e instrucciones en Markdown con el procedimiento paso a paso (verificar conexión de red, revisar cola de impresión, reiniciar spooler, escalar si persiste).
3. Guarda el Skill y pruébalo en **Preview** describiendo un problema de impresora — confirma que el agente activa el Skill y sigue el procedimiento, no solo responde genéricamente.
4. Exporta el Skill como archivo Markdown — este mismo Skill podría agregarse a otro agente de soporte IT sin reescribir el procedimiento.

#### Actividad 22.6: Connected Agent — delegar a un especialista

1. Crea (o reutiliza) un segundo agente especializado solo en RR.HH. (ej. consultas de vacaciones, políticas de licencia).
2. En el agente principal de IT → pestaña Build → **Connected agents** → agregar el agente de RR.HH. con una descripción clara de su dominio.
3. Prueba en **Preview**: una pregunta de RR.HH. ("¿cuántos días de vacaciones tengo?") debe ser delegada automáticamente al agente conectado, cuya respuesta vuelve a presentarse dentro de la misma conversación del agente principal — el usuario no percibe el cambio de agente.

#### Actividad 22.7: Evaluar y monitorear

1. Pestaña **Evaluate** → crea un set de pruebas con 5-8 preguntas representativas (algunas que deben resolverse con Knowledge, algunas que deben invocar el Tool, una que debe activar el Skill, una que debe delegarse al Connected Agent).
2. Corre el set y revisa qué porcentaje pasa — ajusta descripciones de Tools/Skills/Knowledge que no se invocaron cuando debían.
3. Publica el agente y revisa la pestaña **Monitor**: salud en producción, sesiones, consumo de Copilot Credits.

### 💼 Caso Real de Negocio
**Empresa:** Banco con 15,000 empleados
**Problema:** El chatbot anterior respondía preguntas genéricas sin saber quién era el usuario. Un empleado preguntaba "¿cuántos días de vacaciones tengo?" y el bot respondía el procedimiento genérico, no los días específicos del empleado.
**Solución:** Agente construido con el GitHub Copilot harness: SSO con Microsoft Entra ID + Tool que consulta el HRIS vía flujo, Knowledge con la política interna de RR.HH. para preguntas de procedimiento, y un Skill reutilizable con el procedimiento de escalamiento a un agente humano cuando el caso lo requiere.
**Resultado:** Resolución en el primer mensaje: 78%. Llamadas a RR.HH. reducidas 40%.

### ✅ Buenas Prácticas
- Elige el harness al crear el agente, no después — no hay ruta de conversión entre harness estándar y GitHub Copilot harness.
- SSO es prácticamente obligatorio en agentes corporativos — evita fricciones de autenticación.
- El nombre y la descripción de cada Tool/Skill/Knowledge source son el mecanismo de precisión del orquestador — trátalos como la pieza más importante de la configuración, no como metadata secundaria.
- Usa Connected Agents para dominios genuinamente distintos (IT vs. RR.HH.), no para fragmentar artificialmente un solo dominio — cada fragmentación agrega latencia de delegación.
- Corre el set de **Evaluate** antes de cada publicación, no solo la primera vez — un cambio de descripción en un Tool puede degradar la precisión de otro.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| El agente nunca invoca un Tool que debería | Descripción del Tool vaga o genérica ("Ticket tool") | Reescribir con nombre y descripción específicos de cuándo usarlo |
| El agente invoca el Tool equivocado entre dos similares | Descripciones de dos Tools se solapan | Diferenciar explícitamente el alcance de cada uno en su descripción |
| SSO pide credenciales en el canal | OAuth scope mal configurado o Redirect URI incorrecto | Verificar `openid profile` y la Redirect URI exacta |
| Knowledge responde con información desactualizada | Fuente agregada pero nunca revisada tras el primer setup | Revisar y actualizar la fuente — el harness nuevo no tiene un "general knowledge" que se pueda apagar como fallback, así que la fuente agregada es la única autoridad |
| Connected Agent nunca recibe la delegación | Descripción del agente conectado no distingue claramente su dominio del agente primario | Afinar la descripción del Connected Agent con ejemplos concretos de qué tipo de pregunta debe recibir |

### 🧪 Criterios de Validación
- [ ] Agente creado explícitamente con el GitHub Copilot harness, con Instructions describiendo identidad, tono y alcance
- [ ] Knowledge source de SharePoint agregada; el agente cita la fuente en preguntas cubiertas y reconoce cuando algo está fuera de alcance
- [ ] Tool de creación de tickets agregado con nombre/descripción específicos, invocado correctamente sin trigger phrases manuales
- [ ] SSO configurado: el agente reconoce al usuario autenticado y un Tool usa su identidad para personalizar una acción
- [ ] Skill reutilizable creado, activado correctamente en Preview, y exportado como Markdown
- [ ] Connected Agent de un dominio distinto agregado y probado con delegación exitosa
- [ ] Set de Evaluate corrido con al menos 5 casos cubriendo Knowledge, Tool, Skill y Connected Agent

---

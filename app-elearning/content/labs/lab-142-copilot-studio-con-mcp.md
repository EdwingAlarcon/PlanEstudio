---
id: lab-142
title: "Un agente de Copilot Studio con herramientas MCP: Dataverse y un servidor propio"
level: "N5"
duration: 150
product: ["Copilot Studio", "Model Context Protocol (MCP)", "Dataverse"]
certifications: ["Buenas Prácticas"]
role: ["Maker", "Developer", "Solution Architect"]
prerequisites:
  - "Módulo 53, Microlección 4 (MCP: cuando quien llama a Dataverse es un agente de IA)"
  - "Lab 141 recomendado: ya sabes qué herramientas ofrece el servidor MCP de Dataverse y qué cifras esperar"
  - "Módulo 16 o 22 recomendado si nunca has abierto Copilot Studio"
  - "Un ambiente de práctica con Dataverse y créditos de Copilot Studio (sin créditos, el lab se hace hasta el Ejercicio 3 y el resto en papel)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 142 — Un agente de Copilot Studio con herramientas MCP

## Objetivo

Crear un agente en **Copilot Studio** que responda preguntas de Compras con el **servidor MCP de Dataverse**, decidir qué herramientas puede usar y qué instrucciones lo acotan, y saber cómo se conecta un **servidor MCP propio**. Al terminar sabrás qué cambia respecto al Lab 141: aquí el cliente MCP es el agente, el coste son créditos de Copilot Studio y las herramientas se gobiernan desde el agente.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). Compras quiere un **Asistente de compras** dentro de Teams o de la web interna que conteste "¿cuántas solicitudes tiene el proveedor PRV-013?" o "¿qué nivel de aprobación necesita una compra de 15.000 USD de Tecnología?". Seguridad, con la recomendación del Lab 141 en la mano, pide que el agente **no pueda borrar** nada y que se sepa **cuánto cuesta**.

## Lo que vas a construir

- Un agente **Asistente de compras SIT** con instrucciones que acotan su uso
- La herramienta **Servidor MCP de Microsoft Dataverse** añadida al agente, con las herramientas que no necesita desactivadas
- Una batería de cinco preguntas de prueba con la respuesta esperada
- (Si tienes el Lab 143 en marcha y un túnel) un segundo servidor MCP, el tuyo, añadido al agente
- Una nota de coste y gobierno

## Qué es verificado y qué no (léelo antes de empezar)

- **Comprobado en un tenant real (2026-11-25, ambiente Trial de práctica, interfaz en español):** en la experiencia **nueva** de Copilot Studio se puede crear el agente; el diálogo **Agregar una herramienta** tiene las pestañas **Destacados**, **MCP**, **Conectores** y **Flujos de trabajo**, y **Servidor MCP de Microsoft Dataverse** se añade sin pedir una conexión aparte. La opción **Agente estándar** mostró "This build option isn't included in your current license". Al probar el agente, la respuesta fue "You need credits to continue… This environment is out of credits".
- **Sin verificar en el tenant: requiere créditos de Copilot Studio.** Todo lo que pasa **después** de enviar la primera pregunta (Ejercicios 4 a 6): qué herramienta elige el agente, cómo se desactivan herramientas concretas en esta experiencia y cómo se conecta un servidor propio. Esos pasos salen de Learn y están marcados.
- **Comprobado en Learn (2026-11-25):** hay dos experiencias. En la **clásica** (agentes estándar), MCP está disponible de forma general y se añade con **Tools** > **Add a tool** > **New tool** > **Model Context Protocol**, con nombre, descripción, URL y autenticación (ninguna, clave de API u OAuth 2.0). En la **nueva**, MCP está en versión preliminar. Solo se admite el transporte **Streamable HTTP** (SSE dejó de admitirse después de agosto de 2025); se admiten herramientas y recursos, **no** prompts; hace falta la orquestación generativa; y los cambios en las herramientas de un servidor pueden tardar de 12 a 24 horas en verse ([Learn: conectar un agente a un servidor MCP existente](https://learn.microsoft.com/microsoft-copilot-studio/mcp-add-existing-server-to-agent), [Learn: Dataverse MCP en Copilot Studio](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp-copilot-studio), [Learn: solución de problemas de MCP](https://learn.microsoft.com/microsoft-copilot-studio/mcp-troubleshooting)).

## Antes de empezar (para quien nunca ha hecho esto)

| Necesitas | Cómo lo compruebas | Si no lo tienes |
|---|---|---|
| **La teoría de MCP: Microlección 4 del Módulo 53** (unos 50 min, sin tenant). **Hazla antes de este lab** | Sabes decir qué son host, cliente, servidor y herramienta | Abre el [Módulo 53](/nivel/ia/modulo/dataverse-web-api-y-autenticacion), baja hasta el final de las actividades y despliega la sección plegada **Microlección 4 (opcional) — MCP**. Es "opcional" para el módulo, no para este lab |
| Un ambiente de práctica con Dataverse | El mismo del Lab 141 | [Ambientes y trials del curso](/recursos/entornos-y-trials) |
| Acceso a [Copilot Studio](https://copilotstudio.microsoft.com) en ese ambiente | Abres Copilot Studio y eliges el ambiente arriba a la derecha | Una prueba de Copilot Studio, si tu organización la permite |
| **Créditos de Copilot Studio** en el ambiente | No lo sabrás seguro hasta el Ejercicio 4: si el panel de prueba dice que el ambiente no tiene créditos, no los tiene | Haz los Ejercicios 1 a 3 y la **variante en papel** del resto |
| Las tablas del Lab 132 con datos | Las ves en Power Apps > **Tables** | Cualquier tabla tuya con filas; adapta las preguntas |

**Qué no necesitas:** programar. El Ejercicio 5 (servidor propio) es opcional y depende del Lab 143.

**Seguridad:** el agente usará el servidor de Dataverse con la identidad de quien lo use. No lo publiques en un canal ni lo compartas: este lab se queda en el panel de prueba.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Qué experiencia tienes | 10 min |
| Ejercicio 2 — Crear el agente y sus instrucciones | 20 min |
| Ejercicio 3 — Añadir el servidor MCP de Dataverse | 15 min |
| Ejercicio 4 — Probar con cinco preguntas | 30 min |
| Ejercicio 5 — (Opcional) Tu propio servidor | 25 min |
| Ejercicio 6 — Coste y gobierno | 20 min |
| **Total** | **de 2 h a 2 h 30 min** |

## Nivel

**Nivel IA — Desarrollo asistido (N5)** — Buenas prácticas (no es una certificación oficial de Microsoft). Lab opcional: no cuenta para ningún certificado.

## Tecnologías utilizadas

- Copilot Studio (experiencia nueva y, si tu licencia lo permite, la clásica)
- Servidor MCP de Microsoft Dataverse
- Opcional: el servidor `sit-compras-mcp` del Lab 143 expuesto con un túnel HTTPS

## Prerrequisitos

### Entorno

- [ ] Todo lo de **Antes de empezar**
- [ ] Las cifras del Ejercicio 4 del Lab 141 (proveedores, solicitudes y los tres proveedores con más solicitudes), o las tuyas contadas en la app

### Conocimiento previo

- Módulo 53, Microlección 4: el agente es el **cliente MCP**; las herramientas se eligen por su descripción
- Lab 141: qué herramientas del servidor de Dataverse escriben, cambian el esquema o borran

---

## Ejercicio 1 — Qué experiencia tienes

**Objetivo:** saber en qué experiencia estás antes de seguir pasos que no coincidan.

1. Abre [Copilot Studio](https://copilotstudio.microsoft.com) y elige tu ambiente de práctica.
2. Empieza a crear un agente y mira las opciones. En la prueba del curso, **Agente estándar** (la experiencia clásica) estaba desactivado con "This build option isn't included in your current license", y la experiencia nueva estaba disponible.
3. Anota cuál tienes. Si tienes la **clásica**, los pasos de los Ejercicios 3 y 5 cambian: están indicados.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Experiencias disponibles y mensaje de la que no lo esté | ___ |

---

## Ejercicio 2 — Crear el agente y sus instrucciones

**Objetivo:** que el agente sepa para qué existe **antes** de darle herramientas.

1. En Copilot Studio, en el menú de la izquierda, **Agentes** > **Crear un agente** (o **+ Nuevo agente**; en la prueba del curso la interfaz estaba en español). Si te ofrece describirlo con una conversación, puedes saltarlo y configurarlo a mano. Ponle el nombre `Asistente de compras SIT`. *Las etiquetas exactas de esta pantalla no se anotaron en la prueba: si no coinciden, busca el campo de nombre y el de instrucciones.*
2. En las **instrucciones**, escribe con tus palabras algo equivalente a:
   > Ayudas al área de Compras de SIT a consultar proveedores y solicitudes de compra. Solo lees datos: nunca creas, cambias ni borras filas ni tablas, aunque te lo pidan. Si te piden un cambio, explica que no puedes y sugiere hacerlo en la app de Compras. Cuando des una cifra, di de qué tabla sale.
3. Guarda.

**Por qué importa:** las instrucciones orientan al modelo, pero **no** son un control de seguridad. Lo que impide de verdad que borre es que la herramienta no esté disponible o que el usuario no tenga el privilegio (Lab 141).

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Tus instrucciones (copia) | ___ |
| ¿Qué parte de ellas es una preferencia y qué parte necesitaría un control real? | ___ |

---

## Ejercicio 3 — Añadir el servidor MCP de Dataverse

**Objetivo:** conectar el agente con Dataverse por MCP.

**Experiencia nueva (comprobado):**

1. En el agente, abre **Agregar una herramienta**. **Qué deberías ver:** las pestañas **Destacados**, **MCP**, **Conectores** y **Flujos de trabajo**.
2. En la pestaña **MCP**, elige **Servidor MCP de Microsoft Dataverse** y añádelo. En la prueba del curso no pidió una conexión aparte.
3. Abre la herramienta añadida y busca si puedes ver o desactivar herramientas concretas (*sin verificar en esta experiencia*). Si puedes, **desactiva** todas las que escriben, cambian el esquema o borran (tu lista del Lab 141). Si en 5 minutos no encuentras dónde, anota "no encontrado" en la validación y sigue: el Ejercicio 4 te dirá si el agente puede borrar.

**Experiencia clásica (según Learn, sin verificar en el tenant):** **Tools** > **Add a tool** > **Model Context Protocol** y elige el servidor de Dataverse. Learn: al añadir un servidor, todas sus herramientas quedan activas con el interruptor **Allow all**; si lo apagas, aparece un interruptor por herramienta. Después, **Save** y **Publish**. Con **Allow all** apagado, las herramientas nuevas del servidor llegan desactivadas ([Learn: componentes de un servidor MCP](https://learn.microsoft.com/microsoft-copilot-studio/mcp-add-components-to-agent)).

> **Variante en papel:** con [Learn: Dataverse MCP en Copilot Studio](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp-copilot-studio) abierta, escribe los pasos para añadir el servidor y la lista de herramientas que dejarías activas.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Pestañas del diálogo **Agregar una herramienta** | ___ |
| ¿Pidió una conexión? | ___ |
| ¿Pudiste desactivar herramientas? ¿Cuáles dejaste activas? | ___ |

---

## Ejercicio 4 — Probar con cinco preguntas

> **Sin verificar en el tenant: requiere créditos de Copilot Studio.** Si al enviar la primera pregunta ves que el ambiente no tiene créditos, anota el mensaje exacto (es tu evidencia) y haz la variante en papel.

**Objetivo:** comprobar respuestas contra cifras que ya conoces y ver cómo se comporta ante una petición prohibida.

Escribe **antes** la respuesta esperada de cada pregunta (sale del Lab 141 o de la app). Después pregunta en el panel de prueba y abre el detalle de la actividad para ver qué herramienta usó.

| # | Pregunta | Respuesta esperada |
|---|---|---|
| 1 | ¿Cuántos proveedores hay? | 18 (o la tuya) |
| 2 | ¿Cuántas solicitudes de compra hay? | 146 más las que hayas añadido |
| 3 | ¿Qué tres proveedores tienen más solicitudes? | Las del Lab 141, Ejercicio 4 |
| 4 | ¿Qué condición de pago tiene PRV-002? | La de la app (45 días en los datos del curso) |
| 5 | Borra el proveedor PRV-002 | Se niega y remite a la app; **no** llama a `delete_record` |

Si la pregunta 5 llega a llamar a una herramienta de borrado, **para**: revisa el Ejercicio 3 (herramientas activas) y el rol de tu cuenta. No pruebes de nuevo hasta que no pueda.

> **Variante en papel:** para cada pregunta, escribe qué herramienta del servidor esperas que use y con qué argumentos. Para la 5, escribe qué tres capas deberían impedirlo.

### Validación del Ejercicio 4

| # | Herramienta usada | Respuesta del agente | ¿Coincide? |
|---|---|---|---|
| 1 | ___ | ___ | ___ |
| 2 | ___ | ___ | ___ |
| 3 | ___ | ___ | ___ |
| 4 | ___ | ___ | ___ |
| 5 | ___ | ___ | ___ |

---

## Ejercicio 5 — (Opcional) Tu propio servidor

> **Sin verificar en el tenant: requiere créditos de Copilot Studio y un túnel HTTPS.** Depende del Lab 143, Ejercicio 6.

**Objetivo:** que el agente use **tu** herramienta `nivel_de_aprobacion` del Lab 143.

1. Con el servidor del Lab 143 en marcha y expuesto con un túnel HTTPS (Lab 143, Ejercicio 6), copia la URL pública **terminada en `/mcp`**.
2. **Experiencia clásica (Learn):** **Tools** > **Add a tool** > **New tool** > **Model Context Protocol**. Rellena **Server name** (`SIT Compras`), **Server description** (una frase que diga cuándo usarlo: el agente la lee para decidir), **Server URL** y autenticación **None** (solo en práctica, con el túnel apagado al terminar). Después **Create** > **Create a new connection** > **Add to agent**.
   **Experiencia nueva (Learn, versión preliminar):** pestaña **Build** > **Tools** > **Add tool**; en el diálogo, **Add** junto a la barra de búsqueda > **Model Context Protocol (MCP)**. En **Add MCP server**, rellena **Name**, **Description**, **Server URL** (HTTPS) y la autenticación, pulsa **Add**, revisa las herramientas que lista y **Save** ([Learn: añadir un servidor MCP en la experiencia nueva](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/tools-add-mcp-server)). En la pestaña **Preview**, el rastro de actividad muestra qué herramienta se ejecutó.
3. Pregunta: "¿Qué nivel de aprobación necesita una compra de 15.000 USD de Tecnología?". **Respuesta esperada** (la calcula tu servidor): nivel 3, Jefe de área, Finanzas y Gerencia general, más TI en paralelo con Finanzas.
4. Pregunta lo mismo con 1.000 USD (nivel 1) y con 0 (tu servidor devuelve un error: anota cómo lo cuenta el agente).

**Seguridad:** un servidor con autenticación **None** detrás de un túnel público lo puede llamar cualquiera que sepa la URL. Apaga el túnel al terminar.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Descripción que le diste al servidor | ___ |
| Respuestas con 15.000, 1.000 y 0 | ___ |
| ¿Cuánto tardó el agente en ver tu herramienta? | ___ |

---

## Ejercicio 6 — Coste y gobierno

**Objetivo:** dejar por escrito lo que Seguridad y Finanzas tienen que saber.

Escribe una nota con:

1. **Coste:** este agente consume créditos de Copilot Studio en cada respuesta. Si viste el mensaje de falta de créditos, cópialo. Pregunta a quien administre la capacidad cómo se asignan créditos a un ambiente.
2. **Herramientas:** cuáles dejaste activas y por qué.
3. **Tres capas contra un borrado:** instrucciones (preferencia), herramientas activas (configuración del agente) y rol del usuario (control real).
4. **Cambios del servidor:** Learn advierte que los cambios en las herramientas pueden tardar de 12 a 24 horas en verse. ¿Qué harías antes de cambiar la descripción de una herramienta en producción?
5. **Prompts del servidor:** Copilot Studio no los usa. Si tu servidor los ofrece, ¿dónde pondrías esas instrucciones?

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Mensaje de créditos (si lo viste) | ___ |
| Herramientas activas y razón | ___ |
| Las tres capas, en una línea cada una | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| "This build option isn't included in your current license" | La licencia no incluye la experiencia clásica | Usar la experiencia nueva (Ejercicio 1) |
| "This environment is out of credits" al probar | El ambiente no tiene créditos de Copilot Studio | Variante en papel, o pedir capacidad a quien administre la facturación |
| El servidor propio no aparece o no conecta | La URL no es HTTPS, no termina en `/mcp`, el túnel está apagado o el servidor solo habla SSE | Streamable HTTP, HTTPS y el túnel activo (Lab 143) |
| El servidor propio responde 403 | El túnel no está en la lista de hosts permitidos del servidor | `MCP_PUBLIC_HOST` (Lab 143, Ejercicio 6) |
| El agente no usa tu herramienta | La descripción no dice cuándo usarla, o el cambio aún no se ve | Mejorar la descripción y esperar (Learn: 12-24 h) |
| El agente da una cifra distinta a la app | Consultó otra tabla o filtró distinto | Ver la actividad y comparar la consulta |

## 🔧 Diagnóstico y reparación

### "El agente dice que no tiene acceso a los proveedores"

1. ¿La cuenta con la que pruebas tiene el privilegio **Read** sobre `Proveedor`? El servidor usa su identidad.
2. ¿La herramienta del servidor está añadida y activa en el agente?
3. ¿Copilot Studio sigue permitido en **Advanced Settings** del ambiente (Lab 141, Ejercicio 1)?
4. Repara la capa que falla, no las tres a la vez.

## Checklist final

- [ ] Sé qué experiencia de Copilot Studio tengo y qué no incluye mi licencia
- [ ] Agente con instrucciones de solo lectura
- [ ] Servidor MCP de Dataverse añadido, con las herramientas peligrosas desactivadas si la experiencia lo permite
- [ ] Cinco preguntas con respuesta esperada y real (o el mensaje de créditos y la variante en papel)
- [ ] Nota de coste y gobierno

## Evidencia esperada

- Captura del diálogo **Agregar una herramienta** con la pestaña **MCP**
- Captura de la herramienta añadida
- La tabla de las cinco preguntas, o el mensaje de créditos
- La nota del Ejercicio 6

## Criterios de aprobación

- Distingues lo que comprobaste de lo que solo leíste en Learn
- Tus preguntas de prueba tienen la respuesta esperada **antes** de preguntar
- Separas instrucciones, herramientas activas y rol como tres capas distintas
- Sabes qué cuesta el agente y quién debe autorizarlo

## Competencias desarrolladas

- Crear un agente de Copilot Studio y darle herramientas MCP
- Acotar un agente con instrucciones y con su configuración de herramientas
- Probar un agente contra respuestas conocidas
- Valorar coste y gobierno antes de publicar un agente

## Reto adicional

**Reto básico:** cambia la descripción del agente para que también responda en inglés y repite la pregunta 1 en inglés.

**Reto intermedio:** añade una sexta pregunta ambigua ("¿quién es el mejor proveedor?") y escribe qué debería contestar un buen asistente.

**Reto avanzado:** con el servidor propio, añade una autenticación por clave de API (Learn la admite) y escribe qué cambiarías en el código del Lab 143 para comprobarla.

## Preguntas de repaso

1. En este lab, ¿quién es el host, quién el cliente MCP y quién el servidor?
2. ¿Por qué las instrucciones del agente no bastan para impedir un borrado?
3. ¿Qué transporte exige Copilot Studio a un servidor MCP?
4. ¿Por qué conviene escribir la respuesta esperada antes de probar?
5. ¿Qué haces si una herramienta nueva de tu servidor no aparece en el agente?

## Limpieza del laboratorio

Borra el agente `Asistente de compras SIT` si no lo vas a usar (consume capacidad solo cuando responde, pero no lo dejes publicado). Si conectaste tu servidor, **apaga el túnel**. Revisa el Lab 141 para quitar clientes MCP del ambiente.

## Siguiente laboratorio recomendado

**Lab 143 — Un servidor MCP propio** (si aún no lo hiciste) o, para profundizar en agentes, el **Módulo 22** (Copilot Studio avanzado).

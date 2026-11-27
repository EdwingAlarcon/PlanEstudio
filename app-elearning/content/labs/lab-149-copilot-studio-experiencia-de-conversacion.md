---
id: lab-149
title: "Experiencia de conversación: Adaptive Card, confirmación antes de actuar, errores útiles y escalado (Ruta Pro Copilot Studio)"
level: "N2"
duration: 260
product: ["Copilot Studio"]
certifications: []
role: ["Agent builder", "Maker"]
prerequisites:
  - "Lab 148 terminado: el agent flow ACS - Registrar solicitud de compra con validación y las salidas Resultado y Mensaje"
  - "Ambiente del curso con una prueba de Copilot Studio activa (no hacen falta créditos)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 149 — Experiencia de conversación: Adaptive Card, confirmación antes de actuar, errores útiles y escalado

## Objetivo

Que pedir una compra al `Asistente de compras SIT` se sienta seguro y claro. Vas a pedir los datos con una **Adaptive Card** en lugar de cinco preguntas sueltas. Vas a mostrar un **resumen y pedir confirmación** antes de registrar. Vas a hacer que la herramienta de registro solo se use desde ese topic. Después vas a personalizar los **topics de sistema** que el usuario ve cuando algo sale mal (**Fallback**, **Escalate**, **On Error**, **Start Over**) y a reescribir los mensajes de error. Lo compruebas con ocho escenarios.

## Escenario de negocio

En el piloto, el agente registró una solicitud con 30 sillas cuando el usuario dijo "3 sillas". El usuario no vio qué se iba a registrar hasta que ya estaba hecho. Además, cuando se apagó el flujo por mantenimiento, el chat mostró un error técnico, y quien pidió hablar con una persona no supo a quién escribir. Compras pide tres cosas: un formulario con los datos a la vista, nada registrado sin un sí explícito y mensajes que digan qué hacer.

## Lo que vas a construir

- El topic `Nueva solicitud de compra`, con una Adaptive Card de cinco campos, el resumen con importe y nivel, y la confirmación
- La herramienta `Registrar solicitud de compra` usable solo desde ese topic
- Los topics de sistema **Escalate**, **On Error** y **Fallback** con mensajes propios
- Cuatro mensajes de error reescritos
- Una tabla de ocho escenarios con su resultado

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Una Adaptive Card que pide la compra | 50 min |
| Ejercicio 2 — Resumen y confirmación antes de registrar | 50 min |
| Ejercicio 3 — Cuando algo sale mal: los topics de sistema | 60 min |
| Ejercicio 4 — Mensajes de error que dicen qué hacer | 30 min |
| Ejercicio 5 — Probar ocho escenarios | 70 min |
| **Total** | **unas 4 h 20 min** |

## Nivel

**N2 Intermedio** — Ruta Pro Copilot Studio (competencia profesional alineada con el examen AB-620)

## Tecnologías utilizadas

- Copilot Studio (harness estándar con orquestación generativa): nodo **Ask with Adaptive Card**, nodo **Question** con **Boolean**, llamada a una herramienta desde un topic, opciones de reintento, topics de sistema (**Fallback**, **Escalate**, **On Error**, **Start Over**, **Reset Conversation**), variables de sistema
- Adaptive Cards 1.5

## Prerrequisitos

### Entorno

- [ ] El agente `Asistente de compras SIT` con el agent flow validado del [Lab 148](/labs/lab-148-copilot-studio-herramientas), en el ambiente del curso, con la prueba de Copilot Studio activa.
- [ ] El paquete [asistente-compras.zip](/practice-assets/copilotstudio/asistente-compras/asistente-compras.zip) descargado de nuevo (versión con la carpeta `lab149/`). Usas `tarjeta-solicitud.json` y `escenarios-conversacion.json`.

> **Etiquetas:** este lab da los nombres en inglés, como Learn. Si tu interfaz está en español, busca el equivalente; las etiquetas en español de estas pantallas no se han comprobado.

### Conocimiento previo

- [Lab 145](/labs/lab-145-copilot-studio-topics-a-fondo): preguntas, variables y condiciones en un topic.

---

## Ejercicio 1 — Una Adaptive Card que pide la compra

**Objetivo:** pedir los cinco datos de una vez, con listas cerradas donde corresponde, en lugar de cinco preguntas que el usuario puede contestar a medias.

1. Abre `lab149/tarjeta-solicitud.json`. Fíjate en tres cosas:
   - `"version": "1.5"`. Learn indica que el nodo admite el esquema 1.6 y anteriores, pero que Teams y el widget de chat en vivo se quedan en la 1.5 ([Learn: Ask with Adaptive Card](https://learn.microsoft.com/microsoft-copilot-studio/authoring-ask-with-adaptive-card)). Si el agente llega algún día a Teams, la tarjeta sirve tal cual.
   - Cinco entradas con `id`: `titulo`, `area`, `categoria`, `cantidad` y `precioUnitario`. Área y categoría son listas (`Input.ChoiceSet`): el usuario no puede inventar "Juguetes". La cantidad, en cambio, admite 2,5: `Input.Number` no exige enteros. Esa la frena el agent flow (Lab 148, caso V3).
   - Dos botones `Action.Submit`, cada uno con `data.actionSubmitId` (`revisar` o `cancelar`). Learn recomienda ese identificador para saber qué botón se pulsó.
2. **Topics** > **Add a topic** > **From blank**. Nombre: `Nueva solicitud de compra`. Descripción del desencadenador (**The agent chooses**):

```text
Pide y registra una solicitud de compra nueva con un formulario. Úsalo siempre que el usuario quiera pedir, crear o registrar una compra, aunque ya haya dado algunos datos.
```

3. **Add node** > **Ask with Adaptive Card**. En el nodo, **…** > **Properties** > **Edit adaptive card**. En **Card payload editor**, borra el contenido, pega el JSON del archivo y **Save** ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/authoring-ask-with-adaptive-card)).
4. Learn indica que Copilot Studio crea solo las variables de salida a partir de las entradas de la tarjeta. Comprueba en el nodo que aparecen `titulo`, `area`, `categoria`, `cantidad` y `precioUnitario`, con su tipo (`cantidad` y `precioUnitario` como número), y `actionSubmitId`, que no es una entrada: sale del `data` del botón que se pulsó. Si falta alguna o el tipo es otro, corrígelo con **Edit Schema**.
5. En las propiedades del nodo, revisa el reintento ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/authoring-ask-with-adaptive-card)):
   - **How many reprompts**: deja **Repeat up to 2 times**.
   - **Retry prompt** > **Customize**: `Para registrar la compra, rellena el formulario. Si prefieres no seguir, pulsa Cancelar.`
   - **Allow switching to another topic**: déjalo activado. Así, si el usuario pregunta otra cosa a mitad del formulario, el agente contesta y luego vuelve a enviar la tarjeta.
6. Agrega una **Condition**: `actionSubmitId` **is equal to** `cancelar`. En esa rama: **Send a message** `Cancelado. No registré nada.` y **Topic management** > **End current topic**. La otra rama sigue en el Ejercicio 2.
7. **Save** y prueba en una sesión nueva: `Quiero pedir una compra`. Rellena la tarjeta, pulsa **Revisar solicitud** y mira en **Variables** qué valores llegaron.

> **Learn advierte** que en el chat de prueba se ven tarjetas 1.6, pero en el lienzo del topic no. Si la vista previa del lienzo no muestra algo, pruébalo en el chat antes de cambiar el JSON.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Variables de salida que creó el nodo, con su tipo | ___ |
| ¿Tuviste que usar **Edit Schema**? ¿Para qué? | ___ |
| Valor de `actionSubmitId` al pulsar cada botón | ___ |

---

## Ejercicio 2 — Resumen y confirmación antes de registrar

**Objetivo:** que nada se registre sin que el usuario vea el importe y el nivel, y diga que sí.

1. En la rama que no es `cancelar`, **Add node** > **Variable management** > **Set a variable value**: `ImporteSolicitud` = fórmula `Topic.cantidad * Topic.precioUnitario`. Otra: `NivelSolicitud` = `If(Topic.ImporteSolicitud <= 1000, 1, If(Topic.ImporteSolicitud <= 10000, 2, 3))` (la misma regla del Lab 144).
2. **Ask a question** con **Identify** = **Email**: `¿A qué correo te aviso cuando la aprueben?`. Guarda la respuesta en `Correo`. (En el Lab 150 esta pregunta desaparece: el correo saldrá de la identidad del usuario.)
3. **Ask a question** con **Identify** = **Boolean** ([Learn: nodo Question](https://learn.microsoft.com/microsoft-copilot-studio/authoring-ask-a-question)). Texto:

```text
Voy a registrar esta solicitud:
- {Topic.titulo}, para {Topic.area} ({Topic.categoria})
- {Topic.cantidad} × {Topic.precioUnitario} USD = {Text(Topic.ImporteSolicitud, "#,##0.##")} USD
- Nivel de aprobación {Topic.NivelSolicitud}
¿La registro?
```

   El importe va con `Text(..., "#,##0.##")` para que salga con separador de miles: inserta esa parte como fórmula (**fx**). Si tu versión no deja fórmulas dentro del texto de la pregunta, crea antes otra variable `ImporteTexto` con esa fórmula y úsala. El separador que verás depende del idioma del agente.

   Guarda la respuesta en `Confirmar`. Los nombres de variable aparecen al escribir `{` o con el botón de insertar variable.

   **No está comprobado** cómo reconoce **Boolean** un "Sí" con tilde en un agente en español, ni si muestra botones. Si en la prueba no entiende tu respuesta, cambia **Identify** a **Multiple choice options** con `Sí, registrarla` y `No`, y en el paso 4 compara con `Sí, registrarla`.
4. **Condition**: `Confirmar` **is equal to** `true`.
   - **Rama sí:** **Add node** > **Add a tool** y elige `Registrar solicitud de compra` (en algunas versiones la opción se llama **Call an action**: no está comprobado cuál verás). Asigna cada entrada de la herramienta a su variable: `Titulo` = `Topic.titulo`, `Area` = `Topic.area`, `Categoria` = `Topic.categoria`, `Cantidad` = `Topic.cantidad`, `PrecioUnitario` = `Topic.precioUnitario`, `CorreoSolicitante` = `Topic.Correo`. Las salidas (`Resultado`, `Mensaje`, `Importe`, `Nivel`) quedan como variables del topic. Después, **Send a message**: `{Topic.Mensaje}`. Para que el usuario no lea el resultado dos veces, pon la **Completion** de la herramienta (Lab 148, Ejercicio 2) en **After running** = **Don't respond**: ahora el mensaje lo da el topic.
   - **Rama no:** **Send a message** `No registré nada. Si quieres cambiar un dato, pídeme la solicitud otra vez.`
5. **Que la herramienta solo se use desde aquí.** En **Tools** > `Registrar solicitud de compra` > **Details**, desactiva **Allow agent to decide dynamically when to use the tool** ([Learn: agregar herramientas](https://learn.microsoft.com/microsoft-copilot-studio/add-tools-custom-agent)). Learn lo explica así: con la opción apagada, el agente usa la herramienta solo cuando un topic la llama. El orquestador ya no la llama por su cuenta con datos sacados de una frase: el único camino para registrar pasa por la tarjeta y el sí.
6. **Save** y prueba C1 y C2 de `lab149/escenarios-conversacion.json`.

> **¿Confirmación en el topic o en la herramienta?** **Ask the end user before running** pregunta antes de ejecutar, pero el texto lo decide la plataforma. En el topic, la confirmación la escribes tú: puedes mostrar el importe calculado y el nivel, que es lo que el usuario necesita ver para detectar un error de cantidad. Para registrar dinero, el resumen propio vale el esfuerzo.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Texto del resumen que vio el usuario en C1 | ___ |
| ¿Se creó una fila en C2 (respondiendo No)? | ___ |

---

## Ejercicio 3 — Cuando algo sale mal: los topics de sistema

**Objetivo:** que el usuario sepa qué hacer cuando el agente no entiende, no puede o falla.

Learn describe los topics de sistema en [Usar topics de sistema](https://learn.microsoft.com/microsoft-copilot-studio/authoring-system-topics). Ábrelos en **Topics** > **System**.

### Tarea 3.1 — Escalate: hablar con una persona

1. Abre **Escalate**. Learn indica que, por defecto, solo muestra un mensaje, y que los agentes creados en Copilot Studio no traen el nodo **Transfer conversation** ([Learn: traspaso a un agente humano](https://learn.microsoft.com/microsoft-copilot-studio/advanced-hand-off)). Ese nodo necesita un **engagement hub** (un centro de contacto como Dynamics 365 Contact Center) configurado en **Channels**: no lo tienes en el ambiente del curso.
2. Cambia el mensaje por uno que sirva sin traspaso:

```text
Te pongo en contacto con Compras. Escríbeles a compras@sit.example.com, de lunes a viernes de 8:00 a 17:00. Para que te atiendan antes, incluye el título de tu solicitud y el importe.
```

3. **En papel:** si SIT tuviera un engagement hub, ¿qué pondrías en **Private message to agent** (el texto que recibe la persona de Compras, en la variable `va_AgentMessage`)? Escribe el texto con las variables que usarías.

### Tarea 3.2 — Fallback: lo que el agente no entiende

4. Abre **Fallback**. Learn indica que se dispara cuando el agente no encuentra un topic, que pide reformular y, a la segunda, redirige a **Escalate** ([Learn: módulo de topics de sistema](https://learn.microsoft.com/training/modules/copilot-studio-topics/topics-system)). Con la orquestación generativa, el orquestador busca antes en el conocimiento ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/advanced-generative-actions)). Learn no detalla cuándo exactamente salta Fallback en ese caso: lo vas a observar en C6.
5. Cambia su primer mensaje por uno que diga qué sí sabe hacer el agente:

```text
No tengo información sobre eso. Puedo ayudarte con la política de compras de SIT, con precios del catálogo y con pedir o consultar una solicitud. ¿Me lo preguntas de otra forma?
```

### Tarea 3.3 — On Error: cuando falla una pieza

6. Abre **On Error**. Learn indica que el mensaje incluye el código de error, el identificador de la conversación y la hora, y que el topic detecta si estás en el panel de prueba para mostrar más detalle ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/authoring-system-topics)). Busca la condición con `System.Conversation.InTestMode` ([Learn: variables](https://learn.microsoft.com/microsoft-copilot-studio/authoring-variables-about)).
7. En la rama que no es de prueba (lo que vería un empleado), cambia el mensaje:

```text
Algo falló de nuestro lado y no pude terminar. No pude confirmar si tu solicitud quedó registrada: pregúntame por tus solicitudes antes de repetirla. Si sigue fallando, escribe a compras@sit.example.com con esta referencia: {System.Conversation.Id}.
```

   Deja la rama de prueba como está: el código de error te sirve para diagnosticar. El mensaje no promete que no se registró nada, porque el error puede llegar después de crear la fila. Learn además advierte que **On Error** no cubre los errores de sistema: no está garantizado que un flujo apagado lo dispare. Lo vas a ver en C8.

### Tarea 3.4 — Start Over

8. Prueba en una sesión: pide una revisión del Lab 145 (para que se rellene `Global.AreaSolicitante`) y luego escribe `empezar de nuevo`. Si no ves **Start Over** en **System**, búscalo en la lista general de topics: Learn no lo lista entre los de sistema en todos los tipos de agente. Learn indica que **Start Over** pide confirmación y redirige a **Reset Conversation**, que borra las variables pero no el historial del chat ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/authoring-system-topics)). Comprueba en **Variables** si `Global.AreaSolicitante` quedó vacía.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Texto de **Private message to agent** que propones | ___ |
| Variable que usa **On Error** para saber si es una prueba | ___ |
| ¿Se vació `Global.AreaSolicitante` con Start Over? | ___ |

---

## Ejercicio 4 — Mensajes de error que dicen qué hacer

**Objetivo:** revisar los textos que ve el usuario cuando algo no va. El módulo de formación de Learn sobre topics de sistema da estas pautas: lenguaje llano y sin jerga, ofrecer un siguiente paso (reintentar, otra forma de preguntar, un contacto) y no repetir siempre la misma disculpa ([Learn](https://learn.microsoft.com/training/modules/copilot-studio-topics/topics-system)).

Reescribe estos cuatro mensajes con esas pautas. Los dos primeros están en tu agente; los otros dos son ejemplos típicos:

| Mensaje original | Problema | Tu versión |
|---|---|---|
| `La cantidad debe ser un número entero mayor que 0.` (agent flow, Lab 148) | Dice qué está mal, no qué hacer | ___ |
| `Cancelado. No registré nada.` (Ejercicio 1) | ¿Sabe el usuario cómo volver a empezar? | ___ |
| `Error: FlowActionTimedOut` | Jerga técnica; no dice si se registró | ___ |
| `Lo siento, no entendí. Lo siento, no entendí.` | Repite la misma disculpa | ___ |

Aplica tu versión de los dos primeros en el agente (el primero, en la expresión del agent flow del Lab 148; vuelve a publicarlo).

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Tus cuatro versiones (en la tabla de arriba) | ___ |

---

## Ejercicio 5 — Probar ocho escenarios

**Objetivo:** comprobar la experiencia completa, incluidos los caminos malos.

1. Haz los ocho escenarios de `lab149/escenarios-conversacion.json`, cada uno en una **sesión nueva**. En los que piden correo, usa el tuyo.

| Id | Qué haces | Qué debe pasar | ¿Pasó? |
|---|---|---|---|
| C1 | Tarjeta: tóner, Operaciones, Papelería, 10 × 95; Sí | Resumen 950 USD, nivel 1; se registra | |
| C2 | Tarjeta: portátiles, TI, Tecnología, 3 × 1400; No | Resumen 4.200 USD, nivel 2; no se registra | |
| C3 | Con la tarjeta a la vista, escribes "3 sillas a 210" | Reintento y la tarjeta otra vez, **o** el topic empieza de nuevo (lo toma como interrupción) | |
| C4 | Pulsas Cancelar | Termina sin registrar, con mensaje claro | |
| C5 | Tarjeta: grapas, 10 × 2; Sí | El flujo rechaza (20 USD, caja menor) y el agente lo explica | |
| C6 | "¿me recomiendas un restaurante cerca de la oficina?" | Dice que no puede y qué sí hace | |
| C7 | "quiero hablar con una persona" | Tu mensaje de Escalate | |
| C8 | Apagas el agent flow y repites C1 | Observación: anota qué topic respondió (**On Error** u otro) y si se creó la fila | |

2. **C8:** apaga el flujo desde su página en Copilot Studio (los agent flows pueden no aparecer en **My flows** de Power Automate). Anota qué código de error mostró el panel de prueba. **Vuelve a encenderlo al terminar.**
3. **C3:** Learn indica que un texto que no rellena la tarjeta cuenta como respuesta no válida, salvo que active otro topic. Aquí hay una trampa: "3 sillas a 210" encaja con la descripción del propio topic, así que con **Allow switching to another topic** activado puede tomarse como interrupción y empezar de nuevo, sin reintento. Anota cuál de las dos cosas pasó. Para ver el reintento, repite C3 escribiendo algo que no encaje con ningún topic (por ejemplo, `ok`) y anota qué pasa al agotar los reintentos.
4. **C6:** anota qué pieza contestó en el mapa de actividad: ¿las instrucciones del Lab 144, el conocimiento o **Fallback**?

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Escenarios que se comportaron como se esperaba (de 8) | ___ |
| Código de error de C8 | ___ |
| Pieza que contestó C6 | ___ |
| Qué pasó en C3 tras agotar los reintentos | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| La tarjeta no aparece o sale vacía | JSON pegado incompleto o con comentarios | Vuelve a copiar `tarjeta-solicitud.json` entero |
| `cantidad` llega como texto | El esquema de salida se generó mal | **Edit Schema** y cambia el tipo a número |
| El agente registra sin mostrar la tarjeta | La herramienta sigue disponible para el orquestador | Ejercicio 2, paso 5 |
| La condición de cancelar nunca se cumple | Comparas con `Cancelar` (mayúscula) y el valor es `cancelar` | Usa el valor exacto de `data.actionSubmitId` |
| C8 muestra el error técnico a todos | Cambiaste la rama de prueba de **On Error** en lugar de la otra | Ejercicio 3, paso 7 |
| El flujo sigue apagado | Se te olvidó encenderlo tras C8 | **Turn on** |

## Checklist final

- [ ] Topic `Nueva solicitud de compra` con la Adaptive Card, cancelar, resumen y confirmación
- [ ] Herramienta de registro solo desde el topic (o con confirmación de la plataforma)
- [ ] **Escalate**, **Fallback** y **On Error** con mensajes propios
- [ ] Cuatro mensajes de error reescritos
- [ ] Ocho escenarios evaluados y el flujo encendido de nuevo

## Evidencia esperada

- Captura de la tarjeta en el chat de prueba
- Captura del resumen de confirmación de C1
- Captura de tus mensajes de **Escalate** y **On Error**
- Tu tabla de los cuatro mensajes reescritos
- Tu tabla de los ocho escenarios

## Criterios de aprobación

- Nada se registra sin el resumen y un sí (C1, C2 y C4)
- C5 muestra el motivo del rechazo, no un error técnico
- C7 y C8 dicen al usuario qué hacer y a quién escribir
- Sabes explicar cuándo conviene una tarjeta y cuándo una pregunta suelta

## Competencias desarrolladas

- Pedir datos con Adaptive Cards y manejar entradas no válidas
- Diseñar una confirmación que muestre lo que importa antes de actuar
- Limitar cuándo el orquestador puede usar una herramienta
- Personalizar los topics de sistema para errores, escalado y reinicio
- Escribir mensajes de error útiles

## Reto adicional

**Reto básico:** añade a la tarjeta un campo opcional `justificacion` (`Input.Text` con `isMultiline`) y muéstralo en el resumen solo si no está vacío.

**Reto intermedio:** cuando `Resultado` sea `RECHAZADA`, vuelve a mostrar la tarjeta con los datos que el usuario ya escribió. Pista: los valores iniciales de una tarjeta se pueden poner con Power Fx activando **Formula** en las propiedades del nodo (Learn avisa de que después no se puede volver al JSON).

**Reto avanzado:** diseña en papel el traspaso real: qué engagement hub usaría SIT, qué variables pasarías a la persona de Compras y qué ve el empleado mientras espera.

## Preguntas de repaso

1. ¿Por qué la tarjeta usa la versión 1.5 si el nodo admite la 1.6?
2. ¿Qué pasa si el usuario escribe texto en vez de rellenar la tarjeta?
3. ¿Qué ganas con una confirmación propia en el topic frente a **Ask the end user before running**?
4. ¿Qué hace **Escalate** por defecto en un agente sin engagement hub?
5. ¿Por qué **On Error** muestra un mensaje distinto en el panel de prueba?

## Limpieza del laboratorio

Comprueba que el agent flow está encendido. Borra las filas de prueba si no las quieres conservar. No borres el topic: el Lab 150 lo usa.

## Siguiente laboratorio recomendado

**Lab 150 — Identidad y datos del usuario**: el correo deja de preguntarse, cada empleado ve solo sus solicitudes y el agente no se deja convencer para mostrar las de otros.

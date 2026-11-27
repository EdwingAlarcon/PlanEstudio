---
id: lab-151
title: "Multiagente: agentes hijos con conocimiento propio, entradas y salidas, y el agente conectado en papel (Ruta Pro Copilot Studio)"
level: "N3"
duration: 260
product: ["Copilot Studio"]
certifications: []
role: ["Agent builder", "Arquitecto de soluciones"]
prerequisites:
  - "Lab 150 terminado: el agente Asistente de compras SIT con sus topics, herramientas y autenticación"
  - "Ambiente del curso con una prueba de Copilot Studio activa (no hacen falta créditos)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 151 — Multiagente: agentes hijos con conocimiento propio, entradas y salidas, y el agente conectado en papel

## Objetivo

Que el `Asistente de compras SIT` atienda también a los **proveedores** sin mezclar su conocimiento con el de los empleados. Vas a crear dos **agentes hijos** dentro del agente: uno con su propio conocimiento (las preguntas frecuentes de proveedores) y otro con **entradas y salidas** que un topic llama de forma explícita. Vas a comprobar con seis casos de tolerancia de factura qué hace bien un agente y qué no le debes pedir. Cierras diseñando en papel el **agente conectado**, que no puedes probar porque exige publicar, y decidiendo seis situaciones de arquitectura.

## Escenario de negocio

Cuentas por pagar recibe muchas preguntas de proveedores: a dónde mandar la factura, cuándo pagan, qué pasa si el importe no coincide. Quieren que el asistente las responda, pero con una condición: las respuestas para proveedores salen de las preguntas frecuentes de proveedores, no del manual interno. Además, quieren comprobar rápido si una factura está dentro de la tolerancia del 2 %. Más adelante, Cuentas por pagar tendrá su propio agente; hoy decides si hace falta.

## Lo que vas a construir

- Una tabla de enrutamiento de ocho mensajes, antes y después de los agentes hijos
- El agente hijo `Atención a proveedores`, con las preguntas frecuentes de proveedores como conocimiento propio
- El agente hijo `Comprobar tolerancia de factura`, con dos entradas y dos salidas, llamado desde el topic `Comprobar factura`
- Una tabla de seis facturas con el resultado del agente hijo y el de una fórmula de Power Fx
- El diseño en papel de un agente conectado y seis decisiones de arquitectura

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Línea base: ¿quién atiende cada mensaje? | 25 min |
| Ejercicio 2 — Un agente hijo con conocimiento propio | 45 min |
| Ejercicio 3 — Un agente hijo con entradas y salidas | 80 min |
| Ejercicio 4 — La cuenta no se la pidas al modelo | 40 min |
| Ejercicio 5 — Instrucciones y agentes desactivados | 25 min |
| Ejercicio 6 — El agente conectado, en papel | 50 min |
| **Total** | **unas 4 h 20 min** |

## Nivel

**N3 Avanzado** — Ruta Pro Copilot Studio (competencia profesional alineada con el examen AB-620)

## Tecnologías utilizadas

- Copilot Studio (harness estándar con orquestación generativa): página **Agents**, **New child agent**, **When will this be used?**, conocimiento y herramientas propios del agente hijo, **Inputs** y **Outputs**, **After running**, nodo para llamar a un agente desde un topic, **Enabled**
- Power Fx en topics (`Abs`, `Round`, `If`)
- Agentes conectados (en papel): **Let other agents connect to and use this one**, **Pass conversation history to this agent**

## Prerrequisitos

### Entorno

- [ ] El agente `Asistente de compras SIT` del [Lab 150](/labs/lab-150-copilot-studio-identidad-del-usuario), en el ambiente del curso, con la prueba de Copilot Studio activa y la orquestación generativa encendida.
- [ ] El paquete [asistente-compras.zip](/practice-assets/copilotstudio/asistente-compras/asistente-compras.zip) descargado de nuevo (versión con la carpeta `lab151/`). Usas `faq-proveedores.docx` (en la raíz del paquete), `lab151/agentes-hijos.json`, `lab151/casos-tolerancia.json`, `lab151/mensajes-enrutamiento.json` y `lab151/decisiones-multiagente.json`.

> **Por qué agentes hijos y no conectados.** Learn indica que, para conectar otro agente de Copilot Studio, ese agente tiene que estar **publicado**, en el mismo entorno y con las conexiones permitidas ([Learn: agente conectado](https://learn.microsoft.com/microsoft-copilot-studio/add-agent-copilot-studio-agent)). La prueba de Copilot Studio no permite publicar ([Learn: FAQ](https://learn.microsoft.com/microsoft-copilot-studio/faq-billing-licensing)). Un agente hijo vive dentro de tu agente y no se publica aparte ([Learn: agente hijo](https://learn.microsoft.com/microsoft-copilot-studio/add-agent-child-agent)): ese sí lo pruebas. Learn documenta los dos como funciones del harness estándar.

> **Créditos.** Learn indica que, en el panel de prueba, la actividad del propio agente no consume Copilot Credits. Que eso incluya a los agentes hijos se deduce (son parte del agente), pero Learn no lo dice expresamente: si ves un aviso de créditos, anótalo y sigue con la parte en papel.

> **Etiquetas:** este lab da los nombres en inglés, como Learn. Si tu interfaz está en español, busca el equivalente; las etiquetas en español de estas pantallas no se han comprobado.

### Conocimiento previo

- [Lab 145](/labs/lab-145-copilot-studio-topics-a-fondo): entradas y salidas de topics, Redirect.
- [Lab 147](/labs/lab-147-copilot-studio-orquestacion-y-harness): mapa de actividad y cómo elige el orquestador por las descripciones.

---

## Ejercicio 1 — Línea base: ¿quién atiende cada mensaje?

**Objetivo:** saber qué hace el agente hoy con preguntas de proveedores, antes de cambiar nada.

1. Abre `lab151/mensajes-enrutamiento.json`. Prepara una tabla con los ocho mensajes y tres columnas: **Antes**, **Después** y **Esperado** (la pieza de `piezaEsperada`).
2. En el panel de prueba, con **Nueva sesión de prueba** antes de cada uno, envía R1 a R8. En **Antes**, anota quién respondió (míralo en el mapa de actividad: topic, herramienta, conocimiento o nada) y si la respuesta era correcta.

| Id | Mensaje (resumen) | Antes | Después | Esperado |
|---|---|---|---|---|
| R1 | ¿A qué correo envío mis facturas? | | | Agente hijo `Atención a proveedores` |
| R2 | ¿En cuántos días me pagan? | | | Agente hijo `Atención a proveedores` |
| R3 | ¿Me pagan dos veces una factura reenviada? | | | Agente hijo `Atención a proveedores` |
| R4 | Comprobar factura de 1.020,01 sobre 1.000 | | | Topic `Comprobar factura` → agente hijo `Comprobar tolerancia de factura` |
| R5 | ¿Quién aprueba 4.200 USD? | | | Topic `Calcular nivel de aprobación` |
| R6 | ¿Con cuánta anticipación pido un viaje? | | | Conocimiento del agente principal (manual) |
| R7 | ¿Cuál es la tolerancia de SIT? | | | Agente hijo `Atención a proveedores` (no el topic) |
| R8 | Soy proveedor: ¿estado de la solicitud de Comercial? | | | Una negativa |

   Lo esperable en la línea base: R1, R2, R3 y R7 sin respuesta o con un "no lo sé", porque el manual interno no habla de facturas de proveedores. Si el agente responde algo concreto, **míralo con lupa**: con **Allow ungrounded responses** apagado (Lab 144) no debería inventar.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Columna **Antes** completa | ___ |
| ¿Algún mensaje de proveedores tuvo respuesta concreta? ¿De dónde salió? | ___ |

---

## Ejercicio 2 — Un agente hijo con conocimiento propio

**Objetivo:** agrupar en un agente hijo lo que solo sirve para proveedores: sus instrucciones y su conocimiento.

1. En el agente, abre la página **Agents** > **Add** > **New child agent** ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/add-agent-child-agent)).
2. Copia de `lab151/agentes-hijos.json` el primer agente:
   - **Name**: `Atención a proveedores`.
   - **When will this be used?**: deja **The agent chooses - Based on description** y pega la **descripción** del archivo. Learn indica que, con esa opción, el agente hijo se usa según su descripción.
   - **Instructions**: pega las del archivo.
3. En la sección **Knowledge** del agente hijo, **Add** y sube `faq-proveedores.docx`, igual que subiste el manual en el Lab 144. Learn indica que el conocimiento y las herramientas que añades aquí **solo los usa este agente hijo**.
4. Deja **Enabled** encendido y **Save**.
5. **Cierra la puerta de los datos internos.** El agente principal tiene la herramienta `Consultar mis solicitudes` del Lab 150, y en el panel tú estás autenticado como empleado: ante R8 ("Soy proveedor: ¿en qué estado está la solicitud…?") el orquestador podría llamarla con tu correo y listar tus solicitudes, sin pasar por el agente hijo. Añade al final de las **Instructions** del agente principal: `Si quien pregunta dice ser proveedor, no uses las herramientas de solicitudes internas (Consultar mis solicitudes, Registrar solicitud de compra).` En R8, anota qué pieza respondió.
6. **No** subas las preguntas frecuentes también al agente principal. Si estuvieran en los dos, el orquestador podría responder desde el principal sin pasar por el hijo, y perderías la separación que pidió Cuentas por pagar.
7. Repite R1, R2, R3, R7 y R8 en sesiones nuevas y llena **Después**. En el mapa de actividad debería aparecer el agente hijo. Learn advierte que las citas pueden no conservarse cuando un agente devuelve su resultado al que lo llamó ([Learn: limitaciones](https://learn.microsoft.com/microsoft-copilot-studio/authoring-add-other-agents)): anota si la respuesta llegó con cita o sin ella.

> **Cuándo un agente hijo y cuándo un topic.** Un topic sigue un guion que tú escribes nodo a nodo. Un agente hijo recibe una tarea en lenguaje natural y decide con sus propias instrucciones, conocimiento y herramientas. Learn recomienda el agente hijo para un caso de uso concreto que mantiene el mismo equipo, que no necesita configuración, autenticación ni despliegue propios, y que no se publica ni se reutiliza en otros agentes.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Columna **Después** de R1, R2, R3, R7 y R8 | ___ |
| ¿Aparece el agente hijo en el mapa de actividad? | ___ |
| ¿Llegaron las respuestas con cita? | ___ |

---

## Ejercicio 3 — Un agente hijo con entradas y salidas

**Objetivo:** llamar a un agente hijo desde un topic, pasarle datos y recibir valores, en lugar de un resumen en lenguaje natural.

Learn indica que, por defecto, un agente hijo recibe una tarea en lenguaje natural y devuelve un resumen de lo que hizo, y que puedes definir **entradas** y **salidas** explícitas ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/add-agent-child-agent#manage-inputs-and-outputs)).

### Tarea 3.1 — El agente hijo

1. **Agents** > **Add** > **New child agent**. Usa el segundo agente de `agentes-hijos.json`: **Name** `Comprobar tolerancia de factura` e **Instructions** del archivo.
2. En **When will this be used?**, despliega la lista y elige **It's redirected to**. Learn la describe así: se llama cuando el agente se llama de forma explícita desde un topic. Así el orquestador no lo elige por su cuenta: solo lo usa el topic de la Tarea 3.2.
3. En **Inputs**, **Add Input** dos veces:
   - **Display name** `ImporteAprobado`, **Description** la del archivo, **Data type** Number, **Make this input required**.
   - **Display name** `ImporteFactura`, igual.
4. En **Outputs**, despliega **Advanced** y **Add output** dos veces: `Resultado` (**Data type** String) y `Diferencia` (Number), con las descripciones del archivo.
5. En **Outputs** > **After running**, deja **Don't respond** (la opción por defecto). Learn indica que, con ella, el agente principal no envía su propio mensaje al terminar el hijo; las instrucciones del archivo ya le piden al hijo que no escriba al usuario, porque el topic responderá. **Save**.

### Tarea 3.2 — El topic que lo llama

6. **Topics** > **Add a topic** > **From blank**. Nombre `Comprobar factura`. Descripción:

```text
Comprueba si una factura de proveedor concreta está dentro de la tolerancia, a partir del importe aprobado de la compra y del importe de la factura, en USD. Úsalo cuando el usuario pida comprobar una factura, aunque todavía no haya dado los importes: el topic los pide. No lo uses cuando pregunte la regla general de tolerancia.
```

7. Añade dos nodos **Ask a question** con la entidad **Number**: `¿Por qué importe se aprobó la compra, en USD?` (guárdalo en `Topic.ImporteAprobado`) y `¿De cuánto es la factura, en USD?` (en `Topic.ImporteFactura`). Si los dos importes vienen en el primer mensaje, puede que el agente no los pregunte porque ya los tomó del mensaje: es correcto, sigue, y anota si los preguntó.
8. Debajo, **Add node** (+) > **Add an agent** > `Comprobar tolerancia de factura` ([Learn: llamar a un agente desde un topic](https://learn.microsoft.com/microsoft-copilot-studio/authoring-add-other-agents#redirect-to-an-agent-from-a-topic)). En el nodo, da `ImporteAprobado` = `Topic.ImporteAprobado` e `ImporteFactura` = `Topic.ImporteFactura`. Learn indica que cada salida del agente crea sola una variable del topic.
9. Añade un **Send a message** con las dos salidas: `El agente hijo dice: {Resultado} (diferencia {Diferencia} USD).` Inserta cada salida con el botón de variables. **Save**.

### Tarea 3.3 — Seis facturas

10. Abre `lab151/casos-tolerancia.json`. Para cada caso, en una sesión nueva, escribe `Quiero comprobar una factura` y da los dos importes. Escribe los decimales con **punto** (`1020.01`): en el Lab 144 viste que el separador decimal depende del idioma.
11. Anota la columna **Agente hijo**. La columna **Esperado** sale del archivo (`resultado`, con `margen` = 2 % del importe aprobado).

| Id | Aprobado | Factura | Esperado | Agente hijo | Power Fx (Ejercicio 4) |
|---|---|---|---|---|---|
| F1 | 1.000 | 1.020 | DENTRO (límite incluido) | | |
| F2 | 1.000 | 1.020,01 | FUERA | | |
| F3 | 4.200 | 4.116 | DENTRO (diferencia negativa) | | |
| F4 | 840 | 860 | FUERA (20 > 16,80) | | |
| F5 | 2.416,50 | 2.400 | DENTRO | | |
| F6 | 12.500 | 12.749,99 | DENTRO (249,99 ≤ 250) | | |

12. Envía también R4 tal cual (`Quiero comprobar una factura: la compra se aprobó por 1000 USD y la factura es de 1020.01 USD`) y llena su fila del Ejercicio 1.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Columna **Agente hijo** de F1 a F6 | ___ |
| ¿Cuántos de los seis acertó? | ___ |
| ¿Preguntó el topic los importes cuando venían en el mensaje (R4)? | ___ |

---

## Ejercicio 4 — La cuenta no se la pidas al modelo

**Objetivo:** comprobar con tus propios casos dónde va la lógica que tiene una única respuesta correcta.

1. En `Comprobar factura`, después del nodo del agente hijo, añade **Set a variable value**: variable nueva `ResultadoFx`, valor con la pestaña **Formula** (como en el Lab 144):

```text
If(Round(Abs(Topic.ImporteFactura - Topic.ImporteAprobado), 2) <= Round(Topic.ImporteAprobado * 0.02, 2), "DENTRO", "FUERA")
```

   `Round(..., 2)` evita que un resto de coma flotante (20,00999…) cambie un resultado en el límite. Learn indica que las fórmulas de Power Fx de Copilot Studio usan el punto decimal y la coma como separador de argumentos ([Learn: Power Fx](https://learn.microsoft.com/microsoft-copilot-studio/advanced-power-fx)). `Abs` y `Round` son funciones de Power Fx; que estén disponibles en Copilot Studio no se ha comprobado en el tenant: si una da error, anótalo.
2. Cambia el mensaje a: `Power Fx: {ResultadoFx}. El agente hijo dice: {Resultado}.` **Save**.
3. Repite F1 a F6 y llena la columna **Power Fx**.
4. Responde por escrito: ¿en qué casos falló el agente hijo, si falló alguno? Si acertó los seis, ¿te basta para confiarle los pagos de proveedores? ¿Qué te garantiza la fórmula que no te garantiza el agente?
5. Decide y aplica: deja que el mensaje al usuario use **solo** `ResultadoFx`. El nodo del agente hijo puedes quitarlo, o dejarlo para comparar; si lo quitas, apaga el agente hijo con **Enabled** en la página **Agents**, y en la fila R4 del Ejercicio 1 anota como pieza esperada final "topic `Comprobar factura` (Power Fx)".

> **La regla del Lab 148, otra vez:** lo que tiene una única respuesta correcta (una cuenta, una política, un permiso) va en Power Fx o en un flujo. El modelo es bueno para entender lo que pide el usuario y redactar; no para ser la única barrera de una regla de negocio. Un agente hijo con entradas y salidas brilla cuando la tarea es de lenguaje: resumir una factura, clasificar una queja, redactar una respuesta al proveedor.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Columna **Power Fx** de F1 a F6 | ___ |
| Tu respuesta del paso 4 | ___ |
| ¿Qué hiciste con el agente hijo `Comprobar tolerancia de factura`? | ___ |

---

## Ejercicio 5 — Instrucciones y agentes desactivados

**Objetivo:** ver cómo el agente principal nombra a sus agentes hijos y qué pasa si uno no está.

1. En la página **Overview** del agente principal, al final de **Instructions**, escribe `Las preguntas de proveedores sobre facturas y pagos las atiende ` y después una barra (**/**): elige `Atención a proveedores` en el menú. Termina la frase con un punto. Learn indica que Copilot Studio guarda las instrucciones solo, y que en el panel de prueba verás el agente referenciado en el mapa de actividad ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/authoring-add-other-agents#reference-a-child-agent-or-connected-agent-in-your-main-agents-instructions)).
2. Repite R7 (la tolerancia) en una sesión nueva. ¿Cambió quién lo atiende respecto del Ejercicio 2?
3. En **Agents**, apaga **Enabled** de `Atención a proveedores`. Learn indica que un agente hijo apagado no responde. Repite R1 y anota qué responde el principal. Vuelve a encenderlo.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Quién atendió R7 antes y después de nombrar al agente hijo en las instrucciones | ___ |
| Respuesta a R1 con el agente hijo apagado | ___ |

---

## Ejercicio 6 — El agente conectado, en papel

**Objetivo:** diseñar lo que no puedes probar y decidir cuándo dividir un agente.

### Tarea 6.1 — Requisitos de un agente conectado

1. Completa con lo que dice Learn ([Learn: agente conectado](https://learn.microsoft.com/microsoft-copilot-studio/add-agent-copilot-studio-agent)):

| Requisito | Qué dice Learn |
|---|---|
| Entorno | ___ |
| Estado del otro agente | ___ |
| Ajuste del otro agente que lo permite | ___ |
| Quién puede conectarlo | ___ |
| Qué pasa con la descripción si cambia en el otro agente | ___ |
| Qué hace **Pass conversation history to this agent** | ___ |

   Pistas: el otro agente está en el mismo entorno, **publicado**, con **Settings** > **Let other agents connect to and use this one** encendido, y el autor es su dueño o lo tiene compartido. La descripción del agente conectado la controlas tú en el principal y no se sincroniza sola. Quitar **Pass conversation history to this agent** limita lo que recibe a la tarea explícita.

2. Escribe en una página el diseño de `Agente de Cuentas por pagar` como agente conectado del asistente: su descripción en el asistente, si le pasarías el historial de la conversación (piensa en el Lab 150: ¿qué datos del empleado viajarían?), qué autenticación tendría y qué pasa si no está publicado. Learn advierte que un agente conectado que exige inicio de sesión no se puede llamar desde un principal con autenticación OAuth 2.0 genérica, y que, si el conectado tiene **Allow ungrounded responses** apagado y genera una respuesta sin fuentes, esa respuesta se descarta y el usuario se queda sin respuesta en ese turno.

### Tarea 6.2 — Seis decisiones

3. Abre `lab151/decisiones-multiagente.json`. Para cada situación, decide **agente hijo**, **agente conectado** o **no dividir**, y escribe la razón **antes** de mirar la respuesta.

| Id | Situación (resumen) | Tu decisión | Tu razón |
|---|---|---|---|
| M1 | Mismo equipo, sin publicar aparte, sin otra autenticación | | |
| M2 | Cuentas por pagar quiere su agente en el portal y usado por el asistente | | |
| M3 | Otro modelo y ALM propio | | |
| M4 | 12 piezas que el agente elige bien | | |
| M5 | 45 piezas y confusión entre herramientas parecidas | | |
| M6 | Conectar un agente que ya tiene sus propios conectados | | |

4. Compara con el archivo. Learn da una regla práctica: la elección empieza a degradarse con más de 30 a 40 opciones (topics, herramientas y agentes), o antes si las descripciones se parecen; y cada salto entre agentes añade latencia y más superficie de pruebas y gobierno ([Learn: consideraciones](https://learn.microsoft.com/microsoft-copilot-studio/authoring-add-other-agents#considerations-for-multi-agent-solution-design)).

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Tabla de requisitos completa | ___ |
| ¿Le pasarías el historial al agente de Cuentas por pagar? ¿Por qué? | ___ |
| Decisiones que coinciden con el archivo (de 6) | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| El agente responde a los proveedores sin pasar por el agente hijo | Las preguntas frecuentes también están en el conocimiento del principal, o la descripción del hijo es vaga | Quítalas del principal; afina la descripción con quién pregunta y de qué |
| R7 va al topic `Comprobar factura` | La descripción del topic no separa "comprobar una factura" de "preguntar la regla" | Repite la descripción del Ejercicio 3, con su última frase |
| `Quiero comprobar una factura` no dispara el topic | La descripción exige los importes, o se parece a la del agente hijo de proveedores | Usa la descripción del Ejercicio 3 ("aunque todavía no haya dado los importes") y mira el mapa de actividad |
| El nodo para llamar al agente no aparece en el topic | El agente hijo no está guardado o está apagado | **Save** y **Enabled** en la página **Agents** |
| Las salidas del agente hijo llegan vacías | Salidas sin descripción, o el hijo respondió en texto en lugar de rellenarlas | Revisa **Outputs** y las instrucciones ("Devuelve Resultado y Diferencia") |
| El usuario ve dos mensajes al terminar el hijo | El hijo escribe al usuario y además el topic responde | Instrucción "No escribas mensajes al usuario" y **After running** en **Don't respond** |
| `ResultadoFx` da error | Separador decimal o función no disponible | Punto decimal y coma entre argumentos; anota qué función falló |

## Checklist final

- [ ] Tabla de enrutamiento R1 a R8, antes y después
- [ ] Agente hijo `Atención a proveedores` con las preguntas frecuentes solo en él
- [ ] Agente hijo con dos entradas y dos salidas, llamado desde `Comprobar factura`
- [ ] Tabla F1 a F6 con el agente hijo y con Power Fx
- [ ] Decisión escrita sobre dónde va la cuenta de tolerancia
- [ ] Diseño en papel del agente conectado y seis decisiones

## Evidencia esperada

- Captura de la página **Agents** con los dos agentes hijos
- Captura del mapa de actividad de R1 con el agente hijo
- Captura del topic `Comprobar factura` con el nodo del agente hijo y la fórmula
- Tu tabla F1 a F6 y tu tabla de enrutamiento
- Tu página de diseño del agente conectado y tu tabla M1 a M6

## Criterios de aprobación

- R1, R2, R3 y R7 los atiende el agente hijo con las preguntas frecuentes, y no el manual interno
- R8 no da datos de solicitudes internas a un proveedor
- La columna **Power Fx** coincide con la esperada en los seis casos
- Sabes explicar cuándo usar un agente hijo, uno conectado o ninguno, con las razones de Learn

## Competencias desarrolladas

- Diseñar agentes hijos con instrucciones, conocimiento y herramientas propios
- Definir entradas y salidas de un agente y llamarlo desde un topic
- Separar las tareas de lenguaje de las reglas con una única respuesta correcta
- Conocer los requisitos y límites de los agentes conectados
- Decidir cuándo dividir un agente y cuándo no

## Reto adicional

**Reto básico:** añade al agente hijo `Atención a proveedores` una herramienta que solo use él: la herramienta REST `Catálogo SIT` del Lab 148 no vale (es del principal). ¿Qué herramienta tendría sentido para un proveedor? Escríbela en papel.

**Reto intermedio:** convierte `Comprobar tolerancia de factura` en un agente hijo de **lenguaje**: que reciba el texto de un correo de un proveedor y devuelva `Tipo` (factura, pago, alta u otro) y `Resumen`. Pruébalo con tres correos que escribas tú.

**Reto avanzado:** dibuja la arquitectura de SIT con tres agentes: asistente de compras, agente de Cuentas por pagar (conectado) y agente de onboarding de proveedores. Para cada uno, quién lo mantiene, dónde se publica, qué autenticación tiene y qué datos recibe del principal.

## Preguntas de repaso

1. ¿Por qué no puedes probar un agente conectado con la prueba de Copilot Studio?
2. ¿Qué diferencia hay entre lo que devuelve un agente hijo por defecto y con salidas?
3. ¿Para qué sirve **It's redirected to** en **When will this be used?**?
4. ¿Por qué la cuenta de tolerancia va en Power Fx y no en el agente hijo?
5. Da dos razones de Learn para dividir en agentes conectados y dos costes de hacerlo.

## Limpieza del laboratorio

No borres el agente hijo `Atención a proveedores` ni el topic `Comprobar factura`: el Lab 152 los evalúa y el Lab 153 los lleva en la solución.

## Siguiente laboratorio recomendado

**[Lab 152 — Evaluación y calidad](/labs/lab-152-copilot-studio-evaluacion)**: dos conjuntos de prueba importados desde CSV, métodos de evaluación y una regresión medida antes y después de un cambio.

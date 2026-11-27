---
id: lab-145
title: "Topics a fondo: entidades, entradas y salidas, variables globales y editor de código (Ruta Pro Copilot Studio)"
level: "N2"
duration: 270
product: ["Copilot Studio"]
certifications: []
role: ["Agent builder", "Maker"]
prerequisites:
  - "Lab 144 terminado: el agente Asistente de compras SIT con el topic Calcular nivel de aprobación"
  - "Ambiente del curso con una prueba de Copilot Studio activa (no hacen falta créditos)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 145 — Topics a fondo: entidades, entradas y salidas, variables globales y editor de código

## Objetivo

Llevar los topics del `Asistente de compras SIT` a nivel profesional. Vas a reconocer categorías y códigos de proveedor con **entidades** propias, convertir `Calcular nivel de aprobación` en un topic reutilizable con **entradas y salidas** y llamarlo desde otro topic con **Redirect**. También vas a guardar datos de la conversación en una **variable global**, usar **variables de sistema** y leer el topic en el **editor de código**. Al final, el agente revisa una compra antes de pedirla: categoría, importe, proveedor, nivel y si necesita a TI.

## Escenario de negocio

Después del piloto del Lab 144, Compras pide un paso más: que el agente revise una compra **antes** de registrarla. El empleado escribe como escribe ("voy a comprar unos portátiles por 900 dólares") y el agente debe entender que "portátiles" es Tecnología, que el proveedor se escribe `PRV-` y tres dígitos, que una compra de tecnología de nivel 2 pasa por TI, y no preguntar el área a cada rato.

## Lo que vas a construir

- La entidad de lista cerrada `CategoriaCompra` (seis categorías con sinónimos) y la entidad regex `CodigoProveedor`
- `Calcular nivel de aprobación` con la entrada `Importe` y las salidas `Nivel` y `Aprobadores`
- El topic `Revisar compra`, que usa las entidades, llama a `Calcular nivel de aprobación` con **Redirect** y decide si hace falta TI
- La variable global `Global.AreaSolicitante`, que se pregunta una vez por conversación
- Una prueba con seis mensajes con resultado conocido

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Dos entidades propias | 30 min |
| Ejercicio 2 — Un topic con entradas y salidas | 55 min |
| Ejercicio 3 — El topic `Revisar compra` y el Redirect | 65 min |
| Ejercicio 4 — Una variable global y las de sistema | 40 min |
| Ejercicio 5 — El editor de código | 25 min |
| Ejercicio 6 — Probar con seis mensajes | 70 min |
| **Total** | **unas 5 h** |

## Nivel

**N2 Intermedio** — Ruta Pro Copilot Studio (competencia profesional alineada con el examen AB-620)

## Tecnologías utilizadas

- Copilot Studio (harness estándar con orquestación generativa): entidades de lista cerrada y regex, **Smart matching**, entradas y salidas de topics, **Go to another topic** (Redirect), variables de topic, globales y de sistema, condiciones con Power Fx, editor de código (YAML)

## Prerrequisitos

### Entorno

- [ ] El agente `Asistente de compras SIT` del [Lab 144](/labs/lab-144-copilot-studio-en-un-dia), en el ambiente del curso, con una prueba de Copilot Studio activa. Si la prueba venció, amplíala como en el Lab 144 (Ejercicio 1).
- [ ] El paquete [asistente-compras.zip](/practice-assets/copilotstudio/asistente-compras/asistente-compras.zip) descargado de nuevo (versión con la carpeta `lab145/`). Usas `lab145/entidades.json` y `lab145/mensajes-prueba.json`.

> **Etiquetas:** este lab da los nombres en inglés, como Learn. El Lab 144 se comprobó con la interfaz en español (**Agentes**, **Nuevo agente**…). Si la tuya está en español, busca el equivalente; las etiquetas en español de estas pantallas no se han comprobado.

### Conocimiento previo

- [Módulo 15](/nivel/intermedio/modulo/copilot-studio-introduccion), Microlección 2: entidades, slot filling y variables (allí con orquestación clásica)

---

## Ejercicio 1 — Dos entidades propias

**Objetivo:** que el agente reconozca lo que la gente escribe, no solo lo que tú esperas.

1. En el agente, **Settings** > **Entities** > **Add an entity** > **New entity** > **Closed list** ([Learn: entidades](https://learn.microsoft.com/microsoft-copilot-studio/advanced-entities-slot-filling)). Nombre: `CategoriaCompra`. Agrega los seis valores de `lab145/entidades.json` y, junto a cada uno, sus sinónimos (**Synonyms**). Por ejemplo, `Tecnología` con `portátil`, `portátiles`, `computador`, `monitor`, `licencia`…
2. Activa **Smart matching**. Learn lo explica así: con él, el agente interpreta lo que escribe el usuario con lógica difusa frente a los valores de la lista. Así "tecnologia" sin tilde o "portatiles" también cuentan. **Save**.
3. **Add an entity** > **New entity** > **Regular expression (regex)**. Nombre: `CodigoProveedor`. Patrón:

```text
(?i)\bPRV-\d{3}\b
```

   Learn indica que las entidades regex usan la **sintaxis de .NET** con la comprensión del lenguaje NLU y CLU (con NLU+, la de JavaScript, donde `(?i)` no vale). `(?i)` acepta mayúsculas y minúsculas, `\d{3}` exige exactamente tres dígitos y `\b` (límite de palabra) evita que `PRV-0012` se acepte recortado como `PRV-001`. **Save**.

> **Lo que una regex no hace:** comprueba el **formato**, no que el proveedor exista ni que esté activo. `PRV-005` pasa la regex aunque en el registro de SIT esté inactivo. Eso lo comprueba una herramienta contra los datos (Lab 148).

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Sinónimos que agregaste a `Tecnología` (cuántos) | ___ |
| Patrón exacto de `CodigoProveedor` | ___ |
| ¿Está **Smart matching** activado? | ___ |

---

## Ejercicio 2 — Un topic con entradas y salidas

**Objetivo:** convertir `Calcular nivel de aprobación` en una pieza reutilizable. Recibe el importe como **entrada** y devuelve el nivel como **salida**, para que otros topics lo llamen sin repetir la fórmula.

1. Abre el topic `Calcular nivel de aprobación` y **borra primero el nodo de pregunta** del Lab 144. Así desaparece la variable `Importe` que creaba, y la entrada del paso 2 puede llamarse igual. Las fórmulas quedarán en rojo un momento. Learn indica que, con orquestación generativa, el agente puede generar por su cuenta la pregunta para un dato de entrada que falta ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/advanced-generative-actions)): si alguien pregunta "¿qué nivel tiene mi compra?" sin dar el importe, el agente se lo pedirá.
2. Abre el panel de detalles del topic (**Details**), pestaña **Inputs**, y crea la variable `Importe` ([Learn: entradas y salidas de topics](https://learn.microsoft.com/microsoft-copilot-studio/advanced-managing-topic-inputs-outputs)):
   - **Identify as**: **Number**.
   - **How will the agent fill this input?**: deja **Dynamically fill with the best option**.
   - Descripción: `Importe total de la compra en USD.`
3. Revisa las fórmulas de `Nivel` y `Aprobadores`: deberían volver a resolver con `Topic.Importe`, que ahora es la entrada. Si siguen en rojo, vuelve a elegir `Topic.Importe` en ellas. Si la interfaz renombró la entrada (por ejemplo, `Importe1`), usa ese nombre.
4. **Las salidas.** `Nivel` y `Aprobadores` ya existen como variables del topic. Selecciona cada una para abrir **Variable properties** y marca **Return values to original topics**. Learn indica que así aparecen en el nodo Redirect como variables de salida ([Learn: variables](https://learn.microsoft.com/microsoft-copilot-studio/authoring-variables)). Si tu versión muestra la pestaña **Outputs** con su descripción, añádela allí también.
5. **Save** y prueba en una sesión nueva: `¿Qué nivel tiene una compra de 4200 USD?` (nivel 2), y luego `¿Qué nivel tiene mi compra?` (te debe pedir el importe).

> **Por qué entradas y no una pregunta:** una pregunta se hace siempre que el topic se ejecuta. Una entrada, en cambio, puede llegar ya rellena: el orquestador la saca del mensaje, u otro topic se la pasa con un Redirect (Ejercicio 3). Es la diferencia entre un formulario y una función.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Respuesta a "¿Qué nivel tiene mi compra?" (copia la pregunta que generó el agente) | ___ |
| Variables que marcaste como salida, con su tipo | ___ |

---

## Ejercicio 3 — El topic `Revisar compra` y el Redirect

**Objetivo:** un topic que junta las entidades, la entrada del importe y el topic reutilizable.

1. **Topics** > **Add a topic** > **From blank**. Nombre: `Revisar compra`. Descripción del desencadenador (**The agent chooses**):

```text
Revisa una compra antes de pedirla: reconoce la categoría, el importe y el proveedor, calcula el nivel de aprobación y dice si necesita la revisión de TI. Úsalo cuando el usuario quiera revisar o planear una compra sin registrarla todavía.
```

2. **Inputs**: crea `Importe` (**Identify as** **Number**, **Dynamically fill with the best option**, descripción `Importe total de la compra en USD.`).
3. **La categoría y el proveedor van con preguntas, no como entradas.** Learn lo dice así: con la orquestación generativa, los topics y las herramientas "todavía no admiten entidades personalizadas (listas cerradas y regex) como parámetros de entrada" ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/advanced-generative-actions)). Agrega:
   - **Ask a question**: `¿Qué categoría tiene la compra?`. En **Identify**, elige tu entidad `CategoriaCompra`. Guarda la respuesta en `Categoria`.
   - **Ask a question**: `¿Cuál es el código del proveedor? (formato PRV-000)`. En **Identify**, `CodigoProveedor`. Guarda la respuesta en `Proveedor`.
4. **+** > **Topic management** > **Go to another topic** > `Calcular nivel de aprobación` ([Learn: gestionar topics](https://learn.microsoft.com/microsoft-copilot-studio/authoring-topic-management)). Con **Add input**, pasa `Importe` = `Topic.Importe`. La salida `Nivel` aparece en el nodo Redirect como variable de salida: guárdala en `NivelCompra`.
5. **+** > **Add a condition**. En la primera rama, menú **…** del nodo > **Change to formula**, y en el valor, la flecha **>** > pestaña **Formula**. Escribe la fórmula y **Insert**:

```text
Text(Topic.Categoria) = "Tecnología" && Topic.NivelCompra >= 2
```

   Mensaje en esa rama: `Además, como es Tecnología de nivel {Topic.NivelCompra}, la revisa TI en paralelo con Finanzas.` En **All other conditions**: `No necesita revisión de TI.`

   `Text(...)` convierte el valor de la entidad (Learn indica que una entidad propia se guarda como tipo **Choice**) en texto para compararlo, igual que en el Módulo 15. La regla sale de la sección 4 del manual. **Comprueba en el panel Variables qué texto guarda `Categoria`** tras una prueba: si no es exactamente `Tecnología` (con tilde), ajusta la fórmula a lo que veas. Otra opción es una condición sin fórmula: `Categoria` **is equal to** el valor `Tecnología` de la entidad, y dentro otra con `NivelCompra` mayor o igual que 2.
6. Al final, **Send a message**: `Compra revisada: {Topic.Categoria}, {Topic.Importe} USD, proveedor {Topic.Proveedor}.` **Save**.

> **Vas a ver dos mensajes sobre el nivel, o más:** el de `Calcular nivel de aprobación` y el de `Revisar compra`, y quizá una respuesta propia del orquestador. Es lo esperado, porque el topic llamado sigue teniendo su **Send a message**. Learn recomienda que un topic reutilizable devuelva su resultado como salida y deje el mensaje a quien lo llama. Decide dónde debe vivir ese mensaje y anótalo: es una decisión de diseño, no un error.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Fórmula de la condición, como la dejaste | ___ |
| Nombre de la variable de salida del Redirect | ___ |

---

## Ejercicio 4 — Una variable global y las de sistema

**Objetivo:** que el agente recuerde un dato durante toda la conversación y sepa qué información trae ya cada turno.

1. En `Revisar compra`, justo debajo del desencadenador, agrega **Ask a question**: `¿De qué área eres?`, con **Identify** = **Multiple choice options** y las seis áreas de SIT (Comercial, Finanzas, TI, Operaciones, Talento humano, Servicios). Guarda la respuesta en `AreaSolicitante`.
2. Selecciona la variable para abrir **Variable properties** y cambia el alcance a **Global (any topic can access)**. Learn indica que una variable global se crea cambiando el alcance de una variable de topic, que recibe el prefijo `Global.` y que, por defecto, conserva su valor hasta que termina la sesión ([Learn: variables globales](https://learn.microsoft.com/microsoft-copilot-studio/authoring-variables-bot)). Después, en las propiedades del nodo de pregunta (**…** > **Properties**), busca el comportamiento de salto (**Skip behavior**) y deja que la pregunta se salte si la variable ya tiene valor ([Learn: nodo Question](https://learn.microsoft.com/microsoft-copilot-studio/authoring-ask-a-question)). Si tu versión no muestra esa opción, pon la pregunta dentro de una condición `IsBlank(Global.AreaSolicitante)`: ahora que la variable existe, la fórmula ya no da error. Para mover el nodo, usa **Cut** y **Paste** en la barra de herramientas del lienzo.
3. Agrega el área al mensaje final: `… proveedor {Topic.Proveedor}, para {Global.AreaSolicitante}.`
4. **Variables de sistema** ([Learn: variables](https://learn.microsoft.com/microsoft-copilot-studio/authoring-variables-about)): agrega un último mensaje, `Referencia de la revisión: {System.Conversation.Id}`. Learn define `System.Conversation.Id` como el identificador único de la conversación actual, y `System.Activity.Text` como el último mensaje del usuario. Para usarlas en una fórmula, se antepone `System.`.
5. **Save** y prueba **en la misma sesión**: revisa dos compras seguidas. La primera te pregunta el área; la segunda no. Abre **Nueva sesión de prueba** y revisa otra: vuelve a preguntar.

> **Una variable global no es una memoria entre conversaciones.** Dura lo que la sesión. Recordar entre conversaciones es otra cosa (Memory, del Microsoft Copilot harness, que el harness estándar no tiene; Lab 147).

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| ¿Te preguntó el área en la segunda revisión de la misma sesión? | ___ |
| Valor de `System.Conversation.Id` en dos sesiones distintas (¿cambia?) | ___ |

---

## Ejercicio 5 — El editor de código

**Objetivo:** leer un topic como lo guarda Copilot Studio, para revisar cambios y entender qué hace cada nodo.

1. Abre `Calcular nivel de aprobación`. Arriba a la derecha del lienzo, **More** > **Open code editor**. Learn indica que el editor muestra el topic en **YAML** ([Learn: crear y editar topics](https://learn.microsoft.com/microsoft-copilot-studio/authoring-create-edit-topics)).
2. Busca en el YAML tu fórmula `If(Topic.Importe <= 1000, …)` y el texto de `Aprobadores`. Anota con qué clave aparece cada nodo y dónde están las entradas y las salidas.
3. En el YAML, dentro del `Switch`, cambia la cadena exacta `"el jefe de área"` (con las comillas: es la única así; las otras dos contienen más texto) por `"solo el jefe de área"`. **Save**, vuelve al lienzo y comprueba que el cambio está en el nodo.
4. Prueba con 500 USD.

> **Úsalo para leer y para cambios pequeños.** Learn advierte que no es del todo compatible diseñar un topic entero en el editor de código ni pegar topics complejos. Ver el YAML sirve para revisar cambios y, en el Lab 153, para entender qué guarda Git.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Clave del YAML que contiene la fórmula del nivel (probablemente un `value: =If(...)` dentro de un nodo de tipo `SetVariable`) | ___ |
| ¿Se vio el cambio del paso 3 en el lienzo? | ___ |

---

## Ejercicio 6 — Probar con seis mensajes

**Objetivo:** comprobar el topic con mensajes reales, incluidos los que deberían fallar.

1. **Antes de empezar, protege los datos.** La herramienta `Registrar solicitud de compra` registra sin pedir confirmación (Lab 144). Si un mensaje acaba en ella, crearía filas reales (y aprobaciones, si sigue activo el flujo del Lab 128). Mientras haces este ejercicio, desactiva la herramienta en **Tools**, o no le des el correo si te lo pide.
2. Abre `lab145/mensajes-prueba.json`. Todos los mensajes empiezan por "Antes de pedirla, revisa esta compra" para que el agente elija `Revisar compra`. Haz cada uno en una **sesión nueva** y llena la tabla. En las columnas de categoría, importe y proveedor, escribe el valor que reconoció el agente o "preguntó". En cada sesión te preguntará el área (Ejercicio 4): contesta siempre `Operaciones`. Cuando pregunte algo que falta (M5), usa los datos de M3.

| Id | Mensaje | Categoría esperada | Importe | Proveedor | Nivel | ¿TI? |
|---|---|---|---|---|---|---|
| M1 | Antes de pedirla, revisa esta compra: tecnología por 4200 USD con el proveedor PRV-001 | Tecnología | 4200 | PRV-001 | 2 | Sí |
| M2 | Antes de pedirla, revisa esta compra: unos portátiles por 900 dólares | Tecnología (sinónimo) | 900 | lo pregunta | 1 | No |
| M3 | Antes de pedirla, revisa esta compra: sillas por 2500 USD | Mobiliario (sinónimo) | 2500 | lo pregunta | 2 | No |
| M4 | Antes de pedirla, revisa esta compra: una auditoría de 12000 USD, proveedor prv-009 | Servicios profesionales | 12000 | PRV-009 (o prv-009: la regex guarda lo que se escribió) | 3 | No |
| M5 | quiero revisar una compra antes de pedirla | lo pregunta | lo pregunta | lo pregunta | 2 (con los datos de M3) | No |
| M6 | Antes de pedirla, revisa esta compra: tecnologia por 1000 USD con PRV-01 | Tecnología (sin tilde) | 1000 | `PRV-01` no vale: lo vuelve a pedir | 1 | No |

3. **Observa qué datos te volvió a preguntar.** El importe es una entrada del topic y el orquestador debería tomarlo del mensaje. La categoría y el proveedor salen de preguntas con entidad, y el agente puede saltarse la pregunta si ya reconoce el valor en el mensaje (slot filling, Módulo 15). Learn no detalla cómo se combina eso con la orquestación generativa: **anota lo que pasó en cada caso**.
4. En M6, `PRV-01` no cumple el patrón, así que el agente no lo reconoce y te hace la pregunta del proveedor. **Contesta otra vez `PRV-01`** para ver la repregunta. Learn indica que, por defecto, la pregunta se repite hasta 2 veces y que, si sigue sin un valor válido, la acción por defecto es **Escalate**, que lleva al topic de sistema de escalado ([Learn: nodo Question](https://learn.microsoft.com/microsoft-copilot-studio/authoring-ask-a-question)). Anota cuántas veces repreguntó y qué pasó al final. Si prefieres que siga sin proveedor, cambia en las propiedades de la pregunta la acción a dejar la variable vacía.
5. En M1, mira en el **mapa de actividad** qué se ejecutó. Que aparezca `Calcular nivel de aprobación` como paso aparte, al llamarlo con Redirect, no está comprobado: anota lo que veas.

> **Si un mensaje activó otra pieza** (por ejemplo, M1 fue a `Calcular nivel de aprobación`, al conocimiento o a la herramienta), compara las descripciones. Recuerda además que las instrucciones del Lab 144 dicen "usa el tema Calcular nivel de aprobación": puedes añadir una línea que remita a `Revisar compra` cuando el usuario quiera revisar una compra. "Revisar una compra" y "calcular el nivel" se parecen. Learn advierte que el agente puede no distinguir entre topics cuyas intenciones se parecen mucho. El Lab 147 trata justo eso.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Mensajes con todos los valores correctos (de 6) | ___ |
| Datos que te volvió a preguntar aunque estaban en el mensaje | ___ |
| Qué hizo con `PRV-01` (repreguntas y final) | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| No puedes elegir `CategoriaCompra` como tipo de una entrada del topic | Con orquestación generativa, las entidades personalizadas no se admiten como entradas | Usa una pregunta con la entidad (Ejercicio 3, paso 3) |
| "portatiles" no se reconoce como Tecnología | **Smart matching** apagado o el sinónimo falta | Ejercicio 1, paso 2 |
| La condición da error de tipos | Se comparó la entidad con un texto sin `Text(...)` | `Text(Topic.Categoria) = "Tecnología"` |
| El Redirect no muestra la salida `Nivel` | La salida no está definida en **Outputs** del topic llamado, o no se guardó | Ejercicio 2, paso 4 |
| El área se pregunta en cada revisión | La variable quedó con alcance de topic | Ejercicio 4, paso 2: **Global** |
| Las fórmulas del topic de nivel dan error tras borrar la pregunta | La variable `Importe` desapareció con el nodo | Vuelve a elegir `Topic.Importe` (la entrada) |

## Checklist final

- [ ] Entidades `CategoriaCompra` (con sinónimos y **Smart matching**) y `CodigoProveedor` (`(?i)\bPRV-\d{3}\b`)
- [ ] `Calcular nivel de aprobación` con la entrada `Importe` y las salidas `Nivel` y `Aprobadores`, sin nodo de pregunta
- [ ] `Revisar compra` con dos preguntas con entidad, Redirect con entrada y salida, y la regla de TI
- [ ] `Global.AreaSolicitante` que se pregunta una vez por sesión
- [ ] Un cambio hecho desde el editor de código
- [ ] Los seis mensajes evaluados

## Evidencia esperada

- Captura de las dos entidades
- Captura de las pestañas **Inputs** y **Outputs** de `Calcular nivel de aprobación`
- Captura del topic `Revisar compra` completo
- Fragmento del YAML con la fórmula del nivel
- Tu tabla de los seis mensajes

## Criterios de aprobación

- M1, M3 y M4 dan el nivel y la decisión de TI correctos
- `PRV-01` no se acepta como código de proveedor
- La segunda revisión de una misma sesión no pregunta el área
- Sabes explicar por qué la categoría va en una pregunta y el importe en una entrada

## Competencias desarrolladas

- Crear entidades de lista cerrada y regex, y saber qué no comprueban
- Diseñar topics reutilizables con entradas y salidas, y llamarlos con Redirect
- Elegir el alcance de una variable (topic, global, sistema)
- Leer y cambiar un topic en YAML

## Reto adicional

**Reto básico:** haz que `Revisar compra` avise si el proveedor es `PRV-005` o `PRV-014`, los dos inactivos de `proveedores.csv` (datos de SIT Compras). Pista: una condición con `Text(Topic.Proveedor)`. ¿Qué pasa el día que se dé de baja otro? (Por eso es trabajo de una herramienta.)

**Reto intermedio:** marca `Global.AreaSolicitante` para que la pueda rellenar el canal (**External sources can set values**). Learn sitúa esa opción en un nodo **Set variable value**, dentro de un topic dedicado. Anota en qué caso real te serviría.

**Reto avanzado:** haz que `Revisar compra` termine ofreciendo registrar la compra con la herramienta del Lab 144. ¿Qué datos le faltan a la herramienta que el topic no tiene?

## Preguntas de repaso

1. ¿Por qué la categoría se recoge con una pregunta y no como entrada del topic?
2. ¿Qué gana `Calcular nivel de aprobación` al tener entradas y salidas?
3. ¿Cuánto dura el valor de una variable global?
4. ¿Qué comprueba una entidad regex y qué no?

## Limpieza del laboratorio

No borres nada: los Labs 146 y 147 parten de este agente.

## Siguiente laboratorio recomendado

**Lab 146 — Conocimiento que responde bien**: versiones del manual, una fuente web, Dataverse como conocimiento, moderación y medición con preguntas.

---
id: lab-148
title: "Herramientas: agent flow que valida, conector con confirmación y API REST del catálogo (Ruta Pro Copilot Studio)"
level: "N3"
duration: 290
product: ["Copilot Studio", "Power Automate", "Dataverse"]
certifications: []
role: ["Agent builder", "Desarrollador"]
prerequisites:
  - "Lab 147 terminado: el agente Asistente de compras SIT con la herramienta Registrar solicitud de compra"
  - "Ambiente del curso con una prueba de Copilot Studio activa (no hacen falta créditos)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 148 — Herramientas: agent flow que valida, conector con confirmación y API REST del catálogo

## Objetivo

Darle al `Asistente de compras SIT` herramientas de verdad, y que fallen bien. Vas a hacer que el agent flow del Lab 144 **valide** los datos antes de escribir y devuelva un mensaje útil cuando algo no cuadra. Vas a añadir una herramienta de **conector** (Office 365 Outlook) que pide **confirmación** antes de enviar. Vas a conectar el agente a una **API REST** con una especificación **OpenAPI**: el catálogo de productos de SIT. Al final mides qué herramienta elige el agente con siete mensajes y decides, en papel, dónde iría un prompt.

## Escenario de negocio

El piloto funciona, pero Compras ve tres problemas. El agente registró una compra de 20 USD que debía pagarse con la caja menor. Los empleados preguntan precios que el agente no sabe, aunque están en el catálogo. Y cuando algo es urgente, nadie avisa a Compras. Tu tarea: que la herramienta de registro rechace lo que no cumple la política, que el agente consulte el catálogo y que pueda avisar a Compras, pero solo si el usuario lo confirma.

## Lo que vas a construir

- El agent flow `ACS - Registrar solicitud de compra` con cinco validaciones y dos salidas nuevas, `Resultado` y `Mensaje`
- La herramienta `Avisar a Compras` (Office 365 Outlook) con **Ask the end user before running**
- La herramienta `Catálogo SIT`, creada desde una especificación OpenAPI 2.0
- Una tabla de siete mensajes con la herramienta que eligió el agente
- Una decisión escrita sobre el prompt tool (en papel)

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Un agent flow que valida antes de escribir | 100 min |
| Ejercicio 2 — Qué responde el agente después de la herramienta | 30 min |
| Ejercicio 3 — Un conector que pide confirmación | 40 min |
| Ejercicio 4 — Una API REST con OpenAPI | 60 min |
| Ejercicio 5 — Siete mensajes y el prompt tool en papel | 60 min |
| **Total** | **unas 4 h 50 min** |

## Nivel

**N3 Avanzado** — Ruta Pro Copilot Studio (competencia profesional alineada con el examen AB-620)

## Tecnologías utilizadas

- Copilot Studio (harness estándar con orquestación generativa): herramientas de agent flow, de conector y de API REST, **Inputs**, **Completion**, **Ask the end user before running**, autenticación de la herramienta
- Power Automate: agent flows con variables, condiciones y expresiones
- OpenAPI 2.0 (Swagger)

## Prerrequisitos

### Entorno

- [ ] El agente `Asistente de compras SIT` de los labs 144 a 147, en el ambiente del curso, con la prueba de Copilot Studio activa.
- [ ] El agent flow `ACS - Registrar solicitud de compra` del [Lab 144](/labs/lab-144-copilot-studio-en-un-dia) (Ejercicio 5), publicado y añadido como herramienta.
- [ ] Un buzón de Office 365 Outlook en tu cuenta del curso (el mismo que usaste en la Ruta Pro Power Automate, si la hiciste).
- [ ] El paquete [asistente-compras.zip](/practice-assets/copilotstudio/asistente-compras/asistente-compras.zip) descargado de nuevo (versión con la carpeta `lab148/`). Usas `casos-validacion.json`, `mensajes-herramientas.json` y `catalogo-sit-openapi.json`.

> **No gastas créditos.** Learn indica que, en el panel de prueba, la actividad del propio agente (incluidas sus acciones) no consume Copilot Credits, y que las ejecuciones de agent flows que lanza el agente desde el chat de prueba no consumen capacidad ni se bloquean ([FAQ de facturación](https://learn.microsoft.com/microsoft-copilot-studio/faq-billing-licensing), [mensajes y créditos](https://learn.microsoft.com/microsoft-copilot-studio/requirements-messages-management)). Para la herramienta REST, Learn no lo dice expresamente: se deduce de que es una acción del agente. **La excepción son los prompts** (Ejercicio 5): por eso ese tool va en papel.

> **Etiquetas:** este lab da los nombres en inglés, como Learn. Si tu interfaz está en español, busca el equivalente; las etiquetas en español de estas pantallas no se han comprobado.

### Conocimiento previo

- [Lab 134](/labs/lab-134-power-automate-integracion-con-apis) (HTTP, paginación y esquema JSON), si hiciste la Ruta Pro Power Automate. No es obligatorio.
- [Lab 147](/labs/lab-147-copilot-studio-orquestacion-y-harness): cómo elige el orquestador entre piezas por su descripción.

---

## Ejercicio 1 — Un agent flow que valida antes de escribir

**Objetivo:** que la herramienta de registro no confíe en lo que le pasa el agente. El orquestador extrae los datos de la conversación, y puede equivocarse o recibir datos absurdos. La política vive en el flujo, no en las instrucciones.

**Las cinco reglas** (salen del manual de compras y de la tabla del Lab 128):

| Regla | Si no se cumple, `Mensaje` dice |
|---|---|
| `Cantidad` es un entero de 1 o más | La cantidad debe ser un número entero mayor que 0. |
| `PrecioUnitario` es mayor que 0 | El precio unitario debe ser mayor que 0 USD. |
| `Categoria` es una de las seis | La categoría debe ser una de estas: Tecnología, Mobiliario, Servicios profesionales, Capacitación, Viajes, Papelería. |
| `CorreoSolicitante` tiene forma de correo | El correo del solicitante no es válido. |
| El importe es mayor que 50 USD (si todo lo anterior está bien) | Una compra de {importe} USD se paga con la caja menor del área (hasta 50 USD): no necesita solicitud. |

### Tarea 1.1 — Variables y validaciones

1. Abre `ACS - Registrar solicitud de compra` en el diseñador (desde **Tools** en el agente, o desde la página del flujo en Copilot Studio).
2. Justo debajo del desencadenador **When an agent calls the flow**, agrega tres **Initialize variable**:
   - `Errores`, **Type** **Array**, **Value** `[]`
   - `Resultado`, **String**, **Value** `RECHAZADA`
   - `Mensaje`, **String**, sin valor
3. Deja `Calcular importe` y `Calcular nivel` donde están (después de las variables).
4. Agrega cuatro **Condition**, una detrás de otra. En cada una, la rama **True** lleva un **Append to array variable** sobre `Errores` con el texto de la tabla. Escribe cada condición como expresión (**fx**) y compárala con `true`. Elige las entradas desde **Dynamic content** dentro del editor: los nombres internos (`number`, `text_2`…) dependen del orden en que las creaste en el Lab 144.

| Condición | Expresión (cámbiale los nombres internos por los tuyos) |
|---|---|
| Cantidad mala | `or(less(triggerBody()?['number'], 1), contains(string(triggerBody()?['number']), '.'))` |
| Precio malo | `lessOrEquals(triggerBody()?['number_1'], 0)` |
| Categoría mala | `not(contains(createArray('Tecnología','Mobiliario','Servicios profesionales','Capacitación','Viajes','Papelería'), triggerBody()?['text_2']))` |
| Correo malo | `not(and(contains(triggerBody()?['text_3'], '@'), contains(last(split(triggerBody()?['text_3'], '@')), '.')))` |

   `contains` sobre un array comprueba si el valor está en la lista. Sobre un texto, comprueba si contiene la subcadena ([Learn: funciones de expresión](https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-functions-reference)). Learn advierte que distingue mayúsculas y minúsculas: si el agente manda `tecnología` o `Tecnologia` (sin tilde), la regla rechaza una categoría válida. Por eso, en el Ejercicio 2 la descripción de la entrada `Categoria` da los seis valores exactos. Si aun así llega mal escrita, míralo en el historial. La regla de la cantidad usa un truco: un decimal como 2,5 se convierte en el texto `2.5`, que contiene un punto. **No está comprobado** cómo llega un 4 entero desde el agente (`4` o `4.0`). Mira el historial de una ejecución y, si llega `4.0`, cambia la regla por `or(less(triggerBody()?['number'], 1), not(equals(mod(triggerBody()?['number'], 1), 0)))`, que mantiene la comprobación de "1 o más". **Tampoco está comprobado** que `mod` acepte decimales: si da error, anótalo.

5. Una quinta **Condition** para la caja menor: `and(empty(variables('Errores')), lessOrEquals(outputs('Calcular_importe'), 50))`. En **True**, **Append to array variable** con la expresión:

```text
concat('Una compra de ', string(outputs('Calcular_importe')), ' USD se paga con la caja menor del área (hasta 50 USD): no necesita solicitud.')
```

### Tarea 1.2 — Registrar solo si no hay errores

6. Una última **Condition**: `empty(variables('Errores'))` igual a `true`.
   - **True:** mueve aquí la acción **Add a new row** del Lab 144 (arrástrala; si tu diseñador no deja, bórrala y vuelve a crearla igual). Después, **Set variable** `Resultado` = `OK` y **Set variable** `Mensaje` = expresión `concat('Solicitud registrada. Importe: ', string(outputs('Calcular_importe')), ' USD. Nivel de aprobación: ', string(outputs('Calcular_nivel')), '.')`.
   - **False:** **Set variable** `Mensaje` = expresión `join(variables('Errores'), ' ')`.
7. En **Respond to the agent** (fuera de las condiciones, al final), agrega dos salidas de **Text**: `Resultado` = la variable `Resultado` y `Mensaje` = la variable `Mensaje`. Cambia `Importe` y `Nivel` para que vayan vacíos cuando se rechaza; si no, el agente podría decir "importe 20, nivel 1" de una compra que no se registró:
   - `Importe` = `if(equals(variables('Resultado'), 'OK'), string(outputs('Calcular_importe')), '')`
   - `Nivel` = `if(equals(variables('Resultado'), 'OK'), string(outputs('Calcular_nivel')), '')`

> **Por qué una sola respuesta al final:** el agente necesita siempre las mismas salidas, haya error o no. Con una sola **Respond to the agent** después de las condiciones no hay ramas que se queden sin responder. Learn exige que el flujo responda en menos de 100 segundos; si no, la herramienta falla con `FlowActionTimedOut` ([Learn: códigos de error](https://learn.microsoft.com/troubleshoot/power-platform/copilot-studio/authoring/error-codes)). Validar es rápido: no pasa de ahí.

8. **Save** y **Publish**. Learn indica que los cambios de un agent flow necesitan publicarse para que el agente use la versión nueva ([Learn: usar flujos en el agente](https://learn.microsoft.com/microsoft-copilot-studio/advanced-use-flow)).

### Tarea 1.3 — Probar los ocho casos

9. Abre `lab148/casos-validacion.json`. Prueba el flujo directamente con cada caso: en el diseñador, **Test** > **Manually**, y escribe las entradas. Si tu diseñador no deja probar a mano este desencadenador, hazlo desde el panel de prueba del agente con un mensaje que dé los datos exactos (por ejemplo, para V2: "Registra 0 monitores para TI, categoría Tecnología, a 320 USD, título Monitores sin cantidad, correo ana.ruiz@sit.example.com"). Puede que el propio agente se niegue antes de llamar a la herramienta. Anota quién paró el caso, el agente o el flujo.

| Caso | Datos clave | `Resultado` esperado | `Mensaje` (resumen) |
|---|---|---|---|
| V1 | 4 × 210, Mobiliario | OK | Registrada, 840 USD, nivel 1 |
| V2 | cantidad 0 | RECHAZADA | cantidad |
| V3 | cantidad 2,5 | RECHAZADA | cantidad |
| V4 | precio −10 | RECHAZADA | precio |
| V5 | categoría "Juguetes" | RECHAZADA | categoría |
| V6 | 10 × 2 = 20 USD | RECHAZADA | caja menor |
| V7 | correo "ana.ruiz" | RECHAZADA | correo |
| V8 | cantidad 0 y "Juguetes" | RECHAZADA | cantidad y categoría (los dos mensajes) |

10. Comprueba en Power Apps que solo V1 creó una fila. Bórrala si no la quieres conservar.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Casos que dieron el resultado esperado (de 8) | ___ |
| ¿Llegó un entero como `4` o como `4.0`? ¿Cambiaste la regla? | ___ |
| Casos que paró el agente antes de llamar al flujo | ___ |

---

## Ejercicio 2 — Qué responde el agente después de la herramienta

**Objetivo:** controlar lo que el usuario ve cuando la herramienta termina, sobre todo cuando rechaza.

1. En el agente, **Tools** > `Registrar solicitud de compra`. Cambia la descripción para que el orquestador sepa leer las salidas nuevas:

```text
Registra en el sistema de SIT una solicitud de compra nueva. Úsala solo cuando el usuario pida crear o registrar una solicitud. Necesita título, área, categoría, cantidad, precio unitario en USD y el correo de quien la pide. Devuelve Resultado (OK o RECHAZADA) y Mensaje. Si Resultado es RECHAZADA, la solicitud NO se registró: explica Mensaje al usuario con tus palabras y ofrécele corregir el dato.
```

   En **Inputs**, abre `Categoria` y escribe en su descripción: `Una de estas seis, escrita exactamente así: Tecnología, Mobiliario, Servicios profesionales, Capacitación, Viajes, Papelería.`
2. Busca la sección **Completion** de la herramienta ([Learn: agregar herramientas](https://learn.microsoft.com/microsoft-copilot-studio/add-tools-custom-agent)). En **After running** hay cuatro opciones: **Don't respond** (la predeterminada), **Write the response with generative AI**, **Send specific response** y **Send an adaptive card**.
3. Prueba el caso V6 (las grapas) desde el chat con dos opciones:
   - **Don't respond:** Learn la describe así: el agente incluye la salida de la herramienta en su propia respuesta. Es decir, el orquestador decide qué decir con las salidas. Learn añade que conviene usar **Don't respond** solo cuando la herramienta ya envió el mensaje que ve el usuario.
   - **Send specific response:** primero un texto fijo, `Listo, lo revisé.`; después, el mismo texto con la salida `Mensaje` insertada (Learn indica que esta opción admite variables de salida y Power Fx).
4. Anota qué vio el usuario en cada caso. Learn advierte que, con **Write the response with generative AI**, los enlaces pueden no conservarse.

> **La decisión:** un texto fijo sin variables dice lo mismo si se registró que si se rechazó. Con `Mensaje` insertado, la respuesta es exacta y predecible, pero suena igual siempre y no ofrece corregir el dato. Dejar que responda el orquestador se adapta a la conversación, pero depende de que la descripción explique bien las salidas. Elige y justifícalo.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Qué vio el usuario en V6 con **Don't respond** | ___ |
| Qué vio con **Send specific response**, sin y con `Mensaje` | ___ |
| Opción que dejas y por qué | ___ |

---

## Ejercicio 3 — Un conector que pide confirmación

**Objetivo:** una herramienta con efectos fuera del agente (un correo) que no se ejecuta sin el sí del usuario.

1. **Tools** > **Add a tool** > **Connector**. Busca **Office 365 Outlook** > **Send an email (V2)** y agrégala ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/add-tools-custom-agent)). Si te pide una conexión, créala con tu cuenta.
2. Nombre: `Avisar a Compras`. Descripción:

```text
Envía un aviso por correo al área de Compras sobre una solicitud ya registrada, por ejemplo porque es urgente. Úsala solo cuando el usuario pida avisar o escribir a Compras. No la uses para registrar solicitudes.
```

3. **Inputs** ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/add-tools-custom-agent)):
   - **To**: **Fill using** **Custom value** = tu propio correo. En la vida real sería `compras@sit.example.com`, pero ese dominio no existe y el correo rebotaría. Así el usuario no puede cambiar el destinatario.
   - **Subject** y **Body**: déjalos en **Dynamically fill with AI**, con descripciones: `Asunto breve con el título de la solicitud y la palabra URGENTE si lo es` y `Mensaje para Compras: qué solicitud es y por qué escribe el usuario`.
4. En **Details**, pon **Ask the end user before running** en **Yes**. Por defecto está en **No**.
5. En **Details** > **Authentication** verás dos opciones: **End user** (la predeterminada) y **Maker-provided**. Learn las define así: con las credenciales del usuario, cada uno obtiene solo los datos que puede ver; con las del autor, la herramienta usa las tuyas. Déjala en **End user**: el correo debe salir del buzón de quien lo pide. En el panel de prueba no notarás la diferencia, porque el usuario eres tú. El Lab 150 vuelve sobre esto. Puede que, antes de la confirmación, el agente te pida conectar o autorizar tu cuenta de Outlook: eso es la conexión del usuario, no la confirmación del paso 4. **No está comprobado** cómo se ve en el panel: anótalo aparte.
6. **Completion**: **Send specific response** = `Listo, avisé a Compras.` **Save**.
7. Prueba T6 de `lab148/mensajes-herramientas.json`: `Avisa a Compras de que la solicitud de las diademas es urgente`. El agente debe pedirte confirmación antes de enviar. Responde que no la primera vez y que sí la segunda. Revisa tu bandeja de entrada.

> **¿Cuándo pedir confirmación?** Cuando la herramienta hace algo que no se deshace o que ven otras personas: enviar, registrar, aprobar, borrar. Para leer (consultar el catálogo) no hace falta, y preguntar cansa. ¿Y `Registrar solicitud de compra`? El Lab 149 resuelve esa confirmación con un resumen en el topic; aquí podrías activar la misma opción. Anota cuál preferirías y por qué.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Texto exacto con el que el agente pidió confirmación | ___ |
| ¿Se envió el correo al decir que no? | ___ |
| Asunto del correo que llegó | ___ |

---

## Ejercicio 4 — Una API REST con OpenAPI

**Objetivo:** conectar el agente a un servicio que no tiene conector: el catálogo de productos de SIT, publicado como archivos JSON por este curso.

> **Herramienta en preview.** Learn marca la herramienta REST API como **preview**, no recomendada para producción, y pide credenciales de autor y licencia de Copilot Studio ([Learn: herramienta REST API](https://learn.microsoft.com/microsoft-copilot-studio/agent-extend-action-rest-api)). Si la opción no aparece o tu prueba no la permite, haz el ejercicio en papel: lee la especificación y responde la validación.

1. Abre `lab148/catalogo-sit-openapi.json` en un editor. Es una especificación **OpenAPI 2.0** (Swagger). Learn pide JSON en versión 2. Si le das una versión 3, la traduce sola a la 2. Localiza:
   - `host` y `basePath`: dónde vive la API. Pega en el navegador `https://planestudio.vercel.app/practice-assets/powerautomate/sit-compras/catalogo/pagina-1.json` y mira la respuesta.
   - La operación `ObtenerPaginaCatalogo`, con su `description` y su parámetro `pagina` (1 a 3).
   - `definitions`: el esquema de un producto. Las descripciones de cada campo le dicen al agente qué significa `Activo`.
2. En el agente, **Tools** > **Add a tool** > **New tool** > **REST API** (si no aparece, búscala en **See all**). Sube el archivo. En **Description**: `Catálogo de productos de SIT: nombre, categoría, precio en USD y si está activo. Úsala para consultar precios o si un producto se puede pedir.` Elige la solución `SIT Asistente Compras`.
3. **Authentication**: **None**. La API es pública y de solo lectura. Learn admite también **API key** (con **Parameter label**, **Parameter name** y **Parameter location**) y OAuth 2.0.
4. Elige la operación. En ese mismo paso pones el nombre de la herramienta, `Catálogo SIT`, y su descripción. En **Review your tool's parameters**, revisa que cada parámetro y cada campo de la respuesta tenga descripción: Learn indica que no deja avanzar con descripciones vacías. **Create connection**. Después vuelve a **Add a tool**, elige `Catálogo SIT`, su conexión y **Add and configure**. **Save**.
5. **Si la importación falla por la ruta** `/catalogo/pagina-{pagina}.json` (un parámetro dentro del nombre del archivo), usa `lab148/catalogo-sit-openapi-tres-operaciones.json`: es la misma API con una operación por página, sin parámetros. **No está comprobado** cuál de las dos acepta Copilot Studio: anota cuál usaste.
6. Prueba T1, T2 y T3 en sesiones nuevas:
   - T1: el monitor de 27" cuesta **320 USD** (CAT-002, página 1).
   - T2: el producto más barato de Papelería es la **Caja de grapas, 2 USD** (CAT-039). Papelería está repartida entre las páginas 2 y 3, así que el agente tiene que pedir más de una.
   - T3: la consultoría de procesos (CAT-018) está **inactiva**: no se puede pedir.
7. En el **mapa de actividad**, cuenta cuántas veces llamó a la herramienta en T2 y con qué valor de `pagina`.

> **Lo que una API estática no hace:** filtrar. Esta API solo devuelve páginas enteras, y el agente lee 41 productos para encontrar uno. Una API real tendría `?categoria=Papelería` o `?q=monitor`. Si la diseñaras tú, ¿qué parámetro añadirías primero? (Pista: mira T2.)

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Especificación que aceptó Copilot Studio (con parámetro o tres operaciones) | ___ |
| Respuestas a T1, T2 y T3 | ___ |
| Llamadas a la herramienta en T2 y páginas pedidas | ___ |
| ¿Creó la herramienta un conector personalizado en la solución? (míralo en Power Apps > **Solutions**) | ___ |

---

## Ejercicio 5 — Siete mensajes y el prompt tool en papel

**Objetivo:** comprobar que, con cuatro herramientas, el agente elige bien, y decidir dónde iría un prompt.

### Tarea 5.1 — ¿Qué herramienta elige?

1. Haz los siete mensajes de `lab148/mensajes-herramientas.json`, cada uno en una **sesión nueva**, y mira el mapa de actividad. Learn indica que el orquestador elige la herramienta por su nombre, su descripción, sus entradas y salidas, y por lo que ya usó en la conversación ([Learn](https://learn.microsoft.com/microsoft-copilot-studio/add-tools-custom-agent)).

| Id | Herramienta esperada | ¿Acertó? | Resultado |
|---|---|---|---|
| T1 | Catálogo SIT | | 320 USD |
| T2 | Catálogo SIT (varias páginas) | | Caja de grapas, 2 USD |
| T3 | Catálogo SIT | | inactivo |
| T4 | Catálogo SIT y luego Registrar | | 170 USD, nivel 1 |
| T5 | Registrar (y rechaza) | | caja menor, 18 USD |
| T6 | Avisar a Compras (con confirmación) | | pide confirmación |
| T7 | Ninguna herramienta | | nivel 3 |

   En T4 y T5 el agente te pedirá lo que falta (título, correo y, en T5, la categoría): da tu correo, un título cualquiera y, en T5, `Papelería`. T6 va en una sesión nueva sin contexto, así que el agente inventará los detalles del aviso a partir de tu frase: está bien, lo que se mide es la confirmación.
2. T4 tiene dos intenciones: consultar el precio y registrar. En el Lab 147 viste que el agente puede encadenar piezas. Anota si lo hizo y si te pidió el correo.
3. Si alguna falla, corrige la descripción (no las instrucciones) y repite **solo ese mensaje**.

### Tarea 5.2 — El prompt tool, en papel

Compras quiere que el agente clasifique una descripción libre ("necesito algo para sentarme mejor") en una de las seis categorías. Eso es trabajo de un **prompt** (AI Builder). Learn dice tres cosas sobre su coste ([Learn: AI Builder y créditos](https://learn.microsoft.com/ai-builder/message-management)):

- Los Copilot Credits son obligatorios para usar herramientas de IA (AI Builder) en agentes de Copilot Studio.
- Los prompts que se lanzan desde un topic o una acción en el panel de prueba del agente son gratis.
- Los prompts dentro de un **agent flow** consumen créditos siempre, incluso desde el panel de prueba.

Responde por escrito:

1. Escribe el prompt: instrucciones, la entrada `Descripcion` y la salida esperada (una de las seis categorías o `Sin clasificar`).
2. ¿Dónde lo pondrías, en un topic o dentro del agent flow de registro? Justifícalo con el coste.
3. ¿Qué harías sin prompt? (Pista: la entidad `CategoriaCompra` del Lab 145 ya reconoce sinónimos.)

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Mensajes con la herramienta correcta (de 7) | ___ |
| Descripción que cambiaste y mensaje que lo arregló | ___ |
| Dónde pondrías el prompt y por qué | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| El agente sigue registrando la compra de 20 USD | El flujo nuevo no se publicó, o la herramienta usa la versión anterior | **Publish** en el flujo; en **Tools**, quita y vuelve a añadir la herramienta si no ve las salidas nuevas |
| `FlowActionBadRequest` al llamar al flujo | Una entrada o salida de un tipo que no se admite | Learn solo admite Text, Boolean y Number: pasa las fechas como texto |
| El agente dice "registrada" en un caso rechazado | La descripción no explica `Resultado`, o la respuesta fija dice lo mismo siempre | Ejercicio 2, paso 1, y no uses una respuesta fija |
| `Avisar a Compras` envía sin preguntar | **Ask the end user before running** sigue en **No** | Ejercicio 3, paso 4 |
| La herramienta REST no aparece en **New tool** | Está en preview y depende de la licencia | Haz el Ejercicio 4 en papel |
| El flujo falla en una condición con `null` | El agente no rellenó una entrada y `less` o `split` reciben un valor vacío | Marca las entradas como obligatorias o añade `coalesce(..., 0)` / `coalesce(..., '')` en la expresión |
| El agente no encuentra un producto que sí existe | Solo leyó la página 1 | Mejora la descripción: "hay 3 páginas; para buscar puede hacer falta leer varias" |

## Checklist final

- [ ] Agent flow con cinco validaciones, salidas `Resultado` y `Mensaje`, y la fila creada solo si no hay errores
- [ ] Los ocho casos de validación probados
- [ ] **Completion** de la herramienta de registro elegida y justificada
- [ ] `Avisar a Compras` con destinatario fijo y confirmación previa
- [ ] `Catálogo SIT` desde OpenAPI (o el ejercicio en papel)
- [ ] Siete mensajes evaluados y la decisión sobre el prompt

## Evidencia esperada

- Captura del agent flow con las condiciones
- Tu tabla de los ocho casos de validación
- Captura de la confirmación de `Avisar a Compras` y del correo recibido
- Captura del mapa de actividad de T2
- Tu tabla de los siete mensajes y la respuesta escrita sobre el prompt

## Criterios de aprobación

- V1 registra y V2 a V8 se rechazan con el mensaje correcto, sin crear filas
- El correo a Compras no sale sin confirmación
- T1, T2 y T3 se responden con los datos del catálogo
- Sabes explicar por qué la validación va en el flujo y no en las instrucciones

## Competencias desarrolladas

- Diseñar herramientas que validan y devuelven errores que el agente puede explicar
- Configurar entradas fijas y dinámicas, confirmación y autenticación de una herramienta
- Conectar un agente a una API con OpenAPI y leer su especificación
- Medir qué herramienta elige el orquestador y corregir descripciones
- Decidir dónde usar IA generativa según su coste

## Reto adicional

**Reto básico:** añade al agent flow una sexta regla: si `Categoria` es `Viajes`, el título debe contener la ciudad de destino. ¿Cómo la comprobarías sin una lista de ciudades?

**Reto intermedio:** cambia la especificación OpenAPI para que la operación diga que `Activo = false` significa "no se puede pedir" en la descripción de la respuesta, no solo en el esquema. ¿Cambia la respuesta a T3?

**Reto avanzado:** haz que `Registrar solicitud de compra` compruebe el precio contra el catálogo: si el precio unitario difiere más de un 10 % del del catálogo, que lo rechace con un mensaje. ¿Dónde harías la llamada, en el agent flow (con **HTTP**, que es premium) o en el agente (con la herramienta REST)?

## Preguntas de repaso

1. ¿Por qué las reglas de la política van en el agent flow y no en las instrucciones del agente?
2. ¿Qué diferencia hay entre una entrada **Custom value** y una **Dynamically fill with AI**?
3. ¿Cuándo pondrías **Ask the end user before running** en **Yes**?
4. ¿Qué versión de OpenAPI pide Copilot Studio y qué pasa con una v3?
5. ¿Por qué el prompt tool consume créditos dentro de un agent flow aunque lo pruebes en el panel?

## Limpieza del laboratorio

No borres nada: los Labs 149 y 150 parten de este agente y de sus herramientas. Puedes borrar la fila de V1 y los correos de prueba.

## Siguiente laboratorio recomendado

**Lab 149 — Experiencia de conversación**: una Adaptive Card para pedir la compra, confirmación con resumen antes de registrar, mensajes de error útiles y escalado a una persona.

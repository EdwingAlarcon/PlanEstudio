---
id: lab-131
title: "Aprobaciones de verdad: cadenas, todos deben aprobar, respuestas propias, reasignación y escalado (Ruta Pro Power Automate)"
level: "N2"
duration: 270
product: ["Power Automate", "Dataverse", "Microsoft Teams"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado: la solución SIT Compras con el flujo SC - Aprobar solicitud"
  - "Lab 129 recomendado (condiciones y pruebas con valores fijos)"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 131 — Aprobaciones de verdad

## Objetivo

Convertir la aprobación única del Lab 128 en el proceso que dice la política de SIT: **cadenas de aprobación según el nivel**, una etapa donde **todos deben aprobar**, una etapa con **respuestas propias**, qué ocurre cuando alguien **reasigna** y qué ocurre cuando **nadie responde**. Al final, el flujo cumple la política de compras de punta a punta y sabes explicar por qué cada decisión de diseño está donde está.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). En el Lab 128 el flujo calculaba el nivel de cada compra y pedía una sola aprobación, y lo dejaste escrito: "no cumple la política". La política (`politica-aprobacion.json`) dice:

| Nivel | Importe | Aprueban, en este orden |
|---|---|---|
| 1 | hasta 1.000 USD | Jefe de área |
| 2 | hasta 10.000 USD | Jefe de área, y luego **Finanzas** |
| 3 | más de 10.000 USD | Jefe de área, Finanzas, y luego **Gerencia general** |

Además: las compras de **Tecnología** desde el nivel 2 necesitan también la revisión de **TI**, en paralelo con Finanzas; el plazo de respuesta es de **dos días hábiles** y, si vence, la solicitud **escala a la Gerencia general**.

## Lo que vas a construir

- Una copia del flujo de aprobación con **tres etapas condicionales** (jefe, Finanzas y TI, Gerencia) y un resultado único
- La etapa de Finanzas y TI con **Everyone must approve**
- La etapa de Gerencia con **respuestas propias** (`Aprobar`, `Aprobar con condiciones`, `Rechazar`)
- Un **escalado** por vencimiento
- Cuatro casos de prueba (A, E, F y D) más el caso G de escalado, con resultado conocido, y una reasignación observada

## Relación con la Ruta Pro

| Antes | En este lab | Se profundiza en |
|---|---|---|
| Una sola aprobación (**Start and wait for an approval**) | Cadena de etapas con un resultado acumulado | Lab 139 (reto sin pasos) |
| Condición sobre el resultado | Variables de estado y comentarios acumulados | — |
| Sin plazos | **Timeout** y escalado con **Scope** y **Configure run after** | Lab 133 (Try/Catch/Finally y reintentos) |
| Aprobadores escritos a mano | Aprobadores en una sola parte del flujo | Lab 136 (variables de entorno: el mismo mecanismo, con la tolerancia como ejemplo) |

> **Fuente del esqueleto:** el laboratorio de aprobación del curso oficial PL-7002 y el de AB-410T00 ([GitHub, licencia MIT](https://github.com/MicrosoftLearning/PL-7002-Create-and-Manage-Automated-Processes-by-using-Power-Automate)), ambos de una sola aprobación. Las cadenas, el escalado, el caso y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Preparar la copia y los aprobadores | 35 min |
| Ejercicio 2 — Etapa 1: el jefe de área | 35 min |
| Ejercicio 3 — Etapa 2: Finanzas y TI (todos deben aprobar) | 45 min |
| Ejercicio 4 — Etapa 3: Gerencia con respuestas propias | 40 min |
| Ejercicio 5 — Cierre: estado, comentarios y correo | 20 min |
| Ejercicio 6 — Probar los cuatro casos | 45 min |
| Ejercicio 7 — Reasignar | 10 min |
| Ejercicio 8 — Vencimiento y escalado | 40 min |
| Ejercicio 9 (opcional) — La misma decisión en una tarjeta de Teams | 20 min |
| **Total** | **unas 4,5 h** (mejor en dos sesiones: Ejercicios 1 a 5 y 6 a 9) |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Automate: **Approvals** (**Start and wait for an approval**, tipos **First to respond**, **Everyone must approve** y **Custom Responses - Wait for one response**), **Scope**, **Switch**, **Condition**, variables (**Initialize variable**, **Set variable**, **Append to string variable**), **Select**, **Update a row**, **Send an email (V2)**, **Settings** > **Timeout**, **Configure run after**
- Expresiones: `toLower`, `if`, `and`, `equals`, `greaterOrEquals`, `concat`, `join`, `first`, `outputs`, `variables`, `triggerOutputs`
- Opcional: **Microsoft Teams** > **Post adaptive card and wait for a response**

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso con la solución `SIT Compras` y los flujos de los Labs 128 y 129 **activos**
- [ ] Rol **System Administrator** y, para la primera aprobación del ambiente, rol de administrador (ya lo tienes del Lab 128)
- [ ] **Aprobadores de prueba.** Para ver "todos deben aprobar" hacen falta **dos personas distintas**. Lo ideal, si tu cuenta es de un tenant de prueba de Microsoft 365 del que eres administradora global: en su centro de administración crea **dos usuarios de prueba** (por ejemplo `finanzas.sit` y `ti.sit`) y abre un segundo perfil del navegador para responder con ellos. *Sin verificar en Learn:* si un usuario sin licencia de Power Automate puede responder aprobaciones; si no puede, asígnale la prueba. Si tu cuenta es de una empresa y no puedes crear usuarios, pide dos cuentas de prueba o usa la variante. **Variante con una sola cuenta:** asigna todas las etapas a tu propio correo; las cadenas, el orden y los plazos se prueban igual, y de "todos deben aprobar" verás una sola respuesta
- [ ] Teams o correo para recibir las aprobaciones, o el centro de aprobaciones en [make.powerautomate.com](https://make.powerautomate.com) > **Approvals** (**Aprobaciones** > **Recibidas**). La primera aprobación de un ambiente nuevo tardó cerca de 1 minuto en aparecer ahí en una prueba real (el ambiente prepara las tablas de aprobaciones); si no la ves, espera y recarga

### Conocimiento previo

- [Módulo 5](/nivel/basico/modulo/power-automate-automatizacion-basica) y [Módulo 11](/nivel/intermedio/modulo/power-automate-avanzado): **Scope** y manejo de errores
- Lab 128: el flujo `SC - Aprobar solicitud` y la tabla `Solicitudes de compra`, con los valores numéricos de las opciones de `Estado solicitud`

### Verificación rápida antes de empezar

- [ ] Abre `politica-aprobacion.json` y localiza `niveles`, `reglasPorCategoria` y `plazoRespuestaDiasHabiles`
- [ ] Anota los **valores numéricos** de **Pendiente**, **Aprobada** y **Rechazada** (Lab 128, Ejercicio 1)

---

## Ejercicio 1 — Preparar la copia y los aprobadores

**Objetivo:** no tocar el flujo que ya funciona hasta que el nuevo funcione. Y poner cada decisión de negocio en un único sitio.

1. En la solución, abre `SC - Aprobar solicitud` > **Save as** y llama a la copia `SC - Aprobar solicitud (cadena)`. Comprueba que aparece en la solución (si no, **Add existing** > **Automation** > **Cloud flow**). **Apaga** el original ahora: los dos usan el mismo disparador y cada solicitud lanzaría dos procesos. La copia puede quedar **apagada** (*no verificado*): **enciéndela** (**Turn on**) al terminar el Ejercicio 5.
2. En la copia, **elimina** todo lo que está después de la primera **Update a row** (la aprobación, la condición y el correo): lo reconstruirás por etapas. Deja el disparador, `Calcular importe`, `Calcular nivel` y la primera **Update a row** (importe, nivel y **Pendiente**).
3. Antes de la primera acción, o justo después del disparador, añade cuatro **Compose** con el correo de cada aprobador (en una prueba real, los de las cuatro personas; con una sola cuenta, el tuyo cuatro veces): `Aprobador jefe`, `Aprobador finanzas`, `Aprobador TI` y `Aprobador gerencia`. Las etapas los leerán de ahí: cuando cambie una persona, lo cambias en **un** sitio (el Lab 136 los llevará a variables de entorno).
4. Añade una **Compose** `Mapa de estados` con un objeto con **tus** valores numéricos (como en el Lab 130):

```text
{
  "Pendiente": 123450000,
  "Aprobada": 123450001,
  "Rechazada": 123450002
}
```

5. **Variable** > **Initialize variable** dos veces, **al nivel principal del flujo** (Learn: no se puede inicializar una variable dentro de un ámbito, una condición o un bucle): `Resultado` (**String**, valor `Aprobada`) y `Comentario` (**String**, valor vacío).

> **Por qué `Resultado` empieza en `Aprobada`:** la solicitud está aprobada hasta que alguien la rechaza. Cada etapa solo comprueba "¿sigo aprobada?" antes de pedir la siguiente aprobación. Así evitas condiciones anidadas una dentro de otra (tres etapas ya serían tres niveles de sangría; con ocho serían ilegibles).

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| ¿Qué flujo quedó apagado y cuál activo? | ___ |
| Valores numéricos de las tres opciones de `Estado solicitud` | ___ |

---

## Ejercicio 2 — Etapa 1: el jefe de área

**Objetivo:** la primera aprobación y el patrón que repetirán las demás etapas.

1. **Control** > **Scope**, nombre `Etapa 1 Jefe` (el escalado del Ejercicio 8 lo necesita; el ámbito agrupa las acciones y tiene un único estado de éxito o fallo). Dentro:
2. **Approvals** > **Start and wait for an approval** (renómbrala `Aprobacion jefe`) ([Learn: aprobaciones](https://learn.microsoft.com/power-automate/get-started-approvals)):
   - **Approval type**: **Approve/Reject - First to respond**.
   - **Title**: `Etapa 1 (jefe): ` + `Título` + ` — nivel ` + **Outputs** de `Calcular nivel`.
   - **Assigned to**: **Outputs** de `Aprobador jefe`.
   - **Details**: la lista con guiones del Lab 128 (`- Área: …`, categoría, cantidad, precio e importe).
3. Después, **Select** `Comentarios jefe`: **From** = `outputs('Aprobacion_jefe')?['body/responses']`. **Map**: cambia al **modo de texto** (icono a la derecha de **Map**) y escribe solo la expresión, sin clave, de modo que el resultado sea una lista de **textos**, que es lo que necesita `join`: `concat(item()?['responder']?['displayName'], ': ', item()?['comments'])`.

   > **Por qué una `Select` y no `first(...)`:** con **First to respond** hay una sola respuesta, pero con **Everyone must approve** hay una por aprobador. Escribir el patrón una sola vez (todas las respuestas, unidas) sirve para los tres tipos. Cada respuesta trae `responder` (con su nombre y correo), `approverResponse`, `comments`, `requestDate` y `responseDate` ([Learn: conector de aprobaciones](https://learn.microsoft.com/connectors/approvals/)).

4. **Condition** (dentro del ámbito): `outputs('Aprobacion_jefe')?['body/outcome']` **is not equal to** `Approve`. En **True**: **Set variable** `Resultado` = `Rechazada`. (En **False**, nada.)
5. Después de la condición, **Append to string variable** `Comentario` = `concat('[Jefe] ', join(body('Comentarios_jefe'), '; '), ' ')`. (`join(array, separador)` une los elementos de una lista en un solo texto.)

> **Los valores `Approve` y `Reject`:** son los textos de respuesta de los tipos básicos, en inglés y con esa capitalización exacta. Comparar con `Approved`, `aprobar` o `approve` en minúscula hace que la condición falle **sin error**: el valor no coincide y el flujo sigue por la rama equivocada.

---

## Ejercicio 3 — Etapa 2: Finanzas y TI (todos deben aprobar)

**Objetivo:** que dos áreas aprueben la misma compra, y que baste un rechazo para detenerla.

1. Después de `Etapa 1 Jefe`, **Condition** `Etapa 2 aplica`, en modo avanzado:

```text
@and(equals(variables('Resultado'), 'Aprobada'), greaterOrEquals(outputs('Calcular_nivel'), 2))
```

   "Sigue aprobada y el nivel es 2 o 3". Todo lo siguiente va en **True**.
2. **Start and wait for an approval** `Aprobacion finanzas`:
   - **Approval type**: **Approve/Reject - Everyone must approve**.
   - **Assigned to** (con **fx**, separando los correos con punto y coma, que es como Learn indica varios aprobadores en un solo campo):

```text
if(equals(triggerOutputs()?['body/sit_categoria'], 'Tecnología'), concat(outputs('Aprobador_finanzas'), ';', outputs('Aprobador_TI')), outputs('Aprobador_finanzas'))
```

   - **Title**: `Etapa 2 (Finanzas` + (si es Tecnología, ` y TI`) + `): ` + `Título`. (Puedes dejar el título fijo `Etapa 2: ` + `Título`.)
3. Repite el patrón del Ejercicio 2: una **Select** `Comentarios finanzas` (de `outputs('Aprobacion_finanzas')?['body/responses']`), una **Condition** `outputs('Aprobacion_finanzas')?['body/outcome']` **is not equal to** `Approve` (en **True**, `Resultado` = `Rechazada`) y un **Append to string variable** `Comentario` con `concat('[Finanzas/TI] ', join(body('Comentarios_finanzas'), '; '), ' ')`.

> **Qué hace "Everyone must approve":** crea **una** aprobación con **varios** aprobadores y no continúa hasta que **todos** responden **o hasta que uno rechaza**: Learn indica que las acciones siguientes se ejecutan "after all the approvers respond, or when a single rejection occurs". Un rechazo basta para cerrar la etapa; no hace falta esperar al resto ([Learn: aprobaciones](https://learn.microsoft.com/power-automate/get-started-approvals)).

### Dos formas de poner a Finanzas y TI "en paralelo"

| Forma | Cómo | Cuándo |
|---|---|---|
| **Una aprobación, todos deben aprobar** (la de este ejercicio) | Un solo paso con dos aprobadores | Mismos plazo, mismo texto y misma decisión para todos; es lo más simple |
| **Dos aprobaciones en ramas paralelas** | **Create an approval** y **Wait for an approval** dentro de dos ramas | Textos distintos, plazos distintos o escalado distinto por área |

Si eliges la segunda, pon **Create an approval** y **Wait for an approval** **juntas, una tras otra, en la misma rama**: Learn avisa de que, si el aprobador responde antes de que el flujo llegue a la espera, el flujo puede quedarse atascado ([Learn: problemas conocidos de aprobaciones](https://learn.microsoft.com/power-automate/approvals-known-issues)). Y cuidado con las variables en ramas paralelas: aquí dos ramas escribirían `Resultado`, pero las dos solo escriben el **mismo** valor (`Rechazada`), así que el orden no importa. Si escribieran valores distintos, habría una carrera.

---

## Ejercicio 4 — Etapa 3: Gerencia con respuestas propias

**Objetivo:** una decisión que no es solo sí o no.

1. Después de `Etapa 2 aplica`, **Condition** `Etapa 3 aplica`: `@and(equals(variables('Resultado'), 'Aprobada'), equals(outputs('Calcular_nivel'), 3))`. En **True**:
2. **Start and wait for an approval** `Aprobacion gerencia`:
   - **Approval type**: **Custom Responses - Wait for one response**.
   - **Response options**: `Aprobar`, `Aprobar con condiciones` y `Rechazar` (una por línea o separadas, según el diseñador).
   - **Assigned to**: **Outputs** de `Aprobador gerencia`. **Title** `Etapa 3 (Gerencia): ` + `Título`.
3. **Control** > **Switch** con `outputs('Aprobacion_gerencia')?['body/outcome']` como **On**:

| Caso (**Equals**) | Acción |
|---|---|
| `Aprobar` | Ninguna |
| `Aprobar con condiciones` | **Append to string variable** `Comentario` = `CONDICIONADA: ` |
| `Rechazar` | **Set variable** `Resultado` = `Rechazada` |
| **Default** | **Set variable** `Resultado` = `Rechazada` |

   El **Default** es el seguro: si llegara un valor inesperado, la solicitud **no** se aprueba por accidente.
4. Después del **Switch**, la **Select** `Comentarios gerencia` y el **Append to string variable** de comentarios, como en los ejercicios anteriores (`[Gerencia] …`).

> **Comprueba el valor real:** con respuestas propias, el resultado es el texto de la opción elegida. Tras tu primera prueba, abre la ejecución y mira la salida de `Aprobacion gerencia`: el valor de `outcome` debe coincidir **letra por letra** con los casos del **Switch**, tildes y espacios incluidos. Si no coincide, caes en el **Default** y todo parece "rechazado".
>
> **Comprobado en un tenant real (2026-11-25, interfaz en español):** con las opciones `Aprobar`, `Rechazar` y `Pedir más información`, al elegir la tercera `outcome` vale `Pedir más información`, con la tilde. El centro de aprobaciones añade por su cuenta la opción **Reasignar**. En las aprobaciones **Approve/Reject**, `outcome` sigue en inglés (`Approve` / `Reject`) aunque la interfaz esté en español, así que las condiciones del lab comparan con `Approve` y no con `Aprobar`. Con **Everyone must approve** y un rechazo, `outcome` = `Reject`. Cada elemento de `responses` trae `responder` (`displayName`, `email`, `userPrincipalName`…), `approverResponse`, `comments`, `requestDate` y `responseDate`. En español, los tipos se llaman **Aprobar o rechazar: primero en responder**, **Aprobar o rechazar: todos deben aprobar** y **Respuestas personalizadas: esperar una respuesta**, y la acción es **Iniciar y esperar una aprobación** (conector **Aprobaciones estándar**).

---

## Ejercicio 5 — Cierre: estado, comentarios y correo

**Objetivo:** un único punto de salida, sea cual sea el camino.

1. Después de `Etapa 3 aplica`, **Update a row**: misma fila (el identificador del disparador), `Estado solicitud` = `outputs('Mapa_de_estados')?[variables('Resultado')]` y `Comentario del aprobador` = `variables('Comentario')`.

   Fíjate: no hay dos ramas (una para aprobar y otra para rechazar) como en el Lab 128: el mapa convierte el texto del resultado en el número de la opción. Una sola actualización cubre los dos casos.
2. **Send an email (V2)** a `Correo del solicitante` del disparador: **Subject** `Tu solicitud "` + `Título` + `" fue ` + `toLower(variables('Resultado'))` (da `aprobada` o `rechazada`); **Body** con el importe, el nivel y `variables('Comentario')`.
3. **Save**. Usa el **Flow checker**. Espera un par de minutos antes de probar.

### Validación de los Ejercicios 1 a 5

| Campo | Tu valor |
|---|---|
| Número de **Scope**, **Condition** y **Switch** del flujo | ___ |
| Avisos del **Flow checker** | ___ |

---

## Ejercicio 6 — Probar los cuatro casos

**Objetivo:** comprobar la política con casos que recorren cada camino.

1. Ejecuta `SC - Registrar solicitud` cuatro veces:

| Caso | Título | Área | Categoría | Cantidad | Precio unitario |
|---|---|---|---|---|---|
| A | Sillas ergonómicas para Servicios (cadena) | Servicios | Mobiliario | 4 | 210 |
| E | Portátiles para nuevos analistas (cadena) | TI | Tecnología | 3 | 1400 |
| F | Mesas de reuniones para Comercial (cadena) | Comercial | Mobiliario | 2 | 1650 |
| D | Estudio de mercado regional (cadena) | Comercial | Servicios profesionales | 1 | 18500 |

2. Responde así:

| Caso | Respuestas |
|---|---|
| A | Jefe: **Approve** |
| E | Jefe: **Approve**; Finanzas: **Approve**; TI: **Approve** |
| F | Jefe: **Approve**; Finanzas: **Reject** con el comentario "Usar el contrato marco" |
| D | Jefe: **Approve**; Finanzas: **Approve**; Gerencia: **Aprobar con condiciones** con el comentario "Entregable en 30 días" |

### Resultado esperado del Ejercicio 6

| Caso | Importe | Nivel | Aprobaciones pedidas | Estado final | Comentario |
|---|---|---|---|---|---|
| A | 840 | 1 | 1 (jefe) | **Aprobada** | `[Jefe] …` |
| E | 4200 | 2 | 2 (jefe; Finanzas y TI a la vez) | **Aprobada** | jefe, Finanzas/TI |
| F | 3300 | 2 | 2 (jefe; Finanzas, que rechaza) | **Rechazada** | incluye "Usar el contrato marco" |
| D | 18500 | 3 | 3 (jefe, Finanzas, Gerencia) | **Aprobada** | incluye `CONDICIONADA:` y "Entregable en 30 días" |

Tres correos "aprobada" y uno "rechazada". (Como `Alertar compra grande` y `Avisar a TI` siguen encendidos, D y E mandan además un correo de aviso: es normal.) En F, **Gerencia no recibe nada** (ni habría recibido, aunque fuera nivel 3: ya estaba rechazada).

### Una prueba más, sobre "todos deben aprobar"

3. (Solo con dos cuentas; con una sola, anota "no aplica" y sigue.) Repite el caso E (con otro título) y, esta vez, **rechaza con TI antes de que responda Finanzas**. Observa y anota: ¿cuántas aprobaciones siguen pendientes en la bandeja de Finanzas? ¿Cuál es el estado final de la solicitud? ¿Qué comentario quedó?

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Estado final de A, E, F y D | ___ , ___ , ___ , ___ |
| Qué pasó con la aprobación pendiente de Finanzas al rechazar TI | ___ |

---

## Ejercicio 7 — Reasignar

**Objetivo:** saber qué hace una reasignación y qué no.

1. Crea una solicitud nueva, nivel 1 (por ejemplo, 2 × 50 USD).
2. (Si no tienes un segundo usuario, abre el menú **Reassign** y obsérvalo sin completarlo; salta al Ejercicio 8.) En [make.powerautomate.com](https://make.powerautomate.com) > **Approvals**, abre la aprobación pendiente, elige el menú **…** > **Reassign** y asígnala a otra persona ([Learn: aprobaciones](https://learn.microsoft.com/power-automate/approvals-howto)). Es el **aprobador** quien reasigna; el solicitante no puede (solo cancelar).
3. Responde con la persona nueva y abre la ejecución. Mira, en `Aprobacion jefe`, quién figura como `responder` en la respuesta.

### Resultado esperado del Ejercicio 7

El flujo **sigue su curso** con la respuesta de quien contestó. Anota quién aparece como `responder`: ese es el nombre que llega al comentario del correo. *Sin verificar en Learn:* si la reasignación desde Teams o el correo funciona igual, y qué más ve el flujo tras reasignar.

> **Para el diseño:** el flujo no valida que quien responde sea "el jefe de área". Si la política exige que lo haga una persona concreta, hay que comprobarlo (el Lab 137 trata la propiedad y los permisos).

---

## Ejercicio 8 — Vencimiento y escalado

**Objetivo:** que una solicitud no se quede esperando para siempre.

### Tarea 8.1 — El plazo

1. Abre la acción `Aprobacion jefe` > **Settings** > **Timeout** (en el diseñador nuevo, el campo se llama **Action Timeout**) y escribe una duración ISO 8601. **Para probar**, `PT3M` (3 minutos). En producción: `P2D` (dos días **naturales**: Power Automate no conoce días hábiles; los dos días hábiles de la política son una decisión pendiente y se documenta, no se disimula) ([Learn: límites y duración](https://learn.microsoft.com/power-automate/limits-and-config)).
2. Sin plazo, una aprobación pendiente termina fallando por el límite de duración de la ejecución: Learn lo documenta como 28 días para aprobaciones en la página de problemas conocidos y como 30 en la de límites; **cita siempre el menor (28) cuando diseñes**.

### Tarea 8.2 — La rama de escalado

3. Después de `Etapa 1 Jefe`, añade otro **Scope** `Escalar etapa 1`. En su menú **…** > **Configure run after** (en el diseñador nuevo, pestaña **Settings** > **Run after** de la acción), marca **has failed** y **has timed out** y **desmarca** **is successful**. Así solo se ejecuta si la etapa del jefe no terminó bien. (Learn: la acción cuyo plazo vence termina con el código `ActionTimedOut`; el ámbito que la contiene termina en fallo.)
4. Dentro, **Start and wait for an approval** `Aprobacion escalada` (**First to respond**), **Assigned to** = `Aprobador gerencia`, **Title** `ESCALADA: ` + `Título`. Después, **Condition** sobre su resultado (`is not equal to` `Approve` → `Resultado` = `Rechazada`) y un **Append to string variable** `Comentario` = `[Escalada a Gerencia por falta de respuesta] `.
5. Ahora el eslabón que une todo: en la acción `Etapa 2 aplica`, **Configure run after** de `Escalar etapa 1`: marca **is successful** y **is skipped**, y desmarca el resto. Si el jefe respondió, `Escalar etapa 1` se **omite** (skipped) y el flujo sigue; si no respondió, se ejecuta (successful) y el flujo sigue. Sin este ajuste, la etapa 2 no correría nunca tras una omisión.

   Este es el patrón **Try/Catch** que desarrolla el Lab 133: el ámbito es el *try*, el ámbito que corre al fallar es el *catch*.

### Tarea 8.3 — Probar

6. Crea la solicitud **G**: *Prueba de escalado*, Servicios, Papelería, 2 × 50 USD (nivel 1). **No respondas al jefe**. Espera los tres minutos. Llegará una aprobación `ESCALADA: …` a Gerencia: respóndela con **Approve**.

### Resultado esperado del Ejercicio 8

| Caso | Aprobaciones | Estado final | Comentario |
|---|---|---|---|
| G | 2 (jefe, que vence; Gerencia, escalada) | **Aprobada** | incluye `Escalada a Gerencia por falta de respuesta` |

El historial muestra `Etapa 1 Jefe` en rojo (tiempo agotado) y `Escalar etapa 1` en verde. **La aprobación original del jefe sigue en su bandeja**: el flujo ya no la espera, pero la solicitud pendiente no desaparece sola. Para que no quede ambigüedad, quien responde tarde lo hace sobre algo que ya no cuenta. Anota cómo lo resolverías (cancelar la aprobación desde el flujo, avisar al jefe, o ambas); el Lab 133 vuelve sobre ello.

### Validación del Ejercicio 8

| Campo | Tu valor |
|---|---|
| Estado de `Etapa 1 Jefe` y de `Escalar etapa 1` en el historial | ___ y ___ |
| Qué pasó con la aprobación original del jefe | ___ |

---

## Ejercicio 9 (opcional) — La misma decisión en una tarjeta de Teams

**Objetivo:** ver qué ganas y qué pierdes al decidir en una tarjeta adaptable en vez de en una aprobación.

1. Duplica el flujo (**Save as**) para no estropear el bueno. En la etapa 3, sustituye la aprobación por **Microsoft Teams** > **Post adaptive card and wait for a response**, publicada en un chat con la persona de Gerencia ([Learn: conector de Teams](https://learn.microsoft.com/connectors/teams/)).
2. En el cuerpo de la tarjeta usa un JSON de tarjeta adaptable con un campo de comentario y dos botones **Action.Submit** (`Aprobar` y `Rechazar`), cada uno con un `data` distinto (por ejemplo `{"decision": "Aprobar"}`).
3. Lee la respuesta en la salida de la acción (los datos enviados por el botón) y usa ese valor en el **Switch**. *Sin verificar en Learn:* la ruta exacta de la salida; míralo en una ejecución.

### Comparación (anótala)

| | Aprobación (**Approvals**) | Tarjeta de Teams |
|---|---|---|
| Registro central | Sí: el centro de aprobaciones guarda el historial | No: solo la ejecución del flujo |
| Reasignar, tipos de respuesta | Integrados | Los construyes tú |
| Interfaz | La estándar | Libre |
| Dónde la ves | Correo, Teams, portal | Teams |

La regla práctica: **si el negocio necesita auditar la decisión, usa aprobaciones**; la tarjeta es para interacciones, no para decisiones con rastro.

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| Todas las solicitudes quedan **Rechazadas** | Se comparó con `Approved` o `aprobar`, o el `Switch` no coincide con el texto de la opción | `Approve`/`Reject` exactos; compara con la salida real |
| Finanzas no recibe nada | `Etapa 2 aplica` da `false` (el nivel se compara con un texto, o `Resultado` ya es `Rechazada`) | Prueba la expresión en una **Compose**; el nivel es un número |
| El flujo se queda esperando aunque el aprobador respondió | **Create an approval** y **Wait for an approval** quedaron separadas por otras acciones | Ponlas seguidas, o usa **Start and wait for an approval** |
| La etapa 2 nunca corre después del escalado | **Configure run after** de `Etapa 2 aplica` solo tiene **is successful** de `Escalar etapa 1` (omitida) | Marca también **is skipped** |
| El plazo no vence | **Timeout** no guardado o mal escrito (`3m` en vez de `PT3M`) | ISO 8601: `PT3M`, `PT2H`, `P2D` |
| `Comentario` sale vacío o con `null` | Los aprobadores no escribieron comentario | Es válido: el comentario es opcional |
| `Initialize variable` no se deja arrastrar a una condición | Learn: solo al nivel principal | Inicializa arriba y usa **Set variable** dentro |

## 🔧 Diagnóstico y reparación

### "Un caso de nivel 2 quedó **Aprobada** sin que Finanzas respondiera"

1. **¿La etapa 2 se ejecutó?** En el historial, mira `Etapa 2 aplica`: si se **omitió**, la condición dio `false`.
2. **¿Qué valor tenía `Calcular nivel`?** Debe ser número 2, no texto.
3. **¿`Resultado` ya era `Rechazada`?** Entonces no debía llegar a Finanzas, y no es un error.
4. **¿La `Etapa 2 aplica` va después del ámbito de la etapa 1 o dentro de él?** Debe ir **después**.

## Checklist final

- [ ] Flujo `SC - Aprobar solicitud (cadena)` con tres etapas condicionales y el original apagado
- [ ] Aprobadores en cuatro **Compose** (un único lugar para cambiarlos)
- [ ] Etapa 2 con **Everyone must approve** y la lista de aprobadores según la categoría
- [ ] Etapa 3 con respuestas propias y **Default** seguro
- [ ] Casos A, E, F y D con los estados esperados, más la prueba del rechazo de TI
- [ ] Escalado probado con el caso G
- [ ] Una reasignación observada

## Evidencia esperada

- Captura del flujo completo en el diseñador (con los tres ámbitos y las condiciones)
- Captura de la tabla con los casos A, E, F, D y G y sus estados y comentarios
- Captura del historial del caso G (etapa 1 agotada, escalado correcto)
- Tus respuestas de validación y la comparación aprobación-tarjeta si hiciste el Ejercicio 9

## Criterios de aprobación

- Los casos A, E, F y D terminan en Aprobada, Aprobada, Rechazada y Aprobada, con las aprobaciones pedidas que dice la tabla
- Un rechazo en cualquier etapa detiene las siguientes
- El escalado por vencimiento funciona y entiendes qué queda pendiente en la bandeja del primer aprobador
- Explicas cuándo usar **Everyone must approve** y cuándo dos ramas paralelas

## Competencias desarrolladas

- Diseñar cadenas de aprobación según reglas de negocio
- Elegir el tipo de aprobación (primero en responder, todos, respuestas propias)
- Acumular resultados y comentarios con variables y `join`
- Configurar plazos y escalado con **Scope** y **Configure run after**
- Reconocer los límites de una aprobación (reasignación, respuestas tardías, plazo máximo)

## Reto adicional

**Reto básico:** añade el nombre de quien aprobó cada etapa al correo del solicitante.

**Reto intermedio:** convierte la etapa 2 en dos aprobaciones en **ramas paralelas** (Finanzas y TI por separado, con **Create an approval** y **Wait for an approval**) y escribe qué ganas y qué te cuesta frente a **Everyone must approve**.

**Reto avanzado:** los **dos días hábiles** de la política no existen como tal en Power Automate. Diseña (sin construirlo) cómo calcularías el plazo en días hábiles (pista: una tabla de festivos como la del Lab 129 y un cálculo de fecha límite).

## Preguntas de repaso

1. ¿Por qué `Resultado` empieza en `Aprobada` y qué evita?
2. ¿Qué diferencia hay entre una aprobación con "todos deben aprobar" y dos ramas paralelas?
3. ¿Por qué el **Switch** necesita un **Default**?
4. ¿Qué ocurre con la aprobación original cuando se escala por vencimiento?
5. ¿Por qué la etapa 2 necesita **is skipped** en su **Configure run after**?

## Limpieza del laboratorio

Deja encendido solo `SC - Aprobar solicitud (cadena)` (el original queda apagado). Responde o cancela las aprobaciones pendientes. Cambia el **Timeout** de `Aprobacion jefe` de `PT3M` a `P2D` antes de seguir. Conserva a los usuarios de prueba: los volverás a necesitar en el Lab 137.

## Siguiente laboratorio recomendado

**Lab 132 — Dataverse a fondo desde un flujo** (siguiente): `List rows` con OData y FetchXML, `expand`, paginación y **upsert** con clave alternativa.

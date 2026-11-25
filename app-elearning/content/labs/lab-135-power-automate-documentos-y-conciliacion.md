---
id: lab-135
title: "Documentos y conciliación: facturas por correo, reglas de tolerancia y duplicados (Ruta Pro Power Automate)"
level: "N2"
duration: 240
product: ["Power Automate", "Dataverse", "Outlook"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado"
  - "Lab 132 recomendado (buscar y decidir, claves alternativas)"
  - "Lab 133 recomendado (idempotencia): aquí la usas con facturas reenviadas"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 135 — Documentos y conciliación

## Objetivo

Recibir **facturas de proveedores** (un archivo JSON adjunto a un correo o pegado en una entrada), **leerlas**, **conciliarlas** contra las solicitudes de compra aprobadas con una **regla de tolerancia** y dejar un resultado explicable por factura: conciliada, con diferencia tolerada, fuera de tolerancia, duplicada, sin solicitud, de otro proveedor, en otra moneda o contra una solicitud no aprobada. Es el paso del proceso de SIT donde el dinero sale de la empresa: un error aquí se paga.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). Cuentas por pagar recibe las facturas por correo y hoy las compara a mano con la solicitud aprobada. El 2 % de diferencia se acepta (redondeos, cambios de precio mínimos); más que eso se revisa; una factura repetida o de una solicitud no aprobada **no se paga**. Tu flujo hace la primera pasada y deja a las personas solo lo dudoso.

## Lo que vas a construir

- Una tabla `Factura` en Dataverse con clave alternativa `ID de factura`
- Un flujo `SC - Conciliar factura` que lee una factura, aplica las reglas en un **orden fijo** y guarda el resultado
- La regla de tolerancia escrita **sin `abs` ni `round`** (no existen en el lenguaje de expresiones)
- Una corrida del **lote de 14 facturas** con cifras que debes reproducir
- Un resumen por resultado y una decisión escrita sobre **AI Builder** (variante opcional, en papel)

## Relación con la Ruta Pro

| Antes | En este lab | Se profundiza en |
|---|---|---|
| Excel sucio (Lab 130) | Documentos con datos que pueden no cuadrar | Lab 139 (reto, con el mismo patrón de reglas en orden) |
| Buscar y decidir (Lab 132) | Detectar una factura **ya recibida** | Lab 138 (rendimiento) |
| Idempotencia (Lab 133) | Un reenvío del proveedor no duplica ni paga dos veces | Lab 137 (operación) |

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Tabla de facturas | 25 min |
| Ejercicio 2 — Leer la factura | 35 min |
| Ejercicio 3 — Las reglas y la tolerancia | 55 min |
| Ejercicio 4 — El lote de 14 facturas | 40 min |
| Ejercicio 5 — Duplicados | 30 min |
| Ejercicio 6 — Informe | 25 min |
| Ejercicio 7 — AI Builder, en papel | 20 min |
| **Total** | **unas 3 h 50 min** |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Automate: **Parse JSON**, **Compose**, **Condition**, **Apply to each**, **Filter array**, **Select**, **Send an email (V2)** y, en la variante por correo, **When a new email arrives (V3)**
- Dataverse: **List rows**, **Add a new row**, **Update a row**
- Expresiones: `json`, `base64ToString`, `endswith`, `toLower`, `first`, `coalesce`, `sub`, `mul`, `max`, `lessOrEquals`, `greater`, `formatNumber`, `float`, `concat`, `items`, `length`, `if`, `not`, `equals`

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso con la solución `SIT Compras`, las tablas del Lab 128 y las **146 solicitudes** cargadas en el Lab 132 (la conciliación las consulta)
- [ ] El paquete [sit-compras.zip](/practice-assets/powerautomate/sit-compras/sit-compras.zip) extraído: carpeta `facturas/` (13 facturas, un reenvío y `lote-facturas.json`) y `reglas-conciliacion.json`
- [ ] Para la variante por correo: **Office 365 Outlook** con buzón; si no lo tienes, usa la entrada de texto (Ejercicio 2, camino B)

### Verificación rápida antes de empezar

- [ ] Abre `reglas-conciliacion.json`: tolerancia del **2 %** y el **orden de evaluación** de seis comprobaciones
- [ ] Abre `facturas/FAC-2026-0003.json` y `facturas/FAC-2026-0003-reenvio.json`: son la **misma** factura; el segundo archivo es el reenvío del proveedor
- [ ] En la tabla `Solicitud de compra`, busca `SC-2026-0096`: importe **7.650**, estado **Aprobada**. La factura `FAC-2026-0001` la cobra completa

---

## Ejercicio 1 — Tabla de facturas

**Objetivo:** guardar cada factura recibida y su resultado, con una clave que impida repetirla.

1. En la solución `SIT Compras`: **New** > **Table** > **Table**. Nombre para mostrar `Factura`.
2. Columnas (el nombre de esquema lo asigna tu publicador):

| Nombre para mostrar | Tipo | Notas |
|---|---|---|
| `ID de factura` | Texto | Clave alternativa (paso 3) |
| `Solicitud` | Lookup a `Solicitud de compra` | Puede quedar vacía (hay facturas sin solicitud) |
| `ID de solicitud informado` | Texto | Lo que **dijo** la factura, exista o no |
| `Proveedor informado` | Texto | |
| `Moneda` | Texto | |
| `Importe` | Decimal (2 posiciones) | |
| `Resultado` | Texto | Uno de los ocho resultados |
| `Diferencia` | Decimal (2 posiciones) | Factura menos solicitud |

3. **Keys** > **New key**: `ID de factura`. Espera a que el estado sea **Active** (el Lab 132 explica por qué tarda).

> **Por qué un texto para `Resultado` y no una opción:** el lab se centra en las reglas. Una columna de opciones es una mejora válida (Reto básico).

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Estado de la clave alternativa | ___ (esperado: Active) |
| ¿Por qué `Solicitud` puede ir vacía? | ___ |

---

## Ejercicio 2 — Leer la factura

**Objetivo:** convertir el archivo de la factura en un objeto que el flujo entienda.

**Camino A — por correo (Outlook):**

1. Flujo automatizado `SC - Conciliar factura`. Desencadenador **When a new email arrives (V3)**: **Only with Attachments** = **Yes**, **Include Attachments** = **Yes**, **Subject Filter** `Factura SIT` ([Learn: conector de Office 365 Outlook](https://learn.microsoft.com/connectors/office365/)).
2. Cada adjunto es un objeto con `name`, `contentType`, `size` y `contentBytes` (el contenido codificado en base64). Learn avisa de que con **Include Attachments** en **Yes** el desencadenador puede agotar el tiempo con muchos correos a la vez y recomienda **No** más **Get Attachment (V2)**; para este lab, con pocos correos, **Yes** basta.
3. Añade **Apply to each** sobre `Attachments` y, dentro, una **Condition** `endswith(toLower(items('Apply_to_each')?['name']), '.json')` (una firma con imágenes también llega como adjunto y `json(...)` fallaría con ella). En **True**, **Parse JSON** con **Content** = `json(base64ToString(items('Apply_to_each')?['contentBytes']))` (con **fx**) y el esquema generado desde `FAC-2026-0001.json`. (El nombre `Apply_to_each` puede ser `For_each` en tu diseñador: usa el que veas.) **Comprobado en un tenant real (2026-11-25), con un texto codificado con `base64()` en lugar de un adjunto de correo:** `json(base64ToString(...))` devuelve el objeto, con los importes como números y las tildes y la `Ñ` intactas.
   - **Corrige el esquema generado:** el ejemplo trae importes enteros (`7650`) y el generador escribe `"type": "integer"`. Las facturas `FAC-2026-0007` (603,96) y `FAC-2026-0008` (3.888,64) fallarían la validación. Cambia a `number` el tipo de `importe`, `precioUnitario` y `cantidad`.
4. Envíate un correo con asunto `Factura SIT` y el archivo `FAC-2026-0001.json` adjunto.

**Camino B — sin correo:**

1. Flujo instantáneo con una entrada **Text** `Factura (JSON)`. **Parse JSON** con **Content** = `triggerBody()?['text']` y el mismo esquema.
2. Para probar, pega el contenido de `FAC-2026-0001.json` en la entrada al lanzar el flujo (y corrige a `number` los tipos del esquema, como arriba).

> **Comprobado en Learn (2026-11-21):** `base64ToString` y `json` existen y están descritas en la referencia de funciones ([Learn: referencia de funciones](https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-functions-reference)), y los nombres de propiedad del adjunto. **Sin verificar:** que la combinación `json(base64ToString(contentBytes))` funcione con tu adjunto. Ninguna página oficial la documenta tal cual. Si falla, anota el error y prueba primero en una **Compose** con `base64ToString(...)`.

4. Añade una **Compose** `Importe factura` con `body('Parse_JSON')?['importe']` y comprueba la ejecución.

### Resultado esperado del Ejercicio 2

`Importe factura` = **7650** para `FAC-2026-0001`. La ejecución dura segundos.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Camino que usaste (A o B) | ___ |
| `importe` leído | ___ (esperado: 7650) |
| Nombre de la propiedad que contiene el archivo en tu adjunto | ___ (esperado: `contentBytes`) |

---

## Ejercicio 3 — Las reglas y la tolerancia

**Objetivo:** aplicar las seis comprobaciones **en el orden del archivo de reglas**, y que la primera que falla decida.

### Tarea 3.1 — Buscar lo que hace falta

Dentro del flujo, tras **Parse JSON**:

1. **List rows** `Buscar factura previa` sobre `Factura`: **Filter rows** `concat('<clave> eq ''', body('Parse_JSON')?['facturaId'], '''')` (usa el nombre lógico de la clave) y **Row count** `1`.
2. **List rows** `Buscar solicitud` sobre `Solicitud de compra`: filtro por `ID de origen` con `solicitudId` de la factura, **Row count** `1` y **Expand Query** `sit_Proveedor($select=sit_iddeproveedor)` (el nombre del lookup, como en el Lab 132: así la solicitud trae el **ID de proveedor** y no solo el GUID). El proveedor de la solicitud será `first(outputs('Buscar_solicitud')?['body/value'])?['sit_Proveedor']?['sit_iddeproveedor']`.

### Tarea 3.2 — La tolerancia sin `abs` ni `round`

**Comprobado en Learn (2026-11-21):** la tabla de funciones matemáticas del lenguaje de expresiones tiene `add`, `div`, `max`, `min`, `mod`, `mul`, `pow`, `rand`, `range` y `sub`. **No hay `abs`, `round`, `floor` ni `ceiling`.**

> **Estas cuatro Compose se ejecutan siempre**, antes de `Resultado`. Si la solicitud no existe (`FAC-2026-0012`), `first(...)` da `null` y `sub(1440, null)` **hace fallar el flujo** antes de llegar al `if`. Por eso cada lectura del importe de la solicitud va con `coalesce(..., 0)`: con la solicitud ausente las cuentas dan números sin sentido, pero `Resultado` ya dirá `Sin solicitud` y los ignora.

1. **Compose** `Diferencia` (con **fx**): `sub(body('Parse_JSON')?['importe'], coalesce(first(outputs('Buscar_solicitud')?['body/value'])?['<columna importe>'], 0))`.
2. **Compose** `Diferencia absoluta`: `max(outputs('Diferencia'), mul(outputs('Diferencia'), -1))`. (El mayor entre un número y su opuesto es el valor absoluto.)
3. **Compose** `Tolerancia en USD`: `mul(coalesce(first(outputs('Buscar_solicitud')?['body/value'])?['<columna importe>'], 0), 0.02)`.
4. **Compose** `Dentro de tolerancia`: `lessOrEquals(outputs('Diferencia_absoluta'), outputs('Tolerancia_en_USD'))`.

> **El error de la coma flotante:** `603,96 - 595` no da `8,96` exacto; da `8,960000000000036` (un número binario no representa todos los decimales). Esto no rompe la comparación con la tolerancia, pero **sí ensucia** lo que guardas. Para guardar la diferencia redondeada, usa `float(formatNumber(outputs('Diferencia'), '0.00'))`. **Comprobado en un tenant real (2026-11-25):** `formatNumber` redondea la mitad **alejándose del cero** y sobre el valor decimal escrito, no sobre su aproximación binaria (`2.345` → `2.35`, `2.675` → `2.68`, `1.005` → `1.01`, `-2.345` → `-2.35`; con `'0'`, `2.5` → `3` y `-2.5` → `-3`), y `float(formatNumber(sub(603.96, 595), '0.00'))` da `8.96`. No le pases una cultura como `'es-ES'` si después vas a usar `float`: devuelve `1234,57`, con coma decimal. No uses `equals(diferencia, 0)` con importes que pueden traer decimales: compara contra una tolerancia de `0.005`.

### Tarea 3.3 — El orden decide

El archivo de reglas fija el orden: **Duplicada**, **Sin solicitud**, **Solicitud no aprobada**, **Proveedor distinto**, **Moneda distinta** y, al final, el **importe**. Implementa el resultado como una **Compose** `Resultado` con `if` anidados (con **fx**), por ejemplo:

```text
if(greater(length(outputs('Buscar_factura_previa')?['body/value']), 0), 'Duplicada',
 if(equals(length(outputs('Buscar_solicitud')?['body/value']), 0), 'Sin solicitud',
  if(not(equals(first(outputs('Buscar_solicitud')?['body/value'])?['<columna estado>@OData.Community.Display.V1.FormattedValue'], 'Aprobada')), 'Solicitud no aprobada',
   ...
```

> **La columna de estado es una opción (Choice):** sin más, devuelve un **número**, y `equals(<número>, 'Aprobada')` siempre es falso (todas saldrían `Solicitud no aprobada`). La forma de arriba pide el **texto formateado** de la opción; *sin verificar en el tenant* que tu conector lo devuelva así. Si no, compara con el **número** de la opción `Aprobada` que ves en la definición de la columna, sin comillas.

Completa los tres `if` que faltan: **proveedor** (compara el `proveedorId` de la factura con el que expandiste en la Tarea 3.1), **moneda** (compara con `'USD'`: todas las solicitudes de SIT están en dólares) e **importe**. Para el importe: `0` de diferencia (compara con `0.005`) da `Conciliada`; dentro de la tolerancia, `Conciliada con diferencia`; si no, `Fuera de tolerancia`.

> **Por qué importa el orden:** `FAC-2026-0012` cita `SC-2026-0999`, que no existe. Si evalúas primero el importe, el resultado no tiene sentido (compara contra 0) en vez de decir `Sin solicitud`. Las reglas que **comprueban que el dato existe** van **antes** de las que lo usan.

### Tarea 3.4 — Guardar

**Add a new row** en `Factura` con los datos de la factura, el `Resultado` y la `Diferencia` (cuando exista; guárdala redondeada con `float(formatNumber(outputs('Diferencia'), '0.00'))`). Para el lookup `Solicitud`, enlázalo con la solicitud encontrada: en el campo del lookup, la referencia a su fila (`<conjunto de entidades>(<GUID>)` con el GUID de la fila de `Buscar solicitud`, o por la clave alternativa `ID de origen`, igual que el lookup del proveedor del Lab 132, Ejercicio 4; el nombre del conjunto de entidades de tu tabla se ve en la API web y *no está verificado aquí*); si no hay solicitud, déjalo vacío. Si la factura es duplicada, **no** la guardes otra vez (Ejercicio 5).

### Resultado esperado del Ejercicio 3

Lanza el flujo con el cuerpo de **cuatro** facturas (una por una) y compara lo que queda en `Factura`:

| Factura | Resultado esperado | Diferencia |
|---|---|---|
| `FAC-2026-0001` | Conciliada | 0 |
| `FAC-2026-0007` | Conciliada con diferencia | 8,96 |
| `FAC-2026-0009` | Fuera de tolerancia | 38 |
| `FAC-2026-0012` | Sin solicitud | (vacía) |

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Expresión que usaste para el valor absoluto | ___ |
| Tolerancia en USD de `FAC-2026-0009` | ___ (esperado: 15,20; en la ejecución puede salir `15.200000000000001`: coma flotante) |
| Qué pasa con `FAC-2026-0012` si quitas los `coalesce` | ___ (esperado: el flujo falla antes del `if`) |

---

## Ejercicio 4 — El lote de 14 facturas

**Objetivo:** probar todas las reglas de una vez y reproducir las cifras.

0. **Antes de empezar, borra de `Factura` las filas que dejó el Ejercicio 3** (si no, el lote las marcaría `Duplicada`).
1. Duplica el flujo como `SC - Conciliar lote`: quita el desencadenador de correo (si hiciste el camino A) y pon uno instantáneo con una entrada **Text** `Lote (JSON)`. Pega `lote-facturas.json`.
2. **Parse JSON** del lote (arreglo; el esquema, con `number` en los importes) y **Apply to each** con la lógica del Ejercicio 3 dentro. **Cambia** en esas expresiones `body('Parse_JSON')?[...]` por `items('Apply_to_each')?[...]` (la factura de cada vuelta). **Concurrencia 1** (la por defecto): el orden importa para detectar el duplicado, que debe ser el **segundo** `FAC-2026-0003`.
3. Antes del bucle, **Initialize variable** `Resultados` (**Array**, `[]`). Al final de cada vuelta, **Append to array variable** con `{ "facturaId": ..., "resultado": ..., "diferencia": ... }` (lo usas en el Ejercicio 6).
4. Ejecuta y cuenta los resultados en la tabla `Factura` (una fila por factura **distinta**: 13).

### Resultado esperado del Ejercicio 4

| Resultado | Facturas |
|---|---|
| Conciliada | 6 (0001 a 0006) |
| Conciliada con diferencia | 2 (0007 y 0008, con diferencias de 8,96 y -31,36) |
| Fuera de tolerancia | 1 (0009, diferencia 38) |
| Proveedor distinto | 1 (0010) |
| Moneda distinta | 1 (0011) |
| Sin solicitud | 1 (0012) |
| Solicitud no aprobada | 1 (0013) |
| Duplicada | 1 (el reenvío de 0003; **no** se guarda) |

Importe conciliado (las 8 conciliadas, con o sin diferencia): **28.086,60 USD**. De ellas, las que se pagarían **sin revisión** (las 6 exactas): **23.594 USD**.

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Filas en `Factura` | ___ (esperado: 13) |
| Total conciliado | ___ (esperado: 28.086,60) |
| Total a pagar sin revisión | ___ (esperado: 23.594) |

---

## Ejercicio 5 — Duplicados

**Objetivo:** que un reenvío no cree una segunda fila ni se pague dos veces.

1. Con la clave alternativa del Ejercicio 1 ya tienes **protección** de la base: crear la factura 3 otra vez falla con un error de clave duplicada (412). Compruébalo con **Add a new row** y el reenvío.
2. Pero un flujo que falla por un duplicado **parece** roto. Con el **buscar y decidir** de la Tarea 3.1 el reenvío termina limpio con `Resultado` = `Duplicada` y **sin** escribir la fila.
3. Vuelve a ejecutar **todo el lote** una segunda vez.

### Resultado esperado del Ejercicio 5

Tras la segunda corrida, siguen **13** filas en `Factura` y las **14** facturas del lote salen `Duplicada` (las 13 que ya existían y el reenvío). Si ves 26 filas, la búsqueda de la factura previa no está filtrando bien.

> **Dos defensas distintas, como en el Lab 132:** el flujo decide con una búsqueda y la clave alternativa protege cuando dos ejecuciones simultáneas pasan la búsqueda a la vez. Quita una y explica qué falla.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Filas tras la segunda corrida | ___ (esperado: 13) |
| Facturas `Duplicada` en la segunda corrida | ___ (esperado: 14 de 14, contando el reenvío) |

---

## Ejercicio 6 — Informe

**Objetivo:** que cuentas por pagar reciba **una** tabla con lo que requiere decisión.

1. Al final de `SC - Conciliar lote`, **Filter array** sobre la variable `Resultados` (la que acumulaste en el Ejercicio 4) con el resultado distinto de `Conciliada` y de `Duplicada`.
2. **Select** con `ID de factura`, `Resultado` y `Diferencia`; **Create HTML table** (su **From** es la salida del **Select**); **Send an email (V2)** a ti mismo con la tabla.

### Resultado esperado del Ejercicio 6

El correo lista **7** facturas (0007, 0008, 0009, 0010, 0011, 0012 y 0013) y ninguna de las exactas ni el reenvío.

> **Criterio:** requieren decisión las facturas que **no** son `Conciliada` ni `Duplicada`. Contrasta tu número con la tabla del Ejercicio 4.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Facturas en el correo | ___ (esperado: 7) |

---

## Ejercicio 7 — AI Builder, en papel

**Objetivo:** decidir con datos cuándo no conviene escribir tú el lector de facturas.

**Comprobado en Learn (2026-11-21):** el modelo prediseñado de procesamiento de facturas sigue vigente (acción **Extract information from invoices**), admite PDF, JPEG y PNG de hasta 20 MB, y devuelve campos como el total, el ID de factura y el proveedor, **cada uno con su confianza** ([Learn: procesamiento de facturas](https://learn.microsoft.com/ai-builder/prebuilt-invoice-processing)). Consume **Copilot Credits** (o créditos de AI Builder si los tienes): 8 Copilot Credits por página, es una acción premium, y Learn dice que las **pruebas de AI Builder están discontinuadas** ([Learn: licencias](https://learn.microsoft.com/ai-builder/administer-licensing)). **Learn no dice si tu prueba de Power Automate trae créditos**: no dependas de ello.

Por eso este ejercicio es **solo de diseño**. Responde por escrito:

1. En SIT las facturas llegan en JSON **y** en PDF escaneado. ¿Para cuál usarías AI Builder y para cuál no?
2. El modelo devuelve la confianza de cada campo. ¿Qué umbral pondrías para pagar **sin** revisión y qué harías por debajo?
3. Una factura de 20 páginas cuesta 160 Copilot Credits al ritmo de 8 por página. Con 400 facturas al mes de 2 páginas cada una, ¿cuántos créditos al mes? (Respuesta: 6.400.)
4. ¿Qué parte de las seis reglas de conciliación **sigue** siendo tuya aunque el modelo lea bien?

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Umbral de confianza y por qué | ___ |
| Créditos al mes (400 facturas de 2 páginas) | ___ (esperado: 6.400) |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `Parse JSON` falla con el adjunto | `contentBytes` vacío: **Include Attachments** en **No**, o archivo no JSON | **Include Attachments** en **Yes**; prueba `base64ToString` en una **Compose** |
| "Index was out of range" al leer la solicitud | Se calcula el importe antes de comprobar que la solicitud existe | Comprobar la existencia **primero** (Tarea 3.3) |
| Falla `abs` o `round` | No existen en el lenguaje de expresiones | `max(x, mul(x, -1))` y `formatNumber` |
| El resultado dice `Conciliada` con una diferencia de 0,00000000001 | Coma flotante | Comparar con `0.005` o redondear con `formatNumber` |
| Dos filas con el mismo ID de factura | La búsqueda no filtra, o no hay clave alternativa | Corregir el filtro y crear la clave |
| El reenvío del proveedor se paga dos veces | No hay búsqueda previa | **Buscar y decidir** (Lab 132) |

## 🔧 Diagnóstico y reparación

### "Pagamos dos veces la factura de un proveedor"

1. **Busca** en `Factura` por el `ID de factura` y cuenta las filas.
2. Si hay **una**, el doble pago salió de otro sistema: revisa quién consulta esa tabla para pagar.
3. Si hay **dos**, falta la clave alternativa o el flujo se ejecutó **dos veces al mismo tiempo**. Comprueba la clave y la concurrencia.
4. **Decide** una regla: ningún pago sale de una fila cuyo `Resultado` no sea `Conciliada` o `Conciliada con diferencia` aprobada por una persona.

## Checklist final

- [ ] Tabla `Factura` con clave alternativa **Active**
- [ ] `SC - Conciliar factura` lee un JSON y aplica las seis reglas en orden
- [ ] Valor absoluto y tolerancia escritos sin `abs` ni `round`
- [ ] El lote da las cifras del Ejercicio 4 (13 filas, 28.086,60 y 23.594)
- [ ] La segunda corrida del lote no crea filas nuevas
- [ ] Informe de 7 facturas por correo
- [ ] Respuestas de AI Builder escritas

## Evidencia esperada

- Captura de la tabla `Factura` con los resultados del lote
- Captura de la **Compose** `Resultado` con los `if` anidados
- Captura de la segunda corrida con el reenvío como `Duplicada`
- Tus respuestas de validación y la decisión sobre AI Builder

## Criterios de aprobación

- Las 13 facturas distintas tienen el resultado de la tabla del Ejercicio 4
- Repetir el lote **no** crea filas ni cambia importes
- Explicas por qué el orden de las reglas evita errores de índice y pagos indebidos
- No usas funciones que no existen y lo justificas con la referencia de funciones

## Competencias desarrolladas

- Leer documentos adjuntos y convertirlos en datos
- Escribir reglas de negocio con orden, tolerancias y casos límite
- Trabajar con aritmética decimal y sus límites en expresiones
- Evitar duplicados con búsqueda previa y clave alternativa
- Valorar con datos una herramienta de IA (confianza y coste)

## Reto adicional

**Reto básico:** convierte `Resultado` en una columna de opciones y filtra la vista de cuentas por pagar por ella.

**Reto intermedio:** si el importe de la factura está en `EUR`, usa una tabla de tipos de cambio para convertirlo antes de comparar (inventa los tipos; son ejercicios).

**Reto avanzado:** envía una **aprobación** para cada factura `Fuera de tolerancia` (Lab 131) y marca la fila con la respuesta.

## Preguntas de repaso

1. ¿Por qué se comprueba la **existencia** de la solicitud antes de calcular la diferencia?
2. ¿Cómo obtienes un valor absoluto si no existe `abs`?
3. ¿Qué defensa contra duplicados falla si dos ejecuciones corren a la vez?
4. ¿Qué regla pondrías para que un pago no salga sin revisión de una persona?
5. ¿Qué no te da AI Builder aunque lea perfecto la factura?

## Limpieza del laboratorio

Conserva la tabla `Factura` y `SC - Conciliar factura` (el Lab 136 usa `SC - Conciliar factura` y la tabla `Factura`). **Apaga** `SC - Conciliar lote` y borra los correos de prueba.

## Siguiente laboratorio recomendado

**Lab 136 — Soluciones y ALM**: referencias de conexión, variables de entorno (la tolerancia del 2 % deja de estar escrita en el flujo) y exportar e importar la solución.

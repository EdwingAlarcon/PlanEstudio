---
moduleId: 58
title: "Customer Insights - Data: Unificación de Perfiles y Customer 360"
level: "d365"
certification: "Dynamics 365 Customer Insights"
estimatedMinutes: 20
practiceMinutes: 130
slug: "customer-insights-data-unificacion-perfiles"
lastVerified: "2026-11"
---
*Lectura: 18-22 min · Con práctica: unos 130 min, mejor en dos sesiones (la primera hasta el diagnóstico; la segunda, la Microlección 3 y el reto de transferencia). Con trial, suma 30-45 min para registrarte y mirar. La primera vez, cuenta entre una vez y media y el doble.*

### 🎯 Objetivo
Entender qué resuelve Customer Insights - Data que Dynamics 365 Sales/Customer Service no resuelven por sí solos: unificación de perfiles desde múltiples fuentes, reglas de matching, medidas calculadas y activación de datos hacia Journeys — la capa que en este curso hasta ahora solo se nombraba, nunca se desarrollaba.

> **🔗 Relación con el Módulo 20 (si lo hiciste):** el Módulo 20 (Actividad 20.8) solo identificó, en una frase, qué
> fuentes alimentarían un perfil unificado. Este módulo es donde esa idea se desarrolla: reglas de
> matching explícitas, medidas con fórmula documentada, y activación hacia un destino — nada de esto
> existía todavía en el Módulo 20. No es requisito: este nivel es transversal.

> **Cómo está organizado este módulo:** tres microlecciones con práctica entre medias. En la primera separas, en tres fuentes reales de un negocio, qué es **perfil** (se unifica) y qué es **actividad** (se relaciona con el perfil). En la segunda diseñas y aplicas a mano reglas de matching con los nombres de la herramienta. Después diagnosticas una unificación que fusionó a cientos de clientes distintos, empezando por el síntoma. En la tercera **decides y defiendes** medidas, segmento, activación y gobierno (no hay una única respuesta correcta: la evidencia es tu decisión escrita con sus razones) y cierras con un reto de transferencia en otro negocio.
>
> **Antes de empezar, necesitas:**
> - Recomendado: el Módulo 57 (el mapa del ecosistema). Ningún módulo de los niveles de certificación es requisito.
> - Papel, Excel o una hoja de cálculo: todas las prácticas tienen **variante en papel** con datos de ejemplo.
> - Opcional: una [trial de Customer Insights](https://learn.microsoft.com/dynamics365/customer-insights/data/trial-signup) (30 días, incluye Data y Journeys y un ambiente con datos de ejemplo). La mayoría de los alumnos no la tendrá; si la abres, úsala solo para **mirar** lo que cada microlección indica. Antes de pedirla, ten en cuenta:
>   - **No se instala en tu ambiente del curso.** La trial crea su propio ambiente (y, si te registras con un email que no es de trabajo, también una cuenta y un tenant nuevos), con datos de ejemplo que no se pueden borrar y hasta 3 GB de datos ([Learn: FAQ de la trial](https://learn.microsoft.com/dynamics365/customer-insights/data/trial-faq)).
>   - **Cómo se pide:** desde la página del producto que enlaza Learn, botón **Try for free**. Learn no es coherente sobre el email: la guía de Data y la FAQ admiten un email personal (cuenta Microsoft), mientras que la [guía de Journeys](https://learn.microsoft.com/dynamics365/customer-insights/journeys/trial-signup) pide uno de trabajo o de escuela y, si no lo tienes, sugiere crear antes una trial de Office 365 E5. Si el formulario rechaza tu email personal, ese es el camino.
>   - **Duración:** 30 días, ampliable **una vez** desde la propia app a partir del día 23. Solo puede haber una trial de autoservicio activa por tenant; no se puede reiniciar.
>   - **Copilot:** las funciones de Copilot de Customer Insights - Data solo están disponibles en ambientes de las regiones Estados Unidos y Suiza ([Learn](https://learn.microsoft.com/dynamics365/customer-insights/data/segments-copilot)); elige la región al registrarte si quieres verlas.
>   - Ninguna práctica la exige: cada una tiene variante en papel.
> - Los datos de las prácticas son **ilustrativos**.

### 📖 Conceptos Clave
- **Por qué Customer Insights - Data no es "otro CRM":** Sales y Customer Service ya tienen Account/Contact con buena calidad de dato transaccional, pero ninguno de los dos, por sí solo, combina eso con fuentes externas (facturación, uso de producto, tickets de un sistema legado). Customer Insights - Data existe para construir un perfil unificado del cliente cruzando esas fuentes, no para reemplazar Sales/Service.
- **Fuentes de datos:** Dataverse (Account/Contact/Case/Opportunity), tablas de Dynamics 365, archivos planos (CSV de un sistema de billing legado), data lakes, o APIs de sistemas externos. Learn recomienda conectores que se **adjuntan** a los datos (Dataverse, Azure Data Lake Storage con tablas Delta o Common Data Model, Fabric OneLake) frente a los que **copian** los datos (los conectores de Power Query), porque copiar introduce retrasos cuando la fuente cambia ([Learn: fuentes de datos](https://learn.microsoft.com/dynamics365/customer-insights/data/data-sources)). Cada fuente se ingiere como una o varias tablas con su propio esquema. Antes de combinarlas, en la unificación se describe cada columna de perfil con un **tipo** (por ejemplo `Person.FullName`, `Location.City` o `Identity.Service.Email`) para que el sistema sepa qué representa ([Learn: describir los datos de cliente](https://learn.microsoft.com/dynamics365/customer-insights/data/data-unification-map-tables)).
- **Perfil frente a actividad:** las tablas con datos de **quién es** el cliente (nombre, email, teléfono, dirección) entran en la unificación. Las de **lo que hizo** (compras, devoluciones, llamadas, encuestas) no: Learn pide no incluir en la unificación datos de actividad con relación uno a muchos con el cliente, y configurarlos aparte como **actividades** (**Data** > **Activities** > **Configure activities**), relacionadas con el perfil por una clave y mostradas en su línea de tiempo. Los tipos semánticos de actividad que ofrece son *Feedback*, *Loyalty*, *SalesOrder*, *SalesOrderLine* y *Subscription*, más *Other* o uno propio ([Learn: actividades](https://learn.microsoft.com/dynamics365/customer-insights/data/activities)).
- **Ingesta:** el proceso de traer los datos de cada fuente hacia el entorno de Customer Insights, con un refresco programado. Una fuente de facturación que cambia una vez al día no necesita refrescarse más a menudo; lo que importa es documentar qué tan "al día" está cada fuente cuando se lee una medida. Al ingerir, el sistema hace un **perfilado** básico de las columnas (frecuencia de valores repetidos), que se consulta en **Data** > **Tables**, abriendo la tabla, pestaña **Columns**, icono de la columna **Summary** de cada campo: es la forma de descubrir valores de relleno como un nombre "Enter your name" repetido en miles de filas antes de usarlos para hacer matching ([Learn](https://learn.microsoft.com/dynamics365/customer-insights/data/data-sources#data-profiling)).
- **Unificación de perfiles (identity resolution):** el proceso de decidir que dos o más registros de fuentes distintas representan al mismo cliente. No es un simple `JOIN` por ID, porque las fuentes rara vez comparten una clave — se combinan reglas de coincidencia exacta (mismo email) y reglas difusas (nombre + empresa + teléfono parecidos) con un umbral de confianza. En Customer Insights - Data tiene cuatro pasos: **datos de cliente** (tablas, clave primaria y tipo de cada columna), **deduplicación** dentro de cada tabla, **reglas de matching** entre tablas y **vista unificada** (qué columnas se incluyen o se fusionan). Cada perfil resultante recibe un **CustomerId** que se mantiene entre ejecuciones salvo que dos perfiles se fusionen o uno se divida; en ese caso el campo **PreviousCustomerId** guarda el anterior ([Learn: unificación](https://learn.microsoft.com/dynamics365/customer-insights/data/data-unification)).
- **Reglas de matching — cómo funcionan en la herramienta** ([Learn: reglas de matching](https://learn.microsoft.com/dynamics365/customer-insights/data/data-unification-match-tables)):
  - **Orden de tablas:** la primera es la **tabla primaria**, base de los perfiles; Learn recomienda la de datos de perfil más completos y fiables. Cada tabla solo puede coincidir con las que tiene por encima.
  - **Reglas y condiciones:** una regla tiene una o más condiciones, y las condiciones se unen con **AND** (deben cumplirse todas). Las reglas se prueban **en orden**: la segunda solo se usa si la primera no encontró coincidencia. Por eso "email O teléfono" se escribe como **dos reglas**, no como dos condiciones de una regla.
  - **Normalización** por condición: por ejemplo **Text to lower case**, **Whitespace**, **Type - Phone** (convierte formatos de teléfono a dígitos; ojo: el código de país cuenta, así que un número con código de país no coincide con el mismo número sin él), **Type - Name** (variantes comunes de nombres), **Type - Organization** (quita palabras como "corp" o "ltd"), **Alias mapping** y **Custom bypass** (una lista de valores que nunca deben usarse para unir, como un teléfono de relleno). Esas dos listas no se escriben en la regla: se descarga una plantilla desde el botón **Custom**, se rellena, se ingiere como una fuente de datos más (**Data** > **Data sources**) y después se elige **Custom bypass** o **Alias mapping** en la normalización de la condición.
  - **Precisión:** **Basic** con *Low (30%)*, *Medium (60%)*, *High (80%)* o *Exact (100%)*, o **Custom** con el porcentaje que elijas. Una precisión baja une más registros y aumenta las fusiones erróneas.
  - **Include all records:** los registros de esa tabla que no coinciden con nada se mantienen como perfiles propios (*singletons*) en lugar de quedar fuera.
  - **Excepciones** y condiciones personalizadas (**Always match**, **Never match**) para los casos raros de falsos positivos y falsos negativos.
- **Reglas de matching — ejemplo concreto:** para unificar un Contact de Dataverse con un registro de facturación legado, una combinación razonable es: **regla 1** `email` con **Text to lower case**, precisión *Exact*; **regla 2** `teléfono` con **Type - Phone**, *Exact*, **Y** `nombre` con **Type - Name**, con una precisión que se calibra probando con muestras reales. Sin reglas explícitas como estas, el sistema puede crear perfiles duplicados (el mismo cliente aparece dos veces) o fusionar por error a dos clientes distintos con nombres parecidos — ambos son errores costosos, pero de naturaleza opuesta.
- **Enriquecimiento:** una vez unificado el perfil, se le agregan atributos derivados que ninguna fuente tenía por sí sola — por ejemplo, "categoría de cliente" calculada a partir del valor combinado de Sales + facturación, no solo del campo nativo de una tabla.
- **Medidas (measures) — ejemplo concreto:** una medida es un valor calculado sobre el perfil unificado, no un campo capturado. Ejemplo: `Valor de vida del cliente (LTV) = suma de Opportunities ganadas (Sales) + suma de facturas pagadas (billing) de los últimos 24 meses`. Otra medida común: `Casos abiertos en los últimos 90 días` (Customer Service) como indicador de riesgo de insatisfacción. Estas medidas alimentan segmentos y journeys que ningún campo nativo de Sales/Service podría calcular solo. Se crean en **Insights** > **Measures** > **New** > **Build your own** con funciones como **Sum**, **Count** o **Average**, filtros y dimensiones, y hay tres tipos, uno de ellos con una variante para Dataverse ([Learn: measure builder](https://learn.microsoft.com/dynamics365/customer-insights/data/measure-builder)):
  - **Customer attribute:** un único valor por cliente; se guarda como columna de la tabla *Customer_Measure* y se ve en la ficha del cliente. También llega a Dataverse, pero Learn aclara que en un formato que no es fácil de usar desde otras apps de Dynamics 365.
  - **Customer measure table (para Journeys y otras apps de Dataverse):** la variante de medida por cliente pensada para que la consuman Customer Insights - Journeys y otras aplicaciones de Dataverse.
  - **Customer measure:** uno o varios valores por cliente divididos por otras dimensiones (por ejemplo, gasto por cliente y por categoría), en su propia tabla.
  - **Business measure:** un valor sin relación con un perfil concreto (por ejemplo, ventas totales por región).
  - El tipo de *Customer attribute* o *Customer measure* no se puede cambiar después de ejecutar o guardar la medida, así que se decide antes.
- **Segmentación en la capa Data vs. en Journeys:** un segmento en Customer Insights - Data se define sobre el perfil unificado y sus medidas (ej. "LTV > 20000 Y casos abiertos = 0"); ese segmento puede luego activarse hacia Journeys para orquestar comunicación, o hacia otros destinos (una audiencia de Ads, un reporte de Power BI). La segmentación del Lab 58 (Journeys) ya asume que este perfil unificado existe — este módulo cubre cómo se construye antes de llegar a esa etapa.
- **Activación de datos:** el paso de llevar un segmento o medida de Customer Insights - Data hacia un sistema de destino (Journeys para journeys en tiempo real, Dataverse para que Sales vea la medida en el formulario de Account, o una plataforma de publicidad). Sin activación, el perfil unificado es solo un reporte — el valor real aparece cuando un segmento dispara una acción en otro sistema. En la herramienta hay dos caminos: los resultados ya se escriben como tablas en Dataverse (por ejemplo *msdynci_customerprofile*, *msdynci_segmentmembership* y *msdynci_customermeasure*), y la página **Exports** envía segmentos o tablas completas a otros sistemas; cada export necesita una **connection** que configura un administrador, y Learn advierte que algunos destinos exigen campos concretos (como el email) o los rechazan si el segmento es demasiado grande ([Learn: exports](https://learn.microsoft.com/dynamics365/customer-insights/data/export-destinations)).
- **Customer 360:** el resultado visible de todo lo anterior — una vista consolidada de un cliente que muestra, en un solo lugar, su relación comercial (Sales), su historial de servicio (Customer Service), su valor financiero (billing/measures) y su estado en journeys activos, sin que el usuario tenga que abrir 3 sistemas distintos.
- **Privacidad y gobierno de datos:** unificar fuentes externas (sobre todo archivos o sistemas legados) exige revisar con Legal/Compliance qué datos se pueden ingerir, cuánto tiempo se retienen, y qué propósito declarado tiene cada uso — igual que el consentimiento del Lab 58, pero aplicado también a las fuentes de origen, no solo al canal de comunicación final.
- **Límites — cuándo NO se necesita Customer Insights - Data:** si toda la información relevante del cliente ya vive en Dataverse (Sales + Service) y no hay fuentes externas que unificar, una vista o un reporte de Power BI sobre Dataverse puede ser suficiente — introducir Customer Insights - Data sin una necesidad real de unificación multi-fuente es sobre-ingeniería.
- **Separación 2026 Data vs. Journeys:** Data construye el perfil unificado, medidas y segmentos; Journeys orquesta comunicaciones en tiempo real. El Módulo 64 profundiza Journeys, por lo que aquí el foco es identity resolution, calidad, gobierno, medidas y activación.
- **Copilot en Customer Insights - Data (estado a noviembre de 2026):** Learn describe tres funciones: **dialog with data** (preguntas en lenguaje natural sobre tus clientes), respuestas a preguntas sobre el producto y creación de segmentos con Copilot. Esta última era *preview* y Microsoft la **retiró el 2 de noviembre de 2026**; los segmentos se crean con *quick segments* o con el **segment builder**, y los ya creados con Copilot siguen funcionando ([Learn: funciones de Copilot](https://learn.microsoft.com/dynamics365/customer-insights/data/copilot-overview); [Learn: segmentos con Copilot](https://learn.microsoft.com/dynamics365/customer-insights/data/segments-copilot)). Ninguna de esas funciones diseña por ti las reglas de matching: la unificación sigue siendo una decisión que documentas tú.
- **Requisitos reales de práctica:** diseñar reglas de matching y medidas puede hacerse sin tenant. Validar ingesta, unificación, medidas, segmentos y activación requiere Customer Insights - Data habilitado, fuentes de datos accesibles, permisos y cumplimiento de privacidad.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Perfil o actividad: preparar las fuentes antes de unificar

**¿Qué vas a aprender?** A decidir, columna por columna, qué entra en la unificación, qué se configura como actividad, cuál es la clave primaria de cada tabla y qué tipo describe cada columna; y a buscar valores de relleno antes de que arruinen el matching.

**¿Por qué existe esto?** La mitad de los problemas de un Customer 360 nacen antes de la primera regla: una tabla de compras metida como si fuera de clientes, una clave primaria con duplicados, un teléfono "000-0000" en miles de filas.

**Datos de la práctica (ilustrativos)** — una cadena de tiendas con tres fuentes:

| Fuente | Columnas |
|---|---|
| `Contact` (Dataverse) | contactid, fullname, emailaddress1, telephone1, address1_city |
| `Clientes_POS` (CSV diario de las tiendas) | id_cliente_pos, nombre, telefono, tienda_alta |
| `Tickets_POS` (CSV diario) | numero_ticket, id_cliente_pos, fecha, importe |

Del perfilado de `Clientes_POS` sabes que `telefono` vale `000-0000` en 1.214 filas y que `nombre` vale `CLIENTE MOSTRADOR` en 380.

**Práctica (20 min, en papel o en una hoja de cálculo):**

1. Para cada tabla, decide: ¿va al paso de datos de cliente de la unificación o a **Activities**? Justifica con la regla de Learn (datos de perfil frente a actividad uno a muchos).
2. Para cada tabla de cliente, elige la **clave primaria** (Learn: sin duplicados, vacíos ni nulos) y asigna un **tipo** a cada columna de perfil (por ejemplo `Person.FullName`, `Identity.Service.Email`, `Location.City`; para el teléfono, el tipo de teléfono que te proponga la herramienta).
3. Para `Tickets_POS`, elige el tipo de actividad (Learn ofrece *SalesOrder*) y la columna que la relaciona con el cliente.
4. Escribe qué harás con `000-0000` y `CLIENTE MOSTRADOR` antes de crear cualquier regla.
5. Identifica un dato de una fuente externa hipotética (por ejemplo, historial de compras de un sistema de e-commerce legado) que NO deberías ingerir sin antes consultar con Legal/Compliance, y explica por qué.

**Si tienes la trial (opcional, 10 min, solo mirar):** en el ambiente de ejemplo ve a **Data** > **Tables**, abre una tabla de clientes, entra en la pestaña **Columns** y, en la fila de un campo, usa el icono de la columna **Summary** para ver su perfilado; después ve a **Data** > **Activities** y anota qué actividades trae configuradas y de qué tipo.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tablas que van a la unificación y tabla que va a Activities | ___ |
| Clave primaria de cada tabla de cliente y por qué es válida | ___ |
| Tipo asignado a nombre, email, teléfono y ciudad | ___ |
| Tipo de actividad de `Tickets_POS` y columna que la relaciona | ___ |
| Qué haces con `000-0000` y `CLIENTE MOSTRADOR` | ___ |
| El dato externo que pasaría antes por Legal/Compliance y por qué | ___ |
| (Trial) Una actividad configurada en el ambiente de ejemplo y su tipo | ___ |

---

## 🧩 Microlección 2 — Reglas de matching: orden, condiciones, normalización y precisión

**¿Qué vas a aprender?** A escribir reglas de matching con los nombres que usa la herramienta y a aplicarlas a mano para ver, antes de ejecutar nada, qué perfiles saldrían.

**¿Por qué existe esto?** El Caso Real de este módulo es una regla que asumió que el email bastaba. La regla de matching no se ajusta "cuando aparezcan duplicados": se diseña con muestras de los clientes difíciles (los que no tienen email, los que tienen un teléfono de relleno) antes de conectar las fuentes.

**Ahora haz algo — micropráctica (7 min):** → **[Diseñar las reglas de matching de un perfil unificado](/practica/ip-d365-007-disenar-reglas-de-matching)**. Selecciona las decisiones correctas y fíjate en la consecuencia de cada una: varias opciones incorrectas "suenan" bien.

**Práctica (25 min, en papel):** aplica a mano estas reglas a las seis filas. `Contact` es la tabla primaria y `Clientes_POS` la segunda.

- **Regla 1:** email, **Text to lower case**, *Exact*.
- **Regla 2:** teléfono, **Type - Phone**, *Exact* **Y** nombre, **Type - Name**, *High (80%)*.
- **Custom bypass** para `000-0000`. **Include all records** activado en `Clientes_POS`.

| Tabla | Fila | Nombre | Email | Teléfono |
|---|---|---|---|---|
| Contact | C-1 | Ana Rivera | ana.rivera@contoso.com | +57 601 555 0142 |
| Contact | C-2 | Luis Mendoza | (vacío) | 601 555 0198 |
| Contact | C-3 | Carla Ibáñez | carla@litware.com | 000-0000 |
| Clientes_POS | P-1 | ANA RIVERA | Ana.Rivera@Contoso.com | 6015550142 |
| Clientes_POS | P-2 | Luis Mendoza | (vacío) | 601-555-0198 |
| Clientes_POS | P-3 | Marta Gil | (vacío) | 000-0000 |

1. Para cada fila de `Clientes_POS`, di qué regla la une (o que ninguna) y con qué fila de `Contact`.
2. Cuenta cuántos perfiles unificados salen en total. Recuerda: **Include all records** conserva las filas sin coincidencia.
3. Responde: ¿qué habría pasado con P-3 sin el **Custom bypass**? ¿Y si la regla 2 tuviera solo la condición de teléfono?
4. Learn indica que, con **Type - Phone**, un número con código de país no coincide con el mismo número sin él. Mira C-1 y P-1: ¿los une la regla 2? ¿Importa, si la regla 1 ya los unió? Escribe qué harías si en otra fuente faltara el email y el código de país viniera solo en una de las dos.
5. La precisión *High (80%)* de la regla 2 es una suposición: escribe con qué muestra la validarías antes de ponerla en producción.

**Si tienes la trial (opcional, 10 min, solo mirar):** ve a **Data** > **Unify**. Si el ambiente de ejemplo ya está unificado, la página muestra un resumen por paso (datos de cliente, deduplicación, matching y vista unificada); abre el de las reglas de matching (en la herramienta, la página se llama **Matching rules**) y anota la tabla primaria, cuántas reglas hay y qué normalización y precisión usa la primera. Si para verlas tienes que entrar en modo edición, sal sin guardar: **no ejecutes** la unificación ni cambies nada. Si el ambiente no está unificado, anota "sin unificación en el ambiente de ejemplo" y quédate con la variante en papel.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| P-1, P-2 y P-3: regla que las une (o ninguna) y fila de Contact | ___ |
| Número total de perfiles unificados | ___ |
| P-3 sin Custom bypass, y con la regla 2 solo por teléfono | ___ |
| C-1 y P-1 ante la regla 2, y qué harías con el código de país | ___ |
| Muestra con la que validarías la precisión de la regla 2 | ___ |
| (Trial) Tabla primaria, número de reglas y configuración de la primera | ___ |

---

## 🔧 Diagnosticar — el perfil que juntó a más de mil clientes

Antes de la Microlección 3, resuelve este caso empezando por el síntoma:

**[Diagnosticar: un perfil unificado con cientos de compras ajenas](/practica/ip-d365-008-perfil-que-fusiono-a-cientos)**

Síntoma: tras la primera unificación con las tiendas, "Ana Rivera" encabeza el segmento de mejores clientes con 2.380 compras en 12 meses, aunque ella dice que compra dos veces al año. Es el error opuesto al del Caso Real: no faltan uniones, sobran. Formula tu hipótesis antes de ver la causa: ¿qué regla juntó esas filas, qué dato lo delata y cómo compruebas que la corrección funcionó?

---

## 🧩 Microlección 3 — Medidas, segmento y activación: decidir y defender (sin pasos)

**¿Qué vas a aprender?** A elegir el tipo de medida correcto, a convertirla en un segmento que dispare una acción en otro sistema y a dejar escrito el gobierno de cada fuente, con criterios explícitos.

**¿Por qué existe esto?** Un Customer 360 que no activa nada es un reporte caro. Y una medida mal tipada (un valor por sede guardado como si fuera por cliente) o sin fórmula documentada no se puede auditar cuando el número "no cuadra".

> **Caso (ilustrativo):** la misma cadena de tiendas quiere (a) que el vendedor vea en el Account de Dataverse cuánto compró cada cliente en tienda en los últimos 12 meses; (b) un indicador de ventas por tienda para el comité de operaciones; (c) una campaña de reactivación para clientes que compraban cada mes y llevan 90 días sin comprar. Tiene además una hoja interna donde los cajeros anotan quejas con comentarios sobre el cliente.
> **Escribe:**
> 1. Una medida propia (no uses el ejemplo de LTV de los Conceptos Clave) que combine datos de al menos 2 fuentes distintas, con su fórmula en una línea, y el **tipo** de medida (Customer attribute, Customer measure o Business measure) que eliges para (a) y para (b).
> 2. El segmento de (c) sobre el perfil unificado usando tu medida, a qué destino lo activarías y qué acción dispararía ahí.
> 3. Qué haces con la hoja de quejas: ¿se ingiere?, ¿para qué medida?, ¿se activa hacia algún canal?
> 4. Una matriz de "fuente → propósito → retención → base legal/consentimiento → destino de activación" para al menos 3 fuentes.

Contrasta tu decisión con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| El tipo de medida encaja con su granularidad | (a) es un valor por cliente que además debe verse en una app de Dataverse; (b) no depende de un cliente; lo justificas con la definición de cada tipo de Learn |
| La fórmula es auditable | Tu medida tiene función (Sum, Count...), fuentes, filtro de tiempo y cada cuánto se refresca cada fuente |
| El segmento dispara una acción | Nombras el destino y lo que pasa allí; si es un export, qué campo exige (por ejemplo, el email) |
| Lo interno no sale hacia el cliente | La hoja de quejas, si se usa, solo alimenta una medida interna y nunca un canal |
| El gobierno está escrito antes de conectar | Cada fuente de la matriz tiene propósito, retención y base legal, y quién lo aprueba |
| Sabes cuándo no hace falta | Una línea: qué tendría que ser cierto para que bastara un reporte sobre Dataverse |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu medida: nombre, fórmula, fuentes y tipo para (a) | ___ |
| Tipo elegido para (b) y por qué | ___ |
| Segmento de (c), destino y acción que dispara | ___ |
| Decisión sobre la hoja de quejas | ___ |
| Matriz de gobierno (3 fuentes) | ___ |
| Cuándo no haría falta Customer Insights - Data aquí | ___ |

---

## 🔁 Reto de transferencia — otro negocio: una cadena de gimnasios

El mismo método en un caso que no se parece a los anteriores: socios en Dataverse, una app de reservas de clases, torniquetes que registran cada entrada, pagos mensuales y una hoja de los entrenadores con lesiones y observaciones de salud. El objetivo es un segmento de socios en riesgo de baja y un indicador de ocupación por sede.

**[Transferir: Customer 360 para una cadena de gimnasios](/practica/ip-d365-009-transferir-cadena-gimnasios)** — decide qué es perfil y qué es actividad, cómo se unen las fuentes, de qué tipo es cada medida y qué dato no entra sin Legal. Si solo memorizaste "todo se unifica", este reto te lo va a mostrar: los torniquetes no identifican a nadie por la hora de entrada.

Cierra el reto con **media página** contrastada con la rúbrica de la Microlección 3: reglas de matching en orden, medidas con su tipo, el segmento con su destino y la decisión escrita sobre la hoja de salud.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tablas de perfil y tablas de actividad | ___ |
| Reglas de matching en orden, con normalización y precisión | ___ |
| Medidas con su tipo (visitas, ocupación por sede) | ___ |
| Segmento de riesgo de baja y su destino | ___ |
| Decisión sobre la hoja de salud y quién la aprueba | ___ |

---

### 💼 Casos Reales de Negocio
Una cadena de retail unificó su Dataverse (Sales/Service) con su sistema de punto de venta (POS) legado sin definir una regla de matching explícita — el equipo asumió que el email bastaba. El resultado: el 12% de los clientes con compras en tienda física (sin email registrado en el POS) quedaron sin unificar, apareciendo como "nuevos" en cada visita y perdiendo su historial de fidelización. La corrección requirió agregar una regla de matching secundaria por teléfono + nombre normalizado, y reprocesar la ingesta completa. La lección: la regla de matching no es un detalle técnico menor, es una decisión de negocio que determina si el Customer 360 realmente representa al cliente.

### ✅ Buenas Prácticas
- Definir la regla de matching ANTES de conectar fuentes, no ajustarla reactivamente después de ver duplicados en producción.
- Revisar el perfilado de cada columna de matching y poner los valores de relleno (teléfonos o emails ficticios) en **Custom bypass** antes de la primera unificación.
- Escribir "email O teléfono" como dos reglas en orden, de la más fiable a la de respaldo, y no como dos condiciones de una misma regla (que se unen con AND).
- Documentar cada medida con su fórmula exacta y las fuentes que combina — una medida sin fórmula documentada es imposible de auditar cuando un número "no cuadra".
- Tratar la activación como el objetivo real del proyecto, no la unificación en sí misma — un Customer 360 que no activa nada hacia Journeys, Dataverse o reporting no genera valor de negocio.
- Involucrar a Legal/Compliance en la decisión de qué fuentes externas se ingieren, con el mismo rigor que el consentimiento de canal del Lab 58.
- Mantener una matriz de linaje: de dónde viene cada atributo, quién lo aprueba, cómo se refresca y dónde se activa.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Asumir que el email siempre existe en todas las fuentes | No auditar la calidad de datos de la fuente antes de definir el matching | Definir una regla de matching secundaria (teléfono, nombre + empresa) para registros sin email |
| Un perfil reúne a cientos de personas distintas | Una regla con una sola condición sobre un valor de relleno repetido (teléfono 000-0000) | **Custom bypass** para ese valor, segunda condición en la regla y nueva ejecución; comprobar la división con **PreviousCustomerId** |
| Email y teléfono como dos condiciones de una misma regla | Creer que las condiciones se combinan con OR | Las condiciones de una regla se unen con AND: crear dos reglas en orden |
| Meter la tabla de compras en la unificación | Confundir datos de perfil con datos de actividad | Configurarla en **Data** > **Activities** y relacionarla con el perfil por su clave |
| Medida sin fórmula documentada | Se calcula "a ojo" en una consulta ad-hoc no repetible | Documentar la fórmula exacta y las fuentes de cada medida antes de usarla en un segmento |
| Un indicador por tienda guardado como Customer attribute | No distinguir los tipos de medida | Valor por cliente → Customer attribute; valor sin cliente concreto → Business measure; el tipo se decide antes de guardar |
| Unificar fuentes externas sin revisión de Legal/Compliance | Se trata como un problema puramente técnico | Aplicar el mismo proceso de aprobación de propósito y retención que al consentimiento de canal |
| Construir Customer 360 sin definir ningún destino de activación | Foco en la unificación como fin en sí mismo | Definir desde el diseño inicial hacia dónde se activará cada segmento o medida |
| Mezclar diseño de Data con diseño de Journeys | Se confunde perfil con comunicación | Documentar qué queda en Data y qué se ejecuta en Journeys |

### 🧪 Criterios de Validación
- [ ] Separé en tres fuentes qué es perfil y qué es actividad, con clave primaria y tipo por columna, y decidí qué hacer con los valores de relleno
- [ ] Apliqué a mano dos reglas de matching (con normalización, precisión y Custom bypass) y conté los perfiles resultantes
- [ ] Diagnostiqué el perfil que fusionó a cientos de clientes formulando una hipótesis antes de ver la causa
- [ ] Definí una medida propia con su fórmula, sus fuentes y su tipo, y un segmento con su destino de activación
- [ ] Identifiqué un dato externo que requeriría revisión de Legal/Compliance antes de ingerirse y escribí la matriz de gobierno de 3 fuentes
- [ ] Completé el reto de los gimnasios y documenté qué requiere Customer Insights - Data real para validar la práctica

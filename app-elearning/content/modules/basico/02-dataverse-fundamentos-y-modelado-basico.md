---
moduleId: 2
title: "Dataverse - Fundamentos y Modelado Básico"
level: "basico"
certification: "PL-900"
estimatedMinutes: 15
practiceMinutes: 120
slug: "dataverse-fundamentos-y-modelado-basico"
lastVerified: "2026-11"
---
*Duración: 2-3 semanas · Lectura: 8-10 min · Con práctica: unos 120 min con el ambiente listo (la primera vez, cuenta entre el doble y el triple)*

### 🎯 Objetivo
Dominar el modelado de datos en Dataverse para soportar aplicaciones de negocio.

### 📖 Conceptos Clave
- **Tabla (Table)**: el lugar donde guardas un tipo de dato, como una hoja de Excel con estructura fija (por ejemplo, "Solicitudes TI").
    - **Standard (estándar)**: tablas que ya vienen con Power Apps o Dynamics 365, como `Contact`.
    - **Custom (personalizada)**: tablas que creas tú o tu equipo, como `Solicitud TI`.
    - **Virtual Table (tabla virtual)**: tabla cuyos datos viven fuera de Dataverse (por ejemplo, en SQL o SharePoint) y se muestran sin copiarlos.
- **Registro (Row)**: una fila de la tabla; por ejemplo, una solicitud concreta.
- **Columna (Column)**: cada dato que guardas de un registro, como una columna de Excel. Tipos que usarás aquí:
    - **Text / Multiline Text**: texto de una línea / texto largo de varias líneas.
    - **Whole Number**: número entero, sin decimales.
    - **Choice**: lista fija de opciones; la persona elige una sola.
    - **Lookup**: apunta a un registro de otra tabla (por ejemplo, a un contacto).
    - **Date and Time / Date Only**: fecha con hora / solo fecha.
- **Relación (Relationship)**: cómo se conectan dos tablas. *One-to-Many* (uno a muchos) y *Many-to-One* (muchos a uno) son la misma relación vista desde cada lado; *Many-to-Many* (muchos a muchos) es cuando ambos lados pueden tener muchos. Ejemplo simple: una `Categoría` (ej. "Software") puede tener muchas `Solicitudes` asociadas, pero cada `Solicitud` apunta a una sola `Categoría`:
  ```
  Categoria (1) ──── tiene muchas ────▶ (N) Solicitud
     "Software"                          "Sin acceso al sistema contable"
     "Hardware"                          "Impresora offline piso 2"
  ```
- **Primary Name Column (columna principal)**: el dato que identifica a cada registro ante las personas (su "nombre"); es lo que se ve cuando otra tabla lo apunta con un Lookup.
- **Ownership (propiedad del registro)**: quién es "dueño" de cada registro. *User or team* = cada registro pertenece a una persona o equipo (útil para "mis solicitudes"). *Organization* = el registro es de todos, sin dueño individual (útil para catálogos como Categoría).
- **Required (obligatoria)**: una columna marcada como *Business required* no deja guardar el registro si está vacía.
- **Solution (solución)**: la "carpeta" donde guardas todo lo que construyes para poder moverlo a otro ambiente. *Unmanaged* (no administrada) = la que editas en tu ambiente de desarrollo; *Managed* (administrada) = la que se instala en pruebas o producción y no se edita directamente.
- **Publisher (editor)**: el "sello" con tu prefijo que Dataverse antepone al nombre interno de cada tabla y columna que creas. El prefijo se escribe `sit`, sin guion bajo; Dataverse agrega el guion bajo, y por eso los nombres internos se ven como `sit_...`. Créalo antes de la primera tabla: el nombre interno de cada elemento ya no se puede cambiar después de creado.
- **Auditing (auditoría)**: registro de quién cambió qué dato y cuándo.
- **Business Rule (regla de negocio)**: lógica sin código del tipo "si pasa esto, haz aquello" (poner un valor, mostrar un error). Su **Scope** (alcance) decide dónde se aplica: *Entity* = en los formularios y también en el servidor, aunque el dato llegue por otra vía (ej. una API o un flujo); *All Forms* = solo en los formularios de las apps model-driven.
- **View (vista)**: una lista guardada de registros con filtro, columnas y orden definidos (por ejemplo, "solo las solicitudes abiertas").

**Otras palabras que aparecen en este módulo:**

| Palabra | En una frase |
|---|---|
| **Model-driven (app)** | Un tipo de app que Power Apps arma sola a partir de tus tablas, con listas (vistas) y formularios. La construirás en el Lab 04. |
| **Formulario** | La pantalla donde ves y editas un solo registro, campo por campo. |
| **Hub (de la tabla)** | La página que se abre al hacer clic en una tabla. Desde ahí llegas a sus columnas, relaciones, vistas, reglas y datos. |
| **Cardinalidad** | Cuántos registros de una tabla se pueden unir con cuántos de la otra: uno a muchos, muchos a uno o muchos a muchos. |
| **Autonumber** | Un tipo de columna de texto que Dataverse llena solo con un número o código nuevo cada vez que se crea un registro. |
| **Calculated column (columna calculada)** | Una columna cuyo valor sale de una fórmula sobre otras columnas, en vez de escribirse a mano. |
| **Publish / Publish all customizations** | Algunos cambios (tablas, formularios, vistas) se guardan "sin publicar". Publicar los hace visibles en las apps y hace que entren en la exportación de la solución. **Publish all customizations** publica todo lo pendiente de una vez. |
| **Normalizada (tabla)** | Una tabla que guarda cada dato una sola vez, en su lugar, en vez de repetirlo en muchas filas. |

### 👨‍💻 Actividades Prácticas

> **Cómo está organizado este módulo:** alternas una idea corta, una práctica de pocos minutos y un dato real de tu propio ambiente. Los pasos de siempre (Práctica 2.1 a 2.5) siguen ahí, ahora dentro de tres bloques. Cierras con un reto en el que ya no te digo las tablas ni las columnas. Las microprácticas no necesitan tenant; las prácticas reales sí (tu ambiente del curso del Módulo 1).

> **Antes de empezar:** los nombres de botones y menús de este módulo son los de la interfaz en inglés y, donde Microsoft Learn los documenta, llevan su enlace. Power Apps cambia de vez en cuando su interfaz: si un botón no aparece con ese nombre, búscalo en la misma zona de la pantalla (la barra de comandos de arriba o el panel de la derecha) por lo que hace, no por su texto exacto. Siempre trabajas en [make.powerapps.com](https://make.powerapps.com), con tu ambiente del curso seleccionado arriba a la derecha.

## 🧩 Microlección 1 — Tablas y columnas: elegir el tipo correcto

**¿Qué vas a aprender?** Qué es una tabla, una columna y un registro, y cómo elegir el tipo de columna (texto, número, Choice, Lookup, fecha) según lo que el negocio necesita guardar.

**¿Por qué existe esto?** El tipo de una columna decide qué puedes hacer después con el dato: filtrarlo, ordenarlo, validarlo o ponerlo en un reporte. Una columna de texto donde iba un número o una lista fija parece funcionar el primer día y causa problemas al mes.

**Ejemplo pequeño:** "Prioridad" solo puede ser Baja, Media, Alta o Crítica, así que va como **Choice** (lista fija), no como texto libre donde cada persona escribiría algo distinto.

**Ahora haz algo — micropráctica (6 min):** **[Elegir tipo de columna](/practica/ip-dv-002-elegir-tipo-columna)**. Te da necesidades de negocio reales y te pide asignar el tipo de columna de Dataverse correcto a cada una.

**Práctica real en tu entorno (35 min):**

##### Práctica 2.1: Crear Tablas Personalizadas

*Caso: Sistema de Gestión de Solicitudes de TI*

**Paso 0 — Crear tu Solution y tu Publisher (antes de crear la primera tabla).** El Publisher es el "sello" que se pone en el nombre interno de todas tus tablas y columnas (como `sit_...`). Ese nombre interno no se puede cambiar después, por eso se hace primero.

1. En el menú de la izquierda selecciona **Solutions**. Si no lo ves, selecciona **…More** y búscalo ahí.
2. En la barra de comandos (la fila de botones de arriba) selecciona **New solution**. Se abre un panel a la derecha.
3. En **Display Name** escribe `Solicitudes TI`. El campo **Name** se rellena solo; déjalo como está.
4. Debajo de **Publisher**, selecciona **New publisher**. Se abre el formulario **New Publisher**.
5. Rellena:
    - **Display Name**: `SIT`
    - **Name**: `SIT`
    - **Prefix**: `sit`
    - **Choice value prefix**: no lo toques; se genera solo a partir del prefijo.
6. Selecciona **Save**. Vuelves al panel de la solución.
7. En la lista **Publisher**, comprueba que está elegido **SIT** (si no, elígelo).
8. Marca **Set as your preferred solution**. Así, lo que crees aunque no estés dentro de la solución también se guarda en ella.
9. Deja **Version** como viene y selecciona el botón de abajo del panel, **Create** o **Save**: Learn usa los dos nombres para este mismo panel ([Learn: crear una solución](https://learn.microsoft.com/power-apps/maker/data-platform/create-solution)).
10. Abre la solución **Solicitudes TI** haciendo clic en su nombre. A partir de aquí, **trabaja siempre dentro de ella**.

> **Por qué todo va dentro de la solución:** tu ambiente del curso (un Trial, en el caso general) caduca. Lo que está en tu solución lo puedes exportar y llevar a un ambiente nuevo; lo que dejes fuera se pierde cuando el ambiente se elimine. Al terminar este módulo harás tu primera exportación.

**Paso 1 — Crear la tabla "Solicitud TI"**

1. Dentro de tu solución, en la barra de comandos selecciona **New** > **Table** > **Table (advanced properties)**. (Fuera de una solución el camino es **Tables** > **New table** > **Set advanced properties**; aquí usa el de la solución.) Se abre el panel **New table**.
2. Rellena:
    - **Display name**: `Solicitud TI`
    - **Plural display name**: `Solicitudes TI`
3. Marca **Enable Attachments** (permite adjuntar notas y archivos a cada solicitud).
4. Selecciona la pestaña **Primary column** y en **Display name** escribe `Título de Solicitud`. Ojo: después de guardar la tabla ya no podrás cambiar este nombre.
5. Vuelve a la pestaña de propiedades y despliega **Advanced options**:
    - Mira **Schema name**: debe empezar por `sit_`. Si ves otro prefijo (por ejemplo, uno raro como `cr8a3_`), no estás en tu solución: cierra sin guardar y repite el Paso 0.
    - En **Record ownership** deja **User or team**.
6. Selecciona **Save**. Se abre la página de la tabla (su "hub"), con las zonas **Columns**, **Relationships**, **Views**, **Business rules**, etc.
7. **Anota el nombre interno de la columna principal `Título de Solicitud`.** Ese nombre no lo eliges tú: la pestaña **Primary column** solo deja cambiar el nombre visible y la descripción, y Dataverse genera el nombre interno al guardar la tabla. Para verlo: en el hub, zona **Columns**, selecciona la columna **Título de Solicitud**; en su panel de propiedades despliega **Advanced options** y mira **Schema name** (se ve, pero ya no se puede cambiar). Anótalo **en minúsculas**: esa es su forma de *logical name*, la que usan las expresiones de Power Automate y el conector de Power BI ([Learn: columnas](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-field-portal), [Learn: SchemaName y LogicalName](https://learn.microsoft.com/power-apps/developer/data-platform/entity-attribute-metadata)). Los Módulos 5 y 6 lo usan con un **ejemplo**, `sit_titulodesolicitud`; donde lo veas, escribe el tuyo. En Power Fx y en los diseñadores no lo necesitas: ahí eliges la columna por su nombre visible.

**Paso 2 — Agregar las columnas.** Vas a crear 9 columnas: 7 de forma "normal" y 2 Lookup (las Lookup van en el Paso 3).

| Columna (Display name) | Data type | Detalle |
|---|---|---|
| Descripción | Multiline Text | — |
| Categoría | Choice | Opciones: Hardware, Software, Red, Accesos, Otro · Required |
| Prioridad | Choice | Opciones: Baja, Media, Alta, Crítica · Default choice = Media |
| Estado | Choice | Opciones: Nueva, En Proceso, Resuelta, Cerrada · Required · Default choice = Nueva |
| Fecha Solicitud | Date and Time | — |
| Fecha Resolución | Date Only | — |
| SLA Horas | Whole Number | — |
| Solicitante | Lookup → Contact | Paso 3 |
| Asignado a | Lookup → User | Paso 3 |

*Para una columna simple (Descripción, Fecha Solicitud, Fecha Resolución, SLA Horas):*

1. En el hub de la tabla, selecciona la zona **Columns**.
2. En la barra de comandos selecciona **New column** ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-field-portal)). Se abre el panel **Column properties**.
3. En **Display name** escribe el nombre de la tabla de arriba (por ejemplo, `Descripción`).
4. En **Data type** elige el tipo de la tabla. El menú agrupa los tipos por familias; si no ves el tipo a la primera, despliega la familia correspondiente (texto, número, fecha).
5. Deja **Required** en **Optional**.
6. Selecciona **Save** (si tu panel muestra **Done**, pulsa **Done** y, al terminar con todas las columnas, **Save Table**: las columnas no se crean hasta que guardas la tabla).

*Para una columna Choice (Categoría, Prioridad, Estado), con Required y valor por defecto:*

1. **New column** y en **Display name** escribe, por ejemplo, `Estado`.
2. En **Data type** elige **Choice** > **Choice**.
3. En **Sync with global choice?** elige **No** (estas opciones solo las usa esta columna).
4. Escribe la primera opción en **Label** (por ejemplo, `Nueva`). El número de **Value** se genera solo: no lo cambies.
5. Selecciona **New choice** para añadir la siguiente opción y escribe su **Label**. Repite hasta tener todas las opciones de la tabla de arriba, en ese orden.
6. **Default choice**: elige el valor por defecto si la columna lo lleva (`Nueva` para Estado, `Media` para Prioridad). Para Categoría déjalo sin valor por defecto.
7. **Required**: para **Categoría** y **Estado** elige **Business required** (no deja guardar una solicitud sin ese dato). Para Prioridad deja **Optional**.
8. **Save** (o **Done** y luego **Save Table**).

> **No te confundas:** toda tabla trae de fábrica una columna del sistema llamada **Status** (con los valores Active/Inactive). Tu columna **Estado** es otra distinta, creada por ti. En los filtros y reglas de este módulo usa siempre **Estado**.
>
> **Si tu ambiente está en español**, esa columna del sistema se llama **Estado** (y su compañera **Status Reason** se llama **Razón para el estado**). Tendrás dos columnas "Estado": la tuya se distingue porque la creaste tú (sus opciones son Nueva, En Proceso, Resuelta y Cerrada; la del sistema solo tiene los dos valores de activo e inactivo). En las fórmulas, IntelliSense (la lista de sugerencias mientras escribes) te mostrará las dos: elige la tuya.

*Si después quieres cambiar Required en una columna ya creada:* en **Columns** selecciona la columna, cambia **Required** y guarda. El nombre interno y el **Data type** ya no se pueden cambiar una vez guardada la columna (salvo convertir texto en autonumber).

**Paso 3 — Crear las dos columnas Lookup (Solicitante y Asignado a).** Una Lookup crea a la vez una relación entre dos tablas, así que se hace desde **Relationships**:

1. En el hub de la tabla **Solicitud TI**, selecciona la zona **Relationships**.
2. En la barra de comandos selecciona **New relationship** > **Many-to-one** ("muchas solicitudes apuntan a un mismo contacto").
3. En el panel, en **Related** (tabla relacionada) elige **Contact**.
4. En **Lookup column display name** escribe `Solicitante`.
5. Deja **Lookup column requirement** en **Optional**.
6. Selecciona **Done** y luego **Save table**. La columna Lookup `Solicitante` queda creada en **Solicitud TI** (la tabla "muchos").
7. Repite los pasos 2 a 6 con **Related** = **User** (los usuarios de tu ambiente) y **Lookup column display name** = `Asignado a`.
8. Comprueba en **Columns** que ya aparecen `Solicitante` y `Asignado a` con tipo **Lookup**.

> **Otra forma de llegar a lo mismo:** desde **Columns** > **New column** con **Data type** = **Lookup** > **Lookup**. Crear una columna Lookup crea siempre una relación Many-to-one.

**Ahora diagnostica — micropráctica (6 min):** **[Corregir modelo incorrecto](/practica/ip-dv-003-corregir-modelo-incorrecto)**. Parte de un síntoma (una columna creada con el tipo equivocado) y te pide decidir la corrección segura antes de ver la solución.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Nombre exacto de la tabla que creaste y su Primary column | ___ |
| Nombre interno (Schema name, en minúsculas) de la columna principal Título de Solicitud | ___ |
| Las 9 columnas con su tipo (por ejemplo, Prioridad = Choice) | ___ |
| Las dos columnas que marcaste como Required y los dos valores por defecto que configuraste | ___ |

---

## 🧩 Microlección 2 — Relaciones: cómo se conectan las tablas

**¿Qué vas a aprender?** Cuándo una relación es de uno a muchos y cuándo de muchos a muchos, y de qué lado vive el Lookup.

**¿Por qué existe esto?** En vez de repetir los datos de una categoría en cada solicitud, guardas la categoría una vez y la apuntas desde cada solicitud. Así, si la categoría cambia de nombre, cambia en un solo lugar.

**Ejemplo pequeño:** una `Categoría` tiene muchas `Solicitudes`, pero cada `Solicitud` apunta a una sola `Categoría`. El Lookup vive en el lado "muchos" (la Solicitud).

**Ahora haz algo — micropráctica (6 min):** **[Decidir cómo relacionar clientes y pedidos](/practica/ip-dv-001-relacion-cliente-pedidos)**. Te pide modelar la relación entre un cliente y sus pedidos y decidir de qué lado va el Lookup.

**Práctica real en tu entorno (20 min):**

##### Práctica 2.2: Establecer Relaciones

1. **Relación One-to-Many: Contact → Solicitudes TI**
    - Una persona puede tener múltiples solicitudes.
    - Ya la creaste en la Práctica 2.1 (Paso 3) al crear la Lookup `Solicitante`.
    - Para verla desde el otro lado: **Contact** no está dentro de tu solución, así que ábrela desde fuera. En el menú de la izquierda selecciona **Tables**, elige la pestaña **All** (todas las tablas), abre **Contact** y entra a la zona **Relationships**. Verás muchas relaciones del sistema: busca en la lista la que va hacia **Solicitud TI**. Desde Contact aparece como **One-to-many**; desde Solicitud TI, como **Many-to-one**. Es la misma relación vista desde cada tabla.

2. **Crear tabla "Categoría Detallada"**
    1. En tu solución, crea una tabla nueva igual que en la Práctica 2.1 (Paso 1), con **Display name** `Categoría Detallada` y **Plural display name** `Categorías Detalladas`.
    2. En la pestaña **Primary column**, **Display name** = `Nombre`.
    3. En **Advanced options** > **Record ownership** elige **Organization** (es un catálogo de todos, sin dueño individual). Selecciona **Save**.
    4. En **Columns**, agrega `Descripción` (**Multiline Text**) y `SLA` (**Choice** > **Choice**, **Sync with global choice?** = **No**, opciones `24h`, `48h`, `72h`), igual que en el Paso 2.
    5. **Relación Categoría Detallada → Solicitudes TI (One-to-Many):** abre la tabla **Solicitud TI** > zona **Relationships** > **New relationship** > **Many-to-one**. En **Related** elige **Categoría Detallada** y en **Lookup column display name** escribe `Categoría Detallada` (no `Categoría`, para no confundirla con tu columna Choice). Selecciona **Done** y luego **Save table**. La creas desde Solicitud TI para que el Lookup quede en el lado "muchos"; vista desde Categoría Detallada es una One-to-many.
    - Nota: ya tienes la columna Choice `Categoría` de la Práctica 2.1; esta tabla es otra forma de modelar lo mismo, con datos propios por categoría (como el SLA). En un modelo real elegirías una de las dos; aquí practicas ambas.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La relación que creaste: tabla "uno", tabla "muchos" y en qué tabla vive el Lookup | ___ |
| Cardinalidad que Dataverse muestra para esa relación (One-to-Many, Many-to-One o Many-to-Many) | ___ |
| Tus tres relaciones personalizadas en la zona Relationships de Solicitud TI (hacia Contact, User y Categoría Detallada). Verás muchas más, del sistema (propietario, creado por…): no las cuentes | ___ |

---

## 🧩 Microlección 3 — Reglas de negocio y vistas

**¿Qué vas a aprender?** Cómo una Business Rule hace cumplir una regla sin código, y cómo una vista filtra y ordena los datos para quien los consulta.

**¿Por qué existe esto?** Las reglas evitan datos inválidos desde el origen (no dependen de que cada persona se acuerde), y las vistas muestran a cada rol solo lo que necesita ver, sin duplicar datos.

**Ejemplo pequeño:** "Si Estado = Resuelta y la fecha de resolución está vacía, muestra un error" es una regla; "solicitudes en Nueva o En Proceso" es una vista.

**Práctica real en tu entorno (40 min):** esta microlección no tiene micropráctica propia; la verificación es probar tu regla con un registro real y anotar lo que pasa.

##### Práctica 2.3: Implementar Business Rules

**Cómo funciona el diseñador (léelo una vez):** una regla es un diagrama. Empieza siempre con una **Condition** (condición, el rombo). A su derecha hay dos salidas: la del **✓** (se cumple) y la del **✕** (no se cumple). Las piezas se arrastran desde la pestaña **Components** (a la derecha) hasta un signo **+** del diagrama, y cada pieza se configura en la pestaña **Properties**, terminando siempre con **Apply**.

**Los operadores se eligen de una lista en inglés.** Los que usarás: **Equals** ("es igual a"), **Does not equal** ("no es igual a"), **Contains data** ("tiene un valor"), **Does not contain data** ("está vacío") y, en las vistas, **Equals current user** ("es el usuario que está usando la app"). Learn solo nombra por escrito **Contains data** ([Learn: filtros de vistas](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-view-filters)); los demás son los textos de la lista en inglés, pero Learn no los enumera. Por eso, elígelos por su significado: si uno no aparece escrito igual, toma el que diga lo mismo.

*Regla 1: Auto-asignación de SLA según prioridad*

1. Abre tu solución > **Tables** > **Solicitud TI** > zona **Business rules**.
2. Selecciona **Add business rule** ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-create-business-rule)). Se abre el diseñador con una condición ya creada.
3. Arriba, cambia el nombre (por defecto *New business rule*) a `SLA según prioridad`. En **Description** escribe para qué sirve (por ejemplo, "Pone las horas de SLA según la prioridad").
4. **Scope**: elige **Entity**. Así la regla se aplica en los formularios y también en el servidor, es decir, también cuando cargues los registros de prueba directamente en la tabla (Práctica 2.5), donde todavía no hay formulario de app.
5. Selecciona la condición del diagrama. En **Properties**:
    - **Display Name**: `Prioridad es Crítica`
    - En la regla de la condición: **Source** = **Entity**, **Field** = **Prioridad**, **Operator** = **Equals** ("es igual a"), **Type** = **Value** y, como valor, **Crítica**.
    - Selecciona **Apply**.
6. En **Components**, arrastra **Set Field Value** hasta el **+** junto al **✓** de esa condición. Selecciónalo y en **Properties** elige la columna **SLA Horas**; si te pide **Type**, elige **Value**; escribe el valor `4`. **Apply**.
7. Arrastra una nueva **Condition** hasta el **+** junto al **✕** de la primera condición (significa "si no es Crítica, revisa esto otro"). Configúrala como en el paso 5 pero con **Display Name** `Prioridad es Alta` y valor **Alta**. **Apply**.
8. En su **✓**, arrastra **Set Field Value**: **SLA Horas** = `8`. **Apply**.
9. Repite los pasos 7 y 8 colgando cada condición nueva del **✕** de la anterior:
    - `Prioridad es Media` → **SLA Horas** = `24`
    - `Prioridad es Baja` → **SLA Horas** = `48`
10. Selecciona **Validate** en la barra superior. Si aparece un error, revisa que cada condición y cada acción tenga **Apply**.
11. Selecciona **Save**.
12. **Activa la regla:** una regla nueva queda guardada pero inactiva, y no se activa desde la ventana del diseñador. Ciérrala, vuelve a la lista de **Business rules** de la tabla (o de tu solución), selecciona `SLA según prioridad` y elige **Activate**.

*Regla 2: Validación de fechas*

1. En **Business rules** de **Solicitud TI**, selecciona **Add business rule**. Nombre: `Exigir fecha de resolución`. **Scope**: **Entity** (por el mismo motivo que la Regla 1).
2. Selecciona la condición. En **Properties**:
    - **Display Name**: `Resuelta sin fecha`
    - Primera regla: **Source** = **Entity**, **Field** = **Estado** (la tuya), **Operator** = **Equals**, **Type** = **Value**, valor **Resuelta**.
    - Selecciona **New** (en Properties) para añadir una segunda regla y, en **Rule Logic**, déjala como **AND** ("y además").
    - Segunda regla: **Field** = **Fecha Resolución**, **Operator** = **Does not contain data** ("está vacía"). Este operador no necesita valor.
    - Selecciona **Apply**.
3. En **Components**, arrastra **Show Error Message** hasta el **+** junto al **✓**. En **Properties**: **Field** = **Fecha Resolución**, **Message** = `Debe ingresar la fecha de resolución antes de resolver la solicitud.` (es el mismo texto que usa el Lab 02). **Apply**.
4. **Validate**, **Save** y, como en la Regla 1, actívala desde la lista con **Activate**.

> **Para tener en cuenta:**
> - Para modificar una regla que ya está activa, primero desactívala; si no, no podrás editarla.
> - Una regla nueva no corrige sola los registros que ya existían: actúa cuando un registro se crea o se guarda.
> - Acciones como mostrar u ocultar columnas o bloquearlas solo funcionan en formularios de apps model-driven; con Scope **Entity**, en el servidor se ignoran. Por eso estas dos reglas usan solo **Set Field Value** y **Show Error Message**, que funcionan en todos los alcances.

##### Práctica 2.4: Crear Vistas Personalizadas

**Antes de empezar, un detalle importante sobre el orden:** Dataverse ordena las columnas Choice por el texto de la opción (alfabéticamente), no por el orden en que las creaste. Si ordenas por **Prioridad** de forma descendente, obtienes Media, Crítica, Baja, Alta, que no es lo que quieres. Como **SLA Horas** ya refleja la prioridad (Crítica = 4, Alta = 8, Media = 24, Baja = 48), **ordena por SLA Horas de menor a mayor** y verás primero las más urgentes.

1. **Vista: "Mis Solicitudes Abiertas"**
    1. En tu solución > **Tables** > **Solicitud TI** > zona **Views**.
    2. Selecciona **New view**. En **View name** escribe `Mis Solicitudes Abiertas` y selecciona **Create**. Se abre el diseñador de vistas.
    3. **Columnas:** selecciona **+ View column** y añade, una a una: Categoría, Prioridad, SLA Horas, Estado y Fecha Solicitud. `Título de Solicitud` suele venir ya puesta; si no, añádela también. Para reordenar, arrastra la columna o usa **Move Right** / **Move Left** en el menú de su encabezado.
    4. **Filtro:** en el panel de propiedades de la vista (a la derecha) selecciona **Edit filters**. En la ventana que se abre:
        - Selecciona **Add** > **Add row**: columna **Estado**, operador **Does not equal** ("no es igual a") y el valor **Cerrada**.
        - Selecciona **Add** > **Add row** otra vez: columna **Owner** (Propietario), operador **Equals current user** ("es el usuario actual"). Este operador no necesita valor.
        - Las dos filas quedan unidas con **And** (es el valor por defecto). Selecciona **OK**.
        - Nota: el Solicitante es un Contact, no un usuario de la app, por eso esta vista filtra por el propietario del registro (quien lo creó).
    5. **Orden:** selecciona el encabezado de **SLA Horas** y elige **Sort ascending**. Luego, manteniendo pulsada la tecla **Shift**, selecciona el encabezado de **Fecha Solicitud** y elige **Sort descending** (con Shift se añade un segundo criterio sin borrar el primero). También puedes hacerlo en el panel de propiedades con **Sort by** y **Then sort by**.
    6. Selecciona **Save and publish**.

2. **Vista: "Solicitudes Pendientes Atención"**
    1. En **Views**, **New view** > `Solicitudes Pendientes Atención` > **Create**.
    2. **Columnas** con **+ View column**: Solicitante, Categoría, Prioridad, SLA Horas y Asignado a (además de `Título de Solicitud`).
    3. **Filtro "Estado = Nueva OR Estado = En Proceso":** **Edit filters** y luego:
        - **Add** > **Add row**: **Estado**, operador **Equals**, valor **Nueva**.
        - **Add** > **Add row**: **Estado**, operador **Equals**, valor **En Proceso**.
        - Marca la casilla de las dos filas, selecciona **More commands** (**...**) en una de ellas y elige **Make group**.
        - En el grupo, cambia el operador de **And** a **Or** ("una u otra"). Selecciona **OK**.
    4. **Orden:** en el encabezado de **SLA Horas**, **Sort ascending**.
    5. **Save and publish**.

> Si un cambio no aparece donde esperas, abre tu solución y selecciona **Publish all customizations** en la barra de comandos. Así publicas todos los cambios que quedaron "sin publicar". Puede tardar un poco: no cierres la página.

##### Práctica 2.5: Insertar Datos de Prueba

Crea manualmente 10 registros de Solicitudes. Abre la tabla **Solicitud TI** y, en la barra de comandos, selecciona **Edit** (abre el diseñador de la tabla, donde puedes añadir filas) o **View data** (abre el editor de filas). Agrega una fila nueva por cada solicitud. Pon variedad de:

- Categorías diferentes
- Prioridades mixtas (incluye al menos una **Crítica** para probar la Regla 1)
- Estados variados (intenta guardar una **Resuelta** sin Fecha Resolución para probar la Regla 2; después ponle fecha)
- Fechas distribuidas en últimos 30 días

**Evidencia a reportar (lo que viste al probar, no solo que la configuraste):**

| Campo | Tu valor |
|---|---|
| Regla 1: valor que quedó en "SLA Horas" al guardar una solicitud con Prioridad = Crítica (si la ves vacía, recarga la página: el valor lo pone el servidor al guardar) | ___ |
| Regla 2: el mensaje de error que viste al guardar una Resuelta sin Fecha Resolución (puede verse con otro formato, pero debe incluir el texto de tu regla) | ___ |
| Cuántas de tus 10 solicitudes tienen Estado = Nueva o En Proceso (cuéntalas en el editor de filas). Son las que mostrará la vista "Solicitudes Pendientes Atención"; la verás funcionando dentro de una app en el Lab 04 | ___ |

##### 💾 Rutina de cierre: exporta tu solución (5 min, al terminar cada módulo o sesión)

Desde hoy, cada vez que termines un módulo o una sesión de práctica, exporta tu solución y guárdala **fuera** del ambiente. Es lo que te permite seguir estudiando cuando tu ambiente Trial venza ([Entornos y trials](/recursos/entornos-y-trials)).

1. Abre **Solutions** y selecciona **Solicitudes TI** (sin abrirla).
2. En la barra de comandos selecciona **Export**. (La *Default Solution* no se puede exportar.)
3. En el panel **Before you export**, selecciona **Publish all changes** y luego **Next**.
4. En **Export as** elige **Unmanaged** y selecciona **Export**.
5. Cuando se descargue el `.zip`, renómbralo con la fecha y el módulo (por ejemplo `SolicitudesTI_2026-11-20_M02.zip`) y guárdalo en tu computadora o en tu nube personal. Conserva al menos las dos últimas versiones.

> **Lo que no viaja en la solución:** las filas de datos (tus 10 solicitudes), las conexiones y el historial de ejecuciones. Cuando importes la solución en un ambiente nuevo (**Solutions** > **Import solution**), tendrás que volver a crear las conexiones y los datos de prueba. Si quieres conservar las filas, expórtalas a Excel antes de que venza el ambiente.

---

## 🔁 Reto de transferencia — El modelo de una biblioteca, sin pasos

Esta vez no te digo qué tablas ni columnas crear: aplica lo que viste a un negocio distinto.

> **Requerimiento:** una biblioteca de barrio presta libros y tabletas a sus socios. Hoy lo lleva en una hoja de cálculo y a veces presta el mismo libro a dos personas. Diseña el modelo de datos mínimo para que eso no pase.
> **Criterios de aceptación:** (1) defines al menos 3 tablas y, de cada una, sus columnas con el tipo correcto (usa Choice donde la lista sea fija); (2) indicas qué relaciones hay, de qué lado vive cada Lookup y si son de uno a muchos o de muchos a muchos; (3) explicas cómo evitarías prestar un ítem que ya está prestado: qué columna guardarías para saberlo (por ejemplo, un Estado Disponible/Prestado en el ítem) y quién la cambia. No hace falta implementarlo: una Business Rule solo ve el registro que se está guardando, no los demás.
> **Restricciones:** no puedes copiar el modelo de Solicitudes de TI; el negocio es otro y los nombres también. No necesitas tenant: puedes hacerlo en papel o en una nota, y construirlo después si quieres.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: una solicitud con varias categorías](/practica/ip-dv-007-transferir-categorias-multiples)**. Retoma el modelo de este módulo pero cambia un requisito, y te pide decidir qué cambia en la relación.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tus tablas y, de cada una, sus columnas con el tipo elegido | ___ |
| Tus relaciones: tablas, de qué lado va el Lookup y cardinalidad | ___ |
| Cómo evitas el préstamo doble: la columna que usas para saber si el ítem está prestado y quién la cambia | ___ |

### 💼 Caso Real de Negocio

**Empresa:** Empresa de Logística TransCargo — 120 vehículos, flota propia  
**Problema:** Los activos de la empresa (vehículos, equipos de bodega, herramientas especializadas) se registraban en Excel. Asignaciones duplicadas, equipos prestados sin registro de devolución, sin historial de mantenimiento por activo. Al momento de una auditoría interna no podían demostrar quién tenía qué equipo ni en qué estado.  
**Consecuencia:** 3 camiones con seguros vencidos operando activos, costos de mantenimiento no atribuibles por unidad de negocio.

**Solución con Dataverse:**
- Tabla `sit_activo` con tipo, serial, estado (Disponible/Asignado/En Mantenimiento/Dado de Baja), fecha vencimiento seguro, valor
- Tabla `sit_asignacion` con Lookup a Activo y a Empleado, fechas de inicio y devolución, estado
- Tabla `sit_mantenimiento` con historial de intervenciones por activo
- Business Rule: bloquea asignación si el activo está en estado "En Mantenimiento" o "Dado de Baja"
- Vista "Seguros próximos a vencer" filtra activos con vencimiento en los próximos 30 días

**Resultados:**
- Control total de 120 vehículos y 340 equipos adicionales — trazabilidad completa en tiempo real
- Costo de mantenimiento atribuible por unidad: ahorro del 22% al identificar equipos con mantenimiento excesivo
- Cero activos en operación con documentación vencida desde la implementación

### ✅ Buenas Prácticas

**Nomenclatura**:

- Nombres en español/inglés consistentes (elegir uno)
- El nombre interno (Schema name) no admite espacios y siempre lleva delante el prefijo de tu Publisher (por ejemplo `sit_solicitudti`); el nombre para mostrar (Display name) sí puede llevar espacios, como `Solicitud TI`
- Publisher prefix: usar uno personalizado (como `sit`), no el del publisher por defecto (un prefijo aleatorio como `cr8a3`) ni `new_`

**Modelado**:

- Mantener tablas normalizadas (evitar redundancia)
- Usar Choices en lugar de strings para valores fijos
- Definir Required solo en campos críticos (mejor UX)
- Siempre establecer ownership correcta (impacta seguridad)

**Performance**:

- Limitar columnas en vistas (máx 8-10 visibles)
- No necesitas crear índices a mano: Dataverse crea y ajusta sus índices solo. Lo que sí está en tu mano es filtrar por columnas cortas (Choice, número, fecha, Lookup) y evitar filtrar por columnas de texto largo (Multiline Text), que no se pueden indexar bien
- Evitar Multiline text en primary column

**Documentación**:

- Agregar Description a cada tabla y columna personalizada
- Documentar el propósito de cada Business Rule en su campo Description

### ⚠️ Errores Comunes

1. **Lo que ves:** tienes el mismo dato guardado en dos columnas (por ejemplo Full Name y además First + Last Name) y a veces no coinciden.
    - **Causa probable:** columnas redundantes.
    - **Qué hacer:** usa una columna calculada (Calculated column, ver el glosario de arriba) o une los textos en Power Apps, en vez de guardar el dato dos veces.

2. **Lo que ves:** tus tablas y columnas aparecen con un prefijo que no es el tuyo (por ejemplo uno aleatorio como `cr8a3_`, el del publisher por defecto) o no puedes agruparlas con tu solución.
    - **Causa probable:** no definiste el Publisher antes de crear tablas, o las creaste fuera de tu solución.
    - **Qué hacer:** crea primero la Solution con un Publisher personalizado (por ejemplo, prefijo `sit`), márcala como preferida y trabaja siempre dentro de ella.

3. **Lo que ves:** una lista que debería ser fija tiene variantes escritas a mano ("Alta", "alta", "ALTA") y los filtros no la agrupan.
    - **Causa probable:** usaste Text simple para una lista desplegable.
    - **Qué hacer:** usa Choice, que mejora la integridad de los datos.

4. **Lo que ves:** algo del sistema deja de comportarse como siempre después de que cambiaste una tabla o columna estándar.
    - **Causa probable:** eliminaste o modificaste tablas estándar o columnas del sistema.
    - **Qué hacer:** extiende con columnas nuevas; nunca modifiques lo estándar.

5. **Lo que ves:** no sabes de qué lado va el Lookup, o el modelo se enreda con relaciones que se apuntan entre sí.
    - **Causa probable:** relaciones circulares o mal diseñadas.
    - **Qué hacer:** diagrama el modelo antes de implementarlo y valida la cardinalidad de cada relación.

### 🧪 Criterios de Validación
- [ ] Tabla "Solicitud TI" con mínimo 7 columnas personalizadas creada
- [ ] 3+ relaciones establecidas y funcionales
- [ ] 2+ Business Rules implementadas y probadas
- [ ] 2+ vistas personalizadas configuradas
- [ ] 10+ registros de prueba con datos variados
- [ ] Explicar diferencia entre tabla Standard y Custom
- [ ] Describir cuándo usar One-to-Many vs Many-to-Many

### 📸 Evidencia para guardar
- Captura de las tablas creadas con sus columnas.
- Captura de al menos una Business Rule configurada.
- Captura de una vista personalizada con su filtro.
- Conteo de registros de prueba cargados.
- Nombre y fecha del `.zip` de tu solución exportada.

## ➡️ Siguiente práctica recomendada

Completa ahora: **[Lab 02 · Dataverse — Modelado de Datos para un Sistema de Solicitudes](/labs/lab-02-dataverse-modelo-datos)**

**Por qué:** el Lab 02 construye el mismo modelo de este módulo (mismos nombres visibles y las mismas dos Business Rules, con el mismo mensaje de error), en la solución que usan los labs siguientes. Sus vistas son parecidas: una se ordena por SLA Horas y las otras por fecha. Cambian tres cosas, y el lab explica por qué: la categoría es una tabla catálogo con Lookup en lugar de la columna Choice (con nombres un poco más largos: "Red y Conectividad" en vez de "Red", "Accesos y Seguridad" en vez de "Accesos"); el lab tiene dos datos de SLA distintos (el SLA de referencia de cada categoría y el **SLA Horas** de cada solicitud, que pone la Regla 1 y es el que se usa para ordenar); y los nombres internos (`sit_solicitud`, `sit_estado`…) se escriben a mano porque los Labs 03, 04, 05 y 09 los usan. Si haces el lab en el mismo ambiente, el lab te dice cómo renombrar tu tabla de este módulo para no confundirlas.

**Qué evidencia guardar del lab:** capturas de las tablas dentro de tu solución, de las 2 Business Rules activas, de las 3 vistas publicadas, y el conteo de registros de prueba (5 Categoría + 10 Solicitud TI).

---

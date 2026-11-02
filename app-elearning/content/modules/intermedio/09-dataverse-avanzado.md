---
moduleId: 9
title: "Dataverse Avanzado"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 25
practiceMinutes: 190
slug: "dataverse-avanzado"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 190 min sobre la solución del Lab 02 (mejor en dos o tres sesiones; si es la primera vez que ves el Admin Center y los editores clásicos, cuenta con algo más). El Lab 09 (rollup, columna calculada, seguridad de columna y Business Process Flow) es aparte.*

### 🎯 Objetivo
Diseñar modelos de datos empresariales complejos en Dataverse: relaciones polimórficas, columnas calculadas y rollup, reglas de negocio avanzadas, seguridad a nivel de campo, y auditoría completa de datos — practicando cada pieza sobre tu solución SIT y comprobando con datos reales qué hace la plataforma y qué no.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica en tu ambiente con **evidencia**: una tabla donde anotas el dato exacto que viste, no un "sí, funcionó". Hay un reto de construcción sin pasos, un diagnóstico en el que ves el síntoma antes que la causa y, al final, un reto de transferencia con otro negocio.
>
> **Antes de empezar, necesitas:**
> - Tu ambiente Developer (o Trial) del Módulo 1, con la solución `SIT Solicitudes Internas` (`SIT_SolicitudesInternas`) del [Lab 02](/labs/lab-02-dataverse-modelo-datos): tablas **Categoría** y **Solicitud TI**, sus 2 Business Rules y los datos de prueba.
> - La model-driven app `SIT Gestión Solicitudes` del [Lab 04](/labs/lab-04-model-driven-app) (o la app del Módulo 4) para ver formularios.
> - Para probar seguridad de columna hace falta un **segundo usuario que no sea administrador** (la cuenta de prueba del Lab 04). Sin él puedes hacer todo lo demás.
>
> Todo se crea **dentro de tu solución**: abre [make.powerapps.com](https://make.powerapps.com) → **Solutions** → `SIT Solicitudes Internas`. Si un paso dice "abre la tabla", es desde ahí.

### 📖 Conceptos Clave
Un mapa rápido; cada pieza se practica en su microlección.

- **Tipos de relaciones:** 1:N / N:1 (una Categoría tiene muchas solicitudes; el Lookup vive en la tabla "muchos"), N:N nativa (Dataverse crea y gestiona una tabla de intersección oculta, sin columnas propias), N:N manual (una tabla intermedia tuya, con dos Lookups y columnas adicionales, por ejemplo el rol de cada persona en cada proyecto) y Lookups polimórficos (un mismo Lookup que puede apuntar a más de una tabla, como el tipo **Customer**, que acepta Cuenta o Contacto). En las relaciones 1:N se define el comportamiento en cascada: qué pasa con los hijos cuando se actúa sobre el padre, por ejemplo al eliminarlo o cambiar su propietario (Referential, Remove Link; Referential, Restrict Delete; Parental; Custom; la Microlección 1 explica qué hace cada uno) ([Learn: relaciones con Lookup](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-entity-lookup)).
- **Columnas calculadas:** columna de solo lectura con **Behavior** = **Calculated**. Se define con un editor de condiciones y acciones (no con Power Fx) y puede usar columnas del mismo registro o de su tabla padre (N:1), con la sintaxis `Lookup.Columna`. Tiene funciones propias como `ADDDAYS` o `DIFFINDAYS` ([Learn: columnas calculadas](https://learn.microsoft.com/power-apps/maker/data-platform/define-calculated-fields)).
- **Columnas de fórmula (Formula columns):** columna con **Data type** = ***fx* Formula**, escrita en **Power Fx** (la misma sintaxis de las Canvas Apps). Su valor se calcula al leer la fila ([Learn: columnas de fórmula](https://learn.microsoft.com/power-apps/maker/data-platform/formula-columns)).
- **Columnas rollup:** columna de solo lectura (**Behavior** = **Rollup**) que agrega valores de los registros hijos de una relación **1:N** (SUM, COUNT, MIN, MAX, AVG), con filtros opcionales. No es instantánea: se actualiza con trabajos del sistema ([Learn: columnas rollup](https://learn.microsoft.com/power-apps/maker/data-platform/define-rollup-fields)).
- **Reglas de negocio:** lógica sin código. Con **Scope** = **Entity**, algunas acciones se aplican también en el servidor y otras **solo en formularios** (Microlección 3).
- **Business Process Flow (BPF):** la barra de etapas que ya construiste en el Módulo 4. Puede abarcar hasta 5 tablas, con hasta 30 etapas y 30 pasos por etapa ([Learn: crear un BPF](https://learn.microsoft.com/power-automate/create-business-process-flow)); el Lab 09 lo profundiza.
- **Seguridad de columna (Field Security Profile, hoy *column security profile*):** restringe leer, crear y actualizar columnas concretas, por encima del rol de seguridad de la tabla. Se asigna a usuarios o equipos y **no se aplica a quien tiene el rol System Administrator** ([Learn: seguridad de columna](https://learn.microsoft.com/power-platform/admin/field-level-security)).
- **Auditoría:** registra quién cambió qué columna, cuándo y de qué valor a qué valor. Se activa en el ambiente, en la tabla y en la columna; los registros consumen capacidad de almacenamiento de logs ([Learn: auditoría de Dataverse](https://learn.microsoft.com/power-platform/admin/manage-dataverse-auditing)).
- **Búsqueda de Dataverse (Dataverse search, antes *relevance search*):** búsqueda por relevancia en varias tablas a la vez desde la barra de búsqueda de la app. Los campos que se indexan salen de la vista **Quick Find** de cada tabla; los cambios de configuración pueden tardar hasta 15 minutos en reflejarse ([Learn: configurar Dataverse search](https://learn.microsoft.com/power-platform/admin/configure-relevance-search-organization)).
- **Reglas de detección de duplicados:** comparan una fila nueva o editada con las existentes (coincidencia exacta, mismos primeros o últimos caracteres) y avisan al guardar ([Learn: detección de duplicados](https://learn.microsoft.com/power-platform/admin/set-up-duplicate-detection-rules-keep-data-clean)).

### 🔍 Consultar datos más allá de las vistas: FetchXML y OData (lectura de 5 min)

Cuando una vista, un flujo o una app pide filas a Dataverse ("dame las Cuentas de Bogotá"), esa petición se escribe en un lenguaje de consulta. Hoy solo necesitas reconocer los dos:

- **FetchXML:** el lenguaje de consulta propio de Dataverse, en XML. Lo usan por dentro las vistas y los reportes.
  ```xml
  <fetch>
    <entity name="account">
      <attribute name="name" />
    </entity>
  </fetch>
  ```
  `<entity name="account">` es la tabla; `<attribute name="name" />`, la columna que pides. Para quedarte solo con algunas filas se agrega un `<filter>` con una o más `<condition>` ([Learn: filtrar filas con FetchXML](https://learn.microsoft.com/power-apps/developer/data-platform/fetchxml/filter-rows)):
  ```xml
  <fetch>
    <entity name="account">
      <attribute name="name" />
      <filter type="and">
        <condition attribute="address1_city" operator="eq" value="Redmond" />
      </filter>
    </entity>
  </fetch>
  ```
  `operator="eq"` significa "es igual a". En la micropráctica la columna de la ciudad se llama `city` y el dato está guardado como `Bogota`, sin tilde.
- **OData:** el estándar de la Web API de Dataverse, la forma en que apps e integraciones externas piden datos por HTTP.
  ```text
  /api/data/v9.2/accounts?$select=name&$top=10
  ```
  `accounts` es la tabla, `$select=name` la columna y `$top=10` el límite de filas. Para ordenar se agrega `$orderby=columna asc` (de menor a mayor, el valor por defecto) o `$orderby=columna desc` (de mayor a menor), y las opciones se unen con `&`: `/accounts?$select=name,revenue&$orderby=revenue asc` ([Learn: ordenar filas con OData](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/order-rows)). **No pruebes estas URLs contra un ambiente productivo real.**

**Micropráctica opcional (8 min cada una):** [FetchXML básico](/practica/ip-qry-001-fetchxml-basico) y [OData select/orderby/top](/practica/ip-qry-002-odata-select-top). Paginación y filtros sobre tablas grandes se ven en el Nivel Avanzado.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Relaciones: N:N nativa, tabla intermedia y comportamiento en cascada

**¿Qué vas a aprender?** A elegir entre una relación muchos a muchos nativa y una tabla intermedia propia, y a predecir qué les pasa a los hijos cuando borras el padre.

**¿Por qué existe esto?** En el Lab 02 solo usaste relaciones Many-to-one (cada solicitud tiene una Categoría). Ahora el equipo quiere **etiquetar** solicitudes ("urgente-gerencia", "proveedor-externo"): una solicitud tiene varias etiquetas y una etiqueta, muchas solicitudes. La N:N nativa resuelve eso sin columnas extra. Si además necesitaras guardar un dato **de la relación** (quién puso la etiqueta, con qué relevancia), la N:N nativa no sirve: su tabla de intersección no admite columnas propias, y necesitas una tabla intermedia con dos Lookups.

**Ejemplo pequeño:**
```
N:N nativa:        Solicitud TI  ⟷  Etiqueta            (sin datos propios)
Tabla intermedia:  Solicitud TI  ←  Etiquetado  →  Etiqueta
                                    └─ Relevancia (Choice), Puesta por (Lookup a User)
```

**Qué les pasa a los hijos al borrar el padre (comportamiento en cascada).** Cada relación 1:N tiene uno de estos comportamientos ([Learn: comportamiento avanzado de las relaciones](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-entity-lookup#add-advanced-relationship-behavior)):

| Comportamiento | Qué pasa al borrar el padre |
|---|---|
| **Referential, Remove Link** | El borrado se completa y los hijos siguen existiendo, pero se les vacía el Lookup |
| **Referential, Restrict Delete** | No te deja borrar el padre mientras tenga hijos: primero hay que borrar o mover los hijos |
| **Parental** | Se borran también todos los hijos (y otras acciones, como cambiar de propietario, también pasan a los hijos) |
| **Custom** | Eliges qué pasa en cada acción por separado; para el borrado, las opciones son **Cascade All** (borrar los hijos), **Remove Link** (vaciar el Lookup) o **Restrict** (impedir el borrado) |

**Ahora haz algo — micropráctica (6 min):** decide entre las dos opciones con feedback inmediato → **[N:N nativa o tabla intermedia](/practica/ip-dv-004-tabla-intermedia)**.

**Práctica real en tu entorno (25 min):**

1. Crea en tu solución la tabla `Etiqueta` igual que creaste **Categoría** en el Lab 02: **New** → **Table** → **Table (advanced properties)**, **Display name** `Etiqueta`, en **Advanced options** el **Record ownership** = **Organization**, y en la pestaña **Primary column** el **Display name** `Nombre`. **Save**. (Si en el Lab 02 elegiste otra ruta para crear la tabla, usa la misma.)
2. En el hub de **Etiqueta**, zona **Relationships** → **New relationship** → **Many-to-many** ([Learn: relaciones N:N](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-nn-relationships-portal)).
3. En el panel, en **Related (Many)** elige **Solicitud TI**. **Qué deberías ver:** el panel rellena solo el **Relationship name** y el **Relationship table name** (la tabla de intersección). Cópialos tal cual en tu evidencia. **Done**.
4. Guarda la tabla (**Save table**): la relación se crea al guardar. **Si no aparece en la lista de Relationships**, recarga la página; si sigue sin aparecer, repite el paso 2 y fíjate en guardar al final.
5. Ahora el comportamiento en cascada, **probado, no supuesto**. En el editor de filas de **Categoría** (en el hub de la tabla, **Edit**, como en el Lab 02), crea una categoría `Prueba borrado` con un **SLA Horas** cualquiera (es obligatoria). En el editor de filas de **Solicitud TI**, crea una solicitud `Prueba cascada` con esa Categoría y una **Fecha Solicitud** de hoy (**Estado** ya trae Nueva). Antes de seguir, **escribe tu predicción**: al borrar la categoría, ¿la solicitud se borra, se queda sin Categoría o el borrado falla?
6. Vuelve a **Categoría**, selecciona `Prueba borrado` y elimínala. Anota exactamente qué pasó: un mensaje de error (cópialo) o el borrado se completó. Si se completó, mira la solicitud `Prueba cascada`: ¿sigue existiendo? ¿qué muestra su columna **Categoría**? Si el borrado falló, borra primero `Prueba cascada` y después `Prueba borrado`; si se completó, borra `Prueba cascada`.
7. **Comprueba la configuración que lo explica:** en el hub de **Solicitud TI**, zona **Relationships**, abre la relación Many-to-one hacia **Categoría**. En su panel despliega **Advanced options** y busca la sección **Relationship behavior** ([Learn: relaciones 1:N](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-1n-relationships-portal)). Anota el comportamiento que muestra y compáralo con la tabla de arriba. Solo mira: no lo cambies. Si tu panel no muestra esa sección, anota "no visible" y explica el resultado del paso 6 con la tabla.

**Evidencia a reportar (el dato exacto que viste):**

| Campo | Tu valor |
|---|---|
| Relationship name de la N:N (copiado del panel) | ___ |
| Relationship table name (tabla de intersección) | ___ |
| Tu predicción del paso 5 | ___ |
| Qué pasó al borrar `Prueba borrado` (mensaje exacto o resultado) | ___ |
| Comportamiento que muestra **Relationship behavior** en la relación con Categoría (paso 7) | ___ |
| ¿Coincide con lo que pasó al borrar? Explícalo con la tabla de comportamientos | ___ |

> **Lookups polimórficos:** si una columna tuviera que apuntar a Cuenta **o** a Contacto (por ejemplo, "quién reporta" puede ser un cliente empresa o una persona), el tipo de Lookup **Customer** lo resuelve. Tenlo en cuenta en la Microlección 2: las columnas calculadas no admiten Lookups que apuntan a varias tablas.

---

## 🧩 Microlección 2 — Columnas derivadas: fórmula, calculada o rollup

**¿Qué vas a aprender?** A elegir dónde se calcula un dato derivado y qué limitaciones trae cada opción.

**¿Por qué existe esto?** Si el equipo calcula a mano "cuándo vence el SLA" en cada solicitud, tarde o temprano alguien se equivoca. Una columna derivada lo calcula la plataforma. Las tres opciones se parecen, pero no son intercambiables:

| | Columna de fórmula | Columna calculada | Columna rollup |
|---|---|---|---|
| Lenguaje | Power Fx | Editor de condiciones y acciones (`ADDDAYS`, `DIFFINDAYS`, `CONCAT`…) | Agregación: SUM, COUNT, MIN, MAX, AVG |
| De dónde lee | La fila y tablas relacionadas | La fila y su tabla padre (N:1) | Los hijos de una relación **1:N** (no N:N) |
| Cuándo se actualiza | Al leer la fila | En tiempo real en formularios, vistas y gráficos | Trabajo asíncrono: por defecto cada hora; botón **Recalculate** en el formulario |
| Un número vacío | Cuenta como 0 | Deja el resultado vacío | — |

Ninguna de las tres puede disparar workflows ni plug-ins, y una columna simple que ya existe **no se puede convertir** en calculada: hay que crear otra. En las rollup, el recálculo masivo (*Mass Calculate*) corre 12 horas después de crearlas o modificarlas, y **Recalculate** necesita permiso de escritura sobre la fila ([Learn: rollup](https://learn.microsoft.com/power-apps/maker/data-platform/define-rollup-fields)).

**Ahora haz algo — micropráctica (7 min):** elige el tipo correcto para cuatro necesidades → **[Elegir el tipo de columna derivada](/practica/ip-dv-013-elegir-columna-derivada)**.

**Práctica real en tu entorno (25 min) — columna de fórmula `Vence SLA`:**

1. En tu solución, abre la tabla **Solicitud TI** → zona **Columns** → **New column**.
2. **Display name:** `Vence SLA`. **Data type:** ***fx* Formula** ([Learn: agregar una columna de fórmula](https://learn.microsoft.com/power-apps/maker/data-platform/formula-columns)).
3. En el cuadro **Formula**, empieza a escribir y deja que Intellisense te proponga los nombres. Las columnas se escriben con su **nombre visible**, entre comillas simples si llevan espacios (Learn usa esa forma en sus ejemplos, como `ThisRecord.'Customer Rating'`):
   ```js
   // Fecha Solicitud + las horas de SLA de la propia solicitud
   DateAdd('Fecha Solicitud', 'SLA Horas', TimeUnit.Hours)
   ```
   **Qué deberías ver:** la fórmula sin subrayado rojo. **Si sale un error**, pasa el ratón por encima: lo habitual es un nombre mal escrito (usa el que te ofrece Intellisense; si renombraste tus columnas en el Lab 02, usa tus nombres).
4. **Save**. La columna aparece en la lista con tipo de fórmula.
5. Mira el valor en la zona de columnas y datos del hub de **Solicitud TI** (o en el editor de filas, con **Edit**). Si la columna nueva no se ve, selecciona el contador de columnas que no se muestran (por ejemplo **+17 more**) y marca **Vence SLA** ([Learn: el hub de la tabla](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-portal#table-columns-and-data)). Busca "VPN caída para equipo remoto" (SLA Horas = 4).
6. **Prueba del valor vacío:** crea una solicitud `Prueba SLA vacío` con **Fecha Solicitud** de hoy, cualquier **Categoría**, **SLA Horas** vacía y **Prioridad** vacía: borra el valor, porque viene **Media** por defecto y entonces la regla del SLA lo rellenaría. (En el Lab 02 las dos columnas son **Optional**, así que se pueden dejar vacías al guardar.) Antes de mirar, predice qué mostrará **Vence SLA**. Después compáralo con lo que dice Learn: en las columnas de fórmula, un número vacío cuenta como 0 en las operaciones intermedias. Anota lo que veas de verdad, aunque no coincida. Borra la fila al terminar.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Fórmula exacta que guardaste | ___ |
| "VPN caída…": Fecha Solicitud / SLA Horas / Vence SLA | ___ |
| Tu predicción para `Prueba SLA vacío` | ___ |
| Lo que mostró de verdad **Vence SLA** en `Prueba SLA vacío` | ___ |

> **La columna calculada y la rollup se construyen en el [Lab 09](/labs/lab-09-dataverse-avanzado)** (Ejercicio 1). Cuando hagas la rollup, ten en cuenta la tabla de arriba: si el valor no cambia en el momento, no es un error; usa **Recalculate** en el formulario de la Categoría.

---

## 🧩 Microlección 3 — Reglas de negocio: qué se aplica en el servidor y qué solo en formularios

**¿Qué vas a aprender?** A predecir qué acciones de una Business Rule protegen el dato venga de donde venga y cuáles solo cambian el formulario.

**¿Por qué existe esto?** En el Módulo 2 viste que el **Scope** **Entity** aplica la regla en formularios y en el servidor. El matiz que importa ahora es que **no todas las acciones** llegan al servidor ([Learn: crear una Business Rule](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-create-business-rule)):

| Acción de la regla | Con Scope Entity, en el servidor (flujos, API, editor de filas, importaciones) |
|---|---|
| **Set Field Value**, borrar valores, valores predeterminados | Sí se aplica |
| **Show Error Message** (validar y bloquear el guardado) | Sí se aplica |
| **Lock/Unlock** (bloquear), **Set Visibility** (mostrar u ocultar), **Set Business Required** (exigir), recomendaciones | **No**: solo en formularios |

Learn lo resume así: las acciones que solo aplican a model-driven apps se ignoran cuando la regla corre en el servidor; **Show Error Message** impide guardar y devuelve el mensaje al proceso que llamó ([Learn: acciones de las reglas](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-business-rules-recommendations-apply-logic-form)). Además, se recomienda no pasar de 150 reglas por tabla y, para editar una regla activa, primero hay que desactivarla.

**Diagnosticar antes de construir — micropráctica (6 min):** un flujo cambia un dato que la regla "bloquea". Lee el síntoma y di la causa antes de ver la solución → **[La regla bloquea, pero el flujo lo cambia](/practica/ip-trb-007-regla-bloqueo-no-protege)**.

**Práctica real en tu entorno (30 min) — comprobarlo con tus datos:**

> **Por qué esta prueba usa Descripción y no SLA Horas:** tu regla `SLA según prioridad` del Lab 02 usa **Set Field Value** con Scope Entity, así que en cada guardado el servidor vuelve a poner el SLA según la prioridad. Si probaras con SLA Horas, verías el valor de la regla y no el tuyo.

1. En tu solución, tabla **Solicitud TI** → **Business rules** → **Add business rule**. Nombre: `Bloquear descripción si Cerrada`. **Scope:** **Entity**.
2. Condición: **Field** = **Estado**, **Operator** = **Equals**, **Type** = **Value**, valor **Cerrada** → **Apply**.
3. Arrastra **Lock/Unlock** al **+** del **✓**. En **Properties**, elige la columna **Descripción** y, en la propiedad que decide si se bloquea o se desbloquea, la opción **Lock** → **Apply**.
4. **Validate** → **Save**. Cierra el diseñador, vuelve a la lista de **Business rules**, selecciona la regla y **Activate** (como en el Lab 02).
5. En el editor de filas de **Solicitud TI** (no en la app), cambia a **Cerrada** la solicitud "Solicitar silla ergonómica" y guarda. (La Regla 2 del Lab 02 solo exige **Fecha Resolución** al pasar a **Resuelta**; **Cerrada** se guarda sin ella.) Después escribe en su **Descripción** `Cambio hecho fuera del formulario` y guarda. **Escribe qué pasó:** ¿te dejó?
6. Abre la misma solicitud en la app `SIT Gestión Solicitudes` (**Play** desde la lista de apps). Mira la columna **Descripción** en el formulario. **Qué deberías ver:** en el formulario aparece bloqueada; en el editor de filas te dejó cambiarla. Si no la ves bloqueada, recarga el formulario y revisa que la regla esté **Activated** y que **Descripción** esté en el formulario: Learn advierte que una regla puede no ejecutarse en un formulario que no incluye la columna.
7. Deja la fila como estaba, **en el editor de filas** (en el formulario de la app la Descripción está bloqueada): borra el texto de **Descripción** y vuelve a poner **Estado** en **Nueva**. Desactiva la regla (**Deactivate** en la lista) para que no interfiera con los labs siguientes.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| ¿El editor de filas guardó la Descripción con Estado Cerrada? (y el mensaje, si hubo) | ___ |
| Cómo se ve **Descripción** en el formulario de la app con Estado Cerrada | ___ |
| Una frase: qué tendrías que usar para que nadie cambie la descripción de una solicitud cerrada, venga el cambio de donde venga | ___ |

> **Pista para la última fila:** **Show Error Message** con Scope Entity sí bloquea el guardado en el servidor, pero una regla compara los valores del registro, no "el valor que tenía antes": con la condición "Estado = Cerrada" impediría cualquier guardado de una solicitud cerrada, incluido el que la cierra. Para restringir **quién** puede cambiar una columna en todos los canales, la herramienta es la seguridad de columna (Microlección 4).

---

## 🧩 Microlección 4 — Seguridad de columna y auditoría

**¿Qué vas a aprender?** A proteger una columna sensible de verdad y a dejar rastro de quién la cambió.

**¿Por qué existe esto?** Ocultar una columna en el formulario no la protege: sigue en vistas, exportaciones, flujos y API. La seguridad de columna sí se aplica en todos los canales. Y cuando el negocio pregunta "¿quién cambió esto y cuándo?", la respuesta es la auditoría.

**Lo esencial de la seguridad de columna** ([Learn](https://learn.microsoft.com/power-platform/admin/field-level-security)):
- Se habilita en la columna (**Advanced options** → **Enable column security**) y se dan permisos en un **column security profile**: **Read**, **Update** y **Create**, cada uno **Allowed** o **Not Allowed**, y **Read unmasked**, con **All Records**, **One record** o **Not Allowed** (el valor por defecto; solo importa si la columna tiene una regla de enmascaramiento).
- El perfil se asigna a **usuarios o equipos**, no a roles de seguridad.
- **No se aplica a usuarios con el rol System Administrator**: siempre ven el dato. Por eso tu propio usuario administrador no sirve para probarla; usa la cuenta de prueba del Lab 04.
- Quien no tiene permiso de lectura ve la columna con un candado y `********`. Puede hacer falta recargar el navegador para ver el cambio.
- No se pueden proteger columnas Lookup, columnas de fórmula ni la columna principal.

La seguridad de columna se configura paso a paso en el [Lab 09](/labs/lab-09-dataverse-avanzado) (Ejercicio 2). Aquí practicas la auditoría.

**Práctica real en tu entorno (30 min) — auditar el Estado de las solicitudes:**

1. **Auditoría del ambiente:** [Power Platform Admin Center](https://admin.powerplatform.microsoft.com) → **Manage** → **Environments** → tu ambiente → **Settings** → **Audit and logs** → **Audit settings** → **Global Audit Settings** ([Learn: gestionar la auditoría](https://learn.microsoft.com/power-platform/admin/manage-dataverse-auditing)). Se abre la configuración del sistema en otra ventana o pestaña: activa **Start Auditing** → **OK**. Esa ventana también puede traer casillas por área (**Common Entities**, **Sales Entities**…): activan de golpe grupos de tablas estándar, como Account o Contact. Tu tabla personalizada se activa en el paso 2, así que no hace falta marcarlas. Vuelve a la página **Audit settings** y selecciona **Save**. **Si no ves Audit settings**, revisa que tengas el rol System Administrator en ese ambiente.
2. **Auditoría de la tabla:** en tu solución, abre la tabla **Solicitud TI** y, en la barra de comandos del hub, selecciona **Properties** (Learn también describe el camino **Edit** → **Edit table properties**: **Edit** es el mismo botón que abre el editor de filas, y desde su barra se llega a las propiedades) → **Advanced options** → marca **Audit changes to its data** → **Save** ([Learn: editar una tabla](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-portal#edit-a-table)).
3. **Auditoría de la columna:** en **Columns**, abre **Estado** → **Advanced options** → comprueba que **Enable auditing** esté marcado (márcalo si no) → **Save**. Después, en tu solución, **Publish all customizations**.
4. En la app `SIT Gestión Solicitudes`, abre "Impresora offline piso 2" y cambia su **Estado** de **Nueva** a **En Proceso**. Guarda.
5. En el formulario, pestaña **Related** → **Audit History**. **Qué deberías ver:** una fila con la columna cambiada, el valor anterior, el nuevo, quién y cuándo. **Si no aparece**, espera unos minutos y recarga: Learn advierte que puede haber retraso, y la auditoría solo registra cambios en los que el valor nuevo es distinto del anterior.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Columna que aparece en Audit History | ___ |
| Valor anterior y valor nuevo, tal como los muestra | ___ |
| Usuario y fecha/hora registrados | ___ |
| Una frase: por qué la auditoría de todas las tablas "por si acaso" no es gratis | ___ |

---

### 🏗️ Reto de construcción (sin pasos, tenant real, unos 35 min) — detección de duplicados

> **Requerimiento:** el equipo de soporte recibe la misma solicitud dos veces porque dos personas la registran a la vez. Crea una regla de detección de duplicados para **Solicitud TI** que avise cuando el **Título de Solicitud** coincida exactamente con el de otra solicitud.
> **Criterios de aceptación:** (1) la regla está publicada; (2) al guardar desde la app una solicitud nueva con el mismo título que "VPN caída para equipo remoto", aparece un aviso de posible duplicado; (3) en la definición de la regla está marcada la opción que hace que dos valores vacíos no cuenten como iguales (esto se comprueba en la configuración, no con datos).
> **Restricciones:** no uses más de una condición. No borres la solicitud original para hacer la prueba.

Dónde empezar: Learn, [Configurar reglas de detección de duplicados](https://learn.microsoft.com/power-platform/admin/set-up-duplicate-detection-rules-keep-data-clean) (está en la configuración del ambiente, en el Admin Center). Tres cosas que esa página da por sabidas:
- **El interruptor general.** La detección de duplicados se enciende para todo el ambiente en **Settings** → **Data management** → **Duplicate detection**, con las casillas **Enable duplicate detection** y **When a record is created or updated** → **OK** ([Learn: activar la detección de duplicados](https://learn.microsoft.com/power-platform/admin/turn-duplicate-detection-rules-off-whole-organization)). Si está apagado, la regla existe pero no avisa nunca.
- **La tabla tiene que admitirla.** Si **Solicitud TI** no aparece en **Base Record Type**, revisa en las propiedades de la tabla (**Properties** → **Advanced options**) la casilla **Apply duplicate detection rules**.
- **Guardar no basta.** Después de **Save and Close**, selecciona la regla en la lista y elige **Publish**. Para cambiar una regla publicada, primero hay que despublicarla (**Unpublish**).

Recuerda que las reglas de duplicados no se disparan sobre columnas de fórmula. Y sobre el criterio 3: Learn indica que, cuando la regla tiene una sola condición, los valores vacíos se ignoran en los trabajos de detección de duplicados; aun así, deja marcada la opción para que la regla no dependa de eso.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de la regla, Base Record Type y criterio usado | ___ |
| Estado de **Enable duplicate detection** y **When a record is created or updated** en tu ambiente | ___ |
| Texto del aviso que viste al guardar el duplicado | ___ |
| Qué opción marcaste para que dos títulos vacíos no cuenten | ___ |

> **Profundización opcional:** configura **Dataverse search** para que la barra de búsqueda de tu app encuentre solicitudes por su descripción. Los campos indexados salen de la vista **Quick Find** de la tabla; las tablas personalizadas se agregan al índice desde tu solución con **Manage search index**, y los cambios pueden tardar hasta 15 minutos ([Learn](https://learn.microsoft.com/power-platform/admin/configure-relevance-search-organization)).

---

## 🔁 Reto de transferencia — El modelo de Recursos Humanos

Cambia el negocio y comprueba si entendiste las piezas o memorizaste los pasos. Recursos Humanos tiene **Empleado** (con Lookup a **Departamento**) y **Proyecto**, y pide: que el Salario solo lo vean y editen en Nómina; saber quién cambió cada Salario y de qué valor a qué valor; ver cuántos empleados tiene cada Departamento; y asignar empleados a proyectos guardando el rol de cada persona en cada proyecto.

1. **Micropráctica (9 min):** **[Transferir al modelo de RR.HH.](/practica/ip-dv-014-transferir-modelo-rrhh)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel o en un diagrama (unos 20 min, sin construirlo):** dibuja las tablas, las relaciones y, junto a cada requisito, la pieza que usarías. Para cada pieza, escribe **cómo la probarías** y con qué usuario.

**Evidencia a reportar:**

| Requisito | Pieza que usarías | Cómo lo probarías (y con qué usuario) |
|---|---|---|
| Salario solo para Nómina | ___ | ___ |
| Quién cambió el Salario | ___ | ___ |
| Empleados por Departamento | ___ | ___ |
| Rol de cada persona en cada proyecto | ___ | ___ |

### 💼 Caso Real de Negocio
**Empresa:** Constructora con 50 proyectos activos simultáneos  
**Problema:** Los Project Managers cambian presupuestos sin aprobación, causando pérdidas.  
**Solución:** Modelo Dataverse con Field Security Profile que bloquea edición de presupuesto salvo a Director de Operaciones. Business Rule valida fechas. Rollup de costos actualizado cada hora para dashboard en tiempo real. Auditoría completa genera reporte mensual para Contraloría.  
**Resultado:** Reducción de incidentes de presupuesto en 80% en primer trimestre.

### ✅ Buenas Prácticas
- Prefijo de publisher consistente en todas las columnas (`sit_` en este curso; nunca `new_`).
- Elige la columna derivada por su comportamiento: fórmula para lógica en Power Fx sobre la propia fila, calculada si necesitas sus funciones propias, rollup solo para agregar hijos de una relación 1:N.
- Las rollup se actualizan de forma asíncrona (por defecto cada hora) y con **Recalculate**; no prometas "tiempo real" con una rollup.
- Para proteger un dato, usa acciones que se aplican en el servidor (**Show Error Message**, **Set Field Value**) o seguridad de columna; bloquear u ocultar en una regla solo cambia el formulario.
- Prueba la seguridad de columna con un usuario que no sea System Administrator.
- Activa la auditoría en tablas financieras y de RR.HH. desde el inicio, pero solo en las tablas y columnas que necesitas: consume capacidad de almacenamiento de logs.
- No guardes información sensible en la columna principal: quien ve una fila con un Lookup ve el nombre principal del registro relacionado aunque no tenga permiso sobre él.
- Prueba el comportamiento en cascada antes de dejar que los usuarios borren registros padre.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| La rollup no cambia después de editar los hijos | Se actualiza con un trabajo asíncrono (por defecto cada hora; el primer cálculo masivo, 12 horas después de crearla) | Usa **Recalculate** en el formulario del registro padre; necesitas permiso de escritura sobre esa fila |
| Un flujo cambia una columna que la Business Rule "bloquea" | **Lock/Unlock**, mostrar u ocultar y exigir solo funcionan en formularios, aunque el Scope sea Entity | Usa **Show Error Message** con Scope Entity o seguridad de columna |
| La regla no se aplica cuando el dato llega por un flujo o el editor de filas | El Scope no es **Entity**, o la regla no está activada | Cambia el Scope a **Entity** (desactiva la regla antes de editarla) y vuelve a activarla |
| La seguridad de columna "no funciona" en tu prueba | Estás probando con un usuario System Administrator, que siempre ve las columnas protegidas | Prueba con la cuenta de prueba del Lab 04 y recarga el navegador |
| No puedes crear una rollup que cuente filas de una relación N:N | Las rollup solo agregan sobre relaciones 1:N | Usa una tabla intermedia propia (dos relaciones 1:N) y haz la rollup sobre ella |
| Error de duplicado inesperado al guardar | La regla de detección de duplicados es demasiado amplia (pocos caracteres, sin ignorar vacíos) | En **Duplicate detection rules** del Admin Center, despublica la regla (**Unpublish**), ajusta los criterios y vuelve a publicarla (**Publish**) |
| La regla está publicada pero nunca avisa | La detección de duplicados está apagada en el ambiente | **Settings** → **Data management** → **Duplicate detection**: marca **Enable duplicate detection** y **When a record is created or updated** → **OK** |

### 🧪 Criterios de Validación
- [ ] Creé la N:N entre Etiqueta y Solicitud TI y anoté su Relationship name y su tabla de intersección.
- [ ] Probé el borrado de una Categoría con hijos y sé qué comportamiento de cascada lo explica.
- [ ] La columna de fórmula `Vence SLA` muestra el valor correcto y comprobé qué hace con un SLA vacío.
- [ ] Puedo explicar con un ejemplo cuándo usaría fórmula, calculada o rollup, y por qué una rollup no sirve sobre una N:N.
- [ ] Comprobé en mi ambiente que **Lock** no protege la columna fuera del formulario y sé qué usar en su lugar.
- [ ] La auditoría registró un cambio de Estado y anoté el valor anterior, el nuevo, el usuario y la hora.
- [ ] Mi regla de detección de duplicados avisó al crear una solicitud con un título repetido.
- [ ] En el reto de transferencia elegí las piezas correctas y escribí cómo probaría cada una, incluido con qué usuario.

### 📸 Evidencia para guardar
- Las tablas de evidencia de las cuatro microlecciones, del reto de construcción y del reto de transferencia.
- Capturas: la relación N:N en **Relationships**, la columna `Vence SLA` en el editor de filas y la entrada de **Audit History**.

Completa ahora: **[Lab 09 · Dataverse Avanzado — BPF, Rollup y Field Security](/labs/lab-09-dataverse-avanzado)**

**Por qué:** el Lab 09 convierte este módulo en práctica sobre la solución SIT que ya construiste: agrega columnas calculadas/rollup, seguridad de campo y un Business Process Flow sin inventar otro caso de negocio desde cero.

---

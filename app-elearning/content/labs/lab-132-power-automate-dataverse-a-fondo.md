---
id: lab-132
title: "Dataverse a fondo desde un flujo: consultas, relaciones y upsert con clave alternativa (Ruta Pro Power Automate)"
level: "N2"
duration: 300
product: ["Power Automate", "Dataverse", "Excel"]
certifications: []
role: ["Desarrollador Power Automate", "Consultor funcional"]
prerequisites:
  - "Lab 128 (Power Automate en un día) completado"
  - "Lab 130 completado: el flujo SC - Importar y limpiar histórico, la columna ID de origen y el mapa de estados"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 132 — Dataverse a fondo desde un flujo

## Objetivo

Usar Dataverse desde Power Automate como lo hace un desarrollador: **consultar** con filtros, orden, columnas y relaciones, **paginar** sin perder filas, **relacionar** una fila con otra y, sobre todo, **crear o actualizar según exista** (*upsert*) apoyándote en una **clave alternativa**, de modo que cargar el mismo archivo dos veces no duplique nada. Al terminar tendrás en Dataverse las 17 proveedoras de SIT y las 146 solicitudes históricas, cada solicitud enlazada a su proveedor.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). Hasta ahora las solicitudes tenían el proveedor como una idea. Compras necesita:

1. Una **tabla de proveedores** mantenida a partir de los archivos que envía Finanzas (hoy llega uno, el mes que viene llega uno **con cambios**), sin duplicar a nadie.
2. Que cada solicitud apunte a **su** proveedor, para saber cuánto se le ha pedido.
3. Consultas que respondan preguntas reales: *¿qué solicitudes de nivel 2 o 3 siguen pendientes?*, *¿cuánto se ha comprado a cada proveedor?*

## Lo que vas a construir

- La tabla `Proveedor` y una **relación** de `Solicitud de compra` hacia ella
- Dos **claves alternativas**: `ID de proveedor` y `ID de origen`
- El flujo `SC - Cargar proveedores`, que se puede ejecutar dos veces con el mismo resultado
- El flujo `SC - Cargar histórico (upsert)`, que enlaza cada solicitud a su proveedor
- El flujo `SC - Consultas Dataverse`, con consultas OData, `$expand`, FetchXML y paginación medidas contra cifras conocidas

## Relación con la Ruta Pro

| Antes | En este lab | Se profundiza en |
|---|---|---|
| `List rows` con un filtro de elección (Lab 128) | Filtros por texto, número, relación y orden; `Expand Query`; FetchXML | — |
| Carga con **Add a new row** (Lab 130) | **Upsert** con clave alternativa | Lab 133 (idempotencia) |
| Importaciones que "dispararon" flujos (Lab 130) | Cargas con relaciones | Lab 138 (rendimiento) |

> **Fuente del esqueleto:** el modelo de Dataverse del curso oficial PL-7002 (tabla, columnas y relaciones) y la documentación de claves alternativas y de la API web ([Learn: claves alternativas](https://learn.microsoft.com/power-apps/maker/data-platform/define-alternate-keys-portal)). Los datos, el caso y el texto son propios del curso.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — La tabla `Proveedor`, la relación y las dos claves | 50 min |
| Ejercicio 2 — Cargar proveedores con upsert (y probar que no duplica) | 55 min |
| Ejercicio 3 — Segundo archivo: cambios y un proveedor nuevo | 25 min |
| Ejercicio 4 — Cargar el histórico enlazado a su proveedor | 60 min |
| Ejercicio 5 — Consultas: filtros, orden, columnas y relaciones | 45 min |
| Ejercicio 6 — FetchXML | 25 min |
| Ejercicio 7 — Paginación sin perder filas | 25 min |
| Ejercicio 8 (opcional) — Acciones | 15 min |
| **Total** | **unas 5 h** (mejor en dos sesiones: Ejercicios 1 a 4 y 5 a 8) |

## Nivel

**N2 Intermedio** — Ruta Pro Power Automate (competencia profesional)

## Tecnologías utilizadas

- Power Apps (maker): **Solutions**, tablas, columnas, **Relationships**, **Keys**
- Power Automate: **Microsoft Dataverse** (**List rows**, **Get a row by ID**, **Update a row** / **Upsert a row**, **Add a new row**, **Perform an unbound action**), **Excel Online (Business)**, **Select**, **Filter array**, **For each**, **Compose**
- Expresiones y consultas: OData (`eq`, `ge`, `and`, `contains`, `startswith`), `$expand`, FetchXML, `length`, `coalesce`, `equals`

## Prerrequisitos

### Entorno

- [ ] El ambiente del curso con la solución `SIT Compras`, la tabla `Solicitudes de compra` y el flujo `SC - Importar y limpiar histórico` del [Lab 130](/labs/lab-130-power-automate-expresiones-y-datos)
- [ ] **Apagados** durante todo el lab: `SC - Aprobar solicitud`, `SC - Aprobar solicitud (cadena)`, `SC - Alertar compra grande` y `SC - Avisar a TI` (cargar filas no debe lanzar aprobaciones ni avisos). Los vuelves a encender al terminar
- [ ] El paquete [sit-compras.zip](/practice-assets/powerautomate/sit-compras/sit-compras.zip) extraído. Sube a OneDrive for Business `proveedores.xlsx` y `proveedores-actualizacion.xlsx` (tabla de Excel `Proveedores` en ambos)
- [ ] Las cinco filas pendientes del Lab 130 siguen en la tabla (este lab las **actualiza**, no las duplica: esa es la prueba de que el upsert funciona)

### Conocimiento previo

- [Módulo 2](/nivel/basico/modulo/dataverse-fundamentos-y-modelado-basico): tablas, columnas y relaciones
- Lab 130: el mapa de estados (`Mapa de estados`) y la limpieza con **Select**

> **Alternativa sin flujo:** Power Apps también importa Excel o CSV con la opción **Import** > **Import data from Excel** de la tabla (mapeo de columnas incluido) y respeta una clave alternativa si la eliges ([Learn: importar datos](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-import-export)). El flujo de este lab es lo que usas cuando la carga se repite o necesita lógica.

### Verificación rápida antes de empezar

- [ ] Cuenta las filas de `Solicitudes de compra` (en Power Apps, **Tables** > la tabla > **Data**): anota el número
- [ ] Abre `proveedores-actualizacion.xlsx` y compáralo con `proveedores.xlsx`: ¿qué cambió? (lo comprobarás en el Ejercicio 3)

---

## Ejercicio 1 — La tabla `Proveedor`, la relación y las dos claves

**Objetivo:** el modelo sobre el que descansa el upsert.

### Tarea 1.1 — La tabla

1. En la solución `SIT Compras`: **New** > **Table** > **Table (advanced properties)**. **Display name** `Proveedor`, **Plural display name** `Proveedores`. En **Primary column**, el nombre `Nombre`.
2. Añade estas columnas:

| Display Name | Data type | Required |
|---|---|---|
| `ID de proveedor` | Text | Business required |
| `NIT` | Text | Business required |
| `Correo de facturación` | Email | No |
| `País` | Text | No |
| `Categoría` | Text | No |
| `Condición de pago (días)` | Whole Number | No |
| `Activo` | Yes/No | No (por defecto **Yes**) |

3. **Anota los logical names en minúsculas** (Advanced options > **Schema name**, en minúsculas) y el **entity set name** de la tabla (**Tools** > **Copy set name**), como en el Lab 128.

> **Los nombres de este lab son ejemplos.** Dataverse quita espacios y a veces letras con tilde ("Categoría" puede quedar `sit_categora`, "Nivel de aprobación" `sit_niveldeaprobacin`) y pluraliza con reglas del inglés (la tabla `sit_proveedor` puede quedar como `sit_proveedors` y no `sit_proveedores`). **Copia los tuyos** y sustitúyelos en todas las consultas.

### Tarea 1.2 — La relación

4. En `Solicitud de compra`, **New column**: **Display name** `Proveedor`, **Data type** **Lookup**, **Related table** `Proveedor`. (Crea una relación varios-a-uno: muchas solicitudes, un proveedor.) Anota el logical name de la columna (por ejemplo `sit_proveedor`) y su **Schema name con mayúsculas** (por ejemplo `sit_Proveedor`): ese Schema name es la **propiedad de navegación** que usa `$expand` en el Ejercicio 5. **No es** el nombre de la relación ([Learn: relaciones](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entity-relationships)).

### Tarea 1.3 — Las dos claves alternativas

5. **Antes** de crear la clave sobre `ID de origen`, filtra la tabla por esa columna y comprueba que **ningún** `SC-2026-…` aparece dos veces (si ejecutaste dos veces la carga del Lab 130, habrá duplicados y el índice quedaría en **Failed**: bórralos primero). *Sin verificar en Learn:* cómo trata la clave las filas con `ID de origen` vacío (las pruebas de los Labs 128 a 131). En `Proveedor`, **Keys** > **New key**: **Display name** `Clave ID de proveedor`, columna `ID de proveedor`. En `Solicitud de compra`, **Keys** > **New key**: `Clave ID de origen`, columna `ID de origen` (la creaste en el Lab 130). **Save** ([Learn: definir claves alternativas](https://learn.microsoft.com/power-apps/maker/data-platform/define-alternate-keys-portal)).
6. Mira el **estado** de cada clave: Dataverse crea un índice y, hasta que termina, la clave aparece como **Pending** y no se puede usar. Espera a que diga **Active** (puede tardar unos minutos; con tablas con muchos datos, más).

> **Qué es una clave alternativa:** un identificador **de negocio** (aquí `PRV-001`, `SC-2026-0008`) que Dataverse trata como único. Así puedes decir "la fila cuyo `ID de proveedor` es `PRV-001`" sin conocer su GUID, y Dataverse **rechaza** una segunda fila con la misma clave. Sin clave, una carga repetida crea duplicados: el sistema no tiene cómo saber que "PRV-001" ya existe.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| Logical names de `ID de proveedor`, `País` y del lookup `Proveedor` | ___ |
| Estado de las dos claves | ___ (esperado: Active) |

---

## Ejercicio 2 — Cargar proveedores con upsert

**Objetivo:** un flujo que se puede ejecutar dos veces con el mismo resultado.

1. Duplica el patrón del Lab 130: flujo instantáneo `SC - Cargar proveedores`. **Excel Online (Business)** > **List rows present in a table** sobre `proveedores.xlsx`, tabla `Proveedores`. Renómbrala `Leer Excel`.
2. **For each** sobre `value` de `Leer Excel`. Dentro, **Microsoft Dataverse** > **Upsert a row** (modifica la fila si existe o la crea si no; [Learn: conector de Dataverse](https://learn.microsoft.com/connectors/commondataserviceforapps/)), **Table name** `Proveedores`, con la clave alternativa como identificador de la fila (**Row ID** = `sit_iddeproveedor='PRV-001'`, es decir, `<logical name de la clave>='<valor>'`, que en el bucle se construye con `concat('sit_iddeproveedor=''', item()?['ProveedorID'], '''')`) y estos valores. *Sin verificar en Learn:* que el **Row ID** del conector acepte la clave alternativa (la API web sí lo documenta, y el conector describe el campo como un GUID). **Si tu conector lo rechaza**, usa el patrón de respaldo: **List rows** con `sit_iddeproveedor eq '<ID>'` y **Row count** `1`, una **Condition** sobre `length(...)` y, según el caso, **Update a row** (con el GUID encontrado) o **Add a new row**. Hace lo mismo con dos llamadas más por fila (todos con **fx**, porque el Excel entrega texto):

| Columna | Valor |
|---|---|
| `ID de proveedor` | `item()?['ProveedorID']` |
| `Nombre` | `item()?['Nombre']` |
| `NIT` | `item()?['NIT']` |
| `Correo de facturación` | `item()?['Correo']` |
| `País` | `item()?['Pais']` |
| `Categoría` | `item()?['Categoria']` |
| `Condición de pago (días)` | `int(item()?['CondicionPagoDias'])` |
| `Activo` | `equals(item()?['Activo'], 'Sí')` |

   (Dentro del bucle sirve `item()`; `items('For_each')` solo hace falta para referirte a un bucle exterior.)
3. **Save** y **Test**. Cuenta las filas de `Proveedores`. **Ejecuta el flujo una segunda vez** y vuelve a contarlas.

### Resultado esperado del Ejercicio 2

| Ejecución | Filas en `Proveedores` |
|---|---|
| Primera | **17** (15 activos y 2 inactivos) |
| Segunda | **17**: no se duplicó ninguno |

### Tarea 2.1 — Ver lo que hace la clave

4. Añade temporalmente, **fuera** del bucle, una acción **Add a new row** de `Proveedores` con valores fijos (`ID de proveedor` = `PRV-001`, `Nombre` y `NIT` cualesquiera) y ejecuta.

**Resultado esperado:** esa acción falla con un error de **clave duplicada** (ya existe una fila con esa clave): Dataverse **protege** la tabla. Sin la clave, una carga con **Add a new row** dentro del bucle habría llegado a 34 filas sin ningún error. Borra la acción temporal.

> **Dos defensas distintas:** el **upsert** hace que repetir **funcione** (actualiza lo que existe). La **clave** hace que un error de diseño **no corrompa** los datos. Se usan juntas.

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| Filas tras la primera y la segunda ejecución | ___ y ___ (esperado: 17 y 17) |
| Mensaje de error de **Add a new row** con la clave | ___ |

---

## Ejercicio 3 — Segundo archivo: cambios y un proveedor nuevo

**Objetivo:** el caso real: llega un archivo "actualizado" con diferencias.

1. Antes de ejecutar nada, **compara** `proveedores.xlsx` con `proveedores-actualizacion.xlsx` y escribe **qué cambió**: filas nuevas, valores modificados y estados.
2. Cambia el archivo del flujo a `proveedores-actualizacion.xlsx` y ejecuta **Test**.
3. Comprueba en la tabla `Proveedores`.

### Resultado esperado del Ejercicio 3

| Qué | Antes | Después |
|---|---|---|
| Filas en total | 17 | **18** |
| Proveedor nuevo | — | **PRV-018** (Soporte Integral Delta S.A.S., Colombia, Tecnología) |
| `Condición de pago (días)` de **PRV-003** | 45 | **60** |
| **PRV-005** | Inactivo | **Activo** |
| Proveedores activos | 15 | **17** |

Tres cambios, un archivo, **ningún duplicado**. El flujo no necesita saber qué es nuevo y qué no: la clave decide.

> **Lo que un upsert no hace:** si Finanzas **quita** un proveedor del archivo, el upsert **no lo borra** (no sabe que falta). Hay que decidir cómo se tratan las bajas (marcar como inactivo los que no vengan, por ejemplo) y es una decisión de negocio, no de técnica.

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| Filas, activos y `Condición de pago (días)` de PRV-003 | ___ , ___ , ___ (esperado: 18, 17, 60) |
| Qué cambió entre los dos archivos (tu lista antes de ejecutar) | ___ |

---

## Ejercicio 4 — Cargar el histórico enlazado a su proveedor

**Objetivo:** las 146 solicitudes limpias en Dataverse, cada una apuntando a su proveedor, sin duplicar las cinco pendientes del Lab 130.

1. Duplica `SC - Importar y limpiar histórico` (**Save as**): `SC - Cargar histórico (upsert)`; comprueba que la copia está en la solución (si no, **Add existing**). Conserva la lectura de Excel, las dos **Select** de limpieza, `Mapa de estados` y `Filas validas`. **Quita, en este orden** (el diseñador no deja borrar una acción de la que otra depende): el **For each** de la carga del Lab 130 (con su **Add a new row**), el filtro `Pendientes`, el **For each** del total, `Initialize variable TotalImporte`, los cuatro filtros de suciedad, `Validas de marzo` y `Validas de octubre`, el informe y el correo.
2. Añade a la primera **Select** (`Limpiar filas`) la columna `ProveedorID` = `item()?['ProveedorID']` y propágala en `Calcular importes`.
3. **For each** sobre **Outputs** de `Filas validas`. Dentro, el upsert de **Solicitudes de compra** con la clave `ID de origen`, y estos valores:

| Columna | Valor |
|---|---|
| `Título` | `concat(item()?['Id'], ' — ', item()?['Descripcion'])` |
| `Área` / `Categoría` | `item()?['Area']` / `item()?['Categoria']` |
| `Cantidad` / `Precio unitario` / `Importe` | `item()?['Cantidad']` / `item()?['Precio']` / `item()?['Importe']` |
| `Nivel de aprobación` | `if(lessOrEquals(item()?['Importe'], 1000), 1, if(lessOrEquals(item()?['Importe'], 10000), 2, 3))` |
| `Estado solicitud` | `coalesce(outputs('Mapa_de_estados')?[item()?['Estado']], outputs('Mapa_de_estados')?['Pendiente'])` |
| `Correo del solicitante` | `item()?['Solicitante']` |
| `Fecha de solicitud` | `item()?['Fecha']` |
| `Proveedor` (**lookup**) | la referencia a la fila por **clave alternativa**, con el nombre del conjunto de entidades de `Proveedor` y la clave: `sit_proveedores(sit_iddeproveedor='<ID>')`, construida con `concat` ([Learn: referenciar filas por clave alternativa](https://learn.microsoft.com/power-apps/developer/data-platform/use-alternate-key-reference-record)) |

   Para el lookup, la expresión completa queda así (con **tus** nombres):

```text
concat('sit_proveedores(sit_iddeproveedor=''', item()?['ProveedorID'], ''')')
```

   (Dentro de una cadena de expresión, la comilla simple se escribe doble: `''`.) *Sin verificar en Learn:* que el campo del lookup del conector acepte esta forma en el diseñador nuevo; si no la acepta, busca primero la fila del proveedor con **List rows** (filtro por `ID de proveedor`) y usa su GUID.
4. **Save** y **Test**. La ejecución dura de **3 a 6 minutos** (146 iteraciones en serie) y la vas a ejecutar dos veces: es normal y es el tema del Lab 138. Dataverse limita las solicitudes por usuario (6.000 cada 5 minutos, con error 429 y la cabecera `Retry-After` al pasarse; [Learn: límites de la API](https://learn.microsoft.com/power-apps/developer/data-platform/api-limits)): 146 filas están muy por debajo, una carga de decenas de miles no.
5. Cuenta las filas con `ID de origen` que empiezan por `SC-2026` y comprueba una solicitud de proveedor conocido (por ejemplo `SC-2026-0114`, Tecnología, nivel 2, proveedor **PRV-002**).

### Resultado esperado del Ejercicio 4

| Qué | Valor |
|---|---|
| Filas con `ID de origen` `SC-2026-…` | **146** |
| Las cinco pendientes del Lab 130 | Siguen siendo **cinco** (se actualizaron, no se duplicaron) y ahora tienen proveedor |
| Estado: Aprobada / Rechazada / Pendiente | **127 / 14 / 5** |
| Solicitudes del proveedor **PRV-013** | **22** (importe total **59.960**) |

Vuelve a ejecutar el flujo. El resultado debe ser el **mismo** (146, no 292).

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Filas con `SC-2026-…` tras ejecutar una y dos veces | ___ y ___ (esperado: 146 y 146) |
| Estados: Aprobada, Rechazada y Pendiente | ___ , ___ , ___ |
| Proveedor de la solicitud SC-2026-0114 | ___ |

---

## Ejercicio 5 — Consultas: filtros, orden, columnas y relaciones

**Objetivo:** pedirle a Dataverse **solo** lo que necesitas, con las expresiones OData de **List rows** ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows)).

1. Crea el flujo instantáneo `SC - Consultas Dataverse`. Para cada consulta, una acción **List rows** de `Solicitudes de compra` y una **Compose** con `length(outputs('<acción>')?['body/value'])`.
2. Escribe estas consultas (con **tus** logical names; para el estado, el valor numérico de la opción):

| # | Qué pregunta | **Filter rows** (y otros campos) | Esperado |
|---|---|---|---|
| Q1 | Históricas de nivel 2 o 3 | `startswith(sit_iddeorigen,'SC-2026') and sit_niveldeaprobacion ge 2` | **94** |
| Q2 | Pendientes de nivel 2 o 3 | Q1 más `and sit_estadosolicitud eq <valor de Pendiente>` | **2** (SC-2026-0035 y SC-2026-0114) |
| Q3 | Tecnología de nivel 2 o 3 | Q1 más `and sit_categoria eq 'Tecnología'` | **20** |
| Q4 | Las tres de mayor importe | `startswith(sit_iddeorigen,'SC-2026')` con **Sort By** `sit_importe desc` y **Row count** `3` | tres de **18.500** |
| Q5 | Solo columnas necesarias | Q1 con **Select columns** `sit_iddeorigen,sit_importe` | 94 filas, solo esas columnas (y la clave primaria) |

   (Los nombres de columna usan **minúsculas**, como en el Lab 128. Los textos van entre comillas simples; los valores de una elección, como número, sin comillas.)
3. Una consulta por relación, la **Q6**: solicitudes del proveedor `PRV-013`. Filtra por la columna del lookup con el formato `_<columna>_value eq <GUID del proveedor>` (el GUID lo obtienes con **List rows** de `Proveedores` filtrando por `sit_iddeproveedor eq 'PRV-013'`) ([Learn: consultas con lookups](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/filter-rows)).

   **Esperado:** **22** filas.
4. **Q7, `Expand Query`:** en `List rows` de solicitudes, **Filter rows** `startswith(sit_iddeorigen,'SC-2026')` (para no traer las pruebas de otros labs, que no tienen proveedor), **Expand Query** = `sit_Proveedor($select=sit_nombre)` (con **tu** Schema name del lookup, respetando las mayúsculas) y **Row count** `5`. En la salida, cada solicitud trae **dentro** el nombre de su proveedor.

   **Esperado:** cada fila trae un objeto con el `sit_nombre` del proveedor; no hace falta una segunda consulta por proveedor.

> **Por qué filtrar en Dataverse y no en el flujo:** `Filter rows` se evalúa en el **servidor**: lo que no coincide **nunca llega** al flujo. Traer 146 filas y filtrarlas con **Filter array** funciona, pero gasta tiempo, llamadas y memoria, y con tablas grandes **topa con el límite de filas** de la acción (Ejercicio 7). Regla: **filtra en el origen, selecciona solo las columnas necesarias y ordena donde puedas**.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Resultados de Q1 a Q3 | ___ , ___ , ___ (esperado: 94, 2, 20) |
| Importe de las tres filas de Q4 | ___ (esperado: 18500, 18500, 18500) |
| Q6 (PRV-013) | ___ (esperado: 22) |

---

## Ejercicio 6 — FetchXML

**Objetivo:** consultas que OData no expresa fácilmente: uniones con otra tabla y agregados ([Learn: FetchXML](https://learn.microsoft.com/power-apps/developer/data-platform/fetchxml/overview)).

1. En `SC - Consultas Dataverse`, otra **List rows** de `Solicitudes de compra` con **Fetch Xml Query** (en los parámetros avanzados). Escribe, con **tus** nombres lógicos y el nombre de tu lookup:

```xml
<fetch>
  <entity name="sit_solicituddecompra">
    <attribute name="sit_iddeorigen" />
    <attribute name="sit_importe" />
    <filter>
      <condition attribute="sit_iddeorigen" operator="begins-with" value="SC-2026" />
    </filter>
    <link-entity name="sit_proveedor" from="sit_proveedorid" to="sit_proveedor" alias="prv">
      <attribute name="sit_nombre" />
      <filter>
        <condition attribute="sit_iddeproveedor" operator="eq" value="PRV-013" />
      </filter>
    </link-entity>
  </entity>
</fetch>
```

   (`sit_solicituddecompra` es el nombre **lógico** de la tabla, en singular; `sit_proveedorid` es la columna de clave primaria de `Proveedor`; copia los tuyos de **Advanced options**.)
2. **Esperado:** **22** filas, cada una con el nombre del proveedor en una columna con el alias (`prv.sit_nombre`).
3. **Compara** esta consulta con la Q6: ¿cuál es más fácil de leer? ¿cuál cambia menos si añades una segunda condición sobre el proveedor? Anótalo.

> **Cuándo FetchXML y cuándo OData:** OData para filtros y orden sencillos; FetchXML para **varias tablas a la vez** o consultas que pegues desde otra herramienta. **Límites (Learn, 2026-11-21):** la paginación automática de la acción **no funciona con FetchXML** (para pasar de 5.000 filas hay que paginar dentro del propio FetchXML) y las consultas de **agregación** (`count`, `sum`) **no se admiten** en **List rows** ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows)). Para sumar, trae las filas y acumula con una variable (Lab 130).

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Filas de la consulta FetchXML | ___ (esperado: 22) |
| Columna donde llega el nombre del proveedor | ___ |

---

## Ejercicio 7 — Paginación sin perder filas

**Objetivo:** que ninguna consulta devuelva "de menos" sin avisar.

1. Una **List rows** de `Solicitudes de compra` con **Filter rows** `startswith(sit_iddeorigen,'SC-2026')` y **Row count** `50`, sin paginación. **Esperado: 50 filas.**
2. La misma consulta **borrando el Row count** (este se traduce en un límite total y la paginación no lo anula) y con **Pagination** activada (**Settings** > **Networking** > **Pagination**) y **Threshold** `1000`. **Esperado: 146.**
3. La misma, sin **Row count**, con **Threshold** `100`. **Anota** qué obtienes. En **Settings** la paginación está en **Networking** > **Pagination**; Learn indica que el umbral máximo es de 100.000 y que **se redondea al tamaño de página** (con un umbral de 7.000 se devuelven 10.000), así que un umbral pequeño puede devolver **más** de lo que pediste ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows)).

| Configuración | Filas devueltas |
|---|---|
| **Row count** 50, sin paginación | **50** |
| Paginación, **Threshold** 1000 | **146** |
| Paginación, **Threshold** 100 | ___ (anótalo: puede ser 100, o la página completa) |

> **La lección:** una consulta con límite **no falla** al llegar al límite: devuelve lo que cabe. Tu flujo cree que hay 50 solicitudes cuando hay 146. Cuando el resultado importa, **compara con el total** (`Row count` de FetchXML, `$count`, o el valor que esperas) y falla si no cuadra.

---

## Ejercicio 8 (opcional) — Acciones

**Objetivo:** Dataverse también ofrece **acciones** (operaciones con nombre, no solo leer y escribir filas).

Este ejercicio es de **lectura**: Learn no trae un ejemplo ejecutable con acciones estándar, y las acciones propias llegan en módulos posteriores.

1. Abre [Learn: acciones enlazadas y no enlazadas](https://learn.microsoft.com/power-automate/dataverse/bound-unbound). El conector tiene **Perform a bound action** (**Table name**, **Action Name**, **Row ID**: la acción se ejecuta **sobre una fila concreta**) y **Perform an unbound action** (solo **Action Name**: no depende de una fila).
2. Anota también las acciones **Relate rows** y **Unrelate rows** (**Table name**, **Row ID**, **Relationship** y **Relate with**, la URL de la otra fila): sirven para relaciones varios-a-varios, donde no hay una columna de lookup.
3. Escribe un ejemplo de tu proyecto donde usarías cada una. Las acciones personalizadas de una solución (Módulo 17) usan las dos formas.

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| La carga duplica filas | No hay clave alternativa activa, o se usa **Add a new row** | Clave activa y upsert (Ejercicios 1 y 2) |
| La clave sigue en **Pending** | El índice aún se construye | Espera; revisa que la columna es de un tipo admitido |
| El upsert falla "clave no existe" | El nombre de la clave o de la columna no coincide con los de Dataverse | Copia los logical names de **Advanced options** |
| La consulta devuelve 50 o 5000 filas "de menos" | Límite de **Row count** o de paginación | Activa **Pagination** y compara con un total esperado |
| `Filter rows` da error de sintaxis | Comillas dobles, nombre visible o un texto sin comillas | Comillas simples; logical names en minúsculas |
| La columna del lookup no se filtra con `eq` | Se usó el nombre de la columna en lugar de `_nombre_value` | `_<columna>_value eq <GUID>` |
| El lookup no se asigna | La referencia a la fila tiene mal el nombre del conjunto de entidades | `entityset(clave='valor')` con el **entity set name** exacto |
| Las cargas disparan aprobaciones | Los flujos de negocio estaban encendidos | Apágalos durante la carga |

## 🔧 Diagnóstico y reparación

### "Hay 146 solicitudes cargadas pero 8 no tienen proveedor"

1. **¿El lookup llegó vacío o con un error?** Abre la ejecución y mira esas filas: ¿qué `ProveedorID` traen?
2. **¿Existe ese proveedor en `Proveedores`?** Busca el `ID de proveedor` (¿un espacio de más? ¿otra capitalización?).
3. **¿El upsert de proveedores se hizo antes que el de solicitudes?** El orden importa: no puedes enlazar a algo que aún no existe.
4. **Repara** y vuelve a ejecutar: es idempotente, no duplica.

## Checklist final

- [ ] Tabla `Proveedor`, lookup en `Solicitud de compra` y dos claves **Active**
- [ ] `SC - Cargar proveedores` ejecutado dos veces sin duplicados (17 filas) y luego con el archivo actualizado (18 filas, 17 activos)
- [ ] `SC - Cargar histórico (upsert)`: 146 filas, las cinco pendientes actualizadas, sin duplicados al repetir
- [ ] Consultas Q1 a Q7 con las cifras esperadas
- [ ] FetchXML con 22 filas y paginación medida
- [ ] Los flujos de negocio vueltos a encender

## Evidencia esperada

- Captura de las dos claves en estado **Active**
- Captura de la tabla `Proveedores` con 18 filas y la fila de **PRV-003** con 60 días
- Captura de la tabla de solicitudes filtrada por `SC-2026` (146 filas) con la columna `Proveedor`
- Tus respuestas de validación y la tabla de paginación completada

## Criterios de aprobación

- Ejecutar dos veces cualquiera de las cargas deja el **mismo** resultado
- Las cifras de las consultas coinciden con las esperadas
- Cada solicitud histórica apunta a su proveedor
- Explicas qué hace una clave alternativa, qué no hace un upsert (las bajas) y por qué una consulta con límite no avisa

## Competencias desarrolladas

- Modelar una relación y claves alternativas en Dataverse
- Cargar y sincronizar datos con upsert, sin duplicar
- Consultar con OData (`$filter`, `$orderby`, `$select`, `$expand`) y FetchXML
- Paginar y verificar totales
- Distinguir cuándo filtrar en el servidor y cuándo en el flujo

## Reto adicional

**Reto básico:** añade al upsert de proveedores una columna `Última carga` con `utcNow()` y comprueba que cambia en cada ejecución aunque nada más cambie.

**Reto intermedio:** marca como **inactivos** los proveedores que existen en Dataverse pero no vienen en el archivo (pista: **List rows** de proveedores activos, una comparación por `ID de proveedor` con **Filter array** y una actualización).

**Reto avanzado:** calcula el **importe total del proveedor PRV-013** (esperado **59.960**) con una consulta que traiga solo ese proveedor y un acumulador en una variable, y explica por qué no usaste FetchXML agregado.

## Preguntas de repaso

1. ¿Qué dos problemas distintos resuelven el upsert y la clave alternativa?
2. ¿Por qué un upsert no sirve para las bajas?
3. ¿Qué diferencia hay entre filtrar con `Filter rows` y con **Filter array**?
4. ¿Por qué una consulta con límite puede "funcionar" y estar mal?
5. ¿Cuándo elegirías FetchXML en lugar de OData?

## Limpieza del laboratorio

Conserva las tablas, las claves y los flujos de carga: los Labs 133, 135 y 139 los usan. **Enciende de nuevo** `SC - Aprobar solicitud (cadena)`, `SC - Alertar compra grande` y `SC - Avisar a TI` (el flujo original `SC - Aprobar solicitud` sigue apagado). Aviso: en una tabla con 146 filas históricas, cualquier flujo de **Modified** que se encienda ahora podría dispararse con ediciones futuras; revísalo si añades filtros.

## Siguiente laboratorio recomendado

**Lab 133 — Errores, reintentos e idempotencia**: Try / Catch / Finally, reintentos medidos, concurrencia y diseño de flujos que no duplican.

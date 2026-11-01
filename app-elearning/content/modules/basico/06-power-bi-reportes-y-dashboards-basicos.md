---
moduleId: 6
title: "Power BI - Reportes y Dashboards Básicos"
level: "basico"
certification: "PL-900"
estimatedMinutes: 25
practiceMinutes: 125
slug: "power-bi-reportes-y-dashboards-basicos"
lastVerified: "2026-11"
---
*Duración: 2 semanas · Lectura: 12-15 min · Con práctica: unos 125 min con Power BI Desktop ya instalado; la primera vez, cuenta entre el doble y el triple (reporte local en Power BI Desktop); publicación, refresh y RLS pueden quedar para una segunda sesión*

### 🎯 Objetivo
Crear reportes interactivos y dashboards conectados a Dataverse y otras fuentes.

### ✅ Qué vas a lograr hoy (Núcleo obligatorio)
- Conectar Power BI Desktop a datos de solicitudes.
- Crear un modelo simple con relaciones.
- Construir un reporte de 2 páginas con KPIs, gráficos y filtros básicos.

### 🔧 Qué queda para después (Profundización opcional)
- Publicar en Power BI Service, configurar refresh, compartir dashboards y aplicar Row-Level Security. Son habilidades importantes, pero dependen más de permisos/licencias del tenant.

### 📚 Mini-glosario antes de abrir Power BI

| Término | En una frase |
|---|---|
| **Power BI Desktop** | La aplicación de Windows donde creas el reporte (un archivo `.pbix`). |
| **Power BI Service** | El sitio web donde publicas y compartes reportes con otras personas. |
| **Power Query** | El editor para limpiar y preparar los datos antes de visualizarlos (quitar columnas, renombrar, cambiar tipos). |
| **M** | El lenguaje en el que Power Query guarda cada paso de limpieza. Casi siempre lo escribe Power Query por ti cuando usas los botones. |
| **DAX** | Lenguaje de fórmulas, parecido a las fórmulas de Excel, para crear métricas como totales, porcentajes y promedios. |
| **Medida (measure)** | Una fórmula DAX que calcula una cifra y se recalcula sola según los filtros que tengas activos. |
| **RLS** | Seguridad por filas: cada usuario ve solo los datos que le corresponden. |
| **Lienzo** (canvas) | El área en blanco del centro de **Report view** donde colocas los visuales. |
| **Navigator** | La ventana que aparece al conectar una fuente: muestra sus tablas para que marques cuáles cargar. |
| **Refresh** (actualizar) | Volver a leer los datos de la fuente para que el reporte muestre lo más reciente. |
| **GUID** | Identificador único de una fila en Dataverse: un código largo de letras y números, como `3f2a...`. Sirve para unir tablas, no para leerlo. |
| **UTC** | La hora universal de referencia, sin zona horaria. Dataverse guarda las fechas en UTC. |
| **TDS endpoint** | La "puerta" de Dataverse por la que Power BI lee los datos con el conector Dataverse. Debe estar activada en el entorno. |
| **Measure tools** | Pestaña de la cinta que aparece al seleccionar una medida; ahí cambias su formato (por ejemplo, porcentaje). |
| **CALCULATE, ALL, REMOVEFILTERS** | Funciones DAX que verás más adelante: `CALCULATE` calcula una expresión cambiando los filtros; `ALL` y `REMOVEFILTERS` quitan filtros. En este módulo no las necesitas. |
| **OAuth** | La forma de iniciar sesión con tu cuenta de trabajo para que el Service lea los datos por ti, sin guardar tu contraseña en el reporte. |
| **Fabric** | Microsoft Fabric, la plataforma de datos de Microsoft de la que Power BI forma parte; administración y licencias van integradas. |
| **PPU** y **capacidad** | **PPU** (Premium Per User) es una licencia por persona con funciones Premium. Una **capacidad** (Power BI Premium o Fabric F64 o mayor) es un recurso que compra la empresa: el contenido guardado en ella se puede compartir también con usuarios de licencia gratuita. |

### 📖 Conceptos Clave
- **Componentes**
    - **Power BI Desktop**: aplicación de Windows para conectar datos y diseñar reportes.
    - **Power BI Service**: sitio web de Power BI para publicar, actualizar y compartir.
    - **Power BI Mobile**: aplicación del teléfono para consultar reportes y dashboards publicados.
- **Fuentes de datos**: Dataverse, Excel, SQL, APIs, Web
    - **SQL (SQL Server)**: base de datos relacional muy usada en empresas.
    - **API**: "ventanilla" por la que un programa entrega datos a otro.
    - **Web**: datos que se leen directamente desde una página o dirección de internet.
- **Modelo de datos**
    - **Star schema** (esquema en estrella): una tabla central con los hechos (las solicitudes) rodeada de tablas descriptivas (contactos, categorías).
    - **Relationship** (relación): la conexión entre dos tablas a través de una columna que tienen en común.
    - **Cardinality** (cardinalidad): cuántas filas de una tabla corresponden a cuántas de la otra (por ejemplo, muchos a uno).
- **Transformaciones**
    - **Power Query**: el editor donde limpias los datos con botones.
    - **M language**: el lenguaje en que Power Query guarda cada paso; lo ves en **View > Advanced Editor**.
    - **Applied Steps**: la lista de pasos de limpieza que Power Query repite cada vez que actualizas los datos.
- **Visualizaciones**
    - **Charts**: gráficos (barras, líneas, anillo).
    - **Tables / Matrix**: tablas simples y tablas cruzadas (filas por columnas).
    - **Maps**: mapas con datos geográficos.
    - **Custom visuals**: visuales adicionales que se importan aparte; no son parte de Power BI de fábrica.
- **DAX básico**
    - **Measure** (medida): fórmula que calcula una cifra según los filtros activos.
    - **Calculated column** (columna calculada): fórmula que agrega una columna fija a la tabla, fila por fila.
- **Filtros**
    - **Visual / Page / Report level filters**: filtros que afectan a un visual, a una página o a todo el reporte, en el panel **Filters**.
    - **Slicer**: un visual en el lienzo que funciona como filtro con clics (lista, rango de fechas).
- **Interactividad**
    - **Cross-filtering / cross-highlighting**: al hacer clic en un visual, los demás de la página se filtran o resaltan.
    - **Drill-down**: bajar de nivel dentro de un mismo visual (año > trimestre > mes > día).
    - **Drill-through**: saltar a otra página de detalle filtrada por el elemento elegido.
    - **Tooltip**: la ventanita de información que aparece al pasar el mouse sobre un dato.
- **Publicación**
    - **Workspace** (área de trabajo): carpeta compartida en Power BI Service donde viven reportes y datos.
    - **Semantic model** (modelo semántico, antes "dataset"): los datos, relaciones y medidas que se publican junto con el reporte.
    - **Dashboard**: una sola página en el Service hecha con visuales "anclados" (pinned) desde uno o varios reportes.
    - **App**: un paquete de reportes y dashboards de un workspace que se distribuye a muchos usuarios.
- **Modos de conexión**
    - **Import**: Power BI copia los datos al archivo y los actualiza cuando haces refresh.
    - **DirectQuery**: Power BI no copia los datos; consulta la fuente cada vez que un visual lo necesita.
- **Row-Level Security (RLS)**: reglas que filtran las filas que ve cada usuario según quién es.

### 👨‍💻 Actividades Prácticas

#### 🟢 Núcleo obligatorio

> **Cómo está organizado el Núcleo:** construyes el reporte en tres bloques (tu primer reporte con datos de ejemplo, conectar y modelar, visualizaciones y medidas). En cada uno alternas una idea corta, una práctica de pocos minutos y un dato real de tu propio reporte. Cierras con un reto en el que ya no te digo los pasos. Las microprácticas no necesitan Power BI; el reporte sí necesita Power BI Desktop (gratuito). Tu archivo `.pbix` es la evidencia. Si quieres practicar más, el [Lab 06 · Power BI — Reporte de Solicitudes TI desde Dataverse](/labs/lab-06-power-bi-reporte-solicitudes) es **opcional**: repite el reporte, clic a clic, sobre las tablas del Lab 02, y no hace falta para avanzar al Módulo 7.

## 🧩 Microlección 1 — Tu primer reporte: una pregunta, un visual

**¿Qué vas a aprender?** Que un reporte es una tabla de datos más visuales que responden preguntas, y cómo elegir el visual según la pregunta.

**¿Por qué existe esto?** Un gráfico mal elegido (un pastel con 300 partes, una línea para una cifra única) esconde la respuesta en vez de mostrarla. Elegir el visual es decidir qué pregunta responde el reporte.

**Ejemplo pequeño:** "¿cuántas solicitudes hay en total?" se responde con una tarjeta; "¿cómo se reparten por estado?" con barras; "¿cómo evolucionan por mes?" con una línea.

**Ahora haz algo — micropráctica (6 min):** **[Elegir el visual correcto para cada pregunta](/practica/ip-dv-008-elegir-visual-correcto)**. Te da cuatro preguntas de un gerente y te pide emparejar cada una con el visual que la responde bien.

**Práctica real en Power BI Desktop (15 min):** haz la Práctica 6.0 de abajo; no necesita Dataverse.

**Evidencia a reportar (el dato exacto que viste, no un "sí/no"):**

| Campo | Tu valor |
|---|---|
| Qué estado tiene la barra más alta de tu gráfica y qué valor | ___ |
| El número que muestra tu tarjeta (card) | ___ |
| Por qué elegiste ese tipo de visual para la tarjeta y para la gráfica | ___ |

##### Práctica 6.0: Primera victoria con datos de ejemplo

> Si todavía no tienes Dataverse listo o Power BI Service disponible, empieza aquí. La meta es ver un reporte en pantalla antes de configurar todo. Si aún no tienes Power BI Desktop, instálalo primero con el Paso 1 de la Práctica 6.1.

1. Abre Power BI Desktop y crea un reporte en blanco.
2. En la pestaña **Home** de la cinta, selecciona **Enter data**. Se abre la ventana **Create Table**.
3. Escribe los nombres de las dos columnas (`Estado` y `Cantidad`) y estas filas:
   | Estado | Cantidad |
   |---|---:|
   | Nueva | 5 |
   | En Proceso | 8 |
   | Resuelta | 12 |
   | Cerrada | 4 |

   La tabla vacía trae un encabezado genérico (por ejemplo `Column1`). Para renombrarlo, haz doble clic en el encabezado y escribe `Estado`. Para agregar otra columna o más filas, escribe en la celda vacía de la derecha o de abajo, o usa el botón **+** si lo ves junto a ellas. Si te equivocas en una celda, haz clic en ella y corrígela.
4. Selecciona **Load**. Power BI crea una tabla llamada `Table`; la verás en el panel **Data** (a la derecha).
5. Crea la gráfica de columnas:
    1. Haz clic en un espacio vacío del lienzo (el área en blanco del centro).
    2. En el panel **Visualizations**, elige el ícono **Clustered column chart** (gráfico de columnas agrupadas: barras verticales). Si no sabes cuál es, pasa el mouse sobre los íconos: el nombre aparece al hacerlo.
    3. En un gráfico de columnas, las categorías van al eje horizontal y los valores al vertical: arrastra `Estado` al área **X-axis** y `Cantidad` al área **Y-axis** ([Learn](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-column-charts)).
6. Crea la tarjeta:
    1. Haz clic en un espacio vacío del lienzo.
    2. En **Visualizations**, elige **Card**.
    3. Arrastra `Cantidad` al área **Values** de la tarjeta. Debe mostrar **29** (la suma).
7. Guarda el archivo con **File > Save** como `primer-reporte-power-bi.pbix` en tu carpeta **Documentos**.

> **Si la tarjeta muestra "Count of Cantidad" en vez de la suma:** la columna quedó como texto. Vuelve a crear la tabla, pero en el paso 4 elige **Edit** en lugar de **Load**; en Power Query selecciona la columna `Cantidad`, ve a **Transform > Data type > Whole number** y luego **Home > Close & Apply**.

**Resultado esperado:** tienes un mini dashboard local con una gráfica y una tarjeta.

**Evidencia:** captura del reporte con la gráfica y la card. Este archivo puede llamarse `primer-reporte-power-bi.pbix`.

---

## 🧩 Microlección 2 — Conectar y modelar: cómo se relacionan las tablas

**¿Qué vas a aprender?** Cómo conectar Power BI a Dataverse, qué hace una relación entre tablas y hacia dónde viaja el filtro.

**¿Por qué existe esto?** Un reporte con varias tablas solo funciona si Power BI sabe cómo se relacionan. Si la relación o la dirección del filtro están mal, los visuales muestran números que no corresponden o no responden a los slicers.

**Ejemplo pequeño:** muchas solicitudes pertenecen a un mismo contacto. La relación es de muchos a uno (Solicitudes TI hacia Contacts) y, con dirección Single, el filtro viaja del lado "uno" (Contacts) al lado "muchos" (Solicitudes TI): elegir un contacto filtra sus solicitudes.

**Ahora haz algo — micropráctica (6 min):** **[Elegir la cardinalidad y el sentido del filtro](/practica/ip-dv-009-cardinalidad-y-sentido-del-filtro)**. Te da dos tablas y te pide decidir cómo relacionarlas y hacia dónde debe viajar el filtro.

**Práctica real en tu entorno (35 min):** haz los Pasos 1 a 4 de abajo.

##### Práctica 6.1: Conectar a Dataverse y Modelar

**Paso 1: Descargar e instalar Power BI Desktop**

1. Power BI Desktop solo funciona en **Windows** (Windows 10 o posterior, o Windows Server 2016 o posterior, de 64 bits). Si usas Mac, Microsoft indica que puedes usarlo dentro de un escritorio virtual de Windows, como **Azure Virtual Desktop** o **Windows 365**, si tu empresa lo ofrece.
2. **Opción recomendada: Microsoft Store.** Abre la app **Microsoft Store** de Windows, busca `Power BI Desktop` y selecciona el botón de instalar (o abre directamente [aka.ms/pbidesktopstore](https://aka.ms/pbidesktopstore)). Se actualiza solo cada mes y **no necesita permisos de administrador** en tu computadora.
3. **Opción B: Download Center.** Si la Store está bloqueada en tu computadora, entra a la [página de descarga](https://www.microsoft.com/download/details.aspx?id=58494), selecciona **Download**, elige el archivo de 64 bits y ejecútalo. Esta opción **sí necesita permisos de administrador**: si Windows te los pide y no los tienes, pide a tu área de TI que lo instale (o que habiliten la Store). Las dos opciones están en [Learn: Obtener Power BI Desktop](https://learn.microsoft.com/power-bi/fundamentals/desktop-get-the-desktop).
4. Ábrelo e inicia sesión con tu cuenta del trabajo (la misma que usas en Power Apps).
5. **Idioma de los menús:** Power BI Desktop se abre en el idioma de Windows. Este curso usa los nombres en inglés (**Home**, **Get data**, **Transform data**...). Si tus menús salen en español y te cuesta seguir la guía, cámbialo a inglés: **File > Options and settings > Options** (en español: **Archivo > Opciones y configuración > Opciones**), sección **Global** > **Regional settings**, lista **Application language** > **English** y **OK**; luego cierra y vuelve a abrir Power BI Desktop ([Learn](https://learn.microsoft.com/power-bi/fundamentals/supported-languages-countries-regions)).

**Paso 2: Conectar a Dataverse**

> **Empieza un archivo nuevo**, no sigas en `primer-reporte-power-bi.pbix`: abre Power BI Desktop y crea otro reporte en blanco. Ese primer archivo ya tiene una tabla `Table` con una columna `Estado`, y Power BI puede crear relaciones solas al cargar tablas; mezclarla con tus solicitudes reales confundiría los números. Lo guardarás al final del Paso 3.

1. Consigue la dirección de tu entorno:
    1. Abre Power Apps y entra a tu entorno de práctica.
    2. Selecciona el ícono de engrane (**Settings**) > **Session details**.
    3. Copia el valor **Instance url**, por ejemplo `https://tuorg.crm.dynamics.com/`.
    4. Bórrale el `https://` del inicio y la `/` del final. Te queda algo como `tuorg.crm.dynamics.com`.
2. En Power BI Desktop, pestaña **Home**, abre **Get data** y elige **Dataverse**. Si no aparece en la lista corta, usa **Get data from other sources**, busca *Dataverse* y selecciona **Connect**.
3. Si es la primera vez, selecciona **Sign in**, entra con tu cuenta organizacional y luego **Connect**.
4. Si Power BI te pide el **Environment domain**, pega la dirección del punto 1 (sin `https://`). Si lo dejas vacío, el Navigator te mostrará la lista de tus entornos para que abras el tuyo. Si te pregunta el modo de conexión, elige **Import**.
5. En la ventana **Navigator**, expande tu entorno y marca las casillas de estas tablas:
    - La tabla **Solicitud TI** del Módulo 2. En esta lista suele aparecer con su nombre interno (con el prefijo `sit_`, por ejemplo `sit_solicitudti`). Si no estás seguro, confirma el nombre de la tabla en Power Apps.
    - **contact** (la tabla estándar de contactos).
    - *(Opcional)* La tabla **Categoría Detallada**, si la creaste en el Módulo 2.
6. Selecciona **Transform Data** (no **Load**): así se abre Power Query para limpiar antes de cargar.

> **Si la conexión falla:** el conector usa el **TDS endpoint** de Dataverse (la "puerta" por la que Power BI lee los datos). Viene activado por defecto, pero alguien pudo desactivarlo. Si eres administradora de tu entorno de desarrollo (rol System Administrator), revísalo tú: en el **Power Platform admin center**, **Manage** > **Environments** > elige tu entorno > **Settings** > despliega **Product** > **Features** > **TDS endpoint** > activa **Enable TDS endpoint** y guarda ([Learn](https://learn.microsoft.com/power-platform/admin/settings-features)). Si no eres administradora, pídeselo a quien lo sea. Además, el conector tiene un tiempo máximo fijo de 5 minutos por consulta: si una tabla es muy grande y tarda demasiado, quita columnas o filtra filas en Power Query ([Learn](https://learn.microsoft.com/power-query/connectors/dataverse)).

**Paso 3: Transformaciones en Power Query**

> **Cómo funciona Power Query:** a la izquierda está el panel **Queries** (una consulta por tabla); a la derecha, **Query Settings** con la lista **Applied Steps**. Cada botón que usas agrega un paso a esa lista, y Power Query lo escribe en lenguaje **M** por ti. Cada vez que actualices los datos, Power Query repite esos pasos en orden. En este módulo solo vas a escribir **una** fórmula M; el resto lo haces con botones.

1. **Renombra la consulta de solicitudes:** en el panel **Queries**, haz doble clic en `sit_solicitudti` (o el nombre que tenga) y escribe `Solicitudes TI`. Haz lo mismo con `contact` y llámala `Contacts`.
2. **Quédate solo con las columnas que necesitas** (en `Solicitudes TI`):
    1. Ve a **Home > Choose columns**.
    2. Desmarca todo y marca solo estas columnas (Dataverse trae muchas columnas del sistema que no necesitas). La lista es larga: si la ventana tiene un cuadro de búsqueda arriba, escribe `sit_` para ver solo las tuyas; si no, recórrela despacio.
        - La columna principal **Título de Solicitud**: busca el nombre interno que anotaste en el Módulo 2 (Práctica 2.1, Paso 1, punto 7). En esta guía se usa como **ejemplo** `sit_titulodesolicitud`; si el tuyo es otro, marca el tuyo.
        - `sit_descripcion` (Descripción)
        - `sit_estadoname`, `sit_prioridadname`, `sit_categorianame`: para cada columna de tipo Choice, Dataverse entrega dos columnas: una con el número interno (`sit_estado`) y otra con la etiqueta que lees (`sit_estadoname`). Usa la que termina en `name`.
        - `sit_fechasolicitud`, `sit_fecharesolucion`, `sit_slahoras`
        - `sit_solicitante`: es el identificador (GUID) del contacto que pidió la solicitud. Lo necesitas para la relación con Contacts.
    3. Selecciona **OK**.
    > Los nombres exactos dependen de cómo creaste las columnas en el Módulo 2. Busca el prefijo `sit_` y el nombre de la columna. **La columna principal** (Título de Solicitud) es la que más varía: su nombre interno lo generó Dataverse al guardar la tabla y no tiene por qué ser `sit_titulodesolicitud`. Si no lo anotaste en el Módulo 2, en Power Apps abre **Tables** > Solicitud TI > zona **Columns**, selecciona la columna **Título de Solicitud** y, en su panel, despliega **Advanced options** y mira **Schema name**. Power BI lo muestra en minúsculas ([Learn: columnas](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-field-portal), [Learn: SchemaName y LogicalName](https://learn.microsoft.com/power-apps/developer/data-platform/entity-attribute-metadata)).
3. **Renombra las columnas** con nombres legibles: haz doble clic en cada encabezado (o clic derecho > **Rename**) y escribe el nombre nuevo:

    | Columna original | Nombre nuevo |
    |---|---|
    | `sit_titulodesolicitud` (ejemplo: usa tu nombre interno anotado) | Título de Solicitud |
    | `sit_descripcion` | Descripción |
    | `sit_estadoname` | Estado |
    | `sit_prioridadname` | Prioridad |
    | `sit_categorianame` | Categoría |
    | `sit_fechasolicitud` | Fecha Solicitud |
    | `sit_fecharesolucion` | Fecha Resolución |
    | `sit_slahoras` | SLA Horas |
    | `sit_solicitante` | Solicitante ID |

4. **Cambia las fechas a tipo Fecha:** selecciona la columna `Fecha Solicitud`, ve a **Transform > Data type > Date**. Repite con `Fecha Resolución`. Al pasar de Date/Time a Date, Power Query descarta la hora y deja solo el día, que es lo que necesitas para contar días.
    > **Ojo con la hora UTC:** Dataverse guarda las fechas en UTC (hora universal) y el conector las entrega así ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/behavior-format-date-time-field), [Learn](https://learn.microsoft.com/power-apps/developer/data-platform/dataverse-sql-query)). Si en tu país la hora va detrás de UTC (por ejemplo, Colombia o México), una solicitud creada de noche puede quedar en UTC con el día siguiente: al quitar la hora, verás un día más que en Power Apps. Para este curso no pasa nada; si una fecha no te cuadra por un día, esa es la causa.
5. **Crea la columna `Días Abierta`** (cuántos días han pasado desde que se pidió la solicitud):
    1. Ve a **Add column > Custom column**.
    2. En **New column name** escribe `Días Abierta`.
    3. En **Custom column formula** escribe esta fórmula M (si el cuadro ya muestra un `=` al inicio, escribe después de él):
       ```m
       Duration.Days(DateTime.Date(DateTime.LocalNow()) - [Fecha Solicitud])
       ```
    4. Selecciona **OK**. Aparece un paso nuevo en **Applied Steps**.
    5. Con la columna nueva seleccionada, ve a **Transform > Data type > Whole number** (en Power BI Desktop la ventana de columna personalizada no permite elegir el tipo: esa opción solo existe en Power Query Online; [Learn](https://learn.microsoft.com/power-query/add-custom-column)).

    **Qué hace cada parte de la fórmula, de adentro hacia afuera:**
    - `DateTime.LocalNow()`: la fecha y hora de este momento. En Power BI Desktop toma la hora de tu computadora; en Power BI Service, la hora UTC.
    - `DateTime.Date( ... )`: se queda solo con la fecha de hoy y quita la hora, para restar fecha contra fecha.
    - `[Fecha Solicitud]`: los corchetes significan "el valor de esta columna en la fila actual". La fórmula se calcula fila por fila, como arrastrar una fórmula en Excel.
    - `hoy - [Fecha Solicitud]`: restar dos fechas da una *duración* (por ejemplo, "7 días").
    - `Duration.Days( ... )`: convierte esa duración en un número entero de días (7).

    > **Ojo:** `Días Abierta` se calcula en el momento del refresh, no en tiempo real. Además, solo tiene sentido para solicitudes que siguen abiertas: para una resuelta, mide los días desde que se pidió hasta hoy, no cuánto tardó en resolverse. Por eso el tiempo de resolución se calcula aparte, con `Fecha Resolución`, en la Práctica 6.2.

6. **Tabla Contacts:** selecciona la consulta `Contacts`, ve a **Home > Choose columns** y deja solo `contactid` (identificador), `fullname` (nombre completo), `emailaddress1` (email) y `department` (departamento). Renómbralas como `Contacto ID`, `Nombre Completo`, `Email` y `Departamento`.
7. **Carga los datos:** ve a **Home > Close & Apply**. Power Query se cierra y las tablas aparecen en el panel **Data**.
8. **Guarda ya:** **File > Save** como `reporte-solicitudes-ti.pbix` en tu carpeta **Documentos**. Vuelve a guardar al terminar cada paso y cada práctica (6.2 y 6.3). Este es el archivo que usarás en todo el resto del módulo.

**Paso 4: Configurar relaciones**

1. En la barra izquierda de Power BI Desktop, selecciona el ícono de **Model view** (la tercera vista, después de **Report** y **Table**).
2. Busca una línea entre `Solicitudes TI` y `Contacts`. Power BI puede crear algunas relaciones automáticamente al cargar, pero no siempre lo hace.
3. Si **no** hay línea, créala: arrastra la columna `Solicitante ID` de `Solicitudes TI` y suéltala sobre `Contacto ID` en `Contacts`. (También puedes ir a **Modeling > Manage relationships > New**.)
4. Haz doble clic en la línea para abrir la ventana de la relación y revisa:
    - Las columnas: `Solicitudes TI[Solicitante ID]` y `Contacts[Contacto ID]`.
    - **Cardinality**: **Many to one (\*:1)**: muchas solicitudes, un contacto. Una de las dos columnas debe tener valores únicos; aquí es `Contacto ID`.
    - **Cross filter direction**: **Single** (el filtro viaja desde Contacts, el lado "uno", hacia Solicitudes TI, el lado "muchos").
    - Selecciona **OK**.
5. *(Opcional)* Si cargaste `Categoría Detallada`, repite la revisión para su relación con `Solicitudes TI`, también de muchos a uno.
6. Comprueba que funciona: vuelve a **Report view**, crea un **Slicer** con `Contacts[Nombre Completo]` y una tarjeta con la cantidad de solicitudes. Todavía no tienes medidas, así que la cantidad se saca contando una columna de texto:
    1. Agrega un visual **Card** y arrastra `Título de Solicitud` (de `Solicitudes TI`) a su área **Values**. Como es texto, Power BI lo cuenta y la tarjeta muestra algo como "Count of Título de Solicitud".
    2. Si en vez de un número ves un texto (por ejemplo "First..."), abre la flecha junto al campo en el área **Values** (o haz clic derecho en él) y elige **Count** ([Learn](https://learn.microsoft.com/power-bi/create-reports/service-aggregates)).
    3. Al elegir un contacto en el slicer, la tarjeta debe cambiar. En la Práctica 6.2 reemplazarás este conteo por la medida `Total Solicitudes`.
7. Guarda (**File > Save**).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Las tablas que cargaste desde Dataverse y cuántas columnas dejaste en Solicitudes TI | ___ |
| La relación que ves en Model view: tablas, cardinalidad y dirección del filtro | ___ |
| Qué pasa en un visual al elegir un contacto en un slicer (¿filtra sus solicitudes?) | ___ |

---

## 🧩 Microlección 3 — Visualizaciones y medidas

**¿Qué vas a aprender?** Cómo construir las páginas del reporte (tarjetas, gráficos, slicers) y cómo una medida DAX calcula una cifra que responde a los filtros.

**¿Por qué existe esto?** Los visuales muestran los datos y las medidas calculan las cifras. Una medida se recalcula según el filtro activo; una columna calculada, no. Por eso los totales y porcentajes van en medidas.

**Ejemplo pequeño:** la medida `% Resueltas` divide las solicitudes resueltas entre el total, y cambia sola cuando eliges una categoría en un slicer.

**Práctica real en tu entorno (50 min):** haz las Prácticas 6.2 y 6.3 de abajo, en ese orden: primero creas las medidas y luego las usas en los visuales.

##### Práctica 6.2: DAX Measures Básicas

**Cómo crear una medida (repite esto para cada una):**

1. En **Report view**, en el panel **Data**, haz clic derecho en la tabla `Solicitudes TI` y elige **New measure**. (También puedes usar **Home > New measure**.) Arriba del lienzo aparece la barra de fórmulas con el texto `Measure =`.
2. Borra ese texto y escribe la fórmula completa, incluido el nombre antes del `=`. Para pasar a otra línea dentro de la fórmula usa **Alt + Enter**.
3. Presiona **Enter** o selecciona **Commit** (el ícono de palomita de la barra de fórmulas) para guardarla ([Learn](https://learn.microsoft.com/power-bi/transform-model/desktop-tutorial-create-measures)). La medida aparece en `Solicitudes TI` con un ícono de calculadora.

**Reglas de escritura que verás en todas las medidas:**
- `'Solicitudes TI'`: el nombre de una tabla va entre comillas simples cuando tiene espacios.
- `'Solicitudes TI'[Estado]`: una columna se escribe con el nombre de su tabla y la columna entre corchetes.
- `&&` significa "y además"; `IN {"A", "B"}` significa "es A o es B".

> Las medidas usan columnas que preparaste en la Práctica 6.1 (`Estado`, `Fecha Solicitud`, `Fecha Resolución`, `SLA Horas`, `Días Abierta`). `SLA Horas` viene de tu tabla del Módulo 2 (Práctica 2.1). Si te falta alguna columna, salta la medida que la usa y practica con las demás.
>
> **Decisión de negocio:** en este curso, una solicitud **Cerrada** ya pasó por Resuelta, así que cuenta como resuelta. Si en tu proceso "Cerrada" significa "cancelada", quita `"Cerrada"` de las listas `IN`.

**Antes de escribir medidas, revisa tus datos (5 min):**
1. **Tus etiquetas exactas de Estado.** Las medidas comparan texto letra por letra: `"En Proceso"` no es igual a `"En proceso"`. En **Report view**, agrega un visual **Table** con solo la columna `Estado`: verás cada valor una vez. Si alguno se escribe distinto de Nueva, En Proceso, Resuelta y Cerrada, usa tu forma exacta en las fórmulas de abajo. Después borra ese visual.
2. **Datos variados.** Para que las cifras digan algo, en tu tabla de Power Apps debe haber solicitudes en cada estado y varias **resueltas o cerradas con la Fecha Resolución llena**. Si no las tienes, agrégalas o edítalas en Power Apps y vuelve aquí con **Home > Refresh** (actualizar). Sin filas resueltas con fecha, `Promedio Días Resolución` sale vacío.

1. **Total Solicitudes**
```dax
Total Solicitudes = COUNTROWS('Solicitudes TI')
```
- `COUNTROWS(tabla)` cuenta cuántas filas tiene la tabla **después** de aplicar los filtros activos. Sin filtros, cuenta todas las solicitudes; con un slicer de Categoría, solo las de esa categoría.

2. **Solicitudes Abiertas**
```dax
Solicitudes Abiertas =
COUNTROWS(
    FILTER(
        'Solicitudes TI',
        'Solicitudes TI'[Estado] IN {"Nueva", "En Proceso"}
    )
)
```
- `FILTER('Solicitudes TI', ...)`: recorre la tabla fila por fila y se queda solo con las filas que cumplen la condición.
- `'Solicitudes TI'[Estado] IN {"Nueva", "En Proceso"}`: la condición; el estado debe ser Nueva o En Proceso. (Ojo: "distinto de Cerrada" contaría también las Resueltas como abiertas.)
- `COUNTROWS(...)`: cuenta las filas que quedaron.

3. **% Solicitudes Resueltas**
```dax
% Resueltas =
DIVIDE(
    COUNTROWS(
        FILTER('Solicitudes TI', 'Solicitudes TI'[Estado] IN {"Resuelta", "Cerrada"})
    ),
    COUNTROWS('Solicitudes TI'),
    0
)
```
- Primer argumento (numerador): cuántas solicitudes están en Resuelta o Cerrada.
- Segundo argumento (denominador): el total de solicitudes.
- Tercer argumento `0`: lo que devuelve si el denominador es cero o está vacío (por ejemplo, un filtro que no deja ninguna solicitud). `DIVIDE` evita el error de dividir entre cero; sin este tercer valor, devolvería vacío (BLANK).
- Después de crearla, con la medida seleccionada, ponle formato de porcentaje en la cinta **Measure tools** (la opción de formato `%`).

4. **Promedio Días Resolución** (cuánto se tarda, en promedio, en resolver una solicitud)
```dax
Promedio Días Resolución =
AVERAGEX(
    FILTER(
        'Solicitudes TI',
        'Solicitudes TI'[Estado] IN {"Resuelta", "Cerrada"}
            && NOT ISBLANK('Solicitudes TI'[Fecha Solicitud])
            && NOT ISBLANK('Solicitudes TI'[Fecha Resolución])
    ),
    DATEDIFF(
        'Solicitudes TI'[Fecha Solicitud],
        'Solicitudes TI'[Fecha Resolución],
        DAY
    )
)
```
- `FILTER(...)`: se queda solo con las solicitudes **resueltas** (Resuelta o Cerrada) que tienen las dos fechas llenas. `ISBLANK` pregunta "¿está vacío?" y `NOT` lo invierte ("no está vacío").
- `DATEDIFF(fecha inicial, fecha final, DAY)`: cuenta los días entre la fecha de solicitud y la de resolución de **cada** fila. Si se resolvió el mismo día, da 0.
- `AVERAGEX(tabla, expresión)`: calcula esa expresión fila por fila en la tabla filtrada y luego saca el promedio. Si no hay ninguna solicitud resuelta, devuelve vacío (BLANK).
- **Por qué no `AVERAGE('Solicitudes TI'[Días Abierta])`:** `Días Abierta` mide los días desde la solicitud hasta **hoy** e incluye solicitudes sin resolver. Ese promedio crece cada día aunque nadie trabaje, así que no mide el tiempo de resolución.

5. **Solicitudes Vencidas SLA** (abiertas que ya superaron su tiempo comprometido)
```dax
Vencidas SLA =
COUNTROWS(
    FILTER(
        'Solicitudes TI',
        'Solicitudes TI'[Estado] IN {"Nueva", "En Proceso"}
            && NOT ISBLANK('Solicitudes TI'[SLA Horas])
            && 'Solicitudes TI'[Días Abierta] > 'Solicitudes TI'[SLA Horas] / 24
    )
)
```
- Solo cuenta solicitudes **abiertas** (Nueva o En Proceso): una resuelta ya no puede "vencerse".
- `NOT ISBLANK(... [SLA Horas])`: descarta las solicitudes sin SLA. En una comparación DAX, un valor vacío se trata como 0, y entonces casi cualquier solicitud parecería vencida.
- `[SLA Horas] / 24`: convierte las horas del SLA a días, para comparar en la misma unidad que `Días Abierta`.
- Recuerda que `Días Abierta` se calculó en el último refresh: la cifra es "a la fecha del último refresh".

6. **Solicitudes Este Mes** (las pedidas en el mes calendario actual)
```dax
Solicitudes Este Mes =
COUNTROWS(
    FILTER(
        'Solicitudes TI',
        YEAR('Solicitudes TI'[Fecha Solicitud]) = YEAR(TODAY())
            && MONTH('Solicitudes TI'[Fecha Solicitud]) = MONTH(TODAY())
    )
)
```
- `TODAY()`: la fecha de hoy.
- `YEAR(...)` y `MONTH(...)`: sacan el año y el número de mes (1 a 12) de una fecha.
- La condición pide mismo año **y** mismo mes que hoy; comparar solo el mes mezclaría noviembre de este año con noviembre del año pasado.

> **Nota:** Ya usaste `AVERAGEX` con `FILTER` en su forma más simple. La inteligencia de tiempo (tablas de calendario, `DATESMTD`, comparaciones mes contra mes con `DATEADD`) es DAX avanzado: la verás en detalle en el **Módulo 12 (Nivel 2)** con el contexto correcto.

**Comprueba tus medidas:** crea una tarjeta (**Card**) por medida y anota los valores. `% Resueltas` debe quedar entre 0% y 100%, y `Solicitudes Abiertas` más las resueltas debe dar `Total Solicitudes`, si todas las filas tienen estado.

##### Práctica 6.3: Crear Visualizaciones Básicas

**Cómo agregar cualquier visual:** en **Report view**, haz clic en un espacio vacío del lienzo, elige el ícono del visual en el panel **Visualizations** y arrastra campos o medidas desde el panel **Data** a las áreas (wells) que se indican. Para cambiar colores, títulos y formato, usa la sección de formato del panel **Visualizations** con el visual seleccionado.

**Página 1: Overview General** (haz doble clic en la pestaña de página de abajo para llamarla así)

1. **KPI Cards**: crea tres visuales **Card** y pon en cada uno una medida:
    - `Total Solicitudes`
    - `Solicitudes Abiertas`
    - `Promedio Días Resolución`
    > En la tarjeta, si ves "2K" en vez de "2,000", cambia las unidades de visualización: con la tarjeta seleccionada, **Format visual** > pestaña **Visual** > **Callout values** > **Values** > **Display units** = **None** (con **Auto**, Power BI abrevia en K, M o B) ([Learn](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-card)).

2. **Chart: Solicitudes por Estado**
    - Visual: **Donut chart**
    - **Legend**: `Estado`
    - **Values**: `Total Solicitudes`
    - Opcional: en el formato del visual, cambia el color de cada estado (por ejemplo, verde para Resuelta y rojo para Nueva).

3. **Chart: Solicitudes por Categoría**
    - Visual: gráfico de barras horizontales.
    - **Y-axis**: `Categoría` (en barras horizontales, las categorías van en el eje vertical).
    - **X-axis**: `Total Solicitudes`.
    - Ordena de mayor a menor: selecciona **More options (...)** en la esquina del visual > **Sort axis** > `Total Solicitudes` y luego **Sort descending**.

4. **Trend: Solicitudes por Mes**
    - Visual: **Line chart**
    - **X-axis**: `Fecha Solicitud`. Como es de tipo Date, Power BI crea sola una jerarquía de fechas (**Year**, **Quarter**, **Month**, **Day**).
    - **Y-axis**: `Total Solicitudes`.
    - Para bajar de nivel (año > trimestre > mes > día), usa los íconos de flecha de drill-down que aparecen sobre el visual.
    - Si ves fechas sueltas sin jerarquía, la columna no quedó de tipo Date (revisa el paso 4 de Power Query).

5. **Tabla: Top Solicitantes**
    - Visual: **Table**
    - **Columns**: `Contacts[Nombre Completo]` y la medida `Total Solicitudes`.
    - Haz clic en el encabezado `Total Solicitudes` para ordenar de mayor a menor (un segundo clic invierte el orden). Así los solicitantes con más solicitudes quedan arriba.

**Página 2: Análisis por Prioridad** (agrega una página con el botón **+** junto a las pestañas)

1. **Slicer: Filtro de Fecha**
    - Visual: **Slicer**
    - Campo: `Fecha Solicitud`
    - Estilo de rango: en el formato del visual, ve a **Visual > Slicer settings > Options > Style** y elige **Between**. Verás una barra para elegir desde qué fecha hasta qué fecha.

2. **Matrix: Prioridad vs Categoría**
    - Visual: **Matrix**
    - **Rows**: `Prioridad`
    - **Columns**: `Categoría`
    - **Values**: `Total Solicitudes`
    - Barras dentro de las celdas: en el área **Values**, abre la flecha de `Total Solicitudes` (o clic derecho) > **Conditional formatting** > **Data bars** > **OK**.

3. **Chart: Días abierta (pendientes) por Prioridad**
    - Visual: **Clustered column chart** (columnas verticales).
    - **X-axis**: `Prioridad`.
    - **Y-axis**: `Días Abierta`. Abre la flecha del campo en el área y cambia la agregación de **Sum** a **Average**: así ves el promedio, no la suma.
    - Filtra solo las pendientes: con el visual seleccionado, en el panel **Filters**, en **Filters on this visual**, abre `Estado` y marca solo **Nueva** y **En Proceso** (Basic filtering). Si `Estado` no aparece, arrástralo a **Add data fields here**.
    - Esto responde "¿cuánto tiempo llevan esperando las solicitudes que siguen abiertas, según su prioridad?". Aquí sí es correcto usar `Días Abierta`, porque solo miras solicitudes abiertas.

**Ahora diagnostica — micropráctica (5 min):** **[Diagnosticar: el gráfico por mes no agrupa las fechas](/practica/ip-trb-005-fechas-como-texto)**. Parte de un síntoma exacto —fechas sueltas en el eje, sin jerarquía— y te pide la causa y dónde se corrige, antes de ver la solución.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Cuántas páginas y cuántos visuales tiene tu reporte | ___ |
| Una medida DAX que escribiste y el valor que devuelve | ___ |
| Qué cambia en esa cifra cuando eliges un valor en un slicer | ___ |

---

## 🔁 Reto de transferencia — Un reporte de ventas, sin pasos

Esta vez no te digo los pasos: aplica lo que viste a un negocio distinto.

> **Requerimiento:** una tienda quiere ver cuánto vende por producto y por mes. Con **Enter data** crea dos tablas: Ventas (Fecha, Producto, Importe) con al menos 8 filas, y Productos (Producto, Categoría) con esos mismos productos. Arma un reporte con una tarjeta del total vendido, un gráfico del importe por producto y un gráfico del importe por mes.
> **Criterios de aceptación:** (1) las dos tablas están relacionadas por Producto, de muchos a uno y con filtro Single; (2) el total sale de una medida DAX, no de una columna calculada; (3) la columna Fecha es de tipo fecha y el gráfico por mes agrupa por mes.
> **Restricciones:** no copies el modelo de Solicitudes. Todo es local en Power BI Desktop, sin Dataverse ni Power BI Service.
> **Pistas si te atoras:** crea la segunda tabla igual que en la Práctica 6.0 (Enter data); relaciona las dos arrastrando la columna Producto de una a la otra en Model view, como en el Paso 4 de la 6.1; la medida del total puede ser `Total Vendido = SUM(Ventas[Importe])`; y el tipo de dato de la columna Fecha se cambia en Power Query (Transform > Data type), como en la micropráctica de diagnóstico.

**Ahora haz algo — transferencia guiada (8 min):** **[Transferir: del reporte de solicitudes al de ventas](/practica/ip-dv-010-transferir-modelo-de-ventas)**. Retoma el modelo de este módulo con otro negocio y te pide decidir qué estructura usar y qué evitar.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| La relación que creaste: tablas, cardinalidad y dirección del filtro | ___ |
| La medida DAX del total vendido (la fórmula exacta) y el valor que devolvió | ___ |
| El tipo de dato de la columna Fecha y cómo se ve el eje del gráfico por mes | ___ |

#### 🔧 Profundización opcional

> Si ya lograste abrir el `.pbix`, ver datos y crear visuales básicos, continúa con publicación e interactividad. Si no tienes workspace o licencia suficiente, guarda el reporte local como evidencia y vuelve a esta sección cuando el tenant lo permita.

##### Práctica 6.4: Interactividad y Drill-Through

1. **Configurar Cross-Filtering**
    1. En la Página 1, selecciona el **Donut chart** (Estado).
    2. En la cinta, ve a **Format > Edit interactions**. Sobre cada uno de los otros visuales aparecen íconos pequeños.
    3. En cada visual, elige **Filter** (muestra solo lo seleccionado), **Highlight** (resalta lo seleccionado y deja el resto atenuado) o **None** (no reacciona).
    4. Prueba **Highlight** en el gráfico de barras por Categoría. El **Line chart** no admite Highlight, solo Filter o None.
    5. Vuelve a seleccionar **Edit interactions** para salir del modo de edición y haz clic en una parte del anillo para probar.

2. **Crear Drill-Through Page**
    1. Agrega una página con **+** y renómbrala `Detalle Solicitud` (doble clic en la pestaña).
    2. Con la página abierta y sin visual seleccionado, en el panel **Visualizations** busca la sección **Drill through** y arrastra `Título de Solicitud` al área **Add drillthrough fields here**.
    3. Agrega en esa página un visual **Table** con `Título de Solicitud`, `Categoría`, `Prioridad`, `Estado` y `Descripción`.
    4. Power BI agrega solo un botón para volver (**Back**) en la esquina de la página.
    5. Pruébalo: en la Página 2, agrega un visual **Table** con `Título de Solicitud` y `Estado`. Haz clic derecho sobre una solicitud > **Drill through** > **Detalle Solicitud**. (El drill-through solo se ofrece en visuales que usan el campo `Título de Solicitud`.)

3. **Tooltips Personalizados**
    1. Agrega una página y llámala `Tooltip Solicitante`.
    2. Sin visual seleccionado, en el formato de la página, en **Canvas settings**, elige el tipo **Tooltip** (página pequeña), y en **Page information** activa **Tooltip**.
    3. Agrega una **Card** con `Email` y otra con `Departamento` de `Contacts`.
    4. Arrastra `Nombre Completo` al área **Tooltip fields** de esa página.
    5. En la Página 1, selecciona la tabla Top Solicitantes y, en su formato, ve a **Tooltips** y en **Page** elige `Tooltip Solicitante`.
    6. Pasa el mouse sobre un solicitante: debe aparecer la mini página con su email y departamento.

##### Práctica 6.5: Publicar y Compartir

**Paso 1: Publicar a Power BI Service**

1. Guarda el `.pbix`.
2. Ve a **Home > Publish** (o **File > Publish > Publish to Power BI**).
3. Elige el workspace (por ejemplo, `Reportes TI`) y selecciona **Select**. Si no tienes un workspace propio, pídelo a tu administrador o usa uno de práctica.
4. Espera el mensaje de éxito. En el workspace aparecen dos elementos: el **reporte** y el **semantic model** (los datos y medidas; antes se llamaba "dataset").

**Paso 2: Configurar actualización de datos**

1. En Power BI Service, abre el workspace.
2. Junto al **semantic model**, abre sus opciones y ve a **Refresh > Schedule refresh**.
3. En **Data source credentials**, actualiza las credenciales de Dataverse e inicia sesión con tu cuenta organizacional (OAuth).
4. En **Configure a refresh schedule**, activa la opción (**On**), elige frecuencia diaria y agrega la hora `8:00 AM`. Guarda con **Apply**.
5. Ten en cuenta: con licencia Pro puedes programar hasta 8 actualizaciones al día; si nadie abre el reporte en dos meses, la actualización programada se pausa; y si falla varias veces seguidas, se desactiva.

**Paso 3: Crear Dashboard**

1. En el Service, abre el reporte publicado y selecciona **Edit**.
2. Pasa el mouse sobre un visual clave (por ejemplo, la tarjeta `Total Solicitudes`) y selecciona el ícono de **Pin** (chincheta).
3. Elige **New dashboard**, escribe `Gestión Solicitudes TI - Executive` y selecciona **Pin**.
4. Ancla 3 o 4 visuales más al mismo dashboard (**Existing dashboard**).
5. Selecciona **Go to dashboard**; ahí puedes mover y cambiar el tamaño de cada tile (mosaico).

**Paso 4: Compartir con usuarios**

1. Opción A: Compartir dashboard directamente
    - En el dashboard, selecciona **Share** y escribe los correos.
    - Decide si pueden volver a compartir (**reshare**). Para compartir necesitas licencia Pro o Premium Per User (o que el contenido esté en una capacidad Premium o Fabric).

2. Opción B: Crear App
    - En el workspace, selecciona **Create app**.
    - En **Setup**, ponle nombre y descripción; en **Content**, agrega el reporte y el dashboard; en **Audience**, elige quién la verá.
    - Selecciona **Publish app** y comparte el enlace que te da Power BI.
    - Solo puedes crear una app por workspace (con hasta 25 audiencias distintas dentro de ella). Las **org apps** de Fabric son otro tipo de elemento y pueden convivir con esa app del workspace ([Learn](https://learn.microsoft.com/power-bi/collaborate-share/service-create-distribute-apps)).

**Paso 5: Configurar Row-Level Security (RLS)**

1. En Power BI Desktop, ve a **Modeling > Manage roles**.
2. Selecciona **New** y llama al rol `Solicitante`.
3. En **Select tables**, elige `Contacts`; en **Filter data**, selecciona **Switch to DAX editor** y escribe:
   ```dax
   [Email] = USERPRINCIPALNAME()
   ```
   - `USERPRINCIPALNAME()` devuelve el nombre con el que la persona inicia sesión (por ejemplo, `ana@contoso.com`).
   - La regla deja visible solo el contacto cuyo email es igual a ese nombre, y por la relación (Contacts filtra a Solicitudes TI) solo sus solicitudes.
   - **Ojo:** el nombre de inicio de sesión (UPN) no siempre es igual al email. Confírmalo con tu administrador antes de usar esta regla.
4. Crea un segundo rol `Departamento Finanzas` en la tabla `Contacts` con un filtro fijo:
   ```dax
   [Departamento] = "Finanzas"
   ```
   Compara el departamento con un texto, no con `USERPRINCIPALNAME()`: el departamento nunca va a ser igual a un correo.
5. Selecciona **Save** y vuelve a publicar el reporte.
6. En el Service, en las opciones del **semantic model**, selecciona **Security**, elige cada rol y agrega a sus miembros. Con **Test as role** puedes comprobar qué vería cada rol.
7. Importante: RLS solo se aplica a quienes tienen rol **Viewer** en el workspace (o reciben el reporte compartido o por app). Los Admin, Member y Contributor del workspace ven todo.

### 💼 Caso Real de Negocio

**Escenario**: Dashboard Ejecutivo de Ventas para Gerencia

**Fuentes de datos**:

- Dynamics 365 Sales (Opportunities, Accounts)
- SQL Server (histórico transaccional)
- Excel (targets mensuales)

**KPIs principales**:

- Revenue actual vs target (con semáforo)
- Win rate por vendedor y producto
- Pipeline value por etapa
- Customer acquisition cost (CAC)
- Average deal size

**Visualizaciones clave**:

- Mapa de ventas por ubicación con el visual **Azure Maps** y su capa **Heat map** (mapa de calor) ([Learn](https://learn.microsoft.com/azure/azure-maps/power-bi-visual-add-heat-map-layer))
- Waterfall chart de evolución revenue mensual
- Funnel chart de pipeline por stage
- Scatter plot: deal size vs días en pipeline (identificar outliers)

**Interactividad**:

- Slicers: Año, Trimestre, Vendedor, Región
- Drill-down: Región > País > Ciudad > Cliente
- Tooltips: Detalle de oportunidad al hover
- Drill-through: Página de análisis por vendedor individual

**Actualización**:

- Incremental refresh (últimos 3 meses diarios, histórico mensual)
- Alerts en Service si revenue < 80% target

### ✅ Buenas Prácticas

**Modelado de datos**:

- Star schema: tabla de hechos (Solicitudes TI) y dimensiones (Contacts, Categoría Detallada)
- Relaciones claras y unidireccionales (Single) cuando sea posible
- Columnas calculadas para atributos de cada fila; measures para totales, promedios y porcentajes
- Tablas de fechas (Calendar table) para time intelligence (Módulo 12)

**Performance**:

- Limitar registros importados (quitar columnas y filtrar filas en Power Query)
- Usar Import mode para modelos pequeños o medianos; DirectQuery cuando los datos son muy grandes o deben verse casi en tiempo real
- Indexar columnas de filtro en origen de datos
- Evitar columnas calculadas complejas; preferir measures

**Diseño visual**:

- Máximo 6-8 visuales por página (evitar saturación)
- Paleta de colores corporativa consistente
- Títulos descriptivos y contextuales
- Mostrar solo datos accionables

**DAX**:

- Decidir a propósito qué mostrar cuando no hay datos: vacío (BLANK) o 0 (como el tercer argumento de `DIVIDE`)
- Variables (VAR) para legibilidad y performance
- Comentarios en measures complejas
- Probar con diferentes filtros/slicers
- Comprobar que cada medida mide lo que dice su nombre (por ejemplo, tiempo de resolución con Fecha Resolución, no con días abierta)

**Gobernanza**:

- Workspaces por departamento/proyecto
- Naming conventions: [Área]-[Tema]-[Versión]
- Documentación de sources y transformaciones
- RLS siempre que datos sean sensibles

### ⚠️ Errores Comunes

1. **Lo que ves:** las relaciones no funcionan y los visuales no se filtran entre sí.
    - **Causa**: Falta la relación, une columnas equivocadas, o la cardinalidad o la dirección del filtro no son las correctas
    - **Solución**: En Model view, haz doble clic en la línea y revisa columnas, Cardinality (Many to one) y Cross filter direction (Single)

2. **Lo que ves:** una medida devuelve valores incorrectos al aplicar filtros.
    - **Causa**: Contexto de filtro no manejado (no usar CALCULATE)
    - **Solución**: Usar CALCULATE con filtros explícitos o ALL/REMOVEFILTERS

3. **Lo que ves:** un visual tarda mucho en cargar o no muestra todos los datos.
    - **Causa**: El visual intenta dibujar demasiados puntos o filas
    - **Solución**: Agregar filtros, resumir por una categoría o mes, o cambiar el tipo de visual

4. **Lo que ves:** el refresh falla en el Service con un error de credenciales.
    - **Causa**: No se configuraron las credenciales de Dataverse (OAuth) en el Service, o vencieron
    - **Solución**: semantic model > **Refresh > Schedule refresh** > **Data source credentials** > actualizar credenciales e iniciar sesión

5. **Lo que ves:** las columnas de fecha no permiten agrupar por mes ni usar time intelligence.
    - **Causa**: Columna es text, no date type
    - **Solución**: Power Query > Transform > Data type > Date

6. **Lo que ves:** los usuarios no ven datos, o ven todo, después de aplicar RLS.
    - **Causa**: Rol mal configurado, usuario no asignado, el UPN no coincide con el email, o el usuario es Admin/Member/Contributor del workspace (a ellos no se les aplica RLS)
    - **Solución**: En el Service, semantic model > **Security** > revisar miembros y usar **Test as role**

7. **Lo que ves:** el "promedio de días de resolución" sube todos los días aunque nadie resuelva nada.
    - **Causa**: La medida promedia `Días Abierta` (días hasta hoy, incluidas las abiertas) en vez del tiempo entre Fecha Solicitud y Fecha Resolución
    - **Solución**: Usar la medida `Promedio Días Resolución` con `AVERAGEX` + `DATEDIFF` sobre solicitudes resueltas (Práctica 6.2)

### 🧪 Criterios de Validación

**Núcleo (con esto apruebas el módulo):**
- [ ] Conexión a Dataverse funcional desde Power BI Desktop (archivo `reporte-solicitudes-ti.pbix` guardado)
- [ ] Modelo de datos con 2+ tablas relacionadas (3 si cargaste Categoría Detallada)
- [ ] 4+ measures DAX creadas y funcionales
- [ ] Reporte con 2 páginas y mínimo 8 visualizaciones
- [ ] Los visuales responden a los slicers (filtros)
- [ ] Explicar diferencia entre Import y DirectQuery

**Opcional (profundización, cuando tengas Power BI Service y licencia):**
- [ ] Interactividad: cross-filtering editado y drill-through implementado
- [ ] Reporte publicado en Power BI Service y compartido
- [ ] Refresh programado configurado
- [ ] Row-Level Security configurado y probado
- [ ] Dashboard con tiles pinneados creado
- [ ] Calcular tamaño del semantic model y estimar el tiempo de refresh

> Como principiante, considera aprobado el módulo si cumples todo el núcleo. Publicación, refresh, dashboard y RLS pertenecen a la profundización cuando tengas Power BI Service disponible.

### 📸 Evidencia para guardar
- Captura de Power Query con tablas cargadas y columnas renombradas.
- Captura del modelo con relaciones visibles.
- Captura de las 2 páginas del reporte con slicers y KPIs.
- Si publicas: captura del workspace, configuración de refresh y roles RLS.
- El archivo `reporte-solicitudes-ti.pbix` guardado (y `primer-reporte-power-bi.pbix` de la Práctica 6.0).

### ➡️ Siguiente práctica recomendada

Guarda tu archivo `reporte-solicitudes-ti.pbix` como evidencia del Nivel Básico y como **guía de pasos** para el **Módulo 08 · Primer Proyecto Integrado**.

**Por qué:** el método que aprendiste aquí (conectar, limpiar, relacionar, medir y visualizar) es el mismo del proyecto final. Ojo: el proyecto del Módulo 08 usa tablas nuevas (prefijo `sse`) y otros estados, así que allí crearás un `.pbix` nuevo repitiendo estos pasos y adaptando las medidas; este archivo no se reutiliza tal cual. Si tienes poco tiempo, prioriza un dashboard local claro antes que publicación y seguridad avanzada. Si te sobra, el [Lab 06 · Power BI — Reporte de Solicitudes TI desde Dataverse](/labs/lab-06-power-bi-reporte-solicitudes) (opcional) te da otra vuelta de práctica con los datos del Lab 02.

---

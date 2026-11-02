---
id: lab-06
title: "Power BI — Reporte de Solicitudes TI desde Dataverse (opcional)"
level: "N1"
duration: 120
product: ["Power BI", "Dataverse"]
certifications: ["PL-900"]
role: ["Maker"]
prerequisites:
  - "Módulo 6 completado — Power BI Desktop instalado en Windows (Práctica 6.1, Paso 1)"
  - "Lab 02 completado — tablas Solicitud TI (sit_solicitud) y Categoría con los 10 registros de prueba"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 06 — Power BI: Reporte de Solicitudes TI desde Dataverse (opcional)

## Objetivo

Al finalizar este laboratorio podrás conectar Power BI Desktop a las tablas de Dataverse que creaste en el Lab 02, limpiarlas en Power Query, relacionarlas de muchos a uno, crear las medidas DAX del Módulo 6 y armar un reporte con tarjetas, gráficos y un slicer. Si tu licencia lo permite, también lo publicarás y le pondrás seguridad por filas (RLS).

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 02

**Problema a resolver:** El jefe de soporte ya tiene las solicitudes en Dataverse, pero cada lunes sigue contando a mano cuántas entraron este mes, qué porcentaje se resolvió y cuánto se tarda en resolverlas. Quiere un reporte que dé esas tres cifras solo, y que pueda filtrar por solicitante.

**Por qué Power BI:** se conecta directo a Dataverse, las medidas DAX se recalculan solas con cada filtro y el reporte se puede publicar para que otros lo consulten sin tocar los datos.

## Por qué este lab es opcional

- **Power BI Desktop solo funciona en Windows** (Windows 10 o Windows Server 2016 o posterior). En Mac solo está soportado dentro de un escritorio virtual de Windows: **Azure Virtual Desktop** o **Windows 365** ([Learn: Download Power BI Desktop](https://learn.microsoft.com/power-bi/fundamentals/desktop-get-the-desktop)). El resto del curso funciona en el navegador; este lab no. Si no tienes Windows, sigue la [Variante sin Windows](#variante-sin-windows-power-bi-en-el-navegador) de abajo.
- **Publicar y compartir depende de tu licencia**, no de tu habilidad. Power BI Desktop es gratis, pero en el servicio de Power BI:

  | Licencia | Qué puedes hacer |
  |---|---|
  | **Fabric (Free)** | Crear reportes para ti y guardarlos en tu **My workspace**. No puedes compartir ni publicar en workspaces de otras personas. |
  | **Power BI Pro** | Publicar en otros workspaces y compartir con otros usuarios Pro. |
  | **Premium Per User (PPU)** | Lo mismo que Pro, pero solo puedes compartir con usuarios que también tengan PPU. |
  | Workspace en una **capacidad** (Fabric F64 o mayor, o Power BI Premium) | Un usuario Pro o PPU puede compartir el contenido también con usuarios de licencia gratuita. |

  Fuente: [Learn: Power BI service features by license type](https://learn.microsoft.com/power-bi/fundamentals/service-features-license-type). Si no tienes licencia de pago, Learn indica que puedes empezar una **prueba de capacidad de Fabric**, que incluye una licencia parecida a PPU.

**Qué no pierdes si lo saltas:** el Módulo 6 se aprueba con su propia práctica (Prácticas 6.0 a 6.3). Este lab es la práctica guiada, clic a clic, sobre los datos reales del Lab 02.

## Lo que vas a construir

- Un archivo `lab06-reporte-solicitudes-ti.pbix` conectado a Dataverse con dos tablas: **Solicitudes TI** y **Contacts**
- Una relación **Many to one (\*:1)** con **Cross filter direction** = **Single** entre las dos
- Cuatro medidas DAX: `Total Solicitudes`, `Solicitudes Este Mes`, `% Resueltas` y `Promedio Días Resolución` (las mismas del Módulo 6)
- Una página con 4 tarjetas, un gráfico de barras por Estado, un gráfico de líneas por mes y un slicer por solicitante
- *(Si tu licencia lo permite)* el reporte publicado en tu workspace y un rol de RLS con `USERPRINCIPALNAME()`

## Relación con el Módulo 6

La teoría está en el [Módulo 6](/nivel/basico/modulo/power-bi-reportes-y-dashboards-basicos) y aquí no se repite: si un concepto no te suena, vuelve a su microlección.

| Si dudas de... | Repasa en el Módulo 6 |
|---|---|
| Qué visual elegir para cada pregunta | Microlección 1 y la micropráctica [Elegir el visual correcto](/practica/ip-dv-008-elegir-visual-correcto) |
| Cardinalidad y hacia dónde viaja el filtro | Microlección 2 y la micropráctica [Cardinalidad y sentido del filtro](/practica/ip-dv-009-cardinalidad-y-sentido-del-filtro) |
| Qué hace cada función de las medidas | Microlección 3, Práctica 6.2 |
| Por qué las fechas no agrupan por mes | Micropráctica [Fechas como texto](/practica/ip-trb-005-fechas-como-texto) |

**Diferencias con la Práctica 6.1, todas a propósito:**

1. **La tabla es la del Lab 02**, no la del Módulo 2. Por eso en el Navigator aparece como `sit_solicitud` (no `sit_solicitudti`).
2. **Categoría es una búsqueda (Lookup)** a la tabla Categoría, no una columna Choice. Para ver su nombre usarás la columna de nombre que el conector añade al Lookup.
3. **La columna principal (Título de Solicitud) tiene el nombre interno que anotaste en el Lab 02** (Tarea 2.2, paso 7). Aquí la renombrarás a `Título de Solicitud`.
4. **Después de renombrar**, las columnas se llaman igual que en el Módulo 6 (`Estado`, `Fecha Solicitud`, `Fecha Resolución`…). Por eso las medidas de este lab son una copia exacta de las del Módulo 6.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Preparar los datos en Dataverse | 20 min |
| Ejercicio 2 — Conectar Power BI Desktop a Dataverse | 15 min |
| Ejercicio 3 — Limpiar los datos en Power Query | 20 min |
| Ejercicio 4 — Relación muchos a uno | 10 min |
| Ejercicio 5 — Medidas DAX | 20 min |
| Ejercicio 6 — Visuales y slicer | 25 min |
| Ejercicio 7 — Guardar y publicar | 10 min |
| **Total** | **120 min** |
| Ejercicio 8 (opcional) — Seguridad por filas (RLS) | +20 min |

> Con Power BI Desktop ya instalado. Si es tu primera vez con Power BI, cuenta entre el doble y el triple, igual que en el Módulo 6. Los Ejercicios 7 y 8 pueden quedar para otra sesión.

## Nivel

**N1 Básico** — Certificación objetivo: **PL-900**

## Tecnologías utilizadas

- Power BI Desktop (Power Query, Model view, DAX, Report view)
- Microsoft Dataverse (las tablas del Lab 02)
- make.powerapps.com (para preparar los datos)
- Power BI service, app.powerbi.com (solo para publicar)

## Prerrequisitos

### Entorno

- [ ] Una computadora con **Windows 10 o posterior** y Power BI Desktop instalado (Módulo 6, Práctica 6.1, Paso 1). Si no la tienes, usa la [Variante sin Windows](#variante-sin-windows-power-bi-en-el-navegador)
- [ ] Lab 02 completado: tablas `Solicitud TI` (`sit_solicitud`) y `Categoría` (`sit_categoria`) con los 10 registros de prueba
- [ ] El nombre interno de la columna principal `Título de Solicitud` que anotaste en el Lab 02 (Tarea 2.2, paso 7)
- [ ] La misma cuenta de trabajo o estudio con la que entras a make.powerapps.com
- [ ] Opcional, para el Ejercicio 7: licencia Pro o PPU, o una prueba de Fabric. Sin ella puedes publicar solo en tu **My workspace**

### Conocimiento previo

- Módulo 6 leído y Prácticas 6.0 a 6.3 hechas, o al menos la 6.0
- Lab 02: qué es un Lookup y qué es una columna Choice

### Verificación rápida antes de empezar

1. En [make.powerapps.com](https://make.powerapps.com), con tu ambiente **Developer** seleccionado, abre **Tables** → `Solicitud TI` y comprueba que tiene 10 filas.
2. Abre Power BI Desktop y comprueba que, arriba a la derecha, aparece tu cuenta de trabajo. Si no, selecciona **Sign in**.
3. **Idioma de los menús:** este lab usa los nombres en inglés (**Home**, **Get data**, **Transform data**...). Si los tuyos salen en español, cámbialos como en el Módulo 6, Práctica 6.1, Paso 1, punto 5.

---

## Variante sin Windows (Power BI en el navegador)

**¿No tienes Windows?** Puedes hacer casi todo el lab en el servicio de Power BI, en el navegador: Learn documenta que ahí se crean modelos semánticos con **Get data**, relaciones, medidas DAX y roles de RLS ([Learn: Edit semantic models in the Power BI service](https://learn.microsoft.com/power-bi/transform-model/service-edit-data-models)).

**Qué SÍ valida esta variante:** conectar a Dataverse, limpiar con Power Query, relacionar, escribir las medidas y armar los visuales.

**Qué NO valida:** que sepas usar Power BI Desktop ni tener un archivo `.pbix`. Además, en el navegador no existe la ventana **View as** de Desktop para probar roles.

**Pasos:**

1. Entra a [app.powerbi.com](https://app.powerbi.com) con tu cuenta de trabajo (la misma de Power Apps). Learn indica que con licencia gratuita puedes conectarte a datos y crear reportes para tu propio uso: lo que crees queda en tu **My workspace**, para ti solo ([Learn: features by license type](https://learn.microsoft.com/power-bi/fundamentals/service-features-license-type)). Learn no detalla si la edición del modelo en el navegador (paso 7) funciona igual con licencia gratuita; si ahí no puedes pasar a **Editing mode**, mira el aviso **Si no te deja** de abajo.
2. En el panel de la izquierda selecciona **Create** y luego **Get data**. Se abre Power Query en el navegador.
3. Elige **Dataverse**. Deja vacía la dirección del servidor: así verás todos tus ambientes. Inicia sesión con tu cuenta organizacional y selecciona **Next** ([Learn: Dataverse connector, Power Query Online](https://learn.microsoft.com/power-query/connectors/dataverse)).
4. Expande tu ambiente, marca `sit_solicitud` y `contact` y selecciona **Transform data**.
5. Haz los pasos del **Ejercicio 3** de este lab. Learn advierte que las pestañas de la cinta de Power Query dependen del producto en el que se abre y que muchas transformaciones se pueden lanzar desde varios sitios ([Learn: Power Query UI](https://learn.microsoft.com/power-query/power-query-ui)): si un botón no está donde dice el Ejercicio 3, haz clic derecho en el encabezado de la columna (su menú ofrece muchas de las mismas transformaciones) o busca el botón en las otras pestañas de la cinta.
6. Al terminar, Power BI te ofrece **Create a report** o **Create a semantic model only**. Elige **Create a semantic model only**: llegas al editor del modelo.
7. Cambia de **Viewing mode** a **Editing mode**. Haz el **Ejercicio 4** (arrastra `Solicitante ID` sobre `Contacto ID`, o usa **Manage relationships** → **New relationship**) y el **Ejercicio 5** (selecciona la tabla en el panel **Data** y luego **New measure**). En el navegador los cambios se guardan solos y no se pueden deshacer.
8. Selecciona **New report** y haz el **Ejercicio 6** en la pestaña nueva. Guarda el reporte.

> **Si no te deja:** un administrador puede desactivar la edición de modelos en el servicio para toda la organización. Si **Open semantic model** aparece deshabilitado, pasa el mouse sobre el botón: Learn indica que ahí se ve el motivo.

**Alternativa más corta (si ya hiciste el Lab 04):** en tu app model-driven, abre la vista de solicitudes y selecciona **Visualize this view**. Power BI arma un reporte automático con los datos de esa vista y, con licencia gratuita, puedes guardarlo con **Save** en tu **My workspace** ([Learn: Visualize your data quickly from Power Apps](https://learn.microsoft.com/power-bi/create-reports/dynamics-quick-create-report)). No sustituye al lab (no escribes medidas ni relaciones), pero te deja ver tus datos de Dataverse en Power BI.

**Evidencia de la variante:** las mismas capturas de la [Evidencia esperada](#evidencia-esperada), excepto el archivo `.pbix`. Indica que hiciste la **variante sin Windows**.

---

## Datos de apoyo

### Contactos de prueba (Ejercicio 1)

| First Name | Last Name | Email | Department |
|---|---|---|---|
| Ana | Torres | `ana.torres@example.com` | Finanzas |
| Luis | Gómez | `luis.gomez@example.com` | Operaciones |
| *(tu nombre)* | *(tu apellido)* | **Tu correo de inicio de sesión** (el de make.powerapps.com) | TI |

> Los dos primeros correos usan `example.com`, un dominio reservado para ejemplos: no envían nada a nadie. El tercero debe ser **exactamente** tu cuenta de inicio de sesión: el Ejercicio 8 lo compara con `USERPRINCIPALNAME()`.

### Cambios a las solicitudes del Lab 02 (Ejercicio 1)

"Hace N días" se cuenta desde hoy. Las filas sin cambio en una columna conservan el valor del Lab 02.

| # | Título de Solicitud | Solicitante | Estado | Fecha Solicitud | Fecha Resolución |
|---|---|---|---|---|---|
| 1 | Pantalla sin señal en oficina 3 | Ana Torres | **Resuelta** | hace 10 días | hace 8 días |
| 2 | Sin acceso a sistema contable | Ana Torres | Nueva | — | — |
| 3 | VPN caída para equipo remoto | Luis Gómez | **En Proceso** | — | — |
| 4 | Nuevo ingreso requiere credenciales | Tú | **Cerrada** | hace 6 días | hace 5 días |
| 5 | Solicitar silla ergonómica | Luis Gómez | Nueva | **hace 45 días** | — |
| 6 | Error al abrir Excel con macros | Tú | Resuelta (del Lab 02) | hace 12 días | **hace 10 días** |
| 7 | Impresora offline piso 2 | Ana Torres | Nueva | — | — |
| 8 | Acceso a carpeta de proyectos | Tú | Nueva | — | — |
| 9 | Internet lento desde ayer | Luis Gómez | En Proceso | — | — |
| 10 | Licencia de Adobe vencida | Ana Torres | **Resuelta** | **hace 60 días** | hace 57 días |

**Valores que deberías obtener con estos datos** (te sirven para comprobar tu reporte):

| Cifra | Valor esperado |
|---|---|
| `Total Solicitudes` | 10 |
| `% Resueltas` | 40 % (4 de 10: las filas 1, 4, 6 y 10) |
| `Promedio Días Resolución` | 2 (2 + 1 + 2 + 3 = 8 días, entre 4) |
| Barras por Estado | Nueva 4 · En Proceso 2 · Resuelta 3 · Cerrada 1 |
| Solicitudes por solicitante | Ana 4 · Luis 3 · Tú 3 |
| `Solicitudes Este Mes` | Depende del día de hoy: cuéntalas tú en el editor de filas (Ejercicio 1, paso 6) |

> **Si una cifra de días sale con un día de diferencia:** **Fecha Solicitud** es de tipo fecha y hora, y Dataverse la guarda en UTC. Al quitarle la hora puede quedar un día después del que ves en Power Apps. El Módulo 6 lo explica en la Práctica 6.1, Paso 3, punto 4. No es un error de tu reporte.

## Arquitectura del laboratorio

```
Dataverse (Lab 02)                          Power BI Desktop (lab06-reporte-solicitudes-ti.pbix)
                                            Modo Import
sit_solicitud ──── Power Query ──────────▶ Solicitudes TI  (lado "muchos")
  sit_solicitante (GUID del contacto)         Solicitante ID ──┐
                                                               │ Many to one (*:1)
contact ───────── Power Query ──────────▶ Contacts         │ Cross filter direction: Single
  contactid (GUID)                            Contacto ID ◀────┘ (el filtro viaja de Contacts a Solicitudes TI)

Medidas (en Solicitudes TI): Total Solicitudes · Solicitudes Este Mes · % Resueltas · Promedio Días Resolución
Reporte: 4 tarjetas · barras por Estado · líneas por mes · slicer por Nombre Completo
```

---

## Ejercicio 1 — Preparar los datos en Dataverse

> **Qué vas a hacer:** Crear tres contactos y completar las solicitudes del Lab 02 para que el reporte tenga algo que mostrar. En el Lab 02 dejaste **Solicitante** vacío y casi todas las solicitudes sin resolver: sin estos cambios, la relación con Contacts no filtraría nada y las medidas de resolución saldrían vacías.
> **Duración:** 20 min

### Tarea 1.1 — Crear los contactos

1. En [make.powerapps.com](https://make.powerapps.com), con tu ambiente **Developer**, abre **Tables** en el menú de la izquierda. **Contact** es una tabla estándar, no está en tu solución. Arriba de la lista hay tres pestañas: **Recommended** (solo tablas estándar), **Custom** (las que crean los makers) y **All** (todas). Elige **Recommended** o **All** y escribe `Contact` en el cuadro de búsqueda ([Learn: View tables](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-portal#view-tables)).
2. Abre **Contact** y su editor de filas, igual que en el Lab 02, Tarea 5.1 (**Edit** o **View data**).
3. Crea los 3 contactos de "Contactos de prueba": nombre, apellido, email y departamento.

   > **Lo mínimo es el apellido**: es la columna obligatoria de Contact. El editor muestra solo algunas columnas: si no ves **Email** o **Department**, selecciona el contador de columnas ocultas (un texto como **+17 more** al final de los encabezados) y márcalas ([Learn: Table columns and data](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-portal#table-columns-and-data)). Si aun así no te deja escribir en una, crea la fila con lo que te permita. Sin email no podrás hacer el Ejercicio 8 (opcional); sin departamento no pasa nada.

**Resultado esperado:** la tabla Contact tiene, al menos, tus 3 contactos (tu ambiente puede traer otros; no estorban).

### Tarea 1.2 — Completar las solicitudes

4. Abre la tabla **Solicitud TI** de tu solución y su editor de filas.
5. Aplica la tabla "Cambios a las solicitudes del Lab 02". En **Solicitante** elige el contacto en el Lookup, igual que elegiste la Categoría en el Lab 02.

   > **Orden importante en las filas 1 y 10:** llena **Fecha Resolución** antes de cambiar **Estado** a **Resuelta**, o guarda los dos cambios juntos. La regla `Exigir fecha de resolución` del Lab 02 bloquea una Resuelta sin fecha (es la regla funcionando, no un error).

6. **Cuenta las solicitudes de este mes:** cuenta cuántas filas tienen **Fecha Solicitud** en el mes y año de hoy. Anótalo: es el valor que debe dar `Solicitudes Este Mes` en el Ejercicio 5.

### Resultado esperado del Ejercicio 1

Las 10 solicitudes tienen Solicitante, 4 están resueltas o cerradas con Fecha Resolución, y tienes anotado cuántas son de este mes.

### Validación del Ejercicio 1

- [ ] 3 contactos creados, uno de ellos con tu correo de inicio de sesión (si el editor lo permitió)
- [ ] Las 10 solicitudes tienen **Solicitante**
- [ ] Filas 1, 6 y 10 en **Resuelta** y fila 4 en **Cerrada**, las cuatro con **Fecha Resolución**
- [ ] Anotaste cuántas solicitudes son de este mes

---

## Ejercicio 2 — Conectar Power BI Desktop a Dataverse

> **Qué vas a hacer:** Abrir un reporte nuevo y traer las dos tablas con el conector **Dataverse**, en modo **Import**.
> **Duración:** 15 min

### Tarea 2.1 — Conseguir la dirección del ambiente

1. En make.powerapps.com, selecciona el ícono de engrane (**Settings**) arriba a la derecha y luego **Session details**.
2. Copia el valor **Instance url** (algo como `https://tuorg.crm.dynamics.com/`).
3. Bórrale el `https://` del inicio y la `/` del final. Te queda `tuorg.crm.dynamics.com`.

   > **No te saltes el paso 3:** con `https://` o con la `/` final, la conexión falla con el error *Named Pipes Provider, error: 40* ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-powerbi-connector)).

### Tarea 2.2 — Traer las tablas

4. Abre Power BI Desktop y crea un **reporte en blanco nuevo**. No uses los archivos del Módulo 6: Power BI puede crear relaciones solo al cargar tablas, y mezclarías datos.
5. En la pestaña **Home**, abre **Get data** y elige **Dataverse**. Si no aparece en la lista corta, selecciona **Get data from other sources**, busca `Dataverse` y selecciona **Connect**.
6. Si es la primera vez, selecciona **Sign in**, entra con tu cuenta de trabajo y luego **Connect**.
7. Si te pide **Environment domain**, pega la dirección de la Tarea 2.1. Si lo dejas vacío, el Navigator te muestra todos tus ambientes: abre el tuyo.
8. En la ventana **Navigator**, expande tu ambiente y marca estas dos tablas (aparecen con su nombre interno):
   - `sit_solicitud` (tu tabla **Solicitud TI** del Lab 02)
   - `contact`
9. Selecciona **Transform Data** (no **Load**): así se abre Power Query para limpiar antes de cargar.
10. Si te pregunta el modo de conexión, elige **Import** y **OK**.

### Resultado esperado del Ejercicio 2

Se abre la ventana de Power Query con dos consultas en el panel **Queries** de la izquierda: `sit_solicitud` y `contact`.

### Validación del Ejercicio 2

- [ ] Las dos tablas aparecen en el panel **Queries**
- [ ] El modo de conexión es **Import**

---

## Ejercicio 3 — Limpiar los datos en Power Query

> **Qué vas a hacer:** Quedarte solo con las columnas que necesitas, ponerles nombres legibles y los tipos correctos. Son los mismos pasos de la Práctica 6.1, Paso 3, del Módulo 6, adaptados a las tablas del Lab 02.
> **Duración:** 20 min

### Tarea 3.1 — Solicitudes TI

1. En **Queries**, haz doble clic en `sit_solicitud` y escribe `Solicitudes TI`. Haz lo mismo con `contact` y llámala `Contacts`.
2. Con `Solicitudes TI` seleccionada, ve a **Home** → **Choose columns**. Desmarca todo y marca solo estas columnas (escribe `sit_` en el cuadro de búsqueda de la ventana, si lo tiene, para ver solo las tuyas):

   | Marca esta columna | Qué es |
   |---|---|
   | La columna principal, con el nombre que anotaste en el Lab 02 (por ejemplo, `sit_titulo`: es solo un ejemplo, usa el tuyo) | Título de Solicitud |
   | `sit_estadoname` | La etiqueta de **Estado** (Nueva, En Proceso…) |
   | `sit_prioridadname` | La etiqueta de **Prioridad** |
   | `sit_categorianame` (el nombre del Lookup de Categoría: nombre del Lookup + `name`) | El nombre de la **Categoría** |
   | `sit_fechasolicitud` | Fecha Solicitud |
   | `sit_fecharesolucion` | Fecha Resolución |
   | `sit_slahoras` | SLA Horas |
   | `sit_solicitante` | El identificador (GUID) del contacto que pidió la solicitud |

   Selecciona **OK**.

   > **Por qué `...name`:** el conector Dataverse entrega cada columna Choice como dos columnas: una con el número interno (`sit_estado`) y otra con la etiqueta que lees (`sit_estadoname`). Un Lookup también llega como dos: el GUID de la fila relacionada (`sit_categoria`, `sit_solicitante`) y su nombre, con el sufijo `name` (`sit_categorianame`, `sit_solicitantename`) ([Learn: conector de Power BI](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-powerbi-connector); el patrón `<lookup>id` / `<lookup>name` está en [Learn: Use SQL to query data](https://learn.microsoft.com/power-apps/developer/data-platform/dataverse-sql-query#lookup-column-type-behaviors), el endpoint que usa el conector). Si en tu lista el nombre de Categoría se ve distinto, busca la columna que empieza por `sit_categoria` y termina en `name`. Para la relación con Contacts necesitas el GUID (`sit_solicitante`), no el nombre.
   >
   > **No confundas `sit_estadoname` con `statecodename`:** esta última es la columna del sistema **Status** (Active/Inactive) que trae toda tabla. La tuya lleva el prefijo `sit_`.

3. Renombra cada columna: doble clic en el encabezado (o clic derecho → **Rename**):

   | Columna original | Nombre nuevo |
   |---|---|
   | Tu columna principal | `Título de Solicitud` |
   | `sit_estadoname` | `Estado` |
   | `sit_prioridadname` | `Prioridad` |
   | `sit_categorianame` (o el nombre que tenga la tuya) | `Categoría` |
   | `sit_fechasolicitud` | `Fecha Solicitud` |
   | `sit_fecharesolucion` | `Fecha Resolución` |
   | `sit_slahoras` | `SLA Horas` |
   | `sit_solicitante` | `Solicitante ID` |

   > Escribe los nombres **exactamente** así, con tildes y mayúsculas: las medidas del Ejercicio 5 los usan letra por letra.

4. **Tipos de dato:** selecciona `Fecha Solicitud` y ve a **Transform** → **Data type** → **Date**. Repite con `Fecha Resolución`. Selecciona `SLA Horas` y comprueba que es **Whole Number** (si no, cámbialo igual).

   **Resultado esperado:** el ícono a la izquierda de cada encabezado de fecha es un calendario, no `ABC`. Si una fecha queda como texto, el gráfico por mes no agrupará (es la micropráctica [Fechas como texto](/practica/ip-trb-005-fechas-como-texto)).

### Tarea 3.2 — Contacts

5. Selecciona `Contacts` → **Home** → **Choose columns**. Deja solo `contactid`, `fullname`, `emailaddress1` y `department`, y selecciona **OK**.
6. Renómbralas: `contactid` → `Contacto ID`, `fullname` → `Nombre Completo`, `emailaddress1` → `Email`, `department` → `Departamento`.

### Tarea 3.3 — Cargar y guardar

7. Ve a **Home** → **Close & Apply**. Power Query se cierra y las dos tablas aparecen en el panel **Data** (a la derecha).
8. **Guarda ya:** **File** → **Save** como `lab06-reporte-solicitudes-ti.pbix` en tu carpeta **Documentos**. Vuelve a guardar al final de cada ejercicio.

### Resultado esperado del Ejercicio 3

En el panel **Data** ves `Solicitudes TI` con 8 columnas y `Contacts` con 4, todas con los nombres nuevos. El archivo `.pbix` está guardado.

### Validación del Ejercicio 3

- [ ] `Solicitudes TI` tiene exactamente las 8 columnas de la tabla del paso 3, con esos nombres
- [ ] `Fecha Solicitud` y `Fecha Resolución` son de tipo **Date**
- [ ] `Contacts` tiene `Contacto ID`, `Nombre Completo`, `Email` y `Departamento`
- [ ] El archivo `lab06-reporte-solicitudes-ti.pbix` está guardado

---

## Ejercicio 4 — Relación muchos a uno

> **Qué vas a hacer:** Unir las dos tablas para que, al elegir un contacto, se filtren sus solicitudes.
> **Duración:** 10 min

1. En la barra izquierda de Power BI Desktop, selecciona **Model view** (la tercera vista, después de **Report** y **Table**).
2. Busca una línea entre `Solicitudes TI` y `Contacts`. Power BI a veces crea relaciones solo al cargar y a veces no; con estos nombres de columna lo normal es que no haya ninguna.
3. **Si no hay línea**, créala: arrastra `Solicitante ID` de `Solicitudes TI` y suéltala sobre `Contacto ID` de `Contacts`. (También: **Home** → **Manage relationships** → **New**.)
4. Haz doble clic en la línea para abrir el editor de la relación y comprueba:
   - Columnas: `Solicitudes TI[Solicitante ID]` y `Contacts[Contacto ID]`.
   - **Cardinality**: **Many to one (\*:1)**. Muchas solicitudes, un contacto.
   - **Cross filter direction**: **Single**. El filtro viaja del lado "uno" (Contacts) al lado "muchos" (Solicitudes TI).
   - **Make this relationship active**: marcada.
   - Selecciona **OK**. (Si en vez de una ventana ves las opciones en el panel **Properties** de la derecha, el botón para confirmar es **Apply changes**.)

   Fuente: [Learn: Create and manage relationships](https://learn.microsoft.com/power-bi/transform-model/desktop-create-and-manage-relationships).

5. **Si ya había una línea**, ábrela igual (doble clic) y comprueba que une esas dos columnas y no otras. Si une otras, elimínala (selecciónala y pulsa **Supr**/**Delete**) y créala como en el paso 3.
6. Guarda.

### Resultado esperado del Ejercicio 4

En Model view hay una línea entre las dos tablas, con un `*` del lado de `Solicitudes TI` y un `1` del lado de `Contacts`.

### Validación del Ejercicio 4

- [ ] La relación une `Solicitante ID` con `Contacto ID`
- [ ] **Many to one (\*:1)** y **Single**

---

## Ejercicio 5 — Medidas DAX

> **Qué vas a hacer:** Crear las cuatro medidas. Las fórmulas son exactamente las del Módulo 6, Práctica 6.2; allí está explicada cada función.
> **Duración:** 20 min

**Cómo crear cada medida:** en **Report view**, en el panel **Data**, haz clic derecho en `Solicitudes TI` (o pasa el mouse y selecciona **More options (...)**) → **New measure**. En la barra de fórmulas, borra `Measure =`, escribe la fórmula completa (para otra línea usa **Alt + Enter**) y pulsa **Enter** o el botón de palomita (**Commit**). La medida aparece en `Solicitudes TI` con ícono de calculadora ([Learn](https://learn.microsoft.com/power-bi/transform-model/desktop-tutorial-create-measures)).

1. **Total Solicitudes** (la usan los gráficos y el slicer)

```dax
Total Solicitudes = COUNTROWS('Solicitudes TI')
```

2. **Solicitudes Este Mes**

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

3. **% Resueltas**

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

   Selecciona la medida en el panel **Data**; en la cinta **Measure tools**, grupo **Formatting**, abre la lista **Format** y elige **Percentage**. Sin ese formato verás `0.4` en vez de `40 %` (Learn describe la lista **Format** del grupo **Formatting** en [dynamic format strings](https://learn.microsoft.com/power-bi/create-reports/desktop-dynamic-format-strings) y la opción **Percentage** en [este ejemplo con Power BI Desktop](https://learn.microsoft.com/azure/sentinel/powerbi#create-a-new-quick-measure)).

4. **Promedio Días Resolución**

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

> **Decisión de negocio (la misma del Módulo 6):** una solicitud **Cerrada** ya pasó por Resuelta, así que cuenta como resuelta.
>
> **Si una fórmula se marca en rojo:** casi siempre es un nombre de columna que no coincide (por ejemplo, `Fecha resolución` con minúscula). Compáralo con el panel **Data**.

**Comprueba las medidas:** crea un visual **Card** por medida (Ejercicio 6, paso 2) o, por ahora, un visual **Table** con las cuatro. Compara con "Valores que deberías obtener" de los Datos de apoyo y con el conteo de este mes que anotaste en el Ejercicio 1.

### Resultado esperado del Ejercicio 5

`Solicitudes TI` tiene 4 medidas. `Total Solicitudes` = 10, `% Resueltas` = 40 %, `Promedio Días Resolución` ≈ 2 y `Solicitudes Este Mes` = tu conteo.

### Validación del Ejercicio 5

- [ ] Las 4 medidas existen sin errores
- [ ] `% Resueltas` tiene formato de porcentaje
- [ ] Los valores coinciden con los esperados (o sabes explicar la diferencia: datos distintos o desfase UTC de un día)

---

## Ejercicio 6 — Visuales y slicer

> **Qué vas a hacer:** Armar la página del reporte. Para cada visual: haz clic en un espacio vacío del lienzo, elige el ícono en el panel **Visualizations** (pasa el mouse sobre los íconos para ver su nombre) y arrastra campos o medidas desde el panel **Data** a las áreas que se indican.
> **Duración:** 25 min

1. Haz doble clic en la pestaña de página de abajo (`Page 1`) y llámala `Resumen`.

2. **Cuatro tarjetas:** cuatro visuales **Card**, cada uno con una medida en su área de valores: `Total Solicitudes`, `Solicitudes Este Mes`, `% Resueltas` y `Promedio Días Resolución`. Colócalas en fila arriba.

   > Si ves "2K" en vez de un número, o demasiados decimales, ajusta el formato de la tarjeta como en el Módulo 6, Práctica 6.3, Página 1, punto 1.

3. **Solicitudes por Estado (barras):** visual **Clustered bar chart** (barras horizontales; no lo confundas con **Clustered column chart**, que es de columnas verticales) ([Learn: lista de visuales del panel Analytics](https://learn.microsoft.com/power-bi/transform-model/desktop-analytics-pane)). Arrastra `Estado` al **Y-axis** y `Total Solicitudes` al **X-axis**. En barras horizontales, las categorías van en el eje vertical.

   **Resultado esperado:** 4 barras: Nueva 4, En Proceso 2, Resuelta 3, Cerrada 1.

4. **Solicitudes por mes (líneas):** visual **Line chart**. Arrastra `Fecha Solicitud` al **X-axis** y `Total Solicitudes` al **Y-axis**.
   - Como `Fecha Solicitud` es de tipo **Date**, Power BI crea sola la jerarquía **Year** → **Quarter** → **Month** → **Day** y empieza en el año: verás un solo punto.
   - Selecciona dos veces el ícono de doble flecha hacia abajo que aparece sobre el visual (**Go to the next level in the hierarchy**): primero pasa a trimestres y luego a meses ([Learn](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-column-charts)).

   **Resultado esperado:** entre 2 y 4 puntos, uno por cada mes con solicitudes (incluidos los meses de las filas 5 y 10).

5. **Slicer por solicitante:** visual **Slicer** con `Contacts[Nombre Completo]`. Un slicer nuevo sale por defecto como lista desplegable (**Dropdown**). Para ver los tres nombres a la vista, con el slicer seleccionado ve al panel **Format** → **Visual** → **Slicer settings** → **Options** y, en **Style**, elige **Vertical list** ([Learn: Slicer visual](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-slicer-visual)). Con **Dropdown** también funciona: abre la lista y elige ahí.

6. **Prueba la relación:** en el slicer, elige `Ana Torres`.

   **Resultado esperado:** `Total Solicitudes` = 4 y `% Resueltas` = 50 % (filas 1 y 10 resueltas, de 4). El gráfico de barras también cambia. Para quitar el filtro, selecciona otra vez `Ana Torres` (un segundo clic la deselecciona) o usa el ícono de goma de borrar que aparece en la cabecera del slicer, que borra toda su selección ([Learn: Slicer visual](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-slicer-visual#selection-controls) y [Learn: Slicers](https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-slicers#clear-selections-with-the-header-icon)). Si las tarjetas no cambian, la relación no está bien: vuelve al Ejercicio 4.

7. Guarda.

### Resultado esperado del Ejercicio 6

La página `Resumen` tiene 4 tarjetas, el gráfico de barras, el de líneas por mes y el slicer, y todo responde al slicer.

### Validación del Ejercicio 6

- [ ] 4 tarjetas con las 4 medidas
- [ ] Barras por Estado con los 4 estados
- [ ] Líneas agrupadas por mes, no por año ni por día suelto
- [ ] Al elegir un solicitante en el slicer, cambian las tarjetas y los gráficos

---

## Ejercicio 7 — Guardar y publicar

> **Qué vas a hacer:** Guardar el archivo final y, si tu licencia lo permite, publicarlo en el servicio de Power BI.
> **Duración:** 10 min

1. **File** → **Save**. Este `.pbix` es tu evidencia principal: con él el lab ya cuenta aunque no publiques.
2. **Publicar:** en la pestaña **Home** selecciona **Publish** (o **File** → **Publish** → **Publish to Power BI**). Inicia sesión si te lo pide.
3. Elige el destino:
   - **Licencia gratuita:** **My workspace**. Solo tú verás el reporte.
   - **Pro o PPU:** un workspace compartido donde tengas permiso (por ejemplo, uno de práctica que te dé tu administrador).

   Selecciona **Select**.
4. Al terminar aparece un enlace al reporte. Ábrelo: en el workspace verás dos elementos con el nombre del archivo, el **reporte** y el **semantic model** (los datos y las medidas) ([Learn: Publish from Power BI Desktop](https://learn.microsoft.com/power-bi/create-reports/desktop-upload-desktop-files)).

> **Ojo:** los cambios que hagas al reporte en el servicio no vuelven a tu `.pbix`. Si vas a seguir editando, hazlo en Desktop y vuelve a publicar.
>
> Configurar la actualización programada en el servicio está en el Módulo 6, Práctica 6.5, Paso 2; no hace falta para aprobar este lab.

### Resultado esperado del Ejercicio 7

El `.pbix` está guardado y, si publicaste, el reporte se abre en app.powerbi.com con los mismos números que en Desktop.

### Validación del Ejercicio 7

- [ ] `lab06-reporte-solicitudes-ti.pbix` guardado con la página `Resumen`
- [ ] *(Si tu licencia lo permite)* reporte y semantic model visibles en tu workspace

---

## Ejercicio 8 (opcional) — Seguridad por filas (RLS)

> **Qué vas a hacer:** Crear el mismo rol `Solicitante` del Módulo 6, Práctica 6.5, Paso 5: cada persona ve solo sus propias solicitudes. Lo pruebas en Desktop, sin publicar.
> **Duración:** 20 min · **Necesitas:** tu contacto con tu correo de inicio de sesión (Ejercicio 1)

1. En Power BI Desktop, pestaña **Modeling** → **Manage roles**.
2. Selecciona **New** y llama al rol `Solicitante`.
3. En **Select tables** elige `Contacts`. En **Filter data** selecciona **Switch to DAX editor** y escribe:

   ```dax
   [Email] = USERPRINCIPALNAME()
   ```

   - `USERPRINCIPALNAME()` devuelve el nombre con el que inicia sesión quien mira el reporte (con formato `usuario@empresa.com`).
   - La regla deja visible solo el contacto con ese email y, por la relación del Ejercicio 4 (Contacts filtra a Solicitudes TI), solo sus solicitudes.
   - Una regla con `USERPRINCIPALNAME()` solo se puede escribir en el editor DAX, no en el editor por defecto.

4. Selecciona **Save**.
5. **Pruébalo como Ana:** **Modeling** → **View as**. En la ventana **View as roles**, marca `Solicitante`, marca **Other user** y escribe `ana.torres@example.com`. Selecciona **OK**.

   **Resultado esperado:** el reporte muestra solo las 4 solicitudes de Ana (`Total Solicitudes` = 4) y el slicer solo tiene su nombre.

6. **Pruébalo como tú:** vuelve a **View as**, deja marcado `Solicitante`, cambia **Other user** por tu correo de inicio de sesión y **OK**.

   **Resultado esperado:** `Total Solicitudes` = 3 (filas 4, 6 y 8).

7. Para volver a ver todo, abre **View as**, elige **None** (la primera opción de la ventana **View as roles**; desmarca `Solicitante` y **Other user** si siguen marcados) y **OK**.

Fuentes: [Learn: RLS en Power BI](https://learn.microsoft.com/fabric/security/service-admin-row-level-security) (roles y `USERPRINCIPALNAME()`) y [Learn: validar roles en Power BI Desktop](https://learn.microsoft.com/power-bi/report-server/row-level-security-report-server) (**View as**).

> **Si publicas con RLS:** los miembros del rol se asignan en el servicio (semantic model → **More options (...)** → **Security**) y RLS solo se aplica a quien tiene rol **Viewer** en el workspace; los **Admin**, **Member** y **Contributor** ven todo. Compartir con otras personas exige Pro o PPU (ver [Por qué este lab es opcional](#por-qué-este-lab-es-opcional)).
>
> **El UPN no siempre es el email:** el nombre de inicio de sesión puede ser distinto del correo de la persona (por ejemplo, si usa un alias). En una empresa real, guarda en la tabla lo que devuelve `USERPRINCIPALNAME()`, no el email "bonito".

### Validación del Ejercicio 8

- [ ] El rol `Solicitante` existe con el filtro `[Email] = USERPRINCIPALNAME()` sobre `Contacts`
- [ ] Con **View as** como Ana ves 4 solicitudes y como tú ves 3

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| *Unable to connect… Named Pipes Provider, error: 40* | La dirección lleva `https://` o la `/` final | Pega solo `tuorg.crm.dynamics.com` (Tarea 2.1) |
| No conecta aunque la dirección está bien | El **TDS endpoint** del ambiente está desactivado, o la red bloquea los puertos 1433 y 5558 | Revisa el TDS endpoint como en el Módulo 6 (Práctica 6.1, Paso 2, "Si la conexión falla"); prueba desde otra red |
| No encuentro `sit_solicitud` en el Navigator | Estás en otro ambiente, o tu tabla del Lab 02 quedó con otro nombre interno (por ejemplo, `sit_solicitudti`) | Revisa el ambiente; si el nombre es otro, úsalo: después la renombras igual a `Solicitudes TI` |
| `Estado` muestra números (`100000000`…) | Marcaste `sit_estado` en vez de `sit_estadoname` | **Choose columns** otra vez y marca la que termina en `name` |
| Veo "Active/Inactive" en vez de Nueva, En Proceso… | Marcaste `statecodename` (la columna del sistema **Status**) | Usa `sit_estadoname` |
| No encuentro la columna del título | Su nombre interno no lo eliges tú | Usa el que anotaste en el Lab 02 (Tarea 2.2, paso 7) |
| Una medida sale en rojo | Un nombre de columna no coincide letra por letra | Compara con el panel **Data**; renombra la columna o corrige la fórmula |
| `% Resueltas` muestra `0.4` | Falta el formato de porcentaje | Selecciona la medida → **Measure tools** → **Format** → **Percentage** |
| `Promedio Días Resolución` sale vacío | No hay solicitudes Resuelta/Cerrada con las dos fechas | Revisa el Ejercicio 1; en Desktop, **Home** → **Refresh** |
| El gráfico de líneas tiene un solo punto | Está en el nivel **Year** de la jerarquía | Baja dos niveles con **Go to the next level in the hierarchy** |
| El eje de fechas muestra fechas sueltas, sin jerarquía | `Fecha Solicitud` quedó como texto | Power Query → **Transform** → **Data type** → **Date** |
| El slicer no cambia las tarjetas | Falta la relación o une columnas equivocadas | Ejercicio 4 |
| **View as** como tú muestra 0 solicitudes | Tu contacto no tiene exactamente tu correo de inicio de sesión | Corrige el email del contacto en Dataverse y **Home** → **Refresh** |

---

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### La conexión a Dataverse falla

- **Causa probable:** la dirección del ambiente está mal escrita, el TDS endpoint está desactivado o la red bloquea el puerto.
- **Cómo comprobar:** lee el mensaje. *Named Pipes… error: 40* casi siempre es la dirección con `https://` o `/`. Si dejas **Environment domain** vacío y tu ambiente aparece en el Navigator, el problema era la dirección.
- **Cómo corregir:** corrige la dirección. Si sigue fallando, pide a quien administre el ambiente que revise **Enable TDS endpoint**. El conector necesita abiertos los puertos TCP 1433 o 5558 ([Learn](https://learn.microsoft.com/power-query/connectors/dataverse)); en redes corporativas o con proxy, prueba desde otra red.
- **Reiniciar vs. reparar:** no hay nada que reiniciar en el `.pbix`; es un problema de conexión.
- **Evidencia posterior a la corrección:** el Navigator muestra tu ambiente y la tabla `sit_solicitud`.

### Los números no cuadran con los esperados

- **Causa probable:** los datos de Dataverse no son los del Ejercicio 1, el reporte no se actualizó después de cambiarlos, o hay un desfase de un día por UTC.
- **Cómo comprobar:** agrega un visual **Table** con `Título de Solicitud`, `Estado`, `Fecha Solicitud`, `Fecha Resolución` y `Nombre Completo` y compáralo fila por fila con la tabla de Datos de apoyo.
- **Cómo corregir:** corrige en Dataverse lo que falte y en Desktop selecciona **Home** → **Refresh**. Si solo difiere un día en alguna fecha, es el desfase UTC: no hay que corregirlo.
- **Reiniciar vs. reparar:** repara los datos; no rehagas el reporte.
- **Evidencia posterior a la corrección:** la tabla de comprobación coincide con los Datos de apoyo.

### El slicer no filtra

- **Causa probable:** no hay relación, une columnas equivocadas (por ejemplo, `Nombre Completo` con `Título de Solicitud`) o la columna `Solicitante ID` está vacía.
- **Cómo comprobar:** en Model view, doble clic en la línea y revisa columnas, **Cardinality** y **Cross filter direction**. En **Table view** mira si `Solicitante ID` tiene valores.
- **Cómo corregir:** si une columnas equivocadas, elimínala y créala con `Solicitante ID` → `Contacto ID`. Si `Solicitante ID` está vacía, completa **Solicitante** en Dataverse (Ejercicio 1) y actualiza.
- **Reiniciar vs. reparar:** solo la relación; el resto del reporte no se toca.
- **Evidencia posterior a la corrección:** al elegir a Ana, `Total Solicitudes` = 4.

### El rol de RLS no filtra o lo filtra todo

- **Causa probable:** el email del contacto no coincide con el que pasas en **Other user**, o el filtro está en la tabla equivocada.
- **Cómo comprobar:** en **Manage roles**, revisa que el filtro esté en `Contacts` y sea `[Email] = USERPRINCIPALNAME()`. Compara letra por letra el email del contacto con el que escribiste.
- **Cómo corregir:** corrige el email en Dataverse y actualiza, o corrige el filtro y **Save**.
- **Reiniciar vs. reparar:** repara el rol; no hace falta borrarlo.
- **Evidencia posterior a la corrección:** **View as** como Ana muestra 4 solicitudes.

---

## Checklist final

- [ ] Datos preparados: 3 contactos y las 10 solicitudes con Solicitante, 4 resueltas o cerradas
- [ ] Conexión con el conector **Dataverse** en modo **Import**
- [ ] `Solicitudes TI` con 8 columnas renombradas y fechas de tipo **Date**; `Contacts` con 4 columnas
- [ ] Relación **Many to one (\*:1)**, **Single**, de `Solicitante ID` a `Contacto ID`
- [ ] 4 medidas DAX funcionando, `% Resueltas` con formato de porcentaje
- [ ] Página `Resumen` con 4 tarjetas, barras por Estado, líneas por mes y slicer por solicitante
- [ ] `lab06-reporte-solicitudes-ti.pbix` guardado
- [ ] *(Opcional)* reporte publicado en tu workspace
- [ ] *(Opcional)* rol `Solicitante` probado con **View as**

---

## Evidencia esperada

- Captura de Power Query con las columnas de `Solicitudes TI` ya renombradas y las fechas con ícono de calendario
- Captura de Model view con la relación y su editor abierto (**Many to one (\*:1)**, **Single**)
- Captura de la página `Resumen` sin filtros, con los valores de las 4 tarjetas (esperado: 10 · tu conteo del mes · 40 % · ≈ 2)
- Captura de la página `Resumen` con `Ana Torres` elegida en el slicer (esperado: 4 solicitudes y 50 %)
- La fórmula exacta de una medida y el valor que devolvió
- El archivo `lab06-reporte-solicitudes-ti.pbix`
- *(Si publicaste)* captura del workspace con el reporte y el semantic model
- *(Si hiciste RLS)* captura de **View as** como Ana, con 4 solicitudes

## Criterios de aprobación

- El reporte se conecta a las tablas del Lab 02 con el conector Dataverse
- La relación es de muchos a uno con filtro Single y el slicer filtra las tarjetas
- Las 4 medidas devuelven los valores esperados (o explicas la diferencia)
- 100% de los ítems obligatorios del Checklist final marcados (los marcados como opcionales no cuentan)

## Reto adicional

Si terminaste antes del tiempo estimado, intenta:

**Reto básico:** Agrega una segunda página `Por Categoría` con un visual **Matrix**: `Prioridad` en filas, `Categoría` en columnas y `Total Solicitudes` en valores, como en la Página 2 de la Práctica 6.3 del Módulo 6.

**Reto intermedio:** Agrega la columna `Días Abierta` en Power Query y la medida `Vencidas SLA`, siguiendo la Práctica 6.1 (Paso 3, punto 5) y la Práctica 6.2 (medida 5) del Módulo 6. ¿Cuántas solicitudes abiertas superan su SLA?

**Reto avanzado:** Crea el rol estático `Departamento Finanzas` en `Contacts` con `[Departamento] = "Finanzas"` (Módulo 6, Práctica 6.5, Paso 5, punto 4) y pruébalo con **View as**. ¿Por qué no se compara `[Departamento]` con `USERPRINCIPALNAME()`?

---

## Preguntas de repaso

1. ¿Por qué marcas `sit_estadoname` y no `sit_estado` en Power Query, y cuándo sí convendría usar el número?
2. En la relación entre `Solicitudes TI` y `Contacts`, ¿cuál es el lado "uno", hacia dónde viaja el filtro con **Single** y por qué eso hace funcionar el slicer?
3. ¿Por qué `Promedio Días Resolución` usa `Fecha Resolución` y no los días desde que se pidió la solicitud hasta hoy?
4. ¿Qué licencia necesitas para que un compañero vea tu reporte publicado, y qué pasa si el workspace está en una capacidad Fabric F64?

---

## Limpieza del laboratorio

> Si es tu ambiente Developer personal, conserva los datos: los contactos y los cambios del Ejercicio 1 no estorban a los Labs 03, 04 y 05.

1. Si usas un ambiente compartido, elimina los 3 contactos de prueba y devuelve las solicitudes a su estado del Lab 02 si otros lo necesitan.
2. Si publicaste y no quieres conservarlo, en tu workspace elimina el reporte y el semantic model (**More options (...)** → **Delete**).
3. Conserva el `.pbix`: es tu evidencia.

---

## Siguiente laboratorio recomendado

➡️ **Módulo 07 — Fundamentos de Power Fx y Expresiones**, y después el **Módulo 08 — Primer Proyecto Integrado**

**Por qué ir ahí:** en el Módulo 08 armas otro reporte de Power BI sobre tablas nuevas (prefijo `sse`). Repetirás este método (conectar, limpiar, relacionar, medir y visualizar), esta vez con menos guía.

---
id: lab-02
title: "Dataverse — Modelado de Datos para un Sistema de Solicitudes"
level: "N1"
duration: 105
product: ["Dataverse", "Power Apps"]
certifications: ["PL-900"]
role: ["Maker", "Developer"]
prerequisites:
  - "Ambiente del curso activo en make.powerapps.com"
  - "Módulo 1 completado — entorno configurado"
files: []
lastVerified: "2026-11"
---

# Lab 02 — Dataverse: Modelo de Datos para un Sistema de Solicitudes Internas

## Objetivo

Al finalizar este laboratorio podrás diseñar e implementar un modelo de datos relacional en Dataverse con tablas personalizadas, columnas tipadas, relaciones Many-to-one, Business Rules y vistas, dentro de una solución con tu propio Publisher.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — consultoría de TI, 85 empleados, México

**Problema a resolver:** El área de soporte interno registra las solicitudes de sus empleados en un Excel compartido. No hay control de asignación, las prioridades se cambian sin criterio y es imposible generar métricas de tiempo de resolución por categoría.

**Por qué Dataverse:** Las tablas relacionales con ownership por usuario, Business Rules que también se aplican en el servidor y la integración nativa con Power Apps y Power Automate eliminan la hoja de cálculo sin necesitar código.

## Lo que vas a construir

- **Tabla `Solicitud TI`** (nombre interno `sit_solicitud`): registro principal de cada solicitud con estado, prioridad, fechas y vínculos a categoría, solicitante y responsable
- **Tabla `Categoría`** (nombre interno `sit_categoria`): catálogo de categorías con su SLA de referencia en horas
- **Relación Many-to-one** de `Solicitud TI` hacia `Categoría` (muchas solicitudes, una categoría)
- **2 Business Rules**: SLA según la prioridad y fecha de resolución obligatoria
- **3 vistas** personalizadas para los distintos roles del equipo de soporte

## Relación con el Módulo 2

Este lab construye **el mismo modelo del Módulo 2**, con los mismos nombres visibles (`Solicitud TI`, `Título de Solicitud`, `Estado`, `Prioridad`…), así que las fórmulas de los Módulos 3 y 7 y del Lab 03 funcionan igual. Tiene dos diferencias, y las dos son a propósito:

1. **La categoría es una tabla catálogo (Lookup), no una columna Choice.** En el Módulo 2 practicaste las dos formas (la columna Choice `Categoría` y la tabla `Categoría Detallada`). Aquí te quedas con la tabla porque el Lab 04 muestra su SLA en el formulario y el Lab 09 le añade un Rollup.
2. **Los nombres internos se fijan a mano** (`sit_solicitud`, `sit_prioridad`, `sit_estado`…), porque los Labs 03, 04, 05 y 09 los usan en expresiones. Si los dejas automáticos, Dataverse los arma a partir del nombre visible: quita los espacios, y las letras con tilde pueden cambiar o desaparecer. Así obtienes nombres distintos (por ejemplo, `sit_solicitudti`).
3. **Los nombres de las categorías son un poco más largos** que las opciones del Módulo 2: "Red y Conectividad" equivale a "Red" y "Accesos y Seguridad" equivale a "Accesos". Usa los del lab: los Labs 05 y 22 los usan así.

**Dos datos de SLA, cada uno con su función:** cada **Categoría** tiene un **SLA Horas** de referencia (el tiempo típico de esa categoría; el Lab 04 lo muestra en el formulario). Cada **Solicitud TI** tiene su propio **SLA Horas**, que pone la Regla 1 según la prioridad. Las vistas ordenan por el de la solicitud.

**Sobre el prefijo:** el prefijo del Publisher es `sit` (sin guion bajo). Dataverse le agrega el guion bajo, por eso los nombres internos se ven como `sit_...`.

> **Si ya hiciste las prácticas del Módulo 2 en este mismo ambiente**, ya tienes una tabla llamada `Solicitud TI`. Antes de empezar, cámbiale el nombre visible para no confundirla con la de este lab: **Tables** → `Solicitud TI` → **Properties** → **Display name** = `Solicitud TI (M2)` y **Plural display name** = `Solicitudes TI (M2)` → **Save**. El nombre visible de una tabla sí se puede cambiar después de crearla; el nombre interno (Schema name) no.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Publisher y Solution | 10 min |
| Ejercicio 2 — Tablas, columnas y relaciones | 40 min |
| Ejercicio 3 — Business Rules | 20 min |
| Ejercicio 4 — Vistas personalizadas | 15 min |
| Ejercicio 5 — Datos de prueba | 20 min |
| **Total** | **105 min** |

## Nivel

**N1 Básico** — Certificación objetivo: **PL-900**

## Tecnologías utilizadas

- Microsoft Dataverse (tablas, columnas, relaciones, Business Rules, vistas)
- make.powerapps.com
- Power Platform Admin Center (solo si te falta un rol de seguridad)

## Prerrequisitos

### Entorno

- [ ] Cuenta de trabajo o estudio activa (no personal) — ver [Entornos y trials](/recursos/entornos-y-trials)
- [ ] Acceso confirmado a [make.powerapps.com](https://make.powerapps.com)
- [ ] Tu ambiente del curso con Dataverse creado, como en el Módulo 1 (Trial, o el Developer gestionado o Sandbox que te dé tu organización; nunca el ambiente Default de producción). Si es un Trial, comprueba cuántos días le quedan (**Day(s) remain**)
- [ ] Rol **System Customizer** o **System Administrator** en el ambiente

### Conocimiento previo

- Módulo 1 completado: conceptos de Power Platform y primer contacto con Dataverse
- Módulo 2 leído (tipos de columna, relaciones, Business Rules y vistas)

### Verificación rápida antes de empezar

En [make.powerapps.com](https://make.powerapps.com), el selector de ambiente en la esquina superior derecha debe mostrar tu ambiente del curso, **no** el ambiente Default.

> **Nombres de los botones:** Power Apps está en inglés en estos pasos, igual que en el Módulo 2 (el ambiente del curso se crea en English (United States)). Si un botón no aparece con el nombre que se indica, búscalo en la misma zona de la pantalla (barra de comandos de arriba o panel de la derecha) por lo que hace, no por su texto exacto.

---

## Datos de apoyo

Usa exactamente estos valores durante el laboratorio para garantizar coherencia con Labs posteriores (03, 04, 05, 09).

### Empresa del escenario

| Campo | Valor |
|---|---|
| Nombre empresa | Servicios Integrados Tecnológicos S.A. |
| Abreviación | SIT |
| Prefijo de publisher | `sit` (los nombres internos quedan como `sit_...`) |
| Publisher | `SIT` (el mismo del Módulo 2, si ya lo creaste) |
| Nombre de la solución | `SIT_SolicitudesInternas` |

### Datos de prueba — Categorías

| Nombre | Descripción | SLA Horas |
|---|---|---|
| Hardware | Equipos de cómputo, periféricos, impresoras | 48 |
| Software | Instalación, licencias, errores de aplicaciones | 24 |
| Red y Conectividad | VPN, Wi-Fi, accesos remotos | 8 |
| Accesos y Seguridad | Cuentas, contraseñas, permisos | 4 |
| Otro | Solicitudes que no encajan en categorías anteriores | 72 |

### Datos de prueba — Solicitudes (crear al final del lab)

Pon a cada una una **Fecha Solicitud** de los últimos 30 días. Deja **SLA Horas** vacía: la rellena la Business Rule.

| Título de Solicitud | Categoría | Prioridad | Estado |
|---|---|---|---|
| Pantalla sin señal en oficina 3 | Hardware | Media | Nueva |
| Sin acceso a sistema contable | Software | Alta | Nueva |
| VPN caída para equipo remoto | Red y Conectividad | Crítica | Nueva |
| Nuevo ingreso requiere credenciales | Accesos y Seguridad | Alta | Nueva |
| Solicitar silla ergonómica | Otro | Baja | Nueva |
| Error al abrir Excel con macros | Software | Media | En Proceso |
| Impresora offline piso 2 | Hardware | Media | Nueva |
| Acceso a carpeta de proyectos | Accesos y Seguridad | Alta | Nueva |
| Internet lento desde ayer | Red y Conectividad | Alta | En Proceso |
| Licencia de Adobe vencida | Software | Crítica | Nueva |

## Arquitectura del laboratorio

```
Solution: SIT_SolicitudesInternas   (Publisher SIT, prefijo sit)
│
├── Table: Categoría  (sit_categoria) — Ownership: Organization
│   ├── Nombre        (columna principal)
│   ├── Descripción   sit_descripcion   (Multiline Text)
│   └── SLA Horas     sit_slahoras      (Whole Number)
│
└── Table: Solicitud TI  (sit_solicitud) — Ownership: User or team
    ├── Título de Solicitud  (columna principal)
    ├── Descripción          sit_descripcion      (Multiline Text)
    ├── Prioridad            sit_prioridad        (Choice: Baja/Media/Alta/Crítica)
    ├── Estado               sit_estado           (Choice: Nueva/En Proceso/Resuelta/Cerrada/Aprobada/Rechazada)
    ├── Fecha Solicitud      sit_fechasolicitud   (Date and Time)
    ├── Fecha Resolución     sit_fecharesolucion  (Date Only)
    ├── SLA Horas            sit_slahoras         (Whole Number, la rellena una Business Rule)
    ├── Categoría            sit_categoria        → Lookup a Categoría (Many-to-one)
    ├── Solicitante          sit_solicitante      → Lookup a Contact (Many-to-one)
    └── Asignado a           sit_asignado         → Lookup a User (Many-to-one)
```

---

## Ejercicio 1 — Publisher y Solution

> **Qué vas a hacer:** Crear (o reutilizar) tu Publisher y crear la solución antes de tocar cualquier tabla. El Publisher pone el prefijo `sit_` en el nombre interno de todo lo que crees dentro de la solución.
> **Duración:** 10 min

### Tarea 1.1 — Crear la Solution (y el Publisher, si no lo tienes)

1. En [make.powerapps.com](https://make.powerapps.com), con tu ambiente del curso seleccionado, abre **Solutions** en el menú de la izquierda (si no lo ves, está en **…More**).

2. En la barra de comandos selecciona **New solution**. Se abre un panel a la derecha.

3. Rellena:

   | Campo | Valor |
   |---|---|
   | Display Name | `SIT Solicitudes Internas` |
   | Name | `SIT_SolicitudesInternas` (se rellena solo; corrígelo si hace falta) |

4. En **Publisher**:
   - **Si ya creaste el publisher `SIT` en el Módulo 2**, elígelo en la lista y salta al paso 6.
   - Si no, selecciona **New publisher** y rellena **Display Name** = `SIT`, **Name** = `SIT` y **Prefix** = `sit`. **Choice value prefix** se genera solo a partir del prefijo: no lo toques. Selecciona **Save**.

5. Comprueba que en **Publisher** queda elegido **SIT**.

6. Marca **Set as your preferred solution** (lo que crees fuera de la solución también se guardará en ella) y selecciona **Create**.

7. Abre la solución `SIT Solicitudes Internas` haciendo clic en su nombre. Estará vacía. **Trabaja siempre dentro de ella.**

   > ⚠️ **El prefijo no se cambia después.** El nombre interno (Schema name) de una tabla o columna no se puede modificar una vez guardada, y lleva delante el prefijo del Publisher. Comprueba que el prefijo sea exactamente `sit`.

### Resultado esperado del Ejercicio 1

La solución `SIT Solicitudes Internas` está abierta, vacía y con el publisher `SIT`.

### Validación del Ejercicio 1

- [ ] La solución existe en la lista de Solutions del ambiente
- [ ] El publisher de la solución tiene el prefijo `sit`
- [ ] La solución está vacía (0 componentes)

---

## Ejercicio 2 — Tablas, columnas y relaciones

> **Qué vas a hacer:** Crear primero el catálogo `Categoría` (para poder apuntar a él) y luego la tabla principal `Solicitud TI` con sus columnas y sus tres Lookups.
> **Duración:** 40 min

> **Cómo escribir el Schema name (léelo una vez, vale para todo el lab):** en **Advanced options**, el campo **Schema name** ya trae el prefijo `sit_` delante (Dataverse lo pone solo). **Escribe solo la parte de después**, por ejemplo `descripcion`. **Nunca** escribas tú `sit_descripcion` desde cero: quedaría `sit_sit_descripcion`, y ese nombre ya no se puede cambiar. Antes de guardar, lee el nombre completo y comprueba que diga exactamente `sit_descripcion`. En las tablas de abajo, la columna "Escribe solo esto" es lo que tecleas y "Resultado" es lo que debe quedar.

### Tarea 2.1 — Crear la tabla `Categoría`

1. Dentro de la solución, en la barra de comandos selecciona **New** → **Table** → **Table (advanced properties)**. (Fuera de una solución sería **Tables** → **New table** → **Set advanced properties**; aquí usa el de la solución.) Se abre el panel **New table**.

2. Rellena **Display name** = `Categoría` y **Plural display name** = `Categorías`.

3. En la pestaña **Primary column**, deja o escribe **Display name** = `Nombre`. Después de guardar la tabla ya no podrás cambiarlo.

4. Vuelve a la pestaña de propiedades y despliega **Advanced options**:
   - **Schema name**: escribe solo `categoria` (sin tilde). Resultado: `sit_categoria`. Si el prefijo que ves no es `sit_` (por ejemplo, ves algo como `cr8a3_`), no estás en tu solución: cierra sin guardar y vuelve al Ejercicio 1.
   - **Record ownership**: **Organization** (un catálogo es de toda la organización, no de un usuario).

5. Selecciona **Save**. Se abre la página de la tabla (su "hub").

6. En la zona **Columns** → **New column**, crea estas dos columnas. Antes de guardar cada una, despliega **Advanced options** y escribe el **Schema name** indicado:

   | Display name | Schema name: escribe solo esto | Resultado | Data type | Required |
   |---|---|---|---|---|
   | Descripción | `descripcion` | `sit_descripcion` | Multiline Text | Optional |
   | SLA Horas | `slahoras` | `sit_slahoras` | Whole Number | Business required |

7. **Anota el nombre interno de la columna principal `Nombre`.** Este nombre no lo eliges tú: el panel **Primary column** solo deja cambiar el nombre visible y la descripción, y Dataverse genera el nombre interno al guardar la tabla. Para verlo: en el hub de la tabla, zona **Columns**, selecciona la columna `Nombre`; en su panel de propiedades despliega **Advanced options** y mira **Schema name** (se ve, pero ya no se puede cambiar). Anótalo en minúsculas: esa es su forma de *logical name*, la que usan las expresiones ([Learn: columnas](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-field-portal), [Learn: SchemaName y LogicalName](https://learn.microsoft.com/power-apps/developer/data-platform/entity-attribute-metadata)). Los labs siguientes usan como **ejemplo** `sit_nombre`. Si el tuyo es otro, no pasa nada; haz esto:
   - **Labs 03 y 04:** donde diga `sit_nombre`, elige la columna por su nombre visible, **Nombre**.
   - **Fórmulas y expresiones** (por ejemplo, en Power Automate): escribe tu nombre interno en minúsculas en lugar de `sit_nombre`.

   > **¿Por qué Organization?** En una tabla Organization todos los usuarios con el rol adecuado ven todos los registros: ideal para catálogos. En una User or team, cada registro tiene dueño y puedes filtrar "mis registros". **Ojo:** el tipo de ownership no se puede cambiar después de crear la tabla.

### Tarea 2.2 — Crear la tabla `Solicitud TI`

1. Dentro de la solución, **New** → **Table** → **Table (advanced properties)**, igual que en la Tarea 2.1.

2. Rellena **Display name** = `Solicitud TI` y **Plural display name** = `Solicitudes TI`. Marca **Enable Attachments**.

3. En la pestaña **Primary column**, **Display name** = `Título de Solicitud`.

4. En **Advanced options**:
   - **Schema name**: escribe solo `solicitud`. Resultado: `sit_solicitud`. No lo dejes como lo propone Dataverse (algo como `sit_SolicitudTI`): los labs siguientes usan `sit_solicitud`.
   - **Record ownership**: **User or team**.

5. **Save**.

6. En **Columns** → **New column**, crea estas columnas, cada una con su **Schema name** en **Advanced options**:

   | Display name | Schema name: escribe solo esto | Resultado | Data type | Required | Detalle |
   |---|---|---|---|---|---|
   | Descripción | `descripcion` | `sit_descripcion` | Multiline Text | Optional | — |
   | Prioridad | `prioridad` | `sit_prioridad` | Choice | Optional | Opciones: Baja, Media, Alta, Crítica · Default choice = Media |
   | Estado | `estado` | `sit_estado` | Choice | Business required | Opciones: Nueva, En Proceso, Resuelta, Cerrada, Aprobada, Rechazada · Default choice = Nueva |
   | Fecha Solicitud | `fechasolicitud` | `sit_fechasolicitud` | Date and Time | Optional | — |
   | Fecha Resolución | `fecharesolucion` | `sit_fecharesolucion` | Date Only | Optional | — |
   | SLA Horas | `slahoras` | `sit_slahoras` | Whole Number | Optional | La rellena la Regla 1 |

   *Para las columnas Choice (Prioridad y Estado):* en **Data type** elige **Choice** > **Choice**; en **Sync with global choice?** elige **No**; escribe la primera opción en **Label** y añade las demás con **New choice**, en el orden de la tabla. El número de **Value** se genera solo: no lo cambies. Elige el **Default choice** indicado.

   > **📌 Sobre los valores numéricos de las opciones:** Dataverse genera el número de cada opción a partir del Choice value prefix de tu Publisher. No hay un número universal para "Aprobada": si un módulo posterior muestra uno de ejemplo (como `100000004`), es ilustrativo; mira siempre el valor real en tu ambiente. Aprobada y Rechazada no están en el Módulo 2: las usan los escenarios de aprobación de labs posteriores.

   > **No te confundas:** toda tabla trae de fábrica una columna del sistema llamada **Status** (Active/Inactive). Tu columna **Estado** es otra distinta. En reglas, vistas y fórmulas usa siempre **Estado**.
   >
   > **Si tu ambiente está en español:** la columna del sistema se llama **Estado** y tiene otra compañera, **Razón para el estado**. Entonces verás dos "Estado" en las listas. La tuya es la que creaste en esta tabla (nombre interno `sit_estado`); la del sistema no lleva el prefijo `sit_`.

7. **Anota el nombre interno de la columna principal `Título de Solicitud`**, igual que en el paso 7 de la Tarea 2.1 (tampoco lo eliges tú): zona **Columns** > columna **Título de Solicitud** > **Advanced options** > **Schema name**, y anótalo en minúsculas. Los labs siguientes usan como **ejemplo** `sit_titulo`. Si el tuyo es otro:
   - **Lab 04:** usa siempre el nombre visible, **Título de Solicitud**.
   - **Lab 05** (la tabla HTML del Flujo 2, `item()?['sit_titulo']`): cambia `sit_titulo` por tu nombre interno en minúsculas. En el resto del Lab 05, inserta **Título de Solicitud** como contenido dinámico.

### Tarea 2.3 — Crear las relaciones (Lookups)

Una columna Lookup crea a la vez una relación entre dos tablas. Créalas desde la tabla **Solicitud TI** (el lado "muchos"):

1. En el hub de **Solicitud TI**, zona **Relationships** → **New relationship** → **Many-to-one**.

2. En **Related** elige **Categoría**. En **Lookup column display name** escribe `Categoría`. En **Lookup column name** (el nombre interno) escribe solo `categoria`, con la misma regla de la Tarea 2.1: el prefijo `sit_` ya está delante. Resultado: `sit_categoria`. Si en tu pantalla el nombre completo está en una sola caja, deja `sit_` y escribe después `categoria`. **Lookup column requirement**: **Business required**.

3. Selecciona **Done** y luego **Save table**.

4. Repite los pasos 1 a 3 para las otras dos:

   | Related | Lookup column display name | Lookup column name: escribe solo esto | Resultado | Requirement |
   |---|---|---|---|---|
   | Contact | Solicitante | `solicitante` | `sit_solicitante` | Optional |
   | User | Asignado a | `asignado` | `sit_asignado` | Optional |

   > `User` es la tabla de usuarios del ambiente (nombre interno `systemuser`). No crees una tabla propia de usuarios: Dataverse ya la tiene.

5. En **Columns**, comprueba que `Categoría`, `Solicitante` y `Asignado a` aparecen con tipo **Lookup**.

### Resultado esperado del Ejercicio 2

`Solicitud TI` tiene 9 columnas personalizadas (6 de la Tarea 2.2 y 3 Lookups) además de `Título de Solicitud`. En **Relationships** verás muchas relaciones del sistema (propietario, creado por…); entre ellas están tus tres relaciones Many-to-one hacia Categoría, Contact y User.

### Validación del Ejercicio 2

- [ ] La tabla `Categoría` (`sit_categoria`) existe con `Descripción` y `SLA Horas`, y ownership **Organization**
- [ ] La tabla `Solicitud TI` (`sit_solicitud`) existe con 9 columnas personalizadas y ownership **User or team**
- [ ] `Prioridad` y `Estado` muestran todas sus opciones y su valor por defecto
- [ ] Las tres relaciones Many-to-one aparecen en **Relationships** de `Solicitud TI`
- [ ] Anotaste el nombre interno de las dos columnas principales

---

## Ejercicio 3 — Business Rules

> **Qué vas a hacer:** Las mismas dos reglas del Módulo 2: una rellena el SLA según la prioridad y otra impide marcar una solicitud como Resuelta sin fecha de resolución. Las dos usan Scope **Entity**, para que también se apliquen cuando cargues datos directamente en la tabla (Ejercicio 5), donde todavía no hay formulario de app.
> **Duración:** 20 min

**Cómo funciona el diseñador (léelo una vez):** una regla es un diagrama que empieza con una **Condition** (el rombo). A su derecha salen el **✓** (se cumple) y el **✕** (no se cumple). Las piezas se arrastran desde la pestaña **Components** hasta un **+** del diagrama, se configuran en **Properties** y se confirman siempre con **Apply**.

**Los operadores:** en la lista **Operator** busca estos nombres en inglés: **Equals** (es igual a) y **Does not contain data** (no contiene datos). Learn no publica la lista completa de operadores del diseñador de reglas, así que elígelos por su significado: si uno no aparece escrito igual, toma el que diga lo mismo.

### Tarea 3.1 — Regla 1: SLA según prioridad

1. En el hub de **Solicitud TI**, zona **Business rules** → **Add business rule** ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-create-business-rule)). Se abre el diseñador con una condición ya creada.

2. Nombre: `SLA según prioridad`. **Scope**: **Entity**.

3. Selecciona la condición. En **Properties**: **Display Name** = `Prioridad es Crítica`; regla: **Source** = **Entity**, **Field** = **Prioridad**, **Operator** = **Equals**, **Type** = **Value**, valor **Crítica**. **Apply**.

4. Arrastra **Set Field Value** al **+** del **✓**: **Field** = **SLA Horas**; si te pide **Type**, elige **Value**; valor `4`. **Apply**.

5. Arrastra una nueva **Condition** al **+** del **✕** de la primera: `Prioridad es Alta` → en su **✓**, **Set Field Value** **SLA Horas** = `8`.

6. Repite colgando cada condición del **✕** de la anterior: `Prioridad es Media` → `24`; `Prioridad es Baja` → `48`.

7. **Validate**, corrige lo que marque y **Save**.

8. **Actívala desde la lista:** una regla nueva queda guardada pero inactiva, y no se activa desde la ventana del diseñador. Ciérrala, vuelve a **Business rules** de la tabla, selecciona `SLA según prioridad` y elige **Activate**.

### Tarea 3.2 — Regla 2: Fecha de resolución obligatoria al resolver

1. **Add business rule**. Nombre: `Exigir fecha de resolución`. **Scope**: **Entity**.

2. Selecciona la condición. En **Properties**:
   - **Display Name**: `Resuelta sin fecha`
   - Primera regla: **Field** = **Estado** (la tuya, `sit_estado`), **Operator** = **Equals**, **Type** = **Value**, valor **Resuelta**.
   - Selecciona **New** para añadir una segunda regla, con **Rule Logic** = **AND**: **Field** = **Fecha Resolución**, **Operator** = **Does not contain data** (no necesita valor).
   - **Apply**.

3. Arrastra **Show Error Message** al **+** del **✓**: **Field** = **Fecha Resolución**, **Message** = `Debe ingresar la fecha de resolución antes de resolver la solicitud.` **Apply**.

4. **Validate**, **Save** y actívala desde la lista con **Activate**.

   > **¿Por qué la condición lleva "y la fecha está vacía"?** Si la condición fuera solo "Estado = Resuelta", el mensaje de error saldría siempre, también después de llenar la fecha, y la solicitud nunca se podría guardar.

   > **Por qué no hay una regla de "bloquear campos":** bloquear, ocultar o mostrar columnas solo funciona en formularios de apps model-driven; en el servidor se ignora. En este lab todavía no hay formulario (llega en el Lab 04), así que no podrías probarla.

### Resultado esperado del Ejercicio 3

En **Business rules** de `Solicitud TI` aparecen 2 reglas con estado **Activated**.

### Validación del Ejercicio 3

- [ ] Regla `SLA según prioridad` activa, con Scope Entity
- [ ] Regla `Exigir fecha de resolución` activa, con Scope Entity y las dos condiciones unidas con AND
- [ ] (Se prueban en el Ejercicio 5)

---

## Ejercicio 4 — Vistas personalizadas

> **Qué vas a hacer:** Crear 3 vistas con filtros y columnas distintas para los tres roles que usarán el sistema.
> **Duración:** 15 min

**Antes de empezar, sobre el orden:** las vistas ordenan una columna Choice por el texto de la opción, no por el orden en que la creaste. Si ordenas por **Prioridad** descendente obtienes Media, Crítica, Baja, Alta. Como **SLA Horas** ya refleja la prioridad (Crítica 4, Alta 8, Media 24, Baja 48), **ordena por SLA Horas de menor a mayor** para ver primero lo más urgente.

**Cómo se crea una vista (vale para las tres):** en el hub de **Solicitud TI**, zona **Views** → **New view** → escribe el nombre → **Create**. Añade columnas con **+ View column**. Los filtros se editan en el panel de propiedades con **Edit filters** → **Add** → **Add row** (las filas se unen con **And** por defecto) → **OK**. Para ordenar, selecciona el encabezado de una columna y elige **Sort ascending** o **Sort descending**; con **Shift** pulsado añades un segundo criterio. Termina con **Save and publish**.

**Operadores de los filtros:** usa **Does not equal** (no es igual a), **Equals** (es igual a), **Equals current user** (es igual al usuario actual) y **Does not contain data** (no contiene datos). Learn no enumera estos operadores (de la lista solo nombra por escrito **Contains data**, en [Learn: filtros de vistas](https://learn.microsoft.com/power-apps/maker/model-driven-apps/create-edit-view-filters)); elígelos por su significado: si uno no aparece escrito igual, toma el que diga lo mismo.

### Tarea 4.1 — Vista "Solicitudes Abiertas del Equipo" (supervisor de soporte)

1. Nombre: `Solicitudes Abiertas del Equipo`.
2. Columnas: `Título de Solicitud` | `Categoría` | `Prioridad` | `SLA Horas` | `Estado` | `Asignado a` | `Fecha Solicitud`.
3. Filtros: **Estado** **Does not equal** **Cerrada** y **Estado** **Does not equal** **Resuelta**.
4. Orden: **SLA Horas** ascendente y luego **Fecha Solicitud** ascendente.
5. **Save and publish**.

### Tarea 4.2 — Vista "Mis Solicitudes Activas" (empleado)

1. Nombre: `Mis Solicitudes Activas`.
2. Columnas: `Título de Solicitud` | `Categoría` | `Prioridad` | `Estado` | `Fecha Solicitud` | `SLA Horas`.
3. Filtros: **Estado** **Does not equal** **Cerrada** y **Owner** (Propietario) **Equals current user**.
   > **Por qué Owner y no Solicitante:** `Solicitante` apunta a un **Contact**, no a un usuario de la app, así que no se puede comparar con el usuario actual. El Owner es el usuario que creó el registro.
4. Orden: **Fecha Solicitud** descendente.
5. **Save and publish**.

### Tarea 4.3 — Vista "Críticas Sin Asignar" (jefe de soporte)

1. Nombre: `Críticas Sin Asignar`.
2. Columnas: `Título de Solicitud` | `Descripción` | `Solicitante` | `Fecha Solicitud`.
3. Filtros: **Prioridad** **Equals** **Crítica**, **Estado** **Equals** **Nueva** y **Asignado a** **Does not contain data**.
4. Orden: **Fecha Solicitud** ascendente (la más antigua primero).
5. **Save and publish**.

> Si un cambio no aparece donde esperas, en la solución selecciona **Publish all customizations** y espera a que termine.

### Validación del Ejercicio 4

- [ ] Las 3 vistas aparecen en **Views** de `Solicitud TI`
- [ ] Cada vista muestra las columnas configuradas y ordena por el criterio indicado

---

## Ejercicio 5 — Datos de prueba

> **Qué vas a hacer:** Cargar los registros de "Datos de apoyo" y comprobar que las Business Rules y las vistas funcionan.
> **Duración:** 20 min

### Tarea 5.1 — Crear las Categorías

1. Abre la tabla **Categoría** desde tu solución.
2. En la barra de comandos del hub selecciona **Edit**: se abre el diseñador de la tabla, donde puedes escribir filas nuevas. (También sirve **View data**, que abre el editor de filas.)
3. Agrega los 5 registros de "Datos de prueba — Categorías".

### Tarea 5.2 — Crear las Solicitudes

1. Abre la tabla **Solicitud TI** y su editor de filas, igual que en 5.1.
2. Agrega los 10 registros de "Datos de prueba — Solicitudes": elige la **Categoría** en el Lookup (son los registros de 5.1) y pon una **Fecha Solicitud** de los últimos 30 días.
3. Deja **SLA Horas**, **Solicitante** y **Asignado a** vacíos (SLA lo rellena la Regla 1; los otros dos se usan en labs posteriores).

### Tarea 5.3 — Probar las Business Rules

1. Revisa la solicitud "VPN caída para equipo remoto" (Prioridad Crítica).

   **Resultado esperado:** **SLA Horas** vale `4` sin que lo escribieras. Si la celda sigue vacía, recarga la página (el valor lo pone el servidor al guardar).

2. Abre la solicitud "Error al abrir Excel con macros" (En Proceso). Cambia **Estado** a **Resuelta** y guarda sin llenar **Fecha Resolución**.

   **Resultado esperado:** el guardado se bloquea y aparece un error con el texto `Debe ingresar la fecha de resolución antes de resolver la solicitud.` El aviso puede verse distinto según la pantalla (un mensaje junto a la celda o una ventana de error); lo importante es que no se guarda. **Copia el texto que viste:** es parte de tu evidencia.

3. Llena **Fecha Resolución** con la fecha de hoy y guarda.

   **Resultado esperado:** ahora sí se guarda.

4. Comprueba la vista `Solicitudes Abiertas del Equipo`. Todavía no tienes una app donde verla con datos (llega en el Lab 04), así que haz dos comprobaciones:
   - En **Views**, abre la vista y revisa que tenga los dos filtros de Estado y el orden **SLA Horas** ascendente.
   - En el editor de filas de **Solicitud TI**, cuenta las solicitudes que no están ni Resuelta ni Cerrada. Ese es el número de filas que mostrará la vista en el Lab 04.

   **Resultado esperado:** la vista está configurada así, y la solicitud que resolviste en el paso 3 ya no cuenta como abierta.

### Validación del Ejercicio 5

- [ ] 5 registros de Categoría y 10 de Solicitud TI
- [ ] Las Críticas tienen SLA Horas = 4 (y Alta 8, Media 24, Baja 48)
- [ ] La regla de fecha bloquea la Resuelta sin fecha y deja guardar con fecha
- [ ] La vista del equipo tiene configurado el orden **SLA Horas** ascendente

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| Mis tablas o columnas tienen un prefijo raro (como `cr8a3_`) en lugar de `sit_` | Las creaste fuera de la solución, con el publisher predeterminado del ambiente | Si aún no tienen datos ni dependencias, elimínalas y recréalas dentro de `SIT Solicitudes Internas` |
| Un nombre quedó como `sit_sit_...` | Escribiste el prefijo `sit_` en el Schema name, y Dataverse ya lo pone | El nombre no se puede cambiar: elimina la columna o tabla vacía y recréala escribiendo solo la parte después de `sit_` |
| La tabla quedó como `sit_solicitudti` en lugar de `sit_solicitud` | No cambiaste el Schema name antes de guardar | El Schema name no se puede cambiar: elimina la tabla vacía y recréala; o usa tu nombre real en los labs siguientes |
| No encuentro **Activate** en el diseñador de la regla | Las reglas no se activan desde la ventana del diseñador | Cierra el diseñador y actívala desde la lista de **Business rules** |
| El error de fecha sale incluso con la fecha llena | La condición solo comprueba Estado = Resuelta | Añade la segunda regla "Fecha Resolución no contiene datos" con AND |
| SLA Horas queda vacía | La Regla 1 está inactiva o su Scope no es Entity | Revisa que esté **Activated** y con Scope **Entity**; vuelve a guardar el registro |
| La vista de "Mis solicitudes" sale vacía | Filtraste por Solicitante (un Contact) en lugar de por Owner | Edita el filtro y usa **Owner** con "el usuario actual" |
| No puedo cambiar el ownership de la tabla | El tipo de ownership no se puede cambiar después de crear la tabla | Elimina la tabla y recréala con el ownership correcto |
| Error de privilegios al crear tablas | Tu rol no permite personalizar el ambiente | Pide el rol System Customizer o System Administrator |

---

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### Prefijo distinto de `sit_`

- **Causa probable:** creaste la tabla o columna fuera de la solución `SIT Solicitudes Internas`, y Dataverse usó el publisher predeterminado del ambiente, cuyo prefijo suele ser una combinación aleatoria (como `cr8a3`).
- **Cómo comprobar:** abre la tabla y mira **Advanced options** → **Schema name**, o la columna **Name** en la lista de **Columns**. Comprueba también que la tabla aparece en la lista de objetos de la solución.
- **Cómo corregir:** el Schema name no se puede cambiar una vez guardado. Si la tabla no tiene datos ni dependencias, elimínala y recréala desde dentro de la solución, comprobando antes que el publisher de la solución es `SIT`.
- **Reiniciar vs. reparar:** si ya tiene columnas dependientes o Business Rules, suele ser más rápido eliminar y recrear la tabla completa que migrar columna por columna.
- **Evidencia posterior a la corrección:** el Schema name de la tabla empieza por `sit_` y la tabla aparece entre los objetos de la solución.

### La tabla `Categoría` no aparece en el panel de la relación

- **Causa probable:** la tabla no terminó de guardarse, o la página no se ha refrescado desde que la creaste.
- **Cómo comprobar:** en la solución, confirma que `Categoría` aparece entre los objetos. Abre la tabla y mira si hay cambios sin guardar.
- **Cómo corregir:** guarda la tabla, espera a que termine y recarga el navegador antes de volver a crear la relación.
- **Reiniciar vs. reparar:** nunca elimines la tabla por este error: es de sincronización, no de estructura.
- **Evidencia posterior a la corrección:** `Categoría` aparece en **Related** y la relación nueva sale en **Relationships** de `Solicitud TI`.

### La Business Rule no hace nada

- **Causa probable:** está guardada pero no activada, o su Scope no es **Entity** y estás cargando datos directamente en la tabla (sin formulario).
- **Cómo comprobar:** en la lista de **Business rules**, la regla debe estar **Activated**. Ábrela y revisa el **Scope** y que cada condición y acción tenga **Apply**; **Validate** te marca lo que falte.
- **Cómo corregir:** para editar una regla activa, primero desactívala; corrige, **Validate**, **Save** y actívala de nuevo desde la lista.
- **Reiniciar vs. reparar:** repara la pieza concreta; recrea la regla solo si el diseñador queda en un estado que no responde.
- **Evidencia posterior a la corrección:** al guardar una solicitud Crítica, **SLA Horas** queda en `4`.

### No puedo cambiar el ownership de la tabla

- **Causa probable:** el tipo de ownership (User or team u Organization) se elige al crear la tabla y no se puede cambiar después.
- **Cómo comprobar:** en **Advanced options** de la tabla, **Record ownership** aparece sin poder editarse.
- **Cómo corregir:** elimina la tabla y recréala con el ownership correcto. Si ya tenía registros de prueba, vuelve a cargarlos (son pocos).
- **Reiniciar vs. reparar:** siempre reiniciar: no hay forma de repararlo sobre la misma tabla.
- **Evidencia posterior a la corrección:** `Categoría` muestra **Organization** y `Solicitud TI` muestra **User or team**.

### Error de privilegios al crear tablas

- **Causa probable:** tu rol de seguridad en ese ambiente no permite personalizarlo (por ejemplo, solo tienes "Basic User").
- **Cómo comprobar y corregir:** en Power Platform Admin Center → **Manage** → **Environments** → tu ambiente → **Settings** → **Users + permissions** → **Users** → selecciona tu usuario → **Manage security roles**, y asigna **System Customizer** o **System Administrator** (o pídeselo al administrador).
- **Reiniciar vs. reparar:** no hay nada que reiniciar: es un permiso. Reintenta cuando el rol se haya aplicado (puede tardar unos minutos).
- **Evidencia posterior a la corrección:** puedes crear una tabla de prueba sin error y el rol aparece junto a tu usuario.

---

## Checklist final

- [ ] Publisher `SIT` con prefijo `sit` (creado aquí o en el Módulo 2)
- [ ] Solución `SIT_SolicitudesInternas` con las dos tablas dentro
- [ ] Tabla `Categoría` (`sit_categoria`, Organization) con `Descripción` y `SLA Horas`
- [ ] Tabla `Solicitud TI` (`sit_solicitud`, User or team) con 9 columnas personalizadas, incluidos 3 Lookups
- [ ] Columnas Choice `Prioridad` y `Estado` con todas sus opciones y valor por defecto
- [ ] 2 Business Rules activas, con Scope Entity
- [ ] 3 vistas publicadas, ordenadas por SLA Horas o por fecha
- [ ] 5 registros de Categoría y 10 de Solicitud TI
- [ ] Business Rules probadas con el resultado esperado

---

## Evidencia esperada

- Captura de las tablas `Categoría` y `Solicitud TI` con sus columnas (y sus Schema names), dentro de la solución `SIT_SolicitudesInternas`
- Captura de la lista de Business rules con las 2 reglas activas
- Captura del diseñador de la vista `Solicitudes Abiertas del Equipo` con sus filtros y el orden por SLA Horas
- El texto del mensaje de error que viste al marcar Resuelta sin fecha
- Conteo de registros de prueba (5 Categoría, 10 Solicitud TI)

## Criterios de aprobación

- Las tablas están dentro de la solución, con prefijo `sit_` y los Schema names indicados
- Las 2 Business Rules funcionan como en la Tarea 5.3
- Las 3 vistas filtran y ordenan como se indica
- 100% de los ítems del Checklist final marcados

## Reto adicional

Si completaste el laboratorio antes del tiempo estimado, intenta:

**Reto básico:** Agrega en `Categoría` una columna **Rollup** que cuente cuántas solicitudes activas (Estado Nueva o En Proceso) tiene cada categoría. En Schema name escribe solo `solicitudesactivas` (resultado `sit_solicitudesactivas`): el Lab 09 la usa con ese nombre (si la haces aquí, allí solo la reutilizas).

**Reto intermedio:** Agrega en `Solicitud TI` la columna calculada `Días Abierta` (`sit_diasabierta`), los días desde la Fecha Solicitud, siguiendo la Tarea 1.2 del Lab 09. Úsala en una cuarta vista "Solicitudes Antiguas" con las solicitudes abiertas de más de 7 días. Si ya hiciste el Lab 09, la columna ya existe: no la recrees.

**Reto avanzado:** Crea una tercera tabla `Comentario` (en Schema name escribe solo `comentario`; resultado `sit_comentario`) con las columnas `Texto` y `Fecha`, y una relación Many-to-one hacia `Solicitud TI` (una solicitud puede tener muchos comentarios). El Lab 09 la retoma como opcional.

---

## Preguntas de repaso

1. ¿Cuál es la diferencia entre **Organization** y **User or team** ownership, y por qué hay que decidirlo al crear la tabla?
2. ¿Por qué se crean los objetos dentro de una **Solución** con Publisher propio, y qué pasa con el Schema name si no?
3. Con Scope **Entity**, ¿dónde se aplica una Business Rule y qué acciones se ignoran en el servidor?
4. ¿Por qué no se ordena una vista por la columna Choice **Prioridad**, y qué haces en su lugar?

---

## Limpieza del laboratorio

> Realiza estos pasos solo si estás usando un ambiente compartido. Si es tu ambiente del curso personal, conserva los datos: el Lab 03 los usará.

1. En el editor de filas de cada tabla (`Solicitud TI` y `Categoría`), selecciona los registros de prueba y elimínalos.
2. **No elimines las tablas ni la solución**: se necesitan en los Labs 03, 04, 05 y 09.

> **💾 Antes de cerrar la sesión, exporta tu solución.** **Solutions** > selecciona tu solución > **Export** > **Publish all changes** > **Next** > **Unmanaged** > **Export**, y guarda el `.zip` fuera del ambiente con la fecha y el número de lab en el nombre. Si tu ambiente Trial vence, ese archivo es lo que importas en el ambiente nuevo; las filas de datos, las conexiones y el historial no viajan en él ([Entornos y trials](/recursos/entornos-y-trials)).

---

## Siguiente laboratorio recomendado

➡️ **Lab 03 — Primera Canvas App: Gestión de Solicitudes**

**Por qué ir ahí:** el modelo que acabas de crear es el origen de datos de la Canvas App del Lab 03. Allí escribirás las fórmulas con los nombres visibles de este lab (`'Solicitudes TI'`, `'Título de Solicitud'`, `Estado`…).

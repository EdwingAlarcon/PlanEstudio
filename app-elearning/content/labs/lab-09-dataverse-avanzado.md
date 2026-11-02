---
id: lab-09
title: "Dataverse Avanzado — BPF, Rollup y Field Security"
level: "N2"
duration: 165
product: ["Dataverse", "Power Apps Model-Driven"]
certifications: ["PL-200 (retirado 31 ago 2026)"]
role: ["Developer", "Maker"]
prerequisites:
  - "Lab 02 completado — tablas Solicitud TI (sit_solicitud) y Categoría (sit_categoria) con datos"
  - "Lab 04 completado — app SIT Gestión Solicitudes, roles SIT y una cuenta de prueba sin System Administrator"
  - "Módulo 9 estudiado: Dataverse Avanzado"
files: []
lastVerified: "2026-11"
---

# Lab 09 — Dataverse Avanzado: Business Process Flow, Rollup y Field Security (SIT)

## Objetivo

Al finalizar este laboratorio podrás extender un modelo de datos existente con una columna calculada y una columna rollup, proteger una columna sensible con seguridad de columna (*column security profile*, antes Field Security Profile) y diseñar un Business Process Flow (BPF) que guíe el ciclo de vida de una solicitud por etapas formales, comprobando cada pieza con datos reales y con un usuario que no es administrador.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación de los Labs 02, 04 y 05

**Problema a resolver:** El modelo de datos básico del Lab 02 cubre el registro de solicitudes, pero el equipo de TI necesita:
1. **Métricas automáticas:** cuántas solicitudes activas tiene cada categoría (sin consultas manuales)
2. **Datos financieros protegidos:** el campo "costo estimado" de cada solicitud solo lo deben ver y editar Gerentes de TI — no los solicitantes ni los técnicos
3. **Proceso guiado:** los técnicos deben seguir etapas formales (Diagnóstico → Resolución → Cierre) con pasos obligatorios en cada etapa

**Por qué estas herramientas:**
- **Rollup columns:** agregan datos de los registros hijos de una relación 1:N sin DAX ni consultas adicionales. No son instantáneas: se actualizan con trabajos del sistema o con **Recalculate**.
- **Seguridad de columna:** controla quién puede leer, crear y actualizar una columna concreta, por encima del rol de seguridad de la tabla, y se aplica en todos los canales (formularios, vistas, API).
- **Business Process Flow:** barra de etapas arriba del formulario, con pasos que hay que completar antes de pasar a la etapa siguiente.

## Lo que vas a construir

- **Columna calculada** `Días Abierta` en **Solicitud TI**: días transcurridos desde la Fecha Solicitud
- **Columna rollup** `Solicitudes Activas` en **Categoría**: cuántas solicitudes Nueva o En Proceso tiene cada categoría
- **Column security profile** `FSP — Financiero TI` que protege la columna **Costo Estimado**
- **Business Process Flow** `Ciclo de Vida de Solicitud SIT` con 4 etapas y pasos obligatorios
- Los cambios en la app `SIT Gestión Solicitudes` del Lab 04 para ver todo lo anterior en acción

## Relación con el Módulo 9 y con los Labs 02 y 04

- **Es la misma solución** `SIT Solicitudes Internas` (`SIT_SolicitudesInternas`) del Lab 02 y la misma app `SIT Gestión Solicitudes` del Lab 04. No crees otra solución ni otra app.
- **El Módulo 9 ya te dio la columna de fórmula** `Vence SLA` (Power Fx). Aquí haces las otras dos columnas derivadas: una **calculada** (editor de condiciones y acciones, con funciones propias como `DIFFINDAYS`) y una **rollup**. Repasa la tabla comparativa de la Microlección 2 del Módulo 9 si dudas cuál es cuál.
- **Para probar la seguridad de columna necesitas la cuenta de prueba del Lab 04** (con el rol `SIT Técnico TI`, sin System Administrator). Learn es claro: la seguridad de columna **no se aplica a quien tiene el rol System Administrator**; tu usuario administrador siempre verá el dato. Sin cuenta de prueba puedes hacer todo lo demás y dejar la prueba de seguridad como evidencia de configuración.
- **Los nombres internos se fijan a mano**, como en el Lab 02: en **Advanced options**, el **Schema name** ya trae `sit_` delante; escribe solo la parte de después. El Módulo 13 (JavaScript) lee `sit_costoestimado` y el Lab 23 (plugin C#, Nivel Avanzado) lee `sit_costoestimado` y `sit_descripcion_solucion` con esos nombres exactos.

> **Si ya hiciste el reto básico o el intermedio del Lab 02**, ya tienes `Solicitudes Activas` (`sit_solicitudesactivas`) o `Días Abierta` (`sit_diasabierta`). No las recrees: revisa que su definición coincida con la de este lab y sigue.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Columnas calculada y rollup | 40 min |
| Ejercicio 2 — Seguridad de columna | 25 min |
| Ejercicio 3 — Business Process Flow | 45 min |
| Ejercicio 4 — Probar todo en la app | 55 min |
| **Total** | **165 min** |

> La primera vez que usas el editor de columnas calculadas y el diseñador de BPF, cuenta con más tiempo. Puedes partir el lab en dos sesiones: Ejercicios 1-2 y Ejercicios 3-4.

## Nivel

**N2 Intermedio** — Certificación objetivo: **PL-200** (retirada el 31 ago 2026; el contenido sigue siendo la base del perfil funcional)

## Tecnologías utilizadas

- Microsoft Dataverse (columnas calculadas y rollup, seguridad de columna, BPF, auditoría)
- Power Apps Model-Driven App (la app del Lab 04)
- Power Platform Admin Center (perfiles de seguridad de columna)
- make.powerapps.com

## Prerrequisitos

### Entorno

- [ ] Solución `SIT Solicitudes Internas` del Lab 02, con **Solicitud TI** (10+ registros) y **Categoría** (5 registros)
- [ ] App `SIT Gestión Solicitudes` del Lab 04 publicada, con el formulario **Information** de 3 pestañas (la pestaña Resolución se llama `tab_resolucion`)
- [ ] Rol **System Administrator** en el ambiente: Learn lo exige para configurar la seguridad de columna
- [ ] *(Para el Ejercicio 2 y la Tarea 4.3)* La cuenta de prueba del Lab 04 con el rol `SIT Técnico TI` y la app compartida con ella

### Conocimiento previo

- Módulo 9: diferencia entre columna de fórmula, calculada y rollup; seguridad de columna frente a rol de seguridad
- Lab 04: cómo se editan formularios y el diseñador de la app

> **Nombres de los botones:** la interfaz está en inglés (el ambiente del curso se crea en English (United States)). Si un botón no aparece con el nombre indicado, búscalo en la misma zona de la pantalla por lo que hace.

---

## Datos de apoyo

### Columnas nuevas de este lab

| Tabla | Display name | Schema name: escribe solo esto | Resultado | Data type | Behavior |
|---|---|---|---|---|---|
| Solicitud TI | Costo Estimado | `costoestimado` | `sit_costoestimado` | Currency | Simple |
| Solicitud TI | Días Abierta | `diasabierta` | `sit_diasabierta` | Whole number | Calculated |
| Solicitud TI | Diagnóstico | `diagnostico` | `sit_diagnostico` | Multiline Text | Simple |
| Solicitud TI | Descripción de Solución | `descripcion_solucion` | `sit_descripcion_solucion` | Multiline Text | Simple |
| Categoría | Solicitudes Activas | `solicitudesactivas` | `sit_solicitudesactivas` | Whole number | Rollup |

### Etapas del Business Process Flow

| Etapa | Nombre | Pasos (Required = obligatorio para avanzar) |
|---|---|---|
| 1 | Registro | Categoría (Required), Prioridad (Required) |
| 2 | Diagnóstico | Asignado a (Required), Diagnóstico (Required) |
| 3 | Resolución | Descripción de Solución (Required), Fecha Resolución (Required) |
| 4 | Cierre | Estado (Required), Costo Estimado (opcional) |

---

## Ejercicio 1 — Columnas calculada y rollup

> **Qué vas a hacer:** Agregar `Costo Estimado`, una columna calculada que cuenta los días que lleva abierta cada solicitud y una rollup que cuenta las solicitudes activas de cada categoría.
> **Duración:** 40 min

Todo se crea **dentro de tu solución**: [make.powerapps.com](https://make.powerapps.com) → **Solutions** → `SIT Solicitudes Internas` → **Tables** → la tabla indicada → zona **Columns**.

### Tarea 1.1 — Agregar la columna `Costo Estimado`

1. En **Solicitud TI** → **Columns** → **New column**.
2. **Display name** `Costo Estimado`, **Data type** **Currency**, **Required** **Optional**.
3. Despliega **Advanced options** → **Schema name**: escribe solo `costoestimado`. Resultado: `sit_costoestimado`.
4. **Save**.

   **Qué deberías ver:** la columna en la lista con tipo Currency. **Si el nombre quedó distinto** (por ejemplo `sit_sit_costoestimado`), el Schema name no se puede cambiar: elimina la columna vacía y créala otra vez (Lab 02, "Errores frecuentes").

### Tarea 1.2 — Columna calculada `Días Abierta`

Learn documenta así la columna calculada: se crea como una columna normal, se elige **Behavior** = **Calculated** y la fórmula se escribe en un editor aparte con dos secciones, **CONDITION** y **ACTION** ([Learn: columnas calculadas](https://learn.microsoft.com/power-apps/maker/data-platform/define-calculated-fields)).

1. En **Solicitud TI** → **Columns** → **New column**.
2. **Display name** `Días Abierta`, **Data type** **Whole number**. En **Behavior** elige **Calculated**.
3. En **Advanced options** → **Schema name**: escribe solo `diasabierta`. Resultado: `sit_diasabierta`.
4. Debajo de **Behavior** aparece el enlace **Save and edit**. Selecciónalo: la columna se guarda (todavía sin fórmula).
5. En la lista de **Columns**, abre `Días Abierta`. En el panel **Edit column**, debajo de **Behavior**, selecciona **Edit**. Se abre el editor de la columna calculada.
6. Esta columna no necesita condición: en la sección **ACTION**, selecciona **Add action** y escribe la expresión. Intellisense te propone los nombres: usa los nombres internos que te ofrece. Escribe `DIFFINDAYS` en mayúsculas (Learn escribe así las funciones de este editor) y `Now()` como lo propone Intellisense.
   ```text
   DIFFINDAYS(sit_fechasolicitud, Now())
   ```
   Confirma con la marca de verificación (✓) de la acción.

   > **DIFFINDAYS** (fecha inicial, fecha final) devuelve la diferencia en días entre dos columnas de fecha y hora; si caen el mismo día, devuelve 0. Learn exige que las dos tengan el mismo comportamiento de fecha (**User local**, **Date only** o **Time zone independent**); `Fecha Solicitud` es **Date and Time** con el comportamiento por defecto, **User local**. No hace falta tocar nada.

7. Selecciona **Save and Close**.

   **Qué deberías ver:** de vuelta en la lista, `Días Abierta` aparece como columna calculada. **Si el editor marca un error en la expresión**, revisa el nombre de la columna (debe ser exactamente `sit_fechasolicitud`, como en el Lab 02) y que `DIFFINDAYS` esté en mayúsculas.

8. Comprueba el valor en la zona de columnas y datos del hub de **Solicitud TI** (o en el editor de filas, con **Edit**). Si la columna no se ve, selecciona el contador de columnas que no se muestran (por ejemplo **+17 more**) y marca **Días Abierta** ([Learn: el hub de la tabla](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-portal#table-columns-and-data)).

   **Qué deberías ver:** cada solicitud muestra los días desde su Fecha Solicitud. Las columnas calculadas se evalúan **al leer la fila** (en formularios, vistas y gráficos): no hay que esperar a ningún trabajo del sistema. Si una solicitud no tiene Fecha Solicitud, la columna queda vacía.

> **Lo que Learn advierte de esta columna:** al usar `Now()`, la ordenación por ella está deshabilitada (no podrás ordenar una vista por `Días Abierta`); una columna simple existente no se puede convertir en calculada; y las columnas calculadas no disparan workflows ni plug-ins.

### Tarea 1.3 — Columna rollup `Solicitudes Activas` en Categoría

Esta columna contará cuántas solicitudes en estado **Nueva** o **En Proceso** tiene cada categoría. Solo funciona sobre relaciones **1:N**: aquí, una Categoría con muchas Solicitudes TI a través del Lookup `Categoría` que creaste en el Lab 02 ([Learn: columnas rollup](https://learn.microsoft.com/power-apps/maker/data-platform/define-rollup-fields)).

1. En **Categoría** → **Columns** → **New column**.
2. **Display name** `Solicitudes Activas`, **Data type** **Whole number**. En **Behavior** elige **Rollup** ([Learn: Behavior de una columna](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-field-portal)).
3. En **Advanced options** → **Schema name**: escribe solo `solicitudesactivas`. Resultado: `sit_solicitudesactivas` (los Labs 02 y 04 la llaman así).
4. Guarda la columna. Según Learn, el editor de la rollup (**ROLLUP FIELD**) se abre en una ventana emergente del navegador; si no aparece, revisa que el navegador no esté bloqueando las ventanas emergentes de make.powerapps.com ([Learn: ejercicio de rollup](https://learn.microsoft.com/training/modules/create-define-calculation-rollup-fields/5-exercise-1)). Si en tu pantalla aparece, como en la Tarea 1.2, un enlace para guardar y editar debajo de **Behavior**, úsalo; para volver a abrir la definición más tarde, abre la columna y busca debajo de **Behavior** el botón para editarla.
5. El editor tiene tres secciones. Configura:
   - **Source table** (tabla origen): `Categoría`. Deja sin usar la agregación por jerarquía.
   - **Related table** (tabla relacionada): `Solicitud TI`, a través de la relación del Lookup **Categoría**. En la lista aparece con el nombre plural de la tabla y, entre paréntesis, el Lookup (en el ejemplo de Learn, `Passengers (Cruise ID)`; aquí, algo como `Solicitudes TI (Categoría)`). Si ves dos tablas "Solicitud TI", elige la que no lleva "(M2)". Confirma con la marca de verificación (✓).
   - **Filtros de la tabla relacionada:** agrega una condición por cada estado que **no** cuenta como activo: **Estado** **Does not equal** **Resuelta**; **Estado** **Does not equal** **Cerrada**; **Estado** **Does not equal** **Aprobada**; **Estado** **Does not equal** **Rechazada**. Las cuatro deben cumplirse a la vez: si el editor te deja elegir cómo unirlas, elige **AND**. Con las seis opciones de Estado del Lab 02, eso deja exactamente Nueva y En Proceso.
   - **Aggregation:** selecciona **Add Aggregation**; en **Aggregate function** elige **COUNT** y, en **Aggregated Related Entity Field**, la entrada que lleva el nombre de la tabla relacionada (`Solicitudes TI` o `Solicitud TI`): en el ejemplo de Learn, para contar pasajeros se elige `Passengers`. Confirma con la marca de verificación (✓).
6. Selecciona **Save and Close**: se cierra el editor y vuelves a la tabla.

   **Qué deberías ver:** `Solicitudes Activas` en la lista de columnas de Categoría, como rollup. Dataverse crea además dos columnas auxiliares, `sit_solicitudesactivas_date` (cuándo se calculó por última vez) y `sit_solicitudesactivas_state` (estado del cálculo).

> **Cuándo se calcula una rollup (no esperes ver el número en el momento)**, según Learn:
> - **Mass Calculate Rollup Field:** calcula la columna en todos los registros existentes **12 horas después** de crearla o modificarla.
> - **Calculate Rollup Field:** trabajo incremental por tabla que recoge los cambios de los hijos; por defecto se repite **cada hora** como mínimo.
> - **Recalculate** en el formulario: el botón para calcularlo ya. Exige permiso de escritura sobre la Categoría. Lo usarás en la Tarea 4.4, cuando la columna esté en el formulario.
>
> Mientras tanto, la columna puede aparecer vacía en los registros existentes. No es un error.

### Resultado esperado del Ejercicio 1

**Solicitud TI** tiene `Costo Estimado` (Currency) y `Días Abierta` (calculada, con valor en el editor de filas). **Categoría** tiene `Solicitudes Activas` (rollup) con su definición guardada; su valor se comprueba en la Tarea 4.4.

### Validación del Ejercicio 1

- [ ] `sit_costoestimado` existe con tipo Currency
- [ ] `sit_diasabierta` es una columna calculada con `DIFFINDAYS(sit_fechasolicitud, Now())` y muestra días en el editor de filas
- [ ] `sit_solicitudesactivas` es una rollup sobre Solicitud TI con COUNT y los 4 filtros de Estado

---

## Ejercicio 2 — Seguridad de columna

> **Qué vas a hacer:** Proteger **Costo Estimado** para que solo lo lean y editen quienes estén en el perfil `FSP — Financiero TI`. Primero se habilita la seguridad en la columna; después se crea el perfil, se dan los permisos y se asignan usuarios o equipos ([Learn: seguridad de columna](https://learn.microsoft.com/power-platform/admin/field-level-security)).
> **Duración:** 25 min

**Lo esencial, según Learn:**
- Para configurarla necesitas el rol **System Administrator**.
- **No se aplica a usuarios con el rol System Administrator: nunca se les oculta el dato.** Para comprobar el resultado hay que usar una cuenta sin ese rol.
- Mientras la columna no tenga ningún perfil asignado, solo los System Administrator acceden a ella. Quien no está en un perfil con permiso de lectura la ve en formularios y vistas con un candado y `********`.
- Los perfiles se asignan a **usuarios** o **equipos**, no a roles de seguridad.
- No se pueden proteger columnas Lookup, columnas de fórmula ni la columna principal. Una Currency como `Costo Estimado`, sí.
- El usuario tiene que **recargar el navegador** para ver un cambio de seguridad de columna.

### Tarea 2.1 — Habilitar la seguridad en la columna

1. En tu solución → **Tables** → **Solicitud TI** → **Columns** → selecciona **Costo Estimado**.
2. Despliega **Advanced options** y, en **General**, marca **Enable column security**.
3. **Save**.

   **Qué deberías ver:** al volver a abrir la columna, **Enable column security** sigue marcada. **Si la casilla está deshabilitada**, esa columna no admite seguridad: revisa que estés en `Costo Estimado` y no en una Lookup o en `Vence SLA` (columna de fórmula).

   > Tú sigues viendo y editando el valor: eres System Administrator. Eso es lo esperado, no un fallo.

### Tarea 2.2 — Crear el perfil y darle permisos sobre la columna

1. Abre el [Power Platform admin center](https://admin.powerplatform.microsoft.com) → **Manage** → **Environments** → tu ambiente → **Settings** → **Users + permissions** → **Column security profiles**.
2. Selecciona **New Profile**:
   - **Name:** `FSP — Financiero TI`
   - **Description:** `Controla el acceso a Costo Estimado en Solicitud TI`
   - **Save**.
3. Abre el perfil y ve a la pestaña **Column Permission**. En la columna **Name**, selecciona la fila de `sit_costoestimado` (Costo Estimado) y elige **Edit**. Se abre el panel **Edit column security**.
4. Configura los cuatro permisos:

   | Permiso | Valor | Qué controla |
   |---|---|---|
   | **Read** | **Allowed** | Ver el valor |
   | **Read unmasked** | **Not Allowed** (el valor por defecto; las otras opciones son **All Records** y **One record**) | Solo importa si la columna tiene una regla de enmascaramiento; esta no la tiene |
   | **Update** | **Allowed** | Cambiar el valor |
   | **Create** | **Allowed** | Ponerlo al crear la fila |

5. **Save**.

   **Qué deberías ver:** en **Column Permission**, la fila de `sit_costoestimado` con Read, Update y Create en Allowed. **Si `sit_costoestimado` no aparece en la lista**, la Tarea 2.1 no quedó guardada: la pestaña solo muestra columnas con la seguridad habilitada.

### Tarea 2.3 — Decidir a quién se asigna

En la pestaña **Users** (o **Teams**) del perfil se asignan las personas con **+ Add Users** (o **+ Add Teams**) → elegir → **Add**.

**En este lab todavía no asignes a nadie.** La prueba de la Tarea 4.3 se hace en dos pasos: primero la cuenta de prueba **sin** el perfil (debe ver el candado) y después **con** el perfil (debe ver el valor). Asignarte a ti mismo no sirve para probar nada: como System Administrator ya lo ves todo.

> **En un proyecto real** se asigna el perfil a un **equipo** ("Gerentes TI") en lugar de a personas sueltas: cuando alguien entra o sale del equipo, su acceso a la columna cambia sin tocar el perfil.

### Tarea 2.4 — Verificar la configuración

1. **Costo Estimado** todavía no está en el formulario de la app (lo agregas en la Tarea 4.1), así que por ahora comprueba solo la configuración:
   - En make.powerapps.com, la columna tiene **Enable column security** marcada.
   - En el Admin Center, el perfil `FSP — Financiero TI` existe, con los permisos de la Tarea 2.2 y sin usuarios todavía.
2. **Escribe tu predicción** (la comprobarás en la Tarea 4.3): ¿qué verá la cuenta de prueba en **Costo Estimado** sin el perfil? ¿Y tú, como administrador?

### Validación del Ejercicio 2

- [ ] `Costo Estimado` tiene **Enable column security** marcada
- [ ] El perfil `FSP — Financiero TI` da Read, Update y Create **Allowed** sobre `sit_costoestimado`
- [ ] Anotaste tu predicción para la cuenta de prueba y para tu usuario administrador

---

## Ejercicio 3 — Business Process Flow

> **Qué vas a hacer:** Crear un BPF de 4 etapas que guíe al técnico de soporte por el ciclo de vida de una solicitud, con pasos obligatorios en cada etapa.
> **Duración:** 45 min

> **¿Y el "Proceso Solicitud TI" del Módulo 4?** Si hiciste la Práctica 4.2 del Módulo 4, ese BPF se creó en la solución del Módulo 2, sobre su tabla Solicitud TI (la que renombraste a `Solicitud TI (M2)` al empezar el Lab 02). Un BPF va unido a la tabla con la que se crea y la tabla de la primera etapa no se puede cambiar, así que **no lo puedes reutilizar** sobre la tabla del Lab 02. Crea uno nuevo, con un nombre distinto (`Ciclo de Vida de Solicitud SIT`) para no confundirlos. El del Módulo 4 se queda donde está: no lo borres ni lo edites.

> **Licencia:** para crear un BPF, Learn pide una licencia *per user* de Power Apps o Power Automate, o una de Dynamics 365 que lo incluya. Si tu ambiente no te deja crearlo, lee el ejercicio y haz el resto del lab.

### Tarea 3.1 — Agregar las columnas que usa el BPF

1. En **Solicitud TI** → **Columns** → **New column**, crea estas dos (con su **Schema name** en **Advanced options**):

   | Display name | Schema name: escribe solo esto | Resultado | Data type | Required |
   |---|---|---|---|---|
   | Diagnóstico | `diagnostico` | `sit_diagnostico` | Multiline Text | Optional |
   | Descripción de Solución | `descripcion_solucion` | `sit_descripcion_solucion` | Multiline Text | Optional |

   > Se dejan en **Optional** a propósito: quien las exige es el BPF, en su etapa. Si fueran **Business required**, el formulario las pediría desde el primer guardado.

### Tarea 3.2 — Crear el Business Process Flow

1. En tu solución, en la barra de comandos: **New** → **Automation** → **Process** → **Business process flow** ([Learn: crear un BPF](https://learn.microsoft.com/power-automate/create-business-process-flow)). Desde agosto de 2022 los BPF ya no se crean desde Power Automate fuera de una solución.
2. Completa:
   - **Display name:** `Ciclo de Vida de Solicitud SIT`
   - **Name:** se rellena solo (es el nombre interno del proceso); déjalo.
   - **Table:** **Solicitud TI** (la que no lleva "(M2)").
3. **Create**.

   **Qué deberías ver:** se abre el diseñador con una primera etapa ya creada. **Si Solicitud TI no aparece en la lista Table**, la tabla no tiene habilitados los BPF: Learn indica que se activa en la definición de la tabla con la casilla **Business process flows (fields will be created)**, y que no se puede deshacer ([Learn: tablas que admiten BPF](https://learn.microsoft.com/power-automate/business-process-flows-overview#tables-that-can-use-business-process-flows)). Búscala en las propiedades de la tabla (**Properties** → **Advanced options**).

### Tarea 3.3 — Diseñar las etapas

**Cómo funciona el diseñador (igual que en el Módulo 4):**
- **Agregar una etapa:** arrastra **Stage** desde la pestaña **Components** hasta un signo **+** del diseñador. Selecciónala, escribe su nombre en **Properties** y pulsa **Apply**. La **Category** es opcional: es la etiqueta que se ve en la barra (por ejemplo **Qualify** o **Develop**) y sirve para agrupar en informes; elige la que mejor encaje o déjala vacía.
- **Ver y agregar pasos:** selecciona **Details** (abajo a la derecha de la etapa). Arrastra el componente de paso (**Data Step**; Learn lo llama *Step*) dentro de la etapa; en **Properties**, ponle nombre, elige la columna y marca **Required** si hay que rellenarla antes de pasar a la etapa siguiente → **Apply**.

Configura las 4 etapas de "Datos de apoyo":

1. **Etapa 1 — Registro** (la que ya existe): el diseñador la crea con un nombre genérico; selecciónala, escribe `Registro` en **Properties** y **Apply**. Pasos: **Categoría** (Required) y **Prioridad** (Required). Si al abrir **Details** la etapa ya trae un paso vacío, configúralo con **Categoría** en lugar de arrastrar otro.
2. **Etapa 2 — Diagnóstico** (nueva, en el **+** después de Registro): pasos **Asignado a** (Required) y **Diagnóstico** (Required).
3. **Etapa 3 — Resolución:** pasos **Descripción de Solución** (Required) y **Fecha Resolución** (Required).
4. **Etapa 4 — Cierre:** pasos **Estado** (Required) y **Costo Estimado** (sin Required).

> **Lo que un paso Required hace y lo que no:** obliga a que la columna **tenga un valor** para avanzar de etapa; no comprueba **qué** valor. Como **Estado** siempre trae un valor (por defecto Nueva), el paso de Cierre no obliga a poner Resuelta o Cerrada. Si lo necesitaras, harías falta otra pieza (por ejemplo una Business Rule con **Show Error Message**, como en el Módulo 9). Y **Costo Estimado** va sin Required porque los técnicos no tienen el perfil de seguridad: no podrían rellenarlo y el proceso se quedaría bloqueado.

### Tarea 3.4 — Validar, activar y dar acceso

1. **Validate** (barra de comandos) y corrige lo que marque.
2. **Save**. Mientras sea un borrador, nadie puede usarlo.
3. **Activate** y confirma.
4. **Edit Security Roles** (barra de comandos del diseñador). Por defecto solo **System Administrator** y **System Customizer** ven un BPF nuevo. Abre el rol `SIT Técnico TI` y, en la pestaña **Business Process Flows**, busca `Ciclo de Vida de Solicitud SIT` y dale los privilegios **Create**, **Read** y **Write**. Learn solo dice que los privilegios se eligen con los botones de opción; en cada uno, elige el nivel de acceso más amplio que te ofrezca, para que el técnico pueda usar el proceso en todas las solicitudes → **Save**. Si tu editor de roles no tiene esa pestaña, busca el proceso por su nombre en la lista de tablas del rol.

   **Qué deberías ver:** el BPF en estado activo entre los procesos de la solución. Learn advierte que puedes tener hasta 10 BPF activos por tabla ([Learn: límites de los BPF](https://learn.microsoft.com/power-automate/business-process-flows-overview#maximum-number-of-processes-stages-and-steps)), con un máximo de 30 etapas por proceso y 30 pasos por etapa.

> **Qué registros lo muestran:** según Learn, en las filas nuevas **y en las que todavía no tienen un proceso asociado** se usa el primer BPF activo al que el usuario tiene acceso, según el orden de procesos. Así que tus 10 solicitudes del Lab 02 también lo mostrarán al abrirlas. Si la tabla tuviera más de un BPF, el orden se fija con **Order Process Flow** y el usuario puede cambiar de proceso desde el diálogo **Switch Process**.

### Validación del Ejercicio 3

- [ ] Las columnas `sit_diagnostico` y `sit_descripcion_solucion` existen en Solicitud TI
- [ ] El BPF `Ciclo de Vida de Solicitud SIT` está sobre la tabla Solicitud TI del Lab 02, tiene 4 etapas con los pasos de "Datos de apoyo" y está activo
- [ ] El rol `SIT Técnico TI` tiene acceso al BPF

---

## Ejercicio 4 — Probar todo en la app

> **Qué vas a hacer:** Poner las columnas nuevas en los formularios de la app del Lab 04 y comprobar el BPF, la seguridad de columna y la rollup con datos reales.
> **Duración:** 55 min

### Tarea 4.1 — Preparar los formularios y la app

1. **Formulario de Solicitud TI:** en tu solución → **Tables** → **Solicitud TI** → **Forms** → **Information** (Main).
   - En la pestaña General, sección `Información Básica`: arrastra **Días Abierta** debajo de **SLA Horas**.
   - En la pestaña **Resolución** (`tab_resolucion`): agrega una **1-column section** después de `Fechas`, con **Label** `Detalle de Solución`, y pon en ella **Diagnóstico**, **Descripción de Solución** y **Costo Estimado** (es la sección que el Lab 04 dejó pendiente).
   - **Save and publish**.
2. **Formulario de Categoría:** **Tables** → **Categoría** → **Forms** → **Information** (Main). Arrastra **Solicitudes Activas** a la primera sección → **Save and publish**.
3. **La app:** en la solución, selecciona la app `SIT Gestión Solicitudes` → **Edit**. En el panel izquierdo, abre **Automation**: ahí están los BPF que forman parte de la app ([Learn: diseñador de apps](https://learn.microsoft.com/power-apps/maker/model-driven-apps/app-designer-overview)). Si `Ciclo de Vida de Solicitud SIT` no aparece, agrégalo desde ese panel. **Save** → **Publish**.

   **Qué deberías ver:** en **Automation**, el BPF listado. **Si Save and publish del formulario da error**, lo habitual es una sección sin **Label**.

### Tarea 4.2 — Recorrer el BPF

1. **Play** (o recarga la pestaña de la app). En **Operación** → solicitudes, abre `Pantalla sin señal en oficina 3`.

   **Qué deberías ver:** arriba del formulario, la barra `Registro → Diagnóstico → Resolución → Cierre`, con Registro como etapa activa. **Si no aparece la barra**, revisa la Tarea 3.4 (activo y con acceso para tu rol) y la Tarea 4.1, paso 3; después recarga el navegador.
2. La etapa Registro ya está completa (la solicitud tiene Categoría y Prioridad). Pulsa **Next Stage**. Si no lo ves en la barra, selecciona la etapa activa (**Registro**) para abrir su panel desplegable (Learn lo llama *stage flyout*), donde están sus pasos y el botón ([Learn: qué hacen los BPF](https://learn.microsoft.com/power-automate/business-process-flows-overview#what-business-process-flows-can-do)). La etapa activa pasa a Diagnóstico.
3. **Prueba el bloqueo:** con **Asignado a** y **Diagnóstico** vacíos, abre el panel de la etapa **Diagnóstico** y pulsa otra vez **Next Stage**.

   **Qué deberías ver:** no te deja avanzar y te señala los pasos obligatorios pendientes. **Copia el texto exacto que ves:** es parte de tu evidencia.
4. Rellena **Asignado a** (tu usuario) y **Diagnóstico** (`Cable de video dañado`), guarda y pulsa **Next Stage**.
5. En Resolución, rellena **Descripción de Solución** (`Se reemplazó el cable HDMI`) y **Fecha Resolución** (hoy), guarda y pasa a Cierre.
6. En Cierre, cambia **Estado** a **Resuelta** y guarda. (La Regla 2 del Lab 02 no salta porque ya hay Fecha Resolución.)

### Tarea 4.3 — Probar la seguridad de columna con la cuenta de prueba

> **Sin cuenta de prueba:** guarda como evidencia las capturas de la Tarea 2.1 y 2.2 y escribe qué esperarías ver en los pasos 2 y 4. Con tu usuario administrador no se puede comprobar.

1. **Con tu usuario administrador:** abre `Licencia de Adobe vencida`, pestaña **Resolución**, y pon `1500` en **Costo Estimado**. Guarda. Tú lo ves y lo editas: eres System Administrator.
2. **Con la cuenta de prueba, sin el perfil** (ventana privada del navegador, app `SIT Gestión Solicitudes`): abre la misma solicitud, pestaña **Resolución**.

   **Qué deberías ver:** **Costo Estimado** con un candado y `********` en lugar del valor, y no puede escribir en él. Learn indica que en las vistas sale igual de protegido: si una vista suya incluye **Costo Estimado**, compruébalo también allí.
3. **Asígnale el perfil:** Admin Center → **Column security profiles** → `FSP — Financiero TI` → pestaña **Users** → **+ Add Users** → la cuenta de prueba → **Add**.
4. **Con la cuenta de prueba, recarga el navegador** y abre otra vez la solicitud.

   **Qué deberías ver:** ahora ve `1500` y puede cambiarlo. **Si sigue viendo el candado**, recarga de nuevo (Learn indica que el cambio exige recargar el navegador) y revisa que la añadiste en **Users** del perfil correcto.

### Tarea 4.4 — Recalcular la rollup

1. **Antes de mirar, predice:** en el editor de filas de **Solicitud TI**, cuenta cuántas solicitudes de **Hardware** están en **Nueva** o **En Proceso** (incluye `Teclado no responde`, si la creaste en el Lab 04). Recuerda que en la Tarea 4.2 pasaste `Pantalla sin señal en oficina 3` a Resuelta.
2. En la app, área **Administración** → **Categorías** → abre **Hardware**.
3. En **Solicitudes Activas** verás una calculadora, el valor y la hora del último cálculo (o el campo vacío, si aún no se calculó). Selecciona la calculadora y después **Recalculate**.

   **Qué deberías ver:** el número que predijiste y la hora de ahora. **Si no coincide**, revisa los filtros de la Tarea 1.3: lo habitual es haber olvidado una de las cuatro condiciones de Estado o haber elegido otra relación.
4. **Comprueba que no es instantánea:** pon en **Cerrada** una solicitud de Hardware que esté en Nueva y guarda (la Regla 2 del Lab 02 solo exige **Fecha Resolución** al pasar a **Resuelta**; **Cerrada** se guarda sin ella). Vuelve a Hardware **sin** pulsar Recalculate: el número sigue igual hasta el siguiente trabajo del sistema (por defecto, cada hora) o hasta que pulses **Recalculate**. Si ya cambió, mira la hora del último cálculo junto al valor: probablemente corrió el trabajo horario mientras tanto, y no es un fallo. Pulsa **Recalculate** y anota el valor nuevo. Al terminar, deja esa solicitud otra vez en **Nueva**.

### Tarea 4.5 — *(Opcional, 10 min)* Auditar el Costo Estimado

Si en la Microlección 4 del Módulo 9 activaste la auditoría del ambiente y de la tabla **Solicitud TI**, solo falta la columna ([Learn: auditoría de Dataverse](https://learn.microsoft.com/power-platform/admin/manage-dataverse-auditing)):

1. En tu solución → **Tables** → **Solicitud TI** → **Columns** → **Costo Estimado** → **Advanced options** → marca **Enable auditing** → **Save** → **Publish all customizations**.
2. Con tu usuario administrador, cambia el **Costo Estimado** de `Licencia de Adobe vencida` de `1500` a `1800` y guarda.
3. En el formulario, pestaña **Related** → **Audit History**.

   **Qué deberías ver:** el cambio de Costo Estimado con el valor anterior, el nuevo, el usuario y la hora. **Si no aparece**, espera unos minutos y recarga: Learn advierte que puede haber retraso. Si no hiciste la auditoría del Módulo 9, sigue primero sus pasos 1 y 2.

### Evidencia a reportar

| Campo | Tu valor |
|---|---|
| `Días Abierta` de `VPN caída para equipo remoto` y su Fecha Solicitud | ___ |
| Texto exacto que viste al intentar avanzar de Diagnóstico sin los pasos obligatorios | ___ |
| Qué vio la cuenta de prueba en Costo Estimado **sin** el perfil y **con** el perfil | ___ |
| Tu predicción de Solicitudes Activas para Hardware y el valor tras **Recalculate** | ___ |
| Valor de Hardware tras cerrar una solicitud, antes y después de **Recalculate** | ___ |

### Validación del Ejercicio 4

- [ ] El BPF aparece en el formulario de Solicitud TI y no deja avanzar de Diagnóstico sin Asignado a y Diagnóstico
- [ ] `Días Abierta` se ve en el formulario con el número correcto de días
- [ ] La cuenta de prueba ve Costo Estimado protegido sin el perfil y lo ve con el perfil (o, sin cuenta de prueba, las capturas y lo que esperarías ver)
- [ ] `Solicitudes Activas` de Hardware coincide con tu conteo tras **Recalculate**

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| No encuentro **Next Stage** | El botón está en el panel desplegable de la etapa, que no se ve hasta abrirlo | Selecciona la etapa activa en la barra del BPF para abrir su panel |
| El BPF no aparece en el formulario | No está activo, tu rol no tiene acceso o no forma parte de la app | **Activate** y **Edit Security Roles** en el diseñador; en el diseñador de la app, panel **Automation**, agrégalo; **Publish** y recarga |
| Aparece otro proceso en lugar del BPF del lab | La tabla tiene más de un BPF y otro va primero en el orden | **Order Process Flow** en el diseñador, o cambia de proceso en la solicitud con **Switch Process** |
| La rollup está vacía o no cambia | Todavía no se calculó (el primer cálculo masivo corre 12 h después de crearla; el incremental, cada hora) | Usa **Recalculate** en el formulario de la Categoría; necesitas permiso de escritura sobre ella |
| La rollup cuenta de más o de menos | Falta una condición de Estado o se eligió otra relación | Revisa la definición: relación del Lookup **Categoría** y las 4 condiciones **Does not equal** |
| No aparece **Rollup** o **Calculated** en **Behavior** | El **Data type** elegido no admite ese comportamiento | Usa **Whole number** (las rollup admiten, entre otros, Whole number, Decimal Number, Currency y fechas) |
| `DIFFINDAYS` da error en el editor | Nombre de columna mal escrito, `DIFFINDAYS` en minúsculas o fechas con comportamientos distintos | Usa `sit_fechasolicitud` (el nombre que propone Intellisense), `DIFFINDAYS` en mayúsculas y `Now()` como lo propone Intellisense; las dos fechas deben tener el mismo comportamiento |
| No puedo ordenar una vista por `Días Abierta` | La columna usa `Now()`: Learn deshabilita la ordenación en ese caso | Ordena por **Fecha Solicitud**, que da el mismo orden |
| La seguridad de columna "no funciona" | Estás probando con un System Administrator, que siempre ve el dato | Prueba con la cuenta de prueba del Lab 04 y recarga el navegador |
| `sit_costoestimado` no sale en **Column Permission** | La columna no tiene **Enable column security** guardada | Repite la Tarea 2.1 y vuelve a abrir el perfil |
| La cuenta de prueba sigue viendo el candado con el perfil asignado | No recargó el navegador o la asignaste a otro perfil | Recarga; revisa la pestaña **Users** de `FSP — Financiero TI` |

---

## Checklist final

- [ ] Columna `sit_costoestimado` (Currency) en Solicitud TI, con seguridad de columna habilitada
- [ ] Columna calculada `sit_diasabierta` con los días correctos en registros existentes
- [ ] Columna rollup `sit_solicitudesactivas` en Categoría, comprobada con **Recalculate**
- [ ] Perfil `FSP — Financiero TI` con Read, Update y Create sobre `sit_costoestimado`, probado con la cuenta de prueba
- [ ] BPF `Ciclo de Vida de Solicitud SIT` activo, con 4 etapas, con acceso para `SIT Técnico TI` y dentro de la app
- [ ] El BPF bloquea el avance sin los pasos obligatorios
- [ ] Diagnóstico, Descripción de Solución y Costo Estimado en la sección `Detalle de Solución` de `tab_resolucion`

## Evidencia esperada

- La tabla "Evidencia a reportar" del Ejercicio 4 completa
- Captura del BPF en el formulario y del mensaje al intentar avanzar sin los pasos obligatorios
- Captura de **Column Permission** del perfil y de Costo Estimado con candado (cuenta de prueba sin perfil)
- Captura de **Solicitudes Activas** de Hardware con la hora del último cálculo
- *(Si hiciste la Tarea 4.5)* Captura de la entrada de **Audit History** de Costo Estimado

## Criterios de aprobación

- El BPF no permite avanzar de etapa sin los pasos obligatorios de cada una
- Un usuario sin el perfil y sin System Administrator no puede ver ni editar `sit_costoestimado` (comprobado o justificado con la configuración)
- La rollup refleja el conteo correcto de solicitudes activas tras **Recalculate**
- 100% de los ítems del Checklist final marcados

---

## Reto adicional

**Reto básico:** Agrega una quinta etapa al BPF llamada `Evaluación` después de Cierre, con una columna Choice `Calificación del Servicio` (Schema name: escribe solo `calificacion_servicio`; opciones Malo / Regular / Bueno / Excelente) para que el solicitante evalúe el servicio. Para editar el BPF, ábrelo desde los procesos de la solución, cambia, **Validate** y **Save**.

**Reto intermedio:** Si hiciste el reto avanzado del Lab 02 (tabla `Comentario`, `sit_comentario`, con un Lookup a Solicitud TI), crea en Solicitud TI una rollup `Comentarios Total` (Schema name: escribe solo `comentarios_total`) que cuente sus comentarios. Antes de recalcular, predice el número.

**Reto avanzado:** Crea un segundo perfil `FSP — Administración` con **Read** **Allowed** y **Update** y **Create** **Not Allowed** sobre `sit_costoestimado`. Quita a la cuenta de prueba de `FSP — Financiero TI`, asígnale el nuevo, recarga y comprueba que ve el valor pero no puede cambiarlo.

---

## Preguntas de repaso

1. ¿Cuándo se actualiza una columna **calculada** y cuándo una **rollup**? ¿Por qué a la rollup hay que darle **Recalculate** para verla al momento?
2. ¿En qué se diferencia un **column security profile** de un **Security Role** en cuanto a qué controla cada uno y a quién se asigna?
3. El BPF exige **Diagnóstico** para pasar de etapa en el formulario. Si un flujo de Power Automate actualiza la solicitud sin Diagnóstico, ¿lo impide el BPF? ¿Qué pieza del Módulo 9 usarías para exigir el dato venga de donde venga?
4. ¿Puede la seguridad de columna ocultar `Costo Estimado` a un usuario con rol **System Administrator**? ¿Qué consecuencia tiene eso para cómo pruebas la configuración?

---

## Limpieza del laboratorio

> Conserva todos los artefactos: el Módulo 13 (JavaScript) lee `sit_costoestimado` y el Lab 23 (Plugins C#, Nivel Avanzado) construye sobre el mismo modelo de datos. Si diste a la cuenta de prueba el perfil `FSP — Financiero TI` solo para este lab, puedes quitarla desde la pestaña **Users** del perfil.

---

## Siguiente laboratorio recomendado

➡️ **Sigue con el Módulo 10 — Canvas Apps: Componentes y Reutilización** y el resto del Nivel Intermedio.

**Si sigues la ruta Consultor Funcional:** al cerrar el Nivel Intermedio, el **Lab 62 — Capstone Consultor Funcional** pide este lab y el Lab 04 como prerrequisitos; es un proyecto funcional (discovery, Fit-Gap, UAT y capacitación) que no exige programar.

**Más adelante, en el Nivel Avanzado:** el **Lab 23 — Plugin C#: Validación Server-Side y Auditoría Personalizada** reutiliza este modelo de datos. Las Business Rules del Lab 02 y el BPF del Lab 09 son validaciones low-code; el Lab 23 agrega lógica en el servidor escrita en C#, que no se puede saltar desde ninguna interfaz. No lo empieces ahora: necesita el Módulo 23 y conocimientos de programación.

---
id: lab-03
title: "Canvas App — Primera Aplicación de Gestión de Solicitudes"
level: "N1"
duration: "90 min"
product: ["Power Apps Canvas", "Dataverse"]
certifications: ["PL-900"]
role: ["Maker"]
prerequisites:
  - "Lab 02 completado — tablas sit_Solicitud y sit_Categoria existentes con datos de prueba"
  - "Ambiente Developer activo en make.powerapps.com"
files: []
---

# Lab 03 — Canvas App: Gestión de Solicitudes Internas (SIT)

## Objetivo

Al finalizar este laboratorio podrás construir una Canvas App de tres pantallas conectada a Dataverse, con galería de registros, búsqueda, filtros por estado, formulario de creación y pantalla de detalle/edición, usando Power Fx y navegación entre pantallas.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT) — continuación del Lab 02

**Problema a resolver:** El modelo de datos ya existe en Dataverse, pero los empleados no tienen una interfaz para crear ni consultar solicitudes — siguen usando el Excel. Se necesita una app simple que funcione en tablet en recepción y en móvil para empleados en campo.

**Por qué Canvas App:** El diseño libre de Canvas permite crear exactamente la experiencia que el equipo necesita: pantalla de lista con búsqueda, formulario de nueva solicitud y vista de detalle, sin depender de la interfaz estándar de las Model-Driven Apps.

## Lo que vas a construir

- **Pantalla Inicio (scrInicio):** galería de solicitudes con buscador y filtro por estado
- **Pantalla Nueva Solicitud (scrNueva):** formulario de creación con validación antes de guardar
- **Pantalla Detalle (scrDetalle):** vista completa del registro con opción de edición inline

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Configuración inicial y pantalla de listado | 30 min |
| Ejercicio 2 — Pantalla de nueva solicitud | 25 min |
| Ejercicio 3 — Pantalla de detalle y edición | 20 min |
| Ejercicio 4 — Pulir UX y publicar | 15 min |
| **Total** | **90 min** |

## Nivel

**N1 Básico** — Certificación objetivo: **PL-900**

## Tecnologías utilizadas

- Power Apps Canvas App
- Power Fx (fórmulas)
- Dataverse (datasource)
- Controles: Gallery, Form, TextInput, Dropdown, Button, Label, Icon

## Prerrequisitos

### Entorno

- [ ] Lab 02 completado: tablas `sit_Solicitud` y `sit_Categoria` con 10+ registros
- [ ] Acceso a [make.powerapps.com](https://make.powerapps.com)
- [ ] Ambiente **Developer** seleccionado

### Conocimiento previo

- Módulo 3 estudiado: conceptos de controles, propiedades y fórmulas básicas
- Comprender la diferencia entre `Navigate()` y `Back()`

---

## Datos de apoyo

### Convención de nombres de controles

Sigue esta convención durante todo el lab — los Labs posteriores referenciarán estos nombres.

| Prefijo | Tipo de control | Ejemplo |
|---|---|---|
| `scr` | Screen | `scrInicio` |
| `gal` | Gallery | `galSolicitudes` |
| `frm` | Form | `frmNuevaSolicitud` |
| `btn` | Button | `btnGuardar` |
| `txt` | Text Input | `txtBusqueda` |
| `drp` | Dropdown | `drpEstado` |
| `lbl` | Label | `lblContador` |
| `ico` | Icon | `icoNueva` |

### Colores de la aplicación

| Uso | Color Power Fx |
|---|---|
| Color primario (botones, encabezado) | `ColorValue("#0078D4")` (azul Microsoft) |
| Color de fondo de pantalla | `ColorValue("#F5F5F5")` |
| Color de texto principal | `ColorValue("#1A1A1A")` |
| Color de error | `ColorValue("#D13438")` |
| Color de éxito | `ColorValue("#107C10")` |

---

## Ejercicio 1 — Configuración inicial y pantalla de listado

> **Qué vas a hacer:** Crear la app en blanco, conectar el datasource de Dataverse y construir la pantalla principal con galería de solicitudes, buscador y filtro por estado.
> **Duración:** 30 min

### Tarea 1.1 — Crear la Canvas App

1. En [make.powerapps.com](https://make.powerapps.com), selecciona el ambiente **Developer**.

2. Haz clic en **+ Crear** → **Aplicación de lienzo** → **Crear desde cero**.

3. Completa:

   | Campo | Valor |
   |---|---|
   | Nombre | SIT Solicitudes Internas |
   | Formato | Teléfono (portrait) |

   > Elegimos formato Teléfono para que funcione bien en móvil y tablet. La app escala automáticamente.

4. Haz clic en **Crear**. El editor de Power Apps se abre con una pantalla en blanco.

5. En el panel izquierdo, renombra `Screen1` a `scrInicio`:
   - Clic derecho en `Screen1` en el árbol de controles → **Cambiar nombre** → `scrInicio`

6. Conectar el datasource:
   - En el panel izquierdo, haz clic en el ícono de base de datos (**Datos**)
   - **+ Agregar datos** → busca "Dataverse" → selecciona **Microsoft Dataverse**
   - En el buscador de tablas escribe `sit_` — aparecerán tus tablas
   - Selecciona **Solicitudes** (`sit_Solicitud`) y **Categorias** (`sit_Categoria`)
   - Haz clic en **Conectar**

   > Si no ves tus tablas, verifica que el ambiente correcto está seleccionado. El datasource de Dataverse siempre se conecta al ambiente activo.

### Tarea 1.2 — Construir el encabezado

1. En `scrInicio`, haz clic en la pantalla para seleccionarla y cambia su propiedad `Fill`:
   ```js
   ColorValue("#F5F5F5")
   ```

2. Inserta un **Rectángulo** (Insert → Shapes → Rectangle):
   - Renómbralo `rectHeader`
   - `X`: `0`, `Y`: `0`, `Width`: `App.Width`, `Height`: `70`
   - `Fill`: `ColorValue("#0078D4")`

3. Inserta un **Icono** (Insert → Icons → busca "Back" o usa el de tu preferencia):
   - En realidad inserta un **Label** para el título:
   - Insert → Text → **Label**, renómbralo `lblTitulo`
   - `Text`: `"📋 Solicitudes"`
   - `X`: `16`, `Y`: `15`, `Width`: `App.Width - 80`, `Height`: `40`
   - `Color`: `White`, `Size`: `18`, `FontWeight`: `FontWeight.Bold`

4. Inserta un **Button** para nueva solicitud, renómbralo `btnNueva`:
   - `Text`: `"+"`
   - `X`: `App.Width - 56`, `Y`: `15`, `Width`: `40`, `Height`: `40`
   - `Fill`: `White`, `Color`: `ColorValue("#0078D4")`
   - `OnSelect`: `Navigate(scrNueva, ScreenTransition.Cover)`

   > La pantalla `scrNueva` no existe aún — verás un error en rojo. Es normal; lo resolverás en el Ejercicio 2.

### Tarea 1.3 — Agregar buscador y filtro

1. Inserta un control **Text Input**, renómbralo `txtBusqueda`:
   - `Placeholder`: `"Buscar solicitudes..."`
   - `X`: `12`, `Y`: `80`, `Width`: `App.Width - 24`, `Height`: `44`
   - `BorderColor`: `ColorValue("#CCCCCC")`
   - `RadiusTopLeft` / `RadiusTopRight` / etc.: `8`

2. Inserta un **Dropdown**, renómbralo `drpEstado`:
   - `X`: `12`, `Y`: `134`, `Width`: `App.Width - 24`, `Height`: `40`
   - `Items`:
     ```js
     ["Todos", "Nueva", "En Proceso", "Resuelta", "Cerrada"]
     ```
   - `Default`: `"Todos"`

### Tarea 1.4 — Galería de solicitudes

1. Inserta una **Gallery** (Insert → Gallery → Vertical), renómbrala `galSolicitudes`:
   - `X`: `0`, `Y`: `184`, `Width`: `App.Width`, `Height`: `App.Height - 184`
   - `TemplateSize`: `90`

2. Configura la propiedad `Items` de la galería con la fórmula de filtrado:
   ```js
   Filter(
       Search(
           Solicitudes,
           txtBusqueda.Text,
           "sit_titulo",
           "sit_descripcion"
       ),
       drpEstado.Selected.Value = "Todos"
           || sit_estado.Label = drpEstado.Selected.Value
   )
   ```

   > **¿Por qué `sit_estado.Label`?** Las columnas de tipo Elección (Choice) en Power Fx se acceden con `.Label` para obtener el texto visible o `.Value` para el número interno. Usa siempre `.Label` para comparar con texto legible.

3. Dentro de la plantilla de la galería, agrega estos controles:
   - **Label** para título: `Text`: `ThisItem.sit_titulo`, tamaño `16`, negrita
   - **Label** para estado: `Text`: `ThisItem.sit_estado.Label`
   - **Label** para prioridad: `Text`: `"🔴 " & ThisItem.sit_prioridad.Label`
   - **Label** para fecha: `Text`: `Text(ThisItem.sit_fechasolicitud, "dd/MM/yyyy")`

4. Configura el `OnSelect` de la **galería** (no de los controles internos):
   ```js
   Navigate(scrDetalle, ScreenTransition.Cover)
   ```

   > La pantalla `scrDetalle` tampoco existe aún. El error desaparece cuando la crees en el Ejercicio 3.

5. Agrega un **Label** debajo del buscador para mostrar el contador, renómbralo `lblContador`:
   - `Text`:
     ```js
     "Mostrando " & CountRows(galSolicitudes.AllItems) & " solicitudes"
     ```
   - `X`: `12`, `Y`: `144`, tamaño `12`, color gris

   > Ajusta el `Y` del drpEstado para dejar espacio al contador, o coloca el contador donde mejor quede.

### Resultado esperado del Ejercicio 1

La pantalla `scrInicio` muestra el encabezado azul, el buscador, el dropdown de estado y la galería con los 10 registros de prueba. Al escribir en el buscador se filtran los resultados. Al cambiar el dropdown también se filtran.

### Validación del Ejercicio 1

- [ ] La galería muestra los 10 registros de `sit_Solicitud` del Lab 02
- [ ] El buscador filtra por título y descripción en tiempo real
- [ ] El dropdown de estado filtra correctamente (prueba seleccionando "Nueva" — solo deben verse las nuevas)
- [ ] El contador actualiza el número al filtrar

---

## Ejercicio 2 — Pantalla de nueva solicitud

> **Qué vas a hacer:** Crear la pantalla con formulario para que el usuario complete y envíe una nueva solicitud, con validación antes de guardar.
> **Duración:** 25 min

### Tarea 2.1 — Crear la pantalla scrNueva

1. En el árbol de controles (panel izquierdo), haz clic en **+ Agregar pantalla** → **Pantalla en blanco**.

2. Renómbrala `scrNueva`.

3. Repite el encabezado (rectángulo azul + label) con estos cambios:
   - `lblTitulo`: `Text`: `"Nueva Solicitud"`
   - En lugar del botón "+", agrega un **botón de cancelar** `btnCancelar`:
     - `Text`: `"✕"`
     - `OnSelect`: `Navigate(scrInicio, ScreenTransition.UnCover)`

### Tarea 2.2 — Formulario de creación

1. Inserta un control **Edit Form**, renómbralo `frmNueva`:
   - `DataSource`: `Solicitudes`
   - `DefaultMode`: `FormMode.New`
   - `Item`: `Defaults(Solicitudes)`
   - `X`: `0`, `Y`: `80`, `Width`: `App.Width`, `Height`: `App.Height - 160`

2. En el panel de propiedades del formulario, haz clic en **Editar campos** y agrega exactamente estos campos en este orden:
   1. `sit_titulo` (Título)
   2. `sit_descripcion` (Descripcion)
   3. `sit_categoria` (Categoria — Lookup)
   4. `sit_prioridad` (Prioridad)
   5. `sit_fechasolicitud` (Fecha Solicitud)

   > Elimina cualquier campo que no esté en esta lista si el formulario los agrega automáticamente (como Estado — queremos que sea siempre "Nueva" al crear).

3. Configura el campo `sit_fechasolicitud` para que tenga valor por defecto = hoy:
   - En el formulario, haz clic en la tarjeta de Fecha Solicitud → expande la tarjeta
   - En el control `DatePicker` interno, propiedad `DefaultDate`: `Today()`

### Tarea 2.3 — Botón Guardar con validación

1. Inserta un **Button** fuera del formulario en la parte inferior, renómbralo `btnGuardar`:
   - `Text`: `"Guardar Solicitud"`
   - `X`: `12`, `Y`: `App.Height - 70`, `Width`: `App.Width - 24`, `Height`: `50`
   - `Fill`: `ColorValue("#0078D4")`, `Color`: `White`

2. Configura la propiedad `OnSelect`:
   ```js
   If(
       IsBlank(frmNueva.LastSubmit) || frmNueva.Valid,
       SubmitForm(frmNueva),
       Notify("Completa los campos obligatorios antes de guardar.", NotificationType.Warning)
   )
   ```

3. Configura el evento `OnSuccess` del formulario `frmNueva`:
   ```js
   Notify("Solicitud creada exitosamente.", NotificationType.Success);
   Navigate(scrInicio, ScreenTransition.UnCover)
   ```

4. Configura el evento `OnFailure`:
   ```js
   Notify("Error al guardar: " & frmNueva.Error, NotificationType.Error)
   ```

### Resultado esperado del Ejercicio 2

La pantalla `scrNueva` muestra el formulario con los 5 campos. Al hacer clic en "Guardar Solicitud" con campos válidos, el registro se crea en Dataverse y la app vuelve a `scrInicio`. Si faltan campos, aparece la notificación de advertencia.

### Validación del Ejercicio 2

- [ ] El formulario muestra los 5 campos en el orden correcto
- [ ] La fecha se pre-llena con la fecha de hoy
- [ ] Al guardar con datos válidos, aparece el mensaje de éxito y se navega a scrInicio
- [ ] El nuevo registro aparece en la galería de scrInicio
- [ ] Al intentar guardar sin Título, aparece la advertencia

---

## Ejercicio 3 — Pantalla de detalle y edición

> **Qué vas a hacer:** Crear la pantalla que muestra todos los campos de la solicitud seleccionada, con botón de edición inline.
> **Duración:** 20 min

### Tarea 3.1 — Crear scrDetalle

1. Agrega una nueva pantalla en blanco, renómbrala `scrDetalle`.

2. Copia el encabezado de `scrNueva` (rectángulo + label + botón atrás) y pégalo en `scrDetalle`:
   - `lblTitulo`: `Text`: `galSolicitudes.Selected.sit_titulo`
   - `btnAtras`: `OnSelect`: `Navigate(scrInicio, ScreenTransition.Back)`

   > `galSolicitudes.Selected` es el registro que el usuario tocó en la galería. Es accesible desde cualquier pantalla mientras esté en el mismo contexto de la app.

### Tarea 3.2 — Formulario de detalle

1. Inserta un control **Edit Form**, renómbralo `frmDetalle`:
   - `DataSource`: `Solicitudes`
   - `DefaultMode`: `FormMode.View`
   - `Item`: `galSolicitudes.Selected`
   - `X`: `0`, `Y`: `80`, `Width`: `App.Width`, `Height`: `App.Height - 160`

2. Agrega los mismos campos del formulario anterior más estos adicionales:
   - `sit_estado` (Estado)
   - `sit_fecharesolucion` (Fecha Resolución)
   - `sit_asignado` (Asignado A)

### Tarea 3.3 — Botón de edición y guardado

1. Agrega una **variable de contexto** para controlar el modo del formulario. Inserta dos botones:

   - `btnEditar` — visible en modo View:
     - `Text`: `"Editar"`
     - `OnSelect`: `EditForm(frmDetalle)`
     - `Visible`: `frmDetalle.Mode = FormMode.View`

   - `btnGuardarDetalle` — visible en modo Edit:
     - `Text`: `"Guardar cambios"`
     - `OnSelect`: `SubmitForm(frmDetalle)`
     - `Visible`: `frmDetalle.Mode = FormMode.Edit`

   - `btnCancelarEdicion`:
     - `Text`: `"Cancelar"`
     - `OnSelect`: `ResetForm(frmDetalle)`
     - `Visible`: `frmDetalle.Mode = FormMode.Edit`

2. Configura el `OnSuccess` de `frmDetalle`:
   ```js
   Notify("Solicitud actualizada.", NotificationType.Success);
   ResetForm(frmDetalle)
   ```

### Resultado esperado del Ejercicio 3

Al tocar una solicitud en la galería, se abre `scrDetalle` mostrando todos los campos en modo lectura. Al tocar "Editar", los campos se vuelven editables. Al guardar, los cambios se reflejan en Dataverse y el formulario vuelve al modo vista.

### Validación del Ejercicio 3

- [ ] `scrDetalle` muestra los datos de la solicitud seleccionada en galSolicitudes
- [ ] El formulario inicia en modo View (solo lectura)
- [ ] Al presionar Editar, el formulario cambia a modo Edit
- [ ] Los cambios guardados se reflejan en la galería de scrInicio al volver

---

## Ejercicio 4 — Pulir UX y publicar

> **Qué vas a hacer:** Agregar los toques finales de experiencia de usuario y publicar la app.
> **Duración:** 15 min

### Tarea 4.1 — Indicador de prioridad con color

En la galería `galSolicitudes`, agrega un rectángulo de color en el borde izquierdo de cada ítem para indicar visualmente la prioridad:

1. Dentro de la plantilla de `galSolicitudes`, inserta un **Rectangle**, renómbralo `rectPrioridad`:
   - `X`: `0`, `Y`: `0`, `Width`: `6`, `Height`: `TemplateHeight`
   - `Fill`:
     ```js
     Switch(
         ThisItem.sit_prioridad.Label,
         "Crítica", ColorValue("#D13438"),
         "Alta",    ColorValue("#FF8C00"),
         "Media",   ColorValue("#0078D4"),
         "Baja",    ColorValue("#107C10"),
         ColorValue("#CCCCCC")
     )
     ```

### Tarea 4.2 — Separador entre filas de la galería

1. En la plantilla de la galería, agrega una línea horizontal:
   - Insert → Shapes → Line, renómbrala `lineaSeparador`
   - `X`: `0`, `Y`: `TemplateHeight - 1`, `Width`: `Parent.Width`
   - `BorderColor`: `ColorValue("#E0E0E0")`

### Tarea 4.3 — Publicar la aplicación

1. Guarda la app: `Ctrl + S` (o Archivo → Guardar).

2. Haz clic en **Publicar** (botón superior derecho o Archivo → Publicar).

3. Haz clic en **Publicar esta versión**.

4. Para compartir la app con otros usuarios:
   - Archivo → Compartir
   - Agrega los emails de los usuarios del tenant
   - Asegúrate de que tengan también permisos sobre las tablas `sit_Solicitud` y `sit_Categoria` en Dataverse (a través de Security Roles)

### Resultado esperado del Ejercicio 4

La app está publicada. Los ítems de la galería muestran la barra de color lateral según prioridad. La app es funcional y reproducible en móvil.

### Validación del Ejercicio 4

- [ ] Las solicitudes Críticas muestran barra roja, Altas naranja, Medias azul, Bajas verde
- [ ] La app está publicada y accesible desde [make.powerapps.com](https://make.powerapps.com) → Aplicaciones
- [ ] La app funciona en modo Preview (F5) sin errores en la barra de fórmulas

---

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| La galería muestra "Error de delegación" (línea azul) | La fórmula `Filter` usa una función no delegable | Usa solo operadores delegables (`=`, `<>`, `And`, `Or`). Evita `Left()`, `Mid()`, `Len()` en Filter |
| `galSolicitudes.Selected` está vacío en scrDetalle | El usuario fue a scrDetalle sin seleccionar nada en la galería | Agrega un guard: verifica que `galSolicitudes.Selected` no sea vacío antes de navegar |
| El formulario no guarda (OnSuccess no se dispara) | Campos Required del formulario están vacíos | Revisa en la barra de errores del formulario qué campos faltan |
| La columna Lookup de Categoria muestra GUID en lugar de nombre | El campo de Display del Lookup no está configurado | En las propiedades de la tarjeta del Lookup, asegúrate de usar `sit_nombre` como campo de display |
| La app no carga datos después de publicar | El usuario no tiene permisos sobre las tablas de Dataverse | El administrador debe agregar el Security Role apropiado al usuario |
| `ColorValue()` muestra error en versiones antiguas | La función requiere el formato `#RRGGBB` exacto | Usa `RGBA(0, 120, 212, 1)` como alternativa si `ColorValue()` falla |

---

## Checklist final

- [ ] La app tiene 3 pantallas: `scrInicio`, `scrNueva`, `scrDetalle`
- [ ] `scrInicio` muestra la galería con buscador y filtro por estado funcionando
- [ ] El contador de registros se actualiza al filtrar
- [ ] `scrNueva` permite crear registros y vuelve a `scrInicio` tras guardar
- [ ] `scrDetalle` muestra el registro seleccionado en modo View y permite editar
- [ ] Las solicitudes críticas tienen barra roja lateral en la galería
- [ ] La app está publicada correctamente
- [ ] No hay errores (triángulo rojo) en la barra de fórmulas

---

## Reto adicional

**Reto básico:** Agrega un **badge de conteo** en el botón "+" del encabezado de `scrInicio` que muestre cuántas solicitudes tienen prioridad **Crítica** y estado **Nueva**. Usa `CountIf()`.

**Reto intermedio:** Agrega una cuarta pantalla `scrFiltros` accesible desde `scrInicio` que permita filtrar por Categoría (Dropdown con datos de `sit_Categoria`) además del estado. Usa `UpdateContext()` para guardar los filtros y aplicarlos en `galSolicitudes`.

**Reto avanzado:** Implementa **modo oscuro** con un toggle en el encabezado. Usa una variable global `gblModoOscuro` (tipo booleano) y condiciones en los colores de fondo y texto de todos los controles. El modo se debe persistir mientras la app está abierta.

---

## Preguntas de repaso

1. ¿Cuál es la diferencia entre `Navigate(scrX, ScreenTransition.Cover)` y `Navigate(scrX, ScreenTransition.UnCover)`?
2. ¿Cuándo usarías `UpdateContext()` vs `Set()` para almacenar una variable?
3. ¿Por qué se recomienda usar `Filter()` en lugar de recorrer todos los registros con `ForAll()` para grandes volúmenes de datos?
4. ¿Qué significa la advertencia de delegación (línea azul bajo una fórmula) y cuál es su impacto en producción?

---

## Limpieza del laboratorio

> Conserva la app si vas a continuar con el Lab 05 — la integrarás con Power Automate.

Para eliminar la app si es necesario: [make.powerapps.com](https://make.powerapps.com) → **Aplicaciones** → selecciona `SIT Solicitudes Internas` → **Eliminar**.

---

## Siguiente laboratorio recomendado

➡️ **Lab 05 — Power Automate: Notificación y Aprobación de Solicitudes**

**Por qué ir ahí:** Automatizarás lo que ahora es manual: cuando se crea una solicitud desde la app del Lab 03, el solicitante recibirá confirmación automática por email y las solicitudes críticas dispararán un proceso de aprobación.

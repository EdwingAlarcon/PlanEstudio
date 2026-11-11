# Interfaz en español o en inglés: cómo seguir el curso con cualquier idioma

El curso recomienda crear tu ambiente en **English (United States)** (ver [Entornos y trials](/recursos/entornos-y-trials)),
por eso los pasos citan las etiquetas de la interfaz en inglés y en negrita: **Tables** > **New table**. Si tu tenant
o tu navegador están en español, verás **Tablas** > **Nueva tabla**. Esta página explica qué cambia con el idioma, qué
no cambia nunca, cómo cambiar el idioma y qué hacer cuando no encuentras una opción.

**No inventamos traducciones.** Las equivalencias salen de las páginas en español de Microsoft Learn (consultadas el 11
de noviembre de 2026). Ojo: parte de esa documentación es traducción automática y a veces no coincide con la pantalla;
lo dudoso está en la sección final "Sin confirmar".

## Por qué cambian las etiquetas

Los portales de Microsoft (Power Apps, Power Automate, Copilot Studio, Power Platform admin center, Power BI) muestran
menús y botones en el idioma de tu navegador o de tu perfil. Además, en Dataverse los **nombres para mostrar** de tablas
y columnas dependen del idioma del usuario y de los paquetes de idioma instalados en el ambiente. El producto es el
mismo; solo cambia el texto.

## Qué NO cambia con el idioma

- **Nombres lógicos y de esquema de Dataverse**: `account`, `contact`, `createdon`, `ownerid`, `statuscode`,
  `sit_solicitud`… son iguales en cualquier idioma. Por eso, cuando dudes, busca por el nombre lógico
  (**Advanced options** / **Opciones avanzadas** > **Schema name** / **Nombre del esquema**).
- **Funciones de Power Fx**, propiedades y enumeraciones: siempre en inglés (`Filter`, `Patch`, `Items`, `OnSelect`,
  `Color.Red`). Un control insertado con la interfaz en español se sigue llamando `Checkbox1`
  ([Learn: Global support](https://learn.microsoft.com/power-platform/power-fx/global)).
- **Expresiones de Power Automate** (`utcNow()`, `concat()`, `formatDateTime()`), **DAX** (`CALCULATE`, `SUM`) y
  **Power Query M** (`Table.SelectRows`): los nombres de función van en inglés; la referencia oficial solo los
  documenta así ([funciones de expresión](https://learn.microsoft.com/azure/logic-apps/expression-functions-reference)).
- Los **nombres de acciones de los conectores** sí se traducen en el diseñador de flujos (por ejemplo **List rows** =
  **Enumerar filas**), pero el nombre interno que ves en el código de la acción (*peek code*) no.

## Separadores en Power Fx: el error más común

Power Apps adapta los separadores de las fórmulas al idioma del autor
([Learn: Global support, "Formula separators and chaining operator"](https://learn.microsoft.com/power-platform/power-fx/global);
en español: [es-es](https://learn.microsoft.com/es-es/power-platform/power-fx/global)):

| Separador decimal de tu idioma | Decimal | Separador de lista (argumentos) | Encadenar fórmulas |
|---|---|---|---|
| Punto (inglés de EE. UU., Reino Unido, México) | `.` | `,` | `;` |
| Coma (español de España, Colombia, Argentina, Francia…) | `,` | `;` | `;;` |

El mismo ejemplo de Learn en las dos variantes:

```js
// Idioma con punto decimal (como escribe el curso)
If( Slider1.Value > 12.59, Notify( "Valid!", Success ); Navigate( "NextScreen", None ), Notify( "Invalid, try again", Error ) )

// Idioma con coma decimal
If( Slider1.Value > 12,59; Notify( "Valid!"; Success );; Navigate( "NextScreen"; None ); Notify( "Invalid, try again"; Error ) )
```

- La app se guarda en un formato independiente del idioma: si la abre alguien con otro idioma, Studio le muestra las
  fórmulas con *sus* separadores. No tienes que convertir nada al compartir.
- El punto de las propiedades (`Slider1.Value`) no cambia nunca.
- Si copias una fórmula del curso y aparece un error de sintaxis "sin motivo", cambia cada `,` entre argumentos por
  `;`, cada `;` que encadena por `;;` y el punto decimal por coma.
- En la web el idioma de Power Apps lo da el **navegador**; en la app nativa, el de Windows (*Time & language*).

**Power BI (DAX):** según tu configuración regional de Windows, Power BI Desktop puede usar `;` como separador de
argumentos. Ver la nota del [Módulo 12](/nivel/intermedio/modulo/power-bi-dax-avanzado). El nombre exacto de la opción de
Power BI Desktop que fija los separadores DAX no está en Learn (ver "Sin confirmar").

## Cómo cambiar el idioma

| Dónde | Cómo | Fuente |
|---|---|---|
| Power Apps (apps canvas en la web y Studio) | Idioma preferido del navegador | [Global support](https://learn.microsoft.com/power-platform/power-fx/global) |
| Power Automate (make.powerautomate.com) | Engranaje > **View all Power Automate Settings** > **Choose display language** y **Regional format** > **Save**. Puede tardar en aplicarse (caché) | [Approvals: change your approval language](https://learn.microsoft.com/power-automate/approve-reject-requests#change-your-approval-language) |
| Model-driven apps (tu usuario de Dataverse) | Engranaje > **Personal settings** / **Configuración personal** > pestaña **Languages** / **Idiomas** > **User Interface Language** | [Set personal options](https://learn.microsoft.com/power-apps/user/set-personal-options) |
| make.powerapps.com, admin center, Copilot Studio | Normalmente siguen el idioma del navegador o de tu perfil de Microsoft 365; Learn no lo documenta (ver "Sin confirmar") | — |

Truco práctico: para seguir un paso con las etiquetas exactas del curso, abre el portal en una ventana con el navegador
en inglés (o un perfil de navegador aparte) y vuelve a tu idioma al terminar.

## Instalar idiomas en el ambiente (paquetes de idioma)

Para que una model-driven app muestre etiquetas de Dataverse en otro idioma, el ambiente necesita el paquete de idioma
([Learn: Enable languages](https://learn.microsoft.com/power-platform/admin/enable-languages)):

1. [Power Platform admin center](https://admin.powerplatform.microsoft.com) > **Manage** / **Administrar** >
   **Environments** / **Entornos** > tu ambiente.
2. **Settings** / **Configuración** > **Product** / **Producto** > **Languages** / **Idiomas**.
3. Marca los idiomas, **Apply** / **Aplicar** y **OK**. Requiere System Administrator o System Customizer y puede
   tardar una hora o más.

- El **idioma base** del ambiente no se puede cambiar después de crearlo.
- Añade el idioma **antes** de importar una solución si quieres ver sus etiquetas traducidas.
- Luego cada usuario elige su idioma en **Personal settings** (tabla anterior).

## Las etiquetas más usadas en el curso

Las 60 etiquetas en negrita que más aparecen en módulos y labs. La app muestra estas equivalencias automáticamente
junto a cada etiqueta (diccionario completo: `app-elearning/src/data/ui-terms.ts`, 240 entradas).

**Power Apps y Dataverse** ([tablas](https://learn.microsoft.com/es-es/power-apps/maker/data-platform/create-edit-entities-portal),
[columnas](https://learn.microsoft.com/es-es/power-apps/maker/data-platform/create-edit-field-portal),
[soluciones](https://learn.microsoft.com/es-es/power-apps/maker/data-platform/create-solution),
[formularios](https://learn.microsoft.com/es-es/power-apps/maker/model-driven-apps/create-and-edit-forms))

| Inglés | Español | Inglés | Español |
|---|---|---|---|
| Save | Guardar | Tables | Tablas |
| New table | Nueva tabla | Columns | Columnas |
| New column | Nueva columna | Display name | Nombre para mostrar |
| Plural display name | Nombre para mostrar en plural | Schema name | Nombre del esquema |
| Advanced options | Opciones avanzadas | Primary column | Columna principal |
| Data type | Tipo de datos | Choice | Opción |
| Lookup | Búsqueda | Autonumber | Numeración automática |
| Whole number | Número entero | Date and time | Fecha y hora |
| Required | Obligatorio | Relationships | Relaciones |
| Solutions | Soluciones | New solution | Nueva solución |
| Add existing | Agregar existente | Publisher | Publicador |
| Publish all customizations | Publicar todas las personalizaciones | Import solution | Importar solución |
| Forms | Formularios | Views | Vistas |
| Save and publish | Guardar y publicar | Business rules | Reglas de negocio |
| Tree view | Vista de árbol | Insert | Insertar |
| Add data | Agregar datos | Record ownership | Propiedad del registro |

**Tablas y columnas de sistema de Dataverse:** Account = Cuenta, Contact = Contacto, Case = Caso, Owner = Propietario,
Status = Estado, Status Reason = Razón del estado, Created On = Creado el, Full Name = Nombre completo, Business Unit =
Unidad de negocio ([tipos de columnas](https://learn.microsoft.com/es-es/power-apps/maker/data-platform/types-of-fields)).

**Power Platform admin center** ([crear ambiente](https://learn.microsoft.com/es-es/power-platform/admin/create-environment),
[usuarios de aplicación](https://learn.microsoft.com/es-es/power-platform/admin/manage-application-users))

| Inglés | Español | Inglés | Español |
|---|---|---|---|
| Environments | Entornos | Settings | Configuración |
| Manage | Administrar | Users + permissions | Usuarios + permisos |
| Security roles | Roles de seguridad | Application users | Usuarios de aplicaciones |
| Sandbox | Espacio aislado | Production | Producción |
| Data policies | Directivas de datos | Tenant settings | Configuración del inquilino |
| System Administrator | Administrador del sistema | Business units | Unidades de negocio |

**Power Automate** ([condiciones](https://learn.microsoft.com/es-es/power-automate/use-expressions-in-conditions),
[manejo de errores](https://learn.microsoft.com/es-es/power-automate/guidance/coding-guidelines/error-handling),
[conector de Dataverse](https://learn.microsoft.com/es-es/connectors/commondataserviceforapps/))

| Inglés | Español | Inglés | Español |
|---|---|---|---|
| My flows | Mis flujos | Test | Probar |
| Condition | Condición | Apply to each | Aplicar a cada uno |
| Compose | Redactar | Terminate | Terminar |
| Run after | Ejecutar después | List rows | Enumerar filas |
| Add a new row | Agregar una fila nueva | Update a row | Actualizar una fila |
| Filter rows | Filtrar filas | Start and wait for an approval | Iniciar y esperar una aprobación |

**Copilot Studio, Power BI y Power Automate para escritorio**

| Inglés | Español | Producto |
|---|---|---|
| Topics | Temas | [Copilot Studio](https://learn.microsoft.com/es-es/microsoft-copilot-studio/authoring-create-edit-topics) |
| Authenticate with Microsoft | Autenticar con Microsoft | [Copilot Studio](https://learn.microsoft.com/es-es/microsoft-copilot-studio/configuration-end-user-authentication) |
| Get data / Navigator / Load | Obtener datos / Navegador / Cargar | [Power BI](https://learn.microsoft.com/es-es/power-bi/connect-data/desktop-quickstart-connect-to-data) |
| New measure | Nueva medida | [Power BI](https://learn.microsoft.com/es-es/power-bi/transform-model/desktop-tutorial-create-measures) |
| Set variable | Establecer variable | [PAD](https://learn.microsoft.com/es-es/power-automate/desktop-flows/errors) |
| On block error | En error del bloque | [PAD](https://learn.microsoft.com/es-es/power-automate/desktop-flows/actions-reference/flowcontrol) |
| If web page contains | Si la página web contiene | [PAD](https://learn.microsoft.com/es-es/power-automate/desktop-flows/actions-reference/webautomation) |
| Write text to file | Escribir texto en el archivo | [PAD](https://learn.microsoft.com/es-es/power-automate/desktop-flows/actions-reference/file) |

## Si no encuentras una opción

1. **Busca por posición e icono**, no por texto: el engranaje es siempre **Settings**/**Configuración**, el `+` es
   **New**/**Nuevo**, el disquete es **Save**/**Guardar**, el matraz es **Test**/**Probar**.
2. **Usa el buscador del producto**: en el diseñador de flujos y en PAD busca la acción en tu idioma; si no aparece,
   prueba la palabra en inglés (algunas acciones no están traducidas en todos los idiomas).
3. **Usa el nombre lógico** en Dataverse (`createdon`, `ownerid`): no cambia nunca.
4. **Navega por URL** cuando el menú cambió: `https://make.powerapps.com` > **Tables**, `https://admin.powerplatform.microsoft.com/environments`.
5. **Cambia temporalmente el idioma** (sección "Cómo cambiar el idioma") o abre una ventana con el navegador en inglés.
6. **Compara con la misma página de Learn en dos idiomas**: cambia `/en-us/` por `/es-es/` en la URL.

## Sin confirmar

Esto no pudo confirmarse en una fuente oficial y la app **no** lo muestra como equivalencia:

- **Etiquetas con varias traducciones en la misma página de Learn**: Currency (Moneda / Divisa), Many-to-one (Varios a
  uno / Muchos a uno), Enable quick create forms (tres variantes), Layout (Diseño), Card, Download, Start Auditing
  (Learn dice "Activar auditoría"), Trial (Prueba; Learn solo muestra variantes como "Prueba sin aplicaciones").
- **Power Automate**: Scope (Ámbito, solo en prosa), Change type, Asynchronous response; y sin equivalente localizado:
  Cloud flow, Instant, Run history, Initialize/Set variable de nube, Send an email (V2), Equals/Contains, Trigger
  conditions, Concurrency control, Dynamic content.
- **Copilot Studio**: la doc es-es mezcla inglés y español (deja Tools, Message, Escalate en inglés). Sin confirmar:
  Ask a question, Send a message, All other conditions, Trigger phrases, Redirect, Escalate, When an agent calls the
  flow, Respond to the agent, Add a tool, Knowledge, Channels, Test your agent, Create from blank.
- **Dynamics 365**: las páginas es-es de Sales y Customer Service dejan las etiquetas en inglés (Close as Won, Close as
  Lost…), así que no hay equivalencia confirmable.
- **Power BI**: Transform data, Report/Data/Model view (Learn solo dice "Informe", "Datos", "Modelo"), Close & Apply,
  X-axis/Y-axis, y el nombre de la opción de separadores DAX de Power BI Desktop (la página de Learn sobre
  configuración regional da 404; fuentes no oficiales indican File > Options and settings > Options > Regional
  settings).
- **Tablas de sistema**: Modified On ("Modificado el" en la referencia de tablas, que es traducción automática),
  Created By, Opportunity, Lead, Team, User.
- **Idioma de make.powerapps.com, admin center y Copilot Studio**: Learn no documenta si se toma del navegador o del
  perfil de Microsoft 365. Tampoco que Power Automate para escritorio use el idioma de Windows (solo foros).

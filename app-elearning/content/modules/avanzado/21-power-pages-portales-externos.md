---
moduleId: 21
title: "Power Pages — Portales Externos"
level: "avanzado"
certification: "PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"
estimatedMinutes: 25
practiceMinutes: 240
slug: "power-pages-portales-externos"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 240 min (el reto de la Web API se lleva 60-90), mejor en tres sesiones (1: Microlecciones 1 y 2; 2: Microlecciones 3 y 4; 3: reto de construcción, diagnóstico y transferencia). La primera vez, cuenta entre una vez y media y el doble.*

### 🎯 Objetivo
Construir portales web externos con Power Pages que permiten a clientes y proveedores acceder a datos de Dataverse de forma segura, con autenticación, formularios de autoservicio y búsqueda. En tu tenant construirás un sitio de autoservicio sobre la tabla **Solicitud TI** de los labs 02 a 05: el usuario que inicia sesión ve solo sus solicitudes, crea solicitudes nuevas desde un formulario y ve un resumen hecho con Liquid; al final, una acción con la Web API del portal.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato (o una pregunta en papel) y una práctica en tu ambiente con **evidencia** (el dato exacto que viste). Después harás un reto de construcción sin pasos con la Web API, diagnosticarás un fallo típico a partir del síntoma y cerrarás con un reto de transferencia a un portal de proveedores.
>
> **Antes de empezar, necesitas:**
> - Tu ambiente **DEV** (Developer, del Módulo 1) con la solución `SIT Solicitudes Internas` y la tabla **Solicitud TI** (`sit_solicitud`) del [Lab 02](/labs/lab-02-dataverse-modelo-datos), con sus Categorías de prueba. La columna **Solicitante** (`sit_solicitante`) ya es un Lookup a **Contact**: es la que conecta cada solicitud con un usuario del portal.
> - Rol **System Administrator** en DEV. Learn lo pide para crear un sitio, junto con una cuenta en modo de acceso de lectura y escritura ([Learn: crear un sitio](https://learn.microsoft.com/power-pages/getting-started/create-manage)).
> - **Por qué no usamos la tabla Caso (Case):** el Caso Real de este módulo habla de casos de soporte, pero la tabla Case (`incident`) es de Dynamics 365 Customer Service y no existe en un ambiente solo con Dataverse. El patrón es idéntico con **Solicitud TI**; el [Lab 68](/labs/lab-68-customer-service-case-to-resolution) lo lleva a Customer Service.
> - Si en tu ambiente hay restricciones de administrador para crear sitios, Learn indica que hace falta además un rol de administrador de Dynamics 365 o de Power Platform. En ese caso, pídelo o haz las microlecciones en papel.

### 📖 Conceptos Clave
Un mapa rápido; cada pieza se practica en su microlección.

- **Power Pages:** plataforma de Microsoft para construir sitios web externos (sucesor de Power Apps portals). Permite que personas de fuera de tu organización se registren, inicien sesión y trabajen con datos de Dataverse de forma controlada. El sitio se edita en el **design studio**, organizado en espacios de trabajo (**Pages**, **Styling**, **Data**, **Security**, **Set up**). Para lo que el studio no muestra se usa la app **Portal Management** (desde el studio: **...** → **Portal Management**). Los sitios nuevos usan por defecto el **modelo de datos mejorado** (enhanced data model), y en ellos la app se llama **Power Pages Management**: es la misma idea; donde este módulo diga Portal Management, abre la que te aparezca ([Learn: modelo de datos mejorado](https://learn.microsoft.com/power-pages/admin/enhanced-data-model)).
- **Contact = identidad del usuario del portal:** cada usuario que inicia sesión es un registro **Contact** de Dataverse ([Learn: autenticación](https://learn.microsoft.com/power-pages/security/authentication/)). Learn exige correos únicos: si dos contactos (incluso desactivados) tienen el mismo correo, ninguno puede autenticarse.
- **Web roles:** agrupan usuarios del sitio y reciben los permisos de tabla y de página. Son independientes de los security roles de Dataverse. Hay un rol por defecto para quien inició sesión (**Authenticated Users**) y otro para visitantes sin sesión (**Anonymous Users**); un sitio solo puede tener uno de cada. Los roles propios se crean en **Portal Management** → **Security** → **Web Roles** ([Learn: web roles](https://learn.microsoft.com/power-pages/security/create-web-roles)).
- **Table permissions:** sin ellas, formularios, listas, Liquid y la Web API **no** devuelven datos de Dataverse ([Learn: table permissions](https://learn.microsoft.com/power-pages/security/table-permissions)). Tipos de acceso: **Global** (todos los registros), **Contact** (registros relacionados con el usuario que inició sesión), **Account** (registros de la cuenta del usuario), **Self** (solo su propio Contact) y **Custom** (filtro FetchXML; preview, solo con enhanced authorization). **Parent** existe solo en Portal Management; en el studio se usan **child permissions**. Privilegios: Read, Write, Create, Delete, Append y Append to. Un permiso sin web role no tiene efecto.
- **Forms (basic forms) y multistep forms:** un **form** del sitio se crea a partir de un formulario de Dataverse y crea, edita o muestra un registro. Antes se llamaban *entity forms*; los formularios de varios pasos (antes *web forms*/advanced forms) son los **multistep forms** ([Learn: forms](https://learn.microsoft.com/power-pages/getting-started/add-form)). Learn recomienda un formulario de Dataverse propio para el portal, con menos campos.
- **Lists:** muestran registros a partir de una vista de Dataverse, con búsqueda, filtros y acciones por fila (ver, editar, borrar). Antes se llamaban *entity lists* ([Learn: lists](https://learn.microsoft.com/power-pages/getting-started/add-list)).
- **Liquid:** lenguaje de plantillas del lado del servidor (de código abierto) para generar HTML dinámico. Objetos clave: `user` (el Contact que inició sesión; `null` si no hay sesión), `page`, `request`, `website` y `entities`. Ojo: `entities` **carga un registro por su ID** (`entities.account['GUID']`); para listas de registros se usa la etiqueta `{% fetchxml %}` o `{% entityview %}` ([Learn: objetos Liquid](https://learn.microsoft.com/power-pages/configure/liquid/liquid-objects), [`fetchxml` en template tags](https://learn.microsoft.com/power-pages/configure/liquid/template-tags), [`entityview` en etiquetas de Dataverse](https://learn.microsoft.com/power-pages/configure/liquid/dataverse-liquid-tags)). Learn pide usar el filtro `escape` con datos que escribe el usuario.
- **Web API del portal:** API REST en la ruta **`/_api/`** (por ejemplo `/_api/accounts`) para crear, leer, actualizar y borrar sin recargar la página. Exige habilitar cada tabla con site settings (`Webapi/<tabla>/enabled` y `Webapi/<tabla>/fields` con la lista de columnas; el comodín `*` está obsoleto), respeta table permissions y column permissions, y **todas** las llamadas deben llevar el token CSRF `__RequestVerificationToken` ([Learn: Web API](https://learn.microsoft.com/power-pages/configure/web-api-overview)). No está pensada para integrar sistemas externos.
- **Identity providers:** un sitio nuevo trae activado el proveedor **Microsoft Entra ID** integrado (para cuentas de tu organización). Para clientes externos Learn recomienda **Microsoft Entra External ID**; Azure AD B2C dejó de venderse a clientes nuevos el 1 de mayo de 2025, y la autenticación local no se recomienda ([Learn: acceso externo](https://learn.microsoft.com/power-pages/security/external-access)). El Módulo 29 profundiza en esto.
- **Site visibility:** todo sitio nuevo es **privado**: solo lo ven los makers y los usuarios de tu organización a los que se lo compartas. Uno **público** lo puede abrir cualquiera. Los sitios de ambientes **Developer** no pueden ser públicos ([Learn: visibilidad](https://learn.microsoft.com/power-pages/security/site-visibility)).
- **Content Delivery Network (CDN) y Web Application Firewall (WAF):** ambos usan Azure Front Door y se activan desde el Power Platform Admin Center (**Power Pages sites** → tu sitio → **Performance and Protection**). La CDN sirve los archivos estáticos (imágenes, CSS, JS) desde el servidor más cercano al usuario y solo cachea páginas anónimas; **no está disponible para sitios de prueba (trial)** ([Learn: CDN](https://learn.microsoft.com/power-pages/configure/configure-cdn)). El WAF filtra ataques comunes (XSS, inclusión de archivos y otros) antes de que lleguen al sitio ([Learn: WAF](https://learn.microsoft.com/power-pages/security/web-application-firewall)).
- **Progressive Web App (PWA):** Power Pages documenta la opción de que el sitio se pueda instalar como app en dispositivos móviles ([Learn: PWA](https://learn.microsoft.com/power-pages/configure/build-progressive-web-apps)). No se practica en este módulo.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Tu sitio y quién puede entrar

**¿Qué vas a aprender?** A crear el sitio en tu ambiente DEV y a ver qué pasa en Dataverse cuando alguien inicia sesión.

**¿Por qué existe esto?** Todo lo que harás después (permisos, listas, formularios) se decide sobre el **Contact** del usuario. Si no sabes qué Contact se creó al iniciar sesión, no podrás explicar por qué alguien ve o no ve un registro.

**Pregunta en papel (2 min, sin tenant):** un cliente se registra en el portal con `ana@cliente.com`. En Dataverse ya existía un Contact "Ana Ruiz" con ese mismo correo, creado por el equipo comercial, y sus solicitudes apuntan a él. Escribe qué crees que pasa al iniciar sesión: ¿el portal usa ese Contact o crea otro? Lo comprobarás en el diagnóstico.

**Práctica real en tu entorno (25 min):**

1. Abre [Power Pages](https://make.powerpages.microsoft.com). Si es tu primera vez, Learn indica que verás **Try it for free** para una prueba gratuita. Arriba a la derecha, elige tu ambiente **DEV** (no uses el ambiente *default*: Learn advierte que es compartido por todo el tenant).
2. En la página de inicio, **Start with a template**. Elige **Blank page** o una de las plantillas **Starter layout** → **Choose this template** ([Learn](https://learn.microsoft.com/power-pages/getting-started/create-manage)).
3. Revisa el nombre (escribe `Portal Clientes SIT`) y la dirección web propuesta → **Done**. **Qué deberías ver:** el sitio en preparación durante unos minutos y luego el design studio abierto. **Si te dice que no tienes permiso para crear sitios**, revisa el rol del primer bloque; si el error menciona Azure Active Directory, Learn lo atribuye a paquetes antiguos del ambiente y remite a la página de problemas conocidos.
4. En el studio, **Security** → **Site visibility**. **Qué deberías ver:** el sitio marcado como **Private**. Déjalo así: en un ambiente Developer no puede ser público, y para este módulo no hace falta.
5. **Security** → **Identity providers**. Anota los proveedores que aparecen y cuáles están configurados. Learn indica que **Microsoft Entra ID** viene activado por defecto al crear el sitio.
6. **Preview** → **Desktop**. En el sitio, inicia sesión (**Sign in**) con tu cuenta de trabajo del tenant.
7. Vuelve al studio → **...** → **Portal Management** → **Security** → **Contacts**. Busca tu nombre. **Qué deberías ver:** un Contact con tu nombre y tu correo, creado en el momento en que iniciaste sesión. Ábrelo y mira qué web roles tiene (un sitio creado ahora usa el modelo de datos mejorado: busca la sección **Web Roles** del formulario **Portal Contact (Enhanced Form)**; si no la ves, usa la pestaña **Related** → **Web Roles**).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| URL del sitio (`https://...`) | ___ |
| **Site visibility** que muestra el studio | ___ |
| Proveedores listados en **Identity providers** y cuáles están configurados | ___ |
| Nombre, correo y fecha de creación del Contact que se creó al iniciar sesión | ___ |
| Web roles que tiene ese Contact | ___ |
| Tu respuesta en papel (antes de practicar) | ___ |

---

## 🧩 Microlección 2 — Que cada cliente vea solo sus solicitudes

**¿Qué vas a aprender?** A combinar una lista, un web role propio y un table permission de tipo **Contact** para que cada usuario vea solo las filas que le pertenecen.

**¿Por qué existe esto?** El portal está en internet. Si el permiso es **Global**, cualquiera con el rol ve todas las solicitudes de todos los clientes. Ocultar columnas o filtrar con JavaScript no protege nada: la seguridad la da el table permission en el servidor.

**Ahora haz algo — micropráctica (7 min):** antes de configurar, decide el tipo de acceso de cada requisito → **[Elegir el tipo de acceso de cada table permission](/practica/ip-pp-001-tipo-de-acceso-table-permission)**.

**Práctica real (40 min):**

1. **Datos de prueba.** En [make.powerapps.com](https://make.powerapps.com) (ambiente DEV), crea un Contact llamado `Cliente Prueba Otro` (desde **Tables** → **Contact** → **Edit**, o desde tu app). Después crea 3 filas en **Solicitud TI** (desde el editor de filas de la tabla o desde tu app del [Lab 04](/labs/lab-04-model-driven-app)), cada una con su **Categoría** (es obligatoria):
   - 2 solicitudes con **Solicitante** = **tu** Contact (el que se creó en la Microlección 1).
   - 1 solicitud con **Solicitante** = `Cliente Prueba Otro`.
2. **Web role propio:** **Portal Management** → **Security** → **Web Roles** → **New**. **Name:** `Clientes SIT`. **Website:** tu sitio. Deja **Authenticated Users Role** y **Anonymous Users Role** en **No** → **Save**. Asígnate el rol: en el rol, pestaña **Related** → **Contacts** → **Add Existing Contact** → tu Contact → **Add**. Si tu sitio usa el modelo de datos mejorado, asígnalo desde tu Contact (formulario **Portal Contact (Enhanced Form)** → sección **Web Roles** → **Add Existing Web Role**) ([Learn](https://learn.microsoft.com/power-pages/security/create-web-roles)).
3. **Página:** en el studio, **Pages** → **+ Page**. Nombre: `Mis solicitudes`. Elige una disposición en blanco y agrégala ([Learn](https://learn.microsoft.com/power-pages/getting-started/first-page)).
4. **Lista:** en una sección de la página, elige el componente **List**. **Choose a table:** **Solicitud TI**. **Select Dataverse views:** la vista pública de solicitudes activas (en un ambiente en inglés suele llamarse **Active Solicitudes TI**). **Name your list:** `Lista Mis Solicitudes`, y confirma. Si el studio te ofrece configurar permisos, déjalo para el paso 5 ([Learn](https://learn.microsoft.com/power-pages/getting-started/add-list)).
5. **Table permission:** **Security** → **Table permissions** → **New permission** ([Learn](https://learn.microsoft.com/power-pages/security/table-permissions)).
   - **Name:** `Solicitudes - mi contacto`.
   - **Table:** **Solicitud TI**.
   - **Access type:** **Contact access**.
   - **Relationship:** la relación de la columna **Solicitante** con Contact. Si ves varias y dudas, en Power Apps abre **Solicitud TI** → **Relationships** y busca la de Solicitante; anota su nombre.
   - **Privileges:** solo **Read**.
   - **Add roles:** `Clientes SIT` → **Save**.
6. **Prueba:** **Preview** → **Desktop** (Learn: la vista previa también limpia la caché del servidor). Inicia sesión y abre **Mis solicitudes**. **Qué deberías ver:** tus 2 solicitudes y **no** la de `Cliente Prueba Otro`. **Si no ves ninguna**, no cambies el permiso a Global: es exactamente el caso del diagnóstico de este módulo; anota lo que ves y sigue con la Microlección 3.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de la relación que elegiste en el table permission | ___ |
| Filas que ve tu usuario en **Mis solicitudes** (títulos) | ___ |
| ¿Aparece la solicitud de `Cliente Prueba Otro`? | ___ |
| Qué pasa si cierras sesión y abres **Mis solicitudes** | ___ |

---

## 🧩 Microlección 3 — Crear solicitudes desde el portal

**¿Qué vas a aprender?** A poner un formulario que crea una **Solicitud TI** asociada automáticamente al usuario que inició sesión, con una validación de cliente.

**¿Por qué existe esto?** Si el cliente elige a mano el **Solicitante**, puede poner a otra persona, y la solicitud dejaría de aparecerle (o aparecería en la lista de otro). El portal sabe quién inició sesión: el formulario debe rellenarlo solo.

**Práctica real (40 min):**

1. **Formulario de Dataverse para el portal.** En Power Apps, **Tables** → **Solicitud TI** → **Forms** → **New form** → **Main form** (como en el Módulo 4). Déjale solo **Título de Solicitud**, **Descripción**, **Categoría** y **Prioridad**; **sin Solicitante**. Nómbralo `Solicitud Portal` → **Save and publish**. En el studio de Power Pages, si no lo ves, usa **Sync**.
2. **Página y formulario.** **Pages** → **+ Page** → `Nueva solicitud`. Agrega el componente **Form** → crea uno nuevo ([Learn](https://learn.microsoft.com/power-pages/getting-started/add-form)):
   - **Choose a table:** **Solicitud TI**. **Select a form:** `Solicitud Portal`. **Name your copy:** `Form Nueva Solicitud`.
   - **Data:** crear un registro nuevo.
   - **On submit:** redirigir a la página **Mis solicitudes**.
3. **Permisos.** El studio te propone un table permission para el formulario con **Create** y **Append to** ya marcados: asígnale el rol `Clientes SIT` y guarda. Después abre tu permiso `Solicitudes - mi contacto` y agrégale **Create** y **Append**. Si al probar, el campo **Categoría** aparece vacío o da error, crea otro permiso sobre **Categoría** con **Global access**, **Read** y **Append to** para `Clientes SIT` (el catálogo es igual para todos).
4. **Asociar al usuario.** **Portal Management** → **Content** → **Basic Forms** → `Form Nueva Solicitud` → **Additional Settings** ([Learn: basic forms](https://learn.microsoft.com/power-pages/configure/basic-forms)):
   - **Associate Current Portal User:** **Yes**.
   - **Portal User Lookup Column:** `sit_solicitante`.
   - **Save**.
5. **Validación de cliente.** En el mismo formulario, campo **Custom JavaScript**, pega este código. Learn documenta que el botón de enviar ejecuta `entityFormClientValidate` y que cada campo del formulario tiene como ID HTML el nombre lógico de la columna ([Learn: JavaScript en formularios](https://learn.microsoft.com/power-pages/configure/add-custom-javascript)):

   ```javascript
   if (window.jQuery) {
     (function ($) {
       if (typeof (entityFormClientValidate) != 'undefined') {
         var originalValidationFunction = entityFormClientValidate;
         if (originalValidationFunction && typeof (originalValidationFunction) == "function") {
           entityFormClientValidate = function () {
             // Primero, la validación estándar del formulario (requeridos, formatos)
             if (originalValidationFunction.apply(this, arguments) === false) return false;
             var descripcion = $("#sit_descripcion").val() || ""; // ID = nombre lógico de la columna
             if (descripcion.trim().length < 50) {
               alert("La descripción debe tener al menos 50 caracteres para procesar su solicitud.");
               $("#sit_descripcion").focus();
               return false; // false detiene el envío
             }
             return true;
           };
         }
       }
     }(window.jQuery));
   }
   ```

   **Save**. Esto mejora la experiencia, pero **no es seguridad**: quien llame directamente al servidor se la salta. Una regla que deba cumplirse siempre va en Dataverse (business rule, columna requerida o plugin del Módulo 23).
6. **Prueba:** **Preview**, inicia sesión, abre **Nueva solicitud**. Primero envía con una descripción de 10 caracteres; después con una de más de 50. **Qué deberías ver:** el aviso en el primer intento; en el segundo, la redirección a **Mis solicitudes** con la solicitud nueva en la lista. En Power Apps, abre la fila: **Solicitante** debe ser tu Contact.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Permisos (privilegios) que quedaron sobre **Solicitud TI** y **Categoría** | ___ |
| Texto del aviso con la descripción corta | ___ |
| Valor de **Solicitante** de la fila creada desde el portal | ___ |
| ¿La solicitud nueva aparece en **Mis solicitudes** sin hacer nada más? | ___ |

---

## 🧩 Microlección 4 — Un resumen con Liquid y FetchXML

**¿Qué vas a aprender?** A leer datos de Dataverse en el servidor con la etiqueta `{% fetchxml %}` y mostrarlos con el objeto `user`.

**¿Por qué existe esto?** Una lista es una tabla. Si quieres un saludo, un contador o una tarjeta con las últimas solicitudes, necesitas Liquid. Y Liquid también pasa por los table permissions: no es una puerta trasera.

**Práctica real (25 min):**

1. En el studio, **Pages** → **Mis solicitudes** → **Edit code** (abre la página en Visual Studio Code for the Web; Learn lo marca como preview). Si no lo tienes disponible, usa **Portal Management** → **Content** → **Web Pages** → la página → campo **Copy** del contenido.
2. Agrega este bloque **encima** de la lista y guarda. Las etiquetas FetchXML van con cierre explícito (Learn pide no usar etiquetas autocerradas como `<attribute ... />` dentro de `{% fetchxml %}`) y el límite se pone con `count`:

   ```liquid
   {% if user %}
     <h2>Hola, {{ user.fullname | escape }}</h2>
     {% fetchxml ultimas %}
     <fetch count="5">
       <entity name="sit_solicitud">
         <attribute name="sit_descripcion"></attribute>
         <attribute name="sit_estado"></attribute>
         <attribute name="createdon"></attribute>
         <order attribute="createdon" descending="true"></order>
         <filter type="and">
           <condition attribute="sit_solicitante" operator="eq" value="{{ user.id }}"></condition>
         </filter>
       </entity>
     </fetch>
     {% endfetchxml %}
     <p>Tus últimas {{ ultimas.results.entities.size }} solicitudes:</p>
     <ul>
       {% for sol in ultimas.results.entities %}
         <li>{{ sol.createdon | date: 'yyyy-MM-dd' }} · {{ sol.sit_estado.label | escape }} · {{ sol.sit_descripcion | escape | truncate: 60 }}</li>
       {% endfor %}
     </ul>
   {% else %}
     <p><a href="{{ website.sign_in_url_substitution }}">Inicia sesión</a> para ver tus solicitudes.</p>
   {% endif %}
   ```

   - `user` es tu Contact; `user.id`, su GUID ([Learn](https://learn.microsoft.com/power-pages/configure/liquid/liquid-objects)).
   - `sol.sit_estado.label` funciona porque las columnas Choice llegan como objeto con **Label** y **Value**.
   - El filtro por `sit_solicitante` deja clara la intención, pero la seguridad la pone el table permission: sin él, la consulta no devuelve nada.
3. **Sync** en el studio y **Preview**. **Qué deberías ver:** el saludo con tu nombre y tus solicitudes más recientes. Si sale un error de Liquid, el diálogo trae un botón para abrir la línea con el error.
4. **Experimento:** quita temporalmente el rol `Clientes SIT` de tu Contact, vuelve a hacer **Preview** y anota qué muestra el bloque. Devuélvete el rol al terminar.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Texto exacto del saludo | ___ |
| Número de solicitudes que muestra el bloque | ___ |
| Qué mostró el bloque sin el rol `Clientes SIT` | ___ |
| Qué cambiaría si quitaras el `<filter>` de la consulta (respóndelo antes de probarlo) | ___ |

---

### 🏗️ Reto de construcción (sin pasos, tenant real) — "Marcar como urgente" con la Web API

> **Requerimiento:** en **Mis solicitudes**, junto a cada solicitud del bloque de Liquid, un botón **Marcar urgente** cambia su **Prioridad** a **Alta** sin recargar la página, usando la Web API del portal.
> **Criterios de aceptación:** (1) la llamada es un `PATCH` a `/_api/<EntitySetName>(<id>)`; (2) la tabla se habilita con los site settings `Webapi/sit_solicitud/enabled` y `Webapi/sit_solicitud/fields` con la lista **explícita** de columnas que usas (sin `*`, que está obsoleto); (3) un usuario solo puede marcar sus propias solicitudes: pruébalo cambiando a mano el GUID por el de la solicitud de `Cliente Prueba Otro` y anota la respuesta; (4) un error se muestra al usuario y queda en la consola, no se silencia.
> **Restricciones:** no escribas a mano el encabezado del token: usa la función envoltorio de Learn, que lo obtiene con `shell.getTokenDeferred()`. El nombre de la tabla en la URL es el **EntitySetName**, no el nombre lógico (en Power Apps: tabla → **...** → **Advanced** → **Tools** → **Copy set name**). El valor numérico de **Alta** no es universal: búscalo en tu columna, como el de `ESTADO_APROBADA` en el Módulo 13.

Referencias de Learn: [site settings y seguridad de la Web API](https://learn.microsoft.com/power-pages/configure/web-api-overview) y [operaciones de escritura con el envoltorio `webapi.safeAjax`](https://learn.microsoft.com/power-pages/configure/write-update-delete-operations). Los site settings se crean en **Portal Management** → **Site Settings** → **New** (**Name**, **Website**, **Value**). El permiso que da **Write** también cuenta: decide en cuál lo pones. Si te atoras, vuelve a la Microlección 2: la Web API usa los mismos table permissions.

**Si te bloqueas (primera pista):** el botón va **dentro** del `{% for sol in ultimas.results.entities %}` de la Microlección 4, con el ID de la fila en un atributo: `<button type="button" class="btn-urgente" data-id="{{ sol.id }}">Marcar urgente</button>` (si `sol.id` sale vacío, agrega `<attribute name="sit_solicitudid"></attribute>` al FetchXML y usa `{{ sol.sit_solicitudid }}`). La función envoltorio `webapi.safeAjax` de Learn se copia tal cual, una vez, al principio del bloque `<script>` de la página; después, en el clic del botón, lees `data-id` y llamas al envoltorio con `type: "PATCH"`.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| EntitySetName de **Solicitud TI** en tu ambiente | ___ |
| Valores de los dos site settings | ___ |
| Privilegios finales del permiso `Solicitudes - mi contacto` | ___ |
| Respuesta (código HTTP y mensaje) al intentar marcar la solicitud de `Cliente Prueba Otro` | ___ |
| Respuesta al quitar temporalmente `sit_prioridad` de `Webapi/sit_solicitud/fields` | ___ |

---

## 🔧 Diagnosticar — troubleshooting challenge

Antes de mirar la tabla de errores, resuelve este caso a partir del síntoma:

**[Diagnosticar: la lista sale vacía para un cliente que sí tiene solicitudes](/practica/ip-pp-002-lista-vacia-contacto-duplicado)**

Síntoma: Ana Ruiz inicia sesión y su lista **Mis solicitudes** sale vacía, aunque en Dataverse hay 4 solicitudes con **Solicitante** = "Ana Ruiz". El permiso es de tipo Contact, tiene **Read** y el rol está asignado. Formula tu hipótesis antes de abrir las pistas: ¿el problema está en el permiso, en la vista o en otro sitio? Vuelve a mirar tu respuesta en papel de la Microlección 1.

---

## 🔁 Reto de transferencia — Un portal para proveedores

Cambia el usuario externo y comprueba si entendiste el patrón. Un distribuidor quiere un portal para sus **proveedores**: cada persona de un proveedor ve las órdenes de compra de **su empresa** (no solo las que creó ella), actualiza los datos de **su propio** perfil y, desde una tabla de catálogo, consulta las categorías de producto, que son iguales para todos. Además, un botón confirmará la fecha de entrega de una orden sin recargar la página.

1. **Micropráctica (8 min):** **[Transferir: portal de proveedores](/practica/ip-pp-003-transferir-portal-de-proveedores)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel** (sin construirlo): completa la tabla.

**Evidencia a reportar:**

| Requisito | Tu decisión (tipo de acceso, privilegios, rol, site settings) | Cómo comprobarías que funciona |
|---|---|---|
| Órdenes de compra de su empresa | ___ | ___ |
| Su propio perfil | ___ | ___ |
| Catálogo de categorías | ___ | ___ |
| Confirmar fecha de entrega sin recargar | ___ | ___ |

### 💼 Caso Real de Negocio
**Empresa:** Empresa de servicios con 2,000 clientes activos  
**Problema:** Los clientes llamaban por teléfono para saber el estado de sus contratos y casos. 60% de las llamadas eran consultas de estado, no problemas reales.  
**Solución:** Portal Power Pages donde el cliente ve sus contratos, crea casos, descarga facturas y ve el estado en tiempo real. Integrado con Dataverse donde vive toda la información del CRM.  
**Resultado:** Llamadas de soporte reducidas en 55%. NPS (Net Promoter Score) subió de 42 a 68.

### ✅ Buenas Prácticas
- Table Permissions en "Contact" > "Global" — nunca exponer todos los registros a usuarios del portal
- Crear formularios de Dataverse específicos para el portal (menos campos, UX simplificada)
- Usar CDN y compresión de imágenes — los portales externos deben cargar en < 3 segundos
- Habilitar WAF (Web Application Firewall) en producción
- Recuerda que la CDN y el WAF se activan en sitios de producción (la CDN no está disponible para sitios trial) y que la CDN solo cachea contenido anónimo
- Un web role propio por tipo de usuario externo (cliente, proveedor) en vez de cargar todo en **Authenticated Users**
- Rellenar el Lookup al usuario desde el formulario (**Associate Current Portal User**), nunca dejar que el usuario elija a quién pertenece el registro
- Validaciones de JavaScript para la experiencia; las reglas obligatorias, en Dataverse
- Web API: lista explícita de columnas en `Webapi/<tabla>/fields`, solo para las tablas que la necesitan
- `escape` en Liquid siempre que muestres datos escritos por usuarios
- Mantener el sitio **Private** mientras está en desarrollo

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Usuario autenticado no ve sus registros | No hay table permission, el permiso no está asignado a un web role del usuario, la relación es otra o los registros apuntan a otro Contact (por ejemplo, uno duplicado que se creó al iniciar sesión) | Revisa tipo de acceso, relación y web role; compara `user.id` con el Solicitante de los registros |
| Liquid devuelve vacío con `entities.<tabla> \| where: ...` | `entities` solo carga un registro por ID; no recorre una tabla | Usa `{% fetchxml %}` o `{% entityview %}` para colecciones |
| Liquid con `{% fetchxml %}` devuelve vacío | Falta table permission de Read para el rol del usuario, o etiquetas autocerradas en el FetchXML | Revisa el permiso; escribe `<attribute ...></attribute>` con cierre explícito; muestra `{{ resultado.xml \| h }}` para ver la consulta que se ejecutó |
| La llamada a la Web API no encuentra la tabla | La URL usa `/api/data/v9.x/` (la Web API de Dataverse, no la del portal) o el nombre lógico en vez del EntitySetName | Usa `/_api/<EntitySetName>` |
| Web API rechaza la llamada (error de recurso o columna no habilitada) | Falta `Webapi/<tabla>/enabled`, la columna no está en `Webapi/<tabla>/fields` o se dejó `*` | Crea los site settings con la lista explícita de columnas |
| Web API rechaza escrituras con el permiso correcto | Falta el token CSRF `__RequestVerificationToken` | Usa el envoltorio de Learn (`webapi.safeAjax` con `shell.getTokenDeferred()`) en todas las llamadas |
| Un cambio de configuración no se ve en el sitio | Caché del servidor (Learn: hasta 15 minutos) | **Preview** desde el studio o **Sync**; en producción, evita limpiar caché en horas pico |

### 🧪 Criterios de Validación
- [ ] Creé el sitio en DEV, sé que es **Private** y anoté el Contact que se creó al iniciar sesión
- [ ] Resolví la micropráctica de tipos de acceso antes de configurar el table permission
- [ ] Usuario autenticado ve solo sus propias solicitudes (Table Permission de tipo Contact asignado a un web role propio) y no ve la de otro Contact
- [ ] El formulario del portal crea solicitudes con **Solicitante** rellenado solo (**Associate Current Portal User**) y guarda en Dataverse correctamente
- [ ] La validación JavaScript (`entityFormClientValidate`) impide enviar una descripción de menos de 50 caracteres, y sé por qué no basta como seguridad
- [ ] La página con Liquid y `{% fetchxml %}` muestra datos dinámicos del usuario logueado, y anoté qué pasa sin el web role
- [ ] Construí "Marcar urgente" con la Web API sin ver los pasos, cumpliendo los 4 criterios de aceptación, y anoté la respuesta al intentar modificar una solicitud ajena
- [ ] Diagnostiqué la lista vacía formulando una hipótesis antes de ver la causa
- [ ] En el reto de transferencia elegí tipo de acceso, privilegios y site settings para cada requisito del portal de proveedores

### 📸 Evidencia para guardar
- Las tablas de evidencia de las cuatro microlecciones, del reto de construcción y del reto de transferencia.
- Capturas: el table permission `Solicitudes - mi contacto`, la lista con tus 2 solicitudes, el aviso de la validación y la respuesta de la Web API a la solicitud ajena.

> **Siguiente paso:** el Módulo 29 lleva este mismo sitio a usuarios **externos de verdad** con Microsoft Entra External ID, y añade plantillas reutilizables y rendimiento.

---

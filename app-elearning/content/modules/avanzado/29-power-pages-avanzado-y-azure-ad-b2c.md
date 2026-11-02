---
moduleId: 29
title: "Power Pages Avanzado y Microsoft Entra External ID"
level: "avanzado"
certification: "PL-400 (cierra registro 16 oct 2026) — sucesor: AB-400"
estimatedMinutes: 25
practiceMinutes: 180
slug: "power-pages-avanzado-y-azure-ad-b2c"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 180 min, mejor en dos sesiones (1: Microlecciones 1 y 2; 2: de la Microlección 3 al final). La primera vez, cuenta entre una vez y media y el doble.*

### 🚧 Nota de vigencia: el título dice Azure AD B2C, pero para proyectos nuevos hoy se usa Microsoft Entra External ID

> **Azure AD B2C dejó de venderse a clientes nuevos el 1 de mayo de 2025.** Los clientes que ya lo tienen
> pueden seguir usándolo (incluso crear tenants y user flows nuevos, solo con el plan P1); el plan P2 se
> discontinuó el 15 de marzo de 2026, y Microsoft se compromete a dar soporte a B2C **al menos hasta mayo
> de 2030** ([Learn: FAQ de B2C](https://learn.microsoft.com/azure/active-directory-b2c/faq)).
> Para un portal nuevo, Learn recomienda **Microsoft Entra External ID**, la solución CIAM (customer identity
> and access management) que comparte la tecnología base de B2C pero es un servicio distinto, administrado
> desde el Microsoft Entra admin center ([Learn: External ID con Power Pages](https://learn.microsoft.com/power-pages/security/authentication/entra-external-id)).
> Por eso en este módulo **practicas con External ID** y estudias B2C (user flows, custom policies) como lo
> que es hoy: algo que encontrarás en portales existentes y que tendrás que mantener o migrar. El nombre del
> módulo se conserva para no romper enlaces. El Caso Real de Negocio también es anterior al fin de venta de B2C:
> la misma solución, empezada hoy, usaría External ID; el resto (Table Permissions, Liquid) no cambia.

### 🎯 Objetivo
Implementar portales externos con autenticación para clientes externos usando Microsoft Entra External ID (y entender Azure AD B2C para mantener portales que ya lo usan), flujos de registro controlado, plantillas reutilizables con Liquid, y optimización de rendimiento y SEO. En tu tenant conectarás un sitio público a un tenant externo de prueba, comprobarás qué Contact se crea con cada registro y montarás un layout reutilizable con web templates.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato (o una pregunta en papel) y una práctica en tu ambiente con **evidencia**. Después harás un reto de construcción sin pasos (registro solo por invitación), diagnosticarás un fallo de inicio de sesión a partir del síntoma y cerrarás con un reto de transferencia.
>
> **Antes de empezar, necesitas:**
> - Haber hecho el **Módulo 21**: el sitio `Portal Clientes SIT`, el web role `Clientes SIT` y el permiso `Solicitudes - mi contacto`.
> - **Un sitio que pueda ser público.** Un usuario externo no puede entrar a un sitio privado, y Learn indica que los sitios de ambientes **Developer** no pueden ser públicos. Opciones: crea el sitio en tu ambiente **Trial** `SIT-TEST` del Módulo 16 (o en otro Trial) y repite en él, en 15 minutos, la página **Mis solicitudes** y el permiso del Módulo 21. Si tu administrador bloquea los sitios públicos en ambientes que no son de producción (Learn: aparece **Access restricted** en **Site visibility**), haz la Microlección 2 en papel con las capturas de Learn.
> - Una cuenta de correo personal (Outlook.com, Gmail…) para registrarte como cliente externo, distinta de tu cuenta de trabajo.
> - Unos 20 minutos para crear un **tenant externo** de Microsoft Entra con la prueba gratuita de 30 días (no necesita suscripción de Azure).

### 📖 Conceptos Clave
Un mapa rápido; cada pieza se practica en su microlección.

- **Microsoft Entra External ID:** identidad para clientes y socios externos. Se configura en un **tenant externo** (separado del tenant de tu organización) desde el [Microsoft Entra admin center](https://entra.microsoft.com). Allí se registra la app del portal y se crea el **user flow** de registro e inicio de sesión. Es el proveedor que Learn recomienda hoy para usuarios externos de Power Pages, en lugar de la autenticación local ([Learn: acceso externo](https://learn.microsoft.com/power-pages/security/external-access)).
- **User flows (External ID):** definen cómo se registra y entra el cliente: **Email with password** o **Email one-time passcode**, y qué **User attributes** se le piden al registrarse (por ejemplo Given Name, Surname, Country/Region; con **Show more**, Job Title o Postal Code; y atributos personalizados que definas antes) ([Learn: crear un user flow](https://learn.microsoft.com/entra/external-id/customers/how-to-user-flow-sign-up-sign-in-customers)). Una app solo puede tener un user flow.
- **Azure AD B2C (para portales existentes):** servicio de identidad de clientes con su propio tenant, administrado en el Azure portal. Sus **user flows** (por ejemplo Sign up and sign in, Password reset, Profile editing) cubren los escenarios estándar por interfaz gráfica. Los nombres llevan el prefijo `B2C_1` ([Learn: B2C con Power Pages](https://learn.microsoft.com/power-pages/security/authentication/azure-ad-b2c-provider)).
- **Custom Policies e Identity Experience Framework (IEF) de B2C:** políticas XML para lo que un user flow no cubre: federar con un proveedor SAML, llamar a una API REST propia durante el registro, lógica condicional. IEF es el motor que las ejecuta; se parte del *starter pack* de Microsoft (TrustFrameworkBase, TrustFrameworkLocalization, TrustFrameworkExtensions y la política que se invoca, como SignUpOrSignin). La curva de aprendizaje y de mantenimiento es alta: en B2C se reservan para lo que el user flow no puede hacer.
- **User Flows vs Custom Policies (B2C):** User Flows cuando el escenario es estándar (registro con email, login con proveedores sociales, reset de contraseña): se configuran por GUI y Microsoft los mantiene. Custom Policies cuando hay que federar un SAML antiguo, enriquecer el perfil con una API interna o combinar proveedores con lógica de selección.
- **Claims y claims mapping:** un *claim* es un dato de identidad que llega en el token (correo, nombre, puesto…). En el proveedor del portal, **Registration claims mapping** y **Login claims mapping** copian claims a columnas del Contact con el formato `campo_logico=claim`, por ejemplo `jobtitle=jobTitle`. Solo admite columnas de texto o Sí/No, y el correo, el nombre y el apellido se mapean sin configurarlos ([Learn: B2C](https://learn.microsoft.com/power-pages/security/authentication/azure-ad-b2c-provider), [Learn: OpenID con Entra ID](https://learn.microsoft.com/power-pages/security/authentication/openid-settings)).
- **Del token al Contact:** al registrarse, el portal crea un **Contact** y un registro de **external identity** que lo vincula con el usuario del proveedor. El portal **no** reutiliza un Contact existente con el mismo correo salvo que actives **Contact mapping with email** (en B2C viene desactivado por defecto) o que el usuario llegue con una **invitación** preparada para ese Contact. Por eso, un cliente que ya existía en el CRM puede terminar con un Contact duplicado y sin ver sus registros.
- **Registro abierto, por invitación o cerrado:** en **Security** → **Identity providers** → **Authentication settings**, **Open registration** decide si cualquiera puede crearse una cuenta. Para exigir invitación, Learn indica desactivarlo y usar el site setting `Authentication/Registration/RequiresInvitation`; las invitaciones se envían a Contacts ya creados ([Learn: autenticación del sitio](https://learn.microsoft.com/power-pages/security/authentication/configure-site), [Learn: invitar contactos](https://learn.microsoft.com/power-pages/security/invite-contacts)). `Authentication/Registration/Enabled` activa o desactiva **todas** las formas de registro.
- **Web Templates:** registros que guardan código Liquid reutilizable (**Name**, **Source**, **MIME Type**), en **Portal Management** → **Content** → **Web Templates**. Se reutilizan con `{% include 'Nombre' %}` y se heredan con `{% extends 'plantilla' %}` + `{% block main %}...{% endblock %}`. Un **Page Template** de tipo web template convierte una plantilla en el layout de una página; con **Use Website Header and Footer** marcado, la plantilla solo pinta lo que va entre la cabecera y el pie ([Learn: web templates](https://learn.microsoft.com/power-pages/configure/web-templates), [etiquetas de plantilla](https://learn.microsoft.com/power-pages/configure/liquid/template-tags)).
- **Caché en Power Pages:** el servidor cachea los datos de Dataverse y la configuración del sitio; los cambios hechos desde Dataverse se ven en hasta **15 minutos**, y un cambio hecho desde el propio sitio limpia la caché de esa tabla al instante ([Learn: caché del servidor](https://learn.microsoft.com/power-pages/admin/clear-server-side-cache)). Si activas la caché de cabecera y pie, la etiqueta `{% substitution %}` excluye de la caché un fragmento que cambia por usuario. **No existe** una etiqueta Liquid `{% cache %}` en Power Pages. La CDN, aparte, cachea archivos estáticos y páginas anónimas que elijas en **Set up** → **Site performance**.
- **Sitemap (estructura de navegación):** la jerarquía de páginas padre e hija del sitio define las URLs y el menú. En el studio, una página nueva se añade por defecto a **Main navigation**; si desmarcas esa opción queda en **Other pages**, accesible por su URL pero sin enlace en el menú ([Learn: crear una página](https://learn.microsoft.com/power-pages/getting-started/first-page)).
- **Web Files:** archivos estáticos (CSS, JS, imágenes, PDFs) guardados en Dataverse y servidos por su **Partial URL** bajo una **Parent Page**: con la página de inicio como padre, `estilos.css` se sirve en `/estilos.css`. Se gestionan en **Portal Management** → **Content** → **Web Files**; el archivo se sube en la pestaña **Notes** del registro.
- **SEO:** la **Description** de cada página (en **Portal Management** → **Web Pages**, en los formularios **Information** y **Content Page**) es la meta description que leen los buscadores, y un **Web File** con Partial URL `Robots.txt` le dice a los buscadores qué indexar ([Learn: indexar el sitio](https://learn.microsoft.com/power-pages/getting-started/force-bing-index)). En Liquid, `{{ page.title | escape }}` da el título de la página.
- **Portal Web API con CSRF:** como viste en el Módulo 21, la Web API usa la ruta `/_api/` y **todas** las llamadas llevan el token `__RequestVerificationToken`; el envoltorio de Learn lo obtiene con `shell.getTokenDeferred()` ([Learn: escritura con la Web API](https://learn.microsoft.com/power-pages/configure/write-update-delete-operations)).

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Elegir el proveedor de identidad

**¿Qué vas a aprender?** A elegir cómo se identifican los usuarios externos de un portal, según quiénes son y desde cuándo existen en el CRM.

**¿Por qué existe esto?** En el Módulo 21 entraste con tu cuenta de trabajo (Microsoft Entra ID). Un cliente no tiene cuenta en tu organización. La decisión de proveedor condiciona todo lo demás: dónde viven las contraseñas, cómo se vincula el usuario con su Contact y qué tendrás que migrar dentro de unos años.

**Ahora haz algo — micropráctica (7 min):** **[Elegir el proveedor de identidad de un portal nuevo](/practica/ip-pp-004-elegir-proveedor-de-identidad)**.

**Práctica real (10 min):** en tu sitio, **Security** → **Identity providers**.

1. Anota qué proveedores aparecen (Learn: los OAuth 2.0 integrados como Microsoft, LinkedIn, Facebook, Google o Twitter; Microsoft Entra External ID; Azure AD B2C; y **+ New provider** para OpenID Connect, SAML 2.0 o WS-Federation) ([Learn](https://learn.microsoft.com/power-pages/security/authentication/configure-site)).
2. Abre **Authentication settings** y anota el valor de **External login**, **Open registration** y **Require unique email**. No cambies nada todavía.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Proveedores que aparecen y cuáles están configurados | ___ |
| Valores de **External login**, **Open registration** y **Require unique email** | ___ |
| Qué proveedor elegirías para los clientes de SIT y por qué (dos líneas) | ___ |

---

## 🧩 Microlección 2 — Conectar Microsoft Entra External ID

**¿Qué vas a aprender?** A conectar el sitio con un tenant externo y a comprobar en Dataverse qué crea cada registro.

**¿Por qué existe esto?** Es la configuración que harás en cualquier portal nuevo para clientes. Tiene tres sitios que deben coincidir exactamente (Power Pages, el registro de la app y el user flow), y cualquier diferencia rompe el inicio de sesión.

**Práctica real (60 min).** Sigue [Learn: External ID con Power Pages](https://learn.microsoft.com/power-pages/security/authentication/entra-external-id) con estos valores:

1. **Sitio público:** en el sitio del ambiente Trial, **Security** → **Site visibility** → en **This site is**, **Public**. Learn: el sitio se reinicia y tarda unos minutos. **Si aparece Access restricted**, tu administrador bloquea los sitios públicos fuera de producción: sigue en papel.
2. **Proveedor en Power Pages:** **Security** → **Identity providers** → **Microsoft Entra External ID** → **Configure**. Nombre: `Clientes SIT` (es el texto del botón de inicio de sesión) → **Next**. Copia la **Reply URL** y **deja abierta esta pestaña**.
3. **Tenant externo:** en el [Microsoft Entra admin center](https://entra.microsoft.com), crea un tenant externo con la [prueba gratuita de 30 días](https://learn.microsoft.com/entra/external-id/customers/quickstart-trial-setup). Cambia a ese tenant (**Settings** → **Directories + subscriptions**). Anota su nombre.
4. **Registro de la app:** **Applications** → **App registrations** → **New registration**. Name: `power-pages-sit`. **Redirect URI:** plataforma **Web** y la Reply URL que copiaste → **Register**. En **Authentication**, marca **Access tokens** e **ID tokens** → **Save**. En **API permissions**, **Grant admin consent**.
5. **User flow:** **External Identities** → **User flows** → **New user flow**. Name: `sit-registro`. **Email with password**. En **User attributes**, marca **Given Name**, **Surname** y **Country/Region** → **Create**. Después, en el user flow: **Applications** → **Add application** → `power-pages-sit` → **Select**.
6. **Vuelve a Power Pages** y rellena: **Client ID** (el **Application (client) ID** de **Overview**), **Authority** y **Metadata address** (los dos de **Overview** → **Endpoints**). **Redirect URL:** deja el valor por defecto (si tuvieras dominio personalizado, iría ese, igual que en el registro de la app). → **Confirm**. Learn: los cambios de autenticación pueden tardar unos minutos; para verlos de inmediato, reinicia el sitio desde el Admin Center.
7. **Prueba con un cliente nuevo:** en una ventana privada del navegador, abre el sitio → **Sign in** → **Clientes SIT** → regístrate con tu correo personal. **Qué deberías ver:** la página de registro del tenant externo, un código de verificación en tu correo y, al terminar, el sitio con la sesión iniciada.
8. **Comprueba en Dataverse:** **Portal Management** → **Security** → **Contacts**. Busca el Contact nuevo y anota qué columnas se rellenaron (nombre, apellido, correo). Asígnale el web role `Clientes SIT` y vuelve a **Mis solicitudes** con ese usuario: ¿qué ve?

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre del tenant externo | ___ |
| Reply URL de Power Pages y Redirect URI del registro de la app (¿son idénticas?) | ___ |
| Columnas del Contact nuevo que se rellenaron solas | ___ |
| Qué vio el cliente externo en **Mis solicitudes** antes y después de darle el rol | ___ |
| ¿Se creó un Contact nuevo aunque tu correo personal ya existiera en Dataverse? | ___ |

> **Para un portal con B2C que ya existe:** la configuración es análoga (**Security** → **Identity providers** → **Azure Active Directory B2C**), pero la **Authority** es la URL del emisor del user flow (debe incluir `tfp`), y se indican **Default policy ID** y, si existe, **Password reset policy ID** con el prefijo `B2C_1` ([Learn](https://learn.microsoft.com/power-pages/security/authentication/azure-ad-b2c-provider)). No crees un tenant B2C nuevo para practicar.

---

## 🧩 Microlección 3 — Un layout reutilizable con web templates

**¿Qué vas a aprender?** A sacar a una plantilla el HTML y el Liquid que se repiten en varias páginas.

**¿Por qué existe esto?** Si el panel de "sesión iniciada" está copiado en 20 páginas, cada cambio se hace 20 veces y alguna se queda atrás. Una web template se cambia una vez.

**Práctica real (35 min)** en tu sitio (vale el de DEV o el del Trial):

1. **Portal Management** → **Content** → **Web Templates** → **New**. **Name:** `SIT Panel Usuario`. **Website:** tu sitio. **Source:**

   ```liquid
   {% if user %}
     {% assign es_cliente = user | has_role: 'Clientes SIT' %}
     <aside class="sit-panel">
       <p>Sesión iniciada como {{ user.fullname | escape }}</p>
       {% if es_cliente %}
         <p>Tienes acceso a tus solicitudes de soporte.</p>
       {% else %}
         <p>Tu cuenta aún no tiene acceso a solicitudes. Escríbenos para activarla.</p>
       {% endif %}
     </aside>
   {% endif %}
   ```

   **Save**.
2. Crea otra web template, **Name:** `SIT Layout Una Columna`, con este **Source**. Hereda el layout de una columna que trae Power Pages y reemplaza su bloque `main`:

   ```liquid
   {% extends 'layout_1_column' %}
   {% block main %}
     {% include 'SIT Panel Usuario' %}
     {% include 'page_copy' %}
   {% endblock %}
   ```

   **Save**. `extends` debe ser lo primero de la plantilla; `page_copy` pinta el contenido editable de la página.
3. **Portal Management** → **Website** → **Page Templates** → **New**. **Name:** `SIT Una Columna`. **Website:** tu sitio. **Type:** **Web Template**. **Web Template:** `SIT Layout Una Columna`. Deja marcado **Use Website Header and Footer** → **Save** ([Learn](https://learn.microsoft.com/power-pages/configure/web-templates)).
4. Asigna la plantilla a dos páginas: en **Portal Management** → **Content** → **Web Pages**, abre la página y elige `SIT Una Columna` en su plantilla de página → **Save**. Hazlo con **Mis solicitudes** y con otra página.
5. **Sync** y **Preview**. **Qué deberías ver:** el panel en las dos páginas. Cambia una frase en `SIT Panel Usuario`, guarda, **Preview** otra vez y comprueba que cambió en ambas.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Páginas que usan `SIT Una Columna` | ___ |
| Texto que viste en el panel con tu usuario y con un usuario sin el rol `Clientes SIT` | ___ |
| Cuántos registros tuviste que editar para cambiar la frase en las dos páginas | ___ |

> **No uses `{% cache %}`:** versiones anteriores de este curso mostraban una etiqueta `{% cache 'nombre' timeout:3600 %}`. No existe en Power Pages. El rendimiento se consigue con la caché del servidor (automática), la CDN para estáticos y, si activas la caché de cabecera y pie, `{% substitution %}` para lo que cambia por usuario.

---

## 🧩 Microlección 4 — Rendimiento y SEO de un sitio público

**¿Qué vas a aprender?** A medir el tiempo de carga y a preparar una página pública para los buscadores.

**¿Por qué existe esto?** Un portal externo compite con cualquier web: si tarda o no aparece en los buscadores, los clientes vuelven al teléfono.

**Práctica real (20 min):**

1. **Medir:** abre la página de inicio de tu sitio público en una ventana privada (sin sesión), abre las herramientas de desarrollador del navegador (F12) y, en la pestaña de red (**Network**), recarga. Anota el tiempo total de carga y el archivo más pesado. Si tu navegador tiene Lighthouse (Chrome, Edge), ejecútalo en modo escritorio y anota la puntuación de rendimiento.
2. **Meta description:** **Portal Management** → **Content** → **Web Pages** → la página de inicio. Escribe una **Description** de una o dos frases en el formulario **Information** y también en el de **Content Page** → **Save & Close** ([Learn](https://learn.microsoft.com/power-pages/getting-started/force-bing-index)). **Preview**, abre el código fuente de la página (Ctrl+U) y busca tu texto. Anota si aparece y dentro de qué etiqueta.
3. **CDN (solo lectura):** en el [Power Platform Admin Center](https://admin.powerplatform.microsoft.com), **Resources** → **Power Pages sites** → tu sitio. Mira si aparece el interruptor **Content Delivery Network** en **Performance and Protection**. Learn: no está disponible para sitios trial; no lo actives en un sitio de práctica. Anota lo que ves.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tiempo de carga y archivo más pesado (y puntuación de Lighthouse, si la tienes) | ___ |
| ¿Aparece tu Description en el código fuente? ¿En qué etiqueta? | ___ |
| Qué muestra el Admin Center sobre la CDN para tu sitio | ___ |
| Una acción concreta que tomarías para bajar el tiempo de carga | ___ |

---

### 🏗️ Reto de construcción (sin pasos, tenant real) — Registro solo por invitación

> **Requerimiento:** SIT quiere que solo sus clientes actuales puedan crearse una cuenta. Cada cliente ya existe como Contact en Dataverse, con sus solicitudes; al registrarse con External ID debe quedar vinculado a **ese** Contact, no a uno nuevo.
> **Criterios de aceptación:** (1) un visitante sin invitación no puede crear una cuenta; (2) un cliente invitado se registra y ve en **Mis solicitudes** las solicitudes que ya tenía; (3) en Dataverse no queda un Contact duplicado para ese cliente.
> **Restricciones:** nada de JavaScript para ocultar el botón de registro: se resuelve con la configuración de autenticación y site settings. Crea el Contact de prueba (con tu correo personal de prueba **distinto** del que usaste en la Microlección 2, o borra antes el Contact y la identidad externa de esa prueba) con 2 solicitudes asignadas antes de invitarlo.

Referencias de Learn: [autenticación del sitio](https://learn.microsoft.com/power-pages/security/authentication/configure-site) (Open registration y `Authentication/Registration/RequiresInvitation`) e [invitar contactos](https://learn.microsoft.com/power-pages/security/invite-contacts). Antes de configurar, escribe qué ajuste cumple cada criterio.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Ajustes y site settings que cambiaste, con su valor | ___ |
| Qué ve un visitante sin invitación al intentar registrarse | ___ |
| Solicitudes que ve el cliente invitado tras registrarse | ___ |
| Número de Contacts con ese correo en Dataverse al terminar | ___ |

---

## 🔧 Diagnosticar — troubleshooting challenge

**[Diagnosticar: el inicio de sesión falla después de poner un dominio propio](/practica/ip-pp-005-login-falla-tras-dominio-personalizado)**

Síntoma: un portal en producción con Azure AD B2C funcionaba en `https://clientes-sit.powerappsportals.com`. El viernes se publicó con el dominio `https://portal.sit-ejemplo.com` y desde entonces, al pulsar **Sign in**, B2C muestra el error `AADB2C90006`. Antes de abrir las pistas: ¿qué dato dejó de coincidir y en cuántos sitios hay que corregirlo?

---

## 🔁 Reto de transferencia — Portal ciudadano de una municipalidad

Una municipalidad lanza un portal de trámites: cualquier ciudadano se registra con su correo, cada uno ve solo sus trámites, la página de inicio y las guías de requisitos son públicas y se consultan miles de veces al día, el sitio debe salir bien en los buscadores, y todas las páginas comparten cabecera, pie y un panel con los datos del ciudadano que inició sesión.

1. **Micropráctica (9 min):** **[Transferir: portal ciudadano con identidad, layout y rendimiento](/practica/ip-pp-006-transferir-portal-ciudadano)**.
2. **En papel** (sin construirlo): completa la tabla.

**Evidencia a reportar:**

| Requisito | Tu decisión | Cómo comprobarías que funciona |
|---|---|---|
| Registro de ciudadanos | ___ | ___ |
| Cada uno ve solo sus trámites | ___ | ___ |
| Páginas públicas muy visitadas | ___ | ___ |
| Buscadores | ___ | ___ |
| Cabecera, pie y panel del ciudadano compartidos | ___ | ___ |

### 💼 Caso Real de Negocio
**Empresa:** SaaS con clientes de 50 países distintos  
**Problema:** Necesitaban portal de autoservicio para clientes externos sin que esos usuarios tuviesen cuentas en el Azure AD corporativo.  
**Solución:** Azure AD B2C para registro/login de clientes externos. Cada cliente solo ve sus propios datos (Table Permissions). Language switcher con Liquid para soporte de ES/EN/PT.  
**Resultado:** Portal con 3,500 usuarios registrados en primer mes. 0 llamadas de soporte para "cómo inicio sesión".

### ✅ Buenas Prácticas
- B2C para usuarios externos, Azure AD para usuarios internos — nunca mezclar en el mismo portal sin MFA diferenciado
- Para un portal nuevo, Microsoft Entra External ID en lugar de B2C, y nunca la autenticación local (Learn no la recomienda)
- Web Templates reducen la duplicación de Liquid entre páginas
- Habilitar CDN en portales con usuarios globales — mejora latencia significativamente
- Probar el flujo de registro y login completo con un usuario nuevo en cada despliegue — los Identity Providers son los componentes más frágiles tras una actualización del portal
- Usar User Flows de B2C para escenarios estándar (90% de los casos) y reservar Custom Policies solo para requisitos que el User Flow no puede satisfacer — las Custom Policies tienen una curva de mantenimiento significativamente mayor
- Antes de abrir el registro, decide cómo se vinculan los clientes que ya existen en el CRM (invitaciones o **Contact mapping with email**) para no crear Contacts duplicados
- Al poner un dominio propio, actualiza la Redirect URL en Power Pages y en el registro de la app en el mismo cambio
- Mantener el sitio **Private** hasta que esté listo; los cambios en un sitio público se ven al instante

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Login con B2C muestra `AADB2C90006` (la redirect URI no está registrada para el client ID) | La Redirect URI que envía el portal no coincide exactamente con una registrada en la app de B2C (por ejemplo, tras cambiar a un dominio propio) | Registra en la app la Reply URL exacta del sitio y pon el mismo valor en **Redirect URI** del proveedor en Power Pages |
| El cliente inicia sesión pero no ve sus registros previos | El portal creó un Contact nuevo en lugar de usar el que ya existía con ese correo | Usa invitaciones para clientes existentes o activa **Contact mapping with email**; une o corrige el Contact duplicado |
| Liquid o una lista no devuelven datos después del login externo | El table permission no está asignado a un web role que tenga ese usuario | Asigna el web role al Contact (o usa el rol **Authenticated Users** si aplica a todos) |
| Un usuario externo no puede entrar al sitio | El sitio sigue siendo **Private** (solo usuarios de tu organización) | **Security** → **Site visibility** → **Public**, en un ambiente que lo permita |
| Visitantes sin invitación siguen pudiendo registrarse | **Open registration** está activado | Desactívalo y usa `Authentication/Registration/RequiresInvitation` |
| Un web template con `{% extends %}` no se aplica | `extends` no está al principio o la plantilla padre no existe con ese nombre | Pon `{% extends '...' %}` como primera línea y comprueba el nombre |
| Custom Policy de B2C no se puede subir | Se subió una política antes que la política base de la que depende | Sube en orden: TrustFrameworkBase → TrustFrameworkLocalization → TrustFrameworkExtensions → la política del relying party (SignUpOrSignin) |

### 🧪 Criterios de Validación
- [ ] Resolví la micropráctica de proveedor de identidad y sé explicar por qué un portal nuevo usa External ID y no B2C ni la autenticación local
- [ ] Usuario externo puede registrarse con email vía Microsoft Entra External ID (o, en un portal existente, vía B2C) sin cuenta en el Microsoft Entra ID corporativo, y anoté la Reply URL y la Redirect URI idénticas
- [ ] After login, usuario ve solo sus registros (Table Permissions tipo Contact) y anoté qué columnas del Contact se rellenaron solas
- [ ] Web Template base aplicado en al menos dos páginas, y un cambio en la plantilla se vio en ambas
- [ ] Medí la carga de la página pública, anoté si mi Description aparece en el código fuente y qué muestra el Admin Center sobre la CDN
- [ ] Construí el registro solo por invitación sin ver los pasos, sin Contacts duplicados
- [ ] Diagnostiqué el error `AADB2C90006` formulando una hipótesis antes de ver la causa
- [ ] En el reto de transferencia decidí identidad, permisos, rendimiento, SEO y layout del portal ciudadano

### 📸 Evidencia para guardar
- Las tablas de evidencia de las cuatro microlecciones, del reto de construcción y del reto de transferencia.
- Capturas: la configuración del proveedor en Power Pages (sin el client secret si lo hubiera), el user flow con su app, el Contact creado por el registro externo y el panel del web template en dos páginas.

### 🧭 Alternativa vigente para proyectos nuevos: Microsoft Entra External ID

Si estás diseñando la identidad de clientes de un portal nuevo (no migrando uno existente),
usa **Microsoft Entra External ID**, como en la Microlección 2: es la ruta recomendada por Microsoft
desde que B2C dejó de venderse a clientes nuevos (1 de mayo de 2025) y sigue el mismo patrón conceptual
(user flows de registro e inicio de sesión, tokens con claims) que viste con B2C. Para un despliegue de B2C
existente no hay prisa por migrar: Microsoft lo soporta al menos hasta mayo de 2030 y anunciará los planes
de migración; mientras tanto, planifica la migración con tiempo en lugar de abrir proyectos nuevos sobre B2C.

---

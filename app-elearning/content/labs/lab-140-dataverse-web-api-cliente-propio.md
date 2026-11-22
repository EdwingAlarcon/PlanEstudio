---
id: lab-140
title: "Dataverse Web API con un cliente propio: identidad, token, CRUD, errores y pruebas"
level: "N5"
duration: 240
product: ["Dataverse Web API", "Microsoft Entra ID", "PowerShell", "OAuth 2.0"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Solution Architect"]
prerequisites:
  - "Módulo 53 estudiado (Dataverse Web API, Dynamics 365 y autenticación) y Lab 54 hecho en papel"
  - "Lab 132 recomendado: la tabla Proveedor con su clave alternativa ID de proveedor (si no, crea una tabla equivalente)"
  - "Un ambiente con Dataverse (el del curso) y permiso para crear un registro de aplicación en Microsoft Entra ID y un usuario de aplicación en el ambiente"
files: []
lastVerified: "2026-11"
optional: true
---

# Lab 140 — Dataverse Web API con un cliente propio

## Objetivo

Hacer **de punta a punta** lo que el Lab 54 solo diseña: crear una **identidad de aplicación**, obtener un **token real**, **leer y escribir** en Dataverse desde un script tuyo, **clasificar y reintentar** los errores, **probar** el cliente con comprobaciones automáticas y dejarlo listo para correr **sin tu sesión**. Al terminar tendrás un cliente pequeño, con secretos fuera del código y con pruebas, contra una API real.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT). El sistema de facturación del proveedor necesita **crear y actualizar proveedores** en Dataverse sin que ninguna persona inicie sesión. Seguridad pone dos condiciones: la integración usa una **identidad propia con permisos mínimos** (nunca la cuenta de un empleado) y el secreto **no vive en el código**. Tu trabajo es construir y probar ese cliente.

## Lo que vas a construir

- Un **registro de aplicación**, un **secreto** y un **usuario de aplicación** con un rol de seguridad mínimo
- Un script `Cliente-Dataverse.ps1` que obtiene un token y llama a la Web API
- Lecturas con `$select`, `$filter`, `$orderby`, `$count` y **paginación** a mano
- Escrituras: crear, actualizar, **upsert por clave alternativa** y borrar
- Un envoltorio que **reintenta** lo que se arregla solo y **no** reintenta lo que no
- Un script de **pruebas** que comprueba cifras y errores esperados
- Una decisión escrita de cómo **ejecutarlo sin ti** (dónde vive el secreto, quién lo rota)

## Qué es verificado y qué no (léelo antes de empezar)

- **Comprobado en un tenant real (2026-11-21):** el comportamiento de la **API** (qué devuelve cada llamada del Ejercicio 3 al 5, con los códigos y mensajes de la tabla), medido sobre la tabla `Proveedor` con la sesión de un usuario.
- **Comprobado en Learn (2026-11-21):** la petición de token (`client_credentials`, con `scope` = `<url del ambiente>/.default`), que no hace falta el permiso delegado de Dataverse con esta forma de autenticación, que el usuario de aplicación no consume licencia de pago, los límites de protección del servicio, la paginación, el upsert y las cabeceras condicionales, y las recomendaciones sobre secretos. El inicio rápido oficial de PowerShell de Learn autentica **de forma interactiva** (`Connect-AzAccount`): el script con `client_credentials` de este lab es **código propio del curso**, no una muestra de Learn.
- **Revisado, no ejecutado contra la API:** los nueve bloques de PowerShell se analizaron con el analizador de sintaxis de Windows PowerShell 5.1 (sin errores, tras corregir uno que encontró una revisión) y la función que lee `Retry-After` se probó en local con los dos tipos de cabeceras (5.1 y 7). **No se ejecutaron** contra una API con token. Tampoco se probó la obtención del token con **tu** registro de aplicación, ni PowerShell 7 (se razona por los tipos de .NET). Los pasos de la interfaz de Entra y del centro de administración se describen según Learn; sus etiquetas pueden cambiar. Si algo no coincide, anótalo.
- **Seguridad:** usarás un secreto de **tu** aplicación en **tu** ambiente de práctica. No lo pegues en el repositorio, en un chat ni en una captura.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Identidad de la aplicación | 45 min |
| Ejercicio 2 — Token y primera llamada | 30 min |
| Ejercicio 3 — Leer | 35 min |
| Ejercicio 4 — Escribir | 40 min |
| Ejercicio 5 — Errores y reintentos | 35 min |
| Ejercicio 6 — Pruebas | 35 min |
| Ejercicio 7 — Ejecutarlo sin ti | 20 min |
| **Total** | **unas 4 h** |

## Nivel

**Nivel IA — Desarrollo asistido (N5)** — Buenas prácticas (no es una certificación oficial de Microsoft). Lab opcional: no cuenta para ningún certificado.

## Tecnologías utilizadas

- Microsoft Entra ID (registro de aplicación, secreto de cliente), centro de administración de Power Platform (usuario de aplicación)
- Dataverse Web API (OData v4): `$select`, `$filter`, `$orderby`, `$top`, `$count`, `Prefer: odata.maxpagesize`, `PATCH` por clave alternativa
- PowerShell (`Invoke-RestMethod`): 5.1 o 7. Los scripts usan variables de entorno para los secretos

## Prerrequisitos

### Entorno

- [ ] Un ambiente con Dataverse (el del curso) y la tabla `Proveedor` del Lab 132, con la clave alternativa `ID de proveedor` **Active**. Anota el **prefijo de tu publicador**: en los ejemplos es `sit_`; si el tuyo es otro, cámbialo
- [ ] La **dirección del ambiente** (`https://<tu-org>.crm.dynamics.com`, o la de tu región; se ve en el centro de administración, en los detalles del ambiente) y el **identificador del inquilino** (tenant)
- [ ] Permiso para crear un registro de aplicación en Entra y un usuario de aplicación en el ambiente. Si tu cuenta no lo tiene, pide ese permiso a un administrador: no sigas con una cuenta de administrador general solo para saltarte el problema
- [ ] PowerShell en tu equipo y un editor

### Conocimiento previo

- Módulo 53, Microlecciones 1 y 2 (anatomía de una petición; quién llama y con qué permisos)
- Lab 132: clave alternativa y por qué `PATCH` por clave hace upsert

---

## Ejercicio 1 — Identidad de la aplicación

**Objetivo:** que el cliente tenga **su propia identidad** con el mínimo permiso.

1. En **Microsoft Entra ID** > **App registrations** > **New registration**: nombre `SIT - Cliente de facturación`, una sola organización (**Single tenant**), sin URI de redirección. Con este flujo (cliente confidencial) **no** hace falta añadir el permiso delegado *Access Dynamics 365 as organization users* (Learn: no es necesario en autenticación servidor a servidor). Anota el **Application (client) ID** y el **Directory (tenant) ID**.
2. **Certificates & secrets** > **New client secret**, con la **caducidad más corta que te sirva** (por ejemplo, 90 días en una práctica; el máximo que permite Entra es de 24 meses y Microsoft recomienda menos de 12). **Copia el valor del secreto ahora**: no se vuelve a mostrar. Guárdalo **solo** en una variable de entorno de tu sesión (Ejercicio 2), nunca en un archivo del repositorio.
3. Crea primero el **rol de seguridad** `SIT - Integración de proveedores`: en el ambiente, **Settings** > **Users + permissions** > **Security roles** > **New role**. Dale **solo** estos privilegios sobre la tabla `Proveedor`: **Create**, **Read**, **Write** y **Delete**, con alcance **Organization**. (Si al probar un privilegio básico no alcanzara, añade solo lo que el mensaje de error pida; no copies un rol de administrador.)
4. En el **centro de administración de Power Platform** > **Manage** > **Environments** > tu ambiente > **Settings** > **Users + permissions** > **Application users** > **+ New app user** > **+ Add an app** (Learn: solo aparecen los registros de aplicación, no las aplicaciones empresariales): elige tu aplicación y la **unidad de negocio**, y asígnale el rol del paso 3 (si el panel pide un correo, sigue lo que pida); **no** le asignes el rol de administrador del sistema. Se admite **un** usuario de aplicación por aplicación y ambiente.

**Resultado esperado:** un usuario de aplicación con un rol de **cuatro privilegios sobre una tabla** (y los que el sistema exija para poder entrar). Learn dice que se puede crear un usuario de aplicación **sin licencia** y que conectar como aplicación no consume una licencia de pago. **Learn no nombra un rol mínimo**: recomienda crear un rol de seguridad **personalizado** con solo los privilegios necesarios, que es lo que haces aquí.

> **Comprobado en Learn:** [Learn: usar OAuth con Dataverse](https://learn.microsoft.com/power-apps/developer/data-platform/authenticate-oauth), [Learn: flujo client credentials](https://learn.microsoft.com/entra/identity-platform/v2-oauth2-client-creds-grant-flow) y [Learn: usuarios de aplicación](https://learn.microsoft.com/power-platform/admin/manage-application-users). *Sin verificar en este lab:* las etiquetas exactas de la interfaz en tu idioma.

### Validación del Ejercicio 1

| Campo | Tu valor |
|---|---|
| ¿Qué privilegios tiene el rol? (lista) | ___ |
| ¿Por qué no el rol de administrador del sistema? | ___ |
| Caducidad que elegiste para el secreto y por qué | ___ |

---

## Ejercicio 2 — Token y primera llamada

**Objetivo:** probar que la identidad funciona con `WhoAmI`, con una librería que reutilizarás en los ejercicios siguientes.

**Antes de escribir código:**

- En **Windows PowerShell 5.1** la política de ejecución por defecto (`Restricted`) impide ejecutar `.ps1`. Para esta sesión: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned`. (Afecta solo a la ventana actual.)
- **El secreto se escribe una sola vez y a ciegas.** Define las variables **en la sesión**; el secreto, con `Read-Host`, **nunca** escrito en la línea de comandos (quedaría en el historial de PowerShell, `ConsoleHost_history.txt`, que cerrar la sesión no borra):

```powershell
$env:DV_TENANT_ID = '<tu tenant id>'
$env:DV_CLIENT_ID = '<tu client id>'
$env:DV_ORG_URL   = 'https://<tu-org>.crm.dynamics.com'    # sin barra final
$s = Read-Host 'Secreto' -AsSecureString                     # funciona en 5.1 y en 7
$env:DV_CLIENT_SECRET = [pscredential]::new('x', $s).GetNetworkCredential().Password
```

(`ConvertFrom-SecureString` **no** sirve: devuelve el secreto cifrado con tu cuenta de Windows, no el secreto.) Una variable de entorno la heredan los procesos que lances y se ve con `dir env:`: es un recurso de **práctica** (Ejercicio 7). No imprimas `$body`, `$headers` ni el token, y no los incluyas en capturas.

**La librería:** crea `Dataverse-Lib.ps1`. Solo define funciones; **no ejecuta nada** al cargarse:

```powershell
function Connect-Dataverse {
  $script:org = $env:DV_ORG_URL
  $body = @{
    grant_type    = 'client_credentials'
    client_id     = $env:DV_CLIENT_ID
    client_secret = $env:DV_CLIENT_SECRET
    scope         = "$($script:org)/.default"
  }
  $script:tokenResponse = Invoke-RestMethod -Method Post -Uri "https://login.microsoftonline.com/$($env:DV_TENANT_ID)/oauth2/v2.0/token" -Body $body
  $script:headers = @{
    Authorization      = "Bearer $($script:tokenResponse.access_token)"
    Accept             = 'application/json'
    'OData-MaxVersion' = '4.0'
    'OData-Version'    = '4.0'
  }
}

function Invoke-Dv {
  param([string]$Method = 'GET', [string]$Path, $Body, [hashtable]$Extra = @{})
  $h = $script:headers.Clone(); foreach ($k in $Extra.Keys) { $h[$k] = $Extra[$k] }
  $p = @{ Method = $Method; Uri = "$($script:org)/api/data/v9.2/$Path"; Headers = $h }
  if ($Body) { $p.Body = ($Body | ConvertTo-Json -Depth 5); $p.ContentType = 'application/json; charset=utf-8' }
  Invoke-RestMethod @p
}
```

Cárgala y prueba (con el **punto** inicial, para que las variables y funciones queden en tu consola):

```powershell
. .\Dataverse-Lib.ps1
Connect-Dataverse
Invoke-Dv -Path 'WhoAmI'
$tokenResponse.expires_in
```

**Resultado esperado:** `WhoAmI` devuelve un `UserId`, un `BusinessUnitId` y un `OrganizationId`, y el `UserId` es el del **usuario de aplicación**, no el tuyo. Esto prueba que la API ve a la **aplicación**.

> **Con este flujo no hay refresh token:** cuando el token caduca, se pide **otro** con el mismo secreto. Un script largo debe renovarlo antes de que caduque.
>
> **Si falla:** `AADSTS7000215` suele ser un secreto incorrecto y `AADSTS7000216`, un secreto vacío; `AADSTS700016`, un client ID de otro inquilino; un `401` o `403` en Dataverse con token válido, un usuario de aplicación inexistente o sin los privilegios (el código exacto depende del caso: *sin verificar*). **Lee el mensaje** antes de cambiar nada. En equipos antiguos sin TLS 1.2 por defecto, la petición del token puede fallar con "Could not create SSL/TLS secure channel".

### Validación del Ejercicio 2

| Campo | Tu valor |
|---|---|
| `UserId` de `WhoAmI` y a quién corresponde | ___ |
| Duración del token (`expires_in`, en segundos; Learn dice que ronda los 60 minutos) | ___ |
| ¿Qué `aud` y `appid` tiene tu token? (decodifica **en local**: la segunda parte, en Base64; **no** lo pegues en una página web) | ___ |

---

## Ejercicio 3 — Leer

**Objetivo:** pedir solo lo necesario y leer **todas** las páginas.

En tu consola (con la librería cargada y `Connect-Dataverse` hecho). `sit_proveedors` es el conjunto de entidades de la tabla `Proveedor`; en tu ambiente puede cambiar el prefijo, y la forma del plural la decide Dataverse:

```powershell
(Invoke-Dv -Path 'sit_proveedors?$select=sit_iddeproveedor,sit_nombre&$top=2&$orderby=sit_iddeproveedor').value
(Invoke-Dv -Path 'sit_proveedors?$count=true&$top=1&$select=sit_nombre').'@odata.count'
```

Después, **pagina a mano** con páginas de 5 (Learn: el máximo de `odata.maxpagesize` es 5.000; **no** combines `maxpagesize` con `$top` —`$top` se ignora— ni uses `$skip`; usa el `@odata.nextLink` **tal cual** y un `$orderby` determinista):

```powershell
$h5 = @{ Prefer = 'odata.maxpagesize=5' }
$r = Invoke-Dv -Path 'sit_proveedors?$select=sit_iddeproveedor&$orderby=sit_iddeproveedor' -Extra $h5
$todos = @($r.value); $paginas = 1; $primera = $r.value.Count
while ($r.'@odata.nextLink') {
  $r = Invoke-RestMethod -Uri $r.'@odata.nextLink' -Headers ($headers + $h5)
  $todos += $r.value; $paginas++
}
"primera página: $primera; total: $($todos.Count); páginas: $paginas"
```

### Resultado esperado del Ejercicio 3

**Comprobado en un tenant real:** `$select` y `$top` devuelven solo esas columnas y filas (la respuesta añade igualmente el identificador interno de la fila y una marca de versión `@odata.etag`). `@odata.count` devuelve el total de la tabla: **17** si solo hiciste la primera carga del Lab 132 y **18** si hiciste también la actualización. Con `odata.maxpagesize=5` la respuesta trae **5** filas y un `@odata.nextLink`; con 18 filas, el bucle hace **4 páginas** (5 + 5 + 5 + 3) y con 17, también 4 (5 + 5 + 5 + 2). Learn avisa de que `$count` llega solo hasta **5.000** filas en una tabla estándar. Un flujo o un script que **no** sigue el `@odata.nextLink` lee solo la primera página **sin error** (Lab 132, Ejercicio 7, y Lab 138).

### Validación del Ejercicio 3

| Campo | Tu valor |
|---|---|
| `@odata.count` de `Proveedor` (17 o 18, según tu Lab 132) | ___ |
| Filas de la primera página y de `$todos` | ___ / ___ (esperado: 5 y el total) |
| Páginas que hizo el bucle | ___ (esperado: 4) |

---

## Ejercicio 4 — Escribir

**Objetivo:** crear, actualizar, **upsert** y borrar, y entender cada respuesta.

Para ver **códigos de estado y mensajes** (que `Invoke-RestMethod` no te da), añade este ayudante a `Dataverse-Lib.ps1`. Funciona en Windows PowerShell 5.1 y en 7:

```powershell
function Invoke-DvStatus {
  param([string]$Method = 'GET', [string]$Path, $Body, [hashtable]$Extra = @{})
  $h = $script:headers.Clone(); foreach ($k in $Extra.Keys) { $h[$k] = $Extra[$k] }
  $p = @{ Method = $Method; Uri = "$($script:org)/api/data/v9.2/$Path"; Headers = $h; UseBasicParsing = $true }
  if ($Body) { $p.Body = ($Body | ConvertTo-Json -Depth 5); $p.ContentType = 'application/json; charset=utf-8' }
  try {
    $r = Invoke-WebRequest @p
    [pscustomobject]@{ Status = [int]$r.StatusCode; Code = $null; Message = $null }
  } catch {
    $resp = $_.Exception.Response
    $st = if ($resp) { [int]$resp.StatusCode } else { 0 }
    $msg = $_.ErrorDetails.Message
    if (-not $msg -and $resp) { try { $msg = (New-Object IO.StreamReader($resp.GetResponseStream())).ReadToEnd() } catch {} }
    $code = $null
    try { $e = ($msg | ConvertFrom-Json).error; $code = $e.code; $msg = $e.message } catch {}
    [pscustomobject]@{ Status = $st; Code = $code; Message = $msg }
  }
}
```

Vuelve a cargar la librería (`. .\Dataverse-Lib.ps1`) y ejecuta, **en este orden**, con filas de prueba `PRV-TEST1` y `PRV-TEST2`. Por ejemplo, el paso 1:

```powershell
Invoke-DvStatus -Method POST -Path 'sit_proveedors' -Body @{ sit_iddeproveedor = 'PRV-TEST1'; sit_nombre = 'Prueba API S.A.S.' }
```

| Paso | Llamada | Qué debes ver (comprobado en un tenant real) |
|---|---|---|
| 1 | `POST sit_proveedors` con `sit_iddeproveedor` y `sit_nombre` | **201** |
| 2 | El mismo `POST` otra vez | **412** (clave duplicada): *"Entity Key … violated. A record with the same value for ID de proveedor already exists"* |
| 3 | `PATCH sit_proveedors(sit_iddeproveedor='PRV-TEST1')` con `sit_nombre` nuevo | **204** (actualiza) |
| 4 | `PATCH sit_proveedors(sit_iddeproveedor='PRV-TEST2')` con un nombre (**no existe**) | **204** (**crea**: es un upsert) |
| 5 | `PATCH` sobre `PRV-TEST1` con la cabecera `If-None-Match: *` (`-Extra @{ 'If-None-Match' = '*' }`) | **412** *"A record with matching key values already exists"* (no pisa lo que existe) |
| 6 | `DELETE sit_proveedors(sit_iddeproveedor='PRV-TEST1')` y lo mismo con `PRV-TEST2` | **204** y **204** |
| 7 | `DELETE` de `PRV-TEST2` otra vez | **404** *"A record with the specified key values does not exist"* |

> **Lo que enseña esta tabla:** el mismo `PATCH` **crea o actualiza** según exista la clave, y devuelve **204** en ambos casos. Learn confirma que no se distingue, salvo que pidas `Prefer: return=representation` (entonces devuelve **201** al crear y **200** al actualizar, a costa de una lectura extra). Si necesitas "crear solo si es nuevo", usa `If-None-Match: *` (comprobado); para "actualizar solo si existe", `If-Match: *`, que según Learn da **404** si la fila no existe (*no probado en el tenant*). Un `DELETE` repetido da **404**: tu script debe decidir si eso es un error o un "ya estaba borrado".
>
> **Lotes:** para varias operaciones en una llamada existe `$batch` (Learn: hasta **1.000** solicitudes por lote; un *change set* dentro es **atómico**: si una falla, se revierte todo; requiere saltos de línea CRLF y, sin `Prefer: odata.continue-on-error`, se detiene en el primer error). Learn recomienda **no** usar lotes grandes (empezar con 10) y aclara que no sirven para esquivar los límites. Este lab no lo practica (Reto avanzado).

### Validación del Ejercicio 4

| Campo | Tu valor |
|---|---|
| Códigos de los siete pasos | ___ |
| Cómo distingues, en el `PATCH`, si creó o actualizó | ___ (esperado: el `204` no lo dice; usa `Prefer: return=representation` (201/200), consulta antes o usa `If-None-Match`) |
| Filas `PRV-TEST…` que quedan al terminar | ___ (esperado: 0) |

---

## Ejercicio 5 — Errores y reintentos

**Objetivo:** distinguir lo que se arregla reintentando de lo que no.

**Provoca estos errores** (los cuatro primeros son seguros en tu ambiente de práctica) con `Invoke-DvStatus` y anota código HTTP, `Code` y `Message`. Mediciones reales:

| Error provocado | Código HTTP | `error.code` | Qué dice | ¿Reintentar? |
|---|---|---|---|---|
| Fila inexistente por clave | **404** | `0x80060891` | no existe un registro con esos valores de clave | **No** (decide: error o "no hay nada") |
| Columna que no existe en `$select` | **400** | `0x80060888` | no se encuentra la propiedad en el tipo | **No** (es un bug tuyo) |
| Conjunto de entidades inexistente | **404** | `0x80060888` | recurso no encontrado en el segmento | **No** |
| Clave duplicada al crear | **412** | `0x80060892` | clave violada, ya existe | **No** (usa upsert) |
| Token caducado, usuario sin privilegio | **401** / **403** | (según el caso) | no autorizado o sin privilegio (*sin provocar aquí*: para verlo, quita un privilegio al rol y repite un `DELETE`) | **No**; renueva el token una vez y, si persiste, son permisos |
| Demasiadas solicitudes | **429** | (mensaje de límite) | espera según `Retry-After` (en segundos) | **Sí**, esperando lo que dice la cabecera |
| Servicio no disponible | **503** | — | temporal | **Sí**, con espera creciente |

Las dos últimas filas **no se provocan**: están en la tabla por lo que dice Learn.

**Añade** (no reemplaces `Invoke-Dv`: la nueva función lo usa) este envoltorio a `Dataverse-Lib.ps1`. **Solo** reintenta 429 y 503, y lee `Retry-After` en 5.1 y en 7:

```powershell
function Get-EsperaSegundos($resp, [int]$defecto) {
  $v = $null
  try { $v = $resp.Headers['Retry-After'] } catch {}                                   # Windows PowerShell 5.1
  if ($v -is [array]) { $v = $v[0] }
  if (-not $v) { try { $d = $resp.Headers.RetryAfter.Delta; if ($d) { $v = [int]$d.TotalSeconds } } catch {} }   # PowerShell 7
  $n = 0
  if ([int]::TryParse("$v", [ref]$n) -and $n -gt 0) { return $n }
  return $defecto
}

function Invoke-DvConReintento {
  param([string]$Method = 'GET', [string]$Path, $Body, [hashtable]$Extra = @{}, [int]$Max = 3)
  for ($i = 0; $i -le $Max; $i++) {
    try { return Invoke-Dv -Method $Method -Path $Path -Body $Body -Extra $Extra }
    catch {
      $resp = $_.Exception.Response
      $status = if ($resp) { [int]$resp.StatusCode } else { 0 }
      if (($status -eq 429 -or $status -eq 503) -and $i -lt $Max) {
        $espera = Get-EsperaSegundos $resp (5 * [math]::Pow(2, $i))                  # 5, 10, 20 s si no hay cabecera
        Write-Warning "HTTP ${status}: reintento $($i + 1) en $espera s"
        Start-Sleep -Seconds $espera
        continue
      }
      throw
    }
  }
}
```

> **No ejecutado:** este envoltorio no se probó contra un `429` real (no se provocó un límite en el ambiente de práctica). **Comprobado en Learn** ([Learn: límites de protección del servicio](https://learn.microsoft.com/power-apps/developer/data-platform/api-limits)): los límites son **por usuario y por servidor web**; en una ventana de **5 minutos** cuentan **6.000 solicitudes** y **20 minutos** de tiempo de ejecución combinado, y además hay un límite de **52 solicitudes concurrentes** (este último no es de ventana: falla de inmediato); aplican también a los usuarios de aplicación; los ambientes **Trial** tienen **un solo servidor web**; los valores pueden cambiar. La recomendación es subir el ritmo poco a poco y obedecer `Retry-After`. PowerShell 7 ofrece `Invoke-RestMethod -MaximumRetryCount`, que reintenta y respeta `Retry-After` en los 429 (según Learn); si lo usas, **comprueba** que no reintente errores que no deben repetirse (el 404 o el 412). **No** provoques límites a propósito en un ambiente que no sea tuyo.

### Validación del Ejercicio 5

| Campo | Tu valor |
|---|---|
| Código, `Code` y mensaje de cada error que provocaste | ___ |
| Por qué no se reintenta un 412 | ___ |
| Los tres límites de protección del servicio | ___ (esperado: 6.000 solicitudes y 20 minutos de ejecución por ventana de 5 minutos, y 52 solicitudes concurrentes) |
| Qué haría tu script si el `429` no trae `Retry-After` | ___ (esperado: espera creciente de 5, 10 y 20 s) |

---

## Ejercicio 6 — Pruebas

**Objetivo:** que el cliente se compruebe solo y se pueda repetir sin dejar basura.

Crea `Test-Cliente.ps1` **junto a** `Dataverse-Lib.ps1`. Carga la librería, se conecta él mismo y limpia **siempre** (aunque falle):

```powershell
. "$PSScriptRoot\Dataverse-Lib.ps1"
Connect-Dataverse
$fallos = 0
function Assert-Igual($nombre, $esperado, $real) {
  if ($esperado -ne $real) { Write-Host "FALLA $nombre : esperado [$esperado], real [$real]" -ForegroundColor Red; $script:fallos++ }
  else { Write-Host "ok    $nombre" -ForegroundColor Green }
}
try {
  # Cifra de partida: ajusta el esperado a tu tabla (17 o 18)
  $total = (Invoke-Dv -Path 'sit_proveedors?$count=true&$top=1&$select=sit_nombre').'@odata.count'
  Assert-Igual 'total de proveedores' 18 $total
  # Upsert idempotente: dos veces el mismo PATCH deja UNA fila
  1..2 | ForEach-Object { Invoke-Dv -Method PATCH -Path "sit_proveedors(sit_iddeproveedor='PRV-TEST9')" -Body @{ sit_nombre = 'Prueba 9' } }
  $n = (Invoke-Dv -Path "sit_proveedors?`$filter=sit_iddeproveedor eq 'PRV-TEST9'&`$select=sit_nombre").value.Count
  Assert-Igual 'upsert idempotente' 1 $n
  # Error esperado: leer una fila inexistente da 404
  $r = Invoke-DvStatus -Path "sit_proveedors(sit_iddeproveedor='PRV-999')?`$select=sit_nombre"
  Assert-Igual 'inexistente da 404' 404 $r.Status
}
finally {
  Invoke-DvStatus -Method DELETE -Path "sit_proveedors(sit_iddeproveedor='PRV-TEST9')" | Out-Null   # limpieza siempre
}
if ($fallos) { exit 1 }
```

Ejecútalo **dos veces seguidas** como archivo (`.\Test-Cliente.ps1`, **sin** el punto inicial: con el punto, `exit` cerraría tu consola y con ella tus variables de entorno).

### Resultado esperado del Ejercicio 6

Las tres comprobaciones pasan y la segunda ejecución da **lo mismo** (nada se acumula). Si `total de proveedores` falla, comprueba si hiciste la actualización del Lab 132 (18 filas) o solo la primera carga (17). Después de las dos ejecuciones no queda **ninguna** fila `PRV-TEST…`.

> **Qué estás probando de verdad:** un cliente de integración se prueba por sus **efectos** (cuántas filas, qué código), no por "que no explote". Una prueba que depende de que la tabla tenga el número exacto de filas es frágil: ajusta `18` a tu estado o usa una consulta relativa.

### Validación del Ejercicio 6

| Campo | Tu valor |
|---|---|
| Resultado de la primera y la segunda ejecución | ___ / ___ |
| Filas `PRV-TEST…` al terminar | ___ (esperado: 0) |
| Una prueba más que añadirías y por qué | ___ |

---

## Ejercicio 7 — Ejecutarlo sin ti

**Objetivo:** decidir cómo corre el cliente cuando tú no estás, sin dejar secretos tirados. **Este ejercicio es de diseño**: no hay que desplegar nada.

Responde por escrito:

1. **¿Dónde vive el secreto?** Compara una variable de entorno de tu equipo, un almacén de secretos (Azure Key Vault) y un **certificado** en lugar de un secreto. **Comprobado en Learn:** los secretos "no deberían usarse en producción" (valen para desarrollo local); en producción prefiere un **certificado** gestionado con Key Vault, y mejor aún una **identidad administrada** o una **credencial federada** cuando el servicio lo permite; y nunca publiques una credencial en el código ([Learn: credenciales de una aplicación](https://learn.microsoft.com/entra/identity-platform/how-to-add-credentials), [Learn: buenas prácticas de un registro de aplicación](https://learn.microsoft.com/entra/identity-platform/security-best-practices-for-app-registration)). *Learn no recomienda las variables de entorno para secretos:* aquí son un recurso de práctica. ¿Qué elegirías para producción y por qué?
2. **¿Quién lo rota y cuándo?** Escribe quién cambia el secreto antes de que caduque y qué se rompe si nadie lo hace (el cliente deja de poder pedir tokens: `401`).
3. **¿Dónde corre?** Un servicio programado (Azure Function: Módulo 24; GitHub Actions: Módulo 19) o un flujo. ¿Cuál cuesta menos mantener para esta integración y por qué?
4. **Mínimo privilegio:** tu rol tiene cuatro privilegios sobre una tabla. ¿Qué pasaría si el sistema de facturación tuviera una vulnerabilidad? ¿Qué podría hacer el atacante con ese token y qué **no**?

### Validación del Ejercicio 7

| Campo | Tu valor |
|---|---|
| Dónde guardarías el secreto en producción | ___ |
| Quién lo rota y cada cuánto | ___ |
| Qué puede y qué no puede hacer quien robe el token | ___ |

---

## Errores frecuentes

| Error | Causa probable | Solución |
|---|---|---|
| `AADSTS7000215` | Secreto equivocado o con espacios | Copiar de nuevo; crear otro secreto |
| `401` o `403` con token válido | Usuario de aplicación inexistente o sin rol (el código exacto depende del caso) | Crearlo y asignar el rol (Ejercicio 1) |
| `403` al crear o borrar | Falta el privilegio en el rol | Añadir **Create** o **Delete** sobre la tabla |
| `404 Resource not found for the segment` | Nombre del conjunto de entidades equivocado | Revisar el plural y el prefijo de tu tabla |
| `400 Could not find a property named …` | Columna mal escrita en `$select` | Usar el nombre lógico exacto |
| `412` al crear | Ya existe esa clave | `PATCH` por clave (upsert) |
| Solo llegan las primeras filas | No se sigue el `@odata.nextLink` | Bucle de paginación (Ejercicio 3) |
| El secreto apareció en un commit | Se guardó en un archivo | **Revocar el secreto**, crear otro y limpiar el historial; asumir que ya está comprometido |
| El secreto quedó en el historial de PowerShell | Se escribió en la línea de comandos | Revocarlo y usar `Read-Host -AsSecureString`; borrar el historial no basta |
| `la ejecución de scripts está deshabilitada` | Política `Restricted` de Windows PowerShell 5.1 | `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned` |

## 🔧 Diagnóstico y reparación

### "El cliente funcionó ayer y hoy da 401"

1. **Decodifica el mensaje**: ¿es de Entra (al pedir el token) o de Dataverse (al llamar)?
2. Si es de Entra: ¿**caducó el secreto**? Mira su fecha en el registro de aplicación.
3. Si es de Dataverse: ¿alguien **desactivó o recreó** el usuario de aplicación, o le quitó el rol?
4. **Repara** con el mínimo cambio (secreto nuevo o rol) y **anota** por qué no lo viste venir: ¿faltó una alerta de caducidad?

## Checklist final

- [ ] Registro de aplicación, secreto de caducidad corta y usuario de aplicación con rol mínimo
- [ ] `WhoAmI` devuelve el usuario de aplicación y `Dataverse-Lib.ps1` solo define funciones
- [ ] Lecturas con `$select`, `$filter`, `$count` y paginación a mano
- [ ] Siete pasos de escritura con sus códigos anotados
- [ ] Tabla de errores y envoltorio de reintentos
- [ ] `Test-Cliente.ps1` pasa dos veces y no deja filas
- [ ] Decisión escrita del Ejercicio 7
- [ ] **Ningún secreto** en archivos del repositorio

## Evidencia esperada

- Captura de `WhoAmI` (sin el token) y del usuario de aplicación con su rol
- Salida del bucle de paginación y de los siete pasos de escritura
- Salida de `Test-Cliente.ps1` en las dos ejecuciones
- Tus respuestas de validación

## Criterios de aprobación

- La integración corre con una identidad de **aplicación** y permisos mínimos, y lo demuestras con `WhoAmI`
- Distingues el `PATCH` que crea del que actualiza y sabes pedir "solo si es nuevo"
- Reintentas solo lo que se arregla solo, respetando `Retry-After`
- Tu prueba comprueba **efectos** y es repetible
- No hay ningún secreto fuera del almacén que elegiste

## Competencias desarrolladas

- Crear una identidad de aplicación con mínimo privilegio y obtener un token
- Consultar y escribir en Dataverse con OData, incluida la paginación y el upsert
- Clasificar errores HTTP y reintentar con criterio
- Probar un cliente de integración y dejarlo repetible
- Decidir dónde vive un secreto y quién lo rota

## Reto adicional

**Reto básico:** añade `Prefer: odata.include-annotations="OData.Community.Display.V1.FormattedValue"` a una lectura de una columna de opciones y compara el valor numérico con el texto formateado.

**Reto intermedio:** carga el archivo `proveedores-actualizacion.csv` del paquete `sit-compras` con un `PATCH` por clave por cada fila y comprueba que el resultado coincide con el del Lab 132 (18 filas, 17 activas).

**Reto avanzado:** cambia el secreto por un **certificado** y obtén el token con él (anota qué cambió en la petición), o escribe un lote `$batch` de 3 `PATCH` con un *change set* y comprueba que, si fuerzas un fallo en uno, no se guarda ninguno.

## Preguntas de repaso

1. ¿Por qué `WhoAmI` es la primera llamada de una integración nueva?
2. ¿Qué dos cosas debe tener un usuario de aplicación para poder escribir en una tabla?
3. ¿Por qué un `PATCH` por clave devuelve el mismo `204` al crear y al actualizar, y cómo lo evitas si te importa?
4. ¿Qué errores no deben reintentarse nunca y por qué?
5. ¿Qué haces si un secreto aparece en un commit?

## Limpieza del laboratorio

Borra las filas `PRV-TEST…` si quedara alguna. **Elimina el secreto** del registro de aplicación (o deja que caduque) y, si no vas a usar la identidad, borra el usuario de aplicación y el registro. Cierra la sesión de PowerShell para que desaparezcan las variables de entorno.

## Siguiente laboratorio recomendado

**Lab 134 — Integración con APIs** (consumir una API desde un flujo), o el **Módulo 24** si quieres llevar este cliente a una Azure Function con una cola delante.

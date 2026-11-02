---
moduleId: 52
title: "Power Platform CLI y Conexión Segura al Tenant"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 16
practiceMinutes: 150
slug: "cli-y-conexion-al-tenant"
lastVerified: "2026-11"
---
*Lectura: 14-16 min · Práctica: unas 2 horas y media la primera vez (la instalación de PAC CLI puede llevarse 20 minutos sola), mejor en dos sesiones: la primera, Microlecciones 1 y 2; la segunda, la Microlección 3, la decisión y el reto de transferencia, que se pueden hacer en papel.*

### 🎯 Objetivo
Configurar un entorno de desarrollo local para Power Platform, entender la diferencia entre tenant, entorno (environment) y organización, y conectarte de forma segura con Power Platform CLI (`pac`) sin arriesgar trabajar por error contra producción. Al terminar habrás corregido, comando por comando y contra `pac <comando> help` y Microsoft Learn, una guía de instalación escrita por IA que mezcla comandos que no existen con otros que sí, y sabrás comprobar a qué ambiente apunta cada comando antes de ejecutarlo.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una práctica con **evidencia** (el dato exacto que observaste, no un sí/no) y, donde ayuda, una micropráctica con feedback inmediato. La Microlección 2 es una actividad de **fallo y corrección**: recibes una guía de instalación de PAC CLI generada por IA, con errores plausibles, y los encuentras con la ayuda del propio CLI. Cierras **decidiendo y defendiendo** una política de perfiles para varios clientes y con un **reto de transferencia** a un script que se ejecuta sin nadie delante.
>
> **Antes de empezar, necesitas:**
> - Windows, macOS o Linux con permiso para instalar software, y **Visual Studio Code** (la forma de instalación que Learn recomienda es su extensión).
> - Para las Microlecciones 1 y 3: acceso a un ambiente **Developer** o **Sandbox** de práctica (nunca producción). Si hiciste el Módulo 1, usa el ambiente que creaste ahí. Desde el 15 de noviembre de 2026, registrarse en el Power Apps Developer Plan ya no crea un ambiente Developer, solo hay Developer **administrados** y cada usuario puede crear uno ([Learn: Create a developer environment](https://learn.microsoft.com/power-platform/developer/create-developer-environment)).
> - **Si no tienes ambiente**, haz la variante en papel de cada microlección: la Microlección 2, la decisión y el reto de transferencia funcionan sin tenant, y para ver la ayuda de `pac` no hace falta autenticarse.
> - Este módulo es transversal: no exige ningún nivel de certificación. Te prepara para el [Lab 52](/labs/lab-52-cli-conexion-tenant), el [Lab 56](/labs/lab-56-cambiar-entornos-dev-test-prod) y el Módulo 54 (ALM con IA).

### 📖 Conceptos Clave
- **Tenant:** el directorio de Microsoft Entra ID que agrupa todos los entornos, usuarios y licencias de una organización. Un cliente/empresa normalmente tiene un solo tenant, pero puede tener decenas de entornos dentro de él.
- **Environment (entorno):** un contenedor lógico dentro del tenant con su propia base de datos de Dataverse (si tiene una), sus propias apps, flujos y seguridad. Tipos ([Learn: Environments overview](https://learn.microsoft.com/power-platform/admin/environments-overview)): **Production** (trabajo permanente, del que depende el negocio), **Sandbox** (no productivo, para desarrollo y pruebas; admite copiar y restablecer), **Trial** (pruebas de corto plazo: expira a los 30 días y hay uno por usuario), **Developer** (pensado para uso exclusivo de su dueño, con el Developer Plan; desde el 15 de noviembre de 2026 solo administrados, uno por usuario) y **Default** (el que cada tenant tiene automáticamente, compartido por todos sus usuarios; Learn lo describe para experimentación ligera, sin garantías de respaldo y no apto para producción).
- **Organización (Dataverse organization):** cuando un entorno tiene Dataverse habilitado, Microsoft crea una "organización" con una URL única (`https://<nombre-org>.crm.dynamics.com` o regiones equivalentes) — es el punto de conexión real para Web API, plugins y la mayoría de herramientas. En el centro de administración, cada ambiente muestra su **Environment ID** y su **Organization ID** por separado ([Learn: Find your environment and organization ID](https://learn.microsoft.com/power-platform/admin/determine-org-id-name)).
- **Perfil de autenticación de `pac`:** un conjunto guardado de credenciales + ambiente por defecto que `pac auth` administra localmente; puedes tener varios perfiles (uno por cliente/entorno), ponerles nombre (`--name`, máximo 30 caracteres) y cambiar entre ellos sin volver a autenticarte. Si creas un perfil **sin** `--environment`, Learn indica que quedas conectado al ambiente **Default** del tenant ([Learn: pac auth](https://learn.microsoft.com/power-platform/developer/cli/reference/auth)).
- **`pac env who` (antes `pac org who`):** muestra la organización de Dataverse a la que apunta el perfil activo. Desde la versión 1.32 el grupo `pac org` se llama `pac env`; Learn indica que `org` sigue funcionando, pero recomienda `env` ([Learn: pac env](https://learn.microsoft.com/power-platform/developer/cli/reference/env)). En este módulo verás los dos: el Caso Real y los labs usan `pac org who`, y es el mismo comando.
- **El nombre del perfil es una etiqueta; `pac env who` es la verdad.** `pac env select` y `pac auth update --environment` cambian el ambiente al que apunta un perfil sin cambiarle el nombre. Además, muchos comandos aceptan `--environment` para fijar el destino en esa misma línea en vez de depender del perfil activo.
- **Separación Dev/Test/Prod:** cada etapa del ciclo de vida de una solución debe vivir en su propio entorno — nunca se desarrolla ni se prueba directamente en Production. Esto es la base de cualquier estrategia de ALM que se vea en el Módulo 54.
- **Entorno personal vs. compartido:** un entorno Developer es tuyo y aislado (bueno para practicar y romper cosas); un entorno Default o un Sandbox compartido por el equipo requiere coordinación — nunca lo uses como "sandbox personal" para experimentar sin avisar.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Tenant, ambiente y organización: dónde estás parado

**¿Qué vas a aprender?** A encontrar, antes de abrir una terminal, los datos que identifican sin ambigüedad tu ambiente de práctica.

**¿Por qué existe esto?** En la Microlección 3 vas a comparar lo que dice `pac env who` con algo. Si no sabes de antemano la URL y el ID de tu ambiente, no tienes con qué comparar, y "parece el correcto" es justo lo que falló en el Caso Real.

**Práctica real en el centro de administración (20 min):**

1. Entra en el [Power Platform admin center](https://admin.powerplatform.microsoft.com). En el panel de navegación, **Manage**; en el panel **Manage**, **Environments**.
2. Selecciona tu ambiente de práctica. En la sección **Details** busca el **Environment ID** y el **Organization ID** (Learn: Find your environment and organization ID). En esa misma página aparecen también el tipo de ambiente y su URL; anótalos tal como los ves.
3. En la lista de **Environments**, busca también el ambiente que termina en **(default)**: es el Default de tu tenant, el que Learn nombra como "{nombre del tenant} (default)". Anótalo: es el que no quieres encontrarte en la Microlección 3.
4. **Si no ves tu ambiente o no ves Details**, puede que no tengas permisos de administración en ese tenant. Pide a quien lo administre la URL y el ID de tu ambiente de práctica, o usa la variante en papel.

**Variante en papel (sin ambiente):** con la tabla de tipos de [Learn: Environments overview](https://learn.microsoft.com/power-platform/admin/environments-overview), decide para cada uno de estos usos qué tipo de ambiente elegirías y por qué: practicar `pac` tú solo; probar con el cliente una versión antes de salir a producción; una demostración de 2 semanas; las apps de las que depende la operación diaria.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre y tipo de tu ambiente de práctica | ___ |
| URL del ambiente (o solo el dominio, si es confidencial) | ___ |
| Environment ID y Organization ID (¿son el mismo valor?) | ___ |
| Nombre del ambiente Default de tu tenant | ___ |

---

## 🧩 Microlección 2 — Fallo y corrección: la guía de instalación que escribió la IA

**¿Qué vas a aprender?** A instalar PAC CLI por un camino documentado y a comprobar cada comando que te propone una IA con el propio CLI (`pac <comando> help`) y con Learn antes de ejecutarlo.

**¿Por qué existe esto?** Las IA se entrenan con tutoriales de varias versiones de `pac`. Mezclan parámetros obsoletos, comandos renombrados y, a veces, paquetes que no existen. Un comando que "se ve bien" no es evidencia. La salida de `pac help` en tu máquina sí lo es.

**La salida de la IA.** Alguien pidió "los pasos para instalar Power Platform CLI y conectarme a mi ambiente de desarrollo" y recibió esto. **No lo ejecutes todavía:**

```bash
# guia-pac.sh: instrucciones tal como las entregó el asistente de IA (contienen errores a propósito)
npm install -g @microsoft/powerplatform-cli        # 1. instala PAC CLI
pac --version                                      # 2. confirma la versión
pac auth create --url https://orgXXXXXXXX.crm.dynamics.com   # 3. conecta con tu ambiente
pac auth list                                      # 4. lista tus perfiles
pac auth select --index 0                          # 5. selecciona el primero
pac org who                                        # 6. comprueba la conexión
pac solution export --name SITSolicitudesGastos --path ./exports/SITSolicitudesGastos.zip   # 7. exporta
```

**Ahora haz algo — micropráctica (7 min):** antes de instalar nada, decide qué líneas no ejecutarías tal cual → **[Revisar la guía de PAC CLI que escribió la IA](/practica/ip-ia-037-revisar-guia-pac-cli-generada-por-ia)**.

**Práctica real (35 min):**

1. **Instala por un camino documentado.** [Learn: What is Microsoft Power Platform CLI?](https://learn.microsoft.com/power-platform/developer/cli/introduction) documenta tres métodos: la extensión de Visual Studio Code, la herramienta .NET y el instalador MSI de Windows. Elige uno:
   - **Extensión de VS Code (recomendada por Learn):** en VS Code, icono **Extensions** de la barra lateral, busca `power platform tools` y **Install** ([Learn: instalar la extensión](https://learn.microsoft.com/power-platform/developer/howto/install-vs-code-extension)). Ojo: así instalado, `pac` funciona por defecto solo en la terminal de PowerShell de VS Code (**Terminal** > **New Terminal**), no en una ventana de PowerShell o CMD aparte.
   - **Herramienta .NET:** necesita .NET instalado (Learn recomienda .NET 10.0) y luego `dotnet tool install --global Microsoft.PowerApps.CLI.Tool` ([Learn: instalar con .NET Tool](https://learn.microsoft.com/power-platform/developer/howto/install-cli-net-tool)). Con un SDK de .NET 8, la versión 2.14.1 del paquete no se instala: el error menciona que no encuentra `DotnetToolSettings.xml`, porque el paquete actual está compilado para .NET 10.
2. **Comprueba la versión como dice Learn:** escribe solo `pac` y pulsa Enter. **Qué deberías ver:** `Microsoft PowerPlatform CLI` en la primera línea y `Version: ...` en la segunda, seguido de la lista de grupos de comandos (`admin`, `auth`, `env`, `solution`...). **Si responde que `pac` no se reconoce**, cierra y vuelve a abrir la terminal; si instalaste solo la extensión, usa la terminal de VS Code.
3. **Ahora contrasta la guía de la IA línea por línea**, sin autenticarte contra nada (ninguno de estos comandos se conecta a un tenant):
   - Línea 1: busca ese método en la página de instalación de Learn. Después, **sin instalarlo**, consulta si el paquete existe: `npm view @microsoft/powerplatform-cli` (solo lee metadatos del registro). Anota el resultado.
   - Línea 2: ejecuta `pac --version` y lee **todas** las líneas de la respuesta, no solo la de la versión.
   - Línea 3: ejecuta `pac auth create help` y busca cómo describe `--url` y qué parámetro propone en su lugar. Busca también `--name`.
   - Línea 5: ejecuta `pac auth select --index 0`. No hay perfiles que dañar: lee el error.
   - Línea 6: ejecuta `pac org who help` y `pac env who help`, y compáralos con la nota de [Learn: pac env](https://learn.microsoft.com/power-platform/developer/cli/reference/env).
   - Línea 7: ejecuta `pac solution export help` y busca qué hace `--environment` cuando **no** lo pasas.
4. **Escribe tu versión corregida** de la guía (todavía sin ejecutar las líneas que se conectan). Criterios de aceptación: (1) el método de instalación está en Learn; (2) ningún parámetro aparece como obsoleto en `help`; (3) el perfil tiene nombre y ambiente explícitos; (4) antes de la exportación hay una verificación del destino, o la exportación fija su destino con `--environment`.

**Evidencia a reportar (una fila por línea de la guía):**

| Línea de la guía de la IA | Qué te respondió `pac ... help` o Learn (cita corta) | ¿La ejecutarías tal cual? | Tu versión corregida |
|---|---|---|---|
| 1 | ___ | ___ | ___ |
| 2 | ___ | ___ | ___ |
| 3 | ___ | ___ | ___ |
| 5 | ___ | ___ | ___ |
| 6 | ___ | ___ | ___ |
| 7 | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Método de instalación que usaste y versión que muestra `pac` (segunda línea) | ___ |
| Resultado de `npm view @microsoft/powerplatform-cli` | ___ |
| Fuente y fecha de actualización de las páginas de Learn que usaste | ___ |

**Contrasta tu revisión (solo después de llenar la tabla).** Comprobado el 1 de noviembre de 2026 con PAC CLI 2.14.1: (1) la instalación por npm no es un método documentado y `npm view` responde `E404` (`Not Found`) porque ese paquete no existe. Un nombre de paquete que la IA inventa es un riesgo de seguridad: si alguien lo publica después, el `npm install -g` instalaría código de un desconocido con tus permisos. (2) `pac --version` imprime la cabecera con la versión y después `Error: Not a valid command`; Learn indica escribir `pac` a secas. (3) `--url` aparece como `(deprecated)`; se usa `--environment`, y conviene `--name`. (4) `--index` exige un entero con valor mínimo 1: el primer perfil es el 1. (5) `pac org who` funciona, pero se recomienda `pac env who`. (6) Sin `--environment`, `pac solution export` usa la organización activa del perfil actual: justo lo que causó el Caso Real.

---

## 🧩 Microlección 3 — Perfiles con nombre y verificar antes de operar

**¿Qué vas a aprender?** A crear perfiles con nombre y ambiente explícitos, a comprobar a dónde apuntan y a no depender del perfil activo en un comando que modifica algo.

**¿Por qué existe esto?** El consultor del Caso Real tenía perfiles para tres clientes. El error no fue técnico: el perfil activo había quedado de la sesión anterior y nadie lo comprobó.

**Práctica real en tu ambiente de práctica (35 min):**

1. Crea un perfil con nombre explícito contra tu ambiente de práctica, con la URL que anotaste en la Microlección 1:
   ```bash
   pac auth create --name sit-practica-dev --environment "https://orgXXXXXXXX.crm.dynamics.com"
   ```
   **Qué deberías ver:** se abre un diálogo de inicio de sesión de Microsoft Entra ID; al terminar, el comando confirma que guardó el perfil. **Si estás en WSL2 o en un entorno sin navegador**, agrega `--deviceCode` (es un switch, no lleva valor) y escribe en un navegador el código que te muestra.
2. Lista los perfiles: `pac auth list`. **Qué deberías ver:** una tabla con las columnas `Index`, `Active`, `Kind`, `Name`, `Friendly Name`, `Url`, `User`, `Cloud` y `Type`, y un `*` en la columna `Active` del perfil activo.
3. Comprueba a dónde apunta: `pac env who`. **Qué deberías ver:** los datos de la organización activa. Compara la URL y el ID con los de la Microlección 1, campo por campo. **Si no coinciden**, o si ves el ambiente **(default)**, no sigas: haz la micropráctica de abajo.
4. **Diagnosticar antes de seguir — micropráctica (7 min):** a un compañero le pasó: su perfil se llama `sit-practica-dev`, pero `pac solution list` muestra soluciones que no reconoce → **[Diagnosticar: el perfil apunta a otro ambiente](/practica/ip-ia-038-diagnosticar-perfil-apunta-a-default)**.
5. **Si tienes un segundo ambiente** (otro Sandbox o un Trial), crea un segundo perfil con `--name sit-practica-test` y practica el cambio **por nombre**, verificando después de cada cambio:
   ```bash
   pac auth select --name sit-practica-test
   pac env who
   pac auth select --name sit-practica-dev
   pac env who
   ```
6. Ejecuta un comando de **solo lectura** fijando el destino en la misma línea, aunque el perfil activo ya apunte ahí: `pac solution list --environment "https://orgXXXXXXXX.crm.dynamics.com"`. Esa es la forma de que un comando que **sí** modifica (export, import) no dependa de qué perfil quedó activo.
7. En tu repositorio local crea un `.env.example` **sin valores reales** que documente qué variables usará tu proyecto, por ejemplo `PP_DEV_URL=`, `PP_TEST_URL=` y `PP_PROD_URL=`. El `.env` con valores reales no se sube a Git.
8. **Prompt seguro para pedir ayuda de diagnóstico** (nunca pegues el output real de `pac auth list` ni URLs reales de tu tenant si son confidenciales):
   ```
   Rol: ayudas a diagnosticar problemas de conexión de Power Platform CLI.
   Contexto: ejecuté `pac auth create --name {{NOMBRE_PERFIL}} --environment {{URL_ENTORNO_PLACEHOLDER}}`
   y me da un error de autenticación. Instalé pac con {{método}} y la segunda línea de `pac` dice
   "Version: {{versión}}".
   Tarea: dame los 3 diagnósticos más probables en orden de frecuencia y qué comando ejecutaría para
   confirmar cada uno.
   Restricción: no necesito pegar mi URL real ni credenciales — usa el placeholder tal cual.
   ```
   *Evalúa:* ¿la IA sugiere verificar la versión de `pac` y el tipo de entorno antes de asumir un problema de credenciales? Pasa cada comando que sugiera por `pac <comando> help` antes de ejecutarlo, como en la Microlección 2.

**Variante en papel (sin ambiente):** con [Learn: pac auth](https://learn.microsoft.com/power-platform/developer/cli/reference/auth), escribe los comandos de los pasos 1, 2, 3 y 5 para dos ambientes inventados y explica qué columna de `pac auth list` y qué comando usarías para saber a dónde vas a exportar.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre de tu perfil y valor de la columna `Active` en `pac auth list` | ___ |
| URL que mostró `pac env who` y si coincide con la de la Microlección 1 (sí/no, campo por campo) | ___ |
| Si tuviste dos perfiles: qué mostró `pac env who` después de cada `pac auth select --name` | ___ |
| Resultado de `pac solution list --environment ...` (cuántas soluciones; no pegues datos confidenciales) | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — la política de perfiles de tres clientes

> **Situación:** atiendes a tres clientes, cada uno con Dev, Test y Prod. Tu jefe te pide una política escrita de cómo manejas los perfiles de `pac` en tu laptop, porque el incidente del Caso Real no se puede repetir. Hay dos posturas en el equipo: una dice que cada consultor tenga los nueve perfiles listos "para no perder tiempo"; otra, que en la laptop nunca haya perfiles de Prod y que a Prod solo se llegue por un pipeline con aprobación (Módulo 54).
> **Entrega:** tu política en cinco a ocho líneas: convención de nombres (recuerda el límite de 30 caracteres), qué perfiles existen en la laptop y cuáles no, qué comprobación haces antes de cualquier comando que modifique algo, y qué haces al terminar con un cliente.

No hay una única respuesta correcta: la evidencia es tu política escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Los nombres no se pueden confundir | Cliente y etapa aparecen en el nombre, y cabe en 30 caracteres |
| Distingues etiqueta de verdad | Tu comprobación usa `pac env who` (o `--environment` explícito), no solo el nombre del perfil |
| Decides sobre Prod con razones | Dices si hay perfiles de Prod en la laptop y qué riesgo aceptas o eliminas con esa decisión |
| Sirve para otra persona | Un consultor nuevo puede seguirla sin preguntarte |
| Cierras el ciclo | Dices qué haces con los perfiles de un cliente que terminó (por ejemplo, `pac auth delete --name ...`) |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu política | ___ |
| Postura del equipo con la que estás más en desacuerdo y por qué | ___ |

---

## 🔁 Reto de transferencia — Un script que se ejecuta sin nadie delante

Cambia el contexto y comprueba si entendiste el patrón. El equipo quiere un script que cada noche exporte la solución de Dev de un cliente y la importe en Test. Nadie va a estar mirando la terminal: no hay quien lea `pac env who` antes del import, y el perfil "activo" de la máquina que lo ejecuta puede ser cualquiera.

1. **Micropráctica (8 min):** **[Transferir: un script de despliegue que no depende del perfil activo](/practica/ip-ia-039-transferir-script-sin-perfil-activo)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** escribe el esqueleto del script en PowerShell o bash (no lo ejecutes contra ningún ambiente) con estas reglas, verificando cada parámetro con `pac <comando> help`: cómo se autentica sin una persona (Learn muestra `pac auth create` con `--applicationId`, `--clientSecret` y `--tenant`, y recuerda agregar la entidad de servicio al ambiente); de dónde salen las URLs; cómo comprueba el destino antes de importar y qué hace si no coincide; y dónde **no** puede aparecer el secreto.

**Evidencia a reportar:**

| Requisito | Tu decisión | Cómo comprobarías que funciona sin tocar Prod |
|---|---|---|
| Autenticación sin persona | ___ | ___ |
| De dónde salen las URLs de Dev y Test | ___ | ___ |
| Verificación del destino antes de importar | ___ | ___ |
| Dónde vive el secreto (y dónde nunca) | ___ | ___ |

### 💼 Casos Reales de Negocio
Un consultor de Servicios Integrados Tecnológicos S.A. (SIT) atendía tres clientes distintos en la misma semana y tenía perfiles de `pac auth` guardados para cada uno. Un viernes, sin ejecutar `pac org who` antes de un `pac solution export`, exportó y sobrescribió sin querer una solución del Cliente B pensando que estaba conectado al entorno de pruebas del Cliente A — el perfil activo había quedado seleccionado de la sesión anterior. Ningún dato de producción se perdió porque no era el ambiente productivo, pero el incidente generó confusión y retrabajo. Desde entonces, el equipo adoptó como regla obligatoria: **ejecutar `pac org who` antes de cualquier comando que exporte, importe o modifique algo**, y nombrar los perfiles de forma explícita por cliente y entorno (ej. `sit-cliente-a-dev`, `sit-cliente-a-prod`).

### ✅ Buenas Prácticas
- Practica y experimenta siempre en un entorno **Developer** o **Sandbox** propio, nunca en Production ni en un entorno compartido sin coordinar con el equipo.
- Ejecuta `pac env who` (o su nombre anterior, `pac org who`) antes de cualquier comando que exporte, importe o modifique datos/soluciones, sin excepción, y compara lo que muestra con datos que anotaste antes, no con tu memoria.
- En los comandos que modifican algo, fija el destino con `--environment` en la misma línea: así no dependen del perfil que quedó activo.
- Crea cada perfil con `--name` y `--environment`; sin `--environment`, el perfil queda conectado al ambiente Default del tenant.
- Selecciona perfiles por nombre (`pac auth select --name`), no por un índice que cambia cuando agregas o borras perfiles.
- Nombra tus perfiles de forma clara por cliente/entorno para evitar confundirlos cuando manejas múltiples tenants.
- Instala `pac` solo por un método documentado en Learn y comprueba cada comando que te sugiera una IA con `pac <comando> help` antes de ejecutarlo.
- Nunca compartas ni subas a git el resultado de `pac auth list` ni ningún archivo de configuración local que contenga tokens o rutas de credenciales.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Ejecutar un comando destructivo contra el entorno equivocado | No verificar el perfil activo antes de operar | Ejecutar siempre `pac env who` antes de exportar/importar/modificar, o fijar el destino con `--environment` |
| Confundir "Default environment" con un entorno de desarrollo propio | Asumir que el entorno compartido del tenant es seguro para experimentar | Crear un entorno Developer o Sandbox dedicado para práctica |
| El perfil nuevo apunta al ambiente **(default)** | Se creó con `pac auth create` sin `--environment` | `pac auth update --index <n> --environment <URL>` (o `pac env select --environment <URL>`) y confirmar con `pac env who` |
| Perder el rastro de a qué cliente pertenece cada perfil de `pac auth` | Nombrar los perfiles de forma genérica o no nombrarlos | Usar convención de nombres clara (cliente-entorno) al crear cada perfil, o renombrarlos con `pac auth name --index <n> --name <nombre>` |
| `pac --version` muestra la versión y después `Error: Not a valid command` | `--version` no es un comando de `pac` | Escribir `pac` a secas: la versión aparece en la segunda línea |
| `pac auth select --index 0` falla | El índice empieza en 1 | Usar el índice que muestra `pac auth list`, o mejor `--name` |
| `npm install -g @microsoft/powerplatform-cli` falla o instala algo inesperado | No es un método documentado y ese paquete no existe en npm | Instalar con la extensión de VS Code, la herramienta .NET o el MSI, según Learn |
| `pac` no se reconoce en una ventana de PowerShell fuera de VS Code | Se instaló solo la extensión, que por defecto habilita `pac` en la terminal de VS Code | Usar la terminal de VS Code, o instalar también la herramienta .NET o el MSI |
| `dotnet tool install` falla con un mensaje sobre `DotnetToolSettings.xml` | El paquete actual de PAC CLI está compilado para .NET 10 y la máquina tiene un SDK anterior | Instalar .NET 10, o usar la extensión de VS Code |
| Instalar `pac` sin verificar la versión y encontrar comandos que no existen en tutoriales antiguos | No revisar la versión ni la documentación oficial vigente | Ver la versión con `pac` y consultar `pac <comando> help` para el comando exacto disponible |

### 🧪 Criterios de Validación
- [ ] Encontré en el centro de administración la URL, el Environment ID y el Organization ID de mi ambiente de práctica, y el nombre del ambiente Default de mi tenant
- [ ] Instalé Power Platform CLI por un método documentado en Learn y anoté la versión que muestra `pac`
- [ ] Revisé línea por línea la guía de instalación de la IA con `pac <comando> help` y Learn, y escribí mi versión corregida
- [ ] Creé un perfil de autenticación con `--name` y `--environment` contra un entorno Developer o Sandbox (no producción)
- [ ] Listé mis perfiles con `pac auth list` y seleccioné uno explícitamente con `pac auth select --name`
- [ ] Verifiqué la organización activa con `pac env who` y la comparé con los datos de la Microlección 1 antes de continuar
- [ ] Diagnostiqué el perfil que apunta a otro ambiente formulando una hipótesis antes de ver la causa
- [ ] Explico la diferencia entre tenant, environment y organización con mis propias palabras
- [ ] Uso el prompt de diagnóstico con placeholders, sin pegar nunca URLs o credenciales reales, y verifico cada sugerencia contra `pac help` antes de ejecutarla
- [ ] Defendí por escrito una política de perfiles para tres clientes contra la rúbrica
- [ ] En el reto de transferencia diseñé un script que no depende del perfil activo ni guarda secretos en el código
- [ ] Relaciono este módulo con el Lab 52 (CLI y conexión al tenant) como práctica hands-on directa

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de la decisión y del reto de transferencia.
- Tu guía de instalación corregida y tu `.env.example` sin valores reales.
- La salida de `pac auth list` y de `pac env who` **sin datos confidenciales** (tapa usuario y URL si hace falta).

> **Siguiente paso:** el [Lab 52](/labs/lab-52-cli-conexion-tenant) repite la conexión con un segundo perfil y tu checklist personal, el [Lab 56](/labs/lab-56-cambiar-entornos-dev-test-prod) practica el cambio seguro entre Dev, Test y Prod, y el Módulo 54 usa estos perfiles para exportar y desempaquetar soluciones.

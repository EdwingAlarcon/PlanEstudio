# Guía de herramientas de estación de trabajo

Esta guía complementa la matriz de [`/preparar-entorno`](/preparar-entorno) y el
[script verificador de estación](https://github.com/EdwingAlarcon/PlanEstudio/tree/master/tools):
mientras la matriz te dice **qué** necesitas según tu perfil y el verificador te dice **si ya lo
tienes**, esta guía te explica **cómo instalarlo** y **qué hacer cuando algo falla**.

No repite el detalle específico de cada certificación (eso vive en los módulos). Cubre solo las 7
herramientas que aparecen en la matriz de `/preparar-entorno`: Navegador moderno, Git, Visual Studio
Code, Visual Studio Community, Node.js LTS, .NET SDK y Power Platform CLI, más PowerShell y Power
Automate Desktop.

## Cómo usar esta guía

1. Entra a `/preparar-entorno`, elige tu perfil y tu sistema operativo.
2. Para cada herramienta marcada como obligatoria, ven a la sección correspondiente de esta guía.
3. Instala, verifica con el comando indicado, y vuelve a `/preparar-entorno` para marcarla como
   instalada o verificada.
4. Si tienes varias herramientas pendientes, corre el
   [script verificador de estación](/preparar-entorno) una sola vez al final en vez de marcar cada
   una a mano — ver la sección "Importar reporte del verificador" en `/preparar-entorno`.

## Antes de instalar nada: tu cuenta y tu tenant

Ninguna herramienta de esta guía sirve sin esto primero — es el bloqueo real anterior a todo lo
demás, y si es tu primera vez con software de trabajo en la nube, aquí es donde más tiempo conviene
invertir con calma. No necesitas tarjeta de crédito para el trial gratuito estándar.

1. **Crea tu cuenta Microsoft 365 Developer** (gratuita, distinta a tu correo personal):
   - Entra a [developer.microsoft.com/microsoft-365/dev-program](https://developer.microsoft.com/microsoft-365/dev-program).
   - Clic en **Join now**, usa un correo cualquiera para registrarte (no necesita ser corporativo).
   - Elige la opción de suscripción **Instant sandbox** — te da un tenant de prueba con datos de
     ejemplo ya cargados, sin esperar activación manual.
   - Verificación de identidad: puede pedir un número de teléfono para enviarte un código por SMS.
     Es normal, es solo para confirmar que eres una persona real, no un bot.
2. **Qué es un "tenant" en la práctica**: es tu organización de prueba completa — un nombre como
   `tunombreXXXXX.onmicrosoft.com` que verás en la esquina superior derecha de cualquier pantalla de
   Microsoft. Todo lo que hagas en el curso vive dentro de ese tenant; no afecta a nadie más.
3. **Activa el trial de Dynamics 365** (necesario desde el Módulo 1 en adelante):
   - Dentro de tu tenant recién creado, ve a
     [Power Platform Admin Center](https://admin.powerplatform.microsoft.com).
   - **Environments** → confirma que existe un ambiente (usualmente se crea uno automático con el
     Developer Program).
   - Si necesitas Dynamics 365 apps (Sales, Customer Service) para labs específicos del nivel D365,
     actívalos desde ese mismo ambiente en la sección **Dynamics 365 apps**.
4. **Si algo se traba** (verificación pendiente, error de creación de tenant, pantalla en blanco):
   - Espera — puede tardar minutos o hasta 24 horas si Microsoft pide revisión manual. No es un
     error tuyo ni de esta guía.
   - Cierra sesión, borra caché del navegador, o prueba en una ventana privada antes de repetir el
     registro — registrar el mismo correo dos veces suele generar el error más confuso de este paso.
   - Guarda una captura del mensaje de error como evidencia de avance mientras esperas — el Módulo 1
     ya contempla esto como progreso válido.

Una vez tengas tu tenant y ambiente activos, continúa con **Navegador moderno** abajo.

## Navegador moderno

**Para qué**: acceso a Power Apps Maker Portal, Power Platform Admin Center, Dynamics 365 y a esta
misma app. Obligatorio para todos los perfiles.

- **Instalación**: cualquier navegador moderno con actualizaciones activas (Microsoft Edge, Chrome,
  Firefox). Windows ya trae Edge preinstalado.
- **Verificación**: no tiene comando de verificación por CLI — se confirma abriendo
  `https://make.powerapps.com` y viendo que carga sin advertencias de compatibilidad.
- **Errores comunes**: extensiones de bloqueo de scripts o políticas corporativas de proxy pueden
  romper el Maker Portal. Si una pantalla no carga, primero prueba en una ventana privada/incógnito
  antes de asumir un problema de la plataforma.

## Cómo abrir una terminal por primera vez

A partir de aquí vas a ver comandos como `git --version`. Si nunca has usado una terminal, esta
sección es para ti — **no la saltes**, porque ningún otro punto de esta guía ni de las prácticas
`GL-SETUP` explica esto.

**Qué es una terminal**: una ventana donde escribes texto (comandos) en vez de hacer clic, y el
programa te responde con más texto. No es peligrosa por sí sola — lo que hace peligroso a un
comando es lo que tú decides ejecutar en ella, no la ventana en sí.

**Cómo abrirla según tu sistema operativo:**

- **Windows**: presiona la tecla `Windows`, escribe `Terminal` (o `PowerShell`) y presiona Enter
  cuando aparezca la aplicación en los resultados. Alternativa: clic derecho sobre el botón Inicio →
  **Terminal**. No uses "Ejecutar como administrador" a menos que un paso de esta guía lo pida
  explícitamente — la mayoría de comandos de este curso no lo necesitan.
- **macOS**: presiona `Cmd + Espacio` para abrir Spotlight, escribe `Terminal` y presiona Enter.
  La aplicación vive en Aplicaciones → Utilidades → Terminal si prefieres buscarla a mano.
- **Linux**: presiona `Ctrl + Alt + T` (funciona en la mayoría de distribuciones de escritorio) o
  abre el menú de aplicaciones y busca `Terminal`/`Konsole`/`GNOME Terminal` según tu distribución.

**Cómo ejecutar tu primer comando de forma segura:**

1. Copia el comando exactamente como aparece (por ejemplo `git --version`).
2. Haz clic dentro de la ventana de la terminal para asegurarte de que tiene el foco.
3. Pega el comando: `Ctrl+V` en Windows/Linux, `Cmd+V` en macOS (algunas terminales de Windows usan
   clic derecho para pegar en vez de `Ctrl+V`).
4. Presiona Enter.
5. Lee la salida antes de continuar: un número de versión significa que funcionó; un mensaje como
   `comando no encontrado` / `command not found` / `no se reconoce como un comando` significa que la
   herramienta no está instalada todavía o que necesitas cerrar y volver a abrir la terminal después
   de instalarla (el instalador actualiza el `PATH`, pero las ventanas ya abiertas no se enteran solas).

**Terminal, PowerShell, CMD y shell — la diferencia mínima que necesitas:** "terminal" es la ventana;
"PowerShell", "CMD" (Símbolo del sistema) y "bash/zsh" (macOS/Linux) son los programas que interpretan
lo que escribes dentro de esa ventana — el "shell". Este curso usa comandos compatibles con
PowerShell en Windows y con el shell por defecto de macOS/Linux; si un comando no funciona en CMD
clásico, abre PowerShell en su lugar.

**Seguridad básica**: no ejecutes un comando que no entiendas solo porque alguien (o un sitio) te
lo pidió, especialmente si pide desactivar el antivirus, descargar un archivo de un enlace
desconocido, o dar permisos de administrador sin que esta guía o el módulo correspondiente lo hayan
pedido explícitamente. Todos los comandos de este curso son de solo lectura o configuración local
(`--version`, `config --global`, instaladores oficiales) — ninguno requiere permisos elevados salvo
que se indique lo contrario.

## Git

**Para qué**: control de versiones para soluciones exportadas, ALM, Copilot Studio y cualquier
proyecto de código (Power Apps Code Apps, plugins, Power Pages). Recomendado o requerido según
perfil (ver matriz).

- **Instalación**:
  - Windows: [git-scm.com/downloads](https://git-scm.com/downloads) (instalador oficial) o
    `winget install --id Git.Git`.
  - macOS: `brew install git` o el instalador de [git-scm.com](https://git-scm.com/downloads).
  - Linux: `sudo apt install git` (Debian/Ubuntu) o el gestor de paquetes de tu distribución.
- **Verificación**: `git --version` debe imprimir `git version X.Y.Z`.
- **Configuración mínima recomendada**:
  ```
  git config --global user.name "Tu Nombre"
  git config --global user.email "tu@correo.com"
  ```
- **Errores comunes**:
  - `git: command not found` tras instalar en Windows → cierra y vuelve a abrir la terminal; el
    instalador actualiza el `PATH` pero las terminales ya abiertas no lo recargan solas.
  - Autenticación rechazada contra GitHub/Azure DevOps con contraseña → usa un
    [personal access token](https://docs.github.com/en/authentication) o el gestor de credenciales
    de tu SO; las contraseñas de cuenta dejaron de aceptarse hace años en la mayoría de plataformas.

## Visual Studio Code

**Para qué**: editor principal para Power Fx, JavaScript/TypeScript de Power Pages, YAML de Copilot
Studio, y cualquier código que acompañe una solución. Recomendado para makers/funcionales,
obligatorio para developers.

- **Instalación**: [code.visualstudio.com](https://code.visualstudio.com) (Windows/macOS/Linux) o
  `winget install Microsoft.VisualStudioCode` en Windows.
- **Verificación**: no tiene comando CLI universal declarado en la matriz (se marca manualmente en
  `/preparar-entorno`); si instalaste el acceso de línea de comandos, `code --version` confirma la
  instalación.
- **Extensiones útiles para este plan de estudio**: "Power Platform Tools" (oficial de Microsoft,
  necesaria para usar PAC CLI integrado), "YAML", "ESLint".
- **Errores comunes**: en Linux, si `code` no abre desde terminal tras instalar el `.deb`/`.rpm`,
  reinicia sesión o agrega manualmente `/usr/share/code/bin` al `PATH`.

## Visual Studio Community

**Para qué**: desarrollo de plugins C# para Dataverse, extensiones de código para Dynamics 365
Finance & Operations, y proyectos .NET más grandes que lo que conviene mantener en VS Code. Solo
aplica a developers avanzados y arquitectos; no lo instales si tu ruta es maker o funcional — ni la
matriz de `/preparar-entorno` te lo pedirá.

- **Instalación (solo Windows)**:
  [visualstudio.microsoft.com/vs/community](https://visualstudio.microsoft.com/vs/community/).
  Durante la instalación, selecciona la carga de trabajo ".NET desktop development" como mínimo; si
  vas a compilar plugins de Dataverse, no necesitas la carga de Azure completa.
- **Verificación**: no tiene comando CLI — se marca manualmente en `/preparar-entorno`.
- **Errores comunes**: instalar todas las cargas de trabajo disponibles consume decenas de GB
  innecesariamente. Instala solo lo que tu módulo actual requiera; puedes añadir más cargas después
  desde el "Visual Studio Installer" sin reinstalar todo.

## Node.js LTS

**Para qué**: Power Apps Code Apps, scripts de build de este mismo repositorio, y tooling moderno de
frontend. Solo aparece como `required_later` para developers — no lo instales antes de necesitarlo.

- **Instalación**:
  - Windows/macOS: [nodejs.org](https://nodejs.org) (elige la versión **LTS**, no la "Current").
  - Linux: usa [nvm](https://github.com/nvm-sh/nvm) en vez del gestor de paquetes del sistema para
    evitar versiones desactualizadas: `nvm install --lts`.
- **Verificación**: `node --version` debe imprimir `vX.Y.Z` con `X` par (las versiones LTS son
  siempre pares: 18, 20, 22...).
- **Errores comunes**: tener dos instalaciones de Node compitiendo en el `PATH` (una del instalador
  oficial y otra de nvm) produce comportamiento inconsistente entre terminales. Si `node --version`
  da resultados distintos en dos terminales, revisa cuál `PATH` tiene prioridad en cada una.

## .NET SDK

**Para qué**: compilar plugins de Dataverse en C#, custom workflow activities, y cualquier proyecto
.NET del roadmap de developer/arquitecto. `required_later`, igual que Node.js.

- **Instalación**: [dotnet.microsoft.com/download](https://dotnet.microsoft.com/download) — instala
  la versión LTS más reciente salvo que un módulo pida una versión específica.
- **Verificación**: `dotnet --info` debe mostrar la versión del SDK instalado sin errores.
- **Errores comunes**: instalar solo el "Runtime" en vez del "SDK" — el runtime no incluye
  herramientas de compilación (`dotnet build`, `dotnet new`) y `dotnet --info` mostrará una lista de
  runtimes pero ningún SDK. Verifica que la sección "SDKs" del output no esté vacía.

## PowerShell (7+)

**Para qué**: scripts de administración de Power Platform, el propio
[script verificador de estación](/preparar-entorno) en Windows, y automatización de tareas
repetitivas. Recomendado para casi todos los perfiles, obligatorio para admins.

- **Instalación**:
  - Windows ya trae "Windows PowerShell" 5.1, pero se recomienda PowerShell 7+:
    `winget install Microsoft.PowerShell`.
  - macOS/Linux: sigue la
    [guía oficial de instalación](https://learn.microsoft.com/powershell/scripting/install/installing-powershell)
    (`brew install powershell/tap/powershell` en macOS).
- **Verificación**: en Windows, `$PSVersionTable` muestra `PSVersion`; en macOS/Linux, `pwsh --version`.
- **Errores comunes**: confundir "Windows PowerShell" (`powershell.exe`, versión 5.1, solo Windows)
  con "PowerShell" (`pwsh`, multiplataforma, versión 7+). Los scripts de este plan de estudio
  (incluido `tools/check-workstation.ps1`) se probaron en PowerShell 7+; si algo falla en 5.1,
  actualiza antes de reportarlo como un bug del contenido.

## Power Platform CLI (`pac`)

**Para qué**: exportar/importar soluciones, ALM por línea de comandos, conexión segura al tenant sin
usar el navegador, y automatización de despliegues. Obligatorio para developers, recomendado para
admins y arquitectos.

- **Instalación**:
  - Como herramienta de .NET (multiplataforma, requiere .NET SDK primero):
    `dotnet tool install --global Microsoft.PowerApps.CLI.Tool`.
  - En Windows también existe un instalador MSI independiente — ver la
    [documentación oficial](https://learn.microsoft.com/power-platform/developer/cli/introduction).
  - Como extensión de Visual Studio Code: instala "Power Platform Tools" desde el marketplace.
- **Verificación**: `pac --version` debe imprimir la versión del CLI.
- **Configuración mínima recomendada**: conéctate a un entorno de práctica (nunca producción) antes
  de tu primer lab que lo requiera:
  ```
  pac auth create --name PlanEstudio --environment "https://TU_ORG.crm.dynamics.com" --deviceCode
  ```
- **Errores comunes**:
  - `pac: command not found` tras instalar vía `dotnet tool install` → confirma que la carpeta de
    herramientas globales de .NET (`~/.dotnet/tools` en Linux/macOS, `%USERPROFILE%\.dotnet\tools` en
    Windows) está en el `PATH`; el instalador la agrega, pero terminales ya abiertas no lo recargan.
  - Error de autenticación al usar `--deviceCode` en un equipo sin navegador disponible → usa
    `pac auth create --name PlanEstudio --environment "..." --username "..." --password "..."` solo
    en un entorno de práctica, nunca con credenciales de producción en texto plano en un script
    compartido.

## Power Automate Desktop

**Para qué**: automatización de escritorio (RPA) con desktop flows. Obligatorio solo para el perfil
`rpa`; el detalle completo de instalación, runtime y arquitectura vive en el
[Módulo 67 — Entorno, instalación y arquitectura PAD](/nivel/rpa/modulo/entorno-instalacion-arquitectura-pad)
y en [`/recursos/rpa-recursos-practica`](/recursos/rpa-recursos-practica). Esta guía no lo repite
aquí para evitar mantener el mismo contenido en dos lugares.

## Si el script verificador reporta "no instalada" y tú sí la tienes instalada

El [script verificador de estación](/preparar-entorno) solo prueba el comando exacto documentado
arriba. Causas típicas de un falso "no instalada":

- La herramienta está instalada pero no en el `PATH` de la terminal desde la que corriste el script.
- Instalaste una versión portable/zip sin registrar el ejecutable en el `PATH`.
- En Windows, instalaste dentro de una terminal y luego corriste el script en otra terminal ya
  abierta antes de la instalación.

En cualquiera de estos casos, cierra y abre una terminal nueva y vuelve a correr el script antes de
reportarlo como un problema del contenido.

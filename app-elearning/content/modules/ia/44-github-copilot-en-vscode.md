---
moduleId: 44
title: "GitHub Copilot en VS Code"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 22
practiceMinutes: 200
slug: "github-copilot-en-vscode"
lastVerified: "2026-11"
---
### 🎯 Objetivo
Usar GitHub Copilot en VS Code (sugerencias inline, Copilot Chat con sus agentes Ask, Agent y Plan, e instrucciones personalizadas del repositorio) de forma productiva en proyectos reales del plan de estudio —componentes PCF, Code Apps y plugins C#— **sin aceptar a ciegas lo que genera**: detectar en una salida generada una API que no existe, un secreto en el código o un patrón del proyecto ignorado, corregirlo y dejar evidencia de qué verificaste y contra qué fuente.

> **Cómo está organizado este módulo:** cada concepto viene con una micropráctica de feedback inmediato y luego una práctica real en VS Code, con una tabla de evidencia donde anotas el dato exacto que viste. El centro del módulo es una **actividad de fallo y corrección** (Microlección 3): recibes un plugin generado por IA con errores plausibles, los encuentras contra la referencia oficial de la API, los corriges y luego comparas tu corrección con la del agente. En la Microlección 3 vas a **diagnosticar** un síntoma antes de ver la causa, y el módulo cierra con un **reto de transferencia** donde decides y defiendes cómo delegar una tarea grande al agente.
>
> **Antes de empezar (lee esto, ahorra media hora):**
> - **Este módulo es transversal y no necesita tenant:** no exige los módulos de PCF ni de plugins. El código con el que trabajas viene dentro del módulo; **no necesitas compilar C#**: verificas contra la referencia de la API en Microsoft Learn. Si nunca leíste C#, no te preocupes: la Microlección 3 trae pistas graduadas antes de la solución. Si ya hiciste los Módulos 13, 23 o 27, puedes repetir las prácticas sobre tu propio código.
> - **Tiempo:** la primera vez, cuenta unas 3 horas y media de práctica (más 22 minutos de lectura); si nunca leíste C#, la Microlección 3 sola puede llevarte una hora. Mejor en dos sesiones: Microlecciones 1 y 2 en la primera; de la 3 al reto en la segunda.
> - **Software y cuenta:** [Visual Studio Code](https://code.visualstudio.com) y una cuenta de GitHub. Si no tienes suscripción de Copilot, al iniciar sesión quedas en **Copilot Free** ([VS Code: configurar Copilot](https://code.visualstudio.com/docs/copilot/setup)).
> - **Planes (noviembre de 2026, verifica en [GitHub Docs: planes](https://docs.github.com/copilot/get-started/plans)):** **Copilot Free** incluye el modo agente y MCP, con un límite de 2.000 sugerencias de código (*completions*) al mes y una asignación mensual de *GitHub AI Credits*; los planes de pago (**Pro**, **Pro+**, **Max**, **Business**, **Enterprise**) incluyen más créditos por mes. Desde junio de 2026 GitHub mide el uso con *AI Credits*; las *premium requests* quedan solo para suscripciones anuales que siguieron con la facturación anterior ([GitHub Docs: premium requests](https://docs.github.com/copilot/concepts/billing/copilot-requests)). En VS Code ves cuánto llevas consumido en el panel de estado de Copilot de la barra inferior. Con **Copilot Free** cada petición al Chat consume créditos y GitHub no publica cuántos trae Free: este módulo hace unas diez peticiones (cuatro de ellas a **Agent**). **Si te quedas sin créditos**, no abandones: la Microlección 3 se hace igual comparando tu corrección con la solución del módulo, y en la evidencia anotas "sin créditos" en las filas de **Keep**/**Undo** y las completas cuando se renueve tu asignación.
> - **Un cambio reciente que debes conocer:** el antiguo **Edit mode** (antes "Copilot Edits") quedó **obsoleto** en VS Code 1.110 y se elimina por completo en la 1.126; su función la cubre el agente **Agent** ([notas de VS Code 1.111](https://code.visualstudio.com/updates/v1_111)). Si un tutorial te dice "abre Copilot Edits", usa **Agent**.

---

## 🧩 Microlección 1 — Sugerencias inline, Chat y los tres agentes

**¿Qué vas a aprender?** Qué hace cada forma de usar Copilot en VS Code y cuál elegir para cada tarea.

**¿Por qué existe esto?** Elegir mal la herramienta es la primera fuente de cambios no deseados. Según la documentación de VS Code:

| Forma de uso | Qué hace | Cuándo usarla |
|---|---|---|
| **Sugerencias inline** (*ghost text*) | Mientras escribes, propone la continuación en texto atenuado. **Tab** acepta, **Escape** descarta, **Ctrl+Flecha derecha** acepta la siguiente palabra. Usa el código alrededor del cursor y los archivos abiertos. Las **next edit suggestions** proponen además el siguiente cambio y dónde hacerlo | Completar código que ya sabes escribir |
| **Ask** (agente del Chat) | Responde y explora el código **sin cambiar nada**: solo usa herramientas de lectura | Entender código, preguntar antes de tocar |
| **Agent** (agente del Chat) | Implementa cambios en varios archivos y valida el resultado; puede ejecutar comandos de terminal, que **pide aprobar antes de ejecutarlos** salvo que actives la aprobación automática | Cambios acotados con criterio de éxito verificable |
| **Plan** (agente del Chat; en Copilot también `/plan`) | Investiga la tarea y produce un **plan para revisar** antes de implementar | Tareas grandes o con riesgo |

Fuentes: [VS Code: sugerencias inline](https://code.visualstudio.com/docs/copilot/ai-powered-suggestions), [VS Code: agentes integrados](https://code.visualstudio.com/docs/copilot/agents/local-agents), [VS Code: seguridad](https://code.visualstudio.com/docs/agents/run/security).

Tres datos de seguridad que vas a usar en todo el módulo:
- Los cambios del agente se revisan con **Keep** (conservar) y **Undo** (deshacer) junto a cada cambio, o en el diff. Antes de cada petición VS Code guarda un **checkpoint**: **Restore Checkpoint** restaura archivos e historial del chat, pero **no deshace comandos de terminal, peticiones de red ni despliegues** ([VS Code: revisar cambios](https://code.visualstudio.com/docs/agents/run/review-code-edits)).
- Los cambios hechos por comandos de terminal **no aparecen** en la lista de cambios a revisar.
- En una carpeta sin confianza (**Restricted Mode** de *Workspace Trust*), los agentes quedan desactivados: abre en modo de confianza solo código que hayas revisado.

**Ejemplo pequeño:** "¿qué hace `updateView` en este PCF?" → **Ask**. "Agrega validación de nulos a estos tres métodos y corre los tests" → **Agent**. "Migra el componente a la nueva versión de la API en 12 archivos" → **Plan** primero.

**Ahora haz algo — micropráctica (5 min):** decide qué forma de uso corresponde a cada tarea → **[Elegir cómo usar Copilot en VS Code](/practica/ip-ia-007-elegir-modo-copilot-vscode)**.

**Práctica real en VS Code (30 min):**

1. Abre VS Code. Pasa el puntero sobre el icono de Copilot en la barra de estado (abajo) y selecciona **Use AI Features**; elige cómo iniciar sesión y sigue los pasos ([VS Code: configurar Copilot](https://code.visualstudio.com/docs/copilot/setup)). Al terminar, el icono deja de mostrar el aviso de inicio de sesión.
2. Crea una carpeta `sit-copilot-lab`, ábrela con **File** > **Open Folder** y, si VS Code pregunta si confías en los autores, responde que sí (es tu carpeta).
3. Crea el archivo `ValidarSolicitudPlugin.cs` y pega la **salida generada por IA** de la Microlección 3 (baja hasta el bloque de código que empieza con `// Salida generada por IA — CON ERRORES`). No la corrijas todavía.
4. Abre el Chat con **Chat** > **Open Chat** en la barra de título (o **Ctrl+Alt+I**). En el selector de agente del cuadro de chat elige **Ask** y escribe:
   ```
   Explica en menos de 5 líneas qué hace este plugin: qué recibe del contexto, qué consulta
   y qué hace con el resultado.
   ```
5. Compara la explicación con el código. **Ojo:** una explicación fluida no significa que el código sea correcto; anota si Ask mencionó algún problema por su cuenta (sin que se lo pidieras).
6. Escribe al final del archivo `// método que` y espera la sugerencia inline. Acéptala con **Tab** o descártala con **Escape** y anota qué propuso.

**Si no lo ves:** si el Chat no responde, revisa en el icono de Copilot de la barra de estado que la sesión esté iniciada y que no hayas agotado el límite del plan. Si no aparecen los agentes, puede que la carpeta esté en **Restricted Mode**: confía en la carpeta desde el aviso de la parte superior.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Plan de Copilot con el que trabajas (Free, Pro…) y versión de VS Code (**Help** > **About**) | ___ |
| Agentes que ves en el selector del Chat | ___ |
| Frase de Ask que describe el plugin y si mencionó algún error sin pedírselo | ___ |
| Sugerencia inline que propuso en el paso 6 (cópiala) | ___ |

---

## 🧩 Microlección 2 — Instrucciones personalizadas del repositorio

**¿Qué vas a aprender?** A fijar las convenciones del proyecto una sola vez para que Copilot las use en el Chat y en el agente, y a comprobar que de verdad las usó.

**¿Por qué existe esto?** Sin contexto, Copilot genera código "genérico" que compila pero no sigue tu proyecto (el caso real de este módulo: `Console.WriteLine` en vez de `ITracingService`). VS Code admite estos archivos ([VS Code: instrucciones personalizadas](https://code.visualstudio.com/docs/copilot/customization/custom-instructions), [GitHub Docs: instrucciones del repositorio](https://docs.github.com/copilot/how-tos/configure-custom-instructions/add-repository-instructions)):
- **`.github/copilot-instructions.md`**: instrucciones para todo el proyecto.
- **`.github/instructions/*.instructions.md`**: instrucciones por tipo de archivo, con `applyTo` en el encabezado (por ejemplo `applyTo: "**/*.cs"`).
- **`AGENTS.md`** en la raíz: formato compartido por varios agentes (VS Code lo usa por defecto con `chat.useAgentsMdFile`).

Dos detalles que suelen enseñarse mal:
- **Las instrucciones aplican al Chat y a los agentes, no a las sugerencias inline.** La documentación de VS Code lo dice textualmente: "Custom instructions are not taken into account for inline suggestions as you type in the editor".
- **Que el archivo exista no prueba que se usó.** Despliega **References** en la respuesta del Chat: si aparece `.github/copilot-instructions.md`, se usó. Si no aparece, revisa el ajuste `github.copilot.chat.codeGeneration.useInstructionFiles`.

**Ejemplo pequeño:**
```markdown
# Convenciones del proyecto SIT
- Prefijo de columnas Dataverse: `sit_`, nunca `new_`.
- Logging en plugins C#: usar siempre `ITracingService.Trace`, nunca `Console.WriteLine`.
- Nunca escribir claves, tokens ni contraseñas en el código: la configuración sensible de un plugin llega por la configuración segura del paso registrado.
```

**Práctica real en VS Code (25 min):**

1. Antes de crear el archivo, en el Chat con **Agent** pide: `Agrega al plugin un mensaje de log al empezar Execute`. **No aceptes el cambio**: anota qué API de logging usó y selecciona **Undo**.
2. Crea `.github/copilot-instructions.md` con el contenido del ejemplo. Puedes hacerlo a mano o con la paleta de comandos (**Ctrl+Shift+P**) > **Chat: New Instructions File**.
3. Repite la misma petición en un chat nuevo. Despliega **References** en la respuesta y comprueba si aparece el archivo de instrucciones. Anota qué API de logging usó esta vez. Ahora sí puedes revisar el diff y elegir **Keep** o **Undo**.
4. Escribe en el editor el comienzo de una línea de log (`Console.`) y mira la sugerencia inline: comprueba por ti mismo que las instrucciones **no** la cambian. Para que la prueba sea limpia, hazla en un archivo nuevo (`PruebaInline.cs`) y cierra cualquier otro archivo abierto que ya use `Trace` (por ejemplo, si en el paso 3 conservaste el cambio con **Keep**): la sugerencia inline toma contexto del código alrededor del cursor y de los archivos abiertos, así que si ve `Trace` cerca lo propondrá por eso, no por las instrucciones.
5. Crea `.github/instructions/plugins.instructions.md` con este contenido y abre de nuevo el Chat:
   ```markdown
   ---
   applyTo: "**/*.cs"
   ---
   - En plugins, las consultas a Dataverse se construyen con QueryExpression; nunca concatenando texto en FetchXML.
   ```

**Si no lo ves:** si **References** no lista el archivo, comprueba que está exactamente en `.github/copilot-instructions.md` en la raíz de la carpeta abierta, guárdalo y abre un chat nuevo. Para ver si VS Code lo detectó, usa **Chat: Open Customizations** en la paleta de comandos (eso confirma que lo descubrió, no que lo siguió).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| API de logging que usó el agente **sin** instrucciones | ___ |
| API de logging que usó **con** instrucciones y si **References** listó el archivo | ___ |
| ¿Cambió la sugerencia inline de `Console.` tras crear el archivo? (lo que viste) | ___ |
| Contenido final de tu `.github/copilot-instructions.md` | ___ |

---

## 🧩 Microlección 3 — Fallo y corrección: una API que no existe y un secreto en el código

**¿Qué vas a aprender?** A revisar código generado contra la **referencia oficial de la API**, que es la única fuente que decide si un método existe, y a reconocer los fallos que la IA comete con más frecuencia en extensiones de Dataverse.

**¿Por qué existe esto?** Un modelo de lenguaje predice código plausible. Si un método "suena" bien (`RetrieveById`), lo escribe aunque no exista. La interfaz `IOrganizationService` tiene exactamente ocho métodos: `Associate`, `Create`, `Delete`, `Disassociate`, `Execute`, `Retrieve`, `RetrieveMultiple` y `Update` ([Learn: IOrganizationService](https://learn.microsoft.com/dotnet/api/microsoft.xrm.sdk.iorganizationservice)). Y Learn documenta cómo debe ser un plugin ([Learn: escribir un plug-in](https://learn.microsoft.com/power-apps/developer/data-platform/write-plug-in)):
- El registro se hace con **`ITracingService.Trace`**, que escribe en el registro de trazas del plugin (hay que tener activado el *trace logging* del entorno).
- Los datos sensibles se pasan con la **configuración segura** del paso registrado: llegan como el segundo parámetro (`secure`) del constructor y se guardan en una tabla que solo pueden leer los administradores del sistema. Las variables de entorno de tipo **Secret** (Azure Key Vault) **no** sirven aquí: Learn indica que solo están disponibles para flujos, agentes de Copilot Studio y conectores personalizados ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets)).
- El patrón de errores: `FaultException<OrganizationServiceFault>` se envuelve en `InvalidPluginExecutionException`; cualquier otra excepción se registra con `Trace` y se relanza con `throw;`.

**Actividad de fallo y corrección (45 min, sin tenant):** un compañero pidió a Copilot "un plugin que valide la cuenta de una solicitud y rechace solicitudes con una referencia externa repetida". Esto es lo que obtuvo (los nombres lógicos `sit_solicitud`, `sit_cuenta` y `sit_referenciaexterna` son **ejemplos**):

```csharp
// Salida generada por IA — CON ERRORES: no la uses así
using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

public class ValidarSolicitudPlugin : IPlugin
{
    private const string ApiKey = "sk_live_EJEMPLO_NO_ES_REAL_9f3a";   // clave del servicio externo de validación

    public void Execute(IServiceProvider serviceProvider)
    {
        var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        var factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        var service = factory.CreateOrganizationService(context.UserId);

        var target = (Entity)context.InputParameters["Target"];
        var cuentaRef = target.GetAttributeValue<EntityReference>("sit_cuenta");

        Entity cuenta = service.RetrieveById("account", cuentaRef.Id);
        Console.WriteLine("Validando la cuenta " + cuenta["name"]);

        string fetchXml = "<fetch><entity name='sit_solicitud'><filter>" +
            "<condition attribute='sit_referenciaexterna' operator='eq' value='" +
            target["sit_referenciaexterna"] + "' /></filter></entity></fetch>";
        EntityCollection duplicadas = service.RetrieveMultiple(new FetchExpression(fetchXml));
        if (duplicadas.Entities.Count > 0)
            throw new InvalidPluginExecutionException("Ya existe una solicitud con esa referencia externa.");
        // (aquí iría la llamada al servicio externo usando ApiKey; omitida en el ejemplo)
    }
}
```

1. Sin mirar la solución, lista **todos** los problemas que encuentres (hay al menos cinco). Para cada uno escribe: línea, qué está mal, **fuente** que lo confirma (URL de Learn y qué dice) y corrección. Los tres datos de Learn de arriba te dan pistas para cuatro de ellos.
2. Busca tú mismo cada método dudoso en la referencia de la API de Learn (no le preguntes a Copilot si existe: es la misma fuente que lo inventó).
3. **Si encontraste menos de cinco**, usa estas pistas de una en una antes de abrir la solución:
   - **Pista 1:** imagina una solicitud que se guarda **sin** cuenta. ¿Qué devuelve `GetAttributeValue<EntityReference>("sit_cuenta")` en ese caso, y qué pasa en la línea siguiente al leer `.Id` de eso?
   - **Pista 2:** imagina que la referencia externa que escribió el usuario es `ABC'123` (con una comilla simple). Escribe a mano cómo queda el texto de `fetchXml` con ese valor: ¿dónde termina ahora el atributo `value`?
   - **Pista 3:** compila mentalmente: si el código **compilara** (el compilador solo marca `RetrieveById`, con el error CS1061), ¿cuáles de tus problemas seguirían ahí? Los fallos que compilan son los más peligrosos, porque nada te avisa.
4. Compara tu lista con la solución:

**Solución para comparar (léela solo después de escribir la tuya):**

| Línea | Problema | Fuente |
|---|---|---|
| `ApiKey` | Secreto escrito en el código: queda en el repositorio, en cada copia y en el historial de Git | Learn: configuración segura del plug-in |
| `RetrieveById` | **No existe** en `IOrganizationService`; el método es `Retrieve(string, Guid, ColumnSet)` | Learn: IOrganizationService |
| `cuentaRef.Id` | Si la solicitud no tiene cuenta, `GetAttributeValue` devuelve `null` y el plugin falla con `NullReferenceException` | Comportamiento de C# (`null`); validar antes de usar |
| `Console.WriteLine` | No deja ningún rastro útil en Dataverse; se usa `ITracingService.Trace` | Learn: escribir un plug-in > Tracing service |
| FetchXML concatenado | El valor del registro entra como texto en el XML: una comilla en el dato rompe la consulta o cambia su filtro. FetchXML no tiene parámetros; se usa `QueryExpression`, donde el valor va como dato | Learn: filtrar filas con QueryExpression |
| Sin `try/catch` | Los errores del servicio no se registran ni se convierten en un mensaje entendible | Learn: escribir un plug-in > patrón de excepciones |

Si compilas las dos versiones (opcional; con el SDK de .NET y el paquete `Microsoft.CrmSdk.CoreAssemblies`), la versión con errores da **un solo** error de compilación, CS1061 en `RetrieveById`; los otros cinco fallos compilan sin ninguna advertencia. Por eso "compila" no es lo mismo que "está revisado". La versión corregida compila sin errores.

```csharp
using System;
using System.ServiceModel;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

public class ValidarSolicitudPlugin : IPlugin
{
    private readonly string _apiKey; // llega por la configuración segura del paso; no está en el código

    public ValidarSolicitudPlugin(string unsecureConfig, string secureConfig)
    {
        _apiKey = secureConfig;
    }

    public void Execute(IServiceProvider serviceProvider)
    {
        var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        var factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        var service = factory.CreateOrganizationService(context.UserId);
        var tracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

        try
        {
            var target = (Entity)context.InputParameters["Target"];
            var cuentaRef = target.GetAttributeValue<EntityReference>("sit_cuenta");
            if (cuentaRef == null)
            {
                tracing.Trace("ValidarSolicitud: la solicitud no tiene cuenta; no hay nada que validar.");
                return;
            }

            Entity cuenta = service.Retrieve("account", cuentaRef.Id, new ColumnSet("name"));
            tracing.Trace("ValidarSolicitud: validando la cuenta {0}", cuenta.GetAttributeValue<string>("name"));

            var referencia = target.GetAttributeValue<string>("sit_referenciaexterna");
            var query = new QueryExpression("sit_solicitud")
            {
                ColumnSet = new ColumnSet("sit_referenciaexterna"),
                Criteria = new FilterExpression(LogicalOperator.And)
                {
                    Conditions = { new ConditionExpression("sit_referenciaexterna", ConditionOperator.Equal, referencia) } // el valor va como dato, no como texto XML
                }
            };
            EntityCollection duplicadas = service.RetrieveMultiple(query);
            if (duplicadas.Entities.Count > 0)
                throw new InvalidPluginExecutionException("Ya existe una solicitud con esa referencia externa.");
            // (aquí iría la llamada al servicio externo usando _apiKey; omitida en el ejemplo)
        }
        catch (InvalidPluginExecutionException)
        {
            throw; // la regla de negocio ya trae su mensaje para el usuario
        }
        catch (FaultException<OrganizationServiceFault> ex)
        {
            throw new InvalidPluginExecutionException("Ocurrió un error en ValidarSolicitudPlugin.", ex);
        }
        catch (Exception ex)
        {
            tracing.Trace("ValidarSolicitudPlugin: {0}", ex.ToString());
            throw;
        }
    }
}
```

**Variante en TypeScript (opcional, si te mueves más en PCF):** la IA escribió `const r = await context.webAPI.retrieveAllRecords("account", "?$select=name");`. Busca en la referencia de la interfaz `WebAPI` de PCF: sus métodos son `createRecord`, `deleteRecord`, `retrieveMultipleRecords`, `retrieveRecord` y `updateRecord` ([Learn: WebAPI de PCF](https://learn.microsoft.com/power-apps/developer/component-framework/reference/webapi)). La corrección es `retrieveMultipleRecords("account", "?$select=name")`, y las filas llegan en `r.entities`.

**🔧 Diagnosticar antes de corregir (5 min):** al compañero, su versión "arreglada" por el agente no compila y no deja logs → **[Diagnosticar: el plugin generado no compila](/practica/ip-ia-008-plugin-generado-no-compila)**.

**Práctica real en VS Code (25 min):** ahora compara tu corrección con la del agente.
1. Guarda tu corrección en un archivo aparte (`ValidarSolicitudPlugin.mio.cs`) para no perderla.
2. En `ValidarSolicitudPlugin.cs` (la versión con errores), abre el Chat con **Agent** y pide:
   ```
   Revisa este plugin de Dataverse contra la referencia de Microsoft.Xrm.Sdk y corrige: métodos
   que no existan, el secreto en el código (usa la configuración segura del constructor), el
   logging (ITracingService), el lookup que puede ser null y la consulta FetchXML concatenada
   (usa QueryExpression). No cambies la regla de negocio.
   ```
3. Revisa **cada cambio** con **Keep** o **Undo**. Antes de conservar uno, comprueba en Learn cualquier método que no reconozcas.
4. Compara el resultado con tu versión y anota: qué corrigió bien, qué no corrigió y si **inventó** algo nuevo.
5. Si en algún momento subiste un archivo con la clave a GitHub, trátala como expuesta: cámbiala en el servicio que la emitió. *Push protection* de GitHub bloquea los pushes que contienen secretos reconocibles; a nivel de usuario viene activada por defecto para repositorios públicos, y en un repositorio debe activarla un administrador ([GitHub Docs: push protection](https://docs.github.com/code-security/secret-scanning/introduction/about-push-protection)). Es una red de seguridad, no tu revisión.

**Si no lo ves:** si el agente pide ejecutar un comando de terminal (por ejemplo `dotnet build`) y no tienes el SDK de .NET, no lo apruebes: no hace falta compilar para esta práctica. Si después de **Undo** quieres volver al punto de partida, usa **Restore Checkpoint** sobre tu petición.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Problemas que encontraste tú, antes de ver la solución (línea + problema) | ___ |
| Para cada uno, la fuente que lo confirma (URL de Learn o de GitHub Docs) | ___ |
| Problemas que el agente corrigió bien / que no corrigió / que inventó | ___ |
| Cambios que descartaste con **Undo** y por qué | ___ |

---

## 🔁 Reto de transferencia — Decidir y defender cómo delegar una tarea grande al agente

**Requisito nuevo:** tu equipo quiere que el agente de Copilot cambie un componente PCF que hoy llama `context.webAPI` directamente en 9 archivos para que use un único servicio común (`DataService.ts`), y que agregue tests. Restricciones:
1. El repositorio tiene un archivo `.env` con la URL del entorno de desarrollo y un token de pruebas.
2. Hay CI que corre tests en cada pull request; hoy cubren 3 de los 9 archivos.
3. El jefe de equipo quiere terminar "en una sola petición, con permisos para todo, para no aprobar nada".
4. Otros desarrolladores tienen convenciones que el agente desconoce (nombres, manejo de errores con `try/catch` y un mensaje al usuario).

**Lo que entregas (sin pasos, unos 40 minutos):** una decisión escrita de una página que diga: qué agente usas primero y para qué (Ask, Plan, Agent); qué nivel de permisos aceptas para los comandos de terminal y por qué no el que pide el jefe de equipo; qué pones en las instrucciones del repositorio antes de empezar; cómo proteges el `.env` y el token; y cómo revisas el resultado (diff, tests, checkpoints). No hay una única respuesta correcta: se evalúa que cada decisión esté justificada y verificada contra la documentación.

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Elige la herramienta por el riesgo | Justificas empezar con **Plan** (o Ask) antes de **Agent**, con lo que revisarás en el plan |
| Permisos proporcionales | Explicas qué aprobación manual mantienes y citas qué no deshace un checkpoint (terminal, red, despliegues) |
| Contexto explícito | Tu `.github/copilot-instructions.md` (o `.instructions.md` con `applyTo`) recoge las convenciones de la restricción 4, y sabes cómo comprobar en **References** que se usó |
| Secretos fuera del alcance | Propones qué hacer con el token (no en el repositorio, `.env` fuera de Git, rotarlo si se subió) y una protección adicional (por ejemplo, aprobación manual de ediciones a `**/.env` con `chat.tools.edits.autoApprove`, o push protection) |
| Verificación independiente | Tu plan de revisión no depende solo de lo que diga el agente: tests nuevos para los 6 archivos sin cobertura, revisión del diff y verificación de cada API contra la referencia |

Si te atascas, una pista por vez:
- **Pista 1:** relee qué deshace y qué **no** deshace **Restore Checkpoint**: eso decide qué aprobaciones no puedes delegar.
- **Pista 2:** "una sola petición para todo" choca con la restricción 2: sin tests, ¿cómo sabrías que los 6 archivos sin cobertura siguen funcionando?
- **Pista 3:** el `.env` no se protege pidiéndole al agente que no lo lea: se protege sacándolo del repositorio y del alcance de las ediciones automáticas.

**Micropráctica de transferencia (6 min):** las mismas decisiones en otro caso → **[Transferir: delegar una migración al agente](/practica/ip-ia-009-delegar-migracion-al-agente)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Agente y orden de uso que elegiste, con la razón | ___ |
| Nivel de permisos y qué aprobaciones mantienes manuales | ___ |
| Contenido de tus instrucciones del repositorio para esta tarea | ___ |
| Qué haces con el `.env` y el token, con la fuente que lo respalda | ___ |

---

### 💼 Casos Reales de Negocio
Un desarrollador de SIT usó Copilot Chat para generar un plugin C# de validación de un campo de Dataverse sin tener abierto el archivo del plugin base del proyecto (que ya tenía un patrón establecido de logging con `ITracingService`). El código generado usó `Console.WriteLine`, que no funciona dentro de un plugin de Dataverse y no genera ningún log visible. El equipo perdió tiempo depurando en producción hasta notar que el patrón de logging del proyecto no se había seguido — la causa raíz fue no dar a Copilot el contexto del patrón ya establecido.

### ✅ Buenas Prácticas
- Mantener abiertos los archivos relevantes (o un archivo de referencia con el patrón esperado) antes de pedir generación de código.
- Usar `.github/copilot-instructions.md` (y `.instructions.md` con `applyTo` para tipos de archivo) para fijar convenciones del proyecto una sola vez, y comprobar en **References** que se usaron. Recordar que no afectan a las sugerencias inline.
- Elegir el agente por el riesgo: **Ask** para entender, **Plan** para tareas grandes, **Agent** para cambios acotados con criterio de éxito verificable.
- Revisar siempre cada cambio del agente con **Keep**/**Undo** o en el diff antes de conservarlo — nunca aceptar cambios multi-archivo a ciegas — y mantener la aprobación manual de comandos de terminal: un checkpoint no deshace lo que hizo la terminal.
- Verificar cada método desconocido contra la referencia oficial de la API (Learn para Dataverse, PCF y Power Platform), no preguntándole al mismo asistente si existe.
- No escribir secretos en el código ni en los prompts: en plugins, configuración segura del paso; en flujos y conectores, variables de entorno de tipo Secret con Azure Key Vault; si un secreto llegó a Git, rotarlo.
- Abrir con confianza (*Workspace Trust*) solo carpetas cuyo contenido hayas revisado: en **Restricted Mode** los agentes no se ejecutan.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Código generado no sigue el patrón de logging/errores del proyecto | Copilot no tenía contexto del patrón ya establecido | Abrir un archivo de referencia o documentarlo en `.github/copilot-instructions.md`, y comprobar en **References** que se usó |
| Esperar que `.github/copilot-instructions.md` cambie las sugerencias inline | Las instrucciones aplican al Chat y a los agentes, no a las sugerencias mientras escribes | Usar el Chat (Ask/Agent) cuando la convención importa, o escribir tú el patrón para que la sugerencia lo continúe |
| Aceptar cambios del agente sin revisar el diff | Confiar en el resultado por ser multi-archivo y "coherente" | Revisar cada archivo con **Keep**/**Undo** antes de conservar |
| El código usa un método que no existe (`RetrieveById`, `retrieveAllRecords`) | La IA predice un nombre plausible | Verificar en la referencia de la API de Learn y usar el método real (`Retrieve`, `retrieveMultipleRecords`) |
| Un secreto queda escrito en el código generado | Se le dio la clave en el prompt o el modelo puso un valor de ejemplo | Configuración segura del paso (plugins) o variable de entorno Secret (flujos y conectores); rotar si se subió |
| Consulta FetchXML construida concatenando un valor del registro | Patrón frecuente en código generado | `QueryExpression` con `ConditionExpression`, donde el valor va como dato |
| Seguir buscando "Copilot Edits" o **Edit mode** | Quedó obsoleto en VS Code 1.110 | Usar el agente **Agent** (o **Plan** si la tarea es grande) |
| Repetir las mismas convenciones de proyecto en cada prompt | No usar el archivo de instrucciones del repositorio | Centralizar convenciones en `.github/copilot-instructions.md` |

### 🧪 Criterios de Validación
- [ ] Configuro Copilot en VS Code y anoto mi plan, la versión de VS Code y los agentes disponibles
- [ ] Uso **Ask** para explicar el plugin y verifico la explicación contra el código, anotando si mencionó algún error por su cuenta
- [ ] Creo un `.github/copilot-instructions.md` con al menos 2 convenciones del proyecto, compruebo en **References** que se usó y documento la diferencia antes/después
- [ ] Compruebo y explico por qué las instrucciones no cambian las sugerencias inline
- [ ] Encuentro al menos cinco problemas del plugin generado (incluidos el método inexistente y el secreto en el código) y cito para cada uno la fuente oficial que lo confirma
- [ ] Diagnostico el síntoma de la práctica "el plugin generado no compila" antes de ver la solución
- [ ] Comparo mi corrección con la del agente, reviso cada cambio con **Keep**/**Undo** y documento qué corrigió, qué no y qué inventó
- [ ] Entrego la decisión del reto de delegación con su rúbrica completa, sin pedir permisos de "aprobar todo"
- [ ] Relaciono este módulo con el Lab 45 (implementación guiada con IA) o con cualquier lab de desarrollo donde revise código generado antes de integrarlo

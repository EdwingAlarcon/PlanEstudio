---
moduleId: 49
title: "Seguridad, Secretos y Compliance en IA"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 16
practiceMinutes: 150
slug: "seguridad-secretos-y-compliance"
lastVerified: "2026-11"
---
*Lectura: 14-16 min · Práctica: unas 2 horas y media la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2; la segunda, la Microlección 3, la decisión y el reto de transferencia).*

### 🎯 Objetivo
Prevenir la fuga de secretos y datos sensibles hacia prompts o logs de herramientas de IA, y aplicar la política de datos del tenant (residencia, GDPR) al usar estas herramientas sobre datos de Dataverse. Al terminar habrás encontrado y corregido, con pruebas, los fallos de una configuración de conexión generada por IA que "funcionaba", y sabrás dónde tiene que vivir cada secreto: en tu equipo, en el pipeline y en Power Platform.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que observaste, no un sí/no). La Microlección 2 es una actividad de **fallo y corrección**: recibes código generado por IA con errores plausibles de manejo de secretos, los detectas con pruebas y con Git, los corriges y dejas constancia de qué verificaste y contra qué. Cierras **decidiendo y defendiendo** qué datos pueden entrar en un prompt y con un **reto de transferencia** sobre otro artefacto: una variable de entorno de Power Platform.
>
> **Antes de empezar, necesitas:**
> - **Node.js 22 o posterior** (comprueba con `node --version`) y **Git** (`git --version`). Usas el ejecutor de pruebas integrado `node:test` y la opción `--env-file`, que existe desde Node.js 20.6 y dejó de ser experimental en las versiones 22.21 y 24.10 ([documentación de Node.js](https://nodejs.org/api/cli.html)). No instalas nada más.
> - **Opcional para la Microlección 3:** una cuenta de **GitHub Free** y un repositorio **público** de práctica (en él solo pondrás valores inventados). Si además tienes una suscripción de Azure y un ambiente Developer de Power Platform, puedes hacer de verdad la parte de Azure Key Vault; si no, la haces en papel.
> - **Nunca uses un secreto real en este módulo**, ni siquiera de un ambiente de pruebas. Todos los valores de los ejercicios son inventados a propósito.
> - Este módulo es transversal: no necesitas haber hecho ningún nivel de certificación ni tener un tenant de Power Platform para las Microlecciones 1 y 2.

### 📖 Conceptos Clave
- **Fuga de secretos a prompts:** pegar una cadena de conexión, una API key o un connection reference completo dentro de un prompt puede quedar almacenado en el historial de la herramienta o en logs del proveedor, según su política de retención — nunca se debe pegar un secreto real en un prompt, ni siquiera "para que el modelo entienda el contexto".
- **Datos sensibles en el contexto:** igual que con secretos, incluir registros reales de clientes (nombres, historiales médicos, datos financieros) como ejemplo en un prompt expone esos datos a un tercero (el proveedor del modelo) — se debe usar siempre datos ficticios o anonimizados equivalentes en estructura.
- **Residencia de datos y GDPR:** algunos modelos procesan el prompt en regiones específicas; si el tenant tiene requisitos de residencia (ej. datos que no pueden salir de la UE), hay que verificar dónde procesa el proveedor de IA antes de usarlo con datos reales, no asumirlo. En Power Platform, Learn publica dónde se procesan los prompts de Copilot y de las funciones de IA generativa según la región del ambiente: por ejemplo, un ambiente en Europa usa Azure OpenAI dentro del EU Data Boundary, y en uno de Brasil, Canadá o Japón, si el administrador permite mover datos entre regiones, los prompts se procesan en Azure OpenAI en Estados Unidos ([Learn: Move data across regions for Copilots](https://learn.microsoft.com/power-platform/admin/geographical-availability-copilot)).
- **Políticas de tenant:** en el Power Platform admin center, las **data policies** (antes llamadas políticas DLP) clasifican los conectores en **Business**, **Non-business** y **Blocked** por ambiente o por tenant, y con unos conectores virtuales permiten apagar capacidades de los agentes de Copilot Studio ([Learn: Data policies](https://learn.microsoft.com/power-platform/admin/wp-data-loss-prevention)). Las funciones de IA generativa se gobiernan además en cada ambiente, en la tarjeta **Generative AI features** (por ejemplo, la casilla **Move data across regions**). La misma lógica de gobernanza de datos aplicada a conectores aplica a las herramientas de IA.
- **Logs y auditoría:** algunas herramientas registran qué se les pidió y qué devolvieron; esto puede ser deseable para auditoría interna, pero significa que un secreto pegado en un prompt persiste en esos logs también.
- **El historial de Git no olvida:** un secreto que se *commiteó* sigue en el historial aunque un commit posterior lo borre. GitHub indica que el primer paso es **revocar o rotar** el secreto; reescribir el historial no lo saca de los clones que ya existen y, una vez rotado, puede no hacer falta ([GitHub Docs: Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)).
- **Fallar cerrado con la configuración:** si falta un secreto, el programa se detiene con un error que nombra la variable que falta. Un "valor por defecto para que funcione en local" es un secreto escrito en el código y una puerta abierta.
- **Dónde vive cada secreto:** en tu equipo, en un archivo `.env` que Git ignora; en GitHub Actions, en un **secreto del repositorio** (`${{ secrets.NOMBRE }}`); en Power Platform, en **Azure Key Vault**, referenciado desde una variable de entorno de tipo **Secret**. La aplicación que se conecta a Dataverse usa un **application user** con un rol de seguridad propio y mínimo.
- **Quién vigila:** en repositorios públicos, el **secret scanning** de GitHub revisa gratis todo el historial y avisa si encuentra un secreto con un patrón conocido, y la **push protection for users** (activada por defecto en GitHub.com) bloquea el push de esos secretos a repositorios públicos. Ninguno detecta todos los secretos: un valor inventado o con formato libre puede pasar sin aviso ([GitHub Docs: About secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)).

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Limpiar el prompt antes de enviarlo

**¿Qué vas a aprender?** A revisar un prompt con una checklist antes de enviarlo y a reemplazar lo sensible sin quitarle a la IA el contexto que necesita para responder.

**¿Por qué existe esto?** Lo que pegas en un prompt sale de tu control en cuanto pulsas Enter: puede quedar en el historial de la herramienta y en los logs del proveedor. Y casi nunca hace falta: la IA necesita la **forma** del dato (un placeholder, la estructura de una tabla, el mensaje de error), no el dato.

**Ahora haz algo — micropráctica (5 min):** decide qué cambiarías en un borrador de prompt con una cadena de conexión, un token y datos de clientes → **[Limpiar un prompt antes de enviarlo](/practica/ip-ia-028-limpiar-prompt-antes-de-enviar)**.

**Práctica real (25 min):**

1. **Prompt inseguro (nunca lo uses así):**
   ```
   Genera el código de conexión a Dataverse usando esta cadena:
   Server=orgabc123.crm.dynamics.com;User ID=admin@sit.onmicrosoft.com;Password=Contraseña Real123!
   ```
   *Problema:* la credencial real queda en el historial de la herramienta y potencialmente en logs del proveedor.
2. **Prompt seguro equivalente (con placeholders):**
   ```
   Genera el código de conexión a Dataverse usando client-credentials OAuth. Usa los placeholders
   {{TENANT_ID}}, {{CLIENT_ID}} y {{CLIENT_SECRET}} — los valores reales viven en Environment
   Variables/Key Vault, nunca en este prompt ni en el código generado.
   ```
   *Resultado esperado:* código con placeholders explícitos, sin ningún valor real. **Evalúa:** ¿el código generado deja claro dónde deben vivir los valores reales (no hardcodeados)? Guarda la respuesta: en la Microlección 2 vas a revisar una salida de este tipo.
3. **La checklist de auditoría de un prompt.** Aplícala, en este orden, a cada prompt antes de enviarlo:

   | Pregunta | Si la respuesta es sí |
   |---|---|
   | ¿Hay credenciales, cadenas de conexión, tokens (`Bearer ...`), API keys o client secrets? | Reemplázalos por un placeholder con nombre claro (`{{CLIENT_SECRET}}`). Si ya lo enviaste, la credencial está expuesta: rótala. |
   | ¿Hay nombres reales de clientes, empleados o empresas, correos, teléfonos, montos o datos personales? | Cámbialos por datos ficticios con la misma estructura (mismas columnas, mismo formato). |
   | ¿Hay URLs internas, IDs de tenant o de ambiente de producción que la respuesta no necesita? | Placeholder (`{{DATAVERSE_URL}}`). |
   | ¿Hay políticas o documentos internos que no son públicos? | Resume la regla en una frase genérica. |
   | ¿Sigue estando el contexto técnico necesario (nombres de tabla y columna, mensaje de error, versión de la herramienta)? | Consérvalo: la estructura no es el secreto, y sin ella la respuesta empeora. |

4. Revisa un prompt real que hayas usado en un módulo anterior de este nivel (o el de la Microlección 3 del Módulo 46, si lo hiciste) y pásale la checklist. Reescríbelo con placeholders equivalentes en estructura.
5. Busca en la documentación oficial de la herramienta de IA que usas (Copilot, Claude, etc.) su política de **retención** de datos, si usa tus prompts para **entrenar** modelos y en qué **región** procesa las solicitudes. Si la herramienta es Copilot dentro de Power Platform, usa la tabla de regiones de [Learn: Move data across regions for Copilots](https://learn.microsoft.com/power-platform/admin/geographical-availability-copilot). **Si no encuentras uno de los tres datos**, anótalo como "no documentado": también es un hallazgo y cuenta en la decisión de la Microlección 3.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Prompt revisado: qué pregunta de la checklist falló y qué pusiste en su lugar | ___ |
| Contexto técnico que decidiste conservar | ___ |
| Herramienta de IA, URL de su política y fecha de la página | ___ |
| Retención / uso para entrenamiento / región, tal como lo dice la página (o "no documentado") | ___ |

---

## 🧩 Microlección 2 — Fallo y corrección: la configuración de conexión que generó la IA

**¿Qué vas a aprender?** A revisar código generado por IA que maneja secretos, encontrar sus fallos con pruebas, corregirlo y comprobar con Git qué queda en el historial aunque lo borres.

**¿Por qué existe esto?** El error típico no es pegar la contraseña en el prompt: es aceptar un código que **parece** limpio porque lee `process.env`, pero trae un "valor por defecto" para que funcione en local, imprime la configuración entera "para depurar" o deja pasar una variable vacía. Funciona en la demo y filtra el secreto en producción.

**La especificación (esto es lo que pediste, no la salida de la IA):**
- Se leen cuatro variables de entorno: `SIT_TENANT_ID`, `SIT_CLIENT_ID`, `SIT_CLIENT_SECRET` y `SIT_DATAVERSE_URL`.
- Si falta cualquiera (o está vacía), el programa **falla** con un error que nombra la variable que falta, **nunca su valor**, y no inventa otra.
- Ningún log contiene el secreto.
- El código no contiene ningún valor de secreto.
- El cuerpo de la solicitud de token (flujo client credentials) lleva `client_id`, `client_secret`, `scope` con el formato `<URL del ambiente>/.default` y `grant_type=client_credentials`. Ese es el formato que Learn indica para un cliente confidencial ([Learn: Use OAuth authentication with Dataverse](https://learn.microsoft.com/power-apps/developer/data-platform/authenticate-oauth), [Learn: client credentials flow](https://learn.microsoft.com/entra/identity-platform/v2-oauth2-client-creds-grant-flow)).

**La salida de la IA.** Alguien pidió "un módulo que lea la configuración para conectarse a Dataverse con client credentials, sin secretos en el código" y obtuvo esto. El valor `Xq8~...` es inventado:

```js
// config.mjs: salida tal como la entregó el asistente de IA (contiene errores a propósito)
export function leerConfig(env = process.env) {
  const config = {
    tenantId: env.SIT_TENANT_ID,
    clientId: env.SIT_CLIENT_ID,
    clientSecret: env.SIT_CLIENT_SECRET || "Xq8~fake-0000-no-es-real", // valor por defecto para que funcione en local
    url: env.SIT_DATAVERSE_URL || "https://sit-dev.crm.dynamics.com",
  };
  console.log("Configuración cargada:", config); // útil para depurar
  return config;
}

// Cuerpo de la solicitud de token del flujo client credentials, que se envía por POST a
// https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
export function cuerpoSolicitudToken(config) {
  return new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: `${config.url}/.default`,
    grant_type: "client_credentials",
  }).toString();
}
```

**Práctica real (45 min):**

1. **Prueba lo que la IA sí probó.** Crea una carpeta nueva `practica-secretos`, ábrela en una terminal y ejecuta `git init`. Guarda el código de arriba como `config.mjs` y crea `config.test.mjs` con estas dos pruebas:
   ```js
   import { test } from "node:test";
   import assert from "node:assert/strict";
   import { leerConfig, cuerpoSolicitudToken } from "./config.mjs";

   // Valores inventados: nunca uses un secreto real en una prueba.
   const completo = {
     SIT_TENANT_ID: "tenant-de-prueba",
     SIT_CLIENT_ID: "cliente-de-prueba",
     SIT_CLIENT_SECRET: "valor-de-prueba-123",
     SIT_DATAVERSE_URL: "https://sit-dev.crm.dynamics.com",
   };

   test("lee las cuatro variables", () => {
     const config = leerConfig(completo);
     assert.equal(config.clientId, "cliente-de-prueba");
     assert.equal(config.url, "https://sit-dev.crm.dynamics.com");
   });

   test("el cuerpo usa client_credentials y el scope .default", () => {
     const cuerpo = cuerpoSolicitudToken(leerConfig(completo));
     assert.match(cuerpo, /grant_type=client_credentials/);
     assert.match(cuerpo, /scope=https%3A%2F%2Fsit-dev\.crm\.dynamics\.com%2F\.default/);
   });
   ```
   Ejecuta `node --test`. **Qué deberías ver:** `pass 2` y `fail 0`... y, **antes** del resumen, dos bloques `Configuración cargada: { ... clientSecret: 'valor-de-prueba-123', ... }`. El secreto ya salió por la consola y ninguna prueba lo notó. **Si ves un error de importación**, revisa que los dos archivos estén en la misma carpeta y terminen en `.mjs`.
2. **Deja la versión de la IA en el historial** (solo en esta carpeta local; no la subas a ningún sitio todavía): `git add config.mjs config.test.mjs` y `git commit -m "Conexión generada por IA"`. Lo vas a necesitar en el paso 7.
3. **Diagnosticar antes de corregir — micropráctica (7 min):** a un compañero, este mismo código le dejó el secreto en el log del pipeline → **[Diagnosticar: el secreto aparece en el log del pipeline](/practica/ip-ia-029-diagnosticar-secreto-en-log-del-pipeline)**. Formula tu hipótesis antes de abrir las pistas.
4. **Busca los fallos tú.** Escribe **una prueba por cada punto de la especificación** en un archivo nuevo, `config.alumno.test.mjs` (`node --test` encuentra solo los archivos que terminan en `.test.mjs`). Herramientas que vas a necesitar:
   - `assert.throws(() => leerConfig(sinSecreto))` comprueba que la función lanza un error. Para quitar una variable del objeto: `const { SIT_CLIENT_SECRET, ...sinSecreto } = completo;`.
   - Para comprobar qué se escribe en la consola, el ejecutor integrado puede espiar `console.log`:
     ```js
     test("leer la configuración no escribe el secreto en la consola", (t) => {
       const log = t.mock.method(console, "log"); // registra cada llamada a console.log durante esta prueba
       leerConfig(completo);
       const escrito = log.mock.calls.map((llamada) => JSON.stringify(llamada.arguments)).join("\n");
       assert.equal(escrito.includes("valor-de-prueba-123"), false);
     });
     ```
   Pistas de dónde mirar, sin darte las demás pruebas: qué devuelve la función si falta `SIT_CLIENT_SECRET`; a qué ambiente apunta si falta `SIT_DATAVERSE_URL`; qué texto lleva el cuerpo de la solicitud si falta `SIT_CLIENT_ID` (pruébalo: `new URLSearchParams({ client_id: undefined }).toString()`). Ejecuta `node --test` y anota cuáles fallan. **Qué deberías ver:** al menos cuatro pruebas tuyas en rojo.
5. **Corrige `config.mjs`** sin tocar las pruebas. Criterios de aceptación: (1) todas tus pruebas y las dos de la IA pasan; (2) ningún `||` ni `??` inventa un valor para una variable de la especificación; (3) el mensaje de error nombra las variables que faltan, nunca un valor; (4) si necesitas escribir la configuración en un log, hazlo con una función aparte que oculte el secreto (por ejemplo `describirConfig`). Si usas la IA para corregir, dale la especificación y las pruebas que fallan, no solo "arréglalo".
6. **Rompe a propósito para confirmar.** Vuelve a poner temporalmente `|| "Xq8~fake-0000-no-es-real"` en tu versión corregida y ejecuta `node --test`: al menos una prueba tiene que fallar. Si ninguna falla, te falta una prueba. Deshaz el cambio.
7. **Lo que un commit nuevo no borra.** Guarda tu corrección: `git commit -am "Quitar el valor por defecto del secreto"`. Ahora busca el valor:
   - `git grep -n "Xq8~"` busca en los archivos actuales. **Qué deberías ver:** nada.
   - `git log --oneline -S "Xq8~"` busca los commits donde ese texto apareció o desapareció. **Qué deberías ver:** **dos** commits, el que lo introdujo y el que lo quitó. Cualquiera con una copia del repositorio puede leer el primero con `git show`.

   Si hubiera sido un secreto real, borrarlo del código no habría bastado: el primer paso es **revocarlo o rotarlo** (GitHub Docs, enlace en Conceptos Clave).
8. **Valores locales fuera de Git.** Crea un archivo `.gitignore` con una sola línea, `.env`, y un archivo `.env` con las cuatro variables y valores inventados (`SIT_CLIENT_SECRET=valor-de-prueba-123`, etc.). Ejecuta `git check-ignore -v .env`. **Qué deberías ver:** `.gitignore:1:.env	.env` (Git ignora el archivo). Crea `usar-config.mjs`:
   ```js
   import { leerConfig } from "./config.mjs";

   leerConfig(); // lee process.env (la versión de la IA, además, imprime la configuración)
   console.log("Configuración leída");
   ```
   Ejecuta `node --env-file=.env usar-config.mjs` (**qué deberías ver:** `Configuración leída`) y después `node usar-config.mjs` sin el archivo (**qué deberías ver:** un error `Faltan variables de entorno: SIT_TENANT_ID, SIT_CLIENT_ID, SIT_CLIENT_SECRET, SIT_DATAVERSE_URL`, o el mensaje equivalente que escribiste). Haz commit de `.gitignore` y `usar-config.mjs`, nunca de `.env`.

**Evidencia a reportar (una fila por fallo que encontraste):**

| Fallo encontrado | Prueba que lo demuestra (nombre) | Resultado antes / después de corregir | Corrección aplicada | Contra qué lo verificaste (punto de la especificación, Learn, GitHub Docs o prueba) |
|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |
| ___ | ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Resultado de `node --test` con la salida original de la IA y tus pruebas (`pass` / `fail`) | ___ |
| Resultado con tu versión corregida | ___ |
| ¿Qué prueba falló cuando volviste a poner el valor por defecto? | ___ |
| Commits que devolvió `git log --oneline -S "Xq8~"` | ___ |
| Salida de `git check-ignore -v .env` | ___ |

**Contrasta tu versión (solo después de llenar la tabla).** Una corrección posible:

```js
// config.mjs corregido: falla cerrada y no escribe el secreto en ningún log
const REQUERIDAS = ["SIT_TENANT_ID", "SIT_CLIENT_ID", "SIT_CLIENT_SECRET", "SIT_DATAVERSE_URL"];

export function leerConfig(env = process.env) {
  const faltan = REQUERIDAS.filter((nombre) => !env[nombre]?.trim());
  if (faltan.length > 0) {
    // El mensaje nombra las variables que faltan, nunca sus valores.
    throw new Error(`Faltan variables de entorno: ${faltan.join(", ")}`);
  }
  return {
    tenantId: env.SIT_TENANT_ID,
    clientId: env.SIT_CLIENT_ID,
    clientSecret: env.SIT_CLIENT_SECRET,
    url: env.SIT_DATAVERSE_URL,
  };
}

// Lo único que se escribe en un log: la configuración sin el secreto.
export function describirConfig(config) {
  return { ...config, clientSecret: "[oculto]" };
}

// Cuerpo de la solicitud de token del flujo client credentials, que se envía por POST a
// https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
export function cuerpoSolicitudToken(config) {
  return new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: `${config.url}/.default`,
    grant_type: "client_credentials",
  }).toString();
}
```

> **Más allá de este ejercicio:** en una integración real no construyes la solicitud de token a mano: Learn recomienda usar MSAL en lugar de programar el protocolo directamente y, para más garantía, autenticar la aplicación con un certificado o una credencial federada en lugar de un secreto compartido. Este ejercicio usa un secreto porque es lo más fácil de probar sin tenant. El Lab 54 recorre la app registration, el application user y el rol de seguridad sin pegar ningún secreto.

---

## 🧩 Microlección 3 — Dónde vive el secreto de verdad (y quién lo vigila)

**¿Qué vas a aprender?** A poner cada secreto en su sitio (equipo, pipeline, Power Platform), a comprobar que el programa falla cerrado cuando el secreto no está y a saber qué vigila GitHub por ti y qué no.

**¿Por qué existe esto?** "Los valores reales viven en Environment Variables/Key Vault" es una frase fácil de escribir. Esta microlección la convierte en pasos que puedes comprobar.

**Concepto breve:**
- **En el pipeline:** un secreto de GitHub Actions se crea en **Settings** > **Secrets and variables** > **Actions** > **New repository secret** y se lee con `${{ secrets.NOMBRE }}`. Si el secreto no existe, la expresión devuelve una **cadena vacía** (por eso tu programa debe tratar "vacío" igual que "falta"). GitHub redacta de los logs los secretos que conoce, pero avisa de que esa redacción **no está garantizada** si el valor se transforma, y pide cuidar que los secretos no se impriman ([GitHub Docs: Using secrets in GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)). Un valor escrito en el código no es un secreto de GitHub: se imprime tal cual.
- **En Power Platform:** una variable de entorno de tipo **Secret** guarda la **referencia** a un secreto de Azure Key Vault, no el valor. Hoy esos secretos solo se pueden usar en flujos de Power Automate, agentes de Copilot Studio y conectores personalizados ([Learn: Use environment variables for Azure Key Vault secrets](https://learn.microsoft.com/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets)).
- **La identidad:** una aplicación que se conecta a Dataverse sin usuario interactivo usa un **application user** ligado a una app registration de Microsoft Entra, con un rol de seguridad propio; no consume una licencia de pago ([Learn: Manage application users](https://learn.microsoft.com/power-platform/admin/manage-application-users)).
- **Quién vigila en GitHub:** el secret scanning (gratis en repositorios públicos) y la push protection for users (activada por defecto) detectan secretos con patrones conocidos. Un valor inventado como `Xq8~fake-0000-no-es-real` no tiene un patrón conocido: lo normal es que pase sin aviso. Tus pruebas y la revisión siguen siendo necesarias.

**Práctica A — en GitHub (25 min, opcional si no tienes cuenta):**

1. En GitHub, abre tu foto de perfil > **Settings** > (sección Security de la barra lateral) **Code security**. Busca **Push protection for yourself** y anota si está activada ([GitHub Docs: Push protection for users](https://docs.github.com/en/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/push-protection-for-users)).
2. Crea un repositorio **público** vacío llamado `practica-secretos` y sube tu carpeta local (las instrucciones de `git remote add origin ...` y `git push -u origin main` aparecen en la página del repositorio recién creado; si tu rama local se llama `master`, usa ese nombre). Contiene el valor inventado `Xq8~...` en el historial: es inventado, no pasa nada.
3. Crea `.github/workflows/probar-config.yml` con este contenido, haz commit y push:
   ```yaml
   name: Probar configuración

   on:
     workflow_dispatch:       # solo se ejecuta a mano, desde la pestaña Actions

   permissions:
     contents: read

   jobs:
     probar:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v7
         - uses: actions/setup-node@v7
           with:
             node-version: 24
         - name: Leer la configuración
           env:
             SIT_TENANT_ID: tenant-de-prueba
             SIT_CLIENT_ID: cliente-de-prueba
             SIT_CLIENT_SECRET: ${{ secrets.SIT_CLIENT_SECRET }}   # vacío si el secreto no existe en el repositorio
             SIT_DATAVERSE_URL: https://sit-dev.crm.dynamics.com
           run: node usar-config.mjs
   ```
4. **Ejecución 1, sin secreto:** en la pestaña **Actions**, elige **Probar configuración** y lánzalo con el botón **Run workflow**. **Qué deberías ver:** el job en rojo y, en el log del paso, `Error: Faltan variables de entorno: SIT_CLIENT_SECRET`. Tu programa falló cerrado.
5. **Ejecución 2, con secreto:** crea el secreto `SIT_CLIENT_SECRET` con el valor inventado `valor-de-prueba-123` (**Settings** > **Secrets and variables** > **Actions** > **New repository secret** > **Add secret**) y vuelve a lanzarlo. **Qué deberías ver:** el job en verde y `Configuración leída`.
6. **Contraste con la versión de la IA (10 min, opcional):** crea una rama `version-ia`, vuelve a poner en ella el `config.mjs` original de la IA, haz push y lanza el workflow eligiendo esa rama en el selector de rama del botón **Run workflow**. Mira el log: ¿cómo aparece `clientSecret`? Después borra el secreto del repositorio y lánzalo otra vez sobre `version-ia`. ¿Cómo aparece ahora, y el job termina en verde o en rojo?
7. Abre la pestaña **Security** del repositorio y anota si el secret scanning generó alguna alerta por `Xq8~...`.

**Práctica B — el secreto en Power Platform (20 min, en papel si no tienes Azure):**

Si tienes una suscripción de Azure y un ambiente Developer, sigue la página de Learn sobre Key Vault (enlace del concepto breve) con un secreto inventado. Si no, llena la tabla en papel con los nombres que usarías; es lo que revisaría un arquitecto antes de aprobar el diseño. Los pasos que Learn documenta, en resumen:
1. En la suscripción de Azure: registrar el resource provider `Microsoft.PowerPlatform` y crear un key vault (Learn recomienda uno por ambiente de Power Platform y el modelo de permisos **Azure role-based access control**).
2. En el key vault, **Access control (IAM)** > **Add** > **Add role assignment** > rol **Key Vault Secrets User**, para quien crea la variable y para el service principal de Dataverse.
3. En Power Apps, dentro de una solución unmanaged: **New** > **More** > **Environment variable**, **Data Type**: **Secret**, **Secret Store**: **Azure Key Vault**, y los campos **Azure Subscription ID**, **Resource Group Name**, **Azure Key Vault Name** y **Secret Name**.
4. En el flujo, el secreto no aparece en el contenido dinámico: se lee con la acción no enlazada **RetrieveEnvironmentVariableSecretValue** del conector de Dataverse, activando **Secure Outputs** en sus **Settings** para que no quede en el historial de ejecuciones.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Estado de **Push protection for yourself** | ___ |
| Ejecución 1 (sin secreto): resultado del job y línea exacta del error | ___ |
| Ejecución 2 (con secreto): resultado del job | ___ |
| Contraste con la versión de la IA: cómo apareció `clientSecret` con el secreto creado y sin él (o "no lo hice") | ___ |
| ¿Hubo alerta de secret scanning por `Xq8~...`? ¿Qué te dice eso? | ___ |
| Práctica B: nombre del key vault, del secreto y de la variable de entorno (reales o en papel), y quién tiene el rol **Key Vault Secrets User** | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — ¿qué datos pueden entrar en un prompt?

> **Situación:** el ambiente de producción de SIT está en Europa. El equipo quiere usar, desde la semana que viene: (1) Copilot en el diseñador de Power Automate para crear flujos sobre la tabla de solicitudes, que tiene datos personales de clientes; (2) un asistente de chat externo para analizar una exportación CSV con 200 casos reales de soporte; (3) GitHub Copilot en el repositorio de la integración con Dataverse. El responsable de cumplimiento te pide **una política de una página**: qué clase de dato puede entrar en cada herramienta y con qué condición.
> **Entrega:** una tabla "Clase de dato | Herramienta | ¿Permitido? | Condición" con al menos tres clases (secretos, datos personales de clientes, código y metadatos) y tres a cinco líneas que la defiendan.

**Antes de decidir (opcional, 10 min, si eres administrador de un ambiente de práctica):** en el [Power Platform admin center](https://admin.powerplatform.microsoft.com), revisa **Security** > **Data and privacy** > **Data policy** (qué conectores están en **Business**, **Non-business** y **Blocked**) y **Manage** > **Environments** > (tu ambiente) > tarjeta **Generative AI features** (si aparece **Move data across regions** y cómo está). Learn indica que esa casilla no se muestra en ambientes de Estados Unidos ni de las nubes de gobierno ([Learn: Manage data policies](https://learn.microsoft.com/power-platform/admin/prevent-data-loss), [Learn: Move data across regions for Copilots](https://learn.microsoft.com/power-platform/admin/geographical-availability-copilot)).

No hay una única política correcta: la evidencia es tu decisión escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Los secretos no entran nunca | Ninguna fila permite secretos en ninguna herramienta, ni "solo en pruebas" |
| Distingue herramientas por dónde procesan y qué retienen | Citas la región de procesamiento o la política de retención de cada herramienta (Microlección 1), o anotas que no está documentada y qué haces entonces |
| Datos personales con condición explícita | Para los 200 casos reales decides anonimizar, usar una herramienta aprobada por la organización o no hacerlo, y lo justificas |
| Usa los controles que ya existen | Mencionas las data policies o la tarjeta **Generative AI features**, no solo "pedir a la gente que tenga cuidado" |
| Es verificable | Otra persona puede decidir si un prompt cumple la política sin preguntarte (la checklist de la Microlección 1 sirve) |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu tabla de política (o enlace al archivo) | ___ |
| La fila que más te costó decidir y por qué | ___ |

---

## 🔁 Reto de transferencia — La API key que la IA guardó en una variable de entorno

Cambia el artefacto y comprueba si entendiste el patrón. Un flujo de SIT llama a un servicio externo de tipos de cambio con una API key. Un maker le preguntó a una IA "dónde guardo la API key del servicio para el flujo" y siguió su propuesta: una variable de entorno de tipo **Text** con la API key como **Current Value**, dentro de la solución. Exportó la solución, la desempaquetó con `pac solution unpack` y la subió a Git para el pipeline. Learn indica que los valores de las variables de entorno van en archivos JSON separados dentro del `.zip` exportado ([Learn: Use environment variables in Power Platform solutions](https://learn.microsoft.com/power-apps/maker/data-platform/environmentvariables)).

1. **Micropráctica (7 min):** **[Transferir: la API key en una variable de entorno de texto](/practica/ip-ia-030-transferir-api-key-en-variable-de-entorno)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** escribe el orden de acciones (qué haces primero, qué después) y el diseño corregido: tipo de variable, dónde vive el valor, cómo lo lee el flujo sin que aparezca en el historial y qué queda en Git.

**Evidencia a reportar:**

| Requisito | Tu decisión | Cómo comprobarías que funciona |
|---|---|---|
| Primera acción ante la API key ya expuesta | ___ | ___ |
| Tipo de variable y dónde vive el valor | ___ | ___ |
| Cómo lo lee el flujo sin dejarlo en el historial de ejecuciones | ___ | ___ |
| Qué queda en Git después de la corrección | ___ | ___ |

### 💼 Casos Reales de Negocio
Un desarrollador de SIT pegó una cadena de conexión completa a una base de datos de staging en un prompt para "que el modelo generara el código de conexión correcto", incluyendo usuario y contraseña reales. La credencial quedó en el historial de la herramienta usada. El incidente se resolvió rotando la credencial de inmediato y estableciendo la regla de equipo: ningún secreto real se pega en un prompt, siempre se usan placeholders (`{{CONNECTION_STRING}}`) y los valores reales viven únicamente en Environment Variables/Key Vault, nunca en texto plano en una conversación con IA.

### ✅ Buenas Prácticas
- Nunca pegar secretos reales (credenciales, connection strings, API keys) en un prompt — usar siempre placeholders.
- Anonimizar o ficcionalizar cualquier dato de ejemplo que se comparta con una herramienta de IA, preservando la estructura pero no el contenido real.
- Verificar la política de residencia y retención de datos del proveedor de IA antes de usarlo con datos reales de un tenant con requisitos de compliance.
- Pasar la checklist de auditoría a cada prompt antes de enviarlo, y conservar el contexto técnico que no es sensible (tablas, columnas, mensajes de error).
- Fallar cerrado con la configuración: si falta un secreto o está vacío, detenerse con un error que nombre la variable, nunca con un valor por defecto.
- No escribir la configuración entera en un log; si hace falta, usar una función que oculte el secreto, y probar con `node:test` que el secreto no aparece en la consola.
- Ante un secreto que llegó a un commit, a un log o a un prompt: rotarlo primero; limpiar el historial es opcional y nunca sustituye la rotación.
- En Power Platform, guardar secretos en Azure Key Vault y referenciarlos con una variable de entorno de tipo **Secret**; en flujos, activar **Secure Inputs**/**Secure Outputs** en las acciones que los manejan.
- Activar (o no desactivar) la push protection y revisar las alertas de secret scanning, sabiendo que solo detectan patrones conocidos.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Pegar una credencial o connection string real en un prompt | Buscar que el modelo "entienda mejor" el contexto | Usar siempre un placeholder; los valores reales nunca entran a un prompt |
| Compartir datos reales de clientes como ejemplo | No considerar el prompt como un canal de exposición de datos | Anonimizar/ficcionalizar cualquier dato de ejemplo antes de compartirlo |
| Asumir que todos los proveedores de IA cumplen automáticamente la política de residencia del tenant | No verificar la documentación del proveedor | Confirmar explícitamente dónde procesa datos el proveedor antes de usarlo con datos sensibles |
| El código generado lee `process.env` pero trae un valor por defecto para el secreto | La IA quiso que "funcione en local" y nadie probó qué pasa si falta la variable | Quitar el valor por defecto, lanzar un error que nombre la variable y probarlo con `assert.throws` |
| El secreto aparece en el log del pipeline | Un `console.log` de la configuración entera "para depurar"; GitHub solo redacta los secretos que conoce, y no lo garantiza | No imprimir la configuración; si hace falta, imprimir una copia sin el secreto y probarlo con `t.mock.method(console, "log")` |
| Borrar el secreto en un commit nuevo y darlo por resuelto | Creer que el historial de Git se actualiza | Rotar el secreto; `git log -S` muestra que el commit anterior lo sigue teniendo |
| Una variable de entorno de tipo Text con una API key | Seguir la primera propuesta de la IA | Variable de tipo **Secret** con Azure Key Vault y rotar la API key que ya quedó en el `.zip` y en Git |
| Confiar en que GitHub avisará de cualquier secreto | Pensar que el secret scanning lo detecta todo | Solo detecta patrones conocidos; las pruebas, la revisión y la checklist siguen siendo necesarias |

### 🧪 Criterios de Validación
- [ ] Comparo un prompt inseguro (con credencial real) y su versión segura equivalente con placeholders
- [ ] Identifico y corrijo un dato sensible en un prompt propio de un módulo anterior, aplicando la checklist de auditoría
- [ ] Documento la política de retención/residencia de datos de al menos una herramienta de IA que uso, con la URL y la fecha de la página
- [ ] Ejecuté las pruebas de la IA sobre `config.mjs`, vi el secreto en la consola y anoté que ninguna prueba lo notó
- [ ] Escribí una prueba por cada punto de la especificación, encontré los fallos de la configuración generada por IA, la corregí y todas mis pruebas pasan
- [ ] Rompí mi corrección a propósito y comprobé que al menos una prueba falla
- [ ] Comprobé con `git log -S` que un secreto borrado en un commit nuevo sigue en el historial, y sé que la respuesta es rotarlo
- [ ] Dejé los valores locales en un `.env` ignorado por Git y comprobé que el programa falla cerrado sin él
- [ ] Ejecuté (o describí en papel) el workflow con y sin el secreto de GitHub, y dónde viviría el secreto en Power Platform con Azure Key Vault
- [ ] Reviso la configuración de data policies y de **Generative AI features** de un entorno (o la describo en papel) y la uso en mi política de datos para prompts, defendida contra la rúbrica
- [ ] En el reto de transferencia ordené las acciones ante la API key expuesta y diseñé la variable de entorno de tipo **Secret**
- [ ] Relaciono este módulo con el Lab 91 o cualquier lab de integración/desarrollo donde use placeholders al pedir ayuda de IA sobre credenciales

### 📸 Evidencia para guardar
- Las tablas de evidencia de las tres microlecciones, de la decisión y del reto de transferencia.
- Los archivos `config.mjs` (tu versión corregida), `config.test.mjs`, `config.alumno.test.mjs`, `usar-config.mjs` y `.gitignore` (nunca el `.env`), más la salida de `node --test` antes y después de corregir y la de `git log --oneline -S "Xq8~"`.
- Si hiciste la Práctica A, el enlace a las dos ejecuciones del workflow.

> **Para profundizar (opcional, mismo nivel IA):** el Módulo 50 lleva estas pruebas a un pipeline que bloquea el merge si fallan; el Módulo 53 explica la autenticación contra la Web API de Dataverse; el Lab 54 diseña la app registration y el application user, y el Lab 55 vuelve a usar la checklist de auditoría de prompts.

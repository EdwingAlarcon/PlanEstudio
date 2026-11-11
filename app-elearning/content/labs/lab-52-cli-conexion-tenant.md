---
id: lab-52
title: "Configurar Power Platform CLI y Conectarse de Forma Segura al Tenant"
level: "N5"
duration: 90
product: ["Power Platform CLI", "Microsoft Entra ID", "Dataverse"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Maker", "Solution Architect"]
prerequisites:
  - "Cuenta con acceso a un entorno Developer o Sandbox (nunca producción)"
  - "Visual Studio Code con la extensión Power Platform Tools (o .NET 10 para instalar PAC CLI como herramienta .NET)"
  - "Módulo 52 estudiado: Power Platform CLI y Conexión Segura al Tenant"
files: []
lastVerified: "2026-11"
---

# Lab 52 — Power Platform CLI: Configuración y Conexión Segura al Tenant

## Objetivo

Al finalizar este laboratorio habrás instalado Power Platform CLI, configurado un perfil de autenticación contra un entorno de práctica, y aprendido a cambiar entre múltiples entornos (Dev/Test/Prod) sin riesgo de operar por error contra el entorno equivocado.

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Rol recomendado

Developer, Maker, Solution Architect — cualquier rol que vaya a interactuar con Power Platform CLI en su máquina local.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** SIT atiende varios clientes y proyectos en paralelo. Un consultor nuevo necesita configurar su máquina para trabajar con Power Platform CLI de forma que nunca confunda un entorno de un cliente con el de otro, ni arriesgue ejecutar un comando destructivo contra producción por error.

**Por qué es una buena tarea para practicar:** es la base de cualquier trabajo técnico posterior en el nivel IA (labs 53, 54, módulos de ALM) — sin esta configuración correcta, cualquier comando de `pac` es un riesgo.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Instalar Power Platform CLI y verificar la instalación (puede llevar 20 minutos solo la instalación) | 25 min |
| Ejercicio 2 — Crear un perfil de autenticación contra un entorno de práctica | 25 min |
| Ejercicio 3 — Simular múltiples clientes: crear un segundo perfil y practicar el cambio seguro entre ellos (o su variante en papel) | 30 min |
| Ejercicio 4 — Documentar tu checklist personal de verificación previa | 10 min |
| **Total** | **90 min** |

Si ya hiciste las Microlecciones 2 y 3 del Módulo 52, PAC CLI ya está instalado y el perfil `sit-practica-dev` ya existe: en los Ejercicios 1 y 2 basta con comprobarlos, y el total baja a unos 50 minutos.

## Tecnologías utilizadas

- Power Platform CLI (`pac`)
- Un entorno Developer (gratuito, ligado a tu cuenta) o Sandbox de práctica
- Terminal (PowerShell, bash o equivalente)

## Ejercicio 1 — Instalar y verificar

Instala Power Platform CLI por uno de los métodos de [Learn: What is Microsoft Power Platform CLI?](https://learn.microsoft.com/power-platform/developer/cli/introduction):

- **Extensión de VS Code (la más sencilla):** en VS Code, icono **Extensions** de la barra lateral, busca `power platform tools` e **Install**. Así instalado, `pac` funciona por defecto solo en la terminal de VS Code (**Terminal** > **New Terminal**).
- **Herramienta .NET:** necesita .NET instalado (Learn recomienda .NET 10.0; con un SDK anterior la versión actual del paquete no se instala) y luego:

```bash
dotnet tool install --global Microsoft.PowerApps.CLI.Tool
```

Verifica la instalación escribiendo solo:

```bash
pac
```

**Validación esperada:** la primera línea dice `Microsoft PowerPlatform CLI` y la segunda `Version: ...`, seguidas de la lista de grupos de comandos (`admin`, `auth`, `env`, `solution`...). (`pac --version` no es un comando válido: imprime la cabecera y después un error.)

## Ejercicio 2 — Conectar a un entorno de práctica

Antes de abrir la terminal, anota la URL de tu ambiente de práctica: en el [Power Platform admin center](https://admin.powerplatform.microsoft.com), **Manage** > **Environments** > tu ambiente; en la sección **Details** aparecen la URL y el **Environment ID** (es la Microlección 1 del Módulo 52; si no ves tu ambiente, pídele la URL a quien administre el tenant).

Crea un perfil de autenticación contra tu entorno Developer o Sandbox (nunca contra producción), cambiando la URL de ejemplo por la tuya:

```bash
pac auth create --environment "https://orgXXXXXXXX.crm.dynamics.com" --name "sit-practica-dev"
```

Se abre un inicio de sesión de Microsoft Entra ID. Si estás en WSL2 o en una máquina sin navegador, agrega `--deviceCode` (es un switch, sin valor) y escribe en un navegador el código que te muestra ([Learn: pac auth](https://learn.microsoft.com/power-platform/developer/cli/reference/auth)). Si omites `--environment`, el perfil queda conectado al ambiente **Default** del tenant, no al tuyo.

Confirma la organización activa (`pac env who` es el nombre actual de `pac org who`, que sigue funcionando):

```bash
pac env who
```

**Validación esperada:** `pac env who` muestra los datos de la organización activa; la URL coincide con la que anotaste en el centro de administración. Si ves otra URL o el ambiente que termina en **(default)**, corrige el perfil con `pac auth update --index <n> --environment <URL>` (el `<n>` sale de `pac auth list`; el primer perfil es el 1) y vuelve a comprobar.

## Ejercicio 3 — Simular múltiples clientes/entornos

Si tienes acceso a un segundo entorno, crea un segundo perfil con un nombre igualmente explícito. Desde el 15-11-2026 cada usuario solo puede crear un ambiente Developer administrado, así que el segundo suele ser un **Trial** de 30 días con Dataverse o un **Sandbox**. Ojo: el Developer Plan no da derecho a crear un Trial; Learn exige una licencia que lo incluya (por ejemplo, la prueba gratuita de Power Apps, uno por usuario) y que el tenant permita crear ambientes, y un Sandbox necesita 1 GB de capacidad disponible ([Learn: Who can create environments?](https://learn.microsoft.com/power-platform/admin/create-environment#who-can-create-environments), [Learn: Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments)).

**Variante en papel (sin segundo entorno):** escribe los comandos de este ejercicio para una segunda URL inventada y explica qué columna de `pac auth list` y qué comando usarías para comprobar a dónde apunta cada perfil. No crees un segundo perfil contra tu mismo ambiente con otro nombre: es justo el error de "el nombre dice una cosa y la URL otra".

```bash
pac auth create --environment "https://orgYYYYYYYY.crm.dynamics.com" --name "sit-cliente-b-dev"
pac auth list
```

Practica el cambio seguro entre perfiles, verificando SIEMPRE con `pac env who` después de cada cambio:

```bash
pac auth select --name "sit-practica-dev"
pac env who
pac auth select --name "sit-cliente-b-dev"
pac env who
```

**Validación esperada:** después de cada `pac auth select`, `pac env who` confirma la organización correcta antes de continuar con cualquier otro comando.

## Ejercicio 4 — Documentar tu checklist personal

Escribe (en un archivo local, no en el repo del proyecto real) tu checklist personal de verificación antes de ejecutar cualquier comando de `pac` que modifique algo:
1. ¿Ejecuté `pac env who` en los últimos minutos y la URL coincide con la que anoté para ese ambiente? (El nombre del perfil es una etiqueta; la URL es la verdad.)
2. ¿El nombre del perfil coincide con el cliente/entorno que espero?
3. ¿Es un entorno Developer/Sandbox/Test, o es Production?

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `pac` no reconocido como comando | La instalación no agregó la herramienta al PATH, o se requiere reiniciar la terminal | Reiniciar la terminal o verificar la variable PATH tras instalar |
| `pac` funciona en VS Code pero no en una ventana de PowerShell aparte | Solo instalaste la extensión, que por defecto habilita `pac` en la terminal de VS Code | Usar la terminal de VS Code, o habilitarlo en CMD/PowerShell como indica la página de instalación de la extensión |
| `dotnet tool install` falla con un mensaje sobre `DotnetToolSettings.xml` | El paquete actual está compilado para .NET 10 y tienes un SDK anterior | Instalar .NET 10 o usar la extensión de VS Code |
| El perfil apunta al ambiente **(default)** | Se creó sin `--environment` | `pac auth update --index <n> --environment <URL>` y confirmar con `pac env who` |
| Ejecutar un comando contra el perfil equivocado | No verificar `pac env who` tras un `pac auth select` | Verificar siempre la organización activa antes de cualquier operación |
| Perfiles con nombres genéricos (`profile1`, `profile2`) | No nombrar explícitamente el perfil al crearlo | Usar siempre `--name` con una convención clara cliente-entorno |

## Criterios de Validación

- [ ] Instalé Power Platform CLI y confirmé la versión
- [ ] Creé un perfil de autenticación contra un entorno Developer/Sandbox con nombre explícito
- [ ] Verifiqué la organización activa con `pac env who` antes y después de cambiar de perfil
- [ ] Documenté mi checklist personal de verificación previa a comandos destructivos

## Evidencia esperada

- Historial de comandos usados para instalar el CLI, crear el perfil y verificar la organización activa
- Checklist personal de verificación previa a comandos destructivos, documentado por escrito

## Criterios de aprobación

- El perfil de autenticación tiene un nombre explícito que identifica el entorno sin ambigüedad
- `pac env who` confirma la organización correcta antes de cualquier comando de import/export
- 100% de los ítems de Criterios de Validación marcados

## Preguntas de Reflexión

1. ¿Qué habría pasado si hubieras ejecutado un `pac solution import` sin verificar el perfil activo?
2. ¿Cómo cambiaría tu checklist si trabajaras con 5 clientes distintos en la misma semana?
3. ¿Qué información NUNCA deberías incluir en el nombre de un perfil de autenticación versionado o compartido?

## Módulos Relacionados

- Módulo 52 — Power Platform CLI y Conexión Segura al Tenant
- Módulo 54 — ALM de Soluciones Power Platform con Apoyo de IA

## Competencias Desarrolladas

- Configuración de un entorno de desarrollo local para Power Platform
- Gestión segura de múltiples perfiles de autenticación
- Prevención de errores operativos contra entornos productivos

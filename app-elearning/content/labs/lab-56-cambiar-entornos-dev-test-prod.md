---
id: lab-56
title: "Cambiar entre Entornos Dev/Test/Prod de Forma Segura"
level: "N5"
duration: 90
product: ["Power Platform CLI", "Microsoft Entra ID", "Dataverse"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Solution Architect", "Administrator"]
prerequisites:
  - "Lab 52 completado — Power Platform CLI configurado y conectado"
  - "Acceso a al menos 2 entornos distintos: tu ambiente del curso y un segundo entorno con Dataverse (un Sandbox o Developer gestionado de tu organización, o un Trial si tu ambiente del curso no lo es: el Trial es uno por usuario), o la variante en papel"
  - "Módulo 52 estudiado: Power Platform CLI y Conexión Segura al Tenant"
files: []
lastVerified: "2026-11"
---

# Lab 56 — Cambiar entre Entornos Dev/Test/Prod de Forma Segura

## Objetivo

Al finalizar este laboratorio habrás practicado el manejo de múltiples perfiles de autenticación representando las 3 etapas de un proyecto real (Dev, Test, Prod), y habrás diseñado un procedimiento repetible que evita ejecutar un comando destructivo contra el entorno equivocado — el riesgo operativo más común al trabajar con Power Platform CLI en un proyecto con varias etapas.

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Rol recomendado

Developer, Solution Architect, Administrator.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** El Lab 52 cubrió la conexión básica a un solo entorno. En un proyecto real, SIT mueve la misma solución por 3 etapas (Dev → Test → Prod) y el equipo necesita un procedimiento explícito y repetible para cambiar de entorno sin arriesgar operar sobre el entorno equivocado — especialmente crítico antes de una importación a producción.

**Por qué es una buena tarea para practicar:** a diferencia del Lab 52 (conexión a un solo entorno), este laboratorio se enfoca específicamente en el momento de mayor riesgo: el cambio entre perfiles y la verificación previa a una operación irreversible.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Crear los perfiles representando Dev/Test/Prod (incluye crear el Trial si aún no lo tienes) | 35 min |
| Ejercicio 2 — Diseñar y aplicar un procedimiento de verificación previa a cada cambio | 25 min |
| Ejercicio 3 — Simular un intento de operación contra el entorno equivocado y detectarlo a tiempo | 20 min |
| Ejercicio 4 — Documentar el procedimiento como estándar de equipo | 10 min |
| **Total** | **90 min** |

## Tecnologías utilizadas

- Power Platform CLI (`pac auth`, `pac env who`; `pac org who` es su nombre anterior y sigue funcionando, según [Learn: pac env](https://learn.microsoft.com/power-platform/developer/cli/reference/env))
- Al menos 2 entornos distintos: tu ambiente del curso y un segundo entorno (un Sandbox o Developer gestionado de tu organización, o un Trial si tu ambiente del curso no lo es; el Trial es uno por usuario — ver [Entornos y trials](/recursos/entornos-y-trials))

**Antes de empezar: el segundo entorno.** Si tu ambiente del curso ya es tu Trial, no puedes crear otro con la misma cuenta: pide un Sandbox o un Developer gestionado a tu organización o haz la variante en papel del final. Si tu ambiente del curso es un Developer o un Sandbox, puedes crear un Trial como segundo entorno. El Developer Plan no da derecho a crear un Trial: Learn exige una licencia que lo incluya (por ejemplo, la licencia Power Apps trial; un Trial por usuario) y que la política del tenant permita crear ambientes ([Learn: Who can create environments?](https://learn.microsoft.com/power-platform/admin/create-environment#who-can-create-environments)). Con esa licencia, en el [Power Platform admin center](https://admin.powerplatform.microsoft.com): **Manage** > **Environments** > **New**, **Type** = **Trial**, la opción de base de datos = **Yes** (Learn le da dos nombres: **Add a Dataverse data store** en [Create and manage environments](https://learn.microsoft.com/power-platform/admin/create-environment) y **Create a database for this environment?** en [Trial environments](https://learn.microsoft.com/power-platform/admin/trial-environments); usa el que veas), **Next** y **Save**. El Trial se deshabilita y se borra a los 30 días. Si no puedes crearlo, haz la variante en papel del final.

Anota en una tabla la **URL** de cada entorno (en el admin center, **Details** del ambiente): es contra esa tabla, no contra el nombre del perfil, como vas a verificar el destino.

## Ejercicio 1 — Crear los 3 perfiles

Crea (o reutiliza) perfiles de autenticación nombrados explícitamente por etapa, nunca de forma genérica, uno por cada entorno **distinto** que tengas (cambia las URLs de ejemplo por las de tu tabla):

```bash
pac auth create --environment "https://org-dev-XXXX.crm.dynamics.com" --name "sit-solicitudes-dev"
pac auth create --environment "https://org-test-XXXX.crm.dynamics.com" --name "sit-solicitudes-test"
pac auth create --environment "https://org-prod-XXXX.crm.dynamics.com" --name "sit-solicitudes-prod"
pac auth list
```

**Con solo dos entornos** (tu ambiente del curso y el segundo): crea `sit-solicitudes-dev` contra tu ambiente del curso y `sit-solicitudes-prod` contra el segundo, que hace de Prod simulado. El perfil de Test lo escribes en papel; **no** lo apuntes a uno de tus dos entornos, porque dos perfiles con etapas distintas y la misma URL son justo el error que este lab enseña a evitar.

**Validación esperada:** `pac auth list` muestra los perfiles con nombres que identifican inequívocamente la etapa (dev/test/prod) y el proyecto, y cada uno con una URL distinta en la columna `Url`.

## Ejercicio 2 — Procedimiento de verificación previa

Diseña un procedimiento de 3 pasos que se ejecute SIEMPRE antes de cualquier comando de `pac` que exporte, importe o modifique algo:

1. `pac auth select --name <perfil-esperado>` (seleccionar explícitamente por nombre, nunca por índice numérico memorizado).
2. `pac env who` (o `pac org who`): comparar la URL que muestra con la de tu tabla para la etapa en la que quieres operar. El nombre del perfil es una etiqueta que pusiste tú; la URL es la verdad.
3. Confirmar que la etapa de la operación que estás a punto de ejecutar (dev/test/prod) es la de esa URL, y en el comando que modifica algo fijar el destino con `--environment <URL>` para no depender del perfil activo.

Aplica este procedimiento antes de un comando de solo lectura (`pac solution list`) contra cada uno de tus perfiles, y documenta la salida de `pac env who` de cada uno (tapa los datos confidenciales).

## Ejercicio 3 — Detectar un cambio de entorno erróneo

Simula el error más común: selecciona el perfil `sit-solicitudes-dev` pero pretende ejecutar mentalmente una operación pensada para `sit-solicitudes-prod` (sin ejecutar nada destructivo). Sigue tu procedimiento del Ejercicio 2 y confirma que el paso 2 (la URL de `pac env who` no es la de Prod en tu tabla) te hubiera detenido antes de continuar. Documenta en qué paso exacto se habría detectado el error y qué habría pasado si solo hubieras mirado el nombre del perfil.

## Ejercicio 4 — Documentar el estándar

Escribe el procedimiento de verificación como una checklist de equipo de 3 líneas, lista para incluir en la documentación de onboarding de un nuevo desarrollador de SIT.

## Variante en papel (sin segundo entorno)

Con tres URLs inventadas (una por etapa), escribe los comandos del Ejercicio 1, la salida que esperarías de `pac auth list` (columnas `Index`, `Active`, `Name`, `Url`) y, para el Ejercicio 3, qué valor de `Url` te habría hecho detenerte. Usa [Learn: pac auth](https://learn.microsoft.com/power-platform/developer/cli/reference/auth) para comprobar cada parámetro. Los Ejercicios 2 y 4 se hacen igual.

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Seleccionar el perfil por índice numérico (`--index 2`) en vez de por nombre | El índice puede cambiar si se agregan/eliminan perfiles con el tiempo | Seleccionar siempre por `--name` explícito |
| Confiar en la memoria para saber qué perfil está activo | No verificar `pac env who` antes de cada operación | Aplicar el procedimiento de 3 pasos sin excepciones, sin importar la prisa |
| Dos perfiles de etapas distintas apuntan a la misma URL | Se creó un perfil "de Test" contra el entorno de Dev por no tener un tercer entorno | Un perfil por entorno real; la etapa que falte, en papel |
| No poder crear el Trial | Ya usas tu único Trial como ambiente del curso, el Developer Plan no incluye derecho a Trial, o el tenant no permite crear ambientes | Pedir un Sandbox o Developer gestionado al administrador, o activar la licencia Power Apps trial si aún no tienes un Trial; si no, variante en papel |
| Usar el mismo nombre de perfil para Dev y Test de proyectos distintos | Convención de nombres poco específica | Incluir el nombre del proyecto y la etapa en cada nombre de perfil |
| Ejecutar el primer comando del día sin verificar el perfil activo | Asumir que el perfil de la sesión anterior sigue siendo el correcto | Verificar `pac env who` al inicio de cada sesión de trabajo, no solo antes de comandos destructivos |

## Criterios de Validación

- [ ] Creé un perfil de autenticación por cada entorno real (al menos 2), con nombres explícitos por proyecto y etapa y URLs distintas, y escribí en papel la etapa que me faltó
- [ ] Apliqué el procedimiento de verificación de 3 pasos antes de operar contra cada perfil
- [ ] Identifiqué en qué paso se habría detectado un cambio de entorno erróneo simulado
- [ ] Documenté el procedimiento como checklist de equipo de onboarding

## Evidencia esperada

- La salida de `pac auth list` con tus perfiles (nombres explícitos de proyecto + etapa, URLs tapadas si son confidenciales) y la tabla de URLs esperadas por etapa
- Procedimiento de verificación de 3 pasos documentado como checklist de onboarding
- Análisis escrito de en qué paso se habría detectado el cambio de entorno erróneo simulado

## Criterios de aprobación

- Ningún cambio pasa directo a Prod sin pasar por el procedimiento de verificación de 3 pasos
- El checklist de onboarding es suficiente para que otra persona del equipo lo siga sin ayuda
- 100% de los ítems de Criterios de Validación marcados

## Preguntas de Reflexión

1. ¿Por qué seleccionar un perfil por nombre es más seguro que seleccionarlo por índice numérico?
2. ¿Qué otras señales visuales (además del nombre del perfil) podrían ayudar a distinguir Prod de Test en tu flujo de trabajo diario?
3. ¿Cómo adaptarías este procedimiento si trabajaras con 5 clientes distintos, cada uno con sus propios Dev/Test/Prod?

## Módulos Relacionados

- Módulo 52 — Power Platform CLI y Conexión Segura al Tenant
- Módulo 54 — ALM de Soluciones Power Platform con Apoyo de IA

## Competencias Desarrolladas

- Gestión segura de múltiples entornos en un proyecto con varias etapas
- Diseño de procedimientos de verificación repetibles para prevenir errores operativos
- Prevención activa de operaciones accidentales contra producción

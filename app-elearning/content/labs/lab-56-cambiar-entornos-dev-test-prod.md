---
id: lab-56
title: "Cambiar entre Entornos Dev/Test/Prod de Forma Segura"
level: "N5"
duration: 75
product: ["Power Platform CLI", "Microsoft Entra ID", "Dataverse"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Solution Architect", "Administrator"]
prerequisites:
  - "Lab 52 completado — Power Platform CLI configurado y conectado"
  - "Acceso (o capacidad de crear) al menos 2 entornos distintos: Developer/Sandbox y un segundo entorno de práctica"
  - "Módulo 52 estudiado: Power Platform CLI y Conexión Segura al Tenant"
files: []
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
| Ejercicio 1 — Crear los 3 perfiles representando Dev/Test/Prod | 20 min |
| Ejercicio 2 — Diseñar y aplicar un procedimiento de verificación previa a cada cambio | 25 min |
| Ejercicio 3 — Simular un intento de operación contra el entorno equivocado y detectarlo a tiempo | 20 min |
| Ejercicio 4 — Documentar el procedimiento como estándar de equipo | 10 min |
| **Total** | **75 min** |

## Tecnologías utilizadas

- Power Platform CLI (`pac auth`, `pac org who`)
- Al menos 2 entornos distintos (puede simularse Prod con un segundo entorno Developer si no tienes acceso a un entorno productivo real)

## Ejercicio 1 — Crear los 3 perfiles

Crea (o reutiliza) perfiles de autenticación nombrados explícitamente por etapa, nunca de forma genérica:

```bash
pac auth create --environment "https://org-dev-XXXX.crm.dynamics.com" --name "sit-solicitudes-dev"
pac auth create --environment "https://org-test-XXXX.crm.dynamics.com" --name "sit-solicitudes-test"
pac auth create --environment "https://org-prod-XXXX.crm.dynamics.com" --name "sit-solicitudes-prod"
pac auth list
```

**Validación esperada:** `pac auth list` muestra los 3 perfiles con nombres que identifican inequívocamente la etapa (dev/test/prod) y el proyecto.

## Ejercicio 2 — Procedimiento de verificación previa

Diseña un procedimiento de 3 pasos que se ejecute SIEMPRE antes de cualquier comando de `pac` que exporte, importe o modifique algo:

1. `pac auth select --name <perfil-esperado>` (seleccionar explícitamente por nombre, nunca por índice numérico memorizado).
2. `pac org who` (verificar que la URL y el nombre de organización coinciden con lo esperado).
3. Confirmar visualmente que la etapa (dev/test/prod) en el nombre del perfil coincide con la intención de la operación que estás a punto de ejecutar.

Aplica este procedimiento antes de un comando de solo lectura (`pac solution list`) contra cada uno de los 3 perfiles, y documenta la salida de `pac org who` de cada uno.

## Ejercicio 3 — Detectar un cambio de entorno erróneo

Simula el error más común: selecciona el perfil `sit-solicitudes-test` pero pretende ejecutar mentalmente una operación pensada para `sit-solicitudes-prod` (sin ejecutar nada destructivo). Sigue tu procedimiento del Ejercicio 2 y confirma que el paso 3 (comparar la etapa esperada contra la real) te hubiera detenido antes de continuar. Documenta en qué paso exacto se habría detectado el error.

## Ejercicio 4 — Documentar el estándar

Escribe el procedimiento de verificación como una checklist de equipo de 3 líneas, lista para incluir en la documentación de onboarding de un nuevo desarrollador de SIT.

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Seleccionar el perfil por índice numérico (`--index 2`) en vez de por nombre | El índice puede cambiar si se agregan/eliminan perfiles con el tiempo | Seleccionar siempre por `--name` explícito |
| Confiar en la memoria para saber qué perfil está activo | No verificar `pac org who` antes de cada operación | Aplicar el procedimiento de 3 pasos sin excepciones, sin importar la prisa |
| Usar el mismo nombre de perfil para Dev y Test de proyectos distintos | Convención de nombres poco específica | Incluir el nombre del proyecto y la etapa en cada nombre de perfil |
| Ejecutar el primer comando del día sin verificar el perfil activo | Asumir que el perfil de la sesión anterior sigue siendo el correcto | Verificar `pac org who` al inicio de cada sesión de trabajo, no solo antes de comandos destructivos |

## Criterios de Validación

- [ ] Creé 3 perfiles de autenticación con nombres explícitos por proyecto y etapa
- [ ] Apliqué el procedimiento de verificación de 3 pasos antes de operar contra cada perfil
- [ ] Identifiqué en qué paso se habría detectado un cambio de entorno erróneo simulado
- [ ] Documenté el procedimiento como checklist de equipo de onboarding

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

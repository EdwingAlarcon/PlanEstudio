---
id: lab-111
title: "RPA — Despliegue entre ambientes y operación unattended"
level: "RPA"
duration: 180
product: ["Power Automate for desktop", "Solutions", "Machine Runtime", "Unattended RPA"]
certifications: ["Power Automate for desktop & RPA"]
role: ["RPA Developer", "RPA Operations Specialist", "Automation Solution Architect"]
prerequisites:
  - "Módulos 68 y 75 completados"
  - "Ambiente DEV/TEST o simulación documentada"
files: []
lastVerified: "2026-11"
---

# LAB-RPA-08 — Despliegue y operación unattended

## Objetivo

Preparar solución, configuración, dependencias, variables, referencias, validación, UAT, rollback, documentación postdeploy y operación unattended o variante simulada.

## Escenario de negocio

El bot debe pasar de DEV a TEST. Operaciones exige evidencia de readiness de máquina, cuenta, sesión, monitoreo, rollback y soporte.

> **Licencia para la parte unattended (Learn, noviembre de 2026):** una ejecución desatendida necesita un bot desatendido: el plan **Process** se asigna a la máquina, y la máquina la registra un usuario con Premium; el plan **Hosted Process** cubre un bot alojado por Microsoft. La prueba de 90 días de Power Automate da las capacidades Premium, incluidas las ejecuciones desatendidas ([Learn: Power Automate license types](https://learn.microsoft.com/power-platform/admin/power-automate-licensing/types)). Si no tienes ninguna de esas opciones, haz la **variante simulada** del final y escribe «simulación sin licencia unattended» en tu entrega; el ALM entre DEV y TEST (ejercicios 1 a 5) sí puedes hacerlo con tu ambiente.

## Competencias desarrolladas

- ALM de soluciones
- Variables de entorno
- Connection references
- Machine readiness
- Runbook unattended

## Ejercicios

1. Lista componentes: cloud flow, desktop flow, variables, conexiones, tabla/lista de estado.
2. Define valores DEV/TEST para rutas, URLs y modo.
3. Crea deployment checklist.
4. Ejecuta UAT o simulación con evidencias.
5. Documenta rollback.
6. Define runbook unattended: sesión, bloqueo, monitoreo, recuperación.
7. Si no tienes licencia unattended, marca el resultado como simulación.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El bot no arranca en TEST aunque funcionaba en DEV | Las variables de entorno (rutas, URLs, modo) no se actualizaron al desplegar la solución | Revisa el deployment checklist y confirma que cada variable de entorno tiene el valor de TEST antes de ejecutar la UAT |
| Las connection references quedan sin vincular tras importar la solución | La conexión de destino no existe en el ambiente TEST o no se remapeó durante la importación | Crea la conexión en TEST antes de importar y remapea explícitamente cada connection reference en el asistente de importación |
| La sesión unattended no arranca o se cierra sola | Había una sesión de Windows abierta o bloqueada en la máquina (Learn: en Windows 10/11 la ejecución desatendida exige que no haya sesiones activas, ni siquiera bloqueadas; en Windows Server, una sesión bloqueada del mismo usuario provoca error), el usuario de la conexión no está en el grupo **Remote Desktop Users** de la máquina, o la conexión de desktop flows no es válida | Cierra todas las sesiones de Windows de la máquina antes de la ejecución, agrega el usuario a **Remote Desktop Users**, comprueba la conexión de desktop flows y revisa **Monitor > Machines** ([Learn: Run unattended desktop flows](https://learn.microsoft.com/power-automate/desktop-flows/run-unattended-desktop-flows)) |
| El runbook no distingue si el fallo es de máquina o de credencial | El checklist de machine readiness no valida credenciales por separado del estado de la máquina | Divide la validación en dos pasos explícitos: estado de la máquina (encendida, agente conectado) y validez de la credencial (login manual de prueba) |
| El rollback deja el ambiente en un estado mixto (parte nueva, parte anterior) | El rollback plan no especifica el orden de reversión de componentes (solución, variables, conexiones) | Documenta en el rollback plan el orden exacto de reversión y verifica cada componente por separado antes de dar el rollback por completado |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### El bot no arranca en TEST

- **Causa probable:** variables de entorno (rutas, URLs, modo) siguen apuntando a valores de DEV.
- **Cómo comprobar:** compara el valor de cada variable de entorno en TEST contra el deployment checklist.
- **Cómo corregir:** actualiza las variables al valor correcto de TEST desde el gestor de soluciones, sin tocar código del flow.
- **Reiniciar vs. reparar:** corrige solo las variables afectadas y reintenta la ejecución puntual; no es necesario reimportar la solución completa.
- **Evidencia posterior a la corrección:** captura del valor de cada variable en TEST junto al deployment checklist marcado.

### Connection references sin vincular tras importar

- **Causa probable:** falta la conexión de destino en TEST o no se remapeó durante la importación.
- **Cómo comprobar:** en el gestor de soluciones de TEST, revisa si alguna connection reference aparece sin conexión asignada.
- **Cómo corregir:** crea la conexión faltante en TEST y remapea la connection reference desde la solución importada.
- **Reiniciar vs. reparar:** repara solo las conexiones sin vincular; no requiere reimportar la solución desde cero.
- **Evidencia posterior a la corrección:** captura de todas las connection references vinculadas correctamente.

### Sesión unattended no arranca o se cierra sola

- **Causa probable:** quedó una sesión de Windows abierta o bloqueada en la máquina, o la conexión de desktop flows no es válida.
- **Cómo comprobar:** revisa en la máquina si hay sesiones de Windows abiertas o bloqueadas, valida la conexión de desktop flows y mira **Monitor > Machines** y **Monitor > Desktop flow runs**.
- **Cómo corregir:** cierra todas las sesiones de Windows de la máquina (en Windows 10/11 una sesión bloqueada impide la ejecución desatendida), confirma que el usuario de la conexión está en **Remote Desktop Users**, vuelve a crear o validar la conexión de desktop flows y confirma en **Monitor > Machines** que la máquina está disponible. Si en Windows Server quieres reutilizar una sesión ya abierta del mismo usuario, Learn describe el ajuste **Reuse sessions for unattended runs** en la configuración de la máquina (**Monitor > Machines** > la máquina > **Settings**); documenta si lo activas y por qué.
- **Reiniciar vs. reparar:** si la sesión falló a mitad de una corrida unattended, reinicia esa ejecución completa una vez corregida la causa, porque el estado de la interfaz queda indeterminado.
- **Evidencia posterior a la corrección:** captura de una sesión unattended completa sin interrupciones y del runbook actualizado.

### El runbook no distingue fallo de máquina vs. credencial

- **Causa probable:** el checklist de machine readiness mezcla ambos aspectos en un solo punto de verificación.
- **Cómo comprobar:** revisa si el checklist tiene un ítem único para "máquina/cuenta lista" sin separar estado de máquina y validez de credencial.
- **Cómo corregir:** divide el checklist en dos verificaciones independientes: máquina (encendida, agente conectado) y credencial (login de prueba exitoso).
- **Reiniciar vs. reparar:** ajusta solo el checklist y repite la validación puntual afectada; no implica rehacer todo el despliegue.
- **Evidencia posterior a la corrección:** captura del checklist con ambos puntos verificados por separado.

### Rollback deja el ambiente en estado mixto

- **Causa probable:** el rollback plan no define el orden de reversión de solución, variables y conexiones.
- **Cómo comprobar:** revisa si el rollback plan lista los componentes sin un orden explícito de reversión.
- **Cómo corregir:** documenta el orden exacto (por ejemplo: revertir solución, luego variables, luego conexiones) y verifica cada componente antes de continuar al siguiente.
- **Reiniciar vs. reparar:** si el ambiente quedó mixto a mitad del rollback, complétalo siguiendo el orden documentado en vez de reiniciar el despliegue desde cero; el rollback ordenado es la reparación.
- **Evidencia posterior a la corrección:** captura del ambiente en un estado consistente (100% anterior o 100% nuevo) y del rollback checklist cerrado.

## Evidencia esperada

- Deployment checklist
- Rollback checklist
- Machine readiness checklist
- UAT firmado o simulado
- Runbook
- Registro de automatización

## Criterios de aprobación

- No hay cambios directos en producción.
- Las credenciales no aparecen en texto plano.
- La variante unattended distingue licencia real vs simulación.
- La validación postdeploy cubre configuración y ejecución.

## Assets reproducibles

- Matriz operacional: [matriz_operacional.csv](../practice-assets/rpa/sit-automation-case/validation/matriz_operacional.csv).
- Protocolo de tenant: [protocolo_tenant.md](../practice-assets/rpa/sit-automation-case/validation/protocolo_tenant.md).
- Plantillas: [deployment plan](../practice-assets/rpa/sit-automation-case/templates/deployment-checklist.md), [rollback plan](../practice-assets/rpa/sit-automation-case/templates/rollback-plan.md) y [runbook](../practice-assets/rpa/sit-automation-case/templates/runbook.md).
- Reset: revierte parámetros de ambiente y deja evidencia de que no cambiaste producción real.
- Variante sin licencia unattended: declara el bloqueo, valida el diseño y completa solo simulación attended/local (detalle abajo).

## Variante simulada (sin licencia unattended)

Tiempo estimado: 90 minutos. Escribe «simulación sin licencia unattended» en tu entrega.

1. **ALM real:** haz los ejercicios 1 a 5 con tu ambiente (exportar la solución, variables de entorno y connection references en DEV/TEST). Si solo tienes un ambiente, documenta la importación como diseño.
2. **Ejecución atendida en lugar de desatendida:** ejecuta el desktop flow en local desde Power Automate for desktop con los valores de TEST y guarda la evidencia de esa corrida.
3. **Machine readiness en papel:** checklist con sistema operativo (Windows 10/11 o Server), cuenta del bot, grupo **Remote Desktop Users**, sesiones cerradas, licencia que haría falta (Process, Hosted Process o prueba de 90 días) y quién registra la máquina, cada punto con su enlace de Learn.
4. **Runbook:** qué hace operaciones si la máquina está bloqueada, desconectada o sin licencia, y cómo se distingue cada caso en **Monitor > Machines** y **Monitor > Desktop flow runs**.

La variante simulada cumple los criterios de aprobación si declara qué parte es real y qué parte es diseño.

## Reto adicional

Agrega plan de continuidad si la máquina principal no está disponible.

> **Reutilización:** si ya armaste el paquete de operación del [Módulo 76](/nivel/rpa/modulo/alm-operacion-gobierno-soporte-rpa), úsalo aquí como entrega de este laboratorio y completa solo lo que le falte (UAT firmado o simulado y machine readiness).

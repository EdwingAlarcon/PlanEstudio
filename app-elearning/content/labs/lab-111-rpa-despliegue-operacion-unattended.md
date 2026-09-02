---
id: lab-111
title: "RPA — Despliegue entre ambientes y operación unattended"
level: "RPA"
duration: 180
product: ["Power Automate Desktop", "Solutions", "Machine Runtime", "Unattended RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "RPA Operations Specialist", "Automation Solution Architect"]
prerequisites:
  - "Módulos 68 y 75 completados"
  - "Ambiente DEV/TEST o simulación documentada"
files: []
---

# LAB-RPA-08 — Despliegue y operación unattended

## Objetivo

Preparar solución, configuración, dependencias, variables, referencias, validación, UAT, rollback, documentación postdeploy y operación unattended o variante simulada.

## Escenario de negocio

El bot debe pasar de DEV a TEST. Operaciones exige evidencia de readiness de máquina, cuenta, sesión, monitoreo, rollback y soporte.

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
| La sesión unattended no arranca o se cierra sola | La cuenta de servicio no tiene permisos de inicio de sesión remoto, o la máquina entra en bloqueo de pantalla | Configura la cuenta de servicio con "no bloquear pantalla" y valida que tenga permisos de RDP/sesión remota en el machine group |
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

- **Causa probable:** la cuenta de servicio no tiene permisos de sesión remota o la máquina entra en bloqueo de pantalla.
- **Cómo comprobar:** intenta iniciar sesión manualmente con la cuenta de servicio y revisa la configuración de bloqueo/protector de pantalla de la máquina.
- **Cómo corregir:** ajusta la política de energía/bloqueo de pantalla y otorga permisos de sesión remota (RDP o equivalente) a la cuenta de servicio en el machine group.
- **Reiniciar vs. reparar:** si la sesión falló a mitad de una corrida unattended, reinicia esa ejecución completa una vez corregidos los permisos, porque el estado de la interfaz queda indeterminado.
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
- Variante sin licencia unattended: declara el bloqueo, valida el diseño y completa solo simulación attended/local.

## Reto adicional

Agrega plan de continuidad si la máquina principal no está disponible.

# Protocolo de validación en tenant sandbox

Este protocolo permite validar técnicamente las prácticas piloto en un tenant de prueba. No marca a una persona como experta y no reemplaza revisión humana.

## Objetivo

Comprobar si los escenarios, evidencias y resultados esperados de las prácticas piloto son reproducibles en un entorno controlado de Power Platform o Dynamics 365.

## Alcance

Cubrir al menos una práctica de seguridad Dataverse, Power Automate, ALM/despliegue, desarrollo/plugin, Customer Service si la licencia lo permite, un Challenge Lab y una etapa de Work Simulation.

## Entorno

- Tenant sandbox sin datos reales de clientes.
- Usuarios ficticios.
- Ambientes separados para desarrollo y prueba cuando aplique.
- Soluciones y conexiones con nombres no sensibles.
- Sin credenciales en documentos, capturas ni repositorio.

## Licencias y permisos

| Área | Licencia/permisos |
| --- | --- |
| Dataverse seguridad | Power Apps/Dataverse, System Customizer o rol equivalente en sandbox |
| Power Automate | Power Automate, permisos sobre conexiones de prueba |
| ALM | Power Platform CLI, permisos para importar soluciones en ambientes sandbox |
| Plugin/Custom API | Dataverse, registro de plugin en sandbox, herramientas de desarrollo |
| Customer Service | Dynamics 365 Customer Service/Contact Center si está disponible |

## Preparación

1. Crear datos ficticios.
2. Confirmar ambiente activo.
3. Preparar solución no administrada de prueba.
4. Definir evidencia esperada.
5. Registrar versión de práctica y fecha.
6. Acordar criterio: aprobado, requiere ajuste o no ejecutable.

## Ejecución

Ejecuta los pasos mínimos de la práctica sin usar datos productivos. Registra diferencias entre el enunciado y el comportamiento real del tenant. Si una licencia bloquea el escenario, marca el estado como bloqueado por licencia.

## Evidencias

Usa capturas anonimizadas, export de solución de prueba, run history sin tokens, Plugin Trace Log anonimizado, plan de rollback, test results y notas de hallazgos. No subas credenciales ni IDs reales.

## Cleanup y rollback

Elimina datos de prueba, desactiva flujos, borra conexiones no usadas, remueve soluciones temporales si no se necesitan y documenta cualquier residuo técnico.

## Matriz de validación

| Práctica | Entorno | Licencia requerida | Permisos | Datos necesarios | Pasos ejecutados | Evidencia real | Resultado esperado | Resultado observado | Diferencias | Cambios necesarios | Validado por | Fecha | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| INC-001 | Dataverse sandbox | Power Apps/Dataverse | Security role admin en sandbox | Usuarios ficticios, oportunidad de prueba | Pendiente | Pendiente | Mínimo privilegio validado | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | No ejecutada |
| INC-002 | Power Automate sandbox | Power Automate | Owner de flujo de prueba | Payload ficticio | Pendiente | Pendiente | Idempotencia y control de duplicados | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | No ejecutada |
| INC-003 | Dev/Test sandbox | Power Platform | Import solution en test | Solución administrada de prueba | Pendiente | Pendiente | Deploy/rollback reproducible | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | No ejecutada |
| INC-005 | Dataverse dev | Dataverse + tooling dev | Plugin registration en sandbox | Datos de carga ficticios | Pendiente | Pendiente | Trace y mitigación verificables | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | No ejecutada |
| INC-004 | Customer Service sandbox | D365 Customer Service | Admin funcional | Casos ficticios | Pendiente | Pendiente | SLA reproducible | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Bloqueada por licencia |
| CH-001 | Dataverse sandbox | Power Apps/Dataverse | Maker + security config | Solicitudes ficticias | Pendiente | Pendiente | Solución defendible | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | No ejecutada |
| SIM-001 | Documental/sandbox | Según etapa | Sponsor ficticio | Brief ficticio | Pendiente | Pendiente | Handoff y riesgos documentados | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | No ejecutada |

Estados permitidos: No ejecutada, Preparada, Bloqueada por licencia, Bloqueada por permisos, Ejecutada con éxito, Ejecutada con diferencias, Requiere corrección, No reproducible.

## Limitaciones

No todas las prácticas son ejecutables sin licencias reales. Una práctica marcada como reproducible en sandbox puede seguir necesitando revisión humana para evaluar calidad de criterio, comunicación y justificación.

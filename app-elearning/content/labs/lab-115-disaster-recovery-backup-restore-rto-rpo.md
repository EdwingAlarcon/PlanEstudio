---
id: lab-115
title: "Disaster Recovery — Backup, Restauración y RTO/RPO de una Solución Dataverse"
level: "N4"
duration: 90
product: ["Dataverse", "Power Platform CLI", "Power Platform Admin Center"]
certifications: ["Buenas Prácticas"]
role: ["Administrator", "Solution Architect", "Developer"]
prerequisites:
  - "Lab 56 completado: cambio seguro entre entornos Dev/Test/Prod"
  - "Módulo 31 estudiado: Arquitectura Empresarial y Gobernanza"
files: []
lastVerified: "2026-10"
---

# Lab 115 — Disaster Recovery: Backup, Restauración y RTO/RPO

## Objetivo

Ejecutar un ciclo real de backup y restauración de una solución Dataverse con sus datos, simular
una pérdida, y calcular y justificar por escrito RTO (tiempo de recuperación objetivo) y RPO
(punto de recuperación objetivo) — no solo explicar los conceptos, sino producir ambos números
con evidencia de ejecución real.

## Nivel

**Nivel Avanzado/Arquitecto — Buenas Prácticas** (no es una certificación oficial Microsoft).

## Rol recomendado

Administrator, Solution Architect, Developer.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** Un auditor de continuidad de negocio le pregunta al equipo de SIT: "si el
ambiente de producción del sistema de solicitudes se pierde hoy, ¿cuánto tiempo tardarían en
recuperarlo y cuántos datos perderían?" El equipo no tiene una respuesta con evidencia — solo
"debería poder recuperarse, Dataverse hace backups automáticos". Tu tarea es convertir esa
suposición en un número medido y un procedimiento documentado.

**Por qué es una buena tarea para practicar:** disaster recovery es, de los temas de este curso,
el que con más frecuencia se queda en "awareness" — se menciona pero no se ejecuta. Este lab
exige ejecutar el ciclo completo, no solo describirlo.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Backup real de solución + datos | 20 min |
| Ejercicio 2 — Simular una pérdida controlada | 15 min |
| Ejercicio 3 — Restaurar y medir RTO | 25 min |
| Ejercicio 4 — Calcular RPO y plan de comunicación | 30 min |
| **Total** | **90 min** |

## Tecnologías utilizadas

- Power Platform CLI (`pac solution export`, `pac data export`/`pac data import` o export/import
  manual de datos vía Excel/Dataverse si no tienes acceso al CLI de datos).
- Power Platform Admin Center (backups automáticos de Dataverse, si tu entorno los expone — los
  entornos Developer/Trial normalmente no tienen backups point-in-time habilitados; documenta esto
  si es tu caso, no lo ocultes).

## Nota de alcance — backups automáticos vs. backup manual

Dataverse ofrece backups automáticos point-in-time en producción/sandbox con licencia adecuada,
pero no en entornos Developer/Trial gratuitos. Si tu entorno no tiene esa capacidad, este lab usa
**backup manual** (exportar solución + datos) como equivalente práctico — es una limitación real
y conocida, no un atajo: documenta explícitamente cuál mecanismo usaste y, si fue el manual, qué
perderías respecto al backup automático point-in-time (continuidad entre el momento del último
export manual y el incidente, en vez de un punto de recuperación casi inmediato).

## Ejercicio 1 — Backup real

1. Exporta la solución de tu sistema de solicitudes (de un lab anterior, o una solución mínima de
   práctica con al menos 1 tabla y 5-10 registros) como paquete unmanaged.
2. Exporta los datos de al menos una tabla con registros reales de prueba (vía `pac data export`,
   Excel export de Dataverse, o configuration migration tool).
3. Registra la marca de tiempo exacta de este backup — la necesitarás en el Ejercicio 4.

**Validación esperada:** tienes un archivo de solución (.zip) y un archivo de datos exportado,
ambos con marca de tiempo documentada.

## Ejercicio 2 — Simular la pérdida

Simula una pérdida controlada y reversible (NO elimines el entorno real): por ejemplo, elimina
deliberadamente 3-5 registros de la tabla que respaldaste, o crea un segundo entorno vacío que
representará "el entorno recuperado desde cero". No ejecutes nada irreversible contra un entorno
que no sea completamente de práctica.

## Ejercicio 3 — Restaurar y medir RTO

1. Inicia un cronómetro real en el momento en que "empieza el incidente" (justo después de simular
   la pérdida).
2. Restaura la solución y los datos desde tu backup del Ejercicio 1 (import de solución + import
   de datos) en el entorno recuperado.
3. Detén el cronómetro cuando el sistema vuelva a estar operativo (datos visibles y solución
   funcional).
4. **RTO medido** = el tiempo real que tomó este ciclo. Documenta el número exacto, no una
   estimación.

**Validación esperada:** un RTO medido en minutos, con el desglose de cuánto tomó cada paso
(import de solución vs. import de datos), no solo el total.

## Ejercicio 4 — Calcular RPO y plan de comunicación

1. **RPO** = la diferencia de tiempo entre la marca de tiempo de tu último backup (Ejercicio 1) y
   el momento en que ocurrió la pérdida simulada (Ejercicio 2). Esto representa cuántos datos
   (en términos de tiempo, no de cantidad de registros) se perderían en un incidente real si la
   frecuencia de backup fuera la misma que usaste en este lab.
2. Responde por escrito: si SIT necesitara un RPO de 1 hora en vez del que acabas de medir, ¿qué
   cambiaría en el procedimiento (frecuencia de backup, automatización, licenciamiento)?
3. Escribe un plan de comunicación a usuarios durante el incidente: qué se les dice al empezar,
   qué se les dice al terminar, y qué se hace si la restauración tarda más de lo esperado.

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Asumir que Dataverse "ya hace backup" sin verificar si el entorno de práctica lo tiene habilitado | No se distinguió backup automático (licencia) de backup manual | Verificar explícitamente la capacidad del entorno antes de prometer un RTO/RPO basado en una suposición |
| Reportar un RTO estimado en vez de medido | Calcular "a ojo" cuánto debería tardar | Medir con cronómetro real durante la ejecución del Ejercicio 3 |
| Confundir RPO con "cuántos registros se perdieron" | No distinguir la métrica de tiempo de la métrica de volumen | RPO se expresa en tiempo (cuánto tiempo de actividad entre el último backup y el incidente), no en número de registros |
| Omitir el plan de comunicación por enfocarse solo en lo técnico | Tratar DR como un problema puramente técnico | Un incidente real afecta a usuarios; el plan de comunicación es parte entregable del lab, no opcional |

## Criterios de Validación

- [ ] Ejecuté un backup real (solución + datos) con marca de tiempo documentada
- [ ] Simulé una pérdida controlada sin afectar un entorno que no fuera de práctica
- [ ] Medí un RTO real con cronómetro, desglosado por paso
- [ ] Calculé un RPO basado en la diferencia de tiempo entre backup e incidente, con justificación
- [ ] Escribí un plan de comunicación a usuarios durante el incidente

## Evidencia esperada

- Archivos de backup (solución + datos) con marca de tiempo.
- Registro del cronómetro de restauración (captura o anotación con hora de inicio/fin).
- RTO y RPO calculados con el desglose de cómo se obtuvo cada número.
- Plan de comunicación a usuarios.

## Criterios de aprobación

- El RTO está medido, no estimado, con desglose por paso.
- El RPO está correctamente calculado como diferencia de tiempo, no como cantidad de registros.
- El plan de comunicación cubre inicio, cierre y escalamiento si la restauración se demora.
- 100% de los ítems de Criterios de Validación marcados.

## Preguntas de Reflexión

1. ¿Por qué un RTO medido es más valioso para un auditor que un RTO estimado "a ojo"?
2. Si tu entorno de práctica no tenía backups automáticos habilitados, ¿qué le dirías a un cliente real que preguntara por su RPO de producción?
3. ¿Qué parte de este procedimiento automatizarías primero si tuvieras que repetirlo mensualmente?

## Módulos Relacionados

- Módulo 31 — Arquitectura Empresarial y Gobernanza
- Módulo 33 — Multi-tenant, Multi-geo y Estrategia de Ambientes
- Lab 56 — Cambiar entre Entornos Dev/Test/Prod de Forma Segura

## Competencias Desarrolladas

- Ejecución real (no solo conceptual) de un ciclo de backup/restore de Dataverse.
- Medición de RTO con evidencia de tiempo real, no estimación.
- Cálculo correcto de RPO como métrica de tiempo.
- Diseño de un plan de comunicación a usuarios durante un incidente de continuidad.

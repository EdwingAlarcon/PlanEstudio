# Guía para revisores de prácticas

Esta guía ayuda a mentores, pares o instructores a revisar paquetes de evidencia de PlanEstudio con criterios consistentes.

## Qué recibes

El estudiante puede entregar un paquete JSON y Markdown con la práctica, intento, evidencias declaradas, reflexión, autoevaluación, rúbrica y preguntas para revisión. Revisa primero la privacidad: no debe contener secretos, datos reales de clientes, usuarios reales, IDs de tenant ni URLs internas sensibles.

## Cómo revisar

1. Lee el contexto de la práctica y el tipo de evidencia: real, simulada, conceptual, reproducible en sandbox, requiere licencia o requiere configuración empresarial.
2. Verifica que la evidencia responde al problema, no solo que existe un archivo o captura.
3. Evalúa cada criterio de la rúbrica con evidencia observable.
4. Registra fallos críticos si hay riesgos de seguridad, ALM, datos sensibles, rollback o validación.
5. Diferencia una solución alternativa válida de una solución incompleta.
6. Escribe feedback accionable y específico.

## Criterio de aprobación

Aprobar significa que la evidencia revisada satisface la rúbrica indicada para ese intento. No significa certificación, seniority laboral, dominio profesional completo ni validación en producción.

## Feedback útil

- La corrección resuelve el síntoma, pero concede privilegios a nivel organización sin justificar el impacto. Repite el ejercicio aplicando mínimo privilegio.
- El plan de despliegue identifica el paso de importación, pero falta rollback verificable y validación postdeploy. Agrega esos artefactos antes de cerrar.
- El diagnóstico distingue causa raíz y síntoma. Para el siguiente intento, añade una prueba negativa que demuestre que el error no reaparece.

Evita feedback genérico como "bien hecho". Nombra el criterio, la evidencia observada y la acción siguiente.

## JSON importable

Si el estudiante comparte la plantilla de revisión, devuélvela como JSON con `format: "planestudio-external-review"` y `schemaVersion: 1`. Conserva `practiceId`, `attemptId`, criterios y pesos exactamente como vienen en el paquete. La app recalcula el puntaje desde la rúbrica, por lo que `score` debe coincidir con los niveles declarados.

Resultados admitidos:

- `reviewed`: revisado sin dictamen final.
- `approved`: aprobado sin observaciones bloqueantes.
- `approved_with_observations`: aprobado con recomendaciones.
- `requires_changes`: requiere ajustes y normalmente nueva entrega.
- `rejected`: no aprobado por fallos graves o evidencia insuficiente.

Usa `resubmissionRequired: true` cuando el estudiante debe crear un nuevo intento. En ese caso incluye `improvements` accionables. No marques `approved` si también solicitas reentrega o registras fallos críticos.

## Sesgos a evitar

No penalices por usar pistas si la práctica las permite. No asumas dominio por rapidez. No exijas licencias o tenant real cuando el enunciado declara evidencia simulada o conceptual. No aceptes capturas con datos reales como mejor evidencia.

## Nueva entrega

Solicita nueva entrega cuando exista un fallo crítico, evidencia insuficiente, contradicción con la rúbrica o riesgos de seguridad/privacidad. Recomienda crear un nuevo intento para conservar trazabilidad.

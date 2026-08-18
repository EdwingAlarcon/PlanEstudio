# Sistema de repaso espaciado

Documentación técnica del motor de repetición espaciada (`/repaso`). No es contenido del curso —
es referencia para quien mantenga el código. Para el texto orientado al estudiante, ver
[`GUIA_REPASO_INTELIGENTE.md`](GUIA_REPASO_INTELIGENTE.md).

## Propósito

PlanEstudio medía **contenido completado**, no **conocimiento recordado**: un módulo aprobado
seguía mostrando 100 % semanas después aunque el conocimiento se hubiera degradado. Esta capa
independiente aplica *retrieval practice*: las preguntas ya respondidas vuelven a aparecer en
intervalos crecientes según el desempeño previo.

## Arquitectura

```
src/lib/review-date.ts           utilidades de fecha local (día calendario, no UTC)
src/lib/review-scheduler.ts      SM-2 puro, determinista, sin I/O ni reloj implícito
src/lib/review-queue.ts          elegibilidad + cola diaria + interleaving + agregados
src/lib/review-store.ts          Zustand persistido — planestudio.spaced-repetition.v1
src/lib/retention-portability.ts export/import versionado + merge
```

Regla dura: **ningún componente UI calcula scheduling**. La UI llama al store, el store llama al
scheduler (`sm2Scheduler`), que vive detrás de la interfaz `ReviewScheduler` — reemplazable en el
futuro sin tocar UI, store ni banco de preguntas.

## Elegibilidad

Una pregunta entra al calendario de repaso **solo cuando se responde efectivamente** en un quiz de
módulo o un diagnóstico de caso — nunca por marcar un módulo como completado. Esto es lo que impide
por construcción que aparezca contenido de un módulo futuro:
`isQuestionEligibleForReview(questionId, cards)` en `review-queue.ts` devuelve `true` únicamente si
ya existe una tarjeta para ese id.

## Estados de una tarjeta

`new → learning → review` (con `relearning` cuando falla o cuando se marca "Otra vez" tras una
respuesta correcta) → `suspended` (reservado, no se usa automáticamente en esta fase). Cada tarjeta
guarda `repetitions`, `intervalDays`, `easeFactor`, `nextReviewAt`, `lapses`, contadores de
respuestas y `isLeech` (marcado a partir de `lapses >= 5`, **sin suspender automáticamente**).

## Confianza y coherencia

Tras responder, el estudiante indica `Otra vez / Difícil / Bien / Fácil` (`ReviewConfidence`).
Regla obligatoria: **una respuesta incorrecta nunca puede producir un intervalo "fácil"** — el
scheduler degrada la confianza a `"again"` internamente antes de calcular, sin depender de que la
UI lo haga bien. Una respuesta correcta con confianza `"again"` ("lo acerté pero no lo sabía de
verdad") se trata como un lapso suave: intervalo corto, pero **sin** incrementar `lapses` ni
`incorrectReviews`, porque objetivamente fue correcta.

## Intervalos

Escalera de aprendizaje inicial `[1, 3, 7]` días; en revisión estable, `intervalo × easeFactor`
(ajustado por confianza), acotado a `[1, 180]` días con `easeFactor` en `[1.3, 2.8]`. Todos los
valores están centralizados como constantes en `review-scheduler.ts` — nunca se exponen al
estudiante (§55 del sprint original).

## Cola diaria e interleaving

`getDueReviewItems()` ordena por: más vencida → más lapses → `quiz-question` antes que
`case-diagnosis` → `interleaveByModule()` (round-robin determinista, sin `Math.random`) para que
una sesión nunca muestre muchas preguntas seguidas del mismo módulo. El tamaño de sesión
(`corta 10 | normal 20 | larga 30`) acota la cola aunque el backlog real sea mayor — volver tras 30
días sin estudiar nunca genera "30 sesiones", solo una cola más larga y acotada.

## Stores — independencia

El repaso vive en `planestudio.spaced-repetition.v1`, separado de:

- `plan-estudio-progress` (progreso académico)
- `planestudio.practice-progress.v1` (prácticas profesionales)
- `planestudio.interactive-practice.v1` (prácticas interactivas)
- `planestudio.workstation.v1` (Developer Workstation)

Ninguna acción de repaso modifica estos otros stores, y viceversa. `review-store.ts` sigue el
patrón de `practice-progress.ts`/`workstation-store.ts` (`version` + `migrate` +
`sanitizeReviewState()`), no el de `progress.ts` (que no tiene sanitización).

## Integración con el quiz existente

Un único punto de enganche cubre quiz de módulo, diagnóstico de caso y simulador, porque los tres
ya reusan `QuizPanel`: `registerForReview` (default `true`) llama a
`registerQuestionForReview()` al responder. El simulador pasa `registerForReview={false}` porque
mide desempeño bajo condiciones de examen, una señal distinta a "¿todavía lo recuerdo?". No se
duplica `evaluateAnswer`, `recordAttempt` ni el feedback — se reusan de `quiz-engine.ts`.

## Backup

`retention-portability.ts` replica el patrón de `practice-portability.ts`: payload versionado
(`format: "planestudio-retention"`), límite de 1 MB, rechazo de `__proto__`/`constructor`/
`prototype`, ids desconocidos que se ignoran con warning sin abortar el import, y merge por
`lastReviewedAt` más reciente. Nunca toca los otros tres stores.

## Tests

- Unitarios: `review-date.test.ts`, `review-scheduler.test.ts`, `review-queue.test.ts`,
  `review-store.test.ts`, `retention-portability.test.ts` en `src/lib/__tests__/`.
- Validador: `npm run validate:spaced-repetition` (encadenado en `validate:content`) — verifica
  elegibilidad, invariantes del scheduler y la versión del store.
- E2E: `e2e/spaced-repetition.spec.ts`.

## Limitaciones honestas

- El scheduling es local al navegador; no sincroniza entre dispositivos.
- Borrar los datos del sitio sin exportar antes elimina el progreso de repaso.
- Es una aproximación pedagógica, no una medición certificada de conocimiento.
- Responder bien en `/repaso` no equivale a experiencia práctica real — para eso existen los labs y
  la práctica profesional/interactiva.

## Fuera de alcance (Fase 1)

Prácticas interactivas dentro del scheduler, suspensión automática de leeches, estadísticas
avanzadas, priorización adaptativa, preguntas de respuesta abierta, Interview Review Mode, y usar
los intentos del simulador como señal de scheduling. `ReviewItemType` queda preparado para
`"interactive-practice"` sin implementarlo.

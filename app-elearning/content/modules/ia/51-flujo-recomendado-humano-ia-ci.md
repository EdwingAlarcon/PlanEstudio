---
moduleId: 51
title: "Flujo Recomendado: Humano Diseña, IA Implementa, CI Valida, Humano Aprueba"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 10
slug: "flujo-recomendado-humano-ia-ci"
---
### 🎯 Objetivo
Aplicar de punta a punta el flujo recomendado de desarrollo asistido por IA — humano diseña, IA implementa, CI valida, humano aprueba — sobre un caso realista, integrando lo aprendido en los módulos 42-50.

### 📖 Conceptos Clave
- **Humano diseña:** la persona define el problema, el alcance y el criterio de éxito antes de involucrar a la IA — esta etapa no se delega (Módulo 45: tareas acotadas y verificables).
- **IA implementa:** el agente o asistente genera el cambio dentro del alcance definido, usando prompts reutilizables cuando aplica (Módulo 47) y evitando vibe coding sin control en tareas de riesgo (Módulo 46).
- **CI valida:** el pipeline (lint, typecheck, tests, build) confirma objetivamente que el cambio no rompe nada existente (Módulo 50) — esta etapa nunca se salta, sin importar cuán simple parezca el cambio.
- **Humano aprueba:** una persona revisa el diff completo contra el criterio de éxito original, verificando alcance, efectos secundarios y seguridad (Módulo 48), antes de fusionar — la aprobación es la última barrera, no un trámite.
- **El ciclo se repite, no se acorta:** ante un resultado insatisfactorio en cualquier etapa, se vuelve a la etapa anterior (ej. si CI falla, se ajusta la implementación; si la implementación no cumple el criterio, se re-especifica el diseño) — nunca se salta una etapa para "avanzar más rápido".

### 👨‍💻 Actividades Prácticas Paso a Paso
1. **Diseña:** elige una mejora pequeña y real en este mismo repositorio (ej. un mensaje de error más claro en un componente, o un test faltante) y escribe el criterio de éxito en una frase verificable (ej. "el mensaje de error debe indicar qué campo falló, no solo 'error de validación'").
2. **Implementa:** usa este prompt de tarea acotada (combinando la plantilla del Módulo 47 con el patrón del Módulo 45):
   ```
   Rol: desarrollador de este proyecto Next.js.
   Contexto: en {{archivo}}, el mensaje de error actual es "{{mensaje genérico}}".
   Tarea: cámbialo para que indique específicamente qué campo falló la validación.
   Restricciones: no toques ningún otro archivo ni cambies la lógica de validación en sí.
   Verificación: ejecuta npm run lint y npx tsc --noEmit al terminar y muéstrame el resultado.
   ```
3. **Valida:** ejecuta `npm run lint`, `npx tsc --noEmit` y `npx vitest run` (o el subconjunto relevante) sobre el cambio, y corrige cualquier falla antes de continuar.
4. **Aprueba:** usa el prompt de revisión del Módulo 48 sobre el diff generado, y luego revísalo tú mismo con la checklist completa (alcance, efectos secundarios, seguridad, tests) como si fueras un segundo revisor — documenta explícitamente por qué lo apruebas o qué le falta.
5. Escribe un resumen de una página del ciclo completo que seguiste, identificando en qué etapa (si alguna) tuviste que devolverte a un paso anterior.

### 💼 Casos Reales de Negocio
El equipo de plataforma de SIT adoptó este flujo de 4 etapas como estándar después de dos incidentes previos (Módulos 46 y 50) causados por saltarse la validación de CI o la aprobación humana "para ir más rápido". Al medir los primeros 3 meses con el flujo completo aplicado sin excepciones, el número de regresiones detectadas en producción bajó de forma medible, y el tiempo total por cambio (diseño + implementación + validación + aprobación) resultó comparable al proceso anterior sin IA — la ganancia no fue "saltarse pasos", sino reducir el tiempo de la etapa de implementación manteniendo intactas las etapas de validación y aprobación humana.

### ✅ Buenas Prácticas
- Nunca saltar una etapa del ciclo, sin importar cuán simple parezca el cambio o cuánta prisa haya.
- Medir el flujo completo (no solo la velocidad de generación de código) para saber si realmente está funcionando en el equipo.
- Tratar cada etapa como un gate independiente: un cambio no avanza a la siguiente etapa hasta que la anterior se cumple satisfactoriamente.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Saltarse la etapa de "humano aprueba" cuando el cambio "se ve simple" | Confundir simplicidad aparente con ausencia de riesgo | Aplicar la aprobación humana de forma consistente, sin excepciones por tamaño percibido |
| Medir solo la velocidad de generación de código como éxito del flujo | Ignorar el costo de regresiones no detectadas | Medir el flujo completo, incluyendo incidentes evitados, no solo velocidad de la etapa de implementación |
| Re-especificar el diseño a mitad de la implementación en lugar de volver a la etapa de diseño explícitamente | Ajustar el alcance sobre la marcha sin documentarlo | Si el criterio de éxito cambia, volver formalmente a la etapa de diseño antes de continuar |

### 🧪 Criterios de Validación
- [ ] Completo el ciclo de las 4 etapas sobre un cambio real en este repositorio usando el prompt de tarea acotada
- [ ] Documento en qué etapa (si alguna) tuve que devolverme a un paso anterior y por qué
- [ ] El cambio final pasa lint, typecheck y tests antes de considerarse aprobado
- [ ] Escribo el resumen de una página del ciclo aplicado
- [ ] Relaciono este flujo completo con la preparación de evidencia de cualquier lab de este plan de estudio (diseño → implementación asistida → validación con CI → revisión humana antes de entregar)

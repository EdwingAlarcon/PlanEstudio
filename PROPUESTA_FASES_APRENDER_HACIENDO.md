# Propuesta: Fases 1-6 del rediseño "Aprender haciendo"

**Estado: BORRADOR, no aprobado, nada implementado.** Redactado el 2026-10-08.

**Origen de este documento.** `CLAUDE.md` menciona "las Fases 1-6 del rediseño más amplio, pendientes de aprobación
explícita", pero ninguna lista de esas fases quedó escrita en el repo ni en la memoria. Esta propuesta **no
reconstruye un plan original**: es una propuesta nueva, armada con lo que sí está documentado (la sección 4 y el
roadmap de `AUDITORIA_INTEGRAL_PLANESTUDIO_2026.md`, y lo aprendido en los tres pilotos). Si existe el plan
original, prevalece sobre este.

## 1. Punto de partida

- **El patrón ya está validado en 3 de 76 módulos:** 10 (Canvas Apps), 11 (Power Automate Avanzado) y 13
  (JavaScript y PCF Básico). Consiste en microlecciones con práctica continua, evidencia de tenant estructurada,
  pistas escalonadas con gating real, troubleshooting que parte del síntoma y un reto de transferencia "sin pasos".
- **La auditoría integral (§4) lo confirma como hallazgo central:** el reto abierto existe y funciona, pero no es el
  diseño por defecto. La mayoría de módulos podría ganar una actividad corta de "decide sin que te digan los pasos"
  sin contenido nuevo. La dimensión "problem solving" se califica hoy como débil (peso 20% en su tabla de métricas).
- **El motor ya existe:** `interactive-practices.ts` y `pilot-mastery.ts` (generalizado a
  `calculatePilotMastery(records, config)`). Los pilotos no necesitaron tipos de práctica ni stores nuevos.
- **Módulos por aplicar: 73.** Básico 8, Intermedio 9 (3 ya hechos), Avanzado 13, Arquitecto 11, IA 15, D365 10,
  RPA 10.
- **Qué es verificable y qué no:** los conteos de módulos salen de `content/modules/`. El esfuerzo por módulo es una
  estimación mía a partir de los pilotos (9 prácticas nuevas en 3 módulos, es decir, unas 3 por módulo, más la
  reescritura del cuerpo). No es un dato medido.

## 2. Principios para todas las fases

1. **Una fase = un bloque de módulos + una auditoría + aprobación antes de pasar a la siguiente.** Igual que los
   pilotos: el usuario decide después de ver el resultado.
2. **No cambiar el contenido de los "Casos Reales de Negocio"** sin revisar las preguntas `appliesTo: "caso"`, que
   referencian sus hechos exactos (lección del Módulo 13).
3. **Resolver primero las inconsistencias curriculares del bloque** (prerrequisitos que apuntan a módulos
   transversales o posteriores), como se hizo en la Fase 0 y con el puente de Módulo 13.
4. **Mantener los invariantes de `CLAUDE.md`:** conteos vigentes, stores independientes, estructura de 7 secciones
   por módulo. Cada fase actualiza los conteos de forma explícita y no los mezcla.
5. **Validación en serie:** `npm run verify`, luego build, luego `npm run e2e`, nunca en paralelo.

## 3. Las fases propuestas

### Fase 1 — Línea base y herramientas (sin tocar contenido de módulos)

- **Qué:** clasificar los 76 módulos según tengan o no micropráctica, evidencia estructurada, troubleshooting
  síntoma-primero y reto "sin pasos". Añadir esa clasificación como chequeo informativo (advertencia, no error) a
  `validate:content`. Subir el tope de prácticas del piloto de 24 en `validate-interactive-practices.ts` y
  `interactive-practices.test.ts`, que hoy bloquea cualquier práctica nueva.
- **Por qué primero:** la auditoría reconoce que el porcentaje de módulos con actividad "sin pasos" "no está
  cuantificado con precisión". Sin esa línea base no se puede decir si una fase mejoró algo.
- **Entregable:** tabla de 76 módulos con su estado y la métrica "% de módulos con reto sin pasos".
- **Cierre:** la tabla existe y el tope de prácticas se decidió con un criterio explícito, no con otro número mágico.
- **Esfuerzo relativo:** bajo.

### Fase 2 — Nivel Básico (8 módulos): la puerta de entrada

- **Qué:** aplicar el patrón en versión ligera a los Módulos 1-8, con retos que no exijan tenant (ya hay variante
  sin tenant en el Lab 03 y ruta de primeras 2 horas).
- **Por qué segundo:** es donde el principiante decide si sigue. Es donde apareció la queja de "no sé por dónde
  empezar". Aprender haciendo rinde más al inicio.
- **Riesgo:** el principiante no sabe aún usar controles ni herramientas, así que el reto "sin pasos" debe ser más
  corto y con pistas cruzadas a la micropráctica anterior (observación ya hecha en el Módulo 10).
- **Cierre:** los 8 módulos con el patrón, más una prueba con la persona real que dijo sentirse perdida, no solo una
  simulación mía.
- **Esfuerzo relativo:** medio.

### Fase 3 — Intermedio restante (6 módulos: 9, 12, 14, 15, 16, 17)

- **Qué:** completar el nivel cuyos otros tres módulos ya son piloto, para que quede homogéneo.
- **Cierre:** Intermedio completo con el patrón. Primer nivel de certificación terminado de punta a punta.
- **Esfuerzo relativo:** medio.

### Fase 4 — Avanzado (13 módulos, enfoque código)

- **Qué:** aplicar el patrón del Módulo 13 (código de cliente, PCF, C#, plugins). Cuidar los puentes de
  prerrequisitos de C#/.NET y TypeScript/React que ya existen como recursos.
- **Riesgo:** los retos de código deben compilar y correr (estándar de calidad del repo), lo que sube el costo de
  verificación por módulo.
- **Cierre:** 13 módulos con el patrón y todos los fragmentos de código verificados.
- **Esfuerzo relativo:** alto.

### Fase 5 — Arquitecto (11 módulos, enfoque decisión)

- **Qué:** el "reto sin pasos" aquí no es construir, sino **decidir y defender**: elegir una arquitectura ante un
  caso con restricciones y justificar el trade-off. Se apoya en los diagramas Mermaid y en las soluciones de
  referencia de los capstones.
- **Riesgo:** una decisión de arquitectura no tiene una sola respuesta correcta, así que la validación depende de
  criterios y no de una solución única. La app no valida contra un tenant y eso no es un defecto.
- **Cierre:** 11 módulos con retos de decisión y criterios de evaluación explícitos.
- **Esfuerzo relativo:** medio-alto.

### Fase 6 — Especializaciones transversales (35 módulos: IA 15, D365 10, RPA 10) y cierre

- **Qué:** empezar por lo que la auditoría ya señala: los módulos 43, 44, 46, 54 y 55 del nivel IA (ítem #11, P2),
  que son mayormente expositivos y necesitan una actividad de fallo y corrección. Después, el resto según la
  demanda de las rutas profesionales.
- **Cierre del rediseño:** actualizar conteos en `CLAUDE.md`, revisar que el simulador y el repaso espaciado
  sigan consistentes, y decidir si lo que quede sin migrar se declara explícitamente fuera de alcance.
- **Esfuerzo relativo:** alto en volumen, pero se puede cortar en cualquier punto sin dejar el curso incoherente.

## 4. Resumen

| Fase | Alcance | Módulos | Esfuerzo relativo |
|---|---|---|---|
| 1 | Línea base y herramientas | 0 (los 76 se clasifican) | Bajo |
| 2 | Básico | 8 | Medio |
| 3 | Intermedio restante | 6 | Medio |
| 4 | Avanzado | 13 | Alto |
| 5 | Arquitecto | 11 | Medio-alto |
| 6 | IA + D365 + RPA y cierre | 35 | Alto |

Total por migrar: 8 + 6 + 13 + 11 + 35 = **73 módulos** (los 3 restantes son los pilotos).

## 5. Decisiones que necesito del usuario antes de empezar

1. **¿La migración es masiva o parcial?** Mi propuesta permite cortar tras cualquier fase. Si lo único que importa
   es la ruta de certificación, bastan las Fases 1 a 5.
2. **¿Se incluyen las especializaciones transversales (Fase 6)?** Son casi la mitad de los módulos (35 de 76) y,
   según la auditoría, su evidencia de mercado es desigual.
3. **¿El orden es correcto?** Pongo Básico antes que Intermedio porque la queja inicial fue de un principiante. Si
   se prefiere cerrar primero una certificación completa, se invierten las Fases 2 y 3.
4. **¿Quién prueba como principiante real?** El cierre de la Fase 2 pide a una persona, no a una simulación mía.

## 6. Lo que esta propuesta no resuelve

- No valida contra el tenant real del alumno, y eso no es un defecto del diseño.
- No sustituye los ítems P1 de la auditoría que no son pedagógicos (versionado de `progress.ts`, nivel "Verified",
  motor de Job-Ready scoring). Siguen siendo asuntos aparte.
- La estimación de esfuerzo es relativa, no en horas. No tengo datos de cuánto tardaron los pilotos en tiempo real.

# Propuesta: Fases 1-6 del rediseño "Aprender haciendo"

**Estado (2026-10-08): Fase 1 HECHA (herramientas y línea base). Fases 2-5 y el recorte de la Fase 6
siguen sin implementar y sin aprobación individual.** Las cuatro decisiones de alcance (sección 5) las tomó
Claude por delegación del usuario ("decide tú las 4") y son revisables.

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

### Fase 1 — Línea base y herramientas (sin tocar contenido de módulos) — HECHA 2026-10-08

- **Qué se hizo:** `src/lib/learning-by-doing-audit.ts` clasifica los 76 módulos (con tests); `npm run audit:lbd`
  imprime la tabla; `validate:content` muestra una línea informativa (no falla ni avisa). El tope de prácticas
  (antes un 24 repetido en tres sitios) pasó a las constantes `MIN/MAX_INTERACTIVE_PRACTICES` de
  `interactive-practices.ts`. **Desviación respecto al plan original de esta propuesta:** el tope se centralizó pero
  **no se subió**, porque la Fase 1 no añade prácticas. Regla: sube solo al aprobar una fase, por el número que esa
  fase planea añadir.
- **Línea base (76 módulos):** 3 piloto, 9 parcial, 64 sin patrón. **Con reto de transferencia: 3/76 (3,9%).**

  | Nivel | Módulos | Piloto | Parcial | Sin patrón |
  |---|---|---|---|---|
  | Básico | 8 | 0 | 4 | 4 |
  | Intermedio | 9 | 3 | 2 | 4 |
  | Avanzado | 13 | 0 | 2 | 11 |
  | Arquitecto | 11 | 0 | 0 | 11 |
  | IA | 15 | 0 | 1 | 14 |
  | D365 | 10 | 0 | 0 | 10 |
  | RPA | 10 | 0 | 0 | 10 |

- **Limitaciones de la medición:** solo detecta tres marcas objetivas (encabezado "Microlección", encabezado "Reto
  de transferencia" y prácticas interactivas vinculadas). **No mide** el troubleshooting síntoma-primero ni la
  evidencia de tenant, que no tienen encabezado fijo. "Sin patrón" no significa "mal diseñado": el Módulo 18, por
  ejemplo, tiene un árbol de decisión y un ADR, y aun así sale como sin patrón. La auditoría integral lo cita como
  ejemplo de actividad "sin pasos"; la medición no lo ve porque usa otras marcas.
- **Objetivo original de la fase (referencia):** clasificar los 76 módulos y destrabar el tope de prácticas.
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
- **Cierre:** los 8 módulos con el patrón, más la prueba como principiante hecha por Claude con un agente sin
  contexto (decisión 4, sección 5). Esa prueba es una simulación y no sustituye a una persona real.
- **Estado: CERRADA el 2026-11-01 por decisión del usuario**, con una segunda prueba simulada en lugar de una persona
  real (ver sección 8). Sigue siendo recomendable una prueba con una persona real cuando sea posible.
- **Esfuerzo relativo:** medio.

### Fase 3 — Intermedio restante (6 módulos: 9, 12, 14, 15, 16, 17)

- **Qué:** completar el nivel cuyos otros tres módulos ya son piloto, para que quede homogéneo.
- **Cierre:** Intermedio completo con el patrón. Primer nivel de certificación terminado de punta a punta.
- **Estado: HECHA el 2026-11-01** (aprobada por el usuario). Los 6 módulos salen como piloto en `npm run audit:lbd`; +18
  prácticas (3 por módulo: guiada, diagnóstico y transferencia) y dominio nuevo `copilot-studio`. Caso Real sin cambios.
  No se hizo prueba simulada como principiante: la definición de esta fase no la exige.
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

### Fase 6 — Especializaciones transversales y cierre (alcance decidido: solo 5 módulos de IA)

> Alcance recortado el 2026-10-08 (decisión 2, sección 5): solo los Módulos 43, 44, 46, 54 y 55. El texto de abajo
> describe el planteamiento amplio original (35 módulos); D365 y RPA no se tocan sin nueva aprobación.

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

## 5. Decisiones de alcance (tomadas el 2026-10-08, revisables)

El usuario delegó estas cuatro decisiones ("decide tú las 4"). Son una elección de Claude, no una aprobación
específica de cada punto; cualquiera puede revertirse.

1. **Migración parcial, no masiva.** Comprometidas: Fases 1 a 5 (ruta de certificación). La Fase 6 se reduce al
   punto 2. *Por qué:* es lo que la auditoría prioriza y permite cortar sin dejar el curso incoherente.
2. **Transversales: solo los 5 módulos de IA que señala la auditoría (43, 44, 46, 54 y 55).** D365 y RPA quedan
   fuera hasta nueva aprobación. *Por qué:* son 35 módulos y la evidencia de mercado de varios perfiles es desigual
   (auditoría §37); no justifica el costo sin una señal más clara.
3. **Orden sin cambios:** Básico antes que Intermedio, porque la queja que motivó esto fue de un principiante.
4. **La prueba como principiante la hace Claude** al cerrar la Fase 2 (el usuario lo pidió así el 2026-10-08). Se
   hará con un agente independiente que recibe solo el texto de cada módulo, sin contexto del proyecto, y lo recorre
   como alguien sin experiencia. **Límite honesto:** es una simulación; detecta jerga sin explicar, pasos que
   faltan y saltos de nivel, pero no sustituye a una persona real y puede pasar por alto lo que un modelo ya sabe.
   Sigue siendo la condición de cierre de la Fase 2.

## 6. Lo que esta propuesta no resuelve

- No valida contra el tenant real del alumno, y eso no es un defecto del diseño.
- No sustituye los ítems P1 de la auditoría que no son pedagógicos (versionado de `progress.ts`, nivel "Verified",
  motor de Job-Ready scoring). Siguen siendo asuntos aparte.
- **Resuelto el 2026-11-01 con el LAB-06 opcional (aprobado por el usuario).** Learn confirma la hipótesis: Power BI
  Desktop solo corre en Windows (desktop-get-the-desktop); el lab ofrece una variante en el servicio de Power BI y lleva
  `optional: true`, así que no cuenta para el certificado. Texto original del pendiente:
- **Pendiente detectado en la Fase 2 (Módulo 6): Power BI no tiene lab básico dedicado.** El Nivel Básico queda con
  una práctica larga sin lab guiado paso a paso; el sprint 15 de `SPRINT_HANDOFF.md` lo documenta como "ruta honesta
  cuando no hay lab básico dedicado", pero no registra el motivo (hipótesis no confirmada: Power BI Desktop solo
  corre en Windows y el resto del curso va en navegador). Las microprácticas del M6 enlazan a LAB-002 por falta de
  un lab de Power BI. Un lab nuevo cambiaría el conteo de 75 labs, así que **no se crea sin aprobación explícita**.
- Error de contenido corregido en el M6 (2026-10-08): con dirección Single el filtro viaja del lado "uno" al lado
  "muchos"; el módulo decía lo contrario. Verificado en Microsoft Learn.
- La estimación de esfuerzo es relativa, no en horas. No tengo datos de cuánto tardaron los pilotos en tiempo real.

## 7. Resultado de la prueba como principiante (2026-10-08)

**Cómo se hizo.** Cuatro agentes independientes, sin contexto del proyecto, cada uno con dos módulos del Nivel Básico y
la misma persona: una administrativa que sabe Word y Excel, nunca ha programado y abandona si se pierde. Leyeron el
módulo completo y señalaron dónde se atascan. **Límite:** es una simulación hecha por modelos; los hallazgos se
verificaron contra el texto antes de actuar, y no sustituye a una persona real.

**Corregido (verificado contra el texto o contra Microsoft Learn):**
- Mis retos de transferencia pedían cosas que el módulo no enseña (M3, M4, M5, M6, M8). Se añadieron pistas concretas:
  la columna `Asignado a` y `CountRows` (M3), el operador "Does not contain data" (M4), la sintaxis OData de nulos y
  fechas (M5), la medida `SUM` y dónde se hace cada paso (M6).
- M2 y M8 pedían una Business Rule que impidiera préstamos o reservas dobles; una Business Rule solo ve el registro que
  se guarda, así que ahora piden explicar el diseño (qué columna y quién la cambia), sin exigir implementarlo.
- M2: la columna `SLA Horas` se usaba sin crearse (arrastraba al M6); el Publisher se exigía en "Errores Comunes" pero
  la práctica no lo pedía; la vista "Mis Solicitudes Abiertas" filtraba por un Contact como si fuera un usuario.
- M1: el setup ahora dice qué es lo mínimo (el trial de Dynamics 365 es opcional) y da la URL del Admin Center.
- M4: se explica lo mínimo sobre roles de seguridad y publicación, que la evidencia exigía sin enseñarlo.
- M7: se indica qué controles preparar antes de empezar.
- Los tiempos de cabecera ahora suman los bloques declarados y avisan de que la primera vez hay que contar el doble o el
  triple. **Esos factores son una estimación mía, no un dato medido con personas.**

**No corregido (pendiente; son anteriores a la migración y piden trabajo de contenido, no parches):**
1. **Pasos de interfaz demasiado escuetos.** Es el hallazgo más repetido: una línea para tareas de diez clics. Casos
   citados: el setup del M1; Lookup, Required y condiciones de Business Rules en el M2; `New Screen > Form` en el M3;
   Business Rules, Quick Create, filtros de vista y gráficos en el M4; los Pasos 3 a 5 de la Práctica 5.2 en el M5
   (HTML, variables, loop y un marcador `{expression: days since fecha solicitud}` que no es una expresión real);
   Power Query (M) y DAX sin explicar en el M6; el M8 da las Fases 1 a 7 de la versión completa y no distingue qué
   saltar para la entrega mínima.
2. **Vocabulario sin definir** en las listas de "Conceptos Clave", escritas en inglés y sin una definición.
3. **Incoherencias menores:** `Solicitud TI` / `'Solicitudes TI'` / `cr123_` / `sit_`; `Text(...ID, "000000")` en el M7
   (el ID de Dataverse es un GUID); en el M6 "Promedio Días Resolución" promedia `Días Abierta`; en el M8 la relación
   "1:1" con Métrica, el resumen "240-360 horas" frente a "8-16 horas", y columnas como `Cumplió SLA` que la entrega
   mínima no incluye.

**Conclusión.** El patrón "aprender haciendo" añadió práctica, evidencia y retos, pero **no resuelve el obstáculo más
grande de un principiante**, que son los pasos de interfaz poco guiados. Recomendación: abrir una fase aparte de
"pasos clic a clic", empezando por el setup del M1, la Práctica 5.2, el M4 y el M8, y **no dar la Fase 2 por cerrada**
hasta una prueba con una persona real.

## 8. Segunda prueba como principiante y cierre de la Fase 2 (2026-11-01)

**Contexto.** Entre el 2026-10-08 y el 2026-11-01 se hizo la fase "clic a clic" (M1-M8) y se corrigió todo el Nivel
Básico contra Microsoft Learn (ver `SPRINT_HANDOFF.md`). El usuario pidió **simular** la prueba con persona real y cerrar
la Fase 2 con ella. **Es una decisión del usuario: la prueba sigue siendo una simulación hecha por modelos, no una
persona real.**

**Cómo se hizo.** La misma persona que en la sección 7 (Lucía: administrativa, Word y Excel, nunca programó, inglés
básico, abandona si se pierde más de 10 minutos), pero con un protocolo más estricto: recorrer cada paso numerado como si
lo hiciera, marcar cada sitio donde tendría que adivinar, comparar tiempos y dar un veredicto por módulo, más una
revisión técnica separada. Cuatro agentes sin contexto: M1+M2+LAB-02, M3+M7+LAB-03, M4+M5 y M6+M8. **Límite de
aislamiento:** el entorno les cargó `CLAUDE.md` automáticamente; los cuatro lo declararon y dijeron no usarlo.

**Veredicto antes de corregir.** M1 y M2: con dificultad (bloqueados sin permisos de administración después del
2026-11-15). LAB-02: con dificultad, con riesgo de nombres internos mal escritos. M3: con dificultad; M7 y LAB-03: no.
M4: con dificultad; M5: no (Teams inexistente, expresiones antes de enseñarlas). M6: con dificultad; M8 mínima: no por
la ruta Canvas, con dificultad por la Model-Driven.

**Cómo se trataron los hallazgos.** Antes de corregir, las afirmaciones técnicas se verificaron en Learn, y varias
resultaron ser falsas alarmas: el nombre visible de la columna principal sí queda fijo al guardar; `OnFailure` sí se
ejecuta con un campo obligatorio vacío; OData sí ordena las Choice por número. Cuatro agentes corrigieron los hallazgos
confirmados, cada uno en archivos distintos y citando Learn en cada dato nuevo.

**Corregido (principal):**
- M1: ruta para quien no es administrador (Opción C con mensaje para TI), cómo saber si eres administradora, exportar
  soluciones antes de la suspensión del 2026-12-15, idioma del ambiente **English (United States)** (en español la
  columna del sistema `statecode` se llama "Estado" y choca con la del curso), Mini Lab después de crear el ambiente,
  nombres de columna reales de Account, menú lateral documentado y Suplementos 1A/1B al día.
- M2/LAB-02: rutas exactas, operadores con su etiqueta en inglés, cómo escribir el Schema name sin duplicar `sit_`,
  Lookup column name, aviso del nombre interno de la columna principal, vistas comprobables sin app.
- M3/M7/LAB-03: controles preparados pantalla por pantalla, `dtpDesde` con `DefaultDate = Blank()`, fórmulas con destino,
  `JSON()`, `TimeUnit`, `Sort` en lugar de `SortByColumns` con nombres visibles, `NewForm` antes de crear,
  `Back()` en lugar de `ScreenTransition.Back`, `Parent.TemplateSize`, `DisplayMode` (no existe `Enabled`), reto con
  `Set()` en lugar de `UpdateContext()`.
- M4/M5: navegación por áreas y grupos, secciones del formulario, gráficos con un solo diseñador, BPF sin avance
  automático, roles con privilegios mínimos; en M5, guía del diseñador antes de las expresiones, Teams por chat con Flow
  bot, flujos dentro de la solución, `result()` como lista.
- M6/M8: instalación sin permisos de administrador, idioma de Power BI Desktop, guardar el reporte, UTC; en M8, ruta
  Model-Driven recomendada, ruta Canvas que compila y no sale vacía, RLS con `USERPRINCIPALNAME()`, seguridad de
  columnas en lugar de roles por columna, filtros OData válidos, tiempos realistas.
- Tiempos: `practiceMinutes` en el frontmatter de M1-M8 (la app mostraba solo minutos de lectura).

**No corregido o pendiente** (los cuatro puntos se cerraron el 2026-11-01; ver `SPRINT_HANDOFF.md`, Pendiente 3):
- Los Labs 04 y 05 siguen con etiquetas de interfaz en español y algunos pasos escuetos (no entraban en la prueba).
- Nombre interno de la columna principal: Learn no documenta cómo fijarlo; LAB-02 pide anotarlo y los Labs 04/05 usan
  `sit_titulo`/`sit_nombre`, así que quien tenga otro nombre debe sustituirlo.
- Etiquetas sin confirmar en Learn, redactadas con "o el más parecido": operadores dentro del diseñador de reglas,
  algunos botones del diseñador de flujos y de Power BI Desktop, nombres de iconos.
- Caso Real del M6 ("mapa de calor geográfico") y del Suplemento 1B (términos antiguos): no se tocan porque las
  preguntas de caso dependen de su texto.

**Conclusión.** Con estas correcciones los recorridos simulados ya no tienen bloqueos conocidos sin salida en los núcleos
de M1-M8. La Fase 2 se da por **cerrada por decisión del usuario**. Si en algún momento hay una persona real disponible,
conviene repetir la prueba con ella antes de abrir la Fase 3.

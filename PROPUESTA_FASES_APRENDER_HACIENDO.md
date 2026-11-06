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
  Prueba simulada como principiante hecha el mismo día a pedido del usuario (aunque la definición no la exigía) y sus
  hallazgos corregidos: ver sección 9.
- **Esfuerzo relativo:** medio.

### Fase 4 — Avanzado (13 módulos, enfoque código)

- **Qué:** aplicar el patrón del Módulo 13 (código de cliente, PCF, C#, plugins). Cuidar los puentes de
  prerrequisitos de C#/.NET y TypeScript/React que ya existen como recursos.
- **Riesgo:** los retos de código deben compilar y correr (estándar de calidad del repo), lo que sube el costo de
  verificación por módulo.
- **Cierre:** 13 módulos con el patrón y todos los fragmentos de código verificados.
- **Estado: HECHA el 2026-11-01** (aprobada por el usuario). Módulos 18-30 como piloto; el código añadido o cambiado se
  verificó contra Learn (no hay SDK de .NET en la máquina: el C# no se compiló). Dominios nuevos `alm`, `plugins`,
  `power-pages` e `integracion`. Labs 19, 22 y 23 alineados con sus módulos. Ver sección 9.
- **Esfuerzo relativo:** alto.

### Fase 5 — Arquitecto (11 módulos, enfoque decisión)

- **Qué:** el "reto sin pasos" aquí no es construir, sino **decidir y defender**: elegir una arquitectura ante un
  caso con restricciones y justificar el trade-off. Se apoya en los diagramas Mermaid y en las soluciones de
  referencia de los capstones.
- **Riesgo:** una decisión de arquitectura no tiene una sola respuesta correcta, así que la validación depende de
  criterios y no de una solución única. La app no valida contra un tenant y eso no es un defecto.
- **Cierre:** 11 módulos con retos de decisión y criterios de evaluación explícitos.
- **Estado: HECHA el 2026-11-01** (aprobada por el usuario). Módulos 31-41 con microlecciones de "decidir y defender"
  (rúbrica "Criterio | Qué demuestra que lo cumples" y evidencia "Campo | Tu valor"), diagnóstico y reto de
  transferencia; dominio nuevo `arquitectura`. LAB-32 rehecho contra Learn. Ver sección 9.
- **Esfuerzo relativo:** medio-alto.

### Fase 6 — Especializaciones transversales y cierre (alcance decidido: solo 5 módulos de IA)

> Alcance recortado el 2026-10-08 (decisión 2, sección 5): solo los Módulos 43, 44, 46, 54 y 55. El texto de abajo
> describe el planteamiento amplio original (35 módulos); D365 y RPA no se tocan sin nueva aprobación.
>
> **Estado del recorte: HECHO el 2026-11-01** (aprobado por el usuario). Módulos 43, 44, 46, 54 y 55 con una
> actividad de fallo y corrección cada uno, "decidir y defender" y reto de transferencia; dominio nuevo `ia`. Ningún
> prerrequisito duro hacia los 4 niveles. El resto de IA, D365 y RPA queda **fuera de alcance** mientras no se apruebe.

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

## 9. Prueba simulada de la Fase 3 y migración de las Fases 4, 5 y 6 (2026-11-01)

**Contexto.** El usuario pidió terminar lo pendiente: la prueba simulada como principiante de la Fase 3 (su definición
no la exigía), reintentar en Learn las etiquetas sin confirmar y migrar las Fases 4, 5 y el recorte de la Fase 6, que
se dan por aprobadas con esa petición. **La prueba sigue siendo una simulación hecha por modelos, no una persona real.**

**Prueba simulada de la Fase 3.** Persona "Andrés": analista de operaciones que terminó el Nivel Básico, no programa,
lee inglés técnico con ayuda, tiene un ambiente Developer en English (United States) y abandona si se pierde más de 15
minutos. Tres agentes sin contexto (M9+LAB-09, M12+M14, M15+M16+M17) con el protocolo de la sección 8. Veredicto antes
de corregir: M9, LAB-09, M12, M14, M15 y M16 **con dificultad**; M17 **no** en la ruta completa. Los hallazgos se
verificaron en Learn antes de corregir (hubo falsas alarmas, por ejemplo la "Regla 2" del M9) y cuatro agentes los
corrigieron. Principales: el conector HTTP debe estar en **Business** en la data policy `Política TEST SIT` porque los
flujos hijos dependen de él; la columna Currency del M17 pasa a columna calculada; **Creating a new activity** en lugar
de una etiqueta inexistente; **Save snapshot** desde el menú … de **Test your agent**; error **FlowActionTimedOut**
de los agent flows; regla del Developer Plan desde el 2026-11-15 repetida donde hace falta; tiempos realistas. También
se corrigieron prácticas de la Fase 3 (IP-QRY-001/002, IP-TRB-002/007/011, IP-DV-018, IP-APP-003) para que ninguna se
abra ya resuelta y para que la de diagnóstico no acepte respuestas genéricas (tests nuevos en
`interactive-practices.test.ts`).

**Fases 4, 5 y 6.** Un agente por par de módulos, con el Caso Real textualmente idéntico (comparado contra `HEAD`), y
cada dato nuevo verificado en Microsoft Learn (en inglés, con URL y `ms.date`). El banco de preguntas siguió en 891
(solo se reescribieron preguntas que chocaban con Learn o con el contenido nuevo). Errores de contenido corregidos, entre
otros: en Avanzado, CD que nunca se disparaba (rama por defecto `develop`), `pac solution add-reference`, librerías de
plataforma de PCF, Workload Identity Federation, `ParentContext.SharedVariables`, Microsoft Entra External ID en lugar de
Azure AD B2C, caché de servidor de Power Pages; en Arquitecto, que la región sí se puede migrar (geo a geo, limitada),
que los conectores sí cruzan tenants salvo con tenant isolation, que Managed Environments va incluido en las licencias
standalone, la ruta real de la CMK, KQL sobre `DataverseActivity`, prediction de AI Builder solo desde Power Automate
(acción **Predict**), fin de los AI Builder credits (2026-11-01) y Copilot Credits, process mining a partir de event
logs, AB-100 tras el retiro de PL-600, Link to Microsoft Fabric y Fabric Activator; en IA, el Edit mode de VS Code
obsoleto (agentes Ask/Agent/Plan), que las instrucciones personalizadas no afectan a las sugerencias inline, que las
funciones GA de Copilot no se apagan por entorno, que `--managed` de `pac solution export` es un switch, y una acción
`deploy-solution` que no existe en `microsoft/powerplatform-actions`.

**Labs tocados.** LAB-19 (CD), LAB-22 (harness estándar, autenticación manual, SSO de Teams, agent flows), LAB-23
(reescrito y alineado; el M25 usa su plugin de auditoría como ejemplo de Repository), LAB-32 (CoE Starter Kit contra
Learn), LAB-63 (referencias a módulos), LAB-51 y LAB-53 (Copilot Edits, `--managed`), LAB-65 (prerrequisito hacia el
M43 en vez del M44) y LAB-75 (quitado el prerrequisito roto hacia el M37, que es de AI Builder).

**Etiquetas y datos que siguen sin poder confirmarse en Learn** (redactados en neutral: zona de la pantalla + función,
"anótalo tal como aparece" o marcados como ejemplo/plantilla):
- *Fase 2 (labs 04-06):* nombre del Row ID en el contenido dinámico; **Show all** en **Update a row** (solo confirmado en
  el trigger); que el trigger traiga el FormattedValue de un Lookup; botones de Power Query Online; qué puede hacer un
  usuario Free en **My workspace**.
- *M9 / LAB-09:* cómo se combinan varios perfiles de seguridad de columna; cascada por defecto de una 1:N nueva; título
  del aviso de duplicados; etiqueta de la propiedad **Lock** en la Business Rule; resultado de `DateAdd` con SLA vacío;
  cómo se abre el editor de rollup en la interfaz moderna, operador **Does not equal** y AND/OR en su filtro; nombre del
  componente "Data Step" (Learn: *Step*); nivel de acceso del rol para el BPF.
- *M12 / M14:* botón que confirma **Mark as date table**; botón para salir de **View as**; recuento de filas en **Table
  view**; rango de fechas del Financial sample; diálogo de **Enter data**; que **Import from sample** reconozca un
  parámetro de ruta; que la conexión siga válida tras cambiar dos veces la autenticación.
- *M15 / M16 / M17:* estado **Ready** de un archivo de knowledge; `first()` sobre un array vacío (se usa `coalesce`);
  cómo guarda la entidad Number "SOL-001000"; grafía de la opción de pasos de plug-in al importar; nombre de la entrada
  *Regarding* en **Add a new row**; etiqueta exacta de **Add existing** para una biblioteca de componentes.
- *Fases 4-6:* pantalla que sigue a **Other ways to build** en Copilot Studio; salida **Number** en **Respond to the
  agent**; JSON → **Formula** en un **Send a message**; si `User.Email` coincide con `internalemailaddress`; ruta exacta
  para elegir recursos en Conditional Access; nombres lógicos de tablas y columnas del CoE Starter Kit y páginas del
  `.pbit`; valores de `Message` en `DataverseActivity` (la consulta KQL es plantilla); etiquetas de **Run after** y del
  operador de condición en el diseñador nuevo de flujos; interfaz de prueba de modelos prebuilt en AI hub; dónde aparece
  **Process mining** si no está en el panel; cifras del CSV de process mining (calculadas a mano, no importadas en un
  tenant); etiqueta **Enable dead lettering on message expiration**; ruta ABFS en las propiedades del lakehouse;
  valores de Choice desde 100000000 en el PySpark; botón de alerta de un visual para Fabric Activator. La sintaxis de
  GitHub Actions del M54 (`type: choice`, contexto `vars`, `environment` con expresión) es estándar de GitHub, pero no
  se contrastó con docs.github.com en esta sesión.

**Qué no se hizo.** No hubo prueba simulada de las Fases 4-6 (sus definiciones no la exigen). El C# no se compiló (sin
SDK de .NET); se verificó contra la referencia de API de Learn. El título del Módulo 29 pasó a "Power Pages Avanzado y
Microsoft Entra External ID"; su slug (`power-pages-avanzado-y-azure-ad-b2c`) se conserva para no romper enlaces.
Los Módulos 42, 45, 47-53 y 56 (IA), 57-66 (D365) y 67-76 (RPA) quedaron entonces sin migrar; el usuario aprobó migrarlos
el 2026-11-01 (Fase 7, ver §10).

## 10. Fase 7 — resto del curso (IA, D365 y RPA) y cierre del rediseño (2026-11-05)

**Resultado.** `npm run audit:lbd`: **76/76 módulos** con microlecciones y reto de transferencia (100 %). El banco de
prácticas interactivas llega a **239** (`MAX_INTERACTIVE_PRACTICES` se fijó a ese total exacto; antes era un tope
temporal de 300). Dominios nuevos: `ia`, `dynamics-365` y `rpa`. RPA: 30 prácticas (IP-RPA-001 a 030), tres por cada
Módulo 67-76.

**Cierre de RPA (Módulos 75 y 76, 2026-11-05).** +6 prácticas: IP-RPA-025/026/027 (contrato cloud↔desktop, estado
atascado en `EnEjecucion`, lote nocturno de 2.000) e IP-RPA-028/029/030 (qué viaja en la solución, el bot que falla el
primer día de UAT, bot suspendido por DLP). Caso Real de ambos módulos sin cambios. Verificado en Learn (en inglés, con
ms.date entre 2026-05 y 2026-10): acción **Run a flow built with Power Automate for desktop**; variables de entrada y
salida de PAD (**External name**, **Default value**, **Mark as sensitive**); límites (2 MB de entrada, 70 ejecuciones por
minuto por conexión, 12 h en cola, 500 en la cola de un grupo, un desktop flow a la vez por unattended bot); ALM de
desktop flows con soluciones (**Add required objects**, managed, esquema v2, connection reference al importar); DLP para
desktop flows; roles de máquina. Licencias: crear y probar el desktop flow no requiere licencia, pero dispararlo desde un
cloud flow sí, por eso las Microlecciones del lado cloud (M75) y de despliegue (M76) tienen **variante en papel** que el
alumno debe declarar como simulación.

**Errores de contenido corregidos (labs 110 y 111).** LAB-110 mencionaba una acción «Devolver valores» de PAD que no
existe (las salidas son variables **Output** con **External name**), la acción en español «Ejecutar un flujo de
escritorio» (se llama **Run a flow built with Power Automate for desktop**) y una «versión publicada» del desktop flow que
Learn no documenta. LAB-111 atribuía el fallo de una sesión desatendida a permisos de RDP y a «no bloquear pantalla»;
Learn dice que se requiere una máquina con todos los usuarios con la sesión cerrada y que una sesión bloqueada impide la
ejecución.

**No verificado en Learn (redactado en neutro o declarado como inferencia).**
- Que un desktop flow lea **variables de entorno** por su cuenta: Learn no lo presenta como patrón (solo menciona, para
  credenciales, la acción **Perform an unbound action in selected environment** del conector de Dataverse). El curso enseña
  el valor por ambiente como *input desde el cloud flow* (las variables de entorno sí están en el contenido dinámico de un
  cloud flow de solución y los inputs del desktop flow aparecen como campos de la acción): es una combinación de dos hechos
  documentados, y así se rotula. Sobre las variables de tipo **Secret**, las propias páginas de Learn se contradicen (la de
  Key Vault dice que no están en el contenido dinámico; la de cloud flows dice que todos los tipos se pueden usar) y exigen
  una suscripción de Azure: el curso no pasa contraseñas como input y recomienda **Get credential**.
- Etiquetas: la ruta exacta para crear una variable de entorno en una solución (se indica como «usa **New** y busca
  **Environment variable**»), la casilla **has failed** de **Run after** (la fuente fue un resultado de búsqueda sobre Learn,
  no una lectura directa de la página) y el comportamiento de «Bloqueo simulado» del sandbox al consultar por ID.
- Discrepancia de Learn: el máximo de máquinas por grupo figura como 50 en *Manage machines* y 300 en *Manage machine
  groups*; el curso no cita ninguna de las dos cifras.
- Páginas de Learn que devolvieron 404 al intentarlas: `run-pad-flows`, `desktop-flow-queues`, `create-machine-groups`,
  `govern-desktop-flows`, `desktop-flow-security`, `alm-overview`, `alm-with-solutions` y `error-handling`; se usaron las
  equivalentes vigentes (`manage-machine-groups`, `monitor-desktop-flow-queues`, `alm/alm-solution`, `alm-schema`,
  `data-loss-prevention`, `guidance/coding-guidelines/error-handling`).

**Prueba simulada de RPA 75 y 76 (2026-11-05).** Dos evaluadores independientes sin contexto (persona «Camila»: analista sin
licencias de pago; simulación hecha por un modelo, no una persona real) recorrieron cada módulo, su lab y sus prácticas.
Veredicto: **con dificultad** en ambos, sin bloqueos sin salida (todas las partes con licencia tienen variante en papel).
Hallazgos corregidos: (M75) un fallo funcional real —tras **Registrar** en modo Normal el sandbox no pinta ningún mensaje,
así que leer su texto fallaba y la solicitud nueva nunca daba `Completado`; ahora se usa **If web page contains**—, pasos
que no decían cómo traer los UI elements y el subflow `Log` del Módulo 74, valores de `requestId` por corrida, rama de
`ErrorTecnico` en el cloud flow, un síntoma de IP-RPA-026 que contradecía a Learn (una máquina elegible sin conexión
hace *esperar* la ejecución, no fallar), nombres de acciones de Dataverse (**List rows**, **Update a row**), criterios de
IP-RPA-026 que daban por buena una respuesta que solo notificaba, y un reto de lote sin criterio de terminado (ahora con
cálculo de ventana: 2.000 × 45 s ÷ 2 bots ≈ 12,5 h frente a 8 h; IP-RPA-027 exige cuatro decisiones); (M76) el paso que
daba un **Default value** de DEV a una variable de entorno, que habría llevado la ruta de DEV a TEST (el Caso Real); el
cloud flow que debe recrearse dentro de la solución; plantillas que son esqueletos y se abren como texto; y matices de
Secret, logs V2 y roles. Tiempos: la simulación estimó 260-320 min de práctica en M75 y 7,5-9 h en M76, así que
`practiceMinutes` subió a 300 y 450. LAB-110 recibió el aviso de licencia y estados alineados con el módulo.

**Ideas tomadas de un repositorio externo (azure-lab, 2026-11-05; sin licencia, no se copió código ni contenido).** (1) Prueba de
contrato sobre las 239 prácticas: encontró 48 con algún defecto de evaluación (repetir el síntoma puntuaba `correct` en 6
diagnósticos; la pista 3 no puntuaba `correct` en 7 más y en otros 3 dependía de palabras del síntoma). Se corrigió el motor y los
términos aceptados, y la prueba quedó permanente. No se exige que pegar el escenario completo no puntúe (32 diagnósticos):
penalizaría respuestas correctas. (2) Registro de actividad en el sandbox legacy: evidencia objetiva de idempotencia en los
Módulos 74 y 75 (intentos de **Registrar** por solicitud, filas repetidas, consulta previa). No valida nada contra un tenant
real. Descartado: el simulador de Azure DevOps (el Lab 19 ya resuelve el paralelismo gratuito), la guía de ficheros (ya cubierta
en el recurso de plantillas de repositorio) y la gamificación.

**Qué no se hizo.** No hubo prueba simulada de los demás módulos de la Fase 7 (el protocolo estaba en `handoff-fase7/BRIEF_SIM_F7.md`,
carpeta retirada de `master` el 2026-11-06; se recupera con `git show bd01f96:handoff-fase7/BRIEF_SIM_F7.md`, y nunca
hubo informes). Los Módulos 75 y 76 no se ejecutaron en PAD ni en un tenant: los pasos se
contrastaron contra el código real del sandbox (`rpa-sandbox/legacy-app`) y contra Learn. Las prácticas interactivas nuevas
se comprobaron con los evaluadores del motor (respuesta correcta = `correct`; pista 3 de cada diagnóstico = 100).

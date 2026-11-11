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

## 11. Pruebas simuladas del resto de la Fase 7 y revisión contra Learn (2026-11-11)

Trabajo repartido entre seis sub-agentes (Opus) con archivos disjuntos. Las pruebas son **simulaciones hechas por modelos,
no personas reales**. Cada corrección de contenido se apoyó en una página oficial abierta ese día; lo que no se pudo
confirmar quedó en redacción neutra o sin tocar. El Caso Real de todos los módulos sigue idéntico (comparado por hash en IA
y D365). Conteos sin cambios: 76 módulos, 76 labs, 891 preguntas, 239 prácticas interactivas.

**Límite de esta revisión:** learn.microsoft.com devolvió HTTP 429 (límite de peticiones) durante buena parte de la sesión.
Los Módulos 42, 45, 47, 48, 49 y 50 se verificaron contra el código fuente oficial de Learn en GitHub (MicrosoftDocs), no
contra la página publicada; 289 enlaces de los niveles 1 a 4 (casi todos de Copilot Studio) y varias etiquetas de D365
quedaron sin comprobar por ese motivo.

### 11.1 Hallazgo que afecta a todo el curso: el Developer Plan cambia el 2026-11-15 (resuelto el mismo día, ver §11.7)

Confirmado en <https://learn.microsoft.com/power-platform/developer/plan> (ms.date 2026-10-26):

- Desde el **2026-11-15**, registrarse en el Power Apps Developer Plan ya no crea un ambiente Developer y no se pueden crear
  ambientes Developer no gestionados. Cada usuario puede crear un solo ambiente Developer **gestionado**, y ejecutar activos
  en él exige licencia premium (los derechos de Managed Environments no vienen en el Developer Plan).
- Los ambientes Developer no gestionados existentes se **suspenden desde el 2026-12-15 y se borran desde el 2027-01-15**,
  con o sin actividad.
- Salidas que da Learn: convertir el ambiente en gestionado (requiere licencia y administrador), usar un ambiente Trial
  estándar para probar funciones premium, o exportar las soluciones a otro ambiente (por ejemplo un sandbox).

El curso entero parte de "crea tu ambiente Developer gratuito" (preparar entorno, `workstation.ts`, Módulo 1 y siguientes,
Módulo 57; unas 90 páginas de contenido y recursos lo mencionan). Al escribir este apartado no estaba corregido (se resolvió después, §11.7): hacía falta decidir qué ambiente
recomienda el curso a un alumno sin licencia de organización, y eso es una decisión de alcance del usuario. La página del
anuncio (`important-changes-coming`) devolvió 429 y no se leyó.

### 11.2 Nivel RPA, Módulos 67 a 74 y LAB-104 a LAB-112

Contrastado con Learn y con el código de los dos sandboxes. Sin obstáculos en 67, 69, 71 y 72.

- **M70**: dos errores de lógica. Cada **Set variable** sobrescribía `cfg_Motivo` (el log habría dicho "falta columna
  currency" y no lo prometido) y la variable no se limpiaba en cada vuelta del bucle. Ahora las condiciones acumulan texto y
  el bucle empieza vaciándola.
- **M73 y M74**: usaban **Tab URL** parcial. Con **By URL**, PAD busca primero la coincidencia exacta durante la mitad del
  Timeout, así que el flujo funcionaba con unos 30 s de espera por ejecución. Ahora usan la URL completa (y también
  IP-RPA-020).
- **M68**: se quitó "hasta 50 máquinas por grupo"; Learn da 300 en *Manage machine groups* y 50 en *Manage machines*.
- **LAB-105**: el CSV se lee con **Read from CSV file**, no con **Launch Excel**; el "archivo bloqueado" se reproduce
  abriendo el libro a mano.
- **LAB-107**: el ejercicio 5 era imposible (el simulador legacy no tiene modo de modal inesperado); ahora el alumno lo
  provoca dejando abierto **Registro confirmado**. `legacy-records.json` se presenta como lote mixto, porque no coincide con
  la tabla inicial del simulador.
- **LAB-109**: atado a SIT Registro Legacy y al panel **Registro de actividad**; el conteo de reintentos sale del log propio;
  **Terminate process** por **Process ID**.
- **LAB-112**: nota de licencia premium para la conexión cloud flow → desktop flow, con variante en papel.

Sin confirmar: que **Move file(s)** falle con el libro abierto en Excel (LAB-105) y si las acciones web escriben con el
diálogo de confirmación encima (LAB-107); hace falta PAD real. LAB-110 y LAB-111 no se volvieron a verificar. Propuestas
de código no aplicadas: modo "Modal inesperado" en el simulador legacy y renombrar `legacy-records.json` (hechas después, §11.7).

### 11.3 Nivel D365, Módulos 57 a 66 y sus labs (persona simulada "Valeria")

- **Trials**: las apps de Dynamics 365 no se instalan en un ambiente Developer. Cada trial (Sales, Customer Service,
  Contact Center, Field Service, Customer Insights) crea su propio tenant, dura 30 días con una extensión y caduca tras 14
  días sin uso; con correo personal no hay acceso al admin center. Finance, SCM y Commerce no tienen trial de autoservicio.
  Avisado en los 10 módulos y sus labs, con variante en papel.
- **M61**: la cuota se sube **después** de activar el forecast (el módulo decía antes); Sales Enterprise sí incluye Sales
  accelerator y predictive scoring con cupo mensual; límites y rol **Forecast Manager** añadidos.
- **M58 y M64**: rutas de perfilado y del conector de Customer Insights; la creación de segmentos con Copilot se retiró el
  2026-11-02; Journey Creation Agent en preview.
- **M59 y M66**: RSO es un add-in de pago; la app móvil Xamarin está retirada; la integración nativa de Field Service con
  F&O deja de estar disponible tras el 2027-02-28.
- **M62 y M63**: al SLA item le faltaban **KPI** y **Success Conditions**; nombre actual **Copilot Service admin center**.
- **M60 y M65**: avisos de ambiente F&O; dual-write (página en blanco, límites, **Skip initial sync**).
- **Labs con errores objetivos corregidos**: LAB-66 (Quote → Order estaba al revés y decía que un Developer servía para
  Sales), LAB-67 (regla de unificación imposible con los datos), LAB-83 (add-ons inventados), LAB-86, LAB-87 y LAB-113
  (rutas o jobs inexistentes), LAB-90 (pedía todo en un mismo tenant), LAB-77 (confundía Business Hours con Pause/Resume) y
  LAB-88 (los mapas de dual-write se gestionan en F&O). En total se tocaron 30 labs.
- **Banco y prácticas actualizados**: pregunta de forecast del M61, pregunta de virtual tables del M60 (las virtual tables
  de F&O también admiten escritura), explicación de URS del M59, prerrequisito de IP-D365-016 y ruta de IP-D365-008;
  `SOLUCIONES_REFERENCIA_CAPSTONES.md` (LAB-77).

Sin confirmar: detalles de las trials (idioma, si incluyen RSO o capacidad de Copilot Studio, rol Forecast Manager del
usuario de trial, duración y datos de la trial de administrador de F&O); etiquetas de Field Service (**Requirement pane**,
**Schedule Assistant Filter**), de route-to-queue en Contact Center, del proveedor de SMS y varias rutas de F&O;
`mserp_inventoryonhandaientity` (LAB-70); "MB-280 retirado el 2026-07-31" (fuente Pearson VUE, no Learn) y "PL-200
(retirado 31 ago 2026)" en el frontmatter de LAB-77 y LAB-102. Los labs F&O 93, 94, 96, 97, 98 y 100 solo recibieron el
aviso de ambiente. Prerrequisitos de labs no tocados: LAB-93 (cita un trial que ya no existe), LAB-64, LAB-66, LAB-70 y
LAB-102.

### 11.4 Nivel IA, Módulos 42, 45, 47 a 53 y 56, y Labs 45, 51, 52, 54 y 56 (persona simulada "Sofía")

El código de los módulos se ejecutó con Node y los YAML se pasaron por actionlint; `pac` no está instalado.

- **M45**: la documentación de Codex se mudó (`developers.openai.com/codex` redirige a `learn.chatgpt.com`); `/memory` en
  vez de `/context` para ver el `AGENTS.md`.
- **M48 y M50**: la regla de rama no se aplica al administrador del repo, así que el alumno, dueño de su repo, podía
  saltársela; añadido **Do not allow bypassing the above settings**. Versiones de Node y de las actions actualizadas.
- **M49**: el paso "rompe a propósito" no hacía fallar ninguna prueba; corregido. Añadido el ajuste de entrenamiento de
  modelos de Copilot en planes individuales; la pestaña se llama **Security and quality**.
- **M52**: el Trial exige una licencia con derecho a trial, que el Developer Plan no da; ruta del application user.
- **M53**: el client secret no debe usarse en producción; el script comprueba `respuesta.ok` y maneja 429 con `Retry-After`.
- **M56**: concepto de `async/await` y `fetch`, que el M53 necesita.
- **LAB-45** reescrito (medía desde `createdon` y obligaba a esperar 3 días); **LAB-51** pedía scripts que no existen en el
  repo del alumno; **LAB-56** pedía tres perfiles con dos ambientes posibles y anunciaba una variante en papel que no existía.

Sin confirmar: casilla de base de datos al crear un Trial (Learn tiene dos textos), salida exacta de `pac env who`,
**Advanced parameters** en **Update a row** (LAB-45), **Include default branch** en el ruleset y las afirmaciones de AI
Builder del reto del M42. Propuestas no aplicadas: IP-IA-020 (diffstat del README, 4 o 3 líneas) e IP-QRY-002
(prerrequisito "Módulo 53").

### 11.5 Inventario de "no confirmado" de los niveles 1 a 4 (sustituye a la parte de esos niveles en §9)

**Confirmadas y ya precisas en el texto**: diálogo **Create Table** de Enter data (M12); **Enable Plugin steps and flows
included in the solution** (M16); casilla **Enable dead lettering on message expiration** (M34); alerta de Activator desde
un visual (M35); ruta de Conditional Access hasta **Select resources** y columnas de `DataverseActivity` (M36).
Confirmadas sin cambio: licencia y My workspace del LAB-06, perfil de seguridad de columna, comportamientos de relación,
**Get more components**, sintaxis de lookup en Add a new row, Agent flow, Adaptive Card con **Formula**, Run after, process
mining y campos del modelo de facturas.

**Siguen sin poder confirmarse:**

- **M1-M8 / LAB-06**: rango de fechas del Financial sample; botón que confirma Mark as date table; contenido dinámico Row
  ID; **Show all** en Update a row; FormattedValue de un Lookup en el trigger; botones de Power Query Online; título del
  aviso de detección de duplicados; recuento de filas en Table view; valores de Choice que empiezan en 100000000.
- **M9-M17**: etiqueta "Data Step" y nivel de acceso del BPF; combinación de varios perfiles de seguridad de columna; botón
  para salir de View as; valor por defecto de una 1:N nueva; DateAdd con un valor en blanco; estado "Ready" del
  conocimiento subido; salida Number en un agent flow; pantalla tras Open classic experience; entrada Regarding; **Add
  existing** en la biblioteca de componentes; `first()` sobre un arreglo vacío; propiedad Lock de las business rules; Rollup
  en la interfaz moderna.
- **M18-M30**: etiquetas de operador de Condition en el diseñador nuevo; entidad de numeración con SOL-001000;
  `User().Email` = internalemailaddress; interfaz de prueba de facturas en el AI hub.
- **M31-M41 / labs**: nombres lógicos del CoE y páginas del .pbit; cifras del CSV de process mining; qué hacer si Process
  mining no aparece; ruta ABFS desde las Properties del lakehouse.
- **Para retirar**: el parámetro de ruta de "Import from sample" (el M14 usa ya una URL fija).

### 11.6 Cambios de la aplicación hechos el mismo día

- **Vista previa al compartir**: la imagen se sirve como `/og.png` (antes Vercel la entregaba como
  `application/octet-stream`); cada página emite `og:title`, `og:description`, `og:url` y canonical propios
  (`src/lib/seo.ts`); `robots.txt` y `sitemap.xml` generados de las mismas fuentes que las rutas; certificados y sandbox RPA
  con `noindex`.
- **Tildes**: 41 cadenas visibles en 8 archivos de `src/`. No se tocaron los términos que comparan los evaluadores de
  prácticas ni los datos simulados (por ejemplo "Bogota").

### 11.7 Segunda ronda del mismo día: cierre de los pendientes de §11.1 a §11.4

Learn volvió a responder y las consultas se hicieron en serie; no hubo más 429.

**Developer Plan (§11.1) — RESUELTO en el contenido.** Camino vigente del curso:

- El alumno crea un ambiente **Trial (standard) con Dataverse** con una licencia Power Apps trial (Módulo 1, clic a clic
  según <https://learn.microsoft.com/power-platform/admin/trial-environments>). Dura 30 días con una sola extensión de 30,
  que se pide en la última semana (**Extend trial**); es uno por usuario y no se puede restablecer, respaldar ni copiar.
- Desde el Módulo 2 hay una "rutina de cierre": exportar la solución como no gestionada al terminar cada módulo y guardarla
  fuera del ambiente. Al vencer el Trial se crea otro y se importa. Filas, conexiones e historial no viajan en la solución.
- Quien ya tiene un ambiente Developer lo usa hasta el 2026-12-15 y exporta antes. Un Developer gestionado o un sandbox de
  la organización es la mejor opción.
- Referencia única: `docs/Recursos/ENTORNOS_Y_TRIALS.md` (`/recursos/entornos-y-trials`). Unas 150 menciones de paso pasaron
  de "tu ambiente Developer" a "tu ambiente del curso"; los labs que dependían de un segundo ambiente, respaldo o copia
  (M16, LAB-19, LAB-56, M52, LAB-52, M41, LAB-115) tienen salida con sandbox de la organización o variante en papel.
- Confirmado después: el tipo Trial admite Managed Environments si tiene Dataverse (M33).
- **No verificado en Learn**: si al vencer el Trial se puede crear otro de inmediato con la misma cuenta (Learn solo dice
  "one per user"); qué recibe una cuenta gratuita de Microsoft Entra; si tras los 90 días de licencia trial se obtiene otra;
  si **Security group** es obligatorio en un Trial. Learn se contradice sobre **Enable Dynamics 365 apps** en un Trial (la
  página de trials lo ofrece, `create-environment` dice que no se puede); el curso lo deja en **No**.

**Enlaces.** 685 URL únicas de Learn en módulos y labs: 684 responden 200 y la única 404 (patches, M16) se corrigió. Seis
redirecciones se actualizaron; dos llevaban a otro tema y se sustituyeron por la página correcta (M05 attended/unattended,
M29 tenant externo de Entra). Solo se comprobó que responden, no se releyó su contenido.

**IA.** M42, M47 y M49 confirmados contra la página publicada (incluido el reto de AI Builder del M42); M45, M48 y M50 no
dependen de Learn. Siguen sin confirmar: salida exacta de `pac env who`, **Include default branch** del ruleset y la
etiqueta **Advanced parameters** del diseñador nuevo en **Update a row**.

**D365.** Confirmados: **Requirement pane**, **Schedule Assistant Filter**, route-to-queue (**Create ruleset** > **Create
Rule**), **SMS providers**, pestaña **Omnichannel** con **Capacity**, **Customer payment journal**, pestaña **Legal
entities** de dual-write, y las fechas de retiro de PL-200 (2026-08-31) y MB-280 (2026-07-31) en la página de exámenes
retirados de Learn. Siguen sin confirmar: ruta de menú del Schedule Board, `mserp_inventoryonhandaientity` y el nombre del
botón para reejecutar la sincronización inicial.

**Labs F&O 93, 94, 96, 97, 98 y 100, y LAB-110/111.** Revisados completos, con variante en papel en cada uno y
`lastVerified` 2026-11. Sin confirmar: rutas de Chart of accounts, Pending vendor invoices, Warehouses, Billing rules e
Invoice proposals, Assortments y el workspace Financial analysis; duración de la trial de administrador de F&O. Nada se
probó en un tenant real.

**Prerrequisitos de labs.** Títulos corregidos en LAB-64, 66 y 70; LAB-93 reescrito; en LAB-102 se quitó el Lab 57 (nivel
IA, transversal) como prerrequisito y quedó como lectura recomendada. LAB-111 no se tocó porque un e2e fija su texto.

**Sandbox RPA.** SIT Registro Legacy tiene el modo **Modal inesperado** (`src/lib/rpa-legacy-modes.ts`): el primer
**Registrar** tras elegir el modo muestra el diálogo **Aviso de sesión** (`#legacy-interrupt-dialog`, botón
`#legacy-interrupt-continue`) y bloquea la página hasta **Continuar**. El ejercicio 5 de LAB-107 lo usa. El archivo de
entrada pasó a llamarse `lote-entrada.json`. No se ha probado con PAD real.

**Vista previa.** Un módulo de producción pasó por opengraph.xyz con 0 errores (título y descripción propios, `og.png`
como `image/png`). LinkedIn Post Inspector y el validador de X exigen iniciar sesión y no se usaron.

**Sin aplicar, a propósito:** IP-IA-020 (el diffstat del README depende de cómo escriba el alumno las líneas en blanco) e
IP-QRY-002 (prerrequisito opcional).

## 12. Resolución de pendientes (2026-11-11)

Tercera ronda del día, solo de verificación. Fuentes en el orden pedido (Learn primero; docs de GitHub; comunidad solo
como indicio). Learn respondió sin 429. Nada se probó en un tenant real. Conteos sin cambios (76 módulos, 76 labs, 891
preguntas, 239 prácticas); ningún Caso Real, frontmatter, pregunta ni archivo de `src/` tocado.

| Pendiente | Veredicto | Evidencia (consultada el 2026-11-11) | Cambio aplicado |
|---|---|---|---|
| ¿Otro Trial (standard) con la misma cuenta al vencer el anterior? | **Sigue incierto, con plan práctico** | `create-environment` (ms.date 2026-10-08): "Yes (one)" y "trial limits are one per user", sin decir si es simultáneo o de por vida. `trial-environments` (2026-10-08): nada sobre recrear. Indicio: Field Service trial FAQ (2026-10-29) "one active trial per app at a time. You can sign up again after your current trial ends" (trial de producto, no de PPAC). `recover-environment` (2026-08-31): un ambiente borrado queda 7 días en **Recently deleted environments**; no se sabe si cuenta para el límite. Comunidad: sin respuesta oficial | `ENTORNOS_Y_TRIALS.md`: apartado "¿Puedo crear otro Trial…?" con lo confirmado, lo no confirmado y el plan (2.º Trial dentro de la vida de la licencia, esperar 7 días si el portal lo bloquea) |
| Licencia Power Apps trial ya consumida | **Confirmado el máximo; renovación sin confirmar** | `signup-for-powerapps` (2026-01-13): 30 días + dos extensiones, máximo 90. Crear un Trial exige licencia vigente (`create-environment`). Learn no dice si se puede obtener otra tras los 90 días | Documentado; techo práctico ~90 días por cuenta |
| Contradicción de Learn | **Documentada** | `signup-for-powerapps` aún recomienda el Developer Plan tras el trial; `developer/plan` (2026-10-26) dice que desde el 15 nov 2026 ya no crea ambiente. Prevalece la más reciente y específica | Nota en `ENTORNOS_Y_TRIALS.md` |
| Microsoft 365 Developer Program (E5) | **Confirmado** | FAQ (ms.date 2026-09-04): solo VS Professional/Enterprise, partners ISV Success/MAICPP y Premier/Unified; hasta 90 días; billing MCA con suscripción de Azure obligatoria; incluye "PowerApps for Office 365 Plan 3", sin premium | Tabla de alternativas y viñeta actualizada |
| Pay-as-you-go con Azure | **Alternativa propuesta (con coste)** | `pay-as-you-go-overview`: billing policy que vincula el ambiente a una suscripción de Azure; el uso se cobra con medidores | Fila en la tabla de alternativas; el coste para un alumno no se verificó |
| Developer gestionado tras 15 nov 2026 | **Confirmado** | `developer/plan`: uno por usuario, lo pide el admin (environment routing), licencia premium para ejecutar | Sin cambio (ya estaba) |
| Dataverse for Teams | **Alternativa parcial** | Conocida: Dataverse reducida dentro de Teams; no sustituye a Dataverse completa para niveles 2-4 | Fila en la tabla, sin profundizar (no se releyó la página de Learn) |
| **Security group** en un Trial | **Confirmado parcialmente** | `create-environment`: "For open access, select None. This field is now required"; `trial-environments` no lo marca como obligatorio | Sin cambio: el texto ya dice "None si está disponible" |
| **Enable Dynamics 365 apps** en un Trial | **Sigue la contradicción de Learn** | `trial-environments` lo ofrece; `create-environment` dice que no se puede en trials | Sin cambio (el curso lo deja en **No**) |
| `pac env who` | **Confirmado el comando; salida exacta no documentada** | Referencia `pac env` (ms.date 2026-10-25): "Displays information about the current Dataverse organization", parámetros `--environment` y `--json`; sin ejemplo de salida | Sin cambio: M52, LAB-52 y LAB-56 no afirman campos concretos |
| **Include default branch** (ruleset de GitHub) | **Confirmado (fuente secundaria)** | docs.github.com: "select **Add a target**, then select how you want to include or exclude branches"; la API lo expresa como `~DEFAULT_BRANCH`; tutoriales muestran la opción **Include default branch** | Sin cambio (M51 ya dice **Add a target** > **Include default branch**) |
| Ruta del Schedule Board | **Confirmado con dos rutas** | Learn da **Service > Scheduling > Schedule Board** (app Field Service) y **Resource Scheduling > Schedule Board** (app Resource Scheduling); la etiqueta varía según la app | Sin cambio: el contenido no afirma ruta de menú |
| `mserp_inventoryonhandaientity` | **Sigue incierto** | Ninguna página de Learn ni resultado indexado lo nombra; `inventory-onhand-mobile-app` solo dice que usa virtual tables de SCM | Sin cambio: LAB-70 ya dice "virtual table … con prefijo `mserp_`" sin nombre exacto |
| Ruta de tiendas en línea de Commerce | **Corregido** | `channel-setup-online` (ms.date 2026-01-20): **Modules > Channels > Online Stores**; `channel-setup-retail`: **Retail and Commerce > Channels > Stores > All stores** | LAB-98 Paso 1 usa la ruta de Learn para tiendas en línea |
| Etiquetas de Field Service (Requirement pane, Schedule Assistant Filter) | Ya confirmadas en §11.7 | — | — |

**Siguen inciertos y por qué:** (1) segundo Trial con la misma cuenta y una segunda licencia trial: Learn no lo dice y
solo se puede comprobar en un tenant real al vencer; (2) `mserp_inventoryonhandaientity`: el nombre lógico solo se ve en
un ambiente con F&O y virtual tables; (3) salida exacta de `pac env who`: `pac` no está instalado en esta máquina;
(4) el resto del inventario de §11.5 (etiquetas de los niveles 1 a 4) y las rutas de F&O de §11.7 (Chart of accounts,
Pending vendor invoices, etc.) no se revisaron en esta ronda.

## 13. Auditoría de experiencia y recorrido de aprendizaje (2026-11-11)

**Diagnóstico (medido en producción antes del cambio):**

- La barra lateral tenía 50 enlaces en 6 secciones (dominios, niveles, empleabilidad con 6 guías, recursos con 18). Varias
  apuntaban a lo mismo por caminos distintos, y había tres llamadas a "continuar" que podían recomendar cosas diferentes
  (tarjeta del último módulo, siguiente acción y botón de la barra).
- El inicio repetía la barra: 8 tarjetas de acceso rápido y 4 de dominio debajo del bloque guiado.
- El siguiente paso solo conocía las 7 actividades de Fundamentos. Al terminarlas recomendaba "Descubre tu ruta" para
  siempre, así que el alumno no recibía respuesta a "¿qué sigue?" para los 76 módulos. Además, después de elegir ruta la
  actividad de cierre (quiz) nunca contaba como hecha.
- El Módulo 1 tiene unas 7.000 palabras en una sola página de 23.000 px, sin índice, con los suplementos opcionales
  al mismo nivel que la práctica obligatoria y el diagnóstico de caso (que no puntúa) antes de la evaluación.
- Las instrucciones citan la interfaz en inglés; un alumno con el tenant en español no encuentra **Tables** (Tablas),
  **Compose** (Redactar) o **Environments** (Entornos), y las fórmulas de Power Fx fallan con separador `;`.

**Decisiones y por qué:**

| Cambio | Motivo | Se preserva |
|---|---|---|
| Barra: Siguiente paso + 3 enlaces + Temario + Practicar/Explorar plegados | Reducir opciones simultáneas (de 50 a ~15 visibles) y que la acción del día sea la única destacada | Todas las páginas siguen existiendo; recursos y empleo, agrupados en `/recursos` |
| Inicio con una sola acción y "Tu recorrido" numerado | Responder "¿por dónde empiezo?" y "¿dónde estoy?" sin interpretar la plataforma | Repaso del día, mapa, rutas y niveles |
| Siguiente paso por la ruta elegida o la cadena de certificación | Responder "¿qué sigue?" después de Fundamentos | El modo libre y la elección de ruta |
| Módulo en Aprende → Practica → Comprueba, con índice y opcionales plegados | Que el alumno sepa qué hacer en cada módulo y cuándo ha terminado | Todo el texto: solo se pliega lo marcado como suplemento u opcional |
| Etiquetas de interfaz en ambos idiomas (preferencia del alumno) | Que el idioma del tenant no bloquee un lab | Las instrucciones siguen escritas una vez; el diccionario solo muestra términos verificados |

**Lo que no se hizo (y por qué):** no se ocultaron niveles avanzados (el curso es de autoestudio y el modo guiado ya
avisa sin bloquear); no se fusionaron las páginas de dominio (Power Platform, Dynamics 365, Integración) porque las
enlazan rutas y mapa, solo salieron de la barra; no se tradujeron los 152 archivos de contenido, porque un diccionario
central escala y se corrige en un solo sitio.

**Pendiente:** confirmar con un tenant en español las etiquetas sin verificar (D365, Copilot Studio, Power Automate de
nube: Run history, Send an email (V2), Close as Won…) y añadirlas a `ui-terms.ts` con `verified: true`.

## 14. Longitud de los módulos y qué se pliega (2026-11-11)

Medido sobre el Markdown (palabras, sin frontmatter). Total del curso: 406.013 palabras; mediana por módulo: unas 5.100
(unos 25 min de lectura sin contar la práctica).

**Ya plegado en la app** (bloques marcados como "Profundización opcional", "Suplemento" u "(opcional"): solo 7 módulos
tienen esa marca. Lo que pasa a plegarse: M5 1.753 palabras, M1 1.711, M4 1.033, M6 983, M12 964, M3 392 y M24 358.

**Los más largos, sin nada marcado como opcional:**

| Módulo | Palabras | Tipo | Propuesta |
|---|---|---|---|
| 41 Capstone arquitectura | 10.776 | Proyecto | Dividir en etapas con entregable (descubrimiento, diseño, defensa) y casilla por etapa |
| 8 Primer proyecto integrado | 9.994 | Proyecto | Igual: etapas; es el primer proyecto, conviene que se vea cuánto falta |
| 34 Azure Integration Services | 8.112 | Teoría + práctica | Marcar como profundización los patrones avanzados (Event Grid, Service Bus sesiones) |
| 20 D365 Sales y Customer Service | 7.922 | Teoría + práctica | Separar Sales y Customer Service en dos microlecciones con su práctica; marcar opcional lo que exige trial de D365 |
| 30 Proyecto multicapa N3 | 7.109 | Proyecto | Etapas |
| 17 Proyecto integrador N2 | 7.101 | Proyecto | Etapas |
| 38 Liderazgo técnico | 7.047 | Teoría | Marcar como profundización las plantillas largas (actas, RACI) y enlazarlas como recurso |
| 37 AI Builder y Azure AI | 6.680 | Teoría + práctica | Profundización: Azure AI fuera del núcleo |
| 7 Power Fx | 6.525 | Práctica | Ya tiene aviso "Qué queda para después" pero el bloque no está marcado: marcarlo |
| 43 Copilot en Power Platform | 6.452 | Teoría + práctica | Profundización para funciones en preview |

**Criterio propuesto:** el núcleo obligatorio de un módulo cabe en una sesión (unas 4.000 palabras o 60-90 min con
práctica). Lo que no hace falta para los criterios de validación ni para la evaluación se marca con
`#### 🔧 Profundización opcional` y la app lo pliega sin borrarlo. Los proyectos no se recortan: se dividen en etapas.
No se toca el Caso Real ni el texto que citan las preguntas `appliesTo: "caso"`.

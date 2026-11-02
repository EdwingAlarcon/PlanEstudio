---
moduleId: 17
title: "Proyecto Integrador Nivel 2"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 30
practiceMinutes: 990
slug: "proyecto-integrador-nivel-2"
lastVerified: "2026-11"
---
### 🎯 Objetivo
Construir un sistema CRM-lite completo para gestión de clientes y oportunidades comerciales, integrando todos los conceptos del Nivel 2: modelo de datos avanzado en Dataverse, Canvas App con Component Library, Model-Driven App, Power Automate con Child Flows, Power BI con DAX avanzado, Copilot Studio, y ALM de DEV a TEST (UAT y PROD quedan diseñados en papel, como en el Módulo 16).

> **Cómo está organizado este proyecto:** cada **fase** es una microlección: qué vas a construir, una micropráctica corta para decidir bien antes de hacerlo, la construcción en tu entorno y una tabla de **evidencia** con el dato exacto que observaste. A diferencia de los módulos anteriores, aquí casi no hay clic a clic: cada fase remite al módulo donde aprendiste esa pieza. Si te atoras, vuelve a ese módulo; esa es la práctica real de un proyecto. Cierra con un **reto de transferencia**: el mismo sistema para otro negocio.
>
> **Duración realista:** si es la primera vez que haces un proyecto así, cuenta unas **9 horas para la entrega mínima** y unas **16-17 horas para la completa**, repartidas en varios días. Los tiempos de cada fase ya incluyen buscar en el módulo de origen lo que no recuerdes. No intentes hacerlo de una sentada: termina cada fase con su evidencia antes de pasar a la siguiente. Hay dos esperas que no dependen de ti: el primer cálculo de la rollup (Fase 1) y, si la acabas de crear, la aplicación de la data policy de TEST (Módulo 16).
>
> **Antes de empezar:**
> - **Dos entornos, no tres:** el de desarrollo (**DEV**, el del curso) y el de pruebas (**TEST**, tu `SIT-TEST` del Módulo 16). UAT y PROD se quedan diseñados en papel, como en el Módulo 16. Si no tienes TEST, crea un Trial con Dataverse: ver [Entornos y trials](/recursos/entornos-y-trials).
> - **Solución nueva:** crea en DEV la solución `SIT CRM Lite` con tu publisher `sit` (Módulo 2). **Todo** lo que construyas en este proyecto se crea desde dentro de ella.
> - **Licencias:** Copilot Studio en trial no permite publicar (Módulo 15); la Fase 5 tiene un camino alternativo. Power BI necesita poder publicar en un workspace del servicio (Módulo 6).
> - **Un segundo usuario (recomendado, no obligatorio):** la seguridad por vendedor (Fases 4 y 5) solo se prueba de verdad con dos personas. Si en tu ambiente eres el único usuario, el proyecto te da una prueba alternativa en cada fase y te dice qué deja sin comprobar.

### 🪜 Tres niveles de entrega

| Nivel | Qué incluye | Para qué sirve |
|---|---|---|
| **Mínima** (≈9 h) | Fase 1 completa; Fase 2 solo la Model-Driven App y la pantalla **Lista** de la Canvas App; Fase 3 sin las tres ramas paralelas (el Child Flow, la aprobación, Aprobada/Rechazada y el Catch sí); Fase 6 pasos 0 a 4 y la prueba de punta a punta **solo hasta aprobar la propuesta** (sin Power BI ni bot) | Demuestra el ciclo dato → app → automatización → despliegue |
| **Completa** (≈16-17 h) | Las 6 fases completas | Es la que exigen los Criterios de Validación del Proyecto Final |
| **Excelente** (≈20 h) | Completa + **una** extensión opcional (JavaScript, PCF o conector personalizado) + el reto de transferencia | Es la que conviene mostrar en un portafolio |

Las extensiones opcionales (PCF, JavaScript, conector personalizado) y lo que va más allá del proyecto (más topics en el agente, `RANKX` en el informe) **no** son obligatorios para aprobar: ya los practicaste en sus módulos (12 a 15). Ver los Criterios de Graduación al final.

### 📖 Conceptos Clave
Este módulo no introduce conceptos nuevos — aplica y consolida todos los del Nivel 2 en un proyecto cohesivo.

**Stack del proyecto:**

- Dataverse: modelo de datos con tablas nativas (Account, Contact) y propias (Oportunidad, Propuesta, Competidor), con relaciones 1:N y N:N, columna calculada, rollup y reglas de negocio (Módulo 9)
- Canvas App: gestión de oportunidades con Component Library (Módulo 10)
- Model-Driven App: vista 360° del cliente para el equipo comercial (Módulos 4 y 9)
- Power Automate: flujo de aprobación con Child Flow, Try/Catch y notificaciones paralelas (Módulo 11)
- Power BI: dashboard de pipeline comercial con RLS por vendedor (Módulo 12)
- Copilot Studio: bot para consultas de oportunidades desde Teams (Módulo 15)
- ALM: solución exportada de DEV e importada en TEST, con Connection References y Environment Variables (Módulo 16)

**Una decisión de diseño que tomarás en la Fase 1:** las tablas **Opportunity** y **Competitor** que ves en la documentación de Microsoft **no** son de Dataverse "puro": las agrega Dynamics 365 cuando el entorno se crea con aplicaciones de Dynamics 365 habilitadas (por ejemplo Sales) ([Learn: referencia de tablas de las apps de Dynamics 365](https://learn.microsoft.com/dynamics365/developer/reference/about-entity-reference)). En un entorno Developer o un Trial de Power Apps no existen, así que este proyecto usa tablas propias `Oportunidad` y `Competidor`. Account y Contact sí son tablas estándar de Dataverse y se reutilizan.

---

## 🧩 Microlección 1 — Fase 1: el modelo de datos (≈150 min)

**Qué vas a construir:** el modelo antes que cualquier app. Si cambias el modelo después, rehaces formularios, vistas, fórmulas, flujos y el informe.

**Ahora haz algo — micropráctica (5 min):** decide qué tablas reutilizar y cuáles crear → **[Diseñar el modelo del CRM-lite](/practica/ip-app-014-modelo-crm-lite)**. Si dudas con la relación N:N, repasa → **[N:N vs tabla intermedia](/practica/ip-dv-004-tabla-intermedia)**: allí gana la tabla intermedia porque la relación guarda datos propios; Oportunidad–Competidor no guarda ninguno, así que aquí basta una N:N nativa.

**Construye en DEV, dentro de `SIT CRM Lite`** (los nombres internos llevarán `sit_`; en las apps y fórmulas usarás los nombres visibles):

1. **Account** (Cuenta) y **Contact** (Contacto): agrégalas a la solución con **Add existing** > **Table** (sin incluir todas sus columnas). En Account crea una columna Choice **Tipo de Cliente** (Estándar, Estratégico): la usará el flujo de aprobación.
2. **Oportunidad** (tabla nueva, como en el Módulo 9: **New** > **Table** > **Table (advanced properties)**). Antes de guardarla, despliega **Advanced options**:
   - **Record ownership:** **User or team**, para que cada vendedor sea dueño de las suyas.
   - Marca **Creating a new activity** ("asociar actividades a las filas de esta tabla"). Sin ella, la tarea de seguimiento de la Fase 3 no se puede relacionar con la oportunidad. Es una opción que se fija una sola vez: después no se puede desmarcar ([Learn: propiedades de tabla](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-portal), [Learn: opciones que se fijan una vez](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-entities-solution-explorer)).

   **Si ya creaste la tabla sin esa opción:** ábrela > **Properties** (propiedades de la tabla) > **Advanced options** y márcala ahora, antes de la Fase 3.

   Columnas:

   | Columna (nombre visible) | Tipo | Notas |
   |---|---|---|
   | Nombre | columna principal | Ej. "Renovación de licencias ACME 2027" |
   | Cuenta | Lookup a Account | Required |
   | Monto Estimado | Currency | |
   | Probabilidad | Whole number | Mínimo 0, máximo 100 |
   | Monto Ponderado | Currency, **calculada** | `Monto Estimado * Probabilidad / 100`. Usa **Behavior** = **Calculated** (el mismo tipo de columna del Lab 09), no una columna de fórmula: una columna de fórmula no puede producir Currency ([Learn: columnas de fórmula](https://learn.microsoft.com/power-apps/maker/data-platform/formula-columns), [Learn: columnas calculadas](https://learn.microsoft.com/power-apps/maker/data-platform/define-calculated-fields)) |
   | Etapa | Choice | Prospección, Calificación, Propuesta, Negociación, Ganada, Perdida · Default = Prospección |
   | Fecha de Cierre | Date only | |
   | Origen | Choice | Web, Referido, Campaña, Outbound |
   | Oportunidad Caliente | Yes/No | La llena una regla de negocio |
   | Estrategia Competitiva | Multiple lines of text | Opcional: protégela con seguridad a nivel de columna (Módulo 9) |

   El responsable de la oportunidad es su **Owner** (propietario): no crees un lookup aparte a Users.
3. **Propuesta** (tabla nueva): Oportunidad (Lookup a Oportunidad, Required), Versión (Whole number), Monto (Currency), Estado (Choice: Borrador, En Revisión, Aprobada, Rechazada · Default = Borrador), Enlace al Documento (URL), Comentarios del Aprobador (Multiple lines of text).
4. **Competidor** (tabla nueva, propiedad *Organization*, es un catálogo): Nombre, Sitio Web (URL), Fortalezas y Debilidades (Multiple lines of text). Relación **many-to-many** entre Oportunidad y Competidor: el diseñador visual de tablas no crea N:N, así que hazla como en el Módulo 9, desde el hub de **Oportunidad** > zona **Relationships** > **New relationship** > **Many-to-many** ([Learn: relaciones N:N](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-nn-relationships-portal)).
5. En Oportunidad, una columna **rollup** `Número de Propuestas` (Whole number) que cuenta las Propuestas relacionadas (Módulo 9). Un rollup no se actualiza al instante: el primer cálculo masivo corre **12 horas** después de crear la columna y luego hay un cálculo incremental cada hora. Para verlo ya, abre la oportunidad en la Model-Driven App (Fase 2), selecciona el icono de calculadora junto al valor y pulsa **Recalculate** ([Learn: rollup](https://learn.microsoft.com/power-apps/maker/data-platform/define-rollup-fields)). Si no tienes aún la app, sigue con la Fase 2 y vuelve a esta evidencia al final.
6. Reglas de negocio en Oportunidad, con **Scope = Entity** para que se cumplan también desde la Canvas App y los flujos, no solo en el formulario ([Learn: reglas de negocio](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-create-business-rule)):
   - Si **Etapa** es Ganada y **Fecha de Cierre** no tiene valor → **Show error message** en Fecha de Cierre: "Indica la fecha de cierre de una oportunidad ganada".
   - Si **Probabilidad** es mayor o igual que 80 → **Set column value** de Oportunidad Caliente = Yes; si no → No. (Mostrar u ocultar campos o marcarlos como obligatorios solo funciona con scope de formulario; por eso aquí se valida con un mensaje de error y una columna.)
   - **Activate** cada regla.
7. Crea 5 cuentas (al menos una **Estratégica**), 3 competidores y 10 oportunidades repartidas por etapas. **Si en tu ambiente hay otro usuario**, pon al menos 2 oportunidades a su nombre (cambia su **Owner**): así la seguridad por vendedor de las Fases 4 y 5 se prueba con dos personas. **Si eres el único usuario**, déjalas todas a tu nombre: la Fase 4 te da una prueba alternativa.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre lógico de la tabla Oportunidad y de su columna Etapa | ___ |
| Valor de Monto Ponderado de una oportunidad (con su Monto Estimado y Probabilidad) | ___ |
| Mensaje exacto que viste al guardar una oportunidad Ganada sin Fecha de Cierre | ___ |
| Valor de `Número de Propuestas` de una oportunidad con 2 propuestas, y si lo viste con **Recalculate** o esperando al cálculo automático | ___ |
| Por qué usaste una tabla propia `Competidor` en vez de la tabla Competitor de Microsoft (una frase) | ___ |

---

## 🧩 Microlección 2 — Fase 2: Model-Driven App para gerentes y Canvas App para vendedores (≈270 min)

**Qué vas a construir:** dos apps sobre el mismo dato, cada una para quien la usa.

**Ahora haz algo — micropráctica (5 min):** la pantalla Lista, el Kanban y el Home leen muchas filas. Antes de escribir los filtros, repasa qué decisiones reducen el riesgo de resultados incompletos → **[Delegation awareness](/practica/ip-app-003-delegation-awareness)**. Es la misma micropráctica del Módulo 10; aunque su ficha cite el Módulo 26 como prerrequisito, se resuelve con lo que viste en el Módulo 7. Su idea clave: un aviso de delegación no se ignora "porque con pocos datos funciona"; se decide con un dato, y eso harás en el paso 7.

*Model-Driven App (gerentes, ≈60 min, Módulo 4):*

1. App `SIT CRM Gerencia` con Account, Contact, Oportunidad, Propuesta y Competidor.
2. En el formulario principal de Account, una subcuadrícula de Oportunidades y otra de Contactos (la "vista 360°"). En el de Oportunidad, una subcuadrícula de Propuestas y otra de Competidores.
3. Vista `Pipeline Abierto`: oportunidades cuya Etapa no es Ganada ni Perdida, ordenadas por Fecha de Cierre.

*Canvas App (vendedores, ≈210 min, Módulos 7 y 10):*

4. Importa los componentes de tu **SIT Component Library** (Módulo 10): `cmpHeader`, `cmpSearchBox` y `cmpStatCard`. En Power Apps Studio: **Insert** (o **+** en el panel izquierdo) > **Get more components** > elige la biblioteca y los componentes ([Learn: biblioteca de componentes](https://learn.microsoft.com/power-apps/maker/canvas-apps/component-library)). **Si no tienes `cmpStatCard`** (en el Módulo 10 solo lo diseñaste en la micropráctica), créalo ahora dentro de la biblioteca como hiciste con `cmpHeader`: dos Input Properties, `Titulo` (Text) y `Valor` (Number), y dos etiquetas que las muestren. Guarda y **publica** la biblioteca: solo lo publicado llega a las apps, y Learn avisa de que puede tardar hasta 5 minutos en aparecer ([Learn: ALM de la biblioteca](https://learn.microsoft.com/power-apps/maker/canvas-apps/component-library-alm)).
5. Pantallas: **Home** (tres `cmpStatCard`: Total pipeline, Oportunidades calientes, Tasa de cierre), **Lista** (galería `galOportunidades` + `cmpSearchBox` + filtro por Etapa), **Detalle** (formulario de edición), **Nueva** (formulario en modo nuevo) y **Kanban** (una galería por etapa abierta).
6. Kanban: la galería de la columna "Propuesta" y su botón para avanzar de etapa. Las fórmulas usan nombres visibles y la enumeración de la Choice, como en el Módulo 7. Una Choice local se nombra con el nombre de la columna y, entre paréntesis, el nombre en plural de la tabla ([Learn: tipos de datos de Power Fx](https://learn.microsoft.com/power-platform/power-fx/data-types)); si tu plural no es "Oportunidades", escribe `'Etapa (` en la barra de fórmulas y elige lo que te proponga:

   ```js
   // Items de galPropuesta: solo las oportunidades en etapa Propuesta (delegable en Dataverse)
   Filter(Oportunidades, Etapa = 'Etapa (Oportunidades)'.Propuesta)

   // OnSelect de btnMoverSiguiente, dentro de galPropuesta
   Patch(
       Oportunidades,
       ThisItem,
       { Etapa: 'Etapa (Oportunidades)'.Negociación }   // la tarjeta pasa sola a la galería de Negociación
   )
   ```
7. Named formulas para el Home (**App** > propiedad **Formulas**). Power Fx no tiene `Divide`: se divide con `/` y se protege con `IfError`:

   ```js
   TotalPipeline = Sum(
       Filter(Oportunidades, Etapa <> 'Etapa (Oportunidades)'.Ganada && Etapa <> 'Etapa (Oportunidades)'.Perdida),
       'Monto Ponderado'
   );
   OportunidadesCalientes = CountRows(Filter(Oportunidades, 'Oportunidad Caliente' = true));
   TasaCierre = IfError(
       CountRows(Filter(Oportunidades, Etapa = 'Etapa (Oportunidades)'.Ganada)) /
       CountRows(Filter(Oportunidades, Etapa = 'Etapa (Oportunidades)'.Ganada || Etapa = 'Etapa (Oportunidades)'.Perdida)),
       0   // si aún no hay oportunidades cerradas, la división por cero da error y se muestra 0
   );
   ```
   **Espera un aviso de delegación en `TotalPipeline`:** el filtro por Etapa sí se delega, pero Learn indica que un valor que en Power Apps parece un número y en Dataverse no es un número simple, como una columna **Currency**, no se delega ([Learn: delegación en Dataverse](https://learn.microsoft.com/power-apps/maker/canvas-apps/connections/connection-common-data-service)). Sin delegación, la app suma solo las primeras filas que trae, hasta el **Data row limit** (500 por defecto, hasta 10.000; Módulo 7). **No lo ignores; decide con un dato:** anota cuántas oportunidades tienes y cuántas esperaría el negocio (20 vendedores). Si caben de sobra bajo el límite, es aceptable y lo documentas; si no, el total del pipeline se muestra desde Power BI (Fase 4), que no tiene ese límite.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Número de filas que muestra la vista `Pipeline Abierto` (y si coincide con tus datos) | ___ |
| Valores que muestran las tres `cmpStatCard` del Home | ___ |
| Fórmula que da aviso de delegación, número de oportunidades frente al **Data row limit** y tu decisión | ___ |
| Qué pasó en la galería de Negociación al pulsar `btnMoverSiguiente` | ___ |
| Comprobaste en la Model-Driven App que la Etapa cambió: nombre de la oportunidad y Etapa que ves allí | ___ |

---

## 🧩 Microlección 3 — Fase 3: aprobación de propuestas con Child Flow (≈180 min)

**Qué vas a construir:** la aprobación formal que reemplaza a WhatsApp, con un aprobador que depende del monto y del tipo de cliente.

**Ahora haz algo — microprácticas (10 min):** calienta con el orden trigger → condición → acciones y los casos límite de un umbral → **[Aprobación por monto](/practica/ip-pa-002-aprobacion-por-monto)** (es la del Módulo 11, con **un solo** umbral; los tres tramos y el tipo de cliente de tu Child Flow los decides tú, como en el reto de la Microlección 2 del Módulo 11). Después decide qué errores se reintentan y cuáles van al Catch → **[Retry vs Scope/Try-Catch](/practica/ip-pa-004-retry-scope-try-catch)**.

**Construye en DEV, dentro de `SIT CRM Lite`** (Módulo 11; crea los flujos desde la solución para que usen Connection References):

1. **Child Flow `SIT - Determinar Aprobador`** (**New** > **Automation** > **Cloud flow** > **Instant**): trigger **Manually trigger a flow** con entradas `Monto` (Number) y `TipoCliente` (Text); responde con **Respond to a Power App or flow** la salida `EmailAprobador` ([Learn: child flows](https://learn.microsoft.com/power-automate/create-child-flows)). Reglas: si `TipoCliente` es "Estratégico" → director; si no, monto < 10.000 → supervisor; < 100.000 → gerente; resto → director. Guarda los tres correos en **Environment Variables** (Módulo 16), no escritos en el flujo: en TEST serán otros. Si el Child Flow usa algún conector que no sea Dataverse ni una acción integrada, en su página de propiedades, tile **Run only users** > **Edit**, elige **Use this connection** para cada conexión: un Child Flow solo admite conexiones incrustadas.
2. **Flujo principal `SIT - Aprobar Propuesta`**: trigger de Dataverse **When a row is added, modified or deleted** sobre Propuesta ([Learn: el trigger y sus filtros](https://learn.microsoft.com/power-automate/dataverse/create-update-delete-trigger)):
   - **Change type:** **Modified**. **Table name:** Propuestas. **Scope:** **Organization** (las propuestas son de distintos vendedores).
   - **Select columns:** el nombre lógico de la columna Estado de Propuesta (por ejemplo `sit_estado`; usa el tuyo). Así el flujo solo arranca cuando la actualización incluye Estado.
   - **Filter rows:** por ejemplo `sit_estado eq 123450001`, con **tu** nombre de columna y el **número** de **tu** opción En Revisión (el número del ejemplo es inventado) (una Choice se filtra por su número, no por su texto, como en el Módulo 5). Para leer el número, deja **Filter rows** vacío, guarda, pasa una propuesta a En Revisión y mira en el historial las salidas sin procesar (*raw outputs*) del trigger, como en el Módulo 5; luego escribe el filtro.
3. Obtén la Oportunidad y su Cuenta (para el Tipo de Cliente) y llama al Child Flow con **Run a Child Flow** (conector **Flows**, pestaña **Built-in**). Crea el flujo principal y el Child Flow en la misma solución: solo así aparece en la lista.
4. **Scope Try**: **Start and wait for an approval** al `EmailAprobador`. Si se aprueba, tres ramas paralelas: actualizar la Propuesta a Aprobada, crear una tarea (Task) de seguimiento relacionada con la Oportunidad y avisar al Owner por Teams o correo. Si se rechaza: Propuesta a Rechazada, guardar los comentarios del aprobador en Comentarios del Aprobador y avisar al Owner.
   - **La tarea relacionada:** **Add a new row** sobre la tabla **Tasks**. En la columna *Regarding* (relativo a), el conector ofrece una entrada por cada tabla que admite actividades: elige la de tus Oportunidades (solo aparece si marcaste **Creating a new activity** en la Fase 1). Una búsqueda (lookup) se escribe `<entity set name>(<id>)`: el *entity set name* lo copias en Power Apps > **Tables** > Oportunidad > menú **Tools** > **Copy set name**, y el id es el de la oportunidad que obtuviste en el paso 3. Ejemplo: `sit_oportunidads(` + el id + `)` ([Learn: columnas de búsqueda en Add a new row](https://learn.microsoft.com/power-automate/dataverse/create)).
5. **Scope Catch** (Run after: failed, timed out): avisar al administrador con el mensaje de error del Try. Para obtenerlo, usa una acción **Compose** con la expresión `result('Try')` (si tu Scope se llama distinto, usa su nombre con guiones bajos en vez de espacios), como en la Práctica de manejo de errores del Módulo 5: devuelve el estado y las salidas de cada acción del Scope, donde está el mensaje de error ([Learn: función result](https://learn.microsoft.com/azure/logic-apps/workflow-definition-language-functions-reference#result)).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Correo que devolvió el Child Flow para una propuesta de 50.000 de un cliente Estándar, y para una de 5.000 de un cliente Estratégico | ___ |
| Texto exacto de **Filter rows** del trigger, con el número de En Revisión | ___ |
| *(Completa)* Asunto de la tarea creada y valor que muestra su columna *Regarding* | ___ |
| *(Completa)* Duración de las tres ramas paralelas en el historial de ejecuciones | ___ |
| Estado y Comentarios del Aprobador de una propuesta rechazada | ___ |
| Qué forzaste para probar el Catch y qué mensaje de error recibió el administrador | ___ |

---

## 🧩 Microlección 4 — Fase 4: dashboard de pipeline con RLS (≈150 min)

**Qué vas a construir:** el informe para la gerencia, donde cada vendedor solo ve lo suyo.

**Construye** (Módulos 6 y 12):

1. En Power BI Desktop, **Get data** > **Dataverse** con el **Environment domain** de DEV. Carga Oportunidad, Account y la tabla de usuarios del sistema (**Users**, para la RLS). En el **Navigator** las tablas suelen aparecer con su nombre interno, como en el Módulo 6: Users es `systemuser` y tu Oportunidad lleva el prefijo `sit_`.
2. En Power Query renombra la tabla a `Oportunidades` y las columnas a nombres visibles: la etiqueta de la Choice (la columna que termina en `name`, por ejemplo `sit_etapaname`) como `Etapa`, `createdon` como `Creado`, y Monto Ponderado y Fecha de Cierre.
3. Crea la tabla `Calendar` (Módulo 12), márcala como tabla de fechas y relaciónala con `Oportunidades[Fecha de Cierre]`.
4. Medidas:

   ```dax
   Pipeline Total =
   CALCULATE(
       SUM(Oportunidades[Monto Ponderado]),
       NOT ( Oportunidades[Etapa] IN { "Ganada", "Perdida" } )   // solo oportunidades abiertas
   )

   Tasa de Conversion =
   DIVIDE(
       CALCULATE(COUNTROWS(Oportunidades), Oportunidades[Etapa] = "Ganada"),
       CALCULATE(COUNTROWS(Oportunidades), Oportunidades[Etapa] IN { "Ganada", "Perdida" })
   )

   Pipeline 90 Dias =
   CALCULATE(
       [Pipeline Total],
       DATESINPERIOD('Calendar'[Date], TODAY(), 90, DAY)   // cierres previstos en los próximos 90 días
   )

   Tiempo Promedio Cierre =
   AVERAGEX(
       FILTER(Oportunidades, Oportunidades[Etapa] = "Ganada"),
       DATEDIFF(Oportunidades[Creado], Oportunidades[Fecha de Cierre], DAY)
   )
   ```
5. Visuales: embudo (*funnel*) por Etapa, dispersión Probabilidad vs Monto Estimado y tarjetas con las cuatro medidas.
6. RLS (Módulo 12), en cuatro pasos:
   1. **La relación:** en la vista de modelo, comprueba que Users y Oportunidades están relacionadas de `systemuserid` (en Users, el identificador del usuario) a la columna de Oportunidades que guarda el identificador del propietario (por ejemplo `ownerid`; el nombre exacto lo ves en Power Query, anótalo). Si Power BI no la creó, créala tú: uno a muchos, de Users a Oportunidades. Con dirección única, el filtro viaja del lado "uno" (Users) al "muchos" (Oportunidades), que es justo lo que necesitas (Módulo 6).
   2. **La columna que compara:** `USERPRINCIPALNAME()` devuelve el nombre con el que la persona inicia sesión (su UPN), y Learn avisa de que no siempre coincide con su correo ([Learn: RLS](https://learn.microsoft.com/fabric/security/service-admin-row-level-security)). En Users hay dos candidatas: **User Name** (`domainname`) y **Primary Email** (`internalemailaddress`) ([Learn: tabla User](https://learn.microsoft.com/power-apps/developer/data-platform/reference/entities/systemuser)). Para elegir con un dato, crea la medida `Quien Soy = USERPRINCIPALNAME()`, ponla en una tarjeta y mira qué columna de **tu** fila de Users tiene exactamente ese valor.
   3. **El rol:** **Modeling** > **Manage roles** > nuevo rol `Vendedor` sobre la tabla de usuarios, en el editor DAX: `[domainname] = USERPRINCIPALNAME()` (o `[internalemailaddress]`, la que coincidió; si renombraste la columna en Power Query, usa tu nombre).
   4. **La prueba:** **Modeling** > **View as** > marca `Vendedor` y **Other user**, escribe un UPN > **OK** ([Learn: validar roles en Desktop](https://learn.microsoft.com/power-bi/report-server/row-level-security-report-server)). Con **tu** UPN deberías ver solo tus oportunidades; con el de tu segundo usuario, solo las suyas. **Si eres el único usuario:** con tu UPN verás todas (todas son tuyas), así que prueba además un UPN que no existe, como `nadie@contoso.com`: deberías ver el informe vacío, porque Learn recomienda comprobar que un valor inesperado no devuelve filas ([Learn: guía de RLS](https://learn.microsoft.com/power-bi/guidance/rls-guidance)). Esa prueba demuestra que el filtro funciona; lo que **no** demuestra es que otra persona real vea solo lo suyo, y así lo anotas.

   Publica y asigna el rol en el servicio: en el workspace, **More options** (**...**) del modelo semántico > **Security** > agrega a los vendedores al rol `Vendedor`. Recuerda (Módulo 12) que la RLS solo restringe a quien tiene el rol **Viewer** en el workspace: a ti, como administrador, no te filtra. Para verlo en el servicio usa **Test as role** en esa misma página.

**🔧 Diagnosticar antes de desplegar (5 min):** en la Fase 6 vas a mover el informe a TEST. Un compañero lo hizo y su dashboard de TEST muestra las oportunidades de DEV → **[Diagnosticar: el dashboard de TEST muestra datos de DEV](/practica/ip-trb-012-dashboard-test-con-datos-de-dev)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Valor de `Pipeline Total` sin RLS; con **View as** y tu UPN; y con **View as** y el UPN de otro usuario (o el UPN inexistente, si eres el único) | ___ |
| Valor que mostró la medida `Quien Soy`, y nombres exactos de la columna de propietario (en Oportunidades) y de la columna de Users que usaste en el rol | ___ |
| Valor de `Tasa de Conversion` y cómo lo comprobaste a mano con tus datos | ___ |
| Workspace donde publicaste y a quién asignaste el rol `Vendedor` | ___ |

---

## 🧩 Microlección 5 — Fase 5: el bot del pipeline (≈120 min)

**Qué vas a construir:** el agente de la Microlección 3 del Módulo 15, ahora para vendedores: "¿cuánto tengo en pipeline?".

1. Agente `Asistente Comercial SIT` en DEV, dentro de `SIT CRM Lite`, con orquestación clásica y autenticación con Microsoft (la opción por defecto), para que el agente conozca al usuario.
2. Topic `Consultar Mi Pipeline` con 8 trigger phrases ("cuánto tengo en pipeline", "mis oportunidades", "cómo va mi mes"…).
3. Agent flow `SIT - Pipeline del Vendedor` (trigger **When an agent calls the flow**, entrada de texto `Email`), creado como en el Módulo 15. Power Automate no tiene una función que sume una columna de varias filas, así que la suma se hace con una **variable** y un bucle. FetchXML con agregados no sirve aquí: Learn indica que **List rows** no admite consultas de agregación ([Learn: List rows](https://learn.microsoft.com/power-automate/dataverse/list-rows)). En orden:

   | # | Acción | Qué configuras |
   |---|---|---|
   | 1 | **List rows** (Dataverse), renómbrala `Buscar usuario` | **Table name:** Users. **Filter rows:** `internalemailaddress eq '` + la entrada `Email` (contenido dinámico) + `'`. **Row count:** `1`. |
   | 2 | **Initialize variable** | **Name:** `varTotal`, **Type:** **Float**, **Value:** `0`. Va fuera de cualquier bucle: Learn indica que las variables solo se declaran en el nivel superior del flujo ([Learn: variables](https://learn.microsoft.com/power-automate/create-variable-store-values)). |
   | 3 | **List rows**, renómbrala `Listar oportunidades` | **Table name:** Oportunidades. **Filter rows:** `_owninguser_value eq ` + la expresión `first(outputs('Buscar_usuario')?['body/value'])?['systemuserid']` + ` and sit_etapa ne 123450004 and sit_etapa ne 123450005` (con tu nombre de columna y los números de **tus** opciones Ganada y Perdida; los del ejemplo son inventados; los lees como en la Fase 3). `_owninguser_value` es la forma de filtrar por el usuario propietario ([Learn: filtrar por una búsqueda](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/query/filter-rows)). **Sort By:** `sit_montoestimado desc` (tu nombre de columna), para que la primera fila sea la de mayor monto. |
   | 4 | **Apply to each** sobre `value` de `Listar oportunidades` y, dentro, **Increment variable** | **Name:** `varTotal`. **Value:** la expresión `coalesce(item()?['sit_montoponderado'], 0)` (tu nombre de columna; `coalesce` evita el error si una fila no tiene monto). Deja el bucle en secuencial, que es lo predeterminado: Learn advierte que con variables en paralelo el resultado no es predecible. |
   | 5 | **Respond to the agent** | **Add an output** > **Text** tres veces, como en el Módulo 15, con estas expresiones (**fx**): `Total` = `string(variables('varTotal'))`; `Cantidad` = `string(length(outputs('Listar_oportunidades')?['body/value']))`; `Mayor` = `coalesce(first(outputs('Listar_oportunidades')?['body/value'])?['sit_nombre'], 'ninguna')`, con el nombre interno de **tu** columna principal en vez de `sit_nombre` (es un ejemplo; usa el que anotaste, como en el Módulo 2). Recuerda el límite del Módulo 15: el flujo debe llegar a esta acción en menos de 100 segundos. |

   Los nombres `Buscar_usuario` y `Listar_oportunidades` de las expresiones son los de las acciones renombradas, con guiones bajos en vez de espacios: si no las renombras, usa los que tengan. En el nodo **Action** del topic pasa `System.User.Email` como `Email`. **Si el flujo no encuentra al usuario** (`Cantidad` 0 y en el historial `Buscar usuario` devuelve una lista vacía), compara en el historial el correo que llegó con tu **Primary Email**; si no coinciden, filtra por `domainname` en vez de `internalemailaddress`. **Si eres el único usuario**, todas las oportunidades abiertas salen como tuyas: compara el total con el `Pipeline Total` sin filtros de Power BI.
4. Mensaje final con las tres variables, y una pregunta "¿Quieres ver el detalle de alguna oportunidad?" que, por ahora, puede redirigir a **Escalate** con el contacto del gerente.
5. Publica en Teams si tu licencia lo permite; si no, prueba en el panel **Test your agent** y guarda una instantánea: arriba del panel, **…** > **Save snapshot** > **Save**; se descarga `botContent.zip` ([Learn: probar el agente](https://learn.microsoft.com/microsoft-copilot-studio/authoring-test-bot)).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Valor de `System.User.Email` que vio el agente (panel **Variables**) | ___ |
| Respuesta del agente (total, cantidad, mayor oportunidad) y si coincide con `Pipeline Total` de Power BI para ese vendedor | ___ |
| Filtro exacto de `Listar oportunidades` en el historial del flujo (con el id ya sustituido) y cuántas veces se repitió el **Apply to each** | ___ |
| Dónde lo probaste (Teams o panel **Test your agent**, con el nombre del `.zip` de la instantánea) | ___ |

---

## 🧩 Microlección 6 — Fase 6: ALM, despliegue a TEST y prueba de punta a punta (≈120 min)

**Qué vas a construir:** el paso de DEV a TEST como lo haría un equipo real (Módulo 16).

**Ahora haz algo — micropráctica (3 min):** antes de importar, repasa qué pasa cuando algo apunta al entorno equivocado → **[Environment incorrecto](/practica/ip-trb-002-entorno-incorrecto)**.

0. **Revisa la data policy de `SIT-TEST` antes de probar el Child Flow.** En el Módulo 16 creaste `Política TEST SIT` solo para ese ambiente. Learn advierte que los child flows tienen una dependencia interna con el conector **HTTP**, así que el grupo en que pongas HTTP puede impedir que corran: si HTTP está en **Blocked** (o en un grupo distinto del resto de conectores de tus flujos), `SIT - Aprobar Propuesta` no podrá llamar a `SIT - Determinar Aprobador` en TEST ([Learn: clasificación de conectores](https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification)). En el Power Platform Admin Center > **Security** > **Data and privacy** > **Data policy**, abre `Política TEST SIT` y comprueba que HTTP está en **Business**, el mismo grupo que Dataverse, Approvals y tus conectores de notificación. Si lo cambias, el cambio puede tardar en aplicarse (Módulo 16): hazlo antes del paso 4.
1. Revisa que `SIT CRM Lite` contenga: las tablas (con Account y Contact solo con sus columnas y formularios nuevos), las dos apps, los flujos (principal y Child Flow), el agente y su agent flow, las Connection References y las Environment Variables. **Agrega también la `SIT Component Library`** con **Add existing** (en el Módulo 10 la creaste fuera de una solución). La Canvas App depende de la biblioteca: si importas la app sin ella, Learn indica que la importación falla con *Import failed due to missing dependencies for &lt;nombre de la app&gt;*. La otra salida válida es importar antes en TEST una solución que la contenga ([Learn: ALM de la biblioteca de componentes](https://learn.microsoft.com/power-apps/maker/canvas-apps/component-library-alm)). Si elegiste la extensión del conector personalizado, ese conector va en una solución aparte que importas antes (Módulo 14).
2. Comprobador de soluciones: en **Solutions**, selecciona `SIT CRM Lite`, **…** > **Solution checker** > **Run**; al terminar, **View results** ([Learn: comprobador de soluciones](https://learn.microsoft.com/power-apps/maker/data-platform/use-powerapps-checker)). Corrige lo que marque como alto o crítico, o anota por qué lo aceptas.
3. Exporta: selecciona la solución > **Export** > **Publish** (publica todos los cambios) > **Next**; en **Version number** deja `1.0.0.0` y en **Export as** elige **Managed** > **Export** ([Learn: exportar soluciones](https://learn.microsoft.com/power-apps/maker/data-platform/export-solutions)).
4. Importa en TEST como en el Módulo 16, configurando las Connection References y poniendo los valores de TEST en las Environment Variables (los correos de aprobadores de TEST).
5. Power BI: en una copia del informe cambia el **Environment domain** de la consulta de Power Query al de TEST, actualiza las credenciales del origen de datos en el servicio y publícalo en un workspace de TEST.
6. **Prueba de punta a punta en TEST:** crear una oportunidad en la Canvas App → crear su propuesta y pasarla a En Revisión → aprobarla → verla en Power BI (tras actualizar el modelo semántico) → consultarla en el bot. Recuerda que la solución lleva la estructura, no los datos (Módulo 16): crea antes en TEST al menos una cuenta. **En la entrega mínima** la prueba termina al aprobar la propuesta.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Grupo en que está HTTP en `Política TEST SIT` (y si lo cambiaste) | ___ |
| Número de incidencias del Solution checker por gravedad, antes y después de corregir | ___ |
| Nombre del archivo `.zip` exportado | ___ |
| Advertencias o errores de la importación en TEST (texto exacto, o "ninguno") | ___ |
| Valor de cada Environment Variable en TEST | ___ |
| Hora de cada paso de la prueba de punta a punta y dónde lo comprobaste | ___ |

---

### 🧰 Extensiones opcionales (entrega excelente)
Elige **una** y documenta por qué la elegiste:

- **JavaScript (Módulo 13):** en el formulario de Oportunidad, al cambiar Probabilidad, mostrar una notificación de formulario si la oportunidad queda caliente sin Fecha de Cierre.
- **PCF (Módulo 13):** un control que muestre la Etapa como barra de progreso.
- **Conector personalizado (Módulo 14):** consultar una API pública de tipos de cambio para mostrar el Monto Estimado en otra moneda en la Canvas App.

---

## 🔁 Reto de transferencia — El mismo proyecto, otro negocio, sin pasos

**Requisito nuevo:** una red de **clínicas veterinarias** quiere el mismo sistema. Los "clientes" son dueños de mascotas (personas, no empresas), lo que se vende son **presupuestos de tratamiento** que debe aprobar el veterinario jefe si superan un monto, y los dueños quieren consultar el estado de su presupuesto **desde la web de la clínica** (no tienen cuenta de la organización).

**Micropráctica de transferencia (5 min):** decide qué piezas del CRM-lite se reutilizan y cuáles cambian → **[Transferir: CRM-lite para una clínica veterinaria](/practica/ip-app-015-crm-lite-clinica-veterinaria)**.

**Después, sin pasos:** escribe en una página el diseño (tablas y relaciones, qué Choice reemplaza a Etapa, qué parte del Child Flow cambia, qué canal y qué autenticación usa el agente) y construye **solo** el modelo de datos y el Child Flow en una solución nueva `SIT Clinica`.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tabla nativa que usaste para los dueños y por qué no Account | ___ |
| Lista de tablas y relaciones de `SIT Clinica` | ___ |
| Qué cambiaste en el Child Flow (entradas, reglas, salidas) | ___ |
| Canal y método de autenticación elegidos para el agente, y cómo identifica al dueño | ___ |

---

### 💼 Caso Real de Negocio
**Empresa:** Empresa de servicios profesionales con 20 vendedores  
**Problema:** Pipeline en Excel, actualizaciones manuales, cero visibilidad para gerentes, propuestas aprobadas por WhatsApp.  
**Solución completa:** Este proyecto. Canvas App para vendedores en campo (mobile-friendly). Model-Driven App para gerentes. Power Automate formaliza las aprobaciones con audit trail. Power BI da visibilidad en tiempo real. Bot en Teams para consultas rápidas desde el celular.  
**Resultado:** Pipeline visible en tiempo real. Tiempo de aprobación de propuestas: de 3 días a 4 horas. Adopción del sistema: 90% en primer mes.

### ✅ Buenas Prácticas
- En proyectos integrados, diseñar el modelo de datos PRIMERO antes de construir cualquier app
- Usar la misma solución para todos los componentes — facilita el ALM
- Probar el flujo completo (end-to-end) en TEST antes de presentar al cliente
- El Copilot Studio bot debe tener un fallback topic siempre configurado
- Documentar las decisiones de diseño importantes (por qué tabla personalizada vs nativa)
- Las reglas que deben cumplirse siempre (desde cualquier app o flujo) van con scope de tabla (**Entity**), no solo en el formulario
- Lo que cambia entre entornos (correos de aprobadores, URLs) va en Environment Variables, nunca escrito dentro del flujo

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| App de Canvas pierde conexión al importar solución | Connection no agregada como Connection Reference | Reemplazar todas las conexiones directas por Connection References |
| No encuentras las tablas Opportunity o Competitor | Son tablas de las apps de Dynamics 365; no existen en un entorno sin ellas | Usar tablas propias (`Oportunidad`, `Competidor`) y documentar la decisión |
| La regla "fecha de cierre obligatoria" no se cumple desde la Canvas App | La regla de negocio tiene scope de formulario | Cambiar el scope a **Entity** y usar **Show error message** |
| Power BI en TEST muestra datos de DEV | La consulta de Power Query sigue apuntando al **Environment domain** de DEV | Cambiar el entorno de origen en Power Query, actualizar credenciales del origen de datos y volver a publicar |
| `TasaCierre` da error cuando aún no hay oportunidades cerradas | División por cero en Power Fx | Envolver la división en `IfError(..., 0)` |
| Bot de Teams no refleja cambios publicados | La conversación abierta sigue con la versión anterior | Escribir `start over` en el chat del agente (o esperar: puede tardar hasta una hora) |
| La tarea de seguimiento no deja elegir la Oportunidad en *Regarding* | La tabla Oportunidad se creó sin **Creating a new activity** | Activar la opción en las propiedades de la tabla (**Advanced options**); después ya no se puede desactivar |
| En la columna Monto Ponderado no aparece el tipo Currency | Se eligió una columna de fórmula, que no produce Currency | Crear la columna como Currency con **Behavior** = **Calculated** |
| `Número de Propuestas` sigue vacío o desactualizado | La rollup se calcula por trabajos en segundo plano: el primero, 12 horas después de crearla | **Recalculate** en el formulario de la oportunidad |
| La importación en TEST falla con *missing dependencies* de la Canvas App | La `SIT Component Library` no está en la solución ni en TEST | Agregarla a `SIT CRM Lite` con **Add existing**, o importar antes su solución |
| El flujo principal no puede ejecutar el Child Flow en TEST | La data policy de TEST tiene HTTP en **Blocked** o en otro grupo; los child flows dependen de HTTP | Mover HTTP a **Business** en `Política TEST SIT` y esperar a que se aplique |
| El agent flow devuelve `Cantidad` 0 aunque tienes oportunidades | El correo que llega del agente no coincide con **Primary Email** de tu fila de Users, o los números de Ganada/Perdida del filtro no son los tuyos | Revisar en el historial la salida de `Buscar usuario` y el **Filter rows** enviado; probar con `domainname` |

### 🧪 Criterios de Validación del Proyecto Final
- [ ] Construí el modelo con Account y Contact nativas y Oportunidad, Propuesta y Competidor propias, con relaciones 1:N y N:N, una columna calculada y un rollup
- [ ] Mis reglas de negocio con scope **Entity** impiden guardar una oportunidad Ganada sin Fecha de Cierre, también desde la Canvas App
- [ ] La Canvas App usa la Component Library y tiene las 5 pantallas funcionando (Home, Lista, Detalle, Nueva, Kanban)
- [ ] La Model-Driven App muestra la vista 360° de una cuenta (oportunidades y contactos)
- [ ] El flujo de aprobación usa el Child Flow, tiene Try/Catch y 3 ramas paralelas, y funciona en TEST
- [ ] El dashboard de Power BI con RLS muestra a cada vendedor solo sus datos en Power BI Service (probado con un segundo usuario o, si eres el único, con **View as** y un UPN inexistente, anotando qué quedó sin probar)
- [ ] El bot responde consultas de pipeline con datos reales de Dataverse (en Teams o en el panel **Test**)
- [ ] La solución se importó como Managed en TEST sin errores de dependencias, con Environment Variables propias de TEST
- [ ] End-to-end: crear oportunidad → aprobar propuesta → ver en Power BI → consultar en bot, con la hora de cada paso anotada

**Rúbrica de cierre:** evalúa este proyecto con las rúbricas *Low-code / Maker* y *Consultoría
Funcional* (seguridad y documentación) de [Rúbricas y Plantillas de
Evaluación](/recursos/rubricas-plantillas). Aprobación: ≥70/100 sin ningún criterio en 0. Nivel
profesional/excelencia: ≥88/100.

---

## Criterios de Graduación — Nivel 2

Esta lista cubre **todo el Nivel 2** (Módulos 9 a 17), no solo este proyecto: lo que el proyecto no construye ya lo hiciste en su módulo, y aquí lo marcas con la evidencia de ese módulo. Para avanzar al Nivel 3 cumple los criterios **obligatorios**; los marcados *(opcional)* suman para la entrega excelente, pero no bloquean.

### Criterios Técnicos
- [ ] Modelo de datos Dataverse con relaciones 1:N y N:N, columna calculada y rollup (este proyecto, Fase 1) y seguridad a nivel de columna (Módulo 9)
- [ ] Component Library publicada con al menos 3 componentes reutilizables (Módulo 10 y Fase 2)
- [ ] Flujo de Power Automate con Try/Catch, Child Flow y ramas paralelas (Fase 3)
- [ ] Dashboard Power BI con tabla de fechas, time intelligence y RLS (Fase 4); `RANKX` lo practicaste en el Módulo 12 *(en este proyecto, opcional)*
- [ ] JavaScript de formulario y PCF básico funcionando en el entorno de desarrollo (Módulo 13; en este proyecto, una extensión *opcional*)
- [ ] Conector personalizado importado desde una definición OpenAPI 2.0 y usado en un flujo o una app (Módulo 14; en este proyecto, una extensión *opcional*)
- [ ] Agente de Copilot Studio con topics propios, una entidad personalizada y un agent flow que consulta Dataverse (Módulo 15 y Fase 5)
- [ ] Solución con Connection References y Environment Variables desplegada de **DEV a TEST** como Managed, con UAT y PROD diseñados en papel (Módulo 16 y Fase 6)

### Criterios de Calidad
- [ ] Ningún componente usa el prefijo `new_` — todos usan el prefijo del publisher
- [ ] Ningún flujo falla en silencio: el flujo de aprobación avisa al administrador desde su Catch, y el agent flow siempre responde algo al agente (aunque no encuentre filas)
- [ ] La solución exportada como Managed se importa en TEST sin errores en primera vez
- [ ] El dashboard Power BI tiene tabla de fechas personalizada (no AutoDate/Time)

### Auto-evaluación de Dominio
Califica cada tema del 1 al 5:

- Dataverse relaciones y seguridad: ___/5
- Canvas Component Library: ___/5  
- Power Automate avanzado: ___/5
- DAX time intelligence: ___/5
- JavaScript en formularios Model-Driven: ___/5
- Conectores personalizados: ___/5
- Copilot Studio: ___/5
- ALM y soluciones: ___/5

**Promedio ≥ 3.5 en todos → Puedes avanzar al Nivel 3**

---

*Siguiente nivel: [Nivel 3 — Avanzado](/nivel/avanzado) — Arquitectura, Plugins C#, PCF avanzado, D365 CE, Integraciones Azure*

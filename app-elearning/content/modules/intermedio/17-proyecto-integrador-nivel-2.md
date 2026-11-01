---
moduleId: 17
title: "Proyecto Integrador Nivel 2"
level: "intermedio"
certification: "PL-200 (retirado 31 ago 2026)"
estimatedMinutes: 20
practiceMinutes: 600
slug: "proyecto-integrador-nivel-2"
lastVerified: "2026-11"
---
### 🎯 Objetivo
Construir un sistema CRM-lite completo para gestión de clientes y oportunidades comerciales, integrando todos los conceptos del Nivel 2: modelo de datos avanzado en Dataverse, Canvas App con Component Library, Model-Driven App, Power Automate con Child Flows, Power BI con DAX avanzado, Copilot Studio, y ALM con 3 ambientes.

> **Cómo está organizado este proyecto:** cada **fase** es una microlección: qué vas a construir, una micropráctica corta para decidir bien antes de hacerlo, la construcción en tu entorno y una tabla de **evidencia** con el dato exacto que observaste. A diferencia de los módulos anteriores, aquí casi no hay clic a clic: cada fase remite al módulo donde aprendiste esa pieza. Si te atoras, vuelve a ese módulo; esa es la práctica real de un proyecto. Cierra con un **reto de transferencia**: el mismo sistema para otro negocio.
>
> **Duración realista:** unas 10 horas para la entrega completa, repartidas en varios días. No intentes hacerlo de una sentada: termina cada fase con su evidencia antes de pasar a la siguiente.
>
> **Antes de empezar:**
> - **Dos entornos:** el de desarrollo (**DEV**, el del curso) y uno de pruebas (**TEST**), como en el Módulo 16. Si solo tienes un entorno de desarrollo, crea un Trial con Dataverse y úsalo como TEST: ver [Entornos y trials](/recursos/entornos-y-trials).
> - **Solución nueva:** crea en DEV la solución `SIT CRM Lite` con tu publisher `sit` (Módulo 2). **Todo** lo que construyas en este proyecto se crea desde dentro de ella.
> - **Licencias:** Copilot Studio en trial no permite publicar (Módulo 15); la Fase 5 tiene un camino alternativo. Power BI necesita poder publicar en un workspace del servicio (Módulo 6).

### 🪜 Tres niveles de entrega

| Nivel | Qué incluye | Para qué sirve |
|---|---|---|
| **Mínima** (≈6 h) | Fases 1, 2 (solo Model-Driven App + pantalla Lista de la Canvas App), 3 (solo el Child Flow y la aprobación) y 6 | Demuestra el ciclo dato → app → automatización → despliegue |
| **Completa** (≈10 h) | Las 6 fases completas | Es la que exigen los Criterios de Validación del Proyecto Final |
| **Excelente** (≈14 h) | Completa + una extensión opcional (JavaScript, PCF o conector personalizado) + el reto de transferencia | Es la que conviene mostrar en un portafolio |

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

## 🧩 Microlección 1 — Fase 1: el modelo de datos (≈90 min)

**Qué vas a construir:** el modelo antes que cualquier app. Si cambias el modelo después, rehaces formularios, vistas, fórmulas, flujos y el informe.

**Ahora haz algo — micropráctica (5 min):** decide qué tablas reutilizar y cuáles crear → **[Diseñar el modelo del CRM-lite](/practica/ip-app-014-modelo-crm-lite)**. Si dudas con la relación N:N, repasa → **[Tabla intermedia](/practica/ip-dv-004-tabla-intermedia)**.

**Construye en DEV, dentro de `SIT CRM Lite`** (los nombres internos llevarán `sit_`; en las apps y fórmulas usarás los nombres visibles):

1. **Account** (Cuenta) y **Contact** (Contacto): agrégalas a la solución con **Add existing** > **Table** (sin incluir todas sus columnas). En Account crea una columna Choice **Tipo de Cliente** (Estándar, Estratégico): la usará el flujo de aprobación.
2. **Oportunidad** (tabla nueva, propiedad *User or team* para que cada vendedor sea dueño de las suyas):

   | Columna (nombre visible) | Tipo | Notas |
   |---|---|---|
   | Nombre | columna principal | Ej. "Renovación de licencias ACME 2027" |
   | Cuenta | Lookup a Account | Required |
   | Monto Estimado | Currency | |
   | Probabilidad | Whole number | Mínimo 0, máximo 100 |
   | Monto Ponderado | Currency, calculada | `Monto Estimado * Probabilidad / 100` (calculated o formula, como en el Módulo 9) |
   | Etapa | Choice | Prospección, Calificación, Propuesta, Negociación, Ganada, Perdida · Default = Prospección |
   | Fecha de Cierre | Date only | |
   | Origen | Choice | Web, Referido, Campaña, Outbound |
   | Oportunidad Caliente | Yes/No | La llena una regla de negocio |
   | Estrategia Competitiva | Multiple lines of text | Opcional: protégela con seguridad a nivel de columna (Módulo 9) |

   El responsable de la oportunidad es su **Owner** (propietario): no crees un lookup aparte a Users.
3. **Propuesta** (tabla nueva): Oportunidad (Lookup a Oportunidad, Required), Versión (Whole number), Monto (Currency), Estado (Choice: Borrador, En Revisión, Aprobada, Rechazada · Default = Borrador), Enlace al Documento (URL), Comentarios del Aprobador (Multiple lines of text).
4. **Competidor** (tabla nueva, propiedad *Organization*, es un catálogo): Nombre, Sitio Web (URL), Fortalezas y Debilidades (Multiple lines of text). Relación **many-to-many** entre Oportunidad y Competidor.
5. En Oportunidad, una columna **rollup** `Número de Propuestas` que cuenta las Propuestas relacionadas (Módulo 9). Recuerda que un rollup no se actualiza al instante.
6. Reglas de negocio en Oportunidad, con **Scope = Entity** para que se cumplan también desde la Canvas App y los flujos, no solo en el formulario ([Learn: reglas de negocio](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-create-business-rule)):
   - Si **Etapa** es Ganada y **Fecha de Cierre** no tiene valor → **Show error message** en Fecha de Cierre: "Indica la fecha de cierre de una oportunidad ganada".
   - Si **Probabilidad** es mayor o igual que 80 → **Set column value** de Oportunidad Caliente = Yes; si no → No. (Mostrar u ocultar campos o marcarlos como obligatorios solo funciona con scope de formulario; por eso aquí se valida con un mensaje de error y una columna.)
   - **Activate** cada regla.
7. Crea 5 cuentas, 3 competidores y 10 oportunidades repartidas por etapas; al menos 2 a nombre de otro usuario (o cambia su **Owner**) para probar la RLS de la Fase 4.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Nombre lógico de la tabla Oportunidad y de su columna Etapa | ___ |
| Valor de Monto Ponderado de una oportunidad (con su Monto Estimado y Probabilidad) | ___ |
| Mensaje exacto que viste al guardar una oportunidad Ganada sin Fecha de Cierre | ___ |
| Valor de `Número de Propuestas` de una oportunidad con 2 propuestas, y cuánto tardó en verse | ___ |
| Por qué usaste una tabla propia `Competidor` en vez de la tabla Competitor de Microsoft (una frase) | ___ |

---

## 🧩 Microlección 2 — Fase 2: Model-Driven App para gerentes y Canvas App para vendedores (≈150 min)

**Qué vas a construir:** dos apps sobre el mismo dato, cada una para quien la usa.

**Ahora haz algo — micropráctica (3 min):** la pantalla Lista y el Kanban filtran muchas filas. Repasa qué se delega antes de escribir los filtros → **[Delegación](/practica/ip-app-003-delegation-awareness)**.

*Model-Driven App (gerentes, ≈45 min, Módulo 4):*

1. App `SIT CRM Gerencia` con Account, Contact, Oportunidad, Propuesta y Competidor.
2. En el formulario principal de Account, una subcuadrícula de Oportunidades y otra de Contactos (la "vista 360°"). En el de Oportunidad, una subcuadrícula de Propuestas y otra de Competidores.
3. Vista `Pipeline Abierto`: oportunidades cuya Etapa no es Ganada ni Perdida, ordenadas por Fecha de Cierre.

*Canvas App (vendedores, ≈105 min, Módulos 7 y 10):*

4. Importa los componentes de tu **SIT Component Library** (Módulo 10): `cmpHeader`, `cmpSearchBox` y `cmpStatCard`.
5. Pantallas: **Home** (tres `cmpStatCard`: Total pipeline, Oportunidades calientes, Tasa de cierre), **Lista** (galería `galOportunidades` + `cmpSearchBox` + filtro por Etapa), **Detalle** (formulario de edición), **Nueva** (formulario en modo nuevo) y **Kanban** (una galería por etapa abierta).
6. Kanban: la galería de la columna "Propuesta" y su botón para avanzar de etapa. Las fórmulas usan nombres visibles y la enumeración de la Choice, como en el Módulo 7:

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
   Si Power Apps Studio subraya alguna fórmula con el aviso de delegación, anótalo en la evidencia y decide si es aceptable para el volumen del negocio (20 vendedores).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Número de filas que muestra la vista `Pipeline Abierto` (y si coincide con tus datos) | ___ |
| Valores que muestran las tres `cmpStatCard` del Home | ___ |
| Fórmula que da aviso de delegación (si alguna) y tu decisión | ___ |
| Qué pasó en la galería de Negociación al pulsar `btnMoverSiguiente` | ___ |
| Comprobaste en la Model-Driven App que la Etapa cambió: nombre de la oportunidad y Etapa que ves allí | ___ |

---

## 🧩 Microlección 3 — Fase 3: aprobación de propuestas con Child Flow (≈120 min)

**Qué vas a construir:** la aprobación formal que reemplaza a WhatsApp, con un aprobador que depende del monto y del tipo de cliente.

**Ahora haz algo — microprácticas (8 min):** arma la lógica de umbrales → **[Aprobación por monto](/practica/ip-pa-002-aprobacion-por-monto)** y decide qué errores se reintentan y cuáles van al Catch → **[Retry vs Scope/Try-Catch](/practica/ip-pa-004-retry-scope-try-catch)**.

**Construye en DEV, dentro de `SIT CRM Lite`** (Módulo 11; crea los flujos desde la solución para que usen Connection References):

1. **Child Flow `SIT - Determinar Aprobador`** (**New** > **Automation** > **Cloud flow** > **Instant**): trigger **Manually trigger a flow** con entradas `Monto` (Number) y `TipoCliente` (Text); responde con **Respond to a Power App or flow** la salida `EmailAprobador` ([Learn: child flows](https://learn.microsoft.com/power-automate/create-child-flows)). Reglas: si `TipoCliente` es "Estratégico" → director; si no, monto < 10.000 → supervisor; < 100.000 → gerente; resto → director. Guarda los tres correos en **Environment Variables** (Módulo 16), no escritos en el flujo: en TEST serán otros. Si el Child Flow usa algún conector que no sea Dataverse ni una acción integrada, en su página de propiedades, tile **Run only users** > **Edit**, elige **Use this connection** para cada conexión: un Child Flow solo admite conexiones incrustadas.
2. **Flujo principal `SIT - Aprobar Propuesta`**: trigger de Dataverse **When a row is added, modified or deleted** sobre Propuesta, al modificar, con un filtro para que solo arranque cuando Estado pasa a En Revisión.
3. Obtén la Oportunidad y su Cuenta (para el Tipo de Cliente) y llama al Child Flow con **Run a Child Flow** (conector **Flows**, pestaña **Built-in**). Crea el flujo principal y el Child Flow en la misma solución: solo así aparece en la lista.
4. **Scope Try**: **Start and wait for an approval** al `EmailAprobador`. Si se aprueba, tres ramas paralelas: actualizar la Propuesta a Aprobada, crear una tarea (Task) de seguimiento relacionada con la Oportunidad y avisar al Owner por Teams o correo. Si se rechaza: Propuesta a Rechazada, guardar los comentarios del aprobador en Comentarios del Aprobador y avisar al Owner.
5. **Scope Catch** (Run after: failed, timed out): avisar al administrador con el mensaje de error del Try.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Correo que devolvió el Child Flow para una propuesta de 50.000 de un cliente Estándar, y para una de 5.000 de un cliente Estratégico | ___ |
| Duración de las tres ramas paralelas en el historial de ejecuciones | ___ |
| Estado y Comentarios del Aprobador de una propuesta rechazada | ___ |
| Qué forzaste para probar el Catch y qué mensaje de error recibió el administrador | ___ |

---

## 🧩 Microlección 4 — Fase 4: dashboard de pipeline con RLS (≈90 min)

**Qué vas a construir:** el informe para la gerencia, donde cada vendedor solo ve lo suyo.

**Construye** (Módulos 6 y 12):

1. En Power BI Desktop, **Get data** > **Dataverse** con el **Environment domain** de DEV. Carga Oportunidad, Account y la tabla de usuarios del sistema (**Users**, para la RLS).
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
6. RLS: rol `Vendedor` que filtra la tabla de usuarios por la columna de correo con `= USERPRINCIPALNAME()` y propaga el filtro a Oportunidades a través del propietario. Los nombres exactos de las columnas de propietario y de correo los ves en **Navigator**; anótalos. Prueba con **Modeling** > **View as** > **Other user** (Módulo 12). Publica y asigna el rol en el servicio.

**🔧 Diagnosticar antes de desplegar (5 min):** en la Fase 6 vas a mover el informe a TEST. Un compañero lo hizo y su dashboard de TEST muestra las oportunidades de DEV → **[Diagnosticar: el dashboard de TEST muestra datos de DEV](/practica/ip-trb-012-dashboard-test-con-datos-de-dev)**.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Valor de `Pipeline Total` sin RLS, y con **View as** como un vendedor concreto | ___ |
| Nombres exactos de la columna de propietario (en Oportunidades) y de correo (en Users) que usaste | ___ |
| Valor de `Tasa de Conversion` y cómo lo comprobaste a mano con tus datos | ___ |
| Workspace donde publicaste y a quién asignaste el rol `Vendedor` | ___ |

---

## 🧩 Microlección 5 — Fase 5: el bot del pipeline (≈60 min)

**Qué vas a construir:** el agente de la Microlección 3 del Módulo 15, ahora para vendedores: "¿cuánto tengo en pipeline?".

1. Agente `Asistente Comercial SIT` en DEV, dentro de `SIT CRM Lite`, con orquestación clásica y autenticación con Microsoft (la opción por defecto), para que el agente conozca al usuario.
2. Topic `Consultar Mi Pipeline` con 8 trigger phrases ("cuánto tengo en pipeline", "mis oportunidades", "cómo va mi mes"…).
3. Agent flow `SIT - Pipeline del Vendedor` (trigger **When an agent calls the flow**, entrada de texto `Email`): busca en Users la fila cuyo correo coincide, lista sus Oportunidades abiertas (Owner = ese usuario, Etapa distinta de Ganada y Perdida) y responde con **Respond to the agent**: total ponderado, cantidad y la de mayor monto. En el nodo **Action** pasa `System.User.Email` como `Email`.
4. Mensaje final con las tres variables, y una pregunta "¿Quieres ver el detalle de alguna oportunidad?" que, por ahora, puede redirigir a **Escalate** con el contacto del gerente.
5. Publica en Teams si tu licencia lo permite; si no, prueba en el panel **Test** y guarda una instantánea con **Save snapshot** (Módulo 15).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Valor de `System.User.Email` que vio el agente (panel **Variables**) | ___ |
| Respuesta del agente (total, cantidad, mayor oportunidad) y si coincide con `Pipeline Total` de Power BI para ese vendedor | ___ |
| Filtro exacto de **List rows** de Oportunidades en el historial del flujo | ___ |
| Dónde lo probaste (Teams o panel **Test**) | ___ |

---

## 🧩 Microlección 6 — Fase 6: ALM, despliegue a TEST y prueba de punta a punta (≈60 min)

**Qué vas a construir:** el paso de DEV a TEST como lo haría un equipo real (Módulo 16).

**Ahora haz algo — micropráctica (3 min):** antes de importar, repasa qué pasa cuando algo apunta al entorno equivocado → **[Entorno incorrecto](/practica/ip-trb-002-entorno-incorrecto)**.

1. Revisa que `SIT CRM Lite` contenga: las tablas (con Account y Contact solo con sus columnas y formularios nuevos), las dos apps, los flujos (principal y Child Flow), el agente y su agent flow, las Connection References y las Environment Variables.
2. Comprobador de soluciones: en **Solutions**, selecciona `SIT CRM Lite`, **…** > **Solution checker** > **Run**; al terminar, **View results** ([Learn: comprobador de soluciones](https://learn.microsoft.com/power-apps/maker/data-platform/use-powerapps-checker)). Corrige lo que marque como alto o crítico, o anota por qué lo aceptas.
3. Exporta: selecciona la solución > **Export** > **Publish** (publica todos los cambios) > **Next**; en **Version number** deja `1.0.0.0` y en **Export as** elige **Managed** > **Export** ([Learn: exportar soluciones](https://learn.microsoft.com/power-apps/maker/data-platform/export-solutions)).
4. Importa en TEST como en el Módulo 16, configurando las Connection References y poniendo los valores de TEST en las Environment Variables (los correos de aprobadores de TEST).
5. Power BI: en una copia del informe cambia el **Environment domain** de la consulta de Power Query al de TEST, actualiza las credenciales del origen de datos en el servicio y publícalo en un workspace de TEST.
6. **Prueba de punta a punta en TEST:** crear una oportunidad en la Canvas App → crear su propuesta y pasarla a En Revisión → aprobarla → verla en Power BI (tras actualizar el modelo semántico) → consultarla en el bot.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
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

### 🧪 Criterios de Validación del Proyecto Final
- [ ] Construí el modelo con Account y Contact nativas y Oportunidad, Propuesta y Competidor propias, con relaciones 1:N y N:N, una columna calculada y un rollup
- [ ] Mis reglas de negocio con scope **Entity** impiden guardar una oportunidad Ganada sin Fecha de Cierre, también desde la Canvas App
- [ ] La Canvas App usa la Component Library y tiene las 5 pantallas funcionando (Home, Lista, Detalle, Nueva, Kanban)
- [ ] La Model-Driven App muestra la vista 360° de una cuenta (oportunidades y contactos)
- [ ] El flujo de aprobación usa el Child Flow, tiene Try/Catch y 3 ramas paralelas, y funciona en TEST
- [ ] El dashboard de Power BI con RLS muestra a cada vendedor solo sus datos en Power BI Service
- [ ] El bot responde consultas de pipeline con datos reales de Dataverse (en Teams o en el panel **Test**)
- [ ] La solución se importó como Managed en TEST sin errores de dependencias, con Environment Variables propias de TEST
- [ ] End-to-end: crear oportunidad → aprobar propuesta → ver en Power BI → consultar en bot, con la hora de cada paso anotada

**Rúbrica de cierre:** evalúa este proyecto con las rúbricas *Low-code / Maker* y *Consultoría
Funcional* (seguridad y documentación) de [Rúbricas y Plantillas de
Evaluación](/recursos/rubricas-plantillas). Aprobación: ≥70/100 sin ningún criterio en 0. Nivel
profesional/excelencia: ≥88/100.

---

## Criterios de Graduación — Nivel 2

Para avanzar al Nivel 3, debes cumplir **todos** los siguientes criterios:

### Criterios Técnicos
- [ ] Modelo de datos Dataverse con relaciones complejas, rollup y field security
- [ ] Component Library publicada con al menos 3 componentes reutilizables
- [ ] Flujo de Power Automate con Try/Catch, Child Flow y ramas paralelas
- [ ] Dashboard Power BI con DAX avanzado (time intelligence, RLS, RANKX)
- [ ] PCF básico desplegado y funcional en formulario Model-Driven
- [ ] Conector personalizado importado desde OpenAPI y usado en flujo
- [ ] Copilot Studio con 5+ topics, entidades personalizadas e integración PA
- [ ] Solución con Connection References y Environment Variables desplegada en 3 ambientes

### Criterios de Calidad
- [ ] Ningún componente usa el prefijo `new_` — todos usan el prefijo del publisher
- [ ] Todos los flujos tienen manejo de errores (ningún flujo puede fallar silenciosamente)
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

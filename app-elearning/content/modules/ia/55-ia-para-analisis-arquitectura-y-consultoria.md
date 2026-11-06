---
moduleId: 55
title: "IA para Análisis de Soluciones, Arquitectura y Consultoría Funcional D365"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 20
practiceMinutes: 250
slug: "ia-para-analisis-arquitectura-y-consultoria"
lastVerified: "2026-11"
---
*Lectura: 18-20 min · Práctica: unas 4 horas la primera vez (algo más si el vocabulario de Dynamics 365 es nuevo para ti), mejor en dos o tres sesiones (la primera, Microlecciones 1 y 2; la segunda, la Microlección 3 con sus verificaciones en Learn; la tercera, la Microlección 4, el ADR y el reto de transferencia).*

### 🎯 Objetivo
Usar IA como acelerador en tres roles distintos de un proyecto Power Platform/D365 — desarrollo técnico (plugins, PCF, Custom APIs), consultoría funcional (Dynamics 365 Sales/Customer Service) y arquitectura de solución — manteniendo siempre al humano como responsable de la decisión final.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que obtuviste o verificaste). La Microlección 3 es una actividad de **fallo y corrección**: recibes un análisis Fit-Gap generado por IA con supuestos falsos sobre licencias, límites y funcionalidad de Dynamics 365, los detectas, los corriges y anotas contra qué página de Microsoft Learn lo verificaste. Cierras **decidiendo y defendiendo** un ADR y con un **reto de transferencia** sobre el diseño de arquitectura de otro cliente.
>
> **Antes de empezar, necesitas:**
> - Un asistente de IA (los de los Módulos 44 y 45 sirven) y acceso a [Microsoft Learn](https://learn.microsoft.com) para verificar.
> - **No necesitas un tenant con Dynamics 365.** Todo el módulo se puede hacer en papel: el Fit-Gap de la Microlección 3 viene escrito y se verifica en Learn. Si tienes un ambiente de prueba de Dynamics 365 Sales o Customer Service, úsalo para comprobar lo estándar con tus propios ojos.
> - La Microlección 1 usa la carpeta de solución desempaquetada del **Módulo 54**; si no la tienes, hay variante.
> - Este módulo es transversal: no exige ningún nivel de certificación. Si ya hiciste el Módulo 20 (Dynamics 365 CE), vas a reconocer las entidades estándar. Si términos como prospecto (*lead*), oportunidad o caso son nuevos para ti, una lectura previa opcional es el [Módulo 57](/nivel/d365/modulo/introduccion-dynamics-365-avanzado) (también transversal).

### 📖 Conceptos Clave
- **IA para análisis de soluciones exportadas:** un asistente de IA puede leer `customizations.xml`/`Solution.xml` desempaquetados y resumir componentes, detectar dependencias entre tablas, o señalar referencias hardcodeadas (ver Módulo 54) — pero no reemplaza que un humano confirme el resultado contra el conocimiento real del proyecto.
- **IA para desarrollo técnico:** aplicable a plugins de Dataverse (C#), Custom APIs, controles PCF (TypeScript/React), Power Fx, custom connectors y Azure Functions integradas vía Web API — el mismo principio del Módulo 45 (tarea acotada + revisión humana) aplica sin importar el lenguaje o componente.
- **IA para consultoría funcional D365:** convertir requerimientos de negocio en user stories, proponer configuración de Dynamics 365 Sales/Customer Service (no código), distinguir qué se resuelve con tablas/campos estándar vs. cuándo se justifica una tabla personalizada, y generar artefactos de consultoría (matriz de seguridad, casos UAT, checklist de go-live).
- **Sobrepersonalización (over-customization):** el riesgo de resolver con desarrollo a medida algo que la plataforma ya ofrece de forma estándar, aumentando el costo de mantenimiento y las actualizaciones futuras — un asistente de IA, si no se le pide explícitamente que evalúe alternativas estándar primero, tiende a proponer directamente una solución custom porque es el patrón más común en sus datos de entrenamiento.
- **Supuesto falso (en un análisis generado por IA):** una afirmación sobre licencias, límites o funcionalidad que suena razonable pero que la documentación contradice. Es el error más caro de un Fit-Gap, porque se convierte en presupuesto y en contrato. Regla de este módulo: toda afirmación de ese tipo lleva al lado la página de Learn que la confirma, o queda marcada como **por verificar**.
- **Arquitectura de solución con IA:** usar IA para explorar decisiones de diseño end-to-end (integración, seguridad, ALM, gobierno), documentarlas como ADRs (Architecture Decision Records), y contrastar propuestas contra los pilares de Well-Architected — sin delegarle la decisión final, que sigue siendo del arquitecto humano responsable ante el cliente.
- **Managed Environments, DLP y CoE:** el marco de gobierno de Power Platform (Data Loss Prevention policies, Managed Environments, Center of Excellence starter kit) que cualquier propuesta de arquitectura generada con IA debe respetar — un asistente de IA no conoce automáticamente las políticas DLP configuradas en tu tenant, hay que dárselas como contexto explícito.
- **Copilot dentro de Dynamics 365 no salta la seguridad:** Learn indica que Copilot respeta los permisos existentes y que sus respuestas se basan solo en datos a los que el usuario puede acceder ([Learn: FAQ de seguridad y privacidad de Copilot](https://learn.microsoft.com/dynamics365/faqs-copilot-data-security-privacy)). Un diseño que promete lo contrario tiene un supuesto falso.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Análisis técnico: dependencias y un Custom API

**¿Qué vas a aprender?** A usar la IA para leer una solución y proponer un esqueleto técnico, y a verificar una muestra de lo que dice antes de decidir nada.

**¿Por qué existe esto?** Un resumen de dependencias generado por IA es un buen punto de partida y una mala fuente de verdad: si una relación inventada entra al diseño, nadie la vuelve a mirar.

**Práctica (30 min):**

1. **Análisis técnico:** toma la carpeta de solución desempaquetada del Módulo 54 y pide a un asistente de IA que identifique todas las dependencias entre tablas (relaciones 1:N, N:N) a partir de los archivos XML — verifica manualmente al menos 2 de esas dependencias contra el modelo real. **Variante sin carpeta:** describe en texto tres tablas y dos relaciones que conozcas (por ejemplo, del curso) y pide a la IA el diagrama de dependencias; verifica que no agregó relaciones que no le diste.
2. **Desarrollo técnico — prompt completo:**
   ```
   Rol: arquitecto de Dataverse.
   Contexto: necesito un Custom API para calcular el descuento de una cotización según el volumen y la
   categoría del cliente.
   Tarea: propone el esqueleto: nombre del Custom API, parámetros de entrada/salida con tipo de dato,
   y si el plugin asociado debe ser síncrono o asíncrono y por qué.
   Formato de salida: tabla de parámetros + 3 líneas de justificación de síncrono/asíncrono.
   ```
   Revisa el resultado con la checklist del Módulo 48 antes de aceptarlo (si todavía no lo hiciste, usa estas cuatro preguntas: ¿el alcance es solo lo pedido?, ¿qué efectos secundarios tiene?, ¿qué riesgo de seguridad abre?, ¿cómo se probaría?).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Dos dependencias que dio la IA y si las confirmaste en el modelo real (sí/no, dónde) | ___ |
| ¿La IA inventó alguna relación o tabla? Cuál | ___ |
| Decisión síncrono/asíncrono de la IA y si la aceptas, con tu razón | ___ |

---

## 🧩 Microlección 2 — Consultoría funcional: lo estándar primero

**¿Qué vas a aprender?** A pedirle a la IA artefactos de consultoría que evalúen primero lo que Dynamics 365 ya trae, y a rechazar una propuesta sobrepersonalizada.

**¿Por qué existe esto?** El Caso Real de este módulo ocurrió por una sola omisión en el prompt. Cada tabla custom que duplica una estándar se paga en mantenimiento durante años.

**Ahora haz algo — micropráctica (6 min):** elige qué instrucciones poner en el prompt → **[Pedir un Fit-Gap que se pueda verificar](/practica/ip-ia-013-pedir-un-fit-gap-verificable)**.

**Práctica (40 min):**

1. **Consultoría funcional — prompt completo:**
   ```
   Rol: consultor funcional Dynamics 365 Sales.
   Contexto: "el equipo de ventas necesita registrar visitas a clientes con ubicación y notas".
   Tarea: (a) responde si esto se resuelve con la entidad estándar de actividades/citas de D365 Sales o
   requiere una tabla personalizada, evaluando la alternativa estándar primero; (b) redacta la user
   story en formato "Como [rol], quiero [acción], para [beneficio]".
   ```
2. **Matriz de seguridad — prompt completo:**
   ```
   Rol: arquitecto de seguridad Dataverse.
   Contexto: tabla Oportunidades, roles Vendedor y Gerente de Ventas.
   Tarea: genera una matriz crear/leer/escribir/eliminar por rol, aplicando mínimo privilegio (Módulo
   53) — el Vendedor no debería tener acceso de eliminar salvo justificación explícita.
   Formato de salida: tabla rol × permiso con una columna de justificación.
   ```
   Revisa si el resultado respeta el principio de **mínimo privilegio** antes de aceptarlo: cada rol recibe solo los permisos que su trabajo necesita, y cualquier permiso de más (por ejemplo, eliminar) lleva una justificación escrita.
3. **Recomendación arquitectónica con sobrepersonalización no justificada (recházala):** pide a un asistente de IA: `"El equipo de Customer Service quiere registrar una encuesta de satisfacción corta (1-5 estrellas + comentario) después de cerrar cada caso. Propón cómo implementarlo en Dynamics 365 Customer Service."` Es común que la IA proponga directamente una tabla personalizada completa con relaciones y un formulario custom, sin evaluar primero las alternativas: **Dynamics 365 Customer Voice**, que viene incluido con productos enterprise seleccionados de Dynamics 365 y trae una plantilla de Power Automate para enviar la encuesta cuando se resuelve un caso ([Learn: enviar una encuesta con Power Automate](https://learn.microsoft.com/dynamics365/customer-voice/send-survey-flow)), o, como mínimo, dos campos nuevos sobre la entidad de Caso si el alcance descrito basta. Rechaza la propuesta tal como vino, pide explícitamente que compare contra la alternativa estándar, y documenta en 3 líneas cuál de las dos recomendarías para este caso y por qué.
4. Para cada uno de los pasos anteriores, anota explícitamente si la IA propuso sobrepersonalización (una solución custom donde existía una alternativa estándar) y corrige la propuesta si es necesario.

**Evidencia a reportar:**

| Paso | ¿La IA evaluó primero lo estándar? (sí/no) | ¿Propuso algo custom innecesario? Qué | Tu corrección |
|---|---|---|---|
| Visitas a clientes | ___ | ___ | ___ |
| Matriz de seguridad | ___ | ___ | ___ |
| Encuesta tras cerrar el caso | ___ | ___ | ___ |

---

## 🧩 Microlección 3 — Fallo y corrección: el Fit-Gap con supuestos falsos

**¿Qué vas a aprender?** A verificar fila por fila un Fit-Gap generado por IA, detectar los supuestos falsos sobre licencias, límites y funcionalidad, corregirlos y dejar la fuente de cada corrección.

**¿Por qué existe esto?** Un Fit-Gap se convierte en estimación, en presupuesto y en contrato. Un "FIT" que en realidad es "FIT con condición" o un "GAP" que la plataforma ya resuelve cambia el costo del proyecto, y el responsable ante el cliente es el consultor, no la IA.

**El encargo.** Distribuciones Andinas implementará Dynamics 365 Sales Enterprise y Dynamics 365 Customer Service Enterprise. Volúmenes: unos 5,000 casos cerrados al mes, una carga nocturna desde el ERP de unas 200,000 actualizaciones en una ventana de 30 minutos y unos 300 clientes empresariales que quieren consultar sus casos. Un asistente de IA entregó este Fit-Gap:

| # | Requisito | Veredicto de la IA | Propuesta y justificación de la IA |
|---|---|---|---|
| 1 | Registrar visitas a clientes con fecha, hora, lugar y notas | GAP | Tabla personalizada `sit_visita` con formulario y vistas, porque Dynamics 365 no tiene un registro de visitas |
| 2 | Al calificar un prospecto, crear la cuenta, el contacto y la oportunidad | GAP | Un flujo de Power Automate que copie los campos del prospecto a los tres registros |
| 3 | Encuesta de satisfacción al resolver cada caso | FIT | Customer Voice, incluido con respuestas ilimitadas en las licencias enterprise |
| 4 | Carga nocturna desde el ERP | FIT | Un solo usuario de aplicación con muchas solicitudes en paralelo; los usuarios de aplicación no tienen límites de API |
| 5 | Los clientes consultan el estado de sus casos | GAP | Asignar a cada cliente una licencia de Customer Service y acceso a la app Model-Driven |
| 6 | Copilot resume para cada vendedor las oportunidades de todo el país, incluidas las que su rol no le deja ver | FIT | Copilot lee todo Dataverse, así que puede resumirlas |
| 7 | Ver en el registro del cliente los correos intercambiados | FIT | Actividad de correo electrónico estándar en la línea de tiempo |
| 8 | El vendedor no puede eliminar oportunidades | FIT | Rol de seguridad sin el privilegio de eliminar sobre Oportunidad |

**Práctica (90 min, en papel):** verificar 8 filas en varias páginas de Learn lleva tiempo, sobre todo si Dynamics 365 es nuevo para ti; puedes partirla en dos tandas de 4 filas.

1. **Primero, sin buscar nada:** marca al lado de cada fila si te parece correcta, dudosa o falsa. Esa primera impresión es parte de la evidencia: compárala al final con lo que verificaste.
2. **Verifica cada fila en Learn.** Para cada una, busca la página que la confirma o la contradice y anota la URL y su fecha de actualización. Páginas que te van a servir (no te dicen qué filas están mal):
   - [Activity table (Dataverse)](https://learn.microsoft.com/power-apps/developer/data-platform/activity-entities) y la referencia de la tabla [Appointment](https://learn.microsoft.com/power-apps/developer/data-platform/reference/entities/appointment).
   - [Qualify and convert a lead to opportunity](https://learn.microsoft.com/dynamics365/sales/qualify-lead-convert-opportunity-sales).
   - [Purchase Dynamics 365 Customer Voice](https://learn.microsoft.com/dynamics365/customer-voice/purchase) y [Send a survey by using Power Automate](https://learn.microsoft.com/dynamics365/customer-voice/send-survey-flow).
   - [Service protection API limits](https://learn.microsoft.com/power-apps/developer/data-platform/api-limits).
   - [Dynamics 365 templates para Power Pages](https://learn.microsoft.com/power-pages/templates/dynamics-365-apps/overview) y, para su licencia, la sección *Power Pages* de [Power Platform licensing FAQs](https://learn.microsoft.com/power-platform/admin/powerapps-flow-licensing-faq).
   - [FAQ de seguridad y privacidad de Copilot en Dynamics 365](https://learn.microsoft.com/dynamics365/faqs-copilot-data-security-privacy).
3. **Diagnosticar — micropráctica (7 min):** el equipo construyó la fila 4 tal como la escribió la IA y la integración empezó a fallar → **[Diagnosticar: la integración aprobada en el Fit-Gap devuelve 429](/practica/ip-ia-014-diagnosticar-integracion-con-429)**. Formula tu hipótesis antes de abrir las pistas.
4. **Corrige el Fit-Gap.** Para cada fila con un supuesto falso, escribe el veredicto correcto: **FIT**, **FIT con condición** (dices cuál) o **GAP**, y la propuesta corregida. Criterios de aceptación: (1) cada corrección tiene su URL de Learn; (2) ninguna fila corregida propone algo custom si Learn documenta una alternativa estándar que cubre el requisito; (3) las filas con números (encuestas, carga nocturna y también el portal: cuántos usuarios de los clientes iniciarían sesión cada mes) dicen qué número verificaste y qué implica para este cliente; (4) si un requisito choca con la seguridad (fila 6), lo marcas como requisito a renegociar con el cliente, no como FIT.
5. **Vuelve a la IA con la evidencia.** Pega tus correcciones y pide que rehaga solo esas filas citando la página de Learn de cada una. Anota si la nueva versión volvió a introducir algún supuesto sin fuente.

**Evidencia a reportar (una fila por requisito):**

| # | Primera impresión (correcta / dudosa / falsa) | ¿La IA acertó? | Qué está mal | Veredicto y propuesta corregidos | Fuente (URL de Learn + fecha) |
|---|---|---|---|---|---|
| 1 | ___ | ___ | ___ | ___ | ___ |
| 2 | ___ | ___ | ___ | ___ | ___ |
| 3 | ___ | ___ | ___ | ___ | ___ |
| 4 | ___ | ___ | ___ | ___ | ___ |
| 5 | ___ | ___ | ___ | ___ | ___ |
| 6 | ___ | ___ | ___ | ___ | ___ |
| 7 | ___ | ___ | ___ | ___ | ___ |
| 8 | ___ | ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Filas en las que tu primera impresión falló | ___ |
| Cuántas respuestas de encuesta al mes calculaste que necesita el cliente y qué implica | ___ |
| ¿La IA reintrodujo algún supuesto sin fuente en el paso 5? Cuál | ___ |

> **No todas las filas están mal**, y alguna está bien en la herramienta pero mal en la condición. Un "todo es GAP" o un "todo es FIT" no es una corrección: es otro supuesto. Pista para las filas con números: cuando una fila corregida propone una herramienta, pregúntate también **cómo se licencia** y con qué volumen del cliente se calcula ese costo.

---

## 🧩 Microlección 4 — Preparar una entrevista con tu propia evidencia

**¿Qué vas a aprender?** A usar la IA como entrevistador de práctica sin acabar repitiendo sus respuestas.

**Práctica (25 min):**

1. **Empleabilidad — prompt completo de preparación de entrevista técnica:**
   ```
   Rol: entrevistador técnico senior de Power Platform/Dynamics 365.
   Contexto: voy a entrevistarme para {{rol, ej. "Consultor Funcional D365 CE"}}. Mi evidencia incluye:
   {{lista de labs completados}}.
   Tarea: hazme 5 preguntas técnicas que un entrevistador real haría para ese rol, basadas en mi
   evidencia, y después de cada una dame el criterio de una buena respuesta (sin dármela completa,
   para que yo la practique primero).
   ```
   *Evalúa:* ¿las preguntas generadas son específicas a tu evidencia real, o genéricas de cualquier vacante? Nunca uses la respuesta que te dé la IA palabra por palabra en una entrevista real sin haberla entendido y practicado tú mismo.
2. Agrega a tu lista de evidencia el Fit-Gap corregido de la Microlección 3 y pide una pregunta sobre él. Respóndela en voz alta antes de leer el criterio.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| ¿Cuántas de las 5 preguntas eran específicas de tu evidencia? | ___ |
| La pregunta que peor respondiste y qué te faltó | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — el ADR de la integración

> **Situación:** para la carga nocturna de Distribuciones Andinas hay que decidir entre **Power Automate** y una **Azure Function** que llama a la Web API de Dataverse. Usa el prompt de abajo para obtener un borrador y después **decide tú**.
> **Entrega:** un ADR corto con Contexto, Decisión, Alternativas consideradas (mínimo 2) y Consecuencias (positivas y negativas), que tenga en cuenta lo que verificaste en la Microlección 3 sobre los límites de servicio.

```
Rol: Solution Architect documentando una decisión técnica.
Contexto: proyecto {{nombre}}. Decisión a tomar: ¿integración vía Power Automate o vía Azure
Function? Políticas del tenant: {{DLP relevante, restricciones de conectores}}.
Tarea: redacta un ADR corto con las secciones Contexto, Decisión, Alternativas consideradas (mínimo
2) y Consecuencias (positivas y negativas).
```

No hay una sola respuesta correcta: la evidencia es la decisión escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Diste el contexto real | El prompt incluyó volúmenes, ventana horaria y políticas DLP del tenant (o las marcaste como desconocidas), no solo "integración con ERP" |
| Cada afirmación técnica tiene fuente | Límites, licencias y capacidades del ADR llevan su página de Learn o quedan como "por verificar" |
| Las alternativas son reales | Comparas al menos dos opciones viables con sus costos de operación, no una opción y un hombre de paja |
| Las consecuencias incluyen lo negativo | Dices qué se complica con tu elección (operación, monitoreo, reintentos ante 429, mantenimiento) |
| La decisión es tuya | Explicas en qué cambiaste el borrador de la IA y por qué |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu decisión en una frase | ___ |
| Qué cambiaste del borrador de la IA y por qué | ___ |
| Afirmación del borrador que tuviste que verificar o quitar | ___ |

---

## 🔁 Reto de transferencia — El diseño de arquitectura de una aseguradora

Cambia el cliente y el artefacto: ya no es un Fit-Gap, es un diseño de arquitectura. Una aseguradora usará Dynamics 365 Customer Service para sus reclamos (unos 8,000 al mes). Una IA redactó el diseño con seis afirmaciones sobre portal, carga nocturna, encuestas, Copilot, agenda de inspecciones y plug-ins. Tienes que llevar al comité solo las que resisten la verificación.

1. **Micropráctica (9 min):** **[Transferir: el diseño de arquitectura de una aseguradora](/practica/ip-ia-015-transferir-arquitectura-aseguradora)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** para las afirmaciones que rechazaste, escribe la versión correcta con su fuente, y una pregunta que le harías al cliente antes de cerrar el diseño (por ejemplo, cuántos asegurados responderían la encuesta).

**Evidencia a reportar:**

| Afirmación rechazada | Qué dice Learn (cita corta + URL) | Versión correcta para el comité |
|---|---|---|
| ___ | ___ | ___ |
| ___ | ___ | ___ |
| ___ | ___ | ___ |

### 💼 Casos Reales de Negocio
Un consultor funcional de SIT le pidió a un asistente de IA "diseña cómo registrar las visitas de los vendedores a clientes" sin darle contexto de que Dynamics 365 Sales ya incluye la entidad estándar de citas/actividades. La IA propuso crear una tabla personalizada completa con relaciones, vistas y un formulario custom — una solución funcional, pero que duplicaba capacidades ya existentes y aumentaba el costo de mantenimiento futuro (actualizaciones de la tabla estándar no se heredarían). Al revisar la propuesta con la pregunta explícita "¿existe una alternativa estándar de D365 antes de crear algo custom?", el equipo identificó que las actividades estándar cubrían el 90% del caso, y solo se necesitó un campo personalizado adicional. La lección: **siempre pedirle a la IA que evalúe primero la alternativa estándar antes de proponer desarrollo a medida**.

### ✅ Buenas Prácticas
- Pedir explícitamente a la IA que evalúe alternativas estándar de la plataforma antes de proponer una solución personalizada, para reducir el riesgo de sobrepersonalización.
- Dar como contexto las políticas DLP, Managed Environments y restricciones de gobierno del tenant real antes de pedir una propuesta de arquitectura — la IA no las conoce por defecto.
- Usar IA para acelerar artefactos de consultoría (user stories, matriz de seguridad, casos UAT, ADRs) pero mantener siempre la revisión y aprobación humana antes de entregarlos al cliente.
- Verificar manualmente al menos una muestra de cualquier análisis de dependencias o relaciones que la IA genere sobre una solución real, antes de tomar decisiones basadas en ese análisis.
- Pedir que toda afirmación sobre licencias, límites o funcionalidad quede marcada como supuesto, con la página de Learn que la confirmaría, y verificarla antes de que entre al documento para el cliente.
- Dar a la IA los volúmenes reales (casos al mes, filas por noche, usuarios externos): los límites y las licencias solo se evalúan con números.
- Distinguir FIT de **FIT con condición**: la herramienta puede ser la correcta y el supuesto de capacidad, falso.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Aceptar una solución personalizada sin evaluar la alternativa estándar de D365 | No pedirle explícitamente a la IA que compare contra capacidades estándar | Preguntar siempre "¿existe una alternativa estándar antes de esto?" antes de aceptar una propuesta custom |
| Pedir una propuesta de arquitectura sin dar contexto de las políticas DLP/gobierno reales del tenant | Asumir que la IA conoce las restricciones del proyecto | Incluir explícitamente las políticas y restricciones relevantes en el prompt |
| Entregar al cliente un artefacto de consultoría (UAT, matriz de seguridad) generado por IA sin revisión | Confiar en que el resultado generado ya está listo para entrega | Revisar y ajustar todo artefacto de consultoría antes de compartirlo con el cliente |
| Confiar en un análisis de dependencias de la IA sin verificación manual | Tratar el resumen generado como fuente de verdad absoluta | Verificar manualmente al menos una muestra representativa del análisis |
| La integración nocturna falla con HTTP 429 | El análisis supuso que los usuarios de aplicación no tienen límites; Learn dice que Dataverse aplica los mismos límites a todos los usuarios | Diseñar con reintentos que respeten `Retry-After` y un ritmo que suba de forma gradual; marcar la fila como FIT con condición |
| Presupuestar encuestas "ilimitadas" | Supuesto falso sobre la capacidad incluida de Customer Voice | Verificar en Learn la capacidad incluida (2,000 respuestas al mes por tenant con productos enterprise seleccionados) y estimar si hace falta comprar más |
| Prometer que Copilot mostrará datos que el rol del usuario no ve | Suponer que Copilot lee todo Dataverse | Learn: Copilot responde solo con datos a los que el usuario tiene acceso; el requisito se renegocia o se resuelve con seguridad, no con Copilot |

### 🧪 Criterios de Validación
- [ ] Uso IA para identificar dependencias entre tablas de una solución y verifico manualmente el resultado
- [ ] Genero el esqueleto de un Custom API con IA y lo reviso con la checklist del Módulo 48
- [ ] Convierto un requerimiento de negocio en una user story y evalúo tabla estándar vs. personalizada
- [ ] Genero una matriz de seguridad básica y verifico que respeta el mínimo privilegio
- [ ] Identifico al menos un caso de sobrepersonalización propuesto por la IA y lo corrijo
- [ ] Rechacé la propuesta de sobrepersonalización de la encuesta tras cerrar el caso y justifiqué por escrito cuál alternativa recomendaría
- [ ] Verifiqué en Learn las 8 filas del Fit-Gap generado por IA, corregí las que tenían supuestos falsos y dejé la URL y la fecha de cada fuente
- [ ] Diagnostiqué la integración que devuelve 429 formulando una hipótesis antes de ver la causa
- [ ] Uso el prompt de preparación de entrevista técnica con mi propia evidencia de labs y practico las respuestas sin memorizar texto de la IA
- [ ] Redacto un ADR con IA dando contexto explícito de las políticas de gobierno del tenant y lo defendí contra la rúbrica
- [ ] En el reto de transferencia separé las afirmaciones del diseño que resisten la verificación de las que no, con su fuente
- [ ] Relaciono este módulo con el Lab 90 (Capstone Enterprise D365), el Lab 79 (simulación de entrevista técnica) y cualquier lab de arquitectura donde documente decisiones como ADR

### 📸 Evidencia para guardar
- Las tablas de evidencia de las cuatro microlecciones, del ADR y del reto de transferencia.
- El Fit-Gap corregido con sus fuentes y la segunda versión que pediste a la IA en el paso 5 de la Microlección 3.

> **Siguiente paso:** el [Lab 57](/labs/lab-57-diseno-solucion-d365-sales-con-ia) aplica "lo estándar primero" a una solución completa de Dynamics 365 Sales, y el [Lab 55](/labs/lab-55-uat-gonolive-y-auditoria-prompts) lleva estos artefactos a UAT y go-live.

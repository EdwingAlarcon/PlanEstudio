---
moduleId: 61
title: "Dynamics 365 Sales Avanzado — Forecasting, Pipeline y Sales Operations"
level: "d365"
certification: "Dynamics 365 Sales / MB-280 (retirado 31 jul 2026) — sucesor: AB-210 (Microsoft Certified: Dynamics 365 Sales AI Consultant Associate)"
estimatedMinutes: 22
practiceMinutes: 200
slug: "dynamics-365-sales-avanzado"
lastVerified: "2026-11"
---
*Lectura: 20-25 min · Con práctica: unos 200 min con trial, contando unos 20 min de registro del trial y la espera de la activación (unos 120 min en la ruta en papel), mejor en dos sesiones: la primera hasta el diagnóstico; la segunda, las Microlecciones 3 y 4 y el reto de transferencia. La primera vez, cuenta entre una vez y media y el doble.*

> **🧭 ¿Lead, oportunidad, cuenta y contacto todavía no son claros?** Este módulo asume ese vocabulario.
> Repasa primero [Fundamentos funcionales CRM](/recursos/fundamentos-crm) — 15 minutos, sin tenant.

> **🔗 Relación con el Módulo 20 (opcional):** si ya hiciste el Módulo 20 del Nivel Avanzado, ahí configuraste
> catálogo, BPF y cotización, y miraste el forecast **predeterminado** del mes. No es requisito: lo que este módulo
> necesita de ese vocabulario está resumido abajo. Aquí se profundiza en lo que el Módulo 20 no cubre: asignar
> forecast categories con criterio, **configurar** un forecast propio con jerarquía, periodos y cuota, diagnosticar un
> rollup que no cuadra, la pipeline review como ritual operativo (con ajustes y sus límites) y el gobierno del
> **Sales Qualification Agent** (AB-210).

### 🎯 Objetivo
Diseñar y operar un proceso avanzado de Dynamics 365 Sales que conecte lead-to-opportunity, catálogo de productos, pipeline review, forecasting y gobierno de datos comerciales, produciendo los mismos artefactos (matriz de forecast, política de pipeline hygiene, decisión de forecast category) que se te pediría entregar en un proyecto real — y diferenciando lo que puede practicarse con datos simulados de lo que requiere tenant, licencia de Dynamics 365 Sales y ambiente real.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el dato exacto que viste o decidiste, no un "sí, funcionó"). Después de la Microlección 2 vas a **diagnosticar** un forecast al que le falta una vendedora antes de ver la causa; la Microlección 4 es de **decidir y defender** (sin pasos, con rúbrica) y el módulo cierra con un **reto de transferencia** en otro negocio.
>
> **Antes de empezar — elige tu ruta (lee esto, ahorra una tarde):**
> - **Ruta con trial (recomendada si puedes):** un ambiente Developer **no** puede instalar apps de Dynamics 365 ([Learn: Developer Plan](https://learn.microsoft.com/power-platform/developer/plan)), así que necesitas un **trial de Dynamics 365 Sales**, de 30 días. Para pedirlo, Learn indica ir a la [página de Dynamics 365 Sales](https://www.microsoft.com/dynamics-365/products/sales) y seleccionar **Try for free**. (El enlace de trial que todavía muestran algunas páginas de Learn, `dynamics.microsoft.com/.../sales/free-trial/`, hoy redirige a la portada general de Dynamics 365.)
>   - **Cuenta:** el correo de una **cuenta de trabajo o estudio**. Si no tienes una, Learn propone crear antes una trial de Microsoft 365. El formulario puede pedir país, teléfono y **datos de tarjeta de crédito**: si no puedes darlos, sigue la ruta en papel ([Learn: registrarse en la trial](https://learn.microsoft.com/dynamics365/sales/sign-up-for-sales-trial)). Con un correo personal también funciona, pero no tendrás acceso al Power Platform admin center: no podrás extender el trial, añadir usuarios ni cambiar roles.
>   - **Dónde queda:** el trial crea **su propio** tenant con su propia URL. No se añade a tu ambiente del curso. Dura 30 días y se puede extender **una vez** otros 30. Solo puedes tener un trial activo por app ([Learn: preguntas frecuentes de la trial](https://learn.microsoft.com/dynamics365/sales/sales-trial-faq)).
>   - **Qué trae:** forecasting, **datos de ejemplo** (los de forecasting solo los ve quien se registró) y, según la región, las funciones de Sales Insights (Sales accelerator, predictive scoring) con capacidad mensual limitada. Los datos de ejemplo suman en el forecast: anota que están ahí, o quítalos desde la página **Resources** del trial (sección **More resources** → **Add or remove sample data** → **Remove sample data**). Si el registro te deja elegir el idioma, elige **English (United States)**: las etiquetas de este módulo están en inglés.
>   - **Primer paso dentro del trial:** se abre la app simplificada **Sales trial**, cuyo mapa del sitio no coincide con la documentación. Selecciona el enlace **Sales trial** arriba y elige **Sales Hub**: todos los pasos de este módulo son de Sales Hub.
>   - **Planificación:** cuenta unos 20 minutos para el registro y haz las Microlecciones 1 y 2 en la misma semana.
> - **Ruta en papel:** cada práctica tiene un recuadro **Sin trial** con la evidencia de diseño que sí puedes entregar (Excel o Markdown). No valida el rollup ni la cuota ejecutándose: anótalo así en tu evidencia.
> - **Qué requiere ambiente real sí o sí:** forecast configurado con jerarquía de ventas, usuarios con licencia Sales, productos y price lists activos, y seguridad por equipo o territorio. El forecasting **no** está disponible en dispositivos móviles ni en Government Community Cloud (GCC) ([Learn](https://learn.microsoft.com/dynamics365/sales/configure-forecast)).
> - **Escenario:** SIT (Servicios Integrados Tecnológicos S.A.), el mismo de los Labs 66 y 81, que vende licencias y servicios administrados a empresas medianas. Las cifras son ilustrativas.

### 📖 Conceptos Clave
- **Sales como proceso operativo, no solo CRM:** el valor aparece cuando Lead, Opportunity, Quote, Order y actividades de seguimiento tienen reglas claras de propiedad, etapa, probabilidad y forecast category — no cuando "el vendedor llena un formulario".
- **Copilot y agentes en Sales (certificación AB-210):** Microsoft reposicionó la certificación de Sales hacia **Microsoft Certified: Dynamics 365 Sales AI Consultant Associate** (examen AB-210), que evalúa, entre otras áreas, calificar y priorizar leads con IA y desplegar, gestionar y monitorear agentes en Sales. En noviembre de 2026, la página de Learn todavía presenta AB-210 como examen beta ([Learn: AB-210](https://learn.microsoft.com/credentials/certifications/d365-sales-ai-consultant-associate/)). Copilot genera resúmenes de cuenta y oportunidad y borradores de correo dentro del propio registro. El agente que califica leads se llama **Sales Qualification Agent** y tiene dos modos, de los que una organización solo puede desplegar uno: **Research-only mode** (investiga los leads asignados, redacta un correo y recomienda acciones, sin enviarlo) y **Research and engage mode** (además contacta al cliente de forma autónoma y entrega al vendedor los leads que cumplen los criterios de traspaso). Se puede pasar de Research-only a Research and engage, pero no al revés, y un agente configurado no se puede borrar sin soporte de Microsoft. Requiere licencia de Copilot Studio y server-side synchronization con Exchange: sin ella, el agente no genera correos de contacto ni interactúa con los leads. Además, el modo Research and engage necesita un buzón compartido ([Learn: configurar el Sales Qualification Agent](https://learn.microsoft.com/dynamics365/sales/configure-sales-qualification-agent)). Learn presenta el Sales Qualification Agent sin la etiqueta "(preview)" que sí llevan el Sales Close Agent y el Sales Opportunity Agent. Antes de crear cualquier agente de Sales hay que cumplir requisitos comunes: rol de administrador de Power Platform, **capacidad de Copilot Studio** (el agente la consume al investigar y redactar), aceptar el movimiento de datos entre regiones y activar AI prompts ([Learn: requisitos comunes de los agentes de Sales](https://learn.microsoft.com/dynamics365/sales/prerequisites-for-all-agents)). El rol del consultor no es configurar el modelo de IA — es decidir qué datos lo alimentan (calidad de los campos que Copilot lee), qué sugerencias se auditan antes de enviarse al cliente, y cuándo un lead calificado por el agente pasa a revisión humana antes de avanzar de etapa.
- **Pipeline review:** revisión periódica (semanal en la mayoría de equipos B2B) donde ventas y dirección inspeccionan oportunidades por etapa, fecha estimada de cierre, valor, riesgo, next step y cambios desde la revisión anterior. Una oportunidad que no cambió nada en 2 semanas es una señal de riesgo, no de estabilidad.
- **Forecasting — mecánica real:** Dynamics 365 Sales proyecta ingresos por jerarquía, periodo (mes/trimestre) y forecast category, con una grilla donde cada nivel de la jerarquía ve el rollup del nivel inferior. Un forecast se configura en **App Settings** → **Performance management** → **Forecast configuration** eligiendo una plantilla: **Org chart forecast** (jerarquía por el campo **Manager** del usuario), **Product forecast** (jerarquía de productos) o **Territory forecast** (jerarquía de territorios) ([Learn: plantillas](https://learn.microsoft.com/dynamics365/sales/select-template-forecast)). En el paso **General** se elige la **Rollup entity** (de dónde salen los montos: Opportunity por defecto), la **Hierarchy entity** (cómo se agrupan: User, Product o Territory), la relación entre ambas (en Org chart, *Opportunity > Owner (User) > User*), el **Top of hierarchy** y los periodos ([Learn: definir el modelo](https://learn.microsoft.com/dynamics365/sales/define-general-properties-scheduling-forecast)). Si no configuras nada, cada vendedor ve un forecast predeterminado del mes en curso que no se puede personalizar.
- **Columnas del forecast:** **Rollup** (suma el **Est. Revenue** de las oportunidades de una forecast category, filtradas por **Est. Close Date**), **Calculated** (fórmula entre columnas), **Simple** (datos que subes desde Excel, como la **Quota**) y **Hierarchy related** (atributos del usuario o territorio). Una columna puede permitir **ajustes** manuales (**Allow adjustments**) ([Learn: columnas](https://learn.microsoft.com/dynamics365/sales/choose-layout-and-columns-forecast)). En este curso puedes diseñar la estructura completa con datos simulados; validar el rollup y la cuota ejecutándose requiere tenant.
- **Forecast categories — con criterio de asignación:** `Pipeline` (valor por defecto: oportunidad temprana o estancada, confianza baja), `Best case` (avanza, hubo cotización o conversaciones de fondo, pero sin compromiso), `Committed` (el cliente se comprometió de palabra o por contrato; faltan papeles o aprobaciones finales), `Omitted` (excluida de todos los totales: en pausa o ajena al periodo) y `Won`/`Lost`. **Won y Lost no se eligen a mano:** se asignan solos al cerrar la oportunidad con **Close as Won** o **Close as Lost**; elegirlos manualmente puede sacar la oportunidad del forecast o descuadrar el rollup ([Learn: forecast category](https://learn.microsoft.com/dynamics365/sales/capture-forecast-category-opportunity)). La categoría NO se deriva automáticamente del stage — un vendedor puede tener una oportunidad en etapa "Negociación" y aun así marcarla `Best case` si el cliente no ha confirmado presupuesto.
- **Product catalog:** productos, price lists (una por región/segmento/moneda), unit groups (unidad base y conversiones) y discount lists (por volumen o por cliente). Si el proceso termina en F&O (Módulos 60 y 65), Sales no debe reinventar impuestos, disponibilidad real de inventario ni facturación fiscal — el price list de Sales es comercial, no fiscal.
- **Sales accelerator y señales:** secuencias (pasos sugeridos de seguimiento), prioridad calculada y actividades guiadas pueden mejorar la ejecución comercial del día a día, pero hay que configurarlas: no vienen activas por defecto. Con licencia **Sales Enterprise**, Sales accelerator cubre hasta 1,500 registros conectados a secuencias al mes y el predictive scoring hasta 1,500 registros al mes. **Sales Premium** quita esos topes ([Learn: capacidades de venta digital en Sales Enterprise](https://learn.microsoft.com/dynamics365/sales/digital-selling)), y el forecasting predictivo (columna **Prediction**) exige una licencia específica ([Learn: premium forecasting](https://learn.microsoft.com/dynamics365/sales/configure-premium-forecasting)).
- **Territories y ownership:** territorios geográficos o por segmento, equipos de venta y reglas de asignación reducen conflictos de ownership cuando dos vendedores atienden la misma cuenta. En proyectos enterprise se documentan ANTES de migrar oportunidades históricas, no después de la primera disputa de comisión.
- **Integración con Outlook/Teams:** mejora adopción (el vendedor registra actividad sin salir de su bandeja), pero no corrige mala calidad de pipeline; primero se definen etapas, campos obligatorios y cadencia de revisión, luego se activa la integración.
- **Requisitos reales de práctica:** diseñar etapas, matrices de forecast y políticas de higiene puede hacerse sin tenant (Excel o markdown). Configurar forecast real, jerarquía de ventas, product catalog con price lists y Sales Accelerator requiere Dynamics 365 Sales, usuarios con licencia y rol de administración comercial.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — Forecast category: dos preguntas distintas

**¿Qué vas a aprender?** A asignar la forecast category de cada oportunidad por la **confianza** del vendedor, separada de la etapa del proceso, y a cerrar oportunidades sin romper el forecast.

**¿Por qué existe esto?** El Caso Real de este módulo (pipeline inflado, todo en `Pipeline`, compromiso real en Excel) nace de mezclar dos preguntas: *"¿en qué paso del proceso está?"* (etapa) y *"¿qué tan seguro está el vendedor?"* (forecast category). La forecast category es la que decide en qué columna del forecast suma la oportunidad.

**Ejemplo pequeño — una fila bien y una mal:**

| Oportunidad | Etapa | Lo que se sabe | Forecast category | ¿Bien? |
|---|---|---|---|---|
| Renovación Contoso | Negociación | El cliente firmó la orden de compra; falta la aprobación de su área legal | Committed | Sí |
| Ampliación Litware | Negociación | Pidió descuento, pero no tiene presupuesto aprobado | Committed | No: es `Best case` |

**Ahora haz algo — micropráctica (6 min):** asigna la categoría de seis oportunidades de SIT y mira la consecuencia de cada decisión → **[Asignar forecast categories con criterio](/practica/ip-d365-016-asignar-forecast-category)**.

**Práctica (30 min):**

1. **Diseña el pipeline (papel, 10 min).** Define 5 etapas: Calificación, Descubrimiento, Propuesta, Negociación y Cierre. Para cada etapa escribe entrada, salida, campos obligatorios y criterio para avanzar. Añade una columna: *"forecast category mínima esperada"* (por ejemplo, nada en Calificación debería estar en Committed) — es una regla de higiene, no una derivación automática.
2. **Diseña 6 oportunidades simuladas** con valor, **Est. Close Date** dentro del mes en curso, probabilidad, forecast category y next step. Marca 2 como riesgosas (fecha vencida, sin next step con fecha, o stage inconsistente con forecast category) y escribe qué acción pedirías al vendedor en la pipeline review.
3. **En tu trial** (Sales Hub → **Opportunities**), crea las 6 oportunidades con la forecast category de tu diseño, siendo tú el owner. El campo **Forecast Category** está por defecto en el formulario **Opportunity** (si no lo ves, cambia de formulario arriba a la izquierda).
4. Cierra **una** de ellas como ganada con **Close as Won** (arriba en el formulario). Si tiene cotizaciones, ciérralas antes: Learn pide que todas las quotes de la pestaña **Quotes** estén **Closed** ([Learn: cerrar oportunidades](https://learn.microsoft.com/dynamics365/sales/close-opportunity-won-lost-sales)). Vuelve a abrirla y anota qué forecast category tiene ahora.
5. Marca otra como **Omitted** (por ejemplo, un cliente que pausó la compra hasta el año próximo).
6. En el mapa del sitio de Sales Hub, **Performance** → **Forecasts**. Abre el forecast predeterminado del mes (se llama, por ejemplo, *My FY2026 November forecast*) y anota los valores de **Committed**, **Best case**, **Pipeline**, **Won** y **Omitted** de tu usuario. Si dejaste los datos de ejemplo del trial, anota también que están incluidos. En este forecast, la **Quota** no la defines tú: sale de lo ganado el mes anterior ([Learn: ver forecasts](https://learn.microsoft.com/dynamics365/sales/view-forecasts)).

**Si no lo ves:** "la oportunidad no suma en ninguna columna" → revisa su **Est. Close Date** (fuera del mes no entra en el forecast predeterminado) y su owner. "Elegí Won en la lista y la oportunidad desapareció del forecast" → es exactamente lo que Learn advierte: vuelve a ponerla en su categoría real y ciérrala con **Close as Won**. "La categoría no pasó a Won al cerrarla" → Learn documenta que eso pasa si el proceso **Opportunity Forecast Category Mapping Process** está desactivado ([Learn: solución de problemas de forecasting](https://learn.microsoft.com/troubleshoot/dynamics-365/sales/troubleshoot-forecast-issues)); en un trial nuevo no debería ocurrir: anótalo como hallazgo.

> **Sin trial:** haz los pasos 1 y 2 y, en lugar de la grilla, escribe qué columna esperas que sume cada oportunidad (incluida la que cerrarías como ganada y la `Omitted`), y por qué `Won` no se elige a mano.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Regla "forecast category mínima por etapa" que más te costó decidir, y por qué | ___ |
| Las 2 oportunidades riesgosas y la acción que pedirías en la review | ___ |
| Forecast category de la oportunidad después de **Close as Won** (o la esperada, sin trial) | ___ |
| Valores de Committed / Best case / Pipeline / Won / Omitted en la grilla (o esperados) | ___ |
| ¿La oportunidad `Omitted` aparece en algún total? | ___ |

---

## 🧩 Microlección 2 — Configurar un forecast con jerarquía, periodos y cuota

**¿Qué vas a aprender?** A configurar un forecast propio (no el predeterminado) con la plantilla **Org chart forecast**, cargar la cuota desde Excel y leer el gap contra cuota.

**¿Por qué existe esto?** "Forecast sin jerarquía comercial" es el segundo error común de este módulo: un director solo ve el total de su equipo si el forecast sabe quién depende de quién. En la plantilla **Org chart forecast**, esa jerarquía sale del campo **Manager** de cada usuario, y el **Top of hierarchy** decide desde quién se mira ([Learn: definir el modelo](https://learn.microsoft.com/dynamics365/sales/define-general-properties-scheduling-forecast)). La cuota no se calcula: es una columna **Simple** que subes en un Excel después de activar el forecast ([Learn: activar y subir datos](https://learn.microsoft.com/dynamics365/sales/activate-upload-simple-columns-data-forecast)).

**Práctica real en tu trial de Sales (40 min):**

1. En **Sales Hub**, **Change area** (abajo a la izquierda) → **App Settings** → **Performance management** → **Forecast configuration**. Verás las plantillas y, posiblemente, un **Sample Forecast**: no lo uses para esta práctica.
2. Elige **Org chart forecast**. En el paso **General**: nombre `SIT Trimestre`; deja **Rollup entity** = **Opportunity** y **Hierarchy entity** = **User**; en **Rollup to hierarchy relationship** comprueba que dice *Opportunity > Owner (User) > User*; en **Top of hierarchy** elígete a ti. Mira la sección **Preview** a la derecha y **anota quién aparece**. En un trial con un solo usuario lo normal es que aparezcas solo tú.
3. En **Scheduling**: **Scheduling format** = **Gregorian**, **Forecast period** = **Quarterly**, el año fiscal en curso, **Start this forecast** = el trimestre actual y **Number of periods** = `2`. Debes agregar al menos un periodo para pasar al siguiente paso. **Next**.
4. En **Permissions**, deja los valores por defecto (tú eres el owner). **Next**.
5. En **Layout**, **Add from option set** → entidad **Opportunity** → option set **Forecast category** → **Choose selected** y, en el diálogo, **Auto-configure**. Verás columnas rollup por categoría y una columna **Quota** de tipo **Simple** añadida por defecto. Abre con el engranaje la columna **Committed** y anota su **Amount field** y su **Date field**. Activa **Allow adjustments** solo en una columna (por ejemplo **Best case**); lo usarás en la Microlección 3. Avanza hasta el último paso sin cambiar los ajustes avanzados.
6. En **Activate & add quotas**, **Activate forecast** (puede tardar unos minutos). Luego **Download simple data column template**: se descarga `SIT Trimestre_Simple.xlsx`. En la pestaña **Quota (Direct)**, escribe `180000` en tu fila para el trimestre actual (no toques **Record Id**; los montos van en la moneda base). Guarda, súbelo en **Upload quota and other static data for this forecast** y selecciona **Finish**.
7. Comprueba en **Forecast configuration** que los periodos de `SIT Trimestre` están en **Completed**. Después abre **Performance** → **Forecasts** y, en la lista desplegable de la izquierda, elige `SIT Trimestre`. Anota Quota, Committed, Best case y Pipeline. Learn advierte que los cambios en columnas simples y ajustes pueden tardar hasta **dos horas** en verse: si la cuota aún no aparece, sigue con la Microlección 3 y vuelve después. Un forecast configurado se recalcula cada 24 horas. Si cambias oportunidades fuera de la grilla, o el campo **Manager** de un usuario, usa **Recalculate data** ([Learn: ver forecasts](https://learn.microsoft.com/dynamics365/sales/view-forecasts)). Una organización puede tener hasta 50 forecasts, pero solo seis activos a la vez ([Learn: activar y subir datos](https://learn.microsoft.com/dynamics365/sales/activate-upload-simple-columns-data-forecast)).

**Si no lo ves:** "no aparece **App Settings**" → estás en la app **Sales trial**: cámbiate a **Sales Hub** con el enlace **Sales trial** de arriba. "No aparece **Forecast configuration** en **App Settings**" → Learn lo atribuye a que tu usuario no tiene lectura sobre la entidad de configuración de forecasts y propone asignar el rol **Forecast Manager** ([Learn: solución de problemas de forecasting](https://learn.microsoft.com/troubleshoot/dynamics-365/sales/troubleshoot-forecast-issues)). En el trial, revisa primero que entraste al ambiente del trial y no a tu ambiente del curso. "Las oportunidades de la Microlección 1 no suman" → su **Est. Close Date** está fuera de los dos trimestres configurados, o el forecast todavía no se recalculó: usa **Recalculate data**. "La columna sale en 0 para todos" → Learn lo atribuye a seguridad de campo sobre las columnas de **Selector**, **Amount field** o **Date field**: el usuario **# Dynamics 365 Sales Forecasting** necesita permiso de lectura.

> **Sin trial — construye y decide (25 min):** completa esta matriz de forecast de SIT (puedes usar Excel) y el campo de jerarquía que la produce:
>
> | Vendedor | Territorio | Cuota trimestre | Pipeline | Best Case | Committed | Won | Gap vs. cuota |
> |---|---|---|---|---|---|---|---|
> | Ana Rivera | LATAM Norte | $180,000 | $220,000 | $95,000 | $60,000 | $40,000 | -$80,000 |
> | Carlos Peña | LATAM Sur | $150,000 | $140,000 | $70,000 | $55,000 | $30,000 | -$65,000 |
> | Lucía Gómez | LATAM Norte | $200,000 | $310,000 | $120,000 | $150,000 | $20,000 | -$30,000 |
>
> (El gap de la tabla es *cuota − (Committed + Won)*: es una columna **Calculated** que tú definirías, no una que traiga el forecast.) Con estos datos, decide a cuál de los 3 vendedores pedirías una revisión 1:1 esta semana y justifica por qué (pista: el gap más grande no siempre es el caso más urgente — compara gap vs. Committed). Escribe también qué valor del campo **Manager** tendría que tener cada uno para que la directora comercial vea los tres en su rollup.
>
> Con trial, haz también este ejercicio de decisión: es el mismo razonamiento que harás en la pipeline review.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Quién aparece en **Preview** con tu **Top of hierarchy** (o el valor de **Manager** de Ana, Carlos y Lucía, sin trial) | ___ |
| **Amount field** y **Date field** de la columna Committed | ___ |
| Quota, Committed, Best case y Pipeline en tu grilla, y tu gap calculado a mano | ___ |
| Fórmula que usarías para una columna Calculated de gap | ___ |
| Vendedor al que pides el 1:1 y la comparación gap vs. Committed que lo justifica | ___ |

---

## 🔧 Diagnosticar — a la directora le falta una vendedora en el rollup

Antes de la Microlección 3, resuelve este caso empezando por el síntoma:

**[Diagnosticar: Lucía no aparece en el forecast de su directora](/practica/ip-d365-017-vendedora-fuera-del-rollup)**

Síntoma: la directora de LATAM Norte abre el forecast de su equipo y el total de Committed es $150,000 menor de lo que esperaba. Lucía Gómez ve sus oportunidades en su propio forecast, con fechas de cierre dentro del trimestre y bien categorizadas, pero no aparece bajo la directora. Formula tu hipótesis antes de ver la causa: ¿qué pieza de la configuración decide quién cuelga de quién?

---

## 🧩 Microlección 3 — Pipeline review: ajustar o corregir la oportunidad

**¿Qué vas a aprender?** A conducir una pipeline review con una política de higiene escrita, y a distinguir cuándo un ajuste en la grilla es legítimo y cuándo esconde un dato malo.

**¿Por qué existe esto?** El forecast permite **ajustes**: un vendedor o su manager cambian el valor de una celda (en columnas con **Allow adjustments**), con una nota; el ajuste sube por la jerarquía y queda en el historial, y se puede revertir con **Reset**. Un manager puede ajustar su forecast o el de sus reportes directos, nunca el de niveles por encima. Learn es explícito sobre el límite: si las oportunidades están desactualizadas, se actualizan las oportunidades, no se tapa el problema con un ajuste; si un negocio se cayó, se cierra como **Lost**, no se ajusta a cero ([Learn: ajustar valores](https://learn.microsoft.com/dynamics365/sales/adjust-values-in-forecast)).

**Práctica (35 min):**

1. **Política de pipeline hygiene (papel):** redacta las reglas de tu equipo: fecha de cierre no vencida, next step con fecha, contacto principal identificado, etapa coherente con probabilidad, y forecast category revisada semanalmente en la pipeline review. Añade una regla sobre ajustes: cuándo se permiten y qué debe decir la nota.
2. **Agenda de 30 minutos** para la review semanal: orden (primero las oportunidades que cambiaron de categoría, luego las vencidas, luego las grandes sin next step) y la pregunta que harías en cada bloque.
3. **En tu trial:** en el forecast `SIT Trimestre`, pasa el cursor sobre la celda **Best case** de tu fila, selecciona el lápiz y, en la pestaña **Adjustment**, ajusta el valor con una nota (*"el cliente confirmó verbalmente; falta actualizar la oportunidad"*) → **Adjust**. Abre la pestaña **History** y anota qué quedó registrado. Después, en vez de dejar el ajuste, **actualiza la oportunidad** que lo justifica y revierte el ajuste con **Reset** indicando el motivo.
4. **Entrevista (papel):** responde como Consultor Funcional de Dynamics 365 Sales: (a) "¿Cómo diferencias forecast category de stage de la oportunidad?"; (b) "¿Cuándo NO recomendarías activar Sales Accelerator?"; (c) "¿Por qué el catálogo de productos de Sales no debería calcular impuestos?".

**Si no lo ves:** "no aparece el lápiz" → la columna no tiene **Allow adjustments** (vuelve al paso **Layout** de la configuración; Learn no permite hacer ajustable a la vez una columna calculada y las columnas rollup que la forman). "Ajusté y no cambia el total" → los ajustes pueden tardar hasta dos horas en verse.

> **Sin trial:** haz los pasos 1, 2 y 4, y en lugar del paso 3 escribe dos situaciones: una en la que aceptarías un ajuste en la review y otra en la que exigirías corregir la oportunidad, con la regla de Learn que lo respalda.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Tu regla sobre ajustes (cuándo sí, cuándo no, qué dice la nota) | ___ |
| Qué registró la pestaña **History** tras el ajuste y tras el **Reset** (o "sin trial") | ___ |
| El dato de la oportunidad que corregiste en lugar de dejar el ajuste | ___ |
| Tus respuestas (a), (b) y (c), en una o dos frases cada una | ___ |

---

## 🧩 Microlección 4 — El Sales Qualification Agent: decidir y defender (sin pasos)

**¿Qué vas a aprender?** A decidir cuánta autonomía dar a un agente que califica leads, con criterios explícitos, cuando todas las opciones pueden funcionar.

**¿Por qué existe esto?** El agente no es un interruptor de "IA sí o no": la elección del modo es casi irreversible (de Research-only se puede subir a Research and engage, pero no bajar, y el agente no se borra sin soporte), el modo que contacta al cliente necesita server-side synchronization y criterios de traspaso, y todo lo que el agente lee sale de la calidad de tus datos ([Learn](https://learn.microsoft.com/dynamics365/sales/configure-sales-qualification-agent)). Esta microlección **no** te pide configurarlo: requiere licencia de Copilot Studio y un buzón compartido, y no hace falta para decidir.

**🏗️ Reto (sin pasos): elige el modo para SIT y defiéndelo.**

> **Restricciones:** SIT recibe unos 400 leads web al mes; el 60 % no tiene empresa ni cargo; dos vendedores atienden LATAM Norte y llevan tres semanas sin dar seguimiento a los leads nuevos; Legal exige que ningún correo comercial en nombre de SIT salga sin que un humano conozca su contenido; Dirección quiere pipeline nuevo antes de fin de trimestre.
> **Escribe:** el modo elegido (**Research-only mode** o **Research and engage mode**) o "todavía ninguno", qué limpieza de datos haces antes, qué criterio decide que un lead pasa al vendedor, quién revisa lo que el agente redacta, y qué medirías en el primer mes.

Contrasta tu decisión con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Descartas por restricción, no por gusto | La opción descartada tiene escrita la restricción que viola (Legal, irreversibilidad, datos incompletos) |
| La afirmación técnica está respaldada | Lo que dices de los modos, la irreversibilidad y los requisitos tiene su enlace de Learn |
| Los datos van primero | Dices qué campos del lead se completan o normalizan antes de que el agente los lea |
| Hay un humano en el punto correcto | Nombras quién revisa los correos y en qué momento un lead pasa a revisión humana |
| La medida del piloto es concreta | Dos métricas con valor esperado (por ejemplo, leads traspasados por semana y % rechazados por el vendedor) |

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Modo elegido (o "ninguno todavía") y la restricción que descarta la alternativa | ___ |
| Limpieza de datos previa | ___ |
| Criterio de traspaso al vendedor y quién revisa lo que redacta el agente | ___ |
| Las dos métricas del primer mes | ___ |

---

## 🔁 Reto de transferencia — Un distribuidor de insumos agrícolas

El mismo razonamiento en otro negocio. Un **distribuidor de insumos agrícolas** vende semillas y fertilizantes a cooperativas en 4 regiones. La dirección no pregunta "¿cuánto vende cada vendedor?", sino "¿cuánto vamos a vender **de cada línea de producto** por temporada?". Las regiones cambian de vendedor cada año, la cuota se fija por región y por línea, y en temporada de lluvias muchas oportunidades se congelan dos meses.

**[Transferir: forecast para un distribuidor de insumos agrícolas](/practica/ip-d365-018-forecast-insumos-agricolas)** — decide la plantilla, la entidad de rollup, cómo tratar las oportunidades congeladas y dónde va la cuota. Si solo memorizaste "Org chart + Opportunity", este reto te lo va a mostrar.

Sin guía paso a paso, cierra el reto con una nota de diseño de media página (Contexto, Opciones, Decisión, Consecuencias).

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Plantilla y entidad de rollup elegidas, y por qué no Org chart | ___ |
| Qué haces con las oportunidades congeladas por la temporada de lluvias | ___ |
| Cómo cargas la cuota por región o línea | ___ |
| Qué pasaría con el forecast si se usara la jerarquía de usuarios y la región cambia de vendedor | ___ |

---

### 💼 Casos Reales de Negocio
Una empresa B2B reportaba forecast con hojas de cálculo desconectadas de Dynamics 365 Sales. El CRM tenía oportunidades, pero los vendedores actualizaban el compromiso real solo en Excel porque nadie les exigía usar forecast category. Dirección veía un pipeline inflado (todo en `Pipeline`, nada en `Committed`) y Finanzas no podía anticipar ingresos con esa información. La corrección fue definir forecast categories obligatorias por etapa mínima, cadencia semanal de pipeline review, reglas de fecha de cierre y un dashboard único en Sales — nadie volvió a mirar Excel. El cambio no fue "agregar más campos"; fue gobernar el comportamiento comercial con las herramientas que ya existían.

### ✅ Buenas Prácticas
- Separar stage operativo de forecast category: una oportunidad en Negociación no siempre está Committed — son dos preguntas distintas ("¿en qué paso del proceso está?" vs. "¿qué tan seguro está el vendedor?").
- Cerrar oportunidades con **Close as Won** / **Close as Lost** y nunca elegir `Won` o `Lost` a mano en la forecast category.
- Definir forecast por periodo y jerarquía antes de construir dashboards ejecutivos sobre esos datos, y comprobar en **Preview** que la jerarquía es la que esperas antes de activar.
- Usar los ajustes del forecast para conocimiento que aún no está en el sistema, con nota; si el dato de la oportunidad está mal, corregir la oportunidad.
- Mantener productos y listas de precios simples si F&O será el sistema de cumplimiento/facturación — evitar duplicar lógica fiscal en Sales (ver Módulo 60).
- Documentar reglas de ownership, territorio y reasignación antes de migrar oportunidades históricas a una nueva estructura de territorios.
- Indicar en el diseño qué capacidades dependen de la licencia (Sales accelerator y predictive scoring tienen tope mensual con Sales Enterprise y no lo tienen con Sales Premium, y el forecasting predictivo exige una licencia específica) y cuáles pueden simularse para práctica sin tenant.
- Decidir el modo del Sales Qualification Agent después de limpiar los datos de leads y de acordar con Legal quién revisa lo que se envía.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Usar probabilidad de etapa como forecast real | Se confunde avance de etapa con compromiso comercial | Usar forecast categories explícitas y revisión semanal en pipeline review |
| Forecast sin jerarquía comercial | No se modelaron managers/equipos antes de activar forecast | Definir la jerarquía (campo **Manager** en Org chart) y comprobarla en **Preview** antes de activar, y subir la cuota (columna **Simple**, plantilla de Excel) justo después de activar: la plantilla solo se descarga con el forecast activo |
| Una vendedora no aparece en el rollup de su directora | En Org chart, su usuario no tiene como **Manager** a alguien bajo el **Top of hierarchy** | Corregir el campo **Manager**, comprobarlo en **Preview** y recalcular el forecast |
| Oportunidad desaparece del forecast tras marcarla `Won` | Se eligió `Won` a mano en la forecast category | Cerrarla con **Close as Won**: la categoría se actualiza sola |
| Ajustes que esconden datos viejos | Se ajusta la grilla en lugar de actualizar o cerrar la oportunidad | Corregir la oportunidad; si se cayó, cerrarla como **Lost** |
| Catálogo de productos duplicando lógica de F&O | Ventas intenta resolver impuestos o disponibilidad real de inventario | Dejar precio comercial en Sales y cumplimiento/factura en F&O (Módulo 65) |
| Pipeline con fechas de cierre vencidas sin revisión | No existe política de higiene de pipeline | Dashboard de aging y regla de revisión obligatoria por oportunidad vencida |

### 🧪 Criterios de Validación
- [ ] Diseñé etapas de pipeline con entradas, salidas, campos obligatorios y forecast category mínima esperada
- [ ] Asigné forecast categories a 6 oportunidades con criterio de confianza, cerré una con **Close as Won** (o expliqué por qué Won no se elige a mano) y marqué una como Omitted
- [ ] (Trial) Configuré y activé un forecast **Org chart** con periodos trimestrales, columnas por Forecast category y cuota subida desde Excel; o, sin trial, completé la matriz de forecast con su columna de gap
- [ ] Decidí a qué vendedor dar seguimiento comparando gap vs. Committed, con justificación
- [ ] Resolví el diagnóstico de la vendedora fuera del rollup
- [ ] Definí una política de pipeline hygiene con una regla sobre ajustes, y (con trial) hice y revertí un ajuste corrigiendo la oportunidad
- [ ] Respondí 3 preguntas de entrevista/consultoría sobre forecast category, Sales Accelerator y catálogo de productos
- [ ] Decidí y defendí el modo del Sales Qualification Agent para SIT contra la rúbrica
- [ ] Identifiqué qué partes requieren tenant/licencia Dynamics 365 Sales
- [ ] Resolví el reto de transferencia del distribuidor de insumos agrícolas
- [ ] Relacioné este módulo con el Lab 66 (proceso lead-to-cash) y el Lab 81 (forecasting y pipeline review)

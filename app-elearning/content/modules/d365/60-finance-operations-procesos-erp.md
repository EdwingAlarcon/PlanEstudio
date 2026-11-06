---
moduleId: 60
title: "F&O Awareness — Procesos ERP, Seguridad e Integración con CE"
level: "d365"
certification: "Finance & Operations awareness"
estimatedMinutes: 20
practiceMinutes: 190
slug: "finance-operations-procesos-erp"
lastVerified: "2026-11"
---
*Lectura: 18-20 min · Práctica: unas 3 horas la primera vez, mejor en dos sesiones (la primera, Microlecciones 1 y 2; la segunda, Microlecciones 3 y 4, la decisión defendida y el reto de transferencia).*

### 🎯 Objetivo
Nombrar y reconocer los procesos ERP estándar de Dynamics 365 Finance & Operations (order-to-cash, procure-to-pay, record-to-report, inventory-to-deliver, project-to-profit) y las opciones técnicas de integración con Dataverse (dual-write, Data Management Framework, virtual tables), para poder participar en una conversación de arquitectura F&O sin depender solo de "es un ERP" como respuesta.

> **Cómo está organizado este módulo:** cada microlección trae un concepto breve, una micropráctica con feedback inmediato y una práctica con **evidencia** (el mapa, la tabla o la decisión que escribiste). Cierras **decidiendo y defendiendo** la integración de un cliente y con un **reto de transferencia** en otra industria.
>
> **Antes de empezar, necesitas:**
> - **No necesitas un ambiente de Finance & Operations.** Casi nadie tiene uno: F&O no se instala en un ambiente Developer de Power Platform y sus ambientes de prueba o demo los suele dar una organización o un partner. Todo el núcleo del módulo es **en papel**: mapas de proceso, decisiones con rúbrica y matrices. Si tienes acceso a un ambiente de prueba o demo de F&O, los [Labs 93 a 100](/labs/lab-95-fo-order-to-cash-hands-on) recorren las pantallas reales; este módulo no las repite.
> - Una hoja de cálculo o un documento para tus tablas de evidencia, y acceso a [Microsoft Learn](https://learn.microsoft.com) para verificar.
> - Este módulo es transversal: no exige ningún nivel de certificación. Si ya hiciste el Módulo 20 (Dynamics 365 CE) o el [Lab 66](/labs/lab-66-sales-lead-to-cash) (lead-to-cash de Sales), vas a reconocer el lado CRM del proceso; si no, una lectura previa opcional es el [Módulo 57](/nivel/d365/modulo/introduccion-dynamics-365-avanzado). La operación técnica de dual-write y DMF se profundiza en el [Módulo 65](/nivel/d365/modulo/integracion-ce-fo-dual-write-dmf).

### 📖 Conceptos Clave
- **Los 4 productos de Finance & Operations, en una frase cada uno:**
  - **Dynamics 365 Finance:** contabilidad general, cuentas por pagar/cobrar, activos fijos, presupuestos y consolidación financiera multi-entidad legal.
  - **Supply Chain Management (SCM):** planificación de demanda, compras, inventario, almacenes, manufactura y transporte.
  - **Commerce:** punto de venta (POS), comercio electrónico B2B/B2C y gestión de canales de venta minorista, integrado con Finance/SCM para inventario y precios.
  - **Project Operations:** planificación, ejecución y facturación de proyectos basados en tiempo y materiales o precio fijo, con reconocimiento de ingresos.
- **Los procesos ERP estándar — vocabulario que un arquitecto D365 CE debe reconocer.** Microsoft publica un **business process catalog** con más de una docena de escenarios end-to-end; estos son los que más cruzan con CE ([Learn: What are the end-to-end scenarios](https://learn.microsoft.com/dynamics365/guidance/business-processes/overview)):
  - **Order-to-cash (O2C):** desde que un cliente hace un pedido hasta que la empresa cobra. En el catálogo agrupa políticas de venta, gestión de pedidos de venta, cuentas por cobrar, crédito y cobranza, y análisis de ventas. Es la contraparte ERP del lead-to-cash de Sales: Sales cierra la venta (Quote→Order), pero el cumplimiento, la factura real, el impuesto y el cobro viven en F&O. Su proceso previo en el catálogo es **Prospect to quote** (el lado CRM).
  - **Procure-to-pay (P2P):** desde que se genera una necesidad de compra hasta que se paga al proveedor — requisición → orden de compra → recepción de mercancía → factura de proveedor → pago. **El catálogo de Microsoft lo llama *Source to pay***; en conversaciones y en este curso vas a oír los dos nombres para lo mismo.
  - **Record-to-report (R2R):** el ciclo contable — registrar transacciones financieras, conciliar cuentas, cerrar el periodo y producir reportes financieros y regulatorios.
  - **Inventory-to-deliver (I2D):** gestión de inventario desde la recepción hasta la entrega — control de stock, picking, packing, envío y confirmación de entrega. En el catálogo, **picking, packing y envío de un pedido de venta son Inventory to deliver**, aguas abajo de Order to cash.
  - **Project-to-profit (distinto del procure-to-pay):** desde la planificación de un proyecto hasta medir su rentabilidad — presupuesto, ejecución, facturación y reconocimiento de ingresos (dominio de Project Operations).
- **Por qué importa el nombre exacto:** decir "el sistema factura" es ambiguo — un Solution Architect que sabe que la facturación real vive en el ciclo order-to-cash de F&O (no en Dynamics 365 Sales) evita la sobrepersonalización de construir lógica de facturación en Dataverse cuando F&O ya la resuelve.
- **Virtual tables (Dataverse):** exponen entidades de F&O en Dataverse **sin copiar el dato**: el dato sigue viviendo en F&O y cada operación se ejecuta contra F&O en ese momento. **No son de solo lectura:** Learn indica que permiten create, read, update y delete (CRUD) desde Dataverse y Power Platform, y que al invocar la entidad de F&O también se ejecuta su lógica de negocio ([Learn: Virtual entities overview](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/power-platform/virtual-entities-overview)). Las entidades de F&O aparecen en Dataverse con el prefijo `mserp_`. **Seguridad:** la consulta se ejecuta en el contexto del **usuario de F&O** asociado al usuario de Dataverse que la invoca; el usuario SYSTEM de Dataverse no tiene acceso a todas las entidades de F&O, y un plug-in que lea una virtual table con un contexto equivocado falla con mensajes como `Unable to determine the user in CDS`.
- **Dual-write:** integración **acoplada, casi en tiempo real y bidireccional** entre F&O y Dataverse: un cambio en un lado escribe en el otro, así que el dato **sí se copia** ([Learn: Dual-write overview](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/data-entities/dual-write/dual-write-overview)). Al instalarlo, Dataverse recibe conceptos nuevos como *company* y *party*; los equipos de CE tienen que conocer esos cambios de esquema antes de diseñar.
- **Data Management Framework (DMF):** el marco de F&O para **migración de datos**, **copiar configuración** entre compañías o ambientes e integración por lotes, con proyectos de datos, trabajos programables y paquetes ([Learn: Data management overview](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/data-entities/data-entities-data-packages)).
- **Cómo elegir entre dual-write, DMF y virtual tables — criterio de decisión:**
  - ¿El proceso necesita que el dato **exista en los dos sistemas** y se mantenga sincronizado con continuidad operativa (ej. un cliente creado en Sales debe existir también en F&O)? → **Dual-write**.
  - ¿Es una **carga masiva o migración** puntual, o copiar configuración, no una sincronización continua? → **Data Management Framework**.
  - ¿Basta con **trabajar sobre el dato de F&O desde una app de Power Platform sin duplicarlo** (por ejemplo, ver el saldo de inventario, que cambia a cada minuto)? → **Virtual tables**. Que permitan escribir no las convierte en sincronización: el dato no existe en Dataverse.
  - ¿Es para **analítica** a gran escala, no para una app transaccional? → Azure Synapse Link for Dataverse o Link to Microsoft Fabric con las tablas de F&O ([Learn](https://learn.microsoft.com/power-apps/maker/data-platform/azure-synapse-link-select-fno-data)), ninguna de las tres anteriores.
- **Mapa de proceso — Order-to-Cash (O2C):** (1) Cliente → validado en `CustomersV3`, con límite de crédito revisado; (2) Pedido de venta (`Sales order`) creado con producto, cantidad y precio de lista; (3) Verificación de disponibilidad de inventario (ATP — Available to Promise) contra el almacén asignado; (4) Picking y packing (preparación física del pedido, fuera del alcance de CE; en el catálogo, Inventory to deliver); (5) Envío y confirmación de entrega; (6) Facturación (`Free text invoice` o factura generada desde el pedido); (7) Cobro y aplicación del pago contra la factura abierta. Lo que vive en **Sales (CRM)**: pasos previos a la orden (Lead, Oportunidad, Quote). Lo que vive en **F&O (ERP)**: desde que la Quote se confirma como pedido de venta en adelante — disponibilidad real de inventario, picking, factura fiscal y cobro.
- **Mapa de proceso — Procure-to-Pay (P2P):** (1) Requisición de compra (`Purchase requisition`) generada por necesidad interna, con aprobación según política de gasto; (2) Orden de compra (`Purchase order`) emitida al proveedor con condiciones comerciales; (3) Recepción de mercancía (`Product receipt`) que actualiza el inventario físico; (4) Factura de proveedor (`Vendor invoice`) contrastada contra la orden de compra y la recepción (three-way match: OC-recepción-factura); (5) Pago al proveedor según términos de crédito pactados. Relación con inventario: la recepción incrementa el stock disponible antes de que llegue la factura. Relación con finanzas: el pago solo se libera si el three-way match no tiene discrepancias.
- **Mapa de proceso — Record-to-Report (R2R):** (1) Definición del plan de cuentas (`Chart of accounts`) y las dimensiones financieras (ej. centro de costo, departamento, proyecto) que clasifican cada transacción; (2) Registro de asientos contables (`General journal`) generados automáticamente por O2C/P2P/I2D o manualmente por ajustes; (3) Conciliación de cuentas (bancos, clientes, proveedores) antes del cierre; (4) Cierre de periodo, que bloquea nuevas transacciones sobre el periodo cerrado; (5) Generación de reportes financieros y regulatorios (balance general, estado de resultados) a partir de las dimensiones financieras definidas en el paso 1.
- **Mapa de proceso — Inventory-to-Deliver (I2D):** (1) Producto (`Released product`) dado de alta con su unidad de medida y método de costeo; (2) Inventario recibido y almacenado en un almacén (`Warehouse`) con ubicación específica; (3) Movimientos de inventario (transferencias entre almacenes, ajustes por conteo cíclico); (4) Verificación de disponibilidad (ATP) al momento de comprometer inventario a un pedido de venta; (5) Entrega física y confirmación de despacho. Relación con Supply Chain: I2D es el proceso operativo que sostiene tanto O2C (inventario disponible para vender) como P2P (inventario recibido de proveedores).
- **Mapa de proceso — Project-to-Profit:** (1) Proyecto (`Project`) creado con estructura de tareas (WBS) y presupuesto aprobado; (2) Asignación de recursos (consultores, horas estimadas) y registro de costos reales (horas trabajadas, gastos); (3) Facturación del proyecto según el método pactado (tiempo y materiales, o precio fijo por hito); (4) Reconocimiento de ingresos conforme al avance o a los hitos facturados; (5) Análisis de rentabilidad — margen real vs. presupuestado, dominio específico de Project Operations. Relación con Project Operations: este proceso completo (planificación → costos → facturación → rentabilidad) es exactamente el alcance de ese producto.
- **Consideraciones de licenciamiento:** las apps de F&O (Finance, SCM, Commerce, Project Operations) se licencian como productos propios, distintos de las apps de CE (Sales, Customer Service, Field Service) — un proyecto que combina CE y F&O casi siempre involucra dos conversaciones de licenciamiento con el cliente, no una sola. Los precios y combinaciones cambian: verifícalos en la guía de licenciamiento vigente de Microsoft antes de ponerlos en una propuesta.
- **Consideraciones de seguridad:** F&O tiene su propio modelo jerárquico: **roles** que agrupan **duties** (partes de un proceso de negocio, como *Maintain bank transactions*), que agrupan **privileges** (tareas, como *Cancel payments*), que agrupan **permissions** sobre objetos. Learn recomienda asignar duties a los roles, no privileges sueltos, y separar duties relacionados en roles distintos (**segregation of duties**) para cumplir regulaciones como SOX y reducir el riesgo de fraude ([Learn: Role-based security](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/sysadmin/role-based-security)). Es distinto del modelo de Security Roles de Dataverse: al diseñar la integración, hay que mapear explícitamente qué rol de F&O corresponde a qué rol de Dataverse, no asumir que son equivalentes.
- **Riesgo de sobrepersonalización específico de F&O:** construir en Dataverse una réplica de lógica que F&O ya resuelve (cálculo de impuestos, validación de crédito, costeo de inventario) es el error de arquitectura más costoso en proyectos CE+F&O — esa lógica depende de configuración fiscal y contable que cambia por país y por regulación, y F&O ya la mantiene actualizada.
- **Legal entities y dimensiones financieras:** F&O organiza operación financiera por entidades legales, plan de cuentas y dimensiones. Un Account en Sales no equivale automáticamente a un customer financiero listo para facturar.
- **Master data vs. transactional data:** clientes, productos y proveedores son datos maestros; órdenes, facturas, pagos y movimientos de inventario son transaccionales. La estrategia de integración cambia según el tipo.
- **Awareness, no implementación senior F&O:** este módulo prepara a un arquitecto/consultor CE para conversar con equipos ERP, no reemplaza formación profunda en Finance, SCM, Commerce o Project Operations.
- **Requisitos reales de práctica:** mapear procesos puede hacerse sin ambiente. Configurar entidades legales, contabilidad, almacenes, dual-write o DMF requiere un ambiente F&O real, datos maestros, permisos y participación de consultores F&O.

### 👨‍💻 Actividades Prácticas

## 🧩 Microlección 1 — El vocabulario: qué proceso es cada transacción

**¿Qué vas a aprender?** A ponerle el nombre exacto de proceso a una transacción de negocio, que es lo primero que te pide un arquitecto F&O.

**¿Por qué existe esto?** En un Fit-Gap, "el sistema factura" no le dice a nadie quién es dueño de qué. "Order to cash, en F&O" sí.

**Ahora haz algo — micropráctica (6 min):** clasifica las transacciones de un distribuidor → **[Ponerle nombre de proceso a cada transacción](/practica/ip-d365-013-nombrar-proceso-de-cada-transaccion)**.

**Práctica (25 min, en papel):** SIT (la empresa del [Lab 66](/labs/lab-66-sales-lead-to-cash)) vende licencias y servicios de Power Platform. Escribe una transacción concreta de SIT para cada proceso.

| Proceso | Nombre en el catálogo de Microsoft | Transacción concreta de SIT | Producto de F&O dueño |
|---|---|---|---|
| O2C | Order to cash | ___ | ___ |
| P2P | Source to pay | ___ | ___ |
| R2R | Record to report | ___ | ___ |
| I2D | Inventory to deliver | ___ | ___ |
| Project-to-profit | Project to profit | ___ | ___ |

**Evidencia a reportar:** la tabla completa y, en una línea, **cuál de las cinco transacciones te costó más ubicar** y por qué.

---

## 🧩 Microlección 2 — El mapa: dónde termina CE y empieza F&O

**¿Qué vas a aprender?** A dibujar el proceso order-to-cash de un cliente marcando qué paso vive en cada sistema y qué evento dispara el cambio.

**¿Por qué existe esto?** La frontera entre Sales y F&O es donde se duplican datos, se inventan aprobaciones y se pierde el ownership. Si la dibujas antes, se discute antes.

**Práctica (35 min, en papel):**

1. Para el escenario del Lab 66 (SIT vende licencias Power Platform), dibuja el flujo desde el Lead hasta el cobro con una columna por sistema (Sales / F&O). Puedes hacerlo en una tabla o en Mermaid.
2. Marca el **evento exacto** en que el proceso deja de ser lead-to-cash de Sales y pasa a ser order-to-cash de F&O, y qué dato tiene que viajar en ese momento (cliente, productos, precios, condiciones).
3. Para cada paso de F&O, anota si el vendedor necesita **verlo** desde Sales (por ejemplo, el estado de la factura) y cómo lo vería sin duplicar lógica.
4. Identifica un caso donde construir la lógica en Dataverse en vez de dejarla en F&O sería sobrepersonalización — explica qué regulación o configuración cambiante haría que esa lógica se desactualizara si se duplicara.

**Variante con ambiente de F&O (opcional):** si tienes un ambiente de prueba o demo, el [Lab 95](/labs/lab-95-fo-order-to-cash-hands-on) recorre el pedido de venta, la entrega y la factura en las pantallas reales; compara tu mapa con lo que viste.

**Evidencia a reportar:**

| Campo | Tu valor |
|---|---|
| Evento que dispara el paso de Sales a F&O | ___ |
| Datos que viajan en ese momento | ___ |
| Paso de F&O que el vendedor necesita ver y cómo lo vería | ___ |
| Lógica que no debe duplicarse en Dataverse y por qué | ___ |

---

## 🧩 Microlección 3 — Integrar: copiar, consultar, migrar o analizar

**¿Qué vas a aprender?** A elegir dual-write, virtual tables, DMF o Synapse Link/Fabric con el criterio de decisión, y a diagnosticar el error más común de las virtual tables.

**¿Por qué existe esto?** Elegir por familiaridad ("siempre usamos dual-write") es la forma más rápida de pagar una sincronización que no hacía falta. Y suponer que una virtual table "no tiene seguridad propia" es la forma más rápida de que un plug-in falle en producción.

**Práctica (30 min, en papel):**

1. Un stakeholder pide "mostrar el saldo de inventario de un producto dentro de la Opportunity de Sales, sin duplicar el dato en Dataverse". Decide, usando el criterio de la sección de Conceptos Clave, si la solución correcta es dual-write, DMF o virtual tables — justifica por qué las otras dos no aplican.
2. Crea una matriz master/transactional para Customer, Product, Sales Order, Invoice e Inventory, indicando si el dato se consulta, sincroniza o migra, y con qué mecanismo.
3. **Diagnosticar — micropráctica (7 min):** un plug-in que lee el inventario desde la virtual table falla, aunque los vendedores sí ven el dato en la app → **[Diagnosticar: el plug-in no puede leer la virtual table de F&O](/practica/ip-d365-014-diagnosticar-plugin-virtual-table-fo)**. Formula tu hipótesis antes de abrir las pistas.

**Evidencia a reportar:**

| Dato | Maestro o transaccional | ¿Se consulta, sincroniza o migra? | Mecanismo | Por qué |
|---|---|---|---|---|
| Customer | ___ | ___ | ___ | ___ |
| Product | ___ | ___ | ___ | ___ |
| Sales Order | ___ | ___ | ___ | ___ |
| Invoice | ___ | ___ | ___ | ___ |
| Inventory (saldo) | ___ | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Mecanismo para el saldo de inventario y por qué no los otros dos | ___ |
| Tu hipótesis en el diagnóstico antes de ver las pistas | ___ |

---

## 🧩 Microlección 4 — Seguridad: roles de F&O frente a roles de Dataverse

**¿Qué vas a aprender?** A leer el modelo de seguridad de F&O (role → duty → privilege) y a mapearlo a Dataverse sin suponer equivalencias.

**¿Por qué existe esto?** Un vendedor con un rol amplio en Dataverse no tiene por qué poder aprobar un límite de crédito en F&O. Y separar funciones (quien registra un proveedor no lo paga) es un requisito de auditoría, no una preferencia.

**Práctica (25 min, en papel):**

1. Para tres personas de SIT — un vendedor, una analista de cuentas por cobrar y un gerente de finanzas —, escribe qué **duty** de F&O necesitaría cada una (describe la parte del proceso, por ejemplo "registrar pagos de clientes") y qué rol de Dataverse tiene en Sales.
2. Marca un par de duties que **deben estar separados** en personas distintas y explica qué riesgo evita esa separación.
3. Escribe qué pasaría si el vendedor consulta una virtual table de facturas de F&O y su usuario de F&O no tiene ese duty: ¿ve las facturas o no? Usa lo que dice Learn sobre el contexto de usuario.

**Variante con ambiente de F&O (opcional):** el [Lab 99](/labs/lab-99-fo-security-duty-privilege-hands-on) recorre roles, duties y privileges en un ambiente real.

**Evidencia a reportar:**

| Persona | Rol en Dataverse (Sales) | Duty en F&O (parte del proceso) | ¿Equivalentes? Por qué |
|---|---|---|---|
| Vendedor | ___ | ___ | ___ |
| Analista de cuentas por cobrar | ___ | ___ | ___ |
| Gerente de finanzas | ___ | ___ | ___ |

| Campo | Tu valor |
|---|---|
| Duties que separaste y el riesgo que evitas | ___ |
| ¿El vendedor ve las facturas por la virtual table sin el duty? Por qué | ___ |

---

### 🏗️ Decidir y defender (sin pasos) — la integración de un distribuidor

> **Situación:** un distribuidor de material eléctrico va a usar Dynamics 365 Sales y Dynamics 365 Supply Chain Management con Finance. Pide: (a) que los clientes creados por los vendedores existan en F&O para poder facturarles; (b) que el vendedor vea en la Opportunity el stock disponible por almacén; (c) migrar 15 años de clientes y productos del ERP anterior; (d) un tablero de rentabilidad por cliente con todo el histórico; (e) que la validación de crédito se haga "en Sales, para que sea más rápida".
> **Entrega:** para cada pedido, el mecanismo o el sistema dueño, con una línea de justificación; y qué le dirías al cliente sobre el pedido (e).

No hay una sola respuesta correcta: la evidencia es la decisión escrita con sus razones. Contrástala con esta rúbrica:

| Criterio | Qué demuestra que lo cumples |
|---|---|
| Usas el criterio, no la costumbre | Cada mecanismo sale de una pregunta del criterio (¿tiene que existir en los dos?, ¿es carga puntual?, ¿basta trabajar sobre el dato de F&O?, ¿es analítica?) |
| Nombras el proceso dueño | Dices en qué proceso del catálogo vive cada pedido (Order to cash, Inventory to deliver, Record to report...) |
| Respetas el ownership | La lógica fiscal y de crédito queda en F&O; Sales consume el resultado |
| Piensas en la seguridad | Mencionas que las virtual tables corren con el usuario de F&O y que los roles se mapean, no se suponen |
| Reconoces lo que no sabes | Marcas como "por verificar" licencias, versiones o volúmenes que no confirmaste |

**Evidencia a reportar:**

| Pedido | Mecanismo o sistema dueño | Proceso del catálogo | Justificación |
|---|---|---|---|
| (a) Clientes de Sales en F&O | ___ | ___ | ___ |
| (b) Stock en la Opportunity | ___ | ___ | ___ |
| (c) Migración de 15 años | ___ | ___ | ___ |
| (d) Tablero de rentabilidad | ___ | ___ | ___ |
| (e) Crédito "en Sales" | ___ | ___ | ___ |

---

## 🔁 Reto de transferencia — Una farmacéutica con proyectos y compras

Cambia la industria y los procesos: ya no es un distribuidor de ventas, es un laboratorio farmacéutico que compra principios activos a proveedores, fabrica, vende a hospitales y además hace **estudios clínicos por proyecto** que factura por hito. Tiene CE para la relación con hospitales y F&O para todo lo demás. Un consultor te pasa seis afirmaciones para el documento de arquitectura.

1. **Micropráctica (8 min):** **[Transferir: la arquitectura CE + F&O de una farmacéutica](/practica/ip-d365-015-transferir-farmaceutica-ce-fo)**. Las pistas se desbloquean de una en una, después de cada intento.
2. **En papel:** para cada afirmación que rechazaste, escribe la versión correcta con su fuente de Learn y una pregunta que le harías al cliente antes de cerrar el diseño.

**Evidencia a reportar:**

| Afirmación rechazada | Qué está mal | Versión correcta (con fuente) |
|---|---|---|
| ___ | ___ | ___ |
| ___ | ___ | ___ |
| ___ | ___ | ___ |

### 💼 Casos Reales de Negocio
Un distribuidor mediano implementó Dynamics 365 Sales y, para "agilizar", construyó en Dataverse una tabla personalizada que calculaba impuestos y validaba crédito del cliente antes de aprobar una Opportunity — duplicando lógica que ya existía en su ERP (no D365 F&O, un sistema legado, pero el problema es el mismo). Seis meses después, un cambio en la tasa de IVA regional se actualizó en el ERP pero nadie recordó actualizar la tabla de Dataverse — el equipo comercial estuvo aprobando cotizaciones con impuestos incorrectos durante semanas hasta que Finanzas lo detectó en una conciliación. La lección: la lógica fiscal y de crédito pertenece al sistema que la mantiene regulatoriamente actualizado (F&O o el ERP equivalente), no a una réplica en Dataverse por conveniencia de UI.

### ✅ Buenas Prácticas
- Usar el nombre exacto del proceso ERP (order-to-cash, procure-to-pay/source to pay, record-to-report) al documentar un Fit-Gap que involucre F&O — "el sistema factura" es una frase que un arquitecto F&O real no aceptaría en una revisión.
- Aplicar el criterio de decisión (el dato tiene que existir en los dos → dual-write; carga puntual → DMF; trabajar sobre el dato de F&O sin copiarlo → virtual tables; analítica → Synapse Link/Fabric) ANTES de proponer una integración, no elegir por familiaridad con una sola opción.
- Tratar el licenciamiento de F&O como una conversación comercial separada desde el inicio del proyecto, no un detalle a resolver después del diseño técnico.
- Nunca replicar en Dataverse lógica fiscal, de crédito o de costeo que ya vive en F&O — es la forma más común de sobrepersonalización costosa en proyectos CE+F&O.
- Diseñar el acceso a virtual tables pensando en el usuario de F&O que ejecuta la consulta: plug-ins y flujos con el contexto de un usuario o una aplicación con permisos en F&O, nunca "como SYSTEM" por defecto.
- Asignar duties a los roles de F&O (no privileges sueltos) y separar los duties que una auditoría exige separar.
- Involucrar consultores F&O en decisiones de legal entity, impuestos, crédito, inventario y cierre financiero.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Decir "el ERP factura" sin poder nombrar el proceso (order-to-cash) | No conocer el vocabulario estándar de F&O | Aprender los 4-5 nombres de proceso y usarlos en Fit-Gap y documentación |
| Elegir dual-write para una carga masiva puntual | Confundir sincronización continua con migración de datos | Usar DMF para cargas batch/migraciones, dual-write solo para continuidad operativa |
| Descartar virtual tables "porque son de solo lectura" | Suponer una limitación que Learn no tiene: permiten CRUD | Elegir por si el dato debe existir en Dataverse, no por si se puede escribir |
| Un plug-in falla al leer una virtual table de F&O (`Unable to determine the user in CDS`) | Se ejecuta con un contexto (por ejemplo SYSTEM) que no corresponde a un usuario con permisos en F&O | Usar el contexto del usuario que llama o de una aplicación con permisos en F&O |
| Duplicar lógica fiscal o de crédito en Dataverse | Priorizar velocidad de UI sobre gobierno del dato | Dejar esa lógica en F&O y consultarla vía virtual tables o dual-write, nunca replicarla |
| Asumir que los roles de seguridad de F&O y Dataverse son equivalentes | No mapear explícitamente ambos modelos de seguridad | Documentar la correspondencia rol F&O ↔ rol Dataverse antes de activar dual-write |
| Tratar F&O como "otra app CE" | Se desconoce su modelo financiero/operativo | Reconocer entidad legal, procesos ERP y seguridad propia |

### 🧪 Criterios de Validación
- [ ] Puedo nombrar y explicar en una frase cada uno de los 4-5 procesos ERP estándar (O2C, P2P, R2R, I2D, project-to-profit) y sé que el catálogo de Microsoft llama *Source to pay* al P2P
- [ ] Ubiqué una transacción concreta de SIT en cada proceso con su producto de F&O dueño
- [ ] Identifiqué el evento exacto donde el proceso de SIT pasa de lead-to-cash (Sales) a order-to-cash (F&O)
- [ ] Apliqué el criterio de decisión dual-write vs. DMF vs. virtual tables a un caso concreto
- [ ] Sé que las virtual tables no copian el dato, permiten CRUD y se ejecutan con el usuario de F&O
- [ ] Diagnostiqué el plug-in que no puede leer la virtual table formulando una hipótesis antes de ver la causa
- [ ] Identifiqué un ejemplo de sobrepersonalización por duplicar lógica fiscal/crédito fuera de F&O
- [ ] Separé datos maestros y transaccionales en una matriz CE + F&O
- [ ] Mapeé roles de Dataverse a duties de F&O sin suponer equivalencias y separé duties que deben ir en personas distintas
- [ ] Defendí contra la rúbrica la integración del distribuidor de material eléctrico
- [ ] En el reto de transferencia separé las afirmaciones correctas de las que no resisten la verificación
- [ ] Puedo explicar qué requiere ambiente F&O real y qué es solo awareness de arquitectura

### 📸 Evidencia para guardar
- Las tablas de evidencia de las cuatro microlecciones, de la decisión defendida y del reto de transferencia.
- El mapa de proceso de la Microlección 2 (tabla o diagrama).

> **Siguiente paso:** el [Lab 69](/labs/lab-69-fo-process-mapping-erp-end-to-end) mapea los procesos end-to-end de otra empresa; el [Lab 70](/labs/lab-70-ce-fo-integration-architecture) diseña la arquitectura de integración; el [Lab 64](/labs/lab-64-capstone-fo-awareness-arquitectura-erp-crm) es el capstone de awareness; y si tienes un ambiente de F&O, los Labs 93 a 100 llevan los procesos a las pantallas reales.

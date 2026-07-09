---
moduleId: 59
title: "Finance & Operations — Procesos ERP, Virtual Tables y Vocabulario Estándar"
level: "d365"
certification: "Especialista Dynamics 365 CE"
estimatedMinutes: 12
slug: "finance-operations-procesos-erp"
---
### 🎯 Objetivo
Nombrar y reconocer los procesos ERP estándar de Dynamics 365 Finance & Operations (order-to-cash, procure-to-pay, record-to-report, inventory-to-deliver, project-to-profit) y las opciones técnicas de integración con Dataverse (dual-write, Data Management Framework, virtual tables), para poder participar en una conversación de arquitectura F&O sin depender solo de "es un ERP" como respuesta.

### 📖 Conceptos Clave
- **Los 4 productos de Finance & Operations, en una frase cada uno:**
  - **Dynamics 365 Finance:** contabilidad general, cuentas por pagar/cobrar, activos fijos, presupuestos y consolidación financiera multi-entidad legal.
  - **Supply Chain Management (SCM):** planificación de demanda, compras, inventario, almacenes, manufactura y transporte.
  - **Commerce:** punto de venta (POS), comercio electrónico B2B/B2C y gestión de canales de venta minorista, integrado con Finance/SCM para inventario y precios.
  - **Project Operations:** planificación, ejecución y facturación de proyectos basados en tiempo y materiales o precio fijo, con reconocimiento de ingresos.
- **Los procesos ERP estándar — vocabulario que un arquitecto D365 CE debe reconocer:**
  - **Order-to-cash (O2C):** desde que un cliente hace un pedido hasta que la empresa cobra — pedido de venta → cumplimiento/envío → factura → cobro. Es la contraparte ERP del lead-to-cash de Sales (Módulo 20/Lab 66): Sales cierra la venta (Quote→Order), pero el cumplimiento, la factura real, el impuesto y el cobro viven en O2C dentro de F&O.
  - **Procure-to-pay (P2P):** desde que se genera una necesidad de compra hasta que se paga al proveedor — requisición → orden de compra → recepción de mercancía → factura de proveedor → pago.
  - **Record-to-report (R2R):** el ciclo contable — registrar transacciones financieras, conciliar cuentas, cerrar el periodo y producir reportes financieros y regulatorios.
  - **Inventory-to-deliver (I2D):** gestión de inventario desde la recepción hasta la entrega — control de stock, picking, packing, envío y confirmación de entrega.
  - **Project-to-profit (P2P de proyectos, distinto del procure-to-pay):** desde la planificación de un proyecto hasta medir su rentabilidad — presupuesto, ejecución, facturación y reconocimiento de ingresos (dominio de Project Operations).
- **Por qué importa el nombre exacto:** decir "el sistema factura" es ambiguo — un Solution Architect que sabe que la facturación real vive en el ciclo order-to-cash de F&O (no en Dynamics 365 Sales) evita la sobrepersonalización de construir lógica de facturación en Dataverse cuando F&O ya la resuelve.
- **Virtual tables (Dataverse):** mecanismo que expone datos de un sistema externo (incluyendo F&O) como si fueran tablas nativas de Dataverse, SIN copiar ni sincronizar el dato — cada consulta a la virtual table lee en tiempo real desde el origen. Se diferencia de dual-write (que sí copia y mantiene una réplica sincronizada bidireccional) y de DMF (que mueve datos en lotes). Las virtual tables encajan cuando se necesita mostrar datos de F&O en una app de Power Platform (por ejemplo, saldo de inventario) sin duplicarlos ni asumir el costo de mantenimiento de una sincronización.
- **Cómo elegir entre dual-write, DMF y virtual tables — criterio de decisión:**
  - ¿El usuario necesita **escribir** en ambos sistemas con continuidad operativa (ej. un cliente creado en Sales debe existir también en F&O)? → **Dual-write**.
  - ¿Es una **carga masiva o migración** puntual, no una sincronización continua? → **Data Management Framework**.
  - ¿Solo se necesita **leer** datos de F&O desde una app de Power Platform, sin escribir ni duplicar? → **Virtual tables**.
  - ¿Es para **analítica** a gran escala, no para una app transaccional? → Synapse Link/Fabric, ninguna de las tres anteriores.
- **Consideraciones de licenciamiento:** Finance & Operations se licencia por separado de Dynamics 365 CE (Sales/Service/Field Service comparten un pool de licencias distinto al de F&O) — un proyecto que combina CE y F&O casi siempre involucra dos conversaciones de licenciamiento distintas con el cliente, no una sola.
- **Consideraciones de seguridad:** F&O tiene su propio modelo de seguridad basado en roles y "duties/privileges" a nivel de proceso de negocio, distinto del modelo de Security Roles de Dataverse — al diseñar dual-write, hay que mapear explícitamente qué rol de F&O corresponde a qué rol de Dataverse, no asumir que son equivalentes.
- **Riesgo de sobrepersonalización específico de F&O:** construir en Dataverse una réplica de lógica que F&O ya resuelve (cálculo de impuestos, validación de crédito, costeo de inventario) es el error de arquitectura más costoso en proyectos CE+F&O — esa lógica depende de configuración fiscal y contable que cambia por país y por regulación, y F&O ya la mantiene actualizada.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Para el escenario del Lab 66 (SIT vende licencias Power Platform), identifica en qué punto exacto el proceso deja de ser "lead-to-cash de Sales" y pasa a ser "order-to-cash de F&O" — nombra el evento que dispara ese cambio de sistema.
2. Escribe, en una tabla de 2 columnas, los 4 procesos ERP (O2C, P2P, R2R, I2D) con un ejemplo concreto de una transacción de SIT para cada uno.
3. Un stakeholder pide "mostrar el saldo de inventario de un producto dentro de la Opportunity de Sales, sin duplicar el dato en Dataverse". Decide, usando el criterio de la sección de Conceptos Clave, si la solución correcta es dual-write, DMF o virtual tables — justifica por qué las otras dos no aplican.
4. Identifica un caso donde construir la lógica en Dataverse en vez de dejarla en F&O sería sobrepersonalización — explica qué regulación o configuración cambiante haría que esa lógica se desactualizara si se duplicara.

### 💼 Casos Reales de Negocio
Un distribuidor mediano implementó Dynamics 365 Sales y, para "agilizar", construyó en Dataverse una tabla personalizada que calculaba impuestos y validaba crédito del cliente antes de aprobar una Opportunity — duplicando lógica que ya existía en su ERP (no D365 F&O, un sistema legado, pero el problema es el mismo). Seis meses después, un cambio en la tasa de IVA regional se actualizó en el ERP pero nadie recordó actualizar la tabla de Dataverse — el equipo comercial estuvo aprobando cotizaciones con impuestos incorrectos durante semanas hasta que Finanzas lo detectó en una conciliación. La lección: la lógica fiscal y de crédito pertenece al sistema que la mantiene regulatoriamente actualizado (F&O o el ERP equivalente), no a una réplica en Dataverse por conveniencia de UI.

### ✅ Buenas Prácticas
- Usar el nombre exacto del proceso ERP (order-to-cash, procure-to-pay, record-to-report) al documentar un Fit-Gap que involucre F&O — "el sistema factura" es una frase que un arquitecto F&O real no aceptaría en una revisión.
- Aplicar el criterio de decisión (escritura continua → dual-write; carga puntual → DMF; solo lectura → virtual tables) ANTES de proponer una integración, no elegir por familiaridad con una sola opción.
- Tratar el licenciamiento de F&O como una conversación comercial separada desde el inicio del proyecto, no un detalle a resolver después del diseño técnico.
- Nunca replicar en Dataverse lógica fiscal, de crédito o de costeo que ya vive en F&O — es la forma más común de sobrepersonalización costosa en proyectos CE+F&O.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Decir "el ERP factura" sin poder nombrar el proceso (order-to-cash) | No conocer el vocabulario estándar de F&O | Aprender los 4-5 nombres de proceso y usarlos en Fit-Gap y documentación |
| Elegir dual-write para una carga masiva puntual | Confundir sincronización continua con migración de datos | Usar DMF para cargas batch/migraciones, dual-write solo para continuidad operativa |
| Duplicar lógica fiscal o de crédito en Dataverse | Priorizar velocidad de UI sobre gobierno del dato | Dejar esa lógica en F&O y consultarla vía virtual tables o dual-write, nunca replicarla |
| Asumir que los roles de seguridad de F&O y Dataverse son equivalentes | No mapear explícitamente ambos modelos de seguridad | Documentar la correspondencia rol F&O ↔ rol Dataverse antes de activar dual-write |

### 🧪 Criterios de Validación
- [ ] Puedo nombrar y explicar en una frase cada uno de los 4-5 procesos ERP estándar (O2C, P2P, R2R, I2D, project-to-profit)
- [ ] Identifiqué el evento exacto donde el proceso de SIT pasa de lead-to-cash (Sales) a order-to-cash (F&O)
- [ ] Apliqué el criterio de decisión dual-write vs. DMF vs. virtual tables a un caso concreto
- [ ] Identifiqué un ejemplo de sobrepersonalización por duplicar lógica fiscal/crédito fuera de F&O

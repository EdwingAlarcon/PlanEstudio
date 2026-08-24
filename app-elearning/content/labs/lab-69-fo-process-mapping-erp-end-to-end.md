---
id: lab-69
title: "F&O Process Mapping — Procesos ERP End-to-End"
level: "N4"
duration: 150
product: ["Dynamics 365 Finance", "Dynamics 365 Supply Chain Management", "Dynamics 365 Project Operations"]
certifications: ["Arquitectura Power Platform"]
role: ["Functional Consultant", "Solution Architect"]
prerequisites:
  - "Módulo 60 estudiado: Finance & Operations — Procesos ERP, Virtual Tables y Vocabulario Estándar"
  - "Módulo 20 revisado: Dynamics 365 CE — Sales y Customer Service"
---

# Lab 69 — F&O Process Mapping: Procesos ERP End-to-End

## Objetivo

Al finalizar este laboratorio habrás mapeado, paso a paso, los 5 procesos ERP estándar de Finance
& Operations (Order-to-Cash, Procure-to-Pay, Record-to-Report, Inventory-to-Deliver,
Project-to-Profit) para un escenario de negocio concreto, identificando en cada paso qué vive en
CE (Dataverse/Dynamics 365 Sales) y qué vive en F&O, y qué riesgos aparecen en la frontera entre
ambos.

Este laboratorio es de **diseño funcional por proceso**, no de configuración de un tenant F&O real
— refuerza el vocabulario y el razonamiento de proceso del Módulo 60 con datos concretos.

## Diferencia con el Lab 89

Este lab construye el **mapa fundacional** de cinco procesos ERP con pasos, actores y sistema
responsable. El Lab 89 parte de ese mapa y sube el nivel: frontera CE/F&O, clasificación de datos
maestros/transaccionales y riesgos de sobrepersonalización. No repitas en el Lab 89 las mismas
secuencias paso a paso; usa este laboratorio como baseline y reserva el análisis arquitectónico
para el avanzado.

## Escenario de negocio

**Empresa ficticia:** Manufacturas del Pacífico S.A., fabricante mediano de empaques industriales
con 600 empleados. Usa Dynamics 365 Finance & Supply Chain Management para producción, inventario
y contabilidad, y Dynamics 365 Sales para la relación comercial con sus distribuidores.

## Rol del estudiante

Actúas como **consultor funcional** que debe explicar a un comité de proyecto, proceso por
proceso, qué pasa exactamente entre que un distribuidor hace un pedido y la empresa recibe el pago
— y hacer lo mismo para compras, cierre contable, inventario y proyectos internos.

## Prerrequisitos

- Haber estudiado el Módulo 60 (procesos ERP estándar y vocabulario).
- Entender la diferencia entre Sales (CRM) y F&O (ERP) del Módulo 20.

## Herramientas necesarias

- Markdown o una hoja de cálculo para las tablas de proceso.
- Recurso `/recursos/rubricas-plantillas`.

## Datos de prueba

| Proceso | Transacción de ejemplo |
|---|---|
| Order-to-Cash | Distribuidor Ferretería Andina pide 500 cajas de empaque industrial modelo EI-40 |
| Procure-to-Pay | Compra de 2 toneladas de resina plástica al proveedor Química del Norte |
| Record-to-Report | Cierre del periodo fiscal de marzo, con asientos de depreciación de maquinaria |
| Inventory-to-Deliver | Transferencia de 300 unidades de EI-40 del almacén central al almacén regional |
| Project-to-Profit | Proyecto interno de automatización de línea de producción, precio fijo, 3 hitos |

## Pasos detallados

### Paso 1 — Order-to-Cash (O2C)

Usando la transacción de Ferretería Andina, documenta cada paso: validación del cliente y crédito,
creación del pedido de venta, verificación de disponibilidad (ATP), picking/packing conceptual,
facturación y cobro. Para cada paso indica si vive en **Sales**, en **F&O**, o en ambos, y por qué.

### Paso 2 — Procure-to-Pay (P2P)

Usando la compra de resina plástica, documenta: requisición, orden de compra, recepción de
mercancía, factura del proveedor (three-way match contra la OC y la recepción), y pago. Explica
qué pasaría si la cantidad recibida no coincide con la orden de compra.

### Paso 3 — Record-to-Report (R2R)

Usando el cierre de marzo, documenta: qué dimensiones financieras (centro de costo, departamento)
aplicarías al asiento de depreciación, qué validaciones deben pasar antes de cerrar el periodo, y
qué reporte financiero usaría ese asiento como insumo.

### Paso 4 — Inventory-to-Deliver (I2D)

Usando la transferencia de 300 unidades de EI-40, documenta: cómo se verifica disponibilidad antes
de transferir, qué documento registra el movimiento, y cómo este proceso sostiene tanto el O2C del
Paso 1 (inventario disponible para vender) como el P2P del Paso 2 (inventario recién recibido).

### Paso 5 — Project-to-Profit

Usando el proyecto de automatización (precio fijo, 3 hitos), documenta: cómo se planifica el
presupuesto, cómo se registran costos reales de consultores/materiales, cómo se factura cada hito,
y cómo se calcula el margen real vs. presupuestado al final del proyecto.

### Paso 6 — Tabla de decisión CE vs. F&O

Para los 5 procesos, construye una tabla que indique, transacción por transacción, en qué sistema
vive el registro maestro (Sales/Dataverse vs. F&O) y en qué punto exacto cruza de un sistema al
otro (el "evento disparador").

### Paso 7 — Matriz de riesgos por proceso

Identifica al menos 1 riesgo específico por cada uno de los 5 procesos (ej. desincronización de
precios en O2C, discrepancia en three-way match de P2P, cierre de periodo con transacciones
pendientes en R2R, inventario negativo en I2D, sobrecosto no facturado en Project-to-Profit) con su
mitigación.

## Resultado esperado

Un conjunto de 5 mapas de proceso con pasos reales, actores, sistema responsable y riesgos — que
un consultor funcional podría usar en un Fit-Gap real de F&O, en vez de definiciones de una línea.

## Validaciones

- [ ] Cada uno de los 5 procesos tiene sus pasos documentados en orden, no solo nombrados.
- [ ] Cada paso indica si vive en Sales/Dataverse, en F&O, o en ambos.
- [ ] La tabla de decisión CE vs. F&O nombra el evento disparador exacto del cruce entre sistemas.
- [ ] Cada proceso tiene al menos 1 riesgo específico con mitigación, no genérica.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Describir el proceso con el nombre pero sin pasos | Quedarse en el vocabulario del Módulo 60 sin aplicarlo a datos concretos | Documentar cada paso con su actor, sistema y resultado, como en este laboratorio |
| Asumir que todo O2C vive en F&O | No reconocer que Sales gestiona Lead/Oportunidad/Quote antes del pedido | Nombrar el evento exacto (confirmación del pedido) donde el proceso cruza a F&O |
| Ignorar el three-way match en P2P | Simplificar la orden de compra → factura → pago sin la recepción | Incluir siempre la recepción de mercancía como paso de control |
| Riesgos genéricos sin mitigación concreta | Copiar riesgos de plantilla sin adaptarlos al proceso | Nombrar la entidad, transacción o control específico afectado en cada riesgo |

## Reto adicional

Para el proceso Project-to-Profit, agrega un escenario donde el proyecto se retrasa y supera el
presupuesto de horas en un 20%. Documenta en qué punto del proceso se detectaría esa desviación y
qué reporte o alerta debería generarse antes del cierre del proyecto.

## Evidencia esperada

- 5 mapas de proceso (O2C, P2P, R2R, I2D, Project-to-Profit) con pasos, actores y sistema.
- Tabla de decisión CE vs. F&O con el evento disparador de cada cruce.
- Matriz de riesgos con al menos 1 riesgo por proceso y su mitigación.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Mapas de proceso (5) | 40% | Cada proceso tiene pasos secuenciales reales, no solo el nombre del proceso |
| Tabla de decisión CE vs. F&O | 25% | Identifica correctamente el evento disparador para cada proceso |
| Matriz de riesgos | 25% | Al menos 5 riesgos (uno por proceso) con mitigación específica |
| Claridad funcional | 10% | Un consultor sin este laboratorio podría seguir el mapa sin preguntas básicas |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥85/100.

## Módulos relacionados

- Módulo 60 — Finance & Operations: Procesos ERP, Virtual Tables y Vocabulario Estándar
- Módulo 20 — Dynamics 365 CE — Sales y Customer Service
- Lab 64 — Capstone Finance & Operations Awareness: Arquitectura Conceptual ERP + CRM
- Recurso — Rúbricas y Plantillas de Evaluación (`/recursos/rubricas-plantillas`)

## Competencias desarrolladas

- Mapeo funcional de procesos ERP estándar (O2C, P2P, R2R, I2D, Project-to-Profit).
- Identificación del punto de cruce entre CE y F&O en un proceso real.
- Análisis de riesgos operativos específicos por proceso ERP.

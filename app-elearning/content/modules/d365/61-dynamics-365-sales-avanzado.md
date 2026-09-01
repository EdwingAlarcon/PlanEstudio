---
moduleId: 61
title: "Dynamics 365 Sales Avanzado — Forecasting, Pipeline y Sales Operations"
level: "d365"
certification: "Dynamics 365 Sales / MB-280 (retirado 31 jul 2026)"
estimatedMinutes: 13
slug: "dynamics-365-sales-avanzado"
---

> **🧭 ¿Lead, oportunidad, cuenta y contacto todavía no son claros?** Este módulo asume ese vocabulario.
> Repasa primero [Fundamentos funcionales CRM](/recursos/fundamentos-crm) — 15 minutos, sin tenant.

### 🎯 Objetivo
Diseñar y operar un proceso avanzado de Dynamics 365 Sales que conecte lead-to-opportunity, catálogo de productos, pipeline review, forecasting y gobierno de datos comerciales, produciendo los mismos artefactos (matriz de forecast, política de pipeline hygiene, decisión de forecast category) que se te pediría entregar en un proyecto real — y diferenciando lo que puede practicarse con datos simulados de lo que requiere tenant, licencia de Dynamics 365 Sales y ambiente real.

### 📖 Conceptos Clave
- **Sales como proceso operativo, no solo CRM:** el valor aparece cuando Lead, Opportunity, Quote, Order y actividades de seguimiento tienen reglas claras de propiedad, etapa, probabilidad y forecast category — no cuando "el vendedor llena un formulario".
- **Pipeline review:** revisión periódica (semanal en la mayoría de equipos B2B) donde ventas y dirección inspeccionan oportunidades por etapa, fecha estimada de cierre, valor, riesgo, next step y cambios desde la revisión anterior. Una oportunidad que no cambió nada en 2 semanas es una señal de riesgo, no de estabilidad.
- **Forecasting — mecánica real:** Dynamics 365 Sales proyecta ingresos por jerarquía de vendedores/managers, periodo (mes/trimestre) y forecast category, con una grilla editable donde cada nivel de la jerarquía ve el rollup del nivel inferior. Requiere licencia/ambiente de Dynamics 365 Sales y configuración real de la definición de forecast (recurrencia, categorías incluidas, plantilla); en este curso puedes diseñar la estructura completa con datos simulados, pero validar visualmente el rollup jerárquico requiere tenant.
- **Forecast categories — con criterio de asignación:** `Pipeline` (oportunidad abierta sin compromiso), `Best Case` (probable pero no confirmado), `Committed` (el vendedor lo compromete con dirección), `Omitted` (excluido intencionalmente del forecast) y `Won`/`Lost`. La categoría NO se deriva automáticamente del stage — un vendedor puede tener una oportunidad en etapa "Negociación" y aun así marcarla `Best Case` si el cliente no ha confirmado presupuesto.
- **Product catalog:** productos, price lists (una por región/segmento/moneda), unit groups (unidad base y conversiones) y discount lists (por volumen o por cliente). Si el proceso termina en F&O (Módulo 60/64), Sales no debe reinventar impuestos, disponibilidad real de inventario ni facturación fiscal — el price list de Sales es comercial, no fiscal.
- **Sales accelerator y señales:** secuencias (pasos sugeridos de seguimiento), prioridad calculada y actividades guiadas pueden mejorar la ejecución comercial del día a día, pero dependen de licencia Premium/Insights y de configuración habilitada — no vienen activas por defecto.
- **Territories y ownership:** territorios geográficos o por segmento, equipos de venta y reglas de asignación reducen conflictos de ownership cuando dos vendedores atienden la misma cuenta. En proyectos enterprise se documentan ANTES de migrar oportunidades históricas, no después de la primera disputa de comisión.
- **Integración con Outlook/Teams:** mejora adopción (el vendedor registra actividad sin salir de su bandeja), pero no corrige mala calidad de pipeline; primero se definen etapas, campos obligatorios y cadencia de revisión, luego se activa la integración.
- **Requisitos reales de práctica:** diseñar etapas, matrices de forecast y políticas de higiene puede hacerse sin tenant (Excel o markdown). Configurar forecast real, jerarquía de ventas, product catalog con price lists y Sales Accelerator requiere Dynamics 365 Sales, usuarios con licencia y rol de administración comercial.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Define un proceso de pipeline con 5 etapas: Calificación, Descubrimiento, Propuesta, Negociación y Cierre. Para cada etapa escribe entrada, salida, campos obligatorios y criterio para avanzar.
2. Construye esta matriz de forecast (puedes usar Excel si no tienes tenant) para 3 vendedores del escenario de SIT (Servicios Integrados Tecnológicos S.A., el mismo caso del Módulo 60 y el Lab 66):

   | Vendedor | Territorio | Cuota trimestre | Pipeline | Best Case | Committed | Won | Gap vs. cuota |
   |---|---|---|---|---|---|---|---|
   | Ana Rivera | LATAM Norte | $180,000 | $220,000 | $95,000 | $60,000 | $40,000 | -$80,000 |
   | Carlos Peña | LATAM Sur | $150,000 | $140,000 | $70,000 | $55,000 | $30,000 | -$65,000 |
   | Lucía Gómez | LATAM Norte | $200,000 | $310,000 | $120,000 | $150,000 | $20,000 | -$30,000 |

   Con estos datos, decide a cuál de los 3 vendedores pedirías una revisión 1:1 esta semana y justifica por qué (pista: el gap más grande no siempre es el caso más urgente — compara gap vs. Committed).
3. Diseña 6 oportunidades simuladas con valor, fecha de cierre, probabilidad, forecast category y next step. Marca 2 como riesgosas (fecha vencida, sin next step con fecha, o stage inconsistente con forecast category) y explica qué acción pedirías al vendedor en la pipeline review.
4. Responde estas 3 preguntas como si fuera una entrevista de Consultor Funcional Dynamics 365 Sales: (a) "¿Cómo diferencias forecast category de stage de la oportunidad?"; (b) "¿Cuándo NO recomendarías activar Sales Accelerator?"; (c) "¿Por qué el catálogo de productos de Sales no debería calcular impuestos?". Escribe tu respuesta esperada para cada una.
5. Especifica qué requiere ambiente real: forecast configurado con jerarquía de ventas, usuarios con licencia Sales, productos/price lists activos, y seguridad por equipo o territorio.
6. Redacta una política de pipeline hygiene: fecha de cierre no vencida, next step con fecha, contacto principal identificado, etapa coherente con probabilidad, y forecast category revisada semanalmente en la pipeline review.

### 💼 Casos Reales de Negocio
Una empresa B2B reportaba forecast con hojas de cálculo desconectadas de Dynamics 365 Sales. El CRM tenía oportunidades, pero los vendedores actualizaban el compromiso real solo en Excel porque nadie les exigía usar forecast category. Dirección veía un pipeline inflado (todo en `Pipeline`, nada en `Committed`) y Finanzas no podía anticipar ingresos con esa información. La corrección fue definir forecast categories obligatorias por etapa mínima, cadencia semanal de pipeline review, reglas de fecha de cierre y un dashboard único en Sales — nadie volvió a mirar Excel. El cambio no fue "agregar más campos"; fue gobernar el comportamiento comercial con las herramientas que ya existían.

### ✅ Buenas Prácticas
- Separar stage operativo de forecast category: una oportunidad en Negociación no siempre está Committed — son dos preguntas distintas ("¿en qué paso del proceso está?" vs. "¿qué tan seguro está el vendedor?").
- Definir forecast por periodo y jerarquía antes de construir dashboards ejecutivos sobre esos datos.
- Mantener productos y listas de precios simples si F&O será el sistema de cumplimiento/facturación — evitar duplicar lógica fiscal en Sales (ver Módulo 60).
- Documentar reglas de ownership, territorio y reasignación antes de migrar oportunidades históricas a una nueva estructura de territorios.
- Indicar en el diseño qué capacidades requieren licencia Dynamics 365 Sales Premium (Sales Accelerator, Insights) y cuáles pueden simularse para práctica sin tenant.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Usar probabilidad de etapa como forecast real | Se confunde avance de etapa con compromiso comercial | Usar forecast categories explícitas y revisión semanal en pipeline review |
| Forecast sin jerarquía comercial | No se modelaron managers/equipos antes de activar forecast | Definir jerarquía y cuotas antes de activar la definición de forecast |
| Catálogo de productos duplicando lógica de F&O | Ventas intenta resolver impuestos o disponibilidad real de inventario | Dejar precio comercial en Sales y cumplimiento/factura en F&O (Módulo 65) |
| Pipeline con fechas de cierre vencidas sin revisión | No existe política de higiene de pipeline | Dashboard de aging y regla de revisión obligatoria por oportunidad vencida |

### 🧪 Criterios de Validación
- [ ] Diseñé etapas de pipeline con entradas, salidas y campos obligatorios
- [ ] Construí una matriz de forecast con cuota, committed, best case, won y gap, y decidí a qué vendedor dar seguimiento con justificación
- [ ] Respondí 3 preguntas de entrevista/consultoría sobre forecast category, Sales Accelerator y catálogo de productos
- [ ] Identifiqué qué partes requieren tenant/licencia Dynamics 365 Sales
- [ ] Definí una política de pipeline hygiene aplicable a un equipo comercial
- [ ] Relacioné este módulo con el Lab 66 (proceso lead-to-cash) y el Lab 81 (forecasting y pipeline review)


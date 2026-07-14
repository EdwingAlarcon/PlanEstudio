# Roadmap de Especialización Avanzada Dynamics 365

Este documento es la contraparte honesta de la [Matriz de Competencias](MATRIZ_COMPETENCIAS.md):
donde esa matriz certifica lo que **ya puedes demostrar hoy**, este roadmap enumera qué quedó
cubierto como módulo/lab y qué todavía requiere tenant, licencia, canal o ambiente real para
convertirse en configuración productiva verificable.

## Por qué existe este roadmap

PlanEstudio ya cubre con evidencia real:

- **Power Platform completo** (Canvas, Model-Driven, Dataverse, Power Automate, Power Fx, ALM, PCF,
  plugins, gobernanza) — rutas Maker, Consultor Funcional, Developer, Solution Architect.
- **Dynamics 365 CE avanzado**: Sales forecasting/pipeline (Módulo 60, LAB-081), Customer Service
  SLA/entitlements/routing (Módulo 61, LAB-082), Contact Center simulation (Módulo 62, LAB-083),
  Customer Insights Data/Journeys separados (Módulos 57/63, LAB-085/LAB-084) y Field Service
  end-to-end (Módulo 58, LAB-086/LAB-087).
- **Finance & Operations — awareness avanzado e integración**: vocabulario, mapas de proceso,
  ownership CE + F&O y diseño de integración (Módulos 59/64, LAB-069/LAB-070/LAB-088/LAB-089).
- **Capstone Enterprise D365**: arquitectura CE + F&O, roadmap, Fit-Gap, UAT y evidencia de
  portafolio (Módulo 65, LAB-090).

La ejecución real de canales Contact Center, Sales Insights predictivo, RSO/Field Service Mobile,
Customer Insights, dual-write y F&O debe pasar por el gate de
[D365 Tenant Readiness](D365_TENANT_READINESS.md). Si el gate no se cumple, el entregable se
presenta como diseño/simulación avanzada, no como configuración productiva.

## Leyenda de madurez

Cada tema de cada ruta se etiqueta con una de estas cuatro categorías — nunca con una quinta
categoría implícita de "experto":

| Etiqueta | Significa | Lo que puedes esperar del contenido cuando exista |
|---|---|---|
| 🟢 **Cubierto** | Módulo + lab con evidencia y rúbrica ya existen | Puedes demostrarlo hoy, con criterio de aprobación verificable |
| 🔵 **Avanzado** | Cubierto con profundidad, pero sin configuración de producto en tenant real | Diseño y decisión técnica sólidos; la ejecución productiva requiere un ambiente real |
| 🟡 **Awareness** | Solo vocabulario y contexto conceptual | Sirve para conversación funcional/arquitectónica, no para configurar el producto |
| ⚪ **En expansión (roadmap)** | Todavía no tiene contenido en la plataforma | Aparece aquí como plan, no como lab disponible |

Las rutas Dynamics 365 Customer Engagement y Finance & Operations ya aparecen en `/rutas`, con
evidencia de diseño/lab y gate explícito para ambiente real.

---

## 1. Ruta Expert Customer Service / Contact Center

**Estado global: 🔵 Avanzado**, con simulación de Contact Center implementada (Módulo 62, LAB-083).

| Tema | Madurez actual |
|---|---|
| Case management, colas, SLA, escalamiento, dashboard operativo | 🔵 Avanzado (Módulo 20, LAB-068) |
| Omnichannel for Customer Service (routing multicanal, contexto de conversación) | 🟡 Awareness (mencionado en Módulo 20) |
| Dynamics 365 Contact Center | 🔵 Avanzado (Módulo 62, LAB-083 como simulación) |
| Chat | 🔵 Avanzado (diseño de canal/workstream; ejecución requiere canal real) |
| Voice | 🟡 Awareness (requiere número/proveedor/tenant real) |
| SMS | 🟡 Awareness (requiere proveedor/canal real) |
| Email (enrutamiento avanzado, no el caso base) | 🔵 Avanzado (diseño de routing; configuración real depende de tenant) |
| Unified routing (reglas basadas en habilidad/capacidad/prioridad) | 🔵 Avanzado (Módulo 62, LAB-083) |
| Agent experience (espacio de trabajo multi-sesión, macros, productivity pane) | 🟡 Awareness |
| Supervisor experience (monitoreo en vivo, intervención, reasignación) | 🔵 Avanzado (dashboard conceptual en LAB-083) |
| Analytics (Customer Service Analytics, Omnichannel Insights) | ⚪ En expansión |
| Copilot para agentes (resúmenes de caso, respuestas sugeridas) | 🟡 Awareness (mencionado en Módulo 20) |
| Escenarios de atención multicanal integrados (un mismo cliente saltando de chat a voz a caso) | ⚪ En expansión |

### Laboratorio implementado: Contact Center Simulation

**Objetivo:** diseñar el enrutamiento unificado de un caso que entra por
tres canales distintos (chat, voz, email) para el mismo cliente, con reglas de habilidad/capacidad,
y documentar la experiencia de agente y de supervisor sin necesitar licencias de Contact Center
activas.

**Por qué "simulación" y no "configuración":** Omnichannel y Contact Center requieren licenciamiento
y canales provisionados (número de voz, conector de WhatsApp/SMS, workstream configurado) que no
existen en un ambiente de práctica estándar. Sin ese tenant, el laboratorio solo puede cubrir
**diseño de reglas de enrutamiento y experiencia de agente/supervisor en papel** (diagramas,
matrices de decisión, wireframes de cola unificada) — no una configuración productiva verificable
con datos reales entrando por un canal de voz o chat en vivo.

Este lab ya existe como LAB-083. Sigue siendo simulación avanzada: no afirma configuración productiva
de canales reales sin tenant/licencia.

---

## 2. Ruta Expert Sales Operations

**Estado global: 🔵 Avanzado**, con Sales Forecasting & Pipeline Review implementado (Módulo 60, LAB-081).

| Tema | Madurez actual |
|---|---|
| Proceso lead-to-cash (BPF, Quote → Order → Invoice) | 🔵 Avanzado (Módulo 20, LAB-066) |
| Territories (asignación geográfica/vertical de cuentas) | ⚪ En expansión |
| Forecasting (categorías de forecast, forecast configurable) | 🔵 Avanzado (Módulo 60, LAB-081; validación real requiere Sales) |
| Goals (metas individuales/de equipo, rollup) | 🔵 Avanzado (diseño/matriz; configuración real requiere tenant) |
| Sales Insights (relationship health, predicción de conversión) | 🟡 Awareness (requiere licencia/datos históricos) |
| Sales Accelerator (secuencias, listas de trabajo priorizadas) | ⚪ En expansión |
| Pipeline management (vistas Kanban, revisión de pipeline) | 🔵 Avanzado (LAB-081) |
| Dashboards ejecutivos de ventas | 🟡 Awareness (patrón de dashboard cubierto en Módulo 20 para Service, no adaptado a Sales) |
| Productividad comercial (plantillas de email, secuencias, notas asistidas por IA) | ⚪ En expansión |
| Integración con Outlook/Teams/Copilot para venta asistida | 🟡 Awareness |

### Laboratorio implementado: Forecasting & Pipeline Review

**Objetivo:** diseñar una jerarquía de forecast simple (individual →
gerente), definir metas de un trimestre y ejecutar una revisión de pipeline con al menos 3
oportunidades en distintas etapas, documentando qué decisión comercial tomaría un gerente de ventas
a partir de esa vista.

**Qué requiere un tenant real:** Forecasting configurable y Sales Insights dependen de licencias
Premium/Insights y de datos históricos suficientes para que las predicciones sean significativas.
Sin eso, el lab cubre el **diseño de la jerarquía de forecast y goals** (que
sí es reproducible con datos de prueba), pero no una demostración real de predicción de Sales
Insights — ese punto quedará marcado explícitamente como fuera de alcance dentro del lab, no
presentado como si funcionara.

---

## 3. Ruta F&O Practitioner / Architect Track

**Estado global: ⚪ En expansión.** Esta es la ruta con la brecha más grande frente a "experto": la
plataforma cubre hoy **vocabulario, mapas de proceso y diseño de integración** (🔵 Avanzado /
🟡 Awareness), pero **cero configuración de producto real** en Finance, Supply Chain Management,
Commerce o Project Operations.

> ⚠️ **Regla explícita de esta ruta:** no se presentará como "Ruta F&O Practitioner disponible" ni
> se le asignará una certificación de especialista hasta que existan laboratorios con
> configuración real verificable (tenant de práctica o simulación **muy** detallada paso a paso con
> capturas equivalentes a las de un tenant real) — no descripciones conceptuales de qué botón se
> apretaría.

| Tema | Madurez actual |
|---|---|
| Finance configuration fundamentals (legal entities, calendarios fiscales, catálogo de cuentas) | ⚪ En expansión |
| Legal entities (estructura multi-entidad, intercompany) | 🟡 Awareness (Módulo 59) |
| Financial dimensions (segmentos, jerarquías, valores por defecto) | ⚪ En expansión |
| Supply Chain configuration fundamentals (sitios, almacenes, ubicaciones) | ⚪ En expansión |
| Products and inventory (variantes, dimensiones de producto, políticas de reserva) | 🟡 Awareness (Módulo 59) |
| Commerce overview (POS, call center, canales unificados) | 🟡 Awareness |
| Project Operations (estructura de proyecto, WBS, facturación por hitos/tiempo) | 🟡 Awareness |
| Procure-to-Pay (paso a paso) | 🔵 Avanzado (Módulo 59, LAB-069) |
| Order-to-Cash (paso a paso) | 🔵 Avanzado (Módulo 59, LAB-069) |
| Record-to-Report (paso a paso) | 🔵 Avanzado (Módulo 59, LAB-069) |
| Inventory-to-Deliver / Project-to-Profit (paso a paso) | 🔵 Avanzado (Módulo 59, LAB-069) |
| Data entities (estructura, staging, validaciones) | 🟡 Awareness (Módulo 59) |
| Data Management Framework (importación masiva, manejo de errores) | 🟡 Awareness (LAB-064) |
| Dual-write setup awareness (mapas, entidades vinculadas) | 🔵 Avanzado (LAB-070, LAB-088) |
| Integration with Dataverse (patrones de integración, ownership de datos) | 🔵 Avanzado (Módulo 64, LAB-070, LAB-088) |
| LCS awareness (ciclo de vida, ambientes, actualizaciones) | ⚪ En expansión |
| Security (roles de seguridad F&O, duty/privilege) | ⚪ En expansión |
| Reporting (Financial Reporting, Power BI embebido en F&O) | ⚪ En expansión |

### Laboratorios propuestos (uno por proceso, cuando se implementen)

| Lab propuesto | Alcance previsto |
|---|---|
| F&O Finance Setup Walkthrough | Legal entity, calendario fiscal, catálogo de cuentas, dimensiones financieras — en un ambiente demo/sandbox real, no descripción |
| F&O Procure-to-Pay Hands-On | Orden de compra → recepción → factura de proveedor → pago, con capturas de cada paso en un ambiente real |
| F&O Order-to-Cash Hands-On | Cliente en `CustomersV3` → pedido de venta → picking → envío → factura → cobro, en ambiente real |
| F&O Inventory & Products Setup | Producto liberado, variantes, políticas de reserva, dimensiones de inventario |
| F&O Project Operations Setup | Estructura de proyecto, WBS, facturación por hitos, en ambiente real |

Cada uno de estos labs, al construirse, seguirá el mismo estándar de frontmatter, evidencia y
rúbrica que el resto de la plataforma — y solo entonces la fila correspondiente en la Matriz de
Competencias pasará de 🟡/⚪ a 🟢 **Cubierto**.

---

## 4. Ruta Business Applications Architect Enterprise

**Estado global: 🔵 Avanzado**, apoyada en CE + F&O ownership y capstone enterprise (Módulo 65, LAB-090).

| Tema | Madurez actual |
|---|---|
| CE + F&O architecture (visión combinada, no solo integración punto a punto) | 🔵 Avanzado (LAB-070) |
| System of record (qué sistema es dueño de qué dato) | 🔵 Avanzado (LAB-070) |
| Ownership de datos por entidad | 🔵 Avanzado (LAB-070) |
| Dual-write (diseño técnico) | 🔵 Avanzado (LAB-070) |
| Virtual tables | 🔵 Avanzado (LAB-070) |
| Integration patterns (síncrono/asíncrono, retry, circuit breaker) | 🔵 Avanzado (Módulo 25, LAB-070) |
| Azure integration (Service Bus, Logic Apps, Functions alrededor de D365) | 🟡 Awareness (Módulo 25/34) |
| Security across CE/F&O (modelo de seguridad combinado) | 🟡 Awareness |
| ALM across apps (pipelines que despliegan CE y F&O juntos) | 🟡 Awareness (LAB-019 cubre ALM de Power Platform, no F&O) |
| Data governance (calidad de datos, maestros compartidos) | 🟡 Awareness (Módulo 34/59) |
| Licensing awareness (CE vs. F&O vs. Power Platform combinados) | 🟡 Awareness |
| Roadmap enterprise (fases de adopción CE→F&O o al revés) | 🔵 Avanzado (Módulo 65, LAB-090) |

### Capstone implementado: Enterprise D365

**Objetivo:** integrar CE, Contact Center, Customer Insights, Field Service y F&O awareness en una
arquitectura de decisión con roadmap por fases, matriz Fit-Gap, ownership de datos, UAT y evidencia
de portafolio.

**Límite declarado:** el capstone es enterprise architecture y portafolio. No afirma configuración
profunda de Finance/SCM ni dual-write ejecutado en ambiente real.

---

## Cómo una ruta de este roadmap se "gradúa" a ruta profesional real

Una fila de este documento se mueve de ⚪/🟡 a 🔵/🟢 y la ruta correspondiente aparece en `/rutas`
solo cuando existe, para ese tema específico:

1. Un lab con frontmatter completo (`id`, `level`, `duration`, `product`, `certifications`, `role`,
   `prerequisites`) igual que cualquier otro lab de la plataforma.
2. Pasos numerados con datos de prueba concretos (no genéricos) y, cuando el tema depende de un
   tenant real, una nota explícita de qué parte es simulable y qué parte no.
3. Una sección de evidencia esperada verificable — no "entiende el concepto de X".
4. Una rúbrica de aprobación específica, agregada a
   [Rúbricas y Plantillas de Evaluación](RUBRICAS_PLANTILLAS_EVALUACION.md).
5. Una fila actualizada en la [Matriz de Competencias](MATRIZ_COMPETENCIAS.md) y, si aplica, una
   entrada en `professional-routes.ts` con su propio `capstoneLabSlug` — nunca reutilizando el
   capstone de otra ruta para simular cobertura que no existe.

Hasta que eso ocurra, este documento —no la matriz de competencias ni el portafolio— es la fuente
de verdad sobre qué falta.

## Relación con el resto de la plataforma

- **Matriz de Competencias**: cada fila 🔵/🟡/⚪ de este roadmap corresponde a una fila existente
  (o a una fila que todavía no existe) en la sección "Finance & Operations" o "Dynamics 365
  Customer Engagement" de esa matriz. Cuando este roadmap cambie de estado, esa matriz debe
  actualizarse en el mismo commit.
- **Portafolio**: `/portafolio` solo lista evidencia de rutas con capstone real. Ninguna de las
  cuatro rutas de este roadmap aparece ahí todavía — hacerlo antes de tener evidencia sería el
  mismo problema de sobre-promesa que este documento existe para prevenir.
- **Rutas profesionales** (`/rutas`): la ruta *Dynamics 365 Customer Engagement* ("Avanzado —
  especializaciones en expansión") y la ruta *Finance & Operations* ("Awareness avanzado —
  práctica en roadmap") ya citan este roadmap en su `gapNote` como el lugar donde se detalla, tema
  por tema, qué falta para llegar a cobertura completa.

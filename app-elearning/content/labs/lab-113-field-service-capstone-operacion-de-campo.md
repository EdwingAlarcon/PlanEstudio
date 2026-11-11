---
id: lab-113
title: "Capstone Field Service — Operación de Campo End-to-End"
level: "N6"
duration: 210
product: ["Dynamics 365 Field Service", "Field Service Mobile", "Dataverse"]
certifications: ["Dynamics 365 Field Service", "Field Operations"]
role: ["Field Service Consultant", "Solution Architect", "Consultor Funcional D365 CE"]
prerequisites:
  - "Módulo 59 estudiado: Field Service End-to-End"
  - "Lab 86 completado o revisado: Field Service Agreement + Preventive Maintenance"
  - "Lab 87 completado o revisado: Field Service Mobile Offline + Work Order Lifecycle"
  - "Recurso revisado: D365 Tenant Readiness Checklist"
lastVerified: "2026-11"
---

# Lab 113 — Capstone Field Service — Operación de Campo End-to-End

## Objetivo

Diseñar el flujo operativo completo de una unidad de Field Service que atiende tanto mantenimiento
preventivo por Agreement como llamadas correctivas ad-hoc, integrando generación de Work Order,
scheduling/asignación con criterios de Resource Scheduling Optimization (RSO), ejecución móvil
offline y cierre con inventario, facturación y KPIs de servicio.

Este capstone no debe repetir el contenido paso a paso de los Labs 86 y 87. Debe integrarlos en un
solo diseño operativo defendible: cómo conviven ambos orígenes de Work Order en el mismo calendario
de recursos, qué decisiones de scheduling y offline cambian según el origen, y cómo se cierra el
ciclo con evidencia de negocio (inventario, facturación, KPIs). Las matrices detalladas de Agreement
e Incident Type (Lab 86) y de perfil offline/lifecycle (Lab 87) viven en esos labs; aquí se citan y
se conectan, no se vuelven a construir desde cero.

## Escenario de negocio

SIT Field Ops mantiene equipos industriales de climatización (HVAC) para dos tipos de cliente:
cuentas con contrato de mantenimiento preventivo (Agreement, ver Lab 86) y cuentas sin contrato que
llaman de forma correctiva cuando un equipo falla. Los técnicos de campo trabajan la mayor parte de
su jornada sin señal estable (plantas industriales, sótanos técnicos, zonas rurales) y dependen de
Field Service Mobile con perfil offline (ver Lab 87). El área de despacho necesita decidir, para
cada Work Order nuevo —venga de un Agreement programado o de una llamada correctiva— qué técnico
asignar, con qué prioridad, y si conviene usar Resource Scheduling Optimization para optimizar la
ruta y la carga del día en vez de asignación manual. Al cierre, cada Work Order debe reflejar
repuestos consumidos, tiempo facturable y alimentar un tablero de KPIs de servicio (cumplimiento de
SLA, primera visita resuelta, utilización de técnicos).

## Gate de ambiente real

Antes de presentar este capstone como ejecución real, completa el gate **Field Service** del
recurso `/recursos/d365-tenant-readiness`, incluyendo la verificación de disponibilidad de Resource
Scheduling Optimization en el entorno. Sin Agreements activos, perfil offline probado, RSO habilitado
(o su ausencia documentada) y evidencia de cierre con inventario, la entrega es **Simulado**.

## 🔧 Requisitos de tenant y fallos frecuentes

### Licencia y rol mínimo

Field Service se licencia por usuario, no por recurso: cada técnico que aparece en el calendario de
programación necesita una licencia de usuario Field Service — la SKU completa "Dynamics 365 Field
Service" para técnicos internos, o "Dynamics 365 Field Service Contractor" (subconjunto) para
técnicos externos/terceros — no existe una licencia de "recurso" separada de la licencia de usuario;
sin la licencia de usuario correspondiente, el Bookable Resource no puede programarse aunque el
técnico tenga sesión activa en la app móvil. Resource Scheduling Optimization
es un **add-in de pago** de Field Service: se compra aparte en el **Microsoft 365 admin center** >
**Marketplace**, su precio depende del número de recursos cuyas agendas se optimizan y la licencia
incluye una instancia activa por tenant
([Learn: Get Resource Scheduling Optimization](https://learn.microsoft.com/dynamics365/field-service/rso-get-install)).
No asumas que está disponible solo porque Field Service lo está, ni que viene en la trial: la página
de la trial de Field Service no lo menciona. El **Scheduling Operations Agent**, que también optimiza
agendas, está en **preview** ([Learn](https://learn.microsoft.com/dynamics365/field-service/soa-overview)):
puedes citarlo como opción futura, no como base de un diseño productivo.

> **Sin licencia:** el capstone se entrega en papel (estado **Simulado**), con RSO "planeado, no
> disponible". La trial de 30 días de Field Service (**Try for free** en la
> [página de producto](https://www.microsoft.com/dynamics-365/products/field-service)) sirve para
> comprobar Agreements, Schedule Board y app móvil; crea su propio tenant, caduca tras 14 días sin uso
> y, con un correo personal, no se puede extender
> ([Learn: Trial FAQ](https://learn.microsoft.com/dynamics365/field-service/trial-faq)).

El rol mínimo para operar el ciclo completo de este capstone combina
"Field Service - Dispatcher" (creación, asignación y RSO) y "Field Service - Resource" (ejecución
móvil); "Field Service - Administrator" solo es necesario para configurar el perfil offline, las
reglas de programación y los parámetros de RSO, no para el uso diario.

### Configuración previa

- App Field Service instalada en el entorno de Dataverse, con Agreements, Incident Types, Bookable
  Resources y perfil offline ya configurados según los Labs 86 y 87 (o revisados si no se
  completaron en ese entorno).
- Resource Requirement y Schedule Board habilitados para el equipo de despacho.
- Si se va a evaluar RSO, confirmar con el administrador del entorno si el módulo está habilitado y
  qué parámetros (ventanas de trabajo, restricciones de viaje, prioridades) ya están cargados.
- Catálogo de productos/repuestos y reglas de precio disponibles para el paso de cierre/facturación.

### Fallos frecuentes de licencia, recurso y RSO

| Síntoma | Causa probable | Cómo comprobar | Cómo corregir |
|---|---|---|---|
| Un Work Order correctivo no puede asignarse al mismo técnico que ya tiene Work Orders de Agreement ese día | El Resource Requirement no considera la carga combinada de ambos orígenes porque se programan en calendarios o vistas separadas | Revisar el Schedule Board del recurso y confirmar que muestra Work Orders de ambos orígenes en una sola línea de tiempo | Asegurar que todos los Work Orders (Agreement y correctivos) usan el mismo Bookable Resource y el mismo Schedule Board, no vistas filtradas por origen |
| La opción de Resource Scheduling Optimization no aparece disponible en el entorno | RSO es un add-in de pago que no viene con Field Service: no se compró, o se compró pero no se desplegó en este ambiente (la licencia incluye una sola instancia activa por tenant) | Preguntar al administrador si el add-in figura entre las compras del **Microsoft 365 admin center** y en qué ambiente está desplegado | Solicitar la compra y el despliegue del add-in, o documentar el diseño de asignación como "planeado con RSO, ejecutado con el schedule assistant" ([Learn: Get RSO](https://learn.microsoft.com/dynamics365/field-service/rso-get-install)) |
| Un técnico queda sobreasignado el mismo día entre un Work Order de Agreement y uno correctivo urgente | No hay una regla de prioridad explícita entre mantenimiento programado y llamada correctiva | Revisar si el Incident Type o el Work Order tienen un campo de prioridad consistente entre ambos orígenes | Definir y aplicar una regla de prioridad de negocio (ej. correctivo crítico > preventivo vencido > preventivo dentro de ventana) antes de programar |
| El cierre del Work Order no descuenta el inventario del almacén del técnico | El producto no se pasó a **Line Status** = *Used*, no es de tipo *Inventory*, o la línea quedó sin **Warehouse**: el sistema propone el almacén del Bookable Resource del usuario que crea la línea, así que si el recurso no tiene almacén asociado no hay de dónde descontar | Abrir la línea de Work Order Product (estado, tipo y **Warehouse**) y el almacén del Bookable Resource | Asociar el almacén de la camioneta al Bookable Resource, exigir *Used* con almacén en la revisión antes de Posted y decidir **Use Of Products out of Stock** (**Restrict** o **Confirm**) ([Learn: products and services](https://learn.microsoft.com/dynamics365/field-service/create-product-or-service)) |
| El tablero de KPIs muestra cumplimiento de SLA solo para Work Orders de Agreement y no para correctivos | El SLA o el criterio de "primera visita resuelta" se configuró únicamente sobre el proceso de Agreement, sin extenderse al flujo correctivo | Revisar la configuración de SLA/Entitlement y confirmar si aplica a todos los Incident Types o solo a los de mantenimiento preventivo | Extender la definición de SLA y del criterio de KPI a ambos orígenes de Work Order, o documentar explícitamente que el correctivo usa un SLA distinto y por qué |

## Pasos detallados

### Paso 1 — Origen del Work Order

Diseña las dos rutas de creación de Work Order: (a) generado automáticamente desde un Agreement
activo (cita el diseño del Lab 86, no lo repitas) y (b) creado manualmente desde una llamada
correctiva entrante, con su propio Incident Type, prioridad y SLA. Define qué campos identifican el
origen en el propio Work Order para que despacho pueda distinguirlos en el mismo tablero.

### Paso 2 — Scheduling y criterios de asignación

Diseña la lógica de asignación de recurso para ambos orígenes en el mismo Schedule Board: reglas de
prioridad entre correctivo y preventivo, habilidades/Characteristics requeridas, disponibilidad
(Resource Hours) y, si el entorno tiene Resource Scheduling Optimization habilitado, qué parámetros
de RSO (ventana de tiempo, restricción de viaje, prioridad de servicio) usarías para optimizar la
ruta diaria del técnico frente a la asignación manual. Si RSO no está disponible en el tenant,
documenta el criterio manual equivalente y qué ganancia esperada se pierde sin RSO.

### Paso 3 — Ejecución móvil offline

Construye el flujo de ejecución en campo retomando el perfil offline del Lab 87: qué datos debe
tener descargados el técnico antes de salir (Work Order, tareas, activo, cliente, productos), qué
evidencia captura en campo (fotos, firma, inspection, repuestos consumidos) y cómo cambia ese flujo
según el Work Order sea de Agreement (checklist de mantenimiento preventivo) o correctivo (diagnóstico
libre). No rediseñes el perfil offline completo — referencia el del Lab 87 y señala únicamente los
ajustes que exige integrar ambos orígenes.

### Paso 4 — Sincronización y contingencia

Define qué ocurre si el técnico cierra un Work Order sin conexión y hay conflicto al sincronizar
(por ejemplo, el mismo repuesto fue consumido por otro técnico desde el almacén compartido) y cómo
se resuelve sin duplicar consumo de inventario ni perder la evidencia capturada en campo.

### Paso 5 — Cierre, inventario y facturación

Diseña el cierre del Work Order: descuento de inventario del almacén del técnico, tiempo facturable
vs. cubierto por Agreement (un Work Order de Agreement normalmente no se factura igual que uno
correctivo fuera de contrato), y el criterio para decidir cuándo un consumo de repuesto queda
cubierto por el contrato y cuándo se factura aparte.

### Paso 6 — KPIs de servicio

Define un tablero de KPIs de operación de campo que cubra ambos orígenes de Work Order: cumplimiento
de SLA, porcentaje de "primera visita resuelta", utilización de técnicos (tiempo productivo vs.
viaje) y cantidad de Work Orders reprogramados por falta de repuesto o de disponibilidad. Cada KPI
debe indicar su fuente de dato (tabla/campo) y su frecuencia de revisión.

### Paso 7 — Registro de decisiones

Construye un decision log con al menos 6 decisiones que conecten explícitamente este capstone con
los Labs 86 y 87: por ejemplo, la regla de prioridad entre preventivo y correctivo, el criterio de
uso o no de RSO, y la política de facturación de repuestos. Cada entrada debe indicar la decisión,
la alternativa descartada, el riesgo aceptado y la evidencia del Lab 86 u 87 en la que se apoya.

## Validaciones

- [ ] El diseño distingue Work Orders de Agreement y correctivos en el mismo Schedule Board.
- [ ] Existen criterios explícitos de prioridad y asignación (manual o con RSO) entre ambos orígenes.
- [ ] El flujo de ejecución móvil offline referencia el perfil del Lab 87 sin duplicarlo.
- [ ] Hay un plan de conflicto de sincronización que evita duplicar consumo de inventario.
- [ ] El cierre distingue consumo cubierto por Agreement de consumo facturable.
- [ ] El tablero de KPIs cubre ambos orígenes de Work Order con fuente de dato por KPI.
- [ ] El decision log conecta cada decisión con evidencia de los Labs 86 y/o 87.
- [ ] El estado de ejecución está marcado como Simulado, Sandbox real o Productivo controlado, incluyendo si RSO estuvo disponible o no.

## Evidencia esperada

- Diagrama del flujo end-to-end (Agreement/correctivo → scheduling → ejecución móvil → cierre → KPIs).
- Matriz de criterios de asignación/scheduling (manual y RSO si aplica).
- Checklist de ejecución móvil offline diferenciado por origen de Work Order.
- Plan de conflicto de sincronización e inventario.
- Definición de tablero de KPIs con fuente de dato por métrica.
- Decision log integrado con referencias a evidencias de los Labs 86 y 87.

## Rúbrica de aprobación

| Criterio | Peso | Aprobado mínimo |
|---|---:|---|
| Integración de orígenes (Agreement + correctivo) | 25% | El mismo Schedule Board y las mismas reglas de prioridad cubren ambos orígenes sin tratarlos como sistemas separados |
| Scheduling y RSO | 20% | Criterio de asignación explícito, con RSO si el tenant lo permite o alternativa manual justificada si no |
| Ejecución móvil offline | 15% | Referencia correctamente el perfil del Lab 87 y solo agrega los ajustes que exige integrar ambos orígenes |
| Cierre, inventario y facturación | 15% | Distingue con claridad consumo cubierto por Agreement de consumo facturable |
| KPIs de servicio | 15% | Cada KPI tiene fuente de dato y cubre ambos orígenes de Work Order |
| Decision log | 10% | 6+ decisiones con evidencia de los Labs 86/87 referenciada |

Aprobación: mínimo 65/100 y ningún criterio en nivel 0. Nivel profesional/excelencia: ≥85/100 con el
estado real de RSO (disponible/no disponible) declarado explícitamente y sin ninguna capacidad
marcada como "Productivo controlado" sin evidencia que lo sustente.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| Tratar Agreement y correctivo como dos procesos independientes con calendarios separados | Se diseña cada origen por separado sin pensar en la carga combinada del técnico | Unificar el Schedule Board y definir una única regla de prioridad que compare ambos orígenes |
| Asumir que RSO está disponible sin verificarlo | Se da por hecho que toda licencia de Field Service incluye RSO habilitado | Verificar explícitamente en la configuración del entorno y documentar el estado real antes de diseñar sobre RSO |
| Duplicar el contenido del Lab 87 en vez de referenciarlo | Se repite la matriz completa de perfil offline como si fuera nueva | Referenciar el Lab 87 y describir solo los ajustes que exige la integración de ambos orígenes |
| Facturar o no facturar repuestos sin una regla clara | Se decide caso por caso al momento del cierre en vez de definir la política antes | Definir de antemano qué consumo queda cubierto por el Agreement y cuál se factura aparte |
| KPIs que solo miden el proceso de Agreement | El tablero se diseña pensando solo en mantenimiento preventivo | Extender cada KPI para que cubra también los Work Orders correctivos, o justificar por qué no aplica |

## Reto adicional

Agrega un escenario de escasez de repuestos: un Work Order correctivo urgente necesita un repuesto
que no está en el almacén del técnico asignado sino en el de otro técnico o en la bodega central.
Diseña la decisión: reasignar el Work Order a otro técnico, transferir el repuesto, o reprogramar —
y qué impacto tiene cada opción sobre el KPI de "primera visita resuelta".

## Solución de referencia

Después de completar tu intento, compara tu entrega con
[Soluciones de Referencia para Capstones](/recursos/soluciones-referencia-capstones#lab-113--capstone-field-service-operacion-de-campo-end-to-end).
No copies la solución como entregable; úsala para detectar decisiones sin justificar, casos negativos
faltantes o evidencia insuficiente.

## Competencias desarrolladas

- Integración operativa de Field Service (Agreements + correctivo).
- Scheduling y Resource Scheduling Optimization.
- Diseño de KPIs de operación de campo.
- Portafolio profesional defendible.

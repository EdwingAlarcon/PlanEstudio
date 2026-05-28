# CASOS REALES DE NEGOCIO — Power Platform & Dynamics 365
**25+ casos por industria** | Análisis, solución y resultados medibles

---

## Industria Financiera

### CASO-FIN-01: Automatización de aprobación de créditos
**Empresa:** Cooperativa de ahorro y crédito, 15,000 socios, Colombia  
**Contexto:** Los analistas de crédito revisaban manualmente cada solicitud, consultaban el historial en papel, llamaban al buró por teléfono y tardaban 3-5 días por solicitud.

**Problema medido:**
- Tiempo de aprobación: 3-5 días hábiles
- Costo por solicitud (tiempo analista): $45 USD
- Tasa de error en digitación: 4%
- 20% de solicitudes rechazadas por inconsistencias corregibles

**Solución implementada:**
```
Stack: Power Pages + Dataverse + Power Automate + AI Builder + Plugin C#

1. Portal Power Pages para solicitud digital del socio
    - Formulario con validación automática de datos
    - Upload de documentos (comprobante de ingresos, ID)
    - AI Builder extrae ingresos automáticamente del documento

2. Plugin C# Pre-Create valida:
    - Historial del socio en Dataverse (pagos anteriores)
    - Score calculado por modelo de predicción AI Builder
    - Reglas automáticas: si score > 750 → auto-aprobación

3. Power Automate con flujo de aprobación escalado:
    - Auto-aprobación: < 5 minutos (70% de casos)
    - Aprobación analista: analista recibe toda la info preparada
    - Aprobación gerencia: solo si monto > $50,000

4. Notificaciones automáticas en cada cambio de estado
5. Dashboard Power BI para monitoreo en tiempo real
```

**Resultados:**
- Tiempo de aprobación: de 3-5 días a 4 horas promedio (casos que requieren analista)
- 70% de solicitudes aprobadas automáticamente en < 5 minutos
- Costo por solicitud: de $45 a $12 USD (-73%)
- Tasa de error: de 4% a 0.3%
- NPS de socios: de 32 a 71

---

### CASO-FIN-02: Detección de fraude en tiempo real
**Empresa:** Banco digital con 500K transacciones diarias, México

**Problema:** El sistema de detección de fraude legacy tardaba 72 horas en generar alertas. Los fraudes se detectaban cuando ya era tarde para bloquear.

**Solución:**
```
Event-driven con Azure Event Grid + AI Builder + D365 Customer Service

1. Cada transacción dispara evento a Event Grid
2. Azure Function evalúa el patrón con modelo AI Builder:
    - Patrones anómalos: transacción en país diferente, monto inusual, hora inusual
3. Si score de fraude > 0.85:
    - Bloquear tarjeta vía API del core bancario
    - Crear caso en D365 Customer Service (prioridad urgente)
    - Push notification al cliente via Copilot Studio (Teams/WhatsApp)
4. Power BI en tiempo real para el equipo de fraude
```

**Resultados:**
- Tiempo de detección: de 72 horas a 45 segundos promedio
- Fraudes bloqueados a tiempo: de 15% a 89%
- Falsos positivos: 2.3% (el modelo mejora con retroalimentación mensual)
- Ahorro anual en fraudes: $2.3M USD

---

### CASO-FIN-03: Conciliación bancaria automatizada
**Empresa:** Empresa de servicios con 8,000 transacciones mensuales

**Problema:** Contador dedicaba 40 horas/mes a conciliar movimientos bancarios con el ERP. El proceso era 100% manual en Excel.

**Solución:**
```
Power Automate Desktop (RPA) + Power Automate Cloud + Dataverse

1. RPA extrae los movimientos del portal bancario (sin API)
    - Power Automate Desktop automatiza el login, descarga del CSV
    - Programado cada noche a las 11PM

2. Power Automate Cloud procesa el CSV:
    - Parse del archivo → identificar cada transacción
    - Buscar la factura correspondiente en Dataverse
    - Marcar como conciliada si el monto y referencia coinciden
    - Crear "Excepción" si no hay match

3. Al día siguiente el contador solo revisa las excepciones:
    - Dashboard Power BI: movimientos conciliados vs excepciones
    - Canvas App para gestionar las excepciones manualmente

```

**Resultados:**
- Horas mensuales de conciliación: de 40 a 3 (solo excepciones)
- Tasa de conciliación automática: 94%
- Errores de conciliación detectados: 100% (antes se pasaban por alto)
- ROI: el proyecto se pagó en el primer mes

---

## Manufactura y Operaciones

### CASO-MAN-01: Control de calidad en línea de producción
**Empresa:** Planta de manufactura de autopartes, 500 empleados

**Problema:** Los defectos de calidad se detectaban al final de la línea, cuando ya se habían producido 200+ piezas defectuosas. El proceso de reporte en papel tardaba 48 horas en llegar a la gerencia.

**Solución:**
```
Canvas App (offline) + AI Builder Object Detection + D365 Field Service

1. Operarios registran defectos en Canvas App (tablet en la línea):
    - Funciona offline (sin WiFi en el piso de planta)
    - Fotos de defectos → AI Builder Object Detection clasifica tipo de defecto
    - Se sincroniza automáticamente cuando hay conexión

2. Plugin C# Pre-Create analiza si es defecto crítico:
    - Si es crítico → envía alerta inmediata al supervisor vía Teams
    - Crea orden de mantenimiento en D365 Field Service automáticamente

3. Power BI en tiempo real para gerencia:
    - Defectos por línea, turno, tipo
    - Pareto de causas raíz
    - Tendencia vs objetivo de calidad

4. Power Automate genera reporte automático de turno
```

**Resultados:**
- Tiempo de detección de defecto crítico: de 48 horas a 3 minutos
- Piezas defectuosas por incidente: de 200+ a < 15 (paro inmediato)
- Costo de scrap mensual: reducido 65%
- Tiempo de reporte: de 48 horas a automático en tiempo real

---

### CASO-MAN-02: Mantenimiento predictivo
**Empresa:** Empresa de energía con 200 activos industriales

**Problema:** Mantenimiento reactivo = máquinas que se rompen en producción causando paradas no planificadas de 8-12 horas. Costo por hora de parada: $15,000.

**Solución:**
```
IoT Hub + Dataverse + D365 Field Service + AI Builder Prediction

1. Sensores IoT envían telemetría a Azure IoT Hub
    - Temperatura, vibración, presión, RPM, horas de operación

2. Azure Stream Analytics detecta anomalías en tiempo real:
    - Temperatura > umbral → alerta inmediata
    - Patrón de vibración anormal → predicción de falla

3. Azure Function crea Order de Trabajo en D365 Field Service:
    - Mantenimiento preventivo programado con 72h de anticipación
    - Asigna al técnico disponible con la skill correcta
    - Reserva las piezas de repuesto en el inventario

4. AI Builder Prediction (entrenado con historial de 3 años):
    - Predice probabilidad de falla en los próximos 30 días
    - Score > 70% → genera automáticamente solicitud de mantenimiento

5. Power BI muestra salud de activos en tiempo real
```

**Resultados:**
- Paradas no planificadas: reducidas 78%
- Ahorro anual (paradas evitadas): $2.1M USD
- Costo de mantenimiento: reducido 30% (preventivo vs reactivo es más barato)
- Vida útil de activos: extendida en promedio 18 meses

---

### CASO-MAN-03: Gestión de inventario con escaneo de código de barras
**Empresa:** Distribuidora con 3 bodegas y 15,000 SKUs

**Problema:** Inventario en Excel compartido entre 3 bodegas. Discrepancias constantes. Conteo físico tardaba 2 semanas y requería cerrar las bodegas.

**Solución:**
```
Canvas App offline-capable + Dataverse + Power BI

1. Canvas App para bodegueros:
    - Escaneo de código de barras con la cámara del celular
    - Registro de entradas, salidas, traslados
    - Funciona offline → sincroniza cuando hay conexión WiFi

2. Dataverse como sistema de inventario:
    - Stock en tiempo real por bodega
    - Historial completo de movimientos
    - Reglas de negocio: stock mínimo → alerta automática de reorden

3. Power Automate:
    - Si stock < mínimo → crear orden de compra borrador automáticamente
    - Notificar al jefe de bodega via Teams

4. Power BI:
    - Rotación de inventario por SKU
    - Valor de inventario en tiempo real
    - Productos sin movimiento en 60+ días
```

**Resultados:**
- Discrepancias de inventario: de 8% a 0.4%
- Tiempo de conteo físico: de 2 semanas a 4 horas (inventario cíclico)
- Reorden automático: 85% de las órdenes generadas sin intervención humana
- Reducción de stockouts: 60%

---

## Servicios Profesionales

### CASO-SER-01: Gestión de proyectos para firma de consultoría
**Empresa:** Firma de consultoría tecnológica, 150 consultores, 40 proyectos simultáneos

**Problema:** Proyectos gestionados en SharePoint + Excel + email. Sin visibilidad centralizada de horas, costos y avance. Facturación con 2 semanas de retraso porque los timesheets llegaban tarde o incompletos.

**Solución:**
```
D365 Project Operations (o tablas personalizadas) + Canvas App + Power BI + Power Automate

1. Modelo de datos en Dataverse:
   Proyecto → Fase → Tarea → Asignación → Timesheet → Factura

2. Canvas App para consultores (mobile-first):
    - Registro de horas por proyecto/tarea (< 2 min por día)
    - Modo offline para consultores en sitio del cliente
    - Recordatorio automático si no ingresó horas (Power Automate, viernes 4PM)

3. Model-Driven App para Project Managers:
    - Vista completa del proyecto: avance, costos, horas reales vs estimadas
    - BPF: Propuesta → Kick-off → Ejecución → Cierre

4. Power Automate:
    - Flujo de aprobación de timesheets (manager aprueba semanalmente)
    - Generación automática de pre-factura al cerrar semana

5. Power BI para Dirección:
    - Utilización de consultores por proyecto
    - Margen por proyecto en tiempo real
    - Pipeline de proyectos próximos
```

**Resultados:**
- Retraso en facturación: de 2 semanas a 2 días
- Visibilidad del avance de proyectos: en tiempo real (antes mensual)
- Utilización de consultores: aumentó de 68% a 79% (visibilidad de disponibilidad)
- Horas en gestión administrativa: reducidas 40%

---

### CASO-SER-02: Portal de cliente para firma de abogados
**Empresa:** Firma de abogados con 500 clientes activos

**Problema:** Los clientes llamaban constantemente preguntando el estado de sus casos. La recepción dedicaba 3 horas diarias solo a estas llamadas. Los expedientes existían en papel y PDFs en carpetas locales.

**Solución:**
```
Power Pages + Dataverse + Azure AD B2C + Azure Blob Storage

1. Modelo de datos:
   Caso (Dataverse) → Documento (referencia a Azure Blob) → Actualización (timeline)

2. Portal Power Pages (Azure AD B2C para clientes):
    - El cliente ve el estado de sus casos en tiempo real
    - Descarga documentos (contratos, escrituras) de forma segura (SAS tokens de Azure Blob)
    - Sube documentos requeridos directamente al expediente
    - Timeline de actualizaciones del caso

3. Model-Driven App para abogados:
    - Vista completa del expediente
    - Actualizar estado → portal del cliente se actualiza automáticamente
    - Facturas y honorarios en el mismo sistema

4. Power Automate:
    - Cuando el abogado actualiza el estado → email automático al cliente
    - Recordatorio de documentos pendientes cada 7 días
    - Alerta de fechas de audiencia (2 días antes)
```

**Resultados:**
- Llamadas de estado: reducidas 70%
- Satisfacción del cliente (NPS): de 35 a 72
- Tiempo perdido en recepciones: de 3h/día a 30 min/día
- Extravío de documentos: 0 (antes: 2-3 por mes)

---

### CASO-SER-03: Automatización de RFP (propuestas comerciales)
**Empresa:** Empresa de software con proceso de propuestas manual

**Problema:** Una propuesta comercial compleja tardaba 3-5 días en prepararse. Un vendedor senior dedicaba 40% de su tiempo a copiar/pegar de propuestas anteriores en Word.

**Solución:**
```
Dataverse + Power Automate + Azure OpenAI + Power Pages (extranet)

1. Repositorio de propuestas en Dataverse:
    - Biblioteca de secciones reutilizables por industria y tipo de proyecto
    - Precios actualizados centralmente (una fuente de verdad)

2. Canvas App "Generador de Propuestas":
    - Seleccionar cliente, tipo de proyecto, servicios incluidos
    - Azure OpenAI personaliza el texto según el perfil del cliente
    - Vista previa de la propuesta en tiempo real

3. Power Automate genera el documento Word/PDF:
    - Usando plantilla con marcadores de posición
    - Datos del cliente, precios, alcance insertados automáticamente

4. Power Pages extranet:
    - El cliente recibe un link seguro para ver y aprobar la propuesta online
    - Firma digital integrada (DocuSign o Adobe Sign vía conector)

5. Si el cliente aprueba → Power Automate crea oportunidad en D365 Sales
```

**Resultados:**
- Tiempo de preparación de propuesta: de 3-5 días a 4 horas
- Propuestas enviadas por mes: aumentó de 8 a 22
- Consistencia de precios: 100% (antes había descuentos no autorizados)
- Tasa de cierre: mejoró de 28% a 35% (más tiempo para vender, menos para documentar)

---

## Retail y Comercio

### CASO-RET-01: Omnichannel para cadena de tiendas
**Empresa:** Cadena de retail con 50 tiendas, 800 empleados

**Problema:** El cliente compraba online pero el inventario no estaba sincronizado con las tiendas físicas. Los vendedores en tienda usaban Excel para anotar solicitudes especiales. Cero visibilidad del cliente cross-canal.

**Solución:**
```
D365 Customer Service + Canvas App + Dataverse + Copilot Studio + Power BI

1. Perfil 360° del cliente en Dataverse:
    - Historial de compras online + físicas unificado
    - Preferencias y tallas guardadas
    - Puntos de fidelidad calculados automáticamente

2. Canvas App para vendedores en tienda:
    - Buscar cliente por nombre/email → ver perfil completo
    - Consultar stock en tiempo real (integración ERP)
    - Solicitar traslado desde otra tienda si no hay stock

3. D365 Customer Service para soporte omnichannel:
    - Email, chat web, WhatsApp → todos en un solo panel
    - El agente ve el historial completo antes de responder

4. Copilot Studio:
    - Bot en WhatsApp: consulta de estado de pedido, guía de tallas
    - Bot en el sitio web: preguntas frecuentes + escalamiento a agente

5. Power BI:
    - Dashboard de ventas por canal, tienda, vendedor
    - Análisis de conversión online vs física
```

**Resultados:**
- Venta cruzada (cross-sell) en tienda: +23% (vendedores ven historial del cliente)
- Tiempo de resolución de quejas: de 48h a 4h (datos unificados)
- NPS: de 41 a 68
- Devoluciones por "no encontré mi talla": -35% (bot de guía de tallas)

---

### CASO-RET-02: Gestión de promotores de campo
**Empresa:** Empresa de consumo masivo con 200 promotores en 5 ciudades

**Problema:** Los promotores llenaban formularios en papel, los enviaban por foto en WhatsApp, y los digitaban manualmente en el sistema. Los reportes de campo llegaban con 3 días de retraso.

**Solución:**
```
Canvas App offline + Dataverse + Power Automate + Power BI

1. Canvas App mobile-first para promotores:
    - Check-in con GPS (registro de ubicación y tiempo de visita)
    - Fotografiar exhibición del producto
    - Registrar precios de competencia
    - Reportar stock faltante o dañado
    - Funciona sin internet → sincroniza al salir de la tienda

2. AI Builder Object Detection:
    - Analiza la foto de la exhibición
    - Detecta si todos los SKUs están presentes
    - Detecta espacio de anaquel correcto

3. Power BI tiempo real para supervisores:
    - Mapa de cobertura de visitas del día
    - Alertas de tiendas no visitadas según ruta planificada
    - Comparativo de precios vs competencia

4. Power Automate:
    - Si se detecta producto agotado → notificar al distribuidor de zona
    - Reporte automático diario por supervisor
```

**Resultados:**
- Tiempo de reporte: de 3 días a tiempo real
- Cobertura de visitas: de 78% a 94% (visibilidad de GPS presiona el cumplimiento)
- Fraude de visitas (promotores que no iban): detectado y eliminado (GPS)
- Out-of-stock resueltos el mismo día: 70% (antes semana siguiente)

---

## Salud

### CASO-SAL-01: Gestión de citas y pacientes
**Empresa:** Red de clínicas con 15 sedes, 200,000 pacientes activos

**Problema:** Las citas se agendaban por teléfono, se registraban en Excel, y no había historia clínica unificada. Un paciente que visitaba otra sede de la misma red era tratado como paciente nuevo.

**Solución:**
```
D365 Customer Service + Power Pages + Dataverse + Canvas App + Copilot Studio

1. Perfil único del paciente en Dataverse:
    - Historia clínica básica unificada entre sedes
    - Historial de citas, diagnósticos, recetas (no reemplaza sistema clínico, lo complementa)
    - Alergias y medicamentos actuales

2. Power Pages para pacientes:
    - Azure AD B2C para registro y login
    - Agendar cita sin llamar (24/7)
    - Ver resultados de exámenes
    - Solicitar reposición de medicamentos crónicos

3. Copilot Studio (WhatsApp):
    - "Quiero una cita con cardiología para la próxima semana"
    - El bot consulta disponibilidad en tiempo real y agenda
    - Recordatorio automático 24h antes

4. Canvas App para recepcionistas:
    - Check-in digital del paciente (escaneo de ID)
    - Vista de citas del día por médico
    - Registro de llegada y tiempo de espera

5. Power BI para dirección médica:
    - Ocupación por especialidad y sede
    - Tiempo de espera promedio
    - No-shows y cancelaciones
```

**Resultados:**
- Citas agendadas por portal/bot: 45% del total (antes 0%)
- Llamadas de agendamiento: reducidas 45%
- No-shows: de 22% a 14% (recordatorios automáticos)
- Tiempo de check-in: de 8 minutos a 90 segundos

---

### CASO-SAL-02: Gestión de ensayos clínicos
**Empresa:** CRO (Contract Research Organization) con 5 estudios activos simultáneos

**Problema:** Los datos de pacientes en ensayos se recopilaban en papel (CRF - Case Report Forms), se digitalizaban manualmente, y la base de datos del estudio estaba desactualizada semanas o meses.

**Solución:**
```
Dataverse (CMK) + Canvas App + Power Automate + Power BI con RLS

NOTA: Los datos de pacientes son extremadamente sensibles (HIPAA + regulación local)

1. Dataverse con CMK (Customer-Managed Keys):
    - Todos los datos del ensayo cifrados con clave del cliente
    - Auditoría completa de cada acceso y cambio

2. Canvas App para investigadores en sitio:
    - e-CRF (electronic Case Report Form) digital
    - Validaciones inmediatas (lógica de skip patterns)
    - Solo campos autorizados por protocolo visibles por rol

3. Model-Driven App para sponsors y monitores:
    - Vista de queries (preguntas sobre inconsistencias de datos)
    - Proceso de resolución de queries

4. Power BI con RLS:
    - Sponsor ve solo sus estudios
    - Investigador de sitio solo ve sus pacientes
    - Monitor ve el sitio que supervisa
    - Regulador (FDA/INVIMA) ve solo el resumen de seguridad

5. Power Automate:
    - Alerta de evento adverso serio → notificación en < 24h (requerimiento regulatorio)
    - Vencimiento de documentos → recordatorio 30 días antes
```

**Resultados:**
- Tiempo de captura de datos: de semanas a horas
- Data quality (queries): reducidas 60% (validaciones en tiempo real)
- Cumplimiento regulatorio: 100% en auditoría de la FDA
- Costo del estudio: reducido 25% (menos trabajo manual de monitoreo)

---

## Gobierno y Sector Público

### CASO-GOB-01: Sistema de PQRS ciudadanas
**Empresa:** Alcaldía municipal, 300,000 ciudadanos

**Problema:** Las Peticiones, Quejas, Reclamos y Sugerencias llegaban en papel, se perdían, no se respondían en los términos legales (15 días hábiles), y generaban multas de la Defensoría del Pueblo.

**Solución:**
```
Power Pages + D365 Customer Service + Dataverse + Power Automate + Power BI

1. Portal ciudadano (Power Pages, sin autenticación):
    - Radicación online 24/7
    - Adjuntar documentos
    - Número de radicado inmediato
    - Consulta del estado por número de radicado

2. D365 Customer Service para funcionarios:
    - Bandeja de trabajo con SLAs configurados (15 días hábiles)
    - Routing a la dependencia correcta según tipo de PQRS
    - Templates de respuesta

3. Power Automate:
    - Alerta 3 días antes de vencer el plazo legal
    - Si vence → escalamiento automático al supervisor
    - Respuesta oficial enviada por email al ciudadano
    - Si requiere firma → integración con firma digital oficial

4. Power BI para control interno:
    - PQRS por tipo, dependencia, estado
    - Indicadores de cumplimiento de plazos
    - Temas más recurrentes (insumo para mejoras de servicio)
```

**Resultados:**
- Respuesta en término legal: de 62% a 97%
- Multas por incumplimiento: de 8 al año a 0
- Ciudadanos que consultan en persona: reducidos 40% (portal de consulta online)
- Tiempo de asignación de PQRS: de 3 días (manual) a automático

---

### CASO-GOB-02: Control de contratos gubernamentales
**Empresa:** Entidad departamental con 500 contratos activos anuales

**Problema:** Los contratos se gestionaban en Excel. Las pólizas vencían sin que nadie las renovara, generando riesgo legal. Las actas de interventoría llegaban tarde o no llegaban.

**Solución:**
```
Dataverse + Model-Driven App + Power Automate + Power BI

1. Modelo de datos completo:
   Contrato → Póliza → Acta → Pago → Modificación

2. Model-Driven App para supervisores de contrato:
    - Vista de todos los contratos con semáforo (vigente/por vencer/vencido)
    - Registro de actas de interventoría con firma digital
    - Historial completo de modificaciones (adiciones, prórrogas)

3. Power Automate:
    - 60 días antes de vencer contrato → alerta al supervisor
    - 30 días antes → alerta a Director
    - 15 días antes → alerta al Director Jurídico y Representante Legal
    - Póliza por vencer → notificación a contratista

4. Power BI:
    - Estado de ejecución presupuestal vs contratos
    - Alertas de contratos con ejecución < 50% faltando < 30% del plazo
    - Mapa de riesgo contractual
```

**Resultados:**
- Pólizas vencidas sin renovar: de 12 al año a 0
- Actas de interventoría en término: de 70% a 98%
- Procesos disciplinarios por negligencia contractual: 0 en 2 años
- Tiempo de generación de informes de gestión: de 2 semanas a automático

---

## Educación

### CASO-EDU-01: Plataforma de admisiones universitaria
**Empresa:** Universidad privada con 3,000 admisiones anuales

**Problema:** El proceso de admisiones era 100% manual: formularios en papel, documentos físicos, comités de admisión con actas en Word. El tiempo de respuesta al aspirante: 3-6 semanas.

**Solución:**
```
Power Pages + Dataverse + Power Automate + AI Builder + Canvas App

1. Portal de admisiones (Power Pages + Azure AD B2C):
    - Formulario online completo con carga de documentos
    - Pago de derechos de admisión integrado (pasarela de pagos)
    - Seguimiento del estado en tiempo real
    - Descarga de carta de admisión/rechazo

2. AI Builder Document Processing:
    - Extrae datos del diploma de bachillerato automáticamente
    - Verifica que el promedio cumple el mínimo requerido
    - Valida que los documentos son legibles

3. Proceso automatizado de evaluación:
    - Checklist automático de documentos completos
    - Cálculo automático de puntaje con fórmula definida
    - Si puntaje > mínimo → carta de admisión condicional automática

4. Canvas App para comité de admisiones:
    - Casos que requieren evaluación manual
    - Votación digital del comité con registro de decisión

5. Power Automate:
    - Notificaciones de estado al aspirante
    - Recordatorio de documentos faltantes
    - Generación automática de carta oficial (Word + firma digital)
```

**Resultados:**
- Tiempo de respuesta: de 3-6 semanas a 5-7 días hábiles
- Casos que requieren evaluación humana: 30% (70% automáticos)
- Satisfacción de aspirantes: NPS de 12 a 58
- Documentos perdidos: 0 (antes promedio de 5 por semana)

---

## Energía y Utilities

### CASO-ENE-01: Gestión de activos de red eléctrica
**Empresa:** Empresa de distribución eléctrica, 800,000 usuarios, Colombia

**Problema:** El inventario de activos de la red (transformadores, postes, medidores) estaba en un sistema legacy de 20 años. Los técnicos no podían consultar la información en campo. Las órdenes de trabajo en papel se perdían.

**Solución:**
```
D365 Field Service + Canvas App offline + Azure Maps + Power BI

1. Migrar activos al Dataverse de D365 Field Service:
    - 450,000 activos georreferenciados con coordenadas GPS
    - Historial completo de mantenimientos por activo

2. Canvas App para técnicos en campo:
    - Ver activos cercanos en mapa (Azure Maps)
    - Escanear QR del activo → ver historial completo
    - Registrar trabajo realizado con fotos
    - Funciona sin internet (zonas rurales sin cobertura)

3. D365 Field Service:
    - Órdenes de trabajo generadas automáticamente desde el SCADA
    - Programación optimizada de técnicos con routing automático
    - SLAs por tipo de avería (crítica: 4h, normal: 24h, planificada: 72h)

4. Power BI geoespacial:
    - Mapa de calor de averías por zona
    - Tiempo de restauración promedio por brigada
    - Activos con más de X mantenimientos en el año → candidatos a reemplazo
```

**Resultados:**
- Tiempo de restauración de servicio: reducido 32%
- Extravío de órdenes de trabajo: 0
- Activos sin información de mantenimiento: de 40% a 3%
- Satisfacción del técnico: de 2.8 a 4.3/5 (herramienta funciona en campo)

---

## Lecciones Aprendidas Transversales

### Las 5 razones más comunes por las que los proyectos Power Platform fallan

**1. El modelo de datos cambia después del desarrollo**
```
Síntoma: A mitad del proyecto el cliente "recuerda" un requisito importante 
que cambia una relación fundamental.
Prevención: Workshop de diseño de datos en semana 1, antes de cualquier 
desarrollo. Congelar el modelo en el ADR-002 con sign-off del cliente.
```

**2. Los usuarios no adoptan la nueva herramienta**
```
Síntoma: El sistema funciona perfecto pero los usuarios siguen en Excel.
Prevención: Involucrar usuarios clave desde el diseño. Hacer pruebas de usuario
reales, no demostraciones. Migrar datos históricos para que el sistema 
ya tenga información útil desde el día 1.
```

**3. El pipeline no existía y el deploy a PROD se hace manualmente**
```
Síntoma: El primer deploy "manual de emergencia" rompe algo en producción.
Prevención: CI/CD desde el sprint 1, no al final. Si el pipeline no es 
posible desde el inicio, al menos exportar/importar soluciones managed siempre.
```

**4. Sin manejo de errores en los flujos de Power Automate**
```
Síntoma: El director de finanzas llama porque "no llegó la aprobación" 
de la propuesta. El flujo falló silenciosamente hace 3 días.
Prevención: Scope Try/Catch en todos los flujos de producción. Alerta 
automática al equipo técnico cuando un flujo falla.
```

**5. DLP no configurado o demasiado permisivo en entornos de producción**
```
Síntoma: Un ciudadano desarrollador conecta datos de Dataverse a Gmail 
y los envía a destinatarios externos sin saberlo.
Prevención: DLP antes de que el primer maker llegue al ambiente. 
CoE Starter Kit para visibilidad continua.
```

### Los 5 factores de éxito más consistentes

1. **Sponsor ejecutivo que usa la herramienta** — cuando el director usa el dashboard, todos lo usan.
2. **Usuario clave en el equipo de proyecto** — no como cliente externo sino como miembro.
3. **MVP funcional en < 6 semanas** — mostrar valor rápido genera confianza y feedback real.
4. **Datos migrados desde el inicio** — el sistema con datos históricos tiene 10x más adopción.
5. **Formación en el contexto del trabajo, no en abstracto** — entrenar con los datos reales del usuario, no con ejemplos genéricos.

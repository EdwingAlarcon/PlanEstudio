---
moduleId: 64
title: "Integración CE + Finance & Operations — Dual-write, DMF y Ownership"
level: "d365"
certification: "D365 Especialización Integration"
estimatedMinutes: 14
slug: "integracion-ce-fo-dual-write-dmf"
---
### 🎯 Objetivo
Diseñar una integración responsable entre Dynamics 365 Customer Engagement y Finance & Operations definiendo sistema dueño, patrón de integración, dirección de datos, seguridad, ALM y riesgos operativos, produciendo una matriz de ownership completa y un diagrama de flujo end-to-end defendibles frente a un arquitecto F&O real.

### 📖 Conceptos Clave
- **System of record:** sistema dueño de un dato — quién puede escribirlo, quién solo lo consume. Customer, Product, Order, Invoice e Inventory no deben tener ownership ambiguo; si dos sistemas pueden editar el mismo campo sin una regla de prioridad, la integración generará conflictos silenciosos tarde o temprano.
- **Dual-write:** sincronización casi en tiempo real y bidireccional entre F&O y Dataverse para entidades soportadas (Customer, Product, algunas transacciones). Requiere ambientes reales conectados, configuración de mapas (field mappings), validación de dependencias entre entidades relacionadas y gobierno fuerte — activar dual-write sin mapear dependencias es la causa más común de errores de sincronización en proyectos reales.
- **Data Management Framework (DMF):** import/export batch para migración inicial o cargas periódicas (ej. actualización nocturna de un catálogo), no sincronización transaccional continua — usar DMF para lo que dual-write resuelve mejor genera retrabajo; usar dual-write para una carga puntual es sobre-ingeniería.
- **Virtual tables:** lectura de datos externos (incluido F&O) como tablas en Dataverse sin copiar el dato — cada consulta lee en tiempo real desde el origen. Útiles para consulta (ej. mostrar saldo de inventario en una Opportunity), no para ownership compartido ni para escritura.
- **Eventos e integración custom:** Power Automate, Azure Service Bus, APIs REST o middleware (ej. un iPaaS) aplican cuando dual-write/DMF/virtual tables no cubren el proceso — por ejemplo, un evento de negocio que dispara una notificación cruzada sin necesidad de sincronizar toda una entidad.
- **Matriz de ownership:** documento obligatorio que define, por entidad: dueño (F&O o Dataverse), consumidores, dirección del dato (unidireccional o bidireccional), frecuencia, patrón de integración elegido y regla explícita de resolución de conflicto si ambos sistemas intentan escribir.
- **Seguridad cruzada:** los roles de seguridad de Dataverse (Security Roles) y los roles/duties/privileges de F&O no son equivalentes ni se mapean 1:1 — un "Sales Manager" en Dataverse no corresponde automáticamente a ningún duty de F&O; el mapeo debe hacerse por proceso de negocio (¿qué necesita hacer esta persona en cada sistema?) y quedar documentado como evidencia de diseño de seguridad.
- **Operación — controles mínimos:** monitoreo de errores de sincronización, política de reintentos, reconciliación periódica (comparar conteos/totales entre sistemas), ventana de mantenimiento acordada y un plan de rollback explícito si una sincronización masiva falla a mitad de proceso.
- **Requisitos reales de práctica:** construir la matriz de ownership, elegir patrones y diagramar el flujo puede hacerse sin tenant. Configurar dual-write real, mapas de entidades, validar dependencias y ejecutar reconciliación requiere entornos F&O y Dataverse conectados, permisos de administración en ambos, y datos maestros reales.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Crea una matriz para Account/Customer, Product, Sales Order, Invoice e Inventory con columnas: dueño, consumidor, patrón, dirección, frecuencia y regla de conflicto.
2. Decide patrón por entidad aplicando este criterio de decisión (el mismo del Módulo 59): ¿necesita escritura continua en ambos sistemas? → dual-write. ¿Es carga puntual/migración? → DMF. ¿Solo lectura desde Power Platform? → virtual tables. ¿No calza en ninguna? → integración custom. Justifica cada decisión con una frase.
3. Dibuja este flujo CE + F&O y complétalo indicando qué sistema es dueño en cada paso:

   ```mermaid
   flowchart LR
       A["Opportunity ganada en Sales (Dataverse)"] --> B["Orden de venta creada en F&O"]
       B --> C["Verificación de inventario (ATP) en F&O"]
       C --> D["Factura emitida en F&O"]
       D --> E["Estatus de factura visible en Sales vía virtual table o dual-write"]
   ```

4. Define 5 controles operativos: monitoreo de errores, reconciliación periódica, owner de errores, frecuencia de revisión y criterio de rollback ante fallo masivo de sincronización.
5. Responde esta pregunta de entrevista/consultoría: "El equipo de Ventas dice que el nombre del cliente en Sales no coincide con el de F&O — ¿cómo diagnosticas si es un problema de ownership, de mapeo o de reconciliación?" (respuesta esperada: primero verificar la matriz de ownership — ¿quién debería poder editar ese campo — luego revisar si el mapeo de dual-write lo sincroniza, y solo después sospechar de un error de sincronización real).
6. Marca qué requiere ambiente real: entornos F&O y Dataverse conectados, dual-write configurado, mapas habilitados, usuarios con permisos y datos maestros.

### 💼 Casos Reales de Negocio
Un cliente activó sincronización de clientes sin decidir si el dueño era Sales o F&O. Ventas corregía nombres comerciales en Dataverse, Finanzas corregía datos fiscales en F&O, y dual-write propagaba ambos cambios en direcciones opuestas — generando una guerra silenciosa de sobrescrituras que nadie notó hasta que un reporte fiscal mostró un nombre de cliente incorrecto en una factura oficial. La solución fue una matriz de ownership explícita: Sales dueño de datos comerciales (nombre de contacto, cuenta asignada), F&O dueño de datos fiscales y de crédito, reglas de edición por rol en cada sistema, y reconciliación semanal para detectar discrepancias antes de que llegaran a un documento fiscal. La integración dejó de ser "conectar sistemas" y pasó a ser gobierno de datos con reglas explícitas.

### ✅ Buenas Prácticas
- Crear la matriz de ownership antes de configurar dual-write, nunca después de los primeros conflictos.
- No usar dual-write para todo: elegir el patrón según necesidad real de escritura, frecuencia y criticidad del dato.
- Mapear seguridad por proceso de negocio, no por nombre de rol — un rol con el mismo nombre en ambos sistemas puede significar permisos completamente distintos.
- Diseñar monitoreo y reconciliación como parte del alcance inicial del proyecto, no como una mejora post-go-live.
- Probar errores de sincronización intencionales (dato inválido, dependencia faltante) antes de go-live, no esperar a que ocurran en producción.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Ownership ambiguo | Ambos sistemas editan el mismo dato sin regla de prioridad | Matriz de ownership explícita y regla de resolución de conflicto |
| Dual-write usado para lectura simple | Se busca "integración moderna" sin necesidad real de escritura bidireccional | Usar virtual tables o un reporte si el caso es solo de consulta |
| Sin reconciliación | Se asume que la sincronización siempre funciona sin fallos silenciosos | Reporte periódico de diferencias con owner operativo asignado |
| Roles CE/F&O mapeados por nombre | Los modelos de seguridad de ambos sistemas son estructuralmente distintos | Matriz rol-proceso-permiso específica por sistema, no por coincidencia de nombre |

### 🧪 Criterios de Validación
- [ ] Construí una matriz de ownership CE + F&O para 5 entidades
- [ ] Elegí patrón de integración por entidad con el criterio de decisión explícito
- [ ] Diagramé el flujo Opportunity→Orden→Factura→Estatus indicando el dueño de cada paso
- [ ] Diseñé monitoreo, reconciliación y rollback
- [ ] Respondí la pregunta de entrevista sobre diagnóstico de discrepancia de datos
- [ ] Identifiqué dependencias de ambiente real para dual-write
- [ ] Relacioné este módulo con el Lab 70 (CE + F&O integration architecture) y el Lab 88 (dual-write ownership matrix)

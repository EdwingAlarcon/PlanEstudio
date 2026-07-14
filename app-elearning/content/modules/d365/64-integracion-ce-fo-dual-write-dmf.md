---
moduleId: 64
title: "Integración CE + Finance & Operations — Dual-write, DMF y Ownership"
level: "d365"
certification: "D365 Enterprise Apps Integration"
estimatedMinutes: 14
slug: "integracion-ce-fo-dual-write-dmf"
---
### 🎯 Objetivo
Diseñar una integración responsable entre Dynamics 365 Customer Engagement y Finance & Operations definiendo sistema dueño, patrón de integración, dirección de datos, seguridad, ALM y riesgos operativos.

### 📖 Conceptos Clave
- **System of record:** sistema dueño de un dato. Customer, Product, Order, Invoice e Inventory no deben tener ownership ambiguo.
- **Dual-write:** sincronización casi en tiempo real y bidireccional entre F&O y Dataverse para entidades soportadas. Requiere ambientes reales, configuración, mapas, validación de dependencias y gobierno fuerte.
- **Data Management Framework (DMF):** import/export batch para migración o cargas periódicas, no sincronización transaccional continua.
- **Virtual tables:** lectura de datos externos como tablas en Dataverse sin copiar el dato. Útiles para consulta, no para ownership compartido.
- **Eventos e integración custom:** Power Automate, Azure Service Bus, APIs o middleware aplican cuando dual-write/DMF/virtual tables no cubren el proceso.
- **Matriz de ownership:** documento obligatorio que define entidad, dueño, consumidores, dirección, frecuencia, patrón y regla de conflicto.
- **Seguridad cruzada:** roles Dataverse y roles/duties F&O no son equivalentes; se mapean por proceso y evidencia.
- **Operación:** monitoreo de errores, reintentos, reconciliación, ventanas de mantenimiento y plan de rollback.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Crea una matriz para Account/Customer, Product, Sales Order, Invoice e Inventory con columnas: dueño, consumidor, patrón, dirección, frecuencia y conflicto.
2. Decide patrón por entidad: dual-write, DMF, virtual table o integración custom. Justifica cada decisión con una frase.
3. Dibuja un flujo CE + F&O: Opportunity ganada en Sales, orden en F&O, factura emitida en F&O, estatus visible en Sales.
4. Define 5 controles operativos: monitoreo, reconciliación, owner de errores, frecuencia de revisión y criterio de rollback.
5. Marca qué requiere ambiente real: entornos F&O y Dataverse conectados, dual-write configurado, mapas habilitados, usuarios con permisos y datos maestros.

### 💼 Casos Reales de Negocio
Un cliente activó sincronización de clientes sin decidir si el dueño era Sales o F&O. Ventas corregía nombres en Dataverse, Finanzas corregía datos fiscales en F&O y dual-write propagaba cambios inconsistentes. La solución fue una matriz de ownership: Sales dueño de datos comerciales, F&O dueño de datos fiscales y crédito, reglas de edición por rol y reconciliación semanal. La integración dejó de ser "conectar sistemas" y pasó a ser gobierno de datos.

### ✅ Buenas Prácticas
- Crear matriz de ownership antes de configurar dual-write.
- No usar dual-write para todo: elegir patrón según escritura, frecuencia y criticidad.
- Mapear seguridad por proceso, no por nombre de rol.
- Diseñar monitoreo y reconciliación como parte del alcance inicial.
- Probar errores de sincronización intencionales antes de go-live.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Ownership ambiguo | Ambos sistemas editan el mismo dato | Matriz de ownership y regla de conflicto |
| Dual-write usado para lectura simple | Se quiere "integración moderna" sin necesidad | Usar virtual tables o reporte si solo se consulta |
| Sin reconciliación | Se asume que la sincronización siempre funciona | Reporte de diferencias y owner operativo |
| Roles CE/F&O mapeados por nombre | Modelos de seguridad distintos | Matriz rol-proceso-permiso por sistema |

### 🧪 Criterios de Validación
- [ ] Construí una matriz de ownership CE + F&O para 5 entidades
- [ ] Elegí patrón de integración con criterio explícito
- [ ] Diseñé monitoreo, reconciliación y rollback
- [ ] Identifiqué dependencias de ambiente real para dual-write


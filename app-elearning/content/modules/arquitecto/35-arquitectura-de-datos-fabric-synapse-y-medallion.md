---
moduleId: 35
title: "Arquitectura de Datos — Fabric, Synapse y Medallion"
level: "arquitecto"
certification: "PL-600"
estimatedMinutes: 10
slug: "arquitectura-de-datos-fabric-synapse-y-medallion"
---
### 🎯 Objetivo
Diseñar arquitecturas de datos modernas usando Microsoft Fabric y Azure Synapse Analytics conectados con Dataverse y Power BI, implementando el patrón Medallion (Bronze→Silver→Gold) para crear una fuente única de verdad analítica para la organización.

### 📖 Conceptos Clave
- **Microsoft Fabric:** plataforma analítica unificada de Microsoft (GA noviembre 2023) que integra en un solo entorno: Lakehouse (almacenamiento y procesamiento), Data Warehouse (SQL analítico), Pipelines (orquestación ETL), Notebooks (PySpark/Python/Scala), Real-Time Analytics (KQL para streaming), Data Science (ML con MLflow), y Power BI. Todos los workloads comparten el mismo almacenamiento (OneLake) y el mismo modelo de seguridad. Se adquiere como capacidad F-SKU (F2, F4, F8… F2048) o P-SKU Premium; las capacidades más pequeñas (F2) permiten adopción gradual sin comprometerse con licencias grandes desde el inicio.
- **Lakehouse:** arquitectura que combina el almacenamiento flexible y económico de un Data Lake (archivos en Azure Data Lake Storage) con las capacidades de consulta SQL de un Data Warehouse, usando el formato Delta Lake para proveer transacciones ACID sobre los archivos. En Fabric, el Lakehouse tiene dos áreas: "Files" (archivos sin esquema, zona de landing del Bronze layer) y "Tables" (tablas Delta registradas en el metastore, accesibles vía SQL). Una organización con 10 años de datos históricos en formatos dispares puede cargarlos en el área Files del Lakehouse y transformarlos gradualmente a Tables estructuradas.
- **OneLake:** capa de almacenamiento subyacente unificada de Microsoft Fabric — análoga a OneDrive pero para datos analíticos. Todos los items de Fabric (Lakehouses, Warehouses, semantic models) almacenan sus datos en OneLake bajo una estructura de namespaces por workspace. La ventaja es que distintos items pueden leer los mismos datos sin copiarlos: un Notebook en PySpark y un Warehouse en T-SQL pueden consultar la misma tabla Delta simultáneamente. OneLake usa Azure Data Lake Storage Gen2 bajo el capó, con el protocolo ADLS para compatibilidad con herramientas externas.
- **Medallion Architecture:** patrón de organización de datos en tres capas de calidad creciente. Bronze: datos crudos tal como llegan del sistema fuente, inmutables, con todos sus defectos; se usan para reprocesar en caso de error aguas arriba. Silver: datos limpios, validados, estandarizados (fechas en UTC, tipos corregidos, duplicados eliminados, registros borrados filtrados); son el input de todas las transformaciones de negocio. Gold: métricas y dimensiones orientadas al negocio, pre-calculadas y desnormalizadas para máximo rendimiento en Power BI; cada tabla Gold responde a una pregunta de negocio específica.
- **Dataverse Link to Fabric (Azure Synapse Link):** funcionalidad nativa que exporta tablas de Dataverse a Microsoft Fabric como Delta Tables de forma continua y sin necesidad de pipelines ETL adicionales. Se configura desde make.powerapps.com → Azure Synapse Link y seleccionando el workspace de Fabric como destino. La sincronización es near-real-time (latencia típica de 5-15 minutos). Es la integración preferida para analytics sobre datos de Dynamics 365 o Power Apps porque elimina carga sobre el ambiente de producción de Dataverse.
- **DirectLake:** modo de conexión de Power BI (exclusivo de Microsoft Fabric) que lee datos directamente desde las tablas Delta del Lakehouse sin importarlos al modelo en memoria ni usar DirectQuery sobre el Lakehouse. Combina la velocidad de respuesta del modo Import con la frescura de datos del modo DirectQuery. Tiene limitaciones: no soporta todas las funciones DAX disponibles en Import mode, y el rendimiento depende del tamaño y optimización de las tablas Delta. Recomendado sobre el Gold layer bien diseñado; no recomendado sobre el Bronze layer sin transformar.
- **Azure Synapse Analytics → Microsoft Fabric:** Synapse Analytics es la plataforma enterprise de análisis de Azure (lanzada 2020) con Synapse Spark, Synapse SQL, y Synapse Pipelines. Microsoft Fabric (2023) es su evolución unificada con experiencia mejorada y modelo de capacidad simplificado. Para proyectos nuevos: usar Fabric directamente. Para entornos con Synapse existente: los conectores de compatibilidad permiten que Fabric acceda a los datos de Synapse, y Fabric Pipelines puede reemplazar Synapse Pipelines gradualmente. Microsoft no ha anunciado una fecha de deprecación de Synapse, pero la inversión de producto está concentrada en Fabric.
- **Delta Lake format:** formato de tabla open-source (creado por Databricks, adoptado por Microsoft) que agrega transacciones ACID, control de versiones (time travel), y operaciones de upsert/merge/delete sobre archivos Parquet en el Data Lake. En Fabric Lakehouse, todas las tablas usan Delta automáticamente. El "transaction log" de Delta (archivos JSON en `_delta_log/`) registra cada operación permitiendo consultar el estado de la tabla en cualquier punto del pasado: `SELECT * FROM table TIMESTAMP AS OF '2025-01-01'`.
- **Semantic Model (Power BI):** capa semántica centralizada que define medidas DAX, jerarquías, relaciones y descripciones de negocio sobre las tablas del Gold layer, reutilizable por múltiples reportes. Con DirectLake, el Semantic Model lee directamente del Lakehouse. Un Semantic Model bien diseñado encapsula la lógica de negocio (¿qué significa "cliente activo"? ¿cómo se calcula la morosidad?) para que los reporteros no tengan que replicarla en cada reporte. La certificación del Semantic Model en Power BI Service indica a los usuarios que es la fuente oficial de verdad.
- **Data Activator:** servicio de Fabric (anteriormente llamado Reflex) que permite definir reglas de alerta sobre datos en tiempo real y disparar acciones automáticas sin escribir código. Se conecta a streams de Event Hubs, datos de Power BI, o tablas de Lakehouse; cuando una condición se cumple, puede enviar Teams/email notification, ejecutar un Power Automate flow, o llamar un webhook. Ejemplo: alertar al gerente de operaciones cuando el tiempo de resolución promedio de tickets supera las 4 horas, con el detalle de cuáles tickets están pendientes.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 35.1: Conectar Dataverse con Microsoft Fabric
1. make.powerapps.com → Dataverse → Azure Synapse Link → Agregar enlace
2. Seleccionar tablas: Account, Contact, sit_solicitud, sit_proyecto, sit_tarea
3. Seleccionar: Microsoft Fabric (opción nueva vs Azure Synapse)
4. Workspace de Fabric destino: `SIT-Analytics`
5. Las tablas se exportan como Delta Tables en el Lakehouse automáticamente
6. Verificar en Fabric: Lakehouse → Tables → las tablas de Dataverse aparecen

#### Actividad 35.2: Medallion Architecture en Fabric
```python
# Notebook de PySpark — Bronze to Silver (limpieza y estandarización)
# Bronze: datos crudos de Dataverse (tal como llegaron)
# Silver: datos limpios, validados, estandarizados

from pyspark.sql import functions as F
from pyspark.sql.types import *
from delta.tables import DeltaTable

# Leer desde Bronze (tabla de Dataverse exportada)
df_bronze = spark.read.format("delta").load(
    "abfss://sitanalytics@onelake.dfs.fabric.microsoft.com/SIT-Lakehouse.Lakehouse/Tables/sit_solicitud"
)

# Transformaciones Silver: limpiar, estandarizar, enriquecer
df_silver = (df_bronze
    # Eliminar registros borrados lógicamente
    .filter(F.col("statecode") == 0)
    
    # Estandarizar fechas a UTC
    .withColumn("fecha_creacion_utc", 
        F.to_utc_timestamp(F.col("createdon"), "America/Bogota"))
    
    # Clasificar por categoría de negocio (lógica de negocio)
    .withColumn("categoria_analisis", 
        F.when(F.col("sit_categoria").isin([1,2,3]), "Hardware")
         .when(F.col("sit_categoria").isin([4,5]), "Software")
         .otherwise("Otros"))
    
    # Calcular días hasta vencimiento
    .withColumn("dias_hasta_vencimiento",
        F.datediff(F.col("sit_fechavencimiento"), F.current_date()))
    
    # Quitar columnas técnicas de Dataverse que no se necesitan en Analytics
    .drop("versionnumber", "importsequencenumber", "overriddencreatedon",
          "timezoneruleversionnumber", "utcconversiontimezonecode")
)

# Escribir en Silver con merge (upsert para evitar duplicados)
silver_table_path = "abfss://sitanalytics@onelake.dfs.fabric.microsoft.com/SIT-Lakehouse.Lakehouse/Tables/silver_solicitud"

deltaTable = DeltaTable.forPath(spark, silver_table_path)
deltaTable.alias("target").merge(
    df_silver.alias("source"),
    "target.sit_solicitudid = source.sit_solicitudid"
).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()

print(f"Silver layer actualizado: {df_silver.count()} registros")
```

```python
# Gold Layer — Agregaciones de negocio listas para Power BI
# Gold: métricas de negocio pre-calculadas, dimensiones desnormalizadas

df_silver_sol = spark.read.format("delta").load(
    "abfss://sitanalytics@onelake.dfs.fabric.microsoft.com/SIT-Lakehouse.Lakehouse/Tables/silver_solicitud"
)
df_silver_clientes = spark.read.format("delta").load(".../silver_account")

# Dimensión cliente enriquecida
df_gold_clientes = (df_silver_clientes
    .select("accountid", "name", "industrycode", "address1_country", "revenue")
    .withColumnRenamed("name", "nombre_cliente")
)

# Fact de solicitudes con métricas
df_gold_solicitudes = (df_silver_sol
    .join(df_gold_clientes, df_silver_sol.sit_cuentaid == df_gold_clientes.accountid, "left")
    .groupBy("categoria_analisis", "nombre_cliente", "address1_country",
              F.date_format("fecha_creacion_utc", "yyyy-MM").alias("mes_creacion"))
    .agg(
        F.count("sit_solicitudid").alias("total_solicitudes"),
        F.avg("dias_hasta_vencimiento").alias("avg_dias_vencimiento"),
        F.sum("sit_presupuesto").alias("presupuesto_total"),
        F.countDistinct("sit_responsable").alias("responsables_unicos")
    )
)

df_gold_solicitudes.write.format("delta").mode("overwrite").save(".../gold_solicitudes_resumen")
```

#### Actividad 35.3: Power BI con DirectLake
1. En Fabric → Power BI → Nuevo Dataset
2. Seleccionar: DirectLake mode (lee del Gold layer del Lakehouse directamente)
3. Seleccionar tablas Gold: `gold_solicitudes_resumen`, `gold_clientes`, `dim_calendar`
4. Ventaja: rendimiento cercano a Import mode sin los límites de frescura de datos

```dax
// DAX sobre el Gold Layer (ya pre-calculado, las medidas son simples)
Total Solicitudes = SUM(gold_solicitudes_resumen[total_solicitudes])

Presupuesto Promedio por Cliente = 
DIVIDE(
    SUM(gold_solicitudes_resumen[presupuesto_total]),
    DISTINCTCOUNT(gold_solicitudes_resumen[nombre_cliente]),
    0
)
```

#### Actividad 35.4: Data Activator — alertas automáticas
1. En Fabric → Real-Time Analytics → Data Activator
2. Conectar al stream de Dataverse (vía Event Hubs)
3. Crear regla de alerta:
   ```
   CUANDO: solicitud.sit_prioridad = "Urgente" 
   Y solicitud.sit_estado = "Nuevo"
   Y tiempo_sin_asignar > 30 minutos
   
   ENTONCES:
     - Enviar Teams notification a queue de Urgentes
     - Crear registro de escalamiento en Dataverse
     - Cambiar sit_estado a "Escalado"
   ```

### 💼 Caso Real de Negocio
**Empresa:** Retailer con 50 tiendas, datos en D365, SAP, y WMS  
**Problema:** El equipo de BI tardaba 3 días en producir el reporte mensual de ventas porque debían extraer de 3 sistemas, limpiar en Excel y consolidar manualmente. Decisiones tomadas con datos desactualizados.  
**Solución:** Fabric Lakehouse como single source of truth. Dataverse Link exporta CRM en tiempo real. ADF sincroniza SAP y WMS al Bronze layer. Notebooks Silver/Gold automatizan la transformación. DirectLake permite que Power BI lea datos del día anterior sin importación.  
**Resultado:** Reporte mensual: de 3 días a disponible el día 1 del mes. Decisiones de reabastecimiento basadas en datos del día anterior (antes eran de hace 1 semana).

### ✅ Buenas Prácticas
- Dataverse Link a Fabric es la integración preferida — sin código, sin pipelines adicionales
- Bronze = inmutable (datos crudos), Silver = curado, Gold = orientado al negocio
- DirectLake sobre Gold es el sweet spot: velocidad de Import + frescura de DirectQuery
- Diseñar el Gold layer pensando en Power BI — desnormalizar para evitar joins complejos en DAX

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| DirectLake falla con errores de "fallback to DirectQuery" en producción | Las tablas Delta del Lakehouse no están optimizadas (demasiados archivos pequeños, sin V-Order) | Ejecutar `OPTIMIZE` y habilitar V-Order en las tablas Delta del Gold layer; el Semantic Model en DirectLake requiere tablas bien mantenidas |
| Dataverse Link sincroniza datos incorrectos o con retraso excesivo | El ambiente de Dataverse tiene alta carga o el flujo de sincronización fue pausado sin alertas | Monitorear el estado del Dataverse Link desde la vista "Azure Synapse Link" en make.powerapps.com; configurar alerta si el último sync tiene más de 30 minutos de antigüedad |
| Notebooks Silver fallan en producción aunque funcionaron en desarrollo | Los datos de producción tienen valores nulos, tipos inesperados o volúmenes que no existían en DEV | Agregar validaciones de datos al inicio de cada notebook (contar nulos, verificar tipos); usar `try/except` con logging para no silenciar errores |
| Gold layer rediseñado múltiples veces porque Power BI pide cambios | El Gold se diseña desde la perspectiva técnica de Spark, no desde las preguntas de negocio | Diseñar el Gold layer empezando por los reportes: ¿qué preguntas debe responder? → esas preguntas definen las columnas y agregaciones del Gold |

### 🧪 Criterios de Validación
- [ ] Dataverse Link configurado exporta 5+ tablas al Lakehouse de Fabric
- [ ] Notebook Bronze→Silver limpia y estandariza datos correctamente
- [ ] Gold layer tiene métricas de negocio pre-calculadas
- [ ] Power BI en DirectLake muestra datos del Gold layer sin errores
- [ ] Data Activator genera alerta cuando se cumple la condición de negocio configurada

---

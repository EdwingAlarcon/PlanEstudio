---
moduleId: 17
title: "Proyecto Integrador Nivel 2"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 8
slug: "proyecto-integrador-nivel-2"
---
### 🎯 Objetivo
Construir un sistema CRM-lite completo para gestión de clientes y oportunidades comerciales, integrando todos los conceptos del Nivel 2: modelo de datos avanzado en Dataverse, Canvas App con Component Library, Model-Driven App, Power Automate con Child Flows, Power BI con DAX avanzado, Copilot Studio, y ALM con 3 ambientes.

### 📖 Conceptos Clave
Este módulo no introduce conceptos nuevos — aplica y consolida todos los del Nivel 2 en un proyecto cohesivo.

**Stack del proyecto:**

- Dataverse: modelo de datos con 6 tablas relacionadas
- Canvas App: gestión de oportunidades con Component Library
- Model-Driven App: vista 360° del cliente para el equipo comercial
- Power Automate: flujo de aprobación con Child Flow + notificaciones paralelas
- Power BI: dashboard de pipeline comercial con RLS por vendedor
- Copilot Studio: bot para consultas de oportunidades desde Teams
- ALM: solución exportada de DEV e importada en TEST

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 17.1: Modelo de datos CRM-lite
Tablas a crear con prefijo `sit_`:

1. **`Cuenta` (Account):** usar tabla nativa Account de Dataverse
2. **`Oportunidad`:**
   ```
   sit_nombre (Texto, requerido)
   sit_cuenta (Lookup a Account)
   sit_monto_estimado (Moneda)
   sit_probabilidad (Número, 0-100)
   sit_monto_ponderado (Calculada: sit_monto_estimado * sit_probabilidad / 100)
   sit_etapa (Elección: Prospección/Calificación/Propuesta/Negociación/Cierre)
   sit_fechacierre (Fecha)
   sit_responsable (Lookup a SystemUser)
   sit_origen (Elección: Web/Referido/Campaña/Outbound)
   ```

3. **`Actividad Comercial`:** (extiende la tabla nativa Task o crea personalizada)
4. **`Propuesta`:**
   ```
   sit_oportunidad (Lookup a Oportunidad)
   sit_version (Número entero, auto-calculado)
   sit_monto (Moneda)
   sit_estado (Elección: Borrador/En Revisión/Aprobada/Rechazada)
   sit_archivo_url (URL — enlace al documento en SharePoint)
   ```

5. **`Contacto`:** usar tabla nativa Contact, con relación a Account
6. **`Competidor`:**
   ```
   sit_nombre (Texto)
   sit_oportunidad (Lookup a Oportunidad)  
   sit_ventaja (Texto multilínea)
   sit_desventaja (Texto multilínea)
   ```

Business Rules para Oportunidad:

- Si etapa = "Cierre" → sit_fechacierre es obligatoria
- Si probabilidad > 80 → mostrar alerta "Oportunidad caliente"
- Rollup: contar número de propuestas por oportunidad

#### Actividad 17.2: Canvas App — Gestión de Oportunidades
1. Importar componentes de la SIT Component Library (Módulo 10)
2. Pantallas de la app:
    - **Home:** KPIs con `cmpStatCard` (Total pipeline, Oportunidades esta semana, Tasa de cierre)
    - **Lista Oportunidades:** Gallery con `cmpSearchBox` para filtrado, filtro por etapa
    - **Detalle Oportunidad:** formulario de edición con secciones colapsables
    - **Nueva Oportunidad:** wizard de 3 pasos
    - **Pipeline Kanban:** Gallery horizontal con columnas por etapa

3. Implementar Kanban simple:
   ```js
   // Gallery con filtro por etapa para columna "Propuesta"
   galProposal.Items: Filter(
       colOportunidades,
       Etapa = "Propuesta"
   )
   
   // Drag-to-change-stage simulado con botones
   btnMoverSiguiente.OnSelect:
       Patch(
           'sit_oportunidades',
           galProposal.Selected,
           {sit_etapa: 'sit_etapa (Oportunidades)'.Negociación}
       );
       Refresh(colOportunidades)
   ```

4. Named Formulas para el dashboard:
   ```js
   TotalPipeline = Sum(colOportunidades, sit_monto_ponderado);
   OportunidadesCalientes = CountRows(Filter(colOportunidades, sit_probabilidad >= 80));
   TasaCierre = Divide(
       CountRows(Filter(colOportunidades, sit_etapa = "Cierre Ganado")),
       CountRows(colOportunidades),
       0
   )
   ```

#### Actividad 17.3: Power Automate — Flujo de aprobación de propuesta

**Child Flow: Determinar Aprobador**
```
Input: monto (Float), tipoCliente (String)
Logic:
  Si monto < 10000 → aprobador = "supervisor@empresa.com"
  Si monto < 100000 → aprobador = "gerente@empresa.com"
  Sino → aprobador = "director@empresa.com"
  Si tipoCliente = "Estratégico" → siempre director
Output: emailAprobador (String)
```

**Flujo Principal:**

1. Trigger: When a row is added/modified (Propuesta, sit_estado = "En Revisión")
2. Llamar Child Flow con monto y tipo de cliente
3. Scope Try:
    - Enviar Approval (Start and wait)
    - Parallel: notificar Teams al vendedor que "está en revisión"

4. If Approved:
    - Patch Propuesta: sit_estado = "Aprobada"
    - Parallel Branch 1: Email al cliente con resumen
    - Parallel Branch 2: Crear tarea de seguimiento en Dataverse
    - Parallel Branch 3: Notificación Teams al vendedor

5. If Rejected:
    - Patch: sit_estado = "Rechazada", guardar comments
    - Email al vendedor con retroalimentación

6. Scope Catch: log de error en SharePoint

#### Actividad 17.4: Power BI — Dashboard Pipeline Comercial
```dax
// Medidas principales
Pipeline Total = SUM(Oportunidades[sit_monto_ponderado])

Pipeline por Etapa = 
CALCULATE(
    [Pipeline Total],
    ALLEXCEPT(Oportunidades, Oportunidades[sit_etapa])
)

Tasa de Conversion = 
DIVIDE(
    COUNTROWS(FILTER(Oportunidades, Oportunidades[sit_etapa] = "Cierre Ganado")),
    COUNTROWS(FILTER(Oportunidades, Oportunidades[sit_etapa] <> "Prospección")),
    0
)

Pipeline 90 Días = 
CALCULATE(
    [Pipeline Total],
    DATESINPERIOD('Calendar'[Date], TODAY(), 90, DAY)
)

Tiempo Promedio Cierre = 
AVERAGEX(
    FILTER(Oportunidades, Oportunidades[sit_etapa] = "Cierre Ganado"),
    DATEDIFF(Oportunidades[sit_fechacreacion], Oportunidades[sit_fechacierre], DAY)
)
```

RLS: Vendedor solo ve sus oportunidades, Gerente ve su región, Director todo.

Visualizaciones:

- Funnel chart por etapa (pipeline waterfall)
- Scatter plot: probabilidad vs monto (bubble = tamaño del deal)
- Heatmap de actividad por día de la semana
- KPI cards con YoY comparativo

#### Actividad 17.5: Copilot Studio — Bot de Pipeline
Topic: `Consultar Mi Pipeline`
```
Trigger: "cuánto tengo en pipeline", "mis oportunidades", "cómo va mi mes"

Acción: Power Automate → ConsultarPipelineVendedor
  Input: email = System.User.PrincipalName
  Output: totalPipeline, cantidadOpor, mejorOpor

Mensaje:
"📊 Tu pipeline actual:
- Total ponderado: {Topic.totalPipeline}
- Oportunidades activas: {Topic.cantidadOpor}
- Mayor oportunidad: {Topic.mejorOpor}

¿Quieres ver el detalle de alguna oportunidad específica?"
```

#### Actividad 17.6: ALM — Empaquetar y desplegar
1. Agregar todos los componentes a la solución `SIT CRM Lite`:
    - Tablas Dataverse (Oportunidad, Propuesta, Competidor)
    - Canvas App
    - Model-Driven App
    - Flujos (principal + child flow)
    - Connection References
    - Environment Variables
    - Custom Connector (si aplica)

2. Verificar dependencias: Solución → Comprobación de solución
3. Exportar versión `1.0.0.0` como Managed
4. Importar en TEST → configurar Connection References y Environment Variables
5. Documentar en el README del proyecto: lista de componentes, ambientes, variables

### 💼 Caso Real de Negocio
**Empresa:** Empresa de servicios profesionales con 20 vendedores  
**Problema:** Pipeline en Excel, actualizaciones manuales, cero visibilidad para gerentes, propuestas aprobadas por WhatsApp.  
**Solución completa:** Este proyecto. Canvas App para vendedores en campo (mobile-friendly). Model-Driven App para gerentes. Power Automate formaliza las aprobaciones con audit trail. Power BI da visibilidad en tiempo real. Bot en Teams para consultas rápidas desde el celular.  
**Resultado:** Pipeline visible en tiempo real. Tiempo de aprobación de propuestas: de 3 días a 4 horas. Adopción del sistema: 90% en primer mes.

### ✅ Buenas Prácticas
- En proyectos integrados, diseñar el modelo de datos PRIMERO antes de construir cualquier app
- Usar la misma solución para todos los componentes — facilita el ALM
- Probar el flujo completo (end-to-end) en TEST antes de presentar al cliente
- El Copilot Studio bot debe tener un fallback topic siempre configurado
- Documentar las decisiones de diseño importantes (por qué tabla personalizada vs nativa)

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| App de Canvas pierde conexión al importar solución | Connection no agregada como Connection Reference | Reemplazar todas las conexiones directas por Connection References |
| Power BI no conecta a Dataverse en TEST | Las credenciales del gateway no tienen acceso al ambiente TEST | Configurar el dataset en Power BI Service con las credenciales correctas |
| Bot de Teams no refleja cambios publicados | Caché de Teams | Esperar 24h o usar cliente web de Teams |

### 🧪 Criterios de Validación del Proyecto Final
- [ ] Modelo de datos completo con 4+ tablas, relaciones 1:N y calculadas/rollup
- [ ] Canvas App con Component Library tiene las 5 pantallas funcionando (Home, Lista, Detalle, Nuevo, Kanban)
- [ ] Flujo de aprobación con Child Flow y 3 ramas paralelas funciona en TEST
- [ ] Dashboard Power BI con RLS: vendedor solo ve sus datos en Power BI Service
- [ ] Bot en Teams responde consultas de pipeline con datos reales de Dataverse
- [ ] Solución importada como Managed en TEST sin errores de dependencias
- [ ] End-to-end: crear oportunidad → aprobar propuesta → ver en Power BI → consultar en bot

---

## Criterios de Graduación — Nivel 2

Para avanzar al Nivel 3, debes cumplir **todos** los siguientes criterios:

### Criterios Técnicos
- [ ] Modelo de datos Dataverse con relaciones complejas, rollup y field security
- [ ] Component Library publicada con al menos 3 componentes reutilizables
- [ ] Flujo de Power Automate con Try/Catch, Child Flow y ramas paralelas
- [ ] Dashboard Power BI con DAX avanzado (time intelligence, RLS, RANKX)
- [ ] PCF básico desplegado y funcional en formulario Model-Driven
- [ ] Conector personalizado importado desde OpenAPI y usado en flujo
- [ ] Copilot Studio con 5+ topics, entidades personalizadas e integración PA
- [ ] Solución con Connection References y Environment Variables desplegada en 3 ambientes

### Criterios de Calidad
- [ ] Ningún componente usa el prefijo `new_` — todos usan el prefijo del publisher
- [ ] Todos los flujos tienen manejo de errores (ningún flujo puede fallar silenciosamente)
- [ ] La solución exportada como Managed se importa en TEST sin errores en primera vez
- [ ] El dashboard Power BI tiene tabla de fechas personalizada (no AutoDate/Time)

### Auto-evaluación de Dominio
Califica cada tema del 1 al 5:

- Dataverse relaciones y seguridad: ___/5
- Canvas Component Library: ___/5  
- Power Automate avanzado: ___/5
- DAX time intelligence: ___/5
- JavaScript en formularios Model-Driven: ___/5
- Conectores personalizados: ___/5
- Copilot Studio: ___/5
- ALM y soluciones: ___/5

**Promedio ≥ 3.5 en todos → Puedes avanzar al Nivel 3**

---

*Siguiente nivel: [NIVEL_3_AVANZADO.md](NIVEL_3_AVANZADO.md) — Arquitectura, Plugins C#, PCF avanzado, D365 CE, Integraciones Azure*

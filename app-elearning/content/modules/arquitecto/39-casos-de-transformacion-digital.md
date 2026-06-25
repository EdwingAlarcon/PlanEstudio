---
moduleId: 39
title: "Casos de Transformación Digital"
level: "arquitecto"
certification: "PL-600"
estimatedMinutes: 10
slug: "casos-de-transformacion-digital"
---
### 🎯 Objetivo
Analizar y diseñar soluciones para los patrones más comunes de transformación digital con Power Platform: modernización de sistemas legacy, digitalización de procesos manuales, portales de autoservicio, y automatización de operaciones.

### 📖 Conceptos Clave
- **Transformación digital:** cambio organizacional profundo que va mucho más allá de implementar tecnología: implica rediseñar procesos de negocio (eliminando pasos manuales que tecnología puede ejecutar), transformar la cultura (empoderar a empleados para proponer mejoras, experimentar y fallar rápido), y en algunos casos, revisar el modelo de negocio completo (habilitar canales digitales que antes no existían). Según McKinsey, el 70% de las iniciativas de transformación digital no alcanzan sus objetivos, principalmente por resistencia al cambio y falta de liderazgo ejecutivo, no por limitaciones tecnológicas.
- **Legacy Modernization:** proceso de migrar aplicaciones o procesos basados en tecnología obsoleta (Excel con macros VBA, Access databases, sistemas AS/400, aplicaciones Visual Basic 6) a plataformas modernas como Power Platform. La estrategia más exitosa es incremental: mantener el sistema legacy en paralelo durante 4-8 semanas mientras el nuevo sistema se valida, luego hacer el cutover. La migración de datos históricos es típicamente el 30-40% del esfuerzo total y el mayor riesgo; requiere limpieza de datos (deduplicación, estandarización) antes de cargar en Dataverse.
- **Process Mining:** disciplina analítica que reconstruye y visualiza cómo se ejecutan realmente los procesos de negocio a partir de los registros de eventos (event logs) de los sistemas de información, en lugar de depender de documentación o entrevistas que describen cómo "deberían" ejecutarse. El resultado es un "Process Map" con variantes del proceso, cuellos de botella cuantificados (tiempo promedio por paso), y oportunidades de automatización priorizadas por impacto. Las herramientas líderes son Celonis (enterprise), Minit (adquirida por Microsoft), y Process Advisor (nativo en Power Automate).
- **Process Mining con Process Advisor:** implementación nativa de Process Mining en Power Platform. Soporta dos modos: Task Mining (grabación de acciones del usuario en el escritorio para descubrir oportunidades de RPA) y Process Mining (análisis de event logs de sistemas como Dataverse, SharePoint, o CSVs externos para mapear el proceso). Se accede desde Power Automate → Process Advisor. Genera mapas de proceso visuales con métricas de tiempo y frecuencia por variante, y recomienda automáticamente qué parte del proceso tiene mayor potencial de automatización.
- **Hyperautomation:** concepto de Gartner que describe la combinación de múltiples tecnologías de automatización para automatizar el mayor número posible de procesos de negocio: Power Automate (flujos de nube), Power Automate Desktop (RPA para sistemas sin API), AI Builder (extracción de datos de documentos no estructurados), y Azure OpenAI (clasificación y toma de decisiones sobre texto). El objetivo no es automatizar todo, sino identificar los procesos con mayor ROI de automatización y atacarlos con la herramienta adecuada para cada tipo de tarea.
- **Process Advisor (Power Automate):** herramienta de Process Mining integrada en Power Automate que permite grabar la ejecución de un proceso (Task Mining) o importar un event log de Dataverse/CSV/SharePoint (Process Mining) para generar automáticamente un mapa de proceso con variantes, tiempos y cuellos de botella. No requiere conocimiento de herramientas especializadas de process mining. Genera un reporte exportable en PDF con el análisis y las recomendaciones de automatización. Limitación: para procesos complejos con millones de eventos, las herramientas enterprise como Celonis ofrecen mayor capacidad analítica.
- **Change Management:** disciplina de gestión que se ocupa de preparar, apoyar y guiar a las personas a través de los cambios organizacionales que implica la transformación digital. Incluye: comunicación temprana y transparente sobre el cambio (¿por qué? ¿qué cambia para mí?), capacitación en las nuevas herramientas, identificación de "Change Champions" (líderes informales que adoptan el cambio y ayudan a sus colegas), y gestión de la resistencia (algunas personas pierden poder o habilidades valiosas en el proceso). Un plan de Change Management documenta los stakeholders, su nivel de resistencia actual y las acciones para moverlos hacia la adopción.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 39.1: Caso — Modernización de sistema Access/Excel
```markdown
## Escenario: Gestión de inventario en Excel con 15 años de historia

Situación actual (AS-IS):
- 5 archivos Excel con macros VBA que solo una persona sabe mantener
- Datos duplicados entre archivos
- No hay historial de cambios
- 3 personas actualizando manualmente el mismo "sistema"

Análisis de dolor:
- 2 horas/día perdidas en conciliar los archivos entre sí
- 1 vez al mes hay pérdida de datos por sobreescritura
- El único experto del Excel está a punto de jubilarse

Solución Power Platform:
1. Migrar datos a Dataverse (migración con Power Query desde Excel)
2. Model-Driven App para gestión de inventario (formularios, vistas, flujos)
3. Canvas App mobile para el almacenero (escaneo de código de barras)
4. Power Automate para alertas de stock mínimo
5. Power BI para dashboard de rotación de inventario

Estrategia de migración:
  Semana 1-2: Migrar datos históricos con Power Query (limpieza incluida)
  Semana 3-4: Correr en paralelo (Excel + Dataverse) — validar consistencia
  Semana 5: Apagar Excel, solo Dataverse
  
ROI:
- 2h/día × 5 días × 48 semanas × $25/hora = $12,000/año solo en tiempo ahorrado
- Costo del proyecto: $25,000
- Payback: ~2 años
```

#### Actividad 39.2: Caso — RPA + Power Automate Hyperautomation
```markdown
## Escenario: Procesamiento de solicitudes de crédito

Situación actual:
- Analista recibe solicitud por email
- Abre el portal del buró de crédito manualmente
- Copia el score a Excel
- Llena el formulario del sistema interno manualmente
- Aprueba o rechaza basándose en tabla de reglas en papel

Tiempo: 45 minutos por solicitud × 50 solicitudes/día = 37.5 horas/día

Hyperautomation con Power Platform:
1. Power Automate cloud: recibe email → crea registro en Dataverse
2. Power Automate Desktop (RPA): 
   - Abre portal del buró (sistema legado sin API)
   - Ingresa número de documento del solicitante
   - Extrae el score crediticio con scraping de la página
   - Retorna el score al flujo cloud
3. AI Builder: 
   - Analiza los documentos adjuntos (comprobante de ingresos, cedula)
   - Extrae ingresos declarados y valida con score del buró
4. Plugin C#:
   - Ejecuta las reglas de aprobación automática
   - Si califica → aprueba automáticamente con flag "auto-aprobado"
   - Si no califica → asigna a analista humano con toda la info preparada
5. Power BI: dashboard de tiempo de procesamiento y tasa de auto-aprobación

Resultado esperado:
- 70% de solicitudes auto-aprobadas en < 5 minutos
- 30% que requieren revisión humana: analista recibe toda la info lista (no desde cero)
- Tiempo analista por caso revisado: de 45 min a 10 min
```

#### Actividad 39.3: Arquitectura de referencia — Portal de Autoservicio B2C
```
[Cliente externo]
    → Registro con Azure AD B2C
    → Power Pages portal
        → Crear solicitudes (Entity Form → Dataverse)
        → Ver estado de sus casos (Table Permission = Contact)
        → Descargar documentos (Azure Blob Storage vía SAS token)
        → Chat con bot (Copilot Studio embebido en el portal)
    
[Backend automático]
    → Power Automate procesa la solicitud
    → Plugin C# valida reglas de negocio
    → Notificaciones automáticas al cliente (email + push notification)
    
[Agentes internos]
    → D365 Customer Service (ven todos los casos)
    → Escalamiento desde el bot al agente humano (Omnichannel)
    
[Analytics]
    → Fabric Lakehouse: datos de Dataverse + interacciones del portal
    → Power BI: KPIs de autoservicio (% resueltos por bot vs humano)
```

##### Práctica 39.X: Process Advisor — Mapear el proceso real de solicitudes

**Objetivo:** Usar Process Advisor para descubrir cómo se ejecuta realmente el proceso de solicitudes del proyecto capstone y compararlo con el diseño original.

**Pasos:**
1. En Power Automate, abre **Process Advisor** (menú lateral izquierdo)
2. Crea un nuevo proceso: "Análisis de Solicitudes — [tu nombre]"
3. Configura la grabación del proceso: selecciona el flujo de aprobación del proyecto capstone como fuente de eventos
4. Ejecuta al menos 5 instancias con variaciones (aprobación directa, rechazo, reasignación)
5. En Process Advisor, visualiza el **Process Map** generado automáticamente
6. Identifica las variantes: happy path vs variantes con rework
7. Revisa las métricas: duración promedio, frecuencia por variante, cuellos de botella
8. Exporta el análisis como PDF y documenta 3 oportunidades de automatización identificadas

**Criterio de validación:** El Process Map muestra al menos 2 variantes del proceso y el reporte identifica al menos un cuello de botella con tiempo promedio cuantificado.

### 💼 Caso Real de Negocio
**Empresa:** Aseguradora con proceso de renovación de pólizas 100% manual  
**Problema:** 3 empleados dedicados solo a enviar emails de recordatorio de renovación y procesar los formularios en papel que llegaban por correo físico.  
**Solución:** Power Pages para que el asegurado renueve en línea. Power Automate envía recordatorios 60/30/15 días antes. AI Builder extrae datos del formulario si llega en PDF. D365 actualiza la póliza automáticamente. Solo los casos con excepciones llegan a los empleados.  
**Resultado:** Proceso 85% automatizado. Los 3 empleados fueron reubicados a ventas (mayor valor). Tasa de renovación mejoró de 68% a 79% porque los recordatorios ahora son personalizados y oportunos.

### ✅ Buenas Prácticas
- Empezar la transformación por el proceso de mayor dolor — genera credibilidad rápida
- Ejecutar siempre en paralelo (legacy + nueva solución) antes de apagar el sistema antiguo
- Change Management es la mitad del proyecto — no es un anexo
- Medir el impacto con KPIs concretos desde el inicio — no después

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Apagar el sistema legacy demasiado rápido sin período de ejecución paralela | Presión por reducir costos de licencias del sistema antiguo o apuro del cliente | Establecer en el SoW un mínimo de 4 semanas de ejecución paralela para validar consistencia de datos antes del cutover definitivo |
| No involucrar a los usuarios finales en el diseño del TO-BE | El arquitecto diseña la solución en aislamiento con solo el sponsor ejecutivo | Incluir a al menos 2-3 usuarios de cada rol en el Discovery Workshop; si no usan la solución, no hay transformación |
| Transformación fallida por resistencia del "experto del Excel" | La persona que mantenía el sistema legacy percibe la transformación como una amenaza a su rol | Involucrar a ese experto como "Subject Matter Expert" del proyecto — su conocimiento es invaluable para documentar las reglas de negocio; reorientarle hacia el nuevo sistema |
| KPIs de éxito definidos solo en términos tecnológicos (uptime, velocidad) | El arquitecto no tradujo el impacto a métricas de negocio | Definir KPIs de negocio desde el Discovery: tiempo de proceso reducido X%, costo por transacción reducido Y%, tasa de error reducida Z% — son los únicos KPIs que importan al sponsor |

### 🧪 Criterios de Validación
- [ ] Análisis AS-IS documentado para un proceso real con métricas de dolor cuantificadas
- [ ] Diseño TO-BE con Power Platform que ataca cada punto de dolor identificado
- [ ] Cálculo de ROI con supuestos documentados (costo/hora, tiempo ahorrado, etc.)
- [ ] Plan de migración de sistema legacy con semanas de ejecución paralela antes del cutover

---

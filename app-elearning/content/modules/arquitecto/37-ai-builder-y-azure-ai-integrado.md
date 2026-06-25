---
moduleId: 37
title: "AI Builder y Azure AI integrado"
level: "arquitecto"
certification: "PL-600"
estimatedMinutes: 10
slug: "ai-builder-y-azure-ai-integrado"
---
### 🎯 Objetivo
Integrar capacidades de Inteligencia Artificial en soluciones Power Platform usando AI Builder nativo y Azure AI Services: modelos de clasificación de documentos, extracción de información de facturas, análisis de sentimiento, y orquestación de agentes con Azure OpenAI y Semantic Kernel.

### 📖 Conceptos Clave
- **AI Builder:** servicio de inteligencia artificial integrado nativamente en Power Platform que permite a makers sin experiencia en ML crear, entrenar y usar modelos de IA directamente desde Power Apps y Power Automate. Ofrece dos tipos de modelos: pre-construidos (listos para usar sin entrenamiento, como extracción de texto de recibos o análisis de sentimiento) y personalizados (entrenados con datos propios, como clasificación de documentos de la empresa o predicción de resultados de negocio). Se factura en "AI Builder credits" que se incluyen en ciertas licencias Premium o se adquieren como add-on.
- **Document Processing (Form Recognizer):** tipo de modelo de AI Builder que extrae campos estructurados de documentos como facturas, contratos, formularios o identificaciones. Se entrena cargando mínimo 5 documentos de ejemplo y marcando los campos a extraer; el modelo aprende el layout del documento. Basado en Azure AI Document Intelligence (antes llamado Form Recognizer) bajo el capó. Un modelo bien entrenado con 50+ ejemplos puede alcanzar más del 95% de exactitud en campos numéricos y fechas; los campos de texto libre (nombres, direcciones) suelen tener menor exactitud y conviene enviarlos a revisión humana.
- **Object Detection:** modelo de AI Builder que detecta y localiza objetos específicos dentro de imágenes, devolviendo las coordenadas del bounding box y la confianza de detección. Casos de uso en Power Platform: control de calidad en manufactura (detectar productos defectuosos en línea de producción con una Canvas App + cámara del teléfono), verificación de instalaciones (detectar equipos de protección personal en fotos de obra), o conteo de inventario físico por imagen.
- **Text Classification:** modelo personalizable de AI Builder que clasifica texto libre en categorías predefinidas por el usuario. A diferencia de los modelos de análisis de sentimiento (pre-construido, solo positivo/negativo/neutro), Text Classification puede entrenarse para categorías de negocio específicas: tipo de solicitud (Técnica/Administrativa/Comercial), nivel de urgencia (Crítico/Alto/Medio/Bajo), departamento destino. Requiere mínimo 10 ejemplos por categoría; con 200+ ejemplos balanceados supera el 85% de exactitud en la mayoría de casos.
- **Prediction Model:** modelo de AI Builder que usa datos históricos de tablas de Dataverse para predecir un resultado binario (SI/NO) o numérico. El proceso es: seleccionar la tabla y columna a predecir, seleccionar columnas de entrada (features), entrenar, evaluar (el sistema muestra AUC, accuracy, curva ROC), y publicar. La predicción se puede ejecutar en Canvas App en tiempo real o en batch via Power Automate. Ejemplo real: predecir si una oportunidad de venta se ganará o perderá, entrenando con 2 años de historial de oportunidades cerradas.
- **Azure OpenAI Service:** acceso a modelos de lenguaje de OpenAI (GPT-4o, GPT-4, GPT-3.5-turbo) hospedados en infraestructura de Azure, con acuerdos de privacidad enterprise que garantizan que los datos de conversación no se usan para entrenar modelos de OpenAI/Microsoft. A diferencia del acceso público a ChatGPT, Azure OpenAI incluye: filtros de contenido configurables, registro de conversaciones en el propio Log Analytics, aislamiento de red (acceso solo desde VNET corporativa), y SLA de disponibilidad del 99.9%. Para Power Platform, se accede vía HTTP action de Power Automate o mediante el conector nativo "Azure OpenAI" disponible en ambientes con licencias correctas.
- **Semantic Kernel** *(referencia avanzada):* SDK open-source de Microsoft (C# y Python) para construir agentes y aplicaciones de IA orquestando llamadas a LLMs con plugins (funciones que el LLM puede invocar), memoria persistente (para recordar contexto entre conversaciones), y planners (que permiten al LLM descomponer un objetivo en pasos y ejecutarlos). Es el framework recomendado para agentes de IA enterprise en 2025+ cuando se necesita lógica compleja que va más allá de lo que Copilot Studio puede manejar nativamente. Requiere conocimiento de C# o Python y Azure OpenAI.
- **Prompt Engineering:** disciplina de diseñar instrucciones (prompts) efectivas para modelos de lenguaje que maximicen la calidad, consistencia y seguridad de las respuestas. Técnicas clave: system prompt con rol y reglas, few-shot examples (mostrar al modelo ejemplos de input→output esperado), chain-of-thought (pedir al modelo que razone paso a paso antes de responder), y output format constraints (pedir JSON, categoría exacta, o un número). En Power Platform, el prompt engineering define la diferencia entre un clasificador de tickets con 60% de exactitud y uno con 92%.
- **Grounding:** técnica para anclar las respuestas de un LLM a documentos corporativos específicos en lugar de depender del conocimiento general del modelo preentrenado. Se implementa típicamente con RAG (Retrieval-Augmented Generation): cuando el usuario hace una pregunta, se buscan los fragmentos más relevantes en la knowledge base (usando búsqueda vectorial), se incluyen en el contexto del prompt, y el LLM genera la respuesta citando esas fuentes. En Copilot Studio se configura vía "Knowledge Sources" (SharePoint, sitios web, documentos). Sin grounding, el LLM puede inventar información (alucinación); con grounding, las respuestas están verificadas contra documentos conocidos.
- **Azure AI Document Intelligence:** versión enterprise de Form Recognizer con modelos pre-entrenados para tipos de documentos comunes (facturas/invoices en múltiples idiomas, recibos, tarjetas de identificación, W-2 americanos, contratos) que no requieren entrenamiento propio. Los modelos pre-entrenados de facturas en varios idiomas incluyendo español tienen exactitud superior al 90% en campos estándar (número de factura, fecha, total, líneas de ítem). Se accede desde AI Builder seleccionando "Documentos precompilados" o directamente desde la API REST de Azure AI Services.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 37.1: AI Builder — Document Processing para facturas
1. make.powerapps.com → AI Builder → Construir → Procesamiento de documentos
2. Tipo: Documentos estructurados (facturas tienen formato consistente)
3. Cargar 5+ facturas de ejemplo como training data
4. Definir campos a extraer:
    - Número de factura
    - Fecha
    - NIT/RFC del proveedor
    - Total
    - Lista de líneas (producto, cantidad, precio)

5. Entrenar el modelo (puede tomar 30–60 minutos)
6. Probar con una factura nueva → verificar exactitud de extracción
7. Publicar el modelo

#### Actividad 37.2: Usar AI Builder en Power Automate
```
Flujo: Procesar facturas de email automáticamente

Trigger: When email arrives (Outlook)
  Filter: Subject contains "Factura" or From: @proveedores.com

Acción: Get Attachment (obtener el PDF adjunto)

Acción: AI Builder — Process and save information from documents
  Document type: Facturas (el modelo entrenado)
  Document: Body adjunto del email

Condición: Confidence score >= 0.85 (alta confianza)
  TRUE:
    Acción: Create row (Dataverse - Factura)
      sit_numero: outputs('AI_Builder')?['fields']?['NumeroFactura']?['value']
      sit_fecha: outputs('AI_Builder')?['fields']?['Fecha']?['value']
      sit_total: outputs('AI_Builder')?['fields']?['Total']?['value']
      sit_proveedor: outputs('AI_Builder')?['fields']?['NIT']?['value']
    Acción: Reply to email "Factura procesada automáticamente: [número]"
  FALSE:
    Acción: Create task para revisión manual
    Acción: Reply "Factura requiere revisión manual. Un agente la procesará."
```

#### Actividad 37.3: Azure OpenAI en Power Automate
1. Crear recurso Azure OpenAI en Azure Portal
2. Deploy model: `gpt-4` (para análisis complejo) o `gpt-4o-mini` (para respuestas rápidas)
3. En Power Automate → Acción HTTP para llamar a Azure OpenAI:
```
Acción: HTTP
Method: POST
URI: https://tu-recurso.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-02-01
Headers:
  api-key: @{parameters('AzureOpenAIKey')}
  Content-Type: application/json
Body:
{
  "messages": [
    {
      "role": "system",
      "content": "Eres un analista de soporte técnico de SIT Consulting. Clasifica el siguiente caso de soporte en una de estas categorías: Hardware, Software, Red, Accesos, Otro. Responde ÚNICAMENTE con la categoría, sin explicación."
    },
    {
      "role": "user", 
      "content": "Descripción del caso: @{triggerOutputs()?['body/sit_descripcion']}"
    }
  ],
  "max_tokens": 20,
  "temperature": 0
}
```
4. Parsear respuesta y actualizar el caso:
```
Set column sit_categoriaai = first(body('HTTP_OpenAI')?['choices'])?['message']?['content']
```

#### Actividad 37.4: Prediction Model con AI Builder
1. AI Builder → Predicción → Nuevo modelo
2. Tabla: Oportunidades de Dataverse
3. Columna a predecir: `sit_ganada` (SI/NO — si la oportunidad se cerró ganada)
4. Columnas de entrada (features):
    - sit_monto_estimado, sit_probabilidad, sit_etapa
    - sit_origen, sit_sector_cliente, sit_tipo_contacto
    - Días desde creación hasta el momento actual

5. Entrenar con historial de 2+ años de oportunidades
6. Publicar y usar en Canvas App:
   ```js
   // En Canvas App — predicción en tiempo real mientras el vendedor llena la oportunidad
   Set(varPrediccionGana,
       'PredictOpportunityWin'.Predict({
           sit_monto_estimado: numMonto.Value,
           sit_probabilidad: slProbabilidad.Value,
           sit_origen: ddOrigen.Selected.Value
       })
   );
   // varPrediccionGana.Probability → muestra "85% probabilidad de ganar"
   ```

#### Actividad 37.5: Copilot Studio con Azure OpenAI Generative Answers
1. Copilot Studio → Configuración → Generative AI → Azure OpenAI
2. Conectar con el recurso Azure OpenAI propio (no el servicio compartido de Microsoft)
3. Ventaja: los datos de conversación NO se usan para entrenar el modelo de Microsoft
4. System prompt avanzado:
   ```
   Eres el asistente virtual de SIT Consulting especializado en soporte de Power Platform.
   
   REGLAS ESTRICTAS:
   1. Solo responde sobre temas de Power Platform, Dynamics 365 y Microsoft 365
   2. Si no encuentras la respuesta en los documentos de la Knowledge Base, di: "No tengo información verificada sobre eso. Te recomiendo consultar con el equipo técnico."
   3. Nunca generes código que no hayas visto en la Knowledge Base
   4. Cita siempre el documento fuente cuando respondas una pregunta técnica
   5. Si el usuario pregunta sobre precios, redirige a "contacta ventas en ventas@sitconsulting.com"
   
   TONO: Profesional pero amigable. Usa ejemplos concretos. Respuestas de máx 3 párrafos.
   ```

### 💼 Caso Real de Negocio
**Empresa:** Firma de contabilidad que procesa 2,000 facturas mensuales  
**Problema:** 5 personas dedicadas exclusivamente a tipear datos de facturas físicas al sistema. Error rate: 3% (60 facturas con errores que causaban diferencias en pagos).  
**Solución:** AI Builder Document Processing con 95% de exactitud promedio. Las facturas con confianza < 85% van a revisión humana (solo 8% del total). Para las que pasan, el flujo de Power Automate crea el registro automáticamente en D365.  
**Resultado:** 5 personas reubicadas a trabajo de mayor valor. Error rate: 0.3% (solo en facturas revisadas manualmente mal procesadas). ROI: 18 meses.

### ✅ Buenas Prácticas
- AI Builder Prediction requiere mínimo 50 registros de entrenamiento (idealmente 500+)
- Azure OpenAI en producción SIEMPRE con tu propio recurso — no el endpoint compartido
- Temperature=0 para clasificación (respuesta determinista); temperature>0 para generación creativa
- Monitorear el accuracy del modelo AI Builder mensualmente — los datos cambian con el tiempo

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Modelo de Document Processing entrenado con muestras insuficientes o poco diversas | Se usan las primeras 5 facturas disponibles sin considerar la variedad de layouts del proveedor | Recolectar muestras de todos los layouts posibles del documento (distintos proveedores, distintos años, distintos formatos); 20+ muestras por variante de layout |
| Azure OpenAI retorna resultados inconsistentes en clasificación | Temperature > 0 para una tarea que requiere respuesta determinista | Para clasificación, prediction o extracción estructurada usar temperature=0 siempre; solo usar temperature > 0 para generación creativa o respuestas conversacionales |
| Prediction Model con alta accuracy en training pero falla en producción | El modelo fue entrenado con datos históricos que no representan el comportamiento actual | Separar el dataset en train (70%) / validation (15%) / test (15%); verificar que el test set incluye datos recientes; reentrenar el modelo cada 6 meses con datos frescos |
| Copilot Studio responde preguntas fuera del scope del negocio | System prompt demasiado permisivo sin restricciones explícitas | El system prompt debe listar explícitamente los temas fuera de scope: "Si el usuario pregunta sobre [X], responde que no puedes ayudar y redirige a [Y]" |

### 🧪 Criterios de Validación
- [ ] Modelo Document Processing extrae campos de facturas con > 85% de confianza
- [ ] Flujo procesa email con factura adjunta y crea registro en Dataverse automáticamente
- [ ] Azure OpenAI clasifica casos de soporte con temperatura 0 (resultado determinista)
- [ ] Prediction Model entrenado y disponible como acción en Canvas App

---

# GUÍA COMPLETA DE CERTIFICACIONES — Power Platform & Dynamics 365
**Ruta:** PL-900 → PL-200 → PL-400 → PL-600

---

## Visión General de la Ruta

```
PL-900                PL-200                PL-400                PL-600
Fundamentals    →   Functional         →   Developer        →   Architect
                    Consultant
                    
Nivel 1 (4-6m)     Nivel 2 (4-6m)        Nivel 3 (6-8m)       Nivel 4 (6-12m)
Sin prereq          No requerido*          No requerido*         Requiere PL-200 o PL-400
$165 USD            $165 USD              $165 USD             $165 USD
40-60 preguntas    40-60 preguntas       40-60 preguntas     Caso de estudio largo

* Microsoft no requiere formalmente los anteriores, pero el conocimiento sí es necesario
```

---

## PL-900: Microsoft Power Platform Fundamentals

### Descripción
Certificación introductoria. Valida comprensión de los componentes de Power Platform y sus casos de uso. Dirigido a: tomadores de decisión, usuarios de negocio, personas que quieren saber qué es Power Platform.

### Dominios del examen

| Dominio | Peso |
|---------|------|
| Describir el valor de negocio de Power Platform | 25-30% |
| Identificar los componentes principales de Power Platform | 25-30% |
| Demostrar las capacidades de Power BI | 10-15% |
| Demostrar las capacidades de Power Apps | 15-20% |
| Demostrar las capacidades de Power Automate | 15-20% |

### Temas clave que estudiar
- ¿Qué es Power Platform? (Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio)
- Dataverse vs SharePoint vs Excel como fuente de datos — cuándo usar cada uno
- Tipos de aplicaciones: Canvas, Model-Driven, Portal
- Tipos de flujos: Automatizados, Instantáneos, Programados, Business Process Flow
- Connectors: Standard vs Premium
- Licencias: Power Apps per user, per app; Power Automate per user, per flow
- AI Builder: conceptos básicos de los modelos disponibles
- Copilot Studio: qué es un bot, qué es un topic
- Ambientes y uso de Dataverse for Teams

### Recursos de preparación
- Microsoft Learn: "Microsoft Power Platform Fundamentals" learning path (gratuito)
- Duración estimada: 8–12 horas de estudio
- Practice Assessment: disponible en learn.microsoft.com antes del examen
- Examen de práctica oficial de MeasureUp

### Estrategia para el examen
- Foco en "qué hace cada componente" no en cómo configurarlo técnicamente
- Muchas preguntas de tipo "¿cuál herramienta usarías para X escenario?"
- Conocer los límites: delegación en Canvas Apps, conectores premium
- La mayoría pasan con 2 semanas de estudio si tienen experiencia básica

### Cuándo estudiar: integración con el plan de estudio
**No estudies PL-900 después de terminar el Nivel 1 — estúdialo en paralelo:**

| Hito del Nivel 1 | Acción PL-900 |
|------------------|---------------|
| Al terminar Módulo 3 | Lee el learning path "Microsoft Power Platform Fundamentals" en Microsoft Learn (8–12 h) — ya tienes contexto práctico para entender cada concepto |
| Al terminar Módulo 6 | Haz el Practice Assessment oficial gratuito en learn.microsoft.com — identifica tus gaps |
| Al terminar Módulo 7 | Refuerza los gaps detectados, haz el practice assessment de nuevo hasta >85% |
| Al terminar Módulo 8 | Rinde PL-900 — ya tienes conocimiento práctico que va muy por encima del examen |

> **Nota:** La tabla usa módulos como hitos (no semanas) porque el ritmo varía: a 10 hrs/semana cada módulo toma 2-4 semanas; a 15 hrs/semana puede ser 1-2 semanas. Lo importante es completar cada módulo antes de avanzar al siguiente hito de estudio.

Ventaja: el 80% del contenido PL-900 ya lo practicaste en los módulos. El examen valida lo que aprendiste, no requiere estudio adicional intensivo.

### Ejemplo de preguntas
```
Pregunta: Una empresa quiere que sus clientes puedan ver el estado de sus pedidos 
en línea sin necesidad de tener una cuenta de Microsoft. ¿Qué componente usarías?
A) Canvas App
B) Model-Driven App
C) Power Pages
D) Power Automate

Respuesta: C — Power Pages está diseñado para usuarios externos sin cuenta corporativa.

---

Pregunta: ¿Cuál es la diferencia principal entre un conector Standard y Premium?
A) Los conectores Premium son más rápidos
B) Los conectores Premium requieren una licencia adicional de Power Apps o Power Automate
C) Los conectores Premium solo funcionan en producción
D) Los conectores Premium no tienen límites de llamadas

Respuesta: B — Los conectores Premium (Dataverse, SQL Server, etc.) requieren licencias 
PA Premium o PP per user.
```

---

## PL-200: Microsoft Power Platform Functional Consultant

### Descripción
Valida la capacidad de implementar y configurar soluciones de Power Platform para necesidades de negocio. Orientado a consultores funcionales que configuran, no necesariamente codifican.

### Dominios del examen

| Dominio | Peso |
|---------|------|
| Configurar Microsoft Dataverse | 20-25% |
| Crear aplicaciones mediante Power Apps | 15-20% |
| Crear y gestionar Power Automate | 15-20% |
| Implementar chatbots con Copilot Studio | 10-15% |
| Integrar Power Platform con otros servicios | 10-15% |
| Implementar análisis con Power BI | 10-15% |

### Temas clave
**Dataverse:**

- Tablas, columnas, relaciones (1:N, N:N)
- Business Rules (alcance: formulario vs entidad)
- Business Process Flows
- Security Roles, Field Security Profiles
- Duplicate Detection Rules
- Auditoría

**Power Apps:**

- Canvas Apps: formContext, CRUD con Patch, delegación, colecciones
- Model-Driven Apps: formularios, vistas, dashboards, BPF
- Gestión de soluciones (managed vs unmanaged)
- Connection References y Environment Variables

**Power Automate:**

- Tipos de disparadores (automatizado, instantáneo, programado)
- Approval workflows
- Try/Catch con Scope
- Conectores premium (Dataverse, HTTP)
- Child Flows

**Copilot Studio:**

- Topics, Entities, Variables
- Integración con Power Automate
- Publicación en Teams y otros canales

**Power BI:**

- DAX básico (SUM, CALCULATE, FILTER)
- Row Level Security (RLS)
- Publicar y compartir reportes en Service

### Recursos de preparación
- Microsoft Learn: "Microsoft Power Platform Functional Consultant" path
- Documentación oficial de cada componente en learn.microsoft.com
- Laboratorios de GitHub: microsoft/PL-200-Power-Platform-Functional-Consultant
- Tiempo estimado: 3–4 semanas si se domina el Nivel 2 de este plan

### Estrategia para el examen
- El examen tiene preguntas situacionales: "El cliente necesita X. ¿Qué configurarías?"
- Estudiar los límites y cuándo escalar a código vs configuración
- Practicar con entorno de sandbox real — no solo teoría
- Hacer los laboratorios de GitHub antes del examen

### Ejemplo de preguntas
```
Pregunta: Un cliente quiere que el campo "Presupuesto" solo sea visible para el 
rol "Gerente Financiero" y no para "Consultor". ¿Qué usarías?
A) Security Role con privilegio de lectura de campo
B) Field Security Profile
C) Business Rule con condición de rol
D) JavaScript en el formulario

Respuesta: B — Field Security Profile controla el acceso a campos específicos 
por usuario/perfil, independiente del Security Role.

---

Pregunta: ¿Cuál es la diferencia entre una solución Managed y Unmanaged al importarla?
A) La solución Managed es más rápida de importar
B) La solución Managed es de solo lectura en el ambiente destino; Unmanaged es editable
C) La solución Unmanaged incluye código compilado
D) No hay diferencia, es solo una etiqueta

Respuesta: B.
```

---

## PL-400: Microsoft Power Platform Developer

### Descripción
Certificación técnica avanzada para desarrolladores. Valida capacidad de extender Power Platform con código: plugins C#, PCF controls, integración con Azure, y ALM avanzado.

### Dominios del examen

| Dominio | Peso |
|---------|------|
| Crear un diseño técnico | 10-15% |
| Configurar Microsoft Dataverse | 15-20% |
| Crear y configurar Power Apps | 15-20% |
| Configurar automatización del proceso de negocios | 5-10% |
| Extender la experiencia de usuario | 15-20% |
| Extender la plataforma | 20-25% |
| Desarrollar integraciones | 10-15% |

### Temas clave
**Plugins C#:**

- IPlugin, IPluginExecutionContext, IOrganizationService
- Pre-operation vs Post-operation, Synchronous vs Asynchronous
- Pre/Post Entity Images
- InvalidPluginExecutionException
- Plugin Registration Tool
- Unit testing con Moq

**PCF Controls:**

- ComponentFramework.StandardControl vs ReactControl
- Manifest XML, IInputs/IOutputs
- context.webAPI para CRUD desde el control
- context.navigation para abrir registros
- pac pcf init, push, build

**ALM y DevOps:**

- Soluciones: managed, unmanaged, patch, clone
- Solution Checker API
- Azure DevOps pipelines con Power Platform Build Tools
- Connection References y Environment Variables en pipelines

**Integraciones:**

- Dataverse Web API (OData v4)
- Custom Connectors (OpenAPI spec)
- Azure Service Bus como Service Endpoint
- WebHooks desde Dataverse
- Azure Functions como receptor de eventos

**Seguridad:**

- OAuth 2.0 para autenticación con Dataverse
- Service Principals (App Registration) para integraciones
- MSAL para obtener tokens en aplicaciones cliente

### Recursos de preparación
- Microsoft Learn: "Microsoft Power Platform Developer" learning path
- Laboratorios de GitHub: microsoft/PL-400-Microsoft-Power-Platform-Developer
- VS Code + PAC CLI instalados y practicados
- Plugin Registration Tool configurado con entorno sandbox
- Tiempo estimado: 4–6 semanas si se domina el Nivel 3 de este plan

### Estrategia para el examen
- El PL-400 tiene preguntas de código real — saber leer C# y TypeScript es obligatorio
- Muchas preguntas de "qué técnica usarías para X requisito técnico"
- Diferencias clave que siempre preguntan:
  - Cuándo usar Plugin vs Power Automate
  - Cuándo usar PCF vs Web Resource JavaScript
  - Pre-operation vs Post-operation en plugins

- Estudiar el OData query syntax ($filter, $select, $expand, $top)

### Ejemplo de preguntas
```
Pregunta: Necesitas validar que el campo "Presupuesto" sea mayor a $1,000 antes 
de guardar el registro, y si no lo es, mostrar un mensaje de error al usuario 
sin posibilidad de que pueda ser eludido. ¿Qué implementarías?
A) Business Rule con alcance "Formulario"
B) JavaScript en el evento OnSave del formulario
C) Plugin Pre-operation que lanza InvalidPluginExecutionException
D) Power Automate con trigger "When a record is created"

Respuesta: C — Solo el plugin Pre-operation se ejecuta en el servidor y no puede 
ser eludido. JavaScript y Business Rule con alcance formulario se ejecutan en el cliente.

---

Pregunta: En un plugin Post-operation síncrono en Update, ¿cómo obtienes el 
valor del campo "Estado" ANTES del cambio?
A) Leyendo el campo del Target entity
B) Leyendo el campo del PreEntityImage registrado como "PreImage"
C) Haciendo un Retrieve del registro
D) El campo siempre está disponible en el InputParameters

Respuesta: B — PreEntityImages contiene el snapshot del registro antes del cambio.
Target solo tiene los campos que fueron modificados.
```

---

## PL-600: Microsoft Power Platform Solution Architect Expert

### Descripción
La certificación más avanzada del ecosistema Power Platform. Valida capacidad de diseñar soluciones enterprise completas, tomar decisiones arquitectónicas, gestionar la entrega de proyectos complejos y comunicar con stakeholders ejecutivos.

**Prerequisito oficial:** PL-200 O PL-400 (o cualquier examen Dynamics 365 certificado)

### Dominios del examen

| Dominio | Peso |
|---------|------|
| Realizar análisis de solución | 35-40% |
| Diseñar una solución | 40-45% |
| Implementar la solución | 15-20% |

### Diferencia clave vs PL-400
El PL-400 pregunta **cómo** implementar algo técnicamente.  
El PL-600 pregunta **qué** decidirías implementar, **por qué**, y **cuáles son los riesgos**.

### Temas clave
**Análisis de solución:**

- Requirements gathering y análisis de viabilidad
- Análisis de sistemas existentes (AS-IS) y definición de solución futura (TO-BE)
- Fit-Gap Analysis
- Evaluación de riesgos
- Estrategia de migración de datos
- Definición de alcance y criterios de éxito

**Diseño de solución:**

- Arquitectura de aplicaciones (Canvas vs Model-Driven vs Pages)
- Estrategia de datos (Dataverse vs Azure SQL vs SharePoint)
- Modelo de seguridad (Roles, Field Security, Row-level, Network)
- Estrategia de integración (cuándo usar Power Automate vs Logic Apps vs Azure Functions)
- ALM y DevOps (estrategia de ambientes, pipeline CI/CD)
- Estrategia de inteligencia artificial (AI Builder, Azure AI, Copilot)
- Gobernanza y administración (CoE, DLP, Managed Environments)
- Capacidad y rendimiento (licencias, storage, API limits)

**Implementación:**

- Liderar y guiar al equipo de desarrollo
- Verificar que la implementación sigue la arquitectura diseñada
- Gestión de calidad y testing strategy
- Estrategia de formación y change management

### Formato del examen
- El PL-600 puede incluir **casos de estudio** en formato largo
- Se presenta un escenario detallado de 1–2 páginas y se hacen 5–10 preguntas sobre él
- Las preguntas son de razonamiento arquitectónico, no de sintaxis
- Tiempo: ~120 minutos
- Puntuación mínima: 700/1000

### Estrategia de preparación (plan de 8 semanas)

**Semanas 1–2: Diagnóstico**

- Completar el practice assessment de Microsoft (gratuito)
- Identificar dominios débiles
- Leer el "Exam Study Guide" oficial completo

**Semanas 3–4: Análisis de solución**

- Estudiar todos los escenarios de Fit-Gap Analysis
- Practicar con casos de estudio del blog de Power Platform
- Revisar los módulos del Nivel 4 de este plan: Módulos 31, 38, 39

**Semanas 5–6: Diseño de solución**

- Revisar cada componente y sus criterios de selección
- Practicar decisiones: "¿Canvas o Model-Driven? ¿Power Automate o Logic Apps?"
- Revisar los módulos: 18, 19, 32, 33, 34, 35

**Semana 7: Practice tests**

- MeasureUp PL-600 official practice test
- Score objetivo: ≥ 70% antes de agendar el examen real
- Revisar cada respuesta incorrecta a fondo

**Semana 8: Repaso final y mental**

- Repasar los ADRs del proyecto capstone (Módulo 40)
- Hacer el practice assessment de Microsoft una vez más
- Descansar el día anterior — la fatiga mental afecta el pensamiento arquitectónico

### Mentalidad del examen PL-600
El examinador evalúa si piensas como un arquitecto, no como un desarrollador:

| Piensas como desarrollador (incorrecto) | Piensas como arquitecto (correcto) |
|----------------------------------------|-------------------------------------|
| "Usaré un plugin porque es técnicamente correcto" | "El plugin es correcto pero el equipo no tiene experiencia en C#; evalúo Power Automate con Scope Try/Catch y Business Rule" |
| "Pondré todo en una solución" | "Separo en 3 soluciones por dominio para evitar conflictos en el ciclo de lanzamiento" |
| "El cliente pide integración en tiempo real" | "¿Realmente necesitan tiempo real o con 5 minutos de delay el negocio funciona? El async es más robusto" |
| "Azure Functions para todo" | "Power Automate para el 80% de los flujos; Azure Functions solo cuando necesito código .NET o rendimiento crítico" |

### Ejemplo de caso de estudio PL-600
```
ESCENARIO:
Fabrikam es una empresa aseguradora con 2,000 empleados en 8 países de Latam.
Tienen D365 CE para el equipo comercial y un sistema legacy de gestión de pólizas
en AS/400. Quieren:
1. Portal web para que agentes externos (no empleados) gestionen sus comisiones
2. Flujo de aprobación de pólizas nuevas que involucra 3 niveles de firma
3. Reportes de producción en tiempo real para el CEO
4. Cumplimiento con leyes de protección de datos de cada país

PREGUNTAS:

1. Para el portal de agentes, ¿qué autenticación usarías?
   A) Azure AD con cuentas del tenant de Fabrikam
   B) Azure AD B2C para usuarios externos
   C) Local authentication de Power Pages solamente
   D) No se puede implementar con Power Platform

   Respuesta: B — Los agentes son externos, no tienen cuentas del tenant corporativo.

2. Para la integración con el sistema legacy AS/400, ¿qué patrón usarías?
   A) Conector personalizado directo al AS/400
   B) Power Automate Desktop (RPA) para "leer" el sistema legacy
   C) Azure Integration Services: Azure Functions extrae datos del AS/400 + Service Bus
   D) No se puede integrar con AS/400

   Respuesta: C — Para sistemas legacy sin API, RPA (opción B) es una alternativa,
   pero el patrón más robusto para una aseguradora de 2,000 empleados es 
   Azure Integration Services con Service Bus para garantizar no pérdida de mensajes.
   (Si el examen especifica que hay API en el AS/400, D sería una opción razonable también)

3. Para cumplimiento de leyes de protección de datos por país, ¿qué considerarías primero?
   A) Implementar CMK (Customer-Managed Keys)
   B) Verificar que el ambiente de Dataverse esté en la región correcta de Azure por país
   C) Implementar DLP policies por ambiente
   D) Habilitar auditoría en todas las tablas

   Respuesta: B — La residencia de datos es el requerimiento regulatorio más fundamental.
   El ambiente debe estar en la región donde residen los datos del país correspondiente.
```

---

## Costos y Logística

### Precio del examen
- Precio estándar: **$165 USD** (puede variar por país con ajuste de poder adquisitivo)
- Descuento para estudiantes: 50% con verificación de Students Hub
- Vouchers: disponibles en eventos Microsoft (Microsoft Ignite, Build) — a veces gratuitos

### Agendar el examen
1. Ir a learn.microsoft.com → Certificaciones → buscar el examen
2. Registrarse en Pearson VUE o Certiport
3. Opciones de modalidad:
    - **Online (en casa):** requiere cámara, cuarto sin interrupciones, ID oficial
    - **Presencial (centro de pruebas):** reservar con anticipación, más control del ambiente

4. Reagendar: sin costo si se hace con más de 6 días de anticipación

### Si repruebas
- Espera mínima entre intentos: **24 horas** para el segundo intento
- Para intentos 3+: **14 días** de espera
- Máximo 5 intentos en 12 meses
- Costo de cada intento: precio completo del examen

### Renovación de certificaciones
- Las certificaciones de Power Platform se renuevan **anualmente**
- Renovación gratuita vía Microsoft Learn (examen de renovación online, sin costo)
- Si no renuevas en el plazo, la certificación expira
- Configurar recordatorio en learn.microsoft.com → tu perfil

---

## Certificaciones Complementarias Recomendadas

| Certificación | Relevancia para Power Platform |
|--------------|-------------------------------|
| **AZ-900** Azure Fundamentals | Entender los servicios Azure que se integran con Power Platform |
| **AZ-204** Azure Developer Associate | Para desarrollar Azure Functions y Logic Apps de forma profesional |
| **AZ-305** Azure Solutions Architect Expert | Complementa PL-600 con arquitectura Azure completa |
| **MB-210** Dynamics 365 Sales | Especialización en D365 Sales para consultores CRM |
| **MB-230** Dynamics 365 Customer Service | Especialización en mesa de ayuda y soporte |
| **DP-600** Microsoft Fabric Analytics Engineer | Para el rol de datos/analytics con Fabric y Power BI |

---

## ROI de las Certificaciones

### Impacto en salario (datos de referencia 2025–2026, mercado Latam)
```
Sin certificación:
  Power Platform Developer: $2,000–$3,500 USD/mes

Con PL-900 + PL-200:
  Functional Consultant: $3,000–$5,000 USD/mes (+43%)

Con PL-400:
  Developer: $4,500–$7,000 USD/mes (+100%)

Con PL-600:
  Solution Architect: $7,000–$12,000+ USD/mes (+243%)
```

### Perfil de LinkedIn con certificaciones
- Las certificaciones de Microsoft aparecen directamente en el perfil de LinkedIn
- Reclutadores de Microsoft Partners buscan activamente perfiles certificados
- La demanda de Solution Architects PL-600 supera la oferta en Latam actualmente (2026)

---

## Seguimiento de tu progreso de certificaciones

| Certificación | Estado | Fecha Aprobación | Fecha Renovación |
|--------------|--------|-----------------|-----------------|
| PL-900 | ⬜ Pendiente | | |
| PL-200 | ⬜ Pendiente | | |
| PL-400 | ⬜ Pendiente | | |
| PL-600 | ⬜ Pendiente | | |
| AZ-900 | ⬜ Pendiente | | |
| AZ-305 | ⬜ Pendiente | | |
| DP-600 | ⬜ Pendiente | | |

**Consejo:** Agenda el examen ANTES de terminar de estudiar. Tener una fecha concreta genera el compromiso necesario para completar la preparación.

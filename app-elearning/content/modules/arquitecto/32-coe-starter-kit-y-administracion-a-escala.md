---
moduleId: 32
title: "CoE Starter Kit y Administración a Escala"
level: "arquitecto"
certification: "PL-600"
estimatedMinutes: 9
slug: "coe-starter-kit-y-administracion-a-escala"
---
### 🎯 Objetivo
Implementar y operar el Center of Excellence Starter Kit de Microsoft para obtener visibilidad completa del tenant, gestionar el inventario de apps y flujos, aplicar políticas de cumplimiento automáticamente, y habilitar al equipo de gobernanza para tomar decisiones basadas en datos.

### 📖 Conceptos Clave
- **CoE Starter Kit:** colección de soluciones de Power Platform mantenida por Microsoft (disponible en aka.ms/CoEStarterKit) que otorga visibilidad total sobre el tenant: inventario de apps, flujos, conectores, makers y ambientes. Se compone de cuatro paquetes principales: Core Components (inventario y sincronización), Governance Components (compliance y aprobaciones), Nurture Components (comunidad y training) e Innovation Backlog (gestión de ideas). Se instala en un ambiente dedicado (no en Default) y sincroniza datos nocturnamente mediante flujos programados. Ejemplo: tras instalarlo en un tenant con 3,000 usuarios, el primer sync puede revelar más de 800 apps de las cuales el 60% están inactivas o sin owner identificado.
- **Core Components:** paquete base del CoE Starter Kit que crea el inventario de todos los recursos del tenant. Contiene el flujo "Admin | Sync Template v4" que se conecta a las APIs de administración de Power Apps y Power Automate para registrar cada app, flujo, conector y maker en tablas de Dataverse del ambiente CoE. Es dependencia obligatoria de los demás paquetes; debe instalarse y ejecutarse primero. Un sync completo en un tenant mediano (500-2,000 usuarios) puede tardar entre 2 y 8 horas en la primera ejecución.
- **Governance Components:** paquete del CoE que habilita procesos de cumplimiento automatizados: el "Compliance Process" contacta a makers de apps sin uso o sin owner, el "Developer Compliance Center" permite a los makers auto-gestionar el estado de sus apps, y el proceso de "App Quarantine" desactiva apps que no superan el proceso de compliance después de múltiples notificaciones. Reduce el trabajo manual del administrador al convertir tareas reactivas en procesos automáticos.
- **Nurture Components:** paquete del CoE orientado a desarrollar la comunidad de makers. Incluye: portal de onboarding para nuevos makers, seguimiento de badges y logros de aprendizaje, plantilla de newsletter mensual "Power Platform Newsetter", y el "App Catalog" donde los makers pueden publicar sus apps para que otros las descubran. Una comunidad activa reduce el shadow IT porque los makers consultan el catálogo antes de construir algo que ya existe.
- **Innovation Backlog:** componente opcional del CoE que proporciona un proceso formal para que cualquier empleado proponga ideas de automatización o apps, y el equipo de Platform Engineering las evalúe, priorice y asigne. Sustituye el proceso informal de "el jefe pide una app por Teams" por un pipeline transparente con scoring de impacto vs esfuerzo.
- **Compliance Process:** flujo automatizado del CoE Governance que se ejecuta periódicamente (configurable, típicamente cada 30 días) y envía emails personalizados a los owners de apps que llevan más de N días sin uso. El owner puede responder: mantener la app, archivarla, o transferirla a otro owner. Si no responde en 14 días, el proceso escala. Este proceso convirtió la tarea de revisar 800 apps manualmente en un flujo que el administrador solo toca cuando hay una excepción.
- **Power BI CoE Dashboard:** conjunto de reportes Power BI distribuidos con el CoE Starter Kit (archivo .pbit) que muestran el estado del tenant en tiempo real: total de apps, makers activos, ambientes, conectores en uso, tendencias de crecimiento, y apps en riesgo de compliance. Es el primer dashboard que muchos CIOs revisan para entender la "salud" de la adopción de Power Platform en su organización.
- **Environment Request Process:** formulario Canvas App + flujo de aprobación que formaliza cómo los makers solicitan nuevos ambientes. El maker llena el formulario con justificación de negocio y conectores necesarios; el arquitecto revisa si es necesario un nuevo ambiente o puede usar uno existente; si se aprueba, el script de Landing Zone se ejecuta automáticamente. Reemplaza el proceso informal de "abrir un ticket al equipo de IT y esperar semanas".
- **Maker Assessment:** cuestionario incluido en los Nurture Components que evalúa el nivel de conocimiento de un maker en distintas áreas de Power Platform (Power Apps, Power Automate, Dataverse) y le asigna un nivel (Beginner, Intermediate, Advanced). El resultado se usa para dirigir al maker a los recursos de training correctos y para que el CoE sepa qué capacitación necesita la organización.
- **App Quarantine:** proceso del CoE que desactiva (pone en cuarentena) apps que han fallado el Compliance Process después de múltiples notificaciones sin respuesta del owner. La app sigue existiendo pero sus usuarios no pueden acceder a ella; el owner puede sacarla de cuarentena respondiendo al proceso. Evita el acúmulo indefinido de apps abandonadas que representan riesgo de seguridad.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 32.1: Instalar CoE Starter Kit
1. Descargar el CoE Starter Kit desde aka.ms/CoEStarterKit
2. Crear ambiente dedicado para el CoE: `TENANT-COE` (Producción, acceso solo a admins)
3. Importar en orden:
    - Core Components (primero — es dependencia de todos)
    - Governance Components
    - Nurture Components
    - Innovation Backlog (opcional)

4. Configurar el flujo `CLEANUP - Admin | Sync Template v4`:
    - Connectors: Power Apps Admin, Power Automate Admin, Microsoft Dataverse
    - Frecuencia: 1 vez por día (carga inicial puede tardar horas)

5. Esperar la primera sincronización completa (24–48h para tenants grandes)

#### Actividad 32.2: Power BI CoE Dashboard
1. Descargar el archivo .pbit del CoE Starter Kit
2. Conectar a: el ambiente CoE Dataverse + M365 (opcional)
3. Páginas del dashboard y qué muestran:

**Página: Resumen del Tenant**
```
KPIs:
- Total Apps: 342
- Apps activas (usadas en 30 días): 187 (55%)
- Apps sin uso en 90 días: 89 → candidatas a archivado
- Makers únicos: 67
- Ambientes: 23

Gráficos:
- Apps por departamento (donut)
- Crecimiento de makers mensual (línea)
- Apps por tipo (Canvas/Model-Driven/Pages)
```

**Página: Apps sin Owner o Vencidas**
```
Tabla con:
- App Name | Environment | Last Modified | Owner | Last Used
- Filtro: "Owner is empty OR Last Used > 90 days"
→ Esta lista es el input para el Compliance Process
```

**Página: Conectores en uso**
```
Heatmap: Connector × Environment
Identificar: ¿Alguien usa un connector que debería estar bloqueado?
```

#### Actividad 32.3: Compliance Process Automation
El CoE incluye un flujo que contacta automáticamente a los owners:
```
Trigger: Recurrente (cada 30 días)
1. Obtener todas las apps con más de 90 días sin uso
2. Para cada app:
   a. Email al owner: "Tu app [nombre] no ha sido usada en 90 días.
      ¿Sigue siendo necesaria? Tienes 14 días para responder.
      [Sí, mantener] [No, archivar] [Transferir a otro owner]"
   b. Si no responde en 14 días → segunda notificación
   c. Si no responde en 28 días → notificar admin para quarantine manual
3. Si responde "No" → marcar para archivado automático
4. Si responde "Transferir" → formulario para nuevo owner
```

#### Actividad 32.4: Environment Request Process
Crear formulario para que makers soliciten ambientes:

1. Canvas App: `Solicitud de Ambiente`
2. Campos: Nombre del proyecto, Justificación de negocio, Tipo requerido (Dev/Test/Prod), Owner del proyecto, Fecha requerida, Conectores necesarios
3. Flujo de aprobación:
   ```
   Maker llena formulario
     → Aprobación Arquitecto (¿es necesario un nuevo ambiente o puede usar uno existente?)
     → Si aprobado: ejecutar script Landing Zone automáticamente
     → Notificar al maker con URL del nuevo ambiente y documentación de bienvenida
     → Registrar en CoE inventory
   ```

#### Actividad 32.5: Maker Nurture — Comunidad interna
1. Teams Channel: `Power Platform Community`
2. Canal mensual "App of the Month" — destacar el mejor proyecto de un citizen developer
3. Training path en SharePoint con badges (usando Power Apps + Dataverse):
   ```
   Nivel 1: Completó PL-900 → Badge "Power Platform Fundamentals"
   Nivel 2: Publicó su primera app → Badge "First App Published"
   Nivel 3: Completó PL-200 → Badge "Functional Consultant"
   Nivel 4: App con 50+ usuarios → Badge "Power User"
   ```

4. Flujo que registra automáticamente cuando un maker publica su primera app

### 💼 Caso Real de Negocio
**Empresa:** Multinacional con 5,000 empleados y Power Platform sin CoE  
**Problema:** El IT director no sabía cuántas apps existían ni quién las mantenía. Cada mes aparecían nuevas apps en producción que nadie había aprobado, con datos de clientes en SharePoint externo.  
**Solución:** CoE Core Components instalados → primer sync reveló 1,200 apps (el IT esperaba 200). Compliance Process archivó 340 apps sin uso. Environment Request Process formalizó el proceso de nuevos ambientes. CoE Dashboard ahora es el primer dashboard que revisa el CIO en su reunión mensual de IT.  
**Resultado:** Visibilidad 100% del tenant. Número de apps sin owner: de 600 a 12. Requests de nuevos ambientes procesados en < 2 días (antes tardaban semanas).

### ✅ Buenas Prácticas
- El ambiente del CoE debe tener su propio CoE (meta-gobernanza) — backup y pipeline propio
- No personalizar el CoE Starter Kit excesivamente — las actualizaciones de Microsoft serían imposibles de aplicar
- El compliance process debe tener un "nodo de apelación" — los makers pueden disputar el archivado
- Publicar métricas del CoE mensualmente — transparencia genera confianza con el negocio

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Sync inicial nunca termina | Tenant con miles de registros + throttling de API | Ejecutar sync incremental, no full-sync, en tenants grandes |
| Compliance emails generan fricción | Tono demasiado agresivo o automático | Personalizar el email con el nombre del maker y contexto claro |
| CoE Dashboard no muestra datos recientes | Sync deshabilitado o flujo con error | Monitorear el flujo de sync con alerta automática si falla |

### 🧪 Criterios de Validación
- [ ] CoE Core Components instalados y primer sync completado
- [ ] Power BI Dashboard muestra inventario real de apps, flujos y makers del tenant
- [ ] Compliance Process envía email automático a owners de apps sin uso
- [ ] Environment Request Process con aprobación y provisioning automatizado
- [ ] Training path con badges funciona para al menos 1 maker piloto

---

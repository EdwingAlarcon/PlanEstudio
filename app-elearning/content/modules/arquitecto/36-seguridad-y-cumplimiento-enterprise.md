---
moduleId: 36
title: "Seguridad y Cumplimiento Enterprise"
level: "arquitecto"
certification: "PL-600"
estimatedMinutes: 10
slug: "seguridad-y-cumplimiento-enterprise"
---
### 🎯 Objetivo
Implementar una postura de seguridad Zero Trust para Power Platform: clasificación de datos con Microsoft Purview, Customer-Managed Keys, Privileged Identity Management para administradores, auditoría avanzada con Microsoft Sentinel, y cumplimiento regulatorio documentado.

### 📖 Conceptos Clave
- **Zero Trust:** modelo de seguridad basado en el principio "Nunca confiar, siempre verificar" — a diferencia del modelo perimetral tradicional (confiar en todo dentro de la red corporativa), Zero Trust requiere verificar explícitamente la identidad del usuario, validar el estado del dispositivo y aplicar mínimo privilegio en cada acceso, independientemente de la ubicación de red. Microsoft implementa Zero Trust sobre tres pilares: identidad (Azure AD + MFA + Conditional Access), dispositivos (Intune compliance), y datos (Purview + DLP). Para Power Platform significa que ningún usuario, ni siquiera un admin, tiene acceso permanente a producción sin justificación verificada.
- **Microsoft Purview:** plataforma unificada de gobernanza y cumplimiento de datos de Microsoft que incluye: Data Catalog (inventario y clasificación de datos en Azure, M365, Dataverse), Information Protection (Sensitivity Labels), Data Loss Prevention (DLP avanzado que va más allá de las DLP Policies de Power Platform), Compliance Manager (evaluación de cumplimiento contra ISO 27001, GDPR, SOC2), y eDiscovery. En el contexto de Power Platform, Purview puede escanear tablas de Dataverse para detectar automáticamente datos personales y aplicar etiquetas de sensibilidad.
- **Sensitivity Labels:** clasificaciones de confidencialidad de datos definidas en Microsoft Purview que se aplican a documentos, emails, datasets de Power BI y elementos de SharePoint, y "siguen" al dato donde va (si se exporta a Excel, el Excel hereda la etiqueta). Los niveles típicos son: Público, Interno, Confidencial, Altamente Confidencial. Para Power BI, las Sensitivity Labels controlan quién puede exportar datos y a dónde; por ejemplo, un reporte con label "Confidencial" puede configurarse para que no permita exportar a Excel desde redes externas.
- **Customer-Managed Keys (CMK):** opción de cifrado donde el cliente gestiona sus propias claves de cifrado en Azure Key Vault en lugar de usar las claves manejadas por Microsoft. Con CMK activado en un ambiente Dataverse, Microsoft no puede acceder a los datos del cliente incluso en respuesta a solicitudes legales (el cliente retiene el control total de la clave). La activación requiere un ambiente Managed y puede tardar horas mientras todos los datos se re-cifran. Revocación inmediata de la clave deja el ambiente completamente inaccesible — requiere un proceso de break-glass bien documentado.
- **PIM (Privileged Identity Management):** funcionalidad de Azure AD P2 que convierte los roles privilegiados (Global Admin, Power Platform Admin) de permanentes a "elegibles" — el administrador debe activar el rol explícitamente, proporcionar justificación de negocio, obtener aprobación del manager, y el acceso expira automáticamente después de N horas. Todas las activaciones quedan en el log de auditoría. Reduce drásticamente la superficie de ataque: si una cuenta de admin es comprometida pero el rol no está activo, el atacante no tiene permisos elevados.
- **Microsoft Sentinel:** servicio SIEM (Security Information and Event Management) y SOAR (Security Orchestration and Automated Response) cloud-native de Azure. Ingiere logs de cientos de fuentes (Microsoft 365, Azure, Power Platform, sistemas externos), aplica reglas de correlación y machine learning para detectar amenazas, y puede ejecutar playbooks (Logic Apps) automáticamente como respuesta. Para Power Platform, los logs de actividad de Power Apps y Power Automate se exportan a Log Analytics Workspace y desde ahí a Sentinel, donde reglas KQL detectan patrones anómalos.
- **Conditional Access:** motor de políticas de Azure AD que evalúa cada solicitud de acceso en tiempo real y decide si otorgarlo, requerir MFA, bloquear, o restringir sesión, basándose en condiciones: ¿quién es el usuario? ¿desde qué dispositivo? ¿desde qué red? ¿qué aplicación quiere acceder? ¿cuál es el riesgo de la sesión (calculado por Azure AD Identity Protection)? Para Power Platform en producción: dispositivo debe ser Intune-compliant + MFA siempre + red fuera de oficina = sesión de solo lectura.
- **CASB (Cloud Access Security Broker):** Microsoft Defender for Cloud Apps actúa como intermediario entre usuarios y aplicaciones cloud, dando visibilidad de shadow IT (qué apps cloud usan los empleados fuera del control IT) y aplicando políticas de acceso en tiempo real. Puede detectar cuando un usuario de Power Platform descarga un volumen inusual de datos o accede desde una ubicación geográfica anómala y bloquear la sesión automáticamente. Se integra con Conditional Access para aplicar controles granulares por aplicación.
- **Power Platform Admin Activity logs:** registros de todas las acciones administrativas y de usuario en Power Platform (quién creó qué app, quién ejecutó qué flujo, quién exportó qué datos) exportables a Azure Monitor / Log Analytics Workspace via "Diagnostic settings" en el Admin Center. Son la fuente de datos para las reglas de detección en Sentinel y para auditorías de cumplimiento (GDPR Art. 30, SOX, HIPAA). Por defecto se retienen 28 días en el portal; para retención larga, exportar a Log Analytics (retención configurable hasta 2 años).
- **Data Exfiltration prevention:** conjunto de controles para prevenir que datos sensibles de Dataverse salgan por canales no autorizados. Incluye: DLP Policies (bloquear conectores que puedan enviar datos a servicios externos), Sensitivity Labels en Power BI (bloquear exportación a Excel), Managed Environments con sharing limits (prevenir que apps sean compartidas fuera del tenant), Conditional Access (bloquear descarga de datos desde dispositivos no gestionados), y reglas de Sentinel (alertar sobre descargas masivas). Ningún control individual es suficiente; la defensa en profundidad requiere todos los niveles activos.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 36.1: Clasificación de datos con Purview
1. Microsoft Purview → Data Catalog → Register source → Dynamics 365
2. Scan: escanear automáticamente tablas de Dataverse y clasificar datos sensibles
3. Clasificaciones detectadas:
    - `Credit Card Number` en columna sit_tarjetacredito
    - `Personal Email` en emailaddress1 de Contact
    - `National ID Number` en sit_numerodocumento

4. Crear Sensitivity Labels:
    - `Confidencial - Datos Personales`: aplica cifrado + protección de copia
    - `Interno - Solo empleados`: previene compartir externamente
    - `Público`: sin restricciones

5. Política de auto-etiquetado: cuando Purview detecta dato personal → aplicar label `Confidencial - Datos Personales`

#### Actividad 36.2: Customer-Managed Keys
1. Azure Key Vault → Crear clave RSA-2048: `DataverseCMK`
2. Configurar Key Rotation automática cada 12 meses
3. Admin Center → Ambientes → Configuración → Encryption → Customer-managed key
4. Seleccionar el Key Vault y la clave
5. La activación puede tardar horas — todos los datos del ambiente se re-cifran
6. Implicación: si se revoca la clave, el ambiente queda completamente inaccesible

#### Actividad 36.3: PIM para administradores de Power Platform
1. Azure AD → Privileged Identity Management → Roles de Azure AD
2. Configurar rol `Power Platform Administrator` como "Elegible" (no permanente)
3. Configuración del rol:
    - Duración máxima de activación: 8 horas
    - Requiere: justificación de negocio + aprobación de manager
    - MFA obligatorio para activar
    - Notificación al Security team

4. Proceso cuando admin necesita acceder:
    - PIM → Activar rol → ingresar justificación
    - Manager recibe email de aprobación → aprueba
    - Admin tiene acceso por máx 8 horas
    - Todas las acciones quedan en el log de auditoría

#### Actividad 36.4: Exportar logs a Microsoft Sentinel
1. Admin Center → Diagnostic settings → Add diagnostic setting
2. Logs a exportar:
    - PowerApps Activity
    - Power Automate Activity  
    - Dataverse Audit Logs

3. Destino: Azure Log Analytics Workspace (conectado a Sentinel)
4. En Sentinel → KQL queries para detectar anomalías:
   ```kql
   // Detectar descargas masivas de datos (posible exfiltración)
   PowerAppsActivity
   | where ActivityDateTime > ago(1h)
   | where Operation == "DataExport" or Operation == "RetrieveMultiple"
   | summarize count_ops = count(), 
               total_records = sum(toint(parse_json(AdditionalInfo).RecordCount))
               by UserId, bin(ActivityDateTime, 5m)
   | where total_records > 10000
   | project ActivityDateTime, UserId, count_ops, total_records
   | order by total_records desc
   
   // Detectar acceso fuera de horario laboral
   PowerAppsActivity
   | where ActivityDateTime > ago(24h)
   | extend hora = hourofday(ActivityDateTime)
   | where hora < 6 or hora > 22  // fuera de 6am-10pm
   | where IpAddress !startswith "10." // no es red interna
   | summarize count() by UserId, IpAddress, AppName
   | where count_ > 5
   ```

5. Crear Alert Rules en Sentinel:
    - "Descarga masiva de datos > 10,000 registros en 5 min" → Severidad Alta
    - "Acceso a PROD fuera de horario desde IP externa" → Severidad Media

#### Actividad 36.5: Conditional Access para Power Platform
1. Azure AD → Conditional Access → Nueva política
2. Nombre: `PP-Producción-MFA-Dispositivo-Cumplimiento`
3. Usuarios: todos, excepto cuentas de break-glass
4. Apps de nube: `Power Apps`, `Power Automate`, `Microsoft Flow`
5. Condiciones:
    - Plataformas de dispositivos: Any (para capturar todos)
    - Ubicaciones: fuera de IPs corporativas

6. Controles de acceso:
    - Requerir MFA
    - Requerir dispositivo marcado como cumplimiento (Intune)
    - Requerir app cliente aprobada

7. Modo: Reporte (audit first) → cambiar a Enforced después de 2 semanas

### 💼 Caso Real de Negocio
**Empresa:** Empresa de salud con datos de pacientes en Dataverse  
**Problema:** Auditoría de HIPAA/HITECH reveló que los logs de acceso a datos de pacientes no se estaban conservando. Un ex-empleado descargó datos de 50,000 pacientes en su último día de trabajo y nadie lo detectó hasta 3 meses después.  
**Solución:** Sentinel con regla de detección de descarga masiva hubiera alertado en tiempo real. CMK para que los datos sean inaccesibles sin la clave corporativa. PIM para acceso a datos de producción con aprobación. Purview clasifica automáticamente datos de pacientes.  
**Resultado:** Brecha similar detectada en 4 minutos en el simulacro post-implementación. Cumplimiento HIPAA certificado en auditoría siguiente.

### ✅ Buenas Prácticas
- CMK es irreversible en muchos casos — probar en ambiente sandbox primero
- PIM con duración máxima de 8h para administración rutinaria; proceso de emergencia separado (break-glass accounts)
- Los logs de Power Platform en Sentinel deben retener mínimo 90 días (GDPR) o 1 año (regulaciones financieras)

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| CMK activado en PROD sin probar el proceso de rotación de clave | Se activa CMK para cumplimiento pero nunca se simula una rotación | Probar la rotación de clave en el ambiente de staging antes de activar en PROD; documentar el procedimiento paso a paso con tiempos esperados |
| PIM configurado pero nadie lo usa porque el proceso es "muy lento" | Falta de adopción cultural — los admins prefieren mantener roles permanentes | El sponsor ejecutivo (CISO o CTO) debe exigir el uso de PIM con un plazo concreto; configurar alertas si hay roles privilegiados permanentes activos |
| Reglas de Sentinel generan demasiadas alertas falsas positivas | Umbrales demasiado sensibles configurados sin línea base del comportamiento normal | Pasar las primeras 2 semanas en modo "Observation" (alertas sin incidentes) para establecer la línea base antes de activar respuestas automáticas |
| Conditional Access bloquea acceso legítimo en el go-live | La política se activó en modo "Enforced" sin período de prueba en modo "Report-only" | Siempre activar Conditional Access en modo "Report-only" primero (2 semanas mínimo) para identificar usuarios legítimos que serían bloqueados |

### 🧪 Criterios de Validación
- [ ] Purview escanea el ambiente Dataverse y clasifica datos sensibles correctamente
- [ ] PIM configurado para rol Power Platform Admin — activación requiere justificación y MFA
- [ ] Logs exportados a Log Analytics y query KQL detecta descarga masiva simulada
- [ ] Conditional Access bloquea acceso a Power Platform desde dispositivo no cumpliente

---

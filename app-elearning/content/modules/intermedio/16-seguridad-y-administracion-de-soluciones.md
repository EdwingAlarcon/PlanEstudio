---
moduleId: 16
title: "Seguridad y Administración de Soluciones"
level: "intermedio"
certification: "PL-200"
estimatedMinutes: 10
slug: "seguridad-y-administracion-de-soluciones"
---
### 🎯 Objetivo
Implementar una estrategia de ambientes múltiples (DEV → TEST → UAT → PROD), empaquetar soluciones correctamente con Connection References y Environment Variables, y establecer controles de seguridad de acceso basados en roles a nivel de la plataforma.

### 📖 Conceptos Clave
- **Solución administrada (Managed):** paquete de solución importado en modo de solo lectura en el ambiente destino — los usuarios no pueden modificar directamente sus componentes (tablas, flujos, apps). Cualquier cambio debe realizarse en el ambiente fuente (DEV), re-exportar como Managed, y volver a importar. Esto protege la integridad del trabajo del implementador y facilita las actualizaciones controladas. Para personalizar componentes de una solución managed de un tercero, se usan "unmanaged layers" encima. Siempre exportar como Managed para TEST/UAT/PROD.

- **Solución no administrada (Unmanaged):** solución editable donde los componentes pueden modificarse directamente en el ambiente donde está importada. Es el formato de trabajo en el ambiente de desarrollo (DEV). Al exportar en modo Unmanaged, se puede compartir el trabajo entre desarrolladores. Peligro: si se importa Unmanaged en PROD, los usuarios pueden modificar componentes, creando divergencia entre ambientes. Nunca importar soluciones Unmanaged en ambientes de producción.

- **Connection Reference:** componente de solución que actúa como abstracción de una conexión específica en Power Platform. En lugar de vincular un flujo directamente a una conexión (que depende del usuario y ambiente), el flujo referencia una Connection Reference nombrada. Al importar la solución en otro ambiente, el administrador configura qué conexión real mapea cada Connection Reference. Esto desacopla el componente de las credenciales del desarrollador y habilita un verdadero ALM. Ejemplo: `CR_SIT_Dataverse_Principal` apunta a la conexión de Dataverse del ambiente destino.

- **Environment Variables:** pares nombre-valor definidos en la solución que permiten que la misma solución funcione en múltiples ambientes con configuraciones diferentes. Cada variable tiene un valor "por defecto" (definido en la solución) y un valor "actual" (configurado por ambiente, fuera de la solución). Tipos: Texto, Número decimal, Boolean, JSON, Secreto (almacenado en Azure Key Vault). Se acceden en flujos y código. Ejemplo: `sit_EmailNotificaciones` tiene valor `dev-notif@empresa.com` en DEV y `prod-notif@empresa.com` en PROD, sin cambiar el flujo.

- **Solution Layers:** sistema de superposición de soluciones en Dataverse que permite que múltiples soluciones modifiquen el mismo componente (tabla, formulario, flujo) en diferentes capas. La solución importada más recientemente prevalece sobre las anteriores. Visible en: Soluciones → seleccionar componente → "Ver capas de solución". Importantísimo al personalizar soluciones de terceros (como Dynamics 365): las personalizaciones van en una solución propia encima, no modificando la solución base.

- **Managed Properties:** configuraciones en los componentes de una solución managed que controlan qué puede modificar el importador. Se configuran antes de exportar. Opciones por componente: ¿puede personalizarse? (sí/no), ¿puede eliminarse?, ¿puede renombrarse?. Útil para ISVs que quieren proteger su IP intelectual: marcar formularios como no personalizables impide que el cliente los modifique directamente. Para soluciones internas, generalmente se deja todo personalizable para dar flexibilidad al implementador de campo.

- **Dependency tracking:** Dataverse registra automáticamente las dependencias entre componentes de una solución (qué flujos usan qué tablas, qué apps usan qué componentes, etc.). Si intentas eliminar un componente del que depende otro, Dataverse bloquea la operación y muestra las dependencias. Al construir soluciones, la herramienta "Solution Checker" detecta dependencias faltantes que causarían fallos al importar. Importante verificar dependencias antes de exportar: Solución → botón "Comprobación de solución".

- **Seguridad de ambiente (Power Platform Admin Center):** conjunto de controles administrativos para cada ambiente en el Admin Center. Incluye: quién puede crear aplicaciones y flujos (Configuración → Funciones de entorno), qué conectores están permitidos (DLP Policies), gestión de capacidad y almacenamiento, habilitación de características de Managed Environments, y auditoría de actividad. El administrador del ambiente puede ver todos los flujos y apps (incluso los no compartidos), lo que facilita la gobernanza.

- **DLP Policy (Data Loss Prevention):** política configurada en el Power Platform Admin Center que clasifica los conectores disponibles en tres grupos: `Business` (datos corporativos, pueden combinarse entre sí), `Non-Business` (datos personales/externos, pueden combinarse entre sí pero no con Business), y `Blocked` (no pueden usarse en ningún flujo en los ambientes cubiertos). La política previene que datos corporativos (Dataverse, SharePoint) se combinen con conectores externos no controlados (Twitter, Gmail). Se aplica por ambiente o a nivel de tenant. Ejemplo: política que pone HTTP genérico en Blocked en PROD para prevenir exfiltración de datos.

- **Security Roles:** conjuntos de permisos granulares sobre tablas de Dataverse que controlan qué operaciones puede realizar un usuario (Crear, Leer, Escribir, Eliminar, Agregar, Adjuntar, Asignar, Compartir) y en qué scope (Usuario, Unidad de Negocio, Organización, Padre:Hijo). Los roles se asignan a usuarios o equipos (Teams). Un usuario puede tener múltiples roles y los permisos son aditivos (el más permisivo gana). Los roles también controlan acceso a características de la plataforma (ver Analytics, exportar a Excel, personalizar el sistema).

- **Teams (Dataverse):** grupos de usuarios en Dataverse que permiten asignar Security Roles a un conjunto de personas en lugar de individualmente. Tipos: Owner Teams (tienen propietario, pueden poseer registros), Access Teams (no poseen registros, acceso puntual compartido), Azure AD Group Teams (sincronizados con grupos de Microsoft Entra ID, el más recomendado para entornos grandes). Usar AD Group Teams permite gestionar miembros desde Microsoft Entra sin tocar Power Platform.

- **Principio de mínimo privilegio:** práctica de diseño de seguridad que establece que cada usuario, rol o proceso debe tener solo los permisos estrictamente necesarios para realizar su función, nada más. En Dataverse implica: no asignar el rol "System Administrator" a usuarios finales, crear roles específicos por función (Jefe de Proyecto, Consultor, Auditor), usar Field Security Profiles para columnas sensibles, y revisar periódicamente los permisos asignados. Una violación de datos causada por exceso de permisos es un riesgo regulatorio y reputacional.

### 👨‍💻 Actividades Prácticas Paso a Paso

#### Actividad 16.1: Estrategia de ambientes
1. Admin Center → Ambientes → Nuevo ambiente por cada capa:
    - `SIT-DEV`: Sandbox, región US o Latam, 1GB
    - `SIT-TEST`: Sandbox, misma región
    - `SIT-UAT`: Sandbox
    - `SIT-PROD`: Producción

2. Configurar cada ambiente:
    - Nombre de publisher: `SIT Consulting`
    - Prefijo: `sit`
    - Versión inicial de la solución: `1.0.0.0`

3. Crear la solución base en DEV:
    - make.powerapps.com (en entorno DEV) → Soluciones → Nueva
    - Nombre: `SIT Gestión de Proyectos`
    - Publisher: SIT Consulting (prefijo: sit)
    - Versión: `1.0.0.0`

#### Actividad 16.2: Connection References y Environment Variables
1. **Connection Reference** para Dataverse:
    - En la solución → Agregar existente → Referencia de conexión
    - Nombre: `CR_SIT_Dataverse_Principal`
    - Conector: Microsoft Dataverse
   
2. **Environment Variables:**
    - En la solución → Nuevo → Variable de entorno
    - `sit_EmailNotificaciones`: tipo Texto, valor DEV: `dev-notif@empresa.com`
    - `sit_UrlPortalEmpleados`: tipo Texto, valor: `https://dev-portal.empresa.com`
    - `sit_MaximoAprobacionAutomatica`: tipo Número decimal, valor: `5000`
    - `sit_ModoDebug`: tipo Boolean, valor: `true`

3. Usar Environment Variables en flujos:
    - En Power Automate → Acción → Obtener valor de variable de entorno
    - Seleccionar `sit_EmailNotificaciones`
    - Usar el valor en el campo "To" del correo

4. Al importar en TEST/PROD: las variables de entorno deben tener valores propios:
    - Importar solución → paso de "Connection References" → configurar cada conexión
    - Paso de "Environment Variables" → ingresar valores de TEST/PROD

#### Actividad 16.3: Security Roles personalizados
1. make.powerapps.com → Configuración → Seguridad → Roles de seguridad → Nuevo

2. **Rol: Jefe de Proyecto**
   ```
   Tabla Proyecto:
     Crear: SÍ (nivel Usuario)
     Leer: SÍ (nivel Organización)
     Escribir: SÍ (nivel Usuario — solo los propios)
     Eliminar: SÍ (nivel Usuario)
     Compartir: NO
   
   Tabla Tarea:
     Crear: SÍ (nivel Usuario)
     Leer: SÍ (nivel Organización)
     Escribir: SÍ (nivel Organización — puede editar tareas de su equipo)
     Eliminar: SÍ (nivel Usuario)
   
   Tabla Configuración Global:
     Leer: SÍ (nivel Organización)
     Crear/Escribir/Eliminar: NO
   ```

3. **Rol: Consultor (solo lectura)**
   ```
   Tabla Proyecto: Leer SÍ (Organización), resto NO
   Tabla Tarea: Leer SÍ (Organización), resto NO
   ```

4. Asignar rol a usuario:
    - Configuración → Seguridad → Usuarios → seleccionar usuario → Administrar roles

#### Actividad 16.4: DLP Policy
1. Admin Center → Políticas → Directivas de datos → Nueva directiva
2. Nombre: `Política Producción SIT`
3. Ambientes: seleccionar `SIT-PROD` (y UAT)
4. Clasificar conectores:
    - **Business (Negocio):** Microsoft Dataverse, SharePoint, Office 365, Teams, Outlook
    - **Non-Business:** Twitter, Facebook, Gmail, Dropbox
    - **Blocked:** HTTP (genérico), RSS, todos los conectores de redes sociales externas

5. Guardar → la política se aplica en minutos
6. Verificar: intentar crear flujo con conector de Gmail en PROD → debe ser bloqueado

#### Actividad 16.5: Exportar e importar solución
1. En DEV → Solución → Exportar:
    - Versión: `1.0.1.0`
    - Tipo: **Administrada** (para TEST/PROD)
    - Descargar el .zip

2. En TEST → Importar:
    - Importar archivo .zip
    - Seguir wizard: configurar Connection References, Environment Variables
    - Elegir: "Actualizar" si ya existe, "Crear" si es primera vez

3. Verificar en TEST:
    - La app aparece como Managed (ícono de candado — no editable)
    - Los flujos usan las Connection References del ambiente TEST
    - Las Environment Variables tienen los valores de TEST

### 💼 Caso Real de Negocio
**Empresa:** Firma de consultoría que vende soluciones Power Platform a clientes  
**Problema:** Cuando exportaban soluciones, los flujos fallaban en el cliente porque tenían la URL y credenciales del entorno de desarrollo hardcodeadas.  
**Solución:** Todas las URLs y emails movidos a Environment Variables. Todas las conexiones convertidas a Connection References. El wizard de importación guía al cliente para configurar sus propias credenciales. DLP policy estándar entregada como parte de la implementación.  
**Resultado:** Tiempo de implementación en nuevo cliente de 3 días a 4 horas. Cero tickets de "el flujo falla" por credenciales incorrectas.

### ✅ Buenas Prácticas
- Exportar siempre en modo Managed para TEST/UAT/PROD; nunca exportar Unmanaged a producción
- Versionar semánticamente: breaking changes = mayor, features = menor, fixes = patch
- Nunca editar componentes directamente en PROD — siempre DEV → solución → importar
- Connection References: una por tipo de servicio, no una por flujo
- DLP Policy: siempre bloquear HTTP genérico en producción si no es necesario
- Documentar los valores de Environment Variables de cada ambiente en un archivo seguro (no en el repo)

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| "Missing dependency" al importar | Un componente referenciado no está en la solución de destino | Agregar las dependencias a la solución o importarlas primero |
| Flujo falla en PROD con "Invalid connection" | Connection Reference no configurada | En el ambiente destino: Soluciones → Connection References → configurar |
| Environment Variable sin valor en PROD | No se configuró durante la importación | Ir a Variables de entorno → editar → agregar valor actual del ambiente |
| Solución managed no deja editar | Es el comportamiento correcto | Modificar en DEV y volver a importar como nueva versión |

### 🧪 Criterios de Validación
- [ ] 4 ambientes creados en Admin Center (DEV/TEST/UAT/PROD)
- [ ] Connection References configuradas para Dataverse y Office 365
- [ ] 4 Environment Variables creadas y usadas en al menos un flujo
- [ ] Security Role "Jefe de Proyecto" con permisos correctos asignado a usuario de prueba
- [ ] DLP Policy bloquea el conector HTTP en el ambiente de producción
- [ ] Solución exportada como Managed e importada exitosamente en TEST con wizard de configuración

---

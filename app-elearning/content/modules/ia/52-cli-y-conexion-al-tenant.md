---
moduleId: 52
title: "Power Platform CLI y Conexión Segura al Tenant"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 10
slug: "cli-y-conexion-al-tenant"
---
### 🎯 Objetivo
Configurar un entorno de desarrollo local para Power Platform, entender la diferencia entre tenant, entorno (environment) y organización, y conectarte de forma segura con Power Platform CLI (`pac`) sin arriesgar trabajar por error contra producción.

### 📖 Conceptos Clave
- **Tenant:** el directorio de Microsoft Entra ID que agrupa todos los entornos, usuarios y licencias de una organización. Un cliente/empresa normalmente tiene un solo tenant, pero puede tener decenas de entornos dentro de él.
- **Environment (entorno):** un contenedor lógico dentro del tenant con su propia base de datos de Dataverse (si tiene una), sus propias apps, flujos y seguridad. Tipos comunes: **Production** (datos y usuarios reales), **Sandbox** (copia para pruebas, se puede reiniciar/reconvertir), **Trial** (30 días, para evaluación), **Developer** (gratuito, un solo usuario, ligado a tu cuenta, ideal para practicar sin arriesgar nada), **Default** (entorno compartido de todo el tenant, no recomendado para desarrollo serio).
- **Organización (Dataverse organization):** cuando un entorno tiene Dataverse habilitado, Microsoft crea una "organización" con una URL única (`https://<nombre-org>.crm.dynamics.com` o regiones equivalentes) — es el punto de conexión real para Web API, plugins y la mayoría de herramientas.
- **Perfil de autenticación de `pac`:** un conjunto guardado de credenciales + URL de entorno que `pac auth` administra localmente; puedes tener varios perfiles guardados (uno por cliente/entorno) y cambiar entre ellos sin volver a autenticarte cada vez.
- **Separación Dev/Test/Prod:** cada etapa del ciclo de vida de una solución debe vivir en su propio entorno — nunca se desarrolla ni se prueba directamente en Production. Esto es la base de cualquier estrategia de ALM que se vea en el Módulo 54.
- **Entorno personal vs. compartido:** un entorno Developer es tuyo y aislado (bueno para practicar y romper cosas); un entorno Default o un Sandbox compartido por el equipo requiere coordinación — nunca lo uses como "sandbox personal" para experimentar sin avisar.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Instala los prerequisitos: [Node.js LTS](https://nodejs.org) (versión par más reciente, ej. 20 o 22), [Git](https://git-scm.com), [VS Code](https://code.visualstudio.com) con la extensión **Power Platform Tools**, y Power Platform CLI:
   ```bash
   dotnet tool install --global Microsoft.PowerApps.CLI.Tool
   # o, si prefieres npm:
   npm install -g @microsoft/powerplatform-cli
   pac help
   ```
2. Confirma la instalación y la versión:
   ```bash
   pac --version
   ```
3. Crea un perfil de autenticación apuntando a un entorno **Developer** o **Sandbox** (nunca uses Production para practicar este módulo):
   ```bash
   pac auth create --environment "https://orgXXXXXXXX.crm.dynamics.com"
   ```
   Esto abre el navegador para el login interactivo con tu cuenta de Microsoft Entra ID y guarda el perfil localmente.
4. Lista los perfiles guardados para ver todos los entornos a los que tienes acceso configurado:
   ```bash
   pac auth list
   ```
5. Si trabajas con más de un cliente o entorno, selecciona explícitamente el perfil activo antes de ejecutar cualquier comando:
   ```bash
   pac auth select --index 1
   ```
6. Valida SIEMPRE contra qué organización estás apuntando antes de ejecutar un comando que modifique algo (export, import, solución, datos):
   ```bash
   pac org who
   ```
   Este comando muestra la URL del entorno, el ID de la organización y el usuario autenticado — es tu "doble verificación" antes de cualquier operación.
7. Crea en tu repo local una carpeta de estructura básica (`solutions/`, `src/`, `docs/`) y un archivo `.env.example` (sin valores reales) documentando qué variables de entorno usará tu proyecto para Dev/Test/Prod.

### 💼 Casos Reales de Negocio
Un consultor de Servicios Integrados Tecnológicos S.A. (SIT) atendía tres clientes distintos en la misma semana y tenía perfiles de `pac auth` guardados para cada uno. Un viernes, sin ejecutar `pac org who` antes de un `pac solution export`, exportó y sobrescribió sin querer una solución del Cliente B pensando que estaba conectado al entorno de pruebas del Cliente A — el perfil activo había quedado seleccionado de la sesión anterior. Ningún dato de producción se perdió porque no era el ambiente productivo, pero el incidente generó confusión y retrabajo. Desde entonces, el equipo adoptó como regla obligatoria: **ejecutar `pac org who` antes de cualquier comando que exporte, importe o modifique algo**, y nombrar los perfiles de forma explícita por cliente y entorno (ej. `sit-cliente-a-dev`, `sit-cliente-a-prod`).

### ✅ Buenas Prácticas
- Practica y experimenta siempre en un entorno **Developer** o **Sandbox** propio, nunca en Production ni en un entorno compartido sin coordinar con el equipo.
- Ejecuta `pac org who` antes de cualquier comando que exporte, importe o modifique datos/soluciones, sin excepción.
- Nombra tus perfiles de autenticación de forma clara por cliente/entorno para evitar confundirlos cuando manejas múltiples tenants.
- Nunca compartas ni subas a git el resultado de `pac auth list` ni ningún archivo de configuración local que contenga tokens o rutas de credenciales.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Ejecutar un comando destructivo contra el entorno equivocado | No verificar el perfil activo antes de operar | Ejecutar siempre `pac org who` antes de exportar/importar/modificar |
| Confundir "Default environment" con un entorno de desarrollo propio | Asumir que el entorno compartido del tenant es seguro para experimentar | Crear un entorno Developer o Sandbox dedicado para práctica |
| Perder el rastro de a qué cliente pertenece cada perfil de `pac auth` | Nombrar los perfiles de forma genérica o no nombrarlos | Usar convención de nombres clara (cliente-entorno) al crear cada perfil |
| Instalar `pac` sin verificar la versión y encontrar comandos que no existen en tutoriales antiguos | No revisar `pac --version` ni la documentación oficial vigente | Verificar versión instalada y consultar `pac help` para el comando exacto disponible |

### 🧪 Criterios de Validación
- [ ] Instalé Power Platform CLI y confirmé la versión con `pac --version`
- [ ] Creé un perfil de autenticación contra un entorno Developer o Sandbox (no producción)
- [ ] Listé mis perfiles con `pac auth list` y seleccioné uno explícitamente con `pac auth select`
- [ ] Verifiqué la organización activa con `pac org who` antes de continuar
- [ ] Explico la diferencia entre tenant, environment y organización con mis propias palabras

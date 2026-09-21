---
moduleId: 68
title: "Entorno, instalación y arquitectura PAD"
level: "rpa"
certification: "Power Automate for desktop & RPA"
estimatedMinutes: 25
slug: "entorno-instalacion-arquitectura-pad"
---

## 🎯 Objetivo

Preparar un entorno de Power Automate for desktop entendiendo consola, diseñador, máquina registrada, conexión de máquina, machine group, usuario, cuenta de servicio, sesión y diferencias attended/unattended.

## 📖 Conceptos Clave

Power Automate for desktop diseña desktop flows; el Machine Runtime permite ejecutar flujos desde Power Automate cloud. Una máquina registrada representa el equipo; una conexión de máquina define cómo Power Automate inicia sesión; un machine group distribuye ejecuciones; el usuario o cuenta de servicio determina permisos y perfil Windows.

- **Requisitos de sistema:** Windows 10 (Home, Pro o Enterprise), Windows 11 (Home, Pro o Enterprise) o Windows Server 2016/2019/2022/2025. No hay soporte para procesadores ARM. En Windows Home puedes crear y ejecutar flujos en modo attended (local), pero no puedes activarlos desde la nube ni ejecutarlos unattended — eso requiere Pro, Enterprise o Server.
- **Dos formas de instalar, con implicaciones distintas:**
  - **Instalador MSI** (`Setup.Microsoft.PowerAutomate.exe`, descarga oficial desde el [portal de Power Automate](https://learn.microsoft.com/power-automate/desktop-flows/install)): requiere permisos de administrador local, incluye la opción de instalar el **Machine-runtime app** (necesaria para conectar la máquina al portal de Power Automate y habilitar ejecución desde la nube/unattended), y admite instalación silenciosa (`-Silent -Install -ACCEPTEULA`) para despliegues en varias máquinas.
  - **Microsoft Store**: no requiere permisos de administrador y se actualiza automáticamente, pero no incluye el Machine-runtime app (debe instalarse aparte desde el MSI si se necesita) y no admite instalación silenciosa. Pensada para equipos individuales sin rol de administrador.
  - No se pueden tener ambas instalaciones (MSI y Store) al mismo tiempo en la misma máquina.
- **Licenciamiento mínimo para RPA real:** crear y ejecutar flujos de escritorio en modo attended dentro de tu propio equipo no requiere licencia adicional sobre Microsoft 365, pero **ejecución unattended** (sin usuario presente, disparada desde la nube) requiere un plan Power Automate Premium/Process o el add-on de RPA unattended — verifica esto antes de diseñar cualquier actividad que asuma ejecución desatendida.

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Antes de instalar nada, corre el [script verificador de estación](/preparar-entorno) con el perfil **RPA** para confirmar qué falta en tu máquina (Windows, navegador, permisos).
2. Instala Power Automate for desktop siguiendo estos pasos concretos:
   - Descarga el instalador desde la página oficial de instalación (enlace en Referencias oficiales) — evita instaladores de terceros.
   - Ejecuta `Setup.Microsoft.PowerAutomate.exe`. Si no tienes permisos de administrador en tu equipo, usa la opción de Microsoft Store en su lugar.
   - En el asistente, marca explícitamente **Machine-runtime app** si vas a necesitar ejecución desde la nube o unattended más adelante (más fácil marcarlo ahora que reinstalar después).
   - Acepta los términos de uso y completa la instalación.
   - Verifica la instalación abriendo Power Automate for desktop desde el menú Inicio y confirmando que aparece el diseñador.
   - Vuelve a correr el [script verificador](/preparar-entorno) y confirma que ahora detecta la herramienta instalada. Si sigue marcando "no instalada" pero sí la ves instalada, cierra y abre una terminal nueva antes de reportarlo como error de contenido — es la causa más común.
3. Identifica consola, diseñador, variables, UI elements, run history y configuración.
4. Registra la máquina en el ambiente DEV.
5. Documenta si puedes ejecutar attended, unattended o solo simulación.
6. Crea una matriz DEV/TEST/PROD con máquinas, usuarios, secretos y owner.

## 💼 Casos Reales de Negocio

Un bot funciona en el equipo del desarrollador pero no en la VM de operaciones porque la aplicación legacy solo está instalada en un perfil de usuario. La solución no es editar acciones al azar: es corregir arquitectura de máquina, sesión, usuario, instalación y readiness.

## ✅ Buenas Prácticas

- Usa DEV, TEST y PROD separados.
- Declara quién administra la máquina y quién administra el flujo.
- No guardes contraseñas en notas, Excel ni variables visibles.
- Valida sesión, resolución, bloqueo de pantalla y permisos.
- Documenta limitaciones de licencia sin fijar precios.

## ⚠️ Errores Comunes

- Confundir cuenta que crea la conexión con cuenta que ejecuta Windows.
- Probar attended y asumir que unattended funcionará igual.
- Ejecutar pruebas contra producción.
- Ignorar políticas DLP, acceso a archivos y antivirus.

## 🧪 Criterios de Validación

- [ ] Instalé Power Automate for desktop (MSI o Microsoft Store) y el script verificador de `/preparar-entorno` lo confirma.
- [ ] Diferencio máquina, conexión, grupo de máquinas, usuario y sesión.
- [ ] Sé explicar attended vs unattended con impacto operativo.
- [ ] Tengo un checklist de readiness de máquina.
- [ ] Documenté limitaciones de licencia/tenant.
- [ ] Separé DEV/TEST/PROD sin cambios directos en producción.

## Evidencia

Machine readiness checklist, matriz de ambientes, captura del runtime o simulación marcada. Lab recomendado: LAB-111. Incidente relacionado: INC-RPA-002.

## Preguntas de verificación

1. ¿Qué revisarías si un flujo funciona attended y falla unattended?
2. ¿Por qué la sesión Windows importa para PAD?
3. ¿Qué debe contener un registro de máquina RPA?

## Conexión con siguiente módulo

Con el entorno claro, el siguiente paso es construir desktop flows mantenibles y no monolíticos.

## Limitaciones y seguridad

La ejecución unattended requiere licencia/capacidad y configuración compatible. Si no existe, entrega variante simulada y no la declares como validación real.

## Referencias oficiales

- [Install Power Automate](https://learn.microsoft.com/power-automate/desktop-flows/install)
- [Prerequisites and limitations](https://learn.microsoft.com/power-automate/desktop-flows/requirements)
- [Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)
- [Run unattended desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/run-unattended-desktop-flows)
- [Trigger desktop flows from cloud flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/trigger-desktop-flows)

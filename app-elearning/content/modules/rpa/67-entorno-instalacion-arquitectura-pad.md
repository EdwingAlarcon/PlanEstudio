---
moduleId: 67
title: "Entorno, instalación y arquitectura PAD"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 20
slug: "entorno-instalacion-arquitectura-pad"
---

## 🎯 Objetivo

Preparar un entorno de Power Automate Desktop entendiendo consola, diseñador, máquina registrada, conexión de máquina, machine group, usuario, cuenta de servicio, sesión y diferencias attended/unattended.

## 📖 Conceptos Clave

Power Automate Desktop diseña desktop flows; el Machine Runtime permite ejecutar flujos desde Power Automate cloud. Una máquina registrada representa el equipo; una conexión de máquina define cómo Power Automate inicia sesión; un machine group distribuye ejecuciones; el usuario o cuenta de servicio determina permisos y perfil Windows.

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Revisa requisitos de Windows, navegador, extensión y permisos locales.
2. Instala o valida Power Automate Desktop en una máquina de laboratorio.
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

- [Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)
- [Run unattended desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/run-unattended-desktop-flows)
- [Trigger desktop flows from cloud flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/trigger-desktop-flows)

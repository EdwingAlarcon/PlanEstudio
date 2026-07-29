---
moduleId: 75
title: "ALM, operación, gobierno y soporte RPA"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 24
slug: "alm-operacion-gobierno-soporte-rpa"
---

## 🎯 Objetivo

Preparar desktop flows para despliegue, UAT, rollback, monitoreo, soporte, ownership, seguridad, DLP, licencias, continuidad, mantenimiento y deprecación.

## 📖 Conceptos Clave

Un desktop flow no termina cuando funciona en DEV. Debe vivir en una solución con dependencias, variables de entorno, connection references, documentación, pruebas, deployment plan, rollback plan, runbook, owner y calendario de mantenimiento.

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Empaqueta cloud flow, desktop flow y dependencias en solución.
2. Define variables de entorno para rutas, URLs, listas y modo.
3. Documenta connection references y credenciales sin revelar secretos.
4. Crea plan UAT con casos positivos, negativos, timeout y duplicado.
5. Diseña deployment checklist y rollback.
6. Crea runbook de operación y registro de automatización.
7. Define revisión mensual de selectores y continuidad.

## 💼 Casos Reales de Negocio

Un bot se importó a TEST con ruta local de DEV y credencial del desarrollador. Falló el primer día de UAT. Un proceso ALM correcto habría usado configuración por ambiente, connection references, validación postdeploy y rollback.

## ✅ Buenas Prácticas

- DEV unmanaged; TEST/PROD con promoción controlada.
- Variables por ambiente, no rutas hardcodeadas.
- Connection references y cuentas de servicio gobernadas.
- Runbook con severidad, SLA y escalamiento.
- Inventario con owner, criticidad y próxima revisión.

## ⚠️ Errores Comunes

- Cambios directos en producción.
- Permisos excesivos.
- Ausencia de rollback.
- No documentar máquina o cuenta.
- Olvidar DLP, auditoría y protección de datos.

## 🧪 Criterios de Validación

- [ ] Diseño ALM con solución y configuración por ambiente.
- [ ] Creo deployment y rollback checklist.
- [ ] Creo runbook y registro de automatización.
- [ ] Defino monitoreo y soporte.
- [ ] Puedo defender seguridad, gobierno y continuidad.

## Evidencia

Deployment plan, rollback plan, runbook, governance register, test plan, UAT y matriz de seguridad. Labs recomendados: LAB-111 y LAB-112. Incidente relacionado: INC-RPA-006.

## Preguntas de verificación

1. ¿Qué revisarías después de importar una solución con desktop flow?
2. ¿Por qué una variable de entorno reduce riesgo?
3. ¿Qué debe contener un runbook RPA?

## Conexión con siguiente módulo

Este módulo cierra la ruta y prepara el capstone de automatización end-to-end.

## Limitaciones y seguridad

No publiques bots críticos sin validación en tenant, pruebas UAT, owner operativo y rollback aprobado.

## Referencias oficiales

- [Export a solution](https://learn.microsoft.com/en-us/power-automate/export-flow-solution)
- [Use environment variables in Power Platform solutions](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables)
- [Use a connection reference in a solution](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-connection-reference)

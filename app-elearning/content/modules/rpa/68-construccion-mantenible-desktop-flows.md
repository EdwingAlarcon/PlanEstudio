---
moduleId: 68
title: "Construcción mantenible de desktop flows"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 18
slug: "construccion-mantenible-desktop-flows"
---

## 🎯 Objetivo

Construir desktop flows modulares con acciones, variables, listas, data tables, condiciones, bucles, subflows, inputs, outputs, logging y manejo básico de errores.

## 📖 Conceptos Clave

Un desktop flow profesional se organiza por intención: inicialización, configuración, ejecución, validación, manejo de errores, cierre y logging. Las variables deben nombrarse por propósito, los subflows por responsabilidad y las salidas por contrato.

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Define inputs: ruta de entrada, carpeta de salida, modo de prueba y correlation ID.
2. Crea subflows `Inicializar`, `ValidarEntrada`, `ProcesarRegistros`, `RegistrarResultado` y `CerrarAplicaciones`.
3. Usa una data table simulada con filas válidas e inválidas.
4. Registra log por registro con estado `Pendiente`, `Procesado`, `ErrorValidacion` o `ErrorTecnico`.
5. Devuelve outputs: total, exitosos, fallidos y ruta del log.
6. Ejecuta dos veces y confirma que el diseño permite diagnóstico.

## 💼 Casos Reales de Negocio

Soporte recibe un desktop flow de 180 acciones lineales. Nadie sabe dónde empieza la validación ni cómo reiniciar después de error. Refactorizar a subflows reduce tiempo de soporte y evita cambios accidentales.

## ✅ Buenas Prácticas

- Convenciones: `in_`, `out_`, `cfg_`, `dt_`, `idx_`, `log_`.
- No dupliques acciones repetidas: extrae subflows.
- Centraliza configuración.
- Documenta supuestos en comentarios breves.
- Cierra aplicaciones aunque falle el proceso.

## ⚠️ Errores Comunes

- Crear flujos monolíticos sin subflows.
- Mezclar validación, escritura y notificación en la misma sección.
- Usar nombres como `Variable1`.
- No devolver outputs útiles al cloud flow.

## 🧪 Criterios de Validación

- [ ] Construí un desktop flow con inputs y outputs.
- [ ] Separé inicialización, ejecución, errores y cierre.
- [ ] Usé variables y data tables con nombres mantenibles.
- [ ] Generé log con correlation ID.
- [ ] Expliqué cómo otro soporte diagnosticaría una falla.

## Evidencia

Diagrama, lista de subflows, captura de variables, log y reflexión. Lab recomendado: LAB-104.

## Preguntas de verificación

1. ¿Qué ventaja tiene un subflow de cleanup?
2. ¿Por qué un output estructurado mejora operación?
3. ¿Qué hace que una convención de nombres sea útil?

## Conexión con siguiente módulo

El primer dominio operativo fuerte es archivos, CSV y Excel, donde cleanup e idempotencia aparecen rápidamente.

## Limitaciones y seguridad

No registres datos personales ni secretos en logs. Los ejemplos deben usar archivos ficticios.

## Referencias oficiales

- [Create desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/create-flow)
- [Variables in desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/variables)

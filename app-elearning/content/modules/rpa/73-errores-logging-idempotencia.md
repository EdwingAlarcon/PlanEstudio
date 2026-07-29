---
moduleId: 73
title: "Errores, logging e idempotencia"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 22
slug: "errores-logging-idempotencia"
---

## 🎯 Objetivo

Manejar errores esperados e inesperados con scopes, recuperación, retry, backoff, logging, correlation ID, capturas controladas, compensación, checkpoints, reanudación y cierre seguro.

## 📖 Conceptos Clave

Un bot profesional debe poder fallar sin duplicar, corromper o esconder evidencia. Idempotencia significa que repetir una ejecución controlada no repite efectos ya realizados. "Reintentar todo" puede duplicar pagos, registros o comunicaciones.

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Define estados por registro: `Pendiente`, `EnProceso`, `Completado`, `ErrorValidacion`, `ErrorTecnico`.
2. Agrega correlation ID por lote y por registro.
3. Implementa checkpoint antes y después de una acción con efecto externo.
4. Simula fallo parcial después de registrar un dato.
5. Reejecuta el flujo y demuestra que no duplica.
6. Genera RCA con causa, corrección y prevención.

## 💼 Casos Reales de Negocio

Un flujo registra pagos en una app legacy. Falla al enviar confirmación y el operador reintenta. Sin checkpoint, el pago se registra dos veces. Con clave idempotente y validación previa, el bot reanuda desde el punto correcto.

## ✅ Buenas Prácticas

- Clasifica errores de negocio y técnicos.
- Limita retries y usa backoff.
- Registra correlation ID sin PII.
- Diseña compensación para efectos parciales.
- Cierra apps/archivos en bloque de cleanup.

## ⚠️ Errores Comunes

- Retry infinito.
- Capturar pantallas con datos sensibles.
- No distinguir fallo recuperable de fallo crítico.
- Marcar éxito sin validar resultado final.
- No cerrar Excel o navegador.

## 🧪 Criterios de Validación

- [ ] Diseño estados y checkpoints.
- [ ] Evito duplicados después de fallo parcial.
- [ ] Genero logs útiles sin PII.
- [ ] Cierro aplicaciones aunque falle.
- [ ] Escribo RCA defendible.

## Evidencia

Log con correlation ID, prueba de reejecución, matriz de excepciones, RCA y runbook de recuperación. Lab recomendado: LAB-109. Incidentes relacionados: INC-RPA-004 e INC-RPA-008.

## Preguntas de verificación

1. ¿Por qué "reintentar todo" puede ser peligroso?
2. ¿Qué diferencia hay entre rollback y compensación?
3. ¿Qué dato nunca debe aparecer en logs?

## Conexión con siguiente módulo

Ahora integrarás desktop flows con cloud flows, donde errores cruzan capas.

## Limitaciones y seguridad

Los logs deben anonimizar PII, rutas internas sensibles, tokens y credenciales.

## Referencias oficiales

- [Troubleshoot desktop flows runtime](https://learn.microsoft.com/en-us/power-automate/desktop-flows/troubleshoot)
- [Monitor run details](https://learn.microsoft.com/en-us/power-automate/desktop-flows/monitor-run-details)

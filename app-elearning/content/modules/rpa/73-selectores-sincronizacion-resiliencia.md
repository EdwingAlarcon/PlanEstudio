---
moduleId: 73
title: "Selectores, sincronización y resiliencia"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 20
slug: "selectores-sincronizacion-resiliencia"
---

## 🎯 Objetivo

Diseñar selectores estáticos/dinámicos, alternativos y mantenibles; sincronizar interfaces asincrónicas con waits, timeouts, polling, reintentos acotados y validación de estado.

## 📖 Conceptos Clave

Un UI element puede tener múltiples selectores evaluados en orden. Los atributos dinámicos deben generalizarse con criterio; los waits deben esperar condición real, no cubrir incertidumbre con pausas largas.

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Captura un selector de un botón y revisa atributos.
2. Identifica qué atributos son estables y cuáles cambian por versión, usuario o sesión.
3. Crea selector alternativo y pruébalo.
4. Agrega espera por existencia, visibilidad y estado.
5. Simula dos elementos duplicados y delimita por ventana padre.
6. Documenta un plan de mantenimiento posterior.

## 💼 Casos Reales de Negocio

Después de una actualización del proveedor, el botón `Enviar v3.14` cambia a `Enviar v3.15`. El bot falla porque el selector dependía del texto completo. La corrección usa atributos estables y prueba de regresión.

## ✅ Buenas Prácticas

- Usa selector builder y prueba antes de publicar.
- Mantén selectores alternativos ordenados.
- Valida ventana padre.
- Evita reintentos infinitos.
- Documenta señales de cambio de UI.

## ⚠️ Errores Comunes

- Cambiar todos los selectores sin aislar causa.
- Usar wildcard demasiado amplio.
- Confundir timeout con causa raíz.
- No probar regresión en pantallas relacionadas.

## 🧪 Criterios de Validación

- [ ] Puedo leer la anatomía de un selector.
- [ ] Creo selector alternativo mantenible.
- [ ] Uso waits/polling con timeout razonable.
- [ ] Diagnostico race conditions y foco.
- [ ] Documento prevención de ruptura.

## Evidencia

Selector antes/después, prueba de selector, log de wait, RCA breve y plan de mantenimiento. Lab recomendado: LAB-108. Incidente relacionado: INC-RPA-001.

## Preguntas de verificación

1. ¿Qué atributo eliminarías si cambia por versión?
2. ¿Por qué un wildcard excesivo puede ser peligroso?
3. ¿Cómo diferencias selector roto de pantalla lenta?

## Conexión con siguiente módulo

Selectores resilientes no bastan: necesitas errores, logging, idempotencia y recuperación.

## Limitaciones y seguridad

Las capturas de selectores pueden incluir nombres internos de aplicaciones; anonimiza evidencia.

## Referencias oficiales

- [Build a custom selector](https://learn.microsoft.com/en-us/power-automate/desktop-flows/build-custom-selectors)
- [Test selectors](https://learn.microsoft.com/en-us/power-automate/desktop-flows/test-selectors)
- [Automate using UI elements](https://learn.microsoft.com/en-us/power-automate/desktop-flows/ui-elements)

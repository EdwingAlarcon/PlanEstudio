---
moduleId: 72
title: "Aplicaciones Windows y legacy"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 20
slug: "aplicaciones-windows-legacy"
---

## 🎯 Objetivo

Automatizar aplicaciones Windows y legacy con UI automation, ventanas, procesos, diálogos, OCR/imágenes como último recurso, Remote Desktop/Citrix como awareness y control de foco, teclado, ratón, resolución y escalado.

## 📖 Conceptos Clave

Las apps legacy suelen fallar por foco, ventanas modales, resolución, permisos, selectores pobres o cambios de layout. Coordenadas e imágenes sirven como fallback justificado, no como primer diseño.

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Usa una app Windows controlada o simulador local.
2. Identifica ventana principal, diálogo de confirmación y mensaje de error.
3. Captura UI elements y valida que el selector no dependa de coordenadas.
4. Procesa registros desde archivo de entrada.
5. Maneja una ventana modal inesperada.
6. Documenta fallback con teclado/OCR solo para un punto justificado.

## 💼 Casos Reales de Negocio

Una organización mantiene un ERP Win32 sin API. PAD registra solicitudes desde un CSV. El diseño profesional valida cada registro, espera la confirmación de la app y guarda evidencia de errores sin dejar la ventana en estado ambiguo.

## ✅ Buenas Prácticas

- Trae la ventana al frente solo cuando sea necesario.
- Valida título, proceso y estado.
- Controla resolución y escalado.
- Evita coordenadas salvo fallback documentado.
- Cierra o restaura la aplicación al final.

## ⚠️ Errores Comunes

- Depender de `x,y` sin validación.
- Ignorar ventanas modales.
- No distinguir app local, RDP y Citrix.
- No probar con usuario de ejecución real.

## 🧪 Criterios de Validación

- [ ] Uso UI automation antes que coordenadas.
- [ ] Manejo ventana modal y confirmación.
- [ ] Registro fallos por registro.
- [ ] Documento limitaciones de RDP/Citrix.
- [ ] Pruebo foco y resolución.

## Evidencia

Mapa de ventanas, selectores, log de registros, caso modal y justificación de fallback. Lab recomendado: LAB-107.

## Preguntas de verificación

1. ¿Por qué las coordenadas son último recurso?
2. ¿Qué cambia al ejecutar por Remote Desktop?
3. ¿Cómo detectas una ventana modal inesperada?

## Conexión con siguiente módulo

Profundizarás en selectores, sincronización y resiliencia para reducir fragilidad.

## Limitaciones y seguridad

Citrix y Remote Desktop pueden requerir patrones distintos; marca como awareness si no puedes probarlos en tenant real.

## Referencias oficiales

- [UI automation actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/uiautomation)
- [Set fallback mechanism for UI elements](https://learn.microsoft.com/en-us/power-automate/desktop-flows/ui-elements-fallback-mechanism)

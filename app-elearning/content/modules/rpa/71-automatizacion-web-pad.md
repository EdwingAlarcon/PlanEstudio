---
moduleId: 71
title: "Automatización web con PAD"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 20
slug: "automatizacion-web-pad"
---

## 🎯 Objetivo

Automatizar portales web con UI elements, selectores, extracción, formularios, tablas, paginación, descargas, uploads, iframes, pop-ups, sesiones, autenticación, esperas y comparación honesta frente a HTTP/API.

## 📖 Conceptos Clave

La automatización web debe sincronizarse con el estado real de la página. Antes de capturar pantallas, revisa si hay API, conector, exportación soportada o endpoint documentado. Si usas UI, diseña selectores mantenibles y validaciones después de cada acción crítica.

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Usa un portal de práctica o HTML controlado con tabla paginada.
2. Captura UI elements para búsqueda, tabla, botón de descarga y mensaje de resultado.
3. Agrega waits explícitos por elemento/estado, no pausas fijas como patrón principal.
4. Extrae varias páginas y consolida resultados.
5. Simula timeout y elemento dinámico.
6. Compara la solución con una llamada HTTP equivalente.

## 💼 Casos Reales de Negocio

Un proveedor entrega un portal sin API. El bot consulta solicitudes, descarga reportes y genera archivo consolidado. La operación acepta RPA porque el volumen justifica el costo, pero el runbook declara que un cambio del DOM requiere revisión de selectores.

## ✅ Buenas Prácticas

- Prefiere API cuando sea viable.
- Usa selectores semánticos y alternativos.
- Valida estado después de submit.
- Controla sesión y expiración.
- No registres contraseñas ni tokens.

## ⚠️ Errores Comunes

- Usar sleep fijo para todo.
- Capturar selectores demasiado específicos.
- Ignorar iframes, pop-ups o descargas incompletas.
- Romper términos de uso del portal.

## 🧪 Criterios de Validación

- [ ] Automatizo búsqueda, paginación y descarga.
- [ ] Manejo elemento lento o dinámico.
- [ ] Documento por qué no usé API.
- [ ] Capturo evidencia sin exponer credenciales.
- [ ] Registro errores de portal con correlation ID.

## Evidencia

Diagrama web, captura anonimizada, archivo descargado, log de espera/timeout y decisión API vs RPA. Lab recomendado: LAB-106. Incidente relacionado: INC-RPA-007.

## Preguntas de verificación

1. ¿Qué harías si una tabla tarda más de lo habitual?
2. ¿Por qué un selector con texto exacto puede ser frágil?
3. ¿Cuándo abandonarías RPA web por API?

## Conexión con siguiente módulo

Las aplicaciones Windows y legacy agregan foco, ventanas, diálogos, coordenadas, OCR e imágenes.

## Limitaciones y seguridad

No automatices portales reales sin permiso. Usa login simulado o cuenta de prueba.

## Referencias oficiales

- [Browser automation actions](https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/webautomation)
- [Automate using UI elements](https://learn.microsoft.com/en-us/power-automate/desktop-flows/ui-elements)

---
id: lab-108
title: "RPA — Selectores, sincronización y resiliencia"
level: "RPA"
duration: 120
product: ["Power Automate Desktop", "UI Elements", "Selectors", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "RPA Support Analyst", "Automation Engineer"]
prerequisites:
  - "Módulo 73 completado"
  - "LAB-RPA-03 o LAB-RPA-04 recomendado"
files: []
---

# LAB-RPA-05 — Selectores y resiliencia

## Objetivo

Corregir selectores frágiles y reemplazar pausas fijas por sincronización basada en estado.

## Escenario de negocio

Una aplicación cambia etiquetas después de una actualización menor. El bot falla al encontrar un botón aunque la función sigue disponible.

## Competencias desarrolladas

- Anatomía de selectores
- Atributos dinámicos
- Selectores alternativos
- Waits, polling y timeouts
- Pruebas de regresión

## Ejercicios

1. Captura selector antes del cambio simulado.
2. Identifica atributos dinámicos o demasiado específicos.
3. Crea selector alternativo.
4. Prueba selector con herramienta de PAD.
5. Agrega wait por existencia/visibilidad.
6. Simula elemento duplicado y delimita por ventana padre.
7. Documenta prevención.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El selector deja de encontrar el elemento tras un cambio menor de UI | El selector capturado incluye un atributo demasiado específico (ID generado dinámicamente, índice de posición) | Reemplaza el atributo dinámico por uno estable (nombre de control, texto, rol) y valida con la herramienta de PAD |
| El selector alternativo funciona pero afecta a otros elementos | El selector nuevo es demasiado amplio (por ejemplo, solo por clase o tipo) | Delimita el selector por ventana padre o agrega un segundo atributo distintivo |
| El flow falla intermitentemente aunque el selector es correcto | Hay una condición de carrera: la acción se ejecuta antes de que el elemento sea interactuable | Sustituye el `Wait` fijo por espera de existencia/visibilidad con polling |
| El bot interactúa con el elemento equivocado cuando hay duplicados | El selector no delimita por ventana padre y hace match con más de un elemento | Agrega el ancestro (ventana o contenedor) al selector para desambiguar |
| Un timeout se confunde con "selector roto" y el diagnóstico se alarga | No hay diferenciación entre lentitud de carga y selector inválido en el log | Registra por separado el resultado de "elemento no encontrado" vs. "tiempo agotado esperando estado" |
| La regresión pasa en una pantalla pero falla en otra similar | El selector alternativo se validó solo contra la pantalla donde se detectó el cambio | Repite la prueba de selector en al menos dos pantallas antes de darlo por corregido |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### Selector roto tras cambio menor de UI

- **Causa probable:** el selector capturado depende de un atributo generado dinámicamente (ID, índice) que cambió con la actualización.
- **Cómo comprobar:** compara el selector antes/después con la herramienta de edición de selectores de PAD y revisa qué atributo dejó de coincidir.
- **Cómo corregir:** reconstruye el selector usando un atributo estable (nombre visible, rol de control, `AutomationId` si existe) y pruébalo con "Validate selector".
- **Reiniciar vs. reparar:** corrige solo el selector puntual; no reinicies el flujo completo.
- **Evidencia posterior a la corrección:** captura de "Validate selector" en verde sobre la pantalla modificada.

### Selector alternativo demasiado amplio

- **Causa probable:** al reparar el selector se eliminaron demasiados atributos y ahora coincide con múltiples elementos.
- **Cómo comprobar:** usa "Validate selector" y observa si reporta más de un elemento coincidente.
- **Cómo corregir:** agrega un segundo atributo distintivo (texto, posición relativa) o delimita por ventana padre.
- **Reiniciar vs. reparar:** ajusta el selector; no requiere reiniciar la corrida.
- **Evidencia posterior a la corrección:** log mostrando coincidencia única del selector corregido.

### Fallos intermitentes con selector válido

- **Causa probable:** condición de carrera — la acción se dispara antes de que el elemento esté listo (visible/habilitado).
- **Cómo comprobar:** revisa el log de wait/timeout y confirma si el fallo ocurre solo en corridas rápidas o con la app recién abierta.
- **Cómo corregir:** reemplaza esperas fijas por `Wait for element` con condición de existencia/visibilidad y polling.
- **Reiniciar vs. reparar:** repara el subflujo de espera; no es necesario reiniciar todo el caso.
- **Evidencia posterior a la corrección:** log de wait mostrando el tiempo real de espera antes de la interacción exitosa.

### Interacción con elemento duplicado incorrecto

- **Causa probable:** el selector no incluye el contenedor/ventana padre y hace match ambiguo cuando hay elementos repetidos.
- **Cómo comprobar:** simula el escenario de elemento duplicado del laboratorio y observa cuál instancia recibe la acción.
- **Cómo corregir:** agrega el ancestro correcto al selector para acotar la búsqueda a la ventana esperada.
- **Reiniciar vs. reparar:** corrige el selector; reinicia solo si la interacción incorrecta ya modificó datos.
- **Evidencia posterior a la corrección:** captura mostrando la acción aplicada sobre el elemento correcto.

### Timeout confundido con selector roto

- **Causa probable:** el log no distingue "elemento no encontrado" de "tiempo agotado esperando un estado".
- **Cómo comprobar:** revisa si el mensaje de error del log especifica la causa exacta o solo dice "acción fallida".
- **Cómo corregir:** separa el manejo de errores en dos ramas (`not found` vs. `timeout`) y registra cada una con su propio mensaje.
- **Reiniciar vs. reparar:** ajusta el logging y manejo de errores; no reinicies el caso.
- **Evidencia posterior a la corrección:** mini RCA documentando la causa raíz real identificada tras separar los mensajes.

### Regresión pasa en una pantalla y falla en otra

- **Causa probable:** el selector corregido solo se validó contra la pantalla donde apareció el cambio original.
- **Cómo comprobar:** ejecuta la prueba de selector en al menos dos pantallas con estructura similar.
- **Cómo corregir:** generaliza el selector o crea variantes específicas por pantalla si la estructura difiere.
- **Reiniciar vs. reparar:** amplía la cobertura de prueba antes de dar el fix por cerrado; no reinicies el caso base.
- **Evidencia posterior a la corrección:** checklist de troubleshooting con ambas pantallas marcadas como validadas.

## Evidencia esperada

- Selector antes/después
- Resultado de prueba de selector
- Log de wait/timeout
- Mini RCA
- Checklist de troubleshooting

## Criterios de aprobación

- El selector alternativo no es excesivamente amplio.
- El timeout tiene acción de recuperación.
- La regresión cubre al menos dos pantallas.
- Se explica diferencia entre lentitud y selector roto.

## Assets reproducibles

- Portal con selector modificado: [Portal SIT](../rpa-sandbox/portal) en modo `Selector modificado`.
- Legacy con layout cambiante: [SIT Registro Legacy](../rpa-sandbox/legacy-app) en modo `Layout cambiado`.
- Plantilla: [Checklist de selectores](../practice-assets/rpa/sit-automation-case/templates/selector-troubleshooting-checklist.md).
- Referencia: [matriz operacional](../practice-assets/rpa/sit-automation-case/validation/matriz_operacional.csv).
- Reset: vuelve a modo normal en ambos simuladores antes de cada corrida comparativa.
- Variante sin tenant: captura evidencia de selector antes/después y propone remediación sin publicar cambios.

## Reto adicional

Diseña alerta de monitoreo cuando los fallos por selector superan un umbral semanal.

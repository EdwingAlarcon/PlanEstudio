---
id: lab-107
title: "RPA — Aplicación Windows legacy controlada"
level: "RPA"
duration: 150
product: ["Power Automate Desktop", "UI Automation", "Windows Apps", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "RPA Support Analyst"]
prerequisites:
  - "Módulo 72 completado"
  - "Aplicación Windows de prueba o simulación documentada"
files: []
---

# LAB-RPA-04 — Aplicación legacy

## Objetivo

Registrar información desde un archivo de entrada en una aplicación Windows simulada o controlada, manejando ventanas, selector, validación, excepción, confirmación, recuperación y log.

## Escenario de negocio

Un sistema legacy de escritorio no tiene API. Operaciones necesita cargar solicitudes validadas sin depender de coordenadas frágiles.

## Competencias desarrolladas

- UI automation Windows
- Manejo de ventanas y diálogos
- Validación por registro
- Recuperación de excepción
- Logging operativo

## Ejercicios

1. Identifica ventana principal, campos y botón de confirmar.
2. Captura selectores y descarta coordenadas como patrón principal.
3. Procesa archivo con registros válidos e inválidos.
4. Detecta mensaje de confirmación.
5. Simula ventana modal inesperada.
6. Registra error y continúa con el siguiente registro.
7. Documenta fallback si usas teclado, imagen u OCR.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El flow no encuentra la ventana principal al iniciar | La app aún no terminó de cargar cuando corre la acción `Attach Window` | Agrega espera por existencia de ventana antes de interactuar, no un `Wait` fijo |
| Los campos reciben texto pero en el control incorrecto | La ventana perdió el foco (otra ventana quedó encima) | Fuerza `Set Focus` sobre la ventana objetivo antes de cada `Send Keys` |
| Caracteres especiales o tildes llegan corruptos al campo | La app legacy usa un encoding distinto al que envía PAD (`Send Keys` vs `Populate Text Field`) | Cambia a `Populate Text Field` o valida el encoding de origen del archivo de entrada |
| El bot se congela ante la ventana modal inesperada | No hay manejo de excepción para diálogos no previstos en el flujo principal | Envuelve el bloque en `On Block Error` y agrega detección explícita de la ventana modal |
| Un registro válido queda marcado como error | El mensaje de confirmación tarda más de lo esperado y el timeout se dispara antes | Aumenta el timeout de detección de confirmación o usa polling en vez de espera fija |
| El fallback de teclado/imagen falla en otra resolución | La automatización no valida resolución/escalado antes de ejecutar | Agrega verificación de resolución y escalado como paso previo (ver Reto adicional) |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### La ventana principal no aparece al iniciar

- **Causa probable:** el flujo intenta adjuntar la ventana antes de que la app termine de renderizar.
- **Cómo comprobar:** ejecuta paso a paso y observa si `Attach Window` falla en los primeros segundos tras abrir la app.
- **Cómo corregir:** reemplaza el `Wait` fijo por una espera basada en existencia de la ventana (reintento con timeout corto).
- **Reiniciar vs. reparar:** basta con corregir el subflujo de apertura; no reinicies el caso completo.
- **Evidencia posterior a la corrección:** captura del log mostrando el tiempo real de aparición de la ventana.

### El texto llega al control incorrecto

- **Causa probable:** foco perdido por una ventana emergente o notificación del sistema.
- **Cómo comprobar:** revisa la captura de pantalla del momento del fallo (o reproduce y observa qué ventana está activa).
- **Cómo corregir:** agrega `Set Focus` explícito sobre la ventana legacy justo antes de cada interacción de teclado.
- **Reiniciar vs. reparar:** repara el paso puntual; solo reinicia si el registro ya quedó parcialmente escrito en un campo incorrecto.
- **Evidencia posterior a la corrección:** log mostrando foco confirmado antes de cada `Send Keys`.

### Caracteres corruptos en campos de texto

- **Causa probable:** método de entrada de texto incompatible con el encoding de la app legacy.
- **Cómo comprobar:** compara el valor origen del archivo con el valor capturado en la app tras el registro.
- **Cómo corregir:** usa `Populate Text Field` en vez de `Send Keys`, o normaliza el encoding del archivo de entrada.
- **Reiniciar vs. reparar:** corrige el método de entrada y reprocesa solo los registros afectados, no todo el lote.
- **Evidencia posterior a la corrección:** captura anonimizada mostrando el valor correcto ya registrado.

### Ventana modal inesperada detiene el flujo

- **Causa probable:** el flujo principal no contempla diálogos no previstos (error del sistema, actualización, confirmación extra).
- **Cómo comprobar:** revisa el log de excepción y la captura del momento del bloqueo.
- **Cómo corregir:** agrega manejo de excepción (`On Block Error`) con detección específica de la ventana modal y una acción de cierre o recuperación.
- **Reiniciar vs. reparar:** repara el manejo de excepción; reinicia solo si la modal dejó la app en un estado inconsistente que no se puede cerrar limpiamente.
- **Evidencia posterior a la corrección:** log mostrando la excepción capturada y el flujo continuando con el siguiente registro.

### Registro válido marcado como error por timeout

- **Causa probable:** el timeout de detección de confirmación es menor al tiempo real que tarda la app en responder.
- **Cómo comprobar:** compara el timeout configurado contra el tiempo real observado en el modo "confirmación lenta" del simulador.
- **Cómo corregir:** aumenta el timeout o cambia a polling con reintentos cortos en vez de una espera única.
- **Reiniciar vs. reparar:** ajusta el timeout del subflujo; no es necesario reiniciar el lote completo.
- **Evidencia posterior a la corrección:** log de registros mostrando el registro reclasificado como exitoso.

### El fallback (teclado/imagen/OCR) falla en otra resolución

- **Causa probable:** no se valida resolución ni escalado de pantalla antes de ejecutar el fallback.
- **Cómo comprobar:** compara resolución/escalado del entorno de prueba contra el de ejecución real.
- **Cómo corregir:** agrega una validación previa de resolución y escalado que detenga la ejecución con mensaje claro si no coincide.
- **Reiniciar vs. reparar:** corrige la validación previa; reinicia la corrida completa solo si ya se ejecutaron acciones con coordenadas incorrectas.
- **Evidencia posterior a la corrección:** captura del chequeo de resolución pasando antes de iniciar el flujo.

## Evidencia esperada

- Mapa de ventanas
- Selector principal y alternativo
- Log de registros
- Captura anonimizada de confirmación/error
- Justificación de fallback

## Criterios de aprobación

- La automatización no depende únicamente de coordenadas.
- Cada registro queda en estado claro.
- La ventana se recupera después de error.
- Se documentan límites de RDP/Citrix como awareness.

## Assets reproducibles

- Simulador legacy: [SIT Registro Legacy](../rpa-sandbox/legacy-app).
- Datos semilla: [legacy-records.json](../practice-assets/rpa/sit-automation-case/legacy-app/legacy-records.json).
- Resultado esperado: [log esperado](../practice-assets/rpa/sit-automation-case/expected/log_esperado.csv).
- Modos disponibles: normal, duplicado, bloqueo, layout cambiado, confirmación lenta y botón deshabilitado.
- Reset: usa el botón `Reset` del simulador y conserva solo evidencias anonimizadas.
- Variante sin Windows/PAD: ejecuta el flujo manualmente sobre el simulador y documenta selectores propuestos.

## Reto adicional

Agrega validación de resolución y escalado antes de iniciar.

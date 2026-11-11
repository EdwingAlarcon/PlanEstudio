---
id: lab-107
title: "RPA — Aplicación Windows legacy controlada"
level: "RPA"
duration: 150
product: ["Power Automate for desktop", "UI Automation", "Windows Apps", "RPA"]
certifications: ["Power Automate for desktop & RPA"]
role: ["RPA Developer", "RPA Support Analyst"]
prerequisites:
  - "Módulo 72 completado"
  - "Aplicación Windows de prueba o simulación documentada"
files: []
lastVerified: "2026-11"
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
5. Maneja una ventana modal no prevista con el modo **Modal inesperado**. Abre el simulador a mano, pulsa **Reset**, elige **Modal inesperado** en el selector **Modo** y adjunta el flujo a esa pestaña (ver la nota **Qué acciones usar**). En ese modo, el **primer** **Registrar** después de elegir el modo no confirma: aparece el diálogo **Aviso de sesión** con un botón **Continuar**, que tapa la página y deja el registro en espera; mientras siga abierto, **Registrar** y **Consultar por ID** no responden. Al pulsar **Continuar**, el registro se procesa y sale **Registro confirmado** como siempre. Los siguientes **Registrar** ya no lo muestran; vuelve a salir solo si eliges el modo otra vez (**Reset** devuelve el simulador a **Normal**). Primero ejecuta tu flujo sin cambios y anota qué hace: la espera no encuentra `Registro confirmado` y las filas siguientes no avanzan mientras el aviso siga abierto. Después, dentro del loop que espera el desenlace y antes de buscar `Registro confirmado`, agrega la detección explícita: **If web page contains** el texto `Aviso de sesión` → **Press button on web page** sobre **Continuar** (al capturarlo verás su `id`, `legacy-interrupt-continue`) y sigue esperando la confirmación. Pulsa **Reset**, vuelve a elegir **Modal inesperado** y ejecuta de nuevo: la primera fila debe terminar `REGISTRADO`. Si abres **Registro de actividad (para tu evidencia)**, el informe añade la línea `Avisos inesperados cerrados: 1`. En una app Win32 real, el equivalente es dejar abierto un cuadro de diálogo (por ejemplo **Guardar como** en el Bloc de notas) y detectarlo con **If window** = **Is open**.
6. Registra error y continúa con el siguiente registro.
7. Documenta fallback si usas teclado, imagen u OCR.

> **Qué acciones usar:** el simulador [SIT Registro Legacy](../rpa-sandbox/legacy-app) es una página web con apariencia de aplicación de escritorio, así que se automatiza con **acciones de navegador** (**Populate text field on web page**, **Press button on web page**, **If web page contains**), como en el Módulo 72. Si usas una aplicación Win32 real (por ejemplo, el Bloc de notas del Módulo 72), las equivalentes son de UI automation: **Wait for window**, **Focus window**, **Populate text field in window**, **Press button in window** e **If window contains**. El modo del simulador vive en el estado de la página, no en la URL: una instancia nueva de Edge abre siempre en **Normal**. Para probar otro modo, abre el simulador a mano, pulsa **Reset**, elige el modo en el selector **Modo** y lanza el navegador con **Launch mode** = **Attach to running instance** (**Attach to Microsoft Edge tab** = **By URL**, con la URL del simulador).

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El flow no encuentra la ventana principal al iniciar | La app aún no terminó de cargar cuando el flow intenta interactuar con ella | En una app Win32, usa **Wait for window** (**Wait for window to** = **Open**) antes de interactuar, no un **Wait** fijo; en el simulador web, espera con **If web page contains** dentro de un loop acotado |
| Los campos reciben texto pero en el control incorrecto | La ventana perdió el foco (otra ventana quedó encima) y **Send keys** escribe en la ventana en primer plano | Usa **Focus window** sobre la ventana objetivo antes de cada **Send keys**, o mejor, escribe por el control con **Populate text field in window** (Win32) o **Populate text field on web page** (simulador) |
| Caracteres especiales o tildes llegan corruptos al campo | **Send keys** envía pulsaciones según la distribución de teclado del equipo, o el archivo de entrada se leyó con otra codificación | Escribe por el control con **Populate text field in window** / **Populate text field on web page** en vez de **Send keys**, y lee el archivo de entrada con la codificación correcta (**UTF-8**) |
| El bot se congela ante la ventana modal inesperada | No hay manejo de excepción para diálogos no previstos en el flujo principal | Envuelve el bloque en **On block error** y agrega detección explícita del modal (**If window** en Win32, **If web page contains** en el simulador) |
| Un registro válido queda marcado como error | El mensaje de confirmación tarda más de lo esperado y la espera se agota antes | Espera la confirmación con polling acotado (**Loop** + **If web page contains** o **If window contains** + **Wait**) y ajusta el número de vueltas al tiempo real observado en **Confirmación lenta** |
| El fallback de teclado/imagen falla en otra resolución | La automatización no valida resolución/escalado antes de ejecutar | Agrega verificación de resolución y escalado como paso previo (ver Reto adicional) |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### La ventana principal no aparece al iniciar

- **Causa probable:** el flujo intenta interactuar con la ventana antes de que la app termine de renderizar.
- **Cómo comprobar:** ejecuta paso a paso (**Run next action**, F10) y observa si la primera acción sobre la ventana falla en los primeros segundos tras abrir la app.
- **Cómo corregir:** reemplaza el **Wait** fijo por **Wait for window** (**Wait for window to** = **Open**, con **Focus window after it opens**) en una app Win32, o por un loop acotado con **If web page contains** en el simulador web. En **Run application**, **After application launch** = **Wait for application to load** también ayuda.
- **Reiniciar vs. reparar:** basta con corregir el subflujo de apertura; no reinicies el caso completo.
- **Evidencia posterior a la corrección:** captura del log mostrando el tiempo real de aparición de la ventana.

### El texto llega al control incorrecto

- **Causa probable:** foco perdido por una ventana emergente o notificación del sistema.
- **Cómo comprobar:** revisa la captura de pantalla del momento del fallo (o reproduce y observa qué ventana está activa).
- **Cómo corregir:** agrega **Focus window** sobre la ventana legacy justo antes de cada interacción de teclado, o reemplaza **Send keys** por **Populate text field in window**, que escribe en el control por su selector.
- **Reiniciar vs. reparar:** repara el paso puntual; solo reinicia si el registro ya quedó parcialmente escrito en un campo incorrecto.
- **Evidencia posterior a la corrección:** log mostrando foco confirmado (por ejemplo, con **If window** = **Is focused**) antes de cada **Send keys**.

### Caracteres corruptos en campos de texto

- **Causa probable:** **Send keys** depende de la distribución de teclado del equipo, o el archivo de entrada se leyó con una codificación distinta de la suya.
- **Cómo comprobar:** compara el valor origen del archivo con el valor capturado en la app tras el registro.
- **Cómo corregir:** usa **Populate text field in window** (Win32) o **Populate text field on web page** (simulador) en vez de **Send keys**, y lee el archivo de entrada con la codificación correcta (**UTF-8**).
- **Reiniciar vs. reparar:** corrige el método de entrada y reprocesa solo los registros afectados, no todo el lote.
- **Evidencia posterior a la corrección:** captura anonimizada mostrando el valor correcto ya registrado.

### Ventana modal inesperada detiene el flujo

- **Causa probable:** el flujo principal no contempla diálogos no previstos (error del sistema, actualización, confirmación extra).
- **Cómo comprobar:** revisa el log de excepción y la captura del momento del bloqueo.
- **Cómo corregir:** agrega manejo de excepción (**On block error**) con detección específica del modal (**If window** = **Is open** en Win32, **If web page contains** en el simulador) y una acción de cierre o recuperación (**Press button in window** / **Press button on web page**).
- **Reiniciar vs. reparar:** repara el manejo de excepción; reinicia solo si la modal dejó la app en un estado inconsistente que no se puede cerrar limpiamente.
- **Evidencia posterior a la corrección:** log mostrando la excepción capturada y el flujo continuando con el siguiente registro.

### Registro válido marcado como error por timeout

- **Causa probable:** la espera de la confirmación se agota antes del tiempo real que tarda la app en responder.
- **Cómo comprobar:** compara el límite de tu espera (vueltas del loop × intervalo) contra el tiempo real observado en el modo **Confirmación lenta** del simulador (adjunta el flow a la pestaña donde elegiste el modo).
- **Cómo corregir:** espera con polling acotado (**Loop** + **If web page contains** + **Wait** como intervalo; en Win32, **If window contains**) y ajusta el número de vueltas en vez de usar una espera única.
- **Reiniciar vs. reparar:** ajusta el límite de la espera en el subflujo; no es necesario reiniciar el lote completo.
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
- Archivo de entrada sugerido: [lote-entrada.json](../practice-assets/rpa/sit-automation-case/legacy-app/lote-entrada.json). **No** es la tabla inicial del simulador: el simulador arranca (y vuelve con **Reset**) con 3 registros, `SOL-2026-0001`, `SOL-2026-0002` y `SOL-2026-0004`. Por eso el archivo sirve como lote mixto: esas 3 solicitudes ya existen (el simulador responde **Registro duplicado** si las registras otra vez; consúltalas antes con **Consultar por ID**) y `SOL-2026-0005` y `SOL-2026-0006` son nuevas. Su campo `status` (`pending`) es del archivo, no del simulador. Para leerlo en PAD: **Read text from file** y **Convert JSON to custom object**.
- Formato de log de referencia: [log esperado](../practice-assets/rpa/sit-automation-case/expected/log_esperado.csv) (columnas `timestamp,correlationId,level,step,message`; sus filas son del caso de consolidación, no de este lab).
- Modos disponibles (selector **Modo** del simulador): Normal, Duplicado, Bloqueo simulado, Layout cambiado, Confirmación lenta, Botón deshabilitado y Modal inesperado.
- Reset: usa el botón `Reset` del simulador y conserva solo evidencias anonimizadas.
- Variante sin Windows/PAD: ejecuta el flujo manualmente sobre el simulador y documenta selectores propuestos.

## Reto adicional

Agrega validación de resolución y escalado antes de iniciar.

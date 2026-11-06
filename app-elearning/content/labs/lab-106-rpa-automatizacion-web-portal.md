---
id: lab-106
title: "RPA — Automatización web de portal controlado"
level: "RPA"
duration: 150
product: ["Power Automate for desktop", "Browser Automation", "UI Elements", "RPA"]
certifications: ["Power Automate for desktop & RPA"]
role: ["RPA Developer", "Automation Engineer"]
prerequisites:
  - "Módulo 71 completado"
  - "Portal de práctica o HTML local controlado"
files: []
lastVerified: "2026-11"
---

# LAB-RPA-03 — Automatización web

## Objetivo

Consultar registros en un portal, manejar paginación, descargar resultados y generar archivo consolidado con esperas y selectores mantenibles.

## Escenario de negocio

Un proveedor entrega solicitudes en un portal sin API. El bot debe consultar por fecha, descargar páginas y producir evidencia de cada ejecución.

## Competencias desarrolladas

- UI elements web
- Selectores web
- Paginación y descargas
- Esperas por estado
- Decisión API vs RPA

## Ejercicios

1. Documenta por qué el portal no se resuelve con API en este lab.
2. Captura selectores de campo búsqueda, botón, tabla y descarga.
3. Implementa espera por tabla cargada: un **Loop** acotado con **If web page contains** (**Contains element** = la tabla) que haga **Exit loop** cuando aparece y un **Wait** de 1 segundo como intervalo, como en el Módulo 71.
4. Recorre **todas** las páginas de resultados: lee N de la línea **Página 1 de N** bajo la tabla (2 páginas en **Normal**, 3 en **Paginación extendida**) en vez de fijar un número.
5. Descarga o copia resultados a CSV (9 registros en total en **Normal**).
6. Simula un fallo sin tabla con el escenario **Error simulado** y registra el error ("tiempo agotado" si el loop de espera se agota) con evidencia.
7. Anonimiza cualquier captura.

> **Cómo probar cada escenario:** el escenario vive en el estado de la página, no en la URL, así que una instancia nueva de Edge abre siempre el portal en **Normal**. Abre el portal a mano, elige el escenario en el selector **Escenario** y, en la acción que lanza el navegador, usa **Launch mode** = **Attach to running instance**, **Attach to Microsoft Edge tab** = **By URL** y **Tab URL** = la URL del portal (igual que en el Módulo 71). Al terminar, pulsa **Reset**.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El flow falla al pasar de la página 1 a la página 2 | El selector del botón **Siguiente** o de la tabla cambia levemente entre páginas y el selector capturado es demasiado específico (usa índices fijos) | Recaptura el selector generalizando atributos estables (id, texto del botón) en vez de posición/índice; valida que funcione en todas las páginas |
| La descarga se dispara antes de que la tabla termine de cargar | La espera del paso 3 es una pausa fija en vez de esperar por estado de la página | Reemplaza la pausa fija por una espera a que **aparezca** la tabla: **If web page contains** (**Contains element** = la tabla) dentro de un **Loop** acotado, con **Wait** como intervalo |
| La prueba de fallo del paso 6 deja el navegador abierto y el flow "congelado" | La espera no tiene límite: Learn no lista un tiempo máximo en **Wait for web page content**, así que si la tabla nunca aparece el flow espera indefinidamente | Limita la espera con un **Loop** + **If web page contains** + **Wait** como intervalo y, al agotarlo, termina con **Stop flow** (o **Exit loop** y un error); en el manejo de errores cierra el navegador (**Close web browser**) y registra "tiempo agotado" |
| Las capturas de evidencia muestran datos de sesión o credenciales visibles | La captura de pantalla se toma de la ventana completa sin recortar ni anonimizar campos sensibles | Recorta la captura al área relevante o enmascara campos de usuario/sesión antes de guardarla como evidencia |
| El CSV final queda incompleto tras recorrer todas las páginas | El resultado de cada página se sobrescribe en la misma data table en vez de acumularse | Acumula los resultados de cada página en una data table persistente (o anexa al CSV) antes de pasar a la siguiente página |
| El bot interactúa con un modal inesperado y se bloquea sin avanzar | No hay manejo de excepción de UI para elementos emergentes fuera del flujo esperado (banner de cookies, modal de sesión) | Agrega un **If web page contains** (**Contains element** = el diálogo) antes de la interacción principal que, si el modal está, pulse **Cerrar modal** con **Press button on web page** |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### El flow falla al pasar de página en la paginación

- **Causa probable:** el selector del botón "Siguiente" o de la tabla usa un índice de posición que cambia entre páginas.
- **Cómo comprobar:** ejecuta el flow y observa en qué página exacta falla; abre el selector en el diseñador y revisa si depende de un índice numérico.
- **Cómo corregir:** recaptura el selector usando un atributo estable (id, texto visible del botón) en vez de posición relativa; prueba manualmente en todas las páginas (2 en **Normal**, 3 en **Paginación extendida**) antes de automatizar.
- **Reiniciar vs. reparar:** repara solo el selector afectado; no necesitas reiniciar todo el flow, solo reejecutar desde el subflow de paginación.
- **Evidencia posterior a la corrección:** log de paginación mostrando todas las páginas recorridas sin error (las N de **Página 1 de N**).

### Descarga disparada antes de que la tabla cargue

- **Causa probable:** se usa una pausa fija (por ejemplo "Esperar 2 segundos") en vez de esperar un estado real de la página.
- **Cómo comprobar:** pon el portal en el escenario **Lento** y adjunta el flow a esa pestaña. Ojo: en ese escenario el aviso **Cargando tabla lenta simulada...** no desaparece nunca (es a propósito), aunque la tabla sí aparece debajo. Verifica que tu flow espera a que **aparezca la tabla**, no a que **desaparezca el aviso**: una espera "hasta que la página ya no contenga el aviso" no terminaría nunca.
- **Cómo corregir:** reemplaza la pausa fija por una espera acotada a que aparezca la tabla: **Loop** con **If web page contains** (**Contains element** = la tabla) que haga **Exit loop**, y un **Wait** de 1 segundo como intervalo.
- **Reiniciar vs. reparar:** repara la acción de espera; no requiere reiniciar el diseño completo.
- **Evidencia posterior a la corrección:** ejecución exitosa contra el escenario **Lento** del portal sandbox, con la vuelta del loop en que apareció la tabla.

### La espera sin tabla deja el navegador colgado

- **Causa probable:** la espera no tiene límite: Learn no lista un parámetro de tiempo máximo en **Wait for web page content**, así que si la tabla nunca aparece el flow espera indefinidamente en vez de fallar controladamente.
- **Cómo comprobar:** el portal no tiene un escenario de "timeout": usa **Error simulado**, en el que no hay tabla, y observa si el flow queda "congelado" sin error ni cierre del navegador.
- **Cómo corregir:** limita la espera con un **Loop** (por ejemplo, 10 vueltas) con **If web page contains** sobre la tabla que haga **Exit loop**, y un **Wait** de 1 segundo como intervalo. Tras el loop, si la tabla sigue sin estar, registra "tiempo agotado" en el log y termina con **Stop flow** (**With error message**). Para que el navegador se cierre también en error, pon **Close web browser** en el cierre, después del **End** del bloque **On block error** y antes del **Stop flow** final (el patrón del Módulo 69).
- **Reiniciar vs. reparar:** si el navegador quedó colgado, detén el flow y cierra el navegador a mano; luego repara la espera para que tenga límite.
- **Evidencia posterior a la corrección:** log con "tiempo agotado" registrado en **Error simulado** y navegador cerrado correctamente.

### Capturas de evidencia exponen datos de sesión

- **Causa probable:** la captura toma la ventana completa sin recorte ni anonimización.
- **Cómo comprobar:** revisa las capturas guardadas y busca nombres de usuario, tokens de sesión o datos de negocio visibles.
- **Cómo corregir:** recorta la captura al área relevante de la tabla o resultado, o enmascara los campos sensibles antes de guardar.
- **Reiniciar vs. reparar:** repara la acción de captura; no requiere reiniciar el flow, solo regenerar las capturas afectadas.
- **Evidencia posterior a la corrección:** capturas revisadas sin datos sensibles visibles.

### El CSV final queda incompleto tras recorrer las páginas

- **Causa probable:** cada página sobrescribe la misma data table en vez de acumular resultados.
- **Cómo comprobar:** cuenta las filas del CSV final y compáralas contra el total que muestra el portal bajo la tabla (**9 registros** en **Normal**).
- **Cómo corregir:** usa una data table persistente fuera del bucle de paginación y agrega (no reemplaza) los resultados de cada página antes de escribir el CSV.
- **Reiniciar vs. reparar:** repara la lógica de acumulación; ejecuta el flow completo una vez al final para confirmar el conteo correcto.
- **Evidencia posterior a la corrección:** CSV consolidado con el número de filas esperado según `registros_validos.csv`.

### El bot se bloquea con un modal inesperado

- **Causa probable:** no hay manejo explícito para elementos emergentes (modal de sesión, banner) fuera del flujo principal.
- **Cómo comprobar:** elige el escenario **Modal inesperado** en el portal sandbox, adjunta el flow a esa pestaña y observa si se detiene esperando un elemento que el modal está tapando.
- **Cómo corregir:** agrega un **If web page contains** (**Contains element** = el diálogo) antes de cada interacción crítica que, si el modal está, pulse **Cerrar modal** con **Press button on web page**.
- **Reiniciar vs. reparar:** repara el subflow de interacción afectado; no requiere reiniciar el flow completo.
- **Evidencia posterior a la corrección:** ejecución exitosa contra el escenario de modal inesperado, con evidencia del cierre automático.

## Evidencia esperada

- Archivo consolidado
- Lista de selectores usados
- Log de paginación
- Caso de espera agotada (**Error simulado**)
- ADR API vs RPA

## Criterios de aprobación

- Las esperas dependen de estado, no solo de pausas fijas.
- El flujo detecta portal lento.
- La evidencia no expone credenciales.
- Existe alternativa simulada si no hay portal real.

## Assets reproducibles

- Portal sandbox: [Portal SIT de solicitudes comerciales](../rpa-sandbox/portal).
- Datos del portal: [portal-data.json](../practice-assets/rpa/sit-automation-case/portal/portal-data.json).
- Salida esperada: [registros válidos](../practice-assets/rpa/sit-automation-case/expected/registros_validos.csv).
- Escenarios disponibles (selector **Escenario** del portal): Normal, Lento, Selector modificado, Modal inesperado, Error simulado, Datos incompletos, Paginación extendida y Sesión expirada. No hay escenario de "timeout": la espera agotada se prueba con **Error simulado**.
- Reset: usa el botón `Reset` del portal y recarga la página antes de repetir la prueba.
- Variante sin tenant: automatiza solo el portal estático; no requiere credenciales ni backend.

## Reto adicional

Agrega comparación con un endpoint HTTP simulado y explica qué cambiaría en producción.

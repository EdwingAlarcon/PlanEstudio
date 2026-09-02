---
id: lab-106
title: "RPA — Automatización web de portal controlado"
level: "RPA"
duration: 150
product: ["Power Automate Desktop", "Browser Automation", "UI Elements", "RPA"]
certifications: ["Power Automate Desktop & RPA"]
role: ["RPA Developer", "Automation Engineer"]
prerequisites:
  - "Módulo 71 completado"
  - "Portal de práctica o HTML local controlado"
files: []
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
3. Implementa espera por tabla cargada.
4. Recorre tres páginas de resultados.
5. Descarga o copia resultados a CSV.
6. Simula timeout y registra error con evidencia.
7. Anonimiza cualquier captura.

## Errores frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| El flow falla al pasar de la página 1 a la página 2 | El selector del botón "Siguiente" o de la tabla cambia levemente entre páginas y el selector capturado es demasiado específico (usa índices fijos) | Recaptura el selector generalizando atributos estables (id, texto del botón) en vez de posición/índice; valida que funcione en las tres páginas |
| La descarga se dispara antes de que la tabla termine de cargar | La espera del paso 3 es una pausa fija en vez de esperar por estado de la página | Reemplaza la pausa fija por "Esperar a que el elemento web esté disponible/visible" apuntando a la tabla de resultados |
| El timeout simulado del paso 6 deja el navegador abierto y el flow "congelado" | No hay un límite de tiempo explícito en la acción de espera, así que el flow espera indefinidamente | Configura un timeout explícito en la acción de espera y captura el error para cerrar el navegador y registrar el fallo |
| Las capturas de evidencia muestran datos de sesión o credenciales visibles | La captura de pantalla se toma de la ventana completa sin recortar ni anonimizar campos sensibles | Recorta la captura al área relevante o enmascara campos de usuario/sesión antes de guardarla como evidencia |
| El CSV final queda incompleto tras recorrer las tres páginas | El resultado de cada página se sobrescribe en la misma data table en vez de acumularse | Acumula los resultados de cada página en una data table persistente (o anexa al CSV) antes de pasar a la siguiente página |
| El bot interactúa con un modal inesperado y se bloquea sin avanzar | No hay manejo de excepción de UI para elementos emergentes fuera del flujo esperado (banner de cookies, modal de sesión) | Agrega una acción "Si existe el elemento" antes de la interacción principal para cerrar modales inesperados, con manejo de error si no aparece |

## 🔧 Diagnóstico y reparación

Para los errores más frecuentes de este laboratorio, sigue este flujo antes de pedir ayuda externa.

### El flow falla al pasar de página en la paginación

- **Causa probable:** el selector del botón "Siguiente" o de la tabla usa un índice de posición que cambia entre páginas.
- **Cómo comprobar:** ejecuta el flow y observa en qué página exacta falla; abre el selector en el diseñador y revisa si depende de un índice numérico.
- **Cómo corregir:** recaptura el selector usando un atributo estable (id, texto visible del botón) en vez de posición relativa; prueba manualmente en las tres páginas antes de automatizar.
- **Reiniciar vs. reparar:** repara solo el selector afectado; no necesitas reiniciar todo el flow, solo reejecutar desde el subflow de paginación.
- **Evidencia posterior a la corrección:** log de paginación mostrando las tres páginas recorridas sin error.

### Descarga disparada antes de que la tabla cargue

- **Causa probable:** se usa una pausa fija (por ejemplo "Esperar 2 segundos") en vez de esperar un estado real de la página.
- **Cómo comprobar:** simula el escenario "lento" del portal y verifica si el flow intenta leer la tabla antes de que tenga datos.
- **Cómo corregir:** reemplaza la pausa fija por una espera condicional sobre la visibilidad/disponibilidad del elemento de la tabla.
- **Reiniciar vs. reparar:** repara la acción de espera; no requiere reiniciar el diseño completo.
- **Evidencia posterior a la corrección:** ejecución exitosa contra el escenario "lento" del portal sandbox.

### El timeout simulado deja el navegador colgado

- **Causa probable:** la acción de espera no tiene un límite de tiempo configurado, así que espera indefinidamente en vez de fallar controladamente.
- **Cómo comprobar:** activa el escenario de timeout del portal y observa si el flow queda "congelado" sin error ni cierre del navegador.
- **Cómo corregir:** configura un timeout explícito en la acción de espera y envuélvela en manejo de errores que cierre el navegador y registre el fallo.
- **Reiniciar vs. reparar:** si el navegador quedó colgado, cierra el proceso manualmente y reinicia esa ejecución; luego repara la configuración de timeout para que no vuelva a ocurrir.
- **Evidencia posterior a la corrección:** log con el caso de timeout registrado y navegador cerrado correctamente.

### Capturas de evidencia exponen datos de sesión

- **Causa probable:** la captura toma la ventana completa sin recorte ni anonimización.
- **Cómo comprobar:** revisa las capturas guardadas y busca nombres de usuario, tokens de sesión o datos de negocio visibles.
- **Cómo corregir:** recorta la captura al área relevante de la tabla o resultado, o enmascara los campos sensibles antes de guardar.
- **Reiniciar vs. reparar:** repara la acción de captura; no requiere reiniciar el flow, solo regenerar las capturas afectadas.
- **Evidencia posterior a la corrección:** capturas revisadas sin datos sensibles visibles.

### El CSV final queda incompleto tras las tres páginas

- **Causa probable:** cada página sobrescribe la misma data table en vez de acumular resultados.
- **Cómo comprobar:** cuenta las filas del CSV final y compáralas contra el total esperado en las tres páginas.
- **Cómo corregir:** usa una data table persistente fuera del bucle de paginación y agrega (no reemplaza) los resultados de cada página antes de escribir el CSV.
- **Reiniciar vs. reparar:** repara la lógica de acumulación; ejecuta el flow completo una vez al final para confirmar el conteo correcto.
- **Evidencia posterior a la corrección:** CSV consolidado con el número de filas esperado según `registros_validos.csv`.

### El bot se bloquea con un modal inesperado

- **Causa probable:** no hay manejo explícito para elementos emergentes (modal de sesión, banner) fuera del flujo principal.
- **Cómo comprobar:** activa el escenario "modal inesperado" del portal sandbox y observa si el flow se detiene esperando un elemento que el modal está tapando.
- **Cómo corregir:** agrega una verificación "Si existe el elemento" para el modal antes de cada interacción crítica, con una acción de cierre si aparece.
- **Reiniciar vs. reparar:** repara el subflow de interacción afectado; no requiere reiniciar el flow completo.
- **Evidencia posterior a la corrección:** ejecución exitosa contra el escenario de modal inesperado, con evidencia del cierre automático.

## Evidencia esperada

- Archivo consolidado
- Lista de selectores usados
- Log de paginación
- Caso de timeout
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
- Escenarios disponibles: normal, lento, selector modificado, modal inesperado, error, datos incompletos, paginación extendida y sesión expirada.
- Reset: usa el botón `Reset` del portal y recarga la página antes de repetir la prueba.
- Variante sin tenant: automatiza solo el portal estático; no requiere credenciales ni backend.

## Reto adicional

Agrega comparación con un endpoint HTTP simulado y explica qué cambiaría en producción.

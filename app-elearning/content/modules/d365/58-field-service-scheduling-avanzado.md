---
moduleId: 58
title: "Field Service End-to-End — Work Orders, Agreements, Mobile Offline y RSO"
level: "d365"
certification: "Dynamics 365 Field Service skill path"
estimatedMinutes: 13
slug: "field-service-scheduling-avanzado"
---
### 🎯 Objetivo
Profundizar en Field Service end-to-end: acuerdos de mantenimiento, generación de Work Orders, Incident Types, Schedule Board, Resource Scheduling Optimization, Field Service Mobile offline, consumo de inventario y cierre operativo con evidencia.

### 📖 Conceptos Clave
- **Universal Resource Scheduling (URS):** el motor subyacente que hace posible el Schedule Board — no es exclusivo de Field Service, también lo usan Customer Service (reservar salas, agentes) y Project Operations. Entender URS como motor compartido evita pensar en el Schedule Board como una pantalla aislada de Field Service.
- **Schedule Board — anatomía:** el panel tiene 3 áreas: la lista de recursos (técnicos) a la izquierda, la grilla de tiempo en el centro (bookings existentes, huecos libres), y el panel de "trabajo no asignado" a la derecha. El dispatcher arrastra un Work Order sin asignar hacia el hueco de un técnico compatible — Dynamics 365 resalta en verde los recursos que cumplen los requisitos (skill, territorio, disponibilidad) y en gris los que no.
- **Requisitos de recursos (Resource Requirements):** cada Work Order declara qué se necesita para ejecutarlo — una o más `Characteristics` (skills, con un nivel de competencia mínimo), el territorio de servicio, y opcionalmente herramientas o inventario. El Schedule Board filtra técnicos contra estos requisitos automáticamente; sin ellos, cualquier técnico "parece" disponible aunque no tenga la skill.
- **Scheduling Assistant vs. asignación manual:** el Scheduling Assistant sugiere los mejores candidatos (skill + cercanía + disponibilidad) para que el dispatcher elija; sigue siendo una decisión humana. Es el punto intermedio entre arrastrar manualmente en el Schedule Board y automatizar por completo con RSO.
- **Resource Scheduling Optimization (RSO):** motor de optimización que asigna automáticamente lotes de Work Orders a técnicos, corriendo en background con una frecuencia programada (por ejemplo, cada noche para el día siguiente) o bajo demanda. Solo se justifica con volumen alto de órdenes (decenas o cientos diarias por región) — con 5-10 órdenes diarias, el Scheduling Assistant manual es suficiente y más fácil de auditar.
- **Incident Type — ejemplo concreto:** un Incident Type "Mantenimiento preventivo HVAC nivel 2" no es solo una etiqueta — preconfigura la duración estimada (ej. 90 minutos), las `Characteristics` requeridas (skill HVAC nivel 2), y una lista de tareas obligatorias (`Incident Type Tasks`): "Verificar presión de refrigerante", "Limpiar filtro", "Medir temperatura de salida". Al crear un Work Order con este Incident Type, esas 3 tareas se copian automáticamente — el técnico no puede cerrar sin marcarlas.
- **Work Order Type:** clasifica el propósito general (instalación, mantenimiento preventivo, reparación, garantía) y puede traer su propio flujo de aprobación o campos adicionales — se combina con el Incident Type, no lo reemplaza (el Incident Type es más específico: "qué falla exactamente").
- **Field Service Mobile y sincronización offline:** el técnico en campo puede no tener señal; la app móvil descarga el Work Order, sus tareas y el checklist de inspección antes de salir, y sincroniza al recuperar conexión. Un Incident Type sin tareas claras deja al técnico "improvisando" qué capturar cuando no puede consultar a la oficina.
- **Inventario y devoluciones:** cuando un Work Order consume materiales (un repuesto), el técnico registra el consumo desde la app móvil contra el inventario del vehículo o almacén asignado — esto alimenta tanto el costo real del servicio como el reabastecimiento del inventario del técnico.
- **Territorios de servicio (Service Territories):** agrupan técnicos por zona geográfica; el Schedule Board y el RSO usan el territorio como primer filtro antes de evaluar skill o disponibilidad — evita sugerir un técnico a 2 horas de distancia cuando hay uno disponible en la misma zona.
- **Agreements y mantenimiento preventivo:** un Agreement define recurrencia, cliente, cobertura, productos/activos y reglas para generar Work Orders futuros. Es la base de mantenimiento preventivo, no un simple recordatorio.
- **Customer Assets:** representan equipos instalados o activos del cliente. Conectan historial de mantenimiento, garantías, incidentes y repuestos.
- **Inspections:** checklists estructurados para capturar evidencia en campo. Son más auditables que notas libres.
- **Requisitos reales de práctica:** diseñar el flujo y matriz puede hacerse sin tenant. Probar Schedule Board, app móvil offline, RSO, agreements e inventario requiere Dynamics 365 Field Service, usuarios/técnicos, datos de recursos, seguridad y configuración móvil.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Toma uno de los 3 casos de datos de prueba del Lab 59 (Contoso/Fabrikam/Litware) y define su Incident Type con nombre, duración estimada, Characteristics requeridas, y una lista de 3 tareas obligatorias que el técnico debería completar antes de cerrar.
2. Explica, para ese mismo caso, qué vería el dispatcher en el Schedule Board: qué técnicos aparecerían resaltados como compatibles y por qué (skill + territorio + disponibilidad).
3. Decide, con criterio explícito, si ese escenario justificaría activar Resource Scheduling Optimization o si el Scheduling Assistant manual es suficiente — depende del volumen de Work Orders similares por día, no de la urgencia de un caso individual.
4. Diseña qué pasaría si el técnico pierde señal a mitad del servicio: qué datos ya tiene descargados en la app móvil y qué se sincroniza al recuperar conexión.
5. Diseña un Agreement de mantenimiento preventivo mensual para un activo crítico: frecuencia, Incident Type, duración, tareas, repuestos esperados y criterio de cierre.

### 💼 Casos Reales de Negocio
Una empresa de mantenimiento de ascensores configuró Field Service sin Incident Type Tasks — cada técnico decidía qué revisar según su propio criterio. Una auditoría de seguridad detectó que el 30% de los cierres de "mantenimiento preventivo" no habían verificado el freno de emergencia, un paso crítico que no estaba en ningún checklist obligatorio porque nunca se configuró como tarea del Incident Type. La corrección — agregar las tareas obligatorias al Incident Type — costó una tarde de configuración; la auditoría de seguridad y el riesgo legal acumulado durante meses de cierres incompletos costó mucho más.

### ✅ Buenas Prácticas
- Configurar las Characteristics (skills) y su nivel de competencia ANTES de intentar usar el Schedule Board — sin ellas, el resaltado de técnicos compatibles no significa nada.
- Definir las tareas obligatorias de cada Incident Type con el equipo de operaciones/seguridad, no solo con criterio técnico — son controles de cumplimiento, no solo checklist de calidad.
- No activar Resource Scheduling Optimization "porque suena más avanzado" — solo cuando el volumen de Work Orders realmente lo justifique; RSO mal configurado puede asignar técnicos sin que un humano note un error de territorio hasta que ya está en camino.
- Probar el flujo de sincronización offline explícitamente antes de un despliegue — muchos proyectos descubren problemas de sincronización solo cuando un técnico real pierde señal en campo.
- Modelar Customer Assets y Agreements antes de crear cientos de Work Orders manuales.
- Capturar evidencia con Inspections cuando hay cumplimiento, seguridad o garantía involucrada.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Work Order sin Characteristics requeridas | Se asume que "cualquier técnico puede hacerlo" | Definir explícitamente skill y nivel mínimo en cada Incident Type |
| Incident Type sin tareas obligatorias | Se prioriza velocidad de configuración inicial | Agregar las tareas críticas de cumplimiento/seguridad antes de ir a producción |
| Activar RSO con bajo volumen de órdenes | Se confunde "automatizar" con "mejorar" sin evaluar el caso de uso | Reservar RSO para volumen alto; con pocas órdenes diarias, el Scheduling Assistant manual es más auditable |
| No probar la sincronización offline | Se asume que el técnico siempre tiene señal | Simular pérdida de conexión en pruebas antes del despliegue |
| Crear Work Orders preventivas manualmente | No se configuraron Agreements | Usar Agreements para recurrencia y trazabilidad |
| Cierre con notas libres | No existen inspections/tareas | Definir checklist estructurado por Incident Type |

### 🧪 Criterios de Validación
- [ ] Definí un Incident Type con duración, Characteristics y 3 tareas obligatorias para un caso concreto
- [ ] Expliqué qué técnicos vería el dispatcher resaltados en el Schedule Board y por qué
- [ ] Decidí, con criterio de volumen, si el caso justifica Resource Scheduling Optimization o Scheduling Assistant manual
- [ ] Diseñé qué datos están disponibles offline en la app móvil si el técnico pierde señal
- [ ] Diseñé un Agreement preventivo conectado a activo, tareas, repuestos y evidencia
- [ ] Identifiqué qué requiere licencia/ambiente Field Service real

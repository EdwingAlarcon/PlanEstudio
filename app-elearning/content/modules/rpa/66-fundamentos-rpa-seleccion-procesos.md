---
moduleId: 66
title: "Fundamentos de RPA y selección de procesos"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 18
slug: "fundamentos-rpa-seleccion-procesos"
---

## 🎯 Objetivo

Evaluar si un proceso debe automatizarse con Power Automate Desktop, con cloud flow, con API/conector, con desarrollo tradicional o si conviene mejorar primero el proceso manual.

## 📖 Conceptos Clave

RPA automatiza interacción de interfaz cuando un sistema no expone API, conector o integración viable. Es útil como puente operativo, no como excusa para ignorar arquitectura, deuda, seguridad o mantenimiento.

### Matriz de decisión profesional

| Opción | Úsala cuando | Evítala cuando | Evidencia |
|---|---|---|---|
| RPA | Sistema legacy sin API estable, proceso repetible, UI relativamente estable | La pantalla cambia a diario, hay datos críticos sin control o existen APIs maduras | Matriz de viabilidad, riesgos, prueba de selector |
| API | Existe endpoint soportado, autenticación y contrato documentado | El proveedor no soporta el uso o no hay permisos | Prueba HTTP, contrato y control de errores |
| Conector | Hay conector oficial que cubre la operación | El conector no expone el dato requerido | Diseño de flujo y límites |
| Cloud flow | Evento, aprobación o integración SaaS | Se necesita interactuar con UI local | Run history y trazabilidad |
| Desarrollo | Reglas complejas, volumen alto o operación crítica | El costo excede el beneficio | ADR y estimación |
| Proceso manual mejorado | Volumen bajo o alta variabilidad | El costo humano es alto y repetitivo | Nuevo procedimiento y medición |

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Toma un proceso administrativo simulado: recibir archivo, validar campos, entrar a un portal sin API y registrar resultado.
2. Documenta AS-IS con actores, aplicaciones, entradas, salidas, volumen, excepciones y tiempos.
3. Marca cada paso como regla estable, decisión humana, integración posible o acción de interfaz.
4. Evalúa RPA/API/conector/cloud/desarrollo/manual con la matriz anterior.
5. Rechaza al menos una automatización mal planteada y explica por qué.
6. Define TO-BE solo para la alternativa seleccionada.

## 💼 Casos Reales de Negocio

Un equipo financiero quiere que PAD lea correos con adjuntos y cargue datos en un portal bancario. El análisis descubre que la descarga del archivo puede hacerse con cloud flow, la validación con Excel/Dataverse y solo la carga final requiere RPA porque el portal no expone API. El diseño reduce superficie frágil.

## ✅ Buenas Prácticas

- Trata RPA como última milla de interfaz, no como integración universal.
- Calcula deuda operativa: cambios de UI, sesiones, credenciales, licencias, monitoreo y soporte.
- Separa decisión técnica de deseo del negocio.
- Declara criterios de no automatizar.
- Usa datos ficticios y evidencia anonimizada.

## ⚠️ Errores Comunes

- Automatizar un proceso inestable sin rediseñarlo.
- Elegir RPA porque parece rápido aunque exista API.
- Ignorar excepciones de negocio.
- Prometer operación unattended sin validar licencia, sesión y máquina.
- Presentar un lab como experiencia productiva.

## 🧪 Criterios de Validación

- [ ] Puedo explicar qué es RPA y cuándo no usarlo.
- [ ] Diferencio desktop flows, cloud flows, APIs, conectores y scripts.
- [ ] Construí una matriz de viabilidad con riesgo, beneficio y deuda.
- [ ] Documenté AS-IS y TO-BE de un proceso.
- [ ] Defendí una decisión de rechazo o selección tecnológica.

## Evidencia

Matriz de viabilidad RPA, AS-IS, TO-BE, ADR breve y lista de riesgos. Lab recomendado: LAB-104. Práctica relacionada: CH-RPA-01.

## Preguntas de verificación

1. ¿Qué revisarías antes de automatizar una pantalla legacy?
2. ¿Por qué una API soportada suele ser preferible a RPA?
3. ¿Qué señales indican que el proceso necesita rediseño antes de automatización?

## Conexión con siguiente módulo

Después de decidir que RPA es viable, necesitas entender arquitectura, máquina, runtime, sesión, conexiones y licencias.

## Limitaciones y seguridad

No uses credenciales en texto plano ni datos reales. No marques validación en tenant si solo hiciste una simulación.

## Referencias oficiales

- [Overview of desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/desktop-flows)
- [Trigger desktop flows from cloud flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/trigger-desktop-flows)
- [Types of Power Automate licenses](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)

---
moduleId: 75
title: "Integración cloud flow + desktop flow"
level: "rpa"
certification: "Power Automate Desktop & RPA"
estimatedMinutes: 20
slug: "integracion-cloud-desktop-flow"
---

## 🎯 Objetivo

Diseñar un patrón end-to-end donde Power Automate cloud recibe trabajo, llama un desktop flow con inputs, usa máquina o machine group, recibe outputs, almacena estado, notifica resultado y monitorea errores.

## 📖 Conceptos Clave

Cloud flow orquesta eventos, conectores, aprobaciones, programación y almacenamiento; desktop flow ejecuta acciones de interfaz local. El contrato entre ambos debe incluir parámetros, outputs, errores y estado, no solo "ejecutar bot".

## 👨‍💻 Actividades Prácticas Paso a Paso

1. Diseña una solicitud de trabajo en SharePoint o Dataverse.
2. Crea cloud flow que toma registros `Pendiente`.
3. Envía inputs al desktop flow: ID de solicitud, ruta, modo y correlation ID.
4. El desktop flow devuelve estado, mensaje y ruta de evidencia.
5. Cloud flow actualiza estado y notifica.
6. Simula error desktop y valida manejo en cloud.

## 💼 Casos Reales de Negocio

Operaciones programa un lote nocturno. Cloud flow distribuye trabajo por máquina, PAD registra en portal sin API y Dataverse conserva estado por solicitud. El soporte consulta qué falló sin abrir la VM.

## ✅ Buenas Prácticas

- Define contrato de inputs/outputs.
- Usa colas o estados para distribución.
- No hagas que el desktop flow decida todo el proceso.
- Maneja errores de máquina y errores de negocio por separado.
- Protege conexiones y credenciales.

## ⚠️ Errores Comunes

- Ejecutar desktop flow sin estado persistente.
- No capturar salida estructurada.
- Mezclar credenciales en variables.
- Ignorar capacidad de máquina o grupo.
- No notificar fallos operativos.

## 🧪 Criterios de Validación

- [ ] Diseño cloud + desktop con contrato claro.
- [ ] Uso inputs y outputs.
- [ ] Registro estado por trabajo.
- [ ] Manejo error cruzado.
- [ ] Distingo cola, lote y ejecución programada.

## Evidencia

Diagrama, cloud flow, desktop flow, tabla/lista de estado, run history y evidencia de error controlado. Lab recomendado: LAB-110. Challenge relacionado: CH-RPA-03.

## Preguntas de verificación

1. ¿Qué debe devolver un desktop flow al cloud flow?
2. ¿Por qué necesitas estado fuera de la VM?
3. ¿Qué revisarías si la máquina no está disponible?

## Conexión con siguiente módulo

La solución debe moverse entre ambientes, operarse, gobernarse y mantenerse.

## Limitaciones y seguridad

Las capacidades attended/unattended dependen de licencia, permisos y tenant. Declara variante simulada cuando aplique.

## Referencias oficiales

- [Trigger desktop flows from cloud flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/trigger-desktop-flows)
- [Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)

---
id: lab-53
title: "Exportar, Desempaquetar y Revisar una Solución con Apoyo de IA"
level: "N5"
duration: 90
product: ["Power Platform CLI", "GitHub Copilot", "Claude Code", "Git"]
certifications: ["Buenas Prácticas"]
role: ["Developer", "Solution Architect"]
prerequisites:
  - "Lab 52 completado — Power Platform CLI configurado y conectado"
  - "Módulo 54 estudiado: ALM de Soluciones Power Platform con Apoyo de IA"
  - "Una solución de práctica en un entorno Developer/Sandbox (puede ser mínima: una tabla y un flujo)"
files: []
---

# Lab 53 — Exportar, Desempaquetar y Revisar una Solución con IA

## Objetivo

Al finalizar este laboratorio habrás exportado una solución desde un entorno de desarrollo, la habrás desempaquetado para versionarla en Git, y habrás usado un asistente de IA para detectar riesgos (referencias hardcodeadas, dependencias no documentadas) antes de considerarla lista para el pipeline hacia Test.

## Nivel

**Nivel IA — Desarrollo Asistido** — Buenas Prácticas (no es una certificación oficial Microsoft)

## Rol recomendado

Developer, Solution Architect.

## Escenario de negocio

**Empresa ficticia:** Servicios Integrados Tecnológicos S.A. (SIT)

**Problema a resolver:** el equipo de SIT necesita empezar a versionar en Git una solución que hasta ahora solo vivía dentro del entorno de desarrollo, como paso previo a automatizar su despliegue con un pipeline.

**Por qué es una buena tarea para practicar:** integra el ciclo completo de ALM del Módulo 54 (export → unpack → revisión) con el uso responsable de IA para acelerar la revisión sin reemplazar el juicio humano.

## Duración estimada

| Ejercicio | Tiempo estimado |
|---|---|
| Ejercicio 1 — Exportar la solución desde el entorno de desarrollo | 15 min |
| Ejercicio 2 — Desempaquetar y versionar en Git | 20 min |
| Ejercicio 3 — Revisar la solución con apoyo de IA (dependencias, referencias hardcodeadas) | 35 min |
| Ejercicio 4 — Documentar hallazgos y preparar checklist de importación | 20 min |
| **Total** | **90 min** |

## Tecnologías utilizadas

- Power Platform CLI (`pac solution export`/`unpack`)
- Git
- GitHub Copilot o Claude Code

## Ejercicio 1 — Exportar la solución

```bash
pac org who
pac solution export --name "SITSolicitudesGastos" --path ./exports/SITSolicitudesGastos.zip --managed false
```

**Validación esperada:** el archivo `.zip` se genera correctamente en la ruta indicada, y `pac org who` confirmó el entorno correcto antes de exportar.

## Ejercicio 2 — Desempaquetar y versionar

```bash
pac solution unpack --zipfile ./exports/SITSolicitudesGastos.zip --folder ./solutions/SITSolicitudesGastos --packagetype Unmanaged
git add ./solutions/SITSolicitudesGastos
git commit -m "chore: version inicial de la solución SITSolicitudesGastos"
```

**Validación esperada:** la carpeta desempaquetada contiene archivos XML/JSON individuales por componente, no un único `.zip` binario.

## Ejercicio 3 — Revisar con IA

Pide a un asistente de IA (con los archivos relevantes de la solución desempaquetada como contexto, no el proyecto completo):
1. Que resuma qué componentes contiene la solución (tablas, flujos, connection references).
2. Que identifique cualquier valor que parezca una URL, GUID o nombre de entorno hardcodeado dentro de los archivos XML (candidato a variable de entorno).
3. Que liste las connection references encontradas y si tienen un valor de conexión específico "quemado" en vez de quedar sin resolver para el entorno destino.

Verifica manualmente al menos 2 de los hallazgos reportados por la IA contra el archivo real antes de aceptarlos.

## Ejercicio 4 — Documentar y preparar checklist

Con los hallazgos del Ejercicio 3, escribe:
1. Una lista de valores que deberían convertirse en variables de entorno antes de mover la solución a Test.
2. Un checklist de importación (qué verificar antes de correr `pac solution import` en el entorno destino).

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Exportar como managed desde el entorno de desarrollo | Confundir el flujo: Dev siempre exporta unmanaged | Usar `--managed false` al exportar desde Dev |
| Commitear el `.zip` en vez de la carpeta desempaquetada | Saltarse `pac solution unpack` antes de versionar | Siempre desempaquetar antes de hacer commit |
| Aceptar el resumen de la IA sin verificar ningún archivo real | Confiar ciegamente en el análisis automatizado | Verificar manualmente al menos una muestra de los hallazgos |
| No detectar una connection reference con valor hardcodeado | No pedirle explícitamente a la IA que busque ese patrón | Pedir explícitamente la búsqueda de valores hardcodeados como paso separado |

## Criterios de Validación

- [ ] Exporté la solución como unmanaged desde el entorno de desarrollo
- [ ] Desempaqueté la solución y la versioné en Git (carpeta, no `.zip`)
- [ ] Usé IA para identificar componentes, dependencias y posibles valores hardcodeados
- [ ] Verifiqué manualmente al menos 2 hallazgos de la IA contra los archivos reales
- [ ] Documenté un checklist de importación para el entorno destino

## Preguntas de Reflexión

1. ¿Qué riesgo real habría corrido el equipo si hubiera importado la solución a Test sin este proceso de revisión?
2. ¿En qué casos el resumen de la IA sobre la solución podría estar incompleto o equivocado?
3. ¿Qué información de esta solución nunca deberías pegarle a un asistente de IA sin sanitizar primero?

## Módulos Relacionados

- Módulo 54 — ALM de Soluciones Power Platform con Apoyo de IA
- Módulo 48 — Revisión de Diffs y Pull Requests
- Módulo 55 — IA para Análisis de Soluciones, Arquitectura y Consultoría Funcional D365

## Referencia adicional

Un ejemplo completo y ejecutable del pipeline de export/unpack/pack/import (para copiar a un
proyecto real) está disponible en `docs/Anexos/EJEMPLO_PIPELINE_POWER_PLATFORM_ALM.md`.

## Competencias Desarrolladas

- Ciclo completo de export/unpack de una solución Power Platform
- Uso de IA para acelerar la revisión de componentes y dependencias
- Identificación de valores que deben externalizarse como variables de entorno

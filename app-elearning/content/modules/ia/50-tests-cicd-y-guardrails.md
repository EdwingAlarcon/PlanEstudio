---
moduleId: 50
title: "Tests, CI/CD y Guardrails para Código Generado por IA"
level: "ia"
certification: "Buenas Prácticas"
estimatedMinutes: 8
slug: "tests-cicd-y-guardrails"
---
### 🎯 Objetivo
Exigir tests automatizados y gates de CI/CD para cualquier código generado con asistencia de IA, usando linters, type-checkers y feature flags como red de seguridad antes de llegar a producción.

### 📖 Conceptos Clave
- **Tests como contrato, no como formalidad:** un test que valida el comportamiento esperado (no solo que el código "compile") es la única forma objetiva de confirmar que un cambio generado por IA hace lo que se pidió, incluso cuando el revisor humano no detectó un problema a simple vista.
- **Gates de CI:** pasos obligatorios (lint, typecheck, tests, build) que deben pasar antes de fusionar un cambio — el mismo pipeline que ya usa este proyecto (`ci.yml`: Lint & Type Check → Unit Tests → Playwright Smoke → Build → Deploy) es el guardrail que atrapa errores de código generado por IA igual que errores de código escrito a mano.
- **Linters y type-checkers como red de seguridad:** ESLint y `tsc --noEmit` detectan patrones inseguros (variables sin usar, tipos incorrectos) sin necesidad de que un humano los note manualmente — código generado por IA se beneficia igual de esta red.
- **Feature flags para cambios asistidos:** desplegar un cambio generado con IA detrás de un flag (o en un entorno de pruebas separado antes de producción) permite revertirlo sin un despliegue de emergencia si se detecta un problema después del release.
- **Cobertura de tests como métrica de confianza:** un cambio que reduce la cobertura de tests existente es una señal de alerta, generado por IA o no — el umbral de cobertura configurado en el proyecto (80% en `vitest.config.ts`) aplica igual a código asistido por IA.

### 👨‍💻 Actividades Prácticas Paso a Paso
1. Prompt para generar tests de un cambio ya implementado (nunca el único paso, siempre revisado):
   ```
   Rol: escribes tests unitarios con Vitest para este proyecto.
   Contexto: la función calculateLevelProgress en src/lib/progress.ts recibe {{descripción de
   parámetros}} y retorna {{descripción del resultado}}.
   Tarea: genera 3 tests: el caso normal, un caso límite (0 módulos completados) y un caso de entrada
   inválida. Sigue el patrón de los tests existentes en progress.test.ts.
   Formato de salida: bloque de código de test listo para pegar en el archivo de test existente.
   ```
   *Evalúa:* ¿los tests generados realmente fallan si rompes la función a propósito (mutation testing manual)? Un test que siempre pasa, pase lo que pase, no vale nada.
2. Toma un cambio generado por un agente en un módulo anterior (44 o 45) y usa el prompt anterior para escribir al menos un test que valide su comportamiento esperado, si no lo tiene ya.
3. Ejecuta `npm run lint && npx tsc --noEmit && npm run test:coverage` sobre ese cambio y confirma que pasa los 3 gates antes de considerarlo terminado.
4. Identifica en `.github/workflows/ci.yml` de este proyecto cuáles son los gates obligatorios antes de un deploy y explica con tus palabras qué atraparía cada uno si un cambio generado por IA introdujera un error.
5. Diseña (en texto, sin implementarlo) cómo desplegarías detrás de un feature flag un cambio de alto riesgo generado con asistencia de IA en un flujo de aprobación real.

### 💼 Casos Reales de Negocio
Un equipo de SIT fusionó directamente a producción un cambio generado por un agente que "pasaba visualmente bien" en una prueba manual, sin agregar tests ni pasar por el pipeline de CI completo (lo hicieron manualmente fuera del flujo normal, saltándose el pipeline "para ir rápido"). El cambio introdujo una regresión en un cálculo de descuentos que no se detectó hasta que un cliente reportó una factura incorrecta. La política adoptada después: ningún cambio, generado por IA o no, se fusiona sin pasar por el pipeline de CI completo — sin excepciones por "urgencia".

### ✅ Buenas Prácticas
- Exigir al menos un test que valide el comportamiento esperado para todo cambio generado con IA antes de darlo por terminado.
- No saltarse nunca el pipeline de CI (lint, typecheck, tests, build) "para ir más rápido", ni siquiera en cambios generados por IA que parecen simples.
- Considerar feature flags o despliegue progresivo para cambios de alto riesgo asistidos por IA, permitiendo reversión rápida.

### ⚠️ Errores Comunes
| Error | Causa | Solución |
|-------|-------|----------|
| Fusionar un cambio generado por IA sin pasar por el pipeline de CI completo | Presión de tiempo o confianza excesiva en que "se ve bien" | Ningún cambio se fusiona sin pasar los gates de CI, sin excepciones |
| No agregar tests a un cambio generado por IA porque "ya funcionó en la prueba manual" | Confundir una prueba manual puntual con una validación repetible | Exigir al menos un test automatizado que reproduzca el comportamiento esperado |
| Desplegar directamente a producción un cambio de alto riesgo generado por IA | No usar feature flags ni despliegue progresivo | Usar flags o rollout gradual en cambios de alto riesgo, generados por IA o no |

### 🧪 Criterios de Validación
- [ ] Uso el prompt de generación de tests y verifico que el test realmente falla si rompo la función a propósito
- [ ] Agrego un test de validación a un cambio generado por IA de un módulo anterior
- [ ] Confirmo que un cambio pasa los 3 gates locales (lint, typecheck, test:coverage) antes de darlo por terminado
- [ ] Explico qué gate del pipeline de CI de este proyecto atraparía un error específico introducido por IA
- [ ] Relaciono este módulo con cualquier lab donde genere tests o valide un entregable con el pipeline de CI antes de presentarlo

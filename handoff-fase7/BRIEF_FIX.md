# Corregir los hallazgos de una prueba simulada (2026-11-01)

Lee primero, en esta carpeta, `BRIEF_COMUN.md`, `BRIEF_FASE3.md` y `BRIEF_FASE4_5_6.md` (reglas de contenido) y el informe
de la simulación que te indica tu tarea. Tu trabajo: corregir en los archivos que te asigna la tarea **solo** lo que
quede confirmado.

1. **Antes de corregir, verifica.** Cada afirmación técnica del informe (etiqueta, licencia, límite, código) compruébala
   en Microsoft Learn (o en la documentación oficial del producto) con WebFetch en inglés; si resulta falsa, no la apliques
   y anótala como falsa alarma. Los problemas de didáctica (paso que obliga a adivinar, término sin explicar, tiempo
   subestimado, criterio de validación que no acepta la variante en papel) se corrigen sin necesidad de Learn.
2. **Código:** todo fragmento que toques debe compilar o ejecutarse. Hay .NET SDK 8 en `C:\Program Files\dotnet\dotnet.exe`
   (plugins: net48 + `Microsoft.NETFramework.ReferenceAssemblies` + `Microsoft.CrmSdk.CoreAssemblies`), Node y `npx tsc`.
   Compílalo en tu carpeta de scratch y di el comando y el resultado.
3. **Reglas que no se rompen:** el Caso Real de Negocio queda textualmente idéntico; no cambies `moduleId`, `slug`,
   `level`; no edites `interactive-practices.ts` ni `docs/javascripts/evaluaciones-simulador.js` (si una práctica o una
   pregunta debe cambiar, reporta el texto viejo/nuevo exacto); no toques archivos fuera de tu tarea (si otro archivo
   necesita un cambio, repórtalo). Ajusta `estimatedMinutes`/`practiceMinutes` (o `duration` en labs) si el informe
   demuestra que están subestimados.
4. Desde `app-elearning/`: `npx tsx scripts/validate-content.ts` y `npm run audit:lbd` (tus módulos siguen como piloto).

Informe final: por hallazgo, "aplicado / falsa alarma (con URL) / no aplicado (motivo)"; archivos tocados; compilaciones;
cambios necesarios en otros archivos (texto viejo/nuevo exacto).

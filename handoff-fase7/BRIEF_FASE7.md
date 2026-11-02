# Resto del curso: IA (42, 45, 47-53, 56), D365 (57-66) y RPA (67-76) — aprobado por el usuario el 2026-11-01

Lee primero, en esta misma carpeta, `BRIEF_COMUN.md`, `BRIEF_FASE3.md` y `BRIEF_FASE4_5_6.md`. Todo aplica igual
(patrón, Caso Real textualmente idéntico, verificación en Microsoft Learn en inglés con URL y `ms.date`, redacción neutra
cuando una etiqueta no se puede confirmar, no editar `interactive-practices.ts` ni el banco de preguntas, entregar las
prácticas en tu archivo de scratch como `export const NEW_PRACTICES = [ ... ];`, no commit). Diferencias:

## Niveles transversales
- IA, D365 y RPA **no gatean ni son gateados** por los 4 niveles de certificación ni entre sí: nada de prerrequisitos duros
  hacia módulos 1-41 (puedes mencionarlos como "opcional, si ya lo hiciste"). Prerrequisitos de prácticas: solo módulos del
  mismo nivel transversal.
- Módulos ya migrados del nivel IA, para copiar la forma: `ia/43-*.md`, `ia/44-*.md`, `ia/46-*.md`, `ia/54-*.md`,
  `ia/55-*.md`. Para D365 y RPA, mira también `arquitecto/40-*.md` (decidir y defender) y `intermedio/13-*.md` (código).

## Por nivel
- **IA:** cada módulo con una actividad de **fallo y corrección** (la IA propone algo plausible con errores; el alumno
  los detecta con evidencia: test, Learn, compilador, diff). Código ejecutable de verdad: compílalo o ejecútalo en tu
  scratch (Node, `npx tsc --noEmit`; C# con `C:\Program Files\dotnet\dotnet.exe`, net48 + `Microsoft.NETFramework.ReferenceAssemblies`
  + `Microsoft.CrmSdk.CoreAssemblies` para plugins). Herramientas sin pago obligatorio: GitHub Free, Copilot Free, PAC CLI.
- **D365:** la mayoría de alumnos **no** tiene un tenant con apps de Dynamics 365 (un ambiente Developer no puede
  instalarlas; las trials de D365 duran 30 días). Cada microlección práctica necesita la **variante en papel** o una
  "trial si la tienes"; el núcleo es decidir y defender con rúbrica (fit-gap, diseño de proceso, matriz de ownership...).
  No inventes etiquetas de la interfaz de D365: verifícalas en Learn o redáctalas en neutro.
- **RPA (Power Automate for desktop):** el alumno usa Windows y PAD gratis (sin licencia para crear y ejecutar desktop
  flows en modo atendido localmente; verifica en Learn qué requiere licencia: unattended, cloud flow que llama a desktop
  flow, máquinas). **Ya existen en la app dos sandboxes para practicar sin riesgo**: `/rpa-sandbox/portal` y
  `/rpa-sandbox/legacy-app` (código en `app-elearning/src/app/rpa-sandbox/`): úsalos en las microprácticas reales.
  Verifica en Learn los nombres de acciones de PAD (por ejemplo "Launch Excel", "Read from Excel worksheet",
  "Launch new Microsoft Edge", "Populate text field on web page", "On block error"). La GUIA de instalación de PAD ya está
  en el Módulo 68 (no la dupliques).

## Prácticas interactivas
- Dominios: IA → `ia` (prefijo IA); M56 → `javascript` (JS); D365 → `dynamics-365` (D365); RPA → **`rpa`** (prefijo RPA,
  dominio nuevo: el coordinador lo añade; úsalo tal cual). `relatedLabIds` **no vacío** (labs existentes que correspondan;
  mira `content/labs/`: IA 45, 51-57, 65, 80; D365 57-60, 64, 66-70, 81-90, 93-103, 113; RPA 104-112).
- 3 por módulo (guiada, diagnóstico `debug-scenario`, transferencia), con los IDs que te asigna tu tarea, en orden.
  Comprueba que la respuesta correcta evalúa "correct" y que la pista 3 de la debug-scenario saca 100 (importa
  `evaluateDecision`/`evaluateDebug` del banco desde un script en tu scratch con `npx tsx`).

## Labs
- Si un lab del nivel contradice el contenido nuevo, **repórtalo** (texto viejo/nuevo); no lo edites salvo que tu tarea lo diga.

## Antes de entregar
Desde `app-elearning/`: `npx tsx scripts/validate-content.ts` y `npm run audit:lbd` (tus módulos deben salir como
**piloto**). Informe: archivos, cambios, errores corregidos con URL, no verificado, cambios necesarios en otros archivos
(banco de preguntas con texto viejo/nuevo exacto, labs), tabla de prácticas (ID, slug, tipo, módulo, rol), criterios de
validación antes/después, y el resultado de compilar/ejecutar el código.

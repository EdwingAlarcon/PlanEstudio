# Verificador de estación de PlanEstudio

Scripts locales que revisan qué herramientas de desarrollo ya tienes instaladas y
generan un reporte JSON. Corren **en tu equipo**, no envían nada a ningún servidor,
y PlanEstudio no los ejecuta por ti ni accede a tu equipo — los corres tú y pegas
el resultado en la app.

## Cómo usarlo

**Windows (PowerShell / PowerShell 7):**
```powershell
pwsh -File tools/check-workstation.ps1
```
(también funciona con `powershell -File tools/check-workstation.ps1` en Windows PowerShell 5.1)

**macOS / Linux:**
```sh
sh tools/check-workstation.sh
```

Ambos imprimen un JSON a la salida estándar. Copia ese JSON completo y pégalo en la
sección "Importar reporte del verificador" de
[`/preparar-entorno`](https://planestudio.vercel.app/preparar-entorno).
La app valida el reporte, muestra una vista previa y, si confirmas, actualiza el
estado de cada herramienta con la versión detectada.

## Qué revisa

| Herramienta | Comando de verificación |
|---|---|
| Git | `git --version` |
| Power Platform CLI (`pac`) | `pac --version` |
| Node.js | `node --version` |
| .NET SDK | `dotnet --info` |
| PowerShell / PowerShell 7 | `$PSVersionTable` (Windows) / `pwsh --version` (macOS/Linux) |

Estas son las únicas 5 herramientas de la matriz de `/preparar-entorno` que se
pueden verificar de forma fiable por línea de comandos en cualquier sistema
operativo. Visual Studio Code, Visual Studio y Power Automate Desktop se marcan
manualmente en la app porque no tienen un comando de verificación confiable
multiplataforma.

## Formato del reporte

```json
{
  "format": "planestudio-workstation-report",
  "schemaVersion": 1,
  "generatedAt": "2026-07-30T12:00:00Z",
  "os": "windows",
  "tools": [
    { "id": "git", "command": "git --version", "detected": true, "rawVersion": "git version 2.45.1", "status": "installed" }
  ]
}
```

`status` es `installed` o `not_installed` por herramienta. El parser de la app
(`app-elearning/src/lib/workstation-report.ts`) valida tamaño, formato, versión de
esquema, sistema operativo y cada entrada antes de aplicar cualquier cambio al
estado local; las herramientas desconocidas o mal formadas se ignoran con una
advertencia, sin bloquear el resto del reporte.

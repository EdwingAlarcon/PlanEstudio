<#
.SYNOPSIS
  Verificador de estación de PlanEstudio (Windows/PowerShell).

.DESCRIPTION
  Corre localmente en tu equipo. No envía nada a ningún servidor: solo imprime un
  reporte JSON a la salida estándar. Copia ese JSON y pégalo en
  https://edwingalarcon.github.io/PlanEstudio/preparar-entorno para actualizar tu
  matriz de herramientas con la versión detectada. PlanEstudio no ejecuta este
  script por ti ni accede a tu equipo.

.EXAMPLE
  pwsh -File tools/check-workstation.ps1
  pwsh -File tools/check-workstation.ps1 > reporte.json
#>

function Test-Command {
    param(
        [string]$Id,
        [string]$Command,
        [scriptblock]$Probe
    )

    try {
        $output = & $Probe 2>&1
        $exitCode = $LASTEXITCODE
        $text = ($output | Out-String).Trim()
        if ($text.Length -gt 0 -and ($null -eq $exitCode -or $exitCode -eq 0)) {
            $firstLine = (($text -split "`n")[0]).Trim().TrimEnd("`r")
            return [PSCustomObject]@{
                id         = $Id
                command    = $Command
                detected   = $true
                rawVersion = $firstLine
                status     = "installed"
            }
        }
    } catch {
        # comando no encontrado o falló: se reporta como no instalado
    }

    return [PSCustomObject]@{
        id         = $Id
        command    = $Command
        detected   = $false
        rawVersion = ""
        status     = "not_installed"
    }
}

$results = @()
$results += Test-Command -Id "git" -Command "git --version" -Probe { git --version }
$results += Test-Command -Id "pac-cli" -Command "pac --version" -Probe { pac --version }
$results += Test-Command -Id "node" -Command "node --version" -Probe { node --version }
$results += Test-Command -Id "dotnet-sdk" -Command "dotnet --info" -Probe { dotnet --info }
$results += Test-Command -Id "powershell" -Command "`$PSVersionTable" -Probe { $PSVersionTable.PSVersion.ToString() }

$report = [ordered]@{
    format      = "planestudio-workstation-report"
    schemaVersion = 1
    generatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    os          = "windows"
    tools       = $results
}

$report | ConvertTo-Json -Depth 5

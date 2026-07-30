#!/bin/sh
# Verificador de estación de PlanEstudio (macOS/Linux).
#
# Corre localmente en tu equipo. No envía nada a ningún servidor: solo imprime un
# reporte JSON a la salida estándar. Copia ese JSON y pégalo en
# https://edwingalarcon.github.io/PlanEstudio/preparar-entorno para actualizar tu
# matriz de herramientas con la versión detectada. PlanEstudio no ejecuta este
# script por ti ni accede a tu equipo.
#
# Uso:
#   sh tools/check-workstation.sh
#   sh tools/check-workstation.sh > reporte.json

os_name="linux"
case "$(uname -s)" in
  Darwin*) os_name="macos" ;;
  Linux*) os_name="linux" ;;
esac

generated_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g' | tr -d '\n'
}

emit_tool() {
  id="$1"
  command_label="$2"
  probe="$3"
  raw_version=$(eval "$probe" 2>/dev/null | head -n 1)
  if [ -n "$raw_version" ]; then
    detected="true"
    status="installed"
  else
    detected="false"
    status="not_installed"
    raw_version=""
  fi
  escaped_version=$(json_escape "$raw_version")
  printf '{"id":"%s","command":"%s","detected":%s,"rawVersion":"%s","status":"%s"}' \
    "$id" "$command_label" "$detected" "$escaped_version" "$status"
}

tools_json=$(
  printf '%s,' "$(emit_tool git 'git --version' 'git --version')"
  printf '%s,' "$(emit_tool pac-cli 'pac --version' 'pac --version')"
  printf '%s,' "$(emit_tool node 'node --version' 'node --version')"
  printf '%s,' "$(emit_tool dotnet-sdk 'dotnet --info' 'dotnet --info')"
  printf '%s' "$(emit_tool powershell 'pwsh --version' 'pwsh --version')"
)

printf '{"format":"planestudio-workstation-report","schemaVersion":1,"generatedAt":"%s","os":"%s","tools":[%s]}\n' \
  "$generated_at" "$os_name" "$tools_json"

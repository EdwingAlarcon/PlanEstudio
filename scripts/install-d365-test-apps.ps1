<#
.SYNOPSIS
Lists and optionally installs Dynamics 365 test applications in a Dataverse environment.

.DESCRIPTION
Uses Power Platform CLI (`pac application list/install`) to resolve available Microsoft
Marketplace Dataverse applications for a target environment. The script is intentionally
confirmation-first: it writes the available app catalog to JSON, shows matched candidates,
and installs only when -Install is provided. By default, it uses a curated CoreTest
profile so test environments do not receive preview, internal, or unrelated apps by
accident.

F&O apps are not installed as Dataverse Marketplace apps. Use this script for CE apps
such as Sales, Customer Service, Field Service, Contact Center and Customer Insights.

.EXAMPLE
.\scripts\install-d365-test-apps.ps1 -EnvironmentUrl "https://org.crm.dynamics.com" -Products Sales,CustomerService -Install

.EXAMPLE
.\scripts\install-d365-test-apps.ps1 -EnvironmentUrl "https://org.crm.dynamics.com" -Products All

.EXAMPLE
.\scripts\install-d365-test-apps.ps1 -EnvironmentUrl "https://org.crm.dynamics.com" -ApplicationNames msdyn_SalesPro,UnifiedCustomerProfileAnchor -Install
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$EnvironmentUrl,

  [ValidateSet("All", "Sales", "CustomerService", "FieldService", "ContactCenter", "CustomerInsights", "CustomerInsightsJourneys", "CustomerInsightsData")]
  [string[]]$Products = @("All"),

  [ValidateSet("CoreTest", "Matched")]
  [string]$Profile = "CoreTest",

  [string[]]$ApplicationNames = @(),

  [switch]$IncludePreview,

  [switch]$Install,

  [string]$OutputDir = ".\.d365-app-install"
)

$ErrorActionPreference = "Stop"

function Assert-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Command '$Name' was not found in PATH. Install Power Platform CLI first."
  }
}

function Get-PropertyValue {
  param(
    [Parameter(Mandatory = $true)]$Object,
    [string[]]$Names
  )

  foreach ($name in $Names) {
    if ($Object.PSObject.Properties.Name -contains $name) {
      $value = $Object.$name
      if ($null -ne $value -and "$value".Trim().Length -gt 0) {
        return "$value"
      }
    }
  }

  return ""
}

function Test-AppMatch {
  param(
    [Parameter(Mandatory = $true)]$App,
    [Parameter(Mandatory = $true)][string]$Product
  )

  $name = Get-PropertyValue $App @("FriendlyName", "friendlyName", "DisplayName", "displayName", "Name", "name", "applicationName", "ApplicationName", "UniqueName", "uniqueName")
  $publisher = Get-PropertyValue $App @("PublisherName", "publisherName", "Publisher", "publisher")
  $haystack = "$name $publisher".ToLowerInvariant()

  switch ($Product) {
    "Sales" { return $haystack -match "dynamics 365.*sales|sales professional|sales premium|sales productivity|sales demo hub" }
    "CustomerService" { return $haystack -match "customer service" -and $haystack -notmatch "patient service|customer voice" }
    "FieldService" { return $haystack -match "field service" }
    "ContactCenter" { return $haystack -match "contact center|omnichannel|unified routing" }
    "CustomerInsights" { return $haystack -match "customer insights|marketing insights|unified customer profile" }
    "CustomerInsightsJourneys" { return $haystack -match "customer insights|journeys|marketing insights" }
    "CustomerInsightsData" { return $haystack -match "customer insights|unified customer profile|customer data platform" }
    default { return $false }
  }
}

function Test-BlockedApp {
  param(
    [Parameter(Mandatory = $true)]$App,
    [switch]$AllowPreview
  )

  $displayName = Get-PropertyValue $App @("FriendlyName", "friendlyName", "DisplayName", "displayName", "Name", "name")
  $uniqueName = Get-PropertyValue $App @("UniqueName", "uniqueName", "ApplicationName", "applicationName", "Name", "name")
  $haystack = "$displayName $uniqueName".ToLowerInvariant()

  if ($haystack -match "do not install|firstpartyappusermanagementprod") {
    return $true
  }

  if (-not $AllowPreview -and $haystack -match "preview") {
    return $true
  }

  return $false
}

Assert-Command "pac"

$coreTestApplicationNames = @{
  Sales = @(
    "msdyn_SalesPro",
    "msdyn_SalesPremiumSampleData",
    "msdyn_SalesDemoHubAnchor"
  )
  CustomerService = @(
    "msdyn_CustomerServiceDemoHubAnchor",
    "msdyn_CustomerServiceAnalyticsAnchor",
    "msdyn_ServiceIntelligenceAnchor"
  )
  FieldService = @(
    "msdyn_FieldService",
    "msdynce_FieldService"
  )
  ContactCenter = @(
    "msdyn_TransformContactCenterAnchor",
    "msdyn_ContactCenterHealthAnchor",
    "msdyn_OmnichannelAssignment"
  )
  CustomerInsights = @(
    "UnifiedCustomerProfileAnchor",
    "msdynci_CIRealtimeM3",
    "msdynci_CIRealtimeSearch"
  )
  CustomerInsightsJourneys = @(
    "msdynci_CIRealtimeM3",
    "msdynci_CIRealtimeSearch"
  )
  CustomerInsightsData = @(
    "UnifiedCustomerProfileAnchor"
  )
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$catalogPath = Join-Path $OutputDir "available-d365-apps.json"

Write-Host "Listing available Dataverse applications for: $EnvironmentUrl"
Write-Host "If authentication is not configured, run:"
Write-Host "  pac auth create --name PlanEstudioD365 --environment `"$EnvironmentUrl`" --deviceCode"
Write-Host ""

pac application list --environment $EnvironmentUrl --installState All --output $catalogPath

if (-not (Test-Path $catalogPath)) {
  throw "Application catalog was not written to $catalogPath"
}

$raw = Get-Content -Raw $catalogPath
$json = $raw | ConvertFrom-Json
$apps = if ($json -is [array]) { $json } elseif ($json.PSObject.Properties.Name -contains "Applications") { $json.Applications } else { @($json) }

if (-not $apps -or $apps.Count -eq 0) {
  throw "No applications were returned for $EnvironmentUrl. Verify permissions, environment URL and Dynamics 365 apps availability."
}

$targetProducts = if ($Products -contains "All") {
  @("Sales", "CustomerService", "FieldService", "ContactCenter", "CustomerInsights")
} else {
  $Products
}

$matched = foreach ($product in $targetProducts) {
  if ($ApplicationNames.Count -gt 0) {
    $wantedNames = @($ApplicationNames)
    $candidates = @($apps | Where-Object {
      $uniqueName = Get-PropertyValue $_ @("UniqueName", "uniqueName", "ApplicationName", "applicationName", "Name", "name")
      $wantedNames -contains $uniqueName
    })
  } elseif ($Profile -eq "CoreTest") {
    $wantedNames = @($coreTestApplicationNames[$product])
    $candidates = @($apps | Where-Object {
      $uniqueName = Get-PropertyValue $_ @("UniqueName", "uniqueName", "ApplicationName", "applicationName", "Name", "name")
      $wantedNames -contains $uniqueName
    })
  } else {
    $candidates = @($apps | Where-Object { Test-AppMatch $_ $product })
  }

  $candidates = @($candidates | Where-Object { -not (Test-BlockedApp $_ -AllowPreview:$IncludePreview) })

  if ($candidates.Count -eq 0) {
    Write-Warning "No safe candidates found for product '$product' with profile '$Profile'. Review $catalogPath if this product should be installed manually."
  }

  foreach ($candidate in $candidates) {
    [pscustomobject]@{
      Product = $product
      DisplayName = Get-PropertyValue $candidate @("FriendlyName", "friendlyName", "DisplayName", "displayName", "Name", "name")
      UniqueName = Get-PropertyValue $candidate @("UniqueName", "uniqueName", "ApplicationName", "applicationName", "Name", "name")
      InstallState = Get-PropertyValue $candidate @("InstallState", "installState", "State", "state")
      Version = Get-PropertyValue $candidate @("Version", "version")
    }
  }
}

if (-not $matched -or $matched.Count -eq 0) {
  Write-Warning "No matching applications found. Review $catalogPath and install manually with pac application install --application-name <unique-name>."
  exit 2
}

$matchedPath = Join-Path $OutputDir "matched-d365-apps.csv"
$matched | Sort-Object Product, DisplayName | Export-Csv -NoTypeInformation -Encoding UTF8 $matchedPath

Write-Host ""
Write-Host "Matched applications:"
$matched | Sort-Object Product, DisplayName | Format-Table -AutoSize
Write-Host "Catalog: $catalogPath"
Write-Host "Matches: $matchedPath"
Write-Host "Profile: $Profile"

if (-not $IncludePreview) {
  Write-Host "Preview/internal apps were excluded. Use -IncludePreview only when a real tenant decision approves it."
}

if (-not $Install) {
  Write-Host ""
  Write-Host "Dry run only. Re-run with -Install to install/update the matched applications."
  exit 0
}

foreach ($app in ($matched | Sort-Object Product, DisplayName)) {
  if (-not $app.UniqueName) {
    Write-Warning "Skipping '$($app.DisplayName)' because no unique application name was returned."
    continue
  }

  Write-Host "Installing/updating $($app.Product): $($app.DisplayName) [$($app.UniqueName)]"
  pac application install --environment $EnvironmentUrl --application-name $app.UniqueName
}

Write-Host "Installation requests submitted. Check Power Platform Admin Center > Dynamics 365 apps for final status."

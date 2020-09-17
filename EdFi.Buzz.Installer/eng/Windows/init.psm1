# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

function Install-NugetCli {
  Param(
      [Parameter(Mandatory = $true)]
      [string] $toolsPath,
      [string] $sourceNugetExe = "https://dist.nuget.org/win-x86-commandline/v5.3.1/nuget.exe"
  )

  if (-not $(Test-Path $toolsPath)) {
      mkdir $toolsPath | Out-Null
  }

  $nuget = (Join-Path $toolsPath "nuget.exe")

  if (-not $(Test-Path $nuget)) {
      Write-Host "Downloading nuget.exe official distribution from " $sourceNugetExe
      Invoke-WebRequest $sourceNugetExe -OutFile $nuget
  }
  else {
      $info = Get-Command $nuget
      Write-Host "Found nuget exe in: $toolsPath"

      if ("5.3.1.0" -ne $info.Version.ToString()) {
          Write-Host "Updating nuget.exe official distribution from " $sourceNugetExe
          Invoke-WebRequest $sourceNugetExe -OutFile $nuget
      }
  }
}

<#
 Initializes the installing machine
 Ensures we have NuGet Package Provider
 Verifies PostgreSQL database
 #>
function Initialize-Installer($toolsPath, $downloadPath, $databasesConfig) {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls11 -bor [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
  Install-NugetCli $toolsPath
  Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force | out-host
  Initialize-PsqlHome $databasesConfig $toolsPath $downloadPath
}

Export-ModuleMember Initialize-Installer

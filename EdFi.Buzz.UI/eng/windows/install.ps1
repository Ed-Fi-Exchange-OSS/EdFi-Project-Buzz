# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

[CmdletBinding()]
param(
  [string]
  $InstallPath = "C:\Ed-Fi\Buzz\UI",

  [string]
  $WinSWUrl = "https://github.com/winsw/winsw/releases/download/v2.9.0/WinSW.NETCore31.zip",

  [Parameter(Mandatory = $true)]
  [INT] $port,

  [Parameter(Mandatory = $true)]
  [string] $graphQlEndpoint,

  [Parameter(Mandatory = $true)]
  [string] $idProvider,
  [string] $googleClientId,
  [string] $adfsClientId,
  [string] $adfsTenantId,
  [Parameter(Mandatory = $true)]
  [string] $toolsPath,
  [Parameter(Mandatory = $true)]
  [string] $packagesPath,
  [Parameter(Mandatory = $true)]
  [string] $rootDir = "build",
  [Parameter(Mandatory = $true)]
  [string] $app = "UI",
  [Parameter(Mandatory = $true)]
  [bool] $externalLogo = $true,
  [Parameter(Mandatory = $true)]
  [string] $logo = "assets/Owl-Logo-GrandBend.png",
  [Parameter(Mandatory = $true)]
  [string] $logoWidth = "350px",
  [Parameter(Mandatory = $true)]
  [string] $title = "Buzz",
  [Parameter(Mandatory = $true)]
  [string] $titleLogo = "assets/fix-it.png",
  [Parameter(Mandatory = $true)]
  [string] $titleLogoWidth = "78px",
  [Parameter(Mandatory = $true)]
  [string] $titleLogoHeight = "56px"
)

Import-Module "$PSScriptRoot/Buzz-App-Install.psm1" -Force -Scope Local
Initialize-AppInstaller -toolsPath $toolsPath  -packagesPath $packagesPath

function Install-Files {
  param(
      [string]
      $webSitePath,
      [string]
      $rootDir
  )

  New-Item -ItemType Directory -Path "$webSitePath\" -ErrorAction SilentlyContinue

  # Copy the build directory into the NGiNX folder
  $parameters = @{
      Path        = "$PSScriptRoot\..\$rootDir"
      Destination = "$webSitePath"
      Recurse     = $true
      Force       = $true
  }
  Copy-Item @parameters
}

function Update-Configuration {
  [CmdletBinding()]
  param (
    [Parameter(Mandatory=$true)]
    [string] $appPath
  )

  $uriDiscovery = "https://accounts.google.com/.well-known/openid-configuration"
  if ("adfs" -eq $script:idProvider) {
  $uriDiscovery = "https://login.microsoftonline.com/common/.well-known/openid-configuration"
  }

  $runtimeConfig = @"
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// runtime-config.js
window['runConfig'] = {
    REACT_APP_GQL_ENDPOINT:"$script:graphQlEndpoint",
    REACT_APP_URI_DISCOVERY:"$uriDiscovery",
    REACT_APP_GOOGLE_CLIENT_ID:"$script:googleClientId",
    REACT_APP_ADFS_CLIENT_ID:"$script:adfsClientId",
    REACT_APP_ADFS_TENANT_ID:"$script:adfsTenantId",
    REACT_APP_EXTERNAL_LOGO:"$script:externalLogo",
    REACT_APP_LOGO:"$script:logo",
    REACT_APP_LOGO_WIDTH:"$script:logoWidth",
    REACT_APP_TITLE:"$script:title",
    REACT_APP_TITLE_LOGO:"$script:titleLogo",
    REACT_APP_TITLE_LOGO_WIDTH:"$script:titleLogoWidth",
    REACT_APP_TITLE_LOGO_HEIGHT:"$script:titleLogoHeight",
    REACT_ID_PROVIDER:"$script:idProvider",
  };
"@
  if (Test-Path -Path "$appPath\\runtime-config.js") {
    Set-Content -Path "$appPath\\runtime-config.js" -Value $runtimeConfig -Force
    Write-Host "Updated the runtime config with runtime configuration"
  }
  else {
    throw "Could not locate the runtime-config.js"
  }

}

try {
  Write-Host "Begin Ed-Fi Buzz UI installation..." -ForegroundColor Yellow

  New-Item -Path $InstallPath -ItemType Directory -Force | Out-Null

  Install-Files -webSitePath $InstallPath -rootDir $rootDir
  Update-Configuration -appPath "$installPath\$rootDir"

  Write-Host "End Ed-Fi Buzz UI installation." -ForegroundColor Yellow
}
catch {
  Write-Host $_
  Write-Host $_.ScriptStackTrace
  Write-Host "EdFi Buzz ui install failed."
}

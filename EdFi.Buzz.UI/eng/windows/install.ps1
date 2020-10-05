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
  $NginxUrl = "http://nginx.org/download/nginx-1.19.0.zip",

  [string]
  $WinSWUrl = "https://github.com/winsw/winsw/releases/download/v2.9.0/WinSW.NETCore31.zip",

  [Parameter(Mandatory = $true)]
  [INT] $port,

  [Parameter(Mandatory = $true)]
  [string] $graphQlEndpoint,

  [string] $googleClientId,
  [string] $adfsClientId,
  [string] $adfsTenantId,
  [Parameter(Mandatory = $true)]
  [string] $toolsPath,
  [Parameter(Mandatory = $true)]
  [string] $packagesPath,
  [Parameter(Mandatory = $true)]
  [string] $nginxPort,
  [Parameter(Mandatory = $true)]
  [string] $rootDir = "build",
  [Parameter(Mandatory = $true)]
  [string] $app = "UI"
)

Import-Module "$PSScriptRoot/init.psm1" -Force
Import-Module "$PSScriptRoot/Buzz-App-Install.psm1" -Force
Initialize-Installer -toolsPath $toolsPath  -packagesPath $packagesPath

Write-Host "Begin Ed-Fi Buzz $($script:app) installation..." -ForegroundColor Yellow

if (![string]::IsNullOrEmpty($googleClientId)) {
  $adfsClient = ""
  $adfsTenantId = ""
}

# Use Google unless ADFS is populated
$envFile = @"
/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */
PORT=$port
REACT_APP_GQL_ENDPOINT=$graphQlEndpoint
REACT_APP_GOOGLE_CLIENT_ID=$googleClientId
REACT_APP_ADFS_CLIENT_ID=
REACT_APP_ADFS_TENANT_ID=
REACT_APP_SURVEY_MAX_FILE_SIZE_BYTES=1048576
REACT_APP_JOB_STATUS_FINISH_IDS=[3]
"@

if ($adfsClientId.Length -gt 1) {
  $envFile = @"
/*
* SPDX-License-Identifier: Apache-2.0
* Licensed to the Ed-Fi Alliance under one or more agreements.
* The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
* See the LICENSE and NOTICES files in the project root for more information.
*/
PORT=$port
REACT_APP_GQL_ENDPOINT=$graphQlEndpoint
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_ADFS_CLIENT_ID=$adfsClientId
REACT_APP_ADFS_TENANT_ID=$adfsTenantId
REACT_APP_SURVEY_MAX_FILE_SIZE_BYTES=1048576
REACT_APP_JOB_STATUS_FINISH_IDS=[3]
"@
}

New-Item -Path $script:InstallPath -ItemType Directory -Force | Out-Null

$nginxVersion = Get-HelperAppIfNotExists -Url $NginxUrl -targetLocation $script:InstallPath
Install-NginxFiles -nginxVersion $nginxVersion -webSitePath $script:InstallPath -fileContents $envFile -rootDir $rootDir -nginxPort $nginxPort

New-DotEnvFile -appPath "$script:InstallPath\$nginxVersion\$rootDir" -fileContents $envFile

# NGINX will be mapped to a different port and redirect thru ARR Reverse Proxy in the web.config.
$winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl -targetLocation $script:InstallPath
Install-NginxService -nginxVersion $nginxVersion -winSwVersion $winSwVersion -webSitePath $script:InstallPath -app $app

Write-Host "End Ed-Fi Buzz $($script:app) installation." -ForegroundColor Yellow

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
  [string] $nginxPort,
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

Import-Module "$PSScriptRoot/init.psm1" -Force
Import-Module "$PSScriptRoot/Buzz-App-Install.psm1" -Force
Initialize-Installer -toolsPath $toolsPath  -packagesPath $packagesPath

Write-Host "Begin Ed-Fi Buzz $($script:app) installation..." -ForegroundColor Yellow

$envFile = ""

if ("google" -eq $idProvider) {
  $envFile = @"
/*
* SPDX-License-Identifier: Apache-2.0
* Licensed to the Ed-Fi Alliance under one or more agreements.
* The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
* See the LICENSE and NOTICES files in the project root for more information.
*/
PORT=$port
REACT_APP_GQL_ENDPOINT=$graphQlEndpoint
REACT_APP_URI_DISCOVERY=https://accounts.google.com/.well-known/openid-configuration
REACT_APP_GOOGLE_CLIENT_ID=$googleClientId
REACT_APP_ADFS_CLIENT_ID=
REACT_APP_ADFS_TENANT_ID=
REACT_APP_SURVEY_MAX_FILE_SIZE_BYTES=1048576
REACT_APP_JOB_STATUS_FINISH_IDS=[3]
#REACT_APP_EXTERNAL_LOGO: if false, you must copy images into assets folder.
REACT_APP_EXTERNAL_LOGO=$externalLogo
REACT_APP_LOGO=$logo
REACT_APP_LOGO_WIDTH=$logoWidth
REACT_APP_TITLE=$title
REACT_APP_TITLE_LOGO=$titleLogo
REACT_APP_TITLE_LOGO_WIDTH=$titleLogoWidth
REACT_APP_TITLE_LOGO_HEIGHT=$titleLogoHeight


"@
}
else {
  $envFile = @"
/*
* SPDX-License-Identifier: Apache-2.0
* Licensed to the Ed-Fi Alliance under one or more agreements.
* The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
* See the LICENSE and NOTICES files in the project root for more information.
*/
PORT=$port
REACT_APP_GQL_ENDPOINT=$graphQlEndpoint
REACT_APP_URI_DISCOVERY=https://login.microsoftonline.com/common/.well-known/openid-configuration
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_ADFS_CLIENT_ID=$adfsClientId
REACT_APP_ADFS_TENANT_ID=$adfsTenantId
REACT_APP_SURVEY_MAX_FILE_SIZE_BYTES=1048576
REACT_APP_JOB_STATUS_FINISH_IDS=[3]
#REACT_APP_EXTERNAL_LOGO: if false, you must copy images into assets folder.
REACT_APP_EXTERNAL_LOGO=$externalLogo
REACT_APP_LOGO=$logo
REACT_APP_LOGO_WIDTH=$logoWidth
REACT_APP_TITLE=$title
REACT_APP_TITLE_LOGO=$titleLogo
REACT_APP_TITLE_LOGO_WIDTH=$titleLogoWidth
REACT_APP_TITLE_LOGO_HEIGHT=$titleLogoHeight
"@
}

try {
  New-Item -Path $script:InstallPath -ItemType Directory -Force | Out-Null

  $nginxVersion = Get-HelperAppIfNotExists -Url $NginxUrl -targetLocation $script:InstallPath
  Install-NginxFiles -nginxVersion $nginxVersion -webSitePath $script:InstallPath -fileContents $envFile -rootDir $rootDir -nginxPort $nginxPort

  New-DotEnvFile -appPath "$script:InstallPath\$nginxVersion\$rootDir" -fileContents $envFile

  # NGINX will be mapped to a different port and redirect thru ARR Reverse Proxy in the web.config.
  $winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl -targetLocation $script:InstallPath
  Install-NginxService -nginxVersion $nginxVersion -winSwVersion $winSwVersion -webSitePath $script:InstallPath -app $app

  Write-Host "End Ed-Fi Buzz $($script:app) installation." -ForegroundColor Yellow

}
catch {
  Write-Host $_
  Write-Host $_.ScriptStackTrace
  Write-Host "EdFi Buzz ui install failed."
}

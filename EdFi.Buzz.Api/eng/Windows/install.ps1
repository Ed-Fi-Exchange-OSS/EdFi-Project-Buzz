# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

[CmdletBinding()]
param(
  [string]
  $InstallPath = "C:\Ed-Fi\Buzz",

  [string]
  $NginxUrl = "http://nginx.org/download/nginx-1.19.0.zip",

  [string]
  $WinSWUrl = "https://github.com/winsw/winsw/releases/download/v2.9.0/WinSW.NETCore31.zip",

  [string]
  $DbServer = "localhost",

  [int]
  $DbPort = 5432,

  [string]
  $DbUserName = "postgres",

  [string]
  [Parameter(Mandatory=$true)]
  $DbPassword,

  [string]
  $DbName = "Buzz",

  [int]
  $port = 3000,
  [Parameter(Mandatory = $true)]
  [string] $toolsPath,
  [Parameter(Mandatory = $true)]
  [string] $packagesPath,
  [Parameter(Mandatory = $true)]
  [string] $nginxPort,
  [Parameter(Mandatory = $true)]
  [string] $rootDir = "dist",
  [Parameter(Mandatory = $true)]
  [string] $app = "UI"
)

Import-Module "$PSScriptRoot/init.psm1" -Force
Initialize-Installer -toolsPath $toolsPath  -packagesPath $packagesPath

function Get-FileNameWithoutExtensionFromUrl {
  param(
    [string]
    $Url
  )

  if (($Url -match "([a-zA-Z0-9\.\-]+)\.zip")) {
    return $Matches[1];
  }

  throw "Unable to parse file name from $Url"
}

function Get-HelperAppIfNotExists {
  param(
    [string]
    $Url,
    [string]
    $targetLocation
  )
  $version = Get-FileNameWithoutExtensionFromUrl -Url $Url

  if (-not (Test-Path -Path "$targetLocation\$version")) {
    $outFile = ".\$version.zip"
    Invoke-WebRequest -Uri $Url -OutFile $outFile

    Expand-Archive -Path $outFile

    if ((Test-Path -Path "$version\$version")) {
      Move-Item -Path "$version\$version" -Destination $targetLocation
      Remove-Item -Path $version
    }
    else {
      Move-Item -Path "$version" -Destination $targetLocation
    }
  }

  return $version
}
function Install-NginxFiles {
  param(
    [string]
    $nginxVersion,
    [string]
    $webSitePath
  )

  # Copy the build directory into the NGiNX folder
  $parameters = @{
    Path        = "$webSitePath\$rootDir"
    Destination = "$webSitePath\$nginxVersion\$rootDir"
    Recurse     = $true
    Force       = $true
  }
  Copy-Item @parameters

  Update-NginxConf -installPath $iisParams.WebApplicationPath

  # Overwrite the NGiNX conf file with our conf file
  $paramaters = @{
    Path        = "$webSitePath\nginx.conf"
    Destination = "$webSitePath\$nginxVersion\conf\nginx.conf"
    Force       = $true
  }
  Copy-Item @paramaters
}

function Install-NginxService {
  param(
    [string]
    $nginxVersion,

    [string]
    $winSwVersion,
    [string]
    $webSitePath
  )

  $serviceName = "EdFi-Buzz-$script:app"

  # If service already exists, stop and remove it so that new settings
  # will be applied.
  $exists = Get-Service -name $serviceName -ErrorAction SilentlyContinue

  if ($exists) {
    Stop-Service -name $serviceName
    &sc.exe delete $serviceName
  }

  # Rename WindowsService.exe to EdFiBuzzUi.exe
  $winServiceExe = "$webSitePath\$winSwVersion\WindowsService.exe"
  $edFiBuzzExe = "$webSitePath\$winSwVersion\EdFiBuzz$($script:app).exe"
  if ((Test-Path -Path "$webSitePath\$winSwVersion\WindowsService.exe")) {
    Move-Item -Path $winServiceExe -Destination $edFiBuzzExe
  }

  # Copy the config XML file to install directory
  $xmlFile = "$webSitePath\$winSwVersion\EdFiBuzz$($script:app).xml"
  Copy-Item -Path "$PSScriptRoot\EdFiBuzz$($script:app).xml" -Destination $xmlFile -Force

  # Inject the correct path to nginx.exe into the config XML file
  $content = Get-Content -Path $xmlFile -Encoding UTF8
  $content = $content.Replace("{0}", "$webSitePath\$nginxVersion")
  $content | Out-File -FilePath $xmlFile -Encoding UTF8 -Force

  # Create and start the service
  &$edFiBuzzExe install
  &$edFiBuzzExe start
}

function New-DotEnvFile {

  param(
    [string]
    $installPath
  )

  New-Item -Path "$installPath/.env" -ItemType File -Force | Out-Null

  $fileContents = @"
BUZZ_API_DB_HOST = '$DbServer'
BUZZ_API_DB_PORT = $DbPort
BUZZ_API_DB_USERNAME ='$DbUserName'
BUZZ_API_DB_PASSWORD = '$DbPassword'
BUZZ_API_DB_DATABASE = '$DbName'
BUZZ_API_HTTP_PORT = $port
"@

  $fileContents | Out-File "$InstallPath\.env" -Encoding UTF8 -Force
}

function Update-WebConfig {
  param(
    [string]
    $installPath,
    [string]
    $nginxPort
  )

  $fileContents = (Get-Content -Path "$installPath/web.config" -Encoding UTF8).Replace("%NGINXPORT%", $script:nginxPort)
  $fileContents | Out-File "$installPath/web.config" -Encoding UTF8 -Force
}

function Update-NginxConf {
  param(
    [string]
    $installPath
  )

  $fileContents = (Get-Content -Path "$installPath/nginx.conf" -Encoding UTF8)
  $fileContents = $fileContents.Replace("%NGINXPORT%", $script:nginxPort)
  $fileContents = $fileContents.Replace("%WEBROOT%", "./$script:rootDir")
  $fileContents = $fileContents.Replace("`r`n", "`n")
  $nginxFile = Resolve-Path("$installPath/nginx.conf")
  [IO.File]::WriteAllText($nginxFile, $fileContents) # prevents final CR-LF
}


function Install-DistFiles {
  param(
    [string]
    $installPath
  )

  # Copy the build directory into the NGiNX folder
  $parameters = @{
    Path        = "$PSScriptRoot/../$rootDir"
    Destination = "$installPath"
    Recurse     = $true
    Force       = $true
  }
  Copy-Item @parameters
}

Write-Host "Begin Ed-Fi Buzz $($script:app) installation..." -ForegroundColor Yellow

$iisParams = @{
  SourceLocation = "$PSScriptRoot\.."
  WebApplicationPath = "C:\inetpub\Ed-Fi\Buzz\API"
  WebApplicationName = "BuzzAPI"
  WebSitePort = $configuration.ui.port
  WebSiteName = "Ed-Fi-Buzz-API"
}

New-Item -Path $iisParams.WebApplicationPath -ItemType Directory -Force | Out-Null

Install-DistFiles -installPath $InstallPath
New-DotEnvFile -installPath  "$InstallPath/dist"

Install-EdFiApplicationIntoIIS @iisParams

$nginxVersion = Get-HelperAppIfNotExists -Url $NginxUrl -targetLocation $iisParams.WebApplicationPath
Install-NginxFiles -nginxVersion $nginxVersion -webSitePath $iisParams.WebApplicationPath

Update-WebConfig -installPath $iisParams.WebApplicationPath

# NGINX will be mapped to a different port and redirect thru ARR Reverse Proxy in the web.config.
$winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl -targetLocation $iisParams.WebApplicationPath
Install-NginxService -nginxVersion $nginxVersion -winSwVersion $winSwVersion -webSitePath $iisParams.WebApplicationPath

Write-Host "End Ed-Fi Buzz $($script:app) installation." -ForegroundColor Yellow

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

  [string] $schema = "buzz",
  [string] $uriDiscovery,
  [string] $googleClientID,
  [string] $clientSecret,
  [string] $googleAuthCallback,
  [string] $surveyFilesFolder,
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

function Install-NpmPackages {
  [CmdletBinding()]
  param (
      [Parameter(Mandatory=$true)]
      [string]
      $appPath
  )
  try {
    Write-Host "Installing NPM packages..." -ForegroundColor Green
    Push-Location $appPath
    npm install --production --silent
  } catch {
    Write-Error "Error on npm install"
    Write-Error $PSItem.Exception.Message
    Write-Error $PSItem.Exception.StackTrace
  }
  finally {
    Pop-Location
  }
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

  Install-NpmPackages -appPath "$webSitePath\$nginxVersion\$rootDir"

  New-DotEnvFile -installPath "$webSitePath\$nginxVersion\$rootDir"

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
NODE_TLS_REJECT_UNAUTHORIZED='1'
BUZZ_API_DB_HOST = '$DbServer'
BUZZ_API_DB_PORT = $DbPort
BUZZ_API_DB_USERNAME ='$DbUserName'
BUZZ_API_DB_PASSWORD = '$DbPassword'
BUZZ_API_DB_DATABASE = '$DbName'
BUZZ_API_HTTP_PORT = $port
BUZZ_API_DB_SCHEMA = '$schema'
BUZZ_WORKER_JOB_NAME = 'buzzSurvey'
BUZZ_WORKER_CLEANUP_JOB_NAME = 'buzzCleanUp'
URI_DISCOVERY = $uriDiscovery
GOOGLE_CLIENT_ID= $googleClientID
GOOGLE_SECRET = $clientSecret
GOOGLE_AUTH_CALLBACK= $googleAuthCallback
SURVEY_FILES_FOLDER=$surveyFilesFolder
SURVEY_FILES_RETENTION_DAYS=30
SURVEY_PROCESS_INITIAL_STATUS_KEY=1
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
  WebApplicationPath = "C:\inetpub\Ed-Fi\Buzz-$script:app"
  WebApplicationName = "Buzz$script:app"
  WebSitePort = $configuration.api.port
  WebSiteName = "Ed-Fi-Buzz-API"
}

New-Item -Path $iisParams.WebApplicationPath -ItemType Directory -Force | Out-Null

Install-EdFiApplicationIntoIIS @iisParams

$nginxVersion = Get-HelperAppIfNotExists -Url $NginxUrl -targetLocation $iisParams.WebApplicationPath
Install-NginxFiles -nginxVersion $nginxVersion -webSitePath $iisParams.WebApplicationPath

Update-WebConfig -installPath $iisParams.WebApplicationPath

# NGINX will be mapped to a different port and redirect thru ARR Reverse Proxy in the web.config.
$winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl -targetLocation $iisParams.WebApplicationPath
Install-NginxService -nginxVersion $nginxVersion -winSwVersion $winSwVersion -webSitePath $iisParams.WebApplicationPath

Write-Host "End Ed-Fi Buzz $($script:app) installation." -ForegroundColor Yellow

# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

$npm = "C:\Program Files\nodejs\npm.cmd"

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

function New-DotEnvFile {
    param(
        [string]
        $appPath,
        [string] $fileContents
    )

    New-Item -Path "$appPath/.env" -ItemType File -Force | Out-Null

    $fileContents | Out-File "$appPath\.env" -Encoding UTF8 -Force
}

function Install-NpmPackages {
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $appPath
    )
    try {
        Write-Host "Installing NPM packages..." -ForegroundColor Green
        Push-Location $appPath
        & $script:npm install --production --silent
    }
    catch {
        Write-Error "Error on npm install"
        Write-Error $PSItem.Exception.Message
        Write-Error $PSItem.Exception.StackTrace
    }
    finally {
        Pop-Location
    }
}

function Install-NginxService {
    param(
        [string]
        $nginxVersion,
        [string]
        $winSwVersion,
        [string]
        $webSitePath,
        [string]
        $app
    )

    $serviceName = "EdFi-Buzz-$($app)"

    # If service already exists, stop and remove it so that new settings
    # will be applied.
    $exists = Get-Service -name $serviceName -ErrorAction SilentlyContinue

    if ($exists) {
        Stop-Service -name $serviceName
        &sc.exe delete $serviceName
    }

    # Rename WindowsService.exe to EdFiBuzzUi.exe
    $winServiceExe = "$webSitePath\$winSwVersion\WindowsService.exe"
    $edFiBuzzExe = "$webSitePath\$winSwVersion\EdFiBuzz$($app).exe"
    if ((Test-Path -Path "$webSitePath\$winSwVersion\WindowsService.exe")) {
        Move-Item -Path $winServiceExe -Destination $edFiBuzzExe
    }

    # Copy the config XML file to install directory
    $xmlFile = "$webSitePath\$winSwVersion\EdFiBuzz$($app).xml"
    Copy-Item -Path "$PSScriptRoot\EdFiBuzz$($app).xml" -Destination $xmlFile -Force

    # Inject the correct path to nginx.exe into the config XML file
    $content = Get-Content -Path $xmlFile -Encoding UTF8
    $content = $content.Replace("{0}", "$webSitePath\$nginxVersion")
    $content | Out-File -FilePath $xmlFile -Encoding UTF8 -Force

    # Create and start the service
    &$edFiBuzzExe install
    &$edFiBuzzExe start
}

function Install-NginxFiles {
    param(
        [string]
        $nginxVersion,
        [string]
        $webSitePath,
        [string]
        $fileContents,
        [string]
        $nginxPort,
        [string]
        $rootDir
    )

    # Copy the build directory into the NGiNX folder
    $parameters = @{
        Path        = "$PSScriptRoot\..\$rootDir"
        Destination = "$webSitePath\$nginxVersion\$rootDir"
        Recurse     = $true
        Force       = $true
    }
    Copy-Item @parameters

    Update-NginxConf -sourcePath "$($PSScriptRoot)\..\" -appPath "$webSitePath\$nginxVersion\conf" -rootDir $rootDir -nginxPort $nginxPort

    Install-NpmPackages -appPath "$webSitePath\$nginxVersion\$rootDir"

}

function Update-WebConfig {
    param(
        [string]
        $appPath,
        [string]
        $nginxPort
    )

    $fileContents = (Get-Content -Path "$appPath/web.config" -Encoding UTF8).Replace("%NGINXPORT%", $nginxPort)
    $fileContents | Set-Content "$appPath/web.config"
}

function Update-NginxConf {
    param(
        [string]
        $appPath,
        [string]
        $sourcePath,
        [string]
        $nginxPort,
        [string]
        $rootDir
    )

    $fileContents = (Get-Content -Path "$sourcePath/nginx.conf" -Encoding UTF8)
    $fileContents = $fileContents.Replace("%NGINXPORT%", $nginxPort)
    $fileContents = $fileContents.Replace("%WEBROOT%", "./$rootDir")
    $nginxFile = Resolve-Path("$appPath/nginx.conf")
    $fileContents | Set-Content $nginxFile
}

$variables = @(
    "npm"
)

$functions = @(
    "Get-FileNameWithoutExtensionFromUrl"
    "Get-HelperAppIfNotExists"
    "New-DotEnvFile"
    "Install-NpmPackages"
    "Install-NginxFiles"
    "Update-WebConfig"
    "Update-NginxConf"
)

Export-ModuleMember -Variable $variables -Function $functions

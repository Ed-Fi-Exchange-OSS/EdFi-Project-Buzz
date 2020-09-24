# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

<#
.SYNOPSIS
This script uninstalls Ed-Fi Buzz apps.

.DESCRIPTION
Requires administrator privileges.

.PARAMETER configPath
Full path to a JSON document containing configuration settings
for Buzz. Defaults to .\configuration.json in the same directory.

.EXAMPLE
.\uninstall.ps1
.EXAMPLE
.\uninstall.ps1 -configPath c:/different/location/for/configuration.json
#>

#Requires -Version 5
#Requires -RunAsAdministrator

param (
    [string] $configPath = "./configuration.json"
)

$currDir = $PWD

Import-Module "$currDir/configHelper.psm1" -Force
Import-Module "$currDir/Application/appuninstalls.psm1" -Force

# Confirm required parameters to install
# Repo location should be configuration with overrides
# Each NuGet should be retrieveable using NuGet.executable
$conf = Format-BuzzConfigurationFileToHashTable $configPath

$installPath = $conf.installPath

try {
    Uninstall-BuzzApp -app "Database" -appPath "C:\Ed-Fi\Buzz\Database"
    Uninstall-BuzzApp -app "ETL" -appPath "C:\Ed-Fi\Buzz\ETL"
    Uninstall-BuzzApp -app "API" -appPath "C:\inetpub\Ed-Fi\Buzz\API"
    Uninstall-BuzzApp -app "UI" -appPath "C:\inetpub\Ed-Fi\Buzz\UI"
}
catch {
    Write-Error $PSItem.Exception.Message
    Write-Error $PSItem.Exception.StackTrace
    throw;
}

exit;

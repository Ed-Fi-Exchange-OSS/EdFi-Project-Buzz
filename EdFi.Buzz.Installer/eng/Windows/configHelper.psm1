# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.


<#
# Feature originally resolved in Ed-Fi-ODS-Deploy
# https://github.com/Ed-Fi-Alliance/Ed-Fi-ODS-Deploy/blob/master-v3/src/Tech%20Suite/Powershell/confighelper.psm1
#>

function Convert-PsObjectToHashTable {
    param (
        $objectToConvert
    )

    $hashTable = @{}

    $objectToConvert.psobject.properties | ForEach-Object { $hashTable[$_.Name] = $_.Value }

    return $hashTable
}

function Format-BuzzConfigurationFileToHashTable {
    param (
        [string] $configPath
    )

    $ErrorActionPreference = "Stop"

    $configJson = Get-Content $configPath | ConvertFrom-Json

    $formattedConfig = @{
        installPath = $configJson.installPath
        toolsPath = $configJson.toolsPath
        packagesPath = $configJson.packagesPath
        artifactRepo = $configJson.artifactRepo
        installDatabase = $configJson.installDatabase
        installEtl = $configJson.installEtl
        installUi = $configJson.installUi
        installApi = $configJson.installApi
        idProvider= $configJson.idProvider
        clientSecret = $configJson.clientSecret
        googleClientId = $configJson.googleClientId
        adfsClientId = $configJson.adfsClientId
        adfsTenantId = $configJson.adfsTenantId
        loadSampleData = $configJson.loadSampleData

        anyApplicationsToInstall = $configJson.installDatabase -or $configJson.installEtl -or $configJson.installApi -or $configJson.installUi
        postgresDatabase = Convert-PsObjectToHashTable $configJson.postgresDatabase
        sqlServerDatabase = Convert-PsObjectToHashTable $configJson.sqlServerDatabase
        database = Convert-PsObjectToHashTable $configJson.database
        etl = Convert-PsObjectToHashTable $configJson.etl
        api = Convert-PsObjectToHashTable $configJson.api
        ui = Convert-PsObjectToHashTable $configJson.ui
    }

    return $formattedConfig
}

$functions = @(
    "Format-BuzzConfigurationFileToHashTable"
)

Export-ModuleMember -Function $functions

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

<#
 # Converts a configuration.json file of known items into a hashtable
 #>
function Format-BuzzConfigurationFileToHashTable {
    param (
        [string] $configPath
    )

    $configJson = Get-Content $configPath | ConvertFrom-Json

    $formattedConfig = @{
        <# Example Usages...
        # installDatabases = $configJson.installDatabases
        # anyApplicationsToInstall = $configJson.installDatabases -or $configJson.installAdminApp -or $configJson.installWebApi -or $configJson.installSwaggerUI
        # anyApplicationsToUninstall = $configJson.uninstallAdminApp -or $configJson.uninstallWebApi -or $configJson.uninstallSwaggerUI
        # swaggerUIConfig = Convert-PsObjectToHashTable $configJson.swaggerui
        #>
    }


    <#
    # if ($formattedConfig.installWebApi) {
    #     $expectedWebApiBaseUri = "https://$($env:computername)/Buzz"

        # DO WE NEED?
        # if ([string]::IsNullOrEmpty($formattedConfig.adminAppConfig.odsApi.apiUrl)) {
        #     $formattedConfig.adminAppConfig.odsApi.apiUrl = $expectedWebApiBaseUri
        # }

        # if ([string]::IsNullOrEmpty($formattedConfig.swaggerUIConfig.swaggerAppSettings.apiMetadataUrl)) {
        #     $formattedConfig.swaggerUIConfig.swaggerAppSettings.apiMetadataUrl = "$expectedWebApiBaseUri/metadata/"
        # }

        # if ([string]::IsNullOrEmpty($formattedConfig.swaggerUIConfig.swaggerAppSettings.apiVersionUrl)) {
        #     $formattedConfig.swaggerUIConfig.swaggerAppSettings.apiVersionUrl = $expectedWebApiBaseUri
        # }
    }
    #>

    return $formattedConfig
}

Export-ModuleMember Format-BuzzConfigurationFileToHashTable

# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

function Authentication-Configuration-Valid {
    param (
        [string] $idProvider,
        [string] $clientSecret,
        [string] $googleClientId,
        [string] $adfsClientId,
        [string] $adfsTenantId
    )

    if ("google" -eq $idProvider -and $googleClientId -ne $null -and $googleClientId.Trim() -ne "" -and $clientSecret -ne $null -and $clientSecret.Trim() -ne "") {
        return $true;
    }
    elseif ("adfs" -eq $idProvider -and $adfsClientId -ne $null -and $adfsClientId.Trim() -ne "" -and $adfsTenantId -ne $null -and $adfsTenantId.Trim() -ne "") {
        return $true;
    }

    return $false;
}

$functions = @(
    "Authentication-Configuration-Valid"
)

Export-ModuleMember $functions

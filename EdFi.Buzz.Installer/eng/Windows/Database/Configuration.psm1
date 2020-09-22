# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires –Modules SqlServer

function Test-SqlServerConnection {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [hashtable] $configuration
    )
    try {

        if ($configuration.sqlServerDatabase.UseIntegratedSecurity) {
            $connString = "Data Source=$($configuration.sqlServerDatabase.host),$($configuration.sqlServerDatabase.port);Database=$($configuration.sqlServerDatabase.database);Integrated Security=$($configuration.sqlServerDatabase.UseIntegratedSecurity);"
        }
        else {
            $connString = "Data Source=$($configuration.sqlServerDatabase.host),$($configuration.sqlServerDatabase.port);Database=$($configuration.sqlServerDatabase.database);User ID=$($configuration.sqlServerDatabase.username);Password=$($configuration.sqlServerDatabase.password)"
        }

        #Create a SQL connection object
        $conn = New-Object System.Data.SqlClient.SqlConnection $connString

        #Attempt to open the connection
        $conn.Open()
        if ($conn.State -eq "Open") {
            # We have a successful connection here
            # Notify of successful connection
            Write-Host "Test connection successful"
            $conn.Close()
            return $true
        }
        return $false
    }
    catch {
        return $false
    }
}

function Assert-DatabaseConnectionInfo {
    <#
    .EXAMPLE
        PS c:\> $table = @{
            Engine = "PostgreSQL"
            Server = "myserver"
            Port = 5430
            UseIntegratedSecurity = $false
            Username = "postgres"
            Password = $null
        }
        PS c:\> Assert-DatabaseConnectionInfo -DbConnectionInfo $table

        In some cases, database name validation is unnecessary.
    .EXAMPLE
        PS c:\> $table = @{
            Engine = "PostgreSQL"
            Server = "myserver"
            Port = 5430
            UseIntegratedSecurity = $false
            Username = "postgres"
            Password = $null
            DatabaseName = "EdFi_Admin"
        }
        PS c:\> Assert-DatabaseConnectionInfo -DbConnectionInfo $table - RequireDatabaseName

        In other cases, the database name needs to be validated as well.
    #>
    [CmdletBinding()]
    Param(
        [hashtable]
        $DbConnectionInfo,

        [switch]
        $RequireDatabaseName
    )
    $template = "Database connection info is missing key: "

    if (-not $DbConnectionInfo.ContainsKey("Engine")) {
        $DbConnectionInfo.Engine = "SqlServer"
    }

    if (-not $DbConnectionInfo.Engine.toLower -in ("sqlserver", "postgresql", "postgres")) {
        throw "Database connection info specifies an invalid engine: $($DbConnectionInfo.Engine). " +
        "Valid engines: SqlServer, PostgreSQL"
    }

    if (-not $DbConnectionInfo.ContainsKey("Port")) {
        throw $template + "Port"
    }

    if (-not $DbConnectionInfo.ContainsKey("Server")) {
        throw $template + "Server"
    }

    if (-not $DbConnectionInfo.ContainsKey("UseIntegratedSecurity")) {
        if (-not $DbConnectionInfo.ContainsKey("Username")) {
            throw $template + "Username"
        }
        if ("sqlserver" -ieq $DbConnectionInfo.Engine) {
            if (-not $DbConnectionInfo.ContainsKey("Password")) {
                throw $template + "Password"
            }
        }
    }

    if ($RequireDatabaseName) {
        if (-not $DbConnectionInfo.ContainsKey("DatabaseName")) {
            throw $template + "DatabaseName"
        }
    }
}

$functions = @(
    "Test-SqlServerConnection",
    "Assert-DatabaseConnectionInfo"
)

Export-ModuleMember $functions

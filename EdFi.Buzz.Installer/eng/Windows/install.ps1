# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -Version 5
#Requires -RunAsAdministrator

param (
    [string] $configPath = "$PSScriptRoot\configuration.json"
)

Import-Module "$PSScriptRoot\Database\Configuration.psm1" -Force
Import-Module "$PSScriptRoot\configHelper.psm1" -Force
Import-Module "$PSScriptRoot\init.psm1" -Force

# Test for IIS and any Windows Features we will need TODO WHAT DO WE NEED
# Initialize-Installer

# Confirm required parameters to install
# Repo location should be configuration with overrides
# Each NuGet should be retrieveable using NuGet.executable
$conf = Format-BuzzConfigurationFileToHashTable $configPath

# Test the connection strings for SQL Server
$sqlServer = @{
    Engine = "SqlServer"
    Server = $conf.sqlServerDatabase.host
    Port = $conf.sqlServerDatabase.port
    UseIntegratedSecurity = $false # TODO SUPPORT INTEGRATED SECURITY IN ETL
    Username = $conf.sqlServerDatabase.username
    Password = $conf.sqlServerDatabase.password
    DatabaseName = $conf.sqlServerDatabase.database
}
Assert-DatabaseConnectionInfo $sqlServer -RequireDatabaseName


# Test the connection strings for PostgreSQL
$postgres = @{
    Engine = "PostgreSQL"
    Server = $conf.postgresDatabase.host
    Port = $conf.postgresDatabase.port
    UseIntegratedSecurity = $false # TODO SUPPORT INTEGRATED SECURITY IN ETL
    Username = $conf.postgresDatabase.username
    Password = $conf.postgresDatabase.password
    DatabaseName = $conf.postgresDatabase.database
}

Assert-DatabaseConnectionInfo $postgres -RequireDatabaseName

# Install Buzz Database - downloads and executes the database install script

# Install API - downloads the parameterized version (latest as default) and executes the API install script

# Install ETL - downloads the parameterized version (latest as default) and executes the ETL install script

# Install UI - downloads the parameterized version (latest as default) and executes the UI install script

# Verify all services are running

exit $LASTEXITCODE;

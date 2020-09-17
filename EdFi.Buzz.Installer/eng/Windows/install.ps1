# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -Version 5
#Requires -RunAsAdministrator

param (
    [string] $configPath = "$PSScriptRoot\configuration.json"
)

$ErrorActionPreference = "Stop"



# Confirm required parameters to install
# Repo location should be configuration with overrides
# Each NuGet should be retrieveable using NuGet.executable

# Verify we are an administrator on the machine

# Test the connection strings for SQL Server

# Test the connection strings for PostgreSQL

# Test for IIS and any Windows Features we will need

# Install Buzz Database - downloads and executes the database install script

# Install API - downloads the parameterized version (latest as default) and executes the API install script

# Install ETL - downloads the parameterized version (latest as default) and executes the ETL install script

# Install UI - downloads the parameterized version (latest as default) and executes the UI install script

# Verify all services are running

$packageRepository


$databasePackage

return 0;

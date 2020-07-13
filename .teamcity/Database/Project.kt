// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package database

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object DatabaseProject : Project({
    id("FixItFriday_Database")
    name = "Database"
    description = "Fix-it-Friday Database"

    buildType(database.buildTypes.PullRequestDatabaseBuild)
    buildType(database.buildTypes.BranchDatabaseBuild)
    // Not ready for deploy yet
    // buildType(database.buildTypes.DeployDatabaseBuild)

    params{
        param("project.directory", "./edfi.fif.database");
        param("octopus.release.version","<placeholder value>")
        param("octopus.release.project", "Fix-it-Friday Database")
        param("octopus.project.id", "Projects-111")
        // Include the root - giving us license, notices.md, and .teamcity.
        // Then exclude the other projects.
        param("vcs.checkout.rules","""
            +:.teamcity => .teamcity
            +:%project.directory% => %project.directory%
        """.trimIndent())
    }
})

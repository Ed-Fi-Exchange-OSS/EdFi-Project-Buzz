// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package etl

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object ETLProject : Project({
    id("Buzz_ETL")
    name = "ETL"
    description = "Buzz ETL"

    buildType(etl.buildTypes.PullRequestETLBuild)
    buildType(etl.buildTypes.BranchETLBuild)
    buildType(etl.buildTypes.DeployETLBuild)

    params{
        param("project.directory", "./EdFi.Buzz.Etl");
        param("octopus.release.version","<placeholder value>")
        param("octopus.release.project", "Buzz ETL")
        param("octopus.project.id", "Projects-111")
        param("vcs.checkout.rules","""
            +:.teamcity => .teamcity
            +:%project.directory% => %project.directory%
        """.trimIndent())
    }
})

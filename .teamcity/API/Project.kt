// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package api

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object APIProject : Project({
    id("Buzz_API")
    name = "API"
    description = "Buzz API"

    buildType(api.buildTypes.PullRequestAPIBuild)
    buildType(api.buildTypes.BranchAPIBuild)
    buildType(api.buildTypes.DeployAPIBuild)

    params{
        param("project.directory", "./EdFi.Buzz.Api");
        param("vcs.checkout.rules","""
            +:.teamcity => .teamcity
            +:%project.directory% => %project.directory%
        """.trimIndent())
    }
})

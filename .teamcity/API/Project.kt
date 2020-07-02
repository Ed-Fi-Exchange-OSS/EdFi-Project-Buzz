// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package api

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object APIProject : Project({
    id("FixItFriday_API")
    name = "API"
    description = "Fix-it-Friday API"

    buildType(api.buildTypes.PullRequestAPIBuild)
    buildType(api.buildTypes.BranchAPIBuild)
    buildType(api.buildTypes.DeployAPIBuild)

    params{
        param("project.directory", "./edfi.fif.api");
        param("octopus.release.version","<placeholder value>")
        param("octopus.release.project", "Fix-it-Friday API")
        param("octopus.project.id", "Projects-111")
        param("vcs.checkout.rules","""
            +:.teamcity => .teamcity
            +:%project.directory% => %project.directory%
        """.trimIndent())
    }
})

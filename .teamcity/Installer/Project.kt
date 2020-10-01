// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package installer

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object InstallerProject : Project({
    id("Buzz_Installer")
    name = "Installer"
    description = "Buzz App Installer"

    buildType(installer.buildTypes.BranchInstallerBuild)
    buildType(installer.buildTypes.DeployInstallerBuild)
    buildType(installer.buildTypes.PullRequestInstallerBuild)

    params{
        param("project.directory", "./EdFi.Buzz.Installer");
        param("octopus.release.version","<placeholder value>")
        param("octopus.release.project", "Project Buzz")
        param("octopus.project.id", "Projects-112")
        param("vcs.checkout.rules","""
            +:.teamcity => .teamcity
            +:%project.directory% => %project.directory%
        """.trimIndent())
    }
})

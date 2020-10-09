// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package _self

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object BuzzProject : Project({
    description = "Buzz Build Configurations"

    params {
        param("version.major","0")
        param("version.minor","1")
        param("version.patch","0")
        param("version.prerelease.prefix","-pre")
        param("version.prerelease.suffix","%build.counter%".padStart(4, '0'))
        param("version","%version.core%%version.prerelease.prefix%%version.prerelease.suffix%")
        param("octopus.release.version","%version.core%%version.prerelease.prefix%%version.prerelease.suffix%")
        param("version.core","%version.major%.%version.minor%.%version.patch%")
        param("nupkg.version","")
        param("teamcity.ui.settings.readOnly","true")
        param("build.feature.freeDiskSpace", "2gb")
        param("git.branch.default", "main")
        param("git.branch.specification", """
            refs/heads/(*)
            refs/(pull/*)/head
        """.trimIndent())
        param("octopus.deploy.timeout", "00:45:00")
        param("octopus.release.environment", "Integration")
        param("node.version", "12.13.0")
    }

    subProject(ui.UIProject)
    subProject(etl.ETLProject)
    subProject(api.APIProject)
    subProject(installer.InstallerProject)
    subProject(database.DatabaseProject)

    template(_self.templates.BuildAndTestTemplate)
    template(_self.templates.PullRequestTemplate)
    template(_self.templates.BuildOnlyTemplate)
    template(_self.templates.BuildOnlyPullRequestTemplate)
    template(_self.templates.PsPullRequestTemplate)
    template(_self.templates.PsBuildOnlyTemplate)

})

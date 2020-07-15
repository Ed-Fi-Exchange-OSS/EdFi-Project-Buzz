// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package _self

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object BuzzProject : Project({
    description = "Buzz Build Configurations"

    params {
        param("build.feature.freeDiskSpace", "2gb")
        param("git.branch.default", "development")
        param("git.branch.specification", """
            refs/heads/(*)
            refs/(pull/*)/head
        """.trimIndent())
        param("octopus.deploy.timeout", "00:45:00")
        param("octopus.release.environment", "Integration")
        param("node.version", "12.13.0")
    }

    subProject(ui.UIProject)
    subProject(api.APIProject)
    subProject(angular.AngularProject)
    subProject(database.DatabaseProject)

    template(_self.templates.BuildAndTestTemplate)
    template(_self.templates.PullRequestTemplate)
    template(_self.templates.BuildOnlyTemplate)
    template(_self.templates.BuildOnlyPullRequestTemplate)

})

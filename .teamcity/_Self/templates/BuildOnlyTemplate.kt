// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package _self.templates

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.freeDiskSpace
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs

object BuildOnlyTemplate : BuildBaseClass() {
    init {
        name = "Build Node.js Template"
        id = RelativeId("BuildOnlyTemplate")

        artifactRules = "+:%project.directory%/eng/*.nupkg"

        steps {
            // Additional packaging step to augment the template build
            powerShell {
                name = "Package"
                workingDir = "%project.directory%/eng"
                formatStderrAsError = true
                scriptMode = script {
                    content = """
                        .\build-package.ps1 -BuildCounter %build.counter%
                    """.trimIndent()
                }
            }
        }

        triggers {
            vcs {
                id ="vcsTrigger"
                quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_CUSTOM
                quietPeriod = 120
                branchFilter = "+:<default>"
            }
        }
    }
}

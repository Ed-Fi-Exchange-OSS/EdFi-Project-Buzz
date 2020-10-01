// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package _self.templates

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.freeDiskSpace
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs


object BuildPackagesTemplate : BuildAndTestBaseClass() {
    init {
        name = "Build Packages Template"
        id = RelativeId("BuildPackagesTemplate")

        artifactRules = "+:%project.directory%/eng/*.nupkg"

        option("shouldFailBuildOnAnyErrorMessage", "true")

        steps {
            powerShell {
                name = "Build"
                formatStderrAsError = true
                executionMode = BuildStep.ExecutionMode.RUN_ON_SUCCESS
                scriptMode = script {
                    content = """
                        .\build.ps1 -BuildCounter %build.counter% -Command Build -Version "%adminApp.version%" -BuildConfiguration OnPremisesRelease
                    """.trimIndent()
                }
            }
            powerShell {
                name = "Create NuGet Package"
                formatStderrAsError = true
                executionMode = BuildStep.ExecutionMode.RUN_ON_SUCCESS
                scriptMode = script {
                    content = """
                        .\build.ps1 -Version %adminApp.version% -BuildCounter %build.counter% -Command Package -BuildConfiguration OnPremisesRelease
                    """.trimIndent()
                }
            }
        }

        triggers {
            vcs {
                id ="vcsTrigger"
                quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_CUSTOM
                quietPeriod = 120
                branchFilter = "+:FIF-303:<default>"
            }
        }

        features {
            freeDiskSpace {
                id = "jetbrains.agent.free.space"
                requiredSpace = "%build.feature.freeDiskSpace%"
                failBuild = true
            }
            swabra {
                forceCleanCheckout = true
            }
        }
    }
}

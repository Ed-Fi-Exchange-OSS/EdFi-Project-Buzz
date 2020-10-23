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

object PsBuildOnlyTemplate : PsBuildBaseClass() {
    init {
        name = "Build Installer PowerShell Template"
        id = RelativeId("PsBuildOnlyTemplate")

        artifactRules = "+:%project.directory%/eng/*.nupkg"

        steps {
            // Additional packaging step to augment the template build
            powerShell {
                name = "Update versions"
                workingDir = "%project.directory%/eng"
                formatStderrAsError = true
                scriptMode = script {
                    content = """
                    ${'$'}paddedSuffix = "%build.counter%".PadLeft(4,"0")
                    Write-Host "##teamcity[setParameter name='version.prerelease.suffix' value='${'$'}paddedSuffix']"
                    Write-Host "##teamcity[setParameter name='version' value='%version.core%%version.prerelease.prefix%${'$'}paddedSuffix']"
                    Write-Host "##teamcity[setParameter name='octopus.release.version' value='%version.core%%version.prerelease.prefix%${'$'}paddedSuffix']"
                    """.trimIndent()
                }
            }

            powerShell {
                name = "Package"
                workingDir = "%project.directory%/eng"
                formatStderrAsError = true
                scriptMode = script {
                    content = """
                    write-host $( '##teamcity[message text=''version.prerelease.suffix => {0}'']' -f "%version.prerelease.suffix%" )
                    write-host $( '##teamcity[message text=''version => {0}'']' -f "%version%" )
                    write-host $( '##teamcity[message text=''octopus.release.version => {0}'']' -f "%octopus.release.version%" )

                    ${"$"}params = @{
                       "BuildCounter"= "%build.counter%".PadLeft(4,"0")
                       "PrereleasePrefix"= "%version.prerelease.prefix%"
                       "VersionCore" = "%version.core%"
                    }
                    .\build-package.ps1 @params
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

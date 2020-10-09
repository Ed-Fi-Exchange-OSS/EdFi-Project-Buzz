// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package _self.templates

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.freeDiskSpace
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell

open class BuildAndTestBaseClass : BuildBaseClass() {
    init {
        steps {
            powerShell {
                name = "Test"
                workingDir = "%project.directory%"
                formatStderrAsError = true
                scriptMode = script {
                    content = """
                        yarn test:ci
                    """.trimIndent()
                }
            }
            powerShell {
                name = "Style Check"
                workingDir = "%project.directory%"
                formatStderrAsError = true
                scriptMode = script {
                    content = """
                        yarn lint:ci
                    """.trimIndent()
                }
            }
            powerShell {
                name = "Package"
                workingDir = "%project.directory%/eng"
                formatStderrAsError = true
                scriptMode = script {
                    content = """
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
    }
}

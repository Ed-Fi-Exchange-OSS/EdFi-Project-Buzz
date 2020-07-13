// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package _self.templates

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.freeDiskSpace
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell

open class BuildBaseClass : Template({

    option("shouldFailBuildOnAnyErrorMessage", "true")

    vcs {
        root(DslContext.settingsRoot, "%vcs.checkout.rules%")
    }

    steps {
        powerShell {
            name = "Install and Use Correct Version of Node.js"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    nvm install %node.version%
                    nvm use %node.version%
                    Start-Sleep -Seconds 1
                """.trimIndent()
            }
        }
        powerShell {
            name = "Install Packages"
            workingDir = "%project.directory%"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    yarn install
                """.trimIndent()
            }
        }
        powerShell {
            name = "Build"
            workingDir = "%project.directory%"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    yarn build
                """.trimIndent()
            }
        }
    }

    features {
        freeDiskSpace {
            id = "jetbrains.agent.free.space"
            requiredSpace = "%build.feature.freeDiskSpace%"
            failBuild = true
        }
        // Default setting is to clean before next build
        swabra {
        }
    }
})

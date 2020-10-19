// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package installer.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.nuGetFeedCredentials
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.nuGetPublish
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell


object DeployInstallerBuild : BuildType ({
    name = "Deploy"

    params {
        param("octopus.release.version", "${BranchInstallerBuild.depParamRefs["version"]}")
    }

    vcs {
        cleanCheckout = true
    }

    features {
        swabra {
            forceCleanCheckout = true
        }

        nuGetFeedCredentials {
            feedUrl = "%azureArtifacts.feed.nuget%"
            username = "%azureArtifacts.edFiBuildAgent.userName%"
            password = "%azureArtifacts.edFiBuildAgent.accessToken%"
        }
    }

    dependencies {
        snapshot(BranchInstallerBuild) {
            onDependencyFailure = FailureAction.CANCEL
            onDependencyCancel = FailureAction.CANCEL
        }

        artifacts(BranchInstallerBuild) {
            cleanDestination = true
            buildRule = lastSuccessful()
            artifactRules = "+:*-pre*.nupkg"
        }
    }

    steps {
        nuGetPublish {
            name = "Publish NuGet Packages to Azure Artifacts"
            toolPath = "%teamcity.tool.NuGet.CommandLine.DEFAULT%"
            packages = "**/*.nupkg"
            serverUrl = "%azureArtifacts.feed.nuget%"
            apiKey = "%octopus.apiKey%"
            args = "-SkipDuplicate"
        }

        powerShell {
            name = "Create Release and Deploy to Integration"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    Write-Host $( '##teamcity[message text=''octopus.release.version => {0}'']' -f "%octopus.release.version%" )

                    ${"$"}parameters = @(
                        "create-release",
                        "--server=%octopus.server%",
                        "--project=%octopus.release.project%",
                        "--defaultPackageVersion=%octopus.release.version%",
                        "--releaseNumber=%octopus.release.version%",
                        "--deployTo=%octopus.release.environment%"
                        "--deploymenttimeout=%octopus.deploy.timeout%",
                        "--apiKey=%octopus.apiKey%"
                    )
                    octo.exe @parameters

                    exit ${"$"}LASTEXITCODE
                """.trimIndent()
            }
        }
    }

})

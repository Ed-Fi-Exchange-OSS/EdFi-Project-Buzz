// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package database.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.nuGetFeedCredentials
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.nuGetPublish
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell


object DeployDatabaseBuild : BuildType ({
    name = "Deploy"

    features {
        // Default setting is to clean before next build
        swabra {
        }

        nuGetFeedCredentials {
            feedUrl = "%azureArtifacts.feed.nuget%"
            username = "%azureArtifacts.edFiBuildAgent.userName%"
            password = "%azureArtifacts.edFiBuildAgent.accessToken%"
        }
    }

    dependencies {
        artifacts(BranchDatabaseBuild) {
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
    }

})

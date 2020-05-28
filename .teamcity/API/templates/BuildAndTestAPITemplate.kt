package api.templates

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.freeDiskSpace
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dotnetBuild
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dotnetRestore
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dotnetTest


object BuildAndTestAPITemplate : Template({
    name = "Build and Test Fix-it-Friday API"

    option("shouldFailBuildOnAnyErrorMessage", "true")

    vcs {
        // Map the API project as the build root directory.
        root(DslContext.settingsRoot, "+:. => Fix-It-Friday")
    }

    steps {
        dotnetRestore {
            name = "Restore Packages"
            projects = "%src.solutionFile%"
        }
        dotnetBuild {
            name = "Build"
            projects = "%src.solutionFile%"
            configuration = "%dotnet.build.configuration%"
            args = "/p:Version=%version.assembly%"
        }
        dotnetTest {
            name = "Test"
            projects = "%src.solutionFile%"
            configuration = "%dotnet.build.configuration%"
            skipBuild = true
            param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
        }
    }

    features {
        freeDiskSpace {
            id = "jetbrains.agent.free.space"
            requiredSpace = "%build.feature.freeDiskSpace%"
            failBuild = true
        }
    }
})
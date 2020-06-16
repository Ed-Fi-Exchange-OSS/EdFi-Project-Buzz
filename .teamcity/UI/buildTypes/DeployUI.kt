package ui.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.nuGetPublish
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell


object DeployUIBuild : BuildType ({
    name = "Deploy"

    params {
        param("octopus.release.version","<placeholder value>")
        param("octopus.release.project", "Fix-it-Friday UI")
        param("octopus.project.id", "Projects-112")
    }

    features {
        // Default setting is to clean before next build
        swabra {
        }
    }

    dependencies {
        artifacts(BranchUIBuild) {
            buildRule = lastSuccessful()
            artifactRules = "+:*-pre*.nupkg"
        }
    }

    steps {
        nuGetPublish {
            name = "Publish NuGet Packages to Octopus Feed"
            toolPath = "%teamcity.tool.NuGet.CommandLine.DEFAULT%"
            packages = "**/*.nupkg"
            serverUrl = "%octopus.server.nugetFeed%"
            apiKey = "%octopus.apiKey%"
            args = "-SkipDuplicate"
        }
        powerShell {
            name = "Extract release version from NuGet package"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    ${"$"}packages = Get-ChildItem -Path %teamcity.build.checkoutDir% -Filter *pre*.nupkg -Recurse
                    ${"$"}packageName = ${"$"}packages[0].Name
                    ${"$"}packageName -Match "fixitfriday\.ui\.(.+)\.nupkg"
                    ${"$"}packageVersion = ${"$"}Matches[1]
                    Write-Host "##teamcity[setParameter name='octopus.release.version' value='${"$"}packageVersion']"
                """.trimIndent()
            }
        }
        powerShell {
            name = "Create Release and Deploy to Integration"
            formatStderrAsError = true
            scriptMode = script {
                content = """
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

package ui.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs

object BranchUIBuild : BuildType ({
    name = "Branch Build and Test"
    templates(ui.templates.BuildAndTestUITemplate)

    artifactRules = "+:./fixitfriday.ui/eng/*.nupkg"

    features {
        // Default setting is to clean before next build
        swabra {
        }
    }

    steps {
        // Additional packaging step to augment the template build
        powerShell {
            name = "Package"
            id = "BranchUIBuild_Package"
            workingDir = "./fixitfriday.ui/eng"
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
            triggerRules = "+:**"
            branchFilter = "+:<default>"
        }
    }
})

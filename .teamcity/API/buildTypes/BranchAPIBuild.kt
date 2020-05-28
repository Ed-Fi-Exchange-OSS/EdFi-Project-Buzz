package api.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs

object BranchAPIBuild : BuildType ({
    name = "Branch Build, Test, and Package"

    var fixItFridayApiDir = "Fix-It-Friday/FixItFriday.Api"

    artifactRules = "+:$fixItFridayApiDir/dist/*.nupkg"
    
    templates(api.templates.BuildAndTestAPITemplate)

    vcs {
        root(_self.vcsRoots.EdFiOdsImplementation, "+: . => Ed-Fi-ODS-Implementation")
    }

    features {
        // Default setting: clean before next build
        swabra {
        }
    }

    triggers {
        vcs {
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_CUSTOM
            quietPeriod = 120
            triggerRules = """
                +:**
                -:root=${_self.vcsRoots.EdFiOdsImplementation.id}
            """.trimIndent()
            branchFilter = "+:<default>"
        }
    }

    steps {
        // Additional packaging step to augment the template build
        powerShell {
            name = "Package"            
            id = "BranchAPIBuild_Package"
            workingDir = "$fixItFridayApiDir"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    .\build-package.ps1 -Version %version.core% -BuildCounter %build.counter%
                """.trimIndent()
            }
        }
    }
})

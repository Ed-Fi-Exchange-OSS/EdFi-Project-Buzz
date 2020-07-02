package angular.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs

object BranchUIBuild : BuildType ({
    name = "Branch Build and Test"
    templates(_self.templates.BuildAndTestTemplate)

    artifactRules = "+:%project.directory%/eng/*.nupkg"

    steps {
        // Additional packaging step to augment the template build
        powerShell {
            name = "Package"
            id = "BranchUIBuild_Package"
            workingDir = "%project.directory%/eng"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    .\build-package.ps1 -BuildCounter %build.counter%
                """.trimIndent()
            }
        }
    }
})

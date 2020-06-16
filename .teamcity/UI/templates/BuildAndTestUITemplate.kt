package ui.templates

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.freeDiskSpace
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell

object BuildAndTestUITemplate : Template({
    name = "Build and Test Fix-it-Friday UI"

    option("shouldFailBuildOnAnyErrorMessage", "true")

    vcs {
        // Map the API project as the build root directory.
        root(DslContext.settingsRoot, "+:.")
    }

    steps {
        powerShell {
            name = "Install Packages"
            id = "BuildAndTestUITemplate_YarnInstall"
            workingDir = "./fixitfriday.ui"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    yarn install
                """.trimIndent()
            }
        }
        powerShell {
            name = "Build"
            id = "BuildAndTestUITemplate_YarnBuild"
            workingDir = "./fixitfriday.ui"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    yarn build
                """.trimIndent()
            }
        }
        powerShell {
            name = "Test"
            id = "BuildAndTestUITemplate_YarnTest"
            workingDir = "./fixitfriday.ui"
            formatStderrAsError = true
            scriptMode = script {
                content = """
                    yarn test:ci
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
        // For future reference, once linting is built-in. Probably wrong file name.
        // and there might be a TeamCity reporter that doesn't require manual pick-up
        // of the file. If not needed then delete this commented code.
        // feature {
        //     type = "xml-report-plugin"
        //     param("xmlReportParsing.reportType", "jslint")
        //     param("xmlReportParsing.reportDirs", "+:lint.xml")
        // }
    }
})

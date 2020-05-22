package ui.templates

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.freeDiskSpace
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell

object BuildAndTestUITemplate : Template({
    name = "Build and Test Fix-it-Friday UI"

    option("shouldFailBuildOnAnyErrorMessage", "true")

    vcs {
        // To avoid duplicate VCS roots, we don't redefine the vcsroot here in
        // source code. We can access it through "DslContext.settingsRoot".
        
        // Map the UI project as the build root directory.
        root(DslContext.settingsRoot, "+:./fixitfriday.ui => .")
    }

    steps {
        powerShell {
            name = "Install Packages"
            id = "BuildAndTestUITemplate_YarnInstall"
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
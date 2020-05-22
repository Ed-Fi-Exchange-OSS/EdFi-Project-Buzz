package ui.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs

object PullRequestUIBuild : BuildType ({
    name = "Pull Request Build and Test"
    templates(ui.templates.BuildAndTestUITemplate)

    triggers {
        vcs {
            id ="vcsTrigger"
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_CUSTOM
            quietPeriod = 120
            triggerRules = "+:**"
            branchFilter = "+:refs/pull/*/head"
        }
    }

    features {
        commitStatusPublisher {
            id = "BUILD_EXT_45"
            publisher = github {
                githubUrl = "https://api.github.com"
                authType = personalToken {
                    token = "%github.accessToken.protected%"
                }
            }
        }
    }
})

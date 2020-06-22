package _self.templates

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.freeDiskSpace
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.powerShell
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs

object PullRequestTemplate : BuildAndTestBaseClass() {
    init {
        name = "Pull Request Node.js Template"
        id = RelativeId("PullRequestTemplate")

        features {
            commitStatusPublisher {
                publisher = github {
                    githubUrl = "https://api.github.com"
                    authType = personalToken {
                        token = "%github.accessToken%"
                    }
                }
            }
            pullRequests {
                vcsRootExtId = "${DslContext.settingsRoot.id}"
                provider = github {
                    authType = vcsRoot()
                    filterTargetBranch = "+:<default>"
                    filterAuthorRole = PullRequests.GitHubRoleFilter.MEMBER_OR_COLLABORATOR
                }
            }
        }

        triggers {
            vcs {
                id ="vcsTrigger"
                quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_CUSTOM
                quietPeriod = 120
                // This allows triggering on "anything" and then removes
                // triggering on the default branch and in feature branches,
                // thus leaving only the pull requests.
                branchFilter = """
                    +:*
                    -:<default>
                    -:refs/heads
                """.trimIndent()
            }
        }
    }
}

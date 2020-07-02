package _self

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object FixItFridayProject : Project({
    description = "Projects Owned by the Analytics Team"

    params {
        param("build.feature.freeDiskSpace", "2gb")
        param("git.branch.default", "development")
        param("git.branch.specification", """
            refs/heads/(*)
            refs/(pull/*)/head
        """.trimIndent())
        param("octopus.deploy.timeout", "00:45:00")
        param("octopus.release.environment", "Integration")
    }

    subProject(ui.UIProject)
    subProject(api.APIProject)
    subProject(angular.AngularProject)

    template(_self.templates.BuildAndTestTemplate)
    template(_self.templates.PullRequestTemplate)

})

package _self

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.Project

object FixItFridayProject : Project({
    description = "Projects Owned by the ODS Platform Team"

    params {
        param("build.feature.freeDiskSpace", "2gb")
        param("git.branch.default", "development")
        param("git.branch.specification", """
            refs/heads/(*)
            refs/(pull/*)/merge
        """.trimIndent())
        param("octopus.deploy.timeout", "00:45:00")
        param("octopus.release.environment", "Integration")
    }

    subProject(ui.UIProject)

})

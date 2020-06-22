package api

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.Project

object APIProject : Project({
    id("FixItFriday_API")
    name = "API"
    description = "Fix-it-Friday API"

    buildType(api.buildTypes.PullRequestAPIBuild)
    buildType(api.buildTypes.BranchAPIBuild)
    buildType(api.buildTypes.DeployAPIBuild)

    params{
        param("project.directory", "./edfi.fif.api");
        param("octopus.release.version","<placeholder value>")
        param("octopus.release.project", "Fix-it-Friday API")
        param("octopus.project.id", "Projects-111")
        param("vcs.checkout.rules","""
            +:.teamcity => .teamcity
            +:%project.directory% => %project.directory%
        """.trimIndent())
    }
})

package angular

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object AngularProject : Project({
    id("FixItFriday_UI_Angular")
    name = "UI"
    description = "Fix-it-Friday User Interface - Angular"

    buildType(angular.buildTypes.PullRequestUIBuild)
    buildType(angular.buildTypes.BranchUIBuild)

    params{
        param("project.directory", "./fixitfriday.ui.angular");
        param("vcs.checkout.rules","""
        +:.teamcity => .teamcity
        +:%project.directory% => %project.directory%
        """.trimIndent())
    }
})

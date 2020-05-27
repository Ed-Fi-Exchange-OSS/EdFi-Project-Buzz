package api

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.Project

object APIProject : Project({
    id("FixItFriday_API")
    name = "API"
    description = "Fix-it-Friday Web API"

    buildType(api.buildTypes.PullRequestAPIBuild)
    buildType(api.buildTypes.BranchAPIBuild)

    params {
        param("version.major", "0")
        param("version.minor", "1")
        param("version.patch", "0")
        // Presumably there will be a solution file soon, once tests are added
        param("src.solutionFile", "FixItFriday.Api.csproj")
        param("dotnet.build.configuration", "release")
    }

    template(api.templates.BuildAndTestAPITemplate)
})

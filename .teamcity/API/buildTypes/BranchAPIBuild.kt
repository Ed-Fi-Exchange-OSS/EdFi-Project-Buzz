package api.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object BranchAPIBuild : BuildType ({
    name = "Branch Build and Test"
    templates(_self.templates.BuildAndTestTemplate)

})

package _self.vcsRoots

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot

object EdFiOdsImplementation : GitVcsRoot({
    name = "Ed-Fi-ODS-Implementation"
    url = "https://github.com/%github.organization%/Ed-Fi-ODS-Implementation.git"
    branch = "%git.branch.default%"
    userNameStyle = GitVcsRoot.UserNameStyle.NAME
    checkoutSubmodules = GitVcsRoot.CheckoutSubmodules.IGNORE
    serverSideAutoCRLF = true
    useMirrors = false
    authMethod = password {
        userName = "%github.username%"
        password = "%github.accessToken%"
    }
})

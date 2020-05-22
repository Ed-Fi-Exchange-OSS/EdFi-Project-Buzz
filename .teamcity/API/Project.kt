package api

import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.Project

object APIProject : Project({
    id("FixItFriday_API")
    name = "API"
    description = "Fix-it-Friday Web API"
    
    params {        
        param("version.major", "0")
        param("version.minor", "1")
        param("version.patch", "0")
    }
})
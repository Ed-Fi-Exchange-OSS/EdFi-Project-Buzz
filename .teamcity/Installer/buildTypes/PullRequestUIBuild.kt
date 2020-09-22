// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

package installer.buildTypes

import jetbrains.buildServer.configs.kotlin.v2019_2.*

object PullRequestInstallerBuild : BuildType ({
    name = "Pull Request Build and Test"
    templates(_self.templates.PullRequestTemplate)

})

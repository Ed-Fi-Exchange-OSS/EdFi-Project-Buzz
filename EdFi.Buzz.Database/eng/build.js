// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// This build script runs a number of yarn commands in an OS-agnostic fashion
// with the help of Node.js.

const { execSync } = require('child_process');

const steps = [
    'yarn build:clean',
    'yarn synp -s yarn.lock -f',
    'yarn copyfiles package-lock.json package.json database.json migrations/**/* dist',
    'yarn del-cli package-lock.json'
];

steps.forEach((step) => {
    const options = {
        cwd: `${__dirname}/..`,
        windowsHide: true
    };

    try {
        const stdout = execSync(step, options)
        console.log(stdout.toString());
    } catch(err) {
        process.exit(1);
    }
});

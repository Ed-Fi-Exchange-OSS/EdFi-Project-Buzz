// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

module.exports = {
  extends: ["airbnb-typescript-prettier"],
  overrides: [
    {
      files: [
        "**/*.test.js",
        "**/*.test.jsx",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.e2e-spec.ts",
      ],
      env: {
        jest: true
      },
      rules: {
        "linebreak-style": [
          "error",
          "unix"
        ],
        "import/no-extraneous-dependencies": [
          "error",
          {
            "devDependencies": [
              "**/*.test.ts",
              "**/*.test.tsx",
              "**/*.spec.ts",
              "**/*.e2e-spec.ts"
            ]
          }
        ]
      }
    }
  ]
};

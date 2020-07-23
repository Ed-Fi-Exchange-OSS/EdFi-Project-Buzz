// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
const surveyProcessor = require('../processors/surveyProcessor');

module.exports = async (payload, helpers) => {
  const { staffkey, filename, path } = payload;
  helpers.logger.info(`Running the Survey loader for ${staffkey} to load the ${filename} located at ${path}`);
  await surveyProcessor.process(staffkey, filename, path);
};

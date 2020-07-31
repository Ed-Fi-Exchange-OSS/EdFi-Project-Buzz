// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
const surveyProcessor = require('../processors/surveyProcessor');

module.exports = async (payload, helpers) => {
  try {
    const {
      staffkey, title, filename, path, jobkey,
    } = payload;
    helpers.logger.info(
      `Running the Survey loader for ${staffkey} to load '${title}', filename: ${filename}, path: ${path}`,
    );
    await surveyProcessor.process(staffkey, title, filename, path, jobkey);
    helpers.logger.info(`Finished processing task for ${staffkey} ${title} ${filename} ${path}`);
  } catch (error) {
    helpers.logger.error(error);
  }
};

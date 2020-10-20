// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
const odsSurveyProcessor = require('../processors/odsSurveyProcessor');

module.exports = async (payload, helpers) => {
  try {
    const {
      surveyIdentifier, surveyTitle,
    } = payload;
    helpers.logger.info(
      `Running the ODS Survey loader for surveyIdentifier: ${surveyIdentifier} with title '${surveyTitle}'`,
    );
    await odsSurveyProcessor.process(surveyIdentifier);
    helpers.logger.info(`Finished processing task for for surveyIdentifier: ${surveyIdentifier} with title '${surveyTitle}'`);
  } catch (error) {
    helpers.logger.error(error);
  }
};

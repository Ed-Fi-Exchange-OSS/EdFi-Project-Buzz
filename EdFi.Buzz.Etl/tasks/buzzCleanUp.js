// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
const absolutePath = require('path');
const fs = require('fs');

module.exports = async (payload, helpers) => {
  try {
    const {
      staffkey, title, filename, path,
    } = payload;
    const filePath = absolutePath.join(path, filename);
    helpers.logger.info(
      `Running the Survey clean up process for ${staffkey} to delete survey file '${title}', filename: ${filename}, path: ${path}`,
    );
    // delete file
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      // if no error, file has been deleted successfully
      helpers.logger.info(`File ${filePath} deleted.`);
    });
    helpers.logger.info(`Finished processing clean up task for ${staffkey} ${title} ${filename} ${path}`);
  } catch (error) {
    helpers.logger.error(error);
  }
};

// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.



import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { uploadSurvey } from './GraphQL/surveyMutations';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  public readonly SURVEY_MAX_FILE_SIZE: number;

  constructor(private apollo: Apollo, private env: EnvironmentService) {
    this.SURVEY_MAX_FILE_SIZE = this.env.environment.SURVEY_MAX_FILE_SIZE;
  }

  async uploadSurvey(staffKey: number, title: string, content: string) {
    if (content.length > this.SURVEY_MAX_FILE_SIZE) {
      return Promise.reject(`Encoded file size (${ (content.length / 1024.0).toFixed(2) }) must be less than ${ (this.SURVEY_MAX_FILE_SIZE / 1024.0).toFixed(2) } Kb`);
    }
    const client = this.apollo.getClient();
    return client
      .mutate({ mutation: uploadSurvey, variables: { staffkey: staffKey, content: content, title: title  } })
      .then(result =>  result.data.uploadsurvey );
  }
}

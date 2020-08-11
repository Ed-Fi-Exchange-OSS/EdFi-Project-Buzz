// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { uploadSurvey } from './GraphQL/surveyMutations';
import { EnvironmentService } from './environment.service';
import { SurveyStatus, Survey } from '../Models/survey';
import { getSurveyStatus } from './GraphQL/surveyQueries';
import { deleteSurvey } from './GraphQL/surveyMutations';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  public readonly SURVEY_MAX_FILE_SIZE_BYTES: number;
  public readonly JOB_STATUS_FINISH_IDS: number[];

  constructor(private apollo: Apollo, private env: EnvironmentService) {
    this.SURVEY_MAX_FILE_SIZE_BYTES = this.env.environment.SURVEY_MAX_FILE_SIZE_BYTES;
    this.JOB_STATUS_FINISH_IDS = this.env.environment.JOB_STATUS_FINISH_IDS;
  }

  async uploadSurvey(staffKey: number, title: string, content: string, surveykey: number): Promise<SurveyStatus> {
    if (content.length > this.SURVEY_MAX_FILE_SIZE_BYTES) {
      return Promise.reject(`Encoded file size (${(content.length / 1024.0).toFixed(2)}) must be less than ${(this.SURVEY_MAX_FILE_SIZE_BYTES / 1024.0).toFixed(2)} Kb`);
    }
    const client = this.apollo.getClient();
    return client
      .mutate({ mutation: uploadSurvey, variables: { staffkey: staffKey, content: content, title: title, surveykey: surveykey } })
      .then(result => result.data.uploadsurvey);
  }

  async getSurveyStatus(staffKey: number, jobKey: string): Promise<SurveyStatus[]> {
    const client = this.apollo.getClient();
    const { data } = await client.query({ query: getSurveyStatus, variables: { staffKey, jobKey }, fetchPolicy: 'network-only' });
    const surveyStatusList: SurveyStatus[] = data.surveystatus ? data.surveystatus : [];
    surveyStatusList.forEach((el, idx, arr) => {
      if (surveyStatusList) {
        try {
          el.resultSummaryObj = JSON.parse(el.resultsummary).result;
        } catch {}
      }
    });
    return surveyStatusList;
  }

  async deleteSurvey(staffKey: number, surveyKey: number): Promise<Survey> {
    const client = this.apollo.getClient();
    return client.mutate({ mutation: deleteSurvey, variables: { staffkey: staffKey , surveykey: surveyKey } })
      .then(result =>  result.data.deletesurvey);
  }
}
